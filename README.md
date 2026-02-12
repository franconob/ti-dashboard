# Augur Security — Threat Intelligence Dashboard

> Frontend Engineering Take-Home Assignment

## Overview

Build a **Threat Intelligence Dashboard** that displays, filters, and explores threat indicators (malicious IPs, domains, file hashes, URLs). Your implementation should match the visual design provided in `design-reference.html` and consume data from the included mock API.

## Quick Start

```bash
npm install
npm run dev
```

This starts both the React dev server (`localhost:5173`) and the mock API (`localhost:3001`). The Vite dev server proxies `/api/*` requests to the API automatically.

## Design Reference

Open `design-reference.html` in your browser. This is your design spec — it includes:

- **Full dashboard mockup** — sidebar, stats, table, detail panel, filters
- **Complete color palette** — all CSS variables with hex values
- **Typography** — DM Sans (UI) + JetBrains Mono (technical data)
- **Component library** — badges, tags, buttons, confidence bars, inputs
- **Layout dimensions** — sidebar, panel, header, modal sizes
- **Interaction states** — hover, selected, focus, loading

Use browser DevTools to inspect exact values. All design tokens are defined as CSS variables in `:root`.

## API Documentation

Base URL: `http://localhost:3001` (proxied to `/api` in dev)

| Endpoint | Method | Description |
|---|---|---|
| `/api/indicators` | GET | Paginated indicator list |
| `/api/indicators/:id` | GET | Single indicator details |
| `/api/stats` | GET | Summary statistics |

### Query Parameters for `/api/indicators`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `severity` | string | — | Filter: `critical`, `high`, `medium`, `low` |
| `type` | string | — | Filter: `ip`, `domain`, `hash`, `url` |
| `search` | string | — | Partial match on value, source, or tags |

### Response Shape

```json
{
  "data": [
    {
      "id": "uuid",
      "value": "185.220.101.34",
      "type": "ip",
      "severity": "critical",
      "source": "AbuseIPDB",
      "firstSeen": "2025-11-08T14:22:00.000Z",
      "lastSeen": "2026-02-03T19:45:00.000Z",
      "tags": ["tor-exit", "botnet"],
      "confidence": 94
    }
  ],
  "total": 500,
  "page": 1,
  "totalPages": 25
}
```

## Project Structure

```
├── design-reference.html   ← Visual spec (open in browser)
├── server/
│   ├── index.js            ← Express API server
│   └── data.js             ← Mock data generator (500 indicators)
├── src/
│   ├── api/                ← Your API client functions
│   ├── components/         ← Your React components
│   ├── hooks/              ← Your custom hooks
│   ├── styles/             ← Your stylesheets
│   │   └── global.css      ← Base reset (extend as needed)
│   ├── types/
│   │   └── indicator.ts    ← TypeScript interfaces (provided)
│   ├── App.tsx             ← Entry component (start here)
│   └── main.tsx            ← React bootstrap
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## What To Build

Refer to the assignment document for full requirements. In short:

1. **Dashboard layout** — Sidebar navigation, page header, stats row, data table, detail panel
2. **Data table** — Fetch and display indicators with sorting by column
3. **Filtering** — Search input + severity/type/source dropdowns
4. **Detail panel** — Click a row to show full indicator details in a side panel
5. **State management** — Loading, error, and empty states
6. **Pagination** — Navigate through the full dataset

## Testing

```bash
npm test          # Run tests
npm run test:ui   # Run with Vitest UI
```

The project includes Vitest + React Testing Library. Write tests for your key components and hooks.

## Submission

1. Ensure `npm install && npm run dev` works cleanly
2. Ensure `npm test` passes
3. Add your notes below, then zip the project (excluding `node_modules`)

---

### Candidate Notes

**Architecture decisions:**

- **React Context + useReducer** for state management — single source of truth for filters, pagination, sorting, and selection. Reducer is split into its own file (`dashboardReducer.ts`) for testability and to satisfy react-refresh lint rules.
- **CSS Modules** throughout — scoped styles, no class name collisions, zero runtime cost. All design tokens are CSS custom properties in `global.css`.
- **AbortController** on every fetch hook to prevent stale responses and race conditions when filters change rapidly.
- **Stale-while-revalidate** pattern — when refetching, the table dims slightly and shows existing data rather than flashing a skeleton. Initial load still shows the shimmer skeleton.
- **Client-side sorting** on the current page (server sorts by lastSeen by default). Server-side sorting would be the right call for production but wasn't in the API spec.

**Trade-offs:**

- No virtualized table — with 20 rows per page, DOM performance is fine. For hundreds of visible rows, I'd reach for a virtual list.
- Source filter sends the exact string to the API (added `source` query param to `server/index.js`). In production, source IDs would be more robust than display names.
- Detail panel uses a fixed overlay approach. For a more complex app, a router-based panel (URL-driven) would be preferable.
- Tags-to-color mapping is a static lookup table. A deterministic hash-to-color function would scale better for arbitrary tag sets.

**What I'd add with more time:**

- Keyboard navigation within the table (arrow keys to move between rows)
- URL-synced filters (so browser back/forward works with filter state)
- E2E tests with Playwright against the running dev server
- Dark/light theme toggle
- Responsive breakpoints for smaller screens
