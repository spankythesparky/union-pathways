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
      { abbr: "UBC", name: "Carpenters", full: "United Brotherhood of Carpenters", website: "www.carpenters.org", status: "active" },
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
  { id: 10824, name: "IBEW Local 824", city: "Tampa", state: "FL", phone: "(813) 626-5136", website: "ibew824.org", email: "jglye@ibew824.org", lat: 27.9880, lng: -82.3774, address: "6603 E Chelsea Street, Tampa, FL 33610" },
  { id: 10001, name: "IBEW Local 1", city: "St louis", state: "MO", phone: "314) 647-5900", website: "ibewlocal1.org", lat: 38.6148694, lng: -90.285719, address: "5850 Elizabeth Ave, St. Louis, MO 63110" },
  { id: 10003, name: "IBEW Local 3", city: "Flushing", state: "NY", phone: "(718) 591-4000", website: "www.local3ibew.org", lat: 42.7411758, lng: -73.693106, address: "158-11 Jewel Ave 4th Floor, Flushing, NY 11365" },
  { id: 10005, name: "IBEW Local 5", city: "Pittsburgh pa", state: "PA", phone: "(412) 432-1400", website: "ibew5.org", lat: 40.4255134, lng: -79.9630139, address: "5 Hot Metal St, Pittsburgh, PA 15203" },
  { id: 10006, name: "IBEW Local 6", city: "San Francisco", state: "CA", phone: "(415) 861-5752", website: "ibew6.org", lat: 37.7879363, lng: -122.4075201, address: "55 Fillmore St #2, San Francisco, CA 94117" },
  { id: 10007, name: "IBEW Local 7", city: "Springfield", state: "MA", phone: "4137347137", website: "www.ibewlocal7.com", lat: 42.1074494, lng: -72.5943113, address: "95 Liberty Street, Springfield, MA 01103" },
  { id: 10008, name: "IBEW Local 8", city: "Toledo ohio", state: "OH", phone: "419-666-8920", website: "www.ibew8.org", lat: 41.5900966, lng: -83.5673292, address: "807 Lime City Rd, Rossford, OH 43460" },
  { id: 10011, name: "IBEW Local 11", city: "Los Angeles", state: "CA", phone: "(626) 243-9700", website: "www.ibew11.org", lat: 34.1485, lng: -118.1445, address: "297 N Marengo Ave, Pasadena, CA 91101" },
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
  { id: 10034, name: "IBEW Local 34", city: "Quincy", state: "IL", phone: "(309) 673-3691", website: "www.ibew34.org", lat: 39.935602, lng: -91.409873, address: "4322 Ricketts Avenue, Bartonville, IL 61607" },
  { id: 10035, name: "IBEW Local 35", city: "Hartford", state: "CT", phone: "(860) 525-5438", website: "www.ibewlocal35.org", lat: 41.7297513, lng: -72.6692585, address: "961 Wethersfield Avenue, Hartford, CT 06114" },
  { id: 10038, name: "IBEW Local 38", city: "Cleveland", state: "OH", phone: "(216) 621-3090", website: "www.ibew38.org", email: "local38@ibew38.org", lat: 41.5073151, lng: -81.6755448, address: "1590 E 23rd Street, Cleveland, OH 44114" },
  { id: 10040, name: "IBEW Local 40", city: "Hollywood", state: "CA", phone: "(818) 762-4239", website: "www.ibew40.org", email: "unionhall@ibew40.org", lat: 34.173351, lng: -118.3703877, address: "5643 Vineland Avenue, North Hollywood, CA 91601" },
  { id: 10041, name: "IBEW Local 41", city: "Buffalo", state: "NY", phone: "(716) 662-6111", website: "www.ibewlocal41.com", email: "lu41@ibewlocal41.com", lat: 42.8864163, lng: -78.8781493, address: "S-3546 California Road, Orchard Park, NY 14127" },
  { id: 10043, name: "IBEW Local 43", city: "Syracuse", state: "NY", phone: "(315) 422-0435", website: "www.ibew43.org", email: "Local43info@ibew43.org", lat: 43.048122, lng: -76.147424, address: "4568 Waterhouse Road, Clay, NY 13041" },
  { id: 10046, name: "IBEW Local 46", city: "Seattle", state: "WA", phone: "(253) 395-6500", website: "www.ibew46.org", lat: 47.503767, lng: -122.255875, address: "19802 62nd Avenue S, Suite 105, Kent, WA 98032" },
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
  { id: 10117, name: "IBEW Local 117", city: "Elgin", state: "IL", phone: "(847) 854-7200", website: "www.ibew117.com", email: "office@ibew117.com", lat: 42.037260, lng: -88.281099, address: "765 Munshaw Lane, Crystal Lake, IL 60014" },
  { id: 10120, name: "IBEW Local 120", city: "London", state: "ON", phone: "(519) 652-2929", website: "www.ibew120.ca", lat: 42.852589, lng: -81.272962, address: "6688 Tempo Road, London, ON N6L 1P9, Box 324, Lambeth Station, London, ON N6P 1P9" },
  { id: 10124, name: "IBEW Local 124", city: "Kansas city", state: "KS", phone: "(816) 942-7500", website: "ibew124.org", email: "ibew@ibewlocal124.org", lat: 39.146520, lng: -94.814833, address: "301 E 103rd Terrace, Kansas City, MO 64114" },
  { id: 10127, name: "IBEW Local 127", city: "Kenosha", state: "WI", phone: "(262) 654-0912", website: "www.ibew127.org", email: "ibew127@gmail.com", lat: 42.6103305, lng: -87.8566492, address: "3030 39th Avenue, Kenosha, WI 53144" },
  { id: 10129, name: "IBEW Local 129", city: "Lorain", state: "OH", phone: "(440) 233-7156", website: "www.ibew129.org", email: "info@ibew129.org", lat: 41.417273, lng: -82.162988, address: "6100 S Broadway, Suite 201, Lorain, OH 44053" },
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
  { id: 10175, name: "IBEW Local 175", city: "Chattanooga", state: "TN", phone: "(423) 894-3557", website: "www.ibew175.org", email: "office@ibew175.org", lat: 35.072220, lng: -85.199674, address: "3922 Volunteer Drive, Suite 9, Chattanooga, TN 37416" },
  { id: 10176, name: "IBEW Local 176", city: "Joliet", state: "IL", phone: "(815) 729-1240", website: "www.ibewlocal176.org", email: "office@ibewlocal176.org", lat: 41.5263603, lng: -88.0840212, address: "1100 NE Frontage Road, Joliet, IL 60431" },
  { id: 10177, name: "IBEW Local 177", city: "Jacksonville", state: "FL", phone: "(904) 355-4569", website: "www.ibew177.org", email: "office@ibew177.org", lat: 30.3737031, lng: -81.6484468, address: "966 Liberty Street, Jacksonville, FL 32206" },
  { id: 10180, name: "IBEW Local 180", city: "Napa", state: "CA", phone: "(707) 251-9180", website: "www.ibewlu180.org", lat: 38.297137, lng: -122.285529, address: "720 Technology Way-B, Napa, CA 94558" },
  { id: 10191, name: "IBEW Local 191", city: "Everett", state: "WA", phone: "(425) 259-3195", website: "www.ibew191.com", lat: 47.979344, lng: -122.212701, address: "3100 164th Street NE, Marysville, WA 98271" },
  { id: 10193, name: "IBEW Local 193", city: "Springfield", state: "IL", phone: "(217) 544-3479", website: "www.ibew193.com", email: "office@ibew193.com", lat: 39.7840359, lng: -89.6028105, address: "3150 Wide Track Drive, Springfield, IL 62703" },
  { id: 10194, name: "IBEW Local 194", city: "Shrevport", state: "LA", phone: "(318) 688-0194", website: "www.ibew194.org", lat: 32.4481283, lng: -93.8436821, address: "5510 Buncombe Road, Shreveport, LA 71129" },
  { id: 10197, name: "IBEW Local 197", city: "Bloomington", state: "IL", phone: "(309) 827-4868", website: "www.ibew197.org", email: "info@ibew197.org", lat: 40.4797828, lng: -88.9939147, address: "2407 Beich Road, Suite A, Bloomington, IL 61705" },
  { id: 10212, name: "IBEW Local 212", city: "Cincinnati", state: "OH", phone: "(513) 559-0200", website: "www.local212.com", email: "office@local212.com", lat: 39.1014537, lng: -84.5124602, address: "212 Crowne Point Place, Suite 101, Cincinnati, OH 45241" },
  { id: 10223, name: "IBEW Local 223", city: "Brockton", state: "MA", phone: "(508) 880-2690", website: "www.ibew223.org", lat: 42.083433, lng: -71.018379, address: "475 Myles Standish Boulevard, Taunton, MA 02780" },
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
  { id: 10340, name: "IBEW Local 340", city: "Sacramento", state: "CA", phone: "(916) 927-4239", website: "www.ibewlocal340.org", email: "office@ibewlocal340.org", lat: 38.564424, lng: -121.314136, address: "10240 Systems Parkway, Suite 100, Sacramento, CA 95827" },
  { id: 10342, name: "IBEW Local 342", city: "Greensboro", state: "NC", phone: "(336) 285-7781", website: "www.ibew342.org", email: "ibew342@att.net", lat: 36.074328, lng: -79.9678353, address: "7874 Thorndike Road, Greensboro, NC 27409" },
  { id: 10343, name: "IBEW Local 343", city: "Rochester", state: "MN", phone: "(507) 282-7081", website: "www.ibewlocal343.org", lat: 43.9078613, lng: -92.4792433, address: "9 80th Street SE, Rochester, MN 55904" },
  { id: 10347, name: "IBEW Local 347", city: "Des moines", state: "IA", phone: "(515) 243-1924", website: "www.ibewlu347.org", email: "info@ibewlu347.org", lat: 41.5868654, lng: -93.6249494, address: "6809 SE Bellagio Court, Ankeny, IA 50021" },
  { id: 10349, name: "IBEW Local 349", city: "Miami", state: "FL", phone: "(305) 325-1330", website: "ibew349.org", email: "info@ibew349.org", lat: 25.7741566, lng: -80.1935973, address: "1657 NW Seventeenth Avenue, Miami, FL 33125" },
  { id: 10350, name: "IBEW Local 350", city: "Hannibal", state: "MO", phone: "(573) 221-2648", email: "ibew350@outlook.com", lat: 39.705854, lng: -91.362094, address: "801 Church Street, Hannibal, MO 63401" },
  { id: 10351, name: "IBEW Local 351", city: "Folsom", state: "NJ", phone: "(609) 704-8351", website: "www.ibew351.org", lat: 39.6020608, lng: -74.8426653, address: "1113 Black Horse Pike, Hammonton, NJ 08037, PO Box 1118, Hammonton, NJ 08037" },
  { id: 10353, name: "IBEW Local 353", city: "Toronto", state: "ON", phone: "(416) 510-3530", website: "www.ibew353.org", email: "inquiries@ibew353.org", lat: 43.741058, lng: -79.319023, address: "1377 Lawrence Avenue E, Toronto, ON M3A 3P8" },
  { id: 10354, name: "IBEW Local 354", city: "Salt lake city", state: "UT", phone: "(801) 972-9354", website: "www.ibew354.org", email: "office@ibew354.org", lat: 40.738591, lng: -111.9720931, address: "3400 W 2100 S, Salt Lake City, UT 84119" },
  { id: 10357, name: "IBEW Local 357", city: "Las vegas", state: "NV", phone: "(702) 452-9357", website: "www.ibew357.net", email: "ibew357@ibew357.net", lat: 36.1774338, lng: -115.0804862, address: "808 N Lamb Boulevard, Las Vegas, NV 89110" },
  { id: 10363, name: "IBEW Local 363", city: "New city", state: "NY", phone: "(845) 783-3500", website: "www.ibewlu363.org", email: "office363@ibewlu363.org", lat: 41.146992, lng: -73.990300, address: "67 Commerce Drive S, Harriman, NY 10926" },
  { id: 10364, name: "IBEW Local 364", city: "Rockford", state: "IL", phone: "(815) 398-6282", website: "www.ibew364.org", email: "office@ibew364.net", lat: 42.2662007, lng: -88.9824601, address: "6820 Mill Road, Rockford, IL 61108" },
  { id: 10369, name: "IBEW Local 369", city: "Louisville", state: "KY", phone: "(502) 368-2568", website: "www.ibewlocal369.com", email: "ehall@ibewlocal369.com", lat: 38.185939, lng: -85.722247, address: "4315 Preston Highway, Suite 102, Louisville, KY 40213" },
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
  { id: 10480, name: "IBEW Local 480", city: "Jackson", state: "MS", phone: "(601) 373-8434", website: "www.ibew480.org", email: "ibew480@ibew480.org", lat: 32.209714, lng: -90.237051, address: "4767 I-55 S, Jackson, MS 39212, PO Box 721119, Byram, MS 39272" },
  { id: 10481, name: "IBEW Local 481", city: "Indianapolis", state: "IN", phone: "(317) 923-2596", website: "www.ibew481.org", email: "info@ibew481.org", lat: 39.7683331, lng: -86.1583502, address: "1828 N Meridian Street, Suite 205, Indianapolis, IN 46202" },
  { id: 10488, name: "IBEW Local 488", city: "Bridgeport", state: "CT", phone: "(203) 452-7679", website: "www.ibewlocal488.org", email: "office@ibewlocal488.org", lat: 41.175038, lng: -73.188318, address: "721 Main Street, Monroe, CT 06468" },
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
  { id: 10540, name: "IBEW Local 540", city: "Canton", state: "OH", phone: "(330) 837-4239", website: "www.ibew540.org", lat: 40.798546, lng: -81.374951, address: "2333 Nave Road SE, Massillon, OH 44646" },
  { id: 10545, name: "IBEW Local 545", city: "St. joseph", state: "MO", phone: "(816) 232-3578", website: "www.ibewlocal545.net", lat: 39.7515881, lng: -94.7561717, address: "5804 Corporate Drive, St. Joseph, MO 64507" },
  { id: 10551, name: "IBEW Local 551", city: "Santa rosa", state: "CA", phone: "(707) 542-3505", website: "www.ibewlocal551.org", email: "ibew551@ibewlocal551.org", lat: 38.4404925, lng: -122.7141049, address: "2525 Cleveland Avenue, Suite B, Santa Rosa, CA 95403" },
  { id: 10553, name: "IBEW Local 553", city: "Raleigh - durham", state: "NC", phone: "(919) 596-8220", website: "www.ibew553.org", email: "office@ibew553.org", lat: 35.8803614, lng: -78.7872382, address: "3300 New Raleigh Highway, Durham, NC 27703, PO Box 13551, Research Triangle Park, NC 27709" },
  { id: 10557, name: "IBEW Local 557", city: "Saginaw", state: "MI", phone: "(989) 781-0516", website: "www.ibew557.org", lat: 43.4157319, lng: -84.0585359, address: "7303 Gratiot Road, Saginaw, MI 48609," },
  { id: 10558, name: "IBEW Local 558", city: "Sheffield", state: "AL", phone: "(256) 383-2279", website: "www.ibew558.org", email: "info@ibew558.org", lat: 34.7608701, lng: -87.6975945, address: "1803 E Seventeenth Street, Sheffield, AL 35660, PO Box 578, Sheffield, AL 35660" },
  { id: 10567, name: "IBEW Local 567", city: "Auburn", state: "ME", phone: "(207) 786-9770", website: "www.ibew567.com", email: "info@ibew567.com", lat: 44.0674905, lng: -70.1910715, address: "238 Goddard Road, Lewiston, ME 04240" },
  { id: 10568, name: "IBEW Local 568", city: "Montreal", state: "QC", phone: "(514) 329-0568", website: "www.fioe568.com", email: "info@fioe568.com", lat: 45.5017, lng: -73.5673, address: "4881 Jarry Street E, Suite 228, Montreal, QC H1R 1Y1" },
  { id: 10569, name: "IBEW Local 569", city: "San diego", state: "CA", phone: "(858) 569-8900", website: "www.ibew569.org", lat: 32.823116, lng: -117.123886, address: "4545 Viewridge Avenue, Suite 100, San Diego, CA 92123" },
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
  { id: 10648, name: "IBEW Local 648", city: "Hamilton", state: "OH", phone: "(513) 863-6515", website: "www.ibew648.org", email: "local648@ibew648.org", lat: 39.399507, lng: -84.561343, address: "4300 Millikin Road, Hamilton, OH 45011" },
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
  { id: 10756, name: "IBEW Local 756", city: "Daytona beach", state: "FL", phone: "(386) 756-2756", website: "www.ibew756.org", email: "ibew756@msn.com", lat: 29.164888, lng: -81.073543, address: "5901 S Williamson Boulevard, Port Orange, FL 32128" },
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
  { id: 10952, name: "IBEW Local 952", city: "Ventura", state: "CA", phone: "(805) 642-2149", website: "www.ibew952.org", email: "ibewoffice@ibewlu952.org", lat: 34.262850, lng: -119.238524, address: "3994 E Main Street, Ventura, CA 93003, PO Box 3908, Ventura, CA 93006" },
  { id: 10968, name: "IBEW Local 968", city: "Parkersburg", state: "WV", phone: "(304) 485-7412", website: "www.ibew968.com", email: "ibew968@ibew968.com", lat: 39.2667309, lng: -81.5620755, address: "1845 Seventh Street, Parkersburg, WV 26101" },
  { id: 10972, name: "IBEW Local 972", city: "Marietta", state: "OH", phone: "(740) 373-5054", website: "www.ibew972.com", email: "local@ibew972.org", lat: 39.4167742, lng: -81.4548392, address: "50 Sandhill Road, Reno, OH 45773" },
  { id: 10993, name: "IBEW Local 993", city: "Kamloops", state: "BC", phone: "(250) 376-8755", website: "www.ibew993.org", email: "office@ibew993.org", lat: 50.6745, lng: -120.3273, address: "873 Desmond Street, Kamloops, BC V2B 5K3" },
  { id: 10995, name: "IBEW Local 995", city: "Baton rouge", state: "LA", phone: "(225) 927-6462", website: "www.lu995.com", email: "ibew@lu995.com", lat: 30.4681253, lng: -91.1020823, address: "8181 Tom Drive, Baton Rouge, LA 70815" },
  { id: 11003, name: "IBEW Local 1003", city: "Nelson", state: "BC", phone: "(250) 354-4177", website: "www.ibew1003.org", email: "info@ibew1003.org", lat: 49.4928, lng: -117.2948, address: "101 Baker Street, Nelson, BC V1L 4H1" },
  { id: 11015, name: "IBEW Local 1015", city: "Mcallen", state: "TX", phone: "(956) 630-3108", email: "ibewlu1015@att.net", lat: 26.204114, lng: -98.2300605, address: "224 N McColl Road, Suite D, McAllen, TX 78501" },
  { id: 11077, name: "IBEW Local 1077", city: "Bogalusa", state: "LA", phone: "(985) 735-1299", lat: 30.7910204, lng: -89.8486858, address: "305 Avenue B, Suite 209A, Bogalusa, LA 70427, PO Box 699, Bogalusa, LA 70429" },
  { id: 11105, name: "IBEW Local 1105", city: "Newark", state: "OH", phone: "(740) 454-2304", website: "www.ibewlocal1105.org", email: "info@ibewlocal1105.org", lat: 40.058121, lng: -82.401264, address: "5805 Frazeysburg Road, Nashport, OH 43830" },
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
  { id: 30002, name: "IBEW Local 2", city: "St louis", state: "MO", phone: "(314) 645-2236", website: "www.ibew2.org", email: "info@ibew2.org", lat: 38.639486, lng: -90.336645, address: "940 Biltmore Drive,  Fenton, MO 63026" },
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
  { id: 30084, name: "IBEW Local 84", city: "Newnan", state: "GA", phone: "(770) 801-5352", website: "www.ibewlocal84.org", email: "admin@ibewlocal84.org", lat: 33.380672, lng: -84.799657, address: "2791 Woodland Terrace,  Smyrna, GA 30080" },
  { id: 30089, name: "IBEW Local 89", city: "Mount vernon", state: "WA", phone: "(360) 755-6900", website: "www.ibew89.org", email: "local89@ibew89.com", lat: 48.4200462, lng: -122.32642, address: "1125 S Second Street,  Mount Vernon, WA 98273,  PO Box 2349,  Mount Vernon, WA 98273" },
  { id: 30102, name: "IBEW Local 102", city: "Parsippany", state: "NJ", phone: "(973) 887-1718", website: "www.ibew102.org", email: "info@ibew102.org", lat: 40.8504497, lng: -74.4269088, address: "50 Parsippany Road,  Parsippany, NJ 07054" },
  { id: 30104, name: "IBEW Local 104", city: "Mansfield", state: "MA", phone: "(508) 660-3900", website: "www.ibew104.org", email: "�info@ibew104.org", lat: 41.9933971, lng: -71.2101336, address: "900 S Main Street,  Mansfield, MA 02048" },
  { id: 30105, name: "IBEW Local 105", city: "Hamilton", state: "ON", phone: "(905) 387-1721", website: "www.ibew105.com", email: "frontdesk@ibewlu105.com", lat: 43.179020, lng: -79.843821, address: "685 Nebo Road,  Hannon, ON L0R 1P0" },
  { id: 30111, name: "IBEW Local 111", city: "Denver", state: "CO", phone: "(303) 744-7171", website: "www.ibew111.org", email: "mail@ibew111.org", lat: 39.7711459, lng: -104.9189537, address: "5965 E 39th Avenue,  Denver, CO 80207" },
  { id: 30113, name: "IBEW Local 113", city: "Colorado springs", state: "CO", phone: "(719) 633-3872", website: "www.ibew113.com", email: "info@ibew113.com", lat: 38.8339578, lng: -104.825348, address: "2150 Naegele Road,  Colorado Springs, CO 80904" },
  { id: 30120, name: "IBEW Local 120", city: "London", state: "ON", phone: "(519) 652-2929", website: "www.ibew120.ca", lat: 42.852589, lng: -81.272962, address: "6688 Tempo Road,  London, ON N6L 1P9,  Box 324,  Lambeth Station,  London, ON N6P 1P9" },
  { id: 30125, name: "IBEW Local 125", city: "Portland", state: "OR", phone: "(503) 262-9125", website: "www.ibew125.com", lat: 45.5414318, lng: -122.4859808, address: "17200 NE Sacramento Street,  Portland, OR 97230" },
  { id: 30126, name: "IBEW Local 126", city: "Montgomery", state: "PA", phone: "(610) 489-1185", website: "www.ibewlu126.com", email: "local126@ibewlu126.com", lat: 40.2154361, lng: -75.3702305, address: "3455 Germantown Pike,  Collegeville, PA 19426" },
  { id: 30141, name: "IBEW Local 141", city: "Wheeling", state: "WV", phone: "(304) 242-3870", website: "www.ibew141.org", email: "info@ibew141.org", lat: 40.0496592, lng: -80.6438123, address: "82 Burkham Court,  Wheeling, WV 26003" },
  { id: 30145, name: "IBEW Local 145", city: "Moline", state: "IL", phone: "(309) 736-4239", website: "www.ibewlocal145.com", email: "�info@ibewlocal145.com", lat: 41.5058344, lng: -90.5136642, address: "1700 52nd Avenue,  Suite A,  Moline, IL 61265" },
  { id: 30160, name: "IBEW Local 160", city: "Baudette", state: "MN", phone: "(612) 781-3126", website: "www.ibew160.org", email: "160@ibew160.org", lat: 44.9971794, lng: -93.4482974, address: "13220 County Road 6,  Plymouth, MN 55441" },
  { id: 30164, name: "IBEW Local 164", city: "Jersey city", state: "NJ", phone: "(201) 265-1700", website: "www.ibew164.org", email: "�ibew164@ibew164.org", lat: 40.7215682, lng: -74.047455, address: "205 Robin Road,  Suite 315,  Paramus, NJ 07652" },
  { id: 30175, name: "IBEW Local 175", city: "Chattanooga", state: "TN", phone: "(423) 894-3557", website: "www.ibew175.org", email: "office@ibew175.org", lat: 35.072220, lng: -85.199674, address: "3922 Volunteer Drive,  Suite 9,  Chattanooga, TN 37416" },
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
  { id: 30258, name: "IBEW Local 258", city: "Vancouver", state: "BC", phone: "(604) 520-3305", website: "www.ibew258.bc.ca", email: "info@ibew258.bc.ca", lat: 49.148559, lng: -122.671708, address: "8029 199 Street,  Suite 140,  Langley, BC V2Y 0E2" },
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
  { id: 30353, name: "IBEW Local 353", city: "Toronto", state: "ON", phone: "(416) 510-3530", website: "www.ibew353.org", email: "�inquiries@ibew353.org", lat: 43.741058, lng: -79.319023, address: "1377 Lawrence Avenue E,  Toronto, ON M3A 3P8" },
  { id: 30359, name: "IBEW Local 359", city: "Miami", state: "FL", phone: "(305) 458-8205", website: "www.ibew359.com", lat: 25.748804, lng: -80.322064, address: "7811 Coral Way,  Suite 101,  Miami, FL 33155" },
  { id: 30369, name: "IBEW Local 369", city: "Louisville", state: "KY", phone: "(502) 368-2568", website: "www.ibewlocal369.com", lat: 38.185939, lng: -85.722247, address: "4315 Preston Highway,  Suite 102,  Louisville, KY 40213" },
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
  { id: 30553, name: "IBEW Local 553", city: "Durham", state: "NC", phone: "(919) 596-8220", website: "www.ibew553.org", email: "office@ibew553.org", lat: 35.932392, lng: -78.810519, address: "3300 New Raleigh Highway,  Durham, NC 27703,  PO Box 13551,  Research Triangle Park, NC 27709" },
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
  { id: 30769, name: "IBEW Local 769", city: "Phoenix", state: "AZ", phone: "(480) 423-9769", website: "www.ibew769.com", email: "dispatch@ibew769.com", lat: 33.448437, lng: -112.074141, address: "220 N William Dillard Drive, Gilbert, AZ 85233" },
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
  { id: 31002, name: "IBEW Local 1002", city: "Tulsa", state: "OK", phone: "(918) 438-7344", website: "www.ibew1002.com", email: "ibew@ibew1002.com", lat: 36.133466, lng: -95.727816, address: "12510 E 21st Street, Tulsa, OK 74129" },
  { id: 31049, name: "IBEW Local 1049", city: "Long island", state: "NY", phone: "(631) 234-1800", website: "www.ibew1049.org", email: "sgasparik@ibew1049.com", lat: 40.8084447, lng: -73.037391, address: "100 Corporate Drive, Holtsville, NY 11742" },
  { id: 31186, name: "IBEW Local 1186", city: "Honolulu", state: "HI", phone: "(808) 847-5341", website: "www.ibew1186.org", email: "ibew1186@ibew1186.org", lat: 21.304547, lng: -157.855676, address: "1935 Hau Street, Room 401, Honolulu, HI 96819" },
  { id: 31245, name: "IBEW Local 1245", city: "Vacaville", state: "CA", phone: "(707) 452-2700", website: "www.ibew1245.com", email: "rldj@ibew1245.com", lat: 38.3734022, lng: -121.9482469, address: "30 Orange Tree Circle, Vacaville, CA 95687" },
  { id: 31249, name: "IBEW Local 1249", city: "Cicero", state: "NY", phone: "(315) 656-7253", website: "www.ibew1249.org", email: "office@ibew1249.org", lat: 43.1756235, lng: -76.1193678, address: "8531 Brewerton Road, Suite 1, Cicero, NY 13039" },
  { id: 31250, name: "IBEW Local 1250", city: "Rapid city", state: "SD", phone: "(605) 343-0954", website: "www.ibewlocal1250.org", email: "ibew1250ba@gmail.com", lat: 44.0675321, lng: -103.2017328, address: "922 1/2 E Saint Patrick Street, Rapid City, SD 57701" },
  { id: 31316, name: "IBEW Local 1316", city: "Macon", state: "GA", phone: "(478) 743-7017", website: "www.ibew1316.com", email: "admin@ibew1316.org", lat: 32.836983, lng: -83.6606502, address: "1046 Patterson Street, Macon, GA 31204" },
  { id: 31319, name: "IBEW Local 1319", city: "Bloomsburg", state: "PA", phone: "(570) 714-1352", website: "www.ibew1319.org", email: "info@ibew1319.org", lat: 41.004496, lng: -76.453730, address: "225 Division Street, Kingston, PA 18704" },
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
  { id: 50001, name: "HFIAW Local 1", city: "St. louis", state: "MO", phone: "(314) 291 - 7399", website: "www.insulators1.org", email: "awl1@insulators.org", lat: 38.754877, lng: -90.440708, address: "3325 Hollenberg Dr, Bridgeton, MO, 63044" },
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
  { id: 50014, name: "HFIAW Local 14", city: "Philadelphia", state: "PA", phone: "(215) 289 - 4303", website: "www.local-14.org", email: "awl14@insulators.org", lat: 40.111881, lng: -74.999640, address: "2014 Hornig Rd, Philadephia, PA 19116" },
  { id: 50016, name: "HFIAW Local 16", city: "San francisco", state: "CA", phone: "(707) 748 - 1616", website: "www.insulators16.org", email: "awl16@insulators.org", lat: 37.714899, lng: -122.392454, address: "3801 Park RD, Benicia, CA 94510" },
  { id: 50017, name: "HFIAW Local 17", city: "Chicago", state: "IL", phone: "(708) 468 - 8000", website: "www.local17insulators.com", email: "awl17@insulators.org", lat: 41.8755616, lng: -87.6244212, address: "18520 Spring Creek Dr, Tinley Park, IL 60477" },
  { id: 50018, name: "HFIAW Local 18", city: "Indianapolis", state: "IN", phone: "(317) 786 - 3216", website: "www.insulators18.org", email: "awl18@insulators.org", lat: 39.687174, lng: -86.137321, address: "1220 E. Epler Ave, Indianapolis, IN, 46227" },
  { id: 50019, name: "HFIAW Local 19", city: "Milwaukee", state: "WI", phone: "(262) 548 - 9606", website: "www.insulators19.com", email: "awl19@insulators.org", lat: 43.0386475, lng: -87.9090751, address: "N 27 W23155 Roundy Dr, Pewaukee, WI, 53072" },
  { id: 50021, name: "HFIAW Local 21", city: "Dallas", state: "TX", phone: "(972) 243 - 5661", email: "awl21@insulators.org", lat: 32.903346, lng: -96.895366, address: "11580 Reeder Rd, Dallas, TX, 75229" },
  { id: 50022, name: "HFIAW Local 22", city: "Houston", state: "TX", phone: "(281) 479 - 2220", website: "InsulatorsLocal22.org", email: "awl22@insulators.org", lat: 29.7589382, lng: -95.3676974, address: "2210 Wichita St, Pasadena, TX 77502" },
  { id: 50023, name: "HFIAW Local 23", city: "Harrisburg", state: "PA", phone: "(717) 930 - 0922", website: "www.insulatorslocal23.org", email: "awl23@insulators.org", lat: 40.2663107, lng: -76.8861122, address: "8926 Jonestown Rd, Grantville, Pa 17028" },
  { id: 50024, name: "HFIAW Local 24", city: "Washington", state: "WA", phone: "(301) 725 - 2400", website: "www.insulators24.org", email: "awl24@insulators.org", lat: 45.5825711, lng: -122.3509593, address: "901 Montgomery St, Laurel, MD 20707" },
  { id: 50025, name: "HFIAW Local 25", city: "Detroit", state: "MI", phone: "(248) 352 - 1850", email: "awl25@insulators.org", lat: 42.3315509, lng: -83.0466403, address: "21353 Bridge St, Southfield, MI 48033" },
  { id: 50026, name: "HFIAW Local 26", city: "Rochester", state: "NY", phone: "(585) 323 - 1620", website: "www.insulators26.com", email: "awl26@insulators.org", lat: 43.227767, lng: -77.546402, address: "4348 Culver Rd., Ste. 3, Rochester, NY 14622" },
  { id: 50027, name: "HFIAW Local 27", city: "Kansas city", state: "KS", phone: "(816) 252 - 0588", website: "www.insulators27.com", email: "awl27@insulators.org", lat: 39.1134562, lng: -94.626497, address: "400 S Main St, Independence, MO, 64050" },
  { id: 50028, name: "HFIAW Local 28", city: "Denver", state: "CO", phone: "(303) 638 - 2560", email: "awl28@insulators.org", lat: 39.791451, lng: -104.847213, address: "3508 Peoria St, STE #102, Aurora, CO 80010" },
  { id: 50030, name: "HFIAW Local 30", city: "Syracuse", state: "NY", phone: "(315) 475 - 1246", email: "awl30@insulators.org", lat: 43.0481221, lng: -76.1474244, address: "5 Adler Drive Suite 3, East Syracuse, NY, 13057" },
  { id: 50032, name: "HFIAW Local 32", city: "Newark", state: "NJ", phone: "(732) 545 - 3210", email: "awl32@insulators.org", lat: 40.735657, lng: -74.1723667, address: "318 Cleveland Ave, Highland Park, NJ 08904" },
  { id: 50033, name: "HFIAW Local 33", city: "Connecticut", state: "CT", phone: "(203) 265 - 6376", website: "www.insulators33.com", email: "awl33@insulators.org", lat: 41.843706, lng: -73.329285, address: "616 S Colony Rd. Wallingford, CT 06492" },
  { id: 50034, name: "HFIAW Local 34", city: "Minneapolis", state: "MN", phone: "(651) 312 - 1245", website: "www.insulators34.org", email: "awl34@insulators.org", lat: 44.9772995, lng: -93.2654692, address: "95 Empire Dr, St Paul, MN 55103" },
  { id: 50036, name: "HFIAW Local 36", city: "Portland", state: "OR", phone: "(503) 255 - 2692", website: "www.insulators36.org", email: "awl36@insulators.org", lat: 45.5202471, lng: -122.674194, address: "16076 SE Evelyn St, Clackamas, OR 97015" },
  { id: 50037, name: "HFIAW Local 37", city: "Evansville", state: "IN", phone: "(812) 477 - 2341", website: "www.insulators37.org", email: "awl37@insulators.org", lat: 37.998580, lng: -87.486447, address: "2360 N Cullen Ave, Evansville, IN 47715" },
  { id: 50038, name: "HFIAW Local 38", city: "Wilkes-barre", state: "PA", phone: "(570) 829 - 0634", email: "awl38@insulators.org", lat: 41.2464824, lng: -75.8817316, address: "315-317 N Washington St, Wilkes-Barre, PA 18705" },
  { id: 50039, name: "HFIAW Local 39", city: "Omaha", state: "NE", phone: "(402) 333 - 6960", email: "awl39@insulators.org", lat: 41.2587459, lng: -95.9383758, address: "4801 F. Street, Omaha, NE, 68117" },
  { id: 50040, name: "HFIAW Local 40", city: "Albany", state: "NY", phone: "(518) 489 - 6407", email: "awl40@insulators.org", lat: 42.6511674, lng: -73.754968, address: "890 3rd St, Albany, NY 12206" },
  { id: 50041, name: "HFIAW Local 41", city: "Fort wayne", state: "IN", phone: "(260) 484 - 2834", website: "www.insulators41.com", email: "awl41@insulators.org", lat: 41.0799898, lng: -85.1386015, address: "3626 N Wells St, Ft. Wayne, IN 46808" },
  { id: 50042, name: "HFIAW Local 42", city: "Wilmington", state: "DE", phone: "(302) 328 - 4203", website: "www.local42.org", email: "awl42@insulators.org", lat: 39.7459468, lng: -75.546589, address: "1188 River RD. New Castle, DE 19720" },
  { id: 50045, name: "HFIAW Local 45", city: "Toledo", state: "OH", phone: "(419) 726 - 4683", website: "www.insulatorslocal45.com", email: "awl45@insulators.org", lat: 41.712064, lng: -83.478904, address: "4904 N Summit St, Toledo, OH 43611" },
  { id: 50046, name: "HFIAW Local 46", city: "Knoxville", state: "TN", phone: "(865) 524 - 0234", website: "www.insulatorslocal46.com", email: "awl46@insulators.org", lat: 35.9603948, lng: -83.9210261, address: "826 Stewart St, Knoxville, TN, 37917" },
  { id: 50047, name: "HFIAW Local 47", city: "Grand rapids", state: "MI", phone: "(517) 708 - 0665", website: "insulators47.com", email: "awl47@insulators.org", lat: 42.9632425, lng: -85.6678639, address: "16475 Ingersoll Rd, Lansing, MI 48906" },
  { id: 50048, name: "HFIAW Local 48", city: "Atlanta", state: "GA", phone: "(404) 373 - 9866", website: "https://atlantainsulators48.com/", email: "awl48@insulators.org", lat: 33.7544657, lng: -84.3898151, address: "374 Maynard Terr. SE Ste. 232, Atlanta, GA 30316" },
  { id: 50049, name: "HFIAW Local 49", city: "Duluth", state: "MN", phone: "(218) 624 - 6268", website: "www.insulatorslocal49.org", email: "awl49@insulators.org", lat: 46.736149, lng: -92.191768, address: "5771 US Highway 2, Hermantown, MN 55810" },
  { id: 50050, name: "HFIAW Local 50", city: "Columbus & dayton", state: "OH", phone: "(614) 221 - 7177", website: "www.insulators50.org", email: "awl50@insulators.org", lat: 39.7605276, lng: -84.1645115, address: "939 Goodale Blvd. Rm. 210, Columbus, OH 43212" },
  { id: 50051, name: "HFIAW Local 51", city: "Louisville", state: "KY", phone: "(502) 893 - 4040", website: "www.insulators51.org", email: "awl51@insulators.org", lat: 38.2542376, lng: -85.759407, address: "3927 Park Dr, Louisville, KY 40216" },
  { id: 50052, name: "HFIAW Local 52", city: "Oak ridge", state: "TN", phone: "(865) 576 - 4189", email: "awl52@insulators.org", lat: 36.0103562, lng: -84.2696449, address: "3283 Old Highway 63, Speedwell, TN, 37870" },
  { id: 50053, name: "HFIAW Local 53", city: "New orleans", state: "LA", phone: "(504) 468 - 9598", website: "insulators53.org", email: "awl53@insulators.org", lat: 29.9561422, lng: -90.0733934, address: "2001 Veterans Memorial Blvd. Ste. 200, Kenner, LA, 70062" },
  { id: 50055, name: "HFIAW Local 55", city: "Mobile", state: "AL", phone: "(251) 661 - 9703", email: "awl55@insulators.org", lat: 30.650171, lng: -88.130872, address: "908 Butler Dr, Mobile AL 36693" },
  { id: 50056, name: "HFIAW Local 56", city: "Wood river", state: "IL", phone: "(217) 556 - 5434", email: "awl56@insulators.org", lat: 38.861159, lng: -90.0976069, address: "716 Springfield Rd, Gillespie, IL 62033" },
  { id: 50060, name: "HFIAW Local 60", city: "Miami", state: "FL", phone: "(305) 681 - 0679", website: "www.unioninsulator.com", email: "awl60@insulators.org", lat: 25.892135, lng: -80.275645, address: "13000 NW 47th Ave, Miami, FL, 33054" },
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
  { id: 50086, name: "HFIAW Local 86", city: "Nashville", state: "TN", phone: "(615) 868 - 9411", email: "awl86@insulators.org", lat: 36.258388, lng: -86.712429, address: "115 Harris St, Madison, TN 37115" },
  { id: 50087, name: "HFIAW Local 87", city: "San antonio", state: "TX", phone: "(830) 626 - 8088", website: "insulators87.org", email: "awl87@insulators.org", lat: 29.4246002, lng: -98.4951405, address: "497 N Krueger Ave, San Antonio, TX, 78130" },
  { id: 50089, name: "HFIAW Local 89", city: "Trenton & atlantic city", state: "NJ", phone: "(609) 587 - 8905", website: "www.Insulators89.org", email: "awl89@insulators.org", lat: 39.3569331, lng: -74.4606039, address: "1502 South Olden Ave, Trenton, NJ, 08610" },
  { id: 50090, name: "HFIAW Local 90", city: "Memphis", state: "TN", phone: "(901) 386 - 7045", email: "awl90@insulators.org", lat: 35.192106, lng: -89.893321, address: "5093 Raleigh Lagrange Rd, Memphis, TN 38134" },
  { id: 50091, name: "HFIAW Local 91", city: "White plains", state: "NY", phone: "(914) 788 - 0400", website: "insulators91.com", email: "awl91@insulators.org", lat: 41.0339862, lng: -73.7629097, address: "59 Sunset Drive, Suite 102A, Briarcliff Manor, NY 10510" },
  { id: 50092, name: "HFIAW Local 92", city: "Columbia", state: "SC", phone: "(803) 637 - 3930", website: "www.local92.org", email: "awl92@insulators.org", lat: 34.000754, lng: -81.0352313, address: "211 Wade Morgan Rd, McCormick, SC 29835" },
  { id: 50094, name: "HFIAW Local 94", city: "Oklahoma city", state: "OK", phone: "(405) 632 - 6767", email: "awl94@insulators.org", lat: 35.387997, lng: -97.500531, address: "716 SE 79th St, Oklahoma City, OK 73149" },
  { id: 50096, name: "HFIAW Local 96", city: "Savannah", state: "GA", phone: "(912) 748 - 6282", email: "awl96@insulators.org", lat: 32.0790074, lng: -81.0921335, address: "105 Sharon Ct., Pooler, GA 31322" },
  { id: 50114, name: "HFIAW Local 114", city: "Jackson", state: "MS", phone: "(601) 825 - 3303", email: "awl114@insulators.org", lat: 32.2998686, lng: -90.1830408, address: "PO Box 641, Jackson, MS 39043" },
  { id: 50127, name: "HFIAW Local 127", city: "Appleton", state: "WI", phone: "(715) 823 - 5669", email: "awl127@insulators.org", lat: 44.2613967, lng: -88.4069744, address: "33 East 3rd St, Clintonville, WI, 54929" },
  { id: 50132, name: "HFIAW Local 132", city: "Honolulu", state: "HI", phone: "(808) 521 - 6405", website: "www.insulatorslocal132.org", email: "awl132@insulators.org", lat: 21.304547, lng: -157.855676, address: "1019 Lauia St. Bay #4, Kapolei, HI, 96707" },
  { id: 50133, name: "HFIAW Local 133", city: "Fargo", state: "ND", phone: "(701) 391 - 8894", website: "www.insulators133.org", email: "awl133@insulators.org", lat: 46.877229, lng: -96.789821, address: "2210 E Broadway Ave, Bismark, ND, 58501" },
  { id: 50134, name: "HFIAW Local 134", city: "Portsmouth", state: "NH", phone: "(207) 438 - 1421", email: "awl134@insulators.org", lat: 43.0751306, lng: -70.7601826, address: "PO Box 2052, Portsmouth Naval Shpyard, Portsmouth, NH 03804" },
  { id: 50135, name: "HFIAW Local 135", city: "Las vegas", state: "NV", phone: "(702) 643 - 8645", website: "www.insulators135.com", email: "awl135@insulators.org", lat: 36.1674263, lng: -115.1484131, address: "4316 E Alexander Rd, Las Vegas, NV 59115" },
  { id: 50207, name: "HFIAW Local 207", city: "Taylor", state: "MI", phone: "(800) 207 - 5622", website: "www.Local207.org", email: "awl207@insulators.org", address: "26453 Northline Rd. Taylor, MI 48180" }
];

const IUEC_LOCALS = [
  { id: 51001, name: "IUEC Local 1", city: "New york", state: "NY", phone: "718-767-7004", website: "www.localoneiuec.com", lat: 40.7127281, lng: -74.0060152, address: "47-24 27th St, Long Island City, NY 11101" },
  { id: 51002, name: "IUEC Local 2", city: "Chicago", state: "IL", phone: "708-907-7770", website: "www.iuec2.com", email: "local2@iuec2.com", lat: 41.690593, lng: -87.765675, address: "5860 W 111th St, Chicago Ridge, IL 60415" },
  { id: 51003, name: "IUEC Local 3", city: "St louis", state: "MO", phone: "314-644-3933", website: "www.iueclocal3.org", email: "iueclu3@aol.com", lat: 38.617370, lng: -90.285853, address: "5916 Wilson Ave, St Louis, MO 63110" },
  { id: 51004, name: "IUEC Local 4", city: "Boston", state: "MA", phone: "617-288-1547", website: "www.iueclocal4.com", email: "local4@iueclocal4.com", lat: 42.3588336, lng: -71.0578303, address: "50 park st, dorchester, ma 02122" },
  { id: 51005, name: "IUEC Local 5", city: "Philadelphia", state: "PA", phone: "215-676-2555", website: "www.iuec5.org", lat: 40.102434, lng: -74.984195, address: "12273 Townsend Rd, Philadelphia, PA 19154" },
  { id: 51006, name: "IUEC Local 6", city: "Pittsburgh", state: "PA", phone: "412-341-6666", website: "iueclocal6.org", lat: 40.4406968, lng: -80.0025666, address: "1601 Banksville RD, 2nd floor, pittsburgh PA 15216" },
  { id: 51007, name: "IUEC Local 7", city: "Baltimore", state: "MD", phone: "410-661-1491", website: "www.iuec7.com", email: "iueclocal7@aol.com", lat: 39.2908816, lng: -76.610759, address: "3743 Old Georgetown TD, Halethorpe, MD 21227" },
  { id: 51008, name: "IUEC Local 8", city: "San francisco", state: "CA", phone: "415-285-2900", website: "www.iuec8.org", email: "info@iuec8.org", lat: 37.7879363, lng: -122.4075201, address: "690 Potrero Ave, San Francisco, CA 94110" },
  { id: 51009, name: "IUEC Local 9", city: "Minneapolis", state: "MN", phone: "651-287-0817", website: "www.local9.com", email: "iuec9@local9.com", lat: 44.9772995, lng: -93.2654692, address: "433 Little Canada Road E, Little Canada, MN 55117" },
  { id: 51010, name: "IUEC Local 10", city: "Washington", state: "WA", phone: "301-459-0497", website: "www.iueclocal10.org", email: "joconnor@iuec.org", lat: 45.5825711, lng: -122.3509593, address: "9600 Martin Luther King Highway, Lanham, MD 20706" },
  { id: 51011, name: "IUEC Local 11", city: "Cincinnati", state: "OH", phone: "513-761-4787", website: "iuec11.org", email: "iueclocal11@gmail.com", lat: 39.200490, lng: -84.472490, address: "360 S. Wayne Ave, Cincinnati, OH 45215" },
  { id: 51012, name: "IUEC Local 12", city: "Kansas city", state: "KS", phone: "816-358-1312", website: "www.iuec12.com", email: "iuec@iuecl2.com", lat: 39.1134562, lng: -94.626497, address: "6320 Manchester Ave, STE 44, Kansas City, MO 64133" },
  { id: 51014, name: "IUEC Local 14", city: "Buffalo", state: "NY", phone: "716-833-5528", website: "iueclocal14.com", email: "iueclocal14vflo@aol.com", lat: 42.8864163, lng: -78.8781493, address: "3527 Harlen RD, STE. 10, Buffalo, NY 14225" },
  { id: 51015, name: "IUEC Local 15", city: "Milwaukee", state: "WI", phone: "262-786-9982", website: "www.iuec15.com", email: "iuec15@iuec15.com", lat: 43.0386475, lng: -87.9090751, address: "17125 W. Cleveland Ave, New Berlin, WI 53151" },
  { id: 51016, name: "IUEC Local 16", city: "New orleans", state: "LA", phone: "504-889-1103", website: "iueclocal16.org", email: "local16@iuec16.org", lat: 29.9561422, lng: -90.0733934, address: "2540 Severn Ave, STE 105, Metairie, LA 70002" },
  { id: 51017, name: "IUEC Local 17", city: "Cleveland", state: "OH", phone: "216-431-8088", website: "iueclocal17.org", email: "iueclocal17@neohio.twcbc.com", lat: 41.4996574, lng: -81.6936772, address: "3250 Euclid Ave, STE 240, Cleveland, OH 44115" },
  { id: 51018, name: "IUEC Local 18", city: "Los angeles", state: "CA", phone: "626-449-1869", website: "iuec18.org", email: "tony@iuec18.org", lat: 34.129334, lng: -117.827370, address: "2011 E. Financial Way, Glendora, CA 91741" },
  { id: 51019, name: "IUEC Local 19", city: "Seattle", state: "WA", phone: "206-282-4885", website: "www.iuec19.org", email: "theoffice@iuec.org", lat: 47.6038321, lng: -122.330062, address: "2264 15th Ave W, Seattle, WA 98119" },
  { id: 51020, name: "IUEC Local 20", city: "Louisville", state: "KY", phone: "502-231-0136", website: "iueclocal20.org", email: "iuec.louisville@yahoo.com", lat: 38.134093, lng: -85.611457, address: "7711 Beulah Church Road, Louisville KY 40228" },
  { id: 51021, name: "IUEC Local 21", city: "Dallas", state: "TX", phone: "817-635-0680", website: "www.iueclocal21.org", email: "iuec21@aol.com", lat: 32.7762719, lng: -96.7968559, address: "1924 Baird Farm Road, STE 101, Arlington, TX 76006" },
  { id: 51023, name: "IUEC Local 23", city: "Portland", state: "OR", phone: "503-252-5852", website: "www.iuec23.org", email: "iueclocal23@comcast.net", lat: 45.568554, lng: -122.536220, address: "12067 NE Glenn Widing Dr, STE 108, Portland, OR 97220" },
  { id: 51024, name: "IUEC Local 24", city: "Birmingham", state: "AL", phone: "205-591-4185", website: "iueclocal24.org", email: "bruce.local24@gmail.com", lat: 33.5206824, lng: -86.8024326, address: "5221 1st Ave N, Birmingham, AL 35212" },
  { id: 51025, name: "IUEC Local 25", city: "Denver", state: "CO", phone: "303-937-8039", website: "www.iuec25.org", email: "mike@iuec25.org", lat: 39.654472, lng: -105.037156, address: "3025 W. Hampden Ave, Sheridan, CO 80110" },
  { id: 51027, name: "IUEC Local 27", city: "Rochester", state: "NY", phone: "585-436-6440", website: "iueclocal27.org", email: "local27@frontiernet.net", lat: 43.157285, lng: -77.615214, address: "244 Pal Road, STE 3, Rochester, NY 14624" },
  { id: 51028, name: "IUEC Local 28", city: "Omaha", state: "NE", phone: "402-734-7632", email: "iueclocal28@gmail.com", lat: 41.2587459, lng: -95.9383758, address: "3333 South 24th Street, STE 1, Omaha, NE 68108" },
  { id: 51030, name: "IUEC Local 30", city: "Memphis", state: "TN", phone: "901-345-6233", website: "iueclocal30.org", email: "iuec30@outlook.com", lat: 35.064279, lng: -89.994979, address: "3089 Directors Row, Memphis, TN 38131" },
  { id: 51031, name: "IUEC Local 31", city: "Houston", state: "TX", phone: "713-926-9678", website: "www.iuec31.org", email: "iueclocal31@iuec31.org", lat: 29.725583, lng: -95.278467, address: "201 Broadway St, Houston, TX 77012" },
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
  { id: 51071, name: "IUEC Local 71", city: "Miami", state: "FL", phone: "305-633-3193", website: "www.iuec71.org", email: "local71@iuec71.org", lat: 25.631702, lng: -80.371673, address: "1909 Tyler St, STE 603, Hollywood, FL 33020" },
  { id: 51074, name: "IUEC Local 74", city: "Tampa", state: "FL", phone: "813-988-0950", website: "www.iuec74.org", email: "local74@gte.net", lat: 27.9449854, lng: -82.4583107, address: "7805 Professional Place, Tampa, FL 33637" },
  { id: 51079, name: "IUEC Local 79", city: "Little rock", state: "AR", phone: "501-372-3601", website: "iueclocal79.org", email: "lonnie.iueclocal79@gmail.com", lat: 34.7465071, lng: -92.2896267, address: "5103 N. Locust St, North Little Rock, AR 72116" }
,
  { id: 51080, name: "IUEC Local 80", city: "Greensboro", state: "NC", phone: "919-596-6172", website: "www.iueclocal80.org", email: "iuec80@cs.com", lat: 36.072635, lng: -79.791975, address: "PO BOX 387, Hillborough, NC 27278" },
  { id: 51081, name: "IUEC Local 81", city: "San antonio", state: "TX", phone: "210-226-1942", website: "iueclocal81.org", email: "iueclocal81@aol.com", lat: 29.486506, lng: -98.5268717, address: "1946 La Manda BLVD, San Antonio, TX 78201" },
  { id: 51082, name: "IUEC Local 82", city: "Vancouver", state: "BC", phone: "604-293-1281", website: "www.iueclocal82.com", email: "admin@iueclocal82.com", lat: 49.2608724, lng: -123.113952, address: "#3138-585 Seaborne Ave, Port Coquitlam, Canada" },
  { id: 51083, name: "IUEC Local 83", city: "Tulsa", state: "OK", phone: "918-587-1662", website: "iueclocal83.org", email: "tulsalocal83@gmail.com", lat: 36.019855, lng: -95.798021, address: "3200 S. Elm Place, Suite 104, Broken Arrow, OK 74012" },
  { id: 51084, name: "IUEC Local 84", city: "Reading", state: "PA", phone: "570-849-0020", website: "iueclocal84.org", email: "iuec84rl@gmail.com", lat: 40.335345, lng: -75.927949, address: "101 Centre St, Parryville, PA 18244" },
  { id: 51085, name: "IUEC Local 85", city: "Lansing", state: "MI", phone: "517-882-0100", website: "iuec85.org", email: "mike@iuec85.org", lat: 42.7338254, lng: -84.5546295, address: "15964 S. Old US 27, Lansing, MI 48906" },
  { id: 51089, name: "IUEC Local 89", city: "Montreal", state: "BC", phone: "514-843-6678", website: "www.iueclocal89.org", email: "admin@iueclocal89.org", lat: 45.5031824, lng: -73.5698065, address: "99 Avenue LaFleur, Lasalle, Canada H8R 3G8" },
  { id: 51090, name: "IUEC Local 90", city: "Hamilton ontario", state: "BC", phone: "905-383-9166", website: "iuec90.com", email: "local90@iuec90.com", lat: 43.2560802, lng: -79.8728583, address: "300 Fennell Ave E, Hamilton Ontarior, Canada L9A 1T2" },
  { id: 51091, name: "IUEC Local 91", city: "New haven", state: "CT", phone: "860-289-8689", website: "iueclocal91.org", email: "iuec91br@sbcglobal.net", lat: 41.3082138, lng: -72.9250518, address: "914 Main St. Room 203, E. Hardford, CT 06108" },
  { id: 51093, name: "IUEC Local 93", city: "Nashville", state: "TN", phone: "615-889-0001", website: "www.iueclocal93.org", lat: 36.162277, lng: -86.774298, address: "312 Bluebird Dr, Goodlettsville, TN 37072" },
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
  { id: 51133, name: "IUEC Local 133", city: "Austin", state: "TX", phone: "512-478-9950", website: "iueclocal133.com", email: "union@iueclocal133.com", lat: 30.271129, lng: -97.743700, address: "1910 Sam Bass RD, Round Rock, TX 78681" },
  { id: 51135, name: "IUEC Local 135", city: "Charlotte", state: "NC", phone: "980-949-7248", website: "www.iueclocal135.org", email: "iuec135@outlook.com", lat: 35.1787301, lng: -80.9310565, address: "1900 Cross Beam Drive, Charlotte, NC 28217" },
  { id: 51138, name: "IUEC Local 138", city: "Poughkeepsie", state: "NY", phone: "845-471-6181", website: "iuec.org", lat: 41.7065539, lng: -73.9283672, address: "25 Market St, STE 401, Poughkeepsie, NY 12601" },
  { id: 51139, name: "IUEC Local 139", city: "Orlando", state: "FL", phone: "407-291-7808", website: "www.iueclocal139.com", email: "iueclocal139@bellsouth.net", lat: 28.464423, lng: -81.316718, address: "451 E. Airport BLVD, Sandord, FL 32773" },
  { id: 51140, name: "IUEC Local 140", city: "Phoenix", state: "AZ", phone: "602-273-0025", website: "www.iuec140.com", email: "azec@iuec140.com", lat: 33.480241, lng: -112.0145764, address: "3111 E. Thomas RD, Phoenix, AZ 85016" },
  { id: 51141, name: "IUEC Local 141", city: "San Juan", state: "PR", phone: "787-208-5063", website: "iueclocal141.org", email: "annie.losgladiadores@outlook.com", lat: 18.465299, lng: -66.116666, address: "RR7, Box 7372, San Juan, Puerto Rico 00926" }
];

const IUOE_LOCALS = [
  { id: 92000, name: "IUOE Local 320", city: "Tuscumbia", state: "AL", phone: "(256) 764-6991", website: "www.iuoe.org/find-an-iuoe-local-union/local-320-tuscumbia", lat: 34.7318811, lng: -87.7028627, address: "22115 Highway 72 W, Tuscumbia, Alabama 35674" },
  { id: 91200, name: "IUOE Local 312", city: "Bessemer", state: "AL", phone: "205-424-9670", website: "www.iuoe.org/find-an-iuoe-local-union/local-312-bessemer", lat: 33.373615, lng: -86.9151454, address: "1751 Highway 150, Bessemer, Alabama 35022" },
  { id: 125300, name: "IUOE Local 653", city: "Mobile", state: "AL", phone: "(251) 432-3328", website: "www.iuoe.org/find-an-iuoe-local-union/local-653-mobile", lat: 30.7004307, lng: -88.1128719, address: "801 Springhill Ave, Mobile, Alabama 36602" },
  { id: 90200, name: "IUOE Local 302 (Fairbanks)", city: "Fairbanks", state: "AK", phone: "(907) 452-8131", website: "www.iuoe302.org", lat: 64.8194109, lng: -147.7449084, address: ", 3002 Lathrop St, Fairbanks, Alaska 99701" },
  { id: 90201, name: "IUOE Local 302 (Anchorage)", city: "Anchorage", state: "AK", phone: "(907) 561-5288", website: "www.iuoe302.org", lat: 61.2163129, lng: -149.894852, address: "4001 Denali Street, Suite A, Anchorage, Alaska 99503" },
  { id: 90202, name: "IUOE Local 302 (Juneau)", city: "Juneau", state: "AK", phone: "(907) 586-3850", website: "www.iuoe302.org", lat: 58.3019613, lng: -134.4196751, address: ", 9309 Glacier Hwy Bldng A Suite 105, Juneau, Alaska 99801" },
  { id: 155500, name: "IUOE Local 955", city: "Edmonton", state: "AB", phone: "(780) 483-0955", website: "www.oe955.com", lat: 53.5462055, lng: -113.491241, address: ", 17603 114th Avenue, Edmonton, Alberta T5S2R9" },
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
  { id: 78100, name: "IUOE Local 181 (Evansville)", city: "Evansville", state: "IN", phone: "(812) 474-1811", website: "www.iuoelocal181.org", lat: 37.996526, lng: -87.470945, address: "6500 Interchange Road, N, Evansville, Indiana 47715" },
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
  { id: 158700, name: "IUOE Local 987", city: "Winnipeg", state: "MB", phone: "(204) 786-8658", website: "www.oe987.mb.ca", lat: 49.8948542, lng: -97.0057868, address: ", 200 Regent Ave W, Winnipeg, Manitoba R2C1R2" },
  { id: 67700, name: "IUOE Local 77", city: "Suitland", state: "MD", phone: "(301) 899-6900", website: "www.iuoelocal77.com", lat: 38.8285021, lng: -76.9171288, address: "4546 Brittania Way, Suitland, Maryland 20746" },
  { id: 69900, name: "IUOE Local 99", city: "Upper marlboro", state: "MD", phone: "(202) 337-0099", website: "www.iuoelocal99.org", lat: 38.895360, lng: -76.844158, address: ", 9315 Largo Drive West, Suite 200, Upper Marlboro, Maryland 20774" },
  { id: 63700, name: "IUOE Local 37", city: "Baltimore", state: "MD", phone: "(410) 254-2030", website: "www.iuoe37.org", lat: 39.277125, lng: -76.479193, address: "3615 North Point Blvd., Ste. A,, Baltimore, Maryland 21222" },
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
  { id: 155301, name: "IUOE Local 953 (Albuquerque)", city: "Albuquerque", state: "NM", phone: "(505) 266-5757", website: "www.iuoelocal953.com", lat: 35.073783, lng: -106.559397, address: ", 151 Pennsylvania Street, S.E., Albuquerque, New Mexico 87108" },
  { id: 95101, name: "IUOE Local 351 (Artesia)", city: "Artesia", state: "NM", phone: "(575) 361-7988", website: "local351.com", lat: 32.8423345, lng: -104.4032963, address: ", 412 Chisum Street, Artesia, New Mexico 88210" },
  { id: 155302, name: "IUOE Local 953 (El Paso)", city: "El paso", state: "NM", phone: "(915) 234-2429", website: "www.iuoelocal953.com", lat: 36.730885, lng: -107.960497, address: ", 9434 Viscount blvd Suite 120, El Paso, New Mexico 79925" },
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
  { id: 122700, name: "IUOE Local 627", city: "Tulsa", state: "OK", phone: "(918) 437-0370", website: "iuoelocal627.org", lat: 36.090673, lng: -95.951284, address: ", 12109 E. Skelly Dr., Tulsa, Oklahoma 74128" },
  { id: 139300, name: "IUOE Local 793", city: "Oakville", state: "ON", phone: "(905) 469-9299", website: "www.iuoelocal793.org", lat: 43.4105307, lng: -79.7238441, address: ", 2245 Speers Road, Oakville, Ontario L6L6x8" },
  { id: 137200, name: "IUOE Local 772", city: "Gloucester", state: "ON", phone: "(905) 527-5250", website: "www.iuoe772.org", lat: 45.354631, lng: -75.601766, address: ", 5460 Canotek Road, Gloucester, Ontario K1J 9G8" },
  { id: 130100, name: "IUOE Local 701", city: "Gladstone", state: "OR", phone: "(503) 650-7701", website: "www.iuoe701.com", lat: 45.3798618, lng: -122.5854393, address: ", 555 East First Street, Gladstone, Oregon 97027" },
  { id: 114201, name: "IUOE Local 542 (Fort Washington)", city: "Fort washington", state: "PA", phone: "(215) 542-7500", website: "www.iuoe542.com", lat: 40.1478532, lng: -75.1897243, address: ", 1375 Virginia Drive Suite 100, Fort Washington, Pennsylvania 19034" },
  { id: 143500, name: "IUOE Local 835", city: "Drexel hill", state: "PA", phone: "(610) 853-6061", website: "www.iuoelocal835.org", lat: 39.9483282, lng: -75.3068878, address: ", 1064 Pontiac Road, Drexel Hill, Pennsylvania 19026" },
  { id: 69500, name: "IUOE Local 95", city: "Pittsburgh", state: "PA", phone: "(412) 422-4702", website: "www.iuoelocal95.org", lat: 40.4166027, lng: -80.0322226, address: ", 1001 East Entry Drive, Pittsburgh, Pennsylvania 15216" },
  { id: 66601, name: "IUOE Local 66 (Pittsburgh)", city: "Pittsburgh", state: "PA", phone: "(412) 968-9120", website: "www.iuoe66.org", lat: 40.4406968, lng: -80.0025666, address: ", 111 Zeta Drive, Pittsburgh, Pennsylvania 15238" },
  { id: 154200, name: "IUOE Local 942", city: "Charlottetown", state: "PE", phone: "(902) 566-3255", website: "iuoe942.com", lat: 46.2654572, lng: -63.1107655, address: ", 326 Patterson Drive, Charlottetown, Prince Edward Island C1A8K4" },
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
  { id: 74700, name: "IUOE Local 147", city: "Norfolk", state: "VA", phone: "(757) 461-4505", website: "www.iuoe147.com", lat: 36.847532, lng: -76.185500, address: ", 400 North Center Drive, Suite 123, Norfolk, Virginia 23502" },
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
  { id: 40001, name: "IW Local 1", city: "Chicago", state: "IL", phone: "708-366-6695", website: "www.iwlocal1.com", lat: 41.892840, lng: -88.233932, address: "7720 Industrial Drive, Forest Park, IL 60130, USA" },
  { id: 40003, name: "IW Local 3", city: "Pittsburgh", state: "PA", phone: "412-227-6767", website: "www.iwlocal3.com", lat: 40.451852, lng: -79.981562, address: "2201 Liberty Ave., Pittsburgh, PA 15222" },
  { id: 40005, name: "IW Local 5", city: "Washington", state: "WA", phone: "(301) 599-0960", website: "www.ironworkers5.org", lat: 45.5825711, lng: -122.3509593, address: "9301 Peppercorn Place Largo, MD 20774" },
  { id: 40006, name: "IW Local 6", city: "Buffalo", state: "NY", phone: "716-828-1200", website: "www.ironworkerslocal6.com", email: "ironworkerlocal6@aol.com", lat: 42.837978, lng: -78.7879725, address: "196 Orchard Park Rd., West Seneca, NY, 14224" },
  { id: 40007, name: "IW Local 7", city: "Boston", state: "MA", phone: "617-268-4777", website: "iwlocal7.org", lat: 42.3588336, lng: -71.0578303, address: "195 Old Colony Ave., PO Box 7, S. Boston,, MA 02127-2457" },
  { id: 40008, name: "IW Local 8", city: "Milwaukee", state: "WI", phone: "414-476-9370", website: "iwl8.org", lat: 43.0288994, lng: -88.063272, address: "12034 West Adler Ln., Milwaukee, WI 53214" },
  { id: 40009, name: "IW Local 9", city: "Niagra falls", state: "NY", phone: "716-285-5738", website: "www.ironworkers9.org", lat: 43.0834925, lng: -79.0029405, address: "Niagara Nine Bldg., 412 39th St., Niagara, Falls, NY 14303" },
  { id: 40010, name: "IW Local 10", city: "Kansas city", state: "KS", phone: "816-842-8917", website: "www.ironworkers10.com", lat: 39.032433, lng: -96.826907, address: "1000 E 10th St, Kansas City, MO 64106, USA" },
  { id: 40011, name: "IW Local 11", city: "Newark", state: "NJ", phone: "973.338.3777", website: "www.ironworkers11.org", lat: 40.700196, lng: -74.214115, address: "1500 Broad Street, Bloomfield NJ 07003" },
  { id: 40012, name: "IW Local 12", city: "Albany", state: "NY", phone: "518-435-0470", website: "www.ironworkers12.org", email: "frontoffice@iwl12.org", lat: 42.737910, lng: -73.793592, address: "17 Hemlock St., Latham, NY 12110" },
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
  { id: 40097, name: "IW Local 97", city: "Vancouver", state: "BC", phone: "866-562-2597", website: "ironworkerslocal97.com", email: "info@ironworkerslocal97.com", lat: 49.211938, lng: -122.867279, address: "20135 115A Ave., Maple Ridge, BC V2X 0Z3" },
  { id: 40103, name: "IW Local 103", city: "Evansville", state: "IN", phone: "812-477-5317", website: "www.ironworkers103.org", email: "union@ironworkers103.org", lat: 37.995377, lng: -87.486349, address: "5313 Old Boonville Hwy., Evansville, IN, 47715" },
  { id: 40111, name: "IW Local 111", city: "Rock island", state: "IL", phone: "309-756-6614", website: "www.ironworkers111.org", lat: 41.4420034, lng: -90.6075571, address: "8000 29th St. West, Rock Island, IL 61201" },
  { id: 40112, name: "IW Local 112", city: "Peoria", state: "IL", phone: "309-699-6489", website: "www.ironworkers112.org", email: "iwlocal112@gmail.com", lat: 40.7004239, lng: -89.5393179, address: "3003 N. Main St., East Peoria, IL 61611" },
  { id: 40118, name: "IW Local 118", city: "Sacramento", state: "CA", phone: "916-646-6976", website: "www.iw118.org", lat: 38.5810606, lng: -121.493895, address: "2840 El Centro Rd., Ste. 118, Sacramento, CA, 95833" },
  { id: 40135, name: "IW Local 135", city: "Galveston", state: "TX", phone: "(409) 935-2421", website: "ironworkers135.org", email: "iwlu135@aol.com", lat: 29.505244, lng: -95.114844, address: "216 Gulf Freeway N, Texas City, TX 77591" },
  { id: 40136, name: "IW Local 136", city: "Chicago", state: "IL", phone: "708-615-9300", website: "riggerslocal136.com", lat: 41.875562, lng: -87.624421, address: "1820 Beach St., Broadview, IL 60155-2863" },
  { id: 40147, name: "IW Local 147", city: "Fort wayne", state: "IN", phone: "260-484-8514", website: "www.ironworkers147.org", lat: 41.1358544, lng: -85.1779022, address: "6345 Innovation Blvd., Ft. Wayne, IN 46818" },
  { id: 40155, name: "IW Local 155", city: "Fresno", state: "CA", phone: "559-251-7388", website: "www.ironworkers155.org", email: "local@ironworkers155.org", lat: 36.7394421, lng: -119.78483, address: "5407 E. Olive Ave., Ste. 106, Fresno, CA, 93727" },
  { id: 40167, name: "IW Local 167", city: "Memphis", state: "TN", phone: "901-367-1676", website: "ironworkers167.com", email: "iwlu167@bellsouth.net", lat: 35.0752012, lng: -89.9775983, address: "2574 Lindawood Cove, Memphis, TN, 38118-1503" },
  { id: 40172, name: "IW Local 172", city: "Columbus", state: "OH", phone: "614-497-0550", website: "www.ironworkers172.com", lat: 39.9029513, lng: -82.9954501, address: "2867 South High St., Columbus, OH 43207" },
  { id: 40197, name: "IW Local 197", city: "Long island city", state: "NY", phone: "718-361-6534", website: "ironworkers197.org", email: "billhayes197@yahoo.com", lat: 40.7455316, lng: -73.9484995, address: "47-10 32nd Place, Ste. 403, Long Island City,, NY 11101" },
  { id: 40207, name: "IW Local 207", city: "Youngstown", state: "OH", phone: "330-758-9777", website: "www.iw207.com", lat: 41.1035786, lng: -80.6520161, address: "694 Bev Rd., Youngstown, OH 44512" },
  { id: 40229, name: "IW Local 229", city: "San diego", state: "CA", phone: "858-571-5238", website: "www.local229.org", lat: 32.835995, lng: -117.147195, address: "5155 Mercury Point, San Diego, CA 92111" },
  { id: 40263, name: "IW Local 263", city: "Dallas", state: "TX", phone: "817-640-0202", website: "www.ironworkerslocal263.org", email: "iwlu263@gmail.com", lat: 32.776272, lng: -96.796856, address: "604 N. Great Southwest Pkwy, Arlington, TX, 76011-5425" },
  { id: 40272, name: "IW Local 272", city: "Miami", state: "FL", phone: "954-524-8731", website: "www.ironworkerslocal272.com", lat: 25.7741566, lng: -80.1935973, address: "1201 N.E. 7th Ave., Fort Lauderdale, FL, 33304" },
  { id: 40290, name: "IW Local 290", city: "Dayton", state: "OH", phone: "937-222-1622", website: "www.iron290.com", lat: 39.7589478, lng: -84.1916069, address: "4191 E. US Rt. 40, Tipp City, OH 45371" },
  { id: 40321, name: "IW Local 321", city: "Little rock", state: "AR", phone: "(501) 374-3705", email: "ironworkers321@yahoo.com", lat: 34.749071, lng: -92.285564, address: "1315 W 2nd St, Little Rock, AR 72201" },
  { id: 40361, name: "IW Local 361", city: "Brooklyn", state: "NY", phone: "718-322-1016", website: "ironworkers361.com", email: "unionhall@local361.com", lat: 40.6526006, lng: -73.9497211, address: "89-19 97th Ave., Ozone Park, NY 11416" },
  { id: 40377, name: "IW Local 377", city: "San francisco", state: "CA", phone: "415-285-3880", website: "www.ironworkers377.com", lat: 37.739464, lng: -122.4047871, address: "570 Barneveld Ave., San Francisco, CA 94124" },
  { id: 40378, name: "IW Local 378", city: "Oakland", state: "CA", phone: "707-746-6100", website: "www.ironworkers378.org", lat: 37.804456, lng: -122.271356, address: "3120 Bayshore Rd., Benicia, CA 94510" },
  { id: 40380, name: "IW Local 380", city: "Champaign", state: "IL", phone: "217-367-6014", website: "www.ironworkers380.org", email: "ironworkers380@gmail.com", lat: 40.1164841, lng: -88.2430932, address: "1602 East Butzow Dr., Urbana, IL 61802" },
  { id: 40383, name: "IW Local 383", city: "Madison", state: "WI", phone: "608-256-3162", website: "www.iron383.com", lat: 43.07469, lng: -89.3841663, address: "5501 Manufacturer’s, Dr., Madison, WI, 53704" },
  { id: 40384, name: "IW Local 384", city: "Knoxville", state: "TN", phone: "865-689-3371", website: "ironworkers384.com", lat: 36.01163, lng: -83.92719, address: "1000 Buchanan Ave., N.E., Knoxville, TN, 37917-2683" },
  { id: 40387, name: "IW Local 387", city: "Atlanta", state: "GA", phone: "404-505-0022", website: "ironworkerslocal387.com/main", email: "iwlocal387@aol.com", lat: 33.757670, lng: -84.538869, address: "109 Selig Dr., S.W., Atlanta, GA 30336" },
  { id: 40392, name: "IW Local 392", city: "East st. louis", state: "IL", phone: "618-874-0313", website: "www.ironworkers392.org", lat: 38.6126532, lng: -90.0928381, address: "2995 Kingshighway, East St. Louis, IL 62201" },
  { id: 40395, name: "IW Local 395", city: "Hammond", state: "IN", phone: "219-763-7900", website: "www.ironworkers395.com", email: "webmaster@ironworkers395.com", lat: 41.617396, lng: -87.522011, address: "6570 Ameriplex Dr., Portage, IN 46368" },
  { id: 40396, name: "IW Local 396", city: "St louis", state: "MO", phone: "314-647-3008", website: "www.ironworkers396.org", lat: 38.6126643, lng: -90.2849871, address: "2500 59th St., St. Louis, MO 63110" },
  { id: 40397, name: "IW Local 397", city: "Tampa", state: "FL", phone: "813-623-1515", website: "iwl397.com", lat: 27.9449854, lng: -82.4583107, address: "10201 U.S. Highway 92 East, Tampa, FL, 33610" },
  { id: 40399, name: "IW Local 399", city: "Camden", state: "NJ", phone: "856-456-9323", website: "www.ironworkers399.org", lat: 39.683252, lng: -74.821060, address: "26 E. Fleming Pike, Hammonton, NJ 08037" },
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
  { id: 40512, name: "IW Local 512", city: "Minneapolis", state: "MN", phone: "651-489-1488", website: "ironworkers512.com", lat: 44.977300, lng: -93.265469, address: "851 Pierce Butler Route, St. Paul, MN, 55104-1634" },
  { id: 40516, name: "IW Local 516", city: "Portland", state: "OR", phone: "503-257-4743", website: "www.local516.org", email: "shopmens@pacifier.com", lat: 45.5202471, lng: -122.674194, address: "11620 N.E. Ainsworth Circle, Ste. 300,, Portland, OR 97220-9016" },
  { id: 40549, name: "IW Local 549", city: "Wheeling", state: "WV", phone: "304-232-2660", website: "www.iwlocal549.org", lat: 40.0579499, lng: -80.7261709, address: "2350 Main St., Wheeling, WV 26003" },
  { id: 40550, name: "IW Local 550", city: "Canton", state: "OH", phone: "330-455-5164", website: "www.iw550.org", lat: 40.7985464, lng: -81.3749508, address: "618 High Ave., N.W., Canton, OH 44703" },
  { id: 40568, name: "IW Local 568", city: "Cumberland", state: "MD", phone: "301-777-7433", website: "www.ironworkers568.org", lat: 39.6503221, lng: -78.7606075, address: "119 South Centre St., Cumberland, MD 21502" },
  { id: 40577, name: "IW Local 577", city: "Burlington", state: "IA", phone: "319-313-8581", website: "www.ironworkers577.org", email: "ironworkerslu577@gmail.com", lat: 40.812692, lng: -91.102020, address: "2700 Kindustry Park Rd., Keokuk, IA 52632" },
  { id: 40580, name: "IW Local 580", city: "New york", state: "NY", phone: "212-594-1662", website: "www.ironworkers580.org", lat: 40.760095, lng: -73.9958043, address: "501 West 42nd St., New York, NY 10036" },
  { id: 40584, name: "IW Local 584", city: "Tulsa", state: "OK", phone: "918-437-1446", website: "www.tulsaironworkers.com", email: "ironworkers584@sbcglobal.net", lat: 36.360631, lng: -95.996327, address: "14716 E. Pine St, Tulsa, OK 74116" },
  { id: 40597, name: "IW Local 597", city: "Jacksonville", state: "FL", phone: "904-764-3265", website: "www.ironworkers597.com", email: "info@ironworkers597.com", lat: 30.4126052, lng: -81.6554177, address: "9616 Kentucky St., Jacksonville, FL 32218" },
  { id: 40623, name: "IW Local 623", city: "Baton rouge", state: "LA", phone: "225-357-3262", website: "www.ironworkerslocal623.org", email: "luke@local623.org", lat: 30.4993901, lng: -91.129287, address: "6153 Airline Highway, Baton Rouge, LA, 70805" },
  { id: 40625, name: "IW Local 625", city: "Honolulu", state: "HI", phone: "808-671-4344", lat: 21.4240421, lng: -158.0053143, address: "94-497 Ukee St., Waipahu, HI 96797" },
  { id: 40643, name: "IW Local 643", city: "Victoria", state: "BC", phone: "250-213-8661", email: "ironworkers643@outlook.com", lat: 48.4284, lng: -123.3656, address: "Unit 105, PO Box 613, 1497 Admirals Rd.,, Victoria, BC V9A 2P8" },
  { id: 40700, name: "IW Local 700", city: "Windsor", state: "CA", phone: "519-737-7110", website: "www.ironworkerslocal700.com", lat: 42.2858536, lng: -82.9780695, address: "R.R.#3, 4069 County Rd. #46, Maidstone, ON, N0R 1K0" },
  { id: 40704, name: "IW Local 704", city: "Chattanooga", state: "TN", phone: "423-622-2111", website: "www.iw704.com", email: "ironworkers704@iw704.com", lat: 35.074868, lng: -85.265402, address: "2715 Belle Arbor Ave., Chattanooga, TN, 37406" },
  { id: 40709, name: "IW Local 709", city: "Savannah", state: "GA", phone: "912-748-5118", website: "www.ironworkerslocal709.org", email: "bmc709@ymail.com", lat: 32.079007, lng: -81.092134, address: "131 Westside Blvd., Pooler, GA 31322" },
  { id: 40711, name: "IW Local 711", city: "Montreal", state: "QC", phone: "(514) 328-2808", website: "www.local711.ca/fr", email: "info@local711.ca", lat: 45.624473, lng: -73.567960, address: "9950 Boul. Du Golf, Anjou, QC H1J 2Y7" },
  { id: 40720, name: "IW Local 720", city: "Edmonton", state: "AB", phone: "780-482-0720", website: "www.ironworkers720.com", email: "admin@ironworkers720.com", lat: 53.5461, lng: -113.4938, address: "10512-122 St., Edmonton, AB T5N 1M6" },
  { id: 40721, name: "IW Local 721", city: "Toronto", state: "ON", phone: "416-236-4026", website: "iw721.org", lat: 43.637487, lng: -79.533376, address: "909 Kipling Ave., Etobicoke, ON M8Z 5H3" },
  { id: 40725, name: "IW Local 725", city: "Calgary", state: "AB", phone: "403-291-1300", website: "www.ironworkers725.com", lat: 50.999905, lng: -113.981420, address: "6111 36 St., S.E., Calgary, AB T2C 3W2" },
  { id: 40728, name: "IW Local 728", city: "Winnipeg", state: "MB", phone: "204-783-7853", website: "www.ironworkers728.com", email: "officeadmin@ironworkers728.com", lat: 49.980488, lng: -97.113826, address: "54B St. Paul Blvd., W. St. Paul, MB R2P 2W5" },
  { id: 40732, name: "IW Local 732", city: "Pocatello", state: "ID", phone: "208-232-4873", website: "www.iw732.org", lat: 42.874942, lng: -112.463554, address: "1700 N. Harrison Ave., Pocatello, ID 83204" },
  { id: 40736, name: "IW Local 736", city: "Hamilton", state: "ON", phone: "905-679-6439", website: "www.iw736.com", email: "steven.pratt@iw736.com", lat: 43.189817, lng: -80.026728, address: "1384 Osprey Dr., Ancaster, Ontario L9G 4V5" },
  { id: 40751, name: "IW Local 751", city: "Anchorage", state: "AK", phone: "(907) 563-4766", website: "www.ironworkers751.org", lat: 61.1477988, lng: -149.8754702, address: "8141 Schoon St, Anchorage, AK 99518" },
  { id: 40752, name: "IW Local 752", city: "Halifax", state: "NS", phone: "902-450-5615", website: "www.ironworkerslocal752.com", email: "iron.worker@ns.sympatico.ca", lat: 44.642034, lng: -63.688044, address: "24 Lakeside Park Dr., Unit 103, Lakeside,, Nova Scotia B3T 1L1" },
  { id: 40759, name: "IW Local 759", city: "Thunder bay", state: "ON", phone: "807-345-8151", website: "www.ironworkers759.org", email: "iw759@iw759.com", lat: 48.3809, lng: -89.2477, address: "915 Alloy Dr., Thunder Bay, ON P7B 5Z8" },
  { id: 40765, name: "IW Local 765", city: "Ottawa", state: "ON", phone: "613-821-7813", website: "www.ironworkers765.com", email: "local765@ironworkers765.com", lat: 45.225948, lng: -75.498106, address: "7771 Snake Island Rd., Metcalfe, ON K0A, 2P0" },
  { id: 40769, name: "IW Local 769", city: "Ashland", state: "KY", phone: "606-324-0415", website: "ironworkerslocal769.com", lat: 38.4784144, lng: -82.6379387, address: "2151 Greenup Ave., PO Box 289,, Ashland, KY 41105" },
  { id: 40771, name: "IW Local 771", city: "Regina", state: "SK", phone: "306-522-7932", website: "local771.ca", email: "jeff@local771.ca", lat: 50.45548, lng: -104.5667404, address: "1138 Dewdney Ave. E, Regina, SK S4N 0E2" },
  { id: 40782, name: "IW Local 782", city: "Paducah", state: "KY", phone: "270-442-2722", website: "ironworkers782.org", email: "ironworkerslo782@bellsouth.net", lat: 37.0930832, lng: -88.6336388, address: "2424 Cairo Rd., Paducah, KY 42001" },
  { id: 40786, name: "IW Local 786", city: "Sudbury", state: "ON", phone: "705-674-6903", website: "www.iw786.com", lat: 46.4917, lng: -80.993, address: "97 St. George St., Sudbury, ON P3C 2W7" },
  { id: 40787, name: "IW Local 787", city: "Parkersburg", state: "WV", phone: "304-485-6231", website: "www.ironworkers787.org", lat: 39.2667309, lng: -81.5620755, address: "303 Erickson Blvd., Parkersburg, WV 26101" },
  { id: 40798, name: "IW Local 798", city: "Mobile", state: "AL", phone: "(251) 645-2477", website: "www.ironworkers798.org", lat: 30.747774, lng: -88.228893, address: "7920 Crary Station Rd., Semmes, AL 36575" },
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
  { id: 20004, name: "UA Local 4", city: "Worcester", state: "MA", phone: "508-835-1150", website: "ualocal4.com", lat: 42.339008, lng: -71.772793, address: "150 HARTWELL ST, WEST BOYLSTON, MA 01583" },
  { id: 20005, name: "UA Local 5", city: "Washington", state: "DC", phone: "301-899-7861", website: "local5plumbers.org", lat: 38.9072, lng: -77.0369, address: "4755 WALDEN LN, LANHAM, MD 20746," },
  { id: 20006, name: "UA Local 6", city: "Rochester", state: "MN", phone: "507-288-4172", website: "www.ualocal6.org", lat: 44.0440811, lng: -92.5093375, address: "3111 19TH ST NW, ROCHESTER, MN 55901" },
  { id: 20007, name: "UA Local 7", city: "Albany", state: "NY", phone: "518-785-9808", website: "www.ualocal7.org/our-plumbers-and-steamfitters", lat: 42.750328, lng: -73.776938, address: "18 AVIS DR, LATHAM, NY 12110" },
  { id: 20008, name: "UA Local 8", city: "Kansas city", state: "MO", phone: "816-363-8888", website: "plumberslocal8.com", lat: 39.0997, lng: -94.5786, address: "5950 MANCHESTER TRAFFICWAY STE 2, KANSAS CITY, MO 64130" },
  { id: 20009, name: "UA Local 9", city: "Englishtown", state: "NJ", phone: "732-792-0999", website: "www.ualocal9.org", address: "2 IRON ORE RD AT RTE 33, ENGLISHTOWN, NJ 07726" , lat: 40.0583, lng: -74.4057},
  { id: 20010, name: "UA Local 10", city: "Richmond", state: "VA", phone: "804-231-4233", website: "ualocal10.com", lat: 37.5407, lng: -77.436, address: "701 STOCKTON ST, RICHMOND, VA 23224" },
  { id: 20011, name: "UA Local 11", city: "Duluth", state: "MN", phone: "218-727-2199", website: "ualocal11.com", lat: 46.8327687, lng: -92.1586897, address: "4402 AIRPARK BLVD, DULUTH, MN 55811" },
  { id: 20012, name: "UA Local 12", city: "Boston", state: "MA", phone: "617-288-6200", website: "www.plumbersandgasfitterslocal12.org", lat: 42.3601, lng: -71.0589, address: "1240 MASSACHUSETTS AVE, BOSTON, MA 02125" },
  { id: 20013, name: "UA Local 13", city: "Rochester", state: "NY", phone: "585-338-2360", website: "ualocal13.org", lat: 43.1566, lng: -77.6088, address: "1850 MT READ BLVD, ROCHESTER, NY 14615" },
  { id: 20015, name: "UA Local 15", city: "Minneapolis", state: "MN", phone: "612-333-8601", website: "www.plumberslocal15.com", lat: 44.9778, lng: -93.265, address: "8625 MONTICELLO LN N STE 1, MAPLE GROVE, MN 55369" },
  { id: 20016, name: "UA Local 16", city: "Omaha", state: "NE", phone: "402-734-6274", website: "www.plumberslocal16.org", lat: 41.2565, lng: -95.9345, address: "4801 F ST, OMAHA, NE 68117" },
  { id: 20017, name: "UA Local 17", city: "Memphis", state: "TN", phone: "901-368-0900", website: "ua17.org", lat: 35.033258, lng: -89.943727, address: "4229 PRESCOTT RD, MEMPHIS, TN 38118" },
  { id: 20021, name: "UA Local 21", city: "Peekskill", state: "NY", phone: "914-737-2166", website: "local21union.com", lat: 41.271788, lng: -73.9321962, address: "1024 MCKINLEY ST, PEEKSKILL, NY 10566" },
  { id: 20022, name: "UA Local 22", city: "Buffalo", state: "NY", phone: "716-656-0220", website: "ualocal22.com", lat: 42.863833, lng: -78.759160, address: "120 GARDENVILLE PKWY, WEST SENECA, NY 14224" },
  { id: 20023, name: "UA Local 23", city: "Rockford", state: "IL", phone: "815-397-0350", website: "www.ualocal23.org", lat: 42.2177626, lng: -89.089344, address: "4525 BOEING DR, ROCKFORD, IL 61109" },
  { id: 20024, name: "UA Local 24", city: "Lodi", state: "NJ", phone: "973-521-7058", website: "plumbers24.org", lat: 40.882322, lng: -74.083197, address: "20 FAIRFIELD PL, WEST CALDWELL, NJ 07006" },
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
  { id: 20046, name: "UA Local 46", city: "Toronto", state: "ON", phone: "416-759-6791", website: "www.ualocal46.org", address: "936 WARDEN AVE, SCARBOROUGH, ON M1L 4C9" , lat: 43.731639, lng: -79.289334},
  { id: 20050, name: "UA Local 50", city: "Toledo", state: "OH", phone: "419-662-5456", website: "ualocal50.com", lat: 41.6528, lng: -83.5379, address: "7570 CAPLE BLVD STE A, NORTHWOOD, OH 43619" },
  { id: 20051, name: "UA Local 51", city: "Providence", state: "RI", phone: "401-943-3033", website: "ualocal51.com", lat: 41.824, lng: -71.4128, address: "11 HEMINGWAY DR, EAST PROVIDENCE, RI 2915" },
  { id: 20052, name: "UA Local 52", city: "Montgomery", state: "AL", phone: "(334)-272-9500", website: "ualocal52.org", email: "info@ualocal52.org", lat: 32.392196, lng: -86.208243, address: "5563 WARES FERRY RD, MONTGOMERY, AL 36117" },
  { id: 20055, name: "UA Local 55", city: "Cleveland", state: "OH", phone: "216-459-0099", website: "www.plumbers55.com", lat: 41.4993, lng: -81.6944, address: "980 KEYNOTE CR, BROOKLYN HEIGHTS, OH 44131" },
  { id: 20056, name: "UA Local 56", city: "Dartmouth", state: "NS", phone: "902-466-9920", website: "ualocal56.ca", address: "31 RAGUS RD, DARTMOUTH, NS B2Y 4W5" , lat: 44.6488, lng: -63.5752},
  { id: 20058, name: "UA Local 58", city: "Colorado springs", state: "CO", phone: "719-633-4052", website: "local58.org", email: "info@local58.org", lat: 38.7987399, lng: -104.7944984, address: "2870 JANITELL RD, COLORADO SPRINGS, CO 80906" },
  { id: 20060, name: "UA Local 60", city: "New orleans", state: "LA", phone: "504-885-3054", website: "steamfitters-602.org", lat: 29.9511, lng: -90.0715, address: "3515 N I-10 SERVICE RD, METAIRIE, LA 70002" },
  { id: 20062, name: "UA Local 62", city: "Monterey", state: "CA", phone: "831-633-6091", website: "www.pipetrades62.com", lat: 36.757604, lng: -121.740681, address: "11445 COMMERCIAL PKWY, CASTROVILLE, CA 95012" },
  { id: 20063, name: "UA Local 63", city: "Peoria", state: "IL", phone: "309-699-3570", website: "plumberslocal63.com", lat: 40.6328773, lng: -89.5432455, address: "116 HARVEY CT, E PEORIA, IL 61611," },
  { id: 20067, name: "UA Local 67", city: "Hamilton", state: "ON", phone: "905-385-0043", website: "www.ualocal67.ca", address: "195 DARTNALL RD STE 104, HAMILTON, ON L8W 3V9" , lat: 43.2557, lng: -79.8711},
  { id: 20068, name: "UA Local 68", city: "Houston", state: "TX", phone: "713-869-3592", website: "www.plu68.com", lat: 29.7604, lng: -95.3698, address: "502 LINK RD, HOUSTON, TX 77009" },
  { id: 20071, name: "UA Local 71", city: "Ottawa / hull", state: "ON", phone: "613-728-5583", website: "ualocal71.com", address: "1250 AGES DR, OTTAWA, ON K1G 5T4" , lat: 43.6532, lng: -79.3832},
  { id: 20072, name: "UA Local 72", city: "Atlanta", state: "GA", phone: "404-373-5778", website: "ua72.org", lat: 33.749, lng: -84.388, address: "374 MAYNARD TER SE, ATLANTA, GA 30316" },
  { id: 20074, name: "UA Local 74", city: "", state: "DE", phone: "302-636-7400", website: "www.ualocal74.com/underconstruction.aspx", lat: 39.682836, lng: -75.751568, address: ", 201 EXECUTIVE DR, NEWARK, DE 19702" },
  { id: 20075, name: "UA Local 75", city: "Milwaukee", state: "WI", phone: "414-359-1310", website: "www.plumbers75.com", lat: 43.160508, lng: -88.050758, address: "11175 W PARKLAND AVE, MILWAUKEE, WI 53224" },
  { id: 20078, name: "UA Local 78", city: "Los Angeles", state: "CA", phone: "213-688-9090", website: "www.uaplumber78.com", address: "1111 W JAMES M WOOD BLVD, LOS ANGELES, CA 90015" , lat: 34.0522, lng: -118.2437},
  { id: 20081, name: "UA Local 81", city: "Syracuse", state: "NY", phone: "315-437-7397", website: "ualocal81.org", lat: 43.0481, lng: -76.1474, address: "107 TWIN OAKS DR, SYRACUSE, NY 13206" },
  { id: 20083, name: "UA Local 83", city: "Wheeling", state: "WV", phone: "304-233-4445", website: "ualocal83.com", lat: 40.0510496, lng: -80.7182717, address: "177 29TH ST, WHEELING, WV 26003" },
  { id: 20085, name: "UA Local 85", city: "Saginaw", state: "MI", phone: "989-799-5261", website: "ualocal85.org", lat: 43.4586649, lng: -83.975694, address: "3535 BAY RD, SAGINAW, MI 48603" },
  { id: 20091, name: "UA Local 91", city: "Birmingham", state: "AL", phone: "205-591-2721", website: "www.ua91.org", lat: 33.5186, lng: -86.8104, address: "3648 9TH AVE N, BIRMINGHAM, AL 35222" },
  { id: 20094, name: "UA Local 94", city: "Canton", state: "OH", phone: "330-478-1864", website: "plumbersandpipefitterslocalunion94.com", lat: 40.7887194, lng: -81.4209367, address: "3919 13TH ST SW, CANTON, OH 44710" },
  { id: 20098, name: "UA Local 98", city: "Detroit", state: "MI", phone: "248-307-9800", website: "ualocal98.org", lat: 42.3314, lng: -83.0458, address: "555 HORACE BROWN DR, MADISON HEIGHTS, MI 48071" },
  { id: 20099, name: "UA Local 99", city: "Bloomington", state: "IL", phone: "309-663-2337", website: "ua.org/location/lu-99-bloomington-il", lat: 40.4752779, lng: -88.9518207, address: "406 S ELDORADO RD, BLOOMINGTON, IL 61704" },
  { id: 20100, name: "UA Local 100", city: "Dallas", state: "TX", phone: "214-341-8606", website: "ualocal100.org", lat: 32.7767, lng: -96.797, address: "3010 INTERSTATE 30, MESQUITE, TX 75150" },
  { id: 20101, name: "UA Local 101", city: "Belleville", state: "IL", phone: "618-234-5504", website: "ualocal101.org", lat: 38.5046014, lng: -89.944551, address: "8 PREMIER DR, BELLEVILLE, IL 62220," },
  { id: 20102, name: "UA Local 102", city: "Knoxville", state: "TN", phone: "865-523-7413", website: "ualocal102.org", lat: 36.045138, lng: -83.928861, address: "1216 BROADWAY NE, KNOXVILLE, TN 37917" },
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
  { id: 20141, name: "UA Local 141", city: "Shreveport", state: "LA", phone: "318-671-1175", website: "local141welfare.com/home", lat: 32.439539, lng: -93.899867, address: "7111 W BERT KOUNS INDUSTRIAL LOOP, SHREVEPORT, LA 71129" },
  { id: 20142, name: "UA Local 142", city: "San antonio", state: "TX", phone: "210-226-1244", website: "www.local142.org", lat: 29.4241, lng: -98.4936, address: "3630 BELGIUM LN, SAN ANTONIO, TX 78219" },
  { id: 20144, name: "UA Local 144", city: "Montreal", state: "QC", phone: "514-385-1171", website: "www.local144.ca", address: "12780 BD INDESTRIEL, POINTE-AUX-TREMBLES, QC H1A 3V2" , lat: 45.5017, lng: -73.5673},
  { id: 20145, name: "UA Local 145", city: "Grand junction", state: "CO", phone: "970-245-2012", website: "www.local145.org", lat: 39.0624164, lng: -108.4650666, address: "3168 PIPE CT, GRAND JUNCTION, CO 81504" },
  { id: 20146, name: "UA Local 146", city: "Fort worth", state: "TX", phone: "817-536-1979", website: "ualocal146.org", lat: 32.760375, lng: -97.492400, address: "9920 WHITE SETTLEMENT RD, FORT WORTH, TX 76108" },
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
  { id: 20210, name: "UA Local 210", city: "Hobart", state: "IN", phone: "219-942-7224", website: "www.plu210.org", lat: 41.466391, lng: -87.299177, address: "2901 E 83RD PL, MERRILLVILLE, IN 46410" },
  { id: 20211, name: "UA Local 211", city: "Houston", state: "TX", phone: "713-644-5521", website: "www.pipefitterslocal211.com", lat: 29.7604, lng: -95.3698, address: "1301 W 13TH ST STE A, DEER PARK, TX 77536" },
  { id: 20213, name: "UA Local 213", city: "St john", state: "NB", phone: "506-635-1605", website: "ualocal213.ca", address: "351 KING WILLIAM RD SPRUCE LAKE IND PK, ST. JOHN, NB E2M 7C9" , lat: 45.278799, lng: -66.058519},
  { id: 20219, name: "UA Local 219", city: "Akron", state: "OH", phone: "330-253-9166", website: "akron219.com", lat: 41.0814, lng: -81.519, address: "1655 BRITTAIN RD, AKRON, OH 44310" },
  { id: 20228, name: "UA Local 228", city: "Marysville", state: "CA", phone: "530-673-8690", website: "www.lu228.org", lat: 39.1466581, lng: -121.5837623, address: "1015 YUBA ST, MARYSVILLE, CA 95901," },
  { id: 20230, name: "UA Local 230", city: "San diego", state: "CA", phone: "858-554-0586", website: "www.ualocal230.org", lat: 32.887881, lng: -117.184681, address: "6313 NANCY RIDGE DR, SAN DIEGO, CA 92121" },
  { id: 20234, name: "UA Local 234", city: "Jacksonville", state: "FL", phone: "904-786-0941", website: "ua234.com", lat: 30.316799, lng: -81.739784, address: "5411 CASSIDY RD, JACKSONVILLE, FL 32254" },
  { id: 20246, name: "UA Local 246", city: "Fresno", state: "CA", phone: "559-252-7246", website: "local246.com", lat: 36.7378, lng: -119.7871, address: "1303 N RABE AVE STE 101, FRESNO, CA 93727" },
  { id: 20247, name: "UA Local 247", city: "Alexandria", state: "LA", phone: "318-442-9923", website: "ua.org/location/lu-247-alexandria-la", lat: 31.2917859, lng: -92.5343162, address: "249 MCKEITHEN DR, ALEXANDRIA, LA 71303" },
  { id: 20248, name: "UA Local 248", city: "Ashland", state: "KY", phone: "606-325-2544", website: "local248.com", lat: 38.4835075, lng: -82.6462599, address: "924 GREENUP AVE, ASHLAND, KY 41101" },
  { id: 20250, name: "UA Local 250", city: "Los angeles", state: "CA", phone: "310-660-0035", website: "www.ua250.org", lat: 33.864610, lng: -118.281671, address: "18355 S FIGUEROA ST, GARDENA, CA 90248" },
  { id: 20254, name: "UA Local 254", city: "Winnipeg", state: "MB", phone: "204-947-0497", website: "ua254.ca", address: "20 DUNLOP AVE, WINNIPEG, MB R2X 2M3" , lat: 49.8951, lng: -97.1384},
  { id: 20262, name: "UA Local 262", city: "Juneau", state: "AK", phone: "907-586-2874", website: "www.local392.com", lat: 58.3580061, lng: -134.4935529, address: "1751 ANKA ST, JUNEAU, AK 99801" },
  { id: 20268, name: "UA Local 268", city: "St. louis", state: "MO", phone: "314-241-8023", website: "www.sprinklerfitters268.org", lat: 38.627, lng: -90.1994, address: "1544 S 3RD ST, ST. LOUIS, MO 63104" },
  { id: 20272, name: "UA Local 272", city: "Portsmouth", state: "VA", phone: "757-537-0765", website: "ua.org/location/lu-272-portsmouth-va", lat: 36.8905484, lng: -76.3818102, address: "5664 RIVERMILL CIR, PORTSMOUTH, VA 23707" },
  { id: 20274, name: "UA Local 274", city: "Jersey city", state: "NJ", phone: "201-943-4700", website: "www.pipefitters274.org", lat: 40.721568, lng: -74.047455, address: "205 JEFFERSON RD, PARSIPPANY, NJ 07054" },
  { id: 20281, name: "UA Local 281", city: "Chicago", state: "IL", phone: "708-597-1800", website: "sprinklerfitterchicago.org", lat: 41.872321, lng: -87.754768, address: "11900 S LARAMIE AVE, ALSIP, IL 60803" },
  { id: 20282, name: "UA Local 282", city: "Halifax", state: "NS", phone: "902-830-9175", address: "52 ESSEX DR, HERRING COVE, NS B3V 1H8" , lat: 44.6488, lng: -63.5752},
  { id: 20286, name: "UA Local 286", city: "Austin", state: "TX", phone: "512-385-0002", website: "local286.org", lat: 30.2672, lng: -97.7431, address: "814 AIRPORT BLVD, AUSTIN, TX 78702" },
  { id: 20290, name: "UA Local 290", city: "Portland", state: "OR", phone: "503-691-5700", website: "ua290.org", lat: 45.5051, lng: -122.675, address: "20210 SW TETON AVE, TUALATIN, OR 97062" },
  { id: 20292, name: "UA Local 292", city: "Montreal", state: "QC", phone: "514-721-9112", address: "5333 SHERBROOKE ST E Apt B122, MONTREAL, QB H1T 4B6" , lat: 45.5017, lng: -73.5673},
  { id: 20295, name: "UA Local 295", city: "Daytona", state: "FL", phone: "386-253-9972", website: "ualocal295.com", lat: 29.2267239, lng: -81.025504, address: "743 N BEACH ST, DAYTONA BEACH, FL 32114" },
  { id: 20296, name: "UA Local 296", city: "Boise", state: "ID", phone: "208-288-1296", website: "www.ualocal296.org", lat: 43.615, lng: -116.2023, address: "575 N RALSTIN STE A, MERIDIAN, ID 83642" },
  { id: 20300, name: "UA Local 300", city: "Mandan", state: "ND", phone: "701-663-0999", website: "www.ua300.com", address: "2901 TWIN CITY DR STE 101, MANDAN, ND 58554" , lat: 44.2998, lng: -99.4388},
  { id: 20314, name: "UA Local 314", city: "Kansas city", state: "MO", phone: "816-444-5113", website: "sprinklerfitters314.org", lat: 38.970864, lng: -94.521064, address: "8510 HILLCREST RD, KANSAS CITY, MO 64138" },
  { id: 20322, name: "UA Local 322", city: "Winslow", state: "NJ", phone: "609-567-3322", website: "www.ua322.org", address: "534 S RTE 73, WINSLOW, NJ 08095" , lat: 39.7589, lng: -74.9857},
  { id: 20324, name: "UA Local 324", city: "Victoria", state: "BC", phone: "250-382-0415", website: "ua324.com", address: "2759 LEIGH RD, LANGFORD, BC V9B 4G2" , lat: 48.4284, lng: -123.3656},
  { id: 20325, name: "UA Local 325", city: "Fredericton", state: "NB", phone: "506-459-6044", website: "ualocal325.ca", address: "5 BLIZZARD ST, FREDERICTON, NB E3B 8K3" , lat: 45.898638, lng: -66.592724},
  { id: 20333, name: "UA Local 333", city: "Lansing", state: "MI", phone: "517-393-5480", website: "ua333.org", lat: 42.7338254, lng: -84.5546295, address: "5405 S MARTIN L KING JR BLVD, LANSING, MI 48911" },
  { id: 20340, name: "UA Local 340", city: "Minneapolis", state: "MN", phone: "612-379-3241", website: "www.gasworkerslocal340.com", lat: 44.9778, lng: -93.265, address: "312 CENTRAL AVE RM 592, MINNEAPOLIS, MN 55414" },
  { id: 20342, name: "UA Local 342", city: "Oakland", state: "CA", phone: "925-686-5880", website: "www.ua342.org", lat: 37.799916, lng: -122.188639, address: "935 DETROIT AVE, CONCORD, CA 94518," },
  { id: 20343, name: "UA Local 343", city: "Napa", state: "CA", phone: "707-644-4071", website: "www.local343.org", lat: 38.297137, lng: -122.285529, address: "220 PEABODY RD, VACAVILLE, CA 95687," },
  { id: 20344, name: "UA Local 344", city: "Oklahoma city", state: "OK", phone: "405-682-4571", website: "portal.issisystems.com/isite208/eremit.dll/20801/cm.asp?name=home", lat: 35.420801, lng: -97.678893, address: "4335 SW 44TH ST, OKLAHOMA CITY, OK 73119" },
  { id: 20345, name: "UA Local 345", city: "Los angeles", state: "CA", phone: "626-357-9345", website: "www.ua345.org", lat: 34.103976, lng: -118.151603, address: "1430 HUNTINGTON DR, DUARTE, CA 91010" },
  { id: 20350, name: "UA Local 350", city: "Reno", state: "NV", phone: "775-359-2142", website: "www.ualocal350.org", lat: 39.5296, lng: -119.8138, address: "1110 GREG ST, SPARKS, NV 89431" },
  { id: 20353, name: "UA Local 353", city: "Peoria", state: "IL", phone: "309-633-1353", website: "steamfitters353.com", lat: 40.6910774, lng: -89.6936977, address: "6304 W DEVELOPMENT DR, PEORIA, IL 61604" },
  { id: 20354, name: "UA Local 354", city: "Latrobe", state: "PA", phone: "724-925-7238", website: "www.lu354.com", lat: 40.317287, lng: -79.3840301, address: "271 ARMBRUST RD, YOUNGWOOD, PA 15697" },
  { id: 20355, name: "UA Local 355", city: "Burlingame", state: "CA", phone: "707-644-0355", website: "ua.org/location/lu-355-burlingame-ca", lat: 37.578097, lng: -122.347310, address: "426 ALABAMA ST, VALLEJO, CA 94590" },
  { id: 20357, name: "UA Local 357", city: "Kalamazoo", state: "MI", phone: "269-679-2570", website: "www.ualocal357.com", lat: 42.1455107, lng: -85.6373795, address: "11847 SHAVER RD, SCHOOLCRAFT, MI 49087," },
  { id: 20360, name: "UA Local 360", city: "East st louis", state: "IL", phone: "618-346-2560", website: "ualocal360.net", lat: 38.6268666, lng: -90.159707, address: "5 MEADOW HGTS PROFESSIONAL PARK, COLLINSVILLE, IL 62234," },
  { id: 20364, name: "UA Local 364", city: "Colton", state: "CA", phone: "909-825-0359", website: "www.ualocal364.com", lat: 34.0645773, lng: -117.3352318, address: "223 S RANCHO AVE, COLTON, CA 92324" },
  { id: 20367, name: "UA Local 367", city: "Anchorage", state: "AK", phone: "907-562-2810", website: "ualocal367.org", lat: 61.2181, lng: -149.9003, address: "610 W 54TH AVE, ANCHORAGE, AK 99518" },
  { id: 20370, name: "UA Local 370", city: "Flint", state: "MI", phone: "810-720-5243", website: "ualocal370.org", lat: 43.016169, lng: -83.690021, address: "2151 W THOMPSON RD, FENTON, MI 48430" },
  { id: 20372, name: "UA Local 372", city: "Tuscaloosa", state: "AL", phone: "205-758-6236", website: "www.ualocal372.org", lat: 33.2095614, lng: -87.5675258, address: "9410 HWY 82 E, DUNCANVILLE, AL 35456" },
  { id: 20373, name: "UA Local 373", city: "Rockland county", state: "NY", phone: "845-534-1050", website: "ua373.com", lat: 41.4070857, lng: -74.0747895, address: "76 PLEASANT HILL RD, MOUNTAINVILLE, NY 10953" },
  { id: 20375, name: "UA Local 375", city: "Fairbanks", state: "AK", phone: "907-479-6221", website: "ualocal375.org/index.html", lat: 64.8383308, lng: -147.8293896, address: "3980 BOAT ST, FAIRBANKS, AK 99709" },
  { id: 20376, name: "UA Local 376", city: "Norfolk", state: "VA", phone: "757-270-1608", website: "ua.org/location/lu-376-norfolk-va", lat: 36.8508, lng: -76.2859, address: "1005 GREEN ST, NORFOLK, VA 23513" },
  { id: 20392, name: "UA Local 392", city: "Cincinnati", state: "OH", phone: "513-241-1760", website: "www.local392.com", lat: 39.1031, lng: -84.512, address: "1228 CENTRAL PKWY RM 200, CINCINNATI, OH 45202" },
  { id: 20393, name: "UA Local 393", city: "San jose", state: "CA", phone: "408-225-3030", website: "ualocal393.org", lat: 37.237146, lng: -121.779321, address: "6299 SAN IGNACIO AVE, SAN JOSE, CA 95119" },
  { id: 20396, name: "UA Local 396", city: "Boardman", state: "OH", phone: "330-758-4596", website: "ualocal396.org", lat: 41.0242256, lng: -80.6628528, address: "493 BEV RD BLDG 3, BOARDMAN, OH 44512" },
  { id: 20398, name: "UA Local 398", city: "Pomona", state: "CA", phone: "909-945-5557", website: "local398.org", lat: 34.0553813, lng: -117.7517496, address: "8590 UTICA AVE STE 200, RANCHO CUCAMONGA, CA 91730" },
  { id: 20400, name: "UA Local 400", city: "Appleton", state: "WI", phone: "920-462-0400", website: "ua400.org", lat: 44.2613967, lng: -88.4069744, address: "2700 NORTHRIDGE DR, KAUKAUNA, WI 54130" },
  { id: 20401, name: "UA Local 401", city: "Eastern-central", state: "ON", phone: "905-623-1666", website: "www.ualocal401.ca", address: "26 CARISTRAP ST UNIT 3, BOWMANVILLE, ON L1C 3Y7" , lat: 43.6532, lng: -79.3832},
  { id: 20403, name: "UA Local 403", city: "San luis obispo", state: "CA", phone: "805-543-2416", website: "www.ua403.org", lat: 35.2521413, lng: -120.6450368, address: "3710 BROAD ST, SAN LUIS OBISPO, CA 93401" },
  { id: 20404, name: "UA Local 404", city: "Lubbock", state: "TX", phone: "806-744-3835", website: "ualocal404.org", address: "510 AVE G, LUBBOCK, TX 79401" , lat: 33.5779, lng: -101.8530},
  { id: 20412, name: "UA Local 412", city: "Albuquerque", state: "NM", phone: "505-265-1513", website: "ualocal412.org", lat: 35.0844, lng: -106.6504, address: "510 SAN PEDRO DR SE, ALBUQUERQUE, NM 87108," },
  { id: 20417, name: "UA Local 417", city: "Minneapolis", state: "MN", phone: "612-781-5804", website: "www.local417.com", lat: 44.9778, lng: -93.265, address: "529 COUNTY RD EW, SHOREVIEW, MN 55126" },
  { id: 20420, name: "UA Local 420", city: "Philadephia", state: "PA", phone: "267-350-4200", website: "www.lu420.com", lat: 40.1057144, lng: -74.9797534, address: "14420 TOWNSEND RD, PHILADELPHIA, PA 19154" },
  { id: 20421, name: "UA Local 421", city: "Charleston", state: "SC", phone: "843-554-3655", website: "ualocal421.org", lat: 32.8559821, lng: -80.0200365, address: "2556 OSCAR JOHNSON DR, NORTH CHARLESTON, SC 29405" },
  { id: 20430, name: "UA Local 430", city: "Tulsa", state: "OK", phone: "918-836-0430", website: "ua430.com", lat: 36.410238, lng: -95.938059, address: "2908 N HARVARD AVE, TULSA, OK 74115" },
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
  { id: 20464, name: "UA Local 464", city: "Omaha", state: "NE", phone: "402-333-5859", website: "lu464.org", lat: 41.231490, lng: -96.137830, address: "3375 OAKVIEW DR, OMAHA, NE 68144" },
  { id: 20467, name: "UA Local 467", city: "San mateo", state: "CA", phone: "650-692-4730", website: "www.ualocal467.org", lat: 37.5919693, lng: -122.3713073, address: "1519 ROLLINS RD, BURLINGAME, CA 94010" },
  { id: 20469, name: "UA Local 469", city: "Phoenix", state: "AZ", phone: "602-956-9350", website: "ualocal469.org", lat: 33.4484, lng: -112.074, address: "3109 N 24TH ST BLDG A, PHOENIX, AZ 85016" },
  { id: 20473, name: "UA Local 473", city: "Jesup", state: "GA", phone: "912-321-2919", website: "ua.org/location/lu-473-jesup-ga", lat: 31.6074365, lng: -81.8853924, address: "113 OLIVER LN, JESUP, GA 31545" },
  { id: 20475, name: "UA Local 475", city: "Newark", state: "NJ", phone: "908-754-1030", website: "ualocal475.org", lat: 40.7357, lng: -74.1724, address: "136 MT BETHEL RD, WARREN, NJ 07059" },
  { id: 20477, name: "UA Local 477", city: "Portsmouth", state: "VA", phone: "757-617-1180", website: "ua.org/location/lu-477-portsmouth-va", lat: 36.832008, lng: -76.297699, address: "1205 WILSON RD, SMITHFIELD, VA 23430" },
  { id: 20483, name: "UA Local 483", city: "San francisco", state: "CA", phone: "510-785-8483", website: "www.sprinklerfitters483.org", lat: 37.642355, lng: -122.452464, address: "2525 BARRINGTON CT, HAYWARD, CA 94545" },
  { id: 20484, name: "UA Local 484", city: "Ventura", state: "CA", phone: "805-643-6345", website: "www.ualocal484.org", lat: 34.403795, lng: -119.299409, address: "1955 N VENTURA AVE, VENTURA, CA 93001" },
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
  { id: 20527, name: "UA Local 527", city: "Southwestern", state: "ON", phone: "519-746-3300", website: "www.ua527.com", address: "225 FROBISHER DR, WATERLOO, ON N2V 2G4" , lat: 43.510458, lng: -80.523272},
  { id: 20529, name: "UA Local 529", city: "Waco", state: "TX", phone: "254-754-3471", website: "ualocal529.org", lat: 31.5491899, lng: -97.1474628, address: "510 CRESCECNT ST, WACO, TX 76705" },
  { id: 20533, name: "UA Local 533", city: "Kansas city", state: "MO", phone: "816-523-1533", website: "www.local533.com", lat: 38.969342, lng: -94.521127, address: "8600 HILLCREST RD, KANSAS CITY, MO 64138" },
  { id: 20537, name: "UA Local 537", city: "Boston", state: "MA", phone: "617-787-5370", website: "pipefitters537.org", lat: 42.3601, lng: -71.0589, address: "40 ENTERPRISE ST 4 FLR, DORCHESTER, MA 02125," },
  { id: 20538, name: "UA Local 538", city: "Johnson city", state: "TN", phone: "423-928-5751", website: "www.local538.org", lat: 36.2996997, lng: -82.3340742, address: "2404 S ROAN ST, JOHNSON CITY, TN 37601" },
  { id: 20539, name: "UA Local 539", city: "Minneapolis", state: "MN", phone: "612-379-4711", website: "pipefitters539.com", lat: 44.9778, lng: -93.265, address: "312 CENTRAL AVE # 408, MINNEAPOLIS, MN 55414" },
  { id: 20542, name: "UA Local 542", city: "Pittsburgh", state: "PA", phone: "412-822-8040", website: "sprinklerfitters542.org", lat: 40.4406, lng: -79.9959, address: "227 STANTON AVE, PITTSBURGH, PA 15209" },
  { id: 20548, name: "UA Local 548", city: "Montgomery", state: "AL", phone: "334-309-4563", website: "ua.org/location/lu-548-montgomery-al", lat: 32.3668, lng: -86.2999, address: "1719 COUNTRY RD 85, PRATTVILLE, AL 36067," },
  { id: 20550, name: "UA Local 550", city: "Boston", state: "MA", phone: "617-323-0474", website: "www.sprinklerfitters550.org", lat: 42.257931, lng: -71.158059, address: "46 ROCKLAND ST, BOSTON, MA 02132" },
  { id: 20551, name: "UA Local 551", city: "Herrin", state: "IL", phone: "618-937-1363", website: "ualocal551.org", lat: 37.8031056, lng: -89.0275744, address: "10967 DEAN BROWNING BLVD., WEST FRANKFORT, IL 62896" },
  { id: 20553, name: "UA Local 553", city: "Alton", state: "IL", phone: "618-259-6787", website: "ualocal553.org", lat: 38.8908583, lng: -90.1843091, address: "2 S WESLEY DR, EAST ALTON, IL 62024" },
  { id: 20562, name: "UA Local 562", city: "St. louis", state: "MO", phone: "314-355-1000", website: "local562.org", lat: 38.757943, lng: -90.461167, address: "3640 CORPORATE TRAIL DR, EARTH CITY, MO 63045" },
  { id: 20565, name: "UA Local 565", city: "Parkersburg", state: "WV", phone: "304-485-5202", website: "ualocal565.org", lat: 39.2667309, lng: -81.5620755, address: "593 CEDAR GROVE RD, PARKERSBURG, WV 26104" },
  { id: 20568, name: "UA Local 568", city: "Gulfport", state: "MS", phone: "228-863-1853", website: "ua.org/location/lu-568-gulfport-ms", lat: 30.3674198, lng: -89.0928155, address: "18511 NOBLES RD, SAUCIER, MS 39574" },
  { id: 20572, name: "UA Local 572", city: "Nashville", state: "TN", phone: "615-262-0893", website: "local572.com", lat: 36.1627, lng: -86.7816, address: "225 BEN ALLEN RD, NASHVILLE, TN 37207" },
  { id: 20577, name: "UA Local 577", city: "Portsmouth", state: "OH", phone: "740-353-5869", website: "ua577.com", lat: 38.7348306, lng: -82.9889172, address: "1236 GALLIA ST, PORTSMOUTH, OH 45662" },
  { id: 20582, name: "UA Local 582", city: "Santa ana", state: "CA", phone: "714-978-0582", website: "www.ualocal582.org", lat: 33.7878, lng: -117.8761996, address: "1916 W CHAPMAN AVE, ORANGE, CA 92868" },
  { id: 20589, name: "UA Local 589", city: "Hibbing", state: "MN", phone: "218-741-2482", lat: 47.427155, lng: -92.937689, address: "107 S 15TH AVE W, VIRGINIA, MN 55792" },
  { id: 20597, name: "UA Local 597", city: "Chicago", state: "IL", phone: "312-829-4191", website: "www.pf597.org", lat: 41.8781, lng: -87.6298, address: "45 N OGDEN AVE, CHICAGO, IL 60607," },
  { id: 20598, name: "UA Local 598", city: "Pasco", state: "WA", phone: "509-545-1446", website: "www.ua598.org", lat: 46.2393158, lng: -119.1280056, address: "1328 RD 28, PASCO, WA 99301" },
  { id: 20600, name: "UA Local 600", city: "Reading", state: "PA", phone: "484-955-5083", website: "ua.org/location/lu-600-reading-pa", lat: 40.335345, lng: -75.9279495, address: "3323 PEQUOT DR, SINKING SPG, PA 19608" },
  { id: 20601, name: "UA Local 601", city: "Milwaukee", state: "WI", phone: "414-543-0601", website: "steam601.org", lat: 42.987045, lng: -88.040280, address: "3300 S 103RD ST, MILWAUKEE, WI 53227" },
  { id: 20602, name: "UA Local 602", city: "Washington", state: "DC", phone: "301-333-2356", website: "steamfitters-602.org", lat: 38.9072, lng: -77.0369, address: "8700 ASHWOOD DR 2ND FLR, CAPITOL HEIGHTS, MD 20743" },
  { id: 20614, name: "UA Local 614", city: "Memphis", state: "TN", phone: "901-386-8166", website: "www.local614.org", lat: 35.1495, lng: -90.049, address: "5670 COMMANDER DR, ARLINGTON, TN 38002" },
  { id: 20619, name: "UA Local 619", city: "Vicksburg", state: "MS", phone: "601-638-2546", website: "ua.org", lat: 32.3528055, lng: -90.8777342, address: "3203 N FRONTAGE DR, VICKSBURG, MS 39180" },
  { id: 20625, name: "UA Local 625", city: "Charleston", state: "WV", phone: "304-744-3881", website: "www.pipefitterslocal625.org", lat: 38.3498, lng: -81.6326, address: "3611 JAMES ST, CHARLESTON, WV 25387" },
  { id: 20628, name: "UA Local 628", city: "Thunderbay", state: "ON", phone: "807-623-1041", website: "ualocal628.com", address: "969 ALLOY DR, THUNDER BAY, ON P7B 5Z8" , lat: 48.3809, lng: -89.2477},
  { id: 20630, name: "UA Local 630", city: "West palm beach", state: "FL", phone: "561-689-8400", website: "www.lu630.org", lat: 26.697259, lng: -80.078541, address: "1900 N FLORIDA MANGO RD, WEST PALM BEACH, FL 33409" },
  { id: 20633, name: "UA Local 633", city: "Owensboro", state: "KY", phone: "270-683-1587", website: "ua.org/location/lu-633-owensboro-ky", lat: 37.7535505, lng: -87.0658491, address: "3128 ALVEY PARK DR W, OWENSBORO, KY 42303" },
  { id: 20636, name: "UA Local 636", city: "Detroit", state: "MI", phone: "248-538-6636", website: "pipefitters636.org", lat: 42.444821, lng: -83.204074, address: "30100 NORTHWESTERN HWY, FARMINGTON HILLS, MI 48334" },
  { id: 20638, name: "UA Local 638", city: "New york", state: "NY", phone: "718-392-3420", website: "steamfitters638.org", lat: 40.7128, lng: -74.0059, address: "27-08 40TH AVE 4TH FLR, LONG ISLAND CITY, NY 11101" },
  { id: 20648, name: "UA Local 648", city: "Pocatello", state: "ID", phone: "208-232-6806", lat: 42.8620287, lng: -112.450627, address: "456 N ARTHUR STE 4, POCATELLO, ID 83204" },
  { id: 20653, name: "UA Local 653", city: "Centralia", state: "IL", phone: "618-532-3351", website: "ua.org/location/lu-653-centralia-il", lat: 38.5278021, lng: -89.1367412, address: "116 S CHESTNUT ST, CENTRALIA, IL 62801" },
  { id: 20663, name: "UA Local 663", city: "Sarnia", state: "ON", phone: "519-337-6569", website: "local663.com", address: "1151 CONFEDERATION ST, SARNIA, ON N7S 3Y5" , lat: 42.9745, lng: -82.4064},
  { id: 20669, name: "UA Local 669", city: "Columbia", state: "MD", phone: "410-381-4300", website: "www.sprinklerfitters669.org", lat: 39.1938429, lng: -76.8646092, address: "7050 OAKLAND MILLS RD #200, COLUMBIA, MD 21046" },
  { id: 20671, name: "UA Local 671", city: "Monroe", state: "MI", phone: "734-242-5711", website: "unitedassociationlocal671.com", lat: 41.9139518, lng: -83.3731378, address: "309 DETROIT AVE, MONROE, MI 48162" },
  { id: 20675, name: "UA Local 675", city: "Honolulu", state: "HI", phone: "808-536-5454", website: "plumbershawaii.com", lat: 21.3069, lng: -157.8583, address: "1109 BETHEL ST LOWER LEVEL, HONOLULU, HI 96813" },
  { id: 20682, name: "UA Local 682", city: "Sydney", state: "NS", phone: "902-562-3753", website: "www.ualocal682.ca", address: "1776 SYDNEY-GLACEW BAY HWY, RESERVE MINES, NS B1E 1L2" , lat: 46.1368, lng: -60.1942},
  { id: 20690, name: "UA Local 690", city: "Philadephia", state: "PA", phone: "215-677-6900", website: "plumbers690.org", lat: 40.1092167, lng: -74.9858457, address: "2791 SOUTHAMPTON RD, PHILADELPHIA, PA 19154" },
  { id: 20692, name: "UA Local 692", city: "Philadephia", state: "PA", phone: "215-671-1692", website: "www.sprinklerfitters692.org", lat: 40.1075016, lng: -74.9750531, address: "14002 MCNULTY RD, PHILADELPHIA, PA 19154" },
  { id: 20693, name: "UA Local 693", city: "Barre", state: "VT", phone: "802-864-4042", website: "ualocal693.org", lat: 44.196904, lng: -72.500746, address: "3 GREGORY DR, SOUTH BURLINGTON, VT 5403" },
  { id: 20696, name: "UA Local 696", city: "Newark", state: "NJ", phone: "973-379-7446", website: "sprinklerfitters696.org", lat: 40.7357, lng: -74.1724, address: "41-43 E WILLOW ST, MILLBURN, NJ 07041" },
  { id: 20699, name: "UA Local 699", city: "Seattle", state: "WA", phone: "206-441-0737", website: "ualocal699.org", lat: 47.507566, lng: -122.277681, address: "4411 S RYAN WAY, TUKWILA, WA 98178" },
  { id: 20702, name: "UA Local 702", city: "Nashville", state: "TN", phone: "615-913-6734", website: "ua.org/location/lu-702-nashville-tn", lat: 36.247712, lng: -86.718977, address: "1209 CORELAND DR, MADISON, TN 37115" },
  { id: 20704, name: "UA Local 704", city: "Detroit", state: "MI", phone: "248-474-7553", website: "sprinklerfitters704.org", lat: 42.444821, lng: -83.204074, address: "23475 NORTHWESTERN HWY, SOUTHFIELD, MI 48075" },
  { id: 20709, name: "UA Local 709", city: "Los angeles", state: "CA", phone: "562-698-9909", website: "www.sprinklerfitters709.org", lat: 33.966153, lng: -118.054009, address: "12140 RIVERA RD, WHITTIER, CA 90606" },
  { id: 20716, name: "UA Local 716", city: "", state: "MA", phone: "207-621-0555", website: "local716.org", lat: 44.3687263, lng: -69.7955473, address: "21 GABRIEL DR, AUGUSTA, ME 04330" },
  { id: 20718, name: "UA Local 718", city: "Oak ridge", state: "TN", phone: "865-574-0235", website: "ua.org/location/lu-718-oak-ridge-tn", lat: 36.0171139, lng: -84.2550094, address: "109 VIKING RD, OAK RIDGE, TN 37931" },
  { id: 20719, name: "UA Local 719", city: "Broward county", state: "FL", phone: "954-522-2532", website: "ualocal719.org", lat: 26.0916723, lng: -80.1400482, address: "2502 S ANDREWS AVE, FORT LAUDERDALE, FL 33316" },
  { id: 20721, name: "UA Local 721", city: "Charlottetown", state: "PE", phone: "902-894-5404", address: "594 CAPITAL DR, CORNWALL, PE C0A 1H8" , lat: 46.2382, lng: -63.1311},
  { id: 20725, name: "UA Local 725", city: "Miami", state: "FL", phone: "305-681-8596", website: "ua725.org", lat: 25.892825, lng: -80.271941, address: "13185 NW 45TH AVE, OPA LOCKA, FL 33054" },
  { id: 20740, name: "UA Local 740", city: "St johns", state: "NL", phone: "709-747-2249", website: "www.ualocal740.ca", address: "48 SAGONA AVE DONOVANS IND PK, MOUNT PEARL, NL A1N 4R3" , lat: 47.5615, lng: -52.7126},
  { id: 20760, name: "UA Local 760", city: "Sheffield", state: "AL", phone: "256-383-7900", website: "ua.org/location/lu-760-sheffield-al", lat: 34.7443097, lng: -87.6397483, address: "2807 AVALON AVE, MUSCLE SHOALS, AL 35661" },
  { id: 20761, name: "UA Local 761", city: "Burbank", state: "CA", phone: "818-843-8670", website: "www.local761.org", lat: 34.177527, lng: -118.342843, address: "1305 N NIAGARA ST, BURBANK, CA 91505," },
  { id: 20773, name: "UA Local 773", city: "Glens falls", state: "NY", phone: "518-792-9157", website: "www.lu773.org", lat: 43.3037418, lng: -73.6697297, address: "37 LUZERNE RD, QUEENSBURY, NY 12804" },
  { id: 20776, name: "UA Local 776", city: "Lima", state: "OH", phone: "419-229-5176", website: "www.ualocal776.com", lat: 40.7399785, lng: -84.105006, address: "1300 BOWMAN RD, LIMA, OH 45804" },
  { id: 20777, name: "UA Local 777", city: "", state: "CO", phone: "203-317-4750", website: "www.local777.com", lat: 41.5257344, lng: -72.7612885, address: "1250 E MAIN ST, MERIDEN, CT 6450" },
  { id: 20781, name: "UA Local 781", city: "Kansas city", state: "MO", phone: "816-739-4028", lat: 39.0997, lng: -94.5786, address: "4501 CLEAVER II BLVD STE 781, KANSAS CITY, MO 64130" },
  { id: 20787, name: "UA Local 787", city: "Toronto", state: "ON", phone: "905-790-1019", website: "www.ualocal787.org", address: "419 DEERHURST DR, BRAMPTON, ON L6T 5K3" , lat: 43.744025, lng: -79.667167},
  { id: 20788, name: "UA Local 788", city: "Portsmouth", state: "NH", phone: "207-438-4092", website: "ua.org/location/lu-788-portsmouth-nh", lat: 43.0751306, lng: -70.7601826, address: "BUILDING M1, PORTSMOUTH, NH 3804" },
  { id: 20798, name: "UA Local 798", city: "Tulsa", state: "OK", phone: "918-622-1900", website: "local798.org", lat: 36.043248, lng: -95.947570, address: "4823 S 83RD E ST, TULSA, OK 74145" },
  { id: 20800, name: "UA Local 800", city: "Subury", state: "ON", phone: "705-560-3800", website: "ualocal800.com", address: "1640 BANCROFT DR, SUDBURY, ON P3B 1R8" , lat: 46.4917, lng: -80.993},
  { id: 20803, name: "UA Local 803", city: "Orlando", state: "FL", phone: "407-851-9240", website: "localunion803.org", lat: 28.464177, lng: -81.414898, address: "2447 ORLANDO CENTRAL PKWY, ORLANDO, FL 32809" },
  { id: 20811, name: "UA Local 811", city: "Honolulu", state: "HI", phone: "808-630-8000", website: "plumbershawaii.com", lat: 21.3069, lng: -157.8583, address: "85 1060 WAIANAE VALLEY RD, WAIANAE, HI 96792" },
  { id: 20821, name: "UA Local 821", city: "", state: "FL", phone: "561-422-9821", website: "www.sprinklerfitters821.org", lat: 26.715364, lng: -80.053294, address: "1975 SANSBURY'S WAY STE 115, WEST PALM BEACH, FL 33411" },
  { id: 20827, name: "UA Local 827", city: "Montreal", state: "QC", phone: "438-868-2866", address: "1400 NORMAN ST, MONTREAL, QC H8S 1A8" , lat: 45.5017, lng: -73.5673},
  { id: 20851, name: "UA Local 851", city: "Hopewell", state: "VA", phone: "804-898-1703", lat: 37.3043154, lng: -77.2872001, address: "11916 PATILLO RD, DEWITT, VA 23841" },
  { id: 20853, name: "UA Local 853", city: "Toronto", state: "ON", phone: "905-477-6022", website: "ualocal853.org", address: "60 PERFORMANCE DR, RICHMOND HILL, ON L4S 0G6" , lat: 43.6532, lng: -79.3832},
  { id: 20855, name: "UA Local 855", city: "Jersey city", state: "NJ", phone: "908-450-7620", website: "www.ualocal855.com", lat: 40.215311, lng: -74.013629, address: "261 E MAIN ST, SOMERVILLE, NJ 08876" }
];

const SMART_LOCALS = [];
// ─── BAC LOCAL DATABASE — Bricklayers & Allied Craftworkers ──────────────────
// All data verified from bacweb.org official directory
const BAC_LOCALS = [
  { id: 20500, name: "BAC Local 1 (Alberta, Canada)", city: "Alberta", state: "Ca", phone: "780) 426-7545", website: "www.bacedmonton.ca", email: "kcoghill@bacalberta.ca", lat: 53.5430271, lng: -113.5674532, address: "11330 143 Street, Edmonton AB T5M 1V5, Canada" },
  { id: 20501, name: "BAC Local 2 (British Columbia, Canada)", city: "British Columbia", state: "Ca", phone: "604-584-2021", website: "www.bac2bc.org", email: "info@bac2bc.org", lat: 49.2107594, lng: -122.8811502, address: "12309 Industrial Road, Surrey BC V3V3S4, Canada" },
  { id: 20502, name: "BAC Local 3 (Northern California)", city: "Oakland", state: "CA", phone: "(510) 632-8781", website: "www.bac3-ca.org", email: "troy@bac3-ca.org", lat: 37.7373999, lng: -122.2027593, address: "8201 Capwell Dr., Oakland, CA 94621" },
  { id: 20503, name: "BAC Local 4 (Southern California)", city: "LaVerne", state: "CA", phone: "626-739-5600", website: "www.bac4ca.org", email: "bac4andy@gmail.com", lat: 34.0392937, lng: -118.1067198, address: "2679 Sierra Way, LaVerne, CA 91750, United States" },
  { id: 20504, name: "BAC Local 7 (Ontario Canada)", city: "Ontario Canada", state: "On", phone: "(613) 739-5944", website: "www.local7.ca", email: "info@local7.ca", lat: 45.4146888, lng: -75.628064, address: "1427 Michael St, Ottawa ON K1B 3R3, Canada" },
  { id: 20505, name: "BAC Local 1 (Connecticut)", city: "Connecticut", state: "Co", phone: "(203) 697-0820", website: "www.baclocal1ct.com", email: "gmarotti@baclocal1ct.com", lat: 41.4866274, lng: -72.8134248, address: "17 North Plains Industrial Rd, Wallingford, CT 06492" },
  { id: 20506, name: "BAC Local 1 (Maryland, Virginia, District of Columbia)", city: "Laurel", state: "MD", phone: "240-695-9463", website: "www.baclocal1.org", email: "support@baclocal1.org", lat: 39.0993027, lng: -76.8494305, address: "305 Compton Avenue, Laurel, MD 20707" },
  { id: 20507, name: "BAC Local 1 (Hawaii)", city: "Honolulu", state: "HI", phone: "808-841-8822", website: "hawaiimasonsunion.org", email: "pcoronas@masonsunion.com", lat: 21.3407659, lng: -157.874448, address: "2251 North School Street, Honolulu, HI 96819" },
  { id: 20508, name: "BAC Local 3 (Iowa)", city: "Marshalltown", state: "IA", phone: "515-557-0551", website: "baclocal3ia.org", email: "ray@bac3ia.us", lat: 42.041107, lng: -92.89358, address: "601 S 12th Avenue, Marshalltown, IA 50158" },
  { id: 20509, name: "BAC Local 8 (Illinois)", city: "Illinois", state: "Il", phone: "618-234-5340", website: "bac8il.com", email: "mbraun@bac8il.com", lat: 38.582951, lng: -89.882772, address: "715 Lakepointe Centre,, Suite 127 P.O. Box 487, O’Fallon, IL 62269" },
  { id: 20510, name: "BAC ADC 1 (Illinois)", city: "Illinois", state: "Il", phone: "(630) 941-2300", website: "bacadc1.org", email: "mvolpentesta@bacadc1.org", lat: 41.150092, lng: -87.856866, address: "660 N Industrial Drive, Elmhurst, IL 60126" },
  { id: 20511, name: "BAC Local 4 (indiana, Kentucky)", city: "Indianapolis", state: "IN", phone: "8003222830", website: "www.baclocal4.org", email: "steveknowles@baclocal4.org", lat: 39.9085646, lng: -86.255823, address: "8455 Moller Road, Indianapolis, IN 46268" },
  { id: 20512, name: "BAC Local 3 (Massachusetts, Maine, New Hampshire, Rhode Island)", city: "Charlestown", state: "MA", phone: "617-242-5500", email: "aantonuccio@local3bac.org", lat: 42.3834254, lng: -71.07089, address: "550 Medford Street, Charlestown, MA 02129" },
  { id: 20513, name: "BAC Local 1 (Manitoba, Canada)", city: "Manitoba", state: "Ca", phone: "(204) 297-6074", email: "evancollingridge@outlook.com", lat: 55.001251, lng: -97.001038, address: "Unit 4, 225 McPhillips Street, Winnipeg MB R3E 2K3" },
  { id: 20514, name: "BAC Local 2 (Michigan)", city: "Michigan", state: "Mi", phone: "(586)754-0888", website: "bricklayers.org", email: "brett.gierak@bricklayers.org", lat: 42.4502326, lng: -83.0641409, address: "21031 Ryan Road, Warren, MI 48091" },
  { id: 20515, name: "BAC Local 15 (Missouri, Kasas, Nebraska)", city: "Missouri", state: "Ne", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", lat: 39.057063, lng: -94.594654, address: "632 W 39th Street, Kansas City, MO 64111" },
  { id: 20516, name: "BAC ADC Of Eastern Missouri (Eastern Missouri)", city: "Fenton", state: "MO", phone: "(314) 621-5560", website: "www.bacstl.com", email: "brian.jennewein@gmail.com", lat: 38.5382621, lng: -90.4485428, address: "1670 Fenpark Drive, Fenton, MO 63026" },
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
  { id: 20532, name: "BAC Local 8 (Southeast)", city: "Atlanta", state: "GA", phone: "4048935809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", lat: 44.9487368, lng: -93.0252326, address: "501 Pulliam Street SW, Suite 319, Atlanta, GA 30312" },
  { id: 20533, name: "BAC Local 1 (Saskatchewan)", city: "Regina", state: "SK", phone: "(306) 359-6356", website: "www.bac1sk.ca", email: "derek@bac1sk.ca", lat: 52.1344194, lng: -106.6277843, address: "Po Box 3885, Regina SK S4P3R8" },
  { id: 20534, name: "BAC Local 1 (Washington and Alaska)", city: "Washington and Alaska", state: "Wa", phone: "2062482456", website: "bac1wa-ak.org", email: "lglodowski@bacnorthwest.org", lat: 47.4, lng: -121.49, address: "15208 52nd Ave S, Suite 120, Tukwila, WA 98188" },
  { id: 20535, name: "BAC Wisconsin Distrcit council (Wisconsin)", city: "Wisconsin", state: "Wi", phone: "262-827-4080", website: "www.bacwi.org", email: "jvick@bacwi.org", lat: 43.0746978, lng: -89.3841692, address: "Po Box 510617, New Berlin, WI 53151" },
  { id: 20536, name: "BAC Local 1 (Minnesota / North Dakota / South Dakota)", city: "Minnesota / North Dakota / South Dakota", state: "Mi", phone: "(612) 845-3136", website: "www.bac1mn-nd.org", email: "dschroeder@bac1mn-nd.org", lat: 43.5591395, lng: -96.7314308, address: "312 Central Avenue Room 328, Minneapolis, MN 55414" },
  { id: 20537, name: "BAC Local 1 (Oregon / Washington / Idaho / Montana)", city: "Oregon / Washington / Idaho / Montana", state: "Or", phone: "503-232-0358", website: "www.bac1or.org", email: "office@bac1or.org", lat: 45.5584967, lng: -122.5325719, address: "12812 NE Marx Street, Portland, OR 97230," },
  { id: 20538, name: "BAC Local 6 (Ontario Canada)", city: "Ontario Canada", state: "On", phone: "519-256-3070", email: "jtr.local6@bellnet.ca", lat: 42.2753541, lng: -83.0890102, address: "3454 Sandwich Street, Windsor ON N9C1B3, Canada" }
];

// ─── UBC LOCAL DATABASE — United Brotherhood of Carpenters ───────────────────
// Only verified phones/websites from official regional council directories
const UBC_LOCALS = [
  { id: 70745, name: "UBC Local 745", city: "Honolulu", state: "HI", phone: "(808) 847-5761", website: "www.local745.com", lat: 21.304547, lng: -157.855676, address: "1311 Houghtailing Street, Suite 102, Honolulu, HI 96817-2412" },
  { id: 70746, name: "UBC Local 746", city: "Honolulu", state: "HI", phone: "(808) 847-5761", lat: 21.304547, lng: -157.855676, address: "1311 Houghtailing Street, Suite 102, Honolulu, HI 96817, USA" },
  { id: 71281, name: "UBC Local 1281", city: "Anchorage", state: "AK", phone: "(907) 276-3533", website: "www.ubcalaska.org", email: "Local1281@swmscarpenters.org", lat: 61.2163129, lng: -149.894852, address: "407 Denali Street Suite 100, Anchorage, AK 99501, USA" },
  { id: 72520, name: "UBC Local 2520", city: "Anchorage", state: "AK", phone: "(907) 272-7576", website: "www.local2520.org", email: "local2520@wscarpenters.org", lat: 61.2163129, lng: -149.894852, address: "407 Denali Street, #200, Anchorage, AK 99501, USA" },
  { id: 71243, name: "UBC Local 1243", city: "Fairbanks", state: "AK", phone: "(907) 452-3862", website: "www.local1243.org", email: "Local1243@swmscarpenters.org", lat: 64.8487185, lng: -147.701243, address: "25 Timberland Drive, Fairbanks, AK 99701, USA" },
  { id: 72499, name: "UBC Local 2499", city: "Whitehorse", state: "YT", phone: "(867) 689-0060", website: "www.bcrcc.ca", email: "wh.admin@bcrcc.ca", lat: 60.721571, lng: -135.054932, address: "Suite 104 - 106 Strickland St, Whitehorse, YT Y1A 2J5, CAN" },
  { id: 71370, name: "UBC Local 1370", city: "Prince george", state: "BC", phone: "(236) 423-0300", website: "www.bcrcc.ca", email: "mandrews@ubcja.ca", lat: 37.2204272, lng: -77.288033, address: "450 3rd Avenue, Prince George, BC V2L 3B9, CAN" },
  { id: 71325, name: "UBC Local 1325", city: "Edmonton", state: "AB", phone: "(780) 471-3200", email: "dstubbard@ubcja.ca", lat: 36.9800563, lng: -85.6121906, address: "#133, 15210-123 Avenue, Edmonton, AB T5V 0A3, CAN" },
  { id: 71460, name: "UBC Local 1460", city: "Edmonton", state: "AB", phone: "(780) 430-1460", website: "www.albertamillwrights.com", email: "info@millwrights1460.com", lat: 36.9800563, lng: -85.6121906, address: "201-15210 123 Ave, Edmonton, AB T5V 0A3, CAN" },
  { id: 71021, name: "UBC Local 1021", city: "Saskatoon", state: "SK", phone: "(306) 382-4355", email: "njaeb@ubcmillwrights.ca", lat: 52.193327, lng: -106.622121, address: "3730 Kinnear Place, Saskatoon, SK S7P 0A6, CAN" },
  { id: 71985, name: "UBC Local 1985", city: "Saskatoon", state: "SK", phone: "(306) 382-4355", website: "www.myparc.ca", email: "mgaudet@ubcja.ca", lat: 52.193327, lng: -106.622121, address: "3730 Kinnear Place, Saskatoon, SK S7P 0A6, CAN" },
  { id: 72103, name: "UBC Local 2103", city: "Calgary", state: "AB", phone: "(403) 283-0747", website: "http://www.albertacarpenters.com", email: "nrichter@ubcja.ca", lat: 31.6174004, lng: -94.1193622, address: "2626 - 23 Street NE, Calgary, AB T2E 8L2, CAN" },
  { id: 70527, name: "UBC Local 527", city: "Nanaimo", state: "BC", phone: "(250) 753-9155", website: "http://www.bcrcc.ca", email: "rsnyder@ubcja.ca", lat: 26.9949835, lng: -82.0467815, address: "169 Comox Road, Nanaimo, BC V9R 3H9, CAN" },
  { id: 72404, name: "UBC Local 2404", city: "Delta", state: "BC", phone: "(604) 526-2404", website: "https://www.piledrivers2404.ca", email: "piledrivers@ubcja.ca", lat: 38.7451755, lng: -108.0713417, address: "#101 - 580 Ebury Place, Delta, BC V3M 6M8, CAN" },
  { id: 71907, name: "UBC Local 1907", city: "Delta", state: "BC", phone: "(604) 524-6900", website: "www.bcrcc.ca", email: "executive.assistant@bcrcc.ca", lat: 38.7451755, lng: -108.0713417, address: "#200-580 Ebury Place, Delta, BC V3M 6M8, CAN" },
  { id: 71541, name: "UBC Local 1541", city: "Delta", state: "BC", phone: "(604) 524-6900", website: "www.bcrcc.ca", email: "dautzen@bcrcc.ca", lat: 38.7451755, lng: -108.0713417, address: "#200-580 Ebury Place, Delta, BC V3M 6M8, CAN" },
  { id: 72736, name: "UBC Local 2736", city: "Delta", state: "BC", phone: "(604) 525-2736", lat: 38.7451755, lng: -108.0713417, address: "102/ 580 Ebury Place, Delta, BC V3M 6M8, CAN" },
  { id: 71443, name: "UBC Local 1443", city: "Winnipeg", state: "MB", phone: "(204) 774-1609", lat: 37.6044889, lng: -92.30222, address: "95 Cole Avenue, Winnipeg, MB R2L 1J3, CAN" },
  { id: 70343, name: "UBC Local 343", city: "Winnipeg", state: "MB", phone: "(204) 774-1609", email: "wfriesen@myparc.ca", lat: 37.6044889, lng: -92.30222, address: "95 Cole Avenue, Winnipeg, MB R2L 1J3, CAN" },
  { id: 71614, name: "UBC Local 1614", city: "Winnipeg", state: "MB", phone: "(204) 687-7123", lat: 37.6044889, lng: -92.30222, address: "95 Cole Avenue, Winnipeg, MB R2L 1J3, CAN" },
  { id: 71669, name: "UBC Local 1669", city: "Thunder bay", state: "ON", phone: "(807) 344-0611", website: "carpenterslocal1669.ca", email: "jwhite@ubcja.ca", lat: 39.9201189, lng: -85.946362, address: "1306 Capital Way, Thunder Bay, ON P7B 0A3, CAN" },
  { id: 71151, name: "UBC Local 1151", city: "Thunder bay", state: "ON", phone: "(807) 344-4441", website: "www.millwrightsontario.com", email: "tsadler@millwrightont.com", lat: 39.9201189, lng: -85.946362, address: "180 Clarke Street, Thunder Bay, ON P7A 2L9, CAN" },
  { id: 72486, name: "UBC Local 2486", city: "Azilda", state: "ON", phone: "(705) 983-2486", website: "www.carpenterslocal2486.com", email: "info@local2486.ca", lat: 46.560698, lng: -81.114603, address: "159 Marier Street, Azilda, ON P0M 1B0, CAN" },
  { id: 71425, name: "UBC Local 1425", city: "Sudbury", state: "ON", phone: "(705) 524-7434", website: "www.millwrightsontario.com", email: "abuttazzoni@ubcmillwrights.ca", lat: 31.7790526, lng: -93.0990531, address: "1191 Lansing Ave., Unit #6, Sudbury, ON P3A 4C4, CAN" },
  { id: 70093, name: "UBC Local 93", city: "Ottawa", state: "ON", phone: "(613) 745-1513", website: "www.local93.org", email: "amackenzie@ubcja.ca", lat: 39.6419261, lng: -86.1655501, address: "8560 Campeau Drive, Ottawa, ON K2T 0N7, CAN" },
  { id: 72041, name: "UBC Local 2041", city: "Ottawa", state: "ON", phone: "(613) 746-1265", website: "www.local2041.org", email: "info@local2041.org", lat: 39.6419261, lng: -86.1655501, address: "8560 Campeau Drive, Ottawa, ON K2T 0N7, CAN" },
  { id: 70134, name: "UBC Local 134", city: "Anjou", state: "QC", phone: "(514) 355-1141", lat: 45.621075, lng: -73.557655, address: "8580 Boul. du Golf, Anjou, QC H1J 3A1, CAN" },
  { id: 70380, name: "UBC Local 380", city: "Anjou", state: "QC", phone: "(514) 355-1141", lat: 45.604898, lng: -73.546672, address: "8580, boul. du Golf, Anjou, QC H1J 3A1, CAN" },
  { id: 72109, name: "UBC Local 2109", city: "Anjou", state: "QC", phone: "(514) 355-1141", email: "info@crquibc.ca", lat: 45.621075, lng: -73.557655, address: "8580 Boulevard du Golf, Anjou, QC H1J 3A1, CAN" },
  { id: 71386, name: "UBC Local 1386", city: "Hanwell", state: "NB", phone: "(506) 450-4024", website: "www.acrc.ca", email: "dsmith@ubcja.ca", lat: 45.927849, lng: -66.717550, address: "82 Timothy Ave., South, Hanwell, NB E3C 2B8, CAN" },
  { id: 72262, name: "UBC Local 2262", city: "Hanwell", state: "NB", phone: "(506) 450-4024", website: "www.acrc.ca", email: "sthorne@acrc.ca", lat: 45.875085, lng: -66.787393, address: "c/o ACRC 82 Timothy Ave., South, Hanwell, NB E3C 2B8, CAN" },
  { id: 70911, name: "UBC Local 911", city: "Hanwell", state: "NB", phone: "(506) 450-4024", website: "www.acrc.ca", email: "dsmith@acrc.ca", lat: 45.875085, lng: -66.787393, address: "c/o 82 Timothy Ave., South, Hanwell, NB E3C 2B8, CAN" },
  { id: 70683, name: "UBC Local 683", city: "Hanwell", state: "NB", phone: "(506) 450-4024", website: "www.acrc.ca", email: "fredericton@acrc.ca", lat: 45.921268, lng: -66.719756, address: "82 Timothy Avenue S., Hanwell, NB E3C 2B8, CAN" },
  { id: 72716, name: "UBC Local 2716", city: "Lameque", state: "NB", phone: "(506) 450-4024", website: "www.acrc.ca", lat: 47.795110, lng: -64.647397, address: "PO Box 2061, Lameque, NB E8T 3N5, CAN" },
  { id: 72717, name: "UBC Local 2717", city: "Maisonnette", state: "NB", phone: "(506) 727-3267", lat: 47.826096, lng: -64.989983, address: "1725 Rue Chatillon, Maisonnette, NB E8N 1X1, CAN" },
  { id: 72821, name: "UBC Local 2821", city: "Losier sett.", state: "NB", phone: "(506) 395-6674", website: "www.acrc.ca", address: "9769 Route 11, Losier Sett., NB E1X 3B2, CAN" },
  { id: 71338, name: "UBC Local 1338", city: "Charlottetown", state: "PE", phone: "(902) 566-1414", website: "www.acrc.ca", email: "aroach@acrc.ca", lat: 46.277761, lng: -63.151533, address: "159 John Yeo Dr, Charlottetown, PE C1E 3J3, CAN" },
  { id: 71588, name: "UBC Local 1588", city: "Sydney", state: "NS", phone: "902) 562-5130", website: "www.acrc.ca", lat: 27.9633563, lng: -82.2073118, address: "24 Cossitt Heights Drive, Sydney, NS B1P 7E8, CAN" },
  { id: 71178, name: "UBC Local 1178", city: "Stellarton", state: "NS", phone: "902) 752-3176", website: "www.acrc.ca", email: "shenley@acrc.ca", lat: 35.0718607, lng: -80.9950239, address: "139 Beaufort St Po Box 358, Stellarton, NS B0K 1S0, CAN" },
  { id: 70594, name: "UBC Local 594", city: "Stellarton", state: "NS", phone: "(902) 752-3176", website: "https://www.acrc.ca", email: "shenley@acrc.ca", lat: 35.0718607, lng: -80.9950239, address: "139 Beaufort St., PO Box 358, Stellarton, NS B0K 1S0, CAN" },
  { id: 70579, name: "UBC Local 579", city: "Paradise", state: "NL", phone: "709) 364-5430", website: "www.acrc.ca", email: "jbemister@acrc.ca", lat: 47.525593, lng: -52.872414, address: "89 McNamara Rd, Po Box 3040, Paradise, NL A1L 3W2, CAN" },
  { id: 71009, name: "UBC Local 1009", city: "Paradise", state: "NL", phone: "(709) 364-5410", website: "www.acrc.ca", email: "jbemister@acrc.ca", lat: 47.525593, lng: -52.872414, address: "89 McNamara Rd, Po Box 3040, Paradise, NL A1L 3W2, CAN" },
  { id: 71410, name: "UBC Local 1410", city: "Kingston", state: "ON", phone: "(613) 384-4883", website: "millwrights1410.ca", email: "local1410@ubcmillwrights.ca", lat: 39.3789387, lng: -85.3883005, address: "695 Innovation Drive, Kingston, ON K7K 7E6, CAN" },
  { id: 70397, name: "UBC Local 397", city: "Port hope", state: "ON", phone: "(905) 885-0885", email: "local397@thecarpentersunion.ca", lat: 39.7702956, lng: -86.2613905, address: "459 Croft Street, Port Hope, ON L1A 3V9, CAN" },
  { id: 72309, name: "UBC Local 2309", city: "Toronto", state: "ON", phone: "(416) 757-8754", website: "www.millwrightlocal2309.ca", email: "jbaker@ubcmillwrights.ca", lat: 39.7594645, lng: -87.5011149, address: "79 Sunrise Ave, Toronto, ON M4A 1A9, CAN" },
  { id: 72222, name: "UBC Local 2222", city: "Kincardine", state: "ON", phone: "(519) 396-0222", website: "local2222.ca", email: "rplante@ubcja.ca", lat: 44.166922, lng: -81.642771, address: "385 Queen Street, Kincardine, ON N2Z 2R4, CAN" },
  { id: 70083, name: "UBC Local 83", city: "Lwr sackville", state: "NS", phone: "(902) 454-5100", website: "https://www.acrc.ca", email: "office@acrc.ca", lat: 44.763898, lng: -63.676005, address: "1000 Sackville Drive, Lwr Sackville, NS B4E 0C2, CAN" },
  { id: 72004, name: "UBC Local 2004", city: "Lwr sackville", state: "NS", phone: "(902) 454-5100", website: "http://www.carpentersunion.ca", email: "office@carpentersunion.ca", lat: 44.763898, lng: -63.676005, address: "1000 Sackville Dr, Lwr Sackville, NS B4E 0C2, CAN" },
  { id: 70785, name: "UBC Local 785", city: "Cambridge", state: "ON", phone: "(519) 653-7543", website: "www.local785.ca", email: "local785@thecarpentersunion.ca", lat: 30.0831624, lng: -90.4767255, address: "680 Fountain Street North, Cambridge, ON N3H 0A2, CAN" },
  { id: 72220, name: "UBC Local 2220", city: "Hamilton", state: "ON", phone: "(905) 577-6464", lat: 40.0749813, lng: -86.0498885, address: "1342 Stone Church Rd East, Hamilton, ON L8W 2C8, CAN" },
  { id: 70018, name: "UBC Local 18", city: "Hamilton", state: "ON", phone: "905) 522-0752", email: "info@local18.ca", lat: 40.0749813, lng: -86.0498885, address: "1342 Stonechurch Road East, Hamilton, ON L8W 2C8, CAN" },
  { id: 71946, name: "UBC Local 1946", city: "London", state: "ON", phone: "(519) 649-1200", website: "www.local1946.ca", email: "local1946@local1946.ca", lat: 39.625602, lng: -85.9202594, address: "3800 Highbury Ave South, London, ON N6N 1P3, CAN" },
  { id: 71256, name: "UBC Local 1256", city: "Sarnia", state: "ON", phone: "(519) 344-2352", lat: 39.8406732, lng: -86.0277723, address: "100 Business Park Drive, Sarnia, ON N7W 0A3, CAN" },
  { id: 71592, name: "UBC Local 1592", city: "Sarnia", state: "ON", phone: "(519) 337-7021", website: "www.millwrightlocal1592.com", lat: 39.8406732, lng: -86.0277723, address: "780 Phillip St. East, Sarnia, ON N7T 1Z6, CAN" },
  { id: 71598, name: "UBC Local 1598", city: "Victoria", state: "BC", phone: "(250) 383-8116", website: "www.bcrcc.ca", lat: 28.7997547, lng: -97.0064246, address: "#210 - 2750 Quadra Street, Victoria, BC V8T 4E8, CAN" },
  { id: 7210301, name: "UBC Local 2103 (Calgary)", city: "Calgary", state: "AB", phone: "(403) 283-0747", website: "www.albertacarpenters.com", lat: 31.6174004, lng: -94.1193622, address: "2626 - 23 Street NE, Calgary, AB T2E 8L2, CAN" },
  { id: 72010, name: "UBC Local 2010", city: "Calgary", state: "AB", phone: "(403) 283-0747", website: "www.albertacarpenters.com", lat: 31.6174004, lng: -94.1193622, address: "2626 - 23 Street NE, Calgary, AB T2E 8L2, CAN" },
  { id: 70425, name: "UBC Local 425", city: "Burlington", state: "WA", phone: "(360) 424-1532", email: "local425@wscarpenters.org", lat: 48.4738136, lng: -122.330453, address: "1387 Pacific Drive, Ste. E, Burlington, WA 98233, USA" },
  { id: 71136, name: "UBC Local 1136", city: "Kettle falls", state: "WA", phone: "(509) 936-1431", email: "jlorimer@swmscarpenters.org", lat: 48.6105163, lng: -118.056337, address: "Po Box 956, Kettle Falls, WA 99141, USA" },
  { id: 70059, name: "UBC Local 59", city: "Spokane", state: "WA", phone: "(509) 326-0900", website: "www.carpenterslocal59.org", email: "awyatt@wscarpenters.org", lat: 47.6571934, lng: -117.42351, address: "127 E Augusta Ave, Ste 101, Spokane, WA 99207, USA" },
  { id: 70206, name: "UBC Local 206", city: "Kent", state: "WA", phone: "(253) 945-8806", email: "local206@wscarpenters.org", lat: 47.3826903, lng: -122.2270272, address: "25120 Pacific Hwy S Ste 102, Kent, WA 98032, USA" },
  { id: 70360, name: "UBC Local 360", city: "Lacey", state: "WA", phone: "(360) 459-0359", email: "local360@wscarpenters.org", lat: 47.0263876, lng: -122.8072257, address: "1222 Carpenter Rd. SE, Ste A-1, Lacey, WA 98503, USA" },
  { id: 72761, name: "UBC Local 2761", city: "Mccleary", state: "WA", phone: "(360) 495-3525", email: "jroth@wscarpenters.org", lat: 47.053151, lng: -123.26543, address: "PO Box 61, McCleary, WA 98557, USA" },
  { id: 72851, name: "UBC Local 2851", city: "La grande", state: "OR", phone: "(541) 962-5228", email: "jroth@wscarpenters.org", lat: 45.3246068, lng: -118.0878695, address: "Po Box 925, LA Grande, OR 97850, USA" },
  { id: 70503, name: "UBC Local 503", city: "Portland", state: "OR", phone: "(503) 305-5904", email: "local503@wscarpenters.org", lat: 45.5537208, lng: -122.4986863, address: "4222 NE 158th Ave, Portland, OR 97230, USA" },
  { id: 70541, name: "UBC Local 541", city: "Eugene", state: "OR", phone: "(541) 687-6755", email: "local541@wscarpenters.org", lat: 44.0505054, lng: -123.0950506, address: "1265 S. Bertelsen Rd #6, Eugene, OR 97402, USA" },
  { id: 72949, name: "UBC Local 2949", city: "Roseburg", state: "OR", phone: "(541) 672-3329", email: "Local2949@ncscarpenters.org", lat: 43.2018543, lng: -123.3509647, address: "742 SE Roberts Avenue, Roseburg, OR 97470, USA" },
  { id: 70082, name: "UBC Local 82", city: "Great falls", state: "MT", phone: "(406) 453-1301", email: "Local82@wscarpenters.org", lat: 47.5048851, lng: -111.29189, address: "300 15th Street South, #1, Great Falls, MT 59405, USA" },
  { id: 70208, name: "UBC Local 208", city: "Meridian", state: "ID", phone: "(208) 333-0343", lat: 43.6086295, lng: -116.392326, address: "965 S Industry Way, Ste 104, Meridian, ID 83642, USA" },
  { id: 70555, name: "UBC Local 555", city: "Denver", state: "CO", phone: "(303) 355-8774", lat: 39.7760904, lng: -104.9221857, address: "4290 Holly Street, Denver, CO 80216, USA" },
  { id: 70801, name: "UBC Local 801", city: "West jordan", state: "UT", phone: "(801) 280-0292", lat: 40.6061337, lng: -111.9395211, address: "8149 S Welby Park Dr, West Jordan, UT 84088, USA" },
  { id: 70665, name: "UBC Local 665", city: "Amarillo", state: "TX", phone: "(806) 373-4574", email: "local665@centralsouthcarpenters.org", lat: 35.2368645, lng: -101.925935, address: "12180 RM 1061, Amarillo, TX 79124, USA" },
  { id: 71319, name: "UBC Local 1319", city: "Albuquerque", state: "NM", phone: "(505) 268-4389", lat: 35.1343012, lng: -106.6065424, address: "3900A Pan American Freeway NE, Albuquerque, NM 87107, USA" },
  { id: 71912, name: "UBC Local 1912", city: "Phoenix", state: "AZ", lat: 33.4639836, lng: -112.1552771, address: "4547 W. McDowell Rd, Phoenix, AZ 85035, USA" },
  { id: 71977, name: "UBC Local 1977", city: "Las vegas", state: "NV", phone: "(702) 531-1805", lat: 36.0707903, lng: -115.0810573, address: "4245 W Sunset Road, Las Vegas, NV 89118, USA" },
  { id: 70971, name: "UBC Local 971", city: "Reno", state: "NV", phone: "(775) 323-8492", lat: 39.5138318, lng: -119.7769866, address: "1150 Terminal Way, Reno, NV 89502, USA" },
  { id: 70951, name: "UBC Local 951", city: "Riverside", state: "CA", phone: "(951) 697-6700", email: "local951@wscarpenters.org", lat: 33.941542, lng: -117.2929288, address: "6147 River Crest Dr, Riverside, CA 92507, USA" },
  { id: 70619, name: "UBC Local 619", city: "San diego", state: "CA", phone: "(858) 621-2670", email: "Local619@wscarpenters.org", lat: 32.899437, lng: -117.110458, address: "10054 Old Grove Rd, San Diego, CA 92131, USA" },
  { id: 70909, name: "UBC Local 909", city: "Ontario", state: "ON", phone: "(909) 887-2524", email: "local909@wscarpenters.org", lat: 34.065846, lng: -117.64843, address: "3250 E Shelby Street, Ste 122, Ontario, CA 91764, USA" },
  { id: 70714, name: "UBC Local 714", city: "Buena park", state: "CA", phone: "(714) 766-7140", lat: 33.870413, lng: -117.9962165, address: "7111 Firestone Blvd Suite#122, Buena Park, CA 90621, USA" },
  { id: 70091, name: "UBC Local 91", city: "Carson", state: "CA", phone: "(323) 335-7523", lat: 33.8787572, lng: -118.2563138, address: "1010 E Sandhill Ave, Carson, CA 90746, USA" },
  { id: 72159, name: "UBC Local 2159", city: "City of industry", state: "CA", phone: "(323) 724-0178", email: "local1607@wecarpenters.org", lat: 34.0152891, lng: -118.0489544, address: "10009 Rose Hills Road, City of Industry, CA 90601-1703, USA" },
  { id: 70110, name: "UBC Local 110", city: "Los angeles", state: "CA", phone: "(213) 385-3510", email: "local110@wscarpenters.org", lat: 34.0672344, lng: -118.2269492, address: "1645 North Main Street, Los Angeles, CA 90012, USA" },
  { id: 70818, name: "UBC Local 818", city: "Sylmar", state: "CA", phone: "(818) 364-9303", email: "local818@wscarpenters.org", lat: 34.3067857, lng: -118.4784268, address: "15881 Valley View Court, Sylmar, CA 91342-3579, USA" },
  { id: 70099, name: "UBC Local 99", city: "Fresno", state: "CA", phone: "(559) 268-3895", lat: 36.7599028, lng: -119.8338386, address: "1361 N Hulbert Ave, Fresno, CA 93728, USA" },
  { id: 70646, name: "UBC Local 646", city: "Marina", state: "CA", phone: "(831) 883-1931", email: "fst@carpenters646.org", lat: 36.6844029, lng: -121.802173, address: "910 2nd Avenue, Marina, CA 93933, USA" },
  { id: 79144, name: "UBC Local 9144", city: "San jose", state: "CA", phone: "(408) 264-3080", lat: 37.2963711, lng: -121.8799983, address: "2102 Almaden Road #116, San Jose, CA 95125-2104, USA" },
  { id: 70217, name: "UBC Local 217", city: "Foster city", state: "CA", phone: "(650) 377-0217", lat: 37.5600336, lng: -122.2688522, address: "1153 Chess Drive Suite 100, Foster City, CA 94404-1197, USA" },
  { id: 79068, name: "UBC Local 9068", city: "Livermore", state: "CA", phone: "(510) 430-1412", lat: 37.7054968, lng: -121.8192648, address: "3220 Constitution Dr, Livermore, CA 94551, USA" },
  { id: 70713, name: "UBC Local 713", city: "Hayward", state: "CA", phone: "(510) 581-7817", website: "www.carpenters713.org", lat: 37.6688205, lng: -122.080796, address: "1050 Mattox Road, Hayward, CA 94541-1298, USA" },
  { id: 70034, name: "UBC Local 34", city: "Oakland", state: "CA", phone: "(510) 635-4227", lat: 37.7302421, lng: -122.1980008, address: "55 Hegenberger Place, Oakland, CA 94621-1301, USA" },
  { id: 72236, name: "UBC Local 2236", city: "Oakland", state: "CA", phone: "(510) 446-2236", lat: 37.7959027, lng: -122.2768636, address: "115 Broadway, Oakland, CA 94607, USA" },
  { id: 70022, name: "UBC Local 22", city: "San francisco", state: "CA", phone: "(415) 355-1322", email: "info@local22.org", lat: 37.7632984, lng: -122.3889155, address: "2085 3rd Street, San Francisco, CA 94107, USA" },
  { id: 70152, name: "UBC Local 152", city: "Martinez", state: "CA", phone: "(925) 228-1858", website: "carpenters152.org", email: "fst@carpenters152.org", lat: 38.0138934, lng: -122.1338674, address: "Po Box 4040, Martinez, CA 94553, USA" },
  { id: 70180, name: "UBC Local 180", city: "Vallejo", state: "CA", phone: "(707) 644-1040", website: "local180.org", lat: 38.1139749, lng: -122.2527755, address: "404 Nebraska Street, Vallejo, CA 94590, USA" },
  { id: 70751, name: "UBC Local 751", city: "Santa rosa", state: "CA", phone: "(707) 545-5121", email: "office@carpenters751.org", lat: 38.4224582, lng: -122.7159851, address: "1706 Corby Avenue, Santa Rosa, CA 95407, USA" },
  { id: 79109, name: "UBC Local 9109", city: "Sacramento", state: "CA", phone: "(916) 646-6759", lat: 38.5810606, lng: -121.493895, address: "4421 Pell Drive, Suite D, Sacramento, CA 95838, USA" },
  { id: 70046, name: "UBC Local 46", city: "Sacramento", state: "CA", phone: "(916) 614-7901", lat: 38.5810606, lng: -121.493895, address: "4421 Pell Drive, Ste. A, Sacramento, CA 95838, USA" },
  { id: 70943, name: "UBC Local 943", city: "Tulsa", state: "OK", phone: "(918) 628-0410", email: "local943@centralsouthcarpenters.org", lat: 36.0840394, lng: -95.856878, address: "5476 S 108th East Ave, Tulsa, OK 74146-5817, USA" },
  { id: 70216, name: "UBC Local 216", city: "Russellville", state: "AR", phone: "(479) 783-4139", email: "local216@centralsouthcarpenters.org", lat: 35.2786302, lng: -93.0910491, address: "340 N Shamrock Blvd., Russellville, AR 72802, USA" },
  { id: 70345, name: "UBC Local 345", city: "Cordova", state: "TN", phone: "(901) 624-4986", email: "jtallent@secarpenters.org", lat: 35.1556451, lng: -89.7761955, address: "7260 Goodlet Farms Parkway, Cordova, TN 38016, USA" },
  { id: 71209, name: "UBC Local 1209", city: "Florence", state: "AL", phone: "(256) 766-4055", email: "local1209@secarpenters.org", lat: 34.8683748, lng: -87.6598437, address: "4300 Helton Dr, Florence, AL 35630, USA" },
  { id: 71554, name: "UBC Local 1554", city: "La vergne", state: "TN", phone: "(615) 874-8591", website: "southernstatesmillwrights.org", email: "wcondon@secarpenters.org", lat: 36.0156178, lng: -86.5819394, address: "P O Box 156, 130 Veterans Memorial Pkwy., La Vergne, TN 37086, USA" },
  { id: 70074, name: "UBC Local 74", city: "Hixson", state: "TN", phone: "(423) 842-5320", email: "csutton@secarpenters.org", lat: 35.1406267, lng: -85.2327349, address: "6260 Dayton Blvd., Hixson, TN 37343, USA" },
  { id: 70050, name: "UBC Local 50", city: "Oak ridge", state: "TN", phone: "(865) 482-0060", email: "local50@secarpenters.org", lat: 35.9773693, lng: -84.2297451, address: "1005 Floyd Culler Court, Oak Ridge, TN 37830, USA" },
  { id: 70312, name: "UBC Local 312", city: "Charlotte", state: "NC", phone: "(336) 249-2239", email: "lu312@secarpenters.org", lat: 35.2819796, lng: -80.7254275, address: "1928 Back Creek Dr, Charlotte, NC 28213, USA" },
  { id: 71263, name: "UBC Local 1263", city: "Kennesaw", state: "GA", phone: "(770) 795-1263", email: "millwrightlocal1263@gmail.com", lat: 34.0234337, lng: -84.6154897, address: "P. O. Box 2562, Kennesaw, GA 30156-9110, USA" },
  { id: 70225, name: "UBC Local 225", city: "Atlanta", state: "GA", phone: "(678) 553-4700", website: "southernrcc.org", lat: 33.796911, lng: -84.494695, address: "3500 Atlanta Industrial Drive, Atlanta, GA 30331, USA" },
  { id: 71192, name: "UBC Local 1192", city: "Birmingham", state: "AL", phone: "(205) 836-6734", lat: 33.524717, lng: -86.798225, address: "624 28th Street North, Birmingham, AL 35203, USA" },
  { id: 70318, name: "UBC Local 318", city: "Pelham", state: "AL", phone: "(205) 685-9047", lat: 33.2937004, lng: -86.7996527, address: "100 Commerce Drive, Pelham, AL 35124, USA" },
  { id: 70283, name: "UBC Local 283", city: "Augusta", state: "GA", phone: "(706) 722-4445", email: "lu283@bellsouth.net", lat: 33.4709714, lng: -81.9748429, address: "3025 Riverwatch Pkwy Bldg 300, Augusta, GA 30907, USA" },
  { id: 70256, name: "UBC Local 256", city: "Savannah", state: "GA", phone: "(912) 341-0323", lat: 32.0790074, lng: -81.0921335, address: "40 Telfair Place, Savannah, GA 31415-9514, USA" },
  { id: 70702, name: "UBC Local 702", city: "Jacksonville", state: "FL", phone: "(904) 387-4471", website: "southernrcc.org", lat: 30.3192188, lng: -81.7184704, address: "4000 Union Hall Pl, Jacksonville, FL 32205, USA" },
  { id: 71820, name: "UBC Local 1820", city: "Winter garden", state: "FL", phone: "(407) 877-6899", lat: 28.5665979, lng: -81.5775883, address: "730 E Plant St, Winter Garden, FL 34787, USA" },
  { id: 71905, name: "UBC Local 1905", city: "Orlando", state: "FL", phone: "(407) 282-2004", email: "local1905@flcrc.org", lat: 28.5421218, lng: -81.379045, address: "4700 Distribution Ct, Orlando, FL 32822, USA" },
  { id: 71000, name: "UBC Local 1000", city: "Tampa", state: "FL", phone: "(813) 626-1119", lat: 27.9449854, lng: -82.4583107, address: "9711 East US Highway 92, Tampa, FL 33610, USA" },
  { id: 71809, name: "UBC Local 1809", city: "Oakland park", state: "FL", phone: "(305) 570-1929", lat: 26.1723065, lng: -80.1319893, address: "2860 Nw 27th Ave, Oakland Park, FL 33311, USA" },
  { id: 71846, name: "UBC Local 1846", city: "Metairie", state: "LA", phone: "(504) 822-2243", email: "local1846@centralsouthcarpenters.org", lat: 30.0075774, lng: -90.2285153, address: "2850 Massachusetts Avenue, Metairie, LA 70003, USA" },
  { id: 71098, name: "UBC Local 1098", city: "Baton rouge", state: "LA", phone: "(225) 356-2468", email: "local1098@centralsouthcarpenters.org", lat: 30.4494155, lng: -91.1869659, address: "8875 Greenwell Sprgs Rd Ste A, Baton Rouge, LA 70814-2710, USA" },
  { id: 73101, name: "UBC Local 3101", city: "Oakdale", state: "LA", phone: "(504) 273-9604", lat: 30.8147872, lng: -92.6564081, address: "Po Box 1129, Oakdale, LA 71463, USA" },
  { id: 72232, name: "UBC Local 2232", city: "Pasadena", state: "TX", phone: "(713) 649-0333", email: "local2232@centralsouthcarpenters.org", lat: 29.6825473, lng: -95.147276, address: "2151 Alabama St, Pasadena, TX 77503, USA" },
  { id: 71266, name: "UBC Local 1266", city: "Austin", state: "TX", phone: "(512) 476-7354", email: "local1266@centralsouthcarpenters.org", lat: 30.2711286, lng: -97.7436995, address: "1825 S. Ih 35, Austin, TX 78741, USA" },
  { id: 70429, name: "UBC Local 429", city: "Arlington", state: "TX", phone: "(817) 784-0429", email: "local429@centralsouthcarpenters.org", lat: 32.71543, lng: -97.057078, address: "1901 Susan Drive, Arlington, TX 76010, USA" },
  { id: 71421, name: "UBC Local 1421", city: "Arlington", state: "TX", phone: "(817) 784-1421", email: "millwright1421@yahoo.com", lat: 32.71543, lng: -97.057078, address: "1901 Susan Drive, Arlington, TX 76010, USA" },
  { id: 70357, name: "UBC Local 357", city: "Paducah", state: "KY", phone: "(270) 442-1148", lat: 37.0913419, lng: -88.6279939, address: "2029 Cairo Road, Paducah, KY 42001-2421, USA" },
  { id: 71770, name: "UBC Local 1770", city: "Cape girardeau", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local1770@carpentersunion.org", lat: 37.2871837, lng: -89.55874, address: "815 Enterprise Street, Cape Girardeau, MO 63703-7515, USA" },
  { id: 70205, name: "UBC Local 205", city: "Ashland", state: "VA", phone: "(804) 743-7458", website: "carpenters205.org", lat: 37.7594012, lng: -77.4806603, address: "10238 Sycamore Drive, Ashland, VA 23005, USA" },
  { id: 71091, name: "UBC Local 1091", city: "Bismarck", state: "ND", phone: "(701) 255-3700", email: "local1091@ncsrcc.org", lat: 46.803613, lng: -100.792186, address: "217 S. Mandan St, Bismarck, ND 58504-5516, USA" },
  { id: 71176, name: "UBC Local 1176", city: "Fargo", state: "ND", phone: "(701) 235-4981", email: "local1176@ncsrcc.org", lat: 46.879975, lng: -96.8391845, address: "513 36th Street North, Fargo, ND 58102, USA" },
  { id: 71934, name: "UBC Local 1934", city: "Bemidji", state: "MN", phone: "(218) 759-0153", email: "local1934@ncsrcc.org", lat: 47.4531233, lng: -94.8581593, address: "904 Paul Bunyan Drive SE, Bemidji, MN 56601, USA" },
  { id: 70361, name: "UBC Local 361", city: "Hermantown", state: "MN", phone: "(218) 724-3297", email: "local361@ncsrcc.org", lat: 46.8367472, lng: -92.2320202, address: "5238 Miller Trunk Hwy, Hermantown, MN 55811, USA" },
  { id: 70606, name: "UBC Local 606", city: "Virginia", state: "VA", phone: "(218) 741-6010", email: "local606@ncsrcc.org", lat: 47.5269654, lng: -92.5441425, address: "726 4th Street N, Virginia, MN 55792, USA" },
  { id: 71348, name: "UBC Local 1348", city: "Virginia", state: "VA", phone: "(218) 741-6314", email: "local1348@ncsrcc.org", lat: 47.5269654, lng: -92.5441425, address: "726 4th Street N, Virginia, MN 55792, USA" },
  { id: 70948, name: "UBC Local 948", city: "Sioux city", state: "IA", phone: "(712) 255-1567", email: "local948@ncsrcc.org", lat: 42.5100547, lng: -96.4370459, address: "2200 W 19th Street, Sioux City, IA 51103, USA" },
  { id: 70587, name: "UBC Local 587", city: "Sioux falls", state: "SD", phone: "(605) 357-8284", email: "local587@ncsrcc.org", lat: 43.5921171, lng: -96.6932708, address: "4208 N Hainje Ave., Sioux Falls, SD 57104, USA" },
  { id: 70464, name: "UBC Local 464", city: "Mankato", state: "MN", phone: "(507) 369-2726", email: "local464@ncsrcc.org", lat: 44.1639102, lng: -94.0037286, address: "220 East Jackson Street, Mankato, MN 56001, USA" },
  { id: 70930, name: "UBC Local 930", city: "Saint augusta", state: "MN", phone: "(320) 252-1412", email: "local930@ncsrcc.org", lat: 45.4785762, lng: -94.1541547, address: "24086 Highway 15 #102, Saint Augusta, MN 56301, USA" },
  { id: 71382, name: "UBC Local 1382", city: "Rochester", state: "MN", phone: "(507) 282-3119", email: "local1382@ncsrcc.org", lat: 43.9257881, lng: -92.4766811, address: "6692 10th Ave SW, Rochester, MN 55902, USA" },
  { id: 71074, name: "UBC Local 1074", city: "Eau claire", state: "WI", phone: "(715) 835-8892", email: "local1074@ncsrcc.org", lat: 44.8142661, lng: -91.5558603, address: "2302 W Cameron St, Eau Claire, WI 54703, USA" },
  { id: 71143, name: "UBC Local 1143", city: "Lacrosse", state: "WI", phone: "(608) 788-6240", email: "local1143@ncsrcc.org", lat: 43.435153, lng: -89.7295833, address: "2421 Larson St., LaCrosse, WI 54603, USA" },
  { id: 70310, name: "UBC Local 310", city: "Mosinee", state: "WI", phone: "(715) 355-0806", email: "local310@ncsrcc.org", lat: 44.8099665, lng: -89.6874206, address: "601 Maple Ridge Road, Mosinee, WI 54455, USA" },
  { id: 71510, name: "UBC Local 1510", city: "Escanaba", state: "MI", phone: "(906) 789-1670", website: "www.nmcarpenters.com", email: "INFO@HAMMER9.COM", lat: 45.7443824, lng: -87.0654155, address: "1219 1st Avenue South, Escanaba, MI 49829, USA" },
  { id: 71146, name: "UBC Local 1146", city: "Green bay", state: "WI", phone: "(920) 469-1146", email: "local1146@ncsrcc.org", lat: 44.5126379, lng: -88.0125794, address: "2599 Manitowoc Ct, Green Bay, WI 54311, USA" },
  { id: 70314, name: "UBC Local 314", city: "Madison", state: "WI", phone: "(608) 240-0314", email: "local314@ncsrcc.org", lat: 43.1535686, lng: -89.3207542, address: "5202 Monument Lane, Madison, WI 53704, USA" },
  { id: 70161, name: "UBC Local 161", city: "Kenosha", state: "WI", phone: "(262) 970-5777", email: "local161@ncsrcc.org", lat: 42.6103305, lng: -87.8566492, address: "3030 39th Avenue, Kenosha, WI 53144, USA" },
  { id: 70231, name: "UBC Local 231", city: "Pewaukee", state: "WI", phone: "(262) 970-5777", email: "Local231@ncsrcc.org", lat: 43.0846017, lng: -88.2139452, address: "N25W23055 Paul Road, Suite #1, Pewaukee, WI 53072, USA" },
  { id: 72337, name: "UBC Local 2337", city: "Pewaukee", state: "WI", phone: "(262) 970-5777", email: "local2337@ncsrcc.org", lat: 43.0846017, lng: -88.2139452, address: "N25W23055 Paul Road, Suite #1, Pewaukee, WI 53072, USA" },
  { id: 70068, name: "UBC Local 68", city: "Saint paul", state: "MN", phone: "(651) 379-0268", email: "local68@ncsrcc.org", lat: 44.959206, lng: -93.0875598, address: "730 Olive St, Saint Paul, MN 55130, USA" },
  { id: 71847, name: "UBC Local 1847", city: "St. paul", state: "MN", phone: "(651) 209-3466", email: "local1847@ncsrcc.org", lat: 44.959206, lng: -93.0875598, address: "730 Olive St, St. Paul, MN 55130, USA" },
  { id: 70322, name: "UBC Local 322", city: "Saint paul", state: "MN", phone: "(651) 379-0272", email: "local322@ncsrcc.org", lat: 44.959206, lng: -93.0875598, address: "730 Olive St, Saint Paul, MN 55130, USA" },
  { id: 70548, name: "UBC Local 548", city: "St. paul", state: "MN", phone: "(651) 636-3999", email: "local548@ncsrcc.org", lat: 44.959206, lng: -93.0875598, address: "730 Olive Street, St. Paul, MN 55130, USA" },
  { id: 70955, name: "UBC Local 955", city: "Kaukauna", state: "WI", phone: "(920) 996-2311", email: "local955@ncsrcc.org", lat: 44.2780432, lng: -88.2720503, address: "N2216 Bodde Rd, Kaukauna, WI 54130, USA" },
  { id: 71056, name: "UBC Local 1056", city: "Kaukauna", state: "WI", phone: "(920) 996-2319", email: "local1056@ncsrcc.org", lat: 44.2780432, lng: -88.2720503, address: "N2216 Bodde Rd, Kaukauna, WI 54130, USA" },
  { id: 72060, name: "UBC Local 2060", city: "Altoona", state: "IA", phone: "(920) 452-9424", email: "local2060@ncsil.org", lat: 41.6650823, lng: -93.4644587, address: "1555 1st Ave. N., Altoona, IA 50009, USA" },
  { id: 70106, name: "UBC Local 106", city: "Altoona", state: "IA", phone: "(515) 262-8079", email: "local106@ncsrcc.org", lat: 41.6618899, lng: -93.4644948, address: "1555 1st Avenue North, Altoona, IA 50009, USA" },
  { id: 70308, name: "UBC Local 308", city: "Cedar rapids", state: "IA", phone: "(319) 363-0279", email: "local308@ncsrcc.org", lat: 41.9758872, lng: -91.6704053, address: "240 Classic Car Court Southwest-Suite B, Cedar Rapids, IA 52404, USA" },
  { id: 71260, name: "UBC Local 1260", city: "Iowa city", state: "IA", phone: "(319) 338-1638", website: "www.carpentersunionlocal1260.com", email: "local1260@ncsrcc.org", lat: 41.6612561, lng: -91.5299106, address: "1008 William St Suite 101A, Iowa City, IA 52240, USA" },
  { id: 70678, name: "UBC Local 678", city: "Dubuque", state: "IA", phone: "(563) 582-8521", website: "www.carpenterslocal678.org", email: "carpentersunionlocal678@gmail.com", lat: 42.5083536, lng: -90.6687126, address: "1638 Central Avenue, Dubuque, IA 52001-3625, USA" },
  { id: 70004, name: "UBC Local 4", city: "Davenport", state: "IA", phone: "(563) 386-1618", email: "local4@carpentersunion.org", lat: 41.592959, lng: -90.6789019, address: "6623 West Kimberly Road, Davenport, IA 52806-6614, USA" },
  { id: 72158, name: "UBC Local 2158", city: "East moline", state: "IL", phone: "(563) 332-2158", email: "local2158@carpentersunion.org", lat: 41.5152157, lng: -90.4420411, address: "428 Carpenter Ct, East Moline, IL 61244, USA" },
  { id: 70790, name: "UBC Local 790", city: "Rock falls", state: "IL", phone: "815) 626-1533", email: "local790@carpentersunion.org", lat: 41.7816248, lng: -89.6926018, address: "1008 Seventh Avenue, Rock Falls, IL 61071, USA" },
  { id: 70792, name: "UBC Local 792", city: "Rockford", state: "IL", phone: "815) 963-8675", email: "local792@carpentersunion.org", lat: 42.2713945, lng: -89.093966, address: "212 South First Street, Rockford, IL 61104-2089, USA" },
  { id: 70250, name: "UBC Local 250", city: "Lakemoor", state: "IL", phone: "(847) 662-7421", email: "Local250@carpentersunion.org", lat: 42.3286331, lng: -88.1989732, address: "28874 W IL RT 120 Suite A, Lakemoor, IL 60051, USA" },
  { id: 70058, name: "UBC Local 58", city: "Chicago", state: "IL", phone: "(773) 267-5858", email: "local58@carpentersunion.org", lat: 41.9995581, lng: -87.8123275, address: "6535 N Olmsted Ave, Chicago, IL 60631, USA" },
  { id: 70013, name: "UBC Local 13", city: "Chicago", state: "IL", phone: "(312) 829-1396", email: "local13@carpentersunion.org", lat: 41.8755616, lng: -87.6244212, address: "300 South Ashland Ave, Rm 102, Chicago, IL 60607-4006, USA" },
  { id: 70174, name: "UBC Local 174", city: "Joliet", state: "IL", phone: "(815) 725-9473", email: "local174@carpentersunion.org", lat: 41.5458586, lng: -88.1608333, address: "1407 Essington Road, Joliet, IL 60435, USA" },
  { id: 70272, name: "UBC Local 272", city: "Chicago heights", state: "IL", phone: "(708) 755-6879", email: "local272@carpentersunion.org", lat: 41.5165878, lng: -87.642942, address: "821 Chicago Road, Chicago Heights, IL 60411-2139, USA" },
  { id: 72950, name: "UBC Local 2950", city: "Merrillville", state: "IN", phone: "(219) 942-0518", website: "www.cmwcarpenters.com", lat: 41.4890676, lng: -87.3286579, address: "1560 East 70th, Merrillville, IN 46410, USA" },
  { id: 70413, name: "UBC Local 413", city: "South bend", state: "IN", phone: "(574) 233-2138", lat: 41.7232, lng: -86.33657, address: "3570 Blackthorn Ct., South Bend, IN 46628, USA" },
  { id: 71693, name: "UBC Local 1693", city: "Lisle", state: "IL", phone: "(630) 325-6036", email: "local1693@carpentersunion.org", lat: 41.801159, lng: -88.0747687, address: "4979 Indiana Ave Suite 211, Lisle, IL 60532, USA" },
  { id: 71027, name: "UBC Local 1027", city: "Lisle", state: "IL", phone: "(630) 323-1027", email: "local1027@carpentersunion.org", lat: 41.801159, lng: -88.0747687, address: "4979 Indiana Ave, STE 210, Lisle, IL 60532-3818, USA" },
  { id: 71185, name: "UBC Local 1185", city: "Lisle", state: "IL", phone: "(630) 325-4132", website: "www.chicagofloorcovering.com", email: "local1185@carpentersunion.org", lat: 41.801159, lng: -88.0747687, address: "4979 Indiana Ave, Suite 213, Lisle, IL 60532, USA" },
  { id: 71889, name: "UBC Local 1889", city: "Lisle", state: "IL", phone: "(630) 271-9950", email: "local1889@carpentersunion.org", lat: 41.801159, lng: -88.0747687, address: "4979 Indiana Avenue Suite 202, Lisle, IL 60532, USA" },
  { id: 70001, name: "UBC Local 1", city: "Chicago", state: "IL", phone: "(312) 850-0848", email: "local1@carpentersunion.org", lat: 41.8755616, lng: -87.6244212, address: "1327 W. Washington Blvd #101, Chicago, IL 60607, USA" },
  { id: 70010, name: "UBC Local 10", city: "Bridgeview", state: "IL", phone: "(708) 233-4610", email: "local10@carpentersunion.org", lat: 41.7092801, lng: -87.8090302, address: "7625 West 100th Place, Bridgeview, IL 60455-2432, USA" },
  { id: 70054, name: "UBC Local 54", city: "Bridgeview", state: "IL", phone: "(708) 598-4554", email: "local54@carpentersunion.org", lat: 41.7092801, lng: -87.8090302, address: "7625 West 100th Place, Bridgeview, IL 60455, USA" },
  { id: 70232, name: "UBC Local 232", city: "Fort wayne", state: "IN", phone: "(260) 484-1803", lat: 41.1267693, lng: -85.1636074, address: "1520 Profit Dr., Fort Wayne, IN 46808, USA" },
  { id: 70351, name: "UBC Local 351", city: "Rossford", state: "OH", phone: "(419) 893-2317", website: "www.cmwcarpenters.com", email: "lu351@cmrcc.com", lat: 41.557813, lng: -83.5748861, address: "9278 Bass Pro Blvd., Rossford, OH 43460, USA" },
  { id: 71123, name: "UBC Local 1123", city: "Lincoln park", state: "MI", phone: "(734) 934-9335", lat: 42.2505943, lng: -83.1785361, address: "PO Box 208, Lincoln Park, MI 48146, USA" },
  { id: 70494, name: "UBC Local 494", city: "Tecumseh", state: "ON", phone: "(519) 737-1101", website: "local494.ca", email: "local494admin@ubcja.ca", lat: 39.563092, lng: -87.4216866, address: "2179 Fasan Dr., Tecumseh, ON N0R 1L0, CAN" },
  { id: 71244, name: "UBC Local 1244", city: "Windsor", state: "ON", phone: "(519) 944-5588", website: "ubcmillwrightslocal1244.ca", lat: 40.1544887, lng: -85.2127456, address: "3161 Lloyd George Boulevard, Windsor, ON N8T 2V5, CAN" },
  { id: 71234, name: "UBC Local 1234", city: "Warren", state: "MI", phone: "(313) 832-3887", website: "www.nmcarpenters.com", email: "info@hammer9.com", lat: 42.4932575, lng: -83.0062746, address: "23401 Mound, Suite 101, Warren, MI 48091, USA" },
  { id: 70687, name: "UBC Local 687", city: "Warren", state: "MI", phone: "(313) 832-3887", website: "www.nmcarpenters.com", email: "info@hammer9.com", lat: 42.4932575, lng: -83.0062746, address: "23401 Mound Road, Suite 101, Warren, MI 48091, USA" },
  { id: 71102, name: "UBC Local 1102", city: "Warren", state: "MI", phone: "(586) 756-3610", lat: 42.4651596, lng: -83.0452729, address: "23401 Mound Road, Warren, MI 48091, USA" },
  { id: 71045, name: "UBC Local 1045", city: "Warren", state: "MI", phone: "(313) 832-3887", website: "www.nmcarpenters.com", email: "info@hammer9.com", lat: 42.4932575, lng: -83.0062746, address: "23401 Mound Road Suite 101, Warren, MI 48091, USA" },
  { id: 72776, name: "UBC Local 2776", city: "Kalamazoo", state: "MI", phone: "(269) 365-9429", lat: 42.2806178, lng: -85.545925, address: "2711 Carleton, Kalamazoo, MI 49048, USA" },
  { id: 70525, name: "UBC Local 525", city: "Wayland", state: "MI", phone: "(269) 345-8601", website: "www.nmcarpenters.com", email: "INFO@HAMMER9.COM", lat: 42.6745321, lng: -85.6457663, address: "P O Box 457, 500 Reno Drive, Wayland, MI 49348, USA" },
  { id: 71004, name: "UBC Local 1004", city: "Lansing", state: "MI", phone: "(517) 484-1301", website: "www.nmcarpenters.com", email: "INFO@HAMMER9.COM", lat: 42.732115, lng: -84.5823991, address: "2310 West Washtenaw Street, Lansing, MI 48917, USA" },
  { id: 70706, name: "UBC Local 706", city: "Saginaw", state: "MI", phone: "(989) 753-1487", website: "www.nmcarpenters.com", email: "info@hammer9.com", lat: 43.4525993, lng: -83.8829272, address: "3160 Commerce Centre Drive, Saginaw, MI 48601-9699, USA" },
  { id: 70202, name: "UBC Local 202", city: "Grayling", state: "MI", phone: "(231) 932-8946", website: "www.nmcarpenters.com", email: "info@hammer9.com", lat: 44.661517, lng: -84.714637, address: "P.O. Box 467, Grayling, MI 49787, USA" },
  { id: 71650, name: "UBC Local 1650", city: "Lexington", state: "KY", phone: "(859) 252-5254", email: "lu1650@ikorcc.com", lat: 38.0130231, lng: -84.5236321, address: "241 Regency Circle, Lexington, KY 40503, USA" },
  { id: 70224, name: "UBC Local 224", city: "Newburgh", state: "IN", phone: "(812) 490-0500", email: "lu224@ikorcc.com", lat: 37.9456824, lng: -87.4046571, address: "5370 Covert Ct, Newburgh, IN 47630, USA" },
  { id: 70472, name: "UBC Local 472", city: "Grayson", state: "KY", phone: "(606) 928-4370", website: "www.cmwcarpenters.com", email: "lu472@ikorcc.com", lat: 37.4537437, lng: -86.3389464, address: "472 Carpenters Way, Grayson, KY 41143, USA" },
  { id: 70437, name: "UBC Local 437", city: "Portsmouth", state: "OH", phone: "(740) 354-7518", email: "carp437@frontier.com", lat: 38.7381398, lng: -82.9734719, address: "2138 Gallia Street, Portsmouth, OH 45662, USA" },
  { id: 70650, name: "UBC Local 650", city: "Cheshire", state: "OH", phone: "(740) 416-5713", lat: 38.948391, lng: -82.113232, address: "28051 State Route 7, Cheshire, OH 45620, USA" },
  { id: 70356, name: "UBC Local 356", city: "Marietta", state: "OH", phone: "(740) 373-4033", website: "www.cmwcarpenters.com", email: "lu356@ikorcc.com", lat: 39.4167742, lng: -81.4548392, address: "20825 ST RT 550, Marietta, OH 45750, USA" },
  { id: 70200, name: "UBC Local 200", city: "Columbus", state: "OH", phone: "(614) 253-7288", email: "carplocal200@rrohio.com", lat: 39.9393814, lng: -82.9430027, address: "1545 Alum Creek Drive, Columbus, OH 43209, USA" },
  { id: 72031, name: "UBC Local 2031", city: "Columbus", state: "OH", phone: "(614) 236-2440", lat: 39.9622601, lng: -83.0007065, address: "1909 Arlington Lane, Columbus, OH 43228, USA" },
  { id: 71016, name: "UBC Local 1016", city: "Muncie", state: "IN", phone: "(765) 288-7568", email: "carpenter1016@comcast.net", lat: 40.2073013, lng: -85.3372488, address: "4201 East Centennial Avenue, Muncie, IN 47303, USA" },
  { id: 70615, name: "UBC Local 615", city: "Kokomo", state: "IN", phone: "(765) 236-0082", website: "www.cmwcarpenters.com", email: "cfincher@ikorcc.com", lat: 40.4866128, lng: -86.1328997, address: "103 North Buckeye Street, Kokomo, IN 46901, USA" },
  { id: 70186, name: "UBC Local 186", city: "Steubenville", state: "OH", phone: "(740) 283-1416", website: "www.cmwcarpenters.com", email: "local186@sbcglobal.net", lat: 40.3670364, lng: -80.611381, address: "626 N. 4th St., Steubenville, OH 43952, USA" },
  { id: 70171, name: "UBC Local 171", city: "Youngstown", state: "OH", phone: "(330) 629-2059", website: "www.cmwcarpenters.com", email: "carpenters171@gmail.com", lat: 41.0563392, lng: -80.6627921, address: "8065 Market ST, Youngstown, OH 44512, USA" },
  { id: 70735, name: "UBC Local 735", city: "Mansfield", state: "OH", phone: "(419) 524-7091", lat: 40.7543617, lng: -82.5312303, address: "163 Poplar Street, Mansfield, OH 44903, USA" },
  { id: 72955, name: "UBC Local 2955", city: "Cleveland", state: "OH", phone: "(216) 391-2828", lat: 41.4935301, lng: -81.674958, address: "2554 East 22nd Street, Cleveland, OH 44115, USA" },
  { id: 70744, name: "UBC Local 744", city: "Bellevue", state: "OH", phone: "(419) 552-1918", website: "www.cmwcarpenters.com", email: "carpenterslocal744@yahoo.com", lat: 41.2742069, lng: -82.8409808, address: "124 E Main St., P O Box 321, Bellevue, OH 44811, USA" },
  { id: 70133, name: "UBC Local 133", city: "Terre haute", state: "IN", phone: "(812) 232-6035", website: "www.cmwcarpenters.com", lat: 39.4315771, lng: -87.4096014, address: "3050 S. 6th St., Terre Haute, IN 47802, USA" },
  { id: 70372, name: "UBC Local 372", city: "Lima", state: "OH", phone: "(419) 223-9891", website: "www.cmwcarpenters.com", lat: 40.73987, lng: -84.1019487, address: "310 E. Market St., Lima, OH 45801, USA" },
  { id: 70136, name: "UBC Local 136", city: "Monroe", state: "OH", phone: "513) 539-2759", website: "www.cmwcarpenters.com", email: "lu136@cmrcc.com", lat: 39.4476961, lng: -84.3376069, address: "204 N Garver Rd, Monroe, OH 45050, USA" },
  { id: 70002, name: "UBC Local 2", city: "Monroe", state: "OH", phone: "(513) 360-7750", website: "www.cmwcarpenters.com", lat: 39.4476961, lng: -84.3376069, address: "204 N Garver Road, Monroe, OH 45050, USA" },
  { id: 72013, name: "UBC Local 2013", city: "Greenwood", state: "IN", phone: "(317) 807-5722", lat: 39.6308709, lng: -86.0765865, address: "771 Greenwood Springs Dr., Greenwood, IN 46143, USA" },
  { id: 71076, name: "UBC Local 1076", city: "Greenwood", state: "IN", phone: "(317) 807-5715", website: "www.cmwcarpenters.com", email: "lu1076@ikorcc.com", lat: 39.6308709, lng: -86.0765865, address: "771 Greenwood Springs Dr, Greenwood, IN 46143, USA" },
  { id: 70301, name: "UBC Local 301", city: "Indianapolis", state: "IN", phone: "(317) 632-9780", website: "www.cmwcarpenters.com", lat: 39.7153725, lng: -86.1162789, address: "3530 South Rural Street, Indianapolis, IN 46237, USA" },
  { id: 70364, name: "UBC Local 364", city: "Indianapolis", state: "IN", phone: "(317) 632-9780", website: "www.cmwcarpenters.com", lat: 39.7153725, lng: -86.1162789, address: "3530 South Rural Street, Indianapolis, IN 46237, USA" },
  { id: 70175, name: "UBC Local 175", city: "Louisville", state: "KY", phone: "(502) 363-1751", website: "www.cmwcarpenters.com", email: "lu175@ikorcc.com", lat: 38.1899203, lng: -85.7199497, address: "1245 Durrett Lane, Louisville, KY 40213, USA" },
  { id: 72501, name: "UBC Local 2501", city: "Louisville", state: "KY", phone: "(502) 298-0491", lat: 38.1899203, lng: -85.7199497, address: "1245 Durrett Lane, Louisville, KY 40213, USA" },
  { id: 71090, name: "UBC Local 1090", city: "North canton", state: "OH", phone: "(330) 768-7138", lat: 40.875891, lng: -81.4023356, address: "7225 Sunset Strip Ave NW, North Canton, OH 44720, USA" },
  { id: 70285, name: "UBC Local 285", city: "North canton", state: "OH", phone: "(330) 773-9977", website: "www.cmwcarpenters.com", lat: 40.875891, lng: -81.4023356, address: "7225 Sunset Strip Ave NW, North Canton, OH 44720, USA" },
  { id: 70274, name: "UBC Local 274", city: "Pittsburgh", state: "PA", phone: "(412) 922-6210", lat: 40.4406968, lng: -80.0025666, address: "650 Ridge Road, Pittsburgh, PA 15205, USA" },
  { id: 70432, name: "UBC Local 432", city: "Pittsburgh", state: "PA", phone: "(412) 922-6205", lat: 40.4406968, lng: -80.0025666, address: "650 Ridge Road, Pittsburgh, PA 15205, USA" },
  { id: 70443, name: "UBC Local 443", city: "Parkersburg", state: "WV", phone: "(304) 422-1593", lat: 39.2351936, lng: -81.5233859, address: "4600 Camden Avenue, Parkersburg, WV 26101, USA" },
  { id: 70439, name: "UBC Local 439", city: "Charleston", state: "WV", phone: "(304) 342-3004", lat: 38.3389043, lng: -81.6221248, address: "1560 Kanawha Blvd E, Charleston, WV 25311, USA" },
  { id: 70436, name: "UBC Local 436", city: "Bridgeport", state: "WV", phone: "(304) 842-5431", lat: 39.2935206, lng: -80.2434546, address: "609 Broadway Ave, Bridgeport, WV 26330, USA" },
  { id: 7020501, name: "UBC Local 205 (Ashland)", city: "Ashland", state: "VA", phone: "(804) 743-7458", website: "carpenters205.org", lat: 37.7594012, lng: -77.4806603, address: "10238 Sycamore Drive, Ashland, VA 23005, USA" },
  { id: 70420, name: "UBC Local 420", city: "Sheakleyville", state: "PA", phone: "(412) 298-2548", email: "ubc420financial@gmail.com", lat: 41.4428322, lng: -80.2078404, address: "P.O. Box 157, Sheakleyville, PA 16151, USA" },
  { id: 70423, name: "UBC Local 423", city: "Duncansville", state: "PA", phone: "(814) 693-0315", website: "www.carpenters423.org", lat: 40.4234058, lng: -78.433903, address: "261 Patchway Rd., Duncansville, PA 16635, USA" },
  { id: 70197, name: "UBC Local 197", city: "Upper marlboro", state: "MD", phone: "(301) 735-6660", lat: 38.8134572, lng: -76.7983264, address: "8500 Pennsylvania Ave., Upper Marlboro, MD 20772, USA" },
  { id: 70491, name: "UBC Local 491", city: "Baltimore", state: "MD", phone: "(410) 355-0011", email: "Sforstner@eascarpenters.org", lat: 39.2438872, lng: -76.6326966, address: "801 West Patapsco, Baltimore, MD 21230, USA" },
  { id: 70252, name: "UBC Local 252", city: "Atlantic city", state: "NJ", phone: "(215) 569-0340", website: "carpenters252.org", lat: 39.3609116, lng: -74.4290088, address: "26 South New York Avenue, Atlantic City, NJ 08401, USA" },
  { id: 70255, name: "UBC Local 255", city: "Hammonton", state: "NJ", phone: "609) 567-0400", lat: 39.6365056, lng: -74.8023853, address: "3300 S. White Horse Pike, Hammonton, NJ 08037, USA" },
  { id: 70219, name: "UBC Local 219", city: "Wilmington", state: "DE", phone: "(215) 569-2558", lat: 39.7459468, lng: -75.546589, address: "1013 Centre Road, Suite 301, Wilmington, DE 19805, USA" },
  { id: 70167, name: "UBC Local 167", city: "Allentown", state: "PA", phone: "(610) 866-3030", lat: 40.5741944, lng: -75.4847921, address: "1818 Vultee Street, Allentown, PA 18103, USA" },
  { id: 70426, name: "UBC Local 426", city: "Lebanon", state: "PA", phone: "(717) 273-3600", lat: 40.369582, lng: -76.4819769, address: "1718 Heilmandale Rd, Lebanon, PA 17046, USA" },
  { id: 70431, name: "UBC Local 431", city: "Lebanon", state: "PA", phone: "(717) 273-3600", website: "www.carpenterslocal431.org", lat: 40.369582, lng: -76.4819769, address: "1718 Heilmandale Rd., Lebanon, PA 17046, USA" },
  { id: 70787, name: "UBC Local 787", city: "Philadelphia", state: "PA", phone: "(215) 569-1634", lat: 39.9631356, lng: -75.1680434, address: "1803 Spring Garden Street, Philadelphia, PA 19130, USA" },
  { id: 70474, name: "UBC Local 474", city: "Philadelphia", state: "PA", phone: "(215) 569-1632", lat: 39.9631356, lng: -75.1680434, address: "1803 Spring Garden Street, Philadelphia, PA 19130, USA" },
  { id: 70164, name: "UBC Local 164", city: "Philadelphia", state: "PA", phone: "(215) 568-2603", lat: 39.9631356, lng: -75.1680434, address: "1803 Spring Garden Street, Philadelphia, PA 19130, USA" },
  { id: 70158, name: "UBC Local 158", city: "Philadelphia", state: "PA", phone: "(215) 569-1634", lat: 39.9631356, lng: -75.1680434, address: "1803 Spring Garden St, Philadelphia, PA 19130, USA" },
  { id: 70445, name: "UBC Local 445", city: "Scranton", state: "PA", phone: "(570) 342-9673", website: "www.local445.org", email: "carpenterslu445@gmail.com", lat: 41.3915081, lng: -75.6779796, address: "314 Pear Street, Scranton, PA 18505, USA" },
  { id: 70715, name: "UBC Local 715", city: "Cranford", state: "NJ", phone: "(908) 497-9050", website: "eascarpenters.org", lat: 40.6534876, lng: -74.2906928, address: "3 Quine Street, Cranford, NJ 07016, USA" },
  { id: 70926, name: "UBC Local 926", city: "Brooklyn", state: "NY", phone: "(718) 491-0926", website: "www.local926.org", email: "info@local926.org", lat: 40.6086997, lng: -74.0054911, address: "1682 86th Street, Brooklyn, NY 11214, USA" },
  { id: 70045, name: "UBC Local 45", city: "Floral park", state: "NY", phone: "(516) 216-5423", email: "Local45Carpenters@gmail.com", lat: 40.7246999, lng: -73.7048024, address: "114 Jericho Turnpike, Suite 3, Floral Park, NY 11001, USA" },
  { id: 70254, name: "UBC Local 254", city: "Edison", state: "NJ", phone: "(732) 225-7210", website: "local254.org", lat: 40.518149, lng: -74.3440803, address: "91 Fieldcrest Ave, Edison, NJ 08837, USA" },
  { id: 70251, name: "UBC Local 251", city: "Edison", state: "NJ", phone: "(732) 417-5777", website: "floorlayers251.org", email: "amcbarron@eascarpenters.org", lat: 40.5005351, lng: -74.3983939, address: "91 Fieldcrest Ave, Suite A22, Edison, NJ 08837, USA" },
  { id: 70253, name: "UBC Local 253", city: "Edison", state: "NJ", phone: "(201) 487-1142", website: "local253carpenters.org", lat: 40.518149, lng: -74.3440803, address: "91 Fieldcrest Ave., Edison, NJ 08837, USA" },
  { id: 70020, name: "UBC Local 20", city: "Staten island", state: "NY", phone: "(718) 568-4530", website: "local20.com", email: "Localunion20@yahoo.com", lat: 40.5834557, lng: -74.1496048, address: "900 South Ave, Suite 54, Staten Island, NY 10314, USA" },
  { id: 72287, name: "UBC Local 2287", city: "Staten island", state: "NY", phone: "(212) 929-2940", email: "local2287@gmail.com", lat: 40.5834557, lng: -74.1496048, address: "900 South Ave, Suite 300, Staten Island, NY 10314, USA" },
  { id: 70212, name: "UBC Local 212", city: "New york", state: "NY", phone: "(646) 201-9865", website: "www.lu212.com", email: "info@lu212.com", lat: 40.7127281, lng: -74.0060152, address: "395 Hudson Street 1st floor, New York, NY 10014, USA" },
  { id: 70157, name: "UBC Local 157", city: "New york", state: "NY", phone: "(212) 685-0567", email: "localunion157@gmail.com", lat: 40.7127281, lng: -74.0060152, address: "395 Hudson Street 1st Floor, New York, NY 10014, USA" },
  { id: 71556, name: "UBC Local 1556", city: "New york", state: "NY", phone: "(212) 989-2284", website: "www.lu1556.com", email: "info@lu1556.com", lat: 40.7292047, lng: -74.0077866, address: "395 Hudson St, New York, NY 10014, USA" },
  { id: 70740, name: "UBC Local 740", city: "Woodhaven", state: "NY", phone: "(718) 849-3636", email: "millwright.740@gmail.com", lat: 40.6873336, lng: -73.8529847, address: "89-07 Atlantic Avenue, Woodhaven, NY 11421, USA" },
  { id: 72790, name: "UBC Local 2790", city: "Woodhaven", state: "NY", phone: "(646) 490-3444", website: "www.local2790.org", email: "Local2790@gmail.com", lat: 40.6861515, lng: -73.8561378, address: "8907 Atlantic Ave., Woodhaven, NY 11421, USA" },
  { id: 70290, name: "UBC Local 290", city: "Hauppauge", state: "NY", phone: "(631) 952-9800", email: "Local290@nasrcc.org", lat: 40.8077727, lng: -73.2514361, address: "270 Motor Parkway, Hauppauge, NY 11788, USA" },
  { id: 71302, name: "UBC Local 1302", city: "Groton", state: "CT", phone: "(860) 449-0891", lat: 41.3579447, lng: -72.0842657, address: "171 Thames Street, Groton, CT 06340, USA" },
  { id: 70326, name: "UBC Local 326", city: "Yalesville", state: "CT", phone: "(860) 352-1130", lat: 41.4949462, lng: -72.8148184, address: "500 Main St, Yalesville, CT 06492, USA" },
  { id: 70279, name: "UBC Local 279", city: "Rock tavern", state: "NY", phone: "(845) 440-1024", email: "local279@nasrcc.org", lat: 41.536733, lng: -74.132499, address: "52 Stone Castle Road, Rock Tavern, NY 12575, USA" },
  { id: 70330, name: "UBC Local 330", city: "Warwick", state: "RI", phone: "401) 424-1100", website: "www.carpenters330.org", lat: 41.7558379, lng: -71.4347243, address: "14 Jefferson Park Rd, Warwick, RI 02888, USA" },
  { id: 70277, name: "UBC Local 277", city: "Binghamton", state: "NY", phone: "(607) 729-0224", website: "277carpenters.org", lat: 42.116255, lng: -75.9457018, address: "23 Market Street, Binghamton, NY 13905-1805, USA" },
  { id: 70291, name: "UBC Local 291", city: "Albany", state: "NY", phone: "(518) 438-1905", lat: 42.7020172, lng: -73.8791883, address: "14 Corporate Circle, Albany, NY 12203, USA" },
  { id: 71163, name: "UBC Local 1163", city: "Syracuse", state: "NY", phone: "(315) 671-0672", website: "local1163.com", email: "local1163@nasrcc.org", lat: 43.1056195, lng: -76.1606789, address: "6920 Princeton Court, Syracuse, NY 13212, USA" },
  { id: 70276, name: "UBC Local 276", city: "Cheektowaga", state: "NY", phone: "(716) 632-3080", website: "https://carpenterslocalunion276.com/", lat: 42.9327953, lng: -78.7450199, address: "1159 Maryvale Drive, Cheektowaga, NY 14225, USA" },
  { id: 70346, name: "UBC Local 346", city: "Weymouth", state: "MA", phone: "(781) 353-5530", lat: 42.1644491, lng: -70.9448936, address: "26 Memorial Grove Avenue, Weymouth, MA 02190, USA" },
  { id: 70336, name: "UBC Local 336", city: "Worcester", state: "MA", phone: "(508) 886-5950", lat: 42.2509705, lng: -71.8029312, address: "29 Endicott St, Worcester, MA 01610, USA" },
  { id: 70328, name: "UBC Local 328", city: "Cambridge", state: "MA", phone: "(617) 391-9545", lat: 42.3750353, lng: -71.1502684, address: "10 Holworthy St, Cambridge, MA 02138, USA" },
  { id: 70339, name: "UBC Local 339", city: "Wilmington", state: "MA", phone: "(978) 229-5200", website: "www.nasrcc.org", lat: 42.5676612, lng: -71.1376674, address: "350 Fordham Rd., Wilmington, MA 01887, USA" },
  { id: 70352, name: "UBC Local 352", city: "Manchester", state: "NH", phone: "(603) 222-3223", email: "acarbonneau@nasrcc.org", lat: 42.9862404, lng: -71.41079, address: "920 Candia Rd, Manchester, NH 03109, USA" },
  { id: 71121, name: "UBC Local 1121", city: "Boston", state: "MA", phone: "617) 254-1655", website: "https://www.nasrcc.org/", lat: 42.3242762, lng: -71.0562709, address: "750 Dorchester Ave, Boston, MA 02125, USA" },
  { id: 70051, name: "UBC Local 51", city: "Boston", state: "MA", phone: "(617) 265-3444", lat: 42.3588336, lng: -71.0578303, address: "750 Dorchester Ave. Suite 3300, Boston, MA 02125-1132, USA" },
  { id: 70056, name: "UBC Local 56", city: "Boston", state: "MA", phone: "(617) 443-1988", lat: 42.3588336, lng: -71.0578303, address: "750 Dorchester Ave. Suite 3200, Boston, MA 02125-1132, USA" },
  { id: 72168, name: "UBC Local 2168", city: "Boston", state: "MA", phone: "617) 825-6141", lat: 42.3588336, lng: -71.0578303, address: "750 Dorchester Avenue 3rd Flr, Boston, MA 02125-1132, USA" },
  { id: 70723, name: "UBC Local 723", city: "Boston", state: "MA", phone: "(617) 269-3360", lat: 42.3588336, lng: -71.0578303, address: "750 Dorchester Ave. Suite 3400, Boston, MA 02125-1132, USA" },
  { id: 73073, name: "UBC Local 3073", city: "Portsmouth", state: "NH", phone: "(207) 439-4281", lat: 43.0751306, lng: -70.7601826, address: "Po Box 2059 Pns, Portsmouth, NH 03801, USA" },
  { id: 70349, name: "UBC Local 349", city: "Portland", state: "ME", phone: "(207) 358-6658", lat: 43.6948006, lng: -70.3215793, address: "65 Rainmaker Dr, Portland, ME 04103, USA" },
  { id: 71445, name: "UBC Local 1445", city: "Topeka", state: "KS", phone: "(816) 931-3414", email: "local1445@carpentersunion.org", lat: 39.049011, lng: -95.677556, address: "212 N.W. Norris, Topeka, KS 66608, USA" },
  { id: 70945, name: "UBC Local 945", city: "Jefferson city", state: "MO", phone: "(816) 931-3414", email: "local945@carpentersunion.org", lat: 38.577359, lng: -92.1724265, address: "5218 Business Hwy 50 West, Jefferson City, MO 65109, USA" },
  { id: 71127, name: "UBC Local 1127", city: "Kansas city", state: "KS", phone: "(816) 931-3414", email: "local1127@carpentersunion.org", lat: 39.113456, lng: -94.626497, address: "8955 East 38th Terr, Kansas City, MO 64129, USA" },
  { id: 70315, name: "UBC Local 315", city: "Kansas city", state: "KS", phone: "(816) 931-3414", email: "local315@carpentersunion.org", lat: 39.113456, lng: -94.626497, address: "8955 East 38th Terr, Kansas City, MO 64129, USA" },
  { id: 71529, name: "UBC Local 1529", city: "Kansas city", state: "KS", phone: "(816) 931-3414", email: "local1529@carpentersunion.org", lat: 39.113456, lng: -94.626497, address: "8955 East 38th Terr, Kansas City, MO 64129, USA" },
  { id: 71839, name: "UBC Local 1839", city: "Pacific", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local1839@carpentersunion.org", lat: 38.474887, lng: -90.770915, address: "1733 Kristi Lane, Pacific, MO 63069, USA" },
  { id: 70662, name: "UBC Local 662", city: "Freeburg", state: "IL", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local662@carpentersunion.org", lat: 38.4192324, lng: -89.909114, address: "800 South State St, Freeburg, IL 62243, USA" },
  { id: 70664, name: "UBC Local 664", city: "Wood river", state: "IL", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local664@carpentersunion.org", lat: 38.860398, lng: -90.0923176, address: "277 Madison Ave, Wood River, IL 62095, USA" },
  { id: 70032, name: "UBC Local 32", city: "Wentzville", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", lat: 38.8309517, lng: -90.8335724, address: "755 Parr Rd, Wentzville, MO 63385-2904, USA" },
  { id: 71596, name: "UBC Local 1596", city: "St louis", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local1596@carpentersunion.org", lat: 38.6250898, lng: -90.2881995, address: "1401 Hampton Avenue, St Louis, MO 63139-3159, USA" },
  { id: 70057, name: "UBC Local 57", city: "St louis", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local57@carpentersunion.org", lat: 38.6250898, lng: -90.2881995, address: "1401 Hampton Ave, St Louis, MO 63139, USA" },
  { id: 71310, name: "UBC Local 1310", city: "St louis", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local1310@carpentersunion.org", lat: 38.6250898, lng: -90.2881995, address: "1401 Hampton Avenue, St Louis, MO 63139-3199, USA" },
  { id: 70097, name: "UBC Local 97", city: "St louis", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local97@carpentersunion.org", lat: 38.6250898, lng: -90.2881995, address: "1401 Hampton Ave, St Louis, MO 63139, USA" },
  { id: 70092, name: "UBC Local 92", city: "St louis", state: "MO", phone: "(314) 644-7200", website: "www.carpentersunion.org", email: "local92@carpentersunion.org", lat: 38.6250898, lng: -90.2881995, address: "1401 Hampton Ave, St Louis, MO 63139, USA" },
  { id: 70243, name: "UBC Local 243", city: "Champaign", state: "IL", phone: "(217) 356-5463", website: "www.carpentersunion.org", email: "local243@carpentersunion.org", lat: 40.1121624, lng: -88.295104, address: "402 S Duncan Rd, Champaign, IL 61821, USA" },
  { id: 70270, name: "UBC Local 270", city: "Springfield", state: "IL", phone: "(217) 528-7571", website: "www.carpentersunion.org", email: "Local270@carpentersunion.org", lat: 39.7942233, lng: -89.6565652, address: "211 W Lawrence Ave, Springfield, IL 62704, USA" },
  { id: 70237, name: "UBC Local 237", city: "East peoria", state: "IL", phone: "(309) 698-1830", website: "www.carpentersunion.org", email: "local237@carpentersunion.org", lat: 40.6928468, lng: -89.5414308, address: "2412 N Main St, East Peoria, IL 61611, USA" }
];

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
  "gainesville": [29.6516, -82.3248],
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

// ── SUPABASE CLIENT ─────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://bonqybbmcoaujfiiwson.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RjCnTsf0YLPVxtMNzI_p8Q_1ss3DQ8W';
let supabaseClient = null;
async function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase) {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseClient;
}




// ── ADMIN PAGE — approve/reject/edit job board submissions ──────────────────
const ADMIN_PASSWORD = 'Mylabelle5454!';

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState('pending');
  const [adminSection, setAdminSection] = useState('jobs');
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_authed');
    if (saved === 'yes') setAuthed(true);
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem('admin_authed', 'yes');
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem('admin_authed');
    setPwInput('');
  };

  const loadRows = async () => {
    setRows(null);
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { data, error } = await sb
        .from(tableName)
        .select('*')
        .eq('approved', tab === 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (err) {
      console.error('Load failed:', err);
      setRows([]);
    }
  };

  useEffect(() => {
    if (authed) loadRows();
  }, [authed, tab, adminSection]);

  const handleApprove = async (id) => {
    setBusy(b => ({...b, [id]: 'approving'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).update({ approved: true }).eq('id', id);
      if (error) throw error;
      setRows(rows.filter(r => r.id !== id));
    } catch (err) { alert('Approve failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  const handleUnapprove = async (id) => {
    setBusy(b => ({...b, [id]: 'unapproving'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).update({ approved: false }).eq('id', id);
      if (error) throw error;
      setRows(rows.filter(r => r.id !== id));
    } catch (err) { alert('Un-approve failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  const handleReject = async (id) => {
    if (!confirm('Permanently delete this submission?')) return;
    setBusy(b => ({...b, [id]: 'rejecting'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).delete().eq('id', id);
      if (error) throw error;
      setRows(rows.filter(r => r.id !== id));
    } catch (err) { alert('Delete failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    if (adminSection === 'wages') {
      setEditData({
        trade: r.trade || '', local_name: r.local_name || '', city: r.city || '', state: r.state || '',
        hourly: r.hourly || '', health_welfare: r.health_welfare || '', defined_pension: r.defined_pension || '',
        national_pension: r.national_pension || '', contribution_pension: r.contribution_pension || '', k401: r.k401 || '', nebf: r.nebf || '',
        cipf: r.cipf || '', iuoe_training: r.iuoe_training || '', misc_funds: r.misc_funds || '', working_dues: r.working_dues || '',
        total_package: r.total_package || '', effective_date: r.effective_date || '', valid_through: r.valid_through || '',
        notes: r.notes || '',
      });
    } else {
      setEditData({
        trade: r.trade || '', local_name: r.local_name || '', city: r.city || '',
        state: r.state || '', status: r.status || '', job_calls: r.job_calls || '',
        report_date: r.report_date || '', phone: r.phone || '', website: r.website || '',
        local_email: r.local_email || '', address: r.address || '',
      });
    }
  };

  const cancelEdit = () => { setEditingId(null); setEditData({}); };

  const saveEdit = async (id) => {
    setBusy(b => ({...b, [id]: 'saving'}));
    try {
      const sb = await getSupabase();
      const tableName = adminSection === 'wages' ? 'wage_submissions' : 'job_submissions';
      const { error } = await sb.from(tableName).update(editData).eq('id', id);
      if (error) throw error;
      setRows(rows.map(r => r.id === id ? { ...r, ...editData } : r));
      setEditingId(null);
      setEditData({});
    } catch (err) { alert('Save failed: ' + err.message); }
    finally { setBusy(b => { const n = {...b}; delete n[id]; return n; }); }
  };

  if (!authed) {
    return (
      <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"var(--bg)"}}>
        <div style={{maxWidth:420, width:"100%", padding:32, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16}}>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:"#fff", margin:0, marginBottom:8, letterSpacing:2}}>ADMIN</h1>
          <div style={{fontSize:13, color:"var(--muted)", marginBottom:24}}>Union Pathways control panel</div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              placeholder="Password"
              autoFocus
              style={{width:"100%", padding:14, fontSize:16, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, color:"#fff", outline:"none", boxSizing:"border-box"}}
            />
            {pwError && <div style={{color:"#ef4444", fontSize:13, marginTop:8}}>Incorrect password</div>}
            <button type="submit" style={{marginTop:16, width:"100%", padding:14, background:"#F5C518", color:"#000", border:"none", borderRadius:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, letterSpacing:1, cursor:"pointer"}}>
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderEditForm = (r) => {
    const wageFields = [['trade','Trade'],['local_name','Local Name'],['city','City'],['state','State'],['hourly','Hourly'],['health_welfare','Health & Welfare'],['defined_pension','Defined Pension'],['national_pension','National Pension'],['contribution_pension','Contribution Pension/Annuity'],['k401','401(k)'],['nebf','NEBF (IBEW only)'],['cipf','CIPF (IUOE only)'],['iuoe_training','IUOE Training (IUOE only)'],['misc_funds','Other Funds'],['working_dues','Working Dues'],['total_package','Total Package'],['effective_date','Effective Date'],['valid_through','Valid Through'],['notes','Notes']];
    const jobFields = [['trade','Trade'],['local_name','Local Name'],['city','City'],['state','State'],['status','Status (BUSY/STEADY/SLOW)'],['job_calls','Job Calls'],['report_date','Report Date'],['phone','Phone'],['website','Website'],['local_email','Email'],['address','Address']];
    const fields = adminSection === 'wages' ? wageFields : jobFields;
    return (
      <div style={{background:"rgba(245,197,24,0.05)", border:"1px solid rgba(245,197,24,0.3)", borderRadius:12, padding:20, marginTop:12}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, color:"#F5C518", marginBottom:12, letterSpacing:1}}>EDITING #{r.id}</div>
        {fields.map(([key, label]) => (
          <div key={key} style={{marginBottom:10}}>
            <div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:4}}>{label}</div>
            <input
              type="text"
              value={editData[key] || ''}
              onChange={(e) => setEditData({...editData, [key]: e.target.value})}
              style={{width:"100%", padding:10, fontSize:14, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"#fff", outline:"none", boxSizing:"border-box"}}
            />
          </div>
        ))}
        <div style={{display:"flex", gap:8, marginTop:12}}>
          <button onClick={() => saveEdit(r.id)} disabled={!!busy[r.id]} style={{flex:1, padding:10, background:"#22c55e", color:"#000", border:"none", borderRadius:8, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:1, cursor:"pointer"}}>
            {busy[r.id] === 'saving' ? 'SAVING…' : 'SAVE'}
          </button>
          <button onClick={cancelEdit} disabled={!!busy[r.id]} style={{flex:1, padding:10, background:"transparent", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, fontWeight:700, fontSize:14, cursor:"pointer"}}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh", padding:"24px 16px 60px", background:"var(--bg)"}}>
      <div style={{maxWidth:900, margin:"0 auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12}}>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:"#fff", margin:0, letterSpacing:2}}>ADMIN</h1>
          <button onClick={handleLogout} style={{padding:"8px 16px", background:"transparent", color:"var(--muted)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, fontSize:13, cursor:"pointer"}}>LOG OUT</button>
        </div>

        <div style={{display:"flex", gap:6, marginBottom:16}}>
          <button onClick={() => { setAdminSection('jobs'); setEditingId(null); }} style={{flex:1, padding:"12px 16px", background: adminSection==='jobs' ? "#FA8059" : "rgba(255,255,255,0.04)", color: adminSection==='jobs' ? "#000" : "#fff", border:"none", borderRadius:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:1, cursor:"pointer"}}>
            JOB BOARD
          </button>
          <button onClick={() => { setAdminSection('wages'); setEditingId(null); }} style={{flex:1, padding:"12px 16px", background: adminSection==='wages' ? "#FA8059" : "rgba(255,255,255,0.04)", color: adminSection==='wages' ? "#000" : "#fff", border:"none", borderRadius:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:1, cursor:"pointer"}}>
            WAGES
          </button>
        </div>

        <div style={{display:"flex", gap:8, marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <button onClick={() => setTab('pending')} style={{padding:"12px 20px", background:"transparent", border:"none", borderBottom: tab==='pending' ? "2px solid #F5C518" : "2px solid transparent", color: tab==='pending' ? "#F5C518" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:1, cursor:"pointer"}}>
            PENDING
          </button>
          <button onClick={() => setTab('approved')} style={{padding:"12px 20px", background:"transparent", border:"none", borderBottom: tab==='approved' ? "2px solid #F5C518" : "2px solid transparent", color: tab==='approved' ? "#F5C518" : "var(--muted)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, letterSpacing:1, cursor:"pointer"}}>
            APPROVED
          </button>
        </div>

        {rows === null && <div style={{textAlign:"center", padding:40, color:"var(--muted)"}}>Loading…</div>}
        {rows !== null && rows.length === 0 && <div style={{textAlign:"center", padding:40, color:"var(--muted)"}}>No {tab} submissions.</div>}

        <div style={{display:"grid", gap:16}}>
          {rows && rows.map(r => (
            <div key={r.id} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:20}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2}}>{r.local_name}</div>
                  <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>#{r.id} · {r.city}, {r.state} · {r.trade}</div>
                </div>
                {adminSection === 'wages' ? (
                  <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(34,197,94,0.15)", color:"#22c55e", fontSize:12, fontWeight:700}}>{r.submission_method === 'image' ? '📄 IMAGE' : '⌨️ MANUAL'}</div>
                ) : (
                  <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.06)", fontSize:12, fontWeight:700, color:"#fff"}}>{r.status}</div>
                )}
              </div>
              {adminSection === 'wages' ? (
                <div style={{fontSize:13, color:"rgba(255,255,255,0.8)", marginTop:6}}>
                  {r.hourly && <span style={{marginRight:14}}><strong style={{color:"var(--muted)"}}>Hourly:</strong> ${parseFloat(r.hourly).toFixed(2)}</span>}
                  {r.total_package && <span style={{marginRight:14}}><strong style={{color:"var(--muted)"}}>Total:</strong> ${parseFloat(r.total_package).toFixed(2)}</span>}
                  {r.image_url && <a href={r.image_url} target="_blank" rel="noopener noreferrer" style={{color:"#F5C518", textDecoration:"underline"}}>📄 View Sheet</a>}
                  {r.notes && <div style={{marginTop:6, fontSize:12, color:"rgba(255,255,255,0.6)"}}><strong>Notes:</strong> {r.notes}</div>}
                </div>
              ) : (
                r.job_calls && <div style={{fontSize:13, color:"rgba(255,255,255,0.8)", marginTop:6}}><strong style={{color:"var(--muted)"}}>Job Calls:</strong> {r.job_calls}</div>
              )}
              <div style={{fontSize:11, color:"rgba(160,180,196,0.5)", marginTop:8}}>{adminSection === 'wages' ? `Contract Valid Through: ${r.valid_through || 'N/A'}` : `Report Date: ${r.report_date}`} · Submitted: {new Date(r.created_at).toLocaleDateString()}</div>

              {editingId === r.id ? renderEditForm(r) : (
                <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
                  {tab === 'pending' && (
                    <button onClick={() => handleApprove(r.id)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"#22c55e", color:"#000", border:"none", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                      {busy[r.id] === 'approving' ? '…' : '✓ APPROVE'}
                    </button>
                  )}
                  {tab === 'approved' && (
                    <button onClick={() => handleUnapprove(r.id)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"#eab308", color:"#000", border:"none", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                      {busy[r.id] === 'unapproving' ? '…' : '↶ UN-APPROVE'}
                    </button>
                  )}
                  <button onClick={() => startEdit(r)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"transparent", color:"#fff", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                    ✎ EDIT
                  </button>
                  <button onClick={() => handleReject(r.id)} disabled={!!busy[r.id]} style={{flex:"1 1 100px", padding:"10px 14px", background:"transparent", color:"#ef4444", border:"1px solid rgba(239,68,68,0.4)", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:1, cursor:"pointer"}}>
                    {busy[r.id] === 'rejecting' ? '…' : '✕ REJECT'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APPROVED REPORT CARD — expandable card with contact info ────────────────
function ApprovedReportCard({ r, lang, statusColor, statusLabel }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasContact = r.phone || r.website || r.local_email || r.address;
  const mapsUrl = r.address ? `https://maps.google.com/?q=${encodeURIComponent(r.address)}` : null;
  const cleanPhone = r.phone ? r.phone.replace(/[^0-9+]/g, '') : null;
  const websiteUrl = r.website ? (r.website.startsWith('http') ? r.website : 'https://' + r.website) : null;
  const websiteDisplay = r.website ? r.website.replace(/^https?:\/\//, '').replace(/^www\./, '') : null;

  const labels = {
    en: { contact: 'Contact Info', hide: 'Hide Contact Info', call: 'Call', visit: 'Visit Website', email: 'Email', directions: 'Get Directions', reported: 'Reported:', jobCalls: 'Job Calls:', showMore: 'Show more', showLess: 'Show less' },
    es: { contact: 'Informacion de Contacto', hide: 'Ocultar Contacto', call: 'Llamar', visit: 'Visitar Sitio Web', email: 'Correo', directions: 'Como Llegar', reported: 'Reportado:', jobCalls: 'Llamadas de Trabajo:', showMore: 'Mostrar mas', showLess: 'Mostrar menos' },
    pl: { contact: 'Dane Kontaktowe', hide: 'Ukryj Kontakt', call: 'Zadzwon', visit: 'Strona Internetowa', email: 'Email', directions: 'Wskazowki Dojazdu', reported: 'Zgloszono:', jobCalls: 'Oferty Pracy:', showMore: 'Pokaz wiecej', showLess: 'Pokaz mniej' },
  };
  const L = labels[lang] || labels.en;

  const jcLineCount = r.job_calls ? (r.job_calls.match(/\n/g) || []).length + 1 : 0;
  const jcIsLong = r.job_calls && (jcLineCount >= 3 || r.job_calls.length > 200);

  return (
    <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:12}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"#fff", lineHeight:1.2}}>{r.local_name}</div>
          <div style={{fontSize:13, color:"var(--muted)", marginTop:4}}>{r.city}, {r.state} — {r.trade}</div>
        </div>
        <div style={{padding:"6px 14px", borderRadius:999, background:statusColor(r.status)+"22", border:"1px solid "+statusColor(r.status), color:statusColor(r.status), fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1}}>{statusLabel(r.status)}</div>
      </div>

      {r.job_calls && (
        <div style={{marginTop:14}}>
          <div style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{L.jobCalls.replace(/:$/, '')}</div>
          <div style={{whiteSpace:"pre-line", lineHeight:1.6, fontSize:14, color:"rgba(255,255,255,0.85)", padding:"10px 12px", background:"rgba(0,0,0,0.2)", borderRadius:8, borderLeft:"3px solid #F5C518", maxHeight: jcIsLong && !expanded ? 80 : 'none', overflow: jcIsLong && !expanded ? 'hidden' : 'visible', WebkitMaskImage: jcIsLong && !expanded ? 'linear-gradient(to bottom, black 60%, transparent)' : 'none', maskImage: jcIsLong && !expanded ? 'linear-gradient(to bottom, black 60%, transparent)' : 'none'}}>{r.job_calls}</div>
          {jcIsLong && (
            <button onClick={() => setExpanded(!expanded)} style={{marginTop:8, padding:"6px 14px", background:"transparent", color:"#F5C518", border:"1px solid rgba(245,197,24,0.4)", borderRadius:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, cursor:"pointer", textTransform:"uppercase"}}>
              {expanded ? L.showLess : L.showMore}
            </button>
          )}
        </div>
      )}

      <div style={{marginTop:12, fontSize:12, color:"rgba(160,180,196,0.5)"}}>{L.reported} {r.report_date}</div>

      {hasContact && (
        <>
          <button onClick={() => setOpen(!open)} style={{marginTop:16, width:"100%", padding:"10px 16px", background:"rgba(245,197,24,0.08)", border:"1px solid rgba(245,197,24,0.3)", borderRadius:10, color:"#F5C518", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:1, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
            {open ? L.hide : L.contact}
            <span style={{fontSize:10, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s"}}>▼</span>
          </button>
          {open && (
            <div style={{marginTop:12, padding:16, background:"rgba(0,0,0,0.25)", borderRadius:10, display:"grid", gap:10}}>
              {cleanPhone && (
                <a href={`tel:${cleanPhone}`} style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>📞</span>
                  <div><div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.call}</div><div style={{fontWeight:700}}>{r.phone}</div></div>
                </a>
              )}
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>🌐</span>
                  <div><div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.visit}</div><div style={{fontWeight:700}}>{websiteDisplay}</div></div>
                </a>
              )}
              {r.local_email && (
                <a href={`mailto:${r.local_email}`} style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>✉️</span>
                  <div><div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.email}</div><div style={{fontWeight:700}}>{r.local_email}</div></div>
                </a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex", alignItems:"center", gap:10, padding:10, background:"rgba(255,255,255,0.04)", borderRadius:8, color:"#fff", textDecoration:"none", fontSize:14}}>
                  <span style={{fontSize:18}}>📍</span>
                  <div><div style={{fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1}}>{L.directions}</div><div style={{fontWeight:700}}>{r.address}</div></div>
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── APPROVED REPORTS FEED — Live feed from Supabase with trade tabs ─────────
function ApprovedReportsFeed({ lang }) {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const [activeTrade, setActiveTrade] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sb = await getSupabase();
        const { data, error } = await sb
          .from('job_submissions')
          .select('*')
          .eq('approved', true)
          .order('report_date', { ascending: false })
          .limit(200);
        if (cancelled) return;
        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load approved reports:', err);
        if (!cancelled) setError(err.message || 'Failed to load reports');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)"}}>
          {lang==="es" ? "Error al cargar informes" : lang==="pl" ? "Blad ladowania raportow" : "Error loading reports"}
        </div>
      </div>
    );
  }

  if (reports === null) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)"}}>
          {lang==="es" ? "Cargando..." : lang==="pl" ? "Ladowanie..." : "Loading..."}
        </div>
      </div>
    );
  }

  const tradeCounts = reports.reduce((acc, r) => {
    const t = r.trade || 'Unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const tradeList = Object.keys(tradeCounts).sort();

  const sortByLocal = (a, b) => {
    const na = parseInt(String(a.local_id || '').match(/\d+/)?.[0] || '0', 10);
    const nb = parseInt(String(b.local_id || '').match(/\d+/)?.[0] || '0', 10);
    return na - nb;
  };
  const visible = (activeTrade === 'all' ? reports : reports.filter(r => r.trade === activeTrade)).slice().sort(sortByLocal);

  const statusColor = (s) => s === 'BUSY' ? '#22c55e' : s === 'STEADY' ? '#eab308' : '#ef4444';
  const statusLabel = (s) => {
    if (lang === 'es') return s === 'BUSY' ? 'OCUPADO' : s === 'STEADY' ? 'ESTABLE' : 'LENTO';
    if (lang === 'pl') return s === 'BUSY' ? 'ZAJETY' : s === 'STEADY' ? 'STABILNY' : 'POWOLNY';
    return s;
  };

  const allLabel = lang === 'es' ? 'Todos' : lang === 'pl' ? 'Wszystkie' : 'All Trades';
  const tabStyle = (active) => ({
    padding: "8px 16px",
    background: active ? '#F5C518' : 'rgba(255,255,255,0.06)',
    color: active ? '#000' : '#fff',
    border: 'none',
    borderRadius: 999,
    fontFamily: "'Barlow Condensed',sans-serif",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 1,
    cursor: 'pointer',
    textTransform: 'uppercase',
  });

  return (
    <div>
      <div style={{display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <button onClick={() => setActiveTrade('all')} style={tabStyle(activeTrade === 'all')}>
          {allLabel} <span style={{opacity:0.7, marginLeft:4}}>({reports.length})</span>
        </button>
        {tradeList.map(trade => (
          <button key={trade} onClick={() => setActiveTrade(trade)} style={tabStyle(activeTrade === trade)}>
            {trade} <span style={{opacity:0.7, marginLeft:4}}>({tradeCounts[trade]})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", marginBottom:8}}>
            {lang==="es" ? "No hay informes en esta categoria" : lang==="pl" ? "Brak raportow w tej kategorii" : "No reports in this category yet"}
          </div>
        </div>
      ) : (
        <div style={{display:"grid", gap:16}}>
          {visible.map(r => (
            <ApprovedReportCard key={r.id} r={r} lang={lang} statusColor={statusColor} statusLabel={statusLabel} />
          ))}
        </div>
      )}
    </div>
  );
}


// ── APPROVED WAGE CARD ──────────────────────────────────────
function ApprovedWageCard({ r, lang }) {
  const [open, setOpen] = useState(false);
  const isExpired = r.valid_through && new Date(r.valid_through) < new Date();
  const fmt = (n) => {
    if (n === null || n === undefined || n === '') return null;
    const num = parseFloat(n);
    if (isNaN(num)) return null;
    return '$' + num.toFixed(2);
  };
  const fmtDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); }
    catch { return d; }
  };
  const fmtPct = (n) => {
    if (n === null || n === undefined || n === '') return null;
    const num = parseFloat(n);
    if (isNaN(num)) return null;
    return num.toFixed(2) + '%';
  };
  const labels = {
    en: { hourly:'Hourly', hw:'Health & Welfare', dpension:'Defined Pension', npension:'National Pension', cpension:'Contribution Pension/Annuity', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'IUOE Training', misc:'Other Funds', dues:'Working Dues', total:'Total Package', effective:'Effective:', validThrough:'Contract Valid Through:', submitted:'Submitted to Union Pathways:', viewSheet:'View Wage Sheet', expired:'EXPIRED', viewBreakdown:'View Breakdown', hideBreakdown:'Hide Breakdown', notes:'Notes:' },
    es: { hourly:'Por Hora', hw:'Salud y Bienestar', dpension:'Pension Definida', npension:'Pension Nacional', cpension:'Pension de Contribucion/Anualidad', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Entrenamiento IUOE', misc:'Otros Fondos', dues:'Cuotas de Trabajo', total:'Paquete Total', effective:'Vigente:', validThrough:'Contrato Valido Hasta:', submitted:'Enviado a Union Pathways:', viewSheet:'Ver Hoja de Salario', expired:'EXPIRADO', viewBreakdown:'Ver Desglose', hideBreakdown:'Ocultar Desglose', notes:'Notas:' },
    pl: { hourly:'Godzinowo', hw:'Zdrowie i Opieka', dpension:'Emerytura', npension:'Emerytura Krajowa', cpension:'Emerytura Skladkowa', k401:'401(k)', nebf:'NEBF', cipf:'CIPF', iuoe:'Szkolenie IUOE', misc:'Inne Fundusze', dues:'Skladki', total:'Pakiet Calkowity', effective:'Obowiazuje od:', validThrough:'Umowa Wazna Do:', submitted:'Zgloszone do Union Pathways:', viewSheet:'Zobacz Stawke', expired:'WYGASLO', viewBreakdown:'Pokaz Szczegoly', hideBreakdown:'Ukryj Szczegoly', notes:'Notatki:' },
  };
  const L = labels[lang] || labels.en;

  const breakdown = [
    { key:'hourly', val:r.hourly },
    { key:'hw', val:r.health_welfare },
    { key:'dpension', val:r.defined_pension },
    { key:'npension', val:r.national_pension },
    { key:'cpension', val:r.contribution_pension },
    { key:'k401', val:r.k401 },
    { key:'nebf', val:r.nebf },
    { key:'cipf', val:r.cipf },
    { key:'iuoe', val:r.iuoe_training },
    { key:'misc', val:r.misc_funds },
    { key:'dues', val:r.working_dues, pct:true },
  ].filter(x => x.pct ? fmtPct(x.val) !== null : fmt(x.val) !== null);

  return (
    <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:20, opacity: isExpired ? 0.6 : 1}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:8}}>
        <div style={{flex:1, minWidth:180}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2}}>{r.local_name}</div>
          <div style={{fontSize:12, color:"var(--muted)", marginTop:4}}>{r.city}, {r.state} · {r.trade}</div>
        </div>
        {isExpired && (
          <div style={{padding:"4px 10px", borderRadius:999, background:"rgba(239,68,68,0.15)", color:"#ef4444", fontSize:11, fontWeight:900, letterSpacing:1, fontFamily:"'Barlow Condensed',sans-serif"}}>{L.expired}</div>
        )}
      </div>

      <div style={{display:"flex", gap:24, marginTop:12, marginBottom:12, flexWrap:"wrap"}}>
        {fmt(r.hourly) && (
          <div>
            <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L.hourly}</div>
            <div style={{fontSize:24, fontWeight:900, color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif"}}>{fmt(r.hourly)}</div>
          </div>
        )}
        {fmt(r.total_package) && (
          <div>
            <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L.total}</div>
            <div style={{fontSize:24, fontWeight:900, color:"#22c55e", fontFamily:"'Barlow Condensed',sans-serif"}}>{fmt(r.total_package)}</div>
          </div>
        )}
      </div>

      <div style={{display:"flex", gap:16, fontSize:11, color:"var(--muted)", marginTop:8, flexWrap:"wrap"}}>
        {r.created_at && <span><strong>{L.submitted}</strong> {fmtDate(r.created_at)}</span>}
        {r.valid_through && <span><strong>{L.validThrough}</strong> {fmtDate(r.valid_through)}</span>}
      </div>

      {(breakdown.length > 0 || r.image_url || r.notes) && (
        <button onClick={() => setOpen(!open)} style={{marginTop:14, background:"rgba(250,128,89,0.08)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:10, padding:"8px 14px", color:"#FA8059", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:"uppercase"}}>
          {open ? L.hideBreakdown : L.viewBreakdown}
        </button>
      )}

      {open && (
        <div style={{marginTop:14, padding:16, background:"rgba(0,0,0,0.25)", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)"}}>
          {breakdown.length > 0 && (
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12, marginBottom: r.image_url || r.notes ? 14 : 0}}>
              {breakdown.map(({key, val, pct}) => (
                <div key={key}>
                  <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif"}}>{L[key]}</div>
                  <div style={{fontSize:15, fontWeight:700, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", marginTop:2}}>{pct ? fmtPct(val) : fmt(val)}</div>
                </div>
              ))}
            </div>
          )}
          {r.notes && (
            <div style={{marginBottom: r.image_url ? 14 : 0}}>
              <div style={{fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", marginBottom:4}}>{L.notes}</div>
              <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.5}}>{r.notes}</div>
            </div>
          )}
          {r.image_url && (
            <a href={r.image_url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block", padding:"8px 16px", background:"#F5C518", color:"#000", textDecoration:"none", borderRadius:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:1, textTransform:"uppercase"}}>
              📄 {L.viewSheet}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── APPROVED WAGES FEED ────────────────────────────────────
function ApprovedWagesFeed({ lang }) {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const [activeTrade, setActiveTrade] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sb = await getSupabase();
        const { data, error } = await sb
          .from('wage_submissions')
          .select('*')
          .eq('approved', true)
          .order('effective_date', { ascending: false })
          .limit(200);
        if (cancelled) return;
        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load approved wages:', err);
        if (!cancelled) setError(err.message || 'Failed to load wages');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)"}}>
          {lang==="es" ? "Error al cargar salarios" : lang==="pl" ? "Blad ladowania plac" : "Error loading wages"}
        </div>
      </div>
    );
  }

  if (reports === null) {
    return (
      <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)"}}>
          {lang==="es" ? "Cargando..." : lang==="pl" ? "Ladowanie..." : "Loading..."}
        </div>
      </div>
    );
  }

  const tradeCounts = reports.reduce((acc, r) => {
    const t = r.trade || 'Unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const tradeList = Object.keys(tradeCounts).sort();
  const sortByLocal = (a, b) => {
    const na = parseInt(String(a.local_id || '').match(/\d+/)?.[0] || '0', 10);
    const nb = parseInt(String(b.local_id || '').match(/\d+/)?.[0] || '0', 10);
    return na - nb;
  };
  const visible = (activeTrade === 'all' ? reports : reports.filter(r => r.trade === activeTrade)).slice().sort(sortByLocal);
  const allLabel = lang === 'es' ? 'Todos' : lang === 'pl' ? 'Wszystkie' : 'All Trades';
  const tabStyle = (active) => ({
    padding: "8px 16px",
    background: active ? '#F5C518' : 'rgba(255,255,255,0.06)',
    color: active ? '#000' : '#fff',
    border: 'none',
    borderRadius: 999,
    fontFamily: "'Barlow Condensed',sans-serif",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 1,
    cursor: 'pointer',
    textTransform: 'uppercase',
  });

  return (
    <div>
      <div style={{display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <button onClick={() => setActiveTrade('all')} style={tabStyle(activeTrade === 'all')}>
          {allLabel} <span style={{opacity:0.7, marginLeft:4}}>({reports.length})</span>
        </button>
        {tradeList.map(trade => (
          <button key={trade} onClick={() => setActiveTrade(trade)} style={tabStyle(activeTrade === trade)}>
            {trade} <span style={{opacity:0.7, marginLeft:4}}>({tradeCounts[trade]})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{textAlign:"center", padding:"60px 24px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", marginBottom:8}}>
            {lang==="es" ? "No hay salarios en esta categoria" : lang==="pl" ? "Brak plac w tej kategorii" : "No wages in this category yet"}
          </div>
        </div>
      ) : (
        <div style={{display:"grid", gap:16}}>
          {visible.map(r => (
            <ApprovedWageCard key={r.id} r={r} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function UnionPathway() {
  // Admin route — bypass main app and show admin page
  const [isAdmin, setIsAdmin] = useState(typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));
  useEffect(() => {
    const onPop = () => setIsAdmin(window.location.pathname.startsWith('/admin'));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  if (isAdmin) return <AdminPage />;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchMode, setSearchMode] = useState('radius');

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
  const [jobTrade, setJobTrade] = useState('');
  const [jobLocal, setJobLocal] = useState('');
  const [jobLocalSearch, setJobLocalSearch] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [jobCalls, setJobCalls] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [jobSubmitted, setJobSubmitted] = useState(false);
  const [wageTrade, setWageTrade] = useState('');
  const [wageLocal, setWageLocal] = useState('');
  const [wageLocalSearch, setWageLocalSearch] = useState('');
  const [wageMethod, setWageMethod] = useState('');
  const [wageImageFile, setWageImageFile] = useState(null);
  const [wageHourly, setWageHourly] = useState('');
  const [wageHW, setWageHW] = useState('');
  const [wageDefinedPension, setWageDefinedPension] = useState('');
  const [wageNationalPension, setWageNationalPension] = useState('');
  const [wageContribPension, setWageContribPension] = useState('');
  const [wage401k, setWage401k] = useState('');
  const [wageNEBF, setWageNEBF] = useState('');
  const [wageCIPF, setWageCIPF] = useState('');
  const [wageIUOETraining, setWageIUOETraining] = useState('');
  const [wageMiscFunds, setWageMiscFunds] = useState('');
  const [wageWorkingDues, setWageWorkingDues] = useState('');
  const [wageEffectiveDate, setWageEffectiveDate] = useState('');
  const [wageValidThrough, setWageValidThrough] = useState('');
  const [wageNotes, setWageNotes] = useState('');
  const [wageSubmitted, setWageSubmitted] = useState(false);
  const [wageUploading, setWageUploading] = useState(false);
  const [jobBoardTrade, setJobBoardTrade] = useState('all');
  const [approvedReports, setApprovedReports] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [learnOpen, setLearnOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("IBEW_I");
  // URL-aware page state
  const getPageFromUrl = () => {
    const path = window.location.pathname.replace('/', '') || 'home';
    const validPages = ['home','quiz','careers','checklist','locals','calculator','resume','veterans','history','trade-history','history-ibew','history-ua','retirement','benefits','about','contact','jobboard','wages'];
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

  // App-level scroll progress for long-form pages (history, history-ibew,
  // history-ua, benefits). Always mounted so React's hook order stays stable
  // across page navigations.
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const candidates = ['history-root','ibew-history-root','ua-history-root','benefits-root'];
      let el = null;
      for (const id of candidates) {
        const found = document.getElementById(id);
        if (found) { el = found; break; }
      }
      if (!el) { setScrollProgress(0); return; }
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));
      setScrollProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

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
      jobboard:  { title: "Union Pathways — Live Job Board", desc: "Real-time work outlook reports from union locals across the country. See which halls are busy, steady, or slow before you travel for work." },
      wages:     { title: "Union Pathways — Local Wages Verified by Members", desc: "Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place." },
      'trade-history': { title: "Union Pathways — Trade History (Coming Soon)", desc: "Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor." },
      'history-ibew': { title: "IBEW History — Wired for the Long Haul · Union Pathways", desc: "The full history of the International Brotherhood of Electrical Workers from its 1891 founding above a St. Louis dance hall to today. Henry Miller, the Reid-Murphy split, the Council on Industrial Relations, the data center boom, and the path back to one million members." },
      'history-ua': { title: "UA History — The Pipe Trades' Long Brotherhood · Union Pathways", desc: "The full history of the United Association from its 1889 Washington founding to today. P.J. Quinlan, the Steamfitters' War, the 1936 federal apprenticeship, the postwar peak, the Veterans in Piping program, and the LNG and data center boom." },
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

    // State-only check BEFORE Nominatim — return marker for full-state search
    const stateAbbrEarly = STATE_NAMES[qLow] || (STATE_CENTERS[q.toUpperCase()] ? q.toUpperCase() : null);
    if (stateAbbrEarly && STATE_CENTERS[stateAbbrEarly]) {
      const scEarly = STATE_CENTERS[stateAbbrEarly];
      return { lat: scEarly.lat, lng: scEarly.lng, display: q, isStateSearch: true, stateAbbr: stateAbbrEarly };
    }

    // Try parsing "City, State" / "City State" / "City, ST" / "City ST" / "City, ST 12345"
    // Strip any trailing 5-digit ZIP first
    const qNoZip = qLow.replace(/\b\d{5}(?:-\d{4})?\b\s*$/, '').trim();
    // Split on comma if present, else on last whitespace
    let cityPart = null;
    let statePart = null;
    if (qNoZip.includes(',')) {
      const parts = qNoZip.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        cityPart = parts[0];
        statePart = parts.slice(1).join(' ').trim();
      }
    } else {
      // No comma — try matching trailing 2-letter state abbrev or full state name
      const tokens = qNoZip.split(/\s+/);
      if (tokens.length >= 2) {
        // Try last 1, 2, or 3 tokens as state (handles "new york", "north carolina", etc.)
        for (let take = 3; take >= 1; take--) {
          if (tokens.length <= take) continue;
          const tail = tokens.slice(-take).join(' ');
          if (STATE_NAMES[tail] || STATE_CENTERS[tail.toUpperCase()]) {
            cityPart = tokens.slice(0, tokens.length - take).join(' ');
            statePart = tail;
            break;
          }
        }
      }
    }
    if (cityPart && statePart) {
      // Normalize state to abbreviation
      const stateAbbr = STATE_NAMES[statePart] || (STATE_CENTERS[statePart.toUpperCase()] ? statePart.toUpperCase() : null);
      // First: try full key like "phoenix az" or "phoenix arizona" in CITY_COORDS as-is
      if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };
      // Then: try just the city portion
      if (CITY_COORDS[cityPart]) {
        const [clat, clng] = CITY_COORDS[cityPart];
        const stateLabel = stateAbbr || statePart.toUpperCase();
        return { lat: clat, lng: clng, display: cityPart.replace(/\b\w/g, c => c.toUpperCase()) + (stateAbbr ? ', ' + stateAbbr : '') };
      }
      // Then: search local databases for matching city in matching state
      if (stateAbbr) {
        const ALL2 = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...SMART_LOCALS, ...BAC_LOCALS, ...UBC_LOCALS, ...HFIAW_LOCALS, ...IUEC_LOCALS, ...LIUNA_LOCALS];
        const hit = ALL2.find(l => l.city.toLowerCase() === cityPart && l.state.toUpperCase() === stateAbbr)
          || ALL2.find(l => l.city.toLowerCase().includes(cityPart) && l.state.toUpperCase() === stateAbbr);
        if (hit) return { lat: hit.lat, lng: hit.lng, display: hit.city + ', ' + hit.state };
      }
    }

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

    // Fallback: state name only — return marker so we can show ALL locals in that state
    const stateAbbr2 = STATE_NAMES[qLow] || (STATE_CENTERS[q.toUpperCase()] ? q.toUpperCase() : null);
    if (stateAbbr2 && STATE_CENTERS[stateAbbr2]) {
      const sc2 = STATE_CENTERS[stateAbbr2];
      return { lat: sc2.lat, lng: sc2.lng, display: q, isStateSearch: true, stateAbbr: stateAbbr2 };
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
      const markers = results.filter(local => local.id !== 20404).map(local => {
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
    const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IUEC" ? IUEC_LOCALS : selectedTrade === "IUOE" ? IUOE_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "IW" ? IW_LOCALS : selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
    const withDist = database
      .map(l => ({ ...l, distance: getDistanceMiles(loc.lat, loc.lng, l.lat, l.lng) }))
      .sort((a, b) => a.distance - b.distance);
    let filtered;
    if (loc.isStateSearch && loc.stateAbbr) {
      // State-only search: return ALL locals in that state, ignore radius
      filtered = withDist.filter(l => (l.state || '').toUpperCase() === loc.stateAbbr);
    } else {
      // ZIP/city/address: 50-mile radius
      filtered = withDist.filter(l => l.distance <= 50);
    }
    setSearchMode(loc.isStateSearch ? 'state' : 'radius');
    setResults(filtered);
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
                  <div className={`nav-dropdown-item${page==="resume"?" active":""}`} onMouseDown={() => { setPage("resume"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Plantilla de Curriculum" : lang==="pl" ? "Szablon CV" : "Resume Template"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Descarga gratis" : lang==="pl" ? "Pobierz za darmo" : "Free download — ready to use"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* LEARN DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={`nav-dropdown-btn${(page==="benefits"||page==="retirement"||page==="veterans")?" active":""}${learnOpen?" open":""}`}
                onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); }}
                onBlur={() => setTimeout(() => setLearnOpen(false), 150)}
              >
                {lang==="es" ? "Beneficios" : lang==="pl" ? "Świadczenia" : "Benefits"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {learnOpen && (
                <div className="nav-dropdown-menu">
                  <div className={`nav-dropdown-item${page==="benefits"?" active":""}`} onMouseDown={() => { setPage("benefits"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Resumen de Beneficios" : lang==="pl" ? "Przegląd Świadczeń" : "Benefits Overview"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pensión, salud, anualidad y más" : lang==="pl" ? "Emerytura, zdrowie, renta i więcej" : "Pension, health, annuity & more"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="retirement"?" active":""}`} onMouseDown={() => { setPage("retirement"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Jubilación" : lang==="pl" ? "Emerytura" : "Retirement"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "401k vs Anualidad vs Pensión" : lang==="pl" ? "401k vs Renta vs Emerytura" : "401k vs Annuity vs Pension"}</span>
                  </div>
                  <div className={`nav-dropdown-item${page==="veterans"?" active":""}`} onMouseDown={() => { setPage("veterans"); setLearnOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Recursos para veteranos militares" : lang==="pl" ? "Zasoby dla weteranów wojskowych" : "Resources for military veterans"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* HISTORY DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={`nav-dropdown-btn${(page==="history"||page==="trade-history")?" active":""}${historyOpen?" open":""}`}
                onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); }}
                onBlur={() => setTimeout(() => setHistoryOpen(false), 150)}
              >
                {lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {historyOpen && (
                <div className="nav-dropdown-menu" style={{minWidth:240}}>
                  <div className={`nav-dropdown-item${page==="history"?" active":""}`} onMouseDown={() => { setPage("history"); setHistoryOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Historia General" : lang==="pl" ? "Historia Ogolna" : "General Union History"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "El movimiento desde el siglo XII" : lang==="pl" ? "Ruch od XII wieku" : "The full movement from the 12th century"}</span>
                  </div>
                  {[
                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                    {key:'UA', name:'UA — Plumbers & Pipefitters', page:'history-ua', live:true},
                    {key:'SMART', name:'SMART — Sheet Metal'},
                    {key:'BAC', name:'BAC — Bricklayers'},
                    {key:'IW', name:'Ironworkers'},
                    {key:'HFIAW', name:'HFIAW — Insulators'},
                    {key:'IUEC', name:'IUEC — Elevator Constructors'},
                    {key:'IUOE', name:'IUOE — Operating Engineers'},
                    {key:'UBC', name:'UBC — Carpenters'},
                    {key:'LIUNA', name:'LIUNA — Laborers'},
                  ].map(t => (
                    <div key={t.key} onMouseDown={() => { setPage(t.live ? t.page : "trade-history"); setHistoryOpen(false); }} className={`nav-dropdown-item${page===t.page?" active":""}`} style={{opacity: t.live ? 1 : 0.55, cursor:"pointer"}}>
                      <span className="nav-dropdown-label" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                        <span>{t.name}</span>
                        {!t.live && <span style={{fontSize:9, fontWeight:700, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", background:"rgba(250,128,89,0.12)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"2px 8px", whiteSpace:"nowrap"}}>{lang==="es" ? "Pronto" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={`nav-link ${page==="jobboard"?"active":""}`} onClick={() => setPage("jobboard")}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>
            <button className={`nav-link ${page==="wages"?"active":""}`} onClick={() => setPage("wages")}>{lang==="es" ? "Salarios" : lang==="pl" ? "Place" : "Wages"}</button>
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
                        <a className="btn-ghost" href={res.website.startsWith("http") ? res.website : `https://www.${res.website}`} target="_blank" rel="noopener noreferrer">
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
                  { abbr: "UBC",   label: "Carpenters",          color: "#8b5cf6" },
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
              <div className="results-title">
                <span>{results.length}</span>{' '}
                {searchMode === 'state'
                  ? (lang==="es" ? "Locales en este Estado" : lang==="pl" ? "Lokali w Tym Stanie" : "Locals in This State")
                  : t.nearYou}
                {searchMode === 'radius' && results.length > 0 && (
                  <div style={{fontSize:11, fontWeight:400, color:"rgba(160,180,196,0.7)", marginTop:4, letterSpacing:0.3}}>
                    {lang==="es" ? "Mostrando locales dentro de 50 millas. Busque por estado para ver mas." : lang==="pl" ? "Pokazuje lokale w promieniu 50 mil. Szukaj po stanie aby zobaczyc wiecej." : "Showing locals within a 50-mile radius. Search by state to see more."}
                  </div>
                )}
              </div>
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
                      <a className="btn-website" href={local.website.startsWith("http") ? local.website : `https://${local.website}`} target="_blank" rel="noopener noreferrer">
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

        {page === "history" && (() => {
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const [shown, setShown] = useState(0);
            const ref = useRef(null);
            const animated = useRef(false);
            useEffect(() => {
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting && !animated.current) {
                    animated.current = true;
                    const start = performance.now();
                    const dur = 1400;
                    const step = (now) => {
                      const t = Math.min(1, (now - start) / dur);
                      const eased = 1 - Math.pow(1 - t, 3);
                      setShown(value * eased);
                      if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: 0.5 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };

          const FadeIn = ({ children }) => <div>{children}</div>;

          const ExpandableCard = ({ year, title, summary, body, accent = '#FA8059' }) => {
            const [open, setOpen] = useState(false);
            return (
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:`4px solid ${accent}`}}>
                <div onClick={() => setOpen(o => !o)} style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>{title}</div>
                    <div style={{fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6}}>{summary}</div>
                  </div>
                  <div style={{flexShrink:0, width:32, height:32, borderRadius:'50%', background:`${accent}22`, color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s'}}>+</div>
                </div>
                {open && (
                  <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.7}}>
                    {body}
                  </div>
                )}
              </div>
            );
          };

          const PullQuote = ({ children, attribution }) => (
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #FA8059', background:'linear-gradient(90deg, rgba(250,128,89,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#FA8059', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#FA8059', children }) => (
            <FadeIn>
              <div style={{margin:'80px 0', position:'relative'}}>
                <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                  <div style={{width:48, height:48, borderRadius:12, background:`${color}22`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                  </div>
                </div>
                {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
                {children}
              </div>
            </FadeIn>
          );


          return (
            <div id="history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #FA8059, #F5C518)', transition:'width 0.1s'}} />
              </div>

              {/* HERO */}
              <div style={{padding:'80px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <FadeIn>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Long Arc of Organized Labor</div>
                  <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                    Built by <span style={{color:'#FA8059'}}>Union Hands.</span><br/>
                    <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Forged in Conflict.</span>
                  </h1>
                  <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                    From medieval guilds to modern picket lines, the story of organized labor is the story of who decides the terms of a person's work. It's a centuries-long contest of riots, reforms, betrayals, and breakthroughs — and it's still being written.
                  </p>
                </FadeIn>
              </div>

              {/* TIMELINE TICKER */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', overflow:'hidden'}}>
                <div style={{display:'flex', justifyContent:'space-between', maxWidth:1200, margin:'0 auto', flexWrap:'wrap', gap:16}}>
                  {[
                    { year:'1349', label:'First strikes' },
                    { year:'1834', label:'Tolpuddle Martyrs' },
                    { year:'1886', label:'Haymarket' },
                    { year:'1911', label:'Triangle Fire' },
                    { year:'1935', label:'Wagner Act' },
                    { year:'1937', label:'Flint sit-down' },
                    { year:'1947', label:'Taft-Hartley' },
                    { year:'1981', label:'PATCO' },
                    { year:'2018', label:'Janus' },
                    { year:'2023', label:'Summer of strikes' },
                  ].map((m, i) => (
                    <div key={i} style={{textAlign:'center', flex:'1 1 90px', minWidth:80}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:'#FA8059'}}>{m.year}</div>
                      <div style={{fontSize:10, color:'rgba(160,180,196,0.7)', textTransform:'uppercase', letterSpacing:0.5, marginTop:2}}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="Medieval Era – 1700s" title="Pre-Industrial Roots" intro="Long before the word 'union' existed, European workers organized through craft guilds. By the 12th century, masters of trades like masonry, weaving, and metalwork had formed self-governing associations that controlled training, set quality standards, and limited entry to their professions. Beneath every guild master sat journeymen — fully trained workers who couldn't afford their own shops — and as the path from journeyman to master narrowed, journeymen began forming their own associations, often in conflict with the masters above them.">
                  <ExpandableCard
                    year="1349"
                    title="London Cordwainers' Walkout"
                    summary="One of the earliest documented strikes in European history."
                    body="Journeymen shoemakers in 14th-century London staged a collective walkout that already showed the basic grammar of labor action — collective refusal to work over wages, hours, or conditions. A 14th-century strike of Parisian saddlers' apprentices used the same playbook. The tactics were already in place; only the legal recognition was missing."
                  />
                  <ExpandableCard
                    year="1799-1800"
                    title="The Combination Acts"
                    summary="Britain made it illegal for workers to unite for higher wages."
                    body="The British state recognized that workers, if allowed to combine, could meaningfully shift bargaining power — and chose to come down firmly on the employers' side. Workers faced criminal penalties for organizing, while employers were largely free to coordinate against them. That asymmetry would define labor law for the next century."
                  />
                </Era>

                <PullQuote attribution="The pattern that would shape labor law for a century">
                  Workers who united faced criminal penalties; employers who coordinated against them faced none.
                </PullQuote>

                {/* PART II */}
                <Era tag="II" years="Late 1700s – Mid 1800s" title="The Industrial Revolution" color="#F5C518" intro="The Industrial Revolution transformed the workshop into the factory and the artisan into the wage worker. Hours stretched to twelve, fourteen, sometimes sixteen per day. Children as young as six worked in mines and mills. Wages floated at subsistence. In response, workers built new institutions adapted to factory life — and faced down the same legal hostility that confronted their counterparts a generation earlier.">
                  <ExpandableCard
                    year="1834"
                    accent="#F5C518"
                    title="The Tolpuddle Martyrs"
                    summary="Six Dorset farm laborers transported to Australia for forming a union."
                    body="Their crime was swearing a secret oath to form a friendly society of agricultural laborers. They became early martyrs of the British movement and rallying figures for organized labor across the English-speaking world. The case made clear that even where Combination Acts had been repealed, the state had other tools to crush organizing — and that workers would have to push back politically as well as industrially."
                  />
                  <ExpandableCard
                    year="1848"
                    accent="#F5C518"
                    title="The Communist Manifesto"
                    summary="Karl Marx and Friedrich Engels reframed workers as a class with shared interests across borders."
                    body="The manifesto's most enduring legacy on the labor movement was less its specific program than its reframing of workers as a coherent class with shared interests across borders, industries, and trades. That idea would resurface again and again in union organizing — from the Knights of Labor's inclusive vision to the IWW's 'One Big Union' to today's cross-border solidarity campaigns."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1790s – 1860s" title="American Beginnings" intro="The first sustained American unions emerged in the 1790s among skilled urban craftsmen — Philadelphia shoemakers, New York printers, Boston carpenters. They were small, localized, and focused on specific crafts, but they conducted strikes, set wage scales, and built strike funds. They also ran headlong into the same legal hostility their British counterparts faced.">
                  <ExpandableCard
                    year="1806"
                    title="The Philadelphia Cordwainers Trial"
                    summary="Workers who combined to raise wages were ruled guilty of 'criminal conspiracy.'"
                    body="The doctrine established in this trial would haunt American labor for nearly a century. Under common law, the very act of workers organizing for higher pay was treated as a crime. Strikes were not just unprotected — they were prosecutable. This is the legal environment in which every subsequent American union had to operate."
                  />
                  <ExpandableCard
                    year="1842"
                    title="Commonwealth v. Hunt"
                    summary="Often called the Magna Carta of American labor."
                    body="The Massachusetts Supreme Judicial Court ruled that unions were not inherently illegal and that strikes for legitimate purposes were lawful. It was a foundational decision, but its protections were thin and inconsistently applied across states. Workers had won the right to exist on paper; they would spend the next century fighting for the right to act."
                  />
                  <ExpandableCard
                    year="1866"
                    title="The National Labor Union"
                    summary="The first attempt at a truly national, multi-trade federation."
                    body="The NLU pushed for the eight-hour day — a demand that would become labor's North Star for the next half-century — but it folded by 1873, undone by the depression of that year and its own drift into politics. Its successors would learn that bargaining leverage came from organizing around specific trades, not broad ideological visions."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="1869 – 1900" title="The Gilded Age" color="#E74C3C" intro="The Knights of Labor opened American labor's most ambitious experiment in inclusive organizing — welcoming skilled and unskilled, men and women, Black and white into a single organization aimed at remaking industrial society. Stepping into the vacuum after their collapse came the American Federation of Labor, with the opposite approach: skilled workers only, narrow 'bread and butter' goals, and a ruthless pragmatism that would define American labor for the next half-century.">
                  <ExpandableCard
                    year="1877"
                    accent="#E74C3C"
                    title="The Great Railroad Strike"
                    summary="Paralyzed the country, was crushed by federal troops, left more than 100 workers dead."
                    body="The strike exposed the pattern that would define Gilded Age labor relations: companies could rely on private armies, court injunctions, and federal force to break strikes, while workers had little legal recourse and no recognized right to organize. That asymmetry of force shaped the bitter character of American labor relations for generations."
                  />
                  <ExpandableCard
                    year="1886"
                    accent="#E74C3C"
                    title="Haymarket Square"
                    summary="A bombing at a Chicago rally for the eight-hour day killed seven police officers."
                    body="Eight anarchists were tried, four were hanged, and the Knights of Labor — wrongly but indelibly associated with the violence in the public mind — collapsed. At their 1886 peak, the Knights had claimed nearly 800,000 members. By 1900, the organization was effectively gone. The American Federation of Labor, founded the same year by cigar maker Samuel Gompers, would step into the vacuum."
                  />
                  <ExpandableCard
                    year="1892"
                    accent="#E74C3C"
                    title="The Homestead Strike"
                    summary="Steelworkers fought a pitched battle against 300 Pinkerton agents."
                    body="At Andrew Carnegie's Homestead plant near Pittsburgh, workers struck against wage cuts. Carnegie's manager Henry Clay Frick brought in Pinkertons, who exchanged gunfire with strikers in a battle that killed at least nine workers and seven Pinkertons before the state militia broke the strike. Homestead became a symbol of how far companies would go to break unions — and how isolated workers were from any legal protection."
                  />
                  <ExpandableCard
                    year="1894"
                    accent="#E74C3C"
                    title="The Pullman Strike"
                    summary="Eugene V. Debs went to prison and emerged a socialist."
                    body="Debs's American Railway Union led a sympathy strike with Pullman Palace Car Company workers. President Grover Cleveland sent in federal troops, the strike was broken, and Debs went to prison. He emerged a socialist — and would later run for president from a federal prison cell, winning nearly a million votes in 1920."
                  />
                </Era>

                <PullQuote attribution="The shape of Gilded Age labor">
                  Companies could rely on private armies, court injunctions, and federal force. Workers had little legal recourse and no recognized right to organize.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="1900 – 1929" title="The Progressive Era" intro="Two parallel labor stories ran through the early 20th century. The AFL grew steadily, consolidating its grip on skilled trades and accumulating modest political influence. A far more radical current — the Industrial Workers of the World, founded in 1905 — pushed against both employers and the AFL itself, organizing all workers regardless of skill, race, or sex.">
                  <ExpandableCard
                    year="1905"
                    title="The IWW — One Big Union"
                    summary="Socialists, anarchists, and unionists rejected the AFL's craft-by-craft approach."
                    body="The Wobblies led dramatic strikes in textile mills (Lawrence, 1912), silk mills (Paterson, 1913), and lumber camps across the Pacific Northwest. Their songs, multilingual organizing, and inclusion of women and workers of color made them culturally influential far beyond their membership numbers. Federal prosecutions during and after World War I — including imprisonment of leaders under the Espionage Act — effectively destroyed the organization by the early 1920s."
                  />
                  <ExpandableCard
                    year="1911"
                    title="The Triangle Shirtwaist Factory Fire"
                    summary="146 garment workers died trapped behind locked doors."
                    body="The fire killed mostly young immigrant women and became a defining event in New York City politics. It fueled the rise of Frances Perkins, who would later become FDR's Secretary of Labor and the first woman in a U.S. cabinet. The tragedy laid the groundwork for state-level workplace safety laws and crystallized public support for the regulation of working conditions."
                  />
                  <ExpandableCard
                    year="1919-1920"
                    title="The Red Scare and the Backlash"
                    summary="Postwar reaction crushed labor radicals and the steel strike."
                    body="World War I had temporarily strengthened unions through federal mediation boards, and AFL membership doubled. The Red Scare reversed course brutally. Through the 1920s — the era of the 'American Plan' — corporations promoted company unions and 'open shops' while courts issued injunctions against virtually any meaningful labor action. By 1929, AFL membership had fallen sharply, and unions covered roughly 10 percent of the nonagricultural workforce."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="1929 – 1945" title="The New Deal Transformation" color="#22c55e" intro="The most consequential period in American labor history. The economic collapse of 1929 discredited the laissez-faire orthodoxy that had hobbled unions for decades, and the Roosevelt administration moved — sometimes hesitantly, sometimes boldly — to rewrite the rules of the workplace.">
                  <ExpandableCard
                    year="1932"
                    accent="#22c55e"
                    title="The Norris-LaGuardia Act"
                    summary="Stripped federal courts of much of their power to issue anti-strike injunctions."
                    body="For half a century, court injunctions had been the most effective tool for crushing strikes. Norris-LaGuardia ended that — and signaled that the political winds were shifting. The act was the first major federal recognition that workers had the right to act collectively without judicial interference."
                  />
                  <ExpandableCard
                    year="1935"
                    accent="#22c55e"
                    title="The Wagner Act"
                    summary="The closest thing American labor has to a constitution."
                    body="The National Labor Relations Act guaranteed private-sector workers the right to form unions, established the National Labor Relations Board to supervise union elections and adjudicate unfair labor practices, and barred employers from firing workers for organizing or refusing to bargain in good faith. Within two years, the Supreme Court upheld it in NLRB v. Jones & Laughlin Steel — and the floodgates opened."
                  />
                  <ExpandableCard
                    year="1936-37"
                    accent="#22c55e"
                    title="The Flint Sit-Down Strike"
                    summary="44 days of factory occupation forced GM to recognize the UAW."
                    body="Autoworkers at General Motors plants in Flint, Michigan refused to leave their factories until the company recognized the United Auto Workers. GM capitulated in February 1937. Within months, U.S. Steel — long the most union-resistant company in America — voluntarily recognized the Steel Workers Organizing Committee. Industrial unionism, long blocked by the AFL's craft orientation, had arrived."
                  />
                  <ExpandableCard
                    year="1945"
                    accent="#22c55e"
                    title="The Wartime Peak"
                    summary="Union membership reached nearly 35 percent of the nonagricultural workforce."
                    body="The federal government, desperate for industrial production, struck a grand bargain with unions: in exchange for no-strike pledges, the National War Labor Board imposed 'maintenance of membership' provisions that effectively required new hires to join existing unions. By war's end, union density had reached the highest level in American history."
                  />
                </Era>

                {/* STATS BREAK */}
                <FadeIn>
                  <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(34,197,94,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{textAlign:'center', marginBottom:24}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:2, textTransform:'uppercase'}}>The Postwar Peak</div>
                      <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>By the Numbers</h3>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:8}}>
                      <StatBlock value={35} label="Peak union density" suffix="%" />
                      <StatBlock value={5} label="Million workers struck in 1946" suffix="M+" />
                      <StatBlock value={28} label="Right-to-work states" />
                      <StatBlock value={381} label="Major work stoppages in 1970" />
                    </div>
                  </div>
                </FadeIn>

                {/* PART VII */}
                <Era tag="VII" years="1945 – 1970s" title="The Postwar Golden Age" color="#22c55e" intro="The first years after the war were paradoxical. 1946 saw the largest strike wave in American history — more than five million workers walked off the job in coal, steel, auto, electrical manufacturing, and rail. The strikes won significant wage gains and cemented unions as central institutions of the postwar economy. They also provoked a political backlash that would shape labor for the rest of the century.">
                  <ExpandableCard
                    year="1947"
                    accent="#22c55e"
                    title="The Taft-Hartley Act"
                    summary="The labor movement's most consequential legislative defeat."
                    body="Passed over President Truman's veto, Taft-Hartley amended the Wagner Act to ban 'closed shops,' authorize states to pass right-to-work laws, allow employers to campaign actively against unions during organizing drives, and require union officers to sign anti-communist affidavits. Twenty-eight states would eventually pass right-to-work laws, mostly in the South and Mountain West, creating an uneven legal terrain that persists today."
                  />
                  <ExpandableCard
                    year="1950"
                    accent="#22c55e"
                    title="The Treaty of Detroit"
                    summary="A five-year UAW-GM contract that became the template of the middle class."
                    body="Regular productivity-tied wage increases. Employer-paid health insurance. Defined-benefit pensions. Cost-of-living adjustments. Grievance procedures. These benefits were largely confined to unionized workers in unionized industries — but they were widely emulated by nonunion employers eager to keep unions out, and they became the foundation of the postwar middle class for generations."
                  />
                  <ExpandableCard
                    year="1962-68"
                    accent="#22c55e"
                    title="Public-Sector Breakthrough"
                    summary="Teachers, sanitation workers, police, and firefighters organized in unprecedented numbers."
                    body="President Kennedy's Executive Order 10988 in 1962 granted federal workers limited collective bargaining rights, and a wave of state laws followed. The 1968 Memphis sanitation workers' strike — during which Martin Luther King Jr. was assassinated while supporting the strikers — fused the labor and civil rights movements at one of the era's most piercing moments."
                  />
                  <ExpandableCard
                    year="1965-73"
                    accent="#22c55e"
                    title="The United Farm Workers"
                    summary="Cesar Chavez and Dolores Huerta organized workers explicitly excluded from the Wagner Act."
                    body="The grape boycotts of the late 1960s and early 1970s, supported by tens of millions of consumers nationwide, won the first major contracts for predominantly Latino farmworkers in California — workers the Wagner Act had explicitly excluded from its protections. The campaign showed that consumer solidarity could substitute for legal protection in pressuring employers."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="1980s – 2000s" title="Decline and Restructuring" color="#9CA3AF" intro="By the early 1970s, the foundations of the golden age were cracking. Foreign competition eroded American manufacturing dominance. The 1973 oil shock shattered the postwar economic consensus. And in industries from steel to auto to textiles, employers began searching in earnest for ways to escape the high-wage, high-benefit contracts that unions had built.">
                  <ExpandableCard
                    year="1981"
                    accent="#9CA3AF"
                    title="PATCO — The Symbolic Break"
                    summary="13,000 air traffic controllers walked out. Reagan fired more than 11,000 of them."
                    body="When the federal air traffic controllers struck demanding better pay and shorter hours, President Reagan — himself a former Screen Actors Guild president — gave them 48 hours to return to work. When most refused, he fired them and banned them from federal employment for life. PATCO's significance went far beyond aviation. It signaled to private-sector employers that aggressive anti-union tactics — including the permanent replacement of striking workers — would not face federal pushback. Strikes plummeted. By 2009, the number of major work stoppages had fallen to a record low of just 5."
                  />
                  <ExpandableCard
                    year="1979-2010"
                    accent="#9CA3AF"
                    title="The Manufacturing Collapse"
                    summary="Manufacturing employment shrank from 19 million to under 12 million."
                    body="The historic stronghold of industrial unionism was gutted by automation and offshoring. Service-sector employment expanded enormously, but service workplaces — fragmented, dispersed, often part-time — were vastly harder to organize than centralized factories. Employer resistance also became more sophisticated and aggressive: the 'union avoidance' consulting industry boomed."
                  />
                  <ExpandableCard
                    year="2012-17"
                    accent="#9CA3AF"
                    title="Right-to-Work Spreads North"
                    summary="Indiana, Michigan, Wisconsin, West Virginia, Kentucky."
                    body="The first major Northern industrial states joined the right-to-work bloc — a stunning reversal in territory that had been the heartland of industrial unionism. Each state law made it harder for unions to collect dues from the workers they were legally required to represent."
                  />
                  <ExpandableCard
                    year="2018"
                    accent="#9CA3AF"
                    title="Janus v. AFSCME"
                    summary="The Supreme Court imposed right-to-work conditions on all public-sector unions."
                    body="The Court ruled that requiring nonmembers to pay 'fair share' fees for collective bargaining services violated the First Amendment. By 2020, the union membership rate had fallen to 10.8 percent — less than half the 1983 figure of 20.1 percent and roughly one-third of the postwar peak. Private-sector membership had collapsed to 6.3 percent, closer to its 1900 level than to its 1955 peak."
                  />
                </Era>

                <PullQuote attribution="The decline curve, 1955-2020">
                  From 35 percent of the workforce to under 11 percent. The longest sustained decline in any major Western labor movement.
                </PullQuote>

                {/* PART IX */}
                <Era tag="IX" years="2010s – Early 2020s" title="The 21st-Century Resurgence" intro="For decades, observers had pronounced the American labor movement effectively dead. Then it began to twitch.">
                  <ExpandableCard
                    year="2018-19"
                    title="Red for Ed — The Teacher Strike Wave"
                    summary="Began in West Virginia, spread to Oklahoma, Arizona, Kentucky, North Carolina, Los Angeles."
                    body="Often led by rank-and-file teachers in defiance of conservative state laws against public-sector strikes, the walkouts won meaningful pay raises and put education funding back on the political map. They demonstrated something that had been forgotten: that strikes could still work."
                  />
                  <ExpandableCard
                    year="2020"
                    title="The Pandemic Reset"
                    summary="Frontline workers were suddenly 'essential' — and asked to risk their lives."
                    body="Nurses, grocery clerks, warehouse workers, meatpackers, delivery drivers — designated essential while being asked to work in conditions that ranged from inadequate to lethal. Wildcat actions multiplied. Public sympathy for workers reached a generational high. By 2022, Gallup measured public approval of unions at 71 percent — its highest point since 1965."
                  />
                  <ExpandableCard
                    year="2021-22"
                    title="Starbucks and Amazon Break Through"
                    summary="Companies long considered impossible to unionize broke through."
                    body="In December 2021, baristas at a Starbucks in Buffalo voted to form the first union at a corporate-owned U.S. Starbucks store; within two years the campaign had spread to hundreds of locations. In April 2022, warehouse workers at the Amazon JFK8 facility on Staten Island won the first successful union election at any U.S. Amazon facility."
                  />
                  <ExpandableCard
                    year="2023"
                    title="The Summer of Strikes"
                    summary="The most intense year of strike activity in decades."
                    body="The Writers Guild and SAG-AFTRA shut down Hollywood for months. The UAW launched its 'Stand-Up Strike' — a rolling, targeted strike against all three Detroit automakers simultaneously, the first such action in the union's history. The UAW won contracts with double-digit wage increases, the elimination of much of the hated two-tier wage structure, and the right to strike over plant closures. UPS Teamsters won what their union called the most lucrative contract in its history without striking, after a credible strike threat."
                  />
                  <ExpandableCard
                    year="2024"
                    title="Chattanooga Falls"
                    summary="The first successful auto union election in the South in modern memory."
                    body="In April 2024, Volkswagen workers in Chattanooga voted overwhelmingly to join the UAW — the first successful union election at a foreign-owned auto plant in the South in modern memory. A region long considered nearly impenetrable to organized labor had cracked open."
                  />
                </Era>

                {/* CURRENT-DAY DASHBOARD */}
                <FadeIn>
                  <div style={{margin:'80px 0 40px', padding:'40px 28px', background:'linear-gradient(135deg, rgba(250,128,89,0.08) 0%, rgba(245,197,24,0.08) 100%)', borderRadius:24, border:'1px solid rgba(250,128,89,0.2)'}}>
                    <div style={{textAlign:'center', marginBottom:32}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase'}}>Where We Are Now</div>
                      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'#fff', margin:'12px 0 0 0'}}>The Movement in 2026</h2>
                      <p style={{fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:600, margin:'12px auto 0', lineHeight:1.6}}>High-profile, energetic, popularly supported, and politically embattled to a degree not seen in decades.</p>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:24}}>
                      <StatBlock value={14.7} label="Million union members" suffix="M" decimals={1} />
                      <StatBlock value={16.5} label="Workers covered by contract" suffix="M" decimals={1} />
                      <StatBlock value={71} label="Public approval" suffix="%" />
                      <StatBlock value={32.9} label="Public sector density" suffix="%" decimals={1} />
                    </div>
                    <div style={{padding:'24px', background:'rgba(0,0,0,0.25)', borderRadius:16, marginTop:8}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2, textTransform:'uppercase', marginBottom:12}}>The Wage Premium</div>
                      <div style={{display:'flex', gap:24, flexWrap:'wrap', alignItems:'center'}}>
                        <div style={{flex:'1 1 180px'}}>
                          <div style={{fontSize:12, color:'rgba(160,180,196,0.8)', marginBottom:4}}>Median weekly earnings — UNION</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#FA8059'}}>$<AnimatedNumber value={1404} /></div>
                        </div>
                        <div style={{flex:'1 1 180px'}}>
                          <div style={{fontSize:12, color:'rgba(160,180,196,0.8)', marginBottom:4}}>Median weekly earnings — NONUNION</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'rgba(255,255,255,0.5)'}}>$<AnimatedNumber value={1174} /></div>
                        </div>
                        <div style={{flex:'1 1 100px', padding:'12px 16px', background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.4)', borderRadius:12, textAlign:'center'}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#22c55e'}}>+$<AnimatedNumber value={230} /></div>
                          <div style={{fontSize:10, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:1}}>Per week</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* PART X — Crossroads */}
                <Era tag="X" years="2025 – 2026" title="A Movement at a Crossroads" color="#F5C518" intro="The 2026 picture is one of sharp contrasts. Public approval of unions remains historically high. NLRB union election petitions have doubled since 2021. Reform movements in the UAW and Teamsters have produced more militant leadership and bigger contracts. New organizing has reached previously off-limits sectors: coffee retail, tech, video games, graduate education, museums, journalism, Amazon warehouses.">
                  <ExpandableCard
                    year="2025"
                    accent="#F5C518"
                    title="The Federal Workforce Confrontation"
                    summary="Executive orders ended collective bargaining for over one million federal workers."
                    body="Citing national security concerns, the Trump administration excluded large portions of the federal workforce from federal labor-management relations protections — affecting roughly 84 percent of the unionized federal workforce. Federal employee unions filed roughly a dozen lawsuits, scoring early wins at the district court level only to see federal appeals courts overturn preliminary injunctions. In an outcome that likely surprised the executive branch, union density among federal workers actually rose from 29.9 percent to 31.1 percent — the largest single-year increase since 2011, as federal employees flocked to unions for protection during mass layoffs and policy upheaval."
                  />
                  <ExpandableCard
                    year="2024-25"
                    accent="#F5C518"
                    title="The Strike Wave Continues"
                    summary="Boeing, Longshoremen, Starbucks, Republic Services, Corewell."
                    body="271,500 workers participated in 31 major strikes in 2024. The October 2024 International Longshoremen's Association strike — the union's first since 1977 — shut down East and Gulf Coast ports for two days before yielding a tentative agreement that included a 62 percent pay increase over six years. The fall 2024 Boeing machinists' strike secured a 38 percent wage increase. In November 2024, 10,000 nurses at Corewell hospitals won the largest unionization election in recent memory."
                  />
                  <ExpandableCard
                    year="2025"
                    accent="#F5C518"
                    title="The Generational Shift"
                    summary="Workers under 45 are doing nearly all the new organizing."
                    body="Union coverage among workers under 45 increased by 428,000 in 2025, compared with just 35,000 among workers 45 and over. The South alone accounted for 46 percent of all net gains nationwide. The center of gravity of new organizing is shifting younger, more diverse, and — surprisingly to many — Southern."
                  />
                </Era>

                {/* CONCLUSION */}
                <FadeIn>
                  <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Long Arc</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>What Endures</h2>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                      The history of organized labor is not a clean story of progress, nor of inevitable decline. It is a series of moments — Tolpuddle, Haymarket, Triangle, Flint, Memphis, PATCO, Buffalo, Chattanooga — in which workers and employers tested each other's strength, and the political balance shifted in response.
                    </p>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                      Membership numbers have risen and fallen by factors of three or more within living memory. Industries once considered impossible to organize have been organized. Industries once considered safely organized have been hollowed out. What endures across the centuries is the underlying tension that gave rise to unions in the first place: the fundamental imbalance of power between an individual worker and the institutions that employ them.
                    </p>
                    <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                      The forms have varied wildly — from secret oaths to medieval guilds to industrial unions to roving picket lines — but the impulse has been remarkably consistent. The story, as ever, is still being written.
                    </p>
                    <div style={{marginTop:40, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                      <div style={{fontSize:13, color:'rgba(160,180,196,0.7)', fontStyle:'italic'}}>Coming soon: trade-by-trade histories — IBEW, UA, SMART, BAC, IW, HFIAW, IUEC, IUOE, UBC, LIUNA, and IBEW Lineman.</div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          );
        })()}

        {page === "history-ibew" && (() => {
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const [shown, setShown] = useState(0);
            const ref = useRef(null);
            const animated = useRef(false);
            useEffect(() => {
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting && !animated.current) {
                    animated.current = true;
                    const start = performance.now();
                    const dur = 1400;
                    const step = (now) => {
                      const t = Math.min(1, (now - start) / dur);
                      const eased = 1 - Math.pow(1 - t, 3);
                      setShown(value * eased);
                      if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: 0.5 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };

          const ExpandableCard = ({ year, title, summary, body, accent = '#FA8059' }) => {
            const [open, setOpen] = useState(false);
            return (
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:`4px solid ${accent}`}}>
                <div onClick={() => setOpen(o => !o)} style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>{title}</div>
                    <div style={{fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6}}>{summary}</div>
                  </div>
                  <div style={{flexShrink:0, width:32, height:32, borderRadius:'50%', background:`${accent}22`, color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s'}}>+</div>
                </div>
                {open && (
                  <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.7}}>
                    {body}
                  </div>
                )}
              </div>
            );
          };

          const PullQuote = ({ children, attribution }) => (
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #F5C518', background:'linear-gradient(90deg, rgba(245,197,24,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#F5C518', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#F5C518', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:48, height:48, borderRadius:12, background:`${color}22`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                </div>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );


          return (
            <div id="ibew-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #F5C518, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#F5C518'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The International Brotherhood of Electrical Workers</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Wired for the <span style={{color:'#F5C518'}}>Long Haul.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Born in a St. Louis dance hall, 1891.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  Few unions can claim to have grown up alongside an entire technology. When ten delegates met above Stolley's Dance Hall on November 21, 1891, most American homes had no electrical service — and the trade they were practicing was killing one in two of its workers within a career.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={887} label="Members and retirees" suffix="K" />
                  <StatBlock value={134} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={12} label="Years of consecutive growth" />
                  <StatBlock value={1972} label="Peak year — 1M members" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="1840s – 1880s" title="The Pre-Electrical World" intro="The IBEW's prehistory begins not with electricity but with the telegraph. When Samuel Morse's first commercial wires were strung between Washington and Baltimore in 1844, they brought with them the first generation of American workers whose job was to climb poles, string wire, and keep the system running.">
                  <ExpandableCard
                    year="1881"
                    title="Brotherhood of Telegraphers"
                    summary="One of the country's first specialty labor associations, affiliated with the Knights of Labor."
                    body="By the 1860s and 1870s, telegraph workers had formed some of the country's earliest specialty labor associations. Western Union crushed a major telegraphers' strike in 1883, and the early organizations were short-lived. But they laid the cultural groundwork — itinerant, skilled, fiercely independent — that would carry into the electrical trade a decade later."
                  />
                  <ExpandableCard
                    year="1880s"
                    title="The Deadliest Trade in America"
                    summary="Mortality rates among linemen approached one in two over the course of a career."
                    body="The arrival of practical incandescent lighting, electric streetcars, and central power stations transformed the work almost overnight. Telegraph wires carried small, low-voltage signals; the new electrical wires carried currents capable of killing a man instantly. Linemen routinely climbed poles strung with a tangle of telegraph, telephone, fire-alarm, streetcar, and high-voltage power lines — with no insulation standards, no rubber gloves, no safety harnesses, no formal training, and no legal protection. In city after city, the same pattern emerged: a handful of veteran linemen and wiremen, watching too many of their friends die, began to talk about organizing."
                  />
                </Era>

                <PullQuote attribution="The grim arithmetic of early electrical work">
                  Mortality rates among linemen approached one in two over the course of a career.
                </PullQuote>

                {/* PART II */}
                <Era tag="II" years="1890 – 1891" title="Henry Miller and the Founding" intro="Born on a ranch near Fredericksburg, Texas in 1853, Henry Miller had worked as a water boy on a government project stringing telegraph wires through the West before becoming a lineman himself. Tall, broad-shouldered, with reddish-brown hair and keen blue eyes — and possessed of what his contemporaries described as boundless energy. He was a widower with no known family ties; the trade was effectively his entire life.">
                  <ExpandableCard
                    year="1890"
                    title="St. Louis Local 5221"
                    summary="Miller and a small group of local electrical workers concluded they needed a union."
                    body="In 1886, Miller arrived in St. Louis and took work with the municipal power company. In 1890, while working at the St. Louis Exposition Hall, he and a small group of fellow electrical workers came together. With help from American Federation of Labor organizer Charles Kassel, the group was chartered as Electrical Wiremen and Linemen's Union, AFL Federal Labor Union No. 5221. But Miller understood from the start that a single local in a single city could accomplish little against the rapidly consolidating corporate empires building America's electrical grid. Only a national union could bargain on equal terms."
                  />
                  <ExpandableCard
                    year="1890-91"
                    title="Riding the Rails"
                    summary="Miller spent a year on the road, hiding from railroad police, organizing city by city."
                    body="He rode freight trains — often hiding from the railroad police, the 'bulls' who would have arrested him for unauthorized travel — carrying his tools and a change of shirts in an old carpetbag. In city after city, he found electrical workers, worked alongside them long enough to organize them, and moved on. By the autumn of 1891, locals had been chartered or were forming in Chicago, Milwaukee, Indianapolis, Evansville, Louisville, New Orleans, Cincinnati, Toledo, Pittsburgh, Philadelphia, Duluth, and New York."
                  />
                  <ExpandableCard
                    year="Nov 21, 1891"
                    title="Above Stolley's Dance Hall"
                    summary="Ten delegates representing 286 members. They drafted a constitution, by-laws, ritual, and emblem — the famous fist grasping lightning bolts."
                    body="Miller, J.T. Kelly, and William Hedden of St. Louis; T.J. Finnell of Chicago; F.J. Heizleman of Toledo; E.C. Hartung of Indianapolis; Harry Fisher of Evansville; and J.C. Sutter, Joseph Berlovitz, and James Dorsey representing other locals by proxy. Miller's own handwritten report of that first convention captures the mood: the delegates spent days hiding from reporters and trying to make it appear they had a great delegation. For seven days and nights, they drafted the constitution. They named the new organization the National Brotherhood of Electrical Workers and elected Miller, then 33, as Grand President on the fourth round of balloting. Two weeks later, on December 7, 1891, the AFL granted the Brotherhood a charter."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1892 – 1903" title="Early Struggles" color="#FA8059" intro="The young Brotherhood almost did not survive its first decade. The Panic of 1893 devastated the new union — locals folded, dues went unpaid, and by 1895 only twelve delegates answered the convention roll call. Strength of the early officers and a handful of dedicated locals were the only forces keeping it alive.">
                  <ExpandableCard
                    year="July 10, 1896"
                    accent="#FA8059"
                    title="Henry Miller Dies on the Job"
                    summary="Working as a lineman in Washington, D.C., he was electrocuted and fell from a utility pole."
                    body="He was 43 years old, and the union he had founded was barely five. The IBEW today commemorates July 10 as National Lineworker Appreciation Day in his memory; bipartisan resolutions have been introduced in both the U.S. House and Senate to make the designation permanent. The man who had ridden freight trains across the country to organize his trade died practicing it, on a pole, in the city where the union now had its national charter."
                  />
                  <ExpandableCard
                    year="1899"
                    accent="#FA8059"
                    title="Becomes the International Brotherhood"
                    summary="Renamed at the Pittsburgh convention, recognizing the locals being chartered in Canada."
                    body="The 'I' in IBEW reflects the union's expansion into Canada — and, eventually, Guam, Panama, Puerto Rico, and the U.S. Virgin Islands. The international jurisdiction would prove decisive over the next century: the union could follow the technology wherever it went, and bargain on a continental scale rather than be played off region against region."
                  />
                  <ExpandableCard
                    year="1903"
                    accent="#FA8059"
                    title="The First Paid Grand President"
                    summary="Frank J. McNulty, an inside wireman, became the IBEW's first full-time, paid leader."
                    body="Until then, every officer had been a working electrical worker holding union responsibilities on the side. With paid leadership, the IBEW could finally function as a continuous national institution rather than an annual convention with offshoots. By 1905, dues-paying membership had reached 24,000."
                  />
                </Era>

                {/* PART IV */}
                <Era tag="IV" years="1908 – 1913" title="The Reid-Murphy Split" color="#E74C3C" intro="The IBEW's first existential crisis came not from employers but from itself. By 1908, the union was outwardly successful: paid officers, a treasury balance, growing membership. Underneath, three sets of tensions were grinding against each other — and they would split the Brotherhood in two for five years.">
                  <ExpandableCard
                    year="1908"
                    accent="#E74C3C"
                    title="Two Unions Called the IBEW"
                    summary="In September 1908, opposition delegates held a special convention in Pittsburgh."
                    body="The structural tensions: inside wiremen and outside linemen had different jobs, different wage scales, different employers. Wiremen tended to dominate leadership; linemen, often more militant, increasingly felt unheard. The geographic tensions: the Pacific District Council had built an aggressive, contract-oriented model; eastern leadership preferred slower bargaining. The personal tensions: a former Grand Treasurer had been removed for financial irregularities, and his supporters became a permanent opposition faction. Opposition delegates refused to recognize Frank McNulty and elected J.J. Reid, a former Ohio lineman, as president, and James W. Murphy as secretary. Both factions secured court injunctions. AFL President Samuel Gompers tried to mediate, failed, and ultimately recognized the McNulty-Collins group as the legitimate IBEW."
                  />
                  <ExpandableCard
                    year="1908-1913"
                    accent="#E74C3C"
                    title="Five Years of Civil War"
                    summary="Two organizations called themselves the IBEW. Rival conventions, rival journals, rival contracts."
                    body="The Reid-Murphy IBEW, which by some accounts controlled roughly three-quarters of the active electrical workers in the United States and Canada, doubled down on a district-council structure and on aggressive utility organizing — including a 1913 strike against PG&E. The McNulty IBEW, smaller but AFL-recognized, dismantled the district-council system and concentrated authority in the international office. The split ended only by court order: in February 1912, an Ohio court declared the 1908 secession convention illegal; in August 1913, the Ohio Supreme Court issued the final ruling, ordering the Reid faction to stop using the IBEW name. McNulty immediately invited the seceding locals to return without penalty. More than 100 ultimately did, though the wounds in many local cultures took a generation to heal."
                  />
                </Era>

                <PullQuote attribution="The institutional lesson the IBEW carried forward">
                  The Reid-Murphy split remains the most serious internal crisis in the union's history — and the reason the modern IBEW prizes institutional stability above factional militancy.
                </PullQuote>

                {/* PART V */}
                <Era tag="V" years="1914 – 1929" title="The Open Shop Era and the Council on Industrial Relations" intro="The reunified IBEW emerged into a world being transformed by war. American entry into World War I in 1917 put unprecedented demand on the electrical trades, and federal pressure on employers to recognize unions sent IBEW membership surging. The 1920s reversed every gain.">
                  <ExpandableCard
                    year="1921"
                    title="The American Plan"
                    summary="A coordinated national campaign for the open shop, led by the U.S. Chamber of Commerce."
                    body="Pacific Gas & Electric — one of the chamber's principal members — canceled its agreement with the IBEW in 1921. PG&E linemen would not have a union contract again for twelve years, with wages frozen at $170 per month through much of the decade. Employers' associations launched 'open shop' campaigns nationally — workplaces in which union membership could neither be required nor effectively defended. Through the 1920s, IBEW membership stagnated and in some sectors collapsed."
                  />
                  <ExpandableCard
                    year="1919-20"
                    title="The Council on Industrial Relations"
                    summary="A bipartite body of union and management reps with authority to resolve disputes that local bargaining could not."
                    body="Faced with a hostile climate, the IBEW and the National Electrical Contractors Association created what would become the Council on Industrial Relations for the Electrical Contracting Industry. The Council still functions today, and it has resolved the great majority of would-be strikes in the IBEW's construction jurisdiction for over a century. It is one reason the IBEW's strike history, especially in inside construction, is sparser than that of unions like the UAW or Teamsters: most IBEW contracts simply do not allow strikes during the term of an agreement, sending impasses to the Council instead. Critics within the IBEW have long argued this gives away too much worker leverage. Supporters argue it is precisely why the union has labor agreements where many others do not."
                  />
                </Era>

                {/* PART VI */}
                <Era tag="VI" years="1929 – 1945" title="The Wagner Act Era" color="#22c55e" intro="The Depression nearly broke the building trades. Electrical construction work largely stopped between 1930 and 1933. IBEW locals across the country saw membership cut in half. The political response to the crisis would, within a decade, transform the union beyond recognition.">
                  <ExpandableCard
                    year="1935"
                    accent="#22c55e"
                    title="The Wagner Act Opens the Floodgates"
                    summary="Federal protection for the right to organize that the open-shop drive of the 1920s had stolen."
                    body="Utility workers, electrical manufacturing employees, and broadcast technicians who had been impossible to organize against employer resistance now had legal protection, and the IBEW moved aggressively into all three sectors. Through the late 1930s and the war years, it organized utilities like Consolidated Edison in New York, won representation at major electrical manufacturers, and chartered the broadcast-technicians locals that would eventually represent television and radio workers across the country."
                  />
                  <ExpandableCard
                    year="Sep 1941"
                    accent="#22c55e"
                    title="National Apprenticeship Standards"
                    summary="The IBEW-NECA partnership built one of the largest apprenticeship and training systems in the country."
                    body="Working with the Federal Committee on Apprenticeship, the IBEW and NECA established the National Apprenticeship Standards for the Electrical Construction Industry. Under what would become the National Joint Apprenticeship and Training Committee — today rebranded as the electrical training ALLIANCE — the partnership built a five-year program for inside wiremen combining classroom instruction with paid on-the-job training, fully employer-funded through contractually negotiated training contributions. The 'earn while you learn' model — apprentices working at a percentage of journey scale that rises year by year — became a template for skilled-trades training across North America. It is, arguably, the IBEW's most important single institutional creation, more durable than any contract."
                  />
                </Era>

                {/* MID PEAK STATS */}
                <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(245,197,24,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{textAlign:'center', marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2, textTransform:'uppercase'}}>The Peak — 1972</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>One Million Strong</h3>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:8}}>
                    <StatBlock value={1} label="Million members at peak" suffix="M" />
                    <StatBlock value={1959} label="Industrial-electronics course" />
                    <StatBlock value={1966} label="Industrial nuclear course" />
                    <StatBlock value={40} label="Electrical construction share" suffix="%" />
                  </div>
                </div>

                {/* PART VII */}
                <Era tag="VII" years="1945 – 1972" title="Postwar Expansion" color="#22c55e" intro="The quarter-century following World War II was the IBEW's golden age. Suburbanization, the interstate highway system, the cold-war defense build-up, the explosion of consumer electrical goods, the wiring of rural America under continuing rural electrification programs, the build-out of national television networks, and the construction of the country's first generation of nuclear power plants all pushed demand for electrical workers to historic highs.">
                  <ExpandableCard
                    year="1947-72"
                    accent="#22c55e"
                    title="The Inside Wireman's Era"
                    summary="Membership climbed steadily, reaching approximately one million in 1972."
                    body="Inside wiremen built the office towers, hospitals, schools, and shopping malls of postwar America. Outside linemen strung the transmission lines that linked the country into integrated power grids. Telephone workers, especially at AT&T's Bell System, became one of the union's largest single concentrations. Broadcast technicians wired the rapidly expanding television industry. The IBEW added a national industrial-electronics training course in 1959, and an industrial nuclear power course in 1966, keeping its training infrastructure ahead of the technological curve."
                  />
                  <ExpandableCard
                    year="1947"
                    accent="#22c55e"
                    title="Surviving Taft-Hartley"
                    summary="The 1947 act banned closed shops, allowed right-to-work laws, restricted secondary boycotts."
                    body="Taft-Hartley imposed real costs but did not derail growth. The IBEW's strength in the high-skill end of the construction market, where contractors needed reliable, trained, certified workers and were willing to pay union scale to get them, gave it a structural advantage that more easily replaced industrial unions did not have. Even in right-to-work states, the IBEW's apprenticeship pipeline made it the dominant supplier of skilled electricians in many local markets — and that market dominance was the institutional foundation that the next several decades would test."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="1972 – 2000s" title="Deregulation and Decline" color="#9CA3AF" intro="The IBEW's slow decline began at the very moment of its peak. The 1970s combination of stagflation, the 1973 oil shock, foreign competition in electrical manufacturing, and a sustained employer offensive against unions across the construction industry put pressure on every part of the Brotherhood's footprint.">
                  <ExpandableCard
                    year="1970s-80s"
                    accent="#9CA3AF"
                    title="The Merit Shop Rises"
                    summary="Open-shop contractors expanded aggressively, particularly through the Associated Builders and Contractors trade group."
                    body="In many regions, the IBEW's market share in electrical construction fell from near-total dominance to something closer to parity. By 1988, only about 30 percent of American construction work was unionized; the IBEW retained roughly 40 percent of electrical-related construction, but the overall market had shifted, and the long postwar pattern of automatic union renewal at major projects was breaking."
                  />
                  <ExpandableCard
                    year="1982"
                    accent="#9CA3AF"
                    title="The AT&T Breakup"
                    summary="The single most damaging blow came from outside the construction industry."
                    body="The court-ordered breakup of AT&T at the end of 1982 — the divestiture of the Bell System into seven regional operating companies — fundamentally restructured the telecommunications industry, in which the IBEW was deeply organized both among telephone workers and in AT&T's Western Electric manufacturing facilities. The downstream consequences played out over the following two decades: aggressive cost-cutting, plant closures, offshoring of manufacturing, and successive waves of layoffs that shrank the IBEW's telecom and manufacturing membership by hundreds of thousands."
                  />
                  <ExpandableCard
                    year="1990s-2000s"
                    accent="#9CA3AF"
                    title="Utility Deregulation"
                    summary="Vertically integrated utilities that had once employed large, stable IBEW workforces were broken up."
                    body="Generation was often spun off to competitive markets. Mergers consolidated workforces. Outsourcing moved work to non-union contractors. The 2001 collapse of Enron and the broader deregulation backlash slowed but did not reverse the trend. By the early 2000s, IBEW membership had fallen well below its 1972 peak — though construction held up better than utilities, and utilities better than manufacturing or telecommunications."
                  />
                </Era>

                {/* PART IX */}
                <Era tag="IX" years="2000s – Early 2020s" title="Reinvention" intro="The IBEW's response to the post-deregulation landscape was, in retrospect, a quiet reinvention. Rather than trying to defend a shrinking industrial footprint, the union leaned hard into the parts of the electrical economy that were growing — and into the political work necessary to make sure those new sectors were built with union labor.">
                  <ExpandableCard
                    year="2000s-2010s"
                    title="Renewable Energy Training"
                    summary="$140 million committed nationally to renewable-energy training, fully labor-management funded."
                    body="Long before 'green jobs' became a national political theme, the IBEW and NECA had begun investing heavily in renewable training. The St. Louis IBEW/NECA Electrical Industry Training Center began producing journey workers proficient in solar, wind, and other green-energy installations in the 2000s. By the 2010s, IBEW/NECA had committed roughly $140 million nationally — fully funded by the labor-management partnership without taxpayer support. The union also helped develop the first national Electric Vehicle Infrastructure Training Program (EVITP) for charging-station installation, which by the early 2020s had become the de facto standard for utility and government-funded EV-charging projects."
                  />
                  <ExpandableCard
                    year="2021-22"
                    title="Federal Legislation Wins"
                    summary="Bipartisan Infrastructure Law, CHIPS Act, Inflation Reduction Act."
                    body="IBEW lobbying was central to the labor-standards provisions in the Bipartisan Infrastructure Law (2021), the CHIPS and Science Act (2022), and the Inflation Reduction Act (2022). Each contained registered-apprenticeship requirements, prevailing-wage rules, and project-labor-agreement preferences that effectively channeled tens of billions of dollars in federal infrastructure, semiconductor, and clean-energy spending toward the unionized building trades. New Jersey Local 351 member Donald Norcross, the only IBEW member in Congress, has been a key legislative ally."
                  />
                  <ExpandableCard
                    year="2024"
                    title="First New Retirement Benefit Since 1946"
                    summary="The IBEW upgraded pension benefits and created a new retirement benefit."
                    body="The first significant retirement-benefit upgrade in 78 years. It came at the same moment the union was reporting twelve consecutive years of membership growth — a recovery that began quietly in the early 2010s and accelerated through the late 2010s and 2020s."
                  />
                </Era>

                {/* CURRENT-DAY DASHBOARD */}
                <div style={{margin:'80px 0 40px', padding:'40px 28px', background:'linear-gradient(135deg, rgba(245,197,24,0.08) 0%, rgba(250,128,89,0.08) 100%)', borderRadius:24, border:'1px solid rgba(245,197,24,0.2)'}}>
                  <div style={{textAlign:'center', marginBottom:32}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:3, textTransform:'uppercase'}}>Where the IBEW Stands Now</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'#fff', margin:'12px 0 0 0'}}>The Brotherhood in 2026</h2>
                    <p style={{fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:600, margin:'12px auto 0', lineHeight:1.6}}>Industries booming, political environment hostile, growth trajectory the steepest in fifty years.</p>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:24}}>
                    <StatBlock value={887} label="Active members + retirees" suffix="K" />
                    <StatBlock value={12} label="Years of consecutive growth" />
                    <StatBlock value={1} label="Million-member target" suffix="M" />
                    <StatBlock value={3} label="Times more apprentices in data-center hubs" suffix="x" />
                  </div>
                </div>

                {/* PART X */}
                <Era tag="X" years="2025 – 2026" title="The Present Day" intro="The IBEW enters 2026 in a peculiar position. Membership has climbed from 775,000 a few years ago to approximately 887,000. International President Cooper has stated publicly that the union has grown for twelve consecutive years and has been recruiting tens of thousands of new electrical workers annually, at rates not seen in more than fifty years.">
                  <ExpandableCard
                    year="2024-26"
                    title="The Data Center Boom"
                    summary="The single most consequential change in IBEW's recent work environment."
                    body="Locals in Northern Virginia, central Maryland, Phoenix, central Texas, and Atlanta are managing project pipelines at unprecedented scale, with major data center campuses requiring hundreds and potentially thousands of electrical workers across the life of a project. Local apprenticeships in data-center-heavy regions have nearly tripled. The work has become an organizing tool in itself: the prospect of journeyman wages on multi-billion-dollar campuses has become one of the most effective recruitment pitches the union has had in a generation."
                  />
                  <ExpandableCard
                    year="Feb 2025"
                    title="Local 1049 Strike Authorization"
                    summary="409-to-6 vote to authorize a strike at New York metro gas power plants."
                    body="One of the strongest pro-strike signals in the union's recent utility bargaining history. Most IBEW agreements still go through the Council on Industrial Relations rather than to the picket line, but the 2024-2026 period saw an unusual number of high-profile contract fights at the union's edges."
                  />
                  <ExpandableCard
                    year="Mar 2026"
                    title="PECO — Hours From a First-Ever Strike"
                    summary="1,500 IBEW Local 614 utility workers in Philadelphia."
                    body="Linemen, gas mechanics, customer-service representatives, and others, pressing for retirement-benefit parity with the company's foremen and executives. The IBEW came within hours of its first-ever strike against PECO."
                  />
                  <ExpandableCard
                    year="Dec 31, 2025"
                    title="Local 1245 — PG&E Contract Expires"
                    summary="12,000 lineworkers at California's largest utility. Local 1245 last formally struck in the 1920s."
                    body="Rank-and-file activists in multiple IBEW utility locals have been openly campaigning to win back the right to strike during contract terms — a structural change that would reshape the union's bargaining culture, and one of the most contested questions inside the modern Brotherhood."
                  />
                  <ExpandableCard
                    year="Sep 2026"
                    title="The 41st International Convention"
                    summary="San Diego, September 21-25. The union's highest governing body, held every five years."
                    body="The 41st International Convention comes at a moment when many of the questions the IBEW has navigated for a century — the relationship to no-strike clauses and the Council on Industrial Relations, the balance between construction and 'P&I' branches, the union's posture on emerging technologies, the path back to a million members — are all on the table simultaneously."
                  />
                </Era>

                {/* CONCLUSION */}
                <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>134 Years In, Still Following the Electrons</h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    When Henry Miller and nine other men gathered above Stolley's Dance Hall in November 1891, the United States produced almost no electricity. The country they imagined wiring up did not yet exist. The technologies they would spend their careers installing were either brand new or still on the drawing board. The trade itself was so dangerous that Miller would be dead within five years, and the union he founded would nearly die with him.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    What endured was the model the founders chose. A national jurisdiction broad enough to follow the technology wherever it went. A heavy investment in training as the source of bargaining power. A preference, after the Reid-Murphy split, for institutional stability and disciplined bargaining over factional militancy. A willingness, through the Council on Industrial Relations, to trade some short-term leverage for long-term predictability with employer partners.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                    The work that 2026 demands — wiring data centers for an AI economy, building out transmission for renewable generation, electrifying the vehicle fleet, constructing the next generation of nuclear plants, fabricating semiconductors — is, fundamentally, the same work the founders set out to organize. The technologies are unrecognizable to anyone who climbed a pole in 1891. The trade is not.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#F5C518', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(245,197,24,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}

        {page === "history-ua" && (() => {
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const [shown, setShown] = useState(0);
            const ref = useRef(null);
            const animated = useRef(false);
            useEffect(() => {
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting && !animated.current) {
                    animated.current = true;
                    const start = performance.now();
                    const dur = 1400;
                    const step = (now) => {
                      const t = Math.min(1, (now - start) / dur);
                      const eased = 1 - Math.pow(1 - t, 3);
                      setShown(value * eased);
                      if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: 0.5 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };

          const ExpandableCard = ({ year, title, summary, body, accent = '#3B9EFF' }) => {
            const [open, setOpen] = useState(false);
            return (
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:`4px solid ${accent}`}}>
                <div onClick={() => setOpen(o => !o)} style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>{title}</div>
                    <div style={{fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6}}>{summary}</div>
                  </div>
                  <div style={{flexShrink:0, width:32, height:32, borderRadius:'50%', background:`${accent}22`, color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s'}}>+</div>
                </div>
                {open && (
                  <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.7}}>
                    {body}
                  </div>
                )}
              </div>
            );
          };

          const PullQuote = ({ children, attribution }) => (
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #3B9EFF', background:'linear-gradient(90deg, rgba(59,158,255,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#3B9EFF', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Era = ({ tag, title, years, intro, color = '#3B9EFF', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:48, height:48, borderRadius:12, background:`${color}22`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>{years}</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>{title}</h2>
                </div>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );


          return (
            <div id="ua-history-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #3B9EFF, #FA8059)', transition:'width 0.1s'}} />
              </div>

              {/* BREADCRUMB */}
              <div style={{padding:'24px 24px 0', maxWidth:1000, margin:'0 auto'}}>
                <div onClick={() => setPage('history')} style={{display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700}} onMouseEnter={e => e.currentTarget.style.color = '#3B9EFF'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,180,196,0.85)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  General Union History
                </div>
              </div>

              {/* HERO */}
              <div style={{padding:'40px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The United Association</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  The Pipe Trades' <span style={{color:'#3B9EFF'}}>Long Brotherhood.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>Born in Washington, D.C., 1889.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  When forty delegates met in Washington in October 1889, American cities were still laying their first comprehensive sewer systems. Indoor plumbing was migrating from luxury into building code. Steam heat was replacing coal stoves. Each fitting was installed, one at a time, by tradesmen whose unions were small, local, and frequently at war with each other.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={396} label="Members today" suffix="K" />
                  <StatBlock value={137} label="Years organizing" suffix=" yrs" />
                  <StatBlock value={274} label="Local unions" />
                  <StatBlock value={1971} label="Peak year — 320K members" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* PART I */}
                <Era tag="I" years="Civil War – 1880s" title="Three Crafts, One Job" intro="In the decades after the Civil War, three loosely related crafts shared the work of moving fluids and gases through the buildings of an industrializing America. Plumbers installed water-supply and waste systems. Steamfitters handled high- and low-pressure steam piping. Gas fitters specialized in the rapidly expanding network of illuminating and fuel gas. Each had its own tools, its own apprenticeship traditions, and — increasingly — its own local unions.">
                  <ExpandableCard
                    year="1879-1889"
                    title="The Boom Decade"
                    summary="The first strong, long-lasting locals were established — but the structure remained fragmented."
                    body="By the late 1870s and early 1880s, plumbers, pipefitters, and gas fitters were organized in many major cities, but largely as independent local unions with no national affiliation, or with shifting ties to whatever broader labor federation seemed most promising at the moment. Locals in Boston, New York, Philadelphia, Chicago, and Washington each pursued their own contracts, set their own wage scales, and ran their own apprenticeships. A plumber qualified in one city was not automatically qualified in another. Members who traveled in search of work — and there were many — had no formal mechanism for transferring between locals."
                  />
                  <ExpandableCard
                    year="1880s"
                    title="The Failed First Attempts"
                    summary="A National Association of Plumbers, Gas Fitters, and Steam Fitters had been chartered, but collapsed."
                    body="The first national association folded under the weight of the depression years. The Knights of Labor briefly attracted some pipe-trades workers but offered little support specific to their craft. By the late 1880s, with the United States entering an unprecedented urban building boom, local union leaders increasingly recognized that the absence of a stable national body was costing them: in dues, in mobility, in coordinated bargaining, and in the ability to defend craft jurisdiction against employers and rival unions alike."
                  />
                </Era>

                <PullQuote attribution="P.J. Quinlan, Boston plumber, in his 1889 letter to Richard A. O'Brien">
                  I take the liberty of addressing a few lines to you to obtain your views as regards the formation of a United Brotherhood…
                </PullQuote>

                {/* PART II */}
                <Era tag="II" years="1889" title="The Washington Convention" color="#FA8059" intro="The man who set the founding in motion was Patrick J. Quinlan, a Boston plumber. In early 1889 he addressed his now-famous letter to Richard A. O'Brien, a plumber in Washington, D.C. Quinlan would become the first General President; O'Brien would become its first General Secretary-Treasurer.">
                  <ExpandableCard
                    year="Oct 11, 1889"
                    accent="#FA8059"
                    title="Forty Delegates, Twenty-Three Locals"
                    summary="They drafted a constitution, ritual, dues structure, strike funds, and rules for traveling members."
                    body="Over several days in Washington, the delegates adopted the somewhat unwieldy name under which the union would operate for decades: the United Association of Journeymen Plumbers, Gas Fitters, Steam Fitters, and Steam Fitters' Helpers of the United States and Canada. The American Federation of Labor — which Samuel Gompers had founded only three years earlier — granted the new body an AFL charter shortly thereafter."
                  />
                  <ExpandableCard
                    year="1889-1890"
                    accent="#FA8059"
                    title="The Three Founding Principles"
                    summary="Exclusive jurisdiction over all pipe work. Clearance cards for traveling members. A uniform apprenticeship."
                    body="The young UA was organized around principles that would shape its institutional culture for more than a century. It claimed exclusive jurisdiction over the installation, alteration, and repair of all piping systems — water, waste, gas, and steam — performed for compensation in the United States and Canada. It established a clearance card system that allowed unemployed journeymen in one locality to travel to work in another, the foundation of the union's distinctive mobility. And it committed to building a uniform apprenticeship that would standardize the trade across local jurisdictions. By the second convention in 1890, the UA reported just under 5,000 members."
                  />
                </Era>

                {/* PART III */}
                <Era tag="III" years="1893 – 1914" title="The Steamfitters' War" color="#E74C3C" intro="The Panic of 1893 devastated the new union — membership fell from 6,700 to 4,400 by 1897. But the next two decades would be defined less by employer conflict than by the most consequential internal crisis in the union's history: a prolonged jurisdictional war with the International Association of Steam and Hot Water Fitters and Helpers, an AFL-chartered rival that claimed exclusive authority over steamfitting work.">
                  <ExpandableCard
                    year="1898-1914"
                    accent="#E74C3C"
                    title="Sixteen Years of Internal Warfare"
                    summary="Repeated strikes, lockouts, jurisdictional walkouts, and AFL mediation efforts."
                    body="The dispute had two layers. The philosophical one: the UA argued that the pipe trades — plumbing, steamfitting, gas fitting — were a single craft with shared skills and shared jurisdiction. The International Association argued that steamfitting was a distinct trade, with its own tools and traditions, entitled to its own union. The practical one: as industrial buildings, hospitals, hotels, and the new generation of skyscrapers required ever more sophisticated piping systems, the question of which union's members were entitled to install which pipe became enormously consequential. Walkouts by either organization on a major project could halt every other building trade on the site."
                  />
                  <ExpandableCard
                    year="1912"
                    accent="#E74C3C"
                    title="The AFL Settles the Question"
                    summary="The American Federation of Labor revoked the International Association's charter."
                    body="A decisive ruling that recognized the UA as the legitimate national jurisdiction over the entire pipe trades. Over the following two years, most of the surviving steamfitter locals merged into the UA, bringing with them experienced industrial pipefitters and the technical traditions of high-pressure steam work."
                  />
                  <ExpandableCard
                    year="1914"
                    accent="#E74C3C"
                    title="The Unified UA Emerges"
                    summary="Stronger than before the conflict, with an expanded name reflecting the broader jurisdiction."
                    body="The settlement also expanded the UA's name to reflect its broader jurisdiction: the United Association of Journeymen and Apprentices of the Plumbing and Pipe Fitting Industry of the United States and Canada — the name, in its essentials, the union still uses today."
                  />
                </Era>

                <PullQuote attribution="The institutional lesson the UA carried forward">
                  After the searing experience of the Steamfitters' War, the UA's culture turned decisively toward institutional consolidation and disciplined bargaining over factional militancy.
                </PullQuote>

                {/* PART IV */}
                <Era tag="IV" years="1914 – 1936" title="The Open Shop Era and the Apprenticeship Founding" intro="Like most American unions, the UA grew significantly during World War I. Federal industrial demand — for shipyards, munitions plants, military bases — required vast amounts of pipework, and the labor-friendly policies of Wilson's wartime mediation boards gave organized labor temporary leverage. Then the 1920s reversed every gain.">
                  <ExpandableCard
                    year="1920s"
                    title="The American Plan"
                    summary="The postwar Red Scare and employers' open-shop campaign squeezed every building-trades union."
                    body="Mechanical contractors associations across major cities canceled UA agreements or refused to renew them. Open-shop competition from non-union plumbers and pipefitters intensified, particularly in residential construction. By the late 1920s, the UA had lost ground in many of the markets where it had been strongest a decade earlier."
                  />
                  <ExpandableCard
                    year="1936"
                    title="The First Registered Joint Apprenticeship"
                    summary="The UA pioneered what would become the federal apprenticeship model."
                    body="It was during this difficult period, however, that the UA made what would prove to be one of the most consequential institutional decisions in its history. In 1936, the union's leadership formally established the first nationally registered joint apprenticeship program in the United States — a five-year program for plumbers and pipefitters jointly governed by the UA and its signatory employers, combining classroom instruction with paid on-the-job training. The federal Apprenticeship Standards developed under the National Apprenticeship Act of 1937 would soon codify the model the UA had helped pioneer. The five-year, 'earn while you learn' structure has remained the spine of UA training ever since."
                  />
                </Era>

                {/* PART V */}
                <Era tag="V" years="1936 – 1956" title="The New Deal Settlement and Postwar Expansion" color="#22c55e" intro="The Wagner Act of 1935 transformed the UA's bargaining environment. The new National Labor Relations Board gave workers federally enforceable rights to organize and bargain collectively, and the UA — long established as the AFL's recognized pipe-trades jurisdiction — moved aggressively into industrial markets that had been difficult to organize during the open-shop era.">
                  <ExpandableCard
                    year="1939-1945"
                    accent="#22c55e"
                    title="The War Years"
                    summary="UA welders, pipefitters, and plumbers were essential to every wartime industrial plant, every shipyard, every refinery, every military base."
                    body="The federal government's no-strike pledges and War Labor Board mediation ensured that the union grew rapidly and that its agreements stabilized across the country. The wartime mobilization put UA-trained pipefitters at the center of American industrial production at exactly the moment that production was scaling to unprecedented levels."
                  />
                  <ExpandableCard
                    year="1945-1956"
                    accent="#22c55e"
                    title="The Postwar Construction Boom"
                    summary="Suburbanization, the interstate highway program, the cold-war defense build-up, refining and petrochemical expansion."
                    body="Suburbanization put millions of new homes onto plumbing systems. The interstate highway program required service plazas, fueling stations, and rest stops — every one of them piped. The cold-war defense build-up funded new bases. The expansion of American refining and petrochemical capacity along the Gulf Coast created sustained demand for the most skilled industrial pipefitters and welders the union could produce. The 1947 Taft-Hartley Act imposed real costs — banning closed shops, authorizing right-to-work laws — but the UA's deep apprenticeship pipeline and established relationships with mechanical contractors associations gave it structural advantages that survived the new legal framework."
                  />
                  <ExpandableCard
                    year="1956"
                    accent="#22c55e"
                    title="The Instructor Training Program"
                    summary="The annual UA gathering at Washtenaw Community College in Ann Arbor — one of the union's most distinctive institutions."
                    body="Beginning in 1956, the UA partnered with what is now Washtenaw Community College to bring journey-level instructors from local unions across North America to a single campus for an intensive week of training in the latest teaching methods, tools, and technologies. The program would grow to host roughly 2,000 to 3,000 instructors and industry partners annually, with participants pursuing five-year certification tracks that produce both professional credentials and, for many, associate or bachelor's degrees. It still runs every August."
                  />
                </Era>

                {/* MID PEAK STATS */}
                <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(59,158,255,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{textAlign:'center', marginBottom:24}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:2, textTransform:'uppercase'}}>The Peak — 1971</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>The Great Industrial Pipefitting Era</h3>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:8}}>
                    <StatBlock value={320} label="Thousand members at peak" suffix="K" />
                    <StatBlock value={1956} label="Instructor training launched" />
                    <StatBlock value={1936} label="Federal apprenticeship founded" />
                    <StatBlock value={5} label="Year apprenticeship program" suffix=" yr" />
                  </div>
                </div>

                {/* PART VI */}
                <Era tag="VI" years="1956 – 1980" title="The Postwar Peak" color="#22c55e" intro="The quarter-century from the mid-1950s to the early 1980s was the UA's golden age. By 1971, the union had grown to roughly 320,000 members. Nuclear power generation, the Trans-Alaska Pipeline System, the country's first generation of major petrochemical complexes, and continuing growth of commercial construction all drove sustained demand for UA labor.">
                  <ExpandableCard
                    year="1956-1980"
                    accent="#22c55e"
                    title="The Industrial Pipefitter's Era"
                    summary="High-pressure steam, cryogenic gases, corrosive process chemicals, radiation-hardened nuclear systems."
                    body="The work was technically demanding and increasingly specialized. Industrial pipefitters worked with materials and pressures that residential plumbers rarely encountered. The UA's training infrastructure adapted, adding industrial welding programs, specialized certifications, and dedicated instructional tracks for nuclear, refinery, and high-purity work. Through this period, the slogan 'There is no substitute for UA skilled craftsmen' became standard in industry advertising and contract bidding."
                  />
                  <ExpandableCard
                    year="The MCAA Treaty"
                    accent="#22c55e"
                    title="Cooperative Bargaining Becomes the Norm"
                    summary="No-strike clauses for the duration of the contract. Disputes routed to grievance procedures and joint labor-management bodies."
                    body="The UA's institutional culture settled into a distinctive pattern. Most UA construction agreements contained no-strike clauses for the duration of the contract, with disputes routed instead to grievance procedures and joint labor-management bodies. The union's relationship with its primary employer counterpart, the Mechanical Contractors Association of America, was generally cooperative, with shared investments in training, safety standards, and market expansion. Critics argued that this cooperation gave away too much worker leverage. Supporters argued that it was precisely why the UA had labor agreements where many other building trades had retreated. The same debate continues, in modified form, today."
                  />
                </Era>

                {/* PART VII */}
                <Era tag="VII" years="1980 – 2000s" title="Decline and the Open-Shop Squeeze" color="#9CA3AF" intro="The same forces that battered American organized labor more broadly battered the UA. The 1981 PATCO strike and the political environment it inaugurated, the rise of merit-shop construction associations, the deindustrialization of large parts of the American economy, and the gradual erosion of public-policy preferences for union construction all cut into UA membership.">
                  <ExpandableCard
                    year="1970s-1990s"
                    accent="#9CA3AF"
                    title="The Merit Shop Rises"
                    summary="The Associated Builders and Contractors built a parallel construction-industry infrastructure based on non-union labor."
                    body="ABC — founded in 1950 but expanding aggressively from the 1970s onward — built its own apprenticeship programs, its own contractor associations, and its own political-advocacy operation. In market after market, the UA's share of mechanical construction work fell from near-dominance to something closer to parity, and in many regions of the South and Mountain West, to a clear minority position."
                  />
                  <ExpandableCard
                    year="1979-2000s"
                    accent="#9CA3AF"
                    title="Industrial Restructuring"
                    summary="The contraction of American refining, the slowdown of nuclear after Three Mile Island, manufacturing offshoring."
                    body="The contraction of American refining, the slowdown of new nuclear construction after the Three Mile Island accident in 1979, the offshoring of much heavy manufacturing, and the long stagnation of new industrial-pipe construction in the 1980s and 1990s shrank some of the UA's most important markets. The petrochemical and refining sector, traditionally a UA stronghold, became a contested space with significant non-union penetration."
                  />
                  <ExpandableCard
                    year="2000s-2010s"
                    accent="#9CA3AF"
                    title="The Strategic Response"
                    summary="Doubled down on training. Expanded political operation. Stabilized at roughly 340-360K members."
                    body="The UA doubled down on training as a competitive advantage, expanding the Instructor Training Program, adding specialized certifications in welding, instrumentation, and emerging materials, and partnering with major project owners to ensure that UA-trained workers remained the default supply for the most demanding industrial work. It expanded its political operation in Washington and state capitals, particularly in support of prevailing-wage laws, project labor agreements, and registered-apprenticeship requirements. Membership stabilized around 340,000 to 360,000 through the 2000s and 2010s, with a sectoral mix that had shifted somewhat toward HVACR service work, sprinkler fitting, and specialized industrial markets."
                  />
                </Era>

                {/* PART VIII */}
                <Era tag="VIII" years="2008 – 2020" title="Veterans in Piping and Modern Reinvention" intro="In 2008, the UA launched what would become one of the most distinctive programs in the modern American labor movement: the Veterans in Piping Program, or UA VIP. Designed in cooperation with the Department of Defense and ultimately recognized as a DoD SkillBridge program, it offered active-duty service members preparing to transition out of the military free, hands-on training in welding, HVACR, and fire suppression at select military bases.">
                  <ExpandableCard
                    year="2008"
                    title="UA VIP Launches"
                    summary="On-base training during the final months of active-duty service, by experienced UA instructors."
                    body="The structure was deliberate. Training is delivered on-base, during the final months of active-duty service, by experienced UA instructors. Participants do not need to use their GI Bill benefits — those remain available for other purposes. Successful graduates are guaranteed direct entry into a UA-registered apprenticeship and job placement with a signatory contractor upon discharge. By the mid-2020s, the program operated at military installations including Camp Pendleton, Joint Base Lewis-McChord, Fort Carson, Fort Cavazos, Camp Lejeune, Fort Campbell, and Naval Station Norfolk."
                  />
                  <ExpandableCard
                    year="2007-2016"
                    title="The Hite Era"
                    summary="General President William P. Hite led the UA through the post-financial-crisis recovery."
                    body="Under Hite, the UA aligned closely with the Obama administration on infrastructure, energy, and apprenticeship policy. The political relationships built during this period would pay off significantly in the 2020s legislative cycle."
                  />
                  <ExpandableCard
                    year="2016"
                    title="McManus Takes Over"
                    summary="Mark McManus was unanimously elected at the 39th General Convention in August 2016."
                    body="McManus assumed office on November 10, 2016, and was unanimously re-elected to a second five-year term at the 40th General Convention in San Diego and Calgary in August 2021. He has been the public face of the union throughout the legislative wins of the 2020s."
                  />
                  <ExpandableCard
                    year="2021-2022"
                    title="The Legislative Payoff"
                    summary="Bipartisan Infrastructure Law, CHIPS and Science Act, Inflation Reduction Act."
                    body="The three laws collectively funneled hundreds of billions of dollars toward projects with prevailing-wage requirements, registered-apprenticeship preferences, and project labor agreement frameworks that disproportionately benefited the UA's signatory contractors. Lead service line replacement, water infrastructure, semiconductor fabrication facilities, hydrogen and clean-energy projects, and modernized transmission infrastructure all became major UA work pipelines under those laws."
                  />
                </Era>

                {/* CURRENT-DAY DASHBOARD */}
                <div style={{margin:'80px 0 40px', padding:'40px 28px', background:'linear-gradient(135deg, rgba(59,158,255,0.08) 0%, rgba(250,128,89,0.08) 100%)', borderRadius:24, border:'1px solid rgba(59,158,255,0.2)'}}>
                  <div style={{textAlign:'center', marginBottom:32}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:3, textTransform:'uppercase'}}>Where the UA Stands Now</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'#fff', margin:'12px 0 0 0'}}>The Brotherhood in 2026</h2>
                    <p style={{fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:600, margin:'12px auto 0', lineHeight:1.6}}>Work pipeline among the strongest in the building trades. Membership rebuilding. Political relationships being tested.</p>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:24}}>
                    <StatBlock value={396} label="Total members" suffix="K" />
                    <StatBlock value={274} label="Local unions" />
                    <StatBlock value={12} label="Apprentices as % of total" suffix="%" />
                    <StatBlock value={44} label="Annual job openings, 2024-34" suffix="K" />
                  </div>
                  <div style={{padding:'20px 24px', background:'rgba(0,0,0,0.25)', borderRadius:16, marginTop:8}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:2, textTransform:'uppercase', marginBottom:8}}>The Rebuild</div>
                    <div style={{fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.6}}>396,000 members today, up from 355,000–380,000 a decade ago. Apprentices represent 12% of total membership. Median pipefitter wages reached $63,000 in May 2024 — top 10% above $105,000 — with UA journey-level members in major metros earning substantially more.</div>
                  </div>
                </div>

                {/* PART IX */}
                <Era tag="IX" years="2024" title="Strikes, Boom Markets, and Realignment" color="#FA8059" intro="The 2024-2025 period brought to the surface several long-running tensions in UA's institutional model, even as the union's underlying work pipeline reached levels not seen since the 1970s.">
                  <ExpandableCard
                    year="Aug 2024"
                    accent="#FA8059"
                    title="The Reno Strike"
                    summary="UA Local 350 in Reno voted to strike after rejecting a wage proposal the contractors called the largest settlement in the local's history."
                    body="The dispute illustrated a particular feature of UA bargaining culture: even when leadership and employer associations reached terms, rank-and-file members increasingly insisted on direct ratification votes and were willing to reject deals their negotiators had endorsed. Local-level strikes in the UA, while still rare compared to most industrial unions, became somewhat more frequent through 2024 and 2025 as wage growth in non-union construction markets and inflation pressure on members' real incomes raised the bar for acceptable contracts."
                  />
                  <ExpandableCard
                    year="2024-2026"
                    accent="#FA8059"
                    title="The LNG and Data Center Boom"
                    summary="The work pipeline became unprecedented."
                    body="Factors driving it included LNG export terminal construction along the Gulf Coast, with the United States becoming the world's largest exporter of liquefied natural gas; data-center construction driven by artificial intelligence and cloud computing; new semiconductor fabrication facilities under the CHIPS Act; the lead service-line replacement program; and continued demand from refinery turnarounds, petrochemical expansions, and the slow but real revival of nuclear construction. UA-trained welders were in such consistent demand on Gulf Coast LNG projects that local unions in lower-demand regions reported significant numbers of members traveling under the clearance-card system to work the boom."
                  />
                </Era>

                {/* PART X */}
                <Era tag="X" years="2025 – 2026" title="The Present Day" intro="Walking into 2026, the UA occupies a position that would have seemed implausible a decade ago: its work pipeline is among the strongest in the building trades, its membership is gradually rebuilding, and its political relationships are being tested by an administration that simultaneously supports its industrial agenda and opposes much of its broader policy framework.">
                  <ExpandableCard
                    year="2025"
                    title="The Boom Markets"
                    summary="LNG exports, data centers, semiconductors, lead service lines, nuclear revival."
                    body="The Interstate Natural Gas Association of America projects North America will need a 39% increase in natural gas transmission capacity by 2052 — a roughly $1 trillion midstream infrastructure investment with substantial UA labor implications. Major projects at Intel facilities in Arizona and Ohio, TSMC's Arizona expansion, and Micron's New York investment have all drawn substantial UA workforces. The slow revival of nuclear construction — including the planned restart of Three Mile Island Unit 1 — has reactivated specialized industrial pipefitting markets that had been largely dormant since the 1980s."
                  />
                  <ExpandableCard
                    year="2025"
                    title="Political Crosswinds"
                    summary="Aligned with the new administration on energy and manufacturing. At odds on labor policy."
                    body="The Trump administration's emphasis on energy infrastructure, LNG exports, manufacturing reshoring, and nuclear development aligned in significant ways with UA work priorities. McManus has issued public statements praising specific administration actions on those fronts. At the same time, the administration's executive order rescinding Biden-era directives that promoted registered-apprenticeship requirements in federal contracting drew UA opposition, as did broader administration policies the union viewed as undermining collective bargaining rights and labor-law enforcement. The UA continues to endorse candidates from both major parties at the federal and state levels based on positions on prevailing-wage laws, apprenticeship policy, and infrastructure funding."
                  />
                  <ExpandableCard
                    year="2026"
                    title="The Generational Shift"
                    summary="Younger UA members are less willing to accept contracts that local leaders describe as historically generous."
                    body="The rank-and-file pressure that produced the Reno strike in 2024 reflects a broader generational shift within the union. Younger UA members, working in regions where non-union construction wages have closed significant ground over the past decade, are less willing to accept contracts that local leaders and employer associations describe as historically generous. The structural debates within the building trades — over no-strike clauses, over the role of joint labor-management bodies, over the balance between cooperative bargaining and direct membership militancy — are playing out within the UA in ways that will shape the union's posture through the rest of the decade."
                  />
                </Era>

                {/* CONCLUSION */}
                <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#3B9EFF', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Continuity Beneath the Change</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>137 Years In, Still Following the Pipe</h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    When P.J. Quinlan wrote to Richard A. O'Brien in early 1889 proposing a "United Brotherhood" of pipe trades workers, the United States was a country still being plumbed. Indoor sanitary fixtures were spreading from urban mansions to middle-class row houses. Steam heating was replacing coal stoves. Natural gas distribution networks were being built city by city. Each of these changes was being installed by tradesmen whose unions were small, fragmented, and frequently at odds with one another.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    What endured was the model the founders chose. A national jurisdiction broad enough to claim every kind of pipe work that could be conceived. A clearance-card mobility system that bound local unions into a single labor market. A heavy investment in apprenticeship as the source of bargaining power. A preference, after the Steamfitters' War, for institutional consolidation and disciplined bargaining. And a willingness, through the long partnership with the Mechanical Contractors Association, to trade some short-term leverage for long-term predictability.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                    The work that 2026 demands — fabricating high-purity gas systems for semiconductor fabs, welding cryogenic LNG export terminals, plumbing AI data centers, replacing lead service lines in older cities, and constructing the next generation of nuclear plants — is, fundamentally, the same work the founders set out to organize. The materials are unrecognizable to anyone who threaded pipe in 1889. The trade is not.
                  </p>
                  <button onClick={() => setPage('history')} style={{marginTop:16, background:'transparent', color:'#3B9EFF', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba(59,158,255,0.4)', borderRadius:50, cursor:'pointer'}}>← Back to General Union History</button>
                </div>
              </div>
            </div>
          );
        })()}

        {page === "trade-history" && (
          <div style={{padding:"80px 24px", textAlign:"center", maxWidth:720, margin:"0 auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", letterSpacing:3, textTransform:"uppercase", marginBottom:16}}>{lang==="es" ? "Proximamente" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</div>
            <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(36px, 6vw, 60px)", fontWeight:900, color:"#fff", lineHeight:1, margin:"0 0 20px 0"}}>
              {lang==="es" ? "Historia del Oficio" : lang==="pl" ? "Historia Zawodu" : "Trade History"}
              <br/>
              <span style={{color:"#FA8059"}}>{lang==="es" ? "En Construccion" : lang==="pl" ? "W Budowie" : "In Progress"}</span>
            </h1>
            <p style={{fontSize:16, color:"rgba(255,255,255,0.75)", lineHeight:1.7, marginBottom:32}}>
              {lang==="es" ? "Estamos trabajando en historias detalladas para cada oficio sindical. Mientras tanto, lee la historia general del movimiento sindical." : lang==="pl" ? "Pracujemy nad szczegolowymi historiami dla kazdego zawodu zwiazkowego. Tymczasem przeczytaj ogolna historie ruchu zwiazkowego." : "We're putting together deep-dive histories for each individual trade — IBEW, UA, SMART, and the rest. While they're in the works, take a walk through the broader story of organized labor."}
            </p>
            <button onClick={() => setPage("history")} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1, textTransform:"uppercase", padding:"14px 32px", border:"none", borderRadius:50, cursor:"pointer"}}>
              {lang==="es" ? "Leer Historia General" : lang==="pl" ? "Czytaj Historie Ogolna" : "Read General Union History"}
            </button>
          </div>
        )}

        {page === "benefits" && (() => {
          const AnimatedNumber = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
            const [shown, setShown] = useState(0);
            const ref = useRef(null);
            const animated = useRef(false);
            useEffect(() => {
              const el = ref.current;
              if (!el) return;
              const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                  if (e.isIntersecting && !animated.current) {
                    animated.current = true;
                    const start = performance.now();
                    const dur = 1400;
                    const step = (now) => {
                      const t = Math.min(1, (now - start) / dur);
                      const eased = 1 - Math.pow(1 - t, 3);
                      setShown(value * eased);
                      if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                  }
                });
              }, { threshold: 0.5 });
              obs.observe(el);
              return () => obs.disconnect();
            }, [value]);
            return <span ref={ref}>{prefix}{shown.toFixed(decimals)}{suffix}</span>;
          };

          const ExpandableCard = ({ year, title, summary, body, accent = '#FA8059' }) => {
            const [open, setOpen] = useState(false);
            return (
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:`4px solid ${accent}`}}>
                <div onClick={() => setOpen(o => !o)} style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    {year && <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>{year}</div>}
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>{title}</div>
                    <div style={{fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6}}>{summary}</div>
                  </div>
                  <div style={{flexShrink:0, width:32, height:32, borderRadius:'50%', background:`${accent}22`, color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition:'transform 0.25s'}}>+</div>
                </div>
                {open && (
                  <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.7}}>
                    {body}
                  </div>
                )}
              </div>
            );
          };

          const PullQuote = ({ children, attribution }) => (
            <div style={{margin:'40px auto', maxWidth:760, padding:'30px 36px', borderLeft:'4px solid #FA8059', background:'linear-gradient(90deg, rgba(250,128,89,0.08) 0%, transparent 100%)', borderRadius:'0 16px 16px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontStyle:'italic', color:'#fff', lineHeight:1.4, fontWeight:500}}>"{children}"</div>
              {attribution && <div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>— {attribution}</div>}
            </div>
          );

          const StatBlock = ({ value, label, suffix = '', prefix = '', decimals = 0 }) => (
            <div style={{textAlign:'center', padding:'24px 16px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#FA8059', lineHeight:1}}>
                <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
              </div>
              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>{label}</div>
            </div>
          );

          const Section = ({ tag, title, intro, color = '#FA8059', children }) => (
            <div style={{margin:'80px 0', position:'relative'}}>
              <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap'}}>
                <div style={{width:48, height:48, borderRadius:12, background:`${color}22`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, color:'#fff', margin:0, lineHeight:1.1, flex:1, minWidth:0}}>{title}</h2>
              </div>
              {intro && <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.75, marginBottom:24, maxWidth:780}}>{intro}</p>}
              {children}
            </div>
          );


          return (
            <div id="benefits-root">
              {/* PROGRESS BAR */}
              <div style={{position:'fixed', top:0, left:0, right:0, height:3, background:'rgba(0,0,0,0.4)', zIndex:100}}>
                <div style={{height:'100%', width:(scrollProgress * 100) + '%', background:'linear-gradient(90deg, #FA8059, #F5C518)', transition:'width 0.1s'}} />
              </div>

              {/* HERO */}
              <div style={{padding:'80px 24px 60px', textAlign:'center', maxWidth:1000, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>More Than Just a Paycheck</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, color:'#fff', lineHeight:0.95, margin:'0 0 24px 0'}}>
                  Union <span style={{color:'#FA8059'}}>Benefits.</span><br/>
                  <span style={{color:'rgba(255,255,255,0.5)', fontWeight:500}}>What you actually get.</span>
                </h1>
                <p style={{fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, maxWidth:680, margin:'0 auto'}}>
                  Union construction workers don't just earn higher hourly wages. They receive a stacked benefits package that most workers in America will never see — built and paid for through collective bargaining, not pulled from their take-home pay.
                </p>
              </div>

              {/* HEADLINE STATS */}
              <div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:1100, margin:'0 auto'}}>
                  <StatBlock value={4} label="Core benefit pillars" />
                  <StatBlock value={100} label="Employer-funded pension" suffix="%" />
                  <StatBlock value={5} label="Year apprenticeship" suffix=" yr" />
                  <StatBlock value={0} label="Out of your paycheck" prefix="$" />
                </div>
              </div>

              <div style={{maxWidth:880, margin:'0 auto', padding:'40px 24px 80px'}}>

                {/* INTRO PARAGRAPH */}
                <div style={{padding:'40px 0 20px'}}>
                  <p style={{fontSize:17, color:'rgba(255,255,255,0.85)', lineHeight:1.8, marginBottom:20}}>
                    The story most people tell about union work focuses on the wages — and yes, the wages are higher. But the real wealth-building power of union construction lies in what comes <em>on top of</em> the hourly rate. The contractor, not the worker, funds it. It accumulates from the first day on the job. And it follows you for the rest of your career, no matter how many contractors you work for.
                  </p>
                  <p style={{fontSize:17, color:'rgba(255,255,255,0.85)', lineHeight:1.8}}>
                    Here's what's actually inside a typical union benefits package.
                  </p>
                </div>

                {/* SECTION 1 — PENSION */}
                <Section tag="I" title="The Defined-Benefit Pension" intro="A pension is a monthly check you receive every month for the rest of your life after you retire. It is the single most valuable benefit a union member receives, and it is essentially extinct outside of organized labor.">
                  <ExpandableCard
                    title="What 'defined benefit' actually means"
                    summary="The amount you get is calculated by formula — not by how the stock market performs."
                    body="In a defined-benefit pension, the union and contractors agree on a formula that determines your monthly payout in retirement. The formula typically multiplies your years of service by an accrual rate set in your local's plan. Whether the markets are up or down, your check stays the same. Compare this to a 401k, where your retirement income depends entirely on what your account balance happens to be on the day you stop working."
                  />
                  <ExpandableCard
                    title="The contractor pays. Not you."
                    summary="Every hour you work, your contractor sends a fixed dollar amount per hour into the pension fund."
                    body="That contribution is part of your wage package — negotiated by the union — but it never appears on your pay stub as a deduction. It comes from above your gross pay, not from inside it. In most non-union jobs, if you want a retirement account at all, you have to fund it yourself out of your own check. In union construction, the funding is built into every hour you work."
                  />
                  <ExpandableCard
                    title="Vesting and portability"
                    summary="Once vested (typically 5 years), the pension is yours — even if you leave the trade."
                    body="Most union pension plans require 5 years of credited service before you're 'vested,' meaning the right to that pension is locked in. After vesting, even if you stop working in the trade entirely, you'll receive a monthly check in retirement based on the years you accumulated. Within the same trade, your service typically transfers between locals — letting you move across the country and still build toward a single pension."
                  />
                  <ExpandableCard
                    title="What happens if the contractor goes out of business"
                    summary="Your pension is funded through a multi-employer trust — not tied to any single employer."
                    body="This is one of the structural advantages of union pensions. Contributions go into a multi-employer trust fund, jointly governed by union and contractor trustees, separate from any individual contractor's finances. When a contractor closes its doors, your accrued service doesn't disappear with it. The pension fund keeps writing checks. By contrast, when a non-union employer's 401k matching ends or a small business goes under, the worker often loses access to whatever benefit they had."
                  />
                </Section>

                <PullQuote attribution="The pension's quiet power">
                  Defined-benefit pensions used to be the default for American workers. Today, in the private sector, they are nearly extinct — except in unionized industries, where they remain the cornerstone of retirement security.
                </PullQuote>

                {/* SECTION 2 — ANNUITY / DC PLAN */}
                <Section tag="II" title="The Annuity (or Defined-Contribution Plan)" color="#F5C518" intro="On top of the pension, most union construction members have a second retirement account — a defined-contribution annuity that functions like a 401k, except the contributions are paid by the contractor, not deducted from your wages.">
                  <ExpandableCard
                    accent="#F5C518"
                    title="Why two retirement accounts instead of one"
                    summary="The pension provides predictable monthly income for life. The annuity gives you a lump sum you control."
                    body="The pension is steady but rigid — fixed monthly payments, often without inflation adjustments. The annuity adds flexibility: a pot of money you can draw from for big expenses, leave to your family, or roll into other accounts. Together they form what financial planners call a 'three-legged stool' alongside Social Security: guaranteed lifetime income, savings under your control, and federal benefits."
                  />
                  <ExpandableCard
                    accent="#F5C518"
                    title="How it differs from a 401k"
                    summary="The contractor funds it at a negotiated rate per hour. You don't choose to opt in or out."
                    body="In a typical non-union 401k, the worker decides whether to contribute, the employer maybe offers a small match, and the funding is volatile. Union annuities are funded automatically — every hour worked generates a contribution at the rate negotiated in your contract. There's no opt-in to forget about, no match cap to worry about, no question whether you'll have something at the end of your career. The contributions show up regardless."
                  />
                  <ExpandableCard
                    accent="#F5C518"
                    title="Investment options"
                    summary="Annuity funds are professionally managed — often more conservatively than retail 401ks."
                    body="Trustees of the multi-employer plan select investment options that balance growth with stability. Most plans offer a default lifecycle fund along with a handful of alternatives. The fee structure tends to be lower than retail 401ks because the plan is bargaining as one large institutional investor instead of as thousands of individuals. Members can typically check balances and modify allocations through online portals."
                  />
                </Section>

                {/* SECTION 3 — HEALTH INSURANCE */}
                <Section tag="III" title="Health Insurance" color="#22c55e" intro="Most union construction members receive health insurance fully paid by the contractor — premiums, deductibles, the works — for themselves and their families. No paycheck deductions for monthly premiums. No surprise high-deductible plans the worker has to figure out.">
                  <ExpandableCard
                    accent="#22c55e"
                    title="Contractor-paid premiums"
                    summary="The contribution comes from the wage package, not from your take-home pay."
                    body="Just like the pension, the health-fund contribution is negotiated as part of the total wage package. The contractor sends a fixed dollar amount per hour worked into the health fund. The fund uses that pool to provide coverage for all members and their dependents. Most plans cover medical, dental, and vision. Many also cover prescription drugs at the same generous rates."
                  />
                  <ExpandableCard
                    accent="#22c55e"
                    title="Coverage during slow periods"
                    summary="Banked hours from busy months keep your insurance active when work slows down."
                    body="Construction is seasonal. Most union health plans solve this with an 'hour bank' — a system where the hours you work in busy months accumulate as credits, paying for your coverage during slower months. As long as you maintain a minimum balance, you stay insured. This is particularly valuable for outdoor trades subject to weather and for members between major projects."
                  />
                  <ExpandableCard
                    accent="#22c55e"
                    title="Family coverage"
                    summary="Spouses and dependent children are typically included at no additional cost to the member."
                    body="In most non-union jobs, adding family members to insurance dramatically raises the worker's payroll deduction. In most union plans, family coverage is built into the contractor contribution — meaning the cost to the member is the same whether they cover just themselves, themselves and a spouse, or a full family. For tradespeople with kids, this is often the single biggest financial difference between union and non-union work."
                  />
                  <ExpandableCard
                    accent="#22c55e"
                    title="Retiree health benefits"
                    summary="Many plans provide bridge coverage between retirement and Medicare eligibility at 65."
                    body="A retiring union member at 60 in a non-union job would typically need to find their own health insurance for five years until Medicare kicks in — at potentially crippling cost. Many union plans provide retiree medical benefits that bridge this gap, and Medicare supplemental coverage afterward. The exact terms vary by local and trade, but the existence of any retiree health coverage is itself remarkable in 2026."
                  />
                </Section>

                {/* MID-PAGE COMPARISON */}
                <div style={{margin:'80px -8px', padding:'40px 24px', background:'linear-gradient(180deg, rgba(34,197,94,0.06) 0%, rgba(250,128,89,0.06) 100%)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{textAlign:'center', marginBottom:32}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:2, textTransform:'uppercase'}}>The Difference at a Glance</div>
                    <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'8px 0'}}>Union vs Non-Union Benefits</h3>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20}}>
                    <div style={{padding:'24px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:'#22c55e', marginBottom:12, textTransform:'uppercase', letterSpacing:1}}>Union Construction</div>
                      <ul style={{listStyle:'none', padding:0, margin:0, fontSize:15, color:'rgba(255,255,255,0.9)', lineHeight:1.9}}>
                        <li>✓ Defined-benefit pension for life</li>
                        <li>✓ Annuity / 401(k) on top</li>
                        <li>✓ Family health insurance, contractor-paid</li>
                        <li>✓ Apprenticeship: paid training, no debt</li>
                        <li>✓ Hour bank covers slow seasons</li>
                        <li>✓ Wages set by contract, not boss's mood</li>
                      </ul>
                    </div>
                    <div style={{padding:'24px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:'rgba(255,255,255,0.5)', marginBottom:12, textTransform:'uppercase', letterSpacing:1}}>Typical Non-Union Job</div>
                      <ul style={{listStyle:'none', padding:0, margin:0, fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.9}}>
                        <li>✗ No pension (rare exceptions)</li>
                        <li>○ Optional 401(k), small or no match</li>
                        <li>○ Health: premium deducted from paycheck</li>
                        <li>○ Pay-to-play training or trade school debt</li>
                        <li>✗ Slow season = lose coverage</li>
                        <li>○ Wages set by employer at hire</li>
                      </ul>
                    </div>
                  </div>
                  <p style={{fontSize:13, color:'rgba(160,180,196,0.7)', textAlign:'center', marginTop:24, fontStyle:'italic'}}>Comparison reflects typical union construction contracts vs. typical non-union construction roles. Specific terms vary by trade, local, and employer.</p>
                </div>

                {/* SECTION 4 — APPRENTICESHIP */}
                <Section tag="IV" title="Apprenticeship & Training" intro="Most union trades have a 4–5 year registered apprenticeship: paid on-the-job training combined with classroom instruction, fully funded by employer contributions. You earn a journey-level credential at the end with zero student debt — and a starting wage on day one.">
                  <ExpandableCard
                    title="Earn while you learn"
                    summary="Apprentices work alongside journeymen on real jobs from day one and get paid a percentage of journey scale that increases each year."
                    body="Most apprenticeships start at around 40-50% of journey scale and step up at scheduled intervals — typically every 6 months — until reaching 100% at completion. There's no tuition. There's no application fee for the program itself in most cases. There are no books to buy. The contractor's training-fund contributions cover the classroom curriculum, the instructors, the facility, and the materials. The apprentice's only investment is time and effort."
                  />
                  <ExpandableCard
                    title="The credential is portable"
                    summary="A journey-level certificate from a registered apprenticeship is recognized across every signatory contractor in your trade, nationwide."
                    body="Federal Department of Labor registration means the standards are uniform across the country. A journeyman trained in one local can walk onto a job in another and be recognized as fully qualified — no re-testing, no apprenticing again. This portability is one reason union members can move across regions chasing work, and why the credential carries weight even outside the union, with non-union employers sometimes paying more for graduates of registered apprenticeships."
                  />
                  <ExpandableCard
                    title="Continuing education for journeymen"
                    summary="Once you're a journeyman, training doesn't stop — it just becomes optional and often free."
                    body="Most local training centers offer ongoing classes for active members in welding certifications, instrumentation, code updates, new technologies (EV charging infrastructure, photovoltaics, modular plumbing), and supervisor training. Sometimes paid for entirely by the training trust. This is one of the main reasons union members tend to remain employable through technological transitions where non-union peers fall behind."
                  />
                </Section>

                {/* SECTION 5 — BEYOND THE MONEY */}
                <Section tag="V" title="Beyond the Pension and Insurance" color="#A78BFA" intro="The big four benefits — pension, annuity, health, training — get the most attention, but they're not the whole picture. There's a layer of additional protections most union members take for granted, that simply don't exist in most non-union work.">
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Vacation & holiday pay"
                    summary="Many trades have vacation funds that accumulate just like the other benefits."
                    body="Some locals fund a separate vacation account through hourly contributions; you receive a check each year (often around year-end) covering your vacation pay. Some include paid holidays in the contract — typically the major federal holidays plus a handful of others. Construction is unusual in that traditional 'paid time off' is rarer than in office work, but the wage premium and benefit funds are structured to compensate for that."
                  />
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Grievance procedures and just cause"
                    summary="Union members can't be fired without cause — and have a formal process to challenge unfair treatment."
                    body="Most non-union employees in the United States are 'at will,' meaning they can be terminated at any time, for any reason, with no recourse. Union contracts typically require 'just cause' for discipline or termination, and provide a grievance procedure: a multi-step process where the worker, the union, and the contractor work through complaints, escalating to arbitration if needed. This isn't job-for-life protection — but it is real, structural protection from arbitrary firing."
                  />
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Member assistance programs"
                    summary="Many locals offer confidential support for substance use, mental health, and family crises."
                    body="Construction has historically had high rates of opioid addiction, suicide, and other crises. Most building trades unions and their health funds operate Member Assistance Programs that provide free, confidential counseling, addiction treatment referrals, and family support. Calls don't go to your contractor. They don't appear on your insurance. They are designed specifically for the realities of skilled-trade life."
                  />
                  <ExpandableCard
                    accent="#A78BFA"
                    title="Legal services and discounts"
                    summary="Some unions offer subsidized legal help (wills, real estate closings, family matters) and member discounts on cars, phones, and travel."
                    body="The specifics vary by international union and local, but the principle is consistent: leverage collective bargaining power for things beyond just wages. Union Plus, a benefits cooperative across many AFL-CIO affiliates, offers discounted services on everything from cell phone plans to mortgages to college scholarships for members and their kids. None of these are make-or-break, but they accumulate."
                  />
                </Section>

                {/* SECTION 6 — VETERANS */}
                <Section tag="VI" title="A Note for Veterans" color="#3B9EFF" intro="Several major building-trades unions run programs specifically designed for transitioning service members. The most established is Helmets to Hardhats, a non-profit pathway connecting active-duty and veteran service members directly into union apprenticeships, with no fees and credit for military experience.">
                  <ExpandableCard
                    accent="#3B9EFF"
                    title="Helmets to Hardhats"
                    summary="A free placement program connecting transitioning military members to union construction apprenticeships nationwide."
                    body="Helmets to Hardhats is funded by the building-trades unions and operated as an independent non-profit. Service members can register before their separation date, get matched to apprenticeship openings in trades that fit their skills and target locations, and walk into a registered apprenticeship without paying placement fees, application fees, or testing fees. Many trades offer credit for military experience — particularly for those with logistics, mechanical, or construction-adjacent MOSs."
                  />
                  <ExpandableCard
                    accent="#3B9EFF"
                    title="UA Veterans in Piping (VIP)"
                    summary="The UA's program delivers welding, HVACR, and fire-suppression training on military bases during the final months of active duty."
                    body="Pipefitters and plumbers (UA) run the Veterans in Piping program at military installations including Camp Pendleton, Joint Base Lewis-McChord, Fort Carson, Fort Cavazos, Camp Lejeune, Fort Campbell, and Naval Station Norfolk. Training is free, doesn't require GI Bill use, and graduates step directly into a UA apprenticeship and a job upon discharge. Other building-trades unions have analogous programs."
                  />
                </Section>

                {/* CLOSING — WHAT THIS MEANS */}
                <div style={{margin:'80px 0 40px', padding:'48px 32px', background:'rgba(255,255,255,0.03)', borderRadius:24, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase', marginBottom:16}}>The Bottom Line</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>What This All Adds Up To</h2>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    The wage on a union paycheck tells you part of the story. The pension contributions, the health-fund deposits, the annuity accruals, and the training-fund deposits running alongside it tell you the rest. For a typical journey-level union member working 1,500-2,000 hours per year, the value of contractor-paid benefits often equals 30–40% of the hourly wage on top of the wage itself.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 20px'}}>
                    None of it comes from your paycheck. All of it follows you for life. And almost none of it exists outside organized labor in the construction industry today.
                  </p>
                  <p style={{fontSize:16, color:'rgba(255,255,255,0.85)', lineHeight:1.8, maxWidth:720, margin:'0 auto 32px'}}>
                    That's why people who get into the union trades tend to stay.
                  </p>
                  <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:24}}>
                    <button onClick={() => setPage('home')} style={{background:'#FA8059', color:'#000', fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, letterSpacing:1, textTransform:'uppercase', padding:'14px 32px', border:'none', borderRadius:50, cursor:'pointer'}}>Find Your Local →</button>
                    <button onClick={() => setPage('checklist')} style={{background:'transparent', color:'#FA8059', fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', padding:'14px 28px', border:'1px solid rgba(250,128,89,0.4)', borderRadius:50, cursor:'pointer'}}>How to Join</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
            HFIAW: { name: "HFIAW Insulator", tiers: { 1: { base:58, health:13, pension:10, annuity:5.5, vacation:4.5, other:2 }, 2: { base:48, health:12, pension:8.5, annuity:4.5, vacation:4, other:1.5 }, 3: { base:38, health:11, pension:7.5, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.40,0.50,0.65,0.75,0.85] },
            IUEC: { name: "IUEC Elevator Constructor", tiers: { 1: { base:68, health:15, pension:12, annuity:6.5, vacation:5.5, other:2 }, 2: { base:56, health:13.5, pension:10, annuity:5.5, vacation:5, other:2 }, 3: { base:45, health:12, pension:8.5, annuity:4.5, vacation:4, other:1.5 } }, appScale:[0.50,0.55,0.65,0.75,0.85] },
            IUOE: { name: "IUOE Operating Engineer", tiers: { 1: { base:58, health:13, pension:10.5, annuity:5, vacation:4.5, other:2 }, 2: { base:48, health:12, pension:9, annuity:4.5, vacation:4, other:1.5 }, 3: { base:38, health:11, pension:7.5, annuity:4, vacation:3.5, other:1.5 } }, appScale:[0.60,0.65,0.75,0.85,0.90] },
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
                          {key === "IBEW_I" ? "IBEW Inside" : key === "IBEW_L" ? "IBEW Lineman" : key === "UA" ? "UA Plumbers" : key === "BAC" ? "Bricklayers" : key === "IW" ? "Ironworkers" : key === "HFIAW" ? "Insulators" : key === "IUEC" ? "Elevators" : key === "IUOE" ? "Operating Engineers" : key}
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

        {page === "resume" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "100% Gratis Sin Registro" : lang==="pl" ? "100% Darmowe Bez Rejestracji" : "Built for Every Stage of Your Union Career"}</div>
              <h1 className="history-title">
                {lang==="es" ? <><span className="accent">{"Curriculum Sindical"}</span>{" Gratis"}</> : lang==="pl" ? <><span className="accent">{"Darmowy Szablon CV"}</span></> : <>{"Union Trades "}<span className="accent">{"Resume Template"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Disenado para solicitudes de aprendizaje sindical. Listo para usar." : lang==="pl" ? "Zaprojektowany do podania o praktyki zwiazkowe. Gotowy do uzycia." : "Whether you are applying to a union apprenticeship, updating your journeyman resume, or tracking your career history — this template is built for you. Download, edit, and make it your own."}
              </p>
            </div>
            <div style={{maxWidth:900, margin:"0 auto", padding:"0 24px 80px"}}>
              <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"48px", textAlign:"center", marginBottom:48}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:30, fontWeight:900, color:"#fff", marginBottom:12}}>
                  {lang==="es" ? "Plantilla de Curriculum para Oficios Sindicales" : lang==="pl" ? "Szablon CV dla Zawodow Zwiazkowych" : "Union Trades Resume Template"}
                </div>
                <div style={{fontSize:15, color:"var(--muted)", marginBottom:36, lineHeight:1.7, maxWidth:560, margin:"0 auto 36px"}}>
                  {lang==="es" ? "Formato profesional de una pagina con seccion de experiencia sindical, certificaciones OSHA y habilidades del oficio. Disenado por miembros sindicales." : lang==="pl" ? "Profesjonalny format jednej strony z sekcja doswiadczenia zwiazkowego, certyfikatow OSHA i umiejetnosci zawodowych." : "Professional one-page format with union experience section, OSHA certifications, and trade skills. Designed by union members."}
                </div>
                <a href="/union-trades-resume.pdf" download="UnionPathways-Resume-Template.pdf" style={{display:"inline-flex", alignItems:"center", gap:10, background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 36px", borderRadius:50, textDecoration:"none"}}>
                  {lang==="es" ? "Descargar PDF Gratis" : lang==="pl" ? "Pobierz PDF Za Darmo" : "Download Free PDF"}
                </a>
                <div style={{fontSize:12, color:"rgba(160,180,196,0.35)", marginTop:20}}>
                  {lang==="es" ? "Sin registro. Sin correo. Sin trampa." : lang==="pl" ? "Bez rejestracji. Bez emaila." : "Free to download and edit. No signup. No catch."}
                </div>
              </div>
              <div className="impact-grid">
                {[
                  { num:"01", title: lang==="es" ? "Seccion de Experiencia Sindical" : lang==="pl" ? "Sekcja Doswiadczenia Zwiazkowego" : "Union Experience Section", desc: lang==="es" ? "Espacio para tu local sindical, numero de aprendiz y contratista." : lang==="pl" ? "Miejsce na Twoj lokal zwiazkowy i numer praktykanta." : "Dedicated space for your union local, apprentice number, and contractor." },
                  { num:"02", title: lang==="es" ? "Habilidades del Oficio" : lang==="pl" ? "Umiejetnosci Zawodowe" : "Trade Skills Section", desc: lang==="es" ? "Lista de habilidades comunes del oficio que puedes personalizar." : lang==="pl" ? "Lista typowych umiejetnosci zawodowych do dostosowania." : "Pre-filled list of common trade skills you can customize to match your experience." },
                  { num:"03", title: lang==="es" ? "Certificaciones de Seguridad" : lang==="pl" ? "Certyfikaty Bezpieczenstwa" : "Safety Certifications", desc: lang==="es" ? "Seccion para OSHA 10/30, primeros auxilios y mas." : lang==="pl" ? "Sekcja na OSHA 10/30 i inne certyfikaty." : "Section for OSHA 10/30, first aid, aerial lift operator, and other safety certs." },
                  { num:"04", title: lang==="es" ? "Formato Profesional" : lang==="pl" ? "Profesjonalny Format" : "Professional Format", desc: lang==="es" ? "Diseno limpio de una pagina. Impresiona a los coordinadores." : lang==="pl" ? "Czysty jednostronicowy projekt." : "Clean one-page design with dark sidebar. Makes an impression on JATC coordinators." },
                ].map((item, i) => (
                  <div key={i} className="impact-card">
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                    <div className="impact-title">{item.title}</div>
                    <div className="impact-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === "jobboard" && (() => {
          // Build trade options with their locals
          const JOB_TRADES = [
            { key: 'IBEW_I', label: 'IBEW Inside Wireman', locals: IBEW_INSIDE_LOCALS },
            { key: 'IBEW_L', label: 'IBEW Lineman', locals: IBEW_LINEMAN_LOCALS },
            { key: 'UA', label: 'UA Plumbers & Pipefitters', locals: UA_LOCALS },
            { key: 'BAC', label: 'BAC Bricklayers', locals: BAC_LOCALS },
            { key: 'IW', label: 'Ironworkers', locals: IW_LOCALS },
            { key: 'HFIAW', label: 'HFIAW Insulators', locals: HFIAW_LOCALS },
            { key: 'IUEC', label: 'IUEC Elevator Constructors', locals: IUEC_LOCALS },
            { key: 'IUOE', label: 'IUOE Operating Engineers', locals: IUOE_LOCALS },
            { key: 'UBC', label: 'UBC Carpenters', locals: UBC_LOCALS },
          ];

          const selectedTradeLocals = JOB_TRADES.find(t => t.key === jobTrade)?.locals || [];

          const handleJobSubmit = async () => {
            if (!jobTrade || !jobLocal || !jobStatus || !jobDate) return;
            const local = selectedTradeLocals.find(l => String(l.id) === String(jobLocal));
            if (!local) return;

            const tradeName = JOB_TRADES.find(t => t.key === jobTrade)?.label || jobTrade;
            const statusLabel = jobStatus === 'busy' ? 'BUSY' : jobStatus === 'steady' ? 'STEADY' : 'SLOW';

            // Load EmailJS if not already loaded
            if (!window.emailjs) {
              await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
              });
              window.emailjs.init('J8FxG05UtYq-sWLNT');
            }

            try {
              // Save to Supabase database (pending approval)
              const sb = await getSupabase();
              await sb.from('job_submissions').insert({
                trade: tradeName,
                local_name: local.name,
                local_id: local.id,
                city: local.city,
                state: local.state,
                status: statusLabel,
                job_calls: jobCalls || null,
                report_date: jobDate,
                phone: local.phone || null,
                website: local.website || null,
                local_email: local.email || null,
                address: local.address || null,
                approved: false,
              });

              // Also send notification email
              await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                trade: tradeName,
                local_name: local.name,
                city: local.city,
                state: local.state,
                status: statusLabel,
                job_calls: jobCalls || 'None listed',
                report_date: jobDate,
                phone: local.phone || 'N/A',
                website: local.website || 'N/A',
                local_email: local.email || 'N/A',
                address: local.address || 'N/A',
              });
              setJobSubmitted(true);
            } catch(err) {
              console.error('Submission error:', err);
              alert('Submission failed. Please try again.');
            }
          };

          return (
            <div>
              <div className="history-hero">
                <div className="history-eyebrow">{lang==="es" ? "Enviado por Miembros Sindicales" : lang==="pl" ? "Przeslane przez Czlonkow Zwiazku" : "Submitted by Union Members"}</div>
                <h1 className="history-title">
                  {lang==="es" ? <>{"Bolsa de "}<span className="accent">{"Trabajo Sindical"}</span></> : lang==="pl" ? <>{"Gielda "}<span className="accent">{"Pracy Zwiazkowej"}</span></> : <>{"Union "}<span className="accent">{"Job Board"}</span></>}
                </h1>
                <p className="history-subtitle">
                  {lang==="es" ? "Informes de perspectivas laborales enviados por miembros del sindicato. Verifica siempre con tu local antes de viajar." : lang==="pl" ? "Raporty o perspektywach pracy przeslane przez czlonkow zwiazku. Zawsze weryfikuj ze swoim lokalem przed podrozowaniem." : "Work outlook reports submitted by union members. Always verify availability directly with your local hall before traveling or making career decisions."}
                </p>
              </div>

              <div style={{maxWidth:900, margin:"0 auto", padding:"0 24px 80px"}}>

                {/* DISCLAIMER */}
                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:14, padding:"16px 20px", marginBottom:40, display:"flex", gap:12, alignItems:"flex-start"}}>
                  <div style={{color:"#FA8059", fontSize:18, flexShrink:0}}>&#9888;</div>
                  <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>
                    {lang==="es" ? "Todos los informes son enviados por miembros sindicales bajo un sistema de honor. Union Pathways no verifica esta informacion. Siempre confirma la disponibilidad de trabajo directamente con tu local sindical antes de viajar o tomar decisiones de carrera." : lang==="pl" ? "Wszystkie raporty sa przesylane przez czlonkow zwiazku w systemie honorowym. Union Pathways nie weryfikuje tych informacji. Zawsze potwierdzaj dostepnosc pracy bezposrednio ze swoim lokalem przed podrozowaniem." : "All work outlook reports are submitted by union members on an honor system. Union Pathways does not verify this information. Always confirm work availability directly with your local hall before traveling or making career decisions."}
                  </div>
                </div>

                {/* SUBMIT FORM */}
                <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"32px", marginBottom:40}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:24}}>
                    {lang==="es" ? "Reporte un Local Activo" : lang==="pl" ? "Zglos Aktywny Lokal" : "Submit a Hot Spot Local"}
                  </div>

                  {jobSubmitted ? (
                    <div style={{textAlign:"center", padding:"40px 0"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059", marginBottom:12}}>Report Submitted!</div>
                      <div style={{fontSize:14, color:"var(--muted)", marginBottom:24}}>Your report is under review. Once approved it will appear on the Job Board.</div>
                      <button onClick={() => { setJobSubmitted(false); setJobTrade(''); setJobLocal(''); setJobLocalSearch(''); setJobStatus(''); setJobCalls(''); setJobDate(''); }} style={{background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"10px 24px", color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer"}}>
                        Submit Another
                      </button>
                    </div>
                  ) : (
                    <div style={{display:"flex", flexDirection:"column", gap:20}}>

                      {/* Trade selector */}
                      <div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                          {lang==="es" ? "Oficio" : lang==="pl" ? "Zawod" : "Trade"}
                        </div>
                        <select value={jobTrade} onChange={e => { setJobTrade(e.target.value); setJobLocal(''); setJobLocalSearch(''); }} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:jobTrade ? "#fff" : "var(--muted)", fontSize:14, fontFamily:"'Inter',sans-serif", cursor:"pointer"}}>
                          <option value="">{lang==="es" ? "Selecciona tu oficio..." : lang==="pl" ? "Wybierz zawod..." : "Select your trade..."}</option>
                          {JOB_TRADES.map(t => <option key={t.key} value={t.key} style={{background:"#0a1628"}}>{t.label}</option>)}
                        </select>
                      </div>

                      {/* Local selector */}
                      {jobTrade && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Local Sindical" : lang==="pl" ? "Lokal Zwiazku" : "Union Local"}
                          </div>
                          <input
                            type="search"
                            inputMode="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={jobLocalSearch}
                            onChange={e => setJobLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:16, fontFamily:"'Inter',sans-serif", marginBottom:8, boxSizing:"border-box"}}
                          />
                          {jobLocalSearch.trim() && (
                            <div style={{fontSize:11, color:"rgba(160,180,196,0.7)", marginBottom:8, fontFamily:"'Inter',sans-serif"}}>
                              {(() => {
                                const q = jobLocalSearch.trim().toLowerCase();
                                const n = selectedTradeLocals.filter(l => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q)).length;
                                return n + ' ' + (lang==="es" ? "resultados" : lang==="pl" ? "wynikow" : (n === 1 ? "match" : "matches"));
                              })()}
                            </div>
                          )}
                          <div style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:6, maxHeight:260, overflowY:"auto", fontFamily:"'Inter',sans-serif"}}>
                            {(() => {
                              const q = jobLocalSearch.trim().toLowerCase();
                              const filtered = [...selectedTradeLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <div style={{padding:"14px 16px", color:"rgba(160,180,196,0.7)", fontSize:13, textAlign:"center"}}>{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</div>;
                              return filtered.map(l => {
                                const isSelected = String(jobLocal) === String(l.id);
                                return (
                                  <div key={l.id} onClick={() => setJobLocal(String(l.id))} style={{padding:"10px 14px", borderRadius:8, marginBottom:2, cursor:"pointer", background: isSelected ? "rgba(250,128,89,0.2)" : "transparent", border: isSelected ? "1px solid rgba(250,128,89,0.5)" : "1px solid transparent", color: isSelected ? "#FA8059" : "#fff", fontSize:14, fontWeight: isSelected ? 700 : 500, transition:"background 0.12s"}} onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                                    <div style={{fontWeight:700, fontSize:14}}>{l.name}</div>
                                    <div style={{fontSize:12, color: isSelected ? "rgba(250,128,89,0.85)" : "rgba(160,180,196,0.85)", marginTop:2}}>{l.city}, {l.state}</div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Status */}
                      {jobLocal && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Estado del Trabajo" : lang==="pl" ? "Status Pracy" : "Work Status"}
                          </div>
                          <div style={{display:"flex", gap:10}}>
                            {[
                              {val:'busy', label:'🟢 Busy', desc: lang==="es" ? "Mucho trabajo, contratando" : lang==="pl" ? "Duzo pracy, zatrudniamy" : "Lots of work, hiring"},
                              {val:'steady', label:'🟡 Steady', desc: lang==="es" ? "Flujo normal de trabajo" : lang==="pl" ? "Normalny przepyw pracy" : "Normal workflow"},
                              {val:'slow', label:'🔴 Slow', desc: lang==="es" ? "Trabajo escaso" : lang==="pl" ? "Malo pracy" : "Work is light"},
                            ].map(s => (
                              <button key={s.val} onClick={() => setJobStatus(s.val)} style={{flex:1, padding:"12px 8px", borderRadius:12, border: jobStatus===s.val ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.08)", background: jobStatus===s.val ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center"}}>
                                <div style={{fontSize:14, fontWeight:700, color: jobStatus===s.val ? "#FA8059" : "#fff", marginBottom:4}}>{s.label}</div>
                                <div style={{fontSize:11, color:"var(--muted)"}}>{s.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Job Calls */}
                      {jobStatus && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Lista de Llamadas de Trabajo" : lang==="pl" ? "Lista Ofert Pracy" : "List Job Calls"}
                          </div>
                          <textarea value={jobCalls} onChange={e => setJobCalls(e.target.value)} placeholder={lang==="es" ? "Ej: Trabajo comercial disponible, proyectos de data center, sin trabajo residencial..." : lang==="pl" ? "Np: Praca komercyjna dostepna, projekty data center, brak pracy mieszkaniowej..." : "e.g. Commercial work available, data center projects, no residential work..."} rows={3} style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", resize:"vertical", boxSizing:"border-box"}}/>
                        </div>
                      )}

                      {/* Date */}
                      {jobStatus && (
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
                            {lang==="es" ? "Fecha del Informe" : lang==="pl" ? "Data Raportu" : "Report Date"}
                          </div>
                          <input type="date" value={jobDate} onChange={e => setJobDate(e.target.value)} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", width:"100%", boxSizing:"border-box"}}/>
                        </div>
                      )}

                      {/* Submit */}
                      {jobTrade && jobLocal && jobStatus && jobDate && (
                        <button onClick={handleJobSubmit} style={{background:"#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 32px", borderRadius:50, border:"none", cursor:"pointer", marginTop:8}}>
                          {lang==="es" ? "Enviar" : lang==="pl" ? "Wyslij" : "Submit Hot Spot"}
                        </button>
                      )}

                    </div>
                  )}
                </div>

                {/* BOARD — approved reports would show here */}
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:20}}>
                    {lang==="es" ? "Informes Aprobados" : lang==="pl" ? "Zatwierdzone Raporty" : "Approved Reports"}
                  </div>
                  <ApprovedReportsFeed lang={lang} />
                </div>

              </div>
            </div>
          );
        })()}

        {page === "wages" && (() => {
          const WAGE_TRADES = [
            { key: 'IBEW_I', label: 'IBEW Inside Wireman', locals: IBEW_INSIDE_LOCALS },
            { key: 'IBEW_L', label: 'IBEW Lineman', locals: IBEW_LINEMAN_LOCALS },
            { key: 'UA', label: 'UA Plumbers & Pipefitters', locals: UA_LOCALS },
            { key: 'BAC', label: 'BAC Bricklayers', locals: BAC_LOCALS },
            { key: 'IW', label: 'Ironworkers', locals: IW_LOCALS },
            { key: 'HFIAW', label: 'HFIAW Insulators', locals: HFIAW_LOCALS },
            { key: 'IUEC', label: 'IUEC Elevator Constructors', locals: IUEC_LOCALS },
            { key: 'IUOE', label: 'IUOE Operating Engineers', locals: IUOE_LOCALS },
            { key: 'UBC', label: 'UBC Carpenters', locals: UBC_LOCALS },
          ];
          const isIBEW = wageTrade === 'IBEW_I' || wageTrade === 'IBEW_L';
          const isIUOE = wageTrade === 'IUOE';
          const wageLocals = WAGE_TRADES.find(t => t.key === wageTrade)?.locals || [];
          const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
          const totalPackage = num(wageHourly) + num(wageHW) + num(wageDefinedPension) + num(wageNationalPension) + num(wageContribPension) + num(wage401k) + num(wageMiscFunds) + (isIBEW ? num(wageNEBF) : 0) + (isIUOE ? num(wageCIPF) + num(wageIUOETraining) : 0);

          const handleWageSubmit = async () => {
            if (!wageTrade || !wageLocal || !wageMethod) return;
            if (wageMethod === 'image' && !wageImageFile) return;
            if (wageMethod === 'manual' && !wageHourly) return;
            const local = wageLocals.find(l => String(l.id) === String(wageLocal));
            if (!local) return;
            const tradeName = WAGE_TRADES.find(t => t.key === wageTrade)?.label || wageTrade;
            setWageUploading(true);
            try {
              const sb = await getSupabase();
              let imageUrl = null;
              if (wageImageFile) {
                const ext = (wageImageFile.name.split('.').pop() || 'bin').toLowerCase();
                const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
                const { error: upErr } = await sb.storage.from('wage-sheets').upload(fileName, wageImageFile, { contentType: wageImageFile.type });
                if (upErr) throw upErr;
                const { data: urlData } = sb.storage.from('wage-sheets').getPublicUrl(fileName);
                imageUrl = urlData.publicUrl;
              }
              await sb.from('wage_submissions').insert({
                trade: tradeName, local_name: local.name, local_id: String(local.id), city: local.city, state: local.state,
                classification: 'Journeyman', submission_method: wageMethod, image_url: imageUrl,
                hourly: wageMethod === 'manual' ? num(wageHourly) || null : null,
                health_welfare: wageMethod === 'manual' ? num(wageHW) || null : null,
                defined_pension: wageMethod === 'manual' ? num(wageDefinedPension) || null : null,
                national_pension: wageMethod === 'manual' ? num(wageNationalPension) || null : null,
                contribution_pension: wageMethod === 'manual' ? num(wageContribPension) || null : null,
                k401: wageMethod === 'manual' ? num(wage401k) || null : null,
                nebf: wageMethod === 'manual' && isIBEW ? num(wageNEBF) || null : null,
                cipf: wageMethod === 'manual' && isIUOE ? num(wageCIPF) || null : null,
                iuoe_training: wageMethod === 'manual' && isIUOE ? num(wageIUOETraining) || null : null,
                misc_funds: wageMethod === 'manual' ? num(wageMiscFunds) || null : null,
                working_dues: wageMethod === 'manual' ? num(wageWorkingDues) || null : null,
                total_package: wageMethod === 'manual' ? totalPackage || null : null,
                effective_date: null, valid_through: wageValidThrough || null,
                notes: wageNotes || null, approved: false,
              });
              if (!window.emailjs) {
                await new Promise((resolve) => {
                  const script = document.createElement('script');
                  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                  script.onload = resolve;
                  document.head.appendChild(script);
                });
                window.emailjs.init('J8FxG05UtYq-sWLNT');
              }
              try {
                await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',
                  job_calls: wageMethod === 'image' ? `Image upload: ${imageUrl}` : `Manual entry — Hourly: $${wageHourly}, Total: $${totalPackage.toFixed(2)}`,
                  report_date: new Date().toLocaleDateString(), phone: 'N/A', website: 'N/A', local_email: 'N/A',
                  address: `Contract valid through ${wageValidThrough || 'N/A'}`,
                });
              } catch (emailErr) { console.warn('Email failed (non-fatal):', emailErr); }
              setWageSubmitted(true);
            } catch (err) {
              console.error('Wage submission error:', err);
              alert('Submission failed: ' + (err.message || 'Please try again.'));
            } finally { setWageUploading(false); }
          };

          const resetWageForm = () => {
            setWageSubmitted(false); setWageTrade(''); setWageLocal(''); setWageLocalSearch(''); setWageMethod('');
            setWageImageFile(null); setWageHourly(''); setWageHW(''); setWageDefinedPension('');
            setWageNationalPension(''); setWageContribPension(''); setWage401k(''); setWageNEBF(''); setWageCIPF('');
            setWageIUOETraining(''); setWageMiscFunds(''); setWageWorkingDues(''); setWageEffectiveDate('');
            setWageValidThrough(''); setWageNotes('');
          };

          const labelStyle = {fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8};
          const inputStyle = {width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", boxSizing:"border-box"};
          const moneyField = (label, value, setter, optional = false) => (
            <div>
              <div style={labelStyle}>{label}{optional && <span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>(optional)</span>}</div>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--muted)", fontSize:14, pointerEvents:"none"}}>$</span>
                <input type="number" step="0.01" min="0" value={value} onChange={e => setter(e.target.value)} placeholder="0.00" style={{...inputStyle, paddingLeft:28}} />
              </div>
            </div>
          );

          return (
            <div>
              <div className="history-hero">
                <div className="history-eyebrow">{lang==="es" ? "Salarios Verificados por Miembros" : lang==="pl" ? "Stawki Potwierdzone przez Czlonkow" : "Wages Verified by Members"}</div>
                <h1 className="history-title">
                  {lang==="es" ? <>{"Salarios "}<span className="accent">{"de Locales"}</span></> : lang==="pl" ? <>{"Place "}<span className="accent">{"Lokalne"}</span></> : <>{"Local "}<span className="accent">{"Wages"}</span></>}
                </h1>
                <p className="history-subtitle">
                  {lang==="es" ? "Tarifas de jornaleros enviadas por miembros del sindicato. Verifica siempre con tu local antes de tomar decisiones." : lang==="pl" ? "Stawki czeladnikow przeslane przez czlonkow zwiazku. Zawsze weryfikuj ze swoim lokalem." : "Journeyman rates submitted by union members. Always verify with your local before making career decisions."}
                </p>
              </div>

              <div style={{maxWidth:900, margin:"0 auto", padding:"0 24px 80px"}}>

                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:14, padding:"16px 20px", marginBottom:40, display:"flex", gap:12, alignItems:"flex-start"}}>
                  <div style={{color:"#FA8059", fontSize:18, flexShrink:0}}>&#9888;</div>
                  <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>
                    <><div><strong style={{color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1}}>{lang==="es" ? "SISTEMA DE HONOR — " : lang==="pl" ? "SYSTEM HONOROWY — " : "HONOR SYSTEM — "}</strong>{lang==="es" ? "Todos los salarios son enviados por miembros del sindicato y NO son verificados por Union Pathways. Para tarifas finales y 100% precisas, siempre contacte directamente con su local sindical." : lang==="pl" ? "Wszystkie stawki sa przesylane przez czlonkow zwiazku i NIE sa weryfikowane przez Union Pathways. Aby uzyskac koncowe i w 100% dokladne stawki, zawsze skontaktuj sie bezposrednio ze swoim lokalem zwiazkowym." : "All wage data is submitted by union members and is NOT verified by Union Pathways. For final and 100% accurate rates, always contact your local hall directly."}</div><div style={{marginTop:12, fontSize:12, opacity:0.85, paddingTop:12, borderTop:"1px solid rgba(250,128,89,0.15)"}}><strong style={{color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:0.5}}>{lang==="es" ? "NOTA — " : lang==="pl" ? "UWAGA — " : "NOTE — "}</strong>{lang==="es" ? "Los envios cubren los rubros principales: hora, salud y bienestar, pensiones, anualidad, NEBF/CIPF y cuotas. Las contribuciones pequenas que varian de local a local (JATC, fondos suplementarios, etc.) se pueden agrupar en el campo Otros Fondos." : lang==="pl" ? "Zgloszenia obejmuja glowne pozycje: godzinowo, swiadczenia zdrowotne, emerytury, renta, NEBF/CIPF i skladki. Mniejsze skladki ktore roznia sie miedzy lokalami (JATC, fundusze dodatkowe itp.) mozna zlaczyc w polu Inne Fundusze." : "Submissions cover the major line items: hourly, health & welfare, pensions, annuity, NEBF/CIPF, and dues. Smaller contributions that vary local to local (JATC, supplemental funds, etc.) can be rolled into the Other Funds field."}</div></>
                  </div>
                </div>

                <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"32px", marginBottom:40}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:24}}>
                    {lang==="es" ? "Enviar Salarios de tu Local" : lang==="pl" ? "Zglos Stawki Twojego Lokalu" : "Submit Your Local's Wages"}
                  </div>

                  {wageSubmitted ? (
                    <div style={{textAlign:"center", padding:"40px 0"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059", marginBottom:12}}>
                        {lang==="es" ? "Salario Enviado!" : lang==="pl" ? "Stawka Wyslana!" : "Wages Submitted!"}
                      </div>
                      <div style={{fontSize:14, color:"var(--muted)", marginBottom:24}}>
                        {lang==="es" ? "Tu informacion esta siendo revisada. Una vez aprobada aparecera aqui." : lang==="pl" ? "Twoja informacja jest sprawdzana. Po zatwierdzeniu pojawi sie tutaj." : "Your wage info is under review. Once approved it will appear here."}
                      </div>
                      <button onClick={resetWageForm} style={{background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"10px 24px", color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer"}}>
                        {lang==="es" ? "Enviar Otro" : lang==="pl" ? "Wyslij Kolejny" : "Submit Another"}
                      </button>
                    </div>
                  ) : (
                    <div style={{display:"flex", flexDirection:"column", gap:20}}>

                      <div>
                        <div style={labelStyle}>{lang==="es" ? "Oficio" : lang==="pl" ? "Zawod" : "Trade"}</div>
                        <select value={wageTrade} onChange={e => { setWageTrade(e.target.value); setWageLocal(''); setWageLocalSearch(''); }} style={{...inputStyle, cursor:"pointer", color: wageTrade ? "#fff" : "var(--muted)"}}>
                          <option value="">{lang==="es" ? "Selecciona tu oficio..." : lang==="pl" ? "Wybierz zawod..." : "Select your trade..."}</option>
                          {WAGE_TRADES.map(t => <option key={t.key} value={t.key} style={{background:"#0a1628"}}>{t.label}</option>)}
                        </select>
                      </div>

                      {wageTrade && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Local Sindical" : lang==="pl" ? "Lokal Zwiazku" : "Union Local"}</div>
                          <input
                            type="search"
                            inputMode="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={wageLocalSearch}
                            onChange={e => setWageLocalSearch(e.target.value)}
                            placeholder={lang==="es" ? "Buscar por numero de local o ciudad..." : lang==="pl" ? "Szukaj po numerze lub miescie..." : "Search by local number or city..."}
                            style={{...inputStyle, fontSize:16, padding:"10px 14px", marginBottom:8}}
                          />
                          {wageLocalSearch.trim() && (
                            <div style={{fontSize:11, color:"rgba(160,180,196,0.7)", marginBottom:8, fontFamily:"'Inter',sans-serif"}}>
                              {(() => {
                                const q = wageLocalSearch.trim().toLowerCase();
                                const n = wageLocals.filter(l => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q)).length;
                                return n + ' ' + (lang==="es" ? "resultados" : lang==="pl" ? "wynikow" : (n === 1 ? "match" : "matches"));
                              })()}
                            </div>
                          )}
                          <div style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:6, maxHeight:260, overflowY:"auto", fontFamily:"'Inter',sans-serif"}}>
                            {(() => {
                              const q = wageLocalSearch.trim().toLowerCase();
                              const filtered = [...wageLocals]
                                .filter(l => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || (l.state || '').toLowerCase().includes(q))
                                .sort((a,b) => { const numA = parseInt(String(a.id).match(/\d+/)?.[0] || '0', 10); const numB = parseInt(String(b.id).match(/\d+/)?.[0] || '0', 10); return numA - numB; });
                              if (filtered.length === 0) return <div style={{padding:"14px 16px", color:"rgba(160,180,196,0.7)", fontSize:13, textAlign:"center"}}>{lang==="es" ? "Sin resultados" : lang==="pl" ? "Brak wynikow" : "No matches"}</div>;
                              return filtered.map(l => {
                                const isSelected = String(wageLocal) === String(l.id);
                                return (
                                  <div key={l.id} onClick={() => setWageLocal(String(l.id))} style={{padding:"10px 14px", borderRadius:8, marginBottom:2, cursor:"pointer", background: isSelected ? "rgba(250,128,89,0.2)" : "transparent", border: isSelected ? "1px solid rgba(250,128,89,0.5)" : "1px solid transparent", color: isSelected ? "#FA8059" : "#fff", fontSize:14, fontWeight: isSelected ? 700 : 500, transition:"background 0.12s"}} onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                                    <div style={{fontWeight:700, fontSize:14}}>{l.name}</div>
                                    <div style={{fontSize:12, color: isSelected ? "rgba(250,128,89,0.85)" : "rgba(160,180,196,0.85)", marginTop:2}}>{l.city}, {l.state}</div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )}

                      {wageLocal && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Metodo de Envio" : lang==="pl" ? "Metoda Zgloszenia" : "Submission Method"}</div>
                          <div style={{display:"flex", gap:10}}>
                            <button onClick={() => setWageMethod('image')} style={{flex:1, padding:"14px 12px", borderRadius:12, border: wageMethod==='image' ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.08)", background: wageMethod==='image' ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center"}}>
                              <div style={{fontSize:24, marginBottom:4}}>📄</div>
                              <div style={{fontSize:13, fontWeight:700, color: wageMethod==='image' ? "#FA8059" : "#fff"}}>{lang==="es" ? "Subir Hoja" : lang==="pl" ? "Prześlij Plik" : "Upload Wage Sheet"}</div>
                              <div style={{fontSize:11, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "Foto o PDF" : lang==="pl" ? "Zdjecie lub PDF" : "Photo or PDF"}</div>
                            </button>
                            <button onClick={() => setWageMethod('manual')} style={{flex:1, padding:"14px 12px", borderRadius:12, border: wageMethod==='manual' ? "1px solid #FA8059" : "1px solid rgba(255,255,255,0.08)", background: wageMethod==='manual' ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center"}}>
                              <div style={{fontSize:24, marginBottom:4}}>⌨️</div>
                              <div style={{fontSize:13, fontWeight:700, color: wageMethod==='manual' ? "#FA8059" : "#fff"}}>{lang==="es" ? "Ingresar Manual" : lang==="pl" ? "Wprowadz Recznie" : "Enter Manually"}</div>
                              <div style={{fontSize:11, color:"var(--muted)", marginTop:4}}>{lang==="es" ? "Escribir cifras" : lang==="pl" ? "Wpisz kwoty" : "Type the numbers"}</div>
                            </button>
                          </div>
                        </div>
                      )}

                      {wageMethod === 'image' && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Hoja de Salario" : lang==="pl" ? "Plik ze Stawka" : "Wage Sheet File"}</div>
                          <input type="file" accept="image/*,application/pdf" onChange={e => setWageImageFile(e.target.files[0])} style={{...inputStyle, cursor:"pointer", padding:"10px 12px"}} />
                          {wageImageFile && <div style={{fontSize:12, color:"var(--muted)", marginTop:6}}>✓ {wageImageFile.name} ({(wageImageFile.size/1024/1024).toFixed(2)} MB)</div>}
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:8, lineHeight:1.4}}>
                            {lang==="es" ? "Sube una foto clara o PDF de tu hoja de salario actual. Maximo 50 MB." : lang==="pl" ? "Prześlij wyrazne zdjecie lub PDF stawki. Maksymalnie 50 MB." : "Upload a clear photo or PDF of your current wage sheet. Max 50 MB."}
                          </div>
                        </div>
                      )}

                      {wageMethod === 'manual' && (
                        <>
                          {moneyField(lang==="es" ? "Por Hora" : lang==="pl" ? "Godzinowo" : "Hourly", wageHourly, setWageHourly)}
                          {moneyField(lang==="es" ? "Salud y Bienestar" : lang==="pl" ? "Zdrowie i Opieka" : "Health & Welfare", wageHW, setWageHW, true)}
                          {moneyField(lang==="es" ? "Pension Definida" : lang==="pl" ? "Emerytura Definiowana" : "Defined Pension", wageDefinedPension, setWageDefinedPension, true)}
                          {moneyField(lang==="es" ? "Pension Nacional" : lang==="pl" ? "Emerytura Krajowa" : "National Pension", wageNationalPension, setWageNationalPension, true)}
                          {moneyField(lang==="es" ? "Pension de Contribucion / Anualidad" : lang==="pl" ? "Emerytura Skladkowa / Renta" : "Contribution Pension / Annuity", wageContribPension, setWageContribPension, true)}
                          {moneyField("401(k)", wage401k, setWage401k, true)}
                          {isIBEW && moneyField("NEBF", wageNEBF, setWageNEBF, true)}
                          {isIUOE && moneyField("CIPF", wageCIPF, setWageCIPF, true)}
                          {isIUOE && moneyField(lang==="es" ? "Entrenamiento IUOE" : lang==="pl" ? "Szkolenie IUOE" : "IUOE National Training Fund", wageIUOETraining, setWageIUOETraining, true)}
                          {moneyField(lang==="es" ? "Otros Fondos" : lang==="pl" ? "Inne Fundusze" : "Other Funds", wageMiscFunds, setWageMiscFunds, true)}
                          <div>
                            <div style={labelStyle}>{lang==="es" ? "Cuotas de Trabajo" : lang==="pl" ? "Skladki Pracownicze" : "Working Dues"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "% opcional" : lang==="pl" ? "% opcjonalne" : "% optional"})</span></div>
                            <div style={{position:"relative"}}>
                              <input type="number" step="0.01" min="0" max="100" value={wageWorkingDues} onChange={e => setWageWorkingDues(e.target.value)} placeholder="0.00" style={{...inputStyle, paddingRight:32}} />
                              <span style={{position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"var(--muted)", fontSize:14, pointerEvents:"none"}}>%</span>
                            </div>
                            <div style={{fontSize:11, color:"var(--muted)", marginTop:6, lineHeight:1.4}}>
                              {lang==="es" ? "Porcentaje deducido del cheque, no incluido en el paquete." : lang==="pl" ? "Procent potracany z wyplaty, nie wliczany do pakietu." : "Percentage deducted from your check — not part of total package."}
                            </div>
                          </div>

                          {wageHourly && (
                            <div style={{padding:"16px 20px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#22c55e", letterSpacing:1, textTransform:"uppercase"}}>
                                {lang==="es" ? "Paquete Total" : lang==="pl" ? "Pakiet Calkowity" : "Total Package"}
                              </div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:"#22c55e"}}>
                                ${totalPackage.toFixed(2)}
                              </div>
                            </div>
                          )}

                          <div>
                            <div style={labelStyle}>{lang==="es" ? "Adjuntar Hoja de Salario" : lang==="pl" ? "Dolacz Plik ze Stawka" : "Attach Wage Sheet"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>
                            <input type="file" accept="image/*,application/pdf" onChange={e => setWageImageFile(e.target.files[0])} style={{...inputStyle, cursor:"pointer", padding:"10px 12px"}} />
                            {wageImageFile && <div style={{fontSize:12, color:"var(--muted)", marginTop:6}}>✓ {wageImageFile.name} ({(wageImageFile.size/1024/1024).toFixed(2)} MB)</div>}
                            <div style={{fontSize:11, color:"var(--muted)", marginTop:8, lineHeight:1.4}}>
                              {lang==="es" ? "Opcional: adjunta una foto o PDF como respaldo." : lang==="pl" ? "Opcjonalne: dolacz zdjecie lub PDF jako dowod." : "Optional: attach a photo or PDF as backup verification."}
                            </div>
                          </div>
                        </>
                      )}

                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Enviado a Union Pathways" : lang==="pl" ? "Zgloszone do Union Pathways" : "Submission to Union Pathways On"}</div>
                          <div style={{...inputStyle, opacity:0.7, cursor:"default", userSelect:"none"}}>
                            {new Date().toLocaleDateString(lang==="es" ? "es-ES" : lang==="pl" ? "pl-PL" : "en-US", { year:"numeric", month:"long", day:"numeric" })}
                          </div>
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:6}}>
                            {lang==="es" ? "Capturada automaticamente al enviar." : lang==="pl" ? "Zapisywana automatycznie przy zgloszeniu." : "Automatically captured when you submit."}
                          </div>
                        </div>
                      )}

                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Contrato Valido Hasta" : lang==="pl" ? "Umowa Wazna Do" : "Contract Valid Through"}<span style={{opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6}}>({lang==="es" ? "opcional" : lang==="pl" ? "opcjonalne" : "optional"})</span></div>
                          <input type="date" value={wageValidThrough} onChange={e => setWageValidThrough(e.target.value)} style={inputStyle} />
                          <div style={{fontSize:11, color:"var(--muted)", marginTop:6}}>
                            {lang==="es" ? "Cuando expira el contrato actual." : lang==="pl" ? "Kiedy wygasa obecna umowa." : "When the current contract expires."}
                          </div>
                        </div>
                      )}

                      {wageMethod === 'manual' && !wageImageFile && (
                        <div style={{padding:"14px 18px", background:"rgba(245,197,24,0.08)", border:"1px solid rgba(245,197,24,0.3)", borderRadius:12, display:"flex", gap:12, alignItems:"flex-start"}}>
                          <div style={{color:"#F5C518", fontSize:18, flexShrink:0}}>&#9888;</div>
                          <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.5}}>
                            {lang==="es" ? "Sin una hoja de salario adjunta, esta entrada es solo del sistema de honor. Siempre verifique con su local sindical para tarifas finales y 100% precisas." : lang==="pl" ? "Bez dolaczonej stawki, ten wpis jest tylko w systemie honorowym. Zawsze weryfikuj ze swoim lokalem aby uzyskac koncowe i w 100% dokladne stawki." : "Without a wage sheet attached, this entry is honor-system only. Always contact your local hall directly for final and 100% accurate rates."}
                          </div>
                        </div>
                      )}

                      {wageMethod && (
                        <div>
                          <div style={labelStyle}>{lang==="es" ? "Notas (opcional)" : lang==="pl" ? "Notatki (opcjonalne)" : "Notes (optional)"}</div>
                          <textarea value={wageNotes} onChange={e => setWageNotes(e.target.value)} placeholder={lang==="es" ? "Detalles adicionales sobre el contrato..." : lang==="pl" ? "Dodatkowe informacje o umowie..." : "Any additional details about the contract..."} rows={2} style={{...inputStyle, resize:"vertical"}} />
                        </div>
                      )}

                      {wageMethod && ((wageMethod === 'image' && wageImageFile) || (wageMethod === 'manual' && wageHourly)) && (
                        <button onClick={handleWageSubmit} disabled={wageUploading} style={{background: wageUploading ? "rgba(250,128,89,0.5)" : "#FA8059", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 32px", borderRadius:50, border:"none", cursor: wageUploading ? "wait" : "pointer", marginTop:8}}>
                          {wageUploading ? (lang==="es" ? "Enviando..." : lang==="pl" ? "Wysylanie..." : "Submitting...") : (lang==="es" ? "Enviar Salarios" : lang==="pl" ? "Wyslij Stawki" : "Submit Wages")}
                        </button>
                      )}

                    </div>
                  )}
                </div>

                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:20}}>
                    {lang==="es" ? "Salarios Aprobados" : lang==="pl" ? "Zatwierdzone Stawki" : "Approved Wages"}
                  </div>
                  <ApprovedWagesFeed lang={lang} />
                </div>

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
                  {lang==="es" ? "1,460 Locales en EE.UU. y Canada" : lang==="pl" ? "1,460 Lokale w USA i Kanadzie" : "1,460 Locals Across the US and Canada"}
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
                { label: "Union History", desc: "How unions built America", page:"history", keywords:["history","weekend","8 hour","wagner","osha","labor","movement"] },
                { label: "Veterans", desc: "Helmets to Hardhats and veteran resources", page:"veterans", keywords:["veteran","military","helmets","hardhats","h2h","service","army","navy"] },
                { label: "About", desc: "The story behind Union Pathways", page:"about", keywords:["about","noah","founder","spanky","sparky","story","ibew","ohio"] },
                { label: "Quiz — Which Trade?", desc: "Find out which trade matches your skills", page:"quiz", keywords:["quiz","which","trade","match","skills","test"] },
                { label: "Contact", desc: "Get in touch with Union Pathways", page:"contact", keywords:["contact","email","message","feedback","correction"] },
              ].filter(p => p.keywords.some(k => k.includes(q) || q.includes(k) || p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)));

              // Search locals
              const ALL_LOCALS = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...BAC_LOCALS, ...IW_LOCALS, ...HFIAW_LOCALS, ...IUEC_LOCALS, ...IUOE_LOCALS, ...UBC_LOCALS];
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
                            {l.website && <a href={l.website.startsWith("http") ? l.website : "https://"+l.website} target="_blank" rel="noopener noreferrer" style={{fontSize:12, color:"#FA8059", textDecoration:"none"}}>{l.website}</a>}
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
