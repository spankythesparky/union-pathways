const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add to valid pages
code = code.replace(
  "const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','retirement','health','benefits','about','contact'];",
  "const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','retirement','health','benefits','about','contact','jobboard'];"
);
console.log('Added jobboard to valid pages');

// 2. Add jobboard state
code = code.replace(
  'const [showResults, setShowResults] = useState(false);',
  `const [showResults, setShowResults] = useState(false);
  const [jobTrade, setJobTrade] = useState('');
  const [jobLocal, setJobLocal] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [jobCalls, setJobCalls] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [jobSubmitted, setJobSubmitted] = useState(false);
  const [jobBoardTrade, setJobBoardTrade] = useState('all');
  const [approvedReports, setApprovedReports] = useState([]);`
);
console.log('Added jobboard state');

// 3. Add nav button before About
code = code.replace(
  '<button className={`nav-link ${page==="about"?"active":""}`} onClick={() => setPage("about")}>{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</button>',
  `<button className={\`nav-link \${page==="jobboard"?"active":""}\`} onClick={() => setPage("jobboard")}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>
            <button className={\`nav-link \${page==="about"?"active":""}\`} onClick={() => setPage("about")}>{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</button>`
);
console.log('Added Job Board to nav');

// 4. Add page JSX before veterans page
const pageMarker = '        {page === "veterans" && (';

const jobBoardPage = `        {page === "jobboard" && (() => {
          // Build trade options with their locals
          const JOB_TRADES = [
            { key: 'IBEW_I', label: 'IBEW Inside Wireman', locals: IBEW_INSIDE_LOCALS },
            { key: 'IBEW_L', label: 'IBEW Lineman', locals: IBEW_LINEMAN_LOCALS },
            { key: 'UA', label: 'UA Plumbers & Pipefitters', locals: UA_LOCALS },
            { key: 'BAC', label: 'BAC Bricklayers', locals: BAC_LOCALS },
            { key: 'IW', label: 'Ironworkers', locals: IW_LOCALS },
            { key: 'HFIAW', label: 'HFIAW Insulators', locals: HFIAW_LOCALS },
            { key: 'IUEC', label: 'IUEC Elevator Constructors', locals: IUEC_LOCALS },
            { key: 'IUOE', label: 'IUOE Operating Engineers', locals: IUOE_LOCALS },
            { key: 'UBC', label: 'UBC Carpenters', locals: UBC_LOCALS },
          ];

          const selectedTradeLocals = JOB_TRADES.find(t => t.key === jobTrade)?.locals || [];

          const handleJobSubmit = async () => {
            if (!jobTrade || !jobLocal || !jobStatus || !jobDate) return;
            const local = selectedTradeLocals.find(l => String(l.id) === String(jobLocal));
            if (!local) return;

            const tradeName = JOB_TRADES.find(t => t.key === jobTrade)?.label || jobTrade;
            const statusEmoji = jobStatus === 'busy' ? '🟢 Busy' : jobStatus === 'steady' ? '🟡 Steady' : '🔴 Slow';

            const body = \`
New Job Board Report Submitted — Union Pathways

Trade: \${tradeName}
Local: \${local.name} — \${local.city}, \${local.state}
Status: \${statusEmoji}
Job Calls: \${jobCalls || 'None listed'}
Report Date: \${jobDate}

Local Contact Info:
Phone: \${local.phone || 'N/A'}
Website: \${local.website || 'N/A'}
Email: \${local.email || 'N/A'}
Address: \${local.address || 'N/A'}

To approve this report, reply APPROVE to add it to the Job Board.
To reject, reply REJECT.

— Union Pathways Automated Submission
            \`.trim();

            // Use mailto as simple submission method
            const subject = encodeURIComponent(\`[Job Board] \${local.name} — \${statusEmoji}\`);
            const bodyEncoded = encodeURIComponent(body);
            window.location.href = \`mailto:Spankythesparky@gmail.com?subject=\${subject}&body=\${bodyEncoded}\`;
            setJobSubmitted(true);
          };

          return (
            <div>
              <div className="history-hero">
                <div className="history-eyebrow">{lang==="es" ? "Enviado por Miembros Sindicales" : lang==="pl" ? "Przeslane przez Czlonkow Zwiazku" : "Submitted by Union Members"}</div>
                <h1 className="history-title">
                  {lang==="es" ? <>{"Bolsa de "}<span className="accent">{"Trabajo Sindical"}</span></> : lang==="pl" ? <>{"Gielda "}<span className="accent">{"Pracy Zwiazkowej"}</span></> : <>{"Union "}<span className="accent">{"Job Board"}</span></>}
                </h1>
                <p className="history-subtitle">
                  {lang==="es" ? "Informes de perspectivas laborales enviados por miembros del sindicato. Verifica siempre con tu local antes de viajar." : lang==="pl" ? "Raporty o perspektywach pracy przeslane przez czlonkow zwiazku. Zawsze weryfikuj ze swoim lokalem przed podrozowaniem." : "Work outlook reports submitted by union members. Always verify availability directly with your local hall before traveling or making career decisions."}
                </p>
              </div>

              <div style={{maxWidth:900, margin:"0 auto", padding:"0 24px 80px"}}>

                {/* DISCLAIMER */}
                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:14, padding:"16px 20px", marginBottom:40, display:"flex", gap:12, alignItems:"flex-start"}}>
                  <div style={{color:"#FA8059", fontSize:18, flexShrink:0}}>&#9888;</div>
                  <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>
                    {lang==="es" ? "Todos los informes son enviados por miembros sindicales bajo un sistema de honor. Union Pathways no verifica esta informacion. Siempre confirma la disponibilidad de trabajo directamente con tu local sindical antes de viajar o tomar decisiones de carrera." : lang==="pl" ? "Wszystkie raporty sa przesylane przez czlonkow zwiazku w systemie honorowym. Union Pathways nie weryfikuje tych informacji. Zawsze potwierdzaj dostepnosc pracy bezposrednio ze swoim lokalem przed podrozowaniem." : "All work outlook reports are submitted by union members on an honor system. Union Pathways does not verify this information. Always confirm work availability directly with your local hall before traveling or making career decisions."}
                  </div>
                </div>

                {/* SUBMIT FORM */}
                <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"32px", marginBottom:40}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:24}}>
                    {lang==="es" ? "Enviar un Informe" : lang==="pl" ? "Wyslij Raport" : "Submit a Report"}
                  </div>

                  {jobSubmitted ? (
                    <div style={{textAlign:"center", padding:"40px 0"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059", marginBottom:12}}>Report Submitted!</div>
                      <div style={{fontSize:14, color:"var(--muted)", marginBottom:24}}>Your report is under review. Once approved it will appear on the Job Board.</div>
                      <button onClick={() => { setJobSubmitted(false); setJobTrade(''); setJobLocal(''); setJobStatus(''); setJobCalls(''); setJobDate(''); }} style={{background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"10px 24px", color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer"}}>
                        Submit Another
                      </button>
                    </div>
                  ) : (
                    <div style={{display:"flex", flexDirection:"column", gap:20}}>

                      {/* Trade selector */}
                      <div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                          {lang==="es" ? "Oficio" : lang==="pl" ? "Zawod" : "Trade"}
                        </div>
                        <select value={jobTrade} onChange={e => { setJobTrade(e.target.value); setJobLocal(''); }} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:jobTrade ? "#fff" : "var(--muted)", fontSize:14, fontFamily:"'Inter',sans-serif", cursor:"pointer"}}>
                          <option value="">{lang==="es" ? "Selecciona tu oficio..." : lang==="pl" ? "Wybierz zawod..." : "Select your trade..."}</option>
                          {JOB_TRADES.map(t => <option key={t.key} value={t.key} style={{background:"#0a1628"}}>{t.label}</option>)}
                        </select>
                      </div>

                      {/* Local selector */}
                      {jobTrade && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Local Sindical" : lang==="pl" ? "Lokal Zwiazku" : "Union Local"}
                          </div>
                          <select value={jobLocal} onChange={e => setJobLocal(e.target.value)} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:jobLocal ? "#fff" : "var(--muted)", fontSize:14, fontFamily:"'Inter',sans-serif", cursor:"pointer"}}>
                            <option value="">{lang==="es" ? "Selecciona tu local..." : lang==="pl" ? "Wybierz lokal..." : "Select your local..."}</option>
                            {selectedTradeLocals.sort((a,b) => a.name.localeCompare(b.name)).map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>)}
                          </select>
                        </div>
                      )}

                      {/* Status */}
                      {jobLocal && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Estado del Trabajo" : lang==="pl" ? "Status Pracy" : "Work Status"}
                          </div>
                          <div style={{display:"flex", gap:10}}>
                            {[
                              {val:'busy', label:'🟢 Busy', desc: lang==="es" ? "Mucho trabajo, contratando" : lang==="pl" ? "Duzo pracy, zatrudniamy" : "Lots of work, hiring"},
                              {val:'steady', label:'🟡 Steady', desc: lang==="es" ? "Flujo normal de trabajo" : lang==="pl" ? "Normalny przepyw pracy" : "Normal workflow"},
                              {val:'slow', label:'🔴 Slow', desc: lang==="es" ? "Trabajo escaso" : lang==="pl" ? "Malo pracy" : "Work is light"},
                            ].map(s => (
                              <button key={s.val} onClick={() => setJobStatus(s.val)} style={{flex:1, padding:"12px 8px", borderRadius:12, border: jobStatus===s.val ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.08)", background: jobStatus===s.val ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center"}}>
                                <div style={{fontSize:14, fontWeight:700, color: jobStatus===s.val ? "#FA8059" : "#fff", marginBottom:4}}>{s.label}</div>
                                <div style={{fontSize:11, color:"var(--muted)"}}>{s.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Job Calls */}
                      {jobStatus && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Lista de Llamadas de Trabajo" : lang==="pl" ? "Lista Ofert Pracy" : "List Job Calls"}
                          </div>
                          <textarea value={jobCalls} onChange={e => setJobCalls(e.target.value)} placeholder={lang==="es" ? "Ej: Trabajo comercial disponible, proyectos de data center, sin trabajo residencial..." : lang==="pl" ? "Np: Praca komercyjna dostepna, projekty data center, brak pracy mieszkaniowej..." : "e.g. Commercial work available, data center projects, no residential work..."} rows={3} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", resize:"vertical", boxSizing:"border-box"}}/>
                        </div>
                      )}

                      {/* Date */}
                      {jobStatus && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Fecha del Informe" : lang==="pl" ? "Data Raportu" : "Report Date"}
                          </div>
                          <input type="date" value={jobDate} onChange={e => setJobDate(e.target.value)} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", width:"100%", boxSizing:"border-box"}}/>
                        </div>
                      )}

                      {/* Submit */}
                      {jobTrade && jobLocal && jobStatus && jobDate && (
                        <button onClick={handleJobSubmit} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 32px", borderRadius:50, border:"none", cursor:"pointer", marginTop:8}}>
                          {lang==="es" ? "Enviar Informe" : lang==="pl" ? "Wyslij Raport" : "Submit Report"}
                        </button>
                      )}

                    </div>
                  )}
                </div>

                {/* BOARD — approved reports would show here */}
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:20}}>
                    {lang==="es" ? "Informes Aprobados" : lang==="pl" ? "Zatwierdzone Raporty" : "Approved Reports"}
                  </div>
                  <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", marginBottom:8}}>
                      {lang==="es" ? "No hay informes aprobados todavia" : lang==="pl" ? "Brak zatwierdzonych raportow" : "No approved reports yet"}
                    </div>
                    <div style={{fontSize:13, color:"rgba(160,180,196,0.4)"}}>
                      {lang==="es" ? "Se el primero en enviar un informe de perspectivas laborales." : lang==="pl" ? "Badz pierwszym, ktory wysle raport o perspektywach pracy." : "Be the first to submit a work outlook report for your local."}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

`;

if (!code.includes(pageMarker)) { console.error('ERROR: veterans marker not found'); process.exit(1); }
code = code.replace(pageMarker, jobBoardPage + pageMarker);
console.log('Added Job Board page');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Union Job Board page" && git push\n');
