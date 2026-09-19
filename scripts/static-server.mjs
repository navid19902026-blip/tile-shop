import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const root = process.argv[2] ?? process.cwd();
const port = Number(process.argv[3] ?? 8080);

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split("?")[0]);
    if (path === "/") path = "/index.html";
    const full = join(root, path);
    const s = await stat(full);
    if (s.isDirectory()) throw new Error("dir");
    const body = await readFile(full);
    res.writeHead(200, { "Content-Type": TYPES[extname(full)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, () => console.log(`Static server on http://localhost:${port} (root: ${root})`));
