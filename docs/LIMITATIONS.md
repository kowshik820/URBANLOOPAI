# UrbanLoop AI — Known System Limitations & Future Work

To maintain scientific integrity and realistic environmental reporting, the following technical and operational limitations are documented:

---

## 1. Waste Segregation & Local Acceptance
- **Regional Bin Variations:** Bin color standards vary between municipalities (e.g., green for organics vs blue for recycling in certain states, or dual-stream vs single-stream MRFs). The application marks baseline rules clearly and advises checking municipal portals.
- **Physical Contamination Detection:** The current version utilizes catalog lookup and manual classification. Future phases can integrate an edge camera model (e.g., AWS Lookout for Vision) to scan soiled packaging before container disposal.

---

## 2. Solar Photovoltaic Modeling
- **Shading & Horizon Angle:** The algorithm uses empirical derate coefficients (PR ~ 78%) and peak sun hours, but does not currently perform 3D LiDAR roof pitch or localized tree shadow ray-tracing.
- **Dynamic Utility Time-of-Use (TOU) Rates:** Energy bill offsets assume flat or net-metered rates ($/kWh). Real-world tiered peak vs off-peak rates will vary payback by ±15%.

---

## 3. Transportation Emissions
- **Grid Carbon Intensity:** Electric Vehicle (EV) emissions are calculated using the regional grid baseline (53 g CO2e/km). In regions powered predominantly by hydro or nuclear, EV emissions are lower; in coal-heavy grids, they may be slightly higher.
- **Transit Occupancy Fluctuations:** Bus and metro figures assume standard average fleet occupancies during commute hours (15 passengers/bus, 600 passengers/train).

---

## 4. Informal Collector Co-op Logistical Boundaries
- **Digital Divide:** Informal waste collectors require an SMS fallback or lightweight mobile interface to confirm pickups in areas with intermittent connectivity.
- **Payment Settlement:** Points are logged in the user ledger; physical monetary cash-outs would require integration with municipal UPI/Stripe payouts and verified weighing scales.
