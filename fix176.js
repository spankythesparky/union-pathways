// fix176.js — Fix shared-link routing and per-page metadata
//
// What this fixes:
//   1. The URL-validation whitelist (`validPages` inside `getPageFromUrl`)
//      is missing `weingarten`. When someone visits unionpathways.com/weingarten
//      directly (e.g., via a shared link), the validation falls through to
//      'home' and they bounce to the homepage instead of seeing the page.
//
//   2. The `PAGE_META` lookup table is missing entries for 5 pages:
//      - weingarten   (new — added in fix172)
//      - retirement   (older page)
//      - benefits     (older page)
//      - calculator   (older page)
//      - resume       (older page)
//      For these, the browser title and meta description fall back to the
//      home page defaults.
//
// What this does NOT fix:
//   Social-media link previews (Twitter, iMessage, Slack, Facebook, etc.)
//   These crawlers do not execute JavaScript, so the React-driven meta
//   updates never reach them. To fix that, we need to add Vercel Edge
//   Middleware that injects per-page meta tags into the static HTML
//   before serving — that requires changes outside src/App.jsx.
//
// Idempotency: detects 'weingarten' in the validPages list and exits.
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

// ----------------------------------------------------------------------------
// Idempotency
// ----------------------------------------------------------------------------
if (src.includes("'apprenticeship-ubc','weingarten'") || src.includes("','weingarten',")) {
  console.log('Already applied — validPages already contains weingarten.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 — Add 'weingarten' to validPages
// ============================================================================
// The list ends with ...'apprenticeship-ubc']
const oldList = `'apprenticeship-iuoe','apprenticeship-ubc']`;
const newList = `'apprenticeship-iuoe','apprenticeship-ubc','weingarten']`;
if (!src.includes(oldList)) {
  console.error('ERROR: could not find validPages list end anchor');
  process.exit(1);
}
src = src.replace(oldList, newList);

// ============================================================================
// EDIT 2 — Add missing PAGE_META entries
// ============================================================================
// Insert these new entries right before the closing `};` of PAGE_META.
// Anchor on the last entry (apprenticeship-ubc) which we know exists.
const newMetaEntries = `      weingarten: { title: "Weingarten Rights — Your Right to a Union Rep · Union Pathways", desc: "If your boss is questioning you about something that could lead to discipline, you have the right to a union representative present. The full breakdown — what triggers it, what counts as an investigatory interview, the wallet card script, what your rep can and can't do, and the four-decade flip-flop on whether non-union workers have the same right." },
      benefits: { title: "Union Benefits Overview — Pension, Health, Annuity & More · Union Pathways", desc: "What union members actually get — multiemployer pension, health and welfare, defined-contribution annuity, training trust, supplemental coverage. The full benefits package broken down so apprentices and journeymen can see what their hours are buying." },
      retirement: { title: "Union Retirement — 401k vs Annuity vs Pension · Union Pathways", desc: "How union retirement actually works. The difference between a 401(k), a multiemployer pension, and a defined-contribution annuity. What vesting means, why portability matters, and how three benefit streams stack into one paycheck after you hang it up." },
      calculator: { title: "Union Wage Calculator — Total Package Value · Union Pathways", desc: "Calculate your full union wage package — base hourly, fringes, health, pension, annuity, vacation, training. See your true hourly value and annual earnings, then compare against non-union work or other locals." },
      resume: { title: "Union Apprenticeship Resume Template — Free Download · Union Pathways", desc: "A clean, focused resume template built for union apprenticeship applications. Highlights the things JATC committees actually score on — work history, mechanical experience, references, math credit. Free download, no signup." },
    };`;

const metaCloseAnchor = `      'apprenticeship-ubc': { title: "UBC Carpenters Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the UBC Carpenters apprenticeship test, with detail on all 11 trade specialties — General Carpenter, Concrete Form Builder, Floor Coverer, Mill Cabinet, Millwright (the most technical), Pile Driver, Lathing, Drywall Finisher, Insulation Applicator, Bridge/Dock/Wharf Carpenter, Maintenance Carpenter." },
    };`;

if (!src.includes(metaCloseAnchor)) {
  console.error('ERROR: could not find PAGE_META closing anchor');
  process.exit(1);
}

const newMetaBlock = `      'apprenticeship-ubc': { title: "UBC Carpenters Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the UBC Carpenters apprenticeship test, with detail on all 11 trade specialties — General Carpenter, Concrete Form Builder, Floor Coverer, Mill Cabinet, Millwright (the most technical), Pile Driver, Lathing, Drywall Finisher, Insulation Applicator, Bridge/Dock/Wharf Carpenter, Maintenance Carpenter." },
${newMetaEntries}`;

src = src.replace(metaCloseAnchor, newMetaBlock);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Fixed:');
console.log("  - Added 'weingarten' to validPages whitelist");
console.log("  - Added PAGE_META entries for: weingarten, benefits, retirement, calculator, resume");
console.log('');
console.log("Note: This fixes browser-side routing and titles, but social-media link");
console.log("previews (Twitter, iMessage, etc.) still won't show per-page cards. That");
console.log("requires Vercel Edge Middleware — see the chat for next steps.");
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: add weingarten to validPages + missing PAGE_META entries" && git push');
console.log('');
