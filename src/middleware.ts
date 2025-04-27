import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = await getToken({ req: request });

  const url = request.nextUrl;

  if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify') || url.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    console.log('inside')
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();



}

 