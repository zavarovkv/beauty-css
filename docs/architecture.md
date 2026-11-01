# Architecture

Beauty is a CSS product. The delivery contract is a file that a browser can load without a build,
JavaScript, framework, font download or network dependency.

## One source, two entries

The canonical CSS is split by responsibility, not by the website that first used it:

1. `tokens.css` defines the public typography and color variables, with system/explicit themes.
2. `content.css` styles semantic text, lists, quotations, media, tables, code and disclosures.
3. `forms.css` styles native controls and optional prominent links without changing their behavior.
4. `page.css` owns the document width, padding and direct page header/footer spacing.

The classless entry includes all four. The prose entry omits `page.css`, replaces document roots
with `.beauty`, prefixes descendant selectors, and inserts `.not-beauty` exclusions. The transformation
works on a parsed selector tree. Commas, quoted attributes and pseudo-elements are never split or
rewritten with regular expressions. Styles inside media and print rules follow the same path.
Keep pseudo-elements outside `:where()`, for example `:where(input, textarea)::placeholder`;
pseudo-elements inside its forgiving selector list are discarded by CSS parsers.

The build emits one cascade layer and no remote imports. Customization through ordinary CSS remains
predictable. All public variables have a `--beauty-` prefix. Component-specific selectors, behavior,
fonts and content from Hugo Mini do not belong here.

Heading font shorthands, responsive sizes, rhythm, link decoration, quotations and code are public
tokens. A consuming theme configures them rather than maintaining a second set of native-element
rules. Optional editorial helpers share the same sources in both entries. Legacy class aliases,
font loading, syntax highlighting and application-specific component styles remain consumer-owned.
Numeric highlights (`beauty-stat-*`) and connected ordered steps (`beauty-steps`) are shared
editorial helpers. The library owns their type, marker geometry and internal rhythm; consumers
own section grids, page spacing, data formatting and behavior.

## Distribution

`dist/` is generated and committed. This supports plain HTML downloads, offline use, Git dependencies,
and consumers whose build systems do not run Node. Do not edit it by hand. CI rebuilds it and rejects
a diff. The manifest makes pinned vendoring verifiable without a runtime fetch.

The package declares CSS side effects so a consumer's bundler keeps imported styles. Its allowlist
excludes the demo, tests, workflows and build dependencies. No install hooks run on a consumer's site.

## Integration with a theme

A consumer may install a pinned package version, or vendor one generated CSS entry and its license.
Record the upstream version, commit and checksum. A vendor refresh must copy the artifact exactly;
theme-specific changes belong in the consumer's own stylesheet and override Beauty's layer. Keep
fonts and behavior in the consumer. Do not fork the shared CSS or introduce a runtime CDN dependency.

## Scope and inheritance

Prose changes the content container's own type and background and the elements inside it. It does
not set container width or page layout. `.not-beauty` is a selector boundary, not a shadow root;
ordinary inheritance continues. A component needing isolation should provide its own inherited
properties or use a genuine platform boundary. Dark/light choices belong on each styled root.

## Documentation site

`site/catalog.mjs` supplies localized specimens. `scripts/build-site.mjs` renders each preview and
its escaped source from the same string, reads the canonical tokens for the palette/reference,
and copies exact distribution files with their license. It requires only Node built-ins. The default
language is selected with `SITE_DEFAULT_LANGUAGE`; `SITE_BASE_URL` controls canonical and alternate
URLs. Files and links work under a subdirectory without a router or a framework.

`site/assets/` owns documentation layout and optional theme/copy controls, never library typography.
Native details and system colors work without scripting; the sample form has no named fields and
its optional submit handler only shows local feedback. Demo assets use content hashes for cache
refreshes. The catalog has no remote runtime dependencies, font downloads or analytics. Core CSS
remains independent of the demo's JavaScript. The generated body retains Cloudflare's documented
`email_off` comments so its optional email protection does not rewrite sample addresses inside
copyable HTML or add a decoder script. This exemption applies only to the standalone demo;
[Cloudflare documents the scoped markup](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/#prevent-cloudflare-from-obfuscating-email).

The demo is independent of the blog and can be previewed locally or hosted separately.
The blog consumes only the library CSS through Hugo Mini and links visitors to the npm package.
Demo hosting and npm releases remain independent.

## Verification

Node tests validate distribution checksums, deterministic builds, selector containment, token
references, palette contrast, parseable demo markup, local links and localized metadata. Browser
tests check computed styles and behavior in three engines, small viewports, explicit/system themes,
keyboard focus, opt-outs, print and automated accessibility rules. Automated checks complement
manual review; they do not establish complete accessibility conformance.
