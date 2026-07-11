// fix136.js
// Add UFCW (United Food and Commercial Workers) as a Coming Soon placeholder
// in the History dropdown nav. First non-construction union on the site —
// signals the scope is broadening beyond building trades.
//
// Placement: at the bottom of the existing list, after LIUNA. When the user
// clicks it, they'll go to the generic "trade-history" page (same fallback
// behavior as the other Coming Soon entries).

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldList =
`                    {key:'UBC', name:'UBC — Carpenters'},
                    {key:'LIUNA', name:'LIUNA — Laborers'},
                  ].map(t => (`;

const newList =
`                    {key:'UBC', name:'UBC — Carpenters'},
                    {key:'LIUNA', name:'LIUNA — Laborers'},
                    {key:'UFCW', name:'UFCW — Food & Commercial Workers'},
                  ].map(t => (`;

if (!code.includes(oldList)) {
  if (code.includes("'UFCW'")) {
    console.log('Skipping — UFCW already in dropdown list.');
  } else {
    console.error('ERROR: trade-history dropdown list anchor not found.');
    process.exit(1);
  }
} else {
  code = code.replace(oldList, newList);
  console.log('✓ Added UFCW to history dropdown as Coming Soon placeholder');
}

fs.writeFileSync(path, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add UFCW to history dropdown as Coming Soon placeholder" && git push');
console.log('');
