
        (function() {
            'use strict';

            let scriptAnima = '/assets/js/manim.js?100';
            
            const pageInfo = {
                title: 'Thomas Mamfredas | Photography Videography Art of noticing. Videographer, commercial // weddings.',
                hasWorks: false            };

            const scriptsToLoad = [{
                    src: scriptAnima,
                    type: 'module',
                    priority: 'high',
                    condition: true
                },
                {
                    src: '/assets/js/board.js',
                    type: 'text/javascript',
                    priority: 'high',
                    condition: pageInfo.hasWorks
                }
            ];

            let loadedScripts = new Set();

            function loadScript(config) {
                return new Promise((resolve, reject) => {
                    if (loadedScripts.has(config.src)) {
                        resolve();
                        return;
                    }

                    if (config.condition === false) {
                        resolve();
                        return;
                    }

                    const script = document.createElement('script');

                    if (config.type === 'module') {
                        script.type = 'module';
                    }

                    script.src = config.src + '?v=' + Date.now();
                    script.async = true;

                    script.onload = () => {
                        loadedScripts.add(config.src);
                        console.log(`✓ Loaded: ${config.src}`);
                        resolve();
                    };

                    script.onerror = () => {
                        console.error(`✗ Failed: ${config.src}`);
                        reject(new Error(`Failed to load ${config.src}`));
                    };

                    document.body.appendChild(script);
                });
            }
            async function loadAllScripts() {
                if (document.readyState === 'loading') {
                    await new Promise(resolve => {
                        document.addEventListener('DOMContentLoaded', resolve, {
                            once: true
                        });
                    });
                }

                const highPriority = scriptsToLoad.filter(s => s.priority === 'high');
                await Promise.all(highPriority.map(loadScript));

                const mediumPriority = scriptsToLoad.filter(s => s.priority === 'medium');
                await Promise.all(mediumPriority.map(loadScript));

                const lowPriority = scriptsToLoad.filter(s => s.priority === 'low');
                await Promise.all(lowPriority.map(loadScript));


                window.dispatchEvent(new CustomEvent('scriptsLoaded'));
            }

           
            function handlePageShow(event) {
                if (event.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {

                    loadedScripts.clear();

                    document.querySelectorAll('script[src*="/assets/js/"]').forEach(s => {
                        if (!s.src.includes('main.js')) {
                            s.remove();
                        }
                    });

                    setTimeout(() => {
                        loadAllScripts().then(() => {
                            if (window.reinitializeScripts) {
                                window.reinitializeScripts();
                            }
                        });
                    }, 100);
                }
            }

            window.addEventListener('pageshow', handlePageShow);

            loadAllScripts().catch(err => {
                console.error('Error loading scripts:', err);
            });

        })();
    