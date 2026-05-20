// js/workflow.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from("#workflow .section-tag, #workflow .section-title", {
    scrollTrigger: {
      trigger: "#workflow",
      start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  gsap.from(".workflow-text", {
    scrollTrigger: {
      trigger: "#workflow",
      start: "top 75%",
    },
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power3.out"
  });
});
