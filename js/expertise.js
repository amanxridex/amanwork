// js/expertise.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from("#expertise .section-tag, #expertise .section-title", {
    scrollTrigger: {
      trigger: "#expertise",
      start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  gsap.from(".expertise-category", {
    scrollTrigger: {
      trigger: ".expertise-grid",
      start: "top 85%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out"
  });
});
