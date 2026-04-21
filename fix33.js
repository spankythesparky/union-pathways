const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD benefitsOpen state ────────────────────────────────────────────────
code = code.replace(
  'const [getStartedOpen, setGetStartedOpen] = useState(false);',
  'const [getStartedOpen, setGetStartedOpen] = useState(false);\n  const [benefitsOpen, setBenefitsOpen] = useState(false);'
);
console.log('✅ Added benefitsOpen state');

// ─── 2. REPLACE retirement nav button with Union Benefits dropdown ────────────
const oldRetirementNav = `            <button className={\`nav-link \${page==="history"?"active":""}\`} onClick={() => setPage("history")}>{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</button>
            <button className={\`nav-link \${page==="retirement"?"active":""}\`} onClick={() => setPage("retirement")}>{lang==="es" ? "Jubilación" : lang==="pl" ? "Emerytura" : "Retirement"}</button>`;

const newBenefitsNav = `            <button className={\`nav-link \${page==="history"?"active":""}\`} onClick={() => setPage("history")}>{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</button>

            {/* UNION BENEFITS DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="benefits"||page==="retirement"||page==="health")?" active":""}​\${benefitsOpen?" open":""}\`}
                onClick={() => setBenefitsOpen(o => !o)}
                onBlur={() => setTimeout(() => setBenefitsOpen(false), 150)}
              >
                {lang==="es" ? "Beneficios" : lang==="pl" ? "Świadczenia" : "Union Benefits"}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {benefitsOpen && (
                <div className="nav-dropdown-menu">
                  <div
                    className={\`nav-dropdown-item\${page==="benefits"?" active":""}\`}
                    onMouseDown={() => { setPage("benefits"); setBenefitsOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{lang==="es" ? "Descripción General" : lang==="pl" ? "Przegląd" : "Overview"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Por qué los sindicatos ganan" : lang==="pl" ? "Dlaczego związki wygrywają" : "Why union benefits win"}</span>
                  </div>
                  <div
                    className={\`nav-dropdown-item\${page==="retirement"?" active":""}\`}
                    onMouseDown={() => { setPage("retirement"); setBenefitsOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{lang==="es" ? "Jubilación" : lang==="pl" ? "Emerytura" : "Retirement"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "401k vs Anualidad vs Pensión" : lang==="pl" ? "401k vs Renta vs Emerytura" : "401k vs Annuity vs Pension"}</span>
                  </div>
                  <div
                    className={\`nav-dropdown-item\${page==="health"?" active":""}\`}
                    onMouseDown={() => { setPage("health"); setBenefitsOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pagado por el contratista" : lang==="pl" ? "Płacone przez wykonawcę" : "Paid by your contractor"}</span>
                  </div>
                </div>
              )}
            </div>`;

if (!code.includes(oldRetirementNav)) { console.error('ERROR: retirement nav not found'); process.exit(1); }
code = code.replace(oldRetirementNav, newBenefitsNav);
console.log('✅ Added Union Benefits dropdown');

// ─── 3. ADD valid pages ───────────────────────────────────────────────────────
code = code.replace(
  `const validPages = ['home','quiz','careers','checklist','veterans','history','retirement','contact'];`,
  `const validPages = ['home','quiz','careers','checklist','veterans','history','retirement','health','benefits','contact'];`
);
console.log('✅ Updated valid pages');

// ─── 4. ADD page meta for new pages ──────────────────────────────────────────
code = code.replace(
  `      retirement: { title: "Union Pathways — 401k vs Annuity vs Pension Explained", desc: "Learn the difference between a 401k, annuity, and pension — and why union construction trades offer some of the best retirement benefits in America." },`,
  `      retirement: { title: "Union Pathways — 401k vs Annuity vs Pension Explained", desc: "Learn the difference between a 401k, annuity, and pension — and why union construction trades offer some of the best retirement benefits in America." },
      health:     { title: "Union Pathways — Union Health Insurance Explained", desc: "Union health insurance is paid directly by your contractor — not deducted from your paycheck. Learn how it works and what it covers." },
      benefits:   { title: "Union Pathways — Union Benefits Overview", desc: "Union construction trades offer some of the best benefits in America — pensions, health insurance, annuities, and more. All paid by your contractor." },`
);
console.log('✅ Added page meta');

// ─── 5. ADD Benefits Overview page and Health Insurance page ─────────────────
const pageMarker = `        {page === "retirement" &&`;

const newPages = `        {page === "benefits" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">💼 More Than Just a Paycheck</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Beneficios "}<span className="accent">Sindicales</span></> : lang==="pl" ? <>{"Świadczenia "}<span className="accent">Związkowe</span></> : <>{"Union "}<span className="accent">Benefits</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Los trabajadores sindicalizados de la construcción no solo ganan más — también reciben un paquete de beneficios que la mayoría de los trabajadores nunca verán." : lang==="pl" ? "Związkowi pracownicy budowlani nie tylko zarabiają więcej — otrzymują też pakiet świadczeń, którego większość pracowników nigdy nie zobaczy." : "Union construction workers don't just earn more — they receive a benefits package that most workers will never see."}
              </p>
            </div>

            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"El "}<span className="accent">Paquete Completo</span></> : lang==="pl" ? <>{"Pełny "}<span className="accent">Pakiet</span></> : <>{"The "}<span className="accent">Full Package</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Todo pagado por el contratista — no deducido de tu cheque." : lang==="pl" ? "Wszystko płacone przez wykonawcę — nie potrącane z Twojej wypłaty." : "All paid by your contractor — not deducted from your paycheck."}</div>
              <div className="impact-grid">
                {[
                  { icon: "🏥", title: lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance", desc: lang==="es" ? "Cobertura médica, dental y de visión completa para ti y tu familia — pagada directamente por el contratista a tu fondo de salud." : lang==="pl" ? "Pełne ubezpieczenie medyczne, dentystyczne i wzrokowe dla Ciebie i Twojej rodziny — płacone bezpośrednio przez wykonawcę do Twojego funduszu zdrowotnego." : "Full medical, dental, and vision coverage for you and your family — paid directly by your contractor to your health fund.", page: "health" },
                  { icon: "🏦", title: lang==="es" ? "Pensión" : lang==="pl" ? "Emerytura" : "Pension", desc: lang==="es" ? "Un cheque mensual garantizado de por vida cuando te jubiles — financiado completamente por el contratista. Sin riesgo de mercado para ti." : lang==="pl" ? "Gwarantowana miesięczna wypłata przez całe życie po przejściu na emeryturę — w pełni finansowana przez wykonawcę. Żadnego ryzyka rynkowego dla Ciebie." : "A guaranteed monthly check for life when you retire — funded entirely by your contractor. No market risk to you.", page: "retirement" },
                  { icon: "📈", title: lang==="es" ? "Anualidad" : lang==="pl" ? "Renta Annuitetowa" : "Annuity", desc: lang==="es" ? "Una cuenta de ahorro adicional para la jubilación que crece con cada hora trabajada — financiada por el contratista además de tu pensión." : lang==="pl" ? "Dodatkowe konto oszczędnościowe na emeryturę, które rośnie z każdą przepracowaną godziną — finansowane przez wykonawcę oprócz Twojej emerytury." : "An additional retirement savings account that grows with every hour worked — funded by your contractor on top of your pension.", page: "retirement" },
                  { icon: "🎓", title: lang==="es" ? "Aprendizaje Pagado" : lang==="pl" ? "Płatna Praktyka" : "Paid Apprenticeship", desc: lang==="es" ? "Ganas un salario completo mientras aprendes el oficio — sin deuda estudiantil. Los contratistas también contribuyen a los fondos de formación." : lang==="pl" ? "Zarabiasz pełną pensję ucząc się zawodu — bez długu studenckiego. Wykonawcy również wpłacają do funduszy szkoleniowych." : "You earn a full wage while learning the trade — no student debt. Contractors also contribute to training funds.", page: "careers" },
                  { icon: "🛡️", title: lang==="es" ? "Seguro de Discapacidad" : lang==="pl" ? "Ubezpieczenie na Wypadek Niezdolności do Pracy" : "Disability Coverage", desc: lang==="es" ? "Si te lesionas en el trabajo, los planes sindicales suelen incluir cobertura por discapacidad a corto y largo plazo — sin costo adicional para ti." : lang==="pl" ? "Jeśli doznasz obrażeń w pracy, plany związkowe zazwyczaj obejmują ubezpieczenie od niezdolności do pracy krótko- i długoterminowej — bez dodatkowych kosztów dla Ciebie." : "If you're injured on the job, union plans typically include short and long-term disability coverage — at no extra cost to you.", page: "benefits" },
                  { icon: "💼", title: lang==="es" ? "Vacaciones Pagadas" : lang==="pl" ? "Płatny Urlop" : "Vacation & Holiday Pay", desc: lang==="es" ? "Muchos contratos sindicales incluyen contribuciones a fondos de vacaciones — acumulando dinero de vacaciones pagadas con cada hora trabajada." : lang==="pl" ? "Wiele umów związkowych obejmuje składki do funduszy urlopowych — gromadząc pieniądze na płatny urlop z każdą przepracowaną godziną." : "Many union contracts include contributions to vacation funds — accumulating paid vacation money with every hour worked.", page: "benefits" },
                ].map((item, i) => (
                  <div key={i} className="impact-card" style={{cursor: item.page !== "benefits" ? "pointer" : "default"}} onClick={() => item.page !== "benefits" && setPage(item.page)}>
                    <div className="impact-icon">{item.icon}</div>
                    <div className="impact-title">{item.title}{item.page !== "benefits" && <span style={{color:"#FA8059", fontSize:14, marginLeft:8}}>→</span>}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line" />

            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"¿Por qué los Beneficios Sindicales son "}<span className="accent">Tan Buenos?</span></> : lang==="pl" ? <>{"Dlaczego Świadczenia Związkowe są "}<span className="accent">Tak Dobre?</span></> : <>{"Why Are Union Benefits "}<span className="accent">So Good?</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "La negociación colectiva funciona." : lang==="pl" ? "Negocjacje zbiorowe działają." : "Collective bargaining works."}</div>
              <div className="quote-block">
                <div className="quote-text">{lang==="es" ? '"Cuando sumas el salario, la pensión, la anualidad y los beneficios de salud — el paquete total de compensación de un oficial puede superar los $100/hr en los mercados principales. La mayoría de la gente no se da cuenta de cuánto va hacia tu futuro."' : lang==="pl" ? '"Gdy zsumujemy wynagrodzenie, emeryturę, rentę annuitetową i świadczenia zdrowotne — całkowity pakiet wynagrodzenia czeladnika może przekroczyć $100/godz. na głównych rynkach. Większość ludzi nie zdaje sobie sprawy, ile z tego trafia do ich przyszłości."' : '"When you add up the wages, pension, annuity, and health benefits — a journeyman\'s total compensation package can exceed $100/hr in major markets. Most people don\'t realize how much of that goes toward your future."'}</div>
                <div className="quote-author">{lang==="es" ? "— El Verdadero Valor de un Paquete Sindical" : lang==="pl" ? "— Prawdziwa Wartość Pakietu Związkowego" : "— The True Value of a Union Package"}</div>
              </div>
            </div>
          </div>
        )}

        {page === "health" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "🏥 No Sale de Tu Cheque" : lang==="pl" ? "🏥 Nie Potrącane z Twojej Wypłaty" : "🏥 Never Deducted From Your Paycheck"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Seguro de Salud — "}<span className="accent">Pagado por el Contratista</span></> : lang==="pl" ? <>{"Ubezpieczenie Zdrowotne — "}<span className="accent">Płacone przez Wykonawcę</span></> : <>{"Health Insurance — "}<span className="accent">Paid by Your Contractor</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Uno de los mayores beneficios financieros de los oficios sindicales — y uno de los menos comprendidos." : lang==="pl" ? "Jedna z największych korzyści finansowych w związkowych zawodach budowlanych — i jedna z najmniej rozumianych." : "One of the biggest financial benefits of the union trades — and one of the least understood."}
              </p>
            </div>

            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"¿Cómo "}<span className="accent">Funciona?</span></> : lang==="pl" ? <>{"Jak to "}<span className="accent">Działa?</span></> : <>{"How Does It "}<span className="accent">Work?</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Simple — el contratista lo paga, no tú." : lang==="pl" ? "Prosto — wykonawca to płaci, nie Ty." : "Simple — your contractor pays it, not you."}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">💡</div>
                  <div className="impact-title">{lang==="es" ? "Cómo Funciona" : lang==="pl" ? "Jak To Działa" : "How It Works"}</div>
                  <div className="impact-desc">{lang==="es" ? "En la construcción sindical, cada contratista que firma un acuerdo sindical debe contribuir una cantidad fija por hora trabajada directamente a tu fondo de salud. Esto cubre tus primas de seguro médico — no tú. Nunca toca tu cheque." : lang==="pl" ? "W związkowym budownictwie każdy wykonawca, który podpisuje umowę związkową, jest zobowiązany wpłacać ustaloną kwotę za każdą przepracowaną godzinę bezpośrednio do Twojego funduszu zdrowotnego. Pokrywa to Twoje składki na ubezpieczenie zdrowotne — nie Ty. Nigdy nie dotyka Twojej wypłaty." : "In union construction, every contractor who signs a union agreement is required to contribute a set dollar amount per hour you work directly into your health and welfare fund. This covers your health insurance premiums — not you. It never touches your paycheck."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">💵</div>
                  <div className="impact-title">{lang==="es" ? "En Dólares" : lang==="pl" ? "W Dolarach" : "What That Means in Dollars"}</div>
                  <div className="impact-desc">{lang==="es" ? "Una contribución típica de salud sindical puede ser de $8-15 por hora trabajada. Si trabajas 2,000 horas al año, eso son $16,000-$30,000 por año para tu cobertura de salud — pagado completamente por el contratista además de tu salario." : lang==="pl" ? "Typowa składka zdrowotna związkowca może wynosić $8-15 za godzinę pracy. Jeśli pracujesz 2000 godzin rocznie, to $16 000-$30 000 rocznie na Twoje ubezpieczenie zdrowotne — płacone w całości przez wykonawcę oprócz Twojego wynagrodzenia." : "A typical union health contribution might be $8-15 per hour worked. If you work 2,000 hours a year, that's $16,000-$30,000 per year toward your health coverage — paid entirely by the contractor on top of your wages."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">👨‍👩‍👧‍👦</div>
                  <div className="impact-title">{lang==="es" ? "Cobertura Familiar" : lang==="pl" ? "Ubezpieczenie Rodzinne" : "Family Coverage Included"}</div>
                  <div className="impact-desc">{lang==="es" ? "La mayoría de los planes de salud sindicales cubren a toda tu familia — cónyuge e hijos — con poco o ningún costo adicional para ti. En el mundo no sindical, la cobertura familiar puede costar fácilmente $800-1,500/mes de tu propio bolsillo." : lang==="pl" ? "Większość planów zdrowotnych związków zawodowych obejmuje całą Twoją rodzinę — współmałżonka i dzieci — przy niewielkim lub żadnym dodatkowym koszcie dla Ciebie. W świecie niezwiązkowym ubezpieczenie rodzinne może łatwo kosztować $800-1500/mies. z własnej kieszeni." : "Most union health plans cover your entire family — spouse and children — at little to no additional cost to you. In the non-union world, family coverage can easily cost $800-1,500/month out of your own pocket."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🦷</div>
                  <div className="impact-title">{lang==="es" ? "Qué Está Cubierto" : lang==="pl" ? "Co Jest Objęte" : "What's Covered"}</div>
                  <div className="impact-desc">{lang==="es" ? "Los planes de salud sindicales típicamente incluyen médico, dental, visión, medicamentos recetados, salud mental y a veces seguro de vida — todo en un paquete. La cobertura suele ser mejor que la de la mayoría de los trabajadores de oficina." : lang==="pl" ? "Plany zdrowotne związków zawodowych zazwyczaj obejmują opiekę medyczną, dentystyczną, wzrokową, leki na receptę, usługi zdrowia psychicznego, a czasem ubezpieczenie na życie — wszystko w jednym pakiecie." : "Union health plans typically include medical, dental, vision, prescription drugs, mental health services, and sometimes life insurance — all in one package. Coverage is often better than what most office workers receive."}</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">{lang==="es" ? '"Tu salario es lo que llevas a casa. Pero tu compensación total — salario más pensión, anualidad y beneficios de salud — es lo que realmente está pagando el contratista."' : lang==="pl" ? '"Twoje wynagrodzenie to to, co zabierasz do domu. Ale Twoje całkowite wynagrodzenie — płaca plus emerytura, renta annuitetowa i świadczenia zdrowotne — to to, co naprawdę płaci wykonawca."' : '"Your wages are what you take home. But your total compensation — wages plus pension, annuity, and health benefits — is what the contractor is really paying."'}</div>
                <div className="quote-author">{lang==="es" ? "— Entendiendo tu Paquete de Compensación Sindical" : lang==="pl" ? "— Zrozumienie Twojego Pakietu Wynagrodzenia Związkowego" : "— Understanding Your Full Union Compensation Package"}</div>
              </div>
            </div>
          </div>
        )}

`;

if (!code.includes(pageMarker)) { console.error('ERROR: retirement page marker not found'); process.exit(1); }
code = code.replace(pageMarker, newPages + pageMarker);
console.log('✅ Added Benefits Overview and Health Insurance pages');

// ─── 6. REMOVE health insurance section from retirement page ─────────────────
// Remove the health section that was previously embedded in retirement
const healthSectionStart = `            <hr className="divider-line" />

            {/* HEALTH INSURANCE */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"🏥 Seguro Médico — "}<span className="accent">Pagado por el Contratista</span></> : lang==="pl" ? <>{"🏥 Ubezpieczenie Zdrowotne — "}<span className="accent">Płacone przez Wykonawcę</span></> : <>{"🏥 Health Insurance — "}<span className="accent">Paid by the Contractor</span></>}</div>`;

if (code.includes(healthSectionStart)) {
  // Find and remove just the health section from retirement, keep the rest
  const healthEnd = `            <hr className="divider-line" />

            {/* BENEFITS BREAKDOWN */}`;
  const startIdx = code.indexOf(healthSectionStart);
  const endIdx = code.indexOf(healthEnd, startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    code = code.slice(0, startIdx) + `\n` + code.slice(endIdx);
    console.log('✅ Removed health section from retirement page');
  }
} else {
  console.log('ℹ️  Health section not found in retirement page (may already be removed)');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Union Benefits dropdown with Overview and Health Insurance pages" && git push\n');
