// fix168.js — Add home-v2 design preview page
//
// Builds a redesigned home page at /?page=home-v2 for visual review.
// Does NOT change the current home page at /?page=home.
// Not linked in navigation — accessed only via direct URL.
//
// Easy to revert: delete the page block + the validPages entry. Nothing else touched.

const fs = require('fs');
const FILE = 'src/App.jsx';
const BLOCK = 'home_v2_block.txt';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}
if (!fs.existsSync(BLOCK)) {
  console.error('ERROR: ' + BLOCK + ' not found. Both files needed.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes("'home-v2'") || src.includes('page === "home-v2"')) {
  console.error('ERROR: home-v2 already exists. Aborting.');
  process.exit(1);
}

// ============================================================
// EDIT 1: Add 'home-v2' to validPages array
// Anchor on the current validPages array
// ============================================================
const validOld = `const validPages = ['home',`;
const validNew = `const validPages = ['home','home-v2',`;

if (!src.includes(validOld)) {
  console.error('ERROR: Could not find validPages array. Aborting.');
  process.exit(1);
}
src = src.replace(validOld, () => validNew);

// ============================================================
// EDIT 2: Insert the page block right after the closing of the home page
// Anchor: the </>)} that closes home, before the checklist page block
// ============================================================
const blockText = fs.readFileSync(BLOCK, 'utf8');

const insertAnchor = `        </>)}

        {/* ── JOIN A UNION CHECKLIST PAGE ── */}
        {page === "checklist" && (`;

const insertNew = `        </>)}

` + blockText + `
        {/* ── JOIN A UNION CHECKLIST PAGE ── */}
        {page === "checklist" && (`;

if (!src.includes(insertAnchor)) {
  console.error('ERROR: Could not find home → checklist insertion anchor. Aborting.');
  process.exit(1);
}
src = src.replace(insertAnchor, () => insertNew);

if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. home-v2 page added.');
console.log('  - Access: unionpathways.com/?page=home-v2');
console.log('  - Existing home page (/?page=home) is unchanged');
console.log('  - Not linked anywhere — direct URL access only');
console.log('');
console.log('Now run:');
console.log('  rm home_v2_block.txt && git add src/App.jsx && git commit -m "feat: home-v2 design preview page" && git push');
console.log('');
