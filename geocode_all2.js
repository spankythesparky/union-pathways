const fs = require('fs');
const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function nominatim(query, countrycodes) {
  return new Promise((resolve) => {
    const cc = countrycodes || 'us,ca';
    const path = `/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=${cc}`;
    const options = {
      hostname: 'nominatim.openstreetmap.org',
      path,
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

async function geocodeLocal(name, city, state, address) {
  // Strategy 1: Full address US/CA
  if (address) {
    await sleep(1100);
    const r = await nominatim(address, 'us,ca');
    if (r) return r;
  }

  // Strategy 2: Full address no country restriction
  if (address) {
    await sleep(1100);
    const r = await nominatim(address);
    if (r) return r;
  }

  // Strategy 3: City + State
  if (city && state) {
    await sleep(1100);
    const r = await nominatim(`${city}, ${state}`, 'us,ca');
    if (r) return r;
  }

  // Strategy 4: City + State no country restriction
  if (city && state) {
    await sleep(1100);
    const r = await nominatim(`${city} ${state}`);
    if (r) return r;
  }

  // Strategy 5: Just city
  if (city) {
    await sleep(1100);
    const r = await nominatim(city);
    if (r) return r;
  }

  return null;
}

const STATE_LATS = new Set([
  32.806, 61.370, 33.729, 34.969, 36.778, 39.113, 41.597, 39.318, 27.664, 32.678,
  21.094, 44.240, 40.349, 39.849, 42.011, 38.526, 37.668, 31.169, 44.693, 39.063,
  42.230, 43.326, 45.694, 32.741, 38.456, 46.921, 41.125, 38.313, 43.452, 40.298,
  34.840, 42.165, 35.630, 47.528, 40.388, 35.565, 44.572, 40.590, 41.680, 33.856,
  44.299, 35.747, 31.054, 40.150, 44.045, 37.769, 47.400, 38.491, 44.268, 42.755,
  38.907,
  43.653, 49.283, 53.546, 45.502, 49.895, 50.445, 44.649, 45.964, 47.562, 46.238,
]);

async function main() {
  let code = fs.readFileSync('src/App.jsx', 'utf8');
  const arrays = ['IBEW_INSIDE_LOCALS','IBEW_LINEMAN_LOCALS','UA_LOCALS','BAC_LOCALS','IW_LOCALS','HFIAW_LOCALS','IUEC_LOCALS'];

  let totalFixed = 0;
  let totalFailed = 0;
  const failedList = [];

  for (const arrName of arrays) {
    const startIdx = code.indexOf(`const ${arrName} = [`);
    if (startIdx === -1) continue;
    const endIdx = code.indexOf('];', startIdx) + 2;
    let section = code.slice(startIdx, endIdx);

    // Find all entries with imprecise coords
    const entryRegex = /\{ id: (\d+), name: "([^"]+)", city: "([^"]+)", state: "([^"]+)"[^}]*lat: ([\d.-]+), lng: ([\d.-]+)[^}]*(?:address: "([^"]+)")?[^}]*\}/g;
    const toGeocode = [];
    let m;
    while ((m = entryRegex.exec(section)) !== null) {
      const lat = parseFloat(m[5]);
      if (STATE_LATS.has(lat)) {
        toGeocode.push({ id: m[1], name: m[2], city: m[3], state: m[4], lat, lng: parseFloat(m[6]), address: m[7] || '' });
      }
    }

    console.log(`\n${arrName}: ${toGeocode.length} need geocoding`);
    let fixed = 0;

    for (let i = 0; i < toGeocode.length; i++) {
      const entry = toGeocode[i];
      const result = await geocodeLocal(entry.name, entry.city, entry.state, entry.address);

      if (result) {
        // Replace coords for this specific entry
        const idMarker = `id: ${entry.id},`;
        const entryStart = section.indexOf(idMarker);
        if (entryStart !== -1) {
          const entryEnd = section.indexOf('}', entryStart);
          const entryStr = section.slice(entryStart, entryEnd);
          const newEntryStr = entryStr.replace(/lat: [\d.-]+, lng: [\d.-]+/, `lat: ${result.lat}, lng: ${result.lng}`);
          section = section.slice(0, entryStart) + newEntryStr + section.slice(entryEnd);
          fixed++;
        }
      } else {
        totalFailed++;
        failedList.push(`${entry.name} - ${entry.city}, ${entry.state}`);
      }

      if ((i + 1) % 5 === 0) {
        process.stdout.write(`  ${arrName}: ${i+1}/${toGeocode.length} processed (${fixed} fixed)\r`);
        // Save progress every 5
        const newCode = code.slice(0, startIdx) + section + code.slice(endIdx);
        fs.writeFileSync('src/App.jsx', newCode);
      }
    }

    console.log(`\n✅ ${arrName}: ${fixed}/${toGeocode.length} geocoded`);
    totalFixed += fixed;
    code = code.slice(0, startIdx) + section + code.slice(endIdx);
    fs.writeFileSync('src/App.jsx', code);
  }

  console.log(`\n🎉 Done! Fixed ${totalFixed} locals, ${totalFailed} could not be geocoded`);
  if (failedList.length > 0) {
    console.log('\nFailed locals:');
    failedList.forEach(f => console.log(' -', f));
  }
  console.log('\nNow run: git add src/App.jsx && git commit -m "feat: precise geocoding for all locals" && git push');
}

main().catch(console.error);
