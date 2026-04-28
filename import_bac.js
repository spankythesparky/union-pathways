const xlsx = require('xlsx');
const fs = require('fs');

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
  // Canadian provinces
  AB:{lat:53.546,lng:-113.494},BC:{lat:49.283,lng:-123.121},MB:{lat:49.895,lng:-97.138},
  NB:{lat:45.964,lng:-66.643},NL:{lat:47.562,lng:-52.713},NS:{lat:44.649,lng:-63.575},
  ON:{lat:43.653,lng:-79.383},PE:{lat:46.238,lng:-63.131},QC:{lat:45.502,lng:-73.567},
  SK:{lat:50.445,lng:-104.619},
};

const CITY_COORDS = {
  'OAKLAND,CA':{lat:37.8044,lng:-122.2712},'LAVERNE,CA':{lat:34.1011,lng:-117.7678},
  'WALLINGFORD,CT':{lat:41.4570,lng:-72.8232},'LAUREL,MD':{lat:39.0993,lng:-76.8483},
  'HONOLULU,HI':{lat:21.3069,lng:-157.8583},'MARSHALLTOWN,IA':{lat:42.0497,lng:-92.9080},
  "O'FALLON,IL":{lat:38.5895,lng:-89.9115},'ELMHURST,IL':{lat:41.8994,lng:-87.9401},
  'INDIANAPOLIS,IN':{lat:39.7684,lng:-86.1581},'CHARLESTOWN,MA':{lat:42.3792,lng:-71.0598},
  'WINNIPEG,MB':{lat:49.8951,lng:-97.1384},'WARREN,MI':{lat:42.4775,lng:-83.0277},
  'KANSAS CITY,MO':{lat:39.0997,lng:-94.5786},'FENTON,MO':{lat:38.5131,lng:-90.4432},
  'SAINT JOHN,NB':{lat:45.2733,lng:-66.0633},'CONCEPTION BAY SOUTH,NL':{lat:47.5109,lng:-53.0558},
  'BORDENTOWN,NJ':{lat:40.1440,lng:-74.7132},'HALIFAX,NS':{lat:44.6488,lng:-63.5752},
  'LAS VEGAS,NV':{lat:36.1699,lng:-115.1398},'LONG ISLAND CITY,NY':{lat:40.7447,lng:-73.9487},
  'ALBANY,NY':{lat:42.6526,lng:-73.7562},'ROCHESTER,NY':{lat:43.1566,lng:-77.6088},
  'AMHERST,OH':{lat:41.3978,lng:-82.2227},'OKLAHOMA CITY,OK':{lat:35.4676,lng:-97.5164},
  'PHILADELPHIA,PA':{lat:39.9526,lng:-75.1652},'HARRISBURG,PA':{lat:40.2732,lng:-76.8867},
  'PITTSBURGH,PA':{lat:40.4406,lng:-79.9959},'ATLANTA,GA':{lat:33.7490,lng:-84.3880},
  'TUKWILA,WA':{lat:47.4744,lng:-122.2613},'NEW BERLIN,WI':{lat:43.0386,lng:-88.1093},
  'MINNEAPOLIS,MN':{lat:44.9778,lng:-93.2650},'PORTLAND,OR':{lat:45.5051,lng:-122.6750},
  'EDMONTON,AB':{lat:53.5461,lng:-113.4938},'SURREY,BC':{lat:49.1913,lng:-122.8490},
  'OTTAWA,ON':{lat:45.4215,lng:-75.6972},'WINDSOR,ON':{lat:42.3149,lng:-83.0364},
  'SAINT-LEONARD,QC':{lat:45.5793,lng:-73.5870},'REGINA,SK':{lat:50.4452,lng:-104.6189},
};

function getCoords(address, cityState) {
  // Try to extract city from address
  const addrParts = address.replace(/\n/g,'').split(',');
  const zipStateMatch = address.match(/([A-Z]{2})\s+\d{5}/);
  const canadaMatch = address.match(/([A-Z]{2})\s+[A-Z]\d[A-Z]/);

  // Try city+state from cityState field
  const cs = (cityState || '').trim();
  const parts = cs.split(',');
  let city = '', state = '';
  if (parts.length >= 2) {
    city = parts[0].trim().toUpperCase();
    // Extract 2-letter state code
    const stateStr = parts[parts.length-1].trim().toUpperCase();
    const words = stateStr.split(' ');
    state = words.find(w => w.length === 2) || words[0].substring(0,2);
  }

  const cityKey = city + ',' + state;
  if (CITY_COORDS[cityKey]) return CITY_COORDS[cityKey];
  if (STATE_COORDS[state]) return STATE_COORDS[state];

  // Try from address
  if (zipStateMatch && STATE_COORDS[zipStateMatch[1]]) return STATE_COORDS[zipStateMatch[1]];
  if (canadaMatch && STATE_COORDS[canadaMatch[1]]) return STATE_COORDS[canadaMatch[1]];

  return null;
}

function cleanPhone(p) {
  if (!p) return null;
  p = String(p).replace(/\n/g,'').trim();
  // Fix scientific notation phone numbers like 8.00322283E9
  if (p.match(/^\d+\.\d+E\d+$/)) {
    p = Math.round(parseFloat(p)).toString();
    if (p.length === 10) p = `(${p.slice(0,3)}) ${p.slice(3,6)}-${p.slice(6)}`;
  }
  return p || null;
}

function cleanWebsite(url) {
  return (url||'').replace(/\n/g,'').trim().replace(/^https?:\/\//,'').replace(/\/$/,'') || null;
}

// Read spreadsheet
const wb = xlsx.readFile(process.env.HOME + '/Downloads/All_ BAC Locals (1).xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws);
console.log(`Found ${data.length} BAC locals`);

let id = 20500;
const locals = [];

data.forEach(row => {
  const localNum = row['Local'];
  const cityState = row['City / State'] || '';
  const address = (row['Address'] || '').replace(/\n+/g, ', ').trim();
  const phone = cleanPhone(row['Phone']);
  const website = cleanWebsite(row['Website']);
  const email = (row['Email'] || '').replace(/\n/g,'').trim() || null;

  // Build name
  const numStr = String(localNum).trim();
  const isNum = !isNaN(parseFloat(numStr));
  const name = isNum ? `BAC Local ${Math.floor(parseFloat(numStr))} (${cityState.trim()})` : `BAC ${numStr} (${cityState.trim()})`;

  const coords = getCoords(address, cityState);

  locals.push({
    id: id++,
    name,
    cityState: cityState.trim(),
    phone,
    website,
    email,
    address,
    lat: coords ? coords.lat : null,
    lng: coords ? coords.lng : null,
  });
});

const withCoords = locals.filter(l => l.lat).length;
console.log(`With coordinates: ${withCoords}/${locals.length}`);

// Generate JS
const jsEntries = locals.map(l => {
  // Parse city/state for display
  const parts = l.cityState.split(',');
  const city = parts[0].trim() || l.cityState;
  const stateRaw = parts[parts.length-1].trim();
  const state = stateRaw.split(' ').find(w => w.length === 2 && w === w.toUpperCase()) || stateRaw.substring(0,2);

  const p = [`id: ${l.id}`, `name: "${l.name}"`, `city: "${city}"`, `state: "${state}"`];
  if (l.phone) p.push(`phone: "${l.phone}"`);
  if (l.website) p.push(`website: "${l.website}"`);
  if (l.email) p.push(`email: "${l.email}"`);
  if (l.lat) p.push(`lat: ${l.lat}`, `lng: ${l.lng}`);
  if (l.address) p.push(`address: "${l.address.replace(/"/g,"'")}"`);
  return `  { ${p.join(', ')} }`;
}).join(',\n');

// Replace BAC_LOCALS in App.jsx
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIdx = code.indexOf('const BAC_LOCALS = [');
const endIdx = code.indexOf('];', startIdx) + 2;
if (startIdx === -1) { console.error('ERROR: BAC_LOCALS not found'); process.exit(1); }

code = code.slice(0, startIdx) + `const BAC_LOCALS = [\n${jsEntries}\n];` + code.slice(endIdx);
fs.writeFileSync('src/App.jsx', code);

console.log(`\n✅ Replaced BAC_LOCALS with ${locals.length} clean locals`);
console.log('🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: replace BAC locals with clean 39-entry database" && git push\n');
