import {
  getTransaccionesByDateRange,
  type Transaccion as OriginalTransaccion,
} from '@/lib/db';

interface Transaccion extends OriginalTransaccion {
  [key: string]: any;
}

const xl = require('excel4node');

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

    const columns: string[] =
      filteredTransacciones.length > 0
        ? fields.length > 0
          ? fields
          : Object.keys(filteredTransacciones[0])
        : [];

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Transacciones');

    // Estilos personalizados con tonos azules
    const titleStyle = wb.createStyle({
      font: { bold: true, size: 16, color: 'FFFFFF' },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#4F81BD' },
    });

    const subtitleStyle = wb.createStyle({
      font: { bold: true, size: 14, color: '000000' },
      alignment: { horizontal: 'center', vertical: 'center' },
    });

    const dateStyle = wb.createStyle({
      font: { italic: true, color: '000000' },
      alignment: { horizontal: 'center', vertical: 'center' },
    });

    const headerStyle = wb.createStyle({
      font: { bold: true, color: 'FFFFFF' },
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#4F81BD' },

      alignment: { horizontal: 'center', vertical: 'center' },
      border: { left: 'thin', right: 'thin', top: 'thin', bottom: 'thin' },
    });

    // Data style para celdas generales (texto en negro)
    const dataStyle = wb.createStyle({
      font: { color: '000000' },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: { left: 'thin', right: 'thin', top: 'thin', bottom: 'thin' },
    });

    // Estilo para la celda "comentario": alinear a la izquierda y activar wrapText
    const comentarioStyle = wb.createStyle({
      font: { color: '000000' },
      alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
      border: { left: 'thin', right: 'thin', top: 'thin', bottom: 'thin' },
    });

    const summaryStyle = wb.createStyle({
      font: { bold: true, color: 'FFFFFF' },
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#4F81BD' },

      alignment: { horizontal: 'center', vertical: 'center' },
      border: { left: 'thin', right: 'thin', top: 'thin', bottom: 'thin' },
    });

    // Encabezados decorativos
    ws.cell(1, 1, 1, columns.length, true)
      .string('Connect English')
      .style(titleStyle);

    ws.cell(2, 1, 2, columns.length, true)
      .string('Resumen Financiero')
      .style(subtitleStyle);

    const startDateFormatted = new Date(
      startDateTimestamp,
    ).toLocaleDateString();
    const endDateFormatted = new Date(
      endDateTimestamp - 86400000,
    ).toLocaleDateString();
    ws.cell(3, 1, 3, columns.length, true)
      .string(`Período: ${startDateFormatted} - ${endDateFormatted}`)
      .style(dateStyle);

    // Encabezados de tabla
    columns.forEach((col, i) => {
      ws.cell(4, i + 1)
        .string(col)
        .style(headerStyle);
    });

    // Datos
    filteredTransacciones.forEach((row, rowIndex) => {
      columns.forEach((col, colIndex) => {
        const cell = ws.cell(rowIndex + 5, colIndex + 1);
        let value = row[col];
        if (col === 'fecha' && value) {
          value = new Date(value).toLocaleDateString();
          cell.string(String(value)).style(dataStyle);
        } else if (col === 'tipo' && value) {
          const tipoText =
            value === 1 ? 'Ingreso' : value === 2 ? 'Egreso' : 'Desconocido';
          cell.string(tipoText).style(dataStyle);
        } else if (col === 'comentario') {
          cell.string(value ? String(value) : '').style(comentarioStyle);
        } else if (typeof value === 'number') {
          cell.number(value).style(dataStyle);
        } else {
          cell.string(value ? String(value) : '').style(dataStyle);
        }
      });
    });

    // Resumen financiero
    let totalIngresos = 0;
    let totalEgresos = 0;
    transacciones.forEach((tx) => {
      if (tx.tipo === 1) totalIngresos += tx.monto || 0;
      if (tx.tipo === 2) totalEgresos += tx.monto || 0;
    });
    const summaryRow = filteredTransacciones.length + 5;
    [
      ['Total Ingresos', totalIngresos],
      ['Total Egresos', totalEgresos],
      ['Neto', totalIngresos - totalEgresos],
    ].forEach(([label, value], i) => {
      ws.cell(
        summaryRow + i + 1,
        1,
        summaryRow + i + 1,
        columns.length - 1,
        true,
      )
        .string(label)
        .style(summaryStyle);
      ws.cell(summaryRow + i + 1, columns.length)
        .number(value)
        .style(summaryStyle);
    });

    // Autoajuste de columnas
    columns.forEach((col, index) => {
      let maxLength = col.length;
      filteredTransacciones.forEach((row) => {
        const len = row[col] ? String(row[col]).length : 0;
        if (len > maxLength) maxLength = len;
      });
      ws.column(index + 1).setWidth(Math.min(maxLength + 5, 30));
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
