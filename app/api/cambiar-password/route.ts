import { validateRequest } from '@/lib/auth';
import { DatabaseUser, getUserById, changeUserPassword } from '@/lib/db';

export async function POST(request: Request): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return new Response(JSON.stringify({ error: 'No estás autenticado' }), {
      status: 401,
    });
  }

  const { currentPassword, newPassword } = await request.json();

  const ServerUser = (await getUserById(user.id)) as DatabaseUser;

  if (ServerUser.password !== currentPassword) {
    return new Response(
      JSON.stringify({ error: 'Contraseña actual incorrecta' }),
      {
        status: 403,
      },
    );
  }

  await changeUserPassword(user.id, newPassword);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
