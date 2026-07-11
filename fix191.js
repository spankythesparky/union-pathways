// fix191.js — Correct IBEW Local 124 city/state
//
// Bug: IBEW Local 124's local card and search results show "Kansas City, KS"
// but the local is actually in Kansas City, Missouri (the address field is
// already correct: "301 E 103rd Terrace, Kansas City, MO 64114"). The city
// and state fields were entered wrong.
//
// Fix: change `city: "Kansas city"` → `city: "Kansas City"` (also fixes
// the lowercase 'c' typo) and `state: "KS"` → `state: "MO"`.
//
// Idempotency: detects the corrected line and exits cleanly.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

const oldEntry = `{ id: 10124, name: "IBEW Local 124", city: "Kansas city", state: "KS", phone: "(816) 942-7500", website: "ibew124.org", email: "ibew@ibewlocal124.org", lat: 39.146520, lng: -94.814833, address: "301 E 103rd Terrace, Kansas City, MO 64114" }`;

const newEntry = `{ id: 10124, name: "IBEW Local 124", city: "Kansas City", state: "MO", phone: "(816) 942-7500", website: "ibew124.org", email: "ibew@ibewlocal124.org", lat: 39.146520, lng: -94.814833, address: "301 E 103rd Terrace, Kansas City, MO 64114" }`;

if (src.includes(newEntry)) {
  console.log('Already applied — IBEW 124 already shows Kansas City, MO.');
  process.exit(0);
}

if (!src.includes(oldEntry)) {
  console.error('ERROR: could not find IBEW 124 entry to fix');
  console.error('       The line may already have been edited or formatted differently.');
  process.exit(1);
}

src = src.replace(oldEntry, newEntry);
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('    IBEW Local 124: Kansas city, KS → Kansas City, MO');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: IBEW 124 city/state — Kansas City, MO not KS" && git push');
console.log('');
