// fix143.js
// Apply the same "numbers stay put" fix from fix142 to the other five
// history pages: IBEW, UA, SMART, BAC, and UFCW.
//
// Same root cause as the Iron Workers page: AnimatedNumber is defined inside
// the page's IIFE, the IIFE re-runs on every parent render (which happens on
// every scroll because the App-level scrollProgress hook updates state), and
// React unmounts/remounts the component each time — wiping its state to 0.
//
// Same fix as fix142: a window-scoped cache. Once a stat has finished
// animating, it's marked in the cache. On subsequent remounts, the cache
// hit is detected and the component initializes its state at the final
// value, skipping the animation entirely.
//
// Each page uses its own cache namespace so stats from one page don't
// collide with another.

const fs = require('fs');
const appPath = 'src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// Each entry: which page IIFE to patch, what cache namespace to use, and
// what threshold the existing IntersectionObserver uses (this varies between
// pages — IBEW and UA use 0.5, the rest use 0.3).
const pages = [
  { id: 'ibew',  threshold: '0.5' },
  { id: 'ua',    threshold: '0.5' },
  { id: 'smart', threshold: '0.3' },
  { id: 'bac',   threshold: '0.3' },
  { id: 'ufcw',  threshold: '0.3' },
];

let totalChanges = 0;

for (const { id, threshold } of pages) {
  const cacheVar = '__' + id + 'StatCache';

  const oldBlock =
`        {page === "history-${id}" && (() => {
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const [shown, setShown] = useState(0);
            const ref = useRef(null);
            const animated = useRef(false);
            useEffect(() => {
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting && !animated.current) {
                    animated.current = true;
                    const start = performance.now();
                    const dur = 1400;
                    const step = (now) => {
                      const t = Math.min(1, (now - start) / dur);
                      const eased = 1 - Math.pow(1 - t, 3);
                      setShown(value * eased);
                      if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: ${threshold} });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };`;

  const newBlock =
`        {page === "history-${id}" && (() => {
          // window-level cache so values persist across IIFE re-renders
          if (typeof window !== 'undefined' && !window.${cacheVar}) window.${cacheVar} = {};
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const cacheKey = '${id}:' + prefix + ':' + value + ':' + suffix + ':' + decimals;
            const cached = typeof window !== 'undefined' && window.${cacheVar} && window.${cacheVar}[cacheKey];
            const [shown, setShown] = useState(cached ? value : 0);
            const ref = useRef(null);
            const animated = useRef(!!cached);
            useEffect(() => {
              if (animated.current) return;
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting && !animated.current) {
                    animated.current = true;
                    const start = performance.now();
                    const dur = 1400;
                    const step = (now) => {
                      const t = Math.min(1, (now - start) / dur);
                      const eased = 1 - Math.pow(1 - t, 3);
                      setShown(value * eased);
                      if (t < 1) {
                        requestAnimationFrame(step);
                      } else {
                        if (typeof window !== 'undefined' && window.${cacheVar}) window.${cacheVar}[cacheKey] = true;
                      }
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: ${threshold} });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };`;

  if (code.includes('window.' + cacheVar)) {
    console.log(`Skipping ${id.toUpperCase()} — already cached.`);
  } else if (code.includes(oldBlock)) {
    code = code.replace(oldBlock, newBlock);
    console.log(`✓ ${id.toUpperCase()} AnimatedNumber now uses window cache (numbers stay put after first animation)`);
    totalChanges++;
  } else {
    console.error(`ERROR: ${id.toUpperCase()} AnimatedNumber not found in expected form. Skipping.`);
  }
}

if (totalChanges === 0) {
  console.log('');
  console.log('No changes applied. Either nothing matched, or all pages were already fixed.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

console.log('');
console.log(`Done. ${totalChanges} of ${pages.length} pages patched.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: persist stat counters across scroll re-renders on IBEW, UA, SMART, BAC, and UFCW pages" && git push');
console.log('');
