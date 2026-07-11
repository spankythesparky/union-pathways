// fix-organize-v4-pass2.js
//
// Second pass on /organize and /organize-contractor to catch patterns
// missed by the first pass:
//   1. #3B9EFF (blue accent) → navy #072554 (unified brand palette)
//   2. borderLeft:"4px solid #FA8059" → orange border
//   3. rgba(0,0,0,0.25) black bg → white
//   4. rgba(255,255,255,X) leftovers → light equivalents
//   5. Other stragglers

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* ORGANIZE V4 PASS 2 */')) {
  console.error('ERROR: Pass 2 already applied. Aborting.');
  process.exit(1);
}

// Second-pass converter — targets patterns from analysis
function convertPass2(text) {
  return text
    // Blue accent (#3B9EFF) — was used for "For Union Members" section, unify with navy
    .replace(/background:"#3B9EFF22"/g, 'background:"rgba(7,37,84,0.06)"')
    .replace(/border:"2px solid #3B9EFF"/g, 'border:"2px solid #072554"')
    .replace(/border:"1px solid #3B9EFF"/g, 'border:"1px solid #072554"')
    .replace(/borderLeft:"4px solid #3B9EFF"/g, 'borderLeft:"4px solid #072554"')
    .replace(/color:"#3B9EFF"/g, 'color:"#072554"')
    .replace(/color: "#3B9EFF"/g, 'color: "#072554"')

    // Left-border accents from first pass — coral to orange
    .replace(/borderLeft:"4px solid #FA8059"/g, 'borderLeft:"4px solid #FF6B00"')
    .replace(/borderLeft:"3px solid #FA8059"/g, 'borderLeft:"3px solid #FF6B00"')
    .replace(/borderLeft:"4px solid rgba\(250,128,89,/g, 'borderLeft:"4px solid rgba(255,107,0,')
    .replace(/borderLeft:"3px solid rgba\(250,128,89,/g, 'borderLeft:"3px solid rgba(255,107,0,')

    // Dark semi-transparent card backgrounds → white
    .replace(/background:"rgba\(0,0,0,0\.25\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.3\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.2\)"/g, 'background:"#F5F3EE"')
    .replace(/background:"rgba\(0,0,0,0\.15\)"/g, 'background:"#F5F3EE"')
    .replace(/background:"rgba\(0,0,0,0\.4\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.5\)"/g, 'background:"#ffffff"')

    // Leftover white-transparent borders inside dark-card patterns → light nav-tinted
    .replace(/border:"1px solid rgba\(255,255,255,0\.06\)"/g, 'border:"1px solid rgba(7,37,84,0.06)"')

    // Divider line gradient — was white transparent for dark bg, use navy for light
    .replace(/rgba\(255,255,255,0\.15\)/g, 'rgba(7,37,84,0.12)')
    .replace(/rgba\(255,255,255,0\.2\)/g, 'rgba(7,37,84,0.15)')
    .replace(/rgba\(255,255,255,0\.25\)/g, 'rgba(7,37,84,0.15)')

    // Also — dark card backgrounds with linear gradients (blue-yellow highlight)
    .replace(/background:"linear-gradient\(135deg, rgba\(7,37,84,0\.04\), rgba\(255,107,0,0\.03\)\)"/g,
             'background:"linear-gradient(135deg, rgba(7,37,84,0.05), rgba(255,107,0,0.05))"');
}

let edits = 0;

// ═══════════════════════════════════════════════════════════════
// 1. /organize block
// ═══════════════════════════════════════════════════════════════
const organizeStart = `        {page === "organize" && (\n          <div className="page-v4">`;
const organizeEnd = `        {page === "organize-contractor" && (`;
const oStartIdx = src.indexOf(organizeStart);
if (oStartIdx === -1) {
  console.error('ERROR: Could not find organize block (not marked page-v4). Was Pass 1 applied?');
  process.exit(1);
}
const oEndIdx = src.indexOf(organizeEnd, oStartIdx);
if (oEndIdx === -1) {
  console.error('ERROR: Could not find organize block end.');
  process.exit(1);
}
const oBlock = src.slice(oStartIdx, oEndIdx);
const oNew = convertPass2(oBlock);
if (oNew !== oBlock) {
  src = src.slice(0, oStartIdx) + oNew + src.slice(oEndIdx);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 2. /organize-contractor block
// ═══════════════════════════════════════════════════════════════
const ocStart = `        {page === "organize-contractor" && (\n          <div className="page-v4">`;
const ocEnd = `        {/* PLATFORM OVERVIEW`;
const ocStartIdx = src.indexOf(ocStart);
if (ocStartIdx === -1) {
  console.error('ERROR: Could not find organize-contractor block start.');
  process.exit(1);
}
const ocEndIdx = src.indexOf(ocEnd, ocStartIdx);
if (ocEndIdx === -1) {
  console.error('ERROR: Could not find organize-contractor block end.');
  process.exit(1);
}
const ocBlock = src.slice(ocStartIdx, ocEndIdx);
const ocNew = convertPass2(ocBlock);
if (ocNew !== ocBlock) {
  src = src.slice(0, ocStartIdx) + ocNew + src.slice(ocEndIdx);
  edits++;
}

// Add a marker comment so we don't run this twice
src = src.replace('/* ORGANIZE V4 SCOPED', '/* ORGANIZE V4 PASS 2 */\n        /* ORGANIZE V4 SCOPED');

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + edits + ' block conversions.');
console.log('');
console.log('Additional patterns fixed:');
console.log('  - Blue #3B9EFF (For Union Members section) → navy #072554');
console.log('  - Coral left-border accents → orange #FF6B00');
console.log('  - Semi-transparent black backgrounds → white cards');
console.log('  - Divider line gradients → navy-tinted for light bg');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: organize pages pass 2 - unify blue accent to navy" && git push');
console.log('');
