# Canvas App — Backend API

Express.js REST API powering the Canvas App platform. Handles authentication, user data, canvases, folders, file storage, sharing, and social features.

---

## Tech Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Runtime      | Node.js 22.x                   |
| Framework    | Express.js 5                   |
| Auth         | Clerk SDK (JWT verification)   |
| ORM          | Prisma 7                       |
| Database     | PostgreSQL (via Supabase)      |
| File Storage | Supabase Storage (signed URLs) |
| Deployment   | Vercel (serverless)            |

---

## Project Structure

```
backend/
├── api/
│   └── index.js          # Vercel serverless entry point
├── src/
│   ├── server.js         # Local dev Express server
│   ├── config/           # DB / Supabase client setup
│   ├── controllers/      # Route handler logic
│   ├── middleware/        # Clerk auth, error handling
│   ├── routes/           # Express router definitions
│   └── services/         # Business logic layer
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration history
├── prisma.config.ts
└── vercel.json
```

---

## Getting Started (Local Dev)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Set up environment variables

Create a `.env` file in `backend/`:

```env
# PostgreSQL connection string (from Supabase → Settings → Database)
DATABASE_URL="postgresql://..."

# Clerk secret key (from Clerk dashboard → API Keys)
CLERK_SECRET_KEY="sk_..."

# Supabase project config (from Supabase → Settings → API)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="canvas-uploads"

# Frontend origins
FRONTEND_URL="http://localhost:3000"

PORT=4000
```

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Push schema to the database (dev only)

```bash
npm run prisma:push
```

### 5. Start the dev server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

Swagger UI will be available at `http://localhost:4000/api-docs`.
OpenAPI JSON will be available at `http://localhost:4000/openapi.json`.

---

## API Routes

All protected routes require an `Authorization: Bearer <clerk_jwt>` header.

---

## API Documentation (Swagger / OpenAPI)

This backend serves API docs directly from `openapi.yaml`.

Local URLs:

- `http://localhost:4000/api-docs` (Swagger UI)
- `http://localhost:4000/openapi.json` (OpenAPI JSON)

Production URLs:

- `https://mycanvas-app-backend.vercel.app/api-docs` (Swagger UI)
- `https://mycanvas-app-backend.vercel.app/openapi.json` (OpenAPI JSON)

UI integration guide for beginners:

- `../canvas-web-app/SWAGGER_UI_INTEGRATION_README.md`

### Users

| Method | Path            | Description                            |
| ------ | --------------- | -------------------------------------- |
| GET    | `/api/users/me` | Get current authenticated user profile |

### Folders

| Method | Path               | Description                        |
| ------ | ------------------ | ---------------------------------- |
| GET    | `/api/folders`     | List all folders owned by the user |
| POST   | `/api/folders`     | Create a new folder                |
| GET    | `/api/folders/:id` | Get a folder with its canvases     |
| PATCH  | `/api/folders/:id` | Update folder name / position      |
| DELETE | `/api/folders/:id` | Delete a folder                    |

### Canvas (Files)

| Method | Path                            | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| GET    | `/api/canvas`                   | List all canvases owned by the user |
| POST   | `/api/canvas`                   | Create a new canvas                 |
| GET    | `/api/canvas/:id`               | Get a canvas with its items         |
| PATCH  | `/api/canvas/:id`               | Update canvas name / position       |
| DELETE | `/api/canvas/:id`               | Delete a canvas                     |
| POST   | `/api/canvas/:id/items`         | Add an item to a canvas             |
| PATCH  | `/api/canvas/:id/items/:itemId` | Update a canvas item                |
| DELETE | `/api/canvas/:id/items/:itemId` | Delete a canvas item                |

### Storage

| Method | Path                      | Description                                  |
| ------ | ------------------------- | -------------------------------------------- |
| POST   | `/api/storage/signed-url` | Get a signed upload URL for Supabase Storage |
| POST   | `/api/storage/public-url` | Get the public URL for an uploaded file path |

### Friends & Social

| Method | Path                       | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| GET    | `/api/friends`             | List accepted friends              |
| POST   | `/api/friends/request`     | Send a friend request              |
| PATCH  | `/api/friends/request/:id` | Accept or decline a friend request |
| GET    | `/api/friends/requests`    | List pending friend requests       |

### Sharing

| Method | Path                            | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| POST   | `/api/sharing/folder/:id/share` | Generate a share token for a folder |
| POST   | `/api/sharing/canvas/:id/share` | Generate a share token for a canvas |
| GET    | `/api/sharing/:token`           | Access shared content via token     |

---

## Data Model Highlights

```
User
 ├── Folder[]          (owned folders)
 │    └── File[]       (canvases inside a folder)
 ├── File[]            (root-level canvases)
 │    └── CanvasItem[] (content: links, notes, images, videos…)
 ├── FriendRequest[]
 ├── Friendship[]
 └── SharedItem[]
```

**CanvasItem fields saved from the extension:**

- `type` — `link | note | image | youtube | instagram | twitter | pdf | …`
- `name` — display title
- `content` — JSON blob (`{ url, title, text, domain, videoId, … }`)
- `color` — hex background color
- `position` — `{ x, y }` on the canvas
- `size` — `{ width, height }` of the card

---

## Deployment (Vercel)

The backend is deployed as a Vercel serverless function via `api/index.js`.

Required Vercel environment variables (set in the Vercel dashboard):

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `FRONTEND_URL` → `https://mycanvas-app-seven.vercel.app`

Deploy:

```bash
vercel --prod
```

Live API: `https://mycanvas-app-backend.vercel.app`

---

## Useful Scripts

| Script                     | Command                   |
| -------------------------- | ------------------------- |
| Start local dev            | `npm run dev`             |
| Start production           | `npm start`               |
| Generate Prisma client     | `npm run prisma:generate` |
| Push schema (no migration) | `npm run prisma:push`     |
| Open Prisma Studio         | `npm run prisma:studio`   |
