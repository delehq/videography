from pathlib import Path
p=Path('src/components/portfolio.tsx');s=p.read_text();a=s.index('  return () => {',s.index('export function Project'));b=s.index('  return (\n',a);s=s[:a]+s[b:];p.write_text(s)
