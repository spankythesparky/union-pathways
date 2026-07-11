// fix-organize-v4.js
//
// Atomically converts /organize and /organize-contractor pages to v4 corporate.
//
// Strategy:
//   1. Add scoped CSS rules (.page-v4 .impact-card etc.) that only affect
//      elements inside a .page-v4 wrapper — leaves other pages using
//      these classes unchanged
//   2. Wrap each of the two organize page render blocks in
//      <div className="page-v4" style={{background:'#FAFAF7'}}>...</div>
//   3. Do bounded string replacements WITHIN each wrapped block:
//      - Colors (white→navy, coral→orange, muted white→gray)
//      - Backgrounds (dark→white surfaces)
//      - Borders (dark→light)
//      - Fonts (Barlow Condensed→Inter)

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* ORGANIZE V4 SCOPED */')) {
  console.error('ERROR: Organize v4 already applied. Aborting.');
  process.exit(1);
}

let edits = 0;

// ═══════════════════════════════════════════════════════════════
// 1. Add scoped CSS rules for .page-v4 wrapper
// Injects before an existing anchor near the responsive CSS
// ═══════════════════════════════════════════════════════════════
const cssAnchor = `        @media (max-width: 400px) {
          .home-stats-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }`;

const cssNew = `        @media (max-width: 400px) {
          .home-stats-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }

        /* ORGANIZE V4 SCOPED — only affects elements inside .page-v4 wrapper */
        .page-v4 {
          background: #FAFAF7;
          color: #072554;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .page-v4 .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .page-v4 .impact-card {
          background: #ffffff;
          border: 1px solid rgba(7,37,84,0.08);
          border-radius: 12px;
          padding: 24px 26px;
          box-shadow: 0 1px 3px rgba(7,37,84,0.03);
          transition: box-shadow 0.15s;
        }
        .page-v4 .impact-card:hover {
          box-shadow: 0 4px 16px rgba(7,37,84,0.06);
        }
        .page-v4 .impact-title {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #072554;
          margin-bottom: 8px;
          letter-spacing: -0.005em;
        }
        .page-v4 .impact-desc {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #5A6478;
          line-height: 1.6;
        }
        .page-v4 h1, .page-v4 h2, .page-v4 h3, .page-v4 h4 {
          font-family: 'Inter', sans-serif !important;
          letter-spacing: -0.02em;
        }
        .page-v4 ul, .page-v4 ol {
          color: #5A6478;
        }
        .page-v4 a {
          color: #FF6B00;
        }
        .page-v4 a:hover {
          color: #d95a00;
        }`;

if (src.includes(cssAnchor)) {
  src = src.replace(cssAnchor, () => cssNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 2. Helper: apply pattern replacements within a bounded substring
// ═══════════════════════════════════════════════════════════════
function convertBlock(blockText) {
  return blockText
    // Text colors — white variants → navy/gray
    .replace(/color:"#fff"/g, 'color:"#072554"')
    .replace(/color: "#fff"/g, 'color: "#072554"')
    .replace(/color:'#fff'/g, "color:'#072554'")
    .replace(/color:"rgba\(255,255,255,0\.85\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.8\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.75\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.7\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.65\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.6\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.55\)"/g, 'color:"#8A94A6"')
    .replace(/color:"rgba\(255,255,255,0\.5\)"/g, 'color:"#8A94A6"')
    .replace(/color:"rgba\(160,180,196,0\.6\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(160,180,196,0\.5\)"/g, 'color:"#8A94A6"')
    .replace(/color:"var\(--muted\)"/g, 'color:"#5A6478"')

    // Accent colors — coral → orange
    .replace(/color:"#FA8059"/g, 'color:"#FF6B00"')
    .replace(/color: "#FA8059"/g, 'color: "#FF6B00"')

    // Backgrounds — dark surfaces → white/light
    .replace(/background:"#FA805922"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(245,197,24,0\.06\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(245,197,24,0\.08\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.02\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.03\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.04\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.05\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.06\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(59,158,255,0\.1\)"/g, 'background:"rgba(7,37,84,0.05)"')
    .replace(/background:"rgba\(250,128,89,0\.1\)"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(250,128,89,0\.08\)"/g, 'background:"rgba(255,107,0,0.06)"')
    .replace(/background:"rgba\(250,128,89,0\.06\)"/g, 'background:"rgba(255,107,0,0.05)"')
    .replace(/background:"rgba\(250,128,89,0\.05\)"/g, 'background:"rgba(255,107,0,0.05)"')
    .replace(/background:"rgba\(0,0,0,0\.2\)"/g, 'background:"#F5F3EE"')
    .replace(/background:"linear-gradient\(135deg, rgba\(59,158,255,0\.1\), rgba\(245,197,24,0\.05\)\)"/g, 'background:"linear-gradient(135deg, rgba(7,37,84,0.04), rgba(255,107,0,0.03))"')

    // Borders — dark → light
    .replace(/border:"2px solid #FA8059"/g, 'border:"2px solid #FF6B00"')
    .replace(/border:"1px solid #FA8059"/g, 'border:"1px solid #FF6B00"')
    .replace(/border:"1px solid rgba\(245,197,24,0\.2\)"/g, 'border:"1px solid rgba(255,107,0,0.15)"')
    .replace(/border:"1px solid rgba\(245,197,24,0\.3\)"/g, 'border:"1px solid rgba(255,107,0,0.20)"')
    .replace(/border:"1px solid rgba\(59,158,255,0\.25\)"/g, 'border:"1px solid rgba(7,37,84,0.15)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.08\)"/g, 'border:"1px solid rgba(7,37,84,0.08)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.1\)"/g, 'border:"1px solid rgba(7,37,84,0.1)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.12\)"/g, 'border:"1px solid rgba(7,37,84,0.12)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.14\)"/g, 'border:"1px solid rgba(7,37,84,0.12)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.15\)"/g, 'border:"1px solid rgba(7,37,84,0.15)"')
    .replace(/border:"1px solid rgba\(250,128,89,0\.2\)"/g, 'border:"1px solid rgba(255,107,0,0.15)"')
    .replace(/border:"1px solid rgba\(250,128,89,0\.25\)"/g, 'border:"1px solid rgba(255,107,0,0.20)"')
    .replace(/borderColor:"rgba\(250,128,89,0\.2\)"/g, 'borderColor:"rgba(255,107,0,0.15)"')

    // Fonts — old display fonts → Inter
    .replace(/fontFamily:"'Barlow Condensed',sans-serif"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily:"'Space Grotesk',sans-serif"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily:"'Space Mono',monospace"/g, `fontFamily:"'Inter',sans-serif"`)

    // Font weights — since Inter's Black weight is 900 (same), but display sizes look different
    // Reduce the extreme letter-spacing that was used with Barlow Condensed
    .replace(/letterSpacing:1\.5/g, 'letterSpacing:"0.12em"')
    .replace(/letterSpacing:1/g, 'letterSpacing:"0.08em"')
    .replace(/letterSpacing:2/g, 'letterSpacing:"0.14em"')

    // For CTAs and buttons — coral bg on black text becomes orange bg on white text
    .replace(/background:"#3B9EFF", color:"#000"/g, 'background:"#FF6B00", color:"#ffffff"')
    .replace(/background:"#FA8059", color:"#000"/g, 'background:"#FF6B00", color:"#ffffff"')
    .replace(/background:"#FA8059"/g, 'background:"#FF6B00"');
}

// ═══════════════════════════════════════════════════════════════
// 3. Convert /organize block
// ═══════════════════════════════════════════════════════════════
const organizeStart = `        {page === "organize" && (\n          <div>`;
const organizeEndAfter = `        {page === "organize-contractor" && (`;
const organizeStartIdx = src.indexOf(organizeStart);
if (organizeStartIdx === -1) {
  console.error('ERROR: Could not find organize block start.');
  process.exit(1);
}
const organizeEndSearchFrom = organizeStartIdx + organizeStart.length;
const organizeEndIdx = src.indexOf(organizeEndAfter, organizeEndSearchFrom);
if (organizeEndIdx === -1) {
  console.error('ERROR: Could not find organize block end.');
  process.exit(1);
}
const organizeBlock = src.slice(organizeStartIdx, organizeEndIdx);
const organizeConverted = organizeBlock
  .replace(organizeStart, `        {page === "organize" && (\n          <div className="page-v4">`);
const organizeFinal = convertBlock(organizeConverted);
src = src.slice(0, organizeStartIdx) + organizeFinal + src.slice(organizeEndIdx);
edits++;

// ═══════════════════════════════════════════════════════════════
// 4. Convert /organize-contractor block
// ═══════════════════════════════════════════════════════════════
const ocStart = `        {page === "organize-contractor" && (\n          <div>`;
const ocEndAfter = `        {/* PLATFORM OVERVIEW`;
const ocStartIdx = src.indexOf(ocStart);
if (ocStartIdx === -1) {
  console.error('ERROR: Could not find organize-contractor block start.');
  process.exit(1);
}
const ocEndSearchFrom = ocStartIdx + ocStart.length;
const ocEndIdxFinal = src.indexOf(ocEndAfter, ocEndSearchFrom);
if (ocEndIdxFinal === -1) {
  console.error('ERROR: Could not find organize-contractor block end.');
  process.exit(1);
}
const ocBlock = src.slice(ocStartIdx, ocEndIdxFinal);
const ocConverted = ocBlock
  .replace(ocStart, `        {page === "organize-contractor" && (\n          <div className="page-v4">`);
const ocFinal = convertBlock(ocConverted);
src = src.slice(0, ocStartIdx) + ocFinal + src.slice(ocEndIdxFinal);
edits++;

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + edits + ' operations:');
console.log('  - Added .page-v4 scoped CSS block (paper bg, Inter font, white cards)');
console.log('  - Wrapped /organize page in <div className="page-v4">');
console.log('  - Wrapped /organize-contractor page in <div className="page-v4">');
console.log('  - Bounded pattern replacements applied inside both blocks:');
console.log('      · White text → navy #072554');
console.log('      · Muted white text → gray-navy #5A6478');
console.log('      · Coral #FA8059 → orange #FF6B00');
console.log('      · Dark surface backgrounds → white cards');
console.log('      · Dark borders → light navy borders');
console.log('      · Barlow Condensed / Space Grotesk / Space Mono → Inter');
console.log('      · CTAs: coral bg + black text → orange bg + white text');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: organize + organize-contractor v4 corporate" && git push');
console.log('');
