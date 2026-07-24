#!/bin/bash
# Build script — runs on the deployment platform during the build phase.
# Generates the Prisma client, creates the SQLite database + schema, then builds Next.js.
set -e

cd /home/z/my-project

echo "=== Installing dependencies ==="
bun install

echo "=== Generating Prisma client ==="
bunx prisma generate

echo "=== Creating database + schema ==="
bunx prisma db push --skip-generate

echo "=== Building Next.js ==="
bun run build

echo "=== Build complete ==="
