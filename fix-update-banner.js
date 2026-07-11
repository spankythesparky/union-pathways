// fix-update-banner.js
//
// Adds a subtle "site being updated" announcement banner at the top of the home page.
// Clean, on-brand, not intrusive. Positioned above the hero section.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* UPDATE BANNER */')) {
  console.error('ERROR: Banner already added. Aborting.');
  process.exit(1);
}

// Anchor: place banner immediately after the paper wrapper div opens, before the hero
const anchor = `        <div style={{background:'#FFFFFF', color:'#072554', margin:'0', padding:'0'}}>

        {/* ─── HERO ─── */}`;

const bannerHtml = `        <div style={{background:'#FFFFFF', color:'#072554', margin:'0', padding:'0'}}>

        {/* UPDATE BANNER */}
        <div style={{
          background:'#FFF7ED',
          borderBottom:'1px solid rgba(255,107,0,0.20)',
          padding:'14px 40px'
        }}>
          <div style={{
            maxWidth:1280, margin:'0 auto',
            display:'flex', alignItems:'center', gap:16, flexWrap:'wrap'
          }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'#FF6B00', color:'#ffffff',
              padding:'4px 10px', borderRadius:4,
              fontFamily:"'Inter',sans-serif",
              fontSize:11, fontWeight:700,
              letterSpacing:'0.10em', textTransform:'uppercase',
              flexShrink:0
            }}>
              <span style={{width:6, height:6, borderRadius:'50%', background:'#ffffff', display:'inline-block'}}/>
              Site Update
            </div>
            <div style={{
              fontFamily:"'Inter',sans-serif",
              fontSize:14, fontWeight:500,
              color:'#072554', lineHeight:1.5, flex:1, minWidth:200
            }}>
              {lang==="es" ? "Estamos renovando el diseno completo del sitio. Algunas paginas pueden verse inconsistentes mientras trabajamos. Gracias por su paciencia y apoyo." :
               lang==="pl" ? "Wprowadzamy zupelnie nowy design w calej witrynie. Niektore strony moga wygladac niespojnie w trakcie prac. Dziekujemy za cierpliwosc." :
               "We're rolling out a fresh design across every page. Some pages may look inconsistent while we work. Thanks for your patience and support."}
            </div>
          </div>
        </div>

        {/* ─── HERO ─── */}`;

if (!src.includes(anchor)) {
  console.error('ERROR: Could not find hero anchor.');
  process.exit(1);
}

src = src.replace(anchor, () => bannerHtml);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Update banner added to top of home page.');
console.log('');
console.log('Design:');
console.log('  - Very light peach background (#FFF7ED) — subtle, on-brand');
console.log('  - Bottom border in soft orange');
console.log('  - Orange pill badge with white pulse dot: "SITE UPDATE"');
console.log('  - Navy Inter body text at 14px');
console.log('  - Full multilingual (EN/ES/PL)');
console.log('  - Non-dismissible for now (can add close button later)');
console.log('  - Positioned between nav and hero');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add site update banner to home page" && git push');
console.log('');
console.log('To remove later, just delete the block or filter later — easy to');
console.log('take down when the pivot is complete.');
console.log('');
