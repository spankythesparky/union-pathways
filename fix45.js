const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Find and replace the entire veterans page
const vetStart = code.indexOf('        {page === "veterans" && (');
const vetEnd = code.indexOf('        {page === "contact" && (');

if (vetStart === -1 || vetEnd === -1) {
  console.error('ERROR: Could not find veterans page');
  process.exit(1);
}

const newVetsPage = `        {page === "veterans" && (() => {
          const sections = [
            {
              id: "why",
              title: lang==="es" ? "Por Qué los Veteranos Prosperan en los Oficios" : lang==="pl" ? "Dlaczego Weterani Odnoszą Sukces w Zawodach" : "Why Veterans Thrive in the Trades",
              content: (
                <div className="impact-grid" style={{marginTop:16}}>
                  {[
                    { num:"01", title: lang==="es" ? "Disciplina y Puntualidad" : lang==="pl" ? "Dyscyplina i Punktualność" : "Discipline & Punctuality", desc: lang==="es" ? "Los oficios sindicales valoran la misma ética de trabajo que el ejército inculca. Presentarse, estar listo y dar el 100% — eso es lo que los contratistas quieren." : lang==="pl" ? "Związkowe zawody budowlane cenią tę samą etykę pracy, którą wojsko wpaja. Pojawiać się, być gotowym i dawać z siebie 100% — tego chcą wykonawcy." : "Union trades value the same work ethic the military instills. Show up, be ready, give 100% — that's exactly what contractors want." },
                    { num:"02", title: lang==="es" ? "Trabajo en Equipo" : lang==="pl" ? "Praca Zespołowa" : "Teamwork", desc: lang==="es" ? "Ya sea en una cuadrilla de electricistas o en una unidad militar, el trabajo en equipo salva vidas y termina proyectos. Los veteranos entienden esto desde el primer día." : lang==="pl" ? "Niezależnie od tego, czy jesteś w ekipie elektryków czy jednostce wojskowej, praca zespołowa ratuje życia i kończy projekty. Weterani rozumieją to od pierwszego dnia." : "Whether you're in a crew of electricians or a military unit, teamwork saves lives and finishes projects. Veterans understand this from day one." },
                    { num:"03", title: lang==="es" ? "Conciencia de Seguridad" : lang==="pl" ? "Świadomość Bezpieczeństwa" : "Safety Awareness", desc: lang==="es" ? "Los veteranos están entrenados para operar con protocolos de seguridad en entornos de alta presión. Los sitios de construcción sindical tienen los estándares de seguridad más altos de la industria." : lang==="pl" ? "Weterani są przeszkoleni do pracy zgodnie z protokołami bezpieczeństwa w środowiskach wysokiego ciśnienia. Związkowe place budowy mają najwyższe standardy bezpieczeństwa w branży." : "Veterans are trained to operate with safety protocols in high-pressure environments. Union job sites have the highest safety standards in the industry." },
                    { num:"04", title: lang==="es" ? "Habilidades Técnicas" : lang==="pl" ? "Umiejętności Techniczne" : "Technical Skills", desc: lang==="es" ? "Muchos MOS militares se traducen directamente a habilidades comerciales — electricidad, HVAC, plomería, trabajo en metal, electrónica. Es posible que ya tenga una ventaja." : lang==="pl" ? "Wiele wojskowych specjalności przekłada się bezpośrednio na umiejętności handlowe — elektryka, HVAC, hydraulika, praca w metalu, elektronika. Możesz już mieć przewagę." : "Many military MOS codes translate directly to trade skills — electrical, HVAC, plumbing, metalwork, electronics. You may already have a head start." },
                    { num:"05", title: lang==="es" ? "Liderazgo" : lang==="pl" ? "Przywództwo" : "Leadership", desc: lang==="es" ? "Los veteranos que han gestionado equipos, equipo y misiones están naturalmente preparados para roles de capataz y superintendente en los oficios." : lang==="pl" ? "Weterani, którzy zarządzali zespołami, sprzętem i misjami, są naturalnie przygotowani do ról brygadzisty i superintendenta w zawodach budowlanych." : "Veterans who have managed teams, equipment, and missions are naturally prepared for foreman and superintendent roles in the trades." },
                    { num:"06", title: lang==="es" ? "Trabajo Bajo Presión" : lang==="pl" ? "Praca Pod Presją" : "Working Under Pressure", desc: lang==="es" ? "Los plazos, las condiciones climáticas, los problemas de seguridad — los sitios de construcción exigen las mismas capacidades de toma de decisiones bajo presión que el servicio militar." : lang==="pl" ? "Terminy, warunki pogodowe, problemy z bezpieczeństwem — place budowy wymagają tych samych zdolności decyzyjnych pod presją co służba wojskowa." : "Deadlines, weather conditions, safety issues — construction sites demand the same under-pressure decision-making as military service." },
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
              id: "h2h",
              title: "Helmets to Hardhats",
              content: (
                <div style={{marginTop:16}}>
                  <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:24}}>
                    {lang==="es" ? "Helmets to Hardhats (H2H) es el puente oficial del servicio militar a las carreras sindicales de construcción. Es gratuito, está respaldado por el sindicato y está diseñado específicamente para veteranos militares, guardias nacionales y reservistas." : lang==="pl" ? "Helmets to Hardhats (H2H) to oficjalny most od służby wojskowej do kariery w związkowym budownictwie. Jest bezpłatny, wspierany przez związki i zaprojektowany specjalnie dla weteranów wojskowych, gwardii narodowej i rezerwistów." : "Helmets to Hardhats (H2H) is the official bridge from military service to union construction careers. It is free, union-backed, and designed specifically for military veterans, National Guard members, and reservists."}
                  </p>
                  <div style={{display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:24}}>
                    {[
                      { num:"400+", label: lang==="es" ? "Sindicatos Asociados" : lang==="pl" ? "Partnerskich Związków" : "Partner Unions" },
                      { num:"40K+", label: lang==="es" ? "Veteranos Conectados" : lang==="pl" ? "Połączonych Weteranów" : "Veterans Connected" },
                      { num: lang==="es" ? "Gratuito" : lang==="pl" ? "Bezpłatny" : "Free", label: lang==="es" ? "Para Veteranos" : lang==="pl" ? "Dla Weteranów" : "For All Veterans" },
                    ].map((s, i) => (
                      <div key={i} style={{background:"transparent", border:"1px solid rgba(250,128,89,0.2)", borderRadius:12, padding:"16px 24px", textAlign:"center", flex:1, minWidth:120}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:"#FA8059", lineHeight:1}}>{s.num}</div>
                        <div style={{fontSize:12, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:6, fontWeight:600}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex", flexDirection:"column", gap:12, marginBottom:24}}>
                    {[
                      { n:"01", title: lang==="es" ? "Registrarse en H2H" : lang==="pl" ? "Zarejestruj się w H2H" : "Register at H2H", desc: lang==="es" ? "Crea un perfil gratuito en helmetstohardhats.org — solo toma unos minutos." : lang==="pl" ? "Utwórz bezpłatny profil na helmetstohardhats.org — zajmuje to tylko kilka minut." : "Create a free profile at helmetstohardhats.org — takes just a few minutes." },
                      { n:"02", title: lang==="es" ? "Elegir un Oficio" : lang==="pl" ? "Wybierz Zawód" : "Choose a Trade", desc: lang==="es" ? "Selecciona de docenas de oficios sindicales basados en tus habilidades militares e intereses." : lang==="pl" ? "Wybierz spośród dziesiątek związkowych zawodów na podstawie Twoich umiejętności wojskowych i zainteresowań." : "Select from dozens of union trades based on your military skills and interests." },
                      { n:"03", title: lang==="es" ? "Ser Conectado" : lang==="pl" ? "Zostań Połączony" : "Get Connected", desc: lang==="es" ? "H2H te conecta directamente con coordinadores de aprendizaje sindical que están buscando activamente veteranos." : lang==="pl" ? "H2H łączy Cię bezpośrednio z koordynatorami praktyk związkowych, którzy aktywnie poszukują weteranów." : "H2H connects you directly with union apprenticeship coordinators who are actively looking for veterans." },
                      { n:"04", title: lang==="es" ? "Empezar a Ganar" : lang==="pl" ? "Zacznij Zarabiać" : "Start Earning", desc: lang==="es" ? "Entra en un aprendizaje registrado y empieza a ganar un salario completo con beneficios desde el primer día." : lang==="pl" ? "Wejdź do zarejestrowanej praktyki i zacznij zarabiać pełne wynagrodzenie ze świadczeniami od pierwszego dnia." : "Enter a registered apprenticeship and start earning a full wage with benefits from day one." },
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
                  <a className="btn-primary" href="https://helmetstohardhats.org" target="_blank" rel="noopener noreferrer" style={{display:"inline-block", textDecoration:"none"}}>
                    {lang==="es" ? "Visitar Helmets to Hardhats →" : lang==="pl" ? "Odwiedź Helmets to Hardhats →" : "Visit Helmets to Hardhats →"}
                  </a>
                </div>
              )
            },
            {
              id: "skills",
              title: lang==="es" ? "Tus Habilidades Militares se Traducen" : lang==="pl" ? "Twoje Umiejętności Wojskowe się Przekładają" : "Your Military Skills Translate",
              content: (
                <div style={{marginTop:16}}>
                  <div style={{display:"flex", flexDirection:"column", gap:10}}>
                    {[
                      { mil: lang==="es" ? "Técnico de Electrónica de Aviación" : lang==="pl" ? "Technik Elektroniki Lotniczej" : "Aviation Electronics Technician", trade: lang==="es" ? "Electricista IBEW" : lang==="pl" ? "Elektryk IBEW" : "IBEW Electrician" },
                      { mil: lang==="es" ? "Mecánico de Vehículos de Motor" : lang==="pl" ? "Mechanik Pojazdów Silnikowych" : "Motor Vehicle Mechanic", trade: lang==="es" ? "Trabajador de Chapa y Pintura" : lang==="pl" ? "Blacharz" : "Sheet Metal Worker / Ironworker" },
                      { mil: lang==="es" ? "Especialista en Construcción (Ingeniero de Combate)" : lang==="pl" ? "Specjalista Budowlany (Inżynier Bojowy)" : "Construction Specialist (Combat Engineer)", trade: lang==="es" ? "Carpintero UBC / Obrero LIUNA" : lang==="pl" ? "Cieśla UBC / Robotnik LIUNA" : "UBC Carpenter / LIUNA Laborer" },
                      { mil: lang==="es" ? "Especialista en Sistemas de Armas" : lang==="pl" ? "Specjalista Systemów Uzbrojenia" : "Weapons Systems Specialist", trade: lang==="es" ? "Pipefitter UA / Calderero" : lang==="pl" ? "Instalator UA / Kotlarz" : "UA Pipefitter / Boilermaker" },
                      { mil: lang==="es" ? "Especialista en HVAC" : lang==="pl" ? "Specjalista HVAC" : "HVAC Specialist", trade: lang==="es" ? "Plomero/Pipefitter UA" : lang==="pl" ? "Hydraulik/Instalator UA" : "UA Plumber / Pipefitter" },
                      { mil: lang==="es" ? "Técnico en Comunicaciones" : lang==="pl" ? "Technik Łączności" : "Communications Technician", trade: lang==="es" ? "Electricista IBEW (Low Voltage)" : lang==="pl" ? "Elektryk IBEW (Niskie Napięcie)" : "IBEW Electrician (Low Voltage)" },
                    ].map((item, i) => (
                      <div key={i} style={{display:"flex", alignItems:"center", gap:16, padding:"14px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10}}>
                        <div style={{flex:1, fontSize:14, color:"var(--muted)"}}>{item.mil}</div>
                        <div style={{color:"#FA8059", fontSize:16, fontWeight:700}}>→</div>
                        <div style={{flex:1, fontSize:14, color:"#fff", fontWeight:600}}>{item.trade}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            {
              id: "start",
              title: lang==="es" ? "Cómo Empezar" : lang==="pl" ? "Jak Zacząć" : "How to Get Started",
              content: (
                <div style={{marginTop:16}}>
                  <div style={{display:"flex", flexDirection:"column", gap:12}}>
                    {[
                      { n:"01", title: lang==="es" ? "Registrarse en Helmets to Hardhats" : lang==="pl" ? "Zarejestruj się w Helmets to Hardhats" : "Register with Helmets to Hardhats", desc: "helmetstohardhats.org — free, takes 5 minutes." },
                      { n:"02", title: lang==="es" ? "Usar el Buscador de Union Pathways" : lang==="pl" ? "Użyj Wyszukiwarki Union Pathways" : "Use Union Pathways Search", desc: lang==="es" ? "Encuentra los locales sindicales más cercanos a ti y contacta directamente con los coordinadores de aprendizaje." : lang==="pl" ? "Znajdź najbliższe lokale związkowe i skontaktuj się bezpośrednio z koordynatorami praktyk." : "Find the nearest union locals to you and contact apprenticeship coordinators directly." },
                      { n:"03", title: lang==="es" ? "Aplicar a Múltiples Sindicatos" : lang==="pl" ? "Aplikuj do Wielu Związków" : "Apply to Multiple Unions", desc: lang==="es" ? "No esperes en uno. Aplica a 3-5 al mismo tiempo para maximizar tus posibilidades." : lang==="pl" ? "Nie czekaj na jeden. Aplikuj do 3-5 jednocześnie, aby zmaksymalizować swoje szanse." : "Don't wait on one. Apply to 3-5 at once to maximize your chances and reduce wait time." },
                      { n:"04", title: lang==="es" ? "Destacar tu Experiencia Militar" : lang==="pl" ? "Podkreśl Swoje Doświadczenie Wojskowe" : "Highlight Your Military Experience", desc: lang==="es" ? "Sé específico sobre tu MOS, tu entrenamiento técnico y las habilidades de liderazgo. Esto es una gran ventaja." : lang==="pl" ? "Bądź konkretny co do swojego MOS, szkolenia technicznego i umiejętności przywódczych. To jest ogromna przewaga." : "Be specific about your MOS, your technical training, and leadership skills. This is a major advantage in the application process." },
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
                </div>
              )
            },
          ];

          return (
            <div>
              <div className="history-hero">
                <div className="history-eyebrow">{lang==="es" ? "Para Veteranos y Militares" : lang==="pl" ? "Dla Weteranów i Żołnierzy" : "For Veterans & Service Members"}</div>
                <h1 className="history-title">
                  {lang==="es" ? <>{"Tu Servicio "}<span className="accent">{"Abre la Puerta"}</span></> : lang==="pl" ? <>{"Twoja Służba "}<span className="accent">{"Otwiera Drzwi"}</span></> : <>{"Your Service "}<span className="accent">{"Opens the Door"}</span></>}
                </h1>
                <p className="history-subtitle">
                  {lang==="es" ? "Las habilidades que desarrollaste en el servicio militar son exactamente lo que los oficios sindicales buscan. Miles de veteranos ya han hecho la transición." : lang==="pl" ? "Umiejętności zdobyte w służbie wojskowej to dokładnie to, czego szukają związkowe zawody budowlane. Tysiące weteranów już dokonało tej zmiany." : "The skills you built in uniform are exactly what the union trades are looking for. Thousands of veterans have already made the transition."}
                </p>
              </div>

              <div style={{maxWidth:820, margin:"0 auto", padding:"40px 24px 80px"}}>
                {sections.map((section) => {
                  const [open, setOpen] = React.useState(false);
                  return (
                    <div key={section.id} style={{marginBottom:12, border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden", transition:"border-color 0.2s", ...(open ? {borderColor:"rgba(250,128,89,0.3)"} : {})}}>
                      <button
                        onClick={() => setOpen(o => !o)}
                        style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left"}}
                      >
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: open ? "#FA8059" : "#fff", transition:"color 0.2s"}}>{section.title}</span>
                        <span style={{color:"#FA8059", fontSize:20, fontWeight:700, transition:"transform 0.2s", display:"inline-block", transform: open ? "rotate(45deg)" : "rotate(0deg)"}}>+</span>
                      </button>
                      {open && (
                        <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                          {section.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

`;

code = code.slice(0, vetStart) + newVetsPage + code.slice(vetEnd);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Veterans page rebuilt with accordion sections and no emojis');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: rebuild veterans page with accordion sections" && git push\n');
