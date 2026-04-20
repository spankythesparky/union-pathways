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
      { abbr: "IUOE", name: "Operating Engineers", full: "Int'l Union of Operating Engineers", website: "www.iuoe.org", status: "coming" },
      { abbr: "LIUNA", name: "Laborers", full: "Laborers' Int'l Union of North America", website: "www.liuna.org", status: "coming" },
      { abbr: "IW", name: "Ironworkers", full: "Int'l Association of Bridge & Structural Iron Workers", website: "www.ironworkers.org", status: "active", color: "#ef4444" },
      { abbr: "OCA", name: "Cement Masons", full: "Operative Plasterers' & Cement Masons' Int'l Association", website: "www.opcmia.org", status: "coming" },
    ],
  },
  {
    group: "Specialty Trades",
    trades: [
      { abbr: "IUEC", name: "Elevator Constructors", full: "Int'l Union of Elevator Constructors", website: "www.iuec.org", status: "coming" },
      { abbr: "HFIAW", name: "Insulators", full: "Heat & Frost Insulators and Allied Workers", website: "www.insulators.org", status: "coming" },
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
  { id: 1, name: "IBEW Local 1", city: "St. Louis", state: "MO", phone: "(314) 647-5900", website: "ibewlocal1.org", lat: 38.627, lng: -90.1994, address: "5850 Elizabeth Ave, St. Louis, MO 63110" },
  { id: 3, name: "IBEW Local 3", city: "New York City", state: "NY", phone: "(718) 591-4000", website: "local3ibew.org", lat: 40.7128, lng: -74.0059, address: "158-11 Jewel Ave 4th Floor, Flushing, NY 11365" },
  { id: 5, name: "IBEW Local 5", city: "Pittsburgh", state: "PA", phone: "(412) 432-1400", website: "ibew5.org", lat: 40.4406, lng: -79.9959, address: "5 Hot Metal St, Pittsburgh, PA 15203" },
  { id: 6, name: "IBEW Local 6", city: "San Francisco", state: "CA", phone: "(415) 861-5752", website: "ibew6.org", lat: 37.7749, lng: -122.4194, address: "55 Fillmore St #2, San Francisco, CA 94117" },
  { id: 7, name: "IBEW Local 7", city: "Springfield", state: "MA", phone: "(413) 734-7137", website: "ibewlocal7.com", lat: 42.1015, lng: -72.5898, address: "95 Liberty Street, Springfield, MA 01103" },
  { id: 8, name: "IBEW Local 8", city: "Toledo", state: "OH", phone: "(419) 666-8920", website: "ibew8.org", lat: 41.6528, lng: -83.5379, address: "807 Lime City Rd, Rossford, OH 43460" },
  { id: 11, name: "IBEW Local 11", city: "Pasadena", state: "CA", phone: "(323) 517-9610", website: "ibew11.org", lat: 34.1478, lng: -118.1445, address: "297 N Marengo Ave, Pasadena, CA 91101" },
  { id: 12, name: "IBEW Local 12", city: "Pueblo", state: "CO", phone: "(719) 561-8000", website: "ibew12.org", lat: 38.2544, lng: -104.6091, address: "2901 Farabaugh Lane, Pueblo, CO 81005" },
  { id: 13, name: "IBEW Local 13", city: "Burlington", state: "IA", phone: "(319) 752-0452", website: "ibewlocal13.com", lat: 40.8075, lng: -91.1129, address: "1205 N Central Avenue, Burlington, IA 52601" },
  { id: 14, name: "IBEW Local 14", city: "Eau Claire", state: "WI", phone: "(715) 878-4068", website: "ibew14.net", lat: 44.8113, lng: -91.4985, address: "9480 Highway 53, Fall Creek, WI 54742" },
  { id: 16, name: "IBEW Local 16", city: "Evansville", state: "IN", phone: "(812) 867-9670", website: "ibewlocal16.com", lat: 37.9716, lng: -87.5711, address: "9001 N Kentucky Avenue, Evansville, IN 47725" },
  { id: 20, name: "IBEW Local 20", city: "Dallas", state: "TX", phone: "(972) 263-1122", website: "ibew20.org", lat: 32.7767, lng: -96.797, address: "684 W Tarrant Road, Grand Prairie, TX 75050" },
  { id: 22, name: "IBEW Local 22", city: "Omaha", state: "NE", phone: "(402) 331-8147", website: "ibew22.org", lat: 41.2565, lng: -95.9345, address: "8946 L Street, Omaha, NE 68127" },
  { id: 24, name: "IBEW Local 24", city: "Baltimore", state: "MD", phone: "(410) 247-5511", website: "ibewlocal24.org", lat: 39.2904, lng: -76.6122, address: "2701 W Patapsco Avenue Suite 200, Baltimore, MD 21230" },
  { id: 25, name: "IBEW Local 25", city: "Hauppauge", state: "NY", phone: "(631) 273-4567", website: "ibew25.org", lat: 40.8232, lng: -73.2068, address: "370 Vanderbilt Motor Parkway, Hauppauge, NY 11788" },
  { id: 26, name: "IBEW Local 26", city: "Washington", state: "DC", phone: "(301) 459-2900", website: "ibewlocal26.org", lat: 38.9072, lng: -77.0369, address: "4371 Parliament Place Suite B, Lanham, MD 20706" },
  { id: 32, name: "IBEW Local 32", city: "Lima", state: "OH", phone: "(419) 229-2774", website: "ibew32.com", lat: 40.7426, lng: -84.1052, address: "1975 N West Street, Lima, OH 45801" },
  { id: 3401, name: "IBEW Local 34", city: "Quincy", state: "IL", phone: "(309) 673-3691", website: "ibew34.org", lat: 39.9356, lng: -91.4099, address: "4322 Ricketts Avenue, Bartonville, IL 61607" },
  { id: 35, name: "IBEW Local 35", city: "Hartford", state: "CT", phone: "(860) 525-5438", website: "ibewlocal35.org", lat: 41.7658, lng: -72.6851, address: "961 Wethersfield Avenue, Hartford, CT 06114" },
  { id: 38, name: "IBEW Local 38", city: "Cleveland", state: "OH", phone: "(216) 621-3090", website: "ibew38.org", lat: 41.4993, lng: -81.6944, address: "1590 E 23rd Street, Cleveland, OH 44114" , email: "local38@ibew38.org"},
  { id: 40, name: "IBEW Local 40", city: "Hollywood", state: "CA", phone: "(818) 762-4239", website: "ibew40.org", lat: 34.0928, lng: -118.3287, address: "5643 Vineland Avenue, North Hollywood, CA 91601" , email: "unionhall@ibew40.org"},
  { id: 41, name: "IBEW Local 41", city: "Buffalo", state: "NY", phone: "(716) 662-6111", website: "ibewlocal41.com", lat: 42.8864, lng: -78.8784, address: "S-3546 California Road, Orchard Park, NY 14127" , email: "lu41@ibewlocal41.com"},
  { id: 43, name: "IBEW Local 43", city: "Syracuse", state: "NY", phone: "(315) 422-0435", website: "ibew43.org", lat: 43.0481, lng: -76.1474, address: "4568 Waterhouse Road, Clay, NY 13041" , email: "Local43info@ibew43.org"},
  { id: 46, name: "IBEW Local 46", city: "Seattle", state: "WA", phone: "(253) 395-6500", website: "ibew46.org", lat: 47.6062, lng: -122.3321, address: "19802 62nd Avenue S Suite 105, Kent, WA 98032" },
  { id: 48, name: "IBEW Local 48", city: "Portland", state: "OR", phone: "(503) 256-4848", website: "ibew48.com", lat: 45.5231, lng: -122.6765, address: "15937 NE Airport Way, Portland, OR 97230" , email: "info@ibew48.com"},
  { id: 56, name: "IBEW Local 56", city: "Erie", state: "PA", phone: "(814) 825-5505", website: "ibewlocal56.org", lat: 42.1292, lng: -80.0851, address: "185 Pennbriar Drive, Erie, PA 16509" },
  { id: 58, name: "IBEW Local 58", city: "Detroit", state: "MI", phone: "(313) 963-2130", website: "ibewlocal58.org", lat: 42.3314, lng: -83.0458, address: "1358 Abbott Street, Detroit, MI 48226" },
  { id: 60, name: "IBEW Local 60", city: "San Antonio", state: "TX", phone: "(210) 337-1741", website: "ibewlu60.org", lat: 29.4241, lng: -98.4936, address: "3518 N Loop 1604 E, San Antonio, TX 78247" , email: "admin@ibewlu60.org"},
  { id: 64, name: "IBEW Local 64", city: "Youngstown", state: "OH", phone: "(330) 758-8654", website: "ibew64.org", lat: 41.0998, lng: -80.6495, address: "350 E Western Reserve Road, Youngstown, OH 44514" , email: "info@ibew64.org"},
  { id: 68, name: "IBEW Local 68", city: "Denver", state: "CO", phone: "(303) 297-0229", website: "ibewlu68.com", lat: 39.7392, lng: -104.9903, address: "5660 Logan Street, Denver, CO 80216" , email: "ibew@ibewlu68.com"},
  { id: 72, name: "IBEW Local 72", city: "Waco", state: "TX", phone: "(254) 754-3121", website: "ibewlu72.com", lat: 31.5493, lng: -97.1467, address: "1813 Orchard Lane, Waco, TX 76705" , email: "ibewlu72@yahoo.com"},
  { id: 73, name: "IBEW Local 73", city: "Spokane", state: "WA", phone: "(509) 326-2182", website: "ibew73.org", lat: 47.6588, lng: -117.426, address: "1616 N Washington Street, Spokane, WA 99205" , email: "info@ibew73.org"},
  { id: 76, name: "IBEW Local 76", city: "Tacoma", state: "WA", phone: "(253) 475-1190", website: "ibew76.org", lat: 47.2529, lng: -122.4443, address: "3049 S 36th Street Suite 101, Tacoma, WA 98409" },
  { id: 80, name: "IBEW Local 80", city: "Norfolk", state: "VA", phone: "(757) 480-1740", website: "ibew80.com", lat: 36.8508, lng: -76.2859, address: "5307 E Virginia Beach Boulevard, Norfolk, VA 23502" },
  { id: 81, name: "IBEW Local 81", city: "Scranton", state: "PA", phone: "(570) 344-5711", website: "ibew81.org", lat: 41.409, lng: -75.6624, address: "431 Wyoming Avenue, Scranton, PA 18503" },
  { id: 82, name: "IBEW Local 82", city: "Dayton", state: "OH", phone: "(937) 898-4239", website: "ibew82.org", lat: 39.7589, lng: -84.1916, address: "6550 Poe Avenue, Dayton, OH 45414" , email: "info@ibew82.org"},
  { id: 86, name: "IBEW Local 86", city: "Rochester", state: "NY", phone: "(585) 235-1510", website: "ibewlu86.org", lat: 43.1566, lng: -77.6088, address: "2300 E River Road, Rochester, NY 14623" },
  { id: 90, name: "IBEW Local 90", city: "New Haven", state: "CT", phone: "(203) 265-9533", website: "ibewlocal90.org", lat: 41.3083, lng: -72.9279, address: "2 N Plains Industrial Road, Wallingford, CT 06492" , email: "info@ibewlocal90.org"},
  { id: 95, name: "IBEW Local 95", city: "Joplin", state: "MO", phone: "(417) 623-2025", website: "ibewlocal95.com", lat: 37.0842, lng: -94.5133, address: "3316 S Main Street, Joplin, MO 64804" },
  { id: 96, name: "IBEW Local 96", city: "Worcester", state: "MA", phone: "(508) 753-8635", website: "ibewlocal96.org", lat: 42.2626, lng: -71.8023, address: "242 Mill Street, Worcester, MA 01602" , email: "info@ibewlocal96.org"},
  { id: 98, name: "IBEW Local 98", city: "Philadelphia", state: "PA", phone: "(215) 563-5592", website: "ibew98.org", lat: 39.9526, lng: -75.1652, address: "4960 S Twelfth Street, Philadelphia, PA 19112" , email: "ionews@ibew98.org"},
  { id: 99, name: "IBEW Local 99", city: "Providence", state: "RI", phone: "(401) 946-9900", website: "ibew99.org", lat: 41.824, lng: -71.4128, address: "22 Amflex Drive, Cranston, RI 02921" , email: "info@ibew99.org"},
  { id: 100, name: "IBEW Local 100", city: "Fresno", state: "CA", phone: "(559) 251-8241", website: "ibew100.org", lat: 36.7378, lng: -119.7871, address: "5434 E Lamona Avenue, Fresno, CA 93727" , email: "info@ibew100.org"},
  { id: 102, name: "IBEW Local 102", city: "Paterson", state: "NJ", phone: "(973) 887-1718", website: "ibew102.org", lat: 40.9168, lng: -74.1718, address: "50 Parsippany Road, Parsippany, NJ 07054" , email: "info@ibew102.org"},
  { id: 103, name: "IBEW Local 103", city: "Boston", state: "MA", phone: "(617) 436-3710", website: "ibew103.com", lat: 42.3601, lng: -71.0589, address: "256 Freeport Street, Dorchester, MA 02122" },
  { id: 106, name: "IBEW Local 106", city: "Jamestown", state: "NY", phone: "(716) 484-9449", website: "ibew106.org", lat: 42.097, lng: -79.2353, address: "322 James Avenue, Jamestown, NY 14701" , email: "general.info@ibew106.org"},
  { id: 110, name: "IBEW Local 110", city: "St. Paul", state: "MN", phone: "(651) 776-4239", website: "ibew110.org", lat: 44.9537, lng: -93.09, address: "1330 Conway Street Suite 110, St. Paul, MN 55106" , email: "Info@ibew110.org"},
  { id: 111, name: "IBEW Local 111", city: "Denver", state: "CO", phone: "(303) 744-7171", website: "ibew111.org", lat: 39.7291, lng: -104.9617, address: "5965 E 39th Avenue, Denver, CO 80207" , email: "mail@ibew111.org"},
  { id: 112, name: "IBEW Local 112", city: "Kennewick", state: "WA", phone: "(509) 735-0512", website: "ibewlu112.com", lat: 46.2112, lng: -119.1372, address: "114 N Edison Street, Kennewick, WA 99336" },
  { id: 113, name: "IBEW Local 113", city: "Colorado Springs", state: "CO", phone: "(719) 633-3872", website: "ibew113.com", lat: 38.8339, lng: -104.8214, address: "2150 Naegele Road, Colorado Springs, CO 80904" },
  { id: 117, name: "IBEW Local 117", city: "Elgin", state: "IL", phone: "(847) 854-7200", website: "ibew117.com", lat: 42.0354, lng: -88.2826, address: "765 Munshaw Lane, Crystal Lake, IL 60014" , email: "office@ibew117.com"},
  { id: 124, name: "IBEW Local 124", city: "Kansas City", state: "MO", phone: "(816) 942-7500", website: "ibew124.org", lat: 39.0997, lng: -94.5786, address: "301 E 103rd Terrace, Kansas City, MO 64114" , email: "ibew@ibewlocal124.org"},
  { id: 127, name: "IBEW Local 127", city: "Kenosha", state: "WI", phone: "(262) 654-0912", website: "ibew127.org", lat: 42.5847, lng: -87.8212, address: "3030 39th Avenue, Kenosha, WI 53144" , email: "ibew127@gmail.com"},
  { id: 129, name: "IBEW Local 129", city: "Lorain", state: "OH", phone: "(440) 233-7156", website: "ibew129.org", lat: 41.4523, lng: -82.1824, address: "6100 S Broadway Suite 201, Lorain, OH 44053" , email: "info@ibew129.org"},
  { id: 130, name: "IBEW Local 130", city: "New Orleans", state: "LA", phone: "(504) 831-1372", website: "ibewlu130.com", lat: 29.9511, lng: -90.0715, address: "3200 Ridgelake Drive Suite 300, Metairie, LA 70002" },
  { id: 131, name: "IBEW Local 131", city: "Kalamazoo", state: "MI", phone: "(269) 382-1762", website: "ibew131.com", lat: 42.2917, lng: -85.5872, address: "3641 E Cork Street, Kalamazoo, MI 49001" , email: "office@ibew131.com"},
  { id: 134, name: "IBEW Local 134", city: "Chicago", state: "IL", phone: "(312) 454-1340", website: "ibew134.org", lat: 41.8781, lng: -87.6298, address: "2722 S Martin Luther King Drive, Chicago, IL 60616" , email: "info@local134.org"},
  { id: 136, name: "IBEW Local 136", city: "Birmingham", state: "AL", phone: "(205) 833-0909", website: "ibew136.org", lat: 33.5186, lng: -86.8104, address: "845 Gadsden Highway, Birmingham, AL 35235" , email: "ibew136@ibew136.org"},
  { id: 139, name: "IBEW Local 139", city: "Elmira", state: "NY", phone: "(607) 732-1237", website: "ibew139.com", lat: 42.0898, lng: -76.8077, address: "415 W Second Street, Elmira, NY 14901" , email: "businessmanager@ibewlocal139.org"},
  { id: 141, name: "IBEW Local 141", city: "Wheeling", state: "WV", phone: "(304) 242-3870", website: "ibew141.org", lat: 40.064, lng: -80.7209, address: "Wheeling, WV" , email: "info@ibew141.org"},
  { id: 143, name: "IBEW Local 143", city: "Harrisburg", state: "PA", phone: "(717) 232-7093", website: "ibewlocal143.org", lat: 40.2732, lng: -76.8867, address: "1501 Revere Street, Harrisburg, PA 17104" },
  { id: 145, name: "IBEW Local 145", city: "Davenport", state: "IA", phone: "(309) 736-4239", website: "ibewlocal145.com", lat: 41.5236, lng: -90.5776, address: "1700 52nd Avenue Suite A, Moline, IL 61265" , email: "info@ibewlocal145.com"},
  { id: 146, name: "IBEW Local 146", city: "Decatur", state: "IL", phone: "(217) 877-4604", website: "ibew146.com", lat: 39.8403, lng: -88.9548, address: "3390 N Woodford Street, Decatur, IL 62526" },
  { id: 150, name: "IBEW Local 150", city: "Waukegan", state: "IL", phone: "(847) 680-1504", website: "ibew150.org", lat: 42.3636, lng: -87.8448, address: "31290 N US Highway 45 Unit B, Libertyville, IL 60048" },
  { id: 153, name: "IBEW Local 153", city: "South Bend", state: "IN", phone: "(574) 287-8655", website: "ibew153.com", lat: 41.6764, lng: -86.252, address: "56475 Peppermint Road, South Bend, IN 46619" , email: "ibew@ibew153.com"},
  { id: 158, name: "IBEW Local 158", city: "Green Bay", state: "WI", phone: "(920) 432-0158", website: "ibew158.com", lat: 44.5133, lng: -88.0133, address: "2970 Greenbrier Road, Green Bay, WI 54311" },
  { id: 159, name: "IBEW Local 159", city: "Madison", state: "WI", phone: "(608) 255-2989", website: "ibew159.org", lat: 43.0731, lng: -89.4012, address: "5303 Fen Oak Drive, Madison, WI 53718" , email: "office@ibew159.org"},
  { id: 163, name: "IBEW Local 163", city: "Wilkes-Barre", state: "PA", phone: "(570) 823-4028", website: "ibew163.org", lat: 41.2459, lng: -75.8813, address: "1269 Sans Souci Parkway, Wilkes-Barre, PA 18706" , email: "electricians@ibew163.org"},
  { id: 164, name: "IBEW Local 164", city: "Jersey City", state: "NJ", phone: "(201) 265-1700", website: "ibew164.org", lat: 40.7178, lng: -74.0431, address: "205 Robin Road Suite 315, Paramus, NJ 07652" , email: "ibew164@ibew164.org"},
  { id: 175, name: "IBEW Local 175", city: "Chattanooga", state: "TN", phone: "(423) 894-3557", website: "ibew175.org", lat: 35.0456, lng: -85.3097, address: "3922 Volunteer Drive Suite 9, Chattanooga, TN 37416" , email: "office@ibew175.org"},
  { id: 176, name: "IBEW Local 176", city: "Joliet", state: "IL", phone: "(815) 729-1240", website: "ibewlocal176.org", lat: 41.525, lng: -88.0817, address: "1100 NE Frontage Road, Joliet, IL 60431" , email: "office@ibewlocal176.org"},
  { id: 177, name: "IBEW Local 177", city: "Jacksonville", state: "FL", phone: "(904) 355-4569", website: "ibew177.org", lat: 30.3266, lng: -81.6659, address: "966 Liberty Street, Jacksonville, FL 32206" , email: "office@ibew177.org"},
  { id: 180, name: "IBEW Local 180", city: "Napa", state: "CA", phone: "(707) 251-9180", website: "ibewlu180.org", lat: 38.2975, lng: -122.2869, address: "720 Technology Way-B, Napa, CA 94558" },
  { id: 191, name: "IBEW Local 191", city: "Everett", state: "WA", phone: "(425) 259-3195", website: "ibew191.com", lat: 47.979, lng: -122.2021, address: "3100 164th Street NE, Marysville, WA 98271" },
  { id: 193, name: "IBEW Local 193", city: "Springfield", state: "IL", phone: "(217) 544-3479", website: "ibew193.com", lat: 39.7817, lng: -89.6501, address: "3150 Wide Track Drive, Springfield, IL 62703" , email: "office@ibew193.com"},
  { id: 194, name: "IBEW Local 194", city: "Shreveport", state: "LA", phone: "(318) 688-0194", website: "ibew194.org", lat: 32.5252, lng: -93.7502, address: "5510 Buncombe Road, Shreveport, LA 71129" },
  { id: 197, name: "IBEW Local 197", city: "Bloomington", state: "IL", phone: "(309) 827-4868", website: "ibew197.org", lat: 40.4842, lng: -88.9937, address: "2407 Beich Road Suite A, Bloomington, IL 61705" , email: "info@ibew197.org"},
  { id: 212, name: "IBEW Local 212", city: "Cincinnati", state: "OH", phone: "(513) 559-0200", website: "local212.com", lat: 39.1031, lng: -84.512, address: "212 Crowne Point Place Suite 101, Cincinnati, OH 45241" , email: "office@local212.com"},
  { id: 223, name: "IBEW Local 223", city: "Brockton", state: "MA", phone: "(508) 880-2690", website: "ibew223.org", lat: 42.0834, lng: -71.0184, address: "475 Myles Standish Boulevard, Taunton, MA 02780" },
  { id: 226, name: "IBEW Local 226", city: "Topeka", state: "KS", phone: "(785) 232-1761", website: "ibew226.com", lat: 39.0473, lng: -95.6752, address: "1620 NW Gage Boulevard, Topeka, KS 66618" },
  { id: 229, name: "IBEW Local 229", city: "York", state: "PA", phone: "(717) 843-8368", website: "ibew229.org", lat: 39.9626, lng: -76.7277, address: "555 Willow Springs Lane, York, PA 17406" },
  { id: 231, name: "IBEW Local 231", city: "Sioux City", state: "IA", phone: "(712) 255-8138", website: "ibew231.com", lat: 42.4999, lng: -96.4003, address: "5001 Harbor Drive, Sioux City, IA 51111" },
  { id: 233, name: "IBEW Local 233", city: "Helena", state: "MT", phone: "(406) 442-3185", website: "ibew233.org", lat: 46.5958, lng: -112.027, address: "110 N Warren Street Suite 1, Helena, MT 59601" , email: "office@ibew233.org"},
  { id: 234, name: "IBEW Local 234", city: "Salinas", state: "CA", phone: "(831) 633-2311", website: "ibew234.org", lat: 36.6777, lng: -121.6555, address: "747 El Camino Real N, Salinas, CA 93907" , email: "thehall@ibew234.org"},
  { id: 236, name: "IBEW Local 236", city: "Albany", state: "NY", phone: "(518) 783-9957", website: "ibew236.org", lat: 42.6526, lng: -73.7562, address: "3000 Troy Schenectady Road, Niskayuna, NY 12309" },
  { id: 237, name: "IBEW Local 237", city: "Niagara Falls", state: "NY", phone: "(716) 297-3650", website: "ibew237.com", lat: 43.0962, lng: -79.0377, address: "6700 Schultz Street, Niagara Falls, NY 14304" },
  { id: 238, name: "IBEW Local 238", city: "Asheville", state: "NC", phone: null, website: null, lat: 35.5951, lng: -82.5515, address: "Asheville, NC" },
  { id: 241, name: "IBEW Local 241", city: "Ithaca", state: "NY", phone: "(607) 272-2809", website: "ibewlocal241.com", lat: 42.444, lng: -76.5021, address: "134 Cecil A. Malone Drive, Ithaca, NY 14850" , email: "businessmanager@ibewlocal241.com"},
  { id: 242, name: "IBEW Local 242", city: "Duluth", state: "MN", phone: "(218) 728-6895", website: "ibew242.org", lat: 46.7867, lng: -92.1005, address: "2002 London Road Room 111, Duluth, MN 55812" },
  { id: 246, name: "IBEW Local 246", city: "Steubenville", state: "OH", phone: "(740) 282-7572", website: null, lat: 40.3698, lng: -80.6337, address: "626 N Fourth Street, Steubenville, OH 43952" },
  { id: 252, name: "IBEW Local 252", city: "Ann Arbor", state: "MI", phone: "(734) 424-0978", website: "ibew252.org", lat: 42.2808, lng: -83.743, address: "7920 Jackson Road Suite A, Ann Arbor, MI 48103" , email: "info@ibew252.org"},
  { id: 257, name: "IBEW Local 257", city: "Jefferson City", state: "MO", phone: "(573) 635-2133", website: "ibew257.org", lat: 38.5767, lng: -92.1735, address: "209 Flora Drive, Jefferson City, MO 65101" , email: "ibew257@ibew257.org"},
  { id: 265, name: "IBEW Local 265", city: "Lincoln", state: "NE", phone: "(402) 423-4497", website: "ibew265.org", lat: 40.8136, lng: -96.7026, address: "1409 Old Farm Road, Lincoln, NE 68512" , email: "info@ibew265.org"},
  { id: 269, name: "IBEW Local 269", city: "Trenton", state: "NJ", phone: "(609) 394-8129", website: "ibew269.com", lat: 40.2171, lng: -74.7429, address: "670 Whitehead Road, Trenton, NJ 08648" },
  { id: 270, name: "IBEW Local 270", city: "Oak Ridge", state: "TN", phone: "(865) 483-1354", website: "ibewlocal270.org", lat: 36.0104, lng: -84.2696, address: "138 N Lincoln Circle, Oak Ridge, TN 37830" , email: "ibew270@comcast.net"},
  { id: 271, name: "IBEW Local 271", city: "Wichita", state: "KS", phone: "(316) 267-8255", website: "ibew271.com", lat: 37.6872, lng: -97.3301, address: "1040 S Broadway, Wichita, KS 67211" , email: "IBEWlu271@hotmail.com"},
  { id: 275, name: "IBEW Local 275", city: "Coopersville", state: "MI", phone: "(616) 837-7149", website: "ibew275.org", lat: 43.0648, lng: -85.9286, address: "140 N 64th Avenue, Coopersville, MI 49404" , email: "info@ibew275.org"},
  { id: 278, name: "IBEW Local 278", city: "Corpus Christi", state: "TX", phone: "(361) 855-1084", website: "ibew278.com", lat: 27.8006, lng: -97.3964, address: "2301 Saratoga Boulevard, Corpus Christi, TX 78417" , email: "office@ibew278.com"},
  { id: 280, name: "IBEW Local 280", city: "Tangent", state: "OR", phone: "(541) 812-1771", website: "ibew280.org", lat: 44.5429, lng: -123.1065, address: "32969 Highway 99 E, Tangent, OR 97389" , email: "info@ibew280.org"},
  { id: 288, name: "IBEW Local 288", city: "Waterloo", state: "IA", phone: "(319) 233-8050", website: "ibew288.org", lat: 42.4928, lng: -92.3426, address: "1695 Burton Avenue, Waterloo, IA 50703" },
  { id: 291, name: "IBEW Local 291", city: "Boise", state: "ID", phone: "(208) 343-4861", website: "ibew291.org", lat: 43.615, lng: -116.2023, address: "225 N Sixteenth Street Suite 110, Boise, ID 83702" , email: "office@ibew291.org"},
  { id: 292, name: "IBEW Local 292", city: "Minneapolis", state: "MN", phone: "(612) 379-1292", website: "ibew292.org", lat: 44.9778, lng: -93.265, address: "6700 W Broadway Avenue, Brooklyn Park, MN 55428" , email: "office@ibew292.org"},
  { id: 294, name: "IBEW Local 294", city: "Hibbing", state: "MN", phone: null, website: null, lat: 47.4275, lng: -92.9377, address: "Hibbing, MN" },
  { id: 295, name: "IBEW Local 295", city: "Little Rock", state: "AR", phone: "(501) 562-2244", website: "ibew295.org", lat: 34.7465, lng: -92.2896, address: "7320 S University Avenue, Little Rock, AR 72209" , email: "ibew295@ibew295.org"},
  { id: 300, name: "IBEW Local 300", city: "Burlington", state: "VT", phone: "(802) 864-5864", website: "ibewlocal300.org", lat: 44.4759, lng: -73.2121, address: "3 Gregory Drive, South Burlington, VT 05403" , email: "info@ibewlocal300.org"},
  { id: 301, name: "IBEW Local 301", city: "Texarkana", state: "TX", phone: "(903) 838-8531", website: null, lat: 33.4251, lng: -94.0477, address: "114 Elm Street, Nash, TX 75569" },
  { id: 302, name: "IBEW Local 302", city: "Martinez", state: "CA", phone: "(925) 228-2302", website: "ibewlu302.com", lat: 38.0194, lng: -122.1341, address: "1875 Arnold Drive, Martinez, CA 94553" , email: "ibinfo@ibewlu302.com"},
  { id: 305, name: "IBEW Local 305", city: "Fort Wayne", state: "IN", phone: "(260) 484-9714", website: "ibew305.org", lat: 41.1306, lng: -85.1289, address: "136 Chambeau Road, Fort Wayne, IN 46805" , email: "local305@ibew305.org"},
  { id: 306, name: "IBEW Local 306", city: "Akron", state: "OH", phone: "(330) 245-2240", website: "ibew306.org", lat: 41.0814, lng: -81.519, address: "2650 S Main Street Suite 200, Akron, OH 44319" , email: "info@ibew306.org"},
  { id: 307, name: "IBEW Local 307", city: "Cumberland", state: "MD", phone: "(301) 724-3403", website: "ibew307.org", lat: 39.6529, lng: -78.7625, address: "401 Decatur Street, Cumberland, MD 21502" , email: "administrator@ibew307.org"},
  { id: 309, name: "IBEW Local 309", city: "Collinsville", state: "IL", phone: "(618) 345-5112", website: "ibew309.com", lat: 38.6703, lng: -89.9845, address: "2000A Mall Street, Collinsville, IL 62234" , email: "electricians@ibew309.org"},
  { id: 313, name: "IBEW Local 313", city: "New Castle", state: "DE", phone: "(302) 328-0773", website: "ibew313.org", lat: 39.6595, lng: -75.5671, address: "814 W Basin Road, New Castle, DE 19720" , email: "info@ibew313.org"},
  { id: 317, name: "IBEW Local 317", city: "Huntington", state: "WV", phone: "(304) 429-5013", website: "ibew317.net", lat: 38.4193, lng: -82.4452, address: "1848 Madison Avenue Suite A, Huntington, WV 25704" , email: "office@ibew317.com"},
  { id: 322, name: "IBEW Local 322", city: "Casper", state: "WY", phone: "(307) 265-1060", website: "ibew322.org", lat: 42.8501, lng: -106.3252, address: "691 English Drive, Casper, WY 82601" , email: "office@ibew322.org"},
  { id: 325, name: "IBEW Local 325", city: "Binghamton", state: "NY", phone: "(607) 729-6171", website: "ibew325.net", lat: 42.0987, lng: -75.918, address: "142 Corporate Drive, Binghamton, NY 13904" , email: "businessmanager@ibew325.net"},
  { id: 332, name: "IBEW Local 332", city: "San Jose", state: "CA", phone: "(408) 269-4332", website: "ibew332.org", lat: 37.3382, lng: -121.8863, address: "2125 Canoas Garden Avenue Suite 100, San Jose, CA 95125" , email: "info@ibew332.org"},
  { id: 340, name: "IBEW Local 340", city: "Sacramento", state: "CA", phone: "(916) 927-4239", website: "ibewlocal340.org", lat: 38.5816, lng: -121.4944, address: "10240 Systems Parkway Suite 100, Sacramento, CA 95827" , email: "office@ibewlocal340.org"},
  { id: 342, name: "IBEW Local 342", city: "Greensboro", state: "NC", phone: "(336) 285-7781", website: "ibew342.org", lat: 36.0726, lng: -79.792, address: "7874 Thorndike Road, Greensboro, NC 27409" , email: "ibew342@att.net"},
  { id: 343, name: "IBEW Local 343", city: "Rochester", state: "MN", phone: "(507) 282-7081", website: "ibewlocal343.org", lat: 43.9695, lng: -92.4663, address: "9 80th Street SE, Rochester, MN 55904" },
  { id: 347, name: "IBEW Local 347", city: "Des Moines", state: "IA", phone: "(515) 243-1924", website: "ibewlu347.org", lat: 41.5868, lng: -93.625, address: "6809 SE Bellagio Court, Ankeny, IA 50021" , email: "info@ibewlu347.org"},
  { id: 349, name: "IBEW Local 349", city: "Miami", state: "FL", phone: "(305) 325-1330", website: "ibew349.net", lat: 25.7974, lng: -80.222, address: "1657 NW Seventeenth Avenue, Miami, FL 33125" , email: "info@ibew349.org"},
  { id: 350, name: "IBEW Local 350", city: "Hannibal", state: "MO", phone: "(573) 221-2648", website: null, lat: 39.7081, lng: -91.3568, address: "801 Church Street, Hannibal, MO 63401" , email: "ibew350@outlook.com"},
  { id: 351, name: "IBEW Local 351", city: "Folsom", state: "NJ", phone: "(609) 704-8351", website: "ibew351.org", lat: 39.6059, lng: -74.8574, address: "1113 Black Horse Pike, Hammonton, NJ 08037" },
  { id: 354, name: "IBEW Local 354", city: "Salt Lake City", state: "UT", phone: "(801) 972-9354", website: "ibew354.org", lat: 40.7608, lng: -111.891, address: "3400 W 2100 S, Salt Lake City, UT 84119" , email: "office@ibew354.org"},
  { id: 357, name: "IBEW Local 357", city: "Las Vegas", state: "NV", phone: "(702) 452-9357", website: "ibew357.net", lat: 36.1699, lng: -115.1398, address: "808 N Lamb Boulevard, Las Vegas, NV 89110" , email: "ibew357@ibew357.net"},
  { id: 363, name: "IBEW Local 363", city: "New City", state: "NY", phone: "(845) 783-3500", website: "ibewlu363.org", lat: 41.1476, lng: -73.989, address: "67 Commerce Drive S, Harriman, NY 10926" , email: "office363@ibewlu363.org"},
  { id: 364, name: "IBEW Local 364", city: "Rockford", state: "IL", phone: "(815) 398-6282", website: "ibew364.org", lat: 42.2711, lng: -89.094, address: "6820 Mill Road, Rockford, IL 61108" , email: "office@ibew364.net"},
  { id: 369, name: "IBEW Local 369", city: "Louisville", state: "KY", phone: "(502) 368-2568", website: "ibewlocal369.com", lat: 38.2527, lng: -85.7585, address: "4315 Preston Highway Suite 102, Louisville, KY 40213" , email: "ehall@ibewlocal369.com"},
  { id: 375, name: "IBEW Local 375", city: "Allentown", state: "PA", phone: "(610) 432-9762", website: "ibew375.org", lat: 40.6084, lng: -75.4902, address: "101 S Seventh Street, Allentown, PA 18101" },
  { id: 379, name: "IBEW Local 379", city: "Charlotte", state: "NC", phone: "(704) 455-4595", website: "ibew379.org", lat: 35.2271, lng: -80.8431, address: "1900 Cross Beam Drive, Charlotte, NC 28217" , email: "ibewlu379@ibew379.org"},
  { id: 388, name: "IBEW Local 388", city: "Stevens Point", state: "WI", phone: "(715) 341-2696", website: "ibewlocal388.org", lat: 44.5236, lng: -89.5746, address: "5224 Heffron Court, Stevens Point, WI 54481" , email: "info@ibewlocal388.org"},
  { id: 400, name: "IBEW Local 400", city: "Asbury Park", state: "NJ", phone: "(732) 681-7111", website: "ibew400.org", lat: 40.2204, lng: -74.0121, address: "3301 Highway 138 E, Wall, NJ 07719" },
  { id: 401, name: "IBEW Local 401", city: "Reno", state: "NV", phone: "(775) 329-2566", website: "ibewlocal401.org", lat: 39.5296, lng: -119.8138, address: "4635 Longley Lane Suite 109, Reno, NV 89502" , email: "ibew401@ibewlocal401.org"},
  { id: 405, name: "IBEW Local 405", city: "Cedar Rapids", state: "IA", phone: "(319) 396-8241", website: "ibew405.org", lat: 41.9779, lng: -91.6656, address: "1211 Wiley Boulevard SW, Cedar Rapids, IA 52404" , email: "ibew405@ibew405.org"},
  { id: 413, name: "IBEW Local 413", city: "Santa Barbara", state: "CA", phone: "(805) 688-8083", website: "ibew413.org", lat: 34.4208, lng: -119.6982, address: "100 Thomas Road, Buellton, CA 93427" },
  { id: 415, name: "IBEW Local 415", city: "Cheyenne", state: "WY", phone: "(307) 632-5944", website: "ibew415.org", lat: 41.14, lng: -104.8202, address: "810 Fremont Avenue, Cheyenne, WY 82001" , email: "info@ibew415.org"},
  { id: 426, name: "IBEW Local 426", city: "Sioux Falls", state: "SD", phone: "(605) 336-0370", website: "ibew426.com", lat: 43.5446, lng: -96.7311, address: "3725 N Fourth Avenue, Sioux Falls, SD 57104" , email: "office@ibew426.com"},
  { id: 428, name: "IBEW Local 428", city: "Bakersfield", state: "CA", phone: "(661) 323-2979", website: "ibew428.org", lat: 35.3733, lng: -119.0187, address: "3921 N Sillect Avenue, Bakersfield, CA 93308" , email: "mail@ibew428.org"},
  { id: 429, name: "IBEW Local 429", city: "Nashville", state: "TN", phone: "(615) 889-4429", website: "ibew429.org", lat: 36.1627, lng: -86.7816, address: "2001 Elm Hill Pike, Nashville, TN 37210" , email: "ibew429@ibew429.org"},
  { id: 430, name: "IBEW Local 430", city: "Racine", state: "WI", phone: "(262) 633-2844", website: "ibewlu430.org", lat: 42.7261, lng: -87.7829, address: "1840 Sycamore Avenue, Racine, WI 53406" , email: "info@ibewlu430.org"},
  { id: 436, name: "IBEW Local 436", city: "El Dorado", state: "AR", phone: "(870) 863-9181", website: null, lat: 33.2009, lng: -92.666, address: "810 N Newton Street, El Dorado, AR 71730" , email: "ibewl436@sbcglobal.net"},
  { id: 440, name: "IBEW Local 440", city: "Riverside", state: "CA", phone: "(951) 684-5665", website: "ibew440.org", lat: 33.9533, lng: -117.3961, address: "1605 Spruce Street, Riverside, CA 92507" , email: "contact@ibew440.org"},
  { id: 441, name: "IBEW Local 441", city: "Orange County", state: "CA", phone: "(714) 939-3131", website: "ibewoc.com", lat: 33.7175, lng: -117.8311, address: "309 N Rampart Street Suite M, Orange, CA 92868" , email: "admin@ibewoc.com"},
  { id: 443, name: "IBEW Local 443", city: "Montgomery", state: "AL", phone: "(334) 272-8830", website: "ibew443.org", lat: 32.3668, lng: -86.2999, address: "1469 Jean Street, Montgomery, AL 36107" , email: "info@ibew443.org"},
  { id: 444, name: "IBEW Local 444", city: "Ponca City", state: "OK", phone: "(580) 762-4441", website: null, lat: 36.707, lng: -97.0856, address: "200 N Second Street, Ponca City, OK 74601" , email: "ibew444@sbcglobal.net"},
  { id: 445, name: "IBEW Local 445", city: "Battle Creek", state: "MI", phone: "(269) 964-4545", website: "ibew445.com", lat: 42.3212, lng: -85.1797, address: "4071 W Dickman Road, Springfield, MI 49037" , email: "info@ibew445.com"},
  { id: 446, name: "IBEW Local 446", city: "Monroe", state: "LA", phone: "(318) 323-3350", website: "ibew446.com", lat: 32.5093, lng: -92.1193, address: "805 N 30th Street, Monroe, LA 71201" , email: "ibew446@gmail.com"},
  { id: 449, name: "IBEW Local 449", city: "Pocatello", state: "ID", phone: "(208) 232-5263", website: "ibewlocal449.org", lat: 42.8713, lng: -112.4455, address: "1537 Baldy Avenue, Pocatello, ID 83201" , email: "office@ibewlocal449.org"},
  { id: 453, name: "IBEW Local 453", city: "Springfield", state: "MO", phone: "(417) 869-7251", website: "ibew453.com", lat: 37.209, lng: -93.2923, address: "2902 E Division Street, Springfield, MO 65803" },
  { id: 461, name: "IBEW Local 461", city: "Aurora", state: "IL", phone: "(630) 897-0461", website: "ibew461.org", lat: 41.7606, lng: -88.3201, address: "591 Sullivan Road Suite 100, Aurora, IL 60506" , email: "adminoffice@ibew461.com"},
  { id: 466, name: "IBEW Local 466", city: "Charleston", state: "WV", phone: "(304) 342-0800", website: "ibew466.org", lat: 38.3498, lng: -81.6326, address: "800 Indiana Avenue, Charleston, WV 25302" },
  { id: 474, name: "IBEW Local 474", city: "Memphis", state: "TN", phone: "(901) 726-4060", website: "ibewlocal474.com", lat: 35.1495, lng: -90.049, address: "1870 Madison Avenue, Memphis, TN 38104" , email: "info@ibewlocal474.com"},
  { id: 477, name: "IBEW Local 477", city: "San Bernardino", state: "CA", phone: "(909) 890-0607", website: "ibew477.org", lat: 34.1083, lng: -117.2898, address: "1875 Business Center Drive, San Bernardino, CA 92408" },
  { id: 479, name: "IBEW Local 479", city: "Beaumont", state: "TX", phone: "(409) 833-8252", website: "ibew479.com", lat: 30.086, lng: -94.1018, address: "1430 Spindletop Road, Beaumont, TX 77705" },
  { id: 480, name: "IBEW Local 480", city: "Jackson", state: "MS", phone: "(601) 373-8434", website: "ibew480.org", lat: 32.2988, lng: -90.1848, address: "4767 I-55 S, Jackson, MS 39212" , email: "ibew480@ibew480.org"},
  { id: 481, name: "IBEW Local 481", city: "Indianapolis", state: "IN", phone: "(317) 923-2596", website: "ibew481.org", lat: 39.7684, lng: -86.1581, address: "1828 N Meridian Street Suite 205, Indianapolis, IN 46202" , email: "info@ibew481.org"},
  { id: 488, name: "IBEW Local 488", city: "Bridgeport", state: "CT", phone: "(203) 452-7679", website: "ibewlocal488.org", lat: 41.1865, lng: -73.1952, address: "721 Main Street, Monroe, CT 06468" , email: "office@ibewlocal488.org"},
  { id: 490, name: "IBEW Local 490", city: "Concord", state: "NH", phone: "(603) 224-4239", website: "ibew490.org", lat: 43.2081, lng: -71.5376, address: "48 Airport Road, Concord, NH 03301" , email: "info@ibew490.org"},
  { id: 494, name: "IBEW Local 494", city: "Milwaukee", state: "WI", phone: "(414) 327-5202", website: "ibew494.com", lat: 43.0389, lng: -87.9065, address: "3303 S 103rd Street, Milwaukee, WI 53227" },
  { id: 495, name: "IBEW Local 495", city: "Wilmington", state: "NC", phone: "(910) 660-8630", website: null, lat: 34.2257, lng: -77.9447, address: "2725 Old Wrightsboro Road Unit 3C, Wilmington, NC 28405" , email: "ibewunion495@gmail.com"},
  { id: 498, name: "IBEW Local 498", city: "Traverse City", state: "MI", phone: "(231) 943-4980", website: "ibewlocal498.com", lat: 44.7631, lng: -85.6206, address: "3912 Blair Townhall Road W, Traverse City, MI 49685" , email: "ibew@local498.net"},
  { id: 505, name: "IBEW Local 505", city: "Mobile", state: "AL", phone: "(251) 476-0275", website: "ibew505.org", lat: 30.6954, lng: -88.0399, address: "2244 Halls Mill Road, Mobile, AL 36606" , email: "info@ibew505.org"},
  { id: 508, name: "IBEW Local 508", city: "Savannah", state: "GA", phone: "(912) 964-5080", website: "ibewlocal508.org", lat: 32.0835, lng: -81.0998, address: "1526 Dean Forest Road, Savannah, GA 31408" , email: "officemanager@ibewlocal508.org"},
  { id: 518, name: "IBEW Local 518", city: "Globe", state: "AZ", phone: "(928) 425-8177", website: null, lat: 33.3942, lng: -110.7865, address: "1383 N AZ Highway 188, Globe, AZ 85501" , email: "ibew518@hotmail.com"},
  { id: 520, name: "IBEW Local 520", city: "Austin", state: "TX", phone: "(512) 326-9540", website: "ibew520.org", lat: 30.2672, lng: -97.7431, address: "4818 E Ben White Boulevard Suite 300, Austin, TX 78741" , email: "info@ibew520.org"},
  { id: 527, name: "IBEW Local 527", city: "Galveston", state: "TX", phone: "(409) 933-9800", website: "ibew527.com", lat: 29.3013, lng: -94.7977, address: "2509 FM 2004, Texas City, TX 77591" , email: "LU@ibew527.com"},
  { id: 531, name: "IBEW Local 531", city: "La Porte", state: "IN", phone: "(219) 362-2119", website: "ibewlocal531.org", lat: 41.61, lng: -86.7225, address: "2751 N State Road 39, LaPorte, IN 46350" },
  { id: 532, name: "IBEW Local 532", city: "Billings", state: "MT", phone: "(406) 248-9119", website: "ibew532.com", lat: 45.7833, lng: -108.5007, address: "5200 Midland Road, Billings, MT 59101" , email: "office@ibew532.com"},
  { id: 538, name: "IBEW Local 538", city: "Danville", state: "IL", phone: "(217) 442-0996", website: "ibew538.org", lat: 40.1242, lng: -87.63, address: "1290 N Michigan Avenue, Danville, IL 61834" , email: "ibew@ibew538.com"},
  { id: 540, name: "IBEW Local 540", city: "Canton", state: "OH", phone: "(330) 837-4239", website: "ibew540.org", lat: 40.7989, lng: -81.3784, address: "2333 Nave Road SE, Massillon, OH 44646" },
  { id: 545, name: "IBEW Local 545", city: "St. Joseph", state: "MO", phone: "(816) 232-3578", website: "ibewlocal545.net", lat: 39.7675, lng: -94.8467, address: "5804 Corporate Drive, St. Joseph, MO 64507" },
  { id: 551, name: "IBEW Local 551", city: "Santa Rosa", state: "CA", phone: "(707) 542-3505", website: "ibewlocal551.org", lat: 38.4404, lng: -122.7141, address: "2525 Cleveland Avenue Suite B, Santa Rosa, CA 95403" , email: "ibew551@ibewlocal551.org"},
  { id: 553, name: "IBEW Local 553", city: "Raleigh", state: "NC", phone: "(919) 596-8220", website: "ibew553.org", lat: 35.7796, lng: -78.6382, address: "3300 New Raleigh Highway, Durham, NC 27703" , email: "office@ibew553.org"},
  { id: 557, name: "IBEW Local 557", city: "Saginaw", state: "MI", phone: "(989) 781-0516", website: "ibew557.org", lat: 43.4195, lng: -83.9508, address: "7303 Gratiot Road, Saginaw, MI 48609" },
  { id: 558, name: "IBEW Local 558", city: "Sheffield", state: "AL", phone: "(256) 383-2279", website: "ibew558.org", lat: 34.7651, lng: -87.6975, address: "1803 E Seventeenth Street, Sheffield, AL 35660" , email: "info@ibew558.org"},
  { id: 567, name: "IBEW Local 567", city: "Auburn", state: "ME", phone: "(207) 786-9770", website: "ibew567.com", lat: 44.0979, lng: -70.2312, address: "238 Goddard Road, Lewiston, ME 04240" , email: "info@ibew567.com"},
  { id: 569, name: "IBEW Local 569", city: "San Diego", state: "CA", phone: "(858) 569-8900", website: "ibew569.org", lat: 32.7157, lng: -117.1611, address: "4545 Viewridge Avenue Suite 100, San Diego, CA 92123" },
  { id: 570, name: "IBEW Local 570", city: "Tucson", state: "AZ", phone: "(520) 622-6745", website: "ibew570.org", lat: 32.2226, lng: -110.9747, address: "750 S Tucson Boulevard, Tucson, AZ 85716" },
  { id: 573, name: "IBEW Local 573", city: "Warren", state: "OH", phone: "(330) 394-3606", website: "ibew573.org", lat: 41.2376, lng: -80.8184, address: "4550 Research Parkway NW, Warren, OH 44483" },
  { id: 575, name: "IBEW Local 575", city: "Portsmouth", state: "OH", phone: "(740) 353-8000", website: "ibew575.org", lat: 38.7318, lng: -82.9977, address: "110 Offnere Street, Portsmouth, OH 45662" , email: "office@ibew575.com"},
  { id: 576, name: "IBEW Local 576", city: "Alexandria", state: "LA", phone: "(318) 443-5811", website: null, lat: 31.3113, lng: -92.4451, address: "6703 Masonic Drive, Alexandria, LA 71301" , email: "office@ibewlocal576.com"},
  { id: 577, name: "IBEW Local 577", city: "Appleton", state: "WI", phone: "(920) 739-9408", website: "ibewlu577.com", lat: 44.2619, lng: -88.4154, address: "1024 S Lawe Street, Appleton, WI 54915" , email: "admin@ibewlu577.com"},
  { id: 584, name: "IBEW Local 584", city: "Tulsa", state: "OK", phone: "(918) 592-2989", website: "ibew584.com", lat: 36.1539, lng: -95.9928, address: "584 S Lewis Avenue, Tulsa, OK 74104" , email: "office@ibew584.com"},
  { id: 596, name: "IBEW Local 596", city: "Clarksburg", state: "WV", phone: "(304) 622-0151", website: "ibew596.com", lat: 39.2806, lng: -80.3445, address: "1001 N Twelfth Street, Clarksburg, WV 26301" },
  { id: 601, name: "IBEW Local 601", city: "Champaign", state: "IL", phone: "(217) 352-1741", website: "ibew601.org", lat: 40.1164, lng: -88.2434, address: "3301 N Boardwalk Drive, Champaign, IL 61822" , email: "office@ibew601.org"},
  { id: 602, name: "IBEW Local 602", city: "Amarillo", state: "TX", phone: "(806) 376-9945", website: "ibew602.org", lat: 35.222, lng: -101.8313, address: "200 S Fannin Street, Amarillo, TX 79106" , email: "admin@ibew602.org"},
  { id: 606, name: "IBEW Local 606", city: "Orlando", state: "FL", phone: "(407) 896-7271", website: "ibew606.org", lat: 28.56, lng: -81.3675, address: "820 Virginia Drive, Orlando, FL 32803" , email: "info@ibew606.org"},
  { id: 607, name: "IBEW Local 607", city: "Shamokin", state: "PA", phone: "(570) 648-9831", website: "ibew607.com", lat: 40.7887, lng: -76.5586, address: "25 S Fifth Street, Shamokin, PA 17872" },
  { id: 611, name: "IBEW Local 611", city: "Albuquerque", state: "NM", phone: "(505) 343-0611", website: "ibew611.org", lat: 35.0844, lng: -106.6504, address: "4921 Alexander Boulevard NE Suite A, Albuquerque, NM 87107" },
  { id: 613, name: "IBEW Local 613", city: "Atlanta", state: "GA", phone: "(404) 523-8107", website: "ibew613.org", lat: 33.749, lng: -84.388, address: "501 Pulliam Street SW Suite 250, Atlanta, GA 30312" , email: "admin613@ibew613.org"},
  { id: 617, name: "IBEW Local 617", city: "San Mateo", state: "CA", phone: "(650) 574-4239", website: "ibew617.com", lat: 37.563, lng: -122.3255, address: "1701 Leslie Street, San Mateo, CA 94402" , email: "information@ibew617.com"},
  { id: 639, name: "IBEW Local 639", city: "San Luis Obispo", state: "CA", phone: "(805) 543-5693", website: "ibew639.org", lat: 35.2828, lng: -120.6596, address: "6363 Edna Road, San Luis Obispo, CA 93401" , email: "admin@ibew639.org"},
  { id: 640, name: "IBEW Local 640", city: "Phoenix", state: "AZ", phone: "(602) 264-4506", website: "ibew640.com", lat: 33.4484, lng: -112.074, address: "5808 N Seventh Street, Phoenix, AZ 85014" , email: "info@ibew640.com"},
  { id: 648, name: "IBEW Local 648", city: "Hamilton", state: "OH", phone: "(513) 863-6515", website: "ibew648.org", lat: 39.3995, lng: -84.5613, address: "4300 Millikin Road, Hamilton, OH 45011" , email: "local648@ibew648.org"},
  { id: 649, name: "IBEW Local 649", city: "Alton", state: "IL", phone: "(618) 462-1627", website: "ibew649.org", lat: 38.8906, lng: -90.1843, address: "3945 Humbert Road, Alton, IL 62002" , email: "info@ibew649.org"},
  { id: 654, name: "IBEW Local 654", city: "Chester", state: "PA", phone: "(610) 494-2820", website: "ibew654.com", lat: 39.8498, lng: -75.3557, address: "3729 Chichester Avenue, Boothwyn, PA 19061" },
  { id: 659, name: "IBEW Local 659", city: "Medford", state: "OR", phone: "(541) 664-0800", website: "ibew659.org", lat: 42.3265, lng: -122.8756, address: "4480 Rogue Valley Highway Suite 3, Central Point, OR 97502" , email: "info@ibew659.org"},
  { id: 661, name: "IBEW Local 661", city: "Hutchinson", state: "KS", phone: "(620) 663-3431", website: "ibew661.com", lat: 38.0608, lng: -97.9298, address: "200 W Second Avenue, Hutchinson, KS 67501" , email: "info@ibew661.com"},
  { id: 665, name: "IBEW Local 665", city: "Lansing", state: "MI", phone: "(517) 393-5530", website: "ibew665.org", lat: 42.7325, lng: -84.5555, address: "5710 Ivan Drive, Lansing, MI 48917" },
  { id: 666, name: "IBEW Local 666", city: "Richmond", state: "VA", phone: "(804) 353-9666", website: "ibewlocal666.com", lat: 37.5407, lng: -77.436, address: "1400 E Nine Mile Road, Highland Springs, VA 23075" , email: "info@ibewlocal666.com"},
  { id: 668, name: "IBEW Local 668", city: "Lafayette", state: "IN", phone: "(765) 474-1021", website: "ibew668.org", lat: 40.4167, lng: -86.8753, address: "2535 S 30th Street Suite 1, Lafayette, IN 47909" , email: "ibew668@ibew668.org"},
  { id: 673, name: "IBEW Local 673", city: "Painesville", state: "OH", phone: "(440) 255-3414", website: "ibew673.org", lat: 41.7248, lng: -81.2457, address: "8356 Munson Road, Mentor, OH 44060" },
  { id: 676, name: "IBEW Local 676", city: "Pensacola", state: "FL", phone: "(850) 477-8767", website: "ibewlocal676.com", lat: 30.4344, lng: -87.2086, address: "7830 N Palafox Street, Pensacola, FL 32534" , email: "ibewlu676@yahoo.com"},
  { id: 681, name: "IBEW Local 681", city: "Wichita Falls", state: "TX", phone: "(940) 322-1661", website: "ibew681.org", lat: 33.9137, lng: -98.4934, address: "6111 Old Jacksboro Highway, Wichita Falls, TX 76302" },
  { id: 683, name: "IBEW Local 683", city: "Columbus", state: "OH", phone: "(614) 294-4786", website: "ibew683.org", lat: 39.9612, lng: -82.9988, address: "939 Goodale Boulevard Suite 100, Columbus, OH 43212" , email: "staff@ibew683.org"},
  { id: 684, name: "IBEW Local 684", city: "Modesto", state: "CA", phone: "(209) 524-5171", website: "ibewlu684.org", lat: 37.6391, lng: -120.9969, address: "519 Twelfth Street, Modesto, CA 95354" , email: "info@ibewlu684.org"},
  { id: 688, name: "IBEW Local 688", city: "Mansfield", state: "OH", phone: "(419) 526-4688", website: "ibew688.org", lat: 40.7584, lng: -82.5154, address: "67 S Walnut Street, Mansfield, OH 44902" , email: "resign688@hotmail.com"},
  { id: 692, name: "IBEW Local 692", city: "Bay City", state: "MI", phone: "(989) 684-4510", website: "ibew692.org", lat: 43.5945, lng: -83.8888, address: "1300 W Thomas Street, Bay City, MI 48706" },
  { id: 697, name: "IBEW Local 697", city: "Gary", state: "IN", phone: "(219) 945-0697", website: "ibew697.org", lat: 41.5934, lng: -87.3464, address: "7200 Mississippi Street Suite 200, Merrillville, IN 46410" , email: "info@ibew697.org"},
  { id: 700, name: "IBEW Local 700", city: "Fort Smith", state: "AR", phone: "(479) 783-1149", website: "ibew700.org", lat: 35.3859, lng: -94.3985, address: "2914 Midland Boulevard, Ft. Smith, AR 72904" , email: "ibew700@ibew700.com"},
  { id: 701, name: "IBEW Local 701", city: "Warrenville", state: "IL", phone: "(630) 393-1701", website: "ibew701.org", lat: 41.8175, lng: -88.1845, address: "28600 Bella Vista Parkway Suite 1000, Warrenville, IL 60555" , email: "local701@ibew701.org"},
  { id: 702, name: "IBEW Local 702", city: "West Frankfort", state: "IL", phone: "(618) 932-2102", website: "ibew702.org", lat: 37.8984, lng: -88.9267, address: "106 N Monroe Street, West Frankfort, IL 62896" },
  { id: 704, name: "IBEW Local 704", city: "Dubuque", state: "IA", phone: "(563) 582-5947", website: "ibew704.com", lat: 42.5006, lng: -90.6646, address: "1610 Garfield Avenue, Dubuque, IA 52001" , email: "ibew704@live.com"},
  { id: 712, name: "IBEW Local 712", city: "Beaver", state: "PA", phone: "(724) 775-0969", website: "ibew712.org", lat: 40.6912, lng: -80.3048, address: "217 Sassafras Lane, Beaver, PA 15009" , email: "local712@ibew712.org"},
  { id: 714, name: "IBEW Local 714", city: "Minot", state: "ND", phone: "(701) 852-3025", website: "local714.com", lat: 48.2325, lng: -101.2963, address: "125 35th Avenue NE, Minot, ND 58703" , email: "office@local714.com"},
  { id: 716, name: "IBEW Local 716", city: "Houston", state: "TX", phone: "(713) 869-8900", website: "ibew716.net", lat: 29.7604, lng: -95.3698, address: "1475 N Loop W, Houston, TX 77008" , email: "ibew716@ibew716.net"},
  { id: 725, name: "IBEW Local 725", city: "Terre Haute", state: "IN", phone: "(812) 877-4239", website: "ibew725.org", lat: 39.4667, lng: -87.4139, address: "5675 Hulman Street, Terre Haute, IN 47803" , email: "unionhall@ibew725.org"},
  { id: 728, name: "IBEW Local 728", city: "Fort Lauderdale", state: "FL", phone: "(954) 525-3106", website: "ibew728.org", lat: 26.0928, lng: -80.1396, address: "201 SE 24th Street, Ft. Lauderdale, FL 33316" , email: "info@ibew728.org"},
  { id: 743, name: "IBEW Local 743", city: "Reading", state: "PA", phone: "(610) 777-3100", website: "ibewlocal743.org", lat: 40.3356, lng: -75.9269, address: "20 Morgan Drive, Reading, PA 19608" , email: "info@local743ibew.org"},
  { id: 756, name: "IBEW Local 756", city: "Port Orange", state: "FL", phone: "(386) 756-2756", website: "ibew756.org", lat: 29.1086, lng: -81.012, address: "5901 S Williamson Boulevard, Port Orange, FL 32128" , email: "ibew756@msn.com"},
  { id: 760, name: "IBEW Local 760", city: "Knoxville", state: "TN", phone: "(865) 524-8638", website: "ibew760.org", lat: 35.9606, lng: -83.9207, address: "1530 Bill Williams Avenue, Knoxville, TN 37917" , email: "info@ibew760.org"},
  { id: 768, name: "IBEW Local 768", city: "Kalispell", state: "MT", phone: "(406) 752-7680", website: "ibew768.com", lat: 48.192, lng: -114.3168, address: "347 Second Avenue W, Kalispell, MT 59901" , email: "office@ibew768.com"},
  { id: 776, name: "IBEW Local 776", city: "North Charleston", state: "SC", phone: "(843) 554-1080", website: "ibewlocal776.org", lat: 32.8546, lng: -79.9748, address: "3345 Seiberling Road, North Charleston, SC 29418" , email: "local776@ibew776.com"},
  { id: 812, name: "IBEW Local 812", city: "Williamsport", state: "PA", phone: "(570) 368-8984", website: "ibew812.com", lat: 41.2412, lng: -77.0011, address: "500 Jordan Avenue, Montoursville, PA 17754" },
  { id: 816, name: "IBEW Local 816", city: "Paducah", state: "KY", phone: "(270) 898-2456", website: "ibewlocal816.org", lat: 37.0834, lng: -88.6001, address: "4515 Clarks River Road, Paducah, KY 42003" , email: "ibewlocal816@ibewlocal816.org"},
  { id: 824, name: "IBEW Local 824", city: "Tampa", state: "FL", phone: "(813) 626-5136", website: "ibew824.org", lat: 27.9932, lng: -82.3893, address: "6603 E Chelsea St, Tampa, FL 33610" },
  { id: 840, name: "IBEW Local 840", city: "Geneva", state: "NY", phone: "(315) 789-3330", website: "ibew840.org", lat: 42.869, lng: -76.9774, address: "PO Box 851, Geneva, NY 14456" , email: "ibew840@ibew840.org"},
  { id: 852, name: "IBEW Local 852", city: "Corinth", state: "MS", phone: "(662) 286-2897", website: null, lat: 34.9345, lng: -88.5223, address: "192 County Road 509, Corinth, MS 38834" , email: "ibewlocal852@bellsouth.net"},
  { id: 855, name: "IBEW Local 855", city: "Muncie", state: "IN", phone: "(765) 282-6392", website: "ibew855.com", lat: 40.1934, lng: -85.3864, address: "4601 S Meeker Avenue, Muncie, IN 47302" },
  { id: 861, name: "IBEW Local 861", city: "Lake Charles", state: "LA", phone: "(337) 436-3324", website: "ibewlu861.org", lat: 30.2266, lng: -93.2174, address: "3000 Highway 90 E, Lake Charles, LA 70615" },
  { id: 873, name: "IBEW Local 873", city: "Kokomo", state: "IN", phone: "(765) 457-5371", website: "ibew873.com", lat: 40.4864, lng: -86.1336, address: "1931 South Elizabeth Street, Kokomo, IN 46902" , email: "ibew873@ibew873.com"},
  { id: 890, name: "IBEW Local 890", city: "Janesville", state: "WI", phone: "(608) 752-0321", website: "ibew890.org", lat: 42.6828, lng: -89.0187, address: "1900 Reuther Way, Janesville, WI 53546" , email: "local890@ibew890.org"},
  { id: 903, name: "IBEW Local 903", city: "Gulfport", state: "MS", phone: "(228) 863-9881", website: "lu903.com", lat: 30.3674, lng: -89.0928, address: "2417 32nd Street, Gulfport, MS 39501" , email: "lu903@lu903.com"},
  { id: 906, name: "IBEW Local 906", city: "Marquette", state: "MI", phone: "(906) 226-7497", website: "ibew906.org", lat: 46.5436, lng: -87.3954, address: "119 S Front Street, Marquette, MI 49855" },
  { id: 910, name: "IBEW Local 910", city: "Watertown", state: "NY", phone: "(315) 782-5630", website: "ibew910.org", lat: 43.9748, lng: -75.9107, address: "25001 Water Street, Watertown, NY 13601" },
  { id: 915, name: "IBEW Local 915", city: "Tampa", state: "FL", phone: "(813) 621-6451", website: "ibew915.org", lat: 27.9506, lng: -82.4572, address: "5621 Harney Road, Tampa, FL 33610" , email: "info@ibew915.org"},
  { id: 917, name: "IBEW Local 917", city: "Meridian", state: "MS", phone: "(601) 483-0486", website: "ibew917.net", lat: 32.3643, lng: -88.7037, address: "1620 Highway 39 N, Meridian, MS 39301" , email: "office@ibew917.com"},
  { id: 932, name: "IBEW Local 932", city: "Coos Bay", state: "OR", phone: "(541) 756-3907", website: null, lat: 43.3665, lng: -124.2179, address: "3427 Ash Street, North Bend, OR 97459" , email: "office@ibew932.com"},
  { id: 934, name: "IBEW Local 934", city: "Kingsport", state: "TN", phone: "(423) 323-5411", website: "ibew934.com", lat: 36.5484, lng: -82.5618, address: "4640 Highway 11 W, Blountville, TN 37617" },
  { id: 948, name: "IBEW Local 948", city: "Flint", state: "MI", phone: "(810) 767-3308", website: "local948.org", lat: 43.0125, lng: -83.6875, address: "1251 W Hill Road, Flint, MI 48507" },
  { id: 952, name: "IBEW Local 952", city: "Ventura", state: "CA", phone: "(805) 642-2149", website: "ibew952.org", lat: 34.2805, lng: -119.2945, address: "3994 E Main Street, Ventura, CA 93003" , email: "ibewoffice@ibewlu952.org"},
  { id: 968, name: "IBEW Local 968", city: "Parkersburg", state: "WV", phone: "(304) 485-7412", website: "ibew968.com", lat: 39.2667, lng: -81.5615, address: "1845 Seventh Street, Parkersburg, WV 26101" , email: "ibew968@ibew968.com"},
  { id: 972, name: "IBEW Local 972", city: "Marietta", state: "OH", phone: "(740) 373-5054", website: "ibew972.com", lat: 39.4151, lng: -81.454, address: "50 Sandhill Road, Reno, OH 45773" , email: "local@ibew972.org"},
  { id: 995, name: "IBEW Local 995", city: "Baton Rouge", state: "LA", phone: "(225) 927-6462", website: "lu995.com", lat: 30.4515, lng: -91.1871, address: "8181 Tom Drive, Baton Rouge, LA 70815" , email: "ibew@lu995.com"},
  { id: 1015, name: "IBEW Local 1015", city: "McAllen", state: "TX", phone: "(956) 630-3108", website: null, lat: 26.2034, lng: -98.23, address: "224 N McColl Road Suite D, McAllen, TX 78501" , email: "ibewlu1015@att.net"},
  { id: 1077, name: "IBEW Local 1077", city: "Bogalusa", state: "LA", phone: "(985) 735-1299", website: null, lat: 30.7913, lng: -89.8487, address: "305 Avenue B Suite 209A, Bogalusa, LA 70427" },
  { id: 1105, name: "IBEW Local 1105", city: "Newark", state: "OH", phone: "(740) 454-2304", website: "ibewlocal1105.org", lat: 40.0581, lng: -82.4013, address: "5805 Frazeysburg Road, Nashport, OH 43830" , email: "info@ibewlocal1105.org"},
  { id: 1141, name: "IBEW Local 1141", city: "Oklahoma City", state: "OK", phone: "(405) 670-4777", website: "ibew1141.org", lat: 35.4676, lng: -97.5164, address: "1700 SE Fifteenth Street, Oklahoma City, OK 73129" },
  { id: 1186, name: "IBEW Local 1186", city: "Honolulu", state: "HI", phone: "(808) 847-5341", website: "ibew1186.org", lat: 21.3069, lng: -157.8583, address: "1935 Hau Street Room 401, Honolulu, HI 96819" , email: "ibew1186@ibew1186.org"},
  { id: 1205, name: "IBEW Local 1205", city: "Gainesville", state: "FL", phone: "(352) 376-7701", website: "ibew1205.org", lat: 29.6734, lng: -82.3558, address: "2510 NW Sixth Street, Gainesville, FL 32609" , email: "info@ibew1205.org"},
  { id: 1250, name: "IBEW Local 1250", city: "Rapid City", state: "SD", phone: "(605) 343-0954", website: "ibewlocal1250.org", lat: 44.0805, lng: -103.231, address: "922 1/2 E Saint Patrick Street, Rapid City, SD 57701" },
  { id: 1253, name: "IBEW Local 1253", city: "Augusta", state: "ME", phone: "(207) 453-1301", website: "ibew1253.org", lat: 44.3106, lng: -69.7795, address: "142 Elm Street, Newport, ME 04953" },
  { id: 1316, name: "IBEW Local 1316", city: "Macon", state: "GA", phone: "(478) 743-7017", website: "ibew1316.com", lat: 32.8407, lng: -83.6324, address: "1046 Patterson Street, Macon, GA 31204" , email: "admin@ibew1316.org"},
  { id: 1340, name: "IBEW Local 1340", city: "Newport News", state: "VA", phone: "(757) 875-1340", website: "ibew1340.com", lat: 36.9787, lng: -76.43, address: "552 Industrial Park Drive, Newport News, VA 23608" },
  { id: 1426, name: "IBEW Local 1426", city: "Grand Forks", state: "ND", phone: "(701) 775-7601", website: "ibew1426.org", lat: 47.9253, lng: -97.0329, address: "1714 N Washington Street, Grand Forks, ND 58203" , email: "businessmanager@ibew1426.org"},
  { id: 1516, name: "IBEW Local 1516", city: "Jonesboro", state: "AR", phone: "(870) 932-2114", website: "ibew1516.com", lat: 35.8423, lng: -90.7043, address: "9400 E Highland Drive, Jonesboro, AR 72401" },
  { id: 1531, name: "IBEW Local 1531", city: "Albany", state: "GA", phone: "(229) 436-2417", website: null, lat: 31.5785, lng: -84.1557, address: "1900 Clark Avenue, Albany, GA 31705" },
  { id: 1547, name: "IBEW Local 1547", city: "Anchorage", state: "AK", phone: "(907) 272-6571", website: "ibew1547.org", lat: 61.2181, lng: -149.9003, address: "3333 Denali Street Suite 200, Anchorage, AK 99503" },
  { id: 1579, name: "IBEW Local 1579", city: "Augusta", state: "GA", phone: "(706) 722-6357", website: "ibew1579.org", lat: 33.4735, lng: -82.0105, address: "1250 Reynolds Street, Augusta, GA 30901" },
  { id: 1701, name: "IBEW Local 1701", city: "Owensboro", state: "KY", phone: "(270) 684-3058", website: null, lat: 37.7719, lng: -87.1112, address: "2911 W Parrish Avenue, Owensboro, KY 42301" },
  { id: 1914, name: "IBEW Local 1914", city: "Cheswick", state: "PA", phone: "(724) 594-5559", website: "ibew1914.org", lat: 40.5412, lng: -79.797, address: "200 School Street, Harwick, PA 15049" },
  { id: 1925, name: "IBEW Local 1925", city: "Martin", state: "TN", phone: "(731) 587-3457", website: null, lat: 36.3434, lng: -88.8503, address: "402 Jackson Street, Martin, TN 38237" , email: "ibew1925@frontiernet.net"},

  { id: 583, name: "IBEW Local 583", city: "El Paso", state: "TX", phone: "(915) 877-9166", website: "ibew583.com", lat: 31.7619, lng: -106.485, address: "311 W Borderland Road, El Paso, TX 79932", email: "ibew@ibew583.com" },
  { id: 595, name: "IBEW Local 595", city: "Dublin", state: "CA", phone: "(925) 556-0595", website: "ibew595.org", lat: 37.7021, lng: -121.9358, address: "6850 Regional Street Suite 100, Dublin, CA 94568", email: "info@ibew595.org" },

  { id: 993, name: "IBEW Local 993", city: "Kamloops", state: "BC", phone: "(250) 376-8755", website: "ibew993.org", lat: 50.6745, lng: -120.3273, address: "873 Desmond Street, Kamloops, BC V2B 5K3", email: "office@ibew993.org" },
  { id: 1003, name: "IBEW Local 1003", city: "Nelson", state: "BC", phone: "(250) 354-4177", website: "ibew1003.org", lat: 49.4928, lng: -117.2948, address: "101 Baker Street, Nelson, BC V1L 4H1", email: "info@ibew1003.org" },
  { id: 1555, name: "IBEW Local 1555", city: "Moncton", state: "NB", phone: "(506) 857-3228", website: "ibew1555.ca", lat: 46.0878, lng: -64.7782, address: "96 Norwood Avenue Suite 305, Moncton, NB E1C 6L9" },
  { id: 1687, name: "IBEW Local 1687", city: "Sudbury", state: "ON", phone: "(705) 566-1687", website: "ibew1687.org", lat: 46.49, lng: -80.9911, address: "1204 St. Jerome Street, Sudbury, ON P3A 2V9", email: "info@ibew1687.org" },
  { id: 1852, name: "IBEW Local 1852", city: "Sydney", state: "NS", phone: "(902) 562-1357", website: null, lat: 46.1351, lng: -60.1831, address: "42 Cossitt Heights Drive, Sydney, NS B1P 6H4" },
  { id: 1928, name: "IBEW Local 1928", city: "Halifax", state: "NS", phone: "(902) 450-5366", website: "ibew1928.org", lat: 44.6488, lng: -63.5752, address: "14 McQuade Lake Crescent Suite 204, Beechville, NS B3S 1B6", email: "contact@ibew1928.org" },
  { id: 2038, name: "IBEW Local 2038", city: "Regina", state: "SK", phone: "(306) 757-0222", website: "ibew2038.com", lat: 50.4452, lng: -104.6189, address: "1920 McAra Street, Regina, SK S4N 5R1", email: "admin@ibew2038.com" },
  { id: 2085, name: "IBEW Local 2085", city: "Winnipeg", state: "MB", phone: "(204) 982-2085", website: "ibew2085.com", lat: 49.8951, lng: -97.1384, address: "2181 Portage Avenue, Winnipeg, MB R3J 0L7", email: "info@ibew2085.com" },
  { id: 2166, name: "IBEW Local 2166", city: "Fredericton", state: "NB", phone: "(506) 452-0111", website: "ibewlocal2166.com", lat: 45.9636, lng: -66.6431, address: "681 Union Street, Fredericton, NB E3A 3N8" },
  { id: 2330, name: "IBEW Local 2330", city: "St. John's", state: "NL", phone: "(709) 895-3764", website: "ibew.nf.ca", lat: 47.5615, lng: -52.7126, address: "160 Holyrood Access Road, Holyrood, NL A0A 2R0" },
];

// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ──────────────────
// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ─────────────────
// Source: User-provided wage data. Completely separate from Inside Wireman locals.
// All Canadian locals excluded. IDs use 90000 + local number to avoid conflicts.
const IBEW_LINEMAN_LOCALS = [
  { id: 90002, name: "IBEW Local 2 (Lineman)", city: "St. Louis", state: "MO", phone: "(314) 645-2236", website: "ibew2.org", lat: 38.627, lng: -90.1994, address: "940 Biltmore Drive, Fenton, MO 63026" , email: "info@ibew2.org"},
  { id: 90003, name: "IBEW Local 3 (Lineman)", city: "New York City", state: "NY", phone: "(718) 591-4000", website: "local3.com", lat: 40.7128, lng: -74.0059, address: "158-11 Harry Van Arsdale Jr. Avenue, Flushing, NY 11365" , email: "mail@local3ibew.org"},
  { id: 90009, name: "IBEW Local 9 (Lineman)", city: "Chicago", state: "IL", phone: "(708) 449-9000", website: "ibew9.org", lat: 41.8781, lng: -87.6298, address: "7840 Graphics Drive Suite 100, Tinley Park, IL 60477" , email: "mail@ibew9.org"},
  { id: 90012, name: "IBEW Local 12 (Lineman)", city: "Pueblo", state: "CO", phone: "(719) 561-8000", website: "ibew12.org", lat: 38.2544, lng: -104.6091, address: "2901 Farabaugh Lane, Pueblo, CO 81005" , email: "local12@ibew12.org"},
  { id: 90017, name: "IBEW Local 17 (Lineman)", city: "Southfield", state: "MI", phone: "(248) 423-4540", website: "ibewlocal17.org", lat: 42.4734, lng: -83.2218, address: "17000 W 12 Mile Road, Southfield, MI 48076" },
  { id: 90042, name: "IBEW Local 42 (Lineman)", city: "East Windsor", state: "CT", phone: "(860) 646-7297", website: "ibewlocal42.com", lat: 41.9165, lng: -72.599, address: "20 Craftsman Road, East Windsor, CT 06088" },
  { id: 90044, name: "IBEW Local 44 (Lineman)", city: "Butte", state: "MT", phone: "(406) 723-3203", website: "ibew44.org", lat: 46.0038, lng: -112.5349, address: "1901 S Montana Street, Butte, MT 59701" , email: "ibew@ibew44.org"},
  { id: 90047, name: "IBEW Local 47 (Lineman)", city: "Diamond Bar", state: "CA", phone: "(909) 860-4239", website: "ibew47.org", lat: 33.9994, lng: -117.8102, address: "600 N Diamond Bar Boulevard, Diamond Bar, CA 91765" , email: "info@ibew47.org"},
  { id: 90050, name: "IBEW Local 50 (Lineman)", city: "Richmond", state: "VA", phone: "(804) 328-2972", website: "ibew50.org", lat: 37.5407, lng: -77.436, address: "1400 E Nine Mile Road Suite 50, Highland Springs, VA 23075" },
  { id: 90051, name: "IBEW Local 51 (Lineman)", city: "Springfield", state: "IL", phone: "(217) 726-8481", website: "ibew51.org", lat: 39.7817, lng: -89.6501, address: "3171 Greenhead Drive, Springfield, IL 62711" , email: "ibew51@ibew51.org"},
  { id: 90053, name: "IBEW Local 53 (Lineman)", city: "Kansas City", state: "MO", phone: "(816) 421-5464", website: "ibewlocal53.org", lat: 39.0997, lng: -94.5786, address: "1100 Admiral Boulevard, Kansas City, MO 64106" , email: "localrep@ibewlocal53.org"},
  { id: 90055, name: "IBEW Local 55 (Lineman)", city: "Des Moines", state: "IA", phone: "(515) 265-6193", website: "ibew55.org", lat: 41.5868, lng: -93.625, address: "1435 NE 54th Avenue, Des Moines, IA 50313" , email: "ibew55@ibew55.org"},
  { id: 90057, name: "IBEW Local 57 (Lineman)", city: "Salt Lake City", state: "UT", phone: "(801) 270-5757", website: "ibew57.com", lat: 40.7608, lng: -111.891, address: "3400 W 2100 S Suite B, Salt Lake City, UT 84119" , email: "local57@ibew57.com"},
  { id: 90066, name: "IBEW Local 66 (Lineman)", city: "Houston", state: "TX", phone: "(713) 943-0716", website: "ibew66.com", lat: 29.7604, lng: -95.3698, address: "4345 Allen Genoa Road, Pasadena, TX 77504" , email: "local66@ibew66.com"},
  { id: 90070, name: "IBEW Local 70 (Lineman)", city: "Forestville", state: "MD", phone: "(301) 516-7730", website: "ibew70.us", lat: 38.8513, lng: -76.868, address: "3606 Stewart Road, Forestville, MD 20747" , email: "office@ibew70.us"},
  { id: 90071, name: "IBEW Local 71 (Lineman)", city: "Columbus", state: "OH", phone: "(614) 539-1394", website: "ibew71.org", lat: 39.9612, lng: -82.9988, address: "2280 Citygate Drive, Columbus, OH 43219" , email: "office@ibew71.org"},
  { id: 90077, name: "IBEW Local 77 (Lineman)", city: "Seattle", state: "WA", phone: "(206) 323-4505", website: "ibew77.com", lat: 47.6062, lng: -122.3321, address: "19415 International Boulevard, SeaTac, WA 98188" , email: "ibew77@ibew77.com"},
  { id: 90080, name: "IBEW Local 80 (Lineman)", city: "Norfolk", state: "VA", phone: "(757) 480-1740", website: "ibew80.com", lat: 36.8508, lng: -76.2859, address: "5307 E Virginia Beach Boulevard, Norfolk, VA 23502" },
  { id: 90084, name: "IBEW Local 84 (Lineman)", city: "Newnan", state: "GA", phone: "(770) 801-5352", website: "ibewlocal84.org", lat: 33.3807, lng: -84.7997, address: "2791 Woodland Terrace, Smyrna, GA 30080" , email: "admin@ibewlocal84.org"},
  { id: 90089, name: "IBEW Local 89 (Lineman)", city: "Mount Vernon", state: "WA", phone: "(360) 755-6900", website: "ibew89.org", lat: 48.4201, lng: -122.3343, address: "1125 S Second Street, Mount Vernon, WA 98273" , email: "local89@ibew89.com"},
  { id: 90102, name: "IBEW Local 102 (Lineman)", city: "Parsippany", state: "NJ", phone: "(973) 887-1718", website: "ibew102.org", lat: 40.8573, lng: -74.4265, address: "50 Parsippany Road, Parsippany, NJ 07054" , email: "info@ibew102.org"},
  { id: 90104, name: "IBEW Local 104 (Lineman)", city: "Mansfield", state: "MA", phone: "(508) 660-3900", website: "ibew104.org", lat: 42.0251, lng: -71.2187, address: "900 S Main Street, Mansfield, MA 02048" , email: "info@ibew104.org"},
  { id: 90111, name: "IBEW Local 111 (Lineman)", city: "Denver", state: "CO", phone: "(303) 744-7171", website: "ibew111.org", lat: 39.7392, lng: -104.9903, address: "5965 E 39th Avenue, Denver, CO 80207" , email: "mail@ibew111.org"},
  { id: 90113, name: "IBEW Local 113 (Lineman)", city: "Colorado Springs", state: "CO", phone: "(719) 633-3872", website: "ibew113.com", lat: 38.8339, lng: -104.8214, address: "2150 Naegele Road, Colorado Springs, CO 80904" , email: "info@ibew113.com"},
  { id: 90125, name: "IBEW Local 125 (Lineman)", city: "Portland", state: "OR", phone: "(503) 262-9125", website: "ibew125.com", lat: 45.5231, lng: -122.6765, address: "17200 NE Sacramento Street, Portland, OR 97230" },
  { id: 90126, name: "IBEW Local 126 (Lineman)", city: "Norristown", state: "PA", phone: "(610) 489-1185", website: "ibewlu126.com", lat: 40.1215, lng: -75.3399, address: "3455 Germantown Pike, Collegeville, PA 19426" , email: "local126@ibewlu126.com"},
  { id: 90141, name: "IBEW Local 141 (Lineman)", city: "Wheeling", state: "WV", phone: "(304) 242-3870", website: "ibew141.org", lat: 40.064, lng: -80.7209, address: "82 Burkham Court, Wheeling, WV 26003" , email: "info@ibew141.org"},
  { id: 90145, name: "IBEW Local 145 (Lineman)", city: "Moline", state: "IL", phone: "(309) 736-4239", website: "ibewlocal145.com", lat: 41.5067, lng: -90.5151, address: "1700 52nd Avenue Suite A, Moline, IL 61265" , email: "info@ibewlocal145.com"},
  { id: 90160, name: "IBEW Local 160 (Lineman)", city: "Baudette", state: "MN", phone: "(612) 781-3126", website: "ibew160.org", lat: 48.7136, lng: -94.5975, address: "13220 County Road 6, Plymouth, MN 55441" , email: "160@ibew160.org"},
  { id: 90164, name: "IBEW Local 164 (Lineman)", city: "Jersey City", state: "NJ", phone: "(201) 265-1700", website: "ibew164.org", lat: 40.7178, lng: -74.0431, address: "205 Robin Road Suite 315, Paramus, NJ 07652" , email: "ibew164@ibew164.org"},
  { id: 90175, name: "IBEW Local 175 (Lineman)", city: "Chattanooga", state: "TN", phone: "(423) 894-3557", website: "ibew175.org", lat: 35.0456, lng: -85.3097, address: "3922 Volunteer Drive Suite 9, Chattanooga, TN 37416" , email: "office@ibew175.org"},
  { id: 90177, name: "IBEW Local 177 (Lineman)", city: "Jacksonville", state: "FL", phone: "(904) 355-4569", website: "ibew177.org", lat: 30.3322, lng: -81.6557, address: "966 Liberty Street, Jacksonville, FL 32206" , email: "office@ibew177.org"},
  { id: 90193, name: "IBEW Local 193 (Lineman)", city: "Springfield", state: "IL", phone: "(217) 544-3479", website: "ibew193.com", lat: 39.7817, lng: -89.6501, address: "3150 Wide Track Drive, Springfield, IL 62703" , email: "office@ibew193.com"},
  { id: 90194, name: "IBEW Local 194 (Lineman)", city: "Shreveport", state: "LA", phone: "(318) 688-0194", website: "ibew194.org", lat: 32.5252, lng: -93.7502, address: "5510 Buncombe Road, Shreveport, LA 71129" },
  { id: 90196, name: "IBEW Local 196 (Lineman)", city: "Batavia", state: "IL", phone: "(630) 761-1829", website: "ibew196.com", lat: 41.85, lng: -88.3126, address: "13300 IL Route 47, Huntley, IL 60142" , email: "office@ibew196.com"},
  { id: 90220, name: "IBEW Local 220 (Lineman)", city: "Fort Worth", state: "TX", phone: "(817) 551-1885", website: "ibewlu220.com", lat: 32.7548, lng: -97.3308, address: "2804 SE Loop 820, Fort Worth, TX 76140" , email: "ibewlu220@ibewlu220.com"},
  { id: 90222, name: "IBEW Local 222 (Lineman)", city: "Orlando", state: "FL", phone: "(787) 957-9252", website: "ibew222.org", lat: 28.5383, lng: -81.3792, address: "RR3 200 Suite 11, Toa Alta, PR 00953" , email: "dispatch@ibew222.org"},
  { id: 90238, name: "IBEW Local 238 (Lineman)", city: "Asheville", state: "NC", phone: "(828) 505-0216", website: "ibew238.org", lat: 35.5951, lng: -82.5515, address: "46 New Leicester Highway, Asheville, NC 28806" },
  { id: 90245, name: "IBEW Local 245 (Lineman)", city: "Toledo", state: "OH", phone: "(419) 666-3350", website: "ibew245.com", lat: 41.6528, lng: -83.5379, address: "705 Lime City Road, Rossford, OH 43460" },
  { id: 90270, name: "IBEW Local 270 (Lineman)", city: "Oak Ridge", state: "TN", phone: "(865) 483-1354", website: "ibewlocal270.org", lat: 36.0104, lng: -84.2696, address: "138 N Lincoln Circle, Oak Ridge, TN 37830" , email: "ibew270@comcast.net"},
  { id: 90278, name: "IBEW Local 278 (Lineman)", city: "Corpus Christi", state: "TX", phone: "(361) 855-1084", website: "ibew278.com", lat: 27.8006, lng: -97.3964, address: "2301 Saratoga Boulevard, Corpus Christi, TX 78417" , email: "office@ibew278.com"},
  { id: 90291, name: "IBEW Local 291 (Lineman)", city: "Boise", state: "ID", phone: "(208) 343-4861", website: "ibew291.org", lat: 43.615, lng: -116.2023, address: "225 N Sixteenth Street Suite 110, Boise, ID 83702" , email: "office@ibew291.org"},
  { id: 90295, name: "IBEW Local 295 (Lineman)", city: "Little Rock", state: "AR", phone: "(501) 562-2244", website: "ibew295.org", lat: 34.7465, lng: -92.2896, address: "7320 S University Avenue, Little Rock, AR 72209" , email: "ibew295@ibew295.org"},
  { id: 90301, name: "IBEW Local 301 (Lineman)", city: "Texarkana", state: "TX", phone: "(903) 838-8531", website: null, lat: 33.4251, lng: -94.0477, address: "114 Elm Street, Nash, TX 75569" , email: "chris@ibew301.com"},
  { id: 90304, name: "IBEW Local 304 (Lineman)", city: "Topeka", state: "KS", phone: "(785) 235-2301", website: "ibew304.org", lat: 39.0473, lng: -95.6752, address: "3906 NW Sixteenth Street, Topeka, KS 66618" , email: "lu304@ibew304.org"},
  { id: 90307, name: "IBEW Local 307 (Lineman)", city: "Cumberland", state: "MD", phone: "(301) 724-3403", website: "ibew307.org", lat: 39.6529, lng: -78.7625, address: "401 Decatur Street, Cumberland, MD 21502" , email: "administrator@ibew307.org"},
  { id: 90309, name: "IBEW Local 309 (Lineman)", city: "Collinsville", state: "IL", phone: "(618) 345-5112", website: "ibew309.com", lat: 38.6703, lng: -89.9845, address: "2000A Mall Street, Collinsville, IL 62234" , email: "electricians@ibew309.org"},
  { id: 90317, name: "IBEW Local 317 (Lineman)", city: "Huntington", state: "WV", phone: "(304) 429-5013", website: "ibew317.net", lat: 38.4193, lng: -82.4452, address: "1848 Madison Avenue Suite A, Huntington, WV 25704" , email: "office@ibew317.com"},
  { id: 90322, name: "IBEW Local 322 (Lineman)", city: "Casper", state: "WY", phone: "(307) 265-1060", website: "ibew322.org", lat: 42.8501, lng: -106.3252, address: "691 English Drive, Casper, WY 82601" , email: "office@ibew322.org"},
  { id: 90342, name: "IBEW Local 342 (Lineman)", city: "Greensboro", state: "NC", phone: "(336) 285-7781", website: "ibew342.org", lat: 36.0726, lng: -79.792, address: "7874 Thorndike Road, Greensboro, NC 27409" , email: "ibew342@att.net"},
  { id: 90351, name: "IBEW Local 351 (Lineman)", city: "Folsom", state: "NJ", phone: "(609) 704-8351", website: "ibew351.org", lat: 39.6059, lng: -74.8574, address: "1113 Black Horse Pike, Hammonton, NJ 08037" },
  { id: 90359, name: "IBEW Local 359 (Lineman)", city: "Miami", state: "FL", phone: "(305) 458-8205", website: "ibew359.com", lat: 25.7617, lng: -80.1918, address: "7811 Coral Way Suite 101, Miami, FL 33155" },
  { id: 90369, name: "IBEW Local 369 (Lineman)", city: "Louisville", state: "KY", phone: "(502) 368-2568", website: "ibewlocal369.com", lat: 38.2527, lng: -85.7585, address: "4315 Preston Highway Suite 102, Louisville, KY 40213" },
  { id: 90379, name: "IBEW Local 379 (Lineman)", city: "Charlotte", state: "NC", phone: "(704) 455-4595", website: "ibew379.org", lat: 35.2271, lng: -80.8431, address: "1900 Cross Beam Drive, Charlotte, NC 28217" , email: "ibewlu379@ibew379.org"},
  { id: 90396, name: "IBEW Local 396 (Lineman)", city: "Las Vegas", state: "NV", phone: "(702) 457-3011", website: "ibew396.org", lat: 36.1699, lng: -115.1398, address: "3520 Boulder Highway, Las Vegas, NV 89121" , email: "office@ibew396.org"},
  { id: 90400, name: "IBEW Local 400 (Lineman)", city: "Asbury Park", state: "NJ", phone: "(732) 681-7111", website: "ibew400.org", lat: 40.2204, lng: -74.0121, address: "3301 Highway 138 E, Wall, NJ 07719" },
  { id: 90426, name: "IBEW Local 426 (Lineman)", city: "Sioux Falls", state: "SD", phone: "(605) 336-0370", website: "ibew426.com", lat: 43.5446, lng: -96.7311, address: "3725 N Fourth Avenue, Sioux Falls, SD 57104" , email: "office@ibew426.com"},
  { id: 90429, name: "IBEW Local 429 (Lineman)", city: "Nashville", state: "TN", phone: "(615) 889-4429", website: "ibew429.org", lat: 36.1627, lng: -86.7816, address: "2001 Elm Hill Pike, Nashville, TN 37210" , email: "ibew429@ibew429.org"},
  { id: 90436, name: "IBEW Local 436 (Lineman)", city: "El Dorado", state: "AR", phone: "(870) 863-9181", website: null, lat: 33.2009, lng: -92.666, address: "810 N Newton Street, El Dorado, AR 71730" , email: "ibewl436@sbcglobal.net"},
  { id: 90443, name: "IBEW Local 443 (Lineman)", city: "Montgomery", state: "AL", phone: "(334) 272-8830", website: "ibew443.org", lat: 32.3668, lng: -86.2999, address: "1469 Jean Street, Montgomery, AL 36107" , email: "info@ibew443.org"},
  { id: 90449, name: "IBEW Local 449 (Lineman)", city: "Pocatello", state: "ID", phone: "(208) 232-5263", website: "ibewlocal449.org", lat: 42.8713, lng: -112.4455, address: "1537 Baldy Avenue, Pocatello, ID 83201" , email: "office@ibewlocal449.org"},
  { id: 90455, name: "IBEW Local 455 (Lineman)", city: "Springfield", state: "MA", phone: "(413) 733-7398", website: "ibew455.org", lat: 42.1015, lng: -72.5898, address: "474 Page Boulevard, Springfield, MA 01104" , email: "office@ibew455.org"},
  { id: 90456, name: "IBEW Local 456 (Lineman)", city: "North Brunswick", state: "NJ", phone: "(732) 246-2122", website: "ibew456.org", lat: 40.4893, lng: -74.4774, address: "1295 Livingston Avenue, North Brunswick, NJ 08902" , email: "local456@ibew456.org"},
  { id: 90474, name: "IBEW Local 474 (Lineman)", city: "Memphis", state: "TN", phone: "(901) 726-4060", website: "ibewlocal474.com", lat: 35.1495, lng: -90.049, address: "1870 Madison Avenue, Memphis, TN 38104" , email: "info@ibewlocal474.com"},
  { id: 90483, name: "IBEW Local 483 (Lineman)", city: "Tacoma", state: "WA", phone: "(253) 565-3232", website: "ibew483.org", lat: 47.2529, lng: -122.4443, address: "3525 S Alder Street, Tacoma, WA 98409" , email: "general@ibew483.org"},
  { id: 90495, name: "IBEW Local 495 (Lineman)", city: "Wilmington", state: "NC", phone: "(910) 660-8630", website: null, lat: 34.2257, lng: -77.9447, address: "2725 Old Wrightsboro Road Unit 3C, Wilmington, NC 28405" },
  { id: 90532, name: "IBEW Local 532 (Lineman)", city: "Billings", state: "MT", phone: "(406) 248-9119", website: "ibew532.com", lat: 45.7833, lng: -108.5007, address: "5200 Midland Road, Billings, MT 59101" , email: "office@ibew532.com"},
  { id: 90553, name: "IBEW Local 553 (Lineman)", city: "Durham", state: "NC", phone: "(919) 596-8220", website: "ibew553.org", lat: 35.994, lng: -78.8986, address: "3300 New Raleigh Highway, Durham, NC 27703" , email: "office@ibew553.org"},
  { id: 90558, name: "IBEW Local 558 (Lineman)", city: "Sheffield", state: "AL", phone: "(256) 383-2279", website: "ibew558.org", lat: 34.7651, lng: -87.6975, address: "1803 E Seventeenth Street, Sheffield, AL 35660" , email: "info@ibew558.org"},
  { id: 90583, name: "IBEW Local 583 (Lineman)", city: "El Paso", state: "TX", phone: "(915) 877-9166", website: "ibew583.com", lat: 31.7619, lng: -106.485, address: "311 W Borderland Road, El Paso, TX 79932" , email: "ibew@ibew583.com"},
  { id: 90596, name: "IBEW Local 596 (Lineman)", city: "Clarksburg", state: "WV", phone: "(304) 622-0151", website: "ibew596.com", lat: 39.2806, lng: -80.3445, address: "1001 N Twelfth Street, Clarksburg, WV 26301" },
  { id: 90602, name: "IBEW Local 602 (Lineman)", city: "Amarillo", state: "TX", phone: "(806) 376-9945", website: "ibew602.org", lat: 35.222, lng: -101.8313, address: "200 S Fannin Street, Amarillo, TX 79106" , email: "admin@ibew602.org"},
  { id: 90611, name: "IBEW Local 611 (Lineman)", city: "Albuquerque", state: "NM", phone: "(505) 343-0611", website: "ibew611.org", lat: 35.0844, lng: -106.6504, address: "4921 Alexander Boulevard NE Suite A, Albuquerque, NM 87107" },
  { id: 90613, name: "IBEW Local 613 (Lineman)", city: "Atlanta", state: "GA", phone: "(404) 523-8107", website: "ibew613.org", lat: 33.749, lng: -84.388, address: "501 Pulliam Street SW Suite 250, Atlanta, GA 30312" , email: "admin613@ibew613.org"},
  { id: 90649, name: "IBEW Local 649 (Lineman)", city: "Alton", state: "IL", phone: "(618) 462-1627", website: "ibew649.org", lat: 38.8906, lng: -90.1843, address: "3945 Humbert Road, Alton, IL 62002" , email: "info@ibew649.org"},
  { id: 90659, name: "IBEW Local 659 (Lineman)", city: "Medford", state: "OR", phone: "(541) 664-0800", website: "ibew659.org", lat: 42.3265, lng: -122.8756, address: "4480 Rogue Valley Highway Suite 3, Central Point, OR 97502" , email: "info@ibew659.org"},
  { id: 90666, name: "IBEW Local 666 (Lineman)", city: "Sandston", state: "VA", phone: "(804) 353-9666", website: "ibewlocal666.com", lat: 37.5143, lng: -77.3174, address: "1400 E Nine Mile Road, Highland Springs, VA 23075" , email: "info@ibewlocal666.com"},
  { id: 90676, name: "IBEW Local 676 (Lineman)", city: "Pensacola", state: "FL", phone: "(850) 477-8767", website: "ibewlocal676.com", lat: 30.4213, lng: -87.2169, address: "7830 N Palafox Street, Pensacola, FL 32534" },
  { id: 90681, name: "IBEW Local 681 (Lineman)", city: "Wichita Falls", state: "TX", phone: "(940) 322-1661", website: "ibew681.org", lat: 33.9137, lng: -98.4934, address: "6111 Old Jacksboro Highway, Wichita Falls, TX 76302" },
  { id: 90688, name: "IBEW Local 688 (Lineman)", city: "Mansfield", state: "OH", phone: "(419) 526-4688", website: "ibew688.org", lat: 40.7584, lng: -82.5154, address: "67 S Walnut Street, Mansfield, OH 44902" , email: "resign688@hotmail.com"},
  { id: 90700, name: "IBEW Local 700 (Lineman)", city: "Fort Smith", state: "AR", phone: "(479) 783-1149", website: "ibew700.org", lat: 35.3859, lng: -94.3985, address: "2914 Midland Boulevard, Ft. Smith, AR 72904" , email: "ibew700@ibew700.com"},
  { id: 90776, name: "IBEW Local 776 (Lineman)", city: "North Charleston", state: "SC", phone: "(843) 554-1080", website: "ibewlocal776.org", lat: 32.8546, lng: -79.9748, address: "3345 Seiberling Road, North Charleston, SC 29418" , email: "local776@ibew776.com"},

  { id: 90037, name: "IBEW Local 37 (Lineman)", city: "Fredericton", state: "NB", phone: "(506) 455-0037", website: "ibew37.com", lat: 45.9636, lng: -66.6431, address: "138 Neill Street, Fredericton, NB E3A 2Z6", email: "info@ibew37.com" },
  { id: 90105, name: "IBEW Local 105 (Lineman)", city: "Hamilton", state: "ON", phone: "(905) 387-1721", website: "ibew105.com", lat: 43.2557, lng: -79.8711, address: "685 Nebo Road, Hannon, ON L0R 1P0", email: "frontdesk@ibewlu105.com" },
  { id: 90120, name: "IBEW Local 120 (Lineman)", city: "London", state: "ON", phone: "(519) 652-2929", website: "ibew120.ca", lat: 42.9849, lng: -81.2453, address: "6688 Tempo Road, London, ON N6L 1P9" },
  { id: 90206, name: "IBEW Local 206 (Lineman)", city: "Helena", state: "MT", phone: "(406) 443-7475", website: "ibew206.org", lat: 46.5958, lng: -112.027, address: "110 N Warren Avenue, Helena, MT 59601", email: "office@ibew206.org" },
  { id: 90213, name: "IBEW Local 213 (Lineman)", city: "Port Coquitlam", state: "BC", phone: "(604) 571-6500", website: "ibew213.org", lat: 49.2628, lng: -122.7817, address: "1424 Broadway Street, Port Coquitlam, BC V3C 5W2", email: "ibew213@ibew213.org" },
  { id: 90254, name: "IBEW Local 254 (Lineman)", city: "Calgary", state: "AB", phone: "(403) 250-5558", website: "ibew254.ca", lat: 51.0447, lng: -114.0719, address: "3615 29th Street NE, Calgary, AB T1Y 5W4", email: "admin@ibew254.ca" },
  { id: 90258, name: "IBEW Local 258 (Lineman)", city: "Vancouver", state: "BC", phone: "(604) 520-3305", website: "ibew258.bc.ca", lat: 49.1044, lng: -122.6623, address: "8029 199 Street Suite 140, Langley, BC V2Y 0E2", email: "info@ibew258.bc.ca" },
  { id: 90303, name: "IBEW Local 303 (Lineman)", city: "St. Catharines", state: "ON", phone: "(905) 354-4303", website: "ibewlocal303.com", lat: 43.1594, lng: -79.2469, address: "4485 Kent Avenue, Niagara Falls, ON L2H 1J1" },
  { id: 90353, name: "IBEW Local 353 (Lineman)", city: "Toronto", state: "ON", phone: "(416) 510-3530", website: "ibew353.org", lat: 43.6532, lng: -79.3832, address: "1377 Lawrence Avenue E, Toronto, ON M3A 3P8", email: "inquiries@ibew353.org" },
  { id: 90402, name: "IBEW Local 402 (Lineman)", city: "Thunder Bay", state: "ON", phone: "(807) 623-5759", website: "ibew402.ca", lat: 48.3809, lng: -89.2477, address: "103-910 Cobalt Crescent, Thunder Bay, ON P7B 5W3", email: "office@ibew402.ca" },
  { id: 90424, name: "IBEW Local 424 (Lineman)", city: "Edmonton", state: "AB", phone: "(780) 462-5076", website: "ibew424.net", lat: 53.5461, lng: -113.4938, address: "4232-93 Street, Edmonton, AB T6E 5P5", email: "ibew424@ibew424.net" },
  { id: 90530, name: "IBEW Local 530 (Lineman)", city: "Sarnia", state: "ON", phone: "(519) 344-4154", website: "lu530.com", lat: 42.9977, lng: -82.409, address: "128 Kendall Street, Point Edward, ON N7V 4G5", email: "IBEW@LU530.com" },
  { id: 90568, name: "IBEW Local 568 (Lineman)", city: "Montreal", state: "QC", phone: "(514) 329-0568", website: "fioe568.com", lat: 45.5017, lng: -73.5673, address: "4881 Jarry Street E Suite 228, Montreal, QC H1R 1Y1", email: "info@fioe568.com" },
  { id: 90586, name: "IBEW Local 586 (Lineman)", city: "Ottawa", state: "ON", phone: "(613) 741-5664", website: "ibew586.org", lat: 45.4215, lng: -75.6972, address: "2460 Lancaster Road Suite 103, Ottawa, ON K1B 4S5", email: "bpotter@ibew586.org" },

  { id: 90702, name: "IBEW Local 702 (Lineman)", city: "West Frankfort", state: "IL", phone: "(618) 932-2102", website: "ibew702.org", lat: 37.8978, lng: -88.9209, address: "106 N Monroe Street, West Frankfort, IL 62896", email: "ibew702@ibew702.org" },
  { id: 90714, name: "IBEW Local 714 (Lineman)", city: "Minot", state: "ND", phone: "(701) 852-3025", website: "local714.com", lat: 48.2325, lng: -101.2963, address: "125 35th Avenue NE, Minot, ND 58703", email: "office@local714.com" },
  { id: 90738, name: "IBEW Local 738 (Lineman)", city: "Longview", state: "TX", phone: "(903) 753-7646", website: null, lat: 32.5007, lng: -94.7405, address: "2914 E Marshall Avenue, Longview, TX 75601", email: "ibew738@swbell.net" },
  { id: 90760, name: "IBEW Local 760 (Lineman)", city: "Knoxville", state: "TN", phone: "(865) 524-8638", website: "ibew760.org", lat: 35.9606, lng: -83.9207, address: "1530 Bill Williams Avenue, Knoxville, TN 37917", email: "info@ibew760.org" },
  { id: 90768, name: "IBEW Local 768 (Lineman)", city: "Kalispell", state: "MT", phone: "(406) 752-7680", website: "ibew768.com", lat: 48.192, lng: -114.3168, address: "347 Second Avenue W, Kalispell, MT 59901", email: "office@ibew768.com" },
  { id: 90769, name: "IBEW Local 769 (Lineman)", city: "Phoenix", state: "AZ", phone: "(480) 423-9769", website: "ibew769.com", lat: 33.3528, lng: -111.789, address: "220 N William Dillard Drive, Gilbert, AZ 85233", email: "dispatch@ibew769.com" },
  { id: 90773, name: "IBEW Local 773 (Lineman)", city: "Windsor", state: "ON", phone: "(519) 948-2221", website: "ibew773.ca", lat: 42.3149, lng: -83.0364, address: "4050 N Service Road E, Windsor, ON N8W 5X2", email: "admin@ibew773.ca" },
  { id: 90804, name: "IBEW Local 804 (Lineman)", city: "Breslau", state: "ON", phone: "(519) 648-3993", website: "ibew804.ca", lat: 43.4697, lng: -80.3997, address: "5158 Fountain Street N, Breslau, ON N0B 1M0", email: "office@ibew804.ca" },
  { id: 90816, name: "IBEW Local 816 (Lineman)", city: "Paducah", state: "KY", phone: "(270) 898-2456", website: "ibewlocal816.org", lat: 37.0834, lng: -88.6, address: "4515 Clarks River Road, Paducah, KY 42003", email: "ibewlocal816@ibewlocal816.org" },
  { id: 90852, name: "IBEW Local 852 (Lineman)", city: "Corinth", state: "MS", phone: "(662) 286-2897", website: null, lat: 34.9343, lng: -88.5223, address: "192 County Road 509, Corinth, MS 38834", email: "ibewlocal852@bellsouth.net" },
  { id: 90876, name: "IBEW Local 876 (Lineman)", city: "Grand Rapids", state: "MI", phone: "(616) 784-1133", website: "ibew876.com", lat: 43.6228, lng: -84.7675, address: "5000 E Airport Road, Mount Pleasant, MI 48858", email: "ibew876@gmail.com" },
  { id: 90903, name: "IBEW Local 903 (Lineman)", city: "Gulfport", state: "MS", phone: "(228) 863-9881", website: "lu903.com", lat: 30.3674, lng: -89.0928, address: "2417 32nd Street, Gulfport, MS 39501", email: "lu903@lu903.com" },
  { id: 90934, name: "IBEW Local 934 (Lineman)", city: "Kingsport", state: "TN", phone: "(423) 323-5411", website: "ibew934.com", lat: 36.5484, lng: -82.5618, address: "4640 Highway 11 W, Blountville, TN 37617", email: "ibew_934@yahoo.com" },
  { id: 90953, name: "IBEW Local 953 (Lineman)", city: "Eau Claire", state: "WI", phone: "(715) 834-4911", website: "ibew953.org", lat: 44.8113, lng: -91.4985, address: "4205 Southtowne Drive, Eau Claire, WI 54701", email: "info@ibew953.org" },
  { id: 90968, name: "IBEW Local 968 (Lineman)", city: "Parkersburg", state: "WV", phone: "(304) 485-7412", website: "ibew968.com", lat: 39.2667, lng: -81.5615, address: "1845 Seventh Street, Parkersburg, WV 26101", email: "ibew968@ibew968.com" },
  { id: 90993, name: "IBEW Local 993 (Lineman)", city: "Kamloops", state: "BC", phone: "(250) 376-8755", website: "ibew993.org", lat: 50.6745, lng: -120.3273, address: "873 Desmond Street, Kamloops, BC V2B 5K3", email: "office@ibew993.org" },
  { id: 90995, name: "IBEW Local 995 (Lineman)", city: "Baton Rouge", state: "LA", phone: "(225) 927-6462", website: "lu995.com", lat: 30.4515, lng: -91.1871, address: "8181 Tom Drive, Baton Rouge, LA 70815", email: "ibew@lu995.com" },
  { id: 91002, name: "IBEW Local 1002 (Lineman)", city: "Tulsa", state: "OK", phone: "(918) 438-7344", website: "ibew1002.com", lat: 36.154, lng: -95.9928, address: "12510 E 21st Street, Tulsa, OK 74129", email: "ibew@ibew1002.com" },
  { id: 91049, name: "IBEW Local 1049 (Lineman)", city: "Long Island", state: "NY", phone: "(631) 234-1800", website: "ibew1049.org", lat: 40.8176, lng: -73.0479, address: "100 Corporate Drive, Holtsville, NY 11742", email: "sgasparik@ibew1049.com" },
  { id: 91186, name: "IBEW Local 1186 (Lineman)", city: "Honolulu", state: "HI", phone: "(808) 847-5341", website: "ibew1186.org", lat: 21.3069, lng: -157.8583, address: "1935 Hau Street Room 401, Honolulu, HI 96819", email: "ibew1186@ibew1186.org" },
  { id: 91245, name: "IBEW Local 1245 (Lineman)", city: "Vacaville", state: "CA", phone: "(707) 452-2700", website: "ibew1245.com", lat: 38.3566, lng: -121.9877, address: "30 Orange Tree Circle, Vacaville, CA 95687", email: "rldj@ibew1245.com" },
  { id: 91249, name: "IBEW Local 1249 (Lineman)", city: "Syracuse", state: "NY", phone: "(315) 656-7253", website: "ibew1249.org", lat: 43.1566, lng: -76.07, address: "8531 Brewerton Road Suite 1, Cicero, NY 13039", email: "office@ibew1249.org" },
  { id: 91250, name: "IBEW Local 1250 (Lineman)", city: "Rapid City", state: "SD", phone: "(605) 343-0954", website: "ibewlocal1250.org", lat: 44.0805, lng: -103.231, address: "922 1/2 E Saint Patrick Street, Rapid City, SD 57701", email: "ibew1250ba@gmail.com" },
  { id: 91316, name: "IBEW Local 1316 (Lineman)", city: "Macon", state: "GA", phone: "(478) 743-7017", website: "ibew1316.com", lat: 32.8407, lng: -83.6324, address: "1046 Patterson Street, Macon, GA 31204", email: "admin@ibew1316.org" },
  { id: 91319, name: "IBEW Local 1319 (Lineman)", city: "Bloomsburg", state: "PA", phone: "(570) 714-1352", website: "ibew1319.org", lat: 41.2612, lng: -75.8813, address: "225 Division Street, Kingston, PA 18704", email: "info@ibew1319.org" },
  { id: 91340, name: "IBEW Local 1340 (Lineman)", city: "Newport News", state: "VA", phone: "(757) 875-1340", website: "ibew1340.com", lat: 37.0871, lng: -76.473, address: "552 Industrial Park Drive, Newport News, VA 23608", email: "jeff@ibew1340.com" },
  { id: 91393, name: "IBEW Local 1393 (Lineman)", city: "Indianapolis", state: "IN", phone: "(317) 791-1362", website: "ibewlocal1393.com", lat: 39.7684, lng: -86.1581, address: "3645 S East Street, Indianapolis, IN 46227", email: "info@ibewlocal1393.org" },
  { id: 91426, name: "IBEW Local 1426 (Lineman)", city: "Grand Forks", state: "ND", phone: "(701) 775-7601", website: "ibew1426.org", lat: 47.9253, lng: -97.0329, address: "1714 N Washington Street, Grand Forks, ND 58203", email: "businessmanager@ibew1426.org" },
  { id: 91516, name: "IBEW Local 1516 (Lineman)", city: "Jonesboro", state: "AR", phone: "(870) 932-2114", website: "ibew1516.com", lat: 35.8423, lng: -90.7043, address: "9400 E Highland Drive, Jonesboro, AR 72401", email: "ibew1516@outlook.com" },
  { id: 91525, name: "IBEW Local 1525 (Lineman)", city: "Omaha", state: "NE", phone: "(402) 334-1880", website: null, lat: 41.2565, lng: -95.9345, address: "13336 C Street, Omaha, NE 68144", email: "ibew1525@aol.com" },
  { id: 91531, name: "IBEW Local 1531 (Lineman)", city: "Albany", state: "GA", phone: "(229) 436-2417", website: null, lat: 31.5785, lng: -84.1557, address: "1900 Clark Avenue, Albany, GA 31705", email: "ibew1531@gmail.com" },
  { id: 91547, name: "IBEW Local 1547 (Lineman)", city: "Anchorage", state: "AK", phone: "(907) 272-6571", website: "ibew1547.org", lat: 61.2181, lng: -149.9003, address: "3333 Denali Street Suite 200, Anchorage, AK 99503", email: "webmaster@ibew1547.org" },
  { id: 91579, name: "IBEW Local 1579 (Lineman)", city: "Augusta", state: "GA", phone: "(706) 722-6357", website: "ibew1579.org", lat: 33.4735, lng: -82.0105, address: "1250 Reynolds Street, Augusta, GA 30901", email: "admin@ibew1579.org" },
  { id: 91687, name: "IBEW Local 1687 (Lineman)", city: "Sudbury", state: "ON", phone: "(705) 566-1687", website: "ibew1687.org", lat: 46.49, lng: -80.9911, address: "1204 St. Jerome Street, Sudbury, ON P3A 2V9", email: "info@ibew1687.org" },
  { id: 91701, name: "IBEW Local 1701 (Lineman)", city: "Owensboro", state: "KY", phone: "(270) 684-3058", website: null, lat: 37.7719, lng: -87.1112, address: "2911 W Parrish Avenue, Owensboro, KY 42301", email: "ibew1701@yahoo.com" },
  { id: 91925, name: "IBEW Local 1925 (Lineman)", city: "Martin", state: "TN", phone: "(731) 587-3457", website: null, lat: 36.3434, lng: -88.8503, address: "402 Jackson Street, Martin, TN 38237", email: "ibew1925@frontiernet.net" },
  { id: 91928, name: "IBEW Local 1928 (Lineman)", city: "Halifax", state: "NS", phone: "(902) 450-5366", website: "ibew1928.org", lat: 44.6488, lng: -63.5752, address: "14 McQuade Lake Crescent Suite 204, Beechville, NS B3S 1B6", email: "contact@ibew1928.org" },
  { id: 92067, name: "IBEW Local 2067 (Lineman)", city: "Regina", state: "SK", phone: "(306) 352-1433", website: "ibew2067.com", lat: 50.4452, lng: -104.6189, address: "1810 McAra Street, Regina, SK S4N 6C4", email: "ibew@ibew2067.com" },
  { id: 92085, name: "IBEW Local 2085 (Lineman)", city: "Winnipeg", state: "MB", phone: "(204) 982-2085", website: "ibew2085.com", lat: 49.8951, lng: -97.1384, address: "2181 Portage Avenue, Winnipeg, MB R3J 0L7", email: "info@ibew2085.com" },
  { id: 92150, name: "IBEW Local 2150 (Lineman)", city: "Milwaukee", state: "WI", phone: "(262) 252-2552", website: "ibewlocal2150.org", lat: 43.1793, lng: -88.1077, address: "N56 W13777 Silver Spring Drive, Menomonee Falls, WI 53051", email: "ibew@ibewlocal2150.com" },
  { id: 92166, name: "IBEW Local 2166 (Lineman)", city: "Fredericton", state: "NB", phone: "(506) 452-0111", website: "ibewlocal2166.com", lat: 45.9636, lng: -66.6431, address: "681 Union Street, Fredericton, NB E3A 3N8", email: "admin@ibewlocal2166.com" },
  { id: 92286, name: "IBEW Local 2286 (Lineman)", city: "Beaumont", state: "TX", phone: "(409) 840-4806", website: null, lat: 30.0802, lng: -94.1266, address: "4850 Stone Oak Drive, Beaumont, TX 77705", email: "ibew2286@hotmail.com" },
];

// ─── HFIAW LOCALS DATABASE — Heat & Frost Insulators & Allied Workers ─────────
const HFIAW_LOCALS = [];


// ─── IRONWORKERS LOCALS DATABASE — Int'l Association of Bridge & Structural Iron Workers ─
const IW_LOCALS = [
  { id: 10001, name: "IW Local 1", city: "Forest Park", state: "IL", phone: "(708) 366-6695", website: "iwlocal1.com", lat: 41.8781, lng: -87.6298, address: "7720 Industrial Drive, Forest Park, IL 60130" },
  { id: 10003, name: "IW Local 3", city: "Pittsburgh", state: "PA", phone: "(412) 227-6767", website: "iwlocal3.com", lat: 40.4406, lng: -79.9959, address: "2201 Liberty Ave., Pittsburgh, PA 15222" },
  { id: 10005, name: "IW Local 5", city: "Largo", state: "MD", phone: "(301) 599-0960", website: "ironworkers5.org", lat: 38.8929, lng: -76.8405, address: "9301 Peppercorn Place, Largo, MD 20774" },
  { id: 10006, name: "IW Local 6", city: "West Seneca", state: "NY", phone: "(716) 828-1200", website: "ironworkerslocal6.com", lat: 42.8447, lng: -78.7998, address: "196 Orchard Park Rd., West Seneca, NY 14224", email: "ironworkerlocal6@aol.com" },
  { id: 10007, name: "IW Local 7", city: "South Boston", state: "MA", phone: "(617) 268-4777", website: "iwlocal7.org", lat: 42.332, lng: -71.045, address: "195 Old Colony Ave., South Boston, MA 02127" },
  { id: 10008, name: "IW Local 8", city: "Milwaukee", state: "WI", phone: "(414) 476-9370", website: "iwl8.org", lat: 43.0389, lng: -87.9065, address: "12034 West Adler Ln., Milwaukee, WI 53214" },
  { id: 10009, name: "IW Local 9", city: "Niagara Falls", state: "NY", phone: "(716) 285-5738", website: "ironworkers9.org", lat: 43.0962, lng: -79.0377, address: "412 39th St., Niagara Falls, NY 14303" },
  { id: 10010, name: "IW Local 10", city: "Kansas City", state: "MO", phone: "(816) 842-8917", website: "ironworkers10.com", lat: 39.0997, lng: -94.5786, address: "1000 E 10th St, Kansas City, MO 64106" },
  { id: 10011, name: "IW Local 11", city: "Bloomfield", state: "NJ", phone: "(973) 338-3777", website: "ironworkers11.org", lat: 40.8037, lng: -74.1885, address: "1500 Broad Street, Bloomfield, NJ 07003" },
  { id: 10012, name: "IW Local 12", city: "Latham", state: "NY", phone: "(518) 435-0470", website: "ironworkers12.org", lat: 42.7454, lng: -73.754, address: "17 Hemlock St., Latham, NY 12110", email: "frontoffice@iwl12.org" },
  { id: 10014, name: "IW Local 14", city: "Spokane", state: "WA", phone: "(509) 927-8288", website: "ironworkers14.org", lat: 47.6587, lng: -117.426, address: "16610 E. Euclid Ave., Spokane, WA 99216" },
  { id: 10015, name: "IW Local 15", city: "Hartford", state: "CT", phone: "(860) 249-7639", website: "ironworkers15.org", lat: 41.7658, lng: -72.6851, address: "49 Locust Street, Hartford, CT 06114" },
  { id: 10017, name: "IW Local 17", city: "Cleveland", state: "OH", phone: "(216) 771-5558", website: "iw17.org", lat: 41.4993, lng: -81.6944, address: "1544 E. 23rd St., Cleveland, OH 44114", email: "union@ironworkers17.org" },
  { id: 10021, name: "IW Local 21", city: "Omaha", state: "NE", phone: "(712) 252-1761", website: "iw21.org", lat: 41.2565, lng: -95.9345, address: "14515 Industrial Rd, Omaha, NE 68144" },
  { id: 10022, name: "IW Local 22", city: "Indianapolis", state: "IN", phone: "(317) 243-8222", website: "ironworkers22.com", lat: 39.7684, lng: -86.1581, address: "5600 Dividend Road, Indianapolis, IN 46241" },
  { id: 10075, name: "IW Local 75", city: "Phoenix", state: "AZ", phone: "(602) 268-1449", website: "ironworkers75.org", lat: 33.4484, lng: -112.074, address: "950 E. Elwood St., Phoenix, AZ 85040" },
  { id: 10092, name: "IW Local 92", city: "Birmingham", state: "AL", phone: "(205) 323-4551", website: "ironworkerslocal92.org", lat: 33.5186, lng: -86.8104, address: "2828 4th Avenue South, Birmingham, AL 35233", email: "localno92@bellsouth.net" },
  { id: 10321, name: "IW Local 321", city: "Little Rock", state: "AR", phone: "(501) 374-3705", website: null, lat: 34.7465, lng: -92.2896, address: "1315 W 2nd St, Little Rock, AR 72201", email: "ironworkers321@yahoo.com" },
  { id: 10477, name: "IW Local 477", city: "Sheffield", state: "AL", phone: "(256) 383-3334", website: "ironworkers477.org", lat: 34.7651, lng: -87.6975, address: "506 N Nashville Ave, Sheffield, AL 35660" },
  { id: 10751, name: "IW Local 751", city: "Anchorage", state: "AK", phone: "(907) 563-4766", website: "ironworkers751.org", lat: 61.2181, lng: -149.9003, address: "8141 Schoon St, Anchorage, AK 99518" },
  { id: 10798, name: "IW Local 798", city: "Semmes", state: "AL", phone: "(251) 645-2477", website: "ironworkers798.org", lat: 30.6954, lng: -88.0399, address: "7920 Crary Station Rd., Semmes, AL 36575" },
  { id: 10845, name: "IW Local 845", city: "Beaver", state: "PA", phone: "(412) 849-1271", website: "ironworkers845.org", lat: 40.6959, lng: -80.3045, address: "PO Box 190, Beaver, PA 15009", email: "contact@ironworkers845.org" },
  { id: 10852, name: "IW Local 852", city: "Framingham", state: "MA", phone: "(508) 202-9453", website: "ironworkers852.org", lat: 42.2793, lng: -71.4162, address: "9 Pleasant Street, Framingham, MA 01701" },
  { id: 10854, name: "IW Local 854", city: "Fredericksburg", state: "VA", phone: "(757) 461-3454", website: "ironworkers854.org", lat: 38.3032, lng: -77.4605, address: "415 William Street, Fredericksburg, VA 22401", email: "iwlu854a@ironworkers.org" },
  { id: 108471, name: "IW Local 847", city: "Houston", state: "TX", phone: "(713) 984-9980", website: "ironworkers847.org", lat: 29.7604, lng: -95.3698, address: "16233 Clay Rd Suite 320, Houston, TX 77084" },
  { id: 108472, name: "IW Local 847", city: "Omaha", state: "NE", phone: "(402) 731-2490", website: "ironworkers847.org", lat: 41.2133, lng: -96.0779, address: "4205 South 87th St., Omaha, NE 68127" },
  { id: 108473, name: "IW Local 847", city: "Denver", state: "CO", phone: "(303) 287-4301", website: "ironworkers847.org", lat: 39.7392, lng: -104.9903, address: "5575 Tejon St., Denver, CO 80221" },
  { id: 108474, name: "IW Local 847", city: "Phoenix", state: "AZ", phone: "(602) 233-0417", website: "ironworkers847.org", lat: 33.4484, lng: -112.074, address: "3131 W. Lewis Ave Suite 100, Phoenix, AZ 85009" },
  { id: 108475, name: "IW Local 847", city: "West Valley City", state: "UT", phone: "(801) 463-2897", website: "ironworkers847.org", lat: 40.6916, lng: -112.001, address: "2702 South 3600 West Suite C, West Valley City, UT 84119" },

  { id: 10024, name: "IW Local 24", city: "Denver", state: "CO", phone: "(303) 623-5386", website: "ironworkers24.org", lat: 39.7392, lng: -104.9903, address: "501 West 4th Ave., Denver, CO 80223" },
  { id: 10025, name: "IW Local 25", city: "Novi", state: "MI", phone: "(248) 344-9494", website: "ironworkers25.org", lat: 42.4806, lng: -83.4755, address: "25150 Trans X Drive, Novi, MI 48376", email: "union@ironworkers25.org" },
  { id: 10027, name: "IW Local 27", city: "Salt Lake City", state: "UT", phone: "(801) 972-5714", website: "ironworkers27.com", lat: 40.7608, lng: -111.891, address: "2261 South Redwood Rd. Ste. E, Salt Lake City, UT 84119" },
  { id: 10028, name: "IW Local 28", city: "Midlothian", state: "VA", phone: "(804) 716-2081", website: "ironworkers28.org", lat: 37.5184, lng: -77.6488, address: "2831 Oak Lake Blvd., Midlothian, VA 23112" },
  { id: 10029, name: "IW Local 29", city: "Portland", state: "OR", phone: "(503) 774-0777", website: "ironworkers29.org", lat: 45.5231, lng: -122.5585, address: "11620 NE Ainsworth Circle Ste. 200, Portland, OR 97220", email: "info@ironworkers29.org" },
  { id: 10033, name: "IW Local 33", city: "Rochester", state: "NY", phone: "(585) 288-2630", website: "ironworkers33.org", lat: 43.1566, lng: -77.6088, address: "650 Trabold Rd., Rochester, NY 14624", email: "iw.local.33@ironworkers33.org" },
  { id: 10037, name: "IW Local 37", city: "East Providence", state: "RI", phone: "(401) 438-1111", website: "iwlocal37.com", lat: 41.8081, lng: -71.3681, address: "845 Waterman Ave., East Providence, RI 02914", email: "ironworkerslu37@gmail.com" },
  { id: 10040, name: "IW Local 40", city: "New York", state: "NY", phone: "(212) 889-1320", website: "ironworkers40.org", lat: 40.7128, lng: -74.0059, address: "451 Park Ave. South, New York, NY 10016" },
  { id: 10044, name: "IW Local 44", city: "Hebron", state: "KY", phone: "(859) 586-2100", website: "ironworkers44.com", lat: 39.0695, lng: -84.7021, address: "1125 Victory Pl., Hebron, KY 41048" },
  { id: 10046, name: "IW Local 46", city: "Springfield", state: "IL", phone: "(217) 528-4041", website: "ironworkers46.org", lat: 39.7817, lng: -89.6501, address: "2888 East Cook St., Springfield, IL 62703" },
  { id: 100461, name: "IW Local 46", city: "New York", state: "NY", phone: "(212) 737-0500", website: "ml46.org", lat: 40.7736, lng: -73.9566, address: "1322 3rd Avenue, New York, NY 10021" },
  { id: 10048, name: "IW Local 48", city: "Oklahoma City", state: "OK", phone: "(405) 632-6154", website: "ironworkers48.org", lat: 35.4676, lng: -97.5164, address: "1044 SW 22nd St., Oklahoma City, OK 73109", email: "lm48okc@gmail.com" },
  { id: 10055, name: "IW Local 55", city: "Toledo", state: "OH", phone: "(419) 385-6613", website: "ironworkerslocal55.com", lat: 41.6528, lng: -83.5379, address: "1080 Atlantic Ave., Toledo, OH 43609" },
  { id: 10060, name: "IW Local 60", city: "Syracuse", state: "NY", phone: "(315) 422-8200", website: "ironworkers60.org", lat: 43.0481, lng: -76.1474, address: "500 West Genesee St., Syracuse, NY 13204", email: "busmgr@ironworkers60.org" },
  { id: 10063, name: "IW Local 63", city: "Westchester", state: "IL", phone: "(708) 344-7727", website: "iwlocal63.com", lat: 41.8502, lng: -87.8873, address: "2205 Enterprise Drive Suite 502, Westchester, IL 60154" },
  { id: 10066, name: "IW Local 66", city: "San Antonio", state: "TX", phone: "(210) 532-5237", website: "ironworkerslocal66.org", lat: 29.4241, lng: -98.4936, address: "4318 Clark Ave., San Antonio, TX 78223" },
  { id: 10067, name: "IW Local 67", city: "Des Moines", state: "IA", phone: "(515) 262-9366", website: "ironworkerslocal67.com", lat: 41.5868, lng: -93.625, address: "1501 East Aurora Ave., Des Moines, IA 50313" },
  { id: 10070, name: "IW Local 70", city: "Louisville", state: "KY", phone: "(502) 637-8796", website: "ironworkerslocal70.com", lat: 38.2527, lng: -85.7585, address: "2429 Crittenden Dr., Louisville, KY 40217", email: "iwlu70bm@ironworkers.org" },
  { id: 10084, name: "IW Local 84", city: "Houston", state: "TX", phone: "(713) 928-3361", website: "ironworkers84.org", lat: 29.7604, lng: -95.3698, address: "7521 Fauna St., Houston, TX 77061", email: "local84@comcast.net" },
  { id: 10086, name: "IW Local 86", city: "Tukwila", state: "WA", phone: "(206) 248-4246", website: "local86.org", lat: 47.4709, lng: -122.2621, address: "4550 S. 134th Pl. #102, Tukwila, WA 98168", email: "local86@local86.org" },
  { id: 10089, name: "IW Local 89", city: "Cedar Rapids", state: "IA", phone: "(319) 365-8675", website: "iwlu89.com", lat: 41.9779, lng: -91.6656, address: "1112 29th Ave. SW, Cedar Rapids, IA 52404" },
  { id: 10097, name: "IW Local 97", city: "Maple Ridge", state: "BC", phone: "(866) 562-2597", website: "ironworkerslocal97.com", lat: 49.2193, lng: -122.5985, address: "20135 115A Ave., Maple Ridge, BC V2X 0Z3", email: "info@ironworkerslocal97.com" },
  { id: 10103, name: "IW Local 103", city: "Evansville", state: "IN", phone: "(812) 477-5317", website: "ironworkers103.org", lat: 37.9716, lng: -87.5711, address: "5313 Old Boonville Hwy., Evansville, IN 47715", email: "union@ironworkers103.org" },
  { id: 10111, name: "IW Local 111", city: "Rock Island", state: "IL", phone: "(309) 756-6614", website: "ironworkers111.org", lat: 41.5095, lng: -90.5865, address: "8000 29th St. West, Rock Island, IL 61201" },
  { id: 10112, name: "IW Local 112", city: "East Peoria", state: "IL", phone: "(309) 699-6489", website: "ironworkers112.org", lat: 40.6936, lng: -89.589, address: "3003 N. Main St., East Peoria, IL 61611", email: "iwlocal112@gmail.com" },
  { id: 10118, name: "IW Local 118", city: "Sacramento", state: "CA", phone: "(916) 646-6976", website: "iw118.org", lat: 38.5816, lng: -121.4944, address: "2840 El Centro Rd. Ste. 118, Sacramento, CA 95833" },
  { id: 10135, name: "IW Local 135", city: "Texas City", state: "TX", phone: "(409) 935-2421", website: "ironworkers135.org", lat: 29.3841, lng: -94.9027, address: "216 Gulf Freeway N, Texas City, TX 77591", email: "iwlu135@aol.com" },
  { id: 10136, name: "IW Local 136", city: "Broadview", state: "IL", phone: "(708) 615-9300", website: "riggerslocal136.com", lat: 41.8614, lng: -87.852, address: "1820 Beach St., Broadview, IL 60155" },
  { id: 10147, name: "IW Local 147", city: "Fort Wayne", state: "IN", phone: "(260) 484-8514", website: "ironworkers147.org", lat: 41.0793, lng: -85.1394, address: "6345 Innovation Blvd., Fort Wayne, IN 46818" },
  { id: 10155, name: "IW Local 155", city: "Fresno", state: "CA", phone: "(559) 251-7388", website: "ironworkers155.org", lat: 36.7378, lng: -119.7871, address: "5407 E. Olive Ave. Ste. 106, Fresno, CA 93727", email: "local@ironworkers155.org" },
  { id: 10167, name: "IW Local 167", city: "Memphis", state: "TN", phone: "(901) 367-1676", website: "ironworkers167.com", lat: 35.1495, lng: -90.049, address: "2574 Lindawood Cove, Memphis, TN 38118", email: "iwlu167@bellsouth.net" },
  { id: 10172, name: "IW Local 172", city: "Columbus", state: "OH", phone: "(614) 497-0550", website: "ironworkers172.com", lat: 39.9612, lng: -82.9988, address: "2867 South High St., Columbus, OH 43207" },
  { id: 10197, name: "IW Local 197", city: "Long Island City", state: "NY", phone: "(718) 361-6534", website: "ironworkers197.org", lat: 40.7447, lng: -73.9485, address: "47-10 32nd Place Ste. 403, Long Island City, NY 11101", email: "billhayes197@yahoo.com" },
  { id: 10207, name: "IW Local 207", city: "Youngstown", state: "OH", phone: "(330) 758-9777", website: "iw207.com", lat: 41.0998, lng: -80.6495, address: "694 Bev Rd., Youngstown, OH 44512" },
  { id: 10229, name: "IW Local 229", city: "San Diego", state: "CA", phone: "(858) 571-5238", website: "local229.org", lat: 32.7157, lng: -117.1611, address: "5155 Mercury Point, San Diego, CA 92111" },
  { id: 10263, name: "IW Local 263", city: "Arlington", state: "TX", phone: "(817) 640-0202", website: "ironworkerslocal263.org", lat: 32.7357, lng: -97.1081, address: "604 N. Great Southwest Pkwy, Arlington, TX 76011", email: "iwlu263@gmail.com" },
  { id: 10272, name: "IW Local 272", city: "Fort Lauderdale", state: "FL", phone: "(954) 524-8731", website: "ironworkerslocal272.com", lat: 26.1224, lng: -80.1373, address: "1201 NE 7th Ave., Fort Lauderdale, FL 33304" },
  { id: 10290, name: "IW Local 290", city: "Tipp City", state: "OH", phone: "(937) 222-1622", website: "iron290.com", lat: 39.9611, lng: -84.1716, address: "4191 E. US Rt. 40, Tipp City, OH 45371" },
  { id: 10361, name: "IW Local 361", city: "Ozone Park", state: "NY", phone: "(718) 322-1016", website: "ironworkers361.com", lat: 40.6782, lng: -73.8458, address: "89-19 97th Ave., Ozone Park, NY 11416", email: "unionhall@local361.com" },
  { id: 10377, name: "IW Local 377", city: "San Francisco", state: "CA", phone: "(415) 285-3880", website: "ironworkers377.com", lat: 37.7749, lng: -122.4194, address: "570 Barneveld Ave., San Francisco, CA 94124" },
  { id: 10378, name: "IW Local 378", city: "Benicia", state: "CA", phone: "(707) 746-6100", website: "ironworkers378.org", lat: 38.0499, lng: -122.1597, address: "3120 Bayshore Rd., Benicia, CA 94510" },
  { id: 10380, name: "IW Local 380", city: "Urbana", state: "IL", phone: "(217) 367-6014", website: "ironworkers380.org", lat: 40.1164, lng: -88.2434, address: "1602 East Butzow Dr., Urbana, IL 61802", email: "ironworkers380@gmail.com" },
  { id: 10383, name: "IW Local 383", city: "Madison", state: "WI", phone: "(608) 256-3162", website: "iron383.com", lat: 43.0731, lng: -89.4012, address: "5501 Manufacturer's Dr., Madison, WI 53704" },
  { id: 10384, name: "IW Local 384", city: "Knoxville", state: "TN", phone: "(865) 689-3371", website: "ironworkers384.com", lat: 35.9606, lng: -83.9207, address: "1000 Buchanan Ave. NE, Knoxville, TN 37917" },
  { id: 10387, name: "IW Local 387", city: "Atlanta", state: "GA", phone: "(404) 505-0022", website: "ironworkerslocal387.com", lat: 33.749, lng: -84.388, address: "109 Selig Dr. SW, Atlanta, GA 30336", email: "iwlocal387@aol.com" },
  { id: 10392, name: "IW Local 392", city: "East St. Louis", state: "IL", phone: "(618) 874-0313", website: "ironworkers392.org", lat: 38.6245, lng: -90.1542, address: "2995 Kingshighway, East St. Louis, IL 62201" },
  { id: 10395, name: "IW Local 395", city: "Portage", state: "IN", phone: "(219) 763-7900", website: "ironworkers395.com", lat: 41.5759, lng: -87.1764, address: "6570 Ameriplex Dr., Portage, IN 46368", email: "webmaster@ironworkers395.com" },
  { id: 10396, name: "IW Local 396", city: "St. Louis", state: "MO", phone: "(314) 647-3008", website: "ironworkers396.org", lat: 38.627, lng: -90.1994, address: "2500 59th St., St. Louis, MO 63110" },
  { id: 10397, name: "IW Local 397", city: "Tampa", state: "FL", phone: "(813) 623-1515", website: "iwl397.com", lat: 27.9506, lng: -82.4572, address: "10201 US Highway 92 East, Tampa, FL 33610" },
  { id: 10399, name: "IW Local 399", city: "Hammonton", state: "NJ", phone: "(856) 456-9323", website: "ironworkers399.org", lat: 39.6434, lng: -74.7996, address: "26 E. Fleming Pike, Hammonton, NJ 08037" },
  { id: 10401, name: "IW Local 401", city: "Philadelphia", state: "PA", phone: "(215) 676-3000", website: "local401.com", lat: 40.0719, lng: -74.9942, address: "11600 Norcom Rd., Philadelphia, PA 19154", email: "ironworkers401@aol.com" },
  { id: 10402, name: "IW Local 402", city: "Riviera Beach", state: "FL", phone: "(561) 842-7651", website: null, lat: 26.7748, lng: -80.0581, address: "1001 West 15th St., Riviera Beach, FL 33404" },
  { id: 10404, name: "IW Local 404", city: "Harrisburg", state: "PA", phone: "(717) 564-8550", website: "ironworkerslocal404.org", lat: 40.2732, lng: -76.8867, address: "981 Peifers Ln., Harrisburg, PA 17109" },
  { id: 10405, name: "IW Local 405", city: "Philadelphia", state: "PA", phone: "(215) 462-7300", website: "reinforcedironworkersriggerslocal405.com", lat: 39.9313, lng: -75.1826, address: "2433 Reed St., Philadelphia, PA 19146" },
  { id: 10416, name: "IW Local 416", city: "Norwalk", state: "CA", phone: "(562) 868-1251", website: "ironworkers416.org", lat: 33.9022, lng: -118.082, address: "13830 San Antonio Dr., Norwalk, CA 90650" },
  { id: 10417, name: "IW Local 417", city: "Wallkill", state: "NY", phone: "(845) 566-8417", website: "ironworkers417.org", lat: 41.6012, lng: -74.1654, address: "583 Rte. 32, Wallkill, NY 12589" },
  { id: 10424, name: "IW Local 424", city: "North Haven", state: "CT", phone: "(203) 787-4154", website: "ironworkers424.org", lat: 41.3908, lng: -72.8593, address: "15 Bernhard Rd., North Haven, CT 06473" },
  { id: 10433, name: "IW Local 433", city: "City of Industry", state: "CA", phone: "(626) 964-2500", website: "ironworkers433.org", lat: 34.0125, lng: -117.9626, address: "17495 Hurley St. East, City of Industry, CA 91744", email: "keith@ironworkers433.org" },
  { id: 10440, name: "IW Local 440", city: "Whitesboro", state: "NY", phone: "(315) 735-4531", website: "ironworkers440.com", lat: 43.1206, lng: -75.2927, address: "10 Main St. Ste. 100, Whitesboro, NY 13492" },
  { id: 10444, name: "IW Local 444", city: "Joliet", state: "IL", phone: "(815) 725-1804", website: "ironworkers444.com", lat: 41.525, lng: -88.0817, address: "2082 Oak Leaf St., Joliet, IL 60436" },
  { id: 10451, name: "IW Local 451", city: "Wilmington", state: "DE", phone: "(302) 994-0946", website: "iwlocal451.org", lat: 39.7447, lng: -75.5484, address: "203 Old DuPont Rd., Wilmington, DE 19804" },
  { id: 10482, name: "IW Local 482", city: "Austin", state: "TX", phone: "(512) 385-2500", website: "ironworkers482.org", lat: 30.2672, lng: -97.7431, address: "2201 Riverside Farms Rd., Austin, TX 78741" },
  { id: 10492, name: "IW Local 492", city: "Nashville", state: "TN", phone: "(615) 226-5435", website: "ironworkers492.org", lat: 36.1627, lng: -86.7816, address: "2524 Dickerson Pike, Nashville, TN 37207" },
  { id: 10495, name: "IW Local 495", city: "Albuquerque", state: "NM", phone: "(505) 242-9124", website: "ironworkers495.org", lat: 35.0844, lng: -106.6504, address: "2524 Baylor Dr. SE, Albuquerque, NM 87106", email: "busmgr@ironworkers495.org" },
  { id: 10498, name: "IW Local 498", city: "Rockford", state: "IL", phone: "(815) 873-9180", website: "iwlocal498.org", lat: 42.2711, lng: -89.094, address: "5640 Sockness Dr., Rockford, IL 61109" },
  { id: 10512, name: "IW Local 512", city: "St. Paul", state: "MN", phone: "(651) 489-1488", website: "ironworkers512.com", lat: 44.9537, lng: -93.09, address: "851 Pierce Butler Route, St. Paul, MN 55104" },
  { id: 10516, name: "IW Local 516", city: "Portland", state: "OR", phone: "(503) 257-4743", website: "local516.org", lat: 45.5231, lng: -122.5585, address: "11620 NE Ainsworth Circle Ste. 300, Portland, OR 97220", email: "shopmens@pacifier.com" },
  { id: 10549, name: "IW Local 549", city: "Wheeling", state: "WV", phone: "(304) 232-2660", website: "iwlocal549.org", lat: 40.064, lng: -80.7209, address: "2350 Main St., Wheeling, WV 26003" },
  { id: 10550, name: "IW Local 550", city: "Canton", state: "OH", phone: "(330) 455-5164", website: "iw550.org", lat: 40.7989, lng: -81.3784, address: "618 High Ave. NW, Canton, OH 44703" },
  { id: 10568, name: "IW Local 568", city: "Cumberland", state: "MD", phone: "(301) 777-7433", website: "ironworkers568.org", lat: 39.6526, lng: -78.7625, address: "119 South Centre St., Cumberland, MD 21502" },
  { id: 10577, name: "IW Local 577", city: "Keokuk", state: "IA", phone: "(319) 313-8581", website: "ironworkers577.org", lat: 40.3975, lng: -91.3848, address: "2700 Kindustry Park Rd., Keokuk, IA 52632", email: "ironworkerslu577@gmail.com" },
  { id: 10580, name: "IW Local 580", city: "New York", state: "NY", phone: "(212) 594-1662", website: "ironworkers580.org", lat: 40.758, lng: -73.994, address: "501 West 42nd St., New York, NY 10036" },
  { id: 10584, name: "IW Local 584", city: "Tulsa", state: "OK", phone: "(918) 437-1446", website: "tulsaironworkers.com", lat: 36.154, lng: -95.9928, address: "14716 E. Pine St, Tulsa, OK 74116", email: "ironworkers584@sbcglobal.net" },
  { id: 10597, name: "IW Local 597", city: "Jacksonville", state: "FL", phone: "(904) 764-3265", website: "ironworkers597.com", lat: 30.3322, lng: -81.6557, address: "9616 Kentucky St., Jacksonville, FL 32218", email: "info@ironworkers597.com" },
  { id: 10623, name: "IW Local 623", city: "Baton Rouge", state: "LA", phone: "(225) 357-3262", website: "ironworkerslocal623.org", lat: 30.4515, lng: -91.1871, address: "6153 Airline Highway, Baton Rouge, LA 70805", email: "luke@local623.org" },
  { id: 10625, name: "IW Local 625", city: "Waipahu", state: "HI", phone: "(808) 671-4344", website: null, lat: 21.3865, lng: -158.0095, address: "94-497 Ukee St., Waipahu, HI 96797" },
  { id: 10643, name: "IW Local 643", city: "Victoria", state: "BC", phone: "(250) 213-8661", website: null, lat: 48.4284, lng: -123.3656, address: "Unit 105, 1497 Admirals Rd., Victoria, BC V9A 2P8", email: "ironworkers643@outlook.com" },
  { id: 10700, name: "IW Local 700", city: "Maidstone", state: "ON", phone: "(519) 737-7110", website: "ironworkerslocal700.com", lat: 42.2668, lng: -82.9131, address: "R.R.#3, 4069 County Rd. #46, Maidstone, ON N0R 1K0" },
  { id: 10704, name: "IW Local 704", city: "Chattanooga", state: "TN", phone: "(423) 622-2111", website: "iw704.com", lat: 35.0456, lng: -85.3097, address: "2715 Belle Arbor Ave., Chattanooga, TN 37406", email: "ironworkers704@iw704.com" },
  { id: 10709, name: "IW Local 709", city: "Pooler", state: "GA", phone: "(912) 748-5118", website: "ironworkerslocal709.org", lat: 32.1152, lng: -81.2479, address: "131 Westside Blvd., Pooler, GA 31322", email: "bmc709@ymail.com" },
  { id: 10711, name: "IW Local 711", city: "Montreal", state: "QC", phone: "(514) 328-2808", website: "local711.ca", lat: 45.5017, lng: -73.5673, address: "9950 Boul. Du Golf, Anjou, QC H1J 2Y7", email: "info@local711.ca" },
  { id: 10720, name: "IW Local 720", city: "Edmonton", state: "AB", phone: "(780) 482-0720", website: "ironworkers720.com", lat: 53.5461, lng: -113.4938, address: "10512-122 St., Edmonton, AB T5N 1M6", email: "admin@ironworkers720.com" },
  { id: 10721, name: "IW Local 721", city: "Etobicoke", state: "ON", phone: "(416) 236-4026", website: "iw721.org", lat: 43.6205, lng: -79.5132, address: "909 Kipling Ave., Etobicoke, ON M8Z 5H3" },
  { id: 10725, name: "IW Local 725", city: "Calgary", state: "AB", phone: "(403) 291-1300", website: "ironworkers725.com", lat: 51.0447, lng: -114.0719, address: "6111 36 St. SE, Calgary, AB T2C 3W2" },
  { id: 10728, name: "IW Local 728", city: "West St. Paul", state: "MB", phone: "(204) 783-7853", website: "ironworkers728.com", lat: 49.999, lng: -97.1327, address: "54B St. Paul Blvd., West St. Paul, MB R2P 2W5", email: "officeadmin@ironworkers728.com" },
  { id: 10732, name: "IW Local 732", city: "Pocatello", state: "ID", phone: "(208) 232-4873", website: "iw732.org", lat: 42.8713, lng: -112.4455, address: "1700 N. Harrison Ave., Pocatello, ID 83204" },
  { id: 10736, name: "IW Local 736", city: "Ancaster", state: "ON", phone: "(905) 679-6439", website: "iw736.com", lat: 43.2188, lng: -80.0022, address: "1384 Osprey Dr., Ancaster, ON L9G 4V5", email: "steven.pratt@iw736.com" },
  { id: 10752, name: "IW Local 752", city: "Lakeside", state: "NS", phone: "(902) 450-5615", website: "ironworkerslocal752.com", lat: 44.6488, lng: -63.5752, address: "24 Lakeside Park Dr. Unit 103, Lakeside, NS B3T 1L1", email: "iron.worker@ns.sympatico.ca" },
  { id: 10759, name: "IW Local 759", city: "Thunder Bay", state: "ON", phone: "(807) 345-8151", website: "ironworkers759.org", lat: 48.3809, lng: -89.2477, address: "915 Alloy Dr., Thunder Bay, ON P7B 5Z8", email: "iw759@iw759.com" },
  { id: 10765, name: "IW Local 765", city: "Metcalfe", state: "ON", phone: "(613) 821-7813", website: "ironworkers765.com", lat: 45.2334, lng: -75.471, address: "7771 Snake Island Rd., Metcalfe, ON K0A 2P0", email: "local765@ironworkers765.com" },
  { id: 10769, name: "IW Local 769", city: "Ashland", state: "KY", phone: "(606) 324-0415", website: "ironworkerslocal769.com", lat: 38.4784, lng: -82.6379, address: "2151 Greenup Ave., Ashland, KY 41105" },
  { id: 10771, name: "IW Local 771", city: "Regina", state: "SK", phone: "(306) 522-7932", website: "local771.ca", lat: 50.4452, lng: -104.6189, address: "1138 Dewdney Ave. E, Regina, SK S4N 0E2", email: "jeff@local771.ca" },
  { id: 10782, name: "IW Local 782", city: "Paducah", state: "KY", phone: "(270) 442-2722", website: "ironworkers782.org", lat: 37.0834, lng: -88.6, address: "2424 Cairo Rd., Paducah, KY 42001", email: "ironworkerslo782@bellsouth.net" },
  { id: 10786, name: "IW Local 786", city: "Sudbury", state: "ON", phone: "(705) 674-6903", website: "iw786.com", lat: 46.49, lng: -80.9911, address: "97 St. George St., Sudbury, ON P3C 2W7" },
  { id: 10787, name: "IW Local 787", city: "Parkersburg", state: "WV", phone: "(304) 485-6231", website: "ironworkers787.org", lat: 39.2667, lng: -81.5615, address: "303 Erickson Blvd., Parkersburg, WV 26101" },
  { id: 10808, name: "IW Local 808", city: "Orlando", state: "FL", phone: "(407) 859-9366", website: "ironworkers808.com", lat: 28.5383, lng: -81.3792, address: "200 East Landstreet Rd., Orlando, FL 32824" },
  { id: 10809, name: "IW Local 809", city: "Saint John", state: "NB", phone: "(506) 343-6678", website: null, lat: 45.2733, lng: -66.0633, address: "407 Westmorland Rd., Saint John, NB E2J 2S0" },
  { id: 10834, name: "IW Local 834", city: "Toronto", state: "ON", phone: "(905) 920-4331", website: "iw834.com", lat: 43.6532, lng: -79.3832, address: "Toronto, ON" },
  { id: 10842, name: "IW Local 842", city: "Moncton", state: "NB", phone: "(506) 857-4871", website: "ironworkers842.ca", lat: 46.0878, lng: -64.7782, address: "1133 St. George Blvd. Ste. 450, Moncton, NB E1E 4E1", email: "administration@ironworkers842.ca" },
  { id: 10846, name: "IW Local 846", city: "Aiken", state: "SC", phone: "(803) 644-2187", website: "iw846.org", lat: 33.5601, lng: -81.7198, address: "6220 Woodside Executive Court, Aiken, SC 29803" },
  { id: 10848, name: "IW Local 848", city: "North Charleston", state: "SC", phone: "(843) 552-1554", website: "ironworkers848.org", lat: 32.8546, lng: -79.9748, address: "7326 Pepperdam Ave., North Charleston, SC 29418" },
];

// ─── LIUNA LOCALS DATABASE — Laborers' International Union of North America ───
const LIUNA_LOCALS = [];

// ─── UA LOCALS DATABASE — Plumbers & Pipefitters (source: unionpayscales.com) ─
const UA_LOCALS = [
  { id: 52, name: "UA Local 52", city: "Montgomery", state: "AL", phone: "(334) 272-9500", website: "ualocal52.org", lat: 32.3182, lng: -86.1549, address: "5563 Wares Ferry Rd, Montgomery, AL 36117" },
  { id: 91, name: "UA Local 91", city: "Birmingham", state: "AL", phone: "(205) 591-2721", website: "ua91.org", lat: 33.5186, lng: -86.8104, address: "3648 9th Ave N, Birmingham, AL 35222" },
  { id: 119, name: "UA Local 119", city: "Mobile", state: "AL", phone: "(251) 476-0625", website: "ualocal119.org", lat: 30.6954, lng: -88.0399, address: "2458 Old Shell Rd, Mobile, AL 36607" },
  { id: 372, name: "UA Local 372", city: "Tuscaloosa", state: "AL", phone: "(205) 758-6236", website: "ualocal372.org", lat: 33.2098, lng: -87.5692, address: "9410 Hwy 82 E, Duncanville, AL 35456" },
  { id: 548, name: "UA Local 548", city: "Montgomery", state: "AL", phone: "(334) 309-4563", website: "ua.org", lat: 32.4637, lng: -86.3697, address: "1719 Country Rd 85, Prattville, AL 36067" },
  { id: 760, name: "UA Local 760", city: "Muscle Shoals", state: "AL", phone: "(256) 383-7900", website: "ua.org", lat: 34.7448, lng: -87.6675, address: "2807 Avalon Ave, Muscle Shoals, AL 35661" },
  { id: 262, name: "UA Local 262", city: "Juneau", state: "AK", phone: "(907) 586-2874", website: "local392.com", lat: 58.3005, lng: -134.4197, address: "1751 Anka St, Juneau, AK 99801" },
  { id: 367, name: "UA Local 367", city: "Anchorage", state: "AK", phone: "(907) 562-2810", website: "ualocal367.org", lat: 61.2181, lng: -149.9003, address: "610 W 54th Ave, Anchorage, AK 99518" },
  { id: 375, name: "UA Local 375", city: "Fairbanks", state: "AK", phone: "(907) 479-6221", website: "ualocal375.org", lat: 64.8378, lng: -147.7164, address: "3980 Boat St, Fairbanks, AK 99709" },
  { id: 469, name: "UA Local 469", city: "Phoenix", state: "AZ", phone: "(602) 956-9350", website: "ualocal469.org", lat: 33.4484, lng: -112.074, address: "3109 N 24th St Bldg A, Phoenix, AZ 85016" },
  { id: 155, name: "UA Local 155", city: "Little Rock", state: "AR", phone: "(501) 374-4943", website: "ua.org", lat: 34.7465, lng: -92.2896, address: "1223 W Markham, Little Rock, AR 72201" },
  { id: 38, name: "UA Local 38", city: "San Francisco", state: "CA", phone: "(415) 626-2000", website: "ualocal38.org", lat: 37.7749, lng: -122.4194, address: "1621 Market St, San Francisco, CA 94103" },
  { id: 62, name: "UA Local 62", city: "Castroville", state: "CA", phone: "(831) 633-6091", website: "pipetrades62.com", lat: 36.7638, lng: -121.7578, address: "11445 Commercial Pkwy, Castroville, CA 95012" },
  { id: 78, name: "UA Local 78", city: "Los Angeles", state: "CA", phone: "(213) 688-9090", website: "uaplumber78.com", lat: 34.0522, lng: -118.2437, address: "1111 W James M Wood Blvd, Los Angeles, CA 90015" },
  { id: 114, name: "UA Local 114", city: "Santa Barbara", state: "CA", phone: "(805) 688-1470", website: "ualocal114.org", lat: 34.6138, lng: -120.1942, address: "93 Thomas Rd, Buellton, CA 93427" },
  { id: 159, name: "UA Local 159", city: "Martinez", state: "CA", phone: "(925) 229-0400", website: "ualocal159.org", lat: 37.991, lng: -122.1341, address: "1308 Roman Way, Martinez, CA 94553" },
  { id: 228, name: "UA Local 228", city: "Marysville", state: "CA", phone: "(530) 673-8690", website: "lu228.org", lat: 39.1457, lng: -121.5913, address: "1015 Yuba St, Marysville, CA 95901" },
  { id: 230, name: "UA Local 230", city: "San Diego", state: "CA", phone: "(858) 554-0586", website: "ualocal230.org", lat: 32.7157, lng: -117.1611, address: "6313 Nancy Ridge Dr, San Diego, CA 92121" },
  { id: 246, name: "UA Local 246", city: "Fresno", state: "CA", phone: "(559) 252-7246", website: "local246.com", lat: 36.7378, lng: -119.7871, address: "1303 N Rabe Ave Ste 101, Fresno, CA 93727" },
  { id: 250, name: "UA Local 250", city: "Gardena", state: "CA", phone: "(310) 660-0035", website: "ua250.org", lat: 33.8884, lng: -118.309, address: "18355 S Figueroa St, Gardena, CA 90248" },
  { id: 342, name: "UA Local 342", city: "Concord", state: "CA", phone: "(925) 686-5880", website: "ua342.org", lat: 37.978, lng: -122.0311, address: "935 Detroit Ave, Concord, CA 94518" },
  { id: 343, name: "UA Local 343", city: "Vacaville", state: "CA", phone: "(707) 644-4071", website: "local343.org", lat: 38.3566, lng: -121.9877, address: "220 Peabody Rd, Vacaville, CA 95687" },
  { id: 345, name: "UA Local 345", city: "Duarte", state: "CA", phone: "(626) 357-9345", website: "ua345.org", lat: 34.1395, lng: -117.9773, address: "1430 Huntington Dr, Duarte, CA 91010" },
  { id: 355, name: "UA Local 355", city: "Vallejo", state: "CA", phone: "(707) 644-0355", website: "ua.org", lat: 38.1041, lng: -122.2566, address: "426 Alabama St, Vallejo, CA 94590" },
  { id: 364, name: "UA Local 364", city: "Colton", state: "CA", phone: "(909) 825-0359", website: "ualocal364.com", lat: 34.0739, lng: -117.3131, address: "223 S Rancho Ave, Colton, CA 92324" },
  { id: 393, name: "UA Local 393", city: "San Jose", state: "CA", phone: "(408) 225-3030", website: "ualocal393.org", lat: 37.2357, lng: -121.8547, address: "6299 San Ignacio Ave, San Jose, CA 95119" },
  { id: 398, name: "UA Local 398", city: "Rancho Cucamonga", state: "CA", phone: "(909) 945-5557", website: "local398.org", lat: 34.1064, lng: -117.5931, address: "8590 Utica Ave Ste 200, Rancho Cucamonga, CA 91730" },
  { id: 403, name: "UA Local 403", city: "San Luis Obispo", state: "CA", phone: "(805) 543-2416", website: "ua403.org", lat: 35.2828, lng: -120.6596, address: "3710 Broad St, San Luis Obispo, CA 93401" },
  { id: 442, name: "UA Local 442", city: "Modesto", state: "CA", phone: "(209) 338-0751", website: "lu442.com", lat: 37.6391, lng: -120.9969, address: "4842 Nutcracker Ln, Modesto, CA 95356" },
  { id: 447, name: "UA Local 447", city: "Sacramento", state: "CA", phone: "(916) 457-6595", website: "ualocal447.org", lat: 38.5816, lng: -121.4944, address: "5841 Newman Ct, Sacramento, CA 95819" },
  { id: 460, name: "UA Local 460", city: "Bakersfield", state: "CA", phone: "(661) 589-4600", website: "local460.com", lat: 35.3733, lng: -119.0187, address: "6718 Meany Ave, Bakersfield, CA 93308" },
  { id: 467, name: "UA Local 467", city: "Burlingame", state: "CA", phone: "(650) 692-4730", website: "ualocal467.org", lat: 37.5841, lng: -122.3661, address: "1519 Rollins Rd, Burlingame, CA 94010" },
  { id: 483, name: "UA Local 483", city: "Hayward", state: "CA", phone: "(510) 785-8483", website: "sprinklerfitters483.org", lat: 37.6688, lng: -122.0808, address: "2525 Barrington Ct, Hayward, CA 94545" },
  { id: 484, name: "UA Local 484", city: "Ventura", state: "CA", phone: "(805) 643-6345", website: "ualocal484.org", lat: 34.2805, lng: -119.2945, address: "1955 N Ventura Ave, Ventura, CA 93001" },
  { id: 582, name: "UA Local 582", city: "Orange", state: "CA", phone: "(714) 978-0582", website: "ualocal582.org", lat: 33.7879, lng: -117.8531, address: "1916 W Chapman Ave, Orange, CA 92868" },
  { id: 709, name: "UA Local 709", city: "Whittier", state: "CA", phone: "(562) 698-9909", website: "sprinklerfitters709.org", lat: 33.9792, lng: -118.0328, address: "12140 Rivera Rd, Whittier, CA 90606" },
  { id: 761, name: "UA Local 761", city: "Burbank", state: "CA", phone: "(818) 843-8670", website: "local761.org", lat: 34.1808, lng: -118.309, address: "1305 N Niagara St, Burbank, CA 91505" },
  { id: 3, name: "UA Local 3", city: "Aurora", state: "CO", phone: "(303) 739-9300", website: "plumberslocal3.org", lat: 39.7294, lng: -104.8319, address: "17100 E 32nd Pl, Aurora, CO 80011" },
  { id: 58, name: "UA Local 58", city: "Colorado Springs", state: "CO", phone: "(719) 633-4052", website: "local58.org", lat: 38.8339, lng: -104.8214, address: "2870 Janitell Rd, Colorado Springs, CO 80906" },
  { id: 145, name: "UA Local 145", city: "Grand Junction", state: "CO", phone: "(970) 245-2012", website: "local145.org", lat: 39.0639, lng: -108.5506, address: "3168 Pipe Ct, Grand Junction, CO 81504" },
  { id: 208, name: "UA Local 208", city: "Denver", state: "CO", phone: "(303) 428-4380", website: "pipe208.com", lat: 39.7392, lng: -104.9903, address: "6350 N Broadway Ste 1, Denver, CO 80216" },
  { id: 777, name: "UA Local 777", city: "Meriden", state: "CT", phone: "(203) 317-4750", website: "local777.com", lat: 41.5382, lng: -72.8073, address: "1250 E Main St, Meriden, CT 06450" },
  { id: 74, name: "UA Local 74", city: "Newark", state: "DE", phone: "(302) 636-7400", website: "ualocal74.com", lat: 39.6837, lng: -75.7497, address: "201 Executive Dr, Newark, DE 19702" },
  { id: 5, name: "UA Local 5", city: "Lanham", state: "MD", phone: "(301) 899-7861", website: "local5plumbers.org", lat: 38.9607, lng: -76.8527, address: "4755 Walden Ln, Lanham, MD 20746" },
  { id: 602, name: "UA Local 602", city: "Capitol Heights", state: "MD", phone: "(301) 333-2356", website: "steamfitters-602.org", lat: 38.8871, lng: -76.9122, address: "8700 Ashwood Dr 2nd Flr, Capitol Heights, MD 20743" },
  { id: 123, name: "UA Local 123", city: "Dover", state: "FL", phone: "(813) 636-0123", website: "lu123.com", lat: 27.9976, lng: -82.2185, address: "3601 N McIntosh Rd, Dover, FL 33527" },
  { id: 234, name: "UA Local 234", city: "Jacksonville", state: "FL", phone: "(904) 786-0941", website: "ua234.com", lat: 30.3322, lng: -81.6557, address: "5411 Cassidy Rd, Jacksonville, FL 32254" },
  { id: 295, name: "UA Local 295", city: "Daytona Beach", state: "FL", phone: "(386) 253-9972", website: "ualocal295.com", lat: 29.2108, lng: -81.0228, address: "743 N Beach St, Daytona Beach, FL 32114" },
  { id: 519, name: "UA Local 519", city: "Hialeah", state: "FL", phone: "(305) 362-0519", website: "plumbers519.com", lat: 25.8576, lng: -80.2781, address: "5931 NW 173rd Dr B5, Hialeah, FL 33015" },
  { id: 630, name: "UA Local 630", city: "West Palm Beach", state: "FL", phone: "(561) 689-8400", website: "lu630.org", lat: 26.7153, lng: -80.1003, address: "1900 N Florida Mango Rd, West Palm Beach, FL 33409" },
  { id: 719, name: "UA Local 719", city: "Fort Lauderdale", state: "FL", phone: "(954) 522-2532", website: "ualocal719.org", lat: 26.1224, lng: -80.1373, address: "2502 S Andrews Ave, Fort Lauderdale, FL 33316" },
  { id: 725, name: "UA Local 725", city: "Opa Locka", state: "FL", phone: "(305) 681-8596", website: "ua725.org", lat: 25.9016, lng: -80.25, address: "13185 NW 45th Ave, Opa Locka, FL 33054" },
  { id: 803, name: "UA Local 803", city: "Orlando", state: "FL", phone: "(407) 851-9240", website: "localunion803.org", lat: 28.5383, lng: -81.3792, address: "2447 Orlando Central Pkwy, Orlando, FL 32809" },
  { id: 821, name: "UA Local 821", city: "West Palm Beach", state: "FL", phone: "(561) 422-9821", website: "sprinklerfitters821.org", lat: 26.6615, lng: -80.1928, address: "1975 Sansbury's Way Ste 115, West Palm Beach, FL 33411" },
  { id: 72, name: "UA Local 72", city: "Atlanta", state: "GA", phone: "(404) 373-5778", website: "ua72.org", lat: 33.749, lng: -84.388, address: "374 Maynard Ter SE, Atlanta, GA 30316" },
  { id: 150, name: "UA Local 150", city: "Augusta", state: "GA", phone: "(706) 724-8846", website: "ua150.org", lat: 33.4735, lng: -82.0105, address: "1211 Telfair St, Augusta, GA 30901" },
  { id: 177, name: "UA Local 177", city: "Brunswick", state: "GA", phone: "(912) 265-1890", website: "ualocal177.org", lat: 31.1499, lng: -81.4915, address: "6148 New Jessup Hwy Ste 341, Brunswick, GA 31523" },
  { id: 188, name: "UA Local 188", city: "Savannah", state: "GA", phone: "(912) 354-5520", website: "localunion188.com", lat: 32.0835, lng: -81.0998, address: "2337 E Victory Dr, Savannah, GA 31404" },
  { id: 473, name: "UA Local 473", city: "Jesup", state: "GA", phone: "(912) 321-2919", website: "ua.org", lat: 31.5996, lng: -81.8857, address: "113 Oliver Ln, Jesup, GA 31545" },
  { id: 675, name: "UA Local 675", city: "Honolulu", state: "HI", phone: "(808) 536-5454", website: "plumbershawaii.com", lat: 21.3069, lng: -157.8583, address: "1109 Bethel St Lower Level, Honolulu, HI 96813" },
  { id: 811, name: "UA Local 811", city: "Waianae", state: "HI", phone: "(808) 630-8000", website: "plumbershawaii.com", lat: 21.4436, lng: -158.1819, address: "85-1060 Waianae Valley Rd, Waianae, HI 96792" },
  { id: 296, name: "UA Local 296", city: "Meridian", state: "ID", phone: "(208) 288-1296", website: "ualocal296.org", lat: 43.6121, lng: -116.3915, address: "575 N Ralstin Ste A, Meridian, ID 83642" },
  { id: 648, name: "UA Local 648", city: "Pocatello", state: "ID", phone: "(208) 232-6806", website: "ualocal648.org", lat: 42.8713, lng: -112.4455, address: "456 N Arthur Ste 4, Pocatello, ID 83204" },
  { id: 23, name: "UA Local 23", city: "Rockford", state: "IL", phone: "(815) 397-0350", website: "ualocal23.org", lat: 42.2711, lng: -89.094, address: "4525 Boeing Dr, Rockford, IL 61109" },
  { id: 25, name: "UA Local 25", city: "Rock Island", state: "IL", phone: "(309) 788-4569", website: "lu25.org", lat: 41.5095, lng: -90.5865, address: "4600 46th Ave, Rock Island, IL 61201" },
  { id: 63, name: "UA Local 63", city: "East Peoria", state: "IL", phone: "(309) 699-3570", website: "plumberslocal63.com", lat: 40.6936, lng: -89.589, address: "116 Harvey Ct, East Peoria, IL 61611" },
  { id: 99, name: "UA Local 99", city: "Bloomington", state: "IL", phone: "(309) 663-2337", website: "ua.org", lat: 40.4842, lng: -88.9937, address: "406 S Eldorado Rd, Bloomington, IL 61704" },
  { id: 101, name: "UA Local 101", city: "Belleville", state: "IL", phone: "(618) 234-5504", website: "ualocal101.org", lat: 38.5201, lng: -89.984, address: "8 Premier Dr, Belleville, IL 62220" },
  { id: 130, name: "UA Local 130", city: "Chicago", state: "IL", phone: "(312) 421-1010", website: "plumberslu130ua.com", lat: 41.8826, lng: -87.6631, address: "1340 W Washington Blvd 2nd Flr, Chicago, IL 60607" },
  { id: 137, name: "UA Local 137", city: "Springfield", state: "IL", phone: "(217) 544-2724", website: "ua137.org", lat: 39.7817, lng: -89.6501, address: "2880 E Cook St, Springfield, IL 62703" },
  { id: 149, name: "UA Local 149", city: "Savoy", state: "IL", phone: "(217) 359-5201", website: "ualocal149.com", lat: 40.0628, lng: -88.2488, address: "1003 N Dulap Ave, Savoy, IL 61874" },
  { id: 160, name: "UA Local 160", city: "Murphysboro", state: "IL", phone: "(618) 684-4521", website: "ualocal160.com", lat: 37.7648, lng: -89.3345, address: "901 Mulberry St, Murphysboro, IL 62966" },
  { id: 281, name: "UA Local 281", city: "Alsip", state: "IL", phone: "(708) 597-1800", website: "sprinklerfitterchicago.org", lat: 41.6659, lng: -87.734, address: "11900 S Laramie Ave, Alsip, IL 60803" },
  { id: 353, name: "UA Local 353", city: "Peoria", state: "IL", phone: "(309) 633-1353", website: "steamfitters353.com", lat: 40.6936, lng: -89.589, address: "6304 W Development Dr, Peoria, IL 61604" },
  { id: 360, name: "UA Local 360", city: "Collinsville", state: "IL", phone: "(618) 346-2560", website: "ualocal360.net", lat: 38.6703, lng: -89.9845, address: "5 Meadow Hgts Professional Park, Collinsville, IL 62234" },
  { id: 439, name: "UA Local 439", city: "Caseyville", state: "IL", phone: "(618) 624-6096", website: null, lat: 38.6317, lng: -90.0348, address: "1220 Donald Bailey Dr, Caseyville, IL 62232" },
  { id: 551, name: "UA Local 551", city: "West Frankfort", state: "IL", phone: "(618) 937-1363", website: "ualocal551.org", lat: 37.8978, lng: -88.9209, address: "10967 Dean Browning Blvd, West Frankfort, IL 62896" },
  { id: 553, name: "UA Local 553", city: "East Alton", state: "IL", phone: "(618) 259-6787", website: "ualocal553.org", lat: 38.8906, lng: -90.1843, address: "2 S Wesley Dr, East Alton, IL 62024" },
  { id: 597, name: "UA Local 597", city: "Chicago", state: "IL", phone: "(312) 829-4191", website: "pf597.org", lat: 41.8826, lng: -87.6631, address: "45 N Ogden Ave, Chicago, IL 60607" },
  { id: 653, name: "UA Local 653", city: "Centralia", state: "IL", phone: "(618) 532-3351", website: "ua.org", lat: 38.5251, lng: -89.1334, address: "116 S Chestnut St, Centralia, IL 62801" },
  { id: 136, name: "UA Local 136", city: "Evansville", state: "IN", phone: "(812) 423-8043", website: "ualocal136.org", lat: 37.9716, lng: -87.5711, address: "2300 St Joseph Ind Pk Dr, Evansville, IN 47720" },
  { id: 157, name: "UA Local 157", city: "Terre Haute", state: "IN", phone: "(812) 877-1531", website: "ualocal157.org", lat: 39.4667, lng: -87.4139, address: "8801 E Milner Ave, Terre Haute, IN 47803" },
  { id: 166, name: "UA Local 166", city: "Fort Wayne", state: "IN", phone: "(260) 490-5696", website: "ualocal166.org", lat: 41.0793, lng: -85.1394, address: "2930 W Ludwig Rd, Fort Wayne, IN 46818" },
  { id: 172, name: "UA Local 172", city: "South Bend", state: "IN", phone: "(574) 273-0300", website: "ua172.org", lat: 41.6764, lng: -86.252, address: "4172 Ralph Jones Ct, South Bend, IN 46628" },
  { id: 210, name: "UA Local 210", city: "Merrillville", state: "IN", phone: "(219) 942-7224", website: "plu210.org", lat: 41.4731, lng: -87.332, address: "2901 E 83rd Pl, Merrillville, IN 46410" },
  { id: 440, name: "UA Local 440", city: "Indianapolis", state: "IN", phone: "(317) 856-3771", website: "ualocal440.org", lat: 39.7684, lng: -86.1581, address: "1521 Brookville Crossing Way, Indianapolis, IN 46239" },
  { id: 33, name: "UA Local 33", city: "Des Moines", state: "IA", phone: "(515) 243-3244", website: "ualocal33.org", lat: 41.5868, lng: -93.625, address: "2501 Bell Ave, Des Moines, IA 50321" },
  { id: 125, name: "UA Local 125", city: "Cedar Rapids", state: "IA", phone: "(319) 365-0413", website: "ualocal125.org", lat: 41.9779, lng: -91.6656, address: "5001 J St SW Ste 200, Cedar Rapids, IA 52404" },
  { id: 441, name: "UA Local 441", city: "Wichita", state: "KS", phone: "(316) 265-4291", website: "ua441.org", lat: 37.6872, lng: -97.3301, address: "529 S Anna St, Wichita, KS 67209" },
  { id: 184, name: "UA Local 184", city: "Paducah", state: "KY", phone: "(270) 442-3213", website: "kypipetrades.com", lat: 37.0834, lng: -88.6, address: "1127 Broadway St, Paducah, KY 42001" },
  { id: 248, name: "UA Local 248", city: "Ashland", state: "KY", phone: "(606) 325-2544", website: "local248.com", lat: 38.4784, lng: -82.6379, address: "924 Greenup Ave, Ashland, KY 41101" },
  { id: 452, name: "UA Local 452", city: "Lexington", state: "KY", phone: "(859) 252-8337", website: "plumbersandpipefitters452.com", lat: 38.0406, lng: -84.5037, address: "701 Allenridge Point, Lexington, KY 40510" },
  { id: 502, name: "UA Local 502", city: "Louisville", state: "KY", phone: "(502) 361-8492", website: "lu502.com", lat: 38.2527, lng: -85.7585, address: "4330 Crittenden Dr Ste A, Louisville, KY 40209" },
  { id: 633, name: "UA Local 633", city: "Owensboro", state: "KY", phone: "(270) 683-1587", website: "ua.org", lat: 37.7719, lng: -87.1112, address: "3128 Alvey Park Dr W, Owensboro, KY 42303" },
  { id: 60, name: "UA Local 60", city: "Metairie", state: "LA", phone: "(504) 885-3054", website: "steamfitters-602.org", lat: 29.9511, lng: -90.0715, address: "3515 N I-10 Service Rd, Metairie, LA 70002" },
  { id: 141, name: "UA Local 141", city: "Shreveport", state: "LA", phone: "(318) 671-1175", website: "local141welfare.com", lat: 32.5252, lng: -93.7502, address: "7111 W Bert Kouns Industrial Loop, Shreveport, LA 71129" },
  { id: 198, name: "UA Local 198", city: "Baton Rouge", state: "LA", phone: "(225) 356-3333", website: "local198.org", lat: 30.4515, lng: -91.1871, address: "5888 Airline Hwy, Baton Rouge, LA 70805" },
  { id: 247, name: "UA Local 247", city: "Alexandria", state: "LA", phone: "(318) 442-9923", website: "ua.org", lat: 31.3113, lng: -92.4451, address: "249 McKeithen Dr, Alexandria, LA 71303" },
  { id: 716, name: "UA Local 716", city: "Augusta", state: "ME", phone: "(207) 621-0555", website: "local716.org", lat: 44.3106, lng: -69.7795, address: "21 Gabriel Dr, Augusta, ME 04330" },
  { id: 486, name: "UA Local 486", city: "Baltimore", state: "MD", phone: "(410) 866-4380", website: "ualocal486.com", lat: 39.2904, lng: -76.6122, address: "8100 Sandpiper Cr Ste 200, Baltimore, MD 21236" },
  { id: 669, name: "UA Local 669", city: "Columbia", state: "MD", phone: "(410) 381-4300", website: "sprinklerfitters669.org", lat: 39.2037, lng: -76.861, address: "7050 Oakland Mills Rd #200, Columbia, MD 21046" },
];

const SMART_LOCALS = [];
// ─── BAC LOCAL DATABASE — Bricklayers & Allied Craftworkers ──────────────────
// All data verified from bacweb.org official directory
const BAC_LOCALS = [
  { id: 20001, name: "BAC Local 3 (Northern CA)", city: "Oakland", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", lat: 37.8044, lng: -122.2712, address: "8201 Capwell Dr., Oakland, CA 94621", email: "troy@bac3-ca.org" },
  { id: 20002, name: "BAC Local 3 (Northern CA)", city: "Sacramento", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", lat: 38.5816, lng: -121.4944, address: "8201 Capwell Dr., Oakland, CA 94621", email: "troy@bac3-ca.org" },
  { id: 20003, name: "BAC Local 3 (Northern CA)", city: "San Francisco", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", lat: 37.7749, lng: -122.4194, address: "8201 Capwell Dr., Oakland, CA 94621", email: "troy@bac3-ca.org" },
  { id: 20004, name: "BAC Local 3 (Northern CA)", city: "Fresno", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", lat: 36.7378, lng: -119.7871, address: "8201 Capwell Dr., Oakland, CA 94621", email: "troy@bac3-ca.org" },
  { id: 20010, name: "BAC Local 4 (Southern CA)", city: "La Verne", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", lat: 34.1008, lng: -117.7678, address: "2679 Sierra Way, LaVerne, CA 91750", email: "bac4andy@gmail.com" },
  { id: 20011, name: "BAC Local 4 (Southern CA)", city: "Los Angeles", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", lat: 34.0522, lng: -118.2437, address: "2679 Sierra Way, LaVerne, CA 91750", email: "bac4andy@gmail.com" },
  { id: 20012, name: "BAC Local 4 (Southern CA)", city: "San Diego", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", lat: 32.7157, lng: -117.1611, address: "2679 Sierra Way, LaVerne, CA 91750", email: "bac4andy@gmail.com" },
  { id: 20013, name: "BAC Local 4 (Southern CA)", city: "Riverside", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", lat: 33.9806, lng: -117.3755, address: "2679 Sierra Way, LaVerne, CA 91750", email: "bac4andy@gmail.com" },
  { id: 20020, name: "BAC Local 1 (CT)", city: "Wallingford", state: "CT", phone: "(203) 697-0820", website: "baclocal1ct.com", lat: 41.457, lng: -72.823, address: "17 North Plains Industrial Rd, Wallingford, CT 06492", email: "gmarotti@baclocal1ct.com" },
  { id: 20021, name: "BAC Local 1 (CT)", city: "Hartford", state: "CT", phone: "(203) 697-0820", website: "baclocal1ct.com", lat: 41.7658, lng: -72.6851, address: "17 North Plains Industrial Rd, Wallingford, CT 06492", email: "gmarotti@baclocal1ct.com" },
  { id: 20022, name: "BAC Local 1 (CT)", city: "Bridgeport", state: "CT", phone: "(203) 697-0820", website: "baclocal1ct.com", lat: 41.1865, lng: -73.1952, address: "17 North Plains Industrial Rd, Wallingford, CT 06492", email: "gmarotti@baclocal1ct.com" },
  { id: 20030, name: "BAC Local 1 (MD/VA/DC)", city: "Laurel", state: "MD", phone: "(240) 695-9463", website: "baclocal1.org", lat: 39.0993, lng: -76.8483, address: "305 Compton Avenue, Laurel, MD 20707", email: "support@baclocal1.org" },
  { id: 20031, name: "BAC Local 1 (MD/VA/DC)", city: "Washington", state: "DC", phone: "(240) 695-9463", website: "baclocal1.org", lat: 38.9072, lng: -77.0369, address: "305 Compton Avenue, Laurel, MD 20707", email: "support@baclocal1.org" },
  { id: 20032, name: "BAC Local 1 (MD/VA/DC)", city: "Baltimore", state: "MD", phone: "(240) 695-9463", website: "baclocal1.org", lat: 39.2904, lng: -76.6122, address: "305 Compton Avenue, Laurel, MD 20707", email: "support@baclocal1.org" },
  { id: 20033, name: "BAC Local 1 (MD/VA/DC)", city: "Richmond", state: "VA", phone: "(240) 695-9463", website: "baclocal1.org", lat: 37.5407, lng: -77.436, address: "305 Compton Avenue, Laurel, MD 20707", email: "support@baclocal1.org" },
  { id: 20034, name: "BAC Local 1 (MD/VA/DC)", city: "Norfolk", state: "VA", phone: "(240) 695-9463", website: "baclocal1.org", lat: 36.8508, lng: -76.2859, address: "305 Compton Avenue, Laurel, MD 20707", email: "support@baclocal1.org" },
  { id: 20040, name: "BAC Local 1 (HI)", city: "Honolulu", state: "HI", phone: "(808) 841-8822", website: "hawaiimasonsunion.org", lat: 21.3069, lng: -157.8583, address: "2251 North School Street, Honolulu, HI 96819", email: "pcoronas@masonsunion.com" },
  { id: 20050, name: "BAC Local 3 (IA)", city: "Marshalltown", state: "IA", phone: "(515) 557-0551", website: "baclocal3ia.org", lat: 42.0494, lng: -92.9082, address: "601 S 12th Avenue, Marshalltown, IA 50158", email: "ray@bac3ia.us" },
  { id: 20051, name: "BAC Local 3 (IA)", city: "Des Moines", state: "IA", phone: "(515) 557-0551", website: "baclocal3ia.org", lat: 41.5868, lng: -93.625, address: "601 S 12th Avenue, Marshalltown, IA 50158", email: "ray@bac3ia.us" },
  { id: 20052, name: "BAC Local 3 (IA)", city: "Cedar Rapids", state: "IA", phone: "(515) 557-0551", website: "baclocal3ia.org", lat: 41.9779, lng: -91.6656, address: "601 S 12th Avenue, Marshalltown, IA 50158", email: "ray@bac3ia.us" },
  { id: 20060, name: "BAC Local 8 (IL)", city: "O'Fallon", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 38.5895, lng: -89.9112, address: "715 Lakepointe Centre Suite 127, O'Fallon, IL 62269", email: "mbraun@bac8il.com" },
  { id: 20061, name: "BAC Local 8 (IL)", city: "Springfield", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 39.7817, lng: -89.6501, address: "715 Lakepointe Centre Suite 127, O'Fallon, IL 62269", email: "mbraun@bac8il.com" },
  { id: 20062, name: "BAC Local 8 (IL)", city: "Peoria", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 40.6936, lng: -89.589, address: "715 Lakepointe Centre Suite 127, O'Fallon, IL 62269", email: "mbraun@bac8il.com" },
  { id: 20063, name: "BAC ADC 1 (IL)", city: "Elmhurst", state: "IL", phone: "(630) 941-2300", website: "bacadc1.org", lat: 41.8997, lng: -87.9401, address: "660 N Industrial Drive, Elmhurst, IL 60126", email: "mvolpentesta@bacadc1.org" },
  { id: 20064, name: "BAC ADC 1 (IL)", city: "Chicago", state: "IL", phone: "(630) 941-2300", website: "bacadc1.org", lat: 41.8781, lng: -87.6298, address: "660 N Industrial Drive, Elmhurst, IL 60126", email: "mvolpentesta@bacadc1.org" },
  { id: 20065, name: "BAC ADC 1 (IL)", city: "Rockford", state: "IL", phone: "(630) 941-2300", website: "bacadc1.org", lat: 42.2711, lng: -89.094, address: "660 N Industrial Drive, Elmhurst, IL 60126", email: "mvolpentesta@bacadc1.org" },
  { id: 20070, name: "BAC Local 4 (IN/KY)", city: "Indianapolis", state: "IN", phone: "(800) 322-2283", website: "baclocal4.org", lat: 39.7684, lng: -86.1581, address: "8455 Moller Road, Indianapolis, IN 46268", email: "steveknowles@baclocal4.org" },
  { id: 20071, name: "BAC Local 4 (IN/KY)", city: "Fort Wayne", state: "IN", phone: "(800) 322-2283", website: "baclocal4.org", lat: 41.0793, lng: -85.1394, address: "8455 Moller Road, Indianapolis, IN 46268", email: "steveknowles@baclocal4.org" },
  { id: 20072, name: "BAC Local 4 (IN/KY)", city: "Evansville", state: "IN", phone: "(800) 322-2283", website: "baclocal4.org", lat: 37.9716, lng: -87.5711, address: "8455 Moller Road, Indianapolis, IN 46268", email: "steveknowles@baclocal4.org" },
  { id: 20073, name: "BAC Local 4 (IN/KY)", city: "Louisville", state: "KY", phone: "(800) 322-2283", website: "baclocal4.org", lat: 38.2527, lng: -85.7585, address: "8455 Moller Road, Indianapolis, IN 46268", email: "steveknowles@baclocal4.org" },
  { id: 20074, name: "BAC Local 4 (IN/KY)", city: "Lexington", state: "KY", phone: "(800) 322-2283", website: "baclocal4.org", lat: 38.0406, lng: -84.5037, address: "8455 Moller Road, Indianapolis, IN 46268", email: "steveknowles@baclocal4.org" },
  { id: 20080, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Charlestown", state: "MA", phone: "(617) 242-5500", website: "local3bac.org", lat: 42.3772, lng: -71.0602, address: "550 Medford Street, Charlestown, MA 02129", email: "aantonuccio@local3bac.org" },
  { id: 20081, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Boston", state: "MA", phone: "(617) 242-5500", website: "local3bac.org", lat: 42.3601, lng: -71.0589, address: "550 Medford Street, Charlestown, MA 02129", email: "aantonuccio@local3bac.org" },
  { id: 20082, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Portland", state: "ME", phone: "(617) 242-5500", website: "local3bac.org", lat: 43.6591, lng: -70.2568, address: "550 Medford Street, Charlestown, MA 02129", email: "aantonuccio@local3bac.org" },
  { id: 20083, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Manchester", state: "NH", phone: "(617) 242-5500", website: "local3bac.org", lat: 42.9956, lng: -71.4548, address: "550 Medford Street, Charlestown, MA 02129", email: "aantonuccio@local3bac.org" },
  { id: 20084, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Providence", state: "RI", phone: "(617) 242-5500", website: "local3bac.org", lat: 41.824, lng: -71.4128, address: "550 Medford Street, Charlestown, MA 02129", email: "aantonuccio@local3bac.org" },
  { id: 20090, name: "BAC Local 2 (MI)", city: "Warren", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", lat: 42.5145, lng: -83.0146, address: "21031 Ryan Road, Warren, MI 48091", email: "brett.gierak@bricklayers.org" },
  { id: 20091, name: "BAC Local 2 (MI)", city: "Detroit", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", lat: 42.3314, lng: -83.0458, address: "21031 Ryan Road, Warren, MI 48091", email: "brett.gierak@bricklayers.org" },
  { id: 20092, name: "BAC Local 2 (MI)", city: "Grand Rapids", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", lat: 42.9634, lng: -85.6681, address: "21031 Ryan Road, Warren, MI 48091", email: "brett.gierak@bricklayers.org" },
  { id: 20093, name: "BAC Local 2 (MI)", city: "Flint", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", lat: 43.0125, lng: -83.6875, address: "21031 Ryan Road, Warren, MI 48091", email: "brett.gierak@bricklayers.org" },
  { id: 20100, name: "BAC Local 15 (MO/KS/NE)", city: "Kansas City", state: "MO", phone: "(816) 241-6695", website: "baclocal15.org", lat: 39.0997, lng: -94.5786, address: "632 W 39th Street, Kansas City, MO 64111", email: "dustinhimes@baclocal15.org" },
  { id: 20101, name: "BAC Local 15 (MO/KS/NE)", city: "St. Louis", state: "MO", phone: "(816) 241-6695", website: "baclocal15.org", lat: 38.627, lng: -90.1994, address: "632 W 39th Street, Kansas City, MO 64111", email: "dustinhimes@baclocal15.org" },
  { id: 20102, name: "BAC Local 15 (MO/KS/NE)", city: "Springfield", state: "MO", phone: "(816) 241-6695", website: "baclocal15.org", lat: 37.209, lng: -93.2923, address: "632 W 39th Street, Kansas City, MO 64111", email: "dustinhimes@baclocal15.org" },
  { id: 20103, name: "BAC Local 15 (MO/KS/NE)", city: "Wichita", state: "KS", phone: "(816) 241-6695", website: "baclocal15.org", lat: 37.6872, lng: -97.3301, address: "632 W 39th Street, Kansas City, MO 64111", email: "dustinhimes@baclocal15.org" },
  { id: 20104, name: "BAC Local 15 (MO/KS/NE)", city: "Topeka", state: "KS", phone: "(816) 241-6695", website: "baclocal15.org", lat: 39.0489, lng: -95.678, address: "632 W 39th Street, Kansas City, MO 64111", email: "dustinhimes@baclocal15.org" },
  { id: 20105, name: "BAC Local 15 (MO/KS/NE)", city: "Omaha", state: "NE", phone: "(816) 241-6695", website: "baclocal15.org", lat: 41.2565, lng: -95.9345, address: "632 W 39th Street, Kansas City, MO 64111", email: "dustinhimes@baclocal15.org" },
  { id: 20106, name: "BAC Local 15 (MO/KS/NE)", city: "Lincoln", state: "NE", phone: "(816) 241-6695", website: "baclocal15.org", lat: 40.8136, lng: -96.7026, address: "632 W 39th Street, Kansas City, MO 64111", email: "dustinhimes@baclocal15.org" },
  { id: 20107, name: "BAC ADC Eastern MO", city: "Fenton", state: "MO", phone: "(314) 621-5560", website: "bacstl.com", lat: 38.5117, lng: -90.4428, address: "1670 Fenpark Drive, Fenton, MO 63026", email: "brian.jennewein@gmail.com" },
  { id: 20110, name: "BAC ADC (NJ)", city: "Bordentown", state: "NJ", phone: "(609) 324-9681", website: "bacnj.com", lat: 40.1443, lng: -74.7107, address: "3281 Route 206 Suite 1, Bordentown, NJ 08505", email: "j.capo@bacnj.com" },
  { id: 20111, name: "BAC ADC (NJ)", city: "Newark", state: "NJ", phone: "(609) 324-9681", website: "bacnj.com", lat: 40.7357, lng: -74.1724, address: "3281 Route 206 Suite 1, Bordentown, NJ 08505", email: "j.capo@bacnj.com" },
  { id: 20112, name: "BAC ADC (NJ)", city: "Trenton", state: "NJ", phone: "(609) 324-9681", website: "bacnj.com", lat: 40.2171, lng: -74.7429, address: "3281 Route 206 Suite 1, Bordentown, NJ 08505", email: "j.capo@bacnj.com" },
  { id: 20120, name: "BAC Mountain West ADC (NV)", city: "Las Vegas", state: "NV", phone: "(702) 873-0332", website: "bacmwadc.org", lat: 36.1699, lng: -115.1398, address: "3900 W Quail Avenue, Las Vegas, NV 89118", email: "rcrawford@mwbac.org" },
  { id: 20121, name: "BAC Mountain West ADC (NV)", city: "Reno", state: "NV", phone: "(702) 873-0332", website: "bacmwadc.org", lat: 39.5296, lng: -119.8138, address: "3900 W Quail Avenue, Las Vegas, NV 89118", email: "rcrawford@mwbac.org" },
  { id: 20130, name: "BAC Local 1 (NY)", city: "Long Island City", state: "NY", phone: "(718) 392-0525", website: "bricklayersandalliedcraftworkerslocal1ny.org", lat: 40.7447, lng: -73.9485, address: "4 Court Square West, Long Island City, NY 11101", email: "info@bac1ny.com" },
  { id: 20131, name: "BAC Local 1 (NY)", city: "New York City", state: "NY", phone: "(718) 392-0525", website: "bricklayersandalliedcraftworkerslocal1ny.org", lat: 40.7128, lng: -74.0059, address: "4 Court Square West, Long Island City, NY 11101", email: "info@bac1ny.com" },
  { id: 20140, name: "BAC Local 2 (NY/VT)", city: "Albany", state: "NY", phone: "(518) 466-5885", website: "baclocal2nyvt.org", lat: 42.6526, lng: -73.7562, address: "302 Centre Drive, Albany, NY 12203", email: "ptirino@bac2.org" },
  { id: 20141, name: "BAC Local 2 (NY/VT)", city: "Burlington", state: "VT", phone: "(518) 466-5885", website: "baclocal2nyvt.org", lat: 44.4759, lng: -73.2121, address: "302 Centre Drive, Albany, NY 12203", email: "ptirino@bac2.org" },
  { id: 20142, name: "BAC Local 2 (NY/VT)", city: "Syracuse", state: "NY", phone: "(518) 466-5885", website: "baclocal2nyvt.org", lat: 43.0481, lng: -76.1474, address: "302 Centre Drive, Albany, NY 12203", email: "ptirino@bac2.org" },
  { id: 20150, name: "BAC Local 3 (NY)", city: "Rochester", state: "NY", phone: "(716) 604-2334", website: "bac3ny.com", lat: 43.1566, lng: -77.6088, address: "33 Saginaw Drive, Rochester, NY 14623", email: "rickw@bac3ny.com" },
  { id: 20151, name: "BAC Local 3 (NY)", city: "Buffalo", state: "NY", phone: "(716) 604-2334", website: "bac3ny.com", lat: 42.8864, lng: -78.8784, address: "33 Saginaw Drive, Rochester, NY 14623", email: "rickw@bac3ny.com" },
  { id: 20160, name: "BAC Local 7 (NY/NJ)", city: "Long Island City", state: "NY", phone: "(917) 734-8390", website: "baclocal7.org", lat: 40.7447, lng: -73.9485, address: "45-34 Court Square, Long Island City, NY 11101", email: "whill@baclocal7.com" },
  { id: 20170, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Amherst", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", lat: 41.4009, lng: -82.2235, address: "8497 Leavitt Road, Amherst, OH 44001", email: "dmusacchio@bac23-ohwvky.net" },
  { id: 20171, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Cleveland", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", lat: 41.4993, lng: -81.6944, address: "8497 Leavitt Road, Amherst, OH 44001", email: "dmusacchio@bac23-ohwvky.net" },
  { id: 20172, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Columbus", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", lat: 39.9612, lng: -82.9988, address: "8497 Leavitt Road, Amherst, OH 44001", email: "dmusacchio@bac23-ohwvky.net" },
  { id: 20173, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Cincinnati", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", lat: 39.1031, lng: -84.512, address: "8497 Leavitt Road, Amherst, OH 44001", email: "dmusacchio@bac23-ohwvky.net" },
  { id: 20174, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Charleston", state: "WV", phone: "(440) 986-3000", website: "23bricks.org", lat: 38.3498, lng: -81.6326, address: "8497 Leavitt Road, Amherst, OH 44001", email: "dmusacchio@bac23-ohwvky.net" },
  { id: 20175, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Lexington", state: "KY", phone: "(440) 986-3000", website: "23bricks.org", lat: 38.0406, lng: -84.5037, address: "8497 Leavitt Road, Amherst, OH 44001", email: "dmusacchio@bac23-ohwvky.net" },
  { id: 20176, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Baltimore", state: "MD", phone: "(440) 986-3000", website: "23bricks.org", lat: 39.2904, lng: -76.6122, address: "8497 Leavitt Road, Amherst, OH 44001", email: "dmusacchio@bac23-ohwvky.net" },
  { id: 20180, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Oklahoma City", state: "OK", phone: "(405) 528-5609", website: "baclocal5.com", lat: 35.4676, lng: -97.5164, address: "212 NE 27th Street, Oklahoma City, OK 73105", email: "tmcintyre@bacweb.org" },
  { id: 20181, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Tulsa", state: "OK", phone: "(405) 528-5609", website: "baclocal5.com", lat: 36.154, lng: -95.9928, address: "212 NE 27th Street, Oklahoma City, OK 73105", email: "tmcintyre@bacweb.org" },
  { id: 20182, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Little Rock", state: "AR", phone: "(405) 528-5609", website: "baclocal5.com", lat: 34.7465, lng: -92.2896, address: "212 NE 27th Street, Oklahoma City, OK 73105", email: "tmcintyre@bacweb.org" },
  { id: 20183, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Dallas", state: "TX", phone: "(405) 528-5609", website: "baclocal5.com", lat: 32.7767, lng: -96.797, address: "212 NE 27th Street, Oklahoma City, OK 73105", email: "tmcintyre@bacweb.org" },
  { id: 20184, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Houston", state: "TX", phone: "(405) 528-5609", website: "baclocal5.com", lat: 29.7604, lng: -95.3698, address: "212 NE 27th Street, Oklahoma City, OK 73105", email: "tmcintyre@bacweb.org" },
  { id: 20185, name: "BAC Local 5 (OK/AR/TX/NM)", city: "San Antonio", state: "TX", phone: "(405) 528-5609", website: "baclocal5.com", lat: 29.4241, lng: -98.4936, address: "212 NE 27th Street, Oklahoma City, OK 73105", email: "tmcintyre@bacweb.org" },
  { id: 20186, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Albuquerque", state: "NM", phone: "(405) 528-5609", website: "baclocal5.com", lat: 35.0844, lng: -106.6504, address: "212 NE 27th Street, Oklahoma City, OK 73105", email: "tmcintyre@bacweb.org" },
  { id: 20190, name: "BAC Local 1 (PA/DE)", city: "Philadelphia", state: "PA", phone: "(215) 856-9505", website: "bac1pa-de.org", lat: 40.0719, lng: -74.9942, address: "2706 Black Lake Place, Philadelphia, PA 19154" },
  { id: 20191, name: "BAC Local 1 (PA/DE)", city: "Wilmington", state: "DE", phone: "(215) 856-9505", website: "bac1pa-de.org", lat: 39.7447, lng: -75.5484, address: "2706 Black Lake Place, Philadelphia, PA 19154" },
  { id: 20200, name: "BAC Local 5 (PA)", city: "Harrisburg", state: "PA", phone: "(717) 564-5555", website: "baclocal5pa.org", lat: 40.2732, lng: -76.8867, address: "733 Firehouse Lane, Harrisburg, PA 17111", email: "toms@bac5pa.com" },
  { id: 20201, name: "BAC Local 5 (PA)", city: "Allentown", state: "PA", phone: "(717) 564-5555", website: "baclocal5pa.org", lat: 40.6084, lng: -75.4902, address: "733 Firehouse Lane, Harrisburg, PA 17111", email: "toms@bac5pa.com" },
  { id: 20210, name: "BAC Local 9 (PA)", city: "Pittsburgh", state: "PA", phone: "(412) 860-8390", website: "local9pa.com", lat: 40.4406, lng: -79.9959, address: "100 Kingston Drive, Pittsburgh, PA 15235", email: "Normringer@baclocal9.com" },
  { id: 20220, name: "BAC Local 8 (Southeast)", city: "Atlanta", state: "GA", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 33.749, lng: -84.388, address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", email: "rbaker@bacsoutheast.org" },
  { id: 20221, name: "BAC Local 8 (Southeast)", city: "Charlotte", state: "NC", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 35.2271, lng: -80.8431, address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", email: "rbaker@bacsoutheast.org" },
  { id: 20222, name: "BAC Local 8 (Southeast)", city: "Birmingham", state: "AL", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 33.5186, lng: -86.8104, address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", email: "rbaker@bacsoutheast.org" },
  { id: 20223, name: "BAC Local 8 (Southeast)", city: "Jacksonville", state: "FL", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 30.3322, lng: -81.6557, address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", email: "rbaker@bacsoutheast.org" },
  { id: 20224, name: "BAC Local 8 (Southeast)", city: "Columbia", state: "SC", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 34.0007, lng: -81.0348, address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", email: "rbaker@bacsoutheast.org" },
  { id: 20225, name: "BAC Local 8 (Southeast)", city: "Nashville", state: "TN", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 36.1627, lng: -86.7816, address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", email: "rbaker@bacsoutheast.org" },
  { id: 20226, name: "BAC Local 8 (Southeast)", city: "Memphis", state: "TN", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 35.1495, lng: -90.049, address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", email: "rbaker@bacsoutheast.org" },
  { id: 20230, name: "BAC Local 1 (WA/AK)", city: "Tukwila", state: "WA", phone: "(206) 248-2456", website: "bac1wa-ak.org", lat: 47.4709, lng: -122.2621, address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", email: "lglodowski@bacnorthwest.org" },
  { id: 20231, name: "BAC Local 1 (WA/AK)", city: "Seattle", state: "WA", phone: "(206) 248-2456", website: "bac1wa-ak.org", lat: 47.6062, lng: -122.3321, address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", email: "lglodowski@bacnorthwest.org" },
  { id: 20232, name: "BAC Local 1 (WA/AK)", city: "Spokane", state: "WA", phone: "(206) 248-2456", website: "bac1wa-ak.org", lat: 47.6587, lng: -117.426, address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", email: "lglodowski@bacnorthwest.org" },
  { id: 20233, name: "BAC Local 1 (WA/AK)", city: "Anchorage", state: "AK", phone: "(206) 248-2456", website: "bac1wa-ak.org", lat: 61.2181, lng: -149.9003, address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", email: "lglodowski@bacnorthwest.org" },
  { id: 20240, name: "BAC Wisconsin DC", city: "New Berlin", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", lat: 42.9758, lng: -88.111, address: "PO Box 510617, New Berlin, WI 53151", email: "jvick@bacwi.org" },
  { id: 20241, name: "BAC Wisconsin DC", city: "Milwaukee", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", lat: 43.0389, lng: -87.9065, address: "PO Box 510617, New Berlin, WI 53151", email: "jvick@bacwi.org" },
  { id: 20242, name: "BAC Wisconsin DC", city: "Madison", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", lat: 43.0731, lng: -89.4012, address: "PO Box 510617, New Berlin, WI 53151", email: "jvick@bacwi.org" },
  { id: 20243, name: "BAC Wisconsin DC", city: "Green Bay", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", lat: 44.5133, lng: -88.0133, address: "PO Box 510617, New Berlin, WI 53151", email: "jvick@bacwi.org" },
  { id: 20250, name: "BAC Local 1 (MN/ND/SD)", city: "Minneapolis", state: "MN", phone: "(612) 845-3136", website: "bac1mn-nd.org", lat: 44.9778, lng: -93.265, address: "312 Central Avenue Room 328, Minneapolis, MN 55414", email: "dschroeder@bac1mn-nd.org" },
  { id: 20251, name: "BAC Local 1 (MN/ND/SD)", city: "St. Paul", state: "MN", phone: "(612) 845-3136", website: "bac1mn-nd.org", lat: 44.9537, lng: -93.09, address: "312 Central Avenue Room 328, Minneapolis, MN 55414", email: "dschroeder@bac1mn-nd.org" },
  { id: 20252, name: "BAC Local 1 (MN/ND/SD)", city: "Fargo", state: "ND", phone: "(612) 845-3136", website: "bac1mn-nd.org", lat: 46.8772, lng: -96.7898, address: "312 Central Avenue Room 328, Minneapolis, MN 55414", email: "dschroeder@bac1mn-nd.org" },
  { id: 20253, name: "BAC Local 1 (MN/ND/SD)", city: "Sioux Falls", state: "SD", phone: "(612) 845-3136", website: "bac1mn-nd.org", lat: 43.5446, lng: -96.7311, address: "312 Central Avenue Room 328, Minneapolis, MN 55414", email: "dschroeder@bac1mn-nd.org" },
  { id: 20254, name: "BAC Local 1 (MN/ND/SD)", city: "Grand Forks", state: "ND", phone: "(612) 845-3136", website: "bac1mn-nd.org", lat: 47.9253, lng: -97.0329, address: "312 Central Avenue Room 328, Minneapolis, MN 55414", email: "dschroeder@bac1mn-nd.org" },
  { id: 20260, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Portland", state: "OR", phone: "(503) 232-0358", website: "bac1or.org", lat: 45.5231, lng: -122.6765, address: "12812 NE Marx Street, Portland, OR 97230", email: "office@bac1or.org" },
  { id: 20261, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Eugene", state: "OR", phone: "(503) 232-0358", website: "bac1or.org", lat: 44.0521, lng: -123.0868, address: "12812 NE Marx Street, Portland, OR 97230", email: "office@bac1or.org" },
  { id: 20262, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Boise", state: "ID", phone: "(503) 232-0358", website: "bac1or.org", lat: 43.615, lng: -116.2023, address: "12812 NE Marx Street, Portland, OR 97230", email: "office@bac1or.org" },
  { id: 20263, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Billings", state: "MT", phone: "(503) 232-0358", website: "bac1or.org", lat: 45.7833, lng: -108.5007, address: "12812 NE Marx Street, Portland, OR 97230", email: "office@bac1or.org" },
  { id: 20300, name: "BAC Local 1 (Alberta)", city: "Edmonton", state: "AB", phone: "(780) 426-7545", website: "bacedmonton.ca", lat: 53.5461, lng: -113.4938, address: "11330 143 Street, Edmonton, AB T5M 1V5", email: "kcoghill@bacalberta.ca" },
  { id: 20301, name: "BAC Local 2 (BC)", city: "Surrey", state: "BC", phone: "(604) 584-2021", website: "bac2bc.org", lat: 49.1913, lng: -122.849, address: "12309 Industrial Road, Surrey, BC V3V 3S4", email: "info@bac2bc.org" },
  { id: 20302, name: "BAC Local 7 (Ontario)", city: "Ottawa", state: "ON", phone: "(613) 739-5944", website: "local7.ca", lat: 45.4215, lng: -75.6972, address: "1427 Michael St, Ottawa, ON K1B 3R3", email: "info@local7.ca" },
  { id: 20303, name: "BAC Local 1 (Manitoba)", city: "Winnipeg", state: "MB", phone: "(204) 297-6074", website: null, lat: 49.8951, lng: -97.1384, address: "Unit 4, 225 McPhillips Street, Winnipeg, MB R3E 2K3", email: "evancollingridge@outlook.com" },
  { id: 20304, name: "BAC Local 8 (New Brunswick)", city: "Saint John", state: "NB", phone: "(506) 635-1505", website: "bac8nb.ca", lat: 45.2733, lng: -66.0633, address: "1216 Sand Cove Road, Saint John, NB E2M 5V8", email: "apttc@nb.aibn.com" },
  { id: 20305, name: "BAC Local 1 (Newfoundland)", city: "Conception Bay South", state: "NL", phone: "(709) 625-7322", website: "baclocal1nl.com", lat: 47.5234, lng: -52.9968, address: "631 Conception Bay Highway, Conception Bay South, NL A1X 7L4", email: "jleonard@baclocal1nl.com" },
  { id: 20306, name: "BAC Local 1 (Nova Scotia)", city: "Halifax", state: "NS", phone: "(902) 450-5614", website: null, lat: 44.6488, lng: -63.5752, address: "14 McQuade Lake Crescent Suite 203, Halifax, NS B3S 1B6", email: "reception@baclocal1.ca" },
  { id: 20307, name: "BAC Local 4 (Quebec)", city: "Saint-Leonard", state: "QC", phone: "(418) 929-4343", website: null, lat: 45.595, lng: -73.5771, address: "6879 rue Jarry est, Saint-Leonard, QC H1P 1W7", email: "mlacroix@interlocal4.org" },
  { id: 20308, name: "BAC Local 1 (Saskatchewan)", city: "Regina", state: "SK", phone: "(306) 359-6356", website: "bac1sk.ca", lat: 50.4452, lng: -104.6189, address: "PO Box 3885, Regina, SK S4P 3R8", email: "derek@bac1sk.ca" },
  { id: 20309, name: "BAC Local 6 (Ontario)", city: "Windsor", state: "ON", phone: "(519) 256-3070", website: null, lat: 42.3149, lng: -83.0364, address: "3454 Sandwich Street, Windsor, ON N9C 1B3", email: "jtr.local6@bellnet.ca" },
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
  "986":["WA",47.61,-122.33],"988":["WA",47.66,-117.43],"989":["WA",46.21,-119.14],
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
  const [selectedTrade, setSelectedTrade] = useState("IBEW_I");
  // URL-aware page state
  const getPageFromUrl = () => {
    const path = window.location.pathname.replace('/', '') || 'home';
    const validPages = ['home','quiz','careers','checklist','veterans','history','retirement','health','benefits','contact'];
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

  useEffect(() => {
    const PAGE_META = {
      home:      { title: "Union Pathways — Find Your Nearest Union Construction Local", desc: "Find your nearest union construction local — IBEW, UA, SMART, BAC, UBC, Ironworkers, Insulators, Laborers and more. Free resource for tradespeople." },
      quiz:      { title: "Union Pathways — Which Trade Is Right For You?", desc: "Take our free quiz to find out which union construction trade matches your skills, interests, and goals." },
      careers:   { title: "Union Pathways — Career Paths in the Union Trades", desc: "Learn about apprenticeships, wages, and career paths in union construction trades. Earn while you learn — no college debt." },
      checklist: { title: "Union Pathways — How to Join a Union", desc: "Step-by-step guide to joining a union construction apprenticeship. Requirements, timeline, and how to apply." },
      history:   { title: "Union Pathways — Union History in America", desc: "The 40-hour work week, the weekend, workplace safety — every benefit workers have today was fought for by unions. Learn the history." },
      veterans:  { title: "Union Pathways — Veterans and the Union Trades", desc: "Military veterans are a perfect fit for union construction apprenticeships. Learn about Helmets to Hardhats and other veteran programs." },
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

    const ALL = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...SMART_LOCALS, ...BAC_LOCALS, ...UBC_LOCALS, ...HFIAW_LOCALS, ...LIUNA_LOCALS];

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
    const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IW" ? IW_LOCALS : selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
    const withDist = database
      .map(l => ({ ...l, distance: getDistanceMiles(loc.lat, loc.lng, l.lat, l.lng) }))
      .sort((a, b) => a.distance - b.distance);
    const within150 = withDist.filter(l => l.distance <= 50);
    setResults(within150.length > 0 ? within150 : withDist.slice(0, 5));
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
        const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IW" ? IW_LOCALS : selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
        const withDist = database
          .map(l => ({ ...l, distance: getDistanceMiles(lat, lng, l.lat, l.lng) }))
          .sort((a, b) => a.distance - b.distance);
        const within150 = withDist.filter(l => l.distance <= 50);
        setResults(within150.length > 0 ? within150 : withDist.slice(0, 5));
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
          overflow-x: auto;
          padding-bottom: 2px;
          margin-bottom: 20px;
          scrollbar-width: none;
          -ms-overflow-style: none;
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
            <button className={`nav-link ${page==="quiz"?"active":""}`} onClick={() => { setPage("quiz"); resetQuiz(); }}>{t.navQuiz}</button>

            {/* GET STARTED DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={`nav-dropdown-btn${(page==="careers"||page==="checklist")?" active":""}${getStartedOpen?" open":""}`}
                onClick={() => setGetStartedOpen(o => !o)}
                onBlur={() => setTimeout(() => setGetStartedOpen(false), 150)}
              >
                {lang==="es" ? "Empezar" : lang==="pl" ? "Zacznij" : "Get Started"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {getStartedOpen && (
                <div className="nav-dropdown-menu">
                  <div
                    className={`nav-dropdown-item${page==="careers"?" active":""}`}
                    onMouseDown={() => { setPage("careers"); setGetStartedOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{t.navCareers}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Salarios, etapas y beneficios" : lang==="pl" ? "Wynagrodzenia, etapy i świadczenia" : "Wages, stages & benefits"}</span>
                  </div>
                  <div
                    className={`nav-dropdown-item${page==="checklist"?" active":""}`}
                    onMouseDown={() => { setPage("checklist"); setGetStartedOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{t.navChecklist}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Requisitos y cómo aplicar" : lang==="pl" ? "Wymagania i jak aplikować" : "Requirements & how to apply"}</span>
                  </div>
                </div>
              )}
            </div>

            <button className={`nav-link ${page==="history"?"active":""}`} onClick={() => setPage("history")}>{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</button>

            {/* UNION BENEFITS DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={`nav-dropdown-btn${(page==="benefits"||page==="retirement"||page==="health")?" active":""}${benefitsOpen?" open":""}`}
                onClick={() => setBenefitsOpen(o => !o)}
                onBlur={() => setTimeout(() => setBenefitsOpen(false), 150)}
              >
                {lang==="es" ? "Beneficios" : lang==="pl" ? "Świadczenia" : "Union Benefits"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {benefitsOpen && (
                <div className="nav-dropdown-menu">
                  <div
                    className={`nav-dropdown-item${page==="benefits"?" active":""}`}
                    onMouseDown={() => { setPage("benefits"); setBenefitsOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{lang==="es" ? "Descripción General" : lang==="pl" ? "Przegląd" : "Overview"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Por qué los sindicatos ganan" : lang==="pl" ? "Dlaczego związki wygrywają" : "Why union benefits win"}</span>
                  </div>
                  <div
                    className={`nav-dropdown-item${page==="retirement"?" active":""}`}
                    onMouseDown={() => { setPage("retirement"); setBenefitsOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{lang==="es" ? "Jubilación" : lang==="pl" ? "Emerytura" : "Retirement"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "401k vs Anualidad vs Pensión" : lang==="pl" ? "401k vs Renta vs Emerytura" : "401k vs Annuity vs Pension"}</span>
                  </div>
                  <div
                    className={`nav-dropdown-item${page==="health"?" active":""}`}
                    onMouseDown={() => { setPage("health"); setBenefitsOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Pagado por el contratista" : lang==="pl" ? "Płacone przez wykonawcę" : "Paid by your contractor"}</span>
                  </div>
                </div>
              )}
            </div>
            <button className={`nav-link ${page==="veterans"?"active":""}`} onClick={() => setPage("veterans")}>{t.navVets}</button>
            <button className={`nav-link ${page==="contact"?"active":""}`} onClick={() => { setPage("contact"); setContactSent(false); }}>{t.navContact}</button>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
            <button className={`lang-btn ${lang==="en"?"active":""}`} onClick={() => setLang("en")}>EN</button>
            <button className={`lang-btn ${lang==="es"?"active":""}`} onClick={() => setLang("es")}>ES</button>
            <button className={`lang-btn ${lang==="pl"?"active":""}`} onClick={() => setLang("pl")}>PL</button>
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

            {/* QUICK NAV PILLS */}
            <div style={{display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center", margin:"28px 0 8px"}}>
              {[
                { label: lang==="es" ? "Encuentra tu Local" : lang==="pl" ? "Znajdź Oddział" : "Find a Local", page: "home", anchor: true },
                { label: lang==="es" ? "¿Qué Oficio?" : lang==="pl" ? "Który Zawód?" : "Which Trade?", page: "quiz" },
                { label: lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Ścieżki Kariery" : "Career Paths", page: "careers" },
                { label: lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Swiadczenia" : "Union Benefits", page: "benefits" },
                { label: lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia" : "Union History", page: "history" },
                { label: lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans", page: "veterans" },
              ].map((item, i) => (
                <button key={i} onClick={() => setPage(item.page)} style={{
                  background: i === 0 ? "rgba(250,128,89,0.15)" : "rgba(255,255,255,0.04)",
                  border: i === 0 ? "1px solid rgba(250,128,89,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50px", padding: "8px 18px",
                  color: i === 0 ? "#FA8059" : "var(--muted)",
                  fontSize: "13px", fontWeight: "600",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  {item.label}
                </button>
              ))}
            </div>

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
                {selectedTrade === "UA" ? t.uaLabel : selectedTrade === "SMART" ? t.smartLabel : selectedTrade === "BAC" ? t.bacLabel : selectedTrade === "UBC" ? t.ubcLabel : selectedTrade === "LIUNA" ? t.liunaLabel : selectedTrade === "IW" ? t.iwLabel : selectedTrade === "IBEW_L" ? t.ibewLinLabel : selectedTrade === "IUEC" ? t.iuecLabel : selectedTrade === "HFIAW" ? t.hfiawLabel : selectedTrade === "SF" ? t.sfLabel : t.ibewLabel}
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
          <div className="page" style={{maxWidth: 780}}>
            <div className="page-eyebrow">{lang==="es" ? "Cómo Empezar" : lang==="pl" ? "Jak Zacząć" : "Getting Started"}</div>
            <h1 className="page-title">{lang==="es" ? "Cómo Unirse a un Oficio Sindical" : lang==="pl" ? "Jak Dołączyć do Zawodowego Związku" : "How to Join a Union Trade"}</h1>
            <p className="page-sub">
              {lang==="es"
                ? "Todo lo que necesitas saber antes de aplicar — qué se requiere, qué ayuda y cómo funciona el proceso."
                : lang==="pl"
                ? "Wszystko, co musisz wiedzieć przed złożeniem wniosku — czego wymaga się od Ciebie, co pomaga i jak działa ten proces."
                : "Everything you need to know before you apply — what's required, what helps, and how the process works."}
            </p>

            <div className="checklist-intro">
              {lang==="es" ? (
                <><strong>Lo esencial:</strong> Los aprendizajes sindicales son competitivos pero abiertos a cualquier persona que califique. No hay tarifa para aplicar, no se requiere universidad, y ganas un sueldo desde el primer día.</>
              ) : lang==="pl" ? (
                <><strong>Najważniejsze:</strong> Programy praktyk związkowych są konkurencyjne, ale otwarte dla każdego, kto spełnia wymagania. Nie ma opłaty za złożenie wniosku, nie jest wymagane wykształcenie wyższe, a wynagrodzenie zarabiasz od pierwszego dnia.</>
              ) : (
                <><strong>The bottom line:</strong> Union apprenticeships are competitive but open to anyone who qualifies. There's no fee to apply, no college required, and you earn a paycheck from day one. Most locals hold open enrollment periods — typically spring and fall — but some accept applications year-round.</>
              )}
            </div>

            {/* Legend */}
            <div className="checklist-legend">
              <div className="legend-item"><div className="legend-dot" style={{background:"var(--yellow)"}} />{lang==="es"?"Requerido — necesario para aplicar":lang==="pl"?"Wymagane — konieczne do aplikacji":"Required — must have to apply"}</div>
              <div className="legend-item"><div className="legend-dot" style={{background:"#4a9eff"}} />{lang==="es"?"A menudo requerido — varía por local":lang==="pl"?"Często Wymagane — zależy od oddziału":"Often Required — varies by local"}</div>
              <div className="legend-item"><div className="legend-dot" style={{background:"#22c55e"}} />{lang==="es"?"Útil — mejora tus posibilidades":lang==="pl"?"Pomocne — zwiększa Twoje szanse":"Helpful — improves your chances"}</div>
            </div>

            {/* Section 1 — Basic Requirements */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Requisitos Básicos":lang==="pl"?"Podstawowe Wymagania":"Basic Requirements"}</div>
              <div className="checklist-items">
                <div className="checklist-item required">
                  <div className="checklist-icon">🎂</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"18 Años de Edad":lang==="pl"?"18 Lat":"18 Years Old"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Debes tener al menos 18 años para ingresar a un programa de aprendizaje registrado.":lang==="pl"?"Musisz mieć co najmniej 18 lat, aby przystąpić do zarejestrowanego programu praktyk. Niektóre zawody przyjmują 17-latków za zgodą rodzica, ale 18 lat to standard.":"You must be at least 18 to enter a registered apprenticeship program. Some trades accept 17 with a parent or guardian signature in certain states, but 18 is the standard."}</div>
                  </div>
                </div>
                <div className="checklist-item required">
                  <div className="checklist-icon">📄</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Diploma de Escuela Secundaria o GED":lang==="pl"?"Dyplom Ukończenia Szkoły Średniej lub GED":"High School Diploma or GED"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Los cuatro oficios requieren un diploma de escuela secundaria o GED.":lang==="pl"?"Wszystkie zawody wymagają dyplomu szkoły średniej lub GED. Jeśli jeszcze go nie masz, zdobycie GED to Twój pierwszy krok.":"All four trades require proof of a high school diploma or GED. If you don't have one yet, getting your GED is your first step. Community colleges offer GED prep programs, many for free."}</div>
                  </div>
                </div>
                <div className="checklist-item required">
                  <div className="checklist-icon">🇺🇸</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Derecho Legal a Trabajar en EE.UU.":lang==="pl"?"Prawo do Pracy w USA":"Legal Right to Work in the US"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Debes estar legalmente autorizado para trabajar en los Estados Unidos.":lang==="pl"?"Musisz być prawnie upoważniony do pracy w Stanach Zjednoczonych. Dotyczy to obywateli USA, stałych rezydentów i posiadaczy ważnych zezwoleń na pracę.":"You must be legally authorized to work in the United States. This includes US citizens, permanent residents, and holders of valid work authorization."}</div>
                  </div>
                </div>
                <div className="checklist-item optional">
                  <div className="checklist-icon">🧪</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Pasar una Prueba de Drogas":lang==="pl"?"Zdać Test Narkotykowy":"Pass a Drug Test"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"La mayoría de los locales requieren una prueba de drogas antes del empleo.":lang==="pl"?"Większość oddziałów wymaga testu narkotykowego przed zatrudnieniem. Place budowy to środowiska krytyczne dla bezpieczeństwa.":"Most locals require a pre-employment drug test. Construction sites are safety-critical environments. Know your local's policy before you apply."}</div>
                  </div>
                </div>
                <div className="checklist-item optional">
                  <div className="checklist-icon">🚗</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Licencia de Conducir Válida":lang==="pl"?"Ważne Prawo Jazdy":"Valid Driver's License"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Muchos locales requieren una licencia de conducir válida.":lang==="pl"?"Wiele oddziałów wymaga ważnego prawa jazdy, ponieważ place budowy mogą być poza trasami komunikacji miejskiej.":"Many locals require a valid driver's license since job sites may not be on public transit routes. Having reliable transportation is essential."}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 — Tests & Aptitude */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Pruebas y Aptitud":lang==="pl"?"Testy i Predyspozycje":"Tests & Aptitude"}</div>
              <div className="checklist-items">
                <div className="checklist-item required">
                  <div className="checklist-icon">➕</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Prueba de Aptitud Matemática":lang==="pl"?"Test Uzdolnień Matematycznych":"Math Aptitude Test"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Todos los oficios requieren una prueba básica de aptitud matemática que cubre álgebra, fracciones y matemáticas aplicadas.":lang==="pl"?"Wszystkie zawody wymagają podstawowego testu uzdolnień matematycznych obejmującego algebrę, ułamki i matematykę stosowaną. Przygotuj się wcześniej — Khan Academy oferuje darmowe kursy algebry.":"All trades require a basic math aptitude test covering algebra, fractions, and applied math. The IBEW/NECA test is well-known, but UA, SMART, and BAC have their own versions. Study ahead — Khan Academy has free algebra courses that cover everything you need."}</div>
                  </div>
                </div>
                <div className="checklist-item optional">
                  <div className="checklist-icon">📐</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Comprensión de Lectura":lang==="pl"?"Rozumienie Tekstu":"Reading Comprehension"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Algunos locales también evalúan la comprensión lectora y el razonamiento mecánico.":lang==="pl"?"Niektóre oddziały testują również rozumienie tekstu i rozumowanie mechaniczne. Umiejętność czytania i interpretowania instrukcji technicznych jest kluczowa.":"Some locals also test reading comprehension and mechanical reasoning. Being able to read and interpret technical instructions is key to the job."}</div>
                  </div>
                </div>
                <div className="checklist-item helpful">
                  <div className="checklist-icon">📚</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Estudia Antes de la Prueba":lang==="pl"?"Ucz się Przed Testem":"Study Before You Test"} <span className="checklist-tag tag-helpful">{lang==="es"?"Útil":lang==="pl"?"Pomocne":"Helpful"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"El puntaje de la prueba de matemáticas afecta mucho tu posición en la lista de espera. Hay guías de estudio gratuitas disponibles en línea.":lang==="pl"?"Wynik testu matematycznego ma duży wpływ na Twoje miejsce na liście oczekujących na praktykę. Wyższy wynik = szybsze przyjęcie.":"The math test scores heavily impact your ranking on the apprenticeship waiting list. A higher score = faster entry. Free study guides are available online — search for \"NJATC aptitude test study guide\" for IBEW or the specific trade you're targeting."}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 — Physical */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Requisitos Físicos":lang==="pl"?"Wymagania Fizyczne":"Physical Requirements"}</div>
              <div className="checklist-items">
                <div className="checklist-item optional">
                  <div className="checklist-icon">💪</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Condición Física":lang==="pl"?"Sprawność Fizyczna":"Physical Fitness"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Los oficios de construcción son físicamente exigentes. La mayoría de los locales requieren un examen físico.":lang==="pl"?"Zawody budowlane są wymagające fizycznie. Większość oddziałów wymaga badania lekarskiego potwierdzającego zdolność do pracy — dźwigania, wspinaczki, pracy w ciasnych przestrzeniach.":"Construction trades are physically demanding. Most locals require a physical exam or medical clearance confirming you can perform the duties of the trade — lifting, climbing, working in confined spaces, and extended time on your feet."}</div>
                  </div>
                </div>
                <div className="checklist-item helpful">
                  <div className="checklist-icon">🦺</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Tarjeta OSHA 10 (Recomendada)":lang==="pl"?"Karta OSHA 10 (Zalecana)":"OSHA 10 Card (Recommended)"} <span className="checklist-tag tag-helpful">{lang==="es"?"Útil":lang==="pl"?"Pomocne":"Helpful"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Tener una certificación OSHA 10 antes de aplicar muestra iniciativa. Es un curso de 10 horas disponible en línea.":lang==="pl"?"Posiadanie certyfikatu OSHA 10 przed złożeniem wniosku świadczy o inicjatywie i świadomości bezpieczeństwa. To 10-godzinny kurs dostępny online za około 30 dolarów.":"Having an OSHA 10 certification before you apply shows initiative and safety awareness. It's a 10-hour course available online for around $30. Some locals offer it free after you're accepted."}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 — Documents */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Documentos que Necesitas":lang==="pl"?"Dokumenty do Przyniesienia":"Documents to Bring"}</div>
              <div className="checklist-items">
                {[
                  { icon:"📋", label: lang==="es"?"Solicitud Completada":lang==="pl"?"Wypełniony Wniosek":"Completed Application", desc: lang==="es"?"Descarga del sitio web de tu local o recógela en persona.":lang==="pl"?"Pobierz ze strony swojego oddziału lub odbierz osobiście. Wypełnij go w całości — niekompletne wnioski są zazwyczaj odrzucane.":"Download from your local's website or pick up in person. Fill it out completely — incomplete applications are typically rejected." },
                  { icon:"🪪", label: lang==="es"?"Identificación con Foto del Gobierno":lang==="pl"?"Dowód Tożsamości ze Zdjęciem":"Government-Issued Photo ID", desc: lang==="es"?"Licencia de conducir, ID estatal o pasaporte.":lang==="pl"?"Prawo jazdy, dowód osobisty lub paszport.":"Driver's license, state ID, or passport." },
                  { icon:"📜", label: lang==="es"?"Comprobante de Educación":lang==="pl"?"Potwierdzenie Wykształcenia":"Proof of Education", desc: lang==="es"?"Expediente académico oficial de secundaria o certificado GED.":lang==="pl"?"Oficjalny transkrypt ze szkoły średniej lub certyfikat GED. Wiele oddziałów nie akceptuje samego dyplomu — potrzebują transkryptów.":"Official high school transcript or GED certificate. Many locals won't accept a diploma alone — they want transcripts." },
                  { icon:"🎖️", label: lang==="es"?"Papeles de Baja Militar (DD-214)":lang==="pl"?"Dokumenty Zwolnienia z Wojska (DD-214)":"Military Discharge Papers (DD-214)", desc: lang==="es"?"Si eres veterano, trae tu DD-214. Muchos locales dan preferencia a los veteranos.":lang==="pl"?"Jeśli jesteś weteranem, przynieś swój DD-214. Wiele oddziałów daje preferencje weteranom i niektóre zawody mają dedykowane ścieżki praktyk dla weteranów.":"If you're a veteran, bring your DD-214. Many locals give preference to veterans and some trades have dedicated veteran apprenticeship pathways." },
                  { icon:"📷", label: lang==="es"?"Fotos Estilo Pasaporte":lang==="pl"?"Zdjęcia Paszportowe":"Passport-Style Photos", desc: lang==="es"?"Algunos locales solicitan fotos recientes con la solicitud.":lang==="pl"?"Niektóre oddziały wymagają aktualnych zdjęć wraz z wnioskiem. Sprawdź wymagania swojego oddziału.":"Some locals request recent photos with the application. Check the specific requirements for your local." },
                ].map((item, i) => (
                  <div key={i} className="checklist-item required">
                    <div className="checklist-icon">{item.icon}</div>
                    <div className="checklist-text">
                      <div className="checklist-label">{item.label} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                      <div className="checklist-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5 — Trade Specific */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Notas Específicas por Oficio":lang==="pl"?"Uwagi Specyficzne dla Zawodu":"Trade-Specific Notes"}</div>
              <div className="trade-diff-grid">
                {[
                  { trade:"⚡ IBEW", color:"#F5C518", notes: lang==="es"?[
                    "Prueba de aptitud NJATC requerida",
                    "Mínimo 1 año de álgebra en secundaria",
                    "Algunos locales requieren comprobante de álgebra",
                    "La entrevista se puntúa como parte del ranking",
                  ]:lang==="pl"?[
                    "Wymagany test predyspozycji NJATC (matematyka + czytanie)",
                    "Minimum 1 rok algebry w szkole średniej",
                    "Niektóre oddziały wymagają dowodu zaliczenia algebry",
                    "Rozmowa kwalifikacyjna punktowana jako część rankingu",
                  ]:[
                    "NJATC aptitude test required (math + reading)",
                    "Minimum 1 year of high school algebra",
                    "Some locals require algebra transcript proof",
                    "Interview scored as part of application ranking",
                  ]},
                  { trade:"🔧 UA", color:"#3b9eff", notes: lang==="es"?[
                    "Prueba de aptitud ATAP requerida",
                    "Algunos locales añaden razonamiento mecánico",
                    "Cubre plomería, tubería, HVAC y soldadura",
                    "La entrevista sigue a un puntaje aprobatorio",
                  ]:lang==="pl"?[
                    "Test predyspozycji ATAP (algebra + rozumienie tekstu)",
                    "Niektóre oddziały dodają sekcję rozumowania mechanicznego",
                    "Obejmuje hydraulikę, monterstwo, HVAC i spawanie",
                    "Rozmowa zwykle po pozytywnym wyniku testu",
                  ]:[
                    "ATAP aptitude test (algebra + reading comprehension)",
                    "Some locals add a mechanical reasoning section",
                    "Covers plumbing, pipefitting, HVAC, and welding paths",
                    "Interview typically follows a passing test score",
                  ]},
                  { trade:"🌬️ SMART", color:"#e05a2b", notes: lang==="es"?[
                    "La prueba de aptitud incluye matemáticas y razonamiento mecánico",
                    "Algunos locales requieren álgebra completada",
                    "Cubre chapistería, HVAC, techado y soldadura",
                    "La entrevista oral es parte de la mayoría de las solicitudes",
                  ]:lang==="pl"?[
                    "Test predyspozycji obejmuje matematykę i rozumowanie mechaniczne",
                    "Niektóre oddziały wymagają zaliczonego kursu algebry",
                    "Obejmuje blacharstwo, HVAC, pokrycia dachowe i spawanie",
                    "Rozmowa ustna jest częścią większości wniosków",
                  ]:[
                    "Aptitude test includes math and mechanical reasoning",
                    "Some locals require proof of completed algebra course",
                    "Covers sheet metal, HVAC, roofing, and welding",
                    "Oral interview is part of most applications",
                  ]},
                  { trade:"🧱 BAC", color:"#f97316", notes: lang==="es"?[
                    "La prueba de aptitud cubre matemáticas y lectura",
                    "Algunos locales hacen una demostración práctica de habilidades",
                    "Cubre albañilería, colocación de azulejos y enlucido",
                    "Se enfatiza la fuerza física y la resistencia",
                  ]:lang==="pl"?[
                    "Pisemny test predyspozycji obejmuje matematykę i czytanie",
                    "Niektóre oddziały przeprowadzają praktyczną demonstrację umiejętności",
                    "Obejmuje murarstwo, kafelkarstwo, tynkarstwo",
                    "Nacisk na siłę fizyczną i wytrzymałość",
                  ]:[
                    "Written aptitude test covers math and reading",
                    "Some locals conduct a hands-on skills demonstration",
                    "Covers bricklaying, tile setting, masonry, and plastering",
                    "Physical strength and endurance are emphasized",
                  ]},
                ].map((t, i) => (
                  <div key={i} className="trade-diff-card">
                    <div className="trade-diff-name" style={{color: t.color}}>{t.trade}</div>
                    <ul className="trade-diff-list">
                      {t.notes.map((n, j) => <li key={j}>{n}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6 — The Process */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"El Proceso de Solicitud":lang==="pl"?"Proces Aplikacyjny":"The Application Process"}</div>
              <div className="checklist-steps">
                {(lang==="es"?[
                  { n:"1", title:"Encuentra Tu Local", desc:"Usa la página Encontrar Local en este sitio para ubicar el local sindical más cercano para el oficio que elijas." },
                  { n:"2", title:"Verifica la Inscripción Abierta", desc:"Llama o visita el sitio web del local para saber cuándo abre su próxima ventana de solicitud." },
                  { n:"3", title:"Presenta Tu Solicitud", desc:"Recoge o descarga la solicitud. Preséntala con todos los documentos requeridos antes de la fecha límite." },
                  { n:"4", title:"Toma la Prueba de Aptitud", desc:"Serás programado para una prueba de aptitud escrita. Estudia matemáticas, especialmente álgebra." },
                  { n:"5", title:"Asiste a Tu Entrevista", desc:"Los solicitantes mejor clasificados son invitados a una entrevista oral. Sé profesional, puntual y preparado." },
                  { n:"6", title:"Recibe Tu Despacho", desc:"Una vez aceptado, serás enviado a un sitio de trabajo e inscrito en clases de escuela de oficios. Ganas salario completo desde el primer día." },
                ]:lang==="pl"?[
                  { n:"1", title:"Znajdź Swój Oddział", desc:"Skorzystaj ze strony Znajdź Oddział na tej stronie, aby zlokalizować najbliższy oddział związkowy dla wybranego zawodu." },
                  { n:"2", title:"Sprawdź Otwarte Zapisy", desc:"Zadzwoń lub odwiedź stronę oddziału, aby dowiedzieć się, kiedy otwiera się kolejne okno aplikacyjne. Większość przeprowadza zapisy 1–2 razy w roku." },
                  { n:"3", title:"Złóż Wniosek", desc:"Odbierz lub pobierz wniosek. Złóż go ze wszystkimi wymaganymi dokumentami przed terminem. Spóźnione lub niekompletne wnioski są zazwyczaj dyskwalifikowane." },
                  { n:"4", title:"Podejdź do Testu Predyspozycji", desc:"Zostaniesz zaplanowany na pisemny test predyspozycji. Ucz się matematyki — zwłaszcza algebry. Twój wynik określa pozycję na liście." },
                  { n:"5", title:"Weź Udział w Rozmowie Kwalifikacyjnej", desc:"Najwyżej ocenieni kandydaci są zaproszeni na rozmowę ustną. Bądź profesjonalny, punktualny i przygotowany." },
                  { n:"6", title:"Otrzymaj Przydział", desc:"Po przyjęciu zostaniesz przydzielony do budowy i zapisany na zajęcia szkoły zawodowej. Zarabiasz pełne wynagrodzenie od pierwszego dnia." },
                ]:[
                  { n:"1", title:"Find Your Local", desc:"Use the Find a Local page on this site to locate the union local nearest you for your chosen trade." },
                  { n:"2", title:"Check Open Enrollment", desc:"Call or visit the local's website to find out when their next application window opens. Most hold enrollment 1–2 times per year, though some are open year-round." },
                  { n:"3", title:"Submit Your Application", desc:"Pick up or download the application. Submit it with all required documents before the deadline. Late or incomplete applications are usually disqualified." },
                  { n:"4", title:"Take the Aptitude Test", desc:"You'll be scheduled for a written aptitude test. Study your math — especially algebra. Your score determines your ranking on the list." },
                  { n:"5", title:"Attend Your Interview", desc:"Top-ranked applicants are invited for an oral interview. Be professional, on time, and prepared to explain why you want to work in the trades." },
                  { n:"6", title:"Get Dispatched", desc:"Once accepted, you'll be dispatched to a job site and enrolled in trade school classes. You earn full wages from day one while your training is paid for by the industry." },
                ]).map((s, i) => (
                  <div key={i} className="checklist-step">
                    <div className="step-num">{s.n}</div>
                    <div className="step-content">
                      <div className="step-title">{s.title}</div>
                      <div className="step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="cta-banner">
              <h3>{lang==="es"?"¿Listo para Dar el Primer Paso?":lang==="pl"?"Gotowy na Pierwszy Krok?":"Ready to Take the First Step?"}</h3>
              <p>{lang==="es"?"Encuentra el local sindical más cercano y comunícate directamente para comenzar el proceso de solicitud.":lang==="pl"?"Znajdź najbliższy oddział związkowy i skontaktuj się bezpośrednio, aby rozpocząć proces aplikacyjny.":"Find the local union nearest you and reach out directly to get the application process started."}</p>
              <button className="btn-primary" onClick={() => setPage("home")}>
                {lang==="es"?"Encontrar Mi Local Más Cercano →":lang==="pl"?"Znajdź Mój Najbliższy Oddział →":"Find My Nearest Local →"}
              </button>
            </div>
          </div>
        )}

        {/* ── VETERANS / HELMETS TO HARDHATS PAGE ── */}
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
            {/* HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "💰 Tu Futuro, Construido en el Trabajo" : lang==="pl" ? "💰 Twoja Przyszłość, Zbudowana w Pracy" : "💰 Your Future, Built on the Job"}</div>
              <h1 className="history-title">
                401k vs Anualidad vs <span className="accent">{lang==="es" ? "Pensión" : lang==="pl" ? "Emerytura" : "Pension"}</span>
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Tres formas diferentes de ahorrar para la jubilación — y los oficios de construcción sindical ofrecen las tres. Esto es lo que significa cada una en términos simples." : lang==="pl" ? "Trzy różne sposoby oszczędzania na emeryturę — a związkowe zawody budowlane oferują wszystkie trzy. Oto co każdy z nich oznacza prostymi słowami." : "Three different ways to save for retirement — and union construction trades offer all three. Here's what each one means in plain English."}
              </p>
            </div>

            {/* QUICK COMPARISON TABLE */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"La Respuesta "}<span className="accent">Rápida</span></> : lang==="pl" ? <>{"Szybka "}<span className="accent">Odpowiedź</span></> : <>{"The "}<span className="accent">Quick</span>{" Answer"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Antes de profundizar — aquí está la versión de 30 segundos." : lang==="pl" ? "Zanim zagłębimy się w szczegóły — oto wersja 30-sekundowa." : "Before diving in — here's the 30-second version."}</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%", borderCollapse:"collapse", fontSize:14}}>
                  <thead>
                    <tr style={{background:"rgba(250,128,89,0.12)", borderBottom:"2px solid #FA8059"}}>
                      {["", "Pension", "Annuity", "401k"].map(h => (
                        <th key={h} style={{padding:"14px 16px", textAlign:"left", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:800, color: h==="Pension" ? "#FA8059" : "white", letterSpacing:"0.05em"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Who funds it?", "Employer pays in", "Employer pays in", "You pay in (employer may match)"],
                      ["Guaranteed payment?", "✅ Yes — for life", "✅ Yes — fixed amount", "❌ No — market dependent"],
                      ["You control investments?", "❌ No", "❌ No", "✅ Yes"],
                      ["Monthly check in retirement?", "✅ Yes", "✅ Yes", "You withdraw as needed"],
                      ["Common in union trades?", "✅ Very common", "✅ Very common", "Sometimes offered too"],
                      ["Risk to worker?", "Very low", "Very low", "Higher — market risk"],
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
            </div>

            <hr className="divider-line" />

            {/* PENSION */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"🏆 La "}<span className="accent">Pensión</span>{" — El Estándar de Oro"}</> : lang==="pl" ? <>{"🏆 "}<span className="accent">Emerytura</span>{" — Złoty Standard"}</> : <>{"🏆 The "}<span className="accent">Pension</span>{" — The Gold Standard"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "El beneficio de jubilación más valioso que puedes tener — y los oficios sindicales todavía lo ofrecen." : lang==="pl" ? "Najcenniejszy świadczenie emerytalne, jakie możesz mieć — a związki zawodowe w budownictwie nadal je oferują." : "The most valuable retirement benefit you can have — and union trades still offer it."}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">📋</div>
                  <div className="impact-title">What It Is</div>
                  <div className="impact-desc">A pension — also called a "defined benefit plan" — is a retirement account funded entirely by your employer. You don't contribute anything out of your paycheck. When you retire, you receive a guaranteed monthly check for the rest of your life, no matter how long you live.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🔢</div>
                  <div className="impact-title">How It's Calculated</div>
                  <div className="impact-desc">Your monthly pension check is typically calculated based on how many years you worked and your average wage. Example: 30 years of work × 2% × $60,000 average salary = $36,000/year pension. That's $3,000/month, every month, for life.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">⭐</div>
                  <div className="impact-title">Why It's So Valuable</div>
                  <div className="impact-desc">Most Americans have no pension. Only about 12% of private sector workers have one. Union construction workers are among the few who still do. You can't outlive a pension — it pays until you die, and often continues for a spouse after you're gone.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🏗️</div>
                  <div className="impact-title">In Union Trades</div>
                  <div className="impact-desc">Nearly every major construction union — IBEW, UA, UBC, BAC, Ironworkers, Laborers, and more — offers a defined benefit pension plan. Employers contribute a set dollar amount per hour you work. After enough years of service, you retire with a guaranteed monthly check for life.</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">"A union pension means you can't outlive your money. Work 30 years as a journeyman, and retire knowing exactly what you'll get every month — for the rest of your life."</div>
                <div className="quote-author">— How Union Pension Plans Work</div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* ANNUITY */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"📈 La "}<span className="accent">Anualidad</span>{" — Tu Segundo Cheque"}</> : lang==="pl" ? <>{"📈 "}<span className="accent">Renta Annuitetowa</span>{" — Twoja Druga Wypłata"}</> : <>{"📈 The "}<span className="accent">Annuity</span>{" — Your Second Check"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Piénsalo como una cuenta de jubilación adicional además de tu pensión." : lang==="pl" ? "Pomyśl o tym jako dodatkowym koncie emerytalnym na szczycie Twojej emerytury." : "Think of it as a bonus retirement account on top of your pension."}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">📋</div>
                  <div className="impact-title">What It Is</div>
                  <div className="impact-desc">An annuity (sometimes called a "defined contribution" plan) is an additional retirement account that your employer funds. In most union contracts, employers contribute a set amount per hour worked directly into your annuity account. It builds up over your career and pays out when you retire.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">💵</div>
                  <div className="impact-title">How It Works</div>
                  <div className="impact-desc">Example: Your union contract says the employer contributes $3.50/hr to your annuity. If you work 2,000 hours a year, that's $7,000/year going into your account — without you contributing a single dollar. Over 30 years, that could easily grow to $400,000+.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🔄</div>
                  <div className="impact-title">Annuity vs. Pension</div>
                  <div className="impact-desc">The key difference: a pension pays a fixed monthly amount for life. An annuity is more like a savings account — it grows over time and you can often choose how to draw it down in retirement. Some annuities also convert to a monthly payment at retirement.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🏗️</div>
                  <div className="impact-title">In Union Trades</div>
                  <div className="impact-desc">Many union construction contracts include BOTH a pension AND an annuity. So you're building two separate retirement accounts simultaneously — both funded by your employer — on top of Social Security. This is extremely rare outside of union jobs.</div>
                </div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* 401k */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"📊 El "}<span className="accent">401k</span>{" — El Plan Más Común"}</> : lang==="pl" ? <>{"📊 "}<span className="accent">401k</span>{" — Najpopularniejszy Plan"}</> : <>{"📊 The "}<span className="accent">401k</span>{" — The Most Common Plan"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Probablemente hayas oído hablar de este — esto es lo que necesitas saber." : lang==="pl" ? "Prawdopodobnie już o tym słyszałeś — oto co musisz wiedzieć." : "You've probably heard of this one — here's what you need to know."}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">📋</div>
                  <div className="impact-title">What It Is</div>
                  <div className="impact-desc">A 401k is a retirement savings account where YOU contribute a portion of your paycheck — before taxes — and the money grows in investments (stocks, bonds, mutual funds). Your employer may match some of your contributions, but you're doing most of the funding yourself.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">📉</div>
                  <div className="impact-title">The Risk</div>
                  <div className="impact-desc">Your 401k balance goes up and down with the stock market. If the market crashes right before you retire — like 2008 — your savings can drop 30-40% overnight. Unlike a pension, there's no guaranteed amount. You could run out of money if you live longer than expected.</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">✅</div>
                  <div className="impact-title">The Benefits</div>
                  <div className="impact-desc">You control where your money is invested. Contributions are pre-tax, lowering your taxable income now. Employer matches are essentially free money. You can take it with you if you change jobs (unlike some pensions that require years of service to vest).</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🏗️</div>
                  <div className="impact-title">In Union Trades</div>
                  <div className="impact-desc">Some unions offer a 401k in addition to a pension and annuity. Others don't need to — because the pension and annuity already do what a 401k does, but better. In most cases, a union pension + annuity beats a 401k because it's guaranteed and employer-funded.</div>
                </div>
              </div>
            </div>


            <hr className="divider-line" />

            {/* BENEFITS BREAKDOWN */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Tu "}<span className="accent">Paquete Completo</span>{" — Lo que Paga el Contratista"}</> : lang==="pl" ? <>{"Twój "}<span className="accent">Pełny Pakiet</span>{" — Co Płaci Wykonawca"}</> : <>{"Your "}<span className="accent">Full Package</span>{" — What the Contractor Pays"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Aquí tienes un ejemplo de lo que un contratista sindical paga por hora en tu nombre — más allá de tu salario base." : lang==="pl" ? "Oto przykład tego, co wykonawca związkowy płaci za godzinę w Twoim imieniu — poza Twoją podstawową stawką." : "Here's an example of what a union contractor pays per hour on your behalf — beyond your base wage."}</div>

              <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"32px", marginBottom:32}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:24}}>{lang==="es" ? "Ejemplo: Electricista Oficial — Mercado Principal" : lang==="pl" ? "Przykład: Elektryk Czeladnik — Duży Rynek" : "Example: Journeyman Electrician — Major Market"}</div>
                {[
                  ["Base Wage ", "$48.00/hr", true, "This is what appears on your paycheck"],
                  ["Health & Welfare", "$12.50/hr", false, "Paid by contractor directly to your health fund — NOT deducted from your check"],
                  ["Pension Contribution", "$9.00/hr", false, "Paid by contractor to your pension fund — NOT deducted from your check"],
                  ["Annuity / 401k", "$5.00/hr", false, "Paid by contractor to your retirement account — NOT deducted from your check"],
                  ["Vacation / Holiday Fund", "$4.50/hr", false, "Paid by contractor to your vacation fund — NOT deducted from your check"],
                  ["Training / Apprenticeship Fund", "$1.00/hr", false, "Paid by contractor — NOT deducted from your check"],
                  ["Other (disability, etc.)", "$1.00/hr", false, "Paid by contractor — NOT deducted from your check"],
                  ["Health & Welfare (insurance)", "$12.50/hr", false],
                  ["Pension Contribution", "$9.00/hr", false],
                  ["Annuity / 401k", "$5.00/hr", false],
                  ["Vacation / Holiday Fund", "$4.50/hr", false],
                  ["Training / Apprenticeship Fund", "$1.00/hr", false],
                  ["Other (disability, etc.)", "$1.00/hr", false],
                ].map(([label, amount, isWage, note], i) => (
                  <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i < 6 ? "1px solid rgba(58,80,104,0.4)" : "none"}}>
                    <div><span style={{fontSize:15, color: isWage ? "white" : "var(--muted)", fontWeight: isWage ? 700 : 400}}>{label}</span>{note && <div style={{fontSize:12, color:"#FA8059", marginTop:2}}>{note}</div>}</div>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: isWage ? "#FA8059" : "var(--muted)"}}>{amount}</span>
                  </div>
                ))}
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0 0", marginTop:8, borderTop:"2px solid #FA8059"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:"white"}}>TOTAL COMPENSATION</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:"#FA8059"}}>$81.00/hr</span>
                </div>
                <div style={{fontSize:13, color:"var(--muted)", marginTop:12, fontStyle:"italic"}}>* Example figures only. Actual rates vary by local, market, and contract year. Your base wage is what appears on your paycheck — everything else is paid directly to funds on your behalf.</div>
              </div>
            </div>

            <hr className="divider-line" />

            {/* WHY UNION WINS */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Por Qué la "}<span className="accent">Jubilación Sindical</span>{" Gana a Casi Todo"}</> : lang==="pl" ? <>{"Dlaczego "}<span className="accent">Emerytura Związkowa</span>{" Bije Prawie Wszystko"}</> : <>{"Why "}<span className="accent">Union Retirement</span>{" Beats Almost Everything"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Así es como se ve un paquete de jubilación típico de construcción sindical en comparación con un trabajo estándar." : lang==="pl" ? "Oto jak wygląda typowy pakiet emerytalny w związkowym budownictwie w porównaniu ze standardową pracą." : "Here's what a typical union construction retirement package looks like compared to a standard job."}</div>

              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:32}}>
                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.2)", borderRadius:20, padding:"28px 24px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"#FA8059", marginBottom:16}}>{lang==="es" ? "🏗️ Trabajador de Construcción Sindical" : lang==="pl" ? "🏗️ Związkowy Pracownik Budowlany" : "🏗️ Union Construction Worker"}</div>
                  {["✅ Defined benefit pension — guaranteed monthly check for life", "✅ Annuity account — employer-funded, builds over career", "✅ Health insurance — full family coverage, often free", "✅ Social Security", "✅ Optional 401k at some locals", "✅ All of the above funded largely by EMPLOYER contributions"].map((item, i) => (
                    <div key={i} style={{fontSize:14, color:"var(--muted)", marginBottom:8, lineHeight:1.5}}>{item}</div>
                  ))}
                </div>
                <div style={{background:"rgba(34,48,61,0.4)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:20, padding:"28px 24px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:"white", marginBottom:16}}>{lang==="es" ? "💼 Trabajo Típico No Sindical" : lang==="pl" ? "💼 Typowa Praca Poza Związkiem" : "💼 Typical Non-Union Job"}</div>
                  {["❌ No pension (most private employers eliminated these)", "❌ No annuity", "⚠️ 401k — YOU fund it, market risk, no guarantee", "⚠️ Health insurance — often expensive premiums", "✅ Social Security", "❌ Retirement security largely YOUR responsibility"].map((item, i) => (
                    <div key={i} style={{fontSize:14, color:"var(--muted)", marginBottom:8, lineHeight:1.5}}>{item}</div>
                  ))}
                </div>
              </div>

              <div className="quote-block">
                <div className="quote-text">"When you add up the pension, annuity, and benefits — a journeyman electrician's total compensation package can exceed $100/hr in major markets. Most people do not realize how much of that goes toward your future."</div>
                <div className="quote-author">— The True Value of a Union Package</div>
              </div>

              <div style={{textAlign:"center", marginTop:48}}>
                <button className="btn-primary" onClick={() => { setPage("home"); window.scrollTo(0,0); }}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {page === "veterans" && (
          <div className="page" style={{maxWidth: 820}}>
            <div className="page-eyebrow">{lang==="es" ? "Para Veteranos y Militares" : lang==="pl" ? "Dla Weteranów i Żołnierzy" : "For Veterans & Service Members"}</div>
            <h1 className="page-title">{lang==="es" ? "Tu Servicio Abre la Puerta" : lang==="pl" ? "Twoja Służba Otwiera Drzwi" : "Your Service Opens the Door"}</h1>
            <p className="page-sub">
              {lang==="es"
                ? "Las habilidades que desarrollaste en el servicio militar — disciplina, trabajo en equipo, conciencia de seguridad — son exactamente lo que los oficios sindicales buscan."
                : lang==="pl"
                ? "Umiejętności, które zdobyłeś w mundurze — dyscyplina, praca zespołowa, świadomość bezpieczeństwa, praca pod presją — to dokładnie to, czego szukają związki zawodowe. Tysiące weteranów już dokonało tej zmiany. Oto jak."
                : "The skills you built in uniform — discipline, teamwork, safety awareness, working under pressure — are exactly what the union trades are looking for. Thousands of veterans have made the transition. Here's how."}
            </p>

            {/* H2H Hero Card */}
            <div className="h2h-hero">
              <div className="h2h-logo-block">
                <div className="h2h-emblem">🪖</div>
                <div className="h2h-logo-text">Helmets<br/>to<br/>Hardhats</div>
              </div>
              <div className="h2h-hero-text">
                <div className="h2h-hero-title">{lang==="es" ? "El Puente Oficial del Servicio Militar a las Carreras Sindicales" : lang==="pl" ? "Oficjalny Most od Służby Wojskowej do Kariery Związkowej" : "The Official Bridge from Military Service to Union Careers"}</div>
                <p className="h2h-hero-desc">
                  {lang==="es"
                    ? "Helmets to Hardhats (H2H) es una organización sin fines de lucro que ha conectado a casi 50,000 veteranos con aprendizajes registrados en los oficios de construcción desde 2003."
                    : lang==="pl"
                    ? "Helmets to Hardhats (H2H) to organizacja non-profit 501(c)(3), która od 2003 roku połączyła prawie 50 000 weteranów z zarejestrowanymi programami praktyk w zawodach budowlanych. Jest bezpłatna, stworzona wspólnie przez pracodawców i pracowników, i poparta przez 15 międzynarodowych związków budowlanych."
                    : "Helmets to Hardhats (H2H) is a 501(c)(3) nonprofit that has connected nearly 50,000 veterans to registered apprenticeships in the construction trades since 2003. It's free, it's built by labor and management together, and it's backed by 15 international building trades unions including IBEW, UA, SMART, and BAC."}
                </p>
                <div className="h2h-stat-row">
                  {[
                    { num: "50,000+", label: lang==="es"?"Veteranos colocados desde 2003":lang==="pl"?"Weteranów zatrudnionych od 2003":"Veterans placed since 2003" },
                    { num: "15", label: lang==="es"?"Sindicatos internacionales socios":lang==="pl"?"Partnerskich związków międzynarodowych":"Partner international unions" },
                    { num: "$0", label: lang==="es"?"Costo para aplicar":lang==="pl"?"Koszt aplikacji":"Cost to apply" },
                  ].map((s,i) => (
                    <div key={i} className="h2h-stat">
                      <div className="h2h-stat-num">{s.num}</div>
                      <div className="h2h-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Veterans Thrive */}
            <div className="section-title">{lang==="es"?"Por Qué los Veteranos Prosperan en los Oficios":lang==="pl"?"Dlaczego Weterani Odnoszą Sukces w Zawodach Budowlanych":"Why Veterans Thrive in the Trades"}</div>
            <div className="vet-advantage-grid">
              {[
                { icon:"🎖️", label: lang==="es"?"Las Habilidades Militares Transfieren":lang==="pl"?"Umiejętności Wojskowe się Przekładają":"Military Skills Transfer", desc: lang==="es"?"El liderazgo, trabajar bajo presión, atención al detalle y disciplina de seguridad se traducen directamente a los oficios de construcción.":lang==="pl"?"Przywództwo, praca pod presją, dbałość o szczegóły, dyscyplina bezpieczeństwa — wszystko to bezpośrednio przekłada się na zawody budowlane. Wielu weteranów awansuje szybciej niż inni praktykanci.":"Leadership, working under pressure, attention to detail, safety discipline — all of these directly translate to the construction trades. Many veterans advance faster than non-veteran apprentices." },
                { icon:"🤝", label: lang==="es"?"Cultura de Hermandad":lang==="pl"?"Kultura Braterstwa":"Brotherhood Culture", desc: lang==="es"?"Los locales sindicales operan con los mismos principios que el ejército — lealtad, cuidarse mutuamente, no dejar a nadie atrás.":lang==="pl"?"Sale związkowe działają na tych samych zasadach co wojsko — lojalność, wzajemna opieka, nie zostawianie nikogo w tyle. Weterani często mówią, że kultura czuje się jak dom.":"Union halls operate on the same principles as the military — loyalty to your brothers and sisters, taking care of each other, and leaving no one behind. Veterans consistently report the culture feels like home." },
                { icon:"📋", label: lang==="es"?"Preferencia para Veteranos":lang==="pl"?"Preferencje dla Weteranów":"Veteran Preference", desc: lang==="es"?"Muchos locales otorgan puntos de preferencia a los veteranos en el proceso de clasificación de aprendizaje. Un DD-214 puede ser una ventaja real.":lang==="pl"?"Wiele oddziałów przyznaje weteranom dodatkowe punkty w procesie rankingowym praktyk. DD-214 może być prawdziwą przewagą w konkursie o miejsca.":"Many locals give veterans preference points in the apprenticeship ranking process. A DD-214 can be a real advantage when applications are competitive." },
                { icon:"💰", label: lang==="es"?"Combina GI Bill + Salario de Aprendiz":lang==="pl"?"Połącz GI Bill + Wynagrodzenie Praktykanta":"Stack GI Bill + Apprentice Pay", desc: lang==="es"?"Los veteranos en aprendizajes aprobados pueden usar su GI Bill para suplementar su salario de aprendiz.":lang==="pl"?"Weterani w zatwierdzonych programach praktyk mogą używać GI Bill do uzupełnienia wynagrodzenia praktykanta — dzięki czemu możesz zarabiać prawie tyle co wykwalifikowany pracownik podczas szkolenia.":"Veterans in approved apprenticeships can use their GI Bill to supplement their apprentice wage — meaning you can earn close to journey-level pay while you're still training. This is one of the most underused veteran benefits." },
                { icon:"⚕️", label: lang==="es"?"Beneficios desde el Primer Día":lang==="pl"?"Świadczenia od Pierwszego Dnia":"Benefits from Day One", desc: lang==="es"?"Seguro médico, contribuciones de pensión y beneficios de anualidad comienzan de inmediato.":lang==="pl"?"Ubezpieczenie zdrowotne, składki emerytalne i świadczenia rentowe zaczynają się natychmiast. Nie czekasz lat na kwalifikacje — umowa związkowa obejmuje Cię od pierwszego dnia pracy.":"Health insurance, pension contributions, and annuity benefits start immediately. You're not waiting years to qualify — the union contract covers you from your first dispatch." },
                { icon:"🏗️", label: lang==="es"?"Trayectoria Profesional Clara":lang==="pl"?"Wyraźna Ścieżka Kariery":"Clear Career Path", desc: lang==="es"?"Los oficios ofrecen el mismo tipo de estructura de rango al que los veteranos están acostumbrados — aprendiz, oficial, capataz, superintendente.":lang==="pl"?"Zawody budowlane oferują tę samą strukturę rang, do której przyzwyczajeni są weterani — praktykant, czeladnik, brygadzista, superintendant.":"The trades offer the same kind of rank structure veterans are used to — apprentice, journeyman, foreman, superintendent. You always know where you stand and what comes next." },
              ].map((a,i) => (
                <div key={i} className="vet-advantage-card">
                  <div className="vet-adv-icon">{a.icon}</div>
                  <div>
                    <div className="vet-adv-label">{a.label}</div>
                    <div className="vet-adv-desc">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* GI Bill Box */}
            <div className="gi-bill-box">
              <div className="gi-bill-icon">💡</div>
              <div>
                <div className="gi-bill-title">{lang==="es"?"La Combinación de GI Bill + Aprendizaje":lang==="pl"?"Kombinacja GI Bill + Praktykantstwo":"The GI Bill + Apprenticeship Combination"}</div>
                <div className="gi-bill-desc">
                  {lang==="es"
                    ? "La mayoría de los aprendizajes de construcción sindical están aprobados para los beneficios del GI Bill. Como aprendiz, ganas un porcentaje del salario de oficial — comenzando alrededor del 45-50% y aumentando cada 6 meses. Tu subsidio de vivienda del GI Bill se paga adicionalmente. Para muchos veteranos, el ingreso combinado durante el aprendizaje iguala o supera el salario completo de oficial."
                    : lang==="pl"
                    ? "Większość związkowych praktyk budowlanych jest zatwierdzona do świadczeń GI Bill (Rozdział 33 Post-9/11 lub Rozdział 30 Montgomery). Jako praktykant zarabiasz procent wynagrodzenia czeladnika — zaczynając od około 45-50% i rosnąc co 6 miesięcy. Zasiłek mieszkaniowy GI Bill jest wypłacany dodatkowo. Dla wielu weteranów łączny dochód podczas praktyki dorównuje lub przekracza pełne wynagrodzenie czeladnika."
                    : "Most union construction apprenticeships are approved for GI Bill (Chapter 33 Post-9/11 or Chapter 30 Montgomery) benefits. As an apprentice, you earn a percentage of journeyman wages — starting around 45-50% and increasing every 6 months. Your GI Bill housing allowance is paid on top of that. For many veterans, the combined income during apprenticeship matches or exceeds full journeyman pay. Contact your local VA education office or visit va.gov to verify your eligibility and calculate your benefit."}
                </div>
              </div>
            </div>

            {/* How H2H Works */}
            <div className="section-title">{lang==="es"?"Cómo Funciona Helmets to Hardhats":lang==="pl"?"Jak Działa Helmets to Hardhats":"How Helmets to Hardhats Works"}</div>
            <div className="h2h-steps">
              {(lang==="es"?[
                { n:"1", title:"Crea una Cuenta Gratuita", desc:"Ve a helmetstohardhats.org y crea un perfil gratuito. Ingresarás tu historial militar, habilidades, ubicación e intereses de oficio." },
                { n:"2", title:"Conéctate con un Representante Regional", desc:"Una vez que tu cuenta esté activa, un miembro del personal de H2H en tu región toma un papel activo conectándote con oportunidades de aprendizaje cerca de ti." },
                { n:"3", title:"Aplica a Programas de Aprendizaje", desc:"H2H te conecta directamente con locales sindicales que están aceptando solicitudes." },
                { n:"4", title:"Toma la Prueba de Aptitud", desc:"La mayoría de los oficios requieren una prueba de aptitud matemática. H2H puede orientarte a recursos de estudio." },
                { n:"5", title:"Comienza Tu Aprendizaje", desc:"Una vez aceptado, eres enviado a un sitio de trabajo, inscrito en la escuela de oficios y ganando beneficios completos desde el primer día." },
              ]:lang==="pl"?[
                { n:"1", title:"Utwórz Darmowe Konto", desc:"Przejdź do helmetstohardhats.org i utwórz bezpłatny profil. Wpiszesz swoje doświadczenie wojskowe, umiejętności, lokalizację i zainteresowania zawodowe. Zajmuje to około 10 minut." },
                { n:"2", title:"Zostań Dopasowany do Regionalnego Przedstawiciela", desc:"Gdy Twoje konto jest aktywne, pracownik H2H w Twoim regionie aktywnie łączy Cię z ofertami praktyk i możliwościami kariery w pobliżu." },
                { n:"3", title:"Aplikuj do Programów Praktyk", desc:"H2H łączy Cię bezpośrednio z oddziałami związkowymi przyjmującymi wnioski. Wszystkie oferty pracy pochodzą od pracodawców związkowych." },
                { n:"4", title:"Podejdź do Testu Predyspozycji", desc:"Większość zawodów wymaga testu predyspozycji matematycznych. H2H może wskazać Ci materiały do nauki. Weterani często osiągają dobre wyniki dzięki wojskowemu przeszkoleniu technicznemu." },
                { n:"5", title:"Rozpocznij Praktykę", desc:"Po przyjęciu zostajesz przydzielony do budowy, zapisany do szkoły zawodowej i zarabiasz pełne świadczenia od pierwszego dnia. GI Bill uzupełnia Twoje wynagrodzenie." },
              ]:[
                { n:"1", title:"Create a Free Account", desc:"Go to helmetstohardhats.org and create a free profile. You'll enter your military background, skills, location, and trade interests. It takes about 10 minutes." },
                { n:"2", title:"Get Matched to a Regional Rep", desc:"Once your account is active, an H2H staff member in your region takes an active role connecting you to apprenticeship openings and career opportunities near you." },
                { n:"3", title:"Apply to Apprenticeship Programs", desc:"H2H connects you directly to union locals that are accepting applications. All job postings come from union-signatory employers — no non-union work." },
                { n:"4", title:"Take the Aptitude Test", desc:"Most trades require a math aptitude test. H2H can point you to study resources. Veterans often score well due to military technical training backgrounds." },
                { n:"5", title:"Start Your Apprenticeship", desc:"Once accepted, you're dispatched to a job site, enrolled in trade school, and earning full benefits from day one. Your GI Bill kicks in to supplement your wage." },
              ]).map((s,i) => (
                <div key={i} className="h2h-step">
                  <div className="h2h-step-num">{s.n}</div>
                  <div className="h2h-step-body">
                    <div className="h2h-step-title">{s.title}</div>
                    <div className="h2h-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Participating Trades */}
            <div className="section-title">{lang==="es"?"Oficios Disponibles a Través de H2H":lang==="pl"?"Zawody Dostępne przez H2H":"Trades Available Through H2H"}</div>
            <div className="trades-vet-grid">
              {[
                { icon:"⚡", name:"IBEW Electricians", desc: lang==="es"?"Electricistas, trabajadores de línea, telecomunicaciones":lang==="pl"?"Elektrycy wewnętrzni, monterzy linii, telekomunikacja":"Inside wiremen, lineworkers, telecom" },
                { icon:"🔧", name:"UA Plumbers & Pipefitters", desc: lang==="es"?"Plomería, tubería, HVAC, soldadura":lang==="pl"?"Hydraulika, monterstwo, HVAC, spawanie":"Plumbing, pipefitting, HVAC, welding" },
                { icon:"🌬️", name:"SMART Sheet Metal", desc: lang==="es"?"Conductos, fabricación HVAC, techado":lang==="pl"?"Kanały wentylacyjne, produkcja HVAC, pokrycia dachowe":"Ductwork, HVAC fabrication, roofing" },
                { icon:"🧱", name:"BAC Bricklayers", desc: lang==="es"?"Mampostería, azulejo, piedra, terrazo":lang==="pl"?"Murarka, kafelkarstwo, kamień, lastryko":"Masonry, tile, stone, terrazzo" },
                { icon:"🪚", name:"UBC Carpenters", desc: lang==="es"?"Marcos, ebanistería, encofrado":lang==="pl"?"Szkieletowanie, stolarstwo, szalunki, meble":"Framing, millwork, formwork, cabinetry" },
                { icon:"🏗️", name:"IUOE Operating Engineers", desc: lang==="es"?"Equipo pesado, grúas, excavadoras":lang==="pl"?"Ciężki sprzęt, dźwigi, koparki":"Heavy equipment, cranes, excavators" },
                { icon:"⚒️", name:"Ironworkers", desc: lang==="es"?"Acero estructural, varilla, ornamental":lang==="pl"?"Stal konstrukcyjna, zbrojenie, ornamentyka":"Structural steel, rebar, ornamental" },
                { icon:"🚧", name:"LIUNA Laborers", desc: lang==="es"?"Construcción general, tunelería, tuberías":lang==="pl"?"Budownictwo ogólne, drążenie tuneli, rurociągi":"General construction, tunneling, pipeline" },
              ].map((t,i) => (
                <div key={i} className="trade-vet-card">
                  <div className="trade-vet-icon">{t.icon}</div>
                  <div>
                    <div className="trade-vet-name">{t.name}</div>
                    <div className="trade-vet-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="cta-banner">
              <h3>{lang==="es"?"¿Listo para Hacer la Transición?":lang==="pl"?"Gotowy na Zmianę?":"Ready to Make the Transition?"}</h3>
              <p>{lang==="es"?"Comienza en Helmets to Hardhats — o encuentra tu local sindical más cercano aquí mismo.":lang==="pl"?"Zacznij od Helmets to Hardhats — lub znajdź najbliższy oddział związkowy tutaj i skontaktuj się bezpośrednio.":"Start at Helmets to Hardhats — or find your nearest union local right here and reach out directly."}</p>
              <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap"}}>
                <a className="btn-primary" href="https://helmetstohardhats.org" target="_blank" rel="noopener noreferrer">
                  {lang==="es"?"Visitar Helmets to Hardhats →":lang==="pl"?"Odwiedź Helmets to Hardhats →":"Visit Helmets to Hardhats →"}
                </a>
                <button className="btn-ghost" onClick={() => setPage("home")}>
                  {lang==="es"?"Encontrar Mi Local Más Cercano":lang==="pl"?"Znajdź Mój Najbliższy Oddział":"Find My Nearest Local"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT PAGE ── */}
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

            {/* FEATURE CARDS */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"16px"}}>
              {[
                { num:"01", title: lang==="es" ? "Encuentra tu Local" : lang==="pl" ? "Znajdz Swoj Oddzial" : "Find Your Local", desc: lang==="es" ? "Busca locales sindicales de IBEW, UA, BAC, Ironworkers, UBC y mas — cerca de ti." : lang==="pl" ? "Znajdz lokale zwiazkowe IBEW, UA, BAC, Ironworkers i innych — w poblizu Ciebie." : "Search union locals from IBEW, UA, BAC, Ironworkers, UBC, and more — near you.", page: "home" },
                { num:"02", title: lang==="es" ? "Cual Oficio es para Ti?" : lang==="pl" ? "Ktory Zawod Jest dla Ciebie?" : "Which Trade Is Right For You?", desc: lang==="es" ? "Haz nuestro cuestionario gratuito y descubre que oficio sindical se adapta mejor a tus habilidades." : lang==="pl" ? "Weź udzial w naszym darmowym quizie i odkryj, ktory zawod najlepiej odpowiada Twoim umiejetnosciom." : "Take our free quiz and find out which union trade best matches your skills and goals.", page: "quiz" },
                { num:"03", title: lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Sciezki Kariery" : "Career Paths", desc: lang==="es" ? "Aprende sobre los salarios de aprendiz a oficial, los tiempos de progresion y beneficios de cada oficio." : lang==="pl" ? "Dowiedz sie o wynagrodzeniach od praktykanta do czeladnika i swiadczeniach w kazdym zawodzie." : "Learn about apprentice-to-journeyman wages, progression timelines, and benefits for each trade.", page: "careers" },
                { num:"04", title: lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Swiadczenia Zwiazowe" : "Union Benefits", desc: lang==="es" ? "Pensiones, seguros de salud, anualidades — todo pagado por el contratista. Aprende lo que vale un trabajo sindical." : lang==="pl" ? "Emerytury, ubezpieczenia zdrowotne, renty — wszystko placone przez wykonawce." : "Pensions, health insurance, annuities — all paid by your contractor. Learn what a union job is really worth.", page: "benefits" },
                { num:"05", title: lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia Zwiazowa" : "Union History", desc: lang==="es" ? "El fin de semana, la jornada de 8 horas, el seguro medico — todo fue luchado y ganado por trabajadores sindicalizados." : lang==="pl" ? "Weekend, 8-godzinny dzien pracy, ubezpieczenie zdrowotne — o wszystko to walczyli zwiazkowcy." : "The weekend, the 8-hour day, health insurance — all fought for and won by union workers.", page: "history" },
                { num:"06", title: lang==="es" ? "Veteranos y los Oficios" : lang==="pl" ? "Weterani i Zawody" : "Veterans & the Trades", desc: lang==="es" ? "Los veteranos militares son perfectos para los aprendizajes sindicales. Descubre Helmets to Hardhats y mas." : lang==="pl" ? "Weterani wojskowi sa doskonalymi kandydatami do zwiazowych praktyk. Poznaj Helmets to Hardhats." : "Military veterans are a natural fit for union apprenticeships. Learn about Helmets to Hardhats and more.", page: "veterans" },
              ].map((card, i) => (
                <div key={i} onClick={() => setPage(card.page)} style={{
                  background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:"16px", padding:"28px 24px",
                  cursor:"pointer", transition:"all 0.2s",
                  position:"relative", overflow:"hidden"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(250,128,89,0.05)"; e.currentTarget.style.borderColor="rgba(250,128,89,0.25)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.15em", color:"rgba(250,128,89,0.5)", marginBottom:"12px"}}>{card.num}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:"800", color:"#fff", marginBottom:"10px", lineHeight:"1.2"}}>{card.title} <span style={{color:"#FA8059"}}>→</span></div>
                  <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.65"}}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer>
          <span>{t.footerLeft}</span>
          <span>{t.footerRight}</span>
        </footer>
      </div>
    </>
  );
}
