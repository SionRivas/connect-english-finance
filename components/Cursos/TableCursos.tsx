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
  Pagination,
  Spinner,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownItem,
  DropdownMenu,
} from '@heroui/react';
import useSWR from 'swr';

import { type Curso } from '@/lib/db';
import { DotsVertical, PlusIcon, TableExportIcon } from '../icons';
import { EditarCursoModal } from './EditarCursoModal';
import { DeleteCursoModal } from './DeleteCursoModal';
import { CrearCursoModal } from './CrearCursoModal';

interface TableCursosProps {
  totalItemsInit: number;
  pageSize: number;
}

interface SortDescriptor {
  column: keyof Curso | null;
  direction: 'ascending' | 'descending';
}

// Función para hacer fetch de la API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TableCursos({
  totalItemsInit,
  pageSize,
}: TableCursosProps) {
  // Estado para la página actual
  const [page, setPage] = useState(1);

  // Estado para el ordenamiento (sobre los datos de la página actual)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: null,
    direction: 'ascending',
  });
  // Estado para el total de items
  const [totalItems, setTotalItems] = useState(totalItemsInit);

  // Función para actualizar el total de items
  const updateTotalItems = (operation: 'add' | 'subtract') => {
    setTotalItems((prevTotal) =>
      operation === 'add' ? prevTotal + 1 : prevTotal - 1,
    );
  };
  // URL de la API con paginación
  const apiUrl = `http://localhost:3000/api/cursos/getPagination?page=${page}&limit=${pageSize}`;

  // Uso de SWR para traer los datos de la página actual, obtenemos también la función mutate
  const { data, error, isLoading, mutate } = useSWR<Curso[]>(apiUrl, fetcher);

  // Definimos las columnas de la tabla
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'fechaDeInicio', label: 'Fecha de Inicio' },
    { key: 'estado', label: 'Estado' },
    { key: 'cantidadAlumnos', label: 'Cantidad de Alumnos' },
  ];

  // Ordenamiento de los datos visibles (la API no ordena, se hace en el cliente)
  const sortedItems = useMemo(() => {
    if (!data) return [];

    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const col = sortDescriptor.column as keyof Curso;
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

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [data, sortDescriptor]);

  // Manejador para cambiar el ordenamiento (se aplica sobre los datos visibles)
  const onSortChange = (columnKey: keyof Curso) => {
    setSortDescriptor((prev) => {
      if (prev.column === columnKey) {
        // Invierte la dirección al hacer click nuevamente en la misma columna
        return {
          column: columnKey,
          direction:
            prev.direction === 'ascending' ? 'descending' : 'ascending',
        };
      }
      // Si se selecciona una columna nueva, se inicia en ascendente
      return {
        column: columnKey,
        direction: 'ascending',
      };
    });
  };

  // Renderizado de la celda según la columna
  const renderCell = useCallback((curso: Curso, columnKey: React.Key) => {
    const cellValue = curso[columnKey as keyof Curso];
    switch (columnKey) {
      case 'fechaDeInicio':
        return new Date(curso.fechaDeInicio).toLocaleDateString();
      case 'estado':
        return (
          <Chip
            className="capitalize"
            color={cellValue ? 'success' : 'danger'}
            size="sm"
            variant="flat"
          >
            {cellValue ? 'activo' : 'inactivo'}
          </Chip>
        );
      case 'cantidadAlumnos':
        return (
          <div className="relative">
            <span>{cellValue}</span>
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
                  <DropdownItem key="edit" onPress={() => editarCurso(curso)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    color="danger"
                    className="text-danger"
                    onPress={() => eliminarCurso(curso)}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  // Calcular la cantidad de páginas usando totalItems recibido por props
  const totalPages = Math.ceil(totalItems / pageSize);
  if (error) return <div>Error al cargar los cursos.</div>;

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(
    sortedItems[0] || null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  function eliminarCurso(curso: Curso) {
    setSelectedCurso(curso);
    setIsDeleteModalOpen(true);
  }

  function editarCurso(curso: Curso) {
    setSelectedCurso(curso);
    setIsEditModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-wrap gap-3">
        <Button
          color="success"
          variant="shadow"
          onPress={() => setIsCreateModalOpen(true)}
          startContent={<PlusIcon />}
          className="text-white"
        >
          Crear Curso
        </Button>

        <Button
          startContent={<TableExportIcon />}
          color="primary"
          variant="shadow"
        >
          Exportar a Excel
        </Button>
      </div>
      <Table
        aria-label="Tabla de cursos con paginación y ordenamiento"
        classNames={{
          wrapper: 'min-h-[397px]',
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              align="center"
              allowsSorting
              onClick={() => onSortChange(column.key as keyof Curso)}
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
          emptyContent="No Existen Cursos Registrados"
        >
          {(item: Curso) => (
            <TableRow
              className="cursor-pointer hover:bg-default-100"
              key={item.id || item.nombre}
              onDoubleClick={() => editarCurso(item)}
              onTouchEnd={(e) => {
                if (e.detail === 2) {
                  editarCurso(item);
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
      <div className="mt-4 flex justify-start">
        <Pagination
          page={page}
          total={totalPages}
          color="success"
          onChange={(newPage) => setPage(newPage)}
          isCompact
          showControls
        />
      </div>
      <EditarCursoModal
        isOpen={isEditModalOpen}
        onSave={(curso: Curso) => {
          console.log('Curso guardado', curso);
          if (data) {
            // Actualiza el curso en la caché local (sin revalidar)
            const updatedCourses = data.map((c) =>
              c.id === curso.id ? { ...c, ...curso } : c,
            );
            mutate(updatedCourses, false);
          }
          setIsEditModalOpen(false);
        }}
        onClose={() => {
          setSelectedCurso(null);
          setIsEditModalOpen(false);
        }}
        curso={selectedCurso as Curso}
      />

      <DeleteCursoModal
        isOpen={isDeleteModalOpen}
        onDelete={(id) => {
          console.log('Curso eliminado', id);
          // En lugar de actualizar la caché local, se borra y se vuelve a hacer la petición para tener la data actualizada
          mutate();
          updateTotalItems('subtract');
          setIsDeleteModalOpen(false);
        }}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        curso={selectedCurso as Curso}
      />
      <CrearCursoModal
        onCreate={() => {
          mutate();
          updateTotalItems('add');
        }}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
