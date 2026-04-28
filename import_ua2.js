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
};

const CITY_COORDS = {
  'WORCESTER,MA':{lat:42.2626,lng:-71.8023},'BOSTON,MA':{lat:42.3601,lng:-71.0589},
  'SPRINGFIELD,MA':{lat:42.1015,lng:-72.5898},'NEW YORK,NY':{lat:40.7128,lng:-74.0059},
  'LOS ANGELES,CA':{lat:34.0522,lng:-118.2437},'CHICAGO,IL':{lat:41.8781,lng:-87.6298},
  'HOUSTON,TX':{lat:29.7604,lng:-95.3698},'PHOENIX,AZ':{lat:33.4484,lng:-112.0740},
  'PHILADELPHIA,PA':{lat:39.9526,lng:-75.1652},'SAN ANTONIO,TX':{lat:29.4241,lng:-98.4936},
  'SAN DIEGO,CA':{lat:32.7157,lng:-117.1611},'DALLAS,TX':{lat:32.7767,lng:-96.7970},
  'SAN JOSE,CA':{lat:37.3382,lng:-121.8863},'AUSTIN,TX':{lat:30.2672,lng:-97.7431},
  'SAN FRANCISCO,CA':{lat:37.7749,lng:-122.4194},'COLUMBUS,OH':{lat:39.9612,lng:-82.9988},
  'SEATTLE,WA':{lat:47.6062,lng:-122.3321},'DENVER,CO':{lat:39.7392,lng:-104.9903},
  'NASHVILLE,TN':{lat:36.1627,lng:-86.7816},'OKLAHOMA CITY,OK':{lat:35.4676,lng:-97.5164},
  'WASHINGTON,DC':{lat:38.9072,lng:-77.0369},'LOUISVILLE,KY':{lat:38.2527,lng:-85.7585},
  'LAS VEGAS,NV':{lat:36.1699,lng:-115.1398},'MEMPHIS,TN':{lat:35.1495,lng:-90.0490},
  'PORTLAND,OR':{lat:45.5051,lng:-122.6750},'BALTIMORE,MD':{lat:39.2904,lng:-76.6122},
  'MILWAUKEE,WI':{lat:43.0389,lng:-87.9065},'ALBUQUERQUE,NM':{lat:35.0844,lng:-106.6504},
  'TUCSON,AZ':{lat:32.2226,lng:-110.9747},'FRESNO,CA':{lat:36.7378,lng:-119.7871},
  'SACRAMENTO,CA':{lat:38.5816,lng:-121.4944},'KANSAS CITY,MO':{lat:39.0997,lng:-94.5786},
  'ATLANTA,GA':{lat:33.7490,lng:-84.3880},'OMAHA,NE':{lat:41.2565,lng:-95.9345},
  'MINNEAPOLIS,MN':{lat:44.9778,lng:-93.2650},'TAMPA,FL':{lat:27.9506,lng:-82.4572},
  'NEW ORLEANS,LA':{lat:29.9511,lng:-90.0715},'CLEVELAND,OH':{lat:41.4993,lng:-81.6944},
  'PITTSBURGH,PA':{lat:40.4406,lng:-79.9959},'ST. LOUIS,MO':{lat:38.6270,lng:-90.1994},
  'ST LOUIS,MO':{lat:38.6270,lng:-90.1994},'CINCINNATI,OH':{lat:39.1031,lng:-84.5120},
  'DETROIT,MI':{lat:42.3314,lng:-83.0458},'MIAMI,FL':{lat:25.7617,lng:-80.1918},
  'ORLANDO,FL':{lat:28.5383,lng:-81.3792},'CHARLOTTE,NC':{lat:35.2271,lng:-80.8431},
  'INDIANAPOLIS,IN':{lat:39.7684,lng:-86.1581},'RALEIGH,NC':{lat:35.7796,lng:-78.6382},
  'HARTFORD,CT':{lat:41.7658,lng:-72.6851},'RICHMOND,VA':{lat:37.5407,lng:-77.4360},
  'BIRMINGHAM,AL':{lat:33.5186,lng:-86.8104},'MONTGOMERY,AL':{lat:32.3668,lng:-86.2999},
  'BUFFALO,NY':{lat:42.8864,lng:-78.8784},'ROCHESTER,NY':{lat:43.1566,lng:-77.6088},
  'ALBANY,NY':{lat:42.6526,lng:-73.7562},'SYRACUSE,NY':{lat:43.0481,lng:-76.1474},
  'TOLEDO,OH':{lat:41.6528,lng:-83.5379},'AKRON,OH':{lat:41.0814,lng:-81.5190},
  'DAYTON,OH':{lat:39.7589,lng:-84.1916},'GRAND RAPIDS,MI':{lat:42.9634,lng:-85.6681},
  'SALT LAKE CITY,UT':{lat:40.7608,lng:-111.8910},'BOISE,ID':{lat:43.6150,lng:-116.2023},
  'SPOKANE,WA':{lat:47.6588,lng:-117.4260},'TACOMA,WA':{lat:47.2529,lng:-122.4443},
  'KNOXVILLE,TN':{lat:35.9606,lng:-83.9207},'CHATTANOOGA,TN':{lat:35.0456,lng:-85.3097},
  'LITTLE ROCK,AR':{lat:34.7465,lng:-92.2896},'JACKSON,MS':{lat:32.2988,lng:-90.1848},
  'BATON ROUGE,LA':{lat:30.4515,lng:-91.1871},'SHREVEPORT,LA':{lat:32.5252,lng:-93.7502},
  'DES MOINES,IA':{lat:41.5868,lng:-93.6250},'CEDAR RAPIDS,IA':{lat:41.9779,lng:-91.6656},
  'MADISON,WI':{lat:43.0731,lng:-89.4012},'GREEN BAY,WI':{lat:44.5133,lng:-88.0133},
  'FARGO,ND':{lat:46.8772,lng:-96.7898},'SIOUX FALLS,SD':{lat:43.5446,lng:-96.7311},
  'OMAHA,NE':{lat:41.2565,lng:-95.9345},'LINCOLN,NE':{lat:40.8136,lng:-96.7026},
  'WICHITA,KS':{lat:37.6872,lng:-97.3301},'TOPEKA,KS':{lat:39.0473,lng:-95.6752},
  'TULSA,OK':{lat:36.1540,lng:-95.9928},'FORT WORTH,TX':{lat:32.7555,lng:-97.3308},
  'EL PASO,TX':{lat:31.7619,lng:-106.4850},'CORPUS CHRISTI,TX':{lat:27.8006,lng:-97.3964},
  'LUBBOCK,TX':{lat:33.5779,lng:-101.8552},'AMARILLO,TX':{lat:35.2220,lng:-101.8313},
  'ALBUQUERQUE,NM':{lat:35.0844,lng:-106.6504},'SANTA FE,NM':{lat:35.6870,lng:-105.9378},
  'TUCSON,AZ':{lat:32.2226,lng:-110.9747},'MESA,AZ':{lat:33.4152,lng:-111.8315},
  'LAS VEGAS,NV':{lat:36.1699,lng:-115.1398},'RENO,NV':{lat:39.5296,lng:-119.8138},
  'BAKERSFIELD,CA':{lat:35.3733,lng:-119.0187},'RIVERSIDE,CA':{lat:33.9806,lng:-117.3755},
  'ANAHEIM,CA':{lat:33.8366,lng:-117.9143},'STOCKTON,CA':{lat:37.9577,lng:-121.2908},
  'CHARLESTON,WV':{lat:38.3498,lng:-81.6326},'HUNTINGTON,WV':{lat:38.4193,lng:-82.4452},
  'COLUMBIA,SC':{lat:34.0007,lng:-81.0348},'GREENVILLE,SC':{lat:34.8526,lng:-82.3940},
  'JACKSONVILLE,FL':{lat:30.3322,lng:-81.6557},'FORT LAUDERDALE,FL':{lat:26.1224,lng:-80.1373},
  'ST. PAUL,MN':{lat:44.9537,lng:-93.0900},'ST PAUL,MN':{lat:44.9537,lng:-93.0900},
  'ANCHORAGE,AK':{lat:61.2181,lng:-149.9003},'HONOLULU,HI':{lat:21.3069,lng:-157.8583},
  'PORTLAND,ME':{lat:43.6591,lng:-70.2568},'MANCHESTER,NH':{lat:42.9956,lng:-71.4548},
  'BURLINGTON,VT':{lat:44.4759,lng:-73.2121},'PROVIDENCE,RI':{lat:41.8240,lng:-71.4128},
  'NEW HAVEN,CT':{lat:41.3083,lng:-72.9279},'BRIDGEPORT,CT':{lat:41.1865,lng:-73.1952},
  'TRENTON,NJ':{lat:40.2171,lng:-74.7429},'NEWARK,NJ':{lat:40.7357,lng:-74.1724},
  'WILMINGTON,DE':{lat:39.7447,lng:-75.5484},'ANNAPOLIS,MD':{lat:38.9784,lng:-76.4922},
  'NORFOLK,VA':{lat:36.8508,lng:-76.2859},'ROANOKE,VA':{lat:37.2710,lng:-79.9414},
};

function getCoords(city, state) {
  const key = city.toUpperCase() + ',' + state.toUpperCase();
  if (CITY_COORDS[key]) return CITY_COORDS[key];
  if (STATE_COORDS[state]) return STATE_COORDS[state];
  return null;
}

function parseCityState(str) {
  str = str.trim();
  const parts = str.split(',');
  if (parts.length >= 2) {
    const city = parts[0].trim();
    const stateRaw = parts[parts.length - 1].trim();
    const state = stateRaw.split(' ').find(s => s.length === 2 && s === s.toUpperCase()) || stateRaw.substring(0, 2).toUpperCase();
    return { city, state };
  }
  const words = str.split(' ');
  const state = words[words.length - 1].toUpperCase().substring(0, 2);
  const city = words.slice(0, -1).join(' ');
  return { city, state };
}

function cleanWebsite(url) {
  return (url || '').replace(/\n/g, '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function cleanPhone(p) {
  return (p || '').replace(/\n/g, '').trim();
}

// ─── Read both files ──────────────────────────────────────────────────────────
const file1 = xlsx.readFile(process.env.HOME + '/Downloads/1_2 UA Locals.xlsx');
const data1 = xlsx.utils.sheet_to_json(file1.Sheets[file1.SheetNames[0]]);

const file2 = xlsx.readFile(process.env.HOME + '/Downloads/All_ UA Locals.xlsx');
const data2 = xlsx.utils.sheet_to_json(file2.Sheets[file2.SheetNames[0]]);

console.log(`File 1: ${data1.length} rows, File 2: ${data2.length} rows`);

// ─── Parse both into a map by local number ────────────────────────────────────
const localsMap = new Map();

function processRow(row, fileNum) {
  const localNum = row['Local Number'] || row['Local'];
  if (!localNum) return;

  const cityStateStr = row['City / state'] || row['City / State'] || '';
  const { city, state } = parseCityState(cityStateStr);
  const address = (row['Address'] || '').replace(/\n+/g, ', ').trim();
  const phone = cleanPhone(row['Phone']);
  const website = cleanWebsite(row['Website '] || row['Website'] || '');
  const email = (row['Email'] || '').replace(/\n/g, '').trim();
  const zipMatch = address.match(/\b\d{5}\b/);
  const coords = getCoords(city, state);

  const existing = localsMap.get(localNum);
  if (existing) {
    // Merge — prefer non-empty values
    if (!existing.email && email) existing.email = email;
    if (!existing.phone && phone) existing.phone = phone;
    if (!existing.website && website) existing.website = website;
    if (!existing.lat && coords) { existing.lat = coords.lat; existing.lng = coords.lng; }
  } else {
    localsMap.set(localNum, {
      id: 20000 + localNum,
      name: `UA Local ${localNum}`,
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      state: state.toUpperCase().substring(0, 2),
      phone: phone || null,
      website: website || null,
      email: email || null,
      address: address || null,
      lat: coords ? coords.lat : null,
      lng: coords ? coords.lng : null,
    });
  }
}

data1.forEach(r => processRow(r, 1));
data2.forEach(r => processRow(r, 2));

const locals = Array.from(localsMap.values()).sort((a, b) => {
  const na = parseInt(a.name.replace('UA Local ', ''));
  const nb = parseInt(b.name.replace('UA Local ', ''));
  return na - nb;
});

const withCoords = locals.filter(l => l.lat !== null).length;
console.log(`Total unique locals: ${locals.length}`);
console.log(`With coordinates: ${withCoords}`);

// ─── Generate JS ─────────────────────────────────────────────────────────────
const jsEntries = locals.map(l => {
  const parts = [`id: ${l.id}`, `name: "${l.name}"`, `city: "${l.city}"`, `state: "${l.state}"`];
  if (l.phone) parts.push(`phone: "${l.phone}"`);
  if (l.website) parts.push(`website: "${l.website}"`);
  if (l.email) parts.push(`email: "${l.email}"`);
  if (l.lat !== null) parts.push(`lat: ${l.lat}`, `lng: ${l.lng}`);
  if (l.address) parts.push(`address: "${l.address.replace(/"/g, "'")}"`);
  return `  { ${parts.join(', ')} }`;
}).join(',\n');

// ─── Replace UA_LOCALS in App.jsx ─────────────────────────────────────────────
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIdx = code.indexOf('const UA_LOCALS = [');
const endIdx = code.indexOf('];', startIdx) + 2;
if (startIdx === -1) { console.error('ERROR: UA_LOCALS not found'); process.exit(1); }

code = code.slice(0, startIdx) + `const UA_LOCALS = [\n${jsEntries}\n];` + code.slice(endIdx);
fs.writeFileSync('src/App.jsx', code);

console.log(`\n✅ Updated UA_LOCALS with ${locals.length} merged locals`);
console.log('🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: merge both UA local files for complete database" && git push\n');
