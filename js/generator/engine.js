

import { makeSeed, rnd } from '../generator/seed.js';
import { romanize } from '../generator/romanize.js';
import { RELATION_PRESET } from '../generator/style-presets.js';
import { getSurnames } from './surnames.js';
import { getSyllables } from '../generator/syllable-pool.js';

export function inferGender(myName){
  if(!myName) return null;
  const n = (myName||'').toLowerCase();
  const female = ['sophia','emma','olivia','ava','mia','isabella','sofia','emily','chloe','grace'];
  const male   = ['daniel','david','michael','james','john','william','henry','liam','noah'];
  if(female.includes(n)) return 'female';
  if(male.includes(n)) return 'male';
  if(/[가-힣]$/.test(myName)){
    const last = myName[myName.length-1];
    if('아라연린예윤서나'.includes(last)) return 'female';
    if('준현석태호민우'.includes(last)) return 'male';
  }
  return null;
}

function pick(arr, n){ return arr[n % arr.length]; }
function splitHangul(str){ return [...str]; }
function mapSyllable(sy, pool, n){
  const table = pool.mapTable || {};
  const cand = table[sy] || pool.fallback || [sy];
  return cand[n % cand.length];
}
function styleFrom(given, pool, preset, n){
  let parts = splitHangul(given);
  let out = parts.map((sy,i)=> mapSyllable(sy, pool, n+i));
  const target = preset.targetLen.includes(3) && (n % 10 < 4) ? 3 : preset.targetLen[0];
  while(out.length < target){ out.push( pick(pool.endings, n+out.length) ); }
  if(out.length > 3) out = out.slice(0,3);
  for(let i=1;i<out.length;i++){ if(out[i]===out[i-1]) out[i] = pick(pool.endings, n+i); }
  return out.join('');
}

export async function generate({ myName, idol, genderPref='auto', relation='lover' }){
  const seed = makeSeed(myName||'', idol.group+':'+idol.name_kr, genderPref, relation);
  const finalGender = (genderPref!=='auto') ? genderPref : (inferGender(myName) || idol.gender || 'female');
  const surnames = await getSurnames();
  const syllables = await getSyllables();

  const n1 = rnd(seed), n2 = rnd(seed+1), n3 = rnd(seed+2), n4 = rnd(seed+3);

  const surname1 = pick(surnames, n1);
  const full1_kr = surname1 + idol.name_kr;
  const full1_en = romanize(full1_kr);

  const pool = finalGender==='female' ? syllables.female : syllables.male;
  const preset = RELATION_PRESET[relation] || RELATION_PRESET.lover;
  const given2 = styleFrom(idol.name_kr, pool, preset, n2);
  const surname2 = pick(surnames, n3);
  const full2_kr = surname2 + given2;
  const full2_en = romanize(full2_kr);

  const chemistry = 70 + (n4 % 31);

  return { seed, finalGender, chemistry, sameName:{full_kr:full1_kr, full_en:full1_en}, styled:{full_kr:full2_kr, full_en:full2_en} };
}