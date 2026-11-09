"use client";
import {useEffect,useRef,useState} from 'react';
import {useSiteContent} from './site-content';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
const images=['cloud2.jpg','cloud17.jpg','commercial.jpg','cloud39.jpg','cloud27.jpg','wedding3.jpg','cloud9.jpg','cloud5.jpg','commercial2.jpg','wedding2.jpg','cloud20.jpg','cloud22.jpg','cloud30.jpg','wedding.jpg'];
type Plane=THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
export function CloudCanvas({onOpen}:{onOpen:(index:number,origin:DOMRect)=>void}){
 const content=useSiteContent();const media=content.media;
 const mount=useRef<HTMLDivElement>(null),hd=useRef<HTMLButtonElement>(null),open=useRef(onOpen);open.current=onOpen;
 const [available,setAvailable]=useState(false),[nearby,setNearby]=useState(false),[reduced,setReduced]=useState(false),[focusedIndex,setFocusedIndex]=useState<number|null>(null);
 useEffect(()=>{const preference=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(preference.matches);update();preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update)},[]);
 useEffect(()=>{const el=mount.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setNearby(true);observer.disconnect()}},{rootMargin:'200px'});observer.observe(el);return()=>observer.disconnect()},[]);
 useEffect(()=>{
  const el=mount.current;if(!el||!nearby||reduced||matchMedia('(prefers-reduced-motion: reduce)').matches){setAvailable(false);return;}
  const compact=matchMedia('(max-width: 991px), (pointer: coarse)').matches;
  let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:!compact,alpha:true,powerPreference:compact?'low-power':'default'})}catch{return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1:1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x0d0d0d,1200,3500);
  const camera=new THREE.PerspectiveCamera(60,1,.1,6000);camera.position.z=900;
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.enableZoom=false;controls.screenSpacePanning=true;controls.mouseButtons={LEFT:THREE.MOUSE.PAN,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.ROTATE};controls.touches={ONE:THREE.TOUCH.PAN,TWO:THREE.TOUCH.DOLLY_ROTATE};
  // A vertical swipe must still scroll the page; horizontal drags explore the cloud.
  renderer.domElement.style.touchAction='pan-y pinch-zoom';
  const textures:THREE.Texture[]=[],planes:Plane[]=[],loader=new THREE.TextureLoader();let alive=true;
  images.forEach((image,i)=>{const matching:Plane[]=[];for(let j=0;j<(compact?1:2);j++){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide}));const angle=(i*2+j)*2.39996,r=300+(i*71+j*121)%700;mesh.position.set(Math.cos(angle)*r,Math.sin(angle)*r*.85,-600+(i*97+j*31)%1000);mesh.scale.set(180,120,1);mesh.userData.index=i;matching.push(mesh);planes.push(mesh);scene.add(mesh)}loader.load(media['/media/'+image]||'/media/'+image,tex=>{if(!alive){tex.dispose();return}tex.colorSpace=THREE.SRGBColorSpace;setAvailable(true);textures.push(tex);matching.forEach(mesh=>{mesh.material.map=tex;mesh.material.needsUpdate=true;mesh.scale.set(140*tex.image.width/tex.image.height,140,1)})})});
  let focused:Plane|null=null,saved:{camera:THREE.Vector3;target:THREE.Vector3;scale:THREE.Vector3;depthTest:boolean;order:number}|null=null,busy=false;
  let animation:gsap.core.Timeline|undefined;
  function bounds(mesh:Plane){camera.updateMatrixWorld();mesh.updateWorldMatrix(true,false);const r=el!.getBoundingClientRect(),corners=[[-.5,-.5],[-.5,.5],[.5,-.5],[.5,.5]].map(([x,y])=>new THREE.Vector3(x,y,0).applyMatrix4(mesh.matrixWorld).project(camera));const xs=corners.map(p=>r.left+(p.x+1)*r.width/2),ys=corners.map(p=>r.top+(1-p.y)*r.height/2);return new DOMRect(Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))}
  function unfocus(){if(!focused||!saved||busy)return;busy=true;setFocusedIndex(null);const mesh=focused,state=saved;animation=gsap.timeline({onComplete:()=>{mesh.material.depthTest=state.depthTest;mesh.renderOrder=state.order;focused=null;saved=null;busy=false;controls.enabled=true;controls.enableDamping=true}}).to(camera.position,{x:state.camera.x,y:state.camera.y,z:state.camera.z,duration:.56,ease:'power2.inOut'},0).to(controls.target,{x:state.target.x,y:state.target.y,z:state.target.z,duration:.56,ease:'power2.inOut'},0).to(mesh.scale,{x:state.scale.x,y:state.scale.y,z:state.scale.z,duration:.56,ease:'power2.inOut'},0)}
  function focus(mesh:Plane){if(busy)return;if(focused){unfocus();return}saved={camera:camera.position.clone(),target:controls.target.clone(),scale:mesh.scale.clone(),depthTest:mesh.material.depthTest,order:mesh.renderOrder};focused=mesh;busy=true;controls.enabled=false;controls.enableDamping=false;mesh.material.depthTest=false;mesh.renderOrder=9999;
   const r=el!.getBoundingClientRect(),margin=Math.min(r.width,r.height)*.06,usableW=r.width>=992?.46:1-2*margin/r.width,usableH=1-2*margin/r.height,tan=Math.tan(THREE.MathUtils.degToRad(camera.fov)/2);
   const distance=Math.max(mesh.scale.y/(2*tan*usableH),mesh.scale.x/(2*tan*camera.aspect*usableW));const target=mesh.getWorldPosition(new THREE.Vector3()),direction=camera.position.clone().sub(controls.target).normalize(),destination=target.clone().addScaledVector(direction,distance);const pop=matchMedia('(pointer:fine)').matches?1.02:1;
   animation=gsap.timeline({onComplete:()=>{busy=false;setFocusedIndex(mesh.userData.index)}}).to(camera.position,{x:destination.x,y:destination.y,z:destination.z,duration:.65,ease:'power2.inOut'},0).to(controls.target,{x:target.x,y:target.y,z:target.z,duration:.65,ease:'power2.inOut'},0).to(mesh.scale,{x:mesh.scale.x*pop,y:mesh.scale.y*pop,duration:.65,ease:'power2.inOut'},0);
  }
  const resize=new ResizeObserver(()=>{const{width,height}=el.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()});resize.observe(el);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down={x:0,y:0};
  const pd=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY}},pu=(e:PointerEvent)=>{if(busy||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const r=el.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(planes)[0];if(hit)focus(hit.object as Plane);else unfocus()};
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!document.querySelector('.project-media-viewer'))unfocus()};
  const full=()=>{if(focused&&!busy)open.current(focused.userData.index,bounds(focused))};
  el.addEventListener('pointerdown',pd);el.addEventListener('pointerup',pu);window.addEventListener('keydown',escape);const hdButton=hd.current;hdButton?.addEventListener('click',full);
  let active=false;const io=new IntersectionObserver(([e])=>active=e.isIntersecting);io.observe(el);
  renderer.setAnimationLoop(()=>{if(!active||document.hidden)return;if(!focused)controls.target.clampScalar(-900,900);controls.update();planes.forEach(p=>p.quaternion.copy(camera.quaternion));renderer.render(scene,camera);if(focused&&hd.current){const r=bounds(focused),parent=el.getBoundingClientRect();hd.current.style.left=(r.left+r.width/2-parent.left)+'px'}});
  return()=>{alive=false;animation?.kill();io.disconnect();resize.disconnect();el.removeEventListener('pointerdown',pd);el.removeEventListener('pointerup',pu);window.removeEventListener('keydown',escape);hdButton?.removeEventListener('click',full);renderer.setAnimationLoop(null);controls.dispose();planes.forEach(p=>{p.geometry.dispose();p.material.dispose()});textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();setAvailable(false);setFocusedIndex(null)};
 },[media,nearby,reduced]);
 return <><div className={`webgl-cloud ${available?'ready':''}`} ref={mount} aria-hidden="true" data-focused={focusedIndex!==null}/><button ref={hd} className="cloud-hd" aria-label="Open focused photograph fullscreen" hidden={focusedIndex===null}>HD</button></>
}
