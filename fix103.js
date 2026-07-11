// fix103.js — Remove stray header comments that leaked into the rendered history page
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

const bad = `// /home/claude/history-page.jsx — content for fix102.js to inject
// This is a TEMPLATE STRING source. Will be loaded as text and embedded by fix102.

`;

if (!code.includes(bad)) {
  console.error('ERROR: stray comment block not found — already cleaned up?');
  process.exit(1);
}
if (code.split(bad).length > 2) {
  console.error('ERROR: anchor matches more than once');
  process.exit(1);
}
code = code.replace(bad, '');

fs.writeFileSync(FILE, code);
console.log('1/1 ✓ Removed stray header comments from rendered history page');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: remove stray comments leaking into history page render" && git push\n');
