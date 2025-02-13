'use client';
import { useState, useEffect, FormEvent } from 'react';
import { now, getLocalTimeZone } from '@internationalized/date';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { DatePicker } from '@heroui/date-picker';
import { Form } from '@heroui/form';
import { Select, SelectItem, Textarea } from '@heroui/react';
import { BorderBeam } from '../ui/border-beam';
import { Transaccion } from '@/lib/db';

interface CrearEgresoModalProps {
  onCreate: (transaccion: Transaccion) => void;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const CrearEgresoModal = ({
  onCreate,
  isOpen,
  onClose,
  userId,
}: CrearEgresoModalProps) => {
  // Campos del formulario
  const [categoria, setCategoria] = useState('Luz'); // Valor por defecto
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(now(getLocalTimeZone()));
  const [comentario, setComentario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleClose() {
    setCategoria('Luz');
    setMonto('');
    setFecha(now(getLocalTimeZone()));
    setComentario('');
    setIsLoading(false);
    setError('');
    onClose();
  }

  function crearEgreso(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const transaccion = {
      id_alumno: null,
      id_user: userId,
      tipo: 2, // Egreso
      categoria, // "Luz", "Agua", "Salario", "Impuestos", "Alquiler", "Internet" o "Otros"
      monto: parseFloat(monto),
      fecha: fecha.toString(),
      comentario: comentario || null,
    } as any as Transaccion;

    fetch('/api/transacciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaccion),
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          const data = await res.json();
          throw new Error(data.error);
        }
      })
      .then(() => {
        handleClose();
        onCreate(transaccion); // Se notifica la creación para que se actualice la lista, etc.
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
        {() => (
          <>
            <BorderBeam
              size={250}
              duration={20}
              delay={9}
              colorFrom="#f31260"
              colorTo="#f31260"
              borderWidth={2}
            />
            <ModalHeader className="flex flex-col place-items-center gap-1">
              Nuevo Egreso
            </ModalHeader>
            <ModalBody className="flex w-full">
              <Form onSubmit={crearEgreso} validationBehavior="native">
                <div className="flex w-full flex-col gap-5">
                  <Select
                    required
                    label="Categoría"
                    color="danger"
                    variant="underlined"
                    defaultSelectedKeys={['Luz']}
                    onSelectionChange={(key) => {
                      setCategoria(key?.currentKey ?? 'Luz');
                    }}
                  >
                    <SelectItem key="Luz">Luz</SelectItem>
                    <SelectItem key="Agua">Agua</SelectItem>
                    <SelectItem key="Salario">Salario</SelectItem>
                    <SelectItem key="Impuestos">Impuestos</SelectItem>
                    <SelectItem key="Alquiler">Alquiler</SelectItem>
                    <SelectItem key="Internet">Internet</SelectItem>
                    <SelectItem key="Otros">Otros</SelectItem>
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      required
                      label="Monto"
                      placeholder="Ingrese el monto"
                      variant="underlined"
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                    />
                    <DatePicker
                      variant="underlined"
                      color="danger"
                      label="Fecha de Transacción"
                      value={fecha}
                      onChange={(date) => date && setFecha(date)}
                      granularity="day"
                    />
                  </div>
                  <Textarea
                    label="Comentario"
                    variant="bordered"
                    maxRows={3}
                    value={comentario}
                    placeholder=""
                    onChange={(e) => setComentario(e.target.value)}
                  />
                </div>
                <p className="text-center text-sm text-danger-400">{error}</p>
                <div className="mt-5 flex gap-2 self-end p-2">
                  <Button color="default" variant="light" onPress={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="danger"
                    className="text-white"
                    variant="shadow"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Guardar
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
