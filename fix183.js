// fix183.js — Add the IUPAT history page
//
// What this does:
//   1. Inserts a new page route: page === "history-iupat"
//      Mounted right after page === "history-iuec".
//      Uses the same collapsible Era / StatBlock / PullQuote / AnimatedNumber
//      pattern as history-ibew and history-iuec.
//
//   2. Adds an entry to the trade-history index TRADES array (the page that
//      lists all trade histories with cards).
//
//   3. Adds 'history-iupat' to the validPages whitelist.
//
//   4. Adds a PAGE_META entry (browser title + meta description for sharing).
//
//   5. Adds an entry to the desktop History dropdown (nav).
//
//   6. Adds an entry to the mobile drawer Trade Histories sub-collapse.
//
// Idempotency: detects 'page === "history-iupat"' and exits cleanly.
//
// Reads:  src/App.jsx
// Writes: src/App.jsx (in place)

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('page === "history-iupat"')) {
  console.log('Already applied — IUPAT history page is already in place.');
  process.exit(0);
}

// ============================================================================
// THE PAGE
// ============================================================================
const PAGE_BLOCK = `
        {page === "history-iupat" && (() => {
          if (typeof window !== 'undefined' && !window.__iupatStatCache) window.__iupatStatCache = {};
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const cacheKey = 'iupat:' + prefix + ':' + value + ':' + suffix + ':' + decimals;
            const cached = typeof window !== 'undefined' && window.__iupatStatCache && window.__iupatStatCache[cacheKey];
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
                        if (typeof window !== 'undefined' && window.__iupatStatCache) window.__iupatStatCache[cacheKey] = true;
                      }
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: 0.5 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };

          const PullQuote = ({ children, attribution }) => (
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #ec4899', background:'linear-gradient(90deg, rgba(236,72,153,0.1) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#ec4899', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#ec4899', children }) => {
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
          };

          const Para = ({ children }) => (
            <p style={{fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:18, maxWidth:780}}>{children}</p>
          );

          return (
            <div id="iupat-history-root">
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #ec4899, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('trade-history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#ec4899'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Trade Histories
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#ec4899', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The International Union of Painters and Allied Trades</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Brushes, Glass, <span style={{color:'#ec4899'}}>and Brotherhood.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>From a Baltimore meeting hall, 1887.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  Fifteen cities sent delegates representing roughly six hundred frightened journeymen. Many painters in Baltimore stayed home that day, afraid their bosses would put them out of work the next morning. The men who showed up founded a union that today represents painters, glaziers, drywall finishers, and trade-show workers from Vancouver to Miami.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={140} label="Members & represented workers" suffix="K" />
                  <StatBlock value={139} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={32} label="District Councils" />
                  <StatBlock value={7} label="Finishing Trades" />
                </div>
              </div>

              <PullQuote attribution="John T. 'Jack' Elliott, IUPAT Founder, 1887">
                Single-handed we can accomplish nothing, but united there is no power of wrong we cannot openly defy.
              </PullQuote>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                <Era tag="I" years="March 15, 1887" title="A Meeting in Baltimore" color="#ec4899" intro="Fifteen cities and a fearful trade founded a brotherhood.">
                  <Para>On a chilly Tuesday in March of 1887, a small group of journeyman painters gathered in Baltimore, Maryland, to do something most of them had been told their whole working lives they could not do: form a national union. The meeting was poorly attended. Many painters in the city stayed home, afraid their bosses would find out who showed up and put them out of work the next morning. Fifteen cities across the United States and Canada sent delegates representing roughly 600 men. They were enough.</Para>
                  <Para>The man at the center of the meeting was John T. Elliott — known to everyone as Jack. A working painter himself, Elliott had won a charter under Maryland law to organize a national craft union of painters and decorators. On March 15 and 16, his delegates elected officers, adopted a constitution, and wrote a death and disability benefit policy into the bylaws on the very first day. A member with six months of standing was entitled to fifty dollars; a member with a year, a hundred. Wives received funeral expenses on the same scale. In an era before workers' compensation, before Social Security, before nearly any safety net at all, this was the union as a mutual-aid society — the trade taking care of its own because no one else would.</Para>
                  <Para>The new organization called itself the Brotherhood of Painters and Decorators of America. Within twelve months it would have more than 7,000 members across more than 100 local unions. Within three years it would top 10,000. The fear that had kept that first Baltimore meeting half-empty turned out, in retrospect, to be the very thing the new union was built to dissolve.</Para>
                  <Para>The First General Assembly convened in August 1888, again in Baltimore. Twenty-four delegates from around the country were now drawing salaries from a treasury they themselves had built dollar by dollar. Elliott stayed on as General Secretary-Treasurer. By 1891, every major painting town from Boston to San Francisco had a chartered local. The Brotherhood had survived its infancy. The harder fight, as it turned out, was about to start inside its own ranks.</Para>
                </Era>

                <Era tag="II" years="1892 – 1900" title="East Versus West" color="#FA8059" intro="The eight-year split that almost ended it all.">
                  <Para>A young union runs on personality, and the personality at the top of the Brotherhood in its earliest years was Jack Elliott's. He had founded it. He had written its constitution. He worked out of Baltimore and believed Baltimore was where the union belonged. By 1891 a rival had emerged: James McKinney, a member of Local 147 in Chicago who represented the fast-growing painting trade west of the Alleghenies.</Para>
                  <Para>The fight came to a head at the convention in St. Louis on August 1, 1892. Delegates elected McKinney President of the Brotherhood and passed a resolution moving the headquarters to Lafayette, Indiana — a midpoint between the two factions. Elliott objected, ruled the motion out of order, and refused to move his office. By the end of the year the Brotherhood had two sets of officers, two sets of records, and two headquarters: one in Baltimore, one in Lafayette. For the next eight years, both sides claimed to be the real Brotherhood.</Para>
                  <Para>The split is rarely talked about today, but it is the single most important fact about why the IUPAT looks the way it does. The eight years between 1892 and 1900 forced both factions to negotiate, compromise, and eventually merge under a structure where no one city or man could ever again claim ownership of the union. In 1899 the eastern faction adopted a new name — the Brotherhood of Painters, Decorators, and Paperhangers of America — formally including the wallpaper hangers whose jurisdiction had caused so much trouble with the AFL a decade earlier. In 1900 the eastern faction agreed to move its records to Lafayette. The union was one again.</Para>
                  <Para>Elliott himself was sidelined for much of the period. He died in 1909, never having reclaimed the central role he had held in 1887. In September 1914 the Brotherhood gathered at Loudon Park Cemetery in Baltimore to dedicate a granite monument over his grave. By then the Brotherhood he had founded had more than 100,000 members and the wounds of the split were finally beginning to heal.</Para>
                </Era>

                <Era tag="III" years="1900 – 1929" title="The Lafayette Years" intro="Becoming a national craft union.">
                  <Para>With the headquarters consolidated in Lafayette, Indiana, after 1900, the Brotherhood entered what its members would later call the Lafayette Years — three decades during which it became a recognizably modern American craft union. Local 147 of Chicago, McKinney's old home, drove much of the early work. New locals were chartered every month: scenic painters in New York, sign and pictorial painters in Kansas City, glaziers in Los Angeles, paint makers in St. Louis. By 1903 the Brotherhood had its own monthly journal, the <em>Painter and Decorator</em>, distributed out of the Lafayette correspondence rooms.</Para>
                  <Para>The work was the work. American cities were exploding upward and outward, and every new building needed paint, wallpaper, glass, signs, and decorative finishes. The Brotherhood organized the craftsmen who provided them. By 1904, the union could claim a remarkable statistic: in roughly ninety-eight out of every hundred labor disputes its locals took up that year, the painters won shorter hours, better wages, or improved working conditions. Few unions in American history have ever posted a higher win rate.</Para>
                  <Para>In 1921 the Brotherhood completed construction of its first International Headquarters in Lafayette — a four-story brick building that would house the union's records, journal, and paid staff for nearly fifty years. For the painters and paperhangers who had spent years carrying union records city to city in steamer trunks, the Lafayette headquarters was the physical proof that the Brotherhood had survived its founding crisis and was here to stay.</Para>
                </Era>

                <Era tag="IV" years="1902 – 1960s" title="Adding the Allied Trades" color="#FA8059" intro="Paperhangers, glaziers, paint makers, sign workers, drywall finishers — the steady absorption.">
                  <Para>The story of the IUPAT is, more than almost any other building trades union, a story of absorption. The original 1887 charter covered painters and decorators. The 1900 name change added paperhangers. Over the next half century, the Brotherhood would steadily add the rest of the trades that today make up the seven recognized IUPAT crafts.</Para>
                  <Para>The first major addition came in 1902, when the AFL's National Paperhangers' Protective and Beneficial Association — the Knights of Labor breakaway that had once fought the Brotherhood for jurisdiction — finally voted to merge into it. The Brotherhood now genuinely was the union of painters, decorators, and paperhangers it had renamed itself.</Para>
                  <Para>Glaziers came next. The trade of cutting and installing window glass had long sat awkwardly between several unions; by the 1910s it was clearly part of the painting and decorating world on most jobsites. Local 636 in Los Angeles, founded in the early 1920s, became one of the first dedicated glazier locals; its members appear in some of the most striking photographs in the IUPAT archive, hauling enormous plates of plate glass on horse-drawn carts and lifting them by hand into department-store storefronts. The Glaziers' National Union of the United States merged with the Brotherhood in 1937.</Para>
                  <Para>Paint makers — the men and women who actually mixed and packaged the paint the painters applied — were absorbed in waves through the 1920s and 1940s. Sign and pictorial painters were one of the trade's proudest crafts; by the postwar period, scenic artists were working in the entertainment industry, painting Broadway backdrops and Hollywood sets. New York's Local 829, the United Scenic Artists, would produce some of the most celebrated decorative painters in America.</Para>
                  <Para>Drywall finishing — the trade of taping, mudding, and finishing gypsum board — emerged after World War II as drywall replaced lath and plaster as the dominant interior wall material. By the end of the 1960s, drywall finishers were a major and growing part of the union. Floor coverers, trade show workers, and convention decorators would join the union over the following decades. Each craft brought its own techniques, its own jurisdictions, and its own internal politics. The Brotherhood absorbed them all.</Para>
                </Era>

                <Era tag="V" years="1914 – 1960s" title="Wars, Walls, and Drywall" color="#22c55e" intro="The Brotherhood through two world wars and a building boom.">
                  <Para>World War I drew thousands of Brotherhood members into uniform. Painters from Local 138 in Vancouver, British Columbia, and locals across the eastern United States shipped overseas; others stayed home and painted military equipment, ships, and barracks. The Brotherhood used the war as an opportunity to push for the eight-hour day on military contracts — a demand that, with the federal government desperate for skilled labor, the Brotherhood mostly won.</Para>
                  <Para>World War II was bigger. By April of 1943, General President L. Lindelof and General Secretary-Treasurer L. Raftery were photographed buying $200,000 worth of war bonds from the Second World War Loan Drive Committee — a sum that, in inflation-adjusted dollars, represents roughly $3.7 million today. Brotherhood locals on both coasts converted their members into wartime industrial painters working on warships, aircraft factories, and munitions plants. The Brotherhood also gained, for the first time at scale, women members — wartime industrial painters who took up brushes their husbands and brothers had laid down.</Para>
                  <Para>The postwar years were the union's most expansive era. The American building boom of the late 1940s and 1950s required painters, paperhangers, glaziers, drywall finishers, and sign workers in every metropolitan area. The Brotherhood's 1954 General Convention in Seattle was the largest in its history. Drywall finishing, which had barely existed as a trade in 1945, was being taught in apprenticeship classes across the country by 1960.</Para>
                  <Para>For all its growth, the postwar Brotherhood was a deeply white, deeply male, and deeply conservative organization. In 1967, Local 583 in Calgary, Alberta, initiated Evelyn Pederson as its second female member in 62 years — a statistic the local leadership announced with pride and that today reads as an indictment of how thoroughly the trade had been closed to women. Black painters, Latino painters, and immigrant painters faced even tougher exclusion in many cities, often forced into separate locals or shut out of apprenticeships altogether.</Para>
                </Era>

                <Era tag="VI" years="Late 1960s – Early 1970s" title="Schonfeld and the Reform Generation" color="#FA8059" intro="Cleaning up a union, opening a trade.">
                  <Para>By the late 1960s, the Brotherhood — like many old AFL craft unions — was facing serious internal problems. Several large locals, particularly District Council 9 in New York City, had become entangled with organized crime through corrupt business agents, sweetheart contracts with politically connected contractors, and outright embezzlement of pension funds. A reform movement, led inside DC 9 by a young business agent named <strong style={{color:'#fff'}}>Frank Schonfeld</strong>, began pushing back.</Para>
                  <Para>Schonfeld was elected president of DC 9 in 1969 on a platform of cleaning out the local, opening the apprenticeship to Black and Puerto Rican workers, and reining in the corruption that had hollowed out members' benefits. The fight that followed was brutal. Schonfeld was beaten, sued, raided by federal investigators looking for evidence on his enemies, and eventually expelled from the union under contested charges before being reinstated by federal court order.</Para>
                  <Para>His campaign exposed long-running corruption inside the Brotherhood's largest district council and forced changes that eventually rippled out to the international level. The reform generation he represented pushed the union to integrate its apprenticeship programs, accept federal civil rights oversight, and take its first real steps toward becoming the multi-racial, multi-gender union it has slowly grown into over the half century since.</Para>
                  <Para>In October of 1968, painters and decorators from Locals 368, 890, and 1778 prepped the White House for President Nixon's inauguration — a workaday job that nonetheless symbolized the Brotherhood's deep penetration into American institutional life. Inside the union itself, the Schonfeld generation was changing what kind of institution the Brotherhood would be. The era of the closed shop was giving way, slowly and reluctantly, to something more like a real labor movement.</Para>
                </Era>

                <Era tag="VII" years="1970 – 1999" title="The IBPAT Era" intro="New name, new headquarters, new fights.">
                  <Para>In January of 1970 the Brotherhood of Painters, Decorators, and Paperhangers of America changed its official name to the International Brotherhood of Painters and Allied Trades. The new name was an explicit recognition of how much the union had absorbed: the painters and paperhangers were no longer the whole of it. The glaziers, paint makers, sign and pictorial painters, drywall finishers, and a growing list of allied crafts were as much a part of the union now as the original 1887 trades.</Para>
                  <Para>In November of 1970, the IBPAT moved into a new headquarters in Washington, D.C., sharing a building with the Sheet Metal Workers International Association, the International Association of Fire Fighters, and the Iron Workers. The Lafayette headquarters that had housed the union since 1921 was sold; the records were trucked east. For the first time in nearly half a century, the union's operations were physically located in the same city as the federal government it increasingly had to lobby.</Para>
                  <Para>The IBPAT era was also a difficult one. The construction industry was being reshaped by non-union competition, particularly in the Sun Belt, where right-to-work laws and aggressive open-shop contractors were making serious inroads into work that had once been exclusively union. The painting trade was particularly exposed: the work could be learned faster than most other building trades, the entry barriers were lower, and ruthless contractors could undercut union wages with informal, often undocumented labor. Across the 1970s and 1980s, IBPAT's market share in many cities slipped. By the late 1990s, the union was reckoning with the worst membership decline in its history.</Para>
                  <Para>The reform project that had begun with Schonfeld in the late 1960s was now a strategic question: how do you grow a craft union in an industry where the craft is being deliberately deskilled by contractors who don't want to pay for it?</Para>
                </Era>

                <Era tag="VIII" years="1999 – 2010" title="One Union" color="#22c55e" intro="Becoming the IUPAT.">
                  <Para>At the 1999 General Convention, the union adopted the name International Union of Painters and Allied Trades — IUPAT — which became the modern IUPAT identity going forward. The new name dropped the word "Brotherhood," partly in acknowledgement that the union was no longer all male, partly in recognition that the modern building trades world had moved beyond fraternal language. The 113-year-old organization was officially, finally, no longer just a brotherhood of painters.</Para>
                  <Para>The IUPAT reorganization went deeper than the name. The new structure consolidated dozens of small local unions into larger regional district councils — typically state-sized or multi-state bodies that took over collective bargaining, member services, and apprenticeship training from the locals. The shift was controversial. Some long-standing locals fought it. But the strategic logic was clear: a union of 100 small locals could not match the organizing capacity of a union of 30 large district councils, and the modern construction industry was being run by national contractors who needed national counterparts on the labor side.</Para>
                  <Para>The IUPAT name also formally locked in the seven-trade structure the union still uses today: commercial painter, drywall finisher, floor coverer, glazier and glassworker, industrial painter, sign and display worker, and trade show worker. The union represented all of them. The IUPAT motto — "One Union" — became the union's public-facing identity. In 2006, IUPAT members from District Council 15 in Las Vegas helped construct the Grand Canyon Skywalk for Giroux Glass — a job that would have been impossible to staff in 1887, in 1921, or even in 1970. The trade had grown into the union, and the union had grown into the trade.</Para>
                </Era>

                <Era tag="IX" years="2010 – Present" title="The Hanover Campus" intro="A modern home and a modern training institute.">
                  <Para>On August 23, 2010, the IUPAT moved out of its longtime Washington, D.C. headquarters and into a new campus in Hanover, Maryland, just outside Baltimore — within driving distance of the city where Jack Elliott had founded the union 123 years earlier. The new campus, anchored by two stone lions at the entrance, included the international headquarters building, a 52,000-square-foot training center, and a 36-room residence hall for visiting students.</Para>
                  <Para>The training center was the headline. Its formal name was the <strong style={{color:'#fff'}}>International Finishing Trades Institute — iFTI</strong>. Inside the iFTI's flexible lab were welding booths, abrasive blast booths, spray booths, a simulated steel structure for rigging and hoisting, a confined-space tank for tank-lining instruction, and floor space for full-scale construction mock-ups. Six classrooms surrounded the lab. Together they made up what was, by any measure, the finest finishing-trades training facility in North America.</Para>
                  <Para>The iFTI is accredited by the Council on Occupational Education and serves the apprenticeship training programs of every IUPAT district council across the United States and Canada. A typical IUPAT apprenticeship runs three years, combining a minimum of 144 hours of classroom instruction per year with full-time on-the-job training under journeymen. By the end of three years, an IUPAT apprentice walks out of the program a journeyman in their chosen trade — debt-free, certified, and with the union ticket that opens jobsites from Vancouver to Miami.</Para>
                  <Para>The Hanover campus also houses the IUPAT Industry Pension Fund, the Labor Management Cooperation Initiative, and the union's communications and political departments. For the first time in the union's history, every major institutional function — organizing, training, benefits administration, and political representation — sits on a single campus. The union that began in a half-empty Baltimore meeting hall in 1887 now runs a campus a few miles down the road from where Jack Elliott is buried.</Para>
                </Era>

                <Era tag="X" years="2013 – Today" title="Rigmaiden, Williams, and the New Generation" color="#ec4899" intro="Diversity, organizing, and the road ahead.">
                  <Para>In March of 2013, Brother <strong style={{color:'#fff'}}>Ken Rigmaiden</strong> was elected General President of the IUPAT — the first Black general president in the union's 126-year history, and the first Black president of any major building trades union in North America. Rigmaiden's election represented the culmination of a half century of slow change inside the union, going back to the Schonfeld reforms of the late 1960s. Under Rigmaiden, the IUPAT explicitly committed itself to organizing across racial, gender, and immigration lines — not as a side project, but as the central mission of the union.</Para>
                  <Para>In September of 2020, Brother Mike Gutierrez became the first Latino General Vice President of the IUPAT. In September of 2023, Sister Liz McElroy became the first female General Vice President. By December of 2023, the IUPAT had four women serving as organizing directors, more than at any point in the union's history. The internal politics of a union founded in Baltimore in 1887 by white male journeymen had, after a long century and a half, finally begun to look like the workforce it represented.</Para>
                  <Para>On August 1, 2021, the General Executive Board voted unanimously to elect a new leadership team to replace the retiring Rigmaiden. <strong style={{color:'#fff'}}>Jimmy Williams Jr.</strong>, a 43-year-old fourth-generation glazier from District Council 21 in Philadelphia, became the youngest General President in IUPAT history — and the youngest president of any building trades union in the United States, and the youngest president of any union affiliated with the AFL-CIO. Gregg Smith, a fourth-generation painter from District Council 58 in St. Louis, became General Secretary-Treasurer.</Para>
                  <Para>Williams's vision for the IUPAT, articulated in interviews and at conventions since his election, has been blunt. The union must organize undocumented workers, not as a reluctant concession but as a strategic priority — because the unscrupulous contractors driving down wages in the painting and finishing trades depend almost entirely on misclassified and exploited immigrant labor. The union must take the lead on federal labor law reform, particularly the Protecting the Right to Organize (PRO) Act. And the union must operate as a social movement, not just a craft organization — because the economic forces arrayed against working people are too large for any single trade to confront alone.</Para>
                  <Para>The IUPAT today represents approximately 100,000 to 140,000 members and represented workers across the United States and Canada — painters, glaziers, drywall finishers, floor coverers, industrial painters, sign and display workers, and trade show workers — organized into 32 district councils and served by the Hanover campus and the iFTI. It has fewer members than it had at its postwar peak. It has more diversity than at any point in its history. It is fighting the same fight Jack Elliott started in Baltimore in 1887.</Para>
                  <Para>On April 30, 2023, due to the efforts of DC 6 / Local 707 member Bill Jaworske, the world celebrated the first-ever <strong style={{color:'#fff'}}>International Painters Day</strong>. On March 15, 2022, the IUPAT marked its 135th anniversary. The Brotherhood that Jack Elliott chartered with fifteen cities and roughly six hundred frightened journeymen has become a continental union of seven trades and a hundred thousand members. The fight has not gotten easier. The membership has not stopped showing up.</Para>
                </Era>

                <PullQuote attribution="IUPAT motto, on the union crest since 1887">
                  Organization, Education, Fraternity.
                </PullQuote>

                {/* THE SEVEN TRADES SUMMARY */}
                <div style={{margin:'56px 0 32px', padding:'32px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#ec4899', letterSpacing:2.5, textTransform:'uppercase', marginBottom:14}}>The Seven Trades · IUPAT Today</div>
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'0 0 24px 0'}}>One union, seven crafts.</h3>
                  <ul style={{margin:0, paddingLeft:24, fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.85, listStyle:'none'}}>
                    {[
                      ['Commercial Painter', 'Interior and exterior painting on commercial buildings.'],
                      ['Drywall Finisher', 'Taping, mudding, and finishing gypsum board walls and ceilings.'],
                      ['Floor Coverer', 'Installing carpet, hardwood, vinyl, and specialty flooring systems.'],
                      ['Glazier and Glassworker', 'Cutting, installing, and replacing architectural glass and storefronts.'],
                      ['Industrial Painter', 'Protective coatings on bridges, tanks, refineries, and steel structures.'],
                      ['Sign and Display Worker', 'Window lettering, neon, illuminated signs, and display fabrication.'],
                      ['Trade Show Worker', 'Setup, dismantle, and management of convention and exhibit displays.'],
                    ].map(([n, d], i) => (
                      <li key={i} style={{position:'relative', paddingLeft:14, marginBottom:8}}>
                        <span style={{position:'absolute', left:-10, color:'#ec4899', fontWeight:900}}>·</span>
                        <strong style={{color:'#fff'}}>{n}</strong> — {d}
                      </li>
                    ))}
                  </ul>
                  <p style={{margin:'18px 0 0 0', fontSize:13, color:'rgba(255,255,255,0.6)', fontStyle:'italic'}}>Approximately 100,000 to 140,000 members and represented workers across the U.S. and Canada. 32 district councils. 7 finishing trades. Founded 1887. 139 years of history.</p>
                </div>

              </div>

              <div style={{padding:'40px 24px 80px', maxWidth:900, margin:'0 auto', textAlign:'center'}}>
                <button onClick={() => setPage('trade-history')} style={{background:'transparent', color:'#ec4899', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(236,72,153,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to Trade Histories</button>
              </div>
            </div>
          );
        })()}
`;

// ============================================================================
// EDIT 1 — Insert page block after history-iuec
// ============================================================================
// history-iuec ends right before the next page route — find the rtw page anchor since
// we need to insert before history-ufcw or rtw. Cleanest approach: insert before the
// rtw page (it's the next page after history pages).
// Actually the immediately-next page after history-iuec is rtw, so we anchor on that.
const rtwAnchor = '\n        {page === "rtw" && (() => {';
if (!src.includes(rtwAnchor)) {
  console.error('ERROR: could not find rtw page anchor for IUPAT history insertion');
  process.exit(1);
}
src = src.replace(rtwAnchor, PAGE_BLOCK + rtwAnchor);

// ============================================================================
// EDIT 2 — Add IUPAT card to trade-history index TRADES array
// ============================================================================
const tradeHistOld = `            { key:'ufcw',  name:'UFCW',         full:'United Food and Commercial Workers International Union',                                   page:'history-ufcw',  founded:1979, members:'1.2M+', color:'#10A37F', sub:'Grocery, retail, and meatpacking. Strike Twenty-Six, Smithfield, and the largest private-sector union.' },
          ];`;
const tradeHistNew = `            { key:'ufcw',  name:'UFCW',         full:'United Food and Commercial Workers International Union',                                   page:'history-ufcw',  founded:1979, members:'1.2M+', color:'#10A37F', sub:'Grocery, retail, and meatpacking. Strike Twenty-Six, Smithfield, and the largest private-sector union.' },
            { key:'iupat', name:'IUPAT',        full:'International Union of Painters and Allied Trades',                                        page:'history-iupat', founded:1887, members:'140K+', color:'#ec4899', sub:'A Baltimore meeting hall, the East-West split, and the modern Hanover campus.' },
          ];`;
if (!src.includes(tradeHistOld)) {
  console.error('ERROR: could not find trade-history TRADES array UFCW anchor');
  process.exit(1);
}
src = src.replace(tradeHistOld, tradeHistNew);

// ============================================================================
// EDIT 3 — Add 'history-iupat' to validPages
// ============================================================================
const validPagesOld = `'apprenticeship-iuoe','apprenticeship-ubc','apprenticeship-iupat','weingarten']`;
const validPagesNew = `'apprenticeship-iuoe','apprenticeship-ubc','apprenticeship-iupat','weingarten','history-iupat']`;
if (!src.includes(validPagesOld)) {
  console.error('ERROR: could not find validPages whitelist anchor');
  process.exit(1);
}
src = src.replace(validPagesOld, validPagesNew);

// ============================================================================
// EDIT 4 — Add PAGE_META entry
// ============================================================================
const metaOld = `      'apprenticeship-iupat': { title: "IUPAT Apprenticeship Test — Full Breakdown · Union Pathways", desc: "What's on the IUPAT apprenticeship test — math, reading, mechanical, spatial, and (for painters) color perception. Coverage of the 8+ trades under IUPAT including glaziers, drywall finishers, and industrial painters, plus the wide regional variation between District Councils. There's no single national IUPAT test — each region runs its own." },`;
const metaNew = `      'apprenticeship-iupat': { title: "IUPAT Apprenticeship Test — Full Breakdown · Union Pathways", desc: "What's on the IUPAT apprenticeship test — math, reading, mechanical, spatial, and (for painters) color perception. Coverage of the 8+ trades under IUPAT including glaziers, drywall finishers, and industrial painters, plus the wide regional variation between District Councils. There's no single national IUPAT test — each region runs its own." },
      'history-iupat': { title: "IUPAT History — Brushes, Glass, and Brotherhood · Union Pathways", desc: "From the half-empty Baltimore meeting hall where Jack Elliott chartered the union in 1887 to the modern Hanover campus and the iFTI training institute. The East-West split, the absorption of glaziers and drywall finishers, the Schonfeld reform era, the 1999 IUPAT name change, and the Williams-era organizing strategy. 139 years of finishing trades history." },`;
if (!src.includes(metaOld)) {
  console.error('ERROR: could not find PAGE_META apprenticeship-iupat anchor');
  process.exit(1);
}
src = src.replace(metaOld, metaNew);

// ============================================================================
// EDIT 5 — Add IUPAT to desktop History dropdown
// ============================================================================
const navOld = `                    {key:'UFCW', name:'UFCW — Food & Commercial Workers', page:'history-ufcw', live:true},
                  ].map(t => (`;
const navNew = `                    {key:'UFCW', name:'UFCW — Food & Commercial Workers', page:'history-ufcw', live:true},
                    {key:'IUPAT', name:'IUPAT — Painters & Allied Trades', page:'history-iupat', live:true},
                  ].map(t => (`;
if (!src.includes(navOld)) {
  console.error('ERROR: could not find desktop History dropdown UFCW anchor');
  process.exit(1);
}
src = src.replace(navOld, navNew);

// ============================================================================
// EDIT 6 — Add IUPAT to mobile drawer Trade Histories sub-collapse
// ============================================================================
const mobileOld = `                <button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>`;
const mobileNew = `                <button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
                <button className={\`mobile-drawer-link\${page==="history-iupat" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iupat"); setMobileNavOpen(false); }}>· IUPAT · Painters & Allied Trades</button>`;
if (!src.includes(mobileOld)) {
  console.error('ERROR: could not find mobile drawer history-ufcw anchor');
  process.exit(1);
}
src = src.replace(mobileOld, mobileNew);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - Inserted history-iupat page (10 collapsible Eras + Seven Trades summary)');
console.log('  - Added IUPAT card to trade-history index');
console.log('  - Added history-iupat to validPages');
console.log('  - Added PAGE_META entry');
console.log('  - Added IUPAT to desktop History dropdown');
console.log('  - Added IUPAT to mobile drawer Trade Histories');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add IUPAT history page" && git push');
console.log('');
