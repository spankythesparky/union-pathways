const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('const UA_LOCALS = [');
const end = code.indexOf('];', start) + 2;
const section = code.slice(start, end);

// Find entries without lat
const allEntries = section.split('\n').filter(l => l.includes('name: "UA Local'));
const missingCoords = allEntries.filter(l => !l.includes('lat:'));
console.log('Missing coords:', missingCoords.length);
missingCoords.forEach(l => {
  const name = l.match(/name: "([^"]+)"/)?.[1];
  const city = l.match(/city: "([^"]+)"/)?.[1];
  const state = l.match(/state: "([^"]+)"/)?.[1];
  console.log(`  ${name} - ${city}, ${state}`);
});

// Check duplicates
const names = allEntries.map(l => l.match(/name: "([^"]+)"/)?.[1]).filter(Boolean);
const seen = new Set();
const dupes = [];
names.forEach(n => { if (seen.has(n)) dupes.push(n); else seen.add(n); });
console.log('\nDuplicates:', dupes.length > 0 ? dupes.join(', ') : 'None');
console.log('Total entries:', names.length);
