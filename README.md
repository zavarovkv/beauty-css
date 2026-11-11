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
- **Small by design.** Under 5 KiB gzip per minified entry, with no runtime dependencies.
- **Your HTML, your fonts.** Semantic elements, native controls and the font family you choose.
- **Easy to customize.** Named CSS variables and a low-priority cascade layer.
- **Light, dark and print.** System-aware colors, an explicit theme choice and practical print styles.

Beauty started as the typography in [Hugo Mini](https://github.com/zavarovkv/hugo-mini).
It works independently of Hugo and every JavaScript framework.

## Feature map

| Area               | Included                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Scope              | Classless document or `.beauty` container; `.not-beauty` opt-out; one low-specificity cascade layer; logical properties for RTL              |
| Native HTML        | Headings, paragraphs, lists, definition lists, links, quotations, images/figures, rules, inline semantics, code and keyboard notation        |
| Forms              | Native labels, inputs, selects, textareas, checkboxes/radios, buttons, fieldsets and validation/disabled/read-only states                    |
| Reading            | Responsive reading scale and rhythm, lead/note/caption text, linked footnotes, drop caps, quotation frames and editorial emphasis            |
| Structured content | Tables with hairline dividers, wide-content scroll wrapper, numeric highlights and connected numbered steps                                  |
| Schemes and access | Light/dark/system palettes, print styles, visible focus, contrast checks and wrapping; accessible markup remains the author's responsibility |
| Customization      | Public `--beauty-*` tokens, your own fonts, compound link labels/icons and nowrap helpers                                                    |
| Examples           | Bilingual independent demo, every public helper, copyable HTML, classless/prose and RTL specimens                                            |

**Usage:** [install](#install) · [plain HTML](#start-with-one-file) · [existing site](#add-typography-to-an-existing-site) · [CDN](#load-from-a-cdn).

**Reference:** [tokens](#make-it-yours) · [lists and footnotes](#lists-and-footnotes) · [reading](#reading-and-editorial-rhythm) · [tables](#tables) · [schemes](#color-schemes) · [accessibility](#wide-content-and-accessibility) · [editorial helpers](#optional-editorial-treatments) · [numbers](#numeric-highlights) · [steps](#connected-steps).

**Maintenance:** [browser support](#browser-support) · [development](#development) · [demo](#build-the-independent-demo). This README describes the current checkout; a development snapshot can contain features not yet published on npm. Pin a reviewed release or commit when integrating it.

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

### Header navigation

Place trailing links or actions in a direct child with `class="beauty-nav-end"`:

```html
<header>
  <nav aria-label="Main navigation">
    <strong>Site name</strong>
    <div class="beauty-nav-end"><a href="/login">Sign in</a></div>
  </nav>
</header>
```

The group aligns to the inline end of the page header: right in left-to-right pages,
left in right-to-left pages. It can wrap on small screens without changing its alignment.
This helper belongs to the classless page entry; the prose entry leaves host navigation alone.

## Load from a CDN

Published npm versions are also available through jsDelivr. For example, the stable 0.3.0 release
can be loaded directly without npm or a build step:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/beauty-css@0.3.0/dist/beauty.min.css" />
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

## Color palette

Beauty includes matching light and dark palettes. Each sample shows the exact color next to its HEX code.
Dark mode follows the system preference or your explicit theme choice.

| Variable                  | Light                                                                      | Dark                                                                       | Purpose                      |
| ------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| `--beauty-background`     | <img src="docs/colors/ffffff.svg" width="16" height="16" alt=""> `#ffffff` | <img src="docs/colors/1a1a1a.svg" width="16" height="16" alt=""> `#1a1a1a` | Page or container background |
| `--beauty-text`           | <img src="docs/colors/444444.svg" width="16" height="16" alt=""> `#444444` | <img src="docs/colors/c7ccd1.svg" width="16" height="16" alt=""> `#c7ccd1` | Body text                    |
| `--beauty-heading`        | <img src="docs/colors/222222.svg" width="16" height="16" alt=""> `#222222` | <img src="docs/colors/e8e8e8.svg" width="16" height="16" alt=""> `#e8e8e8` | Headings and emphasis        |
| `--beauty-muted`          | <img src="docs/colors/556677.svg" width="16" height="16" alt=""> `#556677` | <img src="docs/colors/a7b2bc.svg" width="16" height="16" alt=""> `#a7b2bc` | Secondary text               |
| `--beauty-link`           | <img src="docs/colors/0060a0.svg" width="16" height="16" alt=""> `#0060a0` | <img src="docs/colors/6ab0e6.svg" width="16" height="16" alt=""> `#6ab0e6` | Links, buttons and focus     |
| `--beauty-hover`          | <img src="docs/colors/b73700.svg" width="16" height="16" alt=""> `#b73700` | <img src="docs/colors/ff986c.svg" width="16" height="16" alt=""> `#ff986c` | Link and button hover        |
| `--beauty-border`         | <img src="docs/colors/d5dadd.svg" width="16" height="16" alt=""> `#d5dadd` | <img src="docs/colors/454b51.svg" width="16" height="16" alt=""> `#454b51` | Quiet content rules          |
| `--beauty-control-border` | <img src="docs/colors/7d8892.svg" width="16" height="16" alt=""> `#7d8892` | <img src="docs/colors/737e88.svg" width="16" height="16" alt=""> `#737e88` | Visible control boundaries   |
| `--beauty-danger`         | <img src="docs/colors/b42318.svg" width="16" height="16" alt=""> `#b42318` | <img src="docs/colors/ff8c85.svg" width="16" height="16" alt=""> `#ff8c85` | Invalid field boundary       |
| `--beauty-surface`        | <img src="docs/colors/f5f6f7.svg" width="16" height="16" alt=""> `#f5f6f7` | <img src="docs/colors/25292d.svg" width="16" height="16" alt=""> `#25292d` | Code and read-only controls  |
| `--beauty-mark`           | <img src="docs/colors/fff0b3.svg" width="16" height="16" alt=""> `#fff0b3` | <img src="docs/colors/514513.svg" width="16" height="16" alt=""> `#514513` | Highlight background         |

These are the defaults from [`src/tokens.css`](src/tokens.css), shared by both CSS entries.
The supplied palettes are checked for normal-text contrast of at least 4.5:1, and control-boundary
contrast of at least 3:1. Recheck contrast after changing colors.

## Make it yours

`--beauty-heading-weight` controls headings, semantic bold emphasis and table headers.
Use a semantic `<p class="beauty-lead">` for a larger paragraph with the ordinary paragraph spacing.

Attribution size can be adjusted with `--beauty-fine-print-size` (default `0.75rem`);
this controls `.beauty-fine-print` in both entries without changing ordinary body text.

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

| Variable               | Default                 | Purpose                     |
| ---------------------- | ----------------------- | --------------------------- |
| `--beauty-font`        | System sans-serif stack | Text family                 |
| `--beauty-font-mono`   | System monospace stack  | Code family                 |
| `--beauty-font-size`   | `1rem`                  | Base text size              |
| `--beauty-font-weight` | `400`                   | Text weight                 |
| `--beauty-line-height` | `1.65`                  | Text leading                |
| `--beauty-width`       | `45rem`                 | Classless page width        |
| `--beauty-space`       | `1.25em`                | Paragraph and block spacing |
| `--beauty-radius`      | `0.35rem`               | Control and code radius     |

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
| `--beauty-list-indent`         | `min(2.5rem, 8%)`                                          | List indentation                    |
| `--beauty-list-gap`            | `0.875rem`                                                 | List item spacing                   |
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

Custom properties inherit; the
defaults themselves are declared on each prose container, so customize `.beauty`, rather than its
ancestor, in prose mode.

`--beauty-button-font` accepts a font shorthand for optional `.beauty-button` links
(default: `600 1em/1.4 var(--beauty-font)`). Native buttons inherit the surrounding text family.

### Lists and footnotes

Footnote references are visually raised without contributing to the line box, so references
do not change paragraph leading. This applies only to `sup` containing `beauty-footnote-ref`;
ordinary superscripts, subscripts and math rendering retain their own styles.

Ordinary ordered-list markers inherit their item's weight. `--beauty-list-gap` controls the space
between items (0.875rem, or 14 px at the default root size). `--beauty-list-indent` uses
`min(2.5rem, 8%)`: a 40 px inset in a wide reading column that contracts to 8% in a narrow column.
Nested lists retain a compact inner gap. A deliberate `<strong>` inside a list item stays bold.

Use the optional footnote helpers with native links and unique IDs:

```html
<p>
  A statement<sup id="ref-1"
    ><a class="beauty-footnote-ref" href="#note-1" role="doc-noteref">1</a></sup
  >.
</p>
<div class="beauty-footnotes" role="doc-endnotes">
  <ol role="list">
    <li id="note-1">
      <p>
        A source note.
        <a
          class="beauty-footnote-backref"
          href="#ref-1"
          role="doc-backlink"
          aria-label="Back to reference 1"
          >↩</a
        >
      </p>
    </li>
  </ol>
</div>
```

The number belongs to the list item, so notes may start with a quotation, nested list or code.
References and return links inherit text color, keep visible keyboard focus, and work without JavaScript.
The note text aligns with the surrounding column; numbers hang in the inline-start gutter.
Provide enough gutter space for your numbering, especially inside tightly cropped containers.
Hugo and other generators may adapt their native classes to these helpers in their own integration.

| Variable                        | Default   | Purpose                                |
| ------------------------------- | --------- | -------------------------------------- |
| `--beauty-footnote-size`        | `0.85em`  | Note text size                         |
| `--beauty-footnote-line-height` | `inherit` | Note leading, independent of body text |
| `--beauty-footnote-ref-size`    | `0.7em`   | Superscript and hanging number size    |
| `--beauty-footnote-space`       | `1.5em`   | Space before the notes                 |
| `--beauty-footnote-item-gap`    | `0.4em`   | Compact spacing between notes          |

### Reading and editorial rhythm

Page-title hyphenation is opt-in through `--beauty-h1-hyphens: auto` (default: `manual`).
`--beauty-h1-hyphen-limit` defaults to `10 4 4`: request at least ten characters in a word
and four on either side of a hyphen where supported. Set the document/container `lang`;
break positions depend on browser dictionaries. Other headings and paragraphs are unaffected.
Consumers choose the viewport range and may keep desktop and print titles unhyphenated.
No soft hyphens are inserted into source or copied text.

The existing `--beauty-h1-transform` and `--beauty-h2-transform` tokens can make a small
optical adjustment for the host font, for example `translateX(-0.025em)` on an LTR page.
Transforms do not change the available line width or surrounding flow. Defaults remain `none`;
choose the direction and amount for the actual font and inspect multiline titles.

Use `class="beauty-reading"` on an article or other reading container inside the classless page
or a prose root. It keeps the base text size by default and sets a comfortable reading measure
without changing navigation, controls or a surrounding application's layout. Page titles (`h1`)
balance their lines; section headings (`h2`–`h6`) wrap naturally instead of moving words early
to balance line lengths. Paragraphs use the browser's `pretty` wrapping when supported, and
semantic `time` elements keep dates together. Older engines retain their normal wrapping.
Use `beauty-nowrap` for short values such as a number with its unit. These are native CSS rules;
no text rewriting or JavaScript is used.

| Variable                        | Default   | Purpose                                     |
| ------------------------------- | --------- | ------------------------------------------- |
| `--beauty-reading-size`         | `1rem`    | Reading text size                           |
| `--beauty-reading-size-small`   | `1rem`    | Reading size below 48rem                    |
| `--beauty-reading-width`        | `42.5rem` | Maximum reading measure                     |
| `--beauty-reading-line-height`  | `1.6`     | Reading leading                             |
| `--beauty-heading-wrap`         | `balance` | Page title (`h1`) line wrapping             |
| `--beauty-section-heading-wrap` | `wrap`    | Section headings (`h2`–`h6`) line wrapping  |
| `--beauty-text-wrap`            | `pretty`  | Paragraph line wrapping                     |
| `--beauty-h3-margin`            | `1em`     | Third-level heading block margins           |
| `--beauty-caption-gap`          | `0.5em`   | Gap between an image and its caption helper |

For a compound link, put its text in `<span class="beauty-link-label">` and its trailing arrow in
`<span class="beauty-link-icon" aria-hidden="true">`. Only the label is underlined; the icon keeps
the text color and the base text weight. Both use the same native decoration settings as ordinary links.
The icon wrapper also accepts a decorative inline SVG: it is sized to `1em` with a `-0.125em`
baseline adjustment. The host owns its path and stroke; use `currentColor`, `aria-hidden="true"`
and `focusable="false"`. Unicode icons remain supported.

| Variable                         | Default        | Purpose                              |
| -------------------------------- | -------------- | ------------------------------------ |
| `--beauty-link-thickness`        | `0.06em`       | Underline thickness                  |
| `--beauty-link-offset`           | `0.18em`       | Underline distance from the baseline |
| `--beauty-link-decoration-color` | `currentColor` | Underline color                      |
| `--beauty-link-decoration-hover` | `currentColor` | Hovered underline color              |
| `--beauty-link-icon-gap`         | `0.35em`       | Gap before a trailing link icon      |

### Quotation frames

Block quotation surfaces and spacing can be configured without overriding element selectors:
`--beauty-quote-background` defaults to `transparent`, `--beauty-quote-padding-block` and
`--beauty-quote-padding-end` to `0`, and `--beauty-quote-margin-block` to
`var(--beauty-block-start) var(--beauty-space)`. The existing `--beauty-quote-padding` token controls
start padding. A host can use these tokens to give ordinary quotations and callouts the same frame.
`--beauty-quote-family` and `--beauty-quote-weight` choose their text face and weight,
defaulting to `var(--beauty-font)` and `var(--beauty-font-weight)`. Quotation footers
retain the body face; inline `q` elements keep inheriting their surrounding text.

### Attributed quotations

Use `figure.beauty-quotation` for a selected quotation or testimonial. Its direct
`blockquote` gets larger, unframed text; `figcaption` remains a smaller, muted
attribution in the body face. Other quotations are unchanged. Include real opening
and closing marks in the text, choosing punctuation for the language. The optional
`--beauty-hanging-scale` (default `1`) can enlarge the opening mark visually without changing line height.
`--beauty-hanging-gap` (default `0em`) moves it toward the inline-start gutter to add optical clearance without shifting the text. Print restores ordinary size and inline placement.

`beauty-hanging-open` span aligns the opening mark outside the text edge; allow room
for that glyph in the container gutter. Print restores inline punctuation and the
surrounding text size. Both CSS entries support this treatment.
Use a `beauty-quotation-author` span inside the caption for a name on its own line
in the body text color; a role or source after the span retains the muted caption color.
For an indented signature, add `beauty-quotation-attribution` to `figcaption`, with a
real em dash in its first span and the author/source grouped in its second span.
The signature is inset by 1em; a 1em dash column and 0.5em gap align the name, role
and wrapped lines. Set `--beauty-quote-attribution-align: end` and
`--beauty-quotation-attribution-indent: 0` for an end-aligned signature with its dash
next to the author. The alignment token defaults to `start` and also applies to
ordinary `blockquote footer` and captions of figures containing a direct blockquote;
image captions keep their own alignment. The decorative dash can be hidden from assistive technology.

```html
<figure class="beauty-quotation">
  <blockquote>
    <p><span class="beauty-hanging-open">«</span>Хорошая типографика помогает читать».</p>
  </blockquote>
  <figcaption class="beauty-quotation-attribution">
    <span aria-hidden="true">—</span>
    <span><span class="beauty-quotation-author">Автор цитаты</span>Пример оформления</span>
  </figcaption>
</figure>
```

| Variable                                | Default                                                                          | Purpose                                                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `--beauty-quotation-width`              | `100%`                                                                           | Maximum inline measure                                                                                                             |
| `--beauty-quotation-margin-block`       | `2em`                                                                            | Space before and after the figure                                                                                                  |
| `--beauty-quotation-author-display`     | `block`                                                                          | Author layout; use `inline` to keep the role on the same line                                                                      |
| `--beauty-quotation-caption-gap`        | `1rem`                                                                           | Space before the attribution                                                                                                       |
| `--beauty-quotation-attribution-indent` | `1em`                                                                            | Signature inset; a negative value hangs the dash in the gutter (clamped to zero in print)                                          |
| `--beauty-quotation-attribution-gap`    | `0.5em`                                                                          | Space between the dash and author; set the indent to minus this gap and the 1em dash column to align the author with the quotation |
| `--beauty-quotation-paragraph-gap`      | `0.75em`                                                                         | Space between quoted paragraphs                                                                                                    |
| `--beauty-quotation-size`               | `1.5rem`                                                                         | Quotation size                                                                                                                     |
| `--beauty-quotation-size-small`         | `1.375rem`                                                                       | Size on screens up to 48rem                                                                                                        |
| `--beauty-quotation-font`               | `var(--beauty-font-weight) var(--beauty-quotation-size)/1.45 var(--beauty-font)` | Family, weight and leading                                                                                                         |

### Tables

Column headings in `<thead>` sit close to a thin, 1px rule that follows the heading
text color in both schemes. On screens with a pixel ratio of 2 or higher, this rule
uses 0.5 CSS px; printing retains 1px. Body-row separators remain muted. All semantic tables
share this treatment in classless and prose mode; no extra class is required.

| Variable                      | Default         | Purpose                                  |
| ----------------------------- | --------------- | ---------------------------------------- |
| `--beauty-table-cell-padding` | `0.65em 0.75em` | Spacing within header and body cells     |
| `--beauty-table-header-gap`   | `0`             | Gap from column heading text to its rule |

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
For a short author/source credit, combine `beauty-caption beauty-caption-credit`: it keeps
the caption size and spacing but uses italic, muted text aligned to the inline end.
Explanatory captions remain upright and start-aligned by default. Both treatments share
`--beauty-caption-gap` so the caption stays closer to its image than the following paragraph.
Choose one treatment for a caption rather than inferring its role from the text.
Use `.beauty-heading-compact` on short card or step headings that need tighter
wrapped lines. It sets a 1.3 line height while retaining the native heading size,
weight, margins and semantic level.
A `<blockquote class="beauty-callout">` adds a quiet surface to a block quotation. Native `<q>`
remains an inline quotation. These classes also work within a prose container.
`--beauty-emphasis-color` controls the wavy decoration (default: `currentColor`).
`--beauty-emphasis-offset` controls its distance from the text (default: `0.25em`).
Use `.beauty-button` on a link only when the destination needs the visual prominence of a button;
keep its native link semantics and a real `href`.

Use `.beauty-note` on a paragraph for secondary instructions or an alternative action.
It uses a smaller size and the muted text color; its links keep the normal body weight
and visible underline. Keep essential instructions at the regular text size. Do not
nest `<small>` inside the helper, which would shrink the text twice.

```html
<p class="beauty-note">Already invited? <a href="/login">Log in</a>.</p>
```

The `beauty-lead` helper keeps the body face at an enlarged size. Its outer spacing
is controlled by `--beauty-lead-margin-block`, defaulting to
`var(--beauty-block-start) var(--beauty-space)`, like ordinary prose blocks.

#### Opening quotes, prose numerals and fractions

- Wrap an initial opening quote in `<span class="beauty-hanging-open">«</span>` to
  hang its actual glyph outside the text edge. Use only at the start of a heading or
  quotation, with enough outer space. Works in LTR and RTL without JavaScript;
  print restores the quote inside the line. The copied text retains the quote.
- Add `beauty-prose-numerals` to an article for old-style proportional figures in
  its direct paragraphs and direct blockquote paragraphs. Headings, lists, captions,
  tables and metadata keep their own figures. Inline code, dates marked with `time`,
  superscripts, subscripts, SVG and MathML retain lining figures.
- Use `beauty-lining-nums` on a specific value (or paragraph) to retain lining figures.
- Mark actual fractions with `<span class="beauty-fraction"><span>1</span>/<span>3</span></span>`.
  The numerator is raised and both numbers are smaller, using the same font without
  depending on fraction glyphs. Source text and copying remain `1/3`; paragraph leading
  does not grow. Dates, URLs and scores are never detected or rewritten.
  Old-style/proportional numerals require the matching OpenType features in the chosen
  font; otherwise ordinary glyphs remain. Text and accessible names stay intact.

### Drop caps

Add `beauty-dropcap` to a reading container that starts with an ordinary paragraph:

```html
<article class="beauty-reading beauty-dropcap">
  <p>The story begins with a single, selectable word.</p>
  <p>The following paragraphs keep their usual type.</p>
</article>
```

Only the first direct child paragraph is eligible. A heading, quotation, list or
figure before it prevents the treatment; note, caption, fine-print and
`data-typography="off"` paragraphs are excluded. Choose openings with enough prose
to wrap around the initial; short paragraphs still reserve its full height. The letter keeps the paragraph color and uses native
`initial-letter` shaping: three lines, reduced to two at 48rem and below. The word
is never split into separate DOM nodes. Print and browsers without `initial-letter`
(including its WebKit-prefixed form) keep ordinary text. No font or script is loaded.

For a one-letter opening word, use a nonbreaking separator (`I&nbsp;write`) to
keep Chromium from dropping that space when copying the paragraph. The consuming
site can add it during rendering, without changing its source text. Opening quotes
grow with the initial; preview punctuation and inline decorations before opting in.

| Variable                       | Default                        | Purpose                             |
| ------------------------------ | ------------------------------ | ----------------------------------- |
| `--beauty-dropcap-font`        | `var(--beauty-heading-font)`   | Initial font family                 |
| `--beauty-dropcap-weight`      | `var(--beauty-heading-weight)` | An available font weight            |
| `--beauty-dropcap-lines`       | `3`                            | Desktop line count                  |
| `--beauty-dropcap-lines-small` | `2`                            | Small-screen line count             |
| `--beauty-dropcap-gap`         | `0.35em`                       | Space after the initial             |
| `--beauty-dropcap-rise`        | `0`                            | Extra height above the opening line |

Keep line counts as positive integers. Set `--beauty-dropcap-rise: 0.5` to enlarge
the initial by half a line while keeping its baseline on the configured sink line.
Standard CSS top-aligns the enlarged initial and lifts it by the requested fraction
of the paragraph's line height. WebKit's prefixed property aligns it at the sink
baseline. This avoids Blink's whole-line text shift for fractional raised initials.
Check the opening against the preceding heading and descender clearance with the actual font. The default `0`
keeps the ordinary dropped initial. Short paragraphs reserve the sink height.

`--beauty-dropcap-margin-block-end` defaults to `0`. A consuming theme may use a
small negative value to tighten the exclusion area below an initial with a descender,
without moving or resizing the glyph. This is font-dependent: check that the next
full-width line clears the actual ink on desktop and mobile, including after font
loading. Keep `0` when the font needs the full exclusion area.

## Numeric highlights

Use `.beauty-stat-value` for a prominent number and `.beauty-stat-label` for its label.
Both work in classless and prose entries, using the host's heading font and palette.
Values use tabular numerals and scale from 2.5rem to 3.5rem; override
`--beauty-stat-size` (default: `clamp(2.5rem, 12vw, 3.5rem)`) to suit the available space.
`--beauty-stat-color` controls their color (default: `var(--beauty-link)`).
The host owns the grid, spacing and number formatting. Keep values as text with
native semantics; do not turn them into headings just to make them larger.
Use `.beauty-stat-unit` inside a value for a smaller, baseline-aligned unit or
compact-number suffix. Include a nonbreaking space before the unit in the markup
(for example, `<small class="beauty-stat-unit">&nbsp;M</small>`) so copied text
retains the separation. Preserve the exact quantity in a `<data value="…">` element
and its title when the displayed number is rounded.

```html
<dl>
  <dt class="beauty-stat-label">Tasks completed</dt>
  <dd class="beauty-stat-value">120</dd>
</dl>
```

### Step markers

Use `.beauty-step-marker` for a number beside a semantic process step. It uses the
heading font, tabular numerals, the link color and a subtle tinted surface. The
host owns marker dimensions, alignment and any connecting line. This helper adds
no interactivity or progress state. When an ordered list already conveys the
sequence, mark a duplicate decorative number with `aria-hidden="true"`.

```html
<small class="beauty-step-marker" aria-hidden="true">1</small>
```

### Connected steps

Use `beauty-steps` on an ordered list for a sequence with numbered circles and a
connecting line. It includes the marker geometry, heading rhythm and text spacing
in both classless and prose entries. No JavaScript is needed.

```html
<ol class="beauty-steps" role="list">
  <li>
    <small class="beauty-step-marker" aria-hidden="true">1</small>
    <div>
      <h3>Make a plan</h3>
      <p>Agree on the goal and choose the next steps.</p>
    </div>
  </li>
  <li>
    <small class="beauty-step-marker" aria-hidden="true">2</small>
    <div>
      <h3>Do the work</h3>
      <p>Complete the plan and share the result.</p>
    </div>
  </li>
</ol>
```

Keep `role="list"` so the sequence remains a list in assistive technologies when
native markers are hidden. Decorative numbers are excluded from accessible text.
The line follows the text direction and ends before the last item.

| Token                | Default   | Controls                          |
| -------------------- | --------- | --------------------------------- |
| `--beauty-steps-gap` | `1.5rem`  | Space between steps               |
| `--beauty-step-size` | `1.5rem`  | Number circle and marker column   |
| `--beauty-step-gap`  | `0.75rem` | Space between the marker and text |

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

| Directory  | Responsibility                                                   |
| ---------- | ---------------------------------------------------------------- |
| `src/`     | Canonical plain CSS: tokens, content, forms, page layout         |
| `dist/`    | Generated distributables and checksums, committed for direct use |
| `scripts/` | Deterministic build, static demo generation and local preview    |
| `site/`    | Localized live specimens, demo layout and optional UI controls   |
| `tests/`   | Distribution, contrast, markup and browser behavior checks       |
| `docs/`    | Architecture and release process                                 |

`npm run build` generates readable/minified classless and prose files. Parsed selectors are scoped
with PostCSS; Lightning CSS validates and minifies the results. Each minified entry stays below 5 KiB gzip.
`dist/manifest.json` records version, byte/gzip sizes, SHA-256 and SHA-384 integrity values.

The npm package contains only source CSS, distributables, README, changelog and license. Build,
test, demo and browser dependencies are development-only. There are no install-time scripts.

## Build the independent demo

```sh
npm run build
SITE_BASE_URL=https://example.com/beauty/ SITE_DEFAULT_LANGUAGE=ru npm run build:site
```

Serve `_site/` at that URL. All local assets and navigation links are relative, so a subdirectory
works without rewriting files. Canonicals, alternate languages and the demo sitemap use
`SITE_BASE_URL`. `SITE_DEFAULT_LANGUAGE` accepts `en` (default) or `ru`; the other language lives
under its language code. The demo is available for local preview or independent hosting.

The catalog includes 17 live specimens with expandable, copyable HTML, every public helper,
light/dark palette swatches and the complete variable reference. `site/catalog.mjs` owns the bilingual
specimens; each preview and its source share the same markup. Colors and token defaults come directly
from `src/tokens.css`. On wide screens contents stay beside the examples; on mobile they collapse into
a native disclosure. The optional script adds theme choice, copying and a local form demonstration.

The generator uses Node built-ins and the committed `dist/` files, so publishing a reviewed snapshot
needs no npm dependencies in a host site. Downloaded CSS matches the shown development version,
which may be ahead of npm. The demo does not publish an npm release.

See [architecture](https://github.com/zavarovkv/beauty-css/blob/main/docs/architecture.md),
[contributing](https://github.com/zavarovkv/beauty-css/blob/main/CONTRIBUTING.md) and
[release instructions](https://github.com/zavarovkv/beauty-css/blob/main/docs/releasing.md).

## Author and license

Created and maintained by **[Konstantin Zavarov](https://zavarov.com/)**.
Source code, issue reports and contributions live on
[GitHub](https://github.com/zavarovkv/beauty-css).

Released under the [MIT license](https://github.com/zavarovkv/beauty-css/blob/main/LICENSE).
Free to use, modify and distribute in personal and commercial projects under that license.
