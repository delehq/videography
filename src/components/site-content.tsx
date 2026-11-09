'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {contentKey,defaultContent,localRead,type SiteContent} from '@/lib/site-content';
import {mediaUrl} from '@/lib/brand';
const Context=createContext(defaultContent);
export function SiteContentProvider({children,initialContent=defaultContent}:{children:React.ReactNode;initialContent?:SiteContent}){const [content,setContent]=useState(initialContent);useEffect(()=>{async function read(){if(!process.env.NEXT_PUBLIC_SUPABASE_URL){setContent(localRead(contentKey,defaultContent));return}try{const r=await fetch('/api/site-content',{cache:'no-store'});if(r.ok)setContent((await r.json()).content)}catch{}}read();window.addEventListener('storage',read);window.addEventListener('john:content-published',read);return()=>{window.removeEventListener('storage',read);window.removeEventListener('john:content-published',read)}},[]);return <Context.Provider value={content}>{children}</Context.Provider>}
export function useSiteContent(){return useContext(Context)}
export function useSiteProjects(){const content=useSiteContent();return useMemo(()=>content.projects.filter(p=>p.published!==false),[content.projects])}
export function SiteText({id,fallback}:{id:string;fallback:string}){const c=useSiteContent();let text=c.copy[id]??fallback;if(c.settings.name!=='John')text=text.replace(/John/g,c.settings.name).replace(/JOHN/g,c.settings.name.toUpperCase());return <>{text}</>}
export function useManagedMedia(src:string|undefined){const c=useSiteContent();return src?(c.media[src]||c.media[mediaUrl(src)]||src):src}
export function SiteImage(props:React.ImgHTMLAttributes<HTMLImageElement>){const src=useManagedMedia(typeof props.src==='string'?props.src:undefined);return <img {...props} src={src?mediaUrl(src):undefined}/>}

export function useProjectPlacement(key:string){const content=useSiteContent();const projects=useSiteProjects();return useMemo(()=>{const slugs=(content.placements||defaultContent.placements)?.[key];return slugs?slugs.map(slug=>projects.find(p=>p.slug===slug)).filter((p):p is NonNullable<typeof p>=>!!p):projects},[content.placements,projects,key])}
