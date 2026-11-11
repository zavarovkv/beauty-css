# Changelog

## Unreleased

- Expose `--beauty-footnote-line-height` to tune note leading independently; its default `inherit` preserves existing layouts in both entries.

- Add `--beauty-dropcap-rise` for raised initials without changing their sink line, text semantics or print fallback.

- Expose `--beauty-dropcap-margin-block-end` (default `0`) so consumers can tune descender wrapping for their font without moving or resizing the initial.

- Add opt-in `beauty-dropcap` with configurable font and three-/two-line initials; preserve text, prose scope, print and unsupported-browser fallback. Reserve enough paragraph height even for a short opening. The classless minified entry grows by less than 200 gzip bytes; raise its checked budget from 4.5 to 4.75 KiB.

- Add opt-in hanging opening quotes, old-style proportional prose numerals, lining-figure exceptions and explicit composed fractions, shared by classless and prose entries.

- Keep footnote references out of paragraph line-box height while preserving native focus and links.
- Add the `beauty-caption-credit` modifier for short attributions, keeping ordinary captions upright and start-aligned by default.
- Size decorative inline SVGs in `beauty-link-icon` relative to text and align them to the baseline.

- Add opt-in page-title hyphenation through `--beauty-h1-hyphens` and
  `--beauty-h1-hyphen-limit`, shared by classless and prose entries. Keep the default
  manual hyphenation and existing heading layout; consumers select the viewport range.

- Keep both minified entries below a reviewed 4.5 KiB gzip budget after adding shared footnotes (about 4.2 KiB for the classless entry).

- Let ordinary ordered-list markers inherit text weight. Set the default item gap to 0.875rem (14 px) and the responsive indentation to min(2.5rem, 8%) (up to 40 px).
- Add reusable `beauty-footnotes`, `beauty-footnote-ref` and `beauty-footnote-backref` helpers in both entries, with quiet superscripts, hanging native counters, preserved focus and configurable sizing/spacing.

- Expose `--beauty-emphasis-offset` to adjust the wavy underline for a chosen font, retaining the default 0.25em in both entries.

- Use `--beauty-heading-weight` for table column headings in both entries, so custom font families use their configured bold face.

- Expose `--beauty-fine-print-size` for readable attribution sizing in both entries, retaining the default 0.75rem.

- Use a 0.5 CSS px table-header rule on high-density screens (2dppx and above), preserving 1px on standard screens and in print.

- Remove the extra gap below table column headings in both entries, retaining the shared 1px rule.

- Give the documentation site an editorial graphite paragraph mark, with light/dark wordmarks
  and a theme-adaptive SVG favicon. The CSS library remains unchanged.

- Keep balanced wrapping for page titles while letting `h2`–`h6` wrap naturally across
  screen sizes. Expose a separate section-heading wrapping token for both CSS entries.

- Bring table column headings closer to a thin rule in their text color, shared by
  classless and prose tables. Expose cell padding and heading-to-rule spacing tokens.

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
