const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// [id, localNum, city, state, phone, website, email, address, lat, lng]
const locals = [
  [10024, 24,   "Denver",           "CO", "(303) 623-5386", "ironworkers24.org",           null,                            "501 West 4th Ave., Denver, CO 80223",                              39.7392, -104.9903],
  [10025, 25,   "Novi",             "MI", "(248) 344-9494", "ironworkers25.org",           "union@ironworkers25.org",        "25150 Trans X Drive, Novi, MI 48376",                               42.4806, -83.4755],
  [10027, 27,   "Salt Lake City",   "UT", "(801) 972-5714", "ironworkers27.com",           null,                            "2261 South Redwood Rd. Ste. E, Salt Lake City, UT 84119",          40.7608, -111.8910],
  [10028, 28,   "Midlothian",       "VA", "(804) 716-2081", "ironworkers28.org",           null,                            "2831 Oak Lake Blvd., Midlothian, VA 23112",                        37.5184, -77.6488],
  [10029, 29,   "Portland",         "OR", "(503) 774-0777", "ironworkers29.org",           "info@ironworkers29.org",         "11620 NE Ainsworth Circle Ste. 200, Portland, OR 97220",           45.5231, -122.5585],
  [10033, 33,   "Rochester",        "NY", "(585) 288-2630", "ironworkers33.org",           "iw.local.33@ironworkers33.org", "650 Trabold Rd., Rochester, NY 14624",                             43.1566, -77.6088],
  [10037, 37,   "East Providence",  "RI", "(401) 438-1111", "iwlocal37.com",              "ironworkerslu37@gmail.com",      "845 Waterman Ave., East Providence, RI 02914",                     41.8081, -71.3681],
  [10040, 40,   "New York",         "NY", "(212) 889-1320", "ironworkers40.org",           null,                            "451 Park Ave. South, New York, NY 10016",                          40.7128, -74.0059],
  [10044, 44,   "Hebron",           "KY", "(859) 586-2100", "ironworkers44.com",           null,                            "1125 Victory Pl., Hebron, KY 41048",                               39.0695, -84.7021],
  [10046, 46,   "Springfield",      "IL", "(217) 528-4041", "ironworkers46.org",           null,                            "2888 East Cook St., Springfield, IL 62703",                        39.7817, -89.6501],
  [100461, 46,  "New York",         "NY", "(212) 737-0500", "ml46.org",                   null,                            "1322 3rd Avenue, New York, NY 10021",                               40.7736, -73.9566],
  [10048, 48,   "Oklahoma City",    "OK", "(405) 632-6154", "ironworkers48.org",           "lm48okc@gmail.com",             "1044 SW 22nd St., Oklahoma City, OK 73109",                        35.4676, -97.5164],
  [10055, 55,   "Toledo",           "OH", "(419) 385-6613", "ironworkerslocal55.com",      null,                            "1080 Atlantic Ave., Toledo, OH 43609",                              41.6528, -83.5379],
  [10060, 60,   "Syracuse",         "NY", "(315) 422-8200", "ironworkers60.org",           "busmgr@ironworkers60.org",      "500 West Genesee St., Syracuse, NY 13204",                         43.0481, -76.1474],
  [10063, 63,   "Westchester",      "IL", "(708) 344-7727", "iwlocal63.com",              null,                            "2205 Enterprise Drive Suite 502, Westchester, IL 60154",           41.8502, -87.8873],
  [10066, 66,   "San Antonio",      "TX", "(210) 532-5237", "ironworkerslocal66.org",      null,                            "4318 Clark Ave., San Antonio, TX 78223",                            29.4241, -98.4936],
  [10067, 67,   "Des Moines",       "IA", "(515) 262-9366", "ironworkerslocal67.com",      null,                            "1501 East Aurora Ave., Des Moines, IA 50313",                       41.5868, -93.6250],
  [10070, 70,   "Louisville",       "KY", "(502) 637-8796", "ironworkerslocal70.com",      "iwlu70bm@ironworkers.org",      "2429 Crittenden Dr., Louisville, KY 40217",                        38.2527, -85.7585],
  [10084, 84,   "Houston",          "TX", "(713) 928-3361", "ironworkers84.org",           "local84@comcast.net",           "7521 Fauna St., Houston, TX 77061",                                 29.7604, -95.3698],
  [10086, 86,   "Tukwila",          "WA", "(206) 248-4246", "local86.org",                "local86@local86.org",           "4550 S. 134th Pl. #102, Tukwila, WA 98168",                        47.4709, -122.2621],
  [10089, 89,   "Cedar Rapids",     "IA", "(319) 365-8675", "iwlu89.com",                 null,                            "1112 29th Ave. SW, Cedar Rapids, IA 52404",                         41.9779, -91.6656],
  [10097, 97,   "Maple Ridge",      "BC", "(866) 562-2597", "ironworkerslocal97.com",      "info@ironworkerslocal97.com",   "20135 115A Ave., Maple Ridge, BC V2X 0Z3",                          49.2193, -122.5985],
  [10103, 103,  "Evansville",       "IN", "(812) 477-5317", "ironworkers103.org",          "union@ironworkers103.org",      "5313 Old Boonville Hwy., Evansville, IN 47715",                     37.9716, -87.5711],
  [10111, 111,  "Rock Island",      "IL", "(309) 756-6614", "ironworkers111.org",          null,                            "8000 29th St. West, Rock Island, IL 61201",                         41.5095, -90.5865],
  [10112, 112,  "East Peoria",      "IL", "(309) 699-6489", "ironworkers112.org",          "iwlocal112@gmail.com",          "3003 N. Main St., East Peoria, IL 61611",                           40.6936, -89.5890],
  [10118, 118,  "Sacramento",       "CA", "(916) 646-6976", "iw118.org",                  null,                            "2840 El Centro Rd. Ste. 118, Sacramento, CA 95833",                 38.5816, -121.4944],
  [10135, 135,  "Texas City",       "TX", "(409) 935-2421", "ironworkers135.org",          "iwlu135@aol.com",               "216 Gulf Freeway N, Texas City, TX 77591",                          29.3841, -94.9027],
  [10136, 136,  "Broadview",        "IL", "(708) 615-9300", "riggerslocal136.com",         null,                            "1820 Beach St., Broadview, IL 60155",                               41.8614, -87.8520],
  [10147, 147,  "Fort Wayne",       "IN", "(260) 484-8514", "ironworkers147.org",          null,                            "6345 Innovation Blvd., Fort Wayne, IN 46818",                       41.0793, -85.1394],
  [10155, 155,  "Fresno",           "CA", "(559) 251-7388", "ironworkers155.org",          "local@ironworkers155.org",      "5407 E. Olive Ave. Ste. 106, Fresno, CA 93727",                     36.7378, -119.7871],
  [10167, 167,  "Memphis",          "TN", "(901) 367-1676", "ironworkers167.com",          "iwlu167@bellsouth.net",         "2574 Lindawood Cove, Memphis, TN 38118",                            35.1495, -90.0490],
  [10172, 172,  "Columbus",         "OH", "(614) 497-0550", "ironworkers172.com",          null,                            "2867 South High St., Columbus, OH 43207",                           39.9612, -82.9988],
  [10197, 197,  "Long Island City", "NY", "(718) 361-6534", "ironworkers197.org",          "billhayes197@yahoo.com",        "47-10 32nd Place Ste. 403, Long Island City, NY 11101",             40.7447, -73.9485],
  [10207, 207,  "Youngstown",       "OH", "(330) 758-9777", "iw207.com",                  null,                            "694 Bev Rd., Youngstown, OH 44512",                                 41.0998, -80.6495],
  [10229, 229,  "San Diego",        "CA", "(858) 571-5238", "local229.org",               null,                            "5155 Mercury Point, San Diego, CA 92111",                           32.7157, -117.1611],
  [10263, 263,  "Arlington",        "TX", "(817) 640-0202", "ironworkerslocal263.org",     "iwlu263@gmail.com",             "604 N. Great Southwest Pkwy, Arlington, TX 76011",                  32.7357, -97.1081],
  [10272, 272,  "Fort Lauderdale",  "FL", "(954) 524-8731", "ironworkerslocal272.com",     null,                            "1201 NE 7th Ave., Fort Lauderdale, FL 33304",                       26.1224, -80.1373],
  [10290, 290,  "Tipp City",        "OH", "(937) 222-1622", "iron290.com",                null,                            "4191 E. US Rt. 40, Tipp City, OH 45371",                            39.9611, -84.1716],
  [10361, 361,  "Ozone Park",       "NY", "(718) 322-1016", "ironworkers361.com",          "unionhall@local361.com",        "89-19 97th Ave., Ozone Park, NY 11416",                             40.6782, -73.8458],
  [10377, 377,  "San Francisco",    "CA", "(415) 285-3880", "ironworkers377.com",          null,                            "570 Barneveld Ave., San Francisco, CA 94124",                       37.7749, -122.4194],
  [10378, 378,  "Benicia",          "CA", "(707) 746-6100", "ironworkers378.org",          null,                            "3120 Bayshore Rd., Benicia, CA 94510",                              38.0499, -122.1597],
  [10380, 380,  "Urbana",           "IL", "(217) 367-6014", "ironworkers380.org",          "ironworkers380@gmail.com",      "1602 East Butzow Dr., Urbana, IL 61802",                            40.1164, -88.2434],
  [10383, 383,  "Madison",          "WI", "(608) 256-3162", "iron383.com",                null,                            "5501 Manufacturer's Dr., Madison, WI 53704",                        43.0731, -89.4012],
  [10384, 384,  "Knoxville",        "TN", "(865) 689-3371", "ironworkers384.com",          null,                            "1000 Buchanan Ave. NE, Knoxville, TN 37917",                        35.9606, -83.9207],
  [10387, 387,  "Atlanta",          "GA", "(404) 505-0022", "ironworkerslocal387.com",     "iwlocal387@aol.com",            "109 Selig Dr. SW, Atlanta, GA 30336",                               33.7490, -84.3880],
  [10392, 392,  "East St. Louis",   "IL", "(618) 874-0313", "ironworkers392.org",          null,                            "2995 Kingshighway, East St. Louis, IL 62201",                       38.6245, -90.1542],
  [10395, 395,  "Portage",          "IN", "(219) 763-7900", "ironworkers395.com",          "webmaster@ironworkers395.com",  "6570 Ameriplex Dr., Portage, IN 46368",                             41.5759, -87.1764],
  [10396, 396,  "St. Louis",        "MO", "(314) 647-3008", "ironworkers396.org",          null,                            "2500 59th St., St. Louis, MO 63110",                                38.6270, -90.1994],
  [10397, 397,  "Tampa",            "FL", "(813) 623-1515", "iwl397.com",                 null,                            "10201 US Highway 92 East, Tampa, FL 33610",                         27.9506, -82.4572],
  [10399, 399,  "Hammonton",        "NJ", "(856) 456-9323", "ironworkers399.org",          null,                            "26 E. Fleming Pike, Hammonton, NJ 08037",                           39.6434, -74.7996],
  [10401, 401,  "Philadelphia",     "PA", "(215) 676-3000", "local401.com",               "ironworkers401@aol.com",        "11600 Norcom Rd., Philadelphia, PA 19154",                          40.0719, -74.9942],
  [10402, 402,  "Riviera Beach",    "FL", "(561) 842-7651", null,                         null,                            "1001 West 15th St., Riviera Beach, FL 33404",                       26.7748, -80.0581],
  [10404, 404,  "Harrisburg",       "PA", "(717) 564-8550", "ironworkerslocal404.org",     null,                            "981 Peifers Ln., Harrisburg, PA 17109",                             40.2732, -76.8867],
  [10405, 405,  "Philadelphia",     "PA", "(215) 462-7300", "reinforcedironworkersriggerslocal405.com", null,              "2433 Reed St., Philadelphia, PA 19146",                             39.9313, -75.1826],
  [10416, 416,  "Norwalk",          "CA", "(562) 868-1251", "ironworkers416.org",          null,                            "13830 San Antonio Dr., Norwalk, CA 90650",                          33.9022, -118.0820],
  [10417, 417,  "Wallkill",         "NY", "(845) 566-8417", "ironworkers417.org",          null,                            "583 Rte. 32, Wallkill, NY 12589",                                   41.6012, -74.1654],
  [10424, 424,  "North Haven",      "CT", "(203) 787-4154", "ironworkers424.org",          null,                            "15 Bernhard Rd., North Haven, CT 06473",                            41.3908, -72.8593],
  [10433, 433,  "City of Industry", "CA", "(626) 964-2500", "ironworkers433.org",          "keith@ironworkers433.org",      "17495 Hurley St. East, City of Industry, CA 91744",                 34.0125, -117.9626],
  [10440, 440,  "Whitesboro",       "NY", "(315) 735-4531", "ironworkers440.com",          null,                            "10 Main St. Ste. 100, Whitesboro, NY 13492",                        43.1206, -75.2927],
  [10444, 444,  "Joliet",           "IL", "(815) 725-1804", "ironworkers444.com",          null,                            "2082 Oak Leaf St., Joliet, IL 60436",                               41.5250, -88.0817],
  [10451, 451,  "Wilmington",       "DE", "(302) 994-0946", "iwlocal451.org",             null,                            "203 Old DuPont Rd., Wilmington, DE 19804",                          39.7447, -75.5484],
  [10482, 482,  "Austin",           "TX", "(512) 385-2500", "ironworkers482.org",          null,                            "2201 Riverside Farms Rd., Austin, TX 78741",                        30.2672, -97.7431],
  [10492, 492,  "Nashville",        "TN", "(615) 226-5435", "ironworkers492.org",          null,                            "2524 Dickerson Pike, Nashville, TN 37207",                          36.1627, -86.7816],
  [10495, 495,  "Albuquerque",      "NM", "(505) 242-9124", "ironworkers495.org",          "busmgr@ironworkers495.org",     "2524 Baylor Dr. SE, Albuquerque, NM 87106",                         35.0844, -106.6504],
  [10498, 498,  "Rockford",         "IL", "(815) 873-9180", "iwlocal498.org",             null,                            "5640 Sockness Dr., Rockford, IL 61109",                             42.2711, -89.0940],
  [10512, 512,  "St. Paul",         "MN", "(651) 489-1488", "ironworkers512.com",          null,                            "851 Pierce Butler Route, St. Paul, MN 55104",                       44.9537, -93.0900],
  [10516, 516,  "Portland",         "OR", "(503) 257-4743", "local516.org",               "shopmens@pacifier.com",         "11620 NE Ainsworth Circle Ste. 300, Portland, OR 97220",            45.5231, -122.5585],
  [10549, 549,  "Wheeling",         "WV", "(304) 232-2660", "iwlocal549.org",             null,                            "2350 Main St., Wheeling, WV 26003",                                 40.0640, -80.7209],
  [10550, 550,  "Canton",           "OH", "(330) 455-5164", "iw550.org",                  null,                            "618 High Ave. NW, Canton, OH 44703",                                40.7989, -81.3784],
  [10568, 568,  "Cumberland",       "MD", "(301) 777-7433", "ironworkers568.org",          null,                            "119 South Centre St., Cumberland, MD 21502",                        39.6526, -78.7625],
  [10577, 577,  "Keokuk",           "IA", "(319) 313-8581", "ironworkers577.org",          "ironworkerslu577@gmail.com",    "2700 Kindustry Park Rd., Keokuk, IA 52632",                         40.3975, -91.3848],
  [10580, 580,  "New York",         "NY", "(212) 594-1662", "ironworkers580.org",          null,                            "501 West 42nd St., New York, NY 10036",                             40.7580, -73.9940],
  [10584, 584,  "Tulsa",            "OK", "(918) 437-1446", "tulsaironworkers.com",        "ironworkers584@sbcglobal.net",  "14716 E. Pine St, Tulsa, OK 74116",                                 36.1540, -95.9928],
  [10597, 597,  "Jacksonville",     "FL", "(904) 764-3265", "ironworkers597.com",          "info@ironworkers597.com",       "9616 Kentucky St., Jacksonville, FL 32218",                         30.3322, -81.6557],
  [10623, 623,  "Baton Rouge",      "LA", "(225) 357-3262", "ironworkerslocal623.org",     "luke@local623.org",             "6153 Airline Highway, Baton Rouge, LA 70805",                       30.4515, -91.1871],
  [10625, 625,  "Waipahu",          "HI", "(808) 671-4344", null,                         null,                            "94-497 Ukee St., Waipahu, HI 96797",                                21.3865, -158.0095],
  [10643, 643,  "Victoria",         "BC", "(250) 213-8661", null,                         "ironworkers643@outlook.com",    "Unit 105, 1497 Admirals Rd., Victoria, BC V9A 2P8",                 48.4284, -123.3656],
  [10700, 700,  "Maidstone",        "ON", "(519) 737-7110", "ironworkerslocal700.com",     null,                            "R.R.#3, 4069 County Rd. #46, Maidstone, ON N0R 1K0",                42.2668, -82.9131],
  [10704, 704,  "Chattanooga",      "TN", "(423) 622-2111", "iw704.com",                  "ironworkers704@iw704.com",      "2715 Belle Arbor Ave., Chattanooga, TN 37406",                      35.0456, -85.3097],
  [10709, 709,  "Pooler",           "GA", "(912) 748-5118", "ironworkerslocal709.org",     "bmc709@ymail.com",              "131 Westside Blvd., Pooler, GA 31322",                              32.1152, -81.2479],
  [10711, 711,  "Montreal",         "QC", "(514) 328-2808", "local711.ca",                "info@local711.ca",              "9950 Boul. Du Golf, Anjou, QC H1J 2Y7",                             45.5017, -73.5673],
  [10720, 720,  "Edmonton",         "AB", "(780) 482-0720", "ironworkers720.com",          "admin@ironworkers720.com",      "10512-122 St., Edmonton, AB T5N 1M6",                               53.5461, -113.4938],
  [10721, 721,  "Etobicoke",        "ON", "(416) 236-4026", "iw721.org",                  null,                            "909 Kipling Ave., Etobicoke, ON M8Z 5H3",                           43.6205, -79.5132],
  [10725, 725,  "Calgary",          "AB", "(403) 291-1300", "ironworkers725.com",          null,                            "6111 36 St. SE, Calgary, AB T2C 3W2",                               51.0447, -114.0719],
  [10728, 728,  "West St. Paul",    "MB", "(204) 783-7853", "ironworkers728.com",          "officeadmin@ironworkers728.com","54B St. Paul Blvd., West St. Paul, MB R2P 2W5",                     49.9990, -97.1327],
  [10732, 732,  "Pocatello",        "ID", "(208) 232-4873", "iw732.org",                  null,                            "1700 N. Harrison Ave., Pocatello, ID 83204",                        42.8713, -112.4455],
  [10736, 736,  "Ancaster",         "ON", "(905) 679-6439", "iw736.com",                  "steven.pratt@iw736.com",        "1384 Osprey Dr., Ancaster, ON L9G 4V5",                             43.2188, -80.0022],
  [10752, 752,  "Lakeside",         "NS", "(902) 450-5615", "ironworkerslocal752.com",     "iron.worker@ns.sympatico.ca",   "24 Lakeside Park Dr. Unit 103, Lakeside, NS B3T 1L1",               44.6488, -63.5752],
  [10759, 759,  "Thunder Bay",      "ON", "(807) 345-8151", "ironworkers759.org",          "iw759@iw759.com",               "915 Alloy Dr., Thunder Bay, ON P7B 5Z8",                            48.3809, -89.2477],
  [10765, 765,  "Metcalfe",         "ON", "(613) 821-7813", "ironworkers765.com",          "local765@ironworkers765.com",   "7771 Snake Island Rd., Metcalfe, ON K0A 2P0",                       45.2334, -75.4710],
  [10769, 769,  "Ashland",          "KY", "(606) 324-0415", "ironworkerslocal769.com",     null,                            "2151 Greenup Ave., Ashland, KY 41105",                              38.4784, -82.6379],
  [10771, 771,  "Regina",           "SK", "(306) 522-7932", "local771.ca",                "jeff@local771.ca",              "1138 Dewdney Ave. E, Regina, SK S4N 0E2",                           50.4452, -104.6189],
  [10782, 782,  "Paducah",          "KY", "(270) 442-2722", "ironworkers782.org",          "ironworkerslo782@bellsouth.net","2424 Cairo Rd., Paducah, KY 42001",                                 37.0834, -88.6000],
  [10786, 786,  "Sudbury",          "ON", "(705) 674-6903", "iw786.com",                  null,                            "97 St. George St., Sudbury, ON P3C 2W7",                            46.4900, -80.9911],
  [10787, 787,  "Parkersburg",      "WV", "(304) 485-6231", "ironworkers787.org",          null,                            "303 Erickson Blvd., Parkersburg, WV 26101",                         39.2667, -81.5615],
  [10808, 808,  "Orlando",          "FL", "(407) 859-9366", "ironworkers808.com",          null,                            "200 East Landstreet Rd., Orlando, FL 32824",                        28.5383, -81.3792],
  [10809, 809,  "Saint John",       "NB", "(506) 343-6678", null,                         null,                            "407 Westmorland Rd., Saint John, NB E2J 2S0",                       45.2733, -66.0633],
  [10834, 834,  "Toronto",          "ON", "(905) 920-4331", "iw834.com",                  null,                            "Toronto, ON",                                                       43.6532, -79.3832],
  [10842, 842,  "Moncton",          "NB", "(506) 857-4871", "ironworkers842.ca",           "administration@ironworkers842.ca","1133 St. George Blvd. Ste. 450, Moncton, NB E1E 4E1",            46.0878, -64.7782],
  [10846, 846,  "Aiken",            "SC", "(803) 644-2187", "iw846.org",                  null,                            "6220 Woodside Executive Court, Aiken, SC 29803",                    33.5601, -81.7198],
  [10848, 848,  "North Charleston", "SC", "(843) 552-1554", "ironworkers848.org",          null,                            "7326 Pepperdam Ave., North Charleston, SC 29418",                   32.8546, -79.9748],
];

// Check for existing IDs and add new ones
let added = 0;
let skipped = 0;
let newEntries = '';

for (const [id, localNum, city, state, phone, website, email, address, lat, lng] of locals) {
  // Check if this ID already exists
  if (code.includes(`{ id: ${id},`)) {
    skipped++;
    continue;
  }
  const phoneStr = phone ? `"${phone}"` : 'null';
  const cleanSite = website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : null;
  const siteStr = cleanSite ? `"${cleanSite}"` : 'null';
  const emailStr = email ? `, email: "${email}"` : '';
  newEntries += `  { id: ${id}, name: "IW Local ${localNum}", city: "${city}", state: "${state}", phone: ${phoneStr}, website: ${siteStr}, lat: ${lat}, lng: ${lng}, address: "${address}"${emailStr} },\n`;
  added++;
}

// Insert before closing of IW_LOCALS
const marker = '];\nconst LIUNA_LOCALS';
if (!code.includes(marker)) {
  console.error('ERROR: IW_LOCALS closing marker not found');
  // Try to find it another way
  const iwStart = code.indexOf('const IW_LOCALS = [');
  const iwEnd = code.indexOf('];', iwStart);
  if (iwStart !== -1 && iwEnd !== -1) {
    code = code.slice(0, iwEnd) + '\n' + newEntries + code.slice(iwEnd);
    console.log(`✅ Added ${added} IW locals (alternate method)`);
  } else {
    process.exit(1);
  }
} else {
  code = code.replace(marker, newEntries + marker);
  console.log(`✅ Added ${added} new IW locals`);
}

if (skipped > 0) console.log(`ℹ️  Skipped ${skipped} already existing locals`);

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Ironworkers locals 24-848" && git push\n');
