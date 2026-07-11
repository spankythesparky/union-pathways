// fix132.js
// Remove the Tawk.to live chat widget that fix131 added.
//
// Strips out the useEffect that loaded the embed script. Tawk's account and
// dashboard remain intact on tawk.to — this just disconnects the widget from
// the live site. Re-adding later is a one-line change.

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

const tawkBlock =
`
  // Tawk.to live chat widget — loads once on first mount.
  useEffect(() => {
    if (window.Tawk_API) return;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69f2cd80db9e841c36b06cd4/1jne75fof';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
  }, []);
`;

if (!code.includes(tawkBlock)) {
  if (code.includes('embed.tawk.to')) {
    console.error('ERROR: a Tawk.to script reference remains but the expected block was not found. Manual cleanup may be needed.');
    process.exit(1);
  }
  console.log('Skipping — Tawk.to widget already removed.');
} else {
  code = code.replace(tawkBlock, '');
  console.log('✓ Removed Tawk.to live chat widget loader');
}

fs.writeFileSync(path, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "chore: remove Tawk.to live chat widget" && git push');
console.log('');
