import { lucia, validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(): Promise<Response> {
  const { session } = await validateRequest();
  if (session) {
    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/', // Redirigir al inicio
    },
  });
}
