import { NextRequest, NextResponse } from 'next/server';
import { TechService } from '@/domains/tech';
import { apiErrorHandler } from '@/lib/errors';

/**
 * GET /api/techs/[id]
 *
 * Get tech details by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const techId = params.id;
    const techDetails = await TechService.getTechDetails(techId);
    return NextResponse.json(techDetails);
  } catch (error) {
    const { statusCode, body } = await apiErrorHandler(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
