
        document.addEventListener("DOMContentLoaded", function() {
                const toggleBtn = document.getElementById('menuToggle');
                const overlay = document.getElementById('mobileMenuOverlay');

                const closeOverlay = () => {
                        overlay.classList.remove('show');
                        document.body.classList.remove('no-scroll');
                        toggleBtn.classList.remove('flipped');
                        toggleBtn.setAttribute('aria-expanded', 'false');
                };

                const openOverlay = () => {
                        overlay.classList.add('show');
                        document.body.classList.add('no-scroll');
                        toggleBtn.classList.add('flipped');
                        toggleBtn.setAttribute('aria-expanded', 'true');
                };

                toggleBtn.addEventListener('click', () => {
                        const isOpen = overlay.classList.contains('show');
                        isOpen ? closeOverlay() : openOverlay();
                });

                overlay.addEventListener('click', (e) => {
                        if (e.target.closest('a')) closeOverlay();
                });

                document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && overlay.classList.contains('show')) closeOverlay();
                });
        });
