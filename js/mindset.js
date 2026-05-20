// js/mindset.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  // Animate the title and tag
  gsap.from("#mindset .section-tag, #mindset .section-title", {
    scrollTrigger: {
      trigger: "#mindset",
      start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Animate cards
  gsap.from(".mindset-card", {
    scrollTrigger: {
      trigger: ".mindset-grid",
      start: "top 85%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out"
  });
});
