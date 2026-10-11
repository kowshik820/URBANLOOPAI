import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '../utils/dynamodb.js';
import { successResponse, notFoundResponse, serverErrorResponse } from '../utils/response.js';

const SEED_WASTE_ITEMS = [
  {
    id: 'item-1',
    name: 'PET Plastic Water Bottle',
    aliases: ['water bottle', 'soda bottle', 'plastic bottle'],
    category: 'Dry Recyclable',
    binColor: 'blue',
    instructions: 'Empty liquid completely, rinse, crush flat to save space, and replace cap.',
    safetyWarnings: ['Do not burn or melt plastic bottles.'],
    tips: ['Keep bottle caps attached; modern recycling facilities sort HDPE caps alongside PET.'],
    verified: true,
    recyclabilityScore: 95,
    disposalMethod: 'Curbside Blue Bin'
  },
  {
    id: 'item-2',
    name: 'Lithium-Ion Phone Battery',
    aliases: ['phone battery', 'li-ion', 'rechargeable battery'],
    category: 'Hazardous',
    binColor: 'red',
    instructions: 'NEVER place in household bins. Tape battery terminals with electrical tape.',
    safetyWarnings: ['Severe fire risk if crushed in garbage trucks or landfills.'],
    tips: ['Many electronics retailers offer free drop-off boxes for rechargeable batteries.'],
    verified: true,
    recyclabilityScore: 70,
    disposalMethod: 'Certified E-Waste Drop-off Center'
  },
  {
    id: 'item-3',
    name: 'Corrugated Cardboard Box',
    aliases: ['shipping box', 'amazon box', 'carton'],
    category: 'Dry Recyclable',
    binColor: 'blue',
    instructions: 'Remove excessive packing tape, flatten completely, and ensure box is dry.',
    safetyWarnings: ['Greasy pizza boxes cannot be recycled into high-grade paper.'],
    tips: ['Bundle flattened boxes with twine for clean roadside pickup.'],
    verified: true,
    recyclabilityScore: 98,
    disposalMethod: 'Curbside Blue Bin'
  },
  {
    id: 'item-4',
    name: 'Fruit Peels & Vegetable Scraps',
    aliases: ['banana peel', 'apple core', 'veggie trims'],
    category: 'Wet Organic',
    binColor: 'green',
    instructions: 'Collect in a countertop compost pail. Empty into community compost.',
    safetyWarnings: ['Avoid adding meat or dairy in simple backyard compost heaps.'],
    tips: ['Composting prevents anaerobic decomposition in landfills, eliminating methane.'],
    verified: true,
    recyclabilityScore: 100,
    disposalMethod: 'Green Organics Bin'
  }
];

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const id = event.pathParameters?.id;

    if (id) {
      try {
        const result = await docClient.send(
          new GetCommand({
            TableName: TABLES.CATALOG,
            Key: { id },
          })
        );
        if (result.Item) return successResponse(result.Item);
      } catch {
        // Fallback to seed list
      }
      const found = SEED_WASTE_ITEMS.find((item) => item.id === id);
      if (found) return successResponse(found);
      return notFoundResponse(`Waste item with ID '${id}' was not found in catalog.`);
    }

    // List all
    try {
      const scanResult = await docClient.send(
        new ScanCommand({
          TableName: TABLES.CATALOG,
          Limit: 50,
        })
      );
      if (scanResult.Items && scanResult.Items.length > 0) {
        return successResponse(scanResult.Items);
      }
    } catch {
      // Return seed items if table is fresh
    }

    return successResponse(SEED_WASTE_ITEMS);
  } catch (err: any) {
    return serverErrorResponse(err);
  }
};
