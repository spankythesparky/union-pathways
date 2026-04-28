const xlsx = require('xlsx');
const fs = require('fs');

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
  'district of columbia':'DC','washington dc':'DC','washington d.c.':'DC',
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
  // Canadian
  AB:{lat:53.546,lng:-113.494},BC:{lat:49.283,lng:-123.121},MB:{lat:49.895,lng:-97.138},
  NB:{lat:45.964,lng:-66.643},NL:{lat:47.562,lng:-52.713},NS:{lat:44.649,lng:-63.575},
  ON:{lat:43.653,lng:-79.383},PE:{lat:46.238,lng:-63.131},QC:{lat:45.502,lng:-73.567},
  SK:{lat:50.445,lng:-104.619},
};

// ZIP prefix to lat/lng (3-digit)
function getZipCoords(zip) {
  if (!zip) return null;
  const z = String(zip).trim().replace(/[^0-9]/g,'');
  if (z.length < 3) return null;
  // Use state centers as fallback based on zip prefix ranges
  const prefix = parseInt(z.substring(0,3));
  if (prefix >= 0 && prefix <= 9) return STATE_COORDS['PR'] || null; // Puerto Rico
  if (prefix >= 10 && prefix <= 27) return STATE_COORDS['NY'];
  if (prefix >= 28 && prefix <= 29) return STATE_COORDS['NJ'];
  if (prefix >= 30 && prefix <= 59) return STATE_COORDS['PA'];
  if (prefix >= 60 && prefix <= 63) return STATE_COORDS['MA'];
  if (prefix >= 64 && prefix <= 69) return STATE_COORDS['RI'];
  if (prefix >= 70 && prefix <= 73) return STATE_COORDS['NH'];
  if (prefix >= 74 && prefix <= 76) return STATE_COORDS['ME'];
  if (prefix >= 77 && prefix <= 79) return STATE_COORDS['VT'];
  if (prefix >= 80 && prefix <= 83) return STATE_COORDS['CT'];
  if (prefix >= 84 && prefix <= 89) return STATE_COORDS['NJ'];
  if (prefix >= 90 && prefix <= 98) return STATE_COORDS['AE'] || null;
  if (prefix >= 100 && prefix <= 199) return STATE_COORDS['NY'];
  if (prefix >= 200 && prefix <= 209) return STATE_COORDS['DC'];
  if (prefix >= 210 && prefix <= 219) return STATE_COORDS['MD'];
  if (prefix >= 220 && prefix <= 246) return STATE_COORDS['VA'];
  if (prefix >= 247 && prefix <= 268) return STATE_COORDS['WV'];
  if (prefix >= 270 && prefix <= 289) return STATE_COORDS['NC'];
  if (prefix >= 290 && prefix <= 299) return STATE_COORDS['SC'];
  if (prefix >= 300 && prefix <= 319) return STATE_COORDS['GA'];
  if (prefix >= 320 && prefix <= 349) return STATE_COORDS['FL'];
  if (prefix >= 350 && prefix <= 369) return STATE_COORDS['AL'];
  if (prefix >= 370 && prefix <= 385) return STATE_COORDS['TN'];
  if (prefix >= 386 && prefix <= 397) return STATE_COORDS['MS'];
  if (prefix >= 398 && prefix <= 399) return STATE_COORDS['GA'];
  if (prefix >= 400 && prefix <= 427) return STATE_COORDS['KY'];
  if (prefix >= 430 && prefix <= 459) return STATE_COORDS['OH'];
  if (prefix >= 460 && prefix <= 479) return STATE_COORDS['IN'];
  if (prefix >= 480 && prefix <= 499) return STATE_COORDS['MI'];
  if (prefix >= 500 && prefix <= 528) return STATE_COORDS['IA'];
  if (prefix >= 530 && prefix <= 549) return STATE_COORDS['WI'];
  if (prefix >= 550 && prefix <= 567) return STATE_COORDS['MN'];
  if (prefix >= 570 && prefix <= 577) return STATE_COORDS['SD'];
  if (prefix >= 580 && prefix <= 588) return STATE_COORDS['ND'];
  if (prefix >= 590 && prefix <= 599) return STATE_COORDS['MT'];
  if (prefix >= 600 && prefix <= 629) return STATE_COORDS['IL'];
  if (prefix >= 630 && prefix <= 658) return STATE_COORDS['MO'];
  if (prefix >= 660 && prefix <= 679) return STATE_COORDS['KS'];
  if (prefix >= 680 && prefix <= 693) return STATE_COORDS['NE'];
  if (prefix >= 700 && prefix <= 714) return STATE_COORDS['LA'];
  if (prefix >= 716 && prefix <= 729) return STATE_COORDS['AR'];
  if (prefix >= 730 && prefix <= 749) return STATE_COORDS['OK'];
  if (prefix >= 750 && prefix <= 799) return STATE_COORDS['TX'];
  if (prefix >= 800 && prefix <= 816) return STATE_COORDS['CO'];
  if (prefix >= 820 && prefix <= 831) return STATE_COORDS['WY'];
  if (prefix >= 832 && prefix <= 838) return STATE_COORDS['ID'];
  if (prefix >= 840 && prefix <= 847) return STATE_COORDS['UT'];
  if (prefix >= 850 && prefix <= 865) return STATE_COORDS['AZ'];
  if (prefix >= 870 && prefix <= 884) return STATE_COORDS['NM'];
  if (prefix >= 885 && prefix <= 885) return STATE_COORDS['TX'];
  if (prefix >= 889 && prefix <= 898) return STATE_COORDS['NV'];
  if (prefix >= 900 && prefix <= 961) return STATE_COORDS['CA'];
  if (prefix >= 970 && prefix <= 979) return STATE_COORDS['OR'];
  if (prefix >= 980 && prefix <= 994) return STATE_COORDS['WA'];
  if (prefix >= 995 && prefix <= 999) return STATE_COORDS['AK'];
  return null;
}

function parseStateFromText(text) {
  if (!text) return null;
  const t = text.toLowerCase().trim();
  // Check full state names
  for (const [name, code] of Object.entries(STATE_ABBR)) {
    if (t.includes(name)) return code;
  }
  // Check 2-letter codes at end
  const m = t.match(/\b([a-z]{2})\s*$/);
  if (m) {
    const code = m[1].toUpperCase();
    if (STATE_COORDS[code]) return code;
  }
  return null;
}

function cleanPhone(p) {
  if (!p) return null;
  p = String(p).trim();
  if (p.match(/^\d+\.?\d*[Ee]\d+$/)) {
    p = Math.round(parseFloat(p)).toString();
  }
  return p.replace(/^\s*\)/, '(') || null;
}

function cleanWebsite(url) {
  return (url||'').trim().replace(/^https?:\/\//,'').replace(/\/$/,'').replace(/^\s+/,'') || null;
}

// Read all 3 sheets
const wb = xlsx.readFile(process.env.HOME + '/Downloads/All_ IBEW Inside List.xlsx');
const allRows = [];

wb.SheetNames.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws);
  allRows.push(...rows);
});

console.log(`Total rows from all sheets: ${allRows.length}`);

const seenLocals = new Set();
const locals = [];
let id = 10000;

allRows.forEach(row => {
  const localNum = row['Local'];
  if (!localNum) return;
  const num = Math.floor(parseFloat(String(localNum)));
  if (isNaN(num)) return;
  if (seenLocals.has(num)) { console.log(`Duplicate: IBEW Local ${num}`); return; }
  seenLocals.add(num);

  const cityState = (row['City / State'] || '').trim();
  const address = (row['Address'] || '').replace(/\n+/g,', ').trim();
  const phone = cleanPhone(row['Phone']);
  const website = cleanWebsite(row['Website']);
  const email = (row['Email'] || '').trim() || null;

  // Get state from cityState or address
  let state = parseStateFromText(cityState) || parseStateFromText(address);

  // Get zip from address
  const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  const zip = zipMatch ? zipMatch[1] : null;

  // Get coords
  let coords = null;
  if (zip) coords = getZipCoords(zip);
  if (!coords && state) coords = STATE_COORDS[state];

  // Parse city
  const csParts = cityState.split(',');
  const city = csParts[0].trim() || cityState;
  if (!state && csParts.length > 1) {
    state = parseStateFromText(csParts[csParts.length-1]) || 'US';
  }

  locals.push({
    id: id + num,
    name: `IBEW Local ${num}`,
    city,
    state: state || 'US',
    phone,
    website,
    email,
    address,
    lat: coords ? coords.lat : null,
    lng: coords ? coords.lng : null,
  });
});

locals.sort((a,b) => {
  const na = parseInt(a.name.replace('IBEW Local ',''));
  const nb = parseInt(b.name.replace('IBEW Local ',''));
  return na - nb;
});

const withCoords = locals.filter(l => l.lat).length;
console.log(`Unique locals: ${locals.length}, With coords: ${withCoords}`);

// Generate JS
const jsEntries = locals.map(l => {
  const p = [`id: ${l.id}`, `name: "${l.name}"`, `city: "${l.city}"`, `state: "${l.state}"`];
  if (l.phone) p.push(`phone: "${l.phone}"`);
  if (l.website) p.push(`website: "${l.website}"`);
  if (l.email) p.push(`email: "${l.email}"`);
  if (l.lat) p.push(`lat: ${l.lat}`, `lng: ${l.lng}`);
  if (l.address) p.push(`address: "${l.address.replace(/"/g,"'")}"`);
  return `  { ${p.join(', ')} }`;
}).join(',\n');

// Replace in App.jsx
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIdx = code.indexOf('const IBEW_INSIDE_LOCALS = [');
const endIdx = code.indexOf('];', startIdx) + 2;
if (startIdx === -1) { console.error('ERROR: IBEW_INSIDE_LOCALS not found'); process.exit(1); }

code = code.slice(0, startIdx) + `const IBEW_INSIDE_LOCALS = [\n${jsEntries}\n];` + code.slice(endIdx);
fs.writeFileSync('src/App.jsx', code);

console.log(`\n✅ Replaced IBEW_INSIDE_LOCALS with ${locals.length} locals`);
console.log('🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: update IBEW Inside to 286 locals" && git push\n');
