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
      const [path, hash] = url.split("#");
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
    assert.doesNotMatch(html, /[\u0451\u0401]/);
  }
  for (const name of ["classless", "prose", "rtl"]) {
    assert.match(
      await readFile(resolve(site, `examples/${name}.html`), "utf8"),
      /name="robots" content="noindex, follow"/,
    );
  }
});
