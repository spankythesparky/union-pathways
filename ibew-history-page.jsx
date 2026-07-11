        {page === "history-ibew-i" && (() => {
          const useScrollProgress = () => {
            const [progress, setProgress] = useState(0);
            useEffect(() => {
              const onScroll = () => {
                const el = document.getElementById('ibew-history-root');
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

          const ExpandableCard = ({ year, title, summary, body, accent = '#FA8059' }) => {
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
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #F5C518', background:'linear-gradient(90deg, rgba(245,197,24,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#F5C518', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#F5C518', children }) => (
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
            <div id="ibew-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #F5C518, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#F5C518'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The International Brotherhood of Electrical Workers</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Wired for the <span style={{color:'#F5C518'}}>Long Haul.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Born in a St. Louis dance hall, 1891.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  Few unions can claim to have grown up alongside an entire technology. When ten delegates met above Stolley's Dance Hall on November 21, 1891, most American homes had no electrical service — and the trade they were practicing was killing one in two of its workers within a career.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={887} label="Members and retirees" suffix="K" />
                  <StatBlock value={134} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={12} label="Years of consecutive growth" />
                  <StatBlock value={1972} label="Peak year — 1M members" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="1840s – 1880s" title="The Pre-Electrical World" intro="The IBEW's prehistory begins not with electricity but with the telegraph. When Samuel Morse's first commercial wires were strung between Washington and Baltimore in 1844, they brought with them the first generation of American workers whose job was to climb poles, string wire, and keep the system running.">
                  <ExpandableCard
                    year="1881"
                    title="Brotherhood of Telegraphers"
                    summary="One of the country's first specialty labor associations, affiliated with the Knights of Labor."
                    body="By the 1860s and 1870s, telegraph workers had formed some of the country's earliest specialty labor associations. Western Union crushed a major telegraphers' strike in 1883, and the early organizations were short-lived. But they laid the cultural groundwork — itinerant, skilled, fiercely independent — that would carry into the electrical trade a decade later."
                  />
                  <ExpandableCard
                    year="1880s"
                    title="The Deadliest Trade in America"
                    summary="Mortality rates among linemen approached one in two over the course of a career."
                    body="The arrival of practical incandescent lighting, electric streetcars, and central power stations transformed the work almost overnight. Telegraph wires carried small, low-voltage signals; the new electrical wires carried currents capable of killing a man instantly. Linemen routinely climbed poles strung with a tangle of telegraph, telephone, fire-alarm, streetcar, and high-voltage power lines — with no insulation standards, no rubber gloves, no safety harnesses, no formal training, and no legal protection. In city after city, the same pattern emerged: a handful of veteran linemen and wiremen, watching too many of their friends die, began to talk about organizing."
                  />
                </Era>

                <PullQuote attribution="The grim arithmetic of early electrical work">
                  Mortality rates among linemen approached one in two over the course of a career.
                </PullQuote>

                {/* PART II */}
                <Era tag="II" years="1890 – 1891" title="Henry Miller and the Founding" intro="Born on a ranch near Fredericksburg, Texas in 1853, Henry Miller had worked as a water boy on a government project stringing telegraph wires through the West before becoming a lineman himself. Tall, broad-shouldered, with reddish-brown hair and keen blue eyes — and possessed of what his contemporaries described as boundless energy. He was a widower with no known family ties; the trade was effectively his entire life.">
                  <ExpandableCard
                    year="1890"
                    title="St. Louis Local 5221"
                    summary="Miller and a small group of local electrical workers concluded they needed a union."
                    body="In 1886, Miller arrived in St. Louis and took work with the municipal power company. In 1890, while working at the St. Louis Exposition Hall, he and a small group of fellow electrical workers came together. With help from American Federation of Labor organizer Charles Kassel, the group was chartered as Electrical Wiremen and Linemen's Union, AFL Federal Labor Union No. 5221. But Miller understood from the start that a single local in a single city could accomplish little against the rapidly consolidating corporate empires building America's electrical grid. Only a national union could bargain on equal terms."
                  />
                  <ExpandableCard
                    year="1890-91"
                    title="Riding the Rails"
                    summary="Miller spent a year on the road, hiding from railroad police, organizing city by city."
                    body="He rode freight trains — often hiding from the railroad police, the 'bulls' who would have arrested him for unauthorized travel — carrying his tools and a change of shirts in an old carpetbag. In city after city, he found electrical workers, worked alongside them long enough to organize them, and moved on. By the autumn of 1891, locals had been chartered or were forming in Chicago, Milwaukee, Indianapolis, Evansville, Louisville, New Orleans, Cincinnati, Toledo, Pittsburgh, Philadelphia, Duluth, and New York."
                  />
                  <ExpandableCard
                    year="Nov 21, 1891"
                    title="Above Stolley's Dance Hall"
                    summary="Ten delegates representing 286 members. They drafted a constitution, by-laws, ritual, and emblem — the famous fist grasping lightning bolts."
                    body="Miller, J.T. Kelly, and William Hedden of St. Louis; T.J. Finnell of Chicago; F.J. Heizleman of Toledo; E.C. Hartung of Indianapolis; Harry Fisher of Evansville; and J.C. Sutter, Joseph Berlovitz, and James Dorsey representing other locals by proxy. Miller's own handwritten report of that first convention captures the mood: the delegates spent days hiding from reporters and trying to make it appear they had a great delegation. For seven days and nights, they drafted the constitution. They named the new organization the National Brotherhood of Electrical Workers and elected Miller, then 33, as Grand President on the fourth round of balloting. Two weeks later, on December 7, 1891, the AFL granted the Brotherhood a charter."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1892 – 1903" title="Early Struggles" color="#FA8059" intro="The young Brotherhood almost did not survive its first decade. The Panic of 1893 devastated the new union — locals folded, dues went unpaid, and by 1895 only twelve delegates answered the convention roll call. Strength of the early officers and a handful of dedicated locals were the only forces keeping it alive.">
                  <ExpandableCard
                    year="July 10, 1896"
                    accent="#FA8059"
                    title="Henry Miller Dies on the Job"
                    summary="Working as a lineman in Washington, D.C., he was electrocuted and fell from a utility pole."
                    body="He was 43 years old, and the union he had founded was barely five. The IBEW today commemorates July 10 as National Lineworker Appreciation Day in his memory; bipartisan resolutions have been introduced in both the U.S. House and Senate to make the designation permanent. The man who had ridden freight trains across the country to organize his trade died practicing it, on a pole, in the city where the union now had its national charter."
                  />
                  <ExpandableCard
                    year="1899"
                    accent="#FA8059"
                    title="Becomes the International Brotherhood"
                    summary="Renamed at the Pittsburgh convention, recognizing the locals being chartered in Canada."
                    body="The 'I' in IBEW reflects the union's expansion into Canada — and, eventually, Guam, Panama, Puerto Rico, and the U.S. Virgin Islands. The international jurisdiction would prove decisive over the next century: the union could follow the technology wherever it went, and bargain on a continental scale rather than be played off region against region."
                  />
                  <ExpandableCard
                    year="1903"
                    accent="#FA8059"
                    title="The First Paid Grand President"
                    summary="Frank J. McNulty, an inside wireman, became the IBEW's first full-time, paid leader."
                    body="Until then, every officer had been a working electrical worker holding union responsibilities on the side. With paid leadership, the IBEW could finally function as a continuous national institution rather than an annual convention with offshoots. By 1905, dues-paying membership had reached 24,000."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="1908 – 1913" title="The Reid-Murphy Split" color="#E74C3C" intro="The IBEW's first existential crisis came not from employers but from itself. By 1908, the union was outwardly successful: paid officers, a treasury balance, growing membership. Underneath, three sets of tensions were grinding against each other — and they would split the Brotherhood in two for five years.">
                  <ExpandableCard
                    year="1908"
                    accent="#E74C3C"
                    title="Two Unions Called the IBEW"
                    summary="In September 1908, opposition delegates held a special convention in Pittsburgh."
                    body="The structural tensions: inside wiremen and outside linemen had different jobs, different wage scales, different employers. Wiremen tended to dominate leadership; linemen, often more militant, increasingly felt unheard. The geographic tensions: the Pacific District Council had built an aggressive, contract-oriented model; eastern leadership preferred slower bargaining. The personal tensions: a former Grand Treasurer had been removed for financial irregularities, and his supporters became a permanent opposition faction. Opposition delegates refused to recognize Frank McNulty and elected J.J. Reid, a former Ohio lineman, as president, and James W. Murphy as secretary. Both factions secured court injunctions. AFL President Samuel Gompers tried to mediate, failed, and ultimately recognized the McNulty-Collins group as the legitimate IBEW."
                  />
                  <ExpandableCard
                    year="1908-1913"
                    accent="#E74C3C"
                    title="Five Years of Civil War"
                    summary="Two organizations called themselves the IBEW. Rival conventions, rival journals, rival contracts."
                    body="The Reid-Murphy IBEW, which by some accounts controlled roughly three-quarters of the active electrical workers in the United States and Canada, doubled down on a district-council structure and on aggressive utility organizing — including a 1913 strike against PG&E. The McNulty IBEW, smaller but AFL-recognized, dismantled the district-council system and concentrated authority in the international office. The split ended only by court order: in February 1912, an Ohio court declared the 1908 secession convention illegal; in August 1913, the Ohio Supreme Court issued the final ruling, ordering the Reid faction to stop using the IBEW name. McNulty immediately invited the seceding locals to return without penalty. More than 100 ultimately did, though the wounds in many local cultures took a generation to heal."
                  />
                </Era>

                <PullQuote attribution="The institutional lesson the IBEW carried forward">
                  The Reid-Murphy split remains the most serious internal crisis in the union's history — and the reason the modern IBEW prizes institutional stability above factional militancy.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="1914 – 1929" title="The Open Shop Era and the Council on Industrial Relations" intro="The reunified IBEW emerged into a world being transformed by war. American entry into World War I in 1917 put unprecedented demand on the electrical trades, and federal pressure on employers to recognize unions sent IBEW membership surging. The 1920s reversed every gain.">
                  <ExpandableCard
                    year="1921"
                    title="The American Plan"
                    summary="A coordinated national campaign for the open shop, led by the U.S. Chamber of Commerce."
                    body="Pacific Gas & Electric — one of the chamber's principal members — canceled its agreement with the IBEW in 1921. PG&E linemen would not have a union contract again for twelve years, with wages frozen at $170 per month through much of the decade. Employers' associations launched 'open shop' campaigns nationally — workplaces in which union membership could neither be required nor effectively defended. Through the 1920s, IBEW membership stagnated and in some sectors collapsed."
                  />
                  <ExpandableCard
                    year="1919-20"
                    title="The Council on Industrial Relations"
                    summary="A bipartite body of union and management reps with authority to resolve disputes that local bargaining could not."
                    body="Faced with a hostile climate, the IBEW and the National Electrical Contractors Association created what would become the Council on Industrial Relations for the Electrical Contracting Industry. The Council still functions today, and it has resolved the great majority of would-be strikes in the IBEW's construction jurisdiction for over a century. It is one reason the IBEW's strike history, especially in inside construction, is sparser than that of unions like the UAW or Teamsters: most IBEW contracts simply do not allow strikes during the term of an agreement, sending impasses to the Council instead. Critics within the IBEW have long argued this gives away too much worker leverage. Supporters argue it is precisely why the union has labor agreements where many others do not."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="1929 – 1945" title="The Wagner Act Era" color="#22c55e" intro="The Depression nearly broke the building trades. Electrical construction work largely stopped between 1930 and 1933. IBEW locals across the country saw membership cut in half. The political response to the crisis would, within a decade, transform the union beyond recognition.">
                  <ExpandableCard
                    year="1935"
                    accent="#22c55e"
                    title="The Wagner Act Opens the Floodgates"
                    summary="Federal protection for the right to organize that the open-shop drive of the 1920s had stolen."
                    body="Utility workers, electrical manufacturing employees, and broadcast technicians who had been impossible to organize against employer resistance now had legal protection, and the IBEW moved aggressively into all three sectors. Through the late 1930s and the war years, it organized utilities like Consolidated Edison in New York, won representation at major electrical manufacturers, and chartered the broadcast-technicians locals that would eventually represent television and radio workers across the country."
                  />
                  <ExpandableCard
                    year="Sep 1941"
                    accent="#22c55e"
                    title="National Apprenticeship Standards"
                    summary="The IBEW-NECA partnership built one of the largest apprenticeship and training systems in the country."
                    body="Working with the Federal Committee on Apprenticeship, the IBEW and NECA established the National Apprenticeship Standards for the Electrical Construction Industry. Under what would become the National Joint Apprenticeship and Training Committee — today rebranded as the electrical training ALLIANCE — the partnership built a five-year program for inside wiremen combining classroom instruction with paid on-the-job training, fully employer-funded through contractually negotiated training contributions. The 'earn while you learn' model — apprentices working at a percentage of journey scale that rises year by year — became a template for skilled-trades training across North America. It is, arguably, the IBEW's most important single institutional creation, more durable than any contract."
                  />
                </Era>

                {/* MID PEAK STATS */}
                <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(245,197,24,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{textAlign:'center', marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2, textTransform:'uppercase'}}>The Peak — 1972</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>One Million Strong</h3>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:8}}>
                    <StatBlock value={1} label="Million members at peak" suffix="M" />
                    <StatBlock value={1959} label="Industrial-electronics course" />
                    <StatBlock value={1966} label="Industrial nuclear course" />
                    <StatBlock value={40} label="Electrical construction share" suffix="%" />
                  </div>
                </div>

                {/* PART VII */}
                <Era tag="VII" years="1945 – 1972" title="Postwar Expansion" color="#22c55e" intro="The quarter-century following World War II was the IBEW's golden age. Suburbanization, the interstate highway system, the cold-war defense build-up, the explosion of consumer electrical goods, the wiring of rural America under continuing rural electrification programs, the build-out of national television networks, and the construction of the country's first generation of nuclear power plants all pushed demand for electrical workers to historic highs.">
                  <ExpandableCard
                    year="1947-72"
                    accent="#22c55e"
                    title="The Inside Wireman's Era"
                    summary="Membership climbed steadily, reaching approximately one million in 1972."
                    body="Inside wiremen built the office towers, hospitals, schools, and shopping malls of postwar America. Outside linemen strung the transmission lines that linked the country into integrated power grids. Telephone workers, especially at AT&T's Bell System, became one of the union's largest single concentrations. Broadcast technicians wired the rapidly expanding television industry. The IBEW added a national industrial-electronics training course in 1959, and an industrial nuclear power course in 1966, keeping its training infrastructure ahead of the technological curve."
                  />
                  <ExpandableCard
                    year="1947"
                    accent="#22c55e"
                    title="Surviving Taft-Hartley"
                    summary="The 1947 act banned closed shops, allowed right-to-work laws, restricted secondary boycotts."
                    body="Taft-Hartley imposed real costs but did not derail growth. The IBEW's strength in the high-skill end of the construction market, where contractors needed reliable, trained, certified workers and were willing to pay union scale to get them, gave it a structural advantage that more easily replaced industrial unions did not have. Even in right-to-work states, the IBEW's apprenticeship pipeline made it the dominant supplier of skilled electricians in many local markets — and that market dominance was the institutional foundation that the next several decades would test."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="1972 – 2000s" title="Deregulation and Decline" color="#9CA3AF" intro="The IBEW's slow decline began at the very moment of its peak. The 1970s combination of stagflation, the 1973 oil shock, foreign competition in electrical manufacturing, and a sustained employer offensive against unions across the construction industry put pressure on every part of the Brotherhood's footprint.">
                  <ExpandableCard
                    year="1970s-80s"
                    accent="#9CA3AF"
                    title="The Merit Shop Rises"
                    summary="Open-shop contractors expanded aggressively, particularly through the Associated Builders and Contractors trade group."
                    body="In many regions, the IBEW's market share in electrical construction fell from near-total dominance to something closer to parity. By 1988, only about 30 percent of American construction work was unionized; the IBEW retained roughly 40 percent of electrical-related construction, but the overall market had shifted, and the long postwar pattern of automatic union renewal at major projects was breaking."
                  />
                  <ExpandableCard
                    year="1982"
                    accent="#9CA3AF"
                    title="The AT&T Breakup"
                    summary="The single most damaging blow came from outside the construction industry."
                    body="The court-ordered breakup of AT&T at the end of 1982 — the divestiture of the Bell System into seven regional operating companies — fundamentally restructured the telecommunications industry, in which the IBEW was deeply organized both among telephone workers and in AT&T's Western Electric manufacturing facilities. The downstream consequences played out over the following two decades: aggressive cost-cutting, plant closures, offshoring of manufacturing, and successive waves of layoffs that shrank the IBEW's telecom and manufacturing membership by hundreds of thousands."
                  />
                  <ExpandableCard
                    year="1990s-2000s"
                    accent="#9CA3AF"
                    title="Utility Deregulation"
                    summary="Vertically integrated utilities that had once employed large, stable IBEW workforces were broken up."
                    body="Generation was often spun off to competitive markets. Mergers consolidated workforces. Outsourcing moved work to non-union contractors. The 2001 collapse of Enron and the broader deregulation backlash slowed but did not reverse the trend. By the early 2000s, IBEW membership had fallen well below its 1972 peak — though construction held up better than utilities, and utilities better than manufacturing or telecommunications."
                  />
                </Era>

                {/* PART IX */}
                <Era tag="IX" years="2000s – Early 2020s" title="Reinvention" intro="The IBEW's response to the post-deregulation landscape was, in retrospect, a quiet reinvention. Rather than trying to defend a shrinking industrial footprint, the union leaned hard into the parts of the electrical economy that were growing — and into the political work necessary to make sure those new sectors were built with union labor.">
                  <ExpandableCard
                    year="2000s-2010s"
                    title="Renewable Energy Training"
                    summary="$140 million committed nationally to renewable-energy training, fully labor-management funded."
                    body="Long before 'green jobs' became a national political theme, the IBEW and NECA had begun investing heavily in renewable training. The St. Louis IBEW/NECA Electrical Industry Training Center began producing journey workers proficient in solar, wind, and other green-energy installations in the 2000s. By the 2010s, IBEW/NECA had committed roughly $140 million nationally — fully funded by the labor-management partnership without taxpayer support. The union also helped develop the first national Electric Vehicle Infrastructure Training Program (EVITP) for charging-station installation, which by the early 2020s had become the de facto standard for utility and government-funded EV-charging projects."
                  />
                  <ExpandableCard
                    year="2021-22"
                    title="Federal Legislation Wins"
                    summary="Bipartisan Infrastructure Law, CHIPS Act, Inflation Reduction Act."
                    body="IBEW lobbying was central to the labor-standards provisions in the Bipartisan Infrastructure Law (2021), the CHIPS and Science Act (2022), and the Inflation Reduction Act (2022). Each contained registered-apprenticeship requirements, prevailing-wage rules, and project-labor-agreement preferences that effectively channeled tens of billions of dollars in federal infrastructure, semiconductor, and clean-energy spending toward the unionized building trades. New Jersey Local 351 member Donald Norcross, the only IBEW member in Congress, has been a key legislative ally."
                  />
                  <ExpandableCard
                    year="2024"
                    title="First New Retirement Benefit Since 1946"
                    summary="The IBEW upgraded pension benefits and created a new retirement benefit."
                    body="The first significant retirement-benefit upgrade in 78 years. It came at the same moment the union was reporting twelve consecutive years of membership growth — a recovery that began quietly in the early 2010s and accelerated through the late 2010s and 2020s."
                  />
                </Era>

                {/* CURRENT-DAY DASHBOARD */}
                <div style={{margin:'80px 0 40px', padding:'40px 28px', background:'linear-gradient(135deg, rgba(245,197,24,0.08) 0%, rgba(250,128,89,0.08) 100%)', borderRadius:24, border:'1px solid rgba(245,197,24,0.2)'}}>
                  <div style={{textAlign:'center', marginBottom:32}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:3, textTransform:'uppercase'}}>Where the IBEW Stands Now</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'#fff', margin:'12px 0 0 0'}}>The Brotherhood in 2026</h2>
                    <p style={{fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:600, margin:'12px auto 0', lineHeight:1.6}}>Industries booming, political environment hostile, growth trajectory the steepest in fifty years.</p>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:24}}>
                    <StatBlock value={887} label="Active members + retirees" suffix="K" />
                    <StatBlock value={12} label="Years of consecutive growth" />
                    <StatBlock value={1} label="Million-member target" suffix="M" />
                    <StatBlock value={3} label="Times more apprentices in data-center hubs" suffix="x" />
                  </div>
                </div>

                {/* PART X */}
                <Era tag="X" years="2025 – 2026" title="The Present Day" intro="The IBEW enters 2026 in a peculiar position. Membership has climbed from 775,000 a few years ago to approximately 887,000. International President Cooper has stated publicly that the union has grown for twelve consecutive years and has been recruiting tens of thousands of new electrical workers annually, at rates not seen in more than fifty years.">
                  <ExpandableCard
                    year="2024-26"
                    title="The Data Center Boom"
                    summary="The single most consequential change in IBEW's recent work environment."
                    body="Locals in Northern Virginia, central Maryland, Phoenix, central Texas, and Atlanta are managing project pipelines at unprecedented scale, with major data center campuses requiring hundreds and potentially thousands of electrical workers across the life of a project. Local apprenticeships in data-center-heavy regions have nearly tripled. The work has become an organizing tool in itself: the prospect of journeyman wages on multi-billion-dollar campuses has become one of the most effective recruitment pitches the union has had in a generation."
                  />
                  <ExpandableCard
                    year="Feb 2025"
                    title="Local 1049 Strike Authorization"
                    summary="409-to-6 vote to authorize a strike at New York metro gas power plants."
                    body="One of the strongest pro-strike signals in the union's recent utility bargaining history. Most IBEW agreements still go through the Council on Industrial Relations rather than to the picket line, but the 2024-2026 period saw an unusual number of high-profile contract fights at the union's edges."
                  />
                  <ExpandableCard
                    year="Mar 2026"
                    title="PECO — Hours From a First-Ever Strike"
                    summary="1,500 IBEW Local 614 utility workers in Philadelphia."
                    body="Linemen, gas mechanics, customer-service representatives, and others, pressing for retirement-benefit parity with the company's foremen and executives. The IBEW came within hours of its first-ever strike against PECO."
                  />
                  <ExpandableCard
                    year="Dec 31, 2025"
                    title="Local 1245 — PG&E Contract Expires"
                    summary="12,000 lineworkers at California's largest utility. Local 1245 last formally struck in the 1920s."
                    body="Rank-and-file activists in multiple IBEW utility locals have been openly campaigning to win back the right to strike during contract terms — a structural change that would reshape the union's bargaining culture, and one of the most contested questions inside the modern Brotherhood."
                  />
                  <ExpandableCard
                    year="Sep 2026"
                    title="The 41st International Convention"
                    summary="San Diego, September 21-25. The union's highest governing body, held every five years."
                    body="The 41st International Convention comes at a moment when many of the questions the IBEW has navigated for a century — the relationship to no-strike clauses and the Council on Industrial Relations, the balance between construction and 'P&I' branches, the union's posture on emerging technologies, the path back to a million members — are all on the table simultaneously."
                  />
                </Era>

                {/* CONCLUSION */}
                <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>134 Years In, Still Following the Electrons</h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    When Henry Miller and nine other men gathered above Stolley's Dance Hall in November 1891, the United States produced almost no electricity. The country they imagined wiring up did not yet exist. The technologies they would spend their careers installing were either brand new or still on the drawing board. The trade itself was so dangerous that Miller would be dead within five years, and the union he founded would nearly die with him.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    What endured was the model the founders chose. A national jurisdiction broad enough to follow the technology wherever it went. A heavy investment in training as the source of bargaining power. A preference, after the Reid-Murphy split, for institutional stability and disciplined bargaining over factional militancy. A willingness, through the Council on Industrial Relations, to trade some short-term leverage for long-term predictability with employer partners.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                    The work that 2026 demands — wiring data centers for an AI economy, building out transmission for renewable generation, electrifying the vehicle fleet, constructing the next generation of nuclear plants, fabricating semiconductors — is, fundamentally, the same work the founders set out to organize. The technologies are unrecognizable to anyone who climbed a pole in 1891. The trade is not.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#F5C518', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(245,197,24,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}
