# Working on Beauty.css

Beauty is an independent CSS library. Hugo Mini is a consumer, never a build/runtime dependency.

- Read `README.md` and `docs/architecture.md` before changing the public API.
- Edit canonical CSS in `src/`; regenerate `dist/` with `npm run build`.
- Keep both classless and `.beauty` prose entries working from the same sources.
- Use the `--beauty-` namespace, low specificity, logical properties and the `beauty` layer.
- Preserve native semantics, visible focus, print and light/dark/system schemes.
- No required JavaScript, fonts, remote requests, framework adapters or install hooks in the core.
- Demo-only layout and JavaScript live under `site/assets/`; demo content is built by
  `scripts/build-site.mjs`. Russian copy uses U+0435 rather than U+0451.
- Run `npm run check` and `npm run test:browser` for style/build changes; inspect desktop/mobile.
- Run `npm pack --dry-run` after changing package metadata or distribution paths.
- Keep dependencies exact and lockfile committed. Do not add build tools to consuming websites.
- Update the changelog for visible changes. Never publish npm packages, create a release/tag or
  deploy the demo without the user's explicit request.
