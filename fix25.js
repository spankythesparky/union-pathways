const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. REPLACE page state with URL-aware version ────────────────────────────
const oldPageState = `  const [page, setPage] = useState("home");`;

const newPageState = `  // URL-aware page state
  const getPageFromUrl = () => {
    const path = window.location.pathname.replace('/', '') || 'home';
    const validPages = ['home','quiz','careers','checklist','veterans','history','contact'];
    return validPages.includes(path) ? path : 'home';
  };
  const [page, setPageState] = useState(getPageFromUrl);
  const setPage = (newPage) => {
    setPageState(newPage);
    const url = newPage === 'home' ? '/' : '/' + newPage;
    window.history.pushState({ page: newPage }, '', url);
    window.scrollTo(0, 0);
  };`;

if (!code.includes(oldPageState)) {
  console.error('ERROR: page state not found');
  process.exit(1);
}
code = code.replace(oldPageState, newPageState);
console.log('✅ URL-aware page state added');

// ─── 2. ADD popstate listener (back/forward browser buttons) ─────────────────
const popstateEffect = `
  // Handle browser back/forward
  useEffect(() => {
    const handlePop = (e) => {
      const p = e.state?.page || getPageFromUrl();
      setPageState(p);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

`;

// Insert before the first useEffect
const useEffectMarker = '  useEffect(() => {\n    document.title';
if (code.includes(useEffectMarker)) {
  code = code.replace(useEffectMarker, popstateEffect + useEffectMarker);
  console.log('✅ popstate listener added');
} else {
  console.warn('WARNING: useEffect marker not found for popstate');
}

// ─── 3. REMOVE window.scrollTo(0,0) from existing setPage calls ─────────────
// since setPage now handles scrolling
code = code.replace(/setPage\("home"\); window\.scrollTo\(0,0\);/g, 'setPage("home");');
code = code.replace(/setPage\("history"\); window\.scrollTo\(0,0\);/g, 'setPage("history");');

// ─── 4. FIX nav logo click (it uses setPage directly) ────────────────────────
code = code.replace(
  'onClick={() => { setPage("home"); setResults(null); setQuery(""); window.scrollTo(0,0); }}',
  'onClick={() => { setPage("home"); setResults(null); setQuery(""); }}'
);
console.log('✅ Nav logo click updated');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add URL routing for all pages" && git push\n');
