# System Architecture: Ultimate Enterprise v5.0

## Overview

Ultimate Enterprise v5.0 is a scalable, modern web application designed for the Marrakech tourism platform. It facilitates service discovery, booking management, and administrative operations.

## Technology Stack

### Core

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Runtime**: Node.js
- **Styling**: Tailwind CSS, PostCSS

### Data Layer

- **Database**: PostgreSQL (via Supabase/Neon/Self-hosted)
- **ORM**: Prisma
- **State Management**: React Server Components (Server State), React Hooks (Client State)

### Authentication

- **Library**: NextAuth.js (v5 Beta)
- **Strategy**: Credentials, OAuth (Google/GitHub supported)

## Architecture Patterns

### 1. Layered Architecture

The application follows a strict separation of concerns:

- **Presentation Layer (UI)**: `src/app`, `src/components`. Handles rendering and user interaction.
- **Service Layer**: `src/services`. Contains business logic and orchestrates data operations.
- **Data Access Layer (Repository)**: `src/repositories`. Direct database interactions using Prisma.
- **Database**: PostgreSQL.

### 2. Request Handling

- **Server Actions**: Used for mutations (form submissions) to ensure type safety and progressive enhancement.
- **API Routes**: `src/app/api` used for external integrations and complex data fetching requirements.
- **Middleware**: `middleware.ts` handles generic request processing (auth protection, logging).

## Directory Structure

```
src/
├── app/                  # App Router pages and API routes
├── components/           # Reusable UI components
│   ├── ui/               # Design system primitives (shadcn/ui style)
│   └── [feature]/        # Feature-specific components
├── lib/                  # Utilities, helpers, and shared configuration
├── services/             # Business logic layer
├── repositories/         # Database access layer
├── types/                # Global TypeScript definitions
└── auth.ts               # NextAuth configuration
```

## Scalability & Performance

- **Server-Side Rendering (SSR)**: Core pages are server-rendered for SEO and performance.
- **Static Site Generation (SSG)**: Static content (e.g., blog posts) is pre-rendered where possible.
- **Caching**: Extensive use of Next.js fetch cache and unstable_cache for high-traffic data.
