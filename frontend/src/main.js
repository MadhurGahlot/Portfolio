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

 /* document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLazyImages();
  loadCategories();
  loadProjects(currentCategory);
}); */


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
 

  projectsContainer.innerHTML = `
    <div class="col-span-full py-16 text-center text-brand-500 text-sm tracking-widest uppercase animate-pulse">
      Loading Projects from FastAPI...
    </div>
  `;

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
        <img src="${imgUrl}" alt="${project.title} Gallery Image" class="w-full object-cover max-h-[600px]" />
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

async function initCertificateGallery() {
  const gallery = document.getElementById("certificate-gallery");
  if (!gallery) return;

  try {
    const certificates = await fetchCertificates();
    if (!certificates.length) return;

    const radius = window.innerWidth < 640 ? 260 : 520;
    const anglePerItem = 360 / certificates.length;

    gallery.innerHTML = certificates
      .map(
        (certificate, index) => `
          <article
            class="certificate-card"
            style="--certificate-angle: ${index * anglePerItem}deg; --certificate-radius: ${radius}px;"
          >
            <a
              href="${certificate.credential_url || "#"}"
              ${certificate.credential_url ? 'target="_blank" rel="noopener noreferrer"' : ""}
              class="certificate-card-inner"
            >
              <img
                src="${certificate.image}"
                alt="${certificate.title} certificate"
                loading="lazy"
              />

              <div class="certificate-card-content">
                <p>${certificate.issuer}</p>
                <h3>${certificate.title}</h3>
                <span>Issued ${certificate.date}</span>
              </div>
            </a>
          </article>
        `,
      )
      .join("");

    let rotation = 0;
    let isScrolling = false;
    let scrollTimer;

    function updateGallery() {
      gallery.style.setProperty("--gallery-rotation", `${rotation}deg`);

      document.querySelectorAll(".certificate-card").forEach((card, index) => {
        const itemAngle = index * anglePerItem;
        const relativeAngle = (itemAngle + (rotation % 360) + 360) % 360;
        const distance = Math.abs(
          relativeAngle > 180 ? 360 - relativeAngle : relativeAngle,
        );

        card.style.opacity = Math.max(0.28, 1 - distance / 180);
      });
    }

    window.addEventListener(
      "scroll",
      () => {
        isScrolling = true;
        clearTimeout(scrollTimer);

        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        rotation = scrollableHeight
          ? (window.scrollY / scrollableHeight) * 360
          : 0;

        updateGallery();

        scrollTimer = setTimeout(() => {
          isScrolling = false;
        }, 180);
      },
      { passive: true },
    );

    function animate() {
      if (!isScrolling) {
        rotation += 0.18;
        updateGallery();
      }

      requestAnimationFrame(animate);
    }

    updateGallery();
    animate();
  } catch (error) {
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

// App Initialization
//document.addEventListener('DOMContentLoaded', () => {
 // initTheme();
 // loadCategories();
  //loadProjects(currentCategory);
//});

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

  await Promise.all([
    loadCategories(),
    loadProjects(currentCategory),
    initCertificateGallery(),
  ]);

  await restoreProjectFromURL();
}

document.addEventListener("DOMContentLoaded", initApp, { once: true });