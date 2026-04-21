const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD EMAIL DATA TO LOCALS ─────────────────────────────────────────────
const emails = [
  [38,  "local38@ibew38.org"],
  [40,  "unionhall@ibew40.org"],
  [41,  "lu41@ibewlocal41.com"],
  [43,  "Local43info@ibew43.org"],
  [48,  "info@ibew48.com"],
  [60,  "admin@ibewlu60.org"],
  [64,  "info@ibew64.org"],
  [68,  "ibew@ibewlu68.com"],
  [72,  "ibewlu72@yahoo.com"],
  [73,  "info@ibew73.org"],
  [82,  "info@ibew82.org"],
  [90,  "info@ibewlocal90.org"],
  [96,  "info@ibewlocal96.org"],
  [98,  "ionews@ibew98.org"],
  [99,  "info@ibew99.org"],
  [100, "info@ibew100.org"],
  [102, "info@ibew102.org"],
  [106, "general.info@ibew106.org"],
  [110, "Info@ibew110.org"],
  [111, "mail@ibew111.org"],
  [117, "office@ibew117.com"],
  [124, "ibew@ibewlocal124.org"],
  [127, "ibew127@gmail.com"],
  [129, "info@ibew129.org"],
  [131, "office@ibew131.com"],
  [134, "info@local134.org"],
  [136, "ibew136@ibew136.org"],
  [139, "businessmanager@ibewlocal139.org"],
  [141, "info@ibew141.org"],
  [145, "info@ibewlocal145.com"],
  [153, "ibew@ibew153.com"],
  [159, "office@ibew159.org"],
  [163, "electricians@ibew163.org"],
  [164, "ibew164@ibew164.org"],
  [175, "office@ibew175.org"],
  [176, "office@ibewlocal176.org"],
  [177, "office@ibew177.org"],
  [191, null],
  [193, "office@ibew193.com"],
  [197, "info@ibew197.org"],
  [212, "office@local212.com"],
  [233, "office@ibew233.org"],
  [234, "thehall@ibew234.org"],
  [241, "businessmanager@ibewlocal241.com"],
  [252, "info@ibew252.org"],
  [257, "ibew257@ibew257.org"],
  [265, "info@ibew265.org"],
  [270, "ibew270@comcast.net"],
  [271, "IBEWlu271@hotmail.com"],
  [275, "info@ibew275.org"],
  [278, "office@ibew278.com"],
  [280, "info@ibew280.org"],
  [291, "office@ibew291.org"],
  [292, "office@ibew292.org"],
  [295, "ibew295@ibew295.org"],
  [300, "info@ibewlocal300.org"],
  [302, "ibinfo@ibewlu302.com"],
];

let emailsAdded = 0;
for (const [localNum, email] of emails) {
  if (!email) continue;
  // Find the local entry by id and add email field before the closing }
  const pattern = new RegExp(
    `({ id: ${localNum}, name: "IBEW Local ${localNum}",[^}]+)(})`,
    'g'
  );
  const before = code;
  code = code.replace(pattern, (match, entry, close) => {
    if (entry.includes('email:')) return match; // already has email
    return entry + `, email: "${email}"` + close;
  });
  if (code !== before) emailsAdded++;
}
console.log(`✅ Added emails to ${emailsAdded} locals`);

// ─── 2. ADD EMAIL BUTTON TO LOCAL CARD UI ────────────────────────────────────
const oldCard = `                  <div className="card-actions">
                    {local.website && (
                      <a className="btn-website" href={\`https://\${local.website}\`} target="_blank" rel="noopener noreferrer">
                        {t.visitWebsite}
                      </a>
                    )}`;

const newCard = `                  <div className="card-actions">
                    {local.website && (
                      <a className="btn-website" href={\`https://\${local.website}\`} target="_blank" rel="noopener noreferrer">
                        {t.visitWebsite}
                      </a>
                    )}
                    {local.email && (
                      <a className="btn-website" href={\`mailto:\${local.email}\`} style={{background:"rgba(59,158,255,0.08)", borderColor:"rgba(59,158,255,0.3)", color:"#3b9eff"}}>
                        ✉ Email Local
                      </a>
                    )}`;

if (!code.includes(oldCard)) {
  console.error('ERROR: card-actions block not found');
  process.exit(1);
}
code = code.replace(oldCard, newCard);
console.log('✅ Email button added to local card UI');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add email field and button to local cards" && git push\n');
