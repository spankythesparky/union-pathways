// fix130.js
// Replace the abstract "What the signing process actually looks like" section
// on the Organizing a Contractor page with the concrete 5-step process.
//
// Written fully generically — no specific local is named anywhere.
//
// New structure:
//   - Lead-in: two core requirements anywhere are Letter of Assent + bonding
//   - Caveat: specifics vary by local
//   - Yellow callout: brand-new businesses need structure + insurance first
//   - 5 steps for established businesses:
//     1. Sign a Letter of Assent (A / B / C)
//     2. Post the required bonds (Wage + Fringe Benefit)
//     3. Set up benefit reporting (third-party administrator pattern)
//     4. Workforce transition (member meeting + onboarding + hiring hall)
//     5. Make lots of money 💰

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldSection =
`              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"48px 0 16px 0"}}>What the signing process actually looks like</h3>
              <div style={{marginTop:16}}>
                {[
                  {n:"1", t:"Initial sit-down", d:"Contractor meets with the business agent and organizer. Local lays out the CBA — wage rates, fringe contributions, work rules, jurisdiction."},
                  {n:"2", t:"Numbers review", d:"Contractor compares their current labor cost to the union package. Union scale plus fringes is often higher per-hour, but lower overall once you net out benefits, training, recruiting, and turnover."},
                  {n:"3", t:"Letter of Assent", d:"Short legal document — the contractor agrees to be bound by the area's CBA and any future modifications. Signed once, valid until the contractor terminates per the CBA's notice rules."},
                  {n:"4", t:"Existing workers brought in", d:"Bridge provisions in most CBAs let current employees come into the union without losing seniority or benefits accrual. They get books, get dispatched, and start contributing to multiemployer plans."},
                  {n:"5", t:"First job under contract", d:"Contractor either keeps existing crews on the next job (now under CBA terms) or pulls fresh workers from the hall. Either way — they're now a signatory."},
                ].map((step, i) => (
                  <div key={i} style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, borderLeft:"4px solid #FA8059"}}>
                    <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#FA805922", color:"#FA8059", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>{step.n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>{step.t}</div>
                      <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>`;

const newSection =
`              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"48px 0 16px 0"}}>The process — step by step</h3>
              <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:16}}>
                The two core requirements anywhere in the country are <b>signing a Letter of Assent</b> and <b>posting the required bonds</b>. Everything else — what kind of bonds, which third-party administrator handles benefits, how workforce transition is run — varies by local.
              </p>
              <p style={{fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.7, fontStyle:"italic", marginBottom:24}}>
                The walkthrough below is the general shape of the process. Confirm specifics with the local that has jurisdiction over the work.
              </p>

              {/* Brand-new business callout */}
              <div style={{background:"rgba(245,197,24,0.06)", border:"1px solid rgba(245,197,24,0.2)", borderRadius:12, padding:"20px 24px", marginBottom:32}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#F5C518", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8}}>If you're starting from scratch</div>
                <p style={{fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0}}>
                  If the contractor is brand-new and not yet operating, they'll need to set up their <b>business structure</b> (LLC, S-corp, etc.) and required <b>business insurances</b> (general liability, workers' comp, vehicle, etc.) before any of the steps below.
                </p>
              </div>

              <h4 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"rgba(255,255,255,0.85)", letterSpacing:1.5, textTransform:"uppercase", margin:"32px 0 16px 0"}}>Already-established business</h4>

              {/* Step 1 — Letter of Assent */}
              <div style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, borderLeft:"4px solid #FA8059"}}>
                <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#FA805922", color:"#FA8059", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>01</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>Sign a Letter of Assent</div>
                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:16}}>A Letter of Assent legally binds the contractor to the Local Collective Bargaining Agreement (CBA). There are three types most locals offer:</div>
                  <div style={{display:"grid", gap:12}}>
                    <div style={{padding:"14px 18px", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", marginBottom:6}}>Letter of Assent A</div>
                      <div style={{fontSize:13.5, color:"rgba(255,255,255,0.8)", lineHeight:1.65}}>Binds the contractor to the Local CBA <b>and</b> authorizes NECA to represent the contractor in negotiations, grievances, and other labor matters.</div>
                    </div>
                    <div style={{padding:"14px 18px", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", marginBottom:6}}>Letter of Assent B</div>
                      <div style={{fontSize:13.5, color:"rgba(255,255,255,0.8)", lineHeight:1.65}}>Binds the contractor to the Local CBA but <b>not</b> to NECA — they bargain directly with the local. Often used as a pathway toward eventually signing a Letter of Assent A.</div>
                    </div>
                    <div style={{padding:"14px 18px", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", marginBottom:6}}>Letter of Assent C</div>
                      <div style={{fontSize:13.5, color:"rgba(255,255,255,0.8)", lineHeight:1.65}}>12-month Letter of Assent. The first 6 months are locked — the contractor cannot exit and must follow the CBA. Before the 12 months is up, they can opt out of being signatory or convert to a Letter of Assent A.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 — Bonding */}
              <div style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, borderLeft:"4px solid #FA8059"}}>
                <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#FA805922", color:"#FA8059", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>02</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>Post the required bonds</div>
                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:12}}>Each local has its own bonding requirements. A common pattern is two bonds:</div>
                  <ul style={{paddingLeft:20, color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:1.85, margin:0}}>
                    <li><b>Wage Bond</b> — ensures payment of members' weekly wages</li>
                    <li><b>Fringe Benefit Bond</b> — ensures payment of fringe benefits (health, pension, etc.) if the contractor is unable to meet its obligations</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 — Reporting of Benefits */}
              <div style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, borderLeft:"4px solid #FA8059"}}>
                <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#FA805922", color:"#FA8059", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>03</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>Set up benefit reporting</div>
                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>The contractor needs to be set up with the local to report fringe benefits on their employees. Most locals use a third-party administrator — contractors enter monthly hours worked per member and the system calculates the amount owed.</div>
                </div>
              </div>

              {/* Step 4 — Workforce Transition */}
              <div style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, borderLeft:"4px solid #FA8059"}}>
                <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#FA805922", color:"#FA8059", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>04</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>Workforce transition</div>
                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:12}}>Once the Letter of Assent is executed and bonding is in place, the newly signatory contractor may self-classify their existing workforce in coordination with the local. The local typically:</div>
                  <ul style={{paddingLeft:20, color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:1.85, margin:"0 0 12px 0"}}>
                    <li>Holds a meeting with the employees</li>
                    <li>Explains the benefits and expectations of union membership</li>
                    <li>Assists with onboarding into the union</li>
                  </ul>
                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>Any additional workforce needs beyond the existing employees are filled through the local's hiring hall.</div>
                </div>
              </div>

              {/* Step 5 — Make Lots of Money */}
              <div style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"linear-gradient(135deg, rgba(245,197,24,0.08), rgba(250,128,89,0.04))", border:"1px solid rgba(245,197,24,0.25)", borderRadius:12, borderLeft:"4px solid #F5C518"}}>
                <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#F5C51822", color:"#F5C518", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>05</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>Make lots of money 💰</div>
                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>Signatory contractors get access to skilled labor on demand, transferred benefits burden, eligibility for PLA and prevailing-wage work, and a level playing field with other signatories. The work follows.</div>
                </div>
              </div>`;

if (!code.includes(oldSection)) {
  if (code.includes('The process — step by step')) {
    console.log('Skipping — new section already present.');
  } else {
    console.error('ERROR: old "What the signing process actually looks like" block not found.');
    process.exit(1);
  }
} else {
  code = code.replace(oldSection, newSection);
  console.log('✓ Replaced abstract signing process with concrete generic process');
}

fs.writeFileSync(path, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: replace abstract signing process with concrete step-by-step (Letters of Assent A/B/C, bonding, reporting, workforce transition, make money)" && git push');
console.log('');
