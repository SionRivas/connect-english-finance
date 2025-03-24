'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LockIcon, LogOutIcon } from 'lucide-react';

import { Button } from '@heroui/react';
import { Input } from '@heroui/react';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/react';
import { BorderBeam } from '@/components/ui/border-beam';

const PanelVerificacionGeneral: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoginloading, setIsLoginLoading] = useState(false);
  const [isLogoutloading, setIsLogoutLoading] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/logout'); // Redirigir a login después de 1 minuto
    }, 600000); // 1 minuto

    return () => clearTimeout(timeout); // Limpiar el temporizador si el componente se desmonta
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const response = await fetch('/api/verificar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        router.push('/monitor'); // Redirigir al dashboard
      }
      7;
      if (result.error) {
        setIsLoginLoading(false);
        setIsInvalidPassword(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const signOut = () => {
    setIsLogoutLoading(true);
    router.push('/logout'); // Redirect to login page
  };

  return (
    <Card className="relative mt-8 flex w-full max-w-md flex-col items-center justify-center px-4 pb-8 pt-2 text-center">
      <BorderBeam
        size={250}
        duration={12}
        delay={9}
        colorFrom="#17c964"
        colorTo="#17c964"
        borderWidth={2}
      />
      <CardHeader className="flex flex-col space-y-1 p-6">
        <h3 className="text-center text-2xl font-semibold tracking-tight text-success-500"></h3>
        <p className="mt-2 text-3xl md:text-4xl">
          <span className="inline bg-gradient-to-b from-[#6FEE8D] to-[#17c964] bg-clip-text font-semibold tracking-tight text-transparent">
            Confirmar acceso
          </span>
        </p>
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
                isInvalid={isInvalidPassword}
                placeholder="Ingrese su contraseña"
                value={password}
                endContent={<LockIcon className="text-default-500" />}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsInvalidPassword(false);
                }}
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
            disabled={isLoginloading}
            isLoading={isLoginloading}
          >
            {isLoginloading ? '' : 'Confirmar'}
          </Button>
          <Button
            type="button"
            className="w-full"
            onPress={signOut}
            variant="bordered"
            isLoading={isLogoutloading}
            isDisabled={isLogoutloading}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PanelVerificacionGeneral;
