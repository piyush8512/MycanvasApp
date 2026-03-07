# MyCanvasApp — AI Integration Master Plan

This document is a deep, execution-ready plan to integrate AI into the existing MyCanvasApp codebase without creating a separate repo.

Scope covered:
- Backend + DB integration step-by-step
- Frontend/UI integration (mobile + web)
- Rollout strategy and risk controls
- Performance optimization plan
- Monetization plan (free + paid)
- What to build after v1

---

## 1) Recommended Approach (Decision)

### Decision
Integrate AI **inside the current repo** using a modular structure.

### Why
- Lower complexity now (single deploy pipeline)
- Reuse existing auth, Prisma models, routes, and types
- Faster iteration and debugging
- Easy to extract later if AI traffic grows

### Future extraction trigger (when to split service)
Split AI into a separate service only when one or more become true:
- AI requests > 100k/day
- Async queues become mission-critical with separate SLOs
- Multiple products need the same AI APIs

---

## 2) Current Codebase Mapping (Where AI Fits)

### Backend
- Prisma schema: `backend/prisma/schema.prisma`
- Canvas APIs: `backend/src/controllers/canvas.controller.js`
- Routes: `backend/src/routes/canvas.routes.js`
- Service layer exists: `backend/src/services/`

### Frontend (React Native app)
- Canvas page: `frontend/app/canvas/[id].jsx`
- Canvas item hooks: `frontend/hooks/useCanvasItems.ts`
- Services: `frontend/services/canvasService.ts`
- Types: `frontend/types/space.ts`

### Web app (Next.js)
- Dashboard hooks: `canvas-web-app/hooks/queries/useDashboard.ts`
- API service: `canvas-web-app/services/api.ts`
- Canvas UI: `canvas-web-app/components/canvas/`

---

## 3) Product Definition for AI v1

### Primary user problem
Users add many items (notes/links/images/docs) but cannot quickly organize, search, and retrieve context.

### AI v1 goals
1. Auto-categorize new canvas items
2. Auto-generate tags
3. Provide short summary for links/docs
4. Enable semantic search across items

### Non-goals for v1 (keep scope safe)
- Full AI assistant chat in every screen
- Real-time collaborative AI editing
- Auto-layout with complex graph optimization

---

## 4) Architecture Blueprint

## 4.1 New backend modules
Create:
- `backend/src/config/aiProvider.js`
- `backend/src/services/ai.service.js`
- `backend/src/services/embedding.service.js`
- `backend/src/controllers/ai.controller.js`
- `backend/src/routes/ai.routes.js`
- `backend/src/services/aiQueue.service.js` (optional in v1, recommended in v1.5)

## 4.2 Integration pattern
- **Sync path (fast):** Create item immediately (existing behavior)
- **Async path (AI):** Trigger AI classification after item creation
- Save AI output back to item

This avoids blocking user actions and keeps UX snappy.

## 4.3 AI provider abstraction
Wrap provider APIs behind one internal interface so you can swap OpenAI/Gemini/Claude later.

Internal interface example:
- `classifyItem(payload)`
- `generateTags(payload)`
- `summarize(payload)`
- `embed(text)`

---

## 5) Database Changes (Prisma)

Update `CanvasItem` model with optional AI metadata:

- `category String?`
- `tags String[] @default([])`
- `aiSummary String?`
- `aiConfidence Float?`
- `embedding Unsupported("vector")?` *(if using pgvector directly in Prisma, depends on setup)*
- `aiStatus String? @default("pending")`  // pending|done|failed
- `lastAnalyzedAt DateTime?`

If pgvector is not ready, start with:
- `embeddingJson Json?` (temporary)
Then migrate to pgvector in v2.

### Migration policy
- Keep all new fields nullable/defaulted
- No destructive change in v1
- Backfill old items via batch jobs

---

## 6) API Contracts (Backend)

Add routes under `/api/ai`:

1. `POST /api/ai/items/:itemId/analyze`
   - Force analyze one item
2. `POST /api/ai/items/analyze-batch`
   - Analyze N items by ids/canvasId
3. `POST /api/ai/search`
   - Semantic search with query text + filters
4. `GET /api/ai/items/:itemId/similar`
   - Similar item recommendations
5. `GET /api/ai/health`
   - Provider/queue health

### Response standard
Use existing backend style:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

---

## 7) Step-by-Step Implementation Plan

## Phase 0 — Preparation (Day 1)
- Add env vars in backend:
  - `AI_PROVIDER=openai`
  - `OPENAI_API_KEY=...`
  - `AI_MODEL_CLASSIFY=...`
  - `AI_MODEL_EMBED=...`
  - `AI_MAX_TOKENS_PER_ITEM=...`
- Add feature flags:
  - `AI_ENABLED=true`
  - `AI_AUTO_ANALYZE_ON_CREATE=true`
- Add strict request timeout + retries with jitter

Deliverable: AI config scaffold + health endpoint.

## Phase 1 — Core classification (Days 2-3)
- Extend Prisma schema with AI fields
- Create `ai.service.js` with:
  - Input sanitizer
  - Content extraction from `CanvasItem` fields (`name`, `type`, `content`, `url`)
  - Categorization + tags + confidence
- Add endpoint `POST /api/ai/items/:itemId/analyze`
- Trigger analyze call from `createItem` in `canvas.controller.js` (non-blocking)

Deliverable: New items get category/tags automatically.

## Phase 2 — Summaries + indexing (Days 4-5)
- Add URL summarization path for link/pdf/doc items
- Save `aiSummary`
- Add embedding generation pipeline
- Add batch endpoint for old data backfill

Deliverable: Existing + new items become searchable by meaning.

## Phase 3 — Semantic search UI (Days 6-7)
- Backend: `/api/ai/search`
- Frontend mobile + web search box with “AI Search” mode
- Return matched items with relevance score

Deliverable: Query like “marketing deck from last week” works.

## Phase 4 — Recommendations (Week 2)
- Similar items endpoint
- Folder/canvas suggestion endpoint
- Optional smart “group this?” suggestions

Deliverable: Better organization and faster retrieval.

---

## 8) UI/UX Integration (Detailed)

## 8.1 Mobile app (`frontend`)

### A) Canvas Item card metadata
Where: `frontend/components/canvas/CanvasItem.tsx`
- Add compact AI badge row:
  - Category chip (`Work`, `Personal`, `Research`)
  - Up to 2 tags
  - Confidence dot color (green/yellow/red)
- Keep collapsed by default; expand in details modal

### B) Search experience
Where: `frontend/app/(tabs)/search.tsx`
- Add segmented control:
  - `Keyword`
  - `AI Search`
- In AI mode:
  - Input placeholder: “Try: project notes about design system”
  - Show relevance score subtly

### C) Post-create feedback
Where: `frontend/app/canvas/[id].jsx`
- After adding item, show non-blocking status:
  - “Analyzing…” then “Categorized as Research”
- If failed: silent fallback (no user disruption)

### D) Filter tabs
Where likely in home/search components
- Add quick filters by AI category and tags
- Preserve existing filters, do not replace

## 8.2 Web app (`canvas-web-app`)

### A) Dashboard enhancements
Where: `canvas-web-app/components/canvas/InfiniteCanvas.tsx`
- Show category icon/chip on item cards
- Add “AI Suggested” section (optional after v1)

### B) Search modal
Where: `canvas-web-app/components/canvas/SearchModal.tsx`
- Add AI query mode toggle
- Show matched snippets + summary

### C) Create modal behavior
Where: `canvas-web-app/components/canvas/CreateItemModal.tsx`
- Add helper text: “AI will auto-tag this item after save”

---

## 9) Prompt/Policy Design (Important)

Use strict structured outputs from model:

Expected JSON shape:
```json
{
  "category": "Research",
  "tags": ["ux", "whitepaper", "design"],
  "summary": "Short summary...",
  "confidence": 0.87
}
```

Rules:
- Max 1 category
- Max 5 tags
- Summary <= 220 chars
- If uncertain, set lower confidence (never fabricate)

Safety:
- Do not send sensitive raw fields unless needed
- Redact tokens/secrets/PII patterns before provider calls
- Log request ids, not raw payloads

---

## 10) Performance Plan

## 10.1 Backend performance
- Queue AI jobs (BullMQ + Redis) to avoid API latency spikes
- Set concurrency caps per worker
- Cache embeddings for unchanged content
- Avoid re-analysis unless content hash changed

## 10.2 Frontend performance
- Lazy-load AI metadata in lists
- Virtualize long result lists
- Debounce AI search input (300ms)
- Optimistic UI for item create/update

## 10.3 DB/query performance
- Add indexes for frequent filters:
  - `canvasId`
  - `category`
  - `updatedAt`
- If vector search enabled:
  - IVFFlat/HNSW indexes on embedding column

## 10.4 Performance SLO targets
- Item create API p95 < 350ms (AI must not block)
- AI analyze job p95 < 4s
- Search p95 < 500ms (keyword) / < 900ms (semantic)

---

## 11) Monetization Plan (Free + Paid)

## 11.1 Free tier (to drive growth)
- 3 canvases
- 200 AI analyses/month
- Basic AI tags + category
- No advanced semantic history

## 11.2 Pro tier (individual)
- Unlimited canvases
- 5,000 AI analyses/month
- Semantic search + similar items
- Priority processing
- Export summaries

## 11.3 Team tier
- Shared workspace analytics
- Admin controls
- Usage insights by member
- Increased AI limits + audit logs

## 11.4 Billing model options
1. Flat monthly (simple):
   - Pro: fixed price
2. Hybrid (best margin):
   - Base subscription + AI credit packs

## 11.5 Cost control guardrails
- Per-user monthly token cap
- Hard stop at cap (or degrade to keyword-only)
- Model routing:
  - cheap model for tagging
  - stronger model only for complex summarize/search tasks

---

## 12) Analytics & Product KPIs

Track from day 1:
- % items auto-categorized successfully
- AI acceptance rate (user keeps suggested category)
- Search success rate (clicked result / search)
- Time-to-first-result
- Daily active users using AI features
- Cost per active AI user

Business KPI:
- Free-to-Pro conversion after enabling AI

---

## 13) Rollout Strategy (Safe)

### Stage 1 (internal only)
- Enable AI for developer accounts
- Validate quality + latency

### Stage 2 (10% users)
- Feature flag rollout
- Monitor errors, cost, feedback

### Stage 3 (100% users)
- Turn on auto-analyze for all new items
- Backfill old items in batches

Rollback switch:
- `AI_ENABLED=false` instantly disables AI while preserving core app functionality.

---

## 14) Risk Register + Mitigations

1. **Wrong categorizations**
   - Add “Change category” quick action
   - Learn from corrections later

2. **High AI cost**
   - Hard usage caps + cheaper model routing
   - Batch processing for old items off-peak

3. **Latency spikes**
   - Async queue + retries + circuit breaker

4. **Vendor lock-in**
   - Provider abstraction layer in `ai.service.js`

5. **Privacy concerns**
   - Redaction + data minimization + retention policy

---

## 15) What to Build After AI v1 (Enhancement Roadmap)

## AI Feature Enhancements
1. Auto-foldering suggestions (“Move these 12 items into ‘Q1 Research’?”)
2. AI canvas digest (daily/weekly summary)
3. Duplicate/near-duplicate detection
4. “Ask your canvas” conversational retrieval
5. Smart reminders from stale important notes

## Non-AI Product Enhancements
1. Real-time collaboration cursors and comments
2. Better offline sync conflict resolution
3. Version history for canvas items
4. Public share pages with SEO metadata
5. Templates marketplace

## Performance/engineering enhancements
1. Background sync prioritization queues
2. Edge caching for dashboard list APIs
3. Image/PDF thumbnail generation pipeline
4. Event-driven activity feed materialization

---

## 16) Concrete Execution Checklist

### Week 1 (must-have)
- [ ] Add Prisma AI fields + migration
- [ ] Build `aiProvider` + `ai.service`
- [ ] Add analyze endpoint + route
- [ ] Trigger auto-analyze on item create (non-blocking)
- [ ] Add minimal UI badges for category + tags

### Week 2 (high impact)
- [ ] Add summarization for links/docs
- [ ] Add semantic search endpoint
- [ ] Add AI mode in search UI (mobile + web)
- [ ] Add analytics events + dashboard

### Week 3 (growth + monetization)
- [ ] Add usage metering per user
- [ ] Add free-tier limits and paywall prompts
- [ ] Add billing integration and credit packs
- [ ] Add admin usage view for team accounts

---

## 17) Final Recommendation

Start with **modular in-repo integration** now, ship AI v1 quickly, and validate:
- user value (search + organization)
- infra cost
- conversion impact

Then decide whether to extract AI service as traffic grows.

This path gives the fastest learning cycle with the lowest engineering risk.
