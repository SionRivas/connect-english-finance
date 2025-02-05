"use client";
import { PlusIcon } from "@/components/icons";
import { useState, FormEvent } from "react"; // Add this import
import { now, getLocalTimeZone } from "@internationalized/date";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { BorderBeam } from "@/components/ui/border-beam";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";
import { Form } from "@heroui/form";
// ... other imports remain the same ...

export const CrearCursoModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nombre, setNombre] = useState("");
  const [fechaDeInicio, setFechaDeInicio] = useState(now(getLocalTimeZone()));
  const [isLoading, setIsLoading] = useState(false);
  function onClose() {
    setNombre("");
    setFechaDeInicio(now(getLocalTimeZone()));
    setIsLoading(false);
    onOpenChange();
  }

  function crearCurso(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    fetch("/api/cursos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        fechaDeInicio: fechaDeInicio.toString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        onClose();
        console.log(data);
      });
  }

  return (
    <>
      <Button
        startContent={<PlusIcon />}
        color="success"
        variant="shadow"
        onPress={onOpen}
        className="text-white"
      >
        Nuevo Curso
      </Button>
      <Modal
        onClose={onClose}
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        className="overflow-hidden"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <BorderBeam
                size={250}
                duration={20}
                delay={9}
                colorFrom="#41db78"
                colorTo="#2a8e4e"
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
    </>
  );
};
