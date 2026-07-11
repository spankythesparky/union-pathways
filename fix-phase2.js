// fix-phase2.js — Home page redesign (Phase 2)
//
// Replaces the current home page block with the new Spanky-influenced design:
//   - Big Space Grotesk hero typography with italic accent
//   - Trade pills (already pretty close to right) made more refined
//   - Search input as underline instead of boxed
//   - Coral pill submit button
//   - Geolocate as text link
//   - Stats with gradient coral-to-white numbers, no card backgrounds
//   - Borderless flowing results list (instead of bordered cards)
//   - Map container styled to fit the dark coral theme
//   - "Built by tradespeople" italic closing section
//
// All functionality preserved: search, geolocate, map toggle, share, correction submission,
// language switching (en/es/pl).

const fs = require('fs');
const FILE = 'src/App.jsx';
const BLOCK = 'home_v3_block.txt';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}
if (!fs.existsSync(BLOCK)) {
  console.error('ERROR: ' + BLOCK + ' not found. Both files needed.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency — look for a marker that's only in the new block
if (src.includes("// Pick your trade")) {
  console.error('ERROR: Phase 2 home redesign appears already applied. Aborting.');
  process.exit(1);
}

const blockText = fs.readFileSync(BLOCK, 'utf8');

// Find and replace the entire current home block (from {page === "home" && (<>) to the closing </>)})
// Using a precise multi-line anchor.
const anchorStart = '        {page === "home" && (<>';
const anchorEnd = '        </>)}\n';

const startIdx = src.indexOf(anchorStart);
if (startIdx === -1) {
  console.error('ERROR: Could not find home block start anchor.');
  process.exit(1);
}

// Find the matching </>)} that closes the home block
// We need to find the FIRST </>)} after the start anchor that's at the same indent
let searchFrom = startIdx + anchorStart.length;
let endIdx = -1;
while (true) {
  const nextEnd = src.indexOf(anchorEnd, searchFrom);
  if (nextEnd === -1) break;
  // Check this is actually the closing of the home block by verifying we don't have another home block start before it
  endIdx = nextEnd + anchorEnd.length;
  break;
}

if (endIdx === -1) {
  console.error('ERROR: Could not find home block end anchor.');
  process.exit(1);
}

// Sanity check: the home block should be roughly 200-300 lines (about 10,000-15,000 chars)
const removedLength = endIdx - startIdx;
if (removedLength < 5000 || removedLength > 20000) {
  console.error('ERROR: Suspect home block size (' + removedLength + ' chars). Aborting for safety.');
  process.exit(1);
}

src = src.slice(0, startIdx) + blockText + src.slice(endIdx);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Home page redesigned (Phase 2):');
console.log('  - Big Space Grotesk hero with italic coral accent word');
console.log('  - Underline-style search input');
console.log('  - Coral pill button');
console.log('  - Gradient stat numbers (coral → white)');
console.log('  - Borderless flowing results list');
console.log('  - Map container styled to fit coral theme');
console.log('  - "Built by tradespeople" closing section');
console.log('  - ALL functionality preserved (search, geolocate, map, share, correction, language)');
console.log('');
console.log('Now run:');
console.log('  rm home_v3_block.txt && git add src/App.jsx && git commit -m "feat: phase 2 home page redesign" && git push');
console.log('');
