const fs = require('fs');
const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function geocode(address) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=us,ca`;
    const options = {
      hostname: 'nominatim.openstreetmap.org',
      path: `/search?q=${query}&format=json&limit=1&countrycodes=us,ca`,
      headers: { 'User-Agent': 'UnionPathways/1.0 (unionpathways.com)' }
    };
    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json[0]) {
            resolve({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) });
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  let code = fs.readFileSync('src/App.jsx', 'utf8');

  const arrays = ['IBEW_INSIDE_LOCALS','IBEW_LINEMAN_LOCALS','UA_LOCALS','BAC_LOCALS','IW_LOCALS'];
  
  // Find all imprecise entries (same lat as state centers)
  // State center lats to detect
  const STATE_LATS = new Set([
    32.806, 61.370, 33.729, 34.969, 36.778, 39.113, 41.597, 39.318, 27.664, 32.678,
    21.094, 44.240, 40.349, 39.849, 42.011, 38.526, 37.668, 31.169, 44.693, 39.063,
    42.230, 43.326, 45.694, 32.741, 38.456, 46.921, 41.125, 38.313, 43.452, 40.298,
    34.840, 42.165, 35.630, 47.528, 40.388, 35.565, 44.572, 40.590, 41.680, 33.856,
    44.299, 35.747, 31.054, 40.150, 44.045, 37.769, 47.400, 38.491, 44.268, 42.755,
    38.907,
    // Canadian provinces
    43.653, 49.283, 53.546, 45.502, 49.895, 50.445, 44.649, 45.964, 47.562, 46.238,
  ]);

  let totalFixed = 0;
  let totalFailed = 0;

  for (const arrName of arrays) {
    const startIdx = code.indexOf(`const ${arrName} = [`);
    if (startIdx === -1) continue;
    const endIdx = code.indexOf('];', startIdx) + 2;
    let section = code.slice(startIdx, endIdx);

    // Find entries with imprecise coords
    const entryRegex = /(\{ id: \d+[^}]*address: "([^"]+)"[^}]*lat: ([\d.-]+), lng: ([\d.-]+)[^}]*\})/g;
    const addrRegex = /(\{ id: \d+[^}]*lat: ([\d.-]+)[^}]*address: "([^"]+)"[^}]*\})/g;

    // Get all entries with address + lat/lng
    const entries = [];
    const mainRegex = /\{ id: (\d+), name: "([^"]+)"[^}]*lat: ([\d.-]+), lng: ([\d.-]+)[^}]*address: "([^"]+)"/g;
    let m;
    while ((m = mainRegex.exec(section)) !== null) {
      const lat = parseFloat(m[3]);
      if (STATE_LATS.has(lat)) {
        entries.push({ id: m[1], name: m[2], address: m[5], lat, lng: parseFloat(m[4]) });
      }
    }

    console.log(`${arrName}: ${entries.length} entries need geocoding`);

    let fixed = 0;
    for (const entry of entries) {
      await sleep(1100); // Nominatim rate limit: 1 req/sec
      const result = await geocode(entry.address);
      if (result) {
        // Replace lat/lng in the section
        const oldCoords = `lat: ${entry.lat}, lng: ${entry.lng}`;
        const newCoords = `lat: ${result.lat}, lng: ${result.lng}`;
        // Find the specific entry and replace
        const entryStart = section.indexOf(`id: ${entry.id},`);
        if (entryStart !== -1) {
          const entryEnd = section.indexOf('}', entryStart);
          const entryStr = section.slice(entryStart, entryEnd);
          const newEntryStr = entryStr.replace(/lat: [\d.-]+, lng: [\d.-]+/, `lat: ${result.lat}, lng: ${result.lng}`);
          section = section.slice(0, entryStart) + newEntryStr + section.slice(entryEnd);
          fixed++;
          if (fixed % 10 === 0) {
            process.stdout.write(`  ${arrName}: ${fixed}/${entries.length} geocoded...\r`);
            // Save progress
            const newCode = code.slice(0, startIdx) + section + code.slice(endIdx);
            fs.writeFileSync('src/App.jsx', newCode);
          }
        }
      } else {
        totalFailed++;
      }
    }

    console.log(`\n✅ ${arrName}: geocoded ${fixed}/${entries.length}`);
    totalFixed += fixed;

    // Update code with fixed section
    code = code.slice(0, startIdx) + section + code.slice(endIdx);
    fs.writeFileSync('src/App.jsx', code);
  }

  console.log(`\n🎉 Done! Fixed ${totalFixed} locals, ${totalFailed} failed`);
  console.log('Now run: git add src/App.jsx && git commit -m "feat: geocode all locals to precise coordinates" && git push');
}

main().catch(console.error);
