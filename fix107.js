// fix107.js — Rename URL slug from /history-ibew-i to /history-ibew
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

// 1. validPages whitelist
code = replaceOnce(code,
  `'history','trade-history','history-ibew-i','retirement'`,
  `'history','trade-history','history-ibew','retirement'`,
  '1: validPages whitelist');
console.log('1/4 ✓ Updated validPages whitelist');

// 2. Page meta key
code = replaceOnce(code,
  `'history-ibew-i': { title: "IBEW History`,
  `'history-ibew': { title: "IBEW History`,
  '2: meta key');
console.log('2/4 ✓ Updated meta key');

// 3. Dropdown nav route
code = replaceOnce(code,
  `{key:'IBEW_I', name:'IBEW Inside', page:'history-ibew-i', live:true},`,
  `{key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},`,
  '3: dropdown route');
console.log('3/4 ✓ Updated dropdown route');

// 4. Page render condition
code = replaceOnce(code,
  `{page === "history-ibew-i" && (() => {`,
  `{page === "history-ibew" && (() => {`,
  '4: page render condition');
console.log('4/4 ✓ Updated page render condition');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: rename /history-ibew-i to /history-ibew" && git push\n');
