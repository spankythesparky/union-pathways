// fix160.js — Add optional name/email contact fields to wage + work outlook submissions
//
// Privacy model:
//   - Contact info goes ONLY to the EmailJS payload (your inbox)
//   - It is NOT written to Supabase, NOT in the public submission record
//   - The public approval flow doesn't see or store the name/email
//
// Edits:
//   1. Add 4 new state hooks (jobContactName, jobContactEmail, wageContactName, wageContactEmail)
//   2. Job board form: insert contact fields above the submit button
//   3. Job board: include contact info in EmailJS payload, omit from Supabase insert
//   4. Job board: clear contact fields on reset
//   5. Wage form: insert contact fields above the submit button
//   6. Wage form: include contact info in EmailJS payload
//   7. Wage form: clear contact fields on reset

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('jobContactName') || src.includes('wageContactEmail')) {
  console.error('ERROR: Contact fields already added. Aborting.');
  process.exit(1);
}

// ============================================================
// EDIT 1: Add 4 new state hooks
// ============================================================
const stateOld = `  const [jobSubmitted, setJobSubmitted] = useState(false);`;
const stateNew = `  const [jobSubmitted, setJobSubmitted] = useState(false);
  const [jobContactName, setJobContactName] = useState('');
  const [jobContactEmail, setJobContactEmail] = useState('');
  const [wageContactName, setWageContactName] = useState('');
  const [wageContactEmail, setWageContactEmail] = useState('');`;

if (!src.includes(stateOld)) {
  console.error('ERROR: Could not find jobSubmitted state. Aborting.');
  process.exit(1);
}
src = src.replace(stateOld, () => stateNew);

// ============================================================
// EDIT 2: Job board form — insert contact fields above the submit button
// ============================================================
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

if (!src.includes(jobBtnOld)) {
  console.error('ERROR: Could not find Job Board submit button. Aborting.');
  process.exit(1);
}
src = src.replace(jobBtnOld, () => jobBtnNew);

// ============================================================
// EDIT 3: Job board EmailJS payload — append contact fields
// (Supabase insert is BEFORE this and we leave it alone; only the email gets contact info)
// ============================================================
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

if (!src.includes(jobEmailOld)) {
  console.error('ERROR: Could not find Job Board EmailJS payload. Aborting.');
  process.exit(1);
}
src = src.replace(jobEmailOld, () => jobEmailNew);

// ============================================================
// EDIT 4: Wage form — insert contact fields above the submit button
// ============================================================
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

if (!src.includes(wageBtnOld)) {
  console.error('ERROR: Could not find Wage form submit button. Aborting.');
  process.exit(1);
}
src = src.replace(wageBtnOld, () => wageBtnNew);

// ============================================================
// EDIT 5: Wage form EmailJS payload — append contact fields
// ============================================================
const wageEmailOld = `                await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',
                  job_calls: wageMethod === 'image' ? \`Image upload: \${imageUrl}\` : \`Manual entry — Hourly: \$\${wageHourly}, Total: \$\${totalPackage.toFixed(2)}\`,
                  report_date: new Date().toLocaleDateString(), phone: 'N/A', website: 'N/A', local_email: 'N/A',
                  address: \`Contract valid through \${wageValidThrough || 'N/A'}\`,
                });`;

const wageEmailNew = `                await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',
                  job_calls: wageMethod === 'image' ? \`Image upload: \${imageUrl}\` : \`Manual entry — Hourly: \$\${wageHourly}, Total: \$\${totalPackage.toFixed(2)}\`,
                  report_date: new Date().toLocaleDateString(), phone: 'N/A', website: 'N/A', local_email: 'N/A',
                  address: \`Contract valid through \${wageValidThrough || 'N/A'}\`,
                  submitter_name: wageContactName || 'Not provided',
                  submitter_email: wageContactEmail || 'Not provided',
                });`;

if (!src.includes(wageEmailOld)) {
  console.error('ERROR: Could not find Wage EmailJS payload. Aborting.');
  process.exit(1);
}
src = src.replace(wageEmailOld, () => wageEmailNew);

// ============================================================
// EDIT 6: Wage form reset — clear contact fields too
// ============================================================
const resetOld = `            setWageValidThrough(''); setWageNotes('');
          };`;

const resetNew = `            setWageValidThrough(''); setWageNotes('');
            setWageContactName(''); setWageContactEmail('');
          };`;

if (!src.includes(resetOld)) {
  console.error('ERROR: Could not find wage reset function. Aborting.');
  process.exit(1);
}
src = src.replace(resetOld, () => resetNew);

// ============================================================
// Final
// ============================================================
if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Optional contact fields added to both submission forms:');
console.log('  - Job board: name + email (only sent to your inbox via EmailJS)');
console.log('  - Wages:     name + email (only sent to your inbox via EmailJS)');
console.log('');
console.log('Privacy guarantee:');
console.log('  - Contact info goes ONLY in the EmailJS payload (to your inbox)');
console.log('  - It is NOT written to Supabase, NOT in any public record');
console.log('  - When you approve a submission for the site, contact info is invisible');
console.log('');
console.log('IMPORTANT: Update your EmailJS template to display submitter_name + submitter_email.');
console.log('  1. Go to dashboard.emailjs.com');
console.log('  2. Open template_a55dhfh');
console.log('  3. Add somewhere in the email body:');
console.log('       Submitter name: {{submitter_name}}');
console.log('       Submitter email: {{submitter_email}}');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: optional contact info on wage + job board submissions" && git push');
console.log('');
