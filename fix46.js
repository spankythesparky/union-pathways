const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD Linktree button to about page ─────────────────────────────────────
// Find the Spanky section and add Linktree button after it
code = code.replace(
  'Follow along: linktr.ee/spankythesparky"}</div>\n                </div>',
  'Follow along: linktr.ee/spankythesparky"}</div>\n                  <a href="https://linktr.ee/spankythesparky" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex", alignItems:"center", gap:"8px", marginTop:"16px", background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:"50px", padding:"8px 20px", color:"#FA8059", fontSize:"13px", fontWeight:"700", fontFamily:"\'Barlow Condensed\',sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", textDecoration:"none"}}>\n                    linktr.ee/spankythesparky →\n                  </a>\n                </div>'
);
console.log('✅ Added Linktree button to About page');

// ─── 2. ADD vetOpenSection state ──────────────────────────────────────────────
code = code.replace(
  'const [apprenticeOpen, setApprenticeOpen] = useState(false);',
  'const [apprenticeOpen, setApprenticeOpen] = useState(false);\n  const [vetSection, setVetSection] = useState(null);'
);
console.log('✅ Added vetSection state');

// ─── 3. REPLACE veterans page with accordion version ─────────────────────────
const vetStart = code.indexOf('        {page === "veterans" && (');
const vetEnd = code.indexOf('        {page === "about" && (');

if (vetStart === -1 || vetEnd === -1) {
  console.error('ERROR: Could not find page markers');
  process.exit(1);
}

const newVetsPage = `        {page === "veterans" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Para Veteranos y Militares" : lang==="pl" ? "Dla Weteranów i Żołnierzy" : "For Veterans & Service Members"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Tu Servicio "}<span className="accent">{"Abre la Puerta"}</span></> : lang==="pl" ? <>{"Twoja Służba "}<span className="accent">{"Otwiera Drzwi"}</span></> : <>{"Your Service "}<span className="accent">{"Opens the Door"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Las habilidades que desarrollaste en el servicio militar son exactamente lo que los oficios sindicales buscan." : lang==="pl" ? "Umiejętności zdobyte w służbie wojskowej to dokładnie to, czego szukają związkowe zawody budowlane." : "The skills you built in uniform are exactly what the union trades are looking for. Thousands of veterans have already made the transition."}
              </p>
            </div>

            <div style={{maxWidth:820, margin:"0 auto", padding:"40px 24px 80px"}}>
              {[
                {
                  id:"why",
                  title: lang==="es" ? "Por Qué los Veteranos Prosperan en los Oficios" : lang==="pl" ? "Dlaczego Weterani Odnoszą Sukces w Zawodach" : "Why Veterans Thrive in the Trades",
                  content: (
                    <div className="impact-grid" style={{marginTop:16}}>
                      {[
                        { num:"01", title: lang==="es" ? "Disciplina y Puntualidad" : lang==="pl" ? "Dyscyplina i Punktualność" : "Discipline & Punctuality", desc: lang==="es" ? "Los oficios sindicales valoran la misma ética de trabajo que el ejército inculca." : lang==="pl" ? "Związkowe zawody budowlane cenią tę samą etykę pracy, którą wojsko wpaja." : "Union trades value the same work ethic the military instills. Show up, be ready, give 100%." },
                        { num:"02", title: lang==="es" ? "Trabajo en Equipo" : lang==="pl" ? "Praca Zespołowa" : "Teamwork", desc: lang==="es" ? "Los veteranos entienden el trabajo en equipo desde el primer día — exactamente lo que requieren las cuadrillas de construcción." : lang==="pl" ? "Weterani rozumieją pracę zespołową od pierwszego dnia — dokładnie to, czego wymagają ekipy budowlane." : "Veterans understand teamwork from day one — exactly what construction crews require." },
                        { num:"03", title: lang==="es" ? "Conciencia de Seguridad" : lang==="pl" ? "Świadomość Bezpieczeństwa" : "Safety Awareness", desc: lang==="es" ? "Los veteranos están entrenados para operar con protocolos de seguridad en entornos de alta presión." : lang==="pl" ? "Weterani są przeszkoleni do pracy zgodnie z protokołami bezpieczeństwa w środowiskach wysokiego ciśnienia." : "Veterans are trained to operate with safety protocols in high-pressure environments." },
                        { num:"04", title: lang==="es" ? "Habilidades Técnicas" : lang==="pl" ? "Umiejętności Techniczne" : "Technical Skills", desc: lang==="es" ? "Muchos MOS militares se traducen directamente a habilidades comerciales — electricidad, HVAC, plomería, metalurgia." : lang==="pl" ? "Wiele wojskowych specjalności przekłada się bezpośrednio na umiejętności handlowe — elektryka, HVAC, hydraulika." : "Many military MOS codes translate directly to trade skills — electrical, HVAC, plumbing, metalwork." },
                        { num:"05", title: lang==="es" ? "Liderazgo" : lang==="pl" ? "Przywództwo" : "Leadership", desc: lang==="es" ? "Los veteranos están naturalmente preparados para roles de capataz y superintendente en los oficios." : lang==="pl" ? "Weterani są naturalnie przygotowani do ról brygadzisty i superintendenta w zawodach budowlanych." : "Veterans who managed teams and missions are naturally prepared for foreman and superintendent roles." },
                        { num:"06", title: lang==="es" ? "Trabajo Bajo Presión" : lang==="pl" ? "Praca Pod Presją" : "Working Under Pressure", desc: lang==="es" ? "Los sitios de construcción exigen las mismas capacidades de toma de decisiones bajo presión que el servicio militar." : lang==="pl" ? "Place budowy wymagają tych samych zdolności decyzyjnych pod presją co służba wojskowa." : "Construction sites demand the same under-pressure decision-making as military service." },
                      ].map((item, i) => (
                        <div key={i} className="impact-card">
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                          <div className="impact-title">{item.title}</div>
                          <div className="impact-desc">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  id:"h2h",
                  title: "Helmets to Hardhats",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:24}}>
                        {lang==="es" ? "Helmets to Hardhats (H2H) es el puente oficial del servicio militar a las carreras sindicales de construcción. Es gratuito, está respaldado por el sindicato y está diseñado específicamente para veteranos militares." : lang==="pl" ? "Helmets to Hardhats (H2H) to oficjalny most od służby wojskowej do kariery w związkowym budownictwie. Jest bezpłatny i zaprojektowany specjalnie dla weteranów wojskowych." : "Helmets to Hardhats (H2H) is the official bridge from military service to union construction careers. Free, union-backed, and designed specifically for military veterans."}
                      </p>
                      <div style={{display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:24}}>
                        {[
                          { num:"400+", label: lang==="es" ? "Sindicatos Asociados" : lang==="pl" ? "Partnerskich Związków" : "Partner Unions" },
                          { num:"40K+", label: lang==="es" ? "Veteranos Conectados" : lang==="pl" ? "Połączonych Weteranów" : "Veterans Connected" },
                          { num: lang==="es" ? "Gratis" : lang==="pl" ? "Bezpłatny" : "Free", label: lang==="es" ? "Para Veteranos" : lang==="pl" ? "Dla Weteranów" : "For All Veterans" },
                        ].map((s, i) => (
                          <div key={i} style={{background:"transparent", border:"1px solid rgba(250,128,89,0.2)", borderRadius:12, padding:"16px 24px", textAlign:"center", flex:1, minWidth:100}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:"#FA8059", lineHeight:1}}>{s.num}</div>
                            <div style={{fontSize:12, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:6, fontWeight:600}}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <a className="btn-primary" href="https://helmetstohardhats.org" target="_blank" rel="noopener noreferrer" style={{display:"inline-block", textDecoration:"none"}}>
                        {lang==="es" ? "Visitar Helmets to Hardhats →" : lang==="pl" ? "Odwiedź Helmets to Hardhats →" : "Visit Helmets to Hardhats →"}
                      </a>
                    </div>
                  )
                },
                {
                  id:"skills",
                  title: lang==="es" ? "Tus Habilidades Militares se Traducen" : lang==="pl" ? "Twoje Umiejętności Wojskowe się Przekładają" : "Your Military Skills Translate",
                  content: (
                    <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
                      {[
                        { mil: lang==="es" ? "Técnico de Electrónica de Aviación" : lang==="pl" ? "Technik Elektroniki Lotniczej" : "Aviation Electronics Technician", trade: "IBEW Electrician" },
                        { mil: lang==="es" ? "Mecánico de Vehículos de Motor" : lang==="pl" ? "Mechanik Pojazdów Silnikowych" : "Motor Vehicle Mechanic", trade: "Sheet Metal / Ironworker" },
                        { mil: lang==="es" ? "Especialista en Construcción" : lang==="pl" ? "Specjalista Budowlany" : "Construction Specialist (Combat Engineer)", trade: "UBC Carpenter / LIUNA Laborer" },
                        { mil: lang==="es" ? "Especialista en Sistemas de Armas" : lang==="pl" ? "Specjalista Systemów Uzbrojenia" : "Weapons Systems Specialist", trade: "UA Pipefitter / Boilermaker" },
                        { mil: lang==="es" ? "Especialista en HVAC" : lang==="pl" ? "Specjalista HVAC" : "HVAC Specialist", trade: "UA Plumber / Pipefitter" },
                        { mil: lang==="es" ? "Técnico en Comunicaciones" : lang==="pl" ? "Technik Łączności" : "Communications Technician", trade: "IBEW Electrician (Low Voltage)" },
                      ].map((item, i) => (
                        <div key={i} style={{display:"flex", alignItems:"center", gap:16, padding:"14px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10}}>
                          <div style={{flex:1, fontSize:14, color:"var(--muted)"}}>{item.mil}</div>
                          <div style={{color:"#FA8059", fontSize:16, fontWeight:700}}>→</div>
                          <div style={{flex:1, fontSize:14, color:"#fff", fontWeight:600}}>{item.trade}</div>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  id:"start",
                  title: lang==="es" ? "Cómo Empezar" : lang==="pl" ? "Jak Zacząć" : "How to Get Started",
                  content: (
                    <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:12}}>
                      {[
                        { n:"01", title: "Helmets to Hardhats", desc: lang==="es" ? "Regístrate gratis en helmetstohardhats.org — toma 5 minutos." : lang==="pl" ? "Zarejestruj się bezpłatnie na helmetstohardhats.org — zajmuje 5 minut." : "Register free at helmetstohardhats.org — takes 5 minutes." },
                        { n:"02", title: lang==="es" ? "Usa Union Pathways" : lang==="pl" ? "Użyj Union Pathways" : "Use Union Pathways Search", desc: lang==="es" ? "Encuentra los locales sindicales más cercanos y contacta coordinadores de aprendizaje directamente." : lang==="pl" ? "Znajdź najbliższe lokale związkowe i skontaktuj się bezpośrednio z koordynatorami praktyk." : "Find the nearest union locals and contact apprenticeship coordinators directly." },
                        { n:"03", title: lang==="es" ? "Aplica a Múltiples Sindicatos" : lang==="pl" ? "Aplikuj do Wielu Związków" : "Apply to Multiple Unions", desc: lang==="es" ? "No esperes en uno. Aplica a 3-5 al mismo tiempo para maximizar tus posibilidades." : lang==="pl" ? "Nie czekaj na jeden. Aplikuj do 3-5 jednocześnie." : "Don't wait on one. Apply to 3-5 at once to maximize your chances." },
                        { n:"04", title: lang==="es" ? "Destaca tu Experiencia Militar" : lang==="pl" ? "Podkreśl Doświadczenie Wojskowe" : "Highlight Your Military Experience", desc: lang==="es" ? "Sé específico sobre tu MOS, entrenamiento técnico y habilidades de liderazgo." : lang==="pl" ? "Bądź konkretny co do swojego MOS, szkolenia technicznego i umiejętności przywódczych." : "Be specific about your MOS, technical training, and leadership skills. This is a major advantage." },
                      ].map((s, i) => (
                        <div key={i} style={{display:"flex", gap:16, alignItems:"flex-start", padding:"16px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:800, color:"#FA8059", minWidth:28}}>{s.n}</div>
                          <div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:"#fff", marginBottom:4}}>{s.title}</div>
                            <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                },
              ].map((section) => (
                <div key={section.id} style={{marginBottom:12, border: vetSection===section.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                  <button
                    onClick={() => setVetSection(vetSection===section.id ? null : section.id)}
                    style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left"}}
                  >
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: vetSection===section.id ? "#FA8059" : "#fff"}}>{section.title}</span>
                    <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: vetSection===section.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s"}}>+</span>
                  </button>
                  {vetSection===section.id && (
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

code = code.slice(0, vetStart) + newVetsPage + code.slice(vetEnd);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Veterans page rebuilt with proper accordion (single state)');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: veterans page accordion + Linktree on about page" && git push\n');
