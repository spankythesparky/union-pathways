const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Data from Excel — [localNum, phone, website, address]
const updates = [
  [1,   "(314) 647-5900", "ibewlocal1.org",       "5850 Elizabeth Ave, St. Louis, MO 63110"],
  [3,   "(718) 591-4000", "local3ibew.org",        "158-11 Jewel Ave 4th Floor, Flushing, NY 11365"],
  [5,   "(412) 432-1400", "ibew5.org",             "5 Hot Metal St, Pittsburgh, PA 15203"],
  [6,   "(415) 861-5752", "ibew6.org",             "55 Fillmore St #2, San Francisco, CA 94117"],
  [7,   "(413) 734-7137", "ibewlocal7.com",        "95 Liberty Street, Springfield, MA 01103"],
  [8,   "(419) 666-8920", "ibew8.org",             "807 Lime City Rd, Rossford, OH 43460"],
  [11,  "(323) 517-9610", "ibew11.org",            "297 N Marengo Ave, Pasadena, CA 91101"],
  [12,  "(719) 561-8000", "ibew12.org",            "2901 Farabaugh Lane, Pueblo, CO 81005"],
  [13,  "(319) 752-0452", "ibewlocal13.com",       "1205 N Central Avenue, Burlington, IA 52601"],
  [14,  "(715) 878-4068", "ibew14.net",            "9480 Highway 53, Fall Creek, WI 54742"],
  [16,  "(812) 867-9670", "ibewlocal16.com",       "9001 N Kentucky Avenue, Evansville, IN 47725"],
  [20,  "(972) 263-1122", "ibew20.org",            "684 W Tarrant Road, Grand Prairie, TX 75050"],
  [22,  "(402) 331-8147", "ibew22.org",            "8946 L Street, Omaha, NE 68127"],
  [24,  "(410) 247-5511", "ibewlocal24.org",       "2701 W Patapsco Avenue Suite 200, Baltimore, MD 21230"],
  [25,  "(631) 273-4567", "ibew25.org",            "370 Vanderbilt Motor Parkway, Hauppauge, NY 11788"],
  [26,  "(301) 459-2900", "ibewlocal26.org",       "4371 Parliament Place Suite B, Lanham, MD 20706"],
  [32,  "(419) 229-2774", "ibew32.com",            "1975 N West Street, Lima, OH 45801"],
  [3401,"(309) 673-3691", "ibew34.org",            "4322 Ricketts Avenue, Bartonville, IL 61607"],
  [35,  "(860) 525-5438", "ibewlocal35.org",       "961 Wethersfield Avenue, Hartford, CT 06114"],
  [38,  "(216) 621-3090", "ibew38.org",            "1590 E 23rd Street, Cleveland, OH 44114"],
  [40,  "(818) 762-4239", "ibew40.org",            "5643 Vineland Avenue, North Hollywood, CA 91601"],
  [41,  "(716) 662-6111", "ibewlocal41.com",       "S-3546 California Road, Orchard Park, NY 14127"],
  [43,  "(315) 422-0435", "ibew43.org",            "4568 Waterhouse Road, Clay, NY 13041"],
  [46,  "(253) 395-6500", "ibew46.org",            "19802 62nd Avenue S Suite 105, Kent, WA 98032"],
  [48,  "(503) 256-4848", "ibew48.com",            "15937 NE Airport Way, Portland, OR 97230"],
  [56,  "(814) 825-5505", "ibewlocal56.org",       "185 Pennbriar Drive, Erie, PA 16509"],
  [58,  "(313) 963-2130", "ibewlocal58.org",       "1358 Abbott Street, Detroit, MI 48226"],
  [60,  "(210) 337-1741", "ibewlu60.org",          "3518 N Loop 1604 E, San Antonio, TX 78247"],
  [64,  "(330) 758-8654", "ibew64.org",            "350 E Western Reserve Road, Youngstown, OH 44514"],
  [68,  "(303) 297-0229", "ibewlu68.com",          "5660 Logan Street, Denver, CO 80216"],
  [72,  "(254) 754-3121", "ibewlu72.com",          "1813 Orchard Lane, Waco, TX 76705"],
  [73,  "(509) 326-2182", "ibew73.org",            "1616 N Washington Street, Spokane, WA 99205"],
  [76,  "(253) 475-1190", "ibew76.org",            "3049 S 36th Street Suite 101, Tacoma, WA 98409"],
  [80,  "(757) 480-1740", "ibew80.com",            "5307 E Virginia Beach Boulevard, Norfolk, VA 23502"],
  [81,  "(570) 344-5711", "ibew81.org",            "431 Wyoming Avenue, Scranton, PA 18503"],
  [82,  "(937) 898-4239", "ibew82.org",            "6550 Poe Avenue, Dayton, OH 45414"],
  [86,  "(585) 235-1510", "ibewlu86.org",          "2300 E River Road, Rochester, NY 14623"],
  [90,  "(203) 265-9533", "ibewlocal90.org",       "2 N Plains Industrial Road, Wallingford, CT 06492"],
  [95,  "(417) 623-2025", "ibewlocal95.com",       "3316 S Main Street, Joplin, MO 64804"],
  [96,  "(508) 753-8635", "ibewlocal96.org",       "242 Mill Street, Worcester, MA 01602"],
  [98,  "(215) 563-5592", "ibew98.org",            "4960 S Twelfth Street, Philadelphia, PA 19112"],
  [99,  "(401) 946-9900", "ibew99.org",            "22 Amflex Drive, Cranston, RI 02921"],
  [100, "(559) 251-8241", "ibew100.org",           "5434 E Lamona Avenue, Fresno, CA 93727"],
  [102, "(973) 887-1718", "ibew102.org",           "50 Parsippany Road, Parsippany, NJ 07054"],
  [103, "(617) 436-3710", "ibew103.com",           "256 Freeport Street, Dorchester, MA 02122"],
  [106, "(716) 484-9449", "ibew106.org",           "322 James Avenue, Jamestown, NY 14701"],
  [110, "(651) 776-4239", "ibew110.org",           "1330 Conway Street Suite 110, St. Paul, MN 55106"],
  [111, "(303) 744-7171", "ibew111.org",           "5965 E 39th Avenue, Denver, CO 80207"],
  [112, "(509) 735-0512", "ibewlu112.com",         "114 N Edison Street, Kennewick, WA 99336"],
];

// Additional locals not in original app
const newLocals = [
  [113, "(719) 633-3872", "ibew113.com",           "2150 Naegele Road, Colorado Springs, CO 80904", "Colorado Springs", "CO", 38.8339, -104.8214],
  [117, "(847) 854-7200", "ibew117.com",           "765 Munshaw Lane, Crystal Lake, IL 60014", "Crystal Lake", "IL", 42.2411, -88.3162],
  [124, "(816) 942-7500", "ibew124.org",           "301 E 103rd Terrace, Kansas City, MO 64114", "Kansas City", "MO", 39.0997, -94.5786],
  [127, "(262) 654-0912", "ibew127.org",           "3030 39th Avenue, Kenosha, WI 53144", "Kenosha", "WI", 42.5847, -87.8212],
  [129, "(440) 233-7156", "ibew129.org",           "6100 S Broadway Suite 201, Lorain, OH 44053", "Lorain", "OH", 41.4523, -82.1824],
  [130, "(504) 831-1372", "ibewlu130.com",         "3200 Ridgelake Drive Suite 300, Metairie, LA 70002", "New Orleans", "LA", 29.9511, -90.0715],
  [131, "(269) 382-1762", "ibew131.com",           "3641 E Cork Street, Kalamazoo, MI 49001", "Kalamazoo", "MI", 42.2917, -85.5872],
  [134, "(312) 454-1340", "lu134.org",             "2722 S Martin Luther King Drive, Chicago, IL 60616", "Chicago", "IL", 41.8781, -87.6298],
  [136, "(205) 833-0909", "ibew136.org",           "845 Gadsden Highway, Birmingham, AL 35235", "Birmingham", "AL", 33.5186, -86.8104],
  [139, "(607) 732-1237", "ibew139.com",           "415 W Second Street, Elmira, NY 14901", "Elmira", "NY", 42.0898, -76.8077],
  [141, "(304) 242-3870", "ibew141.org",           "Wheeling, WV", "Wheeling", "WV", 40.0640, -80.7209],
  [143, "(717) 232-7093", "ibewlocal143.org",      "1501 Revere Street, Harrisburg, PA 17104", "Harrisburg", "PA", 40.2732, -76.8867],
  [145, "(309) 736-4239", "ibewlocal145.com",      "1700 52nd Avenue Suite A, Moline, IL 61265", "Davenport", "IA", 41.5236, -90.5776],
  [146, "(217) 877-4604", "ibew146.com",           "3390 N Woodford Street, Decatur, IL 62526", "Decatur", "IL", 39.8403, -88.9548],
  [150, "(847) 680-1504", "ibew150.org",           "31290 N US Highway 45 Unit B, Libertyville, IL 60048", "Waukegan", "IL", 42.3636, -87.8448],
  [153, "(574) 287-8655", "ibew153.com",           "56475 Peppermint Road, South Bend, IN 46619", "South Bend", "IN", 41.6764, -86.2520],
  [158, "(920) 432-0158", "ibew158.com",           "2970 Greenbrier Road, Green Bay, WI 54311", "Green Bay", "WI", 44.5133, -88.0133],
  [159, "(608) 255-2989", "ibew159.org",           "5303 Fen Oak Drive, Madison, WI 53718", "Madison", "WI", 43.0731, -89.4012],
  [163, "(570) 823-4028", "ibew163.org",           "1269 Sans Souci Parkway, Wilkes-Barre, PA 18706", "Wilkes-Barre", "PA", 41.2459, -75.8813],
  [164, "(201) 265-1700", "ibew164.org",           "205 Robin Road Suite 315, Paramus, NJ 07652", "Jersey City", "NJ", 40.7178, -74.0431],
  [175, "(423) 894-3557", "ibew175.org",           "3922 Volunteer Drive Suite 9, Chattanooga, TN 37416", "Chattanooga", "TN", 35.0456, -85.3097],
  [176, "(815) 729-1240", "ibewlocal176.org",      "1100 NE Frontage Road, Joliet, IL 60431", "Joliet", "IL", 41.5250, -88.0817],
  [177, "(904) 355-4569", "ibew177.org",           "966 Liberty Street, Jacksonville, FL 32206", "Jacksonville", "FL", 30.3322, -81.6557],
  [180, "(707) 251-9180", "ibewlu180.org",         "720 Technology Way-B, Napa, CA 94558", "Napa", "CA", 38.2975, -122.2869],
  [191, "(425) 259-3195", "ibew191.com",           "3100 164th Street NE, Marysville, WA 98271", "Everett", "WA", 47.9790, -122.2021],
  [193, "(217) 544-3479", "ibew193.com",           "3150 Wide Track Drive, Springfield, IL 62703", "Springfield", "IL", 39.7817, -89.6501],
  [194, "(318) 688-0194", "ibew194.org",           "5510 Buncombe Road, Shreveport, LA 71129", "Shreveport", "LA", 32.5252, -93.7502],
  [197, "(309) 827-4868", "ibew197.org",           "2407 Beich Road Suite A, Bloomington, IL 61705", "Bloomington", "IL", 40.4842, -88.9937],
  [212, "(513) 559-0200", "local212.com",          "212 Crowne Point Place Suite 101, Cincinnati, OH 45241", "Cincinnati", "OH", 39.1031, -84.5120],
  [223, "(508) 880-2690", "ibew223.org",           "475 Myles Standish Boulevard, Taunton, MA 02780", "Brockton", "MA", 41.9995, -71.0589],
  [226, "(785) 232-1761", "ibew226.com",           "1620 NW Gage Boulevard, Topeka, KS 66618", "Topeka", "KS", 39.0489, -95.6780],
  [229, "(717) 843-8368", "ibew229.org",           "555 Willow Springs Lane, York, PA 17406", "York", "PA", 39.9626, -76.7277],
  [231, "(712) 255-8138", "ibew231.com",           "5001 Harbor Drive, Sioux City, IA 51111", "Sioux City", "IA", 42.4999, -96.4003],
  [233, "(406) 442-3185", "ibew233.org",           "110 N Warren Street Suite 1, Helena, MT 59601", "Helena", "MT", 46.5958, -112.0270],
  [234, "(831) 633-2311", "ibew234.org",           "747 El Camino Real N, Salinas, CA 93907", "Salinas", "CA", 36.6777, -121.6555],
  [236, "(518) 783-9957", "ibew236.org",           "3000 Troy Schenectady Road, Niskayuna, NY 12309", "Albany", "NY", 42.6526, -73.7562],
  [237, "(716) 297-3650", "ibew237.com",           "6700 Schultz Street, Niagara Falls, NY 14304", "Niagara Falls", "NY", 43.0962, -79.0377],
  [241, "(607) 272-2809", "ibewlocal241.com",      "134 Cecil A. Malone Drive, Ithaca, NY 14850", "Ithaca", "NY", 42.4440, -76.5021],
  [242, "(218) 728-6895", "ibew242.org",           "2002 London Road Room 111, Duluth, MN 55812", "Duluth", "MN", 46.7867, -92.1005],
  [246, "(740) 282-7572", null,                    "626 N Fourth Street, Steubenville, OH 43952", "Steubenville", "OH", 40.3698, -80.6342],
  [252, "(734) 424-0978", "ibew252.org",           "7920 Jackson Road Suite A, Ann Arbor, MI 48103", "Ann Arbor", "MI", 42.2808, -83.7430],
  [257, "(573) 635-2133", "ibew257.org",           "209 Flora Drive, Jefferson City, MO 65101", "Jefferson City", "MO", 38.5767, -92.1735],
  [265, "(402) 423-4497", "ibew265.org",           "1409 Old Farm Road, Lincoln, NE 68512", "Lincoln", "NE", 40.8136, -96.7026],
  [269, "(609) 394-8129", "ibew269.com",           "670 Whitehead Road, Trenton, NJ 08648", "Trenton", "NJ", 40.2170, -74.7429],
  [270, "(865) 483-1354", "ibewlocal270.org",      "138 N Lincoln Circle, Oak Ridge, TN 37830", "Oak Ridge", "TN", 36.0104, -84.2696],
  [271, "(316) 267-8255", "ibew271.com",           "1040 S Broadway, Wichita, KS 67211", "Wichita", "KS", 37.6872, -97.3301],
  [275, "(616) 837-7149", "ibew275.org",           "140 N 64th Avenue, Coopersville, MI 49404", "Coopersville", "MI", 43.0636, -85.9328],
  [278, "(361) 855-1084", "ibew278.com",           "2301 Saratoga Boulevard, Corpus Christi, TX 78417", "Corpus Christi", "TX", 27.8006, -97.3964],
  [280, "(541) 812-1771", "ibew280.org",           "32969 Highway 99 E, Tangent, OR 97389", "Tangent", "OR", 44.5382, -123.1059],
  [288, "(319) 233-8050", "ibew288.org",           "1695 Burton Avenue, Waterloo, IA 50703", "Waterloo", "IA", 42.4928, -92.3426],
  [291, "(208) 343-4861", "ibew291.org",           "225 N Sixteenth Street Suite 110, Boise, ID 83702", "Boise", "ID", 43.6150, -116.2023],
  [292, "(612) 379-1292", "ibew292.org",           "6700 W Broadway Avenue, Brooklyn Park, MN 55428", "Minneapolis", "MN", 44.9778, -93.2650],
  [295, "(501) 562-2244", "ibew295.org",           "7320 S University Avenue, Little Rock, AR 72209", "Little Rock", "AR", 34.7465, -92.2896],
  [300, "(802) 864-5864", "ibewlocal300.org",      "3 Gregory Drive, South Burlington, VT 05403", "Burlington", "VT", 44.4759, -73.2121],
  [301, "(903) 838-8531", null,                    "114 Elm Street, Nash, TX 75569", "Texarkana", "TX", 33.4251, -94.0477],
  [302, "(925) 228-2302", "ibewlu302.com",         "1875 Arnold Drive, Martinez, CA 94553", "Martinez", "CA", 37.9910, -122.1341],
];

let updated = 0;
let skipped = 0;

// Update existing locals
for (const [localNum, phone, website, address] of updates) {
  // Match by id field
  const idPattern = new RegExp(`{ id: ${localNum},([^}]+)}`);
  const match = code.match(idPattern);
  if (!match) { skipped++; continue; }

  let entry = match[0];
  const original = entry;

  // Update phone
  if (phone) {
    entry = entry.replace(/phone: (?:null|"[^"]*")/, `phone: "${phone}"`);
  }
  // Update website - strip http/https and trailing slashes
  if (website) {
    const cleanSite = website.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
    entry = entry.replace(/website: (?:null|"[^"]*")/, `website: "${cleanSite}"`);
  }
  // Update address
  if (address) {
    entry = entry.replace(/address: "[^"]*"/, `address: "${address}"`);
  }

  if (entry !== original) {
    code = code.replace(original, entry);
    updated++;
  }
}

console.log(`✅ Updated ${updated} existing locals (${skipped} not found in app)`);

// Add new locals that aren't in the app yet
let added = 0;
const insertBefore = '// ─── IBEW LINEMAN LOCALS';
if (!code.includes(insertBefore)) {
  console.error('ERROR: Could not find IBEW LINEMAN marker to insert new locals');
} else {
  let newEntries = '\n';
  for (const [localNum, phone, website, address, city, state, lat, lng] of newLocals) {
    const cleanSite = website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : null;
    const phoneStr = phone ? `"${phone}"` : 'null';
    const siteStr = cleanSite ? `"${cleanSite}"` : 'null';
    newEntries += `  { id: ${localNum}, name: "IBEW Local ${localNum}", city: "${city}", state: "${state}", phone: ${phoneStr}, website: ${siteStr}, lat: ${lat}, lng: ${lng}, address: "${address}" },\n`;
    added++;
  }
  code = code.replace(insertBefore, newEntries + insertBefore);
  console.log(`✅ Added ${added} new locals`);
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: update IBEW Inside locals with full contact info" && git push\n');
