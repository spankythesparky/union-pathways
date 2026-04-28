const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace inline job_calls rendering with formatted block that preserves line breaks
const oldBlock = `      {r.job_calls && (
        <div style={{marginTop:8, fontSize:14, color:"rgba(255,255,255,0.85)"}}>
          <strong style={{color:"var(--muted)"}}>{L.jobCalls}</strong> {r.job_calls}
        </div>
      )}`;

const newBlock = `      {r.job_calls && (
        <div style={{marginTop:14}}>
          <div style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{L.jobCalls.replace(/:$/, '')}</div>
          <div style={{whiteSpace:"pre-line", lineHeight:1.6, fontSize:14, color:"rgba(255,255,255,0.85)", padding:"10px 12px", background:"rgba(0,0,0,0.2)", borderRadius:8, borderLeft:"3px solid #F5C518"}}>{r.job_calls}</div>
        </div>
      )}`;

if (!code.includes(oldBlock)) { console.error('ERROR: old job_calls block not found'); process.exit(1); }
code = code.replace(oldBlock, newBlock);
console.log('Updated job_calls rendering to preserve line breaks');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: preserve line breaks in job calls display" && git push\n');
