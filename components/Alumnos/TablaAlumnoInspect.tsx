'use client';
import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Accordion,
  AccordionItem,
} from '@heroui/react';
import { Transaccion } from '@/lib/db';

interface TablaAlumnoInspectProps {
  transacciones: Transaccion[];
}

export const TablaAlumnoInspect = ({
  transacciones,
}: TablaAlumnoInspectProps) => {
  const columns = [
    { key: 'categoria', label: 'Categoría' },
    { key: 'monto', label: 'Monto' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'comentario', label: 'Comentario' },
  ];

  const renderCell = (
    transaccion: Transaccion,
    columnKey: React.Key,
  ): React.ReactNode => {
    const cellValue = transaccion[columnKey as keyof Transaccion];
    switch (columnKey) {
      case 'categoria':
        return (
          <span className="">
            <span className="mr-2 h-2 w-2 rounded-full bg-success-400">
              &nbsp;
            </span>

            {cellValue}
          </span>
        );
      case 'fecha':
        return new Date(transaccion.fecha).toLocaleDateString();
      case 'monto':
        return <span>${cellValue}</span>;
      case 'comentario':
        return (
          <>
            {transaccion.comentario ? (
              <Accordion variant="light" className="w-full max-w-md" isCompact>
                <AccordionItem
                  key="1"
                  aria-label="Comentario"
                  startContent={
                    <span className="text-default-500">Mostrar</span>
                  }
                >
                  <span className="text-left">{transaccion.comentario}</span>
                </AccordionItem>
              </Accordion>
            ) : (
              '-'
            )}
          </>
        );
      default:
        return cellValue !== null && cellValue !== undefined
          ? String(cellValue)
          : null;
    }
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-5">
      <Table
        aria-label="Tabla de transacciones del alumno"
        isStriped
        classNames={{
          base: 'w-full',
          wrapper: 'shadow-none  rounded-lg p-0',
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key} align="center">
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={transacciones}
          emptyContent="No Existen Transacciones"
        >
          {(item: Transaccion) => (
            <TableRow key={item.id} className="rounded-lg hover:bg-default-200">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
