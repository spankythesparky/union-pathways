// fix100.js — Disable mobile autocorrect/autocomplete on local search; add match counter
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

// JOB BOARD search input: add mobile-safe attrs
code = replaceOnce(code,
  `                          <input
                            type="text"
                            value={jobLocalSearch}
                            onChange={e => setJobLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, fontFamily:"'Inter',sans-serif", marginBottom:8, boxSizing:"border-box"}}
                          />`,
  `                          <input
                            type="search"
                            inputMode="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={jobLocalSearch}
                            onChange={e => setJobLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:16, fontFamily:"'Inter',sans-serif", marginBottom:8, boxSizing:"border-box"}}
                          />
                          {jobLocalSearch.trim() && (
                            <div style={{fontSize:11, color:"rgba(160,180,196,0.7)", marginBottom:8, fontFamily:"'Inter',sans-serif"}}>
                              {(() => {
                                const q = jobLocalSearch.trim().toLowerCase();
                                const n = selectedTradeLocals.filter(l => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q)).length;
                                return n + ' ' + (lang==="es" ? "resultados" : lang==="pl" ? "wynikow" : (n === 1 ? "match" : "matches"));
                              })()}
                            </div>
                          )}`,
  '1: job search input attrs + counter');
console.log('1/2 ✓ Job board search input upgraded');

// WAGES search input
code = replaceOnce(code,
  `                          <input
                            type="text"
                            value={wageLocalSearch}
                            onChange={e => setWageLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{...inputStyle, fontSize:13, padding:"10px 14px", marginBottom:8}}
                          />`,
  `                          <input
                            type="search"
                            inputMode="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={wageLocalSearch}
                            onChange={e => setWageLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{...inputStyle, fontSize:16, padding:"10px 14px", marginBottom:8}}
                          />
                          {wageLocalSearch.trim() && (
                            <div style={{fontSize:11, color:"rgba(160,180,196,0.7)", marginBottom:8, fontFamily:"'Inter',sans-serif"}}>
                              {(() => {
                                const q = wageLocalSearch.trim().toLowerCase();
                                const n = wageLocals.filter(l => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q)).length;
                                return n + ' ' + (lang==="es" ? "resultados" : lang==="pl" ? "wynikow" : (n === 1 ? "match" : "matches"));
                              })()}
                            </div>
                          )}`,
  '2: wage search input attrs + counter');
console.log('2/2 ✓ Wages search input upgraded');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: mobile-safe search input on local pickers + match counter" && git push\n');
