#!/bin/bash
# Dev script — runs the development server.
set -e
cd /home/z/my-project

# Ensure .env exists with DATABASE_URL
if [ ! -f .env ]; then
  echo "DATABASE_URL=file:./db/custom.db" > .env
fi
export $(grep -v '^#' .env | xargs)

bun install
bunx prisma generate
bunx prisma db push --skip-generate
bun run scripts/seed.ts || true
bun run dev
