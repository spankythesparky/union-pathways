// fix178.js — Add IUPAT to the inline trade-selector pills on the home page
//
// Bug: there's a hardcoded inline trade-pills array (separate from
// UNION_TRADES) that drives the trade-picker shown directly above the
// search input on the home page. fix177 only updated UNION_TRADES (which
// powers the All-Trades DROPDOWN) and the lookup ternaries — not these
// inline pills. As a result, the home-page search has no IUPAT pill, and
// users can't pick IUPAT to search/map without going through the dropdown.
//
// Fix: insert one IUPAT entry into the inline pill list, between UBC
// (Carpenters) and the closing of the array.
//
// Idempotency: detects abbr "IUPAT" inside the inline pill section.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

// Idempotency check: the inline pill list ends with `{ abbr: "UBC", label: "Carpenters", ... },`.
// If we've already inserted IUPAT, the pill array contains an `abbr: "IUPAT"` entry.
const oldPillsTail = `                  { abbr: "UBC",   label: "Carpenters",          color: "#8b5cf6" },
                ].map(trade => (`;
const newPillsTail = `                  { abbr: "UBC",   label: "Carpenters",          color: "#8b5cf6" },
                  { abbr: "IUPAT", label: "Painters",             color: "#ec4899" },
                ].map(trade => (`;

if (src.includes(newPillsTail) || (src.includes('abbr: "IUPAT", label: "Painters"') && src.includes('].map(trade => ('))) {
  console.log('Already applied — IUPAT pill is already in the inline trade selector.');
  process.exit(0);
}

if (!src.includes(oldPillsTail)) {
  console.error('ERROR: could not find inline trade-pills tail anchor');
  console.error('       (looking for the UBC entry immediately followed by `].map(trade => (`)');
  process.exit(1);
}

src = src.replace(oldPillsTail, newPillsTail);

fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('    Added IUPAT pill to the home-page trade selector');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: add IUPAT pill to home-page trade selector" && git push');
console.log('');
