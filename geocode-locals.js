// geocode-locals.js v2 — Verify and fix lat/lng for every union local using OpenStreetMap Nominatim
//
// Improvements over v1:
//   - Country filtered to US/Canada only (kills global mismatches like Indonesia/Ghana)
//   - Uses structured Nominatim queries (street + city + state separately, not free-form)
//   - REJECTS any "fix" that would move a pin >150 miles from its current location
//     (any change that big almost certainly means we matched the wrong place)
//   - Reports the geocoder's interpretation so you can spot-check
//   - Wider safe distance threshold (5 miles instead of 1) — only fixes pins that are clearly wrong
//
// Rate limit: 1.1 seconds per request (Nominatim's policy)
// Estimated runtime: ~30 minutes for ~1,500 locals
//
// SAFE TO INTERRUPT: progress is saved every 25 locals to .geocode-progress.json

const fs = require('fs');
const https = require('https');

const FILE = 'src/App.jsx';
const PROGRESS = '.geocode-progress.json';
const REPORT = 'geocode-report.txt';

const RATE_LIMIT_MS = 1100;
const FIX_THRESHOLD_MI = 5.0;       // Only flag as needing a fix if existing pin is >5mi from geocoded
const REJECT_THRESHOLD_MI = 150.0;  // Reject the fix if proposed change is >150mi (almost certainly wrong match)

// ==================== Helpers ====================

function distanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// State / province → country
const CA_PROV = new Set(['ON','QC','BC','AB','MB','SK','NS','NB','NL','PE','NT','YT','NU']);

function inferCountry(state, address) {
  if (CA_PROV.has((state || '').toUpperCase())) return 'ca';
  // Some addresses say "CAN" at the end
  if (address && /\b(CANADA|CAN)\b/i.test(address)) return 'ca';
  return 'us';
}

// Structured Nominatim query — much more precise than free-form
function geocodeStructured({ street, city, state, country }) {
  return new Promise((resolve, reject) => {
    const params = [];
    if (street) params.push(`street=${encodeURIComponent(street)}`);
    if (city) params.push(`city=${encodeURIComponent(city)}`);
    if (state) params.push(`state=${encodeURIComponent(state)}`);
    params.push(`countrycodes=${country}`);
    params.push('format=json');
    params.push('limit=1');

    const url = `https://nominatim.openstreetmap.org/search?${params.join('&')}`;
    const opts = {
      headers: {
        'User-Agent': 'UnionPathways-LocalGeocoder/2.0 (https://unionpathways.com)',
        'Accept-Language': 'en'
      }
    };
    https.get(url, opts, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (Array.isArray(data) && data.length > 0) {
            resolve({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name });
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Parse "297 N Marengo Ave, Pasadena, CA 91101" into pieces
function parseAddress(addr) {
  // Try splitting by comma — typically "street, city, state zip"
  const parts = addr.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return {
      street: parts[0],
      city: parts[1],
      stateZip: parts[2],
    };
  }
  if (parts.length === 2) {
    return { street: parts[0], city: parts[1], stateZip: '' };
  }
  return { street: addr, city: '', stateZip: '' };
}

function parseLocal(block) {
  const idMatch = block.match(/\bid\s*:\s*([\d]+)/);
  const nameMatch = block.match(/\bname\s*:\s*"([^"]+)"/);
  const addressMatch = block.match(/\baddress\s*:\s*"([^"]+)"/);
  const latMatch = block.match(/\blat\s*:\s*(-?[\d.]+)/);
  const lngMatch = block.match(/\blng\s*:\s*(-?[\d.]+)/);
  const cityMatch = block.match(/\bcity\s*:\s*"([^"]+)"/);
  const stateMatch = block.match(/\bstate\s*:\s*"([^"]+)"/);
  if (!idMatch || !nameMatch || !addressMatch) return null;
  return {
    id: idMatch[1],
    name: nameMatch[1],
    address: addressMatch[1],
    lat: latMatch ? parseFloat(latMatch[1]) : null,
    lng: lngMatch ? parseFloat(lngMatch[1]) : null,
    hasCoords: !!(latMatch && lngMatch),
    city: cityMatch ? cityMatch[1] : '',
    state: stateMatch ? stateMatch[1] : '',
  };
}

// ==================== Main ====================

(async () => {
  if (!fs.existsSync(FILE)) {
    console.error(`ERROR: ${FILE} not found. Run this script from your project root.`);
    process.exit(1);
  }

  let code = fs.readFileSync(FILE, 'utf8');
  const localRegex = /\{\s*id:\s*\d[^{}]*?\}/g;
  const matches = [...code.matchAll(localRegex)];

  const candidates = matches
    .map(m => ({ block: m[0] }))
    .filter(m => m.block.includes('address:'));

  const withCoords = candidates.filter(c => c.block.includes('lat:') && c.block.includes('lng:')).length;
  console.log(`Found ${candidates.length} candidate locals.`);
  console.log(`  ${withCoords} have existing coordinates`);
  console.log(`  ${candidates.length - withCoords} are missing coordinates`);
  console.log(`\nSettings:`);
  console.log(`  Fix threshold: pin >${FIX_THRESHOLD_MI}mi from geocoded → fix it`);
  console.log(`  Reject threshold: proposed change >${REJECT_THRESHOLD_MI}mi → reject as suspicious`);
  console.log(`  Country filter: US + Canada only\n`);

  let progress = { processedIds: {}, fixed: [], inserted: [], skipped: [], rejected: [], failed: [] };
  if (fs.existsSync(PROGRESS)) {
    try {
      progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
      ['fixed','inserted','skipped','rejected','failed'].forEach(k => { if (!progress[k]) progress[k] = []; });
      console.log(`Resuming. Already processed: ${Object.keys(progress.processedIds).length}\n`);
    } catch {}
  }

  const startedAt = Date.now();
  let processedSinceStart = 0;

  for (let i = 0; i < candidates.length; i++) {
    const { block } = candidates[i];
    const local = parseLocal(block);
    if (!local) continue;

    if (progress.processedIds[local.id]) continue;

    const eta = processedSinceStart > 0
      ? Math.ceil((candidates.length - i) * RATE_LIMIT_MS / 1000 / 60)
      : '?';
    process.stdout.write(`\r[${i+1}/${candidates.length}] ETA ${eta}m  ${local.name.padEnd(30).slice(0,30)}  `);

    const country = inferCountry(local.state, local.address);
    const parsed = parseAddress(local.address);
    const street = parsed.street;
    const city = local.city || parsed.city;
    const state = local.state;

    let geo = null;
    try {
      geo = await geocodeStructured({ street, city, state, country });
      // If structured fails AND we have a city, try city-only
      if (!geo && city) {
        await sleep(RATE_LIMIT_MS);
        geo = await geocodeStructured({ street: '', city, state, country });
      }
    } catch (e) {
      progress.failed.push({ id: local.id, name: local.name, reason: 'network: ' + e.message });
      progress.processedIds[local.id] = true;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    if (!geo) {
      progress.failed.push({ id: local.id, name: local.name, address: local.address, reason: 'no result' });
      progress.processedIds[local.id] = true;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    if (!local.hasCoords) {
      // INSERT case — no existing coords to compare against, but we should still sanity-check
      // by making sure the geocoded result is in roughly the right state.
      const newLat = geo.lat.toFixed(6);
      const newLng = geo.lng.toFixed(6);
      const newBlock = block.replace(/\baddress:/, `lat: ${newLat}, lng: ${newLng}, address:`);
      if (code.split(block).length === 2) {
        code = code.replace(block, newBlock);
        progress.inserted.push({
          id: local.id, name: local.name,
          new: { lat: parseFloat(newLat), lng: parseFloat(newLng) },
          interpreted: geo.display,
        });
      } else {
        progress.failed.push({ id: local.id, name: local.name, reason: 'block not unique' });
      }
    } else {
      const dist = distanceMiles(local.lat, local.lng, geo.lat, geo.lng);

      if (dist > REJECT_THRESHOLD_MI) {
        // Reject — proposed change is too big to trust
        progress.rejected.push({
          id: local.id, name: local.name,
          old: { lat: local.lat, lng: local.lng },
          proposed: { lat: geo.lat, lng: geo.lng },
          distMiles: dist.toFixed(1),
          interpreted: geo.display,
        });
      } else if (dist > FIX_THRESHOLD_MI) {
        // Fix — the pin is wrong but not so wildly wrong that we should suspect a bad match
        const newLat = geo.lat.toFixed(6);
        const newLng = geo.lng.toFixed(6);
        let newBlock = block;
        newBlock = newBlock.replace(/\blat\s*:\s*-?[\d.]+/, `lat: ${newLat}`);
        newBlock = newBlock.replace(/\blng\s*:\s*-?[\d.]+/, `lng: ${newLng}`);
        if (code.split(block).length === 2) {
          code = code.replace(block, newBlock);
          progress.fixed.push({
            id: local.id, name: local.name,
            old: { lat: local.lat, lng: local.lng },
            new: { lat: parseFloat(newLat), lng: parseFloat(newLng) },
            distMiles: dist.toFixed(2),
            interpreted: geo.display,
          });
        } else {
          progress.failed.push({ id: local.id, name: local.name, reason: 'block not unique' });
        }
      } else {
        progress.skipped.push({ id: local.id, name: local.name, distMiles: dist.toFixed(2) });
      }
    }

    progress.processedIds[local.id] = true;
    processedSinceStart++;

    if (processedSinceStart % 25 === 0) {
      fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
      fs.writeFileSync(FILE, code);
    }

    await sleep(RATE_LIMIT_MS);
  }

  fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
  fs.writeFileSync(FILE, code);

  const lines = [];
  lines.push('=== GEOCODING REPORT v2 ===');
  lines.push(`Total processed: ${Object.keys(progress.processedIds).length}`);
  lines.push(`Fixed (between ${FIX_THRESHOLD_MI}mi and ${REJECT_THRESHOLD_MI}mi off): ${progress.fixed.length}`);
  lines.push(`Inserted (had no coords): ${progress.inserted.length}`);
  lines.push(`Skipped (already accurate within ${FIX_THRESHOLD_MI}mi): ${progress.skipped.length}`);
  lines.push(`REJECTED (proposed change >${REJECT_THRESHOLD_MI}mi, suspicious): ${progress.rejected.length}`);
  lines.push(`Failed (no geocode result): ${progress.failed.length}`);
  lines.push('');

  lines.push('--- INSERTED (had no coordinates before) ---');
  progress.inserted.forEach(f => {
    lines.push(`${f.name} (id ${f.id})  →  ${f.new.lat}, ${f.new.lng}`);
    if (f.interpreted) lines.push(`  Geocoder said: ${f.interpreted}`);
  });
  lines.push('');

  lines.push('--- FIXED ---');
  progress.fixed
    .sort((a, b) => parseFloat(b.distMiles) - parseFloat(a.distMiles))
    .forEach(f => {
      lines.push(`[${f.distMiles}mi off] ${f.name} (id ${f.id})`);
      lines.push(`  Old: ${f.old.lat}, ${f.old.lng}  →  New: ${f.new.lat}, ${f.new.lng}`);
      if (f.interpreted) lines.push(`  Geocoder said: ${f.interpreted}`);
    });
  lines.push('');

  lines.push('--- REJECTED (proposed change was too big — old pin kept) ---');
  progress.rejected.forEach(f => {
    lines.push(`[${f.distMiles}mi proposed move] ${f.name} (id ${f.id})`);
    lines.push(`  Kept: ${f.old.lat}, ${f.old.lng}`);
    lines.push(`  Rejected: ${f.proposed.lat}, ${f.proposed.lng}`);
    if (f.interpreted) lines.push(`  Geocoder said: ${f.interpreted}`);
  });
  lines.push('');

  lines.push('--- FAILED (no geocode result) ---');
  progress.failed.forEach(f => {
    lines.push(`${f.name} (id ${f.id}): ${f.reason}`);
    if (f.address) lines.push(`  address: ${f.address}`);
  });

  fs.writeFileSync(REPORT, lines.join('\n'));

  const minutes = Math.round((Date.now() - startedAt) / 1000 / 60);
  const totalChanges = progress.fixed.length + progress.inserted.length;
  console.log(`\n\n✅ Done in ${minutes} minutes.`);
  console.log(`   Fixed: ${progress.fixed.length}`);
  console.log(`   Inserted: ${progress.inserted.length}`);
  console.log(`   Skipped: ${progress.skipped.length}`);
  console.log(`   Rejected: ${progress.rejected.length}`);
  console.log(`   Failed: ${progress.failed.length}`);
  console.log(`   Full report: ${REPORT}`);
  console.log(`\nReview ${REPORT} carefully BEFORE committing.`);
  console.log(`If everything looks good:`);
  console.log(`   git add src/App.jsx && git commit -m "fix: geocode ${totalChanges} local coordinates" && git push`);
  console.log(`   rm ${PROGRESS} ${REPORT}\n`);
})().catch(e => {
  console.error('\nScript error:', e);
  console.error('Progress saved. Re-run to resume.');
  process.exit(1);
});
