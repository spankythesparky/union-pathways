const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Find the health page
const healthStart = code.indexOf('        {page === "health" && (');
const healthEnd = code.indexOf('        {page === "retirement" && (');

if (healthStart === -1 || healthEnd === -1) {
  console.error('ERROR: Could not find health page markers');
  process.exit(1);
}

const newHealthPage = `        {page === "health" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Never Deducted From Your Paycheck" : lang==="pl" ? "Nie Potrącane z Twojej Wypłaty" : "Never Deducted From Your Paycheck"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Seguro de Salud — "}<span className="accent">{"Pagado por el Contratista"}</span></> : lang==="pl" ? <>{"Ubezpieczenie Zdrowotne — "}<span className="accent">{"Płacone przez Wykonawcę"}</span></> : <>{"Health Insurance — "}<span className="accent">{"Paid by Your Contractor"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Uno de los mayores beneficios financieros de los oficios sindicales — y uno de los menos comprendidos." : lang==="pl" ? "Jedna z największych korzyści finansowych w związkowych zawodach budowlanych — i jedna z najmniej rozumianych." : "One of the biggest financial benefits of the union trades — and one of the least understood."}
              </p>
            </div>

            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Como "}<span className="accent">{"Funciona"}</span></> : lang==="pl" ? <>{"Jak to "}<span className="accent">{"Działa"}</span></> : <>{"How Does It "}<span className="accent">{"Work?"}</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Simple — el contratista lo paga, no tú." : lang==="pl" ? "Prosto — wykonawca to płaci, nie Ty." : "Simple — your contractor pays it, not you."}</div>

              <div className="impact-grid">
                {[
                  { num:"01", title: lang==="es" ? "Como Funciona" : lang==="pl" ? "Jak To Działa" : "How It Works", desc: lang==="es" ? "En la construccion sindical, cada contratista que firma un acuerdo sindical debe contribuir una cantidad fija por hora trabajada directamente a tu fondo de salud. Esto cubre tus primas de seguro medico. Nunca toca tu cheque." : lang==="pl" ? "W zwiazowym budownictwie kazdy wykonawca, ktory podpisuje umowe zwiazowa, jest zobowiazany wplacac uslona kwote za kazda przepracowana godzine bezposrednio do Twojego funduszu zdrowotnego. Nigdy nie dotyka Twojej wyplaty." : "In union construction, every contractor who signs a union agreement is required to contribute a set dollar amount per hour you work directly into your health and welfare fund. This covers your health insurance premiums. It never touches your paycheck." },
                  { num:"02", title: lang==="es" ? "En Dolares" : lang==="pl" ? "W Dolarach" : "What That Means in Dollars", desc: lang==="es" ? "Una contribucion tipica de salud sindical puede ser de $8-15 por hora trabajada. Si trabajas 2,000 horas al ano, eso son $16,000-$30,000 por ano para tu cobertura de salud — pagado completamente por el contratista ademas de tu salario." : lang==="pl" ? "Typowa skladka zdrowotna zwiazkowca moze wynosic $8-15 za godzine pracy. Jesli pracujesz 2000 godzin rocznie, to $16 000-$30 000 rocznie na Twoje ubezpieczenie zdrowotne — placone w calosci przez wykonawce oprócz Twojego wynagrodzenia." : "A typical union health contribution might be $8-15 per hour worked. If you work 2,000 hours a year, that is $16,000-$30,000 per year toward your health coverage — paid entirely by the contractor on top of your wages." },
                  { num:"03", title: lang==="es" ? "Cobertura Familiar" : lang==="pl" ? "Ubezpieczenie Rodzinne" : "Family Coverage Included", desc: lang==="es" ? "La mayoria de los planes de salud sindicales cubren a toda tu familia — conyuge e hijos — con poco o ningun costo adicional para ti. En el mundo no sindical, la cobertura familiar puede costar $800-1,500 al mes de tu propio bolsillo." : lang==="pl" ? "Wiekszosc planow zdrowotnych zwiazków zawodowych obejmuje cala Twoja rodzine — wspolmalzonka i dzieci — przy niewielkim lub zadnym dodatkowym koszcie dla Ciebie. W swiecie niezwiązkowym ubezpieczenie rodzinne moze latwio kosztowac $800-1500 miesiecznie." : "Most union health plans cover your entire family — spouse and children — at little to no additional cost to you. In the non-union world, family coverage can easily cost $800-1,500 per month out of your own pocket." },
                  { num:"04", title: lang==="es" ? "Que Esta Cubierto" : lang==="pl" ? "Co Jest Objete" : "What Is Covered", desc: lang==="es" ? "Los planes de salud sindicales tipicamente incluyen medico, dental, vision, medicamentos recetados, salud mental y a veces seguro de vida — todo en un paquete. La cobertura suele ser mejor que la de la mayoria de los trabajadores de oficina." : lang==="pl" ? "Plany zdrowotne zwiazkow zawodowych zazwyczaj obejmuja opieke medyczna, dentystyczna, wzrokowa, leki na recepte, uslugi zdrowia psychicznego i czasem ubezpieczenie na zycie — wszystko w jednym pakiecie." : "Union health plans typically include medical, dental, vision, prescription drugs, mental health services, and sometimes life insurance — all in one package. Coverage is often better than what most office workers receive." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">{lang==="es" ? '"Tu salario es lo que llevas a casa. Pero tu compensacion total — salario mas pension, anualidad y beneficios de salud — es lo que realmente esta pagando el contratista."' : lang==="pl" ? '"Twoje wynagrodzenie to to, co zabierasz do domu. Ale Twoje calkowite wynagrodzenie — placa plus emerytura, renta annuitetowa i swiadczenia zdrowotne — to to, co naprawde placi wykonawca."' : '"Your wages are what you take home. But your total compensation — wages plus pension, annuity, and health benefits — is what the contractor is really paying."'}</div>
                <div className="quote-author">{lang==="es" ? "— Entendiendo tu Paquete de Compensacion Sindical" : lang==="pl" ? "— Zrozumienie Twojego Pakietu Wynagrodzenia Zwiazowego" : "— Understanding Your Full Union Compensation Package"}</div>
              </div>
            </div>
          </div>
        )}

`;

code = code.slice(0, healthStart) + newHealthPage + code.slice(healthEnd);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Health Insurance page modernized — emojis removed');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: modernize health insurance page, remove emojis" && git push\n');
