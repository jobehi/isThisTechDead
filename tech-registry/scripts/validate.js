#!/usr/bin/env node

/**
 * Tech Registry Validator
 * 
 * This script validates all technology entries in the registry against the schema.
 * It checks for duplicates, ensures required fields are present, and validates
 * the structure of each entry.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const chalk = require('chalk');
const glob = require('glob');

// Constants
const TECH_REGISTRY_DIR = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(TECH_REGISTRY_DIR, 'schema.yaml');
const TECHNOLOGIES_DIR = path.join(TECH_REGISTRY_DIR, 'technologies');
const CATEGORIES = ['languages', 'frameworks', 'tools', 'platforms'];

// Initialize validation
const ajv = new Ajv({ allErrors: true });

/**
 * Load and parse the schema
 */
function loadSchema() {
  try {
    const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
    return yaml.load(schemaContent);
  } catch (error) {
    console.error(chalk.red('Error loading schema:'), error.message);
    process.exit(1);
  }
}

/**
 * Load all technology entries from the registry
 */
function loadTechnologies() {
  const technologies = [];
  const idMap = new Map();
  const nameMap = new Map();
  let hasErrors = false;

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
        
        // Add category information based on directory
        tech.category = tech.category || category.slice(0, -1); // Remove trailing 's'
        
        // Check for duplicate IDs
        if (idMap.has(tech.id)) {
          console.error(chalk.red(`Duplicate tech ID: ${tech.id}`));
          console.error(chalk.red(`  - ${filePath}`));
          console.error(chalk.red(`  - ${idMap.get(tech.id)}`));
          hasErrors = true;
        } else {
          idMap.set(tech.id, filePath);
        }
        
        // Check for duplicate names
        if (nameMap.has(tech.name)) {
          console.error(chalk.yellow(`Warning: Duplicate tech name: ${tech.name}`));
          console.error(chalk.yellow(`  - ${filePath}`));
          console.error(chalk.yellow(`  - ${nameMap.get(tech.name)}`));
        } else {
          nameMap.set(tech.name, filePath);
        }
        
        // Add file path for error reporting
        tech._filePath = filePath;
        technologies.push(tech);
      } catch (error) {
        console.error(chalk.red(`Error parsing ${filePath}:`), error.message);
        hasErrors = true;
      }
    });
  });
  
  if (hasErrors) {
    process.exit(1);
  }
  
  return technologies;
}

/**
 * Validate technologies against the schema
 */
function validateTechnologies(schema, technologies) {
  const validate = ajv.compile(schema);
  let hasErrors = false;
  
  technologies.forEach(tech => {
    const isValid = validate(tech);
    
    if (!isValid) {
      console.error(chalk.red(`Validation failed for ${tech._filePath}:`));
      validate.errors.forEach(error => {
        console.error(chalk.red(`  - ${error.instancePath || 'root'}: ${error.message}`));
      });
      hasErrors = true;
    }
    
    // Check if filename matches tech ID
    const filename = path.basename(tech._filePath, path.extname(tech._filePath));
    if (filename !== tech.id) {
      console.error(chalk.yellow(`Warning: Filename doesn't match tech ID in ${tech._filePath}`));
      console.error(chalk.yellow(`  - Filename: ${filename}`));
      console.error(chalk.yellow(`  - Tech ID: ${tech.id}`));
    }
  });
  
  return !hasErrors;
}

/**
 * Main validation function
 */
function run() {
  console.log(chalk.blue('Validating tech registry entries...'));
  
  // Load schema
  const schema = loadSchema();
  console.log(chalk.green(`✓ Loaded schema from ${SCHEMA_PATH}`));
  
  // Load technologies
  const technologies = loadTechnologies();
  console.log(chalk.green(`✓ Loaded ${technologies.length} technology entries`));
  
  // Validate technologies
  const isValid = validateTechnologies(schema, technologies);
  
  if (isValid) {
    console.log(chalk.green('✓ All technology entries are valid!'));
    process.exit(0);
  } else {
    console.error(chalk.red('✗ Validation failed. Please fix the errors above.'));
    process.exit(1);
  }
}

// Run the validation
run(); 