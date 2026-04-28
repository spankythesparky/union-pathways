const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

if (code.includes('page === "resume"')) {
  console.log('Resume page already added');
  process.exit(0);
}

const pageMarker = '        {page === "veterans" && (';
if (!code.includes(pageMarker)) { console.error('ERROR: veterans marker not found'); process.exit(1); }

const resumePage = `        {page === "resume" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "100% Gratis Sin Registro" : lang==="pl" ? "100% Darmowe Bez Rejestracji" : "100% Free. No Signup Required."}</div>
              <h1 className="history-title">
                {lang==="es" ? <><span className="accent">{"Curriculum Sindical"}</span>{" Gratis"}</> : lang==="pl" ? <><span className="accent">{"Darmowy Szablon CV"}</span></> : <>{"Union Trades "}<span className="accent">{"Resume Template"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Disenado para solicitudes de aprendizaje sindical. Listo para usar." : lang==="pl" ? "Zaprojektowany do podania o praktyki zwiazkowe. Gotowy do uzycia." : "Designed for union trades apprenticeship applications. Built by IBEW members for tradespeople."}
              </p>
            </div>
            <div style={{maxWidth:900, margin:"0 auto", padding:"0 24px 80px"}}>
              <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"48px", textAlign:"center", marginBottom:48}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:30, fontWeight:900, color:"#fff", marginBottom:12}}>
                  {lang==="es" ? "Plantilla de Curriculum para Oficios Sindicales" : lang==="pl" ? "Szablon CV dla Zawodow Zwiazkowych" : "Union Trades Resume Template"}
                </div>
                <div style={{fontSize:15, color:"var(--muted)", marginBottom:36, lineHeight:1.7, maxWidth:560, margin:"0 auto 36px"}}>
                  {lang==="es" ? "Formato profesional de una pagina con seccion de experiencia sindical, certificaciones OSHA y habilidades del oficio. Disenado por electricistas IBEW." : lang==="pl" ? "Profesjonalny format jednej strony z sekcja doswiadczenia zwiazkowego, certyfikatow OSHA i umiejetnosci zawodowych." : "Professional one-page format with union experience section, OSHA certifications, and trade skills. Designed by IBEW members."}
                </div>
                <a href="/union-trades-resume.pdf" download="UnionPathways-Resume-Template.pdf" style={{display:"inline-flex", alignItems:"center", gap:10, background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 36px", borderRadius:50, textDecoration:"none"}}>
                  {lang==="es" ? "Descargar PDF Gratis" : lang==="pl" ? "Pobierz PDF Za Darmo" : "Download Free PDF"}
                </a>
                <div style={{fontSize:12, color:"rgba(160,180,196,0.35)", marginTop:20}}>
                  {lang==="es" ? "Sin registro. Sin correo. Sin trampa." : lang==="pl" ? "Bez rejestracji. Bez emaila." : "No signup. No email. No catch."}
                </div>
              </div>
              <div className="impact-grid">
                {[
                  { num:"01", title: lang==="es" ? "Seccion de Experiencia Sindical" : lang==="pl" ? "Sekcja Doswiadczenia Zwiazkowego" : "Union Experience Section", desc: lang==="es" ? "Espacio para tu local sindical, numero de aprendiz y contratista." : lang==="pl" ? "Miejsce na Twoj lokal zwiazkowy i numer praktykanta." : "Dedicated space for your union local, apprentice number, and contractor." },
                  { num:"02", title: lang==="es" ? "Habilidades del Oficio" : lang==="pl" ? "Umiejetnosci Zawodowe" : "Trade Skills Section", desc: lang==="es" ? "Lista de habilidades comunes del oficio que puedes personalizar." : lang==="pl" ? "Lista typowych umiejetnosci zawodowych do dostosowania." : "Pre-filled list of common trade skills you can customize to match your experience." },
                  { num:"03", title: lang==="es" ? "Certificaciones de Seguridad" : lang==="pl" ? "Certyfikaty Bezpieczenstwa" : "Safety Certifications", desc: lang==="es" ? "Seccion para OSHA 10/30, primeros auxilios y mas." : lang==="pl" ? "Sekcja na OSHA 10/30 i inne certyfikaty." : "Section for OSHA 10/30, first aid, aerial lift operator, and other safety certs." },
                  { num:"04", title: lang==="es" ? "Formato Profesional" : lang==="pl" ? "Profesjonalny Format" : "Professional Format", desc: lang==="es" ? "Diseno limpio de una pagina. Impresiona a los coordinadores." : lang==="pl" ? "Czysty jednostronicowy projekt." : "Clean one-page design with dark sidebar. Makes an impression on JATC coordinators." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

`;

code = code.replace(pageMarker, resumePage + pageMarker);
fs.writeFileSync('src/App.jsx', code);
console.log('done');
