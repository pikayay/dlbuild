# Change Log

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Added individual hero detail pages at `/deadlock/heroes/[heroSlug]` showing portrait, tags, overview, playstyle, and lore.
- Updated the Heroes catalog to link to the new hero detail pages.
- Added the Deadlock Minimap page at `/deadlock/minimap`.
- Created the Deadlock app, a build-crafting app for the game Deadlock.
- Created `items`, `builds`, and `heroes` pages.
- Created a new layout for the Deadlock pages with a sidebar and animations.
- Integrated the [Deadlock Assets API](https://assets.deadlock-api.com/) for items: `getItems()` calls `GET /v2/items` with `language=english`, typed `DeadlockItem` models (ability, weapon, upgrade), helpers for image URLs and plain-text description snippets, and structured error handling in `lib/deadlock-api.ts`.
- Configured Next.js `images.remotePatterns` for `assets-bucket.deadlock-api.com` and `assets.deadlock-api.com` so item icons load through `next/image`.
- Placeholder API helpers for builds and heroes in `lib/deadlock-api.ts` (unchanged behavior).

### Changed
- Reworked the home page (`app/page.tsx`) to look nicer, match the style of other pages, and use `title-screen.jpg` as the background.
- Items page lists all API items in a grid with name, internal class name, type badge, optional description snippet, and upgrade-only fields (cost, slot, tier, shopable). Fetches use `cache: 'no-store'` because the full items payload exceeds Next.js’s fetch data cache size limit, so the route is dynamically rendered.
- Updated the homepage to be more relevant to the Deadlock app.
- Updated the middleware to redirect unauthenticated users to the homepage.
- Updated the title and description of the app.

### Removed
- Removed the login, signup, dashboard, and profile pages and components from the starter app.
- Removed unnecessary markdown files.

## 2026-03-03

### Added
- Created `profiles` table with declarative schema in `supabase/schemas/profiles.sql`.
- Generated migration `20260301120005_create_profiles.sql` from the declarative schema.
- Added RLS policies to the `profiles` table.
- Added a trigger to automatically create a profile for new users.
- Added a trigger to automatically update the `updated_at` field on profile updates.

## 2026-02-28

### Added
- sign up, sign in, and sign out functionality.
- items page displaying all items in groups and subgroups, with links to item-specific pages.
- heroes page displaying all heroes 