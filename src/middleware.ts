import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // 1. Admin Access Check
        if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN" && req.nextauth.token?.role !== "SUPERADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        // 2. Discord Validation Check
        if (!req.nextauth.token?.discordId) {
            return NextResponse.redirect(new URL("/?login=true&error=DiscordRequired", req.url))
        }

        // 3. Trial Expiration Check (Secure Hole Fix)
        const token = req.nextauth.token
        if (token?.isTrial && token.trialEndsAt) {
            const now = new Date()
            const trialEnd = new Date(token.trialEndsAt as string | Date)
            // Allow access until the end of the trial day
            trialEnd.setHours(23, 59, 59, 999)

            if (now > trialEnd) {
                // Trial Expired - Force redirect to login
                // We use a custom query param so the client can show a message if needed
                return NextResponse.redirect(new URL("/?login=true&error=TrialExpired", req.url))
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
        pages: {
            signIn: "/?login=true",
        },
    }
)

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] }
