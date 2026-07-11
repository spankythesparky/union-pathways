// fix144.js
// Add the Insulators (International Association of Heat and Frost Insulators
// and Allied Workers — AWIU) deep-dive history page, matching the established
// pattern (IBEW, UA, SMART, BAC, UFCW, Iron Workers).
//
//   - Steam-pipe copper (#A8623A) primary accent — distinct from BAC's
//     brick red and Iron Workers' burnt orange; fits the steam/pipe heritage
//   - Stable AnimatedNumber via window-level cache (matches fix143 behavior
//     so the headline stats stay locked after first animation)
//   - 9 Era sections covering 1880s pre-union through 2026
//   - Hero stats, breadcrumb, scroll progress bar, prerender og tags
//
// Notes on the history that shaped framing choices:
//   - The asbestos era is handled honestly — Insulators' own union-supported
//     research (Selikoff studies at Mount Sinai) helped produce the medical
//     consensus that ended their members' lives. That's the most important
//     story the union has, so it gets its own Era + a pull quote.
//   - The 1990s name change (from "Asbestos Workers" to "Allied Workers") is
//     framed as the institutional move it was, not glossed over.

const fs = require('fs');
const appPath = 'src/App.jsx';
const prerenderPath = 'scripts/generate-og-pages.mjs';
let code = fs.readFileSync(appPath, 'utf8');

let changes = 0;

// ── 1. ADD 'history-insul' TO validPages ────────────────────────────────────
const oldValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','history-bac','history-ufcw','history-iron','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
const newValidPages = `    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','history-smart','history-bac','history-ufcw','history-iron','history-insul','retirement','benefits','about','contact','jobboard','wages','organize','organize-contractor'];`;
if (code.includes(oldValidPages)) {
  code = code.replace(oldValidPages, newValidPages);
  console.log("✓ Added 'history-insul' to validPages");
  changes++;
} else if (code.includes("'history-insul'")) {
  console.log("Skipping — 'history-insul' already in validPages.");
} else {
  console.error('ERROR: validPages array not found in expected form.');
  process.exit(1);
}

// ── 2. ADD 'history-insul' TO PAGE_META ─────────────────────────────────────
const oldMeta = `      'history-iron': { title: "Iron Workers History — Cowboys in the Sky · Union Pathways", desc: "The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding, through the McNamara bombings, the Golden Gate Bridge, the 2002 Jake West scandal, the bottom-up organizing model under Eric Dean, and the 2026 transition to General President Kevin Bryenton." },`;
const newMeta =
`      'history-iron': { title: "Iron Workers History — Cowboys in the Sky · Union Pathways", desc: "The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding, through the McNamara bombings, the Golden Gate Bridge, the 2002 Jake West scandal, the bottom-up organizing model under Eric Dean, and the 2026 transition to General President Kevin Bryenton." },
      'history-insul': { title: "Insulators History — Wrapping the Pipes · Union Pathways", desc: "The full history of the International Association of Heat and Frost Insulators and Allied Workers (AWIU) — from the 1903 St. Louis founding, through World War II Pearl Harbor reconstruction, the Selikoff asbestos studies at Mount Sinai, the 1990s name change from Asbestos Workers, and the modern push for the Federal Mechanical Insulation Act." },`;
if (code.includes(oldMeta)) {
  code = code.replace(oldMeta, newMeta);
  console.log("✓ Added 'history-insul' PAGE_META entry");
  changes++;
} else if (code.includes("'history-insul': { title:")) {
  console.log("Skipping — 'history-insul' PAGE_META already present.");
} else {
  console.error('ERROR: history-iron PAGE_META anchor not found.');
  process.exit(1);
}

// ── 3. UPDATE APP-LEVEL scrollProgress HOOK ─────────────────────────────────
const oldCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','ufcw-history-root','iron-history-root','benefits-root'];`;
const newCandidates = `      const candidates = ['history-root','ibew-history-root','ua-history-root','smart-history-root','bac-history-root','ufcw-history-root','iron-history-root','insul-history-root','benefits-root'];`;
if (code.includes(oldCandidates)) {
  code = code.replace(oldCandidates, newCandidates);
  console.log("✓ Added 'insul-history-root' to scrollProgress candidates");
  changes++;
} else if (code.includes('insul-history-root')) {
  console.log("Skipping — scrollProgress already includes insul-history-root.");
} else {
  console.error('ERROR: scrollProgress candidates list not found.');
  process.exit(1);
}

// ── 4. PROMOTE INSULATORS DROPDOWN ENTRY TO LIVE ────────────────────────────
const oldDropdownEntry = `                    {key:'HFIAW', name:'HFIAW — Insulators'},`;
const newDropdownEntry = `                    {key:'HFIAW', name:'AWIU — Heat & Frost Insulators', page:'history-insul', live:true},`;
if (code.includes(oldDropdownEntry)) {
  code = code.replace(oldDropdownEntry, newDropdownEntry);
  console.log('✓ Promoted Insulators dropdown entry to live (history-insul)');
  changes++;
} else if (code.includes("page:'history-insul'")) {
  console.log('Skipping — Insulators dropdown entry already promoted.');
} else {
  console.error('ERROR: Insulators dropdown entry not found in expected form.');
  process.exit(1);
}

// ── 5. INSERT THE FULL INSULATORS PAGE BEFORE trade-history FALLBACK ────────
const insertAnchor = `        {page === "trade-history" && (`;

const insulPage =
`        {page === "history-insul" && (() => {
          // window-level cache so headline stats stay locked after first animation
          if (typeof window !== 'undefined' && !window.__insulStatCache) window.__insulStatCache = {};
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const cacheKey = 'insul:' + prefix + ':' + value + ':' + suffix + ':' + decimals;
            const cached = typeof window !== 'undefined' && window.__insulStatCache && window.__insulStatCache[cacheKey];
            const [shown, setShown] = useState(cached ? value : 0);
            const ref = useRef(null);
            const animated = useRef(!!cached);
            useEffect(() => {
              if (animated.current) return;
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
                      if (t < 1) {
                        requestAnimationFrame(step);
                      } else {
                        if (typeof window !== 'undefined' && window.__insulStatCache) window.__insulStatCache[cacheKey] = true;
                      }
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: 0.3 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };

          const ExpandableCard = ({ year, title, summary, body, accent = '#A8623A' }) => {
            const [open, setOpen] = useState(false);
            return (
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:'4px solid '+accent}}>
                <div onClick={() => setOpen(o => !o)} style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>{title}</div>
                    <div style={{fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6}}>{summary}</div>
                  </div>
                  <div style={{flexShrink:0, width:32, height:32, borderRadius:'50%', background:accent+'22', color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s'}}>+</div>
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
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#A8623A', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#A8623A', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:48, height:48, borderRadius:12, background:color+'22', border:'2px solid '+color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                </div>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );

          return (
            <div id="insul-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #A8623A, #F5C518)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#A8623A'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#A8623A', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The International Association of Heat and Frost Insulators and Allied Workers</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Wrapping<br/><span style={{color:'#A8623A'}}>The Pipes.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Behind walls and above ceilings, since 1903.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:720, margin:'0 auto'}}>
                  The work is not glamorous. While ironworkers walk high steel and electricians wire skyscrapers, mechanical insulators wrap pipes — pipes carrying steam, hot water, chilled water, refrigerants, and process fluids through the boiler rooms and mechanical penthouses that keep modern buildings running. The work happens largely out of sight. Without it, modern buildings simply do not function.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={30} label="Active members" suffix="K" />
                  <StatBlock value={122} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={4} label="Year apprenticeship" suffix="-yr" />
                  <StatBlock value={1903} label="Year of founding" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="1880s – 1903" title="The Pre-Union World — Pipe Coverers" intro="The trade of pipe covering — the original term for what would eventually become mechanical insulation — emerged in the late nineteenth century alongside the broader industrialization of American steam systems.">
                  <ExpandableCard
                    year="1870s – 1880s"
                    title="Why Insulation Wasn't Optional"
                    summary="Steam pipes carried fluids at temperatures and pressures that, if not insulated, would scald workers, lose enormous amounts of energy, and create constant fire hazards."
                    body="Through the 1870s and 1880s, urban buildings, factories, ships, and railroads increasingly relied on steam for heating, mechanical power, and industrial processes. Steam pipes carried fluids at temperatures and pressures that, if not insulated, would scald workers, lose enormous amounts of energy, condense and corrode adjacent materials, and create constant fire hazards in the buildings they ran through. Insulation was not optional; it was a structural necessity for any large-scale steam system."
                  />
                  <ExpandableCard
                    year="1880s onward"
                    title="The Asbestos Era Begins"
                    summary="The dominant insulating material was asbestos. Pipe coverers handled it with their bare hands and breathed its dust without respiratory protection."
                    body="The materials available to the pipe coverers of the late nineteenth century were limited and, in many cases, dangerous. Asbestos — chrysotile and amphibole minerals that could be woven into cloth, mixed with binders, and shaped around piping — was the dominant insulating material because it combined excellent thermal performance with fire resistance and mechanical durability that no other material could match. Other materials included magnesia, mineral wool, cork, hair felt, and various proprietary compounds, but asbestos was the workhorse of the industry from the 1880s onward. Pipe coverers handled it with their bare hands, breathed its dust without respiratory protection, and built careers on a material whose long-term health consequences would not be widely understood for another seventy years."
                  />
                  <ExpandableCard
                    year="late 1890s"
                    title="The First Local Unions"
                    summary="St. Louis, Chicago, New York, Boston, Philadelphia, Pittsburgh — the cities with the most steam-heating infrastructure organized first."
                    body="By the late 1890s, pipe coverers in major American cities had begun forming local unions to defend wage rates and working conditions. The trade was particularly concentrated in cities with extensive steam-heating infrastructure and major industrial economies — St. Louis, Chicago, New York, Boston, Philadelphia, and Pittsburgh. These local unions operated independently, each with its own wage scales, work rules, and apprenticeship traditions. The men who did the work were largely invisible to the general public, working in basements and mechanical rooms while other building trades took the public credit for major projects."
                  />
                </Era>

                {/* PART II */}
                <Era tag="II" years="July 1903" title="St. Louis, A. J. Kennedy, and the Founding" intro="In 1903, Pipe Coverers Local No. 1 in St. Louis sent out an invitation to other locals across the country, calling for a national convention. The founding convention of the Insulators met on July 7, 1903.">
                  <ExpandableCard
                    year="July 7, 1903"
                    title="Kennedy of Chicago, $1.00 a Member"
                    summary="A. J. Kennedy of Chicago was elected the new union's first General President. To pay for the convention, each local was assessed $1.00 per member."
                    body="The locals that responded to St. Louis Local No. 1's invitation drafted a constitution, adopted by-laws, and elected A. J. Kennedy of Chicago as the new union's first General President. To pay for the convention, each local was assessed $1.00 per member — a modest but pointed reminder of the small scale of the trade and the need for institutional self-support. The following year, the union adopted a formal name: the National Association of Heat, Frost and General Insulators and Asbestos Workers of America. On September 22, 1904, the American Federation of Labor issued an official charter."
                  />
                  <ExpandableCard
                    year="October 31, 1910"
                    title="The Gompers Charter"
                    summary="AFL President Samuel Gompers signed the formal charter of affiliation, recognizing the Insulators with jurisdiction across both the United States and Canada."
                    body="AFL President Samuel Gompers signed the charter of affiliation for the international union on October 31, 1910, formally recognizing the Insulators as a member of the AFL with jurisdiction across both the United States and Canada. The early decades of the union's history were characterized by slow but steady institutional development — driven by the construction of steam-heated commercial buildings, the expansion of industrial steam systems in factories and refineries, the build-out of urban district heating networks, and the steam-powered economy that defined American industry through the early twentieth century."
                  />
                  <ExpandableCard
                    year="1912 – 1954"
                    title="Mullaney's 42 Years"
                    summary="Joseph A. Mullaney's tenure took the union through both World Wars, the Great Depression, the New Deal, and the early postwar construction boom."
                    body="A. J. Kennedy served as General President from 1903 until August 6, 1912, when he was succeeded by Joseph A. Mullaney. Mullaney's tenure would prove to be one of the longest in the history of any North American building trades union — he served as General President from 1912 until December 25, 1954, a span of more than 42 years that took the union through both World Wars, the Great Depression, the New Deal, and the early postwar construction boom."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1914 – 1938" title="World War I, the Open Shop, and the New Deal" intro="Like every American building trades union, the Insulators experienced significant growth during World War I — and significant losses through the open-shop 1920s. The 1930s reversed the trajectory.">
                  <ExpandableCard
                    year="1914 – 1920"
                    title="Wartime Growth"
                    summary="Federal industrial demand for shipyards, munitions plants, and military bases drove sustained mechanical insulation work."
                    body="Federal industrial demand for shipyards, munitions plants, military bases, and expanded heavy industry drove sustained demand for mechanical insulation work, and the labor-friendly policies of the Wilson administration's wartime mediation boards gave the union temporary leverage in markets where employer resistance had been strong. By 1920, Insulators membership had grown substantially from its modest 1903 founding, with locals established across the United States and into Canada."
                  />
                  <ExpandableCard
                    year="1920s"
                    title="The American Plan and the Small-Union Vulnerability"
                    summary="As a small union without the political clout of the larger trades, the Insulators were particularly exposed to the open-shop counteroffensive."
                    body="The 1920s reversed many of these gains. The postwar Red Scare, the employers' 'American Plan' open-shop campaign, and the broader political environment of the decade put sustained pressure on every building trade. The Insulators, as a small union without the political clout of the larger building trades, were particularly vulnerable. Mechanical insulation work was increasingly performed by non-union pipe coverers in many regions, and the union's market share in industrial work — refineries, steel mills, and major manufacturing — was eroded substantially."
                  />
                  <ExpandableCard
                    year="1932 – 1935"
                    title="Norris-LaGuardia, the NIRA, and the Wagner Act"
                    summary="The legal foundation of modern collective bargaining was put in place in three years."
                    body="The 1930s reversed the trajectory. The Norris-LaGuardia Act of 1932, the National Industrial Recovery Act of 1933, and the Wagner Act of 1935 fundamentally restructured the legal environment in which all building trades operated. For the first time, mechanical insulators had federally enforceable rights to organize and bargain collectively, with the National Labor Relations Board as enforcement."
                  />
                  <ExpandableCard
                    year="1938"
                    title="BCTD Affiliation"
                    summary="The Insulators became formally affiliated with the Building and Construction Trades Department of the AFL, anchoring the union within the broader building trades structure."
                    body="In 1938, the Insulators became formally affiliated with the Building and Construction Trades Department of the AFL, anchoring the union's institutional position within the broader building trades structure. The BCTD affiliation gave the Insulators access to the political, legislative, and bargaining infrastructure of the larger building trades coalition, and over the following decades, the Insulators would benefit substantially from that integration even as the union itself remained one of the smaller members of the building trades family."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="1941 – 1960s" title="World War II, Pearl Harbor, and the Postwar Pinnacle" intro="World War II transformed the Insulators' work. The single most consequential war work for the union was the reconstruction of the U.S. Pacific Fleet after the December 7, 1941 attack on Pearl Harbor.">
                  <ExpandableCard
                    year="1941 – 1945"
                    title="Reconstructing the Pacific Fleet"
                    summary="Asbestos workers played a crucial role in repairing and rebuilding all but one of the major U.S. Navy vessels sunk or damaged at Pearl Harbor."
                    body="The federal government's massive industrial mobilization — for shipbuilding, naval reconstruction, military bases, defense manufacturing, and the broader war economy — required vast amounts of mechanical insulation work, much of which was performed under expedited federal contracts that operated under prevailing-wage requirements and gave the union substantial bargaining leverage. The single most consequential war work for the Insulators was the reconstruction of the U.S. Pacific Fleet after the December 7, 1941 attack on Pearl Harbor. Asbestos workers played a crucial role in repairing and rebuilding all but one of the major U.S. Navy vessels sunk or damaged in the attack, returning much of the fleet to service in the months and years following the disaster."
                  />
                  <ExpandableCard
                    year="postwar"
                    title="Peak Membership: Just Over 23,000"
                    summary="A modest figure compared to the larger building trades, but substantial relative to the 1903 founding."
                    body="The wartime expansion continued into the postwar economy. The construction of military and civilian nuclear facilities, the expansion of American refining and petrochemical capacity, the build-out of the interstate highway system's industrial economy, the cold-war defense industrial base, and the construction of the major commercial and institutional buildings of the postwar era all drove sustained demand for mechanical insulation. By the early postwar period, Insulators membership had reached a pinnacle of just over 23,000 — a modest figure compared to the larger building trades but substantial relative to the union's 1903 founding."
                  />
                  <ExpandableCard
                    year="postwar"
                    title="The 1,600 / 144 Apprenticeship"
                    summary="A four-year program — 1,600 hours per year of on-the-job training plus 144 hours per year of classroom instruction — standardized across most U.S. and Canadian locals."
                    body="The institutional infrastructure of the modern union was built during this period. The Insulators' apprenticeship program — a four-year structure combining 1,600 hours per year of on-the-job training with 144 hours per year of classroom instruction — was standardized across most U.S. and Canadian locals. Joint labor-management programs were established with the major mechanical insulation contractor associations. Pension and welfare funds were built out into multi-employer programs. And the union's unusual specialization — the fact that mechanical insulation was a small enough craft that essentially all skilled work in the field was performed by Insulators members — gave it structural advantages that larger, more contested building trades could not match."
                  />
                </Era>

                <PullQuote attribution="The defining institutional fact of the twentieth century">
                  Members who had spent careers handling raw asbestos with their bare hands began dying in numbers that no other building trade had to confront in the same way.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="1960s – 1990s" title="The Asbestos Crisis" intro="The defining institutional fact of the Insulators' twentieth century was asbestos. By the 1960s, the medical evidence linking asbestos exposure to mesothelioma, lung cancer, and asbestosis had become overwhelming, and the men and women who had spent careers handling raw asbestos with their bare hands began dying in numbers that no other building trade had to confront in the same way.">
                  <ExpandableCard
                    year="early 1960s"
                    title="The Selikoff Studies at Mount Sinai"
                    summary="Studies conducted by Dr. Irving Selikoff at Mount Sinai Hospital in NYC produced some of the most damaging epidemiological evidence ever assembled against the asbestos industry."
                    body="The Insulators were, in some respects, the canary in the coal mine for the broader American asbestos crisis. Studies of the union's membership conducted by Dr. Irving Selikoff at Mount Sinai Hospital in New York beginning in the early 1960s produced some of the most damaging epidemiological evidence ever assembled against the asbestos industry. Selikoff's research documented that insulators had mesothelioma death rates many times higher than the general population, that the latency period between exposure and disease could be 20 to 40 years, and that even brief exposure could produce fatal disease decades later."
                  />
                  <ExpandableCard
                    year="1970s – 1980s"
                    title="The Institutional Reckoning"
                    summary="The Insulators became one of the most vocal labor organizations in North America advocating for asbestos regulation, supporting medical research, and pursuing litigation against manufacturers."
                    body="The union's institutional response over the following two decades reshaped its public posture and ultimately its identity. The Insulators became one of the most vocal labor organizations in North America advocating for asbestos regulation, supporting medical research on asbestos-related disease, and pursuing litigation against the asbestos manufacturers who had concealed the health hazards from the workers who handled the material. By the 1980s, after years of industry and government denials, the link between asbestos and disease had been formally accepted by the medical community worldwide — a recognition that the Insulators' own union-supported research had played a substantial role in producing."
                  />
                  <ExpandableCard
                    year="1980s – 1990s"
                    title="100,000 Plaintiffs and Industry Bankruptcies"
                    summary="The asbestos litigation that followed eventually involved more than 100,000 plaintiffs and produced the bankruptcy of essentially every major asbestos manufacturer in the United States."
                    body="The cost was profound. Thousands of Insulators members and former members died from asbestos-related diseases through the late twentieth century. The asbestos litigation that followed — eventually involving more than 100,000 plaintiffs and producing the bankruptcy of essentially every major asbestos manufacturer in the United States — provided some financial compensation for affected workers and their families, but no settlement could replace the lives lost. The Insulators' institutional memory of this period continues to shape the union's emphasis on industrial safety, occupational health protections, and member assistance programs to the present day."
                  />
                  <ExpandableCard
                    year="1990s"
                    title="The Name Change"
                    summary="From 'Asbestos Workers' to 'Allied Workers' — a deliberate institutional move away from the asbestos identity that had defined the trade for nearly a century."
                    body="The union's name itself eventually reflected the transition. In the 1990s, the organization formally changed its name from the International Association of Heat and Frost Insulators and Asbestos Workers to the International Association of Heat and Frost Insulators and Allied Workers — a deliberate institutional move away from the asbestos identity that had defined the trade for nearly a century, even as the work of asbestos abatement remained a substantial portion of the union's contemporary work."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="1980s – 2000s" title="The Open-Shop Era" intro="The pressures that battered every American building trade through the late twentieth century affected the Insulators substantially. The union's particular structural challenge was the small scale of the trade itself — even modest non-union penetration represented a significant portion of total industry employment.">
                  <ExpandableCard
                    year="1981 onward"
                    title="PATCO, Right-to-Work, and the ABC"
                    summary="The political environment shifted decisively against organized construction labor."
                    body="The 1981 PATCO strike, the spread of state right-to-work laws, the open-shop counteroffensive organized through the Associated Builders and Contractors and the broader employer community, and the long deindustrialization of large parts of the American economy all eroded the union's market position. Through the 1980s and 1990s, non-union mechanical insulation work expanded substantially in residential, light commercial, and some industrial markets, particularly in regions of the South and Mountain West where right-to-work laws had taken hold."
                  />
                  <ExpandableCard
                    year="1989 – 2015"
                    title="Bernard, Then Grogan"
                    summary="William G. Bernard (1989–2001) oversaw substantial reorganization. James A. Grogan (2001–2015) positioned the union for energy-efficiency and green-building trends."
                    body="Insulators leadership during this period was anchored by William G. Bernard (1989–2001), who succeeded Andrew Haas and oversaw substantial institutional reorganization, and James A. Grogan (2001–2015), whose 14-year tenure positioned the union to capitalize on the energy-efficiency and green-building trends that would emerge as defining themes of the early twenty-first century."
                  />
                  <ExpandableCard
                    year="1990s – 2000s"
                    title="The Two-Pronged Response"
                    summary="Sustained investment in apprenticeship + aggressive promotion of mechanical insulation as core energy-efficiency technology."
                    body="The union's institutional response to the open-shop era emphasized two things. First, sustained investment in apprenticeship and training as the foundation of bargaining power, on the theory that the technical demands of complex industrial mechanical insulation work — particularly in nuclear, refining, and chemical processing facilities — required a level of skill that non-union contractors could not consistently match. Second, aggressive promotion of mechanical insulation as a core energy-efficiency technology, arguing that properly specified and installed insulation produced substantial reductions in industrial and commercial energy consumption that were undervalued in the broader sustainability conversation."
                  />
                </Era>

                {/* PART VII */}
                <Era tag="VII" years="2015 – 2020" title="The McCourt Era — Mechanical Insulation as Energy Policy" intro="James P. McCourt, a second-generation pipe coverer who had begun his career with Asbestos Workers Local 6 in Boston in 1976 and earned his mechanic's card in 1980, was elected General President in 2015. His six-year tenure was defined by the union's most aggressive institutional effort to date to position mechanical insulation as a central technology in the broader American energy-efficiency conversation.">
                  <ExpandableCard
                    year="2015 onward"
                    title="The Hidden Energy Savings Argument"
                    summary="The Insulators argued that mechanical insulation was systematically undervalued in federal and state energy policy because it operated invisibly, behind walls and inside mechanical rooms."
                    body="The strategic logic was clear. Mechanical insulation, properly specified and installed, produces some of the most cost-effective energy savings of any industrial efficiency measure. Industrial facilities, refineries, manufacturing plants, hospitals, universities, and government buildings can substantially reduce their energy consumption — and their carbon emissions — by upgrading existing mechanical insulation, performing energy audits to identify insulation degradation, and ensuring that new construction incorporates appropriate insulation specifications. The Insulators argued, with substantial supporting evidence, that mechanical insulation was systematically undervalued in federal and state energy policy because it operated invisibly, behind walls and inside mechanical rooms, where its impact was difficult to measure and easy to overlook."
                  />
                  <ExpandableCard
                    year="2015 – 2020"
                    title="The LMCT and Federal Engagement"
                    summary="The Mechanical Insulators Labor Management Cooperative Trust became a more visible institutional voice in federal and state energy policy."
                    body="Under McCourt's leadership, the union expanded its political and legislative work substantially. The Mechanical Insulators Labor Management Cooperative Trust (LMCT), the joint labor-management body of the Insulators and their signatory contractors, became a more visible institutional voice in federal and state energy policy. The Federal Mechanical Insulation Act, first introduced in various forms beginning in the 2010s, became a sustained legislative priority. And the union's emphasis on the connection between mechanical insulation, energy efficiency, and emissions reductions positioned it for the broader federal industrial-policy investments that would emerge in 2021 and 2022. McCourt was succeeded by Gregory T. Revard in September 2020, who served briefly until August 2022."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="August 2022 – 2024" title="The Larkin Era — Reform and Reform Again" intro="Terrence M. 'Terry' Larkin became General President of the Insulators at the union's 28th General Convention in August 2022. Larkin, a member of Insulators Local 2 in Pittsburgh for more than 50 years, had begun his career as a permit helper for Local 2 in 1973 before being accepted as an apprentice. The 2022 delegation had pushed for institutional reform, and Larkin's ascension to the presidency reflected that mandate.">
                  <ExpandableCard
                    year="2022 onward"
                    title="Federal Energy Policy as Strategic Anchor"
                    summary="Larkin's administration prioritized expanding the Insulators' institutional presence in federal energy and infrastructure policy."
                    body="Larkin's administration's strategic priorities have focused on three things. First, expanding the Insulators' institutional presence in federal energy and infrastructure policy. The Federal Mechanical Insulation Act of 2025, House Resolution 3474, was introduced bipartisan in the U.S. House on May 16, 2025, by Representative Randy Weber (R-Texas) and Representative Linda Sánchez (D-California). The bill, which built on similar legislation in 2022 and earlier years, would advance federal energy efficiency by adding mechanical insulation audit requirements to the approximately 350,000 federal buildings in the United States. State-level legislation has tracked the federal effort, with Illinois introducing mechanical insulation energy audit bills (S.B. 2049 and H.B. 2485) in 2024."
                  />
                  <ExpandableCard
                    year="2022 onward"
                    title="IMAP and Member Health"
                    summary="The Insulators Membership Assistance Program — confidential support staffed by clinicians who specialize in working with construction tradespeople."
                    body="Second, expanding the union's emphasis on member health and well-being. The Insulators Membership Assistance Program (IMAP), a confidential support and referral service staffed by licensed clinicians who specialize in working with construction tradespeople, has continued to expand its mental health initiatives. The union's particular institutional history with asbestos-related disease and the broader occupational health challenges of construction work have made member health a defining priority of Larkin's administration."
                  />
                  <ExpandableCard
                    year="2021 – 2024"
                    title="BIL, CHIPS, and IRA Leverage"
                    summary="CHIPS-funded semiconductor work was particularly important — fabs require extensive specialized mechanical insulation for high-purity gas, process-fluid, and HVAC systems."
                    body="Third, leveraging federal infrastructure and industrial-policy legislation to capture work for Insulators members. The Bipartisan Infrastructure Law, the CHIPS and Science Act, and the Inflation Reduction Act all funded substantial work that required mechanical insulation — semiconductor fabrication facilities, hydrogen production projects, lead-service-line replacement, transmission infrastructure, and the broader build-out of clean-energy production. CHIPS-funded semiconductor work has been particularly important for the Insulators, as semiconductor fabs require extensive specialized mechanical insulation for their high-purity gas, process-fluid, and HVAC systems."
                  />
                </Era>

                {/* PART IX */}
                <Era tag="IX" years="2025 – 2026" title="Where Insulators Stand Now" intro="The 2024–2026 period brought a complex mix of strong work pipeline and difficult political environment, similar to the dynamics affecting most other building trades unions.">
                  <ExpandableCard
                    year="2025"
                    title="The Federal Policy Reversal"
                    summary="The 2025 reconciliation bill curtailed clean-energy tax credits. The June 2025 OMB guidance weakened PLA preferences."
                    body="The 2025 federal policy reversal cut against several of the Insulators' strategic priorities. The 2025 reconciliation bill curtailed several of the clean-energy tax credits and infrastructure programs that had been driving Insulators employment in clean-energy and industrial markets. The administration's June 2025 Office of Management and Budget guidance making project labor agreement preferences 'encouraged but not required' on federal construction projects over $35 million weakened the policy framework that had been steering federal-funded work toward unionized contractors. The Federal Mechanical Insulation Act advanced out of House committee by a 54–0 vote, but had not yet become law."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Membership Picture"
                    summary="Approximately 30,000 active members across the U.S., Canada, and Puerto Rico."
                    body="The Insulators report roughly 30,000 members across the United States and Canada. The union operates through dozens of local unions across the United States, Canada, and Puerto Rico. Members are concentrated in the major industrial corridors of the Northeast, the upper Midwest, the Gulf Coast, the West Coast, and major Canadian metropolitan areas. Insulators wages vary substantially by region and skill level, with journey-level workers in major industrial markets earning well above the median for construction trades, plus full benefits packages including pension, employer-paid health insurance, and apprenticeship contributions."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Steady Anchors"
                    summary="CHIPS fabs, data centers, hospitals, and asbestos abatement in older buildings continue to provide stable employment."
                    body="The work itself remained robust in the sectors where the Insulators are most concentrated. CHIPS-funded semiconductor fabs continued to require substantial specialized mechanical insulation work, with Intel, TSMC, GlobalFoundries, and Micron projects generating sustained employment. Data-center construction, while less insulation-intensive per square foot than traditional industrial facilities, continued to require Insulators labor for cooling systems, fire suppression, and process-water infrastructure. Hospital construction, university buildings, and major institutional projects continued to favor the high-skill mechanical insulation work that Insulators members specialize in. And the steady demand for asbestos abatement and lead mitigation in older buildings — a market the union has dominated for decades — continued to provide stable employment."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Master Apprentice Competition"
                    summary="The 2025 conference brought instructors and apprentices from across North America together for technical training and mental health programming."
                    body="The Insulators' Joint Apprenticeship and Training Committee (JATC) network operates training centers across the United States and Canada, with curriculum focused on mechanical insulation installation, firestopping, asbestos and lead mitigation, sound attenuation, and specialty fabrications. The 2025 Insulation Industry International Training Fund Joint Apprenticeship Conference, held in Chicago from June 23 to 26, brought instructors and apprentices from across North America together for technical training, mental health awareness programming, and industry development. The annual Master Apprentice Competition (MAC), most recently held in Chicago in June 2025, brings together top apprentices from across the union's locals to compete in mechanical insulation skill demonstrations."
                  />
                </Era>

                {/* CLOSING */}
                <div style={{margin:'80px 0 40px', padding:'40px', background:'linear-gradient(135deg, rgba(168,98,58,0.10), rgba(245,197,24,0.04))', border:'1px solid rgba(168,98,58,0.25)', borderRadius:20, textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#A8623A', letterSpacing:3, textTransform:'uppercase', marginBottom:12}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'0 0 20px 0', lineHeight:1.1}}>
                    Almost no one sees the work.<br/><span style={{color:'#A8623A'}}>Everyone depends on it.</span>
                  </h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 16px'}}>
                    When the locals that responded to St. Louis Local No. 1's 1903 invitation met for their first convention on July 7 of that year, the trade they imagined organizing was just beginning to take its modern form. Steam systems were the dominant industrial heat source. Asbestos was the universal insulating material. The men who did the work were dying of occupational diseases that no one yet understood.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.7, maxWidth:680, margin:'0 auto 24px'}}>
                    The Insulators today, 122 years after that small July convention, continue to do the same essential thing the founders set out to organize: protecting the workers who wrap the pipes that the rest of the building trades install, and ensuring that the mechanical systems of modern buildings do what they are designed to do.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#A8623A', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(168,98,58,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}

`;

if (code.includes('{page === "history-insul" && (() => {')) {
  console.log('Skipping page insert — history-insul page already present.');
} else if (code.includes(insertAnchor)) {
  code = code.replace(insertAnchor, insulPage + insertAnchor);
  console.log('✓ Inserted Insulators history page render block');
  changes++;
} else {
  console.error('ERROR: trade-history insertion anchor not found.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

// ── 6. UPDATE PRERENDER SCRIPT ───────────────────────────────────────────────
if (fs.existsSync(prerenderPath)) {
  let pre = fs.readFileSync(prerenderPath, 'utf8');
  const oldPreAnchor = `  '/history-iron': { title: 'Iron Workers History · Union Pathways', description: 'The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding, through the McNamara bombings and the Golden Gate Bridge, to the 2025 transition to General President Kevin Bryenton.' },`;
  const newPreAnchor =
`  '/history-iron': { title: 'Iron Workers History · Union Pathways', description: 'The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding, through the McNamara bombings and the Golden Gate Bridge, to the 2025 transition to General President Kevin Bryenton.' },
  '/history-insul': { title: 'Insulators History · Union Pathways', description: 'The full history of the International Association of Heat and Frost Insulators and Allied Workers (AWIU) — from the 1903 St. Louis founding, through World War II Pearl Harbor reconstruction, the Selikoff asbestos studies, and the modern push for the Federal Mechanical Insulation Act.' },`;

  if (pre.includes("'/history-insul':")) {
    console.log('Skipping prerender update — /history-insul already in script.');
  } else if (pre.includes(oldPreAnchor)) {
    pre = pre.replace(oldPreAnchor, newPreAnchor);
    fs.writeFileSync(prerenderPath, pre);
    console.log('✓ Added /history-insul to prerender script');
    changes++;
  } else {
    console.error('WARNING: prerender script anchor not found. Insulators page will not have static OG tags until manual fix.');
  }
} else {
  console.log('(Skipping prerender step — scripts/generate-og-pages.mjs not found.)');
}

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx scripts/generate-og-pages.mjs && git commit -m "feat: add Insulators (AWIU) deep-dive history page" && git push');
console.log('');
