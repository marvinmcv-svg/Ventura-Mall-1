# Ventura Mall — Santa Cruz, Bolivia

The official marketing website for Ventura Mall, the largest shopping center in Bolivia. Built with Next.js 16, TypeScript, Prisma + SQLite, Tailwind CSS, and shadcn/ui.

## Features

- **Cinematic single-page site** with 14 sections: Hero, Stores, Experiences, Dining, Cinema, Events, Gallery, Promos, Visit, FAQ, Newsletter, Footer
- **Admin portal** (bottom-right shield button) with full CRUD for stores, experiences, promos, events, gallery, movies, FAQs, settings
- **Store image galleries** — add/remove multiple images per store, shown in a lightbox on the public site
- **Promo media** — add images and/or videos to promotions, rendered on the public site
- **Google Maps embed** on the Visit section
- **Real Ventura Mall logo** from the official brand
- **Premium animations** — parallax, scroll reveals, kinetic typography, magnetic CTAs, custom cursor
- **Security** — scrypt password hashing, httpOnly SameSite cookies, rate limiting, security headers, input validation
- **SEO** — SSR metadata, Open Graph, Twitter cards, ShoppingCenter JSON-LD schema, sitemap, robots.txt

## Admin Credentials

- **Username:** `MarvinC`
- **Password:** `VenturaMall123!`

## Local Development

```bash
# Install dependencies
bun install

# Set up the database
cp .env.example .env
bun run db:push
bun run scripts/seed.ts

# Start the dev server
bun run dev
```

The site runs on `http://localhost:3000`.

## Deployment

### Prerequisites
- Node.js 18+ or Bun
- A writable filesystem for the SQLite database (or switch to Postgres for serverless)

### Steps

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd ventura-mall
   bun install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   bun run db:push
   bun run scripts/seed.ts
   ```

3. **Build and run**
   ```bash
   bun run build
   bun run start
   ```

### Serverless deployment (Vercel, etc.)

SQLite doesn't work on serverless platforms (ephemeral filesystem). To deploy on Vercel:
1. Switch the database to Postgres (Supabase, Neon, etc.)
2. Update `prisma/schema.prisma` provider from `sqlite` to `postgresql`
3. Set `DATABASE_URL` to your Postgres connection string
4. Run `bun run db:push` against the production database
5. Run `bun run scripts/seed.ts` to populate initial data

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, standalone output) |
| Language | TypeScript 5 (strict mode) |
| Database | Prisma ORM + SQLite |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Bricolage Grotesque (display), Geist (body) |

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server on port 3000 |
| `bun run build` | Production build (standalone output) |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to database |
| `bun run scripts/seed.ts` | Seed database with initial content + admin user |

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (admin CRUD, content, contact, newsletter)
│   ├── globals.css    # Global styles + design tokens
│   ├── layout.tsx     # Root layout (fonts, metadata, JSON-LD)
│   ├── page.tsx       # Single-page homepage
│   ├── not-found.tsx  # Custom 404
│   ├── error.tsx      # Custom 500
│   ├── robots.ts      # robots.txt
│   └── sitemap.ts     # sitemap.xml
├── components/
│   ├── admin/         # Admin portal (login, dashboard, editors, media)
│   ├── site/          # Public site sections (hero, stores, cinema, etc.)
│   └── ui/            # shadcn/ui component library
├── lib/               # Shared utilities (db, auth, content, motion, etc.)
└── proxy.ts           # Next.js 16 proxy (rate limiting)
```

## License

© 2026 Ventura Mall. All rights reserved.
