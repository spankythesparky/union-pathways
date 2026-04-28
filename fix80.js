const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldSort = `selectedTradeLocals.sort((a,b) => a.name.localeCompare(b.name)).map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>)`;

const newSort = `[...selectedTradeLocals].sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; }).map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>)`;

if (!code.includes(oldSort)) { console.error('ERROR: old sort line not found'); process.exit(1); }
code = code.replace(oldSort, newSort);
console.log('Updated locals dropdown to sort by local number ascending');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: sort job board locals dropdown by number ascending" && git push\n');
