'use client';

import { useState, FormEvent } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Form } from '@heroui/form';

interface CambiarPasswordProps {
  nombre: string;
}

export const CambiarPassword = ({ nombre }: CambiarPasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contraseña actualizada con éxito');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-10 max-w-md px-4 py-6">
      <CardHeader className="text-center">
        <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
      </CardHeader>
      <Form onSubmit={handleSubmit} validationBehavior="native">
        <CardBody>
          <div className="flex flex-col gap-4">
            <Input
              required
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              required
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              required
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <p className="text-center text-sm text-danger-400">{error}</p>
            )}
            {message && (
              <p className="text-center text-sm text-success-400">{message}</p>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-2">
          <Button
            color="success"
            className="text-white"
            variant="shadow"
            type="submit"
            isLoading={isLoading}
          >
            Actualizar
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};
