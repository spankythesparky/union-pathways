const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Find retirement page boundaries
const retStart = code.indexOf('        {page === "retirement" && (');
const retEnd = code.indexOf('        {page === "health" && (');

if (retStart === -1 || retEnd === -1) {
  console.error('ERROR: Could not find retirement page markers');
  process.exit(1);
}

const retPage = code.slice(retStart, retEnd);

// Replace all emoji occurrences in the retirement page
const emojiReplacements = [
  // Table header/icons
  ['✅ Yes — for life', 'Yes — for life'],
  ['✅ Yes — fixed amount', 'Yes — fixed amount'],
  ['❌ No — market dependent', 'No — market dependent'],
  ['✅ Yes', 'Yes'],
  ['❌ No', 'No'],
  ['✅ Very common', 'Very common'],
  ['✅ Very low', 'Very low'],
  ['Higher — market risk', 'Higher — market risk'],
  // Impact card icons - replace with numbered system
  ['<div className="impact-icon">📋</div>', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>01</div>'],
  ['<div className="impact-icon">🔢</div>', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>02</div>'],
  ['<div className="impact-icon">⭐</div>', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>03</div>'],
  ['<div className="impact-icon">🏗️</div>', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>04</div>'],
  // Annuity section icons
  ['<div className="impact-icon">💵</div>', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>01</div>'],
  ['<div className="impact-icon">🔄</div>', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>02</div>'],
  // 401k section
  ['<div className="impact-icon">📉</div>', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>02</div>'],
  // Comparison grid
  ['🏗️ Union Construction Worker', 'Union Construction Worker'],
  ['💼 Typical Non-Union Job', 'Typical Non-Union Job'],
  // Checklist items
  ['✅ Defined benefit pension', 'Pension — defined benefit'],
  ['✅ Annuity account', 'Annuity account'],
  ['✅ Health insurance', 'Health insurance'],
  ['✅ Social Security', 'Social Security'],
  ['✅ Optional 401k', 'Optional 401k'],
  ['✅ All of the above funded largely by EMPLOYER contributions', 'All of the above funded largely by employer contributions'],
  ['❌ No pension (most private employers eliminated these)', 'No pension — most private employers eliminated these'],
  ['❌ No annuity', 'No annuity'],
  ['⚠️ 401k — YOU fund it, market risk, no guarantee', '401k — you fund it, market risk, no guarantee'],
  ['⚠️ Health insurance — often expensive premiums', 'Health insurance — often expensive premiums'],
  ['❌ Retirement security largely YOUR responsibility', 'Retirement security largely your responsibility'],
];

let updatedRetPage = retPage;
emojiReplacements.forEach(([from, to]) => {
  updatedRetPage = updatedRetPage.split(from).join(to);
});

// Also remove any remaining impact-icon divs with emojis using regex
updatedRetPage = updatedRetPage.replace(/<div className="impact-icon">[^<]*<\/div>/g, '');

code = code.slice(0, retStart) + updatedRetPage + code.slice(retEnd);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Retirement page modernized — emojis removed');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: modernize retirement page, remove all emojis" && git push\n');
