// fix166.js — Add Organize and Get In Touch sections to the mobile drawer
//
// Currently the mobile drawer has: Home, Apprentice, Learn, Resources, History, Tools.
// This adds two more sections at the bottom: Organize and Get In Touch.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('mobile-drawer-link${page===\"organize\"')) {
  console.error('ERROR: Organize already in mobile drawer. Aborting.');
  process.exit(1);
}

// Anchor: the closing </aside> tag of the mobile drawer
// We insert the two new sections RIGHT BEFORE </aside>
const anchorOld = `          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Herramientas\" : lang===\"pl\" ? \"Narzedzia\" : \"Tools\"}</div>
            <button className={\`mobile-drawer-link\${page===\"jobboard\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"jobboard\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Bolsa de Trabajo\" : lang===\"pl\" ? \"Gielda Pracy\" : \"Job Board\"}</button>
            <button className={\`mobile-drawer-link\${page===\"wages\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"wages\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Salarios\" : lang===\"pl\" ? \"Place\" : \"Wages\"}</button>
          </div>
        </aside>`;

const anchorNew = `          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Herramientas\" : lang===\"pl\" ? \"Narzedzia\" : \"Tools\"}</div>
            <button className={\`mobile-drawer-link\${page===\"jobboard\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"jobboard\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Bolsa de Trabajo\" : lang===\"pl\" ? \"Gielda Pracy\" : \"Job Board\"}</button>
            <button className={\`mobile-drawer-link\${page===\"wages\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"wages\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Salarios\" : lang===\"pl\" ? \"Place\" : \"Wages\"}</button>
          </div>

          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Organizar\" : lang===\"pl\" ? \"Organizuj\" : \"Organize\"}</div>
            <button className={\`mobile-drawer-link\${page===\"organize\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"organize\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Organizar Tu Trabajo\" : lang===\"pl\" ? \"Organizuj Prace\" : \"Workplace Organizing\"}</button>
            <button className={\`mobile-drawer-link\${page===\"organize-contractor\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"organize-contractor\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Organizar un Contratista\" : lang===\"pl\" ? \"Organizowanie Wykonawcy\" : \"Organizing a Contractor\"}</button>
          </div>

          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Contactanos\" : lang===\"pl\" ? \"Kontakt\" : \"Get In Touch\"}</div>
            <button className={\`mobile-drawer-link\${page===\"about\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"about\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Nosotros\" : lang===\"pl\" ? \"O Nas\" : \"About\"}</button>
            <button className={\`mobile-drawer-link\${page===\"contact\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"contact\"); setContactSent(false); setMobileNavOpen(false); }}>{t.navContact}</button>
          </div>
        </aside>`;

if (!src.includes(anchorOld)) {
  console.error('ERROR: Could not find Tools section / </aside> anchor. Aborting.');
  process.exit(1);
}
src = src.replace(anchorOld, () => anchorNew);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Mobile drawer now has Organize and Get In Touch sections at the bottom.');
console.log('  Organize:');
console.log('    - Workplace Organizing');
console.log('    - Organizing a Contractor');
console.log('  Get In Touch:');
console.log('    - About');
console.log('    - Contact');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add Organize and Get In Touch sections to mobile drawer" && git push');
console.log('');
