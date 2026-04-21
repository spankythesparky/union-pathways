const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD retSection state ──────────────────────────────────────────────────
code = code.replace(
  'const [vetSection, setVetSection] = useState(null);',
  'const [vetSection, setVetSection] = useState(null);\n  const [retSection, setRetSection] = useState(null);'
);
console.log('✅ Added retSection state');

// ─── 2. REPLACE retirement page ───────────────────────────────────────────────
const retStart = code.indexOf('        {page === "retirement" && (');
const retEnd = code.indexOf('        {page === "health" && (');

if (retStart === -1 || retEnd === -1) {
  console.error('ERROR: Could not find retirement page markers');
  process.exit(1);
}

const newRetPage = `        {page === "retirement" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Tu Futuro, Construido en el Trabajo" : lang==="pl" ? "Twoja Przyszlosc, Zbudowana w Pracy" : "Your Future, Built on the Job"}</div>
              <h1 className="history-title">
                {lang==="es" ? "401k vs Anualidad vs" : lang==="pl" ? "401k vs Renta vs" : "401k vs Annuity vs"} <span className="accent">{lang==="es" ? "Pension" : lang==="pl" ? "Emerytura" : "Pension"}</span>
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Tres formas diferentes de ahorrar para la jubilacion — y los oficios de construccion sindical ofrecen las tres." : lang==="pl" ? "Trzy rozne sposoby oszczedzania na emeryture — a zwiazowe zawody budowlane oferuja wszystkie trzy." : "Three different ways to save for retirement — and union construction trades offer all three. Here's what each one means in plain English."}
              </p>
            </div>

            <div style={{maxWidth:900, margin:"0 auto", padding:"40px 24px 80px"}}>
              {[
                {
                  id:"compare",
                  title: lang==="es" ? "La Respuesta Rapida — Comparacion" : lang==="pl" ? "Szybka Odpowiedz — Porownanie" : "The Quick Answer — Side by Side",
                  content: (
                    <div style={{overflowX:"auto", marginTop:16}}>
                      <table style={{width:"100%", borderCollapse:"collapse", fontSize:14}}>
                        <thead>
                          <tr style={{background:"rgba(250,128,89,0.12)", borderBottom:"2px solid #FA8059"}}>
                            {["", "Pension", "Annuity", "401k"].map(h => (
                              <th key={h} style={{padding:"14px 16px", textAlign:"left", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:800, color: h==="Pension" ? "#FA8059" : "white", letterSpacing:"0.05em"}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [lang==="es" ? "Quien lo financia?" : lang==="pl" ? "Kto finansuje?" : "Who funds it?", lang==="es" ? "El empleador paga" : lang==="pl" ? "Pracodawca placi" : "Employer pays in", lang==="es" ? "El empleador paga" : lang==="pl" ? "Pracodawca placi" : "Employer pays in", lang==="es" ? "Tu pagas (el empleador puede igualar)" : lang==="pl" ? "Ty placisz" : "You pay in (employer may match)"],
                            [lang==="es" ? "Pago garantizado?" : lang==="pl" ? "Gwarantowana wyplata?" : "Guaranteed payment?", lang==="es" ? "Si — de por vida" : lang==="pl" ? "Tak — dozemerytury" : "Yes — for life", lang==="es" ? "Si — cantidad fija" : lang==="pl" ? "Tak — stala kwota" : "Yes — fixed amount", lang==="es" ? "No — depende del mercado" : lang==="pl" ? "Nie — zalezne od rynku" : "No — market dependent"],
                            [lang==="es" ? "Controlas las inversiones?" : lang==="pl" ? "Kontrolujesz inwestycje?" : "You control investments?", lang==="es" ? "No" : lang==="pl" ? "Nie" : "No", lang==="es" ? "No" : lang==="pl" ? "Nie" : "No", lang==="es" ? "Si" : lang==="pl" ? "Tak" : "Yes"],
                            [lang==="es" ? "Cheque mensual en jubilacion?" : lang==="pl" ? "Miesieczna wyplata na emeryturze?" : "Monthly check in retirement?", lang==="es" ? "Si" : lang==="pl" ? "Tak" : "Yes", lang==="es" ? "Si" : lang==="pl" ? "Tak" : "Yes", lang==="es" ? "Retiras segun necesitas" : lang==="pl" ? "Wyplacasz wg potrzeb" : "You withdraw as needed"],
                            [lang==="es" ? "Comun en oficios sindicales?" : lang==="pl" ? "Czeste w zwiazach?" : "Common in union trades?", lang==="es" ? "Muy comun" : lang==="pl" ? "Bardzo czeste" : "Very common", lang==="es" ? "Muy comun" : lang==="pl" ? "Bardzo czeste" : "Very common", lang==="es" ? "A veces" : lang==="pl" ? "Czasami" : "Sometimes offered too"],
                            [lang==="es" ? "Riesgo para el trabajador?" : lang==="pl" ? "Ryzyko dla pracownika?" : "Risk to worker?", lang==="es" ? "Muy bajo" : lang==="pl" ? "Bardzo niskie" : "Very low", lang==="es" ? "Muy bajo" : lang==="pl" ? "Bardzo niskie" : "Very low", lang==="es" ? "Mayor — riesgo de mercado" : lang==="pl" ? "Wyzsze — ryzyko rynkowe" : "Higher — market risk"],
                          ].map((row, i) => (
                            <tr key={i} style={{borderBottom:"1px solid rgba(58,80,104,0.4)", background: i%2===0 ? "rgba(34,48,61,0.3)" : "transparent"}}>
                              {row.map((cell, j) => (
                                <td key={j} style={{padding:"12px 16px", color: j===0 ? "white" : "var(--muted)", fontWeight: j===0 ? 700 : 400}}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                },
                {
                  id:"pension",
                  title: lang==="es" ? "La Pension — El Estandar de Oro" : lang==="pl" ? "Emerytura — Zloty Standard" : "The Pension — The Gold Standard",
                  content: (
                    <div style={{marginTop:16}}>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Que Es" : lang==="pl" ? "Czym Jest" : "What It Is", desc: lang==="es" ? "Una pension — tambien llamada plan de beneficio definido — es una cuenta de jubilacion financiada completamente por tu empleador. No contribuyes nada de tu cheque. Cuando te jubilas, recibes un cheque mensual garantizado de por vida." : lang==="pl" ? "Emerytura — zwana takze planem swiadczen zdefiniowanych — to konto emerytalne finansowane w calosci przez pracodawce. Nie wplacasz nic ze swojej wyplaty. Po przejsciu na emeryture otrzymujesz gwarantowana miesieczna wyplate dozywotnia." : "A pension is a retirement account funded entirely by your employer. You don't contribute anything out of your paycheck. When you retire, you receive a guaranteed monthly check for the rest of your life, no matter how long you live." },
                          { num:"02", title: lang==="es" ? "Como Se Calcula" : lang==="pl" ? "Jak Jest Obliczana" : "How It's Calculated", desc: lang==="es" ? "Tu cheque mensual de pension se calcula tipicamente en base a cuantos anos trabajaste y tu salario promedio. Ejemplo: 30 anos de trabajo x 2% x $60,000 salario promedio = $36,000/ano de pension. Eso es $3,000/mes, cada mes, de por vida." : lang==="pl" ? "Twoja miesieczna emerytura jest zazwyczaj obliczana na podstawie liczby przepracowanych lat i sredniej wyplaty. Przyklad: 30 lat pracy x 2% x $60,000 srednie wynagrodzenie = $36,000/rok emerytury. To $3,000/miesiac, kazdy miesiac, dozemerytury." : "Your monthly pension check is typically calculated based on years worked and average wage. Example: 30 years x 2% x $60,000 average salary = $36,000/year pension. That is $3,000/month, every month, for life." },
                          { num:"03", title: lang==="es" ? "Por Que Es Tan Valiosa" : lang==="pl" ? "Dlaczego Jest Tak Cenna" : "Why It's So Valuable", desc: lang==="es" ? "La mayoria de los estadounidenses no tienen pension. Solo alrededor del 12% de los trabajadores del sector privado tienen una. Los trabajadores de construccion sindical estan entre los pocos que todavia la tienen." : lang==="pl" ? "Wiekszosc Amerykanow nie ma emerytury. Tylko okolo 12% pracownikow sektora prywatnego ja posiada. Zwiazowi pracownicy budowlani sa wsrod nielicznych, ktorzy ja maja." : "Most Americans have no pension. Only about 12% of private sector workers have one. Union construction workers are among the few who still do. You can't outlive a pension." },
                          { num:"04", title: lang==="es" ? "En los Oficios Sindicales" : lang==="pl" ? "W Zwiazowych Zawodach" : "In Union Trades", desc: lang==="es" ? "Casi todos los sindicatos de construccion importantes — IBEW, UA, UBC, BAC, Ironworkers, Laborers y mas — ofrecen un plan de pension de beneficio definido. Los empleadores contribuyen una cantidad fija por hora que trabajas." : lang==="pl" ? "Prawie kazdy wazny zwiazek budowlany — IBEW, UA, UBC, BAC, Ironworkers, Laborers i inni — oferuje plan emerytury ze zdefiniowanymi swiadczeniami. Pracodawcy wplacaja stala kwote za kazda przepracowana godzine." : "Nearly every major construction union — IBEW, UA, UBC, BAC, Ironworkers, Laborers, and more — offers a defined benefit pension plan. Employers contribute a set dollar amount per hour you work." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"annuity",
                  title: lang==="es" ? "La Anualidad — Tu Segundo Cheque" : lang==="pl" ? "Renta Annuitetowa — Twoja Druga Wyplata" : "The Annuity — Your Second Check",
                  content: (
                    <div style={{marginTop:16}}>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Que Es" : lang==="pl" ? "Czym Jest" : "What It Is", desc: lang==="es" ? "Una anualidad es una cuenta de ahorro adicional para la jubilacion que tu empleador financia. En la mayoria de los contratos sindicales, los empleadores contribuyen una cantidad fija por hora trabajada directamente a tu cuenta de anualidad." : lang==="pl" ? "Renta annuitetowa to dodatkowe konto oszczednosciowe na emeryture finansowane przez pracodawce. W wiekszosci umow zwiazowych pracodawcy wplacaja stala kwote za kazda przepracowana godzine bezposrednio na Twoje konto renty." : "An annuity is an additional retirement account that your employer funds. In most union contracts, employers contribute a set amount per hour worked directly into your annuity account. It builds up over your career." },
                          { num:"02", title: lang==="es" ? "Como Funciona" : lang==="pl" ? "Jak Dziala" : "How It Works", desc: lang==="es" ? "Ejemplo: Tu contrato sindical dice que el empleador contribuye $3.50/hr a tu anualidad. Si trabajas 2,000 horas al ano, eso son $7,000/ano yendo a tu cuenta — sin que tu contribuyas un solo dolar. A lo largo de 30 anos, eso podria crecer facilmente a $400,000 o mas." : lang==="pl" ? "Przyklad: Twoja umowa zwiazowa mowi, ze pracodawca wplaca $3.50/godz. do Twojej renty. Jesli pracujesz 2000 godzin rocznie, to $7000/rok na Twoje konto — bez wplacania ani jednego dolara. Przez 30 lat moze to wzrosnac do ponad $400,000." : "Example: Your union contract says the employer contributes $3.50/hr to your annuity. If you work 2,000 hours a year, that is $7,000/year going into your account without you contributing a single dollar. Over 30 years, that could grow to $400,000+." },
                          { num:"03", title: lang==="es" ? "Anualidad vs Pension" : lang==="pl" ? "Renta vs Emerytura" : "Annuity vs Pension", desc: lang==="es" ? "La diferencia clave: una pension paga una cantidad mensual fija de por vida. Una anualidad es mas como una cuenta de ahorros que crece con el tiempo. Muchos contratos sindicales incluyen AMBOS — por lo que ests construyendo dos cuentas de jubilacion separadas simultaneamente." : lang==="pl" ? "Kluczowa roznica: emerytura wyplaca stala miesieczna kwote dozemerytury. Renta jest bardziej jak konto oszczednosciowe, ktore rosnie z czasem. Wiele umow zwiazowych obejmuje OBE — wiec budujesz dwa osobne konta emerytalne jednoczesnie." : "The key difference: a pension pays a fixed monthly amount for life. An annuity is more like a savings account that grows over time. Many union contracts include BOTH — so you are building two separate retirement accounts simultaneously." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"401k",
                  title: lang==="es" ? "El 401k — El Plan Mas Comun" : lang==="pl" ? "401k — Najpopularniejszy Plan" : "The 401k — The Most Common Plan",
                  content: (
                    <div style={{marginTop:16}}>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Que Es" : lang==="pl" ? "Czym Jest" : "What It Is", desc: lang==="es" ? "Un 401k es una cuenta de ahorro para la jubilacion donde TU contribuyes una porcion de tu cheque — antes de impuestos — y el dinero crece en inversiones. Tu empleador puede igualar algunas de tus contribuciones, pero tu estas haciendo la mayor parte del financiamiento." : lang==="pl" ? "401k to konto oszczednosciowe na emeryture, gdzie TY wplacasz czesc swojej wyplaty — przed opodatkowaniem — a pieniadze rosna w inwestycjach. Twoj pracodawca moze dorzucic czesc Twoich skladek, ale to Ty finansujesz wiekszosc." : "A 401k is a retirement savings account where YOU contribute a portion of your paycheck — before taxes — and the money grows in investments. Your employer may match some contributions, but you are doing most of the funding yourself." },
                          { num:"02", title: lang==="es" ? "El Riesgo" : lang==="pl" ? "Ryzyko" : "The Risk", desc: lang==="es" ? "Tu saldo 401k sube y baja con el mercado de valores. Si el mercado cae justo antes de que te jubiles — como en 2008 — tus ahorros pueden caer un 30-40% de la noche a la manana. A diferencia de una pension, no hay una cantidad garantizada." : lang==="pl" ? "Twoje saldo 401k rosnie i spada wraz z rynkiem akcji. Jesli rynek sie zalamie tuz przed przejsciem na emeryture — jak w 2008 roku — Twoje oszczednosci moga spasc o 30-40% z dnia na dzien. W przeciwienstwie do emerytury, nie ma gwarantowanej kwoty." : "Your 401k balance goes up and down with the stock market. If the market crashes right before you retire — like 2008 — your savings can drop 30-40% overnight. Unlike a pension, there is no guaranteed amount." },
                          { num:"03", title: lang==="es" ? "En los Oficios Sindicales" : lang==="pl" ? "W Zwiazowych Zawodach" : "In Union Trades", desc: lang==="es" ? "Algunos sindicatos ofrecen un 401k ademas de una pension y anualidad. Otros no lo necesitan — porque la pension y la anualidad ya hacen lo que hace un 401k, pero mejor. En la mayoria de los casos, una pension sindical + anualidad supera a un 401k porque esta garantizado y financiado por el empleador." : lang==="pl" ? "Niektore zwiazki oferuja 401k oprócz emerytury i renty. Inne nie potrzebuja — poniewaz emerytura i renta juz robia to, co 401k, ale lepiej. W wiekszosci przypadkow zwiazowa emerytura + renta jest lepsza niz 401k, poniewaz jest gwarantowana i finansowana przez pracodawce." : "Some unions offer a 401k in addition to a pension and annuity. Others do not need to — because the pension and annuity already do what a 401k does, but better. In most cases, a union pension + annuity beats a 401k because it is guaranteed and employer-funded." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"package",
                  title: lang==="es" ? "Tu Paquete Completo — Lo que Paga el Contratista" : lang==="pl" ? "Twoj Pelny Pakiet — Co Placi Wykonawca" : "Your Full Package — What the Contractor Pays",
                  content: (
                    <div style={{marginTop:16}}>
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"32px", marginBottom:24}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:24}}>{lang==="es" ? "Ejemplo: Electricista Oficial — Mercado Principal" : lang==="pl" ? "Przyklad: Elektryk Czeladnik — Duzy Rynek" : "Example: Journeyman Electrician — Major Market"}</div>
                        {[
                          ["Base Wage", "$48.00/hr", true, lang==="es" ? "Esto es lo que aparece en tu cheque" : lang==="pl" ? "To pojawia sie na Twojej wyplacie" : "This is what appears on your paycheck"],
                          ["Health & Welfare", "$12.50/hr", false, lang==="es" ? "Pagado por el contratista directamente a tu fondo de salud — NO deducido de tu cheque" : lang==="pl" ? "Placone przez wykonawce bezposrednio do Twojego funduszu zdrowotnego — NIE potrącane z wyplaty" : "Paid by contractor directly to your health fund — NOT deducted from your check"],
                          ["Pension", "$9.00/hr", false, lang==="es" ? "Pagado por el contratista a tu fondo de pension — NO deducido de tu cheque" : lang==="pl" ? "Placone przez wykonawce do funduszu emerytalnego — NIE potrącane z wyplaty" : "Paid by contractor to your pension fund — NOT deducted from your check"],
                          ["Annuity", "$5.00/hr", false, lang==="es" ? "Pagado por el contratista a tu cuenta de jubilacion — NO deducido de tu cheque" : lang==="pl" ? "Placone przez wykonawce na Twoje konto emerytalne — NIE potrącane z wyplaty" : "Paid by contractor to your retirement account — NOT deducted from your check"],
                          ["Vacation Fund", "$4.50/hr", false, lang==="es" ? "Pagado por el contratista a tu fondo de vacaciones — NO deducido de tu cheque" : lang==="pl" ? "Placone przez wykonawce do funduszu urlopowego — NIE potrącane z wyplaty" : "Paid by contractor to your vacation fund — NOT deducted from your check"],
                          ["Training Fund", "$1.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido de tu cheque" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane z wyplaty" : "Paid by contractor — NOT deducted from your check"],
                          ["Other", "$1.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido de tu cheque" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane z wyplaty" : "Paid by contractor — NOT deducted from your check"],
                        ].map(([label, amount, isWage, note], i) => (
                          <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i < 6 ? "1px solid rgba(58,80,104,0.4)" : "none"}}>
                            <div>
                              <span style={{fontSize:15, color: isWage ? "white" : "var(--muted)", fontWeight: isWage ? 700 : 400}}>{label}</span>
                              {note && <div style={{fontSize:12, color:"#FA8059", marginTop:2}}>{note}</div>}
                            </div>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: isWage ? "#FA8059" : "var(--muted)"}}>{amount}</span>
                          </div>
                        ))}
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0 0", marginTop:8, borderTop:"2px solid #FA8059"}}>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"white"}}>{lang==="es" ? "COMPENSACION TOTAL" : lang==="pl" ? "CALKOWITE WYNAGRODZENIE" : "TOTAL COMPENSATION"}</span>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059"}}>$81.00/hr</span>
                        </div>
                        <div style={{fontSize:13, color:"var(--muted)", marginTop:12, fontStyle:"italic"}}>{lang==="es" ? "* Cifras de ejemplo. Las tasas reales varian segun el local y el contrato." : lang==="pl" ? "* Przykladowe cyfry. Rzeczywiste stawki roznia sie w zaleznosci od lokalu i roku kontraktu." : "* Example figures only. Actual rates vary by local, market, and contract year."}</div>
                      </div>
                    </div>
                  )
                },
                {
                  id:"compare2",
                  title: lang==="es" ? "Jubilacion Sindical vs No Sindical" : lang==="pl" ? "Emerytura Zwiazowa vs Niezwiazowa" : "Union vs Non-Union Retirement",
                  content: (
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:16}}>
                      <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"28px 24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color:"#FA8059", marginBottom:16}}>{lang==="es" ? "Trabajador Sindical" : lang==="pl" ? "Pracownik Zwiazowy" : "Union Construction Worker"}</div>
                        {[
                          lang==="es" ? "Pension — cheque mensual garantizado de por vida" : lang==="pl" ? "Emerytura — gwarantowana wyplata miesieczna dozywotnia" : "Pension — guaranteed monthly check for life",
                          lang==="es" ? "Anualidad — financiada por el empleador" : lang==="pl" ? "Renta — finansowana przez pracodawce" : "Annuity — employer-funded",
                          lang==="es" ? "Seguro de salud — pagado por el contratista" : lang==="pl" ? "Ubezpieczenie zdrowotne — placone przez wykonawce" : "Health insurance — paid by contractor",
                          lang==="es" ? "Seguridad Social" : lang==="pl" ? "Social Security" : "Social Security",
                          lang==="es" ? "Todo financiado principalmente por el EMPLEADOR" : lang==="pl" ? "Wszystko finansowane glownie przez PRACODAWCE" : "All funded largely by EMPLOYER contributions",
                        ].map((item, i) => (
                          <div key={i} style={{fontSize:13, color:"var(--muted)", marginBottom:8, lineHeight:1.5, paddingLeft:12, borderLeft:"2px solid rgba(250,128,89,0.4)"}}>{item}</div>
                        ))}
                      </div>
                      <div style={{background:"rgba(34,48,61,0.4)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"28px 24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color:"white", marginBottom:16}}>{lang==="es" ? "Trabajo No Sindical Tipico" : lang==="pl" ? "Typowa Praca Niezwiazowa" : "Typical Non-Union Job"}</div>
                        {[
                          lang==="es" ? "Sin pension" : lang==="pl" ? "Brak emerytury" : "No pension",
                          lang==="es" ? "Sin anualidad" : lang==="pl" ? "Brak renty" : "No annuity",
                          lang==="es" ? "401k — TU lo financias, riesgo de mercado" : lang==="pl" ? "401k — TY finansujesz, ryzyko rynkowe" : "401k — YOU fund it, market risk",
                          lang==="es" ? "Seguro de salud — primas costosas" : lang==="pl" ? "Ubezpieczenie zdrowotne — drogie skladki" : "Health insurance — often expensive premiums",
                          lang==="es" ? "Seguridad Social" : lang==="pl" ? "Social Security" : "Social Security",
                        ].map((item, i) => (
                          <div key={i} style={{fontSize:13, color:"var(--muted)", marginBottom:8, lineHeight:1.5, paddingLeft:12, borderLeft:"2px solid rgba(58,80,104,0.6)"}}>{item}</div>
                        ))}
                      </div>
                    </div>
                  )
                },
              ].map((section) => (
                <div key={section.id} style={{marginBottom:12, border: retSection===section.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                  <button
                    onClick={() => setRetSection(retSection===section.id ? null : section.id)}
                    style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left"}}
                  >
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: retSection===section.id ? "#FA8059" : "#fff"}}>{section.title}</span>
                    <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: retSection===section.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s"}}>+</span>
                  </button>
                  {retSection===section.id && (
                    <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

`;

code = code.slice(0, retStart) + newRetPage + code.slice(retEnd);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Retirement page rebuilt with accordion sections');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: rebuild retirement page with accordion sections" && git push\n');
