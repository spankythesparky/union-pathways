const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// [localNum, phone, website, email, address, city, state, lat, lng]
const allLocals = [
  [602, "(806) 376-9945", "ibew602.org",        "admin@ibew602.org",              "200 S Fannin Street, Amarillo, TX 79106",                      "Amarillo",        "TX", 35.2220, -101.8313],
  [606, "(407) 896-7271", "ibew606.org",        "info@ibew606.org",               "820 Virginia Drive, Orlando, FL 32803",                         "Orlando",         "FL", 28.5383, -81.3792],
  [607, "(570) 648-9831", "ibew607.com",        null,                             "25 S Fifth Street, Shamokin, PA 17872",                         "Shamokin",        "PA", 40.7887, -76.5574],
  [611, "(505) 343-0611", "ibew611.org",        null,                             "4921 Alexander Boulevard NE Suite A, Albuquerque, NM 87107",    "Albuquerque",     "NM", 35.0844, -106.6504],
  [613, "(404) 523-8107", "ibew613.org",        "admin613@ibew613.org",           "501 Pulliam Street SW Suite 250, Atlanta, GA 30312",            "Atlanta",         "GA", 33.7490, -84.3880],
  [617, "(650) 574-4239", "ibew617.com",        "information@ibew617.com",        "1701 Leslie Street, San Mateo, CA 94402",                       "San Mateo",       "CA", 37.5630, -122.3255],
  [639, "(805) 543-5693", "ibew639.org",        "admin@ibew639.org",              "6363 Edna Road, San Luis Obispo, CA 93401",                     "San Luis Obispo", "CA", 35.2828, -120.6596],
  [640, "(602) 264-4506", "ibew640.com",        "info@ibew640.com",               "5808 N Seventh Street, Phoenix, AZ 85014",                      "Phoenix",         "AZ", 33.4484, -112.0740],
  [648, "(513) 863-6515", "ibew648.org",        "local648@ibew648.org",           "4300 Millikin Road, Hamilton, OH 45011",                        "Hamilton",        "OH", 39.3995, -84.5613],
  [649, "(618) 462-1627", "ibew649.org",        "info@ibew649.org",               "3945 Humbert Road, Alton, IL 62002",                            "Alton",           "IL", 38.8906, -90.1843],
  [654, "(610) 494-2820", "ibew654.com",        null,                             "3729 Chichester Avenue, Boothwyn, PA 19061",                    "Chester",         "PA", 39.8493, -75.3557],
  [659, "(541) 664-0800", "ibew659.org",        "info@ibew659.org",               "4480 Rogue Valley Highway Suite 3, Central Point, OR 97502",    "Medford",         "OR", 42.3265, -122.8756],
  [661, "(620) 663-3431", "ibew661.com",        "info@ibew661.com",               "200 W Second Avenue, Hutchinson, KS 67501",                     "Hutchinson",      "KS", 38.0608, -97.9298],
  [665, "(517) 393-5530", "ibew665.org",        null,                             "5710 Ivan Drive, Lansing, MI 48917",                            "Lansing",         "MI", 42.7325, -84.5555],
  [666, "(804) 353-9666", "ibewlocal666.com",   "info@ibewlocal666.com",          "1400 E Nine Mile Road, Highland Springs, VA 23075",             "Richmond",        "VA", 37.5407, -77.4360],
  [668, "(765) 474-1021", "ibew668.org",        "ibew668@ibew668.org",            "2535 S 30th Street Suite 1, Lafayette, IN 47909",               "Lafayette",       "IN", 40.4167, -86.8753],
  [673, "(440) 255-3414", "ibew673.org",        null,                             "8356 Munson Road, Mentor, OH 44060",                            "Painesville",     "OH", 41.7237, -81.2448],
  [676, "(850) 477-8767", "ibewlocal676.com",   "ibewlu676@yahoo.com",            "7830 N Palafox Street, Pensacola, FL 32534",                    "Pensacola",       "FL", 30.4213, -87.2169],
  [681, "(940) 322-1661", "ibew681.org",        null,                             "6111 Old Jacksboro Highway, Wichita Falls, TX 76302",           "Wichita Falls",   "TX", 33.9137, -98.4934],
  [683, "(614) 294-4786", "ibew683.org",        "staff@ibew683.org",              "939 Goodale Boulevard Suite 100, Columbus, OH 43212",           "Columbus",        "OH", 39.9612, -82.9988],
  [684, "(209) 524-5171", "ibewlu684.org",      "info@ibewlu684.org",             "519 Twelfth Street, Modesto, CA 95354",                         "Modesto",         "CA", 37.6391, -120.9969],
  [688, "(419) 526-4688", "ibew688.org",        "resign688@hotmail.com",          "67 S Walnut Street, Mansfield, OH 44902",                       "Mansfield",       "OH", 40.7584, -82.5154],
  [692, "(989) 684-4510", "ibew692.org",        null,                             "1300 W Thomas Street, Bay City, MI 48706",                      "Bay City",        "MI", 43.5945, -83.8889],
  [697, "(219) 945-0697", "ibew697.org",        "info@ibew697.org",               "7200 Mississippi Street Suite 200, Merrillville, IN 46410",     "Gary",            "IN", 41.5934, -87.3464],
  [700, "(479) 783-1149", "ibew700.org",        "ibew700@ibew700.com",            "2914 Midland Boulevard, Ft. Smith, AR 72904",                   "Fort Smith",      "AR", 35.3859, -94.3985],
  [701, "(630) 393-1701", "ibew701.org",        "local701@ibew701.org",           "28600 Bella Vista Parkway Suite 1000, Warrenville, IL 60555",   "Warrenville",     "IL", 41.8128, -88.1651],
  [702, "(618) 932-2102", "ibew702.org",        null,                             "106 N Monroe Street, West Frankfort, IL 62896",                 "West Frankfort",  "IL", 37.8978, -88.9209],
  [704, "(563) 582-5947", "ibew704.com",        "ibew704@live.com",               "1610 Garfield Avenue, Dubuque, IA 52001",                       "Dubuque",         "IA", 42.5006, -90.6646],
  [712, "(724) 775-0969", "ibew712.org",        "local712@ibew712.org",           "217 Sassafras Lane, Beaver, PA 15009",                          "Beaver",          "PA", 40.6959, -80.3045],
  [714, "(701) 852-3025", "local714.com",       "office@local714.com",            "125 35th Avenue NE, Minot, ND 58703",                           "Minot",           "ND", 48.2325, -101.2963],
  [716, "(713) 869-8900", "ibew716.net",        "ibew716@ibew716.net",            "1475 N Loop W, Houston, TX 77008",                              "Houston",         "TX", 29.7604, -95.3698],
  [725, "(812) 877-4239", "ibew725.org",        "unionhall@ibew725.org",          "5675 Hulman Street, Terre Haute, IN 47803",                     "Terre Haute",     "IN", 39.4667, -87.4139],
  [728, "(954) 525-3106", "ibew728.org",        "info@ibew728.org",               "201 SE 24th Street, Ft. Lauderdale, FL 33316",                  "Fort Lauderdale", "FL", 26.1224, -80.1373],
  [743, "(610) 777-3100", "ibewlocal743.org",   "info@local743ibew.org",          "20 Morgan Drive, Reading, PA 19608",                            "Reading",         "PA", 40.3356, -75.9269],
  [756, "(386) 756-2756", "ibew756.org",        "ibew756@msn.com",                "5901 S Williamson Boulevard, Port Orange, FL 32128",            "Daytona Beach",   "FL", 29.1858, -81.0131],
  [760, "(865) 524-8638", "ibew760.org",        "info@ibew760.org",               "1530 Bill Williams Avenue, Knoxville, TN 37917",                "Knoxville",       "TN", 35.9606, -83.9207],
  [768, "(406) 752-7680", "ibew768.com",        "office@ibew768.com",             "347 Second Avenue W, Kalispell, MT 59901",                      "Kalispell",       "MT", 48.1920, -114.3168],
  [776, "(843) 554-1080", null,                 "local776@ibew776.com",           "3345 Seiberling Road, North Charleston, SC 29418",              "Charleston",      "SC", 32.7765, -79.9311],
  [812, "(570) 368-8984", "ibew812.com",        null,                             "500 Jordan Avenue, Montoursville, PA 17754",                    "Williamsport",    "PA", 41.2415, -77.0011],
  [816, "(270) 898-2456", "ibewlocal816.org",   "ibewlocal816@ibewlocal816.org",  "4515 Clarks River Road, Paducah, KY 42003",                     "Paducah",         "KY", 37.0834, -88.6000],
  [840, "(315) 789-3330", "ibew840.org",        "ibew840@ibew840.org",            "PO Box 851, Geneva, NY 14456",                                  "Geneva",          "NY", 42.8687, -76.9777],
  [852, "(662) 286-2897", null,                 "ibewlocal852@bellsouth.net",     "192 County Road 509, Corinth, MS 38834",                        "Corinth",         "MS", 34.9343, -88.5223],
  [855, "(765) 282-6392", "ibew855.com",        null,                             "4601 S Meeker Avenue, Muncie, IN 47302",                        "Muncie",          "IN", 40.1934, -85.3864],
  [861, "(337) 436-3324", "ibewlu861.org",      null,                             "3000 Highway 90 E, Lake Charles, LA 70615",                     "Lake Charles",    "LA", 30.2266, -93.2174],
  [873, "(765) 457-5371", "ibew873.com",        "ibew873@ibew873.com",            "1931 South Elizabeth Street, Kokomo, IN 46902",                 "Kokomo",          "IN", 40.4865, -86.1336],
  [890, "(608) 752-0321", "ibew890.org",        "local890@ibew890.org",           "1900 Reuther Way, Janesville, WI 53546",                        "Janesville",      "WI", 42.6828, -89.0187],
  [903, "(228) 863-9881", "lu903.com",          "lu903@lu903.com",                "2417 32nd Street, Gulfport, MS 39501",                          "Gulfport",        "MS", 30.3674, -89.0928],
  [906, "(906) 226-7497", "ibew906.org",        null,                             "119 S Front Street, Marquette, MI 49855",                       "Marquette",       "MI", 46.5436, -87.3954],
  [910, "(315) 782-5630", "ibew910.org",        null,                             "25001 Water Street, Watertown, NY 13601",                       "Watertown",       "NY", 43.9748, -75.9107],
  [915, "(813) 621-6451", "ibew915.org",        "info@ibew915.org",               "5621 Harney Road, Tampa, FL 33610",                             "Tampa",           "FL", 27.9506, -82.4572],
  [917, "(601) 483-0486", "ibew917.net",        "office@ibew917.com",             "1620 Highway 39 N, Meridian, MS 39301",                         "Meridian",        "MS", 32.3643, -88.7037],
  [932, "(541) 756-3907", null,                 "office@ibew932.com",             "3427 Ash Street, North Bend, OR 97459",                         "Coos Bay",        "OR", 43.3665, -124.2179],
  [934, "(423) 323-5411", "ibew934.com",        null,                             "4640 Highway 11 W, Blountville, TN 37617",                      "Kingsport",       "TN", 36.5484, -82.5618],
  [948, "(810) 767-3308", "local948.org",       null,                             "1251 W Hill Road, Flint, MI 48507",                             "Flint",           "MI", 43.0125, -83.6875],
  [952, "(805) 642-2149", "ibew952.org",        "ibewoffice@ibewlu952.org",       "3994 E Main Street, Ventura, CA 93003",                         "Ventura",         "CA", 34.2805, -119.2945],
  [968, "(304) 485-7412", "ibew968.com",        "ibew968@ibew968.com",            "1845 Seventh Street, Parkersburg, WV 26101",                    "Parkersburg",     "WV", 39.2667, -81.5615],
  [972, "(740) 373-5054", "ibew972.com",        "local@ibew972.org",              "50 Sandhill Road, Reno, OH 45773",                              "Marietta",        "OH", 39.4151, -81.4549],
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

// Check for duplicate IDs and remove old ones
const dupChecks = [602, 606, 607, 611, 613, 617, 639, 640, 648, 649, 654, 659, 661, 665, 666, 668, 673, 676, 681, 683, 684, 688, 692, 697, 700, 701, 702, 704, 712, 714, 716, 725, 728, 743, 756, 760, 768, 776, 812, 816, 840, 852, 855, 861, 873, 890, 903, 906, 910, 915, 917, 932, 934, 948, 952, 968, 972];
let dupsRemoved = 0;
for (const localNum of dupChecks) {
  // Find all occurrences
  const regex = new RegExp(`  \\{ id: ${localNum}, name: "IBEW Local ${localNum}",[^\\n]+\\n`, 'g');
  const matches = code.match(regex);
  if (matches && matches.length > 1) {
    // Keep the first one (original), remove the rest
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
console.log('   git add src/App.jsx && git commit -m "feat: add/update IBEW Inside locals 602-972" && git push\n');
