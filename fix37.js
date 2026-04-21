const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. REMOVE PAID HOLIDAYS from all 3 languages ────────────────────────────
const removals = [
  `        { label: "Paid Holidays", icon: "📅", desc: "Union contracts typically include paid holidays, vacation funds, and sick leave." },\n`,
  `        { label: "Días Festivos Pagados", icon: "📅", desc: "Los contratos sindicales típicamente incluyen días festivos pagados, fondos de vacaciones y licencias por enfermedad." },\n`,
  `        { label: "Płatne święta", icon: "📅", desc: "Umowy związkowe zazwyczaj obejmują płatne święta, fundusze urlopowe i zwolnienia chorobowe." },\n`,
];

removals.forEach(r => {
  if (code.includes(r)) {
    code = code.replace(r, '');
    console.log('✅ Removed Paid Holidays entry');
  } else {
    console.log('⚠️  Entry not found (may already be removed)');
  }
});

// ─── 2. REPLACE emoji icons in stages with clean numbered labels ──────────────
code = code.replace(/{ stage: "Apprentice"([^}]+)icon: "📋"/g, '{ stage: "Apprentice"$1icon: "01"');
code = code.replace(/{ stage: "Journeyman"([^}]+)icon: "🔨"/g, '{ stage: "Journeyman"$1icon: "02"');
code = code.replace(/{ stage: "Foreman"([^}]+)icon: "📐"/g, '{ stage: "Foreman"$1icon: "03"');
code = code.replace(/{ stage: "General Foreman \/ Super"([^}]+)icon: "🏗️"/g, '{ stage: "General Foreman / Super"$1icon: "04"');
code = code.replace(/{ stage: "Master \/ Business Owner"([^}]+)icon: "⭐"/g, '{ stage: "Master / Business Owner"$1icon: "05"');

// ES
code = code.replace(/{ stage: "Aprendiz"([^}]+)icon: "📋"/g, '{ stage: "Aprendiz"$1icon: "01"');
code = code.replace(/{ stage: "Oficial"([^}]+)icon: "🔨"/g, '{ stage: "Oficial"$1icon: "02"');
code = code.replace(/{ stage: "Capataz", years([^}]+)icon: "📐"/g, '{ stage: "Capataz", years$1icon: "03"');
code = code.replace(/{ stage: "Capataz General \/ Superintendent"([^}]+)icon: "🏗️"/g, '{ stage: "Capataz General / Superintendent"$1icon: "04"');
code = code.replace(/{ stage: "Maestro \/ Propietario"([^}]+)icon: "⭐"/g, '{ stage: "Maestro / Propietario"$1icon: "05"');

// PL
code = code.replace(/{ stage: "Praktykant"([^}]+)icon: "📋"/g, '{ stage: "Praktykant"$1icon: "01"');
code = code.replace(/{ stage: "Czeladnik"([^}]+)icon: "🔨"/g, '{ stage: "Czeladnik"$1icon: "02"');
code = code.replace(/{ stage: "Brygadzista", years([^}]+)icon: "📐"/g, '{ stage: "Brygadzista", years$1icon: "03"');
code = code.replace(/{ stage: "Brygadzista Generalny \/ Superintendent"([^}]+)icon: "🏗️"/g, '{ stage: "Brygadzista Generalny / Superintendent"$1icon: "04"');
code = code.replace(/{ stage: "Mistrz \/ Właściciel firmy"([^}]+)icon: "⭐"/g, '{ stage: "Mistrz / Właściciel firmy"$1icon: "05"');

console.log('✅ Replaced stage emojis with numbers');

// ─── 3. REPLACE benefit icons with clean labels ───────────────────────────────
const benefitIconReplacements = [
  ['"💰"', '"$"'],
  ['"🏥"', '"+"'],
  ['"🎓"', '"◆"'],
  ['"📈"', '"↑"'],
  ['"🦺"', '"✓"'],
];
benefitIconReplacements.forEach(([from, to]) => {
  code = code.split(`icon: ${from}`).join(`icon: ${to}`);
});
console.log('✅ Replaced benefit icons with clean symbols');

// ─── 4. MODERNIZE career page CSS ────────────────────────────────────────────
const oldStageIcon = `        .stage-icon {
          width: 44px; height: 44px;
          background: rgba(250,128,89,0.1);
          border: 1px solid rgba(250,128,89,0.25);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }`;

const newStageIcon = `        .stage-icon {
          width: 44px; height: 44px;
          background: transparent;
          border: 1px solid rgba(250,128,89,0.3);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; flex-shrink: 0;
          font-family: 'Barlow Condensed', sans-serif;
          color: #FA8059; letter-spacing: 0.05em;
        }`;

if (code.includes(oldStageIcon)) {
  code = code.replace(oldStageIcon, newStageIcon);
  console.log('✅ Modernized stage icon CSS');
} else {
  console.log('⚠️  Stage icon CSS not found');
}

const oldBenefitIcon = `        .benefit-icon { font-size: 22px; margin-bottom: 10px; }`;
const newBenefitIcon = `        .benefit-icon {
          width: 36px; height: 36px;
          background: transparent;
          border: 1px solid rgba(250,128,89,0.3);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900;
          font-family: 'Barlow Condensed', sans-serif;
          color: #FA8059; margin-bottom: 14px;
        }`;

if (code.includes(oldBenefitIcon)) {
  code = code.replace(oldBenefitIcon, newBenefitIcon);
  console.log('✅ Modernized benefit icon CSS');
} else {
  console.log('⚠️  Benefit icon CSS not found');
}

// ─── 5. MODERNIZE career stage card CSS ──────────────────────────────────────
const oldCareerStage = `        .career-stage {
          display: flex; gap: 18px; align-items: flex-start;
          background: var(--card-bg);
          border: 1px solid var(--wire);
          border-radius: 14px; padding: 20px;
        }`;

const newCareerStage = `        .career-stage {
          display: flex; gap: 18px; align-items: flex-start;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 22px 24px;
          transition: border-color 0.2s, background 0.2s;
        }
        .career-stage:hover {
          background: rgba(250,128,89,0.04);
          border-color: rgba(250,128,89,0.2);
        }`;

if (code.includes(oldCareerStage)) {
  code = code.replace(oldCareerStage, newCareerStage);
  console.log('✅ Modernized career stage card CSS');
} else {
  console.log('⚠️  Career stage CSS not found');
}

// ─── 6. MODERNIZE benefit card CSS ───────────────────────────────────────────
const oldBenefitCard = `        .benefit-card {
          background: var(--card-bg);
          border: 1px solid var(--wire);
          border-radius: 14px; padding: 20px;
          text-align: center;
        }`;

const newBenefitCard = `        .benefit-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 24px 20px;
          text-align: left;
          transition: border-color 0.2s, background 0.2s;
        }
        .benefit-card:hover {
          background: rgba(250,128,89,0.04);
          border-color: rgba(250,128,89,0.2);
        }`;

if (code.includes(oldBenefitCard)) {
  code = code.replace(oldBenefitCard, newBenefitCard);
  console.log('✅ Modernized benefit card CSS');
} else {
  console.log('⚠️  Benefit card CSS not found');
}

// ─── 7. MODERNIZE stat cards ──────────────────────────────────────────────────
const oldStatCard = `        .stat-card {
          background: rgba(250,128,89,0.06);
          border: 1px solid rgba(250,128,89,0.15);
          border-radius: 12px; padding: 16px 20px;
          text-align: center; flex: 1; min-width: 120px;
        }`;

const newStatCard = `        .stat-card {
          background: transparent;
          border: 1px solid rgba(250,128,89,0.2);
          border-radius: 12px; padding: 20px 24px;
          text-align: center; flex: 1; min-width: 120px;
        }`;

if (code.includes(oldStatCard)) {
  code = code.replace(oldStatCard, newStatCard);
  console.log('✅ Modernized stat card CSS');
} else {
  console.log('⚠️  Stat card CSS not found');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: modernize career page, remove paid holidays, clean up icons" && git push\n');
