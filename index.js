/* ===========================
   Tanvi-aligned interactions
   =========================== */

// Sidebar contacts toggle (smooth + chevron rotate)
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const sidebarMore = document.querySelector("[data-sidebar-more]");

if (sidebar && sidebarBtn && sidebarMore) {
  sidebarBtn.addEventListener("click", () => {
    const isOpen = sidebarMore.classList.toggle("active");
    sidebar.classList.toggle("open", isOpen);
    sidebarBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

// Page switching + active-nav highlight
const navButtons = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const stack = document.getElementById("pageStack");

function syncPageStackHeight() {
  const activePage = document.querySelector(".page.active");
  if (!stack || !activePage) return;
  stack.style.minHeight = activePage.offsetHeight + "px";
}

function moveIndicatorToActive() {
  const activeBtn = document.querySelector(".navbar-link.active");
  const indicator = document.querySelector(".nav-indicator");
  const list = document.getElementById("navbarList");
  if (!activeBtn || !indicator || !list) return;

  const listRect = list.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  indicator.style.transform = `translateX(${btnRect.left - listRect.left}px)`;
  indicator.style.width = `${btnRect.width}px`;
  indicator.style.opacity = "1";
}

function setActivePage(pageName) {
  pages.forEach(p => p.classList.toggle("active", p.dataset.page === pageName));
  navButtons.forEach(b => b.classList.toggle("active", b.dataset.target === pageName));
  history.replaceState(null, "", `#${pageName}`);

  // After DOM updates
  requestAnimationFrame(() => {
    syncPageStackHeight();
    moveIndicatorToActive();
  });
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => setActivePage(btn.dataset.target));
});

// Initial page from hash
const initial = (location.hash || "#about").replace("#", "");
const validPages = ["about", "resume", "projects", "certifications", "contact"];
setActivePage(validPages.includes(initial) ? initial : "about");

// Reposition indicator on resize
window.addEventListener("resize", () => {
  syncPageStackHeight();
  moveIndicatorToActive();
});

// Theme toggle
const root = document.documentElement;
const themeIcon = document.getElementById("themeIcon");
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
}

applyTheme(localStorage.getItem("theme") || "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

// Projects (Tanvi-style cards, concise)
const projectMeta = {
  "Gold-Prediction-Model": ["ML regression for gold price prediction", "Python • ML • Jupyter"],
  "House-Price-Prediction-Model": ["House price estimation using regression", "Python • Regression"],
  "Sales-Prediction": ["Sales forecasting using supervised ML", "Python • Analytics"],
  "IRIS-Flower-Classification": ["Iris dataset ML classification", "Python • Classification"],
  "Personality-Prediction-Using-opencv-": ["Computer vision using OpenCV", "Python • OpenCV"],
  "Virtual-assistance-healthcare-chatbot": ["Healthcare chatbot automation", "Python • Chatbot"],
  "Computer-Aided-Detection-of-Melanoma-skin-cancer-based-on-Lesion-images-using-Machine-Learning":
    ["Melanoma detection using ML", "Python • Medical ML"],
  "Cognitive-Resurgence-Machine-Learning-Approaches-to-Drug-Repurposing-in-Alzheimer-s-":
    ["Drug repurposing ML research", "Python • Research"]
};

fetch("https://api.github.com/users/rahul6469/repos?per_page=100")
  .then(r => r.json())
  .then(repos => {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    repos.forEach(repo => {
      const meta = projectMeta[repo.name];
      if (!meta) return;

      const card = document.createElement("a");
      card.className = "project-card";
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener";

      card.innerHTML = `
        <div>
          <h3 class="p-title">${repo.name}</h3>
          <p class="p-desc">${meta[0]}</p>
        </div>
        <p class="p-tech"><span class="pill">Tech</span>${meta[1]}</p>
      `;

      grid.appendChild(card);
    });

    // Ensure container height is correct after projects load
    syncPageStackHeight();
  });
// ✅ Ensure underline & height are correct on first load
window.addEventListener("load", () => {
  syncPageStackHeight();
  moveIndicatorToActive();
});
