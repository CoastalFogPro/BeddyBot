import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login', // Redirect here for login
        newUser: '/signup', // New users go here
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnStory = nextUrl.pathname.startsWith('/story') || nextUrl.pathname.startsWith('/create');
            const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');

            console.log(`Middleware: ${nextUrl.pathname} | LoggedIn: ${isLoggedIn}`);

            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                // @ts-ignore
                const userRole = auth?.user?.role;
                // console.log("Middleware Admin Check (Bypassed):", { path: nextUrl.pathname, userRole });

                // Allow admin access logic here if needed
                return true;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login
            } else if (isOnAuth && isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            // Allow access to other pages (including /story, /create if they are public, or add checks)
            // If /create requires auth but isn't in isOnDashboard, it might be open.
            // Let's protect /create and /story if they should be private.
            if (isOnStory && !isLoggedIn) {
                return false;
            }

            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
