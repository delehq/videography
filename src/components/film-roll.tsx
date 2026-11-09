'use client';

import Link from 'next/link';
import {useEffect, useRef,useMemo} from 'react';
import * as THREE from 'three';
import {SiteImage,useSiteProjects,useProjectPlacement} from './site-content';

// The source uses alternating 16:9 frames with contained portrait/landscape media.
const vertex = `varying vec2 vUv; uniform float uStrength;
void main(){vUv=uv;vec3 p=position;float bell=4.0*uv.y*(1.0-uv.y);
p.z+=bell*abs(uStrength)*35.0;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`;
const fragment = `varying vec2 vUv;uniform sampler2D uMap;uniform float uStrength;
vec2 barrel(vec2 uv,float a){vec2 c=uv-.5;return uv+c*dot(c,c)*a;}
void main(){float s=abs(uStrength);float m=mix(.003,.020,s);
vec2 r=clamp(barrel(vUv+vec2(s*.012,0.),s*.08),vec2(m),vec2(1.-m));
vec2 g=clamp(barrel(vUv,s*.08),vec2(m),vec2(1.-m));
vec2 b=clamp(barrel(vUv-vec2(s*.012,0.),s*.08),vec2(m),vec2(1.-m));
gl_FragColor=vec4(texture2D(uMap,r).r,texture2D(uMap,g).g,texture2D(uMap,b).b,1.);}`;

export function FilmRoll() {
 const left=useProjectPlacement('footerLeft'),right=useProjectPlacement('footerRight');const columns=useMemo(()=>[left,right],[left,right]);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    const section = el?.closest<HTMLElement>('.footer');
    if (!el || !section) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;
    const tracks = [...el.querySelectorAll<HTMLElement>('.film-track')];
    let target = 0, current = 0, reverseTravel = 0, released = false;
    let active = false, alive = true, frame = 0, touchY = 0;
    let dragging = false, lastY = 0, dragDistance = 0;
    let width = 1, height = 1;
    const previousTabIndex = section.getAttribute('tabindex');
    section.tabIndex = -1;

    let renderer: THREE.WebGLRenderer | null = null;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, .1, 4000);
    camera.position.z = 1000;
    const textures: THREE.Texture[] = [];
    type Tile = {link: HTMLElement; image: HTMLImageElement; mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>};
    const tiles: Tile[] = [];
    try {
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.domElement.className = 'film-roll-canvas';
      renderer.domElement.setAttribute('aria-hidden', 'true');
      el.appendChild(renderer.domElement);
      const loader = new THREE.TextureLoader();
      el.querySelectorAll<HTMLElement>('.film-frame').forEach(link => {
        const image = link.querySelector<HTMLImageElement>('img')!;
        const material = new THREE.ShaderMaterial({uniforms: {uMap: {value: null}, uStrength: {value: 0}}, vertexShader: vertex, fragmentShader: fragment});
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 16, 24), material);
        mesh.visible = false;
        scene.add(mesh);
        tiles.push({link, image, mesh});

      });
      const bySource = new Map<string, Tile[]>();
      tiles.forEach(tile=>bySource.set(tile.image.src,[...(bySource.get(tile.image.src)||[]),tile]));
      bySource.forEach((matching,src)=>loader.load(src,texture=>{
        if(!alive){texture.dispose();return;}
        textures.push(texture);
        matching.forEach(({mesh})=>{mesh.material.uniforms.uMap.value=texture;mesh.userData.loaded=true;});
      }));
      renderer.domElement.addEventListener('webglcontextlost',event=>{
        event.preventDefault();
        if(renderer)renderer.domElement.style.display='none';
        tiles.forEach(({image})=>{image.style.opacity='1';});
        active=false;
      });
    } catch {
      renderer?.dispose();
      renderer = null;
    }
    function resize() {
      const rect = el!.getBoundingClientRect();
      width = rect.width; height = rect.height;
      renderer?.setSize(width, height);
      camera.fov = 2 * Math.atan(height / 2000) * 180 / Math.PI;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);ro.observe(el);resize();
    const io = new IntersectionObserver(([entry]) => {active = entry.isIntersecting;});io.observe(el);

    function terminal() {
      const rect = section!.getBoundingClientRect();
      return el!.getClientRects().length > 0 && rect.top <= 2 && rect.bottom >= innerHeight - 3 && rect.top > -innerHeight * .2;
    }
    function acceptsInput(event: Event) {
      return !document.querySelector('.menu-panel.is-open, .film-modal') &&
        !(event.target as HTMLElement)?.closest('input,textarea,select,[contenteditable=true]');
    }
    function consume(delta: number, multiplier = .30) {
      if (delta > 0) {
        reverseTravel = 0; released = false;target += delta * multiplier;return true;
      }
      if (released) return false;
      reverseTravel += Math.abs(delta);target += delta * multiplier;
      // A short reverse movement before the document is released, as requested.
      if (reverseTravel >= Math.min(220, innerHeight * .22)) released = true;
      return true;
    }
    const wheel = (event: WheelEvent) => {
      if (!terminal() || !acceptsInput(event) || event.ctrlKey) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (consume(delta)) {event.preventDefault();event.stopPropagation();}
    };
    const touchStart = (event: TouchEvent) => {touchY = event.touches[0]?.clientY || 0;};
    const touchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY || 0, delta = touchY - y;touchY = y;
      if (terminal() && acceptsInput(event) && event.touches.length === 1 && consume(delta, 1.3)) {
        event.preventDefault();event.stopPropagation();
      }
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;lastY = event.clientY;dragDistance = 0;
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = lastY - event.clientY;dragDistance += Math.abs(delta);lastY = event.clientY;
      target += delta * 1.3;
      if (dragDistance > 6) {event.preventDefault();el.classList.add('is-dragging');}
    };
    const up = () => {dragging = false;el.classList.remove('is-dragging');};
    const click = (event: MouseEvent) => {if (dragDistance > 6) {event.preventDefault();event.stopPropagation();}dragDistance = 0;};
    const key = (event: KeyboardEvent) => {
      if (!terminal() || !acceptsInput(event)) return;
      const focused = event.target as HTMLElement;
      if (focused.closest('button,summary,[role=button]') || (focused !== document.body && focused !== document.documentElement && !section.contains(focused))) return;
      const delta = event.key === 'ArrowDown' ? 80 : event.key === 'ArrowUp' ? -80 : event.key === 'PageDown' || event.key === ' ' && !event.shiftKey ? 400 : event.key === 'PageUp' || event.key === ' ' && event.shiftKey ? -400 : 0;
      if (delta && consume(delta)) event.preventDefault();
      if (event.key === 'Home' || event.key === 'Escape') {released = true;window.scrollTo({top: Math.max(0,scrollY-innerHeight),behavior:'smooth'});}
    };
    window.addEventListener('wheel', wheel, {passive: false, capture: true});
    window.addEventListener('touchstart', touchStart, {passive: true});
    window.addEventListener('touchmove', touchMove, {passive: false, capture: true});
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, {passive: false});
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    window.addEventListener('keydown', key);

    let lastTime = performance.now();
    function render(now: number) {
      frame = requestAnimationFrame(render);
      if (!active || document.hidden) {lastTime=now;return;}
      const dt = Math.min((now-lastTime)/16.667, 3);lastTime=now;
      current += (target-current) * (1-Math.pow(.93, dt));
      const velocity = target-current;
      const gate = THREE.MathUtils.smoothstep(Math.abs(velocity),90,600);
      const strength = Math.sign(velocity) * Math.min(.9,Math.abs(velocity)/600) * gate;
      tracks.forEach((track,index) => {
        const gap = parseFloat(getComputedStyle(track).rowGap) || 0;
        const unit = track.querySelector<HTMLElement>('.film-cycle')!;
        const period = unit.getBoundingClientRect().height + gap;
        const direction = index === 0 ? -1 : 1;
        const initialOffset = index === 0 ? 0 : period * .34;
        const y = ((current*direction+initialOffset)%period+period)%period-period;
        track.style.transform = `translate3d(0,${y}px,0)`;
        track.dataset.offset = String(y);
      });
      el!.dataset.scroll = current.toFixed(2);
      if (!renderer) return;
      const bounds = el!.getBoundingClientRect();
      tiles.forEach(({link,image,mesh}) => {
        const rect = link.getBoundingClientRect();
        mesh.visible = !!mesh.userData.loaded && rect.bottom > bounds.top && rect.top < bounds.bottom;
        if (!mesh.visible) return;
        const ratio = (image.naturalWidth || 1600)/(image.naturalHeight || 900);
        const w = Math.min(rect.width,rect.height*ratio), h = w/ratio;
        mesh.scale.set(w,h,1);
        mesh.position.set(rect.left-bounds.left+rect.width/2-width/2,height/2-(rect.top-bounds.top+rect.height/2),0);
        mesh.material.uniforms.uStrength.value = strength;
      });
      renderer.render(scene,camera);
      // Hide only successfully loaded DOM media. Anchors remain the actual hit targets.
      tiles.forEach(({image,mesh})=>{image.style.opacity=mesh.userData.loaded?'0':'1';});
    }
    frame=requestAnimationFrame(render);
    return () => {
      alive=false;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();
      window.removeEventListener('wheel',wheel,true);window.removeEventListener('touchstart',touchStart);
      window.removeEventListener('touchmove',touchMove,true);el.removeEventListener('pointerdown',down);
      window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);
      window.removeEventListener('pointercancel',up);el.removeEventListener('click',click,true);window.removeEventListener('keydown',key);
      tracks.forEach(t=>t.style.removeProperty('transform'));
      tiles.forEach(({image,mesh})=>{image.style.removeProperty('opacity');mesh.geometry.dispose();mesh.material.dispose();});
      textures.forEach(t=>t.dispose());renderer?.dispose();renderer?.domElement.remove();
      if(previousTabIndex===null)section.removeAttribute('tabindex');else section.setAttribute('tabindex',previousTabIndex);
    };
  }, [columns]);

  return <div className="film-roll" ref={root} aria-label="Explore films. Scroll or drag; select a film to view the project.">
    {columns.map((items,col)=><div className="film-column" key={col}><div className="film-track" data-direction={col===0?-1:1}>
      {[0,1,2].map(copy=><div className="film-cycle" key={copy} aria-hidden={copy!==1}>{items.map((project,i)=><Link
        className="film-frame" key={project.slug} href={`/work/${project.slug}`}
        aria-label={`View ${project.title}`} tabIndex={copy===1?0:-1} draggable={false}>
        <SiteImage src={project.image} alt={project.title} draggable={false}/>
      </Link>)}</div>)}
    </div></div>)}
  </div>;
}
