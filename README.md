# Next.js + Supabase Starter App

This is a starter application that integrates Next.js with Supabase for authentication and database operations. It is designed to be a reusable foundation for future projects.

## Prerequisites

- Node.js (v16+)
- Docker
- Supabase CLI: `npm install -g supabase`

## Quick Start

This project includes a setup script that automates the entire project setup process.

To run the script, execute the following command:

```bash
./setup.sh
```

The script will:
1.  Install npm dependencies.
2.  Start the local Supabase instance.
3.  Create a `.env.local` file with the necessary Supabase credentials.
4.  Reset the local database and run all migrations.

After the script has finished, you can run the development server:

```bash
npm run dev
```

## Project Structure

- `app/`: Contains all routes and pages, following Next.js App Router conventions.
- `components/`: For reusable React components.
- `lib/`: For shared utility functions, helper scripts, and third-party library configurations.
  - `lib/supabase/`: Specifically for Supabase client (client-side) and server-side utilities.
- `styles/`: For global stylesheets.
- `public/`: For static assets like images and fonts.
- `supabase/`: Contains all Supabase-related files, including migrations and schema definitions.

## Environment Variables

This project uses the following environment variables, which are configured automatically by the `setup.sh` script:

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous (public) key for your Supabase project.

## Database Schema

The database schema is defined declaratively in the `supabase/schemas` directory.

- **`profiles` table**: Stores public user data.
    - A trigger automatically creates a new profile for each new user in `auth.users`.
    - A trigger automatically updates the `updated_at` timestamp when a profile is modified.
- **Row Level Security (RLS)**: RLS is enabled on the `profiles` table to ensure users can only access and modify their own data.

## Authentication Flow

This starter app uses the `@supabase/ssr` library to handle authentication in both Server and Client Components.

- **`lib/supabase/client.ts`**: Creates a Supabase client for use in Client Components.
- **`lib/supabase/server.ts`**: Creates a Supabase client for use in Server Components.
- **`middleware.ts`**: Refreshes the user's session token on every request.

## Deployment

To deploy this application, you will need to:

1.  Create a new project on Supabase.
2.  Link your local project to the remote Supabase project: `npx supabase link --project-ref <YOUR_PROJECT_REF>`
3.  Push the database migrations: `npx supabase db push`
4.  Configure the environment variables in your hosting provider's settings (e.g., Vercel, Netlify).

## Troubleshooting

- **`npx supabase start` fails**: Ensure Docker is running and that no other services are using the ports required by Supabase. You can try stopping all running Docker containers with `docker stop $(docker ps -aq)`.

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and component testing. The tests are located alongside the files they test and have a `.test.ts` or `.test.tsx` extension.

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

To run the tests in watch mode with a UI, use:

```bash
npm run test:ui
```

### Writing Tests

-   **Component Tests**: For React components, we use `@testing-library/react`. Create a `[component-name].test.tsx` file in the same directory as the component.
-   **Utility Function Tests**: For utility functions, create a `[function-name].test.ts` file.
-   **Mocks**: When testing components that rely on Next.js features (like `useRouter`) or external clients (like Supabase), make sure to mock them in your test files. You can see examples in `app/components/SignInForm.test.tsx` and `app/components/SignOutButton.test.tsx`.
