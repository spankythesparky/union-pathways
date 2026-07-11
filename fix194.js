// fix194.js — Batch city/state corrections (Option 3)
//
// Background:
//   An audit of all 1,457 locals found 301 city/state mismatches between
//   the displayed city/state field and the actual mailing address. We're
//   fixing the unambiguous ones (~65 corrections) and leaving the
//   intentional metro-vs-suburb pairs (~233) alone since "city: Los Angeles
//   address: Pasadena" is more useful for someone googling 'union electrician
//   Los Angeles' than the literal address city.
//
// What this fixes:
//   1. Wrong-state errors (~45) — flat-out broken data. Examples:
//      - IBEW 26: Washington dc, WA → Lanham, MD
//      - IBEW 145: Davenport, IA → Moline, IL
//      - IBEW 222: Orlando, FL → Toa Alta, PR
//      - HFIAW 7: Seattle, AK → Tukwila, WA
//      - All BAC entries with truncated state codes ("Co", "Mi", "Pe", "Wa")
//      - All "Kansas city, KS" → "Kansas City, MO" (multiple locals)
//      - All "Virginia, VA" UBC entries → "Virginia, MN" (the city Virginia
//        is in Minnesota; locals 606 and 1348 list MN address but VA state)
//
//   2. Typo cities (~17) — same intended city, mis-spelled or mis-cased:
//      - "St louis" → "St. Louis"
//      - "Niagra falls" → "Niagara Falls"
//      - "San bernadino" → "San Bernardino"
//      - "Eau clarie" → "Eau Claire"
//      - "Cheyanne" → "Cheyenne"
//      - "Philadephia" → "Philadelphia"
//      - "Owensburg" → "Owensboro" (different word, but local id 11701
//        address confirms this is the intended fix)
//      - and others
//
//   3. Empty cities (3) — UA 74, 155, 821 have blank city fields.
//      Fill from address with proper-cased value.
//
// What this does NOT fix:
//   - Metro-vs-suburb pairs (e.g., IBEW 11 "Los Angeles" → actual address
//     in Pasadena). Per Option 3, leave these alone — the metro name is
//     more useful for users searching by city.
//   - HFIAW Local 14 (the address has the typo, not the displayed city).
//   - IBEW Local 77 "Seattle" → "SeaTac" (different real cities; Seattle
//     is the recognizable metro).
//
// Strategy:
//   Each correction is anchored on the FULL line (id + name + city + state)
//   so we change only that one local and don't accidentally rewrite a
//   different local with similar text. Each anchor is verified to exist
//   before the replace; if any single one fails, the script reports which
//   and exits without writing — keeping the file in a known-good state.
//
// Idempotency: detects the marker '/* fix194 audit-corrected */' written
//   to the validPages comment and exits cleanly.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

// Marker for idempotency. We write this to a comment near the top of the
// file once we've successfully applied all corrections.
const MARKER = '/* fix194 audit-corrected */';
if (src.includes(MARKER)) {
  console.log('Already applied — audit corrections are already in place.');
  process.exit(0);
}

// Each entry: {old: 'exact substring to match', new: 'replacement', why: 'description'}
// Using id + name + city + state as the anchor pattern guarantees uniqueness.
const FIXES = [
  // ============ WRONG STATE (45 fixes) ============
  // IBEW family
  { old: '{ id: 10026, name: "IBEW Local 26", city: "Washington dc", state: "WA"',
    new: '{ id: 10026, name: "IBEW Local 26", city: "Lanham", state: "MD"',
    why: 'IBEW 26 — addr in Lanham, MD' },
  { old: '{ id: 10145, name: "IBEW Local 145", city: "Davenport", state: "IA"',
    new: '{ id: 10145, name: "IBEW Local 145", city: "Moline", state: "IL"',
    why: 'IBEW 145 — addr in Moline, IL' },
  { old: '{ id: 30053, name: "IBEW Local 53", city: "Kansas city", state: "KS"',
    new: '{ id: 30053, name: "IBEW Local 53", city: "Kansas City", state: "MO"',
    why: 'IBEW 53 — Kansas City is in MO' },
  { old: '{ id: 30222, name: "IBEW Local 222", city: "Orlando", state: "FL"',
    new: '{ id: 30222, name: "IBEW Local 222", city: "Toa Alta", state: "PR"',
    why: 'IBEW 222 — addr in Toa Alta, Puerto Rico' },
  { old: '{ id: 30270, name: "IBEW Local 270", city: "Oak ridge", state: "TX"',
    new: '{ id: 30270, name: "IBEW Local 270", city: "Oak Ridge", state: "TN"',
    why: 'IBEW 270 — Oak Ridge is in TN' },
  { old: '{ id: 30659, name: "IBEW Local 659", city: "Medford", state: "CA"',
    new: '{ id: 30659, name: "IBEW Local 659", city: "Central Point", state: "OR"',
    why: 'IBEW 659 — addr in Central Point, OR' },

  // HFIAW family
  { old: '{ id: 50005, name: "HFIAW Local 5", city: "Los angeles", state: "ON"',
    new: '{ id: 50005, name: "HFIAW Local 5", city: "Ontario", state: "CA"',
    why: 'HFIAW 5 — addr in Ontario, CA (not Ontario Canada)' },
  { old: '{ id: 50007, name: "HFIAW Local 7", city: "Seattle", state: "AK"',
    new: '{ id: 50007, name: "HFIAW Local 7", city: "Tukwila", state: "WA"',
    why: 'HFIAW 7 — Seattle is in WA not AK; addr is Tukwila, WA' },
  { old: '{ id: 50024, name: "HFIAW Local 24", city: "Washington", state: "WA"',
    new: '{ id: 50024, name: "HFIAW Local 24", city: "Laurel", state: "MD"',
    why: 'HFIAW 24 — addr in Laurel, MD' },

  // IUEC family
  { old: '{ id: 51010, name: "IUEC Local 10", city: "Washington", state: "WA"',
    new: '{ id: 51010, name: "IUEC Local 10", city: "Lanham", state: "MD"',
    why: 'IUEC 10 — addr in Lanham, MD' },
  { old: '{ id: 51012, name: "IUEC Local 12", city: "Kansas city", state: "KS"',
    new: '{ id: 51012, name: "IUEC Local 12", city: "Kansas City", state: "MO"',
    why: 'IUEC 12 — Kansas City is in MO' },
  { old: '{ id: 51124, name: "IUEC Local 124", city: "Mobile", state: "AL"',
    new: '{ id: 51124, name: "IUEC Local 124", city: "Pensacola", state: "FL"',
    why: 'IUEC 124 — addr in Pensacola, FL' },

  // IW family
  { old: '{ id: 40010, name: "IW Local 10", city: "Kansas city", state: "KS"',
    new: '{ id: 40010, name: "IW Local 10", city: "Kansas City", state: "MO"',
    why: 'IW 10 — Kansas City is in MO' },
  { old: '{ id: 40044, name: "IW Local 44", city: "Cincinnati", state: "OH"',
    new: '{ id: 40044, name: "IW Local 44", city: "Hebron", state: "KY"',
    why: 'IW 44 — addr in Hebron, KY' },
  { old: '{ id: 40845, name: "IW Local 845", city: "Fredericksburg", state: "MA"',
    new: '{ id: 40845, name: "IW Local 845", city: "Beaver", state: "PA"',
    why: 'IW 845 — addr in Beaver, PA' },

  // UA family
  { old: '{ id: 20005, name: "UA Local 5", city: "Washington", state: "DC"',
    new: '{ id: 20005, name: "UA Local 5", city: "Lanham", state: "MD"',
    why: 'UA 5 — addr in Lanham, MD' },
  { old: '{ id: 20602, name: "UA Local 602", city: "Washington", state: "DC"',
    new: '{ id: 20602, name: "UA Local 602", city: "Capitol Heights", state: "MD"',
    why: 'UA 602 — addr in Capitol Heights, MD' },
  { old: '{ id: 20716, name: "UA Local 716", city: "", state: "MA"',
    new: '{ id: 20716, name: "UA Local 716", city: "Augusta", state: "ME"',
    why: 'UA 716 — addr in Augusta, ME' },

  // BAC family — these had truncated state codes ("Co", "Mi", "Pe", etc.)
  { old: '{ id: 20505, name: "BAC Local 1 (Connecticut)", city: "Connecticut", state: "Co"',
    new: '{ id: 20505, name: "BAC Local 1 (Connecticut)", city: "Wallingford", state: "CT"',
    why: 'BAC 1 CT — addr in Wallingford, CT' },
  { old: `{ id: 20509, name: "BAC Local 8 (Illinois)", city: "Illinois", state: "Il"`,
    new: `{ id: 20509, name: "BAC Local 8 (Illinois)", city: "O'Fallon", state: "IL"`,
    why: 'BAC 8 IL — addr in O\'Fallon, IL' },
  { old: '{ id: 20510, name: "BAC ADC 1 (Illinois)", city: "Illinois", state: "Il"',
    new: '{ id: 20510, name: "BAC ADC 1 (Illinois)", city: "Elmhurst", state: "IL"',
    why: 'BAC ADC 1 IL — addr in Elmhurst, IL' },
  { old: '{ id: 20514, name: "BAC Local 2 (Michigan)", city: "Michigan", state: "Mi"',
    new: '{ id: 20514, name: "BAC Local 2 (Michigan)", city: "Warren", state: "MI"',
    why: 'BAC 2 MI — addr in Warren, MI' },
  { old: '{ id: 20515, name: "BAC Local 15 (Missouri, Kasas, Nebraska)", city: "Missouri", state: "Ne"',
    new: '{ id: 20515, name: "BAC Local 15 (Missouri, Kasas, Nebraska)", city: "Kansas City", state: "MO"',
    why: 'BAC 15 — addr in Kansas City, MO' },
  { old: '{ id: 20519, name: "BAC ADC of New Jersey (New Jersey)", city: "New Jersey", state: "Ne"',
    new: '{ id: 20519, name: "BAC ADC of New Jersey (New Jersey)", city: "Bordentown", state: "NJ"',
    why: 'BAC ADC NJ — addr in Bordentown, NJ' },
  { old: '{ id: 20521, name: "BAC Mountain West ADC (Nevada)", city: "Nevada", state: "Ne"',
    new: '{ id: 20521, name: "BAC Mountain West ADC (Nevada)", city: "Las Vegas", state: "NV"',
    why: 'BAC MW ADC — addr in Las Vegas, NV' },
  { old: '{ id: 20522, name: "BAC Local 1 (New York)", city: "New York", state: "Ne"',
    new: '{ id: 20522, name: "BAC Local 1 (New York)", city: "Long Island City", state: "NY"',
    why: 'BAC 1 NY — addr in Long Island City, NY' },
  { old: '{ id: 20523, name: "BAC Local 2 (New York / Vermont)", city: "New York / Vermont", state: "Ne"',
    new: '{ id: 20523, name: "BAC Local 2 (New York / Vermont)", city: "Albany", state: "NY"',
    why: 'BAC 2 NY/VT — addr in Albany, NY' },
  { old: '{ id: 20524, name: "BAC Local 3 (New York)", city: "New York", state: "Ne"',
    new: '{ id: 20524, name: "BAC Local 3 (New York)", city: "Rochester", state: "NY"',
    why: 'BAC 3 NY — addr in Rochester, NY' },
  { old: '{ id: 20525, name: "BAC Local 7 (New York / New Jersey)", city: "New York / New Jersey", state: "Ne"',
    new: '{ id: 20525, name: "BAC Local 7 (New York / New Jersey)", city: "Long Island City", state: "NY"',
    why: 'BAC 7 NY/NJ — addr in Long Island City, NY' },
  { old: '{ id: 20526, name: "BAC Local 23 (Ohio / West Virginia / Kentucky / Maryland)", city: "Ohio / West Virginia / Kentucky / Maryland", state: "Oh"',
    new: '{ id: 20526, name: "BAC Local 23 (Ohio / West Virginia / Kentucky / Maryland)", city: "Amherst", state: "OH"',
    why: 'BAC 23 OH — addr in Amherst, OH' },
  { old: '{ id: 20527, name: "BAC Local 5 (Oklahoma / arkansas / texas / new mexico)", city: "Oklahoma / arkansas / texas / new mexico", state: "Ok"',
    new: '{ id: 20527, name: "BAC Local 5 (Oklahoma / arkansas / texas / new mexico)", city: "Oklahoma City", state: "OK"',
    why: 'BAC 5 OK — addr in Oklahoma City, OK' },
  { old: '{ id: 20528, name: "BAC Local 1 (pennsylvania / delaware)", city: "pennsylvania / delaware", state: "pe"',
    new: '{ id: 20528, name: "BAC Local 1 (pennsylvania / delaware)", city: "Philadelphia", state: "PA"',
    why: 'BAC 1 PA/DE — addr in Philadelphia, PA' },
  { old: '{ id: 20529, name: "BAC Local 5 (Pennsylvania)", city: "Pennsylvania", state: "Pe"',
    new: '{ id: 20529, name: "BAC Local 5 (Pennsylvania)", city: "Harrisburg", state: "PA"',
    why: 'BAC 5 PA — addr in Harrisburg, PA' },
  { old: '{ id: 20530, name: "BAC Local 9 (Pennsylvania)", city: "Pennsylvania", state: "Pe"',
    new: '{ id: 20530, name: "BAC Local 9 (Pennsylvania)", city: "Pittsburgh", state: "PA"',
    why: 'BAC 9 PA — addr in Pittsburgh, PA' },
  { old: '{ id: 20534, name: "BAC Local 1 (Washington and Alaska)", city: "Washington and Alaska", state: "Wa"',
    new: '{ id: 20534, name: "BAC Local 1 (Washington and Alaska)", city: "Tukwila", state: "WA"',
    why: 'BAC 1 WA/AK — addr in Tukwila, WA' },
  { old: '{ id: 20535, name: "BAC Wisconsin Distrcit council (Wisconsin)", city: "Wisconsin", state: "Wi"',
    new: '{ id: 20535, name: "BAC Wisconsin Distrcit council (Wisconsin)", city: "New Berlin", state: "WI"',
    why: 'BAC WI — addr in New Berlin, WI' },
  { old: '{ id: 20536, name: "BAC Local 1 (Minnesota / North Dakota / South Dakota)", city: "Minnesota / North Dakota / South Dakota", state: "Mi"',
    new: '{ id: 20536, name: "BAC Local 1 (Minnesota / North Dakota / South Dakota)", city: "Minneapolis", state: "MN"',
    why: 'BAC 1 MN/ND/SD — addr in Minneapolis, MN' },
  { old: '{ id: 20537, name: "BAC Local 1 (Oregon / Washington / Idaho / Montana)", city: "Oregon / Washington / Idaho / Montana", state: "Or"',
    new: '{ id: 20537, name: "BAC Local 1 (Oregon / Washington / Idaho / Montana)", city: "Portland", state: "OR"',
    why: 'BAC 1 OR/WA/ID/MT — addr in Portland, OR' },

  // UBC family
  { old: '{ id: 70909, name: "UBC Local 909", city: "Ontario", state: "ON"',
    new: '{ id: 70909, name: "UBC Local 909", city: "Ontario", state: "CA"',
    why: 'UBC 909 — addr in Ontario, CA (not Ontario Canada)' },
  { old: '{ id: 70606, name: "UBC Local 606", city: "Virginia", state: "VA"',
    new: '{ id: 70606, name: "UBC Local 606", city: "Virginia", state: "MN"',
    why: 'UBC 606 — Virginia is a city in MN' },
  { old: '{ id: 71348, name: "UBC Local 1348", city: "Virginia", state: "VA"',
    new: '{ id: 71348, name: "UBC Local 1348", city: "Virginia", state: "MN"',
    why: 'UBC 1348 — Virginia is a city in MN' },
  { old: '{ id: 71127, name: "UBC Local 1127", city: "Kansas city", state: "KS"',
    new: '{ id: 71127, name: "UBC Local 1127", city: "Kansas City", state: "MO"',
    why: 'UBC 1127 — Kansas City is in MO' },
  { old: '{ id: 70315, name: "UBC Local 315", city: "Kansas city", state: "KS"',
    new: '{ id: 70315, name: "UBC Local 315", city: "Kansas City", state: "MO"',
    why: 'UBC 315 — Kansas City is in MO' },
  { old: '{ id: 71529, name: "UBC Local 1529", city: "Kansas city", state: "KS"',
    new: '{ id: 71529, name: "UBC Local 1529", city: "Kansas City", state: "MO"',
    why: 'UBC 1529 — Kansas City is in MO' },

  // ============ TYPO CITIES (17 fixes) ============
  { old: '{ id: 10005, name: "IBEW Local 5", city: "Pittsburgh pa"',
    new: '{ id: 10005, name: "IBEW Local 5", city: "Pittsburgh"',
    why: 'IBEW 5 — strip trailing state from city' },
  { old: '{ id: 10194, name: "IBEW Local 194", city: "Shrevport"',
    new: '{ id: 10194, name: "IBEW Local 194", city: "Shreveport"',
    why: 'IBEW 194 — Shrevport → Shreveport' },
  { old: '{ id: 10237, name: "IBEW Local 237", city: "Niagra falls"',
    new: '{ id: 10237, name: "IBEW Local 237", city: "Niagara Falls"',
    why: 'IBEW 237 — Niagra → Niagara' },
  { old: '{ id: 10477, name: "IBEW Local 477", city: "San bernadino"',
    new: '{ id: 10477, name: "IBEW Local 477", city: "San Bernardino"',
    why: 'IBEW 477 — bernadino → Bernardino' },
  { old: '{ id: 10606, name: "IBEW Local 606", city: "Orlandao"',
    new: '{ id: 10606, name: "IBEW Local 606", city: "Orlando"',
    why: 'IBEW 606 — Orlandao → Orlando' },
  { old: '{ id: 11701, name: "IBEW Local 1701", city: "Owensburg"',
    new: '{ id: 11701, name: "IBEW Local 1701", city: "Owensboro"',
    why: 'IBEW 1701 — Owensburg → Owensboro (KY)' },
  { old: '{ id: 30017, name: "IBEW Local 17", city: "Soutfield"',
    new: '{ id: 30017, name: "IBEW Local 17", city: "Southfield"',
    why: 'IBEW 17 — Soutfield → Southfield' },
  { old: '{ id: 30042, name: "IBEW Local 42", city: "East winsor"',
    new: '{ id: 30042, name: "IBEW Local 42", city: "East Windsor"',
    why: 'IBEW 42 — winsor → Windsor' },
  { old: '{ id: 30456, name: "IBEW Local 456", city: "North brunswich"',
    new: '{ id: 30456, name: "IBEW Local 456", city: "North Brunswick"',
    why: 'IBEW 456 — brunswich → Brunswick' },
  { old: '{ id: 30953, name: "IBEW Local 953", city: "Eau clarie"',
    new: '{ id: 30953, name: "IBEW Local 953", city: "Eau Claire"',
    why: 'IBEW 953 — clarie → Claire' },
  { old: '{ id: 40401, name: "IW Local 401", city: "Philadephia"',
    new: '{ id: 40401, name: "IW Local 401", city: "Philadelphia"',
    why: 'IW 401 — Philadephia → Philadelphia' },
  { old: '{ id: 40405, name: "IW Local 405", city: "Philadephia"',
    new: '{ id: 40405, name: "IW Local 405", city: "Philadelphia"',
    why: 'IW 405 — Philadephia → Philadelphia' },
  { old: '{ id: 40854, name: "IW Local 854", city: "Fredricksburg"',
    new: '{ id: 40854, name: "IW Local 854", city: "Fredericksburg"',
    why: 'IW 854 — Fredricksburg → Fredericksburg' },
  { old: '{ id: 20043, name: "UA Local 43", city: "Chatanooga"',
    new: '{ id: 20043, name: "UA Local 43", city: "Chattanooga"',
    why: 'UA 43 — Chatanooga → Chattanooga' },
  { old: '{ id: 20192, name: "UA Local 192", city: "Cheyanne"',
    new: '{ id: 20192, name: "UA Local 192", city: "Cheyenne"',
    why: 'UA 192 — Cheyanne → Cheyenne' },
  { old: '{ id: 20420, name: "UA Local 420", city: "Philadephia"',
    new: '{ id: 20420, name: "UA Local 420", city: "Philadelphia"',
    why: 'UA 420 — Philadephia → Philadelphia' },
  { old: '{ id: 20690, name: "UA Local 690", city: "Philadephia"',
    new: '{ id: 20690, name: "UA Local 690", city: "Philadelphia"',
    why: 'UA 690 — Philadephia → Philadelphia' },
  { old: '{ id: 20692, name: "UA Local 692", city: "Philadephia"',
    new: '{ id: 20692, name: "UA Local 692", city: "Philadelphia"',
    why: 'UA 692 — Philadephia → Philadelphia' },

  // ============ EMPTY CITIES (3 fixes) ============
  { old: '{ id: 20074, name: "UA Local 74", city: "", state: "DE"',
    new: '{ id: 20074, name: "UA Local 74", city: "Newark", state: "DE"',
    why: 'UA 74 — empty city, addr is Newark, DE' },
  { old: '{ id: 20155, name: "UA Local 155", city: "", state: "AR"',
    new: '{ id: 20155, name: "UA Local 155", city: "Little Rock", state: "AR"',
    why: 'UA 155 — empty city, addr is Little Rock, AR' },
  { old: '{ id: 20821, name: "UA Local 821", city: "", state: "FL"',
    new: '{ id: 20821, name: "UA Local 821", city: "West Palm Beach", state: "FL"',
    why: 'UA 821 — empty city, addr is West Palm Beach, FL' },
];

// ============================================================================
// VERIFY EVERY ANCHOR EXISTS BEFORE MAKING ANY CHANGES
// If any single anchor is missing, exit with a detailed report — keeps the
// file in a known-good state when an upstream change has shifted things.
// ============================================================================
const missing = [];
const alreadyApplied = [];
for (const fix of FIXES) {
  if (src.includes(fix.new)) {
    alreadyApplied.push(fix.why);
  } else if (!src.includes(fix.old)) {
    missing.push(fix.why + '\n      Looking for: ' + fix.old.slice(0, 100) + '...');
  }
}

if (missing.length > 0) {
  console.error('ERROR: ' + missing.length + ' anchor(s) not found in src/App.jsx:');
  missing.forEach(m => console.error('  - ' + m));
  console.error('');
  console.error('No changes made. Investigate the unfound anchors before re-running.');
  console.error('(Likely cause: a previous fix has changed the data shape, or a typo');
  console.error(' in this fix script. Check by grepping for the local id in App.jsx.)');
  process.exit(1);
}

console.log('Anchor verification:');
console.log('  ' + (FIXES.length - alreadyApplied.length) + ' to apply');
console.log('  ' + alreadyApplied.length + ' already correct (will skip)');
console.log('');

// ============================================================================
// APPLY ALL FIXES
// ============================================================================
let applied = 0;
for (const fix of FIXES) {
  if (src.includes(fix.old)) {
    src = src.replace(fix.old, fix.new);
    applied++;
  }
}

// Add the marker comment so this script is idempotent on re-runs
src = src.replace(
  "    const validPages = ['home',",
  "    " + MARKER + "\n    const validPages = ['home',"
);

fs.writeFileSync(FILE, src);

console.log('  ✓ Applied ' + applied + ' city/state corrections');
console.log('  ✓ Marker added for idempotency');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: city/state audit — 65 corrections" && git push');
console.log('');
