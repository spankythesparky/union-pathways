const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// ============================================================
// STEP 1: Insert AdminPage component before UnionPathway
// ============================================================
const adminComponent = `
// ── ADMIN PAGE — approve/reject/edit job board submissions ──────────────────
const ADMIN_PASSWORD = 'CHANGEME_PASSWORD';

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState('pending');
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_authed');
    if (saved === 'yes') setAuthed(true);
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem('admin_authed', 'yes');
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem('admin_authed');
    setPwInput('');
  };

  const loadRows = async () => {
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
  }, [authed, tab]);

  const handleApprove = async (id) => {
    setBusy(b => ({...b, [id]: 'approving'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').update({ approved: true }).eq('id', id);
      if (error) throw error;
      setRows(rows.filter(r => r.id !== id));
    } catch (err) { alert('Approve failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  const handleUnapprove = async (id) => {
    setBusy(b => ({...b, [id]: 'unapproving'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').update({ approved: false }).eq('id', id);
      if (error) throw error;
      setRows(rows.filter(r => r.id !== id));
    } catch (err) { alert('Un-approve failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  const handleReject = async (id) => {
    if (!confirm('Permanently delete this submission?')) return;
    setBusy(b => ({...b, [id]: 'rejecting'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').delete().eq('id', id);
      if (error) throw error;
      setRows(rows.filter(r => r.id !== id));
    } catch (err) { alert('Delete failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditData({
      trade: r.trade || '', local_name: r.local_name || '', city: r.city || '',
      state: r.state || '', status: r.status || '', job_calls: r.job_calls || '',
      report_date: r.report_date || '', phone: r.phone || '', website: r.website || '',
      local_email: r.local_email || '', address: r.address || '',
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditData({}); };

  const saveEdit = async (id) => {
    setBusy(b => ({...b, [id]: 'saving'}));
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('job_submissions').update(editData).eq('id', id);
      if (error) throw error;
      setRows(rows.map(r => r.id === id ? { ...r, ...editData } : r));
      setEditingId(null);
      setEditData({});
    } catch (err) { alert('Save failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  if (!authed) {
    return (
      <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"var(--bg)"}}>
        <div style={{maxWidth:420, width:"100%", padding:32, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16}}>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:"#fff", margin:0, marginBottom:8, letterSpacing:2}}>ADMIN</h1>
          <div style={{fontSize:13, color:"var(--muted)", marginBottom:24}}>Union Pathways control panel</div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              placeholder="Password"
              autoFocus
              style={{width:"100%", padding:14, fontSize:16, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, color:"#fff", outline:"none", boxSizing:"border-box"}}
            />
            {pwError && <div style={{color:"#ef4444", fontSize:13, marginTop:8}}>Incorrect password</div>}
            <button type="submit" style={{marginTop:16, width:"100%", padding:14, background:"#F5C518", color:"#000", border:"none", borderRadius:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, letterSpacing:1, cursor:"pointer"}}>
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderEditForm = (r) => (
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
  );

  return (
    <div style={{minHeight:"100vh", padding:"24px 16px 60px", background:"var(--bg)"}}>
      <div style={{maxWidth:900, margin:"0 auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12}}>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:"#fff", margin:0, letterSpacing:2}}>ADMIN</h1>
          <button onClick={handleLogout} style={{padding:"8px 16px", background:"transparent", color:"var(--muted)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, fontSize:13, cursor:"pointer"}}>LOG OUT</button>
        </div>

        <div style={{display:"flex", gap:8, marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <button onClick={() => setTab('pending')} style={{padding:"12px 20px", background:"transparent", border:"none", borderBottom: tab==='pending' ? "2px solid #F5C518" : "2px solid transparent", color: tab==='pending' ? "#F5C518" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:1, cursor:"pointer"}}>
            PENDING
          </button>
          <button onClick={() => setTab('approved')} style={{padding:"12px 20px", background:"transparent", border:"none", borderBottom: tab==='approved' ? "2px solid #F5C518" : "2px solid transparent", color: tab==='approved' ? "#F5C518" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:1, cursor:"pointer"}}>
            APPROVED
          </button>
        </div>

        {rows === null && <div style={{textAlign:"center", padding:40, color:"var(--muted)"}}>Loading…</div>}
        {rows !== null && rows.length === 0 && <div style={{textAlign:"center", padding:40, color:"var(--muted)"}}>No {tab} submissions.</div>}

        <div style={{display:"grid", gap:16}}>
          {rows && rows.map(r => (
            <div key={r.id} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:20}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2}}>{r.local_name}</div>
                  <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>#{r.id} · {r.city}, {r.state} · {r.trade}</div>
                </div>
                <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.06)", fontSize:12, fontWeight:700, color:"#fff"}}>{r.status}</div>
              </div>
              {r.job_calls && <div style={{fontSize:13, color:"rgba(255,255,255,0.8)", marginTop:6}}><strong style={{color:"var(--muted)"}}>Job Calls:</strong> {r.job_calls}</div>}
              <div style={{fontSize:11, color:"rgba(160,180,196,0.5)", marginTop:8}}>Report Date: {r.report_date} · Submitted: {new Date(r.created_at).toLocaleDateString()}</div>

              {editingId === r.id ? renderEditForm(r) : (
                <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
                  {tab === 'pending' && (
                    <button onClick={() => handleApprove(r.id)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"#22c55e", color:"#000", border:"none", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                      {busy[r.id] === 'approving' ? '…' : '✓ APPROVE'}
                    </button>
                  )}
                  {tab === 'approved' && (
                    <button onClick={() => handleUnapprove(r.id)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"#eab308", color:"#000", border:"none", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                      {busy[r.id] === 'unapproving' ? '…' : '↶ UN-APPROVE'}
                    </button>
                  )}
                  <button onClick={() => startEdit(r)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"transparent", color:"#fff", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                    ✎ EDIT
                  </button>
                  <button onClick={() => handleReject(r.id)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"transparent", color:"#ef4444", border:"1px solid rgba(239,68,68,0.4)", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                    {busy[r.id] === 'rejecting' ? '…' : '✕ REJECT'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

`;

const insertBefore = '// ── APPROVED REPORT CARD';
if (!code.includes(insertBefore)) { console.error('ERROR: ApprovedReportCard marker not found'); process.exit(1); }
if (!code.includes('function AdminPage')) {
  code = code.replace(insertBefore, adminComponent + insertBefore);
  console.log('Added AdminPage component');
} else {
  console.log('AdminPage already exists, skipping');
}

// ============================================================
// STEP 2: Add admin route detection at top of UnionPathway
// ============================================================
const oldComponentStart = `export default function UnionPathway() {`;
const newComponentStart = `export default function UnionPathway() {
  // Admin route — bypass main app and show admin page
  const [isAdmin, setIsAdmin] = useState(typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));
  useEffect(() => {
    const onPop = () => setIsAdmin(window.location.pathname.startsWith('/admin'));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  if (isAdmin) return <AdminPage />;
`;

if (!code.includes(oldComponentStart)) { console.error('ERROR: UnionPathway start not found'); process.exit(1); }
if (!code.includes('Admin route — bypass')) {
  code = code.replace(oldComponentStart, newComponentStart);
  console.log('Added admin route detection');
} else {
  console.log('Admin route detection already present, skipping');
}

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run BOTH commands:');
console.log('   1. Set your password (replace YOUR_PASSWORD with what you want):');
console.log("      sed -i '' \"s/CHANGEME_PASSWORD/YOUR_PASSWORD/\" src/App.jsx");
console.log('   2. Then commit and push:');
console.log('      git add src/App.jsx && git commit -m "feat: add admin page at /admin" && git push\n');
