import re,pathlib
from html.parser import HTMLParser
class P(HTMLParser):
 def handle_starttag(self,t,a):
  d=dict(a)
  if t in ['a','video','source','img'] and any(k in d for k in ['href','src','data-src']): print(t,{k:v for k,v in d.items() if k in ['href','src','data-src','poster']})
for n in ['weddings','commercial','works','stories','contact']:
 print('\nPAGE',n); P().feed(pathlib.Path('audit/source/'+n+'.html').read_text(encoding='utf8'))
