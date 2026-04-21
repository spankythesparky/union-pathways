const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// [id, localNum, city, state, phone, website, address, lat, lng]
const locals = [
  // Alabama
  [52,  "UA Local 52",  "Montgomery",       "AL", "(334) 272-9500", "ualocal52.org",           "5563 Wares Ferry Rd, Montgomery, AL 36117",             32.3182, -86.1549],
  [91,  "UA Local 91",  "Birmingham",       "AL", "(205) 591-2721", "ua91.org",                "3648 9th Ave N, Birmingham, AL 35222",                  33.5186, -86.8104],
  [119, "UA Local 119", "Mobile",           "AL", "(251) 476-0625", "ualocal119.org",          "2458 Old Shell Rd, Mobile, AL 36607",                   30.6954, -88.0399],
  [372, "UA Local 372", "Tuscaloosa",       "AL", "(205) 758-6236", "ualocal372.org",          "9410 Hwy 82 E, Duncanville, AL 35456",                  33.2098, -87.5692],
  [548, "UA Local 548", "Montgomery",       "AL", "(334) 309-4563", "ua.org",                  "1719 Country Rd 85, Prattville, AL 36067",              32.4637, -86.3697],
  [760, "UA Local 760", "Muscle Shoals",    "AL", "(256) 383-7900", "ua.org",                  "2807 Avalon Ave, Muscle Shoals, AL 35661",              34.7448, -87.6675],
  // Alaska
  [262, "UA Local 262", "Juneau",           "AK", "(907) 586-2874", "local392.com",            "1751 Anka St, Juneau, AK 99801",                        58.3005, -134.4197],
  [367, "UA Local 367", "Anchorage",        "AK", "(907) 562-2810", "ualocal367.org",          "610 W 54th Ave, Anchorage, AK 99518",                   61.2181, -149.9003],
  [375, "UA Local 375", "Fairbanks",        "AK", "(907) 479-6221", "ualocal375.org",          "3980 Boat St, Fairbanks, AK 99709",                     64.8378, -147.7164],
  // Arizona
  [469, "UA Local 469", "Phoenix",          "AZ", "(602) 956-9350", "ualocal469.org",          "3109 N 24th St Bldg A, Phoenix, AZ 85016",              33.4484, -112.0740],
  // Arkansas
  [155, "UA Local 155", "Little Rock",      "AR", "(501) 374-4943", "ua.org",                  "1223 W Markham, Little Rock, AR 72201",                 34.7465, -92.2896],
  // California
  [38,  "UA Local 38",  "San Francisco",    "CA", "(415) 626-2000", "ualocal38.org",           "1621 Market St, San Francisco, CA 94103",               37.7749, -122.4194],
  [62,  "UA Local 62",  "Castroville",      "CA", "(831) 633-6091", "pipetrades62.com",        "11445 Commercial Pkwy, Castroville, CA 95012",          36.7638, -121.7578],
  [78,  "UA Local 78",  "Los Angeles",      "CA", "(213) 688-9090", "uaplumber78.com",         "1111 W James M Wood Blvd, Los Angeles, CA 90015",       34.0522, -118.2437],
  [114, "UA Local 114", "Santa Barbara",    "CA", "(805) 688-1470", "ualocal114.org",          "93 Thomas Rd, Buellton, CA 93427",                      34.6138, -120.1942],
  [159, "UA Local 159", "Martinez",         "CA", "(925) 229-0400", "ualocal159.org",          "1308 Roman Way, Martinez, CA 94553",                    37.9910, -122.1341],
  [228, "UA Local 228", "Marysville",       "CA", "(530) 673-8690", "lu228.org",               "1015 Yuba St, Marysville, CA 95901",                    39.1457, -121.5913],
  [230, "UA Local 230", "San Diego",        "CA", "(858) 554-0586", "ualocal230.org",          "6313 Nancy Ridge Dr, San Diego, CA 92121",              32.7157, -117.1611],
  [246, "UA Local 246", "Fresno",           "CA", "(559) 252-7246", "local246.com",            "1303 N Rabe Ave Ste 101, Fresno, CA 93727",             36.7378, -119.7871],
  [250, "UA Local 250", "Gardena",          "CA", "(310) 660-0035", "ua250.org",               "18355 S Figueroa St, Gardena, CA 90248",                33.8884, -118.3090],
  [342, "UA Local 342", "Concord",          "CA", "(925) 686-5880", "ua342.org",               "935 Detroit Ave, Concord, CA 94518",                    37.9780, -122.0311],
  [343, "UA Local 343", "Vacaville",        "CA", "(707) 644-4071", "local343.org",            "220 Peabody Rd, Vacaville, CA 95687",                   38.3566, -121.9877],
  [345, "UA Local 345", "Duarte",           "CA", "(626) 357-9345", "ua345.org",               "1430 Huntington Dr, Duarte, CA 91010",                  34.1395, -117.9773],
  [355, "UA Local 355", "Vallejo",          "CA", "(707) 644-0355", "ua.org",                  "426 Alabama St, Vallejo, CA 94590",                     38.1041, -122.2566],
  [364, "UA Local 364", "Colton",           "CA", "(909) 825-0359", "ualocal364.com",          "223 S Rancho Ave, Colton, CA 92324",                    34.0739, -117.3131],
  [393, "UA Local 393", "San Jose",         "CA", "(408) 225-3030", "ualocal393.org",          "6299 San Ignacio Ave, San Jose, CA 95119",              37.2357, -121.8547],
  [398, "UA Local 398", "Rancho Cucamonga", "CA", "(909) 945-5557", "local398.org",            "8590 Utica Ave Ste 200, Rancho Cucamonga, CA 91730",    34.1064, -117.5931],
  [403, "UA Local 403", "San Luis Obispo",  "CA", "(805) 543-2416", "ua403.org",               "3710 Broad St, San Luis Obispo, CA 93401",              35.2828, -120.6596],
  [442, "UA Local 442", "Modesto",          "CA", "(209) 338-0751", "lu442.com",               "4842 Nutcracker Ln, Modesto, CA 95356",                 37.6391, -120.9969],
  [447, "UA Local 447", "Sacramento",       "CA", "(916) 457-6595", "ualocal447.org",          "5841 Newman Ct, Sacramento, CA 95819",                  38.5816, -121.4944],
  [460, "UA Local 460", "Bakersfield",      "CA", "(661) 589-4600", "local460.com",            "6718 Meany Ave, Bakersfield, CA 93308",                 35.3733, -119.0187],
  [467, "UA Local 467", "Burlingame",       "CA", "(650) 692-4730", "ualocal467.org",          "1519 Rollins Rd, Burlingame, CA 94010",                 37.5841, -122.3661],
  [483, "UA Local 483", "Hayward",          "CA", "(510) 785-8483", "sprinklerfitters483.org", "2525 Barrington Ct, Hayward, CA 94545",                 37.6688, -122.0808],
  [484, "UA Local 484", "Ventura",          "CA", "(805) 643-6345", "ualocal484.org",          "1955 N Ventura Ave, Ventura, CA 93001",                 34.2805, -119.2945],
  [582, "UA Local 582", "Orange",           "CA", "(714) 978-0582", "ualocal582.org",          "1916 W Chapman Ave, Orange, CA 92868",                  33.7879, -117.8531],
  [709, "UA Local 709", "Whittier",         "CA", "(562) 698-9909", "sprinklerfitters709.org", "12140 Rivera Rd, Whittier, CA 90606",                   33.9792, -118.0328],
  [761, "UA Local 761", "Burbank",          "CA", "(818) 843-8670", "local761.org",            "1305 N Niagara St, Burbank, CA 91505",                  34.1808, -118.3090],
  // Colorado
  [3,   "UA Local 3",   "Aurora",           "CO", "(303) 739-9300", "plumberslocal3.org",      "17100 E 32nd Pl, Aurora, CO 80011",                     39.7294, -104.8319],
  [58,  "UA Local 58",  "Colorado Springs", "CO", "(719) 633-4052", "local58.org",             "2870 Janitell Rd, Colorado Springs, CO 80906",          38.8339, -104.8214],
  [145, "UA Local 145", "Grand Junction",   "CO", "(970) 245-2012", "local145.org",            "3168 Pipe Ct, Grand Junction, CO 81504",                39.0639, -108.5506],
  [208, "UA Local 208", "Denver",           "CO", "(303) 428-4380", "pipe208.com",             "6350 N Broadway Ste 1, Denver, CO 80216",               39.7392, -104.9903],
  // Connecticut
  [777, "UA Local 777", "Meriden",          "CT", "(203) 317-4750", "local777.com",            "1250 E Main St, Meriden, CT 06450",                     41.5382, -72.8073],
  // Delaware
  [74,  "UA Local 74",  "Newark",           "DE", "(302) 636-7400", "ualocal74.com",           "201 Executive Dr, Newark, DE 19702",                    39.6837, -75.7497],
  // Washington DC
  [5,   "UA Local 5",   "Lanham",           "MD", "(301) 899-7861", "local5plumbers.org",      "4755 Walden Ln, Lanham, MD 20746",                      38.9607, -76.8527],
  [602, "UA Local 602", "Capitol Heights",  "MD", "(301) 333-2356", "steamfitters-602.org",    "8700 Ashwood Dr 2nd Flr, Capitol Heights, MD 20743",   38.8871, -76.9122],
  // Florida
  [123, "UA Local 123", "Dover",            "FL", "(813) 636-0123", "lu123.com",               "3601 N McIntosh Rd, Dover, FL 33527",                   27.9976, -82.2185],
  [234, "UA Local 234", "Jacksonville",     "FL", "(904) 786-0941", "ua234.com",               "5411 Cassidy Rd, Jacksonville, FL 32254",               30.3322, -81.6557],
  [295, "UA Local 295", "Daytona Beach",    "FL", "(386) 253-9972", "ualocal295.com",          "743 N Beach St, Daytona Beach, FL 32114",               29.2108, -81.0228],
  [519, "UA Local 519", "Hialeah",          "FL", "(305) 362-0519", "plumbers519.com",         "5931 NW 173rd Dr B5, Hialeah, FL 33015",                25.8576, -80.2781],
  [630, "UA Local 630", "West Palm Beach",  "FL", "(561) 689-8400", "lu630.org",               "1900 N Florida Mango Rd, West Palm Beach, FL 33409",   26.7153, -80.1003],
  [719, "UA Local 719", "Fort Lauderdale",  "FL", "(954) 522-2532", "ualocal719.org",          "2502 S Andrews Ave, Fort Lauderdale, FL 33316",         26.1224, -80.1373],
  [725, "UA Local 725", "Opa Locka",        "FL", "(305) 681-8596", "ua725.org",               "13185 NW 45th Ave, Opa Locka, FL 33054",                25.9016, -80.2500],
  [803, "UA Local 803", "Orlando",          "FL", "(407) 851-9240", "localunion803.org",       "2447 Orlando Central Pkwy, Orlando, FL 32809",          28.5383, -81.3792],
  [821, "UA Local 821", "West Palm Beach",  "FL", "(561) 422-9821", "sprinklerfitters821.org", "1975 Sansbury's Way Ste 115, West Palm Beach, FL 33411",26.6615, -80.1928],
  // Georgia
  [72,  "UA Local 72",  "Atlanta",          "GA", "(404) 373-5778", "ua72.org",                "374 Maynard Ter SE, Atlanta, GA 30316",                 33.7490, -84.3880],
  [150, "UA Local 150", "Augusta",          "GA", "(706) 724-8846", "ua150.org",               "1211 Telfair St, Augusta, GA 30901",                    33.4735, -82.0105],
  [177, "UA Local 177", "Brunswick",        "GA", "(912) 265-1890", "ualocal177.org",          "6148 New Jessup Hwy Ste 341, Brunswick, GA 31523",      31.1499, -81.4915],
  [188, "UA Local 188", "Savannah",         "GA", "(912) 354-5520", "localunion188.com",       "2337 E Victory Dr, Savannah, GA 31404",                 32.0835, -81.0998],
  [473, "UA Local 473", "Jesup",            "GA", "(912) 321-2919", "ua.org",                  "113 Oliver Ln, Jesup, GA 31545",                        31.5996, -81.8857],
  // Hawaii
  [675, "UA Local 675", "Honolulu",         "HI", "(808) 536-5454", "plumbershawaii.com",      "1109 Bethel St Lower Level, Honolulu, HI 96813",        21.3069, -157.8583],
  [811, "UA Local 811", "Waianae",          "HI", "(808) 630-8000", "plumbershawaii.com",      "85-1060 Waianae Valley Rd, Waianae, HI 96792",          21.4436, -158.1819],
  // Idaho
  [296, "UA Local 296", "Meridian",         "ID", "(208) 288-1296", "ualocal296.org",          "575 N Ralstin Ste A, Meridian, ID 83642",               43.6121, -116.3915],
  [648, "UA Local 648", "Pocatello",        "ID", "(208) 232-6806", "ualocal648.org",          "456 N Arthur Ste 4, Pocatello, ID 83204",               42.8713, -112.4455],
  // Illinois
  [23,  "UA Local 23",  "Rockford",         "IL", "(815) 397-0350", "ualocal23.org",           "4525 Boeing Dr, Rockford, IL 61109",                    42.2711, -89.0940],
  [25,  "UA Local 25",  "Rock Island",      "IL", "(309) 788-4569", "lu25.org",                "4600 46th Ave, Rock Island, IL 61201",                  41.5095, -90.5865],
  [63,  "UA Local 63",  "East Peoria",      "IL", "(309) 699-3570", "plumberslocal63.com",     "116 Harvey Ct, East Peoria, IL 61611",                  40.6936, -89.5890],
  [99,  "UA Local 99",  "Bloomington",      "IL", "(309) 663-2337", "ua.org",                  "406 S Eldorado Rd, Bloomington, IL 61704",              40.4842, -88.9937],
  [101, "UA Local 101", "Belleville",       "IL", "(618) 234-5504", "ualocal101.org",          "8 Premier Dr, Belleville, IL 62220",                    38.5201, -89.9840],
  [130, "UA Local 130", "Chicago",          "IL", "(312) 421-1010", "plumberslu130ua.com",     "1340 W Washington Blvd 2nd Flr, Chicago, IL 60607",     41.8826, -87.6631],
  [137, "UA Local 137", "Springfield",      "IL", "(217) 544-2724", "ua137.org",               "2880 E Cook St, Springfield, IL 62703",                 39.7817, -89.6501],
  [149, "UA Local 149", "Savoy",            "IL", "(217) 359-5201", "ualocal149.com",          "1003 N Dulap Ave, Savoy, IL 61874",                     40.0628, -88.2488],
  [160, "UA Local 160", "Murphysboro",      "IL", "(618) 684-4521", "ualocal160.com",          "901 Mulberry St, Murphysboro, IL 62966",                37.7648, -89.3345],
  [281, "UA Local 281", "Alsip",            "IL", "(708) 597-1800", "sprinklerfitterchicago.org","11900 S Laramie Ave, Alsip, IL 60803",                41.6659, -87.7340],
  [353, "UA Local 353", "Peoria",           "IL", "(309) 633-1353", "steamfitters353.com",     "6304 W Development Dr, Peoria, IL 61604",               40.6936, -89.5890],
  [360, "UA Local 360", "Collinsville",     "IL", "(618) 346-2560", "ualocal360.net",          "5 Meadow Hgts Professional Park, Collinsville, IL 62234",38.6703, -89.9845],
  [439, "UA Local 439", "Caseyville",       "IL", "(618) 624-6096", null,                      "1220 Donald Bailey Dr, Caseyville, IL 62232",           38.6317, -90.0348],
  [551, "UA Local 551", "West Frankfort",   "IL", "(618) 937-1363", "ualocal551.org",          "10967 Dean Browning Blvd, West Frankfort, IL 62896",    37.8978, -88.9209],
  [553, "UA Local 553", "East Alton",       "IL", "(618) 259-6787", "ualocal553.org",          "2 S Wesley Dr, East Alton, IL 62024",                   38.8906, -90.1843],
  [597, "UA Local 597", "Chicago",          "IL", "(312) 829-4191", "pf597.org",               "45 N Ogden Ave, Chicago, IL 60607",                     41.8826, -87.6631],
  [653, "UA Local 653", "Centralia",        "IL", "(618) 532-3351", "ua.org",                  "116 S Chestnut St, Centralia, IL 62801",                38.5251, -89.1334],
  // Indiana
  [136, "UA Local 136", "Evansville",       "IN", "(812) 423-8043", "ualocal136.org",          "2300 St Joseph Ind Pk Dr, Evansville, IN 47720",        37.9716, -87.5711],
  [157, "UA Local 157", "Terre Haute",      "IN", "(812) 877-1531", "ualocal157.org",          "8801 E Milner Ave, Terre Haute, IN 47803",              39.4667, -87.4139],
  [166, "UA Local 166", "Fort Wayne",       "IN", "(260) 490-5696", "ualocal166.org",          "2930 W Ludwig Rd, Fort Wayne, IN 46818",                41.0793, -85.1394],
  [172, "UA Local 172", "South Bend",       "IN", "(574) 273-0300", "ua172.org",               "4172 Ralph Jones Ct, South Bend, IN 46628",             41.6764, -86.2520],
  [210, "UA Local 210", "Merrillville",     "IN", "(219) 942-7224", "plu210.org",              "2901 E 83rd Pl, Merrillville, IN 46410",                41.4731, -87.3320],
  [440, "UA Local 440", "Indianapolis",     "IN", "(317) 856-3771", "ualocal440.org",          "1521 Brookville Crossing Way, Indianapolis, IN 46239",  39.7684, -86.1581],
  // Iowa
  [33,  "UA Local 33",  "Des Moines",       "IA", "(515) 243-3244", "ualocal33.org",           "2501 Bell Ave, Des Moines, IA 50321",                   41.5868, -93.6250],
  [125, "UA Local 125", "Cedar Rapids",     "IA", "(319) 365-0413", "ualocal125.org",          "5001 J St SW Ste 200, Cedar Rapids, IA 52404",          41.9779, -91.6656],
  // Kansas
  [441, "UA Local 441", "Wichita",          "KS", "(316) 265-4291", "ua441.org",               "529 S Anna St, Wichita, KS 67209",                      37.6872, -97.3301],
  // Kentucky
  [184, "UA Local 184", "Paducah",          "KY", "(270) 442-3213", "kypipetrades.com",        "1127 Broadway St, Paducah, KY 42001",                   37.0834, -88.6000],
  [248, "UA Local 248", "Ashland",          "KY", "(606) 325-2544", "local248.com",            "924 Greenup Ave, Ashland, KY 41101",                    38.4784, -82.6379],
  [452, "UA Local 452", "Lexington",        "KY", "(859) 252-8337", "plumbersandpipefitters452.com","701 Allenridge Point, Lexington, KY 40510",        38.0406, -84.5037],
  [502, "UA Local 502", "Louisville",       "KY", "(502) 361-8492", "lu502.com",               "4330 Crittenden Dr Ste A, Louisville, KY 40209",        38.2527, -85.7585],
  [633, "UA Local 633", "Owensboro",        "KY", "(270) 683-1587", "ua.org",                  "3128 Alvey Park Dr W, Owensboro, KY 42303",             37.7719, -87.1112],
  // Louisiana
  [60,  "UA Local 60",  "Metairie",         "LA", "(504) 885-3054", "steamfitters-602.org",    "3515 N I-10 Service Rd, Metairie, LA 70002",            29.9511, -90.0715],
  [141, "UA Local 141", "Shreveport",       "LA", "(318) 671-1175", "local141welfare.com",     "7111 W Bert Kouns Industrial Loop, Shreveport, LA 71129",32.5252, -93.7502],
  [198, "UA Local 198", "Baton Rouge",      "LA", "(225) 356-3333", "local198.org",            "5888 Airline Hwy, Baton Rouge, LA 70805",               30.4515, -91.1871],
  [247, "UA Local 247", "Alexandria",       "LA", "(318) 442-9923", "ua.org",                  "249 McKeithen Dr, Alexandria, LA 71303",                31.3113, -92.4451],
  // Maine
  [716, "UA Local 716", "Augusta",          "ME", "(207) 621-0555", "local716.org",            "21 Gabriel Dr, Augusta, ME 04330",                      44.3106, -69.7795],
  // Maryland
  [486, "UA Local 486", "Baltimore",        "MD", "(410) 866-4380", "ualocal486.com",          "8100 Sandpiper Cr Ste 200, Baltimore, MD 21236",        39.2904, -76.6122],
  [669, "UA Local 669", "Columbia",         "MD", "(410) 381-4300", "sprinklerfitters669.org", "7050 Oakland Mills Rd #200, Columbia, MD 21046",        39.2037, -76.8610],
];

const entries = locals.map(([id, name, city, state, phone, website, address, lat, lng]) => {
  const siteStr = website ? `"${website}"` : 'null';
  const phoneStr = phone ? `"${phone}"` : 'null';
  return `  { id: ${id}, name: "${name}", city: "${city}", state: "${state}", phone: ${phoneStr}, website: ${siteStr}, lat: ${lat}, lng: ${lng}, address: "${address}" },`;
}).join('\n');

code = code.replace('const UA_LOCALS = [];', `const UA_LOCALS = [\n${entries}\n];`);
fs.writeFileSync(filePath, code, 'utf8');
console.log(`✅ Added ${locals.length} UA locals`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add all UA Plumbers & Pipefitters locals" && git push\n');
