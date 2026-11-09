
(function () {
    const gallerySection = document.querySelector('.gl_images');
    if (!gallerySection) return;

    let galleryInitialized = false;

    function initGallery() {
        if (galleryInitialized) return;
        galleryInitialized = true;


        const videos = gallerySection.querySelectorAll('.js-lazy-video');
        const images = gallerySection.querySelectorAll('img[loading="lazy"]');

        const mediaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;

                if (el.tagName === 'VIDEO' && el.dataset.loaded !== '1') {
                    const src = el.dataset.src;
                    if (src) {
                        el.dataset.loaded = '1';
                        el.src = src;
                        el.preload = 'metadata';
                        el.load();

                        if (el.dataset.autoplay === 'true') {
                            setTimeout(() => {
                                el.play().catch(() => { });
                            }, 100);
                        }
                    }
                    mediaObserver.unobserve(el);
                }

                if (el.tagName === 'IMG') {
                    mediaObserver.unobserve(el);
                }
            });
        }, {
            rootMargin: '300px',
            threshold: 0.01
        });

        videos.forEach(v => mediaObserver.observe(v));
        images.forEach(img => mediaObserver.observe(img));

        const cleanup = () => {
            mediaObserver.disconnect();
            videos.forEach(v => {
                try {
                    v.pause();
                    v.src = '';
                    v.load();
                } catch (e) { }
            });
        };

        if (window.registerCleanup) {
            window.registerCleanup(cleanup);
        }
    }

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initGallery();
                    sectionObserver.disconnect();
                }
            });
        }, {
            rootMargin: '800px',
            threshold: 0
        });

        sectionObserver.observe(gallerySection);
    } else {
        initGallery();
    }

})();