const xlsx = require('xlsx');
const fs = require('fs');

// Read the spreadsheet
const wb = xlsx.readFile(process.env.HOME + '/Downloads/1_2 UA Locals.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws);

console.log(`Found ${data.length} UA locals`);

// Parse each row into a local object
let id = 20000; // start at 20000 to avoid conflicts
const locals = [];

data.forEach(row => {
  const localNum = row['Local Number'];
  const cityState = (row['City / state'] || '').trim();
  const address = (row['Address'] || '').replace(/\n+/g, ', ').trim();
  const phone = (row['Phone'] || '').replace(/\n/g, '').trim();
  const websiteRaw = (row['Website '] || row['Website'] || '').replace(/\n/g, '').trim();

  if (!localNum || !cityState) return;

  // Parse city and state
  const parts = cityState.split(',');
  let city = '', state = '';
  if (parts.length >= 2) {
    city = parts[0].trim();
    state = parts[parts.length - 1].trim().toUpperCase().substring(0, 2);
  } else {
    // Try splitting by space for "CITY ST" format
    const words = cityState.trim().split(' ');
    state = words[words.length - 1].toUpperCase().substring(0, 2);
    city = words.slice(0, -1).join(' ');
  }

  // Clean website
  let website = websiteRaw.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Parse address for lat/lng hints (we'll use city/state for geocoding)
  // Extract zip from address
  const zipMatch = address.match(/\b\d{5}\b/);
  const zip = zipMatch ? zipMatch[0] : '';

  locals.push({
    id: id++,
    name: `UA Local ${localNum}`,
    city: city.charAt(0) + city.slice(1).toLowerCase(),
    state: state,
    phone: phone || null,
    website: website || null,
    address: address || null,
    zip: zip || null,
    lat: null,
    lng: null,
  });
});

console.log(`Parsed ${locals.length} valid locals`);
console.log('Sample:', JSON.stringify(locals[0], null, 2));

// Now geocode using ZIP_COORDS from App.jsx
const appCode = fs.readFileSync('src/App.jsx', 'utf8');

// Extract ZIP_COORDS
const zipMatch = appCode.match(/const ZIP_COORDS = \{([^}]+(?:\{[^}]+\}[^}]*)*)\}/s);
let zipCoords = {};
if (zipMatch) {
  // Parse the zip coords
  const entries = zipMatch[1].matchAll(/"(\d{3})"\s*:\s*\["([A-Z]{2})",\s*([\d.-]+),\s*([\d.-]+)\]/g);
  for (const e of entries) {
    zipCoords[e[1]] = { state: e[2], lat: parseFloat(e[3]), lng: parseFloat(e[4]) };
  }
  console.log(`Loaded ${Object.keys(zipCoords).length} ZIP prefix coords`);
}

// Assign lat/lng using zip prefix
locals.forEach(l => {
  if (l.zip) {
    const prefix = l.zip.substring(0, 3);
    if (zipCoords[prefix]) {
      l.lat = zipCoords[prefix].lat;
      l.lng = zipCoords[prefix].lng;
    }
  }
});

const withCoords = locals.filter(l => l.lat !== null).length;
console.log(`${withCoords} locals have coordinates`);

// Generate JS array entries
const jsEntries = locals.map(l => {
  const parts = [
    `id: ${l.id}`,
    `name: "${l.name}"`,
    `city: "${l.city}"`,
    `state: "${l.state}"`,
  ];
  if (l.phone) parts.push(`phone: "${l.phone}"`);
  if (l.website) parts.push(`website: "${l.website}"`);
  if (l.lat !== null) parts.push(`lat: ${l.lat}`);
  if (l.lng !== null) parts.push(`lng: ${l.lng}`);
  if (l.address) parts.push(`address: "${l.address.replace(/"/g, "'")}"`);
  return `  { ${parts.join(', ')} }`;
}).join(',\n');

// Replace UA_LOCALS in App.jsx
const oldMarker = 'const UA_LOCALS = [';
const startIdx = appCode.indexOf(oldMarker);
const endIdx = appCode.indexOf('];', startIdx) + 2;

if (startIdx === -1) { console.error('ERROR: UA_LOCALS not found'); process.exit(1); }

const newCode = appCode.slice(0, startIdx) + 
  `const UA_LOCALS = [\n${jsEntries}\n];` + 
  appCode.slice(endIdx);

fs.writeFileSync('src/App.jsx', newCode);
console.log(`\n✅ Replaced UA_LOCALS with ${locals.length} locals`);
console.log('🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: update UA locals database with 164 locals" && git push\n');
