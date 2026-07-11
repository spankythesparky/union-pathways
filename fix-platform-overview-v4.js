// fix-platform-overview-v4.js
//
// Redesigns the Platform Overview block (industry stats, interactive map, tagline)
// on the home page to match v4 corporate light theme.
//
// NOTE: The map iframe itself loads /map.html which is a separate file.
// We'll address the iframe internals in a follow-up if needed — but the container
// and its section header will match the new light theme.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* PLATFORM OVERVIEW V4 */')) {
  console.error('ERROR: Platform Overview v4 already applied. Aborting.');
  process.exit(1);
}

// The complete old block — precise anchor
const platformOldStart = `        {page === "home" && !results && (
          <div style={{maxWidth:"1000px", margin:"0 auto", padding:"0 24px 80px"}}>

            {/* STATS ROW */}
            <div style={{display:"flex", justifyContent:"center", gap:"16px", flexWrap:"wrap", margin:"60px 0 64px"}}>`;

const platformOldEnd = `              <p style={{fontSize:"16px", color:"var(--muted)", maxWidth:"560px", margin:"16px auto 0", lineHeight:"1.6"}}>
                {lang===\"es\" ? \"Union Pathways es la plataforma completa para todo lo relacionado con los oficios sindicales.\" : lang===\"pl\" ? \"Union Pathways to kompletna platforma dla wszystkiego związanego ze związkowymi zawodami budowlanymi.\" : \"Union Pathways is the all-in-one platform for everything union construction trades.\"}
              </p>
            </div>

          </div>
        )}`;

const startIdx = src.indexOf(platformOldStart);
if (startIdx === -1) {
  console.error('ERROR: Could not find Platform Overview start anchor.');
  process.exit(1);
}

const endIdx = src.indexOf(platformOldEnd, startIdx);
if (endIdx === -1) {
  console.error('ERROR: Could not find Platform Overview end anchor.');
  process.exit(1);
}

const fullBlock = src.slice(startIdx, endIdx + platformOldEnd.length);
if (fullBlock.length < 3000 || fullBlock.length > 8000) {
  console.error('ERROR: Suspect block size: ' + fullBlock.length);
  process.exit(1);
}

// The new light-theme version
const newBlock = `        {/* PLATFORM OVERVIEW V4 */}
        {page === "home" && !results && (
          <div style={{background:'#FAFAF7', padding:'0 40px 80px'}}>
          <div style={{maxWidth:1280, margin:"0 auto"}}>

            {/* INDUSTRY STATS ROW */}
            <div style={{padding:'20px 0 80px', borderTop:'1px solid rgba(7,37,84,0.08)'}}>
              <div style={{fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, color:'#5A6478', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:32}}>
                {lang==="es" ? "La industria" : lang==="pl" ? "Branza" : "The industry"}
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24}} className="industry-stats-grid">
                {[
                  { num: "6M", accent: "+", label: lang==="es" ? "Miembros sindicales en EE.UU." : lang==="pl" ? "Czlonkow zwiazkow w USA" : "Union members in the U.S." },
                  { num: "18", accent: "%", label: lang==="es" ? "Salarios mas altos que no sindicales" : lang==="pl" ? "Wyzsze place niz niezwiazkowcy" : "Higher wages than non-union" },
                  { num: "500K", accent: "+", label: lang==="es" ? "Trabajadores de construccion necesarios" : lang==="pl" ? "Potrzebnych pracownikow budowlanych" : "Construction workers needed now" },
                  { num: "", accent: "$0", label: lang==="es" ? "Costo del aprendizaje sindical" : lang==="pl" ? "Koszt praktyki zwiazkowej" : "Cost to join an apprenticeship" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{
                      fontFamily:"'Inter',sans-serif",
                      fontSize:'clamp(36px, 4vw, 52px)',
                      fontWeight:800, lineHeight:1, letterSpacing:'-0.03em',
                      marginBottom:8, color:'#072554'
                    }}>{s.num}<span style={{color:'#FF6B00'}}>{s.accent}</span></div>
                    <div style={{fontFamily:"'Inter',sans-serif", fontSize:13, color:'#5A6478', lineHeight:1.5, fontWeight:500}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACTIVE MAP */}
            <div style={{padding:'80px 0', borderTop:'1px solid rgba(7,37,84,0.08)'}}>
              <div style={{marginBottom:36, maxWidth:900}}>
                <div style={{fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, color:'#FF6B00', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20}}>
                  {lang==="es" ? "1,720 Locales en EE.UU. y Canada" : lang==="pl" ? "1,720 Lokali w USA i Kanadzie" : "1,720 locals across the U.S. and Canada"}
                </div>
                <h2 style={{
                  fontFamily:"'Inter',sans-serif",
                  fontSize:'clamp(28px, 3.5vw, 42px)',
                  fontWeight:700, lineHeight:1.15,
                  letterSpacing:'-0.02em',
                  margin:'0 0 12px 0',
                  color:'#072554'
                }}>
                  {"Every union local. "}<span style={{color:'#FF6B00'}}>{"One map."}</span>
                </h2>
                <p style={{fontFamily:"'Inter',sans-serif", fontSize:16, color:'#5A6478', lineHeight:1.65, margin:0, maxWidth:600}}>
                  {lang==="es" ? "Explora los locales sindicales de construccion en tu area. Haz clic en cualquier cluster para expandirlo." : lang==="pl" ? "Odkryj lokale zwiazkowe w swojej okolicy. Kliknij klaster, aby go rozwinac." : "Explore union locals in your area. Click any cluster to expand — zoom in to see individual halls."}
                </p>
              </div>
              <div style={{width:"100%", height:"560px", borderRadius:16, overflow:"hidden", border:'1px solid rgba(7,37,84,0.08)', boxShadow:'0 2px 6px rgba(7,37,84,0.04), 0 12px 32px rgba(7,37,84,0.06)', background:'#ffffff'}}>
                <iframe src="/map.html" style={{width:"100%", height:"100%", border:"none", display:"block"}} title="Union Locals Map" loading="lazy" />
              </div>
            </div>

            {/* SECTION TITLE */}
            <div style={{padding:'80px 0 0', borderTop:'1px solid rgba(7,37,84,0.08)'}}>
              <div style={{fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, color:'#FF6B00', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20}}>
                {lang==="es" ? "Todo en un solo lugar" : lang==="pl" ? "Wszystko w jednym miejscu" : "Everything you need. One platform."}
              </div>
              <h2 style={{
                fontFamily:"'Inter',sans-serif",
                fontSize:'clamp(28px, 3.5vw, 42px)',
                fontWeight:700, lineHeight:1.15,
                letterSpacing:'-0.02em',
                margin:'0 0 20px 0',
                color:'#072554',
                maxWidth:780
              }}>
                {lang==="es" ? <>{"Mas que un "}<span style={{color:'#FF6B00'}}>{"buscador."}</span></> : lang==="pl" ? <>{"Wiecej niz "}<span style={{color:'#FF6B00'}}>{"wyszukiwarka."}</span></> : <>{"More than a "}<span style={{color:'#FF6B00'}}>{"local finder."}</span></>}
              </h2>
              <p style={{fontFamily:"'Inter',sans-serif", fontSize:17, color:'#5A6478', maxWidth:660, margin:0, lineHeight:1.65}}>
                {lang==="es" ? "Union Pathways es la plataforma completa para todo lo relacionado con los oficios sindicales de construccion." : lang==="pl" ? "Union Pathways to kompletna platforma dla wszystkiego zwiazanego ze zwiazkowymi zawodami budowlanymi." : "Union Pathways is the all-in-one platform for everything union construction trades."}
              </p>
            </div>

          </div>
          </div>
        )}`;

src = src.slice(0, startIdx) + newBlock + src.slice(endIdx + platformOldEnd.length);

// Add responsive CSS for industry-stats-grid to stack on mobile
const cssAnchor = `.appr-advice-row { grid-template-columns: 1fr !important; gap: 4px !important; }`;
const cssAdd = `.appr-advice-row { grid-template-columns: 1fr !important; gap: 4px !important; }
          .industry-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }`;

if (src.includes(cssAnchor)) {
  src = src.replace(cssAnchor, () => cssAdd);
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Platform Overview redesigned:');
console.log('  - Industry stats (6M+/18%/500K+/$0) → big navy Inter with orange accents');
console.log('  - No more coral pill cards — clean typography-only');
console.log('  - Map section header: navy Inter with orange accent');
console.log('  - Map container: white bg, subtle shadow, matches home cards');
console.log('  - Tagline section: navy Inter, orange accent, aligned left');
console.log('  - Wrapped in warm paper background');
console.log('  - Responsive: 2x2 grid on tablet, single column on phone');
console.log('');
console.log('NOTE: The map iframe /map.html is a separate file — its internal styling');
console.log('is unchanged. If the map tiles/markers look dark inside, we will address');
console.log('that as a follow-up (map.html is separate infrastructure).');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: platform overview corporate v4" && git push');
console.log('');
