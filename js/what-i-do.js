// js/what-i-do.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#what-i-do",
      start: "top 75%",
    }
  });

  tl.from("#what-i-do .section-tag, #what-i-do .section-title", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  })
  .from(".do-list li", {
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out"
  }, "-=0.4")
  .from(".abstract-shape", {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.7)"
  }, "-=0.8");

  // Subtle floating animation for shapes
  gsap.to(".shape-1", {
    y: -20,
    rotation: 5,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".shape-2", {
    y: 20,
    rotation: -5,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
});
