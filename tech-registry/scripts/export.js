#!/usr/bin/env node

/**
 * Tech Registry Exporter
 * 
 * This script exports technology entries from the database to YAML files.
 * It fetches all technologies from the database, categorizes them, and
 * writes them to appropriate files in the tech registry.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { createClient } = require('@supabase/supabase-js');
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
const TECH_REGISTRY_TABLE = 'tech_registry';

// Category mapping
const CATEGORY_DIRS = {
  language: 'languages',
  framework: 'frameworks',
  tool: 'tools',
  platform: 'platforms',
};

// Parse command line arguments
program
  .option('-d, --dry-run', 'Show what would be exported without creating files', false)
  .option('-o, --overwrite', 'Overwrite existing files (default: skip existing files)', false)
  .parse(process.argv);

const options = program.opts();

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Export technologies to YAML files
 */
async function exportTechnologies() {
  // Validate database configuration
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(chalk.red('Error: Supabase URL and key are required.'));
    console.error(chalk.yellow('Set SUPABASE_URL and SUPABASE_KEY environment variables'));
    process.exit(1);
  }
  
  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // Fetch all technologies from database
  console.log(chalk.blue('Fetching technologies from database...'));
  
  const { data: technologies, error } = await supabase
    .from(TECH_REGISTRY_TABLE)
    .select('*');
  
  if (error) {
    console.error(chalk.red('Error fetching technologies:'), error.message);
    process.exit(1);
  }
  
  console.log(chalk.green(`✓ Fetched ${technologies.length} technologies from database`));
  
  // Create category directories if they don't exist
  if (!options.dryRun) {
    ensureDir(TECHNOLOGIES_DIR);
    
    Object.values(CATEGORY_DIRS).forEach(dir => {
      ensureDir(path.join(TECHNOLOGIES_DIR, dir));
    });
  }
  
  // Track statistics
  const stats = {
    total: technologies.length,
    exported: 0,
    skipped: 0,
    categorized: {
      language: 0,
      framework: 0,
      tool: 0,
      platform: 0,
      unknown: 0,
    },
  };
  
  // Process each technology
  for (const tech of technologies) {
    // Determine category (default to 'tool' if not specified)
    const category = tech.category || 'tool';
    const categoryDir = CATEGORY_DIRS[category] || 'tools';
    
    // Track category statistics
    if (stats.categorized[category] !== undefined) {
      stats.categorized[category]++;
    } else {
      stats.categorized.unknown++;
    }
    
    // Create file path
    const fileName = `${tech.id}.yaml`;
    const filePath = path.join(TECHNOLOGIES_DIR, categoryDir, fileName);
    
    // Check if file already exists
    const fileExists = fs.existsSync(filePath);
    
    if (fileExists && !options.overwrite) {
      console.log(chalk.yellow(`Skipping ${fileName} (already exists)`));
      stats.skipped++;
      continue;
    }
    
    // Create a clean version of the tech object for YAML export
    const { id, name, owner, repo, subreddit, stackshare_slug, 
            created_at, updated_at, creation_year, showcase_url, their_stack_slug,
            category: techCategory, description } = tech;
    
    // Build YAML object with non-null fields
    const yamlObj = {
      id,
      name,
      ...(owner && { owner }),
      ...(repo && { repo }),
      ...(subreddit && { subreddit }),
      ...(stackshare_slug && { stackshare_slug }),
      ...(creation_year && { creation_year }),
      ...(showcase_url && { showcase_url }),
      ...(their_stack_slug && { their_stack_slug }),
      ...(techCategory && { category: techCategory }),
      ...(description && { description }),
    };
    
    // Convert to YAML
    const yamlContent = yaml.dump(yamlObj, {
      indent: 2,
      lineWidth: 100,
      quotingType: '"',
    });
    
    if (options.dryRun) {
      console.log(chalk.blue(`Would write to ${filePath}:`));
      console.log(yamlContent);
    } else {
      // Write to file
      try {
        fs.writeFileSync(filePath, yamlContent, 'utf8');
        console.log(chalk.green(`✓ Exported ${fileName}`));
        stats.exported++;
      } catch (error) {
        console.error(chalk.red(`Error writing ${fileName}:`), error.message);
      }
    }
  }
  
  // Report statistics
  console.log(chalk.blue('\nExport Statistics:'));
  console.log(chalk.blue(`- Total technologies: ${stats.total}`));
  console.log(chalk.green(`- Exported: ${stats.exported}`));
  console.log(chalk.yellow(`- Skipped: ${stats.skipped}`));
  console.log(chalk.blue('- Categories:'));
  
  Object.entries(stats.categorized).forEach(([category, count]) => {
    if (count > 0) {
      console.log(chalk.blue(`  - ${category}: ${count}`));
    }
  });
  
  if (options.dryRun) {
    console.log(chalk.yellow('\nDry run mode - no files were created'));
  } else {
    console.log(chalk.green('\n✓ Export completed successfully!'));
  }
}

/**
 * Main function
 */
async function run() {
  console.log(chalk.blue('Exporting technologies from database to YAML files...'));
  
  // Export technologies
  await exportTechnologies();
}

// Run the exporter
run().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}); 