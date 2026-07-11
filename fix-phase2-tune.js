// fix-phase2-tune.js — Tune down the typography sizes
//
// The hero headline at clamp(54px, 10vw, 132px) was too aggressive.
// Bringing the scale down to feel impactful but not screen-dominating.
//
// Changes:
//   - Hero: 54-132px → 44-88px
//   - Sub: 17-21px → 15-18px (slightly tighter)
//   - Stats: 64-112px → 48-80px
//   - Mission: 36-64px → 32-48px
//   - Results headline: 32-56px → 28-44px

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

const edits = [
  // Hero title size
  { old: `fontSize:'clamp(54px, 10vw, 132px)'`,
    new: `fontSize:'clamp(44px, 7vw, 88px)'` },
  // Hero sub size
  { old: `fontSize:'clamp(17px, 2vw, 21px)'`,
    new: `fontSize:'clamp(15px, 1.6vw, 18px)'` },
  // Stats numbers
  { old: `fontSize:'clamp(64px, 9vw, 112px)',
                    fontWeight:500,
                    background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)',
                    WebkitBackgroundClip:'text', backgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    lineHeight:0.92, letterSpacing:'-0.045em', marginBottom:18`,
    new: `fontSize:'clamp(48px, 6.5vw, 80px)',
                    fontWeight:500,
                    background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)',
                    WebkitBackgroundClip:'text', backgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    lineHeight:0.95, letterSpacing:'-0.04em', marginBottom:14` },
  // Mission headline
  { old: `fontSize:'clamp(36px, 5.5vw, 64px)',
              fontWeight:500,
              color:'#fff',
              lineHeight:1.04,`,
    new: `fontSize:'clamp(32px, 4.5vw, 48px)',
              fontWeight:500,
              color:'#fff',
              lineHeight:1.1,` },
  // Results "[12] locals near you" headline
  { old: `fontSize:'clamp(32px, 5vw, 56px)', fontWeight:500, color:'#fff', margin:0, lineHeight:1, letterSpacing:'-0.025em'`,
    new: `fontSize:'clamp(28px, 4vw, 44px)', fontWeight:500, color:'#fff', margin:0, lineHeight:1.05, letterSpacing:'-0.02em'` },
  // Distance number per local in results
  { old: `fontSize:'clamp(40px, 5vw, 64px)',
                        fontWeight:500,
                        background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)',
                        WebkitBackgroundClip:'text', backgroundClip:'text',
                        WebkitTextFillColor:'transparent',
                        lineHeight:1, letterSpacing:'-0.04em'`,
    new: `fontSize:'clamp(36px, 4vw, 52px)',
                        fontWeight:500,
                        background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)',
                        WebkitBackgroundClip:'text', backgroundClip:'text',
                        WebkitTextFillColor:'transparent',
                        lineHeight:1, letterSpacing:'-0.035em'` },
  // Hero section top padding — was 80px, dropping to 60px so the title isn't pushed quite so far down
  { old: `<section style={{padding:'80px 24px 60px', maxWidth:1280, margin:'0 auto'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:14, fontFamily:"'Space Mono',monospace", fontSize:12, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:40}}>`,
    new: `<section style={{padding:'56px 24px 40px', maxWidth:1280, margin:'0 auto'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:14, fontFamily:"'Space Mono',monospace", fontSize:12, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:28}}>` },
  // Hero margin-bottom on the title — was 40px, going to 28
  { old: `letterSpacing:'-0.035em',
            margin:'0 0 40px 0',
            maxWidth:1000`,
    new: `letterSpacing:'-0.03em',
            margin:'0 0 28px 0',
            maxWidth:900` },
];

let applied = 0;
for (const edit of edits) {
  if (src.includes(edit.old)) {
    src = src.replace(edit.old, () => edit.new);
    applied++;
  } else {
    console.error('WARN: Could not find edit anchor #' + (applied + 1));
  }
}

if (applied === 0) {
  console.error('ERROR: No edits applied.');
  process.exit(1);
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Tuned ' + applied + ' typography sizes:');
console.log('  - Hero: max 88px (was 132px)');
console.log('  - Stats: max 80px (was 112px)');
console.log('  - Mission: max 48px (was 64px)');
console.log('  - Results headline: max 44px (was 56px)');
console.log('  - Distance numbers: max 52px (was 64px)');
console.log('  - Hero top padding reduced');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "tune: dial back oversized hero typography" && git push');
console.log('');
