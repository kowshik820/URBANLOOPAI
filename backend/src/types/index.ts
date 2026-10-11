export interface WasteItemRecord {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  binColor: string;
  instructions: string;
  safetyWarnings: string[];
  tips: string[];
  verified: boolean;
  recyclabilityScore: number;
  disposalMethod: string;
}

export interface RecyclingRequestRecord {
  id: string;
  userId: string;
  userName: string;
  contactNumber: string;
  address: string;
  wasteType: string;
  estimatedKg: number;
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'COLLECTED' | 'CANCELLED';
  collectorId?: string;
  collectorName?: string;
  scheduledDate: string;
  pickupTimeSlot: string;
  notes?: string;
  pointsAwarded?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface EWasteRequestRecord {
  id: string;
  userId: string;
  userName: string;
  contactNumber: string;
  address: string;
  items: {
    id: string;
    deviceType: string;
    brandModel: string;
    condition: string;
    batteryIncluded: boolean;
    dataWiped: boolean;
  }[];
  facilityId: string;
  facilityName: string;
  status: 'REGISTERED' | 'PICKUP_SCHEDULED' | 'RECEIVED_AT_FACILITY' | 'PROCESSED_VERIFIED';
  scheduledDate: string;
  certificateId?: string;
  createdAt: string;
}

export interface UserActivityRecord {
  id: string;
  userId: string;
  activityType: string;
  title: string;
  description: string;
  pointsEarned: number;
  co2SavedKg: number;
  timestamp: string;
}
