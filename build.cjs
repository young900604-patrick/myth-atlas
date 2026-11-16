const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dir = path.join(__dirname,'dist');
const rows = vm.runInNewContext(fs.readFileSync(path.join(dir,'stories.js'),'utf8') + '\nstories');
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const groups = [...new Set(rows.map(r=>r[1]))];
const ids = new Set(rows.map(r=>r[0]));
if(ids.size!==rows.length || rows.some(r=>r.length!==12 || !ids.has(r[11]) || !/^[a-z0-9-]+$/.test(r[0]))) throw Error('請檢查欄位、代號及延伸閱讀');
function page(title,body) {
return `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}｜愛琴海神話圖誌</title><link rel="stylesheet" href="style.css"><header><a class="brand" href="index.html">◈　愛琴海神話圖誌</a><nav><a href="index.html#collection">故事館藏</a><a href="guide.html">人物與地點</a></nav></header><main>${body}</main><footer>愛琴海神話圖誌　／　希臘神話閱讀計畫</footer></html>`;
}
function write(name,html){fs.writeFileSync(path.join(dir,name),html)}
function link(r){return `<a href="${r[0]}.html">${esc(r[2])}</a>`}
const card = r => `<article class="card" data-group="${esc(r[1])}"><small>${esc(r[1])}　／　${esc(r[3])}</small><h3>${link(r)}</h3><p>${esc(r[4])}</p><span aria-hidden="true">↗</span></article>`;
write('index.html',page('首頁',`<section class="hero"><div><small>AEGEAN MYTH ATLAS</small><h1>愛琴海<br>神話圖誌</h1><p>一團線、一面黑帆、一張搬不走的床。<br>從故事裡的一件物品，走進眾神與凡人的世界。</p><a class="cta" href="#collection">翻閱故事館藏　↓</a></div><figure><div class="handles"></div><div class="vase"><div class="band">◇ ◇ ◇ ◇ ◇</div><div class="labyrinth"></div><div class="band bottom">◇ ◇ ◇ ◇ ◇</div></div><figcaption>雙耳陶罐　·　迷宮紋樣概念插畫</figcaption></figure></section><section id="collection"><small>THE COLLECTION</small><h2>故事館藏</h2><div id="filters" hidden>${['全部',...groups].map((g,i)=>`<button type="button" aria-pressed="${i===0}">${esc(g)}</button>`).join('')}</div><div class="grid">${rows.map(card).join('')}</div></section><script src="filter.js"></script>`));
for(const r of rows){
const next=rows.find(n=>n[0]===r[11]);
write(r[0]+'.html',page(r[2],`<article class="reading"><a href="index.html#collection">← 故事館藏</a><p class="kicker">${esc(r[1])}　／　${esc(r[3])}</p><h1>${esc(r[2])}</h1><p class="lead">${esc(r[4])}</p><h2>故事</h2><p>${esc(r[5])}</p><h2>換個角度讀</h2><p>${esc(r[6])}</p><aside>人物　${esc(r[7])}<br>地點　${esc(r[8])}<br>古典文本　<a href="https://www.theoi.com/Text/${esc(r[10])}.html">${esc(r[9])}</a>（英譯）</aside><p>接著讀　${link(next)}　→</p></article>`))}
function index(field){
const names=[...new Set(rows.flatMap(r=>r[field].split('、')))];
return names.map(n=>`<div class="entry"><strong>${esc(n)}</strong><div>${rows.filter(r=>r[field].split('、').includes(n)).map(link).join('　／　')}</div></div>`).join('')}
write('guide.html',page('人物與地點',`<section class="reading"><small>READING INDEX</small><h1>人物與地點</h1><p class="lead">循著同一個名字，看看誰在另一篇故事裡再次出現。</p><p><a href="#people">人物索引 ↓</a>　<a href="#places">地點索引 ↓</a></p><h2 id="people">人物索引</h2>${index(7)}<h2 id="places">地點索引</h2>${index(8)}</section>`));
