// fix-nav-hover-and-footer.js
//
// Two related fixes:
//   1. .nav-dropdown-btn hover was invisible (white text on white-ish bg)
//   2. Footer at bottom was still dark

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* NAV HOVER + FOOTER V4 */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

let editCount = 0;

// ═══════════════════════════════════════════════════════════════
// 1. Fix .nav-dropdown-btn — the actual dropdown tabs in the nav
// (Get Started, Apprenticeship, Membership, Resources, History, About)
// Currently hover renders invisible.
// ═══════════════════════════════════════════════════════════════
const dropdownBtnOld = /\.nav-dropdown-btn \{[^}]+\}/;
const dropdownBtnNew = `.nav-dropdown-btn {
          background: transparent; border: none;
          padding: 8px 14px;
          color: #072554;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          letter-spacing: -0.005em;
          text-transform: none;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
          display: inline-flex; align-items: center; gap: 4px;
        }`;

if (dropdownBtnOld.test(src)) {
  src = src.replace(dropdownBtnOld, () => dropdownBtnNew);
  editCount++;
}

// Update hover state
if (src.includes('.nav-dropdown-btn:hover')) {
  src = src.replace(/\.nav-dropdown-btn:hover[^}]+\}/, () => `.nav-dropdown-btn:hover { color: #FF6B00; background: rgba(255,107,0,0.05); }`);
  editCount++;
}

// Update active state
if (src.includes('.nav-dropdown-btn.active')) {
  src = src.replace(/\.nav-dropdown-btn\.active[^}]+\}/, () => `.nav-dropdown-btn.active { color: #FF6B00; font-weight: 600; }`);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 2. Update the .dropdown-footer CSS (the inside-of-dropdown footer)
// to match the light theme (currently likely dark)
// ═══════════════════════════════════════════════════════════════
if (/\.dropdown-footer \{/.test(src)) {
  src = src.replace(/\.dropdown-footer \{[^}]+\}/, () => `.dropdown-footer {
          border-top: 1px solid rgba(7,37,84,0.08);
          padding: 12px 14px 4px;
          margin-top: 8px;
          font-size: 11px;
          color: #5A6478;
        }`);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 3. FOOTER CSS — light theme
// ═══════════════════════════════════════════════════════════════
const footerCssOld = `        footer {
          border-top: 1px solid var(--wire);
          padding: 20px 40px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: var(--muted);
          flex-wrap: wrap; gap: 8px;
        }`;

const footerCssNew = `        /* NAV HOVER + FOOTER V4 */
        footer {
          background: #ffffff;
          border-top: 1px solid rgba(7,37,84,0.08);
          padding: 32px 40px;
          display: flex; justify-content: space-between; align-items: center;
          font-family: 'Inter', sans-serif;
          font-size: 12px; color: #5A6478;
          flex-wrap: wrap; gap: 12px;
        }`;

if (src.includes(footerCssOld)) {
  src = src.replace(footerCssOld, () => footerCssNew);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 4. FOOTER DISCLAIMER TEXT — fix the hardcoded dark-theme color
// The disclaimer paragraph currently has color:"rgba(160,180,196,0.5)"
// which is a light-blue-gray meant for dark backgrounds
// ═══════════════════════════════════════════════════════════════
const disclaimerOld = `<div style={{fontSize:"11px", color:"rgba(160,180,196,0.5)", maxWidth:"700px", margin:"0 auto", lineHeight:1.6}}>`;
const disclaimerNew = `<div style={{fontSize:"11px", color:"#5A6478", maxWidth:"700px", margin:"0 auto", lineHeight:1.6, opacity:0.85}}>`;

if (src.includes(disclaimerOld)) {
  src = src.replace(disclaimerOld, () => disclaimerNew);
  editCount++;
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + editCount + ' fixes:');
console.log('  - Nav dropdown buttons now navy, orange hover (bug fixed)');
console.log('  - Nav dropdown active state now orange');
console.log('  - Dropdown-internal footer restyled');
console.log('  - Site footer: white background, subtle border, navy-gray text');
console.log('  - Disclaimer paragraph color fixed');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: nav dropdown hover + footer light theme" && git push');
console.log('');
