// fix189.js — Wrap Down Payment Calculator hooks in a proper component
//
// Bug:
//   First load of /downpayment shows a white screen. Reloading the page
//   makes it appear correctly.
//
// Cause:
//   fix187 inlined the helper components but in the process removed the
//   `DownPaymentCalculator = () => { ... }` wrapper. The hooks (useState x6)
//   are now called directly inside an IIFE (`(() => { ... })()`), which
//   violates React's Rules of Hooks. Hooks must be called from inside an
//   actual React component function, not from a one-off arrow function
//   invoked inline.
//
//   On first mount, React's hook tracking can fail silently and render
//   nothing (white screen). On a subsequent reload, hot-reload or
//   re-evaluation re-enters the code path differently and it appears to
//   "work" — but the underlying violation is still there.
//
// Fix:
//   Re-introduce the `DownPaymentCalculator` wrapper component, move all
//   the hook calls and computed values inside it, and call <DownPaymentCalculator />
//   from the IIFE return. Helpers stay inline (no remount on keystroke bug
//   reintroduced).
//
// Idempotency: detects 'const DownPaymentCalculator' and exits cleanly.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('const DownPaymentCalculator = ()')) {
  console.log('Already applied — calculator wrapper component is already in place.');
  process.exit(0);
}

// ----------------------------------------------------------------------------
// Find the IIFE body. Anchors:
//   - Start: `// fix187 inlined`
//   - End:   the line `        })()}` immediately after the closing JSX
// We need to (a) wrap the body in `const DownPaymentCalculator = () => { ... };`
//          (b) ensure the IIFE returns `<DownPaymentCalculator />`
// ----------------------------------------------------------------------------

// Step 1: find IIFE start. The line right after `{page === "downpayment" && (() => {` opens the body.
const iifeOpenAnchor = '        {page === "downpayment" && (() => {\n// fix187 inlined — helpers inlined to prevent input remount on every keystroke';
if (!src.includes(iifeOpenAnchor)) {
  console.error('ERROR: could not find calculator IIFE opening anchor');
  process.exit(1);
}

// Step 2: replace the opening so it begins a wrapper component definition
const newOpen = `        {page === "downpayment" && (() => {
          // fix189 — wrap hooks in a real component (was IIFE-direct, caused white screen)
          const DownPaymentCalculator = () => {
            const monoFont = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
            const displayFont = { fontFamily: "'Barlow Condensed', Impact, sans-serif", letterSpacing: '0.01em', fontWeight: 900 };`;

// We need to remove the existing first body lines (the duplicate monoFont/displayFont
// declarations) AND replace the opening. Build a longer match string that includes them:
const oldOpenFull = `        {page === "downpayment" && (() => {
// fix187 inlined — helpers inlined to prevent input remount on every keystroke
          const monoFont = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
          const displayFont = { fontFamily: "'Barlow Condensed', Impact, sans-serif", letterSpacing: '0.01em', fontWeight: 900 };`;

if (!src.includes(oldOpenFull)) {
  console.error('ERROR: could not find full calculator IIFE open block');
  process.exit(1);
}
src = src.replace(oldOpenFull, newOpen);

// Anchor on a string that's unique to the calculator: "DISCIPLINE NOT INCLUDED".
// We capture from there through the end of the IIFE and rewrite to add the
// component wrapper close + invocation.
const oldClose = `                  DISCIPLINE NOT INCLUDED — BRING YOUR OWN.
                </div>
              </div>
            </div>
          );
        })()}`;

if (!src.includes(oldClose)) {
  console.error('ERROR: could not find calculator IIFE close anchor (DISCIPLINE marker)');
  process.exit(1);
}

const newClose = `                  DISCIPLINE NOT INCLUDED — BRING YOUR OWN.
                </div>
              </div>
            </div>
            );
          };
          return <DownPaymentCalculator />;
        })()}`;

src = src.replace(oldClose, newClose);

fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated — calculator now uses a proper component wrapper');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: white screen on Down Payment Calculator first load" && git push');
console.log('');
