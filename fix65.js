const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Manual fixes for malformed entries
const fixes = [
  // UA Local 9 - Central new, JE — likely New Jersey
  { search: 'name: "UA Local 9", city: "Central new", state: "JE"', lat: 40.0583, lng: -74.4057 },
  // UA Local 78 - Los, AN — Los Angeles
  { search: 'name: "UA Local 78", city: "Los", state: "AN"', lat: 34.0522, lng: -118.2437 },
  // UA Local 56 - Halifax, NO — Halifax Nova Scotia
  { search: 'name: "UA Local 56", city: "Halifax", state: "NO"', lat: 44.6488, lng: -63.5752 },
  // UA Local 282 - Halifax, NO
  { search: 'name: "UA Local 282", city: "Halifax", state: "NO"', lat: 44.6488, lng: -63.5752 },
  // UA Local 682 - Sydney, NO — Sydney Nova Scotia
  { search: 'name: "UA Local 682", city: "Sydney", state: "NO"', lat: 46.1368, lng: -60.1942 },
  // UA Local 300 - North and south, DA — likely Dakota or unclear, use center US
  { search: 'name: "UA Local 300", city: "North and south", state: "DA"', lat: 44.2998, lng: -99.4388 },
  // UA Local 322 - Southern new, JE — Southern New Jersey
  { search: 'name: "UA Local 322", city: "Southern new", state: "JE"', lat: 39.7589, lng: -74.9857 },
  // UA Local 404 - Northwest, TE — Northwest Territories Canada
  { search: 'name: "UA Local 404", city: "Northwest", state: "TE"', lat: 62.4540, lng: -114.3718 },
];

fixes.forEach(fix => {
  // Find the entry and add lat/lng
  const idx = code.indexOf(fix.search);
  if (idx === -1) { console.log('Not found:', fix.search); return; }
  // Find end of this entry
  const entryEnd = code.indexOf('}', idx);
  const entry = code.slice(idx, entryEnd);
  if (entry.includes('lat:')) { console.log('Already has coords:', fix.search); return; }
  code = code.slice(0, entryEnd) + `, lat: ${fix.lat}, lng: ${fix.lng}` + code.slice(entryEnd);
  console.log('✅ Fixed:', fix.search.split(',')[0]);
});

fs.writeFileSync('src/App.jsx', code);

// Final count
const section = code.slice(code.indexOf('const UA_LOCALS = ['), code.indexOf('];', code.indexOf('const UA_LOCALS = [')) + 2);
const total = (section.match(/name: "UA Local/g) || []).length;
const withCoords = (section.match(/lat:/g) || []).length;
console.log(`\nFinal: ${total} locals, ${withCoords} with coords, ${total - withCoords} missing`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: fix remaining UA locals coordinates" && git push\n');
