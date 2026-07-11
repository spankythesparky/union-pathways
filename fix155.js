// fix155.js — Add "Apprenticeship" nav button to top-level nav
//
// Reason: URL params like ?page=apprenticeship don't work because the app's
// router doesn't read URL search params on mount — it only responds to
// in-app setPage() calls. Easiest fix: add a real nav button.
//
// We add it right after the "Right to Work" button, before "Trade History".

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('setPage("apprenticeship")') && src.includes('"Aprendizaje"')) {
  console.error('ERROR: Apprenticeship nav button already exists. Aborting.');
  process.exit(1);
}

const navOld = `            <button className={\`nav-link \${page===\"rtw\"?\"active\":\"\"}\`} onClick={() => setPage(\"rtw\")}>{lang===\"es\" ? \"Derecho al Trabajo\" : lang===\"pl\" ? \"Prawo do Pracy\" : \"Right to Work\"}</button>`;

const navNew = navOld + `\n            <button className={\`nav-link \${page===\"apprenticeship\"||page===\"apprenticeship-ibew\"||page===\"apprenticeship-ua\"||page===\"apprenticeship-smart\"||page===\"apprenticeship-iuec\"?\"active\":\"\"}\`} onClick={() => setPage(\"apprenticeship\")}>{lang===\"es\" ? \"Aprendizaje\" : lang===\"pl\" ? \"Praktyka\" : \"Apprenticeship\"}</button>`;

if (!src.includes(navOld)) {
  console.error('ERROR: Could not find Right to Work nav button. Aborting.');
  process.exit(1);
}
src = src.replace(navOld, navNew);

if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Added "Apprenticeship" nav button.');
console.log('  - Appears in top nav after "Right to Work"');
console.log('  - Stays highlighted on the hub AND all 4 detail pages');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add Apprenticeship nav button" && git push');
console.log('');
