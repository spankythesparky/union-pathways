// fix170.js — Right to Work page reorg
//
// What this does:
//   - Replaces the existing RTWPage component definition (the inline component
//     wrapped inside the page === "rtw" IIFE) with a new version that:
//
//   1. Adds a sticky section nav under the hero with smooth-scroll jump links
//      and an active-section indicator driven by IntersectionObserver.
//
//   2. Reorders the body so the "What It Is" definition comes BEFORE the
//      headline gap stats — readers learn what RTW is before being shown
//      the gap, which makes the gap mean something.
//
//   3. Consolidates Map / Comparison / Dashboard into a single tabbed
//      "Explore the Data" section (one section instead of three) so the
//      page is roughly half the scroll-length.
//
// Reads:
//   - rtw_block.txt (the new component code, kept in a separate file for
//     readability — must sit next to fix170.js when you run it)
//
// Writes:
//   - src/App.jsx (in place)
//
// Idempotency:
//   - Detects whether the new code is already in place. If so, exits cleanly.
//   - Detects the old code by an anchor that exists only in the old version.

const fs = require('fs');
const path = require('path');

const FILE = 'src/App.jsx';
const BLOCK = 'rtw_block.txt';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root (~/Desktop/union-pathway).');
  process.exit(1);
}
if (!fs.existsSync(BLOCK)) {
  console.error('ERROR: rtw_block.txt not found. Place it next to fix170.js.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const newComponent = fs.readFileSync(BLOCK, 'utf8');

// Idempotency check — new version has these unique markers (JSX comments use {/* */}).
// Both must be present to consider the file already migrated.
const NEW_MARKER_1 = "const [activeTool, setActiveTool] = useState('map');";
const NEW_MARKER_2 = "{/* STICKY SECTION NAV */}";
if (src.includes(NEW_MARKER_1) && src.includes(NEW_MARKER_2)) {
  console.log('Already applied — RTW reorg is already in place. No changes made.');
  process.exit(0);
}

// Find the start of the old component
const startMarker = '          const RTWPage = () => {';
const startIdx = src.indexOf(startMarker);
if (startIdx === -1) {
  console.error('ERROR: could not find "const RTWPage = () => {" in src/App.jsx');
  console.error('       The file may have been edited since this fix was written.');
  process.exit(1);
}

// Find the end — look for the closing of the component followed by `return <RTWPage />;`
const endMarker = '\n          return <RTWPage />;';
const endIdx = src.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  console.error('ERROR: could not find "return <RTWPage />;" anchor');
  process.exit(1);
}

// Sanity: the chunk we're replacing should contain at least one of the old-only markers
const oldChunk = src.slice(startIdx, endIdx);
const OLD_ONLY_MARKERS = [
  '// COMPARISON TOOL',
  '// DASHBOARD',
  '// TIMELINE',
  '// PAGE RENDER',
  'fontSize:\'clamp(32px, 5vw, 56px)\', fontWeight:900, color:\'#fff\', margin:\'0 0 32px 0\''
];
const matchedOld = OLD_ONLY_MARKERS.filter(m => oldChunk.includes(m));
if (matchedOld.length === 0) {
  console.error('ERROR: replacement region does not look like the old RTWPage component.');
  console.error('       Did not find any of the old-version markers.');
  console.error('       Aborting to avoid corrupting the file.');
  process.exit(1);
}

console.log('Old component found:');
console.log('  start byte:', startIdx);
console.log('  end byte:  ', endIdx);
console.log('  size:      ', oldChunk.length, 'bytes');
console.log('  old markers matched:', matchedOld.length, '/', OLD_ONLY_MARKERS.length);
console.log('');
console.log('New component:');
console.log('  size:      ', newComponent.length, 'bytes');

// newComponent already ends with `};\n` (component closing brace + newline).
// endMarker starts with `\n          return <RTWPage />;`, so we want our
// replacement to leave the file looking like:
//
//     ...new component body...
//     };
//           return <RTWPage />;
//
// To make that work, strip a single trailing newline from newComponent if
// present so the source's `\n          return <RTWPage />;` provides the break.
const newBlock = newComponent.endsWith('\n') ? newComponent.slice(0, -1) : newComponent;

const newSrc = src.slice(0, startIdx) + newBlock + src.slice(endIdx);

fs.writeFileSync(FILE, newSrc);

console.log('');
console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: reorg Right to Work page — sticky nav, tabs, reordered sections" && git push');
console.log('');
