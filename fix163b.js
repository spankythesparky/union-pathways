// fix163b.js — Remove ONLY the Sprinkler Fitters card from the trades grid
//
// Sprinkler fitters are organized under UA (Plumbers & Pipefitters), so listing
// them as their own trade card was misleading. This removes ONLY that one line
// from UNION_TRADES.
//
// Everything else stays exactly as it was:
//   - The "Which Trade?" quiz still asks about fire protection (now points to UA only)
//   - All UA locals still listed
//   - The "Fire protection and sprinkler systems" answer still works
//   - All scores remain
//
// Note: this assumes fix163 (the broader removal) was NOT applied. If it was,
// this script will see the SF entry already gone and exit cleanly.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

const oldLine = `      { abbr: "SF", name: "Sprinkler Fitters", full: "United Assoc. Sprinkler Fitters Local 669", website: "www.sprinklerfitters669.org", status: "coming" },\n`;

if (!src.includes(oldLine)) {
  console.error('ERROR: Sprinkler Fitters trade card line not found.');
  console.error('(Was fix163 already applied? If so, the card is already gone.)');
  process.exit(1);
}

src = src.replace(oldLine, () => '');

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Sprinkler Fitters card removed from the trades grid only.');
console.log('Everything else untouched: quiz, scores, UA locals, history prose.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: remove Sprinkler Fitters card from trades grid (kept under UA)" && git push');
console.log('');
