// js/hero.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline();

  tl.from(".hero-title", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.2
  })
  .from(".hero-subtitle", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.6")
  .from(".hero-actions .btn", {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out"
  }, "-=0.4")
  .from(".code-window", {
    x: 50,
    opacity: 0,
    duration: 1,
    rotationY: 15,
    ease: "power3.out"
  }, "-=0.8");

  // Parallax effect on scroll
  gsap.to(".code-window", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
});
