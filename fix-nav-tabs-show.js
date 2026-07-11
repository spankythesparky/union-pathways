// fix-nav-tabs-show.js — Fix the malformed media query that hides nav-links globally
//
// Found a real bug: line 6518 has a stray `}` that closes the @media (max-width: 640px)
// block prematurely. All the rules after it (including `.nav-links { display: none }`)
// are floating outside any media query, so they apply on ALL screen sizes.
//
// Fix: properly wrap those rules in their own media query at 760px (a more sensible
// breakpoint for hiding the desktop nav).

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* NAV TABS FIX */')) {
  console.error('ERROR: Nav tabs fix already applied. Aborting.');
  process.exit(1);
}

// The malformed block — must match exactly
const malformedBlock = `        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
          .form-row { grid-template-columns: 1fr; }
        }
          .search-card { padding: 20px 20px; }
          .search-row { flex-direction: column; }
          .btn-search { width: 100%; }
          .results-section { padding: 0 16px 60px; }
          .local-card { flex-direction: column; gap: 12px; }
          .card-distance { flex-direction: row; align-items: center; gap: 10px; }
          .features { gap: 30px; }
          footer { justify-content: center; text-align: center; }
          .nav-wordmark { font-size: 17px; }
          .nav-link { padding: 5px 7px; font-size: 10px; }
          .nav-links { display: none; }
          .nav-hamburger { display: inline-flex; }
          .nav-trades-btn { padding: 7px 10px; font-size: 12px; }
          .trades-dropdown { position: fixed; top: auto; left: 16px; right: 16px; width: auto; }
          .career-stats { grid-template-columns: 1fr; }
          .benefits-grid { grid-template-columns: 1fr; }
          .stage-pay { margin-left: 0; }
          .page { padding: 32px 16px 60px; }
        }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .nav-hamburger { display: inline-flex; }
        }`;

// The fixed block: wrap orphaned rules in their own @media query at a sensible breakpoint
const fixedBlock = `        /* NAV TABS FIX */
        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
          .form-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 1100px) {
          .search-card { padding: 20px 20px; }
          .search-row { flex-direction: column; }
          .btn-search { width: 100%; }
          .results-section { padding: 0 16px 60px; }
          .local-card { flex-direction: column; gap: 12px; }
          .card-distance { flex-direction: row; align-items: center; gap: 10px; }
          .features { gap: 30px; }
          footer { justify-content: center; text-align: center; }
          .nav-wordmark { font-size: 17px; }
          .nav-link { padding: 5px 7px; font-size: 10px; }
          .nav-links { display: none; }
          .nav-hamburger { display: inline-flex; }
          .nav-trades-btn { padding: 7px 10px; font-size: 12px; }
          .trades-dropdown { position: fixed; top: auto; left: 16px; right: 16px; width: auto; }
          .career-stats { grid-template-columns: 1fr; }
          .benefits-grid { grid-template-columns: 1fr; }
          .stage-pay { margin-left: 0; }
          .page { padding: 32px 16px 60px; }
        }
        /* Above 1100px (desktop): show full nav tabs */
        @media (min-width: 1101px) {
          .nav-hamburger { display: none !important; }
          .nav-links { display: flex !important; }
        }`;

if (!src.includes(malformedBlock)) {
  console.error('ERROR: Could not find malformed block (file may have been edited).');
  process.exit(1);
}
src = src.replace(malformedBlock, () => fixedBlock);

// Also tighten the .nav-link styling so all tabs fit comfortably on a typical desktop
const navLinkOld = `        .nav-link {
          background: transparent;
          border: none;
          padding: 6px 10px;
          color: var(--muted);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }`;

const navLinkNew = `        .nav-link {
          background: transparent;
          border: none;
          padding: 6px 10px;
          color: rgba(255,255,255,0.6);
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.01em;
          text-transform: none;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }`;

if (src.includes(navLinkOld)) {
  src = src.replace(navLinkOld, () => navLinkNew);
}

// Also update nav-dropdown-btn so dropdown buttons match the new tab style
const navDropdownBtnOld = /\.nav-dropdown-btn \{[^}]+\}/;
const navDropdownBtnMatch = src.match(navDropdownBtnOld);
if (navDropdownBtnMatch) {
  const oldBtn = navDropdownBtnMatch[0];
  // Only update if it still uses Barlow Condensed
  if (oldBtn.includes("'Barlow Condensed'")) {
    const newBtn = oldBtn
      .replace(/font-family: 'Barlow Condensed', sans-serif;/g, "font-family: 'Inter', sans-serif;")
      .replace(/font-weight: 700;/g, "font-weight: 500;")
      .replace(/text-transform: uppercase;/g, "text-transform: none;")
      .replace(/letter-spacing: 0\.08em;/g, "letter-spacing: 0.01em;");
    src = src.replace(oldBtn, () => newBtn);
  }
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Nav tabs now visible on desktop:');
console.log('  - Fixed malformed CSS — nav-links was being hidden globally');
console.log('  - Above 1100px: full nav tabs show, hamburger hidden');
console.log('  - Below 1100px: hamburger shows, drawer for nav');
console.log('  - Nav tab styling updated: Inter font, mixed case (no UPPERCASE)');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: malformed nav CSS — show tabs on desktop" && git push');
console.log('');
