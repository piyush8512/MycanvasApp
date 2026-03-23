# Swagger UI Integration Guide for Frontend (Beginner Friendly)

This guide explains how to use backend Swagger docs from the frontend step by step.

If you are new to APIs, this file is written for you.

---

## 1) What Swagger gives you

Swagger UI is a visual page that shows:

- All available backend APIs
- What request body each API needs
- What response shape each API returns
- Which routes require auth token
- A Try it out button to test API directly from browser

For this project, it becomes the single source of truth between backend and UI.

---

## 2) URLs you will use

### Local

- Backend server: http://localhost:4000
- Swagger UI: http://localhost:4000/api-docs
- OpenAPI JSON: http://localhost:4000/openapi.json

### Production

- Backend server: https://mycanvas-app-backend.vercel.app
- Swagger UI: https://mycanvas-app-backend.vercel.app/api-docs
- OpenAPI JSON: https://mycanvas-app-backend.vercel.app/openapi.json

---

## 3) Start backend and open docs

From backend folder:

1. Install dependencies
2. Run server
3. Open Swagger URL

Commands:

- npm install
- npm run dev

Then open:

- http://localhost:4000/api-docs

---

## 4) How to call protected APIs in Swagger (important)

Most routes require Clerk bearer token.

In Swagger UI:

1. Click Authorize button
2. In bearerAuth input, paste token only (without Bearer word)
3. Click Authorize
4. Close modal

Now protected endpoints can be tested.

Example token header that backend expects:

Authorization: Bearer your_clerk_jwt

---

## 5) How frontend already connects (your current app)

Your frontend API base URL is set in service layer.

Current file:

- services/api.ts

It uses:

- NEXT_PUBLIC_API_URL if present
- Otherwise defaults to production backend URL

So for local development, set env:

NEXT_PUBLIC_API_URL=http://localhost:4000/api

Then restart Next.js app.

---

## 6) Recommended UI workflow with Swagger

Whenever backend adds or changes endpoint:

1. Open Swagger and read endpoint contract
2. Update frontend service function in services/api.ts or services/canvasItemService.ts
3. Match request body exactly to Swagger schema
4. Match response parsing exactly to Swagger schema
5. Test endpoint in Swagger first
6. Test endpoint in UI screen

This avoids "UI expects one shape, backend sends another" problems.

---

## 7) Example: integrate canvas list in UI

Swagger endpoint:

- GET /api/canvas

Expected response:

- success: boolean
- message: string
- canvas: array

Frontend mapping location:

- services/api.ts inside canvasApi.getAll

Checklist:

1. Ensure token exists in localStorage clerk-token
2. Ensure Authorization header is attached
3. Ensure API URL points to correct env (local vs prod)
4. Map response.canvas array into UI Canvas type

---

## 8) Example: create canvas item from UI

Swagger endpoint:

- POST /api/canvas/{canvasId}/items

Needs body fields:

- type
- position {x,y}
- size {width,height}
- optional name/color/content

Frontend integration file:

- services/canvasItemService.ts

Flow:

1. Build payload from UI form/card
2. Send POST with token
3. Read response.item
4. Insert item in local state/store

---

## 9) API-first habit to follow on this project

Use this rule for every feature:

1. Backend updates OpenAPI spec first
2. Frontend reviews endpoint in Swagger
3. Frontend implements service call
4. Backend and frontend test with same contract

This is the safest way because you have web, mobile, and extension clients.

---

## 10) Common issues and fixes

### 401 Unauthorized

Cause:

- Missing token
- Expired token
- Incorrect token format

Fix:

- Re-login and refresh token
- Verify Authorization header contains Bearer token
- Test in Swagger after clicking Authorize

### CORS error

Cause:

- Frontend origin not allowed in backend CORS list

Fix:

- Add origin in backend CORS config
- Restart backend

### Wrong response shape in UI

Cause:

- Frontend assumptions not matching Swagger schema

Fix:

- Compare UI parsing with Swagger response example
- Update mapper in service layer

### Local API not being used

Cause:

- NEXT_PUBLIC_API_URL missing or stale dev server

Fix:

- Set NEXT_PUBLIC_API_URL=http://localhost:4000/api
- Restart frontend dev server

---

## 11) Optional next step (strongly recommended)

Once this basic setup is stable, generate TypeScript types from OpenAPI JSON.

Benefits:

- Autocomplete for request/response
- Fewer runtime mistakes
- Faster frontend implementation

---

## 12) Team rule suggestion

Add this to your dev process:

- No backend endpoint merge without OpenAPI update
- No frontend API integration without checking Swagger

This keeps all clients in sync.
