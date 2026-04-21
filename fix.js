const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. HFIAW LOCALS ARRAY ────────────────────────────────────────────────────
const hfiawArray = `
// ─── HFIAW LOCALS DATABASE — Heat & Frost Insulators & Allied Workers ─────────
const HFIAW_LOCALS = [
  { id: 1,  name: "HFIAW Local 1",  city: "St. Louis",     state: "MO", phone: "(314) 291-7399",  website: "insulators1.org",       lat: 38.6270, lng: -90.1994, address: "St. Louis, MO" },
  { id: 2,  name: "HFIAW Local 2",  city: "New York",      state: "NY", phone: null,               website: null,                    lat: 40.7128, lng: -74.0059, address: "New York, NY" },
  { id: 3,  name: "HFIAW Local 3",  city: "Cleveland",     state: "OH", phone: null,               website: null,                    lat: 41.4993, lng: -81.6944, address: "Cleveland, OH" },
  { id: 4,  name: "HFIAW Local 4",  city: "Buffalo",       state: "NY", phone: null,               website: null,                    lat: 42.8864, lng: -78.8784, address: "Buffalo, NY" },
  { id: 5,  name: "HFIAW Local 5",  city: "Los Angeles",   state: "CA", phone: null,               website: null,                    lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  { id: 6,  name: "HFIAW Local 6",  city: "Boston",        state: "MA", phone: null,               website: null,                    lat: 42.3601, lng: -71.0589, address: "Boston, MA" },
  { id: 7,  name: "HFIAW Local 7",  city: "Albany",        state: "NY", phone: null,               website: null,                    lat: 42.6526, lng: -73.7562, address: "Albany, NY" },
  { id: 8,  name: "HFIAW Local 8",  city: "Cincinnati",    state: "OH", phone: null,               website: null,                    lat: 39.1031, lng: -84.5120, address: "Cincinnati, OH" },
  { id: 9,  name: "HFIAW Local 9",  city: "Detroit",       state: "MI", phone: null,               website: null,                    lat: 42.3314, lng: -83.0458, address: "Detroit, MI" },
  { id: 10, name: "HFIAW Local 10", city: "Washington",    state: "DC", phone: null,               website: null,                    lat: 38.9072, lng: -77.0369, address: "Washington, DC" },
  { id: 11, name: "HFIAW Local 11", city: "Phoenix",       state: "AZ", phone: null,               website: null,                    lat: 33.4484, lng: -112.0740, address: "Phoenix, AZ" },
  { id: 12, name: "HFIAW Local 12", city: "Newark",        state: "NJ", phone: null,               website: null,                    lat: 40.7357, lng: -74.1724, address: "Newark, NJ" },
  { id: 13, name: "HFIAW Local 13", city: "Pittsburgh",    state: "PA", phone: null,               website: null,                    lat: 40.4406, lng: -79.9959, address: "Pittsburgh, PA" },
  { id: 14, name: "HFIAW Local 14", city: "Rochester",     state: "NY", phone: null,               website: null,                    lat: 43.1566, lng: -77.6088, address: "Rochester, NY" },
  { id: 15, name: "HFIAW Local 15", city: "Baltimore",     state: "MD", phone: null,               website: null,                    lat: 39.2904, lng: -76.6122, address: "Baltimore, MD" },
  { id: 16, name: "HFIAW Local 16", city: "Portland",      state: "ME", phone: null,               website: null,                    lat: 43.6591, lng: -70.2568, address: "Portland, ME" },
  { id: 17, name: "HFIAW Local 17", city: "Chicago",       state: "IL", phone: "(708) 468-8000",   website: "local17insulators.com", lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
  { id: 18, name: "HFIAW Local 18", city: "Indianapolis",  state: "IN", phone: "(317) 786-3216",   website: "insulators18.org",      lat: 39.7684, lng: -86.1581, address: "Indianapolis, IN" },
  { id: 19, name: "HFIAW Local 19", city: "Milwaukee",     state: "WI", phone: "(262) 548-9606",   website: "insulators19.com",      lat: 43.0389, lng: -87.9065, address: "Milwaukee, WI" },
  { id: 21, name: "HFIAW Local 21", city: "Houston",       state: "TX", phone: null,               website: null,                    lat: 29.7604, lng: -95.3698, address: "Houston, TX" },
  { id: 22, name: "HFIAW Local 22", city: "Dallas",        state: "TX", phone: null,               website: null,                    lat: 32.7767, lng: -96.7970, address: "Dallas, TX" },
  { id: 23, name: "HFIAW Local 23", city: "Syracuse",      state: "NY", phone: null,               website: null,                    lat: 43.0481, lng: -76.1474, address: "Syracuse, NY" },
  { id: 24, name: "HFIAW Local 24", city: "Memphis",       state: "TN", phone: null,               website: null,                    lat: 35.1495, lng: -90.0490, address: "Memphis, TN" },
  { id: 25, name: "HFIAW Local 25", city: "Kansas City",   state: "MO", phone: null,               website: null,                    lat: 39.0997, lng: -94.5786, address: "Kansas City, MO" },
  { id: 26, name: "HFIAW Local 26", city: "New Orleans",   state: "LA", phone: null,               website: null,                    lat: 29.9511, lng: -90.0715, address: "New Orleans, LA" },
  { id: 27, name: "HFIAW Local 27", city: "Denver",        state: "CO", phone: "(816) 252-0588",   website: "insulators27.com",      lat: 39.7392, lng: -104.9903, address: "Denver, CO" },
  { id: 28, name: "HFIAW Local 28", city: "Atlanta",       state: "GA", phone: null,               website: null,                    lat: 33.7490, lng: -84.3880, address: "Atlanta, GA" },
  { id: 29, name: "HFIAW Local 29", city: "San Francisco", state: "CA", phone: null,               website: null,                    lat: 37.7749, lng: -122.4194, address: "San Francisco, CA" },
  { id: 30, name: "HFIAW Local 30", city: "Scranton",      state: "PA", phone: null,               website: null,                    lat: 41.4090, lng: -75.6624, address: "Scranton, PA" },
  { id: 31, name: "HFIAW Local 31", city: "Minneapolis",   state: "MN", phone: null,               website: null,                    lat: 44.9778, lng: -93.2650, address: "Minneapolis, MN" },
  { id: 34, name: "HFIAW Local 34", city: "Chicago",       state: "IL", phone: null,               website: null,                    lat: 41.8827, lng: -87.6233, address: "Chicago, IL" },
  { id: 35, name: "HFIAW Local 35", city: "Tampa",         state: "FL", phone: null,               website: null,                    lat: 27.9506, lng: -82.4572, address: "Tampa, FL" },
  { id: 36, name: "HFIAW Local 36", city: "Las Vegas",     state: "NV", phone: null,               website: null,                    lat: 36.1699, lng: -115.1398, address: "Las Vegas, NV" },
  { id: 37, name: "HFIAW Local 37", city: "Oklahoma City", state: "OK", phone: "(812) 477-2341",   website: "insulators37.org",      lat: 35.4676, lng: -97.5164, address: "Oklahoma City, OK" },
  { id: 39, name: "HFIAW Local 39", city: "Omaha",         state: "NE", phone: "(402) 333-6960",   website: null,                    lat: 41.2565, lng: -95.9345, address: "Omaha, NE" },
  { id: 40, name: "HFIAW Local 40", city: "Portland",      state: "OR", phone: null,               website: null,                    lat: 45.5231, lng: -122.6765, address: "Portland, OR" },
  { id: 41, name: "HFIAW Local 41", city: "Fort Wayne",    state: "IN", phone: null,               website: null,                    lat: 41.0793, lng: -85.1394, address: "Fort Wayne, IN" },
  { id: 42, name: "HFIAW Local 42", city: "Seattle",       state: "WA", phone: null,               website: null,                    lat: 47.6062, lng: -122.3321, address: "Seattle, WA" },
  { id: 45, name: "HFIAW Local 45", city: "Toledo",        state: "OH", phone: null,               website: null,                    lat: 41.6528, lng: -83.5379, address: "Toledo, OH" },
  { id: 46, name: "HFIAW Local 46", city: "Oakland",       state: "CA", phone: null,               website: null,                    lat: 37.8044, lng: -122.2712, address: "Oakland, CA" },
  { id: 48, name: "HFIAW Local 48", city: "Salt Lake City",state: "UT", phone: null,               website: null,                    lat: 40.7608, lng: -111.8910, address: "Salt Lake City, UT" },
  { id: 50, name: "HFIAW Local 50", city: "Columbus",      state: "OH", phone: null,               website: null,                    lat: 39.9612, lng: -82.9988, address: "Columbus, OH" },
  { id: 52, name: "HFIAW Local 52", city: "Minneapolis",   state: "MN", phone: null,               website: null,                    lat: 44.9638, lng: -93.2422, address: "Minneapolis, MN" },
  { id: 53, name: "HFIAW Local 53", city: "Birmingham",    state: "AL", phone: null,               website: null,                    lat: 33.5186, lng: -86.8104, address: "Birmingham, AL" },
  { id: 55, name: "HFIAW Local 55", city: "Des Moines",    state: "IA", phone: null,               website: null,                    lat: 41.5868, lng: -93.6250, address: "Des Moines, IA" },
  { id: 65, name: "HFIAW Local 65", city: "Nashville",     state: "TN", phone: null,               website: null,                    lat: 36.1627, lng: -86.7816, address: "Nashville, TN" },
  { id: 73, name: "HFIAW Local 73", city: "Albuquerque",   state: "NM", phone: null,               website: null,                    lat: 35.0844, lng: -106.6504, address: "Albuquerque, NM" },
  { id: 74, name: "HFIAW Local 74", city: "Charlotte",     state: "NC", phone: "(515) 288-0472",   website: "insulators74.org",      lat: 35.2271, lng: -80.8431, address: "Charlotte, NC" },
  { id: 84, name: "HFIAW Local 84", city: "Akron",         state: "OH", phone: null,               website: null,                    lat: 41.0998, lng: -81.5190, address: "Akron, OH" },
];

`;

// Insert HFIAW array before the UA LOCALS comment
const uaMarker = '// ─── UA LOCALS DATABASE';
if (!code.includes(uaMarker)) {
  console.error('ERROR: Could not find UA LOCALS marker. Check App.jsx manually.');
  process.exit(1);
}
code = code.replace(uaMarker, hfiawArray + uaMarker);
console.log('✅ HFIAW_LOCALS array inserted');

// ─── 2. ACTIVATE HFIAW IN UNION_TRADES ───────────────────────────────────────
const oldTrade = `{ abbr: "HFIAW", name: "Insulators", full: "Heat & Frost Insulators and Allied Workers", website: "www.insulators.org", status: "coming" }`;
const newTrade = `{ abbr: "HFIAW", name: "Insulators", full: "Heat & Frost Insulators and Allied Workers", website: "www.insulators.org", status: "active", color: "#38bdf8" }`;

if (!code.includes(oldTrade)) {
  console.error('ERROR: Could not find HFIAW trade entry. Check UNION_TRADES in App.jsx.');
  process.exit(1);
}
code = code.replace(oldTrade, newTrade);
console.log('✅ HFIAW trade status set to active');

// ─── 3. UPDATE handleSearch DATABASE SELECTION (appears twice) ────────────────
const oldDb = `const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;`;
const newDb  = `const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;`;

const dbCount = (code.match(new RegExp(oldDb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
if (dbCount === 0) {
  console.error('ERROR: Could not find database selection line. Check handleSearch/handleGeolocate.');
  process.exit(1);
}
code = code.split(oldDb).join(newDb);
console.log(`✅ Database selection updated (${dbCount} instance(s) replaced)`);

// ─── 4. UPDATE resolveLocation ALL array ─────────────────────────────────────
const oldAll = `const ALL = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...SMART_LOCALS, ...BAC_LOCALS, ...UBC_LOCALS];`;
const newAll = `const ALL = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...SMART_LOCALS, ...BAC_LOCALS, ...UBC_LOCALS, ...HFIAW_LOCALS];`;

if (!code.includes(oldAll)) {
  console.warn('WARNING: Could not find ALL array — skipping. You may need to add HFIAW_LOCALS manually.');
} else {
  code = code.replace(oldAll, newAll);
  console.log('✅ resolveLocation ALL array updated');
}

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! App.jsx updated successfully. Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add HFIAW Insulators locals" && git push\n');
