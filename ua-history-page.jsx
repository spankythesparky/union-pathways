        {page === "history-ua" && (() => {
          const useScrollProgress = () => {
            const [progress, setProgress] = useState(0);
            useEffect(() => {
              const onScroll = () => {
                const el = document.getElementById('ua-history-root');
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const total = rect.height - window.innerHeight;
                const scrolled = -rect.top;
                const p = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));
                setProgress(p);
              };
              window.addEventListener('scroll', onScroll, { passive: true });
              onScroll();
              return () => window.removeEventListener('scroll', onScroll);
            }, []);
            return progress;
          };

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
              }, { threshold: 0.5 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };

          const ExpandableCard = ({ year, title, summary, body, accent = '#3B9EFF' }) => {
            const [open, setOpen] = useState(false);
            return (
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:`4px solid ${accent}`}}>
                <div onClick={() => setOpen(o => !o)} style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>{title}</div>
                    <div style={{fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6}}>{summary}</div>
                  </div>
                  <div style={{flexShrink:0, width:32, height:32, borderRadius:'50%', background:`${accent}22`, color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s'}}>+</div>
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
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #3B9EFF', background:'linear-gradient(90deg, rgba(59,158,255,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#3B9EFF', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#3B9EFF', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:48, height:48, borderRadius:12, background:`${color}22`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                </div>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );

          const scrollProgress = useScrollProgress();

          return (
            <div id="ua-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #3B9EFF, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#3B9EFF'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The United Association</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  The Pipe Trades' <span style={{color:'#3B9EFF'}}>Long Brotherhood.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Born in Washington, D.C., 1889.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  When forty delegates met in Washington in October 1889, American cities were still laying their first comprehensive sewer systems. Indoor plumbing was migrating from luxury into building code. Steam heat was replacing coal stoves. Each fitting was installed, one at a time, by tradesmen whose unions were small, local, and frequently at war with each other.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={396} label="Members today" suffix="K" />
                  <StatBlock value={137} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={274} label="Local unions" />
                  <StatBlock value={1971} label="Peak year — 320K members" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="Civil War – 1880s" title="Three Crafts, One Job" intro="In the decades after the Civil War, three loosely related crafts shared the work of moving fluids and gases through the buildings of an industrializing America. Plumbers installed water-supply and waste systems. Steamfitters handled high- and low-pressure steam piping. Gas fitters specialized in the rapidly expanding network of illuminating and fuel gas. Each had its own tools, its own apprenticeship traditions, and — increasingly — its own local unions.">
                  <ExpandableCard
                    year="1879-1889"
                    title="The Boom Decade"
                    summary="The first strong, long-lasting locals were established — but the structure remained fragmented."
                    body="By the late 1870s and early 1880s, plumbers, pipefitters, and gas fitters were organized in many major cities, but largely as independent local unions with no national affiliation, or with shifting ties to whatever broader labor federation seemed most promising at the moment. Locals in Boston, New York, Philadelphia, Chicago, and Washington each pursued their own contracts, set their own wage scales, and ran their own apprenticeships. A plumber qualified in one city was not automatically qualified in another. Members who traveled in search of work — and there were many — had no formal mechanism for transferring between locals."
                  />
                  <ExpandableCard
                    year="1880s"
                    title="The Failed First Attempts"
                    summary="A National Association of Plumbers, Gas Fitters, and Steam Fitters had been chartered, but collapsed."
                    body="The first national association folded under the weight of the depression years. The Knights of Labor briefly attracted some pipe-trades workers but offered little support specific to their craft. By the late 1880s, with the United States entering an unprecedented urban building boom, local union leaders increasingly recognized that the absence of a stable national body was costing them: in dues, in mobility, in coordinated bargaining, and in the ability to defend craft jurisdiction against employers and rival unions alike."
                  />
                </Era>

                <PullQuote attribution="P.J. Quinlan, Boston plumber, in his 1889 letter to Richard A. O'Brien">
                  I take the liberty of addressing a few lines to you to obtain your views as regards the formation of a United Brotherhood…
                </PullQuote>

                {/* PART II */}
                <Era tag="II" years="1889" title="The Washington Convention" color="#FA8059" intro="The man who set the founding in motion was Patrick J. Quinlan, a Boston plumber. In early 1889 he addressed his now-famous letter to Richard A. O'Brien, a plumber in Washington, D.C. Quinlan would become the first General President; O'Brien would become its first General Secretary-Treasurer.">
                  <ExpandableCard
                    year="Oct 11, 1889"
                    accent="#FA8059"
                    title="Forty Delegates, Twenty-Three Locals"
                    summary="They drafted a constitution, ritual, dues structure, strike funds, and rules for traveling members."
                    body="Over several days in Washington, the delegates adopted the somewhat unwieldy name under which the union would operate for decades: the United Association of Journeymen Plumbers, Gas Fitters, Steam Fitters, and Steam Fitters' Helpers of the United States and Canada. The American Federation of Labor — which Samuel Gompers had founded only three years earlier — granted the new body an AFL charter shortly thereafter."
                  />
                  <ExpandableCard
                    year="1889-1890"
                    accent="#FA8059"
                    title="The Three Founding Principles"
                    summary="Exclusive jurisdiction over all pipe work. Clearance cards for traveling members. A uniform apprenticeship."
                    body="The young UA was organized around principles that would shape its institutional culture for more than a century. It claimed exclusive jurisdiction over the installation, alteration, and repair of all piping systems — water, waste, gas, and steam — performed for compensation in the United States and Canada. It established a clearance card system that allowed unemployed journeymen in one locality to travel to work in another, the foundation of the union's distinctive mobility. And it committed to building a uniform apprenticeship that would standardize the trade across local jurisdictions. By the second convention in 1890, the UA reported just under 5,000 members."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1893 – 1914" title="The Steamfitters' War" color="#E74C3C" intro="The Panic of 1893 devastated the new union — membership fell from 6,700 to 4,400 by 1897. But the next two decades would be defined less by employer conflict than by the most consequential internal crisis in the union's history: a prolonged jurisdictional war with the International Association of Steam and Hot Water Fitters and Helpers, an AFL-chartered rival that claimed exclusive authority over steamfitting work.">
                  <ExpandableCard
                    year="1898-1914"
                    accent="#E74C3C"
                    title="Sixteen Years of Internal Warfare"
                    summary="Repeated strikes, lockouts, jurisdictional walkouts, and AFL mediation efforts."
                    body="The dispute had two layers. The philosophical one: the UA argued that the pipe trades — plumbing, steamfitting, gas fitting — were a single craft with shared skills and shared jurisdiction. The International Association argued that steamfitting was a distinct trade, with its own tools and traditions, entitled to its own union. The practical one: as industrial buildings, hospitals, hotels, and the new generation of skyscrapers required ever more sophisticated piping systems, the question of which union's members were entitled to install which pipe became enormously consequential. Walkouts by either organization on a major project could halt every other building trade on the site."
                  />
                  <ExpandableCard
                    year="1912"
                    accent="#E74C3C"
                    title="The AFL Settles the Question"
                    summary="The American Federation of Labor revoked the International Association's charter."
                    body="A decisive ruling that recognized the UA as the legitimate national jurisdiction over the entire pipe trades. Over the following two years, most of the surviving steamfitter locals merged into the UA, bringing with them experienced industrial pipefitters and the technical traditions of high-pressure steam work."
                  />
                  <ExpandableCard
                    year="1914"
                    accent="#E74C3C"
                    title="The Unified UA Emerges"
                    summary="Stronger than before the conflict, with an expanded name reflecting the broader jurisdiction."
                    body="The settlement also expanded the UA's name to reflect its broader jurisdiction: the United Association of Journeymen and Apprentices of the Plumbing and Pipe Fitting Industry of the United States and Canada — the name, in its essentials, the union still uses today."
                  />
                </Era>

                <PullQuote attribution="The institutional lesson the UA carried forward">
                  After the searing experience of the Steamfitters' War, the UA's culture turned decisively toward institutional consolidation and disciplined bargaining over factional militancy.
                </PullQuote>

                {/* PART IV */}
                <Era tag="IV" years="1914 – 1936" title="The Open Shop Era and the Apprenticeship Founding" intro="Like most American unions, the UA grew significantly during World War I. Federal industrial demand — for shipyards, munitions plants, military bases — required vast amounts of pipework, and the labor-friendly policies of Wilson's wartime mediation boards gave organized labor temporary leverage. Then the 1920s reversed every gain.">
                  <ExpandableCard
                    year="1920s"
                    title="The American Plan"
                    summary="The postwar Red Scare and employers' open-shop campaign squeezed every building-trades union."
                    body="Mechanical contractors associations across major cities canceled UA agreements or refused to renew them. Open-shop competition from non-union plumbers and pipefitters intensified, particularly in residential construction. By the late 1920s, the UA had lost ground in many of the markets where it had been strongest a decade earlier."
                  />
                  <ExpandableCard
                    year="1936"
                    title="The First Registered Joint Apprenticeship"
                    summary="The UA pioneered what would become the federal apprenticeship model."
                    body="It was during this difficult period, however, that the UA made what would prove to be one of the most consequential institutional decisions in its history. In 1936, the union's leadership formally established the first nationally registered joint apprenticeship program in the United States — a five-year program for plumbers and pipefitters jointly governed by the UA and its signatory employers, combining classroom instruction with paid on-the-job training. The federal Apprenticeship Standards developed under the National Apprenticeship Act of 1937 would soon codify the model the UA had helped pioneer. The five-year, 'earn while you learn' structure has remained the spine of UA training ever since."
                  />
                </Era>

                {/* PART V */}
                <Era tag="V" years="1936 – 1956" title="The New Deal Settlement and Postwar Expansion" color="#22c55e" intro="The Wagner Act of 1935 transformed the UA's bargaining environment. The new National Labor Relations Board gave workers federally enforceable rights to organize and bargain collectively, and the UA — long established as the AFL's recognized pipe-trades jurisdiction — moved aggressively into industrial markets that had been difficult to organize during the open-shop era.">
                  <ExpandableCard
                    year="1939-1945"
                    accent="#22c55e"
                    title="The War Years"
                    summary="UA welders, pipefitters, and plumbers were essential to every wartime industrial plant, every shipyard, every refinery, every military base."
                    body="The federal government's no-strike pledges and War Labor Board mediation ensured that the union grew rapidly and that its agreements stabilized across the country. The wartime mobilization put UA-trained pipefitters at the center of American industrial production at exactly the moment that production was scaling to unprecedented levels."
                  />
                  <ExpandableCard
                    year="1945-1956"
                    accent="#22c55e"
                    title="The Postwar Construction Boom"
                    summary="Suburbanization, the interstate highway program, the cold-war defense build-up, refining and petrochemical expansion."
                    body="Suburbanization put millions of new homes onto plumbing systems. The interstate highway program required service plazas, fueling stations, and rest stops — every one of them piped. The cold-war defense build-up funded new bases. The expansion of American refining and petrochemical capacity along the Gulf Coast created sustained demand for the most skilled industrial pipefitters and welders the union could produce. The 1947 Taft-Hartley Act imposed real costs — banning closed shops, authorizing right-to-work laws — but the UA's deep apprenticeship pipeline and established relationships with mechanical contractors associations gave it structural advantages that survived the new legal framework."
                  />
                  <ExpandableCard
                    year="1956"
                    accent="#22c55e"
                    title="The Instructor Training Program"
                    summary="The annual UA gathering at Washtenaw Community College in Ann Arbor — one of the union's most distinctive institutions."
                    body="Beginning in 1956, the UA partnered with what is now Washtenaw Community College to bring journey-level instructors from local unions across North America to a single campus for an intensive week of training in the latest teaching methods, tools, and technologies. The program would grow to host roughly 2,000 to 3,000 instructors and industry partners annually, with participants pursuing five-year certification tracks that produce both professional credentials and, for many, associate or bachelor's degrees. It still runs every August."
                  />
                </Era>

                {/* MID PEAK STATS */}
                <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(59,158,255,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{textAlign:'center', marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:2, textTransform:'uppercase'}}>The Peak — 1971</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>The Great Industrial Pipefitting Era</h3>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:8}}>
                    <StatBlock value={320} label="Thousand members at peak" suffix="K" />
                    <StatBlock value={1956} label="Instructor training launched" />
                    <StatBlock value={1936} label="Federal apprenticeship founded" />
                    <StatBlock value={5} label="Year apprenticeship program" suffix=" yr" />
                  </div>
                </div>

                {/* PART VI */}
                <Era tag="VI" years="1956 – 1980" title="The Postwar Peak" color="#22c55e" intro="The quarter-century from the mid-1950s to the early 1980s was the UA's golden age. By 1971, the union had grown to roughly 320,000 members. Nuclear power generation, the Trans-Alaska Pipeline System, the country's first generation of major petrochemical complexes, and continuing growth of commercial construction all drove sustained demand for UA labor.">
                  <ExpandableCard
                    year="1956-1980"
                    accent="#22c55e"
                    title="The Industrial Pipefitter's Era"
                    summary="High-pressure steam, cryogenic gases, corrosive process chemicals, radiation-hardened nuclear systems."
                    body="The work was technically demanding and increasingly specialized. Industrial pipefitters worked with materials and pressures that residential plumbers rarely encountered. The UA's training infrastructure adapted, adding industrial welding programs, specialized certifications, and dedicated instructional tracks for nuclear, refinery, and high-purity work. Through this period, the slogan 'There is no substitute for UA skilled craftsmen' became standard in industry advertising and contract bidding."
                  />
                  <ExpandableCard
                    year="The MCAA Treaty"
                    accent="#22c55e"
                    title="Cooperative Bargaining Becomes the Norm"
                    summary="No-strike clauses for the duration of the contract. Disputes routed to grievance procedures and joint labor-management bodies."
                    body="The UA's institutional culture settled into a distinctive pattern. Most UA construction agreements contained no-strike clauses for the duration of the contract, with disputes routed instead to grievance procedures and joint labor-management bodies. The union's relationship with its primary employer counterpart, the Mechanical Contractors Association of America, was generally cooperative, with shared investments in training, safety standards, and market expansion. Critics argued that this cooperation gave away too much worker leverage. Supporters argued that it was precisely why the UA had labor agreements where many other building trades had retreated. The same debate continues, in modified form, today."
                  />
                </Era>

                {/* PART VII */}
                <Era tag="VII" years="1980 – 2000s" title="Decline and the Open-Shop Squeeze" color="#9CA3AF" intro="The same forces that battered American organized labor more broadly battered the UA. The 1981 PATCO strike and the political environment it inaugurated, the rise of merit-shop construction associations, the deindustrialization of large parts of the American economy, and the gradual erosion of public-policy preferences for union construction all cut into UA membership.">
                  <ExpandableCard
                    year="1970s-1990s"
                    accent="#9CA3AF"
                    title="The Merit Shop Rises"
                    summary="The Associated Builders and Contractors built a parallel construction-industry infrastructure based on non-union labor."
                    body="ABC — founded in 1950 but expanding aggressively from the 1970s onward — built its own apprenticeship programs, its own contractor associations, and its own political-advocacy operation. In market after market, the UA's share of mechanical construction work fell from near-dominance to something closer to parity, and in many regions of the South and Mountain West, to a clear minority position."
                  />
                  <ExpandableCard
                    year="1979-2000s"
                    accent="#9CA3AF"
                    title="Industrial Restructuring"
                    summary="The contraction of American refining, the slowdown of nuclear after Three Mile Island, manufacturing offshoring."
                    body="The contraction of American refining, the slowdown of new nuclear construction after the Three Mile Island accident in 1979, the offshoring of much heavy manufacturing, and the long stagnation of new industrial-pipe construction in the 1980s and 1990s shrank some of the UA's most important markets. The petrochemical and refining sector, traditionally a UA stronghold, became a contested space with significant non-union penetration."
                  />
                  <ExpandableCard
                    year="2000s-2010s"
                    accent="#9CA3AF"
                    title="The Strategic Response"
                    summary="Doubled down on training. Expanded political operation. Stabilized at roughly 340-360K members."
                    body="The UA doubled down on training as a competitive advantage, expanding the Instructor Training Program, adding specialized certifications in welding, instrumentation, and emerging materials, and partnering with major project owners to ensure that UA-trained workers remained the default supply for the most demanding industrial work. It expanded its political operation in Washington and state capitals, particularly in support of prevailing-wage laws, project labor agreements, and registered-apprenticeship requirements. Membership stabilized around 340,000 to 360,000 through the 2000s and 2010s, with a sectoral mix that had shifted somewhat toward HVACR service work, sprinkler fitting, and specialized industrial markets."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="2008 – 2020" title="Veterans in Piping and Modern Reinvention" intro="In 2008, the UA launched what would become one of the most distinctive programs in the modern American labor movement: the Veterans in Piping Program, or UA VIP. Designed in cooperation with the Department of Defense and ultimately recognized as a DoD SkillBridge program, it offered active-duty service members preparing to transition out of the military free, hands-on training in welding, HVACR, and fire suppression at select military bases.">
                  <ExpandableCard
                    year="2008"
                    title="UA VIP Launches"
                    summary="On-base training during the final months of active-duty service, by experienced UA instructors."
                    body="The structure was deliberate. Training is delivered on-base, during the final months of active-duty service, by experienced UA instructors. Participants do not need to use their GI Bill benefits — those remain available for other purposes. Successful graduates are guaranteed direct entry into a UA-registered apprenticeship and job placement with a signatory contractor upon discharge. By the mid-2020s, the program operated at military installations including Camp Pendleton, Joint Base Lewis-McChord, Fort Carson, Fort Cavazos, Camp Lejeune, Fort Campbell, and Naval Station Norfolk."
                  />
                  <ExpandableCard
                    year="2007-2016"
                    title="The Hite Era"
                    summary="General President William P. Hite led the UA through the post-financial-crisis recovery."
                    body="Under Hite, the UA aligned closely with the Obama administration on infrastructure, energy, and apprenticeship policy. The political relationships built during this period would pay off significantly in the 2020s legislative cycle."
                  />
                  <ExpandableCard
                    year="2016"
                    title="McManus Takes Over"
                    summary="Mark McManus was unanimously elected at the 39th General Convention in August 2016."
                    body="McManus assumed office on November 10, 2016, and was unanimously re-elected to a second five-year term at the 40th General Convention in San Diego and Calgary in August 2021. He has been the public face of the union throughout the legislative wins of the 2020s."
                  />
                  <ExpandableCard
                    year="2021-2022"
                    title="The Legislative Payoff"
                    summary="Bipartisan Infrastructure Law, CHIPS and Science Act, Inflation Reduction Act."
                    body="The three laws collectively funneled hundreds of billions of dollars toward projects with prevailing-wage requirements, registered-apprenticeship preferences, and project labor agreement frameworks that disproportionately benefited the UA's signatory contractors. Lead service line replacement, water infrastructure, semiconductor fabrication facilities, hydrogen and clean-energy projects, and modernized transmission infrastructure all became major UA work pipelines under those laws."
                  />
                </Era>

                {/* CURRENT-DAY DASHBOARD */}
                <div style={{margin:'80px 0 40px', padding:'40px 28px', background:'linear-gradient(135deg, rgba(59,158,255,0.08) 0%, rgba(250,128,89,0.08) 100%)', borderRadius:24, border:'1px solid rgba(59,158,255,0.2)'}}>
                  <div style={{textAlign:'center', marginBottom:32}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:3, textTransform:'uppercase'}}>Where the UA Stands Now</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'#fff', margin:'12px 0 0 0'}}>The Brotherhood in 2026</h2>
                    <p style={{fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:600, margin:'12px auto 0', lineHeight:1.6}}>Work pipeline among the strongest in the building trades. Membership rebuilding. Political relationships being tested.</p>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:24}}>
                    <StatBlock value={396} label="Total members" suffix="K" />
                    <StatBlock value={274} label="Local unions" />
                    <StatBlock value={12} label="Apprentices as % of total" suffix="%" />
                    <StatBlock value={44} label="Annual job openings, 2024-34" suffix="K" />
                  </div>
                  <div style={{padding:'20px 24px', background:'rgba(0,0,0,0.25)', borderRadius:16, marginTop:8}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:2, textTransform:'uppercase', marginBottom:8}}>The Rebuild</div>
                    <div style={{fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.6}}>396,000 members today, up from 355,000–380,000 a decade ago. Apprentices represent 12% of total membership. Median pipefitter wages reached $63,000 in May 2024 — top 10% above $105,000 — with UA journey-level members in major metros earning substantially more.</div>
                  </div>
                </div>

                {/* PART IX */}
                <Era tag="IX" years="2024" title="Strikes, Boom Markets, and Realignment" color="#FA8059" intro="The 2024-2025 period brought to the surface several long-running tensions in UA's institutional model, even as the union's underlying work pipeline reached levels not seen since the 1970s.">
                  <ExpandableCard
                    year="Aug 2024"
                    accent="#FA8059"
                    title="The Reno Strike"
                    summary="UA Local 350 in Reno voted to strike after rejecting a wage proposal the contractors called the largest settlement in the local's history."
                    body="The dispute illustrated a particular feature of UA bargaining culture: even when leadership and employer associations reached terms, rank-and-file members increasingly insisted on direct ratification votes and were willing to reject deals their negotiators had endorsed. Local-level strikes in the UA, while still rare compared to most industrial unions, became somewhat more frequent through 2024 and 2025 as wage growth in non-union construction markets and inflation pressure on members' real incomes raised the bar for acceptable contracts."
                  />
                  <ExpandableCard
                    year="2024-2026"
                    accent="#FA8059"
                    title="The LNG and Data Center Boom"
                    summary="The work pipeline became unprecedented."
                    body="Factors driving it included LNG export terminal construction along the Gulf Coast, with the United States becoming the world's largest exporter of liquefied natural gas; data-center construction driven by artificial intelligence and cloud computing; new semiconductor fabrication facilities under the CHIPS Act; the lead service-line replacement program; and continued demand from refinery turnarounds, petrochemical expansions, and the slow but real revival of nuclear construction. UA-trained welders were in such consistent demand on Gulf Coast LNG projects that local unions in lower-demand regions reported significant numbers of members traveling under the clearance-card system to work the boom."
                  />
                </Era>

                {/* PART X */}
                <Era tag="X" years="2025 – 2026" title="The Present Day" intro="Walking into 2026, the UA occupies a position that would have seemed implausible a decade ago: its work pipeline is among the strongest in the building trades, its membership is gradually rebuilding, and its political relationships are being tested by an administration that simultaneously supports its industrial agenda and opposes much of its broader policy framework.">
                  <ExpandableCard
                    year="2025"
                    title="The Boom Markets"
                    summary="LNG exports, data centers, semiconductors, lead service lines, nuclear revival."
                    body="The Interstate Natural Gas Association of America projects North America will need a 39% increase in natural gas transmission capacity by 2052 — a roughly $1 trillion midstream infrastructure investment with substantial UA labor implications. Major projects at Intel facilities in Arizona and Ohio, TSMC's Arizona expansion, and Micron's New York investment have all drawn substantial UA workforces. The slow revival of nuclear construction — including the planned restart of Three Mile Island Unit 1 — has reactivated specialized industrial pipefitting markets that had been largely dormant since the 1980s."
                  />
                  <ExpandableCard
                    year="2025"
                    title="Political Crosswinds"
                    summary="Aligned with the new administration on energy and manufacturing. At odds on labor policy."
                    body="The Trump administration's emphasis on energy infrastructure, LNG exports, manufacturing reshoring, and nuclear development aligned in significant ways with UA work priorities. McManus has issued public statements praising specific administration actions on those fronts. At the same time, the administration's executive order rescinding Biden-era directives that promoted registered-apprenticeship requirements in federal contracting drew UA opposition, as did broader administration policies the union viewed as undermining collective bargaining rights and labor-law enforcement. The UA continues to endorse candidates from both major parties at the federal and state levels based on positions on prevailing-wage laws, apprenticeship policy, and infrastructure funding."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Generational Shift"
                    summary="Younger UA members are less willing to accept contracts that local leaders describe as historically generous."
                    body="The rank-and-file pressure that produced the Reno strike in 2024 reflects a broader generational shift within the union. Younger UA members, working in regions where non-union construction wages have closed significant ground over the past decade, are less willing to accept contracts that local leaders and employer associations describe as historically generous. The structural debates within the building trades — over no-strike clauses, over the role of joint labor-management bodies, over the balance between cooperative bargaining and direct membership militancy — are playing out within the UA in ways that will shape the union's posture through the rest of the decade."
                  />
                </Era>

                {/* CONCLUSION */}
                <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>137 Years In, Still Following the Pipe</h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    When P.J. Quinlan wrote to Richard A. O'Brien in early 1889 proposing a "United Brotherhood" of pipe trades workers, the United States was a country still being plumbed. Indoor sanitary fixtures were spreading from urban mansions to middle-class row houses. Steam heating was replacing coal stoves. Natural gas distribution networks were being built city by city. Each of these changes was being installed by tradesmen whose unions were small, fragmented, and frequently at odds with one another.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    What endured was the model the founders chose. A national jurisdiction broad enough to claim every kind of pipe work that could be conceived. A clearance-card mobility system that bound local unions into a single labor market. A heavy investment in apprenticeship as the source of bargaining power. A preference, after the Steamfitters' War, for institutional consolidation and disciplined bargaining. And a willingness, through the long partnership with the Mechanical Contractors Association, to trade some short-term leverage for long-term predictability.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                    The work that 2026 demands — fabricating high-purity gas systems for semiconductor fabs, welding cryogenic LNG export terminals, plumbing AI data centers, replacing lead service lines in older cities, and constructing the next generation of nuclear plants — is, fundamentally, the same work the founders set out to organize. The materials are unrecognizable to anyone who threaded pipe in 1889. The trade is not.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#3B9EFF', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(59,158,255,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}
