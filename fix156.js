// fix156.js — Add the remaining 5 trade detail pages + flip hub cards to live
//
// Adds 5 new pages:
//   - apprenticeship-iw    (Iron Workers)
//   - apprenticeship-bac   (Bricklayers)
//   - apprenticeship-hfiaw (Insulators)
//   - apprenticeship-iuoe  (Operating Engineers)
//   - apprenticeship-ubc   (Carpenters)
//
// And flips them from live:false → live:true in the hub TRADES array.
//
// Edits:
//   1. validPages array            — add 5 page keys
//   2. scroll-progress candidates  — add 5 root IDs
//   3. SEO metadata map            — add 5 entries
//   4. Hub TRADES array            — flip 5 from live:false to live:true
//   5. Apprenticeship nav button   — extend the "active" check
//   6. Page component blocks       — inject all 5 blocks before trade-history

const fs = require('fs');

const FILE = 'src/App.jsx';
const BLOCKS = [
  { name: 'app_iw_block.txt',    id: 'apprenticeship-iw-root' },
  { name: 'app_bac_block.txt',   id: 'apprenticeship-bac-root' },
  { name: 'app_hfiaw_block.txt', id: 'apprenticeship-hfiaw-root' },
  { name: 'app_iuoe_block.txt',  id: 'apprenticeship-iuoe-root' },
  { name: 'app_ubc_block.txt',   id: 'apprenticeship-ubc-root' }
];

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
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

// Idempotency
if (src.includes('id="apprenticeship-iw-root"') || src.includes("'apprenticeship-iw'")) {
  console.error('ERROR: Pages already exist. Aborting.');
  process.exit(1);
}

// ============================================================
// Edit 1: validPages array
// ============================================================
const validPagesOld = `'apprenticeship','apprenticeship-ibew','apprenticeship-ua','apprenticeship-smart','apprenticeship-iuec'];`;
const validPagesNew = `'apprenticeship','apprenticeship-ibew','apprenticeship-ua','apprenticeship-smart','apprenticeship-iuec','apprenticeship-iw','apprenticeship-bac','apprenticeship-hfiaw','apprenticeship-iuoe','apprenticeship-ubc'];`;

if (!src.includes(validPagesOld)) {
  console.error('ERROR: Could not find validPages array. Aborting.');
  process.exit(1);
}
src = src.replace(validPagesOld, validPagesNew);

// ============================================================
// Edit 2: scroll-progress candidates
// ============================================================
const candidatesOld = `'apprenticeship-iuec-root','benefits-root'];`;
const candidatesNew = `'apprenticeship-iuec-root','apprenticeship-iw-root','apprenticeship-bac-root','apprenticeship-hfiaw-root','apprenticeship-iuoe-root','apprenticeship-ubc-root','benefits-root'];`;

if (!src.includes(candidatesOld)) {
  console.error('ERROR: Could not find scroll candidates array. Aborting.');
  process.exit(1);
}
src = src.replace(candidatesOld, candidatesNew);

// ============================================================
// Edit 3: SEO metadata
// ============================================================
const seoAnchor = `      'apprenticeship-iuec': { title: "IUEC EIAT — Elevator Industry Aptitude Test Breakdown · Union Pathways", desc: "Full breakdown of the NEIEP Elevator Industry Aptitude Test for IUEC apprenticeships. Arithmetic, reading comprehension, mechanical comprehension, the tool recognition assessment, the four-tier scoring system, and how to prep." },`;

const seoNew = seoAnchor + `
      'apprenticeship-iw': { title: "Iron Workers Aptitude Test — Full Breakdown · Union Pathways", desc: "What's actually on the Iron Workers apprenticeship aptitude test. Math (often including trig), reading comprehension, the physical assessment with beam-walking and ladder climbing, scoring, application cycles, and the four trades within iron working — Structural, Reinforcing, Ornamental, and Rigging." },
      'apprenticeship-bac': { title: "BAC Bricklayers Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the BAC Bricklayers and Allied Craftworkers apprenticeship test. Math, reading, the physical assessment, the 12-week unpaid pre-apprenticeship some locals require, and the seven crafts within BAC — bricklayer, stone mason, PCC, tile setter, tile finisher, terrazzo, plasterer." },
      'apprenticeship-hfiaw': { title: "HFIAW Insulators Aptitude Test — Full Breakdown · Union Pathways", desc: "Full breakdown of the Heat & Frost Insulators apprenticeship aptitude test. Reading comprehension, math, mechanical reasoning, physical and drug screen, the retake bonus several locals offer, and what insulators actually do — industrial, commercial, cryogenics, and asbestos abatement work." },
      'apprenticeship-iuoe': { title: "IUOE Operating Engineers Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the IUOE Operating Engineers aptitude test. Math, reading, mechanical reasoning, the WorkKeys path some locals use (Local 324, others), CDL requirements, the three IUOE branches — Hoisting, Stationary, and Heavy Equipment Mechanic — and the elite Local 150 training facility." },
      'apprenticeship-ubc': { title: "UBC Carpenters Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the UBC Carpenters apprenticeship test, with detail on all 11 trade specialties — General Carpenter, Concrete Form Builder, Floor Coverer, Mill Cabinet, Millwright (the most technical), Pile Driver, Lathing, Drywall Finisher, Insulation Applicator, Bridge/Dock/Wharf Carpenter, Maintenance Carpenter." },`;

if (!src.includes(seoAnchor)) {
  console.error('ERROR: Could not find SEO anchor. Aborting.');
  process.exit(1);
}
src = src.replace(seoAnchor, () => seoNew);

// ============================================================
// Edit 4: Flip 5 hub cards from live:false to live:true
// ============================================================
// Each is a single-line replacement. We do them one at a time for safety.
const hubFlips = [
  {
    old: `            { key:'iw', name:'Iron Workers', test:'Ironworker Apprenticeship Aptitude Test', sections:'Reading Comprehension · Math (algebra, geometry)', live:false, color:'#9D4A4A', sub:'Coming soon' },`,
    new: `            { key:'iw', name:'Iron Workers', test:'Ironworker Apprenticeship Aptitude Test', sections:'Math · Reading · Physical Assessment', live:true, color:'#9D4A4A', sub:'2 written sections + physical · 70%+ to pass · 1-2 yr cycles' },`
  },
  {
    old: `            { key:'bac', name:'BAC Bricklayers', test:'Local-administered aptitude assessment', sections:'Math · Reading · Mechanical', live:false, color:'#9D4A6B', sub:'Coming soon' },`,
    new: `            { key:'bac', name:'BAC Bricklayers', test:'Local-administered aptitude assessment', sections:'Math · Reading · Physical · Often 12-wk pre-apprenticeship', live:true, color:'#9D4A6B', sub:'7 craft tracks · oldest North American union (1865)' },`
  },
  {
    old: `            { key:'hfiaw', name:'Insulators (HFIAW)', test:'AWIU Apprenticeship Aptitude Test', sections:'Reading · Mechanical · Math', live:false, color:'#7C4A9D', sub:'Coming soon' },`,
    new: `            { key:'hfiaw', name:'Insulators (HFIAW)', test:'Local Aptitude Test + Interview', sections:'Reading · Math · Mechanical · Physical', live:true, color:'#7C4A9D', sub:'Some locals award retake bonus · 4-yr program · 160 cls hrs/yr' },`
  },
  {
    old: `            { key:'iuoe', name:'IUOE Operating Engineers', test:'NCCER Trade Assessments', sections:'Math · Reading · Spatial · Mechanical', live:false, color:'#4A9D7C', sub:'Coming soon' },`,
    new: `            { key:'iuoe', name:'IUOE Operating Engineers', test:'Local test or ACT WorkKeys', sections:'Math · Reading · Mechanical · Often CDL pre-req', live:true, color:'#4A9D7C', sub:'3 branches: Hoisting, Stationary, Mechanics · seasonal up north' },`
  },
  {
    old: `            { key:'ubc', name:'UBC Carpenters', test:'Carpentry Math Test + Local screening', sections:'Math · Reading · Mechanical', live:false, color:'#9D7C4A', sub:'Coming soon' },`,
    new: `            { key:'ubc', name:'UBC Carpenters', test:'Regional Council aptitude test', sections:'Math · Reading · Mechanical · Spatial', live:true, color:'#9D7C4A', sub:'11 trade specialties · 70-80% to pass · 500K+ members' },`
  }
];

for (const flip of hubFlips) {
  if (!src.includes(flip.old)) {
    console.error('ERROR: Could not find hub flip line for: ' + flip.old.slice(0, 60));
    process.exit(1);
  }
  src = src.replace(flip.old, () => flip.new);
}

// ============================================================
// Edit 5: Extend the "active" check on the Apprenticeship nav button
// (so the button stays highlighted on the new pages too)
// ============================================================
const navOld = `<button className={\`nav-link \${page===\"apprenticeship\"||page===\"apprenticeship-ibew\"||page===\"apprenticeship-ua\"||page===\"apprenticeship-smart\"||page===\"apprenticeship-iuec\"?\"active\":\"\"}\`} onClick={() => setPage(\"apprenticeship\")}>{lang===\"es\" ? \"Aprendizaje\" : lang===\"pl\" ? \"Praktyka\" : \"Apprenticeship\"}</button>`;
const navNew = `<button className={\`nav-link \${page===\"apprenticeship\"||page===\"apprenticeship-ibew\"||page===\"apprenticeship-ua\"||page===\"apprenticeship-smart\"||page===\"apprenticeship-iuec\"||page===\"apprenticeship-iw\"||page===\"apprenticeship-bac\"||page===\"apprenticeship-hfiaw\"||page===\"apprenticeship-iuoe\"||page===\"apprenticeship-ubc\"?\"active\":\"\"}\`} onClick={() => setPage(\"apprenticeship\")}>{lang===\"es\" ? \"Aprendizaje\" : lang===\"pl\" ? \"Praktyka\" : \"Apprenticeship\"}</button>`;

if (!src.includes(navOld)) {
  console.error('ERROR: Could not find Apprenticeship nav button. Aborting.');
  process.exit(1);
}
src = src.replace(navOld, () => navNew);

// ============================================================
// Edit 6: Page component blocks
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
// Final
// ============================================================
if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Final 5 trade pages added:');
console.log('  Iron Workers:           /?page=apprenticeship-iw');
console.log('  BAC Bricklayers:        /?page=apprenticeship-bac');
console.log('  HFIAW Insulators:       /?page=apprenticeship-hfiaw');
console.log('  IUOE Operating Eng:     /?page=apprenticeship-iuoe');
console.log('  UBC Carpenters:         /?page=apprenticeship-ubc');
console.log('');
console.log('Hub cards flipped: all 5 now show as Live (no more Coming Soon).');
console.log('Nav button "active" check extended to all 10 apprenticeship pages.');
console.log('');
console.log('Now run:');
console.log('  rm app_*_block.txt && git add src/App.jsx && git commit -m "feat: add remaining 5 trade apprenticeship detail pages" && git push');
console.log('');
