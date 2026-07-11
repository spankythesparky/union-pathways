// fix89.js — Replace effective date with submission date, rename valid through, beef up disclaimer
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

// ============================================================
// 1. Replace Effective Date input block with submission date display
// ============================================================
const effectiveOld = `                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Fecha de Vigencia" : lang==="pl" ? "Data Obowiazywania" : "Effective Date"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>
                          <input type="date" value={wageEffectiveDate} onChange={e => setWageEffectiveDate(e.target.value)} style={inputStyle} />
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:6}}>
                            {lang==="es" ? "Cuando comenzo esta tarifa." : lang==="pl" ? "Kiedy zaczela obowiazywac ta stawka." : "When this rate started."}
                          </div>
                        </div>
                      )}`;

const effectiveNew = `                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Enviado a Union Pathways" : lang==="pl" ? "Zgloszone do Union Pathways" : "Submission to Union Pathways On"}</div>
                          <div style={{...inputStyle, opacity:0.7, cursor:"default", userSelect:"none"}}>
                            {new Date().toLocaleDateString(lang==="es" ? "es-ES" : lang==="pl" ? "pl-PL" : "en-US", { year:"numeric", month:"long", day:"numeric" })}
                          </div>
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:6}}>
                            {lang==="es" ? "Capturada automaticamente al enviar." : lang==="pl" ? "Zapisywana automatycznie przy zgloszeniu." : "Automatically captured when you submit."}
                          </div>
                        </div>
                      )}`;

code = replaceOnce(code, effectiveOld, effectiveNew, '1: effective date block');
console.log('1/8 ✓ Effective Date replaced with Submission On display');

// ============================================================
// 2. Rename Valid Through label
// ============================================================
code = replaceOnce(code,
  `<div style={labelStyle}>{lang==="es" ? "Salarios Validos Hasta" : lang==="pl" ? "Stawki Wazne Do" : "Wages Valid Through"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>`,
  `<div style={labelStyle}>{lang==="es" ? "Contrato Valido Hasta" : lang==="pl" ? "Umowa Wazna Do" : "Contract Valid Through"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>`,
  '2: Valid Through label');
console.log('2/8 ✓ Renamed to Contract Valid Through');

// ============================================================
// 3. Beef up top disclaimer
// ============================================================
code = replaceOnce(code,
  `{lang==="es" ? "Todos los salarios son enviados por miembros sindicales bajo un sistema de honor. Union Pathways no verifica esta informacion." : lang==="pl" ? "Wszystkie place sa przesylane przez czlonkow zwiazku w systemie honorowym. Union Pathways nie weryfikuje tych informacji." : "All wage data is submitted by union members on an honor system. Union Pathways does not verify this information. Always confirm directly with your local hall."}`,
  `<><strong style={{color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1}}>{lang==="es" ? "SISTEMA DE HONOR — " : lang==="pl" ? "SYSTEM HONOROWY — " : "HONOR SYSTEM — "}</strong>{lang==="es" ? "Todos los salarios son enviados por miembros del sindicato y NO son verificados por Union Pathways. Para tarifas finales y 100% precisas, siempre contacte directamente con su local sindical." : lang==="pl" ? "Wszystkie stawki sa przesylane przez czlonkow zwiazku i NIE sa weryfikowane przez Union Pathways. Aby uzyskac koncowe i w 100% dokladne stawki, zawsze skontaktuj sie bezposrednio ze swoim lokalem zwiazkowym." : "All wage data is submitted by union members and is NOT verified by Union Pathways. For final and 100% accurate rates, always contact your local hall directly."}</>`,
  '3: top disclaimer');
console.log('3/8 ✓ Top disclaimer beefed up');

// ============================================================
// 4. Add inline disclaimer when manual mode chosen and no file attached
// ============================================================
// Insert before the Notes section
code = replaceOnce(code,
  `                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Notas (opcional)" : lang==="pl" ? "Notatki (opcjonalne)" : "Notes (optional)"}</div>`,
  `                      {wageMethod === 'manual' && !wageImageFile && (
                        <div style={{padding:"14px 18px", background:"rgba(245,197,24,0.08)", border:"1px solid rgba(245,197,24,0.3)", borderRadius:12, display:"flex", gap:12, alignItems:"flex-start"}}>
                          <div style={{color:"#F5C518", fontSize:18, flexShrink:0}}>&#9888;</div>
                          <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.5}}>
                            {lang==="es" ? "Sin una hoja de salario adjunta, esta entrada es solo del sistema de honor. Siempre verifique con su local sindical para tarifas finales y 100% precisas." : lang==="pl" ? "Bez dolaczonej stawki, ten wpis jest tylko w systemie honorowym. Zawsze weryfikuj ze swoim lokalem aby uzyskac koncowe i w 100% dokladne stawki." : "Without a wage sheet attached, this entry is honor-system only. Always contact your local hall directly for final and 100% accurate rates."}
                          </div>
                        </div>
                      )}

                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Notas (opcional)" : lang==="pl" ? "Notatki (opcjonalne)" : "Notes (optional)"}</div>`,
  '4: manual disclaimer insert');
console.log('4/8 ✓ Inline manual-without-file disclaimer added');

// ============================================================
// 5. Update DB insert: drop effective_date
// ============================================================
code = replaceOnce(code,
  `effective_date: wageEffectiveDate || null, valid_through: wageValidThrough || null,`,
  `effective_date: null, valid_through: wageValidThrough || null,`,
  '5: DB insert effective null');
console.log('5/8 ✓ DB insert no longer uses effective date');

// ============================================================
// 6. Update email payload — use today's date for report_date, drop effective from address
// ============================================================
code = replaceOnce(code,
  `report_date: wageEffectiveDate || 'N/A', phone: 'N/A', website: 'N/A', local_email: 'N/A',`,
  `report_date: new Date().toLocaleDateString(), phone: 'N/A', website: 'N/A', local_email: 'N/A',`,
  '6a: email report_date');

const emailAddrOld = "address: `Effective ${wageEffectiveDate || 'N/A'} - Valid through ${wageValidThrough || 'N/A'}`,";
const emailAddrNew = "address: `Contract valid through ${wageValidThrough || 'N/A'}`,";
code = replaceOnce(code, emailAddrOld, emailAddrNew, '6b: email address');
console.log('6/8 ✓ Email payload updated');

// ============================================================
// 7. ApprovedWageCard labels: add 'submitted', rename 'validThrough', and update date row
// ============================================================
// English labels
code = replaceOnce(code,
  `en: { hourly:'Hourly', hw:'Health & Welfare', dpension:'Defined Pension', cpension:'Contribution Pension/Annuity', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'IUOE Training', dues:'Working Dues', total:'Total Package', effective:'Effective:', validThrough:'Valid Through:', viewSheet:'View Wage Sheet', expired:'EXPIRED', viewBreakdown:'View Breakdown', hideBreakdown:'Hide Breakdown', notes:'Notes:' },`,
  `en: { hourly:'Hourly', hw:'Health & Welfare', dpension:'Defined Pension', cpension:'Contribution Pension/Annuity', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'IUOE Training', dues:'Working Dues', total:'Total Package', effective:'Effective:', validThrough:'Contract Valid Through:', submitted:'Submitted to Union Pathways:', viewSheet:'View Wage Sheet', expired:'EXPIRED', viewBreakdown:'View Breakdown', hideBreakdown:'Hide Breakdown', notes:'Notes:' },`,
  '7a: en labels');

// Spanish
code = replaceOnce(code,
  `es: { hourly:'Por Hora', hw:'Salud y Bienestar', dpension:'Pension Definida', cpension:'Pension de Contribucion/Anualidad', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Entrenamiento IUOE', dues:'Cuotas de Trabajo', total:'Paquete Total', effective:'Vigente:', validThrough:'Valido Hasta:', viewSheet:'Ver Hoja de Salario', expired:'EXPIRADO', viewBreakdown:'Ver Desglose', hideBreakdown:'Ocultar Desglose', notes:'Notas:' },`,
  `es: { hourly:'Por Hora', hw:'Salud y Bienestar', dpension:'Pension Definida', cpension:'Pension de Contribucion/Anualidad', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Entrenamiento IUOE', dues:'Cuotas de Trabajo', total:'Paquete Total', effective:'Vigente:', validThrough:'Contrato Valido Hasta:', submitted:'Enviado a Union Pathways:', viewSheet:'Ver Hoja de Salario', expired:'EXPIRADO', viewBreakdown:'Ver Desglose', hideBreakdown:'Ocultar Desglose', notes:'Notas:' },`,
  '7b: es labels');

// Polish
code = replaceOnce(code,
  `pl: { hourly:'Godzinowo', hw:'Zdrowie i Opieka', dpension:'Emerytura', cpension:'Emerytura Skladkowa', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Szkolenie IUOE', dues:'Skladki', total:'Pakiet Calkowity', effective:'Obowiazuje od:', validThrough:'Wazne Do:', viewSheet:'Zobacz Stawke', expired:'WYGASLO', viewBreakdown:'Pokaz Szczegoly', hideBreakdown:'Ukryj Szczegoly', notes:'Notatki:' },`,
  `pl: { hourly:'Godzinowo', hw:'Zdrowie i Opieka', dpension:'Emerytura', cpension:'Emerytura Skladkowa', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Szkolenie IUOE', dues:'Skladki', total:'Pakiet Calkowity', effective:'Obowiazuje od:', validThrough:'Umowa Wazna Do:', submitted:'Zgloszone do Union Pathways:', viewSheet:'Zobacz Stawke', expired:'WYGASLO', viewBreakdown:'Pokaz Szczegoly', hideBreakdown:'Ukryj Szczegoly', notes:'Notatki:' },`,
  '7c: pl labels');

// Date row in card
code = replaceOnce(code,
  `        {r.effective_date && <span><strong>{L.effective}</strong> {fmtDate(r.effective_date)}</span>}
        {r.valid_through && <span><strong>{L.validThrough}</strong> {fmtDate(r.valid_through)}</span>}`,
  `        {r.created_at && <span><strong>{L.submitted}</strong> {fmtDate(r.created_at)}</span>}
        {r.valid_through && <span><strong>{L.validThrough}</strong> {fmtDate(r.valid_through)}</span>}`,
  '7d: card date row');
console.log('7/8 ✓ ApprovedWageCard labels and dates updated');

// ============================================================
// 8. Update admin display: drop Effective from wage row
// ============================================================
const adminOld = "{adminSection === 'wages' ? `Effective: ${r.effective_date || 'N/A'} · Valid through: ${r.valid_through || 'N/A'}` : `Report Date: ${r.report_date}`}";
const adminNew = "{adminSection === 'wages' ? `Contract Valid Through: ${r.valid_through || 'N/A'}` : `Report Date: ${r.report_date}`}";
code = replaceOnce(code, adminOld, adminNew, '8: admin date row');
console.log('8/8 ✓ Admin display dropped Effective field');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: submission date + contract valid through + honor disclaimer" && git push\n');
