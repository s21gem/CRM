import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skeleton implementation for middleware.
  // Will be implemented in Prompt 2.
  
  // Example path checking:
  // const path = request.nextUrl.pathname;
  // const isPublicPath = path === '/login' || path === '/';

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
