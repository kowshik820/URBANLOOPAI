# UrbanLoop AI — Serverless API Specification

**Base URL (Live Cloud):** `https://{api-id}.execute-api.{region}.amazonaws.com`  
**Base URL (Demo Sandbox):** In-Memory / Local Storage Simulation  
**Format:** JSON  
**Auth Scheme:** Bearer JWT / Cognito Claims / Identity Headers

---

## 1. System Health

### `GET /health`
Returns operational health, runtime uptime, and active AWS region.
- **Response `200 OK`**:
```json
{
  "status": "HEALTHY",
  "service": "UrbanLoop AI Serverless Backend",
  "region": "us-east-1",
  "timestamp": "2026-10-11T05:35:00.000Z",
  "uptimeSeconds": 1420,
  "version": "1.0.0",
  "environment": "AWS Serverless Production"
}
```

---

## 2. City Sustainability Dashboard

### `GET /api/dashboard`
Aggregates municipal recycling diversion, certified e-waste, solar modeling, and CO2 abatement.
- **Response `200 OK`**:
```json
{
  "totalWasteDivertedKg": 142850,
  "activeRecyclingRequests": 184,
  "eWasteProcessedKg": 28420,
  "cleanEnergySimulatedKwh": 685000,
  "totalCO2SavedKg": 198400,
  "activeCollectorsCount": 38,
  "totalRegisteredUsers": 1420,
  "recentActivities": [],
  "monthlyRecyclingTrend": [
    { "month": "May", "recyclable": 14200, "organic": 18400, "ewaste": 2100 }
  ],
  "wasteDistribution": [
    { "name": "Organic Compostable", "value": 42, "color": "#10b981" }
  ]
}
```

---

## 3. Waste Classification Catalog

### `GET /api/waste-items`
Lists verified and illustrative waste items with disposal methods and safety warnings.

### `GET /api/waste-items/{id}`
Returns details for a single waste item.
- **Response `200 OK`**:
```json
{
  "id": "item-2",
  "name": "Lithium-Ion Phone Battery",
  "aliases": ["phone battery", "li-ion"],
  "category": "Hazardous",
  "binColor": "red",
  "instructions": "Tape terminals with non-conductive electrical tape...",
  "safetyWarnings": ["Severe fire risk if crushed in landfills."],
  "verified": true,
  "recyclabilityScore": 70,
  "disposalMethod": "Certified E-Waste Drop-off Center"
}
```

---

## 4. Recycling Requests & Informal Recyclers

### `GET /api/recycling`
Lists active and past collection requests.

### `POST /api/recycling`
Creates a new doorstep recycling collection request.
- **Request Body**:
```json
{
  "userName": "Kowshik V.",
  "contactNumber": "+1 (555) 234-5678",
  "address": "128 Green Valley Blvd, Eco District",
  "wasteType": "Paper & Cardboard",
  "estimatedKg": 14.5,
  "scheduledDate": "2026-10-14",
  "pickupTimeSlot": "Morning (8AM - 12PM)",
  "notes": "Flattened cardboard boxes"
}
```
- **Response `201 Created`**: Returns request object with generated ID and status `PENDING`.

### `PATCH /api/recycling/{id}`
Updates pickup status (`ASSIGNED`, `IN_TRANSIT`, `COLLECTED`) and assigns collectors.
- **Request Body**:
```json
{
  "status": "COLLECTED",
  "collectorName": "Apex Green Recyclers (Rajesh K.)"
}
```

---

## 5. Certified E-Waste Disposal

### `GET /api/ewaste`
Lists e-waste registration batches.

### `POST /api/ewaste`
Registers electronic devices with certified disposal facilities.
- **Request Body**:
```json
{
  "userName": "Kowshik V.",
  "address": "128 Green Valley Blvd",
  "contactNumber": "+1 (555) 234-5678",
  "facilityId": "fac-1",
  "facilityName": "CleanEarth Certified E-Stewards Facility",
  "items": [
    {
      "id": "i-1",
      "deviceType": "Smartphone / Tablet",
      "brandModel": "iPhone 11 (Cracked display)",
      "condition": "Repairable",
      "batteryIncluded": true,
      "dataWiped": true
    }
  ]
}
```

---

## 6. Clean Energy & Transit Modeling

### `POST /api/solar/calculate`
Calculates rooftop photovoltaic yield, annual savings, and payback period.
- **Request Body**:
```json
{
  "capacityKw": 5.0,
  "peakSunHours": 4.8,
  "performanceRatio": 0.78,
  "gridTariffPerKwh": 0.16,
  "installationCost": 7500
}
```

### `POST /api/transport/calculate`
Calculates comparative emissions across petrol, EV, transit bus, subway, and cycling.
- **Request Body**:
```json
{
  "distanceKm": 14,
  "tripsPerMonth": 22
}
```

### `POST /api/transport/log-trip`
Logs green commute and increments eco points ledger.
