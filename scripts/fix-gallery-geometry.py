from pathlib import Path
p=Path('src/components/film-roll.tsx');s=p.read_text(encoding='utf-8-sig');a=s.index('        loader.load(image.src, texture => {');b=s.index('\n      });',a)
s=s[:a]+s[b:]
needle='''      });
    } catch {'''
replacement='''      });
      const bySource = new Map<string, Tile[]>();
      tiles.forEach(tile=>bySource.set(tile.image.src,[...(bySource.get(tile.image.src)||[]),tile]));
      bySource.forEach((matching,src)=>loader.load(src,texture=>{
        if(!alive){texture.dispose();return;}
        textures.push(texture);
        matching.forEach(({mesh})=>{mesh.material.uniforms.uMap.value=texture;mesh.userData.loaded=true;});
      }));
      renderer.domElement.addEventListener('webglcontextlost',event=>{
        event.preventDefault();
        if(renderer)renderer.domElement.style.display='none';
        tiles.forEach(({image})=>{image.style.opacity='1';});
        active=false;
      });
    } catch {'''
s=s.replace(needle,replacement,1);p.write_text(s,encoding='utf8')
