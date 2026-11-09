'use client';
import {mediaUrl} from '@/lib/brand';
import {useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
export function ImageViewer({image,title,onClose}:{image:string;title:string;onClose:()=>void}){
 const close=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const focus=document.activeElement as HTMLElement;const overflow=document.body.style.overflow;const background=[...document.querySelectorAll<HTMLElement>('#main,.site-header')];background.forEach(e=>e.inert=true);document.body.style.overflow='hidden';close.current?.focus();return()=>{background.forEach(e=>e.inert=false);document.body.style.overflow=overflow;focus?.focus()};},[]);
 return createPortal(<div className="image-viewer" role="dialog" aria-modal="true" aria-label={`${title} photograph`} onClick={onClose} onKeyDown={e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){e.preventDefault();close.current?.focus()}}}><button ref={close} aria-label="Close photograph" onClick={onClose}><X/></button><img src={mediaUrl(image)} alt={title} onClick={e=>e.stopPropagation()}/></div>,document.body);
}
