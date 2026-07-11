// fix105.js — Move History out of Learn dropdown into its own top-level dropdown with trade-history stubs
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// 1. Add historyOpen state next to learnOpen
code = replaceOnce(code,
  `  const [learnOpen, setLearnOpen] = useState(false);`,
  `  const [learnOpen, setLearnOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);`,
  '1: historyOpen state');
console.log('1/7 ✓ Added historyOpen state');

// 2. Add 'trade-history' to validPages
code = replaceOnce(code,
  `const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','retirement','health','benefits','about','contact','jobboard','wages'];`,
  `const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','retirement','health','benefits','about','contact','jobboard','wages'];`,
  '2: validPages whitelist');
console.log('2/7 ✓ Added trade-history to URL whitelist');

// 3. Remove History from Learn dropdown's "active" condition
code = replaceOnce(code,
  `className={\`nav-dropdown-btn\${(page==="history"||page==="benefits"||page==="retirement"||page==="health"||page==="veterans")?" active":""}\${learnOpen?" open":""}\`}`,
  `className={\`nav-dropdown-btn\${(page==="benefits"||page==="retirement"||page==="health"||page==="veterans")?" active":""}\${learnOpen?" open":""}\`}`,
  '3: Learn active condition');
console.log('3/7 ✓ Removed History from Learn active state');

// 4. Remove the History item from Learn dropdown menu
code = replaceOnce(code,
  `                  <div className={\`nav-dropdown-item\${page==="history"?" active":""}\`} onMouseDown={() => { setPage("history"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia Związkowa" : "Union History"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Cómo los sindicatos construyeron América" : lang==="pl" ? "Jak związki budowały Amerykę" : "How unions built America"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="benefits"?" active":""}\`} onMouseDown={() => { setPage("benefits"); setLearnOpen(false); }}>`,
  `                  <div className={\`nav-dropdown-item\${page==="benefits"?" active":""}\`} onMouseDown={() => { setPage("benefits"); setLearnOpen(false); }}>`,
  '4: remove History from Learn menu');
console.log('4/7 ✓ Removed History from Learn dropdown');

// 5. Insert new History dropdown nav button right before Job Board
code = replaceOnce(code,
  `            <button className={\`nav-link \${page==="jobboard"?"active":""}\`} onClick={() => setPage("jobboard")}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>`,
  `            {/* HISTORY DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="history"||page==="trade-history")?" active":""}\${historyOpen?" open":""}\`}
                onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); }}
                onBlur={() => setTimeout(() => setHistoryOpen(false), 150)}
              >
                {lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {historyOpen && (
                <div className="nav-dropdown-menu" style={{minWidth:240}}>
                  <div className={\`nav-dropdown-item\${page==="history"?" active":""}\`} onMouseDown={() => { setPage("history"); setHistoryOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Historia General" : lang==="pl" ? "Historia Ogolna" : "General Union History"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "El movimiento desde el siglo XII" : lang==="pl" ? "Ruch od XII wieku" : "The full movement from the 12th century"}</span>
                  </div>
                  {[
                    {key:'IBEW_I', name:'IBEW Inside'},
                    {key:'IBEW_L', name:'IBEW Lineman'},
                    {key:'UA', name:'UA — Plumbers & Pipefitters'},
                    {key:'SMART', name:'SMART — Sheet Metal'},
                    {key:'BAC', name:'BAC — Bricklayers'},
                    {key:'IW', name:'Ironworkers'},
                    {key:'HFIAW', name:'HFIAW — Insulators'},
                    {key:'IUEC', name:'IUEC — Elevator Constructors'},
                    {key:'IUOE', name:'IUOE — Operating Engineers'},
                    {key:'UBC', name:'UBC — Carpenters'},
                    {key:'LIUNA', name:'LIUNA — Laborers'},
                  ].map(t => (
                    <div key={t.key} onMouseDown={() => { setPage("trade-history"); setHistoryOpen(false); }} className="nav-dropdown-item" style={{opacity:0.55, cursor:"pointer"}}>
                      <span className="nav-dropdown-label" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                        <span>{t.name}</span>
                        <span style={{fontSize:9, fontWeight:700, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", background:"rgba(250,128,89,0.12)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"2px 8px", whiteSpace:"nowrap"}}>{lang==="es" ? "Pronto" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={\`nav-link \${page==="jobboard"?"active":""}\`} onClick={() => setPage("jobboard")}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>`,
  '5: add History dropdown');
console.log('5/7 ✓ Added History dropdown nav with 11 trade stubs');

// 6. Add trade-history placeholder page (before benefits page)
code = replaceOnce(code,
  `        {page === "benefits" && (`,
  `        {page === "trade-history" && (
          <div style={{padding:"80px 24px", textAlign:"center", maxWidth:720, margin:"0 auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", letterSpacing:3, textTransform:"uppercase", marginBottom:16}}>{lang==="es" ? "Proximamente" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</div>
            <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(36px, 6vw, 60px)", fontWeight:900, color:"#fff", lineHeight:1, margin:"0 0 20px 0"}}>
              {lang==="es" ? "Historia del Oficio" : lang==="pl" ? "Historia Zawodu" : "Trade History"}
              <br/>
              <span style={{color:"#FA8059"}}>{lang==="es" ? "En Construccion" : lang==="pl" ? "W Budowie" : "In Progress"}</span>
            </h1>
            <p style={{fontSize:16, color:"rgba(255,255,255,0.75)", lineHeight:1.7, marginBottom:32}}>
              {lang==="es" ? "Estamos trabajando en historias detalladas para cada oficio sindical. Mientras tanto, lee la historia general del movimiento sindical." : lang==="pl" ? "Pracujemy nad szczegolowymi historiami dla kazdego zawodu zwiazkowego. Tymczasem przeczytaj ogolna historie ruchu zwiazkowego." : "We're putting together deep-dive histories for each individual trade — IBEW, UA, SMART, and the rest. While they're in the works, take a walk through the broader story of organized labor."}
            </p>
            <button onClick={() => setPage("history")} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1, textTransform:"uppercase", padding:"14px 32px", border:"none", borderRadius:50, cursor:"pointer"}}>
              {lang==="es" ? "Leer Historia General" : lang==="pl" ? "Czytaj Historie Ogolna" : "Read General Union History"}
            </button>
          </div>
        )}

        {page === "benefits" && (`,
  '6: trade-history placeholder page');
console.log('6/7 ✓ Added trade-history placeholder page');

// 7. Add meta tags for the history pages so social shares show right description
code = replaceOnce(code,
  `      wages:     { title: "Union Pathways — Local Wages Verified by Members", desc: "Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place." },`,
  `      wages:     { title: "Union Pathways — Local Wages Verified by Members", desc: "Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place." },
      'trade-history': { title: "Union Pathways — Trade History (Coming Soon)", desc: "Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor." },`,
  '7: trade-history meta');
console.log('7/7 ✓ Added trade-history meta tags');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: History as top-level dropdown with trade-history stubs" && git push\n');
