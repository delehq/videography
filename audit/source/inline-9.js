
    addEventListener('preloader:done', () => {
        const v = document.getElementById('heroVideo');
        if (!v) return;
        v.muted = true;
        v.playsInline = true;
        v.play().catch(() => {
          
        });
    });
