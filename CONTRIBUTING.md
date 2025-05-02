# Contributing to "Is This Tech Dead?"

Welcome to our digital hospice for dying technologies. While we mourn with humor, we code with precision.

## Getting Started

1. **Fork the repository**
2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/isThisTechDead.git
   cd isThisTechDead
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment variables**
   ```bash
   cp scripts/setup-env-instructions.md .env.local
   # Edit .env.local with your Supabase credentials
   ```
5. **Create a branch** with a descriptive name like `feature/trend-analytics` or `fix/chart-display`
6. **Make your changes** and test thoroughly
7. **Commit your changes** using conventional commits
8. **Push your changes** to your fork
9. **Submit a pull request** for review

## Git Workflow in Detail

For those new to this contribution model, here's a more detailed explanation:

### Forking and Remote Setup

1. **Fork the Repository**: Click the "Fork" button at the top-right of the [repository page](https://github.com/jobehi/isThisTechDead).

2. **Clone Your Fork**: This creates a local copy of your fork on your machine.

   ```bash
   git clone https://github.com/YOUR_USERNAME/isThisTechDead.git
   cd isThisTechDead
   ```

3. **Add Upstream Remote**: This connects your local repo to the original project repository.

   ```bash
   git remote add upstream https://github.com/jobehi/isThisTechDead.git
   ```

4. **Verify Remotes**: Confirm your setup (you should see both origin and upstream).
   ```bash
   git remote -v
   ```

### Keeping Your Fork Updated

To avoid "your tech stack is 3 versions behind" syndrome:

1. **Fetch Upstream Changes**: Download the latest from the original repository.

   ```bash
   git fetch upstream
   ```

2. **Update Your Main Branch**: Keep your main branch in sync with upstream.

   ```bash
   git checkout main
   git merge upstream/main
   ```

3. **Update Your Fork on GitHub**: Push the updated main to your fork.
   ```bash
   git push origin main
   ```

### Working on Features

1. **Create a Feature Branch**: Always branch from an up-to-date main.

   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Keep Your Feature Branch Updated**: If development takes a while.

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

3. **Push Your Changes**: Send your work to your fork.

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**: Go to the original repository on GitHub and click "New Pull Request". Select "compare across forks", choose your fork and branch, then submit the PR.

If GitHub tells you "this branch is X commits behind," you'll need to update your branch before it can be merged.

## Our Dark Design Patterns (A.K.A. Development Standards)

### Code Style

- **Formatting**: We use Prettier - resistance is futile
- **TypeScript**: Required for all new code, type `any` is considered a moral failing
- **Comments**: Clear, concise, and occasionally morbid
- **ESLint**: Our configuration must be obeyed

### Commit Messages

We follow conventional commits format with a hint of tech nihilism:

```
feat(deaditude): implement decay-rate algorithm

Adds a more accurate calculation for how quickly hope fades
when using legacy frameworks.
```

### What We're Looking For

1. **New Metrics**: Novel ways to measure tech decay and digital rot
2. **UI Improvements**: Beautiful visualizations of technological despair
3. **Performance Optimization**: Because even funeral services should be snappy
4. **Bug Fixes**: Ensuring our obituaries are accurate and our metrics precise
5. **Documentation**: Help others understand our monument to dying technologies

## The Review Process

Our review process is both thorough and occasionally emotionally detached:

1. Code reviews focus on quality, performance, and maintainability
2. All feedback is actionable and specific
3. We prioritize robust architecture over quick fixes
4. Tests are required for all new features even if there are none now

## Project Governance

This project is loosely guided by [jobehi](https://github.com/jobehi), who reluctantly accepted the role of BDFL (Benevolent Dictator For Life).

He's just a regular developer who happens to enjoy documenting the lifecycle of technologies with the same enthusiasm most people reserve for watching plants grow. Don't let the BDFL title fool you, it's just a fancy way of saying "the person who has to fix things when they break at 2 AM."

Pull requests are reviewed based on technical merit, not how much you flatter the codebase. jobehi promises to be fair, reasonable, and only slightly judgmental about your variable naming choices.

## Domain Structure

This project follows Domain-Driven Design with a clear separation of concerns:

### Domains

Each domain has its own:

- **Types**: Domain models and interfaces
- **Repository**: Data access layer
- **Service**: Business logic
- **Hooks**: React hooks for components

Current domains:

- **Tech**: Technology metrics, scores, and snapshots
- **Project**: Projects using technologies on life support
- **Respect**: Digital flowers for the technologically departed

### Component Architecture

We follow the Atomic Design pattern:

- **Atoms**: Basic UI building blocks
- **Molecules**: Simple combinations of atoms
- **Organisms**: Complex UI sections
- **Features**: Domain-specific components

### Adding New Features

1. Determine which domain your feature belongs to
2. If creating a new domain, follow the established structure:
   ```
   domains/new-domain/
     ├── new-domain.types.ts
     ├── new-domain.repository.ts
     ├── new-domain.service.ts
     ├── new-domain.hooks.ts
     └── index.ts
   ```
3. Create UI components following the Atomic Design pattern
4. Make sure to update appropriate tests

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode during development
npm run test:watch
```

## Project Environment

For environment configuration details, see `scripts/setup-env-instructions.md`.

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md). We maintain a respectfully sarcastic environment for all contributors.

---

Remember: Building an obituary service for tech may be morbid, but our code quality should be very much alive.
