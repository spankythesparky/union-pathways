// fix187.js
// Remove "Alassaf" from the About page — h2 heading and bio openings (en/es/pl).
// Single global replace covers all of them since "Noah Alassaf" always
// appears as that exact two-word pair on the page.
// Idempotent: re-running is safe.

const fs = require('fs');
const PATH = 'src/App.jsx';

if (!fs.existsSync(PATH)) {
  console.error(`✗ ${PATH} not found. Run this from ~/Desktop/union-pathway.`);
  process.exit(1);
}

let code = fs.readFileSync(PATH, 'utf8');

const before = (code.match(/Noah Alassaf/g) || []).length;
if (before === 0) {
  console.log('✓ fix187 already applied — no "Noah Alassaf" instances remain.');
  process.exit(0);
}

code = code.split('Noah Alassaf').join('Noah');
fs.writeFileSync(PATH, code);

console.log(`✓ Replaced ${before} instance(s) of "Noah Alassaf" → "Noah"`);
console.log('  Covers: h2 heading + English/Spanish/Polish bio openings.');

// Safety net: catch any standalone "Alassaf" elsewhere
const stragglers = (code.match(/Alassaf/g) || []).length;
if (stragglers > 0) {
  console.log('');
  console.log(`⚠ ${stragglers} standalone "Alassaf" reference(s) still remain. Run:`);
  console.log('  grep -n "Alassaf" src/App.jsx');
  console.log('  Share the output and I will write a follow-up.');
} else {
  console.log('✓ No remaining "Alassaf" anywhere in src/App.jsx.');
}

console.log('');
console.log('Next: git add src/App.jsx && git commit -m "chore(about): drop surname" && git push');
