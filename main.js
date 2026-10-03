function initGodlyCare(){
  document.querySelectorAll(".menu-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const nav = button.closest(".nav-inner")?.querySelector(".nav-links");
      if (!nav) return;
      const open = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      button.textContent = open ? "×" : "☰";
    });
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = link.closest(".nav-links");
      if (!nav) return;
      nav.classList.remove("open");
      const button = nav.closest(".nav-inner")?.querySelector(".menu-btn");
      if (button) {
        button.textContent = "☰";
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open menu");
      }
    });
  });

  const track = document.getElementById("gcHeroTrack");
  const dots = [...document.querySelectorAll(".gc-dot")];
  let heroIndex = 0;
  const setHero = (index) => {
    if (!track || !dots.length) return;
    heroIndex = (index + dots.length) % dots.length;
    track.style.transform = `translateX(-${heroIndex * (100 / dots.length)}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === heroIndex));
  };
  dots.forEach((dot, i) => dot.addEventListener("click", () => setHero(i)));
  document.getElementById("gcHeroPrev")?.addEventListener("click", () => setHero(heroIndex - 1));
  document.getElementById("gcHeroNext")?.addEventListener("click", () => setHero(heroIndex + 1));

  const bindTrack = (trackId, prevId, nextId) => {
    const el = document.getElementById(trackId);
    if (!el) return;
    let offset = 0;
    const update = (direction) => {
      const cards = el.children.length;
      const visible = window.innerWidth <= 650 ? 1 : window.innerWidth <= 950 ? 2 : 3;
      const max = Math.max(0, cards - visible);
      offset = Math.min(max, Math.max(0, offset + direction));
      el.style.transform = `translateX(-${offset * (100 / visible + 1.6 / visible)}%)`;
    };
    document.getElementById(prevId)?.addEventListener("click", () => update(-1));
    document.getElementById(nextId)?.addEventListener("click", () => update(1));
  };
  bindTrack("gcFacilityTrack", "gcFacilityPrev", "gcFacilityNext");

  const reveals = document.querySelectorAll(".gc-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("gc-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("gc-visible"));
  }

  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("galleryLightboxImage");
  const caption = document.getElementById("galleryLightboxCaption");
  const close = document.getElementById("galleryLightboxClose");
  const openLightbox = (img) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "Gallery image";
    if (caption) caption.textContent = img.alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
  };
  document.querySelectorAll(".gallery-zoom").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });
  close?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGodlyCare, {once:true});
} else {
  initGodlyCare();
}
