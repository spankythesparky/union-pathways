// fix151.js — Add Right to Work page (new top-level nav item)
//
// Modifies src/App.jsx in 5 places:
//   1. validPages array            — adds 'rtw'
//   2. scroll-progress candidates  — adds 'rtw-root'
//   3. SEO metadata map            — adds 'rtw' entry
//   4. top-level nav               — adds Right to Work button after Wages
//   5. page block                  — inserts the full RTW page before trade-history

const fs = require('fs');

const FILE = 'src/App.jsx';
const BLOCK_FILE = 'rtw_block.txt';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from the project root (~/Desktop/union-pathway).');
  process.exit(1);
}
if (!fs.existsSync(BLOCK_FILE)) {
  console.error('ERROR: rtw_block.txt not found. Both fix151.js AND rtw_block.txt must be in the project root.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;
const rtwBlock = fs.readFileSync(BLOCK_FILE, 'utf8');

// Idempotency check
if (src.includes('id="rtw-root"') || src.includes("'rtw-root'")) {
  console.error('ERROR: RTW page appears to already exist in App.jsx. Aborting to avoid duplicates.');
  process.exit(1);
}

// ============================================================
// Edit 1: Add 'rtw' to validPages array
// ============================================================
const validPagesOld = `'organize','organize-contractor'];`;
const validPagesNew = `'organize','organize-contractor','rtw'];`;

if (!src.includes(validPagesOld)) {
  console.error('ERROR: Could not find validPages array end. Aborting.');
  process.exit(1);
}
const validPagesCount = src.split(validPagesOld).length - 1;
if (validPagesCount !== 1) {
  console.error('ERROR: Expected exactly 1 validPages match, found ' + validPagesCount + '. Aborting.');
  process.exit(1);
}
src = src.replace(validPagesOld, validPagesNew);

// ============================================================
// Edit 2: Add 'rtw-root' to scroll-progress candidates
// ============================================================
const candidatesOld = `'insul-history-root','iuec-history-root','benefits-root'];`;
const candidatesNew = `'insul-history-root','iuec-history-root','rtw-root','benefits-root'];`;

if (!src.includes(candidatesOld)) {
  console.error('ERROR: Could not find scroll candidates array. Aborting.');
  process.exit(1);
}
src = src.replace(candidatesOld, candidatesNew);

// ============================================================
// Edit 3: Add SEO metadata for 'rtw'
// ============================================================
const seoAnchor = `      'history-iuec': { title: "IUEC History — Going Up · Union Pathways", desc: "The full history of the International Union of Elevator Constructors — from the 1854 Otis Crystal Palace demonstration and the July 1901 Griswold Hotel founding through the Atlantic City Plan, the Christensen era, and the path to becoming the highest-paid building trade in the United States." },`;
const seoNew = seoAnchor + `\n      'rtw': { title: "Right to Work — The Price of \\"Freedom\\" to Opt Out · Union Pathways", desc: "An interactive investigation into right-to-work laws across the 50 states. Compare wages, union density, workplace fatality rates, household income, poverty, and uninsured rates between RTW and non-RTW states. State-by-state map, head-to-head comparisons, dashboard, and 80-year timeline from 1944 to Michigan's 2024 repeal." },`;

if (!src.includes(seoAnchor)) {
  console.error('ERROR: Could not find SEO anchor (history-iuec entry). Aborting.');
  process.exit(1);
}
src = src.replace(seoAnchor, seoNew);

// ============================================================
// Edit 4: Add Right to Work nav button after Wages button
// ============================================================
const navOld = `            <button className={\`nav-link \${page===\"wages\"?\"active\":\"\"}\`} onClick={() => setPage(\"wages\")}>{lang===\"es\" ? \"Salarios\" : lang===\"pl\" ? \"Place\" : \"Wages\"}</button>`;
const navNew = navOld + `\n            <button className={\`nav-link \${page===\"rtw\"?\"active\":\"\"}\`} onClick={() => setPage(\"rtw\")}>{lang===\"es\" ? \"Derecho al Trabajo\" : lang===\"pl\" ? \"Prawo do Pracy\" : \"Right to Work\"}</button>`;

if (!src.includes(navOld)) {
  console.error('ERROR: Could not find Wages nav button. Aborting.');
  process.exit(1);
}
src = src.replace(navOld, navNew);

// ============================================================
// Edit 5: Insert the RTW page block before the trade-history block
// ============================================================
const insertAnchor = `        {page === "trade-history" && (`;

if (!src.includes(insertAnchor)) {
  console.error('ERROR: Could not find trade-history insertion point. Aborting.');
  process.exit(1);
}

const anchorCount = src.split(insertAnchor).length - 1;
if (anchorCount !== 1) {
  console.error('ERROR: Expected exactly 1 trade-history anchor, found ' + anchorCount + '. Aborting.');
  process.exit(1);
}

// Use function callback to avoid $' / $& / $$ special-pattern interpretation
// (the rtwBlock contains literal "$'" in things like value={'$'+m.wage...})
src = src.replace(insertAnchor, () => rtwBlock + insertAnchor);

// ============================================================
// Final verification
// ============================================================
if (src === original) {
  console.error('ERROR: No changes were made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Added Right to Work page:');
console.log('  1. validPages array        - rtw added');
console.log('  2. scroll candidates       - rtw-root added');
console.log('  3. SEO metadata            - rtw entry added');
console.log('  4. top-level nav           - "Right to Work" button added after Wages');
console.log('  5. page component          - inserted before trade-history block');
console.log('');
console.log('Now run:');
console.log('  rm rtw_block.txt && git add src/App.jsx && git commit -m "feat: add Right to Work comparison page" && git push');
console.log('');
