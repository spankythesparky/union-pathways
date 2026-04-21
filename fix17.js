const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // ── 1. GRADIENT ACCENT BUTTON (btn-primary) ──────────────────────────────
  [
    `.btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--yellow);
          color: #000;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 13px 28px; border-radius: 10px;
          border: none; cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #ffd740; }`,
    `.btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #FA8059 0%, #f96340 100%);
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 13px 28px; border-radius: 50px;
          border: none; cursor: pointer;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(250,128,89,0.35);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(250,128,89,0.5); background: linear-gradient(135deg, #fb9070 0%, #fa7050 100%); }`
  ],

  // ── 2. GHOST BUTTON ───────────────────────────────────────────────────────
  [
    `.btn-ghost {
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent;
          color: var(--muted);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 12px 24px; border-radius: 10px;
          border: 1.5px solid var(--wire);
          cursor: pointer; text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: var(--yellow); color: var(--yellow); }`,
    `.btn-ghost {
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent;
          color: var(--muted);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 12px 24px; border-radius: 50px;
          border: 1.5px solid var(--wire);
          cursor: pointer; text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-ghost:hover { border-color: #FA8059; color: #FA8059; box-shadow: 0 0 20px rgba(250,128,89,0.15); }`
  ],

  // ── 3. SEARCH BUTTON ──────────────────────────────────────────────────────
  [
    `.btn-search {
          background: var(--yellow);
          color: #000;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 14px 28px; border-radius: 10px;
          border: none; cursor: pointer; white-space: nowrap;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-search:hover { background: #ffd740; transform: translateY(-1px); }
        .btn-search:active { transform: translateY(0); }
        .btn-search:disabled { opacity: 0.6; cursor: not-allowed; }`,
    `.btn-search {
          background: linear-gradient(135deg, #FA8059 0%, #f96340 100%);
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 14px 28px; border-radius: 50px;
          border: none; cursor: pointer; white-space: nowrap;
          box-shadow: 0 4px 20px rgba(250,128,89,0.35);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-search:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(250,128,89,0.5); }
        .btn-search:active { transform: translateY(0); }
        .btn-search:disabled { opacity: 0.6; cursor: not-allowed; }`
  ],

  // ── 4. SEARCH CARD — glassmorphism ────────────────────────────────────────
  [
    `.search-card {
          background: var(--steel-light);
          border: 1px solid var(--wire);
          border-radius: 16px;
          padding: 28px 32px;
          width: 100%; max-width: 620px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,24,0.05);
          transition: transform 0.3s ease;
        }
        .search-card:hover { transform: translateY(-2px); }`,
    `.search-card {
          background: rgba(34,48,61,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(250,128,89,0.15);
          border-radius: 24px;
          padding: 28px 32px;
          width: 100%; max-width: 620px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(250,128,89,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .search-card:hover { transform: translateY(-3px); box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(250,128,89,0.15); }`
  ],

  // ── 5. LOCAL CARD — glassmorphism ─────────────────────────────────────────
  [
    `.local-card {
          background: var(--card-bg);
          border: 1px solid var(--wire);`,
    `.local-card {
          background: rgba(26,44,58,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(58,80,104,0.5);`
  ],

  // ── 6. LOCAL CARD HOVER ───────────────────────────────────────────────────
  [
    `.local-card:hover {
          border-color: rgba(245,197,24,0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }`,
    `.local-card:hover {
          border-color: rgba(250,128,89,0.4);
          box-shadow: 0 8px 40px rgba(250,128,89,0.12), 0 0 0 1px rgba(250,128,89,0.15);
          transform: translateY(-3px);
        }`
  ],

  // ── 7. HERO GRID — update glow color ─────────────────────────────────────
  [
    `linear-gradient(rgba(245,197,24,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,197,24,0.04) 1px, transparent 1px);`,
    `linear-gradient(rgba(250,128,89,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,128,89,0.05) 1px, transparent 1px);`
  ],

  // ── 8. HERO GLOW ──────────────────────────────────────────────────────────
  [
    `background: radial-gradient(ellipse, rgba(245,197,24,0.08) 0%, transparent 70%);`,
    `background: radial-gradient(ellipse, rgba(250,128,89,0.12) 0%, transparent 70%);`
  ],

  // ── 9. STAT CARDS — glassmorphism ─────────────────────────────────────────
  [
    `.stat-card {
          background: rgba(245,197,24,0.06);
          border: 1px solid rgba(245,197,24,0.18);`,
    `.stat-card {
          background: rgba(250,128,89,0.06);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(250,128,89,0.15);`
  ],

  // ── 10. HERO TITLE — tighter, more modern ────────────────────────────────
  [
    `.hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(52px, 10vw, 96px);
          font-weight: 900;
          line-height: 0.95;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 24px;
        }`,
    `.hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(52px, 10vw, 96px);
          font-weight: 900;
          line-height: 0.92;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          text-shadow: 0 2px 40px rgba(0,0,0,0.5);
        }`
  ],

  // ── 11. WEBSITE BUTTON ────────────────────────────────────────────────────
  [
    `.btn-website {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 8px;
          padding: 9px 16px;
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn-website:hover { border-color: var(--yellow); color: var(--yellow); }`,
    `.btn-website {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(250,128,89,0.08);
          border: 1px solid rgba(250,128,89,0.2);
          border-radius: 50px;
          padding: 9px 18px;
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-website:hover { border-color: #FA8059; color: #FA8059; background: rgba(250,128,89,0.15); box-shadow: 0 0 16px rgba(250,128,89,0.2); }`
  ],

  // ── 12. INPUT FOCUS GLOW ─────────────────────────────────────────────────
  [
    `box-shadow: 0 0 0 3px rgba(245,197,24,0.1);`,
    `box-shadow: 0 0 0 3px rgba(250,128,89,0.15); border-color: rgba(250,128,89,0.5);`
  ],

  // ── 13. NAV TRADES BUTTON ─────────────────────────────────────────────────
  [
    `.nav-trades-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.25);
          border-radius: 8px;`,
    `.nav-trades-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(250,128,89,0.08);
          border: 1px solid rgba(250,128,89,0.25);
          border-radius: 50px;`
  ],

  // ── 14. NAV TRADES BUTTON HOVER ───────────────────────────────────────────
  [
    `.nav-trades-btn:hover, .nav-trades-btn.open {
          background: rgba(245,197,24,0.15);
          border-color: var(--yellow);
          color: var(--yellow);
        }`,
    `.nav-trades-btn:hover, .nav-trades-btn.open {
          background: rgba(250,128,89,0.15);
          border-color: #FA8059;
          color: #FA8059;
          box-shadow: 0 0 20px rgba(250,128,89,0.2);
        }`
  ],
];

let count = 0;
for (const [oldStr, newStr] of replacements) {
  if (code.includes(oldStr)) {
    code = code.replace(oldStr, newStr);
    count++;
  } else {
    console.warn(`⚠️  Not found: ${oldStr.slice(0, 60)}...`);
  }
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`✅ Applied ${count}/${replacements.length} modern UI updates`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: modern UI refresh — glass cards, gradients, pill buttons" && git push\n');
