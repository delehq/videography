document.addEventListener('DOMContentLoaded', () => {
    if (!window.gsap) return;

    const CAN_SHOW_CURSOR =
        window.matchMedia('(any-hover: hover)').matches &&
        window.matchMedia('(any-pointer: fine)').matches;

    let cursor = null, ring = null, tail = null, dot = null, goo = null,
        label = null, burst = null, touchBurst = null;

    if (!CAN_SHOW_CURSOR) {
        const ac = document.getElementById('about-cursor');
        if (ac) ac.remove();

        const gooSvg = document.querySelector('svg > defs #goo')?.closest('svg');
        if (gooSvg) gooSvg.style.display = 'none';

        const style = document.createElement('style');
        style.id = 'hide-mobile-cursor-css';
        style.textContent = `
          @media (any-pointer: coarse), (hover: none) {
            #about-cursor { display: none !important; }
            html, body, a, button { cursor: auto !important; }
          }
        `;
        document.head.appendChild(style);

        touchBurst = document.createElement('span');
        touchBurst.className = 'c-burst c-burst--touch';
        Object.assign(touchBurst.style, {
            position: 'fixed',
            left: '0',
            top: '0',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0.6)',
            background: 'conic-gradient(from 0deg,#ff6a00,#ffd500,#00d084,#00aaff,#a100ff,#ff6a00)',
            mixBlendMode: 'screen',
            filter: 'grayscale(1) blur(1px)',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '9999'
        });
        document.body.appendChild(touchBurst);
    }

    // ———————————————————————————————————————————
    // Inject CSS (colorize overlay + cursor palette + difference overlay)
    // ———————————————————————————————————————————
    if (!document.getElementById('colorize-hold-css')) {
        const css = `
          video.video-colorized { filter: none !important; }
          video.video-colorizing { filter: none !important; }

          .colorize-overlay{
            position:absolute; inset:0; pointer-events:none; z-index:5;
            backdrop-filter: grayscale(1); -webkit-backdrop-filter: grayscale(1);
            --cx:50%; --cy:50%; --r:0px;
            -webkit-mask-image: radial-gradient(circle var(--r) at var(--cx) var(--cy),
                                rgba(0,0,0,0) 0%, rgba(0,0,0,0) 99.9%, rgba(255,255,255,1) 100%);
            mask-image: radial-gradient(circle var(--r) at var(--cx) var(--cy),
                                rgba(0,0,0,0) 0%, rgba(0,0,0,0) 99.9%, rgba(255,255,255,1) 100%);
          }

          #about-cursor .c-label.colorize[data-color="off"] i{
            background: conic-gradient(from 0deg,#ff6a00,#ffd500,#00d084,#00aaff,#a100ff,#ff6a00);
            -webkit-background-clip:text; background-clip:text;
            color:transparent; -webkit-text-fill-color:transparent;
          }

          #about-cursor .c-label i{ color:#fff; }
        `;
        const style = document.createElement('style');
        style.id = 'colorize-hold-css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    if (!document.getElementById('cursor-difference-css')) {
        const css = `
          .difference-overlay{
            position:absolute; inset:0; pointer-events:none; z-index:6;
            background:#fff; mix-blend-mode:difference;
            --cx:50%; --cy:50%; --r:24px;
            -webkit-mask-image: radial-gradient(circle var(--r) at var(--cx) var(--cy),
                                 rgba(255,255,255,1) 0%, rgba(255,255,255,1) 99.9%, rgba(255,255,255,0) 120%);
            mask-image: radial-gradient(circle var(--r) at var(--cx) var(--cy),
                                 rgba(255,255,255,1) 0%, rgba(255,255,255,1) 99.9%, rgba(255,255,255,0) 120%);
          }
        `;
        const style = document.createElement('style');
        style.id = 'cursor-difference-css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ———————————————————————————————————————————
    // Cursor wiring — only if we can show it
    // ———————————————————————————————————————————
    if (CAN_SHOW_CURSOR) {
        const cursorEls = document.querySelectorAll('#about-cursor');
        cursor = cursorEls.length ? cursorEls[cursorEls.length - 1] : null;

        if (cursor) {
            ring = cursor.querySelector('.c-ring');
            tail = cursor.querySelector('.c-tail');
            dot = cursor.querySelector('.c-dot');
            goo = cursor.querySelector('.goo-wrap');
            label = cursor.querySelector('.c-label') ||
                Object.assign(document.createElement('span'), { className: 'c-label' });
            if (!cursor.querySelector('.c-label')) cursor.appendChild(label);

            burst = cursor.querySelector('.c-burst');
            if (!burst) {
                burst = document.createElement('span');
                burst.className = 'c-burst';
                Object.assign(burst.style, {
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%) scale(0.6)',
                    background: 'conic-gradient(from 0deg,#ff6a00,#ffd500,#00d084,#00aaff,#a100ff,#ff6a00)',
                    mixBlendMode: 'screen',
                    filter: 'grayscale(1) blur(1px)',
                    opacity: '0',
                    pointerEvents: 'none',
                    zIndex: '0'
                });
                cursor.insertBefore(burst, ring || cursor.firstChild);
            }

            if (!ring || !tail || !dot || !goo) {
                cursor = null; 
            } else {
                gsap.set(cursor, { opacity: 0 });
            }
        }
    }

    let downX = 0, downY = 0;
    let holdingPointerType = null;

    const MOVE_CANCEL_DISTANCE = 14; 

    // ———————————————————————————————————————————
    // Helpers / Finders
    // ———————————————————————————————————————————
    const isInArea = (x, y) => {
        const el = document.elementFromPoint(x, y);
        return el ? el.closest('.cursor-area') : null;
    };
    const findColorizeEl = (x, y) => {
        const el = document.elementFromPoint(x, y);
        return el ? el.closest('[data-colorize]') : null;
    };
    const findDifferenceEl = (x, y) => {
        const el = document.elementFromPoint(x, y);
        return el ? el.closest('[data-difference]') : null;
    };
    const findLabelIconEl = (x, y) => {
        const el = document.elementFromPoint(x, y);
        return el ? el.closest('[data-cursor-label],[data-cursor-icon],[data-colorize]') : null;
    };

    function getColorizeTarget(node) {
        if (!node) return null;
        const sel = node.getAttribute('data-color-target');
        if (sel) {
            const rel = node.querySelector(sel);
            if (rel) return rel;
            const abs = document.querySelector(sel);
            if (abs) return abs;
        }
        return node.querySelector('video') ||
            node.closest('figure,.media,.cursor-area')?.querySelector('video') || null;
    }

    function isTargetGrayscale(video) {
        if (!video) return true;
        if (video.classList.contains('video-colorized')) return false;
        const style = getComputedStyle(video);
        return (style.filter || '').includes('grayscale');
    }

    // ———————————————————————————————————————————
    // Label rendering (no-op on touch)
    // ———————————————————————————————————————————
    let labelShown = false;
    const showLabel = (text) => {
        if (!cursor || !label) return;
        if (text) label.textContent = text;
        if (labelShown) return;
        labelShown = true;
        gsap.to(label, { opacity: 1, duration: 0.16, ease: 'power2.out' });
    };
    const hideLabel = () => {
        if (!cursor || !label) return;
        if (!labelShown) return;
        labelShown = false;
        gsap.to(label, { opacity: 0, duration: 0.14, ease: 'power2.out' });
    };

    function renderCursorLabel({ text = null, icon = null, colorizeState = null }) {
        if (!cursor || !label) return;
        if (colorizeState) {
            const isOn = (colorizeState === 'on');
            const paletteIcon = isOn ? 'bi-palette-fill' : 'bi-palette';
            label.className = 'c-label colorize js-colorize-btn';
            label.setAttribute('data-color', isOn ? 'on' : 'off');
            label.setAttribute('title', isOn ? 'Remove Color' : 'Enable Color');
            label.innerHTML = `<i class="${paletteIcon}"></i>${text ? ` <span class="c-label-text">${text}</span>` : ''}`;
            showLabel();
            return;
        }
        let html = '';
        if (icon) html += `<i class="${icon}"></i>`;
        if (text) html += (icon ? ' ' : '') + `<span class="c-label-text">${text}</span>`;
        if (html) {
            label.className = 'c-label';
            label.removeAttribute('data-color');
            label.removeAttribute('title');
            label.innerHTML = html;
            showLabel();
        } else {
            hideLabel();
            label.innerHTML = '';
            label.className = 'c-label';
            label.removeAttribute('data-color');
            label.removeAttribute('title');
        }
    }

    document.addEventListener('cursor:set', (e) => {
        renderCursorLabel({
            text: e.detail?.text ?? null,
            icon: e.detail?.icon ?? null,
            colorizeState: e.detail?.colorizeState ?? null
        });
    });

    // ———————————————————————————————————————————
    // Follow / inertia
    // ———————————————————————————————————————————
    let mx = 0, my = 0, rx = 0, ry = 0, tx = 0, ty = 0, lastRX = 0, lastRY = 0, overArea = false;
    const maxStretch = 1.35, velForMax = 28;
    const ringScale = { v: 1 }, tailScale = { v: 1 };
    // lerp + ringLag/tailLag removed so there's no follow delay

    const show = () => { if (cursor) gsap.to(cursor, { opacity: 1, duration: 0.15, ease: 'power2.out' }); };
    const hide = () => { if (cursor) gsap.to(cursor, { opacity: 0, duration: 0.15, ease: 'power2.out' }); };

    let firstPointer = true;

    function onMove(e) {
        mx = e.clientX; my = e.clientY;

        if (holdActive && (e.pointerType === 'touch' || e.pointerType === 'pen')) {
            const dx = e.clientX - downX;
            const dy = e.clientY - downY;
            const dist = Math.hypot(dx, dy);
            if (dist > MOVE_CANCEL_DISTANCE) {
                cancelHold();
            }
        }

        if (firstPointer && CAN_SHOW_CURSOR && cursor) {
            firstPointer = false;
            rx = mx; ry = my; tx = mx; ty = my; lastRX = mx; lastRY = my;

            gsap.set(cursor, { left: mx, top: my });
            if (dot) gsap.set(dot, { left: mx, top: my });
            if (goo) gsap.set(goo, { left: 0, top: 0 });

            gsap.fromTo(cursor, { scale: 0.4, opacity: 0 }, {
                scale: 1,
                opacity: 1,
                duration: 0.28,
                ease: 'back.out(1.6)'
            });
        } else {
            if (cursor && dot && goo) {
                gsap.set(dot, { left: mx, top: my });
                gsap.set(goo, { left: 0, top: 0 });
            }
        }

        updateDifference(mx, my, ringScale.v);
    }

    // ———————————————————————————————————————————
    // DIFFERENCE overlay
    // ———————————————————————————————————————————
    let diffOverlay = null, diffContainer = null, diffRect = null, diffActive = false;

    function createDifferenceOverlay(hostEl) {
        const sel = hostEl.getAttribute('data-difference-target');
        let container = null;
        if (sel) container = hostEl.querySelector(sel) || document.querySelector(sel);
        if (!container) {
            const video = getColorizeTarget(hostEl) || hostEl.querySelector('video') || null;
            container = (video?.closest('figure, .media, .cursor-area')) ||
                hostEl.closest('.cursor-area') || hostEl;
        }
        if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
        const overlay = document.createElement('div');
        overlay.className = 'difference-overlay';
        container.appendChild(overlay);
        return { overlay, container };
    }

    function activateDifference(targetEl, x, y) {
        if (diffActive) return;
        const created = createDifferenceOverlay(targetEl);
        if (!created) return;
        diffOverlay = created.overlay;
        diffContainer = created.container;
        diffRect = diffContainer.getBoundingClientRect();
        diffActive = true;
        const cx = x - diffRect.left, cy = y - diffRect.top;
        diffOverlay.style.setProperty('--cx', cx + 'px');
        diffOverlay.style.setProperty('--cy', cy + 'px');
    }

    function updateDifference(x, y, ringScaleV = 1) {
        if (!diffActive || !diffOverlay || !diffContainer) return;
        diffRect = diffContainer.getBoundingClientRect();
        const cx = x - diffRect.left, cy = y - diffRect.top;
        diffOverlay.style.setProperty('--cx', cx + 'px');
        diffOverlay.style.setProperty('--cy', cy + 'px');
        const baseR = 24, r = baseR * ringScaleV;
        diffOverlay.style.setProperty('--r', r + 'px');
    }

    function deactivateDifference() {
        if (!diffActive) return;
        if (diffOverlay && diffOverlay.parentNode) diffOverlay.parentNode.removeChild(diffOverlay);
        diffOverlay = null;
        diffContainer = null;
        diffRect = null;
        diffActive = false;
    }

    // ———————————————————————————————————————————
    // HOLD TO TOGGLE COLOR
    // ———————————————————————————————————————————
    let holdTL = null, spinTween = null, overlayEl = null, holdDone = false, holdActive = false,
        holdMode = 'toColor', holdVideo = null, maxRcached = 0;

    function startHold(colorEl, downX, downY, pointerType = 'mouse') {
        const video = getColorizeTarget(colorEl);
        if (!video) return;

        holdVideo = video;
        const goesToColor = isTargetGrayscale(video);
        holdMode = goesToColor ? 'toColor' : 'toGray';

        const container = video.closest('figure, .media, .cursor-area') || video.parentElement;
        if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
        const rect = container.getBoundingClientRect();

        overlayEl = document.createElement('div');
        overlayEl.className = 'colorize-overlay';
        container.appendChild(overlayEl);

        const cx = downX - rect.left, cy = downY - rect.top;
        overlayEl.style.setProperty('--cx', cx + 'px');
        overlayEl.style.setProperty('--cy', cy + 'px');

        const maxR = Math.hypot(rect.width, rect.height); maxRcached = maxR;

        if (goesToColor) video.classList.add('video-colorizing');

        holdActive = true; holdDone = false;

        const swirlEl = CAN_SHOW_CURSOR ? burst : touchBurst;

        if (swirlEl) {
            if (!CAN_SHOW_CURSOR) {
                swirlEl.style.left = downX + 'px';
                swirlEl.style.top = downY + 'px';
            }
            gsap.set(swirlEl, {
                opacity: 0.85,
                scale: 0.70,
                filter: goesToColor ? 'grayscale(1) blur(1px)' : 'grayscale(0) blur(1px)'
            });
            if (spinTween) spinTween.kill();
            spinTween = gsap.to(swirlEl, {
                rotation: (goesToColor ? '+=' : '-=') + '360',
                repeat: -1,
                duration: 0.55,
                ease: 'linear'
            });
        }

        const isTouchLike = pointerType === 'touch' || pointerType === 'pen';
        const HOLD_DUR = isTouchLike ? 0.95 : 0.65;

        holdTL = gsap.timeline({
            onUpdate: () => {
                const p = holdTL.progress();
                const r = goesToColor ? (p * maxR) : ((1 - p) * maxR);
                overlayEl.style.setProperty('--r', r + 'px');

                if (swirlEl) {
                    gsap.set(swirlEl, { scale: 0.70 + 0.40 * p });
                    const sat = goesToColor ? p : (1 - p);
                    swirlEl.style.filter = `grayscale(${1 - sat}) blur(1px)`;
                }
            },
            onComplete: () => {
                holdDone = true;
                if (goesToColor) {
                    video.classList.remove('video-colorizing');
                    video.classList.add('video-colorized');
                    renderCursorLabel({ colorizeState: 'on' });
                } else {
                    video.classList.remove('video-colorized');
                    renderCursorLabel({ colorizeState: 'off' });
                }
                if (overlayEl) { overlayEl.remove(); overlayEl = null; }
                if (spinTween) { spinTween.kill(); spinTween = null; }
                if (swirlEl) { gsap.to(swirlEl, { opacity: 0, duration: 0.18, ease: 'power2.out' }); }
            }
        });

        holdTL.to({}, { duration: HOLD_DUR, ease: 'linear' });

        gsap.to(ringScale, { v: 1.30, duration: 0.16, ease: 'expo.out' });
        gsap.to(tailScale, { v: 1.10, duration: 0.18, ease: 'expo.out' });
    }

    function cancelHold() {
        if (!holdActive) return;
        holdActive = false;

        if (holdTL) {
            holdTL.kill(); holdTL = null;
            if (overlayEl) {
                const currentR = parseFloat(getComputedStyle(overlayEl).getPropertyValue('--r')) || 0;
                gsap.to({ r: currentR }, {
                    r: (holdMode === 'toColor' ? 0 : maxRcached),
                    duration: 0.20,
                    ease: 'power2.in',
                    onUpdate() { overlayEl.style.setProperty('--r', this.targets()[0].r + 'px'); },
                    onComplete() { overlayEl.remove(); overlayEl = null; }
                });
            }
            if (spinTween) { spinTween.kill(); spinTween = null; }

            const swirlEl = CAN_SHOW_CURSOR ? burst : touchBurst;
            if (swirlEl) {
                gsap.to(swirlEl, { opacity: 0, duration: 0.14, ease: 'power2.out' });
            }
            if (holdMode === 'toColor' && holdVideo) { holdVideo.classList.remove('video-colorizing'); }
        }
        gsap.to(ringScale, { v: 1, duration: 0.22, ease: 'expo.out' });
        gsap.to(tailScale, { v: 1, duration: 0.22, ease: 'expo.out' });
    }

    // ———————————————————————————————————————————
    // Pointer handlers (all devices)
    // ———————————————————————————————————————————
    function onPointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        const area = isInArea(e.clientX, e.clientY);
        if (!area) return;

        const colorEl = findColorizeEl(e.clientX, e.clientY);
        if (colorEl) {
            downX = e.clientX;
            downY = e.clientY;
            holdingPointerType = e.pointerType || 'mouse';

            startHold(colorEl, e.clientX, e.clientY, holdingPointerType);

            if (e.pointerType === 'mouse') {
                e.preventDefault();
            }
        }
    }

    function onPointerUp() {
        if (!holdDone) cancelHold();
        else {
            gsap.to(ringScale, { v: 1, duration: 0.22, ease: 'expo.out' });
            gsap.to(tailScale, { v: 1, duration: 0.22, ease: 'expo.out' });
        }
        holdDone = false;
        holdVideo = null;
    }

    // ———————————————————————————————————————————
    // Main ticker (only when cursor visuals enabled)
    // ———————————————————————————————————————————
    if (CAN_SHOW_CURSOR && cursor) {
        gsap.ticker.add(() => {
            const area = isInArea(mx, my);

            if (area && !overArea) { overArea = true; show(); }
            if (!area && overArea) {
                overArea = false;
                hide();
                cancelHold();
                hideLabel();
                deactivateDifference();
            }

            if (area) {
                const hoverEl = findLabelIconEl(mx, my);
                const colorEl = findColorizeEl(mx, my);
                if (colorEl) {
                    const target = getColorizeTarget(colorEl);
                    const gray = isTargetGrayscale(target);
                    const customText = colorEl.getAttribute('data-cursor-label') || '';
                    renderCursorLabel({ text: customText || null, icon: null, colorizeState: gray ? 'off' : 'on' });
                } else if (hoverEl) {
                    const t = hoverEl.getAttribute('data-cursor-label');
                    const i = hoverEl.getAttribute('data-cursor-icon');
                    renderCursorLabel({ text: t || null, icon: i || null, colorizeState: null });
                } else {
                    renderCursorLabel({ text: null, icon: null, colorizeState: null });
                }
            } else {
                renderCursorLabel({ text: null, icon: null, colorizeState: null });
            }

            if (area) {
                const diffEl = findDifferenceEl(mx, my);
                if (diffEl) {
                    if (!diffActive) activateDifference(diffEl, mx, my);
                    updateDifference(mx, my, ringScale.v);
                } else if (diffActive) {
                    deactivateDifference();
                }
            } else if (diffActive) {
                deactivateDifference();
            }

            if (!overArea) return;

            // Instant follow – no delay
            rx = mx; ry = my;
            tx = mx; ty = my;

            const vx = rx - lastRX, vy = ry - lastRY;
            lastRX = rx; lastRY = ry;

            const speed = Math.hypot(vx, vy);
            const stretch = gsap.utils.clamp(
                1,
                maxStretch,
                1 + (speed / velForMax) * (maxStretch - 1)
            );
            const angle = Math.atan2(vy, vx) * 180 / Math.PI;

            gsap.set(cursor, { left: rx, top: ry });
            gsap.set(ring, {
                rotate: angle,
                scaleX: stretch * ringScale.v,
                scaleY: (1 / stretch) * ringScale.v
            });
            gsap.set(tail, {
                left: tx - rx,
                top: ty - ry,
                scale: tailScale.v
            });


        });
    }

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);

    const about = document.querySelector('#about');
    if (about) about.classList.add('cursor-area');
});
