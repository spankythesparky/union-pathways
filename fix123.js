// fix123.js — Fully remove the /health Health Insurance page from the site
//   (the page itself never had a render block; this removes the nav link, URL whitelist, and search index entry)
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

// 1. Remove 'health' from URL whitelist
code = replaceOnce(code,
  `'history','trade-history','history-ibew','history-ua','retirement','health','benefits'`,
  `'history','trade-history','history-ibew','history-ua','retirement','benefits'`,
  '1: validPages whitelist');
console.log('1/3 ✓ Removed health from URL whitelist (visiting /health now redirects to home)');

// 2. Remove page==="health" from the Benefits dropdown active condition
code = replaceOnce(code,
  `(page==="benefits"||page==="retirement"||page==="health"||page==="veterans")`,
  `(page==="benefits"||page==="retirement"||page==="veterans")`,
  '2: dropdown active condition');
console.log('2/3 ✓ Removed health from Benefits dropdown active state');

// 3. Remove the entire Health Insurance dropdown item (3 lines)
code = replaceOnce(code,
  `                  <div className={\`nav-dropdown-item\${page==="health"?" active":""}\`} onMouseDown={() => { setPage("health"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pagado por el contratista" : lang==="pl" ? "Płacone przez wykonawcę" : "Paid by your contractor"}</span>
                  </div>
                  `,
  `                  `,
  '3: dropdown item');
console.log('3/3 ✓ Removed Health Insurance from Benefits dropdown menu');

// 4. Remove the search index entry
code = replaceOnce(code,
  `                { label: "Health Insurance", desc: "How contractor-paid health insurance works", page:"health", keywords:["health","insurance","medical","dental","vision","contractor"] },
`,
  ``,
  '4: search index entry');
console.log('4/3 ✓ Removed Health Insurance from search index');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: remove standalone Health Insurance page" && git push\n');
