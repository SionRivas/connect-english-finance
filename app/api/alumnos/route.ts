import {
  CreateAlumno,
  updateAlumno,
  deleteAlumno,
  type Alumno,
} from '@/lib/db';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const nombre = body.nombre;
    const encargado = body.encargado || null;
    const estado = body.estado;
    const numero_contacto_1 = body.numero_contacto_1;
    const numero_contacto_2 = body.numero_contacto_2 || null;
    const mensualidad = body.mensualidad;
    const inscripcion = body.inscripcion;
    const fecha_registro = body.fecha_registro;
    const id_curso = body.id_curso;
    const dia_corte = body.dia_corte;

    if (!nombre) {
      return jsonResponse({ error: 'El nombre del alumno es requerido' }, 400);
    }
    if (!estado) {
      return jsonResponse({ error: 'El estado del alumno es requerido' }, 400);
    }
    if (!numero_contacto_1) {
      return jsonResponse(
        { error: 'El número de contacto 1 del alumno es requerido' },
        400,
      );
    }
    if (!mensualidad) {
      return jsonResponse(
        { error: 'La mensualidad del alumno es requerida' },
        400,
      );
    }
    if (!inscripcion) {
      return jsonResponse(
        { error: 'La inscripción del alumno es requerida' },
        400,
      );
    }
    if (!fecha_registro) {
      return jsonResponse(
        { error: 'La fecha de registro del alumno es requerida' },
        400,
      );
    }
    if (!id_curso) {
      return jsonResponse(
        { error: 'El id del curso del alumno es requerido' },
        400,
      );
    }
    if (!dia_corte) {
      return jsonResponse(
        { error: 'El día de corte del alumno es requerido' },
        400,
      );
    }

    const fechaTimestamp = new Date(fecha_registro.split('[')[0]).getTime();
    if (isNaN(fechaTimestamp)) {
      return jsonResponse(
        { error: 'El formato de la fecha es incorrecto' },
        400,
      );
    }

    try {
      let id = await CreateAlumno({
        nombre,
        encargado,
        estado,
        numero_contacto_1,
        numero_contacto_2,
        mensualidad,
        inscripcion,
        fecha_registro: fechaTimestamp,
        id_curso,
        dia_corte,
      } as Alumno);
      return jsonResponse({
        id: id,
      });
    } catch (e) {
      return jsonResponse({ error: 'Error al crear el alumno' }, 500);
    }
  } catch (error) {
    return jsonResponse({ error: 'Error al procesar la solicitud' }, 500);
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const id = body.id;
    const nombre = body.nombre;
    const encargado = body.encargado || null;
    const estado = body.estado;
    const numero_contacto_1 = body.numero_contacto_1;
    const numero_contacto_2 = body.numero_contacto_2 || null;
    const mensualidad = body.mensualidad;
    const inscripcion = body.inscripcion;
    const fecha_registro = body.fecha_registro;
    const id_curso = body.id_curso;
    const dia_corte = body.dia_corte;

    if (!id) {
      return jsonResponse({ error: 'El id del alumno es requerido' }, 400);
    }
    if (!nombre) {
      return jsonResponse({ error: 'El nombre del alumno es requerido' }, 400);
    }
    if (typeof estado !== 'boolean') {
      return jsonResponse({ error: 'El estado del alumno es requerido' }, 400);
    }
    if (!numero_contacto_1) {
      return jsonResponse(
        { error: 'El número de contacto 1 del alumno es requerido' },
        400,
      );
    }
    if (!mensualidad) {
      return jsonResponse(
        { error: 'La mensualidad del alumno es requerida' },
        400,
      );
    }
    if (!inscripcion) {
      return jsonResponse(
        { error: 'La inscripción del alumno es requerida' },
        400,
      );
    }
    if (!fecha_registro) {
      return jsonResponse(
        { error: 'La fecha de registro del alumno es requerida' },
        400,
      );
    }
    if (!id_curso) {
      return jsonResponse(
        { error: 'El id del curso del alumno es requerido' },
        400,
      );
    }
    if (!dia_corte) {
      return jsonResponse(
        { error: 'El día de corte del alumno es requerido' },
        400,
      );
    }

    const fechaTimestamp = new Date(fecha_registro.split('[')[0]).getTime();
    if (isNaN(fechaTimestamp)) {
      return jsonResponse(
        { error: 'El formato de la fecha es incorrecto' },
        400,
      );
    }

    try {
      await updateAlumno({
        id,
        nombre,
        encargado,
        estado,
        numero_contacto_1,
        numero_contacto_2,
        mensualidad,
        inscripcion,
        fecha_registro: fechaTimestamp,
        id_curso,
        dia_corte,
      } as Alumno);
      return jsonResponse({ message: 'Alumno actualizado correctamente' });
    } catch (e) {
      return jsonResponse({ error: 'Error al actualizar el alumno' }, 500);
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
      return jsonResponse({ error: 'El id del alumno es requerido' }, 400);
    }

    try {
      await deleteAlumno(id);
      return jsonResponse({ message: 'Alumno eliminado correctamente' });
    } catch (e) {
      return jsonResponse({ error: 'Error al eliminar el alumno' }, 500);
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
