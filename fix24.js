const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD NAV LINK ─────────────────────────────────────────────────────────
const oldNavVets = `            <button className={\`nav-link \${page==="veterans"?"active":""}\`} onClick={() => setPage("veterans")}>{t.navVets}</button>`;
const newNavVets = `            <button className={\`nav-link \${page==="history"?"active":""}\`} onClick={() => setPage("history")}>{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</button>
            <button className={\`nav-link \${page==="veterans"?"active":""}\`} onClick={() => setPage("veterans")}>{t.navVets}</button>`;

if (!code.includes(oldNavVets)) { console.error('ERROR: nav link marker not found'); process.exit(1); }
code = code.replace(oldNavVets, newNavVets);
console.log('✅ Nav link added');

// ─── 2. ADD CSS FOR HISTORY PAGE ──────────────────────────────────────────────
const cssMarker = '        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }';
const historyCss = `
        .history-hero {
          background: linear-gradient(180deg, rgba(250,128,89,0.12) 0%, transparent 100%);
          border-bottom: 1px solid rgba(250,128,89,0.15);
          padding: 80px 24px 64px;
          text-align: center;
        }
        .history-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #FA8059; margin-bottom: 16px;
        }
        .history-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(42px, 8vw, 80px);
          font-weight: 900; line-height: 0.95;
          text-transform: uppercase; letter-spacing: -0.02em;
          color: #fff; margin-bottom: 24px;
        }
        .history-title .accent { color: #FA8059; }
        .history-subtitle {
          font-size: 18px; color: var(--muted);
          max-width: 600px; margin: 0 auto;
          line-height: 1.6;
        }
        .history-stats {
          display: flex; justify-content: center;
          gap: 16px; flex-wrap: wrap;
          margin-top: 48px;
        }
        .history-stat {
          background: rgba(250,128,89,0.08);
          border: 1px solid rgba(250,128,89,0.2);
          border-radius: 16px; padding: 20px 28px;
          text-align: center; min-width: 130px;
        }
        .history-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 38px; font-weight: 900;
          color: #FA8059; line-height: 1;
        }
        .history-stat-label {
          font-size: 12px; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-top: 6px; font-weight: 600;
        }
        .history-section {
          max-width: 900px; margin: 0 auto;
          padding: 64px 24px;
        }
        .history-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900;
          text-transform: uppercase; letter-spacing: -0.01em;
          color: #fff; margin-bottom: 8px;
        }
        .history-section-title .accent { color: #FA8059; }
        .history-section-sub {
          font-size: 15px; color: var(--muted);
          margin-bottom: 40px; line-height: 1.6;
        }
        .timeline {
          position: relative;
          padding-left: 32px;
        }
        .timeline::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #FA8059, rgba(250,128,89,0.1));
        }
        .timeline-item {
          position: relative;
          margin-bottom: 40px;
          padding: 24px 28px;
          background: rgba(34,48,61,0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(58,80,104,0.4);
          border-radius: 16px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .timeline-item:hover {
          border-color: rgba(250,128,89,0.3);
          transform: translateX(4px);
        }
        .timeline-dot {
          position: absolute;
          left: -40px; top: 28px;
          width: 16px; height: 16px;
          background: #FA8059;
          border-radius: 50%;
          border: 3px solid #000;
          box-shadow: 0 0 12px rgba(250,128,89,0.6);
        }
        .timeline-year {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #FA8059; margin-bottom: 6px;
        }
        .timeline-event {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #fff; margin-bottom: 8px;
          line-height: 1.2;
        }
        .timeline-desc {
          font-size: 14px; color: var(--muted);
          line-height: 1.6;
        }
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px; margin-top: 8px;
        }
        .impact-card {
          background: rgba(34,48,61,0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(58,80,104,0.4);
          border-radius: 20px;
          padding: 28px 24px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .impact-card:hover {
          border-color: rgba(250,128,89,0.3);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(250,128,89,0.1);
        }
        .impact-icon {
          font-size: 36px; margin-bottom: 16px;
        }
        .impact-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #fff; margin-bottom: 8px;
        }
        .impact-desc {
          font-size: 14px; color: var(--muted);
          line-height: 1.6;
        }
        .quote-block {
          background: rgba(250,128,89,0.06);
          border-left: 4px solid #FA8059;
          border-radius: 0 16px 16px 0;
          padding: 28px 32px;
          margin: 40px 0;
        }
        .quote-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 26px; font-weight: 700;
          color: #fff; line-height: 1.3;
          margin-bottom: 12px;
          font-style: italic;
        }
        .quote-author {
          font-size: 13px; color: #FA8059;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .divider-line {
          border: none;
          border-top: 1px solid rgba(58,80,104,0.4);
          margin: 0;
        }
`;
code = code.replace(cssMarker, historyCss + cssMarker);
console.log('✅ History CSS added');

// ─── 3. ADD HISTORY PAGE JSX ──────────────────────────────────────────────────
const pageMarker = `        {page === "veterans" &&`;
const historyPage = `        {page === "history" && (
          <div>
            {/* HISTORY HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">🏗️ The Foundation of the American Middle Class</div>
              <h1 className="history-title">
                Built by <span className="accent">Union Hands</span>
              </h1>
              <p className="history-subtitle">
                The 40-hour work week. The weekend. Child labor laws. Workplace safety. Health benefits. Retirement. Every one of these was fought for — and won — by union workers.
              </p>
              <div className="history-stats">
                {[
                  { num: "150+", label: "Years of Fighting for Workers" },
                  { num: "16M+", label: "Union Members in the US" },
                  { num: "18%", label: "Higher Wages for Union Workers" },
                  { num: "$0", label: "Cost to Join an Apprenticeship" },
                ].map(s => (
                  <div key={s.label} className="history-stat">
                    <div className="history-stat-num">{s.num}</div>
                    <div className="history-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="history-section">
              <div className="history-section-title">A <span className="accent">Timeline</span> of the Labor Movement</div>
              <div className="history-section-sub">From the first strikes to landmark legislation — here's how unions built America.</div>
              <div className="timeline">
                {[
                  { year: "1794", event: "First American Union Formed", desc: "The Federal Society of Journeymen Cordwainers forms in Philadelphia — considered the first trade union in the United States. Workers united to demand fair wages and better conditions." },
                  { year: "1869", event: "Knights of Labor Founded", desc: "One of the first major labor organizations in the US opens its doors to all workers regardless of race, gender, or skill level. A radical idea for the time." },
                  { year: "1886", event: "The Haymarket Affair", desc: "Chicago workers strike for the 8-hour workday. A turning point in labor history that galvanized the movement and eventually led to the 8-hour standard worldwide." },
                  { year: "1886", event: "AFL Founded", desc: "Samuel Gompers founds the American Federation of Labor, organizing skilled craft workers into trade unions — the model that still exists today in construction." },
                  { year: "1911", event: "Triangle Shirtwaist Fire", desc: "146 garment workers die in New York City because fire exits were locked. The tragedy shocked the nation and led directly to major workplace safety legislation." },
                  { year: "1935", event: "The Wagner Act", desc: "Congress passes the National Labor Relations Act, guaranteeing workers the right to organize, join unions, and engage in collective bargaining. A watershed moment." },
                  { year: "1938", event: "The Fair Labor Standards Act", desc: "The federal minimum wage is established. The 40-hour work week becomes law. Child labor is severely restricted. Overtime pay is mandated. Unions made this happen." },
                  { year: "1955", event: "AFL-CIO Merger", desc: "The AFL and CIO merge into the most powerful labor federation in American history, representing 15 million workers and reshaping the political landscape." },
                  { year: "1970", event: "OSHA Created", desc: "The Occupational Safety and Health Administration is established after decades of union advocacy. Workers finally have a federal agency protecting them on the job." },
                  { year: "1974", event: "ERISA — Protecting Pensions", desc: "The Employee Retirement Income Security Act protects union workers' pensions and retirement benefits — ensuring that decades of hard work translate into a secure retirement." },
                  { year: "Today", event: "The Trades Lead the Way", desc: "Construction unions continue to set the standard — negotiating the highest wages, best benefits, and safest job sites in the industry. The fight goes on." },
                ].map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-event">{item.event}</div>
                    <div className="timeline-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line" />

            {/* WHAT UNIONS WON */}
            <div className="history-section">
              <div className="history-section-title">What <span className="accent">Unions Won</span> for Every American</div>
              <div className="history-section-sub">Whether you're union or not, your life is better because of what union workers fought for.</div>
              <div className="impact-grid">
                {[
                  { icon: "📅", title: "The Weekend", desc: "Before unions, workers labored 6 or 7 days a week. The two-day weekend was a union victory — fought for and won by organized labor in the early 20th century." },
                  { icon: "⏰", title: "The 8-Hour Day", desc: "'8 hours for work, 8 hours for rest, 8 hours for what we will.' Union workers fought for decades to limit the working day from 16+ hours to 8." },
                  { icon: "👶", title: "End of Child Labor", desc: "Children as young as 5 worked in mines and factories before unions pushed for child labor laws. The Fair Labor Standards Act of 1938 finally banned most child labor." },
                  { icon: "🏥", title: "Health Insurance", desc: "Employer-provided health insurance became standard in America because unions negotiated it into contracts — and other employers had to follow to compete for workers." },
                  { icon: "💰", title: "Minimum Wage", desc: "There was no minimum wage before unions fought for it. The first federal minimum wage of $0.25/hr in 1938 was a union victory." },
                  { icon: "🦺", title: "Workplace Safety", desc: "OSHA, hard hats, safety harnesses, fire exits — union workers demanded these protections and eventually got them written into law for all American workers." },
                  { icon: "📈", title: "Overtime Pay", desc: "Time-and-a-half for overtime? That's a union win. Before the FLSA, employers could work you unlimited hours with no extra pay." },
                  { icon: "🎓", title: "Paid Apprenticeships", desc: "The union apprenticeship model — earn while you learn, no student debt — is the gold standard of workforce training. Built by unions, for workers." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div className="impact-icon">{item.icon}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line" />

            {/* QUOTES */}
            <div className="history-section">
              <div className="history-section-title">Words that <span className="accent">Moved</span> a Movement</div>
              <div className="history-section-sub">The voices who shaped the labor movement.</div>
              {[
                { quote: "The labor movement is the organized effort of workers to improve their conditions through collective action. Without it, there is no middle class.", author: "Franklin D. Roosevelt" },
                { quote: "The eight-hour day and the five-day week did not come to you as a gift. They came as a result of the organized labor movement.", author: "Samuel Gompers, AFL Founder" },
                { quote: "What the working people of this country need is not charity, not sympathy — but justice.", author: "Eugene V. Debs" },
                { quote: "Union is strength. Workers without unions are like birds without wings.", author: "César Chávez" },
              ].map((q, i) => (
                <div key={i} className="quote-block">
                  <div className="quote-text">"{q.quote}"</div>
                  <div className="quote-author">— {q.author}</div>
                </div>
              ))}
            </div>

            <hr className="divider-line" />

            {/* WHY IT MATTERS TODAY */}
            <div className="history-section">
              <div className="history-section-title">Why It Matters <span className="accent">Today</span></div>
              <div className="history-section-sub">The fight isn't over — but the trades are leading the way.</div>
              <div className="impact-grid">
                {[
                  { icon: "💵", title: "Union Wage Premium", desc: "Union workers earn 18% more on average than non-union workers doing the same job. In construction, that gap is even larger." },
                  { icon: "🏗️", title: "The Trades Are Booming", desc: "America needs 500,000+ new construction workers. Unions offer the fastest path to a high-paying career with zero student debt." },
                  { icon: "🤝", title: "Collective Bargaining Works", desc: "When workers negotiate together, they win together. Union contracts set the floor for wages, safety, and benefits — and non-union employers have to compete." },
                  { icon: "🌎", title: "Building America's Future", desc: "Every bridge, hospital, school, and data center in America is built by skilled tradespeople. Union workers build it safer, build it better, and build it to last." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div className="impact-icon">{item.icon}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
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
code = code.replace(pageMarker, historyPage + pageMarker);
console.log('✅ History page JSX added');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Union History page" && git push\n');
