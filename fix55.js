const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Add partnerSection state
code = code.replace(
  'const [retSection, setRetSection] = useState(null);',
  'const [retSection, setRetSection] = useState(null);\n  const [partnerSection, setPartnerSection] = useState(null);'
);
console.log('✅ Added partnerSection state');

// Find where to insert — just before the contact page
const insertMarker = '        {page === "contact" && (';
if (!code.includes(insertMarker)) { console.error('ERROR: contact marker not found'); process.exit(1); }

// Find the about page closing — it's the )} just before contact page
// We insert the partners section inside the about page, before its closing
const aboutMarker = '        {page === "about" && (';
const aboutStart = code.indexOf(aboutMarker);
const contactStart = code.indexOf(insertMarker);

// Find the last </div> closing before the contact page — this is the about page's end
// We'll insert the partners section before the quote block's closing on the about page
const insertAfter = '              <div className="quote-author">— Noah, {lang==="es" ? "Fundador de Union Pathways" : lang==="pl" ? "Założyciel Union Pathways" : "Founder of Union Pathways"}</div>\n              </div>\n            </div>\n          </div>\n        )}';

const partnersSection = `              <div className="quote-author">— Noah, {lang==="es" ? "Fundador de Union Pathways" : lang==="pl" ? "Założyciel Union Pathways" : "Founder of Union Pathways"}</div>
              </div>
            </div>

            {/* PARTNERS SECTION */}
            <hr className="divider-line"/>
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Nuestros "}<span className="accent">{"Socios"}</span></> : lang==="pl" ? <>{"Nasi "}<span className="accent">{"Partnerzy"}</span></> : <>{"Our "}<span className="accent">{"Partners"}</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Voces del movimiento laboral moderno." : lang==="pl" ? "Glosy nowoczesnego ruchu pracowniczego." : "Voices of the modern labor movement."}</div>

              <div style={{display:"flex", flexDirection:"column", gap:12, marginTop:24}}>
                {[
                  {
                    id:"david",
                    img:"/partner-david.jpg",
                    name:"David Knipp",
                    handle:"Proud Union Guy",
                    union: lang==="es" ? "Heat & Frost Insulators Local 1" : lang==="pl" ? "Heat & Frost Insulators Local 1" : "Heat & Frost Insulators Local 1",
                    bio: lang==="es" ? "David Knipp es un orgulloso miembro de Heat and Frost Insulators Local 1 cuya vida cambio cuando entro a los oficios sindicales en 2009. Conocido como 'Proud Union Guy', ha construido una creciente plataforma nacional hablando directamente a los trabajadores sobre oportunidad, equidad y el poder de los sindicatos. A traves de su contenido y discursos, David esta ayudando a liderar una nueva ola de voces de la clase trabajadora — impulsando un movimiento laboral moderno." : lang==="pl" ? "David Knipp jest dumnym czlonkiem Heat and Frost Insulators Local 1, ktorego zycie zmienilo sie, gdy w 2009 roku wkroczyl do zwiazowych zawodow budowlanych. Znany jako 'Proud Union Guy', zbudowal rosnaca ogolnokrajowa platforme, mowiac bezposrednio do pracownikow o mozliwosciach, sprawiedliwosci i sile zwiazkow zawodowych." : "David Knipp is a proud member of Heat and Frost Insulators Local 1 whose life changed when he entered the union trades in 2009. Known as \"Proud Union Guy,\" he's built a growing national platform by speaking directly to working people about opportunity, fairness, and the power of unions. Through his content and speaking, David is helping lead a new wave of working-class voices — pushing to spark a modern-day labor movement.",
                  },
                  {
                    id:"sean",
                    img:"/partner-sean.jpg",
                    name:"Sean Allen",
                    handle:"Proud Union Warrior",
                    union: lang==="es" ? "BAC Local 21 Chicago — Presidente" : lang==="pl" ? "BAC Local 21 Chicago — Prezydent" : "BAC Local 21 Chicago — President",
                    bio: lang==="es" ? "Sean Allen es el Presidente del Local 21 de Chicago de la union de albaniles BAC y creador de Proud Union Warrior. Como miembro de 4a generacion del BAC, conoce la importancia de organizar y hacer crecer el movimiento laboral. Union Pathways es la forma mas facil y amigable de encontrar un sindicato y aprender mas sobre ellos de las personas que lo viven todos los dias." : lang==="pl" ? "Sean Allen jest Prezydentem Local 21 w Chicago zwiazku murarzy BAC i tworca Proud Union Warrior. Jako czlonek BAC 4. pokolenia, zna znaczenie organizowania i rozwijania ruchu pracowniczego. Union Pathways to najlatwiejszy i najbardziej przyjazny dla uzytkownika sposob na znalezienie zwiazku zawodowego." : "Sean Allen is the President of BAC Local 21 Chicago and creator of Proud Union Warrior. As a 4th generation BAC member, he knows the importance of organizing and growing the labor movement. Union Pathways is the easiest, most user-friendly way to find a union and learn more about them from the people who live it every day.",
                  },
                ].map((partner) => (
                  <div key={partner.id} style={{border: partnerSection===partner.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                    <button
                      onClick={() => setPartnerSection(partnerSection===partner.id ? null : partner.id)}
                      style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left", gap:16}}
                    >
                      <div style={{display:"flex", alignItems:"center", gap:16}}>
                        <img src={partner.img} alt={partner.name} style={{width:52, height:52, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(250,128,89,0.4)", flexShrink:0}} />
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
                          <img src={partner.img} alt={partner.name} style={{width:120, height:120, borderRadius:16, objectFit:"cover", border:"1px solid rgba(250,128,89,0.3)", flexShrink:0}} />
                          <div style={{flex:1, minWidth:200}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", color:"#FA8059", textTransform:"uppercase", marginBottom:6}}>{partner.union}</div>
                            <p style={{fontSize:14, color:"var(--muted)", lineHeight:1.7, margin:0}}>{partner.bio}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}`;

if (!code.includes(insertAfter)) { console.error('ERROR: about page closing marker not found'); process.exit(1); }
code = code.replace(insertAfter, partnersSection);
console.log('✅ Added partners section to About page');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add -A && git commit -m "feat: add partners section to about page with photos and accordion" && git push\n');
