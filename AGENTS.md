# Repository Guidelines

## Project Structure & Module Organization

This is a React 19 + TypeScript frontend built with Vite. Application code lives in `src/`: route setup starts in `src/App.tsx`, rendering starts in `src/main.tsx`, page-level views are in `src/pages/`, reusable UI is in `src/components/`, shared state is in `src/context/`, configuration data is in `src/config/`, and shared TypeScript shapes are in `src/types/`. Static public assets such as favicons and icon sprites live in `public/`; imported source assets live in `src/assets/`. Build output is generated in `dist/` and should not be edited directly.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server with hot module replacement.
- `npm run build`: run TypeScript project checks with `tsc -b`, then create the production bundle.
- `npm run lint`: run ESLint over the repository.
- `npm run preview`: serve the built `dist/` bundle locally for production checks.

## Coding Style & Naming Conventions

Use TypeScript and functional React components. Follow the existing style: two-space indentation, single quotes, no semicolons, and named interfaces for component props where useful. Name React components and page files in `PascalCase` such as `StudentDashboardPage.tsx`; name hooks and helpers in `camelCase`; keep shared types in `src/types/*.ts`. Prefer colocated UI logic inside the component until it is reused. Styling currently uses Tailwind utility classes in JSX plus global CSS in `src/index.css` and `src/App.css`.

## Testing Guidelines

No test runner is currently configured. Before submitting changes, run `npm run lint` and `npm run build`. If tests are added, prefer Vitest with React Testing Library, place tests beside the implementation as `ComponentName.test.tsx`, and cover routing, auth context behavior, and student onboarding flows.

## Commit & Pull Request Guidelines

This workspace has no local Git history, so no project-specific commit convention can be inferred. Use concise imperative commits, for example `Add student onboarding validation` or `Fix protected route redirect`. Pull requests should include a short summary, validation commands run, linked issue or task, and screenshots or screen recordings for visible UI changes.

## Agent-Specific Instructions

Keep edits scoped to source files, configuration, or documentation. Do not modify `dist/`, `node_modules/`, or generated lockfile content unless dependency changes require it.
