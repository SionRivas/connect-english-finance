"use client";
import { useState } from "react";
import { Autocomplete, AutocompleteItem, Button, Tooltip } from "@heroui/react";

import { Alumno, type Curso } from "@/lib/db";
import SearchCurso from "./SearchCurso";
import { CrearAlumnoModal } from "./CrearAlumnoModal";
import { PlusIcon, TableExportIcon } from "../icons";
import TableAlumnos from "./TableAlumnos";
import { EditAlumnoModal } from "./EditAlumnoModal";
import { DeleteAlumnoModal } from "./DeleteAlumnoModal";

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
    JSON.parse(CursosActivosInit)
  );

  const [selectedCurso, setSelectedCurso] = useState<Curso>(CursosActivos[0]);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);

  const [isCreatingAlumno, setIsCreatingAlumno] = useState<boolean>(false);
  const [isEditingAlumno, setIsEditingAlumno] = useState<boolean>(false);
  const [isDeletingAlumno, setIsDeletingAlumno] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 w-full flex-wrap">
        <SearchCurso
          OnSelecCurso={(curso) => setSelectedCurso(curso)}
          CursosActivosInit={CursosActivos}
        />
        <div className="flex gap-2 w-full justify-between flex-wrap">
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
            <Tooltip
              content="Exportar tabla a Excel"
              showArrow={true}
              placement="bottom"
              color="primary"
            >
              <Button
                startContent={<TableExportIcon />}
                isIconOnly
                color="primary"
                variant="shadow"
              />
            </Tooltip>
          </div>
          <div className=" flex gap-2 place-items-center flex-wrap">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedCurso.estado ? "bg-success" : "bg-danger"
              }`}
            >
              &nbsp;
            </span>
            <p>{new Date(selectedCurso.fechaDeInicio).toLocaleDateString()}</p>
            <p>Alumnos: {selectedCurso.cantidadAlumnos}</p>
            <p className="flex gap-1">
              Próximo cortes:{" "}
              <span className=" font-semibold text-success-500">
                {next15th.toLocaleDateString()}
              </span>
              y
              <span className=" font-semibold text-success-500">
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
            console.log(alumno);
          }}
        />
      </div>
      <CrearAlumnoModal
        isOpen={isCreatingAlumno}
        onClose={() => {
          setIsCreatingAlumno(false);
        }}
        onCreate={() => {}}
        cursoID={selectedCurso.id}
      />
      <EditAlumnoModal
        isOpen={isEditingAlumno}
        onClose={() => {
          setIsEditingAlumno(false);
          setSelectedAlumno(null);
        }}
        onUpdate={() => {}}
        alumno={selectedAlumno}
      />
      <DeleteAlumnoModal
        isOpen={isDeletingAlumno}
        onClose={() => {
          setIsDeletingAlumno(false);
        }}
        onDelete={() => {}}
        alumno={selectedAlumno}
      />
    </div>
  );
}
