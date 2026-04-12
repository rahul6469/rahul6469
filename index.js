// ---------------------------
// Helpers
// ---------------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------------------------
// Year
// ---------------------------
$("#year").textContent = new Date().getFullYear();

// ---------------------------
// Dark/Light Theme Toggle (saved)
// ---------------------------
const root = document.documentElement;
const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  applyTheme(savedTheme);
} else {
  // Default to dark
  applyTheme("dark");
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ---------------------------
// Mobile Hamburger Drawer
// ---------------------------
const sidebar = $("#sidebar");
const overlay = $("#overlay");
const menuBtn = $("#menuBtn");

function openMenu() {
  sidebar.classList.add("open");
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

menuBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) closeMenu();
  else openMenu();
});

overlay.addEventListener("click", closeMenu);

// Close drawer after clicking a nav item (mobile)
$$(".navlink").forEach((link) => {
  link.addEventListener("click", () => {
    // Only close on mobile layout
    if (window.matchMedia("(max-width: 980px)").matches) closeMenu();
  });
});

// Close drawer with ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// ---------------------------
// Smooth section reveal animations
// ---------------------------
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );

  $$(".reveal").forEach((el) => observer.observe(el));
} else {
  // If user prefers reduced motion, show everything immediately
  $$(".reveal").forEach((el) => el.classList.add("is-visible"));
}
