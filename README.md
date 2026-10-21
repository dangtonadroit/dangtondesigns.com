# Dangton Designs Portfolio Website

This website includes the homepage plus a dedicated full-gallery page for each service.

## Files
- `index.html` — main portfolio homepage; displays up to five projects for the selected service.
- `style.css` — shared styles, including the service gallery pages.
- `script.js` — homepage navigation, service selection, project previews and project details.
- `portfolio-data.js` — the shared project data used by the homepage and all service pages.
- `service-work.js` — renders all projects on each dedicated service page.
- `logo-design.html` — all Logo Design projects.
- `brand-identity.html` — all Brand Identity projects.
- `visual-branding.html` — all Visual Branding projects.
- `web-development.html` — all Web Development projects.
- `social-media-strategy.html` — all Social Media Strategy projects.

## How it works
The homepage shows up to five projects for the currently selected service. Clicking **Explore all [service] projects** navigates to a separate page dedicated to that service, where the full project list is displayed. Clicking a project opens its details dialog.

## Add or edit projects
Open `portfolio-data.js` and edit the `window.portfolioServices` data. Each service has a `projects` array. Add as many project objects as needed, including `title`, `subtitle`, `description`, `image`, and `accent`. The homepage and service pages will use the same list, so you only need to add a project once.

Example local image path: `Images/Portfolio/Logo Design/my-logo-project.jpg`. Keep case sensitivity in mind (`Images` and `images` can be different on web hosting). The current extra sample projects are placeholders—replace or remove them before publishing, and use your own approved project images and descriptions.

## Run locally
1. Extract the ZIP (or open the website folder in VS Code).
2. Keep all HTML and JavaScript files together in the same folder.
3. Keep your existing image folders (`Images` / `images`) at the paths referenced in your HTML.
4. Open `index.html` using VS Code Live Server. Navigation to each service page will work locally through Live Server.

## Before publishing
- Replace temporary Unsplash references with your own images.
- Replace the placeholder WhatsApp URL and generic social links.
- Confirm your logo image path and email address.
