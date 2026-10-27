# Contributing

Keep Beauty small and useful for reading. Prefer semantic HTML, native browser behavior, logical
properties and readable CSS. New JavaScript behavior and framework-specific components belong in
consuming websites, not the core library.

1. Install with `npm ci` on Node 22 or newer.
2. Edit `src/`, never generated `dist/` files. Document changes to public tokens or behavior.
3. Run `npm run format`, `npm run check`, and `npm run test:browser` after installing Playwright's
   Chromium, Firefox and WebKit engines.
4. Review English/Russian examples at 320 px and desktop widths, both palettes and keyboard focus.
5. Include the generated distributables and a changelog entry with a focused change.

Use meaningful regression cases. Test behavior such as scope isolation or keyboard usability rather
than duplicating the implementation. Keep dependency versions exact; Dependabot proposes updates
that must pass the same checks. Report a bug with the browser, a small HTML example and expected
behavior at https://github.com/zavarovkv/beauty-css/issues.
