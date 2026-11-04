import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = new URL("./", import.meta.url).pathname.replace(/^\/(.:)/, "$1");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

createServer((request, response) => {
  const requested = decodeURIComponent((request.url || "/").split("?")[0]);
  const relative = requested === "/" ? "index.html" : requested.replace(/^\/+/, "");
  let file = normalize(join(root, relative));

  if (!file.startsWith(normalize(root)) || !existsSync(file) || statSync(file).isDirectory()) {
    file = join(root, "index.html");
  }

  response.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(4173, "127.0.0.1", () => {
  console.log("Linkki preview: http://127.0.0.1:4173");
});
