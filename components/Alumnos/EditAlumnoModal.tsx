'use client';
import { useState, useEffect, FormEvent } from 'react';
import { now, getLocalTimeZone } from '@internationalized/date';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { DatePicker } from '@heroui/date-picker';
import { Form } from '@heroui/form';
import { Select, SelectItem } from '@heroui/react';
import { Alumno } from '@/lib/db';

interface EditAlumnoModalProps {
  onUpdate: () => void;
  isOpen: boolean;
  onClose: () => void;
  alumno: Alumno | null;
}

export const EditAlumnoModal = ({
  onUpdate,
  isOpen,
  onClose,
  alumno,
}: EditAlumnoModalProps) => {
  const [nombre, setNombre] = useState('');
  const [encargado, setEncargado] = useState('');
  const [numeroContacto1, setNumeroContacto1] = useState('');
  const [numeroContacto2, setNumeroContacto2] = useState('');
  const [mensualidad, setMensualidad] = useState('');
  const [inscripcion, setInscripcion] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(now(getLocalTimeZone()));
  const [diaCorte, setDiaCorte] = useState('30');
  const [estado, setEstado] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (alumno) {
      setNombre(alumno.nombre);
      setEncargado(alumno.encargado || '');
      setNumeroContacto1(alumno.numero_contacto_1.toString());
      setNumeroContacto2(alumno.numero_contacto_2?.toString() || '');
      setMensualidad(alumno.mensualidad.toString());
      setInscripcion(alumno.inscripcion.toString());
      setFechaRegistro(
        now(getLocalTimeZone()).set({
          year: new Date(alumno.fecha_registro).getFullYear(),
          month: new Date(alumno.fecha_registro).getMonth() + 1,
          day: new Date(alumno.fecha_registro).getDate(),
        }),
      );
      setDiaCorte(alumno.dia_corte.toString());
      setEstado(alumno.estado);
    }
  }, [alumno]);

  function handleClose() {
    setNombre('');
    setEncargado('');
    setNumeroContacto1('');
    setNumeroContacto2('');
    setMensualidad('');
    setInscripcion('');
    setFechaRegistro(now(getLocalTimeZone()));
    setDiaCorte('30');
    setEstado(true);
    setIsLoading(false);
    setError('');
    onClose();
  }

  function editarAlumno(e: FormEvent) {
    e.preventDefault();
    if (!alumno) return;
    setIsLoading(true);
    setError('');
    fetch(`/api/alumnos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: alumno.id,
        nombre,
        encargado,
        estado: estado ? true : false,
        numero_contacto_1: numeroContacto1,
        numero_contacto_2: numeroContacto2,
        mensualidad,
        inscripcion,
        fecha_registro: fechaRegistro.toString(),
        id_curso: alumno.id_curso,
        dia_corte: diaCorte,
      }),
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
        onUpdate(); // Llamar a la función onUpdate después de editar el alumno
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
      onClose={handleClose}
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="3xl"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col place-items-center gap-1">
              Editar Alumno
            </ModalHeader>
            <ModalBody className="flex w-full">
              <Form onSubmit={editarAlumno} validationBehavior="native">
                <div className="flex w-full flex-col gap-5 md:flex-row">
                  <div className="flex w-full flex-col gap-3">
                    <p className="mb-3 text-sm font-semibold text-success-500">
                      Información Personal
                    </p>
                    <div className="flex place-items-center gap-2">
                      <Input
                        autoFocus
                        required
                        label="Nombre"
                        placeholder="Ingrese el nombre del alumno"
                        variant="underlined"
                        color="success"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                      <Button
                        className=""
                        color={estado ? 'success' : 'default'}
                        variant="flat"
                        onPress={() => setEstado(!estado)}
                      >
                        {estado ? 'Activo' : 'Inactivo'}
                      </Button>
                    </div>
                    <Input
                      label="Encargado"
                      placeholder="Ingrese el nombre del encargado"
                      variant="underlined"
                      color="success"
                      value={encargado}
                      onChange={(e) => setEncargado(e.target.value)}
                    />

                    <div className="flex gap-2">
                      <Input
                        isRequired
                        label="Contacto 1"
                        placeholder="Ingrese el contacto"
                        variant="underlined"
                        type="number"
                        validate={(value) => {
                          if (value.length > 8) {
                            return 'El número de contacto no puede ser mayor a 8 dígitos';
                          }
                        }}
                        value={numeroContacto1}
                        onChange={(e) => setNumeroContacto1(e.target.value)}
                      />
                      <Input
                        label="Contacto 2 (Opcional)"
                        placeholder="Ingrese el contacto"
                        variant="underlined"
                        type="number"
                        validate={(value) => {
                          if (value.length > 8) {
                            return 'El número de contacto no puede ser mayor a 8 dígitos';
                          }
                        }}
                        value={numeroContacto2}
                        onChange={(e) => setNumeroContacto2(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-3">
                    <p className="mb-3 text-sm font-semibold text-success-500">
                      Información de Inscripción
                    </p>
                    <Input
                      isRequired
                      label="Inscripción"
                      placeholder="Ingrese la inscripción"
                      variant="underlined"
                      type="number"
                      value={inscripcion}
                      onChange={(e) => setInscripcion(e.target.value)}
                    />
                    <Input
                      isRequired
                      label="Mensualidad"
                      placeholder="Ingrese la mensualidad"
                      variant="underlined"
                      type="number"
                      value={mensualidad}
                      onChange={(e) => setMensualidad(e.target.value)}
                    />
                    <div className="flex gap-5">
                      <DatePicker
                        variant="underlined"
                        color="success"
                        label="Fecha de Registro"
                        value={fechaRegistro}
                        onChange={(date) => date && setFechaRegistro(date)}
                        granularity="day"
                      />

                      <Select
                        placeholder="Día de Corte"
                        className="w-1/2"
                        variant="underlined"
                        label="Día de Corte"
                        selectedKeys={[diaCorte]}
                        onChange={(e) => setDiaCorte(e.target.value)}
                      >
                        <SelectItem key={'30'}>30</SelectItem>
                        <SelectItem key={'15'}>15</SelectItem>
                      </Select>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-danger-400">{error}</p>
                <div className="mt-5 flex gap-2 self-end p-2">
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
                </div>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
