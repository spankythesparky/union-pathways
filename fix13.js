const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// [localNum, phone, website, email, address, city, state, lat, lng]
const allLocals = [
  [993,  "(250) 376-8755", "ibew993.org",         "office@ibew993.org",                "873 Desmond Street, Kamloops, BC V2B 5K3",                      "Kamloops",      "BC", 50.6745, -120.3273],
  [995,  "(225) 927-6462", "lu995.com",            "ibew@lu995.com",                    "8181 Tom Drive, Baton Rouge, LA 70815",                          "Baton Rouge",   "LA", 30.4515, -91.1871],
  [1003, "(250) 354-4177", "ibew1003.org",         "info@ibew1003.org",                 "101 Baker Street, Nelson, BC V1L 4H1",                           "Nelson",        "BC", 49.4928, -117.2948],
  [1015, "(956) 630-3108", null,                   "ibewlu1015@att.net",                "224 N McColl Road Suite D, McAllen, TX 78501",                   "McAllen",       "TX", 26.2034, -98.2300],
  [1077, "(985) 735-1299", null,                   null,                                "305 Avenue B Suite 209A, Bogalusa, LA 70427",                    "Bogalusa",      "LA", 30.7910, -89.8487],
  [1105, "(740) 454-2304", "ibewlocal1105.org",    "info@ibewlocal1105.org",            "5805 Frazeysburg Road, Nashport, OH 43830",                      "Newark",        "OH", 40.0581, -82.4013],
  [1141, "(405) 670-4777", "ibew1141.org",         null,                                "1700 SE Fifteenth Street, Oklahoma City, OK 73129",              "Oklahoma City", "OK", 35.4676, -97.5164],
  [1186, "(808) 847-5341", "ibew1186.org",         "ibew1186@ibew1186.org",             "1935 Hau Street Room 401, Honolulu, HI 96819",                   "Honolulu",      "HI", 21.3069, -157.8583],
  [1205, "(352) 376-7701", "ibew1205.org",         "info@ibew1205.org",                 "2510 NW Sixth Street, Gainesville, FL 32609",                    "Gainesville",   "FL", 29.6516, -82.3248],
  [1250, "(605) 343-0954", "ibewlocal1250.org",    null,                                "922 1/2 E Saint Patrick Street, Rapid City, SD 57701",           "Rapid City",    "SD", 44.0805, -103.2310],
  [1253, "(207) 453-1301", "ibew1253.org",         null,                                "142 Elm Street, Newport, ME 04953",                              "Augusta",       "ME", 44.3106, -69.7795],
  [1316, "(478) 743-7017", "ibew1316.com",         "admin@ibew1316.org",                "1046 Patterson Street, Macon, GA 31204",                         "Macon",         "GA", 32.8407, -83.6324],
  [1340, "(757) 875-1340", "ibew1340.com",         null,                                "552 Industrial Park Drive, Newport News, VA 23608",              "Newport News",  "VA", 37.0871, -76.4730],
  [1426, "(701) 775-7601", "ibew1426.org",         "businessmanager@ibew1426.org",      "1714 N Washington Street, Grand Forks, ND 58203",                "Grand Forks",   "ND", 47.9253, -97.0329],
  [1516, "(870) 932-2114", "ibew1516.com",         null,                                "9400 E Highland Drive, Jonesboro, AR 72401",                     "Jonesboro",     "AR", 35.8423, -90.7043],
  [1531, "(229) 436-2417", null,                   null,                                "1900 Clark Avenue, Albany, GA 31705",                            "Albany",        "GA", 31.5785, -84.1557],
  [1547, "(907) 272-6571", "ibew1547.org",         null,                                "3333 Denali Street Suite 200, Anchorage, AK 99503",              "Anchorage",     "AK", 61.2181, -149.9003],
  [1555, "(506) 857-3228", "ibew1555.ca",          null,                                "96 Norwood Avenue Suite 305, Moncton, NB E1C 6L9",               "Moncton",       "NB", 46.0878, -64.7782],
  [1579, "(706) 722-6357", "ibew1579.org",         null,                                "1250 Reynolds Street, Augusta, GA 30901",                        "Augusta",       "GA", 33.4735, -82.0105],
  [1687, "(705) 566-1687", "ibew1687.org",         "info@ibew1687.org",                 "1204 St. Jerome Street, Sudbury, ON P3A 2V9",                    "Sudbury",       "ON", 46.4900, -80.9911],
  [1701, "(270) 684-3058", null,                   null,                                "2911 W Parrish Avenue, Owensboro, KY 42301",                     "Owensboro",     "KY", 37.7719, -87.1112],
  [1852, "(902) 562-1357", null,                   null,                                "42 Cossitt Heights Drive, Sydney, NS B1P 6H4",                   "Sydney",        "NS", 46.1351, -60.1831],
  [1914, "(724) 594-5559", "ibew1914.org",         null,                                "200 School Street, Harwick, PA 15049",                           "Cheswick",      "PA", 40.5412, -79.7970],
  [1925, "(731) 587-3457", null,                   "ibew1925@frontiernet.net",          "402 Jackson Street, Martin, TN 38237",                           "Martin",        "TN", 36.3434, -88.8503],
  [1928, "(902) 450-5366", "ibew1928.org",         "contact@ibew1928.org",              "14 McQuade Lake Crescent Suite 204, Beechville, NS B3S 1B6",     "Halifax",       "NS", 44.6488, -63.5752],
  [2038, "(306) 757-0222", "ibew2038.com",         "admin@ibew2038.com",                "1920 McAra Street, Regina, SK S4N 5R1",                          "Regina",        "SK", 50.4452, -104.6189],
  [2085, "(204) 982-2085", "ibew2085.com",         "info@ibew2085.com",                 "2181 Portage Avenue, Winnipeg, MB R3J 0L7",                      "Winnipeg",      "MB", 49.8951, -97.1384],
  [2166, "(506) 452-0111", "ibewlocal2166.com",    null,                                "681 Union Street, Fredericton, NB E3A 3N8",                      "Fredericton",   "NB", 45.9636, -66.6431],
  [2330, "(709) 895-3764", "ibew.nf.ca",           null,                                "160 Holyrood Access Road, Holyrood, NL A0A 2R0",                 "St. John's",    "NL", 47.5615, -52.7126],
];

let updated = 0;
let added = 0;
let newEntries = '';

for (const [localNum, phone, website, email, address, city, state, lat, lng] of allLocals) {
  const existsPattern = new RegExp(`{ id: ${localNum}, name: "IBEW Local ${localNum}",`);

  if (code.match(existsPattern)) {
    // Update existing
    const idPattern = new RegExp(`{ id: ${localNum}, name: "IBEW Local ${localNum}",[^}]+}`, 'g');
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
    // Add new entry
    const phoneStr = phone ? `"${phone}"` : 'null';
    const cleanSite = website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : null;
    const siteStr = cleanSite ? `"${cleanSite}"` : 'null';
    const emailStr = email ? `, email: "${email}"` : '';
    newEntries += `  { id: ${localNum}, name: "IBEW Local ${localNum}", city: "${city}", state: "${state}", phone: ${phoneStr}, website: ${siteStr}, lat: ${lat}, lng: ${lng}, address: "${address}"${emailStr} },\n`;
    added++;
  }
}

console.log(`✅ Updated ${updated} existing locals`);
console.log(`✅ Prepared ${added} new locals to add`);

// Insert new entries before IBEW LINEMAN DATABASE marker
const marker = '// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ──────────────────';
if (newEntries && code.includes(marker)) {
  code = code.replace(marker, newEntries + marker);
  console.log(`✅ Inserted ${added} new locals into array`);
} else if (newEntries) {
  console.error('ERROR: Could not find insertion marker');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add/update IBEW Inside locals 993-2330" && git push\n');
