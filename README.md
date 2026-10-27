# Beauty.css

**Simple styles. Beautiful websites.**

A lightweight CSS library for beautiful, readable websites. Ordinary HTML gets calm typography,
comfortable spacing, visible links, tables, code, and native form controls. No runtime dependencies,
JavaScript, external requests, or bundled fonts.

Beauty started as the typography in [Hugo Mini](https://github.com/zavarovkv/hugo-mini).
It works independently of Hugo and every JavaScript framework.

## Status

Version 0.1.0 is a preview. The first npm publication is pending; the repository already contains
ready-to-use distribution files. Public selectors and tokens may change before 1.0.

## Start with one file

Download [`dist/beauty.min.css`](dist/beauty.min.css), keep it with your website, and add:

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

## Add typography to an existing site

Use **only** [`beauty.prose.min.css`](dist/beauty.prose.min.css) and wrap your content in `.beauty`:

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

## Install from GitHub

Until the first npm release:

```sh
npm install github:zavarovkv/beauty-css
```

```css
@import "beauty-css";
/* Or, instead: */
@import "beauty-css/prose";
```

CSS imports work in bundlers that support package exports. A plain browser needs the downloaded
CSS file or an actual URL. Pin a release or commit in production. Do not install a build tool just
to use this library.

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

The supplied palettes are checked for normal-text contrast of at least 4.5:1, and control-boundary
contrast of at least 3:1. Recheck contrast after changing colors. Custom properties inherit; the
defaults themselves are declared on each prose container, so customize `.beauty`, rather than its
ancestor, in prose mode.

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

See [architecture](docs/architecture.md), [contributing](CONTRIBUTING.md) and
[release instructions](docs/releasing.md).

## License

[MIT](LICENSE) © Konstantin Zavarov.
