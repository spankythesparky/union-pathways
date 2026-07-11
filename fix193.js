// fix193.js — Add the "How to Form a Union Caucus" page
//
// What this does:
//   1. Inserts page === "caucus" route before the rtw page
//   2. Adds 'caucus' to validPages whitelist
//   3. Adds PAGE_META entry
//   4. Adds entry to desktop Resources dropdown (under Organize)
//   5. Adds entry to mobile drawer Resources section
//   6. Adds entry to Edge Middleware (middleware.js) for social previews
//
// Design philosophy:
//   - Procedural guide, not reference material — no collapsibles, reads top-to-bottom
//   - Sticky progress sidebar with all 10 steps + percent complete
//   - Real precedent section (TDU/CORE/UAWD/MORE) before the how-to
//   - Step 6 recruitment flow gets visual treatment (5-card horizontal flow)
//   - Interactive checklist tool at bottom with localStorage persistence
//   - Aesthetic: black + labor red accent, sharp editorial typography
//
// Idempotency: detects 'page === "caucus"' and exits cleanly.
//
// Reads:  src/App.jsx, middleware.js
// Writes: src/App.jsx, middleware.js (in place)

const fs = require('fs');
const FILE = 'src/App.jsx';
const MIDDLEWARE = 'middleware.js';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('page === "caucus"')) {
  console.log('Already applied — caucus page is already in place.');
  process.exit(0);
}

// ============================================================================
// THE PAGE
// ============================================================================
const PAGE_BLOCK = `
        {page === "caucus" && (() => {
          const CaucusPage = () => {
            const ACCENT = '#DC2626';
            const ACCENT_DIM = 'rgba(220,38,38,0.5)';
            const ACCENT_GLOW = 'rgba(220,38,38,0.18)';

            // The 10 steps. Single source of truth — drives sidebar, checklist, and progress.
            const STEPS = [
              { num: '01', short: 'Find your people', title: 'Identify the problem and find your people' },
              { num: '02', short: 'Steering committee', title: 'Build a steering committee' },
              { num: '03', short: 'Platform', title: 'Write your platform' },
              { num: '04', short: 'Name & identity', title: 'Choose a name and identity' },
              { num: '05', short: 'Internal democracy', title: 'Set up internal democracy' },
              { num: '06', short: 'Recruit', title: 'Recruit members' },
              { num: '07', short: 'Communicate', title: 'Communicate' },
              { num: '08', short: 'Run campaigns', title: 'Run campaigns' },
              { num: '09', short: 'Coalitions', title: 'Build coalitions' },
              { num: '10', short: 'Stay grounded', title: 'Stay grounded' },
            ];

            // Sticky-sidebar active step tracker. Reads scroll position, finds which step
            // section is currently in view, highlights it in the sidebar.
            const [activeStep, setActiveStep] = useState(0);

            // Checklist state — persisted to localStorage so a user's progress sticks
            // across sessions. Keyed independently from anything else on the site.
            const [checked, setChecked] = useState(() => {
              if (typeof window === 'undefined') return new Array(10).fill(false);
              try {
                const stored = localStorage.getItem('unionpathways:caucus:checklist');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  if (Array.isArray(parsed) && parsed.length === 10) return parsed;
                }
              } catch (e) {}
              return new Array(10).fill(false);
            });

            useEffect(() => {
              try { localStorage.setItem('unionpathways:caucus:checklist', JSON.stringify(checked)); } catch (e) {}
            }, [checked]);

            const toggleChecked = (i) => {
              setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
            };

            const checkedCount = checked.filter(Boolean).length;
            const checkedPct = Math.round((checkedCount / 10) * 100);

            useEffect(() => {
              const handleScroll = () => {
                const sections = STEPS.map((_, i) => document.getElementById('caucus-step-' + (i+1)));
                const scrollTop = window.scrollY + 200;
                let current = 0;
                for (let i = 0; i < sections.length; i++) {
                  if (sections[i] && sections[i].offsetTop <= scrollTop) current = i;
                }
                setActiveStep(current);
              };
              window.addEventListener('scroll', handleScroll, { passive: true });
              handleScroll();
              return () => window.removeEventListener('scroll', handleScroll);
            }, []);

            const scrollToStep = (i) => {
              const el = document.getElementById('caucus-step-' + (i+1));
              if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
            };

            // Inline-styled section helper for step bodies. Render as JSX expression
            // (not a nested component) so React doesn't remount on every state change.
            const renderStep = (idx, intro, paragraphs, extra) => {
              const step = STEPS[idx];
              return (
                <section id={'caucus-step-' + (idx+1)} style={{padding:'72px 0', borderTop: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{display:'flex', alignItems:'baseline', gap:24, marginBottom:32, flexWrap:'wrap'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(80px, 12vw, 140px)', fontWeight:900, color:ACCENT, lineHeight:0.85, letterSpacing:'-0.02em'}}>{step.num}</div>
                    <div style={{flex:1, minWidth:280}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:10}}>Step {idx+1} of 10</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 4.5vw, 52px)', fontWeight:900, color:'#fff', margin:0, lineHeight:1.05, textTransform:'uppercase'}}>{step.title}</h2>
                    </div>
                  </div>
                  {intro && <p style={{fontSize:18, color:'rgba(255,255,255,0.92)', lineHeight:1.6, marginBottom:28, fontWeight:500, maxWidth:720}}>{intro}</p>}
                  {paragraphs.map((p, i) => (
                    <p key={i} style={{fontSize:15.5, color:'rgba(255,255,255,0.78)', lineHeight:1.75, marginBottom:18, maxWidth:720}}>{p}</p>
                  ))}
                  {extra}
                </section>
              );
            };

            return (
              <div style={{position:'relative', minHeight:'100vh', background:'#0A0A0A', color:'#fff'}}>
                {/* SUBTLE GRID BG */}
                <div style={{
                  position:'fixed', inset:0,
                  backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
                  backgroundSize:'48px 48px',
                  pointerEvents:'none', zIndex:0
                }} />
                {/* RED CORNER GLOW */}
                <div style={{
                  position:'fixed', top:-200, right:-200, width:600, height:600,
                  background: 'radial-gradient(circle, ' + ACCENT_GLOW + ' 0%, transparent 70%)',
                  filter:'blur(40px)', pointerEvents:'none', zIndex:0
                }} />
                {/* SCROLL PROGRESS */}
                <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:50}}>
                  <div style={{height:'100%', width:(scrollProgress * 100) + '%', background: 'linear-gradient(90deg, ' + ACCENT + ', #FA8059)', transition:'width 0.1s'}} />
                </div>

                {/* MAIN LAYOUT — sidebar + content */}
                <div style={{position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto', padding:'24px 24px 0', display:'flex', gap:48}}>

                  {/* STICKY SIDEBAR — desktop only */}
                  <aside className="caucus-sidebar" style={{position:'sticky', top:24, alignSelf:'flex-start', width:240, flexShrink:0, paddingTop:80, display:'none'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:18}}>The 10 Steps</div>
                    <nav>
                      {STEPS.map((s, i) => (
                        <button
                          key={s.num}
                          onClick={() => scrollToStep(i)}
                          style={{
                            display:'flex', alignItems:'baseline', gap:12, width:'100%',
                            padding:'10px 0', background:'transparent', border:'none',
                            borderLeft: '2px solid ' + (activeStep === i ? ACCENT : 'rgba(255,255,255,0.08)'),
                            paddingLeft: 14, marginBottom: 2,
                            cursor:'pointer', textAlign:'left',
                            transition:'all 0.2s'
                          }}
                        >
                          <span style={{
                            fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700,
                            color: activeStep === i ? ACCENT : 'rgba(255,255,255,0.4)',
                            letterSpacing:1
                          }}>{s.num}</span>
                          <span style={{
                            fontSize:13,
                            color: activeStep === i ? '#fff' : 'rgba(255,255,255,0.55)',
                            fontWeight: activeStep === i ? 600 : 400,
                            transition:'color 0.2s'
                          }}>{s.short}</span>
                        </button>
                      ))}
                    </nav>
                  </aside>

                  {/* CONTENT */}
                  <main style={{flex:1, minWidth:0, paddingBottom:120}}>

                    {/* BREADCRUMB */}
                    <div style={{paddingTop:24, marginBottom:24}}>
                      <div onClick={() => setPage('organize')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                        Organizing
                      </div>
                    </div>

                    {/* HERO */}
                    <header style={{paddingTop:40, paddingBottom:64, borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:24}}>
                        <div style={{height:1, width:32, background:ACCENT}} />
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase'}}>A Field Guide for Members</div>
                      </div>
                      <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(48px, 9vw, 112px)', fontWeight:900, color:'#fff', lineHeight:0.92, margin:'0 0 28px 0', letterSpacing:'-0.01em', textTransform:'uppercase'}}>
                        How to form<br/>a <span style={{color:ACCENT}}>union caucus.</span>
                      </h1>
                      <p style={{fontSize:'clamp(17px, 1.6vw, 19px)', color:'rgba(255,255,255,0.78)', lineHeight:1.65, maxWidth:680, margin:0}}>
                        Every reform victory in modern American labor began the same way: a few members talking quietly in a break room, deciding their union could be better, and getting organized to make it happen. This is how that work is done.
                      </p>
                    </header>

                    {/* WHAT IS A CAUCUS */}
                    <section style={{padding:'72px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>The Definition</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(36px, 5.5vw, 64px)', fontWeight:900, color:'#fff', margin:'0 0 32px 0', lineHeight:1, textTransform:'uppercase'}}>What is a union caucus?</h2>
                      <p style={{fontSize:18, color:'rgba(255,255,255,0.92)', lineHeight:1.6, marginBottom:24, fontWeight:500, maxWidth:720}}>
                        A union caucus is an organized group of members within a union who share a common vision and work together to influence the direction of their local, regional, or international body.
                      </p>
                      <p style={{fontSize:15.5, color:'rgba(255,255,255,0.78)', lineHeight:1.75, marginBottom:32, maxWidth:720}}>
                        Unlike committees appointed by union leadership, caucuses are formed independently by rank-and-file members. A caucus is not a separate union, a dual union, or a breakaway organization. It operates within the existing union structure and is made up of members in good standing.
                      </p>
                      <div style={{padding:'24px 28px', background:'rgba(255,255,255,0.03)', borderLeft:'3px solid ' + ACCENT, marginBottom:24}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:2.5, textTransform:'uppercase', marginBottom:14}}>Caucuses Typically Exist To</div>
                        <ul style={{margin:0, paddingLeft:0, fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:2, listStyle:'none'}}>
                          {[
                            'Push for greater union democracy and member participation',
                            'Reform leadership and elect new officers',
                            'Strengthen contract demands and bargaining power',
                            'Address issues leadership has ignored — safety, harassment, racial justice, climate',
                            'Educate and organize members between contract fights',
                            'Build solidarity across worksites, shops, and locals',
                          ].map((item, i) => (
                            <li key={i} style={{position:'relative', paddingLeft:24}}>
                              <span style={{position:'absolute', left:0, color:ACCENT, fontWeight:900}}>—</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    {/* PRECEDENT — Real caucus history */}
                    <section style={{padding:'72px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>Precedent</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(36px, 5.5vw, 64px)', fontWeight:900, color:'#fff', margin:'0 0 32px 0', lineHeight:1, textTransform:'uppercase'}}>This work has a history.</h2>
                      <p style={{fontSize:16, color:'rgba(255,255,255,0.78)', lineHeight:1.7, marginBottom:40, maxWidth:720}}>
                        Some of the most significant labor victories of the past 50 years came from caucus organizing. The pattern holds across decades and industries: small groups of members, organized over years, transforming their unions — and through them, their industries.
                      </p>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:1, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.08)'}}>
                        {[
                          { abbr:'TDU', year:'1976', name:'Teamsters for a Democratic Union', win:'Decades of rank-and-file organizing helped elect reform president Sean O\\'Brien in 2021, who led the historic 2023 UPS contract campaign.' },
                          { abbr:'CORE', year:'2010', name:'Caucus of Rank-and-File Educators', win:'Took over the Chicago Teachers Union and led the 2012 Chicago teachers\\' strike that reshaped national education politics.' },
                          { abbr:'UAWD', year:'2019', name:'Unite All Workers for Democracy', win:'Won direct elections of UAW officers and helped elect Shawn Fain, who led the successful 2023 Stand Up Strike against the Big Three automakers.' },
                          { abbr:'MORE', year:'2012', name:'MORE Caucus (UFT)', win:'A reform caucus inside the United Federation of Teachers in New York City, organizing for transparency and stronger member power.' },
                        ].map((c, i) => (
                          <div key={i} style={{padding:'28px 26px', background:'#0F0F0F'}}>
                            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14}}>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:ACCENT, lineHeight:1, letterSpacing:'0.02em'}}>{c.abbr}</div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:2}}>{c.year}</div>
                            </div>
                            <div style={{fontSize:14, fontWeight:700, color:'#fff', marginBottom:12, lineHeight:1.3}}>{c.name}</div>
                            <p style={{fontSize:13.5, color:'rgba(255,255,255,0.7)', lineHeight:1.65, margin:0}}>{c.win}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* THE 10 STEPS */}
                    <div style={{paddingTop:48}}>
                      <div style={{display:'flex', alignItems:'baseline', gap:16, marginBottom:40, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase'}}>The Work</div>
                        <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 44px)', fontWeight:900, color:'#fff', margin:0, lineHeight:1, textTransform:'uppercase'}}>Ten steps.</h2>
                      </div>

                      {renderStep(0,
                        'Every caucus starts with a small group of members who recognize a shared problem.',
                        [
                          'That might be weak contracts. Unaccountable leadership. Lack of internal democracy. Safety issues being ignored. Discrimination or harassment. Concessionary bargaining. Whatever it is, name it clearly. The clarity of the problem is what makes the caucus possible.',
                          'Start by talking — privately and one-on-one — with coworkers you trust. Listen more than you talk. You\\'re looking for people who share your concerns and are willing to do the work, not just complain.',
                          'A core group of five to ten committed members is enough to begin. The conversations themselves are the first organizing work. Many members have never been asked, in a real way, what they think their union should be doing differently. Asking is itself an act of organizing.'
                        ]
                      )}

                      {renderStep(1,
                        'Your founding group becomes the steering committee. This is the body that drives the caucus until membership grows large enough to elect formal leadership.',
                        [
                          'The steering committee sets strategy and priorities, drafts your platform and principles, plans meetings and outreach, handles communications, and makes decisions between general meetings.',
                          'Aim for diversity across worksites, shifts, departments, demographics, and seniority levels. A caucus that only represents one shop or one slice of the membership will struggle to grow. The legitimacy of the caucus comes from being recognizably representative of the union you\\'re trying to change.'
                        ]
                      )}

                      {renderStep(2,
                        'Your platform is a public statement of what your caucus stands for. It should be short, clear, and concrete.',
                        [
                          'Most caucus platforms include three things: principles (democracy, transparency, member power, solidarity), demands (specific changes you want in contracts, bylaws, or union practices), and vision (what kind of union you\\'re trying to build).',
                          'Write it together. Argue it out. The process of writing the platform is itself a unity-building exercise — you\\'ll discover where the founding group agrees and where it doesn\\'t. The disagreements aren\\'t weaknesses. They\\'re the conversations the caucus exists to have.'
                        ]
                      )}

                      {renderStep(3,
                        'A good caucus name is memorable, communicates your values, and sounds like something members want to join.',
                        [
                          'Common patterns from the historical record: "[Profession] for a Democratic Union" (Teamsters for a Democratic Union). "Rank-and-File [Group]" (Caucus of Rank-and-File Educators). "Members for [Value]" (Members for Democracy). "United / Unity [Name]" (Unite All Workers for Democracy).',
                          'You\\'ll also want a logo, basic visual identity, and a way for members to find you online. None of this needs to be expensive. A simple one-color wordmark that prints clean on a flyer and reads on a phone is enough.'
                        ]
                      )}

                      {renderStep(4,
                        'A caucus that wants to democratize its union must be democratic itself. There is no shortcut around this.',
                        [
                          'Establish clear rules from the beginning: how decisions get made, how leaders are chosen and rotated, how meetings are run, how disputes are resolved, and how money is handled if you collect dues.',
                          'Many caucuses adopt formal bylaws once they grow beyond the founding group. Bylaws aren\\'t bureaucracy — they\\'re the protection that prevents your caucus from drifting into the same patterns you\\'re fighting against.'
                        ]
                      )}

                      {renderStep(5,
                        'Caucus building is one-on-one organizing. The most effective recruitment happens through personal conversations, not flyers or social media posts.',
                        [
                          'Caucuses that try to grow through broadcast — emails, Facebook posts, leaflets — almost always plateau quickly. Caucuses that grow through structured one-on-ones keep building, year over year, because each new member brings their own network with them.',
                          'Track your contacts. Most caucuses use a spreadsheet, database, or organizing app like Action Network or Action Builder. The list is the caucus.'
                        ],
                        // Recruitment flow visual
                        <div style={{margin:'32px 0 8px 0', padding:'28px 24px', background:'rgba(220,38,38,0.04)', border:'1px solid rgba(220,38,38,0.18)'}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:2.5, textTransform:'uppercase', marginBottom:20}}>The Recruitment Flow</div>
                          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:0}}>
                            {[
                              { n:'01', name:'Identify', body:'List every member you know. Rate likely interest.' },
                              { n:'02', name:'Approach', body:'Real conversation about their concerns and the caucus.' },
                              { n:'03', name:'Ask', body:'Invite them to a meeting, sign a card, take an action.' },
                              { n:'04', name:'Follow up', body:'Stay in contact. Give them something to do.' },
                              { n:'05', name:'Develop', body:'Bring active members into leadership over time.' },
                            ].map((s, i, arr) => (
                              <div key={i} style={{padding:'4px 16px 4px 0', borderRight: i < arr.length-1 ? '1px solid rgba(255,255,255,0.08)' : 'none', position:'relative'}}>
                                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, color:ACCENT, letterSpacing:1.5, marginBottom:8}}>{s.n}</div>
                                <div style={{fontSize:14, fontWeight:700, color:'#fff', marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>{s.name}</div>
                                <div style={{fontSize:12.5, color:'rgba(255,255,255,0.65)', lineHeight:1.55}}>{s.body}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {renderStep(6,
                        'You need ways to reach members beyond your core group.',
                        [
                          'Most caucuses use a combination: a newsletter distributed at worksites, a website explaining the caucus and its platform, social media for visibility, group chats (Signal or WhatsApp) for active members, and regular meetings — monthly is typical, with worksite-level meetings between.',
                          'Always communicate in the voice of the membership, not above them. Avoid jargon. Tell stories. The most effective caucus newsletters are the ones that read like they were written by a coworker — because they were.'
                        ]
                      )}

                      {renderStep(7,
                        'A caucus exists to win things. Pick fights you can win, or fights worth losing because they build organization.',
                        [
                          'Common caucus campaigns: contract campaigns that push leadership to bargain harder, bylaws reform such as direct election of officers and term limits, officer elections where you run a slate of candidates, and issue campaigns around safety, anti-discrimination, or organizing the unorganized.',
                          'Each campaign should build the caucus — more members, more leaders, more capacity for the next fight. A campaign that wins a single concession but doesn\\'t leave the caucus stronger is a missed opportunity. A campaign that loses on the issue but leaves you with fifty new active members is a win.'
                        ]
                      )}

                      {renderStep(8,
                        'Connect with caucuses in other locals and other unions.',
                        [
                          'Networks like Labor Notes host conferences, trainings, and gatherings where reform-minded union members meet, share strategy, and learn from each other. The Labor Notes Conference, held every two years in Chicago, is the largest gathering of rank-and-file caucus members in the country.',
                          'Building a national or industry-wide network multiplies your power and protects your caucus from isolation. Most successful reform caucuses didn\\'t emerge alone — they were part of a wave.'
                        ]
                      )}

                      {renderStep(9,
                        'Caucuses fail in predictable ways. Knowing the failure modes is half of avoiding them.',
                        [
                          'Caucuses become cliques disconnected from the broader membership. They get absorbed into the leadership they once challenged, trading principles for committee assignments. They burn out their core organizers by asking too much from the same five people for too many years. They fight each other instead of the boss or the bureaucracy.',
                          'Stay accountable to members. Develop new leaders constantly — every year, you should be bringing in people who can replace the founders. Remember why you started.'
                        ]
                      )}

                    </div>

                    {/* INTERACTIVE CHECKLIST */}
                    <section style={{padding:'72px 0', marginTop:32, borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:32}}>
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>Your Progress</div>
                          <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(36px, 5.5vw, 64px)', fontWeight:900, color:'#fff', margin:0, lineHeight:1, textTransform:'uppercase'}}>The checklist.</h2>
                        </div>
                        <div style={{display:'flex', alignItems:'baseline', gap:14}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(48px, 7vw, 80px)', fontWeight:900, color:ACCENT, lineHeight:1}}>{checkedPct}<span style={{fontSize:32, color:'rgba(255,255,255,0.4)'}}>%</span></div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:2, textTransform:'uppercase'}}>{checkedCount} of 10 done</div>
                        </div>
                      </div>
                      <p style={{fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.65, marginBottom:32, maxWidth:680}}>
                        Track your caucus-building progress. Your checks save in your browser — come back any time and pick up where you left off.
                      </p>
                      <div>
                        {STEPS.map((s, i) => (
                          <button
                            key={s.num}
                            onClick={() => toggleChecked(i)}
                            style={{
                              display:'flex', alignItems:'center', gap:18, width:'100%',
                              padding:'16px 20px',
                              background: checked[i] ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.025)',
                              border: '1px solid ' + (checked[i] ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.06)'),
                              marginBottom: 6, cursor:'pointer', textAlign:'left',
                              transition:'all 0.18s'
                            }}
                            onMouseEnter={e => { if (!checked[i]) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { if (!checked[i]) e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                          >
                            <div style={{
                              width:28, height:28, flexShrink:0,
                              background: checked[i] ? ACCENT : 'transparent',
                              border: '2px solid ' + (checked[i] ? ACCENT : 'rgba(255,255,255,0.25)'),
                              display:'flex', alignItems:'center', justifyContent:'center',
                              transition:'all 0.18s'
                            }}>
                              {checked[i] && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              )}
                            </div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:700, color: checked[i] ? ACCENT : 'rgba(255,255,255,0.4)', letterSpacing:1.5, minWidth:32}}>{s.num}</div>
                            <div style={{flex:1, fontSize:15, fontWeight:600, color: checked[i] ? '#fff' : 'rgba(255,255,255,0.85)', textDecoration: checked[i] ? 'line-through' : 'none', textDecorationColor: ACCENT_DIM}}>{s.title}</div>
                          </button>
                        ))}
                      </div>
                      {checkedCount === 10 && (
                        <div style={{marginTop:32, padding:'28px 32px', background:'rgba(220,38,38,0.1)', border:'1px solid ' + ACCENT, textAlign:'center'}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 38px)', fontWeight:900, color:'#fff', textTransform:'uppercase', marginBottom:8, lineHeight:1.1}}>You're not done. You're started.</div>
                          <div style={{fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6}}>Caucus building is a years-long project. Cycle the checklist back to the top and run it again with the next campaign.</div>
                        </div>
                      )}
                    </section>

                    {/* LEGAL NOTES */}
                    <section style={{padding:'72px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>Legal & Practical</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 4.5vw, 48px)', fontWeight:900, color:'#fff', margin:'0 0 32px 0', lineHeight:1.05, textTransform:'uppercase'}}>Know your rights.</h2>
                      <p style={{fontSize:15.5, color:'rgba(255,255,255,0.78)', lineHeight:1.75, marginBottom:18, maxWidth:720}}>
                        Caucus activity is generally protected as long as it\\'s done by members in good standing and doesn\\'t disrupt official union operations. Avoid using union resources — email, equipment, meeting time — for caucus work unless explicitly permitted. Don\\'t share confidential union information improperly.
                      </p>
                      <p style={{fontSize:15.5, color:'rgba(255,255,255,0.78)', lineHeight:1.75, marginBottom:18, maxWidth:720}}>
                        Federal law — the Labor-Management Reporting and Disclosure Act of 1959 (LMRDA), also known as the Landrum-Griffin Act — protects members\\' rights to free speech, assembly, and to run for office within their union. Title I of the LMRDA is your bill of rights as a union member.
                      </p>
                      <p style={{fontSize:15.5, color:'rgba(255,255,255,0.78)', lineHeight:1.75, marginBottom:18, maxWidth:720}}>
                        If your caucus runs candidates for office, study your union\\'s election rules carefully. The Department of Labor enforces strict rules about campaigning, mailing lists, and access to membership data. The Association for Union Democracy (listed below) maintains free legal resources for reform candidates and can connect you with attorneys who handle union election law.
                      </p>
                    </section>

                    {/* RESOURCES */}
                    <section style={{padding:'72px 0'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>The Library</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 4.5vw, 48px)', fontWeight:900, color:'#fff', margin:'0 0 32px 0', lineHeight:1.05, textTransform:'uppercase'}}>Where to learn more.</h2>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:0}}>
                        {[
                          { name:'Labor Notes', sub:'Books, conferences, and training for rank-and-file organizers. Biennial conference in Chicago is the largest gathering of caucus members in the country.' },
                          { name:'Democracy Is Power', sub:'Mike Parker and Martha Gruelle\\'s classic handbook on union reform. The single most cited book on caucus organizing in American labor history.' },
                          { name:'Secrets of a Successful Organizer', sub:'Labor Notes\\' foundational organizing manual. Less about caucus strategy specifically; more about the one-on-one organizing conversations every caucus depends on.' },
                          { name:'Association for Union Democracy', sub:'Legal and organizational support for reform efforts. Free advice on LMRDA questions, election challenges, and member rights cases since 1969.' },
                        ].map((r, i) => (
                          <div key={i} style={{padding:'20px 24px 20px 0', borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.01em'}}>{r.name}</div>
                            <div style={{fontSize:13.5, color:'rgba(255,255,255,0.65)', lineHeight:1.6}}>{r.sub}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* CLOSING */}
                    <section style={{padding:'80px 0 24px', textAlign:'center'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 56px)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:18, textTransform:'uppercase', maxWidth:720, margin:'0 auto 18px'}}>
                        Forming a caucus is hard, slow work.
                      </div>
                      <div style={{fontSize:17, color:'rgba(255,255,255,0.7)', lineHeight:1.65, maxWidth:560, margin:'0 auto 32px'}}>
                        It takes years, not months, to build real power inside a union. But every reform victory in the modern labor movement started with a few members talking quietly in a break room, deciding their union could be better — and getting organized to make it happen.
                      </div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase'}}>You can be part of that tradition.</div>
                    </section>

                  </main>
                </div>

                {/* MEDIA QUERY: show sidebar on desktop */}
                <style>{\`
                  @media (min-width: 980px) {
                    .caucus-sidebar { display: block !important; }
                  }
                \`}</style>
              </div>
            );
          };
          return <CaucusPage />;
        })()}
`;

// ============================================================================
// EDIT 1 — Insert page route before rtw page
// ============================================================================
const rtwAnchor = '\n        {page === "rtw" && (() => {';
if (!src.includes(rtwAnchor)) {
  console.error('ERROR: could not find rtw anchor');
  process.exit(1);
}
src = src.replace(rtwAnchor, () => PAGE_BLOCK + rtwAnchor);

// ============================================================================
// EDIT 2 — Add 'caucus' to validPages
// ============================================================================
const validOld = `'history-iupat','history-nnu','downpayment']`;
const validNew = `'history-iupat','history-nnu','downpayment','caucus']`;
if (!src.includes(validOld)) {
  console.error('ERROR: could not find validPages anchor');
  process.exit(1);
}
src = src.replace(validOld, validNew);

// ============================================================================
// EDIT 3 — Add PAGE_META entry
// ============================================================================
const metaOld = `      'organize-contractor': { title: "Union Pathways — Organizing a Contractor", desc: "Top-down organizing in the construction trades. How non-union contractors come to sign with the union, why they would, and how members help bring them in." },`;
const metaNew = `      'organize-contractor': { title: "Union Pathways — Organizing a Contractor", desc: "Top-down organizing in the construction trades. How non-union contractors come to sign with the union, why they would, and how members help bring them in." },
      caucus: { title: "How to Form a Union Caucus — A Field Guide for Members · Union Pathways", desc: "Every reform victory in modern American labor began the same way — a few members talking in a break room, deciding their union could be better, and getting organized. The 10-step field guide to caucus building, drawn from TDU, CORE, UAWD, and the rest of the modern reform tradition." },`;
if (!src.includes(metaOld)) {
  console.error('ERROR: could not find PAGE_META organize-contractor anchor');
  process.exit(1);
}
src = src.replace(metaOld, metaNew);

// ============================================================================
// EDIT 4 — Update Resources dropdown active-state and add desktop entry
// ============================================================================
const navActiveOld = `(page==="rtw"||page==="weingarten"||page==="organize"||page==="organize-contractor")`;
const navActiveNew = `(page==="rtw"||page==="weingarten"||page==="organize"||page==="organize-contractor"||page==="caucus")`;
const navActiveCount = (src.match(/\(page==="rtw"\|\|page==="weingarten"\|\|page==="organize"\|\|page==="organize-contractor"\)/g) || []).length;
if (navActiveCount === 0) {
  console.error('ERROR: could not find Resources active-state checks');
  process.exit(1);
}
src = src.split(navActiveOld).join(navActiveNew);

// Add caucus item to desktop Resources dropdown — insert after organize-contractor
const desktopDropOld = `                  <div className={\`nav-dropdown-item\${page==="organize-contractor"?" active":""}\`} onMouseDown={() => { setPage("organize-contractor"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Que un contratista no sindical firme" : lang==="pl" ? "Pozyskanie wykonawcy do zwiazku" : "Get a non-union contractor to sign"}</span>
                  </div>`;
const desktopDropNew = `                  <div className={\`nav-dropdown-item\${page==="organize-contractor"?" active":""}\`} onMouseDown={() => { setPage("organize-contractor"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Que un contratista no sindical firme" : lang==="pl" ? "Pozyskanie wykonawcy do zwiazku" : "Get a non-union contractor to sign"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="caucus"?" active":""}\`} onMouseDown={() => { setPage("caucus"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Formar un Caucus" : lang==="pl" ? "Utworz Frakcje" : "Form a Caucus"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Reformar tu sindicato desde adentro" : lang==="pl" ? "Reformuj swoj zwiazek od wewnatrz" : "Reform your union from within"}</span>
                  </div>`;
if (!src.includes(desktopDropOld)) {
  console.error('ERROR: could not find desktop Resources dropdown organize-contractor entry');
  process.exit(1);
}
src = src.replace(desktopDropOld, desktopDropNew);

// ============================================================================
// EDIT 5 — Add caucus to mobile drawer Resources section
// ============================================================================
const mobileOld = `            <button className={\`mobile-drawer-link\${page==="organize-contractor" ? " active" : ""}\`} onClick={() => { setPage("organize-contractor"); setMobileNavOpen(false); }}>{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</button>`;
const mobileNew = `            <button className={\`mobile-drawer-link\${page==="organize-contractor" ? " active" : ""}\`} onClick={() => { setPage("organize-contractor"); setMobileNavOpen(false); }}>{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</button>
            <button className={\`mobile-drawer-link\${page==="caucus" ? " active" : ""}\`} onClick={() => { setPage("caucus"); setMobileNavOpen(false); }}>{lang==="es" ? "Formar un Caucus" : lang==="pl" ? "Utworz Frakcje" : "Form a Caucus"}</button>`;
if (!src.includes(mobileOld)) {
  console.error('ERROR: could not find mobile drawer organize-contractor entry');
  process.exit(1);
}
src = src.replace(mobileOld, mobileNew);

fs.writeFileSync(FILE, src);

// ============================================================================
// EDIT 6 — Add caucus to middleware.js (if it exists)
// ============================================================================
if (fs.existsSync(MIDDLEWARE)) {
  let mw = fs.readFileSync(MIDDLEWARE, 'utf8');
  if (!mw.includes("'caucus':")) {
    const mwAnchor = `  'downpayment': { title: "Down Payment Calculator — From Apprentice to Journeyman · Union Pathways", desc: "For fifth-year apprentices about to make journeyman. Calculate the gross raise from apprentice scale to full journeyman rate, then see how big a down payment you can save by living like an apprentice for a few more years. Built for the trades. Discipline not included — bring your own." },`;
    const mwInsert = `  'downpayment': { title: "Down Payment Calculator — From Apprentice to Journeyman · Union Pathways", desc: "For fifth-year apprentices about to make journeyman. Calculate the gross raise from apprentice scale to full journeyman rate, then see how big a down payment you can save by living like an apprentice for a few more years. Built for the trades. Discipline not included — bring your own." },
  'caucus': { title: "How to Form a Union Caucus — A Field Guide for Members · Union Pathways", desc: "Every reform victory in modern American labor began the same way — a few members talking in a break room, deciding their union could be better, and getting organized. The 10-step field guide to caucus building, drawn from TDU, CORE, UAWD, and the rest of the modern reform tradition." },`;
    if (mw.includes(mwAnchor)) {
      mw = mw.replace(mwAnchor, mwInsert);
      fs.writeFileSync(MIDDLEWARE, mw);
      console.log('  ✓ middleware.js updated with caucus entry');
    } else {
      console.log('  (note: middleware.js exists but downpayment anchor not found — page meta added to App.jsx only)');
    }
  } else {
    console.log('  middleware.js already has caucus entry');
  }
} else {
  console.log('  (note: middleware.js not found at root — that is OK if fix190 has not been deployed)');
}

console.log('');
console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - Inserted caucus page (10-step field guide + interactive checklist)');
console.log('  - Added caucus to validPages whitelist');
console.log('  - Added PAGE_META entry');
console.log('  - Added entry to desktop Resources dropdown');
console.log('  - Added entry to mobile drawer Resources section');
console.log('  - Updated Resources active-state checks');
console.log('  - Added caucus to middleware.js for social previews');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx middleware.js && git commit -m "feat: add caucus organizing field guide" && git push');
console.log('');
