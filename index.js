/* ===========================
   Rahul-aligned interactions
   Fixes JS loading / init timing
   =========================== */

(function () {
  // ---- helpers ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function onReady(fn) {
    // If DOM already parsed, run now; else wait for DOMContentLoaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // ---- sidebar contacts toggle ----
  function setupSidebar() {
    const sidebar = $("[data-sidebar]");
    const sidebarBtn = $("[data-sidebar-btn]");
    const sidebarMore = $("[data-sidebar-more]");

    if (!sidebar || !sidebarBtn || !sidebarMore) return;

    sidebarBtn.setAttribute("aria-expanded", "false");

    sidebarBtn.addEventListener("click", () => {
      const isOpen = sidebarMore.classList.toggle("active");
      sidebar.classList.toggle("open", isOpen);
      sidebarBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // ---- page switching + transitions ----
  function setupPages() {
    const navButtons = $$("[data-nav-link]");
    const pages = $$("[data-page]");
    const stack = $("#pageStack");

    if (!navButtons.length || !pages.length) return;

    const validPages = Array.from(pages).map((p) => p.dataset.page);

    function syncPageStackHeight() {
      if (!stack) return;
      const activePage = $(".page.active") || $("article[data-page].active");
      if (!activePage) return;
      stack.style.minHeight = activePage.offsetHeight + "px";
    }

    function moveIndicatorToActive() {
      const activeBtn = $(".navbar-link.active");
      const indicator = $(".nav-indicator");
      const list = $("#navbarList") || $(".navbar-list");

      if (!activeBtn || !indicator || !list) return;

      const listRect = list.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();

      // Move & resize underline
      indicator.style.transform = `translateX(${btnRect.left - listRect.left}px)`;
      indicator.style.width = `${btnRect.width}px`;
      indicator.style.opacity = "1";
    }

    function setActivePage(pageName) {
      if (!validPages.includes(pageName)) pageName = validPages[0] || "about";

      pages.forEach((p) => p.classList.toggle("active", p.dataset.page === pageName));
      navButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === pageName));

      // Keep hash for deep-linking
      history.replaceState(null, "", `#${pageName}`);

      // Next frame ensures classes applied before measuring/positioning
      requestAnimationFrame(() => {
        syncPageStackHeight();
        moveIndicatorToActive();
      });
    }

    // Click handlers
    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => setActivePage(btn.dataset.target));
    });

    // Initial page from URL hash
    const initial = (location.hash || `#${validPages[0] || "about"}`).replace("#", "");
    setActivePage(validPages.includes(initial) ? initial : (validPages[0] || "about"));

    // Recompute on resize
    window.addEventListener("resize", () => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });

    // Also re-run after full load (fonts/icons can change button widths)
    window.addEventListener("load", () => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });
  }

  // ---- theme toggle ----
  function setupTheme() {
    const root = document.documentElement;
    const themeIcon = $("#themeIcon");
    const themeToggle = $("#themeToggle");

    if (!themeToggle) return;

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      if (themeIcon) themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
    }

    applyTheme(localStorage.getItem("theme") || "dark");

    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  // ---- projects rendering (Rahul-style cards) ----
  function setupProjects() {
    const grid = $("#projectsGrid");
    if (!grid) return;

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
      .then((r) => r.json())
      .then((repos) => {
        grid.innerHTML = "";

        repos.forEach((repo) => {
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

        // Update stack height after projects render (important for smooth transitions)
        const stack = $("#pageStack");
        const activePage = $(".page.active") || $("article[data-page].active");
        if (stack && activePage) stack.style.minHeight = activePage.offsetHeight + "px";
      })
      .catch(() => {
        grid.innerHTML = `
          <a class="project-card" href="https://github.com/rahul6469" target="_blank" rel="noopener">
            <div>
              <h3 class="p-title">Projects</h3>
              <p class="p-desc">Unable to load projects right now. Click to view repositories.</p>
            </div>
            <p class="p-tech"><span class="pill">Tech</span>GitHub</p>
          </a>
        `;
      });
  }

  // ---- init (safe) ----
  onReady(() => {
    setupSidebar();
    setupTheme();
    setupPages();
    setupProjects();
  });

})();
