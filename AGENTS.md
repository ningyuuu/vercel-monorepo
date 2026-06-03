# Monorepo Agent Guide

## Dev Servers

Each app runs its own dev server on a dedicated port. Do **not** stop or kill any dev server unless explicitly asked to by the user.

| App | Port |
|-----|------|
| guitar | 3006 |
| timestable | 3000 |
| document_data | 3001 |
| web | 3002 |
| docs | 3003 |
| innoquest | 3004 |

When developing features, always verify using DevTools MCP that it displays correctly.

## General

- Follow existing code style and patterns in each app.
- Prefer minimal changes. Reuse components from `@repo/ui` where possible.
- Run `pnpm --filter <app> check-types` after changes.
