/**
 * lint-staged configuration
 * This runs linting and formatting checks on staged files before committing
 */
module.exports = {
  // Run eslint on JavaScript and TypeScript files
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Run prettier on CSS, JSON, and MD files
  '**/*.{css,json,md}': ['prettier --write'],

  // Run type checking on TypeScript files
  '**/*.{ts,tsx}': () => 'npm run type-check',
};
