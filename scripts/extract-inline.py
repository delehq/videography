from html.parser import HTMLParser
from pathlib import Path
class P(HTMLParser):
 def __init__(self):super().__init__();self.inside=False;self.i=0
 def handle_starttag(self,t,a):
  if t=='script':self.inside=True
 def handle_endtag(self,t):
  if t=='script':self.inside=False
 def handle_data(self,d):
  if self.inside and len(d.strip())>20:
   self.i+=1;Path('audit/source/inline-'+str(self.i)+'.js').write_text(d,encoding='utf8');print(self.i,len(d),d[:90].strip())
P().feed(Path('reference.html').read_text(encoding='utf8'))
