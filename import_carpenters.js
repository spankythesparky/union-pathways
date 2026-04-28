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

const STATE_NAMES = {
  'alabama':'AL','alaska':'AK','arizona':'AZ','arkansas':'AR','california':'CA',
  'colorado':'CO','connecticut':'CT','delaware':'DE','florida':'FL','georgia':'GA',
  'hawaii':'HI','idaho':'ID','illinois':'IL','indiana':'IN','iowa':'IA','kansas':'KS',
  'kentucky':'KY','louisiana':'LA','maine':'ME','maryland':'MD','massachusetts':'MA',
  'michigan':'MI','minnesota':'MN','mississippi':'MS','missouri':'MO','montana':'MT',
  'nebraska':'NE','nevada':'NV','new hampshire':'NH','new jersey':'NJ','new mexico':'NM',
  'new york':'NY','north carolina':'NC','north dakota':'ND','ohio':'OH','oklahoma':'OK',
  'oregon':'OR','pennsylvania':'PA','rhode island':'RI','south carolina':'SC',
  'south dakota':'SD','tennessee':'TN','texas':'TX','utah':'UT','vermont':'VT',
  'virginia':'VA','washington':'WA','west virginia':'WV','wisconsin':'WI','wyoming':'WY',
  'district of columbia':'DC','ontario':'ON','british columbia':'BC','alberta':'AB',
  'quebec':'QC','manitoba':'MB','saskatchewan':'SK','nova scotia':'NS',
  'new brunswick':'NB','newfoundland':'NL',
};

function parseState(cityState) {
  const cs = (cityState || '').toLowerCase().trim();
  for (const [name, code] of Object.entries(STATE_NAMES)) {
    if (cs.includes(name)) return code;
  }
  const m = cs.match(/,\s*([a-z]{2})\s*$/);
  if (m) return m[1].toUpperCase();
  return 'US';
}

function parseCity(cityState) {
  return (cityState || '').trim().split(',')[0].trim();
}

async function main() {
  const wb = xlsx.readFile(process.env.HOME + '/Downloads/All_ Carpenters Locals.xlsx');
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  console.log(`Found ${rows.length} rows`);

  const seen = new Set();
  const locals = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const localNum = row['Local Number'];
    if (!localNum) continue;
    const num = Math.floor(parseFloat(String(localNum)));
    if (isNaN(num)) continue;

    // Handle duplicates by appending city
    const cityState = (row['City / State'] || '').trim();
    const address = (row['Address'] || '').replace(/\n+/g, ', ').trim();
    const phone = (row['Phone'] || '').replace(/\n/g,'').trim() || null;
    const website = (row['Website'] || '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '') || null;
    const email = (row['Email'] || '').replace(/\n/g,'').trim() || null;
    const city = parseCity(cityState);
    const state = parseState(cityState);

    // Create unique ID
    const baseId = 70000 + num;
    let id = baseId;
    let suffix = 0;
    while (seen.has(id)) { suffix++; id = baseId * 100 + suffix; }
    seen.add(id);

    // Name — add city if duplicate number
    const nameCount = [...seen].filter(i => Math.floor(i/100) === baseId || i === baseId).length;
    const name = suffix > 0 ? `UBC Local ${num} (${city})` : `UBC Local ${num}`;

    process.stdout.write(`[${i+1}/${rows.length}] Geocoding ${name}... `);
    await sleep(1100);
    let coords = await geocode(address);
    if (!coords) {
      await sleep(1100);
      coords = await geocode(cityState + ', USA');
    }
    console.log(coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'NO COORDS');

    locals.push({
      id, name,
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      state,
      phone, website, email, address,
      lat: coords ? coords.lat : null,
      lng: coords ? coords.lng : null,
    });
  }

  const withCoords = locals.filter(l => l.lat).length;
  console.log(`\nGeocoded: ${withCoords}/${locals.length}`);

  const jsEntries = locals.map(l => {
    const p = [`id: ${l.id}`, `name: "${l.name}"`, `city: "${l.city}"`, `state: "${l.state}"`];
    if (l.phone) p.push(`phone: "${l.phone}"`);
    if (l.website) p.push(`website: "${l.website}"`);
    if (l.email) p.push(`email: "${l.email}"`);
    if (l.lat) p.push(`lat: ${l.lat}`, `lng: ${l.lng}`);
    if (l.address) p.push(`address: "${l.address.replace(/"/g,"'")}"`);
    return `  { ${p.join(', ')} }`;
  }).join(',\n');

  let code = fs.readFileSync('src/App.jsx', 'utf8');

  if (code.includes('const UBC_LOCALS = [')) {
    const s = code.indexOf('const UBC_LOCALS = [');
    const e = code.indexOf('];', s) + 2;
    code = code.slice(0, s) + `const UBC_LOCALS = [\n${jsEntries}\n];` + code.slice(e);
    console.log('Replaced UBC_LOCALS');
  } else {
    const iuoeEnd = code.indexOf('];', code.indexOf('const IUOE_LOCALS = [')) + 2;
    code = code.slice(0, iuoeEnd) + `\n\nconst UBC_LOCALS = [\n${jsEntries}\n];` + code.slice(iuoeEnd);
    console.log('Added UBC_LOCALS');
  }

  fs.writeFileSync('src/App.jsx', code);
  console.log(`\nDone! ${locals.length} locals added`);
  console.log('Now run: git add src/App.jsx && git commit -m "feat: add UBC Carpenters 291 locals" && git push');
}

main().catch(console.error);
