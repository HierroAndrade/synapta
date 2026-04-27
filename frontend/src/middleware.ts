import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware do Next.js (Edge)
 * 
 * Este arquivo implementa a Diretriz de Segurança §4 e Proteção de Rotas §6.
 * Ele intercepta requisições antes de renderizar a página, verificando o cookie
 * seguro definido pelo Backend.
 */
export function middleware(request: NextRequest) {
  // O middleware roda no servidor. Ele consegue ler o cookie httpOnly
  const token = request.cookies.get('sb_token')?.value;

  // 1. Proteger rotas privadas (Route Guard)
  // Se tentar acessar o dashboard sem o cookie da sessão, manda pro login
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // 2. Prevenir acesso a rotas públicas quando já logado
  // Se já tem o token, não faz sentido acessar login/cadastro novamente
  if (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/cadastro')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configura em quais rotas o middleware deve agir
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/cadastro'
  ],
};
