"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

import { AuthWrapper } from "@/components/auth-wrapper"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <AuthWrapper />
        </SessionProvider>
    )
}
