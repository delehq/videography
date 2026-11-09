'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Port of the reference's dynamically loaded manim.js panel controller.
// Long panels finish scrolling before they pin; the next panel covers them.
export function HomeMotion() {
  const pathname = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let panels:HTMLElement[]=[];
    let ctx:gsap.Context|undefined;
    let alive=true,frame=0,settle=0;
    let sizes:ResizeObserver|undefined;
    const collect=()=>document.querySelector('.home-stack,.reference-stack')?[...document.querySelectorAll<HTMLElement>('.home-stack .scroll-panel, .reference-stack .scroll-panel, .footer')]:[];
    function refresh(){if(alive)ScrollTrigger.refresh();}
    function scheduleRefresh(){if(!alive)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{clearTimeout(settle);settle=window.setTimeout(refresh,50)});}
    function build(){
      if(!alive)return;
      const nextPanels=collect();
      if(nextPanels.length===panels.length&&nextPanels.every((panel,i)=>panel===panels[i]))return;
      sizes?.disconnect();ctx?.revert();
      panels=nextPanels;
      if(!panels.length||reduced.matches)return;
      ctx=gsap.context(() => {
      panels.forEach((panel,index) => {
        const next = panels[index+1];
        // Preserve DOM stacking order. A z-index on the pin spacer isolates
        // difference-blended covers from the image cloud behind them.
        if (!next) return;
        if(panel.hasAttribute('data-custom-pin'))return;
        ScrollTrigger.create({
          id: `home-panel-${index}`, trigger: panel,
          start: () => panel.scrollHeight > innerHeight*1.02 ? 'bottom bottom' : 'top top',
          endTrigger: next, end: 'top top', pin: true, pinSpacing: false,
          anticipatePin: 1, invalidateOnRefresh: true,
        });
        const surface = panel.querySelector<HTMLElement>(':scope > .panel-surface');
        if (surface) gsap.fromTo(surface,{scale:1},{
          scale:.92,ease:'none',scrollTrigger:{
            trigger:next,start:'top bottom',end:'top top',scrub:true,invalidateOnRefresh:true,
          },
        });
      });
      });
      sizes=new ResizeObserver(scheduleRefresh);
      panels.forEach(panel=>{sizes!.observe(panel);const surface=panel.querySelector(':scope > .panel-surface');if(surface)sizes!.observe(surface)});
      scheduleRefresh();
    }
    // App Router layouts survive navigation. A streamed page or Fast Refresh
    // can replace the panels after the pathname effect has already run.
    const mutations=new MutationObserver(build);
    const main=document.querySelector('#main');
    if(main)mutations.observe(main,{childList:true,subtree:true});
    build();
    const onMediaLoad=(event:Event)=>{if((event.target as HTMLElement)?.matches('img,video'))scheduleRefresh()};
    main?.addEventListener('load',onMediaLoad,true);
    main?.addEventListener('loadedmetadata',onMediaLoad,true);
    document.fonts.ready.then(scheduleRefresh);
    // Settle the pin bounds before the loader gives scrolling back to the page.
    // Deferring this first refresh can move an incoming cover under a new wheel event.
    function onLoaderDone(){build();refresh();}
    window.addEventListener('john:loader-done',onLoaderDone);
    window.addEventListener('pageshow',scheduleRefresh);
    window.addEventListener('resize',scheduleRefresh);
    function onReduced(){panels=[];ctx?.revert();ctx=undefined;sizes?.disconnect();build();scheduleRefresh()}
    reduced.addEventListener('change',onReduced);
    return()=>{alive=false;mutations.disconnect();sizes?.disconnect();cancelAnimationFrame(frame);clearTimeout(settle);main?.removeEventListener('load',onMediaLoad,true);main?.removeEventListener('loadedmetadata',onMediaLoad,true);window.removeEventListener('john:loader-done',onLoaderDone);window.removeEventListener('pageshow',scheduleRefresh);window.removeEventListener('resize',scheduleRefresh);reduced.removeEventListener('change',onReduced);ctx?.revert();};
  },[pathname]);
  return null;
}
