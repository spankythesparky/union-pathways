const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Find and replace the SEO useEffect - match by its unique dependency array
const oldDep = '  }, [lang]);';
const newEffect = `  }, [lang, page]);`;

// Find the SEO useEffect specifically
const seoStart = c.indexOf("  useEffect(() => {\n    const pageMeta");
if (seoStart !== -1) {
  console.log('Already updated — SEO effect already references page');
  process.exit(0);
}

// Find the lang-only SEO useEffect
const langEffectStart = c.indexOf('  useEffect(() => {\n    document.title = lang');
if (langEffectStart === -1) { console.error('ERROR: SEO useEffect not found'); process.exit(1); }

const langEffectEnd = c.indexOf('  }, [lang]);', langEffectStart) + '  }, [lang]);'.length;
const oldEffect = c.slice(langEffectStart, langEffectEnd);

const newEffectFull = `  useEffect(() => {
    const PAGE_META = {
      home:      { title: "Union Pathways — Find Your Nearest Union Construction Local", desc: "Find your nearest union construction local — IBEW, UA, SMART, BAC, UBC, Ironworkers, Insulators, Laborers and more. Free resource for tradespeople." },
      quiz:      { title: "Union Pathways — Which Trade Is Right For You?", desc: "Take our free quiz to find out which union construction trade matches your skills, interests, and goals." },
      careers:   { title: "Union Pathways — Career Paths in the Union Trades", desc: "Learn about apprenticeships, wages, and career paths in union construction trades. Earn while you learn — no college debt." },
      checklist: { title: "Union Pathways — How to Join a Union", desc: "Step-by-step guide to joining a union construction apprenticeship. Requirements, timeline, and how to apply." },
      history:   { title: "Union Pathways — Union History in America", desc: "The 40-hour work week, the weekend, workplace safety — every benefit workers have today was fought for by unions. Learn the history." },
      veterans:  { title: "Union Pathways — Veterans and the Union Trades", desc: "Military veterans are a perfect fit for union construction apprenticeships. Learn about Helmets to Hardhats and other veteran programs." },
      contact:   { title: "Union Pathways — Contact Us", desc: "Get in touch with the Union Pathways team. We help tradespeople find their nearest union local." },
    };
    const pm = PAGE_META[page] || PAGE_META.home;
    document.title = pm.title;
    const setMeta = (sel, attr, val) => { let el = document.querySelector(sel); if (!el) { el = document.createElement(sel.includes('[name') ? 'meta' : sel.includes('[property') ? 'meta' : 'link'); if (attr === 'name') el.name = val.split('=')[0]; document.head.appendChild(el); } };
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = "description"; document.head.appendChild(metaDesc); }
    metaDesc.content = pm.desc;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property','og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = pm.title;
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property','og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = pm.desc;
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property','og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = 'https://unionpathways.com' + (page === 'home' ? '' : '/' + page);
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement('link'); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = 'https://unionpathways.com' + (page === 'home' ? '' : '/' + page);
  }, [lang, page]);`;

c = c.replace(oldEffect, newEffectFull);
fs.writeFileSync('src/App.jsx', c);
console.log('done');
