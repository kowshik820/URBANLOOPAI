import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { successResponse, badRequestResponse, serverErrorResponse } from '../utils/response.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) return badRequestResponse('Missing JSON body');
    const body = JSON.parse(event.body);

    const capacityKw = Math.max(0, parseFloat(body.capacityKw) || 0);
    const peakSunHours = Math.max(0, parseFloat(body.peakSunHours) || 0);
    const performanceRatio = Math.min(1, Math.max(0.1, parseFloat(body.performanceRatio) || 0.78));
    const gridTariffPerKwh = Math.max(0, parseFloat(body.gridTariffPerKwh) || 0);
    const installationCost = Math.max(0, parseFloat(body.installationCost) || 0);

    const dailyKwh = capacityKw * peakSunHours * performanceRatio;
    const annualKwh = dailyKwh * 365;
    const annualSavingsUsd = annualKwh * gridTariffPerKwh;
    const lifetimeSavingsUsd = annualSavingsUsd * 25 - installationCost;

    const simplePaybackYears = annualSavingsUsd > 0
      ? Number((installationCost / annualSavingsUsd).toFixed(1))
      : 0;

    const co2OffsetKgPerYear = Number((annualKwh * 0.82).toFixed(1));
    const equivalentTreesPlanted = Math.round(co2OffsetKgPerYear / 21);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seasonalWeights = [0.75, 0.82, 0.95, 1.10, 1.20, 1.25, 1.22, 1.15, 1.02, 0.90, 0.80, 0.72];

    const monthlyBreakdown = months.map((m, idx) => {
      const monthKwh = (annualKwh / 12) * seasonalWeights[idx];
      return {
        month: m,
        kwh: Math.round(monthKwh),
        savingsUsd: Number((monthKwh * gridTariffPerKwh).toFixed(2)),
      };
    });

    return successResponse({
      dailyGenerationKwh: Number(dailyKwh.toFixed(2)),
      annualGenerationKwh: Math.round(annualKwh),
      annualSavingsUsd: Math.round(annualSavingsUsd),
      lifetimeSavingsUsd: Math.round(lifetimeSavingsUsd),
      simplePaybackYears,
      co2OffsetKgPerYear,
      equivalentTreesPlanted,
      monthlyBreakdown,
      assumptions: [
        `PR modeled at ${(performanceRatio * 100).toFixed(0)}%.`,
        `Average solar irradiance: ${peakSunHours.toFixed(1)} peak sun hours/day.`,
        `Grid displacement factor: 0.82 kg CO2e per kWh generated.`,
      ],
    });
  } catch (err: any) {
    return serverErrorResponse(err);
  }
};
