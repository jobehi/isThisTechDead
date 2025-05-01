import { NextResponse } from 'next/server';
import { TechService } from '@/domains/tech';
import { apiErrorHandler } from '@/lib/errors';

/**
 * GET /api/techs
 *
 * Get all technologies with scores
 */
export async function GET() {
  try {
    const techs = await TechService.getAllTechs();
    return NextResponse.json(techs);
  } catch (error) {
    const { statusCode, body } = await apiErrorHandler(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
