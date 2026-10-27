import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("the real tarball installs offline and exposes both CSS entries without build tooling", async (t) => {
  const temporary = await mkdtemp(join(tmpdir(), "beauty-package-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  const cache = join(temporary, "cache");
  const [packed] = JSON.parse(
    execFileSync(
      "npm",
      ["pack", "--json", "--ignore-scripts", "--pack-destination", temporary, "--cache", cache],
      { cwd, encoding: "utf8" },
    ),
  );
  const files = packed.files.map(({ path }) => path);
  for (const name of [
    "package.json",
    "README.md",
    "LICENSE",
    "dist/beauty.css",
    "dist/beauty.prose.css",
    "dist/manifest.json",
  ])
    assert.ok(files.includes(name), name);
  assert.ok(
    files.every((name) =>
      /^(?:dist\/|src\/|package\.json$|README\.md$|LICENSE$|CHANGELOG\.md$)/.test(name),
    ),
    "publish only the distribution allowlist",
  );
  const packageJSON = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(packageJSON.dependencies || {}, {});
  for (const script of ["preinstall", "install", "postinstall", "prepare"])
    assert.ok(!packageJSON.scripts[script], `no consumer ${script} hook`);
  await writeFile(join(temporary, "package.json"), '{"private":true,"type":"module"}');
  execFileSync(
    "npm",
    [
      "install",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--cache",
      cache,
      join(temporary, packed.filename),
    ],
    { cwd: temporary, stdio: "pipe" },
  );
  const resolved = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'console.log(import.meta.resolve("beauty-css"));console.log(import.meta.resolve("beauty-css/prose"));',
    ],
    { cwd: temporary, encoding: "utf8" },
  );
  assert.match(resolved, /dist\/beauty\.css/);
  assert.match(resolved, /dist\/beauty\.prose\.css/);
});
