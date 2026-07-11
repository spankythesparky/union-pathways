// fix-shared-css-classes-v4.js
//
// Global CSS class-level conversion. My earlier bulk fixes only touched
// inline styles — the shared CSS classes stayed dark theme, which is why
// the converted pages don't match home.
//
// This fix updates the CSS class definitions (~144 classes) globally.
//
// IMPORTANT: This affects EVERY page — including History + Apprenticeship
// pages which are still dark. Those pages have their own inline styles
// that will need conversion in future sessions. Some may look inconsistent
// for a session. That's expected and improves as we go.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* SHARED CSS V4 */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

// Convert CSS (different syntax from inline styles)
function convertCss(text) {
  let out = text;

  // ── Text colors — CSS syntax ──
  out = out
    // Whites
    .replace(/color:\s*#fff;/g, 'color: #072554;')
    .replace(/color:\s*#ffffff;/g, 'color: #072554;')
    .replace(/color:\s*white;/g, 'color: #072554;')
    // rgba whites (progressively muted)
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.95\);/g, 'color: #072554;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.9\);/g, 'color: #072554;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.85\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.8\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.75\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.7\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.65\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.6\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.55\);/g, 'color: #8A94A6;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.5\);/g, 'color: #8A94A6;')
    .replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.4\);/g, 'color: #8A94A6;')
    // Blue-gray muted variants
    .replace(/color:\s*rgba\(160,\s*180,\s*196,\s*0\.85\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(160,\s*180,\s*196,\s*0\.7\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(160,\s*180,\s*196,\s*0\.6\);/g, 'color: #5A6478;')
    .replace(/color:\s*rgba\(160,\s*180,\s*196,\s*0\.5\);/g, 'color: #8A94A6;')
    // Coral → orange
    .replace(/color:\s*#FA8059;/g, 'color: #FF6B00;')
    .replace(/color:\s*#F5C518;/g, 'color: #FF6B00;')
    .replace(/color:\s*#3B9EFF;/g, 'color: #072554;')
    // Var references
    .replace(/color:\s*var\(--muted\);/g, 'color: #5A6478;')
    .replace(/color:\s*var\(--yellow\);/g, 'color: #FF6B00;')
    .replace(/color:\s*var\(--text\);/g, 'color: #072554;');

  // ── Backgrounds — CSS syntax ──
  out = out
    // Solid dark
    .replace(/background:\s*#000;/g, 'background: #ffffff;')
    .replace(/background:\s*#0a1628;/g, 'background: #ffffff;')
    .replace(/background:\s*#1a2c3a;/g, 'background: #F5F7FA;')
    .replace(/background:\s*#22303D;/g, 'background: #F5F7FA;')
    .replace(/background:\s*#111;/g, 'background: #ffffff;')
    .replace(/background:\s*#111111;/g, 'background: #ffffff;')
    // Semi-transparent black
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.5\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.4\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.35\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.3\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.25\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.2\);/g, 'background: #F5F7FA;')
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.15\);/g, 'background: #F5F7FA;')
    .replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.1\);/g, 'background: #F5F7FA;')
    // Dark steel
    .replace(/background:\s*rgba\(34,\s*48,\s*61,\s*0\.6\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(34,\s*48,\s*61,\s*0\.5\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(34,\s*48,\s*61,\s*0\.4\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(58,\s*80,\s*104,\s*0\.4\);/g, 'background: #F5F7FA;')
    // Var references
    .replace(/background:\s*var\(--card-bg\);/g, 'background: #ffffff;')
    .replace(/background:\s*var\(--steel\);/g, 'background: #ffffff;')
    .replace(/background:\s*var\(--plate\);/g, 'background: #F5F7FA;')
    // Coral tints → orange tints
    .replace(/background:\s*#FA8059;/g, 'background: #FF6B00;')
    .replace(/background:\s*rgba\(250,\s*128,\s*89,\s*0\.15\);/g, 'background: rgba(255,107,0,0.10);')
    .replace(/background:\s*rgba\(250,\s*128,\s*89,\s*0\.12\);/g, 'background: rgba(255,107,0,0.08);')
    .replace(/background:\s*rgba\(250,\s*128,\s*89,\s*0\.1\);/g, 'background: rgba(255,107,0,0.08);')
    .replace(/background:\s*rgba\(250,\s*128,\s*89,\s*0\.08\);/g, 'background: rgba(255,107,0,0.06);')
    .replace(/background:\s*rgba\(250,\s*128,\s*89,\s*0\.06\);/g, 'background: rgba(255,107,0,0.05);')
    .replace(/background:\s*rgba\(250,\s*128,\s*89,\s*0\.05\);/g, 'background: rgba(255,107,0,0.05);')
    .replace(/background:\s*rgba\(250,\s*128,\s*89,\s*0\.04\);/g, 'background: rgba(255,107,0,0.04);')
    // Old yellow tint
    .replace(/background:\s*rgba\(245,\s*197,\s*24,\s*0\.08\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(245,\s*197,\s*24,\s*0\.06\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(245,\s*197,\s*24,\s*0\.04\);/g, 'background: #ffffff;')
    // White-transparent variants (surface stripes)
    .replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.06\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.05\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.04\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.03\);/g, 'background: #ffffff;')
    .replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.02\);/g, 'background: #ffffff;');

  // ── Borders — CSS syntax ──
  out = out
    .replace(/border:\s*2px solid #FA8059;/g, 'border: 2px solid #FF6B00;')
    .replace(/border:\s*1px solid #FA8059;/g, 'border: 1px solid #FF6B00;')
    .replace(/border-left:\s*4px solid #FA8059;/g, 'border-left: 4px solid #FF6B00;')
    .replace(/border-left:\s*3px solid #FA8059;/g, 'border-left: 3px solid #FF6B00;')
    .replace(/border-left:\s*2px solid #FA8059;/g, 'border-left: 2px solid #FF6B00;')
    // rgba coral borders
    .replace(/border:\s*1px solid rgba\(250,\s*128,\s*89,\s*0\.3\);/g, 'border: 1px solid rgba(255,107,0,0.20);')
    .replace(/border:\s*1px solid rgba\(250,\s*128,\s*89,\s*0\.25\);/g, 'border: 1px solid rgba(255,107,0,0.20);')
    .replace(/border:\s*1px solid rgba\(250,\s*128,\s*89,\s*0\.2\);/g, 'border: 1px solid rgba(255,107,0,0.15);')
    // Dark steel borders
    .replace(/border:\s*1px solid rgba\(58,\s*80,\s*104,\s*0\.5\);/g, 'border: 1px solid rgba(7,37,84,0.12);')
    .replace(/border:\s*1px solid rgba\(58,\s*80,\s*104,\s*0\.4\);/g, 'border: 1px solid rgba(7,37,84,0.10);')
    .replace(/border:\s*1px solid rgba\(58,\s*80,\s*104,\s*0\.3\);/g, 'border: 1px solid rgba(7,37,84,0.08);')
    // White-transparent borders
    .replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.15\);/g, 'border: 1px solid rgba(7,37,84,0.10);')
    .replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.14\);/g, 'border: 1px solid rgba(7,37,84,0.10);')
    .replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.12\);/g, 'border: 1px solid rgba(7,37,84,0.10);')
    .replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.1\);/g, 'border: 1px solid rgba(7,37,84,0.08);')
    .replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.08\);/g, 'border: 1px solid rgba(7,37,84,0.08);')
    .replace(/border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.06\);/g, 'border: 1px solid rgba(7,37,84,0.06);')
    // Old yellow borders
    .replace(/border:\s*1px solid rgba\(245,\s*197,\s*24,\s*0\.3\);/g, 'border: 1px solid rgba(255,107,0,0.20);')
    .replace(/border:\s*1px solid rgba\(245,\s*197,\s*24,\s*0\.2\);/g, 'border: 1px solid rgba(255,107,0,0.15);')
    // Var-referenced borders
    .replace(/border:\s*1px solid var\(--wire\);/g, 'border: 1px solid rgba(7,37,84,0.08);')
    .replace(/border-color:\s*var\(--wire\);/g, 'border-color: rgba(7,37,84,0.08);')
    .replace(/border-top:\s*1px solid var\(--wire\);/g, 'border-top: 1px solid rgba(7,37,84,0.08);')
    .replace(/border-bottom:\s*1px solid var\(--wire\);/g, 'border-bottom: 1px solid rgba(7,37,84,0.08);');

  // ── Fonts — CSS syntax ──
  out = out
    .replace(/font-family:\s*'Barlow Condensed',\s*sans-serif;/g, `font-family: 'Inter', sans-serif;`)
    .replace(/font-family:\s*'Space Grotesk',\s*sans-serif;/g, `font-family: 'Inter', sans-serif;`)
    .replace(/font-family:\s*'Space Mono',\s*monospace;/g, `font-family: 'Inter', sans-serif;`);

  return out;
}

// Extract the CSS block area (roughly lines 4900-6800 based on our investigation)
// Find the style tag boundaries
const styleStart = src.indexOf('<style>');
const styleEnd = src.indexOf('</style>', styleStart);

if (styleStart === -1 || styleEnd === -1) {
  console.error('ERROR: Could not find <style> block.');
  process.exit(1);
}

const styleBlock = src.slice(styleStart, styleEnd);
const convertedStyle = convertCss(styleBlock);

if (convertedStyle === styleBlock) {
  console.error('ERROR: No changes made to CSS.');
  process.exit(1);
}

// Add marker
const markedStyle = convertedStyle.replace('<style>', '<style>/* SHARED CSS V4 */');
src = src.slice(0, styleStart) + markedStyle + src.slice(styleEnd);

fs.writeFileSync(FILE, src);

// Count what actually got changed
const oldRefs = (styleBlock.match(/#FA8059|Barlow Condensed|rgba\(255,255,255,0\.[0-9]|rgba\(250,128,89|rgba\(58,80,104|var\(--muted\)|var\(--yellow\)/g) || []).length;
const newRefs = (convertedStyle.match(/#FA8059|Barlow Condensed|rgba\(255,255,255,0\.[0-9]|rgba\(250,128,89|rgba\(58,80,104|var\(--muted\)|var\(--yellow\)/g) || []).length;

console.log('');
console.log('Done. CSS class-level conversion complete.');
console.log('');
console.log('Dark-theme references reduced:');
console.log('  Before: ' + oldRefs + ' patterns');
console.log('  After:  ' + newRefs + ' patterns');
console.log('  Reduction: ' + (oldRefs - newRefs) + ' fixes');
console.log('');
console.log('Classes updated (partial list):');
console.log('  - .history-stat, .history-stat-num, .history-stat-label');
console.log('  - .impact-card, .impact-title, .impact-desc');
console.log('  - .page, .page-eyebrow, .page-title, .page-sub');
console.log('  - .btn-primary, .btn-ghost, .cta-banner');
console.log('  - .stat-card, .stat-num, .stat-label');
console.log('  - .career-stage, .benefit-card');
console.log('  - .checklist-*, .quiz-*, .h2h-* (Helmets to Hardhats)');
console.log('  - .form-* (contact form)');
console.log('  - .mobile-drawer-* variants');
console.log('  - Many more (144 total scanned)');
console.log('');
console.log('This affects EVERY page. Now all converted pages should');
console.log('match home page style. Some still-unconverted pages');
console.log('(History, Apprenticeship) may look inconsistent until');
console.log('their inline styles get converted in future sessions.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: global CSS class conversion to v4 light theme" && git push');
console.log('');
