'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeft,ArrowRight,X} from 'lucide-react';
import gsap from 'gsap';
import {useSiteContent} from './site-content';
import {mediaUrl} from '@/lib/brand';
export type ProjectMedia={kind:string;src:string};
export function ProjectMediaViewer({items,initial,title,origin,onClose}:{items:ProjectMedia[];initial:number;title:string;origin:DOMRect;onClose:()=>void}){
 const [index,setIndex]=useState(initial);const root=useRef<HTMLDivElement>(null);const picture=useRef<HTMLDivElement>(null);const timeline=useRef<gsap.core.Timeline|null>(null);const shutting=useRef(false);const touch=useRef(0);
 const content=useSiteContent();const original=items[index];const current={...original,src:content.media[original.src]||content.media[mediaUrl(original.src)]||original.src};
 function close(){if(shutting.current)return;shutting.current=true;const tl=timeline.current;if(tl&&tl.progress()>0)tl.reverse();else onClose()}
 function next(step:number){setIndex(i=>(i+step+items.length)%items.length)}
 useEffect(()=>{const focus=document.activeElement as HTMLElement;const overflow=document.body.style.overflow;const background=[...document.querySelectorAll<HTMLElement>('#main,.site-header,.footer')];background.forEach(e=>e.inert=true);document.body.style.overflow='hidden';root.current?.querySelector<HTMLButtonElement>('button')?.focus();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const compact=matchMedia('(max-width: 991px), (pointer: coarse)').matches;const end=picture.current!.getBoundingClientRect();const tl=gsap.timeline({onReverseComplete:onClose});tl.fromTo(root.current,{backgroundColor:'rgba(0,0,0,0)',backdropFilter:'blur(0px)'},{backgroundColor:'rgba(0,0,0,.96)',backdropFilter:compact?'none':'blur(6px) saturate(115%)',duration:reduced?.1:compact?.2:.48},reduced||compact?0:.52).fromTo(picture.current,{x:origin.left-end.left,y:origin.top-end.top,scaleX:origin.width/end.width,scaleY:origin.height/end.height,opacity:.55,transformOrigin:'0 0'},{x:0,y:0,scaleX:1,scaleY:1,opacity:1,duration:reduced?.1:compact?.28:.78,ease:'power3.inOut'},reduced?0:.06);timeline.current=tl;return()=>{tl.kill();background.forEach(e=>e.inert=false);document.body.style.overflow=overflow;focus?.focus()}},[]);
 return createPortal(<div ref={root} className="project-media-viewer" data-lenis-prevent role="dialog" aria-modal="true" aria-label={`${title} ${current.kind==='video'?'film':'photograph'}`} onKeyDown={e=>{if(e.key==='Escape')close();if(e.key==='ArrowRight'&&items.length>1)next(1);if(e.key==='ArrowLeft'&&items.length>1)next(-1);if(e.key==='Tab'){const nodes=[...root.current!.querySelectorAll<HTMLElement>('button,video[controls]')];const a=nodes[0],z=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}}>
 <button className="project-viewer-close" aria-label="Close media" onClick={close}><X/></button>
 <div className="project-viewer-picture" ref={picture} onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touch.current;if(items.length>1&&Math.abs(delta)>60)next(delta<0?1:-1)}}>{current.kind==='video'?<video key={current.src} src={mediaUrl(current.src)} autoPlay controls playsInline tabIndex={0}/>:<img key={current.src} src={mediaUrl(current.src)} alt={`${title}${items.length>1?` — photograph ${index+1}`:''}`} draggable={false}/>}</div>
 {items.length>1&&<div className="project-viewer-navigation"><button onClick={()=>next(-1)} aria-label="Previous photograph"><ArrowLeft/></button><span aria-live="polite">{index+1} / {items.length}</span><button onClick={()=>next(1)} aria-label="Next photograph"><ArrowRight/></button></div>}
 </div>,document.body)
}
