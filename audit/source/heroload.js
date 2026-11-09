
(function () {
    const heroVideo = document.getElementById('heroVideo');
    if (!heroVideo) return;

    const VIDEO_SOURCES = {
        high: '/assets/videos/Thomas Mainx.mp4',
        poster: '/assets/images/used/opti/1.jpg'
    };

    const videoSrc = VIDEO_SOURCES.high;

    heroVideo.poster = VIDEO_SOURCES.poster;
    heroVideo.removeAttribute('preload');
    heroVideo.preload = 'none';

  function loadVideo() {
        if (heroVideo.dataset.loaded === 'true') return;
        heroVideo.dataset.loaded = 'true';

        const source = heroVideo.querySelector('source');
        const videoSrc = source.getAttribute('data-src-sd');

        if (videoSrc) {
            heroVideo.src = videoSrc;
            heroVideo.load();
        }

        heroVideo.preload = 'metadata';
        heroVideo.load();

        const playWhenReady = () => {
            heroVideo.play().catch(err => {
                console.log('Hero video autoplay prevented:', err.message);
            });
        };

        if (heroVideo.readyState >= 3) {
            playWhenReady();
        } else {
            heroVideo.addEventListener('canplay', playWhenReady, { once: true });
        }

        const startTime = performance.now();
        heroVideo.addEventListener('loadeddata', () => {
            const loadTime = performance.now() - startTime;
            console.log(`✓ Hero video loaded in ${loadTime.toFixed(0)}ms`);
        }, { once: true });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadVideo();
                    observer.disconnect();
                }
            });
        }, {
            rootMargin: '100px'
        });

        observer.observe(heroVideo);
    } else {
        if (document.readyState === 'complete') {
            loadVideo();
        } else {
            window.addEventListener('load', loadVideo, { once: true });
        }
    }


})();