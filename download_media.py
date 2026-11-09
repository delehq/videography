import pathlib,subprocess,concurrent.futures
paths={'hero.jpg':'/assets/images/used/opti/1.jpg','portrait.jpg':'/assets/images/used/opti/2.jpg','wedding.jpg':'/assets/images/used/opti/wed3.jpg','wedding2.jpg':'/assets/images/used/opti/9.jpg','wedding3.jpg':'/assets/images/used/opti/15.jpg','commercial.jpg':'/assets/images/used/opti/comm1.jpg','commercial2.jpg':'/assets/images/used/opti/comm2.jpg','hero.mp4':'/assets/videos/Thomas Mainx.mp4','film.webm':'/assets/videos/8.webm','wedding.webm':'/assets/videos/6.webm','brand.webm':'/assets/videos/comm2.webm'}
for i in range(1,15): paths['tile'+str(i)+'.jpg']='/assets/images/used/prel/'+str(i)+'.jpg'
for i in [2,17,39,27,9,5,12,20,22,30]:paths['cloud'+str(i)+'.jpg']='/assets/images/used/cloud/opti/'+str(i)+'.jpg'
def get(kv):
 n,p=kv; subprocess.run(['curl.exe','-sL','https://thomasmamfredas.com'+p,'-o','public/media/'+n]); return n
print(list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(get,paths.items())))
