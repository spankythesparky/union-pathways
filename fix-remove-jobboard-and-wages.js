// fix-remove-jobboard-and-wages.js
//
// Removes Job Board (/jobboard) and Wages (/wages) from the site entirely:
//   1. Removes the two page render blocks from App.jsx (~600 lines total)
//   2. Removes desktop nav dropdown items for Wages + Job Board
//   3. Removes mobile drawer links
//   4. Removes from validPages routing array
//   5. Removes from SEO metadata block
//   6. Replaces the two home feature rows (02 Wages, 03 Job Board)
//      with 02 History and 03 Organize
//   7. Removes entries from scripts/generate-og-pages.mjs PAGES list

const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
// PART 1 — src/App.jsx
// ═══════════════════════════════════════════════════════════════
const APP = 'src/App.jsx';
if (!fs.existsSync(APP)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(APP, 'utf8');
const appOriginal = src;

if (src.includes('/* JOBBOARD-WAGES REMOVED */')) {
  console.error('ERROR: Removal already applied. Aborting.');
  process.exit(1);
}

let edits = 0;

// ── 1a. Remove the wages page render block ──────────────
// The end anchor MUST be unique. Using surrounding context — what comes right after.
const wagesBlockStart = '        {page === "wages" && (() => {';
const wagesStartIdx = src.indexOf(wagesBlockStart);
if (wagesStartIdx === -1) {
  console.error('ERROR: Could not find wages page block start.');
  process.exit(1);
}
// End marker: the SPECIFIC pattern of block-closing followed by veterans block
const wagesEndMarker = '        })()}\n\n        {page === "veterans"';
const wagesEndIdx = src.indexOf(wagesEndMarker, wagesStartIdx);
if (wagesEndIdx === -1) {
  console.error('ERROR: Could not find wages page block end.');
  process.exit(1);
}
// Keep the "        {page === "veterans"..." part — remove only up to just before it
const wagesFullEndIdx = wagesEndIdx + '        })()}\n\n'.length;
const wagesBlockLength = wagesFullEndIdx - wagesStartIdx;
if (wagesBlockLength < 10000 || wagesBlockLength > 40000) {
  console.error('ERROR: Suspect wages block size: ' + wagesBlockLength);
  process.exit(1);
}
src = src.slice(0, wagesStartIdx) + '        {/* JOBBOARD-WAGES REMOVED */}\n' + src.slice(wagesFullEndIdx);
edits++;

// ── 1b. Remove the jobboard page render block ──────────────
const jbBlockStart = '        {page === "jobboard" && (() => {';
const jbStartIdx = src.indexOf(jbBlockStart);
if (jbStartIdx === -1) {
  console.error('ERROR: Could not find jobboard page block start.');
  process.exit(1);
}
// End marker: block-closing followed by the removed marker (since wages is gone now)
const jbEndMarker = '        })()}\n\n        {/* JOBBOARD-WAGES REMOVED */}';
const jbEndIdx = src.indexOf(jbEndMarker, jbStartIdx);
if (jbEndIdx === -1) {
  console.error('ERROR: Could not find jobboard page block end.');
  process.exit(1);
}
// Keep the removed marker in place; remove only jobboard content up to just before it
const jbFullEndIdx = jbEndIdx + '        })()}\n\n'.length;
const jbBlockLength = jbFullEndIdx - jbStartIdx;
if (jbBlockLength < 6000 || jbBlockLength > 25000) {
  console.error('ERROR: Suspect jobboard block size: ' + jbBlockLength);
  process.exit(1);
}
src = src.slice(0, jbStartIdx) + '' + src.slice(jbFullEndIdx);
edits++;

// ── 2. Remove desktop nav dropdown items for Wages + Job Board ──────────────
const wagesNavItem = `                  <div className={\`nav-dropdown-item\${page===\"wages\"?\" active\":\"\"}\`} onMouseDown={() => { setPage(\"wages\"); setLearnOpen(false); }}>
                    <span className=\"nav-dropdown-label\">{lang===\"es\" ? \"Salarios\" : lang===\"pl\" ? \"Place\" : \"Wages\"}</span>
                    <span className=\"nav-dropdown-sub\">{lang===\"es\" ? \"Datos salariales por oficio\" : lang===\"pl\" ? \"Dane place wedlug zawodu\" : \"Wage data by trade\"}</span>
                  </div>
`;
if (src.includes(wagesNavItem)) {
  src = src.replace(wagesNavItem, () => '');
  edits++;
}

const jbNavItem = `                  <div className={\`nav-dropdown-item\${page===\"jobboard\"?\" active\":\"\"}\`} onMouseDown={() => { setPage(\"jobboard\"); setLearnOpen(false); }}>
                    <span className=\"nav-dropdown-label\">{lang===\"es\" ? \"Bolsa de Trabajo\" : lang===\"pl\" ? \"Gielda Pracy\" : \"Job Board\"}</span>
                    <span className=\"nav-dropdown-sub\">{lang===\"es\" ? \"Trabajos sindicales activos\" : lang===\"pl\" ? \"Aktywne oferty pracy\" : \"Active union job postings\"}</span>
                  </div>
`;
if (src.includes(jbNavItem)) {
  src = src.replace(jbNavItem, () => '');
  edits++;
}

// ── 3. Remove mobile drawer buttons ──────────────
const wagesMobileLink = `            <button className={\`mobile-drawer-link\${page===\"wages\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"wages\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Salarios\" : lang===\"pl\" ? \"Place\" : \"Wages\"}</button>
`;
if (src.includes(wagesMobileLink)) {
  src = src.replace(wagesMobileLink, () => '');
  edits++;
}

const jbMobileLink = `            <button className={\`mobile-drawer-link\${page===\"jobboard\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"jobboard\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Bolsa de Trabajo\" : lang===\"pl\" ? \"Gielda Pracy\" : \"Job Board\"}</button>
`;
if (src.includes(jbMobileLink)) {
  src = src.replace(jbMobileLink, () => '');
  edits++;
}

// ── 4. Update nav-dropdown-btn active state (Membership) — remove wages/jobboard from active pages ──────────────
const learnActiveOld = `(page===\"benefits\"||page===\"retirement\"||page===\"veterans\"||page===\"locals\"||page===\"wages\"||page===\"jobboard\")`;
const learnActiveNew = `(page===\"benefits\"||page===\"retirement\"||page===\"veterans\"||page===\"locals\")`;
if (src.includes(learnActiveOld)) {
  // Two places use this string (desktop nav and mobile drawer section)
  src = src.split(learnActiveOld).join(learnActiveNew);
  edits += 2;
}

// ── 5. Update validPages array — remove jobboard, wages ──────────────
const validPagesOld = `'contact','jobboard','wages','organize'`;
const validPagesNew = `'contact','organize'`;
if (src.includes(validPagesOld)) {
  src = src.replace(validPagesOld, () => validPagesNew);
  edits++;
}

// ── 6. Remove SEO metadata entries for jobboard and wages ──────────────
const seoWages = `      jobboard:  { title: \"Union Pathways — Live Job Board\", desc: \"Real-time work outlook reports from union locals across the country. See which halls are busy, steady, or slow before you travel for work.\" },
      wages:     { title: \"Union Pathways — Local Wages Verified by Members\", desc: \"Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place.\" },
`;
if (src.includes(seoWages)) {
  src = src.replace(seoWages, () => '');
  edits++;
}

// ── 7. Replace the two home feature rows (02 Wages → 02 History, 03 Job Board → 03 Organize) ──────────────
const oldFeature02 = `              {
                num:'02', section:'Wages',
                title: lang===\"es\" ? \"Conoce tu valor antes de firmar.\" : lang===\"pl\" ? \"Poznaj swoja wartosc przed podpisaniem.\" : \"Know your worth before you sign.\",
                body: lang===\"es\" ? \"Datos reales de salarios de oficiales presentados por trabajadores en el campo. Organizados por oficio y local. Base, extras, pension, paquete total — el panorama completo.\" : lang===\"pl\" ? \"Prawdziwe dane placowe od pracownikow. Zorganizowane wedlug zawodu i oddzialu.\" : \"Real journeyman wage data submitted by tradespeople in the field. Organized by trade and local. Base, fringe, pension, total package — the whole picture.\",
                link: lang===\"es\" ? \"Ver salarios\" : lang===\"pl\" ? \"Sprawdz stawki\" : \"Check wages\",
                page: 'wages',
                visualNum:'58', visualAccent:'$',
                visualLabel: lang===\"es\" ? \"Mediana / hora\" : lang===\"pl\" ? \"Mediana / godz\" : \"Median / hour\"
              },`;
const newFeature02 = `              {
                num:'02', section:'History',
                title: lang===\"es\" ? \"Conoce la historia de tu oficio.\" : lang===\"pl\" ? \"Poznaj historie swojego zawodu.\" : \"Know the history of your trade.\",
                body: lang===\"es\" ? \"Historias profundas y originales de cada gran oficio sindical de la construccion — IBEW, UA, SMART, Iron Workers, y mas. Escritas para trabajadores por trabajadores.\" : lang===\"pl\" ? \"Oryginalne, dogłebne historie kazdego glownego zwiazku budowlanego — IBEW, UA, SMART, Iron Workers i inne. Napisane dla pracownikow przez pracownikow.\" : \"Original deep-dive histories of every major building-trade union — IBEW, UA, SMART, Iron Workers, and more. Written for workers, by workers.\",
                link: lang===\"es\" ? \"Leer las historias\" : lang===\"pl\" ? \"Przeczytaj historie\" : \"Read the histories\",
                page: 'history',
                visualNum:'11', visualAccent:'',
                visualLabel: lang===\"es\" ? \"Historias de sindicatos\" : lang===\"pl\" ? \"Historii zwiazkowych\" : \"Union histories\"
              },`;
if (src.includes(oldFeature02)) {
  src = src.replace(oldFeature02, () => newFeature02);
  edits++;
}

const oldFeature03 = `              {
                num:'03', section:'Job Board',
                title: lang===\"es\" ? \"Donde esta el trabajo ahora mismo.\" : lang===\"pl\" ? \"Gdzie jest praca teraz.\" : \"Where the work is right now.\",
                body: lang===\"es\" ? \"Puntos calientes, salas lentas, llamadas de tormenta, trabajo de viaje. Reportes reales de miembros activos, organizados por oficio y ubicacion.\" : lang===\"pl\" ? \"Hot spoty, wolne oddzialy, prace burzowe, prace w podrozy. Prawdziwe raporty od czlonkow.\" : \"Hot spots, slow halls, storm calls, travel work. Real reports from working members, surfaced by trade and location.\",
                link: lang===\"es\" ? \"Ver el tablero\" : lang===\"pl\" ? \"Zobacz tablice\" : \"See the board\",
                page: 'jobboard',
                visualNum:'LIVE', visualAccent:'',
                visualLabel: lang===\"es\" ? \"Del campo\" : lang===\"pl\" ? \"Z terenu\" : \"From the field\"
              }`;
const newFeature03 = `              {
                num:'03', section:'Organize',
                title: lang===\"es\" ? \"Conoce tus derechos. Organiza tu lugar de trabajo.\" : lang===\"pl\" ? \"Poznaj swoje prawa. Zorganizuj swoje miejsce pracy.\" : \"Know your rights. Organize your workplace.\",
                body: lang===\"es\" ? \"Derechos de Weingarten. Ley de Derecho al Trabajo. Como organizar bajo la ley federal. Como formar un caucus dentro de tu local. Los recursos que ningun otro sitio ofrece de forma gratuita.\" : lang===\"pl\" ? \"Prawa Weingartena. Prawo do Pracy. Jak sie zorganizowac. Jak stworzyc kaukus w swoim oddziale. Zasoby, ktorych nie znajdziesz nigdzie indziej za darmo.\" : \"Weingarten rights. Right to Work laws. How to organize under federal law. How to form a caucus inside your local. The resources no other site offers for free.\",
                link: lang===\"es\" ? \"Leer las guias\" : lang===\"pl\" ? \"Przeczytaj przewodniki\" : \"Read the guides\",
                page: 'organize',
                visualNum:'8(f)', visualAccent:'',
                visualLabel: lang===\"es\" ? \"NLRA · tus derechos\" : lang===\"pl\" ? \"NLRA · twoje prawa\" : \"NLRA · your rights\"
              }`;
if (src.includes(oldFeature03)) {
  src = src.replace(oldFeature03, () => newFeature03);
  edits++;
}

if (src === appOriginal) {
  console.error('ERROR: No changes made to App.jsx.');
  process.exit(1);
}

fs.writeFileSync(APP, src);

// ═══════════════════════════════════════════════════════════════
// PART 2 — scripts/generate-og-pages.mjs
// ═══════════════════════════════════════════════════════════════
const OG = 'scripts/generate-og-pages.mjs';
if (fs.existsSync(OG)) {
  let og = fs.readFileSync(OG, 'utf8');
  const ogOriginal = og;

  const ogJb = `  '/jobboard':   { title: 'Job Board · Union Pathways', description: 'Real-time work outlook from union members nationwide. See which locals are busy, steady, or slow.' },\n`;
  if (og.includes(ogJb)) {
    og = og.replace(ogJb, () => '');
    edits++;
  }
  const ogWages = `  '/wages':      { title: 'Local Wages · Union Pathways', description: 'Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place.' },\n`;
  if (og.includes(ogWages)) {
    og = og.replace(ogWages, () => '');
    edits++;
  }

  if (og !== ogOriginal) {
    fs.writeFileSync(OG, og);
  }
}

console.log('');
console.log('Done. Total edits: ' + edits);
console.log('');
console.log('Removed:');
console.log('  - /jobboard page render block (~256 lines)');
console.log('  - /wages page render block (~347 lines)');
console.log('  - Desktop nav dropdown items (Wages + Job Board)');
console.log('  - Mobile drawer links (Wages + Job Board)');
console.log('  - validPages routing array entries');
console.log('  - SEO metadata title/description entries');
console.log('  - Postbuild PAGES list entries');
console.log('');
console.log('Home page feature rows updated:');
console.log('  - 02 was Wages → now History (points to /history, visual: "11 union histories")');
console.log('  - 03 was Job Board → now Organize (points to /organize, visual: "8(f) NLRA")');
console.log('');
console.log('Preserved (unused for now, prune later if desired):');
console.log('  - ApprovedWagesFeed component definition');
console.log('  - Admin panel wages/jobs table logic');
console.log('  - Cross-page navigation guards that reference these strings');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx scripts/generate-og-pages.mjs && git commit -m "chore: remove job board and wages pages" && git push');
console.log('');
console.log('Then in Supabase (destructive — do only when ready):');
console.log('  DROP TABLE IF EXISTS wage_submissions CASCADE;');
console.log('  DROP TABLE IF EXISTS job_submissions CASCADE;');
console.log('');
