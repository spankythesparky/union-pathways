// fix118.js — Add UA trade history page + activate dropdown link
const fs = require('fs');
const path = require('path');

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

// 1. Add new page key to URL whitelist
code = replaceOnce(code,
  `'history','trade-history','history-ibew','retirement'`,
  `'history','trade-history','history-ibew','history-ua','retirement'`,
  '1: validPages whitelist');
console.log('1/4 ✓ Added history-ua to URL whitelist');

// 2. Update the History dropdown so "UA" routes to the new page (live, not greyed)
code = replaceOnce(code,
  `                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                    {key:'UA', name:'UA — Plumbers & Pipefitters'},`,
  `                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                    {key:'UA', name:'UA — Plumbers & Pipefitters', page:'history-ua', live:true},`,
  '2: dropdown live flag for UA');
console.log('2/4 ✓ Updated dropdown to mark UA as live');

// 3. Add meta tag for the new page
code = replaceOnce(code,
  `'history-ibew': { title: "IBEW History — Wired for the Long Haul · Union Pathways", desc: "The full history of the International Brotherhood of Electrical Workers from its 1891 founding above a St. Louis dance hall to today. Henry Miller, the Reid-Murphy split, the Council on Industrial Relations, the data center boom, and the path back to one million members." },`,
  `'history-ibew': { title: "IBEW History — Wired for the Long Haul · Union Pathways", desc: "The full history of the International Brotherhood of Electrical Workers from its 1891 founding above a St. Louis dance hall to today. Henry Miller, the Reid-Murphy split, the Council on Industrial Relations, the data center boom, and the path back to one million members." },
      'history-ua': { title: "UA History — The Pipe Trades' Long Brotherhood · Union Pathways", desc: "The full history of the United Association from its 1889 Washington founding to today. P.J. Quinlan, the Steamfitters' War, the 1936 federal apprenticeship, the postwar peak, the Veterans in Piping program, and the LNG and data center boom." },`,
  '3: meta tag for ua history');
console.log('3/4 ✓ Added meta tag for /history-ua');

// 4. Inject the UA history page JSX block right before the trade-history placeholder
const newPageJsx = fs.readFileSync(path.join(__dirname, 'ua-history-page.jsx'), 'utf8');

const insertAnchor = `        {page === "trade-history" && (`;
if (!code.includes(insertAnchor)) {
  console.error('ERROR: trade-history anchor not found');
  process.exit(1);
}
if (code.split(insertAnchor).length > 2) {
  console.error('ERROR: trade-history anchor matches more than once');
  process.exit(1);
}
code = code.replace(insertAnchor, newPageJsx.trimEnd() + '\n\n' + insertAnchor);
console.log('4/4 ✓ Injected UA history page JSX block');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: UA trade history page" && git push\n');
