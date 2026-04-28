const xlsx = require('xlsx');
const fs = require('fs');

const PROV_COORDS = {
  ON:{lat:43.653,lng:-79.383},BC:{lat:49.283,lng:-123.121},AB:{lat:53.546,lng:-113.494},
  QC:{lat:45.502,lng:-73.567},MB:{lat:49.895,lng:-97.138},SK:{lat:50.445,lng:-104.619},
  NS:{lat:44.649,lng:-63.575},NB:{lat:45.964,lng:-66.643},NL:{lat:47.562,lng:-52.713},
  PE:{lat:46.238,lng:-63.131},
};

const STATE_COORDS = {
  AL:{lat:32.806,lng:-86.791},AK:{lat:61.370,lng:-152.404},AZ:{lat:33.729,lng:-111.431},
  AR:{lat:34.969,lng:-92.373},CA:{lat:36.778,lng:-119.418},CO:{lat:39.113,lng:-105.358},
  CT:{lat:41.597,lng:-72.755},DE:{lat:39.318,lng:-75.507},FL:{lat:27.664,lng:-81.515},
  GA:{lat:32.678,lng:-83.223},HI:{lat:21.094,lng:-157.498},ID:{lat:44.240,lng:-114.478},
  IL:{lat:40.349,lng:-88.986},IN:{lat:39.849,lng:-86.258},IA:{lat:42.011,lng:-93.210},
  KS:{lat:38.526,lng:-96.726},KY:{lat:37.668,lng:-84.670},LA:{lat:31.169,lng:-91.867},
  ME:{lat:44.693,lng:-69.381},MD:{lat:39.063,lng:-76.802},MA:{lat:42.230,lng:-71.530},
  MI:{lat:43.326,lng:-84.536},MN:{lat:45.694,lng:-93.900},MS:{lat:32.741,lng:-89.678},
  MO:{lat:38.456,lng:-92.288},MT:{lat:46.921,lng:-110.454},NE:{lat:41.125,lng:-98.268},
  NV:{lat:38.313,lng:-117.055},NH:{lat:43.452,lng:-71.563},NJ:{lat:40.298,lng:-74.521},
  NM:{lat:34.840,lng:-106.248},NY:{lat:42.165,lng:-74.948},NC:{lat:35.630,lng:-79.806},
  ND:{lat:47.528,lng:-99.784},OH:{lat:40.388,lng:-82.764},OK:{lat:35.565,lng:-96.928},
  OR:{lat:44.572,lng:-122.070},PA:{lat:40.590,lng:-77.209},RI:{lat:41.680,lng:-71.511},
  SC:{lat:33.856,lng:-80.945},SD:{lat:44.299,lng:-99.438},TN:{lat:35.747,lng:-86.692},
  TX:{lat:31.054,lng:-97.563},UT:{lat:40.150,lng:-111.862},VT:{lat:44.045,lng:-72.710},
  VA:{lat:37.769,lng:-78.169},WA:{lat:47.400,lng:-121.490},WV:{lat:38.491,lng:-80.954},
  WI:{lat:44.268,lng:-89.616},WY:{lat:42.755,lng:-107.302},DC:{lat:38.907,lng:-77.036},
  ...PROV_COORDS
};

const STATE_ABBR = {
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
  'district of columbia':'DC',
};

const CANADIAN_CITY_TO_PROV = {
  'hamilton':'ON','london':'ON','toronto':'ON','ottawa':'ON','windsor':'ON',
  'kitchener':'ON','thunder bay':'ON','sarnia':'ON','sudbury':'ON',
  'victoria':'BC','vancouver':'BC','kamloops':'BC','edmonton':'AB','calgary':'AB',
  'montreal':'QC','winnipeg':'MB','regina':'SK','halifax':'NS',
  'fredericton':'NB','saint john':'NB','moncton':'NB',"st. john's":'NL',
};

function parseLocation(cityState, address) {
  const cs = (cityState||'').toLowerCase().trim();
  const addr = (address||'').toLowerCase();

  const canadianProvs = [
    {k:'ontario',p:'ON'},{k:'british columbia',p:'BC'},{k:'alberta',p:'AB'},
    {k:'quebec',p:'QC'},{k:'manitoba',p:'MB'},{k:'saskatchewan',p:'SK'},
    {k:'nova scotia',p:'NS'},{k:'new brunswick',p:'NB'},{k:'newfoundland',p:'NL'},
  ];
  for (const {k,p} of canadianProvs) {
    if (cs.includes(k)||addr.includes(k)) {
      const city = cs.split(',')[0].trim();
      return { city, state: p, coords: STATE_COORDS[p] };
    }
  }
  if (cs.includes('canada')) {
    const city = cs.split(',')[0].trim().replace(' canada','').trim();
    const prov = CANADIAN_CITY_TO_PROV[city] || 'ON';
    return { city, state: prov, coords: STATE_COORDS[prov] };
  }

  for (const [name,code] of Object.entries(STATE_ABBR)) {
    if (cs.includes(name)) {
      const city = cs.split(',')[0].trim();
      return { city, state: code, coords: STATE_COORDS[code] };
    }
  }

  const parts = cs.split(',');
  let state = null, city = parts[0].trim();
  if (parts.length >= 2) {
    const last = parts[parts.length-1].trim().replace(/[^a-z]/g,'');
    if (last.length === 2) state = last.toUpperCase();
  }
  if (!state) {
    const m = cs.match(/\b([a-z]{2})\s*$/);
    if (m) state = m[1].toUpperCase();
  }
  const coords = (state && STATE_COORDS[state]) ? STATE_COORDS[state] : null;
  return { city, state: state||'US', coords };
}

function cleanPhone(p) {
  if (!p) return null;
  return String(p).trim().replace(/\n/g,'') || null;
}

function cleanWebsite(url) {
  return (url||'').trim().replace(/^https?:\/\//,'').replace(/\/$/,'') || null;
}

function importTrade(filename, prefix, startId, localPrefix) {
  const wb = xlsx.readFile(process.env.HOME + '/Downloads/' + filename);
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  console.log(`${localPrefix}: ${rows.length} rows`);

  const seen = new Set();
  const locals = [];

  rows.forEach(row => {
    const localNum = row['Local Number'] || row['Local'];
    if (!localNum) return;
    const num = Math.floor(parseFloat(String(localNum)));
    if (isNaN(num)) return;
    if (seen.has(num)) { console.log('Duplicate:', num); return; }
    seen.add(num);

    const cityState = (row['City / State']||'').trim();
    const address = (row['Address']||'').replace(/\n+/g,', ').trim();
    const phone = cleanPhone(row['Phone']);
    const website = cleanWebsite(row['Website']);
    const email = (row['Email']||'').trim() || null;
    const { city, state, coords } = parseLocation(cityState, address);

    locals.push({
      id: startId + num,
      name: `${localPrefix} Local ${num}`,
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      state,
      phone, website, email, address,
      lat: coords ? coords.lat : null,
      lng: coords ? coords.lng : null,
    });
  });

  locals.sort((a,b) => {
    const na = parseInt(a.name.split(' Local ')[1]);
    const nb = parseInt(b.name.split(' Local ')[1]);
    return na - nb;
  });

  const withCoords = locals.filter(l => l.lat).length;
  console.log(`  Unique: ${locals.length}, With coords: ${withCoords}`);
  return locals;
}

// Import both trades
const insulators = importTrade('All_ Insulators Union.xlsx', 'HFIAW', 50000, 'HFIAW');
const elevators = importTrade('All_ Elevators Union.xlsx', 'IUEC', 51000, 'IUEC');

function toJS(locals) {
  return locals.map(l => {
    const p = [`id: ${l.id}`, `name: "${l.name}"`, `city: "${l.city}"`, `state: "${l.state}"`];
    if (l.phone) p.push(`phone: "${l.phone}"`);
    if (l.website) p.push(`website: "${l.website}"`);
    if (l.email) p.push(`email: "${l.email}"`);
    if (l.lat) p.push(`lat: ${l.lat}`, `lng: ${l.lng}`);
    if (l.address) p.push(`address: "${l.address.replace(/"/g,"'")}"`);
    return `  { ${p.join(', ')} }`;
  }).join(',\n');
}

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Check if arrays already exist
if (code.includes('const HFIAW_LOCALS')) {
  // Replace existing
  const s1 = code.indexOf('const HFIAW_LOCALS = [');
  const e1 = code.indexOf('];', s1) + 2;
  code = code.slice(0, s1) + `const HFIAW_LOCALS = [\n${toJS(insulators)}\n];` + code.slice(e1);
  console.log('✅ Replaced HFIAW_LOCALS');
} else {
  // Insert after IW_LOCALS
  const iwEnd = code.indexOf('];', code.indexOf('const IW_LOCALS = [')) + 2;
  code = code.slice(0, iwEnd) + `\n\nconst HFIAW_LOCALS = [\n${toJS(insulators)}\n];` + code.slice(iwEnd);
  console.log('✅ Added HFIAW_LOCALS');
}

if (code.includes('const IUEC_LOCALS')) {
  const s2 = code.indexOf('const IUEC_LOCALS = [');
  const e2 = code.indexOf('];', s2) + 2;
  code = code.slice(0, s2) + `const IUEC_LOCALS = [\n${toJS(elevators)}\n];` + code.slice(e2);
  console.log('✅ Replaced IUEC_LOCALS');
} else {
  const hfiawEnd = code.indexOf('];', code.indexOf('const HFIAW_LOCALS = [')) + 2;
  code = code.slice(0, hfiawEnd) + `\n\nconst IUEC_LOCALS = [\n${toJS(elevators)}\n];` + code.slice(hfiawEnd);
  console.log('✅ Added IUEC_LOCALS');
}

fs.writeFileSync('src/App.jsx', code);
console.log(`\n✅ Insulators: ${insulators.length} locals`);
console.log(`✅ Elevators: ${elevators.length} locals`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Insulators and Elevators locals" && git push\n');
