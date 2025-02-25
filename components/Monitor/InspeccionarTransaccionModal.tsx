'use client';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Button } from '@heroui/button';
import { BorderBeam } from '../ui/border-beam';
import { Transaccion } from '@/lib/db';

interface InspeccionarTransaccionModalProps {
  transaccion: Transaccion | null;
  users: string;
  isOpen: boolean;
  onClose: () => void;
}

export const InspeccionarTransaccionModal = ({
  transaccion,
  isOpen,
  onClose,
  users,
}: InspeccionarTransaccionModalProps) => {
  if (!transaccion) return null;

  const {
    id,
    id_alumno,
    id_user,
    tipo,
    categoria,
    monto,
    fecha,
    comentario,
    nombre_alumno,
  } = transaccion;

  const user = JSON.parse(users).find((u: any) => u.id === id_user) as {
    username: string;
  };
  return (
    <Modal
      onClose={onClose}
      backdrop="opaque"
      isOpen={isOpen}
      className="overflow-hidden"
      placement="center"
      size="md"
    >
      <ModalContent>
        {() => (
          <>
            <BorderBeam
              size={250}
              duration={20}
              delay={9}
              colorFrom="#17c964"
              colorTo="#17c964"
              borderWidth={2}
            />
            <ModalHeader className="flex flex-col place-items-center gap-1">
              Inspeccionar Transacción
            </ModalHeader>
            <ModalBody className="flex w-full flex-col gap-5 p-5">
              <div className="flex w-full auto-rows-min grid-cols-2 flex-wrap gap-4 sm:grid">
                {tipo !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Tipo:</strong> {tipo === 1 ? 'Ingreso' : 'Egreso'}
                  </p>
                )}
                {categoria !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Categoría:</strong> {categoria}
                  </p>
                )}
                {monto !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Monto:</strong>{' '}
                    <span>
                      {' '}
                      {monto}{' '}
                      <strong
                        className={
                          tipo === 1 ? 'text-green-500' : 'text-danger-300'
                        }
                      >
                        $
                      </strong>
                    </span>
                  </p>
                )}
                {fecha !== undefined && (
                  <p className="flex items-center gap-2">
                    <strong>Fecha:</strong>{' '}
                    {new Date(fecha).toLocaleDateString()}
                  </p>
                )}
                {comentario != null && (
                  <p className="col-span-2 flex items-center gap-2">
                    <strong>Comentario:</strong> {comentario}
                  </p>
                )}
                {nombre_alumno != null && (
                  <p className="col-span-2 flex w-full items-center gap-2">
                    <strong>Nombre Alumno:</strong> {nombre_alumno}
                  </p>
                )}
              </div>

              <div className="flex w-full place-content-between place-items-center gap-2 self-end p-2">
                <p className="text-sm text-gray-500">
                  <strong>Registrado por:</strong> {user.username}
                </p>
                <Button color="success" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
