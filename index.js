/* ═══════════════════════════════════════════════════════
   index.js — Cohesion-level smooth scroll + animations
   ═══════════════════════════════════════════════════════ */

/* ── Lenis-style smooth scroll (vanilla, no lib needed) ── */
class SmoothScroll {
    constructor() {
        this.currentY = window.scrollY;
        this.targetY = window.scrollY;
        this.ease = 0.085; // lower = more inertia (Cohesion feel)
        this.running = false;
        this.listeners = [];
        this.init();
    }
    init() {
        // Override native scroll with wheel events
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.targetY = Math.max(0, Math.min(
                this.targetY + e.deltaY * 0.9,
                document.body.scrollHeight - window.innerHeight
            ));
            if (!this.running) this.run();
        }, { passive: false });

        // Touch support
        let touchStartY = 0;
        window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
        window.addEventListener('touchmove', e => {
            const delta = (touchStartY - e.touches[0].clientY) * 2;
            this.targetY = Math.max(0, Math.min(this.targetY + delta, document.body.scrollHeight - window.innerHeight));
            touchStartY = e.touches[0].clientY;
            if (!this.running) this.run();
        }, { passive: true });

        // Keep scrollY in sync for nav active state etc
        this.run();
    }
    run() {
        this.running = true;
        const tick = () => {
            this.currentY += (this.targetY - this.currentY) * this.ease;
            const diff = Math.abs(this.targetY - this.currentY);

            window.scrollTo(0, this.currentY);
            this.listeners.forEach(fn => fn(this.currentY));

            if (diff > 0.5) {
                requestAnimationFrame(tick);
            } else {
                this.currentY = this.targetY;
                window.scrollTo(0, this.currentY);
                this.running = false;
            }
        };
        requestAnimationFrame(tick);
    }
    on(fn) { this.listeners.push(fn); }
    scrollTo(y) { this.targetY = y; if (!this.running) this.run(); }
}

// Global smooth scroll instance (skip on touch/mobile)
let smoothScroll = null;

document.addEventListener('DOMContentLoaded', () => {
    // Init smooth scroll only on desktop
    if (!window.matchMedia('(pointer: coarse)').matches) {
        smoothScroll = new SmoothScroll();
    }

    initParticleCursor();
    initMobileTouchFeedback();
    initMobileNav();
    initScrollAnimations();
    initScrollParallax();
    initNavigation();
    initProjectCards();
    initSmoothReveal();
    initSubtitleTicker();
    initMagneticButtons();
    initScrollProgress();
    initShapeScrollParallax();
});

/* ---------------------------------------------------------
   MOBILE TOUCH FEEDBACK
--------------------------------------------------------- */
function initMobileTouchFeedback() {
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    const rippleLayer = document.createElement('div');
    rippleLayer.className = 'touch-ripple-layer';
    document.body.appendChild(rippleLayer);

    const interactiveSelector = [
        'a',
        'button',
        '.work-card',
        '.stack-item',
        '.hero-cta-new',
        '.contact-link.large',
        '.nav-container'
    ].join(',');

    let activeEl = null;
    let scrollTimer = null;

    const spawnRipple = (x, y) => {
        const ripple = document.createElement('span');
        ripple.className = 'touch-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        rippleLayer.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };

    const clearActive = () => {
        if (!activeEl) return;
        activeEl.classList.remove('touch-active');
        activeEl = null;
    };

    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (!touch) return;

        spawnRipple(touch.clientX, touch.clientY);
        clearActive();

        const target = e.target.closest(interactiveSelector);
        if (target) {
            activeEl = target;
            activeEl.classList.add('touch-active');
        }
    }, { passive: true });

    document.addEventListener('touchend', clearActive, { passive: true });
    document.addEventListener('touchcancel', clearActive, { passive: true });

    window.addEventListener('touchmove', () => {
        document.body.classList.add('touch-scrolling');
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            document.body.classList.remove('touch-scrolling');
        }, 130);
    }, { passive: true });
}

/* ─────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────── */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-bar';
    document.body.appendChild(bar);
    const update = () => {
        const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        bar.style.transform = `scaleX(${scrolled})`;
    };
    window.addEventListener('scroll', update, { passive: true });
}

/* ─────────────────────────────────────────
   PARTICLE CURSOR
───────────────────────────────────────── */
function initParticleCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) {
        document.body.classList.add('touch-device');
        return;
    }
    const oldDot = document.querySelector('.cursor-dot');
    const oldOutline = document.querySelector('.cursor-outline');
    if (oldDot) oldDot.style.display = 'none';
    if (oldOutline) oldOutline.style.display = 'none';

    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isHovering = false;
    const PARTICLE_COUNT = 28;
    const particles = [];

    class Particle {
        constructor(i) {
            this.i = i; this.x = mouse.x; this.y = mouse.y;
            this.size = Math.random() * 3.5 + 1.5; this.baseSize = this.size;
            this.hue = [50, 200, 270, 15][Math.floor(Math.random() * 4)];
            this.angle = Math.random() * Math.PI * 2;
            this.orbitRadius = 18 + i * 3.2; this.orbitSpeed = 0.04 + Math.random() * 0.02;
        }
        update() {
            const lag = 0.07 + this.i * 0.014;
            this.x += (mouse.x - this.x) * lag;
            this.y += (mouse.y - this.y) * lag;
            if (isHovering) {
                this.angle += this.orbitSpeed;
                this.x += (mouse.x + Math.cos(this.angle) * this.orbitRadius - this.x) * 0.14;
                this.y += (mouse.y + Math.sin(this.angle) * this.orbitRadius - this.y) * 0.14;
                this.size = this.baseSize * 1.6;
            } else { this.size = this.baseSize; }
        }
        draw() {
            const alpha = isHovering ? 0.9 : (1 - this.i / PARTICLE_COUNT) * 0.8;
            const pulse = isHovering ? Math.sin(Date.now() * 0.006 + this.i) * 0.3 + 0.7 : 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.1, this.size * pulse), 0, Math.PI * 2);
            if (isHovering) {
                const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
                g.addColorStop(0, `hsla(${this.hue},100%,70%,${alpha})`);
                g.addColorStop(1, `hsla(${this.hue},100%,50%,0)`);
                ctx.fillStyle = g;
            } else { ctx.fillStyle = `hsla(${this.hue},95%,65%,${alpha})`; }
            ctx.shadowBlur = isHovering ? 14 : 7;
            ctx.shadowColor = `hsla(${this.hue},100%,60%,0.8)`;
            ctx.fill();
        }
    }

    class CursorCore {
        constructor() { this.x = mouse.x; this.y = mouse.y; this.s = 1; this.ts = 1; }
        update() {
            this.x += (mouse.x - this.x) * 0.28; this.y += (mouse.y - this.y) * 0.28;
            this.ts = isHovering ? 1.9 : 1; this.s += (this.ts - this.s) * 0.14;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, 5 * this.s, 0, Math.PI * 2);
            ctx.fillStyle = isHovering ? '#fff' : 'gold';
            ctx.shadowBlur = 14; ctx.shadowColor = isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,215,0,0.9)';
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle(i));
    const core = new CursorCore();

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseover', e => { if (e.target.closest('a,button,.work-card,.stack-item,[data-cursor="hover"]')) isHovering = true; });
    document.addEventListener('mouseout', e => { if (e.target.closest('a,button,.work-card,.stack-item,[data-cursor="hover"]')) isHovering = false; });
    document.body.style.cursor = 'none';

    document.addEventListener('click', () => {
        for (let i = 0; i < 10; i++) {
            const b = new Particle(Math.random() * 4); b.x = mouse.x; b.y = mouse.y;
            particles.push(b);
            setTimeout(() => { const idx = particles.indexOf(b); if (idx > -1) particles.splice(idx, 1); }, 700);
        }
    });

    (function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        particles.forEach(p => { p.update(); p.draw(); });
        core.update(); core.draw();
        requestAnimationFrame(animate);
    })();
}

/* ─────────────────────────────────────────
   SHAPES SCROLL PARALLAX (Cohesion-style drift)
───────────────────────────────────────── */
function initShapeScrollParallax() {
    const shapes = document.querySelectorAll('.shape');
    if (!shapes.length) return;

    const speeds = [0.12, -0.08, 0.18, -0.14, 0.1, -0.16];

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        shapes.forEach((shape, i) => {
            const speed = speeds[i] || 0.1;
            const y = scrollY * speed;
            const currentTransform = shape.style.transform || '';
            // Preserve mouse parallax transform if set, add scroll drift
            shape.style.setProperty('--scroll-y', `${y}px`);
        });
    }, { passive: true });
}

/* ─────────────────────────────────────────
   SUBTITLE TICKER (Cohesion-style cycling text)
───────────────────────────────────────── */
function initSubtitleTicker() {
    const sub = document.querySelector('.hero-subtitle-new');
    if (!sub) return;

    const roles = [
        'Collaborative Team Player',
        'Full Stack Developer',
        'Startup Founder',
        'UI/UX Enthusiast',
        'Problem Solver'
    ];

    let currentIndex = 0;

    function cycle() {
        // Slide out
        sub.style.transition = 'transform 0.45s cubic-bezier(0.76,0,0.24,1), opacity 0.45s ease';
        sub.style.transform = 'translateY(-100%)';
        sub.style.opacity = '0';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % roles.length;
            sub.textContent = roles[currentIndex];
            sub.style.transition = 'none';
            sub.style.transform = 'translateY(100%)';
            sub.style.opacity = '0';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sub.style.transition = 'transform 0.45s cubic-bezier(0.76,0,0.24,1), opacity 0.45s ease';
                    sub.style.transform = 'translateY(0)';
                    sub.style.opacity = '1';
                });
            });
        }, 460);
    }

    // Initial set
    sub.style.display = 'inline-block';
    sub.style.overflow = 'hidden';
    setInterval(cycle, 2800);
}

/* ─────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────── */
function initMobileNav() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    if (!navContainer || !navLinks) return;
    navContainer.addEventListener('click', e => {
        if (e.target === navContainer || e.target.closest('.nav-container') === navContainer) {
            navContainer.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navContainer.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS — clip-path reveal style
───────────────────────────────────────── */
function initScrollAnimations() {
    // Animate counters
    function animateCounters(container) {
        container.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (!target || counter.classList.contains('counted')) return;
            counter.classList.add('counted');
            const dur = 2000; const t0 = performance.now();
            const tick = (now) => {
                const p = Math.min((now - t0) / dur, 1);
                counter.innerText = Math.floor((1 - Math.pow(1 - p, 3)) * target);
                if (p < 1) requestAnimationFrame(tick); else counter.innerText = target;
            };
            requestAnimationFrame(tick);
        });
    }

    const els = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = parseFloat(el.dataset.delay || 0);
            setTimeout(() => {
                el.classList.add('visible');
                if (el.classList.contains('about-stats') || el.dataset.animate === 'stagger-up') {
                    animateCounters(el);
                }
            }, delay * 1000);
            observer.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────
   SCROLL PARALLAX (about image + general)
───────────────────────────────────────── */
function initScrollParallax() {
    const parallaxEl = document.querySelector('[data-animate="parallax"]');
    if (!parallaxEl) return;
    window.addEventListener('scroll', () => {
        const rect = parallaxEl.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            parallaxEl.style.transform = `translateY(${rect.top * 0.06}px)`;
        }
    }, { passive: true });

    // Mouse parallax for hero shapes
    const shapes = document.querySelectorAll('.shape');
    const hero = document.querySelector('.hero-new');
    if (!hero || window.matchMedia('(pointer: coarse)').matches) return;
    let ticking = false;
    hero.addEventListener('mousemove', e => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
                shapes.forEach(shape => {
                    const speed = parseFloat(shape.dataset.speed) || 0.5;
                    const x = (e.clientX - cx) * speed * 0.025;
                    const y = (e.clientY - cy) * speed * 0.025;
                    shape.style.transform = `translate(${x}px, ${y}px) rotate(${(e.clientX - cx) * 0.008}deg)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
    hero.addEventListener('mouseleave', () => {
        shapes.forEach(s => {
            s.style.transition = 'transform 0.6s ease';
            s.style.transform = '';
            setTimeout(() => s.style.transition = '', 600);
        });
    });
}

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const el = document.querySelector(targetId);
                if (!el) return;
                const targetY = el.offsetTop - 100;
                if (smoothScroll) {
                    smoothScroll.scrollTo(targetY);
                } else {
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
            }
        });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                let current = '';
                const pos = window.scrollY + 200;
                sections.forEach(s => {
                    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id;
                });
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ─────────────────────────────────────────
   PROJECT CARDS — 3D Tilt + Staggered entrance
───────────────────────────────────────── */
function initProjectCards() {
    const cards = document.querySelectorAll('.work-card');

    cards.forEach((card, index) => {
        card.dataset.cardIndex = index;

        // Shine layer
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);

        // Number badge
        const num = document.createElement('div');
        num.className = 'card-num';
        num.textContent = `0${index + 1}`;
        card.querySelector('.card-content')?.prepend(num);

        // 3D tilt
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
            const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
            card.style.transform = `perspective(1200px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(12px)`;
            card.style.transition = 'transform 0.08s linear';
            shine.style.background = `radial-gradient(circle at ${((x+1)/2)*100}% ${((y+1)/2)*100}%, rgba(255,255,255,0.13) 0%, transparent 65%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.3s';
            shine.style.background = 'transparent';
        });
    });

    // Staggered entrance
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const i = parseInt(entry.target.dataset.cardIndex) || 0;
            setTimeout(() => entry.target.classList.add('card-visible'), i * 130);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.08 });
    cards.forEach(c => obs.observe(c));
}

/* ─────────────────────────────────────────
   SMOOTH REVEAL — Cohesion clip-path style
───────────────────────────────────────── */
function initSmoothReveal() {
    // Section headers get clip-path wipe
    document.querySelectorAll('.section-header, .stack-header').forEach(h => h.classList.add('reveal-header'));
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal-header').forEach(el => obs.observe(el));

    // Add line-reveal to all headings inside sections
    document.querySelectorAll('.about-title, .contact-title').forEach(h => {
        h.classList.add('heading-reveal');
        const obs2 = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('heading-visible'); obs2.unobserve(e.target); }
            });
        }, { threshold: 0.2 });
        obs2.observe(h);
    });
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────────── */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.hero-cta-new, .contact-link.large').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.28;
            const y = (e.clientY - r.top - r.height / 2) * 0.28;
            btn.style.transform = `translate(${x}px,${y}px) scale(1.04)`;
            btn.style.transition = 'transform 0.1s ease';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        });
    });
}
