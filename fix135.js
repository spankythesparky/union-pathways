// fix135.js
// Remove form sections 04 (Hours Per Year) and 05 (Career Years) from the
// calculator UI. The state hooks stay (defaulting to 1800 hrs and 30 years)
// so all the math, annual income display, pension projection, and lifetime
// gap continue to work — just with sensible fixed defaults instead of dropdowns
// the user has to think about.
//
// Renumber the surviving "06 — Compare Against" section to "04" so the form
// reads 01 → 02 → 03 → 04 with no gap.

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

let changes = 0;

// ── 1. REMOVE THE GRID CONTAINING SECTIONS 04 & 05 ──────────────────────────
const oldHoursCareerBlock =
`                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28}}>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "04 — Horas/Ano" : lang==="pl" ? "04 — Godziny/Rok" : "04 — Hours Per Year"}</div>
                      <select value={calcHours} onChange={e => setCalcHours(parseInt(e.target.value))} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"white", outline:"none"}}>
                        <option value={1600}>1,600 hrs — slow year</option>
                        <option value={1800}>1,800 hrs — typical</option>
                        <option value={2000}>2,000 hrs — busy year</option>
                        <option value={2200}>2,200 hrs — overtime</option>
                      </select>
                    </div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "05 — Anos de Carrera" : lang==="pl" ? "05 — Lata Kariery" : "05 — Career Years"}</div>
                      <select value={calcYearsCareer} onChange={e => setCalcYearsCareer(parseInt(e.target.value))} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"white", outline:"none"}}>
                        <option value={10}>10 years</option>
                        <option value={20}>20 years</option>
                        <option value={25}>25 years</option>
                        <option value={30}>30 years</option>
                        <option value={35}>35 years</option>
                      </select>
                    </div>
                  </div>

`;

if (code.includes(oldHoursCareerBlock)) {
  code = code.replace(oldHoursCareerBlock, '');
  console.log('✓ Removed sections 04 (Hours Per Year) and 05 (Career Years)');
  changes++;
} else if (!code.includes('04 — Hours Per Year')) {
  console.log('Skipping removal — sections already gone.');
} else {
  console.error('ERROR: hours/career grid block not found in expected form.');
  process.exit(1);
}

// ── 2. RENUMBER "06 — COMPARE AGAINST" → "04" ───────────────────────────────
const oldNumberLine = `{lang==="es" ? "06 — Comparar Contra (Opcional)" : lang==="pl" ? "06 — Porownaj Z (Opcjonalne)" : "06 — Compare Against (Optional)"}`;
const newNumberLine = `{lang==="es" ? "04 — Comparar Contra (Opcional)" : lang==="pl" ? "04 — Porownaj Z (Opcjonalne)" : "04 — Compare Against (Optional)"}`;

if (code.includes(oldNumberLine)) {
  code = code.replace(oldNumberLine, newNumberLine);
  console.log('✓ Renumbered Compare Against from 06 → 04');
  changes++;
} else if (code.includes(newNumberLine)) {
  console.log('Skipping renumber — already 04.');
} else {
  console.error('ERROR: 06 — Compare Against label not found.');
  process.exit(1);
}

// ── 3. UPDATE THE COMMENT TAG TO MATCH ──────────────────────────────────────
const oldComment = `                  {/* 06 — COMPARE AGAINST (OPTIONAL) */}`;
const newComment = `                  {/* 04 — COMPARE AGAINST (OPTIONAL) */}`;
if (code.includes(oldComment)) {
  code = code.replace(oldComment, newComment);
  console.log('✓ Updated section comment 06 → 04');
  changes++;
}

// ── 4. UPDATE THE HINT TEXT IN FALLBACK BLOCK (mentions step 06) ────────────
const oldHint = `{lang==="es" ? "💡 Para una comparacion real, vuelve y elige tu trabajo actual en el paso 06." : lang==="pl" ? "💡 Aby uzyskac prawdziwe porownanie, wroc i wybierz obecna prace w kroku 06." : "💡 For a real side-by-side, go back and pick your current job in step 06."}`;
const newHint = `{lang==="es" ? "💡 Para una comparacion real, vuelve y elige tu trabajo actual en el paso 04." : lang==="pl" ? "💡 Aby uzyskac prawdziwe porownanie, wroc i wybierz obecna prace w kroku 04." : "💡 For a real side-by-side, go back and pick your current job in step 04."}`;
if (code.includes(oldHint)) {
  code = code.replace(oldHint, newHint);
  console.log('✓ Updated fallback hint 06 → 04');
  changes++;
}

fs.writeFileSync(path, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: simplify calculator — remove Hours/Year and Career Years pickers, use sensible defaults" && git push');
console.log('');
