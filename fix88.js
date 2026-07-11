// fix88.js — Working Dues as %, sort approved feeds by local number
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

function replaceN(haystack, needle, replacement, expectedCount, label) {
  const count = haystack.split(needle).length - 1;
  if (count !== expectedCount) {
    console.error('ERROR: expected ' + expectedCount + ' matches for "' + label + '", got ' + count);
    process.exit(1);
  }
  return haystack.split(needle).join(replacement);
}

// 1. Replace Working Dues moneyField call with custom percentage field
const duesOld = '{moneyField(lang==="es" ? "Cuotas de Trabajo" : lang==="pl" ? "Skladki Pracownicze" : "Working Dues", wageWorkingDues, setWageWorkingDues, true)}';

const duesNew = `<div>
                            <div style={labelStyle}>{lang==="es" ? "Cuotas de Trabajo" : lang==="pl" ? "Skladki Pracownicze" : "Working Dues"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "% opcional" : lang==="pl" ? "% opcjonalne" : "% optional"})</span></div>
                            <div style={{position:"relative"}}>
                              <input type="number" step="0.01" min="0" max="100" value={wageWorkingDues} onChange={e => setWageWorkingDues(e.target.value)} placeholder="0.00" style={{...inputStyle, paddingRight:32}} />
                              <span style={{position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"var(--muted)", fontSize:14, pointerEvents:"none"}}>%</span>
                            </div>
                            <div style={{fontSize:11, color:"var(--muted)", marginTop:6, lineHeight:1.4}}>
                              {lang==="es" ? "Porcentaje deducido del cheque, no incluido en el paquete." : lang==="pl" ? "Procent potracany z wyplaty, nie wliczany do pakietu." : "Percentage deducted from your check — not part of total package."}
                            </div>
                          </div>`;

code = replaceOnce(code, duesOld, duesNew, '1: Working Dues percent field');
console.log('1/6 ✓ Working Dues changed to percentage');

// 2. Add fmtPct helper to ApprovedWageCard (insert before const labels)
code = replaceOnce(code,
  `  const fmtDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); }
    catch { return d; }
  };`,
  `  const fmtDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); }
    catch { return d; }
  };
  const fmtPct = (n) => {
    if (n === null || n === undefined || n === '') return null;
    const num = parseFloat(n);
    if (isNaN(num)) return null;
    return num.toFixed(2) + '%';
  };`,
  '2: fmtPct helper');
console.log('2/6 ✓ Added fmtPct helper');

// 3. Mark dues breakdown entry as pct
code = replaceOnce(code,
  `    { key:'dues', val:r.working_dues },
  ].filter(x => fmt(x.val) !== null);`,
  `    { key:'dues', val:r.working_dues, pct:true },
  ].filter(x => x.pct ? fmtPct(x.val) !== null : fmt(x.val) !== null);`,
  '3: breakdown dues + filter');
console.log('3/6 ✓ Breakdown handles percent items');

// 4. Update breakdown.map destructure + render
code = replaceOnce(code,
  `              {breakdown.map(({key, val}) => (
                <div key={key}>
                  <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L[key]}</div>
                  <div style={{fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", marginTop:2}}>{fmt(val)}</div>
                </div>
              ))}`,
  `              {breakdown.map(({key, val, pct}) => (
                <div key={key}>
                  <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L[key]}</div>
                  <div style={{fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", marginTop:2}}>{pct ? fmtPct(val) : fmt(val)}</div>
                </div>
              ))}`,
  '4: breakdown render');
console.log('4/6 ✓ Breakdown renders percent for dues');

// 5. Sort approved feeds by local number ascending (BOTH feeds — 2 matches)
const visibleOld = `  const visible = activeTrade === 'all' ? reports : reports.filter(r => r.trade === activeTrade);`;
const visibleNew = `  const sortByLocal = (a, b) => {
    const na = parseInt(String(a.local_id || '').match(/\\d+/)?.[0] || '0', 10);
    const nb = parseInt(String(b.local_id || '').match(/\\d+/)?.[0] || '0', 10);
    return na - nb;
  };
  const visible = (activeTrade === 'all' ? reports : reports.filter(r => r.trade === activeTrade)).slice().sort(sortByLocal);`;

code = replaceN(code, visibleOld, visibleNew, 2, '5: visible sort by local in both feeds');
console.log('5/6 ✓ Both approved feeds sort by local number ascending');

// 6. Sanity log
console.log('6/6 ✓ All changes applied');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: working dues as %, sort feeds by local #" && git push\n');
