'use client';
import React, { useCallback, useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  CalendarDate,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import useSWR from 'swr';
import { Transaccion } from '@/lib/db'; // Asegúrate de que la ruta sea la correcta
import { DotsVertical } from '../icons';

// Interfaz para las props de la tabla (en este ejemplo no requerimos props adicionales)
interface TableTransaccionesProps {
  startDate: CalendarDate;
  endDate: CalendarDate;
  onUpdated: (ingreso: number, egreso: number) => void;

  onEdit: (transaccion: Transaccion) => void;
  onDelete: (transaccion: Transaccion) => void;
  onInspection: (transaccion: Transaccion) => void;
}

// Interfaz para el descriptor de ordenamiento
interface SortDescriptor {
  column: keyof Transaccion | null;
  direction: 'ascending' | 'descending';
}

// Función para hacer fetch de la API

export default function TableTransacciones({
  startDate,
  endDate,
  onUpdated,
  onEdit,
  onDelete,
  onInspection,
}: TableTransaccionesProps) {
  const fetcher = (url: string) =>
    fetch(url).then((res) =>
      res.json().then((data: Transaccion[]) => {
        console.log(startDate, endDate);

        onUpdated(
          data.reduce((acc, curr) => {
            if (curr.tipo === 1) {
              return acc + curr.monto;
            } else {
              return acc;
            }
          }, 0),
          data.reduce((acc, curr) => {
            if (curr.tipo === 2) {
              return acc + curr.monto;
            } else {
              return acc;
            }
          }, 0),
        );
        return data;
      }),
    );

  // Estado para el ordenamiento de la tabla
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: null,
    direction: 'ascending',
  });

  // URL de la API para obtener todas las transacciones
  const apiUrl = `/api/transacciones/getRange?startDate=${startDate.toString()}&endDate=${endDate.toString()}`;

  // Uso de SWR para obtener las transacciones
  const { data, error, isLoading } = useSWR<Transaccion[]>(apiUrl, fetcher);

  // Definición de las columnas de la tabla
  const columns = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'monto', label: 'Monto' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'id_alumno', label: 'Asociado' },
  ];

  // Ordenamiento de los datos (realizado en el cliente)
  const sortedItems = useMemo(() => {
    if (!data) return [];
    if (!sortDescriptor.column) return data;
    return [...data].sort((a, b) => {
      const col = sortDescriptor.column as keyof Transaccion;
      const valueA = a[col];
      const valueB = b[col];

      // Intentamos comparar numéricamente si es posible
      const numA = parseFloat(String(valueA));
      const numB = parseFloat(String(valueB));
      let cmp = 0;
      if (!isNaN(numA) && !isNaN(numB)) {
        cmp = numA - numB;
      } else {
        cmp = String(valueA).localeCompare(String(valueB));
      }
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [data, sortDescriptor]);

  // Manejador para cambiar el ordenamiento al hacer clic en un encabezado
  const onSortChange = (columnKey: keyof Transaccion) => {
    setSortDescriptor((prev) => {
      if (prev.column === columnKey) {
        return {
          column: columnKey,
          direction:
            prev.direction === 'ascending' ? 'descending' : 'ascending',
        };
      }
      return {
        column: columnKey,
        direction: 'ascending',
      };
    });
  };

  // Renderizado de la celda según el campo
  const renderCell = useCallback(
    (transaccion: Transaccion, columnKey: React.Key): React.ReactNode => {
      const cellValue = transaccion[columnKey as keyof Transaccion];
      switch (columnKey) {
        case 'tipo':
          return transaccion.tipo === 1 ? (
            <Chip color="success" size="sm" variant="flat">
              Ingreso
            </Chip>
          ) : transaccion.tipo === 2 ? (
            <Chip color="danger" size="sm" variant="flat">
              Egreso
            </Chip>
          ) : (
            cellValue
          );
        case 'fecha':
          return new Date(transaccion.fecha).toLocaleDateString();
        case 'monto':
          return <span>${cellValue}</span>;
        case 'comentario':
          return transaccion.comentario ? transaccion.comentario : '-';
        case 'id_alumno':
          return (
            <div className="relative">
              <span>
                {transaccion.nombre_alumno ? transaccion.nombre_alumno : '-'}
              </span>
              <span className="absolute right-0 top-0 -mr-1 -mt-1">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="opacity-15"
                    >
                      <DotsVertical />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="inspect"
                      onPress={() => onInspection(transaccion)}
                    >
                      Inspeccionar
                    </DropdownItem>

                    <DropdownItem
                      key="delete"
                      color="danger"
                      className="text-danger"
                      onPress={() => onDelete(transaccion)}
                    >
                      Eliminar
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </div>
          );
        default:
          return cellValue !== null && cellValue !== undefined
            ? String(cellValue)
            : null;
      }
    },
    [],
  );

  if (error) return <div>Error al cargar las transacciones.</div>;

  return (
    <Table aria-label="Tabla de transacciones" isStriped>
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            key={column.key}
            align="center"
            allowsSorting
            onClick={() => onSortChange(column.key as keyof Transaccion)}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        loadingContent={<Spinner color="success" />}
        isLoading={isLoading}
        items={sortedItems}
        emptyContent="No Existen Transacciones"
      >
        {(item: Transaccion) => (
          <TableRow
            className="cursor-pointer hover:bg-default-100"
            key={item.id}
          >
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
