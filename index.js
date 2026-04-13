document.body.classList.remove("no-js");

// Page navigation
document.querySelectorAll("[data-nav-link]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.querySelector(`[data-page='${btn.dataset.target}']`).classList.add("active");
  });
});

// ✅ FIX: Reveal cards
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
},{ threshold:0.15 });

reveals.forEach(r=>observer.observe(r));
