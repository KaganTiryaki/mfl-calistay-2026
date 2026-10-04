function scheduleVisuals() {
    const start = () => {
        import('./three-scene.js').catch((error) => {
            console.error('Dekoratif arka plan sahnesi yüklenemedi:', error);
        });
        import('./carousel.js').catch((error) => {
            console.error('Komite kartları başlatılamadı:', error);
        });
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(start, { timeout: 1500 });
    } else {
        window.setTimeout(start, 200);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleVisuals, { once: true });
} else {
    scheduleVisuals();
}
