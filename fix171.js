// fix171.js — Consolidate top-level navigation
//
// Goals:
//   - Reduce desktop nav from 9 top-level items to 6 (Home + 5 dropdowns)
//   - Mirror the same 5-section structure in the mobile drawer
//   - No new state variables — reuse existing dropdown-open flags
//
// New buckets:
//   1. Home                    (link)
//   2. Get Started   ▾  (uses apprenticeOpen)
//        How to Join · Career Paths · Which Trade? · Apprenticeship Tests · Wage Calculator · Resume Template
//   3. Membership    ▾  (uses learnOpen)
//        Benefits Overview · Retirement · Veterans · Understanding Your Local · Wages · Job Board
//   4. Resources     ▾  (uses resourcesOpen)
//        Right to Work · Workplace Organizing · Organizing a Contractor
//   5. History       ▾  (uses historyOpen — unchanged)
//   6. About         ▾  (uses getInTouchOpen, label changed)
//
// State variables organizeOpen / drawerTestsOpen etc. are kept in place
// (still used in mobile sub-collapses) — no declaration changes.
//
// Idempotency: detects the new "Get Started" label and exits cleanly.

const fs = require('fs');

const FILE = 'src/App.jsx';
if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root (~/Desktop/union-pathway).');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');

// ----------------------------------------------------------------------------
// IDEMPOTENCY CHECK
// ----------------------------------------------------------------------------
if (src.includes('"Get Started"') && src.includes('"Membership"') && src.includes('{/* CONSOLIDATED NAV */}')) {
  console.log('Already applied — nav consolidation is already in place. No changes made.');
  process.exit(0);
}

// ============================================================================
// NEW DESKTOP NAV (6 items: Home + 5 dropdowns)
// ============================================================================
const NEW_DESKTOP_NAV = `          {/* CONSOLIDATED NAV */}
          <div className="nav-links">
            <button className={\`nav-link \${page==="home"?"active":""}\`} onClick={() => setPage("home")}>{t.navHome}</button>

            {/* GET STARTED DROPDOWN (uses apprenticeOpen) */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="checklist"||page==="careers"||page==="quiz"||page==="apprenticeship"||page.startsWith("apprenticeship-")||page==="calculator"||page==="resume")?" active":""}\${apprenticeOpen?" open":""}\`}
                onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }}
                onBlur={() => setTimeout(() => setApprenticeOpen(false), 150)}
              >
                {lang==="es" ? "Empezar" : lang==="pl" ? "Zacznij" : "Get Started"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {apprenticeOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="checklist"?" active":""}\`} onMouseDown={() => { setPage("checklist"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Como Unirse" : lang==="pl" ? "Jak Dolaczyc" : "How to Join"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Las 3 rutas reales de entrada" : lang==="pl" ? "3 prawdziwe drogi wejscia" : "The 3 real entry routes"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="careers"?" active":""}\`} onMouseDown={() => { setPage("careers"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Sciezki Kariery" : "Career Paths"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "De aprendiz a maestro" : lang==="pl" ? "Od praktykanta do mistrza" : "Apprentice to journeyman"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="quiz"?" active":""}\`} onMouseDown={() => { setPage("quiz"); setApprenticeOpen(false); resetQuiz(); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Que Oficio?" : lang==="pl" ? "Ktory Zawod?" : "Which Trade?"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Encuentra tu oficio ideal" : lang==="pl" ? "Znajdz swoj idealny zawod" : "Find your perfect trade match"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="apprenticeship"||page.startsWith("apprenticeship-")?" active":""}\`} onMouseDown={() => { setPage("apprenticeship"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Pruebas de Aprendizaje" : lang==="pl" ? "Testy Praktyk" : "Apprenticeship Tests"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "NJATC, EIAT, GAN y mas" : lang==="pl" ? "NJATC, EIAT, GAN i wiecej" : "NJATC, EIAT, GAN, and more"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="calculator"?" active":""}\`} onMouseDown={() => { setPage("calculator"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Calculadora de Salarios" : lang==="pl" ? "Kalkulator Wynagrodzen" : "Wage Calculator"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Calcula tu paquete completo" : lang==="pl" ? "Oblicz swoj pelny pakiet" : "Calculate your full package value"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="resume"?" active":""}\`} onMouseDown={() => { setPage("resume"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Plantilla de Curriculum" : lang==="pl" ? "Szablon CV" : "Resume Template"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Descarga gratis" : lang==="pl" ? "Pobierz za darmo" : "Free download — ready to use"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* MEMBERSHIP DROPDOWN (uses learnOpen) */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="benefits"||page==="retirement"||page==="veterans"||page==="locals"||page==="wages"||page==="jobboard")?" active":""}\${learnOpen?" open":""}\`}
                onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }}
                onBlur={() => setTimeout(() => setLearnOpen(false), 150)}
              >
                {lang==="es" ? "Membresia" : lang==="pl" ? "Czlonkostwo" : "Membership"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {learnOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="benefits"?" active":""}\`} onMouseDown={() => { setPage("benefits"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Resumen de Beneficios" : lang==="pl" ? "Przeglad Swiadczen" : "Benefits Overview"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pension, salud, anualidad y mas" : lang==="pl" ? "Emerytura, zdrowie, renta i wiecej" : "Pension, health, annuity & more"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="retirement"?" active":""}\`} onMouseDown={() => { setPage("retirement"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Jubilacion" : lang==="pl" ? "Emerytura" : "Retirement"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "401k vs Anualidad vs Pension" : lang==="pl" ? "401k vs Renta vs Emerytura" : "401k vs Annuity vs Pension"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="veterans"?" active":""}\`} onMouseDown={() => { setPage("veterans"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Recursos para veteranos militares" : lang==="pl" ? "Zasoby dla weteranow wojskowych" : "Resources for military veterans"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="locals"?" active":""}\`} onMouseDown={() => { setPage("locals"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Entendiendo tu Local" : lang==="pl" ? "Rozumienie Oddzialu" : "Understanding Your Local"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Jurisdiccion, Libro 1 vs 2, trabajo de viaje" : lang==="pl" ? "Jurysdykcja, Ksiega 1 vs 2, praca w trasie" : "Jurisdiction, Book 1 vs 2, travel work"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="wages"?" active":""}\`} onMouseDown={() => { setPage("wages"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Salarios" : lang==="pl" ? "Place" : "Wages"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Datos salariales por oficio" : lang==="pl" ? "Dane place wedlug zawodu" : "Wage data by trade"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="jobboard"?" active":""}\`} onMouseDown={() => { setPage("jobboard"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Trabajos sindicales activos" : lang==="pl" ? "Aktywne oferty pracy" : "Active union job postings"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* RESOURCES DROPDOWN (uses resourcesOpen) */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="rtw"||page==="organize"||page==="organize-contractor")?" active":""}\${resourcesOpen?" open":""}\`}
                onClick={() => { setResourcesOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); }}
                onBlur={() => setTimeout(() => setResourcesOpen(false), 150)}
              >
                {lang==="es" ? "Recursos" : lang==="pl" ? "Zasoby" : "Resources"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {resourcesOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="rtw"?" active":""}\`} onMouseDown={() => { setPage("rtw"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Derecho al Trabajo" : lang==="pl" ? "Prawo do Pracy" : "Right to Work"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Comparacion de los 50 estados" : lang==="pl" ? "Porownanie 50 stanow" : "All 50 states compared"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="organize"?" active":""}\`} onMouseDown={() => { setPage("organize"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Organizar Tu Trabajo" : lang==="pl" ? "Organizuj Prace" : "Workplace Organizing"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Como organizar tu lugar de trabajo" : lang==="pl" ? "Jak zorganizowac swoje miejsce pracy" : "How to organize your job"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="organize-contractor"?" active":""}\`} onMouseDown={() => { setPage("organize-contractor"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Que un contratista no sindical firme" : lang==="pl" ? "Pozyskanie wykonawcy do zwiazku" : "Get a non-union contractor to sign"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* HISTORY DROPDOWN (uses historyOpen — unchanged contents) */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="history"||page==="trade-history"||page.startsWith("history-"))?" active":""}\${historyOpen?" open":""}\`}
                onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }}
                onBlur={() => setTimeout(() => setHistoryOpen(false), 150)}
              >
                {lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {historyOpen && (
                <div className="nav-dropdown-menu" style={{minWidth:240}}>
                  <div className={\`nav-dropdown-item\${page==="history"?" active":""}\`} onMouseDown={() => { setPage("history"); setHistoryOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Historia General" : lang==="pl" ? "Historia Ogolna" : "General Union History"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "El movimiento desde el siglo XII" : lang==="pl" ? "Ruch od XII wieku" : "The full movement from the 12th century"}</span>
                  </div>
                  {[
                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                    {key:'UA', name:'UA — Plumbers & Pipefitters', page:'history-ua', live:true},
                    {key:'SMART', name:'SMART — Sheet Metal, Air, Rail & Transportation', page:'history-smart', live:true},
                    {key:'BAC', name:'BAC — Bricklayers & Allied Craftworkers', page:'history-bac', live:true},
                    {key:'IW', name:'Iron Workers — Bridge & Structural', page:'history-iron', live:true},
                    {key:'HFIAW', name:'AWIU — Heat & Frost Insulators', page:'history-insul', live:true},
                    {key:'IUEC', name:'IUEC — Elevator Constructors', page:'history-iuec', live:true},
                    {key:'IUOE', name:'IUOE — Operating Engineers'},
                    {key:'UBC', name:'UBC — Carpenters'},
                    {key:'LIUNA', name:'LIUNA — Laborers'},
                    {key:'UFCW', name:'UFCW — Food & Commercial Workers', page:'history-ufcw', live:true},
                  ].map(t => (
                    <div key={t.key} onMouseDown={() => { if (t.live) { setPage(t.page); setHistoryOpen(false); } }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`} style={{opacity: t.live ? 1 : 0.55, cursor: t.live ? "pointer" : "not-allowed"}}>
                      <span className="nav-dropdown-label" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                        <span>{t.name}</span>
                        {!t.live && <span style={{fontSize:9, fontWeight:700, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", background:"rgba(250,128,89,0.12)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"2px 8px", whiteSpace:"nowrap"}}>{lang==="es" ? "Pronto" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ABOUT DROPDOWN (uses getInTouchOpen, label changed) */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="about"||page==="contact")?" active":""}\${getInTouchOpen?" open":""}\`}
                onClick={() => { setGetInTouchOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); }}
                onBlur={() => setTimeout(() => setGetInTouchOpen(false), 150)}
              >
                {lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {getInTouchOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="about"?" active":""}\`} onMouseDown={() => { setPage("about"); setGetInTouchOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Sobre Nosotros" : lang==="pl" ? "O Nas" : "Our Story"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Quienes somos y por que" : lang==="pl" ? "Kim jestesmy i dlaczego" : "Who we are and why"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="contact"?" active":""}\`} onMouseDown={() => { setPage("contact"); setContactSent(false); setGetInTouchOpen(false); }}>
                    <span className="nav-dropdown-label">{t.navContact}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Envianos un mensaje" : lang==="pl" ? "Wyslij nam wiadomosc" : "Send us a message"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>`;

// ============================================================================
// NEW MOBILE DRAWER (mirrors the 5-section structure)
// ============================================================================
const NEW_MOBILE_DRAWER = `          <button className={\`mobile-drawer-link\${page==="home" ? " active" : ""}\`} onClick={() => { setPage("home"); setMobileNavOpen(false); setResults(null); setQuery(""); }}>{t.navHome}</button>

          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">{lang==="es" ? "Empezar" : lang==="pl" ? "Zacznij" : "Get Started"}</div>
            <button className={\`mobile-drawer-link\${page==="checklist" ? " active" : ""}\`} onClick={() => { setPage("checklist"); setMobileNavOpen(false); }}>{lang==="es" ? "Como Unirse" : lang==="pl" ? "Jak Dolaczyc" : "How to Join"}</button>
            <button className={\`mobile-drawer-link\${page==="careers" ? " active" : ""}\`} onClick={() => { setPage("careers"); setMobileNavOpen(false); }}>{lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Sciezki Kariery" : "Career Paths"}</button>
            <button className={\`mobile-drawer-link\${page==="quiz" ? " active" : ""}\`} onClick={() => { setPage("quiz"); setMobileNavOpen(false); resetQuiz(); }}>{lang==="es" ? "Que Oficio?" : lang==="pl" ? "Ktory Zawod?" : "Which Trade?"}</button>
            <button
              className={\`mobile-drawer-toggle\${page==="apprenticeship"||page.startsWith("apprenticeship-") ? " active" : ""}\${drawerTestsOpen ? " open" : ""}\`}
              onClick={() => setDrawerTestsOpen(o => !o)}
            >
              <span>{lang==="es" ? "Pruebas de Aprendizaje" : lang==="pl" ? "Testy Praktyk" : "Apprenticeship Tests"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {drawerTestsOpen && (
              <>
                <button className={\`mobile-drawer-link\${page==="apprenticeship" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas las Pruebas" : lang==="pl" ? "Wszystkie Testy" : "All Trade Tests"}</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-ibew" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-ibew"); setMobileNavOpen(false); }}>· IBEW · NJATC</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-ua" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-ua"); setMobileNavOpen(false); }}>· UA · GAN</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-smart" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-smart"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-iuec" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-iuec"); setMobileNavOpen(false); }}>· IUEC · EIAT</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-iw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-iw"); setMobileNavOpen(false); }}>· Iron Workers</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-bac" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-bac"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-hfiaw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-hfiaw"); setMobileNavOpen(false); }}>· HFIAW · Insulators</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-iuoe" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-iuoe"); setMobileNavOpen(false); }}>· IUOE · Operating Engineers</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-ubc" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-ubc"); setMobileNavOpen(false); }}>· UBC · Carpenters</button>
              </>
            )}
            <button className={\`mobile-drawer-link\${page==="calculator" ? " active" : ""}\`} onClick={() => { setPage("calculator"); setMobileNavOpen(false); }}>{lang==="es" ? "Calculadora de Salarios" : lang==="pl" ? "Kalkulator Wynagrodzen" : "Wage Calculator"}</button>
            <button className={\`mobile-drawer-link\${page==="resume" ? " active" : ""}\`} onClick={() => { setPage("resume"); setMobileNavOpen(false); }}>{lang==="es" ? "Plantilla de Curriculum" : lang==="pl" ? "Szablon CV" : "Resume Template"}</button>
          </div>

          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">{lang==="es" ? "Membresia" : lang==="pl" ? "Czlonkostwo" : "Membership"}</div>
            <button className={\`mobile-drawer-link\${page==="benefits" ? " active" : ""}\`} onClick={() => { setPage("benefits"); setMobileNavOpen(false); }}>{lang==="es" ? "Resumen de Beneficios" : lang==="pl" ? "Przeglad Swiadczen" : "Benefits Overview"}</button>
            <button className={\`mobile-drawer-link\${page==="retirement" ? " active" : ""}\`} onClick={() => { setPage("retirement"); setMobileNavOpen(false); }}>{lang==="es" ? "Jubilacion" : lang==="pl" ? "Emerytura" : "Retirement"}</button>
            <button className={\`mobile-drawer-link\${page==="veterans" ? " active" : ""}\`} onClick={() => { setPage("veterans"); setMobileNavOpen(false); }}>{lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans"}</button>
            <button className={\`mobile-drawer-link\${page==="locals" ? " active" : ""}\`} onClick={() => { setPage("locals"); setMobileNavOpen(false); }}>{lang==="es" ? "Entendiendo tu Local" : lang==="pl" ? "Rozumienie Oddzialu" : "Understanding Your Local"}</button>
            <button className={\`mobile-drawer-link\${page==="wages" ? " active" : ""}\`} onClick={() => { setPage("wages"); setMobileNavOpen(false); }}>{lang==="es" ? "Salarios" : lang==="pl" ? "Place" : "Wages"}</button>
            <button className={\`mobile-drawer-link\${page==="jobboard" ? " active" : ""}\`} onClick={() => { setPage("jobboard"); setMobileNavOpen(false); }}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>
          </div>

          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">{lang==="es" ? "Recursos" : lang==="pl" ? "Zasoby" : "Resources"}</div>
            <button className={\`mobile-drawer-link\${page==="rtw" ? " active" : ""}\`} onClick={() => { setPage("rtw"); setMobileNavOpen(false); }}>{lang==="es" ? "Derecho al Trabajo" : lang==="pl" ? "Prawo do Pracy" : "Right to Work"}</button>
            <button className={\`mobile-drawer-link\${page==="organize" ? " active" : ""}\`} onClick={() => { setPage("organize"); setMobileNavOpen(false); }}>{lang==="es" ? "Organizar Tu Trabajo" : lang==="pl" ? "Organizuj Prace" : "Workplace Organizing"}</button>
            <button className={\`mobile-drawer-link\${page==="organize-contractor" ? " active" : ""}\`} onClick={() => { setPage("organize-contractor"); setMobileNavOpen(false); }}>{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</button>
          </div>

          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</div>
            <button className={\`mobile-drawer-link\${page==="history" ? " active" : ""}\`} onClick={() => { setPage("history"); setMobileNavOpen(false); }}>{lang==="es" ? "Historia General" : lang==="pl" ? "Historia Ogolna" : "General Union History"}</button>
            <button
              className={\`mobile-drawer-toggle\${page==="trade-history"||page.startsWith("history-") ? " active" : ""}\${drawerHistoryOpen ? " open" : ""}\`}
              onClick={() => setDrawerHistoryOpen(o => !o)}
            >
              <span>{lang==="es" ? "Historias por Oficio" : lang==="pl" ? "Historia Wedlug Zawodu" : "Trade Histories"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {drawerHistoryOpen && (
              <>
                <button className={\`mobile-drawer-link\${page==="trade-history" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("trade-history"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas" : lang==="pl" ? "Wszystkie" : "All Trades"}</button>
                <button className={\`mobile-drawer-link\${page==="history-ibew" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ibew"); setMobileNavOpen(false); }}>· IBEW · Electricians</button>
                <button className={\`mobile-drawer-link\${page==="history-ua" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ua"); setMobileNavOpen(false); }}>· UA · Plumbers & Pipefitters</button>
                <button className={\`mobile-drawer-link\${page==="history-smart" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-smart"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
                <button className={\`mobile-drawer-link\${page==="history-bac" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-bac"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
                <button className={\`mobile-drawer-link\${page==="history-iron" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iron"); setMobileNavOpen(false); }}>· Iron Workers</button>
                <button className={\`mobile-drawer-link\${page==="history-insul" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-insul"); setMobileNavOpen(false); }}>· Insulators (HFIAW)</button>
                <button className={\`mobile-drawer-link\${page==="history-iuec" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iuec"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
                <button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
              </>
            )}
          </div>

          <div className="mobile-drawer-section">
            <div className="mobile-drawer-section-label">{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</div>
            <button className={\`mobile-drawer-link\${page==="about" ? " active" : ""}\`} onClick={() => { setPage("about"); setMobileNavOpen(false); }}>{lang==="es" ? "Sobre Nosotros" : lang==="pl" ? "O Nas" : "Our Story"}</button>
            <button className={\`mobile-drawer-link\${page==="contact" ? " active" : ""}\`} onClick={() => { setPage("contact"); setContactSent(false); setMobileNavOpen(false); }}>{t.navContact}</button>
          </div>
        `;

// ============================================================================
// REPLACEMENT 1 — Desktop nav
// ============================================================================
const desktopStartMarker = '          <div className="nav-links">';
const desktopEndMarker = '\n\n          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>';

const desktopStart = src.indexOf(desktopStartMarker);
if (desktopStart === -1) {
  console.error('ERROR: could not find desktop nav-links opening div');
  process.exit(1);
}
const desktopEnd = src.indexOf(desktopEndMarker, desktopStart);
if (desktopEnd === -1) {
  console.error('ERROR: could not find desktop nav-links end (lang-btn container)');
  process.exit(1);
}

const desktopOldChunk = src.slice(desktopStart, desktopEnd);
if (!desktopOldChunk.includes('Job Board') || !desktopOldChunk.includes('Get in Touch')) {
  console.error('ERROR: desktop nav chunk does not look like the old version (missing expected labels)');
  process.exit(1);
}

console.log('Desktop nav found:');
console.log('  start byte:', desktopStart);
console.log('  end byte:  ', desktopEnd);
console.log('  size:      ', desktopOldChunk.length, 'bytes');

src = src.slice(0, desktopStart) + NEW_DESKTOP_NAV + src.slice(desktopEnd);

// ============================================================================
// REPLACEMENT 2 — Mobile drawer
// ============================================================================
// Look for the mobile home button (start) and </aside> (end)
const mobileStartMarker = '          <button className={`mobile-drawer-link${page===\"home\" ? " active" : ""}`} onClick={() => { setPage("home"); setMobileNavOpen(false); setResults(null); setQuery(""); }}>{t.navHome}</button>';
const mobileEndMarker = '</aside>';

const mobileStart = src.indexOf(mobileStartMarker);
if (mobileStart === -1) {
  console.error('ERROR: could not find mobile drawer home button start marker');
  process.exit(1);
}
const mobileEnd = src.indexOf(mobileEndMarker, mobileStart);
if (mobileEnd === -1) {
  console.error('ERROR: could not find mobile drawer </aside>');
  process.exit(1);
}

const mobileOldChunk = src.slice(mobileStart, mobileEnd);
if (!mobileOldChunk.includes('Get In Touch') && !mobileOldChunk.includes('Get in Touch')) {
  console.error('ERROR: mobile drawer chunk does not look like the old version');
  process.exit(1);
}

console.log('');
console.log('Mobile drawer found:');
console.log('  start byte:', mobileStart);
console.log('  end byte:  ', mobileEnd);
console.log('  size:      ', mobileOldChunk.length, 'bytes');

src = src.slice(0, mobileStart) + NEW_MOBILE_DRAWER + src.slice(mobileEnd);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('');
console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: consolidate nav into 6 buckets (Home + Get Started/Membership/Resources/History/About)" && git push');
console.log('');
