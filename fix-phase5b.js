// fix-phase5b.js — Catch the per-trade StatBlock colors missed in Phase 5
//
// Each history page's StatBlock had a different hardcoded color:
//   IBEW: #F5C518 (already caught)
//   UA: #3B9EFF, SMART: #B0BEC5, BAC: #C04A36, UFCW: #10A37F,
//   IRON: #D85F2E, INSUL: #A8623A, IUEC: #4A7B9D, IUPAT: #ec4899, etc.
//
// Convert all StatBlock value colors to the coral→white gradient regardless of trade.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

let editCount = 0;

// Pattern: StatBlock value div with any hardcoded hex color
// Old: <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#XXXXXX', lineHeight:1}}>
// New: gradient version

const statRegex = /<div style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#[A-Fa-f0-9]{6}', lineHeight:1\}\}>/g;

const matches = src.match(statRegex) || [];
editCount += matches.length;

const replacement = `<div style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(36px, 5vw, 56px)', fontWeight:500, background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1, letterSpacing:'-0.03em'}}>`;

src = src.replace(statRegex, () => replacement);

if (editCount === 0) {
  console.log('No remaining StatBlock colors to fix.');
  process.exit(0);
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Updated ' + editCount + ' remaining StatBlock value colors → coral gradient.');
console.log('All trade history pages now have unified gradient stat numbers.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: unify all trade page stat numbers to coral gradient" && git push');
console.log('');
