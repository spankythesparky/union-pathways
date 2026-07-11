// fix172.js — Add Weingarten Rights page
//
// What this does:
//   1. Inserts a new page route: page === "weingarten"
//      Mounted right after the page === "rtw" IIFE in src/App.jsx
//   2. Adds "Weingarten Rights" entry to the desktop Resources dropdown
//      (between Right to Work and Workplace Organizing)
//   3. Adds the same entry to the mobile drawer Resources section
//   4. Adds "weingarten" to the active-state highlight check on the Resources
//      dropdown button
//
// Idempotency: the script no-ops if 'page === "weingarten"' is already
// present in the file.
//
// Reads:  src/App.jsx (must be in current working directory)
// Writes: src/App.jsx (in place)

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root (~/Desktop/union-pathway).');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');

// ----------------------------------------------------------------------------
// Idempotency check
// ----------------------------------------------------------------------------
if (src.includes('page === "weingarten"')) {
  console.log('Already applied — Weingarten page is already in place. No changes made.');
  process.exit(0);
}

// ============================================================================
// 1. THE PAGE ITSELF (mounted after page === "rtw" closing parens)
// ============================================================================
// Inserted after: `        })()}\n` that closes the rtw IIFE.
// Anchor: `          return <RTWPage />;\n        })()}\n\n        {page === "apprenticeship"`

const PAGE_BLOCK = `
        {page === "weingarten" && (() => {
          // ============================================================
          // INLINE COMPONENT (own scope so hooks are clean)
          // ============================================================
          const WeingartenPage = () => {
            const [openStep, setOpenStep] = useState(null);
            const [openMyth, setOpenMyth] = useState(null);
            const [copied, setCopied] = useState(false);

            const cardScript = "If this discussion could in any way lead to my being disciplined or terminated, I respectfully request that my union representative be present at this meeting. Without representation, I choose not to answer any questions.";

            const handleCopy = () => {
              try {
                navigator.clipboard.writeText(cardScript);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch (e) {}
            };

            const conditions = [
              { n: "01", t: "An investigatory interview is happening", d: "A manager, supervisor, or other agent of management is questioning you. Routine instructions, training, or coaching don't count — this has to be a fact-finding session." },
              { n: "02", t: "It's about YOUR conduct", d: "The investigation is into your performance, conduct, or alleged misconduct — not someone else's. If you're a witness to another employee's behavior, Weingarten doesn't apply." },
              { n: "03", t: "Discipline is reasonably possible", d: "You reasonably believe the interview could lead to discharge, discipline, demotion, or other adverse change in your job. The standard is what a reasonable employee would believe — not what the supervisor intended." },
              { n: "04", t: "You ASK for representation", d: "The right is not automatic. The employer is not required to inform you of it. You must affirmatively request a union representative — and a third party can't make the request for you." }
            ];

            const checklist = [
              { phase: "Before the interview", items: [
                "Meet privately with the employee. Get their full account in their own words.",
                "Identify potential witnesses, documents, video footage, time records.",
                "Clarify what the employee should and should not volunteer.",
                "Make sure the employee understands they can decline to answer specific questions."
              ]},
              { phase: "At the start of the interview", items: [
                "Ask the employer to identify the specific subject of the investigation.",
                "Ask what specific allegations are being made.",
                "Confirm whether discipline is being contemplated.",
                "Request a brief private conference if anything is unclear."
              ]},
              { phase: "During the interview", items: [
                "Take detailed notes — who said what, in what order, with what tone.",
                "Object to compound, leading, accusatory, or harassing questions.",
                "Ask for clarification of vague or ambiguous questions.",
                "Suggest other witnesses or evidence the employer should consider.",
                "Request a break for private consultation when needed."
              ]},
              { phase: "After the interview", items: [
                "Document the entire meeting in writing — what was said, by whom, in what order.",
                "Identify any procedural violations.",
                "Counsel the employee on next steps and possible outcomes.",
                "Preserve the notes — they're often the strongest evidence in a later grievance."
              ]}
            ];

            const myths = [
              { q: "The employer has to tell me I have this right.",
                a: "No — only your request triggers it. Unlike Miranda warnings in a criminal arrest, there is no obligation on the employer to inform you of your Weingarten rights. This is why wallet cards and posted notices in unionized workplaces matter — the burden of knowing is entirely on you." },
              { q: "I can refuse to attend the meeting.",
                a: "No — refusing to attend is itself insubordination, and can be grounds for separate discipline. The right is to representation during the meeting, not to skip the meeting." },
              { q: "My representative can answer for me.",
                a: "No — the representative advises and assists but does not testify on your behalf. They can object to questions, ask for clarification, request breaks, and counsel you privately, but they cannot substitute their words for yours." },
              { q: "This applies to any meeting with my boss.",
                a: "No — Weingarten only applies to investigatory interviews where discipline is reasonably possible. Performance feedback, scheduling discussions, or routine instructions don't qualify." },
              { q: "Non-union workers have the same right.",
                a: "Not under current Board law. The NLRB has flipped on this multiple times since the 1980s — most recently in IBM Corp. (2004), which retracted the right for non-union employees. Non-union workers may request a coworker's presence, but the employer is not legally required to honor that request." },
              { q: "I have to use the word 'Weingarten.'",
                a: "No — any reasonable request for union representation triggers the right. You don't need any magic language. Once you've asked, you don't need to repeat the request throughout the interview." }
            ];

            const counts = [
              { label: "What counts", color: "#4A9A6E", items: [
                "Questioning about suspected theft, fraud, or policy violations",
                "Performance reviews that escalate into accusations",
                "Drug testing tied to a specific conduct investigation",
                "Safety incident inquiries where your actions are being scrutinized",
                "Attendance or conduct fact-finding meetings"
              ]},
              { label: "What doesn't", color: "#D14B3F", items: [
                "Meetings to announce already-decided discipline",
                "Routine shop-floor instructions, training, or coaching",
                "Interviews where you're a witness to someone else's conduct",
                "Physical exams without an interview component"
              ]}
            ];

            return (
              <div>
                {/* HERO */}
                <div className="history-hero">
                  <div className="history-eyebrow">{lang==="es" ? "Tus Derechos en el Trabajo" : lang==="pl" ? "Twoje Prawa w Pracy" : "Your Rights at Work"}</div>
                  <h1 className="history-title">
                    {lang==="es" ? <>{"Derechos "}<span className="accent">{"Weingarten."}</span></>
                    : lang==="pl" ? <>{"Prawa "}<span className="accent">{"Weingarten."}</span></>
                    : <>{"Weingarten "}<span className="accent">{"Rights."}</span></>}
                  </h1>
                  <p className="history-subtitle">
                    {lang==="es" ? "Si tu jefe te interroga sobre algo que podría llevar a una sanción, tienes derecho a tener un representante del sindicato presente. Pero solo si lo pides."
                    : lang==="pl" ? "Jeśli szef przesłuchuje cię w sprawie czegoś, co może doprowadzić do dyscypliny, masz prawo do obecności przedstawiciela związku. Ale tylko jeśli o to poprosisz."
                    : "If your boss is questioning you about something that could lead to discipline, you have the right to have a union rep in the room. But only if you ask."}
                  </p>
                </div>

                <div style={{maxWidth:820, margin:"0 auto", padding:"40px 24px 0"}}>

                  {/* DEFINITION CARD */}
                  <div style={{background:"rgba(245,197,24,0.06)", border:"1px solid rgba(245,197,24,0.2)", borderRadius:12, padding:"24px 28px", marginBottom:32}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#F5C518", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>What it is</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>The right to a union rep during a workplace investigation</h3>
                    <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:12}}>
                      Named for the 1975 Supreme Court case <i>NLRB v. J. Weingarten, Inc.</i>, this rule says that when management is interviewing you about your own conduct and you reasonably believe discipline could follow, you can demand a union representative be present.
                    </p>
                    <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, margin:0}}>
                      It comes from <strong style={{color:"#fff"}}>Section 7 of the National Labor Relations Act</strong> — the same provision that protects all "concerted activities for mutual aid or protection." The Court reasoned that one worker against the company's investigation is an unfair fight; representation evens the field.
                    </p>
                  </div>

                  {/* MIRANDA COMPARISON */}
                  <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"24px 28px", marginBottom:48}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:14}}>Weingarten vs. Miranda</div>
                    <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, margin:0}}>
                      People often compare Weingarten to Miranda rights. Both involve representation during questioning where serious consequences may follow. But there's one critical difference: <strong style={{color:"#FA8059"}}>the employer doesn't have to tell you about your Weingarten rights.</strong> The police must read you Miranda. Your boss does not have to read you Weingarten. The burden of knowing — and asking — is entirely on you.
                    </p>
                  </div>

                  {/* THE 4 CONDITIONS */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>The 4 conditions that trigger the right</h3>
                  <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                    All four must be present. If any one is missing, Weingarten does not attach.
                  </p>
                  <div style={{display:"grid", gridTemplateColumns:"1fr", gap:14, marginBottom:48}}>
                    {conditions.map((c, i) => (
                      <div key={i} style={{display:"flex", gap:18, padding:"20px 22px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:"#F5C518", lineHeight:1, minWidth:48}}>{c.n}</div>
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:"#fff", marginBottom:8}}>{c.t}</div>
                          <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.65}}>{c.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* WHAT COUNTS / DOESN'T */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 24px 0"}}>What counts as an investigatory interview</h3>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16, marginBottom:48}}>
                    {counts.map((g, gi) => (
                      <div key={gi} style={{background:"rgba(255,255,255,0.03)", border:"1px solid "+g.color+"33", borderRadius:12, padding:"20px 22px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:g.color, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14}}>{g.label}</div>
                        <ul style={{margin:0, padding:"0 0 0 18px", listStyle:"none"}}>
                          {g.items.map((it, ii) => (
                            <li key={ii} style={{position:"relative", fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.55, marginBottom:10, paddingLeft:6}}>
                              <span style={{position:"absolute", left:-14, color:g.color, fontWeight:900}}>·</span>
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* WALLET CARD */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>What to say when you ask</h3>
                  <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:20}}>
                    You don't need to say "Weingarten" — any reasonable request for union representation works. Most stewards carry a wallet card with this script. Print it, save it, memorize it.
                  </p>
                  <div style={{position:"relative", background:"linear-gradient(135deg, #1a2332 0%, #0f1620 100%)", border:"2px solid #F5C518", borderRadius:14, padding:"28px 32px", marginBottom:20, boxShadow:"0 8px 24px rgba(0,0,0,0.3)"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:"#F5C518", letterSpacing:2, textTransform:"uppercase", marginBottom:14}}>Weingarten Request — Wallet Card</div>
                    <p style={{fontSize:16, color:"#fff", lineHeight:1.7, fontStyle:"italic", margin:0, fontWeight:500}}>
                      "{cardScript}"
                    </p>
                    <button onClick={handleCopy} style={{marginTop:18, padding:"10px 20px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", background: copied ? "#4A9A6E" : "#F5C518", color:"#000", border:"none", borderRadius:50, cursor:"pointer", transition:"all 0.15s"}}>
                      {copied ? "✓ Copied" : "Copy script"}
                    </button>
                  </div>
                  <p style={{fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.6, marginBottom:48, fontStyle:"italic"}}>
                    Once you've asked, you don't need to ask again throughout the meeting. The request stands.
                  </p>

                  {/* EMPLOYER'S 3 OPTIONS */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>What happens after you ask</h3>
                  <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                    Once you've requested representation, the employer has exactly three lawful options. They <strong style={{color:"#fff"}}>cannot</strong> simply continue questioning over your objection — that's an unfair labor practice.
                  </p>
                  <div className="impact-grid" style={{marginTop:0, marginBottom:48}}>
                    {[
                      {t:"1. Grant the request", d:"Pause the interview until your representative arrives. The investigation continues with the rep present."},
                      {t:"2. End the interview", d:"Stop questioning entirely and proceed without your input. The employer can still investigate by other means."},
                      {t:"3. Offer you a choice", d:"Let you choose between continuing without a rep or ending the interview. The choice has to be yours, freely made."}
                    ].map((o, i) => (
                      <div key={i} className="impact-card">
                        <div className="impact-title">{o.t}</div>
                        <div className="impact-desc">{o.d}</div>
                      </div>
                    ))}
                  </div>

                  {/* STEWARD'S CHECKLIST */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>Steward's checklist</h3>
                  <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                    If you're the rep being called in, here's what the work looks like.
                  </p>
                  <div style={{marginBottom:48}}>
                    {checklist.map((phase, pi) => {
                      const isOpen = openStep === pi;
                      return (
                        <div key={pi} style={{borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom: pi === checklist.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none"}}>
                          <button onClick={() => setOpenStep(isOpen ? null : pi)} style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"20px 0", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800}}>
                            <span>{phase.phase}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{transition:"transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none", color:"#F5C518", flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
                          </button>
                          {isOpen && (
                            <ul style={{margin:"0 0 18px 0", padding:"0 0 0 4px", listStyle:"none"}}>
                              {phase.items.map((it, ii) => (
                                <li key={ii} style={{position:"relative", fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.65, marginBottom:10, paddingLeft:22}}>
                                  <span style={{position:"absolute", left:0, top:7, width:6, height:6, borderRadius:"50%", background:"#F5C518"}} />
                                  {it}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* WHAT THE REP CAN/CAN'T DO */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 24px 0"}}>What your rep can and can't do</h3>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16, marginBottom:48}}>
                    <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(74,154,110,0.3)", borderRadius:12, padding:"20px 22px"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#4A9A6E", letterSpacing:1.5, textTransform:"uppercase", marginBottom:14}}>Can do</div>
                      <ul style={{margin:0, padding:"0 0 0 18px", listStyle:"none"}}>
                        {["Confer with you privately before the interview", "Ask for clarification of unclear questions", "Advise you during the interview", "Suggest other witnesses or evidence", "Take notes", "Object to harassing or unfair questions"].map((it, ii) => (
                          <li key={ii} style={{position:"relative", fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.55, marginBottom:10, paddingLeft:6}}>
                            <span style={{position:"absolute", left:-14, color:"#4A9A6E", fontWeight:900}}>·</span>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(209,75,63,0.3)", borderRadius:12, padding:"20px 22px"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#D14B3F", letterSpacing:1.5, textTransform:"uppercase", marginBottom:14}}>Can't do</div>
                      <ul style={{margin:0, padding:"0 0 0 18px", listStyle:"none"}}>
                        {["Answer questions on your behalf", "Tell you not to answer (you can decline on your own)", "Disrupt the interview or block legitimate questions", "Turn the meeting into an adversarial contest"].map((it, ii) => (
                          <li key={ii} style={{position:"relative", fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.55, marginBottom:10, paddingLeft:6}}>
                            <span style={{position:"absolute", left:-14, color:"#D14B3F", fontWeight:900}}>·</span>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* MYTHS */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>Common misconceptions</h3>
                  <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                    Six things people get wrong about Weingarten.
                  </p>
                  <div style={{marginBottom:48}}>
                    {myths.map((m, i) => {
                      const isOpen = openMyth === i;
                      return (
                        <div key={i} style={{borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom: i === myths.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none"}}>
                          <button onClick={() => setOpenMyth(isOpen ? null : i)} style={{width:"100%", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, padding:"18px 0", background:"transparent", border:"none", cursor:"pointer", textAlign:"left"}}>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700, color:"#fff", lineHeight:1.4}}>"{m.q}"</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{transition:"transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none", color:"#FA8059", flexShrink:0, marginTop:5}}><polyline points="6 9 12 15 18 9"/></svg>
                          </button>
                          {isOpen && (
                            <p style={{fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:"0 0 18px 0", paddingRight:30}}>{m.a}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* NON-UNION SECTION */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>The non-union question</h3>
                  <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:20}}>
                    Whether non-union workers have Weingarten rights has been one of the most politically contested questions in modern labor law. The NLRB has flipped on it four times in 40 years.
                  </p>
                  <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, overflow:"hidden", marginBottom:20}}>
                    {[
                      {y:"1982", c:"Materials Research Corp.", e:"Extended to non-union workers", color:"#4A9A6E"},
                      {y:"1985", c:"Sears, Roebuck & Co.", e:"Retracted", color:"#D14B3F"},
                      {y:"2000", c:"Epilepsy Foundation of NE Ohio", e:"Extended again", color:"#4A9A6E"},
                      {y:"2004", c:"IBM Corp.", e:"Retracted again — current rule", color:"#D14B3F"}
                    ].map((row, ri) => (
                      <div key={ri} style={{display:"grid", gridTemplateColumns:"60px 1fr auto", gap:16, padding:"14px 18px", borderBottom: ri < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", alignItems:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#F5C518"}}>{row.y}</div>
                        <div style={{fontSize:14, color:"rgba(255,255,255,0.85)", fontStyle:"italic"}}>{row.c}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:row.color, letterSpacing:1.5, textTransform:"uppercase"}}>{row.e}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.7, marginBottom:48, fontStyle:"italic"}}>
                    Bottom line: only union-represented employees have Weingarten rights right now. Non-union workers may request a coworker's presence, but the employer is not legally required to honor that request. A 2022 decision (<i>Troy Grove</i>) extended the right to strike replacements working under a union-represented unit, suggesting the Board may be willing to revisit this. Watch the Board.
                  </p>

                  {/* FEDERAL EMPLOYEES */}
                  <div style={{background:"rgba(74,123,157,0.08)", border:"1px solid rgba(74,123,157,0.25)", borderRadius:12, padding:"20px 24px", marginBottom:48}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#4A7B9D", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10}}>Federal employees</div>
                    <p style={{fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0}}>
                      Federal workers are covered under a parallel statute: <strong>5 U.S.C. § 7114(a)(2)(B)</strong>, the Federal Service Labor-Management Relations Statute. The Federal Labor Relations Authority (FLRA) — not the NLRB — enforces it. The right exists only for employees in a bargaining unit, and the union (not the individual) designates the representative. State and local government workers are covered under varying state laws and CBAs.
                    </p>
                  </div>

                  {/* REMEDIES */}
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 12px 0"}}>If your rights are violated</h3>
                  <p style={{fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.75, marginBottom:24}}>
                    File an unfair labor practice charge with the NLRB through your union. Available remedies include cease-and-desist orders, posted notices acknowledging the violation, reinstatement if discipline resulted, back pay and benefits, and "make-whole" remedies. The discipline itself is not automatically void — but evidence obtained from the tainted interview can be excluded, and discipline that flowed directly from it can be set aside.
                  </p>

                  {/* CITATIONS */}
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:32, marginBottom:48}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:2, textTransform:"uppercase", marginBottom:18}}>Key citations</div>
                    <ul style={{margin:0, padding:"0 0 0 18px", listStyle:"none", fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.85}}>
                      {[
                        <><i>NLRB v. J. Weingarten, Inc.</i>, 420 U.S. 251 (1975) — the original case</>,
                        <><i>International Ladies' Garment Workers' Union v. Quality Manufacturing Co.</i>, 420 U.S. 276 (1975) — companion case</>,
                        <>National Labor Relations Act, 29 U.S.C. § 157 (Section 7), § 158(a)(1) (Section 8(a)(1))</>,
                        <><i>IBM Corp.</i>, 341 NLRB 1288 (2004) — current rule on non-union workplaces</>,
                        <><i>Epilepsy Foundation of NE Ohio</i>, 331 NLRB 676 (2000)</>,
                        <><i>Materials Research Corp.</i>, 262 NLRB 1010 (1982)</>,
                        <><i>Troy Grove (Riverstone Group)</i>, 371 NLRB No. 138 (2022) — strike replacements</>,
                        <>5 U.S.C. § 7114(a)(2)(B) — federal sector parallel</>,
                      ].map((c, ci) => (
                        <li key={ci} style={{position:"relative", marginBottom:8, paddingLeft:6}}>
                          <span style={{position:"absolute", left:-14, color:"rgba(255,255,255,0.4)"}}>·</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button onClick={() => setPage("home")} style={{marginBottom:48, background:"transparent", color:"#F5C518", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:900, letterSpacing:1.5, textTransform:"uppercase", padding:"12px 28px", border:"1px solid rgba(245,197,24,0.4)", borderRadius:50, cursor:"pointer"}}>← Back to Home</button>
                </div>
              </div>
            );
          };
          return <WeingartenPage />;
        })()}
`;

// ----------------------------------------------------------------------------
// Insert page block right after the RTW IIFE closes
// ----------------------------------------------------------------------------
const rtwCloseAnchor = '          return <RTWPage />;\n        })()}\n';
const rtwIdx = src.indexOf(rtwCloseAnchor);
if (rtwIdx === -1) {
  console.error('ERROR: could not find RTW page closing anchor');
  process.exit(1);
}
const insertPoint = rtwIdx + rtwCloseAnchor.length;
src = src.slice(0, insertPoint) + PAGE_BLOCK + src.slice(insertPoint);

// ============================================================================
// 2. Add to desktop Resources dropdown — insert between RTW and Workplace Org
// ============================================================================
const desktopRTWItem = `<div className={\`nav-dropdown-item\${page==="rtw"?" active":""}\`} onMouseDown={() => { setPage("rtw"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Derecho al Trabajo" : lang==="pl" ? "Prawo do Pracy" : "Right to Work"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Comparacion de los 50 estados" : lang==="pl" ? "Porownanie 50 stanow" : "All 50 states compared"}</span>
                  </div>`;

const desktopWeingartenItem = `<div className={\`nav-dropdown-item\${page==="rtw"?" active":""}\`} onMouseDown={() => { setPage("rtw"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Derecho al Trabajo" : lang==="pl" ? "Prawo do Pracy" : "Right to Work"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Comparacion de los 50 estados" : lang==="pl" ? "Porownanie 50 stanow" : "All 50 states compared"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="weingarten"?" active":""}\`} onMouseDown={() => { setPage("weingarten"); setResourcesOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Derechos Weingarten" : lang==="pl" ? "Prawa Weingarten" : "Weingarten Rights"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Tu rep durante una investigacion" : lang==="pl" ? "Twoj przedstawiciel podczas dochodzenia" : "Your right to a rep during questioning"}</span>
                  </div>`;

if (!src.includes(desktopRTWItem)) {
  console.error('ERROR: could not find desktop Resources RTW item to anchor insertion');
  process.exit(1);
}
src = src.replace(desktopRTWItem, desktopWeingartenItem);

// ============================================================================
// 3. Update Resources dropdown active-state check to include weingarten
// ============================================================================
const oldActive = 'className={`nav-dropdown-btn${(page==="rtw"||page==="organize"||page==="organize-contractor")?" active":""}${resourcesOpen?" open":""}`}';
const newActive = 'className={`nav-dropdown-btn${(page==="rtw"||page==="weingarten"||page==="organize"||page==="organize-contractor")?" active":""}${resourcesOpen?" open":""}`}';
if (!src.includes(oldActive)) {
  console.error('ERROR: could not find Resources dropdown active-state check');
  process.exit(1);
}
src = src.replace(oldActive, newActive);

// ============================================================================
// 4. Add to mobile drawer Resources section — between RTW and Workplace Org
// ============================================================================
const mobileRTW = `<button className={\`mobile-drawer-link\${page==="rtw" ? " active" : ""}\`} onClick={() => { setPage("rtw"); setMobileNavOpen(false); }}>{lang==="es" ? "Derecho al Trabajo" : lang==="pl" ? "Prawo do Pracy" : "Right to Work"}</button>`;

const mobileRTWPlusWeingarten = `<button className={\`mobile-drawer-link\${page==="rtw" ? " active" : ""}\`} onClick={() => { setPage("rtw"); setMobileNavOpen(false); }}>{lang==="es" ? "Derecho al Trabajo" : lang==="pl" ? "Prawo do Pracy" : "Right to Work"}</button>
            <button className={\`mobile-drawer-link\${page==="weingarten" ? " active" : ""}\`} onClick={() => { setPage("weingarten"); setMobileNavOpen(false); }}>{lang==="es" ? "Derechos Weingarten" : lang==="pl" ? "Prawa Weingarten" : "Weingarten Rights"}</button>`;

if (!src.includes(mobileRTW)) {
  console.error('ERROR: could not find mobile drawer RTW button');
  process.exit(1);
}
src = src.replace(mobileRTW, mobileRTWPlusWeingarten);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Inserted:');
console.log('  - Weingarten page (page === "weingarten") after RTW page');
console.log('  - Desktop nav: Weingarten Rights item in Resources dropdown');
console.log('  - Mobile drawer: Weingarten Rights link in Resources section');
console.log('  - Active-state highlighting on Resources dropdown');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add Weingarten Rights page" && git push');
console.log('');
