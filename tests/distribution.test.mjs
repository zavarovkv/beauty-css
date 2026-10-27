import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { build, scopeSelector } from "../scripts/build.mjs";

const directory = new URL("../dist/", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const manifest = JSON.parse(await readFile(new URL("manifest.json", directory), "utf8"));

test("each advertised file has a valid checksum, a license and a useful size budget", async () => {
  assert.equal(manifest.version, pkg.version);
  assert.equal(Object.keys(manifest.files).length, 4);
  for (const [file, expected] of Object.entries(manifest.files)) {
    const bytes = await readFile(new URL(file, directory));
    const css = bytes.toString();
    assert.equal(bytes.length, expected.bytes);
    assert.equal(gzipSync(bytes).length, expected.gzip);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected.sha256);
    assert.equal(
      `sha384-${createHash("sha384").update(bytes).digest("base64")}`,
      expected.integrity,
    );
    assert.ok(expected.gzip < 4096, `${file} must stay below 4 KiB gzip`);
    assert.ok(css.startsWith(`/*! Beauty.css v${pkg.version} | MIT`));
    assert.doesNotMatch(
      css,
      /@import|url\(|@font-face|<script|\{\{/i,
      "no runtime fetches, fonts or template syntax",
    );
    const tree = postcss.parse(css);
    assert.equal(tree.nodes.filter((node) => node.type === "atrule").length, 1);
    assert.equal(tree.nodes.find((node) => node.type === "atrule").params, "beauty");
  }
});

test("all prose selectors remain within their container, including media and print rules", async () => {
  const tree = postcss.parse(await readFile(new URL("beauty.prose.css", directory), "utf8"));
  tree.walkRules((rule) => {
    selectorParser((selectors) => {
      selectors.each((selector) => {
        const first = selector.nodes.find((node) => node.type !== "comment");
        assert.equal(first.type, "pseudo", rule.selector);
        assert.equal(first.value, ":where", rule.selector);
        assert.ok(
          first.nodes.some((node) =>
            node.nodes?.some((child) => child.type === "class" && child.value === "beauty"),
          ),
          rule.selector,
        );
        selector.walkTags((node) =>
          assert.ok(!["html", "body"].includes(node.value), rule.selector),
        );
        selector.walkPseudos((node) => assert.notEqual(node.value, ":root", rule.selector));
      });
    }).processSync(rule.selector);
  });
  assert.ok(!tree.toString().includes("body >"), "prose must not own page layout");
});

test("a selector list, descendant combinator and pseudo-element survive scoping", () => {
  const result = scopeSelector(
    ':where(p, a[href="a,b"]) > :where(code)::before, :where(:root[data-theme="dark"])',
    true,
  );
  assert.match(result, /a\[href="a,b"\]/);
  assert.match(result, /> :where\(code\):where\(:not\([^]+?\)\)::before/);
  assert.match(result, /:where\(\.beauty\[data-theme="dark"\]\)/);
});

test("all custom property references resolve to documented public tokens", async () => {
  const tree = postcss.parse(await readFile(new URL("beauty.css", directory), "utf8"));
  const definitions = new Set();
  const references = new Set();
  tree.walkDecls((declaration) => {
    if (declaration.prop.startsWith("--")) {
      assert.ok(declaration.prop.startsWith("--beauty-"));
      definitions.add(declaration.prop);
    }
    for (const match of declaration.value.matchAll(/var\((--[\w-]+)/g)) references.add(match[1]);
  });
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  for (const name of references) assert.ok(definitions.has(name), `${name} has no default`);
  for (const name of definitions) assert.ok(readme.includes(name), `${name} is undocumented`);
});

test("build artifacts are deterministic", async () => {
  const files = await readdir(directory);
  const before = await Promise.all(files.map((name) => readFile(new URL(name, directory), "utf8")));
  await build();
  const after = await Promise.all(files.map((name) => readFile(new URL(name, directory), "utf8")));
  assert.deepEqual(after, before);
});

function luminance(hex) {
  return hex
    .slice(1)
    .match(/../g)
    .map((value) => {
      const channel = parseInt(value, 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    })
    .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("default text and control colors meet their contrast thresholds in both palettes", async () => {
  const tree = postcss.parse(await readFile(new URL("../src/tokens.css", import.meta.url), "utf8"));
  const light = {};
  const dark = {};
  tree.nodes
    .find((node) => node.type === "rule")
    .walkDecls((node) => {
      light[node.prop] = node.value;
    });
  tree.nodes
    .findLast((node) => node.type === "rule")
    .walkDecls((node) => {
      dark[node.prop] = node.value;
    });
  for (const palette of [light, { ...light, ...dark }]) {
    const background = palette["--beauty-background"];
    for (const name of ["text", "heading", "muted", "link", "hover"]) {
      assert.ok(
        contrast(palette[`--beauty-${name}`], background) >= 4.5,
        `${name} text needs 4.5:1`,
      );
    }
    for (const name of ["control-border", "danger"]) {
      assert.ok(contrast(palette[`--beauty-${name}`], background) >= 3, `${name} needs 3:1`);
    }
    assert.ok(contrast(palette["--beauty-heading"], palette["--beauty-mark"]) >= 4.5);
  }
});
