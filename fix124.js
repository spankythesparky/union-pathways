// fix124.js
// Fix the white-screen-on-navigation bug.
//
// ROOT CAUSE: The pages "history", "history-ibew", "history-ua", and "benefits"
// each define a custom React hook called useScrollProgress() *inside* an IIFE
// that's conditionally rendered. That means the hook runs on those pages but
// not on others. React requires the same hooks to run in the same order on
// every render of a component. Navigating between a page that calls the hook
// and a page that doesn't trips React's invariant check, and the broken render
// blanks out the page area until you refresh.
//
// FIX: Lift a single scrollProgress hook up to App-level so it always runs.
// It auto-detects which long-form page is mounted by checking for known
// element IDs. Then remove the four inline useScrollProgress definitions
// and the four calls to it from the IIFEs. The variable `scrollProgress` is
// now provided by App's closure scope, so the JSX inside each IIFE keeps
// working unchanged.

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

// ── 1. INSERT APP-LEVEL scrollProgress HOOK ─────────────────────────────────
const insertAnchor =
`  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
`;

const newAppLevelHook =
`  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // App-level scroll progress for long-form pages (history, history-ibew,
  // history-ua, benefits). Always mounted so React's hook order stays stable
  // across page navigations.
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const candidates = ['history-root','ibew-history-root','ua-history-root','benefits-root'];
      let el = null;
      for (const id of candidates) {
        const found = document.getElementById(id);
        if (found) { el = found; break; }
      }
      if (!el) { setScrollProgress(0); return; }
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));
      setScrollProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);
`;

if (!code.includes(insertAnchor)) {
  console.error('ERROR: insertion anchor not found. App.jsx may have changed since fix124 was written.');
  process.exit(1);
}
if (code.includes('App-level scroll progress for long-form pages')) {
  console.log('Skipping insertion — App-level scrollProgress hook already present.');
} else {
  code = code.replace(insertAnchor, newAppLevelHook);
  console.log('✓ Inserted App-level scrollProgress hook');
}

// ── 2. REMOVE THE FOUR INLINE useScrollProgress DEFINITIONS ─────────────────
// They differ only in the element ID. Build the four exact strings and remove each.
const elementIds = ['history-root','ibew-history-root','ua-history-root','benefits-root'];

let removedDefs = 0;
for (const id of elementIds) {
  const inlineDef =
`          const useScrollProgress = () => {
            const [progress, setProgress] = useState(0);
            useEffect(() => {
              const onScroll = () => {
                const el = document.getElementById('${id}');
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const total = rect.height - window.innerHeight;
                const scrolled = -rect.top;
                const p = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));
                setProgress(p);
              };
              window.addEventListener('scroll', onScroll, { passive: true });
              onScroll();
              return () => window.removeEventListener('scroll', onScroll);
            }, []);
            return progress;
          };

`;
  if (code.includes(inlineDef)) {
    code = code.replace(inlineDef, '');
    removedDefs++;
    console.log(`✓ Removed inline useScrollProgress for '${id}'`);
  } else {
    console.log(`(Skipping '${id}' — inline definition not found, may already be removed)`);
  }
}

// ── 3. REMOVE THE FOUR `const scrollProgress = useScrollProgress();` CALLS ──
const callPattern = '          const scrollProgress = useScrollProgress();\n';
let removedCalls = 0;
while (code.includes(callPattern)) {
  code = code.replace(callPattern, '');
  removedCalls++;
}
console.log(`✓ Removed ${removedCalls} useScrollProgress() call(s) from IIFEs`);

// ── WRITE ───────────────────────────────────────────────────────────────────
fs.writeFileSync(path, code);

console.log('');
console.log(`Summary: removed ${removedDefs} inline definitions, removed ${removedCalls} calls.`);
console.log('');
console.log('Done. Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: lift scrollProgress hook to App level to fix white-screen on tab switch" && git push');
console.log('');
