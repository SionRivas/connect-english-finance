import type React from 'react';
import PanelVerificacionGeneral from '@/components/Contraseñas/PanelVerificacionGeneral';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function PasswordConfirmation() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/');
  }

  const passwordPending = (await cookies()).get('password_pending')?.value;
  if (passwordPending !== 'true') {
    return redirect('/monitor'); // Redirigir a /monitor si la cookie es 'true'
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PanelVerificacionGeneral />
    </div>
  );
}
