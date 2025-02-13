import { createCurso, updateCurso, deleteCurso, type Curso } from "@/lib/db";
import { error } from "console";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const nombre = body.nombre;
    const fechaDeInicio = body.fechaDeInicio;

    if (!nombre) {
      return jsonResponse({ error: "El nombre del curso es requerido" }, 400);
    }

    if (!fechaDeInicio) {
      return jsonResponse(
        { error: "La fecha de inicio del curso es requerida" },
        400
      );
    }
    const fechaTimestamp = new Date(fechaDeInicio.split("[")[0]).getTime();
    if (isNaN(fechaTimestamp)) {
      return jsonResponse(
        { error: "El formato de la fecha es incorrecto" },
        400
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
      return jsonResponse({ error: "Error al crear el curso" }, 500);
    }
  } catch (error) {
    return jsonResponse({ error: "Error al procesar la solicitud" }, 500);
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const id = body.id;
    const nombre = body.nombre;
    const fechaDeInicio = body.fechaDeInicio;
    const estado = body.estado;

    if (!id) {
      return jsonResponse({ error: "El id del curso es requerido" }, 400);
    }
    if (!nombre) {
      return jsonResponse({ error: "El nombre del curso es requerido" }, 400);
    }
    if (typeof estado !== "boolean") {
      return jsonResponse({ error: "El estado del curso es requerido" }, 400);
    }

    if (!fechaDeInicio) {
      return jsonResponse(
        { error: "La fecha de inicio del curso es requerida" },
        400
      );
    }
    const fechaTimestamp = new Date(fechaDeInicio.split("[")[0]).getTime();
    if (isNaN(fechaTimestamp)) {
      return jsonResponse(
        { error: "El formato de la fecha es incorrecto" },
        400
      );
    }

    try {
      await updateCurso({
        id,
        nombre,
        fechaDeInicio: fechaTimestamp,
        estado,
      } as Curso);
      return jsonResponse({}, 200);
    } catch (e) {
      return jsonResponse({ error: "Error al crear el curso" }, 500);
    }
  } catch (error) {
    return jsonResponse({ error: "Error al procesar la solicitud" }, 500);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return jsonResponse({ error: "El id del curso es requerido" }, 400);
    }

    try {
      let result = await deleteCurso(id);
      if ((result as any).code === "SQLITE_CONSTRAINT") {
        return jsonResponse(
          { error: "No se puede eliminar el curso, tiene alumnos registrados" },
          400
        );
      }
      return jsonResponse({}, 200);
    } catch (e) {
      return jsonResponse({ error: "Error al eliminar el curso" }, 500);
    }
  } catch (error) {
    return jsonResponse({ error: "Error al procesar la solicitud" }, 500);
  }
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
