// Dangton Designs portfolio interactions
// Replace temporary image URLs and project copy below with your own approved work.

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Mobile navigation
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    navLinks.classList.toggle('open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

// Use the same project data on the homepage and dedicated service pages.
const portfolioServices = window.portfolioServices || {};


const serviceButtons = [...document.querySelectorAll('.service-option')];
const projectGrid = document.getElementById('project-grid');
const projectKicker = document.getElementById('project-kicker');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectCount = document.getElementById('project-count');
const exploreMoreWrap = document.getElementById('project-gallery-actions');
const exploreMoreButton = document.getElementById('explore-more-button');
const exploreMoreLabel = document.getElementById('explore-more-label');
const exploreMoreIcon = document.getElementById('explore-more-icon');
const projectGalleryStatus = document.getElementById('project-gallery-status');
const INITIAL_PROJECTS_VISIBLE = 6;
const servicePageSlugs = {
  'logo-design': 'logo-design.html',
  'brand-identity': 'brand-identity.html',
  'visual-branding': 'visual-branding.html',
  'web-development': 'web-development.html',
  'social-media-strategy': 'social-media-strategy.html'
};
const projectDialog = document.getElementById('project-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogKicker = document.getElementById('dialog-kicker');
const dialogTitle = document.getElementById('dialog-title');
const dialogDescription = document.getElementById('dialog-description');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function renderProjects(serviceKey) {
  const service = portfolioServices[serviceKey];
  if (!service || !projectGrid) return;

  const visibleLimit = INITIAL_PROJECTS_VISIBLE;

  serviceButtons.forEach((button) => {
    const selected = button.dataset.service === serviceKey;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  if (projectKicker) projectKicker.textContent = `${service.number} / ${service.title.toUpperCase()}`;
  if (projectTitle) projectTitle.textContent = service.title;
  if (projectDescription) projectDescription.textContent = service.description;
  if (projectCount) projectCount.textContent = `${String(service.projects.length).padStart(2, '0')} PROJECTS`;

  projectGrid.innerHTML = service.projects.map((project, index) => `
    <article class="project-card${index >= visibleLimit ? ' hidden' : ''}" style="--project-accent: ${escapeHtml(project.accent)}">
      <button class="project-image project-open" type="button" data-service="${escapeHtml(serviceKey)}" data-project-index="${index}" aria-label="View ${escapeHtml(project.title)} project details">
        <span class="project-thumbnail">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} project preview" loading="lazy" decoding="async">
          <span class="thumbnail-fallback" aria-hidden="true">${escapeHtml(project.title)}</span>
          <span class="project-image-overlay"><span>VIEW PROJECT</span><span class="overlay-arrow">↗</span></span>
        </span>
      </button>
      <div class="project-meta">
        <div><h4>${escapeHtml(project.title)}</h4><p>${escapeHtml(project.subtitle)}</p></div>
        <span class="project-arrow" aria-hidden="true">↗</span>
      </div>
    </article>
  `).join('');

  // The homepage previews up to five projects; the link opens a dedicated page with the full service gallery.
  const hasMoreProjects = service.projects.length > INITIAL_PROJECTS_VISIBLE;
  if (exploreMoreWrap) exploreMoreWrap.hidden = !hasMoreProjects;
  if (exploreMoreButton) {
    exploreMoreButton.href = servicePageSlugs[serviceKey] || `service-work.html?service=${encodeURIComponent(serviceKey)}`;
    exploreMoreButton.setAttribute('aria-label', `Explore all ${service.title} projects`);
  }
  if (exploreMoreLabel) exploreMoreLabel.textContent = `Explore all ${service.title} projects`;
  if (exploreMoreIcon) exploreMoreIcon.textContent = '↗';
  if (projectGalleryStatus) {
    const shown = Math.min(INITIAL_PROJECTS_VISIBLE, service.projects.length);
    projectGalleryStatus.textContent = `Showing ${shown} of ${service.projects.length} projects · Open the full gallery to explore more`;
  }

  // If a remote sample image does not load, the card still displays a designed placeholder.
  projectGrid.querySelectorAll('.project-thumbnail img').forEach((image) => {
    image.addEventListener('error', () => {
      image.classList.add('image-missing');
      image.closest('.project-thumbnail')?.classList.add('has-fallback');
      image.removeAttribute('src');
    }, { once: true });
  });

  projectGrid.querySelectorAll('.project-open').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedService = portfolioServices[button.dataset.service];
      const project = selectedService?.projects[Number(button.dataset.projectIndex)];
      if (project) openProjectDialog(selectedService, project);
    });
  });

  observeRevealElements(projectGrid.querySelectorAll('.project-card:not(.hidden)'));
}

function openProjectDialog(service, project) {
  if (!projectDialog) return;
  dialogKicker.textContent = `${service.title.toUpperCase()} / SELECTED PROJECT`;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;
  dialogImage.src = project.image;
  dialogImage.alt = `${project.title} project preview`;
  dialogImage.onerror = () => {
    dialogImage.removeAttribute('src');
    dialogImage.alt = `${project.title} preview image unavailable. Replace the temporary image URL in script.js.`;
  };
  if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
  else projectDialog.setAttribute('open', 'open');
}

serviceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    renderProjects(button.dataset.service);
  });
});

if (projectDialog) {
  const closeButton = projectDialog.querySelector('.dialog-close');
  closeButton?.addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
  projectDialog.querySelector('.dialog-contact')?.addEventListener('click', () => {
    if (typeof projectDialog.close === 'function') projectDialog.close();
  });
}

// Reveal sections gently as they enter the viewport, including dynamically rendered projects.
function observeRevealElements(elements) {
  const targets = [...elements];
  if (!targets.length) return;
  targets.forEach((element) => element.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach((element) => observer.observe(element));
}

observeRevealElements(document.querySelectorAll(
  '.section-heading, .statement-grid, .service-row, .process-grid article, .contact-panel'
));

// Render Logo Design as the default gallery when the page opens.
renderProjects('logo-design');

// Keep the footer year current.
const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();
