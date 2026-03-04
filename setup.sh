#!/bin/bash
set -e

echo "Starting project setup..."

# 1. Install npm dependencies
echo "Installing npm dependencies..."
npm install

# 2. Start Supabase if not already running
if ! npx supabase status > /dev/null 2>&1 || ! npx supabase status | grep -q "supabase local development setup is running"; then
  echo "Starting Supabase..."
  npx supabase start
else
  echo "Supabase is already running."
fi

# 3. Get Supabase credentials
echo "Getting Supabase credentials..."
OUTPUT=$(npx supabase status)
URL=$(echo "$OUTPUT" | grep "Project URL" | sed -E 's/.*Project URL[[:space:]]*│[[:space:]]*//;s/[[:space:]]*│$//')
ANON_KEY=$(echo "$OUTPUT" | grep "Publishable" | sed -E 's/.*Publishable[[:space:]]*│[[:space:]]*//;s/[[:space:]]*│$//')

if [ -z "$URL" ] || [ -z "$ANON_KEY" ]; then
  echo "Error: Could not find Supabase URL or anon key."
  exit 1
fi

# 4. Create or update .env.local file
ENV_FILE=".env.local"
echo "Creating/updating $ENV_FILE file..."

cat <<EOF > $ENV_FILE
NEXT_PUBLIC_SUPABASE_URL=$URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
EOF


# 5. Run database migrations
echo "Resetting database and running migrations..."
npx supabase db reset

echo "Setup complete!"
echo "You can now run the development server with 'npm run dev'"
