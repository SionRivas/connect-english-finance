export const MetodosPago = [
  { id: 1, nombre: 'Efectivo' },
  { id: 2, nombre: 'Transferencia' },
];

export const CategoriasIngresos = [
  { id: 1, nombre: 'Mensualidad' },
  { id: 2, nombre: 'Inscripcion' },
  { id: 3, nombre: 'Otros' },
];
export const CategoriasEgresos = [
  { id: 4, nombre: 'Luz' },
  { id: 5, nombre: 'Agua' },
  { id: 6, nombre: 'Salario' },
  { id: 7, nombre: 'Impuestos' },
  { id: 8, nombre: 'Alquiler' },
  { id: 9, nombre: 'Internet' },
  { id: 3, nombre: 'Otros' },
];

export const Categorias = [...CategoriasIngresos, ...CategoriasEgresos];
