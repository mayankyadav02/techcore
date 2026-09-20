# Local Development Guide

## Prerequisites
- Node.js (v20+ recommended)
- npm (v10+ recommended)
- MongoDB running locally (or access to a remote cluster)

## Setup Environment
1. Clone the repository.
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Update `.env.local` with your local MongoDB URI, generate an `AUTH_SECRET`, and configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` for seeding.

## Installation
Install dependencies:
```bash
npm install
```

## Database Initialization
To bootstrap the application with necessary default settings and an initial admin account:
```bash
npm run seed:admin
```
*(Optional)* Seed sample media if testing upload flows:
```bash
npm run seed:media
```

## Running the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Access the public site at `http://localhost:3000` and the Admin CMS at `http://localhost:3000/admin`.

## Quality Checks
Before committing code, ensure the codebase passes linting and typechecking:
- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck`
- **Test**: `npm run test`

## Build
To test the production build locally:
```bash
npm run build
npm start
```
