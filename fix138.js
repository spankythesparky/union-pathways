// fix138.js
// Add the BAC (International Union of Bricklayers and Allied Craftworkers)
// deep-dive history page, matching the IBEW / UA / SMART pattern:
//   - AnimatedNumber, ExpandableCard, PullQuote, StatBlock, Era components
//   - Brick-red (#C04A36) primary accent + site-standard orange (#FA8059)
//   - 9 Era sections covering 1820s pre-BAC era through 2026
//   - Hero stats, breadcrumb, scroll progress bar, back button
//
// Steps:
//   1. Add 'history-bac' to validPages
//   2. Add 'history-bac' entry to PAGE_META
//   3. Update App-level scrollProgress hook to check for 'bac-history-root'
//   4. Update history dropdown — promote BAC from placeholder to live page
//   5. Insert the new BAC page IIFE before the trade-history fallback

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

let changes = 0;

// ── 1. ADD 'history-bac' TO validPages ──────────────────────────────────────
const oldValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
const newValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','history-bac','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
if (code.includes(oldValidPages)) {
  code = code.replace(oldValidPages, newValidPages);
  console.log("✓ Added 'history-bac' to validPages");
  changes++;
} else if (code.includes("'history-bac'")) {
  console.log("Skipping — 'history-bac' already in validPages.");
} else {
  console.error('ERROR: validPages array not found in expected form.');
  process.exit(1);
}

// ── 2. ADD 'history-bac' TO PAGE_META ───────────────────────────────────────
const oldMeta = `      'history-smart': { title: "SMART History — Sheet, Rail, and the Air Itself · Union Pathways", desc: "The full history of SMART, the International Association of Sheet Metal, Air, Rail and Transportation Workers — from the 1888 Toledo founding of the tinsmiths' union and the parallel railroad operating brotherhoods to the 2008 merger that created modern SMART. Megaprojects, the 2024 rail bargaining reset, and the institutional logic of two crafts under one charter." },`;
const newMeta =
`      'history-smart': { title: "SMART History — Sheet, Rail, and the Air Itself · Union Pathways", desc: "The full history of SMART, the International Association of Sheet Metal, Air, Rail and Transportation Workers — from the 1888 Toledo founding of the tinsmiths' union and the parallel railroad operating brotherhoods to the 2008 merger that created modern SMART. Megaprojects, the 2024 rail bargaining reset, and the institutional logic of two crafts under one charter." },
      'history-bac': { title: "BAC History — The Trowel and the Long Memory · Union Pathways", desc: "The full history of the International Union of Bricklayers and Allied Craftworkers from its 1865 Philadelphia founding to today. The oldest continuously operating trade union in North America. John A. White, Harry Bates and the AFL-CIO unity, the postwar golden age, the long decline of structural masonry, and the modern restoration economy." },`;
if (code.includes(oldMeta)) {
  code = code.replace(oldMeta, newMeta);
  console.log("✓ Added 'history-bac' PAGE_META entry");
  changes++;
} else if (code.includes("'history-bac': { title:")) {
  console.log("Skipping — 'history-bac' PAGE_META already present.");
} else {
  console.error('ERROR: history-smart PAGE_META anchor not found.');
  process.exit(1);
}

// ── 3. UPDATE APP-LEVEL scrollProgress HOOK ─────────────────────────────────
const oldCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','benefits-root'];`;
const newCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','benefits-root'];`;
if (code.includes(oldCandidates)) {
  code = code.replace(oldCandidates, newCandidates);
  console.log("✓ Added 'bac-history-root' to scrollProgress candidates");
  changes++;
} else if (code.includes('bac-history-root')) {
  console.log("Skipping — scrollProgress already includes bac-history-root.");
} else {
  console.error('ERROR: scrollProgress candidates list not found.');
  process.exit(1);
}

// ── 4. PROMOTE BAC DROPDOWN ENTRY FROM PLACEHOLDER TO LIVE ──────────────────
const oldDropdownEntry = `                    {key:'BAC', name:'BAC — Bricklayers'},`;
const newDropdownEntry = `                    {key:'BAC', name:'BAC — Bricklayers & Allied Craftworkers', page:'history-bac', live:true},`;
if (code.includes(oldDropdownEntry)) {
  code = code.replace(oldDropdownEntry, newDropdownEntry);
  console.log('✓ Promoted BAC dropdown entry to live (history-bac)');
  changes++;
} else if (code.includes("page:'history-bac'")) {
  console.log('Skipping — BAC dropdown entry already promoted.');
} else {
  console.error('ERROR: BAC dropdown entry not found in expected form.');
  process.exit(1);
}

// ── 5. INSERT THE FULL BAC PAGE BEFORE trade-history FALLBACK ───────────────
const insertAnchor = `        {page === "trade-history" && (`;

const bacPage =
`        {page === "history-bac" && (() => {
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

          const ExpandableCard = ({ year, title, summary, body, accent = '#C04A36' }) => {
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
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#C04A36', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#C04A36', children }) => (
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
            <div id="bac-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #C04A36, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#C04A36'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#C04A36', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The International Union of Bricklayers and Allied Craftworkers</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  The Trowel and<br/><span style={{color:'#C04A36'}}>The Long Memory.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Founded in Philadelphia, October 1865.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  The work is older than the country. The trowel, the level, the plumb line — the bricklayer's tools have changed remarkably little in two thousand years. What changed, repeatedly and dramatically, was the legal and economic position of the men and women who did the work. The institution that emerged in October 1865 to defend that position has now outlasted every other continuously operating labor organization on the continent.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={75} label="Active members" suffix="K" />
                  <StatBlock value={161} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={1865} label="Year of founding" />
                  <StatBlock value={1} label="Oldest continuously operating union in North America" suffix="" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="1820s – 1860s" title="Stonecutters and Masons Before the BAC" intro="The trowel trades organized themselves in North America earlier than most other crafts. The work was both highly skilled and highly mobile. Master masons traveled from city to city following major construction projects, and the practice of taking on apprentices and journeymen had been a continuous tradition across centuries.">
                  <ExpandableCard
                    year="1823"
                    title="The Ten-Hour Day in New York"
                    summary="Journeyman stonecutters in NYC strike in support of the ten-hour workday — a foundational demand of 19th-century American labor."
                    body="The earliest documented strikes by trowel-trades workers in North America predate the BAC by more than four decades. In 1823, journeyman stonecutters in New York City struck in support of the ten-hour workday — one of the foundational demands of nineteenth-century American labor. In 1835, masons in Troy, New York, struck for higher wages. Through the 1830s and 1840s, similar local actions multiplied across the cities of the eastern seaboard, the Ohio Valley, and the rapidly growing port cities of the Great Lakes."
                  />
                  <ExpandableCard
                    year="1850s"
                    title="The Canadian Parallel"
                    summary="Toronto, Montreal, and Hamilton developed durable mason and bricklayer organizations through the 1850s."
                    body="In Canada, trowel-trades organization developed in parallel with the U.S. Through the 1850s, craft unions across the major Canadian cities gained strength as employers attempted to dismantle the existing wage system and undermine craftworkers' standards of living. Toronto, Montreal, and Hamilton all developed durable local mason and bricklayer organizations during this period. The cross-border organizing pattern would shape the BAC's founding charter sixteen years later."
                  />
                  <ExpandableCard
                    year="1857"
                    title="The Panic Wipes Out a Generation of Locals"
                    summary="The Panic of 1857 erased most of the unions built during the previous two decades."
                    body="The Panic of 1857 — a sharp financial crisis that triggered widespread unemployment, business failures, and downward wage pressure — wiped out most of the unions that had been built during the previous two decades. Trade unions across both the United States and Canada either folded entirely or reduced themselves to small local mutual-aid societies. For a brief period it appeared that the long arc of nineteenth-century craft organizing had been broken."
                  />
                  <ExpandableCard
                    year="1863 – 1865"
                    title="Wartime Recovery"
                    summary="Construction demand and labor shortages drove wages upward. Bricklayer unions began re-forming city by city."
                    body="The recovery began before the Civil War ended. Beginning around 1863, as wartime construction demand and labor shortages drove wages upward and gave workers leverage they had not had in years, bricklayer unions began re-forming in city after city. Locals were established in New York City, Brooklyn, Baltimore, Providence, Pittsburgh, Boston, St. Louis, and across New Jersey. By the autumn of 1865, with the war over and the country entering a sustained construction boom, leaders of those locals had begun to discuss what nineteenth-century unionists called the 'amalgamation' of their separate organizations into a single national body."
                  />
                </Era>

                {/* PART II */}
                <Era tag="II" years="October 1865" title="Philadelphia and the BMPIU" intro="The convention that produced today's BAC met in Philadelphia in October 1865. The delegates represented bricklayer locals from across the major eastern and midwestern cities, drawn together by the same recognition that had been forming for two years: that local organization alone was no longer enough.">
                  <ExpandableCard
                    year="October 17, 1865"
                    title="John A. White and the BMPIU's First Charter"
                    summary="The Bricklayers, Masons and Plasterers International Union of America is founded. John A. White of the Baltimore local is elected first President."
                    body="On October 17, 1865, the delegates formally established the Bricklayers, Masons and Plasterers International Union of America (BMPIU), and elected John A. White, a member of the Baltimore, Maryland local, as the union's first President. The formation of the BMPIU placed the trowel trades among the very first national craft unions in North America. The organization predated the American Federation of Labor by 21 years and the International Brotherhood of Electrical Workers by 26. The Knights of Labor would not be founded for four more years."
                  />
                  <ExpandableCard
                    year="1865"
                    title="The Founding Principles"
                    summary="A transnational scope, a clearance card system, and a heavy investment in apprenticeship — set from the very first charter."
                    body="The BMPIU's founding principles set the institutional pattern that would define the union for the next 160 years. The new international claimed jurisdiction over all bricklaying and masonry work performed for compensation in the United States and Canada — a transnational scope that was unusual for the era. It established a clearance card system that allowed members traveling between localities to work under union conditions in any jurisdiction. It made the protection of craft skill, through standardized apprenticeship and training, a central institutional priority. And it committed, at least in principle, to representing the entire trowel trades workforce — a commitment that would be tested and expanded over the following century as related crafts joined the organization."
                  />
                  <ExpandableCard
                    year="1881"
                    title="The First Canadian Locals"
                    summary="Hamilton and Toronto, Ontario become the BMPIU's first chartered Canadian locals."
                    body="The first Canadian locals were chartered in Hamilton and Toronto, Ontario, in 1881, formally extending the international's reach across the border. By the 1880s, the BMPIU had become one of the most stable and institutionally established craft unions in North America, with a scope and reach that very few of its peers could match."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1865 – 1916" title="The Gilded Age, Names, and Race" intro="The first half-century of BMPIU history was defined by the same forces that shaped every American craft union of the era: rapid industrialization, employer resistance, jurisdictional fights with rival organizations, and the slow construction of institutional infrastructure that could outlast individual leaders and economic cycles.">
                  <ExpandableCard
                    year="1884 / 1910 / 1995"
                    title="The Long Pattern of Name Changes"
                    summary="The trowel trades' shifting boundaries produced repeated institutional renaming."
                    body="The union changed its name twice in this period to reflect its expanding membership. In 1884, it became the Bricklayers and Masons International Union, dropping the explicit reference to plasterers as the relationship with that craft evolved. In 1910, the name changed again to the Bricklayers, Masons, and Plasterers International Union, reincorporating the plasterers after a period of jurisdictional realignment. These changes reflected an ongoing reality of trowel-trades organizing: the boundaries between bricklaying, stone masonry, plastering, tile setting, and cement work were never clean, and different periods produced different working arrangements among the related crafts."
                  />
                  <ExpandableCard
                    year="1916"
                    title="A Late AFL Affiliation"
                    summary="The BMPIU operated as an independent international for thirty years before formally joining the AFL."
                    body="The relationship with the American Federation of Labor was complicated for several decades. The BMPIU operated for many years as an independent international, working alongside but not formally affiliated with the AFL that Samuel Gompers had founded in 1886. The union finally affiliated with the AFL in 1916 — relatively late by the standards of the major building trades — bringing one of the largest and oldest North American craft unions into the federation's structure."
                  />
                  <ExpandableCard
                    year="late 1800s"
                    title="A Departure from the Broader Labor Movement"
                    summary="As Jim Crow segregation hardened across the AFL, the BMPIU admitted Southern locals without imposing racial restrictions."
                    body="In the late nineteenth century, when many American craft unions were reorganizing themselves to formally exclude Black workers from membership — a practice that became widespread across the building trades during the rise of Jim Crow segregation — the BMPIU went the other direction. The union admitted locals representing workers in Southern states without imposing racial restrictions, a stance that put it at odds with much of the broader white-led labor movement of the era. The historical record on this is uneven and varies by locality, and the union's actual practice did not always match its formal policy. But the institutional commitment, however imperfect, was unusual for the period and shaped the union's culture in ways that distinguished it from many of its building-trades peers."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="1935 – 1960" title="The Bates Era" intro="Harry Bates became president of the BMPIU in 1935, at the depth of the Great Depression. His twenty-five-year tenure transcended the Wagner Act, World War II, the Taft-Hartley Act, the postwar construction boom, and the AFL-CIO merger.">
                  <ExpandableCard
                    year="1937"
                    title="The U.S. Housing Act"
                    summary="Bates helped pass the foundational federal legislation establishing public housing and low-cost worker housing."
                    body="Bates helped pass the U.S. Housing Act of 1937, the foundational piece of federal legislation establishing the framework for public housing and low-cost worker housing in the United States. The work reflected a broader posture defining his presidency: shaping federal policy directly rather than waiting for it to be done to the union."
                  />
                  <ExpandableCard
                    year="1941 – 1945"
                    title="WWII Defense Construction and the Seabees"
                    summary="Bates pushed to ensure defense construction during WWII would be performed under union conditions, and helped develop the Navy's Construction Battalion."
                    body="Bates pushed to make fair labor standards a core part of U.S. defense policy in the years before and during World War II, and successfully negotiated to ensure that the overwhelming majority of major defense construction during the war would be performed by union members. He participated in the development of the Seabees, the U.S. Navy's Construction Battalion, which during World War II built the airfields, port facilities, and infrastructure that supported the Pacific campaign."
                  />
                  <ExpandableCard
                    year="December 1955"
                    title="Chairing the AFL-CIO Unity Committee"
                    summary="Bates chaired the convention that ratified the merger ending two decades of formal division within American labor."
                    body="Bates's most lasting institutional contribution came in 1955, when he served as Chair of the Unity Committee that negotiated the merger of the American Federation of Labor and the Congress of Industrial Organizations into the AFL-CIO. The merger, ratified in December 1955, ended two decades of formal division within the American labor movement and created the federation that has remained the principal structure of organized labor ever since. Bates's role chairing the convention that voted on the merger placed him at the center of one of the most consequential institutional decisions in twentieth-century American labor."
                  />
                  <ExpandableCard
                    year="1950s"
                    title="The Full Trowel-Trades Jurisdiction Takes Shape"
                    summary="Bricklayers, stone and marble masons, cement masons, plasterers, tile layers, terrazzo workers, pointers, cleaners, and caulkers."
                    body="By the 1950s, BMPIU membership had grown to encompass not just bricklayers but also stone and marble masons, cement masons, plasterers, tile layers, terrazzo and mosaic workers, and pointers, cleaners, and caulkers — substantially the same craft jurisdictions the union represents today. The union had become the institutional home of the entire trowel-trades industry across North America, with a scope and reach that its founders in 1865 could only have imagined."
                  />
                </Era>

                <PullQuote attribution="The trowel is older than the country">
                  The union that wields it has now outlasted nearly everything else in North American organized labor.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="1945 – 1970s" title="The Postwar Golden Age" intro="The quarter-century following World War II was the high point of trowel-trades employment in North America. Postwar suburban expansion, the interstate highway program, the cold-war defense build-up, and the continued use of brick, block, and stone as primary structural materials in commercial construction all drove sustained demand for BAC labor.">
                  <ExpandableCard
                    year="postwar"
                    title="The IMI is Born"
                    summary="The International Masonry Institute is established as a labor-management cooperative with BAC's signatory contractors."
                    body="The institutional infrastructure of the modern union was built during this period. The International Masonry Institute (IMI) was established as a labor-management cooperative between BAC and its signatory contractors, with funding from collectively bargained employer contributions and a mission to develop and conduct apprenticeship, training, and safety programs for the entire industry. The model — joint labor-management training, with funding driven by the contract — became one of the most respected institutional partnerships in North American construction."
                  />
                  <ExpandableCard
                    year="1947"
                    title="The Taft-Hartley Damage"
                    summary="Closed shop banned, right-to-work laws authorized, secondary boycotts restricted — but the BAC's institutional anchoring held."
                    body="The 1947 Taft-Hartley Act imposed real costs on the union, as it did on every American building trade. The closed shop was banned, state right-to-work laws were authorized, and secondary boycott activity was restricted. But the BAC's deep institutional anchoring in the trowel trades — its dominance of the labor supply for skilled masonry work, its IMI training infrastructure, and its long-established relationships with masonry contractor associations — gave it structural advantages that survived the new legal framework. Through the 1950s and 1960s, BAC contractors continued to dominate skilled trowel-trades work across most of the country, with non-union competition concentrated primarily in residential construction and in regions of the South where right-to-work laws had taken hold."
                  />
                  <ExpandableCard
                    year="postwar"
                    title="The International Apprentice Contest"
                    summary="A culture of public skill demonstration that still defines the union's identity."
                    body="The annual BAC/IMI International Apprentice Contest, which today brings dozens of top apprentices from across the United States and Canada to compete in masonry skill demonstrations, dates from this institutional build-out. It remains one of the most distinctive cultural events in North American construction — a public, competitive performance of craft skill that very few other building trades have institutionalized to the same degree."
                  />
                  <ExpandableCard
                    year="1960s onward"
                    title="The Long Decline of Structural Masonry Begins"
                    summary="Steel-frame construction, glass curtain walls, and panelized exterior systems started replacing structural masonry."
                    body="Trowel-trades employment began declining as a share of total construction employment during the 1960s and accelerated through the 1970s, as steel-frame construction, glass curtain walls, and panelized exterior systems began replacing structural masonry in commercial buildings. The BAC's response would define its institutional posture for the next several decades: hold the high-skill end of the market, invest aggressively in training, and accept a smaller but more durable membership rather than chase volume in segments where the underlying construction economics had moved against the trade."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="1970s – 2000s" title="Decline, Restructuring, and the New Name" intro="The pressures that battered every American building-trades union through the late twentieth century hit the BAC particularly hard — and the union's response, focused on consolidation and reinvestment in training, defined its modern institutional posture.">
                  <ExpandableCard
                    year="1970s – 1990s"
                    title="Steel Frames, Curtain Walls, and Open-Shop Pressure"
                    summary="Architectural fashion and engineering economics moved decisively away from structural masonry."
                    body="Through the 1970s, 1980s, and 1990s, architectural fashion and engineering economics moved decisively toward thinner exterior wall systems, prefabricated panels, and non-masonry materials. The work that remained for trowel-trades craftworkers was increasingly concentrated in restoration of older masonry structures, high-end architectural work, institutional construction, and specialty applications. The rise of the open-shop construction movement — organized through the Associated Builders and Contractors, founded in 1950 but expanding aggressively from the 1970s onward — eroded BAC's market share in residential and light commercial construction. Foreign competition in stone, marble, and tile imports added additional pressure."
                  />
                  <ExpandableCard
                    year="1981"
                    title="PATCO and Its Aftermath"
                    summary="The political environment shifted decisively against organized labor across the building trades."
                    body="The 1981 PATCO strike — and the political environment it inaugurated — cut against organized labor across the building trades. The Reagan administration's decision to fire striking air traffic controllers signaled a new federal posture toward unions that would shape the bargaining environment for the next several decades. For the BAC, like for every other building-trades union, the question became how to defend institutional ground in a country where the political assumption that skilled construction work would be done under union conditions could no longer be relied upon."
                  />
                  <ExpandableCard
                    year="1980s – 1990s"
                    title="Consolidation Into ADCs, Renewed Investment in IMI"
                    summary="Local unions across multiple regions merged into Administrative District Councils."
                    body="The union's response was institutional consolidation and a renewed investment in training. Local unions across multiple regions were merged into Administrative District Councils, reducing administrative overhead and pooling bargaining and training resources. The IMI was expanded and modernized, with new emphasis on architectural restoration, energy-efficient building envelopes, and the high-end finish work that had become increasingly central to the union's market position."
                  />
                  <ExpandableCard
                    year="1995"
                    title="A New Name and Gender-Neutral Language"
                    summary="The name changes from BMPIU to International Union of Bricklayers and Allied Craftworkers."
                    body="The 1995 name change — from Bricklayers, Masons, and Plasterers International Union to International Union of Bricklayers and Allied Craftworkers — reflected both the union's broader craft jurisdiction and its formal transition from gendered language ('craftsmen' to 'craftworkers'), accompanied by a 1995 resolution requiring gender-neutral language in all union documents."
                  />
                  <ExpandableCard
                    year="2000"
                    title="The Canadian Congress"
                    summary="The BAC formalized institutional voice for its Canadian membership."
                    body="In 2000, the BAC established its Canadian Congress to give Canadian members a stronger institutional voice in international affairs, recognizing that the union's Canadian membership had developed sufficient scale and distinct interests to warrant formal representation within the international structure. The five-region structure (Northeast, North Central, South, West, and Canada) that defines the BAC today emerged from this period."
                  />
                </Era>

                {/* PART VII */}
                <Era tag="VII" years="2010 – 2019" title="The Boland Era — Modern Reinvention" intro="James Boland — a native of Ireland who had immigrated to the United States in 1970 and joined the BAC in 1977 after working in the San Francisco Bay Area in brick, block, stone, and marble work — became the union's 25th International President in February 2010.">
                  <ExpandableCard
                    year="February 2010"
                    title="A Strategic Pivot to Restoration and Specialty"
                    summary="Boland repositioned the BAC for an industry where structural masonry would never again dominate."
                    body="Boland's tenure was defined by a deliberate effort to reposition the BAC for a construction economy in which traditional structural masonry would never again be the dominant building system, but in which masonry restoration, architectural finish work, and specialty applications could provide a stable foundation for a smaller but more skilled workforce. His strategic emphasis was on coalition-building with management partners and community groups to expand work prospects for BAC members and signatory contractors."
                  />
                  <ExpandableCard
                    year="2010s"
                    title="The Green Building Pitch"
                    summary="Masonry's role in energy-efficient construction and thermal mass building systems became a major messaging priority."
                    body="The IMI's training programs were expanded and modernized. The union's 'green building' capabilities — masonry's substantial role in energy-efficient construction, thermal mass building systems, and durable, low-embodied-energy construction — were promoted aggressively. Customized education programs were developed for design professionals, signatory contractors, and craftworkers, recognizing that the future of skilled trowel-trades work would depend on the union's ability to serve as the industry's authoritative source of expertise."
                  />
                  <ExpandableCard
                    year="2010s"
                    title="Working Families United"
                    summary="The BAC joined an immigrant workers' coalition with UNITE HERE, IUPAT, UFCW, and the Iron Workers."
                    body="The BAC also became active in coalition labor advocacy during this period. The union joined Working Families United, an immigrant workers' advocacy coalition that included UNITE HERE, the International Union of Painters and Allied Trades (IUPAT), the United Food and Commercial Workers (UFCW), and the Iron Workers — a recognition of the substantial role of immigrant workers in the modern trowel-trades workforce. The BAC also publicly endorsed the Rebuild America's Schools Act, which would have created substantial public-school construction work funded with prevailing-wage and registered-apprenticeship requirements."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="2020 – 2024" title="The Driscoll Era — Apprenticeship to Degree" intro="Timothy J. Driscoll — a second-generation bricklayer who had joined BAC Local 3 in Massachusetts as an apprentice in 1985 and earned his journeyman card in 1988 — became the union's 26th International President effective January 1, 2020. He brought to the presidency an unusual combination of field experience, government-relations work, and trade jurisdiction expertise.">
                  <ExpandableCard
                    year="September 2020"
                    title="The First Virtual Convention"
                    summary="COVID-19 forced the BAC's first virtual international convention. Delegates extended Driscoll's mandate."
                    body="At the BAC's first virtual convention in September 2020 — held remotely because of the COVID-19 pandemic — delegates unanimously voted to extend the Executive Board to a new five-year term, formalizing Driscoll's mandate. The pandemic itself reshaped how the union conducted internal business; many of the digital infrastructure investments made in 2020 have since become permanent."
                  />
                  <ExpandableCard
                    year="2021 – 2024"
                    title="Apprenticeship to Degree Pathways"
                    summary="New partnerships with community colleges and universities to give BAC apprentices accredited postsecondary degrees alongside their trade credentials."
                    body="The Driscoll administration deepened the union's apprenticeship and training infrastructure, including new partnerships with community colleges and universities to provide BAC apprentices with pathways to associate's and bachelor's degrees alongside their trade credentials. The 2026 partnership between BAC, the New Jersey Institute of Technology, and Hudson County Community College — which created an apprenticeship-to-degree pathway specifically for BAC members — is the most prominent recent example, but similar partnerships have been developed in multiple other regions."
                  />
                  <ExpandableCard
                    year="2021 – 2022"
                    title="BIL, CHIPS, and IRA Leverage"
                    summary="Federal infrastructure and industrial-policy legislation funded substantial public construction with prevailing-wage and apprenticeship requirements."
                    body="The Bipartisan Infrastructure Law (2021), the CHIPS and Science Act (2022), and the Inflation Reduction Act (2022) collectively funded substantial public construction with prevailing-wage and registered-apprenticeship requirements. While the trowel trades capture a smaller share of megaproject work than the mechanical trades — semiconductor fabs and data centers require less structural masonry than they do piping or electrical infrastructure — federal-funded school construction, transit and infrastructure work, and institutional building have provided meaningful pipelines for BAC labor."
                  />
                  <ExpandableCard
                    year="2024"
                    title="The NYC $7B PLA Commitment"
                    summary="A major win for the BAC and the broader building trades in a city where masonry remains a substantial component of construction."
                    body="The 2024 New York City commitment to perform $7 billion in city construction projects under union project labor agreements — announced during the Adams administration — was a major win for BAC and the broader building trades, securing trowel-trades work on hospitals, schools, transit infrastructure, and public buildings in a city where masonry remains a substantial component of construction. Similar PLA expansions have been pursued at the state and municipal level across multiple jurisdictions."
                  />
                </Era>

                {/* PART IX */}
                <Era tag="IX" years="2025 – 2026" title="Where BAC Stands Now" intro="The 2025 change in federal administration produced significant headwinds for BAC's strategic agenda. But the institutional foundations the union has built across 161 years remain intact — and the work that 2026 demands continues to require the skilled labor BAC has organized since 1865.">
                  <ExpandableCard
                    year="2025"
                    title="The Federal Policy Reversal"
                    summary="The 2025 reconciliation bill curtailed funding programs and tax credits driving public-construction work. The June 2025 OMB guidance weakened PLA preferences."
                    body="The 2025 reconciliation bill curtailed several of the federal funding programs and tax credits that had been driving public-construction work under prevailing-wage requirements. The administration's June 2025 Office of Management and Budget guidance making project labor agreement preferences 'encouraged but not required' on federal construction projects over $35 million weakened the policy framework that had been steering federal-funded work toward unionized trowel-trades contractors. State-level rollbacks in some jurisdictions added additional pressure. In September 2025, BAC publicly condemned what it described as Missouri state government attacks on democratic institutions to advance anti-worker legislation."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Membership Picture"
                    summary="Approximately 75,000 active members across the U.S. and Canada, organized into local unions and Administrative District Councils across five regions."
                    body="BAC reports approximately 75,000 active members across the United States and Canada, with a substantial additional retiree population covered by the union's pension and health funds. The union is structured into local unions and Administrative District Councils across five regions — Northeast, North Central, South, West, and Canada — with the Canadian membership represented through the Canadian Congress established in 2000. Wages for journey-level workers in major markets and on industrial projects are substantially above the median for masonry workers nationally, plus full benefits packages including the Bricklayers and Trowel Trades International Pension Fund (which Driscoll co-chairs), the International Health Fund, and apprenticeship contributions through the IMTEF."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The IMI/IMTEF Pipeline"
                    summary="The 2025 International Apprentice Contest featured 80 competitors. The training infrastructure remains the union's strongest competitive differentiator."
                    body="The IMI and IMTEF (International Masonry Training and Education Foundation) together constitute one of the most respected training infrastructures in North American construction. The five-year apprenticeship combines classroom instruction with paid on-the-job training, follows registered-apprenticeship standards, and produces journey-level credentials recognized across BAC jurisdictions. The 2025 BAC/IMI International Apprentice Contest, with 80 apprentices competing across the trowel-trades crafts, demonstrated the continued vitality of the union's apprenticeship pipeline."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Restoration Anchor"
                    summary="The architectural-restoration market — where BAC craftworkers face very limited non-union competition — continues to expand."
                    body="Several structural factors continue to support the union's market position. The CHIPS Act–funded semiconductor pipeline, while smaller than it might have been under the prior administration, remained substantially intact and continued to generate trowel-trades work for BAC contractors in multiple regions. Major data-center projects, while less masonry-intensive than traditional commercial buildings, continued to require BAC labor for facade, foundation, and finish work. Institutional construction — schools, hospitals, civic buildings, and higher-education facilities — continued to favor durable masonry construction in many regions. And the architectural-restoration market, where BAC craftworkers face very limited non-union competition because of the specialized skill required, continued to expand as the country's stock of historically significant masonry buildings aged into requiring substantial conservation work."
                  />
                  <ExpandableCard
                    year="2026"
                    title="MAP, Silica Safety, and Member Services"
                    summary="The Member Assistance Program and the union's silica safety advocacy reflect a deepening service model."
                    body="The BAC has invested significantly in member services beyond traditional collective bargaining. The Member Assistance Program (MAP), staffed by licensed clinicians who specialize in working with construction tradespeople, provides confidential support for members and their families addressing mental health concerns, substance use issues, interpersonal conflicts, and financial adversity. The 1-833-MAP-TALK hotline operates Monday through Friday and provides direct connection to clinical support. The IMI/IMTEF Maternity Benefit and Childcare Discount programs and the BAC Disaster Relief Fund extend additional member services beyond the traditional building-trades model. The union has also been a significant industry voice on silica safety, a serious occupational health issue for trowel-trades workers exposed to crystalline silica in masonry materials."
                  />
                </Era>

                {/* CLOSING */}
                <div style={{margin:'80px 0 40px', padding:'40px', background:'linear-gradient(135deg, rgba(192,74,54,0.08), rgba(250,128,89,0.04))', border:'1px solid rgba(192,74,54,0.2)', borderRadius:20, textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#C04A36', letterSpacing:3, textTransform:'uppercase', marginBottom:12}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'0 0 20px 0', lineHeight:1.1}}>
                    The materials evolved.<br/><span style={{color:'#C04A36'}}>The trade did not.</span>
                  </h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 16px'}}>
                    When the delegates met in Philadelphia in October 1865 to found the BMPIU, the country they imagined organizing was still being rebuilt from the Civil War. Most American cities were largely constructed of brick and stone laid by hand. The masonry trades were among the most skilled and best-paid building crafts.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 24px'}}>
                    The BAC today, 161 years after that small Philadelphia convention, continues to do the same essential thing: organizing the workers who build, repair, and restore the masonry, stone, tile, terrazzo, and finish surfaces that give North American buildings their durable, finished, human-scale presence.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#C04A36', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(192,74,54,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}

`;

if (code.includes('{page === "history-bac" && (() => {')) {
  console.log('Skipping page insert — history-bac page already present.');
} else if (code.includes(insertAnchor)) {
  code = code.replace(insertAnchor, bacPage + insertAnchor);
  console.log('✓ Inserted BAC history page render block');
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
console.log('   git add src/App.jsx && git commit -m "feat: add BAC deep-dive history page (oldest continuously operating union in North America)" && git push');
console.log('');
