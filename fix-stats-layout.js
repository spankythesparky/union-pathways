// fix-stats-layout.js — Stats sit side-by-side instead of stacked vertically.
//
// Desktop: 4 columns across (one row)
// Tablet: 2x2 (still horizontal pairs, not a column)
// Small phone (<480px): single column (one number per row, but readable)

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// The home page stats grid — line ~7358
// Need to be specific so we don't affect other identical-looking grids elsewhere

const homeStatsOld = `            <div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:48}}>
              // {lang===\"es\" ? \"Por los numeros\" : lang===\"pl\" ? \"W liczbach\" : \"By the numbers\"}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:60}}>`;

const homeStatsNew = `            <div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:32}}>
              // {lang===\"es\" ? \"Por los numeros\" : lang===\"pl\" ? \"W liczbach\" : \"By the numbers\"}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24}} className="home-stats-grid">`;

if (!src.includes(homeStatsOld)) {
  console.error('ERROR: Could not find home stats anchor.');
  process.exit(1);
}
src = src.replace(homeStatsOld, () => homeStatsNew);

// Also size the numbers down a bit since they're now closer together
// And reduce label size to fit better in the narrower columns
const numbersOld = `                <div key={i}>
                  <div style={{
                    fontFamily:"'Space Grotesk',sans-serif",
                    fontSize:'clamp(48px, 6.5vw, 80px)',
                    fontWeight:500,
                    background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)',
                    WebkitBackgroundClip:'text', backgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    lineHeight:0.95, letterSpacing:'-0.04em', marginBottom:14
                  }}>{s.num}</div>
                  <div style={{fontFamily:"'Inter',sans-serif", fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.5}}>{s.label}</div>`;

const numbersNew = `                <div key={i}>
                  <div style={{
                    fontFamily:"'Space Grotesk',sans-serif",
                    fontSize:'clamp(28px, 4vw, 48px)',
                    fontWeight:500,
                    background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)',
                    WebkitBackgroundClip:'text', backgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    lineHeight:1, letterSpacing:'-0.03em', marginBottom:8
                  }}>{s.num}</div>
                  <div style={{fontFamily:"'Inter',sans-serif", fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.45}}>{s.label}</div>`;

if (!src.includes(numbersOld)) {
  console.error('WARN: Number block anchor not exact match - skipping size adjustment');
} else {
  src = src.replace(numbersOld, () => numbersNew);
}

// Add a responsive media query to the global CSS so the stats wrap nicely on mobile
const cssOld = `        .ds-body {
          font-family: 'Inter', sans-serif;
          line-height: 1.65;
        }`;
const cssNew = `        .ds-body {
          font-family: 'Inter', sans-serif;
          line-height: 1.65;
        }
        @media (max-width: 720px) {
          .home-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
        }
        @media (max-width: 400px) {
          .home-stats-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }`;

if (src.includes(cssOld)) {
  src = src.replace(cssOld, () => cssNew);
} else {
  console.error('WARN: Could not find CSS anchor for responsive rules');
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Home stats now sit horizontally:');
console.log('  - Desktop (>720px): 4 across in one row');
console.log('  - Tablet (480-720px): 2x2 grid');
console.log('  - Phone (<400px): single column (only on very small phones)');
console.log('  - Numbers tuned smaller to fit the new tighter layout');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: stats row horizontal, not stacked" && git push');
console.log('');
