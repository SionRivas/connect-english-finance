'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockIcon, LogOutIcon } from 'lucide-react';

import { Button } from '@heroui/react';
import { Input } from '@heroui/react';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/react';

export default function PasswordConfirmation() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would validate the password against your backend
      // This is a mock validation for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (password === 'correct-password') {
        // Replace with actual validation
        console.log('Contraseña correcta');

        router.push('/dashboard'); // Redirect to main app
      } else {
        console.log('Contraseña incorrecta');

        if (Math.random() > 0.5) {
          // Just for demo, replace with actual logic
          signOut();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setIsLoading(true);

    router.push('/login'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col space-y-1 p-6">
          <h3 className="text-center text-2xl font-semibold tracking-tight text-success-500">
            Confirmar acceso
          </h3>
          <p className="text-muted-foreground text-center text-sm">
            Por favor ingrese su contraseña para continuar
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  endContent={<LockIcon className="text-default-500" />}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full text-white"
              color="success"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Continuar'}
            </Button>
            <Button
              type="button"
              className="w-full"
              onClick={signOut}
              disabled={isLoading}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
