import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
                <Link className="flex items-center space-x-2 group" href="/">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-400 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                        <span className="relative text-2xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            CryptoLearn
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">
                        Courses
                    </Link>
                    <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button className="rounded-xl font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25 transition-all hover:scale-105">
                            Login
                        </Button>
                    </Link>

                </div>
            </div>
        </header>
    )
}
