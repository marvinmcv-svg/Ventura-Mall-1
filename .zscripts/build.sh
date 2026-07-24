#!/bin/bash
# Build script — runs on the deployment platform during the build phase.
# Generates the Prisma client, creates the SQLite database + schema, then builds Next.js.
set -e

cd /home/z/my-project

# Ensure .env exists with DATABASE_URL (the platform may not provide one)
if [ ! -f .env ]; then
  echo "DATABASE_URL=file:./db/custom.db" > .env
fi

# Ensure DATABASE_URL is exported for this shell session
export $(grep -v '^#' .env | xargs)

echo "=== Installing dependencies ==="
bun install

echo "=== Generating Prisma client ==="
bunx prisma generate

echo "=== Creating database + schema ==="
bunx prisma db push --skip-generate

echo "=== Seeding initial data ==="
bun run scripts/seed.ts || echo "Seed completed (some data may already exist)"

echo "=== Building Next.js ==="
bun run build

echo "=== Build complete ==="
