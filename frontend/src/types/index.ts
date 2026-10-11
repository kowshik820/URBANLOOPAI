export type AppMode = 'DEMO' | 'AWS';

export type UserRole = 'resident' | 'collector' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  points: number;
  phone?: string;
  address?: string;
  createdAt: string;
}

export type WasteCategory =
  | 'Dry Recyclable'
  | 'Wet Organic'
  | 'Hazardous'
  | 'E-Waste'
  | 'Sanitary'
  | 'Residual';

export interface WasteItem {
  id: string;
  name: string;
  aliases: string[];
  category: WasteCategory;
  binColor: 'blue' | 'green' | 'red' | 'yellow' | 'black';
  instructions: string;
  safetyWarnings: string[];
  tips: string[];
  verified: boolean;
  recyclabilityScore: number; // 0 - 100
  disposalMethod: string;
}

export type RequestStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'COLLECTED' | 'CANCELLED';

export interface RecyclingRequest {
  id: string;
  userId: string;
  userName: string;
  contactNumber: string;
  address: string;
  wasteType: 'Paper & Cardboard' | 'Rigid Plastics' | 'Metals & Cans' | 'Glass' | 'Multi-Material';
  estimatedKg: number;
  status: RequestStatus;
  collectorId?: string;
  collectorName?: string;
  scheduledDate: string;
  pickupTimeSlot: 'Morning (8AM - 12PM)' | 'Afternoon (12PM - 4PM)' | 'Evening (4PM - 7PM)';
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt?: string;
  pointsAwarded?: number;
}

export interface EWasteItem {
  id: string;
  deviceType: 'Smartphone / Tablet' | 'Laptop / Desktop' | 'Battery / Powerbank' | 'Large Appliance' | 'Cables & Accessories';
  brandModel: string;
  condition: 'Working' | 'Repairable' | 'Dead/Damaged';
  batteryIncluded: boolean;
  dataWiped: boolean;
}

export interface EWasteFacility {
  id: string;
  name: string;
  address: string;
  certifications: string[];
  acceptsBatteries: boolean;
  isDemoFacility: boolean;
  distanceKm: number;
}

export interface EWasteRequest {
  id: string;
  userId: string;
  userName: string;
  address: string;
  contactNumber: string;
  items: EWasteItem[];
  facilityId: string;
  facilityName: string;
  status: 'REGISTERED' | 'PICKUP_SCHEDULED' | 'RECEIVED_AT_FACILITY' | 'PROCESSED_VERIFIED';
  scheduledDate: string;
  certificateId?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface SolarCalculationInput {
  capacityKw: number;
  peakSunHours: number;
  performanceRatio: number; // typically 0.75 - 0.82
  gridTariffPerKwh: number; // in USD ($/kWh)
  installationCost: number; // in USD
}

export interface SolarCalculationResult {
  dailyGenerationKwh: number;
  annualGenerationKwh: number;
  annualSavingsUsd: number;
  lifetimeSavingsUsd: number; // 25 years
  simplePaybackYears: number;
  co2OffsetKgPerYear: number;
  equivalentTreesPlanted: number;
  monthlyBreakdown: {
    month: string;
    kwh: number;
    savingsUsd: number;
  }[];
  assumptions: string[];
}

export type TransportMode = 'petrol_car' | 'ev_car' | 'city_bus' | 'metro_train' | 'bicycle' | 'walking';

export interface TransportComparisonItem {
  mode: TransportMode;
  title: string;
  emissionsGramsPerKm: number;
  tripEmissionsKg: number;
  annualEmissionsKg: number;
  monthlyCostEstimate: number;
  sustainabilityScore: number;
  greenPointsAwarded: number;
  isZeroEmission: boolean;
}

export interface TransportCalculationResult {
  distanceKm: number;
  tripsPerMonth: number;
  options: TransportComparisonItem[];
  annualSavingsVsPetrolKgCO2: number;
  recommendedMode: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'WASTE_LOGGED' | 'RECYCLING_COLLECTED' | 'EWASTE_SCHEDULED' | 'SOLAR_SIMULATED' | 'GREEN_COMMUTE';
  title: string;
  description: string;
  pointsEarned: number;
  co2SavedKg: number;
  timestamp: string;
  isDemo?: boolean;
}

export interface DashboardSummary {
  totalWasteDivertedKg: number;
  activeRecyclingRequests: number;
  eWasteProcessedKg: number;
  cleanEnergySimulatedKwh: number;
  totalCO2SavedKg: number;
  activeCollectorsCount: number;
  totalRegisteredUsers: number;
  recentActivities: UserActivity[];
  monthlyRecyclingTrend: {
    month: string;
    recyclable: number;
    organic: number;
    ewaste: number;
  }[];
  wasteDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
}
