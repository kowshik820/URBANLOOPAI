# UrbanLoop AI — Hackathon 3-Minute Judge Demonstration Script

**Theme:** Urban Sustainability, Circular Economy & Clean Tech  
**Tagline:** *"Waste Less. Power More. Move Smarter."*

---

## Act 1: The Problem & The Solution (0:00 - 0:45)
1. **Open Landing Page (`http://localhost:5173/`)**:
   - *"Good morning judges. Most cities operate with fragmented sustainability systems: residents don't know how to segregate hazardous waste from recyclables, informal waste workers are unintegrated, rooftop solar potential is guesswork, and transit options aren't incentivized.*
   - *"Welcome to **UrbanLoop AI** — an end-to-end circular platform connecting residents, informal recycling co-ops, clean solar modeling, and green transit on an AWS serverless architecture."*
2. **Highlight Environment Badge in Header**:
   - Point to the **DEMO SANDBOX / AWS CLOUD MODE** badge.
   - Explain that judges can test the full platform immediately offline or seamlessly connect to the deployed AWS API Gateway.

---

## Act 2: Waste Segregation & Informal Collector Co-op (0:45 - 1:45)
1. **Navigate to Waste Segregation (`/segregation`)**:
   - Type `"battery"` in the search bar.
   - Show how the **Lithium-Ion Phone Battery** highlights with red hazardous bin color, critical safety warnings (fire risk, no curbside drop), and verified disposal standard.
   - Contrast with verified vs illustrative data tags.
2. **Navigate to Recycling Marketplace (`/recycling`)**:
   - Click **"Book Doorstep Pickup"**.
   - Input 12 kg of cardboard. Submit request.
   - Use the fast Persona Switcher in the top right to switch from **Resident (Kowshik)** to **Collector (Rajesh K. - Apex Recyclers)**.
   - Click **"Accept Pickup"** -> **"Start Transit"** -> **"Confirm Collected"**.
   - Show the points automatically credited to the resident and recorded on the municipal audit ledger!
3. **Navigate to E-Waste (`/ewaste`)**:
   - Show certified e-Stewards and R2v3 facilities.
   - Show how verified certificates are generated only upon inbound weigh-in — zero unsubstantiated claims.

---

## Act 3: Clean Solar, Transit & City Analytics (1:45 - 2:45)
1. **Navigate to Rooftop Solar (`/solar`)**:
   - Adjust the **PV Array Capacity** slider to 6.5 kW.
   - Watch the generation curve, annual savings ($1,200+), 4.2-year payback, and tree absorption equivalent calculate in real time.
   - Click **"Log Simulation to Eco Profile"** to earn 25 eco points.
2. **Navigate to Transit (`/transport`)**:
   - Set 15 km commute distance.
   - Compare petrol emissions (192 g/km) against electric subway (28 g/km) and cycling (0 g).
   - Click **"Log Trip"** for Metro to claim eco points (demonstrating duplicate claim prevention).
3. **Navigate to City Dashboard (`/dashboard`)**:
   - Display real-time aggregated metrics: 142.8 tonnes diverted, 685 MWh simulated, and recent community activity feed.

---

## Act 4: AWS Architecture & Closing (2:45 - 3:00)
- *"All of this runs on Amazon API Gateway HTTP API, Node.js 20 Lambda functions, and DynamoDB On-Demand — resulting in $0 idle cost, making it feasible for student developers and scalable for millions of residents.*
- *UrbanLoop AI: Waste Less. Power More. Move Smarter. Thank you!"*
