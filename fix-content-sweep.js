// fix-content-sweep.js
//
// Content page sweep — converts 14 informational pages to v4 corporate.
//
// SIMPLE PATTERN (8 pages, wrapped in .page-v4):
//   about, contact, locals, checklist, quiz, retirement, veterans, resume
//
// IIFE PATTERN (6 pages, bulk-converted only):
//   careers, benefits, calculator, downpayment, mental-health, trade-history

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* CONTENT SWEEP V4 */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

// Comprehensive pattern converter (same as organize-cluster-part2)
function convertBlock(text) {
  let out = text;

  // Text colors
  out = out
    .replace(/color:"#fff"/g, 'color:"#072554"')
    .replace(/color: "#fff"/g, 'color: "#072554"')
    .replace(/color:'#fff'/g, "color:'#072554'")
    .replace(/color: '#fff'/g, "color: '#072554'")
    .replace(/color:"#ffffff"/g, 'color:"#072554"')
    .replace(/color:'#ffffff'/g, "color:'#072554'")
    .replace(/color:"rgba\(255,255,255,0\.95\)"/g, 'color:"#072554"')
    .replace(/color:"rgba\(255,255,255,0\.9\)"/g, 'color:"#072554"')
    .replace(/color:"rgba\(255,255,255,0\.85\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.8\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.75\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.7\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.65\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.6\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(255,255,255,0\.55\)"/g, 'color:"#8A94A6"')
    .replace(/color:"rgba\(255,255,255,0\.5\)"/g, 'color:"#8A94A6"')
    .replace(/color:"rgba\(255,255,255,0\.4\)"/g, 'color:"#8A94A6"')
    .replace(/color:"rgba\(160,180,196,0\.85\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(160,180,196,0\.7\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(160,180,196,0\.6\)"/g, 'color:"#5A6478"')
    .replace(/color:"rgba\(160,180,196,0\.5\)"/g, 'color:"#8A94A6"')
    .replace(/color:"var\(--muted\)"/g, 'color:"#5A6478"')
    .replace(/color:"var\(--yellow\)"/g, 'color:"#FF6B00"')
    .replace(/color:"var\(--text\)"/g, 'color:"#072554"');

  // Accents
  out = out
    .replace(/color:"#FA8059"/g, 'color:"#FF6B00"')
    .replace(/color: "#FA8059"/g, 'color: "#FF6B00"')
    .replace(/color:'#FA8059'/g, "color:'#FF6B00'")
    .replace(/color: '#FA8059'/g, "color: '#FF6B00'")
    .replace(/color:"#3B9EFF"/g, 'color:"#072554"')
    .replace(/color: "#3B9EFF"/g, 'color: "#072554"')
    .replace(/color:"#F5C518"/g, 'color:"#FF6B00"')
    .replace(/color:"#10A37F"/g, 'color:"#0f766e"');  // green — keep-ish, slightly darker

  // Backgrounds — dark → white
  out = out
    .replace(/background:"#000"/g, 'background:"#ffffff"')
    .replace(/background: "#000"/g, 'background: "#ffffff"')
    .replace(/background:"#0a1628"/g, 'background:"#ffffff"')
    .replace(/background:"#1a2c3a"/g, 'background:"#F5F7FA"')
    .replace(/background:"#22303D"/g, 'background:"#F5F7FA"')
    .replace(/background:"#111"/g, 'background:"#ffffff"')
    .replace(/background:"#111111"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.5\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.4\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.35\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.3\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.25\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(0,0,0,0\.2\)"/g, 'background:"#F5F7FA"')
    .replace(/background:"rgba\(0,0,0,0\.15\)"/g, 'background:"#F5F7FA"')
    .replace(/background:"rgba\(0,0,0,0\.1\)"/g, 'background:"#F5F7FA"')
    .replace(/background:"var\(--card-bg\)"/g, 'background:"#ffffff"')
    .replace(/background:"var\(--steel\)"/g, 'background:"#ffffff"')
    .replace(/background:"var\(--plate\)"/g, 'background:"#F5F7FA"')

    // Coral tint bgs → orange tint
    .replace(/background:"#FA805922"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(250,128,89,0\.15\)"/g, 'background:"rgba(255,107,0,0.10)"')
    .replace(/background:"rgba\(250,128,89,0\.12\)"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(250,128,89,0\.1\)"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(250,128,89,0\.08\)"/g, 'background:"rgba(255,107,0,0.06)"')
    .replace(/background:"rgba\(250,128,89,0\.06\)"/g, 'background:"rgba(255,107,0,0.05)"')
    .replace(/background:"rgba\(250,128,89,0\.05\)"/g, 'background:"rgba(255,107,0,0.05)"')
    .replace(/background:"rgba\(250,128,89,0\.04\)"/g, 'background:"rgba(255,107,0,0.04)"')

    // Yellow tint bgs
    .replace(/background:"rgba\(245,197,24,0\.08\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(245,197,24,0\.06\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(245,197,24,0\.04\)"/g, 'background:"#ffffff"')

    // White-transparent
    .replace(/background:"rgba\(255,255,255,0\.06\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.05\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.04\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.03\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.02\)"/g, 'background:"#ffffff"')

    // Blue accent tint
    .replace(/background:"#3B9EFF22"/g, 'background:"rgba(7,37,84,0.06)"')
    .replace(/background:"rgba\(59,158,255,0\.1\)"/g, 'background:"rgba(7,37,84,0.05)"')
    .replace(/background:"rgba\(59,158,255,0\.08\)"/g, 'background:"rgba(7,37,84,0.05)"');

  // Borders
  out = out
    .replace(/border:"2px solid #FA8059"/g, 'border:"2px solid #FF6B00"')
    .replace(/border:"1px solid #FA8059"/g, 'border:"1px solid #FF6B00"')
    .replace(/border:"2px solid #3B9EFF"/g, 'border:"2px solid #072554"')
    .replace(/border:"1px solid #3B9EFF"/g, 'border:"1px solid #072554"')
    .replace(/borderLeft:"4px solid #FA8059"/g, 'borderLeft:"4px solid #FF6B00"')
    .replace(/borderLeft:"3px solid #FA8059"/g, 'borderLeft:"3px solid #FF6B00"')
    .replace(/borderLeft:"4px solid #3B9EFF"/g, 'borderLeft:"4px solid #072554"')
    .replace(/borderLeft:"4px solid rgba\(250,128,89,/g, 'borderLeft:"4px solid rgba(255,107,0,')
    .replace(/borderLeft:"3px solid rgba\(250,128,89,/g, 'borderLeft:"3px solid rgba(255,107,0,')
    .replace(/border:"1px solid rgba\(245,197,24,0\.3\)"/g, 'border:"1px solid rgba(255,107,0,0.20)"')
    .replace(/border:"1px solid rgba\(245,197,24,0\.2\)"/g, 'border:"1px solid rgba(255,107,0,0.15)"')
    .replace(/border:"1px solid rgba\(59,158,255,0\.3\)"/g, 'border:"1px solid rgba(7,37,84,0.15)"')
    .replace(/border:"1px solid rgba\(59,158,255,0\.25\)"/g, 'border:"1px solid rgba(7,37,84,0.15)"')
    .replace(/border:"1px solid rgba\(58,80,104,0\.4\)"/g, 'border:"1px solid rgba(7,37,84,0.10)"')
    .replace(/border:"1px solid rgba\(58,80,104,0\.5\)"/g, 'border:"1px solid rgba(7,37,84,0.12)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.15\)"/g, 'border:"1px solid rgba(7,37,84,0.10)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.14\)"/g, 'border:"1px solid rgba(7,37,84,0.10)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.12\)"/g, 'border:"1px solid rgba(7,37,84,0.10)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.1\)"/g, 'border:"1px solid rgba(7,37,84,0.08)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.08\)"/g, 'border:"1px solid rgba(7,37,84,0.08)"')
    .replace(/border:"1px solid rgba\(255,255,255,0\.06\)"/g, 'border:"1px solid rgba(7,37,84,0.06)"')
    .replace(/border:"1px solid rgba\(250,128,89,0\.25\)"/g, 'border:"1px solid rgba(255,107,0,0.20)"')
    .replace(/border:"1px solid rgba\(250,128,89,0\.2\)"/g, 'border:"1px solid rgba(255,107,0,0.15)"')
    .replace(/border:"1px solid var\(--wire\)"/g, 'border:"1px solid rgba(7,37,84,0.08)"');

  // Fonts
  out = out
    .replace(/fontFamily:"'Barlow Condensed',sans-serif"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily:"'Space Grotesk',sans-serif"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily:"'Space Mono',monospace"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily: "'Barlow Condensed',sans-serif"/g, `fontFamily: "'Inter',sans-serif"`)
    .replace(/fontFamily: "'Space Grotesk',sans-serif"/g, `fontFamily: "'Inter',sans-serif"`)
    .replace(/fontFamily:'Barlow Condensed', sans-serif/g, `fontFamily:'Inter', sans-serif`);

  // CTA button contrast (do after color:"#fff" swap to correct back)
  out = out
    .replace(/background:"#FA8059", color:"#000"/g, 'background:"#FF6B00", color:"#ffffff"')
    .replace(/background:"#FF6B00", color:"#072554"/g, 'background:"#FF6B00", color:"#ffffff"')
    .replace(/background: "#FA8059", color: "#000"/g, 'background: "#FF6B00", color: "#ffffff"')
    .replace(/background:"#FA8059"/g, 'background:"#FF6B00"')
    .replace(/background: "#FA8059"/g, 'background: "#FF6B00"');

  return out;
}

let edits = 0;

// ═══════════════════════════════════════════════════════════════
// SIMPLE PATTERN pages — wrap in .page-v4 THEN convert
// ═══════════════════════════════════════════════════════════════
const simplePages = ['about', 'contact', 'locals', 'checklist', 'quiz', 'retirement', 'veterans', 'resume'];

// All page positions to compute end boundaries
const allPageMatches = [];
const pageRe = /\{page === "[a-z-]+"/g;
let m;
while ((m = pageRe.exec(src)) !== null) {
  allPageMatches.push({ pos: m.index, name: m[0] });
}
allPageMatches.sort((a, b) => a.pos - b.pos);

function findPageEnd(startPos) {
  for (const p of allPageMatches) {
    if (p.pos > startPos) return p.pos;
  }
  return src.length;
}

for (const page of simplePages) {
  // Try several possible opening patterns
  const patterns = [
    `        {page === "${page}" && (\n          <div>`,
    `        {page === "${page}" && (\n          <div className="page">`,
    `        {page === "${page}" && (\n          <div className="page" style={{maxWidth: 860}}>`,
  ];

  let startIdx = -1;
  let startMarker = '';
  let replaceMarker = '';
  for (const pat of patterns) {
    const idx = src.indexOf(pat);
    if (idx !== -1) {
      startIdx = idx;
      startMarker = pat;
      // Build the replacement: add page-v4 to className if it exists, else just wrap
      if (pat.includes('className="page"')) {
        replaceMarker = pat.replace('className="page"', 'className="page page-v4"');
      } else {
        replaceMarker = pat.replace('<div>', '<div className="page-v4">');
      }
      break;
    }
  }
  if (startIdx === -1) {
    console.error('WARN: Could not find ' + page + ' simple pattern start.');
    continue;
  }
  const endIdx = findPageEnd(startIdx + 10);
  const block = src.slice(startIdx, endIdx);

  // Wrap: replace opening with page-v4 class added
  let converted = block.replace(startMarker, replaceMarker);
  converted = convertBlock(converted);

  if (converted !== block) {
    src = src.slice(0, startIdx) + converted + src.slice(endIdx);
    edits++;
    allPageMatches.length = 0;
    pageRe.lastIndex = 0;
    while ((m = pageRe.exec(src)) !== null) {
      allPageMatches.push({ pos: m.index, name: m[0] });
    }
    allPageMatches.sort((a, b) => a.pos - b.pos);
    console.log('  ✓ SIMPLE + wrapped: ' + page);
  }
}

// ═══════════════════════════════════════════════════════════════
// IIFE PATTERN pages — bulk convert only, no wrapping
// ═══════════════════════════════════════════════════════════════
const iifePages = ['careers', 'benefits', 'calculator', 'downpayment', 'mental-health', 'trade-history'];

for (const page of iifePages) {
  const startMarker = `        {page === "${page}" && (() => {`;
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) {
    console.error('WARN: Could not find ' + page + ' IIFE pattern start.');
    continue;
  }
  const endIdx = findPageEnd(startIdx + 10);
  const block = src.slice(startIdx, endIdx);
  const converted = convertBlock(block);

  if (converted !== block) {
    src = src.slice(0, startIdx) + converted + src.slice(endIdx);
    edits++;
    // Re-scan positions
    allPageMatches.length = 0;
    pageRe.lastIndex = 0;
    while ((m = pageRe.exec(src)) !== null) {
      allPageMatches.push({ pos: m.index, name: m[0] });
    }
    allPageMatches.sort((a, b) => a.pos - b.pos);
    console.log('  ✓ IIFE bulk-convert: ' + page);
  }
}

// Add marker
if (edits > 0) {
  src = src.replace('/* HISTORY TITLE V4 FIX */', '/* CONTENT SWEEP V4 */\n        /* HISTORY TITLE V4 FIX */');
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. ' + edits + ' pages converted.');
console.log('');
console.log('SIMPLE pages (wrapped in .page-v4 + bulk convert):');
console.log('  about, contact, locals, checklist, quiz, retirement, veterans, resume');
console.log('');
console.log('IIFE pages (bulk convert only, no wrapping):');
console.log('  careers, benefits, calculator, downpayment, mental-health, trade-history');
console.log('');
console.log('EXPECTED: some pages will have edge cases that need cleanup passes,');
console.log('same as the Organize cluster. This is normal for bulk conversion.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: content sweep - 14 pages to v4" && git push');
console.log('');
