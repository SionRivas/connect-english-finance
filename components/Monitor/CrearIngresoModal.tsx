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
import { Curso, Alumno, Transaccion } from '@/lib/db';
import { MetodosPago, CategoriasIngresos } from '@/lib/constantes';

interface CrearIngresoModalProps {
  onCreate: (transaccion: Transaccion) => void;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const CrearIngresoModal = ({
  onCreate,
  isOpen,
  onClose,
  userId,
}: CrearIngresoModalProps) => {
  // Campos del formulario
  const [idAlumno, setIdAlumno] = useState('');
  const [categoria, setCategoria] = useState(CategoriasIngresos[0].id); // Valor por defecto
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(now(getLocalTimeZone()));
  const [metodo_pago, setMetodoPago] = useState(1);
  const [n_recibo, setNumeroRecibo] = useState('');
  const [comentario, setComentario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<String | null>(null);

  useEffect(() => {
    // Obtener la lista de cursos activos
    fetch('/api/cursos/getActive')
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (selectedCurso) {
      // Obtener la lista de alumnos activos en el curso seleccionado
      fetch(`/api/alumnos/getActiveByCurso?cursoId=${selectedCurso}`)
        .then((res) => res.json())
        .then((data) => setAlumnos(data as Alumno[]))
        .catch((err) => setError(err.message));
    } else {
      setAlumnos([]);
    }
  }, [selectedCurso]);

  function handleClose() {
    // Reiniciamos los estados y cerramos el modal
    setIdAlumno('');
    setCategoria(CategoriasIngresos[0].id);
    setMetodoPago(1);
    setNumeroRecibo('');
    setMonto('');
    setFecha(now(getLocalTimeZone()));
    setComentario('');
    setIsLoading(false);
    setError('');
    onClose();
  }

  function crearIngreso(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const transaccion = {
      id_alumno: Number(idAlumno) || null,
      id_user: userId,
      tipo: 1, // Ingreso
      categoria, // "Mensualidad", "Inscripcion" o "Otros"
      metodo_pago: metodo_pago,
      n_recibo,
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
      backdrop="opaque"
      onClose={handleClose}
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
              colorFrom="#17c964"
              colorTo="#17c964"
              borderWidth={2}
            />
            <ModalHeader className="flex flex-col place-items-center gap-1">
              Nuevo Ingreso
            </ModalHeader>
            <ModalBody className="flex w-full">
              <Form onSubmit={crearIngreso} validationBehavior="native">
                <div className="flex w-full flex-col gap-5">
                  <div className="flex gap-2">
                    <Select
                      required
                      label="Categoría"
                      className="min-w-32 max-w-32"
                      color="success"
                      variant="underlined"
                      defaultSelectedKeys={[
                        CategoriasIngresos[0].id.toString(),
                      ]}
                      onSelectionChange={(key) => {
                        setCategoria(Number(key?.currentKey ?? 1));
                        if (key?.currentKey === '1') {
                          setMonto(
                            alumnos
                              .find(
                                (alumno) =>
                                  alumno.id.toString() === idAlumno.toString(),
                              )
                              ?.mensualidad.toString() ?? '',
                          );
                        } else if (key?.currentKey === '2') {
                          setMonto(
                            alumnos
                              .find(
                                (alumno) =>
                                  alumno.id.toString() === idAlumno.toString(),
                              )
                              ?.inscripcion.toString() ?? '',
                          );
                        }

                        if (key?.currentKey === '3') {
                          setMonto('');
                          setSelectedCurso(null);
                          setIdAlumno('');
                        }
                      }}
                    >
                      {CategoriasIngresos.map((categoria) => (
                        <SelectItem
                          key={categoria.id}
                          textValue={categoria.nombre}
                        >
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      isRequired={categoria !== 3}
                      label="Curso"
                      variant="underlined"
                      isDisabled={categoria === 3}
                      onSelectionChange={(key) => {
                        setSelectedCurso(key?.currentKey ?? null);
                      }}
                    >
                      {cursos.map((curso) => (
                        <SelectItem key={curso.id} textValue={curso.nombre}>
                          <span className="text-xs">{curso.nombre}</span>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Select
                    isRequired={categoria !== 3}
                    label="Alumno"
                    variant="underlined"
                    isDisabled={!selectedCurso || categoria === 3}
                    onSelectionChange={(key) => {
                      setIdAlumno(key.anchorKey?.toString() ?? '');

                      if (categoria === 1) {
                        setMonto(
                          alumnos
                            .find(
                              (alumno) =>
                                alumno.id.toString() ===
                                key.anchorKey?.toString(),
                            )
                            ?.mensualidad.toString() ?? '',
                        );
                      } else if (categoria === 2) {
                        setMonto(
                          alumnos
                            .find(
                              (alumno) =>
                                alumno.id.toString() ===
                                key.anchorKey?.toString(),
                            )
                            ?.inscripcion.toString() ?? '',
                        );
                      }
                    }}
                  >
                    {alumnos.map((alumno) => (
                      <SelectItem key={alumno.id} textValue={alumno.nombre}>
                        <span className="text-xs">{alumno.nombre}</span>
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      required
                      className="max-w-32"
                      label="Monto"
                      placeholder="Ingrese el monto"
                      variant="underlined"
                      type="number"
                      value={monto}
                      validate={(value) => {
                        if (value === '') {
                          return 'El monto es requerido';
                        } else if (parseFloat(value) <= 0) {
                          return 'El monto debe ser mayor a cero';
                        }
                      }}
                      onChange={(e) => setMonto(e.target.value)}
                    />
                    <DatePicker
                      variant="underlined"
                      color="success"
                      label="Fecha de Transacción"
                      value={fecha}
                      onChange={(date) => date && setFecha(date)}
                      granularity="day"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      isRequired
                      label="Método de Pago"
                      variant="underlined"
                      color="success"
                      defaultSelectedKeys={['1']}
                      onSelectionChange={(key) =>
                        setMetodoPago(Number(key?.currentKey))
                      }
                    >
                      {MetodosPago.map((metodo) => (
                        <SelectItem key={metodo.id} textValue={metodo.nombre}>
                          <span className="text-xs">{metodo.nombre}</span>
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      isRequired
                      label="Nº de Recibo"
                      placeholder="Ingrese el número de recibo"
                      variant="underlined"
                      type="number"
                      value={n_recibo}
                      onChange={(e) => setNumeroRecibo(e.target.value)}
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
                  <Button color="danger" variant="light" onPress={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="success"
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
