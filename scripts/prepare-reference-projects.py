import json,subprocess,hashlib,concurrent.futures
from pathlib import Path
from bs4 import BeautifulSoup
root=Path('audit/source');s=BeautifulSoup((root/'works.html').read_text(encoding='utf-8'),'html.parser');tiles=s.select('.work-tile');assets={}
def asset(url):
 if not url:return ''
 if url.startswith('http'):return url
 if url.lower().split('?')[0].endswith(('.mp4','.webm')):return 'https://thomasmamfredas.com'+url
 name='ref-'+hashlib.sha1(url.encode()).hexdigest()[:12]+Path(url).suffix.lower();assets[name]=url;return name
def detail(tile):
 slug=tile['data-href'].split('/')[-1];path=root/('project-'+slug+'.html')
 if not path.exists():subprocess.run(['curl.exe','-sL','https://thomasmamfredas.com/work/'+slug,'-o',str(path)],check=True)
 d=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser');hero=d.select_one('#heroMedia');intro=d.select_one('.intro-media');gallery=d.select('#projectGallery .media-block');meta=[x.get_text(' ',strip=True) for x in d.select('#projectIntro .main-sub')]
 return {'slug':slug,'title':tile['data-title'],'category':tile['data-type'],'image':asset(tile.get('data-poster') or tile['data-src']),'film':asset(intro.get('data-src') if intro and intro.get('data-media-type')=='video' else tile.get('data-src') if tile.get('data-kind')=='video' else ''),'description':'','previewKind':tile.get('data-kind','image'),'previewSrc':asset(tile.get('data-src')),'heroImage':asset(hero.get('data-src') if hero else tile.get('data-poster') or tile.get('data-src')),'introImage':asset((intro.select_one('img') or intro.select_one('video')).get('src') or (intro.select_one('video').get('poster') if intro.select_one('video') else '') if intro else ''),'introKind':intro.get('data-media-type','image') if intro else 'image','gallery':[{'kind':x.get('data-media-type'),'src':asset(x.get('data-src'))} for x in gallery],'referenceMeta':meta}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:items=list(pool.map(detail,tiles))
# Copy is intentionally short and marked reference content, rather than claiming clients for John.
for p in items:
 if p['slug']=='zakynthos-greece':p['description']='A photographic journey through Zakynthos: changing light, quiet places, and details found by slowing down. A collection of moments from the island.'
for route in ['weddings','commercial','contact','stories']:
 d=BeautifulSoup((root/(route+'.html')).read_text(encoding='utf-8'),'html.parser')
 for m in d.select('section img'):asset(m.get('src'))
asset('/assets/images/used/opti/comm1.jpg');asset('/assets/images/used/opti/comm2.jpg');asset('/assets/images/used/opti/2.jpg');asset('/assets/images/used/opti/9.jpg')
Path('src/lib/reference-projects.json').write_text(json.dumps(items,indent=2,ensure_ascii=False),encoding='utf-8');(root/'asset-map.json').write_text(json.dumps(assets,indent=2),encoding='utf-8')
def download(pair):
 name,url=pair;dest=Path('public/media')/name
 if not dest.exists():subprocess.run(['curl.exe','-sL','https://thomasmamfredas.com'+url,'-o',str(dest)],check=True)
 return name
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(download,assets.items()))
print('Prepared',len(items),'project records and',len(assets),'local reference images.')
