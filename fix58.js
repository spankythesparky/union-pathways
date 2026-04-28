const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD valid page ────────────────────────────────────────────────────────
code = code.replace(
  "const validPages = ['home','quiz','careers','checklist','locals','veterans','history','retirement','health','benefits','about','contact'];",
  "const validPages = ['home','quiz','careers','checklist','locals','calculator','veterans','history','retirement','health','benefits','about','contact'];"
);
console.log('✅ Added calculator to valid pages');

// ─── 2. ADD page meta ─────────────────────────────────────────────────────────
code = code.replace(
  `      locals:    { title: "Union Pathways — Understanding Your Local", desc: "Jurisdiction, Book 1 vs Book 2, home locals, travel work, and apprenticeship school models explained." },`,
  `      locals:    { title: "Union Pathways — Understanding Your Local", desc: "Jurisdiction, Book 1 vs Book 2, home locals, travel work, and apprenticeship school models explained." },
      calculator:{ title: "Union Pathways — Wage Calculator", desc: "Calculate your union wage, total compensation package, and pension projection. Compare union vs non-union pay." },`
);
console.log('✅ Added page meta');

// ─── 3. ADD nav link under Apprentice dropdown ────────────────────────────────
const oldQuizItem = `                  <div className={\`nav-dropdown-item\${page==="quiz"?" active":""}\`} onMouseDown={() => { setPage("quiz"); setApprenticeOpen(false); resetQuiz(); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "¿Qué Oficio?" : lang==="pl" ? "Który Zawód?" : "Which Trade?"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Encuentra tu oficio ideal" : lang==="pl" ? "Znajdź swój idealny zawód" : "Find your perfect trade match"}</span>
                  </div>`;

const newQuizItem = `                  <div className={\`nav-dropdown-item\${page==="quiz"?" active":""}\`} onMouseDown={() => { setPage("quiz"); setApprenticeOpen(false); resetQuiz(); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "¿Qué Oficio?" : lang==="pl" ? "Który Zawód?" : "Which Trade?"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Encuentra tu oficio ideal" : lang==="pl" ? "Znajdź swój idealny zawód" : "Find your perfect trade match"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="calculator"?" active":""}\`} onMouseDown={() => { setPage("calculator"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Calculadora de Salarios" : lang==="pl" ? "Kalkulator Wynagrodzen" : "Wage Calculator"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Calcula tu paquete completo" : lang==="pl" ? "Oblicz swoj pelny pakiet" : "Calculate your full package value"}</span>
                  </div>`;

if (!code.includes(oldQuizItem)) { console.error('ERROR: quiz nav item not found'); process.exit(1); }
code = code.replace(oldQuizItem, newQuizItem);
console.log('✅ Added Wage Calculator to nav');

// ─── 4. ADD CALCULATOR PAGE before veterans ───────────────────────────────────
const pageMarker = '        {page === "veterans" && (';

const CALC_PAGE = `        {page === "calculator" && (() => {
          const WAGE_DATA = {
            IBEW_I: { name: "IBEW Inside Wireman", tiers: { 1: { base:58, health:12.5, pension:9, annuity:5, vacation:4.5, other:2 }, 2: { base:48, health:12, pension:8, annuity:4.5, vacation:4, other:1.5 }, 3: { base:38, health:11, pension:7, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.40,0.50,0.65,0.75,0.85] },
            IBEW_L: { name: "IBEW Lineman", tiers: { 1: { base:65, health:14, pension:11, annuity:6, vacation:5, other:2 }, 2: { base:54, health:13, pension:9.5, annuity:5, vacation:4.5, other:2 }, 3: { base:44, health:12, pension:8, annuity:4, vacation:4, other:1.5 } }, appScale:[0.60,0.65,0.70,0.80,0.90] },
            UA: { name: "UA Plumber / Pipefitter", tiers: { 1: { base:60, health:13, pension:10, annuity:5.5, vacation:4.5, other:2 }, 2: { base:50, health:12, pension:8.5, annuity:4.5, vacation:4, other:1.5 }, 3: { base:40, health:11, pension:7.5, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.40,0.50,0.65,0.75,0.85] },
            BAC: { name: "BAC Bricklayer", tiers: { 1: { base:55, health:12, pension:9, annuity:5, vacation:4, other:2 }, 2: { base:46, health:11.5, pension:8, annuity:4.5, vacation:3.5, other:1.5 }, 3: { base:37, health:10.5, pension:7, annuity:4, vacation:3, other:1.5 } }, appScale:[0.50,0.60,0.70,0.80,0.90] },
            IW: { name: "Ironworker", tiers: { 1: { base:57, health:12.5, pension:9.5, annuity:5, vacation:4.5, other:2 }, 2: { base:47, health:12, pension:8, annuity:4.5, vacation:4, other:1.5 }, 3: { base:38, health:11, pension:7, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.50,0.60,0.70,0.80,0.90] },
          };
          const MAJOR_METROS = ["new york","los angeles","chicago","san francisco","boston","seattle","washington","philadelphia","miami","houston","dallas","denver","atlanta","portland","minneapolis","detroit","baltimore","san jose","austin","las vegas","new orleans","sacramento","san diego","phoenix"];
          const MID_MARKETS = ["columbus","cleveland","cincinnati","pittsburgh","milwaukee","indianapolis","kansas city","st louis","nashville","charlotte","raleigh","richmond","salt lake","tucson","albuquerque","memphis","louisville","oklahoma city","birmingham","hartford","buffalo","rochester","albany","omaha","des moines","grand rapids","toledo","akron","dayton"];

          const [calcTrade, setCalcTrade] = React.useState("IBEW_I");
          const [calcYear, setCalcYear] = React.useState("journeyman");
          const [calcCity, setCalcCity] = React.useState("");
          const [calcTier, setCalcTier] = React.useState(2);
          const [calcHours, setCalcHours] = React.useState(1800);
          const [calcYearsCareer, setCalcYearsCareer] = React.useState(30);
          const [showResults, setShowResults] = React.useState(false);

          const detectTier = (city) => {
            const c = city.toLowerCase().trim();
            if (MAJOR_METROS.some(m => c.includes(m))) return 1;
            if (MID_MARKETS.some(m => c.includes(m))) return 2;
            return 3;
          };

          const handleCalcCity = (val) => {
            setCalcCity(val);
            if (val.length > 2) setCalcTier(detectTier(val));
          };

          const getResults = () => {
            const data = WAGE_DATA[calcTrade];
            const tier = data.tiers[calcTier];
            const isJourneyman = calcYear === "journeyman";
            const appPct = isJourneyman ? 1 : data.appScale[parseInt(calcYear) - 1];
            const baseWage = Math.round(tier.base * appPct * 100) / 100;
            const fringe = tier.health + (isJourneyman ? tier.pension + tier.annuity : 0) + tier.vacation + tier.other;
            const totalPkg = parseFloat((baseWage + fringe).toFixed(2));
            const annualBase = Math.round(baseWage * calcHours);
            const annualPkg = Math.round(totalPkg * calcHours);
            const pensionContrib = isJourneyman ? tier.pension : tier.pension * appPct;
            const pensionProjection = Math.round(pensionContrib * calcHours * calcYearsCareer * 1.04);
            const nonUnionEquiv = Math.round(baseWage * 0.78 * 100) / 100;
            const nonUnionAnnual = Math.round(nonUnionEquiv * calcHours);
            const tierName = calcTier === 1 ? "Major Metro" : calcTier === 2 ? "Mid-Market" : "Smaller Market";
            return { baseWage, totalPkg, fringe, annualBase, annualPkg, pensionProjection, nonUnionEquiv, nonUnionAnnual, tier, isJourneyman, appPct, tierName, data };
          };

          const r = showResults ? getResults() : null;

          return (
            <div>
              <div className="history-hero">
                <div className="history-eyebrow">{lang==="es" ? "Conoce tu Valor Real" : lang==="pl" ? "Poznaj Swoja Prawdziwa Wartosc" : "Know Your Real Worth"}</div>
                <h1 className="history-title">
                  {lang==="es" ? <>{"Calculadora de "}<span className="accent">{"Salarios Sindicales"}</span></> : lang==="pl" ? <>{"Kalkulator "}<span className="accent">{"Wynagrodzen"}</span></> : <>{"Union "}<span className="accent">{"Wage Calculator"}</span></>}
                </h1>
                <p className="history-subtitle">
                  {lang==="es" ? "Calcula tu salario base, el valor total de tu paquete y tu proyeccion de pension. Compara con el equivalente no sindical." : lang==="pl" ? "Oblicz swoja podstawowa stawke, calkowita wartosc pakietu i projekcje emerytalna. Porownaj z odpowiednikiem niezwiazowym." : "Calculate your base wage, total compensation package value, and pension projection. Compare against the non-union equivalent."}
                </p>
              </div>

              <div style={{maxWidth:720, margin:"0 auto", padding:"40px 24px 80px"}}>
                <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"32px", marginBottom:20}}>

                  <div style={{marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "01 — Tu Oficio" : lang==="pl" ? "01 — Twoj Zawod" : "01 — Your Trade"}</div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                      {Object.entries(WAGE_DATA).map(([key, val]) => (
                        <button key={key} onClick={() => { setCalcTrade(key); setShowResults(false); }} style={{background: calcTrade===key ? "#FA8059" : "rgba(255,255,255,0.04)", border: calcTrade===key ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.1)", borderRadius:50, padding:"8px 16px", color: calcTrade===key ? "#000" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s"}}>
                          {key === "IBEW_I" ? "IBEW Inside" : key === "IBEW_L" ? "IBEW Lineman" : key === "UA" ? "UA Plumbers" : key === "BAC" ? "Bricklayers" : "Ironworkers"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "02 — Ano / Nivel" : lang==="pl" ? "02 — Rok / Poziom" : "02 — Apprentice Year or Journeyman"}</div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                      {["1","2","3","4","5","journeyman"].map(y => (
                        <button key={y} onClick={() => { setCalcYear(y); setShowResults(false); }} style={{background: calcYear===y ? "#FA8059" : "rgba(255,255,255,0.04)", border: calcYear===y ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.1)", borderRadius:50, padding:"8px 16px", color: calcYear===y ? "#000" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s"}}>
                          {y === "journeyman" ? (lang==="es" ? "Oficial" : lang==="pl" ? "Czeladnik" : "Journeyman") : (lang==="es" ? "Ano "+y : lang==="pl" ? "Rok "+y : "Year "+y)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "03 — Tu Ciudad" : lang==="pl" ? "03 — Twoje Miasto" : "03 — Your City or Market"}</div>
                    <input value={calcCity} onChange={e => handleCalcCity(e.target.value)} placeholder={lang==="es" ? "ej. Chicago, Cleveland, Phoenix..." : lang==="pl" ? "np. Chicago, Cleveland, Phoenix..." : "e.g. Chicago, Cleveland, Phoenix..."} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:15, color:"white", outline:"none", boxSizing:"border-box", marginBottom:8}} />
                    <div style={{display:"flex", gap:8}}>
                      {[{label: lang==="es" ? "Metropoli" : lang==="pl" ? "Metropolia" : "Major Metro", t:1},{label: lang==="es" ? "Mercado Medio" : lang==="pl" ? "Sredni Rynek" : "Mid-Market", t:2},{label: lang==="es" ? "Mercado Menor" : lang==="pl" ? "Mniejszy Rynek" : "Smaller Market", t:3}].map(({label, t}) => (
                        <button key={t} onClick={() => setCalcTier(t)} style={{background: calcTier===t ? "rgba(250,128,89,0.15)" : "rgba(255,255,255,0.03)", border: calcTier===t ? "1px solid rgba(250,128,89,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius:50, padding:"5px 12px", color: calcTier===t ? "#FA8059" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer"}}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28}}>
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

                  <button onClick={() => setShowResults(true)} style={{width:"100%", background:"#FA8059", border:"none", borderRadius:12, padding:"16px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", color:"#000", cursor:"pointer", transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.9"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    {lang==="es" ? "Calcular mi Paquete \u2192" : lang==="pl" ? "Oblicz Moj Pakiet \u2192" : "Calculate My Package \u2192"}
                  </button>
                </div>

                {showResults && r && (
                  <div>
                    <div style={{background:"rgba(250,128,89,0.08)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:20, padding:"28px 32px", marginBottom:16, textAlign:"center"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                        {WAGE_DATA[calcTrade].name} \u2014 {r.tierName} \u2014 {calcYear === "journeyman" ? (lang==="es" ? "Oficial" : lang==="pl" ? "Czeladnik" : "Journeyman") : (lang==="es" ? "Aprendiz Ano "+calcYear : lang==="pl" ? "Praktykant Rok "+calcYear : "Apprentice Year "+calcYear)}
                      </div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:72, fontWeight:900, color:"#FA8059", lineHeight:1}}>
                        ${"{"}r.totalPkg.toFixed(2){"}"}<span style={{fontSize:28}}>/hr</span>
                      </div>
                      <div style={{fontSize:14, color:"var(--muted)", marginTop:8}}>{lang==="es" ? "Valor total del paquete de compensacion" : lang==="pl" ? "Calkowita wartosc pakietu wynagrodzenia" : "Total compensation package value per hour"}</div>
                    </div>

                    <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"24px 28px", marginBottom:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:20}}>{lang==="es" ? "Desglose por Hora" : lang==="pl" ? "Podzial na Godzine" : "Hourly Breakdown"}</div>
                      {[
                        [lang==="es" ? "Salario Base" : lang==="pl" ? "Wynagrodzenie Podstawowe" : "Base Wage", "$"+r.baseWage.toFixed(2)+"/hr", true],
                        [lang==="es" ? "Salud y Bienestar" : lang==="pl" ? "Zdrowie i Swiadczenia" : "Health & Welfare", "$"+r.tier.health.toFixed(2)+"/hr", false],
                        ...(r.isJourneyman ? [[lang==="es" ? "Pension" : lang==="pl" ? "Emerytura" : "Pension", "$"+r.tier.pension.toFixed(2)+"/hr", false],[lang==="es" ? "Anualidad" : lang==="pl" ? "Renta" : "Annuity", "$"+r.tier.annuity.toFixed(2)+"/hr", false]] : []),
                        [lang==="es" ? "Vacaciones y Otros" : lang==="pl" ? "Urlop i Inne" : "Vacation & Other", "$"+(r.tier.vacation+r.tier.other).toFixed(2)+"/hr", false],
                      ].map(([label, val, isBase], i, arr) => (
                        <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom: i<arr.length-1 ? "1px solid rgba(58,80,104,0.3)" : "none"}}>
                          <span style={{fontSize:14, color: isBase ? "#fff" : "var(--muted)", fontWeight: isBase ? 700 : 400}}>{label}</span>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: isBase ? "#FA8059" : "var(--muted)"}}>{val}</span>
                        </div>
                      ))}
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0 0", marginTop:8, borderTop:"2px solid #FA8059"}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, color:"#fff"}}>{lang==="es" ? "TOTAL POR HORA" : lang==="pl" ? "LACZNIE NA GODZINE" : "TOTAL PER HOUR"}</span>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059"}}>${"{"}r.totalPkg.toFixed(2){"}"}/hr</span>
                      </div>
                    </div>

                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                      <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px", textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>{lang==="es" ? "Ingreso Anual" : lang==="pl" ? "Roczny Dochod" : "Annual Income"}<br/><span style={{color:"rgba(160,180,196,0.5)"}}>({calcHours.toLocaleString()} hrs)</span></div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:34, fontWeight:900, color:"#FA8059"}}>${"{"}r.annualBase.toLocaleString(){"}"}</div>
                        <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "salario base" : lang==="pl" ? "wynagrodzenie podstawowe" : "take-home wages"}</div>
                        <div style={{borderTop:"1px solid rgba(58,80,104,0.3)", marginTop:12, paddingTop:12}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:700, color:"rgba(250,128,89,0.6)"}}>${"{"}r.annualPkg.toLocaleString(){"}"}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "valor total del paquete" : lang==="pl" ? "calkowita wartosc pakietu" : "total package value"}</div>
                        </div>
                      </div>
                      <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px", textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>{lang==="es" ? "Proyeccion de Pension" : lang==="pl" ? "Projekcja Emerytalna" : "Pension Projection"}<br/><span style={{color:"rgba(160,180,196,0.5)"}}>({calcYearsCareer} {lang==="es" ? "anos" : lang==="pl" ? "lat" : "years"})</span></div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:34, fontWeight:900, color:"#FA8059"}}>${"{"}r.pensionProjection.toLocaleString(){"}"}</div>
                        <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "valor estimado acumulado" : lang==="pl" ? "szacowana wartosc skumulowana" : "estimated accumulated value"}</div>
                      </div>
                    </div>

                    <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"24px 28px", marginBottom:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:16}}>{lang==="es" ? "Sindical vs No Sindical" : lang==="pl" ? "Zwiazowy vs Niezwiazowy" : "Union vs Non-Union"}</div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"#FA8059", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "Sindical" : lang==="pl" ? "Zwiazowy" : "Union"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"#FA8059"}}>${"{"}r.baseWage.toFixed(2){"}"}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "base/hr" : lang==="pl" ? "podstawa/godz" : "base/hr"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(250,128,89,0.6)", marginTop:6}}>${"{"}r.annualBase.toLocaleString(){"}"}/yr</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "No Sindical" : lang==="pl" ? "Niezwiazowy" : "Non-Union (Est.)"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"var(--muted)"}}>${"{"}r.nonUnionEquiv.toFixed(2){"}"}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "estimado/hr" : lang==="pl" ? "szacowane/godz" : "estimated/hr"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(160,180,196,0.5)", marginTop:6}}>${"{"}r.nonUnionAnnual.toLocaleString(){"}"}/yr</div>
                        </div>
                      </div>
                      <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", paddingTop:16, textAlign:"center"}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#FA8059"}}>+${"{"}(r.annualBase - r.nonUnionAnnual).toLocaleString(){"}"}/yr</span>
                        <span style={{fontSize:13, color:"var(--muted)", marginLeft:10}}>{lang==="es" ? "mas en salario base como miembro sindical" : lang==="pl" ? "wiecej w wynagrodzeniu jako czlonek zwiazku" : "more in base wages as a union member"}</span>
                      </div>
                    </div>

                    <div style={{fontSize:12, color:"rgba(160,180,196,0.4)", lineHeight:1.6, textAlign:"center", padding:"0 16px", marginBottom:20}}>
                      {lang==="es" ? "* Estimaciones basadas en promedios regionales aproximados. Las tarifas reales varian por local, contrato y ano." : lang==="pl" ? "* Szacunki oparte na przyblizonych sredniach regionalnych. Rzeczywiste stawki roznia sie w zaleznosci od lokalu i umowy." : "* Estimates based on approximate regional averages. Actual rates vary by local, contract, and year. Contact your local for exact rates."}
                    </div>

                    <div style={{textAlign:"center"}}>
                      <button onClick={() => setShowResults(false)} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.15)", borderRadius:50, padding:"10px 24px", color:"var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer"}}>
                        {lang==="es" ? "Recalcular" : lang==="pl" ? "Przelicz Ponownie" : "Recalculate"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

`;

if (!code.includes(pageMarker)) { console.error('ERROR: veterans marker not found'); process.exit(1); }
code = code.replace(pageMarker, CALC_PAGE + pageMarker);

const count = (code.match(/page === "calculator"/g) || []).length;
console.log('Calculator page count:', count);

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n✅ Wage Calculator page added');
console.log('Now run: git add src/App.jsx && git commit -m "feat: add Union Wage Calculator" && git push\n');
