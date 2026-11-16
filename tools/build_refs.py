# Builds the global reference registry (short codes like MS4) from SOURCES.md + source notes.
import re,json,glob,os,collections
R='/mnt/project-files/software-factory-research'
rows=collections.OrderedDict()
for line in open(f'{R}/SOURCES.md'):
    c=[x.strip() for x in line.strip().strip('|').split('|')]
    if len(c)>=4 and re.match(r'^[A-Z][A-Z0-9]+(-[A-Z0-9]+)+$',c[0]) and c[0] not in rows:
        g=next((x for x in c[2:] if re.match(r'^[ABC][+-]?$',x)),'')
        rows[c[0]]=dict(title=c[1],pub=c[2] if c[2]!=g else '',grade=g)
urls={}
for f in sorted(glob.glob(f'{R}/sources/*.md')):
    cur=None
    for line in open(f):
        h=re.match(r'## \[([A-Z0-9-]+)\]',line)
        if h: cur=h.group(1); continue
        u=re.match(r'URLs?:\s*(\S+)',line)
        if u and cur and cur not in urls: urls[cur]=u.group(1).rstrip(';,')
PFX=[('GH-','GH'),('MS-','MS'),('GOOG-','GOOG'),('DORA-','GOOG'),('META-','META'),('AWS-','AWS'),('AMAZON-','AWS'),
 ('AN-','AN'),('OAI-','OAI'),('SPOTIFY-','SPOT'),('STRIPE-','STRIPE'),('SHOPIFY-','SHOP'),('UBER-','UBER'),('AIRBNB-','ABNB'),
 ('AIE-','AIE'),('MCP-','MCP'),('ATLASSIAN-','ATL'),('MABL-','MABL'),('EXT-','EXT'),('EMBEDDED-','EMB'),('NETFLIX-','NFLX')]
cnt=collections.Counter();reg=collections.OrderedDict()
# keep previously assigned codes stable; new sources get the next free number per prefix
try: old=json.load(open(f'{R}/document/references.json'))
except Exception: old={}
for i,d in old.items():
    m=re.match(r'([A-Z]+)(\d+)$',d['code']); cnt[m.group(1)]=max(cnt[m.group(1)],int(m.group(2)))
ids=list(rows)+[i for i in urls if i not in rows]
for i in ids:
    p=next((c for s,c in PFX if i.startswith(s)),'OTH')
    if i in old: code=old[i]['code']
    else: cnt[p]+=1; code=f'{p}{cnt[p]}'
    d=rows.get(i,dict(title='',pub='',grade=''))
    g=d['grade'] or ('talk' if i.startswith('AIE-') else '?')
    reg[i]=dict(code=code,url=urls.get(i,''),grade=g,**{k:d[k] for k in('title','pub')})
json.dump(reg,open(f'{R}/document/references.json','w'),indent=1)
with open(f'{R}/document/references.md','w') as o:
    o.write('# References\n\nShort codes used in the text: MS = Microsoft, GH = GitHub, GOOG = Google and DORA, META = Meta, AWS = Amazon, AN = Anthropic, OAI = OpenAI, SPOT = Spotify, AIE = AI Engineer conference talks, others by company. Grades: A = peer-reviewed or measured, B = company post with numbers, C = guidance or anecdote, talk = conference talk.\n\n| Ref | Source | Title | Publisher, date | Grade | Link |\n|---|---|---|---|---|---|\n')
    for i,d in reg.items(): o.write(f"| {d['code']} | {i} | {d['title']} | {d['pub']} | {d['grade']} | {d['url']} |\n")
missing=[i for i,d in reg.items() if not d['url']]
print(len(reg),'refs; missing url:',missing)
