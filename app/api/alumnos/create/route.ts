import { createCurso } from '@/lib/db';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const nombre = body.nombre;
    const fechaDeInicio = body.fechaDeInicio;

    if (!nombre) {
      return jsonResponse({ error: 'El nombre del curso es requerido' }, 400);
    }

    if (!fechaDeInicio) {
      return jsonResponse(
        { error: 'La fecha de inicio del curso es requerida' },
        400,
      );
    }
    const fechaTimestamp = new Date(fechaDeInicio.split('[')[0]).getTime();
    if (isNaN(fechaTimestamp)) {
      return jsonResponse(
        { error: 'El formato de la fecha es incorrecto' },
        400,
      );
    }

    try {
      let id = await createCurso(nombre, fechaTimestamp);
      return jsonResponse({
        id,
        nombre,
        fechaDeInicio: fechaTimestamp,
        estado: true,
      });
    } catch (e) {
      return jsonResponse({ error: 'Error al crear el curso' }, 500);
    }
  } catch (error) {
    return jsonResponse({ error: 'Error al procesar la solicitud' }, 500);
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
