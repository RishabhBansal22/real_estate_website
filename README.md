# DreamHomes - Real Estate Platform

A modern full-stack real estate web app built with Next.js App Router, MongoDB, and NextAuth.

It includes property discovery, AI-powered natural-language search, comparison and wishlist flows, contact lead management, and role-based admin controls for property and enquiry operations.

## Highlights

- Next.js 16 + React 19 + TypeScript app using the App Router architecture.
- MongoDB + Mongoose models for properties, users, and contacts.
- Credentials authentication with NextAuth and JWT sessions.
- AI-style search endpoint that parses plain-language queries into property filters.
- Property listing with categories, detail pages, featured sections, and map/chart UI components.
- Wishlist and compare flows for signed-in users.
- Contact enquiry pipeline with admin-only status updates.
- Auto-seeding behavior for properties when the database is empty.

## Tech Stack

- Framework: Next.js 16.2.0
- Language: TypeScript
- UI: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- Data/DB: MongoDB, Mongoose
- Auth: NextAuth (Credentials Provider), bcryptjs
- Visualization & Maps: Recharts, Leaflet, React-Leaflet

## Project Structure

```text
src/
	app/
		api/
			ai/
			auth/
			contacts/
			properties/
			search/
			users/
		properties/
		dashboard/
		wishlist/
		compare/
		emi-calculator/
	components/
		layout/
		ui/
	hooks/
	lib/
	models/
```

## Local Setup

### 1. Prerequisites

- Node.js 20+ recommended
- npm (or yarn/pnpm/bun)
- MongoDB Atlas (or compatible MongoDB URI)

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_long_secret
# Optional fallback used by auth route
AUTH_SECRET=your_random_long_secret

# Optional: first registered user with this email gets admin role
ADMIN_EMAIL=admin@example.com
```

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication and Roles

- Registration: `POST /api/auth/register`
- Login: NextAuth credentials via `/api/auth/[...nextauth]`
- Session strategy: JWT
- Roles:
	- `user`: default role
	- `admin`: can create/update/delete properties and manage contacts

## API Overview

### Core property APIs

- `GET /api/properties`
	- Returns all properties sorted by newest.
	- Seeds initial property data if collection is empty.
- `POST /api/properties` (admin only)
	- Creates a property.
- `PUT /api/properties/:id` (admin only)
	- Updates a property.
- `DELETE /api/properties/:id` (admin only)
	- Deletes a property.

### AI search API

- `POST /api/ai`
	- Accepts `{ "query": "..." }`
	- Extracts location, max budget, and type from natural language.
	- Returns a redirectable URL like `/properties?location=...&maxPrice=...&type=...`.

### Contact APIs

- `GET /api/contacts` (admin only)
	- Lists all contact enquiries with populated user/property data.
- `PATCH /api/contacts` (admin only)
	- Updates enquiry status (`pending`, `contacted`, `resolved`).

## Notes

- The MongoDB connector currently includes a DNS workaround for certain Windows + Atlas SRV timeout scenarios.
- If your database already has older property documents, the app may reset/reseed property data when key fields are missing.

## Deployment

You can deploy this app on any Node-compatible platform (for example, Vercel).

Before deploying, make sure production environment variables are set:

- `MONGODB_URI`
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
- `ADMIN_EMAIL` (optional)

## License

No license file is currently defined in this repository.
