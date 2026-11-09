from pathlib import Path
p=Path('src/components/home-motion.tsx');s=p.read_text();s=s.replace('        panel.style.zIndex = String(index+1);','        // Preserve DOM stacking order. A z-index on the pin spacer isolates\n        // difference-blended covers from the image cloud behind them.');p.write_text(s)
p=Path('src/components/reference-pages.tsx');s=p.read_text(encoding='utf-8-sig');s=s.replace('<h2>THE<br/>ART OF<br/>','<h2>THE <br/>ART OF <br/>');p.write_text(s,encoding='utf8')
