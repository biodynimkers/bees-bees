import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // 1. Account routes with userId
    if (pathname.startsWith('/account/') && pathname !== '/account') {
      const pathSegments = pathname.split('/');
      const userIdFromUrl = pathSegments[2];

      // Allow if admin or if accessing own account
      if (token?.role === 'ADMIN' || token?.id === userIdFromUrl) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
    // 2. All admin pages
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
  matcher: ['/account/:userId*', '/admin/:path*'],
};
