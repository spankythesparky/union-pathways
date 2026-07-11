// fix131.js
// Install the Tawk.to live chat widget.
//
// Adds a useEffect to App.jsx that loads Tawk's embed script once on mount.
// The widget then handles itself — it appears as a floating bubble in the
// bottom-right of every page and persists across navigation.
//
// The guard `if (window.Tawk_API)` prevents double-loading during dev hot
// reloads.

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

const anchor =
`  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
        setGlobalQuery("");
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
`;

const replacement =
`  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
        setGlobalQuery("");
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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

if (code.includes('embed.tawk.to')) {
  console.log('Skipping — Tawk.to script already installed.');
} else if (code.includes(anchor)) {
  code = code.replace(anchor, replacement);
  console.log('✓ Added Tawk.to live chat widget loader');
} else {
  console.error('ERROR: Cmd+K useEffect anchor not found. App.jsx may have changed.');
  process.exit(1);
}

fs.writeFileSync(path, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Tawk.to live chat widget" && git push');
console.log('');
