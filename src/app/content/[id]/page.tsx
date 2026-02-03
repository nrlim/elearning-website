"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UniversalVideoPlayer } from "@/components/universal-video-player"
import { ArrowLeft, ChevronRight, PlayCircle, CheckCircle } from "lucide-react"
import axios from "axios"
import React from "react"

interface Content {
    id: string
    title: string
    description: string
    videoUrl: string
    videoSource: 'YOUTUBE' | 'GOOGLE_DRIVE' | 'DIRECT_UPLOAD'
    thumbnail?: string | null
    createdAt: string
    moduleId: string
}

interface ModuleData {
    id: string
    title: string
    content: Content[]
}

export default function ContentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [content, setContent] = useState<Content | null>(null)
    const [module, setModule] = useState<ModuleData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchContent()
    }, [params.id])

    const fetchContent = async () => {
        try {
            setLoading(true)
            const { data: contentData } = await axios.get(`/api/content/${params.id}`)
            setContent(contentData)

            if (contentData.moduleId) {
                const { data: moduleData } = await axios.get(`/api/modules/${contentData.moduleId}`)
                setModule(moduleData)
            }
        } catch (error) {
            console.error("Failed to fetch content", error)
        } finally {
            setLoading(false)
        }
    }

    const handleNextLesson = () => {
        if (!module || !content) return

        const currentIndex = module.content.findIndex(c => c.id === content.id)
        if (currentIndex < module.content.length - 1) {
            const nextLesson = module.content[currentIndex + 1]
            router.push(`/content/${nextLesson.id}`)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground animate-pulse">Loading lesson...</p>
                </div>
            </div>
        )
    }

    if (!content) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Content not found</p>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const currentIndex = module?.content.findIndex(c => c.id === content.id) ?? -1
    const totalLessons = module?.content.length ?? 0
    const hasNext = currentIndex < totalLessons - 1

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href={`/module/${content.moduleId}`}>
                        <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="hidden sm:inline">Back to {module?.title || 'Module'}</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                    </Link>

                    <div className="text-sm font-medium text-muted-foreground hidden md:block">
                        Lesson {currentIndex + 1} of {totalLessons}
                    </div>

                    {hasNext && (
                        <Button onClick={handleNextLesson} className="gap-2 shadow-lg shadow-primary/20">
                            Next Lesson <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                    {!hasNext && totalLessons > 0 && (
                        <Button variant="outline" disabled className="gap-2 opacity-50">
                            Course Completed <CheckCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl">
                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {content.title}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Published on {new Date(content.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <Card className="border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-0">
                            <UniversalVideoPlayer url={content.videoUrl} title={content.title} />
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>About this lesson</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {content.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Playlist */}
                <div className="lg:w-80 xl:w-96 flex-shrink-0">
                    <div className="sticky top-24 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Course Content</h3>
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                                {totalLessons} Lessons
                            </span>
                        </div>

                        <div className="bg-card/50 border border-border/40 rounded-xl overflow-hidden backdrop-blur-sm">
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                {module?.content.map((lesson, index) => {
                                    const isActive = lesson.id === content.id
                                    return (
                                        <Link key={lesson.id} href={`/content/${lesson.id}`}>
                                            <div className={`
                                                group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
                                                ${isActive
                                                    ? 'bg-primary/10 border-primary/20 shadow-sm'
                                                    : 'hover:bg-secondary/50 border border-transparent hover:border-border/50'}
                                            `}>
                                                <div className="mt-0.5 flex-shrink-0">
                                                    {isActive ? (
                                                        <PlayCircle className="h-5 w-5 text-primary animate-pulse" />
                                                    ) : (
                                                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[10px] font-medium text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors">
                                                            {index + 1}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                        {lesson.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
