'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { BorderBeam } from '@/components/ui/border-beam';
import { Alumno, Curso } from '@/lib/db';
import { TablaAlumnoInspect } from '@/components/Alumnos/TablaAlumnoInspect';
import { Tooltip } from '@heroui/react';
import { TableExportIcon } from '../icons';

interface InspeccionarAlumnoModalProps {
  alumno: Alumno | null;
  curso: Curso | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InspeccionarAlumnoModal = ({
  alumno,
  curso,
  isOpen,
  onClose,
}: InspeccionarAlumnoModalProps) => {
  if (!alumno || !curso) return null;

  return (
    <Modal
      backdrop="opaque"
      onClose={onClose}
      isOpen={isOpen}
      placement="center"
      className="overflow-hidden"
      scrollBehavior="inside"
      size="lg"
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
              Inspeccionar Alumno
            </ModalHeader>
            <ModalBody className="flex w-full flex-col gap-5 p-5">
              <div className="flex flex-col gap-2">
                <p className="flex gap-2">
                  <strong>Nombre:</strong> {alumno.nombre}
                </p>
                <p className="flex gap-2">
                  <strong>Curso:</strong> {curso.nombre}
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <strong>Mensualidad:</strong> ${alumno.mensualidad}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Inscripción:</strong> ${alumno.inscripcion}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Fecha de Registro:</strong>{' '}
                    {new Date(alumno.fecha_registro).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Día de Corte:</strong> {alumno.dia_corte}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Estado:</strong>{' '}
                    {alumno.estado ? 'Activo' : 'Inactivo'}
                  </p>
                </div>

                <div className="flex place-content-center place-items-end justify-between gap-2">
                  <p className="">Transacciones:</p>

                  <Button
                    startContent={<TableExportIcon />}
                    color="primary"
                    variant="flat"
                  >
                    Exportar a Excel
                  </Button>
                </div>
                <TablaAlumnoInspect transacciones={alumno.transacciones} />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
