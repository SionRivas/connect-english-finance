'use client';
import { PlusIcon } from '@/components/icons';
import { useState, FormEvent, useEffect } from 'react';
import { getLocalTimeZone, parseDate } from '@internationalized/date';

import { DateValue, now, parseAbsoluteToLocal } from '@internationalized/date';
import { useDateFormatter } from '@react-aria/i18n';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { BorderBeam } from '@/components/ui/border-beam';
import { DatePicker } from '@heroui/date-picker';
import { Form } from '@heroui/form';
import { type Curso } from '@/lib/db';

interface EditarCursoModalProps {
  curso?: Curso;
  isOpen: boolean;
  onClose: () => void;
  onSave: (curso: Curso) => void;
}

export const EditarCursoModal = ({
  curso,
  isOpen,
  onClose,
  onSave,
}: EditarCursoModalProps) => {
  const [nombre, setNombre] = useState(curso?.nombre || '');
  const [fechaDeInicio, setFechaDeInicio] = useState<DateValue | null>(null);
  const [estado, setEstado] = useState(curso?.estado || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (curso) {
      setNombre(curso.nombre);
      setFechaDeInicio(
        parseAbsoluteToLocal(new Date(curso.fechaDeInicio).toISOString()),
      );

      setEstado(curso.estado ? 1 : 0);
      console.log(fechaDeInicio);
    }
  }, [curso]);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    fetch('/api/cursos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: curso?.id,
        nombre,
        fechaDeInicio: fechaDeInicio?.toString(),
        estado: estado === 1,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error);
          });
        }
      })
      .then((data) => {
        onSave({
          id: curso?.id,
          nombre,
          fechaDeInicio:
            fechaDeInicio?.toDate(getLocalTimeZone()).getTime() || 0,
          estado: estado === 1,
          cantidadAlumnos: curso?.cantidadAlumnos || 0,
        } as Curso);

        setIsLoading(false);
        setError('');
        onClose();
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }

  return (
    <Modal
      backdrop="opaque"
      onClose={onClose}
      isOpen={isOpen}
      placement="center"
      className="overflow-hidden"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <BorderBeam
              size={250}
              duration={20}
              delay={9}
              colorFrom="#17c964"
              colorTo="#17c964"
              borderWidth={2}
            />

            <ModalHeader className="flex flex-col gap-1">
              {curso ? 'Editar Curso' : 'Nuevo Curso'}
            </ModalHeader>
            <Form onSubmit={handleSave} validationBehavior="native">
              <ModalBody className="w-full">
                <Input
                  autoFocus
                  isRequired
                  label="Nombre"
                  placeholder="Ingrese el nombre del curso"
                  variant="underlined"
                  color="success"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <DatePicker
                  color="success"
                  variant="underlined"
                  label="Fecha de Inicio"
                  value={fechaDeInicio}
                  granularity="day"
                  onChange={setFechaDeInicio}
                />
                <Button
                  className="w-min"
                  color={estado === 1 ? 'success' : 'default'}
                  variant="flat"
                  onPress={() => setEstado(estado === 1 ? 0 : 1)}
                >
                  {estado === 1 ? 'Activo' : 'Inactivo'}
                </Button>
                <p className="text-sm text-danger-400">{error}</p>
              </ModalBody>
              <ModalFooter className="self-end">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="text-white"
                  color="success"
                  variant="shadow"
                  type="submit"
                  isLoading={isLoading}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
