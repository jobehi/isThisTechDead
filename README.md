# ☠️ Is This Tech Dead? ☠️

The frontend part of the digital hospice where we monitor tech's vital signs and prepare the funeral arrangements.

## What The Hell Is This?

A Next.js 15 powered obituary service for technology that was once the darling of LinkedIn influencers but is now being kept alive by Stack Overflow questions from 2017.

We track the slow, painful decline of frameworks, languages, and tools that promised to revolutionize your workflow but instead revolutionized your anxiety.

## Features

- **Tech Death Certificates**: Scientifically\* accurate assessments of whether that shiny framework is actually a rotting corpse
- **Trend Tombstones**: Visual representations of adoption rates plummeting like your hopes and dreams
- **Framework Funerals**: Detailed case studies of tech that died before its time (or long after it should have)
- **Memorial Wall**: Pay respects to the tools that once paid your bills
- **Rate-Limited Respect System**: Users can pay respects up to 10 times per day per tech (we have feelings, but let's not get carried away)

## Getting Started

### Prerequisites

- Node.js (whatever version works this week)
- A sense of impending doom
- At least 3 abandoned side projects using different frameworks
- Supabase account (free tier will work)

### Installation

```bash
# Clone the digital graveyard
git clone https://github.com/jobehi/is-this-tech-dead-front.git

# Navigate into the abyss
cd is-this-tech-dead-front

# Install dependencies and existential dread
npm install

# Set up environment variables (CRITICAL STEP)
cp scripts/setup-env-instructions.md .env
# Edit .env with your Supabase credentials

# Start the development server and your journey into tech nihilism
npm run dev
```

Visit `http://localhost:3000` to begin your descent.

## Tech Stack

- **Next.js 15**: Because we needed something that'll be dead in 2 years
- **React 19**: Hooks all the way down until it's turtles
- **Tailwind**: For when you want your CSS in your HTML like it's 2002 again
- **TypeScript**: Pretending errors happen at compile time instead of in your career choices
- **Supabase**: Because Firebase was too mainstream to mock

## Architecture

We've embraced a modern, domain-driven design with atomic component architecture:

### Domain-Driven Structure

- `/domains`: Business domains organized by feature (tech, project, respect)
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

### Modern Practices

- **Type Safety**: Comprehensive TypeScript types throughout the codebase
- **Error Handling**: Centralized error classes with proper handling
- **API Client**: Robust API client with interceptors and retry logic
- **Server Components**: Leveraging Next.js server components for optimal loading
- **Hooks**: Custom React hooks for all data fetching and state management

## Contributing

We accept pull requests from the cynical, the jaded, and the emotionally exhausted only. If you've never silently screamed while reading release notes, this isn't for you.

1. Fork the repo (it won't help your career)
2. Create your feature branch (`git checkout -b feature/AnotherDeadTech`)
3. Commit your changes (`git commit -m 'Added Angular.js to the memorial wall'`)
4. Push to the branch (`git push origin feature/AnotherDeadTech`)
5. Open a Pull Request and wait for us to judge your life choices

## License

See the [LICENSE](./LICENCE) file for the full legal text that nobody reads.

## Acknowledgments

- Every abandoned GitHub repo with its last commit in 2019
- The "JS framework of the week" newsletter that ruined your ability to commit
- Your therapist who has to hear about "breaking changes" every session

---

Built with resentment and caffeine.

Remember: Today's hot framework is tomorrow's tech debt. Choose wisely, let it die anyway.
