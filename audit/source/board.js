

(() => {
  const board = document.getElementById('worksBoard');
  if (!board) return;

  const hasGSAP = !!window.gsap;
  const bgRoot = board.querySelector('.works-bg');
  if (!bgRoot) return;

  const layerA = bgRoot.querySelector('.bg-a');
  const layerB = bgRoot.querySelector('.bg-b');
  if (!layerA || !layerB) return;

  const rows = [...board.querySelectorAll('.work-row')];
  if (!rows.length) return;

  const FALLBACK_IMG = '/assets/images/default.jpg';

  const isMobileLike =
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
    (window.innerWidth && window.innerWidth < 768);

  const imageCache = new Map();

  function ensureOverlay(layer) {
    if (!layer.querySelector('.pInfo')) {
      const pInfo = document.createElement('div');
      pInfo.className = 'pInfo';
      pInfo.innerHTML = `<span class="ptitle"></span>`;
      layer.appendChild(pInfo);
    }
    if (!layer.querySelector('.pfInfo')) {
      const pf = document.createElement('div');
      pf.className = 'pfInfo';
      pf.innerHTML = `<p class="pdescription"></p>`;
      layer.appendChild(pf);
    }
    layer.style.position = 'absolute';
  }
  ensureOverlay(layerA);
  ensureOverlay(layerB);

  const toAbs = (s) => {
    if (!s) return '';
    try { return new URL(s, location.origin).href; }
    catch { return s; }
  };

  const cleanPath = (raw) => {
    if (!raw) return '';
    const s = raw.trim();
    if (!s) return '';
    if (s === '/' || s === './' || s === '#') return '';
    return s;
  };

  const rowMedia = (row, opts = {}) => {
    const video = cleanPath(row?.dataset.projVideo);
    const poster = cleanPath(row?.dataset.projPoster);
    const image = cleanPath(row?.dataset.projImage);

    const title = row?.dataset.projTitle?.trim()
      || row?.querySelector('.wrdata')?.textContent?.trim()
      || '';
    const desc = row?.dataset.projDesc?.trim()
      || row?.lastElementChild?.textContent?.trim()
      || '';

    const forceImage = opts.forceImage === true;
    const imgSrc = poster || image || FALLBACK_IMG;

    if (isMobileLike || forceImage) {
      return { type: 'image', src: imgSrc, title, desc };
    }

    if (video) {
      return {
        type: 'video',
        src: toAbs(video),
        poster: imgSrc,
        title,
        desc
      };
    }

    return { type: 'image', src: imgSrc, title, desc };
  };

  const firstMediaImage = rowMedia(rows[0], { forceImage: true });
  const DEFAULT = {
    type: 'image',
    src: firstMediaImage.src || FALLBACK_IMG,
    poster: '',
    title: firstMediaImage.title || '',
    desc: firstMediaImage.desc || ''
  };

  function preloadImage(src) {
    if (!src || imageCache.has(src)) return;
    const img = new Image();
    img.src = src;
    imageCache.set(src, img);
  }

  rows.forEach(r => {
    const mImg = rowMedia(r, { forceImage: true });
    if (mImg.src) preloadImage(mImg.src);
  });
  if (DEFAULT.src) preloadImage(DEFAULT.src);

  function clearLayerVisual(layer) {
    layer.style.backgroundImage = '';
    const vid = layer.querySelector('video.__bgvid');
    if (vid) {
      try {
        vid.pause();
      } catch { }
      vid.remove();
    }
  }

  function setLayerToImage(layer, src) {
    clearLayerVisual(layer);
    if (!src) return;
    layer.style.backgroundImage = `url("${src}")`;
    layer.style.backgroundSize = 'cover';
    layer.style.backgroundPosition = 'center';
  }

  function setLayerToVideo(layer, src, poster = '') {
    clearLayerVisual(layer);
    if (!src) return;

    if (poster) {
      layer.style.backgroundImage = `url("${poster}")`;
      layer.style.backgroundSize = 'cover';
      layer.style.backgroundPosition = 'center';
    } else {
      layer.style.backgroundImage = '';
    }

    const v = document.createElement('video');
    v.className = '__bgvid';
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.autoplay = true;
    v.loop = true;
    v.preload = 'metadata';
    if (poster) v.poster = poster;

    Object.assign(v.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: '0',
      pointerEvents: 'none'
    });

    v.src = src;
    try { v.load(); } catch { }

    layer.appendChild(v);

    const doPlay = () => {
      v.play().catch(() => {  });
    };

    if (v.readyState >= 1) {
      doPlay();
    } else {
      v.addEventListener('loadedmetadata', doPlay, { once: true });
    }

    return v;
  }

  function setLayerMedia(layer, media) {
    if (!media || !media.src) return;

    let vid = null;

    if (media.type === 'video' && !isMobileLike) {
      vid = setLayerToVideo(layer, media.src, media.poster);
    } else {
      setLayerToImage(layer, media.src);
    }

    const t = layer.querySelector('.ptitle');
    const d = layer.querySelector('.pdescription');
    if (t) t.textContent = media.title ?? '';
    if (d) d.textContent = media.desc ?? '';

    return vid;
  }

  const pauseAllExcept = (keep) => {
    bgRoot.querySelectorAll('video.__bgvid').forEach(v => {
      if (v !== keep) {
        try { v.pause(); } catch { }
      }
    });
  };


  let showingA = true;
  let current = { ...DEFAULT };
  let currentKey = `${current.type}|${current.src}`;
  let animating = false;
  let queuedNext = null;
  let transitionId = 0;

  setLayerMedia(layerA, DEFAULT);
  layerA.style.opacity = 1;
  layerA.classList.add('active');

  const titleA = layerA.querySelector('.ptitle');
  const descA = layerA.querySelector('.pdescription');
  const titleB = layerB.querySelector('.ptitle');
  const descB = layerB.querySelector('.pdescription');

  if (titleA) titleA.textContent = DEFAULT.title;
  if (descA) descA.textContent = DEFAULT.desc;
  if (titleB) titleB.textContent = DEFAULT.title;
  if (descB) descB.textContent = DEFAULT.desc;


  function doCrossfade(next) {
    const localId = ++transitionId;

    const show = showingA ? layerB : layerA;
    const hide = showingA ? layerA : layerB;

    const showVid = setLayerMedia(show, next);
    const hideVid = hide.querySelector('video.__bgvid') || null;

    hide.classList.remove('active');
    show.classList.add('active');

    animating = true;

    if (hasGSAP) {
      gsap.killTweensOf([show, hide]);
      gsap.set(show, { opacity: 0, scale: 1.03 });
      gsap.to(show, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out'
      });
      gsap.to(hide, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in',
        onComplete() {
          if (localId !== transitionId) return;

          if (hideVid) {
            try { hideVid.pause(); } catch { }
          }
          clearLayerVisual(hide);
          animating = false;

          if (queuedNext) {
            const q = queuedNext;
            queuedNext = null;
            requestCrossfade(q);
          }
        }
      });
    } else {
      show.style.opacity = 1;
      hide.style.opacity = 0;

      if (hideVid) {
        try { hideVid.pause(); } catch { }
      }
      clearLayerVisual(hide);
      animating = false;

      if (queuedNext) {
        const q = queuedNext;
        queuedNext = null;
        requestCrossfade(q);
      }
    }

    if (showVid) pauseAllExcept(showVid);
    else pauseAllExcept(null);

    showingA = !showingA;
    current = next;
    currentKey = `${current.type}|${current.src}`;
  }

  let hoverTimer = 0;
  function requestCrossfade(next) {
    const nextKey = `${next.type}|${next.src}`;
    if (nextKey === currentKey) {
      const vis = showingA ? layerB : layerA;
      const t = vis.querySelector('.ptitle');
      const d = vis.querySelector('.pdescription');
      if (t && t.textContent !== (next.title || '')) t.textContent = next.title || '';
      if (d && d.textContent !== (next.desc || '')) d.textContent = next.desc || '';
      return;
    }
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      if (animating) queuedNext = next;
      else doCrossfade(next);
    }, 70);
  }

  rows.forEach(r => {
    const go = () => requestCrossfade(rowMedia(r));
    r.addEventListener('mouseenter', go);
    r.addEventListener('focus', go, true);
    r.addEventListener('touchstart', go, { passive: true });
  });

  board.addEventListener('mouseleave', () => requestCrossfade(DEFAULT));

})();
