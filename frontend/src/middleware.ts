import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const { pathname } = request.nextUrl;

  // Detecta se o domínio atual é o subdomínio admin (admin.tsjoculos.com ou www.admin.tsjoculos.com)
  const isAdminDomain =
    host.startsWith('admin.tsjoculos.com') ||
    host.startsWith('www.admin.tsjoculos.com') ||
    host.startsWith('admin.localhost');

  if (isAdminDomain) {
    // Se o usuário acessar a raiz do subdomínio admin, envia direto para a tela de autenticação /admin
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas exceto arquivos estáticos e internos do Next.js
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
