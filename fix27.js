const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD NAV LINK ─────────────────────────────────────────────────────────
const oldNavHistory = `            <button className={\`nav-link \${page==="history"?"active":""}\`} onClick={() => setPage("history")}>{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</button>`;
const newNavHistory = `            <button className={\`nav-link \${page==="history"?"active":""}\`} onClick={() => setPage("history")}>{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</button>
            <button className={\`nav-link \${page==="retirement"?"active":""}\`} onClick={() => setPage("retirement")}>{lang==="es" ? "Jubilación" : lang==="pl" ? "Emerytura" : "Retirement"}</button>`;

if (!code.includes(oldNavHistory)) { console.error('ERROR: nav history link not found'); process.exit(1); }
code = code.replace(oldNavHistory, newNavHistory);
console.log('✅ Nav link added');

// ─── 2. ADD PAGE META ─────────────────────────────────────────────────────────
code = code.replace(
  `      veterans:  { title: "Union Pathways — Veterans & the Union Trades"`,
  `      retirement: { title: "Union Pathways — 401k vs Annuity vs Pension Explained", desc: "Learn the difference between a 401k, annuity, and pension — and why union construction trades offer some of the best retirement benefits in America." },\n      veterans:  { title: "Union Pathways — Veterans & the Union Trades"`
);
console.log('✅ Page meta added');

// ─── 3. ADD VALID PAGE ────────────────────────────────────────────────────────
code = code.replace(
  `const validPages = ['home','quiz','careers','checklist','veterans','history','contact'];`,
  `const validPages = ['home','quiz','careers','checklist','veterans','history','retirement','contact'];`
);
console.log('✅ Valid pages updated');

// ─── 4. ADD PAGE JSX ──────────────────────────────────────────────────────────
const pageMarker = `        {page === "veterans" &&`;

const retirementPage = `        {page === "retirement" && (
          <div>
            {/* HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">💰 Your Future, Built on the Job</div>
              <h1 className="history-title">
                401k vs Annuity vs <span className="accent">Pension</span>
              </h1>
              <p className="history-subtitle">
                Three different ways to save for retirement — and union construction trades offer all three. Here's what each one means in plain English.
              </p>
            </div>

            {/* QUICK COMPARISON TABLE */}
            <div className="history-section">
              <div className="history-section-title">The <span className="accent">Quick</span> Answer</div>
              <div className="history-section-sub">Before diving in — here's the 30-second version.</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%", borderCollapse:"collapse", fontSize:14}}>
                  <thead>
                    <tr style={{background:"rgba(250,128,89,0.12)", borderBottom:"2px solid #FA8059"}}>
                      {["", "Pension", "Annuity", "401k"].map(h => (
                        <th key={h} style={{padding:"14px 16px", textAlign:"left", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:800, color: h==="Pension" ? "#FA8059" : "white", letterSpacing:"0.05em"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Who funds it?", "Employer pays in", "Employer pays in", "You pay in (employer may match)"],
                      ["Guaranteed payment?", "✅ Yes — for life", "✅ Yes — fixed amount", "❌ No — market dependent"],
                      ["You control investments?", "❌ No", "❌ No", "✅ Yes"],
                      ["Monthly check in retirement?", "✅ Yes", "✅ Yes", "You withdraw as needed"],
                      ["Common in union trades?", "✅ Very common", "✅ Very common", "Sometimes offered too"],
                      ["Risk to worker?", "Very low", "Very low", "Higher — market risk"],
                    ].map((row, i) => (
                      <tr key={i} style={{borderBottom:"1px solid rgba(58,80,104,0.4)", background: i%2===0 ? "rgba(34,48,61,0.3)" : "transparent"}}>
                        {row.map((cell, j) => (
                          <td key={j} style={{padding:"12px 16px", color: j===0 ? "white" : "var(--muted)", fontWeight: j===0 ? 700 : 400}}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <hr className="divider-line" />

            {/* PENSION */}
            <div className="history-section">
              <div className="history-section-title">🏆 The <span className="accent">Pension</span> — The Gold Standard</div>
              <div className="history-section-sub">The most valuable retirement benefit you can have — and union trades still offer it.</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">📋</div>
                  <div className="impact-title">What It Is</div>
                  <div className="impact-desc">A pension — also called a "defined benefit plan" — is a retirement account funded entirely by your employer. You don't contribute anything out of your paycheck. When you retire, you receive a guaranteed monthly check for the rest of your life, no matter how long you live.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🔢</div>
                  <div className="impact-title">How It's Calculated</div>
                  <div className="impact-desc">Your monthly pension check is typically calculated based on how many years you worked and your average wage. Example: 30 years of work × 2% × $60,000 average salary = $36,000/year pension. That's $3,000/month, every month, for life.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">⭐</div>
                  <div className="impact-title">Why It's So Valuable</div>
                  <div className="impact-desc">Most Americans have no pension. Only about 12% of private sector workers have one. Union construction workers are among the few who still do. You can't outlive a pension — it pays until you die, and often continues for a spouse after you're gone.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🏗️</div>
                  <div className="impact-title">In Union Trades</div>
                  <div className="impact-desc">Nearly every major construction union — IBEW, UA, UBC, BAC, Ironworkers, Laborers, and more — offers a defined benefit pension plan. Employers contribute a set dollar amount per hour you work. After enough years of service, you retire with a guaranteed monthly check for life.</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">"A union pension means you can't outlive your money. Work 30 years as a journeyman, and retire knowing exactly what you'll get every month — for the rest of your life."</div>
                <div className="quote-author">— How Union Pension Plans Work</div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* ANNUITY */}
            <div className="history-section">
              <div className="history-section-title">📈 The <span className="accent">Annuity</span> — Your Second Check</div>
              <div className="history-section-sub">Think of it as a bonus retirement account on top of your pension.</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">📋</div>
                  <div className="impact-title">What It Is</div>
                  <div className="impact-desc">An annuity (sometimes called a "defined contribution" plan) is an additional retirement account that your employer funds. In most union contracts, employers contribute a set amount per hour worked directly into your annuity account. It builds up over your career and pays out when you retire.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">💵</div>
                  <div className="impact-title">How It Works</div>
                  <div className="impact-desc">Example: Your union contract says the employer contributes $3.50/hr to your annuity. If you work 2,000 hours a year, that's $7,000/year going into your account — without you contributing a single dollar. Over 30 years, that could easily grow to $400,000+.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🔄</div>
                  <div className="impact-title">Annuity vs. Pension</div>
                  <div className="impact-desc">The key difference: a pension pays a fixed monthly amount for life. An annuity is more like a savings account — it grows over time and you can often choose how to draw it down in retirement. Some annuities also convert to a monthly payment at retirement.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🏗️</div>
                  <div className="impact-title">In Union Trades</div>
                  <div className="impact-desc">Many union construction contracts include BOTH a pension AND an annuity. So you're building two separate retirement accounts simultaneously — both funded by your employer — on top of Social Security. This is extremely rare outside of union jobs.</div>
                </div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* 401k */}
            <div className="history-section">
              <div className="history-section-title">📊 The <span className="accent">401k</span> — The Most Common Plan</div>
              <div className="history-section-sub">You've probably heard of this one — here's what you need to know.</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">📋</div>
                  <div className="impact-title">What It Is</div>
                  <div className="impact-desc">A 401k is a retirement savings account where YOU contribute a portion of your paycheck — before taxes — and the money grows in investments (stocks, bonds, mutual funds). Your employer may match some of your contributions, but you're doing most of the funding yourself.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">📉</div>
                  <div className="impact-title">The Risk</div>
                  <div className="impact-desc">Your 401k balance goes up and down with the stock market. If the market crashes right before you retire — like 2008 — your savings can drop 30-40% overnight. Unlike a pension, there's no guaranteed amount. You could run out of money if you live longer than expected.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">✅</div>
                  <div className="impact-title">The Benefits</div>
                  <div className="impact-desc">You control where your money is invested. Contributions are pre-tax, lowering your taxable income now. Employer matches are essentially free money. You can take it with you if you change jobs (unlike some pensions that require years of service to vest).</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🏗️</div>
                  <div className="impact-title">In Union Trades</div>
                  <div className="impact-desc">Some unions offer a 401k in addition to a pension and annuity. Others don't need to — because the pension and annuity already do what a 401k does, but better. In most cases, a union pension + annuity beats a 401k because it's guaranteed and employer-funded.</div>
                </div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* WHY UNION WINS */}
            <div className="history-section">
              <div className="history-section-title">Why <span className="accent">Union Retirement</span> Beats Almost Everything</div>
              <div className="history-section-sub">Here's what a typical union construction retirement package looks like compared to a standard job.</div>

              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:32}}>
                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"28px 24px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"#FA8059", marginBottom:16}}>🏗️ Union Construction Worker</div>
                  {["✅ Defined benefit pension — guaranteed monthly check for life", "✅ Annuity account — employer-funded, builds over career", "✅ Health insurance — full family coverage, often free", "✅ Social Security", "✅ Optional 401k at some locals", "✅ All of the above funded largely by EMPLOYER contributions"].map((item, i) => (
                    <div key={i} style={{fontSize:14, color:"var(--muted)", marginBottom:8, lineHeight:1.5}}>{item}</div>
                  ))}
                </div>
                <div style={{background:"rgba(34,48,61,0.4)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"28px 24px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"white", marginBottom:16}}>💼 Typical Non-Union Job</div>
                  {["❌ No pension (most private employers eliminated these)", "❌ No annuity", "⚠️ 401k — YOU fund it, market risk, no guarantee", "⚠️ Health insurance — often expensive premiums", "✅ Social Security", "❌ Retirement security largely YOUR responsibility"].map((item, i) => (
                    <div key={i} style={{fontSize:14, color:"var(--muted)", marginBottom:8, lineHeight:1.5}}>{item}</div>
                  ))}
                </div>
              </div>

              <div className="quote-block">
                <div className="quote-text">"When you add up the pension, annuity, and benefits — a journeyman electrician's total compensation package can exceed $100/hr in major markets. Most people don't realize how much of that goes toward your future."</div>
                <div className="quote-author">— The True Value of a Union Package</div>
              </div>

              <div style={{textAlign:"center", marginTop:48}}>
                <button className="btn-primary" onClick={() => { setPage("home"); window.scrollTo(0,0); }}>
                  Find Your Union Local →
                </button>
              </div>
            </div>
          </div>
        )}

`;

if (!code.includes(pageMarker)) { console.error('ERROR: veterans page marker not found'); process.exit(1); }
code = code.replace(pageMarker, retirementPage + pageMarker);
console.log('✅ Retirement page JSX added');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Retirement Benefits page (401k vs Annuity vs Pension)" && git push\n');
