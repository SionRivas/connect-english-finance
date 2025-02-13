import { getAlumnosByCurso, type Alumno } from '@/lib/db';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const cursoId = Number(url.searchParams.get('cursoId'));

  if (!cursoId) {
    return jsonResponse({ error: 'El id del curso es requerido' }, 400);
  }

  const alumnos = await getAlumnosByCurso(cursoId);
  return jsonResponse(alumnos);
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
