const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD apprenticeOpen state ─────────────────────────────────────────────
code = code.replace(
  'const [benefitsOpen, setBenefitsOpen] = useState(false);',
  'const [benefitsOpen, setBenefitsOpen] = useState(false);\n  const [apprenticeOpen, setApprenticeOpen] = useState(false);\n  const [learnOpen, setLearnOpen] = useState(false);'
);
console.log('✅ Added dropdown states');

// ─── 2. FIND the full nav-links div and replace it ───────────────────────────
const navStart = `          <div className="nav-links">
            <button className={\`nav-link \${page==="home"?"active":""}\`} onClick={() => setPage("home")}>{t.navHome}</button>
            <button className={\`nav-link \${page==="quiz"?"active":""}\`} onClick={() => { setPage("quiz"); resetQuiz(); }}>{t.navQuiz}</button>`;

if (!code.includes(navStart)) { console.error('ERROR: nav start not found'); process.exit(1); }

// Find end of nav-links div
const navLinksStart = code.indexOf(navStart);
const navLinksEnd = code.indexOf('          </div>\n\n          <div style={{display:"flex", alignItems:"center"', navLinksStart);

if (navLinksEnd === -1) { console.error('ERROR: nav end not found'); process.exit(1); }

const newNav = `          <div className="nav-links">
            <button className={\`nav-link \${page==="home"?"active":""}\`} onClick={() => setPage("home")}>{t.navHome}</button>

            {/* APPRENTICE DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="checklist"||page==="careers"||page==="quiz")?" active":""}​\${apprenticeOpen?" open":""}\`}
                onClick={() => setApprenticeOpen(o => !o)}
                onBlur={() => setTimeout(() => setApprenticeOpen(false), 150)}
              >
                {lang==="es" ? "Aprendiz" : lang==="pl" ? "Praktykant" : "Apprentice"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {apprenticeOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="checklist"?" active":""}\`} onMouseDown={() => { setPage("checklist"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Cómo Unirse" : lang==="pl" ? "Jak Dołączyć" : "How to Join"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Las 3 rutas reales de entrada" : lang==="pl" ? "3 prawdziwe drogi wejścia" : "The 3 real entry routes"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="careers"?" active":""}\`} onMouseDown={() => { setPage("careers"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Ścieżki Kariery" : "Career Paths"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "De aprendiz a maestro" : lang==="pl" ? "Od praktykanta do mistrza" : "Apprentice to journeyman"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="quiz"?" active":""}\`} onMouseDown={() => { setPage("quiz"); setApprenticeOpen(false); resetQuiz(); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "¿Qué Oficio?" : lang==="pl" ? "Który Zawód?" : "Which Trade?"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Encuentra tu oficio ideal" : lang==="pl" ? "Znajdź swój idealny zawód" : "Find your perfect trade match"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* LEARN DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="history"||page==="benefits"||page==="retirement"||page==="health"||page==="veterans")?" active":""}​\${learnOpen?" open":""}\`}
                onClick={() => setLearnOpen(o => !o)}
                onBlur={() => setTimeout(() => setLearnOpen(false), 150)}
              >
                {lang==="es" ? "Aprender" : lang==="pl" ? "Nauka" : "Learn"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {learnOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="history"?" active":""}\`} onMouseDown={() => { setPage("history"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia Związkowa" : "Union History"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Cómo los sindicatos construyeron América" : lang==="pl" ? "Jak związki budowały Amerykę" : "How unions built America"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="benefits"?" active":""}\`} onMouseDown={() => { setPage("benefits"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Świadczenia Związkowe" : "Union Benefits"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pensión, salud, anualidad y más" : lang==="pl" ? "Emerytura, zdrowie, renta i więcej" : "Pension, health, annuity & more"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="retirement"?" active":""}\`} onMouseDown={() => { setPage("retirement"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Jubilación" : lang==="pl" ? "Emerytura" : "Retirement"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "401k vs Anualidad vs Pensión" : lang==="pl" ? "401k vs Renta vs Emerytura" : "401k vs Annuity vs Pension"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="health"?" active":""}\`} onMouseDown={() => { setPage("health"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pagado por el contratista" : lang==="pl" ? "Płacone przez wykonawcę" : "Paid by your contractor"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="veterans"?" active":""}\`} onMouseDown={() => { setPage("veterans"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Recursos para veteranos militares" : lang==="pl" ? "Zasoby dla weteranów wojskowych" : "Resources for military veterans"}</span>
                  </div>
                </div>
              )}
            </div>

            <button className={\`nav-link \${page==="about"?"active":""}\`} onClick={() => setPage("about")}>{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</button>
            <button className={\`nav-link \${page==="contact"?"active":""}\`} onClick={() => { setPage("contact"); setContactSent(false); }}>{t.navContact}</button>
          </div>`;

code = code.slice(0, navLinksStart) + newNav + code.slice(navLinksEnd + '          </div>'.length);
console.log('✅ Nav restructured');

// ─── 3. REMOVE zero-width spaces ─────────────────────────────────────────────
const buf = Buffer.from(code, 'utf8');
const cleaned = buf.toString('utf8').replace(/\u200b/g, '');
fs.writeFileSync(filePath, cleaned, 'utf8');
console.log('✅ Zero-width spaces removed');

console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: restructure nav into Apprentice and Learn dropdowns" && git push\n');
