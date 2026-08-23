#!/usr/bin/env node
/**
 * Build index.html (file deploy) từ index.src.html + styles.css + script.js.
 *
 * Minify CSS/JS bằng esbuild rồi inline trực tiếp vào HTML để trang chỉ tốn
 * 1 request duy nhất. Giữ nguyên CRLF của file nguồn.
 *
 *   npm run build    # build lại index.html
 *   npm run check    # kiểm tra index.html đã khớp source chưa (dùng trước khi push)
 */

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'index.src.html');
const OUT = path.join(ROOT, 'index.html');

const CSS_TAG = '  <link rel="stylesheet" href="styles.css" />';
const JS_TAG = '  <script src="script.js"></script>';

/** Minify 1 file bằng build API (giống hệt `esbuild <file> --minify` trên CLI). */
function minify(entry) {
  const result = esbuild.buildSync({
    entryPoints: [path.join(ROOT, entry)],
    minify: true,
    write: false,
    logLevel: 'error',
  });
  return result.outputFiles[0].text.trim();
}

function build() {
  const css = minify('styles.css');
  const js = minify('script.js');
  const src = fs.readFileSync(SRC, 'utf8');

  for (const [tag, name] of [[CSS_TAG, 'CSS'], [JS_TAG, 'JS']]) {
    if (!src.includes(tag)) {
      throw new Error(`Không tìm thấy thẻ ${name} trong index.src.html:\n  ${tag}`);
    }
  }

  const html = src
    .replace(CSS_TAG, `  <style>${css}\r\n</style>`)
    .replace(JS_TAG, `  <script>${js}\r\n</script>`);

  return { html, css, js };
}

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const { html, css, js } = build();

if (process.argv.includes('--check')) {
  if (fs.readFileSync(OUT, 'utf8') === html) {
    console.log('✅ index.html khớp với source.');
  } else {
    console.error('❌ index.html KHÔNG khớp source — chạy `npm run build` để build lại.');
    process.exit(1);
  }
} else {
  fs.writeFileSync(OUT, html);
  console.log(`✅ Đã build index.html — ${kb(Buffer.byteLength(html))}`);
  console.log(`   CSS ${kb(css.length)} · JS ${kb(js.length)} (minify + inline)`);
}
