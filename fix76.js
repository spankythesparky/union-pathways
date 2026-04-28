const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// ============================================================
// Find the empty "No approved reports yet" block and replace it
// with a live feed pulling from Supabase
// ============================================================
const oldEmpty = `                <div>
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
                </div>`;

const newFeed = `                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:20}}>
                    {lang==="es" ? "Informes Aprobados" : lang==="pl" ? "Zatwierdzone Raporty" : "Approved Reports"}
                  </div>
                  <ApprovedReportsFeed lang={lang} />
                </div>`;

if (!code.includes(oldEmpty)) { console.error('ERROR: empty approved reports block not found'); process.exit(1); }
code = code.replace(oldEmpty, newFeed);
console.log('Replaced empty state with live feed');

// ============================================================
// Insert the ApprovedReportsFeed component before UnionPathway
// ============================================================
const feedComponent = `
// ── APPROVED REPORTS FEED — Live feed from Supabase ─────────────────────────
function ApprovedReportsFeed({ lang }) {
  const [reports, setReports] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sb = await getSupabase();
        const { data, error } = await sb
          .from('job_submissions')
          .select('*')
          .eq('approved', true)
          .order('report_date', { ascending: false })
          .limit(50);
        if (cancelled) return;
        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load approved reports:', err);
        if (!cancelled) setError(err.message || 'Failed to load reports');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)"}}>
          {lang==="es" ? "Error al cargar informes" : lang==="pl" ? "Blad ladowania raportow" : "Error loading reports"}
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

  if (reports.length === 0) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", marginBottom:8}}>
          {lang==="es" ? "No hay informes aprobados todavia" : lang==="pl" ? "Brak zatwierdzonych raportow" : "No approved reports yet"}
        </div>
        <div style={{fontSize:13, color:"rgba(160,180,196,0.4)"}}>
          {lang==="es" ? "Se el primero en enviar un informe de perspectivas laborales." : lang==="pl" ? "Badz pierwszym, ktory wysle raport o perspektywach pracy." : "Be the first to submit a work outlook report for your local."}
        </div>
      </div>
    );
  }

  const statusColor = (s) => s === 'BUSY' ? '#22c55e' : s === 'STEADY' ? '#eab308' : '#ef4444';
  const statusLabel = (s) => {
    if (lang === 'es') return s === 'BUSY' ? 'OCUPADO' : s === 'STEADY' ? 'ESTABLE' : 'LENTO';
    if (lang === 'pl') return s === 'BUSY' ? 'ZAJETY' : s === 'STEADY' ? 'STABILNY' : 'POWOLNY';
    return s;
  };

  return (
    <div style={{display:"grid", gap:16}}>
      {reports.map((r) => (
        <div key={r.id} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:12}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", lineHeight:1.2}}>
                {r.local_name}
              </div>
              <div style={{fontSize:13, color:"var(--muted)", marginTop:4}}>
                {r.city}, {r.state} — {r.trade}
              </div>
            </div>
            <div style={{padding:"6px 14px", borderRadius:999, background:statusColor(r.status)+"22", border:"1px solid "+statusColor(r.status), color:statusColor(r.status), fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1}}>
              {statusLabel(r.status)}
            </div>
          </div>
          {r.job_calls && (
            <div style={{marginTop:8, fontSize:14, color:"rgba(255,255,255,0.85)"}}>
              <strong style={{color:"var(--muted)"}}>{lang==="es" ? "Llamadas de Trabajo:" : lang==="pl" ? "Oferty Pracy:" : "Job Calls:"}</strong> {r.job_calls}
            </div>
          )}
          <div style={{marginTop:12, fontSize:12, color:"rgba(160,180,196,0.5)"}}>
            {lang==="es" ? "Reportado:" : lang==="pl" ? "Zgloszono:" : "Reported:"} {r.report_date}
          </div>
        </div>
      ))}
    </div>
  );
}

`;

const componentMarker = 'export default function UnionPathway';
if (!code.includes(componentMarker)) { console.error('ERROR: UnionPathway marker not found'); process.exit(1); }
if (!code.includes('function ApprovedReportsFeed')) {
  code = code.replace(componentMarker, feedComponent + componentMarker);
  console.log('Added ApprovedReportsFeed component');
} else {
  console.log('ApprovedReportsFeed already exists, skipping');
}

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add live Supabase-powered approved reports feed" && git push\n');
