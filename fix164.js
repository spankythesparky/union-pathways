// fix164.js — Make Era sections collapsible on all 8 trade history pages
//
// Each history page defines its own local `Era` component. This fix wraps the
// existing Era body with a collapsed-by-default state — header always visible,
// intro + children only show when expanded.
//
// What stays open by default on each page:
//   - Hero (page-level, not Era — already always open)
//   - Conclusion (page-level, not Era — already always open)
// What collapses by default:
//   - Every Era component (Part I through Part X, etc.)

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency: look for our marker comment
if (src.includes('// COLLAPSIBLE ERA — fix164')) {
  console.error('ERROR: Era sections already collapsible. Aborting.');
  process.exit(1);
}

// Each Era definition starts with `const Era = ({ tag, title, years, intro, color = '...'`
// and continues either as `=> (` (implicit return) or `=> {` (function body).
//
// We scan for every `const Era = (...) => (` pattern and replace its body.
// For Iron Workers (the one with `=> {` function body and useReveal), we patch differently.

// ============================================================
// PASS 1: Standard Era components (=> (...)
// ============================================================
// These all share the same body structure. We use a regex to find each one
// and replace.

const standardEraPattern = /const Era = \(\{ tag, title, years, intro, color = '(#[A-F0-9]+)', children \}\) => \(\n            <(?:FadeIn>\n              )?<div style=\{\{margin:'80px 0', position:'relative'\}\}>\n[\s\S]*?              \{intro && <p style=\{\{fontSize:16, color:'rgba\(255,255,255,0\.85\)', lineHeight:1\.75, marginBottom:24, maxWidth:780\}\}>\{intro\}<\/p>\}\n              \{children\}\n              <\/div>\n            (?:<\/FadeIn>\n            )?\);/g;

// Build the replacement function: it captures the color, returns a collapsible version
const buildCollapsibleEra = (color) => `const Era = ({ tag, title, years, intro, color = '${color}', children }) => {
            // COLLAPSIBLE ERA — fix164
            const [eraOpen, setEraOpen] = useState(false);
            return (
              <div style={{margin:'40px 0', position:'relative'}}>
                <button
                  onClick={() => setEraOpen(o => !o)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
                    background:'transparent', border:'none', padding:0, cursor:'pointer', textAlign:'left',
                    marginBottom: eraOpen ? 20 : 0
                  }}
                >
                  <div style={{width:48, height:48, borderRadius:12, background:color+'22', border:'2px solid '+color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color, flexShrink:0}}>{tag}</div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                  </div>
                  <div style={{flexShrink:0, width:36, height:36, borderRadius:'50%', background: eraOpen ? color : 'rgba(255,255,255,0.05)', color: eraOpen ? '#0F1620' : color, border:'1px solid '+(eraOpen ? color : 'rgba(255,255,255,0.15)'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:300, lineHeight:1, transform: eraOpen ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s, background 0.2s, color 0.2s'}}>+</div>
                </button>
                {eraOpen && (
                  <div style={{paddingTop:8, paddingLeft: 64}}>
                    {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
                    {children}
                  </div>
                )}
              </div>
            );
          };`;

// We need to find and replace each Era separately because they're all the same name
// in different IIFE scopes. The history pages live at known line ranges:
//   IBEW    : 7472
//   UA      : 7873
//   SMART   : 8275
//   BAC     : 8661
//   UFCW    : 9059
//   IRON    : 9494  (this one has function body — handled separately below)
//   INSUL   : 9965
//   IUEC    : 10327
// We approach this by finding each Era definition's full text and replacing in place.

const findStandardEra = (color) => {
  // Build the EXACT existing text (no FadeIn wrapper variant)
  return `const Era = ({ tag, title, years, intro, color = '${color}', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:48, height:48, borderRadius:12, background:\`\${color}22\`, border:\`2px solid \${color}\`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                </div>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );`;
};

// And the alternate variant where color references use '+' concatenation
const findAltEra = (color) => {
  return `const Era = ({ tag, title, years, intro, color = '${color}', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:48, height:48, borderRadius:12, background:color+'22', border:'2px solid '+color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                </div>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );`;
};

// Colors: IBEW=#F5C518, UA=#3B9EFF, SMART=#B0BEC5, BAC=#C04A36, UFCW=#10A37F, INSUL=#A8623A, IUEC=#4A7B9D
// IBEW + UA use template-literal `${color}` style; the rest use '+' concat
const standardErasTemplate = ['#F5C518', '#3B9EFF']; // IBEW, UA — template literal style
const standardErasConcat = ['#B0BEC5', '#C04A36', '#10A37F', '#A8623A', '#4A7B9D']; // SMART, BAC, UFCW, INSUL, IUEC

let edits = 0;

for (const color of standardErasTemplate) {
  const old = findStandardEra(color);
  if (src.includes(old)) {
    src = src.replace(old, () => buildCollapsibleEra(color));
    edits++;
  } else {
    console.error('WARN: did not find template-literal Era for color ' + color);
  }
}

for (const color of standardErasConcat) {
  const old = findAltEra(color);
  if (src.includes(old)) {
    src = src.replace(old, () => buildCollapsibleEra(color));
    edits++;
  } else {
    console.error('WARN: did not find concat-style Era for color ' + color);
  }
}

// ============================================================
// PASS 2: Iron Workers — special case (has useReveal animation)
// ============================================================
const ironOld = `const Era = ({ tag, title, years, intro, color = '#D85F2E', children }) => {
            const [ref, revealed] = useReveal();
            return (
              <div ref={ref} style={{
                margin:'80px 0', position:'relative',
                transition:'opacity 0.8s, transform 0.8s',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(40px)',
              }}>
                <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                  <div style={{
                    width:48, height:48, borderRadius:12,
                    background:color+'22', border:'2px solid '+color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color,
                    boxShadow: revealed ? '0 0 0 6px '+color+'15, 0 0 24px '+color+'40' : 'none',
                    animation: revealed ? 'iron-rivet-pulse 3s ease-in-out infinite' : 'none',
                  }}>{tag}</div>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                  </div>
                </div>
                {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
                {children}
              </div>
            );
          };`;

const ironNew = `const Era = ({ tag, title, years, intro, color = '#D85F2E', children }) => {
            // COLLAPSIBLE ERA — fix164 (with reveal anim preserved on entry)
            const [ref, revealed] = useReveal();
            const [eraOpen, setEraOpen] = useState(false);
            return (
              <div ref={ref} style={{
                margin:'40px 0', position:'relative',
                transition:'opacity 0.8s, transform 0.8s',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(40px)',
              }}>
                <button
                  onClick={() => setEraOpen(o => !o)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
                    background:'transparent', border:'none', padding:0, cursor:'pointer', textAlign:'left',
                    marginBottom: eraOpen ? 20 : 0
                  }}
                >
                  <div style={{
                    width:48, height:48, borderRadius:12,
                    background:color+'22', border:'2px solid '+color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color,
                    boxShadow: revealed ? '0 0 0 6px '+color+'15, 0 0 24px '+color+'40' : 'none',
                    animation: revealed ? 'iron-rivet-pulse 3s ease-in-out infinite' : 'none',
                    flexShrink:0,
                  }}>{tag}</div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                  </div>
                  <div style={{flexShrink:0, width:36, height:36, borderRadius:'50%', background: eraOpen ? color : 'rgba(255,255,255,0.05)', color: eraOpen ? '#0F1620' : color, border:'1px solid '+(eraOpen ? color : 'rgba(255,255,255,0.15)'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:300, lineHeight:1, transform: eraOpen ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s, background 0.2s, color 0.2s'}}>+</div>
                </button>
                {eraOpen && (
                  <div style={{paddingTop:8, paddingLeft:64}}>
                    {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
                    {children}
                  </div>
                )}
              </div>
            );
          };`;

if (src.includes(ironOld)) {
  src = src.replace(ironOld, () => ironNew);
  edits++;
} else {
  console.error('WARN: did not find Iron Workers Era variant');
}

// ============================================================
// Final
// ============================================================
if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Era sections are now collapsible on ' + edits + ' history pages.');
console.log('Each Era starts collapsed; click any header to expand or collapse it.');
console.log('Hero and Conclusion sections remain always-open.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: collapsible Era sections on all trade history pages" && git push');
console.log('');
