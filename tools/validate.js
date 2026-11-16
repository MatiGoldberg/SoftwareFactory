// Readability rules: rendered into a 672px column; text must stay >=12.5px and height <=700px.
// Set PNG_DIR=/some/dir to also save a 672px-wide preview PNG of each block (what the reader sees).
// usage: node validate.js file.md [more.md]  -> renders every ```mermaid block in headless chromium
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.setContent('<html><body></body></html>');
await p.addScriptTag({path:path.join(__dirname,'node_modules/mermaid/dist/mermaid.min.js')});
await p.evaluate(()=>mermaid.initialize({startOnLoad:false}));
let bad=0;
for(const f of process.argv.slice(2)){const t=fs.readFileSync(f,'utf8');const re=/```mermaid\n([\s\S]*?)```/g;let m,i=0;
while((m=re.exec(t))){i++;const r=await p.evaluate(async(c)=>{try{const {svg}=await mermaid.render('d'+Math.random().toString(36).slice(2),c);
const vb=(svg.match(/viewBox="([^"]+)"/)||[])[1];if(!vb)return 'OK (no viewBox)';const [,,w,h]=vb.split(/\s+/).map(Number);
const COL=672,scale=Math.min(1,COL/w),font=16*scale,rh=h*scale;const warn=[];
if(font<12.5)warn.push(`text too small: ${font.toFixed(1)}px (width ${Math.round(w)} > ~860; make it narrower: TD instead of LR, fewer side-by-side nodes, shorter labels, or split)`);
if(rh>700)warn.push(`too tall: ${Math.round(rh)}px at column width (max ~700; fewer nodes, LR for long linear chains, or split)`);
return (warn.length?'WARN: '+warn.join('; '):'OK')+` [natural ${Math.round(w)}x${Math.round(h)}, shown ${Math.round(Math.min(w,COL))}x${Math.round(rh)}, text ${font.toFixed(1)}px]`}catch(e){return 'ERROR: '+(e.message||e)}},m[1]);
if(!r.startsWith('OK'))bad++;
if(process.env.PNG_DIR&&!r.startsWith('ERROR')){const png=path.join(process.env.PNG_DIR,`${path.basename(f,'.md')}-block${i}.png`);
await p.evaluate(async(c)=>{const {svg}=await mermaid.render('p'+Math.random().toString(36).slice(2),c);document.body.innerHTML='<div id="col" style="width:672px;padding:8px;background:#fff">'+svg+'</div>';const e=document.querySelector('#col svg');e.style.maxWidth='100%';e.style.height='auto'},m[1]);
await (await p.$('#col')).screenshot({path:png});console.log('  preview:',png);}console.log(`${path.basename(f)} block ${i}: ${r.slice(0,400)}`);}
if(!i)console.log(`${path.basename(f)}: no mermaid blocks`);}
await b.close();process.exit(bad?1:0)})();
