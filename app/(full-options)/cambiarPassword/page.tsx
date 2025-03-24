import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';
import { CambiarPassword } from '@/components/Contraseñas/CambiarPassword';

export default async function CambiarPasswordPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/');
  }

  const passwordPending = (await cookies()).get('password_pending')?.value;
  if (passwordPending === 'true') {
    return redirect('/logout'); // Redirigir al apartado de verificación
  }
  return <CambiarPassword nombre={user.username} />;
}
