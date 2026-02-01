import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const moduleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
})

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const module = await prisma.module.findUnique({
            where: { id: id },
            include: {
                content: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!module) {
            return NextResponse.json({ error: "Module not found" }, { status: 404 })
        }

        return NextResponse.json(module)
    } catch (error) {
        console.error("Failed to fetch module:", error);
        return NextResponse.json({ error: "Failed to fetch module", details: String(error) }, { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = moduleSchema.parse(body)

        const module = await prisma.module.update({
            where: { id: id },
            data: validatedData
        })

        return NextResponse.json(module)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update module" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.module.delete({
            where: { id: id }
        })

        return NextResponse.json({ message: "Module deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete module" }, { status: 500 })
    }
}
