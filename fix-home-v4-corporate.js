// fix-home-v4-corporate.js
//
// ATOMIC SWAP: replaces the entire home page block with the new corporate design.
// Foundation (body background, nav, other pages) UNTOUCHED — this is home-page-only.
//
// Preserves all functionality: search, trade picker, geolocate, map toggle,
// share, correction submission, results display, language switching.

const fs = require('fs');
const FILE = 'src/App.jsx';
const BLOCK = 'home_v4_block.txt';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}
if (!fs.existsSync(BLOCK)) {
  console.error('ERROR: ' + BLOCK + ' not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('HOME PAGE — Corporate Professional (v4)')) {
  console.error('ERROR: Home v4 already applied. Aborting.');
  process.exit(1);
}

const blockText = fs.readFileSync(BLOCK, 'utf8');

// Precise anchor match — the current home block
const anchorStart = '        {page === "home" && (<>';
const anchorEnd = '        </>)}\n';

const startIdx = src.indexOf(anchorStart);
if (startIdx === -1) {
  console.error('ERROR: Could not find home block start anchor.');
  process.exit(1);
}

// Find the FIRST </>)} after the start anchor
const searchStartFrom = startIdx + anchorStart.length;
const endMatchIdx = src.indexOf(anchorEnd, searchStartFrom);
if (endMatchIdx === -1) {
  console.error('ERROR: Could not find home block end anchor.');
  process.exit(1);
}
const endIdx = endMatchIdx + anchorEnd.length;

const removedLength = endIdx - startIdx;
if (removedLength < 8000 || removedLength > 30000) {
  console.error('ERROR: Suspect block size (' + removedLength + ' chars). Aborting for safety.');
  process.exit(1);
}

src = src.slice(0, startIdx) + blockText + src.slice(endIdx);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Home page atomic swap applied (v4 corporate):');
console.log('  - Paper background #FAFAF7 (home page only, not sitewide)');
console.log('  - Navy #072554 typography, orange #FF6B00 accents');
console.log('  - Inter font throughout, no italics or monospace');
console.log('  - Elevated white search card with shadow');
console.log('  - Trade pills: navy when active, white with light border otherwise');
console.log('  - Orange "Find Local" button');
console.log('  - Big navy stats with orange accents (1,000+, $0)');
console.log('  - Feature rows with navy gradient visual blocks');
console.log('  - Full multilingual (EN/ES/PL)');
console.log('  - All functionality preserved (search, geolocate, map, share, correction)');
console.log('  - Other pages COMPLETELY UNTOUCHED');
console.log('');
console.log('Now run:');
console.log('  rm home_v4_block.txt && git add src/App.jsx && git commit -m "feat: home page corporate redesign (v4)" && git push');
console.log('');
