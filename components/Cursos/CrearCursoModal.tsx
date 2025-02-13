'use client';
import { PlusIcon, SaveIcon } from '@/components/icons';
import { useState, FormEvent } from 'react';
import { now, getLocalTimeZone } from '@internationalized/date';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { BorderBeam } from '@/components/ui/border-beam';
import { DatePicker } from '@heroui/date-picker';
import { Form } from '@heroui/form';

interface CrearCursoModalProps {
  onCreate: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CrearCursoModal = ({
  onCreate,
  isOpen,
  onClose,
}: CrearCursoModalProps) => {
  const [nombre, setNombre] = useState('');
  const [fechaDeInicio, setFechaDeInicio] = useState(now(getLocalTimeZone()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleClose() {
    setNombre('');
    setFechaDeInicio(now(getLocalTimeZone()));
    setIsLoading(false);
    setError('');
    onClose();
  }

  function crearCurso(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    fetch('/api/cursos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: nombre,
        fechaDeInicio: fechaDeInicio.toString(),
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
        handleClose();
        onCreate(); // Llamar a la función onCreate después de crear el curso
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }

  return (
    <Modal
      onClose={handleClose}
      backdrop="blur"
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
              Nuevo Curso
            </ModalHeader>
            <Form onSubmit={crearCurso} validationBehavior="native">
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
                  label="Fecha de inicio"
                  value={fechaDeInicio}
                  onChange={(date) => date && setFechaDeInicio(date)}
                  granularity="day"
                />
                <p className="text-sm text-danger-400">{error}</p>
              </ModalBody>
              <ModalFooter className="self-end">
                <Button color="danger" variant="light" onPress={handleClose}>
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
