# Portfolio — Lương Senpai

Personal portfolio website của Nguyễn Thế Lương (Lương Senpai).

🌐 Live: https://luongkun.github.io/portfolio/

## Cấu trúc file

| File | Mô tả |
|---|---|
| `index.html` | File deploy chính (đã minify + inline CSS/JS, ~27KB gzipped) |
| `index.src.html` | HTML nguồn (chưa inline) — chỉnh sửa file này |
| `styles.css` | CSS nguồn — chỉnh sửa file này |
| `script.js` | JS nguồn — chỉnh sửa file này |
| `em-nhac-anh.mp3` | Track nhạc nền cho music player |

## Cách chỉnh sửa

1. Sửa nội dung trong `index.src.html`, `styles.css`, hoặc `script.js`
2. Build lại file deploy:
   ```bash
   npx esbuild styles.css --minify --outfile=styles.min.css
   npx esbuild script.js  --minify --outfile=script.min.js
   cp index.src.html index.html
   # Inline minified CSS/JS into index.html (xem inline_assets.py)
   ```
3. Commit + push → GitHub Pages tự deploy

## Thêm/đổi nhạc

Trong `index.src.html`, tìm `<ul class="music-list">` và copy/sửa các `<li>`:

```html
<li><button type="button" class="music-track"
            data-src="ten-bai.mp3"
            data-name="Tên Bài">
  <span class="music-play-icon">
    <svg class="play-tri" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M2 1.2v7.6a.5.5 0 0 0 .77.42l6.06-3.8a.5.5 0 0 0 0-.84L2.77.78A.5.5 0 0 0 2 1.2z"/>
    </svg>
    <span class="play-bars"><i></i><i></i><i></i></span>
  </span>
  <span class="music-track-name">Tên Hiển Thị</span>
  <span class="music-track-meta">3:45</span>
</button></li>
```

- Upload file `.mp3` lên cùng repo
- Đặt `data-src` = tên file MP3 (path tương đối)
- Music list tự động cuộn nếu nhiều hơn 3 bài

## Tech stack

Vanilla HTML/CSS/JS, không framework. Build tool: esbuild.
