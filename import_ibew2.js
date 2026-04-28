const xlsx = require('xlsx');
const fs = require('fs');

const CANADIAN_CITY_TO_PROV = {
  'hamilton':'ON','london':'ON','toronto':'ON','ottawa':'ON','windsor':'ON',
  'kitchener':'ON','thunder bay':'ON','sarnia':'ON','sudbury':'ON','niagara':'ON',
  'niagra':'ON','kingston':'ON','barrie':'ON','oshawa':'ON','st. catharines':'ON',
  'victoria':'BC','vancouver':'BC','kamloops':'BC','kelowna':'BC','nelson':'BC',
  'edmonton':'AB','calgary':'AB','red deer':'AB','lethbridge':'AB',
  'montreal':'QC','quebec city':'QC','laval':'QC','gatineau':'QC',
  'winnipeg':'MB','brandon':'MB',
  'regina':'SK','saskatoon':'SK',
  'halifax':'NS','sydney':'NS',
  'fredericton':'NB','saint john':'NB','moncton':'NB',
  "st. john's":'NL','st johns':'NL',
  'charlottetown':'PE',
};

const PROV_COORDS = {
  ON:{lat:43.653,lng:-79.383},BC:{lat:49.283,lng:-123.121},AB:{lat:53.546,lng:-113.494},
  QC:{lat:45.502,lng:-73.567},MB:{lat:49.895,lng:-97.138},SK:{lat:50.445,lng:-104.619},
  NS:{lat:44.649,lng:-63.575},NB:{lat:45.964,lng:-66.643},NL:{lat:47.562,lng:-52.713},
  PE:{lat:46.238,lng:-63.131},
};

const CANADIAN_CITY_COORDS = {
  'hamilton':{lat:43.2557,lng:-79.8711},'london':{lat:42.9849,lng:-81.2453},
  'toronto':{lat:43.6532,lng:-79.3832},'ottawa':{lat:45.4215,lng:-75.6972},
  'windsor':{lat:42.3149,lng:-83.0364},'kitchener':{lat:43.4516,lng:-80.4925},
  'thunder bay':{lat:48.3809,lng:-89.2477},'sarnia':{lat:42.9745,lng:-82.4064},
  'sudbury':{lat:46.4917,lng:-80.9930},'niagara':{lat:43.0896,lng:-79.0849},
  'niagra':{lat:43.0896,lng:-79.0849},'victoria':{lat:48.4284,lng:-123.3656},
  'vancouver':{lat:49.2827,lng:-123.1207},'kamloops':{lat:50.6745,lng:-120.3273},
  'nelson':{lat:49.4928,lng:-117.2948},'edmonton':{lat:53.5461,lng:-113.4938},
  'calgary':{lat:51.0447,lng:-114.0719},'montreal':{lat:45.5017,lng:-73.5673},
  'winnipeg':{lat:49.8951,lng:-97.1384},'regina':{lat:50.4452,lng:-104.6189},
  'saskatoon':{lat:52.1332,lng:-106.6700},'halifax':{lat:44.6488,lng:-63.5752},
  'sydney':{lat:46.1368,lng:-60.1942},'fredericton':{lat:45.9636,lng:-66.6431},
  'saint john':{lat:45.2733,lng:-66.0633},'moncton':{lat:46.0878,lng:-64.7782},
  "st. john's":{lat:47.5615,lng:-52.7126},'st johns':{lat:47.5615,lng:-52.7126},
  'charlottetown':{lat:46.2382,lng:-63.1311},
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
  'district of columbia':'DC','washington dc':'DC',
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

function getZipCoords(zip) {
  if (!zip) return null;
  const z = String(zip).replace(/[^0-9]/g,'');
  if (z.length < 3) return null;
  const p = parseInt(z.substring(0,3));
  if (p >= 0 && p <= 99) return null;
  if (p >= 100 && p <= 199) return STATE_COORDS['NY'];
  if (p >= 200 && p <= 209) return STATE_COORDS['DC'];
  if (p >= 210 && p <= 219) return STATE_COORDS['MD'];
  if (p >= 220 && p <= 246) return STATE_COORDS['VA'];
  if (p >= 247 && p <= 268) return STATE_COORDS['WV'];
  if (p >= 270 && p <= 289) return STATE_COORDS['NC'];
  if (p >= 290 && p <= 299) return STATE_COORDS['SC'];
  if (p >= 300 && p <= 319) return STATE_COORDS['GA'];
  if (p >= 320 && p <= 349) return STATE_COORDS['FL'];
  if (p >= 350 && p <= 369) return STATE_COORDS['AL'];
  if (p >= 370 && p <= 385) return STATE_COORDS['TN'];
  if (p >= 386 && p <= 397) return STATE_COORDS['MS'];
  if (p >= 400 && p <= 427) return STATE_COORDS['KY'];
  if (p >= 430 && p <= 459) return STATE_COORDS['OH'];
  if (p >= 460 && p <= 479) return STATE_COORDS['IN'];
  if (p >= 480 && p <= 499) return STATE_COORDS['MI'];
  if (p >= 500 && p <= 528) return STATE_COORDS['IA'];
  if (p >= 530 && p <= 549) return STATE_COORDS['WI'];
  if (p >= 550 && p <= 567) return STATE_COORDS['MN'];
  if (p >= 570 && p <= 577) return STATE_COORDS['SD'];
  if (p >= 580 && p <= 588) return STATE_COORDS['ND'];
  if (p >= 590 && p <= 599) return STATE_COORDS['MT'];
  if (p >= 600 && p <= 629) return STATE_COORDS['IL'];
  if (p >= 630 && p <= 658) return STATE_COORDS['MO'];
  if (p >= 660 && p <= 679) return STATE_COORDS['KS'];
  if (p >= 680 && p <= 693) return STATE_COORDS['NE'];
  if (p >= 700 && p <= 714) return STATE_COORDS['LA'];
  if (p >= 716 && p <= 729) return STATE_COORDS['AR'];
  if (p >= 730 && p <= 749) return STATE_COORDS['OK'];
  if (p >= 750 && p <= 799) return STATE_COORDS['TX'];
  if (p >= 800 && p <= 816) return STATE_COORDS['CO'];
  if (p >= 820 && p <= 831) return STATE_COORDS['WY'];
  if (p >= 832 && p <= 838) return STATE_COORDS['ID'];
  if (p >= 840 && p <= 847) return STATE_COORDS['UT'];
  if (p >= 850 && p <= 865) return STATE_COORDS['AZ'];
  if (p >= 870 && p <= 884) return STATE_COORDS['NM'];
  if (p >= 889 && p <= 898) return STATE_COORDS['NV'];
  if (p >= 900 && p <= 961) return STATE_COORDS['CA'];
  if (p >= 970 && p <= 979) return STATE_COORDS['OR'];
  if (p >= 980 && p <= 994) return STATE_COORDS['WA'];
  if (p >= 995 && p <= 999) return STATE_COORDS['AK'];
  return null;
}

function parseLocation(cityState, address) {
  const cs = (cityState || '').toLowerCase().trim();
  const addr = (address || '').toLowerCase();
  
  // Check Canadian province names
  if (cs.includes('ontario') || addr.includes('ontario')) {
    const city = cs.split(',')[0].trim();
    const coords = CANADIAN_CITY_COORDS[city] || PROV_COORDS['ON'];
    return { city: cs.split(',')[0].trim(), state: 'ON', coords };
  }
  if (cs.includes('british columbia') || cs.includes(', bc') || addr.includes(' bc ')) {
    const city = cs.split(',')[0].trim();
    const coords = CANADIAN_CITY_COORDS[city] || PROV_COORDS['BC'];
    return { city, state: 'BC', coords };
  }
  if (cs.includes('alberta') || cs.includes(', ab') || addr.includes(' ab ')) {
    const city = cs.split(',')[0].trim();
    const coords = CANADIAN_CITY_COORDS[city] || PROV_COORDS['AB'];
    return { city, state: 'AB', coords };
  }
  if (cs.includes('quebec') || addr.includes(' qc ')) {
    const city = cs.split(',')[0].trim();
    const coords = CANADIAN_CITY_COORDS[city] || PROV_COORDS['QC'];
    return { city, state: 'QC', coords };
  }
  if (cs.includes('canada') || cs.includes('nova scotia') || cs.includes('new brunswick') ||
      cs.includes('manitoba') || cs.includes('saskatchewan') || cs.includes('newfoundland')) {
    const city = cs.split(',')[0].trim().replace(' canada','').trim();
    const prov = CANADIAN_CITY_TO_PROV[city] || 'ON';
    const coords = CANADIAN_CITY_COORDS[city] || PROV_COORDS[prov] || PROV_COORDS['ON'];
    return { city, state: prov, coords };
  }

  // US state from full name
  for (const [name, code] of Object.entries(STATE_ABBR)) {
    if (cs.includes(name)) {
      const city = cs.split(',')[0].trim();
      return { city, state: code, coords: STATE_COORDS[code] };
    }
  }

  // 2-letter state code
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

  const zipMatch = (address||'').match(/\b(\d{5})\b/);
  const coords = (state && STATE_COORDS[state]) ? STATE_COORDS[state] : 
                 (zipMatch ? getZipCoords(zipMatch[1]) : null);
  
  return { city, state: state || 'US', coords };
}

function cleanPhone(p) {
  if (!p) return null;
  p = String(p).trim();
  if (p.match(/^\d+\.?\d*[Ee]\d+$/)) p = Math.round(parseFloat(p)).toString();
  return p.replace(/^\s*\)/, '(') || null;
}

function cleanWebsite(url) {
  return (url||'').trim().replace(/^https?:\/\//,'').replace(/\/$/,'').replace(/^\s+/,'') || null;
}

// Read all sheets
const wb = xlsx.readFile(process.env.HOME + '/Downloads/All_ IBEW Inside List.xlsx');
const allRows = [];
wb.SheetNames.forEach(s => allRows.push(...xlsx.utils.sheet_to_json(wb.Sheets[s])));
console.log(`Total rows: ${allRows.length}`);

const seenLocals = new Set();
const locals = [];

allRows.forEach(row => {
  const localNum = row['Local'];
  if (!localNum) return;
  const num = Math.floor(parseFloat(String(localNum)));
  if (isNaN(num)) return;
  if (seenLocals.has(num)) return;
  seenLocals.add(num);

  const cityState = (row['City / State'] || '').trim();
  const address = (row['Address'] || '').replace(/\n+/g,', ').trim();
  const phone = cleanPhone(row['Phone']);
  const website = cleanWebsite(row['Website']);
  const email = (row['Email'] || '').trim() || null;

  const { city, state, coords } = parseLocation(cityState, address);

  locals.push({
    id: 10000 + num,
    name: `IBEW Local ${num}`,
    city: city.charAt(0).toUpperCase() + city.slice(1),
    state,
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
const canadian = locals.filter(l => PROV_COORDS[l.state]);
console.log(`Unique locals: ${locals.length}, With coords: ${withCoords}, Canadian: ${canadian.length}`);

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
const startIdx = code.indexOf('const IBEW_INSIDE_LOCALS = [');
const endIdx = code.indexOf('];', startIdx) + 2;
code = code.slice(0, startIdx) + `const IBEW_INSIDE_LOCALS = [\n${jsEntries}\n];` + code.slice(endIdx);
fs.writeFileSync('src/App.jsx', code);

console.log(`\n✅ Updated IBEW_INSIDE_LOCALS with ${locals.length} locals (${canadian.length} Canadian)`);
console.log('🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: IBEW Inside 286 locals with Canadian support" && git push\n');
