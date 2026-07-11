// fix119.js — Add /history-ua to the OG page generator
const fs = require('fs');

const FILE = 'scripts/generate-og-pages.mjs';
let code = fs.readFileSync(FILE, 'utf8');

const oldLine = `  '/history-ibew': { title: 'IBEW History · Union Pathways', description: 'The full history of the International Brotherhood of Electrical Workers — from Henry Miller and the 1891 St. Louis founding through the Reid-Murphy split, the Council on Industrial Relations, the AT&T breakup, and today\\'s data center boom.' },`;

const newLines = `  '/history-ibew': { title: 'IBEW History · Union Pathways', description: 'The full history of the International Brotherhood of Electrical Workers — from Henry Miller and the 1891 St. Louis founding through the Reid-Murphy split, the Council on Industrial Relations, the AT&T breakup, and today\\'s data center boom.' },
  '/history-ua': { title: 'UA History · Union Pathways', description: 'The full history of the United Association of Plumbers and Pipefitters — from P.J. Quinlan and the 1889 Washington founding through the Steamfitters\\' War, the 1936 federal apprenticeship, the Veterans in Piping program, and today\\'s LNG and semiconductor boom.' },`;

if (!code.includes(oldLine)) {
  console.error('ERROR: anchor not found');
  process.exit(1);
}
if (code.split(oldLine).length > 2) {
  console.error('ERROR: anchor matches more than once');
  process.exit(1);
}
code = code.replace(oldLine, newLines);

fs.writeFileSync(FILE, code);
console.log('1/1 ✓ Added /history-ua to OG page generator');
console.log('\n✅ Done! Now run:');
console.log('   git add scripts/generate-og-pages.mjs && git commit -m "feat: OG meta tags for UA history page" && git push\n');
