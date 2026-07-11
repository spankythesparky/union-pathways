// fix146.js
// Revamp the About page "team" section. Until now it was a collapsible
// accordion built for two partners; David Knipp was removed in fix145, so
// the accordion now contains a single hidden card that the user has to click
// to expand. That's awkward and dated.
//
// New design: a featured magazine-style profile card. Always-visible, no
// collapse. Two-column desktop layout (large portrait on the left, content
// on the right) that stacks on mobile. Bio is prose, not buried behind a
// click. Below the prose: a career-path visualization showing the progression
// CW → Apprentice → Journeyman → Superintendent, a row of credential pills,
// and a prominent linktree CTA.
//
// This fix only touches the team section. The hero, stats, and mission
// section are left as-is.

const fs = require('fs');
const appPath = 'src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

const oldBlock =
`              <div style={{display:"flex", flexDirection:"column", gap:12, marginTop:24}}>
                {[
                  {
                    id:"noah",
                    img:"/partner-noah.png",
                    name:"Noah Alassaf",
                    handle:"Spanky The Sparky",
                    union: lang===\"es\" ? \"IBEW — Electricista Oficial / Superintendente\" : lang===\"pl\" ? \"IBEW — Elektryk Czeladnik / Superintendent\" : \"IBEW — Journeyman Electrician & Superintendent\",
                    bio: lang===\"es\" ? \"Noah Alassaf es un orgulloso miembro del IBEW y superintendente electrico con una trayectoria que combina experiencia practica en campo, propiedad de negocios y una voz fuerte en el movimiento laboral sindical actual. Despues de obtener una licenciatura de la Universidad de Ohio junto con dos titulos de asociado en el campo electrico, fundo y vendio dos negocios al inicio de su carrera. Comenzo en el sector electrico no sindical antes de hacer la transicion al sindicato, ascendiendo desde CW hasta aprendiz, oficial y finalmente superintendente. Hoy, Noah es el creador de Spanky the Sparky, una plataforma enfocada en educar, abogar y modernizar la forma en que las personas ven y acceden a las carreras en los oficios sindicales.\" : lang===\"pl\" ? \"Noah Alassaf jest dumnym czlonkiem IBEW i superintendentem elektrycznym z doswiadczeniem laczacym praktyczna prace w terenie, wlasnosc biznesu i silny glos w dzisiejszym zwiazowym ruchu pracowniczym. Po uzyskaniu tytulu licencjata na Ohio University oraz dwoch tytulów Associates w dziedzinie elektrycznej, zakladal i sprzedawal dwie firmy na poczatku kariery. Rozpoczal w niezwiazowym sektorze elektrycznym, zanim przeszedl do zwiazku, awansujac od CW przez praktykanta, czeladnika az do superintendenta. Dzis Noah jest tworca Spanky the Sparky.\" : \"Noah Alassaf is a proud IBEW member and electrical superintendent with a background that blends hands-on field experience, business ownership, and a strong voice in today's union labor movement. After earning a bachelor's degree from Ohio University along with two associate degrees in the electrical field, he went on to start and sell two businesses early in his career. He began in the non-union electrical sector before making the transition into the union, working his way up from CW to apprentice, journeyman, and ultimately superintendent. Today, Noah is the creator behind Spanky the Sparky — a growing platform focused on educating, advocating, and modernizing how people view and access careers in the union trades.\",
                    linktree: \"https://linktr.ee/spankythesparky\",
                  },
                ].map((partner) => (
                  <div key={partner.id} style={{border: partnerSection===partner.id ? \"1px solid rgba(250,128,89,0.3)\" : \"1px solid rgba(255,255,255,0.08)\", borderRadius:16, overflow:\"hidden\"}}>
                    <button
                      onClick={() => setPartnerSection(partnerSection===partner.id ? null : partner.id)}
                      style={{width:\"100%\", background:\"rgba(255,255,255,0.02)\", border:\"none\", padding:\"20px 24px\", display:\"flex\", justifyContent:\"space-between\", alignItems:\"center\", cursor:\"pointer\", textAlign:\"left\", gap:16}}
                    >
                      <div style={{display:\"flex\", alignItems:\"center\", gap:16}}>
                        <img src={partner.img} alt={partner.name} style={{width:52, height:52, borderRadius:\"50%\", objectFit:\"cover\", border:\"2px solid rgba(250,128,89,0.4)\", flexShrink:0, background:\"#000\"}} />
                        <div>
                          <div style={{fontFamily:\"'Barlow Condensed',sans-serif\", fontSize:20, fontWeight:800, color: partnerSection===partner.id ? \"#FA8059\" : \"#fff\", lineHeight:1.1}}>{partner.name}</div>
                          <div style={{fontSize:12, color:\"#FA8059\", fontWeight:700, letterSpacing:\"0.08em\", textTransform:\"uppercase\", marginTop:3}}>{partner.handle}</div>
                        </div>
                      </div>
                      <span style={{color:\"#FA8059\", fontSize:22, fontWeight:700, lineHeight:1, transform: partnerSection===partner.id ? \"rotate(45deg)\" : \"rotate(0deg)\", display:\"inline-block\", transition:\"transform 0.2s\", flexShrink:0}}>+</span>
                    </button>
                    {partnerSection===partner.id && (
                      <div style={{padding:\"0 24px 24px\", borderTop:\"1px solid rgba(255,255,255,0.06)\"}}>
                        <div style={{display:\"flex\", gap:24, alignItems:\"flex-start\", marginTop:20, flexWrap:\"wrap\"}}>
                          <img src={partner.img} alt={partner.name} style={{width:120, height:120, borderRadius:16, objectFit:\"cover\", border:\"1px solid rgba(250,128,89,0.3)\", flexShrink:0, background:\"#000\"}} />
                          <div style={{flex:1, minWidth:200}}>
                            <div style={{fontFamily:\"'Barlow Condensed',sans-serif\", fontSize:13, fontWeight:700, letterSpacing:\"0.1em\", color:\"#FA8059\", textTransform:\"uppercase\", marginBottom:8}}>{partner.union}</div>
                            <p style={{fontSize:14, color:\"var(--muted)\", lineHeight:1.7, margin:\"0 0 16px\"}}>{partner.bio}</p>
                            {partner.linktree && (
                              <a href={partner.linktree} target=\"_blank\" rel=\"noopener noreferrer\" style={{display:\"inline-flex\", alignItems:\"center\", gap:\"8px\", background:\"rgba(250,128,89,0.1)\", border:\"1px solid rgba(250,128,89,0.3)\", borderRadius:\"50px\", padding:\"8px 20px\", color:\"#FA8059\", fontSize:\"13px\", fontWeight:\"700\", fontFamily:\"'Barlow Condensed',sans-serif\", letterSpacing:\"0.08em\", textTransform:\"uppercase\", textDecoration:\"none\"}}>
                                linktr.ee/spankythesparky →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>`;

const newBlock =
`              {/* FEATURED PROFILE — magazine-style, always visible */}
              <div style={{
                marginTop:32,
                background:'linear-gradient(135deg, rgba(250,128,89,0.06) 0%, rgba(255,255,255,0.02) 60%)',
                border:'1px solid rgba(250,128,89,0.18)',
                borderRadius:24,
                overflow:'hidden',
                boxShadow:'0 24px 60px rgba(0,0,0,0.25)',
              }}>
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'minmax(0, 1fr) minmax(0, 1.4fr)',
                  gap:0,
                  alignItems:'stretch',
                }} className="about-feature-grid">
                  {/* LEFT — portrait */}
                  <div style={{
                    position:'relative',
                    background:'linear-gradient(180deg, rgba(250,128,89,0.10), rgba(0,0,0,0.0))',
                    padding:'40px 32px',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    minHeight:320,
                  }}>
                    <div style={{position:'relative', width:'100%', maxWidth:280, aspectRatio:'1 / 1'}}>
                      <div style={{
                        position:'absolute',
                        inset:-12,
                        borderRadius:24,
                        background:'radial-gradient(closest-side, rgba(250,128,89,0.35), transparent 70%)',
                        filter:'blur(20px)',
                        zIndex:0,
                      }} />
                      <img
                        src="/partner-noah.png"
                        alt="Noah Alassaf"
                        style={{
                          position:'relative',
                          width:'100%',
                          height:'100%',
                          objectFit:'cover',
                          borderRadius:20,
                          border:'1px solid rgba(250,128,89,0.35)',
                          background:'#000',
                          zIndex:1,
                        }}
                      />
                    </div>
                  </div>

                  {/* RIGHT — content */}
                  <div style={{padding:'40px 40px 36px', display:'flex', flexDirection:'column', gap:20}}>
                    <div>
                      <div style={{
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontSize:12,
                        fontWeight:700,
                        letterSpacing:'0.18em',
                        color:'#FA8059',
                        textTransform:'uppercase',
                        marginBottom:8,
                      }}>
                        {lang==="es" ? "Fundador y Creador" : lang==="pl" ? "Założyciel i Twórca" : "Founder & Creator"}
                      </div>
                      <h2 style={{
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontSize:'clamp(36px, 5vw, 56px)',
                        fontWeight:900,
                        color:'#fff',
                        lineHeight:0.95,
                        margin:'0 0 10px 0',
                      }}>
                        Noah Alassaf
                      </h2>
                      <div style={{display:'flex', flexWrap:'wrap', gap:10, alignItems:'center'}}>
                        <span style={{
                          display:'inline-flex',
                          alignItems:'center',
                          gap:6,
                          background:'rgba(250,128,89,0.12)',
                          border:'1px solid rgba(250,128,89,0.35)',
                          color:'#FA8059',
                          fontFamily:"'Barlow Condensed',sans-serif",
                          fontSize:13,
                          fontWeight:800,
                          letterSpacing:'0.08em',
                          textTransform:'uppercase',
                          padding:'6px 14px',
                          borderRadius:50,
                        }}>@ Spanky The Sparky</span>
                        <span style={{
                          fontFamily:"'Barlow Condensed',sans-serif",
                          fontSize:13,
                          fontWeight:700,
                          letterSpacing:'0.1em',
                          color:'rgba(255,255,255,0.65)',
                          textTransform:'uppercase',
                        }}>
                          {lang==="es" ? "IBEW · Electricista Oficial y Superintendente" : lang==="pl" ? "IBEW · Elektryk Czeladnik i Superintendent" : "IBEW · Journeyman Electrician & Superintendent"}
                        </span>
                      </div>
                    </div>

                    <p style={{
                      fontSize:15,
                      color:'rgba(255,255,255,0.82)',
                      lineHeight:1.75,
                      margin:0,
                    }}>
                      {lang==="es"
                        ? "Noah Alassaf es un orgulloso miembro del IBEW y superintendente electrico con una trayectoria que combina experiencia practica en campo, propiedad de negocios y una voz fuerte en el movimiento laboral sindical actual. Despues de obtener una licenciatura de la Universidad de Ohio junto con dos titulos de asociado en el campo electrico, fundo y vendio dos negocios al inicio de su carrera. Comenzo en el sector electrico no sindical antes de hacer la transicion al sindicato, ascendiendo desde CW hasta aprendiz, oficial y finalmente superintendente. Hoy, Noah es el creador de Spanky the Sparky, una plataforma enfocada en educar, abogar y modernizar la forma en que las personas ven y acceden a las carreras en los oficios sindicales."
                        : lang==="pl"
                        ? "Noah Alassaf jest dumnym członkiem IBEW i superintendentem elektrycznym z doświadczeniem łączącym praktyczną pracę w terenie, własność biznesu i silny głos w dzisiejszym związkowym ruchu pracowniczym. Po uzyskaniu tytułu licencjata na Ohio University oraz dwóch tytułów Associates w dziedzinie elektrycznej, zakładał i sprzedawał dwie firmy na początku kariery. Rozpoczął w niezwiązkowym sektorze elektrycznym, zanim przeszedł do związku, awansując od CW przez praktykanta, czeladnika aż do superintendenta. Dziś Noah jest twórcą Spanky the Sparky."
                        : "Noah Alassaf is a proud IBEW member and electrical superintendent with a background that blends hands-on field experience, business ownership, and a strong voice in today's union labor movement. After earning a bachelor's degree from Ohio University along with two associate degrees in the electrical field, he went on to start and sell two businesses early in his career. He began in the non-union electrical sector before making the transition into the union, working his way up from CW to apprentice, journeyman, and ultimately superintendent. Today, Noah is the creator behind Spanky the Sparky — a growing platform focused on educating, advocating, and modernizing how people view and access careers in the union trades."}
                    </p>
                  </div>
                </div>

                {/* FOOTER STRIP — career path + CTA */}
                <div style={{
                  borderTop:'1px solid rgba(255,255,255,0.08)',
                  background:'rgba(0,0,0,0.18)',
                  padding:'28px 40px',
                  display:'flex',
                  flexWrap:'wrap',
                  gap:24,
                  alignItems:'center',
                  justifyContent:'space-between',
                }}>
                  <div style={{display:'flex', flexDirection:'column', gap:10}}>
                    <div style={{
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:11,
                      fontWeight:700,
                      letterSpacing:'0.18em',
                      color:'rgba(255,255,255,0.5)',
                      textTransform:'uppercase',
                    }}>
                      {lang==="es" ? "Trayectoria Profesional" : lang==="pl" ? "Ścieżka Kariery" : "Career Path"}
                    </div>
                    <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', gap:8}}>
                      {[
                        lang==="es" ? "CW" : lang==="pl" ? "CW" : "CW",
                        lang==="es" ? "Aprendiz" : lang==="pl" ? "Praktykant" : "Apprentice",
                        lang==="es" ? "Oficial" : lang==="pl" ? "Czeladnik" : "Journeyman",
                        lang==="es" ? "Superintendente" : lang==="pl" ? "Superintendent" : "Superintendent",
                      ].map((step, i, arr) => (
                        <span key={i} style={{display:'inline-flex', alignItems:'center', gap:8}}>
                          <span style={{
                            display:'inline-block',
                            fontFamily:"'Barlow Condensed',sans-serif",
                            fontSize:13,
                            fontWeight:800,
                            letterSpacing:'0.06em',
                            textTransform:'uppercase',
                            color: i === arr.length - 1 ? '#FA8059' : '#fff',
                            padding:'6px 12px',
                            borderRadius:8,
                            background: i === arr.length - 1 ? 'rgba(250,128,89,0.12)' : 'rgba(255,255,255,0.05)',
                            border: i === arr.length - 1 ? '1px solid rgba(250,128,89,0.35)' : '1px solid rgba(255,255,255,0.08)',
                          }}>{step}</span>
                          {i < arr.length - 1 && <span style={{color:'rgba(250,128,89,0.55)', fontSize:14, fontWeight:700}}>→</span>}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href="https://linktr.ee/spankythesparky"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:'inline-flex',
                      alignItems:'center',
                      gap:10,
                      background:'#FA8059',
                      color:'#0B0E11',
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:14,
                      fontWeight:900,
                      letterSpacing:'0.12em',
                      textTransform:'uppercase',
                      padding:'14px 26px',
                      borderRadius:50,
                      textDecoration:'none',
                      boxShadow:'0 10px 30px rgba(250,128,89,0.25)',
                      transition:'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(250,128,89,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(250,128,89,0.25)'; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    linktr.ee/spankythesparky →
                  </a>
                </div>
              </div>

              {/* Stack the two-column grid on narrow screens */}
              <style>{\`
                @media (max-width: 768px) {
                  .about-feature-grid { grid-template-columns: 1fr !important; }
                }
              \`}</style>`;

if (code.includes('about-feature-grid')) {
  console.log('Skipping — featured profile already in place.');
} else if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  console.log('✓ Replaced collapsible team accordion with featured magazine-style profile');
} else {
  console.error('ERROR: old team-section block not found in expected form. Aborting.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: revamp About page partner section as featured magazine-style profile" && git push');
console.log('');
