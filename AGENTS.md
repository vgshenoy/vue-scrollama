Monorepo workspace for package `vue-scrollama`.

# Agent Notes

## README Sync Source Of Truth

- Root `README.md` is the source of truth.
- `packages/vue-scrollama/README.md` is generated/synced.
- Do not edit package README directly for content changes.
- For README edits:
  1. edit root `README.md`
  2. run `pnpm run sync:readme`
  3. verify with `pnpm run sync:readme:check`
