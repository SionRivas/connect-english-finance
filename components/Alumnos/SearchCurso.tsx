'use client';
import { useState } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';

import { type Curso } from '@/lib/db';
import { ActivityIcon, JustmidLineIcon } from '../icons';

interface SearchCurso {
  CursosActivosInit: Curso[];
  OnSelecCurso: (curso: Curso) => void;
}
export default function SearchCurso({
  CursosActivosInit,
  OnSelecCurso,
}: SearchCurso) {
  const [CursosActivos, setCursosActivos] =
    useState<Curso[]>(CursosActivosInit);
  const [justActive, setJustActive] = useState<boolean>(true);
  const [isloading, setIsLoading] = useState<boolean>(false);
  function handleCursoSelection(id: number) {
    const curso = CursosActivos.find((c) => c.id == id);
    if (curso) {
      OnSelecCurso(curso);
    }
  }
  const [allCursos, setAllCursos] = useState<Curso[]>([]);
  async function handleJustActive() {
    setJustActive(!justActive);

    setIsLoading(true);
    if (allCursos.length === 0) {
      await fetch('/api/cursos/getAll')
        .then((response) => response.json())
        .then((data) => {
          setCursosActivos(data);
          setAllCursos(data);
          setIsLoading(false);
        });
    } else if (justActive) {
      setCursosActivos(allCursos);
      setIsLoading(false);
    } else {
      setCursosActivos(CursosActivosInit);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-nowrap place-items-center gap-2">
      <Button
        size="sm"
        isIconOnly
        isLoading={isloading}
        onPress={handleJustActive}
        color={justActive ? 'success' : 'default'}
        variant="solid"
        className="text-white"
      >
        {justActive ? <ActivityIcon /> : <JustmidLineIcon />}
      </Button>
      <Autocomplete
        className="max-w-xs"
        defaultItems={CursosActivos}
        defaultSelectedKey={CursosActivos[0].id.toString()}
        onSelectionChange={(id) => handleCursoSelection(id as number)}
        aria-label="Cursos"
      >
        {(item) => (
          <AutocompleteItem key={item.id} textValue={item.nombre}>
            <div className="flex items-center gap-2">
              <div className="flex place-content-center place-items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.estado ? 'bg-success-500' : 'bg-danger-500'
                  }`}
                >
                  &nbsp;
                </span>
                <span className="text-small">{item.nombre}</span>
                <span className="text-tiny text-default-400">
                  {item.cantidadAlumnos}
                </span>
              </div>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
