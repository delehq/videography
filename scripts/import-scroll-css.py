from pathlib import Path
p=Path('src/app/layout.tsx');s=p.read_text();s=s.replace("import './globals.css';", "import './globals.css';\nimport './scroll-sections.css';");p.write_text(s)
