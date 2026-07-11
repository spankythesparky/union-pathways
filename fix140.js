// fix140.js
// Add the UFCW (United Food and Commercial Workers International Union)
// deep-dive history page, matching the IBEW / UA / SMART / BAC pattern:
//   - AnimatedNumber, ExpandableCard, PullQuote, StatBlock, Era components
//   - Green (#10A37F) primary accent — first non-building-trades page on the
//     site, distinct from the construction-trade color family
//   - 9 Era sections covering 1880s pre-merger predecessors through 2026
//   - Hero stats, breadcrumb, scroll progress bar, back button
//
// Steps:
//   1. Add 'history-ufcw' to validPages
//   2. Add 'history-ufcw' entry to PAGE_META
//   3. Update App-level scrollProgress hook to check for 'ufcw-history-root'
//   4. Update history dropdown — promote UFCW from placeholder to live page
//   5. Insert the new UFCW page IIFE before the trade-history fallback
//   6. Update the prerender script (scripts/generate-og-pages.mjs) so the
//      UFCW page unfurls correctly on social media

const fs = require('fs');
const appPath = 'src/App.jsx';
const prerenderPath = 'scripts/generate-og-pages.mjs';
let code = fs.readFileSync(appPath, 'utf8');

let changes = 0;

// ── 1. ADD 'history-ufcw' TO validPages ─────────────────────────────────────
const oldValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','history-bac','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
const newValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','history-bac','history-ufcw','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
if (code.includes(oldValidPages)) {
  code = code.replace(oldValidPages, newValidPages);
  console.log("✓ Added 'history-ufcw' to validPages");
  changes++;
} else if (code.includes("'history-ufcw'")) {
  console.log("Skipping — 'history-ufcw' already in validPages.");
} else {
  console.error('ERROR: validPages array not found in expected form.');
  process.exit(1);
}

// ── 2. ADD 'history-ufcw' TO PAGE_META ──────────────────────────────────────
const oldMeta = `      'history-bac': { title: "BAC History — The Trowel and the Long Memory · Union Pathways", desc: "The full history of the International Union of Bricklayers and Allied Craftworkers from its 1865 Philadelphia founding to today. The oldest continuously operating trade union in North America. John A. White, Harry Bates and the AFL-CIO unity, the postwar golden age, the long decline of structural masonry, and the modern restoration economy." },`;
const newMeta =
`      'history-bac': { title: "BAC History — The Trowel and the Long Memory · Union Pathways", desc: "The full history of the International Union of Bricklayers and Allied Craftworkers from its 1865 Philadelphia founding to today. The oldest continuously operating trade union in North America. John A. White, Harry Bates and the AFL-CIO unity, the postwar golden age, the long decline of structural masonry, and the modern restoration economy." },
      'history-ufcw': { title: "UFCW History — Behind the Counter and on the Cutting Floor · Union Pathways", desc: "The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president." },`;
if (code.includes(oldMeta)) {
  code = code.replace(oldMeta, newMeta);
  console.log("✓ Added 'history-ufcw' PAGE_META entry");
  changes++;
} else if (code.includes("'history-ufcw': { title:")) {
  console.log("Skipping — 'history-ufcw' PAGE_META already present.");
} else {
  console.error('ERROR: history-bac PAGE_META anchor not found.');
  process.exit(1);
}

// ── 3. UPDATE APP-LEVEL scrollProgress HOOK ─────────────────────────────────
const oldCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','benefits-root'];`;
const newCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','ufcw-history-root','benefits-root'];`;
if (code.includes(oldCandidates)) {
  code = code.replace(oldCandidates, newCandidates);
  console.log("✓ Added 'ufcw-history-root' to scrollProgress candidates");
  changes++;
} else if (code.includes('ufcw-history-root')) {
  console.log("Skipping — scrollProgress already includes ufcw-history-root.");
} else {
  console.error('ERROR: scrollProgress candidates list not found.');
  process.exit(1);
}

// ── 4. PROMOTE UFCW DROPDOWN ENTRY TO LIVE ──────────────────────────────────
const oldDropdownEntry = `                    {key:'UFCW', name:'UFCW — Food & Commercial Workers'},`;
const newDropdownEntry = `                    {key:'UFCW', name:'UFCW — Food & Commercial Workers', page:'history-ufcw', live:true},`;
if (code.includes(oldDropdownEntry)) {
  code = code.replace(oldDropdownEntry, newDropdownEntry);
  console.log('✓ Promoted UFCW dropdown entry to live (history-ufcw)');
  changes++;
} else if (code.includes("page:'history-ufcw'")) {
  console.log('Skipping — UFCW dropdown entry already promoted.');
} else {
  console.error('ERROR: UFCW dropdown entry not found in expected form.');
  process.exit(1);
}

// ── 5. INSERT THE FULL UFCW PAGE BEFORE trade-history FALLBACK ──────────────
const insertAnchor = `        {page === "trade-history" && (`;

const ufcwPage =
`        {page === "history-ufcw" && (() => {
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

          const ExpandableCard = ({ year, title, summary, body, accent = '#10A37F' }) => {
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
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#10A37F', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#10A37F', children }) => (
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
            <div id="ufcw-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #10A37F, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#10A37F'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#10A37F', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The United Food and Commercial Workers International Union</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Behind the Counter,<br/><span style={{color:'#10A37F'}}>On the Cutting Floor.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>The workers who feed the country.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:720, margin:'0 auto'}}>
                  Most American workers have, at some point, encountered a UFCW member without realizing it. The cashier at Kroger. The butcher at Stop & Shop. The pharmacy tech at Rite Aid. The processor on a slaughter line in Iowa. A significant share of the food in American refrigerators passed, at some point in its journey from animal or field to plate, through the hands of a UFCW worker.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={1.3} label="Million members" suffix="M" decimals={1} />
                  <StatBlock value={6} label="Largest union in the U.S." prefix="#" />
                  <StatBlock value={1000} label="Local unions in the U.S. and Canada" suffix="+" />
                  <StatBlock value={1979} label="Year of founding merger" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="1888 – 1978" title="Two Unions, Two Industries" intro="The two predecessor unions that merged to form the UFCW grew up in entirely different industries, with entirely different organizational cultures, and confronted entirely different challenges across nearly a century of separate institutional history.">
                  <ExpandableCard
                    year="1888"
                    title="The Retail Clerks International Union"
                    summary="Retail employment was among the most exploited categories of urban labor: $10/week for 86 hours, no holidays, no sick pay, no pensions."
                    body="The Retail Clerks International Union was founded in the late nineteenth century, in an era when retail employment was among the most exploited categories of urban labor. In 1888, the average American retail clerk earned $10 per week for 86 hours of work — no holidays, no sick pay, no pensions, no insurance. Boycotting became the union's primary tactic in its earliest decades. An early Retail Clerks victory in 1896, in which a Kansas City local successfully boycotted a particular retail store until the proprietor either signed a union agreement or relocated, established the basic playbook that would define the union for decades. The Retail Clerks were also among the first American unions to formally establish the principle of overtime pay."
                  />
                  <ExpandableCard
                    year="1897"
                    title="The Amalgamated Meat Cutters Are Chartered"
                    summary="Seven local unions in Chicago consolidated under an AFL charter — and immediately set up 56 separate craft departments."
                    body="The Amalgamated Meat Cutters and Butcher Workmen of North America was chartered by the AFL in 1897 to consolidate seven local unions in Chicago. From its founding, the AMC was strongly committed to craft unionism — so committed, in fact, that the union maintained 56 separate departments representing different specialized crafts within the meatpacking industry, with workers in each craft within a city operating their own council, executive board, business agent, and contract. The arrangement was sometimes so internally divided that members of one AMC craft would continue working while members of a different AMC craft in the same city were on strike."
                  />
                  <ExpandableCard
                    year="1904 – 1906"
                    title="The Jungle, Federal Inspection, and a Defining Strike"
                    summary="The 1904 meatpacking strike and Upton Sinclair's 1906 novel pushed Congress to pass the Pure Food and Drug Act and the Federal Meat Inspection Act."
                    body="The AMC led one of the most consequential labor actions of the early twentieth century. The 1904 meatpacking strike — and the broader public horror generated by Upton Sinclair's 1906 novel The Jungle, which exposed the brutal conditions of the Chicago packinghouses — pushed federal regulation of the meat industry through the Pure Food and Drug Act and the Federal Meat Inspection Act of 1906. The episode became a foundational case study in the relationship between labor action, public exposure, and federal regulation."
                  />
                  <ExpandableCard
                    year="1968"
                    title="The UPWA Joins the Meat Cutters"
                    summary="After fifteen years of coordinated bargaining, the United Packinghouse Workers of America merges with the AMC."
                    body="In 1943, the Packinghouse Workers Organizing Committee was dissolved to form the United Packinghouse Workers of America (UPWA) — and in 1968, after fifteen years of coordinated bargaining, the UPWA and the AMC merged, uniting nearly half a million members and creating one of the most progressive worker organizations in the postwar American labor movement. The UPWA brought with it a strong civil rights tradition that shaped the merged union's culture in important ways."
                  />
                  <ExpandableCard
                    year="1950s – 1970s"
                    title="The Long Pattern of Predecessor Mergers"
                    summary="Both unions consolidated repeatedly through the postwar period — leather workers, fur workers, agricultural workers, shoe workers."
                    body="By the 1970s, both unions had grown through repeated mergers. The AMC absorbed the United Leather Workers' International Union in 1951, the International Fur and Leather Workers Union in 1955, the National Agricultural Workers Union in 1960, and the UPWA in 1968. The Retail Clerks absorbed the Boot and Shoe Workers Union in 1977. Both unions were under increasing pressure from the same forces — supermarket consolidation, the rise of warehouse-style discount retail, the geographic shift of meatpacking from urban centers to rural processing facilities in right-to-work states — and both leaderships had concluded by the late 1970s that consolidation into a single international was strategically necessary."
                  />
                </Era>

                {/* PART II */}
                <Era tag="II" years="June 1979" title="The Founding Merger" intro="The merger convention that created the United Food and Commercial Workers International Union was held in Washington, D.C., in early June 1979. On June 5, 1979, delegates from the Retail Clerks and the Amalgamated Meat Cutters formally approved the merger, instantly creating the largest union affiliated with the AFL-CIO.">
                  <ExpandableCard
                    year="June 5, 1979"
                    title="William H. Wynn and the New International"
                    summary="The Retail Clerks president becomes the UFCW's first International President. The merger creates an organization of 1.3 million members."
                    body="On June 5, 1979, delegates approved the merger, creating an organization of approximately 1.3 million members and instantly establishing the UFCW as the largest union affiliated with the AFL-CIO. William H. Wynn, president of the Retail Clerks International Union and one of the principal architects of the merger, became the UFCW's first International President. Samuel J. Talarico of the AMC became the first International Secretary-Treasurer. The new union's headquarters was established in Washington, D.C., where it remains today."
                  />
                  <ExpandableCard
                    year="1980 – 1983"
                    title="The First Wave of Affiliations"
                    summary="Barbers and beauticians, retail workers, and the binational character of the union all came together in the first four years."
                    body="In 1980, the Barbers, Beauticians and Allied Industries International Association merged with the UFCW. In 1981, the United Retail Workers Union (now Local 881) followed. In 1983, the union held its first regular international convention in Montreal, Quebec — symbolically reinforcing the UFCW's binational character — and the 15,000-member Insurance Workers' International Union voted to join."
                  />
                  <ExpandableCard
                    year="1993"
                    title="The RWDSU Affiliates"
                    summary="100,000 members in department stores, warehouses, and distribution. The RWDSU's NYC-rooted, Jewish-American labor culture is preserved within the UFCW structure."
                    body="The single largest addition during the Wynn era was the 1993 affiliation of the Retail, Wholesale and Department Store Union (RWDSU), which brought 100,000 members and became the RWDSU District Council of the UFCW. Among the new RWDSU-UFCW members were workers in department store, warehouse, distribution, and manufacturing sectors that significantly diversified the UFCW's industry footprint. The RWDSU's distinctive institutional culture — anchored in New York City and with deep roots in Jewish-American labor activism dating back to the 1930s — was preserved within the UFCW structure and would shape major organizing campaigns in subsequent decades."
                  />
                  <ExpandableCard
                    year="1994 – 1995"
                    title="Garment, Textile, and Distillery Workers"
                    summary="The diversification continued: 15,000 garment workers, 15,000 textile workers, 15,000 distillery workers."
                    body="The 1994 mergers added the 15,000-member United Garment Workers of America, and in 1995 the 15,000-member Textile Workers and the 15,000-member Distillery, Wine and Allied Workers' International Union joined as well. By the mid-1990s, the UFCW had become an unusually diverse organization, representing workers across grocery, meatpacking, retail, food processing, garment manufacturing, textile work, beverage production, insurance, and personal services."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1994 – 2004" title="The Dority Era and the Walmart Problem" intro="Douglas H. Dority became the UFCW's second International President in 1994. The Dority decade was marked by continued institutional consolidation — and the union's first sustained engagement with the industry forces that would define the next thirty years of its bargaining environment.">
                  <ExpandableCard
                    year="1996 – 1998"
                    title="More Affiliations"
                    summary="The International Chemical Workers' Union, the Canadian Union of Restaurant and Related Employees, and additional specialty unions all joined in the late 1990s."
                    body="In 1996, the 40,000-member International Chemical Workers' Union merged with the UFCW to form the International Chemical Workers Union Council. In 1997, the Canadian Union of Restaurant and Related Employees affiliated. In 1998, two additional Canadian and U.S. specialty unions joined. The merger pace continued at a rate that almost no other American union could match."
                  />
                  <ExpandableCard
                    year="1990s – 2000s"
                    title="The Walmart Organizing Failure"
                    summary="The UFCW launched repeated campaigns to organize Walmart. Most failed. The single breakthrough — meat cutters in Texas — was answered by Walmart eliminating in-store meat cutting nationwide."
                    body="The UFCW launched repeated campaigns to organize Walmart through the 1990s and into the 2000s. Most failed. The single significant breakthrough came when the union organized a small group of Walmart meat cutters in Texas — and Walmart promptly eliminated in-store meat cutting from its U.S. operations, claiming the move was unrelated to the organizing campaign. The episode became one of the defining failures of late-twentieth-century American organizing and contributed to broader frustration within the labor movement about the inadequacy of existing labor law for organizing large-scale, anti-union employers."
                  />
                  <ExpandableCard
                    year="October 2003 – March 2004"
                    title="The 141-Day Southern California Grocery Strike"
                    summary="The longest grocery strike in American history. 70,000 to 80,000 workers struck or were locked out at Vons, Ralphs, and Albertsons over health care and a two-tier wage proposal."
                    body="The most consequential bargaining event of the Dority era came in October 2003. UFCW members at Vons, Ralphs, and Albertsons in Southern California — roughly 70,000 to 80,000 workers — went on strike or were locked out over health-care contributions and a proposed two-tier wage system that the employers argued was necessary to compete with Walmart. The strike lasted 141 days, the longest grocery strike in American history. The settlement reached in March 2004 contained significant concessions on health care and established a two-tier wage structure that meaningfully reduced compensation for new hires. The strike has been credited with permanently shifting Southern California grocery shoppers toward non-union competitors, and its outcome shaped UFCW bargaining culture for the next two decades."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="2004 – 2014" title="The Hansen Era — Change to Win" intro="Joseph T. Hansen became the third UFCW International President in 2004. The defining institutional decision of his tenure was the 2005 split from the AFL-CIO and the founding of the Change to Win Federation.">
                  <ExpandableCard
                    year="2005"
                    title="The Change to Win Split"
                    summary="The UFCW joined the Teamsters, SEIU, UNITE-HERE, the Laborers, the United Farm Workers, and the Carpenters in withdrawing from the AFL-CIO."
                    body="In 2005, the UFCW, along with six other major unions — the Teamsters, SEIU, UNITE-HERE, the Laborers, the United Farm Workers, and the Carpenters — withdrew from the AFL-CIO and formed the Change to Win Federation. The split reflected long-running frustrations within the major service-and-industrial unions about what they viewed as the AFL-CIO's insufficient investment in organizing new members, the federation's emphasis on political work over workplace organizing, and disagreements over labor's strategic priorities at a moment when union density was continuing its long decline. Change to Win operated as a separate federation for the better part of a decade, pursuing aggressive organizing strategies in service-sector industries."
                  />
                  <ExpandableCard
                    year="2009 – 2010"
                    title="The Employee Free Choice Act"
                    summary="Card-check legislation backed by the Obama administration would have transformed organizing law. It failed."
                    body="The Hansen era was also defined by sustained engagement with the question of card-check organizing. The UFCW was a major institutional supporter of the Employee Free Choice Act, the legislation backed by the Obama administration in the 111th Congress that would have required employers to recognize unions when a majority of workers signed authorization cards, eliminating the secret-ballot election process that the UFCW and other unions argued had become structurally biased toward employers. The bill ultimately failed, and the UFCW's response shaped much of its subsequent organizing strategy — leaning heavily on neutrality agreements negotiated directly with employers, 'corporate campaigns' designed to pressure employers into recognition, and incremental organizing in industries where traditional NLRB-supervised elections had become exceptionally difficult to win."
                  />
                  <ExpandableCard
                    year="2013"
                    title="The UFCW Returns to the AFL-CIO"
                    summary="After eight years, the union ended its Change to Win affiliation."
                    body="In 2013, the UFCW announced it was rejoining the AFL-CIO, ending its eight-year affiliation with Change to Win. The decision reflected a broader recognition across the major unions involved that the institutional split had not produced the organizing breakthrough its architects had hoped for, and that the costs of operating outside the AFL-CIO — particularly in political and legislative work — outweighed the strategic benefits."
                  />
                </Era>

                <PullQuote attribution="The work that 2026 demands">
                  Defending grocery bargaining against further consolidation, organizing in industries that didn't exist a generation ago, and rebuilding institutional density in meatpacking — fundamentally different work from what the founders set out to organize.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="2014 – 2025" title="The Perrone Era — Cannabis, Healthcare, and the Megamerger" intro="Anthony 'Marc' Perrone — who began his career as a grocery clerk in Pine Bluff, Arkansas, more than 50 years before becoming International President — was elected the UFCW's fourth International President in December 2014. His nearly eleven-year tenure was defined by three strategic priorities.">
                  <ExpandableCard
                    year="2010s – 2020s"
                    title="The Cannabis Expansion"
                    summary="As state-level legalization spread, the UFCW became the dominant union in the new industry."
                    body="As state-level marijuana legalization spread across the United States through the 2010s and into the 2020s, the UFCW emerged as the dominant union representing the new industry's workers — dispensary employees, cultivators, processors, and manufacturers. By the mid-2020s, the union represented tens of thousands of cannabis workers across the country, making it the largest single labor presence in the legal cannabis industry. The cannabis division was structured to serve workers across an industry that operates in a complex regulatory environment, where federal law continues to classify marijuana as a Schedule I controlled substance even as state legalization has expanded dramatically."
                  />
                  <ExpandableCard
                    year="2010s – 2020s"
                    title="Healthcare Organizing"
                    summary="55,000+ healthcare professionals at hospitals, assisted living facilities, and related employers like Cooper University Health Care."
                    body="The UFCW today represents over 55,000 healthcare professionals in hospitals, assisted living facilities, and related services, including nursing aides and support staff at employers like Cooper University Health Care in New Jersey. Healthcare organizing leveraged the union's existing institutional infrastructure in retail pharmacy — where UFCW contracts cover employees at Rite Aid, CVS, and Walgreens — to enter adjacent healthcare-services markets."
                  />
                  <ExpandableCard
                    year="October 2022 – December 2024"
                    title="Stop the Merger"
                    summary="The campaign against the proposed $24.6 billion Kroger-Albertsons megamerger became the defining strategic fight of Perrone's late-tenure presidency."
                    body="The proposed $24.6 billion merger, announced in October 2022, would have combined the two largest unionized grocery chains in the United States and dramatically concentrated the buyer side of the UFCW's most important bargaining relationship. UFCW locals — particularly UFCW 7, 324, 400, 770, 1564, and 3000 — led the 'Stop the Merger' coalition, which ultimately included more than 100 organizations. In February 2024, the FTC, supported by the attorneys general of nine states and DC, sued to block the merger. On December 10, 2024, federal Judge Adrienne Nelson granted a preliminary injunction blocking the deal. On the same day, a Washington state court ruled against the merger in a separate suit. Albertsons withdrew the following day. The case was widely reported as the first high-profile FTC merger challenge using a labor-market theory of harm — a structural shift in antitrust enforcement that the UFCW's coalition had played a substantial role in driving."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="2024 – 2025" title="Strikes, Whole Foods, and Major Wins" intro="The 2024 period brought the UFCW some of the most consequential bargaining and organizing wins in recent memory, even as the broader retail and food industries continued to face automation, consolidation, and platform-driven disruption.">
                  <ExpandableCard
                    year="January 2022"
                    title="The King Soopers Strike"
                    summary="UFCW Local 7's nine-day walkout against Kroger's Colorado chain set the bargaining tone for the years that followed."
                    body="The 2022 King Soopers strike in Colorado — UFCW Local 7's nine-day walkout against Kroger's regional grocery chain — set the bargaining tone for the years that followed, securing meaningful wage and benefit improvements that locals across the country drew on as bargaining benchmarks. The 2024 contract negotiations across major grocery chains in California, Colorado, Washington, and other Western markets produced wage gains that, while not universally satisfying to rank-and-file members, were among the strongest in the union's recent bargaining history."
                  />
                  <ExpandableCard
                    year="early 2025"
                    title="The Whole Foods Philadelphia Vote"
                    summary="130 to 100 — the first union at any Amazon-owned grocery store in the United States."
                    body="The most significant organizing breakthrough came at Whole Foods Market. After years of failed organizing campaigns at Amazon-owned facilities — the most prominent being the high-profile but ultimately unsuccessful Bessemer, Alabama warehouse campaign organized by the RWDSU-UFCW — workers at the Whole Foods store in Philadelphia voted 130 to 100 in early 2025 to join UFCW Local 1776, becoming the first union at any Amazon-owned grocery store in the United States. The vote represented a meaningful strategic breakthrough in a sector where Amazon's anti-union resistance had been remarkably effective."
                  />
                  <ExpandableCard
                    year="2021 – present"
                    title="The Bessemer Campaign and Amazon"
                    summary="The RWDSU-UFCW continued protracted organizing work at Amazon facilities, including the long-running Bessemer fulfillment center campaign."
                    body="The RWDSU-UFCW continued its long-running organizing work at Amazon facilities directly, including the protracted campaign at the Bessemer fulfillment center that had drawn national attention beginning in 2021. While the formal organizing breakthrough at Amazon's traditional warehouses remained elusive, the campaigns shaped public conversation about labor law, anti-union activity, and the inadequacy of the National Labor Relations Act framework for organizing at the scale of Amazon's operations."
                  />
                </Era>

                {/* PART VII */}
                <Era tag="VII" years="May 13, 2025" title="Milton Jones Becomes the First African American UFCW President" intro="The most consequential institutional event in the UFCW's recent history occurred on May 13, 2025. After more than four decades of labor activism and nearly eleven years as International President, Marc Perrone announced his retirement. The same day, the International Executive Board met in special session to elect his successor.">
                  <ExpandableCard
                    year="May 13, 2025"
                    title="A Narrow Vote, A Historic Outcome"
                    summary="The board narrowly elected Milton Jones over Mark Lauritsen, the head of the union's meatpacking division."
                    body="The board narrowly elected Milton Jones, who had been serving as International Secretary-Treasurer, over Mark Lauritsen, the head of the union's meatpacking and food processing division. Jones, who began his career as a teenaged courtesy clerk at a Kroger grocery store in Alabama, had been a UFCW member for 45 years and had spent more than 33 years in leadership roles within the International Union. He became the first African American president in the UFCW's history."
                  />
                  <ExpandableCard
                    year="May 2025"
                    title="The Leadership Reshuffle"
                    summary="Shawn Haggerty, Stuart Appelbaum, Lisa Pedersen, Dave Young — the new top of the UFCW."
                    body="The accompanying leadership reshuffle elevated Shawn Haggerty, the National President of UFCW Canada, to the position of International Secretary-Treasurer, becoming the first Canadian to hold that office in the UFCW's history. Stuart Appelbaum, the longtime president of the RWDSU and one of the most influential figures in the broader American labor movement, continued as Executive Vice President. Lisa Pedersen, the UFCW's General Counsel, was elected as Executive Vice President. Dave Young also continued as Executive Vice President."
                  />
                  <ExpandableCard
                    year="2025"
                    title="Strategic Debates and Continuity"
                    summary="The closeness of the executive board vote reflected ongoing internal debates about organizing priorities and the balance between grocery and meatpacking divisions."
                    body="Jones's election was met with broad support across the union, though the closeness of the executive board vote reflected ongoing strategic debates within the UFCW about organizing priorities, the balance between grocery and meatpacking divisions, and the union's posture under a federal administration that had become substantially less favorable to organized labor than its predecessor had been."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="2025 – 2026" title="The Industry Environment" intro="The structural challenges facing the UFCW heading into 2026 are different in kind from those facing most building-trades unions, and they reflect the particular features of the food-and-retail economy as it has evolved over the past generation.">
                  <ExpandableCard
                    year="2026"
                    title="Grocery Concentration"
                    summary="The top five grocery operators control a majority of national sales. Walmart alone is over a quarter of the market."
                    body="Grocery retail is among the most concentrated industries in the American economy. Despite the 2024 blocking of the Kroger-Albertsons merger, the top five grocery operators control a substantial majority of national sales. Walmart alone accounts for more than a quarter of the U.S. grocery market by some measures. The UFCW's bargaining leverage in any individual market depends substantially on what share of regional employment is unionized — and the long expansion of Walmart, Costco, Aldi, and other non-union grocers has steadily eroded the union density that historically anchored UFCW contracts."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Transformation of Meatpacking"
                    summary="Geographic shift to rural right-to-work states. JBS, Tyson, Cargill, Smithfield. A workforce now substantially foreign-born."
                    body="Meatpacking has undergone a parallel concentration. A handful of multinational firms — JBS, Tyson, Cargill, Smithfield, and a small number of others — process the majority of beef, pork, and poultry in the United States. Meatpacking employment has shifted decisively from urban centers to rural processing facilities in right-to-work states across the South and Midwest, and the workforce has been transformed by immigration, with a substantial majority of meatpacking workers in the United States now foreign-born. The UFCW retains significant membership in the major packinghouses, but its density in the industry is substantially lower than it was at the time of the 1968 UPWA-AMC merger."
                  />
                  <ExpandableCard
                    year="2026"
                    title="Automation and Platform Labor"
                    summary="Self-checkout kiosks, automated warehouses, Instacart and DoorDash. The fragmentation of retail employment."
                    body="Automation and platform labor add additional pressure. Self-checkout kiosks, automated warehouse systems, app-based grocery delivery (Instacart, DoorDash, and Amazon Fresh), and the broader gig-economy model have all reshaped retail employment in ways that are exceptionally difficult to organize under existing labor law. The UFCW has made some inroads — including organizing efforts at fulfillment-style facilities and ongoing campaigns at Whole Foods — but the broader trajectory of retail employment has been toward fewer hours per worker, more part-time positions, and greater workforce fragmentation."
                  />
                  <ExpandableCard
                    year="2026"
                    title="Cannabis as Counterpoint"
                    summary="An industry still in its early institutional formation, with regulatory environments that often actively encourage labor peace agreements."
                    body="Cannabis represents a structural counterpoint to these pressures. The industry is still in its early institutional formation, the regulatory environment in most legal states actively encourages or requires labor peace agreements, and the UFCW's early entry has given it a dominant organizing position. The union has been successful in cannabis organizing in a way that it has not been in most other emerging service-sector industries."
                  />
                </Era>

                {/* PART IX */}
                <Era tag="IX" years="2025 – 2026" title="Where UFCW Stands Now" intro="The 2025 change in federal administration produced a substantially less favorable political environment for the UFCW. But the union's deep institutional capacity, built across nearly fifty years of mergers, organizing campaigns, and strategic adaptation, gives it tools that few other unions in the modern American labor movement can match.">
                  <ExpandableCard
                    year="2026"
                    title="The Membership Picture"
                    summary="Approximately 1.2 to 1.3 million members across the U.S. and Canada — the sixth-largest national labor union in the United States."
                    body="The UFCW reports approximately 1.2 to 1.3 million members across the United States and Canada — making it the sixth-largest national labor union in the United States and one of the largest private-sector unions in North America. Membership is distributed across grocery retail (the largest single sector), meatpacking and food processing, retail pharmacy, healthcare, cannabis, barber and beauty services, and a smaller footprint of legacy garment, textile, and distillery workers. The union operates through over 1,000 local unions across the United States and Canada, with substantial geographic concentration in the Western United States, the Northeast, the upper Midwest, and major Canadian metropolitan areas."
                  />
                  <ExpandableCard
                    year="2025 – 2026"
                    title="The FTC, Antitrust, and Premium Subsidies"
                    summary="The federal antitrust posture under the new administration is uncertain. ACA premium subsidies became a major political fight."
                    body="The Federal Trade Commission's posture under the new administration is a particular concern given how central FTC action was to the 2024 blocking of the Kroger-Albertsons merger. The 2025 reconfiguration of federal antitrust priorities, combined with the broader rollback of labor-friendly regulatory positions, creates uncertainty about how a future merger proposal in grocery retail or meatpacking would be evaluated. Healthcare premium increases became a major political fight during 2025 and into 2026, with the UFCW joining other major unions in opposing Republican proposals that would have allowed Affordable Care Act premium subsidies to expire — changes that would have substantially raised costs for working families who depend on ACA marketplace coverage."
                  />
                  <ExpandableCard
                    year="2026"
                    title="Wages and Benefits"
                    summary="UFCW members in major metropolitan markets earn substantially above the national median for retail employment, with full benefits packages."
                    body="UFCW members earn wages that vary widely by sector and region. Grocery workers in major metropolitan markets, particularly in California, the Pacific Northwest, and the Northeast, earn wages substantially above the national median for retail employment, with full benefits packages including employer-paid health insurance, defined-benefit pensions in many bargaining units, and contractually negotiated paid leave. Meatpacking and food-processing wages also exceed non-union benchmarks in the same industries, though the gap has narrowed in some markets due to non-union competition."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Jones Administration's Direction"
                    summary="Continuity on grocery, cannabis, and healthcare. A renewed emphasis on the meatpacking and food-processing divisions."
                    body="The Jones administration has signaled continuity on the union's major strategic priorities (defending grocery bargaining structures, expanding cannabis and healthcare organizing, rebuilding density in meatpacking) while bringing a renewed institutional emphasis on the meatpacking and food-processing divisions that had felt under-prioritized during the Perrone era. Shawn Haggerty's elevation to International Secretary-Treasurer represents a meaningful institutional acknowledgment of UFCW Canada's role within the international."
                  />
                </Era>

                {/* CLOSING */}
                <div style={{margin:'80px 0 40px', padding:'40px', background:'linear-gradient(135deg, rgba(16,163,127,0.08), rgba(250,128,89,0.04))', border:'1px solid rgba(16,163,127,0.2)', borderRadius:20, textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#10A37F', letterSpacing:3, textTransform:'uppercase', marginBottom:12}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'0 0 20px 0', lineHeight:1.1}}>
                    The economy transformed.<br/><span style={{color:'#10A37F'}}>The institutional logic did not.</span>
                  </h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 16px'}}>
                    When delegates of the Retail Clerks and the Amalgamated Meat Cutters met in Washington, D.C. in June 1979 to formally approve the merger that created the UFCW, the food and retail economy they imagined organizing was already being transformed. Walmart was a regional discount chain. Cannabis was illegal in every state. Amazon did not exist.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 24px'}}>
                    The UFCW today, 47 years after that merger convention, continues to do the same essential thing the Retail Clerks and the Meat Cutters did separately for nearly a century before: organizing the workers who make sure that food, medicine, and the goods of daily life reach the people who need them.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#10A37F', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(16,163,127,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}

`;

if (code.includes('{page === "history-ufcw" && (() => {')) {
  console.log('Skipping page insert — history-ufcw page already present.');
} else if (code.includes(insertAnchor)) {
  code = code.replace(insertAnchor, ufcwPage + insertAnchor);
  console.log('✓ Inserted UFCW history page render block');
  changes++;
} else {
  console.error('ERROR: trade-history insertion anchor not found.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

// ── 6. UPDATE PRERENDER SCRIPT ───────────────────────────────────────────────
if (fs.existsSync(prerenderPath)) {
  let pre = fs.readFileSync(prerenderPath, 'utf8');
  const oldPreAnchor = `  '/history-bac': { title: 'BAC History · Union Pathways', description: 'The full history of the International Union of Bricklayers and Allied Craftworkers. The oldest continuously operating trade union in North America — from the 1865 Philadelphia founding through the Bates era and the AFL-CIO merger to today\\'s restoration economy.' },`;
  const newPreAnchor =
`  '/history-bac': { title: 'BAC History · Union Pathways', description: 'The full history of the International Union of Bricklayers and Allied Craftworkers. The oldest continuously operating trade union in North America — from the 1865 Philadelphia founding through the Bates era and the AFL-CIO merger to today\\'s restoration economy.' },
  '/history-ufcw': { title: 'UFCW History · Union Pathways', description: 'The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president.' },`;

  if (pre.includes("'/history-ufcw':")) {
    console.log('Skipping prerender update — /history-ufcw already in script.');
  } else if (pre.includes(oldPreAnchor)) {
    pre = pre.replace(oldPreAnchor, newPreAnchor);
    fs.writeFileSync(prerenderPath, pre);
    console.log('✓ Added /history-ufcw to prerender script');
    changes++;
  } else {
    console.error('WARNING: prerender script anchor not found. UFCW page will not have static OG tags until manual fix.');
  }
} else {
  console.log('(Skipping prerender step — scripts/generate-og-pages.mjs not found.)');
}

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx scripts/generate-og-pages.mjs && git commit -m "feat: add UFCW deep-dive history page (first non-construction union)" && git push');
console.log('');
