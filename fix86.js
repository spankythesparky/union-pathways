// fix86.js — Add Wages page with image/PDF upload + manual entry + admin approval
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error(`ERROR: anchor not found for "${label}"`);
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error(`ERROR: anchor matches more than once for "${label}"`);
    process.exit(1);
  }
  return haystack.replace(needle, () => replacement);
}

// ============================================================
// 1. ADD WAGE STATE VARIABLES
// ============================================================
code = replaceOnce(code,
  `  const [jobSubmitted, setJobSubmitted] = useState(false);`,
  `  const [jobSubmitted, setJobSubmitted] = useState(false);
  const [wageTrade, setWageTrade] = useState('');
  const [wageLocal, setWageLocal] = useState('');
  const [wageMethod, setWageMethod] = useState('');
  const [wageImageFile, setWageImageFile] = useState(null);
  const [wageHourly, setWageHourly] = useState('');
  const [wageHW, setWageHW] = useState('');
  const [wageDefinedPension, setWageDefinedPension] = useState('');
  const [wageContribPension, setWageContribPension] = useState('');
  const [wage401k, setWage401k] = useState('');
  const [wageNEBF, setWageNEBF] = useState('');
  const [wageCIPF, setWageCIPF] = useState('');
  const [wageIUOETraining, setWageIUOETraining] = useState('');
  const [wageWorkingDues, setWageWorkingDues] = useState('');
  const [wageEffectiveDate, setWageEffectiveDate] = useState('');
  const [wageValidThrough, setWageValidThrough] = useState('');
  const [wageNotes, setWageNotes] = useState('');
  const [wageSubmitted, setWageSubmitted] = useState(false);
  const [wageUploading, setWageUploading] = useState(false);`,
  'wage state variables');
console.log('1/9 ✓ Added wage state variables');

// ============================================================
// 2. ADD WAGES TO URL ROUTER WHITELIST
// ============================================================
code = replaceOnce(code,
  `const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','retirement','health','benefits','about','contact','jobboard'];`,
  `const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','retirement','health','benefits','about','contact','jobboard','wages'];`,
  'URL router whitelist');
console.log('2/9 ✓ Added /wages to URL router');

// ============================================================
// 3. ADD WAGES NAV LINK
// ============================================================
code = replaceOnce(code,
  `            <button className={\`nav-link \${page==="jobboard"?"active":""}\`} onClick={() => setPage("jobboard")}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>`,
  `            <button className={\`nav-link \${page==="jobboard"?"active":""}\`} onClick={() => setPage("jobboard")}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>
            <button className={\`nav-link \${page==="wages"?"active":""}\`} onClick={() => setPage("wages")}>{lang==="es" ? "Salarios" : lang==="pl" ? "Place" : "Wages"}</button>`,
  'wages nav link');
console.log('3/9 ✓ Added Wages nav link');

// ============================================================
// 4. ADD APPROVED WAGE CARD + FEED COMPONENTS
// ============================================================
const wageComponents = `
// ── APPROVED WAGE CARD ──────────────────────────────────────
function ApprovedWageCard({ r, lang }) {
  const [open, setOpen] = useState(false);
  const isExpired = r.valid_through && new Date(r.valid_through) < new Date();
  const fmt = (n) => {
    if (n === null || n === undefined || n === '') return null;
    const num = parseFloat(n);
    if (isNaN(num)) return null;
    return '$' + num.toFixed(2);
  };
  const fmtDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); }
    catch { return d; }
  };
  const labels = {
    en: { hourly:'Hourly', hw:'Health & Welfare', dpension:'Defined Pension', cpension:'Contribution Pension/Annuity', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'IUOE Training', dues:'Working Dues', total:'Total Package', effective:'Effective:', validThrough:'Valid Through:', viewSheet:'View Wage Sheet', expired:'EXPIRED', viewBreakdown:'View Breakdown', hideBreakdown:'Hide Breakdown', notes:'Notes:' },
    es: { hourly:'Por Hora', hw:'Salud y Bienestar', dpension:'Pension Definida', cpension:'Pension de Contribucion/Anualidad', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Entrenamiento IUOE', dues:'Cuotas de Trabajo', total:'Paquete Total', effective:'Vigente:', validThrough:'Valido Hasta:', viewSheet:'Ver Hoja de Salario', expired:'EXPIRADO', viewBreakdown:'Ver Desglose', hideBreakdown:'Ocultar Desglose', notes:'Notas:' },
    pl: { hourly:'Godzinowo', hw:'Zdrowie i Opieka', dpension:'Emerytura', cpension:'Emerytura Skladkowa', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Szkolenie IUOE', dues:'Skladki', total:'Pakiet Calkowity', effective:'Obowiazuje od:', validThrough:'Wazne Do:', viewSheet:'Zobacz Stawke', expired:'WYGASLO', viewBreakdown:'Pokaz Szczegoly', hideBreakdown:'Ukryj Szczegoly', notes:'Notatki:' },
  };
  const L = labels[lang] || labels.en;

  const breakdown = [
    { key:'hourly', val:r.hourly },
    { key:'hw', val:r.health_welfare },
    { key:'dpension', val:r.defined_pension },
    { key:'cpension', val:r.contribution_pension },
    { key:'k401', val:r.k401 },
    { key:'nebf', val:r.nebf },
    { key:'cipf', val:r.cipf },
    { key:'iuoe', val:r.iuoe_training },
    { key:'dues', val:r.working_dues },
  ].filter(x => fmt(x.val) !== null);

  return (
    <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:20, opacity: isExpired ? 0.6 : 1}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:8}}>
        <div style={{flex:1, minWidth:180}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2}}>{r.local_name}</div>
          <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>{r.city}, {r.state} · {r.trade}</div>
        </div>
        {isExpired && (
          <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(239,68,68,0.15)", color:"#ef4444", fontSize:11, fontWeight:900, letterSpacing:1, fontFamily:"'Barlow Condensed',sans-serif"}}>{L.expired}</div>
        )}
      </div>

      <div style={{display:"flex", gap:24, marginTop:12, marginBottom:12, flexWrap:"wrap"}}>
        {fmt(r.hourly) && (
          <div>
            <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L.hourly}</div>
            <div style={{fontSize:24, fontWeight:900, color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif"}}>{fmt(r.hourly)}</div>
          </div>
        )}
        {fmt(r.total_package) && (
          <div>
            <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L.total}</div>
            <div style={{fontSize:24, fontWeight:900, color:"#22c55e", fontFamily:"'Barlow Condensed',sans-serif"}}>{fmt(r.total_package)}</div>
          </div>
        )}
      </div>

      <div style={{display:"flex", gap:16, fontSize:11, color:"var(--muted)", marginTop:8, flexWrap:"wrap"}}>
        {r.effective_date && <span><strong>{L.effective}</strong> {fmtDate(r.effective_date)}</span>}
        {r.valid_through && <span><strong>{L.validThrough}</strong> {fmtDate(r.valid_through)}</span>}
      </div>

      {(breakdown.length > 0 || r.image_url || r.notes) && (
        <button onClick={() => setOpen(!open)} style={{marginTop:14, background:"rgba(250,128,89,0.08)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:10, padding:"8px 14px", color:"#FA8059", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:"uppercase"}}>
          {open ? L.hideBreakdown : L.viewBreakdown}
        </button>
      )}

      {open && (
        <div style={{marginTop:14, padding:16, background:"rgba(0,0,0,0.25)", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)"}}>
          {breakdown.length > 0 && (
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12, marginBottom: r.image_url || r.notes ? 14 : 0}}>
              {breakdown.map(({key, val}) => (
                <div key={key}>
                  <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L[key]}</div>
                  <div style={{fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", marginTop:2}}>{fmt(val)}</div>
                </div>
              ))}
            </div>
          )}
          {r.notes && (
            <div style={{marginBottom: r.image_url ? 14 : 0}}>
              <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", marginBottom:4}}>{L.notes}</div>
              <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.5}}>{r.notes}</div>
            </div>
          )}
          {r.image_url && (
            <a href={r.image_url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block", padding:"8px 16px", background:"#F5C518", color:"#000", textDecoration:"none", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1, textTransform:"uppercase"}}>
              📄 {L.viewSheet}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── APPROVED WAGES FEED ────────────────────────────────────
function ApprovedWagesFeed({ lang }) {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const [activeTrade, setActiveTrade] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sb = await getSupabase();
        const { data, error } = await sb
          .from('wage_submissions')
          .select('*')
          .eq('approved', true)
          .order('effective_date', { ascending: false })
          .limit(200);
        if (cancelled) return;
        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load approved wages:', err);
        if (!cancelled) setError(err.message || 'Failed to load wages');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)"}}>
          {lang==="es" ? "Error al cargar salarios" : lang==="pl" ? "Blad ladowania plac" : "Error loading wages"}
        </div>
      </div>
    );
  }

  if (reports === null) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)"}}>
          {lang==="es" ? "Cargando..." : lang==="pl" ? "Ladowanie..." : "Loading..."}
        </div>
      </div>
    );
  }

  const tradeCounts = reports.reduce((acc, r) => {
    const t = r.trade || 'Unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const tradeList = Object.keys(tradeCounts).sort();
  const visible = activeTrade === 'all' ? reports : reports.filter(r => r.trade === activeTrade);
  const allLabel = lang === 'es' ? 'Todos' : lang === 'pl' ? 'Wszystkie' : 'All Trades';
  const tabStyle = (active) => ({
    padding: "8px 16px",
    background: active ? '#F5C518' : 'rgba(255,255,255,0.06)',
    color: active ? '#000' : '#fff',
    border: 'none',
    borderRadius: 999,
    fontFamily: "'Barlow Condensed',sans-serif",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 1,
    cursor: 'pointer',
    textTransform: 'uppercase',
  });

  return (
    <div>
      <div style={{display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <button onClick={() => setActiveTrade('all')} style={tabStyle(activeTrade === 'all')}>
          {allLabel} <span style={{opacity:0.7, marginLeft:4}}>({reports.length})</span>
        </button>
        {tradeList.map(trade => (
          <button key={trade} onClick={() => setActiveTrade(trade)} style={tabStyle(activeTrade === trade)}>
            {trade} <span style={{opacity:0.7, marginLeft:4}}>({tradeCounts[trade]})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", marginBottom:8}}>
            {lang==="es" ? "No hay salarios en esta categoria" : lang==="pl" ? "Brak plac w tej kategorii" : "No wages in this category yet"}
          </div>
        </div>
      ) : (
        <div style={{display:"grid", gap:16}}>
          {visible.map(r => (
            <ApprovedWageCard key={r.id} r={r} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

`;

code = replaceOnce(code,
  `export default function UnionPathway()`,
  wageComponents + `export default function UnionPathway()`,
  'export anchor for wage components');
console.log('4/9 ✓ Added ApprovedWageCard + ApprovedWagesFeed');

// ============================================================
// 5. ADD WAGES PAGE BLOCK (before veterans page)
// ============================================================
const wagesPageBlock = `        {page === "wages" && (() => {
          const WAGE_TRADES = [
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
          const isIBEW = wageTrade === 'IBEW_I' || wageTrade === 'IBEW_L';
          const isIUOE = wageTrade === 'IUOE';
          const wageLocals = WAGE_TRADES.find(t => t.key === wageTrade)?.locals || [];
          const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
          const totalPackage = num(wageHourly) + num(wageHW) + num(wageDefinedPension) + num(wageContribPension) + num(wage401k) + (isIBEW ? num(wageNEBF) : 0) + (isIUOE ? num(wageCIPF) + num(wageIUOETraining) : 0);

          const handleWageSubmit = async () => {
            if (!wageTrade || !wageLocal || !wageMethod || !wageEffectiveDate || !wageValidThrough) return;
            if (wageMethod === 'image' && !wageImageFile) return;
            if (wageMethod === 'manual' && !wageHourly) return;
            const local = wageLocals.find(l => String(l.id) === String(wageLocal));
            if (!local) return;
            const tradeName = WAGE_TRADES.find(t => t.key === wageTrade)?.label || wageTrade;
            setWageUploading(true);
            try {
              const sb = await getSupabase();
              let imageUrl = null;
              if (wageMethod === 'image' && wageImageFile) {
                const ext = (wageImageFile.name.split('.').pop() || 'bin').toLowerCase();
                const fileName = \`\${Date.now()}_\${Math.random().toString(36).slice(2, 10)}.\${ext}\`;
                const { error: upErr } = await sb.storage.from('wage-sheets').upload(fileName, wageImageFile, { contentType: wageImageFile.type });
                if (upErr) throw upErr;
                const { data: urlData } = sb.storage.from('wage-sheets').getPublicUrl(fileName);
                imageUrl = urlData.publicUrl;
              }
              await sb.from('wage_submissions').insert({
                trade: tradeName, local_name: local.name, local_id: String(local.id), city: local.city, state: local.state,
                classification: 'Journeyman', submission_method: wageMethod, image_url: imageUrl,
                hourly: wageMethod === 'manual' ? num(wageHourly) || null : null,
                health_welfare: wageMethod === 'manual' ? num(wageHW) || null : null,
                defined_pension: wageMethod === 'manual' ? num(wageDefinedPension) || null : null,
                contribution_pension: wageMethod === 'manual' ? num(wageContribPension) || null : null,
                k401: wageMethod === 'manual' ? num(wage401k) || null : null,
                nebf: wageMethod === 'manual' && isIBEW ? num(wageNEBF) || null : null,
                cipf: wageMethod === 'manual' && isIUOE ? num(wageCIPF) || null : null,
                iuoe_training: wageMethod === 'manual' && isIUOE ? num(wageIUOETraining) || null : null,
                working_dues: wageMethod === 'manual' ? num(wageWorkingDues) || null : null,
                total_package: wageMethod === 'manual' ? totalPackage || null : null,
                effective_date: wageEffectiveDate, valid_through: wageValidThrough,
                notes: wageNotes || null, approved: false,
              });
              if (!window.emailjs) {
                await new Promise((resolve) => {
                  const script = document.createElement('script');
                  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                  script.onload = resolve;
                  document.head.appendChild(script);
                });
                window.emailjs.init('J8FxG05UtYq-sWLNT');
              }
              try {
                await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',
                  job_calls: wageMethod === 'image' ? \`Image upload: \${imageUrl}\` : \`Manual entry — Hourly: $\${wageHourly}, Total: $\${totalPackage.toFixed(2)}\`,
                  report_date: wageEffectiveDate, phone: 'N/A', website: 'N/A', local_email: 'N/A',
                  address: \`Effective \${wageEffectiveDate} - Valid through \${wageValidThrough}\`,
                });
              } catch (emailErr) { console.warn('Email failed (non-fatal):', emailErr); }
              setWageSubmitted(true);
            } catch (err) {
              console.error('Wage submission error:', err);
              alert('Submission failed: ' + (err.message || 'Please try again.'));
            } finally { setWageUploading(false); }
          };

          const resetWageForm = () => {
            setWageSubmitted(false); setWageTrade(''); setWageLocal(''); setWageMethod('');
            setWageImageFile(null); setWageHourly(''); setWageHW(''); setWageDefinedPension('');
            setWageContribPension(''); setWage401k(''); setWageNEBF(''); setWageCIPF('');
            setWageIUOETraining(''); setWageWorkingDues(''); setWageEffectiveDate('');
            setWageValidThrough(''); setWageNotes('');
          };

          const labelStyle = {fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8};
          const inputStyle = {width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", boxSizing:"border-box"};
          const moneyField = (label, value, setter, optional = false) => (
            <div>
              <div style={labelStyle}>{label}{optional && <span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>(optional)</span>}</div>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--muted)", fontSize:14, pointerEvents:"none"}}>$</span>
                <input type="number" step="0.01" min="0" value={value} onChange={e => setter(e.target.value)} placeholder="0.00" style={{...inputStyle, paddingLeft:28}} />
              </div>
            </div>
          );

          return (
            <div>
              <div className="history-hero">
                <div className="history-eyebrow">{lang==="es" ? "Salarios Verificados por Miembros" : lang==="pl" ? "Stawki Potwierdzone przez Czlonkow" : "Wages Verified by Members"}</div>
                <h1 className="history-title">
                  {lang==="es" ? <>{"Salarios "}<span className="accent">{"de Locales"}</span></> : lang==="pl" ? <>{"Place "}<span className="accent">{"Lokalne"}</span></> : <>{"Local "}<span className="accent">{"Wages"}</span></>}
                </h1>
                <p className="history-subtitle">
                  {lang==="es" ? "Tarifas de jornaleros enviadas por miembros del sindicato. Verifica siempre con tu local antes de tomar decisiones." : lang==="pl" ? "Stawki czeladnikow przeslane przez czlonkow zwiazku. Zawsze weryfikuj ze swoim lokalem." : "Journeyman rates submitted by union members. Always verify with your local before making career decisions."}
                </p>
              </div>

              <div style={{maxWidth:900, margin:"0 auto", padding:"0 24px 80px"}}>

                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:14, padding:"16px 20px", marginBottom:40, display:"flex", gap:12, alignItems:"flex-start"}}>
                  <div style={{color:"#FA8059", fontSize:18, flexShrink:0}}>&#9888;</div>
                  <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>
                    {lang==="es" ? "Todos los salarios son enviados por miembros sindicales bajo un sistema de honor. Union Pathways no verifica esta informacion." : lang==="pl" ? "Wszystkie place sa przesylane przez czlonkow zwiazku w systemie honorowym. Union Pathways nie weryfikuje tych informacji." : "All wage data is submitted by union members on an honor system. Union Pathways does not verify this information. Always confirm directly with your local hall."}
                  </div>
                </div>

                <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"32px", marginBottom:40}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:24}}>
                    {lang==="es" ? "Enviar Salarios de tu Local" : lang==="pl" ? "Zglos Stawki Twojego Lokalu" : "Submit Your Local's Wages"}
                  </div>

                  {wageSubmitted ? (
                    <div style={{textAlign:"center", padding:"40px 0"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059", marginBottom:12}}>
                        {lang==="es" ? "Salario Enviado!" : lang==="pl" ? "Stawka Wyslana!" : "Wages Submitted!"}
                      </div>
                      <div style={{fontSize:14, color:"var(--muted)", marginBottom:24}}>
                        {lang==="es" ? "Tu informacion esta siendo revisada. Una vez aprobada aparecera aqui." : lang==="pl" ? "Twoja informacja jest sprawdzana. Po zatwierdzeniu pojawi sie tutaj." : "Your wage info is under review. Once approved it will appear here."}
                      </div>
                      <button onClick={resetWageForm} style={{background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"10px 24px", color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer"}}>
                        {lang==="es" ? "Enviar Otro" : lang==="pl" ? "Wyslij Kolejny" : "Submit Another"}
                      </button>
                    </div>
                  ) : (
                    <div style={{display:"flex", flexDirection:"column", gap:20}}>

                      <div>
                        <div style={labelStyle}>{lang==="es" ? "Oficio" : lang==="pl" ? "Zawod" : "Trade"}</div>
                        <select value={wageTrade} onChange={e => { setWageTrade(e.target.value); setWageLocal(''); }} style={{...inputStyle, cursor:"pointer", color: wageTrade ? "#fff" : "var(--muted)"}}>
                          <option value="">{lang==="es" ? "Selecciona tu oficio..." : lang==="pl" ? "Wybierz zawod..." : "Select your trade..."}</option>
                          {WAGE_TRADES.map(t => <option key={t.key} value={t.key} style={{background:"#0a1628"}}>{t.label}</option>)}
                        </select>
                      </div>

                      {wageTrade && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Local Sindical" : lang==="pl" ? "Lokal Zwiazku" : "Union Local"}</div>
                          <select value={wageLocal} onChange={e => setWageLocal(e.target.value)} style={{...inputStyle, cursor:"pointer", color: wageLocal ? "#fff" : "var(--muted)"}}>
                            <option value="">{lang==="es" ? "Selecciona tu local..." : lang==="pl" ? "Wybierz lokal..." : "Select your local..."}</option>
                            {[...wageLocals].sort((a,b) => { const numA = parseInt(String(a.id).match(/\\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\\d+/)?.[0] || '0', 10); return numA - numB; }).map(l => <option key={l.id} value={l.id} style={{background:"#0a1628"}}>{l.name} — {l.city}, {l.state}</option>)}
                          </select>
                        </div>
                      )}

                      {wageLocal && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Metodo de Envio" : lang==="pl" ? "Metoda Zgloszenia" : "Submission Method"}</div>
                          <div style={{display:"flex", gap:10}}>
                            <button onClick={() => setWageMethod('image')} style={{flex:1, padding:"14px 12px", borderRadius:12, border: wageMethod==='image' ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.08)", background: wageMethod==='image' ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center"}}>
                              <div style={{fontSize:24, marginBottom:4}}>📄</div>
                              <div style={{fontSize:13, fontWeight:700, color: wageMethod==='image' ? "#FA8059" : "#fff"}}>{lang==="es" ? "Subir Hoja" : lang==="pl" ? "Prześlij Plik" : "Upload Wage Sheet"}</div>
                              <div style={{fontSize:11, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "Foto o PDF" : lang==="pl" ? "Zdjecie lub PDF" : "Photo or PDF"}</div>
                            </button>
                            <button onClick={() => setWageMethod('manual')} style={{flex:1, padding:"14px 12px", borderRadius:12, border: wageMethod==='manual' ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.08)", background: wageMethod==='manual' ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center"}}>
                              <div style={{fontSize:24, marginBottom:4}}>⌨️</div>
                              <div style={{fontSize:13, fontWeight:700, color: wageMethod==='manual' ? "#FA8059" : "#fff"}}>{lang==="es" ? "Ingresar Manual" : lang==="pl" ? "Wprowadz Recznie" : "Enter Manually"}</div>
                              <div style={{fontSize:11, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "Escribir cifras" : lang==="pl" ? "Wpisz kwoty" : "Type the numbers"}</div>
                            </button>
                          </div>
                        </div>
                      )}

                      {wageMethod === 'image' && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Hoja de Salario" : lang==="pl" ? "Plik ze Stawka" : "Wage Sheet File"}</div>
                          <input type="file" accept="image/*,application/pdf" onChange={e => setWageImageFile(e.target.files[0])} style={{...inputStyle, cursor:"pointer", padding:"10px 12px"}} />
                          {wageImageFile && <div style={{fontSize:12, color:"var(--muted)", marginTop:6}}>✓ {wageImageFile.name} ({(wageImageFile.size/1024/1024).toFixed(2)} MB)</div>}
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:8, lineHeight:1.4}}>
                            {lang==="es" ? "Sube una foto clara o PDF de tu hoja de salario actual. Maximo 50 MB." : lang==="pl" ? "Prześlij wyrazne zdjecie lub PDF stawki. Maksymalnie 50 MB." : "Upload a clear photo or PDF of your current wage sheet. Max 50 MB."}
                          </div>
                        </div>
                      )}

                      {wageMethod === 'manual' && (
                        <>
                          {moneyField(lang==="es" ? "Por Hora" : lang==="pl" ? "Godzinowo" : "Hourly", wageHourly, setWageHourly)}
                          {moneyField(lang==="es" ? "Salud y Bienestar" : lang==="pl" ? "Zdrowie i Opieka" : "Health & Welfare", wageHW, setWageHW, true)}
                          {moneyField(lang==="es" ? "Pension Definida" : lang==="pl" ? "Emerytura Definiowana" : "Defined Pension", wageDefinedPension, setWageDefinedPension, true)}
                          {moneyField(lang==="es" ? "Pension de Contribucion / Anualidad" : lang==="pl" ? "Emerytura Skladkowa / Renta" : "Contribution Pension / Annuity", wageContribPension, setWageContribPension, true)}
                          {moneyField("401(k)", wage401k, setWage401k, true)}
                          {isIBEW && moneyField("NEBF", wageNEBF, setWageNEBF, true)}
                          {isIUOE && moneyField("CIPF", wageCIPF, setWageCIPF, true)}
                          {isIUOE && moneyField(lang==="es" ? "Entrenamiento IUOE" : lang==="pl" ? "Szkolenie IUOE" : "IUOE National Training Fund", wageIUOETraining, setWageIUOETraining, true)}
                          {moneyField(lang==="es" ? "Cuotas de Trabajo" : lang==="pl" ? "Skladki Pracownicze" : "Working Dues", wageWorkingDues, setWageWorkingDues, true)}

                          {wageHourly && (
                            <div style={{padding:"16px 20px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#22c55e", letterSpacing:1, textTransform:"uppercase"}}>
                                {lang==="es" ? "Paquete Total" : lang==="pl" ? "Pakiet Calkowity" : "Total Package"}
                              </div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#22c55e"}}>
                                \${totalPackage.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Fecha de Vigencia" : lang==="pl" ? "Data Obowiazywania" : "Effective Date"}</div>
                          <input type="date" value={wageEffectiveDate} onChange={e => setWageEffectiveDate(e.target.value)} style={inputStyle} />
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:6}}>
                            {lang==="es" ? "Cuando comenzo esta tarifa." : lang==="pl" ? "Kiedy zaczela obowiazywac ta stawka." : "When this rate started."}
                          </div>
                        </div>
                      )}

                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Salarios Validos Hasta" : lang==="pl" ? "Stawki Wazne Do" : "Wages Valid Through"}</div>
                          <input type="date" value={wageValidThrough} onChange={e => setWageValidThrough(e.target.value)} style={inputStyle} />
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:6}}>
                            {lang==="es" ? "Cuando expira el contrato actual." : lang==="pl" ? "Kiedy wygasa obecna umowa." : "When the current contract expires."}
                          </div>
                        </div>
                      )}

                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Notas (opcional)" : lang==="pl" ? "Notatki (opcjonalne)" : "Notes (optional)"}</div>
                          <textarea value={wageNotes} onChange={e => setWageNotes(e.target.value)} placeholder={lang==="es" ? "Detalles adicionales sobre el contrato..." : lang==="pl" ? "Dodatkowe informacje o umowie..." : "Any additional details about the contract..."} rows={2} style={{...inputStyle, resize:"vertical"}} />
                        </div>
                      )}

                      {wageMethod && wageEffectiveDate && wageValidThrough && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (
                        <button onClick={handleWageSubmit} disabled={wageUploading} style={{background: wageUploading ? "rgba(250,128,89,0.5)" : "#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 32px", borderRadius:50, border:"none", cursor: wageUploading ? "wait" : "pointer", marginTop:8}}>
                          {wageUploading ? (lang==="es" ? "Enviando..." : lang==="pl" ? "Wysylanie..." : "Submitting...") : (lang==="es" ? "Enviar Salarios" : lang==="pl" ? "Wyslij Stawki" : "Submit Wages")}
                        </button>
                      )}

                    </div>
                  )}
                </div>

                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:20}}>
                    {lang==="es" ? "Salarios Aprobados" : lang==="pl" ? "Zatwierdzone Stawki" : "Approved Wages"}
                  </div>
                  <ApprovedWagesFeed lang={lang} />
                </div>

              </div>
            </div>
          );
        })()}

`;

code = replaceOnce(code,
  `        {page === "veterans" && (`,
  wagesPageBlock + `        {page === "veterans" && (`,
  'veterans page anchor');
console.log('5/9 ✓ Added Wages page block');

// ============================================================
// 6. ADMIN: ADD adminSection STATE
// ============================================================
code = replaceOnce(code,
  `  const [tab, setTab] = useState('pending');`,
  `  const [tab, setTab] = useState('pending');
  const [adminSection, setAdminSection] = useState('jobs');`,
  'admin tab state');
console.log('6/9 ✓ Added adminSection state');

// ============================================================
// 7. ADMIN: MAKE LOAD/APPROVE/UNAPPROVE/REJECT/EDIT TABLE-AWARE
// ============================================================
code = replaceOnce(code,
  `  const loadRows = async () => {
    setRows(null);
    try {
      const sb = await getSupabase();
      const { data, error } = await sb
        .from('job_submissions')
        .select('*')
        .eq('approved', tab === 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (err) {
      console.error('Load failed:', err);
      setRows([]);
    }
  };

  useEffect(() => {
    if (authed) loadRows();
  }, [authed, tab]);`,
  `  const loadRows = async () => {
    setRows(null);
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { data, error } = await sb
        .from(tableName)
        .select('*')
        .eq('approved', tab === 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (err) {
      console.error('Load failed:', err);
      setRows([]);
    }
  };

  useEffect(() => {
    if (authed) loadRows();
  }, [authed, tab, adminSection]);`,
  'loadRows');

code = replaceOnce(code,
  `  const handleApprove = async (id) => {
    setBusy(b => ({...b, [id]: 'approving'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').update({ approved: true }).eq('id', id);`,
  `  const handleApprove = async (id) => {
    setBusy(b => ({...b, [id]: 'approving'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).update({ approved: true }).eq('id', id);`,
  'handleApprove');

code = replaceOnce(code,
  `  const handleUnapprove = async (id) => {
    setBusy(b => ({...b, [id]: 'unapproving'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').update({ approved: false }).eq('id', id);`,
  `  const handleUnapprove = async (id) => {
    setBusy(b => ({...b, [id]: 'unapproving'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).update({ approved: false }).eq('id', id);`,
  'handleUnapprove');

code = replaceOnce(code,
  `  const handleReject = async (id) => {
    if (!confirm('Permanently delete this submission?')) return;
    setBusy(b => ({...b, [id]: 'rejecting'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').delete().eq('id', id);`,
  `  const handleReject = async (id) => {
    if (!confirm('Permanently delete this submission?')) return;
    setBusy(b => ({...b, [id]: 'rejecting'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).delete().eq('id', id);`,
  'handleReject');

code = replaceOnce(code,
  `  const saveEdit = async (id) => {
    setBusy(b => ({...b, [id]: 'saving'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').update(editData).eq('id', id);`,
  `  const saveEdit = async (id) => {
    setBusy(b => ({...b, [id]: 'saving'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).update(editData).eq('id', id);`,
  'saveEdit');

code = replaceOnce(code,
  `  const startEdit = (r) => {
    setEditingId(r.id);
    setEditData({
      trade: r.trade || '', local_name: r.local_name || '', city: r.city || '',
      state: r.state || '', status: r.status || '', job_calls: r.job_calls || '',
      report_date: r.report_date || '', phone: r.phone || '', website: r.website || '',
      local_email: r.local_email || '', address: r.address || '',
    });
  };`,
  `  const startEdit = (r) => {
    setEditingId(r.id);
    if (adminSection === 'wages') {
      setEditData({
        trade: r.trade || '', local_name: r.local_name || '', city: r.city || '', state: r.state || '',
        hourly: r.hourly || '', health_welfare: r.health_welfare || '', defined_pension: r.defined_pension || '',
        contribution_pension: r.contribution_pension || '', k401: r.k401 || '', nebf: r.nebf || '',
        cipf: r.cipf || '', iuoe_training: r.iuoe_training || '', working_dues: r.working_dues || '',
        total_package: r.total_package || '', effective_date: r.effective_date || '', valid_through: r.valid_through || '',
        notes: r.notes || '',
      });
    } else {
      setEditData({
        trade: r.trade || '', local_name: r.local_name || '', city: r.city || '',
        state: r.state || '', status: r.status || '', job_calls: r.job_calls || '',
        report_date: r.report_date || '', phone: r.phone || '', website: r.website || '',
        local_email: r.local_email || '', address: r.address || '',
      });
    }
  };`,
  'startEdit');

console.log('7/9 ✓ Made admin actions table-aware');

// ============================================================
// 8. ADMIN: UPDATE renderEditForm TO HAVE WAGE FIELDS
// ============================================================
code = replaceOnce(code,
  `  const renderEditForm = (r) => (
    <div style={{background:"rgba(245,197,24,0.05)", border:"1px solid rgba(245,197,24,0.3)", borderRadius:12, padding:20, marginTop:12}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, color:"#F5C518", marginBottom:12, letterSpacing:1}}>EDITING #{r.id}</div>
      {[['trade','Trade'],['local_name','Local Name'],['city','City'],['state','State'],['status','Status (BUSY/STEADY/SLOW)'],['job_calls','Job Calls'],['report_date','Report Date'],['phone','Phone'],['website','Website'],['local_email','Email'],['address','Address']].map(([key, label]) => (
        <div key={key} style={{marginBottom:10}}>
          <div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:4}}>{label}</div>
          <input
            type="text"
            value={editData[key] || ''}
            onChange={(e) => setEditData({...editData, [key]: e.target.value})}
            style={{width:"100%", padding:10, fontSize:14, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"#fff", outline:"none", boxSizing:"border-box"}}
          />
        </div>
      ))}
      <div style={{display:"flex", gap:8, marginTop:12}}>
        <button onClick={() => saveEdit(r.id)} disabled={!!busy[r.id]} style={{flex:1, padding:10, background:"#22c55e", color:"#000", border:"none", borderRadius:8, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:1, cursor:"pointer"}}>
          {busy[r.id] === 'saving' ? 'SAVING…' : 'SAVE'}
        </button>
        <button onClick={cancelEdit} disabled={!!busy[r.id]} style={{flex:1, padding:10, background:"transparent", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, fontWeight:700, fontSize:14, cursor:"pointer"}}>
          CANCEL
        </button>
      </div>
    </div>
  );`,
  `  const renderEditForm = (r) => {
    const wageFields = [['trade','Trade'],['local_name','Local Name'],['city','City'],['state','State'],['hourly','Hourly'],['health_welfare','Health & Welfare'],['defined_pension','Defined Pension'],['contribution_pension','Contribution Pension/Annuity'],['k401','401(k)'],['nebf','NEBF (IBEW only)'],['cipf','CIPF (IUOE only)'],['iuoe_training','IUOE Training (IUOE only)'],['working_dues','Working Dues'],['total_package','Total Package'],['effective_date','Effective Date'],['valid_through','Valid Through'],['notes','Notes']];
    const jobFields = [['trade','Trade'],['local_name','Local Name'],['city','City'],['state','State'],['status','Status (BUSY/STEADY/SLOW)'],['job_calls','Job Calls'],['report_date','Report Date'],['phone','Phone'],['website','Website'],['local_email','Email'],['address','Address']];
    const fields = adminSection === 'wages' ? wageFields : jobFields;
    return (
      <div style={{background:"rgba(245,197,24,0.05)", border:"1px solid rgba(245,197,24,0.3)", borderRadius:12, padding:20, marginTop:12}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, color:"#F5C518", marginBottom:12, letterSpacing:1}}>EDITING #{r.id}</div>
        {fields.map(([key, label]) => (
          <div key={key} style={{marginBottom:10}}>
            <div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:4}}>{label}</div>
            <input
              type="text"
              value={editData[key] || ''}
              onChange={(e) => setEditData({...editData, [key]: e.target.value})}
              style={{width:"100%", padding:10, fontSize:14, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"#fff", outline:"none", boxSizing:"border-box"}}
            />
          </div>
        ))}
        <div style={{display:"flex", gap:8, marginTop:12}}>
          <button onClick={() => saveEdit(r.id)} disabled={!!busy[r.id]} style={{flex:1, padding:10, background:"#22c55e", color:"#000", border:"none", borderRadius:8, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:1, cursor:"pointer"}}>
            {busy[r.id] === 'saving' ? 'SAVING…' : 'SAVE'}
          </button>
          <button onClick={cancelEdit} disabled={!!busy[r.id]} style={{flex:1, padding:10, background:"transparent", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, fontWeight:700, fontSize:14, cursor:"pointer"}}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };`,
  'renderEditForm');

console.log('8/9 ✓ Updated renderEditForm');

// ============================================================
// 9. ADMIN: ADD JOB BOARD / WAGES TOGGLE + UPDATE CARD DISPLAY
// ============================================================
code = replaceOnce(code,
  `        <div style={{display:"flex", gap:8, marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <button onClick={() => setTab('pending')} style={{padding:"12px 20px", background:"transparent", border:"none", borderBottom: tab==='pending' ? "2px solid #F5C518" : "2px solid transparent", color: tab==='pending' ? "#F5C518" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:1, cursor:"pointer"}}>
            PENDING
          </button>`,
  `        <div style={{display:"flex", gap:6, marginBottom:16}}>
          <button onClick={() => { setAdminSection('jobs'); setEditingId(null); }} style={{flex:1, padding:"12px 16px", background: adminSection==='jobs' ? "#FA8059" : "rgba(255,255,255,0.04)", color: adminSection==='jobs' ? "#000" : "#fff", border:"none", borderRadius:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:1, cursor:"pointer"}}>
            JOB BOARD
          </button>
          <button onClick={() => { setAdminSection('wages'); setEditingId(null); }} style={{flex:1, padding:"12px 16px", background: adminSection==='wages' ? "#FA8059" : "rgba(255,255,255,0.04)", color: adminSection==='wages' ? "#000" : "#fff", border:"none", borderRadius:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:1, cursor:"pointer"}}>
            WAGES
          </button>
        </div>

        <div style={{display:"flex", gap:8, marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <button onClick={() => setTab('pending')} style={{padding:"12px 20px", background:"transparent", border:"none", borderBottom: tab==='pending' ? "2px solid #F5C518" : "2px solid transparent", color: tab==='pending' ? "#F5C518" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:1, cursor:"pointer"}}>
            PENDING
          </button>`,
  'admin section toggle');

code = replaceOnce(code,
  `              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2}}>{r.local_name}</div>
                  <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>#{r.id} · {r.city}, {r.state} · {r.trade}</div>
                </div>
                <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.06)", fontSize:12, fontWeight:700, color:"#fff"}}>{r.status}</div>
              </div>
              {r.job_calls && <div style={{fontSize:13, color:"rgba(255,255,255,0.8)", marginTop:6}}><strong style={{color:"var(--muted)"}}>Job Calls:</strong> {r.job_calls}</div>}
              <div style={{fontSize:11, color:"rgba(160,180,196,0.5)", marginTop:8}}>Report Date: {r.report_date} · Submitted: {new Date(r.created_at).toLocaleDateString()}</div>`,
  `              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2}}>{r.local_name}</div>
                  <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>#{r.id} · {r.city}, {r.state} · {r.trade}</div>
                </div>
                {adminSection === 'wages' ? (
                  <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(34,197,94,0.15)", color:"#22c55e", fontSize:12, fontWeight:700}}>{r.submission_method === 'image' ? '📄 IMAGE' : '⌨️ MANUAL'}</div>
                ) : (
                  <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.06)", fontSize:12, fontWeight:700, color:"#fff"}}>{r.status}</div>
                )}
              </div>
              {adminSection === 'wages' ? (
                <div style={{fontSize:13, color:"rgba(255,255,255,0.8)", marginTop:6}}>
                  {r.hourly && <span style={{marginRight:14}}><strong style={{color:"var(--muted)"}}>Hourly:</strong> \${parseFloat(r.hourly).toFixed(2)}</span>}
                  {r.total_package && <span style={{marginRight:14}}><strong style={{color:"var(--muted)"}}>Total:</strong> \${parseFloat(r.total_package).toFixed(2)}</span>}
                  {r.image_url && <a href={r.image_url} target="_blank" rel="noopener noreferrer" style={{color:"#F5C518", textDecoration:"underline"}}>📄 View Sheet</a>}
                  {r.notes && <div style={{marginTop:6, fontSize:12, color:"rgba(255,255,255,0.6)"}}><strong>Notes:</strong> {r.notes}</div>}
                </div>
              ) : (
                r.job_calls && <div style={{fontSize:13, color:"rgba(255,255,255,0.8)", marginTop:6}}><strong style={{color:"var(--muted)"}}>Job Calls:</strong> {r.job_calls}</div>
              )}
              <div style={{fontSize:11, color:"rgba(160,180,196,0.5)", marginTop:8}}>{adminSection === 'wages' ? \`Effective: \${r.effective_date} · Valid through: \${r.valid_through}\` : \`Report Date: \${r.report_date}\`} · Submitted: {new Date(r.created_at).toLocaleDateString()}</div>`,
  'admin card display');

console.log('9/9 ✓ Added admin section toggle + updated card display');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Wages page with image/PDF upload + admin approval" && git push\n');
