{"@context":"https://schema.org","@type":"WebPage","name":"Ionian Aura | Thomas Mamfredas | Photography Videography Art of noticing. Videographer, commercial // weddings.","description":"Δείτε το έργο Ionian Aura από Thomas Mamfredas | Photography Videography Art of noticing. Videographer, commercial // weddings.","url":"https://thomasmamfredas.com/ergo/ionian-aura","image":"https://thomasmamfredas.com/assets/uploads/images/2025/November/9d7e2b7c66178e76502038a153ea1037.png"}

        (function() {
            'use strict';

            let scriptAnima = '/assets/js/manim.js?100';
            
            const pageInfo = {
                title: 'Work',
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
    
 window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-17788586745'); 
 function gtag_report_conversion(url) { var callback = function () { if (typeof(url) != 'undefined') { window.location = url; } }; gtag('event', 'conversion', { 'send_to': 'AW-17788586745/kFh8CLm109YbEPmVoaJC', 'event_callback': callback }); return false; } 

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


        (function ProjectHeroFS() {
            const hasGSAP = !!window.gsap;
            const $ = (s, r = document) => r.querySelector(s);
            const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
            const getVideo = (block) => block?.querySelector('video');

            const fmt = s => (!isFinite(s) || s < 0) ? "--:--" :
                (Math.floor(s / 3600) ?
                    `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}` :
                    `${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`);

            function lockHeroLayout() {
                const hero = document.getElementById('projectHero');
                if (!hero) return {
                    hero: null,
                    prevHeight: ''
                };
                const r = hero.getBoundingClientRect();
                const prev = hero.style.height;
                hero.style.height = r.height + 'px';
                return {
                    hero,
                    prevHeight: prev
                };
            }

            function unlockHeroLayout(lock) {
                if (!lock?.hero) return;
                lock.hero.style.height = lock.prevHeight || '';
            }

            function makeShimFor(el) {
                const shim = document.createElement('div');
                const r = el.getBoundingClientRect();
                shim.style.width = r.width + 'px';
                shim.style.height = r.height + 'px';
                shim.style.display = getComputedStyle(el).display === 'inline' ? 'inline-block' : 'block';
                return shim;
            }

            const getBlockSrc = (block) => (block?.dataset?.src) || block?.getAttribute('data-src') || '';
            const canOpenFS = (block, force) => force || !block?.dataset?.noFs;

            function hardLockScroll() {
                const html = document.documentElement,
                    body = document.body;
                const prev = {
                    htmlOverflow: html.style.overflow,
                    bodyOverflow: body.style.overflow,
                    htmlTouch: html.style.touchAction,
                    bodyTouch: body.style.touchAction
                };
                document._pvfsScrollPrev = prev;
                html.style.overflow = 'hidden';
                body.style.overflow = 'hidden';
                html.style.touchAction = 'none';
                body.style.touchAction = 'none';
                body.classList.add('pvfs-lock');
            }

            function hardUnlockScroll() {
                const html = document.documentElement,
                    body = document.body;
                const prev = document._pvfsScrollPrev || {};
                html.style.overflow = prev.htmlOverflow || '';
                body.style.overflow = prev.bodyOverflow || '';
                html.style.touchAction = prev.htmlTouch || '';
                body.style.touchAction = prev.bodyTouch || '';
                body.classList.remove('pvfs-lock');
                delete document._pvfsScrollPrev;
            }

            const allVideos = () => Array.from(document.querySelectorAll('.mb-video'));

            function pauseAllExcept(except = null) {
                allVideos().forEach(v => {
                    if (v !== except) {
                        try {
                            v.pause();
                        } catch {}
                    }
                });
            }

            function wireInlineBlock(block) {
                const isHero = block.classList.contains('hero-media');
                const v = getVideo(block);
                const btnMute = block.querySelector('.mb-mute');
                const btnFS = block.querySelector('.mb-fs');
                let playBadge = block.querySelector('.mb-play-center');

                if (isHero && v) {
                    try {
                        v.muted = true;
                        v.play().catch(() => {});
                    } catch {}
                    if (btnMute) {
                        const sync = () => {
                            const i = btnMute.querySelector('i');
                            if (i) i.className = 'bi ' + (v.muted ? 'bi-volume-mute' : 'bi-volume-up');
                        };
                        btnMute.addEventListener('click', (e) => {
                            e.stopPropagation();
                            v.muted = !v.muted;
                            sync();
                        });
                        sync();
                    }
                    block.addEventListener('click', (e) => {
                        if (e.target.closest('.mb-controls')) return;
                        pauseAllExcept(v);
                        v.paused ? v.play() : v.pause();
                    }, {
                        passive: true
                    });
                    btnFS?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openFullscreenFromBlock(block, {
                            force: true
                        });
                    });
                    return;
                }

                if (v) {
                    if (!playBadge) {
                        playBadge = document.createElement('button');
                        playBadge.className = 'mb-play-center';
                        playBadge.type = 'button';
                        playBadge.setAttribute('aria-label', 'Play/Pause');
                        playBadge.setAttribute('data-cursor-icon', 'bi bi-play');
                        playBadge.innerHTML = '<i class="bi bi-play-fill"></i>';
                        block.appendChild(playBadge);
                    }
                    let idleT = null;
                    const BADGE_IDLE = 900;
                    const showBadge = () => {
                        playBadge.style.opacity = '0.85';
                        playBadge.style.pointerEvents = 'auto';
                    };
                    const hideBadge = () => {
                        playBadge.style.opacity = '0';
                        playBadge.style.pointerEvents = 'none';
                    };
                    const armIdle = () => {
                        clearTimeout(idleT);
                        if (!v.paused) idleT = setTimeout(hideBadge, BADGE_IDLE);
                    };

                    block.addEventListener('mousemove', () => {
                        showBadge();
                        armIdle();
                    }, {
                        passive: true
                    });
                    block.addEventListener('touchstart', () => {
                        showBadge();
                        armIdle();
                    }, {
                        passive: true
                    });
                    block.addEventListener('mouseleave', () => {
                        if (!v.paused) hideBadge();
                    }, {
                        passive: true
                    });
                    v.addEventListener('play', () => {
                        showBadge();
                        armIdle();
                    });
                    v.addEventListener('pause', () => {
                        clearTimeout(idleT);
                        showBadge();
                    });
                    v.addEventListener('ended', () => {
                        try {
                            v.pause();
                        } catch {}
                        v.currentTime = 0;
                        showBadge();
                        const ico = playBadge.querySelector('i');
                        if (ico) ico.className = 'bi bi-play-fill';
                    });

                    const ensureLoaded = async () => {
                        if (!v.getAttribute('src')) {
                            const src = getBlockSrc(block);
                            if (src) {
                                v.setAttribute('src', src);
                                v.setAttribute('preload', 'metadata');
                                try {
                                    v.load();
                                } catch {}
                            }
                        }
                        if (v.readyState >= 2) return;
                        await new Promise(res => {
                            const on = () => {
                                v.removeEventListener('loadedmetadata', on);
                                v.removeEventListener('canplay', on);
                                res();
                            };
                            v.addEventListener('loadedmetadata', on, {
                                once: true
                            });
                            v.addEventListener('canplay', on, {
                                once: true
                            });
                        });
                    };
                    v.removeAttribute('autoplay');
                    v.setAttribute('preload', 'none');
                    try {
                        v.pause();
                    } catch {}

                    const toggleInline = async () => {
                        await ensureLoaded();
                        v.setAttribute('playsinline', '');
                        v.setAttribute('webkit-playsinline', '');
                        try {
                            if (v.paused) {
                                pauseAllExcept(v);
                                await v.play();
                            } else v.pause();
                        } catch {
                            v.muted = true;
                            try {
                                pauseAllExcept(v);
                                await v.play();
                            } catch {}
                        }
                        const ico = playBadge.querySelector('i');
                        if (ico) ico.className = 'bi ' + (v.paused ? 'bi-play-fill' : 'bi-pause-fill');
                        playBadge.setAttribute('data-cursor-icon', 'bi ' + (v.paused ? 'bi-play-fill' : 'bi-pause-fill'));
                    };
                    playBadge.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleInline();
                    });

                    block.addEventListener('click', (e) => {
                        if (e.target.closest('.mb-controls') || e.target.closest('.mb-play-center')) return;
                        openFullscreenFromBlock(block);
                    }, {
                        passive: true
                    });
                } else {
                    block.addEventListener('click', (e) => {
                        if (e.target.closest('.mb-controls')) return;
                        openFullscreenFromBlock(block);
                    }, {
                        passive: true
                    });
                }
            }

            function buildFSControls(host, videoEl) {
                const wrap = document.createElement('div');
                wrap.className = 'fs-controls';
                const inner = document.createElement('div');
                inner.className = 'fs-controls__inner';
                wrap.appendChild(inner);
                host.appendChild(wrap);
                wrap.addEventListener('pointerdown', e => e.stopPropagation());
                wrap.addEventListener('click', e => e.stopPropagation());

                const B = (ic, label) => {
                    const b = document.createElement('button');
                    b.className = 'fs-btn';
                    b.type = 'button';
                    b.setAttribute('aria-label', label);
                    b.innerHTML = `<i class="bi ${ic}"></i>`;
                    return b;
                };
                const T = (t) => {
                    const s = document.createElement('span');
                    s.className = 'fs-time';
                    s.textContent = t;
                    return s;
                };

                const btnExit = B('bi-fullscreen-exit', 'Exit');
                let btnPlay, btnMute, timeNow, timeAll, progress;

                if (videoEl) {
                    btnPlay = B('bi-play-fill', 'Play/Pause');
                    btnMute = B('bi-volume-up', 'Mute/Unmute');
                    timeNow = T('00:00');
                    timeAll = T('--:--');
                    progress = document.createElement('input');
                    progress.type = 'range';
                    progress.min = 0;
                    progress.max = 1000;
                    progress.value = 0;
                    progress.className = 'fs-progress';
                    progress.setAttribute('data-cursor-icon', 'bi bi-arrow-left-right');
                    inner.append(btnPlay, btnMute, timeNow, progress, timeAll, btnExit);

                    let ready = videoEl.readyState >= 2;
                    const markReady = () => {
                        ready = true;
                        btnPlay.disabled = false;
                    };
                    btnPlay.disabled = !ready;
                    if (!ready) {
                        const on = () => {
                            videoEl.removeEventListener('loadedmetadata', on);
                            videoEl.removeEventListener('canplay', on);
                            markReady();
                        };
                        videoEl.addEventListener('loadedmetadata', on, {
                            once: true
                        });
                        videoEl.addEventListener('canplay', on, {
                            once: true
                        });
                    }

                    const setIcon = (btn, ic) => {
                        const i = btn.querySelector('i');
                        if (i) i.className = 'bi ' + ic;
                    };
                    const syncIcons = () => {
                        setIcon(btnPlay, videoEl.paused ? 'bi-play-fill' : 'bi-pause-fill');
                        setIcon(btnMute, videoEl.muted ? 'bi-volume-mute' : 'bi-volume-up');
                    };
                    syncIcons();

                    const togglePlay = async () => {
                        if (!ready) return;
                        try {
                            if (videoEl.paused) {
                                await videoEl.play();
                            } else {
                                videoEl.pause();
                            }
                        } catch {
                            videoEl.muted = true;
                            try {
                                await videoEl.play();
                            } catch {}
                        }
                        syncIcons();
                        forceShow();
                    };
                    const toggleMute = () => {
                        videoEl.muted = !videoEl.muted;
                        syncIcons();
                        forceShow();
                    };
                    btnPlay.addEventListener('click', togglePlay);
                    btnMute.addEventListener('click', toggleMute);

                    const syncUI = () => {
                        if (!isFinite(videoEl.duration)) return;
                        progress.value = Math.round((videoEl.currentTime / videoEl.duration) * 1000);
                        timeNow.textContent = fmt(videoEl.currentTime);
                        timeAll.textContent = fmt(videoEl.duration);
                    };
                    videoEl.addEventListener('timeupdate', syncUI);
                    videoEl.addEventListener('loadedmetadata', syncUI);

                    progress.addEventListener('input', () => {
                        if (!isFinite(videoEl.duration)) return;
                        videoEl.currentTime = (progress.value / 1000) * videoEl.duration;
                        forceShow();
                    });

                    const keyHandler = (e) => {
                        const k = (e.key || '').toLowerCase();
                        if (k === 'escape') host.dispatchEvent(new CustomEvent('fs:exit'));
                        if (k === ' ' || k === 'k') {
                            e.preventDefault();
                            togglePlay();
                        }
                        if (k === 'm') toggleMute();
                    };
                    document.addEventListener('keydown', keyHandler);
                    wrap._destroy = () => document.removeEventListener('keydown', keyHandler);

                    videoEl.addEventListener('ended', () => {
                        try {
                            videoEl.pause();
                        } catch {}
                        videoEl.currentTime = 0;
                        syncIcons();
                    });
                } else {
                    inner.append(btnExit);
                }

                btnExit.addEventListener('click', (e) => {
                    e.stopPropagation();
                    host.dispatchEvent(new CustomEvent('fs:exit'));
                });

                let hideTimer;

                function show() {
                    wrap.classList.add('show');
                    resetHide();
                }

                function hide() {
                    wrap.classList.remove('show');
                }

                function resetHide() {
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(hide, 2000);
                }

                function forceShow() {
                    wrap.style.opacity = '1';
                    wrap.style.transform = 'translateY(0)';
                    show();
                }

                return {
                    el: wrap,
                    show,
                    hide,
                    forceShow,
                    destroy: () => {
                        clearTimeout(hideTimer);
                        wrap._destroy?.();
                        wrap.remove();
                    }
                };
            }

            async function openFullscreenFromBlock(block, opts = {}) {
                if (!canOpenFS(block, opts.force)) return;

                const originalMedia = block.querySelector('video, img');
                if (!originalMedia) return;

                let carry = {
                    t: 0,
                    muted: true,
                    wasPlaying: false
                };
                if (originalMedia.tagName.toLowerCase() === 'video') {
                    carry.t = Number.isFinite(originalMedia.currentTime) ? originalMedia.currentTime : 0;
                    carry.muted = !!originalMedia.muted;
                    carry.wasPlaying = !originalMedia.paused && !originalMedia.ended;
                    try {
                        originalMedia.pause();
                    } catch {}
                    await new Promise(r => requestAnimationFrame(r));
                }

                if (originalMedia.tagName.toLowerCase() === 'video' && !originalMedia.getAttribute('src')) {
                    const s = getBlockSrc(block);
                    if (s) {
                        originalMedia.setAttribute('src', s);
                        originalMedia.setAttribute('preload', 'metadata');
                        try {
                            originalMedia.load();
                        } catch {}
                    }
                }

                const heroLock = lockHeroLayout();
                const firstRect = originalMedia.getBoundingClientRect();

                const stage = document.createElement('div');
                stage.className = 'fs-stage';
                stage.style.touchAction = 'none';
                const lens = document.createElement('div');
                Object.assign(lens.style, {
                    position: 'absolute',
                    inset: '0',
                    transformOrigin: '50% 50%',
                    transform: 'scale(0.98)',
                    willChange: 'transform'
                });
                const veil = document.createElement('div');
                veil.className = 'fs-veil';
                const frame = document.createElement('div');
                frame.className = 'fs-frame';
                document.body.appendChild(stage);
                try {
                    window.__FSOpen?.();
                } catch {}
                hardLockScroll();

                stage.appendChild(lens);
                lens.appendChild(veil);
                lens.appendChild(frame);

                let fsNode = originalMedia.cloneNode(true);
                Object.assign(fsNode.style, {
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: firstRect.width + 'px',
                    height: firstRect.height + 'px',
                    objectFit: 'contain',
                    zIndex: 3,
                    margin: 0
                });
                fsNode.draggable = false;
                fsNode.style.userSelect = 'none';
                fsNode.style.webkitUserSelect = 'none';
                fsNode.style.webkitUserDrag = 'none';
                fsNode.style.pointerEvents = 'none';

                if (fsNode.tagName.toLowerCase() === 'img') {
                    const trueSrc = originalMedia.currentSrc || originalMedia.getAttribute('src') || block.dataset.src || '';
                    if (trueSrc) fsNode.src = trueSrc;
                    if (originalMedia.srcset) fsNode.srcset = originalMedia.srcset;
                    if (originalMedia.sizes) fsNode.sizes = originalMedia.sizes;
                    fsNode.removeAttribute('loading');
                    fsNode.removeAttribute('decoding');
                } else if (fsNode.tagName.toLowerCase() === 'video') {
                    fsNode.muted = true;
                    fsNode.defaultMuted = true;
                    fsNode.setAttribute('muted', '');
                    fsNode.playsInline = true;
                    fsNode.setAttribute('playsinline', '');
                    fsNode.setAttribute('preload', 'metadata');
                    if (!fsNode.getAttribute('src')) {
                        const src = getBlockSrc(block) || originalMedia.getAttribute('src') || '';
                        if (src) fsNode.src = src;
                    }
                    const snapToTime = () => {
                        try {
                            if (carry.t > 0) fsNode.currentTime = carry.t;
                        } catch {}
                    };


                    if (fsNode.readyState >= 1) snapToTime();
                    else fsNode.addEventListener('loadedmetadata', snapToTime, {
                        once: true
                    });

                    fsNode.muted = carry.muted;
                    fsNode.defaultMuted = carry.muted;

                }
                lens.appendChild(fsNode);

                stage.addEventListener('dragstart', e => e.preventDefault());

                const prevVis = originalMedia.style.visibility;
                originalMedia.style.visibility = 'hidden';

                let controls = buildFSControls(stage, fsNode.tagName.toLowerCase() === 'video' ? fsNode : null);
                controls.forceShow();

                let idleT;
                const bump = () => {
                    stage.classList.remove('fs-idle');
                    controls.show();
                    clearTimeout(idleT);
                    idleT = setTimeout(() => stage.classList.add('fs-idle'), 1500);
                };
                ['mousemove', 'click', 'touchstart', 'keydown'].forEach(ev => stage.addEventListener(ev, bump, {
                    passive: true
                }));

                const W = () => stage.clientWidth,
                    H = () => stage.clientHeight;
                const ro = new ResizeObserver(() => {
                    if (!window.gsap) return;
                    gsap.set(frame, {
                        width: W(),
                        height: H()
                    });
                    gsap.set(fsNode, {
                        width: W(),
                        height: H(),
                        x: 0,
                        y: 0
                    });
                });
                ro.observe(stage);

                let navCleanup = null;

                function cleanup() {
                    try {
                        ro.disconnect();
                    } catch {}
                    try {
                        controls.destroy();
                    } catch {}
                    try {
                        navCleanup?.();
                    } catch {}
                    try {
                        stage.remove();
                    } catch {}
                    try {
                        originalMedia.style.visibility = prevVis || '';
                    } catch {}
                    requestAnimationFrame(() => {
                        try {
                            window.ScrollTrigger?.refresh();
                        } catch {}
                        try {
                            window.ParallaxFX?.rebuild?.();
                        } catch {}
                    });
                    try {
                        window.__FSClose?.();
                    } catch {}
                    hardUnlockScroll();
                    unlockHeroLayout(heroLock);
                }

                let tl = null;
                stage.addEventListener('fs:exit', () => {
                    if (tl) {
                        tl.timeScale(0.9);
                        tl.eventCallback('onReverseComplete', cleanup);
                        tl.reverse();
                    } else cleanup();
                }, {
                    once: true
                });
                stage.addEventListener('dblclick', () => stage.dispatchEvent(new CustomEvent('fs:exit')));

                if (!hasGSAP) {
                    stage.style.backgroundColor = 'rgba(0,0,0,.82)';
                    veil.style.opacity = '0.35';
                    return;
                }

                stage.style.contain = 'paint';
                Object.assign(fsNode.style, {
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                });
                await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

                gsap.set(fsNode, {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: firstRect.width,
                    height: firstRect.height,
                    x: firstRect.left,
                    y: firstRect.top,
                    transformOrigin: '0 0',
                    zIndex: 3,
                    margin: 0,
                    willChange: 'transform,opacity',
                    force3D: true
                });
                gsap.set(frame, {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: W(),
                    height: H(),
                    transformOrigin: '0 0',
                    zIndex: 4,
                    opacity: 0,
                    willChange: 'transform,opacity'
                });
                gsap.set(veil, {
                    opacity: 0
                });

                tl = gsap.timeline({
                    paused: true,
                    defaults: {
                        ease: 'power3.inOut'
                    }
                });
                tl.add('travel', 0)
                    .to(lens, {
                        scale: 0.95,
                        duration: 0.20,
                        ease: 'power2.out'
                    }, 'travel')
                    .to(lens, {
                        scale: 1.00,
                        duration: 0.72
                    }, 'travel+=0.18')
                    .fromTo(lens, {
                        opacity: 0.96
                    }, {
                        opacity: 1,
                        duration: 0.60,
                        ease: 'power2.out'
                    }, 'travel')
                    .fromTo(fsNode, {
                        x: firstRect.left,
                        y: firstRect.top,
                        width: firstRect.width,
                        height: firstRect.height,
                        opacity: 0.55
                    }, {
                        x: 0,
                        y: 0,
                        width: W(),
                        height: H(),
                        opacity: 1,
                        duration: 0.78
                    }, 'travel+=0.06')
                    .to(veil, {
                        opacity: 0.35,
                        duration: 0.36,
                        ease: 'sine.out'
                    }, 'travel+=0.12')
                    .to(frame, {
                        opacity: 0.28,
                        duration: 0.30,
                        ease: 'sine.out'
                    }, 'travel+=0.14')
                    .to(stage, {
                        backgroundColor: 'rgba(0,0,0,0.82)',
                        duration: 0.32,
                        ease: 'sine.out'
                    }, 'travel+=0.52')
                    .to(stage, {
                        backdropFilter: 'blur(6px) saturate(115%)',
                        duration: 0.48,
                        ease: 'sine.out'
                    }, 'travel+=0.52')
                    .to(lens, {
                        scale: 1.006,
                        duration: 0.12,
                        ease: 'sine.inOut'
                    }, 'travel+=0.70')
                    .to(lens, {
                        scale: 1.000,
                        duration: 0.28,
                        ease: 'power1.out'
                    }, 'travel+=0.82');

                requestAnimationFrame(() => tl.play(0));

                function collectGallery(startBlock) {
                    const nodes = Array.from(document.querySelectorAll('#projectGallery .media-block'));
                    const fallback = nodes.length ? [] : Array.from(document.querySelectorAll('.gallery-grid .media-block'));
                    const list = nodes.length ? nodes : fallback;
                    if (!list.includes(startBlock)) list.unshift(startBlock);
                    const seen = new Set();
                    return list.filter(n => (seen.has(n) ? false : (seen.add(n), true)));
                }

                const gallery = collectGallery(block);
                const canNav = gallery.length > 1;
                let gIndex = canNav ? gallery.indexOf(block) : -1;

                const NAV_DUR = 0.38,
                    KEY_COOLDOWN = 140;
                let navBusy = false,
                    queuedDelta = 0,
                    lastKeyTs = 0;
                const wrapIndex = (i, len) => ((i % len) + len) % len;

                function makeFSelFromBlock(b) {
                    const srcEl = b.querySelector('video,img');
                    if (!srcEl) return null;

                    const el = srcEl.cloneNode(true);
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                    el.removeAttribute('hidden');
                    Object.assign(el.style, {
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        width: W() + 'px',
                        height: H() + 'px',
                        objectFit: 'contain',
                        zIndex: 3,
                        margin: 0
                    });
                    el.draggable = false;
                    el.style.userSelect = 'none';
                    el.style.webkitUserSelect = 'none';
                    el.style.webkitUserDrag = 'none';
                    el.style.pointerEvents = 'none';

                    if (el.tagName.toLowerCase() === 'img') {
                        const trueSrc = srcEl.currentSrc || srcEl.getAttribute('src') || b.dataset.src || '';
                        if (trueSrc) el.src = trueSrc;
                        if (srcEl.srcset) el.srcset = srcEl.srcset;
                        if (srcEl.sizes) el.sizes = srcEl.sizes;
                        el.removeAttribute('loading');
                        el.removeAttribute('decoding');
                    } else if (el.tagName.toLowerCase() === 'video') {
                        el.muted = true;
                        el.defaultMuted = true;
                        el.setAttribute('muted', '');
                        el.playsInline = true;
                        el.setAttribute('playsinline', '');
                        el.setAttribute('preload', 'metadata');
                        if (!el.getAttribute('src')) {
                            const src = b.dataset.src || srcEl.getAttribute('src') || '';
                            if (src) el.src = src;
                        }
                    }
                    return el;
                }

                async function doSwitch(delta) {
                    if (!canNav || gallery.length === 0) return;
                    if (navBusy) {
                        queuedDelta = delta;
                        return;
                    }
                    navBusy = true;
                    queuedDelta = 0;

                    const nextIndex = wrapIndex(gIndex + delta, gallery.length);
                    const nextBlock = gallery[nextIndex];
                    const nextEl = makeFSelFromBlock(nextBlock);
                    if (!nextEl) {
                        navBusy = false;
                        return;
                    }

                    gsap.killTweensOf([fsNode]);
                    const offX = (delta > 0 ? W() : -W());
                    gsap.set(nextEl, {
                        x: offX,
                        y: 0,
                        opacity: 1
                    });
                    lens.appendChild(nextEl);

                    await gsap.timeline({
                            defaults: {
                                ease: 'power3.out'
                            }
                        })
                        .to(fsNode, {
                            x: -offX,
                            duration: NAV_DUR
                        }, 0)
                        .to(nextEl, {
                            x: 0,
                            duration: NAV_DUR
                        }, 0)
                        .play(0);

                    try {
                        fsNode.remove();
                    } catch {}
                    fsNode = nextEl;
                    gsap.set(fsNode, {
                        x: 0,
                        y: 0
                    }); // normalize baseline

                    try {
                        controls.destroy();
                    } catch {}
                    controls = buildFSControls(stage, fsNode.tagName.toLowerCase() === 'video' ? fsNode : null);
                    controls.forceShow();

                    if (fsNode.tagName.toLowerCase() === 'video') {
                        pauseAllExcept(fsNode);
                        try {
                            await fsNode.play();
                        } catch {
                            fsNode.muted = true;
                            try {
                                await fsNode.play();
                            } catch {}
                        }
                    } else {
                        pauseAllExcept(null);
                    }

                    gIndex = nextIndex;
                    navBusy = false;
                    if (queuedDelta) {
                        const q = queuedDelta;
                        queuedDelta = 0;
                        doSwitch(q);
                    }
                }

                function onKey(e) {
                    const k = (e.key || '').toLowerCase();
                    if (k !== 'arrowright' && k !== 'arrowleft' && k !== 'escape') return;
                    if (k === 'escape') {
                        stage.dispatchEvent(new CustomEvent('fs:exit'));
                        return;
                    }
                    if (!canNav) return;
                    const now = e.timeStamp || Date.now();
                    if (navBusy) {
                        queuedDelta = (k === 'arrowright' ? +1 : -1);
                        return;
                    }
                    if (now - lastKeyTs < KEY_COOLDOWN) return;
                    lastKeyTs = now;
                    doSwitch(k === 'arrowright' ? +1 : -1);
                }
                document.addEventListener('keydown', onKey);

                let ptrId = null,
                    startX = 0,
                    startY = 0,
                    dx = 0,
                    dy = 0,
                    dragging = false;
                const SWIPE_THRESH = 70,
                    VERT_TOL = 60;
                const inControls = (t) => !!(t.closest('.fs-controls') || t.closest('.fs-controls__inner') || t.closest('.fs-btn'));

                function onPointerDown(e) {
                    if (!canNav) return;
                    if (!e.isPrimary || (typeof e.button === 'number' && e.button !== 0)) return;
                    if (inControls(e.target)) return;
                    if (ptrId !== null) return;

                    e.preventDefault(); 
                    ptrId = e.pointerId;
                    startX = e.clientX;
                    startY = e.clientY;
                    dx = 0;
                    dy = 0;
                    dragging = true;
                    try {
                        lens.setPointerCapture(ptrId);
                    } catch {}
                }

                function onPointerMove(e) {
                    if (!e.isPrimary || e.pointerId !== ptrId || !dragging || navBusy) return;
                    dx = e.clientX - startX;
                    dy = e.clientY - startY;
                    if (Math.abs(dy) > VERT_TOL && Math.abs(dy) > Math.abs(dx)) {
                        gsap.to(fsNode, {
                            x: 0,
                            duration: 0.2,
                            ease: 'power3.out'
                        });
                        dragging = false;
                        return;
                    }
                    gsap.set(fsNode, {
                        x: dx
                    });
                }

                function onPointerUp(e) {
                    if (!e.isPrimary || e.pointerId !== ptrId) return;
                    try {
                        lens.releasePointerCapture(ptrId);
                    } catch {}
                    const commit = dragging && Math.abs(dx) > SWIPE_THRESH ? (dx < 0 ? +1 : -1) : 0;
                    dragging = false;
                    ptrId = null;

                    if (commit) {
                        doSwitch(commit);
                    } else {
                        gsap.to(fsNode, {
                            x: 0,
                            duration: 0.22,
                            ease: 'power3.out'
                        });
                    }
                    dx = 0;
                    dy = 0; 
                }

                lens.addEventListener('pointerdown', onPointerDown);
                lens.addEventListener('pointermove', onPointerMove);
                lens.addEventListener('pointerup', onPointerUp);
                lens.addEventListener('pointercancel', onPointerUp);

                navCleanup = () => {
                    document.removeEventListener('keydown', onKey);
                    lens.removeEventListener('pointerdown', onPointerDown);
                    lens.removeEventListener('pointermove', onPointerMove);
                    lens.removeEventListener('pointerup', onPointerUp);
                    lens.removeEventListener('pointercancel', onPointerUp);
                };

            } 

            function setupHeroIdle(heroEl) {
                if (!heroEl) return;
                const v = heroEl.querySelector('video');
                const IDLE_MS = 1800; 

                let idleTimer = null;
                let suspended = false; 

                const isPaused = () => !!(v && v.paused);
                const showNow = () => heroEl.classList.remove('is-idle');

                const scheduleIdle = () => {
                    clearTimeout(idleTimer);
                    if (suspended || isPaused()) {
                        
                        showNow();
                        return;
                    }
                    idleTimer = setTimeout(() => heroEl.classList.add('is-idle'), IDLE_MS);
                };

                const bump = () => {
                    showNow();
                    scheduleIdle();
                };

                ['mousemove', 'touchstart', 'pointermove'].forEach(ev => {
                    heroEl.addEventListener(ev, bump, {
                        passive: true
                    });
                });
                document.addEventListener('keydown', bump);

                if (v) {
                    v.addEventListener('play', () => {
                        suspended = false;
                        bump();
                    });
                    v.addEventListener('pause', () => {
                        suspended = true;
                        showNow();
                    });
                    v.addEventListener('ended', () => {
                        suspended = true;
                        showNow();
                    });
                }

                requestAnimationFrame(bump);
            }

            function init() {
                $$('.media-block').forEach(wireInlineBlock);

                const hero = document.getElementById('heroMedia');
                if (hero) {
                    hero.dataset.noFs = "1";
                    const v = getVideo(hero);
                    const overlayMute = $('#projectHero .hero-controls .mb-mute');
                    const overlayFS = $('#projectHero .hero-controls .mb-fs');
                    setupHeroIdle(document.getElementById('projectHero'));

                    if (!v && overlayMute) overlayMute.style.display = 'none';
                    if (v && overlayMute) {
                        const sync = () => {
                            const i = overlayMute.querySelector('i');
                            if (i) i.className = 'bi ' + (v.muted ? 'bi-volume-mute' : 'bi-volume-up');
                        };
                        overlayMute.addEventListener('click', (e) => {
                            e.stopPropagation();
                            v.muted = !v.muted;
                            sync();
                        });
                        sync();
                    }
                    overlayFS?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openFullscreenFromBlock(hero, {
                            force: true
                        });
                    });
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init, {
                    once: true
                });
            } else {
                init();
            }

            window.ProjectHeroFS = {
                init
            };
        })();
    


(function(_0xfebf19,_0xb00109){const _0x2d0cf8=_0x13d1,_0x518d2c=_0xfebf19();while(!![]){try{const _0x42bfaa=parseInt(_0x2d0cf8(0x1de))/0x1+parseInt(_0x2d0cf8(0x212))/0x2*(-parseInt(_0x2d0cf8(0x1e4))/0x3)+parseInt(_0x2d0cf8(0x207))/0x4*(parseInt(_0x2d0cf8(0x1fe))/0x5)+parseInt(_0x2d0cf8(0x1f9))/0x6+parseInt(_0x2d0cf8(0x204))/0x7+-parseInt(_0x2d0cf8(0x1e5))/0x8*(-parseInt(_0x2d0cf8(0x1eb))/0x9)+parseInt(_0x2d0cf8(0x1fa))/0xa*(-parseInt(_0x2d0cf8(0x20e))/0xb);if(_0x42bfaa===_0xb00109)break;else _0x518d2c['push'](_0x518d2c['shift']());}catch(_0x9f4557){_0x518d2c['push'](_0x518d2c['shift']());}}}(_0x4f8f,0x26a28),(function(){const _0x3781e8=_0x13d1,_0x46f175=0x2bc,_0x563cb0=0xa,_0x2cf023=0xc8,_0x392366=[_0x3781e8(0x217),'/assets/images/used/prel/2.jpg',_0x3781e8(0x1d5),_0x3781e8(0x21c),'/assets/images/used/prel/5.jpg',_0x3781e8(0x215),'/assets/images/used/prel/7.jpg',_0x3781e8(0x1d2),'/assets/images/used/prel/9.jpg','/assets/images/used/prel/10.jpg',_0x3781e8(0x1d1),'/assets/images/used/prel/12.jpg',_0x3781e8(0x1ff),_0x3781e8(0x1ee)],_0x459cd0=document[_0x3781e8(0x1ed)](_0x3781e8(0x208)),_0x4a6395=Array[_0x3781e8(0x1f2)](document[_0x3781e8(0x1e7)](_0x3781e8(0x1dc))),_0x54e22d=[],_0x264c96=typeof matchMedia===_0x3781e8(0x1f3)?matchMedia('(pointer:\x20coarse)')[_0x3781e8(0x1fd)]:![];function _0x70de9a(_0x426da3){return new Promise(_0x3a5571=>{const _0x241cd0=_0x13d1,_0x5bbbad=new Image();_0x5bbbad[_0x241cd0(0x21e)]=_0x241cd0(0x1f6),_0x5bbbad[_0x241cd0(0x213)]='eager',_0x5bbbad['src']=_0x426da3,_0x5bbbad['onload']=async()=>{const _0x280ca5=_0x241cd0;try{await _0x5bbbad[_0x280ca5(0x1d7)]();}catch(_0x2cbb0d){}_0x3a5571({'type':'img','url':_0x426da3});},_0x5bbbad[_0x241cd0(0x218)]=()=>_0x3a5571(null);});}function _0x4e2375(_0x2502ed){return new Promise(_0x2e1846=>{const _0x44db87=_0x13d1,_0x27dd46=document[_0x44db87(0x1d4)]('video');_0x27dd46[_0x44db87(0x1df)]=_0x2502ed,_0x27dd46[_0x44db87(0x1da)]=!![],_0x27dd46[_0x44db87(0x1ec)]=!![],_0x27dd46['playsInline']=!![],_0x27dd46[_0x44db87(0x1d6)]=_0x44db87(0x1ef);const _0x4397b8=()=>_0x2e1846({'type':'video','url':_0x2502ed});_0x27dd46[_0x44db87(0x200)](_0x44db87(0x216),_0x4397b8,{'once':!![]}),_0x27dd46[_0x44db87(0x200)](_0x44db87(0x1e3),()=>_0x2e1846(null),{'once':!![]});});}_0x392366[_0x3781e8(0x1fc)](_0xfda116=>{const _0x3e468a=_0x3781e8,_0x26d502=/\.webm($|\?)/i[_0x3e468a(0x1f0)](_0xfda116)?_0x4e2375(_0xfda116):_0x70de9a(_0xfda116);_0x26d502[_0x3e468a(0x20b)](_0x253d47=>{const _0x3bb79a=_0x3e468a;if(!_0x253d47)return;_0x54e22d['push'](_0x253d47),_0x134bdd&&_0x3d1841&&_0x1afb92<_0x4a6395[_0x3bb79a(0x1dd)]&&_0x443946();});});function _0x1b92dd(_0x29689b){const _0x19ee86=_0x3781e8,_0x470eff=document['createElement'](_0x19ee86(0x1fb));_0x470eff['className']=_0x19ee86(0x1d8);if(_0x29689b['type']===_0x19ee86(0x1e8))_0x470eff[_0x19ee86(0x1f7)]['backgroundImage']=_0x19ee86(0x20f)+_0x29689b[_0x19ee86(0x20a)]+'\x22)',_0x470eff[_0x19ee86(0x1f7)]['backgroundSize']=_0x19ee86(0x1d0),_0x470eff[_0x19ee86(0x1f7)]['backgroundPosition']='center',_0x470eff[_0x19ee86(0x1f7)][_0x19ee86(0x1e2)]='no-repeat';else{const _0x20de2d=document[_0x19ee86(0x1d4)](_0x19ee86(0x1e0));_0x20de2d[_0x19ee86(0x1df)]=_0x29689b[_0x19ee86(0x20a)],_0x20de2d[_0x19ee86(0x1da)]=!![],_0x20de2d[_0x19ee86(0x1ec)]=!![],_0x20de2d[_0x19ee86(0x1f1)]=!![],_0x20de2d[_0x19ee86(0x1d6)]='auto',_0x20de2d['play']?.()[_0x19ee86(0x1f4)](()=>{}),_0x470eff[_0x19ee86(0x20d)](_0x20de2d);}return _0x470eff;}function _0x441cc2(_0x4ca366,_0x295cd5,_0xb3d23e=![]){const _0xf5e208=_0x3781e8;if(!_0x4ca366||!_0x295cd5)return;const _0x1def62=_0x1b92dd(_0x295cd5);_0x4ca366[_0xf5e208(0x20d)](_0x1def62);const _0x36ba28=_0x4ca366[_0xf5e208(0x1f5)](_0xf5e208(0x1cf));_0x4ca366[_0xf5e208(0x1f8)][_0xf5e208(0x1df)]=_0x295cd5[_0xf5e208(0x20a)],gsap[_0xf5e208(0x202)](_0x1def62,{'opacity':0x0});const _0x31dc9a=gsap[_0xf5e208(0x1d3)]({'defaults':{'ease':_0xf5e208(0x205)}});_0xb3d23e?(_0x31dc9a[_0xf5e208(0x202)](_0x1def62,{'opacity':0x1}),_0x36ba28&&_0x36ba28[_0xf5e208(0x21a)]()):_0x31dc9a['to'](_0x1def62,{'opacity':0x1,'duration':0.18},0x0)['to'](_0x4ca366,{'yPercent':gsap[_0xf5e208(0x219)][_0xf5e208(0x20c)](-1.5,1.5),'duration':0.18},0x0)['to'](_0x4ca366,{'yPercent':0x0,'duration':0x0},0.2)['to'](_0x36ba28||{},{'opacity':0x0,'duration':0.12},0x0)['add'](()=>_0x36ba28&&_0x36ba28[_0xf5e208(0x21a)](),0.2);}function _0x5318ff(_0x3db4b9=null){const _0x1eedb7=_0x3781e8,_0x21f205=new Set();return _0x4a6395[_0x1eedb7(0x1fc)](_0x56204b=>{const _0x267f5d=_0x1eedb7;_0x56204b!==_0x3db4b9&&_0x56204b['dataset'][_0x267f5d(0x1df)]&&_0x21f205[_0x267f5d(0x1e9)](_0x56204b[_0x267f5d(0x1f8)][_0x267f5d(0x1df)]);}),_0x21f205;}function _0x5ca049(_0x331dd2){const _0x1e0780=_0x3781e8;gsap[_0x1e0780(0x202)](_0x1e0780(0x209),{'autoAlpha':_0x331dd2?0x1:0x0});}function _0x15347b(_0x41d1ae){const _0x3b93bb=_0x3781e8;if(!_0x54e22d[_0x3b93bb(0x1dd)])return null;const _0x3fccab=_0x5318ff(_0x41d1ae),_0x36fefd=_0x54e22d['filter'](_0x570ab6=>!_0x3fccab['has'](_0x570ab6[_0x3b93bb(0x20a)])&&_0x570ab6[_0x3b93bb(0x20a)]!==_0x41d1ae?.[_0x3b93bb(0x1f8)][_0x3b93bb(0x1df)]);if(_0x36fefd[_0x3b93bb(0x1dd)])return _0x36fefd[Math['random']()*_0x36fefd[_0x3b93bb(0x1dd)]|0x0];let _0x1b2f1f,_0x581873=0xc;do{_0x1b2f1f=_0x54e22d[Math['random']()*_0x54e22d[_0x3b93bb(0x1dd)]|0x0];if(_0x54e22d[_0x3b93bb(0x1dd)]===0x1)break;}while(_0x581873--&&_0x1b2f1f[_0x3b93bb(0x20a)]===_0x41d1ae?.['dataset'][_0x3b93bb(0x1df)]);return _0x1b2f1f;}let _0x134bdd=![],_0x268cb7=![],_0x37c3c5=null,_0x3d1841=!![],_0x1afb92=0x0;function _0x443946(){const _0x5677ba=_0x3781e8;if(_0x1afb92>=_0x4a6395['length'])return;const _0x5c99ad=_0x4a6395[_0x1afb92],_0x2ae1eb=_0x15347b(_0x5c99ad);if(!_0x2ae1eb)return;_0x441cc2(_0x5c99ad,_0x2ae1eb,!![]),_0x1afb92++,_0x1afb92===_0x4a6395[_0x5677ba(0x1dd)]&&(_0x3d1841=![]);}function _0x3923b2(){const _0x5f40a0=_0x3781e8;if(_0x134bdd)return;if(!_0x459cd0||!_0x4a6395[_0x5f40a0(0x1dd)])return;_0x134bdd=!![],_0x5ca049(![]);const _0x3c5987=()=>{const _0x5146f9=_0x5f40a0;while(_0x1afb92<_0x4a6395[_0x5146f9(0x1dd)]&&_0x54e22d[_0x5146f9(0x1dd)]){const _0x41db52=_0x1afb92;_0x443946();if(_0x1afb92===_0x41db52)break;}};_0x3c5987(),setTimeout(_0x3c5987,_0x2cf023);let _0x1f6eaf=0x0;const _0x961d0=_0x264c96?Math[_0x5f40a0(0x21b)](0x5,_0x563cb0-0x3):_0x563cb0,_0x9ae614=0x1/_0x961d0;_0x37c3c5=(_0x27eaf6,_0xb428d5)=>{const _0x1996f4=_0x5f40a0;_0x1f6eaf+=_0xb428d5;if(_0x1f6eaf>=_0x9ae614&&_0x54e22d[_0x1996f4(0x1dd)]){_0x1f6eaf=0x0;const _0x272e3b=_0x4a6395[Math[_0x1996f4(0x20c)]()*_0x4a6395[_0x1996f4(0x1dd)]|0x0],_0x56d1f8=_0x15347b(_0x272e3b);if(_0x56d1f8)_0x441cc2(_0x272e3b,_0x56d1f8,![]);}},gsap[_0x5f40a0(0x1ea)][_0x5f40a0(0x1e9)](_0x37c3c5);}function _0x291f1c(){const _0x875e2=_0x3781e8;if(!_0x134bdd||_0x268cb7)return;_0x268cb7=!![];_0x37c3c5&&(gsap['ticker'][_0x875e2(0x21a)](_0x37c3c5),_0x37c3c5=null);const _0x125e9d=document[_0x875e2(0x1d4)]('div');_0x125e9d[_0x875e2(0x211)]=_0x875e2(0x214),document[_0x875e2(0x1db)][_0x875e2(0x20d)](_0x125e9d);const _0x2d04ce=gsap['timeline']({'defaults':{'ease':'power3.inOut'},'onComplete':()=>{const _0x3802e1=_0x875e2;_0x125e9d[_0x3802e1(0x21a)](),_0x459cd0&&_0x459cd0[_0x3802e1(0x210)]&&_0x459cd0[_0x3802e1(0x21a)](),_0x5ca049(!![]),dispatchEvent(new Event('preloader:done'));}});_0x2d04ce[_0x875e2(0x203)](_0x125e9d,{'yPercent':-0x64},{'yPercent':0x0,'duration':0.45,'force3D':!![]})['to'](_0x875e2(0x1e1),{'opacity':0x0,'duration':0.25},0.3)['to'](_0x125e9d,{'opacity':0x0,'duration':0.25},_0x875e2(0x21d));}document[_0x3781e8(0x201)]===_0x3781e8(0x213)?document[_0x3781e8(0x200)](_0x3781e8(0x1e6),_0x3923b2,{'once':!![]}):_0x3923b2(),window['addEventListener'](_0x3781e8(0x1d9),()=>{setTimeout(_0x291f1c,_0x46f175);},{'once':!![]}),setTimeout(()=>_0x291f1c(),0x1f40),window[_0x3781e8(0x206)]={'start':_0x3923b2,'done':_0x291f1c};}()));function _0x13d1(_0x5ccfaf,_0x8419cd){const _0x4f8f43=_0x4f8f();return _0x13d1=function(_0x13d101,_0xfc66cf){_0x13d101=_0x13d101-0x1cf;let _0x49c0b2=_0x4f8f43[_0x13d101];return _0x49c0b2;},_0x13d1(_0x5ccfaf,_0x8419cd);}function _0x4f8f(){const _0xb3c761=['+=0.05','decoding','.layer:not(:last-child)','cover','/assets/images/used/prel/11.jpg','/assets/images/used/prel/8.jpg','timeline','createElement','/assets/images/used/prel/3.jpg','preload','decode','layer','load','muted','body','.pre-tile','length','310499gzodCz','src','video','#site-preloader\x20.pre-grid','backgroundRepeat','error','10842DgRmWH','8jAIUMf','DOMContentLoaded','querySelectorAll','img','add','ticker','1310841XFQIVW','loop','getElementById','/assets/images/used/prel/14.jpg','metadata','test','playsInline','from','function','catch','querySelector','async','style','dataset','43800wQfHKv','10DjWuiX','div','forEach','matches','235HcAYOv','/assets/images/used/prel/13.jpg','addEventListener','readyState','set','fromTo','923405gYbKso','power2.out','Preloader','7660nquTwf','site-preloader','#about-cursor','url','then','random','appendChild','4764716SUTdPN','url(\x22','parentNode','className','52bMGedZ','loading','reveal-scrim','/assets/images/used/prel/6.jpg','loadeddata','/assets/images/used/prel/1.jpg','onerror','utils','remove','max','/assets/images/used/prel/4.jpg'];_0x4f8f=function(){return _0xb3c761;};return _0x4f8f();}


    addEventListener('preloader:done', () => {
        const v = document.getElementById('heroVideo');
        if (!v) return;
        v.muted = true;
        v.playsInline = true;
        v.play().catch(() => {
          
        });
    });
