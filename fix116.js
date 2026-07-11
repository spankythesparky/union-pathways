// fix116.js — Stop doubling https:// on website URLs that already include the protocol
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// FIX 1: locator card — line 6376 area
// Old: href={`https://${local.website}`}
// New: only prepend https:// if it's not already there
code = replaceOnce(code,
  '<a className="btn-website" href={`https://${local.website}`} target="_blank" rel="noopener noreferrer">',
  '<a className="btn-website" href={local.website.startsWith("http") ? local.website : `https://${local.website}`} target="_blank" rel="noopener noreferrer">',
  '1: locator card website link');
console.log('1/3 ✓ Fixed locator card website link');

// FIX 2: quiz result page — line 6151 area
// Old: href={`https://www.${res.website}`}
// This one is for trade-level national websites where the value is just the bare domain.
// Adding `www.` is intentional — keep it but only if it's not already a full URL.
code = replaceOnce(code,
  '<a className="btn-ghost" href={`https://www.${res.website}`} target="_blank" rel="noopener noreferrer">',
  '<a className="btn-ghost" href={res.website.startsWith("http") ? res.website : `https://www.${res.website}`} target="_blank" rel="noopener noreferrer">',
  '2: quiz result national website link');
console.log('2/3 ✓ Fixed quiz result national website link');

// FIX 3: search results panel — line 9409 area
code = replaceOnce(code,
  '{l.website && <a href={"https://"+l.website} target="_blank" rel="noopener noreferrer" style={{fontSize:12, color:"#FA8059", textDecoration:"none"}}>{l.website}</a>}',
  '{l.website && <a href={l.website.startsWith("http") ? l.website : "https://"+l.website} target="_blank" rel="noopener noreferrer" style={{fontSize:12, color:"#FA8059", textDecoration:"none"}}>{l.website}</a>}',
  '3: search results panel website link');
console.log('3/3 ✓ Fixed search results panel website link');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: stop doubling https:// on website links" && git push\n');
