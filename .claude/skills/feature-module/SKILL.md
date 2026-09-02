---
name: feature-module
description: >
  Build a feature slice in creative-nepal-admin — src/features/<name>/ with services, queries,
  mutations, search-params, schemas, components and views, wired to a route under
  src/app/(dashboard). Use when adding a dashboard screen, a DataTable list, a create/edit
  sheet, or any new call to creative-nepal-api from this repo.
---

# Feature slice layout

Reference implementation: `src/features/plans/` — copy its shape. `src/features/users/` is the
same pattern with feature-local hooks.

```
src/features/<name>/
  types/index.ts          API response shape + form input shape
  services.ts             axios calls only — the only file that knows URLs
  queries.ts              `<name>QueryKeys` + `queryOptions` factories
  mutations.ts            `useCreateX` / `useUpdateX` / `useArchiveX` + invalidation
  search-params.ts        nuqs parsers for sort / filter / page state
  schemas.ts              zod schemas for the forms
  components/             <name>-columns.tsx, <name>-form-sheet.tsx, <name>-row-actions.tsx
  views/<name>-view.tsx   the "use client" composition the route renders
```

Route files under `src/app/(dashboard)/<name>/page.tsx` stay thin — they render the view inside
`DashboardShell`. Business logic does not live in `app/`.

## Rules

- **Never call `axios`/`fetch` from a component.** Components use
  `useQuery(<name>QueryOptions(params))` and the hooks from `mutations.ts`; only `services.ts`
  builds URLs (`api.get<PaginatedResult<T>>("/api/v1/...")` from `@/lib/api`).
- Query keys: export a `<name>QueryKeys` object from `queries.ts` (`all`, `list(params)`), and
  match the canonical shape documented in `src/lib/api-client/query-keys.ts`. Key parts must be
  JSON-serializable — no Dates, class instances or functions. List options set
  `placeholderData: (previous) => previous` so the table does not flash between pages.
- `mutations.ts` owns invalidation: one `useInvalidate<Name>()` helper calling
  `queryClient.invalidateQueries({ queryKey: <name>QueryKeys.all })`, reused by every mutation
  hook. Components never construct a `useMutation` inline.
- **Table state lives in the URL.** `search-params.ts` exports nuqs parsers
  (`parseAsStringEnum([...sortable]).withDefault(...)`, `parseAsInteger.withDefault(0)`) and the
  view reads them with `useQueryStates`. The sortable enum must match the API's `SORTABLE` map
  for that resource. Reset `pageIndex: 0` on any sort or filter change.
- Lists are **server-driven**: the API returns `{ data, total, limit, offset }` — pass
  `data?.data ?? []` and `rowCount={data?.total ?? 0}`, and translate the pageIndex/pageSize into
  `limit`/`offset` in `services.ts`. `DataTable` never re-sorts or re-paginates client-side.
- Column definitions and option lists are module scope and cannot call a hook, so export a
  **factory taking `t`** — `planColumns(t)`, `sectorOptions(t)`, `navItemsForSector(sector, t)` —
  and wrap it in the view with `useMemo(() => planColumns(t), [t])`.
- Forms: `<Form schema={zodSchema}>` from `@/components/form/form` owns the RHF context; `*Field`
  components read it via `useFormField`. Never call `useForm` in app code; import
  `useFieldArray`/`useFormContext`/`useWatch` from `@/components/form/form`, never from
  `react-hook-form`.
- **No hardcoded user-visible strings** — `i18n-strings` skill; keys are namespaced `ui.admin.*`.
- Anything under `src/components/{ui,form,composed}`, `src/hooks`,
  `src/lib/{utils.ts,formatters,api-client}` or `src/styles/globals.css` is shared byte-for-byte
  with the web repo — `shared-ui-change` skill before editing there.

## Verify

```sh
bun run check-types      # next typegen && tsc --noEmit
bun run lint             # biome check
bun run dev              # port 3001; needs creative-nepal-api on NEXT_PUBLIC_API_URL
```

bun only — no npm/yarn/pnpm; generators via `bunx`.

## The sector list is server-driven

Sectors come from `GET /api/v1/platform/sectors` via `features/sectors/` — `useSectorOptions()`
for a filter or select, `useSectorLabel()` for a badge. There is no local sector enum or label
map: a clone enables its own sectors with `SECTORS_ENABLED`, so a hardcoded list offers options
its own API will reject, and a hardcoded `SECTOR_LABELS` map bypasses i18n entirely (which is
what it used to do). Plan feature-flag fields come from the same response's `planFeatureKeys`.

`PlanInput.sector` is typed `string` for the same reason — the API validates it against the
sectors that deployment actually enables.
