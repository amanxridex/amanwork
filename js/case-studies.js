// js/case-studies.js

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(".case-studies-section .section-header", 
    { y: 30, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".case-studies-section",
        start: "top 85%",
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }
  );

  const bentoCards = document.querySelectorAll(".bento-card");

  bentoCards.forEach((card, i) => {
    gsap.fromTo(card, 
      { y: 50, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
        },
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: (i % 4) * 0.1
      }
    );
  });
});
