import { title } from '@/components/primitives';
import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import { Curso, getActiveCursos } from '@/lib/db';
import PanelAlumnos from '@/components/Alumnos/PanelAlumnosGen';
import { cookies } from 'next/headers';

export default async function AlumnosPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/');
  }

  const passwordPending = (await cookies()).get('password_pending')?.value;
  if (passwordPending === 'true') {
    return redirect('/logout'); // Redirigir al apartado de verificación
  }
  const CursosActivos = JSON.stringify(await getActiveCursos());
  return (
    <div className="flex w-full max-w-5xl flex-col gap-5">
      <div>
        <h1 className={title({ color: 'green' })}>Alumnos</h1>
        <p className="text-default-800">
          En esta sección podrás ver los alumnos registrados y administrarlos
        </p>
      </div>
      <div>
        <PanelAlumnos CursosActivosInit={CursosActivos} />
      </div>
    </div>
  );
}
