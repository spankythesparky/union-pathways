// fix154.js — Apprenticeship aptitude test hub + 4 detail pages
//
// Adds 5 new pages to the site:
//   - apprenticeship           (hub: 9-trade grid, 4 live + 5 "coming soon")
//   - apprenticeship-ibew      (NJATC test detail)
//   - apprenticeship-ua        (GAN test detail)
//   - apprenticeship-smart     (Sheet metal test detail)
//   - apprenticeship-iuec      (EIAT detail)
//
// Edits to App.jsx:
//   1. validPages array            — add 5 page keys
//   2. scroll-progress candidates  — add 5 root IDs
//   3. SEO metadata map            — add 5 entries
//   4. Page component blocks       — inject all 5 blocks before trade-history

const fs = require('fs');

const FILE = 'src/App.jsx';
const BLOCKS = [
  { name: 'app_hub_block.txt',   id: 'apprenticeship-root' },
  { name: 'app_ibew_block.txt',  id: 'apprenticeship-ibew-root' },
  { name: 'app_ua_block.txt',    id: 'apprenticeship-ua-root' },
  { name: 'app_smart_block.txt', id: 'apprenticeship-smart-root' },
  { name: 'app_iuec_block.txt',  id: 'apprenticeship-iuec-root' }
];

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
for (const b of BLOCKS) {
  if (!fs.existsSync(b.name)) {
    console.error('ERROR: ' + b.name + ' not found. All 5 block files must be in the project root.');
    process.exit(1);
  }
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency check
if (src.includes("'apprenticeship'") || src.includes('id="apprenticeship-root"')) {
  console.error('ERROR: Apprenticeship pages appear to already exist. Aborting.');
  process.exit(1);
}

// ============================================================
// Edit 1: validPages array
// ============================================================
const validPagesOld = `'organize-contractor','rtw'];`;
const validPagesNew = `'organize-contractor','rtw','apprenticeship','apprenticeship-ibew','apprenticeship-ua','apprenticeship-smart','apprenticeship-iuec'];`;

if (!src.includes(validPagesOld)) {
  console.error('ERROR: Could not find validPages array. Aborting.');
  process.exit(1);
}
src = src.replace(validPagesOld, validPagesNew);

// ============================================================
// Edit 2: scroll-progress candidates
// ============================================================
const candidatesOld = `'iuec-history-root','rtw-root','benefits-root'];`;
const candidatesNew = `'iuec-history-root','rtw-root','apprenticeship-root','apprenticeship-ibew-root','apprenticeship-ua-root','apprenticeship-smart-root','apprenticeship-iuec-root','benefits-root'];`;

if (!src.includes(candidatesOld)) {
  console.error('ERROR: Could not find scroll candidates array. Aborting.');
  process.exit(1);
}
src = src.replace(candidatesOld, candidatesNew);

// ============================================================
// Edit 3: SEO metadata
// ============================================================
const seoAnchor = `      'rtw': { title: "Right to Work — The Price of \\"Freedom\\" to Opt Out · Union Pathways", desc: "An interactive investigation into right-to-work laws across the 50 states. Compare wages, union density, workplace fatality rates, household income, poverty, and uninsured rates between RTW and non-RTW states. State-by-state map, head-to-head comparisons, dashboard, and 80-year timeline from 1944 to Michigan's 2024 repeal." },`;

const seoNew = seoAnchor + `
      'apprenticeship': { title: "Apprenticeship Aptitude Tests — How to Get In · Union Pathways", desc: "What's actually on every union apprenticeship aptitude test, by trade. IBEW NJATC, UA GAN, SMART Sheet Metal, IUEC EIAT, and more. Test sections, scoring, study tips, and the things nobody tells you. No prep-course paywall." },
      'apprenticeship-ibew': { title: "IBEW Aptitude Test (NJATC) — Full Breakdown · Union Pathways", desc: "Everything that's actually on the IBEW Inside Wireman aptitude test. Algebra & functions, reading comprehension, scoring on the 1-9 scale, study resources, and what the interview actually asks. Free, no upsell." },
      'apprenticeship-ua': { title: "UA Plumbers & Pipefitters Aptitude Test (GAN) — Full Breakdown · Union Pathways", desc: "The full Piping Industry Entry Level Assessment broken down by section. Reading, math, mechanical, spatial, problem solving — what's tested, scoring, study tips, and the application window trap nobody warns you about." },
      'apprenticeship-smart': { title: "SMART Sheet Metal Apprenticeship Test — Full Breakdown · Union Pathways", desc: "What's on the SMART Sheet Metal apprenticeship test — math, reading, mechanical reasoning, spatial visualization. Local-by-local variation including SMART Local 36, Southern California JATC, Western Washington, and Local 20." },
      'apprenticeship-iuec': { title: "IUEC EIAT — Elevator Industry Aptitude Test Breakdown · Union Pathways", desc: "Full breakdown of the NEIEP Elevator Industry Aptitude Test for IUEC apprenticeships. Arithmetic, reading comprehension, mechanical comprehension, the tool recognition assessment, the four-tier scoring system, and how to prep." },`;

if (!src.includes(seoAnchor)) {
  console.error('ERROR: Could not find SEO anchor. Aborting.');
  process.exit(1);
}
src = src.replace(seoAnchor, () => seoNew);

// ============================================================
// Edit 4: Page component blocks
// ============================================================
const insertAnchor = `        {page === "trade-history" && (`;

if (!src.includes(insertAnchor)) {
  console.error('ERROR: Could not find trade-history insertion point. Aborting.');
  process.exit(1);
}

let combined = '';
for (const b of BLOCKS) {
  combined += fs.readFileSync(b.name, 'utf8');
}

src = src.replace(insertAnchor, () => combined + insertAnchor);

// ============================================================
// Final verification
// ============================================================
if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Apprenticeship pages added:');
console.log('  Hub:  /?page=apprenticeship');
console.log('  IBEW: /?page=apprenticeship-ibew');
console.log('  UA:   /?page=apprenticeship-ua');
console.log('  SMART: /?page=apprenticeship-smart');
console.log('  IUEC: /?page=apprenticeship-iuec');
console.log('');
console.log('Now run:');
console.log('  rm app_*_block.txt && git add src/App.jsx && git commit -m "feat: apprenticeship aptitude test hub + 4 trade detail pages" && git push');
console.log('');
console.log('Note: This fix adds the pages but does NOT add nav links yet.');
console.log('Pages are reachable directly via URL. We can add a nav button or homepage CTA in a follow-up.');
console.log('');
