# Deaditude Engine

The comprehensive analysis engine behind the "Is This Tech Dead?" project. This system collects, processes, and analyzes data from various sources to determine the health and vitality of technologies in the software ecosystem.

## 🔍 Overview

Deaditude Engine is a data collection and analysis CLI that evaluates technologies based on multiple metrics:

- GitHub activity and engagement
- Stack Overflow question patterns
- Reddit discussions and sentiment
- Hacker News mentions
- YouTube content analysis
- Job market demand (thanks to Adzuna and Google)
- Company adoption (via StackShare, showcases, TheirStack)

The engine calculates a "deaditude score" that indicates how alive or dead a technology appears to be, with supporting data to explain the verdict.

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- pip
- API keys for various services (GitHub, Reddit, YouTube, etc.)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jobehi/isThisTechDead.git
cd deaditude
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on the provided `.env.example`:

```bash
# Create and edit your .env file with appropriate values
cp .env.example .env
```

## ⚙️ Configuration

The application uses environment variables for configuration. Key variables include:

- Database credentials (Supabase)
- API keys for data sources
- Collection parameters (time windows, limits)
- Runtime configuration

See the `.env.sample` file for a complete list of configurable options with descriptions.

## 📊 Running the Analysis

### Single Technology Analysis

To analyze a specific technology:

```bash
python -m engine.cli analyze react facebook
```

Where:
- `react` is the technology name
- `facebook` is the GitHub repository owner (optional)

### Batch Analysis

To process multiple technologies:

```bash
python -m engine.cli batch
```

This will analyze technologies from the supabase tech registry based on when they were last checked.

### Scheduled Runs

For production environments, set up a recurring job to keep data fresh:

```bash
# Example cron job (runs daily at 2 AM)
0 2 * * * cd /path/to/deaditude && python -m engine.cli batch --limit 20
```

## 🏗️ Architecture

The project is organized into several key components:

```
deaditude/
├── engine/              # Core analysis engine
│   ├── collectors/      # Data collection modules for each source
│   └── scoring/         # Analysis and scoring algorithms
├── packages/            # Shared functionality
│   └── db/              # Database integration (Supabase)
├── scripts/             # Utility scripts
└── sql_migrations/      # Database schema and migrations
```

### Data Flow

1. **Collection**: Data is gathered from multiple sources via API integrations
2. **Analysis**: Raw data is processed and normalized
3. **Scoring**: Various metrics are weighted and combined into an overall score
4. **Storage**: Results are persisted to Supabase for frontend consumption
5. **Revalidation**: The frontend is notified to update when data changes. This is because the frontend is a static site using ISR with Next.js.

## 🛠️ Modules

### Collectors

Each collector module is responsible for gathering data from a specific source:

- `github.py` - Repository stats, commit activity, contributors
- `stackoverflow.py` - Question frequency, answer rates, engagement metrics
- `reddit.py` - Discussion volume, sentiment analysis, community engagement
- `hn.py` - Hacker News mentions, points, and comment volume
- `youtube.py` - Video content, view counts, publication trends
- `jobs.py` - Job market data from Google and Adzuna
- `companies.py` - Company adoption metrics

### Database Layer

The `packages/db` module handles:

- Storing analysis results
- Managing the technology registry
- Snapshot history for trend analysis
- API revalidation

## 🔧 Troubleshooting

Common issues and their solutions:

1. **Rate limiting**: Most APIs have strict rate limits. Strategies:
   - Use authenticated requests wherever possible
   - Implement backoff and retry logic
   - Consider batching requests

2. **Missing or invalid API keys**: Verify your `.env` file contains the correct credentials for each service.

3. **No data for specific sources**: Some technologies may not have presence on all platforms. The scoring system accounts for missing data sources.

4. **Supabase connection issues**: Verify your Supabase URL and key. Check that your IP is allowed if using IP restrictions.

5. **Performance issues**: For large datasets, consider:
   - Increasing `MAX_BATCH_SIZE` for parallel processing
   - Setting tighter time windows (`*_WINDOW_DAYS`)
   - Limiting result counts (`*_MAX_*` variables)

## 🤝 Contributing

Contributions to improve the engine are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-enhancement`)
3. Make your changes
4. Add tests for new functionality (Even if currently it's a YOLO)
5. Submit a pull request

## 📝 License

See the LICENSE file for details.

## 🙏 Acknowledgments

- This project relies on various public APIs and data sources
- Built with Python, Supabase, and Next.js (frontend)
- Special thanks to all and data providers 