# 🌐 Is This Tech Dead? - Frontend

Welcome to the frontend of our digital mausoleum, where we give technologies the obituaries they deserve.

## What's In Here?

This is the Next.js 15 frontend for [Is This Tech Dead?](https://www.isthistechdead.com) - the digital hospice for dying technologies. We've built a responsive, modern UI that showcases our coldly calculated "deaditude" scores with the perfect blend of data visualization and morbid humor.

## Getting Started

### Prerequisites

- Node.js 18+ (anything older is probably on our site as "dead")
- npm 8+ (or yarn, if you're into that sort of thing)
- A Supabase account (where we store all the digital death certificates)
- A sense of humor about your tech stack choices

### Installation

```bash
# Install dependencies (and approximately 37,429 transitive dependencies)
npm install

# Set up environment variables
cp scripts/setup-env-instructions.md .env.local
# Edit .env.local with your Supabase credentials

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to view your very own tech graveyard.

### Available Scripts

- `npm run dev` - Start the development server with hot-reloading (so you can watch your code die and be reborn)
- `npm run build` - Build the application for production (to show the world how dead their tech is)
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality (and judge your life choices)
- `npm run format` - Format code with Prettier (because we may be mean to technologies, but our code should look nice)
- `npm run test` - Run tests with Vitest (to make sure our death predictions are accurate)
- `npm run storybook` - Run Storybook for component development

## Architecture

We've embraced a modern, domain-driven design with atomic component architecture because we like our code organized like a well-run funeral home:

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

## Key Features

- **Technology Cards**: Visually striking cards showing at-a-glance health metrics
- **Interactive Graphs**: Trend analysis with pretty charts (to visualize the decline)
- **Detail Pages**: Deep dives into technology vitals with historical context
- **Search**: Find out if your favorite tech is on life support
- **Dark Mode**: Because reading obituaries in light mode is just wrong

## Tech Stack

- **Next.js 15**: App Router, API Routes, Server Components (we went all in)
- **React 19**: For when vanilla JS would be too straightforward
- **TypeScript**: Because we like to pretend our code won't have runtime errors
- **Tailwind CSS**: For developers who hate writing CSS but love writing HTML that looks like CSS
- **Supabase**: Our database of choice for storing tech death records
- **Framer Motion**: For smooth animations that distract from the existential dread
- **Storybook**: For component development (and showing off our UI to people who don't care)

## Working with the Backend

This frontend connects to our Python-powered **Deaditude Engine** which lives in the `/deaditude` directory of the monorepo. The engine calculates technology health scores and provides the data that powers our visualizations.

You'll need both parts running if you want the full experience, but the frontend can run in isolation with cached/mock data.

## Conventions

- Fetch data in React Server Components when possible
- Use client components only when you need interactivity (be stingy)
- Follow the domain-driven design pattern for new features
- Keep components small and focused (like our attention spans)
- Write tests for critical paths (or at least pretend you will)

---

Built with equal parts love and cynicism. If you find yourself getting attached to any technology while working on this project, please seek help immediately.
