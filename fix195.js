// fix195.js — Add the Mental Health page
//
// What this does:
//   1. Inserts page === "mental-health" route before the rtw page
//   2. Adds 'mental-health' to validPages whitelist
//   3. Adds PAGE_META entry
//   4. Adds entry to desktop Resources dropdown
//   5. Adds entry to mobile drawer Resources section
//   6. Adds entry to Edge Middleware (middleware.js) for social previews
//
// SAFE-MESSAGING DESIGN PRINCIPLES (these are why the page is laid out as it is):
//
//   The American Foundation for Suicide Prevention, CDC, and CIASP publish
//   guidelines on what messaging reduces vs. increases suicide risk.
//   This page follows them:
//
//   1. RESOURCES FIRST. Crisis lines visible above the fold.
//   2. NO METHOD SPECIFICS. We do not name, describe, or imply how people
//      die by suicide.
//   3. NO SHOCK TACTICS. Stats are presented matter-of-factly with their
//      sources, not in giant red type meant to alarm.
//   4. STRUCTURAL FRAMING. Construction worker suicide is presented as
//      an industry-wide / structural problem, NOT as a personal failing.
//   5. RECOVERY IS POSSIBLE. The page consistently emphasizes that help
//      works, recovery is normal, and people who reach out get better.
//   6. ACTIONABLE EVERYWHERE. Every section ends with something the
//      reader can do.
//
// Idempotency: detects 'page === "mental-health"' and exits cleanly.

const fs = require('fs');
const FILE = 'src/App.jsx';
const MIDDLEWARE = 'middleware.js';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('page === "mental-health"')) {
  console.log('Already applied — mental-health page is already in place.');
  process.exit(0);
}

// Color: calming teal (#14B8A6) — not red (red signals alarm, wrong tone)
const PAGE_BLOCK = `
        {page === "mental-health" && (() => {
          const MentalHealthPage = () => {
            const TEAL = '#14B8A6';
            const TEAL_DIM = 'rgba(20,184,166,0.5)';
            const TEAL_GLOW = 'rgba(20,184,166,0.15)';

            return (
              <div style={{position:'relative', minHeight:'100vh', background:'#0A0F0F', color:'#fff'}}>
                <div style={{position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize:'48px 48px', pointerEvents:'none', zIndex:0}} />
                <div style={{position:'fixed', top:-200, right:-200, width:600, height:600, background: 'radial-gradient(circle, ' + TEAL_GLOW + ' 0%, transparent 70%)', filter:'blur(40px)', pointerEvents:'none', zIndex:0}} />

                <div style={{position:'relative', zIndex:1, maxWidth:880, margin:'0 auto', padding:'24px 24px 80px'}}>

                  <div style={{paddingTop:24, marginBottom:24}}>
                    <div onClick={() => setPage('home')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      Resources
                    </div>
                  </div>

                  <header style={{paddingTop:24, paddingBottom:40, borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:18}}>
                      <div style={{height:1, width:32, background:TEAL}} />
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase'}}>For Members and Their People</div>
                    </div>
                    <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 8vw, 88px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0', letterSpacing:'-0.01em', textTransform:'uppercase'}}>
                      Mental health<br/>in the <span style={{color:TEAL}}>trades.</span>
                    </h1>
                    <p style={{fontSize:18, color:'rgba(255,255,255,0.85)', lineHeight:1.6, maxWidth:680, margin:'0 0 24px 0', fontWeight:500}}>
                      You are not alone. Help works. Recovery is the rule, not the exception. This page exists to connect you with the resources that actually help — for yourself, or for someone you care about.
                    </p>
                  </header>

                  {/* CRISIS RESOURCES — TOP OF PAGE */}
                  <section style={{padding:'40px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{padding:'32px 28px', background:'rgba(20,184,166,0.06)', border:'2px solid ' + TEAL, borderRadius:4}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>If You Need Help Right Now</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 40px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.05, textTransform:'uppercase'}}>You can talk to someone right now. Free. Confidential.</h2>

                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:14}}>
                        <a href="tel:988" style={{display:'block', padding:'20px 22px', background:'#0A0F0F', border:'1px solid ' + TEAL_DIM, textDecoration:'none', transition:'all 0.18s'}}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,184,166,0.08)'; e.currentTarget.style.borderColor = TEAL; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#0A0F0F'; e.currentTarget.style.borderColor = TEAL_DIM; }}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:2, textTransform:'uppercase', marginBottom:8}}>Call or Text</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:6}}>988</div>
                          <div style={{fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.4}}>988 Suicide & Crisis Lifeline. 24/7. Free. Confidential. English & Spanish.</div>
                        </a>

                        <a href="sms:741741?body=HOME" style={{display:'block', padding:'20px 22px', background:'#0A0F0F', border:'1px solid ' + TEAL_DIM, textDecoration:'none', transition:'all 0.18s'}}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,184,166,0.08)'; e.currentTarget.style.borderColor = TEAL; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#0A0F0F'; e.currentTarget.style.borderColor = TEAL_DIM; }}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:2, textTransform:'uppercase', marginBottom:8}}>Text</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:30, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:6}}>HOME → 741741</div>
                          <div style={{fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.4}}>Crisis Text Line. Trained counselor responds in minutes. Free.</div>
                        </a>

                        <a href="tel:988" style={{display:'block', padding:'20px 22px', background:'#0A0F0F', border:'1px solid ' + TEAL_DIM, textDecoration:'none', transition:'all 0.18s'}}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,184,166,0.08)'; e.currentTarget.style.borderColor = TEAL; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#0A0F0F'; e.currentTarget.style.borderColor = TEAL_DIM; }}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:2, textTransform:'uppercase', marginBottom:8}}>Veterans</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:6}}>988 + 1, or text 838255</div>
                          <div style={{fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.4}}>Veterans Crisis Line. Connects you to a VA-affiliated responder.</div>
                        </a>

                        <a href="tel:988" style={{display:'block', padding:'20px 22px', background:'#0A0F0F', border:'1px solid ' + TEAL_DIM, textDecoration:'none', transition:'all 0.18s'}}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,184,166,0.08)'; e.currentTarget.style.borderColor = TEAL; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#0A0F0F'; e.currentTarget.style.borderColor = TEAL_DIM; }}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:2, textTransform:'uppercase', marginBottom:8}}>En Español</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:6}}>988 (Marca 2) · AYUDA → 988</div>
                          <div style={{fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.4}}>988 Línea de Vida. Disponible 24/7 en español. Gratis. Confidencial.</div>
                        </a>
                      </div>

                      <div style={{marginTop:20, padding:'14px 18px', background:'rgba(255,255,255,0.04)', borderLeft:'3px solid ' + TEAL}}>
                        <div style={{fontSize:13, color:'rgba(255,255,255,0.85)', lineHeight:1.6}}>
                          <strong style={{color:TEAL}}>If you're with someone in crisis right now:</strong> Stay with them. Take any weapons or medications somewhere safer if you can do so without escalating. Call 988 together — many people will pick up the phone if someone else holds it for them.
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* WHY THIS MATTERS */}
                  <section style={{padding:'56px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>Why This Page Exists</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 44px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.05, textTransform:'uppercase'}}>The trades have a mental health crisis. It is not your fault.</h2>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:20}}>
                      Construction has the second-highest suicide rate of any U.S. industry, behind only mining and oil & gas extraction. The most recent published figures, released in 2025 covering 2023 data, count more than 5,000 male construction workers lost to suicide in a single year — roughly four times the national average for men.
                    </p>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:20}}>
                      That number is bigger than every fatal jobsite accident combined, by a factor of about five.
                    </p>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:24}}>
                      The reasons are structural, not personal. Chronic pain from years on the tools. Opioid prescriptions for that pain that were over-prescribed for a generation. Long stretches away from family on travel work. Layoff cycles that erase income overnight. A culture where asking for help has been treated as weakness. Heavy drinking culture that masks rather than treats what's underneath. None of that is the fault of any one tradesperson. All of it is the industry, and all of it can change.
                    </p>
                    <div style={{padding:'20px 22px', background:'rgba(20,184,166,0.05)', borderLeft:'3px solid ' + TEAL, marginTop:24}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:2, textTransform:'uppercase', marginBottom:10}}>The Most Important Thing on This Page</div>
                      <p style={{fontSize:16, color:'#fff', lineHeight:1.6, margin:0, fontWeight:500}}>
                        Help works. Recovery is the rule, not the exception. The vast majority of people who reach out for support get better. The thoughts that feel permanent right now are not permanent. They pass.
                      </p>
                    </div>
                    <div style={{marginTop:24, fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:0.5}}>
                      Sources: CPWR Center for Construction Research and Training (2025 report on 2023 data); CDC NIOSH; Construction Industry Alliance for Suicide Prevention.
                    </div>
                  </section>

                  {/* WARNING SIGNS */}
                  <section style={{padding:'56px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>If You're Worried About Someone</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 44px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.05, textTransform:'uppercase'}}>Warning signs to watch for.</h2>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:28}}>
                      Most people who die by suicide gave warning signs in the weeks before. Coworkers, family, and friends are often the first to notice. You don't need a clinical degree to spot these. You just need to be paying attention.
                    </p>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:1, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.08)'}}>
                      {[
                        { h:'Withdrawing', body:'Pulling back from friends, family, the crew. Stopped showing up to things they used to enjoy. Quiet on jobs where they used to be loud.' },
                        { h:'Drinking or using more', body:'Visible increase in alcohol or substance use. Drinking alone. Showing up rough. Talking about needing to numb out.' },
                        { h:'Sleep changes', body:'Sleeping much more than usual or much less. Looks exhausted constantly. Mentions insomnia or "can\\'t turn off."' },
                        { h:'Mood swings', body:'Sudden anger, sudden calm after a long rough patch (this one matters — the calm can mean a decision has been made).' },
                        { h:'Giving things away', body:'Suddenly settling debts. Giving away tools or possessions that mattered to them. "Just want to make sure things are taken care of."' },
                        { h:'Talking about being a burden', body:'"Everyone would be better off without me." "I\\'m just dragging people down." Take this language seriously when you hear it.' },
                      ].map((s, i) => (
                        <div key={i} style={{padding:'24px 22px', background:'#0F1414'}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:'#fff', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.01em'}}>{s.h}</div>
                          <div style={{fontSize:13.5, color:'rgba(255,255,255,0.72)', lineHeight:1.65}}>{s.body}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:24, fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6, fontStyle:'italic'}}>
                      None of these alone means a crisis. Several together, or a sudden change from how someone normally acts, is worth a conversation.
                    </div>
                  </section>

                  {/* HOW TO START THE CONVERSATION */}
                  <section style={{padding:'56px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>The Conversation</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 44px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.05, textTransform:'uppercase'}}>How to start the conversation.</h2>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:32}}>
                      You don't have to be a counselor. You don't have to fix anything. You just have to make space. The single biggest thing you can do is ask, listen, and stay.
                    </p>
                    <div>
                      {[
                        { n:'01', h:'Notice out loud', body:'"Hey, I\\'ve noticed you\\'ve seemed off the last few weeks. You doing okay?" Saying you noticed is itself a gift. Most people in crisis feel invisible.' },
                        { n:'02', h:'Listen, don\\'t fix', body:'Resist the urge to give advice or compare to your own experience. Just let them talk. The first thing people in crisis need is to feel heard, not solved.' },
                        { n:'03', h:'Ask the real question', body:'"Are you thinking about hurting yourself?" Asking directly does not put the idea in someone\\'s head. Decades of research has shown the opposite: it gives them permission to talk about something they\\'ve been carrying alone.' },
                        { n:'04', h:'Stay with them', body:'If they say yes, don\\'t leave them alone. Sit with them. Drive with them. Call 988 together. Most people will pick up the phone if someone else holds it for them.' },
                        { n:'05', h:'Follow up', body:'Days later, weeks later, check back in. Not just once. The risk of crisis doesn\\'t end when the moment passes. Showing up again signals: you matter to me.' },
                      ].map((s, i) => (
                        <div key={i} style={{display:'flex', gap:24, marginBottom:28, paddingBottom:28, borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none'}}>
                          <div style={{flexShrink:0, width:60}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:TEAL, lineHeight:1, letterSpacing:'-0.02em'}}>{s.n}</div>
                          </div>
                          <div style={{flex:1, minWidth:0}}>
                            <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 8px 0', textTransform:'uppercase', letterSpacing:'0.005em'}}>{s.h}</h3>
                            <p style={{fontSize:15, color:'rgba(255,255,255,0.78)', lineHeight:1.7, margin:0}}>{s.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* MEMBER ASSISTANCE PROGRAMS */}
                  <section style={{padding:'56px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>Union Resources</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 44px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.05, textTransform:'uppercase'}}>Your Member Assistance Program.</h2>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:20}}>
                      Most building trades unions and many locals run a Member Assistance Program (MAP). MAPs provide confidential mental health support, substance use counseling, and crisis intervention — usually free to members and often free to family members too.
                    </p>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:24}}>
                      A MAP counselor is not your employer's counselor. They report to the union, not to the company, and what you tell them is confidential. They will not show up in your employment file. They cannot get you laid off.
                    </p>
                    <div style={{padding:'24px 26px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', marginBottom:20}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:2, textTransform:'uppercase', marginBottom:14}}>How to find your MAP</div>
                      <ul style={{margin:0, paddingLeft:0, fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.85, listStyle:'none'}}>
                        {[
                          'Call your local hall and ask for the Member Assistance Program. Most halls have a designated MAP coordinator.',
                          'Check your local\\'s website or member portal — many list the MAP phone number directly.',
                          'Look at your benefits booklet from your health and welfare fund. MAP services are usually documented there.',
                          'Ask your business agent or shop steward. This is part of their job and they\\'ve helped other members do exactly this.',
                          'If your local does not have a MAP, the Laborers\\' Health & Safety Fund of North America runs LIUNA LEAN as a model program, and several international unions have national-level resources you can call directly.',
                        ].map((item, i) => (
                          <li key={i} style={{position:'relative', paddingLeft:24, marginBottom:8}}>
                            <span style={{position:'absolute', left:0, color:TEAL, fontWeight:900}}>—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p style={{fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.65, fontStyle:'italic'}}>
                      Asking for the MAP does not flag your file. It does not affect your standing in the local. The local exists to take care of members. This is one of the ways it does that.
                    </p>
                  </section>

                  {/* WHAT'S BEING DONE */}
                  <section style={{padding:'56px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>The Industry Response</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 44px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.05, textTransform:'uppercase'}}>What's being done.</h2>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.7, marginBottom:24}}>
                      The trades are not standing still on this. The most important industry-wide initiatives:
                    </p>
                    <div>
                      {[
                        { h:'CIASP', sub:'Construction Industry Alliance for Suicide Prevention', body:'A coalition of unions, contractors, and industry associations dedicated specifically to reducing construction worker suicide. Hosts the annual Construction Suicide Prevention Week every September. Provides free toolbox-talk materials, training resources, and a national stand-down day every May.' },
                        { h:'OSHA + AFSP Partnership', sub:'Federal-level focus, established 2022', body:'OSHA and the American Foundation for Suicide Prevention signed an alliance in 2022 to make construction worker mental health a federal workplace safety priority — pulling it into the same regulatory frame as fall protection and trench safety.' },
                        { h:'STAND Toolbox Talks', sub:'Suicide prevention, peer-to-peer', body:'Industry-developed toolbox talk programs that train foremen and superintendents to lead five-minute safety briefings on mental health alongside the standard PPE and lockout-tagout briefings. Normalizes the conversation as part of the workday.' },
                        { h:'Peer Support Programs', sub:'Member-to-member, growing fast', body:'A growing number of locals run peer support programs where trained members are available to other members for confidential conversations. Not therapy — but a fellow tradesperson who has been through it and knows the work culture.' },
                      ].map((s, i) => (
                        <div key={i} style={{padding:'20px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'}}>
                          <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom:10, flexWrap:'wrap'}}>
                            <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:'#fff', margin:0, textTransform:'uppercase'}}>{s.h}</h3>
                            <div style={{fontSize:13, color:TEAL, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>{s.sub}</div>
                          </div>
                          <p style={{fontSize:15, color:'rgba(255,255,255,0.78)', lineHeight:1.7, margin:0}}>{s.body}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* LIBRARY */}
                  <section style={{padding:'56px 0', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:TEAL, letterSpacing:3, textTransform:'uppercase', marginBottom:14}}>Library</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 44px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.05, textTransform:'uppercase'}}>Where to learn more.</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:0}}>
                      {[
                        { name:'988 Suicide & Crisis Lifeline', sub:'Call or text 988 from anywhere in the United States. 24/7. Free. Confidential. The single most important number in this list. Also at 988lifeline.org.' },
                        { name:'Crisis Text Line', sub:'Text HOME to 741741. A trained crisis counselor responds in minutes. For people who can\\'t or won\\'t make a phone call. Also at crisistextline.org.' },
                        { name:'Veterans Crisis Line', sub:'Dial 988 then press 1, or text 838255. For veterans, service members, and their families. Connects to a VA-affiliated responder.' },
                        { name:'CIASP — Construction Industry Alliance', sub:'preventconstructionsuicide.com — toolbox talk materials, statistics, training resources, and the annual Construction Suicide Prevention Week.' },
                        { name:'Construction Working Minds', sub:'A peer-led mental health initiative created specifically for construction workers, by construction workers. constructionworkingminds.org.' },
                        { name:'OSHA Mental Health & Suicide Prevention', sub:'Federal resources for employers and workers, including the OSHA-AFSP alliance materials. osha.gov/preventingsuicides.' },
                        { name:'SAMHSA Find Help', sub:'findtreatment.gov — federal directory of treatment facilities for mental health and substance use, searchable by location and insurance.' },
                        { name:'NAMI — National Alliance on Mental Illness', sub:'nami.org — broad mental health resources, support groups, and education. Helpline 1-800-950-6264.' },
                      ].map((r, i) => (
                        <div key={i} style={{padding:'20px 24px 20px 0', borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:'#fff', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.01em'}}>{r.name}</div>
                          <div style={{fontSize:13.5, color:'rgba(255,255,255,0.7)', lineHeight:1.6}}>{r.sub}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* BOTTOM CRISIS REMINDER */}
                  <section style={{padding:'56px 0 24px'}}>
                    <div style={{padding:'36px 32px', background:'rgba(20,184,166,0.08)', border:'2px solid ' + TEAL, borderRadius:4, textAlign:'center'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4vw, 38px)', fontWeight:900, color:'#fff', textTransform:'uppercase', marginBottom:14, lineHeight:1.1}}>If you read this whole page and you're struggling right now —</div>
                      <p style={{fontSize:17, color:'rgba(255,255,255,0.85)', lineHeight:1.6, marginBottom:24, maxWidth:560, margin:'0 auto 24px'}}>
                        Please call or text 988 before you close the tab. It is free. It is confidential. The person on the other end has talked to thousands of people in your shoes and is there for exactly this.
                      </p>
                      <div style={{display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap'}}>
                        <a href="tel:988" style={{display:'inline-flex', alignItems:'center', gap:10, background:TEAL, color:'#0A0F0F', padding:'16px 28px', textDecoration:'none', fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', border:'1px solid ' + TEAL}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                          Call 988
                        </a>
                        <a href="sms:741741?body=HOME" style={{display:'inline-flex', alignItems:'center', gap:10, background:'transparent', color:TEAL, padding:'16px 28px', textDecoration:'none', fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', border:'1px solid ' + TEAL}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          Text HOME → 741741
                        </a>
                      </div>
                    </div>
                  </section>

                  <div style={{paddingTop:32, fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.7, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:0.5, textAlign:'center'}}>
                    Union Pathways is not a medical provider. The information on this page is informational and not a substitute for professional care. If you are in crisis, please call 988 or your local emergency services.
                  </div>

                </div>
              </div>
            );
          };
          return <MentalHealthPage />;
        })()}
`;

// EDIT 1 — Insert page route before rtw page
const rtwAnchor = '\n        {page === "rtw" && (() => {';
if (!src.includes(rtwAnchor)) {
  console.error('ERROR: could not find rtw anchor');
  process.exit(1);
}
src = src.replace(rtwAnchor, () => PAGE_BLOCK + rtwAnchor);

// EDIT 2 — Add 'mental-health' to validPages
const validOld = `'history-iupat','history-nnu','downpayment','caucus']`;
const validNew = `'history-iupat','history-nnu','downpayment','caucus','mental-health']`;
if (!src.includes(validOld)) {
  console.error('ERROR: could not find validPages anchor');
  process.exit(1);
}
src = src.replace(validOld, validNew);

// EDIT 3 — Add PAGE_META entry
const metaOld = `      caucus: { title: "How to Form a Union Caucus — A Field Guide for Members · Union Pathways", desc: "Every reform victory in modern American labor began the same way — a few members talking in a break room, deciding their union could be better, and getting organized. The 10-step field guide to caucus building, drawn from TDU, CORE, UAWD, and the rest of the modern reform tradition." },`;
const metaNew = `      caucus: { title: "How to Form a Union Caucus — A Field Guide for Members · Union Pathways", desc: "Every reform victory in modern American labor began the same way — a few members talking in a break room, deciding their union could be better, and getting organized. The 10-step field guide to caucus building, drawn from TDU, CORE, UAWD, and the rest of the modern reform tradition." },
      'mental-health': { title: "Mental Health in the Trades · Union Pathways", desc: "You are not alone. Help works. Recovery is the rule, not the exception. Crisis resources (988, Crisis Text Line, Veterans line), warning signs, how to start the conversation, Member Assistance Programs, and the industry response to construction worker suicide. Built following safe-messaging guidelines from CIASP and the American Foundation for Suicide Prevention." },`;
if (!src.includes(metaOld)) {
  console.error('ERROR: could not find PAGE_META caucus anchor');
  process.exit(1);
}
src = src.replace(metaOld, metaNew);

// EDIT 4 — Update Resources active-state and add desktop entry
const navActiveOld = `(page==="rtw"||page==="weingarten"||page==="organize"||page==="organize-contractor"||page==="caucus")`;
const navActiveNew = `(page==="rtw"||page==="weingarten"||page==="organize"||page==="organize-contractor"||page==="caucus"||page==="mental-health")`;
const navActiveCount = (src.match(/\(page==="rtw"\|\|page==="weingarten"\|\|page==="organize"\|\|page==="organize-contractor"\|\|page==="caucus"\)/g) || []).length;
if (navActiveCount === 0) {
  console.error('ERROR: could not find Resources active-state checks');
  process.exit(1);
}
src = src.split(navActiveOld).join(navActiveNew);

const desktopDropOld = `                  <div className={\`nav-dropdown-item\${page==="caucus"?" active":""}\`} onMouseDown={() => { setPage("caucus"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Formar un Caucus" : lang==="pl" ? "Utworz Frakcje" : "Form a Caucus"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Reformar tu sindicato desde adentro" : lang==="pl" ? "Reformuj swoj zwiazek od wewnatrz" : "Reform your union from within"}</span>
                  </div>`;
const desktopDropNew = `                  <div className={\`nav-dropdown-item\${page==="caucus"?" active":""}\`} onMouseDown={() => { setPage("caucus"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Formar un Caucus" : lang==="pl" ? "Utworz Frakcje" : "Form a Caucus"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Reformar tu sindicato desde adentro" : lang==="pl" ? "Reformuj swoj zwiazek od wewnatrz" : "Reform your union from within"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="mental-health"?" active":""}\`} onMouseDown={() => { setPage("mental-health"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Salud Mental" : lang==="pl" ? "Zdrowie Psychiczne" : "Mental Health"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "988 y recursos para los oficios" : lang==="pl" ? "988 i zasoby dla rzemiosl" : "988 and resources for the trades"}</span>
                  </div>`;
if (!src.includes(desktopDropOld)) {
  console.error('ERROR: could not find desktop Resources dropdown caucus entry');
  process.exit(1);
}
src = src.replace(desktopDropOld, desktopDropNew);

// EDIT 5 — Add mental-health to mobile drawer Resources section
const mobileOld = `            <button className={\`mobile-drawer-link\${page==="caucus" ? " active" : ""}\`} onClick={() => { setPage("caucus"); setMobileNavOpen(false); }}>{lang==="es" ? "Formar un Caucus" : lang==="pl" ? "Utworz Frakcje" : "Form a Caucus"}</button>`;
const mobileNew = `            <button className={\`mobile-drawer-link\${page==="caucus" ? " active" : ""}\`} onClick={() => { setPage("caucus"); setMobileNavOpen(false); }}>{lang==="es" ? "Formar un Caucus" : lang==="pl" ? "Utworz Frakcje" : "Form a Caucus"}</button>
            <button className={\`mobile-drawer-link\${page==="mental-health" ? " active" : ""}\`} onClick={() => { setPage("mental-health"); setMobileNavOpen(false); }}>{lang==="es" ? "Salud Mental" : lang==="pl" ? "Zdrowie Psychiczne" : "Mental Health"}</button>`;
if (!src.includes(mobileOld)) {
  console.error('ERROR: could not find mobile drawer caucus entry');
  process.exit(1);
}
src = src.replace(mobileOld, mobileNew);

fs.writeFileSync(FILE, src);

// EDIT 6 — Add mental-health to middleware.js (if it exists)
if (fs.existsSync(MIDDLEWARE)) {
  let mw = fs.readFileSync(MIDDLEWARE, 'utf8');
  if (!mw.includes("'mental-health':")) {
    const mwAnchor = `  'caucus': { title: "How to Form a Union Caucus — A Field Guide for Members · Union Pathways", desc: "Every reform victory in modern American labor began the same way — a few members talking in a break room, deciding their union could be better, and getting organized. The 10-step field guide to caucus building, drawn from TDU, CORE, UAWD, and the rest of the modern reform tradition." },`;
    const mwInsert = `  'caucus': { title: "How to Form a Union Caucus — A Field Guide for Members · Union Pathways", desc: "Every reform victory in modern American labor began the same way — a few members talking in a break room, deciding their union could be better, and getting organized. The 10-step field guide to caucus building, drawn from TDU, CORE, UAWD, and the rest of the modern reform tradition." },
  'mental-health': { title: "Mental Health in the Trades · Union Pathways", desc: "You are not alone. Help works. Recovery is the rule, not the exception. Crisis resources (988, Crisis Text Line, Veterans line), warning signs, how to start the conversation, Member Assistance Programs, and the industry response to construction worker suicide. Built following safe-messaging guidelines from CIASP and the American Foundation for Suicide Prevention." },`;
    if (mw.includes(mwAnchor)) {
      mw = mw.replace(mwAnchor, mwInsert);
      fs.writeFileSync(MIDDLEWARE, mw);
      console.log('  ✓ middleware.js updated with mental-health entry');
    } else {
      console.log('  (note: middleware.js exists but caucus anchor not found — page meta added to App.jsx only)');
    }
  } else {
    console.log('  middleware.js already has mental-health entry');
  }
} else {
  console.log('  (note: middleware.js not found — page meta added to App.jsx only)');
}

console.log('');
console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx middleware.js && git commit -m "feat: add Mental Health page (988, CIASP, MAP)" && git push');
console.log('');
