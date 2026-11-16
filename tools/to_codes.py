# usage: python3 to_codes.py file.md  -> rewrites SOURCE-IDs to short codes (MS4), strips inline grades, drops per-section "Sources used"
import re,json,sys
reg=json.load(open('/mnt/project-files/software-factory-research/document/references.json'))
ids=sorted(reg,key=len,reverse=True)
pat=re.compile(r'(?<![A-Z0-9-])('+'|'.join(map(re.escape,ids))+r')(?![A-Z0-9-])')
for f in sys.argv[1:]:
    t=open(f).read()
    t=re.sub(r'\n### Sources used\n.*?(?=\n### |\Z)','\n',t,flags=re.S)
    t=pat.sub(lambda m:reg[m.group(1)]['code'],t)
    t=re.sub(r',\s*(?:[ABC][+-]?|talk(?:, ungraded)?|ungraded)\]',']',t)
    t=re.sub(r'\b(MS-GANDALF|MS-SDP|MS-ENTRA-AGENT|SPOTIFY-HONK)-\*','',t)
    left=re.findall(r'\b[A-Z]{2,}(?:-[A-Z0-9]+)+\b',t)
    open(f,'w').write(t); print(f,'unconverted-looking tokens:',sorted(set(left))[:20])
