# Changelog

## Unreleased

- Preserve example email addresses and copyable HTML when the demo is served through Cloudflare's
  email obfuscation, without changing the host site's settings.

- Expand the independent bilingual documentation site into 17 live specimens with copyable HTML,
  all public helpers, generated palette/token references, responsive contents and optional local UI.
  Support a Russian root with English at `/en/` when the demo is hosted independently.

- Restore placeholder color and opacity in both CSS entries by keeping the pseudo-element outside `:where()`; scoped and opted-out controls remain isolated.

- Honor `--beauty-heading-weight` for semantic emphasis (`strong`, `b`, `dt`) in both entries, matching the documented customization contract while retaining the 600 default.

- Add `beauty-steps`, a reusable connected ordered list with numbered circles, shared text rhythm, logical positioning and configurable spacing in both CSS entries.

- Make mobile numeric highlights more prominent with a 2.5rem minimum and a steeper responsive scale, keeping the desktop maximum unchanged.

- Add `beauty-note` for secondary instructions with quiet, readable text and ordinary link weight.

- Add `beauty-heading-compact` for short card and step headings with a tighter multiline rhythm.

- Add `beauty-step-marker` for quiet numbered steps, using the shared heading font and adaptive accent palette.

- Add optional `beauty-stat-value`, `beauty-stat-label` and `beauty-stat-unit` treatments for responsive numeric highlights, with tabular numerals and the `--beauty-stat-size` and `--beauty-stat-color` tokens.

- Wrap long code and sample-output tokens when printing, in both classless and prose entries; screen scrolling is unchanged.

## 0.4.0 — 2026-10-29

- Add `beauty-nav-end` for trailing header actions, with logical alignment and wrapping on narrow pages.

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
