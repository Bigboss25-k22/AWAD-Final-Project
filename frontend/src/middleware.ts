import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PUBLIC_PATHS } from './constants/routes.constant';

const publicRouter: string[] = Object.values(PUBLIC_PATHS);

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const { pathname } = req.nextUrl;

  if (!refreshToken && !publicRouter?.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (refreshToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
