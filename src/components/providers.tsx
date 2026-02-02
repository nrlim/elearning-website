"use client"

import { SessionProvider, signOut } from "next-auth/react"
import { ReactNode, useEffect } from "react"
import axios from "axios"

import { AuthWrapper } from "@/components/auth-wrapper"
import { TrialNotification } from "@/components/trial-notification"

function AxiosInterceptor() {
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Start signout process which will clear session and redirect
                    signOut({ callbackUrl: "/?login=true" })
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.response.eject(interceptor)
        }
    }, [])

    return null
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AxiosInterceptor />
            {children}
            <TrialNotification />
            <AuthWrapper />
        </SessionProvider>
    )
}
