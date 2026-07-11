// fix179.js — Add IUPAT to the global interactive map
//
// What this fixes:
//   The "Every Union Local. One Map." iframe on the home page loads a
//   completely separate file at /public/map.html. That file pre-bakes all
//   the locals into a JS array (TRADES) at build time. fix177 only updated
//   App.jsx — it didn't touch map.html — so IUPAT locals don't show on the
//   global map.
//
// Changes made by this script:
//   1. Reads the IUPAT trade entry from `iupat_trade_entry.json` (sibling
//      file — must sit next to fix179.js).
//   2. Inserts that trade entry into the TRADES array in
//      public/map.html, right before the closing `];`.
//   3. Updates the popup template in map.html to display a tradeType chip
//      beneath city/state when `local.tradeType` is non-empty (only IUPAT
//      locals have this field — other trades render unchanged).
//   4. Updates the header counter from "1433" to "1696" (1433 + 263).
//   5. Updates src/App.jsx's home-page iframe count text from "1,460" to
//      "1,720" (and Spanish/Polish copies).
//
// Idempotency: detects "IUPAT_LOCALS" in map.html and exits cleanly.
//
// Reads:
//   - public/map.html (in current working dir, relative to project root)
//   - src/App.jsx
//   - iupat_trade_entry.json (sibling of fix179.js)
//
// Writes:
//   - public/map.html  (in place)
//   - src/App.jsx      (in place)

const fs = require('fs');
const path = require('path');

const MAP = 'public/map.html';
const APP = 'src/App.jsx';
const ENTRY = 'iupat_trade_entry.json';

if (!fs.existsSync(MAP)) {
  console.error('ERROR: public/map.html not found.');
  console.error('       Run from project root (~/Desktop/union-pathway).');
  console.error('       If your map.html lives elsewhere, edit MAP at the top of this script.');
  process.exit(1);
}
if (!fs.existsSync(APP)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}
if (!fs.existsSync(ENTRY)) {
  console.error('ERROR: iupat_trade_entry.json not found. Place it next to fix179.js.');
  process.exit(1);
}

let mapHtml = fs.readFileSync(MAP, 'utf8');
let appJsx = fs.readFileSync(APP, 'utf8');
const tradeEntry = fs.readFileSync(ENTRY, 'utf8').trim();

// ----------------------------------------------------------------------------
// Idempotency
// ----------------------------------------------------------------------------
if (mapHtml.includes('"IUPAT_LOCALS"')) {
  console.log('Already applied — IUPAT is already in public/map.html.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 (map.html) — Insert IUPAT trade entry into TRADES array
// ============================================================================
// The TRADES array ends with:
//   ...UBC entries...
//     ]
//   }
// ];
//
// We need to:
//   - Add a comma after the closing `}` of the last existing trade
//   - Insert our new trade entry
//   - Keep the closing `];`

const closeAnchor = `      }\n    ]\n  }\n];`;
if (!mapHtml.includes(closeAnchor)) {
  console.error('ERROR: could not find TRADES array close in map.html');
  process.exit(1);
}

// Replace `  }\n];` with `  },\n<entry>\n];`
const closeReplacement = `      }\n    ]\n  },\n${tradeEntry}\n];`;
mapHtml = mapHtml.replace(closeAnchor, closeReplacement);

// ============================================================================
// EDIT 2 (map.html) — Update popup template to show tradeType chip
// ============================================================================
// Old popup HTML (one of these lines is what we're targeting):
//   <div class="popup-location">${local.city}, ${local.state}</div>
//
// We replace it with the same line PLUS a conditional tradeType chip.
const oldPopupLoc = `<div class="popup-location">\${local.city}, \${local.state}</div>
        \${links.length ? \`<div class="popup-links">\${links.join('')}</div>\` : ''}`;

const newPopupLoc = `<div class="popup-location">\${local.city}, \${local.state}</div>
        \${local.tradeType ? \`<div style="display:inline-block;margin:-4px 0 10px;padding:3px 8px;font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:\${trade.color};background:\${trade.color}1a;border:1px solid \${trade.color}55;border-radius:50px;">\${local.tradeType}</div>\` : ''}
        \${links.length ? \`<div class="popup-links">\${links.join('')}</div>\` : ''}`;

if (!mapHtml.includes(oldPopupLoc)) {
  console.error('ERROR: could not find popup-location anchor in map.html');
  console.error('       Popup template may have changed since this fix was written.');
  process.exit(1);
}
mapHtml = mapHtml.replace(oldPopupLoc, newPopupLoc);

// ============================================================================
// EDIT 3 (map.html) — Update visible-count from 1433 to 1696
// ============================================================================
const oldCount = `<strong id="visible-count">1433</strong>`;
const newCount = `<strong id="visible-count">1696</strong>`;
if (mapHtml.includes(oldCount)) {
  mapHtml = mapHtml.replace(oldCount, newCount);
} else {
  console.warn('  (warning: could not find visible-count="1433" — header counter unchanged)');
}

// ============================================================================
// EDIT 4 (App.jsx) — Update homepage iframe count text
// ============================================================================
const appOldCounts = [
  { lang: 'en', old: '"1,460 Locals Across the US and Canada"', new: '"1,720 Locals Across the US and Canada"' },
  { lang: 'es', old: '"1,460 Locales en EE.UU. y Canada"',     new: '"1,720 Locales en EE.UU. y Canada"' },
  { lang: 'pl', old: '"1,460 Lokale w USA i Kanadzie"',         new: '"1,720 Lokale w USA i Kanadzie"' },
];
let updatedCounts = 0;
for (const c of appOldCounts) {
  if (appJsx.includes(c.old)) {
    appJsx = appJsx.replace(c.old, c.new);
    updatedCounts++;
  }
}
if (updatedCounts === 0) {
  console.warn('  (warning: could not find any "1,460 Locals" text in App.jsx — iframe label unchanged)');
} else {
  console.log(`  Updated iframe label in ${updatedCounts} language(s)`);
}

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(MAP, mapHtml);
fs.writeFileSync(APP, appJsx);

console.log('');
console.log('  ✓ public/map.html updated');
console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - Inserted IUPAT_LOCALS trade entry (263 locals) into TRADES array');
console.log('  - Updated popup template to show tradeType chip');
console.log('  - Updated map header count to 1696');
console.log('  - Updated home-page iframe label to 1,720');
console.log('');
console.log('Now run:');
console.log('  git add public/map.html src/App.jsx && git commit -m "feat: add IUPAT to global map (263 painter locals + tradeType chips)" && git push');
console.log('');
