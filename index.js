/* index.js */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Active State & Smooth Scroll
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }

                // Update active state manually on click
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // 2. Parallax Effect for Floating Shapes
    initParallaxShapes();
});

function initParallaxShapes() {
    const shapes = document.querySelectorAll('.shape');
    const hero = document.querySelector('.hero-new');

    if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        shapes.forEach((shape) => {
            const speed = parseFloat(shape.dataset.speed) || 0.5;
            // Calculate movement based on distance from center
            const x = (clientX - centerX) * speed * 0.04;
            const y = (clientY - centerY) * speed * 0.04;
            const rotate = (clientX - centerX) * 0.015;

            shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
        });
    });

    // Reset when mouse leaves the hero section
    hero.addEventListener('mouseleave', () => {
        shapes.forEach(shape => {
            shape.style.transform = '';
        });
    });
}