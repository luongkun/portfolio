# Portfolio — Lương Senpai

Personal portfolio website của Nguyễn Thế Lương (Lương Senpai).

🌐 Live: https://luongkun.github.io/portfolio/

## Cấu trúc file

| File | Mô tả |
|---|---|
| `index.html` | File deploy chính (đã minify + inline CSS/JS) — **tự sinh, đừng sửa tay** |
| `index.src.html` | HTML nguồn (chưa inline) — chỉnh sửa file này |
| `styles.css` | CSS nguồn — chỉnh sửa file này |
| `script.js` | JS nguồn — chỉnh sửa file này |
| `build.js` | Script build: minify + inline CSS/JS vào `index.html` |
| `dev.js` | Dev server có live-reload |
| `em-nhac-anh.mp3` | Track nhạc nền cho music player |

## Bắt đầu

```bash
npm install
```

## Cách chỉnh sửa

1. Chạy dev server — sửa file là trang tự reload, không cần build:
   ```bash
   npm run dev        # http://localhost:5173
   ```
2. Sửa nội dung trong `index.src.html`, `styles.css`, hoặc `script.js`
3. Build lại file deploy trước khi push:
   ```bash
   npm run build
   ```
4. Commit + push → GitHub Pages tự deploy

> `npm run check` xác nhận `index.html` đã khớp với source — chạy trước khi push
> để chắc chắn không quên build.

Dev server phục vụ `index.src.html` với CSS/JS để ngoài (không minify) nên sửa
là thấy ngay. `index.html` chỉ được sinh ra lúc build để deploy chỉ tốn 1 request.

## Kích hoạt form liên hệ

GitHub Pages chỉ host file tĩnh, không chạy được backend — nên form cần một
service nhận tin nhắn hộ. Khi `FORM_ENDPOINT` còn để trống, form sẽ **mở sẵn
nơi soạn thư** kèm nội dung khách đã điền — hoạt động được, nhưng khách phải tự
bấm Gửi.

Chọn nơi soạn thư bằng `FALLBACK_MODE` ở đầu `script.js`:

| `FALLBACK_MODE` | Mở gì | Lưu ý |
|---|---|---|
| `"gmail"` (mặc định) | Gmail web ở tab mới | Khách không dùng Gmail sẽ phải đăng nhập |
| `"mailto"` | App email mặc định của máy | Máy chưa cấu hình app email thì bấm không thấy gì |

Để tin nhắn vào thẳng hòm thư, lấy endpoint miễn phí rồi dán vào đầu `script.js`:

```js
const FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
```

| Service | Free tier | Cách lấy |
|---|---|---|
| [Formspree](https://formspree.io) | 50 tin/tháng | Tạo form → copy URL `formspree.io/f/xxxxxxx` |
| [Web3Forms](https://web3forms.com) | 250 tin/tháng | Nhập email → nhận `access_key` |

Code gửi `POST` với JSON `{ name, email, message }` — khớp sẵn với Formspree.
Dùng Web3Forms thì thêm `access_key` vào body trong `script.js`.

Sau khi dán endpoint, nhớ `npm run build` rồi push.

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
