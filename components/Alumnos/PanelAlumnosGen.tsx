'use client';
import { useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Tooltip } from '@heroui/react';

import { Alumno, type Curso } from '@/lib/db';
import SearchCurso from './SearchCurso';
import { CrearAlumnoModal } from './CrearAlumnoModal';
import { PlusIcon, TableExportIcon } from '../icons';
import TableAlumnos from './TableAlumnos';
import { EditAlumnoModal } from './EditAlumnoModal';
import { DeleteAlumnoModal } from './DeleteAlumnoModal';
import { InspeccionarAlumnoModal } from './InspeccionarAlumnoModal';

interface PanelAlumnos {
  CursosActivosInit: string;
}

export const today = new Date();
export const next15th = new Date(today.getFullYear(), today.getMonth(), 15);
export const next30th = new Date(today.getFullYear(), today.getMonth(), 30);

if (today.getDate() > 15) {
  next15th.setMonth(next15th.getMonth() + 1);
}
if (today.getDate() > 30) {
  next30th.setMonth(next30th.getMonth() + 1);
}

export default function PanelAlumnos({ CursosActivosInit }: PanelAlumnos) {
  const [CursosActivos, setCursosActivos] = useState<Curso[]>(
    JSON.parse(CursosActivosInit),
  );

  const [selectedCurso, setSelectedCurso] = useState<Curso>(CursosActivos[0]);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);

  const [isCreatingAlumno, setIsCreatingAlumno] = useState<boolean>(false);
  const [isEditingAlumno, setIsEditingAlumno] = useState<boolean>(false);
  const [isDeletingAlumno, setIsDeletingAlumno] = useState<boolean>(false);
  const [isInspectingAlumno, setIsInspectingAlumno] = useState<boolean>(false);

  const [refreshTable, setRefreshTable] = useState<boolean>(false);

  const handleCreateAlumno = () => {
    setIsCreatingAlumno(false);
    setRefreshTable(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-wrap gap-2">
        <SearchCurso
          OnSelecCurso={(curso) => setSelectedCurso(curso)}
          CursosActivosInit={CursosActivos}
        />
        <div className="flex w-full flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <Button
              onPress={() => setIsCreatingAlumno(true)}
              startContent={<PlusIcon />}
              color="success"
              variant="shadow"
              className="text-white"
            >
              Crear Alumno
            </Button>
          </div>
          <div className="flex flex-wrap place-items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                selectedCurso.estado ? 'bg-success' : 'bg-danger'
              }`}
            >
              &nbsp;
            </span>
            <p>{new Date(selectedCurso.fechaDeInicio).toLocaleDateString()}</p>
            <p>Alumnos: {selectedCurso.cantidadAlumnos}</p>
            <p className="flex gap-1">
              Próximo cortes:{' '}
              <span className="font-semibold text-success-500">
                {next15th.toLocaleDateString()}
              </span>
              y
              <span className="font-semibold text-success-500">
                {next30th.toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        <TableAlumnos
          today={today}
          next15th={next15th}
          next30th={next30th}
          cursoId={selectedCurso.id}
          onDelete={(alumno: Alumno) => {
            setIsDeletingAlumno(true);
            setSelectedAlumno(alumno);
          }}
          onEdit={(alumno: Alumno) => {
            setIsEditingAlumno(true);
            setSelectedAlumno(alumno);
          }}
          onInspect={(alumno: Alumno) => {
            setIsInspectingAlumno(true);
            setSelectedAlumno(alumno);
          }}
          refresh={refreshTable}
          onRefreshed={() => setRefreshTable(false)}
        />
      </div>
      <CrearAlumnoModal
        isOpen={isCreatingAlumno}
        onClose={() => {
          setIsCreatingAlumno(false);
        }}
        onCreate={handleCreateAlumno}
        cursoID={selectedCurso.id}
      />
      <EditAlumnoModal
        isOpen={isEditingAlumno}
        onClose={() => {
          setIsEditingAlumno(false);
          setSelectedAlumno(null);
        }}
        onUpdate={() => {
          setRefreshTable(true);
        }}
        alumno={selectedAlumno}
      />
      <DeleteAlumnoModal
        isOpen={isDeletingAlumno}
        onClose={() => {
          setIsDeletingAlumno(false);
        }}
        onDelete={() => {
          setRefreshTable(true);
        }}
        alumno={selectedAlumno}
      />
      <InspeccionarAlumnoModal
        isOpen={isInspectingAlumno}
        onClose={() => {
          setIsInspectingAlumno(false);
        }}
        alumno={selectedAlumno}
        curso={selectedCurso}
      />
    </div>
  );
}
