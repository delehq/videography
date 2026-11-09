'use client';
import {useState} from 'react';
import {SiteImage,useSiteProjects,useManagedMedia,useSiteContent} from './site-content';
import {Maximize,Play} from 'lucide-react';
import {getProject,mediaUrl} from '@/lib/brand';
import {ProjectMediaViewer,type ProjectMedia} from './project-media-viewer';
export function ReferenceProject({slug}:{slug:string}){
 const content=useSiteContent();const rows=useSiteProjects();const original=getProject(slug);const p=rows.find(p=>p.slug===(original?.slug||slug));const [viewer,setViewer]=useState<{items:ProjectMedia[];initial:number;origin:DOMRect}|null>(null);
 if(!p)return <div className="page-wrap"><h1>Project unavailable</h1><p>This project is not currently published.</p><a href="/works">Browse works</a></div>;
 const hero={kind:/\.(mp4|webm)($|\?)/.test(p.heroImage)?'video':'image',src:p.heroImage||p.image};const intro={kind:p.introKind,src:p.introKind==='video'?p.film:p.introImage||p.image};
 function open(items:ProjectMedia[],initial:number,element:HTMLElement){setViewer({items,initial,origin:element.getBoundingClientRect()})}
 return <div className="reference-stack project-stack">
 <section className="project-detail scroll-panel"><div className="panel-surface">{hero.kind==='video'?<video className="project-hero-film" src={mediaUrl(content.media[hero.src]||content.media[mediaUrl(hero.src)]||hero.src)} poster={mediaUrl(p.image)} autoPlay muted loop playsInline/>:<SiteImage src={mediaUrl(content.media[hero.src]||content.media[mediaUrl(hero.src)]||hero.src)} alt={p.title}/>}<div className="project-hero-overlay"><h1 className="sr-only">{p.title}</h1><button className="project-fullscreen" aria-label={`Fullscreen ${hero.kind==='video'?'film':'photograph'}`} onClick={e=>open([hero],0,e.currentTarget.closest('.project-detail')!)}><Maximize size={20}/></button></div></div></section>
 <section className="project-intro-panel scroll-panel"><div className="panel-surface project-intro-grid"><div><h2>{p.title}</h2><div className="project-meta">{p.referenceMeta.map((text,i)=><div key={i}>{text.replace(/\\\s*/,'\\ ')}</div>)}</div><button className="project-intro-media" aria-label={intro.kind==='video'?'Watch film':'View photograph'} onClick={e=>open([intro],0,e.currentTarget)}><SiteImage src={mediaUrl(p.introImage||p.image)} alt={p.title}/>{intro.kind==='video'&&<span className="project-play"><Play size={20} fill="currentColor"/></span>}</button></div><div className="project-description">{p.description&&<p>{p.description}</p>}</div></div></section>
 {p.gallery.length>0&&<><div className="light-interlude scroll-panel" aria-hidden="true"><div className="panel-surface"/></div><section className="project-gallery-panel scroll-panel"><div className="panel-surface project-gallery">{p.gallery.map((m,i)=><button key={m.src} aria-label={`Open ${p.title} photograph ${i+1}`} onClick={e=>open(p.gallery,i,e.currentTarget)}>{m.kind==='image'?<SiteImage src={mediaUrl(m.src)} alt={`${p.title} — photograph ${i+1}`} loading="lazy"/>:<video src={mediaUrl(m.src)} muted playsInline preload="metadata"/>}</button>)}</div></section></>}
 <div className="light-interlude scroll-panel" aria-hidden="true"><div className="panel-surface"/></div>
 {viewer&&<ProjectMediaViewer {...viewer} title={p.title} onClose={()=>setViewer(null)}/>}
 </div>
}
