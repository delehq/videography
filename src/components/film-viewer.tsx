'use client';
import {mediaUrl} from '@/lib/brand';

import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Volume2,VolumeX,X} from 'lucide-react';

export function FilmViewer({project,onClose}:{project:{title:string;film:string};onClose:()=>void}) {
  const root=useRef<HTMLDivElement>(null);
  const [muted,setMuted]=useState(true);
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement;
    const overflow=document.body.style.overflow;
    const background=[...document.querySelectorAll<HTMLElement>('#main,.site-header,.footer')];
    background.forEach(el=>el.inert=true);document.body.style.overflow='hidden';
    root.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return()=>{background.forEach(el=>el.inert=false);document.body.style.overflow=overflow;previous?.focus();};
  },[]);
  return createPortal(<div ref={root} className="film-modal" role="dialog" aria-modal="true" aria-label={`${project.title} film`} onKeyDown={event=>{
    if(event.key==='Escape')onClose();
    if(event.key==='Tab'){
      const items=[...root.current!.querySelectorAll<HTMLElement>('button,video[controls]')];
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  }}>
    <button className="modal-close" onClick={onClose} aria-label="Close film"><X/></button>
    <video src={mediaUrl(project.film)} autoPlay controls muted={muted} playsInline tabIndex={0}/>
    <button onClick={()=>setMuted(!muted)}>{muted?<VolumeX/>:<Volume2/>}{muted?'Unmute':'Mute'}</button>
  </div>,document.body);
}
