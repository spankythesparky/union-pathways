const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// All locals from the Excel sheet
// [localNum, phone, website, email, address, city, state, lat, lng]
const allLocals = [
  [305, "(260) 484-9714", "ibew305.org",        "local305@ibew305.org",          "136 Chambeau Road, Fort Wayne, IN 46805",                    "Fort Wayne",      "IN", 41.0793, -85.1394],
  [306, "(330) 245-2240", "ibew306.org",        "info@ibew306.org",              "2650 S Main Street Suite 200, Akron, OH 44319",              "Akron",           "OH", 41.0814, -81.5190],
  [307, "(301) 724-3403", "ibew307.org",        "administrator@ibew307.org",     "401 Decatur Street, Cumberland, MD 21502",                   "Cumberland",      "MD", 39.6526, -78.7625],
  [309, "(618) 345-5112", "ibew309.com",        "electricians@ibew309.org",      "2000A Mall Street, Collinsville, IL 62234",                  "Collinsville",    "IL", 38.6703, -89.9845],
  [313, "(302) 328-0773", "ibew313.org",        "info@ibew313.org",              "814 W Basin Road, New Castle, DE 19720",                     "New Castle",      "DE", 39.6618, -75.5666],
  [317, "(304) 429-5013", "ibew317.net",        "office@ibew317.com",            "1848 Madison Avenue Suite A, Huntington, WV 25704",          "Huntington",      "WV", 38.4193, -82.4452],
  [322, "(307) 265-1060", "ibew322.org",        "office@ibew322.org",            "691 English Drive, Casper, WY 82601",                        "Casper",          "WY", 42.8666, -106.3131],
  [325, "(607) 729-6171", "ibew325.net",        "businessmanager@ibew325.net",   "142 Corporate Drive, Binghamton, NY 13904",                  "Binghamton",      "NY", 42.0987, -75.9180],
  [332, "(408) 269-4332", "ibew332.org",        "info@ibew332.org",              "2125 Canoas Garden Avenue Suite 100, San Jose, CA 95125",    "San Jose",        "CA", 37.3382, -121.8863],
  [340, "(916) 927-4239", "ibewlocal340.org",   "office@ibewlocal340.org",       "10240 Systems Parkway Suite 100, Sacramento, CA 95827",      "Sacramento",      "CA", 38.5816, -121.4944],
  [342, "(336) 285-7781", "ibew342.org",        "ibew342@att.net",               "7874 Thorndike Road, Greensboro, NC 27409",                  "Greensboro",      "NC", 36.0726, -79.7920],
  [343, "(507) 282-7081", "ibewlocal343.org",   null,                            "9 80th Street SE, Rochester, MN 55904",                      "Rochester",       "MN", 44.0121, -92.4802],
  [347, "(515) 243-1924", "ibewlu347.org",      "info@ibewlu347.org",            "6809 SE Bellagio Court, Ankeny, IA 50021",                   "Des Moines",      "IA", 41.5868, -93.6250],
  [349, "(305) 325-1330", "ibew349.net",        "info@ibew349.org",              "1657 NW Seventeenth Avenue, Miami, FL 33125",                "Miami",           "FL", 25.7617, -80.1918],
  [350, "(573) 221-2648", null,                 "ibew350@outlook.com",           "801 Church Street, Hannibal, MO 63401",                      "Hannibal",        "MO", 39.7081, -91.3585],
  [351, "(609) 704-8351", "ibew351.org",        null,                            "1113 Black Horse Pike, Hammonton, NJ 08037",                 "Asbury Park",     "NJ", 40.2206, -74.4946],
  [354, "(801) 972-9354", "ibew354.org",        "office@ibew354.org",            "3400 W 2100 S, Salt Lake City, UT 84119",                    "Salt Lake City",  "UT", 40.7608, -111.8910],
  [357, "(702) 452-9357", "ibew357.net",        "ibew357@ibew357.net",           "808 N Lamb Boulevard, Las Vegas, NV 89110",                  "Las Vegas",       "NV", 36.1699, -115.1398],
  [363, "(845) 783-3500", "ibewlu363.org",      "office363@ibewlu363.org",       "67 Commerce Drive S, Harriman, NY 10926",                    "New City",        "NY", 41.1476, -74.1468],
  [364, "(815) 398-6282", "ibew364.org",        "office@ibew364.net",            "6820 Mill Road, Rockford, IL 61108",                         "Rockford",        "IL", 42.2711, -89.0940],
  [369, "(502) 368-2568", "ibewlocal369.com",   "ehall@ibewlocal369.com",        "4315 Preston Highway Suite 102, Louisville, KY 40213",       "Louisville",      "KY", 38.2527, -85.7585],
  [375, "(610) 432-9762", "ibew375.org",        null,                            "101 S Seventh Street, Allentown, PA 18101",                  "Allentown",       "PA", 40.6084, -75.4902],
  [379, "(704) 455-4595", "ibew379.org",        "ibewlu379@ibew379.org",         "1900 Cross Beam Drive, Charlotte, NC 28217",                 "Charlotte",       "NC", 35.2271, -80.8431],
  [388, "(715) 341-2696", "ibewlocal388.org",   "info@ibewlocal388.org",         "5224 Heffron Court, Stevens Point, WI 54481",                "Stevens Point",   "WI", 44.5236, -89.5746],
  [400, "(732) 681-7111", "ibew400.org",        null,                            "3301 Highway 138 E, Wall, NJ 07719",                         "Asbury Park",     "NJ", 40.2206, -74.0121],
  [401, "(775) 329-2566", "ibewlocal401.org",   "ibew401@ibewlocal401.org",      "4635 Longley Lane Suite 109, Reno, NV 89502",                "Reno",            "NV", 39.5296, -119.8138],
  [405, "(319) 396-8241", "ibew405.org",        "ibew405@ibew405.org",           "1211 Wiley Boulevard SW, Cedar Rapids, IA 52404",            "Cedar Rapids",    "IA", 41.9779, -91.6656],
  [413, "(805) 688-8083", "ibew413.org",        null,                            "100 Thomas Road, Buellton, CA 93427",                        "Santa Barbara",   "CA", 34.4208, -119.6982],
  [415, "(307) 632-5944", "ibew415.org",        "info@ibew415.org",              "810 Fremont Avenue, Cheyenne, WY 82001",                     "Cheyenne",        "WY", 41.1400, -104.8202],
  [426, "(605) 336-0370", "ibew426.com",        "office@ibew426.com",            "3725 N Fourth Avenue, Sioux Falls, SD 57104",                "Sioux Falls",     "SD", 43.5446, -96.7311],
  [428, "(661) 323-2979", "ibew428.org",        "mail@ibew428.org",              "3921 N Sillect Avenue, Bakersfield, CA 93308",               "Bakersfield",     "CA", 35.3733, -119.0187],
  [429, "(615) 889-4429", "ibew429.org",        "ibew429@ibew429.org",           "2001 Elm Hill Pike, Nashville, TN 37210",                    "Nashville",       "TN", 36.1627, -86.7816],
  [430, "(262) 633-2844", "ibewlu430.org",      "info@ibewlu430.org",            "1840 Sycamore Avenue, Racine, WI 53406",                     "Racine",          "WI", 42.7261, -87.7829],
  [436, "(870) 863-9181", null,                 "ibewl436@sbcglobal.net",        "810 N Newton Street, El Dorado, AR 71730",                   "El Dorado",       "AR", 33.2076, -92.6663],
  [440, "(951) 684-5665", "ibew440.org",        "contact@ibew440.org",           "1605 Spruce Street, Riverside, CA 92507",                    "Riverside",       "CA", 33.9806, -117.3755],
  [441, "(714) 939-3131", "ibewoc.com",         "admin@ibewoc.com",              "309 N Rampart Street Suite M, Orange, CA 92868",             "Orange County",   "CA", 33.7879, -117.8531],
  [443, "(334) 272-8830", "ibew443.org",        "info@ibew443.org",              "1469 Jean Street, Montgomery, AL 36107",                     "Montgomery",      "AL", 32.3617, -86.2792],
  [444, "(580) 762-4441", null,                 "ibew444@sbcglobal.net",         "200 N Second Street, Ponca City, OK 74601",                  "Ponca City",      "OK", 36.7070, -97.0856],
  [445, "(269) 964-4545", "ibew445.com",        "info@ibew445.com",              "4071 W Dickman Road, Springfield, MI 49037",                 "Battle Creek",    "MI", 42.3212, -85.1797],
  [446, "(318) 323-3350", "ibew446.com",        "ibew446@gmail.com",             "805 N 30th Street, Monroe, LA 71201",                        "Monroe",          "LA", 32.5093, -92.1193],
  [449, "(208) 232-5263", "ibewlocal449.org",   "office@ibewlocal449.org",       "1537 Baldy Avenue, Pocatello, ID 83201",                     "Pocatello",       "ID", 42.8713, -112.4455],
  [453, "(417) 869-7251", "ibew453.com",        null,                            "2902 E Division Street, Springfield, MO 65803",              "Springfield",     "MO", 37.2090, -93.2923],
  [461, "(630) 897-0461", "ibew461.org",        "adminoffice@ibew461.com",       "591 Sullivan Road Suite 100, Aurora, IL 60506",              "Aurora",          "IL", 41.7606, -88.3201],
  [466, "(304) 342-0800", "ibew466.org",        null,                            "800 Indiana Avenue, Charleston, WV 25302",                   "Charleston",      "WV", 38.3498, -81.6326],
  [474, "(901) 726-4060", "ibewlocal474.com",   "info@ibewlocal474.com",         "1870 Madison Avenue, Memphis, TN 38104",                     "Memphis",         "TN", 35.1495, -90.0490],
  [477, "(909) 890-0607", "ibew477.org",        null,                            "1875 Business Center Drive, San Bernardino, CA 92408",       "San Bernardino",  "CA", 34.1083, -117.2898],
  [479, "(409) 833-8252", "ibew479.com",        null,                            "1430 Spindletop Road, Beaumont, TX 77705",                   "Beaumont",        "TX", 30.0802, -94.1266],
  [480, "(601) 373-8434", "ibew480.org",        "ibew480@ibew480.org",           "4767 I-55 S, Jackson, MS 39212",                             "Jackson",         "MS", 32.2988, -90.1848],
  [481, "(317) 923-2596", "ibew481.org",        "info@ibew481.org",              "1828 N Meridian Street Suite 205, Indianapolis, IN 46202",   "Indianapolis",    "IN", 39.7684, -86.1581],
  [488, "(203) 452-7679", "ibewlocal488.org",   "office@ibewlocal488.org",       "721 Main Street, Monroe, CT 06468",                          "Bridgeport",      "CT", 41.1865, -73.1952],
  [490, "(603) 224-4239", "ibew490.org",        "info@ibew490.org",              "48 Airport Road, Concord, NH 03301",                         "Concord",         "NH", 43.2081, -71.5376],
  [494, "(414) 327-5202", "ibew494.com",        null,                            "3303 S 103rd Street, Milwaukee, WI 53227",                   "Milwaukee",       "WI", 43.0389, -87.9065],
  [495, "(910) 660-8630", null,                 "ibewunion495@gmail.com",        "2725 Old Wrightsboro Road Unit 3C, Wilmington, NC 28405",    "Wilmington",      "NC", 34.2257, -77.9447],
  [498, "(231) 943-4980", "ibewlocal498.com",   "ibew@local498.net",             "3912 Blair Townhall Road W, Traverse City, MI 49685",        "Traverse City",   "MI", 44.7631, -85.6206],
  [505, "(251) 476-0275", "ibew505.org",        "info@ibew505.org",              "2244 Halls Mill Road, Mobile, AL 36606",                     "Mobile",          "AL", 30.6954, -88.0399],
  [508, "(912) 964-5080", "ibewlocal508.org",   "officemanager@ibewlocal508.org","1526 Dean Forest Road, Savannah, GA 31408",                  "Savannah",        "GA", 32.0835, -81.0998],
  [518, "(928) 425-8177", null,                 "ibew518@hotmail.com",           "1383 N AZ Highway 188, Globe, AZ 85501",                     "Globe",           "AZ", 33.3942, -110.7857],
  [520, "(512) 326-9540", "ibew520.org",        "info@ibew520.org",              "4818 E Ben White Boulevard Suite 300, Austin, TX 78741",     "Austin",          "TX", 30.2672, -97.7431],
  [527, "(409) 933-9800", "ibew527.com",        "LU@ibew527.com",               "2509 FM 2004, Texas City, TX 77591",                         "Galveston",       "TX", 29.3013, -94.7977],
  [531, "(219) 362-2119", "ibewlocal531.org",   null,                            "2751 N State Road 39, LaPorte, IN 46350",                    "LaPorte",         "IN", 41.6103, -86.7222],
  [532, "(406) 248-9119", "ibew532.com",        "office@ibew532.com",            "5200 Midland Road, Billings, MT 59101",                      "Billings",        "MT", 45.7833, -108.5007],
  [538, "(217) 442-0996", "ibew538.org",        "ibew@ibew538.com",              "1290 N Michigan Avenue, Danville, IL 61834",                 "Danville",        "IL", 40.1242, -87.6300],
  [540, "(330) 837-4239", "ibew540.org",        null,                            "2333 Nave Road SE, Massillon, OH 44646",                     "Canton",          "OH", 40.7989, -81.3784],
  [545, "(816) 232-3578", "ibewlocal545.net",   null,                            "5804 Corporate Drive, St. Joseph, MO 64507",                 "St. Joseph",      "MO", 39.7675, -94.8467],
  [551, "(707) 542-3505", "ibewlocal551.org",   "ibew551@ibewlocal551.org",      "2525 Cleveland Avenue Suite B, Santa Rosa, CA 95403",        "Santa Rosa",      "CA", 38.4404, -122.7141],
  [553, "(919) 596-8220", "ibew553.org",        "office@ibew553.org",            "3300 New Raleigh Highway, Durham, NC 27703",                 "Raleigh",         "NC", 35.7796, -78.6382],
  [557, "(989) 781-0516", "ibew557.org",        null,                            "7303 Gratiot Road, Saginaw, MI 48609",                       "Saginaw",         "MI", 43.4195, -83.9508],
  [558, "(256) 383-2279", "ibew558.org",        "info@ibew558.org",              "1803 E Seventeenth Street, Sheffield, AL 35660",             "Sheffield",       "AL", 34.7651, -87.6975],
  [567, "(207) 786-9770", "ibew567.com",        "info@ibew567.com",              "238 Goddard Road, Lewiston, ME 04240",                       "Auburn",          "ME", 44.0979, -70.2312],
  [569, "(858) 569-8900", "ibew569.org",        null,                            "4545 Viewridge Avenue Suite 100, San Diego, CA 92123",       "San Diego",       "CA", 32.7157, -117.1611],
  [570, "(520) 622-6745", "ibew570.org",        null,                            "750 S Tucson Boulevard, Tucson, AZ 85716",                   "Tucson",          "AZ", 32.2226, -110.9747],
  [573, "(330) 394-3606", "ibew573.org",        null,                            "4550 Research Parkway NW, Warren, OH 44483",                 "Warren",          "OH", 41.2376, -80.8184],
  [575, "(740) 353-8000", "ibew575.org",        "office@ibew575.com",            "110 Offnere Street, Portsmouth, OH 45662",                   "Portsmouth",      "OH", 38.7318, -82.9977],
  [576, "(318) 443-5811", null,                 "office@ibewlocal576.com",       "6703 Masonic Drive, Alexandria, LA 71301",                   "Alexandria",      "LA", 31.3113, -92.4451],
  [577, "(920) 739-9408", "ibewlu577.com",      "admin@ibewlu577.com",           "1024 S Lawe Street, Appleton, WI 54915",                     "Appleton",        "WI", 44.2619, -88.4154],
  [583, "(915) 877-9166", "ibew583.com",        "ibew@ibew583.com",              "311 W Borderland Road, El Paso, TX 79932",                   "El Paso",         "TX", 31.7619, -106.4850],
  [584, "(918) 592-2989", "ibew584.com",        "office@ibew584.com",            "584 S Lewis Avenue, Tulsa, OK 74104",                        "Tulsa",           "OK", 36.1540, -95.9928],
  [595, "(925) 556-0595", "ibew595.org",        "info@ibew595.org",              "6850 Regional Street Suite 100, Dublin, CA 94568",           "Dublin",          "CA", 37.7021, -121.9358],
  [596, "(304) 622-0151", "ibew596.com",        null,                            "1001 N Twelfth Street, Clarksburg, WV 26301",                "Clarksburg",      "WV", 39.2806, -80.3445],
  [601, "(217) 352-1741", "ibew601.org",        "office@ibew601.org",            "3301 N Boardwalk Drive, Champaign, IL 61822",                "Champaign",       "IL", 40.1164, -88.2434],
];

let updated = 0;
let added = 0;
let newEntries = '';

for (const [localNum, phone, website, email, address, city, state, lat, lng] of allLocals) {
  // Check if local already exists
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

// Insert new entries before IBEW LINEMAN DATABASE
const marker = '// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ──────────────────';
if (newEntries && code.includes(marker)) {
  code = code.replace(marker, newEntries + marker);
  console.log(`✅ Inserted ${added} new locals into array`);
} else if (newEntries) {
  console.error('ERROR: Could not find insertion marker');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add/update IBEW Inside locals 305-601" && git push\n');
