// fix142.js
// Fix the "numbers reset to 0 on scroll" bug on the Iron Workers page.
//
// ROOT CAUSE: The page is wrapped in an IIFE that re-runs on every parent
// render (and every scroll updates scrollProgress, which causes a parent
// re-render). Because AnimatedNumber and useReveal are defined INSIDE the
// IIFE, React sees them as brand-new component types on every parent render
// and unmounts/remounts every instance — wiping their state back to initial
// values. So the count animates up, you scroll, and they reset to 0.
//
// FIX: Use a window-scoped cache to remember "has this stat already animated"
// and "has this card already been revealed." On any remount, the component
// initializes its state from the cache, skipping the animation entirely if
// it already finished. The first animation still plays normally; subsequent
// remounts are silent and stable.

const fs = require('fs');
const appPath = 'src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

let changes = 0;

// ── 1. REPLACE AnimatedNumber INSIDE THE IRON WORKERS IIFE ──────────────────
const oldAnimated =
`        {page === "history-iron" && (() => {
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
              }, { threshold: 0.3 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };`;

const newAnimated =
`        {page === "history-iron" && (() => {
          // window-level cache so values persist across IIFE re-renders
          if (typeof window !== 'undefined' && !window.__ironStatCache) window.__ironStatCache = {};
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const cacheKey = 'iron:' + prefix + ':' + value + ':' + suffix + ':' + decimals;
            const cached = typeof window !== 'undefined' && window.__ironStatCache && window.__ironStatCache[cacheKey];
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
                        if (typeof window !== 'undefined' && window.__ironStatCache) window.__ironStatCache[cacheKey] = true;
                      }
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: 0.3 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };`;

if (code.includes('window.__ironStatCache')) {
  console.log('Skipping AnimatedNumber update — already cached.');
} else if (code.includes(oldAnimated)) {
  code = code.replace(oldAnimated, newAnimated);
  console.log('✓ AnimatedNumber now uses window cache (numbers stay put after first animation)');
  changes++;
} else {
  console.error('ERROR: Iron Workers AnimatedNumber not found in expected form.');
  process.exit(1);
}

// ── 2. REPLACE useReveal INSIDE THE IRON WORKERS IIFE ───────────────────────
// Same root cause for the card slide-in animations. Once a card has been
// revealed, mark it in a window-level cache. On subsequent remounts,
// initialize as already revealed (no flicker).

const oldReveal =
`          // Scroll-reveal: cards slide up + fade in when entering viewport
          const useReveal = () => {
            const ref = useRef(null);
            const [revealed, setRevealed] = useState(false);
            useEffect(() => {
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting) {
                    setRevealed(true);
                    obs.disconnect();
                  }
                });
              }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
              obs.observe(el);
              return () => obs.disconnect();
            }, []);
            return [ref, revealed];
          };`;

const newReveal =
`          // Scroll-reveal: cards slide up + fade in when entering viewport.
          // Each call gets a sequential id so we can remember which ones have
          // already revealed (across IIFE re-renders) and skip the fade-in
          // if they have. Counter resets on each IIFE run, but the cache is
          // window-scoped so the lookup matches across renders.
          if (typeof window !== 'undefined' && !window.__ironRevealCache) window.__ironRevealCache = {};
          let __ironRevealCounter = 0;
          const useReveal = () => {
            const idRef = useRef(null);
            if (idRef.current === null) idRef.current = ++__ironRevealCounter;
            const cacheKey = 'iron-reveal:' + idRef.current;
            const cached = typeof window !== 'undefined' && window.__ironRevealCache && window.__ironRevealCache[cacheKey];
            const ref = useRef(null);
            const [revealed, setRevealed] = useState(!!cached);
            useEffect(() => {
              if (revealed) return;
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting) {
                    setRevealed(true);
                    if (typeof window !== 'undefined' && window.__ironRevealCache) window.__ironRevealCache[cacheKey] = true;
                    obs.disconnect();
                  }
                });
              }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
              obs.observe(el);
              return () => obs.disconnect();
            }, [revealed]);
            return [ref, revealed];
          };`;

if (code.includes('window.__ironRevealCache')) {
  console.log('Skipping useReveal update — already cached.');
} else if (code.includes(oldReveal)) {
  code = code.replace(oldReveal, newReveal);
  console.log('✓ useReveal now uses window cache (no flicker on scroll re-renders)');
  changes++;
} else {
  console.error('ERROR: Iron Workers useReveal not found in expected form.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: persist Iron Workers stat counters and card reveals across scroll re-renders" && git push');
console.log('');
