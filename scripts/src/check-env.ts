#!/usr/bin/env node
/**
 * Environment Variables Checker
 *
 * This script checks for required environment variables and warns if they're missing.
 * It's designed to be run during development to help catch configuration issues early.
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load .env files
const rootDir = path.resolve(__dirname, '../..');
dotenv.config({ path: path.resolve(rootDir, '.env') });
const envLocalPath = path.resolve(rootDir, '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

// Define required variables
const REQUIRED_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

// Define recommended variables
const RECOMMENDED_VARS = [
  'SITE_URL',
  'REVALIDATION_SECRET',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
];

console.log(chalk.blue('\n=== Environment Variables Check ===\n'));

// Check required variables
const missingRequired = REQUIRED_VARS.filter(v => !process.env[v]);
if (missingRequired.length === 0) {
  console.log(chalk.green('✅ All required environment variables are set.'));
} else {
  console.log(chalk.red('❌ Missing required environment variables:'));
  missingRequired.forEach(v => {
    console.log(chalk.red(`   - ${v}`));
  });
  console.log(
    chalk.yellow('\nThe application may not function correctly without these variables.')
  );
  console.log(
    chalk.yellow('Please check scripts/setup-env-instructions.md for setup instructions.')
  );
}

// Check recommended variables
const missingRecommended = RECOMMENDED_VARS.filter(v => !process.env[v]);
if (missingRecommended.length > 0) {
  console.log(chalk.yellow('\n⚠️  Missing recommended environment variables:'));
  missingRecommended.forEach(v => {
    console.log(chalk.yellow(`   - ${v}`));
  });
  console.log(chalk.gray('\nThese variables are not required but enable additional features.'));
}

console.log(chalk.blue('\n=============================\n'));

// Exit with error code if required variables are missing
if (missingRequired.length > 0) {
  process.exit(1);
}
