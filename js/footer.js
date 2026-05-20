// js/footer.js

document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".logo-wrapper");

  // Keep track of mouse position
  let mouseX = -1000;
  let mouseY = -1000;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Use a ticker for smoother performance rather than mousemove event spam
  gsap.ticker.add(() => {
    wrappers.forEach(wrapper => {
      const logo = wrapper.querySelector(".runaway-logo");
      const rect = wrapper.getBoundingClientRect(); // Static wrapper bounds
      
      const wrapperX = rect.left + rect.width / 2;
      const wrapperY = rect.top + rect.height / 2;
      
      const distX = mouseX - wrapperX;
      const distY = mouseY - wrapperY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      const triggerRadius = 150; // Distance at which they run away

      if (distance < triggerRadius) {
        logo.dataset.escaping = "true";
        
        // Calculate escape angle (away from mouse)
        const angle = Math.atan2(distY, distX);
        
        // Push force stronger when mouse is closer
        const pushForce = Math.pow((triggerRadius - distance) / triggerRadius, 1.5);
        
        // Max distance to run away
        const maxMove = 120;
        const moveX = -Math.cos(angle) * pushForce * maxMove;
        const moveY = -Math.sin(angle) * pushForce * maxMove;
        
        // Spin proportionally
        const rotate = -Math.cos(angle) * pushForce * 180;

        // Animate escape immediately
        gsap.to(logo, {
          x: moveX,
          y: moveY,
          rotation: rotate,
          scale: 1.2,
          duration: 0.2,
          ease: "power2.out",
          overwrite: true
        });
      } else {
        if (logo.dataset.escaping === "true") {
          logo.dataset.escaping = "false";
          
          // Bounce back to original spot
          gsap.to(logo, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1.5,
            ease: "elastic.out(1, 0.4)",
            overwrite: true,
            onComplete: () => {
              // Clear GSAP transforms so CSS floating animation resumes perfectly
              gsap.set(logo, { clearProps: "transform" });
            }
          });
        }
      }
    });
  });
});
