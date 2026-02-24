/* index.js */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor (Desktop only)
    initCustomCursor();
    
    // 2. Mobile Navigation
    initMobileNav();
    
    // 3. Scroll Animations
    initScrollAnimations();
    
    // 4. Parallax Effects
    initParallaxEffects();
    
    // 5. Navigation Active State & Smooth Scroll
    initNavigation();
});

// Custom Cursor - Desktop Only
function initCustomCursor() {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        document.body.classList.add('touch-device');
        return;
    }

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth follow animation for outline
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover effects
    const hoverElements = document.querySelectorAll('[data-cursor="hover"]');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'gold';
        });
    });
}

// Mobile Navigation
function initMobileNav() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navContainer || !navLinks) return;

    // Toggle menu on click
    navContainer.addEventListener('click', (e) => {
        // Only toggle if clicking the container itself (not links)
        if (e.target === navContainer || e.target.closest('.nav-container') === navContainer) {
            navContainer.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navContainer.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
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
                animateCounters(entry.target);
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
}

// Animate Counters
function animateCounters(container) {
    const counters = container.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (!target || counter.classList.contains('counted')) return;
        
        counter.classList.add('counted');
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            counter.innerText = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Parallax Effects
function initParallaxEffects() {
    // About image parallax
    const parallaxEl = document.querySelector('[data-animate="parallax"]');
    if (parallaxEl) {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scroll = window.scrollY;
                    const itemTop = parallaxEl.getBoundingClientRect().top + scroll;
                    
                    if (scroll + window.innerHeight > itemTop && scroll < itemTop + parallaxEl.offsetHeight) {
                        const distance = scroll - itemTop;
                        parallaxEl.style.transform = `translateY(${distance * 0.1}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Hero shapes parallax
    initParallaxShapes();
}

// Hero Shapes Parallax
function initParallaxShapes() {
    const shapes = document.querySelectorAll('.shape');
    const hero = document.querySelector('.hero-new');

    if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

    let ticking = false;

    hero.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const { clientX, clientY } = e;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                shapes.forEach((shape) => {
                    const speed = parseFloat(shape.dataset.speed) || 0.5;
                    const x = (clientX - centerX) * speed * 0.03;
                    const y = (clientY - centerY) * speed * 0.03;
                    const rotate = (clientX - centerX) * 0.01;

                    shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    hero.addEventListener('mouseleave', () => {
        shapes.forEach(shape => {
            shape.style.transition = 'transform 0.5s ease';
            shape.style.transform = '';
            setTimeout(() => {
                shape.style.transition = '';
            }, 500);
        });
    });
}

// Navigation Active State & Smooth Scroll
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    const offsetTop = targetEl.offsetTop - 100; // Account for nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update active state on scroll
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                const scrollPos = window.scrollY + 200;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
}