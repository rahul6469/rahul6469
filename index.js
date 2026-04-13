document.body.classList.remove("no-js");

/* Page navigation */
document.querySelectorAll("[data-nav-link]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    document.querySelectorAll(".page")
      .forEach(p => p.classList.toggle("active", p.dataset.page === target));

    document.querySelectorAll(".navbar-link")
      .forEach(b => b.classList.toggle("active", b === btn));
  });
});

/* Reveal animation */
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
