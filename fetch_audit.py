import urllib.request,pathlib,concurrent.futures
base='https://thomasmamfredas.com'
paths=['/assets/css/'+n+'.css' for n in ['main','child','childa','menu']]+['/assets/js/'+n+'.js' for n in ['heroload','anim_film','cimage','board','gopti','cursor','main']]+['/'+n for n in ['weddings','commercial','works','stories','contact']]
pathlib.Path('audit/source').mkdir(parents=True,exist_ok=True)
def get(p):
 try:
  b=urllib.request.urlopen(base+p).read(); name=p.split('/')[-1]; pathlib.Path('audit/source/'+(name if '.' in name else name+'.html')).write_bytes(b); return (p,len(b))
 except Exception as e:return(p,str(e))
print(list(concurrent.futures.ThreadPoolExecutor().map(get,paths)))
