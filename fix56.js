const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const aboutStart = code.indexOf('        {page === "about" && (');
const aboutEnd = code.indexOf('        {page === "contact" && (');

if (aboutStart === -1 || aboutEnd === -1) {
  console.error('ERROR: page markers not found');
  process.exit(1);
}

const newAboutPage = `        {page === "about" && (
          <div>
            {/* HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">Built by Tradespeople, for Tradespeople</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"La Historia "}<span className="accent">{"Detras de la Plataforma"}</span></> : lang==="pl" ? <>{"Historia "}<span className="accent">{"Platformy"}</span></> : <>{"The Story "}<span className="accent">{"Behind the Platform"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Union Pathways no fue construida en una sala de juntas. Fue construida en una obra de construccion." : lang==="pl" ? "Union Pathways nie zostalo zbudowane w sali konferencyjnej. Zostalo zbudowane na placu budowy." : "Union Pathways was not built in a boardroom. It was built on a job site."}
              </p>

              {/* STATS ROW */}
              <div className="history-stats" style={{marginTop:48}}>
                {[
                  { num: "157K+", label: lang==="es" ? "Seguidores en Todas las Plataformas" : lang==="pl" ? "Obserwujacych na Wszystkich Platformach" : "Followers Across All Platforms" },
                  { num: "400M+", label: lang==="es" ? "Visualizaciones desde Dic. 2024" : lang==="pl" ? "Wyswietleni od Grudnia 2024" : "Views Since December 2024" },
                  { num: "5+", label: lang==="es" ? "Anos como Electricista IBEW" : lang==="pl" ? "Lat jako Elektryk IBEW" : "Years as an IBEW Electrician" },
                  { num: "1", label: lang==="es" ? "Mision — Todo Sindical. Un Lugar." : lang==="pl" ? "Misja — Wszystko Zwiazowe. Jedno Miejsce." : "Mission — Everything Union. One Place." },
                ].map((s, i) => (
                  <div key={i} className="history-stat">
                    <div className="history-stat-num">{s.num}</div>
                    <div className="history-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEAM SECTION */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Las Personas "}<span className="accent">{"Detras de la Plataforma"}</span></> : lang==="pl" ? <>{"Ludzie "}<span className="accent">{"Za Platforma"}</span></> : <>{"The People "}<span className="accent">{"Behind the Platform"}</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Electricistas, albaniles, aisladores — voces reales del movimiento laboral moderno." : lang==="pl" ? "Elektrycy, murarze, izolatorzy — prawdziwe glosy nowoczesnego ruchu pracowniczego." : "Electricians, bricklayers, insulators — real voices of the modern labor movement."}</div>

              <div style={{display:"flex", flexDirection:"column", gap:12, marginTop:24}}>
                {[
                  {
                    id:"noah",
                    img:"/partner-noah.png",
                    name:"Noah Alassaf",
                    handle:"Spanky The Sparky",
                    union: lang==="es" ? "IBEW — Electricista Oficial / Superintendente" : lang==="pl" ? "IBEW — Elektryk Czeladnik / Superintendent" : "IBEW — Journeyman Electrician & Superintendent",
                    bio: lang==="es" ? "Noah Alassaf es un orgulloso miembro del IBEW y superintendente electrico con una trayectoria que combina experiencia practica en campo, propiedad de negocios y una voz fuerte en el movimiento laboral sindical actual. Despues de obtener una licenciatura de la Universidad de Ohio junto con dos titulos de asociado en el campo electrico, fundo y vendio dos negocios al inicio de su carrera. Comenzo en el sector electrico no sindical antes de hacer la transicion al sindicato, ascendiendo desde CW hasta aprendiz, oficial y finalmente superintendente. Hoy, Noah es el creador de Spanky the Sparky, una plataforma enfocada en educar, abogar y modernizar la forma en que las personas ven y acceden a las carreras en los oficios sindicales." : lang==="pl" ? "Noah Alassaf jest dumnym czlonkiem IBEW i superintendentem elektrycznym z doswiadczeniem laczacym praktyczna prace w terenie, wlasnosc biznesu i silny glos w dzisiejszym zwiazowym ruchu pracowniczym. Po uzyskaniu tytulu licencjata na Ohio University oraz dwoch tytulów Associates w dziedzinie elektrycznej, zakladal i sprzedawal dwie firmy na poczatku kariery. Rozpoczal w niezwiazowym sektorze elektrycznym, zanim przeszedl do zwiazku, awansujac od CW przez praktykanta, czeladnika az do superintendenta. Dzis Noah jest tworca Spanky the Sparky." : "Noah Alassaf is a proud IBEW member and electrical superintendent with a background that blends hands-on field experience, business ownership, and a strong voice in today's union labor movement. After earning a bachelor's degree from Ohio University along with two associate degrees in the electrical field, he went on to start and sell two businesses early in his career. He began in the non-union electrical sector before making the transition into the union, working his way up from CW to apprentice, journeyman, and ultimately superintendent. Today, Noah is the creator behind Spanky the Sparky — a growing platform focused on educating, advocating, and modernizing how people view and access careers in the union trades.",
                    linktree: "https://linktr.ee/spankythesparky",
                  },
                  {
                    id:"david",
                    img:"/partner-david.jpg",
                    name:"David Knipp",
                    handle:"Proud Union Guy",
                    union: lang==="es" ? "Heat & Frost Insulators Local 1" : lang==="pl" ? "Heat & Frost Insulators Local 1" : "Heat & Frost Insulators Local 1",
                    bio: lang==="es" ? "David Knipp es un orgulloso miembro de Heat and Frost Insulators Local 1 cuya vida cambio cuando entro a los oficios sindicales en 2009. Conocido como Proud Union Guy, ha construido una creciente plataforma nacional hablando directamente a los trabajadores sobre oportunidad, equidad y el poder de los sindicatos. A traves de su contenido y discursos, David esta ayudando a liderar una nueva ola de voces de la clase trabajadora — impulsando un movimiento laboral moderno." : lang==="pl" ? "David Knipp jest dumnym czlonkiem Heat and Frost Insulators Local 1, ktorego zycie zmienilo sie, gdy w 2009 roku wkroczyl do zwiazowych zawodow budowlanych. Znany jako Proud Union Guy, zbudowal rosnaca ogolnokrajowa platforme, mowiac bezposrednio do pracownikow o mozliwosciach, sprawiedliwosci i sile zwiazkow zawodowych." : "David Knipp is a proud member of Heat and Frost Insulators Local 1 whose life changed when he entered the union trades in 2009. Known as Proud Union Guy, he has built a growing national platform by speaking directly to working people about opportunity, fairness, and the power of unions. Through his content and speaking, David is helping lead a new wave of working-class voices — pushing to spark a modern-day labor movement.",
                    linktree: null,
                  },
                  {
                    id:"sean",
                    img:"/partner-sean.jpg",
                    name:"Sean Allen",
                    handle:"Proud Union Warrior",
                    union: lang==="es" ? "BAC Local 21 Chicago — Presidente" : lang==="pl" ? "BAC Local 21 Chicago — Prezydent" : "BAC Local 21 Chicago — President",
                    bio: lang==="es" ? "Sean Allen es el Presidente del Local 21 de Chicago de la union de albaniles BAC y creador de Proud Union Warrior. Como miembro de 4a generacion del BAC, conoce la importancia de organizar y hacer crecer el movimiento laboral. Union Pathways es la forma mas facil y amigable de encontrar un sindicato y aprender mas sobre ellos de las personas que lo viven todos los dias." : lang==="pl" ? "Sean Allen jest Prezydentem Local 21 w Chicago zwiazku murarzy BAC i tworca Proud Union Warrior. Jako czlonek BAC 4. pokolenia, zna znaczenie organizowania i rozwijania ruchu pracowniczego. Union Pathways to najlatwiejszy i najbardziej przyjazny dla uzytkownika sposob na znalezienie zwiazku zawodowego." : "Sean Allen is the President of BAC Local 21 Chicago and creator of Proud Union Warrior. As a 4th generation BAC member, he knows the importance of organizing and growing the labor movement. Union Pathways is the easiest, most user-friendly way to find a union and learn more about them from the people who live it every day.",
                    linktree: null,
                  },
                ].map((partner) => (
                  <div key={partner.id} style={{border: partnerSection===partner.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                    <button
                      onClick={() => setPartnerSection(partnerSection===partner.id ? null : partner.id)}
                      style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left", gap:16}}
                    >
                      <div style={{display:"flex", alignItems:"center", gap:16}}>
                        <img src={partner.img} alt={partner.name} style={{width:52, height:52, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(250,128,89,0.4)", flexShrink:0, background:"#000"}} />
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: partnerSection===partner.id ? "#FA8059" : "#fff", lineHeight:1.1}}>{partner.name}</div>
                          <div style={{fontSize:12, color:"#FA8059", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:3}}>{partner.handle}</div>
                        </div>
                      </div>
                      <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: partnerSection===partner.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s", flexShrink:0}}>+</span>
                    </button>
                    {partnerSection===partner.id && (
                      <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                        <div style={{display:"flex", gap:24, alignItems:"flex-start", marginTop:20, flexWrap:"wrap"}}>
                          <img src={partner.img} alt={partner.name} style={{width:120, height:120, borderRadius:16, objectFit:"cover", border:"1px solid rgba(250,128,89,0.3)", flexShrink:0, background:"#000"}} />
                          <div style={{flex:1, minWidth:200}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", color:"#FA8059", textTransform:"uppercase", marginBottom:8}}>{partner.union}</div>
                            <p style={{fontSize:14, color:"var(--muted)", lineHeight:1.7, margin:"0 0 16px"}}>{partner.bio}</p>
                            {partner.linktree && (
                              <a href={partner.linktree} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:"50px", padding:"8px 20px", color:"#FA8059", fontSize:"13px", fontWeight:"700", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", textDecoration:"none"}}>
                                linktr.ee/spankythesparky →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line"/>

            {/* MISSION */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"La "}<span className="accent">{"Mision"}</span></> : lang==="pl" ? <>{"Nasza "}<span className="accent">{"Misja"}</span></> : <>{"The "}<span className="accent">{"Mission"}</span></>}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"14px",textTransform:"uppercase"}}>01</div>
                  <div className="impact-title">{lang==="es" ? "Construido por Trabajadores" : lang==="pl" ? "Zbudowane przez Pracownikow" : "Built by Workers"}</div>
                  <div className="impact-desc">{lang==="es" ? "No somos una empresa de marketing. Somos electricistas, albaniles e insuladores que ven la necesidad de una plataforma real para trabajadores reales." : lang==="pl" ? "Nie jestesmy firma marketingowa. Jestesmy elektrykami, murarzami i izolatorami, ktorzy widza potrzebe prawdziwej platformy dla prawdziwych pracownikow." : "We are not a marketing company. We are electricians, bricklayers, and insulators who see the need for a real platform for real workers."}</div>
                </div>
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>02</div>
                  <div className="impact-title">{lang==="es" ? "Todo en Un Lugar" : lang==="pl" ? "Wszystko w Jednym Miejscu" : "Everything in One Place"}</div>
                  <div className="impact-desc">{lang==="es" ? "Locales sindicales, rutas de carrera, beneficios, historia, recursos para veteranos — todo en una sola plataforma. Gratis. Siempre." : lang==="pl" ? "Lokale zwiazowe, sciezki kariery, swiadczenia, historia, zasoby dla weteranow — wszystko w jednej platformie. Bezplatnie. Zawsze." : "Union locals, career paths, benefits, history, veteran resources — everything in one platform. Free. Always."}</div>
                </div>
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>03</div>
                  <div className="impact-title">{lang==="es" ? "Por los Trabajadores" : lang==="pl" ? "Dla Pracownikow" : "For the Workers"}</div>
                  <div className="impact-desc">{lang==="es" ? "Ya seas un aprendiz, un oficial, un veterano o alguien que busca entrar a los oficios — este es tu recurso." : lang==="pl" ? "Niezaleznie od tego, czy jestes praktykantem, czeladnikiem, weteranem czy kims, kto chce wejsc do zawodow — to jest Twoj zasob." : "Whether you are an apprentice, journeyman, veteran, or someone looking to break into the trades — this is your resource."}</div>
                </div>
              </div>
            </div>
          </div>
        )}

`;

code = code.slice(0, aboutStart) + newAboutPage + code.slice(aboutEnd);

// Verify
const aboutCount = (code.match(/page === "about"/g) || []).length;
console.log('About page count:', aboutCount);
if (aboutCount !== 1) { console.error('ERROR: wrong about page count'); process.exit(1); }

fs.writeFileSync(filePath, code, 'utf8');
console.log('done');
