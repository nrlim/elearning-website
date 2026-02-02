"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    LogOut,
    Search,
    ChevronLeft,
    ChevronRight,
    Folder,
    BookOpen,
    PlayCircle
} from "lucide-react"
import axios from "axios"

interface Module {
    id: string
    title: string
    description: string
    createdAt: string
    content: { youtubeUrl: string }[]
}

interface Meta {
    total: number
    page: number
    limit: number
    totalPages: number
}

// Simple debounce
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    // State
    const [modules, setModules] = useState<Module[]>([])
    const [meta, setMeta] = useState<Meta | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounceValue(searchQuery, 500)

    // Auth check
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/?login=true")
        }
    }, [status, router])

    // Data Fetching
    const fetchModules = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "9",
                search: debouncedSearch
            })

            const { data } = await axios.get(`/api/modules?${params}`)
            setModules(data.data)
            setMeta(data.meta)
        } catch (error) {
            console.error("Failed to fetch modules", error)
        } finally {
            setLoading(false)
        }
    }, [page, debouncedSearch])

    useEffect(() => {
        if (status === "authenticated") {
            fetchModules()
        }
    }, [status, fetchModules])

    // Helper for YouTube Thumbnail
    const getThumbnailUrl = (url: string) => {
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
            const match = url.match(regExp)
            return (match && match[2].length === 11)
                ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`
                : null
        } catch (e) {
            return null
        }
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" })
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                            CL
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            CryptoLearn
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium text-foreground">
                                {session?.user?.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Student Account
                            </span>
                        </div>
                        <div className="h-8 w-px bg-border/60 mx-1 hidden md:block" />

                        {session?.user?.role === "ADMIN" && (
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10 hover:text-primary">
                                    Admin Panel
                                </Button>
                            </Link>
                        )}
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Hero / Filter Section */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            My Courses
                        </h1>
                        <p className="text-muted-foreground">
                            Browse your learning modules.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search modules..."
                            className="pl-10 h-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 transition-all duration-300"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                </div>

                {/* Modules Grid */}
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border-border/40 overflow-hidden bg-card/50">
                                <CardContent className="p-6 space-y-4">
                                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                    <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="h-24 w-24 rounded-full bg-secondary/50 flex items-center justify-center">
                            <Folder className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No modules found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                We couldn't find any modules matching "{searchQuery}".
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {modules.map((module) => (
                            <Link key={module.id} href={`/module/${module.id}`} className="group block h-full">
                                <Card className="h-full border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col relative overflow-hidden">
                                    {/* Banner Image */}
                                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                                        {module.content && module.content.length > 0 && getThumbnailUrl(module.content[0].youtubeUrl) ? (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={getThumbnailUrl(module.content[0].youtubeUrl)!}
                                                    alt={module.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    <div className="h-10 w-10 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg backdrop-blur-sm">
                                                        <PlayCircle className="h-5 w-5 ml-0.5" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-secondary/50">
                                                <Folder className="h-12 w-12 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-6 flex-1 flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                                                {module.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {module.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary/80 transition-colors border-t border-border/40">
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            {(module.content as any[])?.length || 0} Lessons
                                            <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                            className="h-10 w-10 border-border/40 hover:bg-secondary"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm font-medium text-muted-foreground px-4">
                            Page <span className="text-foreground">{page}</span> of {meta.totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= meta.totalPages}
                            className="h-10 w-10 border-border/40 hover:bg-secondary"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}
