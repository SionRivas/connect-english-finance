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
import { Transaccion } from '@/lib/db';

interface DeleteTransaccionModalProps {
  transaccion?: Transaccion | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (transaccionId: Number) => void;
}

export const DeleteTransaccionModal = ({
  transaccion,
  isOpen,
  onClose,
  onDelete,
}: DeleteTransaccionModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaccion) {
      console.log(`Preparing to delete transaccion: ${transaccion.id}`);
    }
  }, [transaccion]);

  function handleDelete() {
    setIsLoading(true);
    setError('');
    fetch('/api/transacciones', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: transaccion?.id,
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
        setTimeout(() => {
          onDelete(transaccion?.id as Number);
        }, 500);
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
      classNames={{
        backdrop: 'sm:backdrop-opacity-100 backdrop-opacity-0',
      }}
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
              <div className="flex w-full auto-rows-min grid-cols-2 flex-wrap gap-4 sm:grid">
                {transaccion?.tipo !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Tipo:</strong>{' '}
                    {transaccion.tipo === 1 ? 'Ingreso' : 'Egreso'}
                  </p>
                )}
                {transaccion?.categoria !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Categoría:</strong> {transaccion.categoria}
                  </p>
                )}
                {transaccion?.monto !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Monto:</strong>{' '}
                    <span>
                      {transaccion.monto}{' '}
                      <strong
                        className={
                          transaccion.tipo === 1
                            ? 'text-green-500'
                            : 'text-danger-300'
                        }
                      >
                        $
                      </strong>
                    </span>
                  </p>
                )}
                {transaccion?.fecha !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Fecha:</strong>{' '}
                    {new Date(transaccion.fecha).toLocaleDateString()}
                  </p>
                )}
                {transaccion?.comentario != null && (
                  <p className="col-span-2 flex items-center gap-2">
                    <strong>Comentario:</strong> {transaccion.comentario}
                  </p>
                )}
                {transaccion?.nombre_alumno != null && (
                  <p className="col-span-2 flex w-full items-center gap-2">
                    <strong>Nombre Alumno:</strong> {transaccion.nombre_alumno}
                  </p>
                )}
              </div>
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
