const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── HISTORY PAGE TRANSLATIONS ───────────────────────────────────────────────

const replacements = [
  // History hero eyebrow
  [`<div className="history-eyebrow">🏗️ The Foundation of the American Middle Class</div>`,
   `<div className="history-eyebrow">{lang==="es" ? "🏗️ La Base de la Clase Media Americana" : lang==="pl" ? "🏗️ Fundament Amerykańskiej Klasy Średniej" : "🏗️ The Foundation of the American Middle Class"}</div>`],

  // History title
  [`<h1 className="history-title">
                Built by <span className="accent">Union Hands</span>
              </h1>`,
   `<h1 className="history-title">
                {lang==="es" ? <>{lang==="es"?"Construido por ":""}<span className="accent">Manos Sindicales</span></> : lang==="pl" ? <>{"Zbudowane przez "}<span className="accent">Związkowe Ręce</span></> : <>{"Built by "}<span className="accent">Union Hands</span></>}
              </h1>`],

  // History subtitle
  [`The 40-hour work week. The weekend. Child labor laws. Workplace safety. Health benefits. Retirement. Every one of these was fought for — and won — by union workers.`,
   `{lang==="es" ? "La semana laboral de 40 horas. El fin de semana. Las leyes contra el trabajo infantil. La seguridad laboral. Los beneficios de salud. La jubilación. Todo fue luchado — y ganado — por trabajadores sindicalizados." : lang==="pl" ? "40-godzinny tydzień pracy. Weekend. Prawa chroniące dzieci przed pracą. Bezpieczeństwo w pracy. Ubezpieczenie zdrowotne. Emerytura. O wszystko to walczyli — i wywalczyli — związkowcy." : "The 40-hour work week. The weekend. Child labor laws. Workplace safety. Health benefits. Retirement. Every one of these was fought for — and won — by union workers."}`],

  // History stats
  [`{ num: "150+", label: "Years of Fighting for Workers" },`,
   `{ num: "150+", label: lang==="es" ? "Años Luchando por los Trabajadores" : lang==="pl" ? "Lat Walki o Prawa Pracowników" : "Years of Fighting for Workers" },`],
  [`{ num: "16M+", label: "Union Members in the US" },`,
   `{ num: "16M+", label: lang==="es" ? "Miembros Sindicales en EE.UU." : lang==="pl" ? "Członków Związków w USA" : "Union Members in the US" },`],
  [`{ num: "18%", label: "Higher Wages for Union Workers" },`,
   `{ num: "18%", label: lang==="es" ? "Salarios Más Altos para Sindicalistas" : lang==="pl" ? "Wyższe Wynagrodzenia dla Związkowców" : "Higher Wages for Union Workers" },`],
  [`{ num: "$0", label: "Cost to Join an Apprenticeship" },`,
   `{ num: "$0", label: lang==="es" ? "Costo para Unirse a un Aprendizaje" : lang==="pl" ? "Koszt Dołączenia do Praktyki" : "Cost to Join an Apprenticeship" },`],

  // History timeline section header
  [`<div className="history-section-title">A <span className="accent">Timeline</span> of the Labor Movement</div>
              <div className="history-section-sub">From the first strikes to landmark legislation — here's how unions built America.</div>`,
   `<div className="history-section-title">{lang==="es" ? <><span className="accent">Línea de Tiempo</span>{" del Movimiento Laboral"}</> : lang==="pl" ? <><span className="accent">Oś Czasu</span>{" Ruchu Pracowniczego"}</> : <>{"A "}<span className="accent">Timeline</span>{" of the Labor Movement"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Desde las primeras huelgas hasta la legislación histórica — así construyeron América los sindicatos." : lang==="pl" ? "Od pierwszych strajków do przełomowego ustawodawstwa — tak związki budowały Amerykę." : "From the first strikes to landmark legislation — here's how unions built America."}</div>`],

  // What unions won section
  [`<div className="history-section-title">What <span className="accent">Unions Won</span> for Every American</div>
              <div className="history-section-sub">Whether you're union or not, your life is better because of what union workers fought for.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"Lo que los "}<span className="accent">Sindicatos Ganaron</span>{" para Todos"}</> : lang==="pl" ? <>{"Co "}<span className="accent">Związki Wywalczyły</span>{" dla Wszystkich"}</> : <>{"What "}<span className="accent">Unions Won</span>{" for Every American"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Ya seas sindicalista o no, tu vida es mejor gracias a lo que lucharon los trabajadores sindicalizados." : lang==="pl" ? "Niezależnie od tego, czy jesteś w związku, Twoje życie jest lepsze dzięki temu, o co walczyli związkowcy." : "Whether you're union or not, your life is better because of what union workers fought for."}</div>`],

  // Quotes section
  [`<div className="history-section-title">Words that <span className="accent">Moved</span> a Movement</div>
              <div className="history-section-sub">The voices who shaped the labor movement.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"Palabras que "}<span className="accent">Movieron</span>{" un Movimiento"}</> : lang==="pl" ? <>{"Słowa, które "}<span className="accent">Poruszyły</span>{" Ruch"}</> : <>{"Words that "}<span className="accent">Moved</span>{" a Movement"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Las voces que dieron forma al movimiento laboral." : lang==="pl" ? "Głosy, które ukształtowały ruch pracowniczy." : "The voices who shaped the labor movement."}</div>`],

  // Why It Matters Today
  [`<div className="history-section-title">Why It Matters <span className="accent">Today</span></div>
              <div className="history-section-sub">The fight isn't over — but the trades are leading the way.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"Por Qué Importa "}<span className="accent">Hoy</span></> : lang==="pl" ? <>{"Dlaczego Jest to Ważne "}<span className="accent">Dziś</span></> : <>{"Why It Matters "}<span className="accent">Today</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "La lucha no ha terminado — pero los oficios están liderando el camino." : lang==="pl" ? "Walka nie skończyła się — ale zawody budowlane prowadzą drogę." : "The fight isn't over — but the trades are leading the way."}</div>`],

  // History Find Your Local button
  [`<button className="btn-primary" onClick={() => { setPage("home"); window.scrollTo(0,0); }}>
                  Find Your Union Local →
                </button>`,
   `<button className="btn-primary" onClick={() => { setPage("home"); window.scrollTo(0,0); }}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>`],

  // ─── RETIREMENT PAGE TRANSLATIONS ──────────────────────────────────────────

  // Retirement hero eyebrow
  [`<div className="history-eyebrow">💰 Your Future, Built on the Job</div>`,
   `<div className="history-eyebrow">{lang==="es" ? "💰 Tu Futuro, Construido en el Trabajo" : lang==="pl" ? "💰 Twoja Przyszłość, Zbudowana w Pracy" : "💰 Your Future, Built on the Job"}</div>`],

  // Retirement title
  [`<h1 className="history-title">
                401k vs Annuity vs <span className="accent">Pension</span>
              </h1>`,
   `<h1 className="history-title">
                401k vs Anualidad vs <span className="accent">{lang==="es" ? "Pensión" : lang==="pl" ? "Emerytura" : "Pension"}</span>
              </h1>`],

  // Retirement subtitle
  [`Three different ways to save for retirement — and union construction trades offer all three. Here's what each one means in plain English.`,
   `{lang==="es" ? "Tres formas diferentes de ahorrar para la jubilación — y los oficios de construcción sindical ofrecen las tres. Esto es lo que significa cada una en términos simples." : lang==="pl" ? "Trzy różne sposoby oszczędzania na emeryturę — a związkowe zawody budowlane oferują wszystkie trzy. Oto co każdy z nich oznacza prostymi słowami." : "Three different ways to save for retirement — and union construction trades offer all three. Here's what each one means in plain English."}`],

  // Quick Answer section
  [`<div className="history-section-title">The <span className="accent">Quick</span> Answer</div>
              <div className="history-section-sub">Before diving in — here's the 30-second version.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"La Respuesta "}<span className="accent">Rápida</span></> : lang==="pl" ? <>{"Szybka "}<span className="accent">Odpowiedź</span></> : <>{"The "}<span className="accent">Quick</span>{" Answer"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Antes de profundizar — aquí está la versión de 30 segundos." : lang==="pl" ? "Zanim zagłębimy się w szczegóły — oto wersja 30-sekundowa." : "Before diving in — here's the 30-second version."}</div>`],

  // Pension section title
  [`<div className="history-section-title">🏆 The <span className="accent">Pension</span> — The Gold Standard</div>
              <div className="history-section-sub">The most valuable retirement benefit you can have — and union trades still offer it.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"🏆 La "}<span className="accent">Pensión</span>{" — El Estándar de Oro"}</> : lang==="pl" ? <>{"🏆 "}<span className="accent">Emerytura</span>{" — Złoty Standard"}</> : <>{"🏆 The "}<span className="accent">Pension</span>{" — The Gold Standard"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "El beneficio de jubilación más valioso que puedes tener — y los oficios sindicales todavía lo ofrecen." : lang==="pl" ? "Najcenniejszy świadczenie emerytalne, jakie możesz mieć — a związki zawodowe w budownictwie nadal je oferują." : "The most valuable retirement benefit you can have — and union trades still offer it."}</div>`],

  // Annuity section title
  [`<div className="history-section-title">📈 The <span className="accent">Annuity</span> — Your Second Check</div>
              <div className="history-section-sub">Think of it as a bonus retirement account on top of your pension.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"📈 La "}<span className="accent">Anualidad</span>{" — Tu Segundo Cheque"}</> : lang==="pl" ? <>{"📈 "}<span className="accent">Renta Annuitetowa</span>{" — Twoja Druga Wypłata"}</> : <>{"📈 The "}<span className="accent">Annuity</span>{" — Your Second Check"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Piénsalo como una cuenta de jubilación adicional además de tu pensión." : lang==="pl" ? "Pomyśl o tym jako dodatkowym koncie emerytalnym na szczycie Twojej emerytury." : "Think of it as a bonus retirement account on top of your pension."}</div>`],

  // 401k section title
  [`<div className="history-section-title">📊 The <span className="accent">401k</span> — The Most Common Plan</div>
              <div className="history-section-sub">You've probably heard of this one — here's what you need to know.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"📊 El "}<span className="accent">401k</span>{" — El Plan Más Común"}</> : lang==="pl" ? <>{"📊 "}<span className="accent">401k</span>{" — Najpopularniejszy Plan"}</> : <>{"📊 The "}<span className="accent">401k</span>{" — The Most Common Plan"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Probablemente hayas oído hablar de este — esto es lo que necesitas saber." : lang==="pl" ? "Prawdopodobnie już o tym słyszałeś — oto co musisz wiedzieć." : "You've probably heard of this one — here's what you need to know."}</div>`],

  // Health Insurance section title
  [`<div className="history-section-title">🏥 Health Insurance — <span className="accent">Paid by the Contractor</span></div>
              <div className="history-section-sub">This is one of the biggest financial benefits most people don't fully understand when they join the trades.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"🏥 Seguro Médico — "}<span className="accent">Pagado por el Contratista</span></> : lang==="pl" ? <>{"🏥 Ubezpieczenie Zdrowotne — "}<span className="accent">Płacone przez Wykonawcę</span></> : <>{"🏥 Health Insurance — "}<span className="accent">Paid by the Contractor</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Este es uno de los mayores beneficios financieros que la mayoría de la gente no comprende completamente al unirse a los oficios." : lang==="pl" ? "Jest to jeden z największych korzyści finansowych, których większość ludzi nie w pełni rozumie, dołączając do zawodów budowlanych." : "This is one of the biggest financial benefits most people don't fully understand when they join the trades."}</div>`],

  // Why Union Wins section title
  [`<div className="history-section-title">Why <span className="accent">Union Retirement</span> Beats Almost Everything</div>
              <div className="history-section-sub">Here's what a typical union construction retirement package looks like compared to a standard job.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"Por Qué la "}<span className="accent">Jubilación Sindical</span>{" Gana a Casi Todo"}</> : lang==="pl" ? <>{"Dlaczego "}<span className="accent">Emerytura Związkowa</span>{" Bije Prawie Wszystko"}</> : <>{"Why "}<span className="accent">Union Retirement</span>{" Beats Almost Everything"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Así es como se ve un paquete de jubilación típico de construcción sindical en comparación con un trabajo estándar." : lang==="pl" ? "Oto jak wygląda typowy pakiet emerytalny w związkowym budownictwie w porównaniu ze standardową pracą." : "Here's what a typical union construction retirement package looks like compared to a standard job."}</div>`],

  // Full package section title
  [`<div className="history-section-title">Your <span className="accent">Full Package</span> — What the Contractor Pays</div>
              <div className="history-section-sub">Here's an example of what a union contractor pays per hour on your behalf — beyond your base wage.</div>`,
   `<div className="history-section-title">{lang==="es" ? <>{"Tu "}<span className="accent">Paquete Completo</span>{" — Lo que Paga el Contratista"}</> : lang==="pl" ? <>{"Twój "}<span className="accent">Pełny Pakiet</span>{" — Co Płaci Wykonawca"}</> : <>{"Your "}<span className="accent">Full Package</span>{" — What the Contractor Pays"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Aquí tienes un ejemplo de lo que un contratista sindical paga por hora en tu nombre — más allá de tu salario base." : lang==="pl" ? "Oto przykład tego, co wykonawca związkowy płaci za godzinę w Twoim imieniu — poza Twoją podstawową stawką." : "Here's an example of what a union contractor pays per hour on your behalf — beyond your base wage."}</div>`],

  // Example label
  [`<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:24}}>Example: Journeyman Electrician — Major Market</div>`,
   `<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:24}}>{lang==="es" ? "Ejemplo: Electricista Oficial — Mercado Principal" : lang==="pl" ? "Przykład: Elektryk Czeladnik — Duży Rynek" : "Example: Journeyman Electrician — Major Market"}</div>`],

  // Retirement Find Your Local button
  [`<button className="btn-primary" onClick={() => { setPage("home"); window.scrollTo(0,0); }}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>`,
   `<button className="btn-primary" onClick={() => { setPage("home"); window.scrollTo(0,0); }}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>`],

  // Union worker label in comparison
  [`<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"#FA8059", marginBottom:16}}>🏗️ Union Construction Worker</div>`,
   `<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"#FA8059", marginBottom:16}}>{lang==="es" ? "🏗️ Trabajador de Construcción Sindical" : lang==="pl" ? "🏗️ Związkowy Pracownik Budowlany" : "🏗️ Union Construction Worker"}</div>`],

  // Non-union label
  [`<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"white", marginBottom:16}}>💼 Typical Non-Union Job</div>`,
   `<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"white", marginBottom:16}}>{lang==="es" ? "💼 Trabajo Típico No Sindical" : lang==="pl" ? "💼 Typowa Praca Poza Związkiem" : "💼 Typical Non-Union Job"}</div>`],
];

let count = 0;
for (const [oldStr, newStr] of replacements) {
  if (code.includes(oldStr)) {
    code = code.replace(oldStr, newStr);
    count++;
  } else {
    console.warn(`⚠️  Not found: ${oldStr.slice(0, 60)}...`);
  }
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`✅ Applied ${count}/${replacements.length} translation updates`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Spanish and Polish translations to History and Retirement pages" && git push\n');
