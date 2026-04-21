const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// [localNum, phone, website, email, address, city, state, lat, lng]
const allLocals = [
  [2,   "(314) 645-2236", "ibew2.org",          "info@ibew2.org",              "940 Biltmore Drive, Fenton, MO 63026",                              "St. Louis",       "MO", 38.5128, -90.4428],
  [3,   "(718) 591-4000", "local3.com",          "mail@local3ibew.org",         "158-11 Harry Van Arsdale Jr. Avenue, Flushing, NY 11365",           "New York City",   "NY", 40.7128, -74.0059],
  [9,   "(708) 449-9000", "ibew9.org",           "mail@ibew9.org",              "7840 Graphics Drive Suite 100, Tinley Park, IL 60477",              "Chicago",         "IL", 41.5631, -87.7856],
  [12,  "(719) 561-8000", "ibew12.org",          "local12@ibew12.org",          "2901 Farabaugh Lane, Pueblo, CO 81005",                             "Pueblo",          "CO", 38.2544, -104.6091],
  [17,  "(248) 423-4540", "ibewlocal17.org",     null,                          "17000 W 12 Mile Road, Southfield, MI 48076",                        "Southfield",      "MI", 42.4734, -83.2218],
  [37,  "(506) 455-0037", "ibew37.com",          "info@ibew37.com",             "138 Neill Street, Fredericton, NB E3A 2Z6",                         "Fredericton",     "NB", 45.9636, -66.6431],
  [42,  "(860) 646-7297", "ibewlocal42.com",     null,                          "20 Craftsman Road, East Windsor, CT 06088",                         "East Windsor",    "CT", 41.9165, -72.5990],
  [44,  "(406) 723-3203", "ibew44.org",          "ibew@ibew44.org",             "1901 S Montana Street, Butte, MT 59701",                            "Butte",           "MT", 46.0038, -112.5349],
  [47,  "(909) 860-4239", "ibew47.org",          "info@ibew47.org",             "600 N Diamond Bar Boulevard, Diamond Bar, CA 91765",                "Diamond Bar",     "CA", 33.9994, -117.8102],
  [50,  "(804) 328-2972", "ibew50.org",          null,                          "1400 E Nine Mile Road Suite 50, Highland Springs, VA 23075",        "Richmond",        "VA", 37.5407, -77.4360],
  [51,  "(217) 726-8481", "ibew51.org",          "ibew51@ibew51.org",           "3171 Greenhead Drive, Springfield, IL 62711",                       "Springfield",     "IL", 39.7817, -89.6501],
  [53,  "(816) 421-5464", "ibewlocal53.org",     "localrep@ibewlocal53.org",    "1100 Admiral Boulevard, Kansas City, MO 64106",                     "Kansas City",     "MO", 39.0997, -94.5786],
  [55,  "(515) 265-6193", "ibew55.org",          "ibew55@ibew55.org",           "1435 NE 54th Avenue, Des Moines, IA 50313",                         "Des Moines",      "IA", 41.5868, -93.6250],
  [57,  "(801) 270-5757", "ibew57.com",          "local57@ibew57.com",          "3400 W 2100 S Suite B, Salt Lake City, UT 84119",                   "Salt Lake City",  "UT", 40.7608, -111.8910],
  [66,  "(713) 943-0716", "ibew66.com",          "local66@ibew66.com",          "4345 Allen Genoa Road, Pasadena, TX 77504",                         "Houston",         "TX", 29.6911, -95.2091],
  [70,  "(301) 516-7730", "ibew70.us",           "office@ibew70.us",            "3606 Stewart Road, Forestville, MD 20747",                          "Forestville",     "MD", 38.8513, -76.8680],
  [71,  "(614) 539-1394", "ibew71.org",          "office@ibew71.org",           "2280 Citygate Drive, Columbus, OH 43219",                           "Columbus",        "OH", 39.9612, -82.9988],
  [77,  "(206) 323-4505", "ibew77.com",          "ibew77@ibew77.com",           "19415 International Boulevard, SeaTac, WA 98188",                   "Seattle",         "WA", 47.6062, -122.3321],
  [80,  "(757) 480-1740", "ibew80.com",          null,                          "5307 E Virginia Beach Boulevard, Norfolk, VA 23502",                "Norfolk",         "VA", 36.8508, -76.2859],
  [84,  "(770) 801-5352", "ibewlocal84.org",     "admin@ibewlocal84.org",       "2791 Woodland Terrace, Smyrna, GA 30080",                           "Newnan",          "GA", 33.8840, -84.5144],
  [89,  "(360) 755-6900", "ibew89.org",          "local89@ibew89.com",          "1125 S Second Street, Mount Vernon, WA 98273",                      "Mount Vernon",    "WA", 48.4215, -122.3343],
  [102, "(973) 887-1718", "ibew102.org",         "info@ibew102.org",            "50 Parsippany Road, Parsippany, NJ 07054",                          "Parsippany",      "NJ", 40.8573, -74.4210],
  [104, "(508) 660-3900", "ibew104.org",         "info@ibew104.org",            "900 S Main Street, Mansfield, MA 02048",                            "Mansfield",       "MA", 42.0251, -71.2189],
  [105, "(905) 387-1721", "ibew105.com",         "frontdesk@ibewlu105.com",     "685 Nebo Road, Hannon, ON L0R 1P0",                                 "Hamilton",        "ON", 43.2557, -79.8711],
  [111, "(303) 744-7171", "ibew111.org",         "mail@ibew111.org",            "5965 E 39th Avenue, Denver, CO 80207",                              "Denver",          "CO", 39.7817, -104.9232],
  [113, "(719) 633-3872", "ibew113.com",         "info@ibew113.com",            "2150 Naegele Road, Colorado Springs, CO 80904",                     "Colorado Springs", "CO", 38.8339, -104.8214],
  [120, "(519) 652-2929", "ibew120.ca",          null,                          "6688 Tempo Road, London, ON N6L 1P9",                               "London",          "ON", 42.9849, -81.2453],
  [125, "(503) 262-9125", "ibew125.com",         null,                          "17200 NE Sacramento Street, Portland, OR 97230",                    "Portland",        "OR", 45.5231, -122.4500],
  [126, "(610) 489-1185", "ibewlu126.com",       "local126@ibewlu126.com",      "3455 Germantown Pike, Collegeville, PA 19426",                      "Collegeville",    "PA", 40.1887, -75.4535],
  [141, "(304) 242-3870", "ibew141.org",         "info@ibew141.org",            "82 Burkham Court, Wheeling, WV 26003",                              "Wheeling",        "WV", 40.0640, -80.7209],
  [145, "(309) 736-4239", "ibewlocal145.com",    "info@ibewlocal145.com",       "1700 52nd Avenue Suite A, Moline, IL 61265",                        "Moline",          "IL", 41.5067, -90.5151],
  [160, "(612) 781-3126", "ibew160.org",         "160@ibew160.org",             "13220 County Road 6, Plymouth, MN 55441",                           "Plymouth",        "MN", 45.0105, -93.4555],
  [164, "(201) 265-1700", "ibew164.org",         "ibew164@ibew164.org",         "205 Robin Road Suite 315, Paramus, NJ 07652",                       "Jersey City",     "NJ", 40.7178, -74.0431],
  [175, "(423) 894-3557", "ibew175.org",         "office@ibew175.org",          "3922 Volunteer Drive Suite 9, Chattanooga, TN 37416",               "Chattanooga",     "TN", 35.0456, -85.3097],
  [177, "(904) 355-4569", "ibew177.org",         "office@ibew177.org",          "966 Liberty Street, Jacksonville, FL 32206",                        "Jacksonville",    "FL", 30.3322, -81.6557],
  [193, "(217) 544-3479", "ibew193.com",         "office@ibew193.com",          "3150 Wide Track Drive, Springfield, IL 62703",                      "Springfield",     "IL", 39.7817, -89.6501],
  [194, "(318) 688-0194", "ibew194.org",         null,                          "5510 Buncombe Road, Shreveport, LA 71129",                          "Shreveport",      "LA", 32.5252, -93.7502],
  [196, "(630) 761-1829", "ibew196.com",         "office@ibew196.com",          "13300 IL Route 47, Huntley, IL 60142",                              "Huntley",         "IL", 42.1717, -88.4270],
  [206, "(406) 443-7475", "ibew206.org",         "office@ibew206.org",          "110 N Warren Avenue, Helena, MT 59601",                             "Helena",          "MT", 46.5958, -112.0270],
  [213, "(604) 571-6500", "ibew213.org",         "ibew213@ibew213.org",         "1424 Broadway Street, Port Coquitlam, BC V3C 5W2",                  "Port Coquitlam",  "BC", 49.2628, -122.7817],
  [220, "(817) 551-1885", "ibewlu220.com",       "ibewlu220@ibewlu220.com",     "2804 SE Loop 820, Fort Worth, TX 76140",                            "Fort Worth",      "TX", 32.7555, -97.3308],
  [222, "(787) 957-9252", "ibew222.org",         "dispatch@ibew222.org",        "RR3 200 Suite 11, Toa Alta, PR 00953",                              "Orlando",         "FL", 28.5383, -81.3792],
  [238, "(828) 505-0216", "ibew238.org",         null,                          "46 New Leicester Highway, Asheville, NC 28806",                     "Asheville",       "NC", 35.5951, -82.5515],
  [245, "(419) 666-3350", "ibew245.com",         null,                          "705 Lime City Road, Rossford, OH 43460",                            "Toledo",          "OH", 41.6031, -83.5641],
  [254, "(403) 250-5558", "ibew254.ca",          "admin@ibew254.ca",            "3615 29th Street NE, Calgary, AB T1Y 5W4",                          "Calgary",         "AB", 51.0447, -114.0719],
  [258, "(604) 520-3305", "ibew258.bc.ca",       "info@ibew258.bc.ca",          "8029 199 Street Suite 140, Langley, BC V2Y 0E2",                    "Vancouver",       "BC", 49.1044, -122.6623],
  [270, "(865) 483-1354", "ibewlocal270.org",    "ibew270@comcast.net",         "138 N Lincoln Circle, Oak Ridge, TN 37830",                         "Oak Ridge",       "TN", 36.0104, -84.2696],
  [278, "(361) 855-1084", "ibew278.com",         "office@ibew278.com",          "2301 Saratoga Boulevard, Corpus Christi, TX 78417",                 "Corpus Christi",  "TX", 27.8006, -97.3964],
  [291, "(208) 343-4861", "ibew291.org",         "office@ibew291.org",          "225 N Sixteenth Street Suite 110, Boise, ID 83702",                 "Boise",           "ID", 43.6150, -116.2023],
  [295, "(501) 562-2244", "ibew295.org",         "ibew295@ibew295.org",         "7320 S University Avenue, Little Rock, AR 72209",                   "Little Rock",     "AR", 34.7465, -92.2896],
  [301, "(903) 838-8531", null,                  "chris@ibew301.com",           "114 Elm Street, Nash, TX 75569",                                    "Texarkana",       "TX", 33.4251, -94.0477],
  [303, "(905) 354-4303", "ibewlocal303.com",    null,                          "4485 Kent Avenue, Niagara Falls, ON L2H 1J1",                       "St. Catharines",  "ON", 43.1594, -79.2469],
  [304, "(785) 235-2301", "ibew304.org",         "lu304@ibew304.org",           "3906 NW Sixteenth Street, Topeka, KS 66618",                        "Topeka",          "KS", 39.0489, -95.6780],
  [307, "(301) 724-3403", "ibew307.org",         "administrator@ibew307.org",   "401 Decatur Street, Cumberland, MD 21502",                          "Cumberland",      "MD", 39.6526, -78.7625],
  [309, "(618) 345-5112", "ibew309.com",         "electricians@ibew309.org",    "2000A Mall Street, Collinsville, IL 62234",                         "Collinsville",    "IL", 38.6703, -89.9845],
  [317, "(304) 429-5013", "ibew317.net",         "office@ibew317.com",          "1848 Madison Avenue Suite A, Huntington, WV 25704",                 "Huntington",      "WV", 38.4193, -82.4452],
  [322, "(307) 265-1060", "ibew322.org",         "office@ibew322.org",          "691 English Drive, Casper, WY 82601",                               "Casper",          "WY", 42.8666, -106.3131],
  [342, "(336) 285-7781", "ibew342.org",         "ibew342@att.net",             "7874 Thorndike Road, Greensboro, NC 27409",                         "Greensboro",      "NC", 36.0726, -79.7920],
  [351, "(609) 704-8351", "ibew351.org",         null,                          "1113 Black Horse Pike, Hammonton, NJ 08037",                        "Folsom",          "NJ", 39.6579, -74.8010],
  [353, "(416) 510-3530", "ibew353.org",         "inquiries@ibew353.org",       "1377 Lawrence Avenue E, Toronto, ON M3A 3P8",                       "Toronto",         "ON", 43.6532, -79.3832],
  [359, "(305) 458-8205", "ibew359.com",         null,                          "7811 Coral Way Suite 101, Miami, FL 33155",                         "Miami",           "FL", 25.7617, -80.1918],
  [369, "(502) 368-2568", "ibewlocal369.com",    null,                          "4315 Preston Highway Suite 102, Louisville, KY 40213",              "Louisville",      "KY", 38.2527, -85.7585],
  [379, "(704) 455-4595", "ibew379.org",         "ibewlu379@ibew379.org",       "1900 Cross Beam Drive, Charlotte, NC 28217",                        "Charlotte",       "NC", 35.2271, -80.8431],
  [396, "(702) 457-3011", "ibew396.org",         "office@ibew396.org",          "3520 Boulder Highway, Las Vegas, NV 89121",                         "Las Vegas",       "NV", 36.1699, -115.1398],
  [400, "(732) 681-7111", "ibew400.org",         null,                          "3301 Highway 138 E, Wall, NJ 07719",                                "Asbury Park",     "NJ", 40.2206, -74.0121],
  [402, "(807) 623-5759", "ibew402.ca",          "office@ibew402.ca",           "103-910 Cobalt Crescent, Thunder Bay, ON P7B 5W3",                  "Thunder Bay",     "ON", 48.3809, -89.2477],
  [424, "(780) 462-5076", "ibew424.net",         "ibew424@ibew424.net",         "4232-93 Street, Edmonton, AB T6E 5P5",                              "Edmonton",        "AB", 53.5461, -113.4938],
  [426, "(605) 336-0370", "ibew426.com",         "office@ibew426.com",          "3725 N Fourth Avenue, Sioux Falls, SD 57104",                       "Sioux Falls",     "SD", 43.5446, -96.7311],
  [429, "(615) 889-4429", "ibew429.org",         "ibew429@ibew429.org",         "2001 Elm Hill Pike, Nashville, TN 37210",                           "Nashville",       "TN", 36.1627, -86.7816],
  [436, "(870) 863-9181", null,                  "ibewl436@sbcglobal.net",      "810 N Newton Street, El Dorado, AR 71730",                          "El Dorado",       "AR", 33.2076, -92.6663],
  [443, "(334) 272-8830", "ibew443.org",         "info@ibew443.org",            "1469 Jean Street, Montgomery, AL 36107",                            "Montgomery",      "AL", 32.3617, -86.2792],
  [449, "(208) 232-5263", "ibewlocal449.org",    "office@ibewlocal449.org",     "1537 Baldy Avenue, Pocatello, ID 83201",                            "Pocatello",       "ID", 42.8713, -112.4455],
  [455, "(413) 733-7398", "ibew455.org",         "office@ibew455.org",          "474 Page Boulevard, Springfield, MA 01104",                         "Springfield",     "MA", 42.1015, -72.5898],
  [456, "(732) 246-2122", "ibew456.org",         "local456@ibew456.org",        "1295 Livingston Avenue, North Brunswick, NJ 08902",                 "North Brunswick", "NJ", 40.4871, -74.4829],
  [474, "(901) 726-4060", "ibewlocal474.com",    "info@ibewlocal474.com",       "1870 Madison Avenue, Memphis, TN 38104",                            "Memphis",         "TN", 35.1495, -90.0490],
  [483, "(253) 565-3232", "ibew483.org",         "general@ibew483.org",         "3525 S Alder Street, Tacoma, WA 98409",                             "Tacoma",          "WA", 47.2529, -122.4443],
  [495, "(910) 660-8630", null,                  null,                          "2725 Old Wrightsboro Road Unit 3C, Wilmington, NC 28405",           "Wilmington",      "NC", 34.2257, -77.9447],
  [530, "(519) 344-4154", "lu530.com",           "IBEW@LU530.com",              "128 Kendall Street, Point Edward, ON N7V 4G5",                      "Sarnia",          "ON", 42.9977, -82.4090],
  [532, "(406) 248-9119", "ibew532.com",         "office@ibew532.com",          "5200 Midland Road, Billings, MT 59101",                             "Billings",        "MT", 45.7833, -108.5007],
  [553, "(919) 596-8220", "ibew553.org",         "office@ibew553.org",          "3300 New Raleigh Highway, Durham, NC 27703",                        "Durham",          "NC", 35.9940, -78.8986],
  [558, "(256) 383-2279", "ibew558.org",         "info@ibew558.org",            "1803 E Seventeenth Street, Sheffield, AL 35660",                    "Sheffield",       "AL", 34.7651, -87.6975],
  [568, "(514) 329-0568", "fioe568.com",         "info@fioe568.com",            "4881 Jarry Street E Suite 228, Montreal, QC H1R 1Y1",               "Montreal",        "QC", 45.5017, -73.5673],
  [583, "(915) 877-9166", "ibew583.com",         "ibew@ibew583.com",            "311 W Borderland Road, El Paso, TX 79932",                          "El Paso",         "TX", 31.7619, -106.4850],
  [586, "(613) 741-5664", "ibew586.org",         "bpotter@ibew586.org",         "2460 Lancaster Road Suite 103, Ottawa, ON K1B 4S5",                 "Ottawa",          "ON", 45.4215, -75.6972],
  [596, "(304) 622-0151", "ibew596.com",         null,                          "1001 N Twelfth Street, Clarksburg, WV 26301",                       "Clarksburg",      "WV", 39.2806, -80.3445],
  [602, "(806) 376-9945", "ibew602.org",         "admin@ibew602.org",           "200 S Fannin Street, Amarillo, TX 79106",                           "Amarillo",        "TX", 35.2220, -101.8313],
  [611, "(505) 343-0611", "ibew611.org",         null,                          "4921 Alexander Boulevard NE Suite A, Albuquerque, NM 87107",        "Albuquerque",     "NM", 35.0844, -106.6504],
  [613, "(404) 523-8107", "ibew613.org",         "admin613@ibew613.org",        "501 Pulliam Street SW Suite 250, Atlanta, GA 30312",                "Atlanta",         "GA", 33.7490, -84.3880],
  [649, "(618) 462-1627", "ibew649.org",         "info@ibew649.org",            "3945 Humbert Road, Alton, IL 62002",                                "Alton",           "IL", 38.8906, -90.1843],
  [659, "(541) 664-0800", "ibew659.org",         "info@ibew659.org",            "4480 Rogue Valley Highway Suite 3, Central Point, OR 97502",        "Medford",         "OR", 42.3265, -122.8756],
  [666, "(804) 353-9666", "ibewlocal666.com",    "info@ibewlocal666.com",       "1400 E Nine Mile Road, Highland Springs, VA 23075",                 "Richmond",        "VA", 37.5407, -77.4360],
  [676, "(850) 477-8767", "ibewlocal676.com",    null,                          "7830 N Palafox Street, Pensacola, FL 32534",                        "Pensacola",       "FL", 30.4213, -87.2169],
  [681, "(940) 322-1661", "ibew681.org",         null,                          "6111 Old Jacksboro Highway, Wichita Falls, TX 76302",               "Wichita Falls",   "TX", 33.9137, -98.4934],
  [688, "(419) 526-4688", "ibew688.org",         "resign688@hotmail.com",       "67 S Walnut Street, Mansfield, OH 44902",                           "Mansfield",       "OH", 40.7584, -82.5154],
  [700, "(479) 783-1149", "ibew700.org",         "ibew700@ibew700.com",         "2914 Midland Boulevard, Ft. Smith, AR 72904",                       "Fort Smith",      "AR", 35.3859, -94.3985],
];

let updated = 0;
let added = 0;
let newEntries = '';

for (const [localNum, phone, website, email, address, city, state, lat, lng] of allLocals) {
  const linemanId = 90000 + localNum;
  const existsPattern = new RegExp(`{ id: ${linemanId}, name: "IBEW Local ${localNum} \\(Lineman\\)",`);

  if (code.match(existsPattern)) {
    // Update existing
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
    // Add new entry
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

// Insert before HFIAW marker (end of lineman array)
const marker = '// ─── HFIAW LOCALS DATABASE';
if (newEntries && code.includes(marker)) {
  code = code.replace(marker, newEntries + marker);
  console.log(`✅ Inserted ${added} new locals into lineman array`);
} else if (newEntries) {
  console.error('ERROR: Could not find insertion marker');
}

// Remove any duplicates in lineman array
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
if (dupsRemoved > 0) console.log(`✅ Removed ${dupsRemoved} duplicate entries`);

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add/update IBEW Lineman locals 1-700" && git push\n');
