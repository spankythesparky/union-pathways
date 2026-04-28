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

// Known city coordinates for better accuracy
const CITY_COORDS = {
  'WORCESTER,MA':{lat:42.2626,lng:-71.8023},
  'BOSTON,MA':{lat:42.3601,lng:-71.0589},
  'SPRINGFIELD,MA':{lat:42.1015,lng:-72.5898},
  'NEW YORK,NY':{lat:40.7128,lng:-74.0059},
  'LOS ANGELES,CA':{lat:34.0522,lng:-118.2437},
  'CHICAGO,IL':{lat:41.8781,lng:-87.6298},
  'HOUSTON,TX':{lat:29.7604,lng:-95.3698},
  'PHOENIX,AZ':{lat:33.4484,lng:-112.0740},
  'PHILADELPHIA,PA':{lat:39.9526,lng:-75.1652},
  'SAN ANTONIO,TX':{lat:29.4241,lng:-98.4936},
  'SAN DIEGO,CA':{lat:32.7157,lng:-117.1611},
  'DALLAS,TX':{lat:32.7767,lng:-96.7970},
  'SAN JOSE,CA':{lat:37.3382,lng:-121.8863},
  'AUSTIN,TX':{lat:30.2672,lng:-97.7431},
  'JACKSONVILLE,FL':{lat:30.3322,lng:-81.6557},
  'SAN FRANCISCO,CA':{lat:37.7749,lng:-122.4194},
  'COLUMBUS,OH':{lat:39.9612,lng:-82.9988},
  'CHARLOTTE,NC':{lat:35.2271,lng:-80.8431},
  'INDIANAPOLIS,IN':{lat:39.7684,lng:-86.1581},
  'SEATTLE,WA':{lat:47.6062,lng:-122.3321},
  'DENVER,CO':{lat:39.7392,lng:-104.9903},
  'NASHVILLE,TN':{lat:36.1627,lng:-86.7816},
  'OKLAHOMA CITY,OK':{lat:35.4676,lng:-97.5164},
  'EL PASO,TX':{lat:31.7619,lng:-106.4850},
  'WASHINGTON,DC':{lat:38.9072,lng:-77.0369},
  'LOUISVILLE,KY':{lat:38.2527,lng:-85.7585},
  'LAS VEGAS,NV':{lat:36.1699,lng:-115.1398},
  'MEMPHIS,TN':{lat:35.1495,lng:-90.0490},
  'PORTLAND,OR':{lat:45.5051,lng:-122.6750},
  'BALTIMORE,MD':{lat:39.2904,lng:-76.6122},
  'MILWAUKEE,WI':{lat:43.0389,lng:-87.9065},
  'ALBUQUERQUE,NM':{lat:35.0844,lng:-106.6504},
  'TUCSON,AZ':{lat:32.2226,lng:-110.9747},
  'FRESNO,CA':{lat:36.7378,lng:-119.7871},
  'SACRAMENTO,CA':{lat:38.5816,lng:-121.4944},
  'MESA,AZ':{lat:33.4152,lng:-111.8315},
  'KANSAS CITY,MO':{lat:39.0997,lng:-94.5786},
  'ATLANTA,GA':{lat:33.7490,lng:-84.3880},
  'OMAHA,NE':{lat:41.2565,lng:-95.9345},
  'COLORADO SPRINGS,CO':{lat:38.8339,lng:-104.8214},
  'RALEIGH,NC':{lat:35.7796,lng:-78.6382},
  'LONG BEACH,CA':{lat:33.7701,lng:-118.1937},
  'VIRGINIA BEACH,VA':{lat:36.8529,lng:-75.9780},
  'MINNEAPOLIS,MN':{lat:44.9778,lng:-93.2650},
  'TAMPA,FL':{lat:27.9506,lng:-82.4572},
  'NEW ORLEANS,LA':{lat:29.9511,lng:-90.0715},
  'CLEVELAND,OH':{lat:41.4993,lng:-81.6944},
  'PITTSBURGH,PA':{lat:40.4406,lng:-79.9959},
  'ST. LOUIS,MO':{lat:38.6270,lng:-90.1994},
  'ST LOUIS,MO':{lat:38.6270,lng:-90.1994},
  'CINCINNATI,OH':{lat:39.1031,lng:-84.5120},
  'DETROIT,MI':{lat:42.3314,lng:-83.0458},
  'MIAMI,FL':{lat:25.7617,lng:-80.1918},
  'ORLANDO,FL':{lat:28.5383,lng:-81.3792},
};

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Find UA_LOCALS array
const start = code.indexOf('const UA_LOCALS = [');
const end = code.indexOf('];', start) + 2;
let uaSection = code.slice(start, end);

let fixedCount = 0;

// Fix entries missing lat/lng
uaSection = uaSection.replace(/\{ id: (\d+), name: "([^"]+)", city: "([^"]+)", state: "([^"]+)"([^}]*)\}/g, (match, id, name, city, state, rest) => {
  // Already has lat/lng?
  if (rest.includes('lat:')) return match;
  
  // Try city+state lookup
  const cityKey = city.toUpperCase() + ',' + state;
  let lat, lng;
  
  if (CITY_COORDS[cityKey]) {
    lat = CITY_COORDS[cityKey].lat;
    lng = CITY_COORDS[cityKey].lng;
  } else if (STATE_COORDS[state]) {
    lat = STATE_COORDS[state].lat;
    lng = STATE_COORDS[state].lng;
  } else {
    return match;
  }
  
  fixedCount++;
  // Insert lat/lng before closing brace
  return match.replace(rest + '}', rest + `, lat: ${lat}, lng: ${lng}}`);
});

code = code.slice(0, start) + uaSection + code.slice(end);
fs.writeFileSync('src/App.jsx', code);

// Count total with coords
const withCoords = (uaSection.match(/lat:/g) || []).length;
console.log(`✅ Added coordinates to ${fixedCount} locals`);
console.log(`✅ Total UA locals with coordinates: ${withCoords}`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add coordinates to UA locals" && git push\n');
