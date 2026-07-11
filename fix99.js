// fix99.js — Add search-as-you-type filter above local pickers on Job Board + Wages
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

// 1. Add jobLocalSearch + wageLocalSearch state
code = replaceOnce(code,
  `  const [jobTrade, setJobTrade] = useState('');
  const [jobLocal, setJobLocal] = useState('');`,
  `  const [jobTrade, setJobTrade] = useState('');
  const [jobLocal, setJobLocal] = useState('');
  const [jobLocalSearch, setJobLocalSearch] = useState('');`,
  '1a: jobLocalSearch state');

code = replaceOnce(code,
  `  const [wageTrade, setWageTrade] = useState('');
  const [wageLocal, setWageLocal] = useState('');`,
  `  const [wageTrade, setWageTrade] = useState('');
  const [wageLocal, setWageLocal] = useState('');
  const [wageLocalSearch, setWageLocalSearch] = useState('');`,
  '1b: wageLocalSearch state');
console.log('1/4 ✓ Added search state for both pickers');

// 2. Reset jobLocalSearch when trade changes
code = replaceOnce(code,
  `<select value={jobTrade} onChange={e => { setJobTrade(e.target.value); setJobLocal(''); }}`,
  `<select value={jobTrade} onChange={e => { setJobTrade(e.target.value); setJobLocal(''); setJobLocalSearch(''); }}`,
  '2a: reset jobLocalSearch on trade change');

code = replaceOnce(code,
  `<select value={wageTrade} onChange={e => { setWageTrade(e.target.value); setWageLocal(''); }}`,
  `<select value={wageTrade} onChange={e => { setWageTrade(e.target.value); setWageLocal(''); setWageLocalSearch(''); }}`,
  '2b: reset wageLocalSearch on trade change');
console.log('2/4 ✓ Reset searches when trade changes');

// 3. Reset searches in the form-reset handlers
code = replaceOnce(code,
  `setJobSubmitted(false); setJobTrade(''); setJobLocal(''); setJobStatus(''); setJobCalls(''); setJobDate('');`,
  `setJobSubmitted(false); setJobTrade(''); setJobLocal(''); setJobLocalSearch(''); setJobStatus(''); setJobCalls(''); setJobDate('');`,
  '3a: reset jobLocalSearch in handler');

code = replaceOnce(code,
  `setWageSubmitted(false); setWageTrade(''); setWageLocal(''); setWageMethod('');`,
  `setWageSubmitted(false); setWageTrade(''); setWageLocal(''); setWageLocalSearch(''); setWageMethod('');`,
  '3b: reset wageLocalSearch in handler');
console.log('3/4 ✓ Reset searches in form-reset handlers');

// 4. Add search input above each local <select> + filter the options
// JOB BOARD
const jobOld = `                          <select value={jobLocal} onChange={e => setJobLocal(e.target.value)} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:jobLocal ? "#fff" : "var(--muted)", fontSize:14, fontFamily:"'Inter',sans-serif", cursor:"pointer"}}>
                            <option value="">{lang==="es" ? "Selecciona tu local..." : lang==="pl" ? "Wybierz lokal..." : "Select your local..."}</option>
                            {[...selectedTradeLocals].sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; }).map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>)}
                          </select>`;

const jobNew = `                          <input
                            type="text"
                            value={jobLocalSearch}
                            onChange={e => setJobLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, fontFamily:"'Inter',sans-serif", marginBottom:8, boxSizing:"border-box"}}
                          />
                          <select value={jobLocal} onChange={e => setJobLocal(e.target.value)} size={Math.min(8, Math.max(4, [...selectedTradeLocals].filter(l => { if (!jobLocalSearch.trim()) return true; const q = jobLocalSearch.trim().toLowerCase(); return l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q); }).length))} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"8px", color:jobLocal ? "#fff" : "var(--muted)", fontSize:14, fontFamily:"'Inter',sans-serif", cursor:"pointer"}}>
                            {(() => {
                              const q = jobLocalSearch.trim().toLowerCase();
                              const filtered = [...selectedTradeLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <option disabled value="">{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</option>;
                              return filtered.map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>);
                            })()}
                          </select>`;

code = replaceOnce(code, jobOld, jobNew, '4a: job local picker');

// WAGES
const wageOld = `                          <select value={wageLocal} onChange={e => setWageLocal(e.target.value)} style={{...inputStyle, cursor:"pointer", color: wageLocal ? "#fff" : "var(--muted)"}}>
                            <option value="">{lang==="es" ? "Selecciona tu local..." : lang==="pl" ? "Wybierz lokal..." : "Select your local..."}</option>
                            {[...wageLocals].sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; }).map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>)}
                          </select>`;

const wageNew = `                          <input
                            type="text"
                            value={wageLocalSearch}
                            onChange={e => setWageLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{...inputStyle, fontSize:13, padding:"10px 14px", marginBottom:8}}
                          />
                          <select value={wageLocal} onChange={e => setWageLocal(e.target.value)} size={Math.min(8, Math.max(4, [...wageLocals].filter(l => { if (!wageLocalSearch.trim()) return true; const q = wageLocalSearch.trim().toLowerCase(); return l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q); }).length))} style={{...inputStyle, padding:"8px", cursor:"pointer", color: wageLocal ? "#fff" : "var(--muted)"}}>
                            {(() => {
                              const q = wageLocalSearch.trim().toLowerCase();
                              const filtered = [...wageLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <option disabled value="">{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</option>;
                              return filtered.map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>);
                            })()}
                          </select>`;

code = replaceOnce(code, wageOld, wageNew, '4b: wage local picker');
console.log('4/4 ✓ Added search input + filtered list to both pickers');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: searchable local picker on job board + wages" && git push\n');
