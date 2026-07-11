// /home/claude/history-page.jsx — content for fix102.js to inject
// This is a TEMPLATE STRING source. Will be loaded as text and embedded by fix102.

        {page === "history" && (() => {
          const useScrollProgress = () => {
            const [progress, setProgress] = useState(0);
            useEffect(() => {
              const onScroll = () => {
                const el = document.getElementById('history-root');
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

          const FadeIn = ({ children, delay = 0 }) => {
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
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #FA8059', background:'linear-gradient(90deg, rgba(250,128,89,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#FA8059', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#FA8059', children }) => (
            <FadeIn>
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
            </FadeIn>
          );

          const scrollProgress = useScrollProgress();

          return (
            <div id="history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #FA8059, #F5C518)', transition:'width 0.1s'}} />
              </div>

              {/* HERO */}
              <div style={{padding:'80px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <FadeIn>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Long Arc of Organized Labor</div>
                  <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                    Built by <span style={{color:'#FA8059'}}>Union Hands.</span><br/>
                    <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Forged in Conflict.</span>
                  </h1>
                  <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                    From medieval guilds to Amazon warehouses, the story of organized labor is the story of who decides the terms of a person's work. It's a centuries-long contest of riots, reforms, betrayals, and breakthroughs — and it's still being written.
                  </p>
                </FadeIn>
              </div>

              {/* TIMELINE TICKER */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', overflow:'hidden'}}>
                <div style={{display:'flex', justifyContent:'space-between', maxWidth:1200, margin:'0 auto', flexWrap:'wrap', gap:16}}>
                  {[
                    { year:'1349', label:'First strikes' },
                    { year:'1834', label:'Tolpuddle Martyrs' },
                    { year:'1886', label:'Haymarket' },
                    { year:'1911', label:'Triangle Fire' },
                    { year:'1935', label:'Wagner Act' },
                    { year:'1937', label:'Flint sit-down' },
                    { year:'1947', label:'Taft-Hartley' },
                    { year:'1981', label:'PATCO' },
                    { year:'2018', label:'Janus' },
                    { year:'2023', label:'Summer of strikes' },
                  ].map((m, i) => (
                    <div key={i} style={{textAlign:'center', flex:'1 1 90px', minWidth:80}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:'#FA8059'}}>{m.year}</div>
                      <div style={{fontSize:10, color:'rgba(160,180,196,0.7)', textTransform:'uppercase', letterSpacing:0.5, marginTop:2}}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="Medieval Era – 1700s" title="Pre-Industrial Roots" intro="Long before the word 'union' existed, European workers organized through craft guilds. By the 12th century, masters of trades like masonry, weaving, and metalwork had formed self-governing associations that controlled training, set quality standards, and limited entry to their professions. Beneath every guild master sat journeymen — fully trained workers who couldn't afford their own shops — and as the path from journeyman to master narrowed, journeymen began forming their own associations, often in conflict with the masters above them.">
                  <ExpandableCard
                    year="1349"
                    title="London Cordwainers' Walkout"
                    summary="One of the earliest documented strikes in European history."
                    body="Journeymen shoemakers in 14th-century London staged a collective walkout that already showed the basic grammar of labor action — collective refusal to work over wages, hours, or conditions. A 14th-century strike of Parisian saddlers' apprentices used the same playbook. The tactics were already in place; only the legal recognition was missing."
                  />
                  <ExpandableCard
                    year="1799-1800"
                    title="The Combination Acts"
                    summary="Britain made it illegal for workers to unite for higher wages."
                    body="The British state recognized that workers, if allowed to combine, could meaningfully shift bargaining power — and chose to come down firmly on the employers' side. Workers faced criminal penalties for organizing, while employers were largely free to coordinate against them. That asymmetry would define labor law for the next century."
                  />
                </Era>

                <PullQuote attribution="The pattern that would shape labor law for a century">
                  Workers who united faced criminal penalties; employers who coordinated against them faced none.
                </PullQuote>

                {/* PART II */}
                <Era tag="II" years="Late 1700s – Mid 1800s" title="The Industrial Revolution" color="#F5C518" intro="The Industrial Revolution transformed the workshop into the factory and the artisan into the wage worker. Hours stretched to twelve, fourteen, sometimes sixteen per day. Children as young as six worked in mines and mills. Wages floated at subsistence. In response, workers built new institutions adapted to factory life — and faced down the same legal hostility that confronted their counterparts a generation earlier.">
                  <ExpandableCard
                    year="1834"
                    accent="#F5C518"
                    title="The Tolpuddle Martyrs"
                    summary="Six Dorset farm laborers transported to Australia for forming a union."
                    body="Their crime was swearing a secret oath to form a friendly society of agricultural laborers. They became early martyrs of the British movement and rallying figures for organized labor across the English-speaking world. The case made clear that even where Combination Acts had been repealed, the state had other tools to crush organizing — and that workers would have to push back politically as well as industrially."
                  />
                  <ExpandableCard
                    year="1848"
                    accent="#F5C518"
                    title="The Communist Manifesto"
                    summary="Karl Marx and Friedrich Engels reframed workers as a class with shared interests across borders."
                    body="The manifesto's most enduring legacy on the labor movement was less its specific program than its reframing of workers as a coherent class with shared interests across borders, industries, and trades. That idea would resurface again and again in union organizing — from the Knights of Labor's inclusive vision to the IWW's 'One Big Union' to today's cross-border solidarity campaigns."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1790s – 1860s" title="American Beginnings" intro="The first sustained American unions emerged in the 1790s among skilled urban craftsmen — Philadelphia shoemakers, New York printers, Boston carpenters. They were small, localized, and focused on specific crafts, but they conducted strikes, set wage scales, and built strike funds. They also ran headlong into the same legal hostility their British counterparts faced.">
                  <ExpandableCard
                    year="1806"
                    title="The Philadelphia Cordwainers Trial"
                    summary="Workers who combined to raise wages were ruled guilty of 'criminal conspiracy.'"
                    body="The doctrine established in this trial would haunt American labor for nearly a century. Under common law, the very act of workers organizing for higher pay was treated as a crime. Strikes were not just unprotected — they were prosecutable. This is the legal environment in which every subsequent American union had to operate."
                  />
                  <ExpandableCard
                    year="1842"
                    title="Commonwealth v. Hunt"
                    summary="Often called the Magna Carta of American labor."
                    body="The Massachusetts Supreme Judicial Court ruled that unions were not inherently illegal and that strikes for legitimate purposes were lawful. It was a foundational decision, but its protections were thin and inconsistently applied across states. Workers had won the right to exist on paper; they would spend the next century fighting for the right to act."
                  />
                  <ExpandableCard
                    year="1866"
                    title="The National Labor Union"
                    summary="The first attempt at a truly national, multi-trade federation."
                    body="The NLU pushed for the eight-hour day — a demand that would become labor's North Star for the next half-century — but it folded by 1873, undone by the depression of that year and its own drift into politics. Its successors would learn that bargaining leverage came from organizing around specific trades, not broad ideological visions."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="1869 – 1900" title="The Gilded Age" color="#E74C3C" intro="The Knights of Labor opened American labor's most ambitious experiment in inclusive organizing — welcoming skilled and unskilled, men and women, Black and white into a single organization aimed at remaking industrial society. Stepping into the vacuum after their collapse came the American Federation of Labor, with the opposite approach: skilled workers only, narrow 'bread and butter' goals, and a ruthless pragmatism that would define American labor for the next half-century.">
                  <ExpandableCard
                    year="1877"
                    accent="#E74C3C"
                    title="The Great Railroad Strike"
                    summary="Paralyzed the country, was crushed by federal troops, left more than 100 workers dead."
                    body="The strike exposed the pattern that would define Gilded Age labor relations: companies could rely on private armies, court injunctions, and federal force to break strikes, while workers had little legal recourse and no recognized right to organize. That asymmetry of force shaped the bitter character of American labor relations for generations."
                  />
                  <ExpandableCard
                    year="1886"
                    accent="#E74C3C"
                    title="Haymarket Square"
                    summary="A bombing at a Chicago rally for the eight-hour day killed seven police officers."
                    body="Eight anarchists were tried, four were hanged, and the Knights of Labor — wrongly but indelibly associated with the violence in the public mind — collapsed. At their 1886 peak, the Knights had claimed nearly 800,000 members. By 1900, the organization was effectively gone. The American Federation of Labor, founded the same year by cigar maker Samuel Gompers, would step into the vacuum."
                  />
                  <ExpandableCard
                    year="1892"
                    accent="#E74C3C"
                    title="The Homestead Strike"
                    summary="Steelworkers fought a pitched battle against 300 Pinkerton agents."
                    body="At Andrew Carnegie's Homestead plant near Pittsburgh, workers struck against wage cuts. Carnegie's manager Henry Clay Frick brought in Pinkertons, who exchanged gunfire with strikers in a battle that killed at least nine workers and seven Pinkertons before the state militia broke the strike. Homestead became a symbol of how far companies would go to break unions — and how isolated workers were from any legal protection."
                  />
                  <ExpandableCard
                    year="1894"
                    accent="#E74C3C"
                    title="The Pullman Strike"
                    summary="Eugene V. Debs went to prison and emerged a socialist."
                    body="Debs's American Railway Union led a sympathy strike with Pullman Palace Car Company workers. President Grover Cleveland sent in federal troops, the strike was broken, and Debs went to prison. He emerged a socialist — and would later run for president from a federal prison cell, winning nearly a million votes in 1920."
                  />
                </Era>

                <PullQuote attribution="The shape of Gilded Age labor">
                  Companies could rely on private armies, court injunctions, and federal force. Workers had little legal recourse and no recognized right to organize.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="1900 – 1929" title="The Progressive Era" intro="Two parallel labor stories ran through the early 20th century. The AFL grew steadily, consolidating its grip on skilled trades and accumulating modest political influence. A far more radical current — the Industrial Workers of the World, founded in 1905 — pushed against both employers and the AFL itself, organizing all workers regardless of skill, race, or sex.">
                  <ExpandableCard
                    year="1905"
                    title="The IWW — One Big Union"
                    summary="Socialists, anarchists, and unionists rejected the AFL's craft-by-craft approach."
                    body="The Wobblies led dramatic strikes in textile mills (Lawrence, 1912), silk mills (Paterson, 1913), and lumber camps across the Pacific Northwest. Their songs, multilingual organizing, and inclusion of women and workers of color made them culturally influential far beyond their membership numbers. Federal prosecutions during and after World War I — including imprisonment of leaders under the Espionage Act — effectively destroyed the organization by the early 1920s."
                  />
                  <ExpandableCard
                    year="1911"
                    title="The Triangle Shirtwaist Factory Fire"
                    summary="146 garment workers died trapped behind locked doors."
                    body="The fire killed mostly young immigrant women and became a defining event in New York City politics. It fueled the rise of Frances Perkins, who would later become FDR's Secretary of Labor and the first woman in a U.S. cabinet. The tragedy laid the groundwork for state-level workplace safety laws and crystallized public support for the regulation of working conditions."
                  />
                  <ExpandableCard
                    year="1919-1920"
                    title="The Red Scare and the Backlash"
                    summary="Postwar reaction crushed labor radicals and the steel strike."
                    body="World War I had temporarily strengthened unions through federal mediation boards, and AFL membership doubled. The Red Scare reversed course brutally. Through the 1920s — the era of the 'American Plan' — corporations promoted company unions and 'open shops' while courts issued injunctions against virtually any meaningful labor action. By 1929, AFL membership had fallen sharply, and unions covered roughly 10 percent of the nonagricultural workforce."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="1929 – 1945" title="The New Deal Transformation" color="#22c55e" intro="The most consequential period in American labor history. The economic collapse of 1929 discredited the laissez-faire orthodoxy that had hobbled unions for decades, and the Roosevelt administration moved — sometimes hesitantly, sometimes boldly — to rewrite the rules of the workplace.">
                  <ExpandableCard
                    year="1932"
                    accent="#22c55e"
                    title="The Norris-LaGuardia Act"
                    summary="Stripped federal courts of much of their power to issue anti-strike injunctions."
                    body="For half a century, court injunctions had been the most effective tool for crushing strikes. Norris-LaGuardia ended that — and signaled that the political winds were shifting. The act was the first major federal recognition that workers had the right to act collectively without judicial interference."
                  />
                  <ExpandableCard
                    year="1935"
                    accent="#22c55e"
                    title="The Wagner Act"
                    summary="The closest thing American labor has to a constitution."
                    body="The National Labor Relations Act guaranteed private-sector workers the right to form unions, established the National Labor Relations Board to supervise union elections and adjudicate unfair labor practices, and barred employers from firing workers for organizing or refusing to bargain in good faith. Within two years, the Supreme Court upheld it in NLRB v. Jones & Laughlin Steel — and the floodgates opened."
                  />
                  <ExpandableCard
                    year="1936-37"
                    accent="#22c55e"
                    title="The Flint Sit-Down Strike"
                    summary="44 days of factory occupation forced GM to recognize the UAW."
                    body="Autoworkers at General Motors plants in Flint, Michigan refused to leave their factories until the company recognized the United Auto Workers. GM capitulated in February 1937. Within months, U.S. Steel — long the most union-resistant company in America — voluntarily recognized the Steel Workers Organizing Committee. Industrial unionism, long blocked by the AFL's craft orientation, had arrived."
                  />
                  <ExpandableCard
                    year="1945"
                    accent="#22c55e"
                    title="The Wartime Peak"
                    summary="Union membership reached nearly 35 percent of the nonagricultural workforce."
                    body="The federal government, desperate for industrial production, struck a grand bargain with unions: in exchange for no-strike pledges, the National War Labor Board imposed 'maintenance of membership' provisions that effectively required new hires to join existing unions. By war's end, union density had reached the highest level in American history."
                  />
                </Era>

                {/* STATS BREAK */}
                <FadeIn>
                  <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(34,197,94,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{textAlign:'center', marginBottom:24}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:2, textTransform:'uppercase'}}>The Postwar Peak</div>
                      <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>By the Numbers</h3>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:8}}>
                      <StatBlock value={35} label="Peak union density" suffix="%" />
                      <StatBlock value={5} label="Million workers struck in 1946" suffix="M+" />
                      <StatBlock value={28} label="Right-to-work states" />
                      <StatBlock value={381} label="Major work stoppages in 1970" />
                    </div>
                  </div>
                </FadeIn>

                {/* PART VII */}
                <Era tag="VII" years="1945 – 1970s" title="The Postwar Golden Age" color="#22c55e" intro="The first years after the war were paradoxical. 1946 saw the largest strike wave in American history — more than five million workers walked off the job in coal, steel, auto, electrical manufacturing, and rail. The strikes won significant wage gains and cemented unions as central institutions of the postwar economy. They also provoked a political backlash that would shape labor for the rest of the century.">
                  <ExpandableCard
                    year="1947"
                    accent="#22c55e"
                    title="The Taft-Hartley Act"
                    summary="The labor movement's most consequential legislative defeat."
                    body="Passed over President Truman's veto, Taft-Hartley amended the Wagner Act to ban 'closed shops,' authorize states to pass right-to-work laws, allow employers to campaign actively against unions during organizing drives, and require union officers to sign anti-communist affidavits. Twenty-eight states would eventually pass right-to-work laws, mostly in the South and Mountain West, creating an uneven legal terrain that persists today."
                  />
                  <ExpandableCard
                    year="1950"
                    accent="#22c55e"
                    title="The Treaty of Detroit"
                    summary="A five-year UAW-GM contract that became the template of the middle class."
                    body="Regular productivity-tied wage increases. Employer-paid health insurance. Defined-benefit pensions. Cost-of-living adjustments. Grievance procedures. These benefits were largely confined to unionized workers in unionized industries — but they were widely emulated by nonunion employers eager to keep unions out, and they became the foundation of the postwar middle class for generations."
                  />
                  <ExpandableCard
                    year="1962-68"
                    accent="#22c55e"
                    title="Public-Sector Breakthrough"
                    summary="Teachers, sanitation workers, police, and firefighters organized in unprecedented numbers."
                    body="President Kennedy's Executive Order 10988 in 1962 granted federal workers limited collective bargaining rights, and a wave of state laws followed. The 1968 Memphis sanitation workers' strike — during which Martin Luther King Jr. was assassinated while supporting the strikers — fused the labor and civil rights movements at one of the era's most piercing moments."
                  />
                  <ExpandableCard
                    year="1965-73"
                    accent="#22c55e"
                    title="The United Farm Workers"
                    summary="Cesar Chavez and Dolores Huerta organized workers explicitly excluded from the Wagner Act."
                    body="The grape boycotts of the late 1960s and early 1970s, supported by tens of millions of consumers nationwide, won the first major contracts for predominantly Latino farmworkers in California — workers the Wagner Act had explicitly excluded from its protections. The campaign showed that consumer solidarity could substitute for legal protection in pressuring employers."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="1980s – 2000s" title="Decline and Restructuring" color="#9CA3AF" intro="By the early 1970s, the foundations of the golden age were cracking. Foreign competition eroded American manufacturing dominance. The 1973 oil shock shattered the postwar economic consensus. And in industries from steel to auto to textiles, employers began searching in earnest for ways to escape the high-wage, high-benefit contracts that unions had built.">
                  <ExpandableCard
                    year="1981"
                    accent="#9CA3AF"
                    title="PATCO — The Symbolic Break"
                    summary="13,000 air traffic controllers walked out. Reagan fired more than 11,000 of them."
                    body="When the federal air traffic controllers struck demanding better pay and shorter hours, President Reagan — himself a former Screen Actors Guild president — gave them 48 hours to return to work. When most refused, he fired them and banned them from federal employment for life. PATCO's significance went far beyond aviation. It signaled to private-sector employers that aggressive anti-union tactics — including the permanent replacement of striking workers — would not face federal pushback. Strikes plummeted. By 2009, the number of major work stoppages had fallen to a record low of just 5."
                  />
                  <ExpandableCard
                    year="1979-2010"
                    accent="#9CA3AF"
                    title="The Manufacturing Collapse"
                    summary="Manufacturing employment shrank from 19 million to under 12 million."
                    body="The historic stronghold of industrial unionism was gutted by automation and offshoring. Service-sector employment expanded enormously, but service workplaces — fragmented, dispersed, often part-time — were vastly harder to organize than centralized factories. Employer resistance also became more sophisticated and aggressive: the 'union avoidance' consulting industry boomed."
                  />
                  <ExpandableCard
                    year="2012-17"
                    accent="#9CA3AF"
                    title="Right-to-Work Spreads North"
                    summary="Indiana, Michigan, Wisconsin, West Virginia, Kentucky."
                    body="The first major Northern industrial states joined the right-to-work bloc — a stunning reversal in territory that had been the heartland of industrial unionism. Each state law made it harder for unions to collect dues from the workers they were legally required to represent."
                  />
                  <ExpandableCard
                    year="2018"
                    accent="#9CA3AF"
                    title="Janus v. AFSCME"
                    summary="The Supreme Court imposed right-to-work conditions on all public-sector unions."
                    body="The Court ruled that requiring nonmembers to pay 'fair share' fees for collective bargaining services violated the First Amendment. By 2020, the union membership rate had fallen to 10.8 percent — less than half the 1983 figure of 20.1 percent and roughly one-third of the postwar peak. Private-sector membership had collapsed to 6.3 percent, closer to its 1900 level than to its 1955 peak."
                  />
                </Era>

                <PullQuote attribution="The decline curve, 1955-2020">
                  From 35 percent of the workforce to under 11 percent. The longest sustained decline in any major Western labor movement.
                </PullQuote>

                {/* PART IX */}
                <Era tag="IX" years="2010s – Early 2020s" title="The 21st-Century Resurgence" intro="For decades, observers had pronounced the American labor movement effectively dead. Then it began to twitch.">
                  <ExpandableCard
                    year="2018-19"
                    title="Red for Ed — The Teacher Strike Wave"
                    summary="Began in West Virginia, spread to Oklahoma, Arizona, Kentucky, North Carolina, Los Angeles."
                    body="Often led by rank-and-file teachers in defiance of conservative state laws against public-sector strikes, the walkouts won meaningful pay raises and put education funding back on the political map. They demonstrated something that had been forgotten: that strikes could still work."
                  />
                  <ExpandableCard
                    year="2020"
                    title="The Pandemic Reset"
                    summary="Frontline workers were suddenly 'essential' — and asked to risk their lives."
                    body="Nurses, grocery clerks, warehouse workers, meatpackers, delivery drivers — designated essential while being asked to work in conditions that ranged from inadequate to lethal. Wildcat actions multiplied. Public sympathy for workers reached a generational high. By 2022, Gallup measured public approval of unions at 71 percent — its highest point since 1965."
                  />
                  <ExpandableCard
                    year="2021-22"
                    title="Starbucks and Amazon Break Through"
                    summary="Companies long considered impossible to unionize broke through."
                    body="In December 2021, baristas at a Starbucks in Buffalo voted to form the first union at a corporate-owned U.S. Starbucks store; within two years the campaign had spread to hundreds of locations. In April 2022, warehouse workers at the Amazon JFK8 facility on Staten Island won the first successful union election at any U.S. Amazon facility."
                  />
                  <ExpandableCard
                    year="2023"
                    title="The Summer of Strikes"
                    summary="The most intense year of strike activity in decades."
                    body="The Writers Guild and SAG-AFTRA shut down Hollywood for months. The UAW launched its 'Stand-Up Strike' — a rolling, targeted strike against all three Detroit automakers simultaneously, the first such action in the union's history. The UAW won contracts with double-digit wage increases, the elimination of much of the hated two-tier wage structure, and the right to strike over plant closures. UPS Teamsters won what their union called the most lucrative contract in its history without striking, after a credible strike threat."
                  />
                  <ExpandableCard
                    year="2024"
                    title="Chattanooga Falls"
                    summary="The first successful auto union election in the South in modern memory."
                    body="In April 2024, Volkswagen workers in Chattanooga voted overwhelmingly to join the UAW — the first successful union election at a foreign-owned auto plant in the South in modern memory. A region long considered nearly impenetrable to organized labor had cracked open."
                  />
                </Era>

                {/* CURRENT-DAY DASHBOARD */}
                <FadeIn>
                  <div style={{margin:'80px 0 40px', padding:'40px 28px', background:'linear-gradient(135deg, rgba(250,128,89,0.08) 0%, rgba(245,197,24,0.08) 100%)', borderRadius:24, border:'1px solid rgba(250,128,89,0.2)'}}>
                    <div style={{textAlign:'center', marginBottom:32}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase'}}>Where We Are Now</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'#fff', margin:'12px 0 0 0'}}>The Movement in 2026</h2>
                      <p style={{fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:600, margin:'12px auto 0', lineHeight:1.6}}>High-profile, energetic, popularly supported, and politically embattled to a degree not seen in decades.</p>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:24}}>
                      <StatBlock value={14.7} label="Million union members" suffix="M" decimals={1} />
                      <StatBlock value={16.5} label="Workers covered by contract" suffix="M" decimals={1} />
                      <StatBlock value={71} label="Public approval" suffix="%" />
                      <StatBlock value={32.9} label="Public sector density" suffix="%" decimals={1} />
                    </div>
                    <div style={{padding:'24px', background:'rgba(0,0,0,0.25)', borderRadius:16, marginTop:8}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2, textTransform:'uppercase', marginBottom:12}}>The Wage Premium</div>
                      <div style={{display:'flex', gap:24, flexWrap:'wrap', alignItems:'center'}}>
                        <div style={{flex:'1 1 180px'}}>
                          <div style={{fontSize:12, color:'rgba(160,180,196,0.8)', marginBottom:4}}>Median weekly earnings — UNION</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#FA8059'}}>$<AnimatedNumber value={1404} /></div>
                        </div>
                        <div style={{flex:'1 1 180px'}}>
                          <div style={{fontSize:12, color:'rgba(160,180,196,0.8)', marginBottom:4}}>Median weekly earnings — NONUNION</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'rgba(255,255,255,0.5)'}}>$<AnimatedNumber value={1174} /></div>
                        </div>
                        <div style={{flex:'1 1 100px', padding:'12px 16px', background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.4)', borderRadius:12, textAlign:'center'}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#22c55e'}}>+$<AnimatedNumber value={230} /></div>
                          <div style={{fontSize:10, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:1}}>Per week</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* PART X — Crossroads */}
                <Era tag="X" years="2025 – 2026" title="A Movement at a Crossroads" color="#F5C518" intro="The 2026 picture is one of sharp contrasts. Public approval of unions remains historically high. NLRB union election petitions have doubled since 2021. Reform movements in the UAW and Teamsters have produced more militant leadership and bigger contracts. New organizing has reached previously off-limits sectors: coffee retail, tech, video games, graduate education, museums, journalism, Amazon warehouses.">
                  <ExpandableCard
                    year="2025"
                    accent="#F5C518"
                    title="The Federal Workforce Confrontation"
                    summary="Executive orders ended collective bargaining for over one million federal workers."
                    body="Citing national security concerns, the Trump administration excluded large portions of the federal workforce from federal labor-management relations protections — affecting roughly 84 percent of the unionized federal workforce. Federal employee unions filed roughly a dozen lawsuits, scoring early wins at the district court level only to see federal appeals courts overturn preliminary injunctions. In an outcome that likely surprised the executive branch, union density among federal workers actually rose from 29.9 percent to 31.1 percent — the largest single-year increase since 2011, as federal employees flocked to unions for protection during mass layoffs and policy upheaval."
                  />
                  <ExpandableCard
                    year="2024-25"
                    accent="#F5C518"
                    title="The Strike Wave Continues"
                    summary="Boeing, Longshoremen, Starbucks, Republic Services, Corewell."
                    body="271,500 workers participated in 31 major strikes in 2024. The October 2024 International Longshoremen's Association strike — the union's first since 1977 — shut down East and Gulf Coast ports for two days before yielding a tentative agreement that included a 62 percent pay increase over six years. The fall 2024 Boeing machinists' strike secured a 38 percent wage increase. In November 2024, 10,000 nurses at Corewell hospitals won the largest unionization election in recent memory."
                  />
                  <ExpandableCard
                    year="2025"
                    accent="#F5C518"
                    title="The Generational Shift"
                    summary="Workers under 45 are doing nearly all the new organizing."
                    body="Union coverage among workers under 45 increased by 428,000 in 2025, compared with just 35,000 among workers 45 and over. The South alone accounted for 46 percent of all net gains nationwide. The center of gravity of new organizing is shifting younger, more diverse, and — surprisingly to many — Southern."
                  />
                </Era>

                {/* CONCLUSION */}
                <FadeIn>
                  <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Long Arc</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>What Endures</h2>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                      The history of organized labor is not a clean story of progress, nor of inevitable decline. It is a series of moments — Tolpuddle, Haymarket, Triangle, Flint, Memphis, PATCO, Buffalo, Chattanooga — in which workers and employers tested each other's strength, and the political balance shifted in response.
                    </p>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                      Membership numbers have risen and fallen by factors of three or more within living memory. Industries once considered impossible to organize have been organized. Industries once considered safely organized have been hollowed out. What endures across the centuries is the underlying tension that gave rise to unions in the first place: the fundamental imbalance of power between an individual worker and the institutions that employ them.
                    </p>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                      The forms have varied wildly — from secret oaths to medieval guilds to industrial unions to roving picket lines — but the impulse has been remarkably consistent. The story, as ever, is still being written.
                    </p>
                    <div style={{marginTop:40, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                      <div style={{fontSize:13, color:'rgba(160,180,196,0.7)', fontStyle:'italic'}}>Coming soon: trade-by-trade histories — IBEW, UA, SMART, BAC, IW, HFIAW, IUEC, IUOE, UBC, LIUNA, and IBEW Lineman.</div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          );
        })()}
