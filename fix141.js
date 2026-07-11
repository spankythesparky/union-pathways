// fix141.js
// Add the Iron Workers (International Association of Bridge, Structural,
// Ornamental and Reinforcing Iron Workers) deep-dive history page.
//
// Same structural pattern as IBEW / UA / SMART / BAC / UFCW pages, but with
// extra animation polish per the user's request to make this page "over the
// top":
//   - Burnt-orange (#D85F2E) primary accent — hot-steel theme, distinct from
//     BAC's brick red
//   - Animated SVG suspension bridge in the hero that draws itself on mount
//   - Scroll-reveal animations (slide up + fade in) on every Era card
//   - Steel-shimmer gradient effect on the hero's accent text
//   - Pulsing rivet glow ring around each Era number badge
//   - 9 Era sections, hero stats, scroll progress bar, prerender og tags
//
// Steps:
//   1. Add 'history-iron' to validPages
//   2. Add 'history-iron' entry to PAGE_META
//   3. Update App-level scrollProgress hook to check for 'iron-history-root'
//   4. Update history dropdown — promote Ironworkers from placeholder to live
//   5. Insert the new Iron Workers page IIFE before the trade-history fallback
//   6. Update the prerender script

const fs = require('fs');
const appPath = 'src/App.jsx';
const prerenderPath = 'scripts/generate-og-pages.mjs';
let code = fs.readFileSync(appPath, 'utf8');

let changes = 0;

// ── 1. ADD 'history-iron' TO validPages ─────────────────────────────────────
const oldValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','history-bac','history-ufcw','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
const newValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','history-bac','history-ufcw','history-iron','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
if (code.includes(oldValidPages)) {
  code = code.replace(oldValidPages, newValidPages);
  console.log("✓ Added 'history-iron' to validPages");
  changes++;
} else if (code.includes("'history-iron'")) {
  console.log("Skipping — 'history-iron' already in validPages.");
} else {
  console.error('ERROR: validPages array not found in expected form.');
  process.exit(1);
}

// ── 2. ADD 'history-iron' TO PAGE_META ──────────────────────────────────────
const oldMeta = `      'history-ufcw': { title: "UFCW History — Behind the Counter and on the Cutting Floor · Union Pathways", desc: "The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president." },`;
const newMeta =
`      'history-ufcw': { title: "UFCW History — Behind the Counter and on the Cutting Floor · Union Pathways", desc: "The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president." },
      'history-iron': { title: "Iron Workers History — Cowboys in the Sky · Union Pathways", desc: "The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding, through the McNamara bombings, the Golden Gate Bridge, the 2002 Jake West scandal, the bottom-up organizing model under Eric Dean, and the 2026 transition to General President Kevin Bryenton." },`;
if (code.includes(oldMeta)) {
  code = code.replace(oldMeta, newMeta);
  console.log("✓ Added 'history-iron' PAGE_META entry");
  changes++;
} else if (code.includes("'history-iron': { title:")) {
  console.log("Skipping — 'history-iron' PAGE_META already present.");
} else {
  console.error('ERROR: history-ufcw PAGE_META anchor not found.');
  process.exit(1);
}

// ── 3. UPDATE APP-LEVEL scrollProgress HOOK ─────────────────────────────────
const oldCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','ufcw-history-root','benefits-root'];`;
const newCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','ufcw-history-root','iron-history-root','benefits-root'];`;
if (code.includes(oldCandidates)) {
  code = code.replace(oldCandidates, newCandidates);
  console.log("✓ Added 'iron-history-root' to scrollProgress candidates");
  changes++;
} else if (code.includes('iron-history-root')) {
  console.log("Skipping — scrollProgress already includes iron-history-root.");
} else {
  console.error('ERROR: scrollProgress candidates list not found.');
  process.exit(1);
}

// ── 4. PROMOTE IRONWORKERS DROPDOWN ENTRY TO LIVE ───────────────────────────
const oldDropdownEntry = `                    {key:'IW', name:'Ironworkers'},`;
const newDropdownEntry = `                    {key:'IW', name:'Iron Workers — Bridge & Structural', page:'history-iron', live:true},`;
if (code.includes(oldDropdownEntry)) {
  code = code.replace(oldDropdownEntry, newDropdownEntry);
  console.log('✓ Promoted Ironworkers dropdown entry to live (history-iron)');
  changes++;
} else if (code.includes("page:'history-iron'")) {
  console.log('Skipping — Iron Workers dropdown entry already promoted.');
} else {
  console.error('ERROR: Ironworkers dropdown entry not found in expected form.');
  process.exit(1);
}

// ── 5. INSERT THE FULL IRON WORKERS PAGE BEFORE trade-history FALLBACK ──────
const insertAnchor = `        {page === "trade-history" && (`;

const ironPage =
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
          };

          // Scroll-reveal: cards slide up + fade in when entering viewport
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
          };

          const ExpandableCard = ({ year, title, summary, body, accent = '#D85F2E' }) => {
            const [open, setOpen] = useState(false);
            const [ref, revealed] = useReveal();
            return (
              <div ref={ref} style={{
                background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:16,
                padding:'24px 28px',
                marginBottom:16,
                transition:'opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s, border-color 0.3s',
                borderLeft:'4px solid '+accent,
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(24px)',
              }}>
                <div onClick={() => setOpen(o => !o)} style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>{title}</div>
                    <div style={{fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6}}>{summary}</div>
                  </div>
                  <div style={{flexShrink:0, width:32, height:32, borderRadius:'50%', background:accent+'22', color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s'}}>+</div>
                </div>
                {open && (
                  <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.7}}>
                    {body}
                  </div>
                )}
              </div>
            );
          };

          const PullQuote = ({ children, attribution }) => {
            const [ref, revealed] = useReveal();
            return (
              <div ref={ref} style={{
                margin:'40px auto', maxWidth:760, padding:'30px 36px',
                borderLeft:'4px solid #F5C518',
                background:'linear-gradient(90deg, rgba(245,197,24,0.08) 0%, transparent 100%)',
                borderRadius:'0 16px 16px 0',
                transition:'opacity 0.8s, transform 0.8s',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(24px)',
              }}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
                {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
              </div>
            );
          };

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#D85F2E', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#D85F2E', children }) => {
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
          };

          return (
            <div id="iron-history-root">
              {/* PAGE-SCOPED ANIMATIONS */}
              <style>{\`
                @keyframes iron-bridge-draw {
                  to { stroke-dashoffset: 0; }
                }
                @keyframes iron-rivet-pulse {
                  0%, 100% { box-shadow: 0 0 0 6px #D85F2E15, 0 0 24px #D85F2E40; }
                  50%      { box-shadow: 0 0 0 8px #D85F2E25, 0 0 32px #D85F2E70; }
                }
                @keyframes iron-shimmer {
                  0%   { background-position: -200% 0; }
                  100% { background-position:  200% 0; }
                }
                .iron-shimmer-text {
                  background: linear-gradient(90deg, #D85F2E 0%, #FFB07A 25%, #FA8059 50%, #FFB07A 75%, #D85F2E 100%);
                  background-size: 200% 100%;
                  -webkit-background-clip: text;
                  background-clip: text;
                  -webkit-text-fill-color: transparent;
                  color: transparent;
                  animation: iron-shimmer 5s linear infinite;
                }
                .iron-bridge-cable {
                  fill: none;
                  stroke: #D85F2E;
                  stroke-width: 2;
                  stroke-dasharray: 1200;
                  stroke-dashoffset: 1200;
                  animation: iron-bridge-draw 2.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
                }
                .iron-bridge-tower {
                  fill: none;
                  stroke: #D85F2E;
                  stroke-width: 3;
                  stroke-linecap: square;
                  stroke-dasharray: 600;
                  stroke-dashoffset: 600;
                  animation: iron-bridge-draw 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                .iron-bridge-deck {
                  fill: none;
                  stroke: #D85F2E;
                  stroke-width: 2;
                  stroke-dasharray: 800;
                  stroke-dashoffset: 800;
                  animation: iron-bridge-draw 1.8s cubic-bezier(0.4, 0, 0.2, 1) 1.4s forwards;
                }
                .iron-bridge-suspender {
                  stroke: #D85F2E;
                  stroke-width: 1;
                  opacity: 0;
                  animation: iron-suspender-fade 0.4s linear forwards;
                }
                @keyframes iron-suspender-fade {
                  to { opacity: 0.55; }
                }
              \`}</style>

              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #D85F2E, #F5C518)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto', position:'relative', zIndex:5}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#D85F2E'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto', position:'relative'}}>
                {/* Animated suspension bridge SVG behind the title */}
                <svg viewBox="0 0 1000 320" style={{position:'absolute', top:60, left:0, right:0, width:'100%', height:'auto', maxHeight:320, opacity:0.32, pointerEvents:'none', zIndex:0}} preserveAspectRatio="xMidYMid meet">
                  {/* Towers */}
                  <path className="iron-bridge-tower" d="M 240 280 L 240 80 M 220 80 L 260 80 M 240 130 L 220 130 L 220 110 L 260 110 L 260 130 L 240 130 M 240 170 L 220 170 L 220 150 L 260 150 L 260 170 L 240 170 M 240 210 L 220 210 L 220 190 L 260 190 L 260 210 L 240 210" />
                  <path className="iron-bridge-tower" d="M 760 280 L 760 80 M 740 80 L 780 80 M 760 130 L 740 130 L 740 110 L 780 110 L 780 130 L 760 130 M 760 170 L 740 170 L 740 150 L 780 170 L 780 170 L 760 170 M 760 210 L 740 210 L 740 190 L 780 190 L 780 210 L 760 210" />
                  {/* Deck */}
                  <line className="iron-bridge-deck" x1="40" y1="280" x2="960" y2="280" />
                  {/* Main cables — large parabolic curves between the two towers */}
                  <path className="iron-bridge-cable" d="M 40 180 Q 240 80 240 80 Q 500 240 760 80 Q 760 80 960 180" />
                  {/* Suspenders */}
                  <g>
                    {Array.from({length:21}).map((_, i) => {
                      const x = 280 + i * 22;
                      // approximate cable y at x: parabola dipping to ~210 at center, ~80 at towers
                      const t = (x - 240) / (760 - 240); // 0..1
                      const cableY = 80 + 130 * (4 * t * (1 - t));
                      const delay = 2.0 + i * 0.05;
                      return <line key={i} className="iron-bridge-suspender" x1={x} y1={cableY} x2={x} y2={280} style={{animationDelay: delay + 's'}} />;
                    })}
                  </g>
                </svg>

                <div style={{position:'relative', zIndex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#D85F2E', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers</div>
                  <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                    Cowboys in<br/><span className="iron-shimmer-text">The Sky.</span><br/>
                    <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Founded above an alley in Pittsburgh, 1896.</span>
                  </h1>
                  <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:720, margin:'0 auto'}}>
                    The work has always been dangerous. By the time sixteen delegates met at Moorhead's Hall in February 1896, the men who erected structural steel for a living were already known for two things: their skill at moving across high steel without falling, and the regularity with which they nevertheless fell. The first major activity of the new union was distributing $50 burial money to widows.
                  </p>
                </div>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={130} label="Active members" suffix="K" />
                  <StatBlock value={130} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={4} label="Year apprenticeship" suffix="-yr" />
                  <StatBlock value={1896} label="Year of founding" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="1870s – 1895" title="The Pre-Union World" intro="The trade of structural ironwork emerged in North America after the Civil War, as the Bessemer process and the broader industrialization of American steel created the materials and the demand for an entirely new kind of construction.">
                  <ExpandableCard
                    year="post-1870"
                    title="The Skyscraper Becomes Possible"
                    summary="Iron and then steel framing replaced load-bearing masonry. Buildings could rise to ten, twenty, forty stories."
                    body="Before the 1870s, large buildings in American cities had been built of brick, stone, and timber, with floor systems supported by load-bearing masonry walls that limited the practical height of any structure to roughly four or five stories. The introduction of iron and then steel framing changed everything. Buildings could rise to ten, then twenty, then forty stories. Bridges could span distances that had previously been impossible. Industrial plants could house machinery and processes at scales that masonry construction could not have accommodated."
                  />
                  <ExpandableCard
                    year="1890s"
                    title="$2.10 a Day, No Safety, No Pension"
                    summary="Wages averaged around $2.10 per day for ten-hour shifts. There were no safety standards, no apprenticeship, no provisions for the families of men who fell."
                    body="The work required physical courage, technical skill, and an unusual tolerance for risk. Wages averaged around $2.10 per day for ten-hour shifts in the mid-1890s. There were no safety standards, no formal apprenticeship, no consistent training, and no provisions for the families of men who fell. Mortality rates among structural ironworkers in the late nineteenth century were the highest of any major construction trade."
                  />
                  <ExpandableCard
                    year="early 1890s"
                    title="The First Local Unions"
                    summary="Boston, Buffalo, Chicago, Cleveland, Detroit, NYC, Philadelphia, and Pittsburgh all had local ironworker organizations by 1895."
                    body="By the early 1890s, ironworkers in major cities had begun forming local unions to defend wage rates, share information about safe practices, and provide rudimentary mutual aid for the widows and disabled. Boston, Buffalo, Chicago, Cleveland, Detroit, New York City, Philadelphia, and Pittsburgh all had local organizations by 1895. But the locals operated in isolation, and the major bridge and steel construction firms — most prominently the American Bridge Company, formed in 1900 by the consolidation of dozens of regional bridge builders — were already organizing across state lines in ways that local unions could not match."
                  />
                </Era>

                {/* PART II */}
                <Era tag="II" years="February 4, 1896" title="Moorhead's Hall, Pittsburgh" intro="Sixteen delegates representing several local ironworker unions convened at Moorhead's Hall in downtown Pittsburgh. Over the course of the meeting, they formally established the International Association of Bridge and Structural Iron Workers of America. Edward J. Ryan was elected the union's first General President.">
                  <ExpandableCard
                    year="1896"
                    title="The Mutual Aid Society Inside the Union"
                    summary="The first major institutional activity of the new union was distributing $50 burial money to widows and $5/week stipends to disabled members."
                    body="The first major activity of the new international was the death-benefit and disability-benefit system. Widows of members who died in workplace accidents received $50 toward burial expenses. Disabled members who could no longer work received $5 per week. These were modest sums even by 1896 standards, but they represented the core institutional value the union had been founded to provide: protection for families that the rest of the construction industry had explicitly refused to insure. The international was a mutual aid society as much as a labor organization, founded by men who knew with certainty that some of them would not survive long enough to collect a pension."
                  />
                  <ExpandableCard
                    year="1900 – 1903"
                    title="500 Percent Membership Growth"
                    summary="From 1,750 members to roughly 10,000 in three years."
                    body="Membership growth accelerated dramatically between 1900 and 1903. The union expanded from approximately 1,750 members to roughly 10,000 members in three years — a 500 percent increase driven by both organizing success and the rapid expansion of structural steel construction across American cities. The 1903 convention dropped 'of America' from the title, formally becoming the International Association of Bridge, Structural, and Ornamental Iron Workers — a nominal change that reflected its growing commitment to organizing in Canada, where it would soon hold its 1904 convention in Toronto."
                  />
                  <ExpandableCard
                    year="1896 – early 1900s"
                    title="Sam Parks and the Walking Delegate"
                    summary="The walking delegate of New York Local 2 was credited with single-handedly doubling NYC ironworker wages from $2 to $4 per day."
                    body="The institutional dynamics of the early union were shaped by the emergence of certain charismatic local leaders, most prominently Sam Parks of New York. Parks, working as a 'walking delegate' enforcing union conditions on Manhattan job sites, was credited with single-handedly doubling the wages of New York ironworkers from $2 per day to $4 per day in 1896. His tactics — which often involved physical intimidation of contractors and workers who crossed picket lines — were not fully condoned by the international officers, who tried to maintain a more measured organizational posture, but were celebrated within New York Local 2 and similar urban locals where employer resistance was particularly fierce."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1903 – 1914" title="The McNamara Bombings" intro="The first decade of the twentieth century brought the Iron Workers into direct conflict with what would become the most powerful employer organization in American construction. The Iron Workers' response, organized at the international level by Secretary-Treasurer John J. McNamara, ultimately produced one of the most damaging episodes in the history of American organized labor.">
                  <ExpandableCard
                    year="1903"
                    title="The National Erectors' Association Forms"
                    summary="U.S. Steel, the American Bridge Company, and a coalition of major structural steel firms organized to break union control of structural steel erection."
                    body="In 1903, U.S. Steel, its subsidiary the American Bridge Company, and a coalition of major structural steel firms formed the National Erectors' Association (NEA) to promote the open shop and break union control of structural steel erection. The NEA combined private detective agencies, agents provocateurs, strikebreakers, and political influence in an organized campaign that, by the late 1900s, had succeeded in driving the Iron Workers out of much of the structural steel erection market in the United States."
                  />
                  <ExpandableCard
                    year="1906 – 1910"
                    title="Over 100 Bombings"
                    summary="John J. McNamara authorized — and his brother carried out — a coordinated campaign of dynamite attacks against open-shop construction sites and NEA-affiliated employers."
                    body="Beginning around 1906, McNamara authorized — and his brother James B. McNamara and a small team of accomplices carried out — a coordinated campaign of dynamite attacks against open-shop construction sites and the offices of NEA-affiliated employers across the country. By 1910, the campaign had produced more than 100 separate bombings."
                  />
                  <ExpandableCard
                    year="October 1, 1910"
                    title="The Los Angeles Times Bombing"
                    summary="A suitcase containing sixteen sticks of dynamite, placed in an alley adjacent to the Los Angeles Times building, exploded. 21 employees killed, more than 100 injured."
                    body="The campaign's fatal escalation came on October 1, 1910. Shortly after one o'clock in the morning, a bomb consisting of sixteen sticks of 80 percent dynamite, hidden in a suitcase placed in an alley adjacent to the Los Angeles Times building, exploded. The blast and the resulting fire killed 21 employees and injured more than 100 others. The Los Angeles Times, owned by the staunchly anti-union Harrison Gray Otis, called the attack 'the crime of the century' — and the term stuck. A second bombing on Christmas Day 1910 destroyed the Llewellyn Iron Works in Los Angeles."
                  />
                  <ExpandableCard
                    year="December 1, 1911"
                    title="Darrow's Defense and the Plea Deal"
                    summary="Clarence Darrow defended the McNamara brothers. After a jury-bribery scandal, both pleaded guilty in open court."
                    body="Detective William J. Burns, working for the National Erectors' Association, traced the dynamite to a factory near San Francisco and the conspiracy to the Iron Workers' headquarters in Indianapolis. In April 1911, Burns and local police arrested James B. McNamara and Ortie McManigal, a courier and dynamiter for the union, in Detroit. McManigal turned state's evidence. John J. McNamara was arrested in Indianapolis. Clarence Darrow, the most famous defense attorney in America, was retained by the AFL to defend the brothers. After months of escalating evidence and a jury-bribery scandal involving Darrow's investigators, the brothers reversed course on December 1, 1911, and pleaded guilty in open court — James to murder, John to ordering the bombing of the Llewellyn Iron Works. James was sentenced to life imprisonment in San Quentin, where he would die of cancer in 1941. John served roughly nine years of a fifteen-year sentence."
                  />
                  <ExpandableCard
                    year="October 1912"
                    title="50 Officers Tried in Indianapolis"
                    summary="Most of the union's senior leadership was tried for illegally transporting dynamite. 39 were convicted."
                    body="In October 1912, fifty Iron Workers officers — most of the union's senior leadership — were tried in Indianapolis for illegally transporting dynamite. Thirty-nine were convicted. The case set the cause of organized labor on the West Coast back by decades, gave the open-shop movement enormous propaganda ammunition, and forced the Iron Workers into a long institutional rebuilding process that would not be substantially completed until the New Deal era."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="1914 – 1934" title="Rebuilding and the New Deal" intro="The two decades following the McNamara case were the most difficult in the union's history. The 1930s reversed the trajectory entirely — and produced one of the most iconic projects in the union's institutional revival.">
                  <ExpandableCard
                    year="1917 – 1918"
                    title="The Carpenters Pile-Driving Fight"
                    summary="An AFL suspension over jurisdictional disputes forced the Iron Workers to cede most pile-driving work to the Carpenters."
                    body="The Iron Workers had affiliated with the AFL shortly after the international's 1896 founding, but persistent jurisdictional disputes — most prominently with the United Brotherhood of Carpenters and Joiners over pile-driving work — produced an AFL suspension in 1917 when the Iron Workers refused to cede the disputed work to the Carpenters. With other AFL unions unwilling to support the Iron Workers in their fights with employers, the union relented in 1918 and ceded most pile-driving work to the Carpenters, retaining only pile-driving directly related to bridge construction."
                  />
                  <ExpandableCard
                    year="1932 – 1935"
                    title="Norris-LaGuardia, the NIRA, and the Wagner Act"
                    summary="The legal foundation of the modern union was laid in three years."
                    body="The 1930s reversed the trajectory. The Norris-LaGuardia Act of 1932, the National Industrial Recovery Act of 1933, and most importantly the National Labor Relations Act of 1935 — the Wagner Act — fundamentally restructured the legal environment in which the Iron Workers operated. For the first time, structural steel workers had federally enforceable rights to organize and bargain collectively, with the National Labor Relations Board as enforcement."
                  />
                  <ExpandableCard
                    year="1937"
                    title="The Golden Gate and the 'Halfway to Hell Club'"
                    summary="A $130,000 safety net, suspended below the bridge deck, saved 19 men who fell during construction — and gave them a name."
                    body="Major federal construction projects under the New Deal — the Hoover Dam, the Bay Bridge, the Golden Gate Bridge, the dams of the Tennessee Valley Authority, and the federal building program of the Works Progress Administration — were performed substantially by union labor under federal prevailing-wage requirements. The Golden Gate Bridge in particular, completed in 1937, became one of the iconic projects of the union's institutional revival, with Iron Workers performing the cable-spinning, structural steel erection, and finish work over a four-year construction process. The union also adopted a particular safety innovation during the Golden Gate construction: a $130,000 safety net suspended below the bridge deck, which saved 19 men who fell during construction and who were thereafter known as the 'Halfway to Hell Club.'"
                  />
                </Era>

                <PullQuote attribution="The work itself">
                  Cowboys in the sky.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="1934 – 1970s" title="World War II and the Golden Age" intro="The Wagner Act-era expansion accelerated dramatically during World War II. By 1945, the union had recovered from the institutional damage of the McNamara era and was positioned to participate fully in what would become the longest sustained construction boom in American history.">
                  <ExpandableCard
                    year="1941 – 1945"
                    title="WWII Industrial Construction"
                    summary="Shipyards, munitions plants, military bases — the federal government's voracious demand for industrial construction drove rapid Iron Workers growth."
                    body="The Wagner Act-era expansion accelerated dramatically during World War II. The federal government's voracious demand for industrial construction — shipyards, munitions plants, military bases, defense industrial facilities — required massive amounts of structural steel work, and the no-strike pledges and War Labor Board mediation that governed wartime industrial relations ensured that the Iron Workers grew rapidly. By 1945, the union had recovered from the institutional damage of the McNamara era."
                  />
                  <ExpandableCard
                    year="early 1970s"
                    title="Peak Membership: 180,000"
                    summary="Suburban expansion, interstates, defense, nuclear power, downtown skyscrapers in every major American city."
                    body="The postwar quarter-century was the Iron Workers' golden age. Suburban expansion, the interstate highway system, the cold-war defense build-up, and the construction of the country's first generation of nuclear power plants, major commercial airports, and downtown skyscrapers in every major American city all drove unprecedented demand for structural steel labor. The union grew steadily through the 1950s and 1960s, reaching peak membership of approximately 180,000 by the early 1970s."
                  />
                  <ExpandableCard
                    year="postwar"
                    title="The Modern Apprenticeship"
                    summary="A four-year, earn-while-you-learn program standardized across most U.S. and Canadian locals."
                    body="The institutional infrastructure of the modern union was built during this period. The Iron Workers' apprenticeship program — a four-year, 'earn while you learn' structure combining classroom instruction with paid on-the-job training — was standardized across most U.S. and Canadian locals and became one of the most respected building-trades training programs in North America. The National Pension Fund and welfare funds were built out into substantial multi-employer programs. Joint labor-management bodies were established with the major structural steel contractor associations. And the union's safety culture — which had been forced by the realities of high-steel work to be more rigorous than virtually any other building trade — became increasingly formalized through standardized safety training and equipment requirements."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="1970s – 2000s" title="Decline, the Roundtable, and the Long Pressure" intro="The pressures that battered every American building trade through the late twentieth century hit the Iron Workers particularly hard. A small number of structural challenges — and a 2002 leadership scandal — defined the era.">
                  <ExpandableCard
                    year="1969"
                    title="The Construction Users Anti-Inflation Roundtable"
                    summary="Founded by the CEOs of GM, GE, Exxon, U.S. Steel, DuPont, and others to break union control of large-scale construction."
                    body="The single most consequential institutional opponent during this period was the Construction Users Anti-Inflation Roundtable, founded in 1969 by the chief executives of General Motors, General Electric, Exxon, U.S. Steel, DuPont, and other major corporations specifically to break union control of large-scale construction. The Roundtable, which would later evolve into the Business Roundtable, supported the expansion of merit-shop construction associations, pushed for the weakening of the Davis-Bacon Act and other prevailing-wage protections, and steered its member companies' construction work toward non-union contractors wherever possible."
                  />
                  <ExpandableCard
                    year="1981 onward"
                    title="PATCO, Right-to-Work, and Foreign Steel"
                    summary="The political and economic environment shifted decisively against organized construction labor."
                    body="The 1981 PATCO strike and the political environment it inaugurated added additional pressure. State right-to-work laws spread, particularly through the South and Mountain West. Foreign steel imports — first from Japan, then from Korea, China, and other producers — gradually eroded the domestic steel industry that had been the foundation of much of the Iron Workers' fabrication-shop work. By the 1990s, the union had lost substantial ground in the rebar and architectural metals markets in particular, where non-union competition had become structurally entrenched."
                  />
                  <ExpandableCard
                    year="2002"
                    title="The Jake West Pension Scandal"
                    summary="General President Jake West pleaded guilty to improper use of pension funds. Joseph Hunt succeeded him and oversaw a substantial cleanup."
                    body="The union also faced internal challenges. In 2002, General President Jake West pleaded guilty to improper use of pension funds and making a false statement on a union report filed with the U.S. Department of Labor. A number of lower-level officers and the union's accounting firm pleaded guilty to related embezzlement and disclosure charges. Joseph Hunt succeeded West as General President and oversaw a substantial institutional cleanup over the following decade. The independent streak that had been an institutional strength since 1896 was again, painfully, also a recurring liability."
                  />
                </Era>

                {/* PART VII */}
                <Era tag="VII" years="2015 – 2025" title="The Eric Dean Era — Bottom-Up Organizing" intro="Eric M. Dean, a Chicago native who joined the Iron Workers as a fourth-generation member of Local 63 in December 1980, was elected General President in 2015. His decade as General President was defined by sustained institutional reinvention focused on three priorities.">
                  <ExpandableCard
                    year="2015 onward"
                    title="From Top-Down to Bottom-Up Organizing"
                    summary="Running NLRB campaigns at individual fabrication shops, rebar shops, and architectural metals firms — building density market by market."
                    body="The traditional Iron Workers approach had been 'top-down' organizing — winning major contractor associations and signing them to industry-wide agreements that bound the contractors' employees into the union. As that model became less effective in industries where non-union competition had grown entrenched, Dean and his administration emphasized 'bottom-up' organizing — running NLRB campaigns at individual fabrication shops, rebar shops, and architectural metals firms, building density market by market and shop by shop. By 2024, NLRB union petitions across the construction industry were up 35 percent in the first six months of the fiscal year compared to the same period in 2023, and the Iron Workers were running successful organizing campaigns in California, Illinois, Pennsylvania, New York, New Jersey, Massachusetts, Virginia, Washington, D.C., British Columbia, and Ontario."
                  />
                  <ExpandableCard
                    year="late 2010s"
                    title="The Building Trades' First Maternity Leave Program"
                    summary="A substantial structural reform in an industry where pregnancy has often forced women out of the trade entirely."
                    body="Iron Workers under Dean developed and implemented the building trades' first international maternity leave program for women members — a substantial structural reform in an industry where women's representation has historically been very low and where pregnancy has often forced women out of the trade entirely. The program provided paid leave funded through the union's benefit structure, and was widely cited within NABTU as a model for other building trades unions to consider."
                  />
                  <ExpandableCard
                    year="2021 – 2024"
                    title="Leveraging BIL, CHIPS, and IRA"
                    summary="Iron Workers were essential to virtually every major project funded under the federal industrial-policy package."
                    body="The Bipartisan Infrastructure Law (2021), the CHIPS and Science Act (2022), and the Inflation Reduction Act (2022) collectively funded massive amounts of construction with prevailing-wage and registered-apprenticeship preferences that disproportionately benefited unionized contractors. Iron Workers were essential to virtually every major project funded under those laws — bridge replacements and rehabilitations under the Infrastructure Law, semiconductor fabs requiring extensive structural steel and reinforcing work, EV battery and electric vehicle plants, transmission infrastructure, and the broader build-out of clean energy production. Dean publicly emphasized that the federal investments mandated North American–sourced materials, reversing decades of erosion in domestic steel fabrication that had hollowed out the union's shop-fabrication membership."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="2024 – 2025" title="Bridges, Data Centers, Megaprojects" intro="The 2024–2025 period brought some of the most significant work the Iron Workers had seen in a generation, alongside specific events that highlighted both the union's continuing relevance and the dangers of the trade.">
                  <ExpandableCard
                    year="March 2024"
                    title="The Francis Scott Key Bridge Collapse"
                    summary="The container ship Dali struck a main support pier. Six maintenance workers were killed. The reconstruction is projected for 2028."
                    body="The March 2024 collapse of the Francis Scott Key Bridge in Baltimore, after the container ship Dali struck one of the bridge's main support piers, killed six construction workers who had been performing maintenance work on the bridge surface — none of them Iron Workers, but the disaster underscored the bridge-construction risks that the union's members navigate routinely. The subsequent demolition of the collapsed structure and the reconstruction of the bridge, projected to be completed in 2028 with a new design, became one of the most visible major infrastructure projects of the period and required substantial Iron Workers labor for both the demolition and the new construction."
                  />
                  <ExpandableCard
                    year="2024 – 2025"
                    title="The Data-Center Boom"
                    summary="Northern Virginia, central Texas, Phoenix, Atlanta — multi-billion-dollar campuses generated steady demand for structural steel and reinforcing work."
                    body="The data-center construction boom emerged as one of the most consistent Iron Workers employment drivers across 2024 and 2025. While data centers are not as steel-intensive per square foot as traditional skyscrapers, the scale of the projects — multi-billion-dollar campuses with multiple buildings, extensive structural steel for both buildings and supporting infrastructure, and substantial reinforcing work for foundations and slabs — generated steady demand for Iron Workers in Northern Virginia, central Texas, Phoenix, Atlanta, and other data-center hot spots. Local unions in those regions reported aggressive organizing growth and apprenticeship expansion to meet demand."
                  />
                  <ExpandableCard
                    year="2024 – 2025"
                    title="CHIPS-Funded Semiconductor Fabs"
                    summary="The Intel Ohio campus, the TSMC Arizona expansion, the Micron New York investment, and the GlobalFoundries facilities all generated significant Iron Workers employment."
                    body="CHIPS Act–funded semiconductor fabs continued to drive substantial structural steel work. The Intel Ohio campus, the TSMC Arizona expansion, the Micron New York investment, and the GlobalFoundries Vermont and New York facilities all generated significant Iron Workers employment. Stadium and arena construction continued to provide reliable union work, with major NFL, NBA, and MLB facilities under construction or major renovation across multiple cities. Bridge work — driven by the Infrastructure Law's substantial commitments to bridge replacement and rehabilitation — provided steady work in regions where state DOT projects had been backlogged for decades."
                  />
                  <ExpandableCard
                    year="2023 – 2025"
                    title="The Domestic Fabrication Revival"
                    summary="Federal Buy America provisions began reviving the domestic shop-fabrication market that foreign competition had hollowed out."
                    body="Domestic shop fabrication, which had been hollowed out by foreign competition through the 1990s and 2000s, began showing signs of revival as federal Buy America provisions in infrastructure and CHIPS funding pushed major projects toward North American–fabricated steel. The Iron Workers' organizing campaigns in fabrication shops — including a notable 2023 victory at Iron Fabrication Services in the Washington, D.C. area — leveraged this trend to bring previously non-union workers into the union."
                  />
                </Era>

                {/* PART IX */}
                <Era tag="IX" years="2025 – 2026" title="Bryenton and the Path Forward" intro="The most consequential institutional event of 2025 came on October 20, when the Iron Workers announced General President Eric Dean's retirement effective December 31, 2025. The General Executive Council unanimously elected General Secretary Kevin Bryenton as the next General President, effective January 1, 2026.">
                  <ExpandableCard
                    year="January 1, 2026"
                    title="A Toronto Ironworker at the Top"
                    summary="Bryenton began his career as an apprentice in Toronto in 1987, graduating as outstanding apprentice for his year."
                    body="Bryenton brought a substantially different background to the position than most of his predecessors. He had begun his career as an ironworker in Toronto in 1987, where he had graduated as outstanding apprentice for his year. He had served in various local and international leadership positions before being appointed General Secretary in 2024. His ascension to General President made him one of relatively few Canadians to lead a major North American building trades union, and reflected the substantial role that Canadian membership plays in the modern Iron Workers organization."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Membership Picture"
                    summary="120,000 to 130,000 active members across the U.S., Canada, Puerto Rico, and the Caribbean."
                    body="The Iron Workers report approximately 120,000 to 130,000 members across the United States and Canada, with substantially larger total membership when retirees are included. The union operates through hundreds of local unions across the United States, Canada, Puerto Rico, and the Caribbean, with significant geographic concentration in the Northeast, the upper Midwest, the West Coast, and major Canadian metropolitan areas. Members are distributed across structural steel erection (the largest single craft), reinforcing steel placement, ornamental and architectural metals, rigging and machinery moving, welding, and shop fabrication."
                  />
                  <ExpandableCard
                    year="2026"
                    title="Wages and Benefits"
                    summary="Iron Workers earn wages among the highest in the building trades, reflecting both the danger of the work and the high skill levels required."
                    body="Iron Workers earn wages that are among the highest in the building trades, reflecting both the dangerous nature of the work and the high skill levels required. Journey-level members in major metropolitan markets routinely earn six-figure annual incomes when working full schedules, with full benefits packages including the National Pension Fund (one of the largest multi-employer pension funds in the building trades), employer-paid health insurance, and apprenticeship contributions. The Bureau of Labor Statistics reports median annual wages for structural iron and steel workers across all sectors and skill levels in the $60,000–$75,000 range; union journey-level workers in major markets typically earn substantially more."
                  />
                  <ExpandableCard
                    year="2026"
                    title="Continuity, Not Reset"
                    summary="The Bryenton administration's institutional priorities have largely tracked Dean's. The transition has been described as continuity rather than strategic reset."
                    body="The Bryenton administration's institutional priorities have largely tracked Dean's: continuing the bottom-up organizing model in fabrication shops and rebar work, defending the federal labor standards built into the 2021–2022 infrastructure and industrial-policy package against rollback, expanding the apprenticeship pipeline to meet megaproject demand, and continuing the union's investments in safety standards and member services. The transition to Bryenton has been described as a continuity transition rather than a strategic reset, reflecting the General Executive Council's unanimous endorsement of the existing institutional direction."
                  />
                </Era>

                {/* CLOSING */}
                <div style={{margin:'80px 0 40px', padding:'40px', background:'linear-gradient(135deg, rgba(216,95,46,0.10), rgba(245,197,24,0.04))', border:'1px solid rgba(216,95,46,0.25)', borderRadius:20, textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#D85F2E', letterSpacing:3, textTransform:'uppercase', marginBottom:12}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'0 0 20px 0', lineHeight:1.1}}>
                    The work has changed dramatically.<br/><span className="iron-shimmer-text">The ironworkers have not.</span>
                  </h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 16px'}}>
                    When sixteen delegates met at Moorhead's Hall in February 1896 to draft a constitution, the country they imagined organizing was just beginning to construct the steel-framed cities that would define the twentieth century. The skyscraper had only recently been invented. The bridges that would connect the country's industrial economy were still being designed. And the men who did the work were dying with such regularity that the new union's first major activity was distributing burial money to widows.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 24px'}}>
                    The Iron Workers today, 130 years after Moorhead's Hall, continue to do the same essential thing: organizing the workers who erect, weld, reinforce, and finish the steel structures that hold up the buildings, the bridges, the stadiums, the chip plants, and the data centers of the modern North American economy.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#D85F2E', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(216,95,46,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}

`;

if (code.includes('{page === "history-iron" && (() => {')) {
  console.log('Skipping page insert — history-iron page already present.');
} else if (code.includes(insertAnchor)) {
  code = code.replace(insertAnchor, ironPage + insertAnchor);
  console.log('✓ Inserted Iron Workers history page render block');
  changes++;
} else {
  console.error('ERROR: trade-history insertion anchor not found.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

// ── 6. UPDATE PRERENDER SCRIPT ───────────────────────────────────────────────
if (fs.existsSync(prerenderPath)) {
  let pre = fs.readFileSync(prerenderPath, 'utf8');
  const oldPreAnchor = `  '/history-ufcw': { title: 'UFCW History · Union Pathways', description: 'The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president.' },`;
  const newPreAnchor =
`  '/history-ufcw': { title: 'UFCW History · Union Pathways', description: 'The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president.' },
  '/history-iron': { title: 'Iron Workers History · Union Pathways', description: 'The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding, through the McNamara bombings and the Golden Gate Bridge, to the 2025 transition to General President Kevin Bryenton.' },`;

  if (pre.includes("'/history-iron':")) {
    console.log('Skipping prerender update — /history-iron already in script.');
  } else if (pre.includes(oldPreAnchor)) {
    pre = pre.replace(oldPreAnchor, newPreAnchor);
    fs.writeFileSync(prerenderPath, pre);
    console.log('✓ Added /history-iron to prerender script');
    changes++;
  } else {
    console.error('WARNING: prerender script anchor not found. Iron Workers page will not have static OG tags until manual fix.');
  }
} else {
  console.log('(Skipping prerender step — scripts/generate-og-pages.mjs not found.)');
}

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx scripts/generate-og-pages.mjs && git commit -m "feat: add Iron Workers deep-dive history page with animations" && git push');
console.log('');
