// fix92.js — Add /wages to the OG page generator
const fs = require('fs');

const FILE = 'scripts/generate-og-pages.mjs';
let code = fs.readFileSync(FILE, 'utf8');

const oldLine = `  '/jobboard':   { title: 'Job Board · Union Pathways', description: 'Real-time work outlook from union members nationwide. See which locals are busy, steady, or slow.' },`;

const newLines = `  '/jobboard':   { title: 'Job Board · Union Pathways', description: 'Real-time work outlook from union members nationwide. See which locals are busy, steady, or slow.' },
  '/wages':      { title: 'Local Wages · Union Pathways', description: 'Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place.' },`;

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
console.log('1/1 ✓ Added /wages to OG page generator');
console.log('\n✅ Done! Now run:');
console.log('   git add scripts/generate-og-pages.mjs && git commit -m "feat: generate OG meta tags for /wages" && git push\n');
