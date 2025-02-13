"use client";
import React, { useCallback, useState, useMemo } from "react";
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
} from "@heroui/react";
import useSWR from "swr";
import { Alumno } from "@/lib/db";
import { DotsVertical } from "../icons";

interface TableAlumnosProps {
  cursoId: number;
  onEdit: (alumno: Alumno) => void;
  onDelete: (alumno: Alumno) => void;
  today: Date;
  next15th: Date;
  next30th: Date;
}

interface SortDescriptor {
  column: keyof Alumno | null;
  direction: "ascending" | "descending";
}

// Función para hacer fetch de la API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TableAlumnos({
  cursoId,
  onEdit,
  onDelete,
  today,
  next15th,
  next30th,
}: TableAlumnosProps) {
  // Estado para el ordenamiento (sobre los datos de la página actual)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: null,
    direction: "ascending",
  });

  // URL de la API con cursoId
  const apiUrl = `http://localhost:3000/api/alumnos/getByCurso?cursoId=${cursoId}`;

  // Uso de SWR para traer los datos
  const { data, error, isLoading } = useSWR<Alumno[]>(apiUrl, fetcher);

  // Definimos las columnas de la tabla
  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "estado", label: "Estado" },
    { key: "mensualidad", label: "Mensualidad" },
    { key: "fecha_registro", label: "Fecha de Registro" },
    { key: "ultimo_pago", label: "Último Pago" },
    { key: "dia_corte", label: "Día de Corte" },
  ];

  // Ordenamiento de los datos visibles (la API no ordena, se hace en el cliente)
  const sortedItems = useMemo(() => {
    if (!data) return [];

    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const col = sortDescriptor.column as keyof Alumno;
      const valueA = a[col];
      const valueB = b[col];

      // Intentamos comparar numéricamente, si es posible
      const numA = parseFloat(String(valueA));
      const numB = parseFloat(String(valueB));

      let cmp = 0;
      if (!isNaN(numA) && !isNaN(numB)) {
        cmp = numA - numB;
      } else {
        cmp = String(valueA).localeCompare(String(valueB));
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [data, sortDescriptor]);

  // Manejador para cambiar el ordenamiento (se aplica sobre los datos visibles)
  const onSortChange = (columnKey: keyof Alumno) => {
    setSortDescriptor((prev) => {
      if (prev.column === columnKey) {
        // Invierte la dirección al hacer click nuevamente en la misma columna
        return {
          column: columnKey,
          direction:
            prev.direction === "ascending" ? "descending" : "ascending",
        };
      }
      // Si se selecciona una columna nueva, se inicia en ascendente
      return {
        column: columnKey,
        direction: "ascending",
      };
    });
  };

  // Renderizado de la celda según la columna
  const renderCell = useCallback(
    (alumno: Alumno, columnKey: React.Key): React.ReactNode => {
      const cellValue = alumno[columnKey as keyof Alumno];

      switch (columnKey) {
        case "estado": {
          const totalIngresos = alumno.transacciones.reduce(
            (acc, ingreso) => acc + ingreso.monto,
            0
          );

          const fechaRegistro = new Date(alumno.fecha_registro);
          const diaCorte = alumno.dia_corte;
          const hoy = new Date(today);

          let totalDeuda = alumno.inscripcion;
          let fechaCorte = new Date(fechaRegistro);

          while (fechaCorte <= hoy) {
            console.log(fechaCorte);

            totalDeuda += alumno.mensualidad;
            if (diaCorte === 15) {
              fechaCorte.setMonth(fechaCorte.getMonth() + 1);
            } else if (diaCorte === 30) {
              fechaCorte.setMonth(fechaCorte.getMonth() + 1);
            }
          }

          const diasRestantes = Math.ceil(
            (fechaCorte.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <Chip
              color={
                totalIngresos >= totalDeuda
                  ? "success"
                  : diasRestantes <= 8
                    ? "danger"
                    : "warning"
              }
            >
              {totalIngresos >= totalDeuda
                ? "Al corriente"
                : diasRestantes <= 5
                  ? "En mora"
                  : "Por pagar"}
            </Chip>
          );
        }
        case "fecha_registro":
          return new Date(alumno.fecha_registro).toLocaleDateString();
        case "ultimo_pago":
          return alumno.transacciones[0]
            ? new Date(alumno.transacciones[0].fecha).toLocaleDateString()
            : "-";
        case "dia_corte":
          return (
            <div className="relative">
              <span>{alumno.dia_corte === 15 ? "Quincena" : "Fin de mes"}</span>
              <span className="absolute top-0 right-0 -mt-1 -mr-1">
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
                    <DropdownItem key="edit" onPress={() => onEdit(alumno)}>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      color="danger"
                      className="text-danger"
                      onPress={() => onDelete(alumno)}
                    >
                      Delete
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
    []
  );

  if (error) return <div>Error al cargar los alumnos.</div>;

  return (
    <div className="flex flex-col gap-5 w-full mt-3">
      <Table
        aria-label="Tabla de alumnos con ordenamiento"
        classNames={{
          base: "w-full",
        }}
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
              {/* Aquí podrías agregar un indicador visual de orden si lo deseas */}
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
              onDoubleClick={() => onEdit(item)}
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
