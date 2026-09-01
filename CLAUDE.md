@AGENTS.md

# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

`creative-nepal-admin` — the internal admin dashboard, Next.js 16 (App Router), port 3001.
Standalone repo, extracted from a Turborepo monorepo. Siblings: `creative-nepal-api` (backend,
port 3333) and `creative-nepal-web` (public site, port 3000). No workspace or package dependency
on either — they are coupled only over HTTP and by the shared contracts listed at the bottom.

All three are checked out side by side under `creativenepal-platform/` as `api/`, `web/` and
`admin/`. Each is an independent git repository; the parent folder is convenience only.

Session-gated, built around the `DashboardShell` composed component (sidebar + `SidebarProvider`).
`src/features/content/` is the CMS authoring UI (page list, block editor, navigation editor).

## Commands

Package manager is **bun** (bun 1.3.14, `bun.lock` present — do not use npm/yarn/pnpm). CLI
generators (`shadcn`) must be invoked via **`bunx`, never `npx`**.

```sh
bun run dev            # next dev -p 3001, http://localhost:3001
bun run build          # next build
bun run start          # next start -p 3001
bun run lint           # biome check
bun run format         # biome format --write
bun run check-types    # next typegen && tsc --noEmit
```

Requires `creative-nepal-api` running on `NEXT_PUBLIC_API_URL` (see `.env.example`).

## Design system lives here, and is duplicated

`src/components/ui/` (raw shadcn primitives), `src/components/form/` (RHF+Zod field components)
and `src/components/composed/` (DataTable, DashboardShell, ConfirmDialog, …) used to be a shared
`@repo/ui` workspace package. They are now a **copy**, byte-identical to the copy in
`creative-nepal-web`. Same for `src/hooks/`, `src/lib/utils.ts`, `src/lib/formatters/`,
`src/lib/api-client/` and `src/styles/globals.css`.

**A change to any of those paths must be mirrored into the web repo.** Use the helper:

```sh
./scripts/sync-ui.sh diff    # show drift against ../web (exit 1 if any)
./scripts/sync-ui.sh push    # overwrite the web copy from this one
./scripts/sync-ui.sh pull    # overwrite this copy from web's
```

Nothing enforces this in CI — the two repos are never checked out together. Run `diff` before
opening a PR that touches those paths.

- New shadcn primitives: `bunx shadcn@latest add <name>` from this repo root (`components.json`
  aliases resolve to `@/components/*`), then `./scripts/sync-ui.sh push`.
- `src/components/ui/` has relaxed Biome rules (the `overrides` block in `biome.json`) since it is
  vendor-managed and shouldn't diverge from upstream just to satisfy house lint rules.
- `DataTable` is **always server-driven** — sorting/filtering/pagination are required controlled
  props (`manualSorting`/`manualFiltering`/`manualPagination` are hardcoded `true`); it never
  re-sorts or re-paginates client-side. Built on TanStack Table **v9**'s real pluggable-feature API
  (`useTable({ features, ... })`, `table.FlexRender`) — not the v8-style
  `useReactTable`/`getCoreRowModel` API, and not the `/legacy` compat shim.
- `<Form schema={zodSchema}>` owns the React Hook Form context; every `*Field` reads it via a
  shared `useFormField` hook — never wire RHF directly in app code. The CMS block editor and the
  nav-link editor do need RHF's array helpers, so `src/components/form/form.tsx` re-exports
  `useFieldArray`/`useFormContext`/`useWatch`; import them from `@/components/form/form`, never
  from `react-hook-form` directly.

## Internationalization

Catalogues are served by the API (`GET /api/v1/i18n/:lang`), not stored here. **No user-visible
string is hardcoded in a component.**

- Client components: `const { t } = useTranslation()` (`features/i18n/hooks/use-translation`), then
  `t("ui.admin.plans.title")`. Placeholders interpolate: `t("ui.admin.content.deleted", { slug })`.
- Server Components and route handlers: `const { t, locale } = await getTranslations()`
  (`features/i18n/server`). It resolves the locale from the `creative-nepal-language` cookie and
  caches the catalogue fetch under the `i18n` tag.
- The root layout fetches the catalogue on the server and hands it to `Providers`, which seeds the
  client query and the first-render locale. Without that, every client component would paint raw
  keys until the catalogue request resolved.
- Module-scope data (DataTable column definitions, select options, nav items, KOT actions) cannot
  call a hook, so those files export factories taking `t` — `planColumns(t)`, `sectorOptions(t)`,
  `navItemsForSector(sector, t)`. Views wrap them in `useMemo(() => planColumns(t), [t])`.
- Adding a string means adding the key to `en/ui.json` **and** `ne/ui.json` in `creative-nepal-api`.

## CMS authoring

`src/features/content/` edits `content_pages` + `content_page_translations` + `content_navigation`
in the API. A page body is an ordered array of **typed blocks** (`hero`, `features`, `richText`,
`faq`, `cta`) — never raw HTML, so an author cannot inject markup into the public site. Hrefs are
restricted server-side to site paths and `http(s)`/`mailto`/`tel`.

Draft preview goes through this repo's own `/api/preview`, which attaches `CONTENT_PREVIEW_SECRET`
server-side and redirects to the web app's `/api/preview`. The secret is never exposed to the browser.

## Cross-repo contracts

- **CMS block contract** — adding a block type means changing three repos in order:
  `creative-nepal-api` (`src/database/schema/content.ts` + `src/modules/content/content.schema.ts`),
  then `creative-nepal-web` (`src/features/content/types` + `components/block-renderer.tsx`), then
  here (`src/features/content/types` + `schemas.ts` — the editor's form shapes and their conversions
  to and from the API payload).
- **i18n keys** — live in `creative-nepal-api`; adding one needs no release here.
- **Shared secrets** — `CONTENT_PREVIEW_SECRET` must match the API's and the web app's.

## Skills

Task procedures live in `.claude/skills/` and load on demand — this file stays the always-on
facts. Available here:

- `feature-module` — the `src/features/<name>/` slice: services, queries, mutations,
  search-params, views.
- `shared-ui-change` — mirroring the duplicated design system into `../web` with
  `scripts/sync-ui.sh`.
- `i18n-strings` — `useTranslation()` / `getTranslations()` / `t`-factories, and where keys live.
- `cms-block-editor` — the authoring UI, the form↔API block conversions, and draft preview.

### Installed from the registry

Third-party skills are vendored under `.agents/skills/<name>/` with a symlink from
`.claude/skills/<name>/` — both are committed, so a fresh checkout gets them. Manage with the
skills CLI, and note **`npx` fails inside this repo** (`devEngines.packageManager` pins bun):

```sh
bunx skills add <owner/repo@skill> -y   # install
bunx skills update                      # update everything installed here
```

- `vercel-react-best-practices` (vercel-labs/agent-skills, 678K installs) — React/Next
  performance rules from Vercel.
- `shadcn` (shadcn/ui, 272K installs) — the shadcn CLI/registry workflow, matching
  `components.json` here. Remember `bunx`, never `npx`, and `./scripts/sync-ui.sh push` after.
- `frontend-design` (anthropics/skills, 838K installs) — visual/UI design guidance.
- `code-review` and `diagnosing-bugs` (mattpocock/skills, 451K / 509K installs) — a two-axis
  diff review and a debugging loop. Claude Code already ships a built-in `/code-review`, so this
  one is listed scoped as `<repo>:code-review` — pick that one for files in this repo.

**These predate Next.js 16.** Where third-party React/Next guidance disagrees with `AGENTS.md`,
`node_modules/next/dist/docs/` or the repo skills above, the repo wins.
