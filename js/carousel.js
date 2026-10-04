const PALETTE = {
    void: '#05070E',
    ink: '#0E1A33',
    navy500: '#3A64A7',
    navy400: '#4472B6',
    navy300: '#5381BE',
    accent: '#C88A3E',
    mist: '#9FB6D5',
};

function ready(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
        fn();
    }
}

ready(async () => {
    const section = document.getElementById('komiteler');
    const canvas = document.getElementById('committees-stage');
    const slides = Array.from(document.querySelectorAll('.committee-slide'));
    if (!section || !canvas || slides.length === 0) return;

    // Mobile path: skip Three.js stage + GTA camera entirely. Render slides as
    // a vertical card list and let tap → modal (handled in main.js).
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = mobileQuery.matches;
    const reducedMotion = motionQuery.matches;
    if (isMobile || reducedMotion) {
        slides.forEach((slide) => {
            slide.addEventListener('click', (e) => {
                if (e.target.closest('a, button')) return;
                const num = slide.querySelector('.committee__num')?.textContent?.trim();
                if (num && typeof window.openCommitteeModal === 'function') {
                    window.openCommitteeModal(num, slide);
                }
            });
        });
        return;
    }

    if (location.hash !== '#komiteler' && 'IntersectionObserver' in window) {
        await new Promise((resolve) => {
            const observer = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                observer.disconnect();
                resolve();
            }, { rootMargin: '200px 0px' });
            observer.observe(section);
        });
    }

    let initStage;
    try {
        ({ initStage } = await import('./scene/stage.js'));
    } catch (error) {
        console.error('Komite görsel sahnesi yüklenemedi:', error);
        slides.forEach((slide) => slide.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            const num = slide.querySelector('.committee__num')?.textContent?.trim();
            if (num) window.openCommitteeModal?.(num, slide);
        }));
        return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const stage = initStage(canvas, { palette: PALETTE, dpr });

    // Lenis smooth scroll — cinematic momentum, cheap UX upgrade
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis = null;
    let lenisRafId = null;
    let destroyed = false;
    if (window.Lenis && !reduced) {
        lenis = new window.Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.4,
        });
        function lenisRaf(time) {
            if (destroyed) return;
            lenis.raf(time);
            lenisRafId = requestAnimationFrame(lenisRaf);
        }
        lenisRafId = requestAnimationFrame(lenisRaf);
    }

    let inView = false;
    let modalOpen = false;
    let rafId = null;

    function loop(t) {
        if (destroyed) return;
        stage.tick(t);
        if ((inView || modalOpen) && document.visibilityState === 'visible') {
            rafId = requestAnimationFrame(loop);
        } else {
            rafId = null;
        }
    }

    const onResize = () => stage.resize();
    const onVisibilityChange = () => {
        if (!document.hidden && inView && rafId === null) loop(performance.now());
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Active slide = the one whose vertical center is closest to viewport center.
    // Before first slide / after last slide: overview mode (HOME_TARGET, all signatures visible).
    let activeSlide = null;
    function setActiveSlide(slide) {
        if (slide === activeSlide) return;
        activeSlide?.classList.remove('is-active');
        activeSlide = slide;
        activeSlide?.classList.add('is-active');
        const sig = activeSlide?.getAttribute('data-signature') ?? null;
        stage.setActive(sig);
    }

    function updateActiveFromScroll() {
        const vh = window.innerHeight;
        const vc = vh * 0.5;
        let best = null;
        let bestDist = Infinity;
        let anyInView = false;
        for (const s of slides) {
            const r = s.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) continue;
            anyInView = true;
            const center = r.top + r.height * 0.5;
            const dist = Math.abs(center - vc);
            if (dist < bestDist) { bestDist = dist; best = s; }
        }
        inView = anyInView;
        if (!modalOpen) {
            document.body.classList.toggle('committees-visible', anyInView);
        }

        // Overview mode: viewport center above first slide OR below last slide
        // → no signature active, camera stays at wide HOME_TARGET
        if (anyInView) {
            const firstR = slides[0].getBoundingClientRect();
            const lastR = slides[slides.length - 1].getBoundingClientRect();
            const beforeFirst = firstR.top > vc;
            const afterLast = lastR.bottom < vc;
            if (beforeFirst || afterLast) {
                setActiveSlide(null);
            } else if (best) {
                setActiveSlide(best);
            }
        }

        if ((anyInView || modalOpen) && rafId === null) loop(performance.now());
    }

    let scrollTicking = false;
    function onScrollOrResize() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            if (destroyed) return;
            updateActiveFromScroll();
            scrollTicking = false;
        });
    }
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    updateActiveFromScroll();

    // Click / keyboard → zoom + open modal
    function onCardActivate(slide) {
        const sig = slide.getAttribute('data-signature');
        const num = slide.querySelector('.committee__num')?.textContent?.trim();
        if (!sig || !num) return;

        slide.classList.add('is-zooming');
        stage.zoomTo(sig);

        setTimeout(() => {
            if (typeof window.openCommitteeModal === 'function') {
                window.openCommitteeModal(num, slide);
            }
            slide.classList.remove('is-zooming');
        }, 720);
    }

    const slideListeners = [];
    slides.forEach((slide) => {
        const onClick = (e) => {
            if (e.target.closest('a, button')) return;
            onCardActivate(slide);
        };
        const onKeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCardActivate(slide);
            }
        };
        slide.addEventListener('click', onClick);
        slide.addEventListener('keydown', onKeydown);
        slideListeners.push([slide, onClick, onKeydown]);
    });

    const onModalOpened = (e) => {
        const sig = e.detail?.sig;
        if (sig) stage.zoomTo(sig);
        stage.isolate(true);
        modalOpen = true;
        document.body.classList.add('committees-visible');
        if (rafId === null) loop(performance.now());
        // Stop Lenis so modal content can scroll natively
        lenis?.stop();
    };

    const onModalClosed = () => {
        stage.isolate(false);
        stage.zoomOut();
        modalOpen = false;
        if (!inView) document.body.classList.remove('committees-visible');
        lenis?.start();
    };
    window.addEventListener('committee-modal:opened', onModalOpened);
    window.addEventListener('committee-modal:closed', onModalClosed);

    function teardown() {
        if (destroyed) return;
        destroyed = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
        if (lenisRafId !== null) cancelAnimationFrame(lenisRafId);
        lenis?.destroy?.();
        stage.destroy();
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('committee-modal:opened', onModalOpened);
        window.removeEventListener('committee-modal:closed', onModalClosed);
        slideListeners.forEach(([slide, onClick, onKeydown]) => {
            slide.removeEventListener('click', onClick);
            slide.removeEventListener('keydown', onKeydown);
        });
    }

    window.addEventListener('pagehide', teardown, { once: true });
    mobileQuery.addEventListener?.('change', teardown, { once: true });
    motionQuery.addEventListener?.('change', teardown, { once: true });
});
