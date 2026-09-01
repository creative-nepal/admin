---
name: cms-block-editor
description: >
  Work on the CMS authoring UI in creative-nepal-admin — src/features/content/ page list, block
  editor, navigation editor — including adding the editor half of a new block type and the draft
  preview flow. Use when a block type was added in creative-nepal-api and creative-nepal-web,
  when block fields change, or when the page editor needs a new control.
---

# The CMS authoring UI

`src/features/content/` edits `content_pages`, `content_page_translations` and
`content_navigation` through the API's admin controller. A page body is an ordered array of
**typed blocks** (`hero`, `features`, `richText`, `faq`, `cta`) — never raw HTML, so an author
cannot inject markup into the public site. Hrefs are restricted server-side to site paths and
`http(s)`/`mailto`/`tel`; the form mirrors that with `SAFE_HREF` in `schemas.ts`.

Layout:

```
types/index.ts     ContentBlockType, BLOCK_TYPES, blockTypeOptions(t), createBlock(type)
schemas.ts         zod form schemas + toBlockFormValues / toBlockPayload conversions
components/block-editor.tsx    add / reorder / remove blocks
components/block-fields.tsx    per-type field UI
views/page-editor-view.tsx     the composition
```

`schemas.ts` holds the **two conversions** the editor depends on: `toBlockFormValues(block)`
(API shape -> form shape, optionals become `""` so inputs stay controlled) and
`toBlockPayload(values)` (form shape -> API shape, empty strings dropped). A new field must be
handled in both or it silently fails to save.

## Adding the editor half of a block type

This repo is **last**: `creative-nepal-api` (schema + Zod), then `creative-nepal-web`
(types + renderer), then here.

1. `types/index.ts` — add the literal to `ContentBlockType` and `BLOCK_TYPES`, add the `XBlock`
   interface to the `ContentBlock` union, and add a default shape in `createBlock(type)`.
2. `schemas.ts` — add `xSchema` to the block discriminated union, then extend
   `toBlockFormValues` and `toBlockPayload`. Reuse `href` / `optionalHref` / `optionalImage` /
   `requiredText` / `optionalShortText` / `optionalLongText`; do not write a looser href regex
   than the API's — the server rejects it anyway, but the author gets a worse error.
3. `components/block-fields.tsx` — add the field UI. Repeating items use `useFieldArray`
   imported from `@/components/form/form` (never from `react-hook-form`), with
   `keyName: "_uid"`.
4. i18n: add `ui.admin.content.blockType.<type>` and `ui.admin.content.blockHint.<type>` in
   `../api` (both `en/ui.json` and `ne/ui.json`) — `blockTypeOptions(t)` reads them, and a
   missing key shows the raw key in the block picker.
5. `bun run check-types && bun run lint`.

## Draft preview

Preview goes through **this repo's own** `/api/preview`, which attaches
`CONTENT_PREVIEW_SECRET` server-side and redirects to the web app's `/api/preview`. The secret is
never exposed to the browser — do not move it into a client component or a
`NEXT_PUBLIC_*` variable. It must match the value in `../api` and `../web`.

## Rules

- Every author-visible label is an i18n key (`i18n-strings` skill); the page list is a
  server-driven `DataTable` (`feature-module` skill).
- The editor's forms go through `<Form schema={...}>` from `@/components/form/form`; array
  helpers are re-exported there.
- Anything under `src/components/{ui,form,composed}` is shared byte-for-byte with `../web` —
  `shared-ui-change` skill before touching it.
