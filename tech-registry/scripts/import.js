#!/usr/bin/env node

/**
 * Tech Registry Importer
 * 
 * This script imports technology entries from the registry into the database.
 * It reads all YAML files, validates them, and then imports them into the
 * database using the Supabase API.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { createClient } = require('@supabase/supabase-js');
const glob = require('glob');
const chalk = require('chalk');
const { program } = require('commander');

// Load environment variables from .env file if present
try {
  require('dotenv').config();
} catch (error) {
  // .env file is optional
}

// Constants
const TECH_REGISTRY_DIR = path.resolve(__dirname, '..');
const TECHNOLOGIES_DIR = path.join(TECH_REGISTRY_DIR, 'technologies');
const CATEGORIES = ['languages', 'frameworks', 'tools', 'platforms'];

// Database configuration from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const TECH_REGISTRY_TABLE = 'tech_registry';

// Parse command line arguments
program
  .option('-d, --dry-run', 'Show what would be imported without making changes', false)
  .option('--update', 'Update existing technologies (default: only insert new ones)', false)
  .parse(process.argv);

const options = program.opts();

/**
 * Load all technology entries from the registry
 */
function loadTechnologies() {
  const technologies = [];
  
  // Check each category directory
  CATEGORIES.forEach(category => {
    const categoryDir = path.join(TECHNOLOGIES_DIR, category);
    
    // Skip if category directory doesn't exist yet
    if (!fs.existsSync(categoryDir)) {
      return;
    }
    
    // Get all YAML files in the category directory
    const files = glob.sync('*.{yaml,yml}', { cwd: categoryDir });
    
    files.forEach(file => {
      const filePath = path.join(categoryDir, file);
      try {
        // Parse the YAML file
        const content = fs.readFileSync(filePath, 'utf8');
        const tech = yaml.load(content);
        
        // Add category information based on directory if missing
        if (!tech.category) {
          tech.category = category.slice(0, -1); // Remove trailing 's'
        }
        
        // Add file path for reporting
        tech._filePath = filePath;
        technologies.push(tech);
      } catch (error) {
        console.error(chalk.red(`Error parsing ${filePath}:`), error.message);
        process.exit(1);
      }
    });
  });
  
  return technologies;
}

/**
 * Import technologies into the database
 */
async function importTechnologies(technologies) {
  // Validate database configuration
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(chalk.red('Error: Supabase URL and key are required.'));
    console.error(chalk.yellow('Set SUPABASE_URL and SUPABASE_KEY environment variables'));
    process.exit(1);
  }
  
  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // Get existing technologies from the database
  const { data: existingTechs, error: fetchError } = await supabase
    .from(TECH_REGISTRY_TABLE)
    .select('id');
  
  if (fetchError) {
    console.error(chalk.red('Error fetching existing technologies:'), fetchError.message);
    process.exit(1);
  }
  
  // Create a set of existing tech IDs for quick lookup
  const existingTechIds = new Set(existingTechs.map(tech => tech.id));
  
  // Categorize technologies as new or existing
  const newTechs = [];
  const updateTechs = [];
  
  technologies.forEach(tech => {
    // Remove only internal properties
    const { _filePath, ...dbTech } = tech;
    
    // Determine if the tech is new or existing
    if (existingTechIds.has(tech.id)) {
      updateTechs.push(dbTech);
    } else {
      newTechs.push(dbTech);
    }
  });
  
  // Show import plan
  console.log(chalk.blue(`Found ${technologies.length} technologies in the registry`));
  console.log(chalk.blue(`- ${newTechs.length} new technologies to add`));
  console.log(chalk.blue(`- ${updateTechs.length} existing technologies to update (${options.update ? 'enabled' : 'disabled'})`));
  
  if (options.dryRun) {
    console.log(chalk.yellow('Dry run mode - no changes will be made'));
    return;
  }
  
  // Insert new technologies
  if (newTechs.length > 0) {
    console.log(chalk.blue(`Inserting ${newTechs.length} new technologies...`));
    
    const { error: insertError } = await supabase
      .from(TECH_REGISTRY_TABLE)
      .insert(newTechs);
    
    if (insertError) {
      console.error(chalk.red('Error inserting new technologies:'), insertError.message);
      process.exit(1);
    }
    
    console.log(chalk.green(`✓ Inserted ${newTechs.length} new technologies`));
  }
  
  // Update existing technologies if requested
  if (updateTechs.length > 0 && options.update) {
    console.log(chalk.blue(`Updating ${updateTechs.length} existing technologies...`));
    
    // Update technologies one by one (since upsert might not work as expected)
    for (const tech of updateTechs) {
      const { error: updateError } = await supabase
        .from(TECH_REGISTRY_TABLE)
        .update(tech)
        .eq('id', tech.id);
      
      if (updateError) {
        console.error(chalk.red(`Error updating technology ${tech.id}:`), updateError.message);
        process.exit(1);
      }
    }
    
    console.log(chalk.green(`✓ Updated ${updateTechs.length} existing technologies`));
  }
}

/**
 * Main function
 */
async function run() {
  console.log(chalk.blue('Importing tech registry entries to database...'));
  
  // Load technologies
  const technologies = loadTechnologies();
  console.log(chalk.green(`✓ Loaded ${technologies.length} technology entries`));
  
  // Import technologies to the database
  await importTechnologies(technologies);
  
  console.log(chalk.green('✓ Import completed successfully!'));
}

// Run the importer
run().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}); 