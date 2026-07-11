// fix101.js — Replace <select size> local pickers with custom styled list buttons
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

// JOB BOARD: replace <select> with custom list
const jobOld = `                          <select value={jobLocal} onChange={e => setJobLocal(e.target.value)} size={Math.min(8, Math.max(4, [...selectedTradeLocals].filter(l => { if (!jobLocalSearch.trim()) return true; const q = jobLocalSearch.trim().toLowerCase(); return l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q); }).length))} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"8px", color:jobLocal ? "#fff" : "var(--muted)", fontSize:14, fontFamily:"'Inter',sans-serif", cursor:"pointer"}}>
                            {(() => {
                              const q = jobLocalSearch.trim().toLowerCase();
                              const filtered = [...selectedTradeLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <option disabled value="">{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</option>;
                              return filtered.map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>);
                            })()}
                          </select>`;

const jobNew = `                          <div style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:6, maxHeight:260, overflowY:"auto", fontFamily:"'Inter',sans-serif"}}>
                            {(() => {
                              const q = jobLocalSearch.trim().toLowerCase();
                              const filtered = [...selectedTradeLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <div style={{padding:"14px 16px", color:"rgba(160,180,196,0.7)", fontSize:13, textAlign:"center"}}>{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</div>;
                              return filtered.map(l => {
                                const isSelected = String(jobLocal) === String(l.id);
                                return (
                                  <div key={l.id} onClick={() => setJobLocal(String(l.id))} style={{padding:"10px 14px", borderRadius:8, marginBottom:2, cursor:"pointer", background: isSelected ? "rgba(250,128,89,0.2)" : "transparent", border: isSelected ? "1px solid rgba(250,128,89,0.5)" : "1px solid transparent", color: isSelected ? "#FA8059" : "#fff", fontSize:14, fontWeight: isSelected ? 700 : 500, transition:"background 0.12s"}} onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                                    <div style={{fontWeight:700, fontSize:14}}>{l.name}</div>
                                    <div style={{fontSize:12, color: isSelected ? "rgba(250,128,89,0.85)" : "rgba(160,180,196,0.85)", marginTop:2}}>{l.city}, {l.state}</div>
                                  </div>
                                );
                              });
                            })()}
                          </div>`;

code = replaceOnce(code, jobOld, jobNew, '1: job board picker');
console.log('1/2 ✓ Job board picker rebuilt as styled list');

// WAGES: same treatment
const wageOld = `                          <select value={wageLocal} onChange={e => setWageLocal(e.target.value)} size={Math.min(8, Math.max(4, [...wageLocals].filter(l => { if (!wageLocalSearch.trim()) return true; const q = wageLocalSearch.trim().toLowerCase(); return l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q); }).length))} style={{...inputStyle, padding:"8px", cursor:"pointer", color: wageLocal ? "#fff" : "var(--muted)"}}>
                            {(() => {
                              const q = wageLocalSearch.trim().toLowerCase();
                              const filtered = [...wageLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <option disabled value="">{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</option>;
                              return filtered.map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>);
                            })()}
                          </select>`;

const wageNew = `                          <div style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:6, maxHeight:260, overflowY:"auto", fontFamily:"'Inter',sans-serif"}}>
                            {(() => {
                              const q = wageLocalSearch.trim().toLowerCase();
                              const filtered = [...wageLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <div style={{padding:"14px 16px", color:"rgba(160,180,196,0.7)", fontSize:13, textAlign:"center"}}>{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</div>;
                              return filtered.map(l => {
                                const isSelected = String(wageLocal) === String(l.id);
                                return (
                                  <div key={l.id} onClick={() => setWageLocal(String(l.id))} style={{padding:"10px 14px", borderRadius:8, marginBottom:2, cursor:"pointer", background: isSelected ? "rgba(250,128,89,0.2)" : "transparent", border: isSelected ? "1px solid rgba(250,128,89,0.5)" : "1px solid transparent", color: isSelected ? "#FA8059" : "#fff", fontSize:14, fontWeight: isSelected ? 700 : 500, transition:"background 0.12s"}} onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                                    <div style={{fontWeight:700, fontSize:14}}>{l.name}</div>
                                    <div style={{fontSize:12, color: isSelected ? "rgba(250,128,89,0.85)" : "rgba(160,180,196,0.85)", marginTop:2}}>{l.city}, {l.state}</div>
                                  </div>
                                );
                              });
                            })()}
                          </div>`;

code = replaceOnce(code, wageOld, wageNew, '2: wages picker');
console.log('2/2 ✓ Wages picker rebuilt as styled list');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: replace local picker with styled list (clear contrast)" && git push\n');
