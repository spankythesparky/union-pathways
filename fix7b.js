const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// New IBEW Inside locals from Excel that are NOT already in the app
// Format: [id, localNum, phone, website, address, city, state, lat, lng]
const newLocals = [
  [11300, 113, "(719) 633-3872", "ibew113.com",       "2150 Naegele Road, Colorado Springs, CO 80904",              "Colorado Springs", "CO", 38.8339, -104.8214],
  [11700, 117, "(847) 854-7200", "ibew117.com",       "765 Munshaw Lane, Crystal Lake, IL 60014",                   "Crystal Lake",     "IL", 42.2411,  -88.3162],
  [12400, 124, "(816) 942-7500", "ibew124.org",       "301 E 103rd Terrace, Kansas City, MO 64114",                 "Kansas City",      "MO", 39.0997,  -94.5786],
  [12700, 127, "(262) 654-0912", "ibew127.org",       "3030 39th Avenue, Kenosha, WI 53144",                        "Kenosha",          "WI", 42.5847,  -87.8212],
  [12900, 129, "(440) 233-7156", "ibew129.org",       "6100 S Broadway Suite 201, Lorain, OH 44053",                "Lorain",           "OH", 41.4523,  -82.1824],
  [13000, 130, "(504) 831-1372", "ibewlu130.com",     "3200 Ridgelake Drive Suite 300, Metairie, LA 70002",          "New Orleans",      "LA", 29.9511,  -90.0715],
  [13100, 131, "(269) 382-1762", "ibew131.com",       "3641 E Cork Street, Kalamazoo, MI 49001",                    "Kalamazoo",        "MI", 42.2917,  -85.5872],
  [13400, 134, "(312) 454-1340", "lu134.org",         "2722 S Martin Luther King Drive, Chicago, IL 60616",          "Chicago",          "IL", 41.8781,  -87.6298],
  [13600, 136, "(205) 833-0909", "ibew136.org",       "845 Gadsden Highway, Birmingham, AL 35235",                  "Birmingham",       "AL", 33.5186,  -86.8104],
  [13900, 139, "(607) 732-1237", "ibew139.com",       "415 W Second Street, Elmira, NY 14901",                      "Elmira",           "NY", 42.0898,  -76.8077],
  [14100, 141, "(304) 242-3870", "ibew141.org",       "Wheeling, WV",                                               "Wheeling",         "WV", 40.0640,  -80.7209],
  [14300, 143, "(717) 232-7093", "ibewlocal143.org",  "1501 Revere Street, Harrisburg, PA 17104",                   "Harrisburg",       "PA", 40.2732,  -76.8867],
  [14500, 145, "(309) 736-4239", "ibewlocal145.com",  "1700 52nd Avenue Suite A, Moline, IL 61265",                 "Davenport",        "IA", 41.5236,  -90.5776],
  [14600, 146, "(217) 877-4604", "ibew146.com",       "3390 N Woodford Street, Decatur, IL 62526",                  "Decatur",          "IL", 39.8403,  -88.9548],
  [15000, 150, "(847) 680-1504", "ibew150.org",       "31290 N US Highway 45 Unit B, Libertyville, IL 60048",        "Waukegan",         "IL", 42.3636,  -87.8448],
  [15300, 153, "(574) 287-8655", "ibew153.com",       "56475 Peppermint Road, South Bend, IN 46619",                "South Bend",       "IN", 41.6764,  -86.2520],
  [15800, 158, "(920) 432-0158", "ibew158.com",       "2970 Greenbrier Road, Green Bay, WI 54311",                  "Green Bay",        "WI", 44.5133,  -88.0133],
  [15900, 159, "(608) 255-2989", "ibew159.org",       "5303 Fen Oak Drive, Madison, WI 53718",                      "Madison",          "WI", 43.0731,  -89.4012],
  [16300, 163, "(570) 823-4028", "ibew163.org",       "1269 Sans Souci Parkway, Wilkes-Barre, PA 18706",            "Wilkes-Barre",     "PA", 41.2459,  -75.8813],
  [16400, 164, "(201) 265-1700", "ibew164.org",       "205 Robin Road Suite 315, Paramus, NJ 07652",                "Jersey City",      "NJ", 40.7178,  -74.0431],
  [17500, 175, "(423) 894-3557", "ibew175.org",       "3922 Volunteer Drive Suite 9, Chattanooga, TN 37416",         "Chattanooga",      "TN", 35.0456,  -85.3097],
  [17600, 176, "(815) 729-1240", "ibewlocal176.org",  "1100 NE Frontage Road, Joliet, IL 60431",                    "Joliet",           "IL", 41.5250,  -88.0817],
  [17700, 177, "(904) 355-4569", "ibew177.org",       "966 Liberty Street, Jacksonville, FL 32206",                 "Jacksonville",     "FL", 30.3322,  -81.6557],
  [18000, 180, "(707) 251-9180", "ibewlu180.org",     "720 Technology Way-B, Napa, CA 94558",                       "Napa",             "CA", 38.2975, -122.2869],
  [19100, 191, "(425) 259-3195", "ibew191.com",       "3100 164th Street NE, Marysville, WA 98271",                 "Everett",          "WA", 47.9790, -122.2021],
  [19300, 193, "(217) 544-3479", "ibew193.com",       "3150 Wide Track Drive, Springfield, IL 62703",               "Springfield",      "IL", 39.7817,  -89.6501],
  [19400, 194, "(318) 688-0194", "ibew194.org",       "5510 Buncombe Road, Shreveport, LA 71129",                   "Shreveport",       "LA", 32.5252,  -93.7502],
  [19700, 197, "(309) 827-4868", "ibew197.org",       "2407 Beich Road Suite A, Bloomington, IL 61705",             "Bloomington",      "IL", 40.4842,  -88.9937],
  [21200, 212, "(513) 559-0200", "local212.com",      "212 Crowne Point Place Suite 101, Cincinnati, OH 45241",     "Cincinnati",       "OH", 39.1031,  -84.5120],
  [22300, 223, "(508) 880-2690", "ibew223.org",       "475 Myles Standish Boulevard, Taunton, MA 02780",            "Brockton",         "MA", 41.9995,  -71.0589],
  [22600, 226, "(785) 232-1761", "ibew226.com",       "1620 NW Gage Boulevard, Topeka, KS 66618",                   "Topeka",           "KS", 39.0489,  -95.6780],
  [22900, 229, "(717) 843-8368", "ibew229.org",       "555 Willow Springs Lane, York, PA 17406",                    "York",             "PA", 39.9626,  -76.7277],
  [23100, 231, "(712) 255-8138", "ibew231.com",       "5001 Harbor Drive, Sioux City, IA 51111",                    "Sioux City",       "IA", 42.4999,  -96.4003],
  [23300, 233, "(406) 442-3185", "ibew233.org",       "110 N Warren Street Suite 1, Helena, MT 59601",              "Helena",           "MT", 46.5958, -112.0270],
  [23400, 234, "(831) 633-2311", "ibew234.org",       "747 El Camino Real N, Salinas, CA 93907",                    "Salinas",          "CA", 36.6777, -121.6555],
  [23600, 236, "(518) 783-9957", "ibew236.org",       "3000 Troy Schenectady Road, Niskayuna, NY 12309",            "Albany",           "NY", 42.6526,  -73.7562],
  [23700, 237, "(716) 297-3650", "ibew237.com",       "6700 Schultz Street, Niagara Falls, NY 14304",               "Niagara Falls",    "NY", 43.0962,  -79.0377],
  [24100, 241, "(607) 272-2809", "ibewlocal241.com",  "134 Cecil A. Malone Drive, Ithaca, NY 14850",                "Ithaca",           "NY", 42.4440,  -76.5021],
  [24200, 242, "(218) 728-6895", "ibew242.org",       "2002 London Road Room 111, Duluth, MN 55812",                "Duluth",           "MN", 46.7867,  -92.1005],
  [24600, 246, "(740) 282-7572", null,                "626 N Fourth Street, Steubenville, OH 43952",                "Steubenville",     "OH", 40.3698,  -80.6342],
  [25200, 252, "(734) 424-0978", "ibew252.org",       "7920 Jackson Road Suite A, Ann Arbor, MI 48103",             "Ann Arbor",        "MI", 42.2808,  -83.7430],
  [25700, 257, "(573) 635-2133", "ibew257.org",       "209 Flora Drive, Jefferson City, MO 65101",                  "Jefferson City",   "MO", 38.5767,  -92.1735],
  [26500, 265, "(402) 423-4497", "ibew265.org",       "1409 Old Farm Road, Lincoln, NE 68512",                      "Lincoln",          "NE", 40.8136,  -96.7026],
  [26900, 269, "(609) 394-8129", "ibew269.com",       "670 Whitehead Road, Trenton, NJ 08648",                      "Trenton",          "NJ", 40.2170,  -74.7429],
  [27000, 270, "(865) 483-1354", "ibewlocal270.org",  "138 N Lincoln Circle, Oak Ridge, TN 37830",                  "Oak Ridge",        "TN", 36.0104,  -84.2696],
  [27100, 271, "(316) 267-8255", "ibew271.com",       "1040 S Broadway, Wichita, KS 67211",                         "Wichita",          "KS", 37.6872,  -97.3301],
  [27500, 275, "(616) 837-7149", "ibew275.org",       "140 N 64th Avenue, Coopersville, MI 49404",                  "Coopersville",     "MI", 43.0636,  -85.9328],
  [27800, 278, "(361) 855-1084", "ibew278.com",       "2301 Saratoga Boulevard, Corpus Christi, TX 78417",          "Corpus Christi",   "TX", 27.8006,  -97.3964],
  [28000, 280, "(541) 812-1771", "ibew280.org",       "32969 Highway 99 E, Tangent, OR 97389",                      "Tangent",          "OR", 44.5382, -123.1059],
  [28800, 288, "(319) 233-8050", "ibew288.org",       "1695 Burton Avenue, Waterloo, IA 50703",                     "Waterloo",         "IA", 42.4928,  -92.3426],
  [29100, 291, "(208) 343-4861", "ibew291.org",       "225 N Sixteenth Street Suite 110, Boise, ID 83702",          "Boise",            "ID", 43.6150, -116.2023],
  [29200, 292, "(612) 379-1292", "ibew292.org",       "6700 W Broadway Avenue, Brooklyn Park, MN 55428",            "Minneapolis",      "MN", 44.9778,  -93.2650],
  [29500, 295, "(501) 562-2244", "ibew295.org",       "7320 S University Avenue, Little Rock, AR 72209",            "Little Rock",      "AR", 34.7465,  -92.2896],
  [30000, 300, "(802) 864-5864", "ibewlocal300.org",  "3 Gregory Drive, South Burlington, VT 05403",                "Burlington",       "VT", 44.4759,  -73.2121],
  [30100, 301, "(903) 838-8531", null,                "114 Elm Street, Nash, TX 75569",                             "Texarkana",        "TX", 33.4251,  -94.0477],
  [30200, 302, "(925) 228-2302", "ibewlu302.com",     "1875 Arnold Drive, Martinez, CA 94553",                      "Martinez",         "CA", 37.9910, -122.1341],
];

// Insert before the IBEW LINEMAN DATABASE marker
const marker = '// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ──────────────────';
if (!code.includes(marker)) {
  console.error('ERROR: marker not found');
  process.exit(1);
}

let newEntries = '';
for (const [id, localNum, phone, website, address, city, state, lat, lng] of newLocals) {
  const phoneStr = phone ? `"${phone}"` : 'null';
  const siteStr = website ? `"${website}"` : 'null';
  newEntries += `  { id: ${id}, name: "IBEW Local ${localNum}", city: "${city}", state: "${state}", phone: ${phoneStr}, website: ${siteStr}, lat: ${lat}, lng: ${lng}, address: "${address}" },\n`;
}

code = code.replace(marker, newEntries + marker);
fs.writeFileSync(filePath, code, 'utf8');
console.log(`✅ Added ${newLocals.length} new IBEW Inside locals!`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add remaining IBEW Inside locals from Excel" && git push\n');
