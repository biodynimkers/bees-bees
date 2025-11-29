import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; //  Middleware READS the JWT token from the cookie
    // The token now contains: { email, name, role, id, exp, iat, etc. }
    // req betekent het inkomende request object via de url

    const pathname = req.nextUrl.pathname; //req.nextUrl geeft de volledige url info van het inkomende request

    // 1. User-specific admin pages
    if (pathname.startsWith('/admin/users/') && pathname !== '/admin/users/') {
      const pathSegments = pathname.split('/');
      const userIdFromUrl = pathSegments[2]; // adjust index if needed

      if (token?.role === 'ADMIN' || token?.id === userIdFromUrl) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // 2. All other admin pages
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  },
  {
    // Als je niet ingelogd bent, redirect NextAuth je naar /login in plaats van je eigen redirect naar /unauthorized.

    callbacks: {
      authorized: () => true, // Laat iedereen door, ik bepaal zelf de redirect in de middleware
    },
  }
);

export const config = { matcher: ['/admin/:path*'] };
