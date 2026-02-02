"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { LoginModal } from "@/components/login-modal"

function AuthWrapperContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const loginParam = searchParams?.get("login")
        if (loginParam === "true") {
            setOpen(true)
        }
    }, [searchParams])

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            // Remove login=true from url without refreshing
            const params = new URLSearchParams(searchParams?.toString())
            params.delete("login")
            const newSearch = params.toString()
            const newPath = newSearch ? `${pathname}?${newSearch}` : pathname
            router.replace(newPath, { scroll: false })
        }
    }

    return (
        <LoginModal open={open} onOpenChange={handleOpenChange} callbackUrl={searchParams?.get("callbackUrl") || undefined} />
    )
}

export function AuthWrapper() {
    return (
        <Suspense fallback={null}>
            <AuthWrapperContent />
        </Suspense>
    )
}
