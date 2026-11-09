from pathlib import Path
p=Path('src/components/site-shell.tsx');s=p.read_text(encoding='utf-8-sig');a=s.index('function Loader()');b=s.index('export function SiteShell',a);s=s[:a]+s[b:];s=s.replace("import {HomeMotion} from './home-motion';","import {HomeMotion} from './home-motion';\nimport {PageLoader} from './page-loader';");s=s.replace('<Loader/>','<PageLoader key={pathname}/>');p.write_text(s,encoding='utf8')
p=Path('src/components/portfolio.tsx');s=p.read_text(encoding='utf-8-sig');s=s.replace('Every frame is part of\n          <br />a bigger story.','Every photograph is a single frame from a bigger story. Moments of light, motion, and spontaneity captured in one image yet filled with the atmosphere of the entire day. This is my eye behind the camera: honest moments, in a cinematic form.');p.write_text(s,encoding='utf8')
p=Path('src/app/scroll-sections.css');s=p.read_text(encoding='utf-8-sig');s+='''
/* Difference blending keeps the cloud visible under the incoming pale sheet. */
.light-interlude.scroll-panel{mix-blend-mode:difference;background:#f0f0f0}
.cloud-copy{left:7.6vw;top:13%;max-width:300px}
.cloud-copy p{font-size:15px;line-height:1.45;max-width:300px;font-weight:500}
.cloud-copy small{margin-top:18px}
.loader-grid>div{background:transparent;animation:none}
.loader-grid img{animation:loader-tile-in .18s ease-out both}
.loader[data-phase=dark] .loader-grid{visibility:hidden}
@keyframes loader-tile-in{from{opacity:0;transform:translateY(2%)}to{opacity:1;transform:translateY(0)}}
@media(max-width:650px){.cloud-copy{left:20px;top:12%;max-width:180px}.cloud-copy p{font-size:10px;line-height:1.5;max-width:180px}}
''';p.write_text(s,encoding='utf8')
