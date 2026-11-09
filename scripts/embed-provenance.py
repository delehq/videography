import subprocess
paths={'hero.jpg':'/assets/images/used/opti/1.jpg','portrait.jpg':'/assets/images/used/opti/thomas.JPG','wedding.jpg':'/assets/images/used/opti/wed3.jpg','wedding2.jpg':'/assets/images/used/opti/9.jpg','wedding3.jpg':'/assets/images/used/opti/15.jpg','commercial.jpg':'/assets/images/used/opti/comm1.jpg','commercial2.jpg':'/assets/images/used/opti/comm2.jpg'}
for i in range(1,15):paths['tile'+str(i)+'.jpg']='/assets/images/used/prel/'+str(i)+'.jpg'
for i in [2,17,39,27,9,5,12,20,22,30]:paths['cloud'+str(i)+'.jpg']='/assets/images/used/cloud/opti/'+str(i)+'.jpg'
for name,origin in paths.items():
 subprocess.run(['C:/Users/USER/.agents/skills/impeccable/scripts/impeccable.cmd','embed-prompt','public/media/'+name,'--prompt','Sourced reference image: https://thomasmamfredas.com'+origin+'. Temporary visual reference; replace with licensed John media before launch.'],stdout=subprocess.DEVNULL,check=True)
print('Embedded original source URLs in 31 reference JPEGs.')
