import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRef, PDFString, PDFHexString } from 'pdf-lib'; import fs from 'fs';
const d = await PDFDocument.load(fs.readFileSync('published/agentic-pdlc.pdf'));
const pages = d.getPages().map(p=>p.ref.toString());
const cat = d.catalog; const ol = cat.lookup(PDFName.of('Outlines'), PDFDict);
let it = ol.lookup(PDFName.of('First'), PDFDict); let n=0;
while (it && n<5) { const t=it.lookup(PDFName.of('Title')); const dest = it.lookup(PDFName.of('Dest')) ?? it.lookup(PDFName.of('A')); console.log(t.decodeText(), String(dest).slice(0,120)); 
 const kid = it.lookup(PDFName.of('First'), PDFDict); if (kid) console.log('  kid', kid.lookup(PDFName.of('Title')).decodeText(), String(kid.lookup(PDFName.of('Dest'))).slice(0,80));
 it = it.lookup(PDFName.of('Next')); n++; }
console.log(cat.lookup(PDFName.of('Names'))?.toString().slice(0,200));
