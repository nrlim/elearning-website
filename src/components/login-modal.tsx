"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LoginModalProps {
    children?: React.ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    callbackUrl?: string
}

export function LoginModal({ children, defaultOpen = false, open: controlledOpen, onOpenChange: controlledOnOpenChange, callbackUrl }: LoginModalProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const [isLoading, setIsLoading] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen)
        }
        controlledOnOpenChange?.(newOpen)
    }

    const handleDiscordLogin = async () => {
        setIsLoading(true)
        await signIn("discord", { callbackUrl: callbackUrl || "/dashboard" })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && (
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[400px] border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl">
                <DialogHeader className="space-y-4 pb-6 pt-2">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-2 border border-indigo-500/20">
                        <svg viewBox="0 0 24 24" className="h-10 w-10 fill-indigo-500" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.0766.1363-.1625.321-.2235.4661a18.2736 18.2736 0 00-5.445 0c-.061-.1451-.1469-.3298-.2235-.4661a19.7432 19.7432 0 00-4.8851 1.5152c-3.111 4.6467-3.968 9.1724-3.548 13.6231a20.026 20.026 0 006.0123 3.0336c.4566-.6225.8601-1.2952 1.2014-2.007a13.3444 13.3444 0 01-1.9213-.913c.1625-.119.3193-.242.4704-.3696 3.705 1.71 7.7416 1.71 11.411 0 .1511.1276.3079.2506.4704.3696a13.1906 13.1906 0 01-1.9213.913c.3413.7118.7448 1.3845 1.2014 2.007a20.0347 20.0347 0 006.0123-3.0336c.4912-5.1818-.8486-9.664-3.548-13.6231zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z" /></svg>
                    </div>
                    <DialogTitle className="text-3xl font-black text-white text-center tracking-tight">
                        Discord Access
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-400 text-base max-w-[280px] mx-auto">
                        Connect your Discord account to access the modules and your dashboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pb-4">
                    <Button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white border-none py-7 rounded-2xl transition-all font-bold text-lg active:scale-[0.98] shadow-xl shadow-indigo-500/20 group"
                        onClick={handleDiscordLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6 fill-current group-hover:scale-110 transition-transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.0766.1363-.1625.321-.2235.4661a18.2736 18.2736 0 00-5.445 0c-.061-.1451-.1469-.3298-.2235-.4661a19.7432 19.7432 0 00-4.8851 1.5152c-3.111 4.6467-3.968 9.1724-3.548 13.6231a20.026 20.026 0 006.0123 3.0336c.4566-.6225.8601-1.2952 1.2014-2.007a13.3444 13.3444 0 01-1.9213-.913c.1625-.119.3193-.242.4704-.3696 3.705 1.71 7.7416 1.71 11.411 0 .1511.1276.3079.2506.4704.3696a13.1906 13.1906 0 01-1.9213.913c.3413.7118.7448 1.3845 1.2014 2.007a20.0347 20.0347 0 006.0123-3.0336c.4912-5.1818-.8486-9.664-3.548-13.6231zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z" />
                                </svg>
                                <span>Login with Discord</span>
                            </>
                        )}
                    </Button>
                    <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                        Secure OAuth2 Connection
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
