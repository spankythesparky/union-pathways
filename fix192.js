// fix192.js — Fix white-out <select> dropdowns site-wide
//
// Bug:
//   On the Wage Calculator page, when you click the "Compare Against"
//   dropdown, the dropdown options render as a giant white rectangle
//   instead of styled to match the dark UI.
//
// Cause:
//   HTML <select> dropdowns are rendered by the browser/OS, NOT by
//   the page's CSS. The site styles the <select> button itself nicely
//   (dark bg, white text), but never styles the <option> children.
//   Without explicit option styling AND without a `color-scheme: dark`
//   declaration, browsers fall back to OS defaults — which on Windows
//   light mode is white-on-black, but renders as the giant white box
//   you saw.
//
// Fix:
//   Add two CSS rules to the global stylesheet block:
//     1. body { color-scheme: dark; } — tells browsers to use dark
//        defaults for native form controls (scroll bars, dropdowns,
//        date pickers, etc.)
//     2. select, option, optgroup { background:#1a1a1a; color:#fff; } —
//        explicit fallback for browsers/OSes that don't honor
//        color-scheme on form controls (some older Chromium, Linux,
//        some mobile keyboards).
//
//   Site-wide rule means all 5 existing <select> elements + any
//   future ones automatically get the right dark styling.
//
// Idempotency: detects 'color-scheme: dark' marker and exits cleanly.
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

if (src.includes('color-scheme: dark')) {
  console.log('Already applied — dropdown dark mode fix is already in place.');
  process.exit(0);
}

// Anchor on the @import line at the top of the global style block.
// We insert our fix immediately after the blank line that follows it.
const anchor = `        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');


`;

const insertion = `        /* fix192 — dark color scheme for native form controls (fixes white-out <select> dropdowns) */
        html, body { color-scheme: dark; }
        select, option, optgroup {
          background-color: #1a1a1a;
          color: #fff;
        }
        select option:hover,
        select option:checked,
        select option:focus {
          background-color: #FA8059;
          color: #0F1620;
        }


`;

if (!src.includes(anchor)) {
  console.error('ERROR: could not find @import anchor in global style block');
  process.exit(1);
}
src = src.replace(anchor, anchor + insertion);

fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - Added color-scheme: dark to html, body');
console.log('  - Added explicit dark styling for <select>, <option>, <optgroup>');
console.log('  - Added orange highlight for hovered/selected options');
console.log('  - Affects all 5 existing dropdowns site-wide + any future ones');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: dark dropdown styling (fixes wage calculator white-out)" && git push');
console.log('');
