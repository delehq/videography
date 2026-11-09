from pathlib import Path
p=Path('src/components/portfolio.tsx');s=p.read_text(encoding='utf-8-sig');s=s.replace('import { CloudCanvas } from "./cloud-canvas";','import { CloudCanvas } from "./cloud-canvas";\nimport {FilmViewer} from "./film-viewer";')
a=s.index('export function Service(');b=s.index('export function Project(',a);s=s[:a]+s[b:]
a=s.index('  const [muted, setMuted]',s.index('export function Project'));b=s.index('  return (',a);s=s[:a]+s[b:]
a=s.index('      {playing && (',s.index('export function Project'));b=s.index('    </>',a);s=s[:a]+'      {playing&&<FilmViewer project={p} onClose={()=>setPlaying(false)}/>}\n'+s[b:]
p.write_text(s,encoding='utf8')
p=Path('src/app/scroll-sections.css');s=p.read_text(encoding='utf-8-sig');s+='''
.site-header{mix-blend-mode:normal;background:linear-gradient(180deg,#0000008a,transparent);padding-bottom:40px}
.desktop-nav{font-size:12.8px;line-height:1.2;font-weight:700;gap:48px}
.desktop-nav>div{gap:12px;align-items:flex-end;text-align:right}
.desktop-nav button{font-size:10px}
.cloud-copy{left:4vw;top:10%;max-width:320px}.cloud-copy p{font-size:16px;max-width:320px}
@media(max-width:650px){.site-header{padding-bottom:30px}.desktop-nav button{font-size:12px}.cloud-copy{left:20px;top:12%;max-width:180px}.cloud-copy p{font-size:10px;max-width:180px}}
''';p.write_text(s,encoding='utf8')
