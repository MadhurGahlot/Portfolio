// frontend/src/main.js
import './style.css';
import { fetchCategories, fetchProjects, fetchProjectBySlug, submitContact ,fetchCertificates,} 
from './api.js';

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

/**
 * Render Project Cards into  Layout
 */
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

/**
 * Open Project Detail Modal
 */
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


// For Certificate 

// For Certificate & Skills Carousels

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
  const gallery = document.getElementById("certificate-gallery");
  const section = document.getElementById("certificate");
  if (!gallery) return;

  try {
    const certificates = await fetchCertificates();
    if (!certificates.length) return;

    // MOBILE (< 640px): Non-rotating attractive horizontal snap slider
    if (window.innerWidth < 640) {
      gallery.innerHTML = certificates
        .map(
          (certificate) => `
            <article class="certificate-card">
              <a
                href="${certificate.credential_url || "#"}"
                ${
                  certificate.credential_url
                    ? 'target="_blank" rel="noopener noreferrer"'
                    : 'onclick="event.preventDefault()"'
                }
                class="certificate-card-inner"
              >
                <img
                  src="${certificate.image}"
                  alt="${certificate.title} certificate"
                  loading="lazy"
                  decoding="async"
                />

                <div class="certificate-card-content">
                  <p>${certificate.issuer}</p>
                  <h3>${certificate.title}</h3>
                  <div class="flex items-center justify-between mt-1">
                    <span>Issued ${certificate.date}</span>
                    ${
                      certificate.credential_url
                        ? `<span class="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Verify ↗</span>`
                        : ""
                    }
                  </div>
                </div>
              </a>
            </article>
          `
        )
        .join("");

      gallery.style.setProperty("--gallery-rotation", "0deg");
      gallery.querySelectorAll(".certificate-card").forEach((card) => {
        card.style.position = "relative";
        card.style.top = "auto";
        card.style.left = "auto";
        card.style.transform = "none";
        card.style.opacity = "1";
      });

      const prevBtn = document.getElementById("cert-prev-btn");
      const nextBtn = document.getElementById("cert-next-btn");

      if (prevBtn) {
        prevBtn.onclick = () => {
          gallery.scrollBy({ left: -280, behavior: "smooth" });
        };
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          gallery.scrollBy({ left: 280, behavior: "smooth" });
        };
      }

      return;
    }

    // DESKTOP (>= 640px): 3D Rotating Carousel
    let radius = 580;
    let perspective = 1800;
    let rotation = 0;

    let isDragging = false;
    let startX = 0;
    let startRotation = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let isUserInteracting = false;
    let interactionTimer = null;

    function getParams() {
      const w = window.innerWidth;
      if (w < 1024) {
        return {
          radius: Math.max(300, Math.min(w * 0.44, 440)),
          perspective: 1400,
        };
      } else {
        return {
          radius: 580,
          perspective: 1800,
        };
      }
    }

    function renderCards() {
      const { radius: r, perspective: p } = getParams();
      radius = r;
      perspective = p;

      gallery.style.setProperty("--certificate-perspective", `${perspective}px`);
      const anglePerItem = 360 / certificates.length;

      gallery.innerHTML = certificates
        .map(
          (certificate, index) => `
            <article
              class="certificate-card"
              style="
                --certificate-angle: ${index * anglePerItem}deg;
                --certificate-radius: ${radius}px;
              "
            >
              <a
                href="${certificate.credential_url || "#"}"
                ${
                  certificate.credential_url
                    ? 'target="_blank" rel="noopener noreferrer"'
                    : 'onclick="event.preventDefault()"'
                }
                class="certificate-card-inner"
              >
                <img
                  src="${certificate.image}"
                  alt="${certificate.title} certificate"
                  loading="lazy"
                  decoding="async"
                />

                <div class="certificate-card-content">
                  <p>${certificate.issuer}</p>
                  <h3>${certificate.title}</h3>
                  <span>Issued ${certificate.date}</span>
                </div>
              </a>
            </article>
          `
        )
        .join("");
    }

    renderCards();

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth < 640) return;
        const { radius: r, perspective: p } = getParams();
        radius = r;
        perspective = p;
        gallery.style.setProperty(
          "--certificate-perspective",
          `${perspective}px`
        );
        const anglePerItem = 360 / certificates.length;
        gallery
          .querySelectorAll(".certificate-card")
          .forEach((card, index) => {
            card.style.setProperty("--certificate-radius", `${radius}px`);
            card.style.setProperty(
              "--certificate-angle",
              `${index * anglePerItem}deg`
            );
          });
      },
      { passive: true }
    );

    function onPointerDown(e) {
      isDragging = true;
      isUserInteracting = true;
      clearTimeout(interactionTimer);
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
      if (!isDragging) return;
      isDragging = false;
      interactionTimer = setTimeout(() => {
        isUserInteracting = false;
      }, 1800);
    }

    gallery.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    function updateGallery() {
      gallery.style.setProperty("--gallery-rotation", `${rotation}deg`);
      const anglePerItem = 360 / certificates.length;
      const cards = gallery.querySelectorAll(".certificate-card");

      cards.forEach((card, index) => {
        const itemAngle = index * anglePerItem;
        const totalAngle = (itemAngle + (rotation % 360) + 360) % 360;
        const rad = (totalAngle * Math.PI) / 180;
        const cosVal = Math.cos(rad);

        const opacity = Math.max(0.25, (cosVal + 1) / 2);
        card.style.opacity = opacity.toFixed(2);
      });
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!section || window.innerWidth < 640) return;
        const rect = section.getBoundingClientRect();
        const totalScrollHeight = section.offsetHeight - window.innerHeight;

        if (
          rect.top <= 0 &&
          rect.bottom >= window.innerHeight &&
          totalScrollHeight > 0
        ) {
          if (!isDragging) {
            const scrollProgress = -rect.top / totalScrollHeight;
            rotation = scrollProgress * 360 * 1.5;
            isUserInteracting = true;
            clearTimeout(interactionTimer);
            interactionTimer = setTimeout(() => {
              isUserInteracting = false;
            }, 300);
          }
        }
      },
      { passive: true }
    );

    function animate() {
      if (window.innerWidth < 640) return;
      if (!isDragging) {
        if (Math.abs(velocity) > 0.01) {
          rotation += velocity;
          velocity *= 0.94;
        } else if (!isUserInteracting) {
          rotation += 0.22;
        }
      }

      updateGallery();
      requestAnimationFrame(animate);
    }

    updateGallery();
    animate();
  } catch (error) {
    console.error("Certificate load error:", error);
    gallery.innerHTML = `
      <p class="text-sm text-brand-500 text-center">
        Certificates could not be loaded.
      </p>
    `;
  }
}

/**
 * Contact Form Submission Handling with FastAPI backend
 */
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
      if (entries[0].isIntersecting) {
        initCertificateGallery();
        obs.disconnect();
      }
    },
    {
      rootMargin: "500px 0px",
    }
  );

  observer.observe(section);
}

// Re-open the project after page reload
async function restoreProjectFromURL() {
  const hash = window.location.hash;

  if (hash.startsWith('#work/')) {
    const slug = hash.substring('#work/'.length);

    if (slug) {
      await openProjectModal(slug);
    }
  }
}

let appStarted = false;

async function initApp() {
  if (appStarted) return;
  appStarted = true;

  initTheme();
  initLazyImages();

  // Load the important visible content first
  await Promise.all([
    loadCategories(),
    loadProjects(currentCategory),
  ]);

  // Start heavier sections after initial rendering
  requestAnimationFrame(() => {
    initTechGallery();
    initCertificateGalleryWhenVisible();
  });

  await restoreProjectFromURL();
}

document.addEventListener("DOMContentLoaded", initApp, { once: true });