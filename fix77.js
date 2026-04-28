const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const before = `function ApprovedReportsFeed({ lang }) {
  const [reports, setReports] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {`;

const after = `function ApprovedReportsFeed({ lang }) {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {`;

if (!code.includes(before)) { console.error('ERROR: ApprovedReportsFeed React.useState block not found'); process.exit(1); }
code = code.replace(before, after);
console.log('Fixed React.useState/useEffect to bare imports');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: use bare useState/useEffect in ApprovedReportsFeed" && git push\n');
