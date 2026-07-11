// fix180.js — Add the Union Pathways Brief newsletter signup
//
// What this builds:
//   A branded newsletter section inserted on the home page, right after the
//   "Every Union Local. One Map." iframe. The section has:
//     - Eyebrow: "THE UNION PATHWAYS BRIEF"
//     - Headline: "Stay on top of wages, job calls, and labor news"
//     - 3 "what you get" rows
//     - Email input + Subscribe button
//     - Trust line: "Built for tradespeople. By a tradesperson."
//
// How the form works:
//   The form action is your Beehiiv publication's public subscribe URL. On
//   submit, the browser POSTs the email to Beehiiv (target=_blank opens
//   their confirmation page in a new tab) and your visitor stays on the
//   homepage. Beehiiv handles double opt-in, deliverability, and storage.
//
// Customization required:
//   Edit ONE constant at the top of this file before running:
//     BEEHIIV_SLUG = "your-publication-slug"
//   This is whatever Beehiiv assigned you — the part before ".beehiiv.com"
//   in your subscribe URL.
//
// Idempotency: detects "THE UNION PATHWAYS BRIEF" in src/App.jsx and exits.
//
// Reads:  src/App.jsx
// Writes: src/App.jsx (in place)

const fs = require('fs');
const FILE = 'src/App.jsx';

// ============================================================================
// CUSTOMIZE: replace this with your Beehiiv publication slug
// ============================================================================
// Example: if your subscribe URL is https://unionpathways.beehiiv.com/subscribe
//          then BEEHIIV_SLUG = "unionpathways"
const BEEHIIV_SLUG = "unionpathways";
// ============================================================================

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('THE UNION PATHWAYS BRIEF')) {
  console.log('Already applied — newsletter section is already in place.');
  console.log('To change the Beehiiv slug, edit src/App.jsx directly and search');
  console.log('for "beehiiv.com/subscribe".');
  process.exit(0);
}

const SUBSCRIBE_URL = `https://${BEEHIIV_SLUG}.beehiiv.com/subscribe`;

// ============================================================================
// THE NEWSLETTER SECTION
// ============================================================================
const NEWSLETTER_SECTION = `
            {/* NEWSLETTER — THE UNION PATHWAYS BRIEF */}
            <div style={{margin:"60px auto 70px", maxWidth:920, padding:"0 16px"}}>
              <div style={{position:"relative", padding:"40px 32px", background:"linear-gradient(135deg, rgba(250,128,89,0.08) 0%, rgba(245,197,24,0.04) 100%)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:20, overflow:"hidden"}}>
                <div style={{position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(250,128,89,0.15), transparent 70%)", pointerEvents:"none"}} />

                <div style={{display:"grid", gridTemplateColumns:"1fr", gap:36, position:"relative"}}>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14}}>
                      {lang==="es" ? "El Boletín de Union Pathways" : lang==="pl" ? "Biuletyn Union Pathways" : "The Union Pathways Brief"}
                    </div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(28px, 4.5vw, 44px)", fontWeight:900, color:"#fff", margin:"0 0 18px", lineHeight:1.05, letterSpacing:"-0.01em"}}>
                      {lang==="es" ? <>{"Mantente al día con salarios, llamadas de trabajo y "}<span style={{color:"#F5C518"}}>noticias laborales.</span></>
                      : lang==="pl" ? <>{"Bądź na bieżąco z płacami, ofertami pracy i "}<span style={{color:"#F5C518"}}>wiadomościami związkowymi.</span></>
                      : <>{"Stay on top of wages, job calls, and "}<span style={{color:"#F5C518"}}>labor news.</span></>}
                    </h2>
                    <p style={{fontSize:15, color:"rgba(255,255,255,0.78)", lineHeight:1.65, margin:"0 0 24px", maxWidth:600}}>
                      {lang==="es" ? "Lo que está ocupado y lento en todo el país, las 5 actualizaciones salariales más grandes del mes, y las historias laborales que no verás en ningún otro lugar. Dos veces al mes. Gratis. Sin spam."
                      : lang==="pl" ? "Co jest zajęte i wolne w całym kraju, 5 największych aktualizacji płac w miesiącu i historie związkowe, których nie zobaczysz nigdzie indziej. Dwa razy w miesiącu. Bezpłatnie. Bez spamu."
                      : "What's busy and slow across the country, the 5 biggest wage updates of the month, and the labor stories you won't see anywhere else. Twice a month. Free. No spam."}
                    </p>

                    <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14, marginBottom:28}}>
                      {[
                        {h: lang==="es"?"Datos Salariales":lang==="pl"?"Dane Płac":"Wage Data", d: lang==="es"?"Tarifas verificadas por miembros, por oficio y región":lang==="pl"?"Stawki weryfikowane przez członków, według zawodu i regionu":"Member-verified rates, by trade and region"},
                        {h: lang==="es"?"Estado del Trabajo":lang==="pl"?"Status Pracy":"Job Status", d: lang==="es"?"Cuáles locales están ocupados, estables o lentos":lang==="pl"?"Które oddziały są zajęte, stabilne lub wolne":"Which halls are busy, steady, or slow"},
                        {h: lang==="es"?"Noticias Sindicales":lang==="pl"?"Wiadomości Związkowe":"Labor News", d: lang==="es"?"Lo que importa para los oficios sindicales":lang==="pl"?"To co ważne dla zawodów związkowych":"What matters for the union trades"},
                      ].map((item, i) => (
                        <div key={i} style={{padding:"14px 16px", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:800, color:"#FA8059", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5}}>{item.h}</div>
                          <div style={{fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.5}}>{item.d}</div>
                        </div>
                      ))}
                    </div>

                    <form action="${SUBSCRIBE_URL}" method="POST" target="_blank" style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap:10, alignItems:"stretch"}}>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={lang==="es" ? "tu@correo.com" : lang==="pl" ? "twoj@email.com" : "you@email.com"}
                        style={{flex:"1 1 240px", minWidth:0, padding:"14px 18px", fontSize:15, fontFamily:"'Inter','Barlow Condensed',sans-serif", color:"#fff", background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, outline:"none"}}
                      />
                      <button
                        type="submit"
                        style={{padding:"14px 28px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", color:"#0a1628", background:"#FA8059", border:"none", borderRadius:10, cursor:"pointer", whiteSpace:"nowrap", transition:"transform 0.15s, box-shadow 0.15s"}}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(250,128,89,0.35)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        {lang==="es" ? "Suscríbete →" : lang==="pl" ? "Zapisz się →" : "Subscribe →"}
                      </button>
                    </form>

                    <div style={{marginTop:16, fontSize:12, color:"rgba(255,255,255,0.5)", fontStyle:"italic"}}>
                      {lang==="es" ? "Hecho para trabajadores. Por un trabajador." : lang==="pl" ? "Stworzone dla pracowników. Przez pracownika." : "Built for tradespeople. By a tradesperson."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

`;

// ============================================================================
// INSERT
// ============================================================================
// Anchor: insert immediately before the "{/* SECTION TITLE */}" comment that
// opens the "Everything You Need / More Than a Local Finder" section.
const insertAnchor = `              </div>
            </div>

            {/* SECTION TITLE */}`;
if (!src.includes(insertAnchor)) {
  console.error('ERROR: could not find SECTION TITLE anchor for newsletter insertion');
  process.exit(1);
}
src = src.replace(insertAnchor, `              </div>
            </div>
${NEWSLETTER_SECTION}
            {/* SECTION TITLE */}`);

fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log(`  Newsletter section inserted on home page`);
console.log(`  Beehiiv subscribe URL: ${SUBSCRIBE_URL}`);
console.log('');
console.log('IMPORTANT — Before this works in production:');
console.log('  1. Sign up at beehiiv.com (free tier)');
console.log('  2. Verify your subscribe URL matches the one above');
console.log(`  3. If your slug is different from "${BEEHIIV_SLUG}", edit fix180.js`);
console.log('     and re-run, OR edit src/App.jsx directly (search beehiiv.com)');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add newsletter signup — Union Pathways Brief" && git push');
console.log('');
