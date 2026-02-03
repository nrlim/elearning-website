"use client"

import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtube"
import { Video } from "lucide-react"

interface UniversalVideoPlayerProps {
    url: string
    title?: string
    className?: string
}

function detectVideoSource(url: string): 'YOUTUBE' | 'GOOGLE_DRIVE' | 'UNKNOWN' {
    if (!url) return 'UNKNOWN'

    // YouTube detection
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'YOUTUBE'
    }

    // Google Drive detection
    if (url.includes('drive.google.com')) {
        return 'GOOGLE_DRIVE'
    }

    return 'UNKNOWN'
}

function extractGoogleDriveId(url: string): string | null {
    // https://drive.google.com/file/d/FILE_ID/view
    // https://drive.google.com/open?id=FILE_ID

    const patterns = [
        /\/file\/d\/([^\/\?]+)/,
        /[?&]id=([^&]+)/,
        /\/d\/([^\/\?]+)/
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            return match[1]
        }
    }

    return null
}

function getGoogleDriveEmbedUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/preview`
}

export function UniversalVideoPlayer({ url, title = "Video", className = "" }: UniversalVideoPlayerProps) {
    const source = detectVideoSource(url)

    // YouTube Player
    if (source === 'YOUTUBE') {
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

    // Google Drive Player
    if (source === 'GOOGLE_DRIVE') {
        const fileId = extractGoogleDriveId(url)

        if (!fileId) {
            return (
                <div className={`flex items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
                    <p className="text-muted-foreground">Invalid Google Drive URL</p>
                </div>
            )
        }

        const embedUrl = getGoogleDriveEmbedUrl(fileId)

        return (
            <div className={`relative aspect-video w-full overflow-hidden rounded-lg ${className}`}>
                <iframe
                    src={embedUrl}
                    title={title}
                    allow="autoplay"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                />
            </div>
        )
    }

    // Unknown source
    return (
        <div className={`flex flex-col items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
                Unsupported video URL. Please use YouTube or Google Drive links.
            </p>
        </div>
    )
}
