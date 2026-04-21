const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// [localNum, phone, website, email, address, city, state, lat, lng]
const allLocals = [
  [702,  "(618) 932-2102", "ibew702.org",        "ibew702@ibew702.org",           "106 N Monroe Street, West Frankfort, IL 62896",                "West Frankfort",  "IL", 37.8978, -88.9209],
  [714,  "(701) 852-3025", "local714.com",       "office@local714.com",           "125 35th Avenue NE, Minot, ND 58703",                          "Minot",           "ND", 48.2325, -101.2963],
  [738,  "(903) 753-7646", null,                 "ibew738@swbell.net",            "2914 E Marshall Avenue, Longview, TX 75601",                   "Longview",        "TX", 32.5007, -94.7405],
  [760,  "(865) 524-8638", "ibew760.org",        "info@ibew760.org",              "1530 Bill Williams Avenue, Knoxville, TN 37917",               "Knoxville",       "TN", 35.9606, -83.9207],
  [768,  "(406) 752-7680", "ibew768.com",        "office@ibew768.com",            "347 Second Avenue W, Kalispell, MT 59901",                     "Kalispell",       "MT", 48.1920, -114.3168],
  [769,  "(480) 423-9769", "ibew769.com",        "dispatch@ibew769.com",          "220 N William Dillard Drive, Gilbert, AZ 85233",               "Phoenix",         "AZ", 33.3528, -111.7890],
  [773,  "(519) 948-2221", "ibew773.ca",         "admin@ibew773.ca",              "4050 N Service Road E, Windsor, ON N8W 5X2",                   "Windsor",         "ON", 42.3149, -83.0364],
  [776,  "(843) 554-1080", null,                 "local776@ibew776.com",          "3345 Seiberling Road, North Charleston, SC 29418",             "Charleston",      "SC", 32.8546, -79.9748],
  [804,  "(519) 648-3993", "ibew804.ca",         "office@ibew804.ca",             "5158 Fountain Street N, Breslau, ON N0B 1M0",                  "Breslau",         "ON", 43.4697, -80.3997],
  [816,  "(270) 898-2456", "ibewlocal816.org",   "ibewlocal816@ibewlocal816.org", "4515 Clarks River Road, Paducah, KY 42003",                    "Paducah",         "KY", 37.0834, -88.6000],
  [852,  "(662) 286-2897", null,                 "ibewlocal852@bellsouth.net",    "192 County Road 509, Corinth, MS 38834",                       "Corinth",         "MS", 34.9343, -88.5223],
  [876,  "(616) 784-1133", "ibew876.com",        "ibew876@gmail.com",             "5000 E Airport Road, Mount Pleasant, MI 48858",                "Grand Rapids",    "MI", 43.6228, -84.7675],
  [903,  "(228) 863-9881", "lu903.com",          "lu903@lu903.com",               "2417 32nd Street, Gulfport, MS 39501",                         "Gulfport",        "MS", 30.3674, -89.0928],
  [934,  "(423) 323-5411", "ibew934.com",        "ibew_934@yahoo.com",            "4640 Highway 11 W, Blountville, TN 37617",                     "Kingsport",       "TN", 36.5484, -82.5618],
  [953,  "(715) 834-4911", "ibew953.org",        "info@ibew953.org",              "4205 Southtowne Drive, Eau Claire, WI 54701",                  "Eau Claire",      "WI", 44.8113, -91.4985],
  [968,  "(304) 485-7412", "ibew968.com",        "ibew968@ibew968.com",           "1845 Seventh Street, Parkersburg, WV 26101",                   "Parkersburg",     "WV", 39.2667, -81.5615],
  [993,  "(250) 376-8755", "ibew993.org",        "office@ibew993.org",            "873 Desmond Street, Kamloops, BC V2B 5K3",                     "Kamloops",        "BC", 50.6745, -120.3273],
  [995,  "(225) 927-6462", "lu995.com",          "ibew@lu995.com",                "8181 Tom Drive, Baton Rouge, LA 70815",                        "Baton Rouge",     "LA", 30.4515, -91.1871],
  [1002, "(918) 438-7344", "ibew1002.com",       "ibew@ibew1002.com",             "12510 E 21st Street, Tulsa, OK 74129",                         "Tulsa",           "OK", 36.1540, -95.9928],
  [1049, "(631) 234-1800", "ibew1049.org",       "sgasparik@ibew1049.com",        "100 Corporate Drive, Holtsville, NY 11742",                    "Long Island",     "NY", 40.8176, -73.0479],
  [1186, "(808) 847-5341", "ibew1186.org",       "ibew1186@ibew1186.org",         "1935 Hau Street Room 401, Honolulu, HI 96819",                 "Honolulu",        "HI", 21.3069, -157.8583],
  [1245, "(707) 452-2700", "ibew1245.com",       "rldj@ibew1245.com",             "30 Orange Tree Circle, Vacaville, CA 95687",                   "Vacaville",       "CA", 38.3566, -121.9877],
  [1249, "(315) 656-7253", "ibew1249.org",       "office@ibew1249.org",           "8531 Brewerton Road Suite 1, Cicero, NY 13039",                "Syracuse",        "NY", 43.1566, -76.0700],
  [1250, "(605) 343-0954", "ibewlocal1250.org",  "ibew1250ba@gmail.com",          "922 1/2 E Saint Patrick Street, Rapid City, SD 57701",         "Rapid City",      "SD", 44.0805, -103.2310],
  [1316, "(478) 743-7017", "ibew1316.com",       "admin@ibew1316.org",            "1046 Patterson Street, Macon, GA 31204",                       "Macon",           "GA", 32.8407, -83.6324],
  [1319, "(570) 714-1352", "ibew1319.org",       "info@ibew1319.org",             "225 Division Street, Kingston, PA 18704",                      "Bloomsburg",      "PA", 41.2612, -75.8813],
  [1340, "(757) 875-1340", "ibew1340.com",       "jeff@ibew1340.com",             "552 Industrial Park Drive, Newport News, VA 23608",            "Newport News",    "VA", 37.0871, -76.4730],
  [1393, "(317) 791-1362", "ibewlocal1393.com",  "info@ibewlocal1393.org",        "3645 S East Street, Indianapolis, IN 46227",                   "Indianapolis",    "IN", 39.7684, -86.1581],
  [1426, "(701) 775-7601", "ibew1426.org",       "businessmanager@ibew1426.org",  "1714 N Washington Street, Grand Forks, ND 58203",              "Grand Forks",     "ND", 47.9253, -97.0329],
  [1516, "(870) 932-2114", "ibew1516.com",       "ibew1516@outlook.com",          "9400 E Highland Drive, Jonesboro, AR 72401",                   "Jonesboro",       "AR", 35.8423, -90.7043],
  [1525, "(402) 334-1880", null,                 "ibew1525@aol.com",              "13336 C Street, Omaha, NE 68144",                              "Omaha",           "NE", 41.2565, -95.9345],
  [1531, "(229) 436-2417", null,                 "ibew1531@gmail.com",            "1900 Clark Avenue, Albany, GA 31705",                          "Albany",          "GA", 31.5785, -84.1557],
  [1547, "(907) 272-6571", "ibew1547.org",       "webmaster@ibew1547.org",        "3333 Denali Street Suite 200, Anchorage, AK 99503",            "Anchorage",       "AK", 61.2181, -149.9003],
  [1579, "(706) 722-6357", "ibew1579.org",       "admin@ibew1579.org",            "1250 Reynolds Street, Augusta, GA 30901",                      "Augusta",         "GA", 33.4735, -82.0105],
  [1687, "(705) 566-1687", "ibew1687.org",       "info@ibew1687.org",             "1204 St. Jerome Street, Sudbury, ON P3A 2V9",                  "Sudbury",         "ON", 46.4900, -80.9911],
  [1701, "(270) 684-3058", null,                 "ibew1701@yahoo.com",            "2911 W Parrish Avenue, Owensboro, KY 42301",                   "Owensboro",       "KY", 37.7719, -87.1112],
  [1925, "(731) 587-3457", null,                 "ibew1925@frontiernet.net",      "402 Jackson Street, Martin, TN 38237",                         "Martin",          "TN", 36.3434, -88.8503],
  [1928, "(902) 450-5366", "ibew1928.org",       "contact@ibew1928.org",          "14 McQuade Lake Crescent Suite 204, Beechville, NS B3S 1B6",   "Halifax",         "NS", 44.6488, -63.5752],
  [2067, "(306) 352-1433", "ibew2067.com",       "ibew@ibew2067.com",             "1810 McAra Street, Regina, SK S4N 6C4",                        "Regina",          "SK", 50.4452, -104.6189],
  [2085, "(204) 982-2085", "ibew2085.com",       "info@ibew2085.com",             "2181 Portage Avenue, Winnipeg, MB R3J 0L7",                    "Winnipeg",        "MB", 49.8951, -97.1384],
  [2150, "(262) 252-2552", "ibewlocal2150.org",  "ibew@ibewlocal2150.com",        "N56 W13777 Silver Spring Drive, Menomonee Falls, WI 53051",    "Milwaukee",       "WI", 43.1793, -88.1077],
  [2166, "(506) 452-0111", "ibewlocal2166.com",  "admin@ibewlocal2166.com",       "681 Union Street, Fredericton, NB E3A 3N8",                    "Fredericton",     "NB", 45.9636, -66.6431],
  [2286, "(409) 840-4806", null,                 "ibew2286@hotmail.com",          "4850 Stone Oak Drive, Beaumont, TX 77705",                     "Beaumont",        "TX", 30.0802, -94.1266],
];

let updated = 0;
let added = 0;
let newEntries = '';

for (const [localNum, phone, website, email, address, city, state, lat, lng] of allLocals) {
  const linemanId = 90000 + localNum;
  const existsPattern = new RegExp(`{ id: ${linemanId}, name: "IBEW Local ${localNum} \\(Lineman\\)",`);

  if (code.match(existsPattern)) {
    const idPattern = new RegExp(`{ id: ${linemanId}, name: "IBEW Local ${localNum} \\(Lineman\\)",[^}]+}`, 'g');
    const match = code.match(idPattern);
    if (!match) continue;

    let entry = match[0];
    const original = entry;

    if (phone) entry = entry.replace(/phone: (?:null|"[^"]*")/, `phone: "${phone}"`);
    if (website) {
      const clean = website.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
      entry = entry.replace(/website: (?:null|"[^"]*")/, `website: "${clean}"`);
    }
    if (address) entry = entry.replace(/address: "[^"]*"/, `address: "${address}"`);
    if (email && !entry.includes('email:')) {
      entry = entry.replace(/}$/, `, email: "${email}"}`);
    }

    if (entry !== original) {
      code = code.replace(original, entry);
      updated++;
    }
  } else {
    const phoneStr = phone ? `"${phone}"` : 'null';
    const cleanSite = website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : null;
    const siteStr = cleanSite ? `"${cleanSite}"` : 'null';
    const emailStr = email ? `, email: "${email}"` : '';
    newEntries += `  { id: ${linemanId}, name: "IBEW Local ${localNum} (Lineman)", city: "${city}", state: "${state}", phone: ${phoneStr}, website: ${siteStr}, lat: ${lat}, lng: ${lng}, address: "${address}"${emailStr} },\n`;
    added++;
  }
}

console.log(`✅ Updated ${updated} existing lineman locals`);
console.log(`✅ Prepared ${added} new lineman locals to add`);

// Insert before HFIAW marker
const marker = '// ─── HFIAW LOCALS DATABASE';
if (newEntries && code.includes(marker)) {
  code = code.replace(marker, newEntries + marker);
  console.log(`✅ Inserted ${added} new locals`);
} else if (newEntries) {
  console.error('ERROR: Could not find insertion marker');
}

// Remove any duplicates
let dupsRemoved = 0;
for (const [localNum] of allLocals) {
  const linemanId = 90000 + localNum;
  const regex = new RegExp(`  \\{ id: ${linemanId}, name: "IBEW Local ${localNum} \\(Lineman\\)",[^\\n]+\\n`, 'g');
  const matches = code.match(regex);
  if (matches && matches.length > 1) {
    let first = true;
    code = code.replace(regex, (m) => {
      if (first) { first = false; return m; }
      dupsRemoved++;
      return '';
    });
  }
}
if (dupsRemoved > 0) console.log(`✅ Removed ${dupsRemoved} duplicates`);

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add/update IBEW Lineman locals 702-2286" && git push\n');
