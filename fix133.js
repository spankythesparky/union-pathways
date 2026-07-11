// fix133.js
// Add a "Compare Against" feature to the existing wage calculator.
//
// Lets visitors pick what they currently do (or earn) and see a real
// side-by-side comparison against their chosen union trade — hourly,
// annual, and a 30-year career-long total.
//
// Inspired by the Powering Pittsburgh / IBEW "Same Work Better Pay" pattern.
//
// Steps:
//   1. Add 2 new state hooks: compareJob, compareCustomWage
//   2. Add COMPARE_JOBS dataset inside the calculator IIFE
//   3. Add a new "06 — Compare Against (Optional)" form section before the
//      Calculate button
//   4. Update getResults() to compute real comparison numbers when a job is
//      picked (falling back to the existing 78% estimate when not)
//   5. Replace the old "Union vs Non-Union" results block with a smarter one
//      that uses the picked job's name + adds a lifetime gap row
//
// This is a NON-BREAKING change. If a visitor doesn't pick a comparison job,
// the calculator works exactly as it does today.

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

let changes = 0;

// ── 1. ADD STATE HOOKS ──────────────────────────────────────────────────────
const stateAnchor = `  const [showResults, setShowResults] = useState(false);\n`;
const stateReplacement =
`  const [showResults, setShowResults] = useState(false);
  const [compareJob, setCompareJob] = useState("");
  const [compareCustomWage, setCompareCustomWage] = useState(20);
`;
if (code.includes('compareJob, setCompareJob')) {
  console.log('Skipping state insert — compareJob already declared.');
} else if (code.includes(stateAnchor)) {
  code = code.replace(stateAnchor, stateReplacement);
  console.log('✓ Added compareJob and compareCustomWage state');
  changes++;
} else {
  console.error('ERROR: showResults state anchor not found.');
  process.exit(1);
}

// ── 2. ADD COMPARE_JOBS DATASET INSIDE THE CALCULATOR IIFE ──────────────────
const datasetAnchor = `          const MAJOR_METROS = ["new york","los angeles","chicago","san francisco","boston","seattle","washington","philadelphia","miami","houston","dallas","denver","atlanta","portland","minneapolis","detroit","baltimore","san jose","austin","las vegas","new orleans","sacramento","san diego","phoenix"];`;
const datasetReplacement =
`          const COMPARE_JOBS = {
            retail:       { name: { en:"Retail Sales Associate", es:"Vendedor Minorista", pl:"Sprzedawca Detaliczny" }, hourly: 16.50 },
            food:         { name: { en:"Restaurant / Food Service", es:"Restaurante / Servicio de Comida", pl:"Restauracja / Gastronomia" }, hourly: 15.00 },
            warehouse:    { name: { en:"Warehouse / Delivery Driver", es:"Almacen / Repartidor", pl:"Magazyn / Kierowca Dostawczy" }, hourly: 20.00 },
            laborer:      { name: { en:"Construction Laborer (Non-Union)", es:"Obrero de Construccion (No Sindical)", pl:"Robotnik Budowlany (Niezwiazowy)" }, hourly: 20.50 },
            helper:       { name: { en:"Electrician's Helper (Non-Union)", es:"Ayudante de Electricista (No Sindical)", pl:"Pomocnik Elektryka (Niezwiazowy)" }, hourly: 18.00 },
            elec_nu:      { name: { en:"Non-Union Journeyman Electrician", es:"Electricista Oficial (No Sindical)", pl:"Elektryk Czeladnik (Niezwiazowy)" }, hourly: 32.00 },
            plumb_nu:     { name: { en:"Non-Union Plumber", es:"Plomero (No Sindical)", pl:"Hydraulik (Niezwiazowy)" }, hourly: 30.00 },
            carp_nu:      { name: { en:"Non-Union Carpenter", es:"Carpintero (No Sindical)", pl:"Stolarz (Niezwiazowy)" }, hourly: 26.00 },
            hvac_nu:      { name: { en:"Non-Union HVAC Technician", es:"Tecnico HVAC (No Sindical)", pl:"Technik HVAC (Niezwiazowy)" }, hourly: 28.00 },
            office:       { name: { en:"Office / Administrative", es:"Oficina / Administrativo", pl:"Biuro / Administracja" }, hourly: 22.00 },
            factory:      { name: { en:"Manufacturing / Factory", es:"Fabricacion / Fabrica", pl:"Produkcja / Fabryka" }, hourly: 22.00 },
            custom:       { name: { en:"Custom (enter your wage)", es:"Personalizado (introduce tu salario)", pl:"Wlasna (wprowadz swoja stawke)" }, hourly: null },
          };

          const MAJOR_METROS = ["new york","los angeles","chicago","san francisco","boston","seattle","washington","philadelphia","miami","houston","dallas","denver","atlanta","portland","minneapolis","detroit","baltimore","san jose","austin","las vegas","new orleans","sacramento","san diego","phoenix"];`;

if (code.includes('const COMPARE_JOBS = {')) {
  console.log('Skipping dataset insert — COMPARE_JOBS already present.');
} else if (code.includes(datasetAnchor)) {
  code = code.replace(datasetAnchor, datasetReplacement);
  console.log('✓ Added COMPARE_JOBS dataset');
  changes++;
} else {
  console.error('ERROR: MAJOR_METROS anchor not found.');
  process.exit(1);
}

// ── 3. EXTEND getResults() TO COMPUTE COMPARISON NUMBERS ────────────────────
const oldResults = `            const nonUnionEquiv = Math.round(baseWage * 0.78 * 100) / 100;
            const nonUnionAnnual = Math.round(nonUnionEquiv * calcHours);
            const tierName = calcTier === 1 ? "Major Metro" : calcTier === 2 ? "Mid-Market" : "Smaller Market";
            return { baseWage, totalPkg, fringe, annualBase, annualPkg, pensionProjection, nonUnionEquiv, nonUnionAnnual, tier, isJourneyman, appPct, tierName, data };`;

const newResults =
`            const nonUnionEquiv = Math.round(baseWage * 0.78 * 100) / 100;
            const nonUnionAnnual = Math.round(nonUnionEquiv * calcHours);
            const tierName = calcTier === 1 ? "Major Metro" : calcTier === 2 ? "Mid-Market" : "Smaller Market";

            // Comparison job (if user selected one in step 06)
            let comparison = null;
            if (compareJob && COMPARE_JOBS[compareJob]) {
              const job = COMPARE_JOBS[compareJob];
              const compHourly = compareJob === "custom"
                ? Math.max(0, parseFloat(compareCustomWage) || 0)
                : job.hourly;
              const compAnnual = Math.round(compHourly * calcHours);
              const gapHourlyPkg = parseFloat((totalPkg - compHourly).toFixed(2));
              const gapAnnualPkg = annualPkg - compAnnual;
              const gapLifetime = gapAnnualPkg * calcYearsCareer;
              comparison = {
                jobKey: compareJob,
                jobName: job.name[lang] || job.name.en,
                compHourly,
                compAnnual,
                gapHourlyPkg,
                gapAnnualPkg,
                gapLifetime,
              };
            }

            return { baseWage, totalPkg, fringe, annualBase, annualPkg, pensionProjection, nonUnionEquiv, nonUnionAnnual, tier, isJourneyman, appPct, tierName, data, comparison };`;

if (code.includes('let comparison = null;')) {
  console.log('Skipping getResults extend — comparison already computed.');
} else if (code.includes(oldResults)) {
  code = code.replace(oldResults, newResults);
  console.log('✓ Extended getResults() with comparison numbers');
  changes++;
} else {
  console.error('ERROR: getResults() return statement not found in expected form.');
  process.exit(1);
}

// ── 4. ADD "06 — COMPARE AGAINST" FORM SECTION ──────────────────────────────
const oldFormEnd =
`                      <select value={calcYearsCareer} onChange={e => setCalcYearsCareer(parseInt(e.target.value))} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"white", outline:"none"}}>
                        <option value={10}>10 years</option>
                        <option value={20}>20 years</option>
                        <option value={25}>25 years</option>
                        <option value={30}>30 years</option>
                        <option value={35}>35 years</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={() => setShowResults(true)}`;

const newFormEnd =
`                      <select value={calcYearsCareer} onChange={e => setCalcYearsCareer(parseInt(e.target.value))} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"white", outline:"none"}}>
                        <option value={10}>10 years</option>
                        <option value={20}>20 years</option>
                        <option value={25}>25 years</option>
                        <option value={30}>30 years</option>
                        <option value={35}>35 years</option>
                      </select>
                    </div>
                  </div>

                  {/* 06 — COMPARE AGAINST (OPTIONAL) */}
                  <div style={{marginBottom:24, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:6}}>{lang==="es" ? "06 — Comparar Contra (Opcional)" : lang==="pl" ? "06 — Porownaj Z (Opcjonalne)" : "06 — Compare Against (Optional)"}</div>
                    <div style={{fontSize:12, color:"var(--muted)", marginBottom:12, lineHeight:1.5}}>{lang==="es" ? "Elige un trabajo para ver una comparacion lado a lado de tu salario actual contra el sindicato." : lang==="pl" ? "Wybierz prace aby zobaczyc porownanie obecnej stawki ze stawka zwiazkowa." : "Pick a job to see a side-by-side of what you make now vs union."}</div>
                    <select value={compareJob} onChange={e => { setCompareJob(e.target.value); setShowResults(false); }} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"white", outline:"none", marginBottom: compareJob === "custom" ? 12 : 0}}>
                      <option value="">{lang==="es" ? "— Saltar comparacion —" : lang==="pl" ? "— Pomin porownanie —" : "— Skip comparison —"}</option>
                      {Object.entries(COMPARE_JOBS).map(([key, val]) => (
                        <option key={key} value={key}>{val.name[lang] || val.name.en}{key !== "custom" && val.hourly ? " ($" + val.hourly.toFixed(2) + "/hr)" : ""}</option>
                      ))}
                    </select>
                    {compareJob === "custom" && (
                      <div>
                        <div style={{fontSize:12, color:"var(--muted)", marginBottom:6}}>{lang==="es" ? "Tu salario por hora actual" : lang==="pl" ? "Twoja obecna stawka godzinowa" : "Your current hourly wage"}</div>
                        <div style={{display:"flex", alignItems:"center", gap:8}}>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#FA8059"}}>$</span>
                          <input type="number" min="0" step="0.50" value={compareCustomWage} onChange={e => { setCompareCustomWage(e.target.value); setShowResults(false); }} style={{flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", fontSize:14, color:"white", outline:"none", boxSizing:"border-box"}} />
                          <span style={{fontSize:12, color:"var(--muted)"}}>/hr</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={() => setShowResults(true)}`;

if (code.includes('06 — COMPARE AGAINST (OPTIONAL)')) {
  console.log('Skipping form section — already added.');
} else if (code.includes(oldFormEnd)) {
  code = code.replace(oldFormEnd, newFormEnd);
  console.log('✓ Added "06 — Compare Against" form section');
  changes++;
} else {
  console.error('ERROR: form-end anchor (Career Years → Calculate button) not found.');
  process.exit(1);
}

// ── 5. REPLACE "UNION VS NON-UNION" RESULTS BLOCK ───────────────────────────
const oldCompareBlock =
`                    <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"24px 28px", marginBottom:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:16}}>{lang==="es" ? "Sindical vs No Sindical" : lang==="pl" ? "Zwiazowy vs Niezwiazowy" : "Union vs Non-Union"}</div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"#FA8059", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "Sindical" : lang==="pl" ? "Zwiazowy" : "Union"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"#FA8059"}}>{r.baseWage.toFixed(2)}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "base/hr" : lang==="pl" ? "podstawa/godz" : "base/hr"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(250,128,89,0.6)", marginTop:6}}>{r.annualBase.toLocaleString()}/yr</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "No Sindical" : lang==="pl" ? "Niezwiazowy" : "Non-Union (Est.)"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"var(--muted)"}}>{r.nonUnionEquiv.toFixed(2)}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "estimado/hr" : lang==="pl" ? "szacowane/godz" : "estimated/hr"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(160,180,196,0.5)", marginTop:6}}>{r.nonUnionAnnual.toLocaleString()}/yr</div>
                        </div>
                      </div>
                      <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", paddingTop:16, textAlign:"center"}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#FA8059"}}>+{(r.annualBase - r.nonUnionAnnual).toLocaleString()}/yr</span>
                        <span style={{fontSize:13, color:"var(--muted)", marginLeft:10}}>{lang==="es" ? "mas en salario base como miembro sindical" : lang==="pl" ? "wiecej w wynagrodzeniu jako czlonek zwiazku" : "more in base wages as a union member"}</span>
                      </div>
                    </div>`;

const newCompareBlock =
`                    {/* COMPARISON BLOCK — uses real picked job, or falls back to generic 78% estimate */}
                    {r.comparison ? (
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"24px 28px", marginBottom:16}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:6}}>{lang==="es" ? "Tu Salario Actual vs Sindical" : lang==="pl" ? "Twoja Obecna Stawka vs Zwiazkowa" : "Your Current Pay vs Union"}</div>
                        <div style={{fontSize:12, color:"var(--muted)", marginBottom:16, fontStyle:"italic"}}>{r.comparison.jobName}</div>
                        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "Tu Trabajo Actual" : lang==="pl" ? "Obecna Praca" : "Your Current Job"}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"var(--muted)"}}>{r.comparison.compHourly.toFixed(2)}</div>
                            <div style={{fontSize:12, color:"var(--muted)"}}>/hr</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(160,180,196,0.5)", marginTop:6}}>{r.comparison.compAnnual.toLocaleString()}/yr</div>
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"#FA8059", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "Paquete Sindical" : lang==="pl" ? "Pakiet Zwiazkowy" : "Union Total Package"}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"#FA8059"}}>{r.totalPkg.toFixed(2)}</div>
                            <div style={{fontSize:12, color:"var(--muted)"}}>/hr</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(250,128,89,0.6)", marginTop:6}}>{r.annualPkg.toLocaleString()}/yr</div>
                          </div>
                        </div>
                        <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", paddingTop:16}}>
                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0"}}>
                            <span style={{fontSize:13, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{lang==="es" ? "Diferencia/hr" : lang==="pl" ? "Roznica/godz" : "Per Hour"}</span>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color: r.comparison.gapHourlyPkg >= 0 ? "#FA8059" : "#a0b4c4"}}>{r.comparison.gapHourlyPkg >= 0 ? "+" : ""}{r.comparison.gapHourlyPkg.toFixed(2)}</span>
                          </div>
                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0"}}>
                            <span style={{fontSize:13, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{lang==="es" ? "Diferencia Anual" : lang==="pl" ? "Roznica Roczna" : "Per Year"}</span>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color: r.comparison.gapAnnualPkg >= 0 ? "#FA8059" : "#a0b4c4"}}>{r.comparison.gapAnnualPkg >= 0 ? "+" : ""}{r.comparison.gapAnnualPkg.toLocaleString()}</span>
                          </div>
                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0 0 0", borderTop:"1px solid rgba(58,80,104,0.3)", marginTop:8}}>
                            <span style={{fontSize:13, color:"#fff", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900}}>{lang==="es" ? "Diferencia En "+calcYearsCareer+" Anos" : lang==="pl" ? "Roznica W "+calcYearsCareer+" Lat" : "Lifetime ("+calcYearsCareer+" yrs)"}</span>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color: r.comparison.gapLifetime >= 0 ? "#F5C518" : "#a0b4c4"}}>{r.comparison.gapLifetime >= 0 ? "+$" : "-$"}{Math.abs(r.comparison.gapLifetime).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"24px 28px", marginBottom:16}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:16}}>{lang==="es" ? "Sindical vs No Sindical" : lang==="pl" ? "Zwiazowy vs Niezwiazowy" : "Union vs Non-Union"}</div>
                        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"#FA8059", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "Sindical" : lang==="pl" ? "Zwiazowy" : "Union"}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"#FA8059"}}>{r.baseWage.toFixed(2)}</div>
                            <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "base/hr" : lang==="pl" ? "podstawa/godz" : "base/hr"}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(250,128,89,0.6)", marginTop:6}}>{r.annualBase.toLocaleString()}/yr</div>
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "No Sindical" : lang==="pl" ? "Niezwiazowy" : "Non-Union (Est.)"}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"var(--muted)"}}>{r.nonUnionEquiv.toFixed(2)}</div>
                            <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "estimado/hr" : lang==="pl" ? "szacowane/godz" : "estimated/hr"}</div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(160,180,196,0.5)", marginTop:6}}>{r.nonUnionAnnual.toLocaleString()}/yr</div>
                          </div>
                        </div>
                        <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", paddingTop:16, textAlign:"center"}}>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#FA8059"}}>+{(r.annualBase - r.nonUnionAnnual).toLocaleString()}/yr</span>
                          <span style={{fontSize:13, color:"var(--muted)", marginLeft:10}}>{lang==="es" ? "mas en salario base como miembro sindical" : lang==="pl" ? "wiecej w wynagrodzeniu jako czlonek zwiazku" : "more in base wages as a union member"}</span>
                        </div>
                        <div style={{borderTop:"1px dashed rgba(58,80,104,0.4)", marginTop:16, paddingTop:14, textAlign:"center", fontSize:12, color:"var(--muted)", fontStyle:"italic"}}>
                          {lang==="es" ? "💡 Para una comparacion real, vuelve y elige tu trabajo actual en el paso 06." : lang==="pl" ? "💡 Aby uzyskac prawdziwe porownanie, wroc i wybierz obecna prace w kroku 06." : "💡 For a real side-by-side, go back and pick your current job in step 06."}
                        </div>
                      </div>
                    )}`;

if (code.includes('COMPARISON BLOCK — uses real picked job')) {
  console.log('Skipping results block — comparison block already in place.');
} else if (code.includes(oldCompareBlock)) {
  code = code.replace(oldCompareBlock, newCompareBlock);
  console.log('✓ Replaced Union vs Non-Union results block');
  changes++;
} else {
  console.error('ERROR: old "Union vs Non-Union" block not found in expected form.');
  process.exit(1);
}

fs.writeFileSync(path, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Compare Against feature to wage calculator (real side-by-side vs current job)" && git push');
console.log('');
