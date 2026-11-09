
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/* ====================== SHADERS ====================== */
/* Background: solid color fill */
const bgFragment = `
precision highp float;
uniform vec3 uBgColor;
uniform float uBgAlpha;
void main(){
  gl_FragColor = vec4(uBgColor, uBgAlpha);
}`;

/* Media: RGB split + mild barrel (soft, symmetric) — with dynamic safe margins */
/* Media: RGB split + mild barrel (soft, symmetric) — with dynamic safe margins */
const mediaFragment = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tMap;
uniform float uOpacity;
uniform float uStrength;

/* --- Accurate sRGB <-> Linear (no three.js includes needed) --- */
vec3 srgbToLinear(vec3 c){
  bvec3 cutoff = lessThanEqual(c, vec3(0.04045));
  vec3 lower = c / 12.92;
  vec3 higher = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(higher, lower, vec3(cutoff));
}
vec3 linearToSrgb(vec3 c){
  bvec3 cutoff = lessThanEqual(c, vec3(0.0031308));
  vec3 lower = c * 12.92;
  vec3 higher = 1.055 * pow(c, vec3(1.0/2.4)) - 0.055;
  return mix(higher, lower, vec3(cutoff));
}

vec2 barrel(vec2 uv, float amt){
  vec2 cc = uv - 0.5;
  float dist = dot(cc, cc);
  return uv + cc * dist * amt;
}
vec2 clampSafe(vec2 uv, float m){ return clamp(uv, vec2(m), vec2(1.0 - m)); }

void main(){
  float s = abs(uStrength);
  float on  = 0.10;
  float full = 0.35;
  float t = clamp((s - on) / max(1e-5, (full - on)), 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);

  float split = s * 0.012;
  float barrelAmt = s * 0.08;

  vec2 uvR = barrel(vUv + vec2( split, 0.0), barrelAmt);
  vec2 uvG = barrel(vUv,                   barrelAmt);
  vec2 uvB = barrel(vUv + vec2(-split, 0.0), barrelAmt);

  float margin  = mix(0.003, 0.020, clamp(s, 0.0, 1.0));
  uvR = clampSafe(uvR, margin);
  uvG = clampSafe(uvG, margin);
  uvB = clampSafe(uvB, margin);

  // decode samples sRGB -> linear
  vec3 cR = srgbToLinear(texture2D(tMap, uvR).rgb);
  vec3 cG = srgbToLinear(texture2D(tMap, uvG).rgb);
  vec3 cB = srgbToLinear(texture2D(tMap, uvB).rgb);

  // compose in linear space
  vec3 col = vec3(cR.r, cG.g, cB.b);

  // edge feather
  float feather = mix(0.006, 0.020, clamp(s, 0.0, 1.0));
  float fx = smoothstep(0.0, feather, vUv.x) * smoothstep(0.0, feather, 1.0 - vUv.x);
  float fy = smoothstep(0.0, feather, vUv.y) * smoothstep(0.0, feather, 1.0 - vUv.y);
  float edgeMask = fx * fy;

  // encode back to sRGB once
  vec3 outSrgb = linearToSrgb(col);
  gl_FragColor = vec4(outSrgb, uOpacity * edgeMask);
}`;



/* Vertex: soft, centered bell curve (even on both sides) */
const vertexShader = `
precision highp float;
uniform vec2  uViewportSizes;
uniform float uStrength;  // + forward, - backward
uniform float uBulge;
varying vec2 vUv;

void main(){
  vUv = uv;

  // Compute model->view
  vec4 viewPos = modelViewMatrix * vec4(position, 1.0);

  // Normalize Y to [0,1] in view space relative to viewport height
  float ny = clamp((viewPos.y / uViewportSizes.y) + 0.5, 0.0, 1.0);

  // Symmetric bell: v = 4x(1-x); ease for roundness
  float v = 4.0 * ny * (1.0 - ny);
  v = mix(v, smoothstep(0.0, 1.0, v), 0.35);

  // Centered bow along Z; sign handled in uStrength (per-column)
  viewPos.z += v * uStrength * uBulge;
  viewPos.y += v * uStrength * uBulge;

  gl_Position = projectionMatrix * viewPos;
}`;

/* ====================== SCROLL STATE ====================== */
let target = 0,
    current = 0;
const ease = 0.07; // smooth catch-up
const speedx = 0.30; // wheel multiplier
const dragSpeed = 1.3; // desktop drag multiplier (matches touch feel)

// --- safe limiter: cap how much 'target' may change in a single frame
let lastTarget = 0;
let MAX_TARGET_STEP = Math.max(400, innerHeight * 0.75); // px/frame, updated on resize
const MAX_BEND = 0.9; // cap the visual warp

const SPEED_ON = 90; // speed where the effect starts
const SPEED_FULL = 600;

// touch scrolling (kept)
let touchY = 0;
let touchActiveInContact = false;

const contactSection = document.getElementById('contact');

function isPointInContact(x, y) {
    if (!contactSection) return false;
    const rect = contactSection.getBoundingClientRect();
    return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
    );
}


function smoothstep(edge0, edge1, x) {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
    return t * t * (3 - 2 * t);
}

function onWheel(e) {
    e.preventDefault();
    target += e.deltaY * speedx;
}

function onTouchStart(e) {
    touchActiveInContact = true;
    touchY = e.touches[0].clientY;
}

function onTouchMove(e) {
    if (!touchActiveInContact) return;

    e.preventDefault();
    const t = e.touches[0];
    const y = t.clientY;
    target += (touchY - y) * 1.3;
    touchY = y;
}

// --- mouse drag (pointer events) — restricted to real mouse to avoid touch duplication
let isDragging = false;
let dragY = 0;

function onPointerDown(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;

    isDragging = true;
    dragY = e.clientY || 0;
    document.body.classList.add('dragging');

    if (e.target.setPointerCapture && e.pointerId != null) {
        e.target.setPointerCapture(e.pointerId);
    }
}

function onPointerMove(e) {
    if (!isDragging) return;

    const y = e.clientY || 0;
    const dy = dragY - y;
    target += dy * dragSpeed;
    dragY = y;
    e.preventDefault();
}

function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove('dragging');
    touchActiveInContact = false;
}



/* ====================== DOM TRACKS (infinite) ====================== */
const cols = [...document.querySelectorAll('.content__scroll')].map(el => {
    const dir = parseFloat(el.dataset.dir) || 1;
    const a = el.querySelector('.track');
    const b = a.cloneNode(true);
    el.appendChild(b);

    const tracks = [a, b];
    const needThird = (a.scrollHeight || a.offsetHeight) + getGapPx(a) < innerHeight * 1.2;
    if (needThird) {
        const c = a.cloneNode(true);
        el.appendChild(c);
        tracks.push(c);
    }
    return {
        el,
        dir,
        tracks
    };
});

function prewarmVideos() {
    cols.forEach(({
        tracks
    }) => {
        tracks.forEach(track => {
            track.querySelectorAll('video').forEach(v => {
                if (v.readyState < 1) {
                    try {
                        v.load();
                    } catch (e) { }
                }
            });
        });
    });
}
prewarmVideos();

/* ====================== WEBGL SCENE ====================== */
class FilmCanvas {
    constructor() {
        this.container = document.querySelector('.mainRoll');
        this.scene = new THREE.Scene();

        this.dist = 1000; // 1 unit ≈ 1 CSS px
        this.camera = new THREE.PerspectiveCamera(this._fov(), innerWidth / innerHeight, 0.1, 5000);
        this.camera.position.set(0, 0, this.dist);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setClearColor(0x000000, 0);  // alpha 0
        // or explicitly:
        this.renderer.setClearAlpha(0);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.setPixelRatio(Math.min(1.75, devicePixelRatio || 1));
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.domElement.className = 'webgl';
        this.renderer.toneMapping = THREE.NoToneMapping;

        this.container.appendChild(this.renderer.domElement);

        this.items = [];
        this._buildItems();

        addEventListener('resize', () => this._onResize(), {
            passive: true
        });
        this._render = this._render.bind(this);
        this._render();
    }
    _fov() {
        return (180 * (2 * Math.atan(innerHeight / 2 / this.dist))) / Math.PI;
    }
    _onResize() {
        this.camera.fov = this._fov();
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(Math.min(1.75, devicePixelRatio || 1));
        this.renderer.setSize(innerWidth, innerHeight);
        // keep limiter in sync with viewport
        MAX_TARGET_STEP = Math.max(400, innerHeight * 0.75);
    }
    _buildItems() {
        const frames = [...document.querySelectorAll('.videohome')];
        frames.forEach(el => this.items.push(new Tile(el, this.scene)));
    }

    _moveTracks() {
        cols.forEach(({
            tracks,
            dir
        }) => {
            const base = tracks[0];
            const h = base.scrollHeight || base.offsetHeight;
            if (!h) return;

            const g = getGapPx(base);
            const ttl = h + g;

            let y = (current * dir) % ttl;
            if (y > 0) y -= ttl;

            const yRounded = Math.round(y); // avoid sub-pixel seams
            tracks.forEach((t, i) => {
                t.style.transform = `translate3d(0, ${yRounded + i * ttl}px, 0)`;
            });
        });
    }

    _render() {
        // --- limit how much target can jump per frame (fast drags/flicks)
        let dt = target - lastTarget;
        if (dt > MAX_TARGET_STEP) target = lastTarget + MAX_TARGET_STEP;
        if (dt < -MAX_TARGET_STEP) target = lastTarget - MAX_TARGET_STEP;
        lastTarget = target;

        current += (target - current) * ease;

        const vel = (target - current);
        const speed = Math.abs(vel);
        const dirScroll = speed === 0 ? 0 : (vel > 0 ? 1 : -1);

        // Gate the effect: 0 below SPEED_ON, 1 by SPEED_FULL (smooth ramp)
        const gate = smoothstep(SPEED_ON, SPEED_FULL, speed);

        // Base bend curve (same as before), then apply gate
        const baseBend = Math.min(MAX_BEND, Math.pow(speed * 0.003, 0.9));
        const bend = baseBend * gate;

        this._moveTracks();

        for (const item of this.items) {
            item.uniforms.uViewportSizes.value.set(innerWidth, innerHeight);

            // OPPOSING COLUMNS: left/right are exact opposites
            const targetStrength = bend * dirScroll * item.sign;

            // gentle ease, numerically identical for both columns
            const k = (gate > 0.0) ? 0.88 : 0.80; // decay faster when idle
            item.uniforms.uStrength.value =
                item.uniforms.uStrength.value * k + (bend * dirScroll * item.sign) * (1 - k);


            item.update();
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this._render);
    }
}

function getGapPx(trackEl) {
    const cs = getComputedStyle(trackEl);
    const g = parseFloat(cs.rowGap || cs.gap || 0);
    return isNaN(g) ? 0 : g;
}

function parseCssColor(str) {
    if (!str) return { color: new THREE.Color(0x000000), alpha: 1 };
    const s = str.trim().toLowerCase();

    // rgba(r,g,b,a)
    if (s.startsWith('rgba(')) {
        const [r, g, b, a] = s.slice(5, -1).split(',').map(v => parseFloat(v.trim()));
        return { color: new THREE.Color(r / 255, g / 255, b / 255), alpha: isNaN(a) ? 1 : a };
    }

    // rgb(r,g,b)
    if (s.startsWith('rgb(')) {
        const [r, g, b] = s.slice(4, -1).split(',').map(v => parseFloat(v.trim()));
        return { color: new THREE.Color(r / 255, g / 255, b / 255), alpha: 1 };
    }

    // hex or named colors
    return { color: new THREE.Color(s), alpha: 1 };
}

/* ====================== TILE (image or video) ====================== */
class Tile {
    constructor(frameEl, scene) {
        this.frameEl = frameEl;
        this.scene = scene;
        this.media = frameEl.querySelector('video, img');
        const bgRaw = frameEl.dataset.bg || 'rgba(0,0,0,0.1)';
        const { color: bgColor, alpha: bgAlpha } = parseCssColor(bgRaw);
        this.bgColor = bgColor;
        this.bgAlpha = bgAlpha;
        this.center = new THREE.Vector2();
        this.size = new THREE.Vector2();

        // Column sign: left = -1, right = +1 (slight scaling retained)
        const col = this.frameEl.closest('.content__scroll');
        this.sign = (col && parseFloat(col.dataset.dir) < 0) ? -0.8 : +0.8;

        // Shared uniforms (same for bg & media → perfect match)
        this.uniforms = {
            uViewportSizes: {
                value: new THREE.Vector2(innerWidth, innerHeight)
            },
            uStrength: {
                value: 0.0
            },
            uBulge: {
                value: 140.0
            } // soft default; try 130–160
        };

        // background plane (solid fill)
        this.bg = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader: bgFragment,
                uniforms: {
                    uViewportSizes: this.uniforms.uViewportSizes,
                    uStrength: this.uniforms.uStrength,
                    uBulge: this.uniforms.uBulge,
                    uBgColor: { value: this.bgColor },
                    uBgAlpha: { value: this.bgAlpha }
                },
                side: THREE.DoubleSide,
                transparent: this.bgAlpha < 1.0   // allow the alpha to actually blend
            })
        );
        this.bg.renderOrder = 0;
        // this.scene.add(this.bg);

        // media plane
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 64, 64),
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader: mediaFragment,
                uniforms: {
                    uViewportSizes: this.uniforms.uViewportSizes,
                    uStrength: this.uniforms.uStrength,
                    uBulge: this.uniforms.uBulge,
                    tMap: { value: null },
                    uOpacity: { value: 1.0 }
                },
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                // (nothing else needed here)
            })
        ); this.mesh.material.toneMapped = true;  
        this.mesh.renderOrder = 1;
        this.scene.add(this.mesh);

        if (this.media && this.media.tagName === 'VIDEO') this._setupVideo();
        else this._setupImage();
    }

    _measure() {
        const r = this.frameEl.getBoundingClientRect();

        // exact centering to avoid sub-pixel asymmetry
        const cx = (r.left + r.right) * 0.5 - innerWidth * 0.5;
        const cy = (r.top + r.bottom) * 0.5 - innerHeight * 0.5;

        this.size.set(r.width, r.height);
        this.center.set(cx, -cy); // flip Y for view space
    }

    _setupImage() {
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(this.media.src, (t) => {
            t.generateMipmaps = false;
            t.minFilter = THREE.LinearFilter;
            t.magFilter = THREE.LinearFilter;
            t.wrapS = THREE.ClampToEdgeWrapping;
            t.wrapT = THREE.ClampToEdgeWrapping;
            // if ('colorSpace' in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
            // if ('encoding' in t && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
            this.mesh.material.uniforms.tMap.value = t;
        });
    }

    _setupVideo() {
        const v = this.media;
        v.muted = true;
        v.playsInline = true;
        v.loop = true;

        new IntersectionObserver((ents) => {
            for (const e of ents) {
                e.isIntersecting ? v.play().catch(() => { }) : v.pause();
            }
        }, {
            root: null,
            rootMargin: '300px 0px',
            threshold: 0.01
        }).observe(v);

        const tex = new THREE.VideoTexture(v);
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        // if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
        // if ('encoding' in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
        this.mesh.material.uniforms.tMap.value = tex;
    }

    // contain media inside the 16:9 frame size
    _applyContain() {
        const t = this.mesh.material.uniforms.tMap.value;
        if (!t || !t.image) {
            this.mesh.scale.set(this.size.x, this.size.y, 1);
            return;
        }
        const fw = this.size.x,
            fh = this.size.y;
        const tw = t.image.videoWidth || t.image.width;
        const th = t.image.videoHeight || t.image.height;
        const s = Math.min(fw / tw, fh / th);
        this.mesh.scale.set(tw * s, th * s, 1);
    }

    update() {
        this._measure();

        // identical Z layering for bg/media to avoid parallax bias
        this.bg.position.set(this.center.x, this.center.y, -5.0);
        this.mesh.position.set(this.center.x, this.center.y, 0.0);

        this.bg.scale.set(this.size.x, this.size.y, 1);
        this._applyContain();

        // stability: ensure shaders see identical uniforms each frame
        this.bg.material.uniforms.uStrength.value = this.uniforms.uStrength.value;
        this.mesh.material.uniforms.uStrength.value = this.uniforms.uStrength.value;
    }
}

/* ====================== BOOT ====================== */
/* ====================== BOOT ====================== */
document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.getElementById('contact');

    if (contactSection) {
        // Wheel only inside #contact
        contactSection.addEventListener('wheel', onWheel, { passive: false });

        // Touch only inside #contact
        contactSection.addEventListener('touchstart', onTouchStart, { passive: true });
        contactSection.addEventListener('touchmove', onTouchMove, { passive: false });

        // Start drag only inside #contact
        contactSection.addEventListener('pointerdown', onPointerDown, { passive: true });
    }

    // We still need global move/up to finish drags cleanly
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    new FilmCanvas();
});
