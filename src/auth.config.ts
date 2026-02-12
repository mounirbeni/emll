import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // Update age every 24 hours
    },
    providers: [], // Providers are configured in auth.ts
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.role = token.role as any // avoiding direct enum import for edge safety
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            // Basic JWT handling for middleware context (no DB access)
            if (user) {
                token.id = user.id
                token.role = user.role
                token.email = user.email
                token.name = user.name
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session.user };
            }
            return token
        }
    }
} satisfies NextAuthConfig
