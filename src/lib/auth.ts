import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour
    },
    pages: {
        signIn: "/?login=true",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password)

                if (!passwordMatch) {
                    return null
                }

                if (user.status === "INACTIVE") {
                    return null // Create a way to communicate this error if possible, but for now null prevents login
                }

                if (user.isTrial && user.trialEndsAt) {
                    const now = new Date()
                    const trialEnd = new Date(user.trialEndsAt)
                    // Allow access until the end of the trial day
                    trialEnd.setHours(23, 59, 59, 999)

                    if (now > trialEnd) {
                        return null
                    }
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isTrial: user.isTrial,
                    trialEndsAt: user.trialEndsAt
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.isTrial = user.isTrial
                token.trialEndsAt = user.trialEndsAt
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role
                session.user.id = token.id
                session.user.isTrial = token.isTrial as boolean
                session.user.trialEndsAt = token.trialEndsAt as Date | undefined
            }
            return session
        }
    }
}
