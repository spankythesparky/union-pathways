// fix112.js — Fix UA Local 404: city/state/coordinates were all wrong
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

const old = `{ id: 20404, name: "UA Local 404", city: "Northwest", state: "TE", phone: "806-744-3835", website: "ualocal404.org", address: "510 AVE G, LUBBOCK, TX 79401" , lat: 62.454, lng: -114.3718}`;

const replacement = `{ id: 20404, name: "UA Local 404", city: "Lubbock", state: "TX", phone: "806-744-3835", website: "ualocal404.org", address: "510 AVE G, LUBBOCK, TX 79401" , lat: 33.5779, lng: -101.8530}`;

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
console.log('1/1 ✓ Fixed UA Local 404: city Northwest→Lubbock, state TE→TX, coordinates moved to Lubbock, TX');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: UA Local 404 city/state/coordinates" && git push\n');
