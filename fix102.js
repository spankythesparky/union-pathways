// fix102.js — Replace /history page with new interactive general union history
const fs = require('fs');
const path = require('path');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

// Read the new history page content (must be in same dir as this script)
const replacement = fs.readFileSync(path.join(__dirname, 'history-page.jsx'), 'utf8');

// Find the boundaries of the existing history page block
const startMarker = '        {page === "history" && (';
const endMarker = '        {page === "benefits" && (';

const startIdx = code.indexOf(startMarker);
if (startIdx === -1) {
  console.error('ERROR: history page start marker not found');
  process.exit(1);
}
const endIdx = code.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  console.error('ERROR: benefits page marker (end of history) not found');
  process.exit(1);
}

// Replace everything between (inclusive of the start marker, exclusive of the next page marker)
const before = code.slice(0, startIdx);
const after = code.slice(endIdx);

const newCode = before + replacement.trimEnd() + '\n\n' + after;

fs.writeFileSync(FILE, newCode);
console.log('1/1 ✓ Replaced /history page with new interactive version');
console.log('   Size: ' + (newCode.length - code.length).toLocaleString() + ' chars added');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: redesigned interactive history page" && git push\n');
