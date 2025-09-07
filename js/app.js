

import { q, on, setHTML } from './ui/dom.js';
import { RELATION_UI, renderHeader, renderResultCard } from './ui/templates.js';
import { getIdols, resolveIdol } from './data/idols.js';
import { generate } from './generator/engine.js';

function relationValue(){ return q('input[name="relation"]:checked').value; }
function genderValue(){ return q('input[name="gender"]:checked').value; }

function populateIdolDatalist(list, idols){
  setHTML(list, idols.map(i => `<option value="${i.name_kr}">${i.group}</option>`).join(''));
}

async function init(){
  const idols = await getIdols();
  populateIdolDatalist(q('#idolList'), idols);

  on(q('#form'), 'submit', async (e)=>{
    e.preventDefault();
    const myName = q('#myName').value.trim();
    const idolInput = q('#idol').value.trim();
    const idol = await resolveIdol(idolInput);
    if(!idol){ alert('아이돌 이름을 정확히 선택해주세요.'); return; }

    const relation = relationValue();
    const genderPref = genderValue();

    const { chemistry, sameName, styled } = await generate({ myName, idol, genderPref, relation });

    const header = renderHeader(myName, idol);
    const relUI = RELATION_UI[relation];

    const sameCard = renderResultCard(relUI.label, relUI.icon, sameName.full_kr, sameName.full_en, chemistry,
      makeCopyKR(relation, chemistry, idol, myName, sameName.full_kr));

    const styledCard = renderResultCard(relUI.label, relUI.icon, styled.full_kr, styled.full_en, chemistry,
      makeCopyKR(relation, chemistry, idol, myName, styled.full_kr));

    setHTML(q('#header'), header);
    setHTML(q('#results'), sameCard + styledCard);
    window.scrollTo({top: q('#results').offsetTop - 10, behavior: 'smooth'});
  });
}

function friendGiven(fullKr){ return fullKr.slice(1); }

function makeCopyKR(relation, chem, idol, myName, friendFullKr){
  const rel = RELATION_UI[relation];
  const phrase = rel.copies[chem % rel.copies.length];
  return `👉 '${idol.name_kr} & ${friendGiven(friendFullKr)}', ${phrase} ${myName}와도 환상의 조합이에요.`;
}

init();