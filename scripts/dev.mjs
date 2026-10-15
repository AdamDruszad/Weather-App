import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import handler from "../api/weather.js";

const root = new URL("../", import.meta.url);
const types = { html: "text/html; charset=utf-8", js: "text/javascript; charset=utf-8", css: "text/css; charset=utf-8", svg: "image/svg+xml", png: "image/png" };
const allowedFiles = new Set(["index.html", "index.js", "style.css", "favicon.svg"]);
const server = createServer(async (request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400); response.end("Bad request"); return; }
  if (pathname === "/api/weather") { await handler(request, response); return; }
  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  if (!allowedFiles.has(file) && !/^pictures\/[a-zA-Z0-9_-]+\.png$/u.test(file)) {
    response.writeHead(404); response.end("Not found"); return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") { response.writeHead(405, { Allow: "GET, HEAD" }); response.end(); return; }
  try {
    const content = await readFile(new URL(file, root));
    response.writeHead(200, { "Content-Type": types[file.split(".").at(-1)], "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch { response.writeHead(404); response.end("Not found"); }
});
server.listen(Number(process.env.PORT) || 5180, "127.0.0.1", () => console.log(`Weather: http://127.0.0.1:${server.address().port}`));
