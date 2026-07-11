// fix-feature-rows-mobile.js
//
// Mobile improvements for the 01/02/03 feature rows on the home page:
//   1. Add className to visual block so we can target it with responsive CSS
//   2. On <=800px: stack single column, tighter padding, smaller gap
//   3. On <=800px: force text-first reading order (kills the reverse-order weirdness)
//   4. On <=800px: shorter aspect ratio for visual block (16:9 instead of 4:3)
//   5. On <=480px: even smaller — capped height, smaller big number, less padding

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* FEATURE ROWS MOBILE */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

let edits = 0;

// ═══════════════════════════════════════════════════════════════
// 1. Add className to visual block so we can target it responsively
// ═══════════════════════════════════════════════════════════════
const visualBlockOld = `                <div style={{
                  aspectRatio:'4/3',
                  background:'linear-gradient(135deg, #072554 0%, #1a3568 100%)',
                  borderRadius:16,
                  position:'relative',
                  overflow:'hidden',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#ffffff'
                }}>`;

const visualBlockNew = `                <div className="feature-visual" style={{
                  aspectRatio:'4/3',
                  background:'linear-gradient(135deg, #072554 0%, #1a3568 100%)',
                  borderRadius:16,
                  position:'relative',
                  overflow:'hidden',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#ffffff'
                }}>`;

if (src.includes(visualBlockOld)) {
  src = src.replace(visualBlockOld, () => visualBlockNew);
  edits++;
}

// Add className to the big number too (for targeting)
const bigNumOld = `                  <div style={{
                    fontFamily:"'Inter',sans-serif",
                    fontSize:'clamp(64px, 10vw, 128px)',
                    fontWeight:900, lineHeight:1, letterSpacing:'-0.04em',
                    color:'#ffffff', position:'relative', zIndex:1
                  }}>`;

const bigNumNew = `                  <div className="feature-big-num" style={{
                    fontFamily:"'Inter',sans-serif",
                    fontSize:'clamp(64px, 10vw, 128px)',
                    fontWeight:900, lineHeight:1, letterSpacing:'-0.04em',
                    color:'#ffffff', position:'relative', zIndex:1
                  }}>`;

if (src.includes(bigNumOld)) {
  src = src.replace(bigNumOld, () => bigNumNew);
  edits++;
}

// Add className to label too
const labelOld = `                  <div style={{
                    position:'absolute', bottom:24, left:28,
                    fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:700,
                    letterSpacing:'0.18em', textTransform:'uppercase',
                    color:'rgba(255,255,255,0.75)'
                  }}>{f.visualLabel}</div>`;

const labelNew = `                  <div className="feature-visual-label" style={{
                    position:'absolute', bottom:24, left:28,
                    fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:700,
                    letterSpacing:'0.18em', textTransform:'uppercase',
                    color:'rgba(255,255,255,0.75)'
                  }}>{f.visualLabel}</div>`;

if (src.includes(labelOld)) {
  src = src.replace(labelOld, () => labelNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 2. Add responsive CSS rules
// Inject after the existing responsive block
// ═══════════════════════════════════════════════════════════════
const cssAnchor = `        @media (max-width: 400px) {
          .home-stats-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }`;

const cssNew = `        @media (max-width: 400px) {
          .home-stats-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }

        /* FEATURE ROWS MOBILE */
        @media (max-width: 800px) {
          .feature-row {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 48px 0 !important;
          }
          .feature-text.reverse-order {
            order: 0 !important;
          }
          .feature-visual {
            aspect-ratio: 16 / 9 !important;
            max-height: 240px;
            border-radius: 12px !important;
          }
          .feature-big-num {
            font-size: clamp(56px, 14vw, 96px) !important;
          }
          .feature-visual-label {
            bottom: 16px !important;
            left: 18px !important;
            font-size: 10px !important;
          }
        }
        @media (max-width: 480px) {
          .feature-row {
            padding: 40px 0 !important;
            gap: 20px !important;
          }
          .feature-visual {
            aspect-ratio: 2 / 1 !important;
            max-height: 180px;
          }
          .feature-big-num {
            font-size: clamp(48px, 15vw, 76px) !important;
          }
        }`;

if (src.includes(cssAnchor)) {
  src = src.replace(cssAnchor, () => cssNew);
  edits++;
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + edits + ' edits:');
console.log('  - Added className to visual block, big number, and label');
console.log('  - New @media (max-width: 800px) rules:');
console.log('      · Feature rows: single column, 24px gap, 48px padding');
console.log('      · Forces text-first reading order (reverse rows normal on mobile)');
console.log('      · Visual: 16:9 aspect ratio, max 240px tall');
console.log('      · Big number scales down to min 56px');
console.log('      · Label positioned tighter to bottom-left');
console.log('  - New @media (max-width: 480px) rules (phone size):');
console.log('      · Even tighter padding');
console.log('      · Visual: 2:1 aspect, max 180px tall');
console.log('      · Big number down to min 48px');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: mobile-friendly feature rows on home" && git push');
console.log('');
