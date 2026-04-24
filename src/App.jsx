import { useState, useEffect, useRef } from "react";

// ─── ALL UNION TRADES (for dropdown) ─────────────────────────────────────────
const UNION_TRADES = [
  {
    group: "Electrical & Communications",
    trades: [
      { abbr: "IBEW_I", name: "Inside Wiremen", full: "IBEW Inside Wiremen (Commercial & Industrial)", website: "www.ibew.org", status: "active", color: "#F5C518" },
      { abbr: "IBEW_L", name: "Linemen", full: "IBEW Outside Linemen (Utility & Transmission)", website: "www.ibew.org", status: "active", color: "#FFD700" },
    ],
  },
  {
    group: "Plumbing, Pipefitting & HVAC",
    trades: [
      { abbr: "UA", name: "Plumbers & Pipefitters", full: "United Association of Plumbers & Pipefitters", website: "www.ua.org", status: "active", color: "#3b9eff" },
      { abbr: "SMART", name: "Sheet Metal Workers", full: "Sheet Metal, Air, Rail & Transportation Workers", website: "www.smart-union.org", status: "coming" },
    ],
  },
  {
    group: "Carpentry & Millwork",
    trades: [
      { abbr: "UBC", name: "Carpenters", full: "United Brotherhood of Carpenters", website: "www.carpenters.org", status: "coming" },
      { abbr: "IUPAT", name: "Painters & Allied Trades", full: "Int'l Union of Painters & Allied Trades", website: "www.iupat.org", status: "coming" },
      { abbr: "BAC", name: "Bricklayers", full: "Int'l Union of Bricklayers & Allied Craftworkers", website: "www.bacweb.org", status: "active", color: "#f97316" },
    ],
  },
  {
    group: "Heavy Construction",
    trades: [
      { abbr: "IUOE", name: "Operating Engineers", full: "Int'l Union of Operating Engineers", website: "www.iuoe.org", status: "active" },
      { abbr: "LIUNA", name: "Laborers", full: "Laborers' Int'l Union of North America", website: "www.liuna.org", status: "coming" },
      { abbr: "IW", name: "Ironworkers", full: "Int'l Association of Bridge & Structural Iron Workers", website: "www.ironworkers.org", status: "active", color: "#ef4444" },
      { abbr: "OCA", name: "Cement Masons", full: "Operative Plasterers' & Cement Masons' Int'l Association", website: "www.opcmia.org", status: "coming" },
    ],
  },
  {
    group: "Specialty Trades",
    trades: [
      { abbr: "IUEC", name: "Elevator Constructors", full: "Int'l Union of Elevator Constructors", website: "www.iuec.org", status: "active" },
      { abbr: "HFIAW", name: "Insulators", full: "Heat & Frost Insulators and Allied Workers", website: "www.insulators.org", status: "active" },
      { abbr: "SF", name: "Sprinkler Fitters", full: "United Assoc. Sprinkler Fitters Local 669", website: "www.sprinklerfitters669.org", status: "coming" },
      { abbr: "IABSORIW", name: "Boilermakers", full: "Int'l Brotherhood of Boilermakers", website: "www.boilermakers.org", status: "coming" },
      { abbr: "IBT", name: "Teamsters (Construction)", full: "Int'l Brotherhood of Teamsters", website: "www.teamster.org", status: "coming" },
      { abbr: "OPCMIA", name: "Plasterers & Cement Masons", full: "Operative Plasterers' & Cement Masons' Int'l", website: "www.opcmia.org", status: "coming" },
    ],
  },
];

// ─── IBEW INSIDE WIREMEN DATABASE — Commercial & Industrial ──────────────────
// ─── IBEW INSIDE WIREMEN LOCAL DATABASE — Commercial & Industrial Construction ──
// Source: User-provided wage data. Only verified phones/websites included.
// All Canadian locals excluded. Zero overlap with Lineman locals.
const IBEW_INSIDE_LOCALS = [
  { id: 10001, name: "IBEW Local 1", city: "St louis", state: "MO", phone: "314) 647-5900", website: "ibewlocal1.org", lat: 38.6148694, lng: -90.285719, address: "5850 Elizabeth Ave, St. Louis, MO 63110" },
  { id: 10003, name: "IBEW Local 3", city: "Ny city", state: "US", phone: "(718) 591-4000", website: "www.local3ibew.org", lat: 42.7411758, lng: -73.693106, address: "158-11 Jewel Ave 4th Floor, Flushing, NY 11365" },
  { id: 10005, name: "IBEW Local 5", city: "Pittsburgh pa", state: "PA", phone: "(412) 432-1400", website: "ibew5.org", lat: 40.4255134, lng: -79.9630139, address: "5 Hot Metal St, Pittsburgh, PA 15203" },
  { id: 10006, name: "IBEW Local 6", city: "San francisco", state: "US", phone: "(415) 861-5752", website: "ibew6.org", lat: 37.7879363, lng: -122.4075201, address: "55 Fillmore St #2, San Francisco, CA 94117" },
  { id: 10007, name: "IBEW Local 7", city: "Springfield", state: "MA", phone: "4137347137", website: "www.ibewlocal7.com", lat: 42.1074494, lng: -72.5943113, address: "95 Liberty Street, Springfield, MA 01103" },
  { id: 10008, name: "IBEW Local 8", city: "Toledo ohio", state: "OH", phone: "419-666-8920", website: "www.ibew8.org", lat: 41.5900966, lng: -83.5673292, address: "807 Lime City Rd, Rossford, OH 43460" },
  { id: 10011, name: "IBEW Local 11", city: "Los angelos", state: "CA", phone: "3235179610", website: "www.ibew11.org", lat: 33.6059066, lng: -117.8898772, address: "297 N Merengo, Pasadena, CA" },
  { id: 10012, name: "IBEW Local 12", city: "Pueblo", state: "CO", phone: "(719) 561-8000", website: "www.ibew12.org", lat: 38.2151104, lng: -104.6451832, address: "2901 Farabaugh Lane, Pueblo, CO 81005" },
  { id: 10013, name: "IBEW Local 13", city: "Burlington", state: "IA", phone: "(319) 752-0452", website: "www.ibewlocal13.com", lat: 40.8207978, lng: -91.1086516, address: "1205 N Central Avenue, Burlington, IA 52601" },
  { id: 10014, name: "IBEW Local 14", city: "Eau claire", state: "WI", phone: "(715) 878-4068", website: "www.ibew14.net", lat: 44.811349, lng: -91.4984941, address: "9480 Highway 53, Fall Creek, WI 54742" },
  { id: 10016, name: "IBEW Local 16", city: "Evansville", state: "IN", phone: "(812) 867-9670", website: "www.ibewlocal16.com", lat: 38.0278128, lng: -87.5461608, address: "9001 N Kentucky Avenue, Evansville, IN 47725" },
  { id: 10020, name: "IBEW Local 20", city: "Dallas", state: "TX", phone: "(972) 263-1122", website: "www.ibew20.org", lat: 32.7574314, lng: -97.0082048, address: "684 W Tarrant Road, Grand Prairie, TX 75050" },
  { id: 10022, name: "IBEW Local 22", city: "Omaha", state: "NE", phone: "(402) 331-8147", website: "www.ibew22.org", lat: 41.2126662, lng: -96.0515987, address: "8946 L Street, Omaha, NE 68127" },
  { id: 10024, name: "IBEW Local 24", city: "Baltimore", state: "MD", phone: "(410) 247-5511", website: "www.ibewlocal24.org", lat: 39.2908816, lng: -76.610759, address: "2701 W Patapsco Avenue, Suite 200, Baltimore, MD 21230" },
  { id: 10025, name: "IBEW Local 25", city: "Long island", state: "NY", phone: "(631) 273-4567", website: "www.ibew25.org", lat: 40.8085063, lng: -73.2414401, address: "370 Vanderbilt Motor Parkway, Hauppauge, NY 11788" },
  { id: 10026, name: "IBEW Local 26", city: "Washington dc", state: "WA", phone: "(301) 459-2900", website: "www.ibewlocal26.org", lat: 38.8976428, lng: -77.0061464, address: "4371 Parliament Place, Suite B, Lanham, MD 20706" },
  { id: 10032, name: "IBEW Local 32", city: "Lima", state: "OH", phone: "(419) 229-2774", website: "www.ibew32.com", lat: 40.7687971, lng: -84.1084998, address: "1975 N West Street, Lima, OH 45801" },
  { id: 10034, name: "IBEW Local 34", city: "Quincy", state: "IL", phone: "(309) 673-3691", website: "www.ibew34.org", lat: 40.6372631, lng: -89.6663325, address: "4322 Ricketts Avenue, Bartonville, IL 61607" },
  { id: 10035, name: "IBEW Local 35", city: "Hartford", state: "CT", phone: "(860) 525-5438", website: "www.ibewlocal35.org", lat: 41.7297513, lng: -72.6692585, address: "961 Wethersfield Avenue, Hartford, CT 06114" },
  { id: 10038, name: "IBEW Local 38", city: "Cleveland", state: "OH", phone: "(216) 621-3090", website: "www.ibew38.org", email: "local38@ibew38.org", lat: 41.5073151, lng: -81.6755448, address: "1590 E 23rd Street, Cleveland, OH 44114" },
  { id: 10040, name: "IBEW Local 40", city: "Hollywood", state: "CA", phone: "(818) 762-4239", website: "www.ibew40.org", email: "unionhall@ibew40.org", lat: 34.173351, lng: -118.3703877, address: "5643 Vineland Avenue, North Hollywood, CA 91601" },
  { id: 10041, name: "IBEW Local 41", city: "Buffalo", state: "NY", phone: "(716) 662-6111", website: "www.ibewlocal41.com", email: "lu41@ibewlocal41.com", lat: 42.8864163, lng: -78.8781493, address: "S-3546 California Road, Orchard Park, NY 14127" },
  { id: 10043, name: "IBEW Local 43", city: "Syracuse", state: "NY", phone: "(315) 422-0435", website: "www.ibew43.org", email: "Local43info@ibew43.org", lat: 43.1635109, lng: -76.1974707, address: "4568 Waterhouse Road, Clay, NY 13041" },
  { id: 10046, name: "IBEW Local 46", city: "Seattle", state: "WA", phone: "(253) 395-6500", website: "www.ibew46.org", lat: 47.6038321, lng: -122.330062, address: "19802 62nd Avenue S, Suite 105, Kent, WA 98032" },
  { id: 10048, name: "IBEW Local 48", city: "Portland", state: "OR", phone: "(503) 256-4848", website: "www.ibew48.com", email: "info@ibew48.com", lat: 45.5577637, lng: -122.4985065, address: "15937 NE Airport Way, Portland, OR 97230" },
  { id: 10056, name: "IBEW Local 56", city: "Erie", state: "PA", phone: "(814) 825-5505", website: "www.ibewlocal56.org", lat: 42.0737912, lng: -80.0394935, address: "185 Pennbriar Drive, Erie, PA 16509" },
  { id: 10058, name: "IBEW Local 58", city: "Detroit", state: "MI", phone: "(313) 963-2130", website: "www.ibewlocal58.org", lat: 42.3281923, lng: -83.0625317, address: "1358 Abbott Street, Detroit, MI 48226" },
  { id: 10060, name: "IBEW Local 60", city: "San antonio texas", state: "TX", phone: "(210) 337-1741", website: "www.ibewlu60.org", email: "admin@ibewlu60.org", lat: 29.5995424, lng: -98.4307469, address: "3518 N Loop 1604 E, San Antonio, TX 78247" },
  { id: 10064, name: "IBEW Local 64", city: "Youngstown", state: "OH", phone: "(330) 758-8654", website: "www.ibew64.org", email: "info@ibew64.org", lat: 41.1035786, lng: -80.6520161, address: "350 E Western Reserve Road, Youngstown, OH 44514" },
  { id: 10068, name: "IBEW Local 68", city: "Denver", state: "CO", phone: "(303) 297-0229", website: "www.ibewlu68.com", email: "ibew@ibewlu68.com", lat: 39.7887097, lng: -104.9829137, address: "5660 Logan Street, Denver, CO 80216" },
  { id: 10072, name: "IBEW Local 72", city: "Waco", state: "TX", phone: "(254) 754-3121", website: "www.ibewlu72.com", email: "ibewlu72@yahoo.com", lat: 31.5674506, lng: -97.1049562, address: "1813 Orchard Lane, Waco, TX 76705" },
  { id: 10073, name: "IBEW Local 73", city: "Spokane", state: "WA", phone: "(509) 326-2182", website: "www.ibew73.org", email: "info@ibew73.org", lat: 47.6729, lng: -117.4170095, address: "1616 N Washington Street, Spokane, WA 99205" },
  { id: 10076, name: "IBEW Local 76", city: "Tacoma", state: "WA", phone: "(253) 475-1190", website: "www.ibew76.org", lat: 47.2455013, lng: -122.438329, address: "3049 S 36th Street, Suite 101, Tacoma, WA 98409" },
  { id: 10080, name: "IBEW Local 80", city: "Norfolk", state: "VA", phone: "(757) 480-1740", website: "www.ibew80.com", lat: 36.8557401, lng: -76.2224452, address: "5307 E Virginia Beach Boulevard, Norfolk, VA 23502" },
  { id: 10081, name: "IBEW Local 81", city: "Scranton", state: "PA", phone: "(570) 344-5711", website: "www.ibew81.org", lat: 41.412097, lng: -75.661535, address: "431 Wyoming Avenue, Scranton, PA 18503" },
  { id: 10082, name: "IBEW Local 82", city: "Dayton", state: "OH", phone: "(937) 898-4239", website: "www.ibew82.org", email: "info@ibew82.org", lat: 39.851509, lng: -84.1892867, address: "6550 Poe Avenue, Dayton, OH 45414" },
  { id: 10086, name: "IBEW Local 86", city: "Rochester", state: "NY", phone: "(585) 235-1510", website: "www.ibewlu86.org", lat: 43.0969061, lng: -77.6767893, address: "2300 E River Road, Rochester, NY 14623" },
  { id: 10090, name: "IBEW Local 90", city: "New haven", state: "CT", phone: "(203) 265-9533", website: "www.ibewlocal90.org", email: "info@ibewlocal90.org", lat: 41.4875004, lng: -72.8116306, address: "2 N Plains Industrial Road, Wallingford, CT 06492" },
  { id: 10095, name: "IBEW Local 95", city: "Joplin", state: "MO", phone: "417) 623-2025", website: "www.ibewlocal95.com", lat: 37.0530461, lng: -94.5150575, address: "3316 S Main Street, Joplin, MO 64804" },
  { id: 10096, name: "IBEW Local 96", city: "Worcester", state: "MA", phone: "(508) 753-8635", website: "www.ibewlocal96.org", email: "info@ibewlocal96.org", lat: 42.2546436, lng: -71.8460651, address: "242 Mill Street, Worcester, MA 01602" },
  { id: 10098, name: "IBEW Local 98", city: "Philadelphia", state: "PA", phone: "215) 563-5592", website: "www.ibew98.org", email: "ionews@ibew98.org", lat: 39.9527237, lng: -75.1635262, address: "4960 S Twelfth Street, Philadelphia, PA 19112" },
  { id: 10099, name: "IBEW Local 99", city: "Providence", state: "RI", phone: "(401) 946-9900", website: "www.ibew99.org", email: "info@ibew99.org", lat: 41.785312, lng: -71.5149864, address: "22 Amflex Drive, Cranston, RI 02921" },
  { id: 10100, name: "IBEW Local 100", city: "Fresno", state: "CA", phone: "(559) 251-8241", website: "www.ibew100.org", email: "info@ibew100.org", lat: 36.7605989, lng: -119.7069181, address: "5434 E Lamona Avenue, Fresno, CA 93727" },
  { id: 10102, name: "IBEW Local 102", city: "Patterson", state: "NJ", phone: "(973) 887-1718", website: "www.ibew102.org", email: "info@ibew102.org", lat: 40.8504497, lng: -74.4269088, address: "50 Parsippany Road, Parsippany, NJ 07054" },
  { id: 10103, name: "IBEW Local 103", city: "Boston", state: "MA", phone: "(617) 436-3710", website: "ibew103.com", lat: 42.3036228, lng: -71.052788, address: "256 Freeport Street, Dorchester, MA 02122" },
  { id: 10105, name: "IBEW Local 105", city: "Hamilton", state: "CA", phone: "(905) 387-1721", website: "www.ibew105.com", email: "frontdesk@ibewlu105.com", lat: 43.1790204, lng: -79.8438205, address: "685 Nebo Road, Hannon, ON L0R 1P0" },
  { id: 10106, name: "IBEW Local 106", city: "Jamestown", state: "NY", phone: "(716) 484-9449", website: "www.ibew106.org", email: "general.info@ibew106.org", lat: 42.117931, lng: -79.2172076, address: "322 James Avenue, Jamestown, NY 14701" },
  { id: 10110, name: "IBEW Local 110", city: "St paul", state: "MN", phone: "(651) 776-4239", website: "www.ibew110.org", email: "Info@ibew110.org", lat: 44.9497487, lng: -93.0931028, address: "1330 Conway Street, Suite 110, St. Paul, MN 55106" },
  { id: 10111, name: "IBEW Local 111", city: "Denver", state: "CO", phone: "(303) 744-7171", website: "www.ibew111.org", email: "mail@ibew111.org", lat: 39.7711459, lng: -104.9189537, address: "5965 E 39th Avenue, Denver, CO 80207" },
  { id: 10112, name: "IBEW Local 112", city: "Kennewick", state: "WA", phone: "509) 735-0512", website: "www.ibewlu112.com", lat: 46.2102539, lng: -119.1911028, address: "114 N Edison Street, Kennewick, WA 99336" },
  { id: 10113, name: "IBEW Local 113", city: "Colorado springs", state: "CO", phone: "(719) 633-3872", website: "www.ibew113.com", email: "info@ibew113.com", lat: 38.8339578, lng: -104.825348, address: "2150 Naegele Road, Colorado Springs, CO 80904" },
  { id: 10115, name: "IBEW Local 115", city: "Quine", state: "ON", phone: "(613) 547-4115", website: "www.ibew115.com", email: "unionadmin@ibew115.com", lat: 44.2665673, lng: -76.5288595, address: "44 Binnington Court, Kingston, ON K7M 8S3" },
  { id: 10117, name: "IBEW Local 117", city: "Elgin", state: "IL", phone: "(847) 854-7200", website: "www.ibew117.com", email: "office@ibew117.com", lat: 42.2106558, lng: -88.2921103, address: "765 Munshaw Lane, Crystal Lake, IL 60014" },
  { id: 10120, name: "IBEW Local 120", city: "London", state: "ON", phone: "(519) 652-2929", website: "www.ibew120.ca", lat: 42.9849, lng: -81.2453, address: "6688 Tempo Road, London, ON N6L 1P9, Box 324, Lambeth Station, London, ON N6P 1P9" },
  { id: 10124, name: "IBEW Local 124", city: "Kansas city", state: "KS", phone: "(816) 942-7500", website: "www.ibew124.org", email: "ibew@ibewlocal124.org", lat: 38.9402383, lng: -94.5887058, address: "301 E 103rd Terrace, Kansas City, MO 64114" },
  { id: 10127, name: "IBEW Local 127", city: "Kenosha", state: "WI", phone: "(262) 654-0912", website: "www.ibew127.org", email: "ibew127@gmail.com", lat: 42.6103305, lng: -87.8566492, address: "3030 39th Avenue, Kenosha, WI 53144" },
  { id: 10129, name: "IBEW Local 129", city: "Lorain", state: "OH", phone: "(440) 233-7156", website: "www.ibew129.org", email: "info@ibew129.org", lat: 41.2633554, lng: -82.1734746, address: "6100 S Broadway, Suite 201, Lorain, OH 44053" },
  { id: 10130, name: "IBEW Local 130", city: "New orleans", state: "LA", phone: "(504) 831-1372", website: "www.ibewlu130.com", lat: 29.9561422, lng: -90.0733934, address: "3200 Ridgelake Drive, Suite 300, Metairie, LA 70002" },
  { id: 10131, name: "IBEW Local 131", city: "Kalamazoo", state: "MI", phone: "(269) 382-1762", website: "www.ibew131.com", email: "office@ibew131.com", lat: 42.2607372, lng: -85.5342928, address: "3641 E Cork Street, Kalamazoo, MI 49001" },
  { id: 10134, name: "IBEW Local 134", city: "Chicago", state: "IL", phone: "(312) 454-1340", website: "www.lu134.org", email: "info@local134.org", lat: 41.8438137, lng: -87.6182641, address: "2722 S Martin Luther King Drive, Chicago, IL 60616" },
  { id: 10136, name: "IBEW Local 136", city: "Birmingham", state: "AL", phone: "(205) 833-0909", website: "www.ibew136.org", email: "ibew136@ibew136.org", lat: 33.5841699, lng: -86.6683938, address: "845 Gadsden Highway, Birmingham, AL 35235" },
  { id: 10139, name: "IBEW Local 139", city: "Elmira", state: "NY", phone: "(607) 732-1237", website: "www.ibew139.com", email: "businessmanager@ibewlocal139.org", lat: 42.0897965, lng: -76.8077338, address: "415 W Second Street, Elmira, NY 14901" },
  { id: 10141, name: "IBEW Local 141", city: "Wheeling", state: "WV", phone: "(304) 242-3870", website: "www.ibew141.org", email: "info@ibew141.org", lat: 40.0639616, lng: -80.7209149 },
  { id: 10143, name: "IBEW Local 143", city: "Harrisburg", state: "PA", phone: "(717) 232-7093", website: "www.ibewlocal143.org", lat: 40.253375, lng: -76.861151, address: "1501 Revere Street, Harrisburg, PA 17104" },
  { id: 10145, name: "IBEW Local 145", city: "Davenport", state: "IA", phone: "(309) 736-4239", website: "www.ibewlocal145.com", email: "info@ibewlocal145.com", lat: 41.5235808, lng: -90.5770967, address: "1700 52nd Avenue, Suite A, Moline, IL 61265" },
  { id: 10146, name: "IBEW Local 146", city: "Decatur", state: "IL", phone: "(217) 877-4604", website: "www.ibew146.com", lat: 39.8821852, lng: -88.9363192, address: "3390 N Woodford Street, Decatur, IL 62526" },
  { id: 10150, name: "IBEW Local 150", city: "Waukegan", state: "IL", phone: "(847) 680-1504", website: "www.ibew150.org", lat: 42.3636, lng: -87.8448, address: "31290 N US Highway 45, Unit B, Libertyville, IL 60048" },
  { id: 10153, name: "IBEW Local 153", city: "South bend", state: "IN", phone: "(574) 287-8655", website: "www.ibew153.com", email: "ibew@ibew153.com", lat: 41.6833813, lng: -86.2500066, address: "56475 Peppermint Road, South Bend, IN 46619" },
  { id: 10158, name: "IBEW Local 158", city: "Green bay", state: "WI", phone: "(920) 432-0158", website: "www.ibew158.com", lat: 44.5126379, lng: -88.0125794, address: "2970 Greenbrier Road, Green Bay, WI 54311" },
  { id: 10159, name: "IBEW Local 159", city: "Madison", state: "WI", phone: "(608) 255-2989", website: "www.ibew159.org", email: "office@ibew159.org", lat: 43.0556818, lng: -89.2886776, address: "5303 Fen Oak Drive, Madison, WI 53718" },
  { id: 10163, name: "IBEW Local 163", city: "Wilkes-barre", state: "PA", phone: "(570) 823-4028", website: "www.ibew163.org", email: "electricians@ibew163.org", lat: 41.2256547, lng: -75.9351208, address: "1269 Sans Souci Parkway, Wilkes-Barre, PA 18706" },
  { id: 10164, name: "IBEW Local 164", city: "Jersey city", state: "NJ", phone: "(201) 265-1700", website: "www.ibew164.org", email: "ibew164@ibew164.org", lat: 40.7215682, lng: -74.047455, address: "205 Robin Road, Suite 315, Paramus, NJ 07652" },
  { id: 10175, name: "IBEW Local 175", city: "Chattanooga", state: "TN", phone: "(423) 894-3557", website: "www.ibew175.org", email: "office@ibew175.org", lat: 35.0457219, lng: -85.3094883, address: "3922 Volunteer Drive, Suite 9, Chattanooga, TN 37416" },
  { id: 10176, name: "IBEW Local 176", city: "Joliet", state: "IL", phone: "(815) 729-1240", website: "www.ibewlocal176.org", email: "office@ibewlocal176.org", lat: 41.5263603, lng: -88.0840212, address: "1100 NE Frontage Road, Joliet, IL 60431" },
  { id: 10177, name: "IBEW Local 177", city: "Jacksonville", state: "FL", phone: "(904) 355-4569", website: "www.ibew177.org", email: "office@ibew177.org", lat: 30.3737031, lng: -81.6484468, address: "966 Liberty Street, Jacksonville, FL 32206" },
  { id: 10180, name: "IBEW Local 180", city: "Napa", state: "CA", phone: "(707) 251-9180", website: "www.ibewlu180.org", lat: 38.4898675, lng: -122.3218414, address: "720 Technology Way-B, Napa, CA 94558" },
  { id: 10191, name: "IBEW Local 191", city: "Everett", state: "WA", phone: "(425) 259-3195", website: "www.ibew191.com", lat: 48.1447758, lng: -122.1889201, address: "3100 164th Street NE, Marysville, WA 98271" },
  { id: 10193, name: "IBEW Local 193", city: "Springfield", state: "IL", phone: "(217) 544-3479", website: "www.ibew193.com", email: "office@ibew193.com", lat: 39.7840359, lng: -89.6028105, address: "3150 Wide Track Drive, Springfield, IL 62703" },
  { id: 10194, name: "IBEW Local 194", city: "Shrevport", state: "LA", phone: "(318) 688-0194", website: "www.ibew194.org", lat: 32.4481283, lng: -93.8436821, address: "5510 Buncombe Road, Shreveport, LA 71129" },
  { id: 10197, name: "IBEW Local 197", city: "Bloomington", state: "IL", phone: "(309) 827-4868", website: "www.ibew197.org", email: "info@ibew197.org", lat: 40.4797828, lng: -88.9939147, address: "2407 Beich Road, Suite A, Bloomington, IL 61705" },
  { id: 10212, name: "IBEW Local 212", city: "Cincinnati", state: "OH", phone: "(513) 559-0200", website: "www.local212.com", email: "office@local212.com", lat: 39.1014537, lng: -84.5124602, address: "212 Crowne Point Place, Suite 101, Cincinnati, OH 45241" },
  { id: 10223, name: "IBEW Local 223", city: "Brockton", state: "MA", phone: "(508) 880-2690", website: "www.ibew223.org", lat: 41.9481558, lng: -71.1408404, address: "475 Myles Standish Boulevard, Taunton, MA 02780" },
  { id: 10226, name: "IBEW Local 226", city: "Topeka", state: "KS", phone: "(785) 232-1761", website: "www.ibew226.com", lat: 39.0809258, lng: -95.7227693, address: "1620 NW Gage Boulevard, Topeka, KS 66618" },
  { id: 10229, name: "IBEW Local 229", city: "York", state: "PA", phone: "(717) 843-8368", website: "www.ibew229.org", email: "ibew229@comcast.net", lat: 40.0476946, lng: -76.7434602, address: "555 Willow Springs Lane, York, PA 17406" },
  { id: 10230, name: "IBEW Local 230", city: "Victoria", state: "BC", phone: "(250) 388-7374", website: "www.ibew230.org", lat: 48.4284, lng: -123.3656, address: "21 Dallas Road, Unit 21, Victoria, BC V8V 4Z9" },
  { id: 10231, name: "IBEW Local 231", city: "Sioux city", state: "IA", phone: "(712) 255-8138", website: "www.ibew231.com", email: "office@ibew231.com", lat: 42.421455, lng: -96.369974, address: "5001 Harbor Drive, Sioux City, IA 51111" },
  { id: 10233, name: "IBEW Local 233", city: "Helena", state: "MT", phone: "(406) 442-3185", website: "www.ibew233.org", email: "office@ibew233.org", lat: 46.5927425, lng: -112.036277, address: "110 N Warren Street, Suite 1, Helena, MT 59601, PO Box 131, Helena, MT 59624" },
  { id: 10234, name: "IBEW Local 234", city: "Castroville", state: "CA", phone: "(831) 633-2311", website: "www.ibew234.org", email: "thehall@ibew234.org", lat: 36.7641165, lng: -121.7517593, address: "747 El Camino Real N, Salinas, CA 93907" },
  { id: 10236, name: "IBEW Local 236", city: "Albany", state: "NY", phone: "(518) 783-9957", website: "www.ibew236.org", lat: 42.7757718, lng: -73.8340781, address: "3000 Troy Schenectady Road, Niskayuna, NY 12309" },
  { id: 10237, name: "IBEW Local 237", city: "Niagra falls", state: "NY", phone: "(716) 297-3650", website: "www.ibew237.com", lat: 43.0834925, lng: -79.0029405, address: "6700 Schultz Street, Niagara Falls, NY 14304, PO Box 120, Niagara Falls, NY 14304" },
  { id: 10241, name: "IBEW Local 241", city: "Ithaca", state: "NY", phone: "(607) 272-2809", website: "www.ibewlocal241.com", email: "businessmanager@ibewlocal241.com", lat: 42.4372007, lng: -76.5102759, address: "134 Cecil A. Malone Drive, Ithaca, NY 14850" },
  { id: 10242, name: "IBEW Local 242", city: "Duluth", state: "MN", phone: "(218) 728-6895", website: "www.ibew242.org", lat: 46.7838287, lng: -92.1052679, address: "2002 London Road, Room 111, Duluth, MN 55812" },
  { id: 10246, name: "IBEW Local 246", city: "Steubenville", state: "OH", phone: "(740) 282-7572", email: "office@ibew246.org", lat: 40.3600039, lng: -80.615097, address: "626 N Fourth Street, Steubenville, OH 43952" },
  { id: 10252, name: "IBEW Local 252", city: "Ann arbor", state: "MI", phone: "(734) 424-0978", website: "www.ibew252.org", email: "info@ibew252.org", lat: 42.2813722, lng: -83.7484616, address: "7920 Jackson Road, Suite A, Ann Arbor, MI 48103" },
  { id: 10257, name: "IBEW Local 257", city: "Jefferson city", state: "MO", phone: "(573) 635-2133", website: "www.ibew257.org", email: "ibew257@ibew257.org", lat: 38.5579862, lng: -92.1915291, address: "209 Flora Drive, Jefferson City, MO 65101" },
  { id: 10265, name: "IBEW Local 265", city: "Lincoln", state: "NE", phone: "(402) 423-4497", website: "www.ibew265.org", email: "info@ibew265.org", lat: 40.7486793, lng: -96.7012543, address: "1409 Old Farm Road, Lincoln, NE 68512" },
  { id: 10269, name: "IBEW Local 269", city: "Trenton", state: "NJ", phone: "(609) 394-8129", website: "www.ibew269.com", lat: 40.2203074, lng: -74.7659, address: "670 Whitehead Road, Trenton, NJ 08648" },
  { id: 10270, name: "IBEW Local 270", city: "Oak ridge", state: "TN", phone: "(865) 483-1354", website: "www.ibewlocal270.org", email: "ibew270@comcast.net", lat: 36.0048514, lng: -84.289974, address: "138 N Lincoln Circle, Oak Ridge, TN 37830" },
  { id: 10271, name: "IBEW Local 271", city: "Wichita", state: "KS", phone: "(316) 267-8255", website: "www.ibew271.com", email: "IBEWLU271@hotmail.com", lat: 37.6739882, lng: -97.335421, address: "1040 S Broadway, Wichita, KS 67211" },
  { id: 10275, name: "IBEW Local 275", city: "Coopersville", state: "MI", phone: "(616) 837-7149", website: "www.ibew275.org", email: "info@ibew275.org", lat: 43.0625908, lng: -85.9469344, address: "140 N 64th Avenue, Coopersville, MI 49404" },
  { id: 10278, name: "IBEW Local 278", city: "Corpus christi", state: "TX", phone: "(361) 855-1084", website: "www.ibew278.com", email: "office@ibew278.com", lat: 27.7144948, lng: -97.4434336, address: "2301 Saratoga Boulevard, Corpus Christi, TX 78417" },
  { id: 10280, name: "IBEW Local 280", city: "Tangent", state: "OR", phone: "(541) 812-1771", website: "www.ibew280.org", email: "info@ibew280.org", lat: 44.5440387, lng: -123.109291, address: "32969 Highway 99 E, Tangent, OR 97389, PO Box 404, Tangent, OR 97389" },
  { id: 10288, name: "IBEW Local 288", city: "Waterloo", state: "IA", phone: "(319) 233-8050", website: "www.ibew288.org", lat: 42.5228933, lng: -92.357371, address: "1695 Burton Avenue, Waterloo, IA 50703" },
  { id: 10291, name: "IBEW Local 291", city: "Boise", state: "ID", phone: "(208) 343-4861", website: "www.ibew291.org", email: "office@ibew291.org", lat: 43.6166163, lng: -116.200886, address: "225 N Sixteenth Street, Suite 110, Boise, ID 83702" },
  { id: 10292, name: "IBEW Local 292", city: "Minneapois", state: "MN", phone: "(612) 379-1292", website: "www.ibew292.org", email: "office@ibew292.org", lat: 45.0770675, lng: -93.3753738, address: "6700 W Broadway Avenue, Brooklyn Park, MN 55428" },
  { id: 10295, name: "IBEW Local 295", city: "Little rock", state: "AR", phone: "(501) 562-2244", website: "www.ibew295.org", email: "ibew295@ibew295.org", lat: 34.6835419, lng: -92.3522438, address: "7320 S University Avenue, Little Rock, AR 72209" },
  { id: 10300, name: "IBEW Local 300", city: "Vermont", state: "VT", phone: "(802) 864-5864", website: "www.ibewlocal300.org", email: "info@ibewlocal300.org", lat: 44.4576632, lng: -73.1370635, address: "3 Gregory Drive, South Burlington, VT 05403" },
  { id: 10301, name: "IBEW Local 301", city: "Texarkana", state: "TX", phone: "(903) 838-8531", lat: 33.4466745, lng: -94.0771483, address: "114 Elm Street, Nash, TX 75569, PO Box 490, Nash, TX 75569" },
  { id: 10302, name: "IBEW Local 302", city: "Martinez", state: "CA", phone: "(925) 228-2302", website: "www.ibewlu302.com", email: "ibinfo@ibewlu302.com", lat: 37.991619, lng: -122.088126, address: "1875 Arnold Drive, Martinez, CA 94553" },
  { id: 10303, name: "IBEW Local 303", city: "Niagra", state: "ON", phone: "(905) 354-4303", website: "www.ibewlocal303.com", lat: 43.0896, lng: -79.0849, address: "4485 Kent Avenue, Niagara Falls, ON L2H 1J1" },
  { id: 10305, name: "IBEW Local 305", city: "Fort wayne", state: "IN", phone: "(260) 484-9714", website: "www.ibew305.org", email: "local305@ibew305.org", lat: 41.108382, lng: -85.1426421, address: "136 Chambeau Road, Fort Wayne, IN 46805" },
  { id: 10306, name: "IBEW Local 306", city: "Akron", state: "OH", phone: "(330) 245-2240", website: "www.ibew306.org", email: "info@ibew306.org", lat: 41.083064, lng: -81.518485, address: "2650 S Main Street, Suite 200, Akron, OH 44319" },
  { id: 10307, name: "IBEW Local 307", city: "Cumberland", state: "MD", phone: "(301) 724-3403", website: "www.ibew307.org", email: "administrator@ibew307.org", lat: 39.655874, lng: -78.759663, address: "401 Decatur Street, Cumberland, MD 21502" },
  { id: 10309, name: "IBEW Local 309", city: "Collinsville", state: "IL", phone: "(618) 345-5112", website: "www.ibew309.com", email: "electricians@ibew309.org", lat: 38.673528, lng: -90.0165714, address: "2000A Mall Street, Collinsville, IL 62234" },
  { id: 10313, name: "IBEW Local 313", city: "New castle", state: "DE", phone: "(302) 328-0773", website: "www.ibew313.org", email: "info@ibew313.org", lat: 39.6837153, lng: -75.5928048, address: "814 W Basin Road, New Castle, DE 19720" },
  { id: 10317, name: "IBEW Local 317", city: "Huntington", state: "WV", phone: "(304) 429-5013", website: "www.ibew317.net", email: "office@ibew317.com", lat: 38.4192496, lng: -82.445154, address: "1848 Madison Avenue, Suite A, Huntington, WV 25704" },
  { id: 10322, name: "IBEW Local 322", city: "Casper", state: "WY", phone: "(307) 265-1060", website: "www.ibew322.org", email: "office@ibew322.org", lat: 42.8568778, lng: -106.3349395, address: "691 English Drive, Casper, WY 82601" },
  { id: 10325, name: "IBEW Local 325", city: "Binghamton", state: "NY", phone: "(607) 729-6171", website: "www.ibew325.net", email: "businessmanager@ibew325.net", lat: 42.1012082, lng: -75.8162397, address: "142 Corporate Drive, Binghamton, NY 13904" },
  { id: 10332, name: "IBEW Local 332", city: "San jose", state: "CA", phone: "(408) 269-4332", website: "www.ibew332.org", email: "info@ibew332.org", lat: 37.3361663, lng: -121.890591, address: "2125 Canoas Garden Avenue, Suite 100, San Jose, CA 95125" },
  { id: 10340, name: "IBEW Local 340", city: "Sacramento", state: "CA", phone: "(916) 927-4239", website: "www.ibewlocal340.org", email: "office@ibewlocal340.org", lat: 38.5810606, lng: -121.493895, address: "10240 Systems Parkway, Suite 100, Sacramento, CA 95827" },
  { id: 10342, name: "IBEW Local 342", city: "Greensboro", state: "NC", phone: "(336) 285-7781", website: "www.ibew342.org", email: "ibew342@att.net", lat: 36.074328, lng: -79.9678353, address: "7874 Thorndike Road, Greensboro, NC 27409" },
  { id: 10343, name: "IBEW Local 343", city: "Rochester", state: "MN", phone: "(507) 282-7081", website: "www.ibewlocal343.org", lat: 43.9078613, lng: -92.4792433, address: "9 80th Street SE, Rochester, MN 55904" },
  { id: 10347, name: "IBEW Local 347", city: "Des moines", state: "IA", phone: "(515) 243-1924", website: "www.ibewlu347.org", email: "info@ibewlu347.org", lat: 41.5868654, lng: -93.6249494, address: "6809 SE Bellagio Court, Ankeny, IA 50021" },
  { id: 10349, name: "IBEW Local 349", city: "Miami", state: "FL", phone: "(305) 325-1330", website: "www.ibew349.net", email: "info@ibew349.org", lat: 25.7741566, lng: -80.1935973, address: "1657 NW Seventeenth Avenue, Miami, FL 33125" },
  { id: 10350, name: "IBEW Local 350", city: "Hannibal", state: "MO", phone: "(573) 221-2648", email: "ibew350@outlook.com", lat: 39.705854, lng: -91.362094, address: "801 Church Street, Hannibal, MO 63401" },
  { id: 10351, name: "IBEW Local 351", city: "Folsom", state: "NJ", phone: "(609) 704-8351", website: "www.ibew351.org", lat: 39.6020608, lng: -74.8426653, address: "1113 Black Horse Pike, Hammonton, NJ 08037, PO Box 1118, Hammonton, NJ 08037" },
  { id: 10353, name: "IBEW Local 353", city: "Toronto", state: "ON", phone: "(416) 510-3530", website: "www.ibew353.org", email: "inquiries@ibew353.org", lat: 43.6532, lng: -79.3832, address: "1377 Lawrence Avenue E, Toronto, ON M3A 3P8" },
  { id: 10354, name: "IBEW Local 354", city: "Salt lake city", state: "UT", phone: "(801) 972-9354", website: "www.ibew354.org", email: "office@ibew354.org", lat: 40.738591, lng: -111.9720931, address: "3400 W 2100 S, Salt Lake City, UT 84119" },
  { id: 10357, name: "IBEW Local 357", city: "Las vegas", state: "NV", phone: "(702) 452-9357", website: "www.ibew357.net", email: "ibew357@ibew357.net", lat: 36.1774338, lng: -115.0804862, address: "808 N Lamb Boulevard, Las Vegas, NV 89110" },
  { id: 10363, name: "IBEW Local 363", city: "New city", state: "NY", phone: "(845) 783-3500", website: "www.ibewlu363.org", email: "office363@ibewlu363.org", lat: 41.3097321, lng: -74.1331225, address: "67 Commerce Drive S, Harriman, NY 10926" },
  { id: 10364, name: "IBEW Local 364", city: "Rockford", state: "IL", phone: "(815) 398-6282", website: "www.ibew364.org", email: "office@ibew364.net", lat: 42.2662007, lng: -88.9824601, address: "6820 Mill Road, Rockford, IL 61108" },
  { id: 10369, name: "IBEW Local 369", city: "Louisville", state: "KY", phone: "(502) 368-2568", website: "www.ibewlocal369.com", email: "ehall@ibewlocal369.com", lat: 38.2542376, lng: -85.759407, address: "4315 Preston Highway, Suite 102, Louisville, KY 40213" },
  { id: 10375, name: "IBEW Local 375", city: "Allentown", state: "PA", phone: "(610) 432-9762", website: "www.ibew375.org", lat: 40.6022552, lng: -75.4716115, address: "101 S Seventh Street, Allentown, PA 18101" },
  { id: 10379, name: "IBEW Local 379", city: "Charlotte", state: "NC", phone: "(704) 455-4595", website: "www.ibew379.org", email: "ibewlu379@ibew379.org", lat: 35.1787301, lng: -80.9310565, address: "1900 Cross Beam Drive, Charlotte, NC 28217" },
  { id: 10388, name: "IBEW Local 388", city: "Stevens point", state: "WI", phone: "(715) 341-2696", website: "www.ibewlocal388.org", email: "info@ibewlocal388.org", lat: 44.506137, lng: -89.5214712, address: "5224 Heffron Court, Stevens Point, WI 54481" },
  { id: 10400, name: "IBEW Local 400", city: "Asbury park", state: "NJ", phone: "(732) 681-7111", website: "www.ibew400.org", lat: 40.2203907, lng: -74.0120817, address: "3301 Highway 138 E, Wall, NJ 07719, PO Box 1256, Wall, NJ 07719" },
  { id: 10401, name: "IBEW Local 401", city: "Reno", state: "NV", phone: "(775) 329-2566", website: "www.ibewlocal401.org", email: "ibew401@ibewlocal401.org", lat: 39.5261788, lng: -119.812658, address: "4635 Longley Lane, Suite 109, Reno, NV 89502" },
  { id: 10402, name: "IBEW Local 402", city: "Thunder bay", state: "ON", phone: "(807) 623-5759", website: "www.ibew402.ca", email: "office@ibew402.ca", lat: 48.3809, lng: -89.2477, address: "103-910 Cobalt Crescent, Thunder Bay, ON P7B 5W3" },
  { id: 10405, name: "IBEW Local 405", city: "Cedar rapids", state: "IA", phone: "(319) 396-8241", website: "www.ibew405.org", email: "ibew405@ibew405.org", lat: 41.9652819, lng: -91.7249662, address: "1211 Wiley Boulevard SW, Cedar Rapids, IA 52404" },
  { id: 10413, name: "IBEW Local 413", city: "Santa barbara", state: "CA", phone: "(805) 688-8083", website: "www.ibew413.org", lat: 34.6205634, lng: -120.1872653, address: "100 Thomas Road, Buellton, CA 93427" },
  { id: 10415, name: "IBEW Local 415", city: "Cheyenne", state: "WY", phone: "(307) 632-5944", website: "www.ibew415.org", email: "info@ibew415.org", lat: 41.1330579, lng: -104.7879229, address: "810 Fremont Avenue, Cheyenne, WY 82001" },
  { id: 10424, name: "IBEW Local 424", city: "Edmonton", state: "AB", phone: "(780) 462-5076", website: "www.ibew424.net", email: "ibew424@ibew424.net", lat: 53.5461, lng: -113.4938, address: "4232-93 Street, Edmonton, AB T6E 5P5" },
  { id: 10426, name: "IBEW Local 426", city: "Sioux falls", state: "SD", phone: "(605) 336-0370", website: "www.ibew426.com", email: "office@ibew426.com", lat: 43.5476008, lng: -96.7293629, address: "3725 N Fourth Avenue, Sioux Falls, SD 57104" },
  { id: 10428, name: "IBEW Local 428", city: "Bakersfield", state: "CA", phone: "(661) 323-2979", website: "www.ibew428.org", email: "mail@ibew428.org", lat: 35.3738712, lng: -119.019463, address: "3921 N Sillect Avenue, Bakersfield, CA 93308" },
  { id: 10429, name: "IBEW Local 429", city: "Nashville", state: "TN", phone: "(615) 889-4429", website: "www.ibew429.org", email: "ibew429@ibew429.org", lat: 36.150091, lng: -86.700038, address: "2001 Elm Hill Pike, Nashville, TN 37210" },
  { id: 10430, name: "IBEW Local 430", city: "Racine", state: "WI", phone: "(262) 633-2844", website: "www.ibewlu430.org", email: "info@ibewlu430.org", lat: 42.7092232, lng: -87.84258, address: "1840 Sycamore Avenue, Racine, WI 53406" },
  { id: 10436, name: "IBEW Local 436", city: "El dorado", state: "AR", phone: "(870) 863-9181", email: "ibewl436@sbcglobal.net", lat: 33.2115087, lng: -92.6650144, address: "810 N Newton Street, El Dorado, AR 71730" },
  { id: 10440, name: "IBEW Local 440", city: "Riverside", state: "CA", phone: "(951) 684-5665", website: "www.ibew440.org", email: "contact@ibew440.org", lat: 33.9909242, lng: -117.3465856, address: "1605 Spruce Street, Riverside, CA 92507" },
  { id: 10441, name: "IBEW Local 441", city: "Orange county", state: "CA", phone: "(714) 939-3131", website: "www.ibewoc.com", email: "admin@ibewoc.com", lat: 33.750631, lng: -117.8722311, address: "309 N Rampart Street, Suite M, Orange, CA 92868" },
  { id: 10443, name: "IBEW Local 443", city: "Montgomery", state: "AL", phone: "(334) 272-8830", website: "www.ibew443.org", email: "info@ibew443.org", lat: 32.3777111, lng: -86.3090775, address: "1469 Jean Street, Montgomery, AL 36107, PO Box 3204, Montgomery, AL 36109" },
  { id: 10444, name: "IBEW Local 444", city: "Ponca city", state: "OK", phone: "(580) 762-4441", email: "ibew444@sbcglobal.net", lat: 36.703647, lng: -97.081898, address: "200 N Second Street, Ponca City, OK 74601" },
  { id: 10445, name: "IBEW Local 445", city: "Battle creek", state: "MI", phone: "(269) 964-4545", website: "www.ibew445.com", email: "info@ibew445.com", lat: 42.3246124, lng: -85.2623931, address: "4071 W Dickman Road, Springfield, MI 49037" },
  { id: 10446, name: "IBEW Local 446", city: "Monroe", state: "LA", phone: "(318) 323-3350", website: "www.ibew446.com", email: "ibew446@gmail.com", lat: 32.5306074, lng: -92.0908642, address: "805 N 30th Street, Monroe, LA 71201" },
  { id: 10449, name: "IBEW Local 449", city: "Pocatello", state: "ID", phone: "(208) 232-5263", website: "www.ibewlocal449.org", email: "office@ibewlocal449.org", lat: 42.9037434, lng: -112.4319403, address: "1537 Baldy Avenue, Pocatello, ID 83201" },
  { id: 10453, name: "IBEW Local 453", city: "Springfield", state: "MO", phone: "(417) 869-7251", website: "www.ibew453.com", lat: 37.2244628, lng: -93.2365528, address: "2902 E Division Street, Springfield, MO 65803" },
  { id: 10461, name: "IBEW Local 461", city: "Aurora", state: "IL", phone: "(630) 897-0461", website: "www.ibew461.org", email: "adminoffice@ibew461.com", lat: 41.7571701, lng: -88.3147539, address: "591 Sullivan Road, Suite 100, Aurora, IL 60506" },
  { id: 10466, name: "IBEW Local 466", city: "Charleston", state: "WV", phone: "(304) 342-0800", website: "www.ibew466.org", lat: 38.361335, lng: -81.638646, address: "800 Indiana Avenue, Charleston, WV 25302" },
  { id: 10474, name: "IBEW Local 474", city: "Memphis", state: "TN", phone: "(901) 726-4060", website: "www.ibewlocal474.com", email: "info@ibewlocal474.com", lat: 35.1377321, lng: -89.9992972, address: "1870 Madison Avenue, Memphis, TN 38104" },
  { id: 10477, name: "IBEW Local 477", city: "San bernadino", state: "CA", phone: "(909) 890-0607", website: "www.ibew477.org", lat: 34.0653321, lng: -117.2393105, address: "1875 Business Center Drive, San Bernardino, CA 92408" },
  { id: 10479, name: "IBEW Local 479", city: "Beaumont", state: "TX", phone: "(409) 833-8252", website: "www.ibew479.com", lat: 30.0829344, lng: -94.0984277, address: "1430 Spindletop Road, Beaumont, TX 77705, PO Box 29, Beaumont, TX 77704" },
  { id: 10480, name: "IBEW Local 480", city: "Jackson", state: "MS", phone: "(601) 373-8434", website: "www.ibew480.org", email: "ibew480@ibew480.org", lat: 32.2998686, lng: -90.1830408, address: "4767 I-55 S, Jackson, MS 39212, PO Box 721119, Byram, MS 39272" },
  { id: 10481, name: "IBEW Local 481", city: "Indianapolis", state: "IN", phone: "(317) 923-2596", website: "www.ibew481.org", email: "info@ibew481.org", lat: 39.7683331, lng: -86.1583502, address: "1828 N Meridian Street, Suite 205, Indianapolis, IN 46202" },
  { id: 10488, name: "IBEW Local 488", city: "Bridgeport", state: "CT", phone: "(203) 452-7679", website: "www.ibewlocal488.org", email: "office@ibewlocal488.org", lat: 41.3411017, lng: -73.2628084, address: "721 Main Street, Monroe, CT 06468" },
  { id: 10490, name: "IBEW Local 490", city: "Concord", state: "NH", phone: "(603) 224-4239", website: "www.ibew490.org", email: "info@ibew490.org", lat: 43.2077312, lng: -71.5125428, address: "48 Airport Road, Concord, NH 03301" },
  { id: 10494, name: "IBEW Local 494", city: "Milwaukee", state: "WI", phone: "(414) 327-5202", website: "www.ibew494.com", lat: 42.9870435, lng: -88.0405013, address: "3303 S 103rd Street, Milwaukee, WI 53227" },
  { id: 10495, name: "IBEW Local 495", city: "Wilmington", state: "NC", phone: "(910) 660-8630", email: "ibewunion495@gmail.com", lat: 34.2352853, lng: -77.9487284, address: "2725 Old Wrightsboro Road, Unit 3C, Wilmington, NC 28405" },
  { id: 10498, name: "IBEW Local 498", city: "Traverse city", state: "MI", phone: "(231) 943-4980", website: "www.ibewlocal498.com", email: "ibew@local498.net", lat: 44.643443, lng: -85.6542434, address: "3912 Blair Townhall Road W, Traverse City, MI 49685" },
  { id: 10502, name: "IBEW Local 502", city: "Saint john", state: "NB", phone: "(506) 635-1221", website: "www.ibew502.org", email: "info@ibew502.ca", lat: 45.2733, lng: -66.0633, address: "26 Kiwanis Court, Saint John, NB E2K 4L2" },
  { id: 10505, name: "IBEW Local 505", city: "Mobile", state: "AL", phone: "(251) 476-0275", website: "www.ibew505.org", email: "info@ibew505.org", lat: 30.661331, lng: -88.0957778, address: "2244 Halls Mill Road, Mobile, AL 36606" },
  { id: 10508, name: "IBEW Local 508", city: "Savannah", state: "GA", phone: "(912) 964-5080", website: "www.ibewlocal508.org", email: "officemanager@ibewlocal508.org", lat: 32.075898, lng: -81.196383, address: "1526 Dean Forest Road, Savannah, GA 31408" },
  { id: 10518, name: "IBEW Local 518", city: "Globe", state: "AZ", phone: "(928) 425-8177", email: "ibew518@hotmail.com", lat: 33.3959139, lng: -110.7871744, address: "1383 N AZ Highway 188, Globe, AZ 85501, PO Box 88, Globe, AZ 85502" },
  { id: 10520, name: "IBEW Local 520", city: "Austin", state: "TX", phone: "(512) 326-9540", website: "www.ibew520.org", email: "info@ibew520.org", lat: 30.2711286, lng: -97.7436995, address: "4818 E Ben White Boulevard, Suite 300, Austin, TX 78741" },
  { id: 10527, name: "IBEW Local 527", city: "Galveston", state: "TX", phone: "(409) 933-9800", website: "www.ibew527.com", email: "LU@ibew527.com", lat: 29.4029333, lng: -95.0325321, address: "2509 FM 2004, Texas City, TX 77591" },
  { id: 10530, name: "IBEW Local 530", city: "Sarnia", state: "ON", phone: "(519) 344-4154", website: "www.lu530.com", email: "IBEW@LU530.com", lat: 42.9745, lng: -82.4064, address: "128 Kendall Street, Point Edward, ON N7V 4G5" },
  { id: 10531, name: "IBEW Local 531", city: "Laporte", state: "IN", phone: "(219) 362-2119", website: "www.ibewlocal531.org", lat: 41.689738, lng: -86.7385173, address: "2751 N State Road 39, LaPorte, IN 46350" },
  { id: 10532, name: "IBEW Local 532", city: "Billings", state: "MT", phone: "(406) 248-9119", website: "www.ibew532.com", email: "office@ibew532.com", lat: 45.7874957, lng: -108.49607, address: "5200 Midland Road, Billings, MT 59101, PO Box 80005, Billings, MT 59108," },
  { id: 10538, name: "IBEW Local 538", city: "Danville", state: "IL", phone: "(217) 442-0996", website: "www.ibew538.org", email: "ibew@ibew538.com", lat: 40.1465846, lng: -87.5834437, address: "1290 N Michigan Avenue, Danville, IL 61834" },
  { id: 10540, name: "IBEW Local 540", city: "Canton", state: "OH", phone: "(330) 837-4239", website: "www.ibew540.org", lat: 40.7677827, lng: -81.5158085, address: "2333 Nave Road SE, Massillon, OH 44646" },
  { id: 10545, name: "IBEW Local 545", city: "St. joseph", state: "MO", phone: "(816) 232-3578", website: "www.ibewlocal545.net", lat: 39.7515881, lng: -94.7561717, address: "5804 Corporate Drive, St. Joseph, MO 64507" },
  { id: 10551, name: "IBEW Local 551", city: "Santa rosa", state: "CA", phone: "(707) 542-3505", website: "www.ibewlocal551.org", email: "ibew551@ibewlocal551.org", lat: 38.4404925, lng: -122.7141049, address: "2525 Cleveland Avenue, Suite B, Santa Rosa, CA 95403" },
  { id: 10553, name: "IBEW Local 553", city: "Raleigh - durham", state: "NC", phone: "(919) 596-8220", website: "www.ibew553.org", email: "office@ibew553.org", lat: 35.8803614, lng: -78.7872382, address: "3300 New Raleigh Highway, Durham, NC 27703, PO Box 13551, Research Triangle Park, NC 27709" },
  { id: 10557, name: "IBEW Local 557", city: "Saginaw", state: "MI", phone: "(989) 781-0516", website: "www.ibew557.org", lat: 43.4157319, lng: -84.0585359, address: "7303 Gratiot Road, Saginaw, MI 48609," },
  { id: 10558, name: "IBEW Local 558", city: "Sheffield", state: "AL", phone: "(256) 383-2279", website: "www.ibew558.org", email: "info@ibew558.org", lat: 34.7608701, lng: -87.6975945, address: "1803 E Seventeenth Street, Sheffield, AL 35660, PO Box 578, Sheffield, AL 35660" },
  { id: 10567, name: "IBEW Local 567", city: "Auburn", state: "ME", phone: "(207) 786-9770", website: "www.ibew567.com", email: "info@ibew567.com", lat: 44.0674905, lng: -70.1910715, address: "238 Goddard Road, Lewiston, ME 04240" },
  { id: 10568, name: "IBEW Local 568", city: "Montreal", state: "QC", phone: "(514) 329-0568", website: "www.fioe568.com", email: "info@fioe568.com", lat: 45.5017, lng: -73.5673, address: "4881 Jarry Street E, Suite 228, Montreal, QC H1R 1Y1" },
  { id: 10569, name: "IBEW Local 569", city: "San diego", state: "CA", phone: "(858) 569-8900", website: "www.ibew569.org", lat: 32.7174202, lng: -117.162772, address: "4545 Viewridge Avenue, Suite 100, San Diego, CA 92123" },
  { id: 10570, name: "IBEW Local 570", city: "Tucson", state: "AZ", phone: "(520) 622-6745", website: "www.ibew570.org", lat: 32.213062, lng: -110.935615, address: "750 S Tucson Boulevard, Tucson, AZ 85716" },
  { id: 10573, name: "IBEW Local 573", city: "Warren", state: "OH", phone: "(330) 394-3606", website: "www.ibew573.org", lat: 39.4203978, lng: -84.180897, address: "4550 Research Parkway NW, Warren, OH 44483" },
  { id: 10575, name: "IBEW Local 575", city: "Portsmouth", state: "OH", phone: "(740) 353-8000", website: "www.ibew575.org", email: "office@ibew575.com", lat: 38.7345374, lng: -82.9962742, address: "110 Offnere Street, Portsmouth, OH 45662, PO Box 1544, Portsmouth, OH 45662" },
  { id: 10576, name: "IBEW Local 576", city: "Alexandria", state: "LA", phone: "(318) 443-5811", email: "office@ibewlocal576.com", lat: 31.2472159, lng: -92.4847933, address: "6703 Masonic Drive, Alexandria, LA 71301" },
  { id: 10577, name: "IBEW Local 577", city: "Appleton", state: "WI", phone: "(920) 739-9408", website: "www.ibewlu577.com", email: "admin@ibewlu577.com", lat: 44.2533905, lng: -88.3961042, address: "1024 S Lawe Street, Appleton, WI 54915" },
  { id: 10583, name: "IBEW Local 583", city: "El paso", state: "TX", phone: "(915) 877-9166", website: "www.ibew583.com", email: "ibew@ibew583.com", lat: 31.886281, lng: -106.6003628, address: "311 W Borderland Road, El Paso, TX 79932" },
  { id: 10584, name: "IBEW Local 584", city: "Tulsa", state: "OK", phone: "(918) 592-2989", website: "www.ibew584.com", email: "office@ibew584.com", lat: 36.1522365, lng: -95.9581924, address: "584 S Lewis Avenue, Tulsa, OK 74104" },
  { id: 10586, name: "IBEW Local 586", city: "Ottawa", state: "ON", phone: "(613) 741-5664", website: "www.ibew586.org", lat: 45.4215, lng: -75.6972, address: "2460 Lancaster Road, Suite 103, Ottawa, ON K1B 4S5" },
  { id: 10595, name: "IBEW Local 595", city: "Dublin", state: "CA", phone: "(925) 556-0595", website: "www.ibew595.org", email: "info@ibew595.org", lat: 37.7021521, lng: -121.9357918, address: "6850 Regional Street, Suite 100, Dublin, CA 94568" },
  { id: 10596, name: "IBEW Local 596", city: "Clarksburg", state: "WV", phone: "(304) 622-0151", website: "www.ibew596.com", lat: 39.2806451, lng: -80.3445341, address: "1001 N Twelfth Street, Clarksburg, WV 26301, PO Box 1508, Clarksburg, WV 26302" },
  { id: 10601, name: "IBEW Local 601", city: "Champaign", state: "IL", phone: "(217) 352-1741", website: "www.ibew601.org", email: "office@ibew601.org", lat: 40.1164841, lng: -88.2430932, address: "3301 N Boardwalk Drive, Champaign, IL 61822" },
  { id: 10602, name: "IBEW Local 602", city: "Amarillo", state: "TX", phone: "(806) 376-9945", website: "www.ibew602.org", email: "admin@ibew602.org", lat: 35.2144834, lng: -101.8585011, address: "200 S Fannin Street, Amarillo, TX 79106" },
  { id: 10606, name: "IBEW Local 606", city: "Orlandao", state: "FL", phone: "(407) 896-7271", website: "www.ibew606.org", email: "info@ibew606.org", lat: 28.5639823, lng: -81.3667115, address: "820 Virginia Drive, Orlando, FL 32803" },
  { id: 10607, name: "IBEW Local 607", city: "Shamokin", state: "PA", phone: "(570) 648-9831", website: "www.ibew607.com", lat: 40.7887609, lng: -76.5585175, address: "25 S Fifth Street, Shamokin, PA 17872" },
  { id: 10611, name: "IBEW Local 611", city: "Albuquerque", state: "NM", phone: "(505) 343-0611", website: "www.ibew611.org", lat: 35.0841034, lng: -106.650985, address: "4921 Alexander Boulevard NE, Suite A, Albuquerque, NM 87107" },
  { id: 10613, name: "IBEW Local 613", city: "Atlanta", state: "GA", phone: "(404) 523-8107", website: "www.ibew613.org", email: "admin613@ibew613.org", lat: 33.7544657, lng: -84.3898151, address: "501 Pulliam Street SW, Suite 250, Atlanta, GA 30312" },
  { id: 10617, name: "IBEW Local 617", city: "San mateo", state: "CA", phone: "(650) 574-4239", website: "www.ibew617.com", email: "information@ibew617.com", lat: 37.554043, lng: -122.311184, address: "1701 Leslie Street, San Mateo, CA 94402" },
  { id: 10625, name: "IBEW Local 625", city: "Lakeside", state: "NS", phone: "(902) 450-5625", website: "ibew625.ca", email: "info@ibew625.ca", lat: 44.6384149, lng: -63.6980357, address: "24 Beechville Park Drive, Suite 202, Beechville, NS B3T 1L1" },
  { id: 10639, name: "IBEW Local 639", city: "San luis obispo", state: "CA", phone: "(805) 543-5693", website: "www.ibew639.org", email: "admin@ibew639.org", lat: 35.2062167, lng: -120.6145694, address: "6363 Edna Road, San Luis Obispo, CA 93401" },
  { id: 10640, name: "IBEW Local 640", city: "Phoenix", state: "AZ", phone: "(602) 264-4506", website: "www.ibew640.com", email: "info@ibew640.com", lat: 33.4484367, lng: -112.074141, address: "5808 N Seventh Street, Phoenix, AZ 85014" },
  { id: 10648, name: "IBEW Local 648", city: "Hamilton", state: "OH", phone: "(513) 863-6515", website: "www.ibew648.org", email: "local648@ibew648.org", lat: 39.2085354, lng: -84.5501874, address: "4300 Millikin Road, Hamilton, OH 45011" },
  { id: 10649, name: "IBEW Local 649", city: "Alton", state: "IL", phone: "(618) 462-1627", website: "www.ibew649.org", email: "info@ibew649.org", lat: 38.9158011, lng: -90.1504806, address: "3945 Humbert Road, Alton, IL 62002" },
  { id: 10654, name: "IBEW Local 654", city: "Chester", state: "PA", phone: "(610) 494-2820", website: "www.ibew654.com", lat: 39.8291655, lng: -75.434156, address: "3729 Chichester Avenue, Boothwyn, PA 19061," },
  { id: 10659, name: "IBEW Local 659", city: "Medford", state: "OR", phone: "(541) 664-0800", website: "www.ibew659.org", email: "info@ibew659.org", lat: 42.3264181, lng: -122.8718605, address: "4480 Rogue Valley Highway, Suite 3, Central Point, OR 97502" },
  { id: 10661, name: "IBEW Local 661", city: "Hutchinson", state: "KS", phone: "(620) 663-3431", website: "www.ibew661.com", email: "info@ibew661.com", lat: 38.0608444, lng: -97.9297743, address: "200 W Second Avenue, Hutchinson, KS 67501" },
  { id: 10665, name: "IBEW Local 665", city: "Lansing", state: "MI", phone: "(517) 393-5530", website: "www.ibew665.org", lat: 42.7338254, lng: -84.5546295, address: "5710 Ivan Drive, Lansing, MI 48917" },
  { id: 10666, name: "IBEW Local 666", city: "Richmond", state: "VA", phone: "(804) 353-9666", website: "www.ibewlocal666.com", email: "info@ibewlocal666.com", lat: 37.5385087, lng: -77.43428, address: "1400 E Nine Mile Road, Highland Springs, VA 23075, PO Box 467, Sandston, VA 23150" },
  { id: 10668, name: "IBEW Local 668", city: "Lafayette", state: "IN", phone: "(765) 474-1021", website: "www.ibew668.org", email: "ibew668@ibew668.org", lat: 40.4191229, lng: -86.8919011, address: "2535 S 30th Street, Suite 1, Lafayette, IN 47909" },
  { id: 10673, name: "IBEW Local 673", city: "Painsville", state: "OH", phone: "(440) 255-3414", website: "www.ibew673.org", lat: 41.7006708, lng: -81.3410302, address: "8356 Munson Road, Mentor, OH 44060" },
  { id: 10676, name: "IBEW Local 676", city: "Pensacola", state: "FL", phone: "(850) 477-8767", website: "www.ibewlocal676.com", email: "ibewlu676@yahoo.com", lat: 30.4274744, lng: -87.2187476, address: "7830 N Palafox Street, Pensacola, FL 32534" },
  { id: 10681, name: "IBEW Local 681", city: "Wichita falls", state: "TX", phone: "(940) 322-1661", website: "www.ibew681.org", lat: 33.8478638, lng: -98.4928607, address: "6111 Old Jacksboro Highway, Wichita Falls, TX 76302" },
  { id: 10683, name: "IBEW Local 683", city: "Columbus", state: "OH", phone: "(614) 294-4786", website: "www.ibew683.org", email: "staff@ibew683.org", lat: 39.9622601, lng: -83.0007065, address: "939 Goodale Boulevard, Suite 100, Columbus, OH 43212" },
  { id: 10684, name: "IBEW Local 684", city: "Modesto", state: "CA", phone: "(209) 524-5171", website: "www.ibewlu684.org", email: "info@ibewlu684.org", lat: 37.6393419, lng: -120.9968892, address: "519 Twelfth Street, Modesto, CA 9535" },
  { id: 10688, name: "IBEW Local 688", city: "Mansfield", state: "OH", phone: "(419) 526-4688", website: "www.ibew688.org", email: "resign688@hotmail.com", lat: 40.756656, lng: -82.516478, address: "67 S Walnut Street, Mansfield, OH 44902" },
  { id: 10692, name: "IBEW Local 692", city: "Bay city", state: "MI", phone: "(989) 684-4510", website: "www.ibew692.org", lat: 43.597577, lng: -83.91855, address: "1300 W Thomas Street, Bay City, MI 48706" },
  { id: 10697, name: "IBEW Local 697", city: "Gary", state: "IN", phone: "(219) 945-0697", website: "www.ibew697.org", email: "info@ibew697.org", lat: 41.6020962, lng: -87.3370646, address: "7200 Mississippi Street, Suite 200, Merrillville, IN 46410" },
  { id: 10700, name: "IBEW Local 700", city: "Fort smith", state: "AR", phone: "(479) 783-1149", website: "www.ibew700.org", email: "ibew700@ibew700.com", lat: 35.4080105, lng: -94.3953971, address: "2914 Midland Boulevard, Ft. Smith, AR 72904" },
  { id: 10701, name: "IBEW Local 701", city: "Warrenville", state: "IL", phone: "(630) 393-1701", website: "www.ibew701.org", email: "local701@ibew701.org", lat: 41.8179303, lng: -88.174097, address: "28600 Bella Vista Parkway, Suite 1000, Warrenville, IL 60555" },
  { id: 10702, name: "IBEW Local 702", city: "West frankfort", state: "IL", phone: "(618) 932-2102", website: "www.ibew702.org", lat: 37.8981409, lng: -88.9225471, address: "106 N Monroe Street, West Frankfort, IL 62896" },
  { id: 10704, name: "IBEW Local 704", city: "Dubuque", state: "IA", phone: "(563) 582-5947", website: "www.ibew704.com", email: "ibew704@live.com", lat: 42.5236217, lng: -90.6551231, address: "1610 Garfield Avenue, Dubuque, IA 52001" },
  { id: 10712, name: "IBEW Local 712", city: "Beaver", state: "PA", phone: "(724) 775-0969", website: "www.ibew712.org", email: "local712@ibew712.org", lat: 40.6916624, lng: -80.3709999, address: "Edwin D. Hill Complex, 217 Sassafras Lane, Beaver, PA 15009" },
  { id: 10714, name: "IBEW Local 714", city: "Minot", state: "ND", phone: "(701) 852-3025", website: "www.local714.com", email: "office@local714.com", lat: 48.23251, lng: -101.296273, address: "125 35th Avenue NE, Minot, ND 58703, PO Box 1906, Minot, ND 58702" },
  { id: 10716, name: "IBEW Local 716", city: "Houston", state: "TX", phone: "(713) 869-8900", website: "www.ibew716.net", email: "ibew716@ibew716.net", lat: 29.7927944, lng: -95.4505755, address: "1475 N Loop W, Houston, TX 77008" },
  { id: 10725, name: "IBEW Local 725", city: "Terre haute", state: "IN", phone: "(812) 877-4239", website: "www.ibew725.org", email: "unionhall@ibew725.org", lat: 39.4482705, lng: -87.4106957, address: "5675 Hulman Street, Terre Haute, IN 47803" },
  { id: 10728, name: "IBEW Local 728", city: "Fort lauderdale", state: "FL", phone: "(954) 525-3106", website: "www.ibew728.org", email: "info@ibew728.org", lat: 26.1223084, lng: -80.1433786, address: "South Hall, 201 SE 24th Street, Ft. Lauderdale, FL 33316" },
  { id: 10743, name: "IBEW Local 743", city: "Reading", state: "PA", phone: "(610) 777-3100", website: "www.ibewlocal743.org", email: "info@local743ibew.org", lat: 40.335345, lng: -75.9279495, address: "20 Morgan Drive, Reading, PA 19608" },
  { id: 10756, name: "IBEW Local 756", city: "Daytona beach", state: "FL", phone: "(386) 756-2756", website: "www.ibew756.org", email: "ibew756@msn.com", lat: 29.1003056, lng: -81.0281567, address: "5901 S Williamson Boulevard, Port Orange, FL 32128" },
  { id: 10760, name: "IBEW Local 760", city: "Knoxville", state: "TN", phone: "(865) 524-8638", website: "www.ibew760.org", email: "info@ibew760.org", lat: 35.9983845, lng: -83.923296, address: "1530 Bill Williams Avenue, Knoxville, TN 37917" },
  { id: 10768, name: "IBEW Local 768", city: "Kalispell", state: "MT", phone: "(406) 752-7680", website: "www.ibew768.com", email: "office@ibew768.com", lat: 48.202158, lng: -114.315321, address: "347 Second Avenue W, Kalispell, MT 59901, PO Box 1095, Kalispell, MT 59903" },
  { id: 10773, name: "IBEW Local 773", city: "Windsor", state: "ON", phone: "(519) 948-2221", website: "www.ibew773.ca", email: "admin@ibew773.ca", lat: 42.3149, lng: -83.0364, address: "4050 N Service Road E, Windsor, ON N8W 5X2" },
  { id: 10776, name: "IBEW Local 776", city: "Charleston", state: "SC", phone: "(843) 554-1080", email: "local776@ibew776.com", lat: 32.8622503, lng: -80.0201214, address: "3345 Seiberling Road, North Charleston, SC 29418" },
  { id: 10804, name: "IBEW Local 804", city: "Kitchener", state: "ON", phone: "(519) 648-3993", website: "www.ibew804.ca", email: "office@ibew804.ca", lat: 43.4516, lng: -80.4925, address: "5158 Fountain Street N, Breslau, ON N0B 1M0" },
  { id: 10812, name: "IBEW Local 812", city: "Williamsport", state: "PA", phone: "(570) 368-8984", website: "www.ibew812.com", lat: 41.247717, lng: -76.922142, address: "500 Jordan Avenue, Montoursville, PA 17754" },
  { id: 10816, name: "IBEW Local 816", city: "Paducah", state: "KY", phone: "(270) 898-2456", website: "www.ibewlocal816.org", email: "ibewlocal816@ibewlocal816.org", lat: 37.046629, lng: -88.5567297, address: "4515 Clarks River Road, Paducah, KY 42003" },
  { id: 10840, name: "IBEW Local 840", city: "Geneva", state: "NY", phone: "(315) 789-3330", website: "www.ibew840.org", email: "ibew840@ibew840.org", lat: 42.8690271, lng: -76.9786122, address: "PO Box 851, Geneva, NY 14456" },
  { id: 10852, name: "IBEW Local 852", city: "Corinth", state: "MS", phone: "(662) 286-2897", email: "ibewlocal852@bellsouth.net", lat: 34.9343599, lng: -88.5223353, address: "192 County Road 509, Corinth, MS 38834, PO Box 1027, Corinth, MS 38835" },
  { id: 10855, name: "IBEW Local 855", city: "Muncie", state: "IN", phone: "(765) 282-6392", website: "www.ibew855.com", lat: 40.1506187, lng: -85.3576645, address: "4601 S Meeker Avenue, Muncie, IN 47302" },
  { id: 10861, name: "IBEW Local 861", city: "Lake charles", state: "LA", phone: "(337) 436-3324", website: "www.ibewlu861.org", lat: 30.2305095, lng: -93.2169807, address: "3000 Highway 90 E, Lake Charles, LA 70615, PO Box 16985, Lake Charles, LA 70616" },
  { id: 10873, name: "IBEW Local 873", city: "Kokomo", state: "IN", phone: "(765) 457-5371", website: "www.ibew873.com", email: "ibew873@ibew873.com", lat: 40.4648944, lng: -86.1142362, address: "1931 South Elizabeth Street, Kokomo, IN 46902" },
  { id: 10890, name: "IBEW Local 890", city: "Janesville", state: "WI", phone: "(608) 752-0321", website: "www.ibew890.org", email: "local890@ibew890.org", lat: 42.654577, lng: -89.017663, address: "1900 Reuther Way, Janesville, WI 53546" },
  { id: 10903, name: "IBEW Local 903", city: "Gulfport", state: "MS", phone: "(228) 863-9881", website: "www.lu903.com", email: "lu903@lu903.com", lat: 30.3674198, lng: -89.0928155, address: "2417 32nd Street, Gulfport, MS 39501, PO Drawer L, Gulfport, MS 39502" },
  { id: 10906, name: "IBEW Local 906", city: "Marquette", state: "MI", phone: "(906) 226-7497", website: "www.ibew906.org", lat: 46.5425512, lng: -87.3928901, address: "119 S Front Street, Marquette, MI 49855" },
  { id: 10910, name: "IBEW Local 910", city: "Watertown", state: "NY", phone: "(315) 782-5630", website: "www.ibew910.org", lat: 43.9816785, lng: -75.8716808, address: "25001 Water Street, Watertown, NY 13601" },
  { id: 10915, name: "IBEW Local 915", city: "Tampa", state: "FL", phone: "(813) 621-6451", website: "www.ibew915.org", email: "info@ibew915.org", lat: 27.9449854, lng: -82.4583107, address: "5621 Harney Road, Tampa, FL 33610" },
  { id: 10917, name: "IBEW Local 917", city: "Meridian", state: "MS", phone: "(601) 483-0486", website: "www.ibew917.net", email: "office@ibew917.com", lat: 32.3643098, lng: -88.703656, address: "1620 Highway 39 N, Meridian, MS 39301, PO Box 964, Meridian, MS 39302" },
  { id: 10932, name: "IBEW Local 932", city: "Coos bay", state: "OR", phone: "(541) 756-3907", email: "office@ibew932.com", lat: 43.3911154, lng: -124.2448892, address: "3427 Ash Street, North Bend, OR 97459" },
  { id: 10934, name: "IBEW Local 934", city: "Kingsport", state: "TN", phone: "(423) 323-5411", website: "www.ibew934.com", lat: 36.550238, lng: -82.5594293, address: "4640 Highway 11 W, Blountville, TN 37617, PO Box 388, Blountville, TN 37617" },
  { id: 10948, name: "IBEW Local 948", city: "Flint", state: "MI", phone: "(810) 767-3308", website: "www.local948.org", lat: 43.0161693, lng: -83.6900211, address: "1251 W Hill Road, Flint, MI 48507" },
  { id: 10952, name: "IBEW Local 952", city: "Ventura", state: "CA", phone: "(805) 642-2149", website: "www.ibew952.org", email: "ibewoffice@ibewlu952.org", lat: 34.4458248, lng: -119.0779359, address: "3994 E Main Street, Ventura, CA 93003, PO Box 3908, Ventura, CA 93006" },
  { id: 10968, name: "IBEW Local 968", city: "Parkersburg", state: "WV", phone: "(304) 485-7412", website: "www.ibew968.com", email: "ibew968@ibew968.com", lat: 39.2667309, lng: -81.5620755, address: "1845 Seventh Street, Parkersburg, WV 26101" },
  { id: 10972, name: "IBEW Local 972", city: "Marietta", state: "OH", phone: "(740) 373-5054", website: "www.ibew972.com", email: "local@ibew972.org", lat: 39.4167742, lng: -81.4548392, address: "50 Sandhill Road, Reno, OH 45773" },
  { id: 10993, name: "IBEW Local 993", city: "Kamloops", state: "BC", phone: "(250) 376-8755", website: "www.ibew993.org", email: "office@ibew993.org", lat: 50.6745, lng: -120.3273, address: "873 Desmond Street, Kamloops, BC V2B 5K3" },
  { id: 10995, name: "IBEW Local 995", city: "Baton rouge", state: "LA", phone: "(225) 927-6462", website: "www.lu995.com", email: "ibew@lu995.com", lat: 30.4681253, lng: -91.1020823, address: "8181 Tom Drive, Baton Rouge, LA 70815" },
  { id: 11003, name: "IBEW Local 1003", city: "Nelson", state: "BC", phone: "(250) 354-4177", website: "www.ibew1003.org", email: "info@ibew1003.org", lat: 49.4928, lng: -117.2948, address: "101 Baker Street, Nelson, BC V1L 4H1" },
  { id: 11015, name: "IBEW Local 1015", city: "Mcallen", state: "TX", phone: "(956) 630-3108", email: "ibewlu1015@att.net", lat: 26.204114, lng: -98.2300605, address: "224 N McColl Road, Suite D, McAllen, TX 78501" },
  { id: 11077, name: "IBEW Local 1077", city: "Bogalusa", state: "LA", phone: "(985) 735-1299", lat: 30.7910204, lng: -89.8486858, address: "305 Avenue B, Suite 209A, Bogalusa, LA 70427, PO Box 699, Bogalusa, LA 70429" },
  { id: 11105, name: "IBEW Local 1105", city: "Newark", state: "OH", phone: "(740) 454-2304", website: "www.ibewlocal1105.org", email: "info@ibewlocal1105.org", lat: 40.0288627, lng: -82.0435852, address: "5805 Frazeysburg Road, Nashport, OH 43830" },
  { id: 11141, name: "IBEW Local 1141", city: "Oklahoma city", state: "OK", phone: "(405) 670-4777", website: "www.ibew1141.org", lat: 35.4729886, lng: -97.5170536, address: "1700 SE Fifteenth Street, Oklahoma City, OK 73129, PO Box 95789, Oklahoma City, OK 73143" },
  { id: 11186, name: "IBEW Local 1186", city: "Honolulu", state: "HI", phone: "(808) 847-5341", website: "www.ibew1186.org", email: "ibew1186@ibew1186.org", lat: 21.304547, lng: -157.855676, address: "1935 Hau Street, Room 401, Honolulu, HI 96819" },
  { id: 11205, name: "IBEW Local 1205", city: "Gainesville", state: "FL", phone: "(352) 376-7701", website: "www.ibew1205.org", email: "info@ibew1205.org", lat: 29.6519684, lng: -82.3249846, address: "2510 NW Sixth Street, Gainesville, FL 32609" },
  { id: 11250, name: "IBEW Local 1250", city: "Rapid city", state: "SD", phone: "(605) 343-0954", website: "www.ibewlocal1250.org", lat: 44.0675321, lng: -103.2017328, address: "922 1/2 E Saint Patrick Street, Rapid City, SD 57701" },
  { id: 11253, name: "IBEW Local 1253", city: "Augusta", state: "ME", phone: "(207) 453-1301", website: "www.ibew1253.org", lat: 44.3148027, lng: -69.7743945, address: "142 Elm Street, Newport, ME 04953, PO Box 220, Newport, ME 04953" },
  { id: 11316, name: "IBEW Local 1316", city: "Macon", state: "GA", phone: "(478) 743-7017", website: "www.ibew1316.com", email: "admin@ibew1316.org", lat: 32.836983, lng: -83.6606502, address: "1046 Patterson Street, Macon, GA 31204" },
  { id: 11340, name: "IBEW Local 1340", city: "Newport news", state: "VA", phone: "(757) 875-1340", website: "www.ibew1340.com", lat: 37.1658383, lng: -76.5476554, address: "552 Industrial Park Drive, Newport News, VA 23608" },
  { id: 11426, name: "IBEW Local 1426", city: "Grand forks", state: "ND", phone: "(701) 775-7601", website: "www.ibew1426.org", email: "businessmanager@ibew1426.org", lat: 47.9359291, lng: -97.0557104, address: "1714 N Washington Street, Grand Forks, ND 58203" },
  { id: 11516, name: "IBEW Local 1516", city: "Jonesboro", state: "AR", phone: "(870) 932-2114", website: "ww.ibew1516.com", lat: 35.8348088, lng: -90.7045297, address: "9400 E Highland Drive, Jonesboro, AR 72401, PO Box 577, Jonesboro, AR 72403" },
  { id: 11531, name: "IBEW Local 1531", city: "Albany", state: "GA", phone: "(229) 436-2417", lat: 31.5782062, lng: -84.1556809, address: "1900 Clark Avenue, Albany, GA 31705, PO Box 916, Albany, GA 31702" },
  { id: 11547, name: "IBEW Local 1547", city: "Anchorage", state: "AK", phone: "(907) 272-6571", website: "www.ibew1547.org", lat: 61.2163129, lng: -149.894852, address: "3333 Denali Street, Suite 200, Anchorage, AK 99503" },
  { id: 11555, name: "IBEW Local 1555", city: "Moncton", state: "NB", phone: "(506) 857-3228", website: "ibew1555.ca", lat: 46.0878, lng: -64.7782, address: "96 Norwood Avenue, Suite 305, Moncton, NB E1C 6L9" },
  { id: 11579, name: "IBEW Local 1579", city: "Augusta", state: "GA", phone: "(706) 722-6357", website: "www.ibew1579.org", lat: 33.4795565, lng: -81.9741365, address: "1250 Reynolds Street, Augusta, GA 30901" },
  { id: 11687, name: "IBEW Local 1687", city: "Sudbury", state: "ON", phone: "(705) 566-1687", website: "www.ibew1687.org", email: "info@ibew1687.org", lat: 46.4917, lng: -80.993, address: "1204 St. Jerome Street, Sudbury, ON P3A 2V9" },
  { id: 11701, name: "IBEW Local 1701", city: "Owensburg", state: "KY", phone: "(270) 684-3058", lat: 37.7572284, lng: -87.1502223, address: "2911 W Parrish Avenue, Owensboro, KY 42301" },
  { id: 11852, name: "IBEW Local 1852", city: "Sydney", state: "NS", phone: "(902) 562-1357", website: "ibew1852.dyndns-ip.com", lat: 46.1368, lng: -60.1942, address: "42 Cossitt Heights Drive, Sydney, NS B1P 6H4, PO Box 24, Pier Postal Station" },
  { id: 11914, name: "IBEW Local 1914", city: "Cheswick", state: "PA", phone: "(724) 594-5559", website: "www.ibew1914.org", lat: 40.5410997, lng: -79.8013437, address: "200 School Street, Harwick, PA 15049, PO Box 488, Harwick, PA 15049" },
  { id: 11925, name: "IBEW Local 1925", city: "Martin", state: "TN", phone: "(731) 587-3457", email: "ibew1925@frontiernet.net", lat: 36.3432777, lng: -88.8503514, address: "402 Jackson Street, Martin, TN 38237, PO Box 64, Martin, TN 38237" },
  { id: 11928, name: "IBEW Local 1928", city: "Halifax", state: "NS", phone: "(902) 450-5366", website: "www.ibew1928.org", email: "contact@ibew1928.org", lat: 44.6488, lng: -63.5752, address: "14 McQuade Lake Crescent, Suite 204, Beechville, NS B3S 1B6" },
  { id: 12038, name: "IBEW Local 2038", city: "Regina", state: "SK", phone: "(306) 757-0222", website: "www.ibew2038.com", email: "admin@ibew2038.com", lat: 50.4452, lng: -104.6189, address: "1920 McAra Street, Regina, SK S4N 5R1" },
  { id: 12085, name: "IBEW Local 2085", city: "Winnipeg", state: "MB", phone: "(204) 982-2085", website: "www.ibew2085.com", email: "info@ibew2085.com", lat: 49.8951, lng: -97.1384, address: "2181 Portage Avenue, Winnipeg, MB R3J 0L7" },
  { id: 12166, name: "IBEW Local 2166", city: "Fredericton", state: "NB", phone: "(506) 452-0111", website: "www.ibewlocal2166.com", lat: 45.9636, lng: -66.6431, address: "681 Union Street, Fredericton, NB E3A 3N8" },
  { id: 12330, name: "IBEW Local 2330", city: "St. john's", state: "NL", phone: "(709) 895-3764", website: "www.ibew.nf.ca", lat: 47.5615, lng: -52.7126, address: "PO Box 159, 160 Holyrood Access Road, Holyrood, NL A0A 2R0" }
];

// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ──────────────────
// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ─────────────────
// Source: User-provided wage data. Completely separate from Inside Wireman locals.
// All Canadian locals excluded. IDs use 90000 + local number to avoid conflicts.
const IBEW_LINEMAN_LOCALS = [
  { id: 30002, name: "IBEW Local 2", city: "St louis", state: "MO", phone: "(314) 645-2236", website: "www.ibew2.org", email: "info@ibew2.org", lat: 38.6254063, lng: -90.190009, address: "940 Biltmore Drive,  Fenton, MO 63026" },
  { id: 30003, name: "IBEW Local 3", city: "Flushing", state: "NY", phone: "(718) 591-4000", website: "www.local3.com", email: "mail@local3ibew.org", lat: 40.7654301, lng: -73.8174291, address: "158-11 Harry Van Arsdale Jr. Avenue,  Flushing, NY 11365" },
  { id: 30009, name: "IBEW Local 9", city: "Chicago", state: "IL", phone: "(708) 449-9000", website: "www.ibew9.org", email: "mail@ibew9.org", lat: 41.8755616, lng: -87.6244212, address: "7840 Graphics Drive,  Suite 100,  Tinley Park, IL 60477" },
  { id: 30012, name: "IBEW Local 12", city: "Pueblo", state: "CO", phone: "(719) 561-8000", website: "www.ibew12.org", email: "local12@ibew12.org", lat: 38.2151104, lng: -104.6451832, address: "2901 Farabaugh Lane,  Pueblo, CO 81005" },
  { id: 30017, name: "IBEW Local 17", city: "Soutfield", state: "MI", phone: "(248) 423-4540", website: "www.ibewlocal17.org", lat: 42.5027759, lng: -83.2141395, address: "17000 W 12 Mile Road,  Southfield, MI 48076" },
  { id: 30037, name: "IBEW Local 37", city: "Fredericton", state: "NB", phone: "(506) 455-0037", website: "www.ibew37.com", email: "info@ibew37.com", lat: 45.9655979, lng: -66.6263733, address: "138 Neill Street,  Fredericton, NB E3A 2Z6" },
  { id: 30042, name: "IBEW Local 42", city: "East winsor", state: "CT", phone: "(860) 646-7297", website: "www.ibewlocal42.com", lat: 41.9196942, lng: -72.5903802, address: "20 Craftsman Road,  East Windsor, CT 06088" },
  { id: 30044, name: "IBEW Local 44", city: "Butte", state: "MT", phone: "(406) 723-3203", website: "www.ibew44.org", email: "ibew@ibew44.org", lat: 46.0131505, lng: -112.536508, address: "1901 S Montana Street,  Butte, MT 59701,  PO Box 3467,  Butte, MT 59702" },
  { id: 30047, name: "IBEW Local 47", city: "Diamond bar", state: "CA", phone: "(909) 860-4239", website: "www.ibew47.org", email: "info@ibew47.org", lat: 34.0306207, lng: -117.8095669, address: "600 N Diamond Bar Boulevard,  Diamond Bar, CA 91765" },
  { id: 30050, name: "IBEW Local 50", city: "Richmond", state: "VA", phone: "(804) 328-2972", website: "www.ibew50.org", lat: 37.5385087, lng: -77.43428, address: "1400 E Nine Mile Road,  Suite 50,  Highland Springs, VA 23075" },
  { id: 30051, name: "IBEW Local 51", city: "Springfield", state: "IL", phone: "(217) 726-8481", website: "www.ibew51.org", email: "ibew51@ibew51.org", lat: 39.7434209, lng: -89.7149566, address: "3171 Greenhead Drive,  Springfield, IL 62711" },
  { id: 30053, name: "IBEW Local 53", city: "Kansas city", state: "KS", phone: "(816) 421-5464", website: "�www.ibewlocal53.org", email: "localrep@ibewlocal53.org", lat: 39.105521, lng: -94.569423, address: "1100 Admiral Boulevard,  Kansas City, MO 64106" },
  { id: 30055, name: "IBEW Local 55", city: "Des moines", state: "IA", phone: "(515) 265-6193", website: "www.ibew55.org", email: "ibew55@ibew55.org", lat: 41.5868654, lng: -93.6249494, address: "1435 NE 54th Avenue,  Des Moines, IA 50313" },
  { id: 30057, name: "IBEW Local 57", city: "Salt lake city", state: "UT", phone: "(801) 270-5757", website: "www.ibew57.com", email: "local57@ibew57.com", lat: 40.7596198, lng: -111.886797, address: "3400 W 2100 S,  Suite B,  Salt Lake City, UT 84119" },
  { id: 30066, name: "IBEW Local 66", city: "Houston", state: "TX", phone: "(713) 943-0716", website: "www.ibew66.com", email: "local66@ibew66.com", lat: 29.6449607, lng: -95.2004011, address: "4345 Allen Genoa Road,  Pasadena, TX 77504" },
  { id: 30070, name: "IBEW Local 70", city: "Forestville", state: "MD", phone: "(301) 516-7730", website: "www.ibew70.us", email: "�office@ibew70.us", lat: 38.8395612, lng: -76.876155, address: "3606 Stewart Road,  Forestville, MD 20747" },
  { id: 30071, name: "IBEW Local 71", city: "Columbus", state: "OH", phone: "(614) 539-1394", website: "www.ibew71.org", email: "�office@ibew71.org", lat: 40.0154028, lng: -82.9220116, address: "2280 Citygate Drive,  Columbus, OH 43219" },
  { id: 30077, name: "IBEW Local 77", city: "Seattle", state: "WA", phone: "(206) 323-4505", website: "www.ibew77.com", email: "ibew77@ibew77.com", lat: 47.6038321, lng: -122.330062, address: "19415 International Boulevard,  SeaTac, WA 98188,  PO Box 68728,  Seattle, WA 98168" },
  { id: 30080, name: "IBEW Local 80", city: "Norfolk", state: "VA", phone: "(757) 480-1740", website: "www.ibew80.com", lat: 36.8557401, lng: -76.2224452, address: "5307 E Virginia Beach Boulevard,  Norfolk, VA 23502" },
  { id: 30084, name: "IBEW Local 84", city: "Newnan", state: "GA", phone: "(770) 801-5352", website: "www.ibewlocal84.org", email: "admin@ibewlocal84.org", lat: 33.8857311, lng: -84.4791529, address: "2791 Woodland Terrace,  Smyrna, GA 30080" },
  { id: 30089, name: "IBEW Local 89", city: "Mount vernon", state: "WA", phone: "(360) 755-6900", website: "www.ibew89.org", email: "local89@ibew89.com", lat: 48.4200462, lng: -122.32642, address: "1125 S Second Street,  Mount Vernon, WA 98273,  PO Box 2349,  Mount Vernon, WA 98273" },
  { id: 30102, name: "IBEW Local 102", city: "Parsippany", state: "NJ", phone: "(973) 887-1718", website: "www.ibew102.org", email: "info@ibew102.org", lat: 40.8504497, lng: -74.4269088, address: "50 Parsippany Road,  Parsippany, NJ 07054" },
  { id: 30104, name: "IBEW Local 104", city: "Mansfield", state: "MA", phone: "(508) 660-3900", website: "www.ibew104.org", email: "�info@ibew104.org", lat: 41.9933971, lng: -71.2101336, address: "900 S Main Street,  Mansfield, MA 02048" },
  { id: 30105, name: "IBEW Local 105", city: "Hamilton", state: "ON", phone: "(905) 387-1721", website: "www.ibew105.com", email: "frontdesk@ibewlu105.com", lat: 43.2557, lng: -79.8711, address: "685 Nebo Road,  Hannon, ON L0R 1P0" },
  { id: 30111, name: "IBEW Local 111", city: "Denver", state: "CO", phone: "(303) 744-7171", website: "www.ibew111.org", email: "mail@ibew111.org", lat: 39.7711459, lng: -104.9189537, address: "5965 E 39th Avenue,  Denver, CO 80207" },
  { id: 30113, name: "IBEW Local 113", city: "Colorado springs", state: "CO", phone: "(719) 633-3872", website: "www.ibew113.com", email: "info@ibew113.com", lat: 38.8339578, lng: -104.825348, address: "2150 Naegele Road,  Colorado Springs, CO 80904" },
  { id: 30120, name: "IBEW Local 120", city: "London", state: "ON", phone: "(519) 652-2929", website: "www.ibew120.ca", lat: 42.9849, lng: -81.2453, address: "6688 Tempo Road,  London, ON N6L 1P9,  Box 324,  Lambeth Station,  London, ON N6P 1P9" },
  { id: 30125, name: "IBEW Local 125", city: "Portland", state: "OR", phone: "(503) 262-9125", website: "www.ibew125.com", lat: 45.5414318, lng: -122.4859808, address: "17200 NE Sacramento Street,  Portland, OR 97230" },
  { id: 30126, name: "IBEW Local 126", city: "Montgomery", state: "PA", phone: "(610) 489-1185", website: "www.ibewlu126.com", email: "local126@ibewlu126.com", lat: 40.2154361, lng: -75.3702305, address: "3455 Germantown Pike,  Collegeville, PA 19426" },
  { id: 30141, name: "IBEW Local 141", city: "Wheeling", state: "WV", phone: "(304) 242-3870", website: "www.ibew141.org", email: "info@ibew141.org", lat: 40.0496592, lng: -80.6438123, address: "82 Burkham Court,  Wheeling, WV 26003" },
  { id: 30145, name: "IBEW Local 145", city: "Moline", state: "IL", phone: "(309) 736-4239", website: "www.ibewlocal145.com", email: "�info@ibewlocal145.com", lat: 41.5058344, lng: -90.5136642, address: "1700 52nd Avenue,  Suite A,  Moline, IL 61265" },
  { id: 30160, name: "IBEW Local 160", city: "Baudette", state: "MN", phone: "(612) 781-3126", website: "www.ibew160.org", email: "160@ibew160.org", lat: 44.9971794, lng: -93.4482974, address: "13220 County Road 6,  Plymouth, MN 55441" },
  { id: 30164, name: "IBEW Local 164", city: "Jersey city", state: "NJ", phone: "(201) 265-1700", website: "www.ibew164.org", email: "�ibew164@ibew164.org", lat: 40.7215682, lng: -74.047455, address: "205 Robin Road,  Suite 315,  Paramus, NJ 07652" },
  { id: 30175, name: "IBEW Local 175", city: "Chattanooga", state: "TN", phone: "(423) 894-3557", website: "www.ibew175.org", email: "office@ibew175.org", lat: 35.747, lng: -86.692, address: "3922 Volunteer Drive,  Suite 9,  Chattanooga, TN 37416" },
  { id: 30177, name: "IBEW Local 177", city: "Jacksonville", state: "FL", phone: "(904) 355-4569", website: "www.ibew177.org", email: "office@ibew177.org", lat: 30.3737031, lng: -81.6484468, address: "966 Liberty Street,  Jacksonville, FL 32206" },
  { id: 30193, name: "IBEW Local 193", city: "Springfield", state: "IL", phone: "(217) 544-3479", website: "www.ibew193.com", email: "office@ibew193.com", lat: 39.7840359, lng: -89.6028105, address: "3150 Wide Track Drive,  Springfield, IL 62703" },
  { id: 30194, name: "IBEW Local 194", city: "Shreveport", state: "LA", phone: "(318) 688-0194", website: "www.ibew194.org", lat: 32.4481965, lng: -93.8436901, address: "5510 Buncombe Road,  Shreveport, LA 71129" },
  { id: 30196, name: "IBEW Local 196", city: "Batavia", state: "IL", phone: "(630) 761-1829", website: "www.ibew196.com", email: "office@ibew196.com", lat: 41.8500284, lng: -88.3125738, address: "13300 IL Route 47,  Huntley, IL 60142,  PO Box 605,  Huntley, IL 60142" },
  { id: 30206, name: "IBEW Local 206", city: "Helena", state: "MT", phone: "(406) 443-7475", website: "�www.ibew206.org", email: "office@ibew206.org", lat: 46.5927425, lng: -112.036277, address: "110 N Warren Avenue,  Helena, MT 59601,  PO Box 5654,  Helena, MT 59604" },
  { id: 30213, name: "IBEW Local 213", city: "Port coquitlam", state: "ON", phone: "(604) 571-6500", website: "www.ibew213.org", email: "ibew213@ibew213.org", lat: 49.2414665, lng: -122.7623906, address: "1424 Broadway Street,  Port Coquitlam, BC V3C 5W2" },
  { id: 30220, name: "IBEW Local 220", city: "Fort worth", state: "TX", phone: "(817) 551-1885", website: "www.ibewlu220.com", email: "ibewlu220@ibewlu220.com", lat: 32.6634574, lng: -97.2896968, address: "2804 SE Loop 820,  Fort Worth, TX 76140" },
  { id: 30222, name: "IBEW Local 222", city: "Orlando", state: "FL", phone: "(787) 957-9252", website: "www.ibew222.org", email: "dispatch@ibew222.org", lat: 28.5421218, lng: -81.379045, address: "RR3 200,  Suite 11,  Toa Alta, PR 00953" },
  { id: 30238, name: "IBEW Local 238", city: "Asheville", state: "NC", phone: "(828) 505-0216", website: "www.ibew238.org", lat: 35.5897824, lng: -82.6003578, address: "46 New Leicester Highway,  Asheville, NC 28806" },
  { id: 30245, name: "IBEW Local 245", city: "Toledo", state: "OH", phone: "(419) 666-3350", website: "www.ibew245.com", lat: 41.5932359, lng: -83.567378, address: "705 Lime City Road,  Rossford, OH 43460" },
  { id: 30254, name: "IBEW Local 254", city: "Calgary", state: "AB", phone: "(403) 250-5558", website: "www.ibew254.ca", email: "admin@ibew254.ca", lat: 51.0447, lng: -114.0719, address: "3615 29th Street NE,  Calgary, AB T1Y 5W4" },
  { id: 30258, name: "IBEW Local 258", city: "Vancouver", state: "BC", phone: "(604) 520-3305", website: "www.ibew258.bc.ca", email: "info@ibew258.bc.ca", lat: 49.2827, lng: -123.1207, address: "8029 199 Street,  Suite 140,  Langley, BC V2Y 0E2" },
  { id: 30269, name: "IBEW Local 269", city: "Trenton", state: "NJ", phone: "(609) 394-8129", website: "www.ibew269.com", lat: 40.2203074, lng: -74.7659, address: "670 Whitehead Road,  Trenton, NJ 08648" },
  { id: 30270, name: "IBEW Local 270", city: "Oak ridge", state: "TX", phone: "(865) 483-1354", website: "www.ibewlocal270.org", email: "ibew270@comcast.net", lat: 36.0048514, lng: -84.289974, address: "138 N Lincoln Circle,  Oak Ridge, TN 37830" },
  { id: 30278, name: "IBEW Local 278", city: "Corpus christi", state: "TX", phone: "(361) 855-1084", website: "www.ibew278.com", email: "office@ibew278.com", lat: 27.7098165, lng: -97.4337957, address: "2301 Saratoga Boulevard,  Corpus Christi, TX 78417" },
  { id: 30291, name: "IBEW Local 291", city: "Boise", state: "ID", phone: "(208) 343-4861", website: "www.ibew291.org", email: "office@ibew291.org", lat: 43.6166163, lng: -116.200886, address: "225 N Sixteenth Street,  Suite 110,  Boise, ID 83702" },
  { id: 30295, name: "IBEW Local 295", city: "Little rock", state: "AR", phone: "(501) 562-2244", website: "www.ibew295.org", email: "ibew295@ibew295.org", lat: 34.6835419, lng: -92.3522438, address: "7320 S University Avenue,  Little Rock, AR 72209" },
  { id: 30301, name: "IBEW Local 301", city: "Texarkana", state: "TX", phone: "(903) 838-8531", email: "chris@ibew301.com", lat: 33.4466745, lng: -94.0771483, address: "114 Elm Street,  Nash, TX 75569,  PO Box 490,  Nash, TX 75569" },
  { id: 30303, name: "IBEW Local 303", city: "St. catherines", state: "ON", phone: "(905) 354-4303", website: "www.ibewlocal303.com", lat: 43.1088039, lng: -79.1205537, address: "4485 Kent Avenue,  Niagara Falls, ON L2H 1J1" },
  { id: 30304, name: "IBEW Local 304", city: "Topeka", state: "KS", phone: "(785) 235-2301", website: "www.ibew304.org", email: "lu304@ibew304.org", lat: 39.049011, lng: -95.677556, address: "3906 NW Sixteenth Street,  Topeka, KS 66618" },
  { id: 30307, name: "IBEW Local 307", city: "Cumberland", state: "MD", phone: "(301) 724-3403", website: "www.ibew307.org", email: "administrator@ibew307.org", lat: 39.655873, lng: -78.759662, address: "401 Decatur Street,  Cumberland, MD 21502" },
  { id: 30309, name: "IBEW Local 309", city: "Collinsville", state: "IL", phone: "(618) 345-5112", website: "www.ibew309.com", email: "electricians@ibew309.org", lat: 38.673528, lng: -90.0165714, address: "2000A Mall Street,  Collinsville, IL 62234" },
  { id: 30317, name: "IBEW Local 317", city: "Huntington", state: "WV", phone: "(304) 429-5013", website: "www.ibew317.net", email: "office@ibew317.com", lat: 38.4192496, lng: -82.445154, address: "1848 Madison Avenue,  Suite A,  Huntington, WV 25704" },
  { id: 30322, name: "IBEW Local 322", city: "Casper", state: "WY", phone: "(307) 265-1060", website: "www.ibew322.org", email: "office@ibew322.org", lat: 42.8568778, lng: -106.3349395, address: "691 English Drive,  Casper, WY 82601" },
  { id: 30342, name: "IBEW Local 342", city: "Greensboro", state: "NC", phone: "(336) 285-7781", website: "www.ibew342.org", email: "ibew342@att.net", lat: 36.074328, lng: -79.9678353, address: "7874 Thorndike Road,  Greensboro, NC 27409" },
  { id: 30351, name: "IBEW Local 351", city: "Folsom", state: "NJ", phone: "(609) 704-8351", website: "�www.ibew351.org", lat: 39.6020608, lng: -74.8426653, address: "Hammonton, NJ 08037,  PO Box 1118,  Hammonton, NJ 08037" },
  { id: 30353, name: "IBEW Local 353", city: "Toronto", state: "ON", phone: "(416) 510-3530", website: "www.ibew353.org", email: "�inquiries@ibew353.org", lat: 43.6532, lng: -79.3832, address: "1377 Lawrence Avenue E,  Toronto, ON M3A 3P8" },
  { id: 30359, name: "IBEW Local 359", city: "Miami", state: "FL", phone: "(305) 458-8205", website: "www.ibew359.com", lat: 25.7741566, lng: -80.1935973, address: "7811 Coral Way,  Suite 101,  Miami, FL 33155" },
  { id: 30369, name: "IBEW Local 369", city: "Louisville", state: "KY", phone: "(502) 368-2568", website: "www.ibewlocal369.com", lat: 38.2542376, lng: -85.759407, address: "4315 Preston Highway,  Suite 102,  Louisville, KY 40213" },
  { id: 30379, name: "IBEW Local 379", city: "Charlotte", state: "NC", phone: "(704) 455-4595", website: "www.ibew379.org", email: "ibewlu379@ibew379.org", lat: 35.1787301, lng: -80.9310565, address: "1900 Cross Beam Drive,  Charlotte, NC 28217" },
  { id: 30396, name: "IBEW Local 396", city: "Las vegas", state: "NV", phone: "(702) 457-3011", website: "www.ibew396.org", email: "office@ibew396.org", lat: 36.142362, lng: -115.0980097, address: "3520 Boulder Highway,  Las Vegas, NV 89121" },
  { id: 30400, name: "IBEW Local 400", city: "Asbury park", state: "NJ", phone: "(732) 681-7111", website: "www.ibew400.org", lat: 40.2203907, lng: -74.0120817, address: "3301 Highway 138 E,  Wall, NJ 07719,  PO Box 1256,  Wall, NJ 07719" },
  { id: 30402, name: "IBEW Local 402", city: "Thunder bay", state: "ON", phone: "(807) 623-5759", website: "www.ibew402.ca", email: "office@ibew402.ca", lat: 48.3809, lng: -89.2477, address: "103-910 Cobalt Crescent,  Thunder Bay, ON P7B 5W3" },
  { id: 30424, name: "IBEW Local 424", city: "Edmonton", state: "AB", phone: "(780) 462-5076", website: "www.ibew424.net", email: "ibew424@ibew424.net", lat: 53.5461, lng: -113.4938, address: "4232-93 Street,  Edmonton, AB T6E 5P5" },
  { id: 30426, name: "IBEW Local 426", city: "Sioux falls", state: "SD", phone: "(605) 336-0370", website: "www.ibew426.com", email: "office@ibew426.com", lat: 43.5476008, lng: -96.7293629, address: "3725 N Fourth Avenue,  Sioux Falls, SD 57104" },
  { id: 30429, name: "IBEW Local 429", city: "Nashville", state: "TN", phone: "(615) 889-4429", website: "www.ibew429.org", email: "ibew429@ibew429.org", lat: 36.150091, lng: -86.700038, address: "2001 Elm Hill Pike,  Nashville, TN 37210" },
  { id: 30436, name: "IBEW Local 436", city: "El dorado", state: "AR", phone: "(870) 863-9181", email: "ibewl436@sbcglobal.net", lat: 33.2115087, lng: -92.6650144, address: "810 N Newton Street,  El Dorado, AR 71730" },
  { id: 30443, name: "IBEW Local 443", city: "Montgomery", state: "AL", phone: "(334) 272-8830", website: "ibew443.org", email: "info@ibew443.org", lat: 32.3777111, lng: -86.3090775, address: "1469 Jean Street,  Montgomery, AL 36107,  PO Box 3204,  Montgomery, AL 36109" },
  { id: 30449, name: "IBEW Local 449", city: "Pocatello", state: "ID", phone: "(208) 232-5263", website: "www.ibewlocal449.org", email: "office@ibewlocal449.org", lat: 42.9037434, lng: -112.4319403, address: "1537 Baldy Avenue,  Pocatello, ID 83201" },
  { id: 30455, name: "IBEW Local 455", city: "Springfield", state: "MA", phone: "(413) 733-7398", website: "www.ibew455.org", email: "�office@ibew455.org", lat: 42.1381571, lng: -72.562728, address: "474 Page Boulevard,  Springfield, MA 01104" },
  { id: 30456, name: "IBEW Local 456", city: "North brunswich", state: "NJ", phone: "(732) 246-2122", website: "www.ibew456.org", email: "local456@ibew456.org", lat: 40.46334, lng: -74.47741, address: "1295 Livingston Avenue,  North Brunswick, NJ 08902" },
  { id: 30474, name: "IBEW Local 474", city: "Memphis", state: "TN", phone: "(901) 726-4060", website: "www.ibewlocal474.com", email: "info@ibewlocal474.com", lat: 35.1377321, lng: -89.9992972, address: "1870 Madison Avenue,  Memphis, TN 38104" },
  { id: 30483, name: "IBEW Local 483", city: "Tacoma", state: "WA", phone: "(253) 565-3232", website: "www.ibew483.org", email: "general@ibew483.org", lat: 47.2271696, lng: -122.477514, address: "3525 S Alder Street,  Tacoma, WA 98409" },
  { id: 30495, name: "IBEW Local 495", city: "Wilmington", state: "NC", phone: "(910) 660-8630", lat: 34.2352853, lng: -77.9487284, address: "2725 Old Wrightsboro Road,  Unit 3C,  Wilmington, NC 28405" },
  { id: 30530, name: "IBEW Local 530", city: "Sarnia", state: "ON", phone: "(519) 344-4154", website: "www.lu530.com", email: "�IBEW@LU530.com", lat: 42.9745, lng: -82.4064, address: "128 Kendall Street,  Point Edward, ON N7V 4G5" },
  { id: 30532, name: "IBEW Local 532", city: "Billings", state: "MT", phone: "(406) 248-9119", website: "www.ibew532.com", email: "�office@ibew532.com", lat: 45.7874957, lng: -108.49607, address: "5200 Midland Road,  Billings, MT 59101,  PO Box 80005,  Billings, MT 59108" },
  { id: 30553, name: "IBEW Local 553", city: "Durham", state: "NC", phone: "(919) 596-8220", website: "www.ibew553.org", email: "office@ibew553.org", lat: 35.996653, lng: -78.9018053, address: "3300 New Raleigh Highway,  Durham, NC 27703,  PO Box 13551,  Research Triangle Park, NC 27709" },
  { id: 30558, name: "IBEW Local 558", city: "Sheffield", state: "AL", phone: "(256) 383-2279", website: "www.ibew558.org", email: "�info@ibew558.org", lat: 34.7608701, lng: -87.6975945, address: "1803 E Seventeenth Street,  Sheffield, AL 35660,  PO Box 578,  Sheffield, AL 35660" },
  { id: 30568, name: "IBEW Local 568", city: "Montreal", state: "QC", phone: "(514) 329-0568", website: "www.fioe568.com", email: "�info@fioe568.com", lat: 45.5017, lng: -73.5673, address: "4881 Jarry Street E,  Suite 228,  Montreal, QC H1R 1Y1" },
  { id: 30583, name: "IBEW Local 583", city: "El paso", state: "TX", phone: "(915) 877-9166", website: "www.ibew583.com", email: "�ibew@ibew583.com", lat: 31.886281, lng: -106.6003628, address: "311 W Borderland Road,  El Paso, TX 79932" },
  { id: 30586, name: "IBEW Local 586", city: "Ottawa", state: "ON", phone: "(613) 741-5664", website: "www.ibew586.org", email: "bpotter@ibew586.org", lat: 45.4215, lng: -75.6972, address: "2460 Lancaster Road,  Suite 103,  Ottawa, ON K1B 4S5" },
  { id: 30596, name: "IBEW Local 596", city: "Clarksburg", state: "WV", phone: "(304) 622-0151", website: "www.ibew596.com", lat: 39.2806451, lng: -80.3445341, address: "1001 N Twelfth Street,  Clarksburg, WV 26301,  PO Box 1508,  Clarksburg, WV 26302" },
  { id: 30602, name: "IBEW Local 602", city: "Amarillo", state: "TX", phone: "(806) 376-9945", website: "www.ibew602.org", email: "admin@ibew602.org", lat: 35.2144834, lng: -101.8585011, address: "200 S Fannin Street,  Amarillo, TX 79106" },
  { id: 30611, name: "IBEW Local 611", city: "Albuquerque", state: "NM", phone: "(505) 343-0611", website: "www.ibew611.org", lat: 35.0841034, lng: -106.650985, address: "4921 Alexander Boulevard NE,  Suite A,  Albuquerque, NM 87107" },
  { id: 30613, name: "IBEW Local 613", city: "Atlanta", state: "GA", phone: "(404) 523-8107", website: "www.ibew613.org", email: "�admin613@ibew613.org", lat: 33.7544657, lng: -84.3898151, address: "501 Pulliam Street SW,  Suite 250,  Atlanta, GA 30312" },
  { id: 30649, name: "IBEW Local 649", city: "Alton", state: "IL", phone: "(618) 462-1627", website: "www.ibew649.org", email: "info@ibew649.org", lat: 38.9158011, lng: -90.1504806, address: "3945 Humbert Road,  Alton, IL 62002" },
  { id: 30659, name: "IBEW Local 659", city: "Medford", state: "CA", phone: "(541) 664-0800", website: "www.ibew659.org", email: "�info@ibew659.org", lat: 45.1833391, lng: -64.3682106, address: "4480 Rogue Valley Highway,  Suite 3,  Central Point, OR 97502" },
  { id: 30666, name: "IBEW Local 666", city: "Sandston", state: "VA", phone: "(804) 353-9666", website: "www.ibewlocal666.com", email: "info@ibewlocal666.com", lat: 37.5107225, lng: -77.3115564, address: "1400 E Nine Mile Road,  Highland Springs, VA 23075,  PO Box 467,  Sandston, VA 23150" },
  { id: 30676, name: "IBEW Local 676", city: "Pensacola", state: "FL", phone: "(850) 477-8767", website: "www.ibewlocal676.com", lat: 30.4274744, lng: -87.2187476, address: "7830 N Palafox Street,  Pensacola, FL 32534" },
  { id: 30681, name: "IBEW Local 681", city: "Witchita falls", state: "TX", phone: "(940) 322-1661", website: "www.ibew681.org", lat: 33.8478638, lng: -98.4928607, address: "6111 Old Jacksboro Highway,  Wichita Falls, TX 76302" },
  { id: 30688, name: "IBEW Local 688", city: "Mansfield", state: "OH", phone: "(419) 526-4688", website: "www.ibew688.org", email: "�resign688@hotmail.com", lat: 40.756656, lng: -82.516478, address: "67 S Walnut Street,  Mansfield, OH 44902" },
  { id: 30700, name: "IBEW Local 700", city: "Fort smith", state: "AR", phone: "(479) 783-1149", website: "www.ibew700.org", email: "ibew700@ibew700.com", lat: 35.4080105, lng: -94.3953971, address: "2914 Midland Boulevard,  Ft. Smith, AR 72904" },
  { id: 30702, name: "IBEW Local 702", city: "West frankfort", state: "IL", phone: "(618) 932-2102", website: "www.ibew702.org", email: "ibew702@ibew702.org", lat: 37.8981409, lng: -88.9225471, address: "106 N Monroe Street, West Frankfort, IL 62896" },
  { id: 30714, name: "IBEW Local 714", city: "Minot", state: "ND", phone: "(701) 852-3025", website: "www.local714.com", email: "office@local714.com", lat: 48.23251, lng: -101.296273, address: "125 35th Avenue NE, Minot, ND 58703, PO Box 1906, Minot, ND 58702" },
  { id: 30738, name: "IBEW Local 738", city: "Longview", state: "TX", phone: "(903) 753-7646", email: "ibew738@swbell.net", lat: 32.5035993, lng: -94.6818227, address: "2914 E Marshall Avenue, Longview, TX 75601" },
  { id: 30760, name: "IBEW Local 760", city: "Knoxville", state: "TN", phone: "(865) 524-8638", website: "www.ibew760.org", email: "info@ibew760.org", lat: 35.9983845, lng: -83.923296, address: "1530 Bill Williams Avenue, Knoxville, TN 37917" },
  { id: 30768, name: "IBEW Local 768", city: "Kalispell", state: "MT", phone: "(406) 752-7680", website: "www.ibew768.com", email: "office@ibew768.com", lat: 48.202158, lng: -114.315321, address: "347 Second Avenue W, Kalispell, MT 59901, PO Box 1095, Kalispell, MT 59903" },
  { id: 30769, name: "IBEW Local 769", city: "Phoenix", state: "AZ", phone: "(480) 423-9769", website: "www.ibew769.com", email: "dispatch@ibew769.com", lat: 33.3529029, lng: -111.831793, address: "220 N William Dillard Drive, Gilbert, AZ 85233" },
  { id: 30773, name: "IBEW Local 773", city: "Windsor", state: "ON", phone: "(519) 948-2221", website: "www.ibew773.ca", email: "admin@ibew773.ca", lat: 42.3149, lng: -83.0364, address: "4050 N Service Road E, Windsor, ON N8W 5X2" },
  { id: 30776, name: "IBEW Local 776", city: "Charleston", state: "SC", phone: "(843) 554-1080", email: "local776@ibew776.com", lat: 32.8622503, lng: -80.0201214, address: "3345 Seiberling Road, North Charleston, SC 29418" },
  { id: 30804, name: "IBEW Local 804", city: "Breslau", state: "ON", phone: "(519) 648-3993", website: "www.ibew804.ca", email: "office@ibew804.ca", lat: 43.4749611, lng: -80.4127316, address: "5158 Fountain Street N, Breslau, ON N0B 1M0" },
  { id: 30816, name: "IBEW Local 816", city: "Paducah", state: "KY", phone: "(270) 898-2456", website: "www.ibewlocal816.org", email: "ibewlocal816@ibewlocal816.org", lat: 37.046629, lng: -88.5567297, address: "4515 Clarks River Road, Paducah, KY 42003" },
  { id: 30852, name: "IBEW Local 852", city: "Corinth", state: "MS", phone: "(662) 286-2897", email: "ibewlocal852@bellsouth.net", lat: 34.9343599, lng: -88.5223353, address: "192 County Road 509, Corinth, MS 38834, PO Box 1027, Corinth, MS 38835" },
  { id: 30876, name: "IBEW Local 876", city: "Grand rapids", state: "MI", phone: "(616) 784-1133", website: "www.ibew876.com", email: "ibew876@gmail.com", lat: 42.9632425, lng: -85.6678639, address: "5000 E Airport Road, Mount Pleasant, MI 48858" },
  { id: 30903, name: "IBEW Local 903", city: "Gulfport", state: "MS", phone: "(228) 863-9881", website: "www.lu903.com", email: "lu903@lu903.com", lat: 30.3674198, lng: -89.0928155, address: "2417 32nd Street, Gulfport, MS 39501, PO Drawer L, Gulfport, MS 39502" },
  { id: 30934, name: "IBEW Local 934", city: "Kingsport", state: "TN", phone: "(423) 323-5411", website: "www.ibew934.com", email: "ibew_934@yahoo.com", lat: 36.550238, lng: -82.5594293, address: "4640 Highway 11 W, Blountville, TN 37617, PO Box 388, Blountville, TN 37617" },
  { id: 30953, name: "IBEW Local 953", city: "Eau clarie", state: "WI", phone: "(715) 834-4911", website: "www.ibew953.org", email: "info@ibew953.org", lat: 44.811191, lng: -91.6465357, address: "4205 Southtowne Drive, Eau Claire, WI 54701" },
  { id: 30968, name: "IBEW Local 968", city: "Parkersburg", state: "WV", phone: "(304) 485-7412", website: "www.ibew968.com", email: "ibew968@ibew968.com", lat: 39.2667309, lng: -81.5620755, address: "1845 Seventh Street, Parkersburg, WV 26101" },
  { id: 30993, name: "IBEW Local 993", city: "Kamloops", state: "BC", phone: "(250) 376-8755", website: "www.ibew993.org", email: "office@ibew993.org", lat: 50.6745, lng: -120.3273, address: "873 Desmond Street, Kamloops, BC V2B 5K3" },
  { id: 30995, name: "IBEW Local 995", city: "Baton rouge", state: "LA", phone: "(225) 927-6462", website: "www.lu995.com", email: "ibew@lu995.com", lat: 30.4681253, lng: -91.1020823, address: "8181 Tom Drive, Baton Rouge, LA 70815" },
  { id: 31002, name: "IBEW Local 1002", city: "Tulsa", state: "OK", phone: "(918) 438-7344", website: "www.ibew1002.com", email: "ibew@ibew1002.com", lat: 36.1329857, lng: -95.8371928, address: "12510 E 21st Street, Tulsa, OK 74129" },
  { id: 31049, name: "IBEW Local 1049", city: "Long island", state: "NY", phone: "(631) 234-1800", website: "www.ibew1049.org", email: "sgasparik@ibew1049.com", lat: 40.8084447, lng: -73.037391, address: "100 Corporate Drive, Holtsville, NY 11742" },
  { id: 31186, name: "IBEW Local 1186", city: "Honolulu", state: "HI", phone: "(808) 847-5341", website: "www.ibew1186.org", email: "ibew1186@ibew1186.org", lat: 21.304547, lng: -157.855676, address: "1935 Hau Street, Room 401, Honolulu, HI 96819" },
  { id: 31245, name: "IBEW Local 1245", city: "Vacaville", state: "CA", phone: "(707) 452-2700", website: "www.ibew1245.com", email: "rldj@ibew1245.com", lat: 38.3734022, lng: -121.9482469, address: "30 Orange Tree Circle, Vacaville, CA 95687" },
  { id: 31249, name: "IBEW Local 1249", city: "Cicero", state: "NY", phone: "(315) 656-7253", website: "www.ibew1249.org", email: "office@ibew1249.org", lat: 43.1756235, lng: -76.1193678, address: "8531 Brewerton Road, Suite 1, Cicero, NY 13039" },
  { id: 31250, name: "IBEW Local 1250", city: "Rapid city", state: "SD", phone: "(605) 343-0954", website: "www.ibewlocal1250.org", email: "ibew1250ba@gmail.com", lat: 44.0675321, lng: -103.2017328, address: "922 1/2 E Saint Patrick Street, Rapid City, SD 57701" },
  { id: 31316, name: "IBEW Local 1316", city: "Macon", state: "GA", phone: "(478) 743-7017", website: "www.ibew1316.com", email: "admin@ibew1316.org", lat: 32.836983, lng: -83.6606502, address: "1046 Patterson Street, Macon, GA 31204" },
  { id: 31319, name: "IBEW Local 1319", city: "Bloomsburg", state: "PA", phone: "(570) 714-1352", website: "www.ibew1319.org", email: "info@ibew1319.org", lat: 41.2734747, lng: -75.8950089, address: "225 Division Street, Kingston, PA 18704" },
  { id: 31340, name: "IBEW Local 1340", city: "Newport news", state: "VA", phone: "(757) 875-1340", website: "www.ibew1340.com", email: "jeff@ibew1340.com", lat: 37.1658383, lng: -76.5476554, address: "552 Industrial Park Drive, Newport News, VA 23608" },
  { id: 31393, name: "IBEW Local 1393", city: "Indianapolis", state: "IN", phone: "(317) 791-1362", website: "www.ibewlocal1393.com", email: "info@ibewlocal1393.org", lat: 39.7125425, lng: -86.1484791, address: "3645 S East Street, Indianapolis, IN 46227" },
  { id: 31426, name: "IBEW Local 1426", city: "Grand forks", state: "ND", phone: "(701) 775-7601", website: "www.ibew1426.org", email: "businessmanager@ibew1426.org", lat: 47.9359291, lng: -97.0557104, address: "1714 N Washington Street, Grand Forks, ND 58203" },
  { id: 31516, name: "IBEW Local 1516", city: "Jonesboro", state: "AR", phone: "(870) 932-2114", website: "www.ibew1516.com", email: "ibew1516@outlook.com", lat: 35.8348088, lng: -90.7045297, address: "9400 E Highland Drive, Jonesboro, AR 72401, PO Box 577, Jonesboro, AR 72403" },
  { id: 31525, name: "IBEW Local 1525", city: "Omaha", state: "NE", phone: "(402) 334-1880", email: "ibew1525@aol.com", lat: 41.2224407, lng: -96.1219187, address: "13336 C Street, Omaha, NE 68144" },
  { id: 31531, name: "IBEW Local 1531", city: "Albany", state: "GA", phone: "(229) 436-2417", email: "ibew1531@gmail.com", lat: 31.5782062, lng: -84.1556809, address: "1900 Clark Avenue, Albany, GA 31705, PO Box 916, Albany, GA 31702" },
  { id: 31547, name: "IBEW Local 1547", city: "Anchorage", state: "AK", phone: "(907) 272-6571", website: "www.ibew1547.org", email: "webmaster@ibew1547.org", lat: 61.2163129, lng: -149.894852, address: "3333 Denali Street, Suite 200, Anchorage, AK 99503" },
  { id: 31579, name: "IBEW Local 1579", city: "Augusta", state: "GA", phone: "(706) 722-6357", website: "www.ibew1579.org", email: "admin@ibew1579.org", lat: 33.4795565, lng: -81.9741365, address: "1250 Reynolds Street, Augusta, GA 30901" },
  { id: 31687, name: "IBEW Local 1687", city: "Sudbury", state: "ON", phone: "(705) 566-1687", website: "www.ibew1687.org", email: "info@ibew1687.org", lat: 46.4917, lng: -80.993, address: "1204 St. Jerome Street, Sudbury, ON P3A 2V9" },
  { id: 31701, name: "IBEW Local 1701", city: "Owensboro", state: "KY", phone: "(270) 684-3058", email: "ibew1701@yahoo.com", lat: 37.7572284, lng: -87.1502223, address: "2911 W Parrish Avenue, Owensboro, KY 42301" },
  { id: 31925, name: "IBEW Local 1925", city: "Martin", state: "TN", phone: "(731) 587-3457", email: "ibew1925@frontiernet.net", lat: 36.3432777, lng: -88.8503514, address: "402 Jackson Street, Martin, TN 38237, PO Box 64, Martin, TN 38237" },
  { id: 31928, name: "IBEW Local 1928", city: "Halifax", state: "NS", phone: "(902) 450-5366", website: "www.ibew1928.org", email: "contact@ibew1928.org", lat: 44.6488, lng: -63.5752, address: "14 McQuade Lake Crescent, Suite 204, Beechville, NS B3S 1B6" },
  { id: 32067, name: "IBEW Local 2067", city: "Regina", state: "SK", phone: "(306) 352-1433", website: "www.ibew2067.com", email: "ibew@ibew2067.com", lat: 50.4452, lng: -104.6189, address: "1810 McAra Street, Regina, SK S4N 6C4" },
  { id: 32085, name: "IBEW Local 2085", city: "Winnipeg", state: "MB", phone: "(204) 982-2085", website: "www.ibew2085.com", email: "info@ibew2085.com", lat: 49.8951, lng: -97.1384, address: "2181 Portage Avenue, Winnipeg, MB R3J 0L7" },
  { id: 32150, name: "IBEW Local 2150", city: "Milwaukee", state: "WI", phone: "(262) 252-2552", website: "www.ibewlocal2150.org", email: "ibew@ibewlocal2150.com", lat: 43.1185178, lng: -88.0829903, address: "N56 W13777 Silver Spring Drive, Menomonee Falls, WI 53051" },
  { id: 32166, name: "IBEW Local 2166", city: "Fredericton", state: "NB", phone: "(506) 452-0111", website: "www.ibewlocal2166.com", email: "admin@ibewlocal2166.com", lat: 45.9636, lng: -66.6431, address: "681 Union Street, Fredericton, NB E3A 3N8" },
  { id: 32286, name: "IBEW Local 2286", city: "Beaumont", state: "TX", phone: "(409) 840-4806", email: "ibew2286@hotmail.com", lat: 30.0829344, lng: -94.0984277, address: "4850 Stone Oak Drive, Beaumont, TX 77705, PO Box 3623, Beaumont, TX 77704" }
];

// ─── HFIAW LOCALS DATABASE — Heat & Frost Insulators & Allied Workers ─────────
const HFIAW_LOCALS = [
  { id: 50001, name: "HFIAW Local 1", city: "St. louis", state: "MO", phone: "(314) 291 - 7399", website: "www.insulators1.org", email: "awl1@insulators.org", lat: 38.6254063, lng: -90.190009, address: "3325 Hollenberg Dr, Bridgeton, MO, 63044" },
  { id: 50002, name: "HFIAW Local 2", city: "Pittsburgh", state: "PA", phone: "(724) 378 - 9735", email: "awl2@insulators.org", lat: 40.4406968, lng: -80.0025666, address: "109 Pleasant Dr., Ste. 200, Aliquippa, PA 15001" },
  { id: 50003, name: "HFIAW Local 3", city: "Cleveland", state: "OH", phone: "(216) 621 - 3522", email: "awl3@insulators.org", lat: 41.4996574, lng: -81.6936772, address: "1617 E 30th St, Cleveland, OH 1617 E 30th ST, Cleveland, OH 44114" },
  { id: 50004, name: "HFIAW Local 4", city: "Buffalo", state: "NY", phone: "(716) 823 - 0980", website: "www.insulators4.org", email: "awl4@insulators.org", lat: 42.8864163, lng: -78.8781493, address: "2484 Seneca St, Buffalo, NY 14210" },
  { id: 50005, name: "HFIAW Local 5", city: "Los angeles", state: "ON", phone: "(909) 390 - 3401", website: "www.awlocal5.com", email: "awl5@insulators.org", lat: 45.5801966, lng: -74.8410661, address: "3833 Ebony St, Ontario, CA 91761" },
  { id: 50006, name: "HFIAW Local 6", city: "Boston", state: "MA", phone: "(617) 436 - 4666", website: "www.insulators6.org", email: "awl6@insulators.org", lat: 42.3588336, lng: -71.0578303, address: "303 Freeport St, Dorchester, MA 02122" },
  { id: 50007, name: "HFIAW Local 7", city: "Seattle", state: "AK", phone: "(206) 812 - 0777", website: "local7insulators.org", email: "awl7@insulators.org", lat: 60.0674943, lng: -139.1892223, address: "14675 Interurban Ave. S Ste. 103, Tukwila, WA 98168" },
  { id: 50008, name: "HFIAW Local 8", city: "Cincinnati", state: "OH", phone: "(513) 221 - 5969", email: "awl8@insulators.org", lat: 39.1014537, lng: -84.5124602, address: "2300 Montana Ave., Ste. 302, Cincinnati, OH 45211" },
  { id: 50009, name: "HFIAW Local 9", city: "Norfolk", state: "VA", phone: "(757) 739 - 1962", email: "awl9@insulators.org", lat: 36.8493695, lng: -76.2899539, address: "557 Barlow Dr, Portsmouth, VA, 23707" },
  { id: 50010, name: "HFIAW Local 10", city: "Little rock", state: "AR", phone: "(479) 307 - 1701", email: "awl10@insulators.org", lat: 34.7465071, lng: -92.2896267, address: "206 Ave. 2 SE,  Atkins, AR 72823" },
  { id: 50012, name: "HFIAW Local 12", city: "New york city", state: "NY", phone: "(718) 784 - 3456", email: "awl12@insulators.org", lat: 40.7127281, lng: -74.0060152, address: "35-53 24th Street, Long Island City, NY, 11106" },
  { id: 50013, name: "HFIAW Local 13", city: "Jacksonville", state: "FL", phone: "(904) 388 - 1601", email: "awl13@insulators.org", lat: 30.3262247, lng: -81.6579179, address: "3647 Gilmore St, Jacksonville, FL 32205" },
  { id: 50014, name: "HFIAW Local 14", city: "Philadelphia", state: "PA", phone: "(215) 289 - 4303", website: "www.local-14.org", email: "awl14@insulators.org", lat: 39.9527237, lng: -75.1635262, address: "2014 Hornig Rd, Philadephia, PA 19116" },
  { id: 50016, name: "HFIAW Local 16", city: "San francisco", state: "CA", phone: "(707) 748 - 1616", website: "www.insulators16.org", email: "awl16@insulators.org", lat: 37.7879363, lng: -122.4075201, address: "3801 Park RD, Benicia, CA 94510" },
  { id: 50017, name: "HFIAW Local 17", city: "Chicago", state: "IL", phone: "(708) 468 - 8000", website: "www.local17insulators.com", email: "awl17@insulators.org", lat: 41.8755616, lng: -87.6244212, address: "18520 Spring Creek Dr, Tinley Park, IL 60477" },
  { id: 50018, name: "HFIAW Local 18", city: "Indianapolis", state: "IN", phone: "(317) 786 - 3216", website: "www.insulators18.org", email: "awl18@insulators.org", lat: 39.7683331, lng: -86.1583502, address: "1220 E. Epler Ave, Indianapolis, IN, 46227" },
  { id: 50019, name: "HFIAW Local 19", city: "Milwaukee", state: "WI", phone: "(262) 548 - 9606", website: "www.insulators19.com", email: "awl19@insulators.org", lat: 43.0386475, lng: -87.9090751, address: "N 27 W23155 Roundy Dr, Pewaukee, WI, 53072" },
  { id: 50021, name: "HFIAW Local 21", city: "Dallas", state: "TX", phone: "(972) 243 - 5661", email: "awl21@insulators.org", lat: 32.7762719, lng: -96.7968559, address: "11580 Reeder Rd, Dallas, TX, 75229" },
  { id: 50022, name: "HFIAW Local 22", city: "Houston", state: "TX", phone: "(281) 479 - 2220", website: "InsulatorsLocal22.org", email: "awl22@insulators.org", lat: 29.7589382, lng: -95.3676974, address: "2210 Wichita St, Pasadena, TX 77502" },
  { id: 50023, name: "HFIAW Local 23", city: "Harrisburg", state: "PA", phone: "(717) 930 - 0922", website: "www.insulatorslocal23.org", email: "awl23@insulators.org", lat: 40.2663107, lng: -76.8861122, address: "8926 Jonestown Rd, Grantville, Pa 17028" },
  { id: 50024, name: "HFIAW Local 24", city: "Washington", state: "WA", phone: "(301) 725 - 2400", website: "www.insulators24.org", email: "awl24@insulators.org", lat: 45.5825711, lng: -122.3509593, address: "901 Montgomery St, Laurel, MD 20707" },
  { id: 50025, name: "HFIAW Local 25", city: "Detroit", state: "MI", phone: "(248) 352 - 1850", email: "awl25@insulators.org", lat: 42.3315509, lng: -83.0466403, address: "21353 Bridge St, Southfield, MI 48033" },
  { id: 50026, name: "HFIAW Local 26", city: "Rochester", state: "NY", phone: "(585) 323 - 1620", website: "www.insulators26.com", email: "awl26@insulators.org", lat: 43.157285, lng: -77.615214, address: "4348 Culver Rd., Ste. 3, Rochester, NY 14622" },
  { id: 50027, name: "HFIAW Local 27", city: "Kansas city", state: "KS", phone: "(816) 252 - 0588", website: "www.insulators27.com", email: "awl27@insulators.org", lat: 39.1134562, lng: -94.626497, address: "400 S Main St, Independence, MO, 64050" },
  { id: 50028, name: "HFIAW Local 28", city: "Denver", state: "CO", phone: "(303) 638 - 2560", email: "awl28@insulators.org", lat: 39.7392364, lng: -104.984862, address: "3508 Peoria St, STE #102, Aurora, CO 80010" },
  { id: 50030, name: "HFIAW Local 30", city: "Syracuse", state: "NY", phone: "(315) 475 - 1246", email: "awl30@insulators.org", lat: 43.0481221, lng: -76.1474244, address: "5 Adler Drive Suite 3, East Syracuse, NY, 13057" },
  { id: 50032, name: "HFIAW Local 32", city: "Newark", state: "NJ", phone: "(732) 545 - 3210", email: "awl32@insulators.org", lat: 40.735657, lng: -74.1723667, address: "318 Cleveland Ave, Highland Park, NJ 08904" },
  { id: 50033, name: "HFIAW Local 33", city: "Connecticut", state: "CT", phone: "(203) 265 - 6376", website: "www.insulators33.com", email: "awl33@insulators.org", lat: 41.8111114, lng: -72.2483889, address: "616 S Colony Rd. Wallingford, CT 06492" },
  { id: 50034, name: "HFIAW Local 34", city: "Minneapolis", state: "MN", phone: "(651) 312 - 1245", website: "www.insulators34.org", email: "awl34@insulators.org", lat: 44.9772995, lng: -93.2654692, address: "95 Empire Dr, St Paul, MN 55103" },
  { id: 50036, name: "HFIAW Local 36", city: "Portland", state: "OR", phone: "(503) 255 - 2692", website: "www.insulators36.org", email: "awl36@insulators.org", lat: 45.5202471, lng: -122.674194, address: "16076 SE Evelyn St, Clackamas, OR 97015" },
  { id: 50037, name: "HFIAW Local 37", city: "Evansville", state: "IN", phone: "(812) 477 - 2341", website: "www.insulators37.org", email: "awl37@insulators.org", lat: 37.970495, lng: -87.5715641, address: "2360 N Cullen Ave, Evansville, IN 47715" },
  { id: 50038, name: "HFIAW Local 38", city: "Wilkes-barre", state: "PA", phone: "(570) 829 - 0634", email: "awl38@insulators.org", lat: 41.2464824, lng: -75.8817316, address: "315-317 N Washington St, Wilkes-Barre, PA 18705" },
  { id: 50039, name: "HFIAW Local 39", city: "Omaha", state: "NE", phone: "(402) 333 - 6960", email: "awl39@insulators.org", lat: 41.2587459, lng: -95.9383758, address: "4801 F. Street, Omaha, NE, 68117" },
  { id: 50040, name: "HFIAW Local 40", city: "Albany", state: "NY", phone: "(518) 489 - 6407", email: "awl40@insulators.org", lat: 42.6511674, lng: -73.754968, address: "890 3rd St, Albany, NY 12206" },
  { id: 50041, name: "HFIAW Local 41", city: "Fort wayne", state: "IN", phone: "(260) 484 - 2834", website: "www.insulators41.com", email: "awl41@insulators.org", lat: 41.0799898, lng: -85.1386015, address: "3626 N Wells St, Ft. Wayne, IN 46808" },
  { id: 50042, name: "HFIAW Local 42", city: "Wilmington", state: "DE", phone: "(302) 328 - 4203", website: "www.local42.org", email: "awl42@insulators.org", lat: 39.7459468, lng: -75.546589, address: "1188 River RD. New Castle, DE 19720" },
  { id: 50045, name: "HFIAW Local 45", city: "Toledo", state: "OH", phone: "(419) 726 - 4683", website: "www.insulatorslocal45.com", email: "awl45@insulators.org", lat: 41.6529143, lng: -83.5378173, address: "4904 N Summit St, Toledo, OH 43611" },
  { id: 50046, name: "HFIAW Local 46", city: "Knoxville", state: "TN", phone: "(865) 524 - 0234", website: "www.insulatorslocal46.com", email: "awl46@insulators.org", lat: 35.9603948, lng: -83.9210261, address: "826 Stewart St, Knoxville, TN, 37917" },
  { id: 50047, name: "HFIAW Local 47", city: "Grand rapids", state: "MI", phone: "(517) 708 - 0665", website: "insulators47.com", email: "awl47@insulators.org", lat: 42.9632425, lng: -85.6678639, address: "16475 Ingersoll Rd, Lansing, MI 48906" },
  { id: 50048, name: "HFIAW Local 48", city: "Atlanta", state: "GA", phone: "(404) 373 - 9866", website: "awl48@insulators.org", email: "www.insulators48.org", lat: 33.7544657, lng: -84.3898151, address: "374 Maynard Terr. SE Ste. 232, Atlanta, GA 30316" },
  { id: 50049, name: "HFIAW Local 49", city: "Duluth", state: "MN", phone: "(218) 624 - 6268", website: "www.insulatorslocal49.org", email: "awl49@insulators.org", lat: 46.7838287, lng: -92.1052679, address: "5771 US Highway 2, Hermantown, MN 55810" },
  { id: 50050, name: "HFIAW Local 50", city: "Columbus & dayton", state: "OH", phone: "(614) 221 - 7177", website: "www.insulators50.org", email: "awl50@insulators.org", lat: 39.7605276, lng: -84.1645115, address: "939 Goodale Blvd. Rm. 210, Columbus, OH 43212" },
  { id: 50051, name: "HFIAW Local 51", city: "Louisville", state: "KY", phone: "(502) 893 - 4040", website: "www.insulators51.org", email: "awl51@insulators.org", lat: 38.2542376, lng: -85.759407, address: "3927 Park Dr, Louisville, KY 40216" },
  { id: 50052, name: "HFIAW Local 52", city: "Oak ridge", state: "TN", phone: "(865) 576 - 4189", email: "awl52@insulators.org", lat: 36.0103562, lng: -84.2696449, address: "3283 Old Highway 63, Speedwell, TN, 37870" },
  { id: 50053, name: "HFIAW Local 53", city: "New orleans", state: "LA", phone: "(504) 468 - 9598", website: "insulators53.org", email: "awl53@insulators.org", lat: 29.9561422, lng: -90.0733934, address: "2001 Veterans Memorial Blvd. Ste. 200, Kenner, LA, 70062" },
  { id: 50055, name: "HFIAW Local 55", city: "Mobile", state: "AL", phone: "(251) 661 - 9703", email: "awl55@insulators.org", lat: 30.6913462, lng: -88.0437509, address: "908 Butler Dr, Mobile AL 36693" },
  { id: 50056, name: "HFIAW Local 56", city: "Wood river", state: "IL", phone: "(217) 556 - 5434", email: "awl56@insulators.org", lat: 38.861159, lng: -90.0976069, address: "716 Springfield Rd, Gillespie, IL 62033" },
  { id: 50060, name: "HFIAW Local 60", city: "Miami", state: "FL", phone: "(305) 681 - 0679", website: "www.unioninsulator.com", email: "awl60@insulators.org", lat: 25.7741566, lng: -80.1935973, address: "13000 NW 47th Ave, Miami, FL, 33054" },
  { id: 50062, name: "HFIAW Local 62", city: "Bremerton", state: "WA", phone: "(360) 562 - 8566", email: "awl62@insulators.org", lat: 47.5653663, lng: -122.6246836, address: "P.O Box 1073, Bremerton, WA 98370" },
  { id: 50063, name: "HFIAW Local 63", city: "Springfield", state: "MO", phone: "(417) 869 - 3632", email: "awl63@insulators.org", lat: 37.2081729, lng: -93.2922715, address: "1938 East Meadowmere St, Springfield, MO 65804" },
  { id: 50064, name: "HFIAW Local 64", city: "Tulsa", state: "OK", phone: "(918) 834 - 1526", email: "awl64@insulators.org", lat: 36.1563122, lng: -95.9927516, address: "4428 E Admiral Pl, Tulsa, OK 74115" },
  { id: 50067, name: "HFIAW Local 67", city: "Tampa", state: "FL", phone: "(813) 659 - 0067", email: "awl67@insulators.org", lat: 27.9449854, lng: -82.4583107, address: "709 South Evers St, Plant City, FL 33563" },
  { id: 50069, name: "HFIAW Local 69", city: "Salt lake city", state: "UT", phone: "(801) 972 - 3945", email: "awl69@insulators.org", lat: 40.7596198, lng: -111.886797, address: "2261 S Redwood Rd., Ste. A, Salt Lake City, UT 84119" },
  { id: 50073, name: "HFIAW Local 73", city: "Phoenix", state: "AZ", phone: "(602) 225 - 0119", website: "www.insulatorslocal73.com", email: "awl73@insulators.org", lat: 33.4484367, lng: -112.074141, address: "13607 North 32nd St. Phoenix, AZ 85032" },
  { id: 50074, name: "HFIAW Local 74", city: "Des moines", state: "IA", phone: "(515) 288 - 0472", website: "www.insulators74.org", email: "awl74@insulators.org", lat: 41.5868654, lng: -93.6249494, address: "2000 WALKER STREET SUITE E, Des Moines, IA 50317" },
  { id: 50075, name: "HFIAW Local 75", city: "South bend", state: "IN", phone: "(574) 282 - 1650", website: "www.insulators75.com", email: "awl75@insulators.org", lat: 41.6833813, lng: -86.2500066, address: "4614 S. Burnett Dr, South Bend, IN 46614" },
  { id: 50076, name: "HFIAW Local 76", city: "Albuquerque", state: "NM", phone: "(505) 266 - 0212", website: "www.insulators76.org", email: "awl76@insulators.org", lat: 35.0841034, lng: -106.650985, address: "422 Adams Street SE, Albuquerque, NM 87108" },
  { id: 50078, name: "HFIAW Local 78", city: "Birmingham", state: "AL", phone: "(205) 956 - 8101", email: "awl78@insulators.org", lat: 33.5206824, lng: -86.8024326, address: "2653 Ruffner Rd. Birmingham, AL 35210" },
  { id: 50080, name: "HFIAW Local 80", city: "Charleston", state: "WV", phone: "(304) 586 - 4780", website: "www.awlu80.com", email: "awl80@insulators.org", lat: 38.3505995, lng: -81.6332812, address: "4998 State Rt. 34, Winfield, WV, 25213" },
  { id: 50081, name: "HFIAW Local 81", city: "Cedar rapids", state: "IA", phone: "(319) 362 - 8233", website: "www.local81insulators.com", email: "awl81@insulators.org", lat: 41.9758872, lng: -91.6704053, address: "4600 46th. Avenue, Rock Island, IL" },
  { id: 50082, name: "HFIAW Local 82", city: "Spokane", state: "WA", phone: "(509) 328 - 5439", email: "awl82@insulators.org", lat: 47.6571934, lng: -117.42351, address: "3919 E Main Ave, Spokane, WA 99202" },
  { id: 50084, name: "HFIAW Local 84", city: "Akron & youngstown", state: "OH", phone: "(330) 346 - 0622", email: "awl84@insulators.org", lat: 41.0814, lng: -81.5190, address: "277 Martinel Dr, Kent, OH 44240" },
  { id: 50086, name: "HFIAW Local 86", city: "Nashville", state: "TN", phone: "(615) 868 - 9411", email: "awl86@insulators.org", lat: 36.1622767, lng: -86.7742984, address: "115 Harris St, Madison, TN 37115" },
  { id: 50087, name: "HFIAW Local 87", city: "San antonio", state: "TX", phone: "(830) 626 - 8088", website: "insulators87.org", email: "awl87@insulators.org", lat: 29.4246002, lng: -98.4951405, address: "497 N Krueger Ave, San Antonio, TX, 78130" },
  { id: 50089, name: "HFIAW Local 89", city: "Trenton & atlantic city", state: "NJ", phone: "(609) 587 - 8905", website: "www.Insulators89.org", email: "awl89@insulators.org", lat: 39.3569331, lng: -74.4606039, address: "1502 South Olden Ave, Trenton, NJ, 08610" },
  { id: 50090, name: "HFIAW Local 90", city: "Memphis", state: "TN", phone: "(901) 386 - 7045", email: "awl90@insulators.org", lat: 35.1460249, lng: -90.0517638, address: "5093 Raleigh Lagrange Rd, Memphis, TN 38134" },
  { id: 50091, name: "HFIAW Local 91", city: "White plains", state: "NY", phone: "(914) 788 - 0400", website: "insulators91.com", email: "awl91@insulators.org", lat: 41.0339862, lng: -73.7629097, address: "59 Sunset Drive, Suite 102A, Briarcliff Manor, NY 10510" },
  { id: 50092, name: "HFIAW Local 92", city: "Columbia", state: "SC", phone: "(803) 637 - 3930", website: "www.local92.org", email: "awl92@insulators.org", lat: 34.000754, lng: -81.0352313, address: "211 Wade Morgan Rd, McCormick, SC 29835" },
  { id: 50094, name: "HFIAW Local 94", city: "Oklahoma city", state: "OK", phone: "(405) 632 - 6767", email: "awl94@insulators.org", lat: 35.4729886, lng: -97.5170536, address: "716 SE 79th St, Oklahoma City, OK 73149" },
  { id: 50096, name: "HFIAW Local 96", city: "Savannah", state: "GA", phone: "(912) 748 - 6282", email: "awl96@insulators.org", lat: 32.0790074, lng: -81.0921335, address: "105 Sharon Ct., Pooler, GA 31322" },
  { id: 50114, name: "HFIAW Local 114", city: "Jackson", state: "MS", phone: "(601) 825 - 3303", email: "awl114@insulators.org", lat: 32.2998686, lng: -90.1830408, address: "PO Box 641, Jackson, MS 39043" },
  { id: 50127, name: "HFIAW Local 127", city: "Appleton", state: "WI", phone: "(715) 823 - 5669", email: "awl127@insulators.org", lat: 44.2613967, lng: -88.4069744, address: "33 East 3rd St, Clintonville, WI, 54929" },
  { id: 50132, name: "HFIAW Local 132", city: "Honolulu", state: "HI", phone: "(808) 521 - 6405", website: "www.insulatorslocal132.org", email: "awl132@insulators.org", lat: 21.304547, lng: -157.855676, address: "1019 Lauia St. Bay #4, Kapolei, HI, 96707" },
  { id: 50133, name: "HFIAW Local 133", city: "Fargo", state: "ND", phone: "(701) 391 - 8894", website: "www.insulators133.org", email: "awl133@insulators.org", lat: 46.877229, lng: -96.789821, address: "2210 E Broadway Ave, Bismark, ND, 58501" },
  { id: 50134, name: "HFIAW Local 134", city: "Portsmouth", state: "NH", phone: "(207) 438 - 1421", email: "awl134@insulators.org", lat: 43.0751306, lng: -70.7601826, address: "PO Box 2052, Portsmouth Naval Shpyard, Portsmouth, NH 03804" },
  { id: 50135, name: "HFIAW Local 135", city: "Las vegas", state: "NV", phone: "(702) 643 - 8645", website: "www.insulators135.com", email: "awl135@insulators.org", lat: 36.1674263, lng: -115.1484131, address: "4316 E Alexander Rd, Las Vegas, NV 59115" },
  { id: 50207, name: "HFIAW Local 207", city: "Regional abatement", state: "US", phone: "(800) 207 - 5622", website: "www.Local207.org", email: "awl207@insulators.org", address: "26453 Northline Rd. Taylor, MI 48180" }
];

const IUEC_LOCALS = [
  { id: 51001, name: "IUEC Local 1", city: "New york", state: "NY", phone: "718-767-7004", website: "www.localoneiuec.com", lat: 40.7127281, lng: -74.0060152, address: "47-24 27th St, Long Island City, NY 11101" },
  { id: 51002, name: "IUEC Local 2", city: "Chicago", state: "IL", phone: "708-907-7770", website: "www.iuec2.com", email: "local2@iuec2.com", lat: 41.8755616, lng: -87.6244212, address: "5860 W 111th St, Chicago Ridge, IL 60415" },
  { id: 51003, name: "IUEC Local 3", city: "St louis", state: "MO", phone: "314-644-3933", website: "www.iueclocal3.org", email: "iueclu3@aol.com", lat: 38.6254063, lng: -90.190009, address: "5916 Wilson Ave, St Louis, MO 63110" },
  { id: 51004, name: "IUEC Local 4", city: "Boston", state: "MA", phone: "617-288-1547", website: "www.iueclocal4.com", email: "local4@iueclocal4.com", lat: 42.3588336, lng: -71.0578303, address: "50 park st, dorchester, ma 02122" },
  { id: 51005, name: "IUEC Local 5", city: "Philadelphia", state: "PA", phone: "215-676-2555", website: "www.iuec5.org", lat: 39.9527237, lng: -75.1635262, address: "12273 Townsend Rd, Philadelphia, PA 19154" },
  { id: 51006, name: "IUEC Local 6", city: "Pittsburgh", state: "PA", phone: "412-341-6666", website: "iueclocal6.org", lat: 40.4406968, lng: -80.0025666, address: "1601 Banksville RD, 2nd floor, pittsburgh PA 15216" },
  { id: 51007, name: "IUEC Local 7", city: "Baltimore", state: "MD", phone: "410-661-1491", website: "www.iuec7.com", email: "iueclocal7@aol.com", lat: 39.2908816, lng: -76.610759, address: "3743 Old Georgetown TD, Halethorpe, MD 21227" },
  { id: 51008, name: "IUEC Local 8", city: "San francisco", state: "CA", phone: "415-285-2900", website: "www.iuec8.org", email: "info@iuec8.org", lat: 37.7879363, lng: -122.4075201, address: "690 Potrero Ave, San Francisco, CA 94110" },
  { id: 51009, name: "IUEC Local 9", city: "Minneapolis", state: "MN", phone: "651-287-0817", website: "www.local9.com", email: "iuec9@local9.com", lat: 44.9772995, lng: -93.2654692, address: "433 Little Canada Road E, Little Canada, MN 55117" },
  { id: 51010, name: "IUEC Local 10", city: "Washington", state: "WA", phone: "301-459-0497", website: "www.iueclocal10.org", email: "joconnor@iuec.org", lat: 45.5825711, lng: -122.3509593, address: "9600 Martin Luther King Highway, Lanham, MD 20706" },
  { id: 51011, name: "IUEC Local 11", city: "Cincinnati", state: "OH", phone: "513-761-4787", website: "iuec11.org", email: "iueclocal11@gmail.com", lat: 39.1014537, lng: -84.5124602, address: "360 S. Wayne Ave, Cincinnati, OH 45215" },
  { id: 51012, name: "IUEC Local 12", city: "Kansas city", state: "KS", phone: "816-358-1312", website: "www.iuec12.com", email: "iuec@iuecl2.com", lat: 39.1134562, lng: -94.626497, address: "6320 Manchester Ave, STE 44, Kansas City, MO 64133" },
  { id: 51014, name: "IUEC Local 14", city: "Buffalo", state: "NY", phone: "716-833-5528", website: "iueclocal14.com", email: "iueclocal14vflo@aol.com", lat: 42.8864163, lng: -78.8781493, address: "3527 Harlen RD, STE. 10, Buffalo, NY 14225" },
  { id: 51015, name: "IUEC Local 15", city: "Milwaukee", state: "WI", phone: "262-786-9982", website: "www.iuec15.com", email: "iuec15@iuec15.com", lat: 43.0386475, lng: -87.9090751, address: "17125 W. Cleveland Ave, New Berlin, WI 53151" },
  { id: 51016, name: "IUEC Local 16", city: "New orleans", state: "LA", phone: "504-889-1103", website: "iueclocal16.org", email: "local16@iuec16.org", lat: 29.9561422, lng: -90.0733934, address: "2540 Severn Ave, STE 105, Metairie, LA 70002" },
  { id: 51017, name: "IUEC Local 17", city: "Cleveland", state: "OH", phone: "216-431-8088", website: "iueclocal17.org", email: "iueclocal17@neohio.twcbc.com", lat: 41.4996574, lng: -81.6936772, address: "3250 Euclid Ave, STE 240, Cleveland, OH 44115" },
  { id: 51018, name: "IUEC Local 18", city: "Los angeles", state: "CA", phone: "626-449-1869", website: "iuec18.org", email: "tony@iuec18.org", lat: 34.0536909, lng: -118.242766, address: "2011 E. Financial Way, Glendora, CA 91741" },
  { id: 51019, name: "IUEC Local 19", city: "Seattle", state: "WA", phone: "206-282-4885", website: "www.iuec19.org", email: "theoffice@iuec.org", lat: 47.6038321, lng: -122.330062, address: "2264 15th Ave W, Seattle, WA 98119" },
  { id: 51020, name: "IUEC Local 20", city: "Louisville", state: "KY", phone: "502-231-0136", website: "iueclocal20.org", email: "iuec.louisville@yahoo.com", lat: 38.2542376, lng: -85.759407, address: "7711 Beulah Church Road, Louisville KY 40228" },
  { id: 51021, name: "IUEC Local 21", city: "Dallas", state: "TX", phone: "817-635-0680", website: "www.iueclocal21.org", email: "iuec21@aol.com", lat: 32.7762719, lng: -96.7968559, address: "1924 Baird Farm Road, STE 101, Arlington, TX 76006" },
  { id: 51023, name: "IUEC Local 23", city: "Portland", state: "OR", phone: "503-252-5852", website: "www.iuec23.org", email: "iueclocal23@comcast.net", lat: 45.5202471, lng: -122.674194, address: "12067 NE Glenn Widing Dr, STE 108, Portland, OR 97220" },
  { id: 51024, name: "IUEC Local 24", city: "Birmingham", state: "AL", phone: "205-591-4185", website: "iueclocal24.org", email: "bruce.local24@gmail.com", lat: 33.5206824, lng: -86.8024326, address: "5221 1st Ave N, Birmingham, AL 35212" },
  { id: 51025, name: "IUEC Local 25", city: "Denver", state: "CO", phone: "303-937-8039", website: "www.iuec25.org", email: "mike@iuec25.org", lat: 39.7392364, lng: -104.984862, address: "3025 W. Hampden Ave, Sheridan, CO 80110" },
  { id: 51027, name: "IUEC Local 27", city: "Rochester", state: "NY", phone: "585-436-6440", website: "iueclocal27.org", email: "local27@frontiernet.net", lat: 43.157285, lng: -77.615214, address: "244 Pal Road, STE 3, Rochester, NY 14624" },
  { id: 51028, name: "IUEC Local 28", city: "Omaha", state: "NE", phone: "402-734-7632", email: "iueclocal28@gmail.com", lat: 41.2587459, lng: -95.9383758, address: "3333 South 24th Street, STE 1, Omaha, NE 68108" },
  { id: 51030, name: "IUEC Local 30", city: "Memphis", state: "TN", phone: "901-345-6233", website: "iueclocal30.org", email: "iuec30@outlook.com", lat: 35.1460249, lng: -90.0517638, address: "3089 Directors Row, Memphis, TN 38131" },
  { id: 51031, name: "IUEC Local 31", city: "Houston", state: "TX", phone: "713-926-9678", website: "www.iuec31.org", email: "iueclocal31@iuec31.org", lat: 29.7589382, lng: -95.3676974, address: "201 Broadway St, Houston, TX 77012" },
  { id: 51032, name: "IUEC Local 32", city: "Atlanta", state: "GA", phone: "404-378-6208", website: "www.iueclocal32.org", email: "iuec32@aol.com", lat: 33.7544657, lng: -84.3898151, address: "1492 Blair Bridge RD, Austell, GA 30168" },
  { id: 51033, name: "IUEC Local 33", city: "Des moines", state: "IA", phone: "515-262-0120", website: "www.iuec33.com", email: "iueclu33@aol.com", lat: 41.5868654, lng: -93.6249494, address: "2000 WALKER STREET SUITE E, Des Moines, IA 50317" },
  { id: 51034, name: "IUEC Local 34", city: "Indianapolis", state: "IN", phone: "317-536-8173", website: "www.iuec34.org", email: "iuec34@yahoo.com", lat: 39.7683331, lng: -86.1583502, address: "2206 E. Werges Ave, Indianapolis, IN 46237" },
  { id: 51035, name: "IUEC Local 35", city: "Albany", state: "NY", phone: "518-438-2487", website: "iueclocal35.org", email: "iuec35@aol.com", lat: 42.6511674, lng: -73.754968, address: "890 3rd St, Albany, NY 12206" },
  { id: 51036, name: "IUEC Local 36", city: "Detroit", state: "MI", phone: "313-961-0717", email: "local36@iuec36.org", lat: 42.3315509, lng: -83.0466403, address: "1640 Porter St, Detroit, MI 48216" },
  { id: 51037, name: "IUEC Local 37", city: "Columbus", state: "OH", phone: "614-291-5859", website: "iueclocal37.org", email: "iueclocal37@gmail.com", lat: 39.9622601, lng: -83.0007065, address: "2128 Leonard Ave, Columbus, OH 43219" },
  { id: 51038, name: "IUEC Local 38", city: "Salt lake city", state: "UT", phone: "801-467-1051", website: "www.iuec38.org", email: "local38admin@iuec38.org", lat: 40.7596198, lng: -111.886797, address: "139 South 1400 West, Salt Lake City, UT 84104" },
  { id: 51039, name: "IUEC Local 39", city: "Providence", state: "RI", phone: "(401) 391-0239", website: "iueclocal39.org", email: "iueclocal39@gmail.com", lat: 41.8239891, lng: -71.4128343, address: "555 Jefferson BLVD STE 5A, Warwick, RI 02886" },
  { id: 51041, name: "IUEC Local 41", city: "Springfield", state: "MA", phone: "413-732-4032", website: "www.iuec41.com", email: "bm@iuec41.com", lat: 42.1018764, lng: -72.5886727, address: "640 Page BLVD, STE 104, Springfield, MA 01104" },
  { id: 51044, name: "IUEC Local 44", city: "Toledo", state: "OH", phone: "419-242-7902", website: "www.iuec44.org", email: "iuec44@aol.com", lat: 41.6529143, lng: -83.5378173, address: "2300 Ashland Ave, Room 206, Toledo, OH 43620" },
  { id: 51045, name: "IUEC Local 45", city: "Akron", state: "OH", phone: "330-474-7753", website: "iueclocal45.org", email: "ronjohnsoniueclocal45@gmail.com", lat: 41.083064, lng: -81.518485, address: "277 Martinel Dr, Kent, OH 44240" },
  { id: 51048, name: "IUEC Local 48", city: "Charleston", state: "WV", phone: "304-343-8345", website: "iuec48.org/about-us", email: "iuec48@frontier.com", lat: 38.3505995, lng: -81.6332812, address: "717 Lee St E, Odd Fellows BLDG, Room 201, Charleston, WV 25301" },
  { id: 51049, name: "IUEC Local 49", city: "Jacksonville", state: "FL", phone: "904-353-2570", website: "www.iuec49.org", email: "local49@comcast.net", lat: 30.3262247, lng: -81.6579179, address: "1416 E. 14th St, Jacksonville, FL 32206" },
  { id: 51050, name: "IUEC Local 50", city: "Toronto", state: "CA", phone: "416-754-2424", website: "iuec50.org", email: "iuec50@iuec50.ca", lat: 43.6534817, lng: -79.3839347, address: "400 Westney Road South, Ajax, ON, Canada L1S 6M6" },
  { id: 51051, name: "IUEC Local 51", city: "Richmond", state: "VA", phone: "804-723-5871", website: "iueclocal51.org", email: "iuec_51@comcast.net", lat: 37.5385087, lng: -77.43428, address: "8052 Elm Dr, STE N, Mechanicsville, VA 23111" },
  { id: 51052, name: "IUEC Local 52", city: "Norfolk", state: "VA", phone: "757-588-4338", website: "iueclocal52.org", email: "iuec52@iuec.hrcoxmail.com", lat: 36.8493695, lng: -76.2899539, address: "4976 Euclid Road, Virginia Beach, VA 23462" },
  { id: 51055, name: "IUEC Local 55", city: "Peoria", state: "IL", phone: "309-671-5085", website: "iueclocal55.org", email: "iueclocal55@currently.com", lat: 40.6938609, lng: -89.5891008, address: "400 NE Jefferson, STE 310, Peoria, IL 61603" },
  { id: 51059, name: "IUEC Local 59", city: "Harrisburg", state: "PA", phone: "717-564-2749", website: "iueclocal59.org", email: "ron@iuec59@comcastbiz.net", lat: 40.2663107, lng: -76.8861122, address: "2163 Berryhill St, Harrisburg, PA 17104" },
  { id: 51062, name: "IUEC Local 62", city: "Syracuse", state: "NY", phone: "315-422-5219", website: "iueclocal62.org", email: "iuec62@hotmail.com", lat: 43.0481221, lng: -76.1474244, address: "615 W. Genesee St, Syracuse, NY 13204" },
  { id: 51063, name: "IUEC Local 63", city: "Oklahoma city", state: "OK", phone: "405-521-9385", website: "iueclocal63.org", email: "jwilliams.iuec@gmail.com", lat: 35.4729886, lng: -97.5170536, address: "3815 N. Santa Fe Ave, STE 126, Oklahoma City, OK 73118" },
  { id: 51071, name: "IUEC Local 71", city: "Miami", state: "FL", phone: "305-633-3193", website: "www.iuec71.org", email: "local71@iuec71.org", lat: 25.7741566, lng: -80.1935973, address: "1909 Tyler St, STE 603, Hollywood, FL 33020" },
  { id: 51074, name: "IUEC Local 74", city: "Tampa", state: "FL", phone: "813-988-0950", website: "www.iuec74.org", email: "local74@gte.net", lat: 27.9449854, lng: -82.4583107, address: "7805 Professional Place, Tampa, FL 33637" },
  { id: 51079, name: "IUEC Local 79", city: "Little rock", state: "AR", phone: "501-372-3601", website: "iueclocal79.org", email: "lonnie.iueclocal79@gmail.com", lat: 34.7465071, lng: -92.2896267, address: "5103 N. Locust St, North Little Rock, AR 72116" }
,
  { id: 51080, name: "IUEC Local 80", city: "Greensboro", state: "NC", phone: "919-596-6172", website: "www.iueclocal80.org", email: "iuec80@cs.com", lat: 36.1086977, lng: -80.1951537, address: "PO BOX 387, Hillborough, NC 27278" },
  { id: 51081, name: "IUEC Local 81", city: "San antonio", state: "TX", phone: "210-226-1942", website: "iueclocal81.org", email: "iueclocal81@aol.com", lat: 29.486506, lng: -98.5268717, address: "1946 La Manda BLVD, San Antonio, TX 78201" },
  { id: 51082, name: "IUEC Local 82", city: "Vancouver", state: "BC", phone: "604-293-1281", website: "www.iueclocal82.com", email: "admin@iueclocal82.com", lat: 49.2608724, lng: -123.113952, address: "#3138-585 Seaborne Ave, Port Coquitlam, Canada" },
  { id: 51083, name: "IUEC Local 83", city: "Tulsa", state: "OK", phone: "918-587-1662", website: "iueclocal83.org", email: "tulsalocal83@gmail.com", lat: 36.1563122, lng: -95.9927516, address: "3200 S. Elm Place, Suite 104, Broken Arrow, OK 74012" },
  { id: 51084, name: "IUEC Local 84", city: "Reading", state: "PA", phone: "570-849-0020", website: "iueclocal84.org", email: "iuec84rl@gmail.com", lat: 40.8165215, lng: -75.6722888, address: "101 Centre St, Parryville, PA 18244" },
  { id: 51085, name: "IUEC Local 85", city: "Lansing", state: "MI", phone: "517-882-0100", website: "iuec85.org", email: "mike@iuec85.org", lat: 42.7338254, lng: -84.5546295, address: "15964 S. Old US 27, Lansing, MI 48906" },
  { id: 51089, name: "IUEC Local 89", city: "Montreal", state: "BC", phone: "514-843-6678", website: "www.iueclocal89.org", email: "admin@iueclocal89.org", lat: 45.5031824, lng: -73.5698065, address: "99 Avenue LaFleur, Lasalle, Canada H8R 3G8" },
  { id: 51090, name: "IUEC Local 90", city: "Hamilton ontario", state: "BC", phone: "905-383-9166", website: "iuec90.com", email: "local90@iuec90.com", lat: 43.2560802, lng: -79.8728583, address: "300 Fennell Ave E, Hamilton Ontarior, Canada L9A 1T2" },
  { id: 51091, name: "IUEC Local 91", city: "New haven", state: "CT", phone: "860-289-8689", website: "iueclocal91.org", email: "iuec91br@sbcglobal.net", lat: 41.3082138, lng: -72.9250518, address: "914 Main St. Room 203, E. Hardford, CT 06108" },
  { id: 51093, name: "IUEC Local 93", city: "Nashville", state: "TN", phone: "615-889-0001", website: "www.iueclocal93.org", lat: 36.2993569, lng: -86.7034648, address: "312 Bluebird Dr, Goodlettsville, TN 37072" },
  { id: 51096, name: "IUEC Local 96", city: "Ottawa", state: "BC", phone: "613-228-3415", website: "iuec96.com", lat: 45.4208777, lng: -75.6901106, address: "#103-21 Antares Dr, Ottawa, Canada K2E 7T8" },
  { id: 51101, name: "IUEC Local 101", city: "Quebec", state: "BC", phone: "418-628-1011", website: "iueclocal101.com", email: "iueclocal101@bellnet.ca", lat: 52.4760892, lng: -71.8258668, address: "1173 Boul. Charest Ouest, STE 200, Quebec, Canada" },
  { id: 51102, name: "IUEC Local 102", city: "Winnipeg", state: "BC", phone: "204-774-5641", website: "ceiep-program.com/winnipeg-iuec-102", email: "elevatorconstructors@gmail.com", lat: 49.8955367, lng: -97.1384584, address: "225 Watt St, Winnipeg, Canada R2L 1S6" },
  { id: 51122, name: "IUEC Local 122", city: "Edmonton", state: "BC", phone: "780-486-4832", website: "www.iuec122.ca", lat: 53.5462055, lng: -113.491241, address: "10567 - 114 St, Edmonton, Canada T5H 3J6" },
  { id: 51124, name: "IUEC Local 124", city: "Mobile", state: "AL", phone: "850-449-9840", website: "www.iuec124.com", email: "iuec124@yahoo.com", lat: 30.6913462, lng: -88.0437509, address: "PO BOX 10792, Pensacola, FL 32524" },
  { id: 51125, name: "IUEC Local 125", city: "Halifax", state: "BC", phone: "902-450-5067", website: "ceiep-program.com/nova-scotia-iuec-125", email: "iuec125@outlook.com", lat: 44.648618, lng: -63.5859487, address: "14 McQuade Lake Cr. STE 102, Halifax, canada" },
  { id: 51126, name: "IUEC Local 126", city: "Honolulu", state: "HI", phone: "808-536-8653", website: "www.iuec126.org/index.cfm", email: "office@iuec126.org", lat: 21.304547, lng: -157.855676, address: "50 S. Beretania St, C211-E, Honolulu, HI 96813" },
  { id: 51130, name: "IUEC Local 130", city: "Calgary", state: "BC", phone: "403-214-1028", website: "www.iueclocal130.ca", email: "info@iuec130.com", lat: 51.0456064, lng: -114.057541, address: "60 Commercial Drive, Calgary, Canada T3Z 2A7" },
  { id: 51131, name: "IUEC Local 131", city: "Albuquerque", state: "NM", phone: "505-292-8715", website: "iueclocal131.org", email: "iueclocal131@comcast.net", lat: 35.0841034, lng: -106.650985, address: "2835 Pan American FWY NE, STE F, Albuquerque, NM 87107" },
  { id: 51132, name: "IUEC Local 132", city: "Madison", state: "WI", phone: "608-630-9288", website: "www.iuec132.com", email: "iuec132@tds.net", lat: 43.1273034, lng: -89.2956186, address: "2102 E. Springs Drive, Madison, WI 53704" },
  { id: 51133, name: "IUEC Local 133", city: "Austin", state: "TX", phone: "512-478-9950", website: "iueclocal133.com", email: "union@iueclocal133.com", lat: 30.5230499, lng: -97.7050987, address: "1910 Sam Bass RD, Round Rock, TX 78681" },
  { id: 51135, name: "IUEC Local 135", city: "Charlotte", state: "NC", phone: "980-949-7248", website: "www.iueclocal135.org", email: "iuec135@outlook.com", lat: 35.1787301, lng: -80.9310565, address: "1900 Cross Beam Drive, Charlotte, NC 28217" },
  { id: 51138, name: "IUEC Local 138", city: "Poughkeepsie", state: "NY", phone: "845-471-6181", website: "iuec.org", lat: 41.7065539, lng: -73.9283672, address: "25 Market St, STE 401, Poughkeepsie, NY 12601" },
  { id: 51139, name: "IUEC Local 139", city: "Orlando", state: "FL", phone: "407-291-7808", website: "www.iueclocal139.com", email: "iueclocal139@bellsouth.net", lat: 28.5421218, lng: -81.379045, address: "451 E. Airport BLVD, Sandord, FL 32773" },
  { id: 51140, name: "IUEC Local 140", city: "Phoenix", state: "AZ", phone: "602-273-0025", website: "www.iuec140.com", email: "azec@iuec140.com", lat: 33.480241, lng: -112.0145764, address: "3111 E. Thomas RD, Phoenix, AZ 85016" },
  { id: 51141, name: "IUEC Local 141", city: "San juan", state: "Puerto Rico", phone: "787-208-5063", website: "iueclocal141.org", email: "annie.losgladiadores@outlook.com", lat: 18.3842391, lng: -66.05344, address: "RR7, Box 7372, San Juan, Puerto Rico 00926" }
];

const IUOE_LOCALS = [
  { id: 92000, name: "IUOE Local 320", city: "Tuscumbia", state: "AL", phone: "(256) 764-6991", website: "www.iuoe.org/find-an-iuoe-local-union/local-320-tuscumbia", lat: 34.7318811, lng: -87.7028627, address: "22115 Highway 72 W, Tuscumbia, Alabama 35674" },
  { id: 91200, name: "IUOE Local 312", city: "Bessemer", state: "AL", phone: "205-424-9670", website: "www.iuoe.org/find-an-iuoe-local-union/local-312-bessemer", lat: 33.373615, lng: -86.9151454, address: "1751 Highway 150, Bessemer, Alabama 35022" },
  { id: 125300, name: "IUOE Local 653", city: "Mobile", state: "AL", phone: "(251) 432-3328", website: "www.iuoe.org/find-an-iuoe-local-union/local-653-mobile", lat: 30.7004307, lng: -88.1128719, address: "801 Springhill Ave, Mobile, Alabama 36602" },
  { id: 90200, name: "IUOE Local 302 (Fairbanks)", city: "Fairbanks", state: "AK", phone: "(907) 452-8131", website: "www.iuoe302.org", lat: 64.8194109, lng: -147.7449084, address: ", 3002 Lathrop St, Fairbanks, Alaska 99701" },
  { id: 90201, name: "IUOE Local 302 (Anchorage)", city: "Anchorage", state: "AK", phone: "(907) 561-5288", website: "www.iuoe302.org", lat: 61.2163129, lng: -149.894852, address: "4001 Denali Street, Suite A, Anchorage, Alaska 99503" },
  { id: 90202, name: "IUOE Local 302 (Juneau)", city: "Juneau", state: "AK", phone: "(907) 586-3850", website: "www.iuoe302.org", lat: 58.3019613, lng: -134.4196751, address: ", 9309 Glacier Hwy Bldng A Suite 105, Juneau, Alaska 99801" },
  { id: 155500, name: "IUOE Local 955", city: "Edmonton", state: "US", phone: "(780) 483-0955", website: "www.oe955.com", lat: 53.5462055, lng: -113.491241, address: ", 17603 114th Avenue, Edmonton, Alberta T5S2R9" },
  { id: 110100, name: "IUOE Local 501 (Phoenix)", city: "Phoenix", state: "AZ", phone: "(213) 385-1561", website: "local501.org", lat: 33.4484367, lng: -112.074141, address: ", 6601 N Black Cyn Hwy, Phoenix, Arizona 85015" },
  { id: 122400, name: "IUOE Local 624 (Little Rock)", city: "Little rock", state: "AR", phone: "(601) 353-3914", website: "www.iuoe624.com", lat: 34.6947514, lng: -92.326972, address: ", 4501 West 61st Street, Little Rock, Arkansas 72209" },
  { id: 95100, name: "IUOE Local 351 (El Dorado)", city: "El dorado", state: "AR", phone: "(870) 639-1154", website: "local351.com", lat: 33.1837546, lng: -92.63502, address: ", 3597 Junction City HWY, El Dorado, Arkansas 71730" },
  { id: 155900, name: "IUOE Local 959", city: "Williams lake", state: "BC", phone: "(250) 398-3357", website: "iuoe959.weebly.com", lat: 52.1279001, lng: -122.1438854, address: ", 301-35 S 2nd Avenue, Williams Lake, British Columbia V2G3W3" },
  { id: 156300, name: "IUOE Local 963", city: "Vancouver", state: "BC", phone: "(604) 876-6287", website: "www.iuoe963.ca", lat: 49.240842, lng: -123.087008, address: ", 707 Durward Ave., Vancouver, British Columbia V5V 2Y9" },
  { id: 60300, name: "IUOE Local 3 (Burlingame)", city: "Burlingame", state: "CA", phone: "(650) 652-7969", website: "www.oe3.org", lat: 37.5780965, lng: -122.3473099, address: ", 828 Mahler Road Suite B, Burlingame, California 94010" },
  { id: 61200, name: "IUOE Local 12 (San Diego)", city: "San diego", state: "CA", phone: "(858) 427-8788", website: "www.local12.org", lat: 32.824537, lng: -117.1209085, address: ", 4811 Viewridge Avenue, San Diego, California 92123" },
  { id: 61201, name: "IUOE Local 12 (Palm Desert)", city: "Palm desert", state: "CA", phone: "(760) 779-0299", website: "www.local12.org", lat: 33.7288179, lng: -116.382571, address: "41-865 Boardwalk Suite 114, Palm Desert, California 92211" },
  { id: 61202, name: "IUOE Local 12 (Redlands)", city: "Redlands", state: "CA", phone: "(909) 307-8700", website: "www.local12.org", lat: 34.0702422, lng: -117.2098861, address: ", 1647 West Lugonia Ave, Redlands, California 92374" },
  { id: 61203, name: "IUOE Local 12 (Anaheim)", city: "Anaheim", state: "CA", phone: "(714) 827-4591", website: "www.local12.org", lat: 33.8173832, lng: -118.0055903, address: ", 3311 West Ball Road, Anaheim, California 92804" },
  { id: 110101, name: "IUOE Local 501 (Los Angeles)", city: "Los angeles", state: "CA", phone: "(213) 385-1561", website: "www.local501.org", lat: 34.0536909, lng: -118.242766, address: "2405 West Third St, Los Angeles, California 90057" },
  { id: 61204, name: "IUOE Local 12 (Pasadena)", city: "Pasadena", state: "CA", phone: "(626) 792-8900", website: "www.local12.org", lat: 34.1511851, lng: -118.1477167, address: ", 150 East Corson Street, Pasadena, California 91103" },
  { id: 61205, name: "IUOE Local 12 (Lancaster)", city: "Lancaster", state: "CA", phone: "(661) 942-1175", website: "www.local12.org", lat: 34.6981064, lng: -118.1366153, address: ", 1051 West Columbia Way Avenue M 206, Lancaster, California 93534" },
  { id: 61206, name: "IUOE Local 12 (Ventura)", city: "Ventura", state: "CA", phone: "(805) 643-8740", website: "www.local12.org", lat: 34.258791, lng: -119.23272, address: ", 1501 Goodyear Ave, Ventura, California 93003" },
  { id: 61207, name: "IUOE Local 12 (Bakersfield)", city: "Bakersfield", state: "CA", phone: "(661) 325-9491", website: "www.local12.org", lat: 35.390315, lng: -118.9998865, address: "120 Bernard St, Bakersfield, California 93305" },
  { id: 60301, name: "IUOE Local 3 (Clovis)", city: "Clovis", state: "CA", phone: "(559) 229-4083", website: "www.oe3.org", lat: 36.808672, lng: -119.685584, address: ", 1635 Shaw Ave., Clovis, California 93611" },
  { id: 63900, name: "IUOE Local 39 (Fresno)", city: "Fresno", state: "CA", phone: "(559) 233-0839", website: "www.local39.org", lat: 36.8127538, lng: -119.8771521, address: ", 4644 W Jacquelyn Ave, Fresno, California 93722" },
  { id: 60302, name: "IUOE Local 3 (Morgan Hill)", city: "Morgan hill", state: "CA", phone: "(408) 465-8260", website: "www.oe3.org", lat: 37.1376932, lng: -121.6579932, address: ", 325 Digital Drive, Morgan Hill, California 95037-2878" },
  { id: 60303, name: "IUOE Local 3 (San Jose)", city: "San jose", state: "CA", phone: "(408) 289-9691", website: "www.oe3.org", lat: 37.3361663, lng: -121.890591, address: ", 1654 The Alameda Suite 110, San Jose, California 95126" },
  { id: 63901, name: "IUOE Local 39 (Santa Clara)", city: "Santa clara", state: "CA", phone: "(408) 269-3939", website: "www.local39.org", lat: 37.3631348, lng: -121.9401949, address: "415 Mathew St, Santa Clara, California 95050" },
  { id: 63902, name: "IUOE Local 39 (San Francisco)", city: "San francisco", state: "CA", phone: "(415) 861-1135", website: "www.local39.org", lat: 37.767372, lng: -122.422021, address: ", 337 Valencia St, San Francisco, California 94103" },
  { id: 60304, name: "IUOE Local 3 (Stockton)", city: "Stockton", state: "CA", phone: "(209) 943-2332", website: "www.oe3.org", lat: 37.9577016, lng: -121.290779, address: ", 1916 North Broadway, Stockton, California 95205" },
  { id: 60305, name: "IUOE Local 3 (Concord)", city: "Concord", state: "CA", phone: "(510) 748-7400", website: "www.oe3.org", lat: 37.973813, lng: -122.023102, address: ", 3000 Clayton Rd., Concord, California 94519" },
  { id: 60306, name: "IUOE Local 3 (Fairfield)", city: "Fairfield", state: "CA", phone: "(707) 429-5008", website: "www.oe3.org", lat: 38.2367485, lng: -122.0791565, address: ", 2540 North Watney Way, Fairfield, California 94533" },
  { id: 60307, name: "IUOE Local 3 (Rohnert Park)", city: "Rohnert park", state: "CA", phone: "(707) 585-2487", website: "www.oe3.org", lat: 38.3396367, lng: -122.701098, address: ", 6225 State Farm Drive Suite 100, Rohnert Park, California 94928" },
  { id: 60308, name: "IUOE Local 3 (Sacramento)", city: "Sacramento", state: "CA", phone: "(916) 993-2058", website: "www.oe3.org", lat: 38.6415605, lng: -121.4905635, address: ", 3920 Lennane Dr., Sacramento, California 95834" },
  { id: 63903, name: "IUOE Local 39 (Auburn)", city: "Auburn", state: "CA", phone: "(530) 823-7736", website: "www.local39.org", lat: 38.8945939, lng: -121.0739897, address: ", 3272 Fortune Ct, Auburn, California 95602" },
  { id: 60309, name: "IUOE Local 3 (Yuba City)", city: "Yuba city", state: "CA", phone: "(530) 743-7321", website: "www.oe3.org", lat: 39.1404477, lng: -121.6169108, address: ", 468 Century Park Drive, Yuba City, California 95991" },
  { id: 63904, name: "IUOE Local 39 (Red Bluff)", city: "Red bluff", state: "CA", phone: "(530) 528-0460", website: "www.local39.org", lat: 40.1786239, lng: -122.2190646, address: ", 285 Sale Ln, Red Bluff, California 96080" },
  { id: 60310, name: "IUOE Local 3 (Redding)", city: "Redding", state: "CA", phone: "(530) 222-6093", website: "www.oe3.org", lat: 40.5863563, lng: -122.391675, address: "20308 Engineers Lane, Redding, California 96002" },
  { id: 60311, name: "IUOE Local 3 (Eureka)", city: "Eureka", state: "CA", phone: "(707) 443-7328", website: "www.oe3.org", lat: 40.8018746, lng: -124.1707558, address: ", 1330 Bayshore Way Suite 103, Eureka, California 95501" },
  { id: 60900, name: "IUOE Local 9", city: "Denver", state: "CO", phone: "(303) 623-3194", website: "www.iuoelocal9.com", lat: 39.7318554, lng: -105.000052, address: ", 990 Kalamath St., Denver, Colorado 80204" },
  { id: 60100, name: "IUOE Local 1", city: "Broomfield", state: "CO", phone: "(303) 433-8482", website: "www.iuoelocal1.org", lat: 39.9216582, lng: -105.1019804, address: ", 2851 Industrial Lane, Broomfield, Colorado 80020" },
  { id: 63000, name: "IUOE Local 30 (Norwich)", city: "Norwich", state: "CT", phone: "(718) 847-8484", website: "www.iuoelocal30.org", lat: 41.5244044, lng: -72.0773206, address: ", 114 Main Street, Norwich, Connecticut 06360" },
  { id: 107800, name: "IUOE Local 478", city: "Hamden", state: "CT", phone: "(203) 288-9261", website: "local478.org", lat: 41.3647439, lng: -72.922002, address: ", 1965 Dixwell Avenue, Hamden, Connecticut 06514" },
  { id: 114200, name: "IUOE Local 542 (Townsend)", city: "Townsend", state: "DE", phone: "(302) 449-1915", website: "www.iuoe542.com", lat: 39.3951115, lng: -75.6915973, address: ", 4268 North Dupont Highway, Townsend, Delaware 19734" },
  { id: 127300, name: "IUOE Local 673", city: "Jacksonville", state: "FL", phone: "(904) 783-6181", website: "iuoe673.org", lat: 30.3167013, lng: -81.7905049, address: ", 8366 Devoe Street, Jacksonville, Florida 32220" },
  { id: 108700, name: "IUOE Local 487", city: "Miami", state: "FL", phone: "(305) 634-3419", website: "www.iuoe487.org", lat: 25.809898, lng: -80.2204683, address: ", 1425 NW 36th Street, Miami, Florida 33142" },
  { id: 152600, name: "IUOE Local 926", city: "Rex", state: "GA", phone: "(770) 474-5926", website: "www.iuoe926.org", lat: 33.5920544, lng: -84.2699218, address: ", 6521 Dale Road, Rex, Georgia 30273" },
  { id: 107400, name: "IUOE Local 474", city: "Pooler", state: "GA", phone: "(912) 330-9928", website: "iuoe474.org", lat: 32.1056416, lng: -81.2219677, address: ", 127 Westside Blvd., Pooler, Georgia 31322" },
  { id: 60312, name: "IUOE Local 3 (Kapolei)", city: "Kapolei", state: "HI", phone: "(808) 845-7871", website: "www.oe3.org", lat: 21.3182888, lng: -158.0931997, address: ", 2181 Lauwiliwili Street, Kapolei, Hawaii 96707" },
  { id: 90203, name: "IUOE Local 302 (Pocatello)", city: "Pocatello", state: "ID", phone: "(208) 232-8492", website: "www.iuoe302.org", lat: 42.8622127, lng: -112.4525216, address: ", 456 N. Arthur, Pocatello, Idaho 83204" },
  { id: 90204, name: "IUOE Local 302 (Boise)", city: "Boise", state: "ID", phone: "(208) 890-7774", website: "www.iuoe302.org", lat: 43.6166163, lng: -116.200886, address: ", 225 N 16th ST Suite 211, Boise, Idaho 83702" },
  { id: 91800, name: "IUOE Local 318", city: "Marion", state: "IL", phone: "(618) 993-0318", website: "iuoelocal318.com/about", lat: 37.7409352, lng: -88.9851677, address: "3310 Water Tower Road, Marion, Illinois 62959" },
  { id: 112000, name: "IUOE Local 520", city: "Granite city", state: "IL", phone: "(618) 931-0500", website: "www.oe520.org", lat: 38.7014389, lng: -90.1487199, address: ", 520 Engineer Road, Granite City, Illinois 62040" },
  { id: 156500, name: "IUOE Local 965", city: "Springfield", state: "IL", phone: "(217) 528-9659", website: "www.iuoe965.org", lat: 39.7932726, lng: -89.6015488, address: "3520 East Cook Street, Springfield, Illinois 62703" },
  { id: 144100, name: "IUOE Local 841 (Oakwood)", city: "Oakwood", state: "IL", phone: "(217) 354-4858", website: "www.iuoelocal841.com", lat: 40.1075653, lng: -87.7780629, address: "616 South Oakwood, Oakwood, Illinois 61858" },
  { id: 124900, name: "IUOE Local 649", city: "Peoria", state: "IL", phone: "(309) 697-0070", website: "iuoe649.org", lat: 40.6887265, lng: -89.6947435, address: ", 6408 West Plank Road, Peoria, Illinois 61604" },
  { id: 75000, name: "IUOE Local 150 (Countryside)", city: "Countryside", state: "IL", phone: "(708) 482-8800", website: "local150.org", lat: 41.7769353, lng: -87.8715576, address: ", 6200 Joliet Road, Countryside, Illinois 60525" },
  { id: 99900, name: "IUOE Local 399", city: "Chicago", state: "IL", phone: "(312) 372-9870", website: "www.iuoe399.org", lat: 41.8508471, lng: -87.6408897, address: ", 2260 S. Grove St., Chicago, Illinois 60616" },
  { id: 78100, name: "IUOE Local 181 (Evansville)", city: "Evansville", state: "IN", phone: "(812) 474-1811", website: "www.iuoelocal181.org", lat: 37.970495, lng: -87.5715641, address: "6500 Interchange Road, N, Evansville, Indiana 47715" },
  { id: 144101, name: "IUOE Local 841 (Terre Haute)", city: "Terre haute", state: "IN", phone: "(812) 299-1177", website: "www.iuoelocal841.com", lat: 39.4667025, lng: -87.4139119, address: ", 6801 South US Highway 41, Terre Haute, Indiana 47802" },
  { id: 70300, name: "IUOE Local 103", city: "Indianapolis", state: "IN", phone: "(317) 353-1308", website: "www.iuoe103.org", lat: 39.7970194, lng: -86.0498236, address: ", 6814 East 21st Street, Indianapolis, Indiana 46219" },
  { id: 71200, name: "IUOE Local 112", city: "Anderson", state: "IN", phone: "(765) 643-5112", website: "iuoe112.org", lat: 40.0894574, lng: -85.6336991, address: ", 2716 S. Rangeline Road, Anderson, Indiana 46017" },
  { id: 75001, name: "IUOE Local 150 (Lakeville)", city: "Lakeville", state: "IN", phone: "(574) 784-3694", website: "www.asiplocal150.org//Forms/Page.aspx?P=Home", lat: 41.5244919, lng: -86.2733398, address: "1001 N. Michigan Street, Lakeville, Indiana 46536" },
  { id: 83400, name: "IUOE Local 234", city: "Des moines", state: "IA", phone: "(515) 265-1657", website: "www.local234.com", lat: 41.6435491, lng: -93.5192962, address: "4880 Hubbell Avenue, Des Moines, Iowa 50317" },
  { id: 71100, name: "IUOE Local 111", city: "Leavenworth", state: "KS", website: "www.iuoe.org/find-an-iuoe-local-union", lat: 39.2908423, lng: -94.9174022, address: ", 661 Sheridan, Leavenworth, Kansas 66048" },
  { id: 72300, name: "IUOE Local 123", city: "Caney", state: "KS", phone: "(620) 515-0995", lat: 37.0115118, lng: -95.9350414, address: ", 2208 County Rd 2700, Caney, Kansas 67333" },
  { id: 71900, name: "IUOE Local 119", city: "Haysville", state: "KS", phone: "(316) 524-4211", website: "iuoelocal119.com", lat: 37.5644615, lng: -97.3522675, address: ", P O Box 524, Haysville, Kansas 67060" },
  { id: 70100, name: "IUOE Local 101 (Wichita)", city: "Wichita", state: "KS", phone: "(316) 529-1012", website: "www.iuoelocal101.org", lat: 37.6922361, lng: -97.3375448, address: ", 3830 South Meridian, Suite B-40, Wichita, Kansas 67217" },
  { id: 62000, name: "IUOE Local 20", city: "Union", state: "KY", phone: "(859) 415-7703", lat: 38.9416956, lng: -84.6592801, address: ", 1099 Ashton Ct, Union, Kentucky 41091" },
  { id: 78101, name: "IUOE Local 181 (Henderson)", city: "Henderson", state: "KY", phone: "(270) 826-2704", website: "www.iuoelocal181.org", lat: 37.846476, lng: -87.585779, address: ", 700 N. Elm St., Henderson, Kentucky 42419" },
  { id: 100600, name: "IUOE Local 406", city: "Metairie", state: "LA", phone: "(504) 241-1311", website: "www.iuoelocal406.org", lat: 30.0018547, lng: -90.1767012, address: ", 3525 N. Causeway Blvd. Ste. 406, Metairie, Louisiana 70002" },
  { id: 100700, name: "IUOE Local 407", city: "Sulphur", state: "LA", phone: "(337) 433-8255", website: "iuoe407.org", lat: 30.2040523, lng: -93.3544374, address: ", 1190 Mosswood Drive, Sulphur, Louisiana 70665" },
  { id: 158700, name: "IUOE Local 987", city: "Winnipeg", state: "US", phone: "(204) 786-8658", website: "www.oe987.mb.ca", lat: 49.8948542, lng: -97.0057868, address: ", 200 Regent Ave W, Winnipeg, Manitoba R2C1R2" },
  { id: 67700, name: "IUOE Local 77", city: "Suitland", state: "MD", phone: "(301) 899-6900", website: "www.iuoelocal77.com", lat: 38.8285021, lng: -76.9171288, address: "4546 Brittania Way, Suitland, Maryland 20746" },
  { id: 69900, name: "IUOE Local 99", city: "Upper marlboro", state: "MD", phone: "(202) 337-0099", website: "www.iuoelocal99.org", lat: 38.8162451, lng: -76.751708, address: ", 9315 Largo Drive West, Suite 200, Upper Marlboro, Maryland 20774" },
  { id: 63700, name: "IUOE Local 37", city: "Baltimore", state: "MD", phone: "(410) 254-2030", website: "www.iuoe37.org", lat: 39.2908816, lng: -76.610759, address: "3615 North Point Blvd., Ste. A,, Baltimore, Maryland 21222" },
  { id: 69800, name: "IUOE Local 98 (Southwick)", city: "Southwick", state: "MA", phone: "(413) 998-3230", website: "www.iuoelocal98.org", lat: 42.0716743, lng: -72.7437511, address: ", 40 Hudson Drive, Southwick, Massachusetts 01077" },
  { id: 60400, name: "IUOE Local 4", city: "Medway", state: "MA", phone: "(508) 533-1433", website: "www.iuoelocal4.org", lat: 42.1389284, lng: -71.4719601, address: ", 16 Trotter Drive, Medway, Massachusetts 02053" },
  { id: 147700, name: "IUOE Local 877", city: "Norwood", state: "MA", phone: "(781) 769-1877", website: "iuoelocal877.com", lat: 42.194543, lng: -71.1994976, address: "89 Access Road Unit 4, Norwood, Massachusetts 02062" },
  { id: 92400, name: "IUOE Local 324", city: "Bloomfield township", state: "MI", phone: "(248) 451-0324", website: "www.oe324.org", lat: 42.6055386, lng: -83.2860757, address: ", 500 Hulet Drive, Bloomfield Township, Michigan 48302" },
  { id: 64900, name: "IUOE Local 49 (Minneapolis)", city: "Minneapolis", state: "MN", phone: "(612) 788-9441", website: "www.local49.org", lat: 44.9772995, lng: -93.2654692, address: "2829 Anthony Lane South, Minneapolis, Minnesota 55418" },
  { id: 67000, name: "IUOE Local 70", city: "White bear lake", state: "MN", phone: "(651) 646-4566", website: "www.iuoe70.org", lat: 45.0838098, lng: -93.0069304, address: ", 2722 Country Road D East, White Bear Lake, Minnesota 55110" },
  { id: 122401, name: "IUOE Local 624 (Richland)", city: "Richland", state: "MS", phone: "(601) 353-3914", website: "www.iuoe624.com", lat: 32.2658152, lng: -90.1753476, address: ", 202 Katie Street, Richland, Mississippi 39218" },
  { id: 70101, name: "IUOE Local 101 (Kansas City)", city: "Kansas city", state: "KS", phone: "(816) 737-8600", website: "iuoelocal101.org", lat: 39.100105, lng: -94.5781416, address: ", 6601 Winchester Ave., Suite 280, Kansas City, Missouri 64133" },
  { id: 74800, name: "IUOE Local 148", city: "St. louis", state: "MO", phone: "(314) 865-1300", website: "www.local148.com", lat: 38.5202218, lng: -90.3314023, address: ", 11000 Lin Valle Drive, St. Louis, Missouri 63123" },
  { id: 111300, name: "IUOE Local 513", city: "Bridgeton", state: "MO", phone: "(314) 739-3983", website: "www.iuoe513.org", lat: 38.7588768, lng: -90.4395114, address: ", 3449 Hollenberg Drive, Bridgeton, Missouri 63044" },
  { id: 100000, name: "IUOE Local 400 (Billings)", city: "Billings", state: "MT", phone: "(406) 461-5681", website: "www.local400training.org/home", lat: 45.7796793, lng: -108.5016778, address: "530 South 27th St, Billings, Montana 59101-4180" },
  { id: 100001, name: "IUOE Local 400 (Butte)", city: "Butte", state: "MT", phone: "(406) 949-7528", website: "www.local400training.org/home", lat: 46.0151945, lng: -112.5370194, address: "58 West Quartz, Butte, Montana 59801" },
  { id: 100002, name: "IUOE Local 400 (Helena)", city: "Helena", state: "MT", phone: "(406) 442-9597", website: "www.local400training.org/home", lat: 46.6020251, lng: -111.9917604, address: ", 2737 Airport Road, Helena, Montana 59601" },
  { id: 100003, name: "IUOE Local 400 (Great Falls)", city: "Great falls", state: "MT", phone: "(406) 442-9597", website: "www.local400training.org/home", lat: 47.492995, lng: -111.2957989, address: ", 1112 7th St South, Great Falls, Montana 59405" },
  { id: 100004, name: "IUOE Local 400 (Missoula)", city: "Missoula", state: "MT", phone: "(406) 949-7552", website: "www.local400training.org/home", lat: 46.8707175, lng: -113.9929184, address: ", 208 East Main, Missoula, Montana 59801" },
  { id: 100005, name: "IUOE Local 400 (Kalispell)", city: "Kalispell", state: "MT", phone: "(406) 949-7552", website: "www.local400training.org/home", lat: 48.1945608, lng: -114.315207, address: "347 2nd Ave West, Kalispell, Montana 59901" },
  { id: 117100, name: "IUOE Local 571", city: "Omaha", state: "NE", phone: "(402) 733-1600", website: "www.iuoe571.org", lat: 41.2130215, lng: -96.0069523, address: ", 4660 South 60th Avenue, Omaha, Nebraska 68117" },
  { id: 60313, name: "IUOE Local 3 (Reno)", city: "Reno", state: "NV", phone: "(775) 857-4440", website: "www.oe3.org", lat: 39.5089433, lng: -119.7508243, address: ", 1290 Corporate Blvd., Reno, Nevada 89502" },
  { id: 63905, name: "IUOE Local 39 (Reno)", city: "Reno", state: "NV", phone: "(775) 358-3939", website: "www.local39.org", lat: 39.5225049, lng: -119.7980127, address: ", 390 Kirman Avenue, Reno, Nevada 89502" },
  { id: 154600, name: "IUOE Local 946", city: "Saint john", state: "NB", phone: "(506) 635-1110", website: "www.iuoe946.ca", lat: 45.2125794, lng: -66.168859, address: ", 341 King William Road, Saint John, New Brunswick E2M7C9" },
  { id: 69801, name: "IUOE Local 98 (Hookset)", city: "Hookset", state: "NH", website: "www.iuoelocal98.org", address: ", 161 Londonderry Turnpike, Hookset, New Hampshire 03106" },
  { id: 66800, name: "IUOE Local 68", city: "West caldwell", state: "NJ", phone: "(973) 244-5800", website: "www.local68.org", lat: 40.86322, lng: -74.287137, address: "11 Fairfield Place, West Caldwell, New Jersey 07006" },
  { id: 142500, name: "IUOE Local 825 (Springfield)", city: "Springfield", state: "NJ", phone: "(973) 921-1900", website: "www.iuoe825.org", lat: 40.7109107, lng: -74.3099398, address: ", 65 Springfield Avenue, Third Flr, Springfield, New Jersey 07081" },
  { id: 62500, name: "IUOE Local 25", city: "Manalapan", state: "NJ", phone: "(732) 446-6262", website: "iuoe25.org", lat: 40.2852895, lng: -74.333495, address: "463 Highway 33, Manalapan, New Jersey 07726" },
  { id: 155300, name: "IUOE Local 953 (Kirtland)", city: "Kirtland", state: "NM", phone: "(505) 598-6634", website: "www.iuoelocal953.com", lat: 36.7342984, lng: -108.360161, address: ", 4260 Highway 64, Kirtland, New Mexico 87417" },
  { id: 155301, name: "IUOE Local 953 (Albuquerque)", city: "Albuquerque", state: "NM", phone: "(505) 266-5757", website: "www.iuoelocal953.com", lat: 35.0841034, lng: -106.650985, address: ", 151 Pennsylvania Street, S.E., Albuquerque, New Mexico 87108" },
  { id: 95101, name: "IUOE Local 351 (Artesia)", city: "Artesia", state: "NM", phone: "(575) 361-7988", website: "local351.com", lat: 32.8423345, lng: -104.4032963, address: ", 412 Chisum Street, Artesia, New Mexico 88210" },
  { id: 155302, name: "IUOE Local 953 (El Paso)", city: "El paso", state: "NM", phone: "(915) 234-2429", website: "www.iuoelocal953.com", lat: 36.7533537, lng: -108.3708847, address: ", 9434 Viscount blvd Suite 120, El Paso, New Mexico 79925" },
  { id: 100900, name: "IUOE Local 409", city: "Buffalo", state: "NY", phone: "(716) 891-4058", lat: 42.9377121, lng: -78.8793271, address: "1500 Elmwood Avenue, Buffalo, New York 14207" },
  { id: 61700, name: "IUOE Local 17", city: "Lakeview", state: "NY", phone: "(716) 627-2648", website: "www.iuoe-17.com", lat: 40.6769525, lng: -73.6509375, address: ", 5959 Versailles Road, Lakeview, New York 14085" },
  { id: 75800, name: "IUOE Local 158", city: "Glenmont", state: "NY", phone: "(518) 431-0600", website: "www.iuoe158.org", lat: 42.6226898, lng: -73.7824311, address: ", 27 Hannay Lane, Glenmont, New York 12077" },
  { id: 142501, name: "IUOE Local 825 (New Hampton)", city: "New hampton", state: "NY", phone: "(845) 674-9020", website: "www.iuoe825.org", lat: 41.4109272, lng: -74.4071001, address: "96 Bates Gates Road, Suite 70, New Hampton, New York 10958" },
  { id: 73700, name: "IUOE Local 137", city: "Briarcliff manor", state: "NY", phone: "(914) 762-0600", website: "www.iuoelocal137.com", lat: 41.1530381, lng: -73.8330547, address: ", 1360 Pleasantville Road, Briarcliff Manor, New York 10510" },
  { id: 73800, name: "IUOE Local 138", city: "Farmingdale", state: "NY", phone: "(631) 694-2480", website: "www.local138.com", lat: 40.7471383, lng: -73.4159844, address: "137 Gazza Blvd, Farmingdale, New York 11735" },
  { id: 61400, name: "IUOE Local 14", city: "Flushing", state: "NY", phone: "(718) 939-0600", website: "www.iuoelocal14.com", lat: 40.7640601, lng: -73.8090397, address: ", 159-18 Northern Boulevard, Flushing, New York 11358" },
  { id: 63001, name: "IUOE Local 30 (Whitestone)", city: "Whitestone", state: "NY", phone: "(718) 847-8484", website: "www.iuoelocal30.com", lat: 40.7917005, lng: -73.8227151, address: ", 16-16 Whitestone Expressway, Whitestone, New York 11357" },
  { id: 89500, name: "IUOE Local 295", city: "Maspeth", state: "NY", phone: "(718) 672-1415", website: "www.iuoelocal295.org", lat: 40.7244646, lng: -73.9109773, address: ", 61-04 Maurice Avenue, Maspeth, New York 11378" },
  { id: 149100, name: "IUOE Local 891", city: "Brooklyn", state: "NY", phone: "(718) 455-9731", website: "www.local891.com", lat: 40.6526006, lng: -73.9497211, address: ", 63 Flushing Ave., Building 292, Suite 401-Unit 358, Brooklyn, New York 11205" },
  { id: 81100, name: "IUOE Local 211", city: "New york", state: "NY", phone: "(212) 233-2690", website: "iuoe211.com", lat: 40.7127281, lng: -74.0060152, address: ", 225 Broadway 43rd Floor, New York, New York 10007" },
  { id: 61500, name: "IUOE Local 15", city: "Long island city", state: "NY", phone: "(212) 929-5327", website: "iuoelocal15.org", lat: 40.7490865, lng: -73.9496577, address: ", 44-40 11th Street, Long Island City, New York 11101" },
  { id: 69400, name: "IUOE Local 94", city: "New york", state: "NY", phone: "(212) 245-7040", website: "www.local94.com", lat: 40.7591303, lng: -73.9902633, address: ", 331-337 West 44th Street, New York, New York 10036" },
  { id: 150400, name: "IUOE Local 904", city: "Mount pearl", state: "NL", phone: "(709) 747-9040", website: "www.iuoe904.com", lat: 47.5204874, lng: -52.8075891, address: ", 62 Commonwealth Ave., Mount Pearl, Newfoundland and Labrador A1N1W8" },
  { id: 101500, name: "IUOE Local 415", city: "Plymouth", state: "NC", phone: "(252) 799-7452", lat: 35.854702, lng: -76.742908, address: ", 100 Old Roper Road, Plymouth, North Carolina 27962" },
  { id: 106500, name: "IUOE Local 465", city: "Durham", state: "NC", phone: "(919) 596-6869", website: "www.iuoe465.com", lat: 35.996653, lng: -78.9018053, address: ", 3300 Highway 70 East, Durham, North Carolina 27704" },
  { id: 64901, name: "IUOE Local 49 (West Fargo)", city: "West fargo", state: "ND", phone: "(701) 297-4663", website: "www.local49.org", lat: 46.8788347, lng: -96.909216, address: ", 650 2nd Ave NW, West Fargo, North Dakota 58078" },
  { id: 132100, name: "IUOE Local 721", city: "Dartmouth", state: "NS", phone: "(902) 865-8844", website: "iuoe904.com/local/operating-engineers-local-721-nova-scotia", lat: 44.695565, lng: -63.5775151, address: ", 251 Brownlow Avenue, Dartmouth, Nova Scotia B3B2A9" },
  { id: 132700, name: "IUOE Local 727", city: "Dartmouth", state: "NS", phone: "(902) 481-0523", website: "www.iuoe727.ca", lat: 44.6981233, lng: -63.581871, address: ", 202 Brownlow Ave, Dartmouth, Nova Scotia B3B1X2" },
  { id: 66600, name: "IUOE Local 66 (Youngstown)", city: "Youngstown", state: "OH", phone: "(330) 758-7536", website: "www.iuoe66.org", lat: 41.1035786, lng: -80.6520161, address: ", 291 McClurg Road, Youngstown, Ohio 44512" },
  { id: 61800, name: "IUOE Local 18", city: "Cleveland", state: "OH", phone: "(216) 432-3138", website: "oe18.org", lat: 41.5017193, lng: -81.6631542, address: ", 3515 Prospect Avenue, Cleveland, Ohio 44115" },
  { id: 95102, name: "IUOE Local 351 (Wynnewood)", city: "Wynnewood", state: "OK", phone: "(580) 223-8854", website: "local351.com", lat: 34.6434171, lng: -97.1644656, address: ", 25778 North Country Road 3280, Wynnewood, Oklahoma 73098" },
  { id: 122700, name: "IUOE Local 627", city: "Tulsa", state: "OK", phone: "(918) 437-0370", website: "iuoelocal627.org", lat: 36.1531007, lng: -95.8418098, address: ", 12109 E. Skelly Dr., Tulsa, Oklahoma 74128" },
  { id: 139300, name: "IUOE Local 793", city: "Oakville", state: "ON", phone: "(905) 469-9299", website: "www.iuoelocal793.org", lat: 43.4105307, lng: -79.7238441, address: ", 2245 Speers Road, Oakville, Ontario L6L6x8" },
  { id: 137200, name: "IUOE Local 772", city: "Gloucester", state: "ON", phone: "(905) 527-5250", website: "www.iuoe772.org", lat: 45.4533971, lng: -75.5855027, address: ", 5460 Canotek Road, Gloucester, Ontario K1J 9G8" },
  { id: 130100, name: "IUOE Local 701", city: "Gladstone", state: "OR", phone: "(503) 650-7701", website: "www.iuoe701.com", lat: 45.3798618, lng: -122.5854393, address: ", 555 East First Street, Gladstone, Oregon 97027" },
  { id: 114201, name: "IUOE Local 542 (Fort Washington)", city: "Fort washington", state: "PA", phone: "(215) 542-7500", website: "www.iuoe542.com", lat: 40.1478532, lng: -75.1897243, address: ", 1375 Virginia Drive Suite 100, Fort Washington, Pennsylvania 19034" },
  { id: 143500, name: "IUOE Local 835", city: "Drexel hill", state: "PA", phone: "(610) 853-6061", website: "www.iuoelocal835.org", lat: 39.9483282, lng: -75.3068878, address: ", 1064 Pontiac Road, Drexel Hill, Pennsylvania 19026" },
  { id: 69500, name: "IUOE Local 95", city: "Pittsburgh", state: "PA", phone: "(412) 422-4702", website: "www.iuoelocal95.org", lat: 40.4166027, lng: -80.0322226, address: ", 1001 East Entry Drive, Pittsburgh, Pennsylvania 15216" },
  { id: 66601, name: "IUOE Local 66 (Pittsburgh)", city: "Pittsburgh", state: "PA", phone: "(412) 968-9120", website: "www.iuoe66.org", lat: 40.4406968, lng: -80.0025666, address: ", 111 Zeta Drive, Pittsburgh, Pennsylvania 15238" },
  { id: 154200, name: "IUOE Local 942", city: "Charlottetown", state: "US", phone: "(902) 566-3255", website: "iuoe942.com", lat: 46.2654572, lng: -63.1107655, address: ", 326 Patterson Drive, Charlottetown, Prince Edward Island C1A8K4" },
  { id: 150500, name: "IUOE Local 905", city: "St. leonard", state: "QC", phone: "(514) 326-9412", website: "local905.ca", lat: 45.58671, lng: -73.5969488, address: ", 204-5325 Jean-Talon East, St. Leonard, Quebec H1S1L4" },
  { id: 65700, name: "IUOE Local 57", city: "Johnston", state: "RI", phone: "(401) 421-6678", website: "www.iuoelocal57.org", lat: 41.8130237, lng: -71.5284548, address: ", 857 Central Avenue, Johnston, Rhode Island 02919" },
  { id: 147000, name: "IUOE Local 870", city: "Saskatoon", state: "SK", phone: "(306) 665-7718", website: "www.iuoelocal870.com", lat: 52.1581777, lng: -106.6878282, address: ", 2175 Airport Drive, Saskatoon, Saskatchewan S7L7E1" },
  { id: 107000, name: "IUOE Local 470", city: "Graniteville", state: "SC", phone: "(803) 663-6027", website: "www.local470.net", lat: 33.5616769, lng: -81.8334312, address: ", 422 Chalk Bed Road, Graniteville, South Carolina 29829" },
  { id: 64902, name: "IUOE Local 49 (Sioux Falls)", city: "Sioux falls", state: "SD", phone: "(605) 336-8868", website: "www.local49.org", lat: 43.547492, lng: -96.7143, address: "101 South Fairfax Ave, Sioux Falls, South Dakota 57103" },
  { id: 96900, name: "IUOE Local 369", city: "Cordova", state: "TN", phone: "(901) 754-7599", website: "iuoe369.com", lat: 35.1493656, lng: -89.7942509, address: ", 878 Willow Tree Circle, Cordova, Tennessee 38018" },
  { id: 151700, name: "IUOE Local 917", city: "Knoxville", state: "TN", phone: "(423) 893-6176", website: "www.iuoe917.org", lat: 35.9123385, lng: -84.1251593, address: ", 10420 Cogdill Rd, Knoxville, Tennessee 37932" },
  { id: 95103, name: "IUOE Local 351 (El Paso)", city: "El paso", state: "TX", phone: "(915) 771-0224", website: "local351.com", lat: 31.7724593, lng: -106.3837027, address: ", 6967 Commerce Ave., El Paso, Texas 79915" },
  { id: 94000, name: "IUOE Local 340", city: "Amarillo", state: "TX", phone: "(806) 477-4200", lat: 35.20729, lng: -101.8371192 },
  { id: 95104, name: "IUOE Local 351 (Borger)", city: "Borger", state: "TX", phone: "(806) 274-7186", website: "local351.com", lat: 35.6630789, lng: -101.3896037, address: ", 111 East Coolidge Street, Borger, Texas 79007" },
  { id: 77800, name: "IUOE Local 178", city: "Fort worth", state: "TX", phone: "(817) 284-1191", website: "www.local178.org", lat: 32.753177, lng: -97.3327459, address: ", 4025 Rufe Snow Drive, Fort Worth, Texas 76180" },
  { id: 105000, name: "IUOE Local 450", city: "Dayton", state: "TX", phone: "(936) 258-5516", website: "www.iuoelocal450.org", lat: 29.9323677, lng: -94.9022129, address: "13315 Hwy 146 S., Dayton, Texas 77535" },
  { id: 116400, name: "IUOE Local 564", city: "Richwood", state: "TX", phone: "(979) 480-0003", website: "www.local564.com", lat: 29.0695143, lng: -95.4087799, address: ", 2120 North Brazosport Blvd., Richwood, Texas 77531" },
  { id: 60314, name: "IUOE Local 3 (Sandy)", city: "Sandy", state: "UT", phone: "(801) 596-2677", website: "www.oe3.org/utah-contact", lat: 40.5710454, lng: -111.8953815, address: ", 8805 South Sandy Parkway, Sandy, Utah 84070" },
  { id: 69802, name: "IUOE Local 98 (South Burlington)", city: "South burlington", state: "VT", phone: "(802) 863-2734", website: "www.iuoelocal98.org", lat: 44.4576632, lng: -73.1370635, address: ", 3 Gregory Drive, South Burlington, Vermont 05403" },
  { id: 74700, name: "IUOE Local 147", city: "Norfolk", state: "VA", phone: "(757) 461-4505", website: "www.iuoe147.com", lat: 36.8493695, lng: -76.2899539, address: ", 400 North Center Drive, Suite 123, Norfolk, Virginia 23502" },
  { id: 90205, name: "IUOE Local 302 (Spokane)", city: "Spokane", state: "WA", phone: "(509) 624-5365", website: "www.iuoe302.org", lat: 47.6513656, lng: -117.4402532, address: ", 510 S Elm, Spokane, Washington 99201" },
  { id: 90206, name: "IUOE Local 302 (Kennewick)", city: "Kennewick", state: "WA", phone: "(509) 545-1811", website: "www.iuoe302.org", lat: 46.2102995, lng: -119.1569447, address: "2637 W Albany Ave, Kennewick, Washington 99336" },
  { id: 88000, name: "IUOE Local 280", city: "Richland", state: "WA", phone: "(509) 946-5101", lat: 46.2761566, lng: -119.2806367, address: ", 1305 Knight Street, Richland, Washington 99352" },
  { id: 90207, name: "IUOE Local 302 (Ellensburg)", city: "Ellensburg", state: "WA", phone: "(509) 933-3020", website: "www.iuoe302.org", lat: 46.9890582, lng: -120.5497566, address: ", 403 S Water St, Ellensburg, Washington 98926" },
  { id: 121200, name: "IUOE Local 612 (Centralia)", city: "Centralia", state: "WA", phone: "(360) 736-8028", website: "www.iuoelocal612.org", lat: 46.7110359, lng: -122.9564268, address: "612 S Tower Ave, Centralia, Washington 98531" },
  { id: 121201, name: "IUOE Local 612 (Tacoma)", city: "Tacoma", state: "WA", phone: "(253) 572-9612", website: "www.iuoelocal612.org", lat: 47.2225439, lng: -122.4375467, address: ", 1555 South Fawcett Avenue, Tacoma, Washington 98402" },
  { id: 90208, name: "IUOE Local 302 (Auburn)", city: "Auburn", state: "WA", phone: "(253) 351-9095", website: "www.iuoe302.org", lat: 47.3069378, lng: -122.2352056, address: ", 18 E St SW, Auburn, Washington 98001" },
  { id: 90209, name: "IUOE Local 302 (Bothell)", city: "Bothell", state: "WA", phone: "(425) 806-0302", website: "www.iuoe302.org", lat: 47.7623204, lng: -122.2054035, address: ", 18701 - 120th Avenue, N.E., Bothell, Washington 98011" },
  { id: 90210, name: "IUOE Local 302 (Silverdale)", city: "Silverdale", state: "WA", phone: "(360) 307-0557", website: "www.iuoe302.org", lat: 47.6478438, lng: -122.6955765, address: ", 9301 Linder Way NW, Silverdale, Washington 98383" },
  { id: 73200, name: "IUOE Local 132", city: "Charleston", state: "VA", phone: "(304) 343-7731", website: "www.iuoe132.org", lat: 38.3604088, lng: -81.64219, address: ", 606 Tennessee Ave, Charleston, West Virginia 25302" },
  { id: 102000, name: "IUOE Local 420", city: "Oak creek", state: "WI", phone: "(414) 570-0420", website: "www.local420wi.org", lat: 42.9229799, lng: -87.9284822, address: ", 1140 West Anderson Court, Oak Creek, Wisconsin 53154" },
  { id: 73900, name: "IUOE Local 139", city: "Pewaukee", state: "WI", phone: "(262) 896-0139", website: "www.iuoe139.org", lat: 43.0689106, lng: -88.20993, address: ", N27 W23233 Roundy Drive, Pewaukee, Wisconsin 53072" },
  { id: 140000, name: "IUOE Local 800", city: "Bar nunn", state: "WY", phone: "(307) 265-1397", website: "www.iuoe800training.com", lat: 42.913577, lng: -106.343361, address: ", 4925 N. Wardwell Industrial Ave., Bar Nunn, Wyoming 82601" }
];


// ─── IRONWORKERS LOCALS DATABASE — Int'l Association of Bridge & Structural Iron Workers ─
const IW_LOCALS = [
  { id: 40001, name: "IW Local 1", city: "Chicago", state: "IL", phone: "708-366-6695", website: "www.iwlocal1.com", lat: 41.854877, lng: -87.8165276, address: "7720 Industrial Drive, Forest Park, IL 60130, USA" },
  { id: 40003, name: "IW Local 3", city: "Pittsburgh", state: "PA", phone: "412-227-6767", website: "www.iwlocal3.com", lat: 40.451852, lng: -79.981562, address: "2201 Liberty Ave., Pittsburgh, PA 15222" },
  { id: 40005, name: "IW Local 5", city: "Washington", state: "WA", phone: "(301) 599-0960", website: "www.ironworkers5.org", lat: 45.5825711, lng: -122.3509593, address: "9301 Peppercorn Place Largo, MD 20774" },
  { id: 40006, name: "IW Local 6", city: "Buffalo", state: "NY", phone: "716-828-1200", website: "www.ironworkerslocal6.com", email: "ironworkerlocal6@aol.com", lat: 42.837978, lng: -78.7879725, address: "196 Orchard Park Rd., West Seneca, NY, 14224" },
  { id: 40007, name: "IW Local 7", city: "Boston", state: "MA", phone: "617-268-4777", website: "iwlocal7.org", lat: 42.3588336, lng: -71.0578303, address: "195 Old Colony Ave., PO Box 7, S. Boston,, MA 02127-2457" },
  { id: 40008, name: "IW Local 8", city: "Milwaukee", state: "WI", phone: "414-476-9370", website: "iwl8.org", lat: 43.0288994, lng: -88.063272, address: "12034 West Adler Ln., Milwaukee, WI 53214" },
  { id: 40009, name: "IW Local 9", city: "Niagra falls", state: "NY", phone: "716-285-5738", website: "www.ironworkers9.org", lat: 43.0834925, lng: -79.0029405, address: "Niagara Nine Bldg., 412 39th St., Niagara, Falls, NY 14303" },
  { id: 40010, name: "IW Local 10", city: "Kansas city", state: "KS", phone: "816-842-8917", website: "www.ironworkers10.com", lat: 39.1021014, lng: -94.5707509, address: "1000 E 10th St, Kansas City, MO 64106, USA" },
  { id: 40011, name: "IW Local 11", city: "Newark", state: "NJ", phone: "973.338.3777", website: "www.ironworkers11.org", lat: 40.8407903, lng: -74.1841118, address: "1500 Broad Street, Bloomfield NJ 07003" },
  { id: 40012, name: "IW Local 12", city: "Albany", state: "NY", phone: "518-435-0470", website: "www.ironworkers12.org", email: "frontoffice@iwl12.org", lat: 42.6511674, lng: -73.754968, address: "17 Hemlock St., Latham, NY 12110" },
  { id: 40014, name: "IW Local 14", city: "Spokane", state: "WA", phone: "509-927-8288", website: "www.ironworkers14.org", lat: 47.6838514, lng: -117.1838787, address: "16610 E. Euclid Ave., Spokane, WA, 99216-1808" },
  { id: 40015, name: "IW Local 15", city: "Hartford", state: "CT", phone: "(860) 249-7639", website: "www.ironworkers15.org", lat: 41.7488594, lng: -72.6644481, address: "49 Locust Street, Hartford, CT 06114, USA" },
  { id: 40017, name: "IW Local 17", city: "Cleveland", state: "OH", phone: "216-771-5558", website: "www.iw17.org", email: "union@ironworkers17.org", lat: 41.5077474, lng: -81.6758684, address: "1544 E. 23rd St., Cleveland, OH 44114-4290" },
  { id: 40021, name: "IW Local 21", city: "Omaha", state: "NE", phone: "712-252-1761", website: "iw21.org", lat: 41.2250779, lng: -96.1390422, address: "14515 Industrial Rd, Omaha, NE 68144" },
  { id: 40022, name: "IW Local 22", city: "Indianapolis", state: "IN", phone: "317-243-8222", website: "www.ironworkers22.com", lat: 39.7396708, lng: -86.2559971, address: "5600 Dividend Road, Indianapolis, IN 46241" },
  { id: 40024, name: "IW Local 24", city: "Denver", state: "CO", phone: "303-623-5386", website: "ironworkers24.org", lat: 39.722614, lng: -104.994164, address: "501 West 4th Ave., Denver, CO 80223" },
  { id: 40025, name: "IW Local 25", city: "Detroit", state: "MI", phone: "(248) 344-9494", website: "www.ironworkers25.org", email: "union@ironworkers25.org", lat: 42.3315509, lng: -83.0466403, address: "25150 Trans X Drive • Novi, MI 48376" },
  { id: 40027, name: "IW Local 27", city: "Salt lake city", state: "UT", phone: "801-972-5714", website: "www.ironworkers27.com", lat: 40.7596198, lng: -111.886797, address: "2261 South Redwood Rd., Ste. E, Salt Lake, City, UT 84119" },
  { id: 40028, name: "IW Local 28", city: "Richmond", state: "VA", phone: "(804) 716-2081", website: "www.ironworkers28.org", lat: 37.5385087, lng: -77.43428, address: "2831 Oak Lake Blvd., Midlothian, VA 23112" },
  { id: 40029, name: "IW Local 29", city: "Portland", state: "OR", phone: "503-774-0777", website: "www.ironworkers29.org", email: "info@ironworkers29.org", lat: 45.5202471, lng: -122.674194, address: "11620 N.E. Ainsworth Circle, Ste. 200,, Portland,, OR 97220" },
  { id: 40033, name: "IW Local 33", city: "Rochester", state: "NY", phone: "585) 288-2630", website: "www.ironworkers33.org", email: "iw.local.33@ironworkers33.org", lat: 43.130496, lng: -77.7252929, address: "650 Trabold Rd., Rochester, NY 14624" },
  { id: 40037, name: "IW Local 37", city: "Providence", state: "RI", phone: "(401) 438-1111", website: "iwlocal37.com", email: "ironworkerslu37@gmail.com", lat: 41.8121409, lng: -71.3493197, address: "845 Waterman Ave., E. Providence, RI 02914" },
  { id: 40040, name: "IW Local 40", city: "New york", state: "NY", phone: "212-889-1320", website: "www.ironworkers40.org", lat: 40.7467213, lng: -73.9815155, address: "451 Park Ave., South, New York, NY 10016" },
  { id: 40044, name: "IW Local 44", city: "Cincinnati", state: "OH", phone: "859-586-2100", website: "ironworkers44.com", lat: 39.1014537, lng: -84.5124602, address: "1125 Victory Pl., Hebron, KY 41048" },
  { id: 40046, name: "IW Local 46", city: "New york", state: "NY", phone: "(212) 737-0500", website: "ml46.org", lat: 40.7721127, lng: -73.9591064, address: "1322 3rd Avenue New York, NY 10021," },
  { id: 40048, name: "IW Local 48", city: "Oklahoma city", state: "OK", phone: "(405) 632-6154", website: "www.ironworkers48.org", email: "lm48okc@gmail.com", lat: 35.4423833, lng: -97.533388, address: "1044 SW 22nd St., Oklahoma City, OK, 73109-1637" },
  { id: 40055, name: "IW Local 55", city: "Toledo", state: "OH", phone: "419-385-6613", website: "www.ironworkerslocal55.com", lat: 41.6197904, lng: -83.589376, address: "1080 Atlantic Ave., Toledo, OH 43609" },
  { id: 40060, name: "IW Local 60", city: "Syracuse", state: "NY", phone: "(315) 422-8200", website: "www.ironworkers60.org", email: "busmgr@ironworkers60.org", lat: 43.0537037, lng: -76.1589921, address: "500 West Genesee St., Syracuse, NY 13204" },
  { id: 40063, name: "IW Local 63", city: "Chicago", state: "IL", phone: "708-344-7727", website: "iwlocal63.com", lat: 41.8755616, lng: -87.6244212, address: "2205 Enterprise Drive, Suite 502, Westchester,, IL 60154" },
  { id: 40066, name: "IW Local 66", city: "San antonio", state: "TX", phone: "210-532-5237", website: "ironworkerslocal66.org", lat: 29.3713998, lng: -98.4481723, address: "4318 Clark Ave., San Antonio, TX 78223" },
  { id: 40067, name: "IW Local 67", city: "Des moines", state: "IA", phone: "515-262-9366", website: "www.ironworkerslocal67.com", lat: 41.6367221, lng: -93.5980906, address: "1501 East Aurora Ave., Des Moines, IA 50313" },
  { id: 40070, name: "IW Local 70", city: "Louisville", state: "KY", phone: "502-637-8796", website: "www.ironworkerslocal70.com", email: "iwlu70bm@ironworkers.org", lat: 38.2102329, lng: -85.7510639, address: "2429 Crittenden Dr., Louisville, KY 40217" },
  { id: 40075, name: "IW Local 75", city: "Phoenix", state: "AZ", phone: "(602) 268-1449", website: "www.ironworkers75.org", lat: 33.4139945, lng: -112.0594796, address: "950 E. Elwood St. Phoenix, AZ 85040" },
  { id: 40084, name: "IW Local 84", city: "Houston", state: "TX", phone: "713-928-3361", website: "www.ironworkers84.org", email: "local84@comcast.net", lat: 29.6576332, lng: -95.2879772, address: "7521 Fauna St., Houston,, TX 77061" },
  { id: 40086, name: "IW Local 86", city: "Seattle", state: "WA", phone: "206-248-4246", website: "www.local86.org", email: "local86@local86.org", lat: 47.6038321, lng: -122.330062, address: "4550 S. 134th Pl., #102, Tukwila, WA 98168" },
  { id: 40089, name: "IW Local 89", city: "Cedar rapids", state: "IA", phone: "319-365-8675", website: "www.iwlu89.com", lat: 41.9758872, lng: -91.6704053, address: "1112 29th Ave., SW, Cedar Rapids, IA, 52404-3409" },
  { id: 40092, name: "IW Local 92", city: "Birmingham", state: "AL", phone: "205-323-4551", website: "www.ironworkerslocal92.org", email: "localno92@bellsouth.net", lat: 33.5145921, lng: -86.7906527, address: "2828 4th Avenue South, Birmingham, Alabama 35233" },
  { id: 40097, name: "IW Local 97", city: "Vancouver", state: "BC", phone: "866-562-2597", website: "ironworkerslocal97.com", email: "info@ironworkerslocal97.com", lat: 49.2827, lng: -123.1207, address: "20135 115A Ave., Maple Ridge, BC V2X 0Z3" },
  { id: 40103, name: "IW Local 103", city: "Evansville", state: "IN", phone: "812-477-5317", website: "www.ironworkers103.org", email: "union@ironworkers103.org", lat: 37.995377, lng: -87.486349, address: "5313 Old Boonville Hwy., Evansville, IN, 47715" },
  { id: 40111, name: "IW Local 111", city: "Rock island", state: "IL", phone: "309-756-6614", website: "www.ironworkers111.org", lat: 41.4420034, lng: -90.6075571, address: "8000 29th St. West, Rock Island, IL 61201" },
  { id: 40112, name: "IW Local 112", city: "Peoria", state: "IL", phone: "309-699-6489", website: "www.ironworkers112.org", email: "iwlocal112@gmail.com", lat: 40.7004239, lng: -89.5393179, address: "3003 N. Main St., East Peoria, IL 61611" },
  { id: 40118, name: "IW Local 118", city: "Sacramento", state: "CA", phone: "916-646-6976", website: "www.iw118.org", lat: 38.5810606, lng: -121.493895, address: "2840 El Centro Rd., Ste. 118, Sacramento, CA, 95833" },
  { id: 40135, name: "IW Local 135", city: "Galveston", state: "TX", phone: "(409) 935-2421", website: "ironworkers135.org", email: "iwlu135@aol.com", lat: 29.505244, lng: -95.114844, address: "216 Gulf Freeway N, Texas City, TX 77591" },
  { id: 40136, name: "IW Local 136", city: "Chicago", state: "IL", phone: "708-615-9300", website: "riggerslocal136.com", lat: 41.8683178, lng: -87.8655015, address: "1820 Beach St., Broadview, IL 60155-2863" },
  { id: 40147, name: "IW Local 147", city: "Fort wayne", state: "IN", phone: "260-484-8514", website: "www.ironworkers147.org", lat: 41.1358544, lng: -85.1779022, address: "6345 Innovation Blvd., Ft. Wayne, IN 46818" },
  { id: 40155, name: "IW Local 155", city: "Fresno", state: "CA", phone: "559-251-7388", website: "www.ironworkers155.org", email: "local@ironworkers155.org", lat: 36.7394421, lng: -119.78483, address: "5407 E. Olive Ave., Ste. 106, Fresno, CA, 93727" },
  { id: 40167, name: "IW Local 167", city: "Memphis", state: "TN", phone: "901-367-1676", website: "ironworkers167.com", email: "iwlu167@bellsouth.net", lat: 35.0752012, lng: -89.9775983, address: "2574 Lindawood Cove, Memphis, TN, 38118-1503" },
  { id: 40172, name: "IW Local 172", city: "Columbus", state: "OH", phone: "614-497-0550", website: "www.ironworkers172.com", lat: 39.9029513, lng: -82.9954501, address: "2867 South High St., Columbus, OH 43207" },
  { id: 40197, name: "IW Local 197", city: "Long island city", state: "NY", phone: "718-361-6534", website: "ironworkers197.org", email: "billhayes197@yahoo.com", lat: 40.7455316, lng: -73.9484995, address: "47-10 32nd Place, Ste. 403, Long Island City,, NY 11101" },
  { id: 40207, name: "IW Local 207", city: "Youngstown", state: "OH", phone: "330-758-9777", website: "www.iw207.com", lat: 41.1035786, lng: -80.6520161, address: "694 Bev Rd., Youngstown, OH 44512" },
  { id: 40229, name: "IW Local 229", city: "San diego", state: "CA", phone: "858-571-5238", website: "www.local229.org", lat: 32.835995, lng: -117.147195, address: "5155 Mercury Point, San Diego, CA 92111" },
  { id: 40263, name: "IW Local 263", city: "Dallas", state: "TX", phone: "817-640-0202", website: "www.ironworkerslocal263.org", email: "iwlu263@gmail.com", lat: 32.7573857, lng: -97.045528, address: "604 N. Great Southwest Pkwy, Arlington, TX, 76011-5425" },
  { id: 40272, name: "IW Local 272", city: "Miami", state: "FL", phone: "954-524-8731", website: "www.ironworkerslocal272.com", lat: 25.7741566, lng: -80.1935973, address: "1201 N.E. 7th Ave., Fort Lauderdale, FL, 33304" },
  { id: 40290, name: "IW Local 290", city: "Dayton", state: "OH", phone: "937-222-1622", website: "www.iron290.com", lat: 39.7589478, lng: -84.1916069, address: "4191 E. US Rt. 40, Tipp City, OH 45371" },
  { id: 40321, name: "IW Local 321", city: "Little rock", state: "AR", phone: "(501) 374-3705", email: "ironworkers321@yahoo.com", lat: 34.749071, lng: -92.285564, address: "1315 W 2nd St, Little Rock, AR 72201" },
  { id: 40361, name: "IW Local 361", city: "Brooklyn", state: "NY", phone: "718-322-1016", website: "ironworkers361.com", email: "unionhall@local361.com", lat: 40.6526006, lng: -73.9497211, address: "89-19 97th Ave., Ozone Park, NY 11416" },
  { id: 40377, name: "IW Local 377", city: "San francisco", state: "CA", phone: "415-285-3880", website: "www.ironworkers377.com", lat: 37.739464, lng: -122.4047871, address: "570 Barneveld Ave., San Francisco, CA 94124" },
  { id: 40378, name: "IW Local 378", city: "Oakland", state: "CA", phone: "707-746-6100", website: "www.ironworkers378.org", lat: 38.0598884, lng: -122.1277992, address: "3120 Bayshore Rd., Benicia, CA 94510" },
  { id: 40380, name: "IW Local 380", city: "Champaign", state: "IL", phone: "217-367-6014", website: "www.ironworkers380.org", email: "ironworkers380@gmail.com", lat: 40.1164841, lng: -88.2430932, address: "1602 East Butzow Dr., Urbana, IL 61802" },
  { id: 40383, name: "IW Local 383", city: "Madison", state: "WI", phone: "608-256-3162", website: "www.iron383.com", lat: 43.07469, lng: -89.3841663, address: "5501 Manufacturer’s, Dr., Madison, WI, 53704" },
  { id: 40384, name: "IW Local 384", city: "Knoxville", state: "TN", phone: "865-689-3371", website: "ironworkers384.com", lat: 36.01163, lng: -83.92719, address: "1000 Buchanan Ave., N.E., Knoxville, TN, 37917-2683" },
  { id: 40387, name: "IW Local 387", city: "Atlanta", state: "GA", phone: "404-505-0022", website: "ironworkerslocal387.com/main", email: "iwlocal387@aol.com", lat: 33.7544657, lng: -84.3898151, address: "109 Selig Dr., S.W., Atlanta, GA 30336" },
  { id: 40392, name: "IW Local 392", city: "East st. louis", state: "IL", phone: "618-874-0313", website: "www.ironworkers392.org", lat: 38.6126532, lng: -90.0928381, address: "2995 Kingshighway, East St. Louis, IL 62201" },
  { id: 40395, name: "IW Local 395", city: "Hammond", state: "IN", phone: "219-763-7900", website: "www.ironworkers395.com", email: "webmaster@ironworkers395.com", lat: 41.608272, lng: -87.1612532, address: "6570 Ameriplex Dr., Portage, IN 46368" },
  { id: 40396, name: "IW Local 396", city: "St louis", state: "MO", phone: "314-647-3008", website: "www.ironworkers396.org", lat: 38.6126643, lng: -90.2849871, address: "2500 59th St., St. Louis, MO 63110" },
  { id: 40397, name: "IW Local 397", city: "Tampa", state: "FL", phone: "813-623-1515", website: "iwl397.com", lat: 27.9449854, lng: -82.4583107, address: "10201 U.S. Highway 92 East, Tampa, FL, 33610" },
  { id: 40399, name: "IW Local 399", city: "Camden", state: "NJ", phone: "856-456-9323", website: "www.ironworkers399.org", lat: 39.9448402, lng: -75.1198911, address: "26 E. Fleming Pike, Hammonton, NJ 08037" },
  { id: 40401, name: "IW Local 401", city: "Philadephia", state: "PA", phone: "215-676-3000", website: "www.local401.com", email: "ironworkers401@aol.com", lat: 40.0904024, lng: -75.0096871, address: "11600 Norcom Rd., Philadelphia, PA 19154" },
  { id: 40402, name: "IW Local 402", city: "West palm beach", state: "FL", phone: "561-842-7651", lat: 26.775479, lng: -80.067608, address: "1001 West 15th St., Riviera Beach, FL 33404" },
  { id: 40404, name: "IW Local 404", city: "Harrisburg", state: "PA", phone: "717-564-8550", website: "www.ironworkerslocal404.org", lat: 40.2663107, lng: -76.8861122, address: "981 Peifers Ln., Harrisburg, PA 17109" },
  { id: 40405, name: "IW Local 405", city: "Philadephia", state: "PA", phone: "215-462-7300", website: "www.reinforcedironworkersriggerslocal405.com", lat: 39.9352837, lng: -75.1855302, address: "2433 Reed St., Philadelphia, PA 19146" },
  { id: 40416, name: "IW Local 416", city: "Los angeles", state: "CA", phone: "562-868-1251", website: "www.ironworkers416.org", lat: 33.9057151, lng: -118.0790889, address: "13830 San Antonio Dr., Norwalk, CA 90650." },
  { id: 40417, name: "IW Local 417", city: "Newburgh", state: "NY", phone: "845-566-8417", website: "www.ironworkers417.org", lat: 41.5000767, lng: -74.0098299, address: "583 Rte. 32, Wallkill, NY 12589" },
  { id: 40424, name: "IW Local 424", city: "New haven", state: "CT", phone: "203-787-4154", website: "www.ironworkers424.org", lat: 41.3349351, lng: -72.8707397, address: "15 Bernhard Rd., North Haven, CT, 06473-3906" },
  { id: 40433, name: "IW Local 433", city: "Los angeles", state: "CA", phone: "626-964-2500", website: "ironworkers433.org", email: "keith@ironworkers433.org", lat: 34.0536909, lng: -118.242766, address: "17495 Hurley St. East, City of, Industry, CA 91744" },
  { id: 40440, name: "IW Local 440", city: "Utica", state: "NY", phone: "315-735-4531", website: "www.ironworkers440.com", lat: 43.1009031, lng: -75.2326641, address: "10 Main St., Ste. 100, Whitesboro, NY, 13492" },
  { id: 40444, name: "IW Local 444", city: "Joliet", state: "IL", phone: "815-725-1804", website: "www.ironworkers444.com", lat: 41.5120802, lng: -88.1333751, address: "2082 Oak Leaf St., Joliet, IL 60436" },
  { id: 40451, name: "IW Local 451", city: "Wilmington", state: "DE", phone: "302-994-0946", website: "www.iwlocal451.org", lat: 39.7459468, lng: -75.546589, address: "203 Old DuPont Rd., Wilmington, DE 19804" },
  { id: 40477, name: "IW Local 477", city: "Sheffield", state: "AL", phone: "(256) 383-3334", website: "www.ironworkers477.org", lat: 34.7630634, lng: -87.6974007, address: "506 N Nashville Ave, Sheffield, AL 35660" },
  { id: 40482, name: "IW Local 482", city: "Austin", state: "TX", phone: "512-385-2500", website: "www.ironworkers482.org", lat: 30.227829, lng: -97.715123, address: "2201 Riverside Farms Rd., Austin, TX, 78741" },
  { id: 40492, name: "IW Local 492", city: "Nashville", state: "TN", phone: "615-226-5435", website: "www.ironworkers492.org", lat: 36.2127826, lng: -86.7647082, address: "2524 Dickerson Pike, Nashville, TN 37207" },
  { id: 40495, name: "IW Local 495", city: "Albuquerque", state: "NM", phone: "505-242-9124", website: "www.ironworkers495.org", email: "busmgr@ironworkers495.org", lat: 35.0841034, lng: -106.650985, address: "2524 Baylor Dr., S.E., Albuquerque, NM, 87106" },
  { id: 40498, name: "IW Local 498", city: "Rockford", state: "IL", phone: "815-873-9180", website: "www.iwlocal498.org", lat: 42.2277829, lng: -89.0060212, address: "5640 Sockness Dr., Rockford, IL 61109" },
  { id: 40512, name: "IW Local 512", city: "Minneapolis", state: "MN", phone: "651-489-1488", website: "ironworkers512.com", lat: 44.9648048, lng: -93.1354409, address: "851 Pierce Butler Route, St. Paul, MN, 55104-1634" },
  { id: 40516, name: "IW Local 516", city: "Portland", state: "OR", phone: "503-257-4743", website: "www.local516.org", email: "shopmens@pacifier.com", lat: 45.5202471, lng: -122.674194, address: "11620 N.E. Ainsworth Circle, Ste. 300,, Portland, OR 97220-9016" },
  { id: 40549, name: "IW Local 549", city: "Wheeling", state: "WV", phone: "304-232-2660", website: "www.iwlocal549.org", lat: 40.0579499, lng: -80.7261709, address: "2350 Main St., Wheeling, WV 26003" },
  { id: 40550, name: "IW Local 550", city: "Canton", state: "OH", phone: "330-455-5164", website: "www.iw550.org", lat: 40.7985464, lng: -81.3749508, address: "618 High Ave., N.W., Canton, OH 44703" },
  { id: 40568, name: "IW Local 568", city: "Cumberland", state: "MD", phone: "301-777-7433", website: "www.ironworkers568.org", lat: 39.6503221, lng: -78.7606075, address: "119 South Centre St., Cumberland, MD 21502" },
  { id: 40577, name: "IW Local 577", city: "Burlington", state: "IA", phone: "319-313-8581", website: "www.ironworkers577.org", email: "ironworkerslu577@gmail.com", lat: 40.4155906, lng: -91.4298407, address: "2700 Kindustry Park Rd., Keokuk, IA 52632" },
  { id: 40580, name: "IW Local 580", city: "New york", state: "NY", phone: "212-594-1662", website: "www.ironworkers580.org", lat: 40.760095, lng: -73.9958043, address: "501 West 42nd St., New York, NY 10036" },
  { id: 40584, name: "IW Local 584", city: "Tulsa", state: "OK", phone: "918-437-1446", website: "www.tulsaironworkers.com", email: "ironworkers584@sbcglobal.net", lat: 36.176988, lng: -95.8130502, address: "14716 E. Pine St, Tulsa, OK 74116" },
  { id: 40597, name: "IW Local 597", city: "Jacksonville", state: "FL", phone: "904-764-3265", website: "www.ironworkers597.com", email: "info@ironworkers597.com", lat: 30.4126052, lng: -81.6554177, address: "9616 Kentucky St., Jacksonville, FL 32218" },
  { id: 40623, name: "IW Local 623", city: "Baton rouge", state: "LA", phone: "225-357-3262", website: "www.ironworkerslocal623.org", email: "luke@local623.org", lat: 30.4993901, lng: -91.129287, address: "6153 Airline Highway, Baton Rouge, LA, 70805" },
  { id: 40625, name: "IW Local 625", city: "Honolulu", state: "HI", phone: "808-671-4344", lat: 21.4240421, lng: -158.0053143, address: "94-497 Ukee St., Waipahu, HI 96797" },
  { id: 40643, name: "IW Local 643", city: "Victoria", state: "BC", phone: "250-213-8661", email: "ironworkers643@outlook.com", lat: 48.4284, lng: -123.3656, address: "Unit 105, PO Box 613, 1497 Admirals Rd.,, Victoria, BC V9A 2P8" },
  { id: 40700, name: "IW Local 700", city: "Windsor", state: "CA", phone: "519-737-7110", website: "www.ironworkerslocal700.com", lat: 42.2858536, lng: -82.9780695, address: "R.R.#3, 4069 County Rd. #46, Maidstone, ON, N0R 1K0" },
  { id: 40704, name: "IW Local 704", city: "Chattanooga", state: "TN", phone: "423-622-2111", website: "www.iw704.com", email: "ironworkers704@iw704.com", lat: 35.074868, lng: -85.265402, address: "2715 Belle Arbor Ave., Chattanooga, TN, 37406" },
  { id: 40709, name: "IW Local 709", city: "Savannah", state: "GA", phone: "912-748-5118", website: "www.ironworkerslocal709.org", email: "bmc709@ymail.com", lat: 32.1057474, lng: -81.2218609, address: "131 Westside Blvd., Pooler, GA 31322" },
  { id: 40711, name: "IW Local 711", city: "Montreal", state: "QC", phone: "(514) 328-2808", website: "www.local711.ca/fr", email: "info@local711.ca", lat: 45.5017, lng: -73.5673, address: "9950 Boul. Du Golf, Anjou, QC H1J 2Y7" },
  { id: 40720, name: "IW Local 720", city: "Edmonton", state: "AB", phone: "780-482-0720", website: "www.ironworkers720.com", email: "admin@ironworkers720.com", lat: 53.5461, lng: -113.4938, address: "10512-122 St., Edmonton, AB T5N 1M6" },
  { id: 40721, name: "IW Local 721", city: "Toronto", state: "ON", phone: "416-236-4026", website: "iw721.org", lat: 43.6532, lng: -79.3832, address: "909 Kipling Ave., Etobicoke, ON M8Z 5H3" },
  { id: 40725, name: "IW Local 725", city: "Calgary", state: "AB", phone: "403-291-1300", website: "www.ironworkers725.com", lat: 51.0447, lng: -114.0719, address: "6111 36 St., S.E., Calgary, AB T2C 3W2" },
  { id: 40728, name: "IW Local 728", city: "Winnipeg", state: "MB", phone: "204-783-7853", website: "www.ironworkers728.com", email: "officeadmin@ironworkers728.com", lat: 49.8951, lng: -97.1384, address: "54B St. Paul Blvd., W. St. Paul, MB R2P 2W5" },
  { id: 40732, name: "IW Local 732", city: "Pocatello", state: "ID", phone: "208-232-4873", website: "www.iw732.org", lat: 42.874942, lng: -112.463554, address: "1700 N. Harrison Ave., Pocatello, ID 83204" },
  { id: 40736, name: "IW Local 736", city: "Hamilton", state: "ON", phone: "905-679-6439", website: "www.iw736.com", email: "steven.pratt@iw736.com", lat: 43.2557, lng: -79.8711, address: "1384 Osprey Dr., Ancaster, Ontario L9G 4V5" },
  { id: 40751, name: "IW Local 751", city: "Anchorage", state: "AK", phone: "(907) 563-4766", website: "www.ironworkers751.org", lat: 61.1477988, lng: -149.8754702, address: "8141 Schoon St, Anchorage, AK 99518" },
  { id: 40752, name: "IW Local 752", city: "Halifax", state: "NS", phone: "902-450-5615", website: "www.ironworkerslocal752.com", email: "iron.worker@ns.sympatico.ca", lat: 44.6488, lng: -63.5752, address: "24 Lakeside Park Dr., Unit 103, Lakeside,, Nova Scotia B3T 1L1" },
  { id: 40759, name: "IW Local 759", city: "Thunder bay", state: "ON", phone: "807-345-8151", website: "www.ironworkers759.org", email: "iw759@iw759.com", lat: 48.3809, lng: -89.2477, address: "915 Alloy Dr., Thunder Bay, ON P7B 5Z8" },
  { id: 40765, name: "IW Local 765", city: "Ottawa", state: "ON", phone: "613-821-7813", website: "www.ironworkers765.com", email: "local765@ironworkers765.com", lat: 45.4215, lng: -75.6972, address: "7771 Snake Island Rd., Metcalfe, ON K0A, 2P0" },
  { id: 40769, name: "IW Local 769", city: "Ashland", state: "KY", phone: "606-324-0415", website: "ironworkerslocal769.com", lat: 38.4784144, lng: -82.6379387, address: "2151 Greenup Ave., PO Box 289,, Ashland, KY 41105" },
  { id: 40771, name: "IW Local 771", city: "Regina", state: "SK", phone: "306-522-7932", website: "local771.ca", email: "jeff@local771.ca", lat: 50.45548, lng: -104.5667404, address: "1138 Dewdney Ave. E, Regina, SK S4N 0E2" },
  { id: 40782, name: "IW Local 782", city: "Paducah", state: "KY", phone: "270-442-2722", website: "ironworkers782.org", email: "ironworkerslo782@bellsouth.net", lat: 37.0930832, lng: -88.6336388, address: "2424 Cairo Rd., Paducah, KY 42001" },
  { id: 40786, name: "IW Local 786", city: "Sudbury", state: "ON", phone: "705-674-6903", website: "www.iw786.com", lat: 46.4917, lng: -80.993, address: "97 St. George St., Sudbury, ON P3C 2W7" },
  { id: 40787, name: "IW Local 787", city: "Parkersburg", state: "WV", phone: "304-485-6231", website: "www.ironworkers787.org", lat: 39.2667309, lng: -81.5620755, address: "303 Erickson Blvd., Parkersburg, WV 26101" },
  { id: 40798, name: "IW Local 798", city: "Mobile", state: "AL", phone: "(251) 645-2477", website: "www.ironworkers798.org", lat: 30.6913462, lng: -88.0437509, address: "7920 Crary Station Rd., Semmes, AL 36575" },
  { id: 40808, name: "IW Local 808", city: "Orlando", state: "FL", phone: "407-859-9366", website: "www.ironworkers808.com", lat: 28.4362007, lng: -81.3637164, address: "200 East Landstreet Rd., Orlando, FL 32824" },
  { id: 40809, name: "IW Local 809", city: "St john", state: "NB", phone: "506-343-6678", lat: 45.2787992, lng: -66.0585188, address: "407 Westmorland Rd., PO Box 26031, Saint, John, NB E2J 2S0" },
  { id: 40834, name: "IW Local 834", city: "Toronto", state: "ON", phone: "905-920-4331", website: "www.iw834.com", lat: 43.6532, lng: -79.3832 },
  { id: 40842, name: "IW Local 842", city: "St john", state: "NB", phone: "506-857-4871", website: "www.ironworkers842.ca", email: "administration@ironworkers842.ca", lat: 45.2787992, lng: -66.0585188, address: "1133 St. George Blvd., Ste. 450, Moncton, NB, E1E 4E1" },
  { id: 40845, name: "IW Local 845", city: "Fredericksburg", state: "MA", phone: "412-849-1271", website: "www.ironworkers845.org", email: "contact@ironworkers845.org", lat: 38.3031837, lng: -77.4605399, address: "PO Box 190, Beaver, PA 15009" },
  { id: 40846, name: "IW Local 846", city: "Aiken", state: "SC", phone: "803-644-2187", website: "www.iw846.org", lat: 33.506684, lng: -81.7385999, address: "6220 Woodside Executive Court, Aiken, SC, 29803" },
  { id: 40847, name: "IW Local 847", city: "Houston", state: "TX", phone: "713-984-9980", website: "ironworkers847.org", lat: 29.7589382, lng: -95.3676974, address: "16233 Clay Rd Suite 320 Houston, TX 77084" },
  { id: 40848, name: "IW Local 848", city: "Charleston", state: "SC", phone: "843-552-1554", website: "www.ironworkers848.org", lat: 32.927729, lng: -80.0647232, address: "7326 Pepperdam Ave., North Charleston, SC, 29418" },
  { id: 40852, name: "IW Local 852", city: "Framingham", state: "MA", phone: "(508) 202-9453", website: "ironworkers852.org", lat: 42.300743, lng: -71.438138, address: "9 Pleasant Street,, Framingham, MA 01701" },
  { id: 40854, name: "IW Local 854", city: "Fredricksburg", state: "VA", phone: "757) 461-3454", website: "ironworkers854.org", email: "iwlu854a@ironworkers.org", lat: 37.1508249, lng: -81.5850377, address: "415 William Street, Apt. B, Fredericksburg, VA 22401" }
];

// ─── LIUNA LOCALS DATABASE — Laborers' International Union of North America ───
const LIUNA_LOCALS = [];

// ─── UA LOCALS DATABASE — Plumbers & Pipefitters (source: unionpayscales.com) ─
const UA_LOCALS = [
  { id: 20001, name: "UA Local 1", city: "New york", state: "NY", phone: "718-738-7500", website: "www.ualocal1.org", lat: 40.7128, lng: -74.0059, address: "50-02 5TH ST 2ND FLR, LONG ISLAND CITY, NY 11101" },
  { id: 20003, name: "UA Local 3", city: "Denver", state: "CO", phone: "303-739-9300", website: "www.plumberslocal3.org", lat: 39.7392, lng: -104.9903, address: "17100 E 32ND PL, AURORA, CO 80011" },
  { id: 20004, name: "UA Local 4", city: "Worcester", state: "MA", phone: "508-835-1150", website: "ualocal4.com", lat: 42.2626, lng: -71.8023, address: "150 HARTWELL ST, WEST BOYLSTON, MA 01583" },
  { id: 20005, name: "UA Local 5", city: "Washington", state: "DC", phone: "301-899-7861", website: "local5plumbers.org", lat: 38.9072, lng: -77.0369, address: "4755 WALDEN LN, LANHAM, MD 20746," },
  { id: 20006, name: "UA Local 6", city: "Rochester", state: "MN", phone: "507-288-4172", website: "www.ualocal6.org", lat: 44.0440811, lng: -92.5093375, address: "3111 19TH ST NW, ROCHESTER, MN 55901" },
  { id: 20007, name: "UA Local 7", city: "Albany", state: "NY", phone: "518-785-9808", website: "www.ualocal7.org/our-plumbers-and-steamfitters", lat: 42.6526, lng: -73.7562, address: "18 AVIS DR, LATHAM, NY 12110" },
  { id: 20008, name: "UA Local 8", city: "Kansas city", state: "MO", phone: "816-363-8888", website: "plumberslocal8.com", lat: 39.0997, lng: -94.5786, address: "5950 MANCHESTER TRAFFICWAY STE 2, KANSAS CITY, MO 64130" },
  { id: 20009, name: "UA Local 9", city: "Central new", state: "JE", phone: "732-792-0999", website: "www.ualocal9.org", address: "2 IRON ORE RD AT RTE 33, ENGLISHTOWN, NJ 07726" , lat: 40.0583, lng: -74.4057},
  { id: 20010, name: "UA Local 10", city: "Richmond", state: "VA", phone: "804-231-4233", website: "ualocal10.com", lat: 37.5407, lng: -77.436, address: "701 STOCKTON ST, RICHMOND, VA 23224" },
  { id: 20011, name: "UA Local 11", city: "Duluth", state: "MN", phone: "218-727-2199", website: "ualocal11.com", lat: 46.8327687, lng: -92.1586897, address: "4402 AIRPARK BLVD, DULUTH, MN 55811" },
  { id: 20012, name: "UA Local 12", city: "Boston", state: "MA", phone: "617-288-6200", website: "www.plumbersandgasfitterslocal12.org", lat: 42.3601, lng: -71.0589, address: "1240 MASSACHUSETTS AVE, BOSTON, MA 02125" },
  { id: 20013, name: "UA Local 13", city: "Rochester", state: "NY", phone: "585-338-2360", website: "ualocal13.org", lat: 43.1566, lng: -77.6088, address: "1850 MT READ BLVD, ROCHESTER, NY 14615" },
  { id: 20015, name: "UA Local 15", city: "Minneapolis", state: "MN", phone: "612-333-8601", website: "www.plumberslocal15.com", lat: 44.9778, lng: -93.265, address: "8625 MONTICELLO LN N STE 1, MAPLE GROVE, MN 55369" },
  { id: 20016, name: "UA Local 16", city: "Omaha", state: "NE", phone: "402-734-6274", website: "www.plumberslocal16.org", lat: 41.2565, lng: -95.9345, address: "4801 F ST, OMAHA, NE 68117" },
  { id: 20017, name: "UA Local 17", city: "Memphis", state: "TN", phone: "901-368-0900", website: "ua17.org", lat: 35.1495, lng: -90.049, address: "4229 PRESCOTT RD, MEMPHIS, TN 38118" },
  { id: 20021, name: "UA Local 21", city: "Peekskill", state: "NY", phone: "914-737-2166", website: "local21union.com", lat: 41.271788, lng: -73.9321962, address: "1024 MCKINLEY ST, PEEKSKILL, NY 10566" },
  { id: 20022, name: "UA Local 22", city: "Buffalo", state: "NY", phone: "716-656-0220", website: "ualocal22.com", lat: 42.8864, lng: -78.8784, address: "120 GARDENVILLE PKWY, WEST SENECA, NY 14224" },
  { id: 20023, name: "UA Local 23", city: "Rockford", state: "IL", phone: "815-397-0350", website: "www.ualocal23.org", lat: 42.2177626, lng: -89.089344, address: "4525 BOEING DR, ROCKFORD, IL 61109" },
  { id: 20024, name: "UA Local 24", city: "Lodi", state: "NJ", phone: "973-521-7058", website: "plumbers24.org", lat: 40.8645717, lng: -74.2877487, address: "20 FAIRFIELD PL, WEST CALDWELL, NJ 07006" },
  { id: 20025, name: "UA Local 25", city: "Rock island", state: "IL", phone: "309-788-4569", website: "lu25.org", lat: 41.4646571, lng: -90.5629471, address: "4600 46TH AVE, ROCK ISLAND, IL 61201" },
  { id: 20026, name: "UA Local 26", city: "Western", state: "WA", phone: "360-486-9340", lat: 48.4527283, lng: -122.3474408, address: "780 CHRYSLER DR, BURLINGTON, WA 98233" },
  { id: 20027, name: "UA Local 27", city: "Pittsburgh", state: "PA", phone: "724-695-8175", website: "ua27.org", lat: 40.4406, lng: -79.9959, address: "1040 MONTOUR W IND PK, CORAOPOLIS, PA 15108" },
  { id: 20030, name: "UA Local 30", city: "Billings", state: "MT", phone: "406-252-9371", website: "www.ualocal30.com", lat: 45.7645245, lng: -108.509696, address: "317 WASHINGTON ST, BILLINGS, MT 59101" },
  { id: 20032, name: "UA Local 32", city: "Seattle", state: "WA", phone: "425-277-6680", website: "ualocal32.com", lat: 47.6062, lng: -122.3321, address: "597 MONSTER RD SW, RENTON, WA 98057" },
  { id: 20033, name: "UA Local 33", city: "Des moines", state: "IA", phone: "515-243-3244", website: "www.ualocal33.org", lat: 41.5868, lng: -93.625, address: "2501 BELL AVE, DES MOINES, IA 50321," },
  { id: 20034, name: "UA Local 34", city: "St. paul", state: "MN", phone: "651-224-3828", website: "www.plumberslocal34.org", lat: 44.9537, lng: -93.09, address: "353 W 7TH ST STE 104, ST. PAUL, MN 55102" },
  { id: 20038, name: "UA Local 38", city: "San francisco", state: "CA", phone: "415-626-2000", website: "www.ualocal38.org", lat: 37.7749, lng: -122.4194, address: "1621 MARKET ST, SAN FRANCISCO, CA 94103" },
  { id: 20041, name: "UA Local 41", city: "Butte", state: "MT", phone: "406-494-3051", website: "www.ualocal41.com", lat: 46.010387, lng: -112.5342275, address: "45 E SILVER ST, BUTTE, MT 59701" },
  { id: 20042, name: "UA Local 42", city: "Norwalk", state: "OH", phone: "419-668-4491", website: "ualocal42.com", lat: 41.2521678, lng: -82.588927, address: "65 GIBBS RD, NORWALK, OH 44857" },
  { id: 20043, name: "UA Local 43", city: "Chatanooga", state: "TN", phone: "423-698-6991", website: "ualocal43.org", lat: 35.0750529, lng: -85.2585176, address: "3009 RIVERSIDE DR, CHATTANOOGA, TN 37406" },
  { id: 20044, name: "UA Local 44", city: "Spokane", state: "WA", phone: "509-624-5101", website: "www.ua44.org", lat: 47.6588, lng: -117.426, address: "3915 E MAIN, SPOKANE, WA 99202" },
  { id: 20045, name: "UA Local 45", city: "St joseph", state: "MO", phone: "816-279-5534", lat: 39.7440799, lng: -94.8341533, address: "2329 S 22ND ST, ST. JOSEPH, MO 64503" },
  { id: 20046, name: "UA Local 46", city: "Toronto", state: "ON", phone: "416-759-6791", website: "www.ualocal46.org", address: "936 WARDEN AVE, SCARBOROUGH, ON M1L 4C9" , lat: 43.6532, lng: -79.3832},
  { id: 20050, name: "UA Local 50", city: "Toledo", state: "OH", phone: "419-662-5456", website: "ualocal50.com", lat: 41.6528, lng: -83.5379, address: "7570 CAPLE BLVD STE A, NORTHWOOD, OH 43619" },
  { id: 20051, name: "UA Local 51", city: "Providence", state: "RI", phone: "401-943-3033", website: "ualocal51.com", lat: 41.824, lng: -71.4128, address: "11 HEMINGWAY DR, EAST PROVIDENCE, RI 2915" },
  { id: 20052, name: "UA Local 52", city: "Montgomery", state: "AL", phone: "(334)-272-9500", website: "ualocal52.org", email: "info@ualocal52.org", lat: 32.3668, lng: -86.2999, address: "5563 WARES FERRY RD, MONTGOMERY, AL 36117" },
  { id: 20055, name: "UA Local 55", city: "Cleveland", state: "OH", phone: "216-459-0099", website: "www.plumbers55.com", lat: 41.4993, lng: -81.6944, address: "980 KEYNOTE CR, BROOKLYN HEIGHTS, OH 44131" },
  { id: 20056, name: "UA Local 56", city: "Halifax", state: "NO", phone: "902-466-9920", website: "ualocal56.ca", address: "31 RAGUS RD, DARTMOUTH, NS B2Y 4W5" , lat: 44.6488, lng: -63.5752},
  { id: 20058, name: "UA Local 58", city: "Colorado springs", state: "CO", phone: "719-633-4052", website: "local58.org", email: "info@local58.org", lat: 38.7987399, lng: -104.7944984, address: "2870 JANITELL RD, COLORADO SPRINGS, CO 80906" },
  { id: 20060, name: "UA Local 60", city: "New orleans", state: "LA", phone: "504-885-3054", website: "steamfitters-602.org", lat: 29.9511, lng: -90.0715, address: "3515 N I-10 SERVICE RD, METAIRIE, LA 70002" },
  { id: 20062, name: "UA Local 62", city: "Monterey", state: "CA", phone: "831-633-6091", website: "www.pipetrades62.com", lat: 36.6002, lng: -121.8947, address: "11445 COMMERCIAL PKWY, CASTROVILLE, CA 95012" },
  { id: 20063, name: "UA Local 63", city: "Peoria", state: "IL", phone: "309-699-3570", website: "plumberslocal63.com", lat: 40.6328773, lng: -89.5432455, address: "116 HARVEY CT, E PEORIA, IL 61611," },
  { id: 20067, name: "UA Local 67", city: "Hamilton", state: "ON", phone: "905-385-0043", website: "www.ualocal67.ca", address: "195 DARTNALL RD STE 104, HAMILTON, ON L8W 3V9" , lat: 43.2557, lng: -79.8711},
  { id: 20068, name: "UA Local 68", city: "Houston", state: "TX", phone: "713-869-3592", website: "www.plu68.com", lat: 29.7604, lng: -95.3698, address: "502 LINK RD, HOUSTON, TX 77009" },
  { id: 20071, name: "UA Local 71", city: "Ottawa / hull", state: "ON", phone: "613-728-5583", website: "ualocal71.com", address: "1250 AGES DR, OTTAWA, ON K1G 5T4" , lat: 43.6532, lng: -79.3832},
  { id: 20072, name: "UA Local 72", city: "Atlanta", state: "GA", phone: "404-373-5778", website: "ua72.org", lat: 33.749, lng: -84.388, address: "374 MAYNARD TER SE, ATLANTA, GA 30316" },
  { id: 20074, name: "UA Local 74", city: "", state: "DE", phone: "302-636-7400", website: "www.ualocal74.com/underconstruction.aspx", lat: 40.7087226, lng: -74.1753384, address: ", 201 EXECUTIVE DR, NEWARK, DE 19702" },
  { id: 20075, name: "UA Local 75", city: "Milwaukee", state: "WI", phone: "414-359-1310", website: "www.plumbers75.com", lat: 43.0389, lng: -87.9065, address: "11175 W PARKLAND AVE, MILWAUKEE, WI 53224" },
  { id: 20078, name: "UA Local 78", city: "Los", state: "AN", phone: "213-688-9090", website: "www.uaplumber78.com", address: "1111 W JAMES M WOOD BLVD, LOS ANGELES, CA 90015" , lat: 34.0522, lng: -118.2437},
  { id: 20081, name: "UA Local 81", city: "Syracuse", state: "NY", phone: "315-437-7397", website: "ualocal81.org", lat: 43.0481, lng: -76.1474, address: "107 TWIN OAKS DR, SYRACUSE, NY 13206" },
  { id: 20083, name: "UA Local 83", city: "Wheeling", state: "WV", phone: "304-233-4445", website: "ualocal83.com", lat: 40.0510496, lng: -80.7182717, address: "177 29TH ST, WHEELING, WV 26003" },
  { id: 20085, name: "UA Local 85", city: "Saginaw", state: "MI", phone: "989-799-5261", website: "ualocal85.org", lat: 43.4586649, lng: -83.975694, address: "3535 BAY RD, SAGINAW, MI 48603" },
  { id: 20091, name: "UA Local 91", city: "Birmingham", state: "AL", phone: "205-591-2721", website: "www.ua91.org", lat: 33.5186, lng: -86.8104, address: "3648 9TH AVE N, BIRMINGHAM, AL 35222" },
  { id: 20094, name: "UA Local 94", city: "Canton", state: "OH", phone: "330-478-1864", website: "plumbersandpipefitterslocalunion94.com", lat: 40.7887194, lng: -81.4209367, address: "3919 13TH ST SW, CANTON, OH 44710" },
  { id: 20098, name: "UA Local 98", city: "Detroit", state: "MI", phone: "248-307-9800", website: "ualocal98.org", lat: 42.3314, lng: -83.0458, address: "555 HORACE BROWN DR, MADISON HEIGHTS, MI 48071" },
  { id: 20099, name: "UA Local 99", city: "Bloomington", state: "IL", phone: "309-663-2337", website: "ua.org/location/lu-99-bloomington-il", lat: 40.4752779, lng: -88.9518207, address: "406 S ELDORADO RD, BLOOMINGTON, IL 61704" },
  { id: 20100, name: "UA Local 100", city: "Dallas", state: "TX", phone: "214-341-8606", website: "ualocal100.org", lat: 32.7767, lng: -96.797, address: "3010 INTERSTATE 30, MESQUITE, TX 75150" },
  { id: 20101, name: "UA Local 101", city: "Belleville", state: "IL", phone: "618-234-5504", website: "ualocal101.org", lat: 38.5046014, lng: -89.944551, address: "8 PREMIER DR, BELLEVILLE, IL 62220," },
  { id: 20102, name: "UA Local 102", city: "Knoxville", state: "TN", phone: "865-523-7413", website: "ualocal102.org", lat: 35.9606, lng: -83.9207, address: "1216 BROADWAY NE, KNOXVILLE, TN 37917" },
  { id: 20104, name: "UA Local 104", city: "Springfield", state: "MA", phone: "413-594-5152", website: "www.ualocal104.org", lat: 42.1015, lng: -72.5898, address: "86 LOWER WESTFIELD RD, HOLYOKE, MA 01040" },
  { id: 20110, name: "UA Local 110", city: "Norfolk", state: "VA", phone: "757-587-4768", website: "ualocal110.org", lat: 36.8508, lng: -76.2859, address: "520 NAVAL BASE RD, NORFOLK, VA 23505" },
  { id: 20111, name: "UA Local 111", city: "Escanaba", state: "MI", phone: "906-789-9784", website: "lu111.com", lat: 45.776974, lng: -87.090285, address: "2601 N 30TH ST, ESCANABA, MI 49829" },
  { id: 20112, name: "UA Local 112", city: "Binghamton", state: "NY", phone: "607-723-9593", website: "www.ualocal112.org", lat: 42.1053022, lng: -75.892859, address: "11 GRISWOLD ST, BINGHAMTON, NY 13904" },
  { id: 20114, name: "UA Local 114", city: "Santa barbara", state: "CA", phone: "805-688-1470", website: "www.ualocal114.org", lat: 34.6213931, lng: -120.1872029, address: "93 THOMAS RD, BUELLTON, CA 93427," },
  { id: 20118, name: "UA Local 118", city: "Racine", state: "WI", phone: "262-654-3815", website: "www.ualocal118.com", lat: 42.7313756, lng: -87.7834769, address: "3030 39TH AVE RM 112, KENOSHA, WI 53144" },
  { id: 20119, name: "UA Local 119", city: "Mobile", state: "AL", phone: "251-476-0625", website: "ualocal119.org", email: "bm@ualocal119.org", lat: 30.6898309, lng: -88.0976717, address: "2458 OLD SHELL RD, MOBILE, AL 36607" },
  { id: 20120, name: "UA Local 120", city: "Cleveland", state: "OH", phone: "216-447-3408", website: "pipefitters120.org", lat: 41.4993, lng: -81.6944, address: "6305 HALLE DR, CLEVELAND, OH 44125" },
  { id: 20123, name: "UA Local 123", city: "Tampa", state: "FL", phone: "813-636-0123", website: "lu123.com", lat: 27.9506, lng: -82.4572, address: "3601 N MCINTOSH RD, DOVER, FL 33527" },
  { id: 20125, name: "UA Local 125", city: "Cedar rapids", state: "IA", phone: "319-365-0413", website: "www.ualocal125.org", lat: 41.9779, lng: -91.6656, address: "5001 J ST SW STE 200, CEDAR RAPIDS, IA 52404" },
  { id: 20128, name: "UA Local 128", city: "Schenectady", state: "NY", phone: "518-381-0819", lat: 42.8142432, lng: -73.9395687, address: "348 DUANESBURY RD, SCHENECTADY, NY 12306" },
  { id: 20130, name: "UA Local 130", city: "Chicago", state: "IL", phone: "312-421-1010", website: "plumberslu130ua.com", lat: 41.8781, lng: -87.6298, address: "1340 W WASHINGTON BLVD 2ND FLR, CHICAGO, IL 60607" },
  { id: 20131, name: "UA Local 131", city: "Concord-manchester", state: "NH", phone: "603-669-7307", website: "www.ualu131.org", lat: 43.0342364, lng: -71.4123212, address: "161 LONDONDERRY TPKE, HOOKSETT, NH 3106" },
  { id: 20136, name: "UA Local 136", city: "Evansville", state: "IN", phone: "812-423-8043", website: "www.ualocal136.org", lat: 37.970495, lng: -87.5715641, address: "2300 ST JOSEPH IND PK DR, EVANSVILLE, IN 47720" },
  { id: 20137, name: "UA Local 137", city: "Springfield", state: "IL", phone: "217-544-2724", website: "www.ua137.org", lat: 39.7942307, lng: -89.6098286, address: ", 2880 E COOK ST, SPRINGFIELD, IL 62703" },
  { id: 20140, name: "UA Local 140", city: "Salt lake city", state: "UT", phone: "801-973-6784", website: "www.ua140.com", lat: 40.7608, lng: -111.891, address: "2261 S REDWOOD RD STE 5, SALT LAKE CITY, UT 84119" },
  { id: 20141, name: "UA Local 141", city: "Shreveport", state: "LA", phone: "318-671-1175", website: "local141welfare.com/home", lat: 32.5252, lng: -93.7502, address: "7111 W BERT KOUNS INDUSTRIAL LOOP, SHREVEPORT, LA 71129" },
  { id: 20142, name: "UA Local 142", city: "San antonio", state: "TX", phone: "210-226-1244", website: "www.local142.org", lat: 29.4241, lng: -98.4936, address: "3630 BELGIUM LN, SAN ANTONIO, TX 78219" },
  { id: 20144, name: "UA Local 144", city: "Montreal", state: "QC", phone: "514-385-1171", website: "www.local144.ca", address: "12780 BD INDESTRIEL, POINTE-AUX-TREMBLES, QC H1A 3V2" , lat: 45.5017, lng: -73.5673},
  { id: 20145, name: "UA Local 145", city: "Grand junction", state: "CO", phone: "970-245-2012", website: "www.local145.org", lat: 39.0624164, lng: -108.4650666, address: "3168 PIPE CT, GRAND JUNCTION, CO 81504" },
  { id: 20146, name: "UA Local 146", city: "Fort worth", state: "TX", phone: "817-536-1979", website: "ualocal146.org", lat: 32.7555, lng: -97.3308, address: "9920 WHITE SETTLEMENT RD, FORT WORTH, TX 76108" },
  { id: 20149, name: "UA Local 149", city: "Champaign", state: "IL", phone: "217-359-5201", website: "ualocal149.com", lat: 40.1164841, lng: -88.2430932, address: "1003 N DULAP AVE, SAVOY, IL 61874," },
  { id: 20150, name: "UA Local 150", city: "Augusta", state: "GA", phone: "706-724-8846", website: "ua150.org", lat: 33.4748553, lng: -81.9746052, address: "1211 TELFAIR ST, AUGUSTA, GA 30901" },
  { id: 20152, name: "UA Local 152", city: "Morgantown", state: "WV", phone: "304-292-8818", website: "local152.com", lat: 39.6296809, lng: -79.9559437, address: "100 RICHARD ST, MORGANTOWN, WV 26501" },
  { id: 20155, name: "UA Local 155", city: "", state: "AR", phone: "501-374-4943", website: "ua.org/location/lu-155-state-of-arkansas", lat: 34.7498325, lng: -92.2837709, address: "1223 W MARKHAM, LITTLE ROCK, AR 72201" },
  { id: 20157, name: "UA Local 157", city: "Terre haute", state: "IN", phone: "812-877-1531", website: "ualocal157.org", lat: 39.4667025, lng: -87.4139119, address: "8801 E MILNER AVE, TERRE HAUTE, IN 47803" },
  { id: 20159, name: "UA Local 159", city: "Martinez", state: "CA", phone: "925-229-0400", website: "www.ualocal159.org", lat: 37.9935371, lng: -122.1082599, address: "1308 ROMAN WAY, MARTINEZ, CA 94553" },
  { id: 20160, name: "UA Local 160", city: "Carbondale", state: "IL", phone: "618-684-4521", website: "ualocal160.com", lat: 37.7274692, lng: -89.216655, address: "901 MULLBERY ST, MURPHYSBORO, IL 62966," },
  { id: 20162, name: "UA Local 162", city: "Dayton", state: "OH", phone: "937-222-8747", website: "www.ua162.org", lat: 39.7589, lng: -84.1916, address: "1200 E 2ND ST, DAYTON, OH 45403" },
  { id: 20166, name: "UA Local 166", city: "Fort wayne", state: "IN", phone: "260-490-5696", website: "www.ualocal166.org", lat: 41.1392032, lng: -85.1898319, address: "2930 W LUDWIG RD, FORT WAYNE, IN 46818" },
  { id: 20168, name: "UA Local 168", city: "Marietta", state: "OH", phone: "740-373-7965", website: "ualocal168.org", lat: 39.4167742, lng: -81.4548392, address: "300 COMMERCE DR, MARIETTA, OH 45750" },
  { id: 20170, name: "UA Local 170", city: "Vancouver", state: "BC", phone: "604-526-0441", website: "ualocal170.com", address: "1658 FOSTER'S WAY STE 201, ANNACIS ISLAND DELTA, BC V3M 6S6" , lat: 49.2827, lng: -123.1207},
  { id: 20172, name: "UA Local 172", city: "South bend", state: "IN", phone: "574-273-0300", website: "www.ua172.org", lat: 41.7330897, lng: -86.300641, address: "4172 RALPH JONES CT, SOUTH BEND, IN 46628" },
  { id: 20174, name: "UA Local 174", city: "West", state: "MI", phone: "616-837-0222", website: "ua174.org", lat: 43.0566106, lng: -85.9533584, address: "1008 O'MALLEY DR, COOPERSVILLE, MI 49404" },
  { id: 20177, name: "UA Local 177", city: "Brunswick", state: "GA", phone: "912-265-1890", website: "www.ualocal177.org", lat: 31.1499528, lng: -81.4914894, address: "6148 NEW JESSUP HWY STE 341, BRUNSWICK, GA 31523" },
  { id: 20178, name: "UA Local 178", city: "Springfield", state: "MO", phone: "417-869-0633", website: "ua178.org", lat: 37.197385, lng: -93.326542, address: "2501 W GRAND, SPRINGFIELD, MO 65802" },
  { id: 20179, name: "UA Local 179", city: "Montreal", state: "QC", phone: "306-569-0624", website: "ualocal179.ca", address: "402 SOLOMON DR, REGINA, SK S4N 5A8" , lat: 45.5017, lng: -73.5673},
  { id: 20183, name: "UA Local 183", city: "Milwaukee", state: "WI", phone: "262-252-0183", website: "sprinklerfitters183.org", lat: 43.0389, lng: -87.9065, address: "W175 N5700 TECHNOLOGY DR, MENOMONEE FALLS, WI 53051" },
  { id: 20184, name: "UA Local 184", city: "Paducah", state: "KY", phone: "270-442-3213", website: "kypipetrades.com/about-us", lat: 37.0827486, lng: -88.6081117, address: "1127 BROADWAY ST, PADUCAH, KY 42001" },
  { id: 20188, name: "UA Local 188", city: "Savannah", state: "GA", phone: "912-354-5520", website: "localunion188.com", lat: 32.0366623, lng: -81.0568154, address: "2337 E VICTORY DR, SAVANNAH, GA 31404" },
  { id: 20189, name: "UA Local 189", city: "Columbus", state: "OH", phone: "614-486-2912", website: "ualocal189.com", lat: 39.9612, lng: -82.9988, address: "1250 KINNEAR RD, COLUMBUS, OH 43212" },
  { id: 20190, name: "UA Local 190", city: "Ann arbor", state: "MI", phone: "734-424-0962", website: "www.ua190.org", lat: 42.2813722, lng: -83.7484616, address: "7920 JACKSON RD STE B, ANN ARBOR, MI 48103" },
  { id: 20192, name: "UA Local 192", city: "Cheyanne", state: "WY", phone: "307-634-5837", website: "www.plumbers192.org", lat: 41.1219013, lng: -104.8116254, address: "411 W 5TH ST, CHEYENNE, WY 82007," },
  { id: 20198, name: "UA Local 198", city: "Baton rouge", state: "LA", phone: "225-356-3333", website: "local198.org", lat: 30.4515, lng: -91.1871, address: "5888 AIRLINE HWY, BATON ROUGE, LA 70805" },
  { id: 20200, name: "UA Local 200", city: "Nassau-suffolk", state: "NY", phone: "631-981-2158", website: "www.plu200ua.org", lat: 40.6840621, lng: -73.4605274, address: "2123 5TH AVE, RONKONKOMA, NY 11779" },
  { id: 20208, name: "UA Local 208", city: "Denver", state: "CO", phone: "303-428-4380", website: "www.pipe208.com", lat: 39.7392, lng: -104.9903, address: "6350 N BROADWAY STE 1, DENVER, CO 80216" },
  { id: 20210, name: "UA Local 210", city: "Hobart", state: "IN", phone: "219-942-7224", website: "www.plu210.org", lat: 41.5322592, lng: -87.2550353, address: "2901 E 83RD PL, MERRILLVILLE, IN 46410" },
  { id: 20211, name: "UA Local 211", city: "Houston", state: "TX", phone: "713-644-5521", website: "www.pipefitterslocal211.com", lat: 29.7604, lng: -95.3698, address: "1301 W 13TH ST STE A, DEER PARK, TX 77536" },
  { id: 20213, name: "UA Local 213", city: "St john", state: "NB", phone: "506-635-1605", website: "ualocal213.ca", address: "351 KING WILLIAM RD SPRUCE LAKE IND PK, ST. JOHN, NB E2M 7C9" , lat: 45.9636, lng: -66.6431},
  { id: 20219, name: "UA Local 219", city: "Akron", state: "OH", phone: "330-253-9166", website: "akron219.com", lat: 41.0814, lng: -81.519, address: "1655 BRITTAIN RD, AKRON, OH 44310" },
  { id: 20228, name: "UA Local 228", city: "Marysville", state: "CA", phone: "530-673-8690", website: "www.lu228.org", lat: 39.1466581, lng: -121.5837623, address: "1015 YUBA ST, MARYSVILLE, CA 95901," },
  { id: 20230, name: "UA Local 230", city: "San diego", state: "CA", phone: "858-554-0586", website: "www.ualocal230.org", lat: 32.7157, lng: -117.1611, address: "6313 NANCY RIDGE DR, SAN DIEGO, CA 92121" },
  { id: 20234, name: "UA Local 234", city: "Jacksonville", state: "FL", phone: "904-786-0941", website: "ua234.com", lat: 30.3322, lng: -81.6557, address: "5411 CASSIDY RD, JACKSONVILLE, FL 32254" },
  { id: 20246, name: "UA Local 246", city: "Fresno", state: "CA", phone: "559-252-7246", website: "local246.com", lat: 36.7378, lng: -119.7871, address: "1303 N RABE AVE STE 101, FRESNO, CA 93727" },
  { id: 20247, name: "UA Local 247", city: "Alexandria", state: "LA", phone: "318-442-9923", website: "ua.org/location/lu-247-alexandria-la", lat: 31.2917859, lng: -92.5343162, address: "249 MCKEITHEN DR, ALEXANDRIA, LA 71303" },
  { id: 20248, name: "UA Local 248", city: "Ashland", state: "KY", phone: "606-325-2544", website: "local248.com", lat: 38.4835075, lng: -82.6462599, address: "924 GREENUP AVE, ASHLAND, KY 41101" },
  { id: 20250, name: "UA Local 250", city: "Los angeles", state: "CA", phone: "310-660-0035", website: "www.ua250.org", lat: 34.0522, lng: -118.2437, address: "18355 S FIGUEROA ST, GARDENA, CA 90248" },
  { id: 20254, name: "UA Local 254", city: "Winnipeg", state: "MB", phone: "204-947-0497", website: "ua254.ca", address: "20 DUNLOP AVE, WINNIPEG, MB R2X 2M3" , lat: 49.8951, lng: -97.1384},
  { id: 20262, name: "UA Local 262", city: "Juneau", state: "AK", phone: "907-586-2874", website: "www.local392.com", lat: 58.3580061, lng: -134.4935529, address: "1751 ANKA ST, JUNEAU, AK 99801" },
  { id: 20268, name: "UA Local 268", city: "St. louis", state: "MO", phone: "314-241-8023", website: "www.sprinklerfitters268.org", lat: 38.627, lng: -90.1994, address: "1544 S 3RD ST, ST. LOUIS, MO 63104" },
  { id: 20272, name: "UA Local 272", city: "Portsmouth", state: "VA", phone: "757-537-0765", website: "ua.org/location/lu-272-portsmouth-va", lat: 36.8905484, lng: -76.3818102, address: "5664 RIVERMILL CIR, PORTSMOUTH, VA 23707" },
  { id: 20274, name: "UA Local 274", city: "Jersey city", state: "NJ", phone: "201-943-4700", website: "www.pipefitters274.org", lat: 40.857103, lng: -74.4149317, address: "205 JEFFERSON RD, PARSIPPANY, NJ 07054" },
  { id: 20281, name: "UA Local 281", city: "Chicago", state: "IL", phone: "708-597-1800", website: "sprinklerfitterchicago.org", lat: 41.8781, lng: -87.6298, address: "11900 S LARAMIE AVE, ALSIP, IL 60803" },
  { id: 20282, name: "UA Local 282", city: "Halifax", state: "NO", phone: "902-830-9175", address: "52 ESSEX DR, HERRING COVE, NS B3V 1H8" , lat: 44.6488, lng: -63.5752},
  { id: 20286, name: "UA Local 286", city: "Austin", state: "TX", phone: "512-385-0002", website: "local286.org", lat: 30.2672, lng: -97.7431, address: "814 AIRPORT BLVD, AUSTIN, TX 78702" },
  { id: 20290, name: "UA Local 290", city: "Portland", state: "OR", phone: "503-691-5700", website: "ua290.org", lat: 45.5051, lng: -122.675, address: "20210 SW TETON AVE, TUALATIN, OR 97062" },
  { id: 20292, name: "UA Local 292", city: "Montreal", state: "QC", phone: "514-721-9112", address: "5333 SHERBROOKE ST E Apt B122, MONTREAL, QB H1T 4B6" , lat: 45.5017, lng: -73.5673},
  { id: 20295, name: "UA Local 295", city: "Daytona", state: "FL", phone: "386-253-9972", website: "ualocal295.com", lat: 29.2267239, lng: -81.025504, address: "743 N BEACH ST, DAYTONA BEACH, FL 32114" },
  { id: 20296, name: "UA Local 296", city: "Boise", state: "ID", phone: "208-288-1296", website: "www.ualocal296.org", lat: 43.615, lng: -116.2023, address: "575 N RALSTIN STE A, MERIDIAN, ID 83642" },
  { id: 20300, name: "UA Local 300", city: "North and south", state: "DA", phone: "701-663-0999", website: "www.ua300.com", address: "2901 TWIN CITY DR STE 101, MANDAN, ND 58554" , lat: 44.2998, lng: -99.4388},
  { id: 20314, name: "UA Local 314", city: "Kansas city", state: "MO", phone: "816-444-5113", website: "sprinklerfitters314.org", lat: 39.0997, lng: -94.5786, address: "8510 HILLCREST RD, KANSAS CITY, MO 64138" },
  { id: 20322, name: "UA Local 322", city: "Southern new", state: "JE", phone: "609-567-3322", website: "www.ua322.org", address: "534 S RTE 73, WINSLOW, NJ 08095" , lat: 39.7589, lng: -74.9857},
  { id: 20324, name: "UA Local 324", city: "Victoria", state: "BC", phone: "250-382-0415", website: "ua324.com", address: "2759 LEIGH RD, LANGFORD, BC V9B 4G2" , lat: 48.4284, lng: -123.3656},
  { id: 20325, name: "UA Local 325", city: "Fredericton", state: "NB", phone: "506-459-6044", website: "ualocal325.ca", address: "5 BLIZZARD ST, FREDERICTON, NB E3B 8K3" , lat: 45.9636, lng: -66.6431},
  { id: 20333, name: "UA Local 333", city: "Lansing", state: "MI", phone: "517-393-5480", website: "ua333.org", lat: 42.7338254, lng: -84.5546295, address: "5405 S MARTIN L KING JR BLVD, LANSING, MI 48911" },
  { id: 20340, name: "UA Local 340", city: "Minneapolis", state: "MN", phone: "612-379-3241", website: "www.gasworkerslocal340.com", lat: 44.9778, lng: -93.265, address: "312 CENTRAL AVE RM 592, MINNEAPOLIS, MN 55414" },
  { id: 20342, name: "UA Local 342", city: "Oakland", state: "CA", phone: "925-686-5880", website: "www.ua342.org", lat: 37.950789, lng: -122.0282982, address: "935 DETROIT AVE, CONCORD, CA 94518," },
  { id: 20343, name: "UA Local 343", city: "Napa", state: "CA", phone: "707-644-4071", website: "www.local343.org", lat: 38.3498504, lng: -121.9779738, address: "220 PEABODY RD, VACAVILLE, CA 95687," },
  { id: 20344, name: "UA Local 344", city: "Oklahoma city", state: "OK", phone: "405-682-4571", website: "portal.issisystems.com/isite208/eremit.dll/20801/cm.asp?name=home", lat: 35.4676, lng: -97.5164, address: "4335 SW 44TH ST, OKLAHOMA CITY, OK 73119" },
  { id: 20345, name: "UA Local 345", city: "Los angeles", state: "CA", phone: "626-357-9345", website: "www.ua345.org", lat: 34.0522, lng: -118.2437, address: "1430 HUNTINGTON DR, DUARTE, CA 91010" },
  { id: 20350, name: "UA Local 350", city: "Reno", state: "NV", phone: "775-359-2142", website: "www.ualocal350.org", lat: 39.5296, lng: -119.8138, address: "1110 GREG ST, SPARKS, NV 89431" },
  { id: 20353, name: "UA Local 353", city: "Peoria", state: "IL", phone: "309-633-1353", website: "steamfitters353.com", lat: 40.6910774, lng: -89.6936977, address: "6304 W DEVELOPMENT DR, PEORIA, IL 61604" },
  { id: 20354, name: "UA Local 354", city: "Latrobe", state: "PA", phone: "724-925-7238", website: "www.lu354.com", lat: 40.317287, lng: -79.3840301, address: "271 ARMBRUST RD, YOUNGWOOD, PA 15697" },
  { id: 20355, name: "UA Local 355", city: "Burlingame", state: "CA", phone: "707-644-0355", website: "ua.org/location/lu-355-burlingame-ca", lat: 38.1091425, lng: -122.2576008, address: "426 ALABAMA ST, VALLEJO, CA 94590" },
  { id: 20357, name: "UA Local 357", city: "Kalamazoo", state: "MI", phone: "269-679-2570", website: "www.ualocal357.com", lat: 42.1455107, lng: -85.6373795, address: "11847 SHAVER RD, SCHOOLCRAFT, MI 49087," },
  { id: 20360, name: "UA Local 360", city: "East st louis", state: "IL", phone: "618-346-2560", website: "ualocal360.net", lat: 38.6268666, lng: -90.159707, address: "5 MEADOW HGTS PROFESSIONAL PARK, COLLINSVILLE, IL 62234," },
  { id: 20364, name: "UA Local 364", city: "Colton", state: "CA", phone: "909-825-0359", website: "www.ualocal364.com", lat: 34.0645773, lng: -117.3352318, address: "223 S RANCHO AVE, COLTON, CA 92324" },
  { id: 20367, name: "UA Local 367", city: "Anchorage", state: "AK", phone: "907-562-2810", website: "ualocal367.org", lat: 61.2181, lng: -149.9003, address: "610 W 54TH AVE, ANCHORAGE, AK 99518" },
  { id: 20370, name: "UA Local 370", city: "Flint", state: "MI", phone: "810-720-5243", website: "ualocal370.org", lat: 42.8634155, lng: -83.7170249, address: "2151 W THOMPSON RD, FENTON, MI 48430" },
  { id: 20372, name: "UA Local 372", city: "Tuscaloosa", state: "AL", phone: "205-758-6236", website: "www.ualocal372.org", lat: 33.2095614, lng: -87.5675258, address: "9410 HWY 82 E, DUNCANVILLE, AL 35456" },
  { id: 20373, name: "UA Local 373", city: "Rockland county", state: "NY", phone: "845-534-1050", website: "ua373.com", lat: 41.4070857, lng: -74.0747895, address: "76 PLEASANT HILL RD, MOUNTAINVILLE, NY 10953" },
  { id: 20375, name: "UA Local 375", city: "Fairbanks", state: "AK", phone: "907-479-6221", website: "ualocal375.org/index.html", lat: 64.8383308, lng: -147.8293896, address: "3980 BOAT ST, FAIRBANKS, AK 99709" },
  { id: 20376, name: "UA Local 376", city: "Norfolk", state: "VA", phone: "757-270-1608", website: "ua.org/location/lu-376-norfolk-va", lat: 36.8508, lng: -76.2859, address: "1005 GREEN ST, NORFOLK, VA 23513" },
  { id: 20392, name: "UA Local 392", city: "Cincinnati", state: "OH", phone: "513-241-1760", website: "www.local392.com", lat: 39.1031, lng: -84.512, address: "1228 CENTRAL PKWY RM 200, CINCINNATI, OH 45202" },
  { id: 20393, name: "UA Local 393", city: "San jose", state: "CA", phone: "408-225-3030", website: "ualocal393.org", lat: 37.3382, lng: -121.8863, address: "6299 SAN IGNACIO AVE, SAN JOSE, CA 95119" },
  { id: 20396, name: "UA Local 396", city: "Boardman", state: "OH", phone: "330-758-4596", website: "ualocal396.org", lat: 41.0242256, lng: -80.6628528, address: "493 BEV RD BLDG 3, BOARDMAN, OH 44512" },
  { id: 20398, name: "UA Local 398", city: "Pomona", state: "CA", phone: "909-945-5557", website: "local398.org", lat: 34.0553813, lng: -117.7517496, address: "8590 UTICA AVE STE 200, RANCHO CUCAMONGA, CA 91730" },
  { id: 20400, name: "UA Local 400", city: "Appleton", state: "WI", phone: "920-462-0400", website: "ua400.org", lat: 44.2613967, lng: -88.4069744, address: "2700 NORTHRIDGE DR, KAUKAUNA, WI 54130" },
  { id: 20401, name: "UA Local 401", city: "Eastern-central", state: "ON", phone: "905-623-1666", website: "www.ualocal401.ca", address: "26 CARISTRAP ST UNIT 3, BOWMANVILLE, ON L1C 3Y7" , lat: 43.6532, lng: -79.3832},
  { id: 20403, name: "UA Local 403", city: "San luis obispo", state: "CA", phone: "805-543-2416", website: "www.ua403.org", lat: 35.2521413, lng: -120.6450368, address: "3710 BROAD ST, SAN LUIS OBISPO, CA 93401" },
  { id: 20404, name: "UA Local 404", city: "Northwest", state: "TE", phone: "806-744-3835", website: "ualocal404.org", address: "510 AVE G, LUBBOCK, TX 79401" , lat: 62.454, lng: -114.3718},
  { id: 20412, name: "UA Local 412", city: "Albuquerque", state: "NM", phone: "505-265-1513", website: "ualocal412.org", lat: 35.0844, lng: -106.6504, address: "510 SAN PEDRO DR SE, ALBUQUERQUE, NM 87108," },
  { id: 20417, name: "UA Local 417", city: "Minneapolis", state: "MN", phone: "612-781-5804", website: "www.local417.com", lat: 44.9778, lng: -93.265, address: "529 COUNTY RD EW, SHOREVIEW, MN 55126" },
  { id: 20420, name: "UA Local 420", city: "Philadephia", state: "PA", phone: "267-350-4200", website: "www.lu420.com", lat: 40.1057144, lng: -74.9797534, address: "14420 TOWNSEND RD, PHILADELPHIA, PA 19154" },
  { id: 20421, name: "UA Local 421", city: "Charleston", state: "SC", phone: "843-554-3655", website: "ualocal421.org", lat: 32.8559821, lng: -80.0200365, address: "2556 OSCAR JOHNSON DR, NORTH CHARLESTON, SC 29405" },
  { id: 20430, name: "UA Local 430", city: "Tulsa", state: "OK", phone: "918-836-0430", website: "ua430.com", lat: 36.154, lng: -95.9928, address: "2908 N HARVARD AVE, TULSA, OK 74115" },
  { id: 20434, name: "UA Local 434", city: "Central and western", state: "WI", phone: "715-692-4341", website: "www.ualocal434.org", lat: 44.7924351, lng: -89.6690491, address: "912 N VIEW DR, MOSINEE, WI 54455" },
  { id: 20436, name: "UA Local 436", city: "Pascagoula", state: "MS", phone: "228-762-2972", website: "ua.org/location/lu-436-pascagoula-ms", lat: 30.3656378, lng: -88.5509737, address: "1307 JACKSON AVE, PASCAGOULA, MS 39567" },
  { id: 20439, name: "UA Local 439", city: "East st louis", state: "IL", phone: "618-624-6096", lat: 38.6268666, lng: -90.159707, address: ", 1220 DONALD BAILEY DR, CASEYVILLE, IL 62232" },
  { id: 20440, name: "UA Local 440", city: "Indianapolis", state: "IN", phone: "317-856-3771", website: "www.ualocal440.org", lat: 39.7684, lng: -86.1581, address: "1521 BROOKVILLE CROSSING WAY, INDIANAPOLIS, IN 46239" },
  { id: 20441, name: "UA Local 441", city: "Wichita", state: "KS", phone: "316-265-4291", website: "www.ua441.org", lat: 37.6872, lng: -97.3301, address: "529 S ANNA ST, WICHITA, KS 67209," },
  { id: 20442, name: "UA Local 442", city: "Stockton", state: "CA", phone: "209-338-0751", website: "www.lu442.com", lat: 37.9577, lng: -121.2908, address: "4842 NUTCRACKER LN, MODESTO, CA 95356" },
  { id: 20447, name: "UA Local 447", city: "Sacramento", state: "CA", phone: "916-457-6595", website: "www.ualocal447.org", lat: 38.5816, lng: -121.4944, address: "5841 NEWMAN CT, SACRAMENTO, CA 95819" },
  { id: 20449, name: "UA Local 449", city: "Pittsburgh", state: "PA", phone: "412-381-1133", website: "ua449.com", lat: 40.4406, lng: -79.9959, address: "232 WISE RD STE 200, HARMONY, PA 16037" },
  { id: 20452, name: "UA Local 452", city: "Lexington", state: "KY", phone: "859-252-8337", website: "www.plumbersandpipefitters452.com", lat: 38.065346, lng: -84.557059, address: "701 ALLENRIDGE POINT, LEXINGTON, KY 40510" },
  { id: 20455, name: "UA Local 455", city: "St. paul", state: "MN", phone: "651-455-0455", website: "local455.com", lat: 44.9537, lng: -93.09, address: "1301 L'ORIENT ST STE 100, ST. PAUL, MN 55117" },
  { id: 20459, name: "UA Local 459", city: "Missoula", state: "MT", phone: "406-549-3479", website: "ua.org/location/lu-459-missoula-mt", lat: 46.865095, lng: -114.0116002, address: "1026 S 5TH ST W, MISSOULA, MT 59801" },
  { id: 20460, name: "UA Local 460", city: "Bakersfield", state: "CA", phone: "661-589-4600", website: "www.local460.com", lat: 35.3733, lng: -119.0187, address: "6718 MEANY AVE, BAKERSFIELD, CA 93308" },
  { id: 20464, name: "UA Local 464", city: "Omaha", state: "NE", phone: "402-333-5859", website: "lu464.org", lat: 41.2565, lng: -95.9345, address: "3375 OAKVIEW DR, OMAHA, NE 68144" },
  { id: 20467, name: "UA Local 467", city: "San mateo", state: "CA", phone: "650-692-4730", website: "www.ualocal467.org", lat: 37.5919693, lng: -122.3713073, address: "1519 ROLLINS RD, BURLINGAME, CA 94010" },
  { id: 20469, name: "UA Local 469", city: "Phoenix", state: "AZ", phone: "602-956-9350", website: "ualocal469.org", lat: 33.4484, lng: -112.074, address: "3109 N 24TH ST BLDG A, PHOENIX, AZ 85016" },
  { id: 20473, name: "UA Local 473", city: "Jesup", state: "GA", phone: "912-321-2919", website: "ua.org/location/lu-473-jesup-ga", lat: 31.6074365, lng: -81.8853924, address: "113 OLIVER LN, JESUP, GA 31545" },
  { id: 20475, name: "UA Local 475", city: "Newark", state: "NJ", phone: "908-754-1030", website: "ualocal475.org", lat: 40.7357, lng: -74.1724, address: "136 MT BETHEL RD, WARREN, NJ 07059" },
  { id: 20477, name: "UA Local 477", city: "Portsmouth", state: "VA", phone: "757-617-1180", website: "ua.org/location/lu-477-portsmouth-va", lat: 36.972233, lng: -76.6109867, address: "1205 WILSON RD, SMITHFIELD, VA 23430" },
  { id: 20483, name: "UA Local 483", city: "San francisco", state: "CA", phone: "510-785-8483", website: "www.sprinklerfitters483.org", lat: 37.7749, lng: -122.4194, address: "2525 BARRINGTON CT, HAYWARD, CA 94545" },
  { id: 20484, name: "UA Local 484", city: "Ventura", state: "CA", phone: "805-643-6345", website: "www.ualocal484.org", lat: 34.3005343, lng: -119.2950851, address: "1955 N VENTURA AVE, VENTURA, CA 93001" },
  { id: 20486, name: "UA Local 486", city: "Baltimore", state: "MD", phone: "410-866-4380", website: "ualocal486.com", lat: 39.2904, lng: -76.6122, address: "8100 SANDPIPER CR STE 200, BALTIMORE, MD 21236" },
  { id: 20488, name: "UA Local 488", city: "Edmonton", state: "AB", phone: "780-452-7080", website: "local488.ca", address: "16214 118 AVE, EDMONTON, AB T5V 1M6" , lat: 53.5461, lng: -113.4938},
  { id: 20495, name: "UA Local 495", city: "Cambridge", state: "OH", phone: "740-439-3623", website: "www.lu495.com", lat: 40.031183, lng: -81.5884561, address: "11306 E PIKE RD, CAMBRIDGE, OH 43725" },
  { id: 20496, name: "UA Local 496", city: "Calgary", state: "AB", phone: "403-252-1166", website: "local496.com", address: "5649 BURBANK RD SE, CALGARY, AB T2H 1Z5" , lat: 51.0447, lng: -114.0719},
  { id: 20502, name: "UA Local 502", city: "Louisville", state: "KY", phone: "502-361-8492", website: "lu502.com", lat: 38.2527, lng: -85.7585, address: "4330 CRITTENDEN DR STE A, STE A LOUISVILLE, KY 40209" },
  { id: 20516, name: "UA Local 516", city: "Vancouver", state: "BC", phone: "604-882-8212", website: "www.ua516.org", address: "UNIT 1 19560 96TH AVE, SURREY, BC V4N 4C3" , lat: 49.2827, lng: -123.1207},
  { id: 20519, name: "UA Local 519", city: "Miami", state: "FL", phone: "305-362-0519", website: "www.plumbers519.com", lat: 25.7617, lng: -80.1918, address: "5931 NW 173RD DR B 5, HIALEAH, FL 33015" },
  { id: 20520, name: "UA Local 520", city: "Harrisburg", state: "PA", phone: "717-652-3135", website: "www.local520.com", lat: 40.2738818, lng: -76.8602624, address: "7193 JONESTOWN RD, HARRISBURG, PA 17112" },
  { id: 20521, name: "UA Local 521", city: "Huntington", state: "WV", phone: "304-523-8489", website: "www.wvtrades.org/program/plumbers-fitters-521", lat: 38.4193, lng: -82.4452, address: "137 5TH AVE, HUNTINGTON, WV 25701" },
  { id: 20524, name: "UA Local 524", city: "Scranton", state: "PA", phone: "570-347-9214", website: "ualocal524.org", lat: 41.3742153, lng: -75.6955793, address: "711 COREY ST, SCRANTON, PA 18505" },
  { id: 20525, name: "UA Local 525", city: "Las vegas", state: "NV", phone: "702-452-1520", website: "www.local525.org", lat: 36.1699, lng: -115.1398, address: "760 N LAMB BLVD, LAS VEGAS, NV 89110" },
  { id: 20527, name: "UA Local 527", city: "Southwestern", state: "ON", phone: "519-746-3300", website: "www.ua527.com", address: "225 FROBISHER DR, WATERLOO, ON N2V 2G4" , lat: 43.6532, lng: -79.3832},
  { id: 20529, name: "UA Local 529", city: "Waco", state: "TX", phone: "254-754-3471", website: "ualocal529.org", lat: 31.5491899, lng: -97.1474628, address: "510 CRESCECNT ST, WACO, TX 76705" },
  { id: 20533, name: "UA Local 533", city: "Kansas city", state: "MO", phone: "816-523-1533", website: "www.local533.com", lat: 39.0997, lng: -94.5786, address: "8600 HILLCREST RD, KANSAS CITY, MO 64138" },
  { id: 20537, name: "UA Local 537", city: "Boston", state: "MA", phone: "617-787-5370", website: "pipefitters537.org", lat: 42.3601, lng: -71.0589, address: "40 ENTERPRISE ST 4 FLR, DORCHESTER, MA 02125," },
  { id: 20538, name: "UA Local 538", city: "Johnson city", state: "TN", phone: "423-928-5751", website: "www.local538.org", lat: 36.2996997, lng: -82.3340742, address: "2404 S ROAN ST, JOHNSON CITY, TN 37601" },
  { id: 20539, name: "UA Local 539", city: "Minneapolis", state: "MN", phone: "612-379-4711", website: "pipefitters539.com", lat: 44.9778, lng: -93.265, address: "312 CENTRAL AVE # 408, MINNEAPOLIS, MN 55414" },
  { id: 20542, name: "UA Local 542", city: "Pittsburgh", state: "PA", phone: "412-822-8040", website: "sprinklerfitters542.org", lat: 40.4406, lng: -79.9959, address: "227 STANTON AVE, PITTSBURGH, PA 15209" },
  { id: 20548, name: "UA Local 548", city: "Montgomery", state: "AL", phone: "334-309-4563", website: "ua.org/location/lu-548-montgomery-al", lat: 32.3668, lng: -86.2999, address: "1719 COUNTRY RD 85, PRATTVILLE, AL 36067," },
  { id: 20550, name: "UA Local 550", city: "Boston", state: "MA", phone: "617-323-0474", website: "www.sprinklerfitters550.org", lat: 42.3601, lng: -71.0589, address: "46 ROCKLAND ST, BOSTON, MA 02132" },
  { id: 20551, name: "UA Local 551", city: "Herrin", state: "IL", phone: "618-937-1363", website: "ualocal551.org", lat: 37.8031056, lng: -89.0275744, address: "10967 DEAN BROWNING BLVD., WEST FRANKFORT, IL 62896" },
  { id: 20553, name: "UA Local 553", city: "Alton", state: "IL", phone: "618-259-6787", website: "ualocal553.org", lat: 38.8908583, lng: -90.1843091, address: "2 S WESLEY DR, EAST ALTON, IL 62024" },
  { id: 20562, name: "UA Local 562", city: "St. louis", state: "MO", phone: "314-355-1000", website: "local562.org", lat: 38.627, lng: -90.1994, address: "3640 CORPORATE TRAIL DR, EARTH CITY, MO 63045" },
  { id: 20565, name: "UA Local 565", city: "Parkersburg", state: "WV", phone: "304-485-5202", website: "ualocal565.org", lat: 39.2667309, lng: -81.5620755, address: "593 CEDAR GROVE RD, PARKERSBURG, WV 26104" },
  { id: 20568, name: "UA Local 568", city: "Gulfport", state: "MS", phone: "228-863-1853", website: "ua.org/location/lu-568-gulfport-ms", lat: 30.3674198, lng: -89.0928155, address: "18511 NOBLES RD, SAUCIER, MS 39574" },
  { id: 20572, name: "UA Local 572", city: "Nashville", state: "TN", phone: "615-262-0893", website: "local572.com", lat: 36.1627, lng: -86.7816, address: "225 BEN ALLEN RD, NASHVILLE, TN 37207" },
  { id: 20577, name: "UA Local 577", city: "Portsmouth", state: "OH", phone: "740-353-5869", website: "ua577.com", lat: 38.7348306, lng: -82.9889172, address: "1236 GALLIA ST, PORTSMOUTH, OH 45662" },
  { id: 20582, name: "UA Local 582", city: "Santa ana", state: "CA", phone: "714-978-0582", website: "www.ualocal582.org", lat: 33.7878, lng: -117.8761996, address: "1916 W CHAPMAN AVE, ORANGE, CA 92868" },
  { id: 20589, name: "UA Local 589", city: "Hibbing", state: "MN", phone: "218-741-2482", lat: 47.5231124, lng: -92.5577926, address: "107 S 15TH AVE W, VIRGINIA, MN 55792" },
  { id: 20597, name: "UA Local 597", city: "Chicago", state: "IL", phone: "312-829-4191", website: "www.pf597.org", lat: 41.8781, lng: -87.6298, address: "45 N OGDEN AVE, CHICAGO, IL 60607," },
  { id: 20598, name: "UA Local 598", city: "Pasco", state: "WA", phone: "509-545-1446", website: "www.ua598.org", lat: 46.2393158, lng: -119.1280056, address: "1328 RD 28, PASCO, WA 99301" },
  { id: 20600, name: "UA Local 600", city: "Reading", state: "PA", phone: "484-955-5083", website: "ua.org/location/lu-600-reading-pa", lat: 40.335345, lng: -75.9279495, address: "3323 PEQUOT DR, SINKING SPG, PA 19608" },
  { id: 20601, name: "UA Local 601", city: "Milwaukee", state: "WI", phone: "414-543-0601", website: "steam601.org", lat: 43.0389, lng: -87.9065, address: "3300 S 103RD ST, MILWAUKEE, WI 53227" },
  { id: 20602, name: "UA Local 602", city: "Washington", state: "DC", phone: "301-333-2356", website: "steamfitters-602.org", lat: 38.9072, lng: -77.0369, address: "8700 ASHWOOD DR 2ND FLR, CAPITOL HEIGHTS, MD 20743" },
  { id: 20614, name: "UA Local 614", city: "Memphis", state: "TN", phone: "901-386-8166", website: "www.local614.org", lat: 35.1495, lng: -90.049, address: "5670 COMMANDER DR, ARLINGTON, TN 38002" },
  { id: 20619, name: "UA Local 619", city: "Vicksburg", state: "MS", phone: "601-638-2546", website: "ua.org", lat: 32.3528055, lng: -90.8777342, address: "3203 N FRONTAGE DR, VICKSBURG, MS 39180" },
  { id: 20625, name: "UA Local 625", city: "Charleston", state: "WV", phone: "304-744-3881", website: "www.pipefitterslocal625.org", lat: 38.3498, lng: -81.6326, address: "3611 JAMES ST, CHARLESTON, WV 25387" },
  { id: 20628, name: "UA Local 628", city: "Thunderbay", state: "ON", phone: "807-623-1041", website: "ualocal628.com", address: "969 ALLOY DR, THUNDER BAY, ON P7B 5Z8" , lat: 48.3809, lng: -89.2477},
  { id: 20630, name: "UA Local 630", city: "West palm beach", state: "FL", phone: "561-689-8400", website: "www.lu630.org", lat: 26.697259, lng: -80.078541, address: "1900 N FLORIDA MANGO RD, WEST PALM BEACH, FL 33409" },
  { id: 20633, name: "UA Local 633", city: "Owensboro", state: "KY", phone: "270-683-1587", website: "ua.org/location/lu-633-owensboro-ky", lat: 37.7535505, lng: -87.0658491, address: "3128 ALVEY PARK DR W, OWENSBORO, KY 42303" },
  { id: 20636, name: "UA Local 636", city: "Detroit", state: "MI", phone: "248-538-6636", website: "pipefitters636.org", lat: 42.3314, lng: -83.0458, address: "30100 NORTHWESTERN HWY, FARMINGTON HILLS, MI 48334" },
  { id: 20638, name: "UA Local 638", city: "New york", state: "NY", phone: "718-392-3420", website: "steamfitters638.org", lat: 40.7128, lng: -74.0059, address: "27-08 40TH AVE 4TH FLR, LONG ISLAND CITY, NY 11101" },
  { id: 20648, name: "UA Local 648", city: "Pocatello", state: "ID", phone: "208-232-6806", lat: 42.8620287, lng: -112.450627, address: "456 N ARTHUR STE 4, POCATELLO, ID 83204" },
  { id: 20653, name: "UA Local 653", city: "Centralia", state: "IL", phone: "618-532-3351", website: "ua.org/location/lu-653-centralia-il", lat: 38.5278021, lng: -89.1367412, address: "116 S CHESTNUT ST, CENTRALIA, IL 62801" },
  { id: 20663, name: "UA Local 663", city: "Sarnia", state: "ON", phone: "519-337-6569", website: "local663.com", address: "1151 CONFEDERATION ST, SARNIA, ON N7S 3Y5" , lat: 42.9745, lng: -82.4064},
  { id: 20669, name: "UA Local 669", city: "Columbia", state: "MD", phone: "410-381-4300", website: "www.sprinklerfitters669.org", lat: 39.1938429, lng: -76.8646092, address: "7050 OAKLAND MILLS RD #200, COLUMBIA, MD 21046" },
  { id: 20671, name: "UA Local 671", city: "Monroe", state: "MI", phone: "734-242-5711", website: "unitedassociationlocal671.com", lat: 41.9139518, lng: -83.3731378, address: "309 DETROIT AVE, MONROE, MI 48162" },
  { id: 20675, name: "UA Local 675", city: "Honolulu", state: "HI", phone: "808-536-5454", website: "plumbershawaii.com", lat: 21.3069, lng: -157.8583, address: "1109 BETHEL ST LOWER LEVEL, HONOLULU, HI 96813" },
  { id: 20682, name: "UA Local 682", city: "Sydney", state: "NO", phone: "902-562-3753", website: "www.ualocal682.ca", address: "1776 SYDNEY-GLACEW BAY HWY, RESERVE MINES, NS B1E 1L2" , lat: 46.1368, lng: -60.1942},
  { id: 20690, name: "UA Local 690", city: "Philadephia", state: "PA", phone: "215-677-6900", website: "plumbers690.org", lat: 40.1092167, lng: -74.9858457, address: "2791 SOUTHAMPTON RD, PHILADELPHIA, PA 19154" },
  { id: 20692, name: "UA Local 692", city: "Philadephia", state: "PA", phone: "215-671-1692", website: "www.sprinklerfitters692.org", lat: 40.1075016, lng: -74.9750531, address: "14002 MCNULTY RD, PHILADELPHIA, PA 19154" },
  { id: 20693, name: "UA Local 693", city: "Barre", state: "VT", phone: "802-864-4042", website: "ualocal693.org", lat: 44.4570348, lng: -73.1382104, address: "3 GREGORY DR, SOUTH BURLINGTON, VT 5403" },
  { id: 20696, name: "UA Local 696", city: "Newark", state: "NJ", phone: "973-379-7446", website: "sprinklerfitters696.org", lat: 40.7357, lng: -74.1724, address: "41-43 E WILLOW ST, MILLBURN, NJ 07041" },
  { id: 20699, name: "UA Local 699", city: "Seattle", state: "WA", phone: "206-441-0737", website: "ualocal699.org", lat: 47.6062, lng: -122.3321, address: "4411 S RYAN WAY, TUKWILA, WA 98178" },
  { id: 20702, name: "UA Local 702", city: "Nashville", state: "TN", phone: "615-913-6734", website: "ua.org/location/lu-702-nashville-tn", lat: 36.1627, lng: -86.7816, address: "1209 CORELAND DR, MADISON, TN 37115" },
  { id: 20704, name: "UA Local 704", city: "Detroit", state: "MI", phone: "248-474-7553", website: "sprinklerfitters704.org", lat: 42.3314, lng: -83.0458, address: "23475 NORTHWESTERN HWY, SOUTHFIELD, MI 48075" },
  { id: 20709, name: "UA Local 709", city: "Los angeles", state: "CA", phone: "562-698-9909", website: "www.sprinklerfitters709.org", lat: 34.0522, lng: -118.2437, address: "12140 RIVERA RD, WHITTIER, CA 90606" },
  { id: 20716, name: "UA Local 716", city: "", state: "MA", phone: "207-621-0555", website: "local716.org", lat: 44.3687263, lng: -69.7955473, address: "21 GABRIEL DR, AUGUSTA, ME 04330" },
  { id: 20718, name: "UA Local 718", city: "Oak ridge", state: "TN", phone: "865-574-0235", website: "ua.org/location/lu-718-oak-ridge-tn", lat: 36.0171139, lng: -84.2550094, address: "109 VIKING RD, OAK RIDGE, TN 37931" },
  { id: 20719, name: "UA Local 719", city: "Broward county", state: "FL", phone: "954-522-2532", website: "ualocal719.org", lat: 26.0916723, lng: -80.1400482, address: "2502 S ANDREWS AVE, FORT LAUDERDALE, FL 33316" },
  { id: 20721, name: "UA Local 721", city: "Charlottetown", state: "PE", phone: "902-894-5404", address: "594 CAPITAL DR, CORNWALL, PE C0A 1H8" , lat: 46.2382, lng: -63.1311},
  { id: 20725, name: "UA Local 725", city: "Miami", state: "FL", phone: "305-681-8596", website: "ua725.org", lat: 25.7617, lng: -80.1918, address: "13185 NW 45TH AVE, OPA LOCKA, FL 33054" },
  { id: 20740, name: "UA Local 740", city: "St johns", state: "NL", phone: "709-747-2249", website: "www.ualocal740.ca", address: "48 SAGONA AVE DONOVANS IND PK, MOUNT PEARL, NL A1N 4R3" , lat: 47.5615, lng: -52.7126},
  { id: 20760, name: "UA Local 760", city: "Sheffield", state: "AL", phone: "256-383-7900", website: "ua.org/location/lu-760-sheffield-al", lat: 34.7443097, lng: -87.6397483, address: "2807 AVALON AVE, MUSCLE SHOALS, AL 35661" },
  { id: 20761, name: "UA Local 761", city: "Burbank", state: "CA", phone: "818-843-8670", website: "www.local761.org", lat: 34.177527, lng: -118.342843, address: "1305 N NIAGARA ST, BURBANK, CA 91505," },
  { id: 20773, name: "UA Local 773", city: "Glens falls", state: "NY", phone: "518-792-9157", website: "www.lu773.org", lat: 43.3037418, lng: -73.6697297, address: "37 LUZERNE RD, QUEENSBURY, NY 12804" },
  { id: 20776, name: "UA Local 776", city: "Lima", state: "OH", phone: "419-229-5176", website: "www.ualocal776.com", lat: 40.7399785, lng: -84.105006, address: "1300 BOWMAN RD, LIMA, OH 45804" },
  { id: 20777, name: "UA Local 777", city: "", state: "CO", phone: "203-317-4750", website: "www.local777.com", lat: 41.5257344, lng: -72.7612885, address: "1250 E MAIN ST, MERIDEN, CT 6450" },
  { id: 20781, name: "UA Local 781", city: "Kansas city", state: "MO", phone: "816-739-4028", lat: 39.0997, lng: -94.5786, address: "4501 CLEAVER II BLVD STE 781, KANSAS CITY, MO 64130" },
  { id: 20787, name: "UA Local 787", city: "Toronto", state: "ON", phone: "905-790-1019", website: "www.ualocal787.org", address: "419 DEERHURST DR, BRAMPTON, ON L6T 5K3" , lat: 43.6532, lng: -79.3832},
  { id: 20788, name: "UA Local 788", city: "Portsmouth", state: "NH", phone: "207-438-4092", website: "ua.org/location/lu-788-portsmouth-nh", lat: 43.0751306, lng: -70.7601826, address: "BUILDING M1, PORTSMOUTH, NH 3804" },
  { id: 20798, name: "UA Local 798", city: "Tulsa", state: "OK", phone: "918-622-1900", website: "local798.org", lat: 36.154, lng: -95.9928, address: "4823 S 83RD E ST, TULSA, OK 74145" },
  { id: 20800, name: "UA Local 800", city: "Subury", state: "ON", phone: "705-560-3800", website: "ualocal800.com", address: "1640 BANCROFT DR, SUDBURY, ON P3B 1R8" , lat: 46.4917, lng: -80.993},
  { id: 20803, name: "UA Local 803", city: "Orlando", state: "FL", phone: "407-851-9240", website: "localunion803.org", lat: 28.5383, lng: -81.3792, address: "2447 ORLANDO CENTRAL PKWY, ORLANDO, FL 32809" },
  { id: 20811, name: "UA Local 811", city: "Honolulu", state: "HI", phone: "808-630-8000", website: "plumbershawaii.com", lat: 21.3069, lng: -157.8583, address: "85 1060 WAIANAE VALLEY RD, WAIANAE, HI 96792" },
  { id: 20821, name: "UA Local 821", city: "", state: "FL", phone: "561-422-9821", website: "www.sprinklerfitters821.org", lat: 27.664, lng: -81.515, address: "1975 SANSBURY'S WAY STE 115, WEST PALM BEACH, FL 33411" },
  { id: 20827, name: "UA Local 827", city: "Montreal", state: "QC", phone: "438-868-2866", address: "1400 NORMAN ST, MONTREAL, QC H8S 1A8" , lat: 45.5017, lng: -73.5673},
  { id: 20851, name: "UA Local 851", city: "Hopewell", state: "VA", phone: "804-898-1703", lat: 37.3043154, lng: -77.2872001, address: "11916 PATILLO RD, DEWITT, VA 23841" },
  { id: 20853, name: "UA Local 853", city: "Toronto", state: "ON", phone: "905-477-6022", website: "ualocal853.org", address: "60 PERFORMANCE DR, RICHMOND HILL, ON L4S 0G6" , lat: 43.6532, lng: -79.3832},
  { id: 20855, name: "UA Local 855", city: "Jersey city", state: "NJ", phone: "908-450-7620", website: "www.ualocal855.com", lat: 40.5659235, lng: -74.6010343, address: "261 E MAIN ST, SOMERVILLE, NJ 08876" }
];

const SMART_LOCALS = [];
// ─── BAC LOCAL DATABASE — Bricklayers & Allied Craftworkers ──────────────────
// All data verified from bacweb.org official directory
const BAC_LOCALS = [
  { id: 20500, name: "BAC Local 1 (Alberta, Canada)", city: "Alberta", state: "Ca", phone: "780) 426-7545", website: "www.bacedmonton.ca", email: "kcoghill@bacalberta.ca", lat: 53.5430271, lng: -113.5674532, address: "11330 143 Street, Edmonton AB T5M 1V5, Canada" },
  { id: 20501, name: "BAC Local 2 (British Columbia, Canada)", city: "British Columbia", state: "Ca", phone: "604-584-2021", website: "www.bac2bc.org", email: "info@bac2bc.org", lat: 49.2107594, lng: -122.8811502, address: "12309 Industrial Road, Surrey BC V3V3S4, Canada" },
  { id: 20502, name: "BAC Local 3 (Northern California)", city: "Northern California", state: "No", phone: "(510) 632-8781", website: "www.bac3-ca.org", email: "troy@bac3-ca.org", lat: 37.7373999, lng: -122.2027593, address: "8201 Capwell Dr., Oakland, CA 94621" },
  { id: 20503, name: "BAC Local 4 (Southern California)", city: "Southern California", state: "So", phone: "626-739-5600", website: "www.bac4ca.org", email: "bac4andy@gmail.com", lat: 34.0392937, lng: -118.1067198, address: "2679 Sierra Way, LaVerne, CA 91750, United States" },
  { id: 20504, name: "BAC Local 7 (Ontario Canada)", city: "Ontario Canada", state: "On", phone: "(613) 739-5944", website: "www.local7.ca", email: "info@local7.ca", lat: 45.4146888, lng: -75.628064, address: "1427 Michael St, Ottawa ON K1B 3R3, Canada" },
  { id: 20505, name: "BAC Local 1 (Connecticut)", city: "Connecticut", state: "Co", phone: "(203) 697-0820", website: "www.baclocal1ct.com", email: "gmarotti@baclocal1ct.com", lat: 41.4866274, lng: -72.8134248, address: "17 North Plains Industrial Rd, Wallingford, CT 06492" },
  { id: 20506, name: "BAC Local 1 (Maryland, Virginia, District of Columbia)", city: "Maryland", state: "Di", phone: "240-695-9463", website: "www.baclocal1.org", email: "support@baclocal1.org", lat: 39.0993027, lng: -76.8494305, address: "305 Compton Avenue, Laurel, MD 20707" },
  { id: 20507, name: "BAC Local 1 (Hawaii)", city: "Hawaii", state: "Ha", phone: "808-841-8822", website: "hawaiimasonsunion.org", email: "pcoronas@masonsunion.com", lat: 21.3407659, lng: -157.874448, address: "2251 North School Street, Honolulu, HI 96819" },
  { id: 20508, name: "BAC Local 3 (Iowa)", city: "Iowa", state: "Io", phone: "515-557-0551", website: "baclocal3ia.org", email: "ray@bac3ia.us", lat: 42.041107, lng: -92.89358, address: "601 S 12th Avenue, Marshalltown, IA 50158" },
  { id: 20509, name: "BAC Local 8 (Illinois)", city: "Illinois", state: "Il", phone: "618-234-5340", website: "bac8il.com", email: "mbraun@bac8il.com", lat: 40.0761545, lng: -88.2233134, address: "715 Lakepointe Centre,, Suite 127 P.O. Box 487, O’Fallon, IL 62269" },
  { id: 20510, name: "BAC ADC 1 (Illinois)", city: "Illinois", state: "Il", phone: "(630) 941-2300", website: "bacadc1.org", email: "mvolpentesta@bacadc1.org", lat: 41.9308223, lng: -87.9463526, address: "660 N Industrial Drive, Elmhurst, IL 60126" },
  { id: 20511, name: "BAC Local 4 (indiana, Kentucky)", city: "indiana", state: "Ke", phone: "8003222830", website: "www.baclocal4.org", email: "steveknowles@baclocal4.org", lat: 39.9085646, lng: -86.255823, address: "8455 Moller Road, Indianapolis, IN 46268" },
  { id: 20512, name: "BAC Local 3 (Massachusetts, Maine, New Hampshire, Rhode Island)", city: "Massachusetts", state: "Rh", phone: "617-242-5500", email: "aantonuccio@local3bac.org", lat: 42.3834254, lng: -71.07089, address: "550 Medford Street, Charlestown, MA 02129" },
  { id: 20513, name: "BAC Local 1 (Manitoba, Canada)", city: "Manitoba", state: "Ca", phone: "(204) 297-6074", email: "evancollingridge@outlook.com", lat: 55.001251, lng: -97.001038, address: "Unit 4, 225 McPhillips Street, Winnipeg MB R3E 2K3" },
  { id: 20514, name: "BAC Local 2 (Michigan)", city: "Michigan", state: "Mi", phone: "(586)754-0888", website: "bricklayers.org", email: "brett.gierak@bricklayers.org", lat: 42.4502326, lng: -83.0641409, address: "21031 Ryan Road, Warren, MI 48091" },
  { id: 20515, name: "BAC Local 15 (Missouri, Kasas, Nebraska)", city: "Missouri", state: "Ne", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", lat: 39.057063, lng: -94.594654, address: "632 W 39th Street, Kansas City, MO 64111" },
  { id: 20516, name: "BAC ADC Of Eastern Missouri (Eastern Missouri)", city: "Eastern Missouri", state: "Ea", phone: "(314) 621-5560", website: "www.bacstl.com", email: "brian.jennewein@gmail.com", lat: 38.5382621, lng: -90.4485428, address: "1670 Fenpark Drive, Fenton, MO 63026" },
  { id: 20517, name: "BAC Local 8 (New Brunswick, Canada)", city: "New Brunswick", state: "Ca", phone: "(506) 635-1505", website: "www.bac8nb.ca", email: "apttc@nb.aibn.com", lat: 46.500283, lng: -66.750183, address: "1216 Sand Cove Road, Box 32, Suite B234, Saint John NB E2M5V8" },
  { id: 20518, name: "BAC Local 1 (Newfoundland and Labrador, Canada)", city: "Newfoundland and Labrador", state: "Ca", phone: "(709) 625-7322", website: "www.baclocal1nl.com", email: "jleonard@baclocal1nl.com", lat: 47.5083588, lng: -52.974114, address: "631 Conception Bay Highway, Conception Bay South NL A1X7L4" },
  { id: 20519, name: "BAC ADC of New Jersey (New Jersey)", city: "New Jersey", state: "Ne", phone: "(609) 324-9681", website: "www.bacnj.com", email: "j.capo@bacnj.com", lat: 40.9479798, lng: -98.4042224, address: "3281 Route 206, Suite 1, Bordentown, NJ 08505" },
  { id: 20520, name: "BAC Local 1 (Nova Scotia, Canada)", city: "Nova Scotia", state: "Ca", phone: "(902) 450-5614", email: "reception@baclocal1.ca", lat: 45.1960403, lng: -63.1653789, address: "14 McQuade Lake Crescent, Suite 203, Halifax NS B3S1B6" },
  { id: 20521, name: "BAC Mountain West ADC (Nevada)", city: "Nevada", state: "Ne", phone: "(702) 873-0332", website: "bacmwadc.org", email: "rcrawford@mwbac.org", lat: 36.0845773, lng: -115.1914867, address: "3900 W Quail Avenue, Las Vegas, NV 89118" },
  { id: 20522, name: "BAC Local 1 (New York)", city: "New York", state: "Ne", phone: "718-392-0525", website: "bricklayersandalliedcraftworkerslocal1ny.org", email: "info@bac1ny.com", lat: 40.7461869, lng: -73.9440123, address: "4 Court Square West, Long Island City, NY 11101" },
  { id: 20523, name: "BAC Local 2 (New York / Vermont)", city: "New York / Vermont", state: "Ne", phone: "(518) 466-5885", website: "baclocal2nyvt.org", email: "ptirino@bac2.org", lat: 42.7029329, lng: -73.8579828, address: "302 Centre Drive, Albany, NY 12203" },
  { id: 20524, name: "BAC Local 3 (New York)", city: "New York", state: "Ne", phone: "(716) 604-2334", website: "bac3ny.com", email: "rickw@bac3ny.com", lat: 43.0854207, lng: -77.5910409, address: "33 Saginaw Drive, Rochester, NY 14623" },
  { id: 20525, name: "BAC Local 7 (New York / New Jersey)", city: "New York / New Jersey", state: "Ne", phone: "(917) 734-8390", website: "www.baclocal7.org", email: "whill@baclocal7.com", lat: 40.7454481, lng: -73.9436803, address: "45-34 Court Square, Long Island City, NY 11101" },
  { id: 20526, name: "BAC Local 23 (Ohio / West Virginia / Kentucky / Maryland)", city: "Ohio / West Virginia / Kentucky / Maryland", state: "Oh", phone: "440-986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", lat: 41.3693677, lng: -82.2102209, address: "8497 Leavitt Road, Amherst, OH 44001" },
  { id: 20527, name: "BAC Local 5 (Oklahoma / arkansas / texas / new mexico)", city: "Oklahoma / arkansas / texas / new mexico", state: "Ok", phone: "4055285609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", lat: 35.4977185, lng: -97.507499, address: "212 NE 27th Street, Oklahoma City, OK 73105," },
  { id: 20528, name: "BAC Local 1 (pennsylvania / delaware)", city: "pennsylvania / delaware", state: "pe", phone: "(215) 856-9505", website: "www.bac1pa-de.org", lat: 40.1108495, lng: -74.9841971, address: "2706 Black Lake Place, Philadelphia, PA 19154" },
  { id: 20529, name: "BAC Local 5 (Pennsylvania)", city: "Pennsylvania", state: "Pe", phone: "7175645555", website: "baclocal5pa.org", email: "toms@bac5pa.com", lat: 42.6995896, lng: -84.5383864, address: "733 Firehouse Lane, Harrisburg, PA 17111," },
  { id: 20530, name: "BAC Local 9 (Pennsylvania)", city: "Pennsylvania", state: "Pe", phone: "(412) 860-8390", website: "local9pa.com", email: "Normringer@baclocal9.com", lat: 42.6995896, lng: -84.5383864, address: "100 Kingston Drive, Pittsburgh, PA 15235" },
  { id: 20531, name: "BAC Local 4 (Quebec, Canada)", city: "Quebec", state: "Ca", phone: "(418) 929-4343", email: "mlacroix@interlocal4.org", lat: 52.4760892, lng: -71.8258668, address: "6879 rue Jarry est., 2 ième étage, Saint-Leonard QC H1P 1W7" },
  { id: 20532, name: "BAC Local 8 (Southeast)", city: "Southeast", state: "So", phone: "4048935809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", lat: 44.9487368, lng: -93.0252326, address: "501 Pulliam Street SW, Suite 319, Atlanta, GA 30312" },
  { id: 20533, name: "BAC Local 1 (Saskatchewan)", city: "Saskatchewan", state: "Sa", phone: "(306) 359-6356", website: "www.bac1sk.ca", email: "derek@bac1sk.ca", lat: 52.1344194, lng: -106.6277843, address: "Po Box 3885, Regina SK S4P3R8" },
  { id: 20534, name: "BAC Local 1 (Washington and Alaska)", city: "Washington and Alaska", state: "Wa", phone: "2062482456", website: "bac1wa-ak.org", email: "lglodowski@bacnorthwest.org", lat: 47.4, lng: -121.49, address: "15208 52nd Ave S, Suite 120, Tukwila, WA 98188" },
  { id: 20535, name: "BAC Wisconsin Distrcit council (Wisconsin)", city: "Wisconsin", state: "Wi", phone: "262-827-4080", website: "www.bacwi.org", email: "jvick@bacwi.org", lat: 43.0746978, lng: -89.3841692, address: "Po Box 510617, New Berlin, WI 53151" },
  { id: 20536, name: "BAC Local 1 (Minnesota / North Dakota / South Dakota)", city: "Minnesota / North Dakota / South Dakota", state: "Mi", phone: "(612) 845-3136", website: "www.bac1mn-nd.org", email: "dschroeder@bac1mn-nd.org", lat: 43.5591395, lng: -96.7314308, address: "312 Central Avenue Room 328, Minneapolis, MN 55414" },
  { id: 20537, name: "BAC Local 1 (Oregon / Washington / Idaho / Montana)", city: "Oregon / Washington / Idaho / Montana", state: "Or", phone: "503-232-0358", website: "www.bac1or.org", email: "office@bac1or.org", lat: 45.5584967, lng: -122.5325719, address: "12812 NE Marx Street, Portland, OR 97230," },
  { id: 20538, name: "BAC Local 6 (Ontario Canada)", city: "Ontario Canada", state: "On", phone: "519-256-3070", email: "jtr.local6@bellnet.ca", lat: 42.2753541, lng: -83.0890102, address: "3454 Sandwich Street, Windsor ON N9C1B3, Canada" }
];

// ─── UBC LOCAL DATABASE — United Brotherhood of Carpenters ───────────────────
// Only verified phones/websites from official regional council directories
const UBC_LOCALS = [];

function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── STATE CENTER COORDINATES ────────────────────────────────────────────────
const STATE_CENTERS = {
  AL:{lat:32.806,lng:-86.791},AK:{lat:61.370,lng:-152.404},AZ:{lat:33.729,lng:-111.431},
  AR:{lat:34.969,lng:-92.373},CA:{lat:36.778,lng:-119.418},CO:{lat:39.113,lng:-105.358},
  CT:{lat:41.597,lng:-72.755},DE:{lat:39.318,lng:-75.507},FL:{lat:27.664,lng:-81.515},
  GA:{lat:32.678,lng:-83.223},HI:{lat:21.094,lng:-157.498},ID:{lat:44.240,lng:-114.478},
  IL:{lat:40.349,lng:-88.986},IN:{lat:39.849,lng:-86.258},IA:{lat:42.011,lng:-93.210},
  KS:{lat:38.526,lng:-96.726},KY:{lat:37.668,lng:-84.670},LA:{lat:31.169,lng:-91.867},
  ME:{lat:44.693,lng:-69.381},MD:{lat:39.063,lng:-76.802},MA:{lat:42.230,lng:-71.530},
  MI:{lat:43.326,lng:-84.536},MN:{lat:45.694,lng:-93.900},MS:{lat:32.741,lng:-89.678},
  MO:{lat:38.456,lng:-92.288},MT:{lat:46.921,lng:-110.454},NE:{lat:41.125,lng:-98.268},
  NV:{lat:38.313,lng:-117.055},NH:{lat:43.452,lng:-71.563},NJ:{lat:40.298,lng:-74.521},
  NM:{lat:34.840,lng:-106.248},NY:{lat:42.165,lng:-74.948},NC:{lat:35.630,lng:-79.806},
  ND:{lat:47.528,lng:-99.784},OH:{lat:40.388,lng:-82.764},OK:{lat:35.565,lng:-96.928},
  OR:{lat:44.572,lng:-122.070},PA:{lat:40.590,lng:-77.209},RI:{lat:41.680,lng:-71.511},
  SC:{lat:33.856,lng:-80.945},SD:{lat:44.299,lng:-99.438},TN:{lat:35.747,lng:-86.692},
  TX:{lat:31.054,lng:-97.563},UT:{lat:40.150,lng:-111.862},VT:{lat:44.045,lng:-72.710},
  VA:{lat:37.769,lng:-78.169},WA:{lat:47.400,lng:-121.490},WV:{lat:38.491,lng:-80.954},
  WI:{lat:44.268,lng:-89.616},WY:{lat:42.755,lng:-107.302},DC:{lat:38.907,lng:-77.036},
};

const STATE_NAMES = {
  alabama:"AL",alaska:"AK",arizona:"AZ",arkansas:"AR",california:"CA",colorado:"CO",
  connecticut:"CT",delaware:"DE",florida:"FL",georgia:"GA",hawaii:"HI",idaho:"ID",
  illinois:"IL",indiana:"IN",iowa:"IA",kansas:"KS",kentucky:"KY",louisiana:"LA",
  maine:"ME",maryland:"MD",massachusetts:"MA",michigan:"MI",minnesota:"MN",
  mississippi:"MS",missouri:"MO",montana:"MT",nebraska:"NE",nevada:"NV",
  "new hampshire":"NH","new jersey":"NJ","new mexico":"NM","new york":"NY",
  "north carolina":"NC","north dakota":"ND",ohio:"OH",oklahoma:"OK",oregon:"OR",
  pennsylvania:"PA","rhode island":"RI","south carolina":"SC","south dakota":"SD",
  tennessee:"TN",texas:"TX",utah:"UT",vermont:"VT",virginia:"VA",washington:"WA",
  "west virginia":"WV",wisconsin:"WI",wyoming:"WY","district of columbia":"DC",
  "washington dc":"DC","washington d.c.":"DC",
};

// ─── ZIP PREFIX → STATE/REGION MAP ───────────────────────────────────────────
// Maps first 3 digits of ZIP to approximate lat/lng center
const ZIP_PREFIX_MAP = {
  "005":["MA",42.36,-71.06],"006":["PR",18.22,-66.59],"007":["PR",18.39,-66.06],
  "008":["VI",18.34,-64.90],"009":["PR",18.01,-66.61],
  "010":["MA",42.10,-72.59],"011":["MA",42.27,-71.80],"012":["MA",42.45,-73.25],
  "013":["MA",42.38,-72.52],"014":["MA",42.54,-71.78],"015":["MA",42.27,-71.80],
  "016":["MA",42.27,-71.80],"017":["MA",42.27,-71.80],"018":["MA",42.52,-70.90],
  "019":["MA",42.52,-70.90],"020":["MA",42.25,-71.00],"021":["MA",42.36,-71.06],
  "022":["MA",42.36,-71.06],"023":["MA",42.25,-71.00],"024":["MA",42.25,-71.00],
  "025":["MA",41.75,-70.60],"026":["MA",41.75,-70.60],"027":["MA",41.83,-71.41],
  "028":["RI",41.82,-71.41],"029":["RI",41.47,-71.31],
  "030":["NH",43.21,-71.54],"031":["NH",43.05,-71.01],"032":["NH",43.21,-71.54],
  "033":["NH",43.68,-71.54],"034":["NH",44.31,-71.54],"035":["NH",43.21,-71.54],
  "036":["NH",43.21,-71.54],"037":["NH",43.21,-71.54],"038":["NH",43.08,-70.75],
  "039":["ME",43.65,-70.26],"040":["ME",43.65,-70.26],"041":["ME",43.65,-70.26],
  "042":["ME",44.55,-69.63],"043":["ME",44.31,-69.78],"044":["ME",44.80,-68.78],
  "045":["ME",44.80,-68.78],"046":["ME",47.20,-68.20],"047":["ME",47.20,-68.20],
  "048":["ME",44.80,-68.78],"049":["ME",44.80,-68.78],
  "050":["VT",44.48,-73.21],"051":["VT",44.48,-73.21],"052":["VT",44.48,-73.21],
  "053":["VT",44.03,-72.67],"054":["VT",44.48,-73.21],"055":["VT",43.62,-72.98],
  "056":["VT",44.48,-73.21],"057":["VT",44.48,-73.21],"058":["VT",44.92,-71.88],
  "059":["VT",44.48,-73.21],
  "060":["CT",41.77,-72.68],"061":["CT",41.77,-72.68],"062":["CT",41.55,-72.65],
  "063":["CT",41.31,-72.93],"064":["CT",41.31,-72.93],"065":["CT",41.19,-73.20],
  "066":["CT",41.19,-73.20],"067":["CT",41.55,-72.65],"068":["CT",41.05,-73.54],
  "069":["CT",41.05,-73.54],
  "070":["NJ",40.73,-74.17],"071":["NJ",40.73,-74.17],"072":["NJ",40.73,-74.17],
  "073":["NJ",40.73,-74.17],"074":["NJ",40.86,-74.43],"075":["NJ",40.86,-74.43],
  "076":["NJ",40.86,-74.43],"077":["NJ",40.37,-74.10],"078":["NJ",40.37,-74.10],
  "079":["NJ",40.37,-74.10],"080":["NJ",39.93,-75.12],"081":["NJ",39.93,-75.12],
  "082":["NJ",39.37,-74.44],"083":["NJ",39.37,-74.44],"084":["NJ",39.93,-75.12],
  "085":["NJ",40.22,-74.78],"086":["NJ",40.22,-74.78],"087":["NJ",40.22,-74.78],
  "088":["NJ",40.58,-74.15],"089":["NJ",40.58,-74.15],
  "100":["NY",40.71,-74.01],"101":["NY",40.71,-74.01],"102":["NY",40.71,-74.01],
  "103":["NY",40.60,-74.15],"104":["NY",40.85,-73.87],"105":["NY",41.05,-73.88],
  "106":["NY",41.05,-73.88],"107":["NY",41.05,-73.88],"108":["NY",41.05,-73.88],
  "109":["NY",41.30,-74.00],"110":["NY",40.73,-73.79],"111":["NY",40.73,-73.79],
  "112":["NY",40.65,-73.95],"113":["NY",40.73,-73.79],"114":["NY",40.73,-73.79],
  "115":["NY",40.80,-73.43],"116":["NY",40.80,-73.43],"117":["NY",40.80,-73.43],
  "118":["NY",40.80,-73.43],"119":["NY",40.80,-73.43],"120":["NY",42.65,-73.76],
  "121":["NY",42.65,-73.76],"122":["NY",42.65,-73.76],"123":["NY",42.65,-73.76],
  "124":["NY",41.70,-74.01],"125":["NY",41.70,-74.01],"126":["NY",41.70,-74.01],
  "127":["NY",41.70,-74.01],"128":["NY",42.10,-75.92],"129":["NY",42.10,-75.92],
  "130":["NY",43.05,-76.14],"131":["NY",43.05,-76.14],"132":["NY",43.05,-76.14],
  "133":["NY",43.10,-75.23],"134":["NY",43.10,-75.23],"135":["NY",43.10,-75.23],
  "136":["NY",43.45,-76.51],"137":["NY",42.10,-75.92],"138":["NY",43.45,-76.51],
  "139":["NY",43.10,-75.23],"140":["NY",42.89,-78.88],"141":["NY",42.89,-78.88],
  "142":["NY",42.89,-78.88],"143":["NY",42.87,-76.98],"144":["NY",43.16,-77.61],
  "145":["NY",43.16,-77.61],"146":["NY",43.16,-77.61],"147":["NY",42.10,-79.24],
  "148":["NY",42.44,-76.50],"149":["NY",42.10,-75.92],
  "150":["PA",40.44,-79.99],"151":["PA",40.44,-79.99],"152":["PA",40.44,-79.99],
  "153":["PA",40.44,-79.99],"154":["PA",40.44,-79.99],"155":["PA",40.44,-79.99],
  "156":["PA",40.44,-79.99],"157":["PA",40.44,-79.99],"158":["PA",40.44,-79.99],
  "159":["PA",40.44,-79.99],"160":["PA",40.44,-79.99],"161":["PA",41.24,-77.00],
  "162":["PA",41.24,-77.00],"163":["PA",41.41,-75.66],"164":["PA",42.13,-80.09],
  "165":["PA",42.13,-80.09],"166":["PA",42.13,-80.09],"167":["PA",40.61,-75.49],
  "168":["PA",40.61,-75.49],"169":["PA",40.61,-75.49],"170":["PA",40.27,-76.89],
  "171":["PA",40.27,-76.89],"172":["PA",40.27,-76.89],"173":["PA",39.96,-76.73],
  "174":["PA",39.96,-76.73],"175":["PA",39.96,-76.73],"176":["PA",39.96,-76.73],
  "177":["PA",41.24,-77.00],"178":["PA",40.27,-76.89],"179":["PA",40.27,-76.89],
  "180":["PA",40.61,-75.49],"181":["PA",39.95,-75.17],"182":["PA",39.95,-75.17],
  "183":["PA",39.95,-75.17],"184":["PA",41.41,-75.66],"185":["PA",41.41,-75.66],
  "186":["PA",41.41,-75.66],"187":["PA",41.41,-75.66],"188":["PA",41.41,-75.66],
  "189":["PA",39.95,-75.17],"190":["PA",39.95,-75.17],"191":["PA",39.95,-75.17],
  "192":["PA",39.95,-75.17],"193":["PA",39.95,-75.17],"194":["PA",40.06,-75.31],
  "195":["PA",40.06,-75.31],"196":["PA",40.06,-75.31],
  "197":["DE",39.32,-75.51],"198":["DE",39.68,-75.76],"199":["DE",39.68,-75.76],
  "200":["DC",38.91,-77.04],"201":["VA",38.91,-77.04],"202":["DC",38.91,-77.04],
  "203":["DC",38.91,-77.04],"204":["DC",38.91,-77.04],"205":["DC",38.91,-77.04],
  "206":["MD",39.29,-76.61],"207":["MD",39.29,-76.61],"208":["MD",38.99,-77.03],
  "209":["MD",38.99,-77.03],"210":["MD",39.29,-76.61],"211":["MD",39.29,-76.61],
  "212":["MD",39.29,-76.61],"214":["MD",39.29,-76.61],"215":["MD",39.65,-78.76],
  "216":["MD",38.68,-76.87],"217":["MD",38.68,-76.87],"218":["MD",38.38,-75.60],
  "219":["MD",38.38,-75.60],
  "220":["VA",38.84,-77.43],"221":["VA",38.84,-77.43],"222":["VA",38.84,-77.43],
  "223":["VA",38.84,-77.43],"224":["VA",37.54,-77.43],"225":["VA",37.54,-77.43],
  "226":["VA",38.30,-78.08],"227":["VA",38.30,-78.08],"228":["VA",38.30,-78.08],
  "229":["VA",37.27,-79.94],"230":["VA",37.54,-77.43],"231":["VA",37.54,-77.43],
  "232":["VA",37.54,-77.43],"233":["VA",36.85,-76.29],"234":["VA",36.85,-76.29],
  "235":["VA",36.85,-76.29],"236":["VA",36.85,-76.29],"237":["VA",36.85,-76.29],
  "238":["VA",37.54,-77.43],"239":["VA",37.09,-76.47],
  "240":["WV",37.27,-80.41],"241":["WV",37.27,-80.41],"242":["WV",38.42,-82.45],
  "243":["WV",38.42,-82.45],"244":["WV",38.42,-82.45],"245":["WV",38.42,-82.45],
  "246":["WV",38.42,-82.45],"247":["WV",38.35,-81.63],"248":["WV",38.35,-81.63],
  "249":["WV",38.35,-81.63],"250":["WV",38.35,-81.63],"251":["WV",38.35,-81.63],
  "252":["WV",38.35,-81.63],"253":["WV",38.35,-81.63],"254":["WV",39.28,-80.34],
  "255":["WV",39.28,-80.34],"256":["WV",39.28,-80.34],"257":["WV",39.27,-81.56],
  "258":["WV",39.27,-81.56],"259":["WV",39.27,-81.56],"260":["WV",39.49,-79.98],
  "261":["WV",39.49,-79.98],"262":["WV",40.06,-80.72],"263":["WV",40.06,-80.72],
  "264":["WV",40.06,-80.72],"265":["WV",39.28,-80.34],"266":["WV",39.28,-80.34],
  "267":["WV",39.28,-80.34],"268":["WV",39.28,-80.34],
  "270":["NC",36.07,-79.79],"271":["NC",36.07,-79.79],"272":["NC",35.78,-78.64],
  "273":["NC",35.78,-78.64],"274":["NC",35.78,-78.64],"275":["NC",35.78,-78.64],
  "276":["NC",35.78,-78.64],"277":["NC",35.78,-78.64],"278":["NC",35.59,-77.37],
  "279":["NC",35.59,-77.37],"280":["NC",35.23,-80.84],"281":["NC",35.23,-80.84],
  "282":["NC",35.23,-80.84],"283":["NC",35.23,-80.84],"284":["NC",34.23,-77.94],
  "285":["NC",35.59,-77.37],"286":["NC",35.60,-82.55],"287":["NC",35.60,-82.55],
  "288":["NC",36.10,-80.24],"289":["NC",36.10,-80.24],
  "290":["SC",33.99,-81.03],"291":["SC",33.99,-81.03],"292":["SC",33.99,-81.03],
  "293":["SC",34.85,-82.39],"294":["SC",34.85,-82.39],"295":["SC",33.99,-81.03],
  "296":["SC",34.85,-82.39],"297":["SC",34.85,-82.39],"298":["SC",32.78,-79.93],
  "299":["SC",32.78,-79.93],
  "300":["GA",33.75,-84.39],"301":["GA",33.75,-84.39],"302":["GA",33.75,-84.39],
  "303":["GA",33.75,-84.39],"304":["GA",33.75,-84.39],"305":["GA",33.75,-84.39],
  "306":["GA",33.75,-84.39],"307":["GA",33.75,-84.39],"308":["GA",33.47,-82.01],
  "309":["GA",33.47,-82.01],"310":["GA",32.08,-81.10],"311":["GA",32.08,-81.10],
  "312":["GA",32.84,-83.63],"313":["GA",32.84,-83.63],"314":["GA",32.84,-83.63],
  "315":["GA",31.58,-84.16],"316":["GA",31.58,-84.16],"317":["GA",32.08,-81.10],
  "318":["GA",30.83,-83.28],"319":["GA",30.83,-83.28],
  "320":["FL",30.33,-81.66],"321":["FL",28.54,-81.38],"322":["FL",30.33,-81.66],
  "323":["FL",30.44,-84.28],"324":["FL",30.44,-84.28],"325":["FL",30.44,-84.28],
  "326":["FL",29.65,-82.33],"327":["FL",28.54,-81.38],"328":["FL",28.54,-81.38],
  "329":["FL",28.54,-81.38],"330":["FL",25.76,-80.19],"331":["FL",25.76,-80.19],
  "332":["FL",25.76,-80.19],"333":["FL",26.12,-80.14],"334":["FL",26.12,-80.14],
  "335":["FL",27.95,-82.46],"336":["FL",27.95,-82.46],"337":["FL",27.95,-82.46],
  "338":["FL",27.95,-82.46],"339":["FL",26.12,-80.14],"340":["FL",27.95,-82.46],
  "341":["FL",26.64,-81.87],"342":["FL",27.95,-82.46],"344":["FL",29.21,-81.02],
  "346":["FL",27.95,-82.46],"347":["FL",27.95,-82.46],"349":["FL",28.54,-81.38],
  "350":["AL",33.52,-86.81],"351":["AL",33.52,-86.81],"352":["AL",33.52,-86.81],
  "354":["AL",33.52,-86.81],"355":["AL",33.52,-86.81],"356":["AL",34.73,-86.59],
  "357":["AL",34.73,-86.59],"358":["AL",34.73,-86.59],"359":["AL",33.52,-86.81],
  "360":["AL",32.38,-86.31],"361":["AL",32.38,-86.31],"362":["AL",32.38,-86.31],
  "363":["AL",31.85,-85.95],"364":["AL",31.85,-85.95],"365":["AL",30.69,-88.04],
  "366":["AL",30.69,-88.04],"367":["AL",31.85,-85.95],"368":["AL",31.85,-85.95],
  "369":["AL",34.76,-87.70],
  "370":["TN",36.16,-86.78],"371":["TN",36.16,-86.78],"372":["TN",36.16,-86.78],
  "373":["TN",35.96,-83.92],"374":["TN",35.96,-83.92],"375":["TN",35.15,-90.05],
  "376":["TN",35.15,-90.05],"377":["TN",35.96,-83.92],"378":["TN",35.96,-83.92],
  "379":["TN",35.96,-83.92],"380":["TN",35.15,-90.05],"381":["TN",35.15,-90.05],
  "382":["TN",36.16,-86.78],"383":["TN",36.16,-86.78],"384":["TN",36.16,-86.78],
  "385":["TN",36.16,-86.78],
  "386":["MS",34.93,-88.52],"387":["MS",33.50,-88.43],"388":["MS",32.30,-90.18],
  "389":["MS",32.30,-90.18],"390":["MS",32.30,-90.18],"391":["MS",32.30,-90.18],
  "392":["MS",32.30,-90.18],"393":["MS",30.37,-89.09],"394":["MS",30.37,-89.09],
  "395":["MS",30.37,-89.09],"396":["MS",30.37,-89.09],"397":["MS",32.36,-88.70],
  "398":["GA",30.83,-83.28],"399":["GA",30.83,-83.28],
  "400":["KY",38.25,-85.76],"401":["KY",38.25,-85.76],"402":["KY",38.25,-85.76],
  "403":["KY",37.99,-84.48],"404":["KY",37.99,-84.48],"405":["KY",37.99,-84.48],
  "406":["KY",37.99,-84.48],"407":["KY",37.99,-84.48],"408":["KY",37.99,-84.48],
  "409":["KY",37.99,-84.48],"410":["KY",38.25,-85.76],"411":["KY",37.08,-88.60],
  "412":["KY",37.08,-88.60],"413":["KY",37.08,-88.60],"414":["KY",37.72,-87.11],
  "415":["KY",37.72,-87.11],"416":["KY",37.72,-87.11],"417":["KY",37.72,-87.11],
  "418":["KY",37.72,-87.11],
  "420":["OH",41.50,-81.69],"421":["OH",41.50,-81.69],"422":["OH",41.50,-81.69],
  "423":["OH",41.08,-81.52],"424":["OH",41.08,-81.52],"425":["OH",41.08,-81.52],
  "426":["OH",39.96,-82.99],"427":["OH",39.96,-82.99],"428":["OH",41.66,-83.55],
  "429":["OH",41.66,-83.55],"430":["OH",39.96,-82.99],"431":["OH",39.96,-82.99],
  "432":["OH",39.96,-82.99],"433":["OH",39.96,-82.99],"434":["OH",41.66,-83.55],
  "435":["OH",41.66,-83.55],"436":["OH",39.96,-82.99],"437":["OH",39.76,-84.19],
  "438":["OH",39.76,-84.19],"439":["OH",39.10,-84.51],"440":["OH",41.50,-81.69],
  "441":["OH",41.50,-81.69],"442":["OH",41.10,-80.65],"443":["OH",41.10,-80.65],
  "444":["OH",41.24,-80.82],"445":["OH",41.24,-80.82],"446":["OH",40.80,-81.38],
  "447":["OH",40.80,-81.38],"448":["OH",40.76,-82.52],"449":["OH",40.76,-82.52],
  "450":["OH",39.10,-84.51],"451":["OH",39.10,-84.51],"452":["OH",39.76,-84.19],
  "453":["OH",39.76,-84.19],"454":["OH",39.76,-84.19],"455":["OH",40.48,-88.99],
  "456":["OH",39.96,-82.99],"457":["OH",39.42,-81.45],"458":["OH",38.73,-82.99],
  "459":["OH",38.73,-82.99],
  "460":["IN",39.77,-86.16],"461":["IN",39.77,-86.16],"462":["IN",39.77,-86.16],
  "463":["IN",41.68,-86.25],"464":["IN",41.68,-86.25],"465":["IN",41.08,-85.14],
  "466":["IN",41.08,-85.14],"467":["IN",41.61,-86.72],"468":["IN",41.61,-86.72],
  "469":["IN",41.61,-86.72],"470":["IN",39.77,-86.16],"471":["IN",37.97,-87.57],
  "472":["IN",40.19,-85.39],"473":["IN",40.49,-86.88],"474":["IN",39.47,-87.41],
  "475":["IN",39.47,-87.41],"476":["IN",40.49,-86.88],"477":["IN",40.49,-86.88],
  "478":["IN",40.49,-86.88],"479":["IN",40.49,-86.88],
  "480":["MI",42.33,-83.05],"481":["MI",42.33,-83.05],"482":["MI",42.33,-83.05],
  "483":["MI",42.33,-83.05],"484":["MI",42.97,-85.67],"485":["MI",42.97,-85.67],
  "486":["MI",42.29,-85.18],"487":["MI",42.29,-85.18],"488":["MI",43.42,-83.95],
  "489":["MI",43.42,-83.95],"490":["MI",42.33,-85.18],"491":["MI",42.33,-85.18],
  "492":["MI",43.01,-83.69],"493":["MI",43.01,-83.69],"494":["MI",44.76,-85.62],
  "495":["MI",46.54,-87.40],"496":["MI",43.01,-83.69],"497":["MI",42.33,-83.05],
  "498":["MI",46.54,-87.40],"499":["MI",46.54,-87.40],
  "500":["IA",41.59,-93.63],"501":["IA",41.59,-93.63],"502":["IA",41.59,-93.63],
  "503":["IA",41.59,-93.63],"504":["IA",41.59,-93.63],"505":["IA",42.50,-96.40],
  "506":["IA",42.50,-96.40],"507":["IA",42.50,-96.40],"508":["IA",42.50,-96.40],
  "510":["IA",42.50,-96.40],"511":["IA",43.43,-95.68],"512":["IA",42.50,-96.40],
  "513":["IA",43.43,-95.68],"514":["IA",43.43,-95.68],"515":["IA",42.49,-92.34],
  "516":["IA",42.49,-92.34],"520":["IA",42.50,-90.67],"521":["IA",42.50,-90.67],
  "522":["IA",41.52,-90.58],"523":["IA",41.52,-90.58],"524":["IA",40.81,-91.11],
  "525":["IA",40.81,-91.11],"526":["IA",40.81,-91.11],"527":["IA",41.00,-92.41],
  "528":["IA",41.98,-91.67],
  "530":["WI",43.04,-87.91],"531":["WI",43.04,-87.91],"532":["WI",43.04,-87.91],
  "534":["WI",43.04,-87.91],"535":["WI",43.07,-89.40],"537":["WI",43.07,-89.40],
  "538":["WI",44.52,-88.02],"539":["WI",44.52,-88.02],"540":["WI",44.81,-91.50],
  "541":["WI",44.52,-88.02],"542":["WI",44.52,-88.02],"543":["WI",44.52,-88.02],
  "544":["WI",44.52,-88.02],"545":["WI",44.52,-88.02],"546":["WI",42.73,-87.78],
  "547":["WI",42.68,-89.02],"548":["WI",44.52,-89.57],"549":["WI",46.60,-90.88],
  "550":["MN",44.95,-93.10],"551":["MN",44.95,-93.10],"553":["MN",44.95,-93.10],
  "554":["MN",44.95,-93.10],"555":["MN",44.95,-93.10],"556":["MN",46.79,-92.10],
  "557":["MN",46.79,-92.10],"558":["MN",47.43,-92.94],"559":["MN",44.01,-92.48],
  "560":["MN",44.01,-92.48],"561":["MN",44.01,-92.48],"562":["MN",44.01,-92.48],
  "563":["MN",43.66,-93.37],"564":["MN",43.66,-93.37],"565":["MN",47.50,-94.87],
  "566":["MN",47.50,-94.87],"567":["MN",47.50,-94.87],
  "570":["SD",43.54,-96.73],"571":["SD",43.54,-96.73],"572":["SD",44.08,-103.23],
  "573":["SD",44.08,-103.23],"574":["SD",43.54,-96.73],"575":["SD",43.54,-96.73],
  "576":["SD",45.46,-98.49],"577":["SD",45.46,-98.49],
  "580":["ND",46.88,-96.79],"581":["ND",46.88,-96.79],"582":["ND",48.23,-101.30],
  "583":["ND",48.23,-101.30],"584":["ND",47.93,-97.03],"585":["ND",46.88,-96.79],
  "586":["ND",46.88,-96.79],"587":["ND",47.93,-97.03],"588":["ND",48.23,-101.30],
  "590":["MT",45.78,-108.50],"591":["MT",45.78,-108.50],"592":["MT",45.78,-108.50],
  "593":["MT",46.60,-112.03],"594":["MT",47.50,-111.30],"595":["MT",47.50,-111.30],
  "596":["MT",46.88,-113.99],"597":["MT",48.19,-114.32],"598":["MT",48.19,-114.32],
  "599":["MT",48.19,-114.32],
  "600":["IL",41.88,-87.63],"601":["IL",41.88,-87.63],"602":["IL",41.88,-87.63],
  "603":["IL",41.88,-87.63],"604":["IL",41.88,-87.63],"605":["IL",41.88,-87.63],
  "606":["IL",41.88,-87.63],"607":["IL",41.88,-87.63],"608":["IL",41.88,-87.63],
  "609":["IL",41.88,-87.63],"610":["IL",41.88,-87.63],"611":["IL",42.04,-88.28],
  "612":["IL",42.04,-88.28],"613":["IL",41.53,-88.08],"614":["IL",41.53,-88.08],
  "615":["IL",40.69,-89.59],"616":["IL",40.69,-89.59],"617":["IL",40.69,-89.59],
  "618":["IL",38.67,-89.98],"619":["IL",38.67,-89.98],"620":["IL",38.89,-90.18],
  "621":["IL",39.78,-89.65],"622":["IL",39.78,-89.65],"623":["IL",40.12,-87.63],
  "624":["IL",40.12,-87.63],"625":["IL",39.78,-89.65],"626":["IL",39.78,-89.65],
  "627":["IL",39.78,-89.65],"628":["IL",37.90,-88.93],"629":["IL",37.90,-88.93],
  "630":["MO",38.63,-90.20],"631":["MO",38.63,-90.20],"633":["MO",38.63,-90.20],
  "634":["MO",38.63,-90.20],"635":["MO",38.63,-90.20],"636":["MO",38.63,-90.20],
  "637":["MO",38.63,-90.20],"638":["MO",38.63,-90.20],"639":["MO",38.63,-90.20],
  "640":["MO",39.10,-94.58],"641":["MO",39.10,-94.58],"644":["MO",39.10,-94.58],
  "645":["MO",39.10,-94.58],"646":["MO",39.77,-94.85],"647":["MO",39.77,-94.85],
  "648":["MO",37.22,-93.30],"649":["MO",37.22,-93.30],"650":["MO",38.58,-92.17],
  "651":["MO",38.58,-92.17],"652":["MO",38.58,-92.17],"653":["MO",39.71,-91.36],
  "654":["MO",37.08,-94.51],"655":["MO",37.08,-94.51],"656":["MO",37.08,-94.51],
  "657":["MO",37.08,-94.51],"658":["MO",37.08,-94.51],
  "660":["KS",39.05,-95.69],"661":["KS",39.05,-95.69],"662":["KS",37.69,-97.33],
  "664":["KS",37.69,-97.33],"665":["KS",37.69,-97.33],"666":["KS",37.69,-97.33],
  "667":["KS",37.69,-97.33],"668":["KS",38.06,-97.93],"669":["KS",38.06,-97.93],
  "670":["KS",38.06,-97.93],"671":["KS",38.06,-97.93],"672":["KS",38.06,-97.93],
  "673":["KS",38.06,-97.93],"674":["KS",38.06,-97.93],"675":["KS",37.69,-97.33],
  "676":["KS",38.06,-97.93],"677":["KS",38.06,-97.93],"678":["KS",38.06,-97.93],
  "679":["KS",38.06,-97.93],
  "680":["NE",41.26,-95.93],"681":["NE",41.26,-95.93],"683":["NE",40.81,-96.70],
  "684":["NE",40.81,-96.70],"685":["NE",40.81,-96.70],"686":["NE",40.81,-96.70],
  "687":["NE",40.81,-96.70],"688":["NE",40.81,-96.70],"689":["NE",40.81,-96.70],
  "690":["NE",40.81,-96.70],"691":["NE",40.81,-96.70],"692":["NE",40.81,-96.70],
  "693":["NE",40.81,-96.70],
  "700":["LA",29.95,-90.07],"701":["LA",29.95,-90.07],"703":["LA",29.95,-90.07],
  "704":["LA",29.95,-90.07],"705":["LA",31.31,-92.45],"706":["LA",30.45,-91.19],
  "707":["LA",30.45,-91.19],"708":["LA",30.45,-91.19],"710":["LA",32.53,-93.75],
  "711":["LA",32.53,-93.75],"712":["LA",32.51,-92.12],"713":["LA",29.83,-93.22],
  "714":["LA",29.83,-93.22],
  "716":["AR",35.39,-94.40],"717":["AR",35.39,-94.40],"718":["AR",34.75,-92.29],
  "719":["AR",34.75,-92.29],"720":["AR",34.75,-92.29],"721":["AR",34.75,-92.29],
  "722":["AR",34.75,-92.29],"723":["AR",34.75,-92.29],"724":["AR",35.84,-90.70],
  "725":["AR",35.84,-90.70],"726":["AR",35.39,-94.40],"727":["AR",35.84,-90.70],
  "728":["AR",35.84,-90.70],"729":["AR",35.84,-90.70],
  "730":["OK",35.47,-97.52],"731":["OK",35.47,-97.52],"733":["OK",36.71,-97.09],
  "734":["OK",36.15,-95.99],"735":["OK",36.15,-95.99],"736":["OK",36.15,-95.99],
  "737":["OK",36.15,-95.99],"738":["OK",36.15,-95.99],"739":["OK",35.47,-97.52],
  "740":["OK",36.15,-95.99],"741":["OK",36.15,-95.99],"743":["OK",36.15,-95.99],
  "744":["OK",35.47,-97.52],"745":["OK",35.47,-97.52],"746":["OK",35.47,-97.52],
  "747":["OK",35.47,-97.52],"748":["OK",35.47,-97.52],"749":["OK",35.47,-97.52],
  "750":["TX",32.78,-96.80],"751":["TX",32.78,-96.80],"752":["TX",32.78,-96.80],
  "753":["TX",32.78,-96.80],"754":["TX",32.78,-96.80],"755":["TX",32.08,-94.12],
  "756":["TX",32.08,-94.12],"757":["TX",32.08,-94.12],"758":["TX",33.44,-94.04],
  "759":["TX",31.55,-97.15],"760":["TX",32.72,-97.32],"761":["TX",32.72,-97.32],
  "762":["TX",32.72,-97.32],"763":["TX",33.91,-98.49],"764":["TX",31.55,-97.15],
  "765":["TX",31.55,-97.15],"766":["TX",31.55,-97.15],"767":["TX",31.55,-97.15],
  "768":["TX",31.55,-97.15],"769":["TX",32.30,-90.19],"770":["TX",29.76,-95.37],
  "771":["TX",29.76,-95.37],"772":["TX",29.76,-95.37],"773":["TX",29.76,-95.37],
  "774":["TX",29.76,-95.37],"775":["TX",29.76,-95.37],"776":["TX",30.09,-94.10],
  "777":["TX",30.09,-94.10],"778":["TX",27.80,-97.40],"779":["TX",27.80,-97.40],
  "780":["TX",29.42,-98.49],"781":["TX",29.42,-98.49],"782":["TX",29.42,-98.49],
  "783":["TX",29.42,-98.49],"784":["TX",29.42,-98.49],"785":["TX",30.27,-97.74],
  "786":["TX",30.27,-97.74],"787":["TX",30.27,-97.74],"788":["TX",30.27,-97.74],
  "789":["TX",30.27,-97.74],"790":["TX",35.22,-101.83],"791":["TX",35.22,-101.83],
  "792":["TX",35.22,-101.83],"793":["TX",31.76,-106.49],"794":["TX",31.76,-106.49],
  "795":["TX",31.76,-106.49],"796":["TX",32.45,-99.73],"797":["TX",32.45,-99.73],
  "798":["TX",31.76,-106.49],"799":["TX",31.76,-106.49],
  "800":["CO",39.74,-104.99],"801":["CO",39.74,-104.99],"802":["CO",39.74,-104.99],
  "803":["CO",39.74,-104.99],"804":["CO",39.74,-104.99],"805":["CO",40.59,-105.08],
  "806":["CO",40.59,-105.08],"807":["CO",40.59,-105.08],"808":["CO",38.83,-104.82],
  "809":["CO",38.83,-104.82],"810":["CO",38.25,-104.61],"811":["CO",37.68,-106.25],
  "812":["CO",39.06,-108.55],"813":["CO",39.06,-108.55],"814":["CO",37.68,-106.25],
  "815":["CO",37.68,-106.25],"816":["CO",37.68,-106.25],
  "820":["WY",41.14,-104.82],"821":["WY",41.14,-104.82],"822":["WY",42.85,-106.33],
  "823":["WY",42.85,-106.33],"824":["WY",42.85,-106.33],"825":["WY",42.85,-106.33],
  "826":["WY",42.85,-106.33],"827":["WY",42.85,-106.33],"828":["WY",41.14,-104.82],
  "829":["WY",41.14,-104.82],"830":["WY",41.14,-104.82],"831":["WY",41.14,-104.82],
  "832":["ID",43.62,-116.20],"833":["ID",43.62,-116.20],"834":["ID",43.62,-116.20],
  "835":["ID",43.62,-116.20],"836":["ID",43.62,-116.20],"837":["ID",43.62,-116.20],
  "838":["ID",47.66,-116.78],
  "840":["UT",40.76,-111.89],"841":["UT",40.76,-111.89],"842":["UT",40.76,-111.89],
  "843":["UT",40.76,-111.89],"844":["UT",40.76,-111.89],"845":["UT",40.76,-111.89],
  "846":["UT",40.76,-111.89],"847":["UT",40.76,-111.89],
  "850":["AZ",33.45,-112.07],"851":["AZ",33.45,-112.07],"852":["AZ",33.45,-112.07],
  "853":["AZ",33.45,-112.07],"854":["AZ",33.45,-112.07],"855":["AZ",33.45,-112.07],
  "856":["AZ",32.22,-110.97],"857":["AZ",32.22,-110.97],"859":["AZ",34.54,-112.47],
  "860":["AZ",34.54,-112.47],"863":["AZ",34.54,-112.47],"864":["AZ",32.72,-114.62],
  "865":["AZ",32.22,-110.97],
  "870":["NM",35.08,-106.65],"871":["NM",35.08,-106.65],"872":["NM",35.08,-106.65],
  "873":["NM",35.08,-106.65],"874":["NM",36.73,-108.21],"875":["NM",35.08,-106.65],
  "877":["NM",35.08,-106.65],"878":["NM",33.39,-104.52],"879":["NM",32.32,-106.77],
  "880":["NM",31.76,-106.49],"881":["NM",31.76,-106.49],"882":["NM",34.00,-106.90],
  "883":["NM",34.00,-106.90],"884":["NM",34.00,-106.90],
  "889":["NV",36.17,-115.14],"890":["NV",36.17,-115.14],"891":["NV",36.17,-115.14],
  "893":["NV",36.17,-115.14],"894":["NV",39.53,-119.81],"895":["NV",39.53,-119.81],
  "897":["NV",39.53,-119.81],"898":["NV",39.53,-119.81],
  "900":["CA",34.05,-118.24],"901":["CA",34.05,-118.24],"902":["CA",34.05,-118.24],
  "903":["CA",34.05,-118.24],"904":["CA",34.05,-118.24],"905":["CA",34.05,-118.24],
  "906":["CA",34.05,-118.24],"907":["CA",34.05,-118.24],"908":["CA",34.05,-118.24],
  "910":["CA",34.05,-118.24],"911":["CA",34.05,-118.24],"912":["CA",34.05,-118.24],
  "913":["CA",34.18,-118.31],"914":["CA",34.18,-118.31],"915":["CA",34.18,-118.31],
  "916":["CA",34.18,-118.31],"917":["CA",34.18,-118.31],"918":["CA",34.18,-118.31],
  "919":["CA",32.72,-117.16],"920":["CA",32.72,-117.16],"921":["CA",32.72,-117.16],
  "922":["CA",33.98,-117.38],"923":["CA",33.98,-117.38],"924":["CA",33.98,-117.38],
  "925":["CA",33.77,-117.98],"926":["CA",33.77,-117.98],"927":["CA",33.77,-117.98],
  "928":["CA",33.77,-117.98],"930":["CA",34.42,-119.70],"931":["CA",34.42,-119.70],
  "932":["CA",36.74,-119.79],"933":["CA",36.74,-119.79],"934":["CA",35.37,-119.02],
  "935":["CA",35.37,-119.02],"936":["CA",36.74,-119.79],"937":["CA",36.74,-119.79],
  "938":["CA",36.74,-119.79],"939":["CA",36.60,-121.89],"940":["CA",37.78,-122.42],
  "941":["CA",37.78,-122.42],"942":["CA",38.58,-121.49],"943":["CA",37.56,-122.33],
  "944":["CA",37.56,-122.33],"945":["CA",37.56,-122.33],"946":["CA",37.72,-121.94],
  "947":["CA",37.72,-121.94],"948":["CA",38.44,-122.71],"949":["CA",38.44,-122.71],
  "950":["CA",37.34,-121.89],"951":["CA",37.34,-121.89],"952":["CA",37.72,-121.94],
  "953":["CA",37.34,-121.89],"954":["CA",38.58,-121.49],"955":["CA",40.59,-122.39],
  "956":["CA",38.58,-121.49],"957":["CA",38.58,-121.49],"958":["CA",38.58,-121.49],
  "959":["CA",40.59,-122.39],"960":["CA",40.59,-122.39],"961":["CA",39.52,-119.81],
  "970":["OR",45.52,-122.68],"971":["OR",45.52,-122.68],"972":["OR",45.52,-122.68],
  "973":["OR",45.52,-122.68],"974":["OR",42.33,-122.88],"975":["OR",44.05,-123.09],
  "976":["OR",42.33,-122.88],"977":["OR",43.37,-124.22],"978":["OR",44.05,-123.09],
  "979":["OR",44.05,-123.09],
  "980":["WA",47.61,-122.33],"981":["WA",47.61,-122.33],"982":["WA",47.61,-122.33],
  "983":["WA",47.61,-122.33],"984":["WA",47.25,-122.44],"985":["WA",47.25,-122.44],
  "986":["WA",45.63,-122.67],"988":["WA",47.66,-117.43],"989":["WA",46.21,-119.14],
  "990":["WA",47.66,-117.43],"991":["WA",47.66,-117.43],"992":["WA",47.66,-117.43],
  "993":["WA",46.21,-119.14],"994":["WA",46.21,-119.14],"995":["AK",61.22,-149.90],
  "996":["AK",61.22,-149.90],"997":["AK",64.84,-147.72],"998":["AK",59.55,-151.49],
  "999":["AK",55.34,-131.65],
};

// ─── GEOCODE: ZIP or City/State ───────────────────────────────────────────────
const CITY_COORDS = {
  "chicago": [41.8781, -87.6298],
  "new york": [40.7128, -74.0059],
  "los angeles": [34.0522, -118.2437],
  "houston": [29.7604, -95.3698],
  "phoenix": [33.4484, -112.0740],
  "philadelphia": [39.9526, -75.1652],
  "san antonio": [29.4241, -98.4936],
  "san diego": [32.7157, -117.1611],
  "dallas": [32.7767, -96.7970],
  "san jose": [37.3382, -121.8863],
  "austin": [30.2672, -97.7431],
  "jacksonville": [30.3322, -81.6557],
  "fort worth": [32.7548, -97.3308],
  "columbus": [39.9612, -82.9988],
  "charlotte": [35.2271, -80.8431],
  "indianapolis": [39.7684, -86.1581],
  "san francisco": [37.7749, -122.4194],
  "seattle": [47.6062, -122.3321],
  "denver": [39.7392, -104.9903],
  "boston": [42.3601, -71.0589],
  "detroit": [42.3314, -83.0458],
  "nashville": [36.1627, -86.7816],
  "memphis": [35.1495, -90.0490],
  "portland": [45.5231, -122.6765],
  "oklahoma city": [35.4676, -97.5164],
  "las vegas": [36.1699, -115.1398],
  "louisville": [38.2527, -85.7585],
  "baltimore": [39.2904, -76.6122],
  "milwaukee": [43.0389, -87.9065],
  "albuquerque": [35.0844, -106.6504],
  "tucson": [32.2226, -110.9747],
  "fresno": [36.7378, -119.7871],
  "sacramento": [38.5816, -121.4944],
  "mesa": [33.4152, -111.8315],
  "kansas city": [39.0997, -94.5786],
  "atlanta": [33.7490, -84.3880],
  "omaha": [41.2565, -95.9345],
  "colorado springs": [38.8339, -104.8214],
  "raleigh": [35.7796, -78.6382],
  "long beach": [33.7701, -118.1937],
  "virginia beach": [36.8529, -75.9780],
  "minneapolis": [44.9778, -93.2650],
  "tampa": [27.9506, -82.4572],
  "new orleans": [29.9511, -90.0715],
  "cleveland": [41.4993, -81.6944],
  "pittsburgh": [40.4406, -79.9959],
  "miami": [25.7617, -80.1918],
  "cincinnati": [39.1031, -84.5120],
  "st louis": [38.6270, -90.1994],
  "st. louis": [38.6270, -90.1994],
  "orlando": [28.5383, -81.3792],
  "columbia": [34.0007, -81.0348],
  "athens": [33.9519, -83.3576],
  "richmond": [37.5407, -77.4360],
  "birmingham": [33.5186, -86.8104],
  "mobile": [30.6954, -88.0399],
  "montgomery": [32.3668, -86.2999],
  "baton rouge": [30.4515, -91.1871],
  "shreveport": [32.5252, -93.7502],
  "knoxville": [35.9606, -83.9207],
  "chattanooga": [35.0456, -85.3097],
  "greenville": [34.8526, -82.3940],
  "columbia sc": [34.0007, -81.0348],
  "columbia md": [39.2037, -76.8610],
  "columbia mo": [38.9517, -92.3341],
  "athens ga": [33.9519, -83.3576],
  "athens oh": [39.3292, -82.1013],
  "richmond va": [37.5407, -77.4360],
  "pensacola": [30.4213, -87.2169],
  "tallahassee": [30.4383, -84.2807],
  "gainesville": [29.6520, -82.3250],
  "savannah": [32.0835, -81.0998],
  "augusta": [33.4735, -82.0105],
  "macon": [32.8407, -83.6324],
  "spokane": [47.6588, -117.4260],
  "tacoma": [47.2529, -122.4443],
  "anchorage": [61.2181, -149.9003],
  "honolulu": [21.3069, -157.8583],
  "el paso": [31.7619, -106.4850],
  "wichita": [37.6872, -97.3301],
  "tulsa": [36.1539, -95.9928],
  "lexington": [38.0406, -84.5037],
  "lincoln": [40.8136, -96.7026],
  "fort wayne": [41.1306, -85.1289],
  "des moines": [41.5868, -93.6250],
  "grand rapids": [42.9634, -85.6681],
  "worcester": [42.2626, -71.8023],
  "hartford": [41.7658, -72.6851],
  "providence": [41.8240, -71.4128],
  "buffalo": [42.8864, -78.8784],
  "rochester": [43.1566, -77.6088],
  "syracuse": [43.0481, -76.1474],
  "albany": [42.6526, -73.7562],
  "salt lake city": [40.7608, -111.8910],
  "boise": [43.6150, -116.2023],
  "little rock": [34.7465, -92.2896],
  "jackson": [32.2988, -90.1848],
  "charleston": [32.7765, -79.9311],
  "north charleston": [32.8546, -79.9748],
  "charleston sc": [32.7765, -79.9311],
  "charleston wv": [38.3498, -81.6326],
  // ── North Dakota ──
  "grand forks": [47.9253, -97.0329],
  "fargo": [46.8772, -96.7898],
  "bismarck": [46.8083, -100.7837],
  "minot": [48.2325, -101.2963],
  "williston": [48.1470, -103.6180],
  // ── Montana ──
  "billings": [45.7833, -108.5007],
  "missoula": [46.8721, -113.9940],
  "great falls": [47.5002, -111.3008],
  "kalispell": [48.1920, -114.3168],
  "helena": [46.5958, -112.0270],
  "butte": [46.0038, -112.5349],
  // ── Wyoming ──
  "casper": [42.8666, -106.3131],
  "cheyenne": [41.1400, -104.8202],
  "laramie": [41.3114, -105.5911],
  // ── South Dakota ──
  "sioux falls": [43.5446, -96.7311],
  "rapid city": [44.0805, -103.2310],
  "aberdeen": [45.4647, -98.4865],
  // ── Nebraska ──
  "omaha": [41.2565, -95.9345],
  "lincoln": [40.8136, -96.7026],
  "grand island": [40.9250, -98.3420],
  // ── Iowa ──
  "des moines": [41.5868, -93.6250],
  "cedar rapids": [41.9779, -91.6656],
  "davenport": [41.5236, -90.5776],
  "sioux city": [42.4999, -96.4003],
  "dubuque": [42.5006, -90.6646],
  "waterloo": [42.4928, -92.3426],
  // ── Minnesota ──
  "minneapolis": [44.9778, -93.2650],
  "saint paul": [44.9537, -93.0900],
  "rochester": [44.0121, -92.4802],
  "duluth": [46.7867, -92.1005],
  "st. cloud": [45.5579, -94.1632],
  "mankato": [44.1636, -93.9994],
  // ── Wisconsin ──
  "milwaukee": [43.0389, -87.9065],
  "madison": [43.0731, -89.4012],
  "green bay": [44.5133, -88.0133],
  "racine": [42.7261, -87.7829],
  "kenosha": [42.5847, -87.8212],
  "appleton": [44.2619, -88.4154],
  "janesville": [42.6828, -89.0187],
  "eau claire": [44.8113, -91.4985],
  "la crosse": [43.8014, -91.2396],
  "sheboygan": [43.7508, -87.7145],
  "wausau": [44.9591, -89.6301],
  // ── Michigan ──
  "detroit": [42.3314, -83.0458],
  "grand rapids": [42.9634, -85.6681],
  "lansing": [42.7325, -84.5555],
  "flint": [43.0125, -83.6875],
  "ann arbor": [42.2808, -83.7430],
  "kalamazoo": [42.2917, -85.5872],
  "saginaw": [43.4195, -83.9508],
  "bay city": [43.5945, -83.8889],
  "battle creek": [42.3212, -85.1797],
  "marquette": [46.5436, -87.3954],
  "traverse city": [44.7631, -85.6206],
  "muskegon": [43.2342, -86.2484],
  "pontiac": [42.6389, -83.2910],
  // ── Illinois ──
  "springfield": [39.7817, -89.6501],
  "peoria": [40.6936, -89.5890],
  "rockford": [42.2711, -89.0940],
  "aurora": [41.7606, -88.3201],
  "joliet": [41.5250, -88.0817],
  "elgin": [42.0354, -88.2826],
  "champaign": [40.1164, -88.2434],
  "decatur": [39.8403, -88.9548],
  "moline": [41.5067, -90.5151],
  "danville": [40.1242, -87.6300],
  "alton": [38.8906, -90.1843],
  "collinsville": [38.6703, -89.9845],
  "waukegan": [42.3636, -87.8448],
  "quincy": [39.9356, -91.4099],
  "warrenville": [41.8128, -88.1651],
  // ── Indiana ──
  "fort wayne": [41.0793, -85.1394],
  "evansville": [37.9716, -87.5711],
  "south bend": [41.6764, -86.2520],
  "gary": [41.5934, -87.3464],
  "hammond": [41.5831, -87.5000],
  "terre haute": [39.4667, -87.4139],
  "muncie": [40.1934, -85.3864],
  "kokomo": [40.4865, -86.1336],
  "lafayette": [40.4167, -86.8753],
  "anderson": [40.1053, -85.6803],
  "bloomington": [39.1653, -86.5264],
  "laporte": [41.6103, -86.7222],
  // ── Ohio ──
  "cleveland": [41.4993, -81.6944],
  "cincinnati": [39.1031, -84.5120],
  "toledo": [41.6528, -83.5379],
  "akron": [41.0814, -81.5190],
  "dayton": [39.7589, -84.1916],
  "youngstown": [41.0998, -80.6495],
  "canton": [40.7989, -81.3784],
  "lorain": [41.4528, -82.1824],
  "hamilton": [39.3995, -84.5613],
  "springfield oh": [39.9242, -83.8088],
  "mansfield": [40.7584, -82.5154],
  "warren": [41.2376, -80.8184],
  "newark": [40.0581, -82.4013],
  "portsmouth": [38.7318, -82.9977],
  "marietta": [39.4151, -81.4549],
  "parkersburg": [39.2667, -81.5615],
  "massillon": [40.7967, -81.5218],
  // ── Pennsylvania ──
  "pittsburgh": [40.4406, -79.9959],
  "allentown": [40.6084, -75.4902],
  "erie": [42.1292, -80.0851],
  "reading": [40.3356, -75.9269],
  "scranton": [41.4090, -75.6624],
  "bethlehem": [40.6259, -75.3705],
  "harrisburg": [40.2732, -76.8867],
  "lancaster": [40.0379, -76.3055],
  "york": [39.9626, -76.7277],
  "altoona": [40.5187, -78.3947],
  "williamsport": [41.2415, -77.0011],
  "chester": [39.8493, -75.3557],
  "beaver": [40.6959, -80.3045],
  "cumberland": [39.6526, -78.7625],
  "shamokin": [40.7887, -76.5574],
  // ── West Virginia ──
  "charleston wv": [38.3498, -81.6326],
  "huntington": [38.4193, -82.4452],
  "wheeling": [40.0640, -80.7209],
  "morgantown": [39.6295, -79.9559],
  "clarksburg": [39.2806, -80.3445],
  "parkersburg wv": [39.2667, -81.5615],
  // ── Kentucky ──
  "louisville": [38.2527, -85.7585],
  "lexington": [38.0406, -84.5037],
  "bowling green": [36.9685, -86.4808],
  "owensboro": [37.7719, -87.1112],
  "covington": [39.0837, -84.5086],
  "paducah": [37.0834, -88.6000],
  // ── Tennessee ──
  "memphis": [35.1495, -90.0490],
  "nashville": [36.1627, -86.7816],
  "knoxville": [35.9606, -83.9207],
  "chattanooga": [35.0456, -85.3097],
  "clarksville": [36.5298, -87.3595],
  "murfreesboro": [35.8456, -86.3903],
  "kingsport": [36.5484, -82.5618],
  "johnson city": [36.3134, -82.3535],
  "jackson tn": [35.6145, -88.8139],
  "martin tn": [36.3434, -88.8503],
  // ── Mississippi ──
  "jackson ms": [32.2988, -90.1848],
  "gulfport": [30.3674, -89.0928],
  "biloxi": [30.3960, -88.8853],
  "meridian": [32.3643, -88.7037],
  "corinth": [34.9343, -88.5223],
  "hattiesburg": [31.3271, -89.2903],
  // ── Alabama ──
  "birmingham": [33.5186, -86.8104],
  "montgomery": [32.3617, -86.2792],
  "mobile": [30.6954, -88.0399],
  "huntsville": [34.7304, -86.5861],
  "tuscaloosa": [33.2098, -87.5692],
  "sheffield": [34.7651, -87.6975],
  "anniston": [33.6598, -85.8316],
  // ── Georgia ──
  "atlanta": [33.7490, -84.3880],
  "savannah": [32.0835, -81.0998],
  "macon": [32.8407, -83.6324],
  "albany ga": [31.5785, -84.1557],
  "augusta": [33.4735, -82.0105],
  "columbus ga": [32.4610, -84.9877],
  "newnan": [33.3807, -84.7997],
  // ── Florida ──
  "miami": [25.7617, -80.1918],
  "orlando": [28.5383, -81.3792],
  "tampa": [27.9506, -82.4572],
  "jacksonville fl": [30.3322, -81.6557],
  "fort lauderdale": [26.1224, -80.1373],
  "tallahassee": [30.4518, -84.2807],
  "pensacola": [30.4213, -87.2169],
  "gainesville": [29.6516, -82.3248],
  "daytona beach": [29.2108, -81.0228],
  "port orange": [29.1086, -80.9953],
  "lake charles": [30.2266, -93.2174],
  // ── Louisiana ──
  "new orleans": [29.9511, -90.0715],
  "baton rouge": [30.4515, -91.1871],
  "shreveport": [32.5252, -93.7502],
  "lafayette la": [30.2241, -92.0198],
  "monroe": [32.5093, -92.1193],
  "bogalusa": [30.7910, -89.8487],
  "alexandria la": [31.3113, -92.4451],
  // ── Arkansas ──
  "little rock": [34.7465, -92.2896],
  "fort smith": [35.3859, -94.3985],
  "fayetteville": [36.0626, -94.1574],
  "jonesboro": [35.8423, -90.7043],
  "el dorado": [33.2076, -92.6663],
  "texarkana": [33.4251, -94.0477],
  // ── Texas ──
  "san antonio": [29.4241, -98.4936],
  "el paso": [31.7619, -106.4850],
  "amarillo": [35.2220, -101.8313],
  "lubbock": [33.5779, -101.8552],
  "wichita falls": [33.9137, -98.4934],
  "beaumont": [30.0802, -94.1266],
  "corpus christi": [27.8006, -97.3964],
  "longview": [32.5007, -94.7405],
  "waco": [31.5493, -97.1467],
  "abilene": [32.4487, -99.7331],
  "odessa": [31.8457, -102.3676],
  "midland": [31.9974, -102.0779],
  "galveston": [29.3013, -94.7977],
  "texas city": [29.3841, -94.9027],
  "tyler": [32.3513, -95.3011],
  "mcallen": [26.2034, -98.2300],
  "laredo": [27.5306, -99.4803],
  // ── Oklahoma ──
  "oklahoma city": [35.4676, -97.5164],
  "tulsa": [36.1540, -95.9928],
  "norman": [35.2226, -97.4395],
  "lawton": [34.6036, -98.3959],
  "ponca city": [36.7070, -97.0856],
  // ── Kansas ──
  "wichita": [37.6872, -97.3301],
  "topeka": [39.0489, -95.6780],
  "kansas city ks": [39.1142, -94.6275],
  "hutchinson": [38.0608, -97.9298],
  // ── Missouri ──
  "kansas city": [39.0997, -94.5786],
  "st. louis": [38.6270, -90.1994],
  "springfield mo": [37.2090, -93.2923],
  "columbia": [38.9517, -92.3341],
  "joplin": [37.0842, -94.5133],
  "hannibal": [39.7081, -91.3585],
  "st. joseph": [39.7675, -94.8467],
  // ── New Mexico ──
  "albuquerque": [35.0844, -106.6504],
  "santa fe": [35.6870, -105.9378],
  "las cruces": [32.3199, -106.7637],
  "roswell": [33.3943, -104.5230],
  "globe": [33.3942, -110.7857],
  // ── Arizona ──
  "tucson": [32.2226, -110.9747],
  "mesa": [33.4152, -111.8315],
  "chandler": [33.3062, -111.8413],
  "gilbert": [33.3528, -111.7890],
  "scottsdale": [33.4942, -111.9261],
  "tempe": [33.4255, -111.9400],
  "yuma": [32.6927, -114.6277],
  "flagstaff": [35.1983, -111.6513],
  // ── Nevada ──
  "las vegas": [36.1699, -115.1398],
  "reno": [39.5296, -119.8138],
  "henderson": [36.0395, -114.9817],
  "sparks": [39.5349, -119.7527],
  // ── Utah ──
  "salt lake city": [40.7608, -111.8910],
  "provo": [40.2338, -111.6585],
  "ogden": [41.2230, -111.9738],
  "st. george": [37.0965, -113.5684],
  "pocatello": [42.8713, -112.4455],
  // ── Idaho ──
  "boise": [43.6150, -116.2023],
  "nampa": [43.5407, -116.5635],
  "twin falls": [42.5558, -114.4609],
  // ── Colorado ──
  "colorado springs": [38.8339, -104.8214],
  "pueblo": [38.2544, -104.6091],
  "fort collins": [40.5853, -105.0844],
  "aurora co": [39.7294, -104.8319],
  "boulder": [40.0150, -105.2705],
  "grand junction": [39.0639, -108.5506],
  // ── New Mexico / West ──
  "farmington": [36.7281, -108.2087],
  // ── Pacific Northwest ──
  "tacoma": [47.2529, -122.4443],
  "spokane": [47.6587, -117.4260],
  "everett": [47.9790, -122.2021],
  "bellingham": [48.7519, -122.4787],
  "yakima": [46.6021, -120.5059],
  "mount vernon": [48.4215, -122.3343],
  "eugene": [44.0521, -123.0868],
  "salem": [44.9429, -123.0351],
  "medford": [42.3265, -122.8756],
  "bend": [44.0582, -121.3153],
  "coos bay": [43.3665, -124.2179],
  // ── California ──
  "sacramento": [38.5816, -121.4944],
  "fresno": [36.7378, -119.7871],
  "long beach": [33.7701, -118.1937],
  "bakersfield": [35.3733, -119.0187],
  "oakland": [37.8044, -122.2712],
  "riverside": [33.9806, -117.3755],
  "stockton": [37.9577, -121.2908],
  "santa rosa": [38.4404, -122.7141],
  "modesto": [37.6391, -120.9969],
  "ventura": [34.2805, -119.2945],
  "chico": [39.7285, -121.8375],
  "redding": [40.5865, -122.3917],
  "visalia": [36.3302, -119.2921],
  "santa barbara": [34.4208, -119.6982],
  "san bernardino": [34.1083, -117.2898],
  "anaheim": [33.8366, -117.9143],
  "fremont": [37.5485, -121.9886],
  "oxnard": [34.1975, -119.1771],
  "pomona": [34.0553, -117.7500],
  "escondido": [33.1192, -117.0864],
  "hayward": [37.6688, -122.0808],
  "sunnyvale": [37.3688, -122.0363],
  "orange": [33.7879, -117.8531],
  "buellton": [34.6138, -120.1942],
  "dublin ca": [37.7021, -121.9358],
  "vacaville": [38.3566, -121.9877],
  // ── New England ──
  "boston": [42.3601, -71.0589],
  "worcester": [42.2626, -71.8023],
  "springfield ma": [42.1015, -72.5898],
  "providence": [41.8240, -71.4128],
  "hartford": [41.7658, -72.6851],
  "new haven": [41.3083, -72.9279],
  "bridgeport": [41.1865, -73.1952],
  "stamford": [41.0534, -73.5387],
  "manchester nh": [42.9956, -71.4548],
  "concord nh": [43.2081, -71.5376],
  "portland me": [43.6591, -70.2568],
  "auburn me": [44.0979, -70.2312],
  "bangor": [44.8012, -68.7778],
  "burlington vt": [44.4759, -73.2121],
  // ── New York ──
  "buffalo": [42.8864, -78.8784],
  "rochester ny": [43.1566, -77.6088],
  "yonkers": [40.9312, -73.8988],
  "syracuse": [43.0481, -76.1474],
  "albany ny": [42.6526, -73.7562],
  "utica": [43.1009, -75.2327],
  "binghamton": [42.0987, -75.9180],
  "watertown ny": [43.9748, -75.9107],
  "geneva ny": [42.8687, -76.9777],
  "new city": [41.1476, -74.1468],
  "long island": [40.8176, -73.0479],
  "holtsville": [40.8176, -73.0479],
  "flushing": [40.7678, -73.8330],
  "cicero ny": [43.1566, -76.0700],
  // ── New Jersey ──
  "newark nj": [40.7357, -74.1724],
  "jersey city": [40.7178, -74.0431],
  "paterson": [40.9168, -74.1719],
  "trenton": [40.2171, -74.7429],
  "camden": [39.9259, -75.1196],
  "parsippany": [40.8573, -74.4210],
  "asbury park": [40.2206, -74.0121],
  "wall": [40.1549, -74.1068],
  "hammonton": [39.6434, -74.7996],
  "north brunswick": [40.4871, -74.4829],
  // ── Delaware / Maryland ──
  "wilmington de": [39.7447, -75.5484],
  "new castle": [39.6618, -75.5666],
  "baltimore": [39.2904, -76.6122],
  "annapolis": [38.9784, -76.4922],
  "frederick": [39.4143, -77.4105],
  "hagerstown": [39.6418, -77.7199],
  "forestville": [38.8513, -76.8680],
  // ── Virginia ──
  "richmond": [37.5407, -77.4360],
  "norfolk": [36.8508, -76.2859],
  "virginia beach": [36.8529, -75.9780],
  "chesapeake": [36.7682, -76.2875],
  "newport news": [37.0871, -76.4730],
  "hampton": [37.0299, -76.3452],
  "roanoke": [37.2710, -79.9414],
  "alexandria va": [38.8048, -77.0469],
  "highland springs": [37.5407, -77.4360],
  // ── North Carolina ──
  "raleigh": [35.7796, -78.6382],
  "greensboro": [36.0726, -79.7920],
  "winston-salem": [36.0999, -80.2442],
  "durham": [35.9940, -78.8986],
  "fayetteville": [35.0527, -78.8784],
  "wilmington nc": [34.2257, -77.9447],
  "asheville": [35.5951, -82.5515],
  "high point": [35.9557, -80.0053],
  // ── South Carolina ──
  "columbia sc": [34.0007, -81.0348],
  "charleston sc": [32.7765, -79.9311],
  "north charleston": [32.8546, -79.9748],
  "greenville sc": [34.8526, -82.3940],
  // ── Alaska ──
  "anchorage": [61.2181, -149.9003],
  "fairbanks": [64.8378, -147.7164],
  "juneau": [58.3005, -134.4197],
  // ── Hawaii ──
  "honolulu": [21.3069, -157.8583],
  "hilo": [19.7297, -155.0900],

};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function UnionPathway() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [locationLabel, setLocationLabel] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const [apprenticeOpen, setApprenticeOpen] = useState(false);
  const [vetSection, setVetSection] = useState(null);
  const [retSection, setRetSection] = useState(null);
  const [partnerSection, setPartnerSection] = useState(null);
  const [localSection, setLocalSection] = useState(null);
  const [calcTrade, setCalcTrade] = useState("IBEW_I");
  const [calcYear, setCalcYear] = useState("journeyman");
  const [calcCity, setCalcCity] = useState("");
  const [calcTier, setCalcTier] = useState(2);
  const [calcHours, setCalcHours] = useState(1800);
  const [calcYearsCareer, setCalcYearsCareer] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [learnOpen, setLearnOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("IBEW_I");
  // URL-aware page state
  const getPageFromUrl = () => {
    const path = window.location.pathname.replace('/', '') || 'home';
    const validPages = ['home','quiz','careers','checklist','locals','calculator','veterans','history','retirement','health','benefits','about','contact'];
    return validPages.includes(path) ? path : 'home';
  };
  const [page, setPageState] = useState(getPageFromUrl);
  const setPage = (newPage) => {
    setPageState(newPage);
    const url = newPage === 'home' ? '/' : '/' + newPage;
    window.history.pushState({ page: newPage }, '', url);
    window.scrollTo(0, 0);
  };
  const [lang, setLang] = useState("en");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // ── TRANSLATIONS ────────────────────────────────────────────────────────────
  const T = {
    en: {
      tagline: "Find Your Union Local",
      heroTitle1: "Everything",
      heroAccent: "Union Trades.",
      heroTitle2: "One Place.",
      heroSub: "Find union locals, explore career paths, understand your benefits, and learn the history of the labor movement — all in one platform.",
      searchLabel: "Enter ZIP Code or City, State",
      searchBtn: "Find Local",
      geoBtn: "Use My Current Location",
      locating: "Detecting location…",
      nearYou: "Locals Near You",
      nearest: "Nearest",
      milesAway: "miles away",
      visitWebsite: "Visit Website",
      navQuiz: "Which Trade?",
      navCareers: "Career Path",
      navContact: "Contact",
      navChecklist: "Join a Union",
      navVets: "Veterans",
      navHome: "Find a Local",
      errorMsg: "We couldn't find that location. Try a ZIP code or \"City, State\".",
      ibewLabel: "⚡ IBEW Inside —",
      ibewLinLabel: "⚡ IBEW Lineman —",
      uaLabel: "🔧 UA Plumbers & Pipefitters —",
      smartLabel: "🌬️ SMART Sheet Metal Workers —",
      bacLabel: "🧱 BAC Bricklayers —",
      ubcLabel: "🪚 UBC Carpenters —",
      liunaLabel: "⚒️ LIUNA Laborers —",
      iwLabel: "🏗️ Ironworkers —",
      iuecLabel: "🛗 Elevator Constructors —",
      hfiawLabel: "🔥 Insulators —",
      sfLabel: "💧 Sprinkler Fitters —",
      featIBEW: "266 IBEW locals across all 50 states",
      featUA: "210 UA Plumbers & Pipefitters locals",
      featSMART: "54 SMART Sheet Metal Workers locals",
      featPin: "Nearest local found instantly by distance",
      allTrades: "All Trades",
      footerLeft: "© 2026 Union Pathways · Union Construction Locator",
      footerRight: "More trades added regularly",
    },
    es: {
      tagline: "Encuentra Tu Local Sindical",
      heroTitle1: "Todo sobre",
      heroAccent: "Oficios Sindicales.",
      heroTitle2: "Un Solo Lugar.",
      heroSub: "Encuentra locales sindicales, explora rutas de carrera, comprende tus beneficios y aprende la historia del movimiento laboral — todo en una sola plataforma.",
      searchLabel: "Ingresa tu código postal o Ciudad, Estado",
      searchBtn: "Encontrar Local",
      geoBtn: "Usar Mi Ubicación Actual",
      locating: "Detectando ubicación…",
      nearYou: "Locales Cercanos",
      nearest: "Más Cercano",
      milesAway: "millas de distancia",
      visitWebsite: "Visitar Sitio Web",
      navQuiz: "¿Qué Oficio?",
      navCareers: "Trayectoria",
      navContact: "Contacto",
      navChecklist: "Únete al Sindicato",
      navVets: "Veteranos",
      navHome: "Encontrar Local",
      errorMsg: "No pudimos encontrar esa ubicación. Intenta con un código postal o \"Ciudad, Estado\".",
      ibewLabel: "⚡ IBEW Interior —",
      ibewLinLabel: "⚡ IBEW Liniero —",
      uaLabel: "🔧 UA Plomeros y Tuberos —",
      smartLabel: "🌬️ SMART Trabajadores de Chapa —",
      bacLabel: "🧱 BAC Albañiles —",
      ubcLabel: "🪚 UBC Carpinteros —",
      liunaLabel: "⚒️ LIUNA Obreros —",
      iwLabel: "🏗️ Trabajadores del Hierro —",
      iuecLabel: "🛗 Constructores de Elevadores —",
      hfiawLabel: "🔥 Aisladores —",
      sfLabel: "💧 Instaladores de Rociadores —",
      featIBEW: "266 locales de IBEW en los 50 estados",
      featUA: "210 locales de UA Plomeros y Tuberos",
      featSMART: "54 locales de SMART Chapistas",
      featPin: "El local más cercano encontrado al instante",
      allTrades: "Todos los Oficios",
      footerLeft: "© 2026 Union Pathways · Localizador Sindical",
      footerRight: "Más oficios agregados regularmente",
    },
    pl: {
      tagline: "Znajdź Swój Lokalny Związek",
      heroTitle1: "Wszystko o",
      heroAccent: "Zawodach Związkowych.",
      heroTitle2: "W Jednym Miejscu.",
      heroSub: "Znajdź lokale związkowe, odkryj ścieżki kariery, poznaj swoje świadczenia i historię ruchu pracowniczego — wszystko w jednej platformie.",
      searchLabel: "Wpisz kod pocztowy lub Miasto, Stan",
      searchBtn: "Znajdź Lokalny",
      geoBtn: "Użyj Mojej Lokalizacji",
      locating: "Wykrywanie lokalizacji…",
      nearYou: "Lokalne Związki w Pobliżu",
      nearest: "Najbliższy",
      milesAway: "mil stąd",
      visitWebsite: "Odwiedź Stronę",
      navQuiz: "Który Zawód?",
      navCareers: "Ścieżka Kariery",
      navContact: "Kontakt",
      navChecklist: "Dołącz do Związku",
      navVets: "Weterani",
      navHome: "Znajdź Lokalny",
      errorMsg: "Nie mogliśmy znaleźć tej lokalizacji. Spróbuj kodu pocztowego lub Miasto, Stan.",
      ibewLabel: "⚡ IBEW Elektryczni —",
      ibewLinLabel: "⚡ IBEW Lineman —",
      uaLabel: "🔧 UA Hydraulicy i Monterzy —",
      smartLabel: "🌬️ SMART Blacharze —",
      bacLabel: "🧱 BAC Murarze —",
      ubcLabel: "🪚 UBC Cieśle —",
      liunaLabel: "⚒️ LIUNA Robotnicy —",
      iwLabel: "🏗️ Ironworkers —",
      iuecLabel: "🛗 Elevator Constructors —",
      hfiawLabel: "🔥 Insulators —",
      sfLabel: "💧 Sprinkler Fitters —",
      featIBEW: "266 oddziałów IBEW we wszystkich 50 stanach",
      featUA: "210 oddziałów UA Hydraulicy i Monterzy",
      featSMART: "54 oddziały SMART Blacharze",
      featPin: "Najbliższy oddział znajdowany natychmiast",
      allTrades: "Wszystkie Zawody",
      footerLeft: "© 2026 Union Pathways · Lokalizator Związków",
      footerRight: "Nowe zawody dodawane regularnie",
    }
  };
  const t = T[lang];

  // ── QUIZ DATA ───────────────────────────────────────────────────────────────
  const QUIZ = {
    en: [
      {
        q: "What type of work appeals to you most?",
        options: [
          "Electrical systems — wiring, power, controls, and technology",
          "Power lines and utility infrastructure — working outdoors on the grid",
          "Pipes, plumbing, gas lines, and heating/cooling systems",
          "Sheet metal, ductwork, and HVAC systems",
          "Structural steel — building the skeleton of bridges and skyscrapers",
          "Brick, stone, tile, and masonry construction",
          "Wood framing, finish carpentry, and millwork",
          "Painting, coatings, and surface finishing",
          "Insulation and protecting industrial equipment",
          "Operating heavy equipment — cranes, bulldozers, excavators",
          "General construction labor — site prep, demolition, concrete",
          "Fire protection and sprinkler systems",
          "Elevators, escalators, and vertical transportation",
          "Boilers, pressure vessels, and industrial steam systems",
          "Hauling materials and driving heavy trucks on job sites",
        ],
        scores: [
          { IBEW_I: 3 },
          { IBEW_L: 3 },
          { UA: 3 },
          { SMART: 3 },
          { IW: 3 },
          { BAC: 3 },
          { UBC: 3 },
          { IUPAT: 3 },
          { HFIAW: 3 },
          { IUOE: 3 },
          { LIUNA: 3 },
          { SF: 3 },
          { IUEC: 3 },
          { IABSORIW: 3 },
          { IBT: 3 },
        ]
      },
      {
        q: "Which work environment sounds most exciting to you?",
        options: [
          "Inside commercial buildings — offices, hospitals, data centers",
          "Outdoors on power lines, substations, and utility infrastructure",
          "On large industrial sites — refineries, power plants, factories",
          "High in the air — on bridges, high-rises, or transmission towers",
          "Underground — tunnels, excavations, and below-grade work",
          "On residential job sites — homes and apartment buildings",
          "Moving between many types of job sites — variety every day",
        ],
        scores: [
          { IBEW_I: 2, SMART: 1, UA: 1, HFIAW: 1, IUPAT: 1, UBC: 1 },
          { IBEW_L: 2, IW: 1 },
          { HFIAW: 2, UA: 2, IABSORIW: 2, LIUNA: 1, IUOE: 1 },
          { IW: 2, IBEW_L: 2, IUEC: 1 },
          { LIUNA: 2, UA: 1, IBT: 1 },
          { UBC: 2, BAC: 1, IUPAT: 1, UA: 1 },
          { LIUNA: 1, IBT: 1, IUOE: 1, UBC: 1, IUPAT: 1 },
        ]
      },
      {
        q: "How do you feel about working at significant heights?",
        options: [
          "I love it — the higher the better",
          "I'm comfortable at heights when needed",
          "Somewhat comfortable — I can handle it",
          "I prefer to stay close to the ground",
        ],
        scores: [
          { IBEW_L: 2, IW: 2, IUEC: 1 },
          { IBEW_I: 1, SMART: 1, UBC: 1, IUEC: 1 },
          { UA: 1, BAC: 1, HFIAW: 1, IUPAT: 1 },
          { LIUNA: 1, BAC: 1, OPCMIA: 1, UA: 1, IABSORIW: 1 },
        ]
      },
      {
        q: "Which best describes your working style?",
        options: [
          "Precision technical work — reading plans, problem solving",
          "Heavy physical labor — building, lifting, pouring",
          "Operating machinery and equipment",
          "Artistic and detail-oriented finishing work",
          "Safety-critical work with specialized systems",
        ],
        scores: [
          { IBEW_I: 2, UA: 2, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IW: 2, LIUNA: 2, BAC: 1, OPCMIA: 1, UBC: 1 },
          { IUOE: 2, IBT: 2, IW: 1 },
          { IUPAT: 2, BAC: 1, UBC: 1 },
          { SF: 2, IABSORIW: 2, HFIAW: 1, UA: 1 },
        ]
      },
      {
        q: "What kind of projects do you want to work on?",
        options: [
          "Massive infrastructure — dams, highways, bridges, stadiums",
          "Large commercial construction — hospitals, airports, office towers",
          "Industrial — power plants, refineries, chemical facilities",
          "Residential — homes, apartments, neighborhoods",
          "Specialty systems — fire protection, elevators, escalators",
        ],
        scores: [
          { IW: 2, LIUNA: 2, IUOE: 2, IBT: 1 },
          { IBEW_I: 2, UA: 1, SMART: 1, BAC: 1, HFIAW: 1 },
          { HFIAW: 2, IABSORIW: 2, UA: 2, LIUNA: 1 },
          { UBC: 2, IUPAT: 2, BAC: 1, UA: 1 },
          { SF: 2, IUEC: 2, IBEW_I: 1 },
        ]
      },
      {
        q: "What matters most to you in a career?",
        options: [
          "Top pay and overtime potential",
          "Learning advanced technical skills and becoming a specialist",
          "Physical outdoor work and variety every day",
          "Being part of a tight-knit skilled crew",
          "A clear path to supervision, management, or owning a business",
          "Job stability, strong benefits, and a solid pension",
        ],
        scores: [
          { IBEW_I: 1, IBEW_L: 1, IW: 1, IUEC: 1 },
          { IBEW_I: 1, UA: 1, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IBEW_L: 1, IW: 1, IUOE: 1, LIUNA: 1 },
          { IW: 1, BAC: 1, UBC: 1, HFIAW: 1, IABSORIW: 1 },
          { UBC: 1, UA: 1, IBEW_I: 1 },
          { UA: 1, SMART: 1, BAC: 1, LIUNA: 1 },
        ]
      },
    ],
    es: [
      {
        q: "¿Qué tipo de trabajo te atrae más?",
        options: [
          "Sistemas eléctricos — cableado, energía, controles y tecnología",
          "Líneas eléctricas e infraestructura de servicios — trabajo al aire libre",
          "Tuberías, plomería, gas y sistemas de calefacción/refrigeración",
          "Chapa metálica, conductos y sistemas HVAC",
          "Acero estructural — construyendo puentes y rascacielos",
          "Ladrillo, piedra, azulejo y mampostería",
          "Marcos de madera, carpintería y ebanistería",
          "Pintura, recubrimientos y acabados superficiales",
          "Aislamiento y protección de equipos industriales",
          "Operar maquinaria pesada — grúas, bulldozers, excavadoras",
          "Trabajo general de construcción — preparación, demolición, concreto",
          "Protección contra incendios y sistemas de rociadores",
          "Ascensores, escaleras mecánicas y transporte vertical",
          "Calderas, recipientes a presión y sistemas de vapor industrial",
          "Transportar materiales y conducir camiones pesados en obras",
        ],
        scores: [
          { IBEW_I: 3 }, { IBEW_L: 3 }, { UA: 3 }, { SMART: 3 }, { IW: 3 },
          { BAC: 3 }, { UBC: 3 }, { IUPAT: 3 }, { HFIAW: 3 }, { IUOE: 3 },
          { LIUNA: 3 }, { SF: 3 }, { IUEC: 3 }, { IABSORIW: 3 }, { IBT: 3 },
        ]
      },
      {
        q: "¿Qué ambiente de trabajo te parece más emocionante?",
        options: [
          "Dentro de edificios comerciales — oficinas, hospitales, centros de datos",
          "Al aire libre en líneas eléctricas y subestaciones",
          "En grandes sitios industriales — refinerías, plantas de energía",
          "En las alturas — puentes, rascacielos o torres de transmisión",
          "Bajo tierra — túneles, excavaciones y trabajo subterráneo",
          "En obras residenciales — casas y edificios de apartamentos",
          "Moviéndome entre muchos tipos de obras — variedad todos los días",
        ],
        scores: [
          { IBEW_I: 2, SMART: 1, UA: 1, HFIAW: 1, IUPAT: 1, UBC: 1 },
          { IBEW_L: 2, IW: 1 },
          { HFIAW: 2, UA: 2, IABSORIW: 2, LIUNA: 1, IUOE: 1 },
          { IW: 2, IBEW_L: 2, IUEC: 1 },
          { LIUNA: 2, UA: 1, IBT: 1 },
          { UBC: 2, BAC: 1, IUPAT: 1, UA: 1 },
          { LIUNA: 1, IBT: 1, IUOE: 1, UBC: 1, IUPAT: 1 },
        ]
      },
      {
        q: "¿Cómo te sientes trabajando a gran altura?",
        options: [
          "Me encanta — cuanto más alto, mejor",
          "Cómodo cuando es necesario",
          "Algo cómodo — puedo manejarlo",
          "Prefiero quedarme cerca del suelo",
        ],
        scores: [
          { IBEW_L: 2, IW: 2, IUEC: 1 },
          { IBEW_I: 1, SMART: 1, UBC: 1, IUEC: 1 },
          { UA: 1, BAC: 1, HFIAW: 1, IUPAT: 1 },
          { LIUNA: 1, BAC: 1, OPCMIA: 1, UA: 1, IABSORIW: 1 },
        ]
      },
      {
        q: "¿Cuál describe mejor tu estilo de trabajo?",
        options: [
          "Trabajo técnico de precisión — leer planos, resolver problemas",
          "Trabajo físico intenso — construir, levantar, verter concreto",
          "Operar maquinaria y equipos",
          "Trabajo artístico y de acabado detallado",
          "Trabajo crítico de seguridad con sistemas especializados",
        ],
        scores: [
          { IBEW_I: 2, UA: 2, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IW: 2, LIUNA: 2, BAC: 1, OPCMIA: 1, UBC: 1 },
          { IUOE: 2, IBT: 2, IW: 1 },
          { IUPAT: 2, BAC: 1, UBC: 1 },
          { SF: 2, IABSORIW: 2, HFIAW: 1, UA: 1 },
        ]
      },
      {
        q: "¿En qué tipo de proyectos quieres trabajar?",
        options: [
          "Infraestructura masiva — presas, carreteras, puentes, estadios",
          "Construcción comercial grande — hospitales, aeropuertos, torres",
          "Industrial — plantas de energía, refinerías, instalaciones químicas",
          "Residencial — casas, apartamentos, vecindarios",
          "Sistemas especiales — protección contra incendios, ascensores",
        ],
        scores: [
          { IW: 2, LIUNA: 2, IUOE: 2, IBT: 1 },
          { IBEW_I: 2, UA: 1, SMART: 1, BAC: 1, HFIAW: 1 },
          { HFIAW: 2, IABSORIW: 2, UA: 2, LIUNA: 1 },
          { UBC: 2, IUPAT: 2, BAC: 1, UA: 1 },
          { SF: 2, IUEC: 2, IBEW_I: 1 },
        ]
      },
      {
        q: "¿Qué es lo más importante para ti en una carrera?",
        options: [
          "Máximo salario y potencial de horas extras",
          "Aprender habilidades técnicas avanzadas y especializarme",
          "Trabajo físico al aire libre y variedad todos los días",
          "Ser parte de un equipo unido y especializado",
          "Un camino claro hacia la supervisión o tener mi propio negocio",
          "Estabilidad, buenos beneficios y pensión sólida",
        ],
        scores: [
          { IBEW_I: 1, IBEW_L: 1, IW: 1, IUEC: 1 },
          { IBEW_I: 1, UA: 1, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IBEW_L: 1, IW: 1, IUOE: 1, LIUNA: 1 },
          { IW: 1, BAC: 1, UBC: 1, HFIAW: 1, IABSORIW: 1 },
          { UBC: 1, UA: 1, IBEW_I: 1 },
          { UA: 1, SMART: 1, BAC: 1, LIUNA: 1 },
        ]
      },
    ],
    pl: [
      {
        q: "Jaki rodzaj pracy najbardziej Cię przyciąga?",
        options: [
          "Systemy elektryczne — okablowanie, zasilanie, sterowanie i technologia",
          "Linie energetyczne i infrastruktura sieci — praca na zewnątrz",
          "Rury, instalacje wod-kan, gaz i systemy grzewcze/chłodnicze",
          "Blacha, kanały wentylacyjne i systemy HVAC",
          "Stal konstrukcyjna — budowanie mostów i wieżowców",
          "Cegła, kamień, glazura i murarstwo",
          "Szkielet drewniany, stolarka i wykończenie",
          "Malowanie, powłoki i wykończenie powierzchni",
          "Izolacja i ochrona urządzeń przemysłowych",
          "Obsługa ciężkiego sprzętu — dźwigi, buldożery, koparki",
          "Ogólne roboty budowlane — przygotowanie terenu, wyburzenia, beton",
          "Ochrona przeciwpożarowa i systemy tryskaczowe",
          "Windy, schody ruchome i transport pionowy",
          "Kotły, zbiorniki ciśnieniowe i przemysłowe systemy parowe",
          "Transport materiałów i prowadzenie ciężkich pojazdów na budowie",
        ],
        scores: [
          { IBEW_I: 3 }, { IBEW_L: 3 }, { UA: 3 }, { SMART: 3 }, { IW: 3 },
          { BAC: 3 }, { UBC: 3 }, { IUPAT: 3 }, { HFIAW: 3 }, { IUOE: 3 },
          { LIUNA: 3 }, { SF: 3 }, { IUEC: 3 }, { IABSORIW: 3 }, { IBT: 3 },
        ]
      },
      {
        q: "Które środowisko pracy brzmi dla Ciebie najbardziej ekscytująco?",
        options: [
          "Wewnątrz budynków komercyjnych — biura, szpitale, centra danych",
          "Na zewnątrz przy liniach energetycznych i podstacjach",
          "Na dużych obiektach przemysłowych — rafinerie, elektrownie",
          "Na wysokości — mosty, wieżowce lub wieże transmisyjne",
          "Pod ziemią — tunele, wykopy i roboty podziemne",
          "Na budowach mieszkaniowych — domy i budynki wielorodzinne",
          "Przemieszczam się między różnymi placami budowy — różnorodność",
        ],
        scores: [
          { IBEW_I: 2, SMART: 1, UA: 1, HFIAW: 1, IUPAT: 1, UBC: 1 },
          { IBEW_L: 2, IW: 1 },
          { HFIAW: 2, UA: 2, IABSORIW: 2, LIUNA: 1, IUOE: 1 },
          { IW: 2, IBEW_L: 2, IUEC: 1 },
          { LIUNA: 2, UA: 1, IBT: 1 },
          { UBC: 2, BAC: 1, IUPAT: 1, UA: 1 },
          { LIUNA: 1, IBT: 1, IUOE: 1, UBC: 1, IUPAT: 1 },
        ]
      },
      {
        q: "Jak czujesz się pracując na dużych wysokościach?",
        options: [
          "Uwielbiam — im wyżej, tym lepiej",
          "Komfortowo, gdy jest to konieczne",
          "Dość komfortowo — dam radę",
          "Wolę pozostać blisko ziemi",
        ],
        scores: [
          { IBEW_L: 2, IW: 2, IUEC: 1 },
          { IBEW_I: 1, SMART: 1, UBC: 1, IUEC: 1 },
          { UA: 1, BAC: 1, HFIAW: 1, IUPAT: 1 },
          { LIUNA: 1, BAC: 1, OPCMIA: 1, UA: 1, IABSORIW: 1 },
        ]
      },
      {
        q: "Co najlepiej opisuje Twój styl pracy?",
        options: [
          "Precyzyjna praca techniczna — czytanie planów, rozwiązywanie problemów",
          "Ciężka praca fizyczna — budowanie, dźwiganie, wylewanie betonu",
          "Obsługa maszyn i sprzętu",
          "Artystyczna i szczegółowa praca wykończeniowa",
          "Praca o krytycznym znaczeniu dla bezpieczeństwa ze specjalistycznymi systemami",
        ],
        scores: [
          { IBEW_I: 2, UA: 2, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IW: 2, LIUNA: 2, BAC: 1, OPCMIA: 1, UBC: 1 },
          { IUOE: 2, IBT: 2, IW: 1 },
          { IUPAT: 2, BAC: 1, UBC: 1 },
          { SF: 2, IABSORIW: 2, HFIAW: 1, UA: 1 },
        ]
      },
      {
        q: "Przy jakich projektach chcesz pracować?",
        options: [
          "Ogromna infrastruktura — tamy, autostrady, mosty, stadiony",
          "Duże budownictwo komercyjne — szpitale, lotniska, wieżowce",
          "Przemysłowe — elektrownie, rafinerie, zakłady chemiczne",
          "Mieszkaniowe — domy, apartamenty, osiedla",
          "Systemy specjalistyczne — ochrona pożarowa, windy",
        ],
        scores: [
          { IW: 2, LIUNA: 2, IUOE: 2, IBT: 1 },
          { IBEW_I: 2, UA: 1, SMART: 1, BAC: 1, HFIAW: 1 },
          { HFIAW: 2, IABSORIW: 2, UA: 2, LIUNA: 1 },
          { UBC: 2, IUPAT: 2, BAC: 1, UA: 1 },
          { SF: 2, IUEC: 2, IBEW_I: 1 },
        ]
      },
      {
        q: "Co jest dla Ciebie najważniejsze w karierze?",
        options: [
          "Najwyższe wynagrodzenie i możliwość nadgodzin",
          "Nauka zaawansowanych umiejętności technicznych i specjalizacja",
          "Fizyczna praca na zewnątrz i codzienne zróżnicowanie",
          "Bycie częścią zgranego, wykwalifikowanego zespołu",
          "Wyraźna ścieżka do nadzoru lub własnego biznesu",
          "Stabilność, dobre świadczenia i solidna emerytura",
        ],
        scores: [
          { IBEW_I: 1, IBEW_L: 1, IW: 1, IUEC: 1 },
          { IBEW_I: 1, UA: 1, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IBEW_L: 1, IW: 1, IUOE: 1, LIUNA: 1 },
          { IW: 1, BAC: 1, UBC: 1, HFIAW: 1, IABSORIW: 1 },
          { UBC: 1, UA: 1, IBEW_I: 1 },
          { UA: 1, SMART: 1, BAC: 1, LIUNA: 1 },
        ]
      },
    ]
  };

  let TRADE_RESULTS = {
    en: {
      IBEW_I: {
        name: "IBEW — Inside Wiremen",
        color: "#F5C518",
        icon: "⚡",
        why: "You're drawn to technology, precision work, and systems that power the modern world. Inside wiremen wire commercial and industrial buildings — from hospitals to data centers to stadiums.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$20-28/hr", "Journeyman: Full union wages, typically $35–75/hr depending on location", "Foreman/General Foreman: Lead crews on major projects", "Master Electrician / Business Owner: Run your own shop"],
        apprenticeship: "5-year registered apprenticeship through NECA-IBEW JATC. No college debt.",
        website: "ibew.org"
      },
      IBEW_L: {
        name: "IBEW — Outside Linemen",
        color: "#FFD700",
        icon: "🔌",
        why: "You thrive outdoors, love working at heights, and want to keep the power grid running. Linemen build and maintain the transmission and distribution lines that power entire regions.",
        path: ["Year 1–4: Apprentice Lineman — earn while you learn at ~$22-30/hr", "Journeyman Lineman: Full wages, $40–80/hr in most markets", "Foreman: Lead line crews on major transmission projects", "General Foreman / Superintendent: Oversee large infrastructure projects"],
        apprenticeship: "4-year registered apprenticeship through IBEW/NECA JATC. Extensive hands-on training.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Plumbers & Pipefitters",
        color: "#3b9eff",
        icon: "🔧",
        why: "You're interested in the systems that keep buildings running — water, gas, steam, and heating/cooling. Pipe trades are essential on every major construction project.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Plumber/Pipefitter: Full union wages, $30–70/hr", "Foreman: Lead pipe crews on commercial and industrial projects", "Master Plumber / Business Owner: License and run your own operation"],
        apprenticeship: "5-year registered apprenticeship through UA JATC. Earn from day one.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Sheet Metal Workers",
        color: "#e05a2b",
        icon: "🌬️",
        why: "You're interested in HVAC, ductwork, and the systems that control airflow in buildings. Sheet metal workers are skilled fabricators who work on commercial and industrial HVAC systems.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$17-24/hr", "Journeyman Sheet Metal Worker: Full wages, $30–65/hr", "Foreman: Manage duct installation and HVAC crews", "Estimator / Project Manager: Move into the business side"],
        apprenticeship: "5-year apprenticeship through SMART JATC training centers nationwide.",
        website: "smart-union.org"
      },
      IW: {
        name: "Ironworkers — Structural & Reinforcing",
        color: "#ef4444",
        icon: "🏗️",
        why: "You want to build the bones of America — bridges, skyscrapers, stadiums, and industrial plants. Ironworkers work at height connecting structural steel and placing rebar for concrete.",
        path: ["Year 1–3: Apprentice — earn while you learn at ~$20-28/hr", "Journeyman Ironworker: Full wages, $35–70/hr depending on market", "Foreman: Lead steel erection or reinforcing crews", "General Foreman / Superintendent: Manage major structural projects"],
        apprenticeship: "3-year registered apprenticeship through IMPACT (Ironworkers JATC). Paid from day one.",
        website: "ironworkers.org"
      },
      BAC: {
        name: "BAC — Bricklayers & Allied Craftworkers",
        color: "#f97316",
        icon: "🧱",
        why: "You're drawn to hands-on work building lasting structures with brick, stone, tile, and masonry. Union bricklayers earn excellent wages with full benefits.",
        path: ["Year 1–3: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Mason: Full union wages, $30–65/hr depending on location", "Foreman: Lead masonry crews on commercial and industrial projects", "Superintendent / Contractor: Run your own masonry operation"],
        apprenticeship: "3-year registered apprenticeship through BAC JATC. Paid training from day one.",
        website: "bacweb.org"
      },
      UBC: {
        name: "UBC — Carpenters",
        color: "#a78bfa",
        icon: "🪚",
        why: "You enjoy working with wood, building structures, and seeing the physical results of your work. Carpenters work on framing, finishing, millwork, and everything in between.",
        path: ["Year 1–4: Apprentice — learn framing, finishing, formwork", "Journeyman Carpenter: Full wages on commercial and residential projects", "Foreman: Lead carpentry crews", "Superintendent / Contractor: Run your own projects"],
        apprenticeship: "4-year apprenticeship through UBC regional councils.",
        website: "carpenters.org"
      },
      HFIAW: {
        name: "HFIAW — Insulators",
        color: "#38bdf8",
        icon: "🧊",
        why: "You're drawn to the technical side of industrial systems — keeping pipes, equipment, and facilities insulated for efficiency and safety. Insulators work on power plants, refineries, and commercial buildings.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Insulator: Full union wages, $30–65/hr depending on location", "Foreman: Lead insulation crews on industrial and commercial projects", "Superintendent / Contractor: Manage large-scale insulation operations"],
        apprenticeship: "4-year registered apprenticeship through HFIAW JATC. Paid training from day one.",
        website: "insulators.org"
      },
      LIUNA: {
        name: "LIUNA — Laborers",
        color: "#fb923c",
        icon: "⛏️",
        why: "You want to be on the ground floor of every major project — doing the essential site work that makes everything else possible. Laborers work on tunnels, highways, foundations, demolition, and more.",
        path: ["Year 1–3: Apprentice — earn while you learn, starting ~$18-25/hr", "Journeyman Laborer: Full wages, $28–55/hr depending on location and specialty", "Foreman: Lead labor crews on large projects", "Superintendent: Oversee multiple crews on major infrastructure jobs"],
        apprenticeship: "Registered apprenticeship through LIUNA Training & Education Fund. Diverse specializations available.",
        website: "liuna.org"
      },
      IUOE: {
        name: "IUOE — Operating Engineers",
        color: "#84cc16",
        icon: "🚜",
        why: "You want to operate the machines that move mountains — cranes, excavators, bulldozers, and more. Operating Engineers are among the highest-paid craft workers on any job site.",
        path: ["Year 1–4: Apprentice — earn while you learn operating various equipment", "Journeyman Operating Engineer: Full wages, $35–75/hr depending on equipment and market", "Master Mechanic: Specialize in crane operation or heavy equipment repair", "Foreman / Superintendent: Lead equipment crews on major projects"],
        apprenticeship: "4-year registered apprenticeship through IUOE Local JATC programs. Extensive equipment training.",
        website: "iuoe.org"
      },
      IUPAT: {
        name: "IUPAT — Painters & Allied Trades",
        color: "#c084fc",
        icon: "🎨",
        why: "You have an eye for detail and take pride in the finished product. Painters work on everything from commercial buildings to bridges, applying coatings that protect and beautify structures.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$17-23/hr", "Journeyman Painter: Full wages, $28–55/hr depending on location", "Foreman: Lead painting and coating crews", "Superintendent / Contractor: Run your own painting operation"],
        apprenticeship: "4-year registered apprenticeship through IUPAT District Councils.",
        website: "iupat.org"
      },
      SF: {
        name: "Sprinkler Fitters — UA Local 669",
        color: "#22d3ee",
        icon: "🚿",
        why: "You want to work on the life-safety systems that protect buildings and the people inside them. Sprinkler fitters design and install fire suppression systems in every type of building.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$18-25/hr", "Journeyman Sprinkler Fitter: Full wages, $35–65/hr depending on market", "Foreman: Oversee sprinkler installation on major projects", "Inspector / Estimator: Move into technical or business roles"],
        apprenticeship: "5-year registered apprenticeship through UA Local 669 JATC.",
        website: "sprinklerfitters669.org"
      },
      IUEC: {
        name: "IUEC — Elevator Constructors",
        color: "#facc15",
        icon: "🛗",
        why: "You want to work on one of the most specialized and highest-paid trades in construction. Elevator constructors install, maintain, and modernize elevators, escalators, and other vertical transportation systems.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$25-35/hr", "Journeyman Elevator Constructor: Full wages, $50–90/hr in major markets", "Mechanic in Charge: Lead installation crews", "Modernization Specialist: Work on retrofitting existing systems"],
        apprenticeship: "4-year registered apprenticeship through IUEC JATC. One of the highest-paid apprenticeships in the trades.",
        website: "iuec.org"
      },
      IABSORIW: {
        name: "Boilermakers — Brotherhood of Boilermakers",
        color: "#f59e0b",
        icon: "🔥",
        why: "You want to work on the industrial systems that power America — boilers, pressure vessels, tanks, and heat exchangers at power plants, refineries, and chemical plants.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$20-28/hr", "Journeyman Boilermaker: Full wages, $35–70/hr depending on location", "Foreman: Lead boilermaker crews on industrial projects", "General Foreman / Superintendent: Manage major industrial turnarounds"],
        apprenticeship: "4-year registered apprenticeship through Boilermakers National Apprenticeship Program.",
        website: "boilermakers.org"
      },
      IBT: {
        name: "Teamsters — Construction Division",
        color: "#94a3b8",
        icon: "🚛",
        why: "You want to keep construction sites moving — hauling materials, operating trucks, and ensuring the logistics that make every project possible.",
        path: ["Entry: CDL training and job site experience", "Journeyman Teamster: Full wages, $28–55/hr depending on location and equipment", "Foreman: Lead trucking and material handling operations", "Dispatcher / Owner-Operator: Run your own operation"],
        apprenticeship: "Teamsters Construction Division training programs. CDL license required for most positions.",
        website: "teamster.org"
      },
      OPCMIA: {
        name: "OPCMIA — Plasterers & Cement Masons",
        color: "#a78bfa",
        icon: "🏛️",
        why: "You want to work with concrete and plaster — finishing floors, walls, and decorative elements that require skill and an eye for detail.",
        path: ["Year 1–3: Apprentice — earn while you learn, starting ~$18-24/hr", "Journeyman Cement Mason/Plasterer: Full wages, $28–58/hr depending on location", "Foreman: Lead finishing crews on commercial projects", "Superintendent / Contractor: Run your own masonry/plastering operation"],
        apprenticeship: "3-year registered apprenticeship through OPCMIA JATC.",
        website: "opcmia.org"
      },
    },
    es: {
      IBEW_I: {
        name: "IBEW — Electricistas de Interior",
        color: "#F5C518", icon: "⚡",
        why: "Te atrae la tecnología, el trabajo de precisión y los sistemas que alimentan el mundo moderno. Los electricistas de interior cablan edificios comerciales e industriales.",
        path: ["Años 1-5: Aprendiz — comenzando ~$20-28/hr", "Oficial: Salario completo, $35-75/hr según ubicación", "Capataz/Capataz General: Liderar cuadrillas en proyectos importantes", "Electricista Maestro / Propietario: Tener tu propio negocio"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de NECA-IBEW JATC. Sin deuda universitaria.",
        website: "ibew.org"
      },
      IBEW_L: {
        name: "IBEW — Lineros Exteriores",
        color: "#FFD700", icon: "🔌",
        why: "Disfrutas trabajar al aire libre, en las alturas, manteniendo la red eléctrica en funcionamiento. Los lineros construyen y mantienen líneas de transmisión y distribución.",
        path: ["Años 1-4: Aprendiz Linero — comenzando ~$22-30/hr", "Linero Oficial: Salario completo, $40-80/hr", "Capataz: Liderar cuadrillas en proyectos de transmisión", "Capataz General/Superintendent: Supervisar grandes proyectos de infraestructura"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de IBEW/NECA JATC.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Plomeros y Pipefitters",
        color: "#3b9eff", icon: "🔧",
        why: "Te interesan los sistemas que mantienen los edificios en funcionamiento — agua, gas, vapor y climatización. Los oficios de tuberías son esenciales en cada gran proyecto de construcción.",
        path: ["Años 1-5: Aprendiz — comenzando ~$18-26/hr", "Oficial Plomero/Pipefitter: Salario completo, $30-70/hr", "Capataz: Liderar cuadrillas en proyectos comerciales e industriales", "Plomero Maestro/Propietario: Tener tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de UA JATC.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Trabajadores de Chapa Metálica",
        color: "#e05a2b", icon: "🌬️",
        why: "Te interesan el HVAC, los conductos y los sistemas que controlan el flujo de aire en los edificios.",
        path: ["Años 1-5: Aprendiz — comenzando ~$17-24/hr", "Oficial de Chapa Metálica: Salario completo, $30-65/hr", "Capataz: Gestionar instalaciones de conductos y cuadrillas HVAC", "Estimador/Director de Proyecto: Pasar al lado empresarial"],
        apprenticeship: "Aprendizaje de 5 años a través de los centros de capacitación SMART JATC.",
        website: "smart-union.org"
      },
      IW: {
        name: "Ironworkers — Estructurales y Refuerzo",
        color: "#ef4444", icon: "🏗️",
        why: "Quieres construir los huesos de América — puentes, rascacielos, estadios y plantas industriales. Los ironworkers trabajan conectando acero estructural y colocando armadura.",
        path: ["Años 1-3: Aprendiz — comenzando ~$20-28/hr", "Oficial Ironworker: Salario completo, $35-70/hr", "Capataz: Liderar cuadrillas de erección de acero", "Capataz General: Gestionar grandes proyectos estructurales"],
        apprenticeship: "Aprendizaje registrado de 3 años a través de IMPACT JATC.",
        website: "ironworkers.org"
      },
      BAC: {
        name: "BAC — Albañiles y Artesanos Aliados",
        color: "#f97316", icon: "🧱",
        why: "Te atrae el trabajo manual construyendo estructuras duraderas con ladrillo, piedra, azulejo y mampostería.",
        path: ["Años 1-3: Aprendiz — comenzando ~$18-26/hr", "Oficial Albañil: Salario completo, $30-65/hr", "Capataz: Liderar cuadrillas de mampostería", "Superintendent/Contratista: Manejar tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 3 años a través de BAC JATC.",
        website: "bacweb.org"
      },
      UBC: {
        name: "UBC — Carpinteros",
        color: "#a78bfa", icon: "🪚",
        why: "Disfrutas trabajar con madera, construir estructuras y ver los resultados físicos de tu trabajo.",
        path: ["Años 1-4: Aprendiz — aprender marcos, acabados, encofrados", "Carpintero Oficial: Salario completo en proyectos comerciales y residenciales", "Capataz: Liderar cuadrillas de carpintería", "Superintendent/Contratista: Manejar tus propios proyectos"],
        apprenticeship: "Aprendizaje de 4 años a través de los consejos regionales de UBC.",
        website: "carpenters.org"
      },
      HFIAW: {
        name: "HFIAW — Aisladores",
        color: "#38bdf8", icon: "🧊",
        why: "Te atrae el lado técnico de los sistemas industriales — mantener tuberías, equipos e instalaciones aisladas para mayor eficiencia y seguridad.",
        path: ["Años 1-4: Aprendiz — comenzando ~$18-26/hr", "Aislador Oficial: Salario sindical completo, $30-65/hr", "Capataz: Liderar cuadrillas de aislamiento en proyectos industriales", "Superintendent/Contratista: Gestionar operaciones a gran escala"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de HFIAW JATC.",
        website: "insulators.org"
      },
      LIUNA: {
        name: "LIUNA — Trabajadores de la Construcción",
        color: "#fb923c", icon: "⛏️",
        why: "Quieres estar en la primera línea de cada gran proyecto. Los laborers realizan el trabajo esencial de preparación de sitios que hace posible todo lo demás.",
        path: ["Años 1-3: Aprendiz — comenzando ~$18-25/hr", "Oficial Laborer: Salario completo, $28-55/hr", "Capataz: Liderar cuadrillas laborales en grandes proyectos", "Superintendent: Supervisar múltiples cuadrillas"],
        apprenticeship: "Aprendizaje registrado a través del Fondo de Capacitación y Educación de LIUNA.",
        website: "liuna.org"
      },
      IUOE: {
        name: "IUOE — Operadores de Equipos",
        color: "#84cc16", icon: "🚜",
        why: "Quieres operar las máquinas que mueven montañas — grúas, excavadoras, bulldozers y más.",
        path: ["Años 1-4: Aprendiz — operando varios equipos", "Oficial Operador: Salario completo, $35-75/hr", "Mecánico en Jefe: Especializarse en operación de grúas", "Capataz/Superintendent: Liderar cuadrillas de equipo"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de programas JATC locales de IUOE.",
        website: "iuoe.org"
      },
      IUPAT: {
        name: "IUPAT — Pintores y Oficios Aliados",
        color: "#c084fc", icon: "🎨",
        why: "Tienes ojo para los detalles y te enorgulleces del producto terminado. Los pintores trabajan aplicando recubrimientos que protegen y embellecen estructuras.",
        path: ["Años 1-4: Aprendiz — comenzando ~$17-23/hr", "Oficial Pintor: Salario completo, $28-55/hr", "Capataz: Liderar cuadrillas de pintura", "Superintendent/Contratista: Manejar tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de los Consejos de Distrito de IUPAT.",
        website: "iupat.org"
      },
      SF: {
        name: "Sprinkler Fitters — UA Local 669",
        color: "#22d3ee", icon: "🚿",
        why: "Quieres trabajar en los sistemas de seguridad que protegen edificios y personas. Los sprinkler fitters instalan sistemas de supresión de incendios.",
        path: ["Años 1-5: Aprendiz — comenzando ~$18-25/hr", "Oficial Sprinkler Fitter: Salario completo, $35-65/hr", "Capataz: Supervisar instalaciones en grandes proyectos", "Inspector/Estimador: Pasar a roles técnicos o empresariales"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de UA Local 669 JATC.",
        website: "sprinklerfitters669.org"
      },
      IUEC: {
        name: "IUEC — Constructores de Elevadores",
        color: "#facc15", icon: "🛗",
        why: "Quieres trabajar en uno de los oficios más especializados y mejor pagados de la construcción — elevadores, escaleras mecánicas y sistemas de transporte vertical.",
        path: ["Años 1-4: Aprendiz — comenzando ~$25-35/hr", "Oficial Constructor de Elevadores: Salario completo, $50-90/hr en grandes mercados", "Mecánico en Cargo: Liderar cuadrillas de instalación", "Especialista en Modernización: Trabajar en sistemas existentes"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de IUEC JATC.",
        website: "iuec.org"
      },
      IABSORIW: {
        name: "Boilermakers — Hermandad de Caldereros",
        color: "#f59e0b", icon: "🔥",
        why: "Quieres trabajar en los sistemas industriales que alimentan América — calderas, recipientes a presión y plantas de energía.",
        path: ["Años 1-4: Aprendiz — comenzando ~$20-28/hr", "Oficial Calderero: Salario completo, $35-70/hr", "Capataz: Liderar cuadrillas en proyectos industriales", "Capataz General: Gestionar grandes revisiones industriales"],
        apprenticeship: "Aprendizaje registrado de 4 años a través del Programa Nacional de Aprendizaje de Boilermakers.",
        website: "boilermakers.org"
      },
      IBT: {
        name: "Teamsters — División de Construcción",
        color: "#94a3b8", icon: "🚛",
        why: "Quieres mantener las obras en movimiento — transportando materiales y asegurando la logística que hace posible cada proyecto.",
        path: ["Entrada: Capacitación CDL y experiencia en obra", "Oficial Teamster: Salario completo, $28-55/hr", "Capataz: Liderar operaciones de camiones y manejo de materiales", "Dispatcher/Propietario: Tener tu propia operación"],
        apprenticeship: "Programas de capacitación de la División de Construcción de Teamsters.",
        website: "teamster.org"
      },
      OPCMIA: {
        name: "OPCMIA — Plasterers y Cement Masons",
        color: "#a78bfa", icon: "🏛️",
        why: "Quieres trabajar con concreto y yeso — terminando pisos, paredes y elementos decorativos que requieren habilidad y ojo para los detalles.",
        path: ["Años 1-3: Aprendiz — comenzando ~$18-24/hr", "Oficial Cement Mason/Plasterer: Salario completo, $28-58/hr", "Capataz: Liderar cuadrillas de acabado", "Superintendent/Contratista: Manejar tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 3 años a través de OPCMIA JATC.",
        website: "opcmia.org"
      },
    },
    pl: {
      IBEW_I: {
        name: "IBEW — Elektrycy Wewnętrzni",
        color: "#F5C518", icon: "⚡",
        why: "Pociąga Cię technologia, precyzyjna praca i systemy zasilające nowoczesny świat. Elektrycy wewnętrzni okablowują budynki komercyjne i przemysłowe.",
        path: ["Lata 1-5: Praktykant — od ~$20-28/hr", "Czeladnik: Pełne wynagrodzenie, $35-75/hr", "Brygadzista/Brygadzista Generalny: Kierowanie ekipami", "Mistrz Elektryczny/Właściciel: Własna firma"],
        apprenticeship: "5-letnia praktyka przez NECA-IBEW JATC. Bez długu studenckiego.",
        website: "ibew.org"
      },
      IBEW_L: {
        name: "IBEW — Monterzy Linii Elektrycznych",
        color: "#FFD700", icon: "🔌",
        why: "Lubisz pracę na zewnątrz, na wysokościach, utrzymując sieć energetyczną. Monterzy budują i utrzymują linie przesyłowe i dystrybucyjne.",
        path: ["Lata 1-4: Praktykant — od ~$22-30/hr", "Monter Czeladnik: Pełne wynagrodzenie, $40-80/hr", "Brygadzista: Kierowanie ekipami linowymi", "Brygadzista Generalny: Nadzór dużych projektów infrastrukturalnych"],
        apprenticeship: "4-letnia praktyka przez IBEW/NECA JATC.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Hydraulicy i Monterzy Rurociągów",
        color: "#3b9eff", icon: "🔧",
        why: "Interesują Cię systemy utrzymujące budynki w ruchu — woda, gaz, para i klimatyzacja.",
        path: ["Lata 1-5: Praktykant — od ~$18-26/hr", "Hydraulik/Monter Czeladnik: Pełne wynagrodzenie, $30-70/hr", "Brygadzista: Kierowanie ekipami", "Mistrz Hydraulik/Właściciel: Własna firma"],
        apprenticeship: "5-letnia praktyka przez UA JATC.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Blacharze i Pracownicy HVAC",
        color: "#e05a2b", icon: "🌬️",
        why: "Interesuje Cię HVAC, kanały wentylacyjne i systemy kontroli przepływu powietrza w budynkach.",
        path: ["Lata 1-5: Praktykant — od ~$17-24/hr", "Czeladnik Blacharza: Pełne wynagrodzenie, $30-65/hr", "Brygadzista: Zarządzanie instalacjami kanałów i ekipami HVAC", "Kosztorysant/Kierownik Projektu: Strona biznesowa"],
        apprenticeship: "5-letnia praktyka przez centra szkoleniowe SMART JATC.",
        website: "smart-union.org"
      },
      IW: {
        name: "Ironworkers — Konstrukcje Stalowe",
        color: "#ef4444", icon: "🏗️",
        why: "Chcesz budować szkielet Ameryki — mosty, wieżowce, stadiony i zakłady przemysłowe.",
        path: ["Lata 1-3: Praktykant — od ~$20-28/hr", "Monter Czeladnik: Pełne wynagrodzenie, $35-70/hr", "Brygadzista: Kierowanie ekipami stalowymi", "Brygadzista Generalny: Zarządzanie dużymi projektami"],
        apprenticeship: "3-letnia praktyka przez IMPACT JATC.",
        website: "ironworkers.org"
      },
      BAC: {
        name: "BAC — Murarze i Rzemieślnicy",
        color: "#f97316", icon: "🧱",
        why: "Pociąga Cię praca manualna przy budowie trwałych konstrukcji z cegły, kamienia, płytek i murów.",
        path: ["Lata 1-3: Praktykant — od ~$18-26/hr", "Murarz Czeladnik: Pełne wynagrodzenie, $30-65/hr", "Brygadzista: Kierowanie ekipami murarskimi", "Superintendent/Wykonawca: Własna firma"],
        apprenticeship: "3-letnia praktyka przez BAC JATC.",
        website: "bacweb.org"
      },
      UBC: {
        name: "UBC — Cieśle",
        color: "#a78bfa", icon: "🪚",
        why: "Lubisz pracować z drewnem, budować konstrukcje i widzieć fizyczne efekty swojej pracy.",
        path: ["Lata 1-4: Praktykant — szkieletowanie, wykończenie, szalunki", "Czeladnik Cieśla: Pełna stawka przy projektach komercyjnych i mieszkaniowych", "Brygadzista: Prowadzenie ekip ciesielskich", "Superintendent/Wykonawca: Własne projekty"],
        apprenticeship: "4-letnia praktyka przez regionalne rady UBC.",
        website: "carpenters.org"
      },
      HFIAW: {
        name: "HFIAW — Izolatorzy",
        color: "#38bdf8", icon: "🧊",
        why: "Pociąga Cię techniczny aspekt systemów przemysłowych — izolowanie rur, urządzeń i obiektów dla efektywności i bezpieczeństwa.",
        path: ["Lata 1-4: Praktykant — od ~$18-26/hr", "Izolator Czeladnik: Pełne wynagrodzenie związkowe, $30-65/hr", "Brygadzista: Kierowanie ekipami izolacyjnymi", "Superintendent/Wykonawca: Zarządzanie dużymi operacjami"],
        apprenticeship: "4-letnia praktyka przez HFIAW JATC.",
        website: "insulators.org"
      },
      LIUNA: {
        name: "LIUNA — Robotnicy Budowlani",
        color: "#fb923c", icon: "⛏️",
        why: "Chcesz być na pierwszej linii każdego dużego projektu — wykonując niezbędne prace przygotowawcze.",
        path: ["Lata 1-3: Praktykant — od ~$18-25/hr", "Robotnik Czeladnik: Pełne wynagrodzenie, $28-55/hr", "Brygadzista: Kierowanie ekipami roboczymi", "Superintendent: Nadzór nad wieloma ekipami"],
        apprenticeship: "Zarejestrowana praktyka przez Fundusz Szkoleniowy LIUNA.",
        website: "liuna.org"
      },
      IUOE: {
        name: "IUOE — Operatorzy Sprzętu",
        color: "#84cc16", icon: "🚜",
        why: "Chcesz obsługiwać maszyny poruszające górami — dźwigi, koparki, buldożery i inne.",
        path: ["Lata 1-4: Praktykant — obsługa różnych urządzeń", "Czeladnik Operator: Pełne wynagrodzenie, $35-75/hr", "Główny Mechanik: Specjalizacja w obsłudze dźwigów", "Brygadzista/Superintendent: Kierowanie ekipami sprzętowymi"],
        apprenticeship: "4-letnia zarejestrowana praktyka przez lokalne programy JATC IUOE.",
        website: "iuoe.org"
      },
      IUPAT: {
        name: "IUPAT — Malarze i Pokrewne Zawody",
        color: "#c084fc", icon: "🎨",
        why: "Masz oko do szczegółów i dbasz o jakość gotowego produktu. Malarze nakładają powłoki chroniące i upiększające konstrukcje.",
        path: ["Lata 1-4: Praktykant — od ~$17-23/hr", "Malarz Czeladnik: Pełne wynagrodzenie, $28-55/hr", "Brygadzista: Kierowanie ekipami malarskimi", "Superintendent/Wykonawca: Własna firma malarska"],
        apprenticeship: "4-letnia praktyka przez Okręgowe Rady IUPAT.",
        website: "iupat.org"
      },
      SF: {
        name: "Sprinkler Fitters — UA Local 669",
        color: "#22d3ee", icon: "🚿",
        why: "Chcesz pracować przy systemach bezpieczeństwa chroniących budynki i ludzi. Monterzy tryskaczów instalują systemy gaśnicze.",
        path: ["Lata 1-5: Praktykant — od ~$18-25/hr", "Monter Tryskaczów Czeladnik: Pełne wynagrodzenie, $35-65/hr", "Brygadzista: Nadzór instalacji", "Inspektor/Kosztorysant: Role techniczne lub biznesowe"],
        apprenticeship: "5-letnia praktyka przez UA Local 669 JATC.",
        website: "sprinklerfitters669.org"
      },
      IUEC: {
        name: "IUEC — Konstruktorzy Wind",
        color: "#facc15", icon: "🛗",
        why: "Chcesz pracować w jednym z najbardziej wyspecjalizowanych i najlepiej opłacanych zawodów budowlanych — windy, schody ruchome i systemy transportu pionowego.",
        path: ["Lata 1-4: Praktykant — od ~$25-35/hr", "Czeladnik Konstruktor Wind: Pełne wynagrodzenie, $50-90/hr", "Mechanik Odpowiedzialny: Kierowanie ekipami instalacyjnymi", "Specjalista Modernizacji: Praca z istniejącymi systemami"],
        apprenticeship: "4-letnia praktyka przez IUEC JATC.",
        website: "iuec.org"
      },
      IABSORIW: {
        name: "Boilermakers — Bracia Kotlarze",
        color: "#f59e0b", icon: "🔥",
        why: "Chcesz pracować przy systemach przemysłowych zasilających Amerykę — kotłach, zbiornikach ciśnieniowych i elektrowniach.",
        path: ["Lata 1-4: Praktykant — od ~$20-28/hr", "Kotlarz Czeladnik: Pełne wynagrodzenie, $35-70/hr", "Brygadzista: Kierowanie ekipami kotlarskimi", "Brygadzista Generalny: Zarządzanie dużymi przeglądami"],
        apprenticeship: "4-letnia praktyka przez Narodowy Program Szkoleniowy Boilermakers.",
        website: "boilermakers.org"
      },
      IBT: {
        name: "Teamsters — Dział Budowlany",
        color: "#94a3b8", icon: "🚛",
        why: "Chcesz utrzymywać place budowy w ruchu — transportując materiały i zapewniając logistykę każdego projektu.",
        path: ["Wejście: Szkolenie CDL i doświadczenie na budowie", "Czeladnik Teamster: Pełne wynagrodzenie, $28-55/hr", "Brygadzista: Kierowanie operacjami transportowymi", "Dyspozytor/Właściciel: Własna firma"],
        apprenticeship: "Programy szkoleniowe Działu Budowlanego Teamsters.",
        website: "teamster.org"
      },
      OPCMIA: {
        name: "OPCMIA — Tynkarze i Cementownicy",
        color: "#a78bfa", icon: "🏛️",
        why: "Chcesz pracować z betonem i tynkiem — wykańczając podłogi, ściany i elementy dekoracyjne.",
        path: ["Lata 1-3: Praktykant — od ~$18-24/hr", "Czeladnik Cementownik/Tynkarz: Pełne wynagrodzenie, $28-58/hr", "Brygadzista: Kierowanie ekipami wykończeniowymi", "Superintendent/Wykonawca: Własna firma"],
        apprenticeship: "3-letnia praktyka przez OPCMIA JATC.",
        website: "opcmia.org"
      },
    },
  };



  const CAREER_DATA = {
    en: {
      title: "Career Path in the Union Trades",
      sub: "Every trade offers a structured path from apprentice to master — earning real wages the entire way. No student debt. No unpaid internships.",
      stages: [
        { stage: "Apprentice", years: "Years 1–5", pay: "$18–35/hr", icon: "01", desc: "You're enrolled in a registered apprenticeship — working full-time on the job while attending trade school. Your wage increases every 6 months. You earn benefits from day one." },
        { stage: "Journeyman", years: "5+ Years", pay: "$35–75/hr", icon: "02", desc: "You've completed your apprenticeship and earned your journeyman card. You can work anywhere your union has jurisdiction. Full wages, full benefits, full pension contributions." },
        { stage: "Foreman", years: "8–15 Years", pay: "$45–90/hr", icon: "03", desc: "Experienced journeymen step into foreman roles — leading crews, reading plans, coordinating materials. Foreman pay includes a premium on top of journeyman scale." },
        { stage: "General Foreman / Super", years: "15+ Years", pay: "$75–120k+/yr", icon: "04", desc: "Managing multiple crews and subcontractors on major projects. Often salaried. Some move into project management, estimating, or inspection roles." },
        { stage: "Master / Business Owner", years: "Varies", pay: "Unlimited", icon: "05", desc: "With a master's license (where applicable) you can pull permits and run your own contracting company — while still enjoying union scale on public and prevailing wage work." },
      ],
      whyUnion: [
        { label: "Pension", icon: "$", desc: "Defined benefit pensions that pay you for life after retirement — rare in today's economy." },
        { label: "Health Insurance", icon: "+", desc: "Full family health coverage, often with no premium for the worker. Dental and vision included." },
        { label: "Apprenticeship", icon: "◆", desc: "Earn while you learn. No student loans. Training paid for by the industry." },
        { label: "Annuity / 401k", icon: "↑", desc: "Additional retirement savings on top of your pension, contributed by employers." },
        { label: "Safety", icon: "✓", desc: "Union job sites have strict safety standards. Union members have the right to refuse unsafe work." },
      ],
      stats: [
        { num: "$63/hr", label: "Average journeyman wage in major metro markets" },
        { num: "$0", label: "Cost of apprenticeship training to the worker" },
        { num: "5 Years", label: "Typical apprenticeship length — shorter than a college degree" },
        { num: "300%+", label: "More likely to have employer-provided health insurance" },
      ]
    },
    es: {
      title: "Trayectoria Profesional en los Oficios Sindicales",
      sub: "Cada oficio ofrece un camino estructurado de aprendiz a maestro — ganando salarios reales durante todo el proceso. Sin deuda estudiantil. Sin pasantías sin pago.",
      stages: [
        { stage: "Aprendiz", years: "Años 1–5", pay: "$18–35/hr", icon: "01", desc: "Estás inscrito en un aprendizaje registrado — trabajando a tiempo completo mientras asistes a la escuela de oficios. Tu salario aumenta cada 6 meses. Recibes beneficios desde el primer día." },
        { stage: "Oficial", years: "5+ Años", pay: "$35–75/hr", icon: "02", desc: "Completaste tu aprendizaje y obtuviste tu tarjeta de oficial. Puedes trabajar donde tu sindicato tenga jurisdicción. Salarios completos, beneficios completos, contribuciones completas de pensión." },
        { stage: "Capataz", years: "8–15 Años", pay: "$45–90/hr", icon: "03", desc: "Los oficiales experimentados asumen roles de capataz — liderando cuadrillas, leyendo planos, coordinando materiales. El pago de capataz incluye una prima sobre la escala de oficial." },
        { stage: "Capataz General / Superintendent", years: "15+ Años", pay: "$75–120k+/año", icon: "04", desc: "Gestionar múltiples cuadrillas y subcontratistas en proyectos importantes. A menudo asalariado." },
        { stage: "Maestro / Propietario", years: "Varía", pay: "Ilimitado", icon: "05", desc: "Con una licencia de maestro puedes sacar permisos y manejar tu propia empresa contratista." },
      ],
      whyUnion: [
        { label: "Pensión", icon: "$", desc: "Pensiones de beneficio definido que te pagan de por vida después de la jubilación." },
        { label: "Seguro Médico", icon: "+", desc: "Cobertura médica familiar completa, a menudo sin prima para el trabajador." },
        { label: "Aprendizaje", icon: "◆", desc: "Gana mientras aprendes. Sin préstamos estudiantiles. Capacitación pagada por la industria." },
        { label: "Anualidad / 401k", icon: "↑", desc: "Ahorros adicionales para la jubilación además de tu pensión, aportados por los empleadores." },
        { label: "Días Festivos Pagados", icon: "📅", desc: "Los contratos sindicales incluyen días festivos pagados, fondos de vacaciones y licencia por enfermedad." },
        { label: "Seguridad", icon: "✓", desc: "Los sitios de trabajo sindicales tienen estrictas normas de seguridad." },
      ],
      stats: [
        { num: "$63/hr", label: "Salario promedio de oficial en grandes mercados metropolitanos" },
        { num: "$0", label: "Costo del aprendizaje para el trabajador" },
        { num: "5 Años", label: "Duración típica del aprendizaje — más corto que una carrera universitaria" },
        { num: "300%+", label: "Más probabilidades de tener seguro médico proporcionado por el empleador" },
      ]
    },
    pl: {
      title: "Ścieżka Kariery w Zawodach Związkowych",
      sub: "Każdy zawód oferuje ustrukturyzowaną ścieżkę od praktykanta do mistrza — zarabiając prawdziwe wynagrodzenie przez cały czas. Bez długu studenckiego. Bez bezpłatnych staży.",
      stages: [
        { stage: "Praktykant", years: "Lata 1–5", pay: "$18–35/hr", icon: "01", desc: "Jesteś zapisany na zarejestrowaną praktykę — pracujesz w pełnym wymiarze godzin, jednocześnie uczęszczając do szkoły zawodowej. Twoje wynagrodzenie rośnie co 6 miesięcy. Otrzymujesz świadczenia od pierwszego dnia." },
        { stage: "Czeladnik", years: "5+ Lat", pay: "$35–75/hr", icon: "02", desc: "Ukończyłeś praktykę i zdobyłeś kartę czeladniczą. Możesz pracować wszędzie, gdzie Twój związek ma jurysdykcję. Pełne wynagrodzenie, pełne świadczenia, pełne składki emerytalne." },
        { stage: "Brygadzista", years: "8–15 Lat", pay: "$45–90/hr", icon: "03", desc: "Doświadczeni czeladnicy przejmują role brygadzistów — kierując ekipami, czytając plany, koordynując materiały." },
        { stage: "Brygadzista Generalny / Superintendent", years: "15+ Lat", pay: "$75–120k+/rok", icon: "04", desc: "Zarządzanie wieloma ekipami i podwykonawcami przy dużych projektach. Często na etacie." },
        { stage: "Mistrz / Właściciel firmy", years: "Różnie", pay: "Bez ograniczeń", icon: "05", desc: "Z licencją mistrzowską możesz wystawiać pozwolenia i prowadzić własną firmę wykonawczą." },
      ],
      whyUnion: [
        { label: "Emerytura", icon: "$", desc: "Emerytury ze zdefiniowanym świadczeniem, które wypłacają Ci pieniądze przez całe życie po przejściu na emeryturę." },
        { label: "Ubezpieczenie zdrowotne", icon: "+", desc: "Pełne ubezpieczenie zdrowotne rodziny, często bez składki dla pracownika." },
        { label: "Praktyka zawodowa", icon: "◆", desc: "Zarabiaj ucząc się. Bez pożyczek studenckich. Szkolenie opłacane przez branżę." },
        { label: "Renta / 401k", icon: "↑", desc: "Dodatkowe oszczędności emerytalne ponad Twoją emeryturę, wnoszone przez pracodawców." },
        { label: "Bezpieczeństwo", icon: "✓", desc: "Place budowy związkowe mają rygorystyczne standardy bezpieczeństwa." },
      ],
      stats: [
        { num: "$63/hr", label: "Średnie wynagrodzenie czeladnika na głównych rynkach miejskich" },
        { num: "$0", label: "Koszt szkolenia praktycznego dla pracownika" },
        { num: "5 Lat", label: "Typowa długość praktyki — krótsza niż studia wyższe" },
        { num: "300%+", label: "Większe prawdopodobieństwo posiadania ubezpieczenia zdrowotnego od pracodawcy" },
      ]
    }
  };



  // Handle browser back/forward
  useEffect(() => {
    const handlePop = (e) => {
      const p = e.state?.page || getPageFromUrl();
      setPageState(p);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
        setGlobalQuery("");
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const PAGE_META = {
      home:      { title: "Union Pathways — Find Your Nearest Union Construction Local", desc: "Find your nearest union construction local — IBEW, UA, SMART, BAC, UBC, Ironworkers, Insulators, Laborers and more. Free resource for tradespeople." },
      quiz:      { title: "Union Pathways — Which Trade Is Right For You?", desc: "Take our free quiz to find out which union construction trade matches your skills, interests, and goals." },
      careers:   { title: "Union Pathways — Career Paths in the Union Trades", desc: "Learn about apprenticeships, wages, and career paths in union construction trades. Earn while you learn — no college debt." },
      checklist: { title: "Union Pathways — How to Join a Union", desc: "Step-by-step guide to joining a union construction apprenticeship. Requirements, timeline, and how to apply." },
      history:   { title: "Union Pathways — Union History in America", desc: "The 40-hour work week, the weekend, workplace safety — every benefit workers have today was fought for by unions. Learn the history." },
      veterans:  { title: "Union Pathways — Veterans and the Union Trades", desc: "Military veterans are a perfect fit for union construction apprenticeships. Learn about Helmets to Hardhats and other veteran programs." },
      locals:   { title: "Union Pathways — Understanding Your Local", desc: "Learn about union jurisdiction, Book 1 vs Book 2, home locals, travel work, and apprenticeship school models." },
      about:    { title: "Union Pathways — About Us", desc: "Union Pathways was founded by Noah, an IBEW Journeyman and superintendent. Built for union tradespeople, by a union tradesperson." },
      contact:   { title: "Union Pathways — Contact Us", desc: "Get in touch with the Union Pathways team. We help tradespeople find their nearest union local." },
    };
    const pm = PAGE_META[page] || PAGE_META.home;
    document.title = pm.title;
    const setMeta = (sel, attr, val) => { let el = document.querySelector(sel); if (!el) { el = document.createElement(sel.includes('[name') ? 'meta' : sel.includes('[property') ? 'meta' : 'link'); if (attr === 'name') el.name = val.split('=')[0]; document.head.appendChild(el); } };
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = "description"; document.head.appendChild(metaDesc); }
    metaDesc.content = pm.desc;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property','og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = pm.title;
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property','og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = pm.desc;
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property','og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = 'https://unionpathways.com' + (page === 'home' ? '' : '/' + page);
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement('link'); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = 'https://unionpathways.com' + (page === 'home' ? '' : '/' + page);
  }, [lang, page]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const resolveLocation = async (input) => {
    const q = input.trim();
    if (!q) return null;

    const ALL = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...SMART_LOCALS, ...BAC_LOCALS, ...UBC_LOCALS, ...HFIAW_LOCALS, ...IUEC_LOCALS, ...LIUNA_LOCALS];

    // ZIP code (5 digits) — use local ZIP map first for speed
    if (/^\d{5}$/.test(q)) {
      const entry = ZIP_PREFIX_MAP[q.slice(0, 3)];
      if (entry) return { lat: entry[1], lng: entry[2], display: `ZIP ${q}` };
    }

    // Check known city lookup table FIRST before Nominatim
    const qLow = q.toLowerCase();
    if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };

    // Try Nominatim geocoding for any city/address input
    try {
      const isCanadian = /(canada|ontario|quebec|british columbia|alberta|bc|on|qc|ab|mb|sk|ns|nb|nl|pe|nt|yt|nu)/i.test(q);
      const searchQ = isCanadian ? q : q + ", USA";
      const countryFilter = isCanadian ? "ca" : "us,ca";
      const encoded = encodeURIComponent(searchQ);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=${countryFilter}`, {
        headers: { "Accept-Language": "en", "User-Agent": "UnionPathway/1.0" }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name.split(",").slice(0,2).join(",").trim() };
      }
    } catch (e) {
      // Fall through to local lookup
    }

    // Fallback: state name only
    const stateAbbr2 = STATE_NAMES[qLow] || (STATE_CENTERS[q.toUpperCase()] ? q.toUpperCase() : null);
    if (stateAbbr2 && STATE_CENTERS[stateAbbr2]) {
      const sc2 = STATE_CENTERS[stateAbbr2];
      return { lat: sc2.lat, lng: sc2.lng, display: q };
    }

    // Fallback: city name search across all locals
    const cityHit = ALL.find(l => l.city.toLowerCase() === qLow)
      || ALL.find(l => l.city.toLowerCase().includes(qLow));
    if (cityHit) return { lat: cityHit.lat, lng: cityHit.lng, display: `${cityHit.city}, ${cityHit.state}` };

    return null;
  };


  useEffect(() => {
    if (!showMap || !results || results.length === 0) return;
    const initMap = () => {
      const L = window.L;
      if (!L || !document.getElementById('union-map')) return;
      if (window._unionMap) { window._unionMap.remove(); window._unionMap = null; }
      const map = L.map('union-map');
      window._unionMap = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://carto.com/">CARTO</a>', maxZoom: 18
      }).addTo(map);
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:14px;height:14px;background:#FA8059;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(250,128,89,0.9);"></div>',
        iconSize: [14,14], iconAnchor: [7,7]
      });
      const markers = results.map(local => {
        const m = L.marker([local.lat, local.lng], {icon}).addTo(map);
        m.bindPopup('<b>' + local.name + '</b><br/>' + local.city + ', ' + local.state + (local.phone ? '<br/>' + local.phone : '') + (local.address ? '<br/><small>' + local.address + '</small>' : ''));
        return m;
      });
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.3));
      }
    };
    if (window.L) {
      setTimeout(initMap, 100);
    } else {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setTimeout(initMap, 100);
      document.head.appendChild(script);
    }
    return () => {
      if (window._unionMap) { window._unionMap.remove(); window._unionMap = null; }
    };
  }, [showMap, results]);

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setResults(null);

    const loc = await resolveLocation(q);
    if (!loc) {
      setError(t.errorMsg);
      setLoading(false);
      return;
    }

    setLocationLabel(loc.display);
    const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IUEC" ? IUEC_LOCALS : selectedTrade === "IUOE" ? IUOE_LOCALS : selectedTrade === "IW" ? IW_LOCALS : selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
    const withDist = database
      .map(l => ({ ...l, distance: getDistanceMiles(loc.lat, loc.lng, l.lat, l.lng) }))
      .sort((a, b) => a.distance - b.distance);
    const within150 = withDist.filter(l => l.distance <= 50);
    setResults(within150);
    setLoading(false);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported by your browser."); return; }
    setGeoLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocationLabel("Your Current Location");
        const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IUEC" ? IUEC_LOCALS : selectedTrade === "IW" ? IW_LOCALS : selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
        const withDist = database
          .map(l => ({ ...l, distance: getDistanceMiles(lat, lng, l.lat, l.lng) }))
          .sort((a, b) => a.distance - b.distance);
        const within150 = withDist.filter(l => l.distance <= 50);
        setResults(within150);
        setGeoLoading(false);
      },
      () => { setError("Location access denied. Please enter your location manually."); setGeoLoading(false); }
    );
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleQuizAnswer = (answer, idx) => {
    const newAnswers = [...quizAnswers, idx];
    setQuizAnswers(newAnswers);
    if (quizStep < QUIZ[lang].length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Tally scores across all questions
      const tradeScores = {};
      QUIZ[lang].forEach((q, qi) => {
        if (q.scores && newAnswers[qi] !== undefined) {
          const scoreMap = q.scores[newAnswers[qi]];
          if (scoreMap) {
            Object.entries(scoreMap).forEach(([trade, pts]) => {
              tradeScores[trade] = (tradeScores[trade] || 0) + pts;
            });
          }
        }
      });
      const top = Object.entries(tradeScores).sort((a,b) => b[1]-a[1])[0][0];
      setQuizResult(top);
    }
  };

  const resetQuiz = () => { setQuizStep(0); setQuizAnswers([]); setQuizResult(null); };

  return (
    <>
        {/* Google Analytics */}
        <script async src='https://www.googletagmanager.com/gtag/js?id=G-6YG0F2LQKT'></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6YG0F2LQKT');
        `}} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');


        .map-toggle-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(250,128,89,0.08);
          border: 1px solid rgba(250,128,89,0.25);
          border-radius: 50px; padding: 7px 16px;
          color: var(--muted); font-size: 13px; font-weight: 700;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
        }
        .map-toggle-btn:hover, .map-toggle-btn.active {
          border-color: #FA8059; color: #FA8059;
          background: rgba(250,128,89,0.15);
        }
        .map-container {
          width: 100%; height: 420px; border-radius: 16px;
          overflow: hidden; margin-bottom: 24px;
          border: 1px solid rgba(250,128,89,0.2);
        }

        .history-hero {
          background: linear-gradient(180deg, rgba(250,128,89,0.12) 0%, transparent 100%);
          border-bottom: 1px solid rgba(250,128,89,0.15);
          padding: 80px 24px 64px;
          text-align: center;
        }
        .history-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #FA8059; margin-bottom: 16px;
        }
        .history-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(42px, 8vw, 80px);
          font-weight: 900; line-height: 0.95;
          text-transform: uppercase; letter-spacing: -0.02em;
          color: #fff; margin-bottom: 24px;
        }
        .history-title .accent { color: #FA8059; }
        .history-subtitle {
          font-size: 18px; color: var(--muted);
          max-width: 600px; margin: 0 auto;
          line-height: 1.6;
        }
        .history-stats {
          display: flex; justify-content: center;
          gap: 16px; flex-wrap: wrap;
          margin-top: 48px;
        }
        .history-stat {
          background: rgba(250,128,89,0.08);
          border: 1px solid rgba(250,128,89,0.2);
          border-radius: 16px; padding: 20px 28px;
          text-align: center; min-width: 130px;
        }
        .history-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 38px; font-weight: 900;
          color: #FA8059; line-height: 1;
        }
        .history-stat-label {
          font-size: 12px; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-top: 6px; font-weight: 600;
        }
        .history-section {
          max-width: 900px; margin: 0 auto;
          padding: 64px 24px;
        }
        .history-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900;
          text-transform: uppercase; letter-spacing: -0.01em;
          color: #fff; margin-bottom: 8px;
        }
        .history-section-title .accent { color: #FA8059; }
        .history-section-sub {
          font-size: 15px; color: var(--muted);
          margin-bottom: 40px; line-height: 1.6;
        }
        .timeline {
          position: relative;
          padding-left: 32px;
        }
        .timeline::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #FA8059, rgba(250,128,89,0.1));
        }
        .timeline-item {
          position: relative;
          margin-bottom: 40px;
          padding: 24px 28px;
          background: rgba(34,48,61,0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(58,80,104,0.4);
          border-radius: 16px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .timeline-item:hover {
          border-color: rgba(250,128,89,0.3);
          transform: translateX(4px);
        }
        .timeline-dot {
          position: absolute;
          left: -40px; top: 28px;
          width: 16px; height: 16px;
          background: #FA8059;
          border-radius: 50%;
          border: 3px solid #000;
          box-shadow: 0 0 12px rgba(250,128,89,0.6);
        }
        .timeline-year {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #FA8059; margin-bottom: 6px;
        }
        .timeline-event {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #fff; margin-bottom: 8px;
          line-height: 1.2;
        }
        .timeline-desc {
          font-size: 14px; color: var(--muted);
          line-height: 1.6;
        }
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px; margin-top: 8px;
        }
        .impact-card {
          background: rgba(34,48,61,0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(58,80,104,0.4);
          border-radius: 20px;
          padding: 28px 24px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .impact-card:hover {
          border-color: rgba(250,128,89,0.3);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(250,128,89,0.1);
        }
        .impact-icon {
          font-size: 36px; margin-bottom: 16px;
        }
        .impact-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #fff; margin-bottom: 8px;
        }
        .impact-desc {
          font-size: 14px; color: var(--muted);
          line-height: 1.6;
        }
        .quote-block {
          background: rgba(250,128,89,0.06);
          border-left: 4px solid #FA8059;
          border-radius: 0 16px 16px 0;
          padding: 28px 32px;
          margin: 40px 0;
        }
        .quote-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 26px; font-weight: 700;
          color: #fff; line-height: 1.3;
          margin-bottom: 12px;
          font-style: italic;
        }
        .quote-author {
          font-size: 13px; color: #FA8059;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .divider-line {
          border: none;
          border-top: 1px solid rgba(58,80,104,0.4);
          margin: 0;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --yellow: #FA8059;
          --yellow-dim: #d4634a;
          --steel: #000000;
          --steel-mid: #22303D;
          --steel-light: #2d3f4e;
          --plate: #1a2c3a;
          --wire: #3a5068;
          --text: #ffffff;
          --muted: #a0b4c4;
          --card-bg: #111111;
        }

        body {
          font-family: 'Barlow', sans-serif;
          background: var(--steel);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app { min-height: 100vh; display: flex; flex-direction: column; }

        /* ── NAV ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(0,0,0,0.97);
          border-bottom: 1px solid rgba(245,197,24,0.15);
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 100;
          gap: 8px; flex-wrap: wrap;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 12px;
        }
        .nav-bolt {
          width: 32px; height: 32px;
          background: var(--yellow);
          clip-path: polygon(60% 0%, 100% 0%, 40% 50%, 80% 50%, 0% 100%, 20% 55%, -10% 55%);
          flex-shrink: 0;
        }
        .nav-wordmark {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .nav-wordmark span { color: var(--yellow); }
        .nav-right { position: relative; }

        .nav-trades-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(250,128,89,0.08);
          border: 1px solid rgba(250,128,89,0.25);
          border-radius: 50px;
          padding: 9px 16px;
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .nav-trades-btn:hover, .nav-trades-btn.open {
          background: rgba(250,128,89,0.15);
          border-color: #FA8059;
          color: #FA8059;
          box-shadow: 0 0 20px rgba(250,128,89,0.2);
        }
        .nav-trades-btn .chevron {
          transition: transform 0.2s ease;
        }
        .nav-trades-btn.open .chevron { transform: rotate(180deg); }

        .trades-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 380px; max-width: calc(100vw - 24px);
          background: var(--steel-light);
          border: 1px solid var(--wire);
          border-radius: 14px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,197,24,0.06);
          overflow: hidden;
          display: flex; flex-direction: column;
          max-height: min(70vh, 520px);
          animation: dropIn 0.18s ease;
          z-index: 200;
        }
        .dropdown-scroll-body {
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          flex: 1;
        }
        .dropdown-scroll-body::-webkit-scrollbar { width: 4px; }
        .dropdown-scroll-body::-webkit-scrollbar-track { background: transparent; }
        .dropdown-scroll-body::-webkit-scrollbar-thumb { background: var(--wire); border-radius: 4px; }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid var(--wire);
          background: rgba(245,197,24,0.04);
        }
        .dropdown-title {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--text); margin-bottom: 3px;
        }
        .dropdown-sub { font-size: 12px; color: var(--muted); }

        .dropdown-group { padding: 10px 0; border-bottom: 1px solid rgba(46,66,96,0.5); }
        .dropdown-group:last-of-type { border-bottom: none; }

        .dropdown-group-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); padding: 4px 20px 8px;
        }

        .dropdown-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 20px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .dropdown-item.active.selected {
          background: rgba(245,197,24,0.08);
          border-left: 3px solid var(--yellow);
        }
        .dropdown-item.active:hover { background: rgba(250,128,89,0.06); }
        .dropdown-item.coming { opacity: 0.55; cursor: default; }

        .trade-abbr-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.05em;
          border: 1px solid var(--wire);
          color: var(--muted);
          border-radius: 5px;
          padding: 3px 6px;
          min-width: 52px; text-align: center;
          flex-shrink: 0;
        }
        .dropdown-item.active .trade-abbr-badge {
          border-color: rgba(245,197,24,0.4);
          color: var(--yellow);
        }

        .trade-info { flex: 1; }
        .trade-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.02em; color: var(--text);
        }
        .trade-full { font-size: 11px; color: var(--muted); margin-top: 1px; }

        .trade-status { flex-shrink: 0; }
        .status-live {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          color: #4ade80; letter-spacing: 0.05em;
        }
        .status-soon {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          background: var(--plate);
          border: 1px solid var(--wire);
          color: var(--muted);
          border-radius: 4px; padding: 2px 7px;
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        .dropdown-footer {
          padding: 12px 20px;
          font-size: 11px; color: var(--muted);
          background: rgba(0,0,0,0.2);
          border-top: 1px solid var(--wire);
          text-align: center;
        }
        .dropdown-footer a { color: var(--yellow); text-decoration: none; }
        .dropdown-footer a:hover { text-decoration: underline; }


          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          background: rgba(245,197,24,0.12);
          border: 1px solid rgba(245,197,24,0.3);
          color: var(--yellow);
          padding: 4px 10px; border-radius: 4px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* ── HERO ── */
        .hero {
          flex: 1;
          display: flex; flex-direction: column; align-items: center;
          padding: 70px 24px 60px;
          position: relative; overflow: hidden;
        }

        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(250,128,89,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,128,89,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }

        .hero-glow {
          position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(250,128,89,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          position: relative; z-index: 1;
          max-width: 760px; width: 100%;
          text-align: center;
          margin: 0 auto;
          display: flex; flex-direction: column; align-items: center;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hero-content.visible { opacity: 1; transform: translateY(0); }

        .hero-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--yellow);
          margin-bottom: 20px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .eyebrow-line { width: 32px; height: 1px; background: var(--yellow); opacity: 0.5; }

        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(52px, 9vw, 92px);
          font-weight: 900;
          line-height: 0.92;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 24px;
        }
        .hero-title .accent { color: var(--yellow); display: block; }

        .hero-sub {
          font-size: 17px; font-weight: 300; color: var(--muted);
          line-height: 1.6; max-width: 520px; margin: 0 auto 48px;
        }
        .hero-sub strong { color: var(--text); font-weight: 500; }

        /* ── SEARCH BOX ── */
        .trade-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-bottom: 2px;
          margin-bottom: 20px;
        }
        .trade-selector::-webkit-scrollbar { display: none; }
        .trade-pill {
          flex-shrink: 0;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 6px 14px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .trade-pill:hover {
          border-color: rgba(255,255,255,0.25);
          color: #fff;
        }
        .trade-pill.selected {
          color: #000;
          border-color: transparent;
        }

        .search-card {
          background: rgba(34,48,61,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(250,128,89,0.15);
          border-radius: 24px;
          padding: 28px 32px;
          width: 100%; max-width: 620px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(250,128,89,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .search-card:hover { transform: translateY(-3px); box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(250,128,89,0.15); }
        .search-card { margin-bottom: 32px; }

        .search-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 14px; display: block;
        }

        .search-row {
          display: flex; gap: 10px;
        }

        .search-input {
          flex: 1;
          background: var(--steel-mid);
          border: 1.5px solid var(--wire);
          border-radius: 10px;
          padding: 14px 18px;
          font-family: 'Barlow', sans-serif;
          font-size: 16px; color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(250,128,89,0.15); border-color: rgba(250,128,89,0.5);
        }

        .btn-search {
          background: var(--yellow);
          color: var(--steel);
          border: none; cursor: pointer;
          border-radius: 10px;
          padding: 14px 26px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: background 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .btn-search:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(250,128,89,0.5); }
        .btn-search:active { transform: translateY(0); }
        .btn-search:disabled { opacity: 0.6; cursor: not-allowed; }

        .search-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0;
          color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .search-divider::before, .search-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--wire);
        }

        .btn-geo {
          width: 100%;
          background: transparent;
          border: 1.5px solid var(--wire);
          border-radius: 10px;
          padding: 12px 20px;
          color: var(--muted);
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn-geo:hover {
          border-color: var(--yellow);
          color: var(--yellow);
          background: rgba(245,197,24,0.05);
        }

        /* ── LOADING ── */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(245,197,24,0.3);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── ERROR ── */
        .error-msg {
          margin-top: 14px;
          padding: 12px 16px;
          background: rgba(255, 80, 80, 0.08);
          border: 1px solid rgba(255, 80, 80, 0.25);
          border-radius: 8px;
          color: #ff8080; font-size: 14px;
        }

        /* ── RESULTS ── */
        .results-section {
          width: 100%; max-width: 760px;
          margin: 32px auto 0; padding: 0 24px 80px;
        }
        .results-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .results-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .results-title span { color: var(--yellow); }
        .results-location {
          font-size: 12px; color: var(--muted);
          font-style: italic;
        }

        .local-card {
          background: rgba(26,44,58,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(58,80,104,0.5);
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 14px;
          display: flex; align-items: flex-start; gap: 20px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          animation: slideUp 0.4s ease both;
        }
        .local-card:nth-child(1) { animation-delay: 0.05s; }
        .local-card:nth-child(2) { animation-delay: 0.12s; }
        .local-card:nth-child(3) { animation-delay: 0.19s; }
        .local-card:nth-child(4) { animation-delay: 0.26s; }
        .local-card:nth-child(5) { animation-delay: 0.33s; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .local-card:hover {
          border-color: var(--yellow);
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,197,24,0.15);
        }

        .card-rank {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900;
          color: rgba(245,197,24,0.2);
          line-height: 1; min-width: 36px; text-align: center;
          padding-top: 4px;
        }
        .local-card:hover .card-rank { color: rgba(245,197,24,0.5); }

        .card-body { flex: 1; }

        .card-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.03em;
          margin-bottom: 4px;
        }

        .card-location {
          font-size: 13px; color: var(--muted); margin-bottom: 14px;
        }

        .card-info {
          display: flex; flex-wrap: wrap; gap: 10px;
        }

        .info-chip {
          display: flex; align-items: center; gap: 6px;
          background: var(--steel-light);
          border: 1px solid var(--wire);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 13px; color: var(--muted);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .info-chip:hover { border-color: var(--yellow); color: var(--yellow); }
        .info-chip svg { flex-shrink: 0; }

        .card-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
        .btn-share {
          background: transparent;
          border: 1px solid var(--wire);
          border-radius: 8px; padding: 8px 14px;
          color: var(--muted); cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-share:hover { border-color: var(--yellow); color: var(--yellow); }
        .btn-correction {
          background: transparent; border: none;
          color: rgba(255,255,255,0.3); cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 11px; padding: 8px 4px;
          transition: color 0.2s;
        }
        .btn-correction:hover { color: var(--muted); }

        .btn-apply {
          background: var(--yellow);
          color: var(--steel);
          border: none; cursor: pointer;
          border-radius: 8px; padding: 10px 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; display: inline-block;
          transition: background 0.2s;
        }
        .btn-apply:hover { background: #ffd740; }

        .btn-website {
          background: transparent;
          border: 1.5px solid var(--wire);
          color: var(--muted); cursor: pointer;
          border-radius: 8px; padding: 10px 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; display: inline-block;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-website:hover { border-color: #FA8059; color: #FA8059; background: rgba(250,128,89,0.15); }

        .card-distance {
          text-align: right; min-width: 80px;
          display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
        }
        .distance-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900;
          color: var(--yellow); line-height: 1;
        }
        .distance-unit {
          font-size: 11px; color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .nearest-badge {
          background: rgba(245,197,24,0.12);
          border: 1px solid rgba(245,197,24,0.3);
          color: var(--yellow);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 4px; white-space: nowrap;
        }

        /* ── FEATURES STRIP ── */
        .features {
          border-top: 1px solid var(--wire);
          padding: 40px 24px;
          display: flex; justify-content: center; gap: 60px;
          flex-wrap: wrap;
        }
        .feature {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; color: var(--muted);
        }
        .feature-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.15);
          display: flex; align-items: center; justify-content: center;
        }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid var(--wire);
          padding: 20px 40px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: var(--muted);
          flex-wrap: wrap; gap: 8px;
        }

        /* ── LANGUAGE TOGGLE ── */
        .lang-btn {
          background: transparent;
          border: 1.5px solid var(--wire);
          border-radius: 6px;
          padding: 8px 14px;
          color: var(--muted);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.08em; cursor: pointer;
          transition: all 0.2s; min-width: 40px;
          -webkit-tap-highlight-color: transparent;
        }
        .lang-btn:hover { border-color: var(--yellow); color: var(--yellow); }
        .lang-btn.active { background: var(--yellow); color: var(--steel); border-color: var(--yellow); }

        /* ── NAV LINKS ── */
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-link {
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 6px 9px; border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-link.active { color: var(--yellow); }

        /* ── NAV DROPDOWN ── */
        .nav-dropdown-wrap { position: relative; }
        .nav-dropdown-btn {
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 6px 9px; border-radius: 6px;
          display: flex; align-items: center; gap: 4px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-dropdown-btn:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-dropdown-btn.active { color: var(--yellow); }
        .nav-dropdown-btn svg { transition: transform 0.2s; }
        .nav-dropdown-btn.open svg { transform: rotate(180deg); }
        .nav-dropdown-menu {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: var(--steel-mid);
          border: 1px solid var(--wire);
          border-radius: 10px; overflow: hidden;
          min-width: 180px; z-index: 200;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          animation: fadeIn 0.15s ease;
        }
        .nav-dropdown-item {
          display: flex; flex-direction: column;
          padding: 12px 16px; cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          text-align: left;
        }
        .nav-dropdown-item:last-child { border-bottom: none; }
        .nav-dropdown-item:hover { background: rgba(255,255,255,0.06); }
        .nav-dropdown-item.active .nav-dropdown-label { color: var(--yellow); }
        .nav-dropdown-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text);
        }
        .nav-dropdown-sub {
          font-size: 11px; color: var(--muted); margin-top: 2px;
        }

        /* ── QUIZ PAGE ── */
        .page { max-width: 700px; margin: 0 auto; padding: 48px 24px 80px; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .page-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--yellow);
          margin-bottom: 12px;
        }
        .page-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(36px, 6vw, 56px); font-weight: 900;
          text-transform: uppercase; line-height: 1; margin-bottom: 16px;
        }
        .page-sub { font-size: 16px; color: var(--muted); line-height: 1.6; margin-bottom: 40px; max-width: 560px; }

        .quiz-progress {
          display: flex; gap: 6px; margin-bottom: 32px;
        }
        .quiz-pip {
          height: 3px; flex: 1; border-radius: 2px;
          background: var(--wire); transition: background 0.3s;
        }
        .quiz-pip.done { background: var(--yellow); }

        .quiz-question {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px; font-weight: 800;
          margin-bottom: 20px; line-height: 1.2;
        }
        .quiz-step-label {
          font-size: 12px; color: var(--muted);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 8px;
        }

        .quiz-options { display: flex; flex-direction: column; gap: 10px; }
        .quiz-option {
          background: var(--card-bg);
          border: 1.5px solid var(--wire);
          border-radius: 10px;
          padding: 16px 20px;
          text-align: left; cursor: pointer; color: var(--text);
          font-family: 'Barlow', sans-serif; font-size: 15px;
          transition: border-color 0.15s, background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 12px;
        }
        .quiz-option:hover { border-color: var(--yellow); background: rgba(245,197,24,0.05); transform: translateX(4px); }
        .quiz-option-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800; color: var(--muted);
          min-width: 20px;
        }

        /* ── QUIZ RESULT ── */
        .quiz-result { animation: fadeIn 0.4s ease; }
        .result-card {
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          border: 1px solid;
        }
        .result-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .result-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .result-why { font-size: 15px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
        .result-path { margin-bottom: 24px; }
        .result-path-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 12px;
        }
        .result-path-step {
          display: flex; gap: 12px; padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 14px; color: var(--text); align-items: flex-start;
        }
        .result-path-step:last-child { border-bottom: none; }
        .step-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--yellow); margin-top: 6px; flex-shrink: 0;
        }
        .result-app-note {
          font-size: 13px; color: var(--muted); font-style: italic;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px; border: 1px solid var(--wire);
          margin-bottom: 20px;
        }
        .result-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-primary {
          background: var(--yellow); color: var(--steel);
          border: none; cursor: pointer; border-radius: 8px;
          padding: 12px 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; display: inline-block;
          transition: background 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(250,128,89,0.5); }
        .btn-ghost {
          background: transparent; color: var(--muted);
          border: 1.5px solid var(--wire); cursor: pointer;
          border-radius: 8px; padding: 12px 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: #FA8059; color: #FA8059; box-shadow: 0 0 20px rgba(250,128,89,0.15); }

        /* ── CAREER PATH PAGE ── */
        .career-stats {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 16px; margin-bottom: 48px;
        }
        .stat-card {
          background: transparent;
          border: 1px solid rgba(250,128,89,0.2);
          border-radius: 12px; padding: 20px 24px;
        }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900; color: var(--yellow);
          line-height: 1; margin-bottom: 6px;
        }
        .stat-label { font-size: 13px; color: var(--muted); line-height: 1.4; }

        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .section-title::after {
          content: ''; flex: 1; height: 1px; background: var(--wire);
        }

        .career-stages { margin-bottom: 48px; }
        .career-stage {
          display: flex; gap: 20px;
          padding: 22px 24px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          background: rgba(255,255,255,0.02);
          margin-bottom: 12px;
          align-items: flex-start;
          transition: border-color 0.2s, background 0.2s;
        }
        .career-stage:hover {
          background: rgba(250,128,89,0.04);
          border-color: rgba(250,128,89,0.2);
        }
        .stage-icon {
          min-width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(250,128,89,0.3);
          border-radius: 8px;
          font-size: 13px; font-weight: 800;
          font-family: 'Barlow Condensed', sans-serif;
          color: #FA8059; letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .stage-info { flex: 1; }
        .stage-header {
          display: flex; align-items: baseline;
          gap: 12px; margin-bottom: 8px; flex-wrap: wrap;
        }
        .stage-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800; text-transform: uppercase;
        }
        .stage-years { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .stage-pay {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; font-weight: 800; color: var(--yellow);
          margin-left: auto;
        }
        .stage-desc { font-size: 14px; color: var(--muted); line-height: 1.6; }

        .benefits-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 14px; margin-bottom: 40px;
        }
        .benefit-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 24px 20px;
          transition: border-color 0.2s, background 0.2s;
        }
        .benefit-card:hover {
          background: rgba(250,128,89,0.04);
          border-color: rgba(250,128,89,0.2);
        }
        .benefit-icon {
          width: 36px; height: 36px;
          background: transparent;
          border: 1px solid rgba(250,128,89,0.3);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900;
          font-family: 'Barlow Condensed', sans-serif;
          color: #FA8059; margin-bottom: 14px;
        }
        .benefit-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .benefit-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }

        .cta-banner {
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.25);
          border-radius: 14px; padding: 28px;
          text-align: center; margin-top: 16px;
        }
        .cta-banner h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .cta-banner p { color: var(--muted); font-size: 14px; margin-bottom: 20px; }

        /* ── CHECKLIST PAGE ── */
        .checklist-intro {
          background: rgba(245,197,24,0.06);
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 40px;
          font-size: 15px;
          color: var(--muted);
          line-height: 1.7;
        }
        .checklist-intro strong { color: var(--text); }

        .checklist-section { margin-bottom: 40px; }
        .checklist-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .checklist-section-title::after {
          content: ''; flex: 1; height: 1px; background: var(--wire);
        }

        .checklist-items { display: flex; flex-direction: column; gap: 10px; }
        .checklist-item {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--card-bg);
          border: 1px solid var(--wire);
          border-radius: 10px;
          padding: 16px 18px;
        }
        .checklist-item.required { border-left: 3px solid var(--yellow); }
        .checklist-item.optional { border-left: 3px solid #4a9eff; }
        .checklist-item.helpful  { border-left: 3px solid #22c55e; }

        .checklist-icon { font-size: 22px; min-width: 28px; text-align: center; }
        .checklist-text { flex: 1; }
        .checklist-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .checklist-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .checklist-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 4px;
          margin-left: 8px; vertical-align: middle;
        }
        .tag-required { background: rgba(245,197,24,0.15); color: var(--yellow); }
        .tag-optional { background: rgba(74,158,255,0.15); color: #4a9eff; }
        .tag-helpful  { background: rgba(34,197,94,0.15); color: #22c55e; }

        .trade-diff-grid {
          display: grid; grid-template-columns: repeat(2,1fr);
          gap: 14px; margin-bottom: 40px;
        }
        .trade-diff-card {
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 10px; padding: 18px;
        }
        .trade-diff-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .trade-diff-list {
          font-size: 13px; color: var(--muted);
          line-height: 1.8; list-style: none; padding: 0; margin: 0;
        }
        .trade-diff-list li::before { content: "→ "; color: var(--yellow); }

        .checklist-steps {
          counter-reset: steps;
          display: flex; flex-direction: column; gap: 12px;
        }
        .checklist-step {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 10px; padding: 16px 18px;
        }
        .step-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 900; color: var(--yellow);
          min-width: 32px; line-height: 1;
        }
        .step-content { flex: 1; }
        .step-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 800;
          text-transform: uppercase; margin-bottom: 4px;
        }
        .step-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

        .checklist-legend {
          display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
        }
        .legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--muted);
        }
        .legend-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }

        @media (max-width: 640px) {
          .trade-diff-grid { grid-template-columns: 1fr; }
        }

        /* ── VETERANS PAGE ── */
        .h2h-hero {
          background: linear-gradient(135deg, rgba(15,25,35,0.95), rgba(30,45,60,0.9));
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 16px; padding: 36px;
          margin-bottom: 40px;
          display: flex; gap: 32px; align-items: center; flex-wrap: wrap;
        }
        .h2h-logo-block { text-align: center; flex-shrink: 0; }
        .h2h-emblem { font-size: 64px; line-height: 1; margin-bottom: 8px; }
        .h2h-logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase; color: var(--yellow);
        }
        .h2h-hero-text { flex: 1; min-width: 240px; }
        .h2h-hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 26px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 12px; line-height: 1.1;
        }
        .h2h-hero-desc { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 20px; }
        .h2h-stat-row { display: flex; gap: 24px; flex-wrap: wrap; }
        .h2h-stat { text-align: center; }
        .h2h-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900; color: var(--yellow); line-height: 1;
        }
        .h2h-stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .vet-advantage-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; margin-bottom: 40px; }
        .vet-advantage-card {
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 10px; padding: 18px;
          display: flex; gap: 14px; align-items: flex-start;
        }
        .vet-adv-icon { font-size: 24px; min-width: 32px; }
        .vet-adv-label { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
        .vet-adv-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
        .h2h-steps { display: flex; flex-direction: column; margin-bottom: 40px; }
        .h2h-step { display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: flex-start; }
        .h2h-step:last-child { border-bottom: none; }
        .h2h-step-num { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 900; color: var(--yellow); min-width: 36px; line-height: 1; }
        .h2h-step-title { font-family: 'Barlow Condensed', sans-serif; font-size: 17px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
        .h2h-step-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .gi-bill-box {
          background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.25);
          border-radius: 12px; padding: 24px 28px; margin-bottom: 40px;
          display: flex; gap: 20px; align-items: flex-start;
        }
        .gi-bill-icon { font-size: 36px; flex-shrink: 0; }
        .gi-bill-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 900; text-transform: uppercase; color: #22c55e; margin-bottom: 8px; }
        .gi-bill-desc { font-size: 14px; color: var(--muted); line-height: 1.7; }
        .trades-vet-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-bottom: 40px; }
        .trade-vet-card { background: var(--card-bg); border: 1px solid var(--wire); border-radius: 10px; padding: 16px; display: flex; gap: 12px; align-items: center; }
        .trade-vet-icon { font-size: 26px; }
        .trade-vet-name { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 800; text-transform: uppercase; }
        .trade-vet-desc { font-size: 12px; color: var(--muted); }
        @media (max-width: 640px) {
          .vet-advantage-grid { grid-template-columns: 1fr; }
          .trades-vet-grid { grid-template-columns: 1fr; }
          .h2h-hero { flex-direction: column; text-align: center; }
          .gi-bill-box { flex-direction: column; }
        }

        .contact-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: start;
        }
        .contact-info-block { margin-bottom: 28px; }
        .contact-info-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 6px;
        }
        .contact-info-value { font-size: 15px; color: var(--text); }

        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 8px;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          background: var(--steel-mid);
          border: 1.5px solid var(--wire);
          border-radius: 8px;
          padding: 12px 16px;
          font-family: 'Barlow', sans-serif;
          font-size: 15px; color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(245,197,24,0.1);
        }
        .form-select { appearance: none; cursor: pointer; }
        .form-select option { background: var(--steel-mid); color: var(--text); }
        .form-textarea { resize: vertical; min-height: 130px; line-height: 1.6; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .contact-success {
          text-align: center; padding: 48px 24px;
          animation: fadeIn 0.4s ease;
        }
        .contact-success-icon { font-size: 56px; margin-bottom: 20px; }
        .contact-success h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 12px; color: var(--yellow);
        }
        .contact-success p { color: var(--muted); font-size: 15px; margin-bottom: 24px; }

        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
          .form-row { grid-template-columns: 1fr; }
        }
          .search-card { padding: 20px 20px; }
          .search-row { flex-direction: column; }
          .btn-search { width: 100%; }
          .results-section { padding: 0 16px 60px; }
          .local-card { flex-direction: column; gap: 12px; }
          .card-distance { flex-direction: row; align-items: center; gap: 10px; }
          .features { gap: 30px; }
          footer { justify-content: center; text-align: center; }
          .nav-wordmark { font-size: 17px; }
          .nav-link { padding: 5px 7px; font-size: 10px; }
          .nav-trades-btn { padding: 7px 10px; font-size: 12px; }
          .trades-dropdown { position: fixed; top: auto; left: 16px; right: 16px; width: auto; }
          .career-stats { grid-template-columns: 1fr; }
          .benefits-grid { grid-template-columns: 1fr; }
          .stage-pay { margin-left: 0; }
          .page { padding: 32px 16px 60px; }
        }

      `}</style>

      <div className="app">
        {/* NAV */}
        <nav>
          <div className="nav-logo" style={{cursor:"pointer", padding:"4px", margin:"-4px"}} onClick={() => { setPage("home"); setResults(null); setQuery(""); }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="450 395 390 110" style={{height:"56px", width:"auto"}}>
              <defs><style>{".cls-1{fill:#FA8059;}"}</style></defs>
              <g fill="white">
                <path d="M601.2,430.86c0,2.59-.56,4.57-1.69,5.92-1.13,1.35-2.93,2.03-5.41,2.03s-4.31-.68-5.44-2.03c-1.13-1.35-1.69-3.33-1.69-5.92v-22.85h-7.47v22.68c0,4.71,1.18,8.29,3.55,10.75,2.36,2.45,6.05,3.68,11.04,3.68s8.65-1.22,11.02-3.68c2.37-2.45,3.55-6.04,3.55-10.75v-22.68h-7.47v22.85Z"/>
                <polygon points="637.68 420.7 638 436.17 637.63 436.17 626.21 408.01 615.62 408.01 615.62 444.29 622.78 444.29 622.78 431.57 622.47 415.62 622.84 415.62 634.53 444.29 644.81 444.29 644.81 408.01 637.68 408.01 637.68 420.7"/>
                <rect x="652.08" y="408.01" width="7.47" height="36.28"/>
                <path d="M680.83,407.24c-5.02,0-8.8,1.33-11.37,3.97-2.57,2.65-3.85,6.43-3.85,11.33v7.38c0,4.88,1.28,8.64,3.85,11.26,2.57,2.62,6.35,3.93,11.37,3.93s8.83-1.31,11.39-3.93c2.55-2.62,3.83-6.37,3.83-11.26v-7.38c0-4.9-1.28-8.68-3.85-11.33-2.57-2.65-6.36-3.97-11.37-3.97M688.47,430.27c0,2.74-.64,4.87-1.9,6.39-1.27,1.52-3.18,2.27-5.73,2.27s-4.44-.76-5.71-2.27c-1.27-1.51-1.9-3.64-1.9-6.39v-8.06c0-2.84.64-5.02,1.9-6.54,1.27-1.52,3.17-2.29,5.71-2.29s4.47.76,5.73,2.29c1.27,1.52,1.9,3.7,1.9,6.54v8.06Z"/>
                <polygon points="724.19 420.7 724.5 436.17 724.13 436.17 712.72 408.01 702.13 408.01 702.13 444.29 709.28 444.29 709.28 431.57 708.97 415.62 709.34 415.62 721.04 444.29 731.31 444.29 731.31 408.01 724.19 408.01 724.19 420.7"/>
                <path d="M593.45,456.33h-13.94v36.28h5.62v-11.64h8.29c4.16,0,7.21-.96,9.14-2.9,1.93-1.93,2.9-4.62,2.9-8.06v-2.75c0-3.45-.96-6.13-2.88-8.05-1.92-1.92-4.96-2.88-9.13-2.88M599.78,469.87c0,2.01-.52,3.57-1.55,4.7-1.03,1.13-2.68,1.69-4.95,1.69h-8.18v-15.25h8.23c2.25,0,3.89.55,4.91,1.65,1.02,1.1,1.53,2.68,1.53,4.74v2.47Z"/>
                <path d="M616.82,456.33l-11.13,36.28h5.76l2.94-10.14h13.68l2.94,10.14h5.77l-11.13-36.28h-8.83ZM615.76,477.76l5.12-17.63h.71l5.11,17.63h-10.94Z"/>
                <polygon points="635.35 461.09 646.03 461.09 646.03 492.61 651.73 492.61 651.73 461.09 662.38 461.09 662.38 456.33 635.35 456.33 635.35 461.09"/>
                <polygon points="690 471.54 673.88 471.54 673.88 456.33 668.17 456.33 668.17 492.61 673.88 492.61 673.88 476.31 690 476.31 690 492.61 695.71 492.61 695.71 456.33 690 456.33 690 471.54"/>
                <polygon points="734.66 481.51 733.47 487.84 732.98 487.84 731.85 481.51 727.36 457.24 719.07 457.24 714.56 481.51 713.42 487.84 712.97 487.84 711.78 481.51 707.21 456.33 701.39 456.33 708.6 492.61 717.48 492.61 721.09 472.82 722.99 461.95 723.45 461.95 725.35 472.82 728.98 492.61 737.84 492.61 745.02 456.33 739.23 456.33 734.66 481.51"/>
                <path d="M756.32,456.33l-11.13,36.28h5.76l2.94-10.14h13.68l2.94,10.14h5.76l-11.13-36.28h-8.83ZM755.27,477.76l5.11-17.63h.71l5.12,17.63h-10.94Z"/>
                <polygon points="797.8 456.33 791.64 469.53 789.09 475.52 788.72 475.52 786.16 469.53 779.97 456.33 773.95 456.33 786.1 481.35 786.1 492.61 791.7 492.61 791.7 481.35 803.82 456.33 797.8 456.33"/>
                <path d="M830.54,477.35c-.76-1.32-1.95-2.38-3.56-3.21-1.62-.82-3.74-1.57-6.37-2.23-2.22-.57-3.92-1.14-5.12-1.72-1.2-.58-2.04-1.25-2.51-2-.47-.76-.71-1.67-.71-2.73v-.11c0-1.02.24-1.9.71-2.63.47-.73,1.24-1.29,2.3-1.68,1.06-.39,2.47-.58,4.23-.58,2.25,0,4.28.27,6.08.81,1.8.54,3.39,1.21,4.77,2l-.51-5.19c-1.19-.62-2.71-1.19-4.56-1.69-1.85-.5-4.07-.75-6.66-.75-4.05,0-7.09.82-9.11,2.47-2.03,1.65-3.04,4-3.04,7.04v.29c0,2.03.38,3.71,1.14,5.07.76,1.35,1.96,2.48,3.62,3.38,1.66.9,3.83,1.68,6.52,2.34,2.04.49,3.66,1.01,4.85,1.55,1.19.54,2.04,1.18,2.54,1.93.5.75.75,1.7.75,2.85v.43c0,1.78-.62,3.11-1.87,3.99-1.25.88-3.2,1.32-5.85,1.32-2.33,0-4.49-.32-6.49-.97-2-.64-3.72-1.38-5.18-2.21l.54,5.59c.8.4,1.76.79,2.91,1.19,1.15.4,2.45.73,3.9.99,1.46.26,3.05.4,4.77.4,4.35,0,7.62-.86,9.79-2.58,2.17-1.72,3.26-4.26,3.26-7.61v-.57c0-2.14-.38-3.87-1.13-5.18"/>
              </g>
              <g>
                <path className="cls-1" d="M540.84,457.05c0,14.25-11.58,25.83-25.82,25.85-14.24-.01-25.82-11.6-25.82-25.85v-10.16h-13.12v10.16c0,21.49,17.43,38.94,38.92,38.97h0s.02,0,.02,0c0,0,.02,0,.02,0h0c21.48-.03,38.92-17.48,38.92-38.97v-10.16h-13.12v10.16Z"/>
                <polygon className="cls-1" points="515.02 431.22 540.84 446.89 561.71 435.35 555.19 423.61 533.15 435.79 545.92 414.14 534.38 407.38 521.7 428.84 521.7 403.98 515.04 403.98 514.99 403.98 508.33 403.98 508.33 428.84 495.66 407.38 484.11 414.14 496.89 435.79 474.84 423.61 468.33 435.35 489.19 446.89 515.02 431.22"/>
              </g>
            </svg>
          </div>

          <div className="nav-links">
            <button className={`nav-link ${page==="home"?"active":""}`} onClick={() => setPage("home")}>{t.navHome}</button>

            {/* APPRENTICE DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={`nav-dropdown-btn${(page==="checklist"||page==="careers"||page==="quiz")?" active":""}${apprenticeOpen?" open":""}`}
                onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); }}
                onBlur={() => setTimeout(() => setApprenticeOpen(false), 150)}
              >
                {lang==="es" ? "Aprendiz" : lang==="pl" ? "Praktykant" : "Apprentice"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {apprenticeOpen && (
                <div className="nav-dropdown-menu">
                  <div className={`nav-dropdown-item${page==="checklist"?" active":""}`} onMouseDown={() => { setPage("checklist"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Cómo Unirse" : lang==="pl" ? "Jak Dołączyć" : "How to Join"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Las 3 rutas reales de entrada" : lang==="pl" ? "3 prawdziwe drogi wejścia" : "The 3 real entry routes"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="locals"?" active":""}`} onMouseDown={() => { setPage("locals"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Entendiendo tu Local" : lang==="pl" ? "Rozumienie Oddziału" : "Understanding Your Local"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Jurisdicción, Libro 1 vs 2, trabajo de viaje" : lang==="pl" ? "Jurysdykcja, Księga 1 vs 2, praca w trasie" : "Jurisdiction, Book 1 vs 2, travel work & school"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="careers"?" active":""}`} onMouseDown={() => { setPage("careers"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Ścieżki Kariery" : "Career Paths"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "De aprendiz a maestro" : lang==="pl" ? "Od praktykanta do mistrza" : "Apprentice to journeyman"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="quiz"?" active":""}`} onMouseDown={() => { setPage("quiz"); setApprenticeOpen(false); resetQuiz(); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "¿Qué Oficio?" : lang==="pl" ? "Który Zawód?" : "Which Trade?"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Encuentra tu oficio ideal" : lang==="pl" ? "Znajdź swój idealny zawód" : "Find your perfect trade match"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="calculator"?" active":""}`} onMouseDown={() => { setPage("calculator"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Calculadora de Salarios" : lang==="pl" ? "Kalkulator Wynagrodzen" : "Wage Calculator"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Calcula tu paquete completo" : lang==="pl" ? "Oblicz swoj pelny pakiet" : "Calculate your full package value"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* LEARN DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={`nav-dropdown-btn${(page==="history"||page==="benefits"||page==="retirement"||page==="health"||page==="veterans")?" active":""}${learnOpen?" open":""}`}
                onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); }}
                onBlur={() => setTimeout(() => setLearnOpen(false), 150)}
              >
                {lang==="es" ? "Aprender" : lang==="pl" ? "Nauka" : "Learn"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {learnOpen && (
                <div className="nav-dropdown-menu">
                  <div className={`nav-dropdown-item${page==="history"?" active":""}`} onMouseDown={() => { setPage("history"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia Związkowa" : "Union History"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Cómo los sindicatos construyeron América" : lang==="pl" ? "Jak związki budowały Amerykę" : "How unions built America"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="benefits"?" active":""}`} onMouseDown={() => { setPage("benefits"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Świadczenia Związkowe" : "Union Benefits"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pensión, salud, anualidad y más" : lang==="pl" ? "Emerytura, zdrowie, renta i więcej" : "Pension, health, annuity & more"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="retirement"?" active":""}`} onMouseDown={() => { setPage("retirement"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Jubilación" : lang==="pl" ? "Emerytura" : "Retirement"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "401k vs Anualidad vs Pensión" : lang==="pl" ? "401k vs Renta vs Emerytura" : "401k vs Annuity vs Pension"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="health"?" active":""}`} onMouseDown={() => { setPage("health"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pagado por el contratista" : lang==="pl" ? "Płacone przez wykonawcę" : "Paid by your contractor"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="veterans"?" active":""}`} onMouseDown={() => { setPage("veterans"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Recursos para veteranos militares" : lang==="pl" ? "Zasoby dla weteranów wojskowych" : "Resources for military veterans"}</span>
                  </div>
                </div>
              )}
            </div>

            <button className={`nav-link ${page==="about"?"active":""}`} onClick={() => setPage("about")}>{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</button>
            <button className={`nav-link ${page==="contact"?"active":""}`} onClick={() => { setPage("contact"); setContactSent(false); }}>{t.navContact}</button>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
            <button className={`lang-btn ${lang==="en"?"active":""}`} onClick={() => setLang("en")}>EN</button>
            <button className={`lang-btn ${lang==="es"?"active":""}`} onClick={() => setLang("es")}>ES</button>
            <button className={`lang-btn ${lang==="pl"?"active":""}`} onClick={() => setLang("pl")}>PL</button>
            <button onClick={() => { setSearchOpen(true); setGlobalQuery(""); }} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--muted)", transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color="#FA8059"} onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>

          {/* TRADES DROPDOWN — only on home */}
          {page === "home" && (
          <div className="nav-right" ref={dropdownRef}>
            <button
              className={`nav-trades-btn ${dropdownOpen ? "open" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              All Trades · <span style={{color:"var(--yellow)"}}>{selectedTrade === "IBEW_I" ? "IBEW Inside" : selectedTrade === "IBEW_L" ? "IBEW Lineman" : selectedTrade === "IUEC" ? "Elevator" : selectedTrade === "HFIAW" ? "Insulators" : selectedTrade === "SF" ? "Sprinkler Fitters" : selectedTrade}</span>
              <svg className="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="trades-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">Union Construction Trades</span>
                  <span className="dropdown-sub">Select a trade to find your local</span>
                </div>

                <div className="dropdown-scroll-body" onWheel={e => e.stopPropagation()} onTouchMove={e => e.stopPropagation()}>
                {UNION_TRADES.map((group) => (
                  <div key={group.group} className="dropdown-group">
                    <div className="dropdown-group-label">{group.group}</div>
                    {group.trades.map((trade) => (
                      <div
                        key={trade.abbr + trade.name}
                        className={`dropdown-item ${trade.status === "active" ? "active" : "coming"} ${selectedTrade === trade.abbr ? "selected" : ""}`}
                        onClick={() => {
                          if (trade.status !== "active") return;
                          setSelectedTrade(trade.abbr);
                          setDropdownOpen(false);
                          setResults(null);
                          setQuery("");
                          setError("");
                          setTimeout(() => {
                            inputRef.current?.focus();
                            inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                          }, 100);
                        }}
                      >
                        <div className="trade-abbr-badge" style={trade.color ? { borderColor: trade.color + "55", color: trade.color } : {}}>
                          {trade.abbr}
                        </div>
                        <div className="trade-info">
                          <div className="trade-name">{trade.name}</div>
                          <div className="trade-full">{trade.full}</div>
                        </div>
                        <div className="trade-status">
                          {trade.status === "active" ? (
                            <span className="status-live">● Live</span>
                          ) : (
                            <span className="status-soon">Soon</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                </div>

                <div className="dropdown-footer">
                  {lang==="es" ? "Más oficios agregados regularmente · " : lang==="pl" ? "Nowe zawody dodawane regularnie · " : "More trades added regularly · "}
                  <a href="#" onClick={(e) => e.preventDefault()}>{lang==="es" ? "Solicitar un oficio" : lang==="pl" ? "Zaproponuj zawód" : "Request a trade"}</a>
                </div>
              </div>
            )}
          </div>
          )}
        </nav>

        {/* ── QUIZ PAGE ── */}
        {page === "quiz" && (
          <div className="page">
            <div className="page-eyebrow">{lang==="es" ? "Buscador de Carrera" : lang==="pl" ? "Znajdź Swój Zawód" : "Career Finder"}</div>
            <h1 className="page-title">{lang==="es" ? "¿Qué Oficio Es Para Ti?" : lang==="pl" ? "Który Zawód Jest dla Ciebie?" : "Which Trade Is Right For You?"}</h1>
            <p className="page-sub">{lang==="es" ? "Responde 5 preguntas rápidas y te dirigiremos hacia el oficio sindical que se adapta a tus habilidades e intereses." : lang==="pl" ? "Odpowiedz na 5 szybkich pytań, a wskaże Ci zawód związkowy pasujący do Twoich umiejętności i zainteresowań." : "Answer 5 quick questions and we'll point you toward the union trade that fits your skills and interests."}</p>

            {!quizResult ? (
              <>
                <div className="quiz-progress">
                  {QUIZ[lang].map((_, i) => <div key={i} className={`quiz-pip ${i <= quizStep ? "done" : ""}`} />)}
                </div>
                <div className="quiz-step-label">{lang === "es" ? `Pregunta ${quizStep + 1} de ${QUIZ[lang].length}` : lang === "pl" ? `Pytanie ${quizStep + 1} z ${QUIZ[lang].length}` : `Question ${quizStep + 1} of ${QUIZ[lang].length}`}</div>
                <div className="quiz-question">{QUIZ[lang][quizStep].q}</div>
                <div className="quiz-options">
                  {QUIZ[lang][quizStep].options.map((opt, i) => (
                    <button key={i} className="quiz-option" onClick={() => handleQuizAnswer(opt, i)}>
                      <span className="quiz-option-num">{String.fromCharCode(65+i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="quiz-result">
                {(() => {
                  const res = TRADE_RESULTS[lang][quizResult];
                  return (
                    <div className="result-card" style={{borderColor: res.color + "55", background: res.color + "08"}}>
                      <div className="result-badge" style={{color: res.color}}>{lang==="es" ? "✓ Tu Mejor Opción" : lang==="pl" ? "✓ Twoje Najlepsze Dopasowanie" : "✓ Your Best Match"}</div>
                      <div className="result-title">{res.icon} {res.name}</div>
                      <p className="result-why">{res.why}</p>
                      <div className="result-path">
                        <div className="result-path-title">{lang==="es" ? "Trayectoria Profesional" : lang==="pl" ? "Ścieżka Kariery" : "Career Path"}</div>
                        {res.path.map((step, i) => (
                          <div key={i} className="result-path-step">
                            <div className="step-dot" style={{background: res.color}} />
                            {step}
                          </div>
                        ))}
                      </div>
                      <div className="result-app-note">{res.apprenticeship}</div>
                      <div className="result-actions">
                        <button className="btn-primary" onClick={() => { setSelectedTrade(["IBEW_I","IBEW_L","UA","SMART","BAC","UBC","HFIAW","IW","LIUNA"].includes(quizResult) ? quizResult : "IBEW_I"); setPage("home"); }}>
                          {lang==="es" ? "Encontrar Mi Local Más Cercano →" : lang==="pl" ? "Znajdź Mój Najbliższy Oddział →" : "Find My Nearest Local →"}
                        </button>
                        <a className="btn-ghost" href={`https://www.${res.website}`} target="_blank" rel="noopener noreferrer">
                          {lang==="es" ? "Sitio Nacional" : lang==="pl" ? "Strona Krajowa" : "National Website"}
                        </a>
                        <button className="btn-ghost" onClick={resetQuiz}>
                          {lang==="es" ? "Volver a Tomar" : lang==="pl" ? "Powtórz Quiz" : "Retake Quiz"}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ── CAREER PATH PAGE ── */}
        {page === "careers" && (() => {
          const cd = CAREER_DATA[lang];
          return (
            <div className="page">
              <div className="page-eyebrow">{lang==="es" ? "Oficios Sindicales" : lang==="pl" ? "Zawody Związkowe" : "Union Trades"}</div>
              <h1 className="page-title">{cd.title}</h1>
              <p className="page-sub">{cd.sub}</p>

              <div className="career-stats">
                {cd.stats.map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="section-title">{lang==="es" ? "La Trayectoria" : lang==="pl" ? "Ścieżka Kariery" : "The Career Path"}</div>
              <div className="career-stages">
                {cd.stages.map((s, i) => (
                  <div key={i} className="career-stage">
                    <div className="stage-icon">{s.icon}</div>
                    <div className="stage-info">
                      <div className="stage-header">
                        <span className="stage-name">{s.stage}</span>
                        <span className="stage-years">{s.years}</span>
                        <span className="stage-pay">{s.pay}</span>
                      </div>
                      <div className="stage-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-title">{lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Świadczenia Związkowe" : "Union Benefits"}</div>
              <div className="benefits-grid">
                {cd.whyUnion.map((b, i) => (
                  <div key={i} className="benefit-card">
                    <div className="benefit-icon">{b.icon}</div>
                    <div className="benefit-label">{b.label}</div>
                    <div className="benefit-desc">{b.desc}</div>
                  </div>
                ))}
              </div>

              <div className="cta-banner">
                <h3>{lang==="es" ? "¿Listo para Comenzar?" : lang==="pl" ? "Gotowy, żeby Zacząć?" : "Ready to Get Started?"}</h3>
                <p>{lang==="es" ? "Encuentra el local sindical más cercano y da el primer paso hacia una carrera sindical." : lang==="pl" ? "Znajdź najbliższy oddział związkowy i zrób pierwszy krok w kierunku kariery związkowej." : "Find the local union nearest you and take the first step toward a union career."}</p>
                <button className="btn-primary" onClick={() => setPage("home")}>
                  {lang==="es" ? "Encontrar Mi Local Más Cercano →" : lang==="pl" ? "Znajdź Mój Najbliższy Oddział →" : "Find My Nearest Local →"}
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── HOME PAGE ── */}
        {page === "home" && (<>
        {/* HERO */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className={`hero-content ${heroVisible ? "visible" : ""}`}>
            <div className="hero-eyebrow">
              <span className="eyebrow-line" />
              {t.tagline}
              <span className="eyebrow-line" />
            </div>
            <h1 className="hero-title">
              {t.heroTitle1}<br />
              <span className="accent">{t.heroAccent}</span>
              {t.heroTitle2}
            </h1>
            <p className="hero-sub">{t.heroSub}</p>

            {/* NOTICE BANNER */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(250,128,89,0.1)",
              border: "1px solid rgba(250,128,89,0.25)",
              borderRadius: 50, padding: "8px 18px",
              marginBottom: 24, fontSize: 13, color: "var(--muted)"
            }}>
              <span style={{color: "#FA8059", fontSize: 16}}>🔄</span>
              {lang === "es"
                ? "Locales sindicales se agregan y actualizan continuamente."
                : lang === "pl"
                ? "Oddziały są stale dodawane i aktualizowane. Dziękujemy!"
                : "Union locals are continuously being added & updated — thank you for your patience!"}
            </div>

            {/* SEARCH CARD */}
            <div className="search-card">
              {/* INLINE TRADE SELECTOR */}
              <div className="trade-selector">
                {[
                  { abbr: "IBEW_I", label: "IBEW Inside",   color: "#F5C518" },
                  { abbr: "IBEW_L", label: "IBEW Lineman",  color: "#FFD700" },
                  { abbr: "UA",     label: "Plumbers & Pipefitters", color: "#3b9eff" },
                  { abbr: "BAC",    label: "Bricklayers",   color: "#f97316" },
                  { abbr: "IW",     label: "Ironworkers",   color: "#ef4444" },
                  { abbr: "HFIAW", label: "Insulators",    color: "#a855f7" },
                  { abbr: "IUEC",  label: "Elevators",    color: "#06b6d4" },
                  { abbr: "IUOE",  label: "Operating Engineers", color: "#10b981" },
                ].map(trade => (
                  <button
                    key={trade.abbr}
                    className={`trade-pill ${selectedTrade === trade.abbr ? "selected" : ""}`}
                    style={selectedTrade === trade.abbr ? { background: "#FA8059", borderColor: "#FA8059", color: "#000" } : {}}
                    onClick={() => setSelectedTrade(trade.abbr)}
                  >
                    {trade.label}
                  </button>
                ))}
              </div>
              <span className="search-label">
                {selectedTrade === "UA" ? t.uaLabel : selectedTrade === "SMART" ? t.smartLabel : selectedTrade === "BAC" ? t.bacLabel : selectedTrade === "UBC" ? t.ubcLabel : selectedTrade === "LIUNA" ? t.liunaLabel : selectedTrade === "IW" ? t.iwLabel : selectedTrade === "IBEW_L" ? t.ibewLinLabel : selectedTrade === "IUEC" ? t.iuecLabel : selectedTrade === "IUOE" ? "Operating Engineers" : selectedTrade === "HFIAW" ? t.hfiawLabel : selectedTrade === "SF" ? t.sfLabel : t.ibewLabel}
                {" "}{t.searchLabel}
              </span>
              <div className="search-row">
                <input
                  ref={inputRef}
                  className="search-input"
                  type="text"
                  placeholder={lang==="es" ? "ej. 60614 o Chicago, IL" : lang==="pl" ? "np. 60614 lub Chicago, IL" : "e.g. 60614 or Chicago, IL"}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button className="btn-search" onClick={() => handleSearch()} disabled={loading || !query.trim()}>
                  {loading ? <span className="spinner" /> : t.searchBtn}
                </button>
              </div>

              <div className="search-divider">{lang==="es" ? "o" : lang==="pl" ? "lub" : "or"}</div>

              <button className="btn-geo" onClick={handleGeolocate} disabled={geoLoading}>
                {geoLoading ? (
                  <><span className="spinner" /> {t.locating}</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
                    </svg>
                    {t.geoBtn}
                  </>
                )}
              </button>

              {error && <div className="error-msg">{t.errorMsg}</div>}
            </div>
          </div>
        </section>

        {/* RESULTS */}
        {results && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-title"><span>{results.length}</span> {t.nearYou}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div className="results-location">📍 {locationLabel}</div>
                <button
                  className={"map-toggle-btn" + (showMap ? " active" : "")}
                  onClick={() => setShowMap(v => !v)}
                >
                  {showMap ? "🖺️ List" : "🗺️ Map"}
                </button>
              </div>
            </div>
            {showMap && (
              <div id="union-map" className="map-container" />
            )}
            {!showMap && results.map((local, i) => (
              <div className="local-card" key={`${local.id}-${i}`}>
                <div className="card-rank">#{i + 1}</div>
                <div className="card-body">
                  <div className="card-name">{local.name}</div>
                  <div className="card-location">{local.city}, {local.state}</div>
                  <div className="card-info">
                    {local.phone && (
                      <span className="info-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14h0z"/>
                        </svg>
                        <a href={`tel:${local.phone}`} style={{color:"inherit",textDecoration:"none"}}>{local.phone}</a>
                      </span>
                    )}
                    <span className="info-chip">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address || local.city + ", " + local.state)}`} target="_blank" rel="noopener noreferrer" style={{color:"inherit",textDecoration:"none"}}>{local.address || `${local.city}, ${local.state}`}</a>
                    </span>
                  </div>
                  <div className="card-actions">
                    {local.website && (
                      <a className="btn-website" href={`https://${local.website}`} target="_blank" rel="noopener noreferrer">
                        {t.visitWebsite}
                      </a>
                    )}
                    {local.email && (
                      <a className="btn-website" href={`mailto:${local.email}`} style={{background:"rgba(59,158,255,0.08)", borderColor:"rgba(59,158,255,0.3)", color:"#3b9eff"}}>
                        ✉ Email Local
                      </a>
                    )}
                    <button className="btn-share" onClick={() => {
                      const text = `${local.name} — ${local.city}, ${local.state}${local.phone ? ` | ${local.phone}` : ""}${local.website ? ` | https://${local.website}` : ""} | Found on Union Pathways`;
                      if (navigator.share) {
                        navigator.share({ title: local.name, text });
                      } else {
                        navigator.clipboard.writeText(text).then(() => alert(lang==="es" ? "¡Info copiada!" : lang==="pl" ? "Skopiowano informacje!" : "Local info copied!"));
                      }
                    }}>
                      {lang==="es" ? "Compartir" : lang==="pl" ? "Udostępnij" : "Share"}
                    </button>
                    <button className="btn-correction" onClick={() => {
                      setPage("contact");
                      setContactSent(false);
                      setTimeout(() => setContactForm(f => ({
                        ...f,
                        subject: "local-info",
                        message: `I'd like to submit a correction or update for:\n\n${local.name}\n${local.city}, ${local.state}\n\nCorrection:\n`
                      })), 100);
                    }}>
                      {lang==="es" ? "✏ Sugerir una Corrección" : lang==="pl" ? "✏ Zaproponuj Korektę" : "✏ Suggest a Correction"}
                    </button>
                  </div>
                </div>
                <div className="card-distance">
                  {i === 0 && <div className="nearest-badge">{t.nearest}</div>}
                  <div className="distance-num">{Math.round(local.distance)}</div>
                  <div className="distance-unit">{t.milesAway}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRADES BANNER */}
        {!results && (
          <div style={{
            maxWidth: 860, margin: "0 auto 64px", padding: "0 24px",
            textAlign: "center"
          }}>
            {/* Stats Row */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 12,
              flexWrap: "wrap", marginBottom: 32
            }}>
              {[
                { num: "1,000+", label: lang==="es" ? "Locales sindicales" : lang==="pl" ? "Oddziałów związkowych" : "Union Locals" },
                { num: "17", label: lang==="es" ? "Oficios de construcción" : lang==="pl" ? "Zawodów budowlanych" : "Construction Trades" },
                { num: "50", label: lang==="es" ? "Estados cubiertos" : lang==="pl" ? "Stanów objętych" : "States Covered" },
                { num: "$0", label: lang==="es" ? "Costo para usar" : lang==="pl" ? "Koszt korzystania" : "Cost to Use" },
              ].map(({ num, label }) => (
                <div key={label} style={{
                  background: "rgba(245,197,24,0.06)",
                  border: "1px solid rgba(245,197,24,0.18)",
                  borderRadius: 12, padding: "18px 28px",
                  minWidth: 130, flex: "1 1 120px", maxWidth: 180
                }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 36, fontWeight: 900,
                    color: "var(--yellow)", lineHeight: 1
                  }}>{num}</div>
                  <div style={{
                    fontSize: 12, color: "var(--muted)",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    marginTop: 6, fontWeight: 600
                  }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 22, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--text)", marginBottom: 10
            }}>
              {lang==="es"
                ? "Hecho por trabajadores del oficio, para trabajadores del oficio"
                : lang==="pl"
                ? "Stworzone przez rzemieślników, dla rzemieślników"
                : "Built by union tradespeople, for union tradespeople"}
            </div>
            <p style={{
              fontSize: 14, color: "var(--muted)",
              lineHeight: 1.7, maxWidth: 560, margin: "0 auto"
            }}>
              {lang==="es"
                ? "Union Pathways es un recurso gratuito, sin publicidad y sin afiliación. Solo datos reales para ayudarte a encontrar tu local más cercano."
                : lang==="pl"
                ? "Union Pathways to bezpłatne, wolne od reklam i bezstronne narzędzie. Tylko prawdziwe dane, które pomogą Ci znaleźć najbliższy oddział."
                : "Union Pathways is free and unaffiliated. Just real data to help you find your nearest local and start your career in the trades."}
            </p>
          </div>
        )}
        </>)}

        {/* ── JOIN A UNION CHECKLIST PAGE ── */}
        {page === "checklist" && (
          <div>
            {/* HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">The Real Path Into the Trades</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Cómo Unirse a un "}<span className="accent">Oficio Sindical</span></> : lang==="pl" ? <>{"Jak Dołączyć do "}<span className="accent">Zawodu Związkowego</span></> : <>{"How to Join a "}<span className="accent">Union Trade</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Sin cursos, sin intermediarios, sin relleno. Así es como la gente realmente entra a los oficios sindicales." : lang==="pl" ? "Bez kursów, bez pośredników, bez lania wody. Oto jak ludzie naprawdę wchodzą do związkowych zawodów budowlanych." : "No courses, no funnels, no fluff. This is how people actually get into the union trades."}
              </p>
            </div>

            {/* 3 ROUTES */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Las 3 Rutas "}<span className="accent">Reales</span>{" de Entrada"}</> : lang==="pl" ? <>{"3 Prawdziwe "}<span className="accent">Drogi</span>{" Wejścia"}</> : <>{"The 3 "}<span className="accent">Real</span>{" Entry Routes"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Clasificadas por efectividad — así es como la gente realmente entra." : lang==="pl" ? "Uszeregowane według skuteczności — tak ludzie naprawdę wchodzą do zawodów." : "Ranked by effectiveness — this is how people actually get in."}</div>

              <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
                {/* ROUTE 1 */}
                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:"20px", padding:"28px 32px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px"}}>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FA8059", marginBottom:"6px"}}>{lang==="es" ? "01 — Mejor Opción" : lang==="pl" ? "01 — Najlepsza Opcja" : "01 — Best Option"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Aprendizaje Directo" : lang==="pl" ? "Bezpośrednia Praktyka" : "Direct Apprenticeship"}</div>
                    </div>
                  </div>
                  <p style={{fontSize:"15px", color:"var(--muted)", lineHeight:"1.7", marginBottom:"16px"}}>
                    {lang==="es" ? "Este es el estándar de oro. Aplicas directamente al programa de formación de un sindicato. Ganas mientras aprendes — sin deuda estudiantil. Sin intermediarios." : lang==="pl" ? "To złoty standard. Aplikujesz bezpośrednio do programu szkoleniowego związku. Zarabiasz ucząc się — bez długu studenckiego. Bez pośredników." : "This is the gold standard. You apply straight to a union's training program. You earn while you learn — no student debt. No middleman."}
                  </p>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"12px"}}>
                    {[
                      { label: lang==="es" ? "Proceso" : lang==="pl" ? "Proces" : "Process", val: lang==="es" ? "Solicitud → Prueba → Entrevista → Lista de espera → Empezar" : lang==="pl" ? "Wniosek → Test → Rozmowa → Lista oczekujących → Start" : "Apply → Aptitude Test → Interview → Waitlist → Start Working" },
                      { label: lang==="es" ? "Salario Inicial" : lang==="pl" ? "Wynagrodzenie Startowe" : "Starting Pay", val: "$18–$25/hr" },
                      { label: lang==="es" ? "Salario Oficial" : lang==="pl" ? "Wynagrodzenie Czeladnika" : "Journeyman Pay", val: "$35–$75/hr+" },
                      { label: lang==="es" ? "Por qué es #1" : lang==="pl" ? "Dlaczego #1" : "Why It's #1", val: lang==="es" ? "Es el pipeline real. Sin intermediarios." : lang==="pl" ? "To prawdziwy pipeline. Bez pośredników." : "It's the actual pipeline. No middleman." },
                    ].map((item, i) => (
                      <div key={i} style={{background:"rgba(0,0,0,0.2)", borderRadius:"10px", padding:"12px 16px"}}>
                        <div style={{fontSize:"11px", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", color:"#FA8059", marginBottom:"4px"}}>{item.label}</div>
                        <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.5"}}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROUTE 2 */}
                <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"28px 32px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px"}}>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"6px"}}>{lang==="es" ? "02 — Buen Atajo" : lang==="pl" ? "02 — Dobry Skrót" : "02 — Good Shortcut"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Programas de Pre-Aprendizaje" : lang==="pl" ? "Programy Przed-Praktyczne" : "Pre-Apprenticeship Programs"}</div>
                    </div>
                  </div>
                  <p style={{fontSize:"15px", color:"var(--muted)", lineHeight:"1.7", marginBottom:"16px"}}>
                    {lang==="es" ? "Programas legítimos que te ayudan a entrar más rápido a los sindicatos. A menudo dirigidos por colegios comunitarios, organizaciones sin fines de lucro y asociaciones sindicales." : lang==="pl" ? "Legalne programy, które pomagają szybciej wejść do związków. Często prowadzone przez community college, organizacje non-profit i partnerstwa związkowe." : "Legit programs that help you get into unions faster. Often run by community colleges, nonprofits, and union partnerships."}
                  </p>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"12px"}}>
                    {[
                      { label: lang==="es" ? "Qué Hacen" : lang==="pl" ? "Co Robią" : "What They Do", val: lang==="es" ? "Enseñan habilidades básicas, ayudan a pasar pruebas de ingreso, a veces dan entrada directa" : lang==="pl" ? "Uczą podstawowych umiejętności, pomagają zdać testy wstępne, czasem dają bezpośrednie wejście" : "Teach basic skills, help you pass entry tests, sometimes give direct entry or priority" },
                      { label: lang==="es" ? "Quién las Ofrece" : lang==="pl" ? "Kto Je Oferuje" : "Who Offers Them", val: lang==="es" ? "Colegios comunitarios, organizaciones sin fines de lucro, centros de formación sindicales" : lang==="pl" ? "Community college, organizacje non-profit, związkowe centra szkoleniowe" : "Community colleges, nonprofits, union training centers" },
                    ].map((item, i) => (
                      <div key={i} style={{background:"rgba(0,0,0,0.2)", borderRadius:"10px", padding:"12px 16px"}}>
                        <div style={{fontSize:"11px", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"4px"}}>{item.label}</div>
                        <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.5"}}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROUTE 3 */}
                <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"28px 32px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px"}}>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"6px"}}>{lang==="es" ? "03 — La Ruta Alternativa" : lang==="pl" ? "03 — Droga Alternatywna" : "03 — The Alternative Route"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "No Sindical a Sindical" : lang==="pl" ? "Niezwiązkowy do Związkowego" : "Non-Union to Union"}</div>
                    </div>
                  </div>
                  <p style={{fontSize:"15px", color:"var(--muted)", lineHeight:"1.7", marginBottom:"16px"}}>
                    {lang==="es" ? "Empieza con una empresa no sindical, gana 6-18 meses de experiencia, y luego aplica al sindicato con esa experiencia — una gran ventaja. Esta es la ruta que tomó el fundador de Union Pathways." : lang==="pl" ? "Zacznij w firmie niezwiązkowej, zdobądź 6-18 miesięcy doświadczenia, a następnie aplikuj do związku z tym doświadczeniem — ogromna przewaga. To droga, którą obrał założyciel Union Pathways." : "Start with a non-union company, gain 6–18 months of experience, then apply to the union with that experience — a huge advantage. This is the route Union Pathways' founder took."}
                  </p>
                  <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.7"}}>
                    {lang==="es" ? "Funciona especialmente bien en: carpintería, obreros, concreto, techos, electricidad residencial." : lang==="pl" ? "Działa szczególnie dobrze w: ciesielstwie, robotnikach, betonie, pokryciach dachowych, elektryce mieszkaniowej." : "Works especially well in: carpentry, laborers, concrete, roofing, residential electrical."}
                  </div>
                </div>
              </div>
            </div>

            <hr className="divider-line"/>

            {/* STEP BY STEP */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Guía Paso a Paso — "}<span className="accent">Este Mes</span></> : lang==="pl" ? <>{"Przewodnik Krok po Kroku — "}<span className="accent">W Tym Miesiącu</span></> : <>{"Step-by-Step — "}<span className="accent">Start This Month</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Si quisieras empezar este mes, esto es exactamente lo que debes hacer." : lang==="pl" ? "Jeśli chcesz zacząć w tym miesiącu, oto dokładnie co powinieneś zrobić." : "If you wanted to start this month, here's exactly what to do."}</div>

              <div className="timeline">
                {[
                  {
                    year: lang==="es" ? "Paso 1" : lang==="pl" ? "Krok 1" : "Step 1",
                    event: lang==="es" ? "Elige un Oficio — No te Lo Saltes" : lang==="pl" ? "Wybierz Zawód — Nie Pomijaj Tego" : "Pick a Trade — Don't Skip This",
                    desc: lang==="es" ? "Los oficios de mayor demanda: Electricista (IBEW), Plomero/Pipefitter (UA), HVAC, Carpintero, Obrero. Usa el quiz de Union Pathways si no estás seguro." : lang==="pl" ? "Zawody o największym popycie: Elektryk (IBEW), Hydraulik/Instalator (UA), HVAC, Cieśla, Robotnik. Użyj quizu Union Pathways, jeśli nie jesteś pewien." : "Top high-demand trades: Electrician (IBEW), Plumber/Pipefitter (UA), HVAC, Carpenter, Laborer. Use the Union Pathways quiz if you're unsure."
                  },
                  {
                    year: lang==="es" ? "Paso 2" : lang==="pl" ? "Krok 2" : "Step 2",
                    event: lang==="es" ? "Aplica Directamente al Aprendizaje" : lang==="pl" ? "Aplikuj Bezpośrednio do Praktyki" : "Apply Directly to Apprenticeship",
                    desc: lang==="es" ? "Busca: tu ciudad + aprendizaje sindical o ve directamente a los centros de formación sindical. Usa la función de búsqueda de Union Pathways para encontrar tu local más cercano." : lang==="pl" ? "Szukaj: twoje miasto + praktyka związkowa lub idź bezpośrednio do związkowych centrów szkoleniowych. Użyj funkcji wyszukiwania Union Pathways, aby znaleźć najbliższy lokal." : "Search: YOUR CITY + union apprenticeship or go straight to union training centers. Use Union Pathways search to find your nearest local."
                  },
                  {
                    year: lang==="es" ? "Paso 3" : lang==="pl" ? "Krok 3" : "Step 3",
                    event: lang==="es" ? "Prepárate para la Prueba de Aptitud y Entrevista" : lang==="pl" ? "Przygotuj się na Test Predyspozycji i Rozmowę" : "Prepare for the Aptitude Test & Interview",
                    desc: lang==="es" ? "La mayoría requiere: matemáticas básicas, comprensión lectora, y confiabilidad (factor enorme). Practica álgebra básica y fracciones — eso es lo que más importa en la prueba." : lang==="pl" ? "Większość wymaga: podstawowej matematyki, rozumienia czytanego tekstu i niezawodności (ogromny czynnik). Ćwicz podstawową algebrę i ułamki — to jest najważniejsze w teście." : "Most require: basic math, reading comprehension, and reliability (huge factor). Practice basic algebra and fractions — that's what matters most on the test."
                  },
                  {
                    year: lang==="es" ? "Paso 4" : lang==="pl" ? "Krok 4" : "Step 4",
                    event: lang==="es" ? "Aplica a MÚLTIPLES Sindicatos" : lang==="pl" ? "Aplikuj do WIELU Związków" : "Apply to MULTIPLE Unions",
                    desc: lang==="es" ? "No esperes en uno solo — aplica a 3-5 al mismo tiempo. Esto solo puede reducir el tiempo de espera por meses o incluso años. Algunos sindicatos tienen listas de espera más cortas que otros." : lang==="pl" ? "Nie czekaj na jeden — aplikuj do 3-5 jednocześnie. Sam ten krok może skrócić czas oczekiwania o miesiące lub nawet lata. Niektóre związki mają krótsze listy oczekujących niż inne." : "Don't wait on one — apply to 3–5 at once. This alone can cut your wait time by months or years. Some unions have shorter waitlists than others."
                  },
                  {
                    year: lang==="es" ? "Paso 5" : lang==="pl" ? "Krok 5" : "Step 5 (Optional but Powerful)",
                    event: lang==="es" ? "Trabaja en Construcción Mientras Esperas" : lang==="pl" ? "Pracuj w Budownictwie Podczas Oczekiwania" : "Work Construction While You Wait",
                    desc: lang==="es" ? "Mientras esperas: consigue un trabajo de obrero. Construye experiencia y conexiones. Cuando apliques con experiencia, tienes una gran ventaja sobre alguien que nunca ha tocado una herramienta." : lang==="pl" ? "Podczas oczekiwania: zdobądź pracę robotnika. Buduj doświadczenie i kontakty. Gdy aplikujesz z doświadczeniem, masz ogromną przewagę nad kimś, kto nigdy nie dotknął narzędzia." : "While waiting: get a laborer job. Build experience and connections. When you apply with experience, you have a huge advantage over someone who has never touched a tool."
                  },
                ].map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot"/>
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-event">{item.event}</div>
                    <div className="timeline-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line"/>

            {/* WHAT ACTUALLY MATTERS */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Lo que "}<span className="accent">Realmente Importa</span></> : lang==="pl" ? <>{"Co "}<span className="accent">Naprawdę Ma Znaczenie</span></> : <>{"What "}<span className="accent">Actually Matters</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "La verdad que la mayoría de la gente no sabe." : lang==="pl" ? "Prawda, której większość ludzi nie zna." : "The truth most people miss."}</div>

              <div className="impact-grid">
                <div className="impact-card" style={{borderColor:"rgba(250,128,89,0.2)"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"14px",textTransform:"uppercase"}}>01</div>
                  <div className="impact-title">{lang==="es" ? "Lo que les Importa a los Sindicatos" : lang==="pl" ? "Co Interesuje Związki" : "What Unions Actually Care About"}</div>
                  <div className="impact-desc">{lang==="es" ? "Presentarse — pasar las pruebas — disposición para trabajar — a veces conocer a alguien. Los sindicatos no se preocupan si tomaste un curso en línea o viste videos de entrenamiento." : lang==="pl" ? "Pojawianie się — zdawanie testów — gotowość do pracy — czasem znajomość kogoś. Związki nie dbają o to, czy wziąłeś kurs online lub oglądałeś filmy szkoleniowe." : "Showing up — passing tests — willingness to work — sometimes knowing someone. Unions don't care if you took an online course or watched training videos."}</div>
                </div>
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>02</div>
                  <div className="impact-title">{lang==="es" ? "La Realidad de las Listas de Espera" : lang==="pl" ? "Rzeczywistość List Oczekujących" : "The Waitlist Reality"}</div>
                  <div className="impact-desc">{lang==="es" ? "Los pipelines sindicales pueden ser competitivos, lentos y dependientes del momento y las conexiones. Aplica pronto. Aplica a múltiples. Y trabaja mientras esperas." : lang==="pl" ? "Związkowe pipeline mogą być konkurencyjne, powolne i zależne od czasu i kontaktów. Aplikuj wcześnie. Aplikuj do wielu. I pracuj podczas oczekiwania." : "Union pipelines can be competitive, slow, and dependent on timing and connections. Apply early. Apply to multiple. And work while you wait."}</div>
                </div>
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>03</div>
                  <div className="impact-title">{lang==="es" ? "Ve Directamente a la Fuente" : lang==="pl" ? "Idź Bezpośrednio do Źródła" : "Go Straight to the Source"}</div>
                  <div className="impact-desc">{lang==="es" ? "Las plataformas solo de información — incluyendo esta — pueden enseñarte sobre el sistema. Pero los verdaderos guardianes son los locales sindicales, los centros de aprendizaje y los contratistas. Ve a verlos en persona." : lang==="pl" ? "Platformy tylko informacyjne — w tym ta — mogą nauczyć Cię o systemie. Ale prawdziwymi strażnikami są lokale związkowe, centra praktyk i wykonawcy. Idź do nich osobiście." : "Info-only platforms — including this one — can teach you about the system. But the real gatekeepers are union locals, apprenticeship centers, and contractors. Go see them in person."}</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">{lang==="es" ? '"Fui a una agencia temporal que me emparejó con una empresa eléctrica residencial no sindical. Después de 8 meses viendo la diferencia, di el salto al IBEW. Empecé como CW, completé el aprendizaje, me convertí en oficial y ahora soy superintendente. El mejor movimiento que hice."' : lang==="pl" ? '"Poszedłem do agencji pracy tymczasowej, która przydzieliła mnie do niezwiązkowej firmy elektrycznej. Po 8 miesiącach widzenia różnicy przeszedłem do IBEW. Zacząłem jako CW, ukończyłem praktykę, zostałem czeladnikiem i teraz jestem superintendentem. Najlepszy ruch, jaki zrobiłem."' : '"I went to a temp agency that paired me with a non-union residential electrical company. After 8 months seeing the difference, I made the jump to the IBEW. Started as a CW, completed the apprenticeship, became a journeyman, and now I work as a superintendent. Best move I ever made."'}</div>
                <div className="quote-author">— Noah, {lang==="es" ? "Fundador de Union Pathways" : lang==="pl" ? "Założyciel Union Pathways" : "Founder of Union Pathways"}</div>
              </div>

              <div style={{textAlign:"center", marginTop:48}}>
                <button className="btn-primary" onClick={() => setPage("home")}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {page === "history" && (
          <div>
            {/* HISTORY HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "🏗️ La Base de la Clase Media Americana" : lang==="pl" ? "🏗️ Fundament Amerykańskiej Klasy Średniej" : "🏗️ The Foundation of the American Middle Class"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{lang==="es"?"Construido por ":""}<span className="accent">Manos Sindicales</span></> : lang==="pl" ? <>{"Zbudowane przez "}<span className="accent">Związkowe Ręce</span></> : <>{"Built by "}<span className="accent">Union Hands</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "La semana laboral de 40 horas. El fin de semana. Las leyes contra el trabajo infantil. La seguridad laboral. Los beneficios de salud. La jubilación. Todo fue luchado — y ganado — por trabajadores sindicalizados." : lang==="pl" ? "40-godzinny tydzień pracy. Weekend. Prawa chroniące dzieci przed pracą. Bezpieczeństwo w pracy. Ubezpieczenie zdrowotne. Emerytura. O wszystko to walczyli — i wywalczyli — związkowcy." : "The 40-hour work week. The weekend. Child labor laws. Workplace safety. Health benefits. Retirement. Every one of these was fought for — and won — by union workers."}
              </p>
              <div className="history-stats">
                {[
                  { num: "150+", label: lang==="es" ? "Años Luchando por los Trabajadores" : lang==="pl" ? "Lat Walki o Prawa Pracowników" : "Years of Fighting for Workers" },
                  { num: "6M+", label: lang==="es" ? "Miembros Sindicales en EE.UU." : lang==="pl" ? "Członków Związków w USA" : "Union Members in the US" },
                  { num: "18%", label: lang==="es" ? "Salarios Más Altos para Sindicalistas" : lang==="pl" ? "Wyższe Wynagrodzenia dla Związkowców" : "Higher Wages for Union Workers" },
                  { num: "$0", label: lang==="es" ? "Costo para Unirse a un Aprendizaje" : lang==="pl" ? "Koszt Dołączenia do Praktyki" : "Cost to Join an Apprenticeship" },
                ].map(s => (
                  <div key={s.label} className="history-stat">
                    <div className="history-stat-num">{s.num}</div>
                    <div className="history-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <><span className="accent">Línea de Tiempo</span>{" del Movimiento Laboral"}</> : lang==="pl" ? <><span className="accent">Oś Czasu</span>{" Ruchu Pracowniczego"}</> : <>{"A "}<span className="accent">Timeline</span>{" of the Labor Movement"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Desde las primeras huelgas hasta la legislación histórica — así construyeron América los sindicatos." : lang==="pl" ? "Od pierwszych strajków do przełomowego ustawodawstwa — tak związki budowały Amerykę." : "From the first strikes to landmark legislation — here's how unions built America."}</div>
              <div className="timeline">
                {[
                  { year: "1794", event: lang==="es" ? "Se Forma el Primer Sindicato Americano" : lang==="pl" ? "Powstaje Pierwszy Amerykański Związek Zawodowy" : "First American Union Formed", desc: lang==="es" ? "La Sociedad Federal de Zapateros Oficiales se forma en Filadelfia — considerada el primer sindicato en los Estados Unidos. Los trabajadores se unieron para exigir salarios justos y mejores condiciones." : lang==="pl" ? "Federalne Towarzystwo Czeladników Szewskich powstaje w Filadelfii — uważane za pierwszy związek zawodowy w Stanach Zjednoczonych. Pracownicy zjednoczyli się, aby domagać się sprawiedliwych płac i lepszych warunków pracy." : "The Federal Society of Journeymen Cordwainers forms in Philadelphia — considered the first trade union in the United States. Workers united to demand fair wages and better conditions." },
                  { year: "1869", event: lang==="es" ? "Fundación de los Caballeros del Trabajo" : lang==="pl" ? "Założenie Rycerzy Pracy" : "Knights of Labor Founded", desc: lang==="es" ? "Una de las primeras organizaciones laborales importantes en EE.UU. abre sus puertas a todos los trabajadores independientemente de su raza, género o nivel de habilidad. Una idea radical para la época." : lang==="pl" ? "Jedna z pierwszych głównych organizacji pracowniczych w USA otwiera swoje drzwi dla wszystkich pracowników niezależnie od rasy, płci czy poziomu umiejętności. Radykalna idea jak na tamte czasy." : "One of the first major labor organizations in the US opens its doors to all workers regardless of race, gender, or skill level. A radical idea for the time." },
                  { year: "1886", event: lang==="es" ? "El Asunto de Haymarket" : lang==="pl" ? "Sprawa Haymarket" : "The Haymarket Affair", desc: lang==="es" ? "Los trabajadores de Chicago hacen huelga por la jornada de 8 horas. Un punto de inflexión en la historia laboral que galvanizó el movimiento y eventualmente llevó al estándar de 8 horas en todo el mundo." : lang==="pl" ? "Robotnicy z Chicago strajkują o 8-godzinny dzień pracy. Punkt zwrotny w historii pracy, który zjednoczył ruch i ostatecznie doprowadził do 8-godzinnego standardu na całym świecie." : "Chicago workers strike for the 8-hour workday. A turning point in labor history that galvanized the movement and eventually led to the 8-hour standard worldwide." },
                  { year: "1886", event: lang==="es" ? "Fundación de la AFL" : lang==="pl" ? "Założenie AFL" : "AFL Founded", desc: lang==="es" ? "Samuel Gompers funda la Federación Americana del Trabajo, organizando a trabajadores calificados en sindicatos — el modelo que aún existe hoy en la construcción." : lang==="pl" ? "Samuel Gompers zakłada Amerykańską Federację Pracy, organizując wykwalifikowanych rzemieślników w związki zawodowe — model, który istnieje do dziś w budownictwie." : "Samuel Gompers founds the American Federation of Labor, organizing skilled craft workers into trade unions — the model that still exists today in construction." },
                  { year: "1911", event: lang==="es" ? "Incendio de la Fábrica Triangle" : lang==="pl" ? "Pożar w Fabryce Triangle" : "Triangle Shirtwaist Fire", desc: lang==="es" ? "146 trabajadores textiles mueren en Nueva York porque las salidas de emergencia estaban cerradas. La tragedia conmocionó a la nación y llevó directamente a una importante legislación de seguridad laboral." : lang==="pl" ? "146 pracowników odzieżowych ginie w Nowym Jorku, ponieważ wyjścia awaryjne były zamknięte. Tragedia wstrząsnęła krajem i doprowadziła bezpośrednio do ważnego ustawodawstwa dotyczącego bezpieczeństwa w pracy." : "146 garment workers die in New York City because fire exits were locked. The tragedy shocked the nation and led directly to major workplace safety legislation." },
                  { year: "1935", event: lang==="es" ? "La Ley Wagner" : lang==="pl" ? "Ustawa Wagnera" : "The Wagner Act", desc: lang==="es" ? "El Congreso aprueba la Ley Nacional de Relaciones Laborales, garantizando a los trabajadores el derecho a organizarse, unirse a sindicatos y negociar colectivamente. Un momento decisivo." : lang==="pl" ? "Kongres uchwala Krajową Ustawę o Stosunkach Pracy, gwarantując pracownikom prawo do organizowania się, wstępowania do związków i zbiorowego negocjowania. Przełomowy moment." : "Congress passes the National Labor Relations Act, guaranteeing workers the right to organize, join unions, and engage in collective bargaining. A watershed moment." },
                  { year: "1938", event: lang==="es" ? "La Ley de Normas Laborales Justas" : lang==="pl" ? "Ustawa o Uczciwych Standardach Pracy" : "The Fair Labor Standards Act", desc: lang==="es" ? "Se establece el salario mínimo federal. La semana laboral de 40 horas se convierte en ley. El trabajo infantil se restringe severamente. Se exige el pago de horas extras. Los sindicatos hicieron que esto sucediera." : lang==="pl" ? "Ustanowiono federalną płacę minimalną. 40-godzinny tydzień pracy stał się prawem. Praca dzieci została poważnie ograniczona. Wprowadzono obowiązkowe wynagrodzenie za nadgodziny. Związki zawodowe to umożliwiły." : "The federal minimum wage is established. The 40-hour work week becomes law. Child labor is severely restricted. Overtime pay is mandated. Unions made this happen." },
                  { year: "1955", event: lang==="es" ? "Fusión AFL-CIO" : lang==="pl" ? "Fuzja AFL-CIO" : "AFL-CIO Merger", desc: lang==="es" ? "La AFL y el CIO se fusionan en la federación laboral más poderosa de la historia americana, representando a 15 millones de trabajadores y remodelando el panorama político." : lang==="pl" ? "AFL i CIO łączą się w najpotężniejszą federację pracowniczą w historii Ameryki, reprezentując 15 milionów pracowników i zmieniając krajobraz polityczny." : "The AFL and CIO merge into the most powerful labor federation in American history, representing 15 million workers and reshaping the political landscape." },
                  { year: "1970", event: lang==="es" ? "Creación de OSHA" : lang==="pl" ? "Powstanie OSHA" : "OSHA Created", desc: lang==="es" ? "La Administración de Seguridad y Salud Ocupacional se establece después de décadas de defensa sindical. Los trabajadores finalmente tienen una agencia federal que los protege en el trabajo." : lang==="pl" ? "Administracja Bezpieczeństwa i Higieny Pracy powstaje po dziesięcioleciach działalności związkowej. Pracownicy nareszcie mają federalną agencję chroniącą ich w pracy." : "The Occupational Safety and Health Administration is established after decades of union advocacy. Workers finally have a federal agency protecting them on the job." },
                  { year: "1974", event: lang==="es" ? "ERISA — Protegiendo las Pensiones" : lang==="pl" ? "ERISA — Ochrona Emerytur" : "ERISA — Protecting Pensions", desc: lang==="es" ? "La Ley de Seguridad de Ingresos de Jubilación de los Empleados protege las pensiones y beneficios de jubilación de los trabajadores sindicalizados — asegurando que décadas de trabajo duro se traduzcan en una jubilación segura." : lang==="pl" ? "Ustawa o zabezpieczeniu dochodów emerytalnych pracowników chroni emerytury i świadczenia emerytalne pracowników związkowych — zapewniając, że dekady ciężkiej pracy przekładają się na bezpieczną emeryturę." : "The Employee Retirement Income Security Act protects union workers' pensions and retirement benefits — ensuring that decades of hard work translate into a secure retirement." },
                  { year: lang==="es" ? "Hoy" : lang==="pl" ? "Dziś" : "Today", event: lang==="es" ? "Los Oficios Lideran el Camino" : lang==="pl" ? "Zawody Prowadzą Drogę" : "The Trades Lead the Way", desc: lang==="es" ? "Los sindicatos de construcción siguen estableciendo el estándar — negociando los salarios más altos, los mejores beneficios y los sitios de trabajo más seguros de la industria. La lucha continúa." : lang==="pl" ? "Związki budowlane nadal wyznaczają standardy — negocjując najwyższe płace, najlepsze świadczenia i najbezpieczniejsze place budowy w branży. Walka trwa." : "Construction unions continue to set the standard — negotiating the highest wages, best benefits, and safest job sites in the industry. The fight goes on." },
                ].map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-event">{item.event}</div>
                    <div className="timeline-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line" />

            {/* WHAT UNIONS WON */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Lo que los "}<span className="accent">Sindicatos Ganaron</span>{" para Todos"}</> : lang==="pl" ? <>{"Co "}<span className="accent">Związki Wywalczyły</span>{" dla Wszystkich"}</> : <>{"What "}<span className="accent">Unions Won</span>{" for Every American"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Ya seas sindicalista o no, tu vida es mejor gracias a lo que lucharon los trabajadores sindicalizados." : lang==="pl" ? "Niezależnie od tego, czy jesteś w związku, Twoje życie jest lepsze dzięki temu, o co walczyli związkowcy." : "Whether you're union or not, your life is better because of what union workers fought for."}</div>
              <div className="impact-grid">
                {[
                  { icon: "📅", title: lang==="es" ? "El Fin de Semana" : lang==="pl" ? "Weekend" : "The Weekend", desc: lang==="es" ? "Antes de los sindicatos, los trabajadores laboraban 6 o 7 días a la semana. El fin de semana de dos días fue una victoria sindical — luchada y ganada por el trabajo organizado a principios del siglo XX." : lang==="pl" ? "Przed powstaniem związków zawodowych pracownicy pracowali 6 lub 7 dni w tygodniu. Dwudniowy weekend był zwycięstwem związkowym — wywalczonym przez zorganizowaną pracę na początku XX wieku." : "Before unions, workers labored 6 or 7 days a week. The two-day weekend was a union victory — fought for and won by organized labor in the early 20th century." },
                  { icon: "⏰", title: lang==="es" ? "La Jornada de 8 Horas" : lang==="pl" ? "8-Godzinny Dzień Pracy" : "The 8-Hour Day", desc: lang==="es" ? "'8 horas para trabajar, 8 horas para descansar, 8 horas para lo que queramos.' Los trabajadores sindicalizados lucharon durante décadas para limitar la jornada laboral de más de 16 horas a 8." : lang==="pl" ? "'8 godzin pracy, 8 godzin odpoczynku, 8 godzin na co chcemy.' Związkowcy walczyli przez dekady, aby ograniczyć dzień pracy z ponad 16 godzin do 8." : "'8 hours for work, 8 hours for rest, 8 hours for what we will.' Union workers fought for decades to limit the working day from 16+ hours to 8." },
                  { icon: "👶", title: lang==="es" ? "Fin del Trabajo Infantil" : lang==="pl" ? "Koniec Pracy Dzieci" : "End of Child Labor", desc: lang==="es" ? "Niños tan pequeños como de 5 años trabajaban en minas y fábricas antes de que los sindicatos impulsaran las leyes contra el trabajo infantil. La Ley de Normas Laborales Justas de 1938 finalmente prohibió la mayor parte del trabajo infantil." : lang==="pl" ? "Dzieci w wieku 5 lat pracowały w kopalniach i fabrykach zanim związki zawodowe zaczęły walczyć o przepisy dotyczące pracy dzieci. Ustawa o uczciwych standardach pracy z 1938 roku ostatecznie zakazała większości pracy dzieci." : "Children as young as 5 worked in mines and factories before unions pushed for child labor laws. The Fair Labor Standards Act of 1938 finally banned most child labor." },
                  { icon: "+", title: lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance", desc: lang==="es" ? "El seguro de salud proporcionado por el empleador se convirtió en estándar en América porque los sindicatos lo negociaron en los contratos — y otros empleadores tuvieron que seguir para competir por trabajadores." : lang==="pl" ? "Ubezpieczenie zdrowotne zapewniane przez pracodawcę stało się standardem w Ameryce, ponieważ związki wynegocjowały je w umowach — a inni pracodawcy musieli podążać za tym, aby konkurować o pracowników." : "Employer-provided health insurance became standard in America because unions negotiated it into contracts — and other employers had to follow to compete for workers." },
                  { icon: "$", title: lang==="es" ? "Salario Mínimo" : lang==="pl" ? "Płaca Minimalna" : "Minimum Wage", desc: lang==="es" ? "No había salario mínimo antes de que los sindicatos lucharan por él. El primer salario mínimo federal de $0.25/hr en 1938 fue una victoria sindical." : lang==="pl" ? "Nie było płacy minimalnej zanim związki zawodowe o nią nie walczyły. Pierwsza federalna płaca minimalna w wysokości $0,25/hr w 1938 roku była zwycięstwem związkowym." : "There was no minimum wage before unions fought for it. The first federal minimum wage of $0.25/hr in 1938 was a union victory." },
                  { icon: "✓", title: lang==="es" ? "Seguridad en el Trabajo" : lang==="pl" ? "Bezpieczeństwo w Pracy" : "Workplace Safety", desc: lang==="es" ? "OSHA, cascos, arneses de seguridad, salidas de emergencia — los trabajadores sindicalizados exigieron estas protecciones y eventualmente lograron que se convirtieran en ley para todos los trabajadores americanos." : lang==="pl" ? "OSHA, kaski, uprzęże bezpieczeństwa, wyjścia awaryjne — pracownicy związkowi domagali się tych zabezpieczeń i ostatecznie doprowadzili do ich zapisania w prawie dla wszystkich amerykańskich pracowników." : "OSHA, hard hats, safety harnesses, fire exits — union workers demanded these protections and eventually got them written into law for all American workers." },
                  { icon: "↑", title: lang==="es" ? "Pago de Horas Extras" : lang==="pl" ? "Wynagrodzenie za Nadgodziny" : "Overtime Pay", desc: lang==="es" ? "¿Tiempo y medio por horas extras? Eso es una victoria sindical. Antes de la FLSA, los empleadores podían hacerte trabajar horas ilimitadas sin pago adicional." : lang==="pl" ? "Półtorakrotność stawki za nadgodziny? To zwycięstwo związkowe. Przed FLSA pracodawcy mogli zmuszać do nieograniczonej liczby godzin pracy bez dodatkowego wynagrodzenia." : "Time-and-a-half for overtime? That's a union win. Before the FLSA, employers could work you unlimited hours with no extra pay." },
                  { icon: "◆", title: lang==="es" ? "Aprendizajes Pagados" : lang==="pl" ? "Płatne Praktyki" : "Paid Apprenticeships", desc: lang==="es" ? "El modelo de aprendizaje sindical — ganar mientras aprendes, sin deuda estudiantil — es el estándar de oro de la formación laboral. Construido por sindicatos, para trabajadores." : lang==="pl" ? "Model praktyk związkowych — zarabiaj ucząc się, bez długu studenckiego — jest złotym standardem szkolenia zawodowego. Zbudowany przez związki, dla pracowników." : "The union apprenticeship model — earn while you learn, no student debt — is the gold standard of workforce training. Built by unions, for workers." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div className="impact-icon">{item.icon}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line" />

            {/* QUOTES */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Palabras que "}<span className="accent">Movieron</span>{" un Movimiento"}</> : lang==="pl" ? <>{"Słowa, które "}<span className="accent">Poruszyły</span>{" Ruch"}</> : <>{"Words that "}<span className="accent">Moved</span>{" a Movement"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Las voces que dieron forma al movimiento laboral." : lang==="pl" ? "Głosy, które ukształtowały ruch pracowniczy." : "The voices who shaped the labor movement."}</div>
              {[
                { quote: "The labor movement is the organized effort of workers to improve their conditions through collective action. Without it, there is no middle class.", author: "Franklin D. Roosevelt" },
                { quote: "The eight-hour day and the five-day week did not come to you as a gift. They came as a result of the organized labor movement.", author: "Samuel Gompers, AFL Founder" },
                { quote: "What the working people of this country need is not charity, not sympathy — but justice.", author: "Eugene V. Debs" },
                { quote: "Union is strength. Workers without unions are like birds without wings.", author: "César Chávez" },
              ].map((q, i) => (
                <div key={i} className="quote-block">
                  <div className="quote-text">"{q.quote}"</div>
                  <div className="quote-author">— {q.author}</div>
                </div>
              ))}
            </div>

            <hr className="divider-line" />

            {/* WHY IT MATTERS TODAY */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Por Qué Importa "}<span className="accent">Hoy</span></> : lang==="pl" ? <>{"Dlaczego Jest to Ważne "}<span className="accent">Dziś</span></> : <>{"Why It Matters "}<span className="accent">Today</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "La lucha no ha terminado — pero los oficios están liderando el camino." : lang==="pl" ? "Walka nie skończyła się — ale zawody budowlane prowadzą drogę." : "The fight isn't over — but the trades are leading the way."}</div>
              <div className="impact-grid">
                {[
                  { icon: "💵", title: lang==="es" ? "Prima Salarial Sindical" : lang==="pl" ? "Premia Płacowa Związkowców" : "Union Wage Premium", desc: lang==="es" ? "Los trabajadores sindicalizados ganan un 18% más en promedio que los trabajadores no sindicalizados que hacen el mismo trabajo. En la construcción, esa brecha es aún mayor." : lang==="pl" ? "Pracownicy związkowi zarabiają średnio o 18% więcej niż pracownicy niezrzeszeni wykonujący tę samą pracę. W budownictwie ta różnica jest jeszcze większa." : "Union workers earn 18% more on average than non-union workers doing the same job. In construction, that gap is even larger." },
                  { icon: "🏗️", title: lang==="es" ? "Los Oficios Están en Auge" : lang==="pl" ? "Zawody Budowlane Kwitną" : "The Trades Are Booming", desc: lang==="es" ? "América necesita más de 500,000 nuevos trabajadores de construcción. Los sindicatos ofrecen el camino más rápido hacia una carrera bien remunerada sin deuda estudiantil." : lang==="pl" ? "Ameryka potrzebuje ponad 500 000 nowych pracowników budowlanych. Związki oferują najszybszą drogę do dobrze płatnej kariery bez długu studenckiego." : "America needs 500,000+ new construction workers. Unions offer the fastest path to a high-paying career with zero student debt." },
                  { icon: "🤝", title: lang==="es" ? "La Negociación Colectiva Funciona" : lang==="pl" ? "Negocjacje Zbiorowe Działają" : "Collective Bargaining Works", desc: lang==="es" ? "Cuando los trabajadores negocian juntos, ganan juntos. Los contratos sindicales establecen el mínimo para salarios, seguridad y beneficios — y los empleadores no sindicalizados tienen que competir." : lang==="pl" ? "Kiedy pracownicy negocjują razem, wygrywają razem. Umowy związkowe ustalają poziom minimum dla płac, bezpieczeństwa i świadczeń — a pracodawcy niezrzeszeni muszą konkurować." : "When workers negotiate together, they win together. Union contracts set the floor for wages, safety, and benefits — and non-union employers have to compete." },
                  { icon: "🌎", title: lang==="es" ? "Construyendo el Futuro de América" : lang==="pl" ? "Budowanie Przyszłości Ameryki" : "Building America's Future", desc: lang==="es" ? "Cada puente, hospital, escuela y centro de datos en América es construido por trabajadores calificados. Los trabajadores sindicalizados lo construyen más seguro, mejor y para durar." : lang==="pl" ? "Każdy most, szpital, szkoła i centrum danych w Ameryce jest budowane przez wykwalifikowanych rzemieślników. Pracownicy związkowi budują to bezpieczniej, lepiej i trwalej." : "Every bridge, hospital, school, and data center in America is built by skilled tradespeople. Union workers build it safer, build it better, and build it to last." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div className="impact-icon">{item.icon}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === "benefits" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">💼 More Than Just a Paycheck</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Beneficios "}<span className="accent">Sindicales</span></> : lang==="pl" ? <>{"Świadczenia "}<span className="accent">Związkowe</span></> : <>{"Union "}<span className="accent">Benefits</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Los trabajadores sindicalizados de la construcción no solo ganan más — también reciben un paquete de beneficios que la mayoría de los trabajadores nunca verán." : lang==="pl" ? "Związkowi pracownicy budowlani nie tylko zarabiają więcej — otrzymują też pakiet świadczeń, którego większość pracowników nigdy nie zobaczy." : "Union construction workers don't just earn more — they receive a benefits package that most workers will never see."}
              </p>
            </div>

            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"El "}<span className="accent">Paquete Completo</span></> : lang==="pl" ? <>{"Pełny "}<span className="accent">Pakiet</span></> : <>{"The "}<span className="accent">Full Package</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Todo pagado por el contratista — no deducido de tu cheque." : lang==="pl" ? "Wszystko płacone przez wykonawcę — nie potrącane z Twojej wypłaty." : "All paid by your contractor — not deducted from your paycheck."}</div>
              <div className="impact-grid">
                {[
                  { icon: "+", title: lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance", desc: lang==="es" ? "Cobertura médica, dental y de visión completa para ti y tu familia — pagada directamente por el contratista a tu fondo de salud." : lang==="pl" ? "Pełne ubezpieczenie medyczne, dentystyczne i wzrokowe dla Ciebie i Twojej rodziny — płacone bezpośrednio przez wykonawcę do Twojego funduszu zdrowotnego." : "Full medical, dental, and vision coverage for you and your family — paid directly by your contractor to your health fund.", page: "health" },
                  { icon: "🏦", title: lang==="es" ? "Pensión" : lang==="pl" ? "Emerytura" : "Pension", desc: lang==="es" ? "Un cheque mensual garantizado de por vida cuando te jubiles — financiado completamente por el contratista. Sin riesgo de mercado para ti." : lang==="pl" ? "Gwarantowana miesięczna wypłata przez całe życie po przejściu na emeryturę — w pełni finansowana przez wykonawcę. Żadnego ryzyka rynkowego dla Ciebie." : "A guaranteed monthly check for life when you retire — funded entirely by your contractor. No market risk to you.", page: "retirement" },
                  { icon: "↑", title: lang==="es" ? "Anualidad" : lang==="pl" ? "Renta Annuitetowa" : "Annuity", desc: lang==="es" ? "Una cuenta de ahorro adicional para la jubilación que crece con cada hora trabajada — financiada por el contratista además de tu pensión." : lang==="pl" ? "Dodatkowe konto oszczędnościowe na emeryturę, które rośnie z każdą przepracowaną godziną — finansowane przez wykonawcę oprócz Twojej emerytury." : "An additional retirement savings account that grows with every hour worked — funded by your contractor on top of your pension.", page: "retirement" },
                  { icon: "◆", title: lang==="es" ? "Aprendizaje Pagado" : lang==="pl" ? "Płatna Praktyka" : "Paid Apprenticeship", desc: lang==="es" ? "Ganas un salario completo mientras aprendes el oficio — sin deuda estudiantil. Los contratistas también contribuyen a los fondos de formación." : lang==="pl" ? "Zarabiasz pełną pensję ucząc się zawodu — bez długu studenckiego. Wykonawcy również wpłacają do funduszy szkoleniowych." : "You earn a full wage while learning the trade — no student debt. Contractors also contribute to training funds.", page: "careers" },
                  { icon: "🛡️", title: lang==="es" ? "Seguro de Discapacidad" : lang==="pl" ? "Ubezpieczenie na Wypadek Niezdolności do Pracy" : "Disability Coverage", desc: lang==="es" ? "Si te lesionas en el trabajo, los planes sindicales suelen incluir cobertura por discapacidad a corto y largo plazo — sin costo adicional para ti." : lang==="pl" ? "Jeśli doznasz obrażeń w pracy, plany związkowe zazwyczaj obejmują ubezpieczenie od niezdolności do pracy krótko- i długoterminowej — bez dodatkowych kosztów dla Ciebie." : "If you're injured on the job, union plans typically include short and long-term disability coverage — at no extra cost to you.", page: "benefits" },
                  { icon: "💼", title: lang==="es" ? "Vacaciones Pagadas" : lang==="pl" ? "Płatny Urlop" : "Vacation & Holiday Pay", desc: lang==="es" ? "Muchos contratos sindicales incluyen contribuciones a fondos de vacaciones — acumulando dinero de vacaciones pagadas con cada hora trabajada." : lang==="pl" ? "Wiele umów związkowych obejmuje składki do funduszy urlopowych — gromadząc pieniądze na płatny urlop z każdą przepracowaną godziną." : "Many union contracts include contributions to vacation funds — accumulating paid vacation money with every hour worked.", page: "benefits" },
                ].map((item, i) => (
                  <div key={i} className="impact-card" style={{cursor: item.page !== "benefits" ? "pointer" : "default"}} onClick={() => item.page !== "benefits" && setPage(item.page)}>
                    <div className="impact-icon">{item.icon}</div>
                    <div className="impact-title">{item.title}{item.page !== "benefits" && <span style={{color:"#FA8059", fontSize:14, marginLeft:8}}>→</span>}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line" />

            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"¿Por qué los Beneficios Sindicales son "}<span className="accent">Tan Buenos?</span></> : lang==="pl" ? <>{"Dlaczego Świadczenia Związkowe są "}<span className="accent">Tak Dobre?</span></> : <>{"Why Are Union Benefits "}<span className="accent">So Good?</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "La negociación colectiva funciona." : lang==="pl" ? "Negocjacje zbiorowe działają." : "Collective bargaining works."}</div>
              <div className="quote-block">
                <div className="quote-text">{lang==="es" ? '"Cuando sumas el salario, la pensión, la anualidad y los beneficios de salud — el paquete total de compensación de un oficial puede superar los $100/hr en los mercados principales. La mayoría de la gente no se da cuenta de cuánto va hacia tu futuro."' : lang==="pl" ? '"Gdy zsumujemy wynagrodzenie, emeryturę, rentę annuitetową i świadczenia zdrowotne — całkowity pakiet wynagrodzenia czeladnika może przekroczyć $100/godz. na głównych rynkach. Większość ludzi nie zdaje sobie sprawy, ile z tego trafia do ich przyszłości."' : '"When you add up the wages, pension, annuity, and health benefits — a journeyman total compensation package can exceed $100/hr in major markets. Most people do not realize how much of that goes toward your future."'}</div>
                <div className="quote-author">{lang==="es" ? "— El Verdadero Valor de un Paquete Sindical" : lang==="pl" ? "— Prawdziwa Wartość Pakietu Związkowego" : "— The True Value of a Union Package"}</div>
              </div>
            </div>
          </div>
        )}

        {page === "health" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "🏥 No Sale de Tu Cheque" : lang==="pl" ? "🏥 Nie Potrącane z Twojej Wypłaty" : "🏥 Never Deducted From Your Paycheck"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Seguro de Salud — "}<span className="accent">Pagado por el Contratista</span></> : lang==="pl" ? <>{"Ubezpieczenie Zdrowotne — "}<span className="accent">Płacone przez Wykonawcę</span></> : <>{"Health Insurance — "}<span className="accent">Paid by Your Contractor</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Uno de los mayores beneficios financieros de los oficios sindicales — y uno de los menos comprendidos." : lang==="pl" ? "Jedna z największych korzyści finansowych w związkowych zawodach budowlanych — i jedna z najmniej rozumianych." : "One of the biggest financial benefits of the union trades — and one of the least understood."}
              </p>
            </div>

            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"¿Cómo "}<span className="accent">Funciona?</span></> : lang==="pl" ? <>{"Jak to "}<span className="accent">Działa?</span></> : <>{"How Does It "}<span className="accent">Work?</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Simple — el contratista lo paga, no tú." : lang==="pl" ? "Prosto — wykonawca to płaci, nie Ty." : "Simple — your contractor pays it, not you."}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">💡</div>
                  <div className="impact-title">{lang==="es" ? "Cómo Funciona" : lang==="pl" ? "Jak To Działa" : "How It Works"}</div>
                  <div className="impact-desc">{lang==="es" ? "En la construcción sindical, cada contratista que firma un acuerdo sindical debe contribuir una cantidad fija por hora trabajada directamente a tu fondo de salud. Esto cubre tus primas de seguro médico — no tú. Nunca toca tu cheque." : lang==="pl" ? "W związkowym budownictwie każdy wykonawca, który podpisuje umowę związkową, jest zobowiązany wpłacać ustaloną kwotę za każdą przepracowaną godzinę bezpośrednio do Twojego funduszu zdrowotnego. Pokrywa to Twoje składki na ubezpieczenie zdrowotne — nie Ty. Nigdy nie dotyka Twojej wypłaty." : "In union construction, every contractor who signs a union agreement is required to contribute a set dollar amount per hour you work directly into your health and welfare fund. This covers your health insurance premiums — not you. It never touches your paycheck."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">💵</div>
                  <div className="impact-title">{lang==="es" ? "En Dólares" : lang==="pl" ? "W Dolarach" : "What That Means in Dollars"}</div>
                  <div className="impact-desc">{lang==="es" ? "Una contribución típica de salud sindical puede ser de $8-15 por hora trabajada. Si trabajas 2,000 horas al año, eso son $16,000-$30,000 por año para tu cobertura de salud — pagado completamente por el contratista además de tu salario." : lang==="pl" ? "Typowa składka zdrowotna związkowca może wynosić $8-15 za godzinę pracy. Jeśli pracujesz 2000 godzin rocznie, to $16 000-$30 000 rocznie na Twoje ubezpieczenie zdrowotne — płacone w całości przez wykonawcę oprócz Twojego wynagrodzenia." : "A typical union health contribution might be $8-15 per hour worked. If you work 2,000 hours a year, that's $16,000-$30,000 per year toward your health coverage — paid entirely by the contractor on top of your wages."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">👨‍👩‍👧‍👦</div>
                  <div className="impact-title">{lang==="es" ? "Cobertura Familiar" : lang==="pl" ? "Ubezpieczenie Rodzinne" : "Family Coverage Included"}</div>
                  <div className="impact-desc">{lang==="es" ? "La mayoría de los planes de salud sindicales cubren a toda tu familia — cónyuge e hijos — con poco o ningún costo adicional para ti. En el mundo no sindical, la cobertura familiar puede costar fácilmente $800-1,500/mes de tu propio bolsillo." : lang==="pl" ? "Większość planów zdrowotnych związków zawodowych obejmuje całą Twoją rodzinę — współmałżonka i dzieci — przy niewielkim lub żadnym dodatkowym koszcie dla Ciebie. W świecie niezwiązkowym ubezpieczenie rodzinne może łatwo kosztować $800-1500/mies. z własnej kieszeni." : "Most union health plans cover your entire family — spouse and children — at little to no additional cost to you. In the non-union world, family coverage can easily cost $800-1,500/month out of your own pocket."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🦷</div>
                  <div className="impact-title">{lang==="es" ? "Qué Está Cubierto" : lang==="pl" ? "Co Jest Objęte" : "What's Covered"}</div>
                  <div className="impact-desc">{lang==="es" ? "Los planes de salud sindicales típicamente incluyen médico, dental, visión, medicamentos recetados, salud mental y a veces seguro de vida — todo en un paquete. La cobertura suele ser mejor que la de la mayoría de los trabajadores de oficina." : lang==="pl" ? "Plany zdrowotne związków zawodowych zazwyczaj obejmują opiekę medyczną, dentystyczną, wzrokową, leki na receptę, usługi zdrowia psychicznego, a czasem ubezpieczenie na życie — wszystko w jednym pakiecie." : "Union health plans typically include medical, dental, vision, prescription drugs, mental health services, and sometimes life insurance — all in one package. Coverage is often better than what most office workers receive."}</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">{lang==="es" ? '"Tu salario es lo que llevas a casa. Pero tu compensación total — salario más pensión, anualidad y beneficios de salud — es lo que realmente está pagando el contratista."' : lang==="pl" ? '"Twoje wynagrodzenie to to, co zabierasz do domu. Ale Twoje całkowite wynagrodzenie — płaca plus emerytura, renta annuitetowa i świadczenia zdrowotne — to to, co naprawdę płaci wykonawca."' : '"Your wages are what you take home. But your total compensation — wages plus pension, annuity, and health benefits — is what the contractor is really paying."'}</div>
                <div className="quote-author">{lang==="es" ? "— Entendiendo tu Paquete de Compensación Sindical" : lang==="pl" ? "— Zrozumienie Twojego Pakietu Wynagrodzenia Związkowego" : "— Understanding Your Full Union Compensation Package"}</div>
              </div>
            </div>
          </div>
        )}

        {page === "retirement" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Tu Futuro, Construido en el Trabajo" : lang==="pl" ? "Twoja Przyszlosc, Zbudowana w Pracy" : "Your Future, Built on the Job"}</div>
              <h1 className="history-title">
                {"401k vs Annuity vs "}<span className="accent">{lang==="es" ? "Pension" : lang==="pl" ? "Emerytura" : "Pension"}</span>
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Tres formas diferentes de ahorrar para la jubilacion — y los oficios de construccion sindical ofrecen las tres." : lang==="pl" ? "Trzy rozne sposoby oszczedzania na emeryture — a zwiazowe zawody budowlane oferuja wszystkie trzy." : "Three different ways to save for retirement — and union construction trades offer all three."}
              </p>
            </div>

            <div style={{maxWidth:900, margin:"0 auto", padding:"40px 24px 80px"}}>
              {[
                {
                  id:"compare",
                  title: lang==="es" ? "Comparacion Rapida" : lang==="pl" ? "Szybkie Porownanie" : "Quick Comparison",
                  content: (
                    <div style={{marginTop:16, overflowX:"auto"}}>
                      <table style={{width:"100%", borderCollapse:"collapse", fontSize:14}}>
                        <thead>
                          <tr style={{background:"rgba(250,128,89,0.12)", borderBottom:"2px solid #FA8059"}}>
                            {["", lang==="es"?"Pension":lang==="pl"?"Emerytura":"Pension", lang==="es"?"Anualidad":lang==="pl"?"Renta":"Annuity", "401k"].map(h => (
                              <th key={h} style={{padding:"14px 16px", textAlign:"left", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:800, color: h==="Pension" ? "#FA8059" : "white"}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [lang==="es"?"Quien lo financia?":lang==="pl"?"Kto finansuje?":"Who funds it?", lang==="es"?"El empleador":lang==="pl"?"Pracodawca":"Employer pays", lang==="es"?"El empleador":lang==="pl"?"Pracodawca":"Employer pays", lang==="es"?"Tu pagas":lang==="pl"?"Ty placisz":"You pay in"],
                            [lang==="es"?"Pago garantizado?":lang==="pl"?"Gwarantowana wyplata?":"Guaranteed payment?", lang==="es"?"Si, de por vida":lang==="pl"?"Tak, dozgonnie":"Yes, for life", lang==="es"?"Si, monto fijo":lang==="pl"?"Tak, stala kwota":"Yes, fixed amount", lang==="es"?"No, depende del mercado":lang==="pl"?"Nie, zalezne od rynku":"No — market dependent"],
                            [lang==="es"?"Controlas inversiones?":lang==="pl"?"Kontrolujesz inwestycje?":"You control investments?", lang==="es"?"No":lang==="pl"?"Nie":"No", lang==="es"?"No":lang==="pl"?"Nie":"No", lang==="es"?"Si":lang==="pl"?"Tak":"Yes"],
                            [lang==="es"?"Cheque mensual?":lang==="pl"?"Miesieczna wyplata?":"Monthly check in retirement?", lang==="es"?"Si":lang==="pl"?"Tak":"Yes", lang==="es"?"Si":lang==="pl"?"Tak":"Yes", lang==="es"?"Retiras segun necesitas":lang==="pl"?"Wyplacasz wg potrzeb":"You withdraw as needed"],
                            [lang==="es"?"Comun en oficios sindicales?":lang==="pl"?"Czeste w zwiazach?":"Common in union trades?", lang==="es"?"Muy comun":lang==="pl"?"Bardzo czeste":"Very common", lang==="es"?"Muy comun":lang==="pl"?"Bardzo czeste":"Very common", lang==="es"?"A veces":lang==="pl"?"Czasem":"Sometimes"],
                            [lang==="es"?"Riesgo para el trabajador?":lang==="pl"?"Ryzyko dla pracownika?":"Risk to worker?", lang==="es"?"Muy bajo":lang==="pl"?"Bardzo niskie":"Very low", lang==="es"?"Muy bajo":lang==="pl"?"Bardzo niskie":"Very low", lang==="es"?"Mayor — riesgo de mercado":lang==="pl"?"Wyzsze — ryzyko rynkowe":"Higher — market risk"],
                          ].map((row, i) => (
                            <tr key={i} style={{borderBottom:"1px solid rgba(58,80,104,0.4)", background: i%2===0 ? "rgba(34,48,61,0.3)" : "transparent"}}>
                              {row.map((cell, j) => (
                                <td key={j} style={{padding:"12px 16px", color: j===0 ? "white" : "var(--muted)", fontWeight: j===0 ? 700 : 400}}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                },
                {
                  id:"pension",
                  title: lang==="es" ? "La Pension — El Estandar de Oro" : lang==="pl" ? "Emerytura — Zloty Standard" : "The Pension — The Gold Standard",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Una pension es una cuenta de jubilacion financiada completamente por tu empleador. Cuando te jubiles, recibes un cheque mensual garantizado de por vida. Solo el 12% de los trabajadores del sector privado tienen pension. Los trabajadores de construccion sindical estan entre los pocos que todavia la tienen." : lang==="pl" ? "Emerytura to konto emerytalne finansowane w calosci przez pracodawce. Po przejsciu na emeryture otrzymujesz gwarantowana miesieczna wyplate przez cale zycie. Tylko 12% pracownikow sektora prywatnego ma emeryture." : "A pension is a retirement account funded entirely by your employer. When you retire, you receive a guaranteed monthly check for life. Only about 12% of private sector workers have a pension. Union construction workers are among the few who still do."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Como se Calcula" : lang==="pl" ? "Jak sie Oblicza" : "How It Is Calculated", desc: lang==="es" ? "Ejemplo: 30 anos x 2% x $60,000 salario promedio = $36,000/ano de pension. Eso es $3,000 al mes, de por vida." : lang==="pl" ? "Przyklad: 30 lat x 2% x $60 000 = $36 000/rok. To $3 000 miesiecznie, dozgonnie." : "Example: 30 years x 2% x $60,000 average salary = $36,000/year pension. That is $3,000 per month, every month, for life." },
                          { num:"02", title: lang==="es" ? "En los Oficios Sindicales" : lang==="pl" ? "W Zwiazowych Zawodach" : "In Union Trades", desc: lang==="es" ? "Casi todos los grandes sindicatos de construccion — IBEW, UA, UBC, BAC, Ironworkers y mas — ofrecen un plan de pension de beneficio definido. Los empleadores contribuyen por cada hora que trabajas." : lang==="pl" ? "Prawie kazdy wiekszy zwiazek budowlany — IBEW, UA, UBC, BAC, Ironworkers i inne — oferuje plan emerytalny ze swiadczeniami okreslonymi." : "Nearly every major construction union — IBEW, UA, UBC, BAC, Ironworkers, and more — offers a defined benefit pension plan. Employers contribute for every hour you work." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"annuity",
                  title: lang==="es" ? "La Anualidad — Tu Segundo Cheque" : lang==="pl" ? "Renta Annuitetowa — Twoja Druga Wyplata" : "The Annuity — Your Second Check",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Una anualidad es una cuenta de ahorro adicional para la jubilacion que tu empleador financia. Los empleadores contribuyen una cantidad fija por hora trabajada. Se acumula a lo largo de tu carrera y se paga cuando te jubiles." : lang==="pl" ? "Renta annuitetowa to dodatkowe konto oszczednosciowe na emeryture finansowane przez pracodawce. Pracodawcy wplacaja stala kwote za kazda przepracowana godzine." : "An annuity is an additional retirement savings account that your employer funds. Employers contribute a set amount per hour worked. It builds up over your career and pays out when you retire."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Ejemplo Real" : lang==="pl" ? "Rzeczywisty Przyklad" : "Real Example", desc: lang==="es" ? "Tu contrato dice $3.50/hr a tu anualidad. Si trabajas 2,000 horas al ano, eso es $7,000 al ano sin que contribuyas nada. A lo largo de 30 anos, eso puede crecer a $400,000+." : lang==="pl" ? "Twoja umowa mowi $3,50/godz do Twojej renty. Jesli pracujesz 2000 godzin rocznie, to $7000 rocznie bez zadnego Twojego wkladu. W ciagu 30 lat moze urosn do $400 000+." : "Your contract says $3.50/hr to your annuity. Work 2,000 hours a year and that is $7,000/year without contributing a dollar. Over 30 years, that could grow to $400,000+." },
                          { num:"02", title: lang==="es" ? "Anualidad vs Pension" : lang==="pl" ? "Renta vs Emerytura" : "Annuity vs Pension", desc: lang==="es" ? "La pension paga un monto mensual fijo de por vida. La anualidad es mas como una cuenta de ahorros. Muchos contratos sindicales incluyen AMBAS — dos cuentas de jubilacion, ambas financiadas por tu empleador." : lang==="pl" ? "Emerytura placi stala miesieczna kwote przez cale zycie. Renta annuitetowa jest bardziej jak konto oszczednosciowe. Wiele umow zwiazowych obejmuje OBE." : "The pension pays a fixed monthly amount for life. The annuity is more like a savings account. Many union contracts include BOTH — two retirement accounts, both employer-funded." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"k401",
                  title: lang==="es" ? "El 401k — El Plan Mas Comun" : lang==="pl" ? "401k — Najpopularniejszy Plan" : "The 401k — The Most Common Plan",
                  content: (
                    <div style={{marginTop:16}}>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Que Es" : lang==="pl" ? "Co To Jest" : "What It Is", desc: lang==="es" ? "Un 401k es una cuenta donde TU contribuyes una parte de tu cheque antes de impuestos. El dinero crece en inversiones. Tu empleador puede igualar algunas contribuciones, pero tu eres quien mas financia." : lang==="pl" ? "401k to konto oszczednosciowe, w ktorym TY wplacasz czesc swojej wyplaty przed opodatkowaniem. Pieniadze rosna w inwestycjach." : "A 401k is a savings account where YOU contribute a portion of your paycheck before taxes. The money grows in investments. You are doing most of the funding yourself." },
                          { num:"02", title: lang==="es" ? "El Riesgo" : lang==="pl" ? "Ryzyko" : "The Risk", desc: lang==="es" ? "Tu saldo sube y baja con el mercado de valores. Si el mercado cae justo antes de que te jubiles, tus ahorros pueden caer un 30-40% de la noche a la manana. No hay monto garantizado." : lang==="pl" ? "Twoje saldo rosnie i spada wraz z rynkiem akcji. Jesli rynek spadnie tuz przed emerytura, oszczednosci moga spasc o 30-40% z dnia na dzien." : "Your 401k balance goes up and down with the stock market. If the market crashes right before you retire, your savings can drop 30-40% overnight. No guaranteed amount." },
                          { num:"03", title: lang==="es" ? "vs Beneficios Sindicales" : lang==="pl" ? "vs Swiadczenia Zwiazowe" : "vs Union Benefits", desc: lang==="es" ? "En la mayoria de los casos, una pension sindical + anualidad es mejor que un 401k porque esta garantizada y financiada por el empleador — no sale de tu cheque." : lang==="pl" ? "W wiekszosci przypadkow zwiazowa emerytura + renta jest lepsza niz 401k, bo jest gwarantowana i finansowana przez pracodawce." : "In most cases, a union pension plus annuity beats a 401k because it is guaranteed and employer-funded — it does not come out of your paycheck." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"package",
                  title: lang==="es" ? "Tu Paquete Completo" : lang==="pl" ? "Twoj Pelny Pakiet" : "Your Full Compensation Package",
                  content: (
                    <div style={{marginTop:16}}>
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:16, padding:"24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:20}}>
                          {lang==="es" ? "Ejemplo: Electricista Oficial — Mercado Principal" : lang==="pl" ? "Przyklad: Elektryk Czeladnik — Duzy Rynek" : "Example: Journeyman Electrician — Major Market"}
                        </div>
                        {[
                          [lang==="es"?"Salario Base":lang==="pl"?"Wynagrodzenie Podstawowe":"Base Wage", "$48.00/hr", true, lang==="es" ? "Lo que aparece en tu cheque" : lang==="pl" ? "Co pojawia sie w wyplacie" : "This is what appears on your paycheck"],
                          [lang==="es"?"Salud y Bienestar":lang==="pl"?"Zdrowie i Swiadczenia":"Health & Welfare", "$12.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Pension":lang==="pl"?"Emerytura":"Pension", "$9.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Anualidad":lang==="pl"?"Renta Annuitetowa":"Annuity", "$5.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Fondo de Vacaciones":lang==="pl"?"Fundusz Urlopowy":"Vacation Fund", "$4.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Formacion y Otros":lang==="pl"?"Szkolenie i Inne":"Training & Other", "$2.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                        ].map(([label, amount, isWage, note], i) => (
                          <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i < 5 ? "1px solid rgba(58,80,104,0.4)" : "none"}}>
                            <div>
                              <span style={{fontSize:15, color: isWage ? "white" : "var(--muted)", fontWeight: isWage ? 700 : 400}}>{label}</span>
                              {note && <div style={{fontSize:12, color:"#FA8059", marginTop:2}}>{note}</div>}
                            </div>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: isWage ? "#FA8059" : "var(--muted)"}}>{amount}</span>
                          </div>
                        ))}
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0 0", marginTop:8, borderTop:"2px solid #FA8059"}}>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"white"}}>{lang==="es" ? "COMPENSACION TOTAL" : lang==="pl" ? "CALKOWITE WYNAGRODZENIE" : "TOTAL COMPENSATION"}</span>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:"#FA8059"}}>$81.00/hr</span>
                        </div>
                        <div style={{fontSize:12, color:"var(--muted)", marginTop:12, fontStyle:"italic"}}>
                          {lang==="es" ? "* Solo ejemplo. Las tarifas reales varian por local y ano de contrato." : lang==="pl" ? "* Tylko przyklad. Stawki roznia sie w zaleznosci od lokalu." : "* Example figures only. Actual rates vary by local, market, and contract year."}
                        </div>
                      </div>
                    </div>
                  )
                },
              ].map((section) => (
                <div key={section.id} style={{marginBottom:12, border: retSection===section.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                  <button
                    onClick={() => setRetSection(retSection===section.id ? null : section.id)}
                    style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left"}}
                  >
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: retSection===section.id ? "#FA8059" : "#fff"}}>{section.title}</span>
                    <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: retSection===section.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s"}}>+</span>
                  </button>
                  {retSection===section.id && (
                    <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "locals" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Lo que Nadie te Explica" : lang==="pl" ? "Czego Nikt Ci Nie Wyjasnil" : "What Nobody Explains to You"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Entendiendo "}<span className="accent">{"tu Local"}</span></> : lang==="pl" ? <>{"Rozumienie "}<span className="accent">{"Twojego Oddzialu"}</span></> : <>{"Understanding "}<span className="accent">{"Your Local"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "La jurisdiccion, los libros de trabajo, los locales de origen y como funciona realmente el trabajo de viaje." : lang==="pl" ? "Jurysdykcja, ksiegi pracy, lokale macierzyste i jak naprawde dziala praca w trasie." : "Jurisdiction, work books, home locals, and how travel work and apprenticeship school actually functions — explained clearly by people who live it every day."}
              </p>
            </div>

            <div style={{maxWidth:900, margin:"0 auto", padding:"40px 24px 80px"}}>
              {[
                {
                  id:"jurisdiction",
                  title: lang==="es" ? "Jurisdiccion — El Territorio de tu Local" : lang==="pl" ? "Jurysdykcja — Terytorium Twojego Oddzialu" : "Jurisdiction — Your Local's Territory",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Cada local sindical tiene una jurisdiccion geografica definida — un territorio especifico donde tiene autoridad para representar a los trabajadores. Si vives o trabajas dentro de ese territorio, ese es el local al que deberias solicitar el ingreso." : lang==="pl" ? "Kazdy lokalny zwiazek zawodowy ma okreslona jurysdykcje geograficzna — specyficzne terytorium, na ktorym ma uprawnienia do reprezentowania pracownikow. Jesli mieszkasz lub pracujesz na tym terytorium, to do tego lokalnego oddzialu powinienes sie zglosic." : "Every union local has a defined geographic jurisdiction — a specific territory where it has authority to represent workers. Think of it like a district. If you live or work within that territory, that is the local you should be applying to."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Por Que Importa" : lang==="pl" ? "Dlaczego To Ma Znaczenie" : "Why It Matters", desc: lang==="es" ? "Solicitar al local incorrecto puede resultar en ser redirigido o en tiempos de espera mas largos. Los locales solo representan a trabajadores dentro de su jurisdiccion. Siempre verifica que el local cubra el area donde vives o donde planeas trabajar antes de aplicar." : lang==="pl" ? "Zlozenie wniosku do niewlasciwego lokalnego oddzialu moze skutkowac przekierowaniem lub dluzszym czasem oczekiwania. Zawsze sprawdz, czy lokalny oddział obejmuje obszar, w ktorym mieszkasz lub planujesz pracowac." : "Applying to the wrong local can result in being redirected or longer wait times. Locals only represent workers within their jurisdiction. Always verify the local covers the area where you live or plan to work before applying." },
                          { num:"02", title: lang==="es" ? "Como Encontrar el Tuyo" : lang==="pl" ? "Jak Znalezc Swoj" : "How to Find Yours", desc: lang==="es" ? "Usa la funcion de busqueda de Union Pathways para encontrar locales cercanos a tu codigo postal o ciudad. Cuando encuentres un local candidato, llama directamente o visita su sitio web para confirmar que tu direccion esta dentro de su jurisdiccion." : lang==="pl" ? "Uzyj funkcji wyszukiwania Union Pathways, aby znalezc lokale w poblizu swojego kodu pocztowego lub miasta. Gdy znajdziesz kandydujacego lokalnego, zadzwon bezposrednio lub odwiedz jego strone internetowa." : "Use the Union Pathways search to find locals near your ZIP code or city. When you find a candidate local, call them directly or visit their website to confirm your address falls within their jurisdiction before applying." },
                          { num:"03", title: lang==="es" ? "Las Fronteras Pueden Superponerse" : lang==="pl" ? "Granice Moga Sie Nakladac" : "Boundaries Can Overlap", desc: lang==="es" ? "En algunas areas metropolitanas, multiples locales pueden operar cerca entre si con territorios adyacentes. Si estas cerca de una linea de frontera, podrias tener opciones. Pregunta a ambos locales sobre cobertura de trabajo, listas de espera y condiciones actuales del mercado laboral antes de decidir." : lang==="pl" ? "W niektorych obszarach metropolitalnych wiele lokalnych oddzialow moze dzialac blisko siebie z przyleglymi terytoriami. Jesli jestes blisko linii granicznej, mozesz miec opcje. Zapytaj oba lokale o pokrycie pracy, listy oczekujacych i aktualne warunki rynku pracy." : "In some metro areas, multiple locals may operate near each other with adjacent territories. If you are near a boundary line, you may have options. Ask both locals about work coverage, wait lists, and current market conditions before deciding where to apply." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"books",
                  title: lang==="es" ? "Libro 1 vs Libro 2 — La Lista de Trabajo" : lang==="pl" ? "Ksiega 1 vs Ksiega 2 — Lista Pracy" : "Book 1 vs Book 2 — The Out-of-Work List",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:24}}>
                        {lang==="es" ? "Cuando un trabajador sindical esta desempleado y busca trabajo, se inscribe en la lista de desempleo de su local — comnmente llamada el libro. El local llama a los trabajadores de esta lista en orden cuando los contratistas solicitan mano de obra." : lang==="pl" ? "Kiedy pracownik zwiazowy jest bezrobotny i szuka pracy, rejestruje sie na liscie bezrobocia swojego lokalu — powszechnie nazywanej ksiega. Lokalny oddział dzwoni do pracownikow z tej listy w kolejnosci, gdy wykonawcy prosza o sile robocza." : "When a union worker is out of work and looking for a job, they sign the out-of-work list at their local — commonly called the book. The local calls workers from this list in order when contractors request labor. Your position on the book determines when you get dispatched."}
                      </p>
                      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16, marginBottom:24}}>
                        <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:16, padding:"24px"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>{lang==="es" ? "Libro 1" : lang==="pl" ? "Ksiega 1" : "Book 1"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:12}}>{lang==="es" ? "Miembros del Local" : lang==="pl" ? "Czlonkowie Lokalnego" : "Home Local Members"}</div>
                          <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "La lista de trabajo primaria. Reservada para miembros en regla del local. Tienes prioridad sobre los viajeros. Cuando hay trabajo, el Libro 1 se llama primero. Estar en el Libro 1 significa que este es tu local de origen." : lang==="pl" ? "Podstawowa lista pracy. Zarezerwowana dla czlonkow lokalnego oddzialu w dobrej pozycji. Masz pierwszenstwo przed pracownikami w trasie. Ksiega 1 jest wywoływana pierwsza." : "The primary out-of-work list. Reserved for members in good standing of the local. You have priority over travelers. When work is available, Book 1 gets called first. Being on Book 1 means this is your home local."}</div>
                        </div>
                        <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"24px"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:8}}>{lang==="es" ? "Libro 2" : lang==="pl" ? "Ksiega 2" : "Book 2"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:12}}>{lang==="es" ? "Viajeros" : lang==="pl" ? "Podrozownicy" : "Travelers"}</div>
                          <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "Para miembros de OTROS locales que buscan trabajo fuera de su territorio. El Libro 2 solo se llama cuando el Libro 1 esta agotado. Eres un visitante — el trabajo es secundario y tus beneficios siguen yendo a tu local de origen." : lang==="pl" ? "Dla czlonkow INNYCH lokalnych oddzialow szukajacych pracy poza swoim terytorium. Ksiega 2 jest wywoływana tylko gdy Ksiega 1 jest wyczerpana. Jestes goscie — Twoje swiadczenia nadal trafiaja do Twojego lokalnego macierzystego." : "For members from OTHER locals looking for work outside their home territory. Book 2 only gets called when Book 1 is exhausted. You are a visitor — work is secondary, and your benefits still go back to your home local."}</div>
                        </div>
                      </div>
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:12, padding:"20px 24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8}}>{lang==="es" ? "La Regla Clave" : lang==="pl" ? "Kluczowa Zasada" : "The Key Rule"}</div>
                        <div style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "Si eres del Local A y viajas para trabajar en el territorio del Local B, te registras en el Libro 2 del Local B. Tienes trabajo — pero el Local B te llama despues de sus propios miembros del Libro 1. Cuando el trabajo termina, vuelves a casa." : lang==="pl" ? "Jesli jestes z Lokalu A i jedziesz do pracy na terytorium Lokalu B, rejestrujesz sie w Ksiedze 2 Lokalu B. Masz prace — ale Lokal B dzwoni do Ciebie po wlasnych czlonkach Ksiegi 1. Kiedy praca sie konczy, wracasz do domu." : "If you are from Local A and travel to work in Local B territory, you sign Book 2 at Local B. You get work — but Local B calls you after their own Book 1 members. When the job ends, you go home."}</div>
                      </div>
                    </div>
                  )
                },
                {
                  id:"homelocal",
                  title: lang==="es" ? "Tu Local de Origen — Elige con Cuidado" : lang==="pl" ? "Twoj Lokalny Macierzysty — Wybieraj Ostrozenie" : "Your Home Local — Choose Carefully",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Tu local de origen es el local donde eres miembro de pleno derecho. Es donde estan tus beneficios, tu pension, tu anualidad y tu representacion. Cuando te aceptan en un aprendizaje, el local que te acepta se convierte en tu local de origen. Esta es una decision de largo plazo." : lang==="pl" ? "Twoj lokalny macierzysty to lokalny oddział, w ktorym jestes pelnoletnim czlonkiem. To tutaj sa Twoje swiadczenia, emerytura, renta annuitetowa i reprezentacja. Gdy zostajesz przyjety do praktyki, lokalny, ktory Cie przyjmuje, staje sie Twoim macierzystym." : "Your home local is the local where you are a full dues-paying member. It is where your benefits live — pension, annuity, health insurance, and representation. When you get accepted into an apprenticeship, the local that accepts you becomes your home local. This is a long-term decision, not just a short-term one."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Tus Beneficios van Aqui" : lang==="pl" ? "Twoje Swiadczenia Trafiaja Tutaj" : "Your Benefits Live Here", desc: lang==="es" ? "No importa donde estes trabajando — tu pension, anualidad, seguro de salud y cuotas sindicales van a tu local de origen. Si estas viajando, el contratista alli aun contribuye a los fondos de beneficios, pero tu local de origen los gestiona." : lang==="pl" ? "Bez wzgledu na to, gdzie pracujesz — Twoja emerytura, renta annuitetowa, ubezpieczenie zdrowotne i skladki zwiazowe trafiaja do Twojego lokalnego macierzystego. Jesli jestes w trasie, wykonawca nadal wnosci wklad do funduszy swiadczen." : "No matter where you are working — your pension, annuity, health insurance, and union dues go to your home local. If you are traveling and working away from home, the contractor there still contributes to benefit funds, but your home local manages them." },
                          { num:"02", title: lang==="es" ? "Perspectiva de Trabajo y Geografia" : lang==="pl" ? "Perspektywy Pracy i Geografia" : "Work Outlook and Geography", desc: lang==="es" ? "Antes de solicitar, investiga cuanto trabajo hay disponible en el territorio del local. Un local en un mercado en crecimiento significa mas horas, mejores salarios y una carrera mas estable. Un local en un area con poco trabajo podria significar que viajas frecuentemente para mantenerte ocupado." : lang==="pl" ? "Przed zlozeniem wniosku zbadaj, ile pracy jest dostepne na terytorium lokalnego oddzialu. Lokalny oddział na rosnacym rynku oznacza wiecej godzin, lepsze wynagrodzenie i stabilniejsza kariere." : "Before applying, research how much work is available in the local territory. A local in a growing market means more hours, better wages, and a more stable career. A local in an area with little construction work might mean you frequently travel on Book 2 to stay busy." },
                          { num:"03", title: lang==="es" ? "Una Vez Dentro, Eres Miembro" : lang==="pl" ? "Raz Wewnatrz, Jestes Czlonkiem" : "Once In, You Are a Member", desc: lang==="es" ? "Una vez que te aceptan, ese local se convierte en tu hogar. Puedes transferirte mas tarde — pero no es simple y tiene implicaciones en tus beneficios. Es mucho mas facil elegir el local correcto desde el principio investigando geografia, perspectivas de trabajo y reputacion del local antes de aplicar." : lang==="pl" ? "Gdy zostaniesz przyjety do praktyki, ten lokalny oddział staje sie Twoim domem. Mozesz przeniesc sie pozniej — ale nie jest to proste i ma konsekwencje dla Twoich swiadczen." : "Once you are accepted, that local becomes your home. You can transfer later — but it is not simple and has benefit implications. It is much easier to choose the right local upfront by researching geography, work outlook, and the local reputation before applying." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"travel",
                  title: lang==="es" ? "Trabajo de Viaje — Como Funciona Realmente" : lang==="pl" ? "Praca w Trasie — Jak To Naprawde Dziala" : "Travel Work — How It Actually Works",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Una de las ventajas mas poderosas de ser miembro sindical es la capacidad de viajar — tomar trabajo en otros locales cuando tu mercado local esta lento. Aqui esta como funciona en la practica." : lang==="pl" ? "Jedna z najpotezniejszych zalet bycia czlonkiem zwiazku jest mozliwosc podrozowania — przyjmowania pracy w innych lokalnych oddzialach, gdy Twoj lokalny rynek jest powolny." : "One of the most powerful advantages of being a union member is the ability to travel — taking work in other locals when your home market is slow. Here is how it works in practice."}
                      </p>
                      <div style={{display:"flex", flexDirection:"column", gap:12}}>
                        {[
                          { n:"01", title: lang==="es" ? "Verificar si el Local esta Llamando al Libro 2" : lang==="pl" ? "Sprawdz czy Lokalny Wywoluje Ksiege 2" : "Check if the Local Is Calling Book 2", desc: lang==="es" ? "Antes de viajar, llama al local en el area donde quieres trabajar. Pregunta si estan llamando al Libro 2 y cuanto tiempo podria ser la espera. Algunos locales tienen trabajo constante para viajeros — otros raramente llegan al Libro 2." : lang==="pl" ? "Przed podrozą zadzwon do lokalnego oddzialu w obszarze, w ktorym chcesz pracowac. Zapytaj, czy wywoluja Ksiege 2 i jak dlugo moze trwac oczekiwanie." : "Before traveling, call the local in the area where you want to work. Ask if they are calling Book 2 and how long the wait might be. Some locals have consistent work available for travelers — others rarely reach Book 2." },
                          { n:"02", title: lang==="es" ? "Registrarse en el Libro 2" : lang==="pl" ? "Zarejestruj sie w Ksiedze 2" : "Sign the Book 2", desc: lang==="es" ? "Cuando llegas, te presentas en la sala sindical con tu tarjeta de membresia y te registras en el Libro 2. El local te llama cuando un contratista solicita mano de obra y estas al frente de la linea del Libro 2." : lang==="pl" ? "Gdy przyjeżdżasz, zgłaszasz sie do sali zwiazowej z karta czlonkowska i rejestrujesz sie w Ksiedze 2. Lokalny oddzial dzwoni do Ciebie, gdy wykonawca prosi o sile robocza." : "When you arrive, you show up at the union hall with your membership card and sign Book 2. The local calls you when a contractor requests labor and you are at the front of the Book 2 line." },
                          { n:"03", title: lang==="es" ? "Tus Beneficios Siguen Yendo a Casa" : lang==="pl" ? "Twoje Swiadczenia Nadal Trafiaja do Domu" : "Your Benefits Still Go Home", desc: lang==="es" ? "Cuando trabajas fuera de tu local, el contratista local sigue contribuyendo a los fondos de beneficios — pero esas contribuciones se envian de vuelta a tu local de origen. Tu pension, anualidad y seguro de salud continuan acumulandose en tu local de origen." : lang==="pl" ? "Kiedy pracujesz poza swoim lokalnym oddzialem, lokalny wykonawca nadal wnosci wklad do funduszy swiadczen — ale te skladki sa odsylane z powrotem do Twojego lokalnego macierzystego." : "When you work outside your local, the contractor there still contributes to benefit funds — but those contributions get sent back to your home local. Your pension, annuity, and health insurance continue building at your home local as if you were working there." },
                          { n:"04", title: lang==="es" ? "Cuando Tiene Sentido Viajar" : lang==="pl" ? "Kiedy Podrozowanie Ma Sens" : "When Traveling Makes Sense", desc: lang==="es" ? "Viajar tiene mas sentido cuando tu mercado local esta lento. Tambien es una excelente manera de acumular horas de pension, ganar experiencia en diferentes tipos de trabajo y construir tu reputacion en multiples mercados. Algunos trabajadores construyen carreras enteras viajando de proyecto en proyecto." : lang==="pl" ? "Podrozowanie ma najwiekszy sens, gdy Twoj lokalny rynek jest powolny. To takze swietny sposob na gromadzenie godzin emerytalnych i zdobywanie doswiadczenia w roznych rodzajach pracy." : "Traveling makes the most sense when your local market is slow and you have fixed expenses to cover. It is also a great way to accumulate pension hours, gain experience on different job types, and build your reputation across multiple markets. Some workers build entire careers traveling from project to project." },
                        ].map((s, i) => (
                          <div key={i} style={{display:"flex", gap:16, alignItems:"flex-start", padding:"16px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:800, color:"#FA8059", minWidth:28}}>{s.n}</div>
                            <div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:"#fff", marginBottom:4}}>{s.title}</div>
                              <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>{s.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"school",
                  title: lang==="es" ? "Modelos de Escuela de Aprendizaje" : lang==="pl" ? "Modele Szkoly Praktycznej" : "Apprenticeship School Models — Not All Are the Same",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Uno de los aspectos menos entendidos del aprendizaje sindical es como funciona la escuela — especificamente, cuando vas y si te pagan por estar alli. La respuesta varia significativamente segun el local." : lang==="pl" ? "Jednym z najmniej rozumianych aspektow praktyki zwiazowej jest to, jak dziala szkola — konkretnie, kiedy chodzisz i czy placza ci za to. Odpowiedz rozni sie znacznie w zaleznosci od lokalnego oddzialu." : "One of the least understood aspects of the union apprenticeship is how school works — specifically, when you go and whether you get paid for being there. The answer varies significantly by local. Here is what you need to ask before applying."}
                      </p>
                      <div style={{display:"flex", flexDirection:"column", gap:16, marginBottom:24}}>
                        {[
                          { model: lang==="es" ? "Modelo 1 — Escuela Diurna Pagada" : lang==="pl" ? "Model 1 — Platna Szkola Dzienna" : "Model 1 — Paid Daytime School", highlight:true, tag: lang==="es" ? "El Mejor Escenario" : lang==="pl" ? "Najlepszy Scenariusz" : "Best Case Scenario", desc: lang==="es" ? "En algunos locales los aprendices van a la escuela durante el dia y el contratista paga por ese tiempo. Recibes tu salario de aprendiz incluso mientras estas en el aula. Es el mejor escenario posible. Tu tiempo de escuela cuenta como horas de trabajo para beneficios y progresion." : lang==="pl" ? "W niektorych lokalnych oddzialach praktykanci chodza do szkoly w ciagu dnia, a wykonawca placi za ten czas. Otrzymujesz wynagrodzenie praktykanta nawet podczas przebywania w sali lekcyjnej. To najlepszy mozliwy scenariusz." : "In some locals apprentices go to school during the day and the contractor pays for that time. You receive your apprentice wage even while sitting in the classroom. It is the best possible scenario. Your school time counts as work hours for benefit and progression purposes." },
                          { model: lang==="es" ? "Modelo 2 — Escuela Diurna Sin Pago" : lang==="pl" ? "Model 2 — Szkola Dzienna Bez Wynagrodzenia" : "Model 2 — Unpaid Daytime School", highlight:false, tag: lang==="es" ? "Varia segun el local" : lang==="pl" ? "Rozni sie w zaleznosci od lokalu" : "Varies by local", desc: lang==="es" ? "Algunos locales envian a los aprendices a la escuela durante el dia, pero sin compensacion por el tiempo en el aula. Pierdes un dia de trabajo por semana para asistir a clase. Esto puede ser dificil financieramente al principio, especialmente para aprendices de primer ano con salarios mas bajos." : lang==="pl" ? "Niektore lokalne oddzialy wysylaja praktykantow do szkoly w ciagu dnia, ale nie ma wynagrodzenia za czas w sali lekcyjnej. Zasadniczo tracisz dzien pracy w tygodniu, aby chodzic na zajecia." : "Some locals send apprentices to school during the day, but there is no compensation for classroom time. You essentially lose a day of work per week to attend class. This can be financially tough early on, especially for first-year apprentices on lower wages." },
                          { model: lang==="es" ? "Modelo 3 — Escuela Nocturna Sin Pago" : lang==="pl" ? "Model 3 — Szkola Wieczorowa Bez Wynagrodzenia" : "Model 3 — Unpaid Evening School", highlight:false, tag: lang==="es" ? "El modelo mas comun en EE.UU." : lang==="pl" ? "Najpopularniejszy model w USA" : "Most common model across the US", desc: lang==="es" ? "El modelo mas prevalente. Los aprendices trabajan sus horas regulares durante el dia y luego van a la escuela por las noches — tipicamente una o dos noches por semana. Son dias largos, especialmente en invierno, pero permite mantener ingresos completos mientras se obtiene educacion." : lang==="pl" ? "Najbardziej rozpowszechniony model. Praktykanci pracuja swoje regularne godziny w ciagu dnia, a nastepnie chodza do szkoly wieczorami — zazwyczaj jedną lub dwie noce w tygodniu. To dlugie dni, szczegolnie zima." : "The most prevalent model. Apprentices work their regular hours during the day, then go to school in the evenings — typically one or two nights per week. There is no additional pay for school time. These are long days, especially in winter, but it allows you to maintain full work income while getting your education." },
                        ].map((m, i) => (
                          <div key={i} style={{background: m.highlight ? "rgba(250,128,89,0.06)" : "rgba(255,255,255,0.02)", border: m.highlight ? "1px solid rgba(250,128,89,0.25)" : "1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"24px"}}>
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:8}}>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: m.highlight ? "#FA8059" : "#fff"}}>{m.model}</div>
                              <div style={{fontSize:12, fontWeight:700, color: m.highlight ? "#FA8059" : "var(--muted)", background: m.highlight ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.06)", borderRadius:50, padding:"4px 12px", letterSpacing:"0.06em", textTransform:"uppercase"}}>{m.tag}</div>
                            </div>
                            <div style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>{m.desc}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:12, padding:"20px 24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8}}>{lang==="es" ? "Siempre Pregunta Antes de Aplicar" : lang==="pl" ? "Zawsze Pytaj Przed Zlozeniem Wniosku" : "Always Ask Before You Apply"}</div>
                        <div style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "El modelo de escuela no siempre esta anunciado en linea. Llama directamente al coordinador del aprendizaje y pregunta: Como funciona la escuela? Es durante el dia o por la noche? Los aprendices reciben compensacion por el tiempo escolar? Esta informacion podria afectar significativamente tu planificacion financiera." : lang==="pl" ? "Model szkoly nie zawsze jest oglaszany online. Zadzwon bezposrednio do koordynatora praktyki i zapytaj: Jak dziala szkola? Czy odbywa sie w ciagu dnia czy wieczorem? Czy praktykanci otrzymuja wynagrodzenie za czas szkolny?" : "The school model is not always advertised online. Call the local apprenticeship coordinator directly and ask: How does school work? Is it held during the day or in the evening? Do apprentices receive compensation for school time? This information could significantly affect your financial planning."}</div>
                      </div>
                    </div>
                  )
                },
              ].map((section) => (
                <div key={section.id} style={{marginBottom:12, border: localSection===section.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                  <button
                    onClick={() => setLocalSection(localSection===section.id ? null : section.id)}
                    style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left"}}
                  >
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: localSection===section.id ? "#FA8059" : "#fff"}}>{section.title}</span>
                    <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: localSection===section.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s"}}>+</span>
                  </button>
                  {localSection===section.id && (
                    <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "calculator" && (() => {
          const WAGE_DATA = {
            IBEW_I: { name: "IBEW Inside Wireman", tiers: { 1: { base:58, health:12.5, pension:9, annuity:5, vacation:4.5, other:2 }, 2: { base:48, health:12, pension:8, annuity:4.5, vacation:4, other:1.5 }, 3: { base:38, health:11, pension:7, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.40,0.50,0.65,0.75,0.85] },
            IBEW_L: { name: "IBEW Lineman", tiers: { 1: { base:65, health:14, pension:11, annuity:6, vacation:5, other:2 }, 2: { base:54, health:13, pension:9.5, annuity:5, vacation:4.5, other:2 }, 3: { base:44, health:12, pension:8, annuity:4, vacation:4, other:1.5 } }, appScale:[0.60,0.65,0.70,0.80,0.90] },
            UA: { name: "UA Plumber / Pipefitter", tiers: { 1: { base:60, health:13, pension:10, annuity:5.5, vacation:4.5, other:2 }, 2: { base:50, health:12, pension:8.5, annuity:4.5, vacation:4, other:1.5 }, 3: { base:40, health:11, pension:7.5, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.40,0.50,0.65,0.75,0.85] },
            BAC: { name: "BAC Bricklayer", tiers: { 1: { base:55, health:12, pension:9, annuity:5, vacation:4, other:2 }, 2: { base:46, health:11.5, pension:8, annuity:4.5, vacation:3.5, other:1.5 }, 3: { base:37, health:10.5, pension:7, annuity:4, vacation:3, other:1.5 } }, appScale:[0.50,0.60,0.70,0.80,0.90] },
            IW: { name: "Ironworker", tiers: { 1: { base:57, health:12.5, pension:9.5, annuity:5, vacation:4.5, other:2 }, 2: { base:47, health:12, pension:8, annuity:4.5, vacation:4, other:1.5 }, 3: { base:38, health:11, pension:7, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.50,0.60,0.70,0.80,0.90] },
          };
          const MAJOR_METROS = ["new york","los angeles","chicago","san francisco","boston","seattle","washington","philadelphia","miami","houston","dallas","denver","atlanta","portland","minneapolis","detroit","baltimore","san jose","austin","las vegas","new orleans","sacramento","san diego","phoenix"];
          const MID_MARKETS = ["columbus","cleveland","cincinnati","pittsburgh","milwaukee","indianapolis","kansas city","st louis","nashville","charlotte","raleigh","richmond","salt lake","tucson","albuquerque","memphis","louisville","oklahoma city","birmingham","hartford","buffalo","rochester","albany","omaha","des moines","grand rapids","toledo","akron","dayton"];

          const detectTier = (city) => {
            const c = city.toLowerCase().trim();
            if (MAJOR_METROS.some(m => c.includes(m))) return 1;
            if (MID_MARKETS.some(m => c.includes(m))) return 2;
            return 3;
          };

          const handleCalcCity = (val) => {
            setCalcCity(val);
            if (val.length > 2) setCalcTier(detectTier(val));
          };

          const getResults = () => {
            const data = WAGE_DATA[calcTrade];
            const tier = data.tiers[calcTier];
            const isJourneyman = calcYear === "journeyman";
            const appPct = isJourneyman ? 1 : data.appScale[parseInt(calcYear) - 1];
            const baseWage = Math.round(tier.base * appPct * 100) / 100;
            const fringe = tier.health + (isJourneyman ? tier.pension + tier.annuity : 0) + tier.vacation + tier.other;
            const totalPkg = parseFloat((baseWage + fringe).toFixed(2));
            const annualBase = Math.round(baseWage * calcHours);
            const annualPkg = Math.round(totalPkg * calcHours);
            const pensionContrib = isJourneyman ? tier.pension : tier.pension * appPct;
            const pensionProjection = Math.round(pensionContrib * calcHours * calcYearsCareer * 1.04);
            const nonUnionEquiv = Math.round(baseWage * 0.78 * 100) / 100;
            const nonUnionAnnual = Math.round(nonUnionEquiv * calcHours);
            const tierName = calcTier === 1 ? "Major Metro" : calcTier === 2 ? "Mid-Market" : "Smaller Market";
            return { baseWage, totalPkg, fringe, annualBase, annualPkg, pensionProjection, nonUnionEquiv, nonUnionAnnual, tier, isJourneyman, appPct, tierName, data };
          };

          const r = showResults ? getResults() : null;

          return (
            <div>
              <div className="history-hero">
                <div className="history-eyebrow">{lang==="es" ? "Conoce tu Valor Real" : lang==="pl" ? "Poznaj Swoja Prawdziwa Wartosc" : "Know Your Real Worth"}</div>
                <h1 className="history-title">
                  {lang==="es" ? <>{"Calculadora de "}<span className="accent">{"Salarios Sindicales"}</span></> : lang==="pl" ? <>{"Kalkulator "}<span className="accent">{"Wynagrodzen"}</span></> : <>{"Union "}<span className="accent">{"Wage Calculator"}</span></>}
                </h1>
                <p className="history-subtitle">
                  {lang==="es" ? "Calcula tu salario base, el valor total de tu paquete y tu proyeccion de pension. Compara con el equivalente no sindical." : lang==="pl" ? "Oblicz swoja podstawowa stawke, calkowita wartosc pakietu i projekcje emerytalna. Porownaj z odpowiednikiem niezwiazowym." : "Calculate your base wage, total compensation package value, and pension projection. Compare against the non-union equivalent."}
                </p>
              </div>

              <div style={{maxWidth:720, margin:"0 auto", padding:"40px 24px 80px"}}>
                <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"32px", marginBottom:20}}>

                  <div style={{marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "01 — Tu Oficio" : lang==="pl" ? "01 — Twoj Zawod" : "01 — Your Trade"}</div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                      {Object.entries(WAGE_DATA).map(([key, val]) => (
                        <button key={key} onClick={() => { setCalcTrade(key); setShowResults(false); }} style={{background: calcTrade===key ? "#FA8059" : "rgba(255,255,255,0.04)", border: calcTrade===key ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.1)", borderRadius:50, padding:"8px 16px", color: calcTrade===key ? "#000" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s"}}>
                          {key === "IBEW_I" ? "IBEW Inside" : key === "IBEW_L" ? "IBEW Lineman" : key === "UA" ? "UA Plumbers" : key === "BAC" ? "Bricklayers" : "Ironworkers"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "02 — Ano / Nivel" : lang==="pl" ? "02 — Rok / Poziom" : "02 — Apprentice Year or Journeyman"}</div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                      {["1","2","3","4","5","journeyman"].map(y => (
                        <button key={y} onClick={() => { setCalcYear(y); setShowResults(false); }} style={{background: calcYear===y ? "#FA8059" : "rgba(255,255,255,0.04)", border: calcYear===y ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.1)", borderRadius:50, padding:"8px 16px", color: calcYear===y ? "#000" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s"}}>
                          {y === "journeyman" ? (lang==="es" ? "Oficial" : lang==="pl" ? "Czeladnik" : "Journeyman") : (lang==="es" ? "Ano "+y : lang==="pl" ? "Rok "+y : "Year "+y)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "03 — Tu Ciudad" : lang==="pl" ? "03 — Twoje Miasto" : "03 — Your City or Market"}</div>
                    <input value={calcCity} onChange={e => handleCalcCity(e.target.value)} placeholder={lang==="es" ? "ej. Chicago, Cleveland, Phoenix..." : lang==="pl" ? "np. Chicago, Cleveland, Phoenix..." : "e.g. Chicago, Cleveland, Phoenix..."} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:15, color:"white", outline:"none", boxSizing:"border-box", marginBottom:8}} />
                    <div style={{display:"flex", gap:8}}>
                      {[{label: lang==="es" ? "Metropoli" : lang==="pl" ? "Metropolia" : "Major Metro", t:1},{label: lang==="es" ? "Mercado Medio" : lang==="pl" ? "Sredni Rynek" : "Mid-Market", t:2},{label: lang==="es" ? "Mercado Menor" : lang==="pl" ? "Mniejszy Rynek" : "Smaller Market", t:3}].map(({label, t}) => (
                        <button key={t} onClick={() => setCalcTier(t)} style={{background: calcTier===t ? "rgba(250,128,89,0.15)" : "rgba(255,255,255,0.03)", border: calcTier===t ? "1px solid rgba(250,128,89,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius:50, padding:"5px 12px", color: calcTier===t ? "#FA8059" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer"}}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28}}>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "04 — Horas/Ano" : lang==="pl" ? "04 — Godziny/Rok" : "04 — Hours Per Year"}</div>
                      <select value={calcHours} onChange={e => setCalcHours(parseInt(e.target.value))} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"white", outline:"none"}}>
                        <option value={1600}>1,600 hrs — slow year</option>
                        <option value={1800}>1,800 hrs — typical</option>
                        <option value={2000}>2,000 hrs — busy year</option>
                        <option value={2200}>2,200 hrs — overtime</option>
                      </select>
                    </div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:10}}>{lang==="es" ? "05 — Anos de Carrera" : lang==="pl" ? "05 — Lata Kariery" : "05 — Career Years"}</div>
                      <select value={calcYearsCareer} onChange={e => setCalcYearsCareer(parseInt(e.target.value))} style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"white", outline:"none"}}>
                        <option value={10}>10 years</option>
                        <option value={20}>20 years</option>
                        <option value={25}>25 years</option>
                        <option value={30}>30 years</option>
                        <option value={35}>35 years</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={() => setShowResults(true)} style={{width:"100%", background:"#FA8059", border:"none", borderRadius:12, padding:"16px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", color:"#000", cursor:"pointer", transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.9"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    {lang==="es" ? "Calcular mi Paquete →" : lang==="pl" ? "Oblicz Moj Pakiet →" : "Calculate My Package →"}
                  </button>
                </div>

                {showResults && r && (
                  <div>
                    <div style={{background:"rgba(250,128,89,0.08)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:20, padding:"28px 32px", marginBottom:16, textAlign:"center"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                        {WAGE_DATA[calcTrade].name} — {r.tierName} — {calcYear === "journeyman" ? (lang==="es" ? "Oficial" : lang==="pl" ? "Czeladnik" : "Journeyman") : (lang==="es" ? "Aprendiz Ano "+calcYear : lang==="pl" ? "Praktykant Rok "+calcYear : "Apprentice Year "+calcYear)}
                      </div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:72, fontWeight:900, color:"#FA8059", lineHeight:1}}>
                        {r.totalPkg.toFixed(2)}<span style={{fontSize:28}}>/hr</span>
                      </div>
                      <div style={{fontSize:14, color:"var(--muted)", marginTop:8}}>{lang==="es" ? "Valor total del paquete de compensacion" : lang==="pl" ? "Calkowita wartosc pakietu wynagrodzenia" : "Total compensation package value per hour"}</div>
                    </div>

                    <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"24px 28px", marginBottom:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:20}}>{lang==="es" ? "Desglose por Hora" : lang==="pl" ? "Podzial na Godzine" : "Hourly Breakdown"}</div>
                      {[
                        [lang==="es" ? "Salario Base" : lang==="pl" ? "Wynagrodzenie Podstawowe" : "Base Wage", "$"+r.baseWage.toFixed(2)+"/hr", true],
                        [lang==="es" ? "Salud y Bienestar" : lang==="pl" ? "Zdrowie i Swiadczenia" : "Health & Welfare", "$"+r.tier.health.toFixed(2)+"/hr", false],
                        ...(r.isJourneyman ? [[lang==="es" ? "Pension" : lang==="pl" ? "Emerytura" : "Pension", "$"+r.tier.pension.toFixed(2)+"/hr", false],[lang==="es" ? "Anualidad" : lang==="pl" ? "Renta" : "Annuity", "$"+r.tier.annuity.toFixed(2)+"/hr", false]] : []),
                        [lang==="es" ? "Vacaciones y Otros" : lang==="pl" ? "Urlop i Inne" : "Vacation & Other", "$"+(r.tier.vacation+r.tier.other).toFixed(2)+"/hr", false],
                      ].map(([label, val, isBase], i, arr) => (
                        <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom: i<arr.length-1 ? "1px solid rgba(58,80,104,0.3)" : "none"}}>
                          <span style={{fontSize:14, color: isBase ? "#fff" : "var(--muted)", fontWeight: isBase ? 700 : 400}}>{label}</span>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: isBase ? "#FA8059" : "var(--muted)"}}>{val}</span>
                        </div>
                      ))}
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0 0", marginTop:8, borderTop:"2px solid #FA8059"}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, color:"#fff"}}>{lang==="es" ? "TOTAL POR HORA" : lang==="pl" ? "LACZNIE NA GODZINE" : "TOTAL PER HOUR"}</span>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059"}}>{r.totalPkg.toFixed(2)}/hr</span>
                      </div>
                    </div>

                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                      <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px", textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>{lang==="es" ? "Ingreso Anual" : lang==="pl" ? "Roczny Dochod" : "Annual Income"}<br/><span style={{color:"rgba(160,180,196,0.5)"}}>({calcHours.toLocaleString()} hrs)</span></div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:34, fontWeight:900, color:"#FA8059"}}>{r.annualBase.toLocaleString()}</div>
                        <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "salario base" : lang==="pl" ? "wynagrodzenie podstawowe" : "take-home wages"}</div>
                        <div style={{borderTop:"1px solid rgba(58,80,104,0.3)", marginTop:12, paddingTop:12}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:700, color:"rgba(250,128,89,0.6)"}}>{r.annualPkg.toLocaleString()}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "valor total del paquete" : lang==="pl" ? "calkowita wartosc pakietu" : "total package value"}</div>
                        </div>
                      </div>
                      <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px", textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>{lang==="es" ? "Proyeccion de Pension" : lang==="pl" ? "Projekcja Emerytalna" : "Pension Projection"}<br/><span style={{color:"rgba(160,180,196,0.5)"}}>({calcYearsCareer} {lang==="es" ? "anos" : lang==="pl" ? "lat" : "years"})</span></div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:34, fontWeight:900, color:"#FA8059"}}>{r.pensionProjection.toLocaleString()}</div>
                        <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "valor estimado acumulado" : lang==="pl" ? "szacowana wartosc skumulowana" : "estimated accumulated value"}</div>
                      </div>
                    </div>

                    <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"24px 28px", marginBottom:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:16}}>{lang==="es" ? "Sindical vs No Sindical" : lang==="pl" ? "Zwiazowy vs Niezwiazowy" : "Union vs Non-Union"}</div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"#FA8059", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "Sindical" : lang==="pl" ? "Zwiazowy" : "Union"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"#FA8059"}}>{r.baseWage.toFixed(2)}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "base/hr" : lang==="pl" ? "podstawa/godz" : "base/hr"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(250,128,89,0.6)", marginTop:6}}>{r.annualBase.toLocaleString()}/yr</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>{lang==="es" ? "No Sindical" : lang==="pl" ? "Niezwiazowy" : "Non-Union (Est.)"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:42, fontWeight:900, color:"var(--muted)"}}>{r.nonUnionEquiv.toFixed(2)}</div>
                          <div style={{fontSize:12, color:"var(--muted)"}}>{lang==="es" ? "estimado/hr" : lang==="pl" ? "szacowane/godz" : "estimated/hr"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:"rgba(160,180,196,0.5)", marginTop:6}}>{r.nonUnionAnnual.toLocaleString()}/yr</div>
                        </div>
                      </div>
                      <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", paddingTop:16, textAlign:"center"}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#FA8059"}}>+{(r.annualBase - r.nonUnionAnnual).toLocaleString()}/yr</span>
                        <span style={{fontSize:13, color:"var(--muted)", marginLeft:10}}>{lang==="es" ? "mas en salario base como miembro sindical" : lang==="pl" ? "wiecej w wynagrodzeniu jako czlonek zwiazku" : "more in base wages as a union member"}</span>
                      </div>
                    </div>

                    <div style={{fontSize:12, color:"rgba(160,180,196,0.4)", lineHeight:1.6, textAlign:"center", padding:"0 16px", marginBottom:20}}>
                      {lang==="es" ? "* Estimaciones basadas en promedios regionales aproximados. Las tarifas reales varian por local, contrato y ano." : lang==="pl" ? "* Szacunki oparte na przyblizonych sredniach regionalnych. Rzeczywiste stawki roznia sie w zaleznosci od lokalu i umowy." : "* Estimates based on approximate regional averages. Actual rates vary by local, contract, and year. Contact your local for exact rates."}
                    </div>

                    <div style={{textAlign:"center"}}>
                      <button onClick={() => setShowResults(false)} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.15)", borderRadius:50, padding:"10px 24px", color:"var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer"}}>
                        {lang==="es" ? "Recalcular" : lang==="pl" ? "Przelicz Ponownie" : "Recalculate"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {page === "veterans" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Para Veteranos y Militares" : lang==="pl" ? "Dla Weteranów i Żołnierzy" : "For Veterans & Service Members"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Tu Servicio "}<span className="accent">{"Abre la Puerta"}</span></> : lang==="pl" ? <>{"Twoja Służba "}<span className="accent">{"Otwiera Drzwi"}</span></> : <>{"Your Service "}<span className="accent">{"Opens the Door"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Las habilidades que desarrollaste en el servicio militar son exactamente lo que los oficios sindicales buscan." : lang==="pl" ? "Umiejętności zdobyte w służbie wojskowej to dokładnie to, czego szukają związkowe zawody budowlane." : "The skills you built in uniform are exactly what the union trades are looking for. Thousands of veterans have already made the transition."}
              </p>
            </div>

            <div style={{maxWidth:820, margin:"0 auto", padding:"40px 24px 80px"}}>
              {[
                {
                  id:"why",
                  title: lang==="es" ? "Por Qué los Veteranos Prosperan en los Oficios" : lang==="pl" ? "Dlaczego Weterani Odnoszą Sukces w Zawodach" : "Why Veterans Thrive in the Trades",
                  content: (
                    <div className="impact-grid" style={{marginTop:16}}>
                      {[
                        { num:"01", title: lang==="es" ? "Disciplina y Puntualidad" : lang==="pl" ? "Dyscyplina i Punktualność" : "Discipline & Punctuality", desc: lang==="es" ? "Los oficios sindicales valoran la misma ética de trabajo que el ejército inculca." : lang==="pl" ? "Związkowe zawody budowlane cenią tę samą etykę pracy, którą wojsko wpaja." : "Union trades value the same work ethic the military instills. Show up, be ready, give 100%." },
                        { num:"02", title: lang==="es" ? "Trabajo en Equipo" : lang==="pl" ? "Praca Zespołowa" : "Teamwork", desc: lang==="es" ? "Los veteranos entienden el trabajo en equipo desde el primer día — exactamente lo que requieren las cuadrillas de construcción." : lang==="pl" ? "Weterani rozumieją pracę zespołową od pierwszego dnia — dokładnie to, czego wymagają ekipy budowlane." : "Veterans understand teamwork from day one — exactly what construction crews require." },
                        { num:"03", title: lang==="es" ? "Conciencia de Seguridad" : lang==="pl" ? "Świadomość Bezpieczeństwa" : "Safety Awareness", desc: lang==="es" ? "Los veteranos están entrenados para operar con protocolos de seguridad en entornos de alta presión." : lang==="pl" ? "Weterani są przeszkoleni do pracy zgodnie z protokołami bezpieczeństwa w środowiskach wysokiego ciśnienia." : "Veterans are trained to operate with safety protocols in high-pressure environments." },
                        { num:"04", title: lang==="es" ? "Habilidades Técnicas" : lang==="pl" ? "Umiejętności Techniczne" : "Technical Skills", desc: lang==="es" ? "Muchos MOS militares se traducen directamente a habilidades comerciales — electricidad, HVAC, plomería, metalurgia." : lang==="pl" ? "Wiele wojskowych specjalności przekłada się bezpośrednio na umiejętności handlowe — elektryka, HVAC, hydraulika." : "Many military MOS codes translate directly to trade skills — electrical, HVAC, plumbing, metalwork." },
                        { num:"05", title: lang==="es" ? "Liderazgo" : lang==="pl" ? "Przywództwo" : "Leadership", desc: lang==="es" ? "Los veteranos están naturalmente preparados para roles de capataz y superintendente en los oficios." : lang==="pl" ? "Weterani są naturalnie przygotowani do ról brygadzisty i superintendenta w zawodach budowlanych." : "Veterans who managed teams and missions are naturally prepared for foreman and superintendent roles." },
                        { num:"06", title: lang==="es" ? "Trabajo Bajo Presión" : lang==="pl" ? "Praca Pod Presją" : "Working Under Pressure", desc: lang==="es" ? "Los sitios de construcción exigen las mismas capacidades de toma de decisiones bajo presión que el servicio militar." : lang==="pl" ? "Place budowy wymagają tych samych zdolności decyzyjnych pod presją co służba wojskowa." : "Construction sites demand the same under-pressure decision-making as military service." },
                      ].map((item, i) => (
                        <div key={i} className="impact-card">
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                          <div className="impact-title">{item.title}</div>
                          <div className="impact-desc">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  id:"h2h",
                  title: "Helmets to Hardhats",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:24}}>
                        {lang==="es" ? "Helmets to Hardhats (H2H) es el puente oficial del servicio militar a las carreras sindicales de construcción. Es gratuito, está respaldado por el sindicato y está diseñado específicamente para veteranos militares." : lang==="pl" ? "Helmets to Hardhats (H2H) to oficjalny most od służby wojskowej do kariery w związkowym budownictwie. Jest bezpłatny i zaprojektowany specjalnie dla weteranów wojskowych." : "Helmets to Hardhats (H2H) is the official bridge from military service to union construction careers. Free, union-backed, and designed specifically for military veterans."}
                      </p>
                      <div style={{display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:24}}>
                        {[
                          { num:"400+", label: lang==="es" ? "Sindicatos Asociados" : lang==="pl" ? "Partnerskich Związków" : "Partner Unions" },
                          { num:"40K+", label: lang==="es" ? "Veteranos Conectados" : lang==="pl" ? "Połączonych Weteranów" : "Veterans Connected" },
                          { num: lang==="es" ? "Gratis" : lang==="pl" ? "Bezpłatny" : "Free", label: lang==="es" ? "Para Veteranos" : lang==="pl" ? "Dla Weteranów" : "For All Veterans" },
                        ].map((s, i) => (
                          <div key={i} style={{background:"transparent", border:"1px solid rgba(250,128,89,0.2)", borderRadius:12, padding:"16px 24px", textAlign:"center", flex:1, minWidth:100}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:"#FA8059", lineHeight:1}}>{s.num}</div>
                            <div style={{fontSize:12, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:6, fontWeight:600}}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <a className="btn-primary" href="https://helmetstohardhats.org" target="_blank" rel="noopener noreferrer" style={{display:"inline-block", textDecoration:"none"}}>
                        {lang==="es" ? "Visitar Helmets to Hardhats →" : lang==="pl" ? "Odwiedź Helmets to Hardhats →" : "Visit Helmets to Hardhats →"}
                      </a>
                    </div>
                  )
                },
                {
                  id:"skills",
                  title: lang==="es" ? "Tus Habilidades Militares se Traducen" : lang==="pl" ? "Twoje Umiejętności Wojskowe się Przekładają" : "Your Military Skills Translate",
                  content: (
                    <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
                      {[
                        { mil: lang==="es" ? "Técnico de Electrónica de Aviación" : lang==="pl" ? "Technik Elektroniki Lotniczej" : "Aviation Electronics Technician", trade: "IBEW Electrician" },
                        { mil: lang==="es" ? "Mecánico de Vehículos de Motor" : lang==="pl" ? "Mechanik Pojazdów Silnikowych" : "Motor Vehicle Mechanic", trade: "Sheet Metal / Ironworker" },
                        { mil: lang==="es" ? "Especialista en Construcción" : lang==="pl" ? "Specjalista Budowlany" : "Construction Specialist (Combat Engineer)", trade: "UBC Carpenter / LIUNA Laborer" },
                        { mil: lang==="es" ? "Especialista en Sistemas de Armas" : lang==="pl" ? "Specjalista Systemów Uzbrojenia" : "Weapons Systems Specialist", trade: "UA Pipefitter / Boilermaker" },
                        { mil: lang==="es" ? "Especialista en HVAC" : lang==="pl" ? "Specjalista HVAC" : "HVAC Specialist", trade: "UA Plumber / Pipefitter" },
                        { mil: lang==="es" ? "Técnico en Comunicaciones" : lang==="pl" ? "Technik Łączności" : "Communications Technician", trade: "IBEW Electrician (Low Voltage)" },
                      ].map((item, i) => (
                        <div key={i} style={{display:"flex", alignItems:"center", gap:16, padding:"14px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10}}>
                          <div style={{flex:1, fontSize:14, color:"var(--muted)"}}>{item.mil}</div>
                          <div style={{color:"#FA8059", fontSize:16, fontWeight:700}}>→</div>
                          <div style={{flex:1, fontSize:14, color:"#fff", fontWeight:600}}>{item.trade}</div>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  id:"start",
                  title: lang==="es" ? "Cómo Empezar" : lang==="pl" ? "Jak Zacząć" : "How to Get Started",
                  content: (
                    <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:12}}>
                      {[
                        { n:"01", title: "Helmets to Hardhats", desc: lang==="es" ? "Regístrate gratis en helmetstohardhats.org — toma 5 minutos." : lang==="pl" ? "Zarejestruj się bezpłatnie na helmetstohardhats.org — zajmuje 5 minut." : "Register free at helmetstohardhats.org — takes 5 minutes." },
                        { n:"02", title: lang==="es" ? "Usa Union Pathways" : lang==="pl" ? "Użyj Union Pathways" : "Use Union Pathways Search", desc: lang==="es" ? "Encuentra los locales sindicales más cercanos y contacta coordinadores de aprendizaje directamente." : lang==="pl" ? "Znajdź najbliższe lokale związkowe i skontaktuj się bezpośrednio z koordynatorami praktyk." : "Find the nearest union locals and contact apprenticeship coordinators directly." },
                        { n:"03", title: lang==="es" ? "Aplica a Múltiples Sindicatos" : lang==="pl" ? "Aplikuj do Wielu Związków" : "Apply to Multiple Unions", desc: lang==="es" ? "No esperes en uno. Aplica a 3-5 al mismo tiempo para maximizar tus posibilidades." : lang==="pl" ? "Nie czekaj na jeden. Aplikuj do 3-5 jednocześnie." : "Don't wait on one. Apply to 3-5 at once to maximize your chances." },
                        { n:"04", title: lang==="es" ? "Destaca tu Experiencia Militar" : lang==="pl" ? "Podkreśl Doświadczenie Wojskowe" : "Highlight Your Military Experience", desc: lang==="es" ? "Sé específico sobre tu MOS, entrenamiento técnico y habilidades de liderazgo." : lang==="pl" ? "Bądź konkretny co do swojego MOS, szkolenia technicznego i umiejętności przywódczych." : "Be specific about your MOS, technical training, and leadership skills. This is a major advantage." },
                      ].map((s, i) => (
                        <div key={i} style={{display:"flex", gap:16, alignItems:"flex-start", padding:"16px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:800, color:"#FA8059", minWidth:28}}>{s.n}</div>
                          <div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:"#fff", marginBottom:4}}>{s.title}</div>
                            <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                },
              ].map((section) => (
                <div key={section.id} style={{marginBottom:12, border: vetSection===section.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                  <button
                    onClick={() => setVetSection(vetSection===section.id ? null : section.id)}
                    style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left"}}
                  >
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: vetSection===section.id ? "#FA8059" : "#fff"}}>{section.title}</span>
                    <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: vetSection===section.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s"}}>+</span>
                  </button>
                  {vetSection===section.id && (
                    <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "about" && (
          <div>
            {/* HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">Built by Tradespeople, for Tradespeople</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"La Historia "}<span className="accent">{"Detras de la Plataforma"}</span></> : lang==="pl" ? <>{"Historia "}<span className="accent">{"Platformy"}</span></> : <>{"The Story "}<span className="accent">{"Behind the Platform"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Union Pathways no fue construida en una sala de juntas. Fue construida en una obra de construccion." : lang==="pl" ? "Union Pathways nie zostalo zbudowane w sali konferencyjnej. Zostalo zbudowane na placu budowy." : "Union Pathways was not built in a boardroom. It was built on a job site."}
              </p>

              {/* STATS ROW */}
              <div className="history-stats" style={{marginTop:48}}>
                {[
                  { num: "452K+", label: lang==="es" ? "Seguidores Colectivos" : lang==="pl" ? "Lacznych Obserwujacych" : "Collective Followers" },
                  { num: "600M+", label: lang==="es" ? "Visualizaciones Colectivas" : lang==="pl" ? "Lacznych Wyswietleni" : "Collective Views" },
                  { num: "30+", label: lang==="es" ? "Anos de Experiencia Colectiva en Oficios" : lang==="pl" ? "Lat Lacznego Doswiadczenia w Zawodach" : "Years of Collective Trades Experience" },
                  { num: "1", label: lang==="es" ? "Mision — Todo Sindical. Un Lugar." : lang==="pl" ? "Misja — Wszystko Zwiazowe. Jedno Miejsce." : "Mission — Everything Union. One Place." },
                ].map((s, i) => (
                  <div key={i} className="history-stat">
                    <div className="history-stat-num">{s.num}</div>
                    <div className="history-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEAM SECTION */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Las Personas "}<span className="accent">{"Detras de la Plataforma"}</span></> : lang==="pl" ? <>{"Ludzie "}<span className="accent">{"Za Platforma"}</span></> : <>{"The People "}<span className="accent">{"Behind the Platform"}</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Electricistas, albaniles, aisladores — voces reales del movimiento laboral moderno." : lang==="pl" ? "Elektrycy, murarze, izolatorzy — prawdziwe glosy nowoczesnego ruchu pracowniczego." : "Electricians, bricklayers, insulators — real voices of the modern labor movement."}</div>

              <div style={{display:"flex", flexDirection:"column", gap:12, marginTop:24}}>
                {[
                  {
                    id:"noah",
                    img:"/partner-noah.png",
                    name:"Noah Alassaf",
                    handle:"Spanky The Sparky",
                    union: lang==="es" ? "IBEW — Electricista Oficial / Superintendente" : lang==="pl" ? "IBEW — Elektryk Czeladnik / Superintendent" : "IBEW — Journeyman Electrician & Superintendent",
                    bio: lang==="es" ? "Noah Alassaf es un orgulloso miembro del IBEW y superintendente electrico con una trayectoria que combina experiencia practica en campo, propiedad de negocios y una voz fuerte en el movimiento laboral sindical actual. Despues de obtener una licenciatura de la Universidad de Ohio junto con dos titulos de asociado en el campo electrico, fundo y vendio dos negocios al inicio de su carrera. Comenzo en el sector electrico no sindical antes de hacer la transicion al sindicato, ascendiendo desde CW hasta aprendiz, oficial y finalmente superintendente. Hoy, Noah es el creador de Spanky the Sparky, una plataforma enfocada en educar, abogar y modernizar la forma en que las personas ven y acceden a las carreras en los oficios sindicales." : lang==="pl" ? "Noah Alassaf jest dumnym czlonkiem IBEW i superintendentem elektrycznym z doswiadczeniem laczacym praktyczna prace w terenie, wlasnosc biznesu i silny glos w dzisiejszym zwiazowym ruchu pracowniczym. Po uzyskaniu tytulu licencjata na Ohio University oraz dwoch tytulów Associates w dziedzinie elektrycznej, zakladal i sprzedawal dwie firmy na poczatku kariery. Rozpoczal w niezwiazowym sektorze elektrycznym, zanim przeszedl do zwiazku, awansujac od CW przez praktykanta, czeladnika az do superintendenta. Dzis Noah jest tworca Spanky the Sparky." : "Noah Alassaf is a proud IBEW member and electrical superintendent with a background that blends hands-on field experience, business ownership, and a strong voice in today's union labor movement. After earning a bachelor's degree from Ohio University along with two associate degrees in the electrical field, he went on to start and sell two businesses early in his career. He began in the non-union electrical sector before making the transition into the union, working his way up from CW to apprentice, journeyman, and ultimately superintendent. Today, Noah is the creator behind Spanky the Sparky — a growing platform focused on educating, advocating, and modernizing how people view and access careers in the union trades.",
                    linktree: "https://linktr.ee/spankythesparky",
                  },
                  {
                    id:"david",
                    img:"/partner-david.jpg",
                    name:"David Knipp",
                    handle:"Proud Union Guy",
                    union: lang==="es" ? "Heat & Frost Insulators Local 1" : lang==="pl" ? "Heat & Frost Insulators Local 1" : "Heat & Frost Insulators Local 1",
                    bio: lang==="es" ? "David Knipp es un orgulloso miembro de Heat and Frost Insulators Local 1 cuya vida cambio cuando entro a los oficios sindicales en 2009. Conocido como Proud Union Guy, ha construido una creciente plataforma nacional hablando directamente a los trabajadores sobre oportunidad, equidad y el poder de los sindicatos. A traves de su contenido y discursos, David esta ayudando a liderar una nueva ola de voces de la clase trabajadora — impulsando un movimiento laboral moderno." : lang==="pl" ? "David Knipp jest dumnym czlonkiem Heat and Frost Insulators Local 1, ktorego zycie zmienilo sie, gdy w 2009 roku wkroczyl do zwiazowych zawodow budowlanych. Znany jako Proud Union Guy, zbudowal rosnaca ogolnokrajowa platforme, mowiac bezposrednio do pracownikow o mozliwosciach, sprawiedliwosci i sile zwiazkow zawodowych." : "David Knipp is a proud member of Heat and Frost Insulators Local 1 whose life changed when he entered the union trades in 2009. Known as Proud Union Guy, he has built a growing national platform by speaking directly to working people about opportunity, fairness, and the power of unions. Through his content and speaking, David is helping lead a new wave of working-class voices — pushing to spark a modern-day labor movement.",
                    linktree: null,
                  },
                  {
                    id:"sean",
                    img:"/partner-sean.jpg",
                    name:"Sean Allen",
                    handle:"Union Proud Warrior",
                    union: lang==="es" ? "BAC Local 21 Chicago — Presidente" : lang==="pl" ? "BAC Local 21 Chicago — Prezydent" : "BAC Local 21 Chicago — President",
                    bio: lang==="es" ? "Sean Allen es el Presidente del Local 21 de Chicago de la union de albaniles BAC y creador de Proud Union Warrior. Como miembro de 4a generacion del BAC, conoce la importancia de organizar y hacer crecer el movimiento laboral. Union Pathways es la forma mas facil y amigable de encontrar un sindicato y aprender mas sobre ellos de las personas que lo viven todos los dias." : lang==="pl" ? "Sean Allen jest Prezydentem Local 21 w Chicago zwiazku murarzy BAC i tworca Proud Union Warrior. Jako czlonek BAC 4. pokolenia, zna znaczenie organizowania i rozwijania ruchu pracowniczego. Union Pathways to najlatwiejszy i najbardziej przyjazny dla uzytkownika sposob na znalezienie zwiazku zawodowego." : "Sean Allen is the President of BAC Local 21 Chicago and creator of Proud Union Warrior. As a 4th generation BAC member, he knows the importance of organizing and growing the labor movement. Union Pathways is the easiest, most user-friendly way to find a union and learn more about them from the people who live it every day.",
                    linktree: null,
                  },
                  {
                    id:"jimmy",
                    img:"/partner-sean.jpg",
                    name:"Jimmy Fulton",
                    handle:"Union Proud Warrior",
                    union: lang==="es" ? "BAC Local 21 Chicago — Agente de Negocios / Vicepresidente" : lang==="pl" ? "BAC Local 21 Chicago — Agent ds. Biznesu / Wiceprezes" : "BAC Local 21 Chicago — Business Agent & Vice President",
                    bio: lang==="es" ? "Jimmy Fulton es un orgulloso colocador de azulejos sindical y miembro del BAC Local 21. Como miembro sindical de primera generacion, su carrera es prueba de lo que la oportunidad, la formacion y la hermandad en los oficios pueden lograr. Mas alla del sitio de trabajo, Jimmy es Agente de Negocios para los Colocadores de Azulejos y Acabadores del Local 21 en Chicago. Sirve como Vicepresidente y socio contribuyente de Proud Union Warrior, donde ayuda a amplificar la voz de la clase trabajadora y promover los valores sindicales." : lang==="pl" ? "Jimmy Fulton jest dumnym zwiazowym glazikiem i czlonkiem BAC Local 21. Jako czlonek zwiazku pierwszego pokolenia, jego kariera jest dowodem na to, co mozliwosci, szkolenie i braterstwo w zawodach moga naprawde zapewnic. Poza placem budowy Jimmy jest Agentem ds. Biznesu dla Glazikow i Wykanczajacych z Local 21 w Chicago. Pelni funkcje Wiceprezesa i wspolpracujacego partnera Proud Union Warrior." : "Jimmy Fulton is a proud Union Tile Setter and member of BAC Local 21. As a first-generation union member, his career stands as proof of what opportunity, training, and brotherhood in the trades can truly deliver. Beyond the jobsite, Jimmy is a Business Agent for Local 21 Tile Setters and Finishers in Chicago. He serves as Vice President and contributing partner of Proud Union Warrior, where he helps amplify the voice of the working class, promote union values, and build a platform that represents the grit, pride, and future of the trades.",
                    linktree: null,
                  },
                ].map((partner) => (
                  <div key={partner.id} style={{border: partnerSection===partner.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                    <button
                      onClick={() => setPartnerSection(partnerSection===partner.id ? null : partner.id)}
                      style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left", gap:16}}
                    >
                      <div style={{display:"flex", alignItems:"center", gap:16}}>
                        <img src={partner.img} alt={partner.name} style={{width:52, height:52, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(250,128,89,0.4)", flexShrink:0, background:"#000"}} />
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: partnerSection===partner.id ? "#FA8059" : "#fff", lineHeight:1.1}}>{partner.name}</div>
                          <div style={{fontSize:12, color:"#FA8059", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:3}}>{partner.handle}</div>
                        </div>
                      </div>
                      <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: partnerSection===partner.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s", flexShrink:0}}>+</span>
                    </button>
                    {partnerSection===partner.id && (
                      <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                        <div style={{display:"flex", gap:24, alignItems:"flex-start", marginTop:20, flexWrap:"wrap"}}>
                          <img src={partner.img} alt={partner.name} style={{width:120, height:120, borderRadius:16, objectFit:"cover", border:"1px solid rgba(250,128,89,0.3)", flexShrink:0, background:"#000"}} />
                          <div style={{flex:1, minWidth:200}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", color:"#FA8059", textTransform:"uppercase", marginBottom:8}}>{partner.union}</div>
                            <p style={{fontSize:14, color:"var(--muted)", lineHeight:1.7, margin:"0 0 16px"}}>{partner.bio}</p>
                            {partner.linktree && (
                              <a href={partner.linktree} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:"50px", padding:"8px 20px", color:"#FA8059", fontSize:"13px", fontWeight:"700", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", textDecoration:"none"}}>
                                linktr.ee/spankythesparky →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line"/>

            {/* MISSION */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"La "}<span className="accent">{"Mision"}</span></> : lang==="pl" ? <>{"Nasza "}<span className="accent">{"Misja"}</span></> : <>{"The "}<span className="accent">{"Mission"}</span></>}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"14px",textTransform:"uppercase"}}>01</div>
                  <div className="impact-title">{lang==="es" ? "Construido por Trabajadores" : lang==="pl" ? "Zbudowane przez Pracownikow" : "Built by Workers"}</div>
                  <div className="impact-desc">{lang==="es" ? "No somos una empresa de marketing. Somos electricistas, albaniles e insuladores que ven la necesidad de una plataforma real para trabajadores reales." : lang==="pl" ? "Nie jestesmy firma marketingowa. Jestesmy elektrykami, murarzami i izolatorami, ktorzy widza potrzebe prawdziwej platformy dla prawdziwych pracownikow." : "We are a small but mighty group — not a marketing agency, not a faceless brand. We are boots-on-the-ground tradespeople who clock in every day, then come home and build something better for the next generation."}</div>
                </div>
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>02</div>
                  <div className="impact-title">{lang==="es" ? "Todo en Un Lugar" : lang==="pl" ? "Wszystko w Jednym Miejscu" : "Everything in One Place"}</div>
                  <div className="impact-desc">{lang==="es" ? "Locales sindicales, rutas de carrera, beneficios, historia, recursos para veteranos — todo en una sola plataforma. Gratis. Siempre." : lang==="pl" ? "Lokale zwiazowe, sciezki kariery, swiadczenia, historia, zasoby dla weteranow — wszystko w jednej platformie. Bezplatnie. Zawsze." : "Union locals, career paths, benefits, history, veteran resources — everything in one platform. Free. Always."}</div>
                </div>
                <div className="impact-card">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>03</div>
                  <div className="impact-title">{lang==="es" ? "Por los Trabajadores" : lang==="pl" ? "Dla Pracownikow" : "For the Workers"}</div>
                  <div className="impact-desc">{lang==="es" ? "Ya seas un aprendiz, un oficial, un veterano o alguien que busca entrar a los oficios — este es tu recurso." : lang==="pl" ? "Niezaleznie od tego, czy jestes praktykantem, czeladnikiem, weteranem czy kims, kto chce wejsc do zawodow — to jest Twoj zasob." : "Whether you are an apprentice, journeyman, veteran, or someone looking to break into the trades — this is your resource."}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "contact" && (
          <div className="page" style={{maxWidth: 860}}>
            <div className="page-eyebrow">{lang==="es" ? "Contáctanos" : lang==="pl" ? "Skontaktuj się" : "Get In Touch"}</div>
            <h1 className="page-title">{lang==="es" ? "Contáctenos" : lang==="pl" ? "Kontakt" : "Contact Us"}</h1>
            <p className="page-sub">
              {lang==="es"
                ? "¿Tienes una pregunta sobre un oficio, tu local sindical o este sitio? Contáctanos y te responderemos."
                : lang==="pl"
                ? "Masz pytanie dotyczące zawodu, lokalnego związku lub tej strony? Skontaktuj się z nami, a odpiszemy."
                : "Have a question about a trade, your local union, or this site? Reach out and we'll get back to you."}
            </p>

            {contactSent ? (
              <div className="contact-success">
                <div className="contact-success-icon">✅</div>
                <h3>{lang==="es" ? "¡Mensaje Enviado!" : lang==="pl" ? "Wiadomość Wysłana!" : "Message Sent!"}</h3>
                <p>{lang==="es" ? "Gracias por contactarnos. Te responderemos lo antes posible." : lang==="pl" ? "Dziękujemy za kontakt. Odpiszemy tak szybko, jak to możliwe." : "Thanks for reaching out. We'll get back to you as soon as possible."}</p>
                <button className="btn-primary" onClick={() => { setContactSent(false); setContactForm({ name:"", email:"", phone:"", subject:"", message:"" }); }}>
                  {lang==="es" ? "Enviar Otro Mensaje" : lang==="pl" ? "Wyślij Kolejną Wiadomość" : "Send Another Message"}
                </button>
              </div>
            ) : (
              <div className="contact-grid">
                {/* LEFT — info */}
                <div>
                  <div className="contact-info-block">
                    <div className="contact-info-label">{lang==="es" ? "Sobre Este Sitio" : lang==="pl" ? "O Tej Stronie" : "About This Site"}</div>
                    <div className="contact-info-value">
                      {lang==="es"
                        ? "Union Pathways es un recurso gratuito que conecta a los trabajadores con su local sindical de construcción más cercano. No estamos afiliados a ningún sindicato internacional — somos construidos por trabajadores del oficio, para trabajadores del oficio."
                        : lang==="pl"
                        ? "Union Pathways to bezpłatny zasób łączący pracowników z najbliższym lokalnym związkiem zawodowym w budownictwie. Nie jesteśmy powiązani z żadnym międzynarodowym związkiem — jesteśmy zbudowani przez rzemieślników, dla rzemieślników."
                        : "Union Pathways is a free resource connecting workers with their nearest union construction local. We are not affiliated with any international union — we're built by tradespeople, for tradespeople."}
                    </div>
                  </div>
                  <div className="contact-info-block">
                    <div className="contact-info-label">{lang==="es" ? "En Qué Podemos Ayudar" : lang==="pl" ? "W czym możemy pomóc" : "What We Can Help With"}</div>
                    <div className="contact-info-value" style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>
                      {lang==="es" ? (
                        <>
                          ✔ Preguntas sobre cómo unirse a un oficio sindical<br/>
                          ✔ Actualizar o corregir información del local sindical<br/>
                          ✔ Sugerir un oficio o local para agregar<br/>
                          ✔ Preguntas generales sobre aprendizajes<br/>
                          ✔ Consultas de asociación o medios de comunicación
                        </>
                      ) : lang==="pl" ? (
                        <>
                          ✔ Pytania o dołączeniu do zawodowego związku<br/>
                          ✔ Aktualizacja lub korekta danych lokalnego oddziału<br/>
                          ✔ Sugestia zawodu lub oddziału do dodania<br/>
                          ✔ Ogólne pytania dotyczące praktyk zawodowych<br/>
                          ✔ Zapytania o partnerstwo lub kontakty z mediami
                        </>
                      ) : (
                        <>
                          ✔ Questions about joining a union trade<br/>
                          ✔ Updating or correcting local union info<br/>
                          ✔ Suggesting a trade or local to add<br/>
                          ✔ General questions about apprenticeships<br/>
                          ✔ Partnership or media inquiries
                        </>
                      )}
                    </div>
                  </div>
                  <div className="contact-info-block">
                    <div className="contact-info-label">{lang==="es" ? "Tiempo de Respuesta" : lang==="pl" ? "Czas Odpowiedzi" : "Response Time"}</div>
                    <div className="contact-info-value" style={{color:"var(--muted)", fontSize:14}}>
                      {lang==="es" ? "Normalmente respondemos en 1 a 2 días hábiles." : lang==="pl" ? "Zazwyczaj odpowiadamy w ciągu 1–2 dni roboczych." : "We typically respond within 1–2 business days."}
                    </div>
                  </div>
                </div>

                {/* RIGHT — form */}
                <div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{lang==="es" ? "Nombre Completo *" : lang==="pl" ? "Imię i Nazwisko *" : "Full Name *"}</label>
                      <input className="form-input" type="text"
                        placeholder={lang==="es" ? "Juan García" : lang==="pl" ? "Jan Kowalski" : "John Smith"}
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{lang==="es" ? "Número de Teléfono" : lang==="pl" ? "Numer Telefonu" : "Phone Number"}</label>
                      <input className="form-input" type="tel"
                        placeholder="(555) 000-0000"
                        value={contactForm.phone}
                        onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang==="es" ? "Correo Electrónico *" : lang==="pl" ? "Adres Email *" : "Email Address *"}</label>
                    <input className="form-input" type="email"
                      placeholder={lang==="es" ? "tu@correo.com" : lang==="pl" ? "ty@email.com" : "you@email.com"}
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang==="es" ? "Asunto *" : lang==="pl" ? "Temat *" : "Subject *"}</label>
                    <select className="form-select" value={contactForm.subject}
                      onChange={e => setContactForm({...contactForm, subject: e.target.value})}>
                      <option value="">{lang==="es" ? "Seleccionar un tema..." : lang==="pl" ? "Wybierz temat..." : "Select a topic..."}</option>
                      <option value="joining">{lang==="es" ? "Unirse a un Oficio Sindical" : lang==="pl" ? "Dołączenie do Zawodowego Związku" : "Joining a Union Trade"}</option>
                      <option value="apprenticeship">{lang==="es" ? "Preguntas sobre Aprendizaje" : lang==="pl" ? "Pytania o Praktyki" : "Apprenticeship Questions"}</option>
                      <option value="local-info">{lang==="es" ? "Actualizar Info del Local" : lang==="pl" ? "Aktualizacja / Korekta Danych Oddziału" : "Update / Correct Local Info"}</option>
                      <option value="add-local">{lang==="es" ? "Solicitar que se Agregue un Local" : lang==="pl" ? "Prośba o Dodanie Oddziału" : "Request a Local Be Added"}</option>
                      <option value="add-trade">{lang==="es" ? "Sugerir un Oficio" : lang==="pl" ? "Zaproponuj Zawód" : "Suggest a Trade"}</option>
                      <option value="partnership">{lang==="es" ? "Consulta de Asociación / Medios" : lang==="pl" ? "Zapytanie o Partnerstwo / Media" : "Partnership / Media Inquiry"}</option>
                      <option value="other">{lang==="es" ? "Otro" : lang==="pl" ? "Inne" : "Other"}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang==="es" ? "Mensaje *" : lang==="pl" ? "Wiadomość *" : "Message *"}</label>
                    <textarea className="form-textarea"
                      placeholder={lang==="es" ? "Cuéntanos cómo podemos ayudarte..." : lang==="pl" ? "Powiedz nam, jak możemy pomóc..." : "Tell us how we can help..."}
                      value={contactForm.message}
                      onChange={e => setContactForm({...contactForm, message: e.target.value})} />
                  </div>

                  <button className="btn-primary"
                    style={{width:"100%", padding:"14px", fontSize:"15px"}}
                    disabled={!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message}
                    onClick={async () => {
                      try {
                        await fetch("https://formspree.io/f/myklzalg", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", "Accept": "application/json" },
                          body: JSON.stringify({
                            name: contactForm.name,
                            email: contactForm.email,
                            phone: contactForm.phone || "Not provided",
                            subject: contactForm.subject,
                            message: contactForm.message
                          })
                        });
                        setContactSent(true);
                      } catch (e) {
                        alert("Something went wrong. Please try again.");
                      }
                    }}>
                    {lang==="es" ? "Enviar Mensaje →" : lang==="pl" ? "Wyślij Wiadomość →" : "Send Message →"}
                  </button>
                  <p style={{fontSize:12, color:"var(--muted)", marginTop:10, textAlign:"center"}}>
                    {lang==="es" ? "* Campos obligatorios" : lang==="pl" ? "* Pola obowiązkowe" : "* Required fields"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLATFORM OVERVIEW — show on home page when no results */}
        {page === "home" && !results && (
          <div style={{maxWidth:"1000px", margin:"0 auto", padding:"0 24px 80px"}}>

            {/* STATS ROW */}
            <div style={{display:"flex", justifyContent:"center", gap:"16px", flexWrap:"wrap", margin:"60px 0 64px"}}>
              {[
                { num: "6M+", label: lang==="es" ? "Miembros Sindicales en EE.UU." : lang==="pl" ? "Członków Związków w USA" : "Union Members in the US" },
                { num: "18%", label: lang==="es" ? "Salarios Más Altos que No Sindicales" : lang==="pl" ? "Wyższe Płace niż Niezwiązkowcy" : "Higher Wages Than Non-Union" },
                { num: "500K+", label: lang==="es" ? "Trabajadores de Construcción Necesarios" : lang==="pl" ? "Potrzebnych Pracowników Budowlanych" : "Construction Workers Needed Now" },
                { num: "$0", label: lang==="es" ? "Costo del Aprendizaje Sindical" : lang==="pl" ? "Koszt Praktyki Związkowej" : "Cost to Join an Apprenticeship" },
              ].map((s, i) => (
                <div key={i} style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.18)", borderRadius:"16px", padding:"20px 28px", textAlign:"center", minWidth:"160px", flex:"1"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"38px", fontWeight:"900", color:"#FA8059", lineHeight:"1"}}>{s.num}</div>
                  <div style={{fontSize:"12px", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:"6px", fontWeight:"600"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* DIVIDER */}
            <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", marginBottom:"64px"}}/>

            {/* INTERACTIVE MAP */}
            <div style={{marginBottom:"80px"}}>
              <div style={{textAlign:"center", marginBottom:"28px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FA8059", marginBottom:"10px"}}>
                  {lang==="es" ? "1,170 Locales en EE.UU. y Canada" : lang==="pl" ? "1,170 Lokale w USA i Kanadzie" : "1,170 Locals Across the US and Canada"}
                </div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(28px,5vw,46px)", fontWeight:"900", textTransform:"uppercase", color:"#fff", lineHeight:"1", letterSpacing:"-0.02em"}}>
                  {"Every Union Local. "}<span style={{color:"#FA8059"}}>{"One Map."}</span>
                </h2>
              </div>
              <div style={{width:"100%", height:"560px", borderRadius:"20px", overflow:"hidden", border:"1px solid rgba(58,80,104,0.4)"}}>
                <iframe src="/map.html" style={{width:"100%", height:"100%", border:"none", display:"block"}} title="Union Locals Map" loading="lazy" />
              </div>
              <div style={{textAlign:"center", marginTop:"10px", fontSize:"11px", color:"rgba(160,180,196,0.35)", letterSpacing:"0.06em"}}>
                {lang==="es" ? "Haz clic en cualquier cluster para expandirlo." : lang==="pl" ? "Kliknij na klaster, aby go rozwinac." : "Click any cluster to expand. Zoom in to see individual pins."}
              </div>
            </div>

            {/* SECTION TITLE */}
            <div style={{textAlign:"center", marginBottom:"40px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FA8059", marginBottom:"12px"}}>
                {lang==="es" ? "Todo en un Solo Lugar" : lang==="pl" ? "Wszystko w Jednym Miejscu" : "Everything You Need. One Platform."}
              </div>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(32px,6vw,52px)", fontWeight:"900", textTransform:"uppercase", color:"#fff", lineHeight:"1", letterSpacing:"-0.02em"}}>
                {lang==="es" ? <>{"Más que un "}<span style={{color:"#FA8059"}}>{"Buscador"}</span></> : lang==="pl" ? <>{"Więcej niż "}<span style={{color:"#FA8059"}}>{"Wyszukiwarka"}</span></> : <>{"More Than a "}<span style={{color:"#FA8059"}}>{"Local Finder"}</span></>}
              </h2>
              <p style={{fontSize:"16px", color:"var(--muted)", maxWidth:"560px", margin:"16px auto 0", lineHeight:"1.6"}}>
                {lang==="es" ? "Union Pathways es la plataforma completa para todo lo relacionado con los oficios sindicales." : lang==="pl" ? "Union Pathways to kompletna platforma dla wszystkiego związanego ze związkowymi zawodami budowlanymi." : "Union Pathways is the all-in-one platform for everything union construction trades."}
              </p>
            </div>

          </div>
        )}

        {/* FOOTER */}
        <footer style={{flexDirection:"column", gap:"12px", textAlign:"center"}}>
          <div style={{display:"flex", justifyContent:"space-between", width:"100%", flexWrap:"wrap", gap:8}}>
            <span>{t.footerLeft}</span>
            <span>{t.footerRight}</span>
          </div>
          <div style={{fontSize:"11px", color:"rgba(160,180,196,0.5)", maxWidth:"700px", margin:"0 auto", lineHeight:1.6}}>
            {lang==="es" ? "Union Pathways es una plataforma de información independiente. No tenemos afiliación con ningún sindicato, organización laboral, entidad gubernamental o grupo industrial. Toda la información se proporciona solo con fines educativos." : lang==="pl" ? "Union Pathways to niezalezna platforma informacyjna. Nie jestesmy powiazani z zadnym zwiazkiem zawodowym, organizacja pracownicza, podmiotem rzadowym ani grupa branżową. Wszystkie informacje sa udostepniane wylacznie w celach edukacyjnych." : "Union Pathways is an independent information platform. We have no affiliation with any union, labor organization, government entity, or industry group. All information is provided for educational purposes only."}
          </div>
        </footer>
      </div>

        {/* GLOBAL SEARCH OVERLAY */}
        {searchOpen && (
          <div style={{position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", alignItems:"center", padding:"80px 24px 24px"}} onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
            {/* Close button */}
            <button onClick={() => setSearchOpen(false)} style={{position:"absolute", top:24, right:24, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--muted)", fontSize:20}}>×</button>

            {/* Search input */}
            <div style={{width:"100%", maxWidth:640, marginBottom:32}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:16, textAlign:"center"}}>
                {lang==="es" ? "Buscar en Union Pathways" : lang==="pl" ? "Szukaj w Union Pathways" : "Search Union Pathways"}
              </div>
              <div style={{position:"relative"}}>
                <svg style={{position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"var(--muted)"}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  autoFocus
                  value={globalQuery}
                  onChange={e => setGlobalQuery(e.target.value)}
                  placeholder={lang==="es" ? "Buscar locales, oficios, paginas..." : lang==="pl" ? "Szukaj lokali, zawodow, stron..." : "Search locals, trades, pages..."}
                  style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"16px 16px 16px 48px", fontSize:18, color:"white", outline:"none", boxSizing:"border-box"}}
                  onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                />
              </div>
            </div>

            {/* Results */}
            {(() => {
              if (!globalQuery.trim()) {
                // Show quick links when no query
                return (
                  <div style={{width:"100%", maxWidth:640}}>
                    <div style={{fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:12}}>
                      {lang==="es" ? "Acceso Rapido" : lang==="pl" ? "Szybki Dostep" : "Quick Access"}
                    </div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                      {[
                        { label: lang==="es" ? "Encontrar Local" : lang==="pl" ? "Znajdz Oddzial" : "Find a Local", page:"home" },
                        { label: lang==="es" ? "Como Unirse" : lang==="pl" ? "Jak Dolaczc" : "How to Join", page:"checklist" },
                        { label: lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Sciezki Kariery" : "Career Paths", page:"careers" },
                        { label: lang==="es" ? "Beneficios" : lang==="pl" ? "Swiadczenia" : "Union Benefits", page:"benefits" },
                        { label: lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "Union History", page:"history" },
                        { label: lang==="es" ? "Jubilacion" : lang==="pl" ? "Emerytura" : "Retirement", page:"retirement" },
                        { label: lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans", page:"veterans" },
                        { label: lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About", page:"about" },
                      ].map((item, i) => (
                        <button key={i} onClick={() => { setPage(item.page); setSearchOpen(false); }} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", textAlign:"left", cursor:"pointer", color:"var(--muted)", fontSize:14, fontWeight:600, transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(250,128,89,0.3)";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="var(--muted)"}}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              const q = globalQuery.toLowerCase().trim();

              // Search pages
              const pages = [
                { label: "Find a Local", desc: "Search union locals near you by ZIP or city", page:"home", keywords:["local","find","search","ibew","ua","ironworkers","bac","union","near"] },
                { label: "How to Join", desc: "The 3 real entry routes into the union trades", page:"checklist", keywords:["join","apprenticeship","how","entry","apply","get in","route"] },
                { label: "Career Paths", desc: "Apprentice to journeyman wages and stages", page:"careers", keywords:["career","wages","salary","apprentice","journeyman","foreman","pay"] },
                { label: "Union Benefits", desc: "Pension, health insurance, annuity overview", page:"benefits", keywords:["benefits","pension","health","annuity","insurance","retirement"] },
                { label: "Retirement", desc: "401k vs Annuity vs Pension explained", page:"retirement", keywords:["retirement","401k","pension","annuity","401","retire"] },
                { label: "Health Insurance", desc: "How contractor-paid health insurance works", page:"health", keywords:["health","insurance","medical","dental","vision","contractor"] },
                { label: "Union History", desc: "How unions built America", page:"history", keywords:["history","weekend","8 hour","wagner","osha","labor","movement"] },
                { label: "Veterans", desc: "Helmets to Hardhats and veteran resources", page:"veterans", keywords:["veteran","military","helmets","hardhats","h2h","service","army","navy"] },
                { label: "About", desc: "The story behind Union Pathways", page:"about", keywords:["about","noah","founder","spanky","sparky","story","ibew","ohio"] },
                { label: "Quiz — Which Trade?", desc: "Find out which trade matches your skills", page:"quiz", keywords:["quiz","which","trade","match","skills","test"] },
                { label: "Contact", desc: "Get in touch with Union Pathways", page:"contact", keywords:["contact","email","message","feedback","correction"] },
              ].filter(p => p.keywords.some(k => k.includes(q) || q.includes(k) || p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)));

              // Search locals
              const ALL_LOCALS = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...BAC_LOCALS, ...IW_LOCALS, ...HFIAW_LOCALS, ...IUEC_LOCALS, ...IUOE_LOCALS];
              const qWords = q.split(/\s+/).filter(Boolean);
              const localResults = ALL_LOCALS.filter(l => {
                const haystack = [l.name, l.city, l.state, l.address || "", l.phone || ""].join(" ").toLowerCase();
                return qWords.every(word => haystack.includes(word));
              }).slice(0, 10);

              if (pages.length === 0 && localResults.length === 0) {
                return (
                  <div style={{color:"var(--muted)", fontSize:15, textAlign:"center"}}>
                    {lang==="es" ? "No se encontraron resultados para" : lang==="pl" ? "Nie znaleziono wynikow dla" : "No results found for"} "{globalQuery}"
                  </div>
                );
              }

              return (
                <div style={{width:"100%", maxWidth:640, display:"flex", flexDirection:"column", gap:16}}>
                  {pages.length > 0 && (
                    <div>
                      <div style={{fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>
                        {lang==="es" ? "Paginas" : lang==="pl" ? "Strony" : "Pages"}
                      </div>
                      <div style={{display:"flex", flexDirection:"column", gap:6}}>
                        {pages.map((p, i) => (
                          <button key={i} onClick={() => { setPage(p.page); setSearchOpen(false); }} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", textAlign:"left", cursor:"pointer", transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(250,128,89,0.3)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:800, color:"#fff", marginBottom:2}}>{p.label}</div>
                            <div style={{fontSize:13, color:"var(--muted)"}}>{p.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {localResults.length > 0 && (
                    <div>
                      <div style={{fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>
                        {lang==="es" ? "Locales Sindicales" : lang==="pl" ? "Lokale Zwiazowe" : "Union Locals"}
                      </div>
                      <div style={{display:"flex", flexDirection:"column", gap:6}}>
                        {localResults.map((l, i) => (
                          <div key={i} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:800, color:"#fff", marginBottom:2}}>{l.name}</div>
                            <div style={{fontSize:13, color:"var(--muted)"}}>{l.city}, {l.state}{l.phone ? " · " + l.phone : ""}</div>
                            {l.website && <a href={"https://"+l.website} target="_blank" rel="noopener noreferrer" style={{fontSize:12, color:"#FA8059", textDecoration:"none"}}>{l.website}</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

    </>
  );
}
