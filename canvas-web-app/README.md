# Canvas App — Web (Next.js)

The web front-end for the Canvas App platform. Provides the full canvas experience in the browser, hosts the Chrome extension login bridge, and serves as the authenticated dashboard for managing folders and canvases.

---

## Tech Stack

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Framework    | Next.js 16 (App Router)         |
| Language     | TypeScript                      |
| Auth         | Clerk Next.js (`@clerk/nextjs`) |
| Styling      | Tailwind CSS 4                  |
| Animations   | Framer Motion 12, GSAP 3        |
| Server State | TanStack React Query 5          |
| Client State | Zustand 5                       |
| Deployment   | Vercel                          |

---

## Project Structure

```
canvas-web-app/
├── app/
│   ├── layout.tsx            # Root layout (Clerk provider, theme)
│   ├── page.tsx              # Landing / home page
│   ├── globals.css           # Global styles + Tailwind base
│   ├── sign-in/              # Clerk sign-in page
│   ├── sign-up/              # Clerk sign-up page
│   ├── dashboard/            # Main authenticated dashboard
│   └── extension-login/      # Chrome extension auth bridge page
├── components/
│   ├── ThemeToggle.tsx       # Dark / light mode toggle
│   ├── canvas/               # Canvas editor components
│   └── dashboard/            # Dashboard layout & panels
├── hooks/
│   ├── index.ts              # Shared hook exports
│   └── queries/              # TanStack Query hooks (canvas, folders…)
├── services/
│   ├── api.ts                # Authenticated API client
│   └── canvasItemService.ts  # Canvas item helpers
├── stores/
│   ├── canvasStore.ts        # Zustand canvas state
│   ├── uiStore.ts            # Zustand UI state (panels, modals)
│   └── index.ts              # Store exports
├── lib/
│   └── theme.tsx             # Theme context / provider
├── providers/
│   └── QueryProvider.tsx     # TanStack Query client provider
├── types/
│   └── canvas.ts             # Shared TypeScript types
└── public/                   # Static assets
```

---

## Getting Started

### 1. Install dependencies

```bash
cd canvas-web-app
npm install
```

### 2. Set up environment variables

Create a `.env.local` in `canvas-web-app/`:

```env
# Clerk keys (from Clerk dashboard → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Clerk redirect paths
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Backend API
NEXT_PUBLIC_API_URL="https://mycanvas-app-backend.vercel.app"

# Chrome extension ID (for the extension-login bridge)
NEXT_PUBLIC_EXTENSION_ID="ncnfkblfdjkfoooejokijaiehmibmlcj"

# Optional: dedicated Clerk JWT template name for extension auth bridge
# Example value: "canvas_extension"
NEXT_PUBLIC_CLERK_EXTENSION_TOKEN_TEMPLATE="canvas_extension"
```

### 3. Run the dev server

```bash
npm run dev
```

App available at `http://localhost:3000`.

---

## Key Features

### Dashboard

- View and manage all folders and canvases
- Create, rename, delete, and share folders and canvases
- Drag-and-drop layout with per-user position persistence

### Canvas Editor

- Free-form infinite canvas
- Card types: **link, note, image, YouTube, PDF, Instagram, Twitter**
- Zoom and pan with smooth GSAP/Framer Motion animations
- Real-time collaboration support

### Chrome Extension Auth Bridge (`/extension-login`)

- Dedicated page visited when the Chrome extension needs to authenticate
- After Clerk sign-in, posts an `AUTH_SUCCESS` message with a JWT to the extension via `chrome.runtime.sendMessage`
- The extension ID is read from the `extensionId` query param (passed by the extension itself) so the handshake works across different machines without hardcoding
- This page requests a Clerk JWT template token (default template name: `canvas_extension`) and does not fall back to the default Clerk token, preventing short token lifetime issues in the extension

### Theme

- Dark and light mode support via `ThemeToggle` and `lib/theme.tsx`

---

## State Management

| Store                   | Responsibility                                                 |
| ----------------------- | -------------------------------------------------------------- |
| `canvasStore` (Zustand) | Active canvas data, selected items, drag state                 |
| `uiStore` (Zustand)     | Sidebar open/close, active modal, panel visibility             |
| React Query hooks       | Server data fetching, caching, and mutation for canvas/folders |

---

## Deployment (Vercel)

```bash
vercel --prod
```

Required Vercel environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_EXTENSION_ID`

Live app: `https://mycanvas-app-seven.vercel.app`

> **Important:** After updating `NEXT_PUBLIC_EXTENSION_ID` in Vercel, redeploy for the change to take effect on the live extension-login bridge.

---

## Useful Scripts

| Script           | Command         |
| ---------------- | --------------- |
| Start dev server | `npm run dev`   |
| Production build | `npm run build` |
| Start production | `npm start`     |
| Lint             | `npm run lint`  |

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
