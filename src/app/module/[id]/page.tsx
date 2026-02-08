"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Clock,
    ChevronLeft,
    ArrowLeft,
    PlayCircle
} from "lucide-react"
import axios from "axios"
import { extractYouTubeId, getYouTubeThumbnailUrl } from "@/lib/youtube"

interface Content {
    id: string
    title: string
    description: string
    videoUrl: string
    videoSource: 'YOUTUBE' | 'GOOGLE_DRIVE' | 'DIRECT_UPLOAD'
    thumbnail?: string | null
    createdAt: string
}

interface Module {
    id: string
    title: string
    description: string
    createdAt: string
    content: Content[]
}

const LessonThumbnail = ({ lesson, index }: { lesson: Content, index: number }) => {
    const [error, setError] = useState(false)

    // 1. Use stored thumbnail if available
    if (lesson.thumbnail && !error) {
        return (
            <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setError(true)}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="h-12 w-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg backdrop-blur-sm">
                        <PlayCircle className="h-6 w-6 ml-0.5" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                    Lesson {index + 1}
                </div>
            </>
        )
    }

    // 2. Fallback for Google Drive if no thumbnail stored (legacy data)
    if (lesson.videoUrl?.includes('drive.google.com') && !error) {
        return (
            <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/thumbnails/google-drive-placeholder.png"
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setError(true)}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="h-12 w-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg backdrop-blur-sm">
                        <PlayCircle className="h-6 w-6 ml-0.5" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                    Lesson {index + 1}
                </div>
            </>
        )
    }

    // 3. Last resort: Try extracting YouTube ID if no thumbnail stored
    const videoId = extractYouTubeId(lesson.videoUrl)

    if (videoId && !error) {
        return (
            <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={getYouTubeThumbnailUrl(videoId)}
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setError(true)}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="h-12 w-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg backdrop-blur-sm">
                        <PlayCircle className="h-6 w-6 ml-0.5" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                    Lesson {index + 1}
                </div>
            </>
        )
    }

    // 4. Generic Fallback
    return (
        <div className="w-full h-full flex items-center justify-center bg-secondary/30">
            <PlayCircle className="h-12 w-12 text-muted-foreground/50" />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                Lesson {index + 1}
            </div>
        </div>
    )
}

export default function ModuleDetailPage() {
    const { data: session, status } = useSession()
    const params = useParams()
    const router = useRouter()

    // State
    const [module, setModule] = useState<Module | null>(null)
    const [loading, setLoading] = useState(true)

    // Helper for YouTube Thumbnail


    const fetchModule = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/modules/${params.id}`)
            setModule(data)
        } catch (error) {
            console.error("Failed to fetch module")
        } finally {
            setLoading(false)
        }
    }, [params.id])

    useEffect(() => {
        if (status === "authenticated") {
            fetchModule()
        } else if (status === "unauthenticated") {
            router.push("/?login=true")
        }
    }, [status, fetchModule, router])


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground animate-pulse">Loading lessons...</p>
                </div>
            </div>
        )
    }

    if (!module) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Module not found</h3>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                            <ChevronLeft className="h-5 w-5" />
                            Back to Modules
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Module Header */}
                {/* Module Header with Banner */}
                <div className="space-y-4 max-w-4xl">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        Learning Module
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {module.title}
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                        {module.description}
                    </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-primary/20 via-border to-transparent" />

                {/* Lessons Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Lessons
                        <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {module.content.length}
                        </span>
                    </h2>

                    {module.content.length === 0 ? (
                        <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-secondary/20">
                            <p>No lessons available in this module yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {module.content.map((lesson, index) => (
                                <Link key={lesson.id} href={`/content/${lesson.id}`} className="group block h-full">
                                    <Card className="h-full border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col">
                                        <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                                            <LessonThumbnail lesson={lesson} index={index} />
                                        </div>

                                        <CardContent className="p-5 flex-1 flex flex-col">
                                            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                                {lesson.title}
                                            </h3>

                                            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                                                {lesson.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/30">
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                                    {new Date(lesson.createdAt).toLocaleDateString()}
                                                </div>
                                                <span className="text-xs font-medium text-primary flex items-center group-hover:underline">
                                                    Start Learning
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
