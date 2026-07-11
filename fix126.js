// fix126.js
// Add the "Organize" page with two stacked sections:
//   I. For Workers — how to organize your workplace
//   II. For Union Members — how to help others organize
//
// Steps:
//   1. Add 'organize' to validPages whitelist (so URL routing works)
//   2. Add 'organize' entry to PAGE_META (title + description for SEO)
//   3. Add Organize button to the top nav (between Wages and Get in Touch)
//   4. Insert the page render block before the "PLATFORM OVERVIEW" home block

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

let changes = 0;

// ── 1. ADD 'organize' TO validPages ─────────────────────────────────────────
const oldValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','retirement','benefits','about','contact','jobboard','wages'];`;
const newValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','retirement','benefits','about','contact','jobboard','wages','organize'];`;
if (code.includes(oldValidPages)) {
  code = code.replace(oldValidPages, newValidPages);
  console.log('✓ Added "organize" to validPages');
  changes++;
} else if (code.includes(newValidPages)) {
  console.log('Skipping — "organize" already in validPages.');
} else {
  console.error('ERROR: validPages array not found.');
  process.exit(1);
}

// ── 2. ADD 'organize' TO PAGE_META ──────────────────────────────────────────
const oldMeta = `      wages:     { title: "Union Pathways — Local Wages Verified by Members", desc: "Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place." },`;
const newMeta =
`      wages:     { title: "Union Pathways — Local Wages Verified by Members", desc: "Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place." },
      organize:  { title: "Union Pathways — Organize Your Workplace", desc: "How to organize your workplace, your rights under federal labor law, and how union members can help organize others. Built for workers and members alike." },`;
if (code.includes(oldMeta)) {
  code = code.replace(oldMeta, newMeta);
  console.log('✓ Added "organize" entry to PAGE_META');
  changes++;
} else if (code.includes('organize:  { title: "Union Pathways — Organize Your Workplace"')) {
  console.log('Skipping — organize PAGE_META already present.');
} else {
  console.error('ERROR: wages PAGE_META anchor not found.');
  process.exit(1);
}

// ── 3. ADD ORGANIZE NAV BUTTON (between Wages and Get in Touch) ─────────────
const oldNavWages = `            <button className={\`nav-link \${page==="wages"?"active":""}\`} onClick={() => setPage("wages")}>{lang==="es" ? "Salarios" : lang==="pl" ? "Place" : "Wages"}</button>
            {/* GET IN TOUCH DROPDOWN */}`;
const newNavWages = `            <button className={\`nav-link \${page==="wages"?"active":""}\`} onClick={() => setPage("wages")}>{lang==="es" ? "Salarios" : lang==="pl" ? "Place" : "Wages"}</button>
            <button className={\`nav-link \${page==="organize"?"active":""}\`} onClick={() => setPage("organize")}>{lang==="es" ? "Organizar" : lang==="pl" ? "Organizuj" : "Organize"}</button>
            {/* GET IN TOUCH DROPDOWN */}`;
if (code.includes(oldNavWages)) {
  code = code.replace(oldNavWages, newNavWages);
  console.log('✓ Added Organize nav button');
  changes++;
} else if (code.includes('page==="organize"?"active"')) {
  console.log('Skipping — Organize nav button already present.');
} else {
  console.error('ERROR: nav button anchor not found (Wages → GET IN TOUCH transition).');
  process.exit(1);
}

// ── 4. INSERT ORGANIZE PAGE RENDER BLOCK ────────────────────────────────────
const insertAnchor = `        {/* PLATFORM OVERVIEW — show on home page when no results */}
        {page === "home" && !results && (`;

const organizePage =
`        {page === "organize" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Organizar Tu Lugar de Trabajo" : lang==="pl" ? "Organizowanie Miejsca Pracy" : "Organizing Your Workplace"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Cuando Nos Unimos, "}<span className="accent">{"Ganamos."}</span></>
                : lang==="pl" ? <>{"Gdy Się Jednoczymy, "}<span className="accent">{"Wygrywamy."}</span></>
                : <>{"When We Stand Together, "}<span className="accent">{"We Win."}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Organizar significa que los trabajadores se unen para tener voz en su trabajo. Esta página es para los trabajadores que quieren organizar su lugar de trabajo y para los miembros del sindicato que ayudan a otros."
                : lang==="pl" ? "Organizowanie oznacza łączenie się pracowników, aby mieć głos w pracy. Ta strona jest dla pracowników, którzy chcą zorganizować swoje miejsce pracy oraz dla członków związku, którzy pomagają innym to zrobić."
                : "Organizing means workers coming together to have a voice at work. This page is for two groups — workers who want to organize their workplace, and union members helping others do the same."}
              </p>
            </div>

            {/* === FOR WORKERS === */}
            <div style={{maxWidth:820, margin:"0 auto", padding:"40px 24px 0"}}>
              <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:24, flexWrap:"wrap"}}>
                <div style={{width:48, height:48, borderRadius:12, background:"#FA805922", border:"2px solid #FA8059", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#FA8059"}}>I</div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:"#fff", margin:0, lineHeight:1.1, flex:1, minWidth:0}}>For Workers — How to Organize Your Job</h2>
              </div>
              <p style={{fontSize:16, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:32}}>
                Forming a union at your workplace is a legal right protected under federal law. Here's what that means and how the process actually works.
              </p>

              <div style={{background:"rgba(245,197,24,0.06)", border:"1px solid rgba(245,197,24,0.2)", borderRadius:12, padding:"24px 28px", marginBottom:32}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#F5C518", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>Your Rights</div>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#fff", margin:"0 0 16px 0"}}>Section 7 of the National Labor Relations Act protects you</h3>
                <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:12}}>
                  Under federal law, most private-sector workers have the right to:
                </p>
                <ul style={{paddingLeft:20, color:"rgba(255,255,255,0.85)", fontSize:15, lineHeight:1.85, margin:0}}>
                  <li>Form, join, or assist a union</li>
                  <li>Discuss wages, hours, and working conditions with coworkers</li>
                  <li>Sign union authorization cards</li>
                  <li>Take collective action to improve your workplace</li>
                  <li>Decline to participate in the union — your choice either way</li>
                </ul>
                <p style={{fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.7, marginTop:16, fontStyle:"italic"}}>
                  Your employer cannot legally fire, demote, threaten, or retaliate against you for these activities. Violations are called Unfair Labor Practices (ULPs) and can be filed with the National Labor Relations Board (NLRB) at nlrb.gov.
                </p>
              </div>

              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"40px 0 16px 0"}}>Signs your workplace might need a union</h3>
              <div className="impact-grid" style={{marginTop:16}}>
                {[
                  {t:"Wage Stagnation", d:"Pay raises don't keep up with inflation, are inconsistent, or favor management's chosen few."},
                  {t:"Pay Secrecy", d:"You're discouraged or forbidden from discussing wages with coworkers — itself a protected activity."},
                  {t:"Unsafe Conditions", d:"Safety complaints get ignored, dismissed, or punished."},
                  {t:"Inconsistent Discipline", d:"Rules apply differently depending on who you are or who you know."},
                  {t:"No Real Benefits", d:"Health insurance is unaffordable, retirement is nonexistent, or PTO disappears at management's discretion."},
                  {t:"No Voice", d:"Schedules, assignments, and policies change without notice or input."},
                ].map((s, i) => (
                  <div key={i} className="impact-card">
                    <div className="impact-title">{s.t}</div>
                    <div className="impact-desc">{s.d}</div>
                  </div>
                ))}
              </div>

              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"48px 0 16px 0"}}>How the process works</h3>
              <div style={{marginTop:16}}>
                {[
                  {n:"01", t:"Talk to your coworkers — quietly", d:"Identify the people you trust most. Have private one-on-one conversations. Don't post about it on company devices, channels, or social media."},
                  {n:"02", t:"Contact a union organizer", d:"Reach out to the union covering your trade or industry. They have professional organizers whose job is to help — for free, confidentially. Use the Find a Local tool here to identify the right local."},
                  {n:"03", t:"Build an organizing committee", d:"With the organizer's help, form a small committee of trusted coworkers across departments and shifts. This is the engine of the campaign."},
                  {n:"04", t:"Sign authorization cards", d:"Authorization cards are a legal document signaling you want union representation. Generally, 30%+ of cards triggers an NLRB election; 50%+ can lead to voluntary recognition or a faster path."},
                  {n:"05", t:"Vote — and bargain the first contract", d:"If you win the NLRB election (or are voluntarily recognized), the union and employer must bargain in good faith. First contracts typically take 6–18 months."},
                ].map((step, i) => (
                  <div key={i} style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, borderLeft:"4px solid #FA8059"}}>
                    <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#FA805922", color:"#FA8059", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>{step.n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>{step.t}</div>
                      <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"48px 0 16px 0"}}>Watch for these employer tactics</h3>
              <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                When workers start organizing, employers commonly respond. Some responses are legal, others are not. Knowing the difference matters.
              </p>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:20, marginBottom:24}}>
                <div style={{padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, color:"#F5C518", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>Legal but Common</div>
                  <ul style={{paddingLeft:20, color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:1.8, margin:0}}>
                    <li>Captive audience meetings</li>
                    <li>One-on-one meetings with supervisors</li>
                    <li>"Vote no" flyers, posters, and emails</li>
                    <li>Hiring anti-union consultants</li>
                    <li>Sharing the company's "side" of the story</li>
                  </ul>
                </div>
                <div style={{padding:"24px 28px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, color:"#ef4444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>Illegal — File a ULP</div>
                  <ul style={{paddingLeft:20, color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:1.8, margin:0}}>
                    <li>Firing or disciplining organizers</li>
                    <li>Threats of closure, layoffs, or retaliation</li>
                    <li>Promising raises or perks if you vote no</li>
                    <li>Surveilling or interrogating workers about union activity</li>
                    <li>Banning union talk during break time</li>
                  </ul>
                </div>
              </div>
              <p style={{fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.7, marginTop:16}}>
                If you experience anything in the second list, document it (date, time, who said what, witnesses) and report it to your organizer or directly to the NLRB at nlrb.gov.
              </p>

              <div style={{margin:"48px 0", padding:"32px 36px", background:"linear-gradient(135deg, rgba(250,128,89,0.1), rgba(245,197,24,0.05))", border:"1px solid rgba(250,128,89,0.25)", borderRadius:16}}>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>Ready to talk to an organizer?</h3>
                <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.7, marginBottom:20}}>
                  Use the Find a Local tool to identify the union covering your trade and area. Then reach out to their organizing department directly. The conversation is confidential and free.
                </p>
                <button onClick={() => setPage("home")} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1, textTransform:"uppercase", padding:"14px 32px", border:"none", borderRadius:50, cursor:"pointer"}}>Find Your Local →</button>
              </div>
            </div>

            <div style={{maxWidth:820, margin:"40px auto", padding:"0 24px"}}>
              <div style={{height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"}}></div>
            </div>

            {/* === FOR UNION MEMBERS === */}
            <div style={{maxWidth:820, margin:"0 auto", padding:"40px 24px 80px"}}>
              <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:24, flexWrap:"wrap"}}>
                <div style={{width:48, height:48, borderRadius:12, background:"#3B9EFF22", border:"2px solid #3B9EFF", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#3B9EFF"}}>II</div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:"#fff", margin:0, lineHeight:1.1, flex:1, minWidth:0}}>For Members — Helping Others Organize</h2>
              </div>
              <p style={{fontSize:16, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:32}}>
                Every contract you have was won because earlier members organized. Helping non-union workers organize their shops is how the trades grow — and how standards stay high across the industry.
              </p>

              <div style={{background:"rgba(59,158,255,0.06)", border:"1px solid rgba(59,158,255,0.2)", borderRadius:12, padding:"24px 28px", marginBottom:32}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#3B9EFF", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>COMET Training</div>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>Construction Organizing Membership Education Training</h3>
                <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75}}>
                  COMET is the building trades' national member-organizing program. It's free for members, runs through your local, and is built around the idea that members talking to other workers — not paid staff — is the most effective way to organize. Ask your business agent or organizer if your local offers it. Many do.
                </p>
              </div>

              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"40px 0 16px 0"}}>Salting</h3>
              <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:16}}>
                Salting is when a union member takes a job at a non-union company specifically to help organize it from the inside. Several internationals — including the IBEW and the UA — run formal paid salting programs. Salting is fully legal under federal law (the Supreme Court confirmed this in <i>NLRB v. Town &amp; Country Electric</i>, 1995).
              </p>
              <p style={{fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.7, fontStyle:"italic"}}>
                If salting interests you, talk to your organizer. Programs typically pay union scale and benefits for the time you're inside.
              </p>

              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"40px 0 16px 0"}}>How to talk to non-union workers</h3>
              <div className="impact-grid" style={{marginTop:16}}>
                {[
                  {t:"Listen first", d:"Find out what's actually frustrating them at work before pitching anything. People want to feel heard, not lectured."},
                  {t:"Lead with facts", d:"Wages, benefits, training, retirement — concrete numbers move people more than slogans."},
                  {t:"Don't badmouth their boss", d:"It rarely lands. Focus on what a contract would give them, not on tearing down their current situation."},
                  {t:"Share your own story", d:"How you got into the trade, what your apprenticeship was like, what your retirement looks like. Stories beat statistics."},
                  {t:"Acknowledge the hard parts", d:"Dues, initiation fees, strikes, politics — they will come up. Answer them honestly. Don't dodge."},
                  {t:"Make the connection", d:"When they're ready, hand them off to your local's organizer. Don't try to run the whole campaign alone."},
                ].map((s, i) => (
                  <div key={i} className="impact-card">
                    <div className="impact-title">{s.t}</div>
                    <div className="impact-desc">{s.d}</div>
                  </div>
                ))}
              </div>

              <div style={{margin:"48px 0 0", padding:"32px 36px", background:"linear-gradient(135deg, rgba(59,158,255,0.1), rgba(245,197,24,0.05))", border:"1px solid rgba(59,158,255,0.25)", borderRadius:16}}>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>Get connected to your local's organizing department</h3>
                <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0}}>
                  Most locals have at least one full-time organizer. Ask at your next union meeting, call the hall, or check your local's website.
                </p>
              </div>
            </div>

            {/* DISCLAIMER */}
            <div style={{maxWidth:820, margin:"0 auto", padding:"0 24px 80px"}}>
              <div style={{padding:"20px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.7}}>
                <strong style={{color:"rgba(255,255,255,0.85)"}}>Note:</strong> The information on this page is general and educational. It's not legal advice. Labor law varies by state and industry — agricultural workers, domestic workers, and most public-sector employees are covered by different laws than private-sector workers. For specific situations, talk to a union organizer, the NLRB (nlrb.gov), or a labor attorney.
              </div>
            </div>
          </div>
        )}

        {/* PLATFORM OVERVIEW — show on home page when no results */}
        {page === "home" && !results && (`;

if (code.includes(insertAnchor) && !code.includes(`{page === "organize" && (`)) {
  code = code.replace(insertAnchor, organizePage);
  console.log('✓ Inserted Organize page render block');
  changes++;
} else if (code.includes(`{page === "organize" && (`)) {
  console.log('Skipping — Organize page render block already present.');
} else {
  console.error('ERROR: PLATFORM OVERVIEW anchor not found.');
  process.exit(1);
}

fs.writeFileSync(path, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Organize page with For Workers and For Members sections" && git push');
console.log('');
