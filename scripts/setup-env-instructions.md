# Environment Variables Setup

This project requires several environment variables to function properly. Create a `.env` file in the root directory with the following variables:

```
# API Configuration
NEXT_PUBLIC_API_URL=/api

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration, should be alive when building to generate OG images
SITE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_PROJECT_SUBMISSION=true
NEXT_PUBLIC_ENABLE_PRESS_F=true

# Revalidation url for ISR revalidation
REVALIDATION_SECRET=your-revalidation-secret-key

# ButtonDown API Key for newsletter signup
NEXT_PUBLIC_BUTTONDOWN_API_KEY=your-buttondown-api-key

# Recaptcha site key for project submission form
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Node environment
NODE_ENV=development

```

## Required Variables

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key

## Optional Variables

- **SITE_URL**: The URL of your site (defaults to http://localhost:3000 in development) : Required for building OG images
- **NEXT_PUBLIC_ENABLE_PROJECT_SUBMISSION**: Enable project submission form true by default
- **NEXT_PUBLIC_ENABLE_PRESS_F**: Enable the "Press F to Pay Respects" feature true by default
- **REVALIDATION_SECRET**: Secret key for revalidating pages via API : required for ISR revalidation

