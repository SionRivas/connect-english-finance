import {
  getTransaccionesByDateRange,
  type Transaccion as OriginalTransaccion,
} from '@/lib/db';

interface Transaccion extends OriginalTransaccion {
  [key: string]: any;
}
var xl = require('excel4node');

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Filtra una transacción según los campos solicitados.
 * Si se incluye "asociado", se asigna el valor de "nombre_alumno".
 */
function filterTransaccion(
  transaccion: Transaccion,
  fields: string[],
): Record<string, any> {
  const result: Record<string, any> = {};
  if (fields.length > 0) {
    fields.forEach((field) => {
      if (field === 'asociado' && 'nombre_alumno' in transaccion) {
        result['asociado'] = transaccion['nombre_alumno'];
      } else if (field in transaccion) {
        result[field] = transaccion[field];
      }
    });
  } else {
    Object.assign(result, transaccion);
    if ('nombre_alumno' in transaccion) {
      result['asociado'] = transaccion['nombre_alumno'];
    }
  }
  return result;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const startDateStr = url.searchParams.get('startDate');
    const endDateStr = url.searchParams.get('endDate');
    const fields = url.searchParams.getAll('fields');

    if (!startDateStr || !endDateStr) {
      return jsonResponse({ error: 'startDate y endDate son requeridos' }, 400);
    }

    const startDateTimestamp = new Date(startDateStr.split('[')[0]).getTime();
    const endDateTimestamp =
      new Date(endDateStr.split('[')[0]).getTime() + 24 * 60 * 60 * 1000;
    if (isNaN(startDateTimestamp) || isNaN(endDateTimestamp)) {
      return jsonResponse(
        { error: 'El formato de la fecha es incorrecto' },
        400,
      );
    }

    const transacciones = (await getTransaccionesByDateRange(
      startDateTimestamp,
      endDateTimestamp,
    )) as Transaccion[];

    const filteredTransacciones = transacciones.map((tx) =>
      filterTransaccion(tx, fields),
    );

    // Determinar las columnas a utilizar: si se solicitaron campos, se usan esos; de lo contrario, se toman las keys de la primera transacción
    const columns: string[] =
      filteredTransacciones.length > 0
        ? fields.length > 0
          ? fields
          : Object.keys(filteredTransacciones[0])
        : [];

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Transacciones');

    // Encabezados
    columns.forEach((col, i) => {
      ws.cell(1, i + 1).string(col);
    });

    // Datos
    filteredTransacciones.forEach((row, rowIndex) => {
      columns.forEach((col, colIndex) => {
        let value = row[col];
        if (col === 'fecha' && value) {
          value = new Date(value).toLocaleDateString();
          ws.cell(rowIndex + 2, colIndex + 1).string(String(value));
        } else if (col === 'tipo' && value) {
          const tipoText =
            value === 1 ? 'Ingreso' : value === 2 ? 'Egreso' : 'Desconocido';
          ws.cell(rowIndex + 2, colIndex + 1).string(tipoText);
        } else if (typeof value === 'number') {
          ws.cell(rowIndex + 2, colIndex + 1).number(value);
        } else {
          ws.cell(rowIndex + 2, colIndex + 1).string(
            value ? String(value) : '',
          );
        }
      });
    });

    const buffer = await wb.writeToBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="transacciones.xlsx"',
      },
    });
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: 'Error al generar el archivo Excel' }, 500);
  }
}
