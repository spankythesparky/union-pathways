// fix152.js — Fix RTW page white-screen-on-first-click bug
//
// The bug: top-level useState calls inside the (() => { ... })() IIFE
// only execute when page === "rtw". This means React's hook count changes
// between renders, which violates the Rules of Hooks and causes the first
// render after navigation to fail (blank screen). Refresh works because on
// a fresh mount the hooks are present from the very first render.
//
// The fix: wrap the page contents in a real React component (RTWPage)
// whose hooks are scoped to its own component lifecycle. The IIFE then
// just returns <RTWPage />, mounting it cleanly when page === "rtw".
//
// Two edits:
//   1. Insert `const RTWPage = () => {` just before the // PAGE-LEVEL STATE block
//   2. Insert `};` + `return <RTWPage />;` between the JSX return and the IIFE close

const fs = require('fs');

const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from the project root (~/Desktop/union-pathway).');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency check
if (src.includes('const RTWPage = () => {')) {
  console.error('ERROR: RTWPage component already exists. Aborting to avoid duplicates.');
  process.exit(1);
}

// ============================================================
// Edit 1: Insert `const RTWPage = () => {` before the PAGE-LEVEL STATE block
// ============================================================
const stateAnchorOld = `          // ============================================================
          // PAGE-LEVEL STATE (interactive controls)
          // ============================================================
          const [selectedState, setSelectedState] = useState('TX');`;

const stateAnchorNew = `          // ============================================================
          // RTW PAGE COMPONENT — wrapped so hooks are scoped to its lifecycle
          // (top-level hooks inside the IIFE caused white-screen-on-first-click)
          // ============================================================
          const RTWPage = () => {
          // ============================================================
          // PAGE-LEVEL STATE (interactive controls)
          // ============================================================
          const [selectedState, setSelectedState] = useState('TX');`;

if (!src.includes(stateAnchorOld)) {
  console.error('ERROR: Could not find PAGE-LEVEL STATE anchor. Aborting.');
  process.exit(1);
}
const stateAnchorCount = src.split(stateAnchorOld).length - 1;
if (stateAnchorCount !== 1) {
  console.error('ERROR: Expected exactly 1 PAGE-LEVEL STATE match, found ' + stateAnchorCount + '. Aborting.');
  process.exit(1);
}
src = src.replace(stateAnchorOld, () => stateAnchorNew);

// ============================================================
// Edit 2: Close the RTWPage component and return it from the IIFE
// ============================================================
// Anchor on the unique "Back to Home" button + the IIFE close pattern.
// "Back to Home" is unique to the rtw block in this file.
const closeAnchorOld = `}}>← Back to Home</button>
              </div>
            </div>
          );
        })()}`;

const closeAnchorNew = `}}>← Back to Home</button>
              </div>
            </div>
          );
          };
          return <RTWPage />;
        })()}`;

if (!src.includes(closeAnchorOld)) {
  console.error('ERROR: Could not find IIFE close anchor (Back to Home + closing pattern). Aborting.');
  process.exit(1);
}
const closeAnchorCount = src.split(closeAnchorOld).length - 1;
if (closeAnchorCount !== 1) {
  console.error('ERROR: Expected exactly 1 IIFE close anchor match, found ' + closeAnchorCount + '. Aborting.');
  process.exit(1);
}
src = src.replace(closeAnchorOld, () => closeAnchorNew);

// ============================================================
// Final verification
// ============================================================
if (src === original) {
  console.error('ERROR: No changes were made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. RTW page hooks now scoped correctly:');
console.log('  - Wrapped page contents in `const RTWPage = () => { ... };`');
console.log('  - IIFE now returns <RTWPage /> instead of inline JSX');
console.log('  - Hooks scoped to RTWPage lifecycle = clean mount on first click');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: wrap RTW page in component to fix first-click white screen" && git push');
console.log('');
