const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// ============================================================
// STEP 1: Replace ApprovedReportsFeed with trade-tabbed version
// ============================================================
const oldFeedSig = `function ApprovedReportsFeed({ lang }) {`;
if (!code.includes(oldFeedSig)) { console.error('ERROR: ApprovedReportsFeed not found'); process.exit(1); }

const newFeed = `function ApprovedReportsFeed({ lang }) {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const [activeTrade, setActiveTrade] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sb = await getSupabase();
        const { data, error } = await sb
          .from('job_submissions')
          .select('*')
          .eq('approved', true)
          .order('report_date', { ascending: false })
          .limit(200);
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

  // Build trade list with counts
  const tradeCounts = reports.reduce((acc, r) => {
    const t = r.trade || 'Unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const tradeList = Object.keys(tradeCounts).sort();

  // Filter reports by active tab
  const visible = activeTrade === 'all' ? reports : reports.filter(r => r.trade === activeTrade);

  const statusColor = (s) => s === 'BUSY' ? '#22c55e' : s === 'STEADY' ? '#eab308' : '#ef4444';
  const statusLabel = (s) => {
    if (lang === 'es') return s === 'BUSY' ? 'OCUPADO' : s === 'STEADY' ? 'ESTABLE' : 'LENTO';
    if (lang === 'pl') return s === 'BUSY' ? 'ZAJETY' : s === 'STEADY' ? 'STABILNY' : 'POWOLNY';
    return s;
  };

  const allLabel = lang === 'es' ? 'Todos' : lang === 'pl' ? 'Wszystkie' : 'All Trades';

  return (
    <div>
      {/* Trade tabs */}
      <div style={{display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <button
          onClick={() => setActiveTrade('all')}
          style={{
            padding:"8px 16px",
            background: activeTrade === 'all' ? '#F5C518' : 'rgba(255,255,255,0.06)',
            color: activeTrade === 'all' ? '#000' : '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1,
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          {allLabel} <span style={{opacity:0.7, marginLeft:4}}>({reports.length})</span>
        </button>
        {tradeList.map(trade => (
          <button
            key={trade}
            onClick={() => setActiveTrade(trade)}
            style={{
              padding:"8px 16px",
              background: activeTrade === trade ? '#F5C518' : 'rgba(255,255,255,0.06)',
              color: activeTrade === trade ? '#000' : '#fff',
              border: 'none',
              borderRadius: 999,
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 1,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            {trade} <span style={{opacity:0.7, marginLeft:4}}>({tradeCounts[trade]})</span>
          </button>
        ))}
      </div>

      {/* Cards (filtered) */}
      {visible.length === 0 ? (
        <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", marginBottom:8}}>
            {lang==="es" ? "No hay informes en esta categoria" : lang==="pl" ? "Brak raportow w tej kategorii" : "No reports in this category yet"}
          </div>
        </div>
      ) : (
        <div style={{display:"grid", gap:16}}>
          {visible.map(r => (
            <ApprovedReportCard key={r.id} r={r} lang={lang} statusColor={statusColor} statusLabel={statusLabel} />
          ))}
        </div>
      )}
    </div>
  );
}`;

// Replace the entire old component (find + extract + replace)
const oldFeedStart = code.indexOf(oldFeedSig);
// Find the matching closing brace by counting braces
let braceDepth = 0;
let i = oldFeedStart + oldFeedSig.length;
let started = false;
while (i < code.length) {
  if (code[i] === '{') { braceDepth++; started = true; }
  else if (code[i] === '}') { braceDepth--; if (started && braceDepth === 0) { i++; break; } }
  i++;
}
const oldFeedFull = code.substring(oldFeedStart, i);
code = code.replace(oldFeedFull, newFeed);
console.log('Replaced ApprovedReportsFeed with trade-tabbed version');

// ============================================================
// STEP 2: Update ApprovedReportCard job_calls block to add expand/collapse
// ============================================================
const oldJobCallsBlock = `      {r.job_calls && (
        <div style={{marginTop:14}}>
          <div style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{L.jobCalls.replace(/:$/, '')}</div>
          <div style={{whiteSpace:"pre-line", lineHeight:1.6, fontSize:14, color:"rgba(255,255,255,0.85)", padding:"10px 12px", background:"rgba(0,0,0,0.2)", borderRadius:8, borderLeft:"3px solid #F5C518"}}>{r.job_calls}</div>
        </div>
      )}`;

const newJobCallsBlock = `      {r.job_calls && (() => {
        const lineCount = (r.job_calls.match(/\\n/g) || []).length + 1;
        const isLong = lineCount >= 3 || r.job_calls.length > 200;
        const expandLabel = lang === 'es' ? 'Mostrar mas' : lang === 'pl' ? 'Pokaz wiecej' : 'Show more';
        const collapseLabel = lang === 'es' ? 'Mostrar menos' : lang === 'pl' ? 'Pokaz mniej' : 'Show less';
        return (
          <div style={{marginTop:14}}>
            <div style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{L.jobCalls.replace(/:$/, '')}</div>
            <div style={{whiteSpace:"pre-line", lineHeight:1.6, fontSize:14, color:"rgba(255,255,255,0.85)", padding:"10px 12px", background:"rgba(0,0,0,0.2)", borderRadius:8, borderLeft:"3px solid #F5C518", maxHeight: isLong && !expanded ? 60 : 'none', overflow: isLong && !expanded ? 'hidden' : 'visible', position: 'relative', WebkitMaskImage: isLong && !expanded ? 'linear-gradient(to bottom, black 60%, transparent)' : 'none', maskImage: isLong && !expanded ? 'linear-gradient(to bottom, black 60%, transparent)' : 'none'}}>{r.job_calls}</div>
            {isLong && (
              <button onClick={() => setExpanded(!expanded)} style={{marginTop:8, padding:"6px 14px", background:"transparent", color:"#F5C518", border:"1px solid rgba(245,197,24,0.4)", borderRadius:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, cursor:"pointer", textTransform:"uppercase"}}>
                {expanded ? collapseLabel : expandLabel}
              </button>
            )}
          </div>
        );
      })()}`;

if (!code.includes(oldJobCallsBlock)) { console.error('ERROR: old job_calls block not found'); process.exit(1); }
code = code.replace(oldJobCallsBlock, newJobCallsBlock);
console.log('Updated job_calls block with expand/collapse for long reports');

// ============================================================
// STEP 3: Add `expanded` state to ApprovedReportCard
// ============================================================
const oldCardStart = `function ApprovedReportCard({ r, lang, statusColor, statusLabel }) {
  const [open, setOpen] = useState(false);`;

const newCardStart = `function ApprovedReportCard({ r, lang, statusColor, statusLabel }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);`;

if (!code.includes(oldCardStart)) { console.error('ERROR: card component start not found'); process.exit(1); }
code = code.replace(oldCardStart, newCardStart);
console.log('Added expanded state to ApprovedReportCard');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: trade tabs and collapsible job calls on Job Board" && git push\n');
