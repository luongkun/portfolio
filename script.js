(() => {
  "use strict";

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
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

    cform.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      if (!fName.value.trim())            { showErr(fName, "e-name");   valid = false; } else clearErr(fName, "e-name");
      if (!emailRe.test(fEmail.value.trim())) { showErr(fEmail, "e-email"); valid = false; } else clearErr(fEmail, "e-email");
      if (!fMsg.value.trim())             { showErr(fMsg, "e-msg");    valid = false; } else clearErr(fMsg, "e-msg");
      if (!valid) return;

      const sub = cform.querySelector(".form-sub");
      if (!sub) return;
      const original = sub.innerHTML;
      sub.disabled = true;
      sub.innerHTML = '<svg class="ico spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> \u0110ang g\u1eedi\u2026';
      setTimeout(() => {
        cform.reset();
        sub.disabled = false;
        sub.innerHTML = original;
        if (okBox) {
          okBox.classList.add("show");
          setTimeout(() => okBox.classList.remove("show"), 5000);
        }
      }, 1100);
    });
  }
})();
