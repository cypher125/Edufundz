import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Get auth tokens from cookies (for student auth)
  const userToken = request.cookies.get('authToken')?.value;
  
  // Check for path type
  const isAdminPath = path.startsWith('/admin');
  const isAuthPath = path.startsWith('/auth');
  const isAdminLoginPath = path === '/admin/login';
  const isAdminApiPath = path.startsWith('/api/admin');
  
  // Admin authentication is handled by client-side context provider using localStorage
  // We should bypass middleware for admin paths to avoid interference with client auth
  if (isAdminPath || isAdminApiPath) {
    // Only handle admin routes in the client - pass through all admin routes in middleware
    return NextResponse.next();
  }
  
  // Handle Student Auth paths
  if (isAuthPath) {
    // If user is already logged in, redirect to dashboard
    if (userToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Handle Student protected routes
  if (path.startsWith('/dashboard') || path.startsWith('/apply') || path.startsWith('/profile') || path.startsWith('/loans')) {
    // If accessing protected routes without user token, redirect to login
    if (!userToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // Let other routes pass through
  return NextResponse.next();
}

// Configure paths the middleware will run on
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. .*\\..*$ (files with extensions - handled by next static)
     */
    '/((?!api|_next|static|.*\\..*$).*)',
  ],
}; 