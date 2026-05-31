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
    { y: 60, scale: 0.9, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.5)" }, 
    "-=0.4"
  );
});
