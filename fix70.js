const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add to valid pages
code = code.replace(
  "const validPages = ['home','quiz','careers','checklist','locals','calculator','veterans','history','retirement','health','benefits','about','contact'];",
  "const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','retirement','health','benefits','about','contact'];"
);
console.log('Added resume to valid pages');

// 2. Add page meta
code = code.replace(
  '      calculator: { title: "Union Pathways \u2014 Wage Calculator"',
  '      resume:     { title: "Union Pathways \u2014 Free Union Trades Resume Template", desc: "Download a free resume template designed for union trades apprenticeship applications. Built by tradespeople." },\n      calculator: { title: "Union Pathways \u2014 Wage Calculator"'
);
console.log('Added page meta');

// 3. Add nav item
const oldCalcNav = `                  <div className={\`nav-dropdown-item\${page==="calculator"?" active":""}\`} onMouseDown={() => { setPage("calculator"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Calculadora de Salario" : lang==="pl" ? "Kalkulator Wynagrodzeń" : "Wage Calculator"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Tu paquete completo estimado" : lang==="pl" ? "Twój szacowany pełny pakiet" : "Estimate your full package value"}</span>
                  </div>`;

const newCalcNav = oldCalcNav + `
                  <div className={\`nav-dropdown-item\${page==="resume"?" active":""}\`} onMouseDown={() => { setPage("resume"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Plantilla de Curriculum" : lang==="pl" ? "Szablon CV" : "Resume Template"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Descarga gratis" : lang==="pl" ? "Pobierz za darmo" : "Free download — ready to use"}</span>
                  </div>`;

if (!code.includes(oldCalcNav)) { console.error('ERROR: calc nav not found'); process.exit(1); }
code = code.replace(oldCalcNav, newCalcNav);
console.log('Added Resume to nav');

// 4. Add page JSX
const pageMarker = '        {page === "veterans" && (';

const resumePage = `        {page === "resume" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "100% Gratis Sin Registro" : lang==="pl" ? "100% Darmowe Bez Rejestracji" : "100% Free. No Signup Required."}</div>
              <h1 className="history-title">
                {lang==="es" ? <><span className="accent">{"Curriculum Sindical"}</span>{" Gratis"}</> : lang==="pl" ? <><span className="accent">{"Darmowy Szablon CV"}</span>{" dla Zwiazkowcow"}</> : <>{"Union Trades "}<span className="accent">{"Resume Template"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Disenado para solicitudes de aprendizaje sindical. Listo para usar — solo rellena tus datos." : lang==="pl" ? "Zaprojektowany do podania o praktyki zwiazkowe. Gotowy do uzycia." : "Designed specifically for union trades apprenticeship applications. Built by IBEW members for tradespeople."}
              </p>
            </div>

            <div style={{maxWidth:900, margin:"0 auto", padding:"0 24px 80px"}}>

              <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"48px", textAlign:"center", marginBottom:48}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:72, lineHeight:1, marginBottom:20}}>
                  <span style={{color:"#FA8059"}}>&#9654;</span>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:30, fontWeight:900, color:"#fff", marginBottom:12}}>
                  {lang==="es" ? "Plantilla de Curriculum para Oficios Sindicales" : lang==="pl" ? "Szablon CV dla Zawodow Zwiazkowych" : "Union Trades Resume Template"}
                </div>
                <div style={{fontSize:15, color:"var(--muted)", marginBottom:36, lineHeight:1.7, maxWidth:560, margin:"0 auto 36px"}}>
                  {lang==="es" ? "Formato profesional de una pagina con seccion de experiencia sindical, certificaciones OSHA, habilidades del oficio y referencias. Disenado por electricistas IBEW para trabajadores sindicales." : lang==="pl" ? "Profesjonalny format jednej strony z sekcja doswiadczenia zwiazkowego, certyfikatow OSHA, umiejetnosci zawodowych i referencji." : "Professional one-page format with union experience section, OSHA certifications, trade skills, and references. Designed by IBEW members for tradespeople."}
                </div>
                <a href="/union-trades-resume.pdf" download="UnionPathways-Resume-Template.pdf" style={{display:"inline-flex", alignItems:"center", gap:10, background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 36px", borderRadius:50, textDecoration:"none"}}>
                  {lang==="es" ? "Descargar PDF Gratis" : lang==="pl" ? "Pobierz PDF Za Darmo" : "Download Free PDF"}
                </a>
                <div style={{fontSize:12, color:"rgba(160,180,196,0.35)", marginTop:20, letterSpacing:"0.06em"}}>
                  {lang==="es" ? "Sin registro. Sin correo. Sin trampa." : lang==="pl" ? "Bez rejestracji. Bez emaila. Bez haczyka." : "No signup. No email. No catch."}
                </div>
              </div>

              <div className="impact-grid" style={{marginBottom:48}}>
                {[
                  { num:"01", title: lang==="es" ? "Seccion de Experiencia Sindical" : lang==="pl" ? "Sekcja Doswiadczenia Zwiazkowego" : "Union Experience Section", desc: lang==="es" ? "Espacio dedicado para tu local sindical, numero de aprendiz y contratista." : lang==="pl" ? "Dedykowane miejsce na Twoj lokal zwiazkowy i numer praktykanta." : "Dedicated space for your union local, apprentice number, and contractor." },
                  { num:"02", title: lang==="es" ? "Habilidades del Oficio" : lang==="pl" ? "Umiejetnosci Zawodowe" : "Trade Skills Section", desc: lang==="es" ? "Lista de habilidades comunes del oficio que puedes personalizar." : lang==="pl" ? "Lista typowych umiejetnosci zawodowych do dostosowania." : "Pre-filled list of common trade skills you can customize to match your experience." },
                  { num:"03", title: lang==="es" ? "Certificaciones de Seguridad" : lang==="pl" ? "Certyfikaty Bezpieczenstwa" : "Safety Certifications", desc: lang==="es" ? "Seccion para OSHA 10/30, primeros auxilios, operador de plataformas y mas." : lang==="pl" ? "Sekcja na OSHA 10/30, pierwsza pomoc i inne certyfikaty." : "Section for OSHA 10/30, first aid, aerial lift operator, and other safety certs." },
                  { num:"04", title: lang==="es" ? "Formato Profesional" : lang==="pl" ? "Profesjonalny Format" : "Professional Format", desc: lang==="es" ? "Diseno limpio de una pagina. Impresiona a los coordinadores de aprendizaje." : lang==="pl" ? "Czysty jednostronicowy projekt. Robi wrazenie na koordynatorach praktyk." : "Clean one-page design with dark sidebar. Makes an impression on JATC coordinators." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"32px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:24}}>
                  {lang==="es" ? "Consejos para tu Solicitud de Aprendizaje" : lang==="pl" ? "Wskazowki do Podania o Praktyki" : "Tips for Your Apprenticeship Application"}
                </div>
                {[
                  { tip: lang==="es" ? "Llama primero al local" : lang==="pl" ? "Najpierw zadzwon do lokalu" : "Call the local first", desc: lang==="es" ? "Pregunta sobre fechas de solicitud abiertas y requisitos especificos antes de enviar tu curriculum." : lang==="pl" ? "Zapytaj o terminy skladania podania i wymagania przed wyslaniem CV." : "Ask about open application dates and specific requirements before sending your resume." },
                  { tip: lang==="es" ? "Destaca experiencia practica" : lang==="pl" ? "Podkres doswiadczenie praktyczne" : "Highlight hands-on experience", desc: lang==="es" ? "Cualquier trabajo de construccion, fontaneria o mantenimiento cuenta. No subestimes tu experiencia." : lang==="pl" ? "Kazda praca budowlana lub konserwacyjna sie liczy. Nie lekcewazyc doswiadczenia." : "Any construction, plumbing, electrical, or maintenance work counts. Do not undersell yourself." },
                  { tip: lang==="es" ? "Obtén el OSHA 10 antes de solicitar" : lang==="pl" ? "Uzyskaj OSHA 10 przed zlozeniem podania" : "Get your OSHA 10 before applying", desc: lang==="es" ? "Muchos JATCs ven favorablemente el OSHA 10. Es barato y rapido." : lang==="pl" ? "Wiele JATC pozytywnie patrzy na OSHA 10. Jest tanie i szybkie." : "Many JATCs look favorably on OSHA 10. It is cheap, quick, and shows you take safety seriously." },
                  { tip: lang==="es" ? "Referencias sindicales valen oro" : lang==="pl" ? "Referencje zwiazkowe sa na wage zlota" : "Union references are gold", desc: lang==="es" ? "Si conoces a un miembro sindical que pueda vouchar por ti, incluye su contacto. Vale mas que cualquier curriculum." : lang==="pl" ? "Jesli znasz czlonka zwiazku, ktory moze za Ciebie poreczczyc, podaj jego dane. Warte wiecej niz jakiekolwiek CV." : "If you know any union members who can vouch for you, include their contact. An inside reference is worth more than any resume." },
                ].map((item, i) => (
                  <div key={i} style={{display:"flex", gap:16, marginBottom: i < 3 ? 20 : 0, paddingBottom: i < 3 ? 20 : 0, borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:800, color:"#FA8059", minWidth:28}}>0{i+1}</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:800, color:"#fff", marginBottom:4}}>{item.tip}</div>
                      <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

`;

if (!code.includes(pageMarker)) { console.error('ERROR: veterans marker not found'); process.exit(1); }
code = code.replace(pageMarker, resumePage + pageMarker);
console.log('Added Resume page');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx public/union-trades-resume.pdf && git commit -m "feat: add free resume template page" && git push\n');
