
import { q, on, setHTML } from './ui/dom.js';
import { renderHeader, renderResultCard } from './ui/templates.js';
import { relationUI, t, getLang } from './i18n.js';
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
    if(!idol){ alert(t('alert.selectIdol')); return; }

    const relation = relationValue();
    const genderPref = genderValue();

    const { chemistry, sameName, styled } = await generate({ myName, idol, genderPref, relation });

    const header = renderHeader(myName, idol);
    const relUI = relationUI()[relation];

    const sameCopy = makeCopy(relation, chemistry, idol, myName, sameName.full_kr, sameName.full_en);
    const styledCopy = makeCopy(relation, chemistry, idol, myName, styled.full_kr, styled.full_en);

    const sameCard = renderResultCard(relUI.label, relUI.icon, sameName.full_kr, sameName.full_en, chemistry, sameCopy);
    const styledCard = renderResultCard(relUI.label, relUI.icon, styled.full_kr, styled.full_en, chemistry, styledCopy);

    setHTML(q('#header'), header);
    setHTML(q('#results'), sameCard + styledCard);
    window.scrollTo({top: q('#results').offsetTop - 10, behavior: 'smooth'});
  });
}

function friendGiven(fullKr){ return fullKr.slice(1); }

function makeCopy(relation, chem, idol, myName, friendFullKr, friendFullEn){
  const rel = relationUI()[relation];
  const phrase = rel.copies[chem % rel.copies.length];
  const lang = getLang();
  if(lang === 'ko'){
    return `👉 '${idol.name_kr} & ${friendGiven(friendFullKr)}', ${phrase} ${myName}와도 환상의 조합이에요.`;
  }
  return `👉 '${idol.name_en} & ${friendFullEn}', ${phrase} Also a perfect match with ${myName}.`;
}

init();
