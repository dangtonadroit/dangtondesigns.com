
(() => {
  const cleanTestimonials = (window.testimonials || []).filter(
    item => item.quote && item.name && item.company
  );

  function renderTestimonials(root) {
    if (!root) return;

    if (!cleanTestimonials.length) {
      root.innerHTML = `
        <div class="testimonial-empty">
          <p>Client feedback will be featured here soon.</p>
        </div>`;
      return;
    }

    const items = cleanTestimonials;

    root.innerHTML = `
      <div class="testimonial-slider">
        <button class="testimonial-arrow testimonial-prev"
          type="button" aria-label="Previous testimonials">
          &#8592;
        </button>

        <div class="testimonial-track" aria-live="polite">
          ${items.map(() => `
            <article class="testimonial-card">
              <span class="testimonial-quote-mark"
                aria-hidden="true">“</span>
              <blockquote></blockquote>
              <div class="testimonial-person">
                <span class="testimonial-avatar"></span>
                <div class="testimonial-details">
                  <h3 class="testimonial-name"></h3>
                  <p class="testimonial-company"></p>
                  <span class="testimonial-service"></span>
                  <p class="testimonial-country"></p>
                </div>
              </div>
            </article>
          `).join("")}
        </div>

        <button class="testimonial-arrow testimonial-next"
          type="button" aria-label="Next testimonials">
          &#8594;
        </button>
      </div>

      <div class="testimonial-controls">
        <span class="testimonial-count" aria-live="polite"></span>
        <div class="testimonial-dots"></div>
      </div>
    `;

    const cards = [...root.querySelectorAll(".testimonial-card")];
    const dotsContainer = root.querySelector(".testimonial-dots");
    const count = root.querySelector(".testimonial-count");

    let current = 0;

    cards.forEach((card, index) => {
      const item = items[index];

      card.querySelector("blockquote").textContent = item.quote;
      card.querySelector(".testimonial-name").textContent = item.name;

      card.querySelector(".testimonial-company").textContent =
        [item.role, item.company].filter(Boolean).join(" · ");

      card.querySelector(".testimonial-service").textContent =
        item.service || "";

      card.querySelector(".testimonial-avatar").textContent =
        item.initials || item.name.trim().charAt(0).toUpperCase();

      card.querySelector(".testimonial-country").textContent =
        item.country ? `📍 ${item.country}` : "";
    });

    const dots = items.map((item, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonial-dot";
      dot.setAttribute("aria-label", `Start with testimonial ${index + 1}`);
      dot.addEventListener("click", () => show(index));
      dotsContainer.appendChild(dot);
      return dot;
    });

    function getVisibleCount() {
      if (window.matchMedia("(max-width: 600px)").matches) return 1;
      if (window.matchMedia("(max-width: 900px)").matches) return 2;
      return 3;
    }

    function show(index) {
      current = (index + cards.length) % cards.length;

      const visibleCount = Math.min(getVisibleCount(), cards.length);

      cards.forEach((card, i) => {
        const distance = (i - current + cards.length) % cards.length;
        card.hidden = distance >= visibleCount;
        card.style.order = distance;
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
        dot.setAttribute(
          "aria-current",
          i === current ? "true" : "false"
        );
      });

      const lastVisible = (current + visibleCount - 1) % cards.length;
      count.textContent = `${current + 1}–${lastVisible + 1} / ${cards.length}`;
    }

    root.querySelector(".testimonial-prev")
      .addEventListener("click", () => show(current - 1));

    root.querySelector(".testimonial-next")
      .addEventListener("click", () => show(current + 1));

    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => show(current), 100);
    });

    show(0);
  }

  document.querySelectorAll("[data-testimonials]")
    .forEach(renderTestimonials);
})();
