const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// These are the duplicate IDs we added (11300, 11700, etc.)
// We need to REMOVE these lines entirely
const duplicateIds = [
  11300, 11700, 12400, 12700, 12900, 13000, 13100, 13400, 13600, 13900,
  14100, 14300, 14500, 14600, 15000, 15300, 15800, 15900, 16300, 16400,
  17500, 17600, 17700, 18000, 19100, 19300, 19400, 19700, 21200, 22300,
  22600, 22900, 23100, 23300, 23400, 23600, 23700, 24100, 24200, 24600,
  25200, 25700, 26500, 26900, 27000, 27100, 27500, 27800, 28000, 28800,
  29100, 29200, 29500, 30000, 30100, 30200
];

let removed = 0;
for (const dupId of duplicateIds) {
  const regex = new RegExp(`  \\{ id: ${dupId}, name:[^\\n]+\\n`, 'g');
  const before = code.length;
  code = code.replace(regex, '');
  if (code.length < before) removed++;
}

console.log(`✅ Removed ${removed} duplicate entries`);

// Now update the ORIGINALS with the better data from Excel
const updates = [
  [113,  "(719) 633-3872", "ibew113.com",       "2150 Naegele Road, Colorado Springs, CO 80904"],
  [117,  "(847) 854-7200", "ibew117.com",        "765 Munshaw Lane, Crystal Lake, IL 60014"],
  [124,  "(816) 942-7500", "ibew124.org",        "301 E 103rd Terrace, Kansas City, MO 64114"],
  [127,  "(262) 654-0912", "ibew127.org",        "3030 39th Avenue, Kenosha, WI 53144"],
  [129,  "(440) 233-7156", "ibew129.org",        "6100 S Broadway Suite 201, Lorain, OH 44053"],
  [130,  "(504) 831-1372", "ibewlu130.com",      "3200 Ridgelake Drive Suite 300, Metairie, LA 70002"],
  [131,  "(269) 382-1762", "ibew131.com",        "3641 E Cork Street, Kalamazoo, MI 49001"],
  [136,  "(205) 833-0909", "ibew136.org",        "845 Gadsden Highway, Birmingham, AL 35235"],
  [139,  "(607) 732-1237", "ibew139.com",        "415 W Second Street, Elmira, NY 14901"],
  [141,  "(304) 242-3870", "ibew141.org",        "Wheeling, WV"],
  [143,  "(717) 232-7093", "ibewlocal143.org",   "1501 Revere Street, Harrisburg, PA 17104"],
  [145,  "(309) 736-4239", "ibewlocal145.com",   "1700 52nd Avenue Suite A, Moline, IL 61265"],
  [146,  "(217) 877-4604", "ibew146.com",        "3390 N Woodford Street, Decatur, IL 62526"],
  [150,  "(847) 680-1504", "ibew150.org",        "31290 N US Highway 45 Unit B, Libertyville, IL 60048"],
  [153,  "(574) 287-8655", "ibew153.com",        "56475 Peppermint Road, South Bend, IN 46619"],
  [158,  "(920) 432-0158", "ibew158.com",        "2970 Greenbrier Road, Green Bay, WI 54311"],
  [159,  "(608) 255-2989", "ibew159.org",        "5303 Fen Oak Drive, Madison, WI 53718"],
  [163,  "(570) 823-4028", "ibew163.org",        "1269 Sans Souci Parkway, Wilkes-Barre, PA 18706"],
  [164,  "(201) 265-1700", "ibew164.org",        "205 Robin Road Suite 315, Paramus, NJ 07652"],
  [175,  "(423) 894-3557", "ibew175.org",        "3922 Volunteer Drive Suite 9, Chattanooga, TN 37416"],
  [176,  "(815) 729-1240", "ibewlocal176.org",   "1100 NE Frontage Road, Joliet, IL 60431"],
  [177,  "(904) 355-4569", "ibew177.org",        "966 Liberty Street, Jacksonville, FL 32206"],
  [180,  "(707) 251-9180", "ibewlu180.org",      "720 Technology Way-B, Napa, CA 94558"],
  [191,  "(425) 259-3195", "ibew191.com",        "3100 164th Street NE, Marysville, WA 98271"],
  [193,  "(217) 544-3479", "ibew193.com",        "3150 Wide Track Drive, Springfield, IL 62703"],
  [194,  "(318) 688-0194", "ibew194.org",        "5510 Buncombe Road, Shreveport, LA 71129"],
  [197,  "(309) 827-4868", "ibew197.org",        "2407 Beich Road Suite A, Bloomington, IL 61705"],
  [212,  "(513) 559-0200", "local212.com",       "212 Crowne Point Place Suite 101, Cincinnati, OH 45241"],
  [223,  "(508) 880-2690", "ibew223.org",        "475 Myles Standish Boulevard, Taunton, MA 02780"],
  [226,  "(785) 232-1761", "ibew226.com",        "1620 NW Gage Boulevard, Topeka, KS 66618"],
  [229,  "(717) 843-8368", "ibew229.org",        "555 Willow Springs Lane, York, PA 17406"],
  [231,  "(712) 255-8138", "ibew231.com",        "5001 Harbor Drive, Sioux City, IA 51111"],
  [233,  "(406) 442-3185", "ibew233.org",        "110 N Warren Street Suite 1, Helena, MT 59601"],
  [234,  "(831) 633-2311", "ibew234.org",        "747 El Camino Real N, Salinas, CA 93907"],
  [236,  "(518) 783-9957", "ibew236.org",        "3000 Troy Schenectady Road, Niskayuna, NY 12309"],
  [237,  "(716) 297-3650", "ibew237.com",        "6700 Schultz Street, Niagara Falls, NY 14304"],
  [241,  "(607) 272-2809", "ibewlocal241.com",   "134 Cecil A. Malone Drive, Ithaca, NY 14850"],
  [242,  "(218) 728-6895", "ibew242.org",        "2002 London Road Room 111, Duluth, MN 55812"],
  [246,  "(740) 282-7572", null,                 "626 N Fourth Street, Steubenville, OH 43952"],
  [252,  "(734) 424-0978", "ibew252.org",        "7920 Jackson Road Suite A, Ann Arbor, MI 48103"],
  [257,  "(573) 635-2133", "ibew257.org",        "209 Flora Drive, Jefferson City, MO 65101"],
  [265,  "(402) 423-4497", "ibew265.org",        "1409 Old Farm Road, Lincoln, NE 68512"],
  [269,  "(609) 394-8129", "ibew269.com",        "670 Whitehead Road, Trenton, NJ 08648"],
  [270,  "(865) 483-1354", "ibewlocal270.org",   "138 N Lincoln Circle, Oak Ridge, TN 37830"],
  [271,  "(316) 267-8255", "ibew271.com",        "1040 S Broadway, Wichita, KS 67211"],
  [275,  "(616) 837-7149", "ibew275.org",        "140 N 64th Avenue, Coopersville, MI 49404"],
  [278,  "(361) 855-1084", "ibew278.com",        "2301 Saratoga Boulevard, Corpus Christi, TX 78417"],
  [280,  "(541) 812-1771", "ibew280.org",        "32969 Highway 99 E, Tangent, OR 97389"],
  [288,  "(319) 233-8050", "ibew288.org",        "1695 Burton Avenue, Waterloo, IA 50703"],
  [291,  "(208) 343-4861", "ibew291.org",        "225 N Sixteenth Street Suite 110, Boise, ID 83702"],
  [292,  "(612) 379-1292", "ibew292.org",        "6700 W Broadway Avenue, Brooklyn Park, MN 55428"],
  [295,  "(501) 562-2244", "ibew295.org",        "7320 S University Avenue, Little Rock, AR 72209"],
  [300,  "(802) 864-5864", "ibewlocal300.org",   "3 Gregory Drive, South Burlington, VT 05403"],
  [301,  "(903) 838-8531", null,                 "114 Elm Street, Nash, TX 75569"],
  [302,  "(925) 228-2302", "ibewlu302.com",      "1875 Arnold Drive, Martinez, CA 94553"],
];

let updated = 0;
for (const [localNum, phone, website, address] of updates) {
  const idPattern = new RegExp(`{ id: ${localNum}, name: "IBEW Local ${localNum}",[^}]+}`);
  const match = code.match(idPattern);
  if (!match) continue;

  let entry = match[0];
  const original = entry;

  if (phone) entry = entry.replace(/phone: (?:null|"[^"]*")/, `phone: "${phone}"`);
  if (website) entry = entry.replace(/website: (?:null|"[^"]*")/, `website: "${website}"`);
  if (address) entry = entry.replace(/address: "[^"]*"/, `address: "${address}"`);

  if (entry !== original) {
    code = code.replace(original, entry);
    updated++;
  }
}

console.log(`✅ Updated ${updated} original locals with full contact info`);

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: remove duplicate locals, update originals with contact info" && git push\n');
