# Changelog

## Unreleased

## 0.3.0 — 2026-10-28

- Add an optional reading measure, native balanced/pretty wrapping, caption proximity and shared compound-link treatments.
- Keep reading text at the base 1rem size by default on desktop and mobile.
- Expose underline geometry and color tokens so consumers can replace border-based decorations consistently.
- Remove unused build/demo metadata and update the documented size budget.

## 0.2.1 — 2026-10-28

- Expose quotation surface, block spacing and remaining padding through tokens so a host can match
  native block quotations to callouts without duplicating CSS selectors.
- Trim the first paragraph's top margin in every block quotation, matching the existing callout rhythm.

## 0.2.0 — 2026-10-28

- Complete the shared typography API for headings, rhythm, links, quotations and code.
- Add optional editorial treatments for leads, captions, emphasis, fine print and callouts.
- Keep the native H3–H6 hierarchy and use a consistent 48rem heading breakpoint.
- Restore a saved demo theme after CSS loads and resolve root styles before parsing native selects,
  avoiding stale ancestor styles in WebKit.
- Publish verified GitHub releases to npm through a trusted OIDC relationship, with provenance and
  separate `latest`/`next` tags for stable/prerelease versions.

## 0.1.1 — 2026-10-27

- Improved the npm/GitHub overview with installation first, entry comparison, feature summary and status badges.
- Added a prominent author credit and website link, with a clear MIT license section.
- Pointed package documentation and download links to the published GitHub documentation and release assets.

## 0.1.0 — 2026-10-27

- Extracted a framework-independent reading foundation from Hugo Mini.
- Added classless page and scoped prose entries from one canonical CSS source.
- Added system/light/dark palettes, public tokens, native forms, logical spacing and print styles.
- Added semantic quotations, responsive media and opt-in local scrolling for wide tables.
- Added deterministic minified builds, checksums, package exports and a distribution allowlist.
- Added English/Russian documentation, representative HTML specimens and automated checks.
