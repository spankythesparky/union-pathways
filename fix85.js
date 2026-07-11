const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Helper: extract a complete function block by counting braces
function extractFunction(src, startMarker) {
  const start = src.indexOf(startMarker);
  if (start === -1) return null;
  let braceDepth = 0;
  let i = start + startMarker.length;
  let started = false;
  while (i < src.length) {
    if (src[i] === '{') { braceDepth++; started = true; }
    else if (src[i] === '}') { braceDepth--; if (started && braceDepth === 0) { i++; break; } }
    i++;
  }
  return src.substring(start, i);
}

// ============================================================
// Replacement: ApprovedReportCard (with expandable contact + collapsible job_calls)
// ============================================================
const newCard = `function ApprovedReportCard({ r, lang, statusColor, statusLabel }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasContact = r.phone || r.website || r.local_email || r.address;
  const mapsUrl = r.address ? \`https://maps.google.com/?q=\${encodeURIComponent(r.address)}\` : null;
  const cleanPhone = r.phone ? r.phone.replace(/[^0-9+]/g, '') : null;
  const websiteUrl = r.website ? (r.website.startsWith('http') ? r.website : 'https://' + r.website) : null;
  const websiteDisplay = r.website ? r.website.replace(/^https?:\\/\\//, '').replace(/^www\\./, '') : null;

  const labels = {
    en: { contact: 'Contact Info', hide: 'Hide Contact Info', call: 'Call', visit: 'Visit Website', email: 'Email', directions: 'Get Directions', reported: 'Reported:', jobCalls: 'Job Calls:', showMore: 'Show more', showLess: 'Show less' },
    es: { contact: 'Informacion de Contacto', hide: 'Ocultar Contacto', call: 'Llamar', visit: 'Visitar Sitio Web', email: 'Correo', directions: 'Como Llegar', reported: 'Reportado:', jobCalls: 'Llamadas de Trabajo:', showMore: 'Mostrar mas', showLess: 'Mostrar menos' },
    pl: { contact: 'Dane Kontaktowe', hide: 'Ukryj Kontakt', call: 'Zadzwon', visit: 'Strona Internetowa', email: 'Email', directions: 'Wskazowki Dojazdu', reported: 'Zgloszono:', jobCalls: 'Oferty Pracy:', showMore: 'Pokaz wiecej', showLess: 'Pokaz mniej' },
  };
  const L = labels[lang] || labels.en;

  // Job calls collapse: only collapse if 3+ lines OR over 200 chars
  const jcLineCount = r.job_calls ? (r.job_calls.match(/\\n/g) || []).length + 1 : 0;
  const jcIsLong = r.job_calls && (jcLineCount >= 3 || r.job_calls.length > 200);

  return (
    <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24}}>
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
        <div style={{marginTop:14}}>
          <div style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{L.jobCalls.replace(/:$/, '')}</div>
          <div style={{
            whiteSpace:"pre-line",
            lineHeight:1.6,
            fontSize:14,
            color:"rgba(255,255,255,0.85)",
            padding:"10px 12px",
            background:"rgba(0,0,0,0.2)",
            borderRadius:8,
            borderLeft:"3px solid #F5C518",
            maxHeight: jcIsLong && !expanded ? 80 : 'none',
            overflow: jcIsLong && !expanded ? 'hidden' : 'visible',
            WebkitMaskImage: jcIsLong && !expanded ? 'linear-gradient(to bottom, black 60%, transparent)' : 'none',
            maskImage: jcIsLong && !expanded ? 'linear-gradient(to bottom, black 60%, transparent)' : 'none',
          }}>{r.job_calls}</div>
          {jcIsLong && (
            <button onClick={() => setExpanded(!expanded)} style={{marginTop:8, padding:"6px 14px", background:"transparent", color:"#F5C518", border:"1px solid rgba(245,197,24,0.4)", borderRadius:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, cursor:"pointer", textTransform:"uppercase"}}>
              {expanded ? L.showLess : L.showMore}
            </button>
          )}
        </div>
      )}

      <div style={{marginTop:12, fontSize:12, color:"rgba(160,180,196,0.5)"}}>
        {L.reported} {r.report_date}
      </div>

      {hasContact && (
        <>
          <button
            onClick={() => setOpen(!open)}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "10px 16px",
              background: "rgba(245,197,24,0.08)",
              border: "1px solid rgba(245,197,24,0.3)",
              borderRadius: 10,
              color: "#F5C518",
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {open ? L.hide : L.contact}
            <span style={{fontSize:10, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s"}}>▼</span>
          </button>

          {open && (
            <div style={{marginTop:12, padding:16, background:"rgba(0,0,0,0.25)", borderRadius:10, display:"grid", gap:10}}>
              {cleanPhone && (
                <a href={\`tel:\${cleanPhone}\`} style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>📞</span>
                  <div>
                    <div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.call}</div>
                    <div style={{fontWeight:700}}>{r.phone}</div>
                  </div>
                </a>
              )}
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>🌐</span>
                  <div>
                    <div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.visit}</div>
                    <div style={{fontWeight:700}}>{websiteDisplay}</div>
                  </div>
                </a>
              )}
              {r.local_email && (
                <a href={\`mailto:\${r.local_email}\`} style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>✉️</span>
                  <div>
                    <div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.email}</div>
                    <div style={{fontWeight:700}}>{r.local_email}</div>
                  </div>
                </a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>📍</span>
                  <div>
                    <div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.directions}</div>
                    <div style={{fontWeight:700}}>{r.address}</div>
                  </div>
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}`;

// ============================================================
// Replacement: ApprovedReportsFeed (with trade tabs)
// ============================================================
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

  const tradeCounts = reports.reduce((acc, r) => {
    const t = r.trade || 'Unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const tradeList = Object.keys(tradeCounts).sort();

  const visible = activeTrade === 'all' ? reports : reports.filter(r => r.trade === activeTrade);

  const statusColor = (s) => s === 'BUSY' ? '#22c55e' : s === 'STEADY' ? '#eab308' : '#ef4444';
  const statusLabel = (s) => {
    if (lang === 'es') return s === 'BUSY' ? 'OCUPADO' : s === 'STEADY' ? 'ESTABLE' : 'LENTO';
    if (lang === 'pl') return s === 'BUSY' ? 'ZAJETY' : s === 'STEADY' ? 'STABILNY' : 'POWOLNY';
    return s;
  };

  const allLabel = lang === 'es' ? 'Todos' : lang === 'pl' ? 'Wszystkie' : 'All Trades';
  const tabStyle = (active) => ({
    padding:"8px 16px",
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

// ============================================================
// Apply replacements
// ============================================================
const oldCardFull = extractFunction(code, 'function ApprovedReportCard(');
if (!oldCardFull) { console.error('ERROR: ApprovedReportCard not found'); process.exit(1); }
code = code.replace(oldCardFull, newCard);
console.log('Replaced ApprovedReportCard component (clean)');

const oldFeedFull = extractFunction(code, 'function ApprovedReportsFeed(');
if (!oldFeedFull) { console.error('ERROR: ApprovedReportsFeed not found'); process.exit(1); }
code = code.replace(oldFeedFull, newFeed);
console.log('Replaced ApprovedReportsFeed component (clean)');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: trade tabs + collapsible job calls (clean rebuild)" && git push\n');
