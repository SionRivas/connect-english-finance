import { getTransaccionesByDateRange } from '@/lib/db';
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return jsonResponse({ error: 'startDate y endDate son requeridos' }, 400);
    }

    const startDateTimestamp = new Date(startDate.split('[')[0]).getTime();
    const endDateTimestamp =
      new Date(endDate.split('[')[0]).getTime() + 24 * 60 * 60 * 1000;
    if (isNaN(startDateTimestamp) || isNaN(endDateTimestamp)) {
      return jsonResponse(
        { error: 'El formato de la fecha es incorrecto' },
        400,
      );
    }

    let transacciones = await getTransaccionesByDateRange(
      startDateTimestamp,
      endDateTimestamp,
    );
    return jsonResponse(transacciones);
  } catch (e) {
    return jsonResponse({ error: 'Error al obtener las transacciones' }, 500);
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
