// fix111.js — Remove IBEW Lineman from the History dropdown
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

const old = `                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                    {key:'IBEW_L', name:'IBEW Lineman'},
                    {key:'UA', name:'UA — Plumbers & Pipefitters'},`;

const replacement = `                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                    {key:'UA', name:'UA — Plumbers & Pipefitters'},`;

if (!code.includes(old)) {
  console.error('ERROR: anchor not found');
  process.exit(1);
}
if (code.split(old).length > 2) {
  console.error('ERROR: anchor matches more than once');
  process.exit(1);
}
code = code.replace(old, replacement);

fs.writeFileSync(FILE, code);
console.log('1/1 ✓ Removed IBEW Lineman from History dropdown');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: remove IBEW Lineman from History dropdown" && git push\n');
