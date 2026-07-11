// fix-phase5c.js — Trade history page hero h1 + accent spans
//
// All trade history pages still have their h1 in Barlow Condensed
// with hardcoded trade-specific accent colors. SMART's silver looked white.
//
// Update:
//   1. h1 style → Space Grotesk, lighter weight, smaller size, matching home page
//   2. Accent <span style={{color:'#XXXXXX'}}> → coral italic

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

let editCount = 0;

// 1. Update all trade page h1 styles
const h1Old = `<h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>`;
const h1New = `<h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(34px, 5vw, 60px)', fontWeight:500, color:'#fff', lineHeight:0.96, margin:'0 0 24px 0', letterSpacing:'-0.03em'}}>`;

while (src.includes(h1Old)) {
  src = src.replace(h1Old, () => h1New);
  editCount++;
}

// 2. Find all accent spans within those h1s — they have hardcoded trade colors
// Pattern: <span style={{color:'#XXXXXX'}}> with various 6-char hex codes
// We need to do this within the history pages section to avoid affecting other accent spans
// across the site.

// Find the section containing trade history pages
const historyStart = src.indexOf('{page === "history" && (() => {');
const apprenticeStart = src.indexOf('{page === "apprenticeship" && (() => {');

if (historyStart !== -1 && apprenticeStart !== -1 && apprenticeStart > historyStart) {
  let section = src.slice(historyStart, apprenticeStart);
  const before = section;

  // Replace `<span style={{color:'#XXXXXX'}}>` with coral italic
  // BUT we want to preserve some other meaningful color uses
  // The accent spans in h1s typically use the trade color directly
  // We'll be conservative: only replace those in line with bold trade names ending in '.'
  // Actually safer: match the exact pattern that's specifically the title accent span
  // Pattern: <span style={{color:'#XXXXXX'}}>WORD WORDS.</span> followed by <br/> or closing h1

  // Easier safe approach: replace each known trade-page accent color hex code in that h1 context
  // The hardcoded trade colors used in accent spans:
  const tradeColors = [
    '#F5C518',  // IBEW yellow
    '#3B9EFF',  // UA blue
    '#B0BEC5',  // SMART silver (the problem one)
    '#C04A36',  // BAC red-orange
    '#10A37F',  // UFCW green
    '#D85F2E',  // IRON orange-red
    '#A8623A',  // INSUL brown-orange
    '#4A7B9D',  // IUEC steel-blue
    '#ec4899',  // IUPAT pink
  ];

  for (const color of tradeColors) {
    // Match span with this specific color and replace with coral italic
    // Use a regex that's safe: span with this exact color style
    const re = new RegExp('<span style=\\{\\{color:\'' + color.replace(/[#]/g, '\\#') + '\'\\}\\}>', 'g');
    const matches = section.match(re) || [];
    section = section.replace(re, () => `<span style={{color:'#FA8059', fontStyle:'italic', fontWeight:600}}>`);
    editCount += matches.length;
  }

  if (section !== before) {
    src = src.slice(0, historyStart) + section + src.slice(apprenticeStart);
  }
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Phase 5c applied: ' + editCount + ' edits.');
console.log('  - All trade history page h1s now use Space Grotesk');
console.log('  - Hero accent spans now coral italic instead of trade-specific color');
console.log('  - SMART silver no longer looks white');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: trade history hero h1 + coral italic accents" && git push');
console.log('');
