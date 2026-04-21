const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Fix stat-card
code = code.replace(
  '        .stat-card {\n          background: var(--card-bg); border: 1px solid var(--wire);\n          border-radius: 12px; padding: 20px;\n        }',
  '        .stat-card {\n          background: transparent;\n          border: 1px solid rgba(250,128,89,0.2);\n          border-radius: 12px; padding: 20px 24px;\n        }'
);
console.log('✅ Fixed stat-card CSS');

// Fix career-stage
code = code.replace(
  '        .career-stage {\n          display: flex; gap: 20px;\n          padding: 24px 0;\n          border-bottom: 1px solid rgba(255,255,255,0.05);\n          align-items: flex-start;\n        }',
  '        .career-stage {\n          display: flex; gap: 20px;\n          padding: 22px 24px;\n          border: 1px solid rgba(255,255,255,0.07);\n          border-radius: 14px;\n          background: rgba(255,255,255,0.02);\n          margin-bottom: 12px;\n          align-items: flex-start;\n          transition: border-color 0.2s, background 0.2s;\n        }\n        .career-stage:hover {\n          background: rgba(250,128,89,0.04);\n          border-color: rgba(250,128,89,0.2);\n        }'
);
console.log('✅ Fixed career-stage CSS');

// Fix stage-icon
code = code.replace(
  '        .stage-icon {\n          font-size: 28px; min-width: 44px; text-align: center;\n          padding-top: 4px;\n        }',
  '        .stage-icon {\n          min-width: 44px; height: 44px;\n          display: flex; align-items: center; justify-content: center;\n          border: 1px solid rgba(250,128,89,0.3);\n          border-radius: 8px;\n          font-size: 13px; font-weight: 800;\n          font-family: \'Barlow Condensed\', sans-serif;\n          color: #FA8059; letter-spacing: 0.05em;\n          flex-shrink: 0;\n        }'
);
console.log('✅ Fixed stage-icon CSS');

// Fix benefit-card
code = code.replace(
  '        .benefit-card {\n          background: var(--card-bg); border: 1px solid var(--wire);\n          border-radius: 10px; padding: 18px;\n        }',
  '        .benefit-card {\n          background: rgba(255,255,255,0.02);\n          border: 1px solid rgba(255,255,255,0.07);\n          border-radius: 14px; padding: 24px 20px;\n          transition: border-color 0.2s, background 0.2s;\n        }\n        .benefit-card:hover {\n          background: rgba(250,128,89,0.04);\n          border-color: rgba(250,128,89,0.2);\n        }'
);
console.log('✅ Fixed benefit-card CSS');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: modernize career page cards and stage icons" && git push\n');
