// fix96.js — Correct IBEW Local 11 address spelling, ZIP, and coordinates
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

const old = `{ id: 10011, name: "IBEW Local 11", city: "Los Angeles", state: "CA", phone: "3235179610", website: "www.ibew11.org", lat: 33.6059066, lng: -117.8898772, address: "297 N Merengo, Pasadena, CA" },`;

const replacement = `{ id: 10011, name: "IBEW Local 11", city: "Los Angeles", state: "CA", phone: "(626) 243-9700", website: "www.ibew11.org", lat: 34.1485, lng: -118.1445, address: "297 N Marengo Ave, Pasadena, CA 91101" },`;

if (!code.includes(old)) {
  console.error('ERROR: anchor not found for "IBEW Local 11"');
  process.exit(1);
}
if (code.split(old).length > 2) {
  console.error('ERROR: anchor matches more than once');
  process.exit(1);
}
code = code.replace(old, replacement);

fs.writeFileSync(FILE, code);
console.log('1/1 ✓ Fixed IBEW Local 11:');
console.log('   Address: "297 N Merengo, Pasadena, CA" → "297 N Marengo Ave, Pasadena, CA 91101"');
console.log('   Phone: "3235179610" → "(626) 243-9700" (main hall)');
console.log('   Coordinates: Mission Viejo (33.60, -117.88) → Pasadena (34.1485, -118.1445)');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: correct IBEW Local 11 address, phone, coordinates" && git push\n');
