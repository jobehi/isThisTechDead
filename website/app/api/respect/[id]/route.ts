import { NextRequest, NextResponse } from 'next/server';
import { RespectService } from '@/domains/respect';
import { apiErrorHandler } from '@/lib/errors';

// Initialize the service
const respectService = new RespectService();

/**
 * POST /api/respect/[id]
 *
 * Add a respect entry for a tech
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const techId = params.id;

    // Get tech name from request body
    const { techName } = await request.json();

    if (!techName) {
      return NextResponse.json({ error: 'Tech name is required' }, { status: 400 });
    }

    // Use our domain service to pay respects
    const response = await respectService.payRespects(techId, techName);

    return NextResponse.json(response);
  } catch (error) {
    const { statusCode, body } = await apiErrorHandler(error);
    return NextResponse.json(body, { status: statusCode });
  }
}

/**
 * GET /api/respect/[id]
 *
 * Get respect count for a tech
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const techId = params.id;

    // Use our domain service to get the respect count
    const response = await respectService.getRespectCount(techId);

    return NextResponse.json(response);
  } catch (error) {
    const { statusCode, body } = await apiErrorHandler(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
