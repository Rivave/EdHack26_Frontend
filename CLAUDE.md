# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (localhost:5173)
npm run build     # type-check + production build
npm run lint      # ESLint
npm run preview   # serve the production build locally
```

There are no tests configured yet.

## Architecture

**Stack:** React 19 + Vite 8 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite`) + React Router v7.

**Auth flow (mock):** All auth logic lives in `src/context/AuthContext.tsx`. Currently it uses an in-memory array (`mockUsers`) to simulate a backend. When the FastAPI backend is ready, replace the `login` and `register` functions in that file with `fetch` calls — the rest of the app does not need to change.

**Routing:** `src/App.tsx` defines all routes. `ProtectedRoute` redirects unauthenticated users to `/login`; `PublicRoute` redirects authenticated users to `/dashboard`. Both wrap route elements directly.

**Types and constants:** `src/types/auth.ts` is the single source of truth for `UserRole`, form data shapes, `User`, and `AVAILABLE_COURSES`. Add new courses there.

**TypeScript strictness:** `verbatimModuleSyntax` is enabled — types must use `import type`. `noUnusedLocals` and `noUnusedParameters` are enforced.

## Key conventions

- Tailwind utility classes only — `src/index.css` has just the `@import "tailwindcss"` directive plus a box-sizing reset.
- `src/App.css` is unused and can be removed.
- No path aliases configured; use relative imports.
