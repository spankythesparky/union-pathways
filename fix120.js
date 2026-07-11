// fix120.js — Rename "Learn" nav button to "Benefits"
//   Also rename redundant child "Union Benefits" → "Benefits Overview" so it stays accessible
//   Final layout: Benefits ▾ → Benefits Overview / Retirement / Health Insurance / Veterans
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// 1. Rename the parent dropdown button (Learn → Benefits, EN/ES/PL)
code = replaceOnce(code,
  `{lang==="es" ? "Aprender" : lang==="pl" ? "Nauka" : "Learn"}`,
  `{lang==="es" ? "Beneficios" : lang==="pl" ? "Świadczenia" : "Benefits"}`,
  '1: nav button label');
console.log('1/2 ✓ Renamed Learn → Benefits in nav (EN/ES/PL)');

// 2. Rename the first dropdown item from "Union Benefits" to "Benefits Overview"
code = replaceOnce(code,
  `<span className="nav-dropdown-label">{lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Świadczenia Związkowe" : "Union Benefits"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pensión, salud, anualidad y más" : lang==="pl" ? "Emerytura, zdrowie, renta i więcej" : "Pension, health, annuity & more"}</span>`,
  `<span className="nav-dropdown-label">{lang==="es" ? "Resumen de Beneficios" : lang==="pl" ? "Przegląd Świadczeń" : "Benefits Overview"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pensión, salud, anualidad y más" : lang==="pl" ? "Emerytura, zdrowie, renta i więcej" : "Pension, health, annuity & more"}</span>`,
  '2: rename Union Benefits → Benefits Overview');
console.log('2/2 ✓ Renamed first dropdown item to Benefits Overview');

fs.writeFileSync(FILE, code);
console.log('\nFinal layout: Benefits ▾ → Benefits Overview / Retirement / Health Insurance / Veterans\n');
console.log('✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: rename Learn nav to Benefits, refine child labels" && git push\n');
