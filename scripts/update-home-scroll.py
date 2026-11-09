from pathlib import Path
p=Path('src/components/portfolio.tsx');s=p.read_text(encoding='utf-8-sig');start=s.index('export function Home()');end=s.index('export function PhotoCloud()',start)
s=s[:start]+'''export function Home(){return <div className="home-stack">
<section className="hero scroll-panel"><div className="panel-surface">
 <div className="hero-media"><Film src="hero.mp4" poster="hero.jpg"/><div className="hero-shade"/></div>
 <div className="hero-bottom"><h1>JOHN</h1><p>I see stories in light, movement, and the moments in between. Wedding films, brand stories, and a little of everything that makes us feel.</p></div>
 <a className="scroll-cue" href="#about" aria-label="Scroll to about"><ArrowDown size={17}/></a>
</div></section>
<section className="about scroll-panel" id="about"><div className="panel-surface">
 <div className="about-top"><div><span className="section-label">\\ ABOUT</span><img className="portrait" src="/media/portrait.jpg" alt="A cinematic portrait - reference imagery"/></div><h2>THE<br/>ART OF<br/>NOTICING</h2></div>
 <div className="about-editorial"><div><p className="upper-copy">I make films about people, places, and the things that connect us. For couples, that means the honest moments. For brands, the details that make you different. Always with a cinematic eye and a feeling that stays.</p><Link className="text-link" href="/contact">LET'S CHAT <ArrowUpRight size={16}/></Link><Film src="film.webm" className="tall-film"/></div><div className="offset"><Film src="wedding.webm" poster="wedding.jpg" className="bridal-film"/><img className="wide-still" src="/media/commercial.jpg" alt="Details and atmosphere at a restaurant"/></div></div>
</div></section>
<PhotoCloud/>
<div className="light-interlude scroll-panel" aria-hidden="true"><div className="panel-surface"/></div>
<WorkBoard/>
</div>}
''' + s[end:]
s=s.replace('<section className="photo-universe">','<section className="photo-universe scroll-panel"><div className="panel-surface">')
start=s.index('export function PhotoCloud()');end=s.index('export function WorkBoard()',start);cloud=s[start:end];cloud=cloud.replace('</section>','</div></section>');s=s[:start]+cloud+s[end:]
start=s.index('export function WorkBoard()');end=s.index('export function Collection(',start)
s=s[:start]+'''export function WorkBoard(){
 const [selected,setSelected]=useState(0);
 return <section className="selected-work scroll-panel"><div className="panel-surface">
 <Link className="work-heading" href="/works">\\ WORK <ArrowUpRight/></Link><span className="section-label">Selected Work</span>
 <div className="work-board"><Link className="project-preview" href={`/work/${projects[selected].slug}`} aria-label={`View ${projects[selected].title}`}>
 {projects.map((p,i)=><img key={p.slug} className={i===selected?'visible':''} src={`/media/${p.image}`} alt={i===selected?p.title:''}/>)}
 <span>{projects[selected].title}</span><p className="preview-description">{projects[selected].description}</p>
 </Link><div className="work-table"><div className="work-row table-head"><span>PROJECT</span><span>CLIENT</span><span>CATEGORY</span></div>
 {projects.map((p,i)=><Link className={`work-row ${selected===i?'selected':''}`} key={p.slug} onMouseEnter={()=>setSelected(i)} onFocus={()=>setSelected(i)} href={`/work/${p.slug}`}><span>{p.title}</span><span aria-label="Client not yet supplied">-</span><span>{p.category}</span></Link>)}
 </div></div></div></section>
}
''' + s[end:]
p.write_text(s,encoding='utf8')
p=Path('src/lib/brand.ts');s=p.read_text();s=s.replace("image:'cloud2.jpg'","image:'work-a.jpg'",1).replace("image:'cloud17.jpg'","image:'work-b.jpg'",1);p.write_text(s)
