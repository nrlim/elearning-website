"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function TrialNotification() {
    const { data: session, status } = useSession()
    const [open, setOpen] = useState(false)
    const [diffDays, setDiffDays] = useState<number | null>(null)

    useEffect(() => {
        // Clear the "seen" flag when user logs out so it shows again on next login
        if (status === "unauthenticated") {
            sessionStorage.removeItem("trial-notification-seen")
            setOpen(false)
            setDiffDays(null)
            return
        }

        if (status !== "authenticated" || !session?.user?.isTrial || !session?.user?.trialEndsAt) {
            return
        }

        const hasSeen = sessionStorage.getItem("trial-notification-seen")
        if (hasSeen) return

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Normalize endDate to midnight for accurate day difference
        const endDate = new Date(session.user.trialEndsAt)
        const endDateMidnight = new Date(endDate)
        endDateMidnight.setHours(0, 0, 0, 0)

        const diffTime = endDateMidnight.getTime() - today.getTime()
        const days = Math.round(diffTime / (1000 * 60 * 60 * 24))

        setDiffDays(days)

        // Show if 5 days or less remaining (or expired/today)
        // Adjust logic if user wants it ALWAYS for trial users, but usually "reminder for trial end" implies nearness.
        // User request "the account trial expired when has been move day so its mean H+1... give the notification warning"
        // And "when user login creating the notification reminder for trial end".
        // Let's stick to the <= 5 days warning to avoid annoyance on day 1 of a 30 day trial, unless requested otherwise.
        if (days <= 5) {
            setOpen(true)
        }

    }, [session, status])

    const handleAcknowledge = () => {
        setOpen(false)
        sessionStorage.setItem("trial-notification-seen", "true")
    }

    if (!open || diffDays === null) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md [&>button]:hidden text-center flex flex-col items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${diffDays <= 0 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                    <AlertCircle className="h-6 w-6" />
                </div>
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-center text-xl">
                        {diffDays <= 0 ? "Trial Ends Today" : "Trial Ending Soon"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base mt-2">
                        {diffDays <= 0
                            ? "This is the last day of your free trial. Your account will be locked tomorrow unless you upgrade."
                            : `Your trial period will expire in ${diffDays} day${diffDays !== 1 ? 's' : ''}.`
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-secondary/50 p-4 rounded-lg text-sm text-foreground/80 mb-4 w-full">
                    Please contact an administrator to upgrade your account to permanent status to ensure uninterrupted access.
                </div>
                <DialogFooter className="sm:justify-center w-full">
                    <Button type="button" onClick={handleAcknowledge} className="w-full sm:w-auto min-w-[120px]">
                        OK, I Understand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
