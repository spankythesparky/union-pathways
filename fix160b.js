// fix160b.js — Re-apply contact field changes (compatible with fix161 already applied)
//
// Same as the original fix160 but the wage form anchor uses template_8fxawbm
// (the new wage-specific template that fix161 already installed).

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('jobContactName') || src.includes('wageContactEmail')) {
  console.error('ERROR: Contact fields already present. Aborting.');
  process.exit(1);
}

// 1. Add 4 new state hooks
const stateOld = `  const [jobSubmitted, setJobSubmitted] = useState(false);`;
const stateNew = `  const [jobSubmitted, setJobSubmitted] = useState(false);
  const [jobContactName, setJobContactName] = useState('');
  const [jobContactEmail, setJobContactEmail] = useState('');
  const [wageContactName, setWageContactName] = useState('');
  const [wageContactEmail, setWageContactEmail] = useState('');`;
if (!src.includes(stateOld)) { console.error('ERROR: state anchor not found.'); process.exit(1); }
src = src.replace(stateOld, () => stateNew);

// 2. Job board form — insert contact fields above submit
const jobBtnOld = `                      {/* Submit */}
                      {jobTrade && jobLocal && jobStatus && jobDate && (
                        <button onClick={handleJobSubmit} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 32px", borderRadius:50, border:"none", cursor:"pointer", marginTop:8}}>
                          {lang===\"es\" ? \"Enviar\" : lang===\"pl\" ? \"Wyslij\" : \"Submit Hot Spot\"}
                        </button>
                      )}`;

const jobBtnNew = `                      {/* CONTACT INFO — optional, private */}
                      {jobTrade && jobLocal && jobStatus && jobDate && (
                        <div style={{marginTop:8, padding:"18px 20px", background:"rgba(245,197,24,0.04)", border:"1px solid rgba(245,197,24,0.18)", borderRadius:12}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#F5C518", marginBottom:6}}>
                            {lang===\"es\" ? \"Contacto (opcional, privado)\" : lang===\"pl\" ? \"Kontakt (opcjonalny, prywatny)\" : \"Contact (optional, private)\"}
                          </div>
                          <div style={{fontSize:12, color:"rgba(255,255,255,0.6)", lineHeight:1.55, marginBottom:14}}>
                            {lang===\"es\" ? \"Solo para que pueda hacer seguimiento si tengo preguntas. Nunca se publicara en el sitio.\" : lang===\"pl\" ? \"Tylko abym mogl sie z Toba skontaktowac jesli mam pytania. Nigdy nie zostanie opublikowane na stronie.\" : \"Just so I can follow up if I have questions. This will never be posted on the site.\"}
                          </div>
                          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                            <input type=\"text\" value={jobContactName} onChange={e => setJobContactName(e.target.value)} placeholder={lang===\"es\" ? \"Nombre\" : lang===\"pl\" ? \"Imie\" : \"Name\"} style={{background:\"rgba(255,255,255,0.04)\", border:\"1px solid rgba(255,255,255,0.12)\", borderRadius:10, padding:\"10px 14px\", color:\"#fff\", fontSize:13, fontFamily:\"'Inter',sans-serif\"}} />
                            <input type=\"email\" value={jobContactEmail} onChange={e => setJobContactEmail(e.target.value)} placeholder={lang===\"es\" ? \"Correo electronico\" : lang===\"pl\" ? \"Email\" : \"Email\"} style={{background:\"rgba(255,255,255,0.04)\", border:\"1px solid rgba(255,255,255,0.12)\", borderRadius:10, padding:\"10px 14px\", color:\"#fff\", fontSize:13, fontFamily:\"'Inter',sans-serif\"}} />
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      {jobTrade && jobLocal && jobStatus && jobDate && (
                        <button onClick={handleJobSubmit} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 32px", borderRadius:50, border:"none", cursor:"pointer", marginTop:8}}>
                          {lang===\"es\" ? \"Enviar\" : lang===\"pl\" ? \"Wyslij\" : \"Submit Hot Spot\"}
                        </button>
                      )}`;
if (!src.includes(jobBtnOld)) { console.error('ERROR: job submit anchor not found.'); process.exit(1); }
src = src.replace(jobBtnOld, () => jobBtnNew);

// 3. Job board EmailJS payload
const jobEmailOld = `              await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                trade: tradeName,
                local_name: local.name,
                city: local.city,
                state: local.state,
                status: statusLabel,
                job_calls: jobCalls || 'None listed',
                report_date: jobDate,
                phone: local.phone || 'N/A',
                website: local.website || 'N/A',
                local_email: local.email || 'N/A',
                address: local.address || 'N/A',
              });`;
const jobEmailNew = `              await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                trade: tradeName,
                local_name: local.name,
                city: local.city,
                state: local.state,
                status: statusLabel,
                job_calls: jobCalls || 'None listed',
                report_date: jobDate,
                phone: local.phone || 'N/A',
                website: local.website || 'N/A',
                local_email: local.email || 'N/A',
                address: local.address || 'N/A',
                submitter_name: jobContactName || 'Not provided',
                submitter_email: jobContactEmail || 'Not provided',
              });`;
if (!src.includes(jobEmailOld)) { console.error('ERROR: job email anchor not found.'); process.exit(1); }
src = src.replace(jobEmailOld, () => jobEmailNew);

// 4. Wage form contact fields
const wageBtnOld = `                      {wageMethod && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (
                        <button onClick={handleWageSubmit} disabled={wageUploading} style={{background: wageUploading ? \"rgba(250,128,89,0.5)\" : \"#FA8059\", color:\"#000\", fontFamily:\"'Barlow Condensed',sans-serif\", fontSize:16, fontWeight:900, letterSpacing:\"0.08em\", textTransform:\"uppercase\", padding:\"16px 32px\", borderRadius:50, border:\"none\", cursor: wageUploading ? \"wait\" : \"pointer\", marginTop:8}}>
                          {wageUploading ? (lang===\"es\" ? \"Enviando...\" : lang===\"pl\" ? \"Wysylanie...\" : \"Submitting...\") : (lang===\"es\" ? \"Enviar Salarios\" : lang===\"pl\" ? \"Wyslij Stawki\" : \"Submit Wages\")}
                        </button>
                      )}`;

const wageBtnNew = `                      {/* CONTACT INFO — optional, private */}
                      {wageMethod && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (
                        <div style={{marginTop:8, padding:\"18px 20px\", background:\"rgba(245,197,24,0.04)\", border:\"1px solid rgba(245,197,24,0.18)\", borderRadius:12}}>
                          <div style={{fontFamily:\"'Barlow Condensed',sans-serif\", fontSize:12, fontWeight:700, letterSpacing:\"0.12em\", textTransform:\"uppercase\", color:\"#F5C518\", marginBottom:6}}>
                            {lang===\"es\" ? \"Contacto (opcional, privado)\" : lang===\"pl\" ? \"Kontakt (opcjonalny, prywatny)\" : \"Contact (optional, private)\"}
                          </div>
                          <div style={{fontSize:12, color:\"rgba(255,255,255,0.6)\", lineHeight:1.55, marginBottom:14}}>
                            {lang===\"es\" ? \"Solo para que pueda hacer seguimiento si tengo preguntas. Nunca se publicara en el sitio.\" : lang===\"pl\" ? \"Tylko abym mogl sie z Toba skontaktowac jesli mam pytania. Nigdy nie zostanie opublikowane na stronie.\" : \"Just so I can follow up if I have questions. This will never be posted on the site.\"}
                          </div>
                          <div style={{display:\"grid\", gridTemplateColumns:\"1fr 1fr\", gap:10}}>
                            <input type=\"text\" value={wageContactName} onChange={e => setWageContactName(e.target.value)} placeholder={lang===\"es\" ? \"Nombre\" : lang===\"pl\" ? \"Imie\" : \"Name\"} style={{background:\"rgba(255,255,255,0.04)\", border:\"1px solid rgba(255,255,255,0.12)\", borderRadius:10, padding:\"10px 14px\", color:\"#fff\", fontSize:13, fontFamily:\"'Inter',sans-serif\"}} />
                            <input type=\"email\" value={wageContactEmail} onChange={e => setWageContactEmail(e.target.value)} placeholder={lang===\"es\" ? \"Correo electronico\" : lang===\"pl\" ? \"Email\" : \"Email\"} style={{background:\"rgba(255,255,255,0.04)\", border:\"1px solid rgba(255,255,255,0.12)\", borderRadius:10, padding:\"10px 14px\", color:\"#fff\", fontSize:13, fontFamily:\"'Inter',sans-serif\"}} />
                          </div>
                        </div>
                      )}

                      {wageMethod && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (
                        <button onClick={handleWageSubmit} disabled={wageUploading} style={{background: wageUploading ? \"rgba(250,128,89,0.5)\" : \"#FA8059\", color:\"#000\", fontFamily:\"'Barlow Condensed',sans-serif\", fontSize:16, fontWeight:900, letterSpacing:\"0.08em\", textTransform:\"uppercase\", padding:\"16px 32px\", borderRadius:50, border:\"none\", cursor: wageUploading ? \"wait\" : \"pointer\", marginTop:8}}>
                          {wageUploading ? (lang===\"es\" ? \"Enviando...\" : lang===\"pl\" ? \"Wysylanie...\" : \"Submitting...\") : (lang===\"es\" ? \"Enviar Salarios\" : lang===\"pl\" ? \"Wyslij Stawki\" : \"Submit Wages\")}
                        </button>
                      )}`;
if (!src.includes(wageBtnOld)) { console.error('ERROR: wage submit anchor not found.'); process.exit(1); }
src = src.replace(wageBtnOld, () => wageBtnNew);

// 5. Wage EmailJS payload (using template_8fxawbm — fix161 already applied)
const wageEmailOld = `                await window.emailjs.send('service_uy3qbna', 'template_8fxawbm', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',
                  job_calls: wageMethod === 'image' ? \`Image upload: \${imageUrl}\` : \`Manual entry — Hourly: \$\${wageHourly}, Total: \$\${totalPackage.toFixed(2)}\`,
                  report_date: new Date().toLocaleDateString(), phone: 'N/A', website: 'N/A', local_email: 'N/A',
                  address: \`Contract valid through \${wageValidThrough || 'N/A'}\`,
                });`;
const wageEmailNew = `                await window.emailjs.send('service_uy3qbna', 'template_8fxawbm', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',
                  job_calls: wageMethod === 'image' ? \`Image upload: \${imageUrl}\` : \`Manual entry — Hourly: \$\${wageHourly}, Total: \$\${totalPackage.toFixed(2)}\`,
                  report_date: new Date().toLocaleDateString(), phone: 'N/A', website: 'N/A', local_email: 'N/A',
                  address: \`Contract valid through \${wageValidThrough || 'N/A'}\`,
                  submitter_name: wageContactName || 'Not provided',
                  submitter_email: wageContactEmail || 'Not provided',
                });`;
if (!src.includes(wageEmailOld)) { console.error('ERROR: wage email anchor not found.'); process.exit(1); }
src = src.replace(wageEmailOld, () => wageEmailNew);

// 6. Wage form reset
const resetOld = `            setWageValidThrough(''); setWageNotes('');
          };`;
const resetNew = `            setWageValidThrough(''); setWageNotes('');
            setWageContactName(''); setWageContactEmail('');
          };`;
if (!src.includes(resetOld)) { console.error('ERROR: reset anchor not found.'); process.exit(1); }
src = src.replace(resetOld, () => resetNew);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Contact fields restored to both forms.');
console.log('Wage email goes to template_8fxawbm with submitter_name + submitter_email.');
console.log('Job board email goes to template_a55dhfh with submitter_name + submitter_email.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: optional contact info on wage + job board (post-fix161)" && git push');
console.log('');
