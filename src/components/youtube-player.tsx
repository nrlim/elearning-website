"use client"

import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtube"

interface YouTubePlayerProps {
    url: string
    title?: string
    className?: string
}

export function YouTubePlayer({ url, title = "YouTube video", className = "" }: YouTubePlayerProps) {
    const videoId = extractYouTubeId(url)

    if (!videoId) {
        return (
            <div className={`flex items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
                <p className="text-muted-foreground">Invalid YouTube URL</p>
            </div>
        )
    }

    const embedUrl = getYouTubeEmbedUrl(videoId)

    return (
        <div className={`relative aspect-video w-full overflow-hidden rounded-lg ${className}`}>
            <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
            />
        </div>
    )
}
