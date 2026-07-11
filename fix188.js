// fix188.js
// Insert the Instagram founder-story video (college → trades) into the
// "Meet the Founder" section of the About page, centered below the founder card.
// SPA-safe: uses the /embed iframe endpoint, no external script needed.
// Idempotent: re-running is safe.

const fs = require('fs');
const PATH = 'src/App.jsx';

if (!fs.existsSync(PATH)) {
  console.error(`✗ ${PATH} not found. Run this from ~/Desktop/union-pathway.`);
  process.exit(1);
}

let code = fs.readFileSync(PATH, 'utf8');

// ---------- idempotency guard ----------
const EMBED = 'instagram.com/p/DYqaEdOtTyy/embed';
if (code.includes(EMBED)) {
  console.log('✓ fix188 already applied — IG founder video is present.');
  process.exit(0);
}

// ---------- locate injection point ----------
// Anchor on the unique responsive media query inside the founder section's
// <style> block, then find that block's closing tag. We insert right after it,
// which lands the video inside the founder section, below the card.
const MARKER = '.about-feature-grid { grid-template-columns: 1fr !important; }';
const mIdx = code.indexOf(MARKER);
if (mIdx === -1) {
  console.error('✗ Could not find the founder-section marker (.about-feature-grid).');
  console.error('  The About page may have drifted — share the current block and I will re-anchor.');
  process.exit(1);
}

const STYLE_CLOSE = '`}</style>';
const sIdx = code.indexOf(STYLE_CLOSE, mIdx);
if (sIdx === -1) {
  console.error('✗ Found the marker but not the closing `}</style>. Aborting to avoid a bad edit.');
  process.exit(1);
}
const insertAt = sIdx + STYLE_CLOSE.length;

// ---------- the video block ----------
const VIDEO = `

              {/* Founder story video — IG embed (college -> trades) */}
              <div style={{marginTop:32, display:'flex', flexDirection:'column', alignItems:'center', gap:16}}>
                <div style={{
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:13,
                  fontWeight:800,
                  letterSpacing:'0.18em',
                  color:'#FA8059',
                  textTransform:'uppercase',
                }}>
                  {lang==="es" ? "Mira la Historia" : lang==="pl" ? "Zobacz Historię" : "Watch the Story"}
                </div>
                <div style={{
                  width:'100%',
                  maxWidth:340,
                  borderRadius:20,
                  overflow:'hidden',
                  border:'1px solid rgba(250,128,89,0.25)',
                  background:'#000',
                  boxShadow:'0 18px 50px rgba(0,0,0,0.30)',
                }}>
                  <iframe
                    src="https://www.instagram.com/p/DYqaEdOtTyy/embed"
                    title="From college to the trades"
                    style={{width:'100%', height:720, border:'none', display:'block'}}
                    loading="lazy"
                    scrolling="no"
                    allow="encrypted-media; clipboard-write; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>`;

code = code.slice(0, insertAt) + VIDEO + code.slice(insertAt);
fs.writeFileSync(PATH, code);

console.log('✓ Inserted IG founder-story video into the "Meet the Founder" section.');
console.log('  • Centered below the founder card, phone-width (max 340px)');
console.log('  • "Watch the Story" label in orange (en/es/pl)');
console.log('  • iframe /embed endpoint — SPA-safe, no external script');
console.log('  • Height set to 720px (easy to nudge if there is empty space or a cutoff)');
console.log('');
console.log('Next: git add src/App.jsx && git commit -m "feat(about): add founder story video" && git push');
