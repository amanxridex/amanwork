// js/mindset.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#mindset",
      start: "top 80%",
    }
  });

  tl.fromTo("#mindset .section-tag, #mindset .section-title", 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
  )
  .fromTo(".mindset-card", 
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 
    "-=0.4"
  );
});
