// fix127.js
// Convert the standalone Organize nav button into a dropdown with two items:
//   - Workplace Organizing (existing /organize page)
//   - Organizing a Contractor (new /organize-contractor page)
//
// Steps:
//   1. Add organizeOpen state
//   2. Update existing dropdown handlers to mutually close organizeOpen
//   3. Replace standalone Organize button with a dropdown
//   4. Add 'organize-contractor' to validPages
//   5. Add 'organize-contractor' entry to PAGE_META
//   6. Insert the Organizing a Contractor page render block

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');
let changes = 0;

// ── 1. ADD organizeOpen STATE ────────────────────────────────────────────────
const stateAnchor = `  const [getInTouchOpen, setGetInTouchOpen] = useState(false);\n`;
const stateReplacement = `  const [getInTouchOpen, setGetInTouchOpen] = useState(false);\n  const [organizeOpen, setOrganizeOpen] = useState(false);\n`;
if (code.includes('organizeOpen, setOrganizeOpen')) {
  console.log('Skipping state insert — organizeOpen already declared.');
} else if (code.includes(stateAnchor)) {
  code = code.replace(stateAnchor, stateReplacement);
  console.log('✓ Added organizeOpen state');
  changes++;
} else {
  console.error('ERROR: getInTouchOpen state declaration not found.');
  process.exit(1);
}

// ── 2. UPDATE EXISTING DROPDOWN HANDLERS TO CLOSE organizeOpen ───────────────
const handlerUpdates = [
  {
    old: `                onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); }}`,
    new: `                onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); setOrganizeOpen(false); }}`,
    label: 'Apprentice',
  },
  {
    old: `                onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); }}`,
    new: `                onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); setOrganizeOpen(false); }}`,
    label: 'Benefits',
  },
  {
    old: `                onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); setGetInTouchOpen(false); }}`,
    new: `                onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); setGetInTouchOpen(false); setOrganizeOpen(false); }}`,
    label: 'History',
  },
  {
    old: `                onClick={() => { setGetInTouchOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); }}`,
    new: `                onClick={() => { setGetInTouchOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setOrganizeOpen(false); }}`,
    label: 'Get in Touch',
  },
];
for (const h of handlerUpdates) {
  if (code.includes(h.old)) {
    code = code.replace(h.old, h.new);
    console.log(`✓ Updated ${h.label} dropdown to close organizeOpen`);
    changes++;
  } else if (code.includes(h.new)) {
    console.log(`Skipping — ${h.label} handler already updated.`);
  } else {
    console.error(`ERROR: ${h.label} handler pattern not found.`);
    process.exit(1);
  }
}

// ── 3. REPLACE STANDALONE Organize BUTTON WITH DROPDOWN ──────────────────────
const oldOrganizeButton = `            <button className={\`nav-link \${page==="organize"?"active":""}\`} onClick={() => setPage("organize")}>{lang==="es" ? "Organizar" : lang==="pl" ? "Organizuj" : "Organize"}</button>`;

const newOrganizeDropdown =
`            {/* ORGANIZE DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="organize"||page==="organize-contractor")?" active":""}\${organizeOpen?" open":""}\`}
                onClick={() => { setOrganizeOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); }}
                onBlur={() => setTimeout(() => setOrganizeOpen(false), 150)}
              >
                {lang==="es" ? "Organizar" : lang==="pl" ? "Organizuj" : "Organize"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {organizeOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="organize"?" active":""}\`} onMouseDown={() => { setPage("organize"); setOrganizeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Organizar Tu Trabajo" : lang==="pl" ? "Organizuj Pracę" : "Workplace Organizing"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Cómo organizar tu lugar de trabajo" : lang==="pl" ? "Jak zorganizować swoje miejsce pracy" : "How to organize your job"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="organize-contractor"?" active":""}\`} onMouseDown={() => { setPage("organize-contractor"); setOrganizeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Que un contratista no sindical firme" : lang==="pl" ? "Pozyskanie wykonawcy do związku" : "Get a non-union contractor to sign"}</span>
                  </div>
                </div>
              )}
            </div>`;

if (code.includes(oldOrganizeButton)) {
  code = code.replace(oldOrganizeButton, newOrganizeDropdown);
  console.log('✓ Replaced Organize button with dropdown');
  changes++;
} else if (code.includes('ORGANIZE DROPDOWN')) {
  console.log('Skipping — Organize dropdown already in place.');
} else {
  console.error('ERROR: standalone Organize button pattern not found.');
  process.exit(1);
}

// ── 4. ADD 'organize-contractor' TO validPages ──────────────────────────────
const oldValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','retirement','benefits','about','contact','jobboard','wages','organize'];`;
const newValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
if (code.includes(oldValidPages)) {
  code = code.replace(oldValidPages, newValidPages);
  console.log('✓ Added organize-contractor to validPages');
  changes++;
} else if (code.includes("'organize-contractor'")) {
  console.log('Skipping — organize-contractor already in validPages.');
} else {
  console.error('ERROR: validPages array not found in expected form.');
  process.exit(1);
}

// ── 5. ADD organize-contractor TO PAGE_META ─────────────────────────────────
const oldMeta = `      organize:  { title: "Union Pathways — Organize Your Workplace", desc: "How to organize your workplace, your rights under federal labor law, and how union members can help organize others. Built for workers and members alike." },`;
const newMeta =
`      organize:  { title: "Union Pathways — Organize Your Workplace", desc: "How to organize your workplace, your rights under federal labor law, and how union members can help organize others. Built for workers and members alike." },
      'organize-contractor': { title: "Union Pathways — Organizing a Contractor", desc: "Top-down organizing in the construction trades. How non-union contractors come to sign with the union, why they would, and how members help bring them in." },`;
if (code.includes(oldMeta)) {
  code = code.replace(oldMeta, newMeta);
  console.log('✓ Added organize-contractor PAGE_META entry');
  changes++;
} else if (code.includes(`'organize-contractor': { title: "Union Pathways — Organizing a Contractor"`)) {
  console.log('Skipping — organize-contractor PAGE_META already present.');
} else {
  console.error('ERROR: organize PAGE_META anchor not found.');
  process.exit(1);
}

// ── 6. INSERT ORGANIZE-CONTRACTOR PAGE BEFORE PLATFORM OVERVIEW ─────────────
const insertAnchor = `        {/* PLATFORM OVERVIEW — show on home page when no results */}
        {page === "home" && !results && (`;

const contractorPage =
`        {page === "organize-contractor" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Organización de Arriba Hacia Abajo" : lang==="pl" ? "Organizowanie Odgórne" : "Top-Down Organizing"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Trayendo un Contratista "}<span className="accent">{"Al Sindicato."}</span></>
                : lang==="pl" ? <>{"Pozyskanie Wykonawcy "}<span className="accent">{"do Związku."}</span></>
                : <>{"Bringing a Contractor "}<span className="accent">{"Into the Union."}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "La mayoría de los trabajadores sindicales de la construcción se organizan cuando su empleador firma con el sindicato — no a través de elecciones individuales del NLRB. Así es como sucede."
                : lang==="pl" ? "Większość związkowych pracowników budowlanych jest organizowana, gdy ich pracodawca podpisuje umowę ze związkiem — a nie przez indywidualne wybory NLRB. Oto jak to się dzieje."
                : "Most union construction workers are organized when their employer signs with the union — not through individual NLRB elections. Construction has its own legal framework, and this page explains how it works."}
              </p>
            </div>

            <div style={{maxWidth:820, margin:"0 auto", padding:"40px 24px 0"}}>

              {/* WHY CONSTRUCTION IS DIFFERENT */}
              <div style={{background:"rgba(245,197,24,0.06)", border:"1px solid rgba(245,197,24,0.2)", borderRadius:12, padding:"24px 28px", marginBottom:32}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#F5C518", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>The Legal Framework</div>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>Section 8(f) — the construction exception</h3>
                <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:12}}>
                  Construction is the only industry where a contractor can sign a "pre-hire" agreement with a union — meaning they recognize the union as the bargaining representative <i>before</i> any specific group of workers votes. This is Section 8(f) of the National Labor Relations Act.
                </p>
                <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, margin:0}}>
                  In practice, this means a contractor signs a Letter of Assent with the local. Their workers become covered by the area's collective bargaining agreement (CBA). The union doesn't need to win a workplace election — the contractor simply chooses to be a signatory.
                </p>
              </div>

              {/* WHY A CONTRACTOR WOULD SIGN */}
              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"40px 0 16px 0"}}>Why a contractor would sign</h3>
              <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                Going union isn't a sacrifice for a contractor — it's a business decision. Here's what they actually get:
              </p>
              <div className="impact-grid" style={{marginTop:16}}>
                {[
                  {t:"Skilled Workforce on Demand", d:"Access to the local's hiring hall — apprentices, journeymen, foremen — without recruiting, screening, or training in-house."},
                  {t:"Benefits Burden Lifted", d:"Health insurance, pension, annuity all run through multiemployer plans. The contractor pays a per-hour fringe rate; the funds handle the rest."},
                  {t:"Bid on Union-Only Work", d:"Project Labor Agreements (PLAs), prevailing wage projects, public works, and many private projects are restricted to signatory contractors."},
                  {t:"Trained, Safer Workers", d:"Apprenticeship grads come in with thousands of hours of structured training and OSHA / safety credentials. Lower incident rates, lower insurance costs."},
                  {t:"Level Playing Field", d:"Every signatory contractor pays the same wages and fringes. Bids compete on management, productivity, and overhead — not on cutting corners on labor."},
                  {t:"No Recruiting Headaches", d:"In a tight construction labor market, the union pool is often the difference between staffing a job and turning it down."},
                ].map((s, i) => (
                  <div key={i} className="impact-card">
                    <div className="impact-title">{s.t}</div>
                    <div className="impact-desc">{s.d}</div>
                  </div>
                ))}
              </div>

              {/* HOW MEMBERS HELP */}
              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"48px 0 16px 0"}}>How members help bring contractors in</h3>
              <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                Most contractor organizing leads come from members — not paid staff. You're already on jobsites, talking to non-union crews and meeting non-union owners on bid walks. Here's where you fit in:
              </p>
              <div style={{marginTop:16}}>
                {[
                  {n:"01", t:"Spot the lead", d:"A non-union contractor with steady work, decent owners, and crews that look frustrated or thinly staffed is a good lead. So is a contractor about to bid on a PLA project they can't qualify for."},
                  {n:"02", t:"Have a conversation", d:"You don't pitch the contract — you build the relationship. Talk about your career, your apprenticeship, the hiring hall, what your benefits look like at retirement. Plant the seed."},
                  {n:"03", t:"Pass it to your organizer", d:"Once there's interest, hand it off to your local's organizer or business agent. They have the authority to negotiate the Letter of Assent and walk the contractor through the CBA."},
                  {n:"04", t:"Help with the transition", d:"If the contractor's existing workers come over, they'll need help understanding the hall, the books, dispatch rules, and benefit enrollment. Members make that transition real."},
                ].map((step, i) => (
                  <div key={i} style={{display:"flex", gap:20, marginBottom:16, padding:"24px 28px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, borderLeft:"4px solid #3B9EFF"}}>
                    <div style={{flexShrink:0, width:48, height:48, borderRadius:"50%", background:"#3B9EFF22", color:"#3B9EFF", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900}}>{step.n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", marginBottom:8}}>{step.t}</div>
                      <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* THE SIGNING PROCESS */}
              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"48px 0 16px 0"}}>What the signing process actually looks like</h3>
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
              </div>

              {/* PLAs */}
              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"48px 0 16px 0"}}>Project Labor Agreements (PLAs)</h3>
              <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:16}}>
                A Project Labor Agreement is a CBA that covers a single project — usually a large one. The owner (often a public agency or major private developer) requires every contractor and subcontractor on the job to sign on. This effectively organizes contractors temporarily, project-by-project, and is one of the biggest reasons non-union contractors decide to go signatory permanently — once they've worked under PLA terms, they often realize the model works for them.
              </p>

              {/* CTA */}
              <div style={{margin:"48px 0", padding:"32px 36px", background:"linear-gradient(135deg, rgba(59,158,255,0.1), rgba(245,197,24,0.05))", border:"1px solid rgba(59,158,255,0.25)", borderRadius:16}}>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>Have a contractor in mind?</h3>
                <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.7, marginBottom:20}}>
                  Pass the lead to your local's organizer or business agent. They have the authority and the relationships to take it from a sidewalk conversation to a signed Letter of Assent.
                </p>
                <button onClick={() => setPage("home")} style={{background:"#3B9EFF", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1, textTransform:"uppercase", padding:"14px 32px", border:"none", borderRadius:50, cursor:"pointer"}}>Find Your Local →</button>
              </div>

              {/* DISCLAIMER */}
              <div style={{padding:"20px 24px 80px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.7, marginBottom:80}}>
                <strong style={{color:"rgba(255,255,255,0.85)"}}>Note:</strong> This page describes how contractor organizing works in the U.S. construction industry under Section 8(f). CBAs vary by trade, local, and region — wage rates, fringe schedules, jurisdictional rules, and bridge provisions are specific to each agreement. For the actual numbers and terms in your area, contact the local with jurisdiction over the work. This is general information, not legal advice.
              </div>
            </div>
          </div>
        )}

        {/* PLATFORM OVERVIEW — show on home page when no results */}
        {page === "home" && !results && (`;

if (code.includes(insertAnchor) && !code.includes(`{page === "organize-contractor" && (`)) {
  code = code.replace(insertAnchor, contractorPage);
  console.log('✓ Inserted Organizing a Contractor page render block');
  changes++;
} else if (code.includes(`{page === "organize-contractor" && (`)) {
  console.log('Skipping — Organizing a Contractor page already in place.');
} else {
  console.error('ERROR: PLATFORM OVERVIEW anchor not found.');
  process.exit(1);
}

fs.writeFileSync(path, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Organizing a Contractor page under Organize dropdown" && git push');
console.log('');
