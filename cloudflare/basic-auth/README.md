# Cloudflare Basic Auth Gate

This folder contains the Worker that protects the GitHub Pages site behind a Basic Auth prompt.

## What it does

- Requires HTTP Basic Auth before the site is served.
- Uses `ORIGIN_BASE_URL` to proxy requests to the existing GitHub Pages origin.
- Keeps credentials out of source control by expecting secrets or environment bindings.

## Files

- `src/worker.js`: Worker entry point.
- `wrangler.toml`: Worker configuration template.
- `.dev.vars.example`: Local credential example for testing.

## Setup

1. Copy `.dev.vars.example` to `.dev.vars` for local testing if you want a convenience file.
2. Set the Worker secrets in Cloudflare or via Wrangler:
   - `BASIC_AUTH_USER`
   - `BASIC_AUTH_PASSWORD`
3. Bind the Worker to the custom domain route that should serve the docs.
4. Keep `ORIGIN_BASE_URL` pointed at the GitHub Pages origin, for example `https://ricardotran92.github.io/chinese-docs`.

## Notes

- The direct `github.io` origin is still a separate public endpoint; the secure entry point is the custom domain routed through the Worker.
- If you want to rotate the password later, update the Worker secret only.
