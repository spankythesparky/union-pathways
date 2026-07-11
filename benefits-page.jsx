        {page === "benefits" && (() => {
          const useScrollProgress = () => {
            const [progress, setProgress] = useState(0);
            useEffect(() => {
              const onScroll = () => {
                const el = document.getElementById('benefits-root');
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
                    {year && <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>}
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

          const Section = ({ tag, title, intro, color = '#FA8059', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:56, height:56, borderRadius:14, background:`${color}22`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28}}>{tag}</div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:0, lineHeight:1.1, flex:1, minWidth:0}}>{title}</h2>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );

          const scrollProgress = useScrollProgress();

          return (
            <div id="benefits-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #FA8059, #F5C518)', transition:'width 0.1s'}} />
              </div>

              {/* HERO */}
              <div style={{padding:'80px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>More Than Just a Paycheck</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Union <span style={{color:'#FA8059'}}>Benefits.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>What you actually get.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  Union construction workers don't just earn higher hourly wages. They receive a stacked benefits package that most workers in America will never see — built and paid for through collective bargaining, not pulled from their take-home pay.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={4} label="Core benefit pillars" />
                  <StatBlock value={100} label="Employer-funded pension" suffix="%" />
                  <StatBlock value={5} label="Year apprenticeship" suffix=" yr" />
                  <StatBlock value={0} label="Out of your paycheck" prefix="$" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* INTRO PARAGRAPH */}
                <div style={{padding:'40px 0 20px'}}>
                  <p style={{fontSize:17, color:'rgba(255,255,255,0.85)', lineHeight:1.8, marginBottom:20}}>
                    The story most people tell about union work focuses on the wages — and yes, the wages are higher. But the real wealth-building power of union construction lies in what comes <em>on top of</em> the hourly rate. The contractor, not the worker, funds it. It accumulates from the first day on the job. And it follows you for the rest of your career, no matter how many contractors you work for.
                  </p>
                  <p style={{fontSize:17, color:'rgba(255,255,255,0.85)', lineHeight:1.8}}>
                    Here's what's actually inside a typical union benefits package.
                  </p>
                </div>

                {/* SECTION 1 — PENSION */}
                <Section tag="🏛️" title="The Defined-Benefit Pension" intro="A pension is a monthly check you receive every month for the rest of your life after you retire. It is the single most valuable benefit a union member receives, and it is essentially extinct outside of organized labor.">
                  <ExpandableCard
                    title="What 'defined benefit' actually means"
                    summary="The amount you get is calculated by formula — not by how the stock market performs."
                    body="In a defined-benefit pension, the union and contractors agree on a formula that determines your monthly payout in retirement. The formula typically multiplies your years of service by an accrual rate set in your local's plan. Whether the markets are up or down, your check stays the same. Compare this to a 401k, where your retirement income depends entirely on what your account balance happens to be on the day you stop working."
                  />
                  <ExpandableCard
                    title="The contractor pays. Not you."
                    summary="Every hour you work, your contractor sends a fixed dollar amount per hour into the pension fund."
                    body="That contribution is part of your wage package — negotiated by the union — but it never appears on your pay stub as a deduction. It comes from above your gross pay, not from inside it. In most non-union jobs, if you want a retirement account at all, you have to fund it yourself out of your own check. In union construction, the funding is built into every hour you work."
                  />
                  <ExpandableCard
                    title="Vesting and portability"
                    summary="Once vested (typically 5 years), the pension is yours — even if you leave the trade."
                    body="Most union pension plans require 5 years of credited service before you're 'vested,' meaning the right to that pension is locked in. After vesting, even if you stop working in the trade entirely, you'll receive a monthly check in retirement based on the years you accumulated. Within the same trade, your service typically transfers between locals — letting you move across the country and still build toward a single pension."
                  />
                  <ExpandableCard
                    title="What happens if the contractor goes out of business"
                    summary="Your pension is funded through a multi-employer trust — not tied to any single employer."
                    body="This is one of the structural advantages of union pensions. Contributions go into a multi-employer trust fund, jointly governed by union and contractor trustees, separate from any individual contractor's finances. When a contractor closes its doors, your accrued service doesn't disappear with it. The pension fund keeps writing checks. By contrast, when a non-union employer's 401k matching ends or a small business goes under, the worker often loses access to whatever benefit they had."
                  />
                </Section>

                <PullQuote attribution="The pension's quiet power">
                  Defined-benefit pensions used to be the default for American workers. Today, in the private sector, they are nearly extinct — except in unionized industries, where they remain the cornerstone of retirement security.
                </PullQuote>

                {/* SECTION 2 — ANNUITY / DC PLAN */}
                <Section tag="📊" title="The Annuity (or Defined-Contribution Plan)" color="#F5C518" intro="On top of the pension, most union construction members have a second retirement account — a defined-contribution annuity that functions like a 401k, except the contributions are paid by the contractor, not deducted from your wages.">
                  <ExpandableCard
                    accent="#F5C518"
                    title="Why two retirement accounts instead of one"
                    summary="The pension provides predictable monthly income for life. The annuity gives you a lump sum you control."
                    body="The pension is steady but rigid — fixed monthly payments, often without inflation adjustments. The annuity adds flexibility: a pot of money you can draw from for big expenses, leave to your family, or roll into other accounts. Together they form what financial planners call a 'three-legged stool' alongside Social Security: guaranteed lifetime income, savings under your control, and federal benefits."
                  />
                  <ExpandableCard
                    accent="#F5C518"
                    title="How it differs from a 401k"
                    summary="The contractor funds it at a negotiated rate per hour. You don't choose to opt in or out."
                    body="In a typical non-union 401k, the worker decides whether to contribute, the employer maybe offers a small match, and the funding is volatile. Union annuities are funded automatically — every hour worked generates a contribution at the rate negotiated in your contract. There's no opt-in to forget about, no match cap to worry about, no question whether you'll have something at the end of your career. The contributions show up regardless."
                  />
                  <ExpandableCard
                    accent="#F5C518"
                    title="Investment options"
                    summary="Annuity funds are professionally managed — often more conservatively than retail 401ks."
                    body="Trustees of the multi-employer plan select investment options that balance growth with stability. Most plans offer a default lifecycle fund along with a handful of alternatives. The fee structure tends to be lower than retail 401ks because the plan is bargaining as one large institutional investor instead of as thousands of individuals. Members can typically check balances and modify allocations through online portals."
                  />
                </Section>

                {/* SECTION 3 — HEALTH INSURANCE */}
                <Section tag="🏥" title="Health Insurance" color="#22c55e" intro="Most union construction members receive health insurance fully paid by the contractor — premiums, deductibles, the works — for themselves and their families. No paycheck deductions for monthly premiums. No surprise high-deductible plans the worker has to figure out.">
                  <ExpandableCard
                    accent="#22c55e"
                    title="Contractor-paid premiums"
                    summary="The contribution comes from the wage package, not from your take-home pay."
                    body="Just like the pension, the health-fund contribution is negotiated as part of the total wage package. The contractor sends a fixed dollar amount per hour worked into the health fund. The fund uses that pool to provide coverage for all members and their dependents. Most plans cover medical, dental, and vision. Many also cover prescription drugs at the same generous rates."
                  />
                  <ExpandableCard
                    accent="#22c55e"
                    title="Coverage during slow periods"
                    summary="Banked hours from busy months keep your insurance active when work slows down."
                    body="Construction is seasonal. Most union health plans solve this with an 'hour bank' — a system where the hours you work in busy months accumulate as credits, paying for your coverage during slower months. As long as you maintain a minimum balance, you stay insured. This is particularly valuable for outdoor trades subject to weather and for members between major projects."
                  />
                  <ExpandableCard
                    accent="#22c55e"
                    title="Family coverage"
                    summary="Spouses and dependent children are typically included at no additional cost to the member."
                    body="In most non-union jobs, adding family members to insurance dramatically raises the worker's payroll deduction. In most union plans, family coverage is built into the contractor contribution — meaning the cost to the member is the same whether they cover just themselves, themselves and a spouse, or a full family. For tradespeople with kids, this is often the single biggest financial difference between union and non-union work."
                  />
                  <ExpandableCard
                    accent="#22c55e"
                    title="Retiree health benefits"
                    summary="Many plans provide bridge coverage between retirement and Medicare eligibility at 65."
                    body="A retiring union member at 60 in a non-union job would typically need to find their own health insurance for five years until Medicare kicks in — at potentially crippling cost. Many union plans provide retiree medical benefits that bridge this gap, and Medicare supplemental coverage afterward. The exact terms vary by local and trade, but the existence of any retiree health coverage is itself remarkable in 2026."
                  />
                </Section>

                {/* MID-PAGE COMPARISON */}
                <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(34,197,94,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{textAlign:'center', marginBottom:32}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:2, textTransform:'uppercase'}}>The Difference at a Glance</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>Union vs Non-Union Benefits</h3>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20}}>
                    <div style={{padding:'24px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:'#22c55e', marginBottom:12, textTransform:'uppercase', letterSpacing:1}}>Union Construction</div>
                      <ul style={{listStyle:'none', padding:0, margin:0, fontSize:15, color:'rgba(255,255,255,0.9)', lineHeight:1.9}}>
                        <li>✓ Defined-benefit pension for life</li>
                        <li>✓ Annuity / 401(k) on top</li>
                        <li>✓ Family health insurance, contractor-paid</li>
                        <li>✓ Apprenticeship: paid training, no debt</li>
                        <li>✓ Hour bank covers slow seasons</li>
                        <li>✓ Wages set by contract, not boss's mood</li>
                      </ul>
                    </div>
                    <div style={{padding:'24px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:'rgba(255,255,255,0.5)', marginBottom:12, textTransform:'uppercase', letterSpacing:1}}>Typical Non-Union Job</div>
                      <ul style={{listStyle:'none', padding:0, margin:0, fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.9}}>
                        <li>✗ No pension (rare exceptions)</li>
                        <li>○ Optional 401(k), small or no match</li>
                        <li>○ Health: premium deducted from paycheck</li>
                        <li>○ Pay-to-play training or trade school debt</li>
                        <li>✗ Slow season = lose coverage</li>
                        <li>○ Wages set by employer at hire</li>
                      </ul>
                    </div>
                  </div>
                  <p style={{fontSize:13, color:'rgba(160,180,196,0.7)', textAlign:'center', marginTop:24, fontStyle:'italic'}}>Comparison reflects typical union construction contracts vs. typical non-union construction roles. Specific terms vary by trade, local, and employer.</p>
                </div>

                {/* SECTION 4 — APPRENTICESHIP */}
                <Section tag="🎓" title="Apprenticeship & Training" intro="Most union trades have a 4–5 year registered apprenticeship: paid on-the-job training combined with classroom instruction, fully funded by employer contributions. You earn a journey-level credential at the end with zero student debt — and a starting wage on day one.">
                  <ExpandableCard
                    title="Earn while you learn"
                    summary="Apprentices work alongside journeymen on real jobs from day one and get paid a percentage of journey scale that increases each year."
                    body="Most apprenticeships start at around 40-50% of journey scale and step up at scheduled intervals — typically every 6 months — until reaching 100% at completion. There's no tuition. There's no application fee for the program itself in most cases. There are no books to buy. The contractor's training-fund contributions cover the classroom curriculum, the instructors, the facility, and the materials. The apprentice's only investment is time and effort."
                  />
                  <ExpandableCard
                    title="The credential is portable"
                    summary="A journey-level certificate from a registered apprenticeship is recognized across every signatory contractor in your trade, nationwide."
                    body="Federal Department of Labor registration means the standards are uniform across the country. A journeyman trained in one local can walk onto a job in another and be recognized as fully qualified — no re-testing, no apprenticing again. This portability is one reason union members can move across regions chasing work, and why the credential carries weight even outside the union, with non-union employers sometimes paying more for graduates of registered apprenticeships."
                  />
                  <ExpandableCard
                    title="Continuing education for journeymen"
                    summary="Once you're a journeyman, training doesn't stop — it just becomes optional and often free."
                    body="Most local training centers offer ongoing classes for active members in welding certifications, instrumentation, code updates, new technologies (EV charging infrastructure, photovoltaics, modular plumbing), and supervisor training. Sometimes paid for entirely by the training trust. This is one of the main reasons union members tend to remain employable through technological transitions where non-union peers fall behind."
                  />
                </Section>

                {/* SECTION 5 — BEYOND THE MONEY */}
                <Section tag="🛡️" title="Beyond the Pension and Insurance" color="#A78BFA" intro="The big four benefits — pension, annuity, health, training — get the most attention, but they're not the whole picture. There's a layer of additional protections most union members take for granted, that simply don't exist in most non-union work.">
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Vacation & holiday pay"
                    summary="Many trades have vacation funds that accumulate just like the other benefits."
                    body="Some locals fund a separate vacation account through hourly contributions; you receive a check each year (often around year-end) covering your vacation pay. Some include paid holidays in the contract — typically the major federal holidays plus a handful of others. Construction is unusual in that traditional 'paid time off' is rarer than in office work, but the wage premium and benefit funds are structured to compensate for that."
                  />
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Grievance procedures and just cause"
                    summary="Union members can't be fired without cause — and have a formal process to challenge unfair treatment."
                    body="Most non-union employees in the United States are 'at will,' meaning they can be terminated at any time, for any reason, with no recourse. Union contracts typically require 'just cause' for discipline or termination, and provide a grievance procedure: a multi-step process where the worker, the union, and the contractor work through complaints, escalating to arbitration if needed. This isn't job-for-life protection — but it is real, structural protection from arbitrary firing."
                  />
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Member assistance programs"
                    summary="Many locals offer confidential support for substance use, mental health, and family crises."
                    body="Construction has historically had high rates of opioid addiction, suicide, and other crises. Most building trades unions and their health funds operate Member Assistance Programs that provide free, confidential counseling, addiction treatment referrals, and family support. Calls don't go to your contractor. They don't appear on your insurance. They are designed specifically for the realities of skilled-trade life."
                  />
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Legal services and discounts"
                    summary="Some unions offer subsidized legal help (wills, real estate closings, family matters) and member discounts on cars, phones, and travel."
                    body="The specifics vary by international union and local, but the principle is consistent: leverage collective bargaining power for things beyond just wages. Union Plus, a benefits cooperative across many AFL-CIO affiliates, offers discounted services on everything from cell phone plans to mortgages to college scholarships for members and their kids. None of these are make-or-break, but they accumulate."
                  />
                </Section>

                {/* SECTION 6 — VETERANS */}
                <Section tag="🎖️" title="A Note for Veterans" color="#3B9EFF" intro="Several major building-trades unions run programs specifically designed for transitioning service members. The most established is Helmets to Hardhats, a non-profit pathway connecting active-duty and veteran service members directly into union apprenticeships, with no fees and credit for military experience.">
                  <ExpandableCard
                    accent="#3B9EFF"
                    title="Helmets to Hardhats"
                    summary="A free placement program connecting transitioning military members to union construction apprenticeships nationwide."
                    body="Helmets to Hardhats is funded by the building-trades unions and operated as an independent non-profit. Service members can register before their separation date, get matched to apprenticeship openings in trades that fit their skills and target locations, and walk into a registered apprenticeship without paying placement fees, application fees, or testing fees. Many trades offer credit for military experience — particularly for those with logistics, mechanical, or construction-adjacent MOSs."
                  />
                  <ExpandableCard
                    accent="#3B9EFF"
                    title="UA Veterans in Piping (VIP)"
                    summary="The UA's program delivers welding, HVACR, and fire-suppression training on military bases during the final months of active duty."
                    body="Pipefitters and plumbers (UA) run the Veterans in Piping program at military installations including Camp Pendleton, Joint Base Lewis-McChord, Fort Carson, Fort Cavazos, Camp Lejeune, Fort Campbell, and Naval Station Norfolk. Training is free, doesn't require GI Bill use, and graduates step directly into a UA apprenticeship and a job upon discharge. Other building-trades unions have analogous programs."
                  />
                </Section>

                {/* CLOSING — WHAT THIS MEANS */}
                <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Bottom Line</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>What This All Adds Up To</h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    The wage on a union paycheck tells you part of the story. The pension contributions, the health-fund deposits, the annuity accruals, and the training-fund deposits running alongside it tell you the rest. For a typical journey-level union member working 1,500-2,000 hours per year, the value of contractor-paid benefits often equals 30–40% of the hourly wage on top of the wage itself.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    None of it comes from your paycheck. All of it follows you for life. And almost none of it exists outside organized labor in the construction industry today.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                    That's why people who get into the union trades tend to stay.
                  </p>
                  <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:24}}>
                    <button onClick={() => setPage('home')} style={{background:'#FA8059', color:'#000', fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1, textTransform:'uppercase', padding:'14px 32px', border:'none', borderRadius:50, cursor:'pointer'}}>Find Your Local →</button>
                    <button onClick={() => setPage('checklist')} style={{background:'transparent', color:'#FA8059', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'14px 28px', border:'1px solid rgba(250,128,89,0.4)', borderRadius:50, cursor:'pointer'}}>How to Join</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
