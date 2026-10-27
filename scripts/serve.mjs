import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const directory = await realpath(fileURLToPath(new URL("../_site/", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let target = resolve(directory, `.${path}`);
    if (target !== directory && !target.startsWith(`${directory}${sep}`))
      throw new Error("Outside site");
    if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
    target = await realpath(target);
    if (!target.startsWith(`${directory}${sep}`)) throw new Error("Outside site");
    const content = await readFile(target);
    response.writeHead(200, {
      "Content-Type": mime[extname(target)] || "application/octet-stream",
      "Content-Length": content.length,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
});
server.listen(port, "127.0.0.1", () =>
  process.stdout.write(`Beauty.css preview: http://127.0.0.1:${port}\n`),
);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
