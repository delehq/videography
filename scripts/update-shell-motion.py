from pathlib import Path
p=Path('src/components/site-shell.tsx');s=p.read_text(encoding='utf-8-sig');s=s.replace("import {FilmRoll} from './film-roll';","import {FilmRoll} from './film-roll';\nimport {HomeMotion} from './home-motion';")
s=s.replace("new Lenis({duration:1.15,smoothWheel:true})", "new Lenis({duration:.9,easing:t=>1-Math.pow(1-t,3),smoothWheel:true,anchors:true,virtualScroll:({event})=>!event.defaultPrevented})")
a=s.index("const hero=document.querySelector('.hero-media');");b=s.index('});return()=>ctx.revert();',a);s=s[:a]+s[b:]
s=s.replace('<main id="main">{children}</main><Footer/>','<HomeMotion/><main id="main">{children}</main><Footer/>')
s=s.replace('<footer className="footer"><div>','<footer className="footer" id="lets-talk"><div className="footer-copy">')
s=s.replace('<small>John', '<Link className="footer-all-work" href="/works">View all films <ArrowUpRight size={16}/></Link><small>John')
p.write_text(s,encoding='utf8')
