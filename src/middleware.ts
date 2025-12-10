import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Account structure routes (always allow for authenticated users)
    if (
      pathname.startsWith('/account') ||
      pathname.startsWith('/apiaries') ||
      pathname.startsWith('/hives') ||
      pathname.startsWith('/observations')
    ) {
      // Already authenticated by withAuth callback, just allow access
      return NextResponse.next();
    }

    // 3. All admin pages
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow authenticated users
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/account',
    '/apiaries/:path*',
    '/hives/:path*',
    '/observations/:path*',
  ],
};
