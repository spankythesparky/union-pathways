// fix181.js — Remove the newsletter section from the homepage
//
// Why this is reversible:
//   We just delete the JSX block fix180 inserted. No code outside that block
//   ever referenced the newsletter section, so removal is clean. To bring
//   the section back later, simply re-run fix180.js.
//
// Idempotency: detects "THE UNION PATHWAYS BRIEF" presence; if it's already
// gone, exits with no changes.
//
// Reads:  src/App.jsx
// Writes: src/App.jsx (in place)

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (!src.includes('THE UNION PATHWAYS BRIEF') && !src.includes('beehiiv.com/subscribe')) {
  console.log('Already removed — no newsletter section found in src/App.jsx.');
  process.exit(0);
}

// ----------------------------------------------------------------------------
// The newsletter block was inserted between the map-section closing div and
// the "{/* SECTION TITLE */}" comment. We restore the original layout by
// removing everything between those two anchors.
// ----------------------------------------------------------------------------
const startAnchor = '            {/* NEWSLETTER — THE UNION PATHWAYS BRIEF */}';
const endAnchor = '            {/* SECTION TITLE */}';

const startIdx = src.indexOf(startAnchor);
if (startIdx === -1) {
  console.error('ERROR: could not find newsletter section start marker');
  console.error('       The section may have been edited manually since fix180.');
  process.exit(1);
}
const endIdx = src.indexOf(endAnchor, startIdx);
if (endIdx === -1) {
  console.error('ERROR: could not find SECTION TITLE marker after the newsletter block');
  process.exit(1);
}

// Sanity check on what we're removing — must contain the unique brand phrase
const removalChunk = src.slice(startIdx, endIdx);
if (!removalChunk.includes('THE UNION PATHWAYS BRIEF') && !removalChunk.includes('Union Pathways Brief')) {
  console.error('ERROR: removal range does not contain the expected newsletter content');
  console.error('       Aborting to avoid deleting the wrong section.');
  process.exit(1);
}

console.log('Newsletter section located:');
console.log('  start byte:', startIdx);
console.log('  end byte:  ', endIdx);
console.log('  size:      ', removalChunk.length, 'bytes');

src = src.slice(0, startIdx) + src.slice(endIdx);

fs.writeFileSync(FILE, src);

console.log('');
console.log('  ✓ src/App.jsx updated — newsletter section removed');
console.log('');
console.log('To restore later: re-run fix180.js (it will detect the section is missing and re-insert it).');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "chore: remove newsletter section pending email provider setup" && git push');
console.log('');
