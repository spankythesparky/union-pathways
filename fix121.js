// fix121.js — Replace /benefits page with new modern interactive version
const fs = require('fs');
const path = require('path');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

const replacement = fs.readFileSync(path.join(__dirname, 'benefits-page.jsx'), 'utf8');

const startMarker = '        {page === "benefits" && (';
const endMarker = '        {page === "retirement" && (';

const startIdx = code.indexOf(startMarker);
if (startIdx === -1) {
  console.error('ERROR: benefits page start marker not found');
  process.exit(1);
}
const endIdx = code.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  console.error('ERROR: retirement page marker (end of benefits) not found');
  process.exit(1);
}

const before = code.slice(0, startIdx);
const after = code.slice(endIdx);

const newCode = before + replacement.trimEnd() + '\n\n' + after;

fs.writeFileSync(FILE, newCode);
console.log('1/1 ✓ Replaced /benefits page with new modern interactive version');
console.log('   Size: ' + (newCode.length - code.length).toLocaleString() + ' chars added');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: redesigned interactive benefits page" && git push\n');
