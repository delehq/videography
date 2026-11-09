'use client';

import Link from 'next/link';
import {SiteText,SiteImage,useSiteContent,useSiteProjects,useProjectPlacement} from './site-content';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Maximize,Play} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Film,WorkBoard} from './portfolio';
import {projects,referenceMedia,mediaUrl} from '@/lib/brand';
import {ProjectMediaViewer} from './project-media-viewer';
import {ColorMedia} from './color-media';

function ServiceRoll({wedding}:{wedding:boolean}) {
  const section=useRef<HTMLElement>(null);
  const spacer=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const el=section.current!;
    const viewport=el.querySelector<HTMLElement>('.service-roll-viewport')!;
    const track=el.querySelector<HTMLElement>('.service-roll-track')!;
    gsap.registerPlugin(ScrollTrigger);
    const distance=()=>Math.max(0,track.scrollHeight-viewport.clientHeight);
    // Reserve roll travel in normal document flow before the shared panel
    // controller measures its transitions. Automatic pin spacing shifts those
    // later triggers again during refresh and makes the two controllers drift.
    const syncSpace=()=>{if(spacer.current)spacer.current.style.height=`${distance()+1}px`};
    syncSpace();
    ScrollTrigger.addEventListener('refreshInit',syncSpace);
    const ctx=gsap.context(()=>gsap.to(track,{
      y:()=>-distance(),ease:'none',scrollTrigger:{
        id:'service-film-roll',trigger:el,start:'top top',end:()=>`+=${Math.max(1,distance())}`,
        pin:true,pinSpacing:false,scrub:true,anticipatePin:1,invalidateOnRefresh:true,
      },
    }));
    let alive=true,timer=0;
    const resize=new ResizeObserver(()=>{clearTimeout(timer);timer=window.setTimeout(()=>{if(alive){syncSpace();ScrollTrigger.refresh()}},60)});
    resize.observe(track);resize.observe(viewport);
    document.fonts.ready.then(()=>{if(alive){syncSpace();ScrollTrigger.refresh()}});
    return()=>{alive=false;resize.disconnect();clearTimeout(timer);ScrollTrigger.removeEventListener('refreshInit',syncSpace);ctx.revert();};
  },[]);
  const frames=(wedding?['wed3.jpg','9.jpg','15.jpg']:['comm1.jpg','comm2.jpg']).map(f=>referenceMedia('/assets/images/used/opti/'+f));
  return <><section ref={section} className="service-roll scroll-panel" data-custom-pin><div className="panel-surface reference-two-col">
    <div className="service-roll-viewport"><div className="service-roll-track">
      <Film src={wedding?'https://thomasmamfredas.com/assets/videos/2mp4.mp4':'https://thomasmamfredas.com/assets/videos/comm2.webm'} poster={frames[0]}/>
      {frames.map((image)=><ColorMedia className="roll-still" key={image} label={wedding?'wedding moment':'commercial still'}><SiteImage src={mediaUrl(image)} alt={wedding?'Wedding moment':'Commercial still'} loading="lazy"/></ColorMedia>)}
      {!wedding&&<Film src="https://thomasmamfredas.com/assets/videos/comm3.webm"/>}
      <Film src={wedding?'https://thomasmamfredas.com/assets/videos/3mp4.mp4':'https://thomasmamfredas.com/assets/videos/half.webm'}/>
    </div></div>
    <div className="reference-copy service-roll-copy"><span className="reference-label">{wedding?'Weddings':'Commercial'}</span><h2><SiteText id="reference-pages.1.the" fallback="THE"/><br/><SiteText id="reference-pages.2.art-of" fallback="ART OF"/><br/>{wedding?'PRESENCE':'ATTENTION'}</h2><p><SiteText id={"service.3"+(wedding?'.wedding':'.commercial')} fallback={wedding?'A quiet approach to the moments that matter. I follow the day as it unfolds: the anticipation, the connection, and the little details you might otherwise miss. A film that brings you back to how it felt.':'A considered perspective on your business. From the people behind the experience to the details that make it yours, every frame has a part to play in telling your story.'}/></p><Link className="text-link service-inquiry" href={`/book?service=${wedding?'Weddings':'Commercial'}`}><Play size={10} fill="currentColor"/> <SiteText id="reference-pages.3.inquire-availability" fallback="Book this service"/></Link></div>
  </div></section><div ref={spacer} className="service-roll-space" aria-hidden="true"/></>;
}

export function ReferenceService({type}:{type:'Weddings'|'Commercial'}) {
  const wedding=type==='Weddings';
  const [fullscreen,setFullscreen]=useState<DOMRect|null>(null);
  const heroSrc=wedding?'wedding-hero.mp4':'https://thomasmamfredas.com/assets/videos/commercial.mp4';
  return <div className="reference-stack">
    <section className="service-hero scroll-panel"><div className="panel-surface">
      <Film src={heroSrc} poster={wedding?'wedding-hero.jpg':'commercial.jpg'}/>
      <div className="service-hero-shade"/><div className="service-hero-content"><h1>{type}</h1><p><SiteText id={"service.5"+(wedding?'.wedding':'.commercial')} fallback={wedding?'A wedding is a story of connection, emotion, and moments that pass in an instant. Honest, cinematic films made to bring you back.':'The people, places, and details behind a brand. Films that capture atmosphere and give your audience a reason to feel connected.'}/></p><div className="service-booking-links"><Link href={`/book?service=${type}`}>Book {wedding?'your wedding':'a project'} <ArrowUpRight size={18}/></Link><Link href={`/pricing#${type.toLowerCase()}`}>View pricing</Link></div></div>
    <button className="service-fullscreen" aria-label="Fullscreen film" onClick={e=>setFullscreen(e.currentTarget.closest('.service-hero')!.getBoundingClientRect())}><Maximize size={24}/></button></div></section>
    <div className="film-interlude scroll-panel" aria-hidden="true"><div className="panel-surface"/></div>
    <ServiceRoll wedding={wedding}/><WorkBoard category={type}/>
    <div className="light-interlude scroll-panel" aria-hidden="true"><div className="panel-surface"/></div>
    {fullscreen&&<ProjectMediaViewer items={[{kind:'video',src:heroSrc}]} initial={0} title={type} origin={fullscreen} onClose={()=>setFullscreen(null)}/>}
  </div>;
}

export function ReferenceStories(){const projects=useProjectPlacement('stories');return <div className="reference-stack stories-stack"><h1 className="sr-only"><SiteText id="reference-pages.4.stories" fallback="Stories"/></h1>{projects.map((p,i)=><section className="story-panel scroll-panel" key={p.slug}><div className="panel-surface reference-two-col">
  <ColorMedia className="editorial-media" label={p.title}>{i===2?<Film src={p.film} poster={p.image}/>:<SiteImage src={mediaUrl(p.introImage||p.image)} alt={p.title}/>}</ColorMedia>
  <div className="reference-copy"><span className="reference-label"><SiteText id="reference-pages.5.stories" fallback="\\ Stories"/></span><Link href={`/work/${p.slug}`}><h2 className="story-title">{p.title.slice(0,Math.max(0,p.title.lastIndexOf(" ")))}{p.slug.startsWith("zakynthos")?<br/>:" "}<span className="story-title-tail">{p.title.slice(p.title.lastIndexOf(" ")+1)}<ArrowUpRight aria-hidden="true"/></span></h2></Link>{p.description&&<p>{p.description}</p>}</div>
</div></section>)}</div>}

export function ReferenceAbout(){return <div className="reference-stack contact-stack">
  <section className="story-panel scroll-panel"><div className="panel-surface reference-two-col"><ColorMedia className="editorial-media" label="About film"><Film src="https://thomasmamfredas.com/assets/videos/yiayia1.webm" poster={referenceMedia('/assets/uploads/media/2025/November/d074fb4835f3890eabb2e310b84ea3d4.jpg')}/></ColorMedia><div className="reference-copy"><span className="reference-label"><SiteText id="reference-pages.6.about" fallback="\\ About"/></span><h1><SiteText id="reference-pages.7.the-art" fallback="THE ART"/><br/><SiteText id="reference-pages.8.of-noticing" fallback="OF NOTICING"/></h1><p><SiteText id="reference-pages.9.im-john-a-filmmaker-and" fallback="I'm John, a filmmaker and photographer with an eye for the details that give a story its character. Wedding films, brand stories, and the moments in between, approached with care and a cinematic perspective. Space for the day to unfold, and attention to what makes it yours."/></p><p><SiteText id="reference-pages.10.from-a-wedding-morning-to" fallback="From a wedding morning to the atmosphere of a place, the smallest details can carry the strongest feeling. The light, the pauses, the gestures that pass quickly. A considered approach, with guidance when you need it and space to be yourself."/></p></div></div></section>
  <section className="story-panel scroll-panel"><div className="panel-surface reference-two-col"><ColorMedia className="editorial-media" label="Approach photograph"><SiteImage src={mediaUrl(referenceMedia('/assets/images/used/opti/2.jpg'))} alt="Approach - reference photograph"/></ColorMedia><div className="reference-copy"><span className="reference-label"><SiteText id="reference-pages.11.approach" fallback="\\ Approach"/></span><h2><SiteText id="reference-pages.12.process" fallback="PROCESS"/></h2><p><strong><SiteText id="reference-pages.13.discovery" fallback="Discovery"/></strong> <SiteText id="reference-pages.14.your-idea-audience-and-references" fallback="— your idea, audience, and references."/><br/><strong><SiteText id="reference-pages.15.plan" fallback="Plan"/></strong> <SiteText id="reference-pages.16.scope-location-and-schedule" fallback="— scope, location, and schedule."/><br/><strong><SiteText id="reference-pages.17.production" fallback="Production"/></strong> <SiteText id="reference-pages.18.filming-the-story" fallback="— filming the story."/><br/><strong><SiteText id="reference-pages.19.delivery" fallback="Delivery"/></strong> <SiteText id="reference-pages.20.editing-review-and-the-finished" fallback="— editing, review, and the finished film."/></p></div></div></section>
  </div>}
