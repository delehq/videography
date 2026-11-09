'use client';

import Link from 'next/link';
import {useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {ArrowUpRight,X} from 'lucide-react';
import gsap from 'gsap';
import {projects,mediaUrl} from '@/lib/brand';

export type PreviewSelection={project:(typeof projects)[number];origin:{left:number;top:number;width:number;height:number};trigger:HTMLElement};
export function WorkPreview({selection,onClose}:{selection:PreviewSelection;onClose:()=>void}){
  const root=useRef<HTMLDivElement>(null);
  const media=useRef<HTMLDivElement>(null);
  const closing=useRef(false);
  const animation=useRef<gsap.core.Timeline|null>(null);
  const p=selection.project;
  const isImage=p.previewKind==='image';
  function close(){if(closing.current)return;closing.current=true;if(animation.current&&animation.current.progress()>0)animation.current.reverse();else onClose();}
  useEffect(()=>{
    const background=[...document.querySelectorAll<HTMLElement>('#main,.site-header,.footer')];
    const previousOverflow=document.body.style.overflow;
    background.forEach(el=>el.inert=true);document.body.style.overflow='hidden';
    root.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const destination=media.current!.getBoundingClientRect();
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tl=gsap.timeline({onReverseComplete:onClose});
    tl.fromTo(root.current!.querySelector('.work-preview-shade'),{backgroundColor:'rgba(0,0,0,0)',backdropFilter:'blur(0px)'},{backgroundColor:'rgba(0,0,0,.82)',backdropFilter:'blur(6px) saturate(115%)',duration:reduced?.1:.32},0)
      .fromTo(media.current,{x:selection.origin.left-destination.left,y:selection.origin.top-destination.top,scaleX:selection.origin.width/destination.width,scaleY:selection.origin.height/destination.height,transformOrigin:'0 0'},{x:0,y:0,scaleX:1,scaleY:1,duration:reduced?.1:.66,ease:'power2.inOut'},0)
      .fromTo(root.current!.querySelector('.work-preview-info'),{opacity:0,y:reduced?0:10},{opacity:1,y:0,duration:.25},reduced?0:.45);
    animation.current=tl;
    return()=>{tl.kill();background.forEach(el=>el.inert=false);document.body.style.overflow=previousOverflow;selection.trigger?.focus();};
  },[]);
  return createPortal(<div ref={root} className="work-preview" data-lenis-prevent role="dialog" aria-modal="true" aria-label={`${p.title} preview`} onKeyDown={e=>{
    if(e.key==='Escape')close();
    if(e.key==='Tab'){const items=[...root.current!.querySelectorAll<HTMLElement>('button,a')];const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  }}>
    <div className="work-preview-shade" onClick={close}/>
    <button className="work-preview-close" aria-label="Close preview" onClick={close}><X/></button>
    <div className="work-preview-stage"><div className="work-preview-media" ref={media}>{isImage?<img src={mediaUrl(p.image)} alt={p.title}/>:<video src={mediaUrl(p.previewSrc)} poster={mediaUrl(p.image)} autoPlay muted loop playsInline/>}</div>
      <div className="work-preview-info"><span>{p.category}</span><h2>{p.title}</h2><p>{p.description}</p><Link href={`/work/${p.slug}`}>View project <ArrowUpRight size={16}/></Link></div>
    </div>
  </div>,document.body);
}
