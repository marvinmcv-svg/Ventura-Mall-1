#!/bin/bash
# Dev script — runs the development server.
set -e
cd /home/z/my-project
bun install
bunx prisma generate
bunx prisma db push --skip-generate
bun run dev
