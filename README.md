# ☠️ [Is This Tech Dead?](https://www.isthistechdead.com) ☠️

The frontend part of a digital hospice where we monitor technology's vital signs and prepare the funeral arrangements.

<p align="center">
  <a href="https://www.isthistechdead.com">Visit the site</a> •
  <a href="#installation">Installation</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## What Is This?

A Next.js 15 powered obituary service for technology that was once the darling of LinkedIn influencers but is now being kept alive by Stack Overflow questions from 2017.

We track the slow, painful decline of frameworks, languages, and tools that promised to revolutionize your workflow but instead revolutionized your anxiety.

## Features

- **Tech Vitality Metrics**: Data-driven analysis of technology health using GitHub, StackOverflow, Reddit, Hacker News, YouTube, and job market data
- **Deaditude Scoring System**: Proprietary algorithm that calculates how dead a technology is based on multiple factors
- **Technology Detail Pages**: In-depth analysis for each technology with historical trends and key metrics
- **Project Showcase**: Gallery of projects still using "dead" technologies with submission capability
- **Pay Respects Feature**: Interactive system for users to pay their respects to dying technologies
- **Responsive Design**: Mobile-first interface that works across all devices, except windows phones. No we don't care.

## Installation

### Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Supabase account (free tier will work)

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/jobehi/isThisTechDead.git

# Navigate to the project directory
cd isThisTechDead

# Install dependencies
npm install

# Set up environment variables
cp scripts/setup-env-instructions.md .env.local
# Edit .env.local with your Supabase credentials

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests with Vitest
- `npm run storybook` - Run Storybook for component development

## Tech Stack

- **Next.js 15**: App Router, API Routes, Server Components
- **React 19**: The latest React features
- **TypeScript**: For type safety throughout the codebase
- **Tailwind CSS 4**: Utility-first CSS framework
- **Supabase**: Backend as a Service for data storage and auth
- **Framer Motion**: For smooth animations and transitions
- **Storybook 8**: For component development and testing
- **Vitest**: Testing framework

## Architecture

We've embraced a modern, domain-driven design with atomic component architecture:

### Domain-Driven Structure

- `/domains`: Business domains organized by feature
  - Each domain contains its own types, repository, service, and hooks
- `/lib`: Shared utilities, API clients, error handling, and configuration
- `/app`: Next.js app router with API routes and pages

### Component Architecture

- **Atomic Design Pattern**:
  - `/components/atoms`: Basic UI building blocks
  - `/components/molecules`: Simple combinations of atoms
  - `/components/organisms`: Complex UI sections
  - `/components/features`: Domain-specific components
- `/templates`: Page layouts and templates

## Contributing

We welcome contributions from the community! Please see our [Contributing Guide](./CONTRIBUTING.md) for more details on:

- Our development workflow
- Code style and standards
- Pull request process
- Issue reporting

Before contributing, please read our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the [Elastic License 2.0 (Modified)](./LICENSE).

## Security

If you discover a security vulnerability, please follow our [Security Policy](./SECURITY.md).

## Acknowledgments

- All contributors who have helped shape this project
- The open-source community for the tools that make this possible
- Everyone who has shared their tech horror stories
- Everyone who has paid their respects to the technologies we've mourned

---

Built with resentment and caffeine by the "Is This Tech Dead?" team.
