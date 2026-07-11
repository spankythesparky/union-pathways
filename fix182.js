// fix182.js — Add the IUPAT apprenticeship test page
//
// What this does:
//   1. Adds a new entry to the TRADES array on the Apprenticeship index page
//      so the IUPAT card appears alongside IBEW, UA, SMART, IUEC, etc.
//
//   2. Inserts a full new page route: page === "apprenticeship-iupat"
//      Uses the same Section/Card/Stat layout pattern as the existing
//      apprenticeship-* pages (UBC was the template).
//
//   3. Adds "apprenticeship-iupat" to the validPages whitelist (so direct
//      links work and don't bounce to home).
//
//   4. Adds a PAGE_META entry (browser title + meta description for sharing).
//
//   5. Adds the new page as an item in the Apprenticeship nav dropdown
//      (desktop) and the Apprenticeship section of the mobile drawer.
//
// Idempotency: detects 'page === "apprenticeship-iupat"' and exits cleanly.
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

// ----------------------------------------------------------------------------
// Idempotency
// ----------------------------------------------------------------------------
if (src.includes('apprenticeship-iupat')) {
  console.log('Already applied — IUPAT apprenticeship page is already in place.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 — Add IUPAT card to TRADES array on the Apprenticeship index
// ============================================================================
const tradesArrayOld = `            { key:'ubc', name:'UBC Carpenters', test:'Regional Council aptitude test', sections:'Math · Reading · Mechanical · Spatial', live:true, color:'#9D7C4A', sub:'11 trade specialties · 70-80% to pass · 500K+ members' },
          ];`;
const tradesArrayNew = `            { key:'ubc', name:'UBC Carpenters', test:'Regional Council aptitude test', sections:'Math · Reading · Mechanical · Spatial', live:true, color:'#9D7C4A', sub:'11 trade specialties · 70-80% to pass · 500K+ members' },
            { key:'iupat', name:'IUPAT Painters & Allied Trades', test:'District Council aptitude test (varies by region)', sections:'Math · Reading · Mechanical · Spatial · Color (painters)', live:true, color:'#ec4899', sub:'No national standard test · interview-weighted · 8 trades incl. glaziers, drywall, painters' },
          ];`;
if (!src.includes(tradesArrayOld)) {
  console.error('ERROR: could not find Apprenticeship index TRADES array anchor');
  process.exit(1);
}
src = src.replace(tradesArrayOld, tradesArrayNew);

// ============================================================================
// EDIT 2 — Insert the new page route immediately after apprenticeship-ubc
// ============================================================================
const PAGE_BLOCK = `
        {page === "apprenticeship-iupat" && (() => {
          const ACCENT = '#ec4899';
          const Section = ({ eyebrow, title, children }) => (
            <div style={{margin:'56px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:ACCENT, letterSpacing:2.5, textTransform:'uppercase', marginBottom:12}}>{eyebrow}</div>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(26px, 4vw, 38px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.1}}>{title}</h2>
              {children}
            </div>
          );
          const Card = ({ children }) => (
            <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'24px 28px', marginBottom:14}}>{children}</div>
          );
          const Stat = ({ v, l }) => (
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(34px, 4vw, 48px)', fontWeight:900, color:ACCENT, lineHeight:1, marginBottom:6}}>{v}</div>
              <div style={{fontSize:11, color:'rgba(255,255,255,0.6)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>{l}</div>
            </div>
          );
          return (
            <div id="apprenticeship-iupat-root">
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, '+ACCENT+', #F5C518)', transition:'width 0.1s'}} />
              </div>
              <div style={{padding:'24px 24px 0', maxWidth:900, margin:'0 auto'}}>
                <div onClick={() => setPage('apprenticeship')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Apprenticeship Tests
                </div>
              </div>
              <div style={{padding:'40px 24px 60px', maxWidth:900, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:18}}>IUPAT · Painters & Allied Trades</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 80px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>The IUPAT<br/><span style={{color:ACCENT}}>Apprenticeship Test.</span></h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.85)', lineHeight:1.55, maxWidth:680, margin:0}}>Unlike trades with one nationally standardized test (the IBEW's NJATC, the UA's GAN, or the IUEC's EIAT), IUPAT does not run a single unified aptitude exam. Each District Council and regional Finishing Trades Institute administers its own assessment — and the format varies meaningfully from one region to the next. The single most important step before testing: call the Finishing Trades Institute serving your District Council and ask what's on their test.</p>
              </div>

              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:20}}>
                  <Stat v="3 yr" l="Apprenticeship (Glazing 4)" />
                  <Stat v="144" l="Class Hours / Yr Minimum" />
                  <Stat v="8+" l="Trades Under IUPAT" />
                  <Stat v="$0" l="Tuition (Earn As You Learn)" />
                </div>
              </div>

              <div style={{maxWidth:900, margin:'0 auto', padding:'0 24px 80px'}}>

                <Section eyebrow="What IUPAT Is" title="The finishing trades, all under one union.">
                  <Card>
                    <p style={{margin:'0 0 12px 0', fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}>The International Union of Painters and Allied Trades represents workers across the finishing trades throughout the U.S. and Canada — including painters, drywall finishers, glaziers, floor coverers, sign and display workers, industrial painters, bridge painters, and other allied crafts.</p>
                    <p style={{margin:0, fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}>The training side runs through the <strong style={{color:'#fff'}}>International Finishing Trades Institute (iFTI)</strong>, a COE-accredited education arm that develops curriculum, oversees apprenticeships, and partners with regional Finishing Trades Institutes across North America.</p>
                  </Card>
                </Section>

                <Section eyebrow="The Trades Within IUPAT" title="Different craft, different test, different work.">
                  <Card>
                    <p style={{margin:'0 0 10px 0', fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}>IUPAT covers more crafts than most realize. Some District Councils tailor the entry test to the specific trade you're applying for:</p>
                    <ul style={{margin:'0', paddingLeft:24, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.85}}>
                      <li><strong style={{color:'#fff'}}>Commercial & Residential Painters</strong> — surface preparation, coatings, decorative finishes</li>
                      <li><strong style={{color:'#fff'}}>Industrial / Bridge Painters</strong> — protective coatings on infrastructure, lead-safe work</li>
                      <li><strong style={{color:'#fff'}}>Drywall Finishers</strong> — taping, mudding, texturing, level-of-finish standards</li>
                      <li><strong style={{color:'#fff'}}>Glaziers</strong> — cutting and installing glass, storefronts, curtain walls. <strong style={{color:ACCENT}}>The most technical IUPAT track.</strong></li>
                      <li><strong style={{color:'#fff'}}>Floor Coverers</strong> — carpet, resilient flooring, hardwood, specialty surfaces</li>
                      <li><strong style={{color:'#fff'}}>Wall Coverers</strong> — wallpaper, vinyl, decorative wall systems</li>
                      <li><strong style={{color:'#fff'}}>Sign & Display Workers</strong> — window lettering, neon, large-format signage</li>
                      <li><strong style={{color:'#fff'}}>Trade Show Workers</strong> — exhibit setup and dismantle</li>
                    </ul>
                    <p style={{margin:'14px 0 0 0', fontSize:14.5, color:'rgba(255,255,255,0.75)', lineHeight:1.65, fontStyle:'italic'}}>Painters and drywall finishers are by far the highest-volume entry points. Glazing has the longest training pipeline and the most technical entry assessment in many regions.</p>
                  </Card>
                </Section>

                <Section eyebrow="What's Actually On It" title="The sections that show up most often.">
                  <Card>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:8}}>Math / Trade Math</div>
                    <p style={{margin:0, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.65}}>The most consistent section across every IUPAT region. Whole numbers, fractions, decimals, percentages, ratio and proportion, basic algebra, measurement and unit conversion. Heavy emphasis on <strong style={{color:'#fff'}}>applied trade math</strong> — calculating wall area, paint coverage, drywall sheets needed. The math is applied, not abstract; word problems framed around real finishing-trades scenarios.</p>
                  </Card>
                  <Card>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:8}}>Reading Comprehension</div>
                    <p style={{margin:0, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.65}}>Almost universal across regions. Short technical passages with multiple-choice questions on main idea, detail, and following procedural steps. Reflects the reality of the job — every craft involves reading product data sheets, safety documentation, and blueprints. The IUPAT Ontario Drywall Finishers test explicitly stresses "math and communication skills."</p>
                  </Card>
                  <Card>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:8}}>Mechanical Comprehension <span style={{color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:400}}>(some regions)</span></div>
                    <p style={{margin:0, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.65}}>Tests intuition for tools, simple machines, levers, pulleys, and basic mechanical systems. Common in District Councils that emphasize glazing, industrial painting, or sign work. <strong style={{color:'#fff'}}>Bennett Mechanical Comprehension Test (BMCT)</strong> practice is the gold standard if your region tests this.</p>
                  </Card>
                  <Card>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:8}}>Spatial Reasoning <span style={{color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:400}}>(some regions)</span></div>
                    <p style={{margin:0, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.65}}>2D-to-3D visualization, mental rotation, matching orthographic views. Particularly relevant for glaziers (cutting glass to fit), sign workers, and drywall finishers (visualizing wall geometry).</p>
                  </Card>
                  <Card>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:8}}>Color Perception <span style={{color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:400}}>(painter-specific, some regions)</span></div>
                    <p style={{margin:0, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.65}}>A small but distinctive section for painter applicants. Identifying color matches, distinguishing close shades, and detecting color blindness. Some District Councils administer this as a separate Ishihara-style screening rather than as part of the main aptitude battery. <strong style={{color:ACCENT}}>If you have any history of color vision issues, ask your District Council whether this is part of their assessment before applying.</strong></p>
                  </Card>
                  <Card>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:8}}>Blueprint Reading <span style={{color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:400}}>(advanced regions)</span></div>
                    <p style={{margin:0, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.65}}>A few regions — particularly the <strong style={{color:'#fff'}}>Mid-Atlantic FTI</strong> — include basic blueprint reading on the entry test. More common as part of training than entry, but worth knowing if you're applying to glazing or industrial pathways.</p>
                  </Card>
                </Section>

                <Section eyebrow="Where Variation Hits Hardest" title="The same applicant can face very different processes by region.">
                  <Card>
                    <p style={{margin:'0 0 12px 0', fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}>Real published examples of how different IUPAT regions structure entry:</p>
                    <ul style={{margin:'0', paddingLeft:24, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.85}}>
                      <li><strong style={{color:'#fff'}}>Minnesota (FTIUM)</strong> — No aptitude test. Entry runs through an open house, contractor sponsorship, and a four-page application.</li>
                      <li><strong style={{color:'#fff'}}>Mid-Atlantic Region (FTI-MAR / DC 21)</strong> — Full aptitude assessment plus blueprint reading. COE-accredited and the first standalone building-trades apprenticeship to receive that status.</li>
                      <li><strong style={{color:'#fff'}}>Florida (FLFTI)</strong> — Application-driven entry with a contractor-sponsored pathway and an interview-weighted process.</li>
                      <li><strong style={{color:'#fff'}}>IUPAT Ontario</strong> — Aptitude test with <strong style={{color:ACCENT}}>unlimited retakes at four-month intervals</strong>, plus a $400 government registration fee.</li>
                      <li><strong style={{color:'#fff'}}>District Council 5 (Northwest)</strong> — Veterans with a DD-214 may apply directly at apprenticeship offices with priority intake.</li>
                    </ul>
                  </Card>
                </Section>

                <Section eyebrow="How They Score It" title="Test gets you on the list. Interview decides where you land.">
                  <Card>
                    <p style={{margin:'0 0 12px 0', fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}>Because the test isn't nationally standardized, scoring varies. Some regions use a pass/fail threshold combined with the interview score for ranking. Some use a cumulative point system (test + interview + work history + education). Some Canadian programs treat the test as a readiness gate with unlimited retakes rather than a competitive ranking.</p>
                    <p style={{margin:0, fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}>In nearly every U.S. District Council, <strong style={{color:ACCENT}}>the interview is weighted heavily.</strong> Test performance gets you onto the list. The interview, references, and any documented trade-relevant experience determine where on the list you land. Generic "I want to work with my hands" answers don't compete well — visit a Finishing Trades Institute open house, talk to current apprentices, and be ready to articulate which IUPAT trade you want and why.</p>
                  </Card>
                </Section>

                <Section eyebrow="How to Prep" title="Math fluency, applied to wall area and gallons of paint.">
                  <Card>
                    <ul style={{margin:'0', paddingLeft:24, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.85}}>
                      <li><strong style={{color:'#F5C518'}}>Khan Academy Pre-Algebra and Algebra 1.</strong> Covers the entire ceiling of what IUPAT tests in math.</li>
                      <li><strong style={{color:'#F5C518'}}>Practice applied trade math.</strong> Paint coverage problems, drywall square footage, gallon-per-area conversions. Solid grasp of fractions and area calculation goes further here than algebra fluency.</li>
                      <li><strong style={{color:'#F5C518'}}>Reading comprehension practice.</strong> Free practice sets from any apprenticeship test prep publisher. The skill is reading carefully under time pressure.</li>
                      <li><strong style={{color:'#F5C518'}}>Bennett Mechanical Comprehension Test prep</strong> if your region tests mechanical (especially glazing and industrial pathways).</li>
                      <li><strong style={{color:'#F5C518'}}>Take a free Ishihara color screening online before you apply</strong> if you've never been formally tested for color vision. Discovering an issue at the test is a much worse outcome than discovering it ahead of time. If color vision is an issue, pivot to a non-color-critical IUPAT trade like drywall finishing or glazing.</li>
                      <li><strong style={{color:'#F5C518'}}>Visit an FTI open house.</strong> IUPAT places exceptional weight on demonstrated interest in the trade. Talking to current apprentices and being able to name your specific track is the single biggest interview advantage.</li>
                    </ul>
                  </Card>
                </Section>

                <Section eyebrow="Application Requirements" title="The standards across most regions.">
                  <Card>
                    <ul style={{margin:'0', paddingLeft:24, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.85}}>
                      <li>Minimum age 18 (16 in some Canadian programs with parental consent)</li>
                      <li>High school diploma or GED — required almost universally</li>
                      <li>Legal right to work in the U.S. or Canada</li>
                      <li>Pre-employment drug screening</li>
                      <li>Valid driver's license — strongly preferred, often required (job sites are rarely transit-accessible)</li>
                      <li>Physical ability to perform the trade (climbing, lifting, working from heights for glaziers and industrial painters)</li>
                      <li>Application fee in some regions — typically modest ($190 documented at FTIUM in Minnesota; many regions have no fee or $25-50)</li>
                      <li>Canadian programs require a separate provincial registration fee (Ontario charges $400 to register as an apprentice)</li>
                    </ul>
                  </Card>
                </Section>

                <Section eyebrow="Things Nobody Tells You" title="The fine print that affects your life.">
                  <Card>
                    <p style={{margin:'0 0 12px 0', fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}><strong style={{color:'#F5C518'}}>The 144-hour rule.</strong> Every IUPAT apprentice completes a minimum of 144 hours of related classroom instruction per year, on top of on-the-job hours. This is mandated by the U.S. Department of Labor for the apprenticeship to remain registered. Plan your life around evening or block-release classes.</p>
                    <p style={{margin:'0 0 12px 0', fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}><strong style={{color:'#F5C518'}}>Apprenticeships are typically 3 years</strong>, shorter than many building trades. Glazing is the exception and runs 4 years in most regions, with some districts offering an Associate's degree (AST) at completion through articulation agreements with universities like Penn State, Rutgers, and Rowan.</p>
                    <p style={{margin:0, fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65}}><strong style={{color:'#F5C518'}}>Direct entry through contractor sponsorship is real.</strong> In several regions — Florida and Minnesota notably — the path in runs through getting hired by a signatory contractor first, then joining IUPAT and the apprenticeship. This bypasses the competitive-list model entirely. <strong style={{color:'#fff'}}>If you have a connection to a signatory shop, ask about this pathway before you apply cold.</strong></p>
                  </Card>
                </Section>

                <Section eyebrow="Pathways for Veterans, Youth, Pre-Apprentices" title="Several alternatives to a cold application.">
                  <Card>
                    <ul style={{margin:'0', paddingLeft:24, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.85}}>
                      <li><strong style={{color:'#fff'}}>PAT-VP</strong> (Painters and Allied Trades Veterans Program) — IUPAT's veteran transition program. Skills training, a transition plan, and a pathway from military service into IUPAT apprenticeship.</li>
                      <li><strong style={{color:'#fff'}}>Helmets to Hardhats</strong> — IUPAT participates in the building-trades-wide H2H program. Free placement service for transitioning service members, with credit for relevant military experience.</li>
                      <li><strong style={{color:'#fff'}}>IUPAT Job Corps</strong> — Operating since 1969, the longest-running Job Corps pre-apprenticeship program in the building trades. Available at over 59 programs in 32 states for ages 16-24. Students earn their GED if needed, learn basic trade skills, and graduate with direct apprenticeship eligibility.</li>
                    </ul>
                  </Card>
                </Section>

                <Section eyebrow="Quick Reference" title="The summary card.">
                  <Card>
                    <ul style={{margin:'0', paddingLeft:24, fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.85}}>
                      <li><strong style={{color:'#fff'}}>Union:</strong> IUPAT — International Union of Painters and Allied Trades</li>
                      <li><strong style={{color:'#fff'}}>Training body:</strong> iFTI (International Finishing Trades Institute), COE-accredited</li>
                      <li><strong style={{color:'#fff'}}>Test name:</strong> No nationally standardized name — each District Council administers its own version</li>
                      <li><strong style={{color:'#fff'}}>Typical sections:</strong> Math, reading comprehension, mechanical (some), spatial (some), color perception (painter-specific, some)</li>
                      <li><strong style={{color:'#fff'}}>Apprenticeship length:</strong> 3 years typical; 4 years for glazing and some industrial pathways</li>
                      <li><strong style={{color:'#fff'}}>Classroom hours:</strong> 144+ per year minimum (DOL mandated)</li>
                      <li><strong style={{color:'#fff'}}>Pre-apprenticeship options:</strong> Job Corps, PAT-VP, Helmets to Hardhats, contractor-sponsored direct entry</li>
                      <li><strong style={{color:ACCENT}}>The single most important prep step:</strong> Call your local Finishing Trades Institute before you apply. Regional variation is the defining feature of IUPAT entry.</li>
                    </ul>
                  </Card>
                </Section>

              </div>

              <div style={{padding:'40px 24px 80px', maxWidth:900, margin:'0 auto', textAlign:'center'}}>
                <button onClick={() => setPage('apprenticeship')} style={{background:'transparent', color:ACCENT, fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(236,72,153,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to All Trade Tests</button>
              </div>
            </div>
          );
        })()}
`;

const ubcEndAnchor = `        {page === "apprenticeship-ubc" && (() => {`;
const ubcEndAnchorClose = `        {page === "trade-history" && (() => {`;
// Find the trade-history opening (which is the next section after apprenticeship-ubc closes)
const tradeHistoryIdx = src.indexOf(ubcEndAnchorClose);
if (tradeHistoryIdx === -1) {
  console.error('ERROR: could not find trade-history anchor for IUPAT page insertion');
  process.exit(1);
}
src = src.slice(0, tradeHistoryIdx) + PAGE_BLOCK + '\n' + src.slice(tradeHistoryIdx);

// ============================================================================
// EDIT 3 — Add 'apprenticeship-iupat' to validPages whitelist
// ============================================================================
const validPagesOld = `'apprenticeship-iuoe','apprenticeship-ubc','weingarten']`;
const validPagesNew = `'apprenticeship-iuoe','apprenticeship-ubc','apprenticeship-iupat','weingarten']`;
if (!src.includes(validPagesOld)) {
  console.error('ERROR: could not find validPages whitelist anchor');
  process.exit(1);
}
src = src.replace(validPagesOld, validPagesNew);

// ============================================================================
// EDIT 4 — Add PAGE_META entry for the new page
// ============================================================================
const metaOld = `      'apprenticeship-ubc': { title: "UBC Carpenters Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the UBC Carpenters apprenticeship test, with detail on all 11 trade specialties — General Carpenter, Concrete Form Builder, Floor Coverer, Mill Cabinet, Millwright (the most technical), Pile Driver, Lathing, Drywall Finisher, Insulation Applicator, Bridge/Dock/Wharf Carpenter, Maintenance Carpenter." },`;
const metaNew = `      'apprenticeship-ubc': { title: "UBC Carpenters Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the UBC Carpenters apprenticeship test, with detail on all 11 trade specialties — General Carpenter, Concrete Form Builder, Floor Coverer, Mill Cabinet, Millwright (the most technical), Pile Driver, Lathing, Drywall Finisher, Insulation Applicator, Bridge/Dock/Wharf Carpenter, Maintenance Carpenter." },
      'apprenticeship-iupat': { title: "IUPAT Apprenticeship Test — Full Breakdown · Union Pathways", desc: "What's on the IUPAT apprenticeship test — math, reading, mechanical, spatial, and (for painters) color perception. Coverage of the 8+ trades under IUPAT including glaziers, drywall finishers, and industrial painters, plus the wide regional variation between District Councils. There's no single national IUPAT test — each region runs its own." },`;
if (!src.includes(metaOld)) {
  console.error('ERROR: could not find PAGE_META UBC anchor');
  process.exit(1);
}
src = src.replace(metaOld, metaNew);

// ============================================================================
// EDIT 5 — Add IUPAT to desktop Apprenticeship dropdown (between UBC and end)
// ============================================================================
// The desktop dropdown maps over an inline array. Insert IUPAT after UBC.
const desktopDropOld = `                    {key:'ubc',   page:'apprenticeship-ubc',   name:'UBC · Carpenters'},
                  ].map(t => (
                    <div key={t.key} onMouseDown={() => { setPage(t.page); setApprenticeshipOpen(false); }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`}>`;
const desktopDropNew = `                    {key:'ubc',   page:'apprenticeship-ubc',   name:'UBC · Carpenters'},
                    {key:'iupat', page:'apprenticeship-iupat', name:'IUPAT · Painters & Allied Trades'},
                  ].map(t => (
                    <div key={t.key} onMouseDown={() => { setPage(t.page); setApprenticeshipOpen(false); }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`}>`;
if (!src.includes(desktopDropOld)) {
  console.error('ERROR: could not find desktop Apprenticeship dropdown anchor');
  process.exit(1);
}
src = src.replace(desktopDropOld, desktopDropNew);

// ============================================================================
// EDIT 6 — Add IUPAT to mobile Apprenticeship drawer section
// ============================================================================
const mobileDrawerOld = `              <button className={\`mobile-drawer-link\${page==="apprenticeship-ubc" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-ubc"); setMobileNavOpen(false); }}>· UBC · Carpenters</button>
            </>)}
          </div>`;
const mobileDrawerNew = `              <button className={\`mobile-drawer-link\${page==="apprenticeship-ubc" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-ubc"); setMobileNavOpen(false); }}>· UBC · Carpenters</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-iupat" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-iupat"); setMobileNavOpen(false); }}>· IUPAT · Painters & Allied Trades</button>
            </>)}
          </div>`;
if (!src.includes(mobileDrawerOld)) {
  console.error('ERROR: could not find mobile drawer Apprenticeship anchor');
  process.exit(1);
}
src = src.replace(mobileDrawerOld, mobileDrawerNew);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - Added IUPAT card to apprenticeship index TRADES array');
console.log('  - Inserted full apprenticeship-iupat page (after apprenticeship-ubc)');
console.log('  - Added apprenticeship-iupat to validPages whitelist');
console.log('  - Added PAGE_META entry');
console.log('  - Added IUPAT to desktop Apprenticeship dropdown');
console.log('  - Added IUPAT to mobile drawer Apprenticeship section');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add IUPAT apprenticeship test page" && git push');
console.log('');
