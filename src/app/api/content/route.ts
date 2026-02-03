import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const contentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    videoUrl: z.string().url("Invalid video URL"),
    moduleId: z.string().uuid("Invalid Module ID"),
})

// GET all content (or filter by moduleId)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50") // Higher limit for parts inside a module
    const search = searchParams.get("search") || ""
    const moduleId = searchParams.get("moduleId")

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
        ]
    }

    if (moduleId) {
        where.moduleId = moduleId
    }

    try {
        const [content, total] = await prisma.$transaction([
            prisma.content.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'asc' // Order parts chronologically usually
                }
            }),
            prisma.content.count({ where })
        ])

        return NextResponse.json({
            data: content,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
    }
}

// Helper function to detect video source
function detectVideoSource(url: string): 'YOUTUBE' | 'GOOGLE_DRIVE' | 'DIRECT_UPLOAD' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'YOUTUBE'
    }
    if (url.includes('drive.google.com')) {
        return 'GOOGLE_DRIVE'
    }
    return 'DIRECT_UPLOAD'
}

// Helper to extract YouTube ID
function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^\&\?\/]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            return match[1]
        }
    }
    return null
}

// Helper to get YouTube thumbnail
function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

// POST create new content (Admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = contentSchema.parse(body)

        // Detect video source
        const videoSource = detectVideoSource(validatedData.videoUrl)

        // Generate thumbnail for YouTube videos
        let thumbnail = null
        if (videoSource === 'YOUTUBE') {
            const videoId = extractYouTubeId(validatedData.videoUrl)
            if (videoId) {
                thumbnail = getYouTubeThumbnail(videoId)
            }
        } else if (videoSource === 'GOOGLE_DRIVE') {
            // Use the custom Google Drive video placeholder
            thumbnail = '/thumbnails/google-drive-placeholder.png'
        }

        const content = await prisma.content.create({
            data: {
                ...validatedData,
                videoSource,
                thumbnail
            }
        })

        return NextResponse.json(content, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create content", details: error }, { status: 500 })
    }
}
