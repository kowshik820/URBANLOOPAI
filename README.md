# UrbanLoop AI 🌿⚡🚆
### *Waste Less. Power More. Move Smarter.*

An intelligent, serverless sustainability platform designed for smart circular cities. UrbanLoop AI unites household circular waste sorting, informal collector network logistics, rooftop clean solar forecasting, and multi-modal transit comparison on a resilient, budget-guarded AWS cloud architecture.

---

## 🚀 Live Demo & Quick Start

The application features a built-in **Dual Environment** system:
- **DEMO SANDBOX (Offline Ready):** Explore all 12 modules with pre-loaded realistic urban records without needing any AWS credentials or cloud infrastructure.
- **LIVE AWS MODE:** Connects directly to deployed Amazon API Gateway HTTP API v2 & Amazon DynamoDB On-Demand tables.

### 1. Launch Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏛️ System Architecture

```
                                      +------------------------------------+
                                      |        React 18 + Vite Frontend    |
                                      |   Tailwind CSS + Lucide + Recharts |
                                      |  (Demo Mode <--> Live AWS Mode)    |
                                      +-----------------+------------------+
                                                        |
                                                        v HTTPS
                                      +------------------------------------+
                                      |   Amazon API Gateway (HTTP API v2) |
                                      |    CORS, JWT/IAM Auth, Routing     |
                                      +-----------------+------------------+
                                                        |
                         +------------------------------+------------------------------+
                         |                              |                              |
                         v                              v                              v
             +-----------------------+      +-----------------------+      +-----------------------+
             | Waste & Request Fn    |      | Clean Energy & Mob Fn |      | Analytics & Admin Fn  |
             | AWS Lambda (Node.js)  |      | AWS Lambda (Node.js)  |      | AWS Lambda (Node.js)  |
             +-----------+-----------+      +-----------+-----------+      +-----------+-----------+
                         |                              |                              |
                         +------------------------------+------------------------------+
                                                        |
                                                        v
                                      +------------------------------------+
                                      |      Amazon DynamoDB (On-Demand)   |
                                      | Tables:                            |
                                      |  - urbanloop-recycling-requests    |
                                      |  - urbanloop-ewaste-requests       |
                                      |  - urbanloop-user-activity         |
                                      |  - urbanloop-waste-catalog         |
                                      +------------------------------------+
```

---

## 🌟 Core Pillars & Capabilities

1. **Intelligent Waste Segregation (`/segregation`):**
   - Search everyday items for bin assignments (Blue, Green, Red, Yellow, Black).
   - Prominent chemical and fire hazard warnings (e.g. Lithium batteries, CFLs, aerosol cans).
   - Clear distinction between verified municipal standards and illustrative guidance.
2. **Recycling Marketplace & Informal Sector (`/recycling`):**
   - Book doorstep collections for cardboard, plastics, glass, and metals.
   - Assign informal waste pickers and co-ops with fair compensation and weigh-in logging.
   - Status tracking from `PENDING` -> `ASSIGNED` -> `IN_TRANSIT` -> `COLLECTED`.
3. **Certified E-Waste Stewardship (`/ewaste`):**
   - Register obsolete phones, laptops, and appliances.
   - Chain-of-custody tracking with verified plant certificates (R2v3 / e-Stewards).
4. **Rooftop Solar PV Calculator (`/solar`):**
   - Empirical modeling factoring peak sun hours, system derate, tariff, and installation cost.
   - Real-time payback estimation, monthly generation profile, and tree planting equivalents.
5. **Multi-Modal Transit & EV Comparison (`/transport`):**
   - Compare emissions across petrol vehicles, EVs, buses, subway, and active cycling.
   - Earn eco points for verified low-carbon trips with duplicate award prevention.
6. **Municipal Oversight Console (`/admin`):**
   - City department view of active collections, recycler co-ops, and AWS cloud posture.

---

## 💰 AWS Budget Protection ($200 Credit Envelope)

- **Amazon API Gateway HTTP API (v2):** ~$1.00/million calls (70% cheaper than REST).
- **AWS Lambda (Node.js 20):** 256MB memory, 5s timeout, billed per millisecond.
- **Amazon DynamoDB (PAY_PER_REQUEST):** Zero hourly charges; scales down to $0 when idle.
- **No NAT Gateways, no EC2 instances, no provisioned database clusters.**

---

## 🧪 Testing & Verification

Run the automated test suite verifying mathematical calculations, emission factors, and validation schemas:
```bash
cd backend
npm run build
node --test dist/tests/suite.test.js
```

---

## 🛠️ Deployment Instructions

### Deploy Serverless Backend via AWS SAM
```bash
cd backend
npm run build
sam build
sam deploy --guided --stack-name urbanloop-backend
```

### Complete Teardown (Clean Removal)
```bash
sam delete --stack-name urbanloop-backend --no-prompts
```

---

## 📄 Documentation Links
- [Architecture Blueprint](file:///c:/Users/kowsh/OneDrive/Desktop/URBANLOOPAI/docs/ARCHITECTURE.md)
- [REST API Specification](file:///c:/Users/kowsh/OneDrive/Desktop/URBANLOOPAI/docs/API_SPEC.md)
- [Cost Control & Credit Guide](file:///c:/Users/kowsh/OneDrive/Desktop/URBANLOOPAI/docs/COST_OPTIMIZATION.md)
- [3-Minute Hackathon Presentation Script](file:///c:/Users/kowsh/OneDrive/Desktop/URBANLOOPAI/docs/DEMO_SCRIPT.md)
- [Known Limitations & Scope](file:///c:/Users/kowsh/OneDrive/Desktop/URBANLOOPAI/docs/LIMITATIONS.md)

---
Developed for the 2026 Sustainability Hackathon. Open source under MIT License.
