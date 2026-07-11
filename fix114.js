// fix114.js — Fix HFIAW Local 48 (Atlanta) website/email
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

const old = `{ id: 50048, name: "HFIAW Local 48", city: "Atlanta", state: "GA", phone: "(404) 373 - 9866", website: "awl48@insulators.org", email: "www.insulators48.org", lat: 33.7544657, lng: -84.3898151, address: "374 Maynard Terr. SE Ste. 232, Atlanta, GA 30316" }`;

const replacement = `{ id: 50048, name: "HFIAW Local 48", city: "Atlanta", state: "GA", phone: "(404) 373 - 9866", website: "https://atlantainsulators48.com/", email: "awl48@insulators.org", lat: 33.7544657, lng: -84.3898151, address: "374 Maynard Terr. SE Ste. 232, Atlanta, GA 30316" }`;

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
console.log('1/1 ✓ Fixed HFIAW Local 48: website set to https://atlantainsulators48.com/, email moved to email field');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: HFIAW Local 48 website + email" && git push\n');
