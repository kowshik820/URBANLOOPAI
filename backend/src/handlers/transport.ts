import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '../utils/dynamodb.js';
import { authenticateRequest } from '../utils/auth.js';
import { successResponse, badRequestResponse, serverErrorResponse } from '../utils/response.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const path = event.rawPath || event.requestContext.http.path;
    const auth = authenticateRequest(event);

    if (path.endsWith('/log-trip')) {
      if (!event.body) return badRequestResponse('Missing JSON body');
      const body = JSON.parse(event.body);

      const distanceKm = parseFloat(body.distanceKm) || 1;
      const mode = body.mode || 'metro_train';
      const pointsEarned = Math.round(distanceKm * 2);
      const co2SavedKg = Number((distanceKm * 0.16).toFixed(1));

      const newActivity = {
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: auth?.userId || body.userId || 'user-01',
        activityType: 'GREEN_COMMUTE',
        title: `Commute Logged: ${mode.toUpperCase()}`,
        description: `Traveled ${distanceKm} km using low-carbon transport`,
        pointsEarned,
        co2SavedKg,
        timestamp: new Date().toISOString(),
      };

      try {
        await docClient.send(
          new PutCommand({
            TableName: TABLES.ACTIVITY,
            Item: newActivity,
          })
        );
      } catch {
        // Continue even if table empty
      }

      return successResponse(newActivity, 201);
    }

    // Default: calculate
    if (!event.body) return badRequestResponse('Missing JSON body');
    const body = JSON.parse(event.body);

    const dist = Math.max(0.1, parseFloat(body.distanceKm) || 1);
    const trips = Math.max(1, parseInt(body.tripsPerMonth) || 1);
    const annualDist = dist * trips * 12;

    const factors = [
      { mode: 'petrol_car', title: 'Gasoline / Petrol Car', gPerKm: 192, costPerKm: 0.28, zero: false },
      { mode: 'ev_car', title: 'Battery Electric Vehicle (EV)', gPerKm: 53, costPerKm: 0.08, zero: false },
      { mode: 'city_bus', title: 'Municipal Transit Bus', gPerKm: 82, costPerKm: 0.12, zero: false },
      { mode: 'metro_train', title: 'Electric Metro / Subway', gPerKm: 28, costPerKm: 0.10, zero: false },
      { mode: 'bicycle', title: 'Bicycle / E-Bike', gPerKm: 0, costPerKm: 0.02, zero: true },
      { mode: 'walking', title: 'Walking / Active Pedestrian', gPerKm: 0, costPerKm: 0.00, zero: true },
    ];

    const options = factors.map((data) => {
      const tripEmissionsKg = Number(((dist * data.gPerKm) / 1000).toFixed(2));
      const annualEmissionsKg = Number(((annualDist * data.gPerKm) / 1000).toFixed(1));
      const monthlyCost = Number((dist * trips * data.costPerKm).toFixed(2));
      const score = Math.round(((192 - data.gPerKm) / 192) * 100);
      const points = data.zero ? Math.round(dist * 5) : score > 50 ? Math.round(dist * 2) : 0;

      return {
        mode: data.mode,
        title: data.title,
        emissionsGramsPerKm: data.gPerKm,
        tripEmissionsKg,
        annualEmissionsKg,
        monthlyCostEstimate: monthlyCost,
        sustainabilityScore: score,
        greenPointsAwarded: points,
        isZeroEmission: data.zero,
      };
    });

    return successResponse({
      distanceKm: dist,
      tripsPerMonth: trips,
      options,
      annualSavingsVsPetrolKgCO2: Number((options[0].annualEmissionsKg - options[3].annualEmissionsKg).toFixed(1)),
      recommendedMode: dist <= 3 ? 'Bicycle / Walking' : dist <= 15 ? 'Electric Metro' : 'Electric Vehicle (EV)',
    });
  } catch (err: any) {
    return serverErrorResponse(err);
  }
};
