// fix104.js — Make FadeIn always-visible (no scroll blackout on mobile) + remove "Amazon warehouses" from hero
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

// 1. Make FadeIn render content visible immediately (no scroll-triggered animation)
// Old version starts at opacity:0 and only becomes visible when an IntersectionObserver fires;
// on mobile this can leave content black for a beat or stay hidden if the observer misfires.
// New version simply renders children unwrapped — content is always visible.
code = replaceOnce(code,
  `          const FadeIn = ({ children, delay = 0 }) => {
            const [visible, setVisible] = useState(false);
            const ref = useRef(null);
            useEffect(() => {
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting) setTimeout(() => setVisible(true), delay);
                });
              }, { threshold: 0.15 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [delay]);
            return <div ref={ref} style={{opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease'}}>{children}</div>;
          };`,
  `          const FadeIn = ({ children }) => <div>{children}</div>;`,
  '1: simplify FadeIn');
console.log('1/2 ✓ Removed scroll-triggered fade — all sections now always visible');

// 2. Remove "Amazon warehouses" mention from hero subtitle
code = replaceOnce(code,
  `From medieval guilds to Amazon warehouses, the story of organized labor`,
  `From medieval guilds to modern picket lines, the story of organized labor`,
  '2: hero subtitle');
console.log('2/2 ✓ Removed Amazon warehouses mention from hero');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: remove scroll fade on mobile + revise hero subtitle" && git push\n');
