import {
  createTransaccion,
  deleteTransaccion,
  type Transaccion,
} from '@/lib/db';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const id_user = body.id_user;
    const tipo = body.tipo;
    const categoria = body.categoria;
    const monto = body.monto;
    const fecha = body.fecha;
    const comentario = body.comentario || null;

    if (!id_user) {
      return jsonResponse({ error: 'El id del usuario es requerido' }, 400);
    }

    if (tipo === undefined) {
      return jsonResponse(
        { error: 'El tipo de transacción es requerido' },
        400,
      );
    }

    const transaccion: Partial<Transaccion> = {
      id_user,
      tipo,
      monto,
      fecha,
      comentario,
    };

    if (tipo === 1) {
      // Ingreso
      if (!categoria) {
        return jsonResponse(
          { error: 'La categoría de la transacción es requerida' },
          400,
        );
      }
      transaccion.categoria = categoria;

      if (categoria === 'Mensualidad' || categoria === 'Inscripcion') {
        const id_alumno = body.id_alumno || null;
        if (!id_alumno) {
          return jsonResponse({ error: 'El id del alumno es requerido' }, 400);
        }
        transaccion.id_alumno = id_alumno;
      } else if (categoria !== 'otros') {
        return jsonResponse(
          { error: 'Categoría no válida para ingresos' },
          400,
        );
      }
    } else if (tipo === 2) {
      // Egreso
      if (!categoria) {
        return jsonResponse(
          { error: 'La categoría de la transacción es requerida' },
          400,
        );
      }
      transaccion.categoria = categoria;
      transaccion.id_alumno = null;
    } else {
      return jsonResponse({ error: 'Tipo de transacción no válido' }, 400);
    }

    if (monto === undefined) {
      return jsonResponse(
        { error: 'El monto de la transacción es requerido' },
        400,
      );
    }

    if (!fecha) {
      return jsonResponse(
        { error: 'La fecha de la transacción es requerida' },
        400,
      );
    }

    const fechaTimestamp = new Date(fecha.split('[')[0]).getTime();
    if (isNaN(fechaTimestamp)) {
      return jsonResponse(
        { error: 'El formato de la fecha es incorrecto' },
        400,
      );
    }
    transaccion.fecha = fechaTimestamp;

    try {
      const id = await createTransaccion(transaccion as Transaccion);
      console.log('llego');
      console.log(id);
      return jsonResponse({ id });
    } catch (e) {
      return jsonResponse({ error: 'Error al crear la transacción' }, 500);
    }
  } catch (error) {
    return jsonResponse({ error: 'Error al procesar la solicitud' }, 500);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return jsonResponse(
        { error: 'El id de la transacción es requerido' },
        400,
      );
    }

    try {
      await deleteTransaccion(id);
      return jsonResponse({ message: 'Transacción eliminada correctamente' });
    } catch (e) {
      return jsonResponse({ error: 'Error al eliminar la transacción' }, 500);
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
