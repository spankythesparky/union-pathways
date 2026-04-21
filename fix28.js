const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const oldSection = `            <hr className="divider-line" />

            {/* WHY UNION WINS */}`;

const healthSection = `            <hr className="divider-line" />

            {/* HEALTH INSURANCE */}
            <div className="history-section">
              <div className="history-section-title">🏥 Health Insurance — <span className="accent">Paid by the Contractor</span></div>
              <div className="history-section-sub">This is one of the biggest financial benefits most people don't fully understand when they join the trades.</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">💡</div>
                  <div className="impact-title">How It Works</div>
                  <div className="impact-desc">In union construction, every contractor who signs a union agreement is required to contribute a set dollar amount per hour you work directly into your health and welfare fund. This covers your health insurance premiums — not you. It never touches your paycheck.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">💵</div>
                  <div className="impact-title">What That Means in Dollars</div>
                  <div className="impact-desc">A typical union health contribution might be $8-15 per hour worked. If you work 2,000 hours a year, that's $16,000-$30,000 per year going toward your health coverage — paid entirely by the contractor on top of your wages. You see none of that deducted from your check.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">👨‍👩‍👧‍👦</div>
                  <div className="impact-title">Family Coverage Included</div>
                  <div className="impact-desc">Most union health plans cover your entire family — spouse and children — at little to no additional cost to you. In the non-union world, family coverage can easily cost $800-1,500/month out of your own pocket. Union members typically pay nothing, or a very small copay.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🦷</div>
                  <div className="impact-title">What's Usually Covered</div>
                  <div className="impact-desc">Union health plans typically include medical, dental, vision, prescription drugs, mental health services, and sometimes life insurance — all in one package. The coverage is often better than what most office workers receive, at a fraction of the cost to you.</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">"Your wages are what you take home. But your total compensation — wages plus pension, annuity, and health benefits — is what the contractor is really paying. In major markets, that total package can be $80-120+ per hour, even when your paycheck shows $45-60/hr."</div>
                <div className="quote-author">— Understanding Your Full Union Compensation Package</div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* BENEFITS BREAKDOWN */}
            <div className="history-section">
              <div className="history-section-title">Your <span className="accent">Full Package</span> — What the Contractor Pays</div>
              <div className="history-section-sub">Here's an example of what a union contractor pays per hour on your behalf — beyond your base wage.</div>

              <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"32px", marginBottom:32}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:24}}>Example: Journeyman Electrician — Major Market</div>
                {[
                  ["Base Wage (your take-home)", "$48.00/hr", true],
                  ["Health & Welfare (insurance)", "$12.50/hr", false],
                  ["Pension Contribution", "$9.00/hr", false],
                  ["Annuity / 401k", "$5.00/hr", false],
                  ["Vacation / Holiday Fund", "$4.50/hr", false],
                  ["Training / Apprenticeship Fund", "$1.00/hr", false],
                  ["Other (disability, etc.)", "$1.00/hr", false],
                ].map(([label, amount, isWage], i) => (
                  <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i < 6 ? "1px solid rgba(58,80,104,0.4)" : "none"}}>
                    <span style={{fontSize:15, color: isWage ? "white" : "var(--muted)", fontWeight: isWage ? 700 : 400}}>{label}</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: isWage ? "#FA8059" : "var(--muted)"}}>{amount}</span>
                  </div>
                ))}
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0 0", marginTop:8, borderTop:"2px solid #FA8059"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"white"}}>TOTAL COMPENSATION</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059"}}>$81.00/hr</span>
                </div>
                <div style={{fontSize:13, color:"var(--muted)", marginTop:12, fontStyle:"italic"}}>* Example figures only. Actual rates vary by local, market, and contract year. Your base wage is what appears on your paycheck — everything else is paid directly to funds on your behalf.</div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* WHY UNION WINS */}`;

if (!code.includes(oldSection)) {
  console.error('ERROR: section marker not found');
  process.exit(1);
}
code = code.replace(oldSection, healthSection);
console.log('✅ Health insurance section added');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add health insurance and full compensation breakdown to retirement page" && git push\n');
