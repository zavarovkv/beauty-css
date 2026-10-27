import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { transform } from "lightningcss";

export const root = fileURLToPath(new URL("../", import.meta.url));

// Transform parsed selectors, never text substitutions: commas inside :where(),
// attribute values and pseudo-elements must keep their original meaning.
export function scopeSelector(selector, scoped) {
  return selectorParser((selectors) => {
    selectors.each((item) => {
      let isRoot = false;
      item.walkPseudos((node) => {
        if (node.value !== ":root") return;
        isRoot = true;
        if (scoped) node.replaceWith(selectorParser.className({ value: "beauty" }));
      });
      item.walkTags((node) => {
        if (node.value !== "body") return;
        isRoot = true;
        if (scoped) node.replaceWith(selectorParser.className({ value: "beauty" }));
      });

      if (scoped && !isRoot) {
        const prefix = selectorParser().astSync(":where(.beauty) ").first;
        item.prepend(...prefix.nodes.map((node) => node.clone()));
      }

      // This opt-out affects selector matching, not normal CSS inheritance.
      const exclusion = selectorParser().astSync(":where(:not(.not-beauty, .not-beauty *))").first
        .first;
      const pseudoElement = item.nodes.find(
        (node) => node.type === "pseudo" && node.value.startsWith("::"),
      );
      if (pseudoElement) item.insertBefore(pseudoElement, exclusion);
      else item.append(exclusion);
    });
  }).processSync(selector);
}

export async function build() {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const banner = `/*! Beauty.css v${pkg.version} | MIT | github.com/zavarovkv/beauty-css */`;
  const shared = await Promise.all(
    ["tokens", "content", "forms"].map((part) =>
      readFile(new URL(`../src/${part}.css`, import.meta.url), "utf8"),
    ),
  );
  const page = await readFile(new URL("../src/page.css", import.meta.url), "utf8");
  await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
  const manifest = { name: pkg.name, version: pkg.version, files: {} };

  for (const scoped of [false, true]) {
    const source = [...shared, ...(scoped ? [] : [page])].join("\n");
    const tree = postcss.parse(source);
    tree.walkRules((rule) => {
      rule.selector = scopeSelector(rule.selector, scoped);
    });
    const layer = postcss.atRule({ name: "layer", params: "beauty" });
    layer.append(...tree.nodes);
    const css = layer.toString();
    for (const minify of [false, true]) {
      const filename = `beauty${scoped ? ".prose" : ""}${minify ? ".min" : ""}.css`;
      // Lightning CSS parses every declaration and emits interoperable plain CSS.
      const result = transform({ filename, code: Buffer.from(css), minify, errorRecovery: false });
      const content = Buffer.from(`${banner}\n${result.code.toString().trim()}\n`);
      await writeFile(new URL(`../dist/${filename}`, import.meta.url), content);
      manifest.files[filename] = {
        bytes: content.length,
        gzip: gzipSync(content).length,
        sha256: createHash("sha256").update(content).digest("hex"),
        integrity: `sha384-${createHash("sha384").update(content).digest("base64")}`,
      };
    }
  }
  await writeFile(
    new URL("../dist/manifest.json", import.meta.url),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return manifest;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const manifest = await build();
  for (const [file, size] of Object.entries(manifest.files)) {
    process.stdout.write(`${file}: ${size.bytes} bytes (${size.gzip} gzip)\n`);
  }
}
