const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Add retSection state if not already there
if (!code.includes('const [retSection, setRetSection]')) {
  code = code.replace(
    'const [vetSection, setVetSection] = useState(null);',
    'const [vetSection, setVetSection] = useState(null);\n  const [retSection, setRetSection] = useState(null);'
  );
  console.log('✅ Added retSection state');
} else {
  console.log('ℹ️  retSection state already exists');
}

// Find retirement page - it starts at {page === "retirement" && (
// and ends at the NEXT page condition
const retMarker = '        {page === "retirement" && (';
const nextMarker = '        {page === "veterans" && (';

const retStart = code.indexOf(retMarker);
const retEnd = code.indexOf(nextMarker, retStart);

if (retStart === -1) { console.error('ERROR: retirement marker not found'); process.exit(1); }
if (retEnd === -1) { console.error('ERROR: health marker not found'); process.exit(1); }

console.log(`Found retirement page: lines ~${retStart} to ~${retEnd}`);

const newRetPage = `        {page === "retirement" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Tu Futuro, Construido en el Trabajo" : lang==="pl" ? "Twoja Przyszlosc, Zbudowana w Pracy" : "Your Future, Built on the Job"}</div>
              <h1 className="history-title">
                {"401k vs Annuity vs "}<span className="accent">{lang==="es" ? "Pension" : lang==="pl" ? "Emerytura" : "Pension"}</span>
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Tres formas diferentes de ahorrar para la jubilacion — y los oficios de construccion sindical ofrecen las tres." : lang==="pl" ? "Trzy rozne sposoby oszczedzania na emeryture — a zwiazowe zawody budowlane oferuja wszystkie trzy." : "Three different ways to save for retirement — and union construction trades offer all three."}
              </p>
            </div>

            <div style={{maxWidth:900, margin:"0 auto", padding:"40px 24px 80px"}}>
              {[
                {
                  id:"compare",
                  title: lang==="es" ? "Comparacion Rapida" : lang==="pl" ? "Szybkie Porownanie" : "Quick Comparison",
                  content: (
                    <div style={{marginTop:16, overflowX:"auto"}}>
                      <table style={{width:"100%", borderCollapse:"collapse", fontSize:14}}>
                        <thead>
                          <tr style={{background:"rgba(250,128,89,0.12)", borderBottom:"2px solid #FA8059"}}>
                            {["", "Pension", "Annuity", "401k"].map(h => (
                              <th key={h} style={{padding:"14px 16px", textAlign:"left", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:800, color: h==="Pension" ? "#FA8059" : "white"}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Who funds it?", "Employer pays", "Employer pays", "You pay in"],
                            ["Guaranteed payment?", "Yes, for life", "Yes, fixed amount", "No — market dependent"],
                            ["You control investments?", "No", "No", "Yes"],
                            ["Monthly check in retirement?", "Yes", "Yes", "You withdraw as needed"],
                            ["Common in union trades?", "Very common", "Very common", "Sometimes"],
                            ["Risk to worker?", "Very low", "Very low", "Higher — market risk"],
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
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Una pension es una cuenta de jubilacion financiada completamente por tu empleador. Cuando te jubiles, recibes un cheque mensual garantizado de por vida. Solo el 12% de los trabajadores del sector privado tienen pension. Los trabajadores de construccion sindical estan entre los pocos que todavia la tienen." : lang==="pl" ? "Emerytura to konto emerytalne finansowane w calosci przez pracodawce. Po przejsciu na emeryture otrzymujesz gwarantowana miesieczna wyplate przez cale zycie. Tylko 12% pracownikow sektora prywatnego ma emeryture." : "A pension is a retirement account funded entirely by your employer. When you retire, you receive a guaranteed monthly check for life. Only about 12% of private sector workers have a pension. Union construction workers are among the few who still do."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Como se Calcula" : lang==="pl" ? "Jak sie Oblicza" : "How It Is Calculated", desc: lang==="es" ? "Ejemplo: 30 anos x 2% x $60,000 salario promedio = $36,000/ano de pension. Eso es $3,000 al mes, de por vida." : lang==="pl" ? "Przyklad: 30 lat x 2% x $60 000 = $36 000/rok. To $3 000 miesiecznie, dozgonnie." : "Example: 30 years x 2% x $60,000 average salary = $36,000/year pension. That is $3,000 per month, every month, for life." },
                          { num:"02", title: lang==="es" ? "En los Oficios Sindicales" : lang==="pl" ? "W Zwiazowych Zawodach" : "In Union Trades", desc: lang==="es" ? "Casi todos los grandes sindicatos de construccion — IBEW, UA, UBC, BAC, Ironworkers y mas — ofrecen un plan de pension de beneficio definido. Los empleadores contribuyen por cada hora que trabajas." : lang==="pl" ? "Prawie kazdy wiekszy zwiazek budowlany — IBEW, UA, UBC, BAC, Ironworkers i inne — oferuje plan emerytalny ze swiadczeniami okreslonymi." : "Nearly every major construction union — IBEW, UA, UBC, BAC, Ironworkers, and more — offers a defined benefit pension plan. Employers contribute for every hour you work." },
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
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Una anualidad es una cuenta de ahorro adicional para la jubilacion que tu empleador financia. Los empleadores contribuyen una cantidad fija por hora trabajada. Se acumula a lo largo de tu carrera y se paga cuando te jubiles." : lang==="pl" ? "Renta annuitetowa to dodatkowe konto oszczednosciowe na emeryture finansowane przez pracodawce. Pracodawcy wplacaja stala kwote za kazda przepracowana godzine." : "An annuity is an additional retirement savings account that your employer funds. Employers contribute a set amount per hour worked. It builds up over your career and pays out when you retire."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Ejemplo Real" : lang==="pl" ? "Rzeczywisty Przyklad" : "Real Example", desc: lang==="es" ? "Tu contrato dice $3.50/hr a tu anualidad. Si trabajas 2,000 horas al ano, eso es $7,000 al ano sin que contribuyas nada. A lo largo de 30 anos, eso puede crecer a $400,000+." : lang==="pl" ? "Twoja umowa mowi $3,50/godz do Twojej renty. Jesli pracujesz 2000 godzin rocznie, to $7000 rocznie bez zadnego Twojego wkladu. W ciagu 30 lat moze urosn do $400 000+." : "Your contract says $3.50/hr to your annuity. Work 2,000 hours a year and that is $7,000/year without contributing a dollar. Over 30 years, that could grow to $400,000+." },
                          { num:"02", title: lang==="es" ? "Anualidad vs Pension" : lang==="pl" ? "Renta vs Emerytura" : "Annuity vs Pension", desc: lang==="es" ? "La pension paga un monto mensual fijo de por vida. La anualidad es mas como una cuenta de ahorros. Muchos contratos sindicales incluyen AMBAS — dos cuentas de jubilacion, ambas financiadas por tu empleador." : lang==="pl" ? "Emerytura placi stala miesieczna kwote przez cale zycie. Renta annuitetowa jest bardziej jak konto oszczednosciowe. Wiele umow zwiazowych obejmuje OBE." : "The pension pays a fixed monthly amount for life. The annuity is more like a savings account. Many union contracts include BOTH — two retirement accounts, both employer-funded." },
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
                  id:"k401",
                  title: lang==="es" ? "El 401k — El Plan Mas Comun" : lang==="pl" ? "401k — Najpopularniejszy Plan" : "The 401k — The Most Common Plan",
                  content: (
                    <div style={{marginTop:16}}>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Que Es" : lang==="pl" ? "Co To Jest" : "What It Is", desc: lang==="es" ? "Un 401k es una cuenta donde TU contribuyes una parte de tu cheque antes de impuestos. El dinero crece en inversiones. Tu empleador puede igualar algunas contribuciones, pero tu eres quien mas financia." : lang==="pl" ? "401k to konto oszczednosciowe, w ktorym TY wplacasz czesc swojej wyplaty przed opodatkowaniem. Pieniadze rosna w inwestycjach." : "A 401k is a savings account where YOU contribute a portion of your paycheck before taxes. The money grows in investments. You are doing most of the funding yourself." },
                          { num:"02", title: lang==="es" ? "El Riesgo" : lang==="pl" ? "Ryzyko" : "The Risk", desc: lang==="es" ? "Tu saldo sube y baja con el mercado de valores. Si el mercado cae justo antes de que te jubiles, tus ahorros pueden caer un 30-40% de la noche a la manana. No hay monto garantizado." : lang==="pl" ? "Twoje saldo rosnie i spada wraz z rynkiem akcji. Jesli rynek spadnie tuz przed emerytura, oszczednosci moga spasc o 30-40% z dnia na dzien." : "Your 401k balance goes up and down with the stock market. If the market crashes right before you retire, your savings can drop 30-40% overnight. No guaranteed amount." },
                          { num:"03", title: lang==="es" ? "vs Beneficios Sindicales" : lang==="pl" ? "vs Swiadczenia Zwiazowe" : "vs Union Benefits", desc: lang==="es" ? "En la mayoria de los casos, una pension sindical + anualidad es mejor que un 401k porque esta garantizada y financiada por el empleador — no sale de tu cheque." : lang==="pl" ? "W wiekszosci przypadkow zwiazowa emerytura + renta jest lepsza niz 401k, bo jest gwarantowana i finansowana przez pracodawce." : "In most cases, a union pension plus annuity beats a 401k because it is guaranteed and employer-funded — it does not come out of your paycheck." },
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
                  title: lang==="es" ? "Tu Paquete Completo" : lang==="pl" ? "Twoj Pelny Pakiet" : "Your Full Compensation Package",
                  content: (
                    <div style={{marginTop:16}}>
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:16, padding:"24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:20}}>
                          {lang==="es" ? "Ejemplo: Electricista Oficial — Mercado Principal" : lang==="pl" ? "Przyklad: Elektryk Czeladnik — Duzy Rynek" : "Example: Journeyman Electrician — Major Market"}
                        </div>
                        {[
                          ["Base Wage", "$48.00/hr", true, lang==="es" ? "Lo que aparece en tu cheque" : lang==="pl" ? "Co pojawia sie w wyplacie" : "This is what appears on your paycheck"],
                          ["Health & Welfare", "$12.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Pension", "$9.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Annuity", "$5.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Vacation Fund", "$4.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Training & Other", "$2.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                        ].map(([label, amount, isWage, note], i) => (
                          <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i < 5 ? "1px solid rgba(58,80,104,0.4)" : "none"}}>
                            <div>
                              <span style={{fontSize:15, color: isWage ? "white" : "var(--muted)", fontWeight: isWage ? 700 : 400}}>{label}</span>
                              {note && <div style={{fontSize:12, color:"#FA8059", marginTop:2}}>{note}</div>}
                            </div>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: isWage ? "#FA8059" : "var(--muted)"}}>{amount}</span>
                          </div>
                        ))}
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0 0", marginTop:8, borderTop:"2px solid #FA8059"}}>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"white"}}>{lang==="es" ? "COMPENSACION TOTAL" : lang==="pl" ? "CALKOWITE WYNAGRODZENIE" : "TOTAL COMPENSATION"}</span>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#FA8059"}}>$81.00/hr</span>
                        </div>
                        <div style={{fontSize:12, color:"var(--muted)", marginTop:12, fontStyle:"italic"}}>
                          {lang==="es" ? "* Solo ejemplo. Las tarifas reales varian por local y ano de contrato." : lang==="pl" ? "* Tylko przyklad. Stawki roznia sie w zaleznosci od lokalu." : "* Example figures only. Actual rates vary by local, market, and contract year."}
                        </div>
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

// Verify only one retirement page now
const count = (code.match(/page === "retirement"/g) || []).length;
console.log('Retirement page count:', count);
if (count !== 1) {
  console.error('ERROR: wrong number of retirement pages!');
  process.exit(1);
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('done');
