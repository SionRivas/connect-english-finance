import { validateRequest } from '@/lib/auth';
import { DatabaseUser, getUserById } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return new Response(JSON.stringify({ error: 'No estás autenticado' }), {
      status: 401,
    });
  }
  const ServerUser = (await getUserById(user.id)) as DatabaseUser;
  console.log(ServerUser);

  const { password } = await request.json();

  const isPasswordValid = ServerUser.password === password;

  if (isPasswordValid) {
    // Eliminar la cookie "password_pending"
    (await cookies()).delete('password_pending');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } else {
    return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), {
      status: 403,
    });
  }
}
