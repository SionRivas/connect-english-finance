import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Page() {
  'use server';
  await logout();
  return null;
}

async function logout(): Promise<void> {
  const { session } = await validateRequest();
  if (!session) {
    redirect('/');
    return;
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect('/');
}
