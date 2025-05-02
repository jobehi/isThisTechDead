# Pre-commit Hooks

This project uses Husky and lint-staged to run code quality checks before each commit.

## What gets checked

When you attempt to commit changes, the following checks run automatically:

1. **ESLint** - Checks JavaScript and TypeScript files for linting errors and fixes them when possible
2. **Prettier** - Formats all code according to project standards
3. **TypeScript Type Check** - Ensures type safety by running the TypeScript compiler

## How it works

- **Husky**: Sets up Git hooks that trigger before commits
- **lint-staged**: Runs linters only on the files you're committing, not the entire codebase

## Skipping checks (use sparingly)

If you need to bypass the checks in an emergency:

```bash
git commit -m "Your message" --no-verify
```

Use this sparingly as it defeats the purpose of having checks.

## Manual checks

You can run these checks manually:

- `npm run lint` - Run ESLint on the codebase
- `npm run format` - Run Prettier to format the codebase
- `npm run format:check` - Check formatting without making changes
- `npm run type-check` - Run TypeScript type checking
