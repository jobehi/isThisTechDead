# Scripts for Is This Tech Dead

This directory contains utility scripts for the "Is This Tech Dead" project, implemented in TypeScript.

## Scripts

- `src/generate-og-images.ts`: Generates static OG images for all technologies by calling the `/api/og` API route

## Running the OG Image Generator

The OG image generator runs automatically during the build process:

```bash
npm run prebuild
```

Or run directly using ts-node:

```bash
npx ts-node --project tsconfig.scripts.json scripts/src/generate-og-images.ts
```

## How It Works

1. The script uses the shared utilities from `lib/shared`
2. It fetches all technologies from the database
3. For each technology, it:
   - Gets the technology details and latest deaditude score
   - Uses the `ImageService` to generate OG images
   - Images are saved to `/public/og-images/`
4. Images are named consistently using the shared `formatTechFilename` utility

## Environment Variables

The scripts require the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SITE_URL=https://yourdomain.com  # Optional: defaults to http://localhost:3000 : it should be alive when building to generate OG images
```

## Troubleshooting

When using the default `SITE_URL` (localhost), you need to have a NextJS development server running:

```bash
npm run dev
```
