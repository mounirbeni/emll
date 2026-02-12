
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Adapter } from "next-auth/adapters"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { env } from "@/lib/env"
import { comparePassword } from "@/lib/auth"
import { UserRole } from "@prisma/client"

import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        // Only add Google provider if credentials are provided
        ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
            ? [
                Google({
                    clientId: env.GOOGLE_CLIENT_ID,
                    clientSecret: env.GOOGLE_CLIENT_SECRET,
                    allowDangerousEmailAccountLinking: true,
                }),
            ]
            : []),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user || !user.password) {
                    throw new Error("Invalid email or password")
                }

                const isPasswordValid = await comparePassword(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error("Invalid email or password")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }
        })
    ],
    // Extended callbacks that include DB logic
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.role = user.role || UserRole.CUSTOMER
                token.email = user.email
                token.name = user.name
                token.iat = Math.floor(Date.now() / 1000)
                token.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
            }

            // Check if token is about to expire (within 1 hour)
            if (token.exp && typeof token.exp === 'number') {
                const now = Math.floor(Date.now() / 1000)
                const expiresIn = token.exp - now

                // Refresh token if within 1 hour of expiration
                if (expiresIn < 3600) {
                    try {
                        const freshUser = await prisma.user.findUnique({
                            where: { id: token.id as string },
                            select: { id: true, email: true, name: true, role: true }
                        })

                        if (freshUser) {
                            token.id = freshUser.id
                            token.email = freshUser.email
                            token.name = freshUser.name
                            token.role = freshUser.role
                            token.iat = Math.floor(Date.now() / 1000)
                            token.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
                        }
                    } catch (error) {
                        console.error("Token refresh failed:", error)
                    }
                }
            }

            if (trigger === "update" && session) {
                token = { ...token, ...session.user };
            }

            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.role = token.role as UserRole
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },
    events: {
        async linkAccount({ user: _user }) {
            // Log link account event if needed, or maintain for audit
        },
        async signIn({ user, account, profile: _profile, isNewUser: _isNewUser }) {
            // Log sign in event if needed
            if (account?.provider === "google") {
                // Allow all google sign-ins (no return value needed for events)
            }
            // Update last login timestamp
            if (user.id) {
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { updatedAt: new Date() }
                    })
                } catch (error) {
                    console.error("Failed to update last login:", error)
                }
            }
        },
    },
    debug: process.env.NODE_ENV === "development",
}) 
