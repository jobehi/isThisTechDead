# Tech Registry

This directory contains the collaborative registry of technologies tracked by the "Is This Tech Dead?" project.

## Overview

The tech registry is a collection of YAML files that define technology entries to be analyzed. Each technology entry must conform to the schema defined in `schema.yaml`.

## Directory Structure

```
tech-registry/
├── README.md           # This file
├── schema.yaml         # Schema definition for technology entries
├── scripts/            # Validation and utility scripts
└── technologies/       # Technology definitions organized by category
    ├── languages/      # Programming languages
    ├── frameworks/     # Software frameworks
    ├── tools/          # Developer tools
    └── platforms/      # Platforms and ecosystems
```

## Adding a New Technology

To add a new technology to the registry:

1. Determine the appropriate category (language, framework, tool, or platform)
2. Create a new YAML file in the corresponding directory with a filename that matches the technology ID
3. Fill in the required fields based on `schema.yaml`
4. Run the validation script to ensure your entry is valid
5. Create a pull request with your changes

## Example Entry

Here's an example of a valid technology entry (`technologies/languages/javascript.yaml`):

```yaml
id: javascript
name: JavaScript
description: A lightweight, interpreted programming language with first-class functions
category: language
creation_year: 1995
owner: tc39
repo: ecma262
subreddit: javascript
stackshare_slug: javascript
```

## Required Fields

The following fields are required for all technology entries:

- `id`: Unique identifier (lowercase, hyphenated)
- `name`: Display name of the technology
- `category`: One of: language, framework, tool, or platform

## Validation

You can validate your technology entry by running:

```bash
cd tech-registry
npm run validate
```

## Guidelines

When adding a new technology:

1. Verify that the technology doesn't already exist in the registry
2. Use a consistent ID format (lowercase with hyphens for spaces)
3. Provide as much information as possible to improve data quality
4. Follow the established category conventions
5. Include a brief but informative description

## Data Sources

The technology entries are used to collect data from various sources:

- GitHub repository statistics
- Stack Overflow questions
- Reddit discussions
- YouTube videos
- Job postings
- StackShare adoption metrics
- And more

The more accurate your entry details, the better the analysis will be.

## Contribution Workflow

1. Fork the repository
2. Add your technology entry
3. Validate it using the validation script
4. Create a pull request
5. Wait for review and approval

Thank you for contributing to the tech registry! 