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
import { type Curso } from '@/lib/db';

interface DeleteCursoModalProps {
  curso?: Curso;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (cursoId: Number) => void;
}

export const DeleteCursoModal = ({
  curso,
  isOpen,
  onClose,
  onDelete,
}: DeleteCursoModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (curso) {
      console.log(`Preparing to delete curso: ${curso.nombre}`);
    }
  }, [curso]);

  function handleDelete() {
    setIsLoading(true);
    setError('');
    fetch('/api/cursos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: curso?.id,
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
        onDelete(curso?.id as Number);
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
      backdrop="opaque"
      onClose={() => {
        setIsLoading(false);
        setError('');
        onClose();
      }}
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
              <p>¿Está seguro que desea eliminar el curso</p>
              <p className="font-bold">{curso?.nombre}?</p>
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
