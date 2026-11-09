import re,json,urllib.request
from html.parser import HTMLParser
class P(HTMLParser):
 def handle_starttag(self,t,a):
  d=dict(a)
  if t in ['script','link','a','video','source','img']: print(t,json.dumps(d))
P().feed(open('reference.html',encoding='utf8').read())
