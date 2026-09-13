import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {pages,videos,channel} from '../dist/content.js';
import {meshDots} from '../dist/mesh.js';
const source=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const scope=vm.createContext({pages,videos,channel,current:'home',mediaIndex:0,noteIndex:0,pageIds:Object.keys(pages),esc:s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),pad:n=>String(n).padStart(2,'0'),icon:()=>'<svg></svg>',categories:[]});
vm.runInContext(source.slice(source.indexOf('function home()'),source.indexOf('const pageIds='))+source.slice(source.indexOf('function path('),source.indexOf('function collectMap()')),scope);
let assets=new Set(),links=new Set();
for(const [id,p] of Object.entries(pages)){
 scope.current=id;
 const fn=id==='about'?'about':id==='content'?'content':p.kind==='branch'?'branch':p.kind==='video'?'video':'project';
 const html=vm.runInContext(`${fn}(${JSON.stringify(id)})`,scope);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${id}: exactly one slide heading`);
 assert.match(html,/class="slide /,`${id}: fixed slide wrapper`);
 assert.match(html,/class="slide-bottom"/,`${id}: visible slide navigation`);
 assert.ok(!html.includes('undefined'),`${id}: no undefined content`);
 for(const m of html.matchAll(/href="#([^"]+)"/g)){links.add(m[1]);assert.ok(m[1]==='home'||m[1]==='map'||pages[m[1]],`${id}: target ${m[1]}`);}
 for(const m of html.matchAll(/(?:src|data-src)="(assets\/[^"]+)"/g)){assets.add(m[1]);assert.ok(fs.existsSync(new URL('../dist/'+m[1],import.meta.url)),`${id}: asset ${m[1]}`);}
}
for(const v of videos)assert.equal(pages[v.slug].kind,'video');
const a=meshDots(1200,800),b=meshDots(1200,800);
assert.deepEqual(a,b,'ordered mesh is stable');
assert.ok(a.length>1000,'structured mesh has dots');
assert.ok(new Set(a.map(d=>d.r)).size>=4,'dot radii vary');
assert.ok(a.every(d=>d.alpha<.21&&d.r<2&&d.x%8===4&&d.y%8===4),'faint round dots on an ordered screen');
assert.ok(!source.includes('home-links')&&!source.includes('branch-links')&&!source.includes('graph-edges'),'all drawn connector lines removed');
const css=fs.readFileSync(new URL('../dist/style.css',import.meta.url),'utf8');assert.ok(!css.includes('@import'));assert.match(css,/Helvetica Neue/);assert.match(css,/DIN Alternate/);assert.match(css,/grid-template-rows:22px minmax\(68px,auto\) minmax\(0,1fr\) 64px/);
console.log(JSON.stringify({slides:Object.keys(pages).length,films:videos.length,linkedDestinations:links.size,referencedAssets:assets.size,orderedMesh:'passed',sourceChecks:'passed'}));
