"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site-config"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileVideo, LogOut, LayoutDashboard, Tags } from "lucide-react"
import { UserManagement } from "@/components/admin/user-management"
import { ContentManagement } from "@/components/admin/content-management"
import { ModuleTypeManagement } from "@/components/admin/module-type-management"

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/?login=true")
        } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
            router.push("/dashboard")
        }
    }, [status, session, router])

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" })
    }

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground animate-pulse">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    if (session?.user?.role !== "ADMIN") {
        return null
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            {/* Glossy Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2 group">
                        {siteConfig.logoImage ? (
                            <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all duration-300">
                                <Image
                                    src={siteConfig.logoImage}
                                    alt={siteConfig.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all duration-300">
                                AD
                            </div>
                        )}
                        <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {siteConfig.name} <span className="text-primary">Admin</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="flex gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">User View</span>
                            </Button>
                        </Link>
                        <div className="h-8 w-px bg-border/60 mx-1 hidden md:block" />
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                        <p className="text-muted-foreground">
                            Manage your application content and users from one place.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="content" className="space-y-6">
                    <TabsList className="bg-secondary/50 p-1 rounded-lg border border-border/40 w-full grid grid-cols-3 md:w-auto md:inline-flex !h-auto">
                        <TabsTrigger value="content" className="gap-2 h-10 px-3 md:px-6 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                            <FileVideo className="h-4 w-4" />
                            <span className="hidden md:inline">Content Management</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="gap-2 h-10 px-3 md:px-6 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                            <Users className="h-4 w-4" />
                            <span className="hidden md:inline">User Management</span>
                        </TabsTrigger>
                        <TabsTrigger value="types" className="gap-2 h-10 px-3 md:px-6 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                            <Tags className="h-4 w-4" />
                            <span className="hidden md:inline">Module Types</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <ContentManagement />
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <UserManagement />
                    </TabsContent>

                    <TabsContent value="types" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <ModuleTypeManagement />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
