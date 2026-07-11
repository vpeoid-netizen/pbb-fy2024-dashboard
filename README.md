# Partido State University FY 2024 PBB Document Submission and Monitoring Dashboard

Centralized, multi-user web application for monitoring FY 2024 Performance-Based Bonus documentary requirements for Partido State University.

> **Important:** This application uses public collaborative editing. Anyone with access to the deployed URL may update submission statuses and remarks. Authentication and role-based access control are not included in this version.

## Overview

This dashboard provides a single source of truth for monitoring PBB documentary submissions across offices and devices. It does **not** upload or store documentary files. External Google Drive folders remain the actual submission destinations.

The Neon PostgreSQL database stores only monitoring metadata:

- Submission status (submitted/pending)
- Shared remarks
- Updater name or office
- Submission and update timestamps
- Eligibility-assessment inputs
- Accountability assessments
- Audit history

## Key Features

- 18 official FY 2024 PBB submission requirements with Google Drive folder links
- Centralized progress tracking with live multi-browser synchronization (5-second polling)
- Shared remarks with debounced autosave
- Optimistic concurrency using version fields
- Audit log and per-requirement update history
- Indicative FY 2024 PBB eligibility self-rating calculator (100-point scale)
- Agency accountabilities compliance review checklist
- JSON/CSV export and printable consolidated report
- Responsive glassmorphism UI with dark mode
- No application login required

## Architecture

```text
Browser (SWR polling every 5s)
    ↓
Next.js App Router API Routes
    ↓
Neon PostgreSQL (single source of truth)
```

External Google Drive folders are linked but not integrated as the primary UI.

## Technology Stack

- Next.js (App Router)
- TypeScript (strict)
- React
- Tailwind CSS
- shadcn/ui-style Radix primitives
- Lucide React icons
- Neon PostgreSQL via `@neondatabase/serverless`
- Zod validation
- SWR for synchronization
- date-fns / date-fns-tz
- Vitest for unit tests

## Installation

```bash
npm install
```

## Neon Setup

1. Create a project at [Neon](https://neon.tech).
2. Create a PostgreSQL database.
3. Copy the connection string.

## Environment Variables

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Set:

```env
DATABASE_URL=postgresql://...
```

Never expose `DATABASE_URL` to client-side code. Do not use `NEXT_PUBLIC_DATABASE_URL`.

## Database Migration

```bash
npm run db:migrate
```

## Database Seeding

```bash
npm run db:seed
```

The seed script:

- Inserts or updates all 18 official requirements
- Preserves existing submitted statuses and remarks
- Creates missing monitoring rows
- Seeds eligibility and accountability records safely using `ON CONFLICT`

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run lint
npm run build
npm start
```

## Testing

```bash
npm test
```

Unit tests cover completion percentage, eligibility ratings, PBB rate calculations, isolation-risk detection, and validation rules.

## GitHub Workflow

1. Initialize git in the project directory if needed.
2. Commit the application source code.
3. Push to GitHub.
4. Keep `.env.local` out of version control.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Select the **Next.js** framework preset.
4. Add `DATABASE_URL` to Vercel Environment Variables for Production, Preview, and Development as appropriate.
5. Deploy the application.
6. Run migration and seed against the production Neon database:

   ```bash
   DATABASE_URL="your-production-url" npm run db:migrate
   DATABASE_URL="your-production-url" npm run db:seed
   ```

7. Open the deployed site and verify database connectivity.
8. Test centralized synchronization in two separate browsers.

No Google API credentials are required for the dashboard itself.

## Updating Folder Links

Edit `data/pbbRequirements.ts`, then run:

```bash
npm run db:seed
```

This updates folder URLs without resetting monitoring data.

## Adding or Removing Requirements

1. Update `data/pbbRequirements.ts`.
2. Add a migration if schema changes are required.
3. Run `npm run db:seed`.

Monitoring rows for new requirements are created automatically. Existing statuses and remarks are preserved.

## Replacing the Logo

Place the official logo at:

```text
public/logo.png
```

If missing, the UI displays a graceful **PSU** fallback.

## Replacing the Guidelines PDF

Place the PDF at:

```text
public/documents/Guidelines.pdf
```

## Export and Print

Use the dashboard **Export and Print** section:

- **Export Current Monitoring Data as JSON**
- **Export Current Monitoring Data as CSV**
- **Print Consolidated Monitoring Report**

Exports always fetch the latest centralized database state first.

## Shared-Data Behavior

- All users see the same submission statuses, remarks, progress, eligibility inputs, and accountability assessments.
- Updates persist after refresh and appear across browsers/devices within approximately five seconds.
- Every mutation requires an updater name or office and is recorded in the audit log.
- `localStorage` is used only for theme preference, filter preferences, last updater name, and anonymous browser session ID.

## Public Collaborative-Editing Limitation

Anyone with the deployed URL can update monitoring data. Do not enter confidential, personal, or sensitive information in remarks.

There is no public import tool or reset button. Destructive maintenance must be performed directly in Neon or through protected administrator scripts.

## Troubleshooting

| Issue | Likely cause | Fix |
| --- | --- | --- |
| Dashboard cannot load | Missing or invalid `DATABASE_URL` | Verify env var and redeploy |
| Empty requirements | Seed not run | Run `npm run db:seed` |
| 409 conflict messages | Another user updated the same record | Review latest data and save again |
| Build fails locally | Missing `DATABASE_URL` | Add `.env.local` before `npm run build` |

## Multi-Browser Verification

1. Open the deployed dashboard in Browser A and Browser B.
2. Mark a requirement as submitted in Browser A.
3. Confirm Browser B receives the update and progress changes within ~5 seconds.
4. Enter remarks in Browser B and confirm Browser A receives them.
5. Refresh both browsers and confirm persistence.
6. Open on another device and confirm identical centralized progress.

## Project Structure

```text
app/                  Next.js App Router pages and API routes
components/           UI and dashboard components
database/             Migrations, migrate.ts, seed.ts
data/                 Requirement and accountability seed data
lib/                  Database access, queries, calculations, validation
types/                Shared TypeScript types
tests/                Vitest unit tests
public/               Logo and Guidelines PDF
```

## License

Internal use for Partido State University FY 2024 PBB monitoring.
