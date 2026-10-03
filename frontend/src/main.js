// frontend/src/main.js
import './style.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { fetchCategories, fetchProjects, fetchProjectBySlug, submitContact ,fetchCertificates,fetchEducation} 
from './api.js';

async function initReactCertificateWheel() {
  const container = document.getElementById('certificate-react-root');

  if (!container) return;

  const { default: CertificateWheelSection } =
    await import('./components/CertificateWheelSection');

  const root = createRoot(container);

  root.render(
    React.createElement(CertificateWheelSection)
  );
}


// State management
let currentCategory = 'all';
let projectsData = [];

// Always start at the top when the page is reloaded
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// DOM Elements
const categoryFiltersContainer = document.getElementById('category-filters');
const projectsContainer = document.getElementById('projects-container');
const projectModal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');


/**
 * Load images only when they are near the viewport
 */
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');

  if (!('IntersectionObserver' in window)) {
    images.forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      const src = img.dataset.src;

      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }

      observer.unobserve(img);
    });
  }, {
    rootMargin: '100px 0px'
  });

  images.forEach(img => observer.observe(img));
}
// Theme Toggle Setup
const themeToggleBtn = document.getElementById('theme-toggle');

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
}

themeToggleBtn?.addEventListener('click', () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
});

// Mobile Drawer Setup
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileMenuToggle?.addEventListener('click', () => {
  mobileMenu?.classList.remove('translate-x-full');
});

mobileMenuClose?.addEventListener('click', () => {
  mobileMenu?.classList.add('translate-x-full');
});

mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.add('translate-x-full');
  });
});

/**
 * Render Category Filter Buttons
 */
async function loadCategories() {
  const categories = await fetchCategories();
  if (!categoryFiltersContainer) return;

  categoryFiltersContainer.innerHTML = categories.map(cat => {
    const isActive = cat.id === currentCategory;
    const activeClasses = isActive
      ? 'bg-brand-950 text-brand-50 dark:bg-brand-50 dark:text-brand-950 border-brand-950 dark:border-brand-50'
      : 'bg-transparent text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-800 hover:border-brand-950 dark:hover:border-brand-200';
    return `
      <button 
        data-category="${cat.id}"
        class="category-btn px-4 py-2 border text-xs tracking-widest uppercase transition-all duration-300 font-semibold ${activeClasses}">
        ${cat.name}
      </button>
    `;
  }).join('');

  // Attach click listeners to filter buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const catId = e.currentTarget.getAttribute('data-category');
      if (catId && catId !== currentCategory) {
        currentCategory = catId;
        loadCategories(); // update active state styles
        loadProjects(currentCategory);
      }
    });
  });
}


async function loadProjects(category = 'all') {
  if (!projectsContainer) return;

  projectsData = await fetchProjects(category);

  if (projectsData.length === 0) {
    projectsContainer.innerHTML = `
      <div class="col-span-full py-16 text-center text-brand-500 text-sm tracking-widest uppercase">
        No projects found in this category.
      </div>
    `;
    return;
  }

  projectsContainer.innerHTML = projectsData.map((project, index) => {
    // Determine staggered col-span and aspect ratio to mimic Quinn Squarespace fluid grid
    let colSpanClass = 'lg:col-span-6';
    let aspectClass = 'aspect-tall';

    if (project.cover_aspect === 'wide') {
      colSpanClass = 'lg:col-span-12';
      aspectClass = 'aspect-wide';
    } else if (project.cover_aspect === 'square') {
      colSpanClass = 'lg:col-span-6';
      aspectClass = 'aspect-square';
    } else {
      // Tall
      colSpanClass = index % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5';
      aspectClass = 'aspect-tall';
    }

    return `
      <article 
        data-slug="${project.slug}"
        class="project-card ${colSpanClass} ${aspectClass} group">
        
        <img 
          src="${project.hero_image}" 
          alt="${project.title}" 
          loading="lazy"
          
          class="project-card-image"
        />

        <div class="project-card-overlay">
          <div class="space-y-1 transform group-hover:-translate-y-1 transition-transform duration-300">
            <span class="text-[10px] uppercase tracking-ultra text-brand-300/90 font-mono font-medium block">
              ${project.category_name} &bull; ${project.year}
            </span>
            <h3 class="font-serif text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ${project.title}
            </h3>
            <p class="text-xs text-brand-200/80 font-light line-clamp-1">
              ${project.subtitle}
            </p>
          </div>

          <div class="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] uppercase tracking-wider text-white/90 font-medium">
            <span>View Case Study</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach modal trigger click handlers
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-slug');
      if (slug) openProjectModal(slug);
    });
  });
}

async function openProjectModal(slug) {
  const project = await fetchProjectBySlug(slug);
  if (!project) return;
  // Remember the opened project in the URL
  history.replaceState(null, '', `#work/${slug}`);

  // Populate Modal Fields
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-category').textContent = project.category_name;
  document.getElementById('modal-client').textContent = project.client || 'N/A';
  document.getElementById('modal-role').textContent = project.role || 'N/A';
  document.getElementById('modal-year').textContent = project.year || '2026';
  document.getElementById('modal-cat-tag').textContent = project.category_name;
  document.getElementById('modal-description').textContent = project.description;
  // Project Links
  const githubBtn = document.getElementById('modal-github');
  const liveBtn = document.getElementById('modal-live');
  if (githubBtn) {
  if (project.github_url) {
    githubBtn.href = project.github_url;
    githubBtn.classList.remove('hidden');
  } else {
    githubBtn.classList.add('hidden');
  }
}

if (liveBtn) {
  if (project.live_url) {
    liveBtn.href = project.live_url;
    liveBtn.classList.remove('hidden');
  } else {
    liveBtn.classList.add('hidden');
  }
}

  // Populate Details List
  const detailsList = document.getElementById('modal-details-list');
  if (detailsList && project.details) {
    detailsList.innerHTML = project.details.map(item => `<li>${item}</li>`).join('');
  }

  // Populate Gallery
  const modalGallery = document.getElementById('modal-gallery');
  if (modalGallery && project.gallery) {
    modalGallery.innerHTML = project.gallery.map(imgUrl => `
      <div class="overflow-hidden border border-brand-200 dark:border-brand-800">
        <img
  src="${imgUrl}"
  alt="${project.title} Gallery Image"
  loading="lazy"
  decoding="async"
  class="w-full object-cover max-h-[600px]"
/>
      </div>
    `).join('');
  }

  // Show Modal
  if (projectModal) {
    projectModal.classList.remove('hidden');
    projectModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  if (projectModal) {
    projectModal.classList.add('hidden');
    projectModal.classList.remove('flex');
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

modalCloseBtn?.addEventListener('click', closeProjectModal);
projectModal?.addEventListener('click', (e) => {
  if (e.target === projectModal) closeProjectModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

function initTechGallery() {
  const container = document.querySelector(".tech-gallery-container");
  const gallery = document.getElementById("tech-gallery");
  if (!gallery) return;

  const cards = gallery.querySelectorAll(".tech-card");
  if (!cards.length) return;

  // Make sure image sources are loaded from data-src
  cards.forEach((card) => {
    const img = card.querySelector("img[data-src]");
    if (img && img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  });

  // MOBILE (< 640px): Non-rotating attractive grid layout
  if (window.innerWidth < 640) {
    gallery.style.setProperty("--tech-rotation", "0deg");
    cards.forEach((card) => {
      card.style.position = "relative";
      card.style.top = "auto";
      card.style.left = "auto";
      card.style.transform = "none";
      card.style.opacity = "1";
    });
    return;
  }

  // DESKTOP (>= 640px): 3D Rotating Carousel
  let radius = 500;
  let perspective = 1800;
  let rotation = 0;

  let isDragging = false;
  let startX = 0;
  let startRotation = 0;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;

  function updateParams() {
    const w = window.innerWidth;
    if (w < 1024) {
      radius = Math.max(280, Math.min(w * 0.42, 380));
      perspective = 1300;
    } else {
      radius = 500;
      perspective = 1800;
    }

    gallery.style.setProperty("--tech-perspective", `${perspective}px`);
    const anglePerItem = 360 / cards.length;

    cards.forEach((card, index) => {
      card.style.setProperty("--tech-angle", `${index * anglePerItem}deg`);
      card.style.setProperty("--tech-radius", `${radius}px`);
    });
  }

  updateParams();
  window.addEventListener("resize", updateParams, { passive: true });

  function onPointerDown(e) {
    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    lastX = startX;
    lastTime = performance.now();
    startRotation = rotation;
    velocity = 0;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startX;
    rotation = startRotation + deltaX * 0.25;

    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = ((clientX - lastX) * 0.25) / (dt / 16);
    }
    lastX = clientX;
    lastTime = now;
  }

  function onPointerUp() {
    isDragging = false;
  }

  const dragArea = container || gallery;
  dragArea.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);

  function updateGallery() {
    gallery.style.setProperty("--tech-rotation", `${rotation}deg`);
    const anglePerItem = 360 / cards.length;

    cards.forEach((card, index) => {
      const itemAngle = index * anglePerItem;
      const totalAngle = (itemAngle + (rotation % 360) + 360) % 360;
      const rad = (totalAngle * Math.PI) / 180;
      const cosVal = Math.cos(rad);

      const opacity = Math.max(0.25, (cosVal + 1) / 2);
      card.style.opacity = opacity.toFixed(2);
    });
  }

  function animate() {
    if (window.innerWidth < 640) return;
    if (!isDragging) {
      if (Math.abs(velocity) > 0.01) {
        rotation += velocity;
        velocity *= 0.94;
      } else {
        rotation += 0.18;
      }
    }

    updateGallery();
    requestAnimationFrame(animate);
  }

  updateGallery();
  animate();
}


async function initCertificateGallery() {
  const stage = document.getElementById("certificate-wheel-stage");
  const wheel = document.getElementById("certificate-wheel-track");
  const label = document.getElementById("certificate-wheel-label");
  const title = document.getElementById("certificate-wheel-title");
  const index = document.getElementById("certificate-wheel-index");
  const current = document.getElementById("certificate-current");
  const total = document.getElementById("certificate-total");
  const verifyButton = document.getElementById("certificate-verify");

  if (!stage || !wheel || !index) return;

  const certificates = fetchCertificates();

  if (!certificates?.length) return;

  const count = certificates.length;
  const last = count - 1;
  const DRUM = 1.1;
  const BOW = 0.75;
  const LENS = 2.4;
  const RING_RADIUS = 0.8;
  const CARD_HEIGHT_FACTOR = 0.48;
  const CARD_WIDTH_FACTOR = 0.78;
  const CARD_RATIO = 1.42;
 const STEP = 32;
const CULL = 0.55;
  const WHEEL_UNITS = 900;
  const DRAG_UNITS = 420;
  const EASE = 0.12;

  let turn = 1;
  let target = 1;
  let active = 0;
  let dragY = null;
  let settleTimer;
  let resizeTimer;

  wheel.innerHTML = "";
  index.innerHTML = "";

  if (total) {
    total.textContent = String(count).padStart(2, "0");
  }

  const cards = certificates.map((certificate, position) => {
    const card = document.createElement("a");

    card.className = "certificate-wheel-card";
    card.dataset.index = String(position);
    card.href = certificate.credential_url || "#";

    if (certificate.credential_url) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }

    const face = document.createElement("span");
    face.className = "certificate-wheel-card-face";

    const image = document.createElement("img");
    image.src = certificate.image;
    image.alt = `${certificate.title} certificate`;
    image.loading = position < 2 ? "eager" : "lazy";
    image.fetchPriority = position === 0 ? "high" : "auto";
    image.decoding = "async";
    image.draggable = false;

    const overlay = document.createElement("span");
    overlay.className = "certificate-wheel-overlay";

    overlay.innerHTML = `
      <span class="certificate-wheel-overlay-title">
        ${certificate.title}
      </span>
      <span class="certificate-wheel-overlay-issuer">
        ${certificate.issuer} · ${certificate.date}
      </span>
    `;

    face.append(image, overlay);
    card.append(face);
    wheel.append(card);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = certificate.title;

    button.addEventListener("click", () => {
      goTo(position + 1);
    });

    const item = document.createElement("li");
    item.append(button);
    index.append(item);

    return card;
  });

  const faces = cards.map((card) =>
    card.querySelector(".certificate-wheel-card-face"),
  );

  const indexButtons = [...index.querySelectorAll("button")];

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  const lerp = (from, to, amount) =>
    from + (to - from) * amount;

  const radians = (degrees) =>
    (degrees * Math.PI) / 180;

  const bowAt = (degrees, bow) =>
    -bow * (1 - Math.cos(radians(degrees)));

  function getMetrics() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;

    const cardWidth = Math.min(
      height * CARD_HEIGHT_FACTOR * CARD_RATIO,
      width * CARD_WIDTH_FACTOR,
      680,
    );

    const cardHeight = cardWidth / CARD_RATIO;
    const ringRadius = cardHeight * RING_RADIUS;

const ringScale = clamp(
  ((2 * Math.PI * ringRadius * 0.65) / count) / cardWidth,
  0.24,
  0.48,
);

    return {
      cardWidth,
      cardHeight,
      ringRadius,
      drumRadius: cardHeight * DRUM,
      bow: cardHeight * BOW,
      depth: Math.max(850, cardHeight * LENS),
      ringScale,
    };
  }

function updateActive() {
  const selected = certificates[active];

  if (title && selected) {
    title.textContent = selected.title;
  }

  if (current) {
    current.textContent = String(active + 1).padStart(2, "0");
  }

  if (verifyButton && selected) {
    const url = (selected.credential_url || "").trim();

    verifyButton.href = url || "#";
    verifyButton.classList.toggle("hidden", !url);
  }

  indexButtons.forEach((button, position) => {
    button.classList.toggle("active", position === active);
  });
}
function goTo(next) {
  target = clamp(next, 1, last + 1);
}

function render() {
    const metrics = getMetrics();
    const visibleIndex = clamp(Math.round(position), 0, last);

    const {
      cardWidth,
      cardHeight,
      ringRadius,
      drumRadius,
      bow,
      depth,
      ringScale,
    } = metrics;

    stage.style.perspective = `${depth}px`;

    const difference = target - turn;

    turn =
      Math.abs(difference) < 0.0005
        ? target
        : turn + difference * EASE;

    const morph = clamp(turn, 0, 1);
    const position = Math.max(0, turn - 1);

    wheel.style.transform = `translateZ(${-morph * drumRadius}px)`;

    cards.forEach((card, cardIndex) => {
      /* Fixes tiny cards and oversized circle */
      card.style.width = `${cardWidth}px`;
      card.style.height = `${cardHeight}px`;
      card.style.marginLeft = `-${cardWidth / 2}px`;
      card.style.marginTop = `-${cardHeight / 2}px`;

      const distance = cardIndex - position;
      const drumDegrees = distance * STEP;
      const ringDegrees = distance * (360 / count);

      card.style.transform = `
        translateX(${morph * bowAt(drumDegrees, bow)}px)
        rotateZ(${(1 - morph) * ringDegrees}deg)
        translateY(${-(1 - morph) * ringRadius}px)
        rotateX(${morph * drumDegrees}deg)
        translateZ(${morph * drumRadius}px)
      `;

     card.style.pointerEvents =
  morph > 0.5 && Math.abs(distance) > CULL
    ? "none"
    : "auto";

      card.style.zIndex = String(
        Math.round(100 - Math.abs(distance) * 2),
      );

      if (faces[cardIndex]) {
        faces[cardIndex].style.transform =
          `scale(${lerp(ringScale, 1, morph)})`;
      }
    });

    if (label) {
      label.style.opacity = String(1 - morph);
    }

    if (title) {
      title.style.opacity = String(morph);
    }

    const nearest = clamp(Math.round(position), 0, last);

    if (nearest !== active) {
      active = nearest;
      updateActive();
    }

    requestAnimationFrame(render);
  }

  stage.addEventListener(
    "wheel",
    (event) => {
      const next = target + event.deltaY / WHEEL_UNITS;

      if (next > 0 && next < last + 1) {
        event.preventDefault();
      }

      goTo(next);

      clearTimeout(settleTimer);

      settleTimer = setTimeout(() => {
        goTo(Math.round(target));
      }, 140);
    },
    { passive: false },
  );

  stage.addEventListener("pointerdown", (event) => {
    dragY = event.clientY;
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (dragY === null) return;

    goTo(target + (dragY - event.clientY) / DRAG_UNITS);
    dragY = event.clientY;
  });

  function stopDrag() {
    dragY = null;

    if (target > 0) {
      goTo(Math.round(target));
    }
  }

  stage.addEventListener("pointerup", stopDrag);
  stage.addEventListener("pointercancel", stopDrag);

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      goTo(Math.round(target) + 1);
      event.preventDefault();
    }

    if (event.key === "ArrowUp") {
      goTo(Math.round(target) - 1);
      event.preventDefault();
    }
  });

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      render();
    }, 100);
  });

  updateActive();
  render();
}

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const submitBtn = document.getElementById('submit-btn');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    service: document.getElementById('service').value,
    budget: document.getElementById('budget').value,
    message: document.getElementById('message').value,
  };

  // UI Loading State
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="animate-pulse">Submitting Inquiry...</span>
  `;

  if (contactStatus) {
    contactStatus.classList.add('hidden');
  }

  try {
    const res = await submitContact(payload);
    
    if (contactStatus) {
      contactStatus.className = 'block mb-6 p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs tracking-wider uppercase';
      contactStatus.textContent = res.message || 'Message submitted successfully!';
    }

    contactForm.reset();
  } catch (err) {
    if (contactStatus) {
      contactStatus.className = 'block mb-6 p-4 bg-rose-950/80 border border-rose-500 text-rose-300 text-xs tracking-wider uppercase';
      contactStatus.textContent = err.message || 'Failed to submit form. Please check fields and try again.';
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <span>Send Project Inquiry</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    `;
  }
});

function initCertificateGalleryWhenVisible() {
  const section = document.querySelector("#certificate");

  if (!section) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      const entry = entries[0];

      if (!entry.isIntersecting) return;

      // Lazy-load the React certificate wheel
      initReactCertificateWheel();

      // Only load it once
      obs.disconnect();
    },
    {
      rootMargin: "600px 0px",
    }
  );

  observer.observe(section);
}

function initEducationTimeline() {

  const section = document.querySelector("#education");
  const track = document.querySelector("#education-track");

  if (!section || !track) return;

  const education = fetchEducation();

  if (!education || !education.length) return;

  track.innerHTML = education
    .map((item, index) => {

      const tags = item.tags
        .map(
          (tag) =>
            `<span class="education-tag">${tag}</span>`
        )
        .join("");

      return `
        <article
          class="education-item ${item.side}"
          data-education-index="${index}"
        >

          <div class="education-card">

            <span class="education-card-number">
              ${String(index + 1).padStart(2, "0")}
            </span>

            <div class="education-year">

              <span class="education-year-number">
                ${item.year}
              </span>

              <span class="education-year-month">
                ${item.month}
              </span>

            </div>


            <h3>
              ${item.title}
            </h3>


            <div class="education-institution">
              ${item.institution}
            </div>


            <div class="education-location">
              ${item.location}
            </div>


            <p class="education-description">
              ${item.description}
            </p>


            <div class="education-tags">
              ${tags}
            </div>

          </div>


          <span class="education-dot"></span>

        </article>
      `;

    })
    .join("");


  const items =
    track.querySelectorAll(".education-item");

  const progress =
    document.querySelector("#education-progress-bar");

  const current =
    document.querySelector("#education-current");

  const total =
    document.querySelector("#education-total");


  if (total) {
    total.textContent =
      String(items.length).padStart(2, "0");
  }

  if (window.innerWidth <= 768) {
    return;
  }


  /* -------------------------------------------------------
     Check GSAP
     ------------------------------------------------------- */

  if (
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  ) {

    console.warn(
      "GSAP / ScrollTrigger not loaded."
    );

    return;

  }
  gsap.registerPlugin(ScrollTrigger);

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    gsap.set(items, {
      opacity: 1,
      y: 0
    });

    return;

  }

  function getScrollDistance() {

    return Math.max(
      0,
      track.scrollWidth -
      window.innerWidth +
      window.innerWidth * 0.15
    );

  }

  const horizontalTween = gsap.to(track, {

    x: () => -getScrollDistance(),

    ease: "none",

    scrollTrigger: {

      trigger: section,

      start: "top top",

      end: "bottom bottom",

      scrub: 1,

      invalidateOnRefresh: true,

      onUpdate: (self) => {

        const percentage =
          self.progress * 100;

        if (progress) {

          progress.style.width =
            `${percentage}%`;

        }


        const index = Math.min(
          items.length - 1,
          Math.floor(
            self.progress * items.length
          )
        );


        if (current) {

          current.textContent =
            String(index + 1).padStart(2, "0");

        }

      }

    }

  });

  items.forEach((item, index) => {

    const card =
      item.querySelector(".education-card");

    const dot =
      item.querySelector(".education-dot");


    gsap.fromTo(
      item,

      {
        opacity: 0,
        y:
          item.classList.contains("top")
            ? -70
            : 70
      },

      {
        opacity: 1,
        y: 0,

        duration: 0.8,

        ease: "power3.out",

        scrollTrigger: {

          trigger: item,

          containerAnimation: horizontalTween,

          start: "left 85%",

          end: "left 45%",

          scrub: true

        }

      }
    );


    /* Card hover scale */

    if (card) {

      card.addEventListener(
        "mouseenter",
        () => {

          gsap.to(card, {

            y: -8,

            duration: 0.35,

            ease: "power2.out"

          });

          gsap.to(dot, {

            scale: 1.5,

            duration: 0.25,

            ease: "power2.out"

          });

        }
      );


      card.addEventListener(
        "mouseleave",
        () => {

          gsap.to(card, {
            y: 0,

            duration: 0.35,

            ease: "power2.out"

          });

          gsap.to(dot, {

            scale: 1,

            duration: 0.25,

            ease: "power2.out"

          });

        }
      );

    }

  });

  window.addEventListener(
    "load",
    () => {

      ScrollTrigger.refresh();

    },
    {
      once: true
    }
  );

}

async function restoreProjectFromURL() {
  const hash = window.location.hash;

  if (hash.startsWith('#work/')) {
    const slug = hash.substring('#work/'.length);

    if (slug) {
      await openProjectModal(slug);
    }
  }
}
async function initGlobalBackground() {
  const container = document.getElementById("dye-whorl-bg-root");

  if (!container) return;

  try {
    const { default: DyeWhorl } =
      await import("./components/ui/dye-whorl");

    const root = createRoot(container);

    root.render(
      React.createElement(DyeWhorl, {
        speed: 0.75,
        interactive: true,
      })
    );
  } catch (error) {
    console.error("Failed to load global background:", error);
  }
}



let appStarted = false;

async function initApp() {
  if (appStarted) return;
  appStarted = true;

 initTheme();
 initLazyImages();
 initEducationTimeline();
 initGlobalBackground();

  await Promise.all([
    loadCategories(),
    loadProjects(currentCategory),
  ]);

  requestAnimationFrame(() => {
    initTechGallery();
    initCertificateGalleryWhenVisible();
  });

  await restoreProjectFromURL();
}

document.addEventListener("DOMContentLoaded", initApp, { once: true });
