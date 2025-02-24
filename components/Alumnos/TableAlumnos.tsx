'use client';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from '@heroui/react';
import useSWR from 'swr';
import { Alumno } from '@/lib/db';
import { DotsVertical } from '../icons';

interface TableAlumnosProps {
  cursoId: number;
  onEdit: (alumno: Alumno) => void;
  onDelete: (alumno: Alumno) => void;
  onInspect: (alumno: Alumno) => void;
  today: Date;
  next15th: Date;
  next30th: Date;
  refresh: boolean;
  onRefreshed: () => void;
}

interface SortDescriptor {
  column: keyof Alumno | null;
  direction: 'ascending' | 'descending';
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TableAlumnos({
  cursoId,
  onEdit,
  onDelete,
  onInspect,
  today,
  next15th,
  next30th,
  refresh,
  onRefreshed,
}: TableAlumnosProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: null,
    direction: 'ascending',
  });

  const apiUrl = `/api/alumnos/getByCurso?cursoId=${cursoId}`;
  const { data, error, isLoading, mutate } = useSWR<Alumno[]>(apiUrl, fetcher);

  useEffect(() => {
    if (refresh) {
      mutate();
      onRefreshed();
    }
  }, [refresh, mutate, onRefreshed]);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'estado', label: 'Estado' },
    { key: 'mensualidad', label: 'Mensualidad' },
    { key: 'fecha_registro', label: 'Fecha de Registro' },
    { key: 'ultimo_pago', label: 'Último Pago' },
    { key: 'dia_corte', label: 'Día de Corte' },
  ];

  const sortedItems = useMemo(() => {
    if (!data) return [];
    if (!sortDescriptor.column) return data;
    return [...data].sort((a, b) => {
      const col = sortDescriptor.column as keyof Alumno;
      const valueA = a[col];
      const valueB = b[col];
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

  const onSortChange = (columnKey: keyof Alumno) => {
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

  const renderCell = useCallback(
    (alumno: Alumno, columnKey: React.Key): React.ReactNode => {
      const cellValue = alumno[columnKey as keyof Alumno];
      switch (columnKey) {
        case 'nombre':
          return (
            <div className="text-nowrap">
              <span>{alumno.nombre}</span>
            </div>
          );
        case 'estado': {
          if (!alumno.estado) {
            return <Chip color="default">Inactivo</Chip>;
          }
          const totalIngresos = alumno.transacciones.reduce(
            (acc, ingreso) => acc + ingreso.monto,
            0,
          );

          const fechaRegistro = new Date(alumno.fecha_registro);
          const dueDay = alumno.dia_corte;
          const nextPayment =
            dueDay === 15 ? new Date(next15th) : new Date(next30th);

          const getDueDateForMonth = (
            year: number,
            month: number,
            dueDay: number,
          ) => {
            const lastDay = new Date(year, month + 1, 0).getDate();
            return new Date(year, month, Math.min(dueDay, lastDay));
          };

          const getFirstPaymentDate = (regDate: Date, dueDay: number) => {
            const year = regDate.getFullYear();
            const month = regDate.getMonth();
            const candidate = getDueDateForMonth(year, month, dueDay);
            if (regDate.getDate() <= candidate.getDate()) {
              return candidate;
            } else {
              let nextMonth = month + 1;
              let nextYear = year;
              if (nextMonth > 11) {
                nextMonth = 0;
                nextYear++;
              }
              return getDueDateForMonth(nextYear, nextMonth, dueDay);
            }
          };

          const firstPaymentDate = getFirstPaymentDate(fechaRegistro, dueDay);

          let paymentCount = 0;
          let paymentDate = firstPaymentDate;
          while (paymentDate <= nextPayment) {
            paymentCount++;
            let nextMonth = paymentDate.getMonth() + 1;
            let nextYear = paymentDate.getFullYear();
            if (nextMonth > 11) {
              nextMonth = 0;
              nextYear++;
            }
            paymentDate = getDueDateForMonth(nextYear, nextMonth, dueDay);
          }

          const totalDeuda =
            alumno.inscripcion + paymentCount * alumno.mensualidad;

          const diasRestantes = (() => {
            const deudaMensualidad = alumno.mensualidad;
            const diff = totalIngresos - totalDeuda;
            if (diff >= -deudaMensualidad) {
              return Math.ceil(
                (nextPayment.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24),
              );
            } else {
              const previousPayment = new Date(nextPayment);
              previousPayment.setMonth(previousPayment.getMonth() - 1);
              return (
                Math.ceil(
                  (today.getTime() - previousPayment.getTime()) /
                    (1000 * 60 * 60 * 24),
                ) * -1
              );
            }
          })();

          console.log(alumno.nombre, totalIngresos, totalDeuda, diasRestantes);

          const diff = totalIngresos - totalDeuda;
          const montoAbs = Math.abs(diff);
          let chipColor: 'success' | 'danger' | 'warning';
          let estadoTexto: string;
          if (diff >= 0) {
            chipColor = 'success';
            estadoTexto = 'Al corriente';
          } else {
            chipColor = diasRestantes > 0 ? 'warning' : 'danger';
            estadoTexto = diasRestantes > 0 ? 'Por pagar' : 'En mora';
          }

          const detalleTooltip =
            montoAbs === 0
              ? '✔'
              : `${diff >= 0 ? `Crédito: $${montoAbs}` : `Deuda: $${montoAbs}`}
      ${diasRestantes > 0 ? `Próximo pago en ${diasRestantes} días` : `${Math.abs(diasRestantes)} días de atraso`}`;

          return (
            <Tooltip content={detalleTooltip} placement="right">
              <Chip color={chipColor} variant="flat">
                {estadoTexto}
              </Chip>
            </Tooltip>
          );
        }
        case 'fecha_registro':
          return new Date(alumno.fecha_registro).toLocaleDateString();
        case 'ultimo_pago':
          return alumno.transacciones[0]
            ? new Date(alumno.transacciones[0].fecha).toLocaleDateString()
            : '-';
        case 'dia_corte':
          return (
            <div className="relative">
              <span>{alumno.dia_corte}</span>
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
                      onPress={() => onInspect(alumno)}
                    >
                      Inspeccionar
                    </DropdownItem>
                    <DropdownItem key="edit" onPress={() => onEdit(alumno)}>
                      Editar
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      color="danger"
                      className="text-danger"
                      onPress={() => onDelete(alumno)}
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
    [today, next15th, next30th, onEdit, onDelete, onInspect],
  );

  if (error) return <div>Error al cargar los alumnos.</div>;

  return (
    <div className="mt-3 flex w-full flex-col gap-5">
      <Table
        aria-label="Tabla de alumnos con ordenamiento"
        classNames={{ base: 'w-full' }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              align="center"
              allowsSorting
              onClick={() => onSortChange(column.key as keyof Alumno)}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          loadingContent={<Spinner color="success" />}
          isLoading={isLoading}
          items={sortedItems}
          emptyContent="No Existen Alumnos Registrados"
        >
          {(item: Alumno) => (
            <TableRow
              className="cursor-pointer hover:bg-default-100"
              key={item.id || item.nombre}
              onDoubleClick={() => onInspect(item)}
              onTouchEnd={(e) => {
                if (e.detail === 2) {
                  onEdit(item);
                }
              }}
            >
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
