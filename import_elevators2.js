const xlsx = require('xlsx');
const fs = require('fs');
const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function geocode(address) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'nominatim.openstreetmap.org',
      path: `/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      headers: { 'User-Agent': 'UnionPathways/1.0 (unionpathways.com)' }
    };
    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json[0]) resolve({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) });
          else resolve(null);
        } catch(e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  const wb = xlsx.readFile(process.env.HOME + '/Downloads/bottom half elevators union.xlsx');
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  console.log(`Found ${rows.length} rows`);

  const locals = [];
  for (const row of rows) {
    const localNum = row['Local Number'];
    if (!localNum) continue;
    const num = Math.floor(parseFloat(String(localNum)));
    if (isNaN(num)) continue;

    const cityState = (row['City / State'] || '').trim();
    const address = (row['Address'] || '').replace(/\n+/g, ', ').trim();
    const phone = (row['Phone'] || '').trim() || null;
    const website = (row['Website'] || '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '') || null;
    const email = (row['Email'] || '').trim() || null;

    const parts = cityState.split(',');
    let city = parts[0].trim();
    let state = parts.length > 1 ? parts[parts.length-1].trim() : '';
    if (cityState.toLowerCase().includes('canada')) state = 'BC';
    const stateMatch = state.match(/([A-Z]{2})/);
    if (stateMatch) state = stateMatch[1];

    let coords = null;
    process.stdout.write(`Geocoding IUEC Local ${num} - ${address.substring(0,40)}... `);
    await sleep(1100);
    coords = await geocode(address);
    if (!coords) {
      await sleep(1100);
      coords = await geocode(cityState);
    }
    console.log(coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'NO COORDS');

    locals.push({
      id: 51000 + num,
      name: `IUEC Local ${num}`,
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      state,
      phone, website, email, address,
      lat: coords ? coords.lat : null,
      lng: coords ? coords.lng : null,
    });
  }

  const withCoords = locals.filter(l => l.lat).length;
  console.log(`\nGeocoded: ${withCoords}/${locals.length}`);

  let code = fs.readFileSync('src/App.jsx', 'utf8');
  const startIdx = code.indexOf('const IUEC_LOCALS = [');
  const endIdx = code.indexOf('];', startIdx);

  const existing = code.slice(startIdx, endIdx);
  const existingIds = [...existing.matchAll(/id: (\d+)/g)].map(m => parseInt(m[1]));

  const newEntries = locals
    .filter(l => !existingIds.includes(l.id))
    .map(l => {
      const p = [`id: ${l.id}`, `name: "${l.name}"`, `city: "${l.city}"`, `state: "${l.state}"`];
      if (l.phone) p.push(`phone: "${l.phone}"`);
      if (l.website) p.push(`website: "${l.website}"`);
      if (l.email) p.push(`email: "${l.email}"`);
      if (l.lat) p.push(`lat: ${l.lat}`, `lng: ${l.lng}`);
      if (l.address) p.push(`address: "${l.address.replace(/"/g, "'")}"`);
      return `  { ${p.join(', ')} }`;
    });

  console.log(`Adding ${newEntries.length} new locals`);
  code = code.slice(0, endIdx) + ',\n' + newEntries.join(',\n') + '\n' + code.slice(endIdx);
  fs.writeFileSync('src/App.jsx', code);

  console.log('\n Done! Now run:');
  console.log('   git add src/App.jsx && git commit -m "feat: add 27 more elevator locals" && git push\n');
}

main().catch(console.error);
