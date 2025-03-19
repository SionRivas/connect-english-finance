import { lucia } from '@/lib/auth'; // Importar la configuración de Lucia
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Caché en memoria para almacenar sesiones temporalmente
const sessionCache = new Map<string, { user: any; expiresAt: number }>();

export async function middleware(request: NextRequest): Promise<NextResponse> {
  console.log('Middleware activado para:', request.nextUrl.pathname);

  // Verificar si la ruta comienza con "/api/"
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Validar la sesión
  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value;

  if (!sessionId) {
    console.log('Sesión no encontrada');
    return new NextResponse(
      JSON.stringify({ error: 'No autorizado: sesión no encontrada' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Verificar si la sesión está en caché
  const cachedSession = sessionCache.get(sessionId);
  const now = Date.now();
  if (cachedSession && cachedSession.expiresAt > now) {
    console.log(
      'Sesión obtenida del caché para el usuario:',
      cachedSession.user.username,
    );
    return NextResponse.next();
  }

  try {
    const session = await lucia.validateSession(sessionId);

    if (!session.user) {
      console.log('Sesión inválida o expirada');
      return new NextResponse(
        JSON.stringify({ error: 'No autorizado: sesión inválida o expirada' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    console.log('Sesión válida para el usuario:', session.user.username);

    // Almacenar la sesión en caché con un tiempo de expiración (ejemplo: 5 minutos)
    sessionCache.set(sessionId, {
      user: session.user,
      expiresAt: now + 5 * 60 * 1000, // 5 minutos
    });
  } catch (error) {
    console.error('Error al validar la sesión:', error);
    return new NextResponse(
      JSON.stringify({ error: 'No autorizado: error al validar la sesión' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Continuar con la solicitud normalmente
  return NextResponse.next();
}

// Configurar el matcher para que solo se aplique a rutas bajo "/api/"
export const config = {
  matcher: '/api/:path*',
};
