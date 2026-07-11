// fix150.js — Add IUEC (Elevator Constructors) history page
//
// Modifies src/App.jsx in 5 places:
//   1. validPages array            — adds 'history-iuec'
//   2. scroll-progress candidates  — adds 'iuec-history-root'
//   3. SEO metadata map            — adds 'history-iuec' entry
//   4. nav dropdown menu           — flips IUEC entry from "coming soon" to live
//   5. page block                  — inserts the full IUEC page before trade-history

const fs = require('fs');
const path = require('path');

const FILE = 'src/App.jsx';
const BLOCK_FILE = 'iuec_block.txt';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run this script from the project root (~/Desktop/union-pathway).');
  process.exit(1);
}
if (!fs.existsSync(BLOCK_FILE)) {
  console.error('ERROR: iuec_block.txt not found. Make sure both fix150.js AND iuec_block.txt are in the project root.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;
const iuecBlock = fs.readFileSync(BLOCK_FILE, 'utf8');

// Idempotency check — bail if already applied
if (src.includes('history-iuec') || src.includes('iuec-history-root')) {
  console.error('ERROR: IUEC history page appears to already exist in App.jsx. Aborting to avoid duplicates.');
  process.exit(1);
}

// ============================================================
// Edit 1: Add 'history-iuec' to validPages array
// ============================================================
const validPagesOld = `'history','trade-history','history-ibew','history-ua','history-smart','history-bac','history-ufcw','history-iron','history-insul'`;
const validPagesNew = `'history','trade-history','history-ibew','history-ua','history-smart','history-bac','history-ufcw','history-iron','history-insul','history-iuec'`;

if (!src.includes(validPagesOld)) {
  console.error('ERROR: Could not find validPages array. Aborting.');
  process.exit(1);
}
src = src.replace(validPagesOld, validPagesNew);

// ============================================================
// Edit 2: Add 'iuec-history-root' to scroll-progress candidates
// ============================================================
const candidatesOld = `const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','ufcw-history-root','iron-history-root','insul-history-root','benefits-root'];`;
const candidatesNew = `const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','ufcw-history-root','iron-history-root','insul-history-root','iuec-history-root','benefits-root'];`;

if (!src.includes(candidatesOld)) {
  console.error('ERROR: Could not find scroll candidates array. Aborting.');
  process.exit(1);
}
src = src.replace(candidatesOld, candidatesNew);

// ============================================================
// Edit 3: Add SEO metadata for 'history-iuec' (insert after 'history-insul')
// ============================================================
const seoAnchor = `      'history-insul': { title: "Insulators History — Wrapping the Pipes · Union Pathways", desc: "The full history of the International Association of Heat and Frost Insulators and Allied Workers (AWIU) — from the 1903 St. Louis founding, through World War II Pearl Harbor reconstruction, the Selikoff asbestos studies at Mount Sinai, the 1990s name change from Asbestos Workers, and the modern push for the Federal Mechanical Insulation Act." },`;
const seoNew = seoAnchor + `\n      'history-iuec': { title: "IUEC History — Going Up · Union Pathways", desc: "The full history of the International Union of Elevator Constructors — from the 1854 Otis Crystal Palace demonstration and the July 1901 Griswold Hotel founding through the Atlantic City Plan, the Christensen era, and the path to becoming the highest-paid building trade in the United States." },`;

if (!src.includes(seoAnchor)) {
  console.error('ERROR: Could not find SEO anchor (history-insul entry). Aborting.');
  process.exit(1);
}
src = src.replace(seoAnchor, seoNew);

// ============================================================
// Edit 4: Flip IUEC entry from "coming soon" to live in nav dropdown
// ============================================================
const navOld = `                    {key:'IUEC', name:'IUEC — Elevator Constructors'},`;
const navNew = `                    {key:'IUEC', name:'IUEC — Elevator Constructors', page:'history-iuec', live:true},`;

if (!src.includes(navOld)) {
  console.error('ERROR: Could not find nav menu IUEC entry. Aborting.');
  process.exit(1);
}
src = src.replace(navOld, navNew);

// ============================================================
// Edit 5: Insert the IUEC page block before the trade-history block
// ============================================================
const insertAnchor = `        {page === "trade-history" && (`;

if (!src.includes(insertAnchor)) {
  console.error('ERROR: Could not find trade-history insertion point. Aborting.');
  process.exit(1);
}

// Verify only one occurrence of the anchor
const anchorCount = src.split(insertAnchor).length - 1;
if (anchorCount !== 1) {
  console.error('ERROR: Expected exactly 1 trade-history anchor, found ' + anchorCount + '. Aborting.');
  process.exit(1);
}

src = src.replace(insertAnchor, iuecBlock + insertAnchor);

// ============================================================
// Final verification
// ============================================================
if (src === original) {
  console.error('ERROR: No changes were made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Added IUEC (Elevator Constructors) history page:');
console.log('  1. validPages array        - history-iuec added');
console.log('  2. scroll candidates       - iuec-history-root added');
console.log('  3. SEO metadata            - history-iuec entry added');
console.log('  4. nav dropdown            - IUEC flipped from coming-soon to live');
console.log('  5. page component          - inserted before trade-history block');
console.log('');
console.log('Now run:');
console.log('  rm iuec_block.txt && git add src/App.jsx && git commit -m "feat: add IUEC (Elevator Constructors) history page" && git push');
console.log('');
