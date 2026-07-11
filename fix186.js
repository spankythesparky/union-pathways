// fix186.js
// Swap the "Meet the Founder" image on the About page from
// /partner-noah.png to the new Spanky the Sparky logo.
// Idempotent: re-running is safe.

const fs = require('fs');
const PATH = 'src/App.jsx';

if (!fs.existsSync(PATH)) {
  console.error(`✗ ${PATH} not found. Run this from ~/Desktop/union-pathway.`);
  process.exit(1);
}

let code = fs.readFileSync(PATH, 'utf8');

// ---------- idempotency guard ----------
const NEW_MARKER = 'src="/spanky-the-sparky.png"';
if (code.includes(NEW_MARKER)) {
  console.log('✓ fix186 already applied — nothing to do.');
  process.exit(0);
}

// ---------- exact target block ----------
const OLD = `                      <img
                        src="/partner-noah.png"
                        alt="Noah Alassaf"
                        style={{
                          position:'relative',
                          width:'100%',
                          height:'100%',
                          objectFit:'cover',
                          borderRadius:20,
                          border:'1px solid rgba(250,128,89,0.35)',
                          background:'#000',
                          zIndex:1,
                        }}
                      />`;

const NEW = `                      <img
                        src="/spanky-the-sparky.png"
                        alt="Spanky the Sparky"
                        style={{
                          position:'relative',
                          width:'100%',
                          height:'100%',
                          objectFit:'contain',
                          borderRadius:20,
                          border:'1px solid rgba(250,128,89,0.35)',
                          background:'#000',
                          padding:18,
                          zIndex:1,
                        }}
                      />`;

if (!code.includes(OLD)) {
  console.error('✗ Could not find the target <img> block on the About page.');
  console.error('  Expected: src="/partner-noah.png" alt="Noah Alassaf" (cover/borderRadius:20).');
  console.error('  Live file may have drifted — share the current block and I will rewrite.');
  process.exit(1);
}

code = code.replace(OLD, NEW);
fs.writeFileSync(PATH, code);

console.log('✓ Swapped /partner-noah.png → /spanky-the-sparky.png');
console.log('✓ Alt text → "Spanky the Sparky"');
console.log('✓ objectFit cover → contain + 18px padding (so the full logo shows, no cropping)');
console.log('');
console.log('Next:');
console.log('  1. Make sure public/spanky-the-sparky.png is in place');
console.log('  2. git add src/App.jsx public/spanky-the-sparky.png');
console.log('  3. git commit -m "feat(about): swap founder portrait for Spanky the Sparky logo" && git push');
