// Dedicated service gallery page interactions.
const portfolioServices = window.portfolioServices || {};
const serviceKey = document.body.dataset.servicePage;
const service = portfolioServices[serviceKey];

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
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

const grid = document.getElementById('service-project-grid');
const count = document.getElementById('service-project-count');
const heading = document.getElementById('service-page-title');
const description = document.getElementById('service-page-description');
const kicker = document.getElementById('service-page-kicker');
const dialog = document.getElementById('service-project-dialog');
const dialogImage = document.getElementById('service-dialog-image');
const dialogKicker = document.getElementById('service-dialog-kicker');
const dialogTitle = document.getElementById('service-dialog-title');
const dialogDescription = document.getElementById('service-dialog-description');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function observeCards() {
  const cards = [...document.querySelectorAll('.service-project-card')];
  cards.forEach(card => card.classList.add('reveal'));
  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach(card => observer.observe(card));
}

function showProject(project, index) {
  if (!dialog) return;
  dialogKicker.textContent = `${service.title.toUpperCase()} / PROJECT ${String(index + 1).padStart(2, '0')}`;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;
  dialogImage.src = project.image;
  dialogImage.alt = `${project.title} project preview`;
  dialogImage.onerror = () => {
    dialogImage.removeAttribute('src');
    dialogImage.alt = `${project.title} preview unavailable; update the image path in portfolio-data.js.`;
  };
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', 'open');
}

function renderFullServiceGallery() {
  if (!service || !grid) {
    if (heading) heading.textContent = 'Service not found';
    if (description) description.textContent = 'Please return to the Work section and choose a service.';
    if (grid) grid.innerHTML = '<p class="service-work-empty">This service page could not find its project data.</p>';
    return;
  }
  document.title = `${service.title} Projects — Dangton Designs`;
  if (heading) heading.textContent = service.title;
  if (description) description.textContent = service.description;
  if (kicker) kicker.textContent = `${service.number} / SELECTED WORK`;
  if (count) count.textContent = `${String(service.projects.length).padStart(2, '0')} PROJECT${service.projects.length === 1 ? '' : 'S'}`;

  grid.innerHTML = service.projects.map((project, index) => `
    <article class="project-card service-project-card" style="--project-accent: ${escapeHtml(project.accent || '#e6e5de')}">
      <button class="project-image project-open" type="button" data-project-index="${index}" aria-label="View ${escapeHtml(project.title)} project details">
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

  grid.querySelectorAll('.project-thumbnail img').forEach((img) => {
    img.addEventListener('error', () => {
      img.classList.add('image-missing');
      img.closest('.project-thumbnail')?.classList.add('has-fallback');
      img.removeAttribute('src');
    }, { once: true });
  });
  grid.querySelectorAll('.project-open').forEach((button) => {
    button.addEventListener('click', () => showProject(service.projects[Number(button.dataset.projectIndex)], Number(button.dataset.projectIndex)));
  });
  observeCards();
}

if (dialog) {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.querySelector('.dialog-contact')?.addEventListener('click', () => dialog.close());
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
renderFullServiceGallery();
