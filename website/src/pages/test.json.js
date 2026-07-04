
import { TechService } from '../domains/tech/tech.service';

export async function GET() {
  try {
    const techs = await TechService.getAllTechs();
    return new Response(JSON.stringify(techs), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 });
  }
}
