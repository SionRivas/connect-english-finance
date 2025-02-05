"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { type Curso } from "@/lib/db";

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

  useEffect(() => {
    if (curso) {
      console.log(`Preparing to delete curso: ${curso.nombre}`);
    }
  }, [curso]);

  function handleDelete() {
    setIsLoading(true);
    fetch("/api/cursos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: curso?.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        onDelete(curso?.id as Number);
        setIsLoading(false);
        onClose();
      });
  }

  return (
    <Modal
      onClose={onClose}
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
              colorFrom="#db4141"
              colorTo="#8e2a2a"
              borderWidth={2}
            />

            <ModalHeader className="flex flex-col gap-1">
              Confirmar Eliminación
            </ModalHeader>
            <ModalBody className="w-full">
              <p>¿Está seguro que desea eliminar el curso "{curso?.nombre}"?</p>
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
