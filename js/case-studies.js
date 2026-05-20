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

  const cases = document.querySelectorAll(".case-study-card");

  cases.forEach((card, i) => {
    const isReverse = card.classList.contains("reverse");
    const img = card.querySelector(".case-study-image");
    const content = card.querySelector(".case-study-content");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
      }
    });

    tl.fromTo(img, 
      { x: isReverse ? 50 : -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(content, 
      { x: isReverse ? -50 : 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
      "-=0.8"
    );
  });
});
