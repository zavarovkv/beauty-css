import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

const site = fileURLToPath(new URL("../_site/", import.meta.url));
const walk = (node, visit) => {
  visit(node);
  for (const child of node.childNodes || []) walk(child, visit);
};
async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

test("every demo page has valid structure, unique IDs, labels and working local links", async () => {
  for (const file of await htmlFiles(site)) {
    const errors = [];
    const html = await readFile(file, "utf8");
    const tree = parse(html, { onParseError: (error) => errors.push(error.code) });
    assert.deepEqual(errors, [], file);
    const ids = new Set();
    const elements = [];
    walk(tree, (node) => {
      if (!node.tagName) return;
      const attrs = Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]));
      elements.push({ tag: node.tagName, attrs });
      if (attrs.id) {
        assert.ok(!ids.has(attrs.id), `${file}: duplicate #${attrs.id}`);
        ids.add(attrs.id);
      }
      if (node.tagName === "img") {
        assert.ok("alt" in attrs, file);
        assert.ok(attrs.width && attrs.height, `${file}: intrinsic image dimensions`);
      }
    });
    assert.equal(
      elements.filter(({ tag }) => tag === "h1").length,
      file.endsWith("prose.html") ? 2 : 1,
    );
    assert.ok(elements.some(({ tag, attrs }) => tag === "html" && attrs.lang));
    for (const { tag, attrs } of elements) {
      if (attrs["aria-labelledby"])
        for (const id of attrs["aria-labelledby"].split(" "))
          assert.ok(ids.has(id), `${file}: unknown label ${id}`);
      if (attrs["aria-describedby"])
        for (const id of attrs["aria-describedby"].split(" "))
          assert.ok(ids.has(id), `${file}: unknown description ${id}`);
      if (tag === "label" && attrs.for) assert.ok(ids.has(attrs.for), `${file}: broken label`);
      const url = attrs.src || (tag === "a" || tag === "link" ? attrs.href : undefined);
      if (!url || /^(?:https?:|mailto:|data:)/.test(url)) continue;
      const [resource, hash] = url.split("#");
      const path = resource.split("?")[0];
      let target = resolve(dirname(file), decodeURIComponent(path || file));
      if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
      await stat(target);
      if (hash && (!path || target === file)) assert.ok(ids.has(hash), `${file}: unknown #${hash}`);
    }
  }
});

test("English and Russian demo pages advertise each other and keep fixture pages unindexed", async () => {
  for (const path of ["index.html", "ru/index.html"]) {
    const html = await readFile(resolve(site, path), "utf8");
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="ru"/);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /class="wordmark-mark"/);
    assert.match(html, /assets\/beauty-mark-light\.svg/);
    assert.match(html, /assets\/beauty-mark-dark\.svg/);
    assert.match(html, /assets\/beauty-favicon\.svg/);
    assert.doesNotMatch(html, /[\u0451\u0401]/);
  }
  for (const name of ["classless", "prose", "rtl"]) {
    assert.match(
      await readFile(resolve(site, `examples/${name}.html`), "utf8"),
      /name="robots" content="noindex, follow"/,
    );
  }
});

test("the catalog demonstrates every public editorial helper and lists every token", async () => {
  const html = await readFile(resolve(site, "index.html"), "utf8");
  const tree = parse(html);
  const classes = new Set();
  walk(tree, (node) => {
    const value = node.attrs?.find((attribute) => attribute.name === "class")?.value;
    for (const name of (value || "").split(/\s+/)) classes.add(name);
  });
  for (const file of ["content", "forms", "page"]) {
    const css = await readFile(new URL(`../src/${file}.css`, import.meta.url), "utf8");
    for (const [selector] of css.matchAll(/\.beauty-[a-z-]+/g)) {
      assert.ok(classes.has(selector.slice(1)), `${selector} needs a live example`);
    }
  }
  const css = await readFile(new URL("../src/tokens.css", import.meta.url), "utf8");
  for (const [name] of css.matchAll(/--beauty-[a-z0-9-]+(?=:)/g))
    assert.ok(html.includes(name), name);
  assert.doesNotMatch(html, /https?:[^" ]+\.(?:css|js)["?]/, "no external runtime assets");
});
