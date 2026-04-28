const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const VALID_PAGES = ['home','about','benefits','calculator','careers','checklist','contact','health','history','jobboard','locals','quiz','resume','retirement','veterans'];

// Try multiple possible existing page state declarations
const candidates = [
  'const [page, setPage] = useState("home");',
  'const [page, setPage] = useState("home"); // "home" | "quiz" | "careers"',
  "const [page, setPage] = useState('home');",
];

let matched = null;
for (const c of candidates) {
  if (code.includes(c)) { matched = c; break; }
}

if (!matched) {
  console.error('ERROR: page state declaration not found. Run this and share the output:');
  console.error('   grep -n "const \\[page, setPage\\]" src/App.jsx');
  process.exit(1);
}

const validPagesArr = JSON.stringify(VALID_PAGES);

const replacement = `const [page, setPage] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace(/^\\//, '').replace(/\\/$/, '');
    const validPages = ${validPagesArr};
    return validPages.includes(path) ? path : 'home';
  });
  // ── URL ROUTING — keep URL bar in sync with current page (for shareable links + browser back/forward)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin')) return;
    const targetPath = page === 'home' ? '/' : '/' + page;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [page]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPop = () => {
      if (window.location.pathname.startsWith('/admin')) return;
      const path = window.location.pathname.replace(/^\\//, '').replace(/\\/$/, '');
      const validPages = ${validPagesArr};
      setPage(validPages.includes(path) ? path : 'home');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);`;

if (code.includes('URL ROUTING — keep URL bar in sync')) {
  console.log('URL routing already added, skipping');
} else {
  code = code.replace(matched, replacement);
  console.log('Added URL routing — page state now syncs with URL');
}

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add URL routing for shareable page links" && git push\n');
