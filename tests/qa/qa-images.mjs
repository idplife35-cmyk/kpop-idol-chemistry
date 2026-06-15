// Check which group logo images are 404 on the live site
import { chromium } from 'playwright';

const BASE = 'https://kpopnamegenerator.com';
const SLUGS = ['aespa','ateez','blackpink','bts','enhypen','exo','g-idle','huntrix','illit','itzy','ive','katseye','le-sserafim','nct127','newjeans','plave','red-velvet','riize','sajaboys','seventeen','stray-kids','twice','txt','zerobaseone'];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const results = [];
for (const s of SLUGS) {
  const page = await ctx.newPage();
  const fails = [];
  page.on('response', r => {
    const u = r.url();
    const st = r.status();
    if (st >= 400 && /\.(png|jpg|webp|svg)$/i.test(u) && !/google|doubleclick|adservice/.test(u)) {
      fails.push({ status: st, url: u });
    }
  });
  await page.goto(BASE + `/${s}-name-generator/`, { waitUntil: 'networkidle', timeout: 30000 }).catch(()=>{});
  results.push({ slug: s, imgFails: fails });
  await page.close();
}
await ctx.close();
await browser.close();
for (const r of results) {
  console.log(r.slug, '|', r.imgFails.length, 'fails');
  for (const f of r.imgFails) console.log('   ', f.status, f.url);
}
