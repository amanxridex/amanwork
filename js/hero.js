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

  // 3D Interactive Mouse Tilt
  const codeWindow = document.querySelector('.code-window');
  const heroSection = document.querySelector('.hero-section');
  
  if (codeWindow && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      // Calculate mouse position relative to center of screen
      const xPos = (e.clientX / window.innerWidth) - 0.5;
      const yPos = (e.clientY / window.innerHeight) - 0.5;
      
      // Calculate rotation (more movement = more tilt)
      const rotateY = xPos * 30 - 5; // offset slightly
      const rotateX = yPos * -30 + 5;
      
      gsap.to(codeWindow, {
        rotationY: rotateY,
        rotationX: rotateX,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to(codeWindow, {
        rotationY: -12,
        rotationX: 8,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto"
      });
    });
  }
});
