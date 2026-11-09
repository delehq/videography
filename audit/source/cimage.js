import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/* ================= Config ================= */
const CLOUD_RADIUS = 1100;
const PAN_BOUNDS = 900;
const MIN_DIST = 140;
const MAX_DIST = 900;
const BASE_SIZE = 140;

const SPREAD_RADIUS = 900;
const Z_SPREAD = 700;
const MIN_CLUSTER_R = 260;

let scrollZoomEnabled = false;
const REQUIRE_MOD_FOR_ZOOM = false;

let hoveredMesh = null;

const mount = document.querySelector('#imageCloud');

function getSize() {
    const r = mount.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
}

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1200, 3500);

mount.style.background = '#0d0d0d';
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace; 
renderer.setClearColor(0x000000, 0);
const { w: W0, h: H0 } = getSize();
renderer.setSize(W0, H0, false);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
mount.appendChild(renderer.domElement);

renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

const mouseNDC = new THREE.Vector2();
renderer.domElement.addEventListener('pointermove', (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
});

const camera = new THREE.PerspectiveCamera(60, W0 / H0, 0.1, 6000);
camera.up.set(0, 1, 0);
camera.position.set(0, 0, 900);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.screenSpacePanning = true;
controls.minDistance = MIN_DIST;
controls.maxDistance = MAX_DIST;
controls.target.set(0, 0, 0);

controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
};
controls.touches = {
    ONE: THREE.TOUCH.PAN,
    TWO: THREE.TOUCH.DOLLY_ROTATE
};

function setCameraDistance(dist) {
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, dist);
    camera.lookAt(controls.target);
    controls.update();
}
setCameraDistance(MAX_DIST - 0.001);

controls.dollyToCursor = false;
controls.enableZoom = false;

function clampTarget() {
    controls.target.set(
        THREE.MathUtils.clamp(controls.target.x, -PAN_BOUNDS, PAN_BOUNDS),
        THREE.MathUtils.clamp(controls.target.y, -PAN_BOUNDS, PAN_BOUNDS),
        THREE.MathUtils.clamp(controls.target.z, -PAN_BOUNDS, PAN_BOUNDS)
    );
}
controls.addEventListener('change', clampTarget);

function scatterPosition() {
    const u = Math.random();
    const r = Math.cbrt(u) * (SPREAD_RADIUS - MIN_CLUSTER_R) + MIN_CLUSTER_R;
    const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
    const phi = Math.random() * Math.PI * 2;
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = THREE.MathUtils.clamp(r * Math.cos(theta), -Z_SPREAD, Z_SPREAD);
    return new THREE.Vector3(x, y, z);
}

const loader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function tween(dur, onUpdate, onDone) {
    const start = performance.now();
    function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        onUpdate(e);
        if (t < 1) requestAnimationFrame(step);
        else onDone && onDone();
    }
    requestAnimationFrame(step);
}


let wasDamping = true, controlsFrozen = false;

function freezeControls() {
    controlsFrozen = true;
    wasDamping = controls.enableDamping;
    controls.enableDamping = false;
    controls.enabled = false;
}

function unfreezeControls() {
    controls.enabled = true;
    controls.enableDamping = wasDamping;
    controls.update();
    controls.update();
    controlsFrozen = false;
}

function projectWorldToPx(world, camera, rect) {
    const ndc = world.clone().project(camera);
    if (!isFinite(ndc.x) || !isFinite(ndc.y) || !isFinite(ndc.z)) return null;
    if (ndc.z < -1 || ndc.z > 1) return null; // behind/invalid
    return {
        x: rect.left + (ndc.x * 0.5 + 0.5) * rect.width,
        y: rect.top + (-ndc.y * 0.5 + 0.5) * rect.height
    };
}

function clampPx(p, rect, pad = 8) {
    return {
        x: Math.min(rect.right - pad, Math.max(rect.left + pad, p.x)),
        y: Math.min(rect.bottom - pad, Math.max(rect.top + pad, p.y)),
    };
}


function recenterFocusedMeshOnScreen(mesh) {
    if (!mesh) return;

    camera.updateMatrixWorld(true);
    mesh.updateWorldMatrix(true, true);

    const rect = renderer.domElement.getBoundingClientRect();
    const centerWorld = mesh.getWorldPosition(new THREE.Vector3());
    const px = projectWorldToPx(centerWorld, camera, rect);
    if (!px) return;

    const dxPx = px.x - (rect.left + rect.width / 2);
    const dyPx = px.y - (rect.top + rect.height / 2);

    const dist = camera.position.distanceTo(controls.target);
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const visibleH = 2 * dist * Math.tan(vFOV / 2);
    const unitsPerPxY = visibleH / rect.height;
    const unitsPerPxX = unitsPerPxY * camera.aspect;

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();

    const panWorld = new THREE.Vector3()
        .addScaledVector(right, dxPx * unitsPerPxX)
        .addScaledVector(up, -dyPx * unitsPerPxY);

    controls.target.add(panWorld);
    camera.position.add(panWorld);
    controls.update();
}


const cloud = new THREE.Group();
scene.add(cloud);

const planes = [];

function makePlane(meta) {
    const geom = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        depthTest: true,
        depthWrite: false, 
    });
    const mesh = new THREE.Mesh(geom, mat);

    mesh.position.copy(scatterPosition());
    mesh.userData.basePos = mesh.position.clone();

    mesh.userData.classes = (meta.class || '').trim().split(/\s+/).filter(Boolean);
    mesh.userData.attrs = { ...(meta.attrs || {}) };
    mesh.userData.cursorLabel = meta.label || '';

    mesh.userData.hd = meta.hd || meta.src;

    loader.load(meta.src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat.map = tex;
        mat.needsUpdate = true;
        const w = tex.image?.naturalWidth || tex.image?.width || 640;
        const h = tex.image?.naturalHeight || tex.image?.height || 480;
        mesh.scale.set(BASE_SIZE * (w / h), BASE_SIZE, 1);
    });

    planes.push(mesh);
    cloud.add(mesh);
    return mesh;
}

function sortPlanesByDepth() {
    const camPos = camera.position;

    planes.sort((a, b) => {
        const da = a.position.distanceToSquared(camPos);
        const db = b.position.distanceToSquared(camPos);
        return da - db;
    });

    let order = 0;
    for (const p of planes) {
        if (p === focused) continue;
        p.renderOrder = order++;
    }

    if (focused) {
        focused.renderOrder = order + 1;
    }
}


const IMAGES = Array.from({ length: 25 }, (_, i) => {
    const n = i + 1; // 1..40
    return {
        src: `/assets/images/used/cloud/opti/${n}.jpg`,
        hd: `/assets/images/used/cloud/${n}.jpg`,
        class: '',
        attrs: {}
    };
});
IMAGES.forEach(makePlane);

const hud = document.getElementById('imageCloudHud');
const hdBtn = document.getElementById('imgHdBtn');
const lightbox = document.getElementById('imgLightbox');
const lightboxImg = lightbox?.querySelector('img');
if (hdBtn) hdBtn.style.display = 'none';

function openHD(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.style.display = 'grid';
}

function closeHD() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    if (lightboxImg) lightboxImg.src = '';
}
lightbox?.addEventListener('click', closeHD);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHD(); });

function positionHdButtonForMesh(mesh) {
    if (!mesh || !hdBtn || !hud) return;

    camera.updateMatrixWorld(true);
    mesh.updateWorldMatrix(true, true);

    const rect = renderer.domElement.getBoundingClientRect();

    const hx = 0.5 * mesh.scale.x, hy = 0.5 * mesh.scale.y;
    const cornersLocal = [
        new THREE.Vector3(-hx, -hy, 0),
        new THREE.Vector3(+hx, -hy, 0),
        new THREE.Vector3(+hx, +hy, 0),
        new THREE.Vector3(-hx, +hy, 0),
    ];

    const cornersPx = [];
    for (const c of cornersLocal) {
        const w = mesh.localToWorld(c.clone());
        const p = projectWorldToPx(w, camera, rect);
        if (!p) { hdBtn.style.display = 'none'; return; }
        cornersPx.push(p);
    }

    let tr = cornersPx[0];
    for (const p of cornersPx) {
        const isMoreRight = p.x > tr.x - 0.5;
        const isMoreTop = p.y < tr.y + 0.5;
        if (isMoreRight && isMoreTop) tr = p;
    }

    const clamped = clampPx(tr, rect, 10);

    Object.assign(hdBtn.style, {
        display: 'grid',
        left: `${clamped.x}px`,
        top: `${clamped.y}px`,
        transform: 'translate(-80%, -20%)'
    });
}

function positionHdButtonAtImageBottomCenter(mesh, offset = 50) {
    if (!mesh || !hdBtn) return;

    camera.updateMatrixWorld(true);
    mesh.updateWorldMatrix(true, true);

    const hy = 0.5 * mesh.scale.y;
    const bottomCenterLocal = new THREE.Vector3(0, -hy, 0);
    const bottomCenterWorld = mesh.localToWorld(bottomCenterLocal.clone());

    const rect = renderer.domElement.getBoundingClientRect();
    const px = projectWorldToPx(bottomCenterWorld, camera, rect);

    if (!px) { hdBtn.style.display = 'none'; return; }

    Object.assign(hdBtn.style, {
        display: 'grid',
        left: `${px.x}px`,
        bottom: `40px`,
        transform: 'translate(-50%, -100%)'
    });
}

function hideHdButton() {
    if (hdBtn) hdBtn.style.display = 'none';
}

function recenterByBox() {
    if (!planes.length) return;
    const box = new THREE.Box3();
    for (const p of planes) box.expandByPoint(p.position);
    const center = new THREE.Vector3();
    box.getCenter(center);
    for (const p of planes) {
        p.position.sub(center);
        if (p.userData.basePos) p.userData.basePos.sub(center);
    }
    cloud.position.set(0, 0, 0);
    controls.target.set(0, 0, 0);
    setCameraDistance(MAX_DIST - 0.001);
}
recenterByBox();

const SAFE_NEAR = 200;
function keepSpritesAway() {
    const forward = new THREE.Vector3();
    for (const p of planes) {
        const d = camera.position.distanceTo(p.position);
        if (d < SAFE_NEAR) {
            forward.subVectors(p.position, camera.position).normalize();
            p.position.addScaledVector(forward, SAFE_NEAR - d);
        }
    }
}

function introFloatOnce() {
    const maxOffset = 24;
    const delays = planes.map(() => Math.random() * 200);
    const starts = planes.map(p => {
        const dy = THREE.MathUtils.randFloatSpread(maxOffset);
        const sY = p.userData.basePos.y + dy;
        p.position.y = sY;
        return sY;
    });
    const dur = 1000, t0 = performance.now();
    (function step() {
        const now = performance.now();
        let allDone = true;
        for (let i = 0; i < planes.length; i++) {
            const p = planes[i];
            const elapsed = Math.max(0, now - t0 - delays[i]);
            const t = Math.min(1, elapsed / dur);
            if (t < 1) allDone = false;
            const e = Math.sin((t * Math.PI) / 2);
            p.position.y = THREE.MathUtils.lerp(starts[i], p.userData.basePos.y, e);
        }
        if (!allDone) requestAnimationFrame(step);
    })();
}
setTimeout(introFloatOnce, 50);

function fitDistanceForMesh(mesh, marginPx = 24) {
    const { w: vw, h: vh } = getSize();
    const usableW = Math.max(1, vw - 2 * marginPx);
    const usableH = Math.max(1, vh - 2 * marginPx);

    const objW = Math.max(0.0001, mesh.scale.x);
    const objH = Math.max(0.0001, mesh.scale.y);

    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect);

    const dH = (objH / (usableH / vh)) / (2 * Math.tan(vFOV / 2));
    const dW = (objW / (usableW / vw)) / (2 * Math.tan(hFOV / 2));

    const dist = THREE.MathUtils.clamp(Math.max(dW, dH), MIN_DIST + 1, MAX_DIST - 1);
    return dist;
}

const CLICK_MOVE_THRESH = 6, TWEEN_COOLDOWN_MS = 250;
let focused = null, focusState = null, isTweening = false, lastTweenAt = 0;

let zoomVel = 0, lastMouseNDC = new THREE.Vector2(), zoomAnchor = null, zoomingFrames = 0;
const ZOOM_PULL_MAX = 0.18, ZOOM_PULL_BASE = 0.08;

function setDragEnabled(active) {
    controls.enableRotate = active;
    controls.enablePan = active;
}

function focusPlane(mesh) {
    if (isTweening) return;
    if (focused && focused !== mesh) { unfocus({ instant: true, onDone: () => focusPlane(mesh) }); return; }
    if (focused === mesh) { unfocus(); return; }

    isTweening = true;
    zoomVel = 0;
    zoomAnchor = null;
    freezeControls();
    setDragEnabled(false);

    const matState = { depthTest: mesh.material.depthTest, depthWrite: mesh.material.depthWrite };
    focusState = {
        prevCamPos: camera.position.clone(),
        prevTarget: controls.target.clone(),
        matState,
        renderOrder: mesh.renderOrder,
        scale: mesh.scale.clone()
    };

    focused = mesh;
    mesh.material.depthTest = false;
    mesh.material.depthWrite = false;
    mesh.renderOrder = 9999;

    const startCamPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endTarget = mesh.getWorldPosition(new THREE.Vector3());

    const margin = Math.round(Math.min(getSize().w, getSize().h) * 0.06); // ~6% margin
    const fitDist = fitDistanceForMesh(mesh, margin);

    const viewDir = new THREE.Vector3().subVectors(startCamPos, startTarget).normalize();
    const endCamPos = endTarget.clone().addScaledVector(viewDir, fitDist);

    const startScale = mesh.scale.clone();
    const wantsSubtlePop = window.matchMedia('(pointer:fine)').matches; // desktop
    const scaleFactor = wantsSubtlePop ? 1.02 : 1.0; // tiny pop on desktop only
    const endScale = startScale.clone().multiplyScalar(scaleFactor);

    tween(650, e => {
        camera.position.lerpVectors(startCamPos, endCamPos, e);
        controls.target.lerpVectors(startTarget, endTarget, e);
        mesh.scale.lerpVectors(startScale, endScale, e);
    }, () => {
        cloud.position.set(0, 0, 0);

        recenterFocusedMeshOnScreen(mesh);

        unfreezeControls();
        isTweening = false;
        lastTweenAt = performance.now();

        requestAnimationFrame(() => positionHdButtonAtImageBottomCenter(mesh, 50));
        if (hdBtn) {
            const hdSrc = mesh.userData.hd || mesh.userData.src || null;
            if (hdSrc) {
                hdBtn.onclick = () => openHD(hdSrc);
                hdBtn.style.display = 'grid';
            } else {
                hideHdButton();
            }
        }
    });
}

function unfocus({ instant = false, onDone = null } = {}) {
    if (!focused || isTweening || !focusState) { onDone && onDone(); return; }
    isTweening = true;
    zoomVel = 0;
    zoomAnchor = null;

    const m = focused;
    const { prevCamPos, prevTarget, matState, renderOrder, scale } = focusState;

    const restore = () => {
        m.material.depthTest = matState.depthTest;
        m.material.depthWrite = matState.depthWrite;

        hideHdButton();
        m.renderOrder = renderOrder;
        unfreezeControls();
        focused = null;
        focusState = null;
        isTweening = false;
        lastTweenAt = performance.now();
        setDragEnabled(true);

        onDone && onDone();
    };

    if (instant) {
        camera.position.copy(prevCamPos);
        controls.target.copy(prevTarget);
        m.scale.copy(scale);
        restore();
        return;
    }

    const startCamPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const startScale = m.scale.clone();

    tween(560, e => {
        camera.position.lerpVectors(startCamPos, prevCamPos, e);
        controls.target.lerpVectors(startTarget, prevTarget, e);
        m.scale.lerpVectors(startScale, scale, e);
    }, restore);
}

let downPos = null;
renderer.domElement.addEventListener('pointerdown', ev => {
    downPos = { x: ev.clientX, y: ev.clientY, t: performance.now() };
});
renderer.domElement.addEventListener('pointerup', ev => {
    if (!downPos) return;
    const moved = Math.hypot(ev.clientX - downPos.x, ev.clientY - downPos.y);
    const sinceTween = performance.now() - lastTweenAt;
    downPos = null;
    if (moved > CLICK_MOVE_THRESH || isTweening || sinceTween < TWEEN_COOLDOWN_MS) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(planes, false)[0];
    if (hit) focusPlane(hit.object);
    else unfocus();
});

renderer.domElement.addEventListener('wheel', e => {
    const wantsZoom = REQUIRE_MOD_FOR_ZOOM ? (e.ctrlKey || e.metaKey) : true;
    if (!wantsZoom || !scrollZoomEnabled) return; // let page scroll
    e.preventDefault();

    const rect = renderer.domElement.getBoundingClientRect();
    lastMouseNDC.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    if (Math.abs(zoomVel) < 0.00001) {
        zoomAnchor = computeZoomAnchor();
        zoomingFrames = 0;
    }
    zoomVel += THREE.MathUtils.clamp(-e.deltaY * 0.0008, -0.35, 0.35);
}, { passive: false });

function computeZoomAnchor() {
    if (focused) return focused.getWorldPosition(new THREE.Vector3());
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        new THREE.Vector3().subVectors(camera.position, controls.target).normalize(),
        controls.target
    );
    const hit = new THREE.Vector3();
    raycaster.setFromCamera(lastMouseNDC, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) return hit.clone();
    return controls.target.clone();
}

function applyInertialZoom() {
    if (!scrollZoomEnabled || isTweening || focused) {
        zoomVel = 0;
        zoomAnchor = null;
        return;
    }
    if (Math.abs(zoomVel) < 0.00001) {
        zoomAnchor = null;
        return;
    }
    zoomingFrames++;

    const mix = THREE.MathUtils.clamp(zoomingFrames / 20, 0, 1);
    controls.rotateSpeed = THREE.MathUtils.lerp(0.45, 0.22, mix);
    controls.panSpeed = THREE.MathUtils.lerp(0.50, 0.30, mix);

    const currentDist = camera.position.distanceTo(controls.target);
    const desiredDist = THREE.MathUtils.clamp(currentDist * (1 - zoomVel), MIN_DIST, MAX_DIST);

    if (zoomAnchor) {
        const pull = THREE.MathUtils.clamp(ZOOM_PULL_BASE + Math.abs(zoomVel) * 0.35, 0, ZOOM_PULL_MAX);
        controls.target.lerp(zoomAnchor, pull);
    }

    const viewDir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    const smoothed = THREE.MathUtils.lerp(currentDist, desiredDist, 0.18);
    camera.position.copy(controls.target).addScaledVector(viewDir, smoothed);

    zoomVel *= 0.86;
    if (Math.abs(zoomVel) < 0.00001) {
        zoomVel = 0;
        controls.rotateSpeed = controls.mouseButtons.LEFT === THREE.MOUSE.PAN ? 0.45 : -0.45;
        controls.panSpeed = 0.50;
    }
}

function animate(now = 0) {
    requestAnimationFrame(animate);

    for (let i = 0; i < planes.length; i++) {
        const p = planes[i];
        p.quaternion.copy(camera.quaternion);
        if (p !== focused) {
            const ax = Math.sin(now * 0.0012 + i * 1.7) * 0.06;
            const ay = Math.cos(now * 0.0010 + i * 1.3) * 0.06;
            p.rotateX(ax * 0.02);
            p.rotateY(ay * 0.02);
        }
    }

    const dist = camera.position.distanceTo(controls.target);
    const norm = THREE.MathUtils.clamp((dist - MIN_DIST) / (MAX_DIST - MIN_DIST), 0, 1);
    controls.dampingFactor = THREE.MathUtils.lerp(0.16, 0.06, norm);

    applyInertialZoom();

    if (!isTweening && !focused) {
        const s = (zoomVel === 0) ? -0.04 : -0.015;
        const desired = controls.target.clone().multiplyScalar(s);
        cloud.position.lerp(desired, 0.08);
    } else {
        cloud.position.lerp(new THREE.Vector3(0, 0, 0), 0.12);
    }

    if (!isTweening) keepSpritesAway();

    raycaster.setFromCamera(mouseNDC, camera);
    const hit = raycaster.intersectObjects(planes, false)[0]?.object || null;

    if (hit !== hoveredMesh) {
        hoveredMesh = hit;
        if (hoveredMesh) {
            const text = hoveredMesh.userData.cursorLabel;
            renderer.domElement.setAttribute('data-cursor-label', text);
            renderer.domElement.setAttribute('data-cursor-icon', 'bi-fullscreen');
        } else {
            renderer.domElement.removeAttribute('data-cursor-label');
            renderer.domElement.removeAttribute('data-cursor-icon');
        }
    }

    controls.update();

    if (focused && !isTweening) {
        requestAnimationFrame(() => positionHdButtonAtImageBottomCenter(focused, 50));
    }

    sortPlanesByDepth();

    renderer.render(scene, camera);
}

animate();

function debounce(fn, ms = 120) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
const onResize = () => {
    const { w, h } = getSize();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    if (!focused) {
        setCameraDistance(MAX_DIST - 0.001);
    } else if (!isTweening) {
        const endTarget = focused.getWorldPosition(new THREE.Vector3());
        const margin = Math.round(Math.min(w, h) * 0.06);
        const fitDist = fitDistanceForMesh(focused, margin);
        const viewDir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        camera.position.copy(endTarget).addScaledVector(viewDir, fitDist);
        controls.target.copy(endTarget);

        recenterFocusedMeshOnScreen(focused);

        positionHdButtonAtImageBottomCenter(focused, 50);
    }
};
new ResizeObserver(debounce(onResize, 120)).observe(mount);
window.addEventListener('resize', debounce(onResize, 120));
onResize();

addEventListener('keydown', e => { if (e.key === 'Escape') unfocus(); });

window.addEventListener('scroll', () => { if (focused && !isTweening) unfocus(); }, { passive: true });
window.addEventListener('wheel', () => { if (focused && !isTweening) unfocus(); }, { passive: true });
