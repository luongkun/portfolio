(() => {
  "use strict";

  // ===================== Cấu hình form liên hệ =====================
  // Endpoint nhận tin nhắn từ form (vd. Formspree: "https://formspree.io/f/abcdwxyz").
  // Để trống => form mở sẵn nơi soạn thư kèm nội dung đã điền, thay vì báo
  // thành công giả. Cách lấy endpoint: xem README mục "Kích hoạt form liên hệ".
  const FORM_ENDPOINT = "";
  const CONTACT_EMAIL = "lucifermeta0210@gmail.com";
  // Chưa có FORM_ENDPOINT thì mở gì cho khách soạn thư:
  //   "gmail"  => Gmail trên web (mail.google.com), mở ở tab mới
  //   "mailto" => app email mặc định của máy khách
  const FALLBACK_MODE = "gmail";

  // ===================== Loading Screen =====================
  const loader = document.getElementById("loader");
  if (loader) {
    const hideLoader = () => {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
    };

    document.body.style.overflow = "hidden";

    if (document.readyState === "complete") {
      setTimeout(hideLoader, 800);
    } else {
      window.addEventListener("load", () => setTimeout(hideLoader, 800));
    }
  }

  // ===================== Theme toggle =====================
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const STORAGE_KEY = "portfolio-theme";

  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  if (initial === "dark") root.setAttribute("data-theme", "dark");

  themeToggle?.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem(STORAGE_KEY, "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    }
  });

  // ===================== Typing animation =====================
  const heroTag = document.querySelector(".hero-tag");
  if (heroTag) {
    const parts = [
      { text: "{", cls: "t-bracket" },
      { text: " turning ", cls: "t-key" },
      { text: "\u201cideas\u201d", cls: "t-string" },
      { text: " \u2192 ", cls: "t-arrow" },
      { text: "\u201cproducts\u201d", cls: "t-string" },
      { text: " }", cls: "t-bracket" }
    ];
    heroTag.innerHTML = "";
    let partIdx = 0;
    let charIdx = 0;
    let spanEl = null;

    const typeChar = () => {
      if (partIdx >= parts.length) return;
      const part = parts[partIdx];
      if (!spanEl) {
        spanEl = document.createElement("span");
        spanEl.className = part.cls;
        heroTag.appendChild(spanEl);
      }
      if (charIdx < part.text.length) {
        spanEl.textContent += part.text[charIdx];
        charIdx++;
        setTimeout(typeChar, 40 + Math.random() * 30);
      } else {
        partIdx++;
        charIdx = 0;
        spanEl = null;
        setTimeout(typeChar, 80);
      }
    };

    setTimeout(typeChar, 600);
  }

  // ===================== Mobile menu =====================
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    navLinks?.classList.toggle("open");
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (
      navLinks?.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !menuToggle?.contains(e.target)
    ) {
      menuToggle?.classList.remove("active");
      navLinks.classList.remove("open");
    }
  });

  // ===================== Reveal on scroll =====================
  const revealTargets = document.querySelectorAll(
    ".section-head, .about-text, .about-card, .skill-card, .project-card, .proj-card, .stat, .tech-card, .status-card, .hero-badge, .hero-name, .hero-desc, .btn-primary, .contact-card, .contact-info, .form-wrap"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));

  // ===================== Footer year =====================

  // ===================== Music: popover + audio player =====================
  const musicBtn = document.getElementById("musicBtn");
  const musicPop = document.getElementById("musicPop");
  const musicPopClose = document.getElementById("musicPopClose");
  const audio = document.getElementById("bgAudio");
  const tracks = document.querySelectorAll(".music-track");
  const volSlider = document.getElementById("musicVol");
  const volVal = document.getElementById("musicVolVal");
  const VOL_KEY = "portfolio-music-vol";
  const TRACK_KEY = "portfolio-music-track";

  if (musicBtn && audio) {
    // Restore saved volume
    const savedVol = parseInt(localStorage.getItem(VOL_KEY) || "40", 10);
    audio.volume = Math.max(0, Math.min(1, savedVol / 100));
    if (volSlider) volSlider.value = String(savedVol);
    if (volVal) volVal.textContent = String(savedVol);

    const setActiveTrack = (btn) => {
      tracks.forEach((t) => {
        t.classList.remove("active");
        t.classList.remove("is-playing");
      });
      btn?.classList.add("active");
    };

    const openPop = () => {
      if (!musicPop) return;
      musicPop.hidden = false;
      musicBtn.setAttribute("aria-expanded", "true");
    };
    const closePop = () => {
      if (!musicPop) return;
      musicPop.hidden = true;
      musicBtn.setAttribute("aria-expanded", "false");
    };
    const togglePop = () => (musicPop?.hidden ? openPop() : closePop());

    // Toggle popover on button click
    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePop();
    });
    musicPopClose?.addEventListener("click", closePop);

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!musicPop || musicPop.hidden) return;
      if (!musicPop.contains(e.target) && !musicBtn.contains(e.target)) {
        closePop();
      }
    });

    // Track selection
    tracks.forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-src");
        if (!src) return;
        const isCurrentlyActive = btn.classList.contains("active");
        if (isCurrentlyActive && !audio.paused) {
          audio.pause();
          return;
        }
        if (audio.src !== src) {
          audio.src = src;
        }
        audio.play().catch((err) => {
          console.warn("Audio play failed:", err);
          alert("Không thể phát nhạc. Có thể trình duyệt chặn autoplay hoặc link nhạc bị lỗi.");
        });
        setActiveTrack(btn);
        localStorage.setItem(TRACK_KEY, btn.getAttribute("data-name") || "");
      });
    });

    // Play/pause UI sync
    const onPlay = () => {
      musicBtn.classList.add("playing");
      document.querySelector(".music-track.active")?.classList.add("is-playing");
    };
    const onPause = () => {
      musicBtn.classList.remove("playing");
      tracks.forEach((t) => t.classList.remove("is-playing"));
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);

    // Volume slider
    volSlider?.addEventListener("input", () => {
      const v = parseInt(volSlider.value, 10);
      audio.volume = v / 100;
      if (volVal) volVal.textContent = String(v);
      localStorage.setItem(VOL_KEY, String(v));
    });
  }

  // ===================== Hero shapes: parallax theo chuột + pause khi off-screen =====================
  const shapesContainer = document.querySelector(".shapes");
  const shapes = document.querySelectorAll(".shape");
  const heroSection = document.getElementById("home") || document.querySelector(".hero");
  let heroVisible = true;

  if (shapesContainer && heroSection && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          heroVisible = entry.isIntersecting;
          shapesContainer.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
          shapes.forEach((s) => {
            s.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
          });
          shapesContainer.style.visibility = entry.isIntersecting ? "visible" : "hidden";
        });
      },
      { threshold: 0 }
    );
    io.observe(heroSection);
  }

  // Parallax: shapes drift nhẹ theo chuột — chỉ khi hero đang trong view
  if (shapes.length) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, ticking = false;
    const factors = Array.from(shapes).map((_, i) => ((i % 5) + 1) * 3);

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      shapes.forEach((s, i) => {
        s.style.translate = `${currentX * factors[i]}px ${currentY * factors[i]}px`;
      });
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        requestAnimationFrame(tick);
      } else {
        ticking = false;
      }
    };

    window.addEventListener(
      "mousemove",
      (e) => {
        if (!heroVisible) return;
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(tick);
        }
      },
      { passive: true }
    );
  }

  // Hero glow drift theo chuột (chỉ trong hero)
  const heroGlow = document.querySelector(".hero-glow");
  if (heroGlow && heroSection) {
    heroSection.addEventListener(
      "mousemove",
      (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        heroGlow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,94,149,0.32) 0%, rgba(199,94,216,0.20) 30%, rgba(125,86,232,0.14) 55%, transparent 75%)`;
      },
      { passive: true }
    );
  }

  // Tilt 3D nhẹ cho .tech-card khi hover
  const techCard = document.querySelector(".tech-card");
  if (techCard) {
    techCard.addEventListener("mousemove", (e) => {
      const r = techCard.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      techCard.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
    });
    techCard.addEventListener("mouseleave", () => {
      techCard.style.transform = "";
    });
  }

  // ===================== Tech icon: re-trigger spin animation cleanly =====================
  document.querySelectorAll(".tech-icon").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const ic = el.querySelector("svg, img");
      if (!ic) return;
      ic.style.animation = "none";
      // Force reflow so the animation restarts
      void ic.offsetWidth;
      ic.style.animation = "";
    });
  });

  // ===================== Contact form validation =====================
  const cform = document.getElementById("cform");
  if (cform) {
    const fName = document.getElementById("f-name");
    const fEmail = document.getElementById("f-email");
    const fMsg = document.getElementById("f-msg");
    const okBox = document.getElementById("form-ok");
    const failBox = document.getElementById("form-fail");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showErr = (input, errId) => {
      input.classList.add("err");
      const el = document.getElementById(errId);
      if (el) el.classList.add("show");
    };
    const clearErr = (input, errId) => {
      input.classList.remove("err");
      const el = document.getElementById(errId);
      if (el) el.classList.remove("show");
    };

    [fName, fEmail, fMsg].forEach((inp) => {
      if (!inp) return;
      inp.addEventListener("input", () => {
        const id = inp.getAttribute("aria-describedby");
        if (inp === fEmail) {
          if (emailRe.test(inp.value.trim())) clearErr(inp, id);
        } else if (inp.value.trim()) {
          clearErr(inp, id);
        }
      });
    });

    /** Hiện một hộp thông báo (ok hoặc lỗi), ẩn hộp kia, tự tắt sau 6s. */
    let notifyTimer = null;
    const notify = (box, text) => {
      clearTimeout(notifyTimer);
      [okBox, failBox].forEach((b) => b && b.classList.remove("show"));
      if (!box) return;
      const label = box.querySelector(".form-msg-text");
      if (label && text) label.textContent = text;
      box.classList.add("show");
      notifyTimer = setTimeout(() => box.classList.remove("show"), 6000);
    };

    /** Mở nơi soạn thư với nội dung điền sẵn — dùng khi chưa cấu hình endpoint. */
    const openMailCompose = (name, email, message) => {
      const su = encodeURIComponent(`[Portfolio] Tin nhắn từ ${name}`);
      const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
      const to = encodeURIComponent(CONTACT_EMAIL);

      if (FALLBACK_MODE === "gmail") {
        const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
        // Tab mới để khách không mất trang portfolio đang xem. Nếu popup bị chặn
        // (window.open trả null) thì điều hướng luôn, đừng để khách bấm mà không thấy gì.
        if (!window.open(url, "_blank", "noopener")) window.location.href = url;
        return;
      }

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${su}&body=${body}`;
    };

    cform.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      if (!fName.value.trim())            { showErr(fName, "e-name");   valid = false; } else clearErr(fName, "e-name");
      if (!emailRe.test(fEmail.value.trim())) { showErr(fEmail, "e-email"); valid = false; } else clearErr(fEmail, "e-email");
      if (!fMsg.value.trim())             { showErr(fMsg, "e-msg");    valid = false; } else clearErr(fMsg, "e-msg");
      if (!valid) return;

      const sub = cform.querySelector(".form-sub");
      if (!sub) return;

      const name = fName.value.trim();
      const email = fEmail.value.trim();
      const message = fMsg.value.trim();

      // Chưa có endpoint: mở sẵn nơi soạn thư để tin nhắn không bị mất im lặng.
      if (!FORM_ENDPOINT) {
        openMailCompose(name, email, message);
        notify(
          okBox,
          FALLBACK_MODE === "gmail"
            ? "Đang mở Gmail — bạn bấm Gửi trong đó là xong nhé."
            : "Đang mở ứng dụng email của bạn — bạn bấm Gửi là xong nhé."
        );
        return;
      }

      const original = sub.innerHTML;
      sub.disabled = true;
      sub.innerHTML = '<svg class="ico spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> \u0110ang g\u1eedi\u2026';

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        cform.reset();
        notify(okBox, "Cảm ơn bạn! Mình sẽ phản hồi trong vòng 24 giờ.");
      } catch {
        notify(failBox, `Gửi không thành công. Bạn email trực tiếp giúp mình: ${CONTACT_EMAIL}`);
      } finally {
        sub.disabled = false;
        sub.innerHTML = original;
      }
    });
  }

  // ===================== Click-to-copy + toast =====================
  const copyToast = document.getElementById("copyToast");
  let copyToastTimer = null;
  const showCopyToast = (msg) => {
    if (!copyToast) return;
    const textEl = copyToast.querySelector(".copy-toast-text");
    if (textEl && msg) textEl.textContent = msg;
    copyToast.classList.remove("show");
    void copyToast.offsetWidth;
    copyToast.classList.add("show");
    copyToast.setAttribute("aria-hidden", "false");
    if (copyToastTimer) clearTimeout(copyToastTimer);
    copyToastTimer = setTimeout(() => {
      copyToast.classList.remove("show");
      copyToast.setAttribute("aria-hidden", "true");
    }, 1800);
  };

  const fallbackCopy = (text) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.pointerEvents = "none";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch (_) {
      return false;
    }
  };

  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-copy]");
    if (!target) return;
    const text = target.getAttribute("data-copy");
    if (!text) return;
    e.preventDefault();
    const onSuccess = () => {
      target.classList.add("just-copied");
      setTimeout(() => target.classList.remove("just-copied"), 900);
      const isEmail = /@/.test(text);
      showCopyToast(isEmail ? "Đã sao chép email" : "Đã sao chép");
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        if (fallbackCopy(text)) onSuccess();
      });
    } else if (fallbackCopy(text)) {
      onSuccess();
    }
  });
})();
