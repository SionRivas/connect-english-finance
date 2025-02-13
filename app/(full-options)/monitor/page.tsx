import { title } from '@/components/primitives';
import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import PanelMonitorGeneral from '@/components/Monitor/PanelMonitorGeneral';
import { getUsersWithIdAndUsername } from '@/lib/db';
export default async function MonitorPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/');
  }
  const users = (await getUsersWithIdAndUsername()) as [];
  return (
    <div className="flex w-full flex-col place-items-center gap-5">
      <div className="w-full max-w-5xl">
        <h1 className={title({ color: 'green' })}>Monitor</h1>
        <p className="text-default-800">
          En esta sección podrás ver las estadísticas de tu negocio.
        </p>
      </div>
      <div className="w-full">
        <PanelMonitorGeneral userId={user.id} users={JSON.stringify(users)} />
      </div>
    </div>
  );
}
