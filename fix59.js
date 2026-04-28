const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Add states at top level
if (!c.includes('const [calcTrade, setCalcTrade] = useState(')) {
  c = c.replace(
    'const [localSection, setLocalSection] = useState(null);',
    'const [localSection, setLocalSection] = useState(null);\n  const [calcTrade, setCalcTrade] = useState("IBEW_I");\n  const [calcYear, setCalcYear] = useState("journeyman");\n  const [calcCity, setCalcCity] = useState("");\n  const [calcTier, setCalcTier] = useState(2);\n  const [calcHours, setCalcHours] = useState(1800);\n  const [calcYearsCareer, setCalcYearsCareer] = useState(30);\n  const [showResults, setShowResults] = useState(false);'
  );
  console.log('✅ Added top-level states');
} else {
  console.log('ℹ️  States already at top level');
}

// Remove React.useState calls from inside the IIFE page
c = c.replace(/\n\s*const \[calcTrade, setCalcTrade\] = React\.useState[^\n]+/, '');
c = c.replace(/\n\s*const \[calcYear, setCalcYear\] = React\.useState[^\n]+/, '');
c = c.replace(/\n\s*const \[calcCity, setCalcCity\] = React\.useState[^\n]+/, '');
c = c.replace(/\n\s*const \[calcTier, setCalcTier\] = React\.useState[^\n]+/, '');
c = c.replace(/\n\s*const \[calcHours, setCalcHours\] = React\.useState[^\n]+/, '');
c = c.replace(/\n\s*const \[calcYearsCareer, setCalcYearsCareer\] = React\.useState[^\n]+/, '');
c = c.replace(/\n\s*const \[showResults, setShowResults\] = React\.useState[^\n]+/, '');

console.log('✅ Removed React.useState from inside page');

fs.writeFileSync('src/App.jsx', c);
console.log('done');
