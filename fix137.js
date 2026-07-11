// fix137.js
// Add the SMART (International Association of Sheet Metal, Air, Rail and
// Transportation Workers) deep-dive history page, matching the IBEW and UA
// page patterns:
//   - AnimatedNumber, ExpandableCard, PullQuote, StatBlock, Era components
//   - Steel-silver (#B0BEC5) primary accent + site-standard orange (#FA8059)
//   - 9 Era sections covering the merger of two distinct labor histories
//   - Hero stats, breadcrumb, scroll progress bar, back button
//
// Steps:
//   1. Add 'history-smart' to validPages
//   2. Add 'history-smart' entry to PAGE_META
//   3. Update App-level scrollProgress hook to check for 'smart-history-root'
//   4. Update history dropdown — promote SMART from placeholder to live page
//   5. Insert the new SMART page IIFE before the trade-history fallback

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

let changes = 0;

// ── 1. ADD 'history-smart' TO validPages ────────────────────────────────────
const oldValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
const newValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
if (code.includes(oldValidPages)) {
  code = code.replace(oldValidPages, newValidPages);
  console.log("✓ Added 'history-smart' to validPages");
  changes++;
} else if (code.includes("'history-smart'")) {
  console.log("Skipping — 'history-smart' already in validPages.");
} else {
  console.error('ERROR: validPages array not found in expected form.');
  process.exit(1);
}

// ── 2. ADD 'history-smart' TO PAGE_META ─────────────────────────────────────
const oldMeta = `      'history-ua': { title: "UA History — The Pipe Trades' Long Brotherhood · Union Pathways", desc: "The full history of the United Association from its 1889 Washington founding to today. P.J. Quinlan, the Steamfitters' War, the 1936 federal apprenticeship, the postwar peak, the Veterans in Piping program, and the LNG and data center boom." },`;
const newMeta =
`      'history-ua': { title: "UA History — The Pipe Trades' Long Brotherhood · Union Pathways", desc: "The full history of the United Association from its 1889 Washington founding to today. P.J. Quinlan, the Steamfitters' War, the 1936 federal apprenticeship, the postwar peak, the Veterans in Piping program, and the LNG and data center boom." },
      'history-smart': { title: "SMART History — Sheet, Rail, and the Air Itself · Union Pathways", desc: "The full history of SMART, the International Association of Sheet Metal, Air, Rail and Transportation Workers — from the 1888 Toledo founding of the tinsmiths' union and the parallel railroad operating brotherhoods to the 2008 merger that created modern SMART. Megaprojects, the 2024 rail bargaining reset, and the institutional logic of two crafts under one charter." },`;
if (code.includes(oldMeta)) {
  code = code.replace(oldMeta, newMeta);
  console.log("✓ Added 'history-smart' PAGE_META entry");
  changes++;
} else if (code.includes("'history-smart': { title:")) {
  console.log("Skipping — 'history-smart' PAGE_META already present.");
} else {
  console.error('ERROR: history-ua PAGE_META anchor not found.');
  process.exit(1);
}

// ── 3. UPDATE APP-LEVEL scrollProgress HOOK ─────────────────────────────────
const oldCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','benefits-root'];`;
const newCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','benefits-root'];`;
if (code.includes(oldCandidates)) {
  code = code.replace(oldCandidates, newCandidates);
  console.log("✓ Added 'smart-history-root' to scrollProgress candidates");
  changes++;
} else if (code.includes('smart-history-root')) {
  console.log("Skipping — scrollProgress already includes smart-history-root.");
} else {
  console.error('ERROR: scrollProgress candidates list not found.');
  process.exit(1);
}

// ── 4. PROMOTE SMART DROPDOWN ENTRY FROM PLACEHOLDER TO LIVE ────────────────
const oldDropdownEntry = `                    {key:'SMART', name:'SMART — Sheet Metal'},`;
const newDropdownEntry = `                    {key:'SMART', name:'SMART — Sheet Metal, Air, Rail & Transportation', page:'history-smart', live:true},`;
if (code.includes(oldDropdownEntry)) {
  code = code.replace(oldDropdownEntry, newDropdownEntry);
  console.log('✓ Promoted SMART dropdown entry to live (history-smart)');
  changes++;
} else if (code.includes("page:'history-smart'")) {
  console.log('Skipping — SMART dropdown entry already promoted.');
} else {
  console.error('ERROR: SMART dropdown entry not found in expected form.');
  process.exit(1);
}

// ── 5. INSERT THE FULL SMART PAGE BEFORE trade-history FALLBACK ─────────────
const insertAnchor = `        {page === "trade-history" && (`;

// The full SMART page block (large insertion).
const smartPage =
`        {page === "history-smart" && (() => {
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

          const ExpandableCard = ({ year, title, summary, body, accent = '#B0BEC5' }) => {
            const [open, setOpen] = useState(false);
            return (
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:'4px solid '+accent}}>
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

          const PullQuote = ({ children, attribution }) => (
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #F5C518', background:'linear-gradient(90deg, rgba(245,197,24,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#B0BEC5', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#B0BEC5', children }) => (
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
          );

          return (
            <div id="smart-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #B0BEC5, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#B0BEC5'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#B0BEC5', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>Sheet Metal · Air · Rail · Transportation</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Sheet, Rail, and<br/><span style={{color:'#B0BEC5'}}>The Air Itself.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Two unions, one charter, since 2008.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  When eleven delegates met in a Toledo hall on January 25, 1888 to draft a constitution for a national tinsmiths' union, the railroad operating brotherhoods were already two decades into their own organizing. Those two histories ran parallel for 120 years — and then, in 2008, they merged.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={230} label="Members" suffix="K" />
                  <StatBlock value={138} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={700} label="Local unions and councils" suffix="+" />
                  <StatBlock value={2008} label="Merger that built SMART" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="1860s – 1880s" title="Two Trades, Same Generation" intro="The sheet metal trade and the railroad operating crafts grew up in roughly the same generation, and both faced the same fundamental problem: an economy that was scaling faster than any local trade society could match.">
                  <ExpandableCard
                    year="post-1865"
                    title="The Galvanized Cornice Era"
                    summary="Stamped galvanized cornices and pressed metal ceilings transformed American commercial buildings."
                    body="Tin, sheet iron, and cornice work emerged as a recognizable craft in the years following the Civil War. The introduction of stamped galvanized cornices, pressed metal ceilings, and architectural sheet metal ornament transformed the visible exteriors of American commercial buildings, and the workers who installed those products developed reputations for skill and craftsmanship that local employers were willing to pay for. By the early 1880s, tinsmiths' locals had been chartered in dozens of cities — but a worker qualified in St. Louis was not automatically qualified in Cleveland. Wage scales varied wildly. Apprenticeships were inconsistent."
                  />
                  <ExpandableCard
                    year="1868–1883"
                    title="The Railroad Operating Brotherhoods"
                    summary="Order of Railway Conductors (1868), Brotherhood of Locomotive Firemen (1873), Brotherhood of Railroad Brakemen (1883)."
                    body="The railroad operating brotherhoods organized earlier and along entirely different lines. The Order of Railway Conductors of America was founded in 1868, the Brotherhood of Locomotive Firemen in 1873, the Brotherhood of Railroad Brakemen in 1883, and the Switchmen's Union of North America somewhat later. Each represented a single craft on the train — conductor, fireman, brakeman, switchman — and each operated under what would eventually become the Railway Labor Act: national bargaining, mandatory mediation, and presidential emergency boards designed to prevent the kind of nationwide rail strikes that had paralyzed the country in 1877 and 1894."
                  />
                  <ExpandableCard
                    year="1880s"
                    title="Two Industries, Same Realization"
                    summary="Local organization was no longer enough. The push toward national bodies began in both worlds."
                    body="The two trades had almost nothing in common operationally. But each generated, in its own way, a recognition that local organization was no longer sufficient — and the founding of national bodies in both worlds happened within a few years of one another in the late 1880s. That convergence in timing, even across vastly different industries, set up the parallel institutional histories that would eventually meet in 2008."
                  />
                </Era>

                {/* PART II */}
                <Era tag="II" years="1887 – 1888" title="Toledo, Kellerstrass, and the Founding" intro="The man who set the sheet metal founding in motion was Robert Kellerstrass, secretary of the Tin and Cornice Makers Association of Peoria, Illinois. He began writing to as many tinsmiths' locals as he could identify, proposing a national convention.">
                  <ExpandableCard
                    year="January 25, 1888"
                    title="Eleven Delegates, Seven Locals, Four Days"
                    summary="The Tin, Sheet Iron, and Cornice Workers' International Association is founded in Toledo, Ohio."
                    body="Eleven delegates, representing seven unaffiliated locals from Illinois, Missouri, Nebraska, Ohio, and Tennessee, met in Toledo, Ohio, for four days. On January 25, 1888, they founded the Tin, Sheet Iron, and Cornice Workers' International Association. Archibald Barnes was elected president, A. W. Chatfield secretary, and Kellerstrass himself treasurer. The American Federation of Labor — itself only two years old — granted the new body a charter in 1889."
                  />
                  <ExpandableCard
                    year="1888"
                    title="The Derby Hat Lottery"
                    summary="The Toledo local was offered Local 1. They drew Local 6 from a hat instead."
                    body="In a moment that has become local legend, the delegates offered the Toledo local Local Number 1 in recognition of its hosting the convention. The Toledo local instead drew its number from a derby hat, ending up with Local 6. The Youngstown local drew Local 5. It was the kind of small, democratic gesture that defined how the early union understood itself: no city, no faction, no founder above any other."
                  />
                  <ExpandableCard
                    year="1893 – 1899"
                    title="Collapse and Reorganization"
                    summary="The Panic of 1893 nearly killed the union. By 1896 the AFL revoked its charter. The locals refounded in 1897."
                    body="The young union grew quickly during its first five years. By 1893, it had chartered 108 local unions across the United States. Then came the Panic of 1893. The four-year depression that followed devastated the construction industry — and with it, the union. By 1896, the AFL revoked the charter on the grounds that the international body had effectively ceased to function, even as many individual locals continued to operate. The locals reorganized. In 1897, they refounded as the Amalgamated Sheet Metal Workers' International Association, and in 1899 the AFL re-chartered the new organization. The 1903 convention changed the name again to the Sheet Metal Workers' International Alliance, and the union eventually settled on the Sheet Metal Workers' International Association (SMWIA) — the name it would carry until the 2008 merger."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1909 – 1925" title="The Jurisdictional Wars" intro="The reorganized union spent its first quarter-century fighting a series of bruising jurisdictional battles with other building trades — the outcomes of which would shape its institutional culture for the rest of the century.">
                  <ExpandableCard
                    year="1909 – 1926"
                    title="The Carpenters Fight Over Interior Metal Trim"
                    summary="The Sheet Metal Workers won most of the formal rulings — and lost anyway."
                    body="As metal moldings, trim, and decorative interior elements began replacing wood in commercial buildings in the early 1900s, the United Brotherhood of Carpenters and Joiners of America claimed jurisdiction over the new metal versions of work that had traditionally belonged to wood tradesmen. The Sheet Metal Workers argued that the material — metal — placed the work squarely within their craft. An arbitration award in New York City in 1909 went to the Carpenters. The Building Trades Department of the AFL, by a 3-to-1 margin, voted in favor of the Sheet Metal Workers. AFL President Samuel Gompers intervened in favor of the Carpenters. The dispute dragged on for nearly two decades, and by 1926, the Sheet Metal Workers conceded jurisdiction over interior metal trim and moldings."
                  />
                  <ExpandableCard
                    year="1920 – 1955"
                    title="The Plumbers Fight Over Locomotive Piping"
                    summary="A 35-year jurisdictional dispute that the National Mediation Board finally resolved on April 26, 1955."
                    body="The Sheet Metal Workers had organized substantial numbers of railway locomotive fabricators and shop workers by the late 1910s. The United Association of Plumbers and Pipe Fitters argued that the piping work that went into building locomotives belonged to its jurisdiction. A 1920 conference in St. Louis attempted to resolve the matter; the federated railroad shop union that emerged from the conference disbanded in 1921, but the Amalgamated Sheet Metal Workers won substantial jurisdictional concessions. The conflict continued in modified form into the 1950s, with the National Mediation Board finally reaffirming the Sheet Metal Workers' jurisdiction over plumbing and pipefitting work in the railroad industry on April 26, 1955."
                  />
                  <ExpandableCard
                    year="1922"
                    title="The Great Railroad Shopmen's Strike"
                    summary="One of the largest strikes in U.S. history. 400,000 workers walked. A federal injunction broke it."
                    body="The Great Railroad Shopmen's Strike of 1922 saw roughly 400,000 workers walk off the job, including substantial numbers of Sheet Metal Workers' members in the railroad shops. A federal injunction issued by Attorney General Harry Daugherty effectively shut down strike support activities, and the strike collapsed. The Sheet Metal Workers' railway affiliates suffered serious losses, and the union's railroad shop presence — though rebuilt — never again reached the position it had held before the strike."
                  />
                  <ExpandableCard
                    year="1925"
                    title="24,000 Members, 440+ Locals"
                    summary="Despite the jurisdictional losses and the 1922 strike, the union grew."
                    body="By 1925, SMWIA membership had risen to roughly 24,000 across more than 440 local unions. The fights had cost the union work, but the institutional discipline of holding the line on jurisdiction — even when losing the bigger arguments — produced an organization that knew how to keep its core craft intact under sustained pressure. That institutional muscle would matter when the New Deal arrived a decade later."
                  />
                </Era>

                <PullQuote attribution="The model the founders chose">
                  Both predecessor unions invested heavily in apprenticeship and training as the foundation of bargaining power. Both built durable employer partnerships. Both maintained craft jurisdictional discipline through long jurisdictional fights with rival unions.
                </PullQuote>

                {/* PART IV */}
                <Era tag="IV" years="1925 – 1955" title="The New Deal Era and Industry-Building" intro="The Wagner Act of 1935 transformed the bargaining environment for SMWIA. The 1936 founding of SMACNA gave the union its primary employer counterpart — and during the late 1930s and 1940s, the institutional partnership that still defines the sheet metal industry today first took shape.">
                  <ExpandableCard
                    year="1927"
                    title="The Spirit of St. Louis"
                    summary="Local 206 in San Diego built major sheet metal components of Lindbergh's aircraft."
                    body="In 1927, Sheet Metal Workers Local 206 in San Diego built major components of the Spirit of St. Louis — the aircraft in which Charles Lindbergh made the first solo nonstop transatlantic flight. The work was a moment of public visibility for a trade that often did its best work hidden inside walls and behind cornices."
                  />
                  <ExpandableCard
                    year="1942 – 1945"
                    title="The Manhattan Project"
                    summary="SMWIA workers fabricated the precision sheet metal for the Oak Ridge gaseous diffusion plants."
                    body="During World War II, SMWIA members were quietly part of the wartime industrial workforce that supported the Manhattan Project. SMWIA workers fabricated the precision sheet metal components required for the gaseous diffusion plants at Oak Ridge, Tennessee, and the broader nuclear-weapons production complex. The trade's involvement in some of the most consequential industrial work of the 20th century rarely showed up in the public record — the work was classified, and the union didn't talk about it for decades after."
                  />
                  <ExpandableCard
                    year="1946"
                    title="The First Health and Welfare Plan in Construction"
                    summary="Local 28 in New York City negotiated the first H&W plan in the entire construction industry."
                    body="In 1946, Local 28 in New York City negotiated the first health and welfare plan in the construction industry. It was a pattern-setting contract that other building trades would copy over the following decade. The locked-in framework of multi-employer benefit plans — which now defines how every union construction worker gets healthcare — started here."
                  />
                  <ExpandableCard
                    year="1950"
                    title="The First Construction Pension Plan"
                    summary="Local 28 again — first in the trades, four years after H&W."
                    body="In 1950, Local 28 negotiated the first construction-industry pension plan. Together with the 1946 health plan, it established the pattern that defined union construction benefits for the next 75 years: portable, multi-employer plans that followed the worker from contractor to contractor. SMWIA expanded the model nationally with the 1966 founding of the National Pension Fund."
                  />
                  <ExpandableCard
                    year="1965"
                    title="The Searcy Disaster"
                    summary="A Titan II missile silo fire killed 53 construction and maintenance workers in Arkansas."
                    body="A 1965 fire and explosion at a Titan II missile silo near Searcy, Arkansas, killed 53 civilian construction and maintenance workers, including a number of sheet metal workers. The disaster — one of the worst single-incident losses of life in the union's history — became a foundational event in SMWIA's long-running commitment to industrial safety standards. The Sheet Metal Occupational Health Institute Trust (SMOHIT), eventually established jointly with SMACNA, traces its institutional origins to the post-Searcy era."
                  />
                </Era>

                {/* PART V */}
                <Era tag="V" years="1969 – 2000" title="The UTU and the Parallel Track" intro="While SMWIA was navigating the postwar construction economy, an entirely separate set of unions was working through its own consolidation. In 1969, four of the historic railroad operating brotherhoods merged to form the United Transportation Union.">
                  <ExpandableCard
                    year="1969"
                    title="Four Brotherhoods Become One"
                    summary="The Brotherhood of Railroad Trainmen, the Locomotive Firemen, the Order of Railway Conductors, and the Switchmen's Union merge."
                    body="In 1969, four of the historic railroad operating brotherhoods — the Brotherhood of Railroad Trainmen (founded 1883), the Brotherhood of Locomotive Firemen and Enginemen (founded 1873), the Order of Railway Conductors and Brakemen (founded 1868), and the Switchmen's Union of North America — merged to form the United Transportation Union. At its peak the UTU brought together approximately 250,000 members across Class I freight railroads, Amtrak, regional and short-line railroads, bus and mass transit systems, and (eventually) airline crafts."
                  />
                  <ExpandableCard
                    year="1970"
                    title="The IARE Joins the UTU"
                    summary="A majority African-American railroad union with deep roots in the segregated rail industry merges in."
                    body="In 1970, the International Association of Railroad Employees — a majority African-American railroad union with deep roots in the segregated railway industry — joined the UTU, ending a long-running organizational separation that had been a legacy of pre-civil rights era railroad labor. It was a quiet but consequential moment: a single union representing the operating crafts on every major North American freight carrier, regardless of where workers had originally been organized."
                  />
                  <ExpandableCard
                    year="1980 – 1990s"
                    title="Deregulation, the Caboose, and the Long Contraction"
                    summary="The 1980 Staggers Rail Act unleashed three decades of consolidation. Rail employment fell from 1.5M to under 200K."
                    body="Through the 1970s and 1980s, the UTU was central to some of the most consequential railroad labor disputes in American history: contract negotiations during the deregulation that followed the 1980 Staggers Rail Act, fights over crew consist and the elimination of the caboose in the 1980s, the slow contraction of American freight railroad employment from a peak workforce of roughly 1.5 million in the early 20th century to fewer than 200,000 by the 1990s, and recurring battles over health-care contributions, work rules, and safety regulations. The union also represented airline employees on regional carriers including Great Lakes Airlines, marking its first significant expansion outside rail."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="2005 – 2014" title="The Merger — Building SMART" intro="In 2005, SMWIA's Railroad and Shipyard Department began discussing a possible merger with the UTU. The strategic logic was substantial: a small but established sheet metal railroad-shop presence dating back to the 1900s, joined to one of the largest railroad operating unions in North America.">
                  <ExpandableCard
                    year="2005 – 2008"
                    title="Merger Negotiations and the 2008 Vote"
                    summary="A draft agreement was negotiated and ratified by both the SMWIA General Executive Council and the UTU membership."
                    body="Merger discussions accelerated through 2007, with a draft agreement negotiated and ratified by both the SMWIA General Executive Council and the UTU membership. The merger was formally approved in 2008. Both unions faced declining bargaining environments and increasing political pressure. A merged organization would have substantially greater scale, a unified political operation, shared administrative infrastructure, and broader industry footprint than either union could maintain on its own."
                  />
                  <ExpandableCard
                    year="2011"
                    title="Confirmed by Arbitration"
                    summary="The integration process took years and required arbitration to lock in."
                    body="The integration process took several years and ultimately required arbitration. In 2011, the merger was confirmed by an arbitrator's ruling, formally creating the International Association of Sheet Metal, Air, Rail and Transportation Workers — SMART. The arbitration resolved disputes over governance, treasury allocation, and the autonomy of each predecessor union within the new combined organization."
                  />
                  <ExpandableCard
                    year="2013"
                    title="AFL-CIO Charter"
                    summary="The new union was issued an official charter by the AFL-CIO in 2013."
                    body="In 2013, the AFL-CIO issued the new union an official charter. The merger preserved the operational autonomy of both predecessor unions: the Sheet Metal Division retained its existing local structure and bargaining patterns; the Transportation Division — designated SMART-TD — retained the UTU's headquarters in North Olmsted, Ohio, and its national rail-bargaining infrastructure. The two divisions share an international General President, a General Secretary-Treasurer, and a SMART Transportation President, but otherwise operate as parallel institutions under a single charter."
                  />
                  <ExpandableCard
                    year="2015"
                    title="Joseph Sellers Jr. Elected General President"
                    summary="A second-generation sheet metal worker who began as an apprentice at Local 19 in Philadelphia in 1980."
                    body="Joseph Sellers Jr. — a second-generation sheet metal worker who had begun his career as an apprentice at Local 19 in Philadelphia in 1980 — was elected SMART General President in 2015. Sellers had served as SMWIA general secretary-treasurer since 2011 and was widely credited with cementing the merger and stabilizing the new combined organization through its first decade. He was re-elected in 2019 and announced his retirement in January 2023."
                  />
                </Era>

                {/* PART VII */}
                <Era tag="VII" years="2015 – 2023" title="Reinvention and the Coleman Era" intro="The mid-2010s through early 2020s saw SMART's two divisions pursue substantially different strategic trajectories — each adapted to its own competitive environment.">
                  <ExpandableCard
                    year="2015 – 2023"
                    title="Sheet Metal Goes All-In on Megaprojects"
                    summary="Semiconductor fabs, EV battery plants, data centers, clean-energy facilities — the new generation of construction work."
                    body="The Sheet Metal Division leaned heavily into HVAC service work, energy-efficiency projects, and what the industry began calling 'megaproject' construction — the new generation of semiconductor fabrication plants, EV battery factories, data centers, and clean-energy facilities that began breaking ground in unprecedented numbers during the late 2010s. The 2009 launch of the Code of Excellence framework, jointly endorsed by SMWIA and SMACNA, became a competitive differentiator on industrial projects. The 1998 renaming of the National Training Fund to the International Training Institute reflected the union's continued investment in its joint apprenticeship system."
                  />
                  <ExpandableCard
                    year="December 2022"
                    title="The Congressional Rail Contract Imposition"
                    summary="The 2022 national rail bargaining round was resolved by Congress imposing a contract — without paid sick leave."
                    body="The Transportation Division was navigating a much more contentious bargaining environment. The 2022 national rail bargaining round produced one of the most dramatic labor disputes in modern American history, ultimately resolved by congressional action that imposed a contract on rail workers without the paid sick leave that several rail unions, including SMART-TD, had insisted upon. The episode generated enormous frustration within SMART-TD and across the broader labor movement, and helped fuel rank-and-file pressure for more aggressive bargaining in subsequent rounds."
                  />
                  <ExpandableCard
                    year="May 2023"
                    title="Coleman Elected General President"
                    summary="Michael Coleman — a SMART member since 1985 — replaces the retiring Sellers."
                    body="In May 2023, Michael Coleman — a SMART member since 1985 who had risen through Cleveland's Local 65 (later merged into Local 33) — was elected General President by the SMART General Executive Council. Coleman had served as Local 33's business manager, then as SMART's director of business and management relations, and finally as Assistant to the General President. He was re-elected in August 2024 by delegates to the Third SMART General Convention in Las Vegas. John Daniel assumed the position of General Secretary-Treasurer on July 1, 2024."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="2024 – 2025" title="The Bargaining Reset and the Megaproject Reversal" intro="The 2024–2025 period brought to the surface several long-running tensions in SMART's institutional model — even as both divisions navigated unusual bargaining and political environments.">
                  <ExpandableCard
                    year="August 2024"
                    title="The Class I Carriers Break Ranks"
                    summary="For the first time since 1963, multiple Class I railroads broke from the National Carriers' Conference Committee."
                    body="The bargaining round that began in late 2024 was unlike any in modern memory. For the first time since 1963, multiple Class I railroads broke from the National Carriers' Conference Committee — the employer association that had traditionally presented a united front in national rail bargaining — and pursued individual deals with rail unions on the property. CSX initiated the pattern in August 2024, reaching tentative agreements with the Transportation Communications Union and the Brotherhood of Railway Carmen that included high-teens compounded wage increases over five years, earlier vacation accrual, and modest health-plan improvements. BNSF and Norfolk Southern quickly followed."
                  />
                  <ExpandableCard
                    year="2024 – 2025"
                    title="Union Pacific Goes Bilateral"
                    summary="UP declined to participate in national bargaining at all, opting for direct deals with SMART-TD."
                    body="Union Pacific declined to participate in the national bargaining process at all, opting instead for bilateral negotiations with SMART-TD's General Committees of Adjustment. SMART-TD members on Union Pacific overwhelmingly ratified a five-year agreement in November 2025 with substantial wage increases and resolution of long-running issues including a controversial Union Pacific practice of deducting outside earnings from arbitration awards."
                  />
                  <ExpandableCard
                    year="October 2025"
                    title="The National Agreement Ratifies"
                    summary="High-teens compounded wage increases over five years. Two-person crew protections preserved at the contract level."
                    body="After nine months of negotiations, SMART-TD voting members ratified a new five-year National Agreement in late October 2025 that delivered substantial wage gains, enhanced healthcare benefits, accelerated vacation accrual for new hires, and the preservation of two-person crew protections at the contract level. Under the Biden administration, the Federal Railroad Administration had mandated two-person crews on most freight trains — a longstanding union demand. SMART-TD's contract preserved that requirement for at least five years. But Project 2025 explicitly targeted the rule, and rank-and-file rail labor activists have continued to press for federal legislation that would make the requirement permanent regardless of administration. The bipartisan Railway Safety Act of 2026, introduced in the U.S. Senate, is the most prominent vehicle for that effort."
                  />
                  <ExpandableCard
                    year="2025"
                    title="$24B in Canceled Megaprojects"
                    summary="The 2025 reconciliation bill cut clean-energy tax credits. Project cancellations cascaded."
                    body="The 2025 federal policy reversal cut sharply against the megaproject trajectory. The 2025 reconciliation bill eliminated or curtailed several of the clean-energy tax credits and infrastructure funding programs that had driven the megaproject boom. The Allston Multimodal Project in Massachusetts had $327 million in federal funding pulled, jeopardizing more than 3,000 anticipated union jobs. SanDisk's $3 billion Mundy Township semiconductor plant in Michigan was canceled. Cleveland-Cliffs canceled a $500 million hydrogen-conversion project in Middletown, Ohio. By late 2025, SMART was tracking nearly $24 billion in canceled clean-energy megaprojects, with as many as 21,000 union construction and manufacturing jobs lost or delayed."
                  />
                </Era>

                {/* PART IX */}
                <Era tag="IX" years="2025 – 2026" title="Where SMART Stands Now" intro="Walking into 2026, SMART occupies a position of significant contrast: substantial bargaining wins on the rail side, an uneven megaproject environment on the sheet metal side, and a political operation working multiple fronts at once to defend the labor standards built into legislation now under sustained rollback pressure.">
                  <ExpandableCard
                    year="2026"
                    title="The Membership Picture"
                    summary="Approximately 230,000 members across 700+ locals in the U.S., Canada, and Puerto Rico."
                    body="SMART reports approximately 230,000 members across roughly 700 local unions and councils in the United States, Canada, and Puerto Rico. The Sheet Metal Division accounts for the majority of members across approximately 185 local unions; the Transportation Division accounts for the balance across more than 500 locals. SMART-TD is one of the largest railroad operating unions in North America, representing employees on every Class I railroad as well as many regional and short-line carriers, plus approximately 45 bus and transit systems and a growing footprint in airline crafts."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The CPKC Eight-Year Deal"
                    summary="A distinctive long-horizon agreement on the merged Canadian Pacific–Kansas City Southern network."
                    body="The CPKC tentative agreement, reached in early 2026, was particularly distinctive: an eight-year term — three years longer than the standard 'pattern' agreements at other carriers — with a substantial General Wage Increase reported in the low-30-percent range over the life of the agreement. The deal was intended to provide longer-term stability for members on the recently merged Canadian Pacific–Kansas City Southern network. Members began voting on the agreement on April 29, 2026."
                  />
                  <ExpandableCard
                    year="April 2026"
                    title="Coleman on the Hill"
                    summary="The General President defends the labor and tax provisions of the 2021–2022 industrial-policy package."
                    body="The Coleman administration's 2025–2026 political work has been defined by a sustained defense of the labor and tax provisions in the 2021–2022 federal infrastructure and industrial-policy package against rollback. SMART has lobbied actively to preserve Section 179D energy-efficiency tax deductions, the 25C and 25D residential clean-energy credits, registered apprenticeship requirements, and prevailing-wage standards in remaining federal funding streams. Coleman has appeared regularly before the Congressional Labor Caucus — including a notable appearance on April 15, 2026 — and has worked closely with NABTU and other building trades unions to coordinate the broader response."
                  />
                  <ExpandableCard
                    year="2026"
                    title="What Hasn't Changed"
                    summary="The CHIPS pipeline, data center construction, and the joint training infrastructure all remain robust."
                    body="The CHIPS Act–funded semiconductor pipeline remains robust, with major Intel, TSMC, GlobalFoundries, and Micron projects continuing to produce sustained sheet metal demand. Data center construction, driven by AI and cloud computing demand, has emerged as a particularly reliable SMART work driver. The Sheet Metal Division's apprenticeship and training infrastructure — the International Training Institute, the National Energy Management Institute, the Sheet Metal Occupational Health Institute Trust (SMOHIT), and the joint labor-management partnerships institutionalized through SMACNA — remain among the most respected in North American construction."
                  />
                </Era>

                {/* CLOSING */}
                <div style={{margin:'80px 0 40px', padding:'40px', background:'linear-gradient(135deg, rgba(176,190,197,0.08), rgba(250,128,89,0.04))', border:'1px solid rgba(176,190,197,0.2)', borderRadius:20, textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#B0BEC5', letterSpacing:3, textTransform:'uppercase', marginBottom:12}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'0 0 20px 0', lineHeight:1.1}}>
                    Two crafts. One charter.<br/><span style={{color:'#B0BEC5'}}>The institutional logic is unchanged.</span>
                  </h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 16px'}}>
                    When eleven delegates met in a Toledo hall in January 1888 to draft a constitution for a national tinsmiths' union, the country they imagined organizing did not yet exist. Most American cities had no electrical service. Most commercial buildings had no air conditioning. Most homes had coal stoves rather than central heating.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 24px'}}>
                    SMART today, 138 years after that small founding convention and 18 years after the merger that created the modern organization, continues to do the same essential thing its predecessors did: organizing the workers who build the air the country breathes and move the goods and people the country depends on.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#B0BEC5', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(176,190,197,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}

`;

if (code.includes('{page === "history-smart" && (() => {')) {
  console.log('Skipping page insert — history-smart page already present.');
} else if (code.includes(insertAnchor)) {
  code = code.replace(insertAnchor, smartPage + insertAnchor);
  console.log('✓ Inserted SMART history page render block');
  changes++;
} else {
  console.error('ERROR: trade-history insertion anchor not found.');
  process.exit(1);
}

fs.writeFileSync(path, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add SMART deep-dive history page (sheet metal + transportation)" && git push');
console.log('');
