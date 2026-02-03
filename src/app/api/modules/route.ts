import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const moduleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    typeId: z.string().optional(),
})

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "9")
    const search = searchParams.get("search") || ""
    const typeIdParam = searchParams.get("typeId") || ""

    const skip = (page - 1) * limit

    const session = await getServerSession(authOptions)

    // Base filter for search
    const searchFilter = search ? {
        OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
        ]
    } : {}

    // Type filter based on user role AND user selection
    let typeFilter: any = {}

    // 1. First, determine what the user is ALLOWED to see
    let allowedTypeIds: string[] | null = null // null means all keys (admin)

    if (session && session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: { moduleTypes: true }
        })

        if (user) {
            allowedTypeIds = user.moduleTypes.map(t => t.id)
        } else {
            allowedTypeIds = [] // blocked
        }
    }

    // 2. Then, construct the query based on Allowed Types AND Requested Type
    if (allowedTypeIds !== null) {
        // Non-admin user
        if (typeIdParam) {
            // User wants a specific type. Check if allowed.
            if (allowedTypeIds.includes(typeIdParam)) {
                typeFilter = { typeId: typeIdParam }
            } else {
                // User requested a type they don't have access to -> give them nothing
                typeFilter = { id: "nothing_matches" }
            }
        } else {
            // User didn't request a specific type, show ALL allowed types (including public)
            typeFilter = {
                OR: [
                    { typeId: null },
                    { typeId: { in: allowedTypeIds } }
                ]
            }
        }
    } else {
        // Admin (can see everything)
        if (typeIdParam) {
            typeFilter = { typeId: typeIdParam }
        }
    }

    const where = {
        AND: [
            searchFilter,
            typeFilter
        ]
    }

    try {
        const [modules, total] = await prisma.$transaction([
            prisma.module.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    content: {
                        orderBy: [
                            { order: 'asc' },
                            { createdAt: 'asc' }
                        ]
                    }, // Include parts/lessons
                    type: true, // Include module type
                }
            }),
            prisma.module.count({ where })
        ])

        return NextResponse.json({
            data: modules,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = moduleSchema.parse(body)

        const newModule = await prisma.module.create({
            data: validatedData
        })

        return NextResponse.json(newModule, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create module" }, { status: 500 })
    }
}
