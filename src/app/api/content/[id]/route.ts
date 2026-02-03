import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const contentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    youtubeUrl: z.string().url("Invalid YouTube URL"),
})

// GET single content
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        console.log(`Fetching content with ID: ${id}`);

        const content = await prisma.content.findUnique({
            where: { id }
        })

        if (!content) {
            console.log(`Content with ID ${id} not found`);
            return NextResponse.json({ error: "Content not found" }, { status: 404 })
        }

        return NextResponse.json(content)
    } catch (error) {
        console.error("Error in GET /api/content/[id]:", error);
        return NextResponse.json({ error: "Failed to fetch content", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}

// PUT update content (Admin only)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = contentSchema.parse(body)

        const content = await prisma.content.update({
            where: { id },
            data: validatedData
        })

        return NextResponse.json(content)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
    }
}

// DELETE content (Admin only)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.content.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Content deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
    }
}
