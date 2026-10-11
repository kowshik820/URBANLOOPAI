import {
  AppMode,
  WasteItem,
  RecyclingRequest,
  EWasteFacility,
  EWasteRequest,
  SolarCalculationInput,
  SolarCalculationResult,
  TransportCalculationResult,
  DashboardSummary,
  UserActivity,
  RequestStatus
} from '../types';
import {
  DEMO_WASTE_ITEMS,
  DEMO_RECYCLING_REQUESTS,
  DEMO_EWASTE_FACILITIES,
  DEMO_EWASTE_REQUESTS,
  DEMO_DASHBOARD_SUMMARY,
  DEMO_USER_ACTIVITIES
} from './demoData';

// API Configuration
const DEFAULT_AWS_API_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ApiStatus {
  online: boolean;
  mode: AppMode;
  apiUrl: string;
  latencyMs?: number;
  lastChecked?: string;
  errorMessage?: string;
}

class ApiService {
  private mode: AppMode = (localStorage.getItem('urbanloop_app_mode') as AppMode) || 'DEMO';
  private apiUrl: string = DEFAULT_AWS_API_URL;
  private localRecyclingRequests: RecyclingRequest[] = [];
  private localEWasteRequests: EWasteRequest[] = [];
  private localActivities: UserActivity[] = [];

  constructor() {
    this.initLocalStorage();
  }

  private initLocalStorage() {
    try {
      const storedRecycling = localStorage.getItem('urbanloop_demo_recycling');
      this.localRecyclingRequests = storedRecycling
        ? JSON.parse(storedRecycling)
        : [...DEMO_RECYCLING_REQUESTS];

      const storedEWaste = localStorage.getItem('urbanloop_demo_ewaste');
      this.localEWasteRequests = storedEWaste
        ? JSON.parse(storedEWaste)
        : [...DEMO_EWASTE_REQUESTS];

      const storedAct = localStorage.getItem('urbanloop_demo_activities');
      this.localActivities = storedAct
        ? JSON.parse(storedAct)
        : [...DEMO_USER_ACTIVITIES];
    } catch {
      this.localRecyclingRequests = [...DEMO_RECYCLING_REQUESTS];
      this.localEWasteRequests = [...DEMO_EWASTE_REQUESTS];
      this.localActivities = [...DEMO_USER_ACTIVITIES];
    }
  }

  public getMode(): AppMode {
    return this.mode;
  }

  public setMode(newMode: AppMode) {
    this.mode = newMode;
    localStorage.setItem('urbanloop_app_mode', newMode);
  }

  public setApiUrl(url: string) {
    this.apiUrl = url.trim().replace(/\/$/, '');
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  // --- HEALTH CHECK ---
  public async checkHealth(): Promise<ApiStatus> {
    const startTime = Date.now();
    if (this.mode === 'DEMO') {
      return {
        online: true,
        mode: 'DEMO',
        apiUrl: 'Local In-Memory Sandbox',
        latencyMs: 12,
        lastChecked: new Date().toISOString()
      };
    }

    if (!this.apiUrl) {
      return {
        online: false,
        mode: 'AWS',
        apiUrl: 'Not Configured (Pending deployment output)',
        errorMessage: 'AWS API Gateway URL is not yet configured. Please deploy backend or switch to DEMO mode.',
        lastChecked: new Date().toISOString()
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const latency = Date.now() - startTime;
      if (response.ok) {
        return {
          online: true,
          mode: 'AWS',
          apiUrl: this.apiUrl,
          latencyMs: latency,
          lastChecked: new Date().toISOString()
        };
      } else {
        return {
          online: false,
          mode: 'AWS',
          apiUrl: this.apiUrl,
          latencyMs: latency,
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          lastChecked: new Date().toISOString()
        };
      }
    } catch (err: any) {
      return {
        online: false,
        mode: 'AWS',
        apiUrl: this.apiUrl,
        latencyMs: Date.now() - startTime,
        errorMessage: err.message || 'Network error connecting to AWS API Gateway.',
        lastChecked: new Date().toISOString()
      };
    }
  }

  // --- DASHBOARD SUMMARY ---
  public async getDashboardSummary(): Promise<DashboardSummary> {
    if (this.mode === 'DEMO') {
      // Calculate dynamic summaries
      const totalRecyclingKg = this.localRecyclingRequests.reduce((acc, curr) => acc + curr.estimatedKg, 0);
      const activeRequests = this.localRecyclingRequests.filter(r => r.status !== 'COLLECTED' && r.status !== 'CANCELLED').length;
      return {
        ...DEMO_DASHBOARD_SUMMARY,
        totalWasteDivertedKg: Math.round(DEMO_DASHBOARD_SUMMARY.totalWasteDivertedKg + totalRecyclingKg),
        activeRecyclingRequests: activeRequests,
        recentActivities: [...this.localActivities].slice(0, 6)
      };
    }

    const response = await fetch(`${this.apiUrl}/api/dashboard`);
    if (!response.ok) {
      throw new Error(`AWS API Error (${response.status}): Failed to load dashboard metrics.`);
    }
    return response.json();
  }

  // --- WASTE CATALOG ---
  public async getWasteItems(): Promise<WasteItem[]> {
    if (this.mode === 'DEMO') {
      return DEMO_WASTE_ITEMS;
    }

    const response = await fetch(`${this.apiUrl}/api/waste-items`);
    if (!response.ok) {
      throw new Error(`AWS API Error (${response.status}): Failed to fetch waste catalog.`);
    }
    return response.json();
  }

  // --- RECYCLING REQUESTS ---
  public async getRecyclingRequests(): Promise<RecyclingRequest[]> {
    if (this.mode === 'DEMO') {
      return [...this.localRecyclingRequests];
    }

    const response = await fetch(`${this.apiUrl}/api/recycling`);
    if (!response.ok) {
      throw new Error(`AWS API Error (${response.status}): Failed to retrieve recycling collection requests.`);
    }
    return response.json();
  }

  public async createRecyclingRequest(data: Omit<RecyclingRequest, 'id' | 'createdAt' | 'status'>): Promise<RecyclingRequest> {
    // Basic frontend verification
    if (!data.userName?.trim()) throw new Error('Resident name is required');
    if (!data.address?.trim()) throw new Error('Pickup address is required');
    if (!data.estimatedKg || data.estimatedKg <= 0) throw new Error('Estimated weight must be greater than 0 kg');

    if (this.mode === 'DEMO') {
      const newReq: RecyclingRequest = {
        ...data,
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PENDING',
        isDemo: true,
        createdAt: new Date().toISOString(),
      };
      this.localRecyclingRequests.unshift(newReq);
      localStorage.setItem('urbanloop_demo_recycling', JSON.stringify(this.localRecyclingRequests));

      // Log activity
      this.logLocalActivity({
        userId: data.userId || 'user-01',
        activityType: 'RECYCLING_COLLECTED',
        title: `Recycling Pickup Scheduled: ${data.wasteType}`,
        description: `Pickup booked for ${data.estimatedKg} kg of ${data.wasteType} at ${data.address}`,
        pointsEarned: Math.round(data.estimatedKg * 2),
        co2SavedKg: Number((data.estimatedKg * 0.95).toFixed(1))
      });

      return newReq;
    }

    const response = await fetch(`${this.apiUrl}/api/recycling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `AWS API Error (${response.status}): Failed to submit recycling request.`);
    }
    return response.json();
  }

  public async updateRecyclingStatus(id: string, status: RequestStatus, collectorName?: string): Promise<RecyclingRequest> {
    if (this.mode === 'DEMO') {
      const index = this.localRecyclingRequests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Recycling request not found');
      
      this.localRecyclingRequests[index] = {
        ...this.localRecyclingRequests[index],
        status,
        collectorName: collectorName || this.localRecyclingRequests[index].collectorName || 'Urban Green Fleet',
        updatedAt: new Date().toISOString(),
        pointsAwarded: status === 'COLLECTED' ? Math.round(this.localRecyclingRequests[index].estimatedKg * 3) : undefined
      };
      localStorage.setItem('urbanloop_demo_recycling', JSON.stringify(this.localRecyclingRequests));
      return this.localRecyclingRequests[index];
    }

    const response = await fetch(`${this.apiUrl}/api/recycling/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, collectorName })
    });
    if (!response.ok) {
      throw new Error(`AWS API Error (${response.status}): Failed to update status.`);
    }
    return response.json();
  }

  // --- E-WASTE REQUESTS ---
  public async getEWasteFacilities(): Promise<EWasteFacility[]> {
    return DEMO_EWASTE_FACILITIES;
  }

  public async getEWasteRequests(): Promise<EWasteRequest[]> {
    if (this.mode === 'DEMO') {
      return [...this.localEWasteRequests];
    }

    const response = await fetch(`${this.apiUrl}/api/ewaste`);
    if (!response.ok) {
      throw new Error(`AWS API Error (${response.status}): Failed to load e-waste requests.`);
    }
    return response.json();
  }

  public async createEWasteRequest(data: Omit<EWasteRequest, 'id' | 'createdAt' | 'status'>): Promise<EWasteRequest> {
    if (!data.items || data.items.length === 0) throw new Error('At least one electronic device must be registered');

    if (this.mode === 'DEMO') {
      const newReq: EWasteRequest = {
        ...data,
        id: `EW-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PICKUP_SCHEDULED',
        certificateId: `CERT-DEMO-${Math.floor(10000 + Math.random() * 90000)}`,
        isDemo: true,
        createdAt: new Date().toISOString()
      };
      this.localEWasteRequests.unshift(newReq);
      localStorage.setItem('urbanloop_demo_ewaste', JSON.stringify(this.localEWasteRequests));

      this.logLocalActivity({
        userId: data.userId || 'user-01',
        activityType: 'EWASTE_SCHEDULED',
        title: `E-Waste Registered: ${data.items.length} Item(s)`,
        description: `Routed to ${data.facilityName} for safe material extraction`,
        pointsEarned: 50,
        co2SavedKg: 8.5
      });

      return newReq;
    }

    const response = await fetch(`${this.apiUrl}/api/ewaste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`AWS API Error (${response.status}): Failed to register e-waste disposal.`);
    }
    return response.json();
  }

  // --- SOLAR CALCULATOR ---
  public calculateSolar(input: SolarCalculationInput): SolarCalculationResult {
    const { capacityKw, peakSunHours, performanceRatio, gridTariffPerKwh, installationCost } = input;

    // Safety checks for invalid inputs & division by zero
    const safeCapacity = Math.max(0, capacityKw || 0);
    const safeSunHours = Math.max(0, peakSunHours || 0);
    const safePR = Math.min(1, Math.max(0.1, performanceRatio || 0.78));
    const safeTariff = Math.max(0, gridTariffPerKwh || 0);
    const safeCost = Math.max(0, installationCost || 0);

    const dailyKwh = safeCapacity * safeSunHours * safePR;
    const annualKwh = dailyKwh * 365;
    const annualSavingsUsd = annualKwh * safeTariff;
    const lifetimeSavingsUsd = annualSavingsUsd * 25 - safeCost;

    // Guard against zero division
    const simplePaybackYears = annualSavingsUsd > 0
      ? Number((safeCost / annualSavingsUsd).toFixed(1))
      : 0;

    // 0.82 kg CO2 avoided per solar kWh generated (average regional grid displaced)
    const co2OffsetKgPerYear = Number((annualKwh * 0.82).toFixed(1));
    const equivalentTreesPlanted = Math.round(co2OffsetKgPerYear / 21); // ~21kg CO2 absorbed per tree/year

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Seasonal variation factor roughly matching hemispheric sunshine
    const seasonalWeights = [0.75, 0.82, 0.95, 1.10, 1.20, 1.25, 1.22, 1.15, 1.02, 0.90, 0.80, 0.72];
    
    const monthlyBreakdown = months.map((m, idx) => {
      const monthKwh = (annualKwh / 12) * seasonalWeights[idx];
      return {
        month: m,
        kwh: Math.round(monthKwh),
        savingsUsd: Number((monthKwh * safeTariff).toFixed(2))
      };
    });

    return {
      dailyGenerationKwh: Number(dailyKwh.toFixed(2)),
      annualGenerationKwh: Math.round(annualKwh),
      annualSavingsUsd: Math.round(annualSavingsUsd),
      lifetimeSavingsUsd: Math.round(lifetimeSavingsUsd),
      simplePaybackYears,
      co2OffsetKgPerYear,
      equivalentTreesPlanted,
      monthlyBreakdown,
      assumptions: [
        `System derating/performance ratio modeled at ${(safePR * 100).toFixed(0)}% (soiling, inverter loss, wire loss).`,
        `Average solar irradiance: ${safeSunHours.toFixed(1)} peak sun hours/day.`,
        `Electricity grid displacement factor: 0.82 kg CO2e per kWh generated.`,
        `Assumes net metering or full direct self-consumption at $${safeTariff.toFixed(2)}/kWh.`,
        `Module degradation assumption: ~0.5% per annum across a 25-year lifespan.`
      ]
    };
  }

  // --- TRANSPORTATION CALCULATOR ---
  public calculateTransport(distanceKm: number, tripsPerMonth: number): TransportCalculationResult {
    const dist = Math.max(0.1, distanceKm || 1);
    const trips = Math.max(1, tripsPerMonth || 1);
    const monthlyDist = dist * trips;
    const annualDist = monthlyDist * 12;

    // Grams of CO2e per passenger-kilometer (EPA & IPCC standards)
    const emissionFactors: Record<string, { title: string, gPerKm: number, costPerKm: number, zero: boolean }> = {
      petrol_car: { title: 'Gasoline / Petrol Car', gPerKm: 192, costPerKm: 0.28, zero: false },
      ev_car: { title: 'Battery Electric Vehicle (EV)', gPerKm: 53, costPerKm: 0.08, zero: false },
      city_bus: { title: 'Municipal Transit Bus', gPerKm: 82, costPerKm: 0.12, zero: false },
      metro_train: { title: 'Electric Metro / Subway', gPerKm: 28, costPerKm: 0.10, zero: false },
      bicycle: { title: 'Bicycle / E-Bike', gPerKm: 0, costPerKm: 0.02, zero: true },
      walking: { title: 'Walking / Active Pedestrian', gPerKm: 0, costPerKm: 0.00, zero: true },
    };

    const options = Object.entries(emissionFactors).map(([mode, data]) => {
      const tripEmissionsKg = Number(((dist * data.gPerKm) / 1000).toFixed(2));
      const annualEmissionsKg = Number(((annualDist * data.gPerKm) / 1000).toFixed(1));
      const monthlyCost = Number((monthlyDist * data.costPerKm).toFixed(2));

      // Sustainability score from 0 to 100 (inverse of emission vs petrol)
      const maxG = 192;
      const score = Math.round(((maxG - data.gPerKm) / maxG) * 100);

      // Green points: Awarded for choosing low-carbon travel
      const points = data.zero ? Math.round(dist * 5) : score > 50 ? Math.round(dist * 2) : 0;

      return {
        mode: mode as any,
        title: data.title,
        emissionsGramsPerKm: data.gPerKm,
        tripEmissionsKg,
        annualEmissionsKg,
        monthlyCostEstimate: monthlyCost,
        sustainabilityScore: score,
        greenPointsAwarded: points,
        isZeroEmission: data.zero
      };
    });

    const petrolAnnual = options.find(o => o.mode === 'petrol_car')!.annualEmissionsKg;
    const metroAnnual = options.find(o => o.mode === 'metro_train')!.annualEmissionsKg;

    return {
      distanceKm: dist,
      tripsPerMonth: trips,
      options,
      annualSavingsVsPetrolKgCO2: Number((petrolAnnual - metroAnnual).toFixed(1)),
      recommendedMode: dist <= 3 ? 'Bicycle / Walking' : dist <= 15 ? 'Electric Metro / Subway' : 'Battery Electric Vehicle (EV)'
    };
  }

  // --- LOG ACTIVITY ---
  public logLocalActivity(activity: Omit<UserActivity, 'id' | 'timestamp' | 'isDemo'>) {
    const newAct: UserActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      isDemo: this.mode === 'DEMO'
    };
    this.localActivities.unshift(newAct);
    localStorage.setItem('urbanloop_demo_activities', JSON.stringify(this.localActivities));
  }
}

export const api = new ApiService();
