

For this assignment, you will build a reusable starter application that integrates Next.js with Supabase. This starter app will serve as a foundation for future projects, providing authentication, user profiles, and proper database security out of the box.

What is a Starter App?

A starter app (also called a boilerplate or template) is a pre-configured application that includes common functionality and best practices. When you need to start a new project, you can use your starter app as a base, saving you time and ensuring consistency across projects.

Your starter app should be well-documented, easy to set up, and include all the essential features for a modern web application with authentication.

Note on Flexibility: The names of routes, components, functions, and other code elements are flexible—you can choose names that make sense to you, as long as they are clear and follow good naming conventions. For example, you might use /profile or /settings for the profile page, or name your authentication hook useAuth or useUser. The important thing is that your choices are logical, consistent, and well-documented.
Objectives

    Integrate Next.js with Supabase for authentication and database operations
    Implement automatic profile creation when a user signs up
    Configure Row Level Security (RLS) policies correctly on the profile model
    Use Supabase declarative schemas for database models
    Create a setup script that automates project initialization
    Understand best practices for Next.js + Supabase integration

Application Requirements

Your starter application must include the following features:

1. Next.js Application Setup

    Create a new Next.js application (use the latest version)
    Configure TypeScript for type safety
    Set up proper project structure with organized folders (components, lib, app, etc.)
    Include basic styling (you can use Tailwind CSS, CSS modules, or plain CSS)

2. Supabase Integration

    Install and configure Supabase CLI and client libraries
    Set up Supabase for local development
    Create Supabase client utilities for both server and client components (using @supabase/ssr)
    Configure Next.js middleware for token refresh (proxy.ts)
    Set up environment variables for Supabase credentials

3. User Authentication

    Implement user sign up functionality
    Implement user sign in functionality
    Implement user sign out functionality
    Create protected routes that require authentication
    Display user information when logged in
    Handle authentication state properly in both server and client components

4. Profile Model with Declarative Schema

    Design and create a profiles table that stores user profile information
    The table should have a primary key that references auth.users(id)
    Include an updated_at field that is automatically set when the row is updated (use a trigger for this)
    Define the profile table using a declarative schema in supabase/schemas/profiles.sql
    Generate a migration from the declarative schema using npx supabase db diff

5. Automatic Profile Creation

    Create a PostgreSQL trigger function that automatically creates a profile when a new user is created in auth.users
    The trigger should:
        Fire AFTER a new user is inserted into auth.users
        Extract the user's email from the auth.users record
        Insert a new row into the profiles table with the user's ID and email
    Include the trigger function and trigger in your migration file

6. Row Level Security (RLS) Policies

    Enable RLS on the profiles table
    Create RLS policies that allow:
        Users to SELECT their own profile (using auth.uid())
        Users to UPDATE their own profile
        Users to INSERT their own profile (as a safety measure, though the trigger handles this)
    Ensure that users cannot access or modify other users' profiles

7. Setup Script

Create a setup script (e.g., setup.sh or setup.js) that automates the entire project setup process. The script should:

    Install all npm dependencies (npm install)
    Start the local Supabase instance (npx supabase start)
    Extract Supabase credentials (URL and anon key) from the supabase start output
    Create or update .env.local file with:
        NEXT_PUBLIC_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY
    Run database migrations (npx supabase db reset or npx supabase migration up)
    Provide clear output showing what was done and next steps

Important Notes for the Setup Script:

    The script should assume that Supabase is already initialized (i.e., the supabase directory with migrations and schemas already exists)
    The script should be idempotent (safe to run multiple times)
    Handle cases where Supabase is already running
    Check if .env.local already exists and either skip or update it
    Provide helpful error messages if something goes wrong
    Include instructions in your README on how to run the script

Deployment and CI/CD Requirements

    Deployment Documentation: Document how to deploy your starter app to a production environment (e.g., Vercel, Netlify, or another hosting platform). Your documentation should include:
        Steps to set up the production Supabase project
        How to configure environment variables in the deployment platform
        How to link the production database
        Any platform-specific considerations
    GitHub Actions for Database Migrations: Create a GitHub Actions workflow that automatically runs database migrations when code is deployed to production. The workflow should:
        Trigger on deployment or push to the main/production branch
        Connect to your production Supabase instance
        Run pending migrations using the Supabase CLI
        Handle errors gracefully and provide clear feedback
        Be secure (use GitHub Secrets for sensitive credentials)
    Include documentation in your README explaining how to set up and configure the GitHub Action.

Technical Requirements

    Use TypeScript throughout the application
    Follow Next.js 13+ App Router conventions (use app directory, not pages)
    Use @supabase/ssr for proper server-side rendering support
    All database schema changes must be in migration files (no manual SQL execution)
    Use declarative schemas in supabase/schemas/ and generate migrations from them
    Include proper error handling for authentication and database operations
    Code should be well-organized and follow best practices
    Include comments in your code where appropriate
    Authentication Patterns: Implement standardized ways of checking for user authentication. This should be consistent across your application—for example, create reusable utility functions or custom hooks (like useAuth() for client components) and helper functions for server components. Document your authentication patterns in your README.
    Code Organization and Documentation: Make explicit decisions about code organization and document them. For example:
        Where reusable components (like buttons, forms, etc.) are stored
        Where custom hooks are located
        How utility functions are organized
        Any other architectural decisions you make
    Document these decisions in your README so that anyone using your starter app understands the structure and conventions.
    Unit Testing Setup: Set up a unit testing framework (e.g., Jest, Vitest, or similar) and include at least a few example tests that demonstrate:
        How to test React components
        How to test utility functions
        How to test authentication-related code
    Include instructions in your README on how to run tests and add new tests.

Example Pages

Your starter app should include at least these pages to demonstrate functionality:

Just reminding you again that the URLs and page names shown below are examples—you have flexibility to name them as you see fit (e.g., /auth/login instead of /login, or /account instead of /profile), as long as your choices are logical and consistent.

/ (Home Page)

    Show a welcome message
    Display authentication status
    Link to login/signup if not authenticated
    Link to dashboard if authenticated

/login

    Email and password login form
    Error handling for failed login attempts
    Redirect to dashboard on successful login

/signup

    Email and password signup form
    Error handling for failed signup attempts
    Redirect to dashboard on successful signup

/dashboard (Protected Route)

    Require authentication (redirect to login if not authenticated)
    Display user profile information
    Link to profile page
    Sign out button

/profile (Protected Route)

    Require authentication (redirect to login if not authenticated)
    Display current profile information
    Form to update profile information (e.g., full_name, and any other fields you've included in your profile model)
    Avatar upload functionality that:
        Allows users to select and upload an image file
        Stores the uploaded image (you can use Supabase Storage or another storage solution)
        Updates the avatar_url field in the profiles table
        Displays the uploaded avatar
    Save/update button to persist changes
    Error handling for upload failures and validation errors

Setup Script Example

Your setup script should automate the entire setup process. Here's a conceptual example (you'll need to implement the actual credential extraction):

Note: You can implement this as a bash script, Node.js script, or use a tool like zx for better cross-platform support. The key is that it should work reliably and handle edge cases.
Documentation Requirements

Your README.md should include:

    Project description and purpose
    Prerequisites (Node.js version, Docker for Supabase, etc.)
    Quick start instructions (how to run the setup script)
    Manual setup instructions (if someone wants to set up step-by-step)
    Project structure explanation
    How to use this starter app for new projects
    Environment variables documentation
    Database schema overview
    Authentication flow explanation
    Deployment instructions (how to deploy to production)
    GitHub Actions setup and configuration (how to set up the migration workflow)
    Troubleshooting section

Instructions

    Read the assignment description fully and understand all requirements
    Create a new Next.js application with TypeScript
    Set up Supabase locally and configure it with your Next.js app
    Implement user authentication (sign up, sign in, sign out)
    Create the profiles table using a declarative schema
    Generate a migration from your declarative schema
    Add the trigger function and trigger for automatic profile creation
    Implement RLS policies on the profiles table
    Create the required pages (home, login, signup, dashboard, profile)
    Build and test the setup script
    Create a GitHub Actions workflow for automatic database migrations
    Write comprehensive documentation in README.md (including deployment instructions)