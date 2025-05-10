# ☠️ [Is This Tech Dead?](https://www.isthistechdead.com) ☠️

Where we monitor tech's vital signs, calculate time of death, and prepare the funeral arrangements.

<p align="center">
  <a href="https://www.isthistechdead.com">Visit the site</a> •
  <a href="#installation">Installation</a> •
  <a href="#features">Features</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## What Is This?

A digital hospice for technologies that were once the darlings of LinkedIn influencers but are now being kept alive by Stack Overflow questions from 2017. We're the WebMD for your tech stack, except our diagnosis is always "it's probably dying."

We track the slow, painful decline of frameworks, languages, and tools that promised to revolutionize your workflow but instead revolutionized your anxiety. Our data-driven approach combines the precision of a coroner with the bedside manner of a Twitter thread.

## Latest Technology Updates (2025-05-10)

[![Flutter: 18](https://img.shields.io/badge/Flutter-18%25-brightgreen?style=flat-square)](https://www.isthistechdead.com/flutter) [![Go: 19](https://img.shields.io/badge/Go-19%25-brightgreen?style=flat-square)](https://www.isthistechdead.com/go) [![Ember.js: 65](https://img.shields.io/badge/Ember.js-65%25-yellow?style=flat-square)](https://www.isthistechdead.com/emberjs) [![react: 13](https://img.shields.io/badge/react-13%25-brightgreen?style=flat-square)](https://www.isthistechdead.com/react) [![Symfony: 37](https://img.shields.io/badge/Symfony-37%25-green?style=flat-square)](https://www.isthistechdead.com/symfony) [![PHP: 26](https://img.shields.io/badge/PHP-26%25-brightgreen?style=flat-square)](https://www.isthistechdead.com/php) [![Firebase: 53](https://img.shields.io/badge/Firebase-53%25-yellow?style=flat-square)](https://www.isthistechdead.com/firebase) [![Svelte: 28](https://img.shields.io/badge/Svelte-28%25-brightgreen?style=flat-square)](https://www.isthistechdead.com/svelte) [![elm: 81](https://img.shields.io/badge/elm-81%25-orange?style=flat-square)](https://www.isthistechdead.com/elm) [![Nuxt.js: 33](https://img.shields.io/badge/Nuxt.js-33%25-green?style=flat-square)](https://www.isthistechdead.com/nuxtjs) 
## Project Components

This monorepo contains two main components:

### 1. 🌐 Frontend (website/)

A Next.js 15 powered obituary service with a responsive UI that works on all devices, except Windows phones (and we're not apologizing for that).

### 2. 🧠 Deaditude Engine (deaditude/)

Our Python-powered analysis brain that ingests data from multiple sources, calculates "deaditude" scores, and determines if your favorite technology is thriving or has one foot in the grave.

Don't trust your tech stack to gut feelings and Medium articles—trust our cold, hard data that's just as judgmental as your tech lead.

## Features

- **Tech Vitality Metrics**: Data-driven analysis using GitHub, StackOverflow, Reddit, Hacker News, YouTube, and job market data
- **Deaditude Scoring System**: Proprietary algorithm that calculates how dead a technology is (spoiler: it's probably deader than you think)
- **Technology Detail Pages**: In-depth analysis for each technology with historical trends and key metrics
- **Project Showcase**: Gallery of projects still using "dead" technologies (aka "the wall of shame")
- **Pay Respects Feature**: Press F to pay respects to dying technologies
- **Responsive Design**: Because even obituaries should look good on mobile

## Installation

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.9+ (for deaditude engine)
- Supabase account (free tier works, but your data might die too)
- API keys for various services (we're data vampires)

### Frontend Setup

```bash
# Navigate to the website directory
cd website

# Install dependencies
npm install

# Set up environment variables
cp scripts/setup-env-instructions.md .env.local
# Edit .env.local with your Supabase credentials

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to view your very own tech funeral parlor.

### Deaditude Engine Setup

```bash
# Navigate to the deaditude directory
cd deaditude

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.sample .env
# Edit .env with your API keys and configuration

# Run a sample analysis
python -m engine.cli analyze react facebook
```

## Project Structure

```
isthistechdead/
├── website/            # Frontend Next.js application
│   ├── app/            # Next.js app router
│   ├── components/     # React components
│   ├── domains/        # Business domains organized by feature
│   └── lib/            # Shared utilities and configuration
│
├── deaditude/          # Analysis engine
│   ├── engine/         # Core analysis modules
│   │   ├── collectors/ # Data collectors for different sources
│   │   └── scoring/    # Analysis and scoring algorithms
│   └── packages/       # Shared functionality
│       └── db/         # Database integration
│
├── .github/            # GitHub Actions workflows
│   └── workflows/      # CI/CD and cron job configurations
│
└── README.md           # You are here (congratulations on reading)
```

## Tech Stack

### Frontend
- **Next.js 15**: Because someone told us server components would fix everything
- **React 19**: For when plain HTML would be too straightforward
- **TypeScript**: So we can feel superior about our error messages
- **Tailwind CSS 4**: For people who hate writing actual CSS
- **Supabase**: Because we're too lazy to build our own backend
- **Framer Motion**: For animations that distract from the existential dread

### Backend
- **Python 3.10+**: A language that refuses to die, ironically
- **Supabase**: Our data overlord
- **GitHub Actions**: For automated disappointment delivery

## Contributing

We welcome contributions from fellow tech necromancers and skeptics! Before contributing, please:

1. Check if your favorite technology is already dead (it probably is)
2. Read our [Contributing Guide](./CONTRIBUTING.md)
3. Remember that all code you write will eventually end up on this site

## License

This project is licensed under the [MIT](./LICENSE). License. Use it, abuse it, but don't blame us when your tech stack dies a slow, painful death.

## Security

If you discover a security vulnerability, please follow our [Security Policy](./SECURITY.md). We take security seriously, unlike the developers of half the technologies we track.

## Acknowledgments

- All contributors who have helped dig these technological graves
- The open-source community for tools we'll eventually declare dead
- Everyone who has shared their tech horror stories
- Everyone who has paid their respects to technologies we've mourned

---

Built with resentment, caffeine, and the tears of developers who bet their careers on the wrong framework. Join us in our digital cemetery—where technologies come to die and developers come to grief.

*Remember: Your tech stack isn't getting old, it's becoming "vintage."*
