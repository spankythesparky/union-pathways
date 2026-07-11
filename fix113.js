// fix113.js — Sweep & fix all locals with invalid state codes (TE, US, JE, etc.)
// Each correction matches the city/state we'd extract from the local's address field.
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

// Each entry: {find, replace, label}
// We do narrow find+replace to ensure we only edit the intended local.
// We always include id + name in the find to make uniqueness obvious.
const fixes = [
  // --- State = "US" ---
  {
    label: 'IBEW Local 3 — Ny city/US → Flushing/NY',
    find:  'id: 10003, name: "IBEW Local 3", city: "Ny city", state: "US"',
    replace: 'id: 10003, name: "IBEW Local 3", city: "Flushing", state: "NY"',
  },
  {
    label: 'IBEW Local 6 — San francisco/US → San Francisco/CA',
    find:  'id: 10006, name: "IBEW Local 6", city: "San francisco", state: "US"',
    replace: 'id: 10006, name: "IBEW Local 6", city: "San Francisco", state: "CA"',
  },
  {
    label: 'HFIAW Local 207 — Regional abatement/US → Taylor/MI',
    find:  'id: 50207, name: "HFIAW Local 207", city: "Regional abatement", state: "US"',
    replace: 'id: 50207, name: "HFIAW Local 207", city: "Taylor", state: "MI"',
  },
  {
    label: 'IUOE Local 955 — Edmonton/US → Edmonton/AB',
    find:  'id: 155500, name: "IUOE Local 955", city: "Edmonton", state: "US"',
    replace: 'id: 155500, name: "IUOE Local 955", city: "Edmonton", state: "AB"',
  },
  {
    label: 'IUOE Local 987 — Winnipeg/US → Winnipeg/MB',
    find:  'id: 158700, name: "IUOE Local 987", city: "Winnipeg", state: "US"',
    replace: 'id: 158700, name: "IUOE Local 987", city: "Winnipeg", state: "MB"',
  },
  {
    label: 'IUOE Local 942 — Charlottetown/US → Charlottetown/PE',
    find:  'id: 154200, name: "IUOE Local 942", city: "Charlottetown", state: "US"',
    replace: 'id: 154200, name: "IUOE Local 942", city: "Charlottetown", state: "PE"',
  },

  // --- IUEC: full state name "Puerto Rico" → PR ---
  {
    label: 'IUEC Local 141 — San juan/Puerto Rico → San Juan/PR',
    find:  'id: 51141, name: "IUEC Local 141", city: "San juan", state: "Puerto Rico"',
    replace: 'id: 51141, name: "IUEC Local 141", city: "San Juan", state: "PR"',
  },

  // --- UA: multi-word cities split into city+state-fragment ---
  {
    label: 'UA Local 9 — Central new/JE → Englishtown/NJ',
    find:  'id: 20009, name: "UA Local 9", city: "Central new", state: "JE"',
    replace: 'id: 20009, name: "UA Local 9", city: "Englishtown", state: "NJ"',
  },
  {
    label: 'UA Local 56 — Halifax/NO → Dartmouth/NS',
    find:  'id: 20056, name: "UA Local 56", city: "Halifax", state: "NO"',
    replace: 'id: 20056, name: "UA Local 56", city: "Dartmouth", state: "NS"',
  },
  {
    label: 'UA Local 78 — Los/AN → Los Angeles/CA',
    find:  'id: 20078, name: "UA Local 78", city: "Los", state: "AN"',
    replace: 'id: 20078, name: "UA Local 78", city: "Los Angeles", state: "CA"',
  },
  {
    label: 'UA Local 282 — Halifax/NO → Halifax/NS',
    find:  'id: 20282, name: "UA Local 282", city: "Halifax", state: "NO"',
    replace: 'id: 20282, name: "UA Local 282", city: "Halifax", state: "NS"',
  },
  {
    label: 'UA Local 300 — North and south/DA → Mandan/ND',
    find:  'id: 20300, name: "UA Local 300", city: "North and south", state: "DA"',
    replace: 'id: 20300, name: "UA Local 300", city: "Mandan", state: "ND"',
  },
  {
    label: 'UA Local 322 — Southern new/JE → Winslow/NJ',
    find:  'id: 20322, name: "UA Local 322", city: "Southern new", state: "JE"',
    replace: 'id: 20322, name: "UA Local 322", city: "Winslow", state: "NJ"',
  },
  {
    label: 'UA Local 682 — Sydney/NO → Sydney/NS',
    find:  'id: 20682, name: "UA Local 682", city: "Sydney", state: "NO"',
    replace: 'id: 20682, name: "UA Local 682", city: "Sydney", state: "NS"',
  },

  // --- BAC: full state names truncated to first 2 chars ---
  {
    label: 'BAC Local 3 (Northern California) — Northern California/No → Oakland/CA',
    find:  'id: 20502, name: "BAC Local 3 (Northern California)", city: "Northern California", state: "No"',
    replace: 'id: 20502, name: "BAC Local 3 (Northern California)", city: "Oakland", state: "CA"',
  },
  {
    label: 'BAC Local 4 (Southern California) — Southern California/So → LaVerne/CA',
    find:  'id: 20503, name: "BAC Local 4 (Southern California)", city: "Southern California", state: "So"',
    replace: 'id: 20503, name: "BAC Local 4 (Southern California)", city: "LaVerne", state: "CA"',
  },
  {
    label: 'BAC Local 1 (MD/VA/DC) — Maryland/Di → Laurel/MD',
    find:  'id: 20506, name: "BAC Local 1 (Maryland, Virginia, District of Columbia)", city: "Maryland", state: "Di"',
    replace: 'id: 20506, name: "BAC Local 1 (Maryland, Virginia, District of Columbia)", city: "Laurel", state: "MD"',
  },
  {
    label: 'BAC Local 1 (Hawaii) — Hawaii/Ha → Honolulu/HI',
    find:  'id: 20507, name: "BAC Local 1 (Hawaii)", city: "Hawaii", state: "Ha"',
    replace: 'id: 20507, name: "BAC Local 1 (Hawaii)", city: "Honolulu", state: "HI"',
  },
  {
    label: 'BAC Local 3 (Iowa) — Iowa/Io → Marshalltown/IA',
    find:  'id: 20508, name: "BAC Local 3 (Iowa)", city: "Iowa", state: "Io"',
    replace: 'id: 20508, name: "BAC Local 3 (Iowa)", city: "Marshalltown", state: "IA"',
  },
  {
    label: 'BAC Local 4 (IN/KY) — indiana/Ke → Indianapolis/IN',
    find:  'id: 20511, name: "BAC Local 4 (indiana, Kentucky)", city: "indiana", state: "Ke"',
    replace: 'id: 20511, name: "BAC Local 4 (indiana, Kentucky)", city: "Indianapolis", state: "IN"',
  },
  {
    label: 'BAC Local 3 (MA/ME/NH/RI) — Massachusetts/Rh → Charlestown/MA',
    find:  'id: 20512, name: "BAC Local 3 (Massachusetts, Maine, New Hampshire, Rhode Island)", city: "Massachusetts", state: "Rh"',
    replace: 'id: 20512, name: "BAC Local 3 (Massachusetts, Maine, New Hampshire, Rhode Island)", city: "Charlestown", state: "MA"',
  },
  {
    label: 'BAC ADC of Eastern Missouri — Eastern Missouri/Ea → Fenton/MO',
    find:  'id: 20516, name: "BAC ADC Of Eastern Missouri (Eastern Missouri)", city: "Eastern Missouri", state: "Ea"',
    replace: 'id: 20516, name: "BAC ADC Of Eastern Missouri (Eastern Missouri)", city: "Fenton", state: "MO"',
  },
  {
    label: 'BAC Local 8 (Southeast) — Southeast/So → Atlanta/GA',
    find:  'id: 20532, name: "BAC Local 8 (Southeast)", city: "Southeast", state: "So"',
    replace: 'id: 20532, name: "BAC Local 8 (Southeast)", city: "Atlanta", state: "GA"',
  },
  {
    label: 'BAC Local 1 (Saskatchewan) — Saskatchewan/Sa → Regina/SK',
    find:  'id: 20533, name: "BAC Local 1 (Saskatchewan)", city: "Saskatchewan", state: "Sa"',
    replace: 'id: 20533, name: "BAC Local 1 (Saskatchewan)", city: "Regina", state: "SK"',
  },
];

let applied = 0;
let failed = 0;

for (const fix of fixes) {
  if (!code.includes(fix.find)) {
    console.log('  ✗ NOT FOUND: ' + fix.label);
    failed++;
    continue;
  }
  if (code.split(fix.find).length > 2) {
    console.log('  ✗ MULTIPLE MATCHES (skipped): ' + fix.label);
    failed++;
    continue;
  }
  code = code.replace(fix.find, fix.replace);
  console.log('  ✓ ' + fix.label);
  applied++;
}

console.log('\n' + applied + '/' + fixes.length + ' fixes applied');
if (failed > 0) {
  console.error('\n⚠ ' + failed + ' fixes failed. Review and patch by hand if needed.');
}

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: correct invalid state codes for ' + applied + ' locals" && git push\n');
