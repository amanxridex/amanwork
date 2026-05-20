// js/global.js

// Initialize Lenis for buttery smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

// Sync GSAP ticker with Lenis
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable GSAP lag smoothing to prevent conflicts with Lenis
gsap.ticker.lagSmoothing(0);

// Custom Cursor (Optional minimal cursor)
const cursorDot = document.querySelector('.cursor-dot');

if (cursorDot) {
  window.addEventListener('mousemove', (e) => {
    gsap.to(cursorDot, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power2.out"
    });
  });
}

// Active Nav Link updating based on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".contact-section .section-title, .contact-section .email-link", {
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 85%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });
});
