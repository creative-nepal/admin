# creative-nepal-admin

Platform admin dashboard. Next.js 16, React 19, Tailwind v4. Port 3001.

Part of a three-repo system with [`api`](../api) (3333) and [`web`](../web) (3000).

## Getting started

Requires [bun](https://bun.sh) 1.3.14 and a running API.

```sh
bun install
cp .env.example .env
bun run dev
```

## Scripts

```sh
bun run dev            # dev server
bun run build          # production build
bun run start          # serve the build
bun run lint           # biome check
bun run format         # biome format --write
bun run check-types    # next typegen && tsc --noEmit
```

## Layout

```
src/
  app/                    routes
  features/               feature folders; content/ is the CMS editor
  components/ui|form|composed, hooks/, lib/, styles/   shared with web
  providers/ stores/ types/
  proxy.ts
scripts/sync-ui.sh        keeps shared paths in sync with web
```

## Shared design system

The shared paths must stay identical to `web`. After changing them:

```sh
./scripts/sync-ui.sh diff    # show drift
./scripts/sync-ui.sh push    # copy to web
./scripts/sync-ui.sh pull    # copy from web
```

## Notes

- `CONTENT_PREVIEW_SECRET` must match the API and web.
- See `CLAUDE.md` for the CMS block contract.
