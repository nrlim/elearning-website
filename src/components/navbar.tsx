"use client"

import { siteConfig } from "@/config/site-config"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { CountryFlag } from "@/components/country-flag"

import { useSession } from "next-auth/react"
import { LayoutDashboard, ShieldCheck } from "lucide-react"

export function Navbar() {
    const { data: session, status } = useSession()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
                <Link
                    className="flex items-center space-x-2 group cursor-pointer"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <div className="relative flex items-center gap-3">
                        {/* Logo Image or Fallback */}
                        {siteConfig.logoImage ? (
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                                <Image
                                    src={siteConfig.logoImage}
                                    alt={siteConfig.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                                {siteConfig.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}

                        {/* Site Name and Flag */}
                        <div className="flex items-center gap-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-400 blur-lg opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
                            <span className="relative text-xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                {siteConfig.logoText}
                            </span>
                            {/* Country Flag beside logo */}
                            {siteConfig.countryFlag && (
                                <CountryFlag
                                    country={siteConfig.countryFlag}
                                    className="w-8 h-6 rounded shadow-sm border border-border/40"
                                />
                            )}
                        </div>
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
                </nav>

                <div className="flex items-center gap-3">
                    {status === "unauthenticated" ? (
                        <LoginModal>
                            <Button className="rounded-xl font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25 transition-all hover:scale-105">
                                Login
                            </Button>
                        </LoginModal>
                    ) : (
                        <div className="flex items-center gap-2">
                            {(session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN") && (
                                <Link href="/admin">
                                    <Button variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:bg-primary/10 gap-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        Admin
                                    </Button>
                                </Link>
                            )}
                            <Link href="/dashboard">
                                <Button className="rounded-xl gap-2 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader>
                                    <SheetTitle className="text-left flex items-center gap-3">
                                        {/* Logo Image in Mobile Menu */}
                                        {siteConfig.logoImage ? (
                                            <div className="relative h-8 w-8 rounded-lg overflow-hidden shadow-md">
                                                <Image
                                                    src={siteConfig.logoImage}
                                                    alt={siteConfig.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-bold text-sm">
                                                {siteConfig.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                                {siteConfig.logoText}
                                            </span>
                                            {siteConfig.countryFlag && (
                                                <CountryFlag
                                                    country={siteConfig.countryFlag}
                                                    className="w-7 h-5 rounded shadow-sm border border-border/40"
                                                />
                                            )}
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-6 pt-6">
                                    <Link href="/" className="text-lg font-medium text-foreground">
                                        Home
                                    </Link>
                                    <Link href="#courses" className="text-lg font-medium text-muted-foreground hover:text-foreground">
                                        Courses
                                    </Link>
                                    <Link href="#features" className="text-lg font-medium text-muted-foreground hover:text-foreground">
                                        Features
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
