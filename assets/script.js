 (function () {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Mobile menu (one way only - no onclick needed)
  document.addEventListener("DOMContentLoaded", () => {
    const btn = qs(".mobile-menu-btn");
    const nav = qs("#mobileNav");
    if (btn && nav) {
      btn.addEventListener("click", () => nav.classList.toggle("show"));

      // close when click a link
      qsa("a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("show")));

      // close when click outside
      document.addEventListener("click", (e) => {
        if (!nav.classList.contains("show")) return;
        if (e.target.closest("#mobileNav") || e.target.closest(".mobile-menu-btn")) return;
        nav.classList.remove("show");
      });

      // close on resize to desktop
      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) nav.classList.remove("show");
      });
    }

    // Active link highlight
    const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
    qsa(".nav a").forEach((a) => {
      const href = (a.getAttribute("href") || "").replace(/\/+$/, "") || "/";
      if (href === path) a.classList.add("active");
    });
  });

  // Smooth scroll for internal anchors
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length <= 1) return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Lightbox (Gallery)
  const lb = qs("#lightbox");
  let galleryLinks = [];
  let currentIndex = -1;

  function openLightbox(src) {
    if (!lb) return;
    const img = qs("img", lb);
    if (!img) return;
    img.src = src;
    lb.classList.add("show");
    document.documentElement.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove("show");
    document.documentElement.style.overflow = "";
  }

  function showIndex(idx) {
    if (!galleryLinks.length) return;
    currentIndex = (idx + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[currentIndex];
    const src = link.dataset.src || link.getAttribute("href");
    if (src) openLightbox(src);
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".gallery-grid a");
    if (!link) return;

    e.preventDefault();

    galleryLinks = qsa(".gallery-grid a");
    currentIndex = galleryLinks.indexOf(link);

    const src = link.dataset.src || link.getAttribute("href");
    if (!src) return;

    // Build lightbox inner UI once
    if (lb && !qs(".lightbox-inner", lb)) {
      const img = qs("img", lb);
      lb.innerHTML = `
        <div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Project preview">
          <div class="lb-close" aria-label="Close">✕</div>
          <div class="lb-prev" aria-label="Previous">‹</div>
          <div class="lb-next" aria-label="Next">›</div>
        </div>
      `;
      qs(".lightbox-inner", lb).appendChild(img || document.createElement("img"));
      if (!img) {
        const newImg = qs(".lightbox-inner img", lb);
        newImg.alt = "Project preview";
      }
    }

    openLightbox(src);
  });

  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
      if (e.target.closest(".lb-close")) closeLightbox();
      if (e.target.closest(".lb-prev")) showIndex(currentIndex - 1);
      if (e.target.closest(".lb-next")) showIndex(currentIndex + 1);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lb || !lb.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showIndex(currentIndex - 1);
    if (e.key === "ArrowRight") showIndex(currentIndex + 1);
  });
})();

