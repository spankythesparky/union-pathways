const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// All ironworkers locals
// [id, localNum, name, city, state, phone, website, email, address, lat, lng]
const locals = [
  [10001, 1,    "IW Local 1",    "Forest Park",      "IL", "(708) 366-6695", "iwlocal1.com",           null,                         "7720 Industrial Drive, Forest Park, IL 60130",                   41.8781, -87.6298],
  [10003, 3,    "IW Local 3",    "Pittsburgh",        "PA", "(412) 227-6767", "iwlocal3.com",           null,                         "2201 Liberty Ave., Pittsburgh, PA 15222",                         40.4406, -79.9959],
  [10005, 5,    "IW Local 5",    "Largo",             "MD", "(301) 599-0960", "ironworkers5.org",       null,                         "9301 Peppercorn Place, Largo, MD 20774",                          38.8929, -76.8405],
  [10006, 6,    "IW Local 6",    "West Seneca",       "NY", "(716) 828-1200", "ironworkerslocal6.com",  "ironworkerlocal6@aol.com",   "196 Orchard Park Rd., West Seneca, NY 14224",                    42.8447, -78.7998],
  [10007, 7,    "IW Local 7",    "South Boston",      "MA", "(617) 268-4777", "iwlocal7.org",           null,                         "195 Old Colony Ave., South Boston, MA 02127",                     42.3320, -71.0450],
  [10008, 8,    "IW Local 8",    "Milwaukee",         "WI", "(414) 476-9370", "iwl8.org",               null,                         "12034 West Adler Ln., Milwaukee, WI 53214",                       43.0389, -87.9065],
  [10009, 9,    "IW Local 9",    "Niagara Falls",     "NY", "(716) 285-5738", "ironworkers9.org",       null,                         "412 39th St., Niagara Falls, NY 14303",                           43.0962, -79.0377],
  [10010, 10,   "IW Local 10",   "Kansas City",       "MO", "(816) 842-8917", "ironworkers10.com",      null,                         "1000 E 10th St, Kansas City, MO 64106",                           39.0997, -94.5786],
  [10011, 11,   "IW Local 11",   "Bloomfield",        "NJ", "(973) 338-3777", "ironworkers11.org",      null,                         "1500 Broad Street, Bloomfield, NJ 07003",                         40.8037, -74.1885],
  [10012, 12,   "IW Local 12",   "Latham",            "NY", "(518) 435-0470", "ironworkers12.org",      "frontoffice@iwl12.org",      "17 Hemlock St., Latham, NY 12110",                                42.7454, -73.7540],
  [10014, 14,   "IW Local 14",   "Spokane",           "WA", "(509) 927-8288", "ironworkers14.org",      null,                         "16610 E. Euclid Ave., Spokane, WA 99216",                         47.6587, -117.4260],
  [10015, 15,   "IW Local 15",   "Hartford",          "CT", "(860) 249-7639", "ironworkers15.org",      null,                         "49 Locust Street, Hartford, CT 06114",                            41.7658, -72.6851],
  [10017, 17,   "IW Local 17",   "Cleveland",         "OH", "(216) 771-5558", "iw17.org",               "union@ironworkers17.org",    "1544 E. 23rd St., Cleveland, OH 44114",                           41.4993, -81.6944],
  [10021, 21,   "IW Local 21",   "Omaha",             "NE", "(712) 252-1761", "iw21.org",               null,                         "14515 Industrial Rd, Omaha, NE 68144",                            41.2565, -95.9345],
  [10022, 22,   "IW Local 22",   "Indianapolis",      "IN", "(317) 243-8222", "ironworkers22.com",      null,                         "5600 Dividend Road, Indianapolis, IN 46241",                      39.7684, -86.1581],
  [10075, 75,   "IW Local 75",   "Phoenix",           "AZ", "(602) 268-1449", "ironworkers75.org",      null,                         "950 E. Elwood St., Phoenix, AZ 85040",                            33.4484, -112.0740],
  [10092, 92,   "IW Local 92",   "Birmingham",        "AL", "(205) 323-4551", "ironworkerslocal92.org", "localno92@bellsouth.net",    "2828 4th Avenue South, Birmingham, AL 35233",                     33.5186, -86.8104],
  [10321, 321,  "IW Local 321",  "Little Rock",       "AR", "(501) 374-3705", null,                     "ironworkers321@yahoo.com",   "1315 W 2nd St, Little Rock, AR 72201",                            34.7465, -92.2896],
  [10477, 477,  "IW Local 477",  "Sheffield",         "AL", "(256) 383-3334", "ironworkers477.org",     null,                         "506 N Nashville Ave, Sheffield, AL 35660",                        34.7651, -87.6975],
  [10751, 751,  "IW Local 751",  "Anchorage",         "AK", "(907) 563-4766", "ironworkers751.org",     null,                         "8141 Schoon St, Anchorage, AK 99518",                             61.2181, -149.9003],
  [10798, 798,  "IW Local 798",  "Semmes",            "AL", "(251) 645-2477", "ironworkers798.org",     null,                         "7920 Crary Station Rd., Semmes, AL 36575",                        30.6954, -88.0399],
  [10845, 845,  "IW Local 845",  "Beaver",            "PA", "(412) 849-1271", "ironworkers845.org",     "contact@ironworkers845.org", "PO Box 190, Beaver, PA 15009",                                    40.6959, -80.3045],
  [10852, 852,  "IW Local 852",  "Framingham",        "MA", "(508) 202-9453", "ironworkers852.org",     null,                         "9 Pleasant Street, Framingham, MA 01701",                         42.2793, -71.4162],
  [10854, 854,  "IW Local 854",  "Fredericksburg",    "VA", "(757) 461-3454", "ironworkers854.org",     "iwlu854a@ironworkers.org",   "415 William Street, Fredericksburg, VA 22401",                    38.3032, -77.4605],
  // Local 847 — multiple locations
  [108471, 847, "IW Local 847",  "Houston",           "TX", "(713) 984-9980", "ironworkers847.org",     null,                         "16233 Clay Rd Suite 320, Houston, TX 77084",                      29.7604, -95.3698],
  [108472, 847, "IW Local 847",  "Omaha",             "NE", "(402) 731-2490", "ironworkers847.org",     null,                         "4205 South 87th St., Omaha, NE 68127",                            41.2133, -96.0779],
  [108473, 847, "IW Local 847",  "Denver",            "CO", "(303) 287-4301", "ironworkers847.org",     null,                         "5575 Tejon St., Denver, CO 80221",                                39.7392, -104.9903],
  [108474, 847, "IW Local 847",  "Phoenix",           "AZ", "(602) 233-0417", "ironworkers847.org",     null,                         "3131 W. Lewis Ave Suite 100, Phoenix, AZ 85009",                  33.4484, -112.0740],
  [108475, 847, "IW Local 847",  "West Valley City",  "UT", "(801) 463-2897", "ironworkers847.org",     null,                         "2702 South 3600 West Suite C, West Valley City, UT 84119",        40.6916, -112.0010],
];

// Build new entries
let entries = locals.map(([id, localNum, name, city, state, phone, website, email, address, lat, lng]) => {
  const phoneStr = phone ? `"${phone}"` : 'null';
  const cleanSite = website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : null;
  const siteStr = cleanSite ? `"${cleanSite}"` : 'null';
  const emailStr = email ? `, email: "${email}"` : '';
  return `  { id: ${id}, name: "${name}", city: "${city}", state: "${state}", phone: ${phoneStr}, website: ${siteStr}, lat: ${lat}, lng: ${lng}, address: "${address}"${emailStr} },`;
}).join('\n');

// Replace empty IW_LOCALS array
code = code.replace('const IW_LOCALS = [];', `const IW_LOCALS = [\n${entries}\n];`);

fs.writeFileSync(filePath, code, 'utf8');
console.log(`✅ Added ${locals.length} Ironworkers locals`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Ironworkers locals" && git push\n');
