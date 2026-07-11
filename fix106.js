// fix106.js — Add IBEW Inside trade history page + activate dropdown link
const fs = require('fs');
const path = require('path');

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

// 1. Add new page key to URL whitelist
code = replaceOnce(code,
  `const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','retirement','health','benefits','about','contact','jobboard','wages'];`,
  `const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew-i','retirement','health','benefits','about','contact','jobboard','wages'];`,
  '1: validPages whitelist');
console.log('1/4 ✓ Added history-ibew-i to URL whitelist');

// 2. Update the History dropdown so "IBEW Inside" routes to the new page (live, not greyed)
code = replaceOnce(code,
  `                  {[
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
                  ))}`,
  `                  {[
                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew-i', live:true},
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
                    <div key={t.key} onMouseDown={() => { setPage(t.live ? t.page : "trade-history"); setHistoryOpen(false); }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`} style={{opacity: t.live ? 1 : 0.55, cursor:"pointer"}}>
                      <span className="nav-dropdown-label" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                        <span>{t.name}</span>
                        {!t.live && <span style={{fontSize:9, fontWeight:700, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", background:"rgba(250,128,89,0.12)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"2px 8px", whiteSpace:"nowrap"}}>{lang==="es" ? "Pronto" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</span>}
                      </span>
                    </div>
                  ))}`,
  '2: dropdown items with live flag');
console.log('2/4 ✓ Updated dropdown to mark IBEW Inside as live');

// 3. Add meta tag for the new page
code = replaceOnce(code,
  `      'trade-history': { title: "Union Pathways — Trade History (Coming Soon)", desc: "Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor." },`,
  `      'trade-history': { title: "Union Pathways — Trade History (Coming Soon)", desc: "Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor." },
      'history-ibew-i': { title: "IBEW History — Wired for the Long Haul · Union Pathways", desc: "The full history of the International Brotherhood of Electrical Workers from its 1891 founding above a St. Louis dance hall to today. Henry Miller, the Reid-Murphy split, the Council on Industrial Relations, the data center boom, and the path back to one million members." },`,
  '3: meta tag for ibew history');
console.log('3/4 ✓ Added meta tag for /history-ibew-i');

// 4. Inject the IBEW history page JSX block right before the trade-history placeholder
const newPageJsx = fs.readFileSync(path.join(__dirname, 'ibew-history-page.jsx'), 'utf8');

const insertAnchor = `        {page === "trade-history" && (`;
if (!code.includes(insertAnchor)) {
  console.error('ERROR: trade-history anchor not found');
  process.exit(1);
}
if (code.split(insertAnchor).length > 2) {
  console.error('ERROR: trade-history anchor matches more than once');
  process.exit(1);
}
code = code.replace(insertAnchor, newPageJsx.trimEnd() + '\n\n' + insertAnchor);
console.log('4/4 ✓ Injected IBEW history page JSX block');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: IBEW Inside trade history page" && git push\n');
