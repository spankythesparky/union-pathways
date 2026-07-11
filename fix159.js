// fix159.js — Fix mobile drawer scrolling
//
// The drawer uses height:100vh which on iOS Safari includes the address bar
// area, causing the bottom of the drawer to be clipped behind the browser
// chrome. Even with overflow-y:auto, the user can't reach the bottom.
//
// Three fixes:
//   1. Use height:100dvh (dynamic viewport height) which respects iOS chrome
//      with a 100vh fallback for older browsers
//   2. Add -webkit-overflow-scrolling:touch for momentum scrolling on iOS
//   3. Add bottom padding inside the drawer so the last items aren't flush
//      against the home indicator on iPhones

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('100dvh')) {
  console.error('ERROR: Drawer scroll fix already applied. Aborting.');
  process.exit(1);
}

const cssOld = `        .mobile-drawer {
          position: fixed;
          top: 0; right: 0;
          height: 100vh;
          width: min(360px, 88vw);
          background: var(--steel);
          border-left: 1px solid rgba(255,255,255,0.1);
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.25s ease;
          overflow-y: auto;
          box-shadow: -8px 0 24px rgba(0,0,0,0.4);
        }`;

const cssNew = `        .mobile-drawer {
          position: fixed;
          top: 0; right: 0;
          height: 100vh;            /* fallback */
          height: 100dvh;            /* respects iOS Safari chrome */
          width: min(360px, 88vw);
          background: var(--steel);
          border-left: 1px solid rgba(255,255,255,0.1);
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.25s ease;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;  /* momentum scroll on iOS */
          overscroll-behavior: contain;       /* don't bubble scroll to body */
          padding-bottom: env(safe-area-inset-bottom, 32px);  /* iPhone home indicator */
          box-shadow: -8px 0 24px rgba(0,0,0,0.4);
        }`;

if (!src.includes(cssOld)) {
  console.error('ERROR: Could not find .mobile-drawer CSS block. Aborting.');
  process.exit(1);
}
src = src.replace(cssOld, () => cssNew);

if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Mobile drawer scroll fixed:');
console.log('  - height: 100dvh (respects iOS Safari chrome, falls back to 100vh)');
console.log('  - -webkit-overflow-scrolling:touch (momentum scroll on iOS)');
console.log('  - overscroll-behavior:contain (no bubbling to page underneath)');
console.log('  - safe-area-inset-bottom padding (clears iPhone home indicator)');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: mobile drawer scroll on iOS" && git push');
console.log('');
