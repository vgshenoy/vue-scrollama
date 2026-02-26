# Releasing `vue-scrollama`

This repo publishes from tags using `.github/workflows/release.yml`.

## Pipelines at a glance

- CI checks: `.github/workflows/ci.yml`
  - Trigger: every `push` and `pull_request`
  - Runs build, test, lint, typecheck
  - Does not publish to npm
- npm publish: `.github/workflows/release.yml`
  - Trigger: tag push matching `v*` (or manual `workflow_dispatch`)
  - Publishes `vue-scrollama` using `NPM_TOKEN`
- Example app deploy: Vercel Git integration (configured in Vercel)
  - Trigger: pushes/PRs based on Vercel project settings
  - Not controlled by GitHub Actions in this repo

## One-time setup

1. Create npm granular access token with publish access to `vue-scrollama`.
   - Go to `npmjs.com -> Access Tokens -> Generate New Token -> Granular Access Token`.
   - Fill form as follows:
     - **Token name**: `github-actions-release-vue-scrollama` (or similar unique name)
     - **Description**: `GitHub Actions release publish for vue-scrollama`
     - **Bypass two-factor authentication (2FA)**: checked
     - **Allowed IP ranges**: leave empty (GitHub Actions IPs vary)
     - **Packages and scopes -> Permissions**: `Read and write`
     - **Packages and scopes -> Select Packages**: `Only select packages and scopes`
     - **Packages and scopes -> Selected entries**: `vue-scrollama` (and scope if applicable)
     - **Organizations**: `No access` (unless you explicitly need org settings access)
     - **Expiration**: choose a fixed date (for example 90 days) and rotate before expiry
   - Click **Generate Token** and copy it immediately (npm only shows full token once).
2. Add GitHub Actions secret:
   - `Settings -> Secrets and variables -> Actions -> New repository secret`
   - Name: `NPM_TOKEN`
   - Value: your npm granular access token

## Standard release flow

1. Make sure `main` is clean and up to date.
2. Bump version in `packages/vue-scrollama/package.json`.
3. Sync root README to package README:
   - `pnpm run sync:readme`
4. Run local quality gates:
   - `pnpm run build`
   - `pnpm run test`
   - `pnpm run lint`
   - `pnpm run typecheck`
5. Commit and push version bump to `main`.
6. Create and push tag that matches package version:
   - `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
   - `git push origin vX.Y.Z`
7. GitHub Actions `Release` workflow runs and publishes to npm.

## Dist-tags

- Stable version (example `3.0.0`) publishes as `latest`.
- Prerelease version (example `3.1.0-rc.1`) publishes as `next`.
- Manual trigger (`workflow_dispatch`) can override with `latest` or `next`.

## Important guardrails

- Tag/version must match exactly.
  - Example: tag `v3.0.0` requires `packages/vue-scrollama/package.json` version `3.0.0`.
- If they do not match, release job fails intentionally.

## If release fails

1. Open GitHub Actions run logs for `Release`.
2. Fix root cause (most common: missing/invalid `NPM_TOKEN`, version mismatch).
3. Re-run the workflow from GitHub Actions UI.
4. If needed, trigger `Release` manually with `workflow_dispatch`.

## Verify publish

- `npm view vue-scrollama version`
- `npm view vue-scrollama dist-tags`
