# Contributing to "Is This Tech Dead?"

Welcome to the "Is This Tech Dead?" project. While our website maintains a humorous take on technology trends, we approach our development process with professionalism.

## Getting Started

1. **Fork the repository**
2. **Create a branch from `main`** with a descriptive name like `feature/trend-analytics` or `fix/chart-display`
3. **Commit your changes** with clear, descriptive messages
4. **Push your changes** to your fork
5. **Submit a pull request** for review

## Development Standards

### Code Style

- We use Prettier for consistent formatting
- TypeScript is required for all new code
- Comments should be clear, concise, and helpful for future developers
- Our ESLint configuration should be followed

### Commit Messages

We follow conventional commits format:

```
feat(component): add new tech trend visualization

Implements a time-series chart showing GitHub activity metrics
for trending technologies.
```

### What We're Looking For

1. **New Features**: Well-implemented additions that enhance the site
2. **UI Improvements**: Clean, responsive, and accessible interface enhancements
3. **Performance Optimization**: Speed and efficiency improvements
4. **Bug Fixes**: Resolving issues in existing functionality
5. **Documentation**: Clear explanations of code and processes

## The Review Process

Our code review process aims to be thorough, constructive, and respectful:

1. Code reviews focus on quality and maintainability
2. Feedback will be specific and actionable
3. We prioritize good architecture over quick fixes

## Getting Help

If you need assistance:

1. Review the documentation in the codebase
2. Check existing issues for similar questions
3. Open a new issue with a clear, specific question if needed

## Recognition

Contributors are credited in our project, and significant contributions will be highlighted in release notes.

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing. We maintain a respectful, inclusive environment for all contributors.

## Project Architecture

This project follows a Domain-Driven Design (DDD) approach with clear separation of concerns:

### Domains

We organize our code around business domains, each with its own:

- **Types**: Domain models and interfaces
- **Repository**: Data access layer
- **Service**: Business logic
- **Hooks**: React hooks for components if needed

Current domains:

- **Tech**: Technology-related functionality
- **Project**: Project submission and display
- **Respect**: User interactions to pay respects to dead technologies

### Component Architecture

We follow the Atomic Design pattern:

- **Atoms**: Basic UI building blocks
- **Molecules**: Simple combinations of atoms
- **Organisms**: Complex UI sections
- **Features**: Domain-specific components

### Adding New Features

1. Determine which domain your feature belongs to
2. If it's a new domain, create the proper structure:
   ```
   domains/new-domain/
     ├── new-domain.types.ts
     ├── new-domain.repository.ts
     ├── new-domain.service.ts
     ├── new-domain.hooks.ts
     └── index.ts
   ```
3. Create UI components following the Atomic Design pattern
4. Add any necessary API routes in the appropriate location

Refer to the environment setup documentation in `scripts/setup-env-instructions.md` for configuration details.
