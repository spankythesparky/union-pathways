// fix165.js — Two surgical changes:
//   1. Rebuild the trade-history page as a real index of all live trades
//   2. Disable click on "Coming Soon" trades in the desktop History dropdown

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('// REBUILT TRADE HISTORY INDEX — fix165')) {
  console.error('ERROR: trade-history page already rebuilt. Aborting.');
  process.exit(1);
}

// EDIT 1: Replace the trade-history page block
const oldPageBlock = `        {page === "trade-history" && (
          <div style={{padding:"80px 24px", textAlign:"center", maxWidth:720, margin:"0 auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", letterSpacing:3, textTransform:"uppercase", marginBottom:16}}>{lang===\"es\" ? \"Proximamente\" : lang===\"pl\" ? \"Wkrotce\" : \"Coming Soon\"}</div>
            <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(36px, 6vw, 60px)", fontWeight:900, color:"#fff", lineHeight:1, margin:"0 0 20px 0"}}>
              {lang===\"es\" ? \"Historia del Oficio\" : lang===\"pl\" ? \"Historia Zawodu\" : \"Trade History\"}
              <br/>
              <span style={{color:"#FA8059"}}>{lang===\"es\" ? \"En Construccion\" : lang===\"pl\" ? \"W Budowie\" : \"In Progress\"}</span>
            </h1>
            <p style={{fontSize:16, color:"rgba(255,255,255,0.75)", lineHeight:1.7, marginBottom:32}}>
              {lang===\"es\" ? \"Estamos trabajando en historias detalladas para cada oficio sindical. Mientras tanto, lee la historia general del movimiento sindical.\" : lang===\"pl\" ? \"Pracujemy nad szczegolowymi historiami dla kazdego zawodu zwiazkowego. Tymczasem przeczytaj ogolna historie ruchu zwiazkowego.\" : \"We're putting together deep-dive histories for each individual trade — IBEW, UA, SMART, and the rest. While they're in the works, take a walk through the broader story of organized labor.\"}
            </p>
            <button onClick={() => setPage("history")} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1, textTransform:"uppercase", padding:"14px 32px", border:"none", borderRadius:50, cursor:"pointer"}}>
              {lang===\"es\" ? \"Leer Historia General\" : lang===\"pl\" ? \"Czytaj Historie Ogolna\" : \"Read General Union History\"}
            </button>
          </div>
        )}`;

const newPageBlock = `        {page === "trade-history" && (() => {
          // REBUILT TRADE HISTORY INDEX — fix165
          const TRADES = [
            { key:'ibew',  name:'IBEW',         full:'International Brotherhood of Electrical Workers',                                          page:'history-ibew',  founded:1891, members:'887K+', color:'#F5C518', sub:'Henry Miller, the Reid-Murphy split, and the Council on Industrial Relations.' },
            { key:'ua',    name:'UA',           full:'United Association of Plumbers, Pipefitters, Steamfitters & HVACR',                        page:'history-ua',    founded:1889, members:'365K+', color:'#3B9EFF', sub:'The Steamfitters War, the Veterans in Piping program, and an industrial pipeline at full speed.' },
            { key:'smart', name:'SMART',        full:'Sheet Metal, Air, Rail and Transportation Workers',                                        page:'history-smart', founded:1888, members:'200K+', color:'#B0BEC5', sub:'From Toledo tinsmiths to a 2014 merger that joined sheet metal with the railroads.' },
            { key:'bac',   name:'BAC',          full:'International Union of Bricklayers and Allied Craftworkers',                               page:'history-bac',   founded:1865, members:'70K+',  color:'#C04A36', sub:'The oldest building trades union in North America. Stonecutters, masons, and tile.' },
            { key:'iron',  name:'Iron Workers', full:'International Association of Bridge, Structural, Ornamental & Reinforcing Iron Workers',   page:'history-iron',  founded:1896, members:'130K+', color:'#D85F2E', sub:'High steel, the Bonus Marchers, and the trade with the highest fatality rate in construction.' },
            { key:'insul', name:'AWIU',         full:'Heat & Frost Insulators and Allied Workers',                                               page:'history-insul', founded:1903, members:'30K+',  color:'#A8623A', sub:'Founded in St. Louis. Pearl Harbor reconstruction, asbestos, and the energy-conservation specialists.' },
            { key:'iuec',  name:'IUEC',         full:'International Union of Elevator Constructors',                                             page:'history-iuec',  founded:1901, members:'30K+',  color:'#4A7B9D', sub:'Going up. From Otis at the Crystal Palace to the highest-paid building trade in the United States.' },
            { key:'ufcw',  name:'UFCW',         full:'United Food and Commercial Workers International Union',                                   page:'history-ufcw',  founded:1979, members:'1.2M+', color:'#10A37F', sub:'Grocery, retail, and meatpacking. Strike Twenty-Six, Smithfield, and the largest private-sector union.' },
          ];
          const COMING = [
            { name:'IUOE — Operating Engineers',    sub:'Heavy equipment, stationary engineers, and mechanics.' },
            { name:'UBC — Carpenters',              sub:'11 trade specialties, 500K+ members, the McCarron-era reform legacy.' },
            { name:'LIUNA — Laborers',              sub:'Construction laborers, hazmat workers, and the union that built the Big Dig.' },
          ];
          return (
            <div id="trade-history-root">
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #FA8059, #F5C518)', transition:'width 0.1s'}} />
              </div>
              <div style={{padding:'40px 24px 60px', maxWidth:1100, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:18}}>{lang===\"es\" ? \"Historias por Oficio\" : lang===\"pl\" ? \"Historia Wedlug Zawodu\" : \"Trade Histories\"}</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0', letterSpacing:'-0.01em'}}>
                  {lang===\"es\" ? <>Cada oficio. <span style={{color:'#FA8059'}}>Su propia historia.</span></> : lang===\"pl\" ? <>Kazdy zawod. <span style={{color:'#FA8059'}}>Wlasna historia.</span></> : <>Every trade. <span style={{color:'#FA8059'}}>Its own story.</span></>}
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.8)', lineHeight:1.6, maxWidth:700, margin:0}}>
                  {lang===\"es\" ? \"Las uniones de oficios de la construccion no son solo entidades juridicas: son siglos de luchas, fundaciones, divisiones y reconstrucciones. Aqui estan los relatos completos.\" : lang===\"pl\" ? \"Zwiazki zawodowe budowlane to nie tylko podmioty prawne: to wieki walki, zakladania, podzialow i odbudowy. Oto pelne historie.\" : \"Building trade unions aren't just legal entities — they're centuries of strikes, foundings, splits, and rebuilds. Here are the full stories, one trade at a time.\"}
                </p>
              </div>
              <div style={{padding:'40px 24px', maxWidth:1100, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2.5, textTransform:'uppercase', marginBottom:24}}>{lang===\"es\" ? \"Disponibles\" : lang===\"pl\" ? \"Dostepne\" : \"Live\"} · {TRADES.length}</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16}}>
                  {TRADES.map(t => (
                    <div
                      key={t.key}
                      onClick={() => setPage(t.page)}
                      style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', borderLeft:'4px solid '+t.color, borderRadius:14, padding:'22px 24px', cursor:'pointer', transition:'all 0.2s'}}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='translateY(0)'; }}
                    >
                      <div>
                        <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:'#fff', margin:0, lineHeight:1.1}}>{t.name}</h3>
                        <div style={{fontSize:11, color:t.color, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700, marginTop:4}}>{t.full}</div>
                      </div>
                      <div style={{display:'flex', gap:16, marginTop:12, marginBottom:12, fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>
                        <span><span style={{color:'#fff'}}>{t.founded}</span> · {lang===\"es\" ? \"Fundado\" : lang===\"pl\" ? \"Zalozony\" : \"Founded\"}</span>
                        <span><span style={{color:'#fff'}}>{t.members}</span> · {lang===\"es\" ? \"Miembros\" : lang===\"pl\" ? \"Czlonkowie\" : \"Members\"}</span>
                      </div>
                      <p style={{fontSize:13.5, color:'rgba(255,255,255,0.75)', lineHeight:1.55, margin:'8px 0 0 0', fontStyle:'italic'}}>{t.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding:'40px 24px 80px', maxWidth:1100, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.55)', letterSpacing:2.5, textTransform:'uppercase', marginBottom:24}}>{lang===\"es\" ? \"Proximamente\" : lang===\"pl\" ? \"Wkrotce\" : \"Coming Soon\"} · {COMING.length}</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16}}>
                  {COMING.map((t, i) => (
                    <div key={i} style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:14, padding:'22px 24px', opacity:0.55}}>
                      <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:'#fff', margin:'0 0 8px 0', lineHeight:1.1}}>{t.name}</h3>
                      <p style={{fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.55, margin:0, fontStyle:'italic'}}>{t.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding:'40px 24px 80px', maxWidth:1100, margin:'0 auto', textAlign:'center'}}>
                <p style={{fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:18, fontStyle:'italic'}}>{lang===\"es\" ? \"Para el panorama completo del movimiento sindical:\" : lang===\"pl\" ? \"Aby zobaczyc pelny obraz ruchu zwiazkowego:\" : \"For the full arc of the labor movement:\"}</p>
                <button onClick={() => setPage('history')} style={{background:'transparent', color:'#F5C518', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'14px 32px', border:'1px solid rgba(245,197,24,0.4)', borderRadius:50, cursor:'pointer'}}>
                  {lang===\"es\" ? \"Leer Historia General\" : lang===\"pl\" ? \"Czytaj Historie Ogolna\" : \"Read General Union History\"}
                </button>
              </div>
            </div>
          );
        })()}`;

if (!src.includes(oldPageBlock)) {
  console.error('ERROR: Could not find trade-history page block. Aborting.');
  process.exit(1);
}
src = src.replace(oldPageBlock, () => newPageBlock);

// EDIT 2: Disable Coming Soon clicks in desktop History dropdown
const dropdownOld = `                    <div key={t.key} onMouseDown={() => { setPage(t.live ? t.page : "trade-history"); setHistoryOpen(false); }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`} style={{opacity: t.live ? 1 : 0.55, cursor:"pointer"}}>`;
const dropdownNew = `                    <div key={t.key} onMouseDown={() => { if (t.live) { setPage(t.page); setHistoryOpen(false); } }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`} style={{opacity: t.live ? 1 : 0.55, cursor: t.live ? "pointer" : "not-allowed"}}>`;

if (!src.includes(dropdownOld)) {
  console.error('ERROR: Could not find History dropdown click handler. Aborting.');
  process.exit(1);
}
src = src.replace(dropdownOld, () => dropdownNew);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Two changes applied:');
console.log('  1. trade-history page rebuilt as a useful index of 8 live trades + 3 coming soon');
console.log('  2. Coming Soon dropdown entries (IUOE, UBC, LIUNA) are non-clickable');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: rebuild trade-history index, disable coming-soon clicks" && git push');
console.log('');
