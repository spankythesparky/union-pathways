// fix-newsletter.js — Add Substack newsletter signup
//
// Adds two newsletter signup blocks:
//   1. Prominent inline section on the home page (below mission)
//   2. Compact section in the global footer (every page)
//
// Behavior: user enters email → opens Substack subscribe page in new tab with email prefilled.
// Reliable (uses Substack's official prefill URL parameter, no API scraping).

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency check
if (src.includes('newsletter-substack-signup')) {
  console.error('ERROR: Newsletter signup already added. Aborting.');
  process.exit(1);
}

// ============================================================
// 1. HOME PAGE PROMINENT INLINE NEWSLETTER SECTION
// Insert after the mission section closing </section>)}
// ============================================================
const homeAnchor = `              {lang==="es" ? "Union Pathways es un recurso gratuito, sin publicidad y sin afiliacion. Solo datos reales para ayudarte a encontrar tu local mas cercano y empezar tu carrera en los oficios." : lang==="pl" ? "Union Pathways to bezplatne, wolne od reklam i bezstronne narzedzie. Tylko prawdziwe dane, ktore pomoga Ci znalezc najblizszy oddzial i zaczac kariere." : "Union Pathways is free, ad-free, and unaffiliated. Just real data to help you find your nearest local, learn what your trade actually pays, and start your career on the right foot."}
            </p>
          </section>
        )}`;

const homeInsertion = `              {lang==="es" ? "Union Pathways es un recurso gratuito, sin publicidad y sin afiliacion. Solo datos reales para ayudarte a encontrar tu local mas cercano y empezar tu carrera en los oficios." : lang==="pl" ? "Union Pathways to bezplatne, wolne od reklam i bezstronne narzedzie. Tylko prawdziwe dane, ktore pomoga Ci znalezc najblizszy oddzial i zaczac kariere." : "Union Pathways is free, ad-free, and unaffiliated. Just real data to help you find your nearest local, learn what your trade actually pays, and start your career on the right foot."}
            </p>
          </section>
        )}

        {/* ─── NEWSLETTER (HOME) ─── */}
        {!results && (
          <section className="newsletter-substack-signup" style={{padding:'80px 24px 120px', maxWidth:900, margin:'0 auto', borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:32, display:'inline-flex', alignItems:'center', gap:14}}>
              <span style={{width:32, height:1, background:'#FA8059', opacity:0.6}} />
              {lang==="es" ? "Boletin" : lang==="pl" ? "Newsletter" : "Newsletter"}
            </div>
            <h2 style={{
              fontFamily:"'Space Grotesk',sans-serif",
              fontSize:'clamp(24px, 3vw, 36px)',
              fontWeight:500,
              color:'#fff',
              lineHeight:1.1,
              letterSpacing:'-0.02em',
              margin:'0 0 16px 0',
              maxWidth:720
            }}>
              {lang==="es" ? <>Lo que esta pasando en los <span style={{color:'#FA8059', fontStyle:'italic'}}>oficios.</span></> :
               lang==="pl" ? <>Co sie dzieje w <span style={{color:'#FA8059', fontStyle:'italic'}}>zawodach.</span></> :
               <>What's happening in <span style={{color:'#FA8059', fontStyle:'italic'}}>the trades.</span></>}
            </h2>
            <p style={{fontFamily:"'Inter',sans-serif", fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.7, maxWidth:560, margin:'0 0 32px 0'}}>
              {lang==="es" ? "Noticias de oficios, victorias organizativas, aperturas de aprendizaje. Directo a tu bandeja de entrada." :
               lang==="pl" ? "Wiadomosci z zawodow, sukcesy organizacyjne, otwarcia stazow. Prosto do twojej skrzynki." :
               "Trades news, organizing wins, apprenticeship openings. Straight to your inbox."}
            </p>
            <NewsletterForm lang={lang} />
          </section>
        )}`;

if (!src.includes(homeAnchor)) {
  console.error('ERROR: Could not find home mission anchor.');
  process.exit(1);
}
src = src.replace(homeAnchor, () => homeInsertion);

// ============================================================
// 2. GLOBAL FOOTER NEWSLETTER (above the existing footer)
// Insert before <footer style={{flexDirection:"column"...
// ============================================================
const footerAnchor = `        <footer style={{flexDirection:"column", gap:"12px", textAlign:"center"}}>`;

const footerInsertion = `        {/* ─── NEWSLETTER (FOOTER) ─── */}
        <div style={{padding:'48px 24px', maxWidth:1280, margin:'0 auto', borderTop:'1px solid rgba(255,255,255,0.08)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center'}} className="footer-newsletter-grid">
          <div>
            <div style={{fontFamily:"'Space Mono',monospace", fontSize:10, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:12}}>
              // {lang==="es" ? "Boletin" : lang==="pl" ? "Newsletter" : "Newsletter"}
            </div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(18px, 2vw, 22px)', fontWeight:500, color:'#fff', lineHeight:1.2, letterSpacing:'-0.015em'}}>
              {lang==="es" ? <>Lo que esta pasando en los <span style={{color:'#FA8059', fontStyle:'italic'}}>oficios.</span></> :
               lang==="pl" ? <>Co sie dzieje w <span style={{color:'#FA8059', fontStyle:'italic'}}>zawodach.</span></> :
               <>What's happening in <span style={{color:'#FA8059', fontStyle:'italic'}}>the trades.</span></>}
            </div>
          </div>
          <NewsletterForm lang={lang} compact={true} />
        </div>
        <footer style={{flexDirection:"column", gap:"12px", textAlign:"center"}}>`;

if (!src.includes(footerAnchor)) {
  console.error('ERROR: Could not find footer anchor.');
  process.exit(1);
}
src = src.replace(footerAnchor, () => footerInsertion);

// ============================================================
// 3. Add the NewsletterForm component definition
// Place it just before the App function returns, somewhere shared
// We'll define it as a function component inline near the top of the App component
// ============================================================

// Find a good place: just inside the App function, before the return statement
// Look for the start of the JSX return — we want NewsletterForm to be a function
// component defined OUTSIDE App's render but INSIDE the file scope.

// Find a good insertion point — after the imports / before the App component
const insertAnchor = `export default function UnionPathway() {`;
const insertNew = `function NewsletterForm({ lang, compact }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError(true);
      setTimeout(() => setError(false), 2500);
      return;
    }
    // Open Substack subscribe page in a new tab with email prefilled
    const url = 'https://spankythesparky.substack.com/subscribe?simple=true&email=' + encodeURIComponent(trimmed);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setEmail(''); }, 6000);
  };

  if (submitted) {
    return (
      <div style={{
        padding: compact ? '14px 0' : '20px 0',
        fontFamily:"'Inter',sans-serif",
        fontSize: compact ? 14 : 15,
        color:'#FA8059',
        display:'flex', alignItems:'center', gap:10
      }}>
        <span style={{width:18, height:18, borderRadius:'50%', background:'#FA8059', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700}}>✓</span>
        {lang==="es" ? "Revisa tu correo para confirmar." : lang==="pl" ? "Sprawdz email aby potwierdzic." : "Check your email to confirm."}
      </div>
    );
  }

  return (
    <div onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }} style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'stretch'}}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={lang==="es" ? "tu@correo.com" : lang==="pl" ? "twoj@email.com" : "you@email.com"}
        style={{
          flex:'1 1 240px',
          background:'transparent',
          border:'none',
          borderBottom: '1px solid ' + (error ? '#FA8059' : 'rgba(255,255,255,0.18)'),
          color:'#fff',
          fontSize: compact ? 15 : 16,
          fontFamily:"'Space Grotesk',sans-serif",
          padding:'10px 0',
          outline:'none',
          transition:'border-color 0.18s'
        }}
        onFocus={e => e.currentTarget.style.borderBottomColor = '#FA8059'}
        onBlur={e => e.currentTarget.style.borderBottomColor = error ? '#FA8059' : 'rgba(255,255,255,0.18)'}
      />
      <button
        onClick={handleSubmit}
        style={{
          background:'#FA8059',
          color:'#000',
          fontFamily:"'Inter',sans-serif",
          fontSize:14, fontWeight:700, letterSpacing:'0.04em',
          padding: compact ? '0 28px' : '0 32px',
          border:'none', borderRadius:50,
          cursor:'pointer', transition:'all 0.18s',
          minHeight: compact ? 44 : 48,
          whiteSpace:'nowrap'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(250,128,89,0.35)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {lang==="es" ? "Suscribir" : lang==="pl" ? "Subskrybuj" : "Subscribe"}
      </button>
    </div>
  );
}

function App() {`;

// Adjust the inserted code to match the real component name
const insertAnchorFinal = `export default function UnionPathway() {`;
const insertNewFinal = insertNew.replace('function App() {', insertAnchorFinal);

if (!src.includes(insertAnchorFinal)) {
  console.error('ERROR: Could not find UnionPathway function anchor.');
  process.exit(1);
}
src = src.replace(insertAnchorFinal, () => insertNewFinal);

// ============================================================
// 4. Add a media query for footer newsletter to stack on mobile
// ============================================================
const cssOld = `        @media (max-width: 480px) {
          .appr-advice-row { grid-template-columns: 1fr !important; gap: 4px !important; }
        }`;

const cssNew = `        @media (max-width: 480px) {
          .appr-advice-row { grid-template-columns: 1fr !important; gap: 4px !important; }
        }
        @media (max-width: 720px) {
          .footer-newsletter-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }`;

if (src.includes(cssOld)) {
  src = src.replace(cssOld, () => cssNew);
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Newsletter signup added:');
console.log('  - Prominent inline section on home page (below mission)');
console.log('  - Compact section in global footer (every page)');
console.log('  - NewsletterForm React component defined at top of file');
console.log('  - Trilingual (English / Spanish / Polish)');
console.log('  - Email validation with subtle coral error indicator');
console.log('  - Submits via Substack official prefill URL (opens in new tab)');
console.log('  - Mobile responsive (footer stacks on small screens)');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: substack newsletter signup (home + footer)" && git push');
console.log('');
