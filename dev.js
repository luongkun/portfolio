#!/usr/bin/env node
/**
 * Dev server cho portfolio — có live-reload.
 *
 * Phục vụ index.src.html (CSS/JS để ngoài, không minify) nên sửa file là
 * trang tự refresh ngay, không cần chạy build. Chỉ khi nào muốn deploy mới
 * cần `npm run build` để sinh index.html.
 *
 *   npm run dev            # http://localhost:5173
 *   PORT=3000 npm run dev
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5173;

/** File nào thay đổi thì reload trang. */
const WATCH = ['index.src.html', 'styles.css', 'script.js', '404.html'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
};

/** Script nhỏ inject vào HTML: nghe SSE, có tín hiệu thì reload. */
const RELOAD_SNIPPET = `<script>
  (() => {
    const es = new EventSource('/__reload');
    es.onmessage = () => location.reload();
    es.onerror = () => es.close();
  })();
</script>`;

/** Các client đang mở SSE. */
const clients = new Set();

function notifyReload(file) {
  console.log(`  ↻ ${file} thay đổi — reload ${clients.size} tab`);
  for (const res of clients) res.write('data: reload\n\n');
}

function serveHtml(res, file) {
  let html;
  try {
    html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(`Không tìm thấy ${file}`);
  }
  html = html.includes('</body>')
    ? html.replace('</body>', `${RELOAD_SNIPPET}\n</body>`)
    : html + RELOAD_SNIPPET;

  res.writeHead(200, {
    'Content-Type': MIME['.html'],
    'Cache-Control': 'no-store',
  });
  res.end(html);
}

function serveStatic(res, urlPath) {
  // Chặn path traversal: mọi file phải nằm trong ROOT.
  const filePath = path.join(ROOT, decodeURIComponent(urlPath));
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 — không tìm thấy file');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  // Kênh SSE cho live-reload.
  if (urlPath === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // Trang chủ dùng bản source (CSS/JS để ngoài) để sửa là thấy ngay.
  if (urlPath === '/' || urlPath === '/index.html' || urlPath === '/index.src.html') {
    return serveHtml(res, 'index.src.html');
  }
  if (urlPath === '/404.html') return serveHtml(res, '404.html');

  serveStatic(res, urlPath);
});

// Debounce vì fs.watch hay bắn nhiều event cho 1 lần lưu file.
let timer = null;
for (const file of WATCH) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  fs.watch(full, () => {
    clearTimeout(timer);
    timer = setTimeout(() => notifyReload(file), 80);
  });
}

server.listen(PORT, () => {
  console.log(`\n  Portfolio dev server`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`\n  Đang theo dõi: ${WATCH.join(', ')}`);
  console.log(`  Sửa file → trang tự reload. Ctrl+C để dừng.\n`);
});
