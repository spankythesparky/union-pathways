// fix-organize-cluster-part2.js
//
// Converts the remaining three Organize cluster pages to v4 corporate:
//   - /caucus  (451 lines)
//   - /rtw     (687 lines)
//   - /weingarten (406 lines)
//
// These are IIFE-pattern components with local theme constants and custom
// components. We do comprehensive bulk pattern replacement WITHIN each
// page block boundary. No external wrapping — these pages have their own
// component architecture that would resist it.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* ORGANIZE CLUSTER PART 2 V4 */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

// Comprehensive pattern converter — covers ALL the patterns I've encountered
function convertBlock(text) {
  let out = text;

  // ── Local theme constants (caucus page has these) ──
  out = out
    .replace(/const ACCENT = '#FA8059';/g, "const ACCENT = '#FF6B00';")
    .replace(/const ACCENT_DIM = 'rgba\(220,38,38,0\.5\)';/g, "const ACCENT_DIM = 'rgba(255,107,0,0.4)';")
    .replace(/const ACCENT_GLOW = 'rgba\(220,38,38,0\.18\)';/g, "const ACCENT_GLOW = 'rgba(255,107,0,0.15)';");

  // ── Text colors — white variants → navy/gray ──
  out = out
    .replace(/color:"#fff"/g, 'color:"#072554"')
    .replace(/color: "#fff"/g, 'color: "#072554"')
    .replace(/color:'#fff'/g, "color:'#072554'")
    .replace(/color: '#fff'/g, "color: '#072554'")
    .replace(/color:"#ffffff"/g, 'color:"#072554"')  // will be reverted for buttons below
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

  // ── Coral accents → orange ──
  out = out
    .replace(/color:"#FA8059"/g, 'color:"#FF6B00"')
    .replace(/color: "#FA8059"/g, 'color: "#FF6B00"')
    .replace(/color:'#FA8059'/g, "color:'#FF6B00'")
    .replace(/color: '#FA8059'/g, "color: '#FF6B00'")

    // Blue accent → navy
    .replace(/color:"#3B9EFF"/g, 'color:"#072554"')
    .replace(/color: "#3B9EFF"/g, 'color: "#072554"');

  // ── Dark backgrounds → white cards ──
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

    // Steel/dark card variants
    .replace(/background:"var\(--card-bg\)"/g, 'background:"#ffffff"')
    .replace(/background:"var\(--steel\)"/g, 'background:"#ffffff"')
    .replace(/background:"var\(--plate\)"/g, 'background:"#F5F7FA"')

    // Coral tint backgrounds → orange tint
    .replace(/background:"#FA805922"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(250,128,89,0\.15\)"/g, 'background:"rgba(255,107,0,0.10)"')
    .replace(/background:"rgba\(250,128,89,0\.12\)"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(250,128,89,0\.1\)"/g, 'background:"rgba(255,107,0,0.08)"')
    .replace(/background:"rgba\(250,128,89,0\.08\)"/g, 'background:"rgba(255,107,0,0.06)"')
    .replace(/background:"rgba\(250,128,89,0\.06\)"/g, 'background:"rgba(255,107,0,0.05)"')
    .replace(/background:"rgba\(250,128,89,0\.05\)"/g, 'background:"rgba(255,107,0,0.05)"')
    .replace(/background:"rgba\(250,128,89,0\.04\)"/g, 'background:"rgba(255,107,0,0.04)"')

    // Old yellow-tint backgrounds
    .replace(/background:"rgba\(245,197,24,0\.08\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(245,197,24,0\.06\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(245,197,24,0\.04\)"/g, 'background:"#ffffff"')

    // White-transparent (surface variants) → white
    .replace(/background:"rgba\(255,255,255,0\.06\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.05\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.04\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.03\)"/g, 'background:"#ffffff"')
    .replace(/background:"rgba\(255,255,255,0\.02\)"/g, 'background:"#ffffff"')

    // Blue accent tint → navy tint
    .replace(/background:"#3B9EFF22"/g, 'background:"rgba(7,37,84,0.06)"')
    .replace(/background:"rgba\(59,158,255,0\.1\)"/g, 'background:"rgba(7,37,84,0.05)"')
    .replace(/background:"rgba\(59,158,255,0\.08\)"/g, 'background:"rgba(7,37,84,0.05)"');

  // ── Borders ──
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

  // ── Fonts ──
  out = out
    .replace(/fontFamily:"'Barlow Condensed',sans-serif"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily:"'Space Grotesk',sans-serif"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily:"'Space Mono',monospace"/g, `fontFamily:"'Inter',sans-serif"`)
    .replace(/fontFamily: "'Barlow Condensed',sans-serif"/g, `fontFamily: "'Inter',sans-serif"`)
    .replace(/fontFamily: "'Space Grotesk',sans-serif"/g, `fontFamily: "'Inter',sans-serif"`);

  // ── CTA buttons — coral bg with black text → orange bg with white text ──
  // Do this AFTER the general color:"#fff" swap to correct it back
  out = out
    .replace(/background:"#FA8059", color:"#000"/g, 'background:"#FF6B00", color:"#ffffff"')
    .replace(/background:"#FF6B00", color:"#072554"/g, 'background:"#FF6B00", color:"#ffffff"')
    .replace(/background: "#FA8059", color: "#000"/g, 'background: "#FF6B00", color: "#ffffff"');

  // ── Left-over #FA8059 backgrounds (buttons without color set) ──
  out = out
    .replace(/background:"#FA8059"/g, 'background:"#FF6B00"')
    .replace(/background: "#FA8059"/g, 'background: "#FF6B00"');

  // ── Top-level component root: add paper white bg ──
  // For pages returning `<div style={{...}}>` as root, we need to update root bg
  // These pages typically start their return with `<div>` or `<div style={{...}}>`
  return out;
}

let edits = 0;

// Convert each of the three pages
const pageStarts = [
  { name: 'caucus', start: '        {page === "caucus" && (() => {', endAfter: '        {page === "mental-health"' },
  { name: 'rtw', start: '        {page === "rtw" && (() => {', endAfter: '        {page === "weingarten"' },
  { name: 'weingarten', start: '        {page === "weingarten" && (() => {', endAfter: '        {page === "downpayment"' },
];

for (const p of pageStarts) {
  const startIdx = src.indexOf(p.start);
  if (startIdx === -1) {
    console.error('WARN: Could not find ' + p.name + ' start.');
    continue;
  }
  const endIdx = src.indexOf(p.endAfter, startIdx);
  if (endIdx === -1) {
    console.error('WARN: Could not find ' + p.name + ' end.');
    continue;
  }
  const block = src.slice(startIdx, endIdx);
  const converted = convertBlock(block);
  if (converted !== block) {
    src = src.slice(0, startIdx) + converted + src.slice(endIdx);
    edits++;
    console.log('  ✓ Converted ' + p.name + ' (' + block.length + ' chars, ' + (block.match(/\n/g) || []).length + ' lines)');
  } else {
    console.log('  - No changes for ' + p.name);
  }
}

// Add marker to prevent re-run
if (edits > 0) {
  src = src.replace('/* HISTORY TITLE V4 FIX */', '/* ORGANIZE CLUSTER PART 2 V4 */\n        /* HISTORY TITLE V4 FIX */');
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. ' + edits + ' page blocks converted.');
console.log('');
console.log('Pattern replacements applied inside each block:');
console.log('  - Text colors (10+ variants) → navy/gray');
console.log('  - Backgrounds (dark surfaces of all opacities) → white cards');
console.log('  - Borders → light navy hairlines');
console.log('  - Coral #FA8059 → orange #FF6B00');
console.log('  - Blue #3B9EFF (used in For Union Members) → navy');
console.log('  - Yellow-tint bgs (old --yellow surface) → white');
console.log('  - Fonts: Barlow Condensed / Space Grotesk / Space Mono → Inter');
console.log('  - CTA buttons: coral+black → orange+white');
console.log('  - Local theme constants (ACCENT, ACCENT_DIM, ACCENT_GLOW) → orange');
console.log('');
console.log('LIKELY NEEDS CLEANUP PASSES:');
console.log('  - Weingarten has collapsible sections with unique styling');
console.log('  - RTW has state-by-state colored map/breakdown');
console.log('  - Caucus has sticky sidebar + progress bar with animations');
console.log('  These features may have missed edge case patterns that will');
console.log('  need a second-pass fix (like organize needed).');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: weingarten + rtw + caucus v4 corporate" && git push');
console.log('');
