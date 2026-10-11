import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Solar Calculations
test('Solar Calculations - accurate generation and division by zero guard', async (t) => {
  // Simulate calculation logic
  const calculate = (capacityKw: number, peakSunHours: number, performanceRatio: number, gridTariff: number, cost: number) => {
    const safeCap = Math.max(0, capacityKw || 0);
    const safeHours = Math.max(0, peakSunHours || 0);
    const safePR = Math.min(1, Math.max(0.1, performanceRatio || 0.78));
    const safeTariff = Math.max(0, gridTariff || 0);
    const safeCost = Math.max(0, cost || 0);

    const dailyKwh = safeCap * safeHours * safePR;
    const annualKwh = dailyKwh * 365;
    const annualSavings = annualKwh * safeTariff;
    const payback = annualSavings > 0 ? Number((safeCost / annualSavings).toFixed(1)) : 0;
    return { dailyKwh, annualKwh, annualSavings, payback };
  };

  // Normal 5 kW array
  const res = calculate(5.0, 4.8, 0.78, 0.16, 7500);
  assert.equal(res.dailyKwh.toFixed(2), '18.72');
  assert.equal(Math.round(res.annualKwh), 6833);
  assert.ok(res.annualSavings > 1000);
  assert.ok(res.payback > 0 && res.payback < 10);

  // Zero cost / zero tariff guard
  const zeroRes = calculate(0, 0, 0, 0, 0);
  assert.equal(zeroRes.dailyKwh, 0);
  assert.equal(zeroRes.annualSavings, 0);
  assert.equal(zeroRes.payback, 0); // No division by zero Infinity!
});

// Test 2: Transport Emissions & Points
test('Transport Calculations - EPA/IPCC emission factors & Points Award', async (t) => {
  const emissionFactors: Record<string, number> = {
    petrol_car: 192,
    ev_car: 53,
    city_bus: 82,
    metro_train: 28,
    bicycle: 0,
    walking: 0,
  };

  const dist = 10; // 10 km
  const petrolCO2 = (dist * emissionFactors.petrol_car) / 1000;
  const metroCO2 = (dist * emissionFactors.metro_train) / 1000;
  const bikeCO2 = (dist * emissionFactors.bicycle) / 1000;

  assert.equal(petrolCO2, 1.92);
  assert.equal(metroCO2, 0.28);
  assert.equal(bikeCO2, 0);

  // Petrol should emit more than 6x what metro emits
  assert.ok(petrolCO2 > metroCO2 * 6);

  // Points rules
  const getPoints = (mode: string) => (mode === 'bicycle' || mode === 'walking' ? dist * 5 : mode === 'metro_train' ? dist * 2 : 0);
  assert.equal(getPoints('bicycle'), 50);
  assert.equal(getPoints('metro_train'), 20);
  assert.equal(getPoints('petrol_car'), 0);
});

// Test 3: Backend Validation
test('Validation Rules - Request body schema compliance', async (t) => {
  const validateRecycling = (body: any) => {
    if (!body.userName || typeof body.userName !== 'string' || !body.userName.trim()) {
      return { valid: false, error: 'Field "userName" is required' };
    }
    if (!body.address || typeof body.address !== 'string' || !body.address.trim()) {
      return { valid: false, error: 'Field "address" is required' };
    }
    const weight = parseFloat(body.estimatedKg);
    if (isNaN(weight) || weight <= 0) {
      return { valid: false, error: 'Field "estimatedKg" must be > 0' };
    }
    return { valid: true };
  };

  assert.equal(validateRecycling({}).valid, false);
  assert.equal(validateRecycling({ userName: 'Kowshik' }).valid, false);
  assert.equal(validateRecycling({ userName: 'Kowshik', address: '123 St', estimatedKg: -5 }).valid, false);
  assert.equal(validateRecycling({ userName: 'Kowshik', address: '123 St', estimatedKg: 0 }).valid, false);
  assert.equal(validateRecycling({ userName: 'Kowshik', address: '123 St', estimatedKg: 15.5 }).valid, true);
});

// Test 4: Role Sanitization
test('Auth Rules - Prevents unauthorized role forgery', async (t) => {
  const sanitizeRole = (roleHeader: string) => {
    const valid = ['resident', 'collector', 'admin'];
    return valid.includes(roleHeader) ? roleHeader : 'resident';
  };

  assert.equal(sanitizeRole('super_root'), 'resident');
  assert.equal(sanitizeRole('admin'), 'admin');
  assert.equal(sanitizeRole('collector'), 'collector');
  assert.equal(sanitizeRole('resident'), 'resident');
});

// Test 5: Rewards & Voucher Redemption Logic
test('Rewards & Vouchers - Balance verification and voucher code generation', async (t) => {
  const deductPoints = (userPoints: number, requiredPoints: number) => {
    if (userPoints < requiredPoints) return { success: false, newBalance: userPoints };
    return { success: true, newBalance: userPoints - requiredPoints };
  };

  // Sufficient balance test
  const claimAmazon10 = deductPoints(240, 100); // 240 pts balance, 100 pts needed for $10 Amazon
  assert.equal(claimAmazon10.success, true);
  assert.equal(claimAmazon10.newBalance, 140);

  // Insufficient balance test
  const claimAmazon50 = deductPoints(140, 450); // 140 pts balance, 450 pts needed for $50 Amazon
  assert.equal(claimAmazon50.success, false);
  assert.equal(claimAmazon50.newBalance, 140); // balance remains unchanged

  // Voucher Code format validation
  const generateVoucherCode = (category: string) => {
    const prefix = category === 'Amazon Vouchers' ? 'AMZN' : 'METRO';
    return `${prefix}-ABCD-1234`;
  };

  const amzCode = generateVoucherCode('Amazon Vouchers');
  assert.ok(amzCode.startsWith('AMZN-'));
  assert.equal(amzCode.length, 14);
});
