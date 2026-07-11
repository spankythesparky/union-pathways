// fix162.js — Emergency: remove contact fields added by fix160
// Use only if fix160 broke the wage/job board forms on the live site.
// This restores the forms to their pre-fix160 state. fix161 (template ID swap) stays.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// 1. Remove the 4 state hooks
const stateOld = `  const [jobSubmitted, setJobSubmitted] = useState(false);
  const [jobContactName, setJobContactName] = useState('');
  const [jobContactEmail, setJobContactEmail] = useState('');
  const [wageContactName, setWageContactName] = useState('');
  const [wageContactEmail, setWageContactEmail] = useState('');`;
const stateNew = `  const [jobSubmitted, setJobSubmitted] = useState(false);`;
if (src.includes(stateOld)) src = src.replace(stateOld, () => stateNew);

// 2. Remove job board contact fields
const jobOld = `                      {/* CONTACT INFO — optional, private */}
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
const jobNew = `                      {/* Submit */}
                      {jobTrade && jobLocal && jobStatus && jobDate && (
                        <button onClick={handleJobSubmit} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 32px", borderRadius:50, border:"none", cursor:"pointer", marginTop:8}}>
                          {lang===\"es\" ? \"Enviar\" : lang===\"pl\" ? \"Wyslij\" : \"Submit Hot Spot\"}
                        </button>
                      )}`;
if (src.includes(jobOld)) src = src.replace(jobOld, () => jobNew);

// 3. Remove job board EmailJS submitter lines
const jobEmailOld = `                local_email: local.email || 'N/A',
                address: local.address || 'N/A',
                submitter_name: jobContactName || 'Not provided',
                submitter_email: jobContactEmail || 'Not provided',
              });`;
const jobEmailNew = `                local_email: local.email || 'N/A',
                address: local.address || 'N/A',
              });`;
if (src.includes(jobEmailOld)) src = src.replace(jobEmailOld, () => jobEmailNew);

// 4. Remove wage form contact fields
const wageOld = `                      {/* CONTACT INFO — optional, private */}
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

                      {wageMethod && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (`;
const wageNew = `                      {wageMethod && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (`;
if (src.includes(wageOld)) src = src.replace(wageOld, () => wageNew);

// 5. Remove wage EmailJS submitter lines
const wageEmailOld = `                  address: \`Contract valid through \${wageValidThrough || 'N/A'}\`,
                  submitter_name: wageContactName || 'Not provided',
                  submitter_email: wageContactEmail || 'Not provided',
                });`;
const wageEmailNew = `                  address: \`Contract valid through \${wageValidThrough || 'N/A'}\`,
                });`;
if (src.includes(wageEmailOld)) src = src.replace(wageEmailOld, () => wageEmailNew);

// 6. Remove wage reset contact lines
const resetOld = `            setWageValidThrough(''); setWageNotes('');
            setWageContactName(''); setWageContactEmail('');
          };`;
const resetNew = `            setWageValidThrough(''); setWageNotes('');
          };`;
if (src.includes(resetOld)) src = src.replace(resetOld, () => resetNew);

if (src === original) {
  console.error('ERROR: No changes made — fix160 changes may already be removed.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. fix160 changes reverted. Forms restored to pre-fix160 state.');
console.log('fix161 (template ID swap) is still in effect.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "revert: remove fix160 contact fields pending debug" && git push');
console.log('');
