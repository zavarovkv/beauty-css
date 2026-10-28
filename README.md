# Beauty.css

[![npm version](https://img.shields.io/npm/v/beauty-css)](https://www.npmjs.com/package/beauty-css)
[![MIT license](https://img.shields.io/npm/l/beauty-css)](https://github.com/zavarovkv/beauty-css/blob/main/LICENSE)
[![Build](https://github.com/zavarovkv/beauty-css/actions/workflows/ci.yml/badge.svg)](https://github.com/zavarovkv/beauty-css/actions/workflows/ci.yml)

**Simple styles. Beautiful websites.**

A lightweight CSS library for beautiful, readable websites. Ordinary HTML gets calm typography,
comfortable spacing, visible links, tables, code, and native form controls. No runtime dependencies,
JavaScript, external requests, or bundled fonts.

Created by **[Konstantin Zavarov](https://zavarov.com/)**.

## Why Beauty

- **Made for reading.** A comfortable type scale, useful spacing and clear content hierarchy.
- **Two ways to use it.** Style a whole page or a single `.beauty` content container.
- **Small by design.** About 3 KiB gzip per minified entry, with no runtime dependencies.
- **Your HTML, your fonts.** Semantic elements, native controls and the font family you choose.
- **Easy to customize.** Named CSS variables and a low-priority cascade layer.
- **Light, dark and print.** System-aware colors, an explicit theme choice and practical print styles.

Beauty started as the typography in [Hugo Mini](https://github.com/zavarovkv/hugo-mini).
It works independently of Hugo and every JavaScript framework.

## Install

```sh
npm install beauty-css
```

With a CSS-aware bundler:

```css
@import "beauty-css";
/* Or, instead, style only a content container: */
@import "beauty-css/prose";
```

Choose one entry per page. Package imports need a bundler that supports CSS exports; plain browsers
use a downloaded CSS file or an actual URL. No build tools are needed for a plain HTML website.

| Entry              | Use it for                                      | Applies to            |
| ------------------ | ----------------------------------------------- | --------------------- |
| `beauty-css`       | A new blog, personal site or documentation page | The whole document    |
| `beauty-css/prose` | An article inside an existing site              | A `.beauty` container |

Ready-to-use CSS and package archives are also available in
[GitHub Releases](https://github.com/zavarovkv/beauty-css/releases/latest).
The API is pre-1.0; public selectors and tokens may change between minor releases.

## Start with one file

Download [`beauty.min.css`](https://github.com/zavarovkv/beauty-css/releases/latest/download/beauty.min.css), keep it with your website, and add:

```html
<link rel="stylesheet" href="beauty.min.css" />
```

Use ordinary HTML. No component classes are required:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>A place for words</title>
    <link rel="stylesheet" href="beauty.min.css" />
  </head>
  <body>
    <main>
      <h1>A place for words</h1>
      <p>Your story starts here.</p>
    </main>
  </body>
</html>
```

This entry owns the document typography and a centered page layout. Direct `body > header` and
`body > footer` elements receive page spacing; a quotation's footer remains a quotation footer.

## Load from a CDN

Published npm versions are also available through jsDelivr. For example, the stable 0.2.1 release
can be loaded directly without npm or a build step:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/beauty-css@0.2.1/dist/beauty.min.css" />
```

For a prose container, use `dist/beauty.prose.min.css` instead. Pin an exact version; change the
version only after reviewing an update. An unreleased local development build is not on the CDN.

## Add typography to an existing site

Use **only** [`beauty.prose.min.css`](https://github.com/zavarovkv/beauty-css/releases/latest/download/beauty.prose.min.css) and wrap your content in `.beauty`:

```html
<link rel="stylesheet" href="beauty.prose.min.css" />

<article class="beauty">
  <h1>Your words, your website</h1>
  <p>The surrounding page keeps its existing layout and controls.</p>
</article>
```

The prose entry does not select `html`, `body`, or anything outside a `.beauty` container. It supplies
font, colors and content styles inside that container, with no page width, margins or padding.
It uses the same source as the classless entry. Choose one entry per page.

Add `.not-beauty` to an embedded component to exclude it and its descendants from selector styling.
Normal CSS inheritance still applies; set that component's own font and colors if needed.

## Make it yours

Beauty lives in a single `@layer beauty`. Normal unlayered styles in your website take priority,
even when loaded before Beauty. Defaults use low-specificity selectors. No `!important` is needed
for ordinary customization.

Set variables on `:root` in classless mode, or on `.beauty` in prose mode:

```css
:root {
  --beauty-font: "Inter", system-ui, sans-serif;
  --beauty-width: 48rem;
  --beauty-link: #7250a5;
}

.beauty {
  --beauty-font-size: 1.125rem;
}
```

Fonts are always your choice. If you use a web font, host and load it in your website.

| Variable                  | Default (light)         | Purpose                      |
| ------------------------- | ----------------------- | ---------------------------- |
| `--beauty-font`           | System sans-serif stack | Text family                  |
| `--beauty-font-mono`      | System monospace stack  | Code family                  |
| `--beauty-font-size`      | `1rem`                  | Base text size               |
| `--beauty-font-weight`    | `400`                   | Text weight                  |
| `--beauty-line-height`    | `1.65`                  | Text leading                 |
| `--beauty-width`          | `45rem`                 | Classless page width         |
| `--beauty-space`          | `1.25em`                | Paragraph and block spacing  |
| `--beauty-radius`         | `0.35rem`               | Control and code radius      |
| `--beauty-background`     | `#ffffff`               | Page or container background |
| `--beauty-text`           | `#444444`               | Body text                    |
| `--beauty-heading`        | `#222222`               | Headings and emphasis        |
| `--beauty-muted`          | `#556677`               | Secondary text               |
| `--beauty-link`           | `#0060a0`               | Links, buttons and focus     |
| `--beauty-hover`          | `#b73700`               | Link and button hover        |
| `--beauty-border`         | `#d5dadd`               | Quiet content rules          |
| `--beauty-control-border` | `#7d8892`               | Visible control boundaries   |
| `--beauty-danger`         | `#b42318`               | Invalid field boundary       |
| `--beauty-surface`        | `#f5f6f7`               | Code and read-only controls  |
| `--beauty-mark`           | `#fff0b3`               | Highlight background         |

Advanced typography settings let a host theme configure Beauty without duplicating its selectors.
Font shorthand tokens accept standard CSS `font` values; the separate size tokens control responsive
sizing. H3–H6 retain the browser's native hierarchy.

| Variable                       | Default                                                    | Purpose                             |
| ------------------------------ | ---------------------------------------------------------- | ----------------------------------- |
| `--beauty-heading-font`        | `var(--beauty-font)`                                       | Heading family                      |
| `--beauty-heading-weight`      | `600`                                                      | H3–H6 and emphasis weight           |
| `--beauty-h1-size`             | `2.75em`                                                   | Desktop title size                  |
| `--beauty-h1-size-small`       | `2em`                                                      | Title size below 48rem              |
| `--beauty-h1-font`             | `600 var(--beauty-h1-size)/1.2 var(--beauty-heading-font)` | Title font shorthand                |
| `--beauty-h1-margin`           | `0 0.55em`                                                 | Title block margins                 |
| `--beauty-h1-tracking`         | `-0.035em`                                                 | Title letter spacing                |
| `--beauty-h1-transform`        | `none`                                                     | Optional title optical adjustment   |
| `--beauty-h2-size`             | `1.65em`                                                   | Section heading size                |
| `--beauty-h2-size-small`       | `1.4em`                                                    | Section size below 48rem            |
| `--beauty-h2-font`             | `600 var(--beauty-h2-size)/1.2 var(--beauty-heading-font)` | Section font shorthand              |
| `--beauty-h2-margin`           | `1.8em 0.55em`                                             | Section block margins               |
| `--beauty-h2-tracking`         | `-0.02em`                                                  | Section letter spacing              |
| `--beauty-h2-transform`        | `none`                                                     | Optional section optical adjustment |
| `--beauty-content-line-height` | `var(--beauty-line-height)`                                | Main content leading                |
| `--beauty-block-start`         | `0`                                                        | Paragraph and block top margin      |
| `--beauty-list-indent`         | `1.5em`                                                    | List indentation                    |
| `--beauty-list-gap`            | `0.35em`                                                   | List item spacing                   |
| `--beauty-link-weight`         | `var(--beauty-font-weight)`                                | Link weight                         |
| `--beauty-link-decoration`     | `underline`                                                | Link decoration line                |
| `--beauty-link-border`         | `0 solid transparent`                                      | Optional link bottom rule           |
| `--beauty-link-border-hover`   | `var(--beauty-hover)`                                      | Hovered link rule color             |
| `--beauty-focus-offset`        | `3px`                                                      | Keyboard focus offset               |
| `--beauty-quote-border`        | `2px solid var(--beauty-border)`                           | Quotation leading rule              |
| `--beauty-quote-inset`         | `0`                                                        | Quotation inline margins            |
| `--beauty-quote-padding`       | `var(--beauty-space)`                                      | Quotation start padding             |
| `--beauty-quote-style`         | `normal`                                                   | Quotation font style                |
| `--beauty-quote-text`          | `var(--beauty-heading)`                                    | Quotation text color                |
| `--beauty-code-size`           | `0.875em`                                                  | Inline code size                    |
| `--beauty-code-padding`        | `0.12em 0.3em`                                             | Inline code padding                 |
| `--beauty-code-radius`         | `var(--beauty-radius)`                                     | Inline code radius                  |
| `--beauty-pre-padding`         | `1.1em 1.25em`                                             | Code block padding                  |
| `--beauty-pre-radius`          | `var(--beauty-radius)`                                     | Code block radius                   |
| `--beauty-rule-margin`         | `2.5em`                                                    | Horizontal rule block margins       |
| `--beauty-rule-border`         | `1px solid var(--beauty-border)`                           | Horizontal rule border              |
| `--beauty-callout-background`  | `var(--beauty-surface)`                                    | Callout surface                     |
| `--beauty-callout-border`      | `1px solid var(--beauty-heading)`                          | Callout leading rule                |
| `--beauty-lead-weight`         | `var(--beauty-font-weight)`                                | Lead paragraph weight               |
| `--beauty-caption-align`       | `start`                                                    | Standalone caption alignment        |
| `--beauty-caption-style`       | `normal`                                                   | Standalone caption font style       |
| `--beauty-caption-margin`      | `0.6em 0 var(--beauty-space)`                              | Standalone caption margins          |

The supplied palettes are checked for normal-text contrast of at least 4.5:1, and control-boundary
contrast of at least 3:1. Recheck contrast after changing colors. Custom properties inherit; the
defaults themselves are declared on each prose container, so customize `.beauty`, rather than its
ancestor, in prose mode.

`--beauty-button-font` accepts a font shorthand for optional `.beauty-button` links
(default: `600 1em/1.4 var(--beauty-font)`). Native buttons inherit the surrounding text family.

### Quotation frames

Block quotation surfaces and spacing can be configured without overriding element selectors:
`--beauty-quote-background` defaults to `transparent`, `--beauty-quote-padding-block` and
`--beauty-quote-padding-end` to `0`, and `--beauty-quote-margin-block` to
`var(--beauty-block-start) var(--beauty-space)`. The existing `--beauty-quote-padding` token controls
start padding. A host can use these tokens to give ordinary quotations and callouts the same frame.

## Color schemes

Without an explicit choice, CSS follows `prefers-color-scheme`. Override it on the styled root:

```html
<html data-theme="dark">
  <!-- Classless page -->
</html>

<article class="beauty" data-theme="light">An independently themed article.</article>
```

Supported values are `light`, `dark`, and `auto`. In prose mode, set the attribute on the container
itself. Persisting or switching the attribute is the host application's responsibility; the core
library ships no JavaScript. The demo includes a small optional example.

## Wide content and accessibility

Wide code blocks scroll locally. Add `tabindex="0"` to overflowing `<pre>` elements for keyboard
access. For wide tables, provide a focusable wrapper with an accessible name:

```html
<h2 id="results">Results</h2>
<div class="beauty-scroll" role="region" aria-labelledby="results" tabindex="0">
  <table>
    <!-- Include column headings with scope="col". -->
  </table>
</div>
```

Beauty preserves native table semantics, visible keyboard focus, inline `<q>` quotations, browser
form validation and disclosure controls. Form labels, useful link text, image alternatives and
keyboard-accessible markup remain the author's responsibility. Prefer native HTML over ARIA.
The core adds no animations. Print rules restore a light page and allow code to wrap.

## Optional editorial treatments

Ordinary paragraphs, headings and block quotations need no classes. For exceptional treatments,
use `.beauty-lead` for a larger opening paragraph, `.beauty-fine-print` for attribution,
`.beauty-caption` for a standalone caption, or `.beauty-emphasis` for a wavy underline.
A `<blockquote class="beauty-callout">` adds a quiet surface to a block quotation. Native `<q>`
remains an inline quotation. These classes also work within a prose container.
`--beauty-emphasis-color` controls the wavy decoration (default: `currentColor`).
Use `.beauty-button` on a link only when the destination needs the visual prominence of a button;
keep its native link semantics and a real `href`.

## Browser support

Modern evergreen browsers with cascade layers: Chrome/Edge 99+, Firefox 97+, Safari 15.4+.
The current Chromium, Firefox and WebKit engines are exercised by the browser test suite. Older
browsers without `@layer` display readable native HTML, without Beauty's styling.

## Development

Node.js 22 or newer is needed **only for contributors**.

```sh
npm ci
npm run check
npx playwright install chromium firefox webkit
npm run test:browser
npm run dev
```

Open `http://127.0.0.1:4173/`. Russian documentation is at `/ru/`. The English and Russian pages,
classless/prose specimens and right-to-left fixture are generated from `scripts/build-site.mjs`.
After editing a source file, rebuild it with `npm run build` and `npm run build:site`, then reload.

| Directory      | Responsibility                                                   |
| -------------- | ---------------------------------------------------------------- |
| `src/`         | Canonical plain CSS: tokens, content, forms, page layout         |
| `dist/`        | Generated distributables and checksums, committed for direct use |
| `scripts/`     | Deterministic build, static demo generation and local preview    |
| `site/assets/` | Demo-only layout and optional theme control                      |
| `tests/`       | Distribution, contrast, markup and browser behavior checks       |
| `docs/`        | Architecture and release process                                 |

`npm run build` generates readable/minified classless and prose files. Parsed selectors are scoped
with PostCSS; Lightning CSS validates and minifies the results. Each entry stays below 4 KiB gzip.
`dist/manifest.json` records version, byte/gzip sizes, SHA-256 and SHA-384 integrity values.

The npm package contains only source CSS, distributables, README, changelog and license. Build,
test, demo and browser dependencies are development-only. There are no install-time scripts.

## Deploy the demo

```sh
npm run build
SITE_BASE_URL=https://example.com/beauty/ npm run build:site
```

Serve `_site/` at that URL. All local assets and navigation links are relative, so a subdirectory
works without rewriting files. Canonicals, alternate languages and the demo sitemap use
`SITE_BASE_URL`. Keep this independent demo outside your blog theme's templates and styles.

See [architecture](https://github.com/zavarovkv/beauty-css/blob/main/docs/architecture.md),
[contributing](https://github.com/zavarovkv/beauty-css/blob/main/CONTRIBUTING.md) and
[release instructions](https://github.com/zavarovkv/beauty-css/blob/main/docs/releasing.md).

## Author and license

Created and maintained by **[Konstantin Zavarov](https://zavarov.com/)**.
Source code, issue reports and contributions live on
[GitHub](https://github.com/zavarovkv/beauty-css).

Released under the [MIT license](https://github.com/zavarovkv/beauty-css/blob/main/LICENSE).
Free to use, modify and distribute in personal and commercial projects under that license.
