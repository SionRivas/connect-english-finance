'use client';
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { BorderBeam } from '@/components/ui/border-beam';
import { type Alumno } from '@/lib/db';

interface DeleteAlumnoModalProps {
  alumno?: Alumno | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (alumnoId: Number) => void;
}

export const DeleteAlumnoModal = ({
  alumno,
  isOpen,
  onClose,
  onDelete,
}: DeleteAlumnoModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (alumno) {
      console.log(`Preparing to delete alumno: ${alumno.nombre}`);
    }
  }, [alumno]);

  function handleDelete() {
    setIsLoading(true);
    setError('');
    fetch('/api/alumnos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: alumno?.id,
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
        onDelete(alumno?.id as Number);
        setIsLoading(false);
        onClose();
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }

  return (
    <Modal
      onClose={() => {
        setIsLoading(false);
        setError('');
        onClose();
      }}
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
              colorFrom="#f31260"
              colorTo="#f31260"
              borderWidth={2}
            />

            <ModalHeader className="flex flex-col gap-1">
              Confirmar Eliminación
            </ModalHeader>
            <ModalBody className="w-full">
              <p>¿Está seguro que desea eliminar al alumno</p>
              <p className="font-bold">{alumno?.nombre}?</p>
              <p className="text-sm text-danger-400">{error}</p>
            </ModalBody>
            <ModalFooter className="self-end">
              <Button color="default" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                className="text-white"
                color="danger"
                variant="shadow"
                onPress={handleDelete}
                isLoading={isLoading}
              >
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
