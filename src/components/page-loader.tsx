'use client';

import {useEffect,useRef,useState} from 'react';
import {useSiteContent,SiteImage} from './site-content';
import gsap from 'gsap';

export function PageLoader() {
 const content=useSiteContent();
  const root=useRef<HTMLDivElement>(null);
  const [done,setDone]=useState(false);
  const [tiles,setTiles]=useState<(number|null)[]>(Array(9).fill(null));
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion: reduce), (max-width: 991px), (pointer: coarse)').matches){setDone(true);return;}
    let alive=true,loaded=document.readyState==='complete',filled=0,exiting=false;
    const available:number[]=[];
    const timers:ReturnType<typeof setTimeout>[]=[];
    const started=performance.now();
    let ticker:ReturnType<typeof setInterval>;
    let timeline:gsap.core.Timeline|undefined;
    const finish=()=>{
      if(exiting||!alive)return;exiting=true;clearInterval(ticker);
      timeline=gsap.timeline({onComplete:()=>{if(alive){setDone(true);window.dispatchEvent(new Event('john:loader-done'));}}})
        .to(root.current?.querySelector('.loader-sweep')||{}, {yPercent:100,duration:.45,ease:'power3.inOut'})
        .to(root.current,{opacity:0,duration:.25},.3);
    };
    const onLoad=()=>{loaded=true;};window.addEventListener('load',onLoad,{once:true});
    for(let n=1;n<=14;n++){
      const image=new Image();image.decoding='async';image.src=content.media[`/media/tile${n}.jpg`]||`/media/tile${n}.jpg`;
      image.onload=async()=>{try{await image.decode();}catch{}if(alive)available.push(n);};
    }
    // Start with an entirely dark screen. Populate one decoded tile at a time.
    timers.push(setTimeout(()=>{
      if(!alive)return;
      ticker=setInterval(()=>{
        if(!available.length)return;
        const index=filled<9?filled:Math.floor(Math.random()*9);
        const next=available[filled%available.length];filled++;
        setTiles(previous=>previous.map((value,i)=>i===index?next:value));
        if(filled>=9&&loaded&&performance.now()-started>=2000)finish();
      },120);
    },500));
    // Media or a third-party font cannot indefinitely block the website.
    timers.push(setTimeout(finish,7000));
    return()=>{alive=false;clearInterval(ticker);timers.forEach(clearTimeout);timeline?.kill();window.removeEventListener('load',onLoad);};
  },[]);
  if(done)return null;
  return <div className="loader" ref={root} aria-hidden="true" data-phase={tiles.some(Boolean)?'images':'dark'}>
    <div className="loader-grid">{tiles.map((n,i)=><div key={i}>{n!==null&&<SiteImage key={`${i}-${n}`} src={`/media/tile${n}.jpg`} alt=""/>}</div>)}</div>
    <div className="loader-sweep"/>
  </div>;
}
