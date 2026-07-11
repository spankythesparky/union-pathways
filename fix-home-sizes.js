// fix-home-sizes.js — Make home page typography normal-sized
// Targets the original massive sizes still in the deployed file.
// One jump from "billboard" to "modern site"

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

const edits = [
  // Hero title — 54-132 → 34-60
  { name: 'Hero headline', 
    old: `fontSize:'clamp(54px, 10vw, 132px)'`,
    new: `fontSize:'clamp(34px, 5vw, 60px)'` },
  // Hero sub — 17-21 → 14-16
  { name: 'Hero subtitle',
    old: `fontSize:'clamp(17px, 2vw, 21px)'`,
    new: `fontSize:'clamp(14px, 1.3vw, 16px)'` },
  // Stats numbers — 64-112 → 36-56
  { name: 'Stat numbers',
    old: `fontSize:'clamp(64px, 9vw, 112px)'`,
    new: `fontSize:'clamp(36px, 4.5vw, 56px)'` },
  // Mission headline — 36-64 → 24-36
  { name: 'Mission headline',
    old: `fontSize:'clamp(36px, 5.5vw, 64px)'`,
    new: `fontSize:'clamp(24px, 3vw, 36px)'` },
  // Results headline — 32-56 → 22-32
  { name: 'Results headline',
    old: `fontSize:'clamp(32px, 5vw, 56px)', fontWeight:500, color:'#fff', margin:0, lineHeight:1, letterSpacing:'-0.025em'`,
    new: `fontSize:'clamp(22px, 2.8vw, 32px)', fontWeight:500, color:'#fff', margin:0, lineHeight:1.05, letterSpacing:'-0.02em'` },
  // Distance numbers — 40-64 → 28-40
  { name: 'Distance numbers',
    old: `fontSize:'clamp(40px, 5vw, 64px)'`,
    new: `fontSize:'clamp(28px, 3vw, 40px)'` },
  // Search input — 22 → 18
  { name: 'Search input',
    old: `color:'#fff',
                fontSize:22,
                fontFamily:"'Space Grotesk',sans-serif",`,
    new: `color:'#fff',
                fontSize:18,
                fontFamily:"'Space Grotesk',sans-serif",` },
  // Mission body — 18 → 15
  { name: 'Mission body',
    old: `<p style={{fontFamily:"'Inter',sans-serif", fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.75, maxWidth:640, margin:0}}>`,
    new: `<p style={{fontFamily:"'Inter',sans-serif", fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.7, maxWidth:640, margin:0}}>` },
  // Hero top padding 80px → 56px
  { name: 'Hero padding',
    old: `<section style={{padding:'80px 24px 60px', maxWidth:1280, margin:'0 auto'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:14, fontFamily:"'Space Mono',monospace", fontSize:12, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:40}}>`,
    new: `<section style={{padding:'56px 24px 40px', maxWidth:1280, margin:'0 auto'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:14, fontFamily:"'Space Mono',monospace", fontSize:12, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:28}}>` },
];

let applied = 0;
const missed = [];
for (const edit of edits) {
  if (src.includes(edit.old)) {
    src = src.replace(edit.old, () => edit.new);
    applied++;
  } else {
    missed.push(edit.name);
  }
}

if (applied === 0) {
  console.error('ERROR: No edits applied. Already tuned? Aborting.');
  process.exit(1);
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + applied + '/' + edits.length + ' typography fixes.');
if (missed.length > 0) {
  console.log('Already-correct (skipped): ' + missed.join(', '));
}
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "tune: normal-sized home page typography" && git push');
console.log('');
