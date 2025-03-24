// app/login/github/callback/route.ts
import { github, google, lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';

import { verifyExistingUser, createUser } from '@/lib/db';

interface GoogleUser {
  sub: string; // Unique identifier for the user
  name: string; // Full name of the user
  email: string; // Email address of the user
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const codeVerifier =
    (await cookies()).get('google_oauth_code_verifier')?.value ?? null;
  const storedState =
    (await cookies()).get('google_oauth_state')?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleUserResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      },
    );

    const googleUser: GoogleUser = await googleUserResponse?.json();
    const existingUser = await verifyExistingUser(null, null, googleUser.sub);

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      if (existingUser.password) {
        (await cookies()).set('password_pending', 'true', {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60, // 1 hora
        });
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/verificacion', // Redirigir a la página de confirmación
        },
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await createUser(
      userId,
      googleUser.name,
      googleUser.email,
      null,
      googleUser.sub,
      'connect',
    );

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    (await cookies()).set('password_pending', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hora
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/verificacion', // Redirigir a la página de confirmación
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
