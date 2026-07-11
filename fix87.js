// fix87.js — Make Wages dates optional + allow optional image upload in manual mode
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// 1. Remove date requirements from handleWageSubmit
code = replaceOnce(code,
  "if (!wageTrade || !wageLocal || !wageMethod || !wageEffectiveDate || !wageValidThrough) return;",
  "if (!wageTrade || !wageLocal || !wageMethod) return;",
  '1: handleWageSubmit validation');
console.log('1/9 ✓ Removed date requirements from validation');

// 2. Make image upload work in manual mode too (remove method gate)
code = replaceOnce(code,
  "if (wageMethod === 'image' && wageImageFile) {",
  "if (wageImageFile) {",
  '2: image upload condition');
console.log('2/9 ✓ Image upload no longer gated by method');

// 3. Effective Date label — add (optional)
code = replaceOnce(code,
  '<div style={labelStyle}>{lang==="es" ? "Fecha de Vigencia" : lang==="pl" ? "Data Obowiazywania" : "Effective Date"}</div>',
  '<div style={labelStyle}>{lang==="es" ? "Fecha de Vigencia" : lang==="pl" ? "Data Obowiazywania" : "Effective Date"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>',
  '3: Effective Date label');
console.log('3/9 ✓ Effective Date marked optional');

// 4. Valid Through label — add (optional)
code = replaceOnce(code,
  '<div style={labelStyle}>{lang==="es" ? "Salarios Validos Hasta" : lang==="pl" ? "Stawki Wazne Do" : "Wages Valid Through"}</div>',
  '<div style={labelStyle}>{lang==="es" ? "Salarios Validos Hasta" : lang==="pl" ? "Stawki Wazne Do" : "Wages Valid Through"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>',
  '4: Valid Through label');
console.log('4/9 ✓ Valid Through marked optional');

// 5. Submit button gate — remove date requirement
code = replaceOnce(code,
  "{wageMethod && wageEffectiveDate && wageValidThrough && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (",
  "{wageMethod && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (",
  '5: submit button gate');
console.log('5/9 ✓ Submit button no longer requires dates');

// 6. Insert dates as null if empty
code = replaceOnce(code,
  "effective_date: wageEffectiveDate, valid_through: wageValidThrough,",
  "effective_date: wageEffectiveDate || null, valid_through: wageValidThrough || null,",
  '6: insert null dates');
console.log('6/9 ✓ Insert handles empty dates');

// 7. Email send — handle empty dates gracefully
code = replaceOnce(code,
  "report_date: wageEffectiveDate, phone: 'N/A', website: 'N/A', local_email: 'N/A',",
  "report_date: wageEffectiveDate || 'N/A', phone: 'N/A', website: 'N/A', local_email: 'N/A',",
  '7a: email report_date');

// Use string concatenation to avoid template literal issues in Node
const emailAddrOld = "address: `Effective ${wageEffectiveDate} - Valid through ${wageValidThrough}`,";
const emailAddrNew = "address: `Effective ${wageEffectiveDate || 'N/A'} - Valid through ${wageValidThrough || 'N/A'}`,";
code = replaceOnce(code, emailAddrOld, emailAddrNew, '7b: email address');
console.log('7/9 ✓ Email handles empty dates');

// 8. Admin card display — handle null dates
const adminDisplayOld = "{adminSection === 'wages' ? `Effective: ${r.effective_date} · Valid through: ${r.valid_through}` : `Report Date: ${r.report_date}`}";
const adminDisplayNew = "{adminSection === 'wages' ? `Effective: ${r.effective_date || 'N/A'} · Valid through: ${r.valid_through || 'N/A'}` : `Report Date: ${r.report_date}`}";
code = replaceOnce(code, adminDisplayOld, adminDisplayNew, '8: admin date display');
console.log('8/9 ✓ Admin handles null dates');

// 9. Add optional file upload to manual mode (after Total Package, before closing </>)
const manualEndAnchor = `                          {wageHourly && (
                            <div style={{padding:"16px 20px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#22c55e", letterSpacing:1, textTransform:"uppercase"}}>
                                {lang==="es" ? "Paquete Total" : lang==="pl" ? "Pakiet Calkowity" : "Total Package"}
                              </div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#22c55e"}}>
                                \${totalPackage.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </>`;

const manualEndReplacement = `                          {wageHourly && (
                            <div style={{padding:"16px 20px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#22c55e", letterSpacing:1, textTransform:"uppercase"}}>
                                {lang==="es" ? "Paquete Total" : lang==="pl" ? "Pakiet Calkowity" : "Total Package"}
                              </div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#22c55e"}}>
                                \${totalPackage.toFixed(2)}
                              </div>
                            </div>
                          )}

                          <div>
                            <div style={labelStyle}>{lang==="es" ? "Adjuntar Hoja de Salario" : lang==="pl" ? "Dolacz Plik ze Stawka" : "Attach Wage Sheet"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>
                            <input type="file" accept="image/*,application/pdf" onChange={e => setWageImageFile(e.target.files[0])} style={{...inputStyle, cursor:"pointer", padding:"10px 12px"}} />
                            {wageImageFile && <div style={{fontSize:12, color:"var(--muted)", marginTop:6}}>✓ {wageImageFile.name} ({(wageImageFile.size/1024/1024).toFixed(2)} MB)</div>}
                            <div style={{fontSize:11, color:"var(--muted)", marginTop:8, lineHeight:1.4}}>
                              {lang==="es" ? "Opcional: adjunta una foto o PDF como respaldo." : lang==="pl" ? "Opcjonalne: dolacz zdjecie lub PDF jako dowod." : "Optional: attach a photo or PDF as backup verification."}
                            </div>
                          </div>
                        </>`;

code = replaceOnce(code, manualEndAnchor, manualEndReplacement, '9: manual mode optional upload');
console.log('9/9 ✓ Added optional image upload to manual mode');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: optional dates + optional image in manual wages" && git push\n');
