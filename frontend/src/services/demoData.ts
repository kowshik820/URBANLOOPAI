import {
  WasteItem,
  RecyclingRequest,
  EWasteFacility,
  EWasteRequest,
  DashboardSummary,
  UserActivity
} from '../types';

export const DEMO_WASTE_ITEMS: WasteItem[] = [
  {
    id: 'item-1',
    name: 'PET Plastic Water Bottle',
    aliases: ['water bottle', 'soda bottle', 'plastic bottle', 'polyethylene terephthalate'],
    category: 'Dry Recyclable',
    binColor: 'blue',
    instructions: 'Empty liquid completely, rinse, crush flat to save space, and replace the plastic cap before tossing into the dry recyclable bin.',
    safetyWarnings: ['Do not burn or melt plastic bottles.', 'Discard contaminated bottles with hazardous chemicals in hazardous waste.'],
    tips: ['Keep bottle caps attached; modern recycling facilities sort and recycle HDPE caps alongside PET.'],
    verified: true,
    recyclabilityScore: 95,
    disposalMethod: 'Curbside Blue Bin / Recycling Drop-off'
  },
  {
    id: 'item-2',
    name: 'Lithium-Ion Phone Battery',
    aliases: ['phone battery', 'li-ion', 'rechargeable battery', 'power bank cell'],
    category: 'Hazardous',
    binColor: 'red',
    instructions: 'NEVER place in household bins or general recycling. Tape battery terminals with electrical tape to prevent short circuits and drop off at designated e-waste kiosk.',
    safetyWarnings: ['Severe fire risk if crushed in garbage trucks or landfills.', 'Puncturing may cause thermal runaway and toxic gas release.'],
    tips: ['Many electronics retailers offer free drop-off boxes for rechargeable batteries.'],
    verified: true,
    recyclabilityScore: 70,
    disposalMethod: 'Certified E-Waste Drop-off Center'
  },
  {
    id: 'item-3',
    name: 'Corrugated Cardboard Box',
    aliases: ['shipping box', 'amazon box', 'brown box', 'carton'],
    category: 'Dry Recyclable',
    binColor: 'blue',
    instructions: 'Remove excessive plastic shipping tape, flatten completely, and ensure box is dry and free from grease or food residues.',
    safetyWarnings: ['Greasy pizza boxes cannot be recycled into high-grade paper; compost the greasy bottom instead.'],
    tips: ['Bundle flattened boxes with twine or stack inside one box for clean roadside pickup.'],
    verified: true,
    recyclabilityScore: 98,
    disposalMethod: 'Curbside Blue Bin / Paper Mill Collection'
  },
  {
    id: 'item-4',
    name: 'Fruit Peels & Vegetable Scraps',
    aliases: ['banana peel', 'apple core', 'veggie trims', 'kitchen scraps'],
    category: 'Wet Organic',
    binColor: 'green',
    instructions: 'Collect in a breathable countertop compost pail. Empty into community compost or home vermicompost bin.',
    safetyWarnings: ['Avoid adding meat or dairy in simple backyard compost heaps to prevent pests.'],
    tips: ['Composting prevents anaerobic decomposition in landfills, directly eliminating methane emissions.'],
    verified: true,
    recyclabilityScore: 100,
    disposalMethod: 'Green Organics Bin / Composter'
  },
  {
    id: 'item-5',
    name: 'Fluorescent Tube / CFL Bulb',
    aliases: ['cfl', 'tubelight', 'mercury vapor lamp', 'fluorescent light'],
    category: 'Hazardous',
    binColor: 'red',
    instructions: 'Handle with extreme care to avoid breakage. Wrap securely in original packaging or bubble wrap and take to an authorized hazardous disposal site.',
    safetyWarnings: ['Contains toxic mercury vapor. If broken, ventilate room immediately for 15 minutes without vacuuming.'],
    tips: ['Switching to LED reduces your household energy draw by up to 80% without toxic mercury.'],
    verified: true,
    recyclabilityScore: 60,
    disposalMethod: 'Municipal Hazardous Waste Collection'
  },
  {
    id: 'item-6',
    name: 'Aluminum Beverage Can',
    aliases: ['soda can', 'beer can', 'tin can', 'aluminum can'],
    category: 'Dry Recyclable',
    binColor: 'blue',
    instructions: 'Rinse out remnants of beverage. Can be crushed or left intact for sorting.',
    safetyWarnings: ['Beware of sharp edges if crushed.'],
    tips: ['Aluminum is infinitely recyclable with zero loss of quality, saving 95% of energy vs raw bauxite mining.'],
    verified: true,
    recyclabilityScore: 100,
    disposalMethod: 'Curbside Blue Bin / Scrap Metal Buyback'
  },
  {
    id: 'item-7',
    name: 'Styrofoam / Expanded Polystyrene (EPS)',
    aliases: ['thermocol', 'polystyrene', 'foam packaging', 'takeout container'],
    category: 'Residual',
    binColor: 'black',
    instructions: 'Most curbside programs cannot process EPS foam due to low density and high contamination. Dispose in residual bin unless specialized drop-off exists.',
    safetyWarnings: ['Do not microwave or burn. Toxic fumes released upon combustion.'],
    tips: ['Request molded cardboard packaging from merchants whenever possible.'],
    verified: true,
    recyclabilityScore: 15,
    disposalMethod: 'General Non-Recyclable Waste'
  },
  {
    id: 'item-8',
    name: 'Glass Beverage Bottle',
    aliases: ['beer bottle', 'wine bottle', 'glass jar', 'soda glass'],
    category: 'Dry Recyclable',
    binColor: 'blue',
    instructions: 'Rinse clean. Remove metal lids (recycle metal lids separately). No need to peel paper labels.',
    safetyWarnings: ['Do not mix with broken window glass or Pyrex bakeware, which have different melting points.'],
    tips: ['Glass bottles can be washed and reused dozens of times before re-melting.'],
    verified: true,
    recyclabilityScore: 92,
    disposalMethod: 'Curbside Glass Bin / Deposit Return Machine'
  },
  {
    id: 'item-9',
    name: 'Old Smartphone & USB Cables',
    aliases: ['iphone', 'android', 'cellphone', 'charger cable'],
    category: 'E-Waste',
    binColor: 'yellow',
    instructions: 'Factory reset and wipe personal accounts. Separate any detachable cables. Deposit into certified urban e-waste container.',
    safetyWarnings: ['Prevent physical impact that could damage swollen batteries.'],
    tips: ['One metric ton of circuit boards yields more gold and silver than 10 metric tons of mined ore.'],
    verified: true,
    recyclabilityScore: 85,
    disposalMethod: 'UrbanLoop E-Waste Schedule'
  },
  {
    id: 'item-10',
    name: 'Coffee Grounds & Paper Filter',
    aliases: ['espresso puck', 'brewed coffee grounds', 'unbleached filter'],
    category: 'Wet Organic',
    binColor: 'green',
    instructions: 'Add directly to compost or scatter around acid-loving garden plants (hydrangeas, blueberries, tomatoes).',
    safetyWarnings: ['Ensure paper filter is free of synthetic plastic reinforcement fibers.'],
    tips: ['Coffee grounds are rich in nitrogen, boosting active fungal breakdown in soil.'],
    verified: true,
    recyclabilityScore: 100,
    disposalMethod: 'Green Organics Bin'
  },
  {
    id: 'item-11',
    name: 'Medicine Blister Pack (Foil + Plastic)',
    aliases: ['tablet strip', 'pill packet', 'capsule foil packaging'],
    category: 'Residual',
    binColor: 'black',
    instructions: 'Remove any unused tablets and hand unused medicine to pharmacy take-back programs. Place empty blister pack in residual waste.',
    safetyWarnings: ['Never flush expired antibiotics or hormones down the toilet; causes aquatic contamination.'],
    tips: ['Specialized pharmacy blister recyclers exist in select pilot metropolitan hubs.'],
    verified: true,
    recyclabilityScore: 20,
    disposalMethod: 'Non-Recyclable Trash / Pharmacy Take-Back'
  },
  {
    id: 'item-12',
    name: 'Aerosol Spray Can',
    aliases: ['deodorant spray', 'hair spray', 'air freshener can'],
    category: 'Hazardous',
    binColor: 'red',
    instructions: 'Ensure can is 100% empty by depressing nozzle until no hiss sounds. Do not puncture or crush yourself.',
    safetyWarnings: ['Pressurized cylinder can explode if exposed to heat or compacted while partially full.'],
    tips: ['If empty, some curbside programs accept them with scrap metals.'],
    verified: true,
    recyclabilityScore: 75,
    disposalMethod: 'Hazardous Collection if pressurized; Metal Bin if fully empty'
  }
];

export const DEMO_RECYCLING_REQUESTS: RecyclingRequest[] = [
  {
    id: 'REQ-8821',
    userId: 'user-01',
    userName: 'Kowshik V.',
    contactNumber: '+1 (555) 234-5678',
    address: 'Apt 4B, 128 Green Valley Blvd, Eco District',
    wasteType: 'Paper & Cardboard',
    estimatedKg: 14.5,
    status: 'ASSIGNED',
    collectorId: 'col-102',
    collectorName: 'Apex Green Recyclers (Rajesh K.)',
    scheduledDate: '2026-10-14',
    pickupTimeSlot: 'Morning (8AM - 12PM)',
    notes: '3 flattened double-wall cartons near door.',
    isDemo: true,
    createdAt: '2026-10-10T09:30:00Z',
    pointsAwarded: 45
  },
  {
    id: 'REQ-8820',
    userId: 'user-02',
    userName: 'Elena Rostova',
    contactNumber: '+1 (555) 345-6789',
    address: '77 Solar Crest Way, North Hill',
    wasteType: 'Rigid Plastics',
    estimatedKg: 8.2,
    status: 'COLLECTED',
    collectorId: 'col-105',
    collectorName: 'Urban CleanLoop Co-op',
    scheduledDate: '2026-10-09',
    pickupTimeSlot: 'Afternoon (12PM - 4PM)',
    notes: 'HDPE and PET separated in transparent sacks.',
    isDemo: true,
    createdAt: '2026-10-08T14:15:00Z',
    pointsAwarded: 50
  },
  {
    id: 'REQ-8819',
    userId: 'user-03',
    userName: 'Marcus Sterling',
    contactNumber: '+1 (555) 456-7890',
    address: '12 Metro Plaza, Suite 900',
    wasteType: 'Metals & Cans',
    estimatedKg: 22.0,
    status: 'PENDING',
    scheduledDate: '2026-10-15',
    pickupTimeSlot: 'Morning (8AM - 12PM)',
    notes: 'Aluminum beverage cans and tin packaging.',
    isDemo: true,
    createdAt: '2026-10-11T08:00:00Z'
  },
  {
    id: 'REQ-8818',
    userId: 'user-04',
    userName: 'Amina Al-Mansoor',
    contactNumber: '+1 (555) 567-8901',
    address: '304 Maple Leaf Terrace',
    wasteType: 'Glass',
    estimatedKg: 18.0,
    status: 'IN_TRANSIT',
    collectorId: 'col-102',
    collectorName: 'Apex Green Recyclers (Rajesh K.)',
    scheduledDate: '2026-10-12',
    pickupTimeSlot: 'Evening (4PM - 7PM)',
    notes: 'Separated clear and amber glass jars.',
    isDemo: true,
    createdAt: '2026-10-09T11:20:00Z'
  }
];

export const DEMO_EWASTE_FACILITIES: EWasteFacility[] = [
  {
    id: 'fac-1',
    name: 'CleanEarth Certified E-Stewards Facility',
    address: '1000 Industrial Circular Way, Tech Hub',
    certifications: ['R2v3 Certified', 'e-Stewards Platinum', 'ISO 14001'],
    acceptsBatteries: true,
    isDemoFacility: true,
    distanceKm: 4.8
  },
  {
    id: 'fac-2',
    name: 'Metro Refurb & Circuit Reclamation Center',
    address: '42 Reclamation Road, South Ward',
    certifications: ['WEEE Compliant', 'ISO 9001', 'Green Business Bureau'],
    acceptsBatteries: true,
    isDemoFacility: true,
    distanceKm: 7.2
  },
  {
    id: 'fac-3',
    name: 'EcoCycle Micro-Electronics Pilot Plant',
    address: '88 Innovation Boulevard',
    certifications: ['State Hazardous Waste Permitted', 'Zero Waste to Landfill'],
    acceptsBatteries: false,
    isDemoFacility: true,
    distanceKm: 11.5
  }
];

export const DEMO_EWASTE_REQUESTS: EWasteRequest[] = [
  {
    id: 'EW-4102',
    userId: 'user-01',
    userName: 'Kowshik V.',
    address: 'Apt 4B, 128 Green Valley Blvd, Eco District',
    contactNumber: '+1 (555) 234-5678',
    items: [
      {
        id: 'ew-i-1',
        deviceType: 'Laptop / Desktop',
        brandModel: 'Dell Inspiron 15 (2018 Motherboard intact)',
        condition: 'Dead/Damaged',
        batteryIncluded: true,
        dataWiped: true
      },
      {
        id: 'ew-i-2',
        deviceType: 'Smartphone / Tablet',
        brandModel: 'Samsung Galaxy S9 (Cracked display)',
        condition: 'Repairable',
        batteryIncluded: true,
        dataWiped: true
      }
    ],
    facilityId: 'fac-1',
    facilityName: 'CleanEarth Certified E-Stewards Facility',
    status: 'PICKUP_SCHEDULED',
    scheduledDate: '2026-10-18',
    certificateId: 'CERT-DEMO-99182',
    isDemo: true,
    createdAt: '2026-10-09T16:00:00Z'
  },
  {
    id: 'EW-4101',
    userId: 'user-05',
    userName: 'Sofia Chen',
    address: '512 Pinecrest Road',
    contactNumber: '+1 (555) 678-9012',
    items: [
      {
        id: 'ew-i-3',
        deviceType: 'Large Appliance',
        brandModel: 'Panasonic Inverter Microwave',
        condition: 'Dead/Damaged',
        batteryIncluded: false,
        dataWiped: true
      }
    ],
    facilityId: 'fac-2',
    facilityName: 'Metro Refurb & Circuit Reclamation Center',
    status: 'PROCESSED_VERIFIED',
    scheduledDate: '2026-10-05',
    certificateId: 'CERT-VERIFIED-22041',
    isDemo: true,
    createdAt: '2026-10-02T10:15:00Z'
  }
];

export const DEMO_USER_ACTIVITIES: UserActivity[] = [
  {
    id: 'act-1',
    userId: 'user-01',
    activityType: 'RECYCLING_COLLECTED',
    title: 'Paper Recycling Picked Up',
    description: '14.5 kg corrugated cardboard handed to Apex Green Recyclers.',
    pointsEarned: 45,
    co2SavedKg: 13.8,
    timestamp: '2026-10-10T11:45:00Z',
    isDemo: true
  },
  {
    id: 'act-2',
    userId: 'user-01',
    activityType: 'SOLAR_SIMULATED',
    title: 'Rooftop Solar Model Analyzed',
    description: 'Calculated 5.0 kW system generating 7,300 kWh/yr with 3.8-yr payback.',
    pointsEarned: 20,
    co2SavedKg: 0,
    timestamp: '2026-10-10T14:20:00Z',
    isDemo: true
  },
  {
    id: 'act-3',
    userId: 'user-01',
    activityType: 'GREEN_COMMUTE',
    title: 'Subway Commute Logged',
    description: 'Substituted 18 km car commute with Metro line — zero tailpipe emissions.',
    pointsEarned: 35,
    co2SavedKg: 2.8,
    timestamp: '2026-10-11T09:10:00Z',
    isDemo: true
  },
  {
    id: 'act-4',
    userId: 'user-01',
    activityType: 'WASTE_LOGGED',
    title: 'E-Waste Item Catalogued',
    description: 'Verified battery detachment instructions for 2 old mobile handsets.',
    pointsEarned: 15,
    co2SavedKg: 1.2,
    timestamp: '2026-10-11T10:05:00Z',
    isDemo: true
  }
];

export const DEMO_DASHBOARD_SUMMARY: DashboardSummary = {
  totalWasteDivertedKg: 142850,
  activeRecyclingRequests: 184,
  eWasteProcessedKg: 28420,
  cleanEnergySimulatedKwh: 685000,
  totalCO2SavedKg: 198400,
  activeCollectorsCount: 38,
  totalRegisteredUsers: 1420,
  recentActivities: DEMO_USER_ACTIVITIES,
  monthlyRecyclingTrend: [
    { month: 'May', recyclable: 14200, organic: 18400, ewaste: 2100 },
    { month: 'Jun', recyclable: 16100, organic: 19200, ewaste: 2450 },
    { month: 'Jul', recyclable: 18400, organic: 21500, ewaste: 3100 },
    { month: 'Aug', recyclable: 19800, organic: 22800, ewaste: 3800 },
    { month: 'Sep', recyclable: 22300, organic: 24900, ewaste: 4200 },
    { month: 'Oct', recyclable: 24100, organic: 26300, ewaste: 4950 }
  ],
  wasteDistribution: [
    { name: 'Organic Compostable', value: 42, color: '#10b981' },
    { name: 'Paper & Cardboard', value: 24, color: '#3b82f6' },
    { name: 'Rigid Plastics', value: 16, color: '#f59e0b' },
    { name: 'Metals & Cans', value: 10, color: '#8b5cf6' },
    { name: 'E-Waste & Batteries', value: 8, color: '#ef4444' }
  ]
};
