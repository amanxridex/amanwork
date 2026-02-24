/* index.js — Enhanced with particle cursor, 3D cards & smooth animations */
document.addEventListener('DOMContentLoaded', () => {
    initParticleCursor();
    initMobileNav();
    initScrollAnimations();
    initParallaxEffects();
    initNavigation();
    initProjectCards();
    initSmoothReveal();
    initTextSplit();
    initMagneticButtons();
});

/* ─── PARTICLE CURSOR ─── */
function initParticleCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) { document.body.classList.add('touch-device'); return; }
    const oldDot = document.querySelector('.cursor-dot');
    const oldOutline = document.querySelector('.cursor-outline');
    if (oldDot) oldDot.style.display = 'none';
    if (oldOutline) oldOutline.style.display = 'none';

    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isHovering = false;
    const PARTICLE_COUNT = 28;
    const particles = [];

    class Particle {
        constructor(i) {
            this.i = i; this.x = mouse.x; this.y = mouse.y;
            this.size = Math.random() * 4 + 1.5; this.baseSize = this.size;
            this.hue = Math.random() < 0.6 ? 50 : (Math.random() < 0.5 ? 200 : 270);
            this.angle = Math.random() * Math.PI * 2;
            this.orbitRadius = 20 + i * 3.5; this.orbitSpeed = 0.03 + Math.random() * 0.02;
        }
        update() {
            const lag = 0.08 + this.i * 0.015;
            this.x += (mouse.x - this.x) * lag; this.y += (mouse.y - this.y) * lag;
            if (isHovering) {
                this.angle += this.orbitSpeed;
                const ox = mouse.x + Math.cos(this.angle) * this.orbitRadius;
                const oy = mouse.y + Math.sin(this.angle) * this.orbitRadius;
                this.x += (ox - this.x) * 0.12; this.y += (oy - this.y) * 0.12;
                this.size = this.baseSize * 1.5;
            } else { this.size = this.baseSize; }
        }
        draw() {
            const alpha = isHovering ? 0.9 : (1 - this.i / PARTICLE_COUNT) * 0.85;
            const pulse = isHovering ? Math.sin(Date.now() * 0.005 + this.i) * 0.3 + 0.7 : 1;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
            if (isHovering) {
                const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
                grd.addColorStop(0, `hsla(${this.hue},100%,70%,${alpha})`);
                grd.addColorStop(1, `hsla(${this.hue},100%,50%,0)`);
                ctx.fillStyle = grd;
            } else { ctx.fillStyle = `hsla(${this.hue},95%,65%,${alpha})`; }
            ctx.shadowBlur = isHovering ? 15 : 8; ctx.shadowColor = `hsla(${this.hue},100%,60%,0.8)`;
            ctx.fill();
        }
    }

    class CursorCore {
        constructor() { this.x = mouse.x; this.y = mouse.y; this.scale = 1; this.targetScale = 1; }
        update() {
            this.x += (mouse.x - this.x) * 0.25; this.y += (mouse.y - this.y) * 0.25;
            this.targetScale = isHovering ? 1.8 : 1; this.scale += (this.targetScale - this.scale) * 0.15;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, 5 * this.scale, 0, Math.PI * 2);
            ctx.fillStyle = isHovering ? '#fff' : 'gold';
            ctx.shadowBlur = 12; ctx.shadowColor = isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,215,0,0.9)';
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle(i));
    const core = new CursorCore();

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseover', e => { if (e.target.closest('[data-cursor="hover"],a,button,.work-card,.stack-item')) isHovering = true; });
    document.addEventListener('mouseout', e => { if (e.target.closest('[data-cursor="hover"],a,button,.work-card,.stack-item')) isHovering = false; });
    document.body.style.cursor = 'none';

    document.addEventListener('click', () => {
        for (let i = 0; i < 8; i++) {
            const b = new Particle(Math.random() * 5); b.x = mouse.x; b.y = mouse.y;
            particles.push(b);
            setTimeout(() => { const idx = particles.indexOf(b); if (idx > -1) particles.splice(idx, 1); }, 600);
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        particles.forEach(p => { p.update(); p.draw(); });
        core.update(); core.draw();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ─── MOBILE NAV ─── */
function initMobileNav() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    if (!navContainer || !navLinks) return;
    navContainer.addEventListener('click', e => {
        if (e.target === navContainer || e.target.closest('.nav-container') === navContainer) {
            navContainer.classList.toggle('active'); navLinks.classList.toggle('active'); document.body.classList.toggle('menu-open');
        }
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => { navContainer.classList.remove('active'); navLinks.classList.remove('active'); document.body.classList.remove('menu-open'); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) { navContainer.classList.remove('active'); navLinks.classList.remove('active'); document.body.classList.remove('menu-open'); }
    });
}

/* ─── SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate="fade-up"],[data-animate="slide-up"],[data-animate="scale-in"],[data-animate="stagger-up"]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('about-stats') || entry.target.dataset.animate === 'stagger-up') animateCounters(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => { if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}s`; observer.observe(el); });
}

function animateCounters(container) {
    container.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (!target || counter.classList.contains('counted')) return;
        counter.classList.add('counted');
        const duration = 2000; const startTime = performance.now();
        function update(now) {
            const p = Math.min((now - startTime) / duration, 1);
            counter.innerText = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(update); else counter.innerText = target;
        }
        requestAnimationFrame(update);
    });
}

/* ─── PARALLAX ─── */
function initParallaxEffects() {
    const parallaxEl = document.querySelector('[data-animate="parallax"]');
    if (parallaxEl) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scroll = window.scrollY;
                    const itemTop = parallaxEl.getBoundingClientRect().top + scroll;
                    if (scroll + window.innerHeight > itemTop && scroll < itemTop + parallaxEl.offsetHeight)
                        parallaxEl.style.transform = `translateY(${(scroll - itemTop) * 0.08}px)`;
                    ticking = false;
                }); ticking = true;
            }
        });
    }
    initParallaxShapes();
}

function initParallaxShapes() {
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
                    shape.style.transform = `translate(${(e.clientX - cx) * speed * 0.03}px,${(e.clientY - cy) * speed * 0.03}px) rotate(${(e.clientX - cx) * 0.01}deg)`;
                }); ticking = false;
            }); ticking = true;
        }
    });
    hero.addEventListener('mouseleave', () => {
        shapes.forEach(s => { s.style.transition = 'transform 0.5s ease'; s.style.transform = ''; setTimeout(() => s.style.transition = '', 500); });
    });
}

/* ─── NAVIGATION ─── */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const el = document.querySelector(targetId);
                if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
            }
        });
    });
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                let current = ''; const scrollPos = window.scrollY + 200;
                sections.forEach(s => { if (scrollPos >= s.offsetTop && scrollPos < s.offsetTop + s.offsetHeight) current = s.id; });
                navLinks.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === `#${current}`) l.classList.add('active'); });
                ticking = false;
            }); ticking = true;
        }
    });
}

/* ─── PROJECT CARDS — 3D Cinematic ─── */
function initProjectCards() {
    const cards = document.querySelectorAll('.work-card');
    cards.forEach((card, index) => {
        card.dataset.cardIndex = index;
        card.classList.add('card-3d');

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            card.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateZ(10px)`;
            card.style.transition = 'transform 0.1s ease';
            const shine = card.querySelector('.card-shine');
            if (shine) shine.style.background = `radial-gradient(circle at ${((x+1)/2)*100}% ${((y+1)/2)*100}%,rgba(255,255,255,0.12) 0%,transparent 60%)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
            const shine = card.querySelector('.card-shine');
            if (shine) shine.style.background = 'transparent';
        });

        const shine = document.createElement('div'); shine.className = 'card-shine'; card.appendChild(shine);
        const numBadge = document.createElement('div'); numBadge.className = 'card-num'; numBadge.textContent = `0${index + 1}`;
        card.querySelector('.card-content')?.prepend(numBadge);
    });

    const cardObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const i = parseInt(entry.target.dataset.cardIndex) || 0;
            setTimeout(() => entry.target.classList.add('card-visible'), i * 120);
            cardObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08 });
    cards.forEach(card => cardObserver.observe(card));
}

/* ─── SMOOTH SECTION REVEAL ─── */
function initSmoothReveal() {
    document.querySelectorAll('.section-header,.stack-header').forEach(h => h.classList.add('reveal-header'));
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal-header').forEach(el => obs.observe(el));

    const bar = document.createElement('div'); bar.id = 'scroll-bar'; document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
        bar.style.width = `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`;
    });
}

/* ─── HERO TEXT SPLIT ─── */
function initTextSplit() {
    const title = document.querySelector('.hero-title-new');
    if (!title) return;
    const words = title.innerHTML.split(' ');
    title.innerHTML = words.map((w, i) => `<span class="word-wrap" style="--i:${i}"><span class="word">${w}</span></span>`).join(' ');

    const sub = document.querySelector('.hero-subtitle-new');
    if (sub) {
        const text = sub.textContent; sub.textContent = ''; sub.style.opacity = 1;
        let j = 0;
        const type = () => { if (j < text.length) { sub.textContent += text[j++]; setTimeout(type, 40 + Math.random() * 20); } };
        setTimeout(type, 800);
    }
}

/* ─── MAGNETIC BUTTONS ─── */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.hero-cta-new,.contact-link.large').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            btn.style.transform = `translate(${x}px,${y}px) scale(1.05)`;
            btn.style.transition = 'transform 0.1s ease';
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)'; });
    });
}