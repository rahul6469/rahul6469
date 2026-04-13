/* ===========================
   Rahul-aligned interactions
   (Robust init + underline + transitions + sidebar)
   =========================== */
document.body.classList.remove("no-js");
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Run when DOM is ready (works with/without defer)
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  // ---------- Sidebar: Show Contacts ----------
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

  // ---------- Navbar underline indicator ----------
  function moveIndicatorToActive() {
    const activeBtn = $(".navbar-link.active");
    const indicator = $(".nav-indicator");
    const list = $("#navbarList") || $(".navbar-list");
    if (!activeBtn || !indicator || !list) return;

    const listRect = list.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    // slide + resize underline
    indicator.style.transform = `translateX(${btnRect.left - listRect.left}px)`;
    indicator.style.width = `${btnRect.width}px`;
    indicator.style.opacity = "1";
  }

  // ---------- Page stack height ----------
  function syncPageStackHeight() {
    const stack = $("#pageStack");
    if (!stack) return;

    const activePage = $(".page.active") || $("article[data-page].active");
    if (!activePage) return;

    stack.style.minHeight = `${activePage.offsetHeight}px`;
  }

  // ---------- Page switching ----------
  function initPages() {
    const navButtons = $$("[data-nav-link]");
    const pages = $$("[data-page]");

    if (!navButtons.length || !pages.length) return;

    const validPages = pages.map(p => p.dataset.page).filter(Boolean);

    function setActivePage(name) {
      const pageName = validPages.includes(name) ? name : (validPages[0] || "about");

      // toggle pages
      pages.forEach(p => p.classList.toggle("active", p.dataset.page === pageName));

      // toggle navbar buttons
      navButtons.forEach(b => b.classList.toggle("active", b.dataset.target === pageName));

      // update hash (deep link)
      history.replaceState(null, "", `#${pageName}`);

      // after layout update
      requestAnimationFrame(() => {
        syncPageStackHeight();
        moveIndicatorToActive();
      });
    }

    // click handlers
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => setActivePage(btn.dataset.target));
    });

    // load initial page from hash
    const initial = (location.hash || `#${validPages[0] || "about"}`).replace("#", "");
    setActivePage(initial);

    // adjust on resize
    window.addEventListener("resize", () => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });

    // adjust after full load (fonts/icons can change widths)
    window.addEventListener("load", () => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });
  }

  // ---------- Theme toggle ----------
  function initTheme() {
    const root = document.documentElement;
    const toggle = $("#themeToggle");
    const icon = $("#themeIcon");
    if (!toggle) return;

    const applyTheme = (t) => {
      root.setAttribute("data-theme", t);
      localStorage.setItem("theme", t);
      if (icon) icon.textContent = t === "dark" ? "🌙" : "☀️";
    };

    applyTheme(localStorage.getItem("theme") || "dark");

    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);

      // theme change can affect sizes slightly
      requestAnimationFrame(() => {
        syncPageStackHeight();
        moveIndicatorToActive();
      });
    });
  }

  // ---------- Projects (Rahul-style cards) ----------
  function initProjects() {
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
      .then(r => r.json())
      .then(repos => {
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

        // projects change height of page
        requestAnimationFrame(() => {
          syncPageStackHeight();
          moveIndicatorToActive();
        });
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

  // ---------- Init all ----------
  onReady(() => {
  initSidebar();
  initTheme();
  initPages();
  initProjects();

  // ✅ Resume sub-tabs
  document.querySelectorAll(".resume-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.resumeTab;

      document.querySelectorAll(".resume-tab")
        .forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".resume-section")
        .forEach(sec => {
          sec.classList.toggle("active", sec.dataset.resumeSection === target);
        });
    });
  });

  // ✅ Reveal animation for "What I’m Doing"
  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
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

  // initial underline/height on first paint
  requestAnimationFrame(() => {
    syncPageStackHeight();
    moveIndicatorToActive();
  });
});

 // ✅ ADD RESUME SUB-TABS CODE HERE
  document.querySelectorAll(".resume-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.resumeTab;

      document.querySelectorAll(".resume-tab")
        .forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".resume-section")
        .forEach(sec => {
          sec.classList.toggle(
            "active",
            sec.dataset.resumeSection === target
          );
        });
    });
  });

    // initial underline/height on first paint
    requestAnimationFrame(() => {
      syncPageStackHeight();
      moveIndicatorToActive();
    });
     // ✅ Reveal animation for "What I’m Doing"
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach(el => observer.observe(el));
}
  });
})();
