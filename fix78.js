const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// ============================================================
// Replace the simple ApprovedReportsFeed card with an expandable version
// ============================================================
const oldCard = `      {reports.map((r) => (
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
      ))}`;

const newCard = `      {reports.map((r) => (
        <ApprovedReportCard key={r.id} r={r} lang={lang} statusColor={statusColor} statusLabel={statusLabel} />
      ))}`;

if (!code.includes(oldCard)) { console.error('ERROR: old report card block not found'); process.exit(1); }
code = code.replace(oldCard, newCard);
console.log('Refactored to use ApprovedReportCard component');

// ============================================================
// Insert ApprovedReportCard component before ApprovedReportsFeed
// ============================================================
const cardComponent = `
// ── APPROVED REPORT CARD — expandable card with contact info ────────────────
function ApprovedReportCard({ r, lang, statusColor, statusLabel }) {
  const [open, setOpen] = useState(false);
  const hasContact = r.phone || r.website || r.local_email || r.address;
  const mapsUrl = r.address ? \`https://maps.google.com/?q=\${encodeURIComponent(r.address)}\` : null;
  const cleanPhone = r.phone ? r.phone.replace(/[^0-9+]/g, '') : null;
  const websiteUrl = r.website ? (r.website.startsWith('http') ? r.website : 'https://' + r.website) : null;
  const websiteDisplay = r.website ? r.website.replace(/^https?:\\/\\//, '').replace(/^www\\./, '') : null;

  const labels = {
    en: { contact: 'Contact Info', hide: 'Hide Contact Info', call: 'Call', visit: 'Visit Website', email: 'Email', directions: 'Get Directions', reported: 'Reported:', jobCalls: 'Job Calls:' },
    es: { contact: 'Informacion de Contacto', hide: 'Ocultar Contacto', call: 'Llamar', visit: 'Visitar Sitio Web', email: 'Correo', directions: 'Como Llegar', reported: 'Reportado:', jobCalls: 'Llamadas de Trabajo:' },
    pl: { contact: 'Dane Kontaktowe', hide: 'Ukryj Kontakt', call: 'Zadzwon', visit: 'Strona Internetowa', email: 'Email', directions: 'Wskazowki Dojazdu', reported: 'Zgloszono:', jobCalls: 'Oferty Pracy:' },
  };
  const L = labels[lang] || labels.en;

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
        <div style={{marginTop:8, fontSize:14, color:"rgba(255,255,255,0.85)"}}>
          <strong style={{color:"var(--muted)"}}>{L.jobCalls}</strong> {r.job_calls}
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
}

`;

const insertBefore = '// ── APPROVED REPORTS FEED — Live feed from Supabase';
if (!code.includes(insertBefore)) { console.error('ERROR: ApprovedReportsFeed marker not found'); process.exit(1); }
if (!code.includes('function ApprovedReportCard')) {
  code = code.replace(insertBefore, cardComponent + insertBefore);
  console.log('Added ApprovedReportCard component');
} else {
  console.log('ApprovedReportCard already exists, skipping');
}

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add expandable contact info on approved report cards" && git push\n');
