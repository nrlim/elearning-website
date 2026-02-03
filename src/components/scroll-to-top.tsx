"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)

        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    if (!isVisible) {
        return null
    }

    return (
        <Button
            size="icon"
            className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            onClick={scrollToTop}
        >
            <ArrowUp className="h-6 w-6" />
        </Button>
    )
}
