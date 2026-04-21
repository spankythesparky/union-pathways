const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Find retirement page boundaries
const retStart = code.indexOf('        {page === "retirement" && (');
const retEnd = code.indexOf('        {page === "health" && (');

let ret = code.slice(retStart, retEnd);

// Replace table checkmarks with clean text
ret = ret.replace(/"\u2705 Yes \u2014 for life"/g, '"Yes, for life"');
ret = ret.replace(/"\u2705 Yes \u2014 fixed amount"/g, '"Yes, fixed amount"');
ret = ret.replace(/"\u274c No \u2014 market dependent"/g, '"No, market dependent"');
ret = ret.replace(/"\u2705 Yes"/g, '"Yes"');
ret = ret.replace(/"\u274c No"/g, '"No"');
ret = ret.replace(/"\u2705 Very common"/g, '"Very common"');
ret = ret.replace(/"\u2705 Very low"/g, '"Very low"');

// Replace all impact-icon divs with clean numbered labels
let num = 0;
ret = ret.replace(/<div className="impact-icon">[^<]*<\/div>/g, () => {
  num++;
  const n = String(num).padStart(2, '0');
  return `<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>${n}</div>`;
});

// Remove remaining standalone emojis in strings
ret = ret.replace(/🏗️ Union Construction Worker/g, 'Union Construction Worker');
ret = ret.replace(/💼 Typical Non-Union Job/g, 'Typical Non-Union Job');
ret = ret.replace(/✅ /g, '');
ret = ret.replace(/❌ /g, '');
ret = ret.replace(/⚠️ /g, '');

code = code.slice(0, retStart) + ret + code.slice(retEnd);
fs.writeFileSync(filePath, code, 'utf8');
console.log('done');
