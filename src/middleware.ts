import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log("middleware executed")

    const authToken = request.cookies.get('__Secure-next-auth.session-token')?.value 
                   || request.cookies.get('next-auth.session-token')?.value;

    const isSignInOrSignUpPage = request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up';

    if (isSignInOrSignUpPage && authToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isSignInOrSignUpPage && !authToken) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/chat/:characterId*'],
}
