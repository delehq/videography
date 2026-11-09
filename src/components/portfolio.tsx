"use client";
import Link from "next/link";
import {SiteText,SiteImage,useSiteContent,useSiteProjects,useManagedMedia,useProjectPlacement} from './site-content';
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Play,
} from "lucide-react";
import { projects,mediaUrl,getProject } from "@/lib/brand";
import { CloudCanvas } from "./cloud-canvas";
import {ProjectMediaViewer} from "./project-media-viewer";


import {WorkPreview,type PreviewSelection} from "./work-preview";
export function Film({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  src=useManagedMedia(src)!;poster=useManagedMedia(poster);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (
        e.isIntersecting &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`film ${className}`}>
      <video
        ref={ref}
        src={mediaUrl(src)}
        poster={mediaUrl(poster || (src === "film.webm" ? "commercial.jpg" : src === "brand.webm" ? "commercial2.jpg" : "wedding.jpg"))}
        muted
        loop
        playsInline
        preload="none"
      />

    </div>
  );
}
export function Home(){return <div className="home-stack">
<section className="hero scroll-panel"><div className="panel-surface">
 <div className="hero-media"><Film src="hero.mp4" poster="hero.jpg"/><div className="hero-shade"/></div>
 <div className="hero-bottom"><h1><SiteText id="portfolio.1.john" fallback="JOHN"/></h1><p><SiteText id="portfolio.2.i-see-stories-in-light" fallback="I see stories in light, movement, and the moments in between. Wedding films, brand stories, and a little of everything that makes us feel."/></p></div>
 <a className="scroll-cue" href="#about" aria-label="Scroll to about" onClick={e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.preventDefault();document.getElementById('about')?.scrollIntoView({behavior:'smooth',block:'start'})}}><ArrowDown size={17}/></a>
</div></section>
<section className="about scroll-panel" id="about"><div className="panel-surface">
 <div className="about-top"><div><span className="section-label"><SiteText id="portfolio.3.about" fallback="\\ ABOUT"/></span><SiteImage className="portrait" src="/media/portrait.jpg" alt="A cinematic portrait - reference imagery"/></div><h2><SiteText id="portfolio.4.the" fallback="THE"/><br/><SiteText id="portfolio.5.art-of" fallback="ART OF"/><br/><SiteText id="portfolio.6.noticing" fallback="NOTICING"/></h2></div>
 <div className="about-editorial"><div><p className="upper-copy"><SiteText id="portfolio.7.i-make-films-about-people" fallback="I make films about people, places, and the things that connect us. For couples, that means the honest moments. For brands, the details that make you different. Always with a cinematic eye and a feeling that stays."/></p><Link className="text-link" href="/contact"><SiteText id="portfolio.8.lets-chat" fallback="LET'S CHAT"/><ArrowUpRight size={16}/></Link><Film src="film.webm" className="tall-film"/></div><div className="offset"><Film src="wedding.webm" poster="wedding.jpg" className="bridal-film"/><SiteImage className="wide-still" src="/media/commercial.jpg" alt="Details and atmosphere at a restaurant"/></div></div>
</div></section>
<div className="film-interlude scroll-panel" aria-hidden="true"><div className="panel-surface"/></div><PhotoCloud/>
<div className="light-interlude scroll-panel" aria-hidden="true"><div className="panel-surface"/></div>
<WorkBoard/>
</div>}
export function PhotoCloud() {
 const content=useSiteContent();
  const [zoom,setZoom]=useState<{index:number;origin:DOMRect}|null>(null);
  const travel=useRef(0);
  const [focusedPhoto,setFocusedPhoto]=useState<number|null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const pos = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const pictures = [
    "cloud2.jpg",
    "cloud17.jpg",
    "commercial.jpg",
    "cloud39.jpg",
    "cloud27.jpg",
    "wedding3.jpg",
    "cloud9.jpg",
    "cloud5.jpg",
    "commercial2.jpg",
    "wedding2.jpg",
    "cloud20.jpg",
    "cloud22.jpg",
    "cloud30.jpg",
    "wedding.jpg",
  ];
  return (
    <section className="photo-universe scroll-panel"><div className="panel-surface">
      <div className="cloud-copy">
        <p>
          <SiteText id="portfolio.9.every-photograph-is-a-single" fallback="Every photograph is a single frame from a bigger story. Moments of light, motion, and spontaneity captured in one image yet filled with the atmosphere of the entire day. This is my eye behind the camera: honest moments, in a cinematic form."/></p>
        <small><SiteText id="portfolio.10.drag-to-explore" fallback="DRAG TO EXPLORE"/></small>
      </div>
      <div
        className={`photo-cloud ${drag ? "dragging" : ""}`}
        ref={root}
        onPointerDown={(e) => {
          if (
            (e.target as HTMLElement).closest(".webgl-cloud") ||
            e.pointerType === "touch"
          )
            return;
          travel.current=0;
          setDrag(true);
          pos.current.px = e.clientX;
          pos.current.py = e.clientY;

        }}
        onPointerMove={(e) => {
          if (drag) {
            travel.current+=Math.hypot(e.clientX-pos.current.px,e.clientY-pos.current.py);
            if(travel.current>6)e.currentTarget.setPointerCapture(e.pointerId);
            pos.current.x += e.clientX - pos.current.px;
            pos.current.y += e.clientY - pos.current.py;
            pos.current.px = e.clientX;
            pos.current.py = e.clientY;
            root.current?.style.setProperty("--pan-x", pos.current.x + "px");
            root.current?.style.setProperty("--pan-y", pos.current.y + "px");
          }
        }}
        onPointerUp={() => setDrag(false)}
      >
        <CloudCanvas onOpen={(index,origin)=>setZoom({index,origin})}/>
        <div className="cloud-field">
          {pictures.map((p, i) => (
            <button
              key={p}
              type="button"
              aria-label={`Zoom photograph ${i+1}`}
              onClick={()=>{if(travel.current<=6)setFocusedPhoto(current=>current===i?null:i)}}
              onKeyDown={e=>{if(e.key==="Escape")setFocusedPhoto(null)}}
              aria-pressed={focusedPhoto===i}
              className={`cloud-picture${focusedPhoto===i?" is-focused":""}`}
              style={{
                left: `${8 + ((i * 23) % 86)}%`,
                top: `${5 + ((i * 37) % 87)}%`,
                width: `${90 + ((i * 29) % 130)}px`,
                transform: `translateZ(${(i % 3) * 35}px)`,
              }}
              draggable={false}
            >
              <SiteImage
                src={`/media/${p}`}
                alt={`Photograph ${i+1}`}
                loading="lazy"
                draggable={false}
              />
            </button>
          ))}
        </div>
        {focusedPhoto!==null&&<button className="cloud-hd fallback-hd" aria-label="Open focused photograph fullscreen" onClick={()=>{const image=root.current?.querySelector<HTMLElement>(".cloud-picture.is-focused");if(image)setZoom({index:focusedPhoto,origin:image.getBoundingClientRect()})}}><SiteText id="portfolio.11.hd" fallback="HD"/></button>}
      </div>
    </div>{zoom&&<ProjectMediaViewer items={[{kind:"image",src:content.media['/media/'+pictures[zoom.index]]||pictures[zoom.index]}]} initial={0} origin={zoom.origin} title="Selected" onClose={()=>setZoom(null)}/>}</section>
  );
}
export function WorkBoard({category}:{category?:string}){
 const projects=useSiteProjects();
 const items=useProjectPlacement(category==='Weddings'?'weddingWork':category==='Commercial'?'commercialWork':'homeWork');
 const [selected,setSelected]=useState(0);
 const active=Math.min(selected,Math.max(items.length-1,0));if(!items.length)return null;
 return <section className="selected-work scroll-panel"><div className="panel-surface">
 <Link className="work-heading" href="/works">\ {category||'WORK'} <ArrowUpRight/></Link><span className="section-label">{category?`Selected ${category} Work`:'Selected Work'}</span>
 <div className="work-board"><Link className="project-preview" href={`/work/${items[active].slug}`} aria-label={`View ${items[active].title}`}>
 {items.map((p,i)=><SiteImage key={p.slug} className={i===selected?'visible':''} src={mediaUrl(p.image)} alt={i===selected?p.title:''}/>)}
 <span>{items[active].title}</span><p className="preview-description">{items[active].description}</p>
 </Link><div className="work-table"><div className="work-row table-head"><span><SiteText id="portfolio.12.project" fallback="PROJECT"/></span><span><SiteText id="portfolio.13.client" fallback="CLIENT"/></span><span><SiteText id="portfolio.14.category" fallback="CATEGORY"/></span></div>
 {items.map((p,i)=><Link className={`work-row ${selected===i?'selected':''}`} key={p.slug} onMouseEnter={()=>setSelected(i)} onFocus={()=>setSelected(i)} href={`/work/${p.slug}`}><span>{p.title}</span><span>{p.client||'-'}</span><span>{p.category}</span></Link>)}
 </div></div></div></section>
}
export function Collection({ category }: { category?: string }) {
 const projects=useSiteProjects();
  const [preview,setPreview]=useState<PreviewSelection|null>(null);
  const filter = category || "All";
  const shown = projects.filter(
    (p) => filter === "All" || p.category === filter,
  );
  return (
    <div className="collection page-wrap">
      <div className="collection-title">
        <h1>{category || "WORKS"}</h1>
        <sup>({String(shown.length).padStart(2, "0")})</sup>
      </div>
      <div className="project-grid">
        {shown.map((p, i) => (
          <Link href={`/work/${p.slug}`} key={p.slug} onClick={event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();const trigger=event.currentTarget;const rect=trigger.querySelector('.project-image')!.getBoundingClientRect();setPreview({project:p,origin:{left:rect.left,top:rect.top,width:rect.width,height:rect.height},trigger})}}>
            <div className="project-image">
              <SiteImage src={mediaUrl(p.image)} alt={p.title} />
              {p.previewKind==='video'&&<span className="tile-play"><Play size={16} fill="currentColor"/></span>}
            </div>
            <div className="project-caption">
              <h2>{p.title}</h2>
              <span>{p.category}</span>
            </div>
          </Link>
        ))}
      </div>
      {preview&&<WorkPreview selection={preview} onClose={()=>setPreview(null)}/>}
      <p className="reference-note">
        <SiteText id="portfolio.15.illustrative-projects-with-reference-imagery" fallback="Illustrative projects with reference imagery. John’s portfolio will replace these before launch."/></p>
    </div>
  );
}
export {ReferenceProject as Project} from './project-page';
