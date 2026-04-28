const fs = require('fs');

const CANADIAN_COORDS = {
  'ON': { lat: 43.6532, lng: -79.3832 }, // Toronto default
  'BC': { lat: 49.2827, lng: -123.1207 }, // Vancouver default
  'AB': { lat: 51.0447, lng: -114.0719 }, // Calgary default
  'QC': { lat: 45.5017, lng: -73.5673 }, // Montreal default
  'MB': { lat: 49.8951, lng: -97.1384 }, // Winnipeg default
  'NB': { lat: 45.9636, lng: -66.6431 }, // Fredericton default
  'NS': { lat: 44.6488, lng: -63.5752 }, // Halifax default
  'NL': { lat: 47.5615, lng: -52.7126 }, // St Johns default
  'PE': { lat: 46.2382, lng: -63.1311 }, // Charlottetown default
  'SK': { lat: 50.4452, lng: -104.6189 }, // Regina default
};

const CANADIAN_CITY_COORDS = {
  'TORONTO,ON':    { lat: 43.6532, lng: -79.3832 },
  'VANCOUVER,BC':  { lat: 49.2827, lng: -123.1207 },
  'CALGARY,AB':    { lat: 51.0447, lng: -114.0719 },
  'EDMONTON,AB':   { lat: 53.5461, lng: -113.4938 },
  'MONTREAL,QC':   { lat: 45.5017, lng: -73.5673 },
  'OTTAWA,ON':     { lat: 45.4215, lng: -75.6972 },
  'WINNIPEG,MB':   { lat: 49.8951, lng: -97.1384 },
  'HAMILTON,ON':   { lat: 43.2557, lng: -79.8711 },
  'HALIFAX,NS':    { lat: 44.6488, lng: -63.5752 },
  'VICTORIA,BC':   { lat: 48.4284, lng: -123.3656 },
  'FREDERICTON,NB':{ lat: 45.9636, lng: -66.6431 },
  'CHARLOTTETOWN,PE':{ lat: 46.2382, lng: -63.1311 },
  'SARNIA,ON':     { lat: 42.9745, lng: -82.4064 },
  'THUNDER BAY,ON':{ lat: 48.3809, lng: -89.2477 },
  'THUNDERBAY,ON': { lat: 48.3809, lng: -89.2477 },
  'SUDBURY,ON':    { lat: 46.4917, lng: -80.9930 },
  'SUBURY,ON':     { lat: 46.4917, lng: -80.9930 },
  'ST JOHNS,NL':   { lat: 47.5615, lng: -52.7126 },
  'SYDNEY,NS':     { lat: 46.1368, lng: -60.1942 },
};

function getCanadianCoords(city, state) {
  const key = city.toUpperCase().trim() + ',' + state.toUpperCase().trim();
  if (CANADIAN_CITY_COORDS[key]) return CANADIAN_CITY_COORDS[key];
  if (CANADIAN_COORDS[state.toUpperCase()]) return CANADIAN_COORDS[state.toUpperCase()];
  return null;
}

let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('const UA_LOCALS = [');
const end = code.indexOf('];', start) + 2;
let section = code.slice(start, end);

let fixed = 0;

// Fix entries missing lat by matching city/state
section = section.replace(/(\{ id: \d+, name: "[^"]+", city: "([^"]+)", state: "([^"]+)"[^}]*)\}/g, (match, prefix, city, state) => {
  if (match.includes('lat:')) return match;
  const coords = getCanadianCoords(city, state);
  if (!coords) return match;
  fixed++;
  return match.replace(/\}$/, `, lat: ${coords.lat}, lng: ${coords.lng}}`);
});

code = code.slice(0, start) + section + code.slice(end);
fs.writeFileSync('src/App.jsx', code);

// Recheck
const remaining = (section.match(/name: "UA Local/g) || []).length;
const withCoords = (section.match(/lat:/g) || []).length;
console.log(`✅ Fixed ${fixed} Canadian locals`);
console.log(`Total: ${remaining}, With coords: ${withCoords}, Still missing: ${remaining - withCoords}`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Canadian UA locals coordinates" && git push\n');
