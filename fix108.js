// fix108.js — Add /history, /history-ibew, /trade-history to OG page generator
const fs = require('fs');

const FILE = 'scripts/generate-og-pages.mjs';
let code = fs.readFileSync(FILE, 'utf8');

const oldLine = `  '/wages':      { title: 'Local Wages · Union Pathways', description: 'Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place.' },`;

const newLines = `  '/wages':      { title: 'Local Wages · Union Pathways', description: 'Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place.' },
  '/history-ibew': { title: 'IBEW History · Union Pathways', description: 'The full history of the International Brotherhood of Electrical Workers — from Henry Miller and the 1891 St. Louis founding through the Reid-Murphy split, the Council on Industrial Relations, the AT&T breakup, and today\\'s data center boom.' },
  '/trade-history': { title: 'Trade History · Union Pathways', description: 'Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor.' },`;

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
console.log('1/1 ✓ Added /history-ibew + /trade-history to OG page generator');
console.log('\n✅ Done! Now run:');
console.log('   git add scripts/generate-og-pages.mjs && git commit -m "feat: OG meta tags for IBEW + trade history pages" && git push\n');
