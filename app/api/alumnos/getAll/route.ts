import { getAllAlumnos } from "@/lib/db";

export async function GET(request: Request): Promise<Response> {
  try {
    let cursos = await getAllAlumnos();
    return jsonResponse(cursos);
  } catch (e) {
    return jsonResponse({ error: "Error al obtener los cursos" }, 500);
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
