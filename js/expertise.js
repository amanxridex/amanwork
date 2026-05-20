// js/expertise.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#expertise",
      start: "top 80%",
    }
  });

  tl.fromTo("#expertise .section-tag, #expertise .section-title", 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
  )
  .fromTo(".expertise-category", 
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 
    "-=0.4"
  );
});
