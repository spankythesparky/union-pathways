// fix117.js — Hide UA Local 404 from the interactive map (data still appears in search/jobboard)
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

const old = `      const markers = results.map(local => {
        const m = L.marker([local.lat, local.lng], {icon}).addTo(map);`;

const replacement = `      const markers = results.filter(local => local.id !== 20404).map(local => {
        const m = L.marker([local.lat, local.lng], {icon}).addTo(map);`;

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
console.log('1/1 ✓ UA Local 404 (id 20404) hidden from the interactive map');
console.log('   — Still appears in search results, job board, wages page, etc.');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: hide UA Local 404 from map (data is correct in source but rendering wrong)" && git push\n');
