import { getCursosPaginated, type Curso } from '@/lib/db';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let cursos = (await getCursosPaginated(page, limit)) as Curso[];
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return jsonResponse(cursos);
  } catch (e) {
    return jsonResponse({ error: 'Error al obtener los cursos' }, 500);
  }
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
