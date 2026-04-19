/* ===========================
   Portfolio interactions (clean & stable)
   - Sidebar contacts toggle
   - Navbar page switching + deep link
   - Moving underline indicator
   - Theme toggle
   - Projects load
   - Resume sub-tabs
   - Reveal animation (What I’m Doing)
   =========================== */

document.body.classList.remove("no-js");

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  /* ---------- Sidebar: Show Contacts ---------- */
  function initSidebar() {
    const sidebar = $("[data-sidebar]");
    const btn = $("[data-sidebar-btn]");
    const more = $("[data-sidebar-more]");
    if (!sidebar || !btn || !more) return;

    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", () => {
      const isOpen = more.classList.toggle("active");
      sidebar.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ---------- Navbar underline indicator ---------- */
  function moveIndicatorToActive() {
    const activeBtn = $(".navbar-link.active");
    const indicator = $(".nav-indicator");
    const list = $("#navbarList") || $(".navbar-list");
    if (!activeBtn || !indicator || !list) return;

    const listRect = list.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    indicator.style.transform = `translateX(${btnRect.left - listRect.left}px)`;
    indicator.style.width = `${btnRect.width}px`;
    indicator.style.opacity = "1";
  }

  /* ---------- Page stack height ---------- */
  function syncPageStackHeight() {
    const stack = $("#pageStack");
    if (!stack) return;

    const activePage = $(".page.active") || $("article[data-page].active");
    if (!activePage) return;

    stack.style.minHeight = `${activePage.offsetHeight}px`;
  }

  /* ---------- Page switching ---------- */
  function initPages() {
    const navButtons = $$("[data-nav-link]");
    const pages = $$("[data-page]");
    if (!navButtons.length || !pages.length) return;

    const validPages = pages.map(p => p.dataset.page).filter(Boolean);

    function setActivePage(name) {
      const pageName = validPages.includes(name) ? name : (validPages[0] || "about");

      pages.forEach(p => p.classList.toggle("active", p.dataset.page === pageName));
      navButtons.forEach(b => b.classList.toggle("active", b.dataset.target === pageName));

      history.replaceState(null, "", `#${pageName}`);

      requestAnimationFrame(() => {
        syncPageStackHeight();
        moveIndicatorToActive();
      });
    }

    navButtons.forEach(btn => {
      btn.addEventListener("click", () => setActivePage(btn.dataset.target));
    });

    const initial = (location.hash || `#${validPages[0] || "about"}`).replace("#", "");
    setActivePage(initial);

    window.addEventListener("resize", () => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });

    window.addEventListener("load", () => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });
  }

  /* ---------- Theme toggle ---------- */
function initThemeMenu() {
  const root = document.documentElement;

  const btn = document.getElementById("themeBtn");
  const dropdown = document.getElementById("themeDropdown");
  const icon = document.getElementById("themeBtnIcon");
  const label = document.getElementById("themeBtnLabel");

  if (!btn || !dropdown || !icon || !label) return;

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const modes = {
    system: { icon: "🖥️", label: "System" },
    light: { icon: "☀️", label: "Light" },
    dark: { icon: "🌙", label: "Dark" }
  };

  function applyMode(mode) {
    localStorage.setItem("themeMode", mode);

    const effectiveTheme =
      mode === "system"
        ? (media.matches ? "dark" : "light")
        : mode;

    root.setAttribute("data-theme", effectiveTheme);
    icon.textContent = modes[mode].icon;
    label.textContent = modes[mode].label;
  }

  applyMode(localStorage.getItem("themeMode") || "system");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });

  dropdown.querySelectorAll(".theme-option").forEach(option => {
    option.addEventListener("click", () => {
      applyMode(option.dataset.themeMode);
      dropdown.classList.remove("open");
    });
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("open");
  });

  media.addEventListener("change", () => {
    if ((localStorage.getItem("themeMode") || "system") === "system") {
      applyMode("system");
    }
  });
}
  /* ---------- Reveal animation (What I’m Doing) ---------- */
 function initReveal() {

    // ✅ ADD THIS LINE HERE
    document.querySelectorAll(".timeline").forEach(tl =>
      tl.classList.add("reveal")
    );

    const revealItems = $$(".reveal");
    if (!revealItems.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(el => observer.observe(el));
}
  /* ---------- Projects cards ---------- */
  function initProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  // Map each repo to: [description, tech, ionicon]
  const projectMeta = {
    "Gold-Prediction-Model": ["ML regression for gold price prediction", "Python • ML • Jupyter", "trending-up-outline"],
    "House-Price-Prediction-Model": ["House price estimation using regression", "Python • Regression", "home-outline"],
    "Sales-Prediction": ["Sales forecasting using supervised ML", "Python • Analytics", "bar-chart-outline"],
    "IRIS-Flower-Classification": ["Iris dataset ML classification", "Python • Classification", "leaf-outline"],
    "Personality-Prediction-Using-opencv-": ["Computer vision using OpenCV", "Python • OpenCV", "camera-outline"],
    "Virtual-assistance-healthcare-chatbot": ["Healthcare chatbot automation", "Python • Chatbot", "chatbubbles-outline"],
    "Computer-Aided-Detection-of-Melanoma-skin-cancer-based-on-Lesion-images-using-Machine-Learning":
      ["Melanoma detection using ML", "Python • Medical ML", "medkit-outline"],
    "Cognitive-Resurgence-Machine-Learning-Approaches-to-Drug-Repurposing-in-Alzheimer-s-":
      ["Drug repurposing ML research", "Python • Research", "flask-outline"]
  };

  fetch("https://api.github.com/users/rahul6469/repos?per_page=100")
    .then(r => r.json())
    .then(repos => {
      grid.innerHTML = "";

      repos.forEach(repo => {
        const meta = projectMeta[repo.name];
        if (!meta) return;

        const [desc, tech, icon] = meta;

        const card = document.createElement("a");
        card.className = "project-card";           // keep your existing hover behavior
        card.href = repo.html_url;
        card.target = "_blank";
        card.rel = "noopener";

        // ✅ Make project contents match "What I'm Doing" structure
        card.innerHTML = `
          <div class="project-head">
            <div class="doing-icon project-icon">
              <ion-icon name="${icon}"></ion-icon>
            </div>
            <h4 class="project-title">${repo.name.replace(/-/g, " ")}</h4>
          </div>

          <p class="project-desc">${desc}</p>

          <p class="project-meta">
            <span class="pill">Tech</span>${tech}
          </p>
        `;

        grid.appendChild(card);
      });

      // Keep height correct after projects load
      requestAnimationFrame(() => {
        if (typeof syncPageStackHeight === "function") syncPageStackHeight();
      });
    })
    .catch(() => {
      grid.innerHTML = `
        <a class="project-card" href="https://github.com/rahul6469" target="_blank" rel="noopener">
          <div class="project-head">
            <div class="doing-icon project-icon">
              <ion-icon name="logo-github"></ion-icon>
            </div>
            <h4 class="project-title">Projects</h4>
          </div>
          <p class="project-desc">Unable to load projects right now. Click to view repositories.</p>
          <p class="project-meta"><span class="pill">Tech</span>GitHub</p>
        </a>
      `;
    });
}

  /* ---------- Init all ---------- */
  onReady(() => {
    initSidebar();
    initPages();
    initProjects();
    initResumeTabs();
    initReveal();
    initThemeMenu();

    requestAnimationFrame(() => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });
  });
})();

