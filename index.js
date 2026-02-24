/* index.js */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverElements = document.querySelectorAll('[data-cursor="hover"]');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot && cursorOutline) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        }
    });

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                cursorOutline.style.borderColor = 'transparent';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.borderColor = 'gold'; // Assuming dark mode uses gold
            }
        });
    });

    // 2. Scroll Animations (Intersection Observer)
    const fadeUpElements = document.querySelectorAll('[data-animate="fade-up"], [data-animate="slide-up"], [data-animate="scale-in"], [data-animate="stagger-up"]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            // Stats counter animation
            if (entry.target.classList.contains('about-stats') || entry.target.dataset.animate === 'stagger-up') {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-count');
                    const duration = 2000;
                    const increment = target / (duration / 16);

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    fadeUpElements.forEach(el => {
        if (el.dataset.delay) {
            el.style.transitionDelay = `${el.dataset.delay}s`;
        }
        appearOnScroll.observe(el);
    });

    // 3. Parallax Effect for About Image
    const parallaxEl = document.querySelector('[data-animate="parallax"]');
    if (parallaxEl) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            const itemTop = parallaxEl.getBoundingClientRect().top + scroll;
            if (scroll + window.innerHeight > itemTop && scroll < itemTop + parallaxEl.offsetHeight) {
                const distance = scroll - itemTop;
                parallaxEl.style.transform = `translateY(${distance * 0.1}px)`;
            }
        });
    }

    // 4. Parallax Effect for Hero 3D Shapes
    initParallaxShapes();

    // 5. Navigation Active State & Smooth Scroll for nav
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
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
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
            const x = (clientX - centerX) * speed * 0.04;
            const y = (clientY - centerY) * speed * 0.04;
            const rotate = (clientX - centerX) * 0.015;

            shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        shapes.forEach(shape => {
            shape.style.transform = '';
        });
    });
}