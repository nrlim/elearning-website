import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const moduleTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    // description: z.string().optional(), // Removed from DB schema
    discordRoleId: z.string().optional(),
    isAio: z.boolean().optional().default(false),
})

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = moduleTypeSchema.parse(body)
        const { discordRoleId, isAio, ...typeData } = validatedData

        // Perform update
        const updatedType = await prisma.moduleType.update({
            where: { id: id },
            data: {
                ...typeData,
                isAio: isAio, // ✅ Update isAio flag
                discordRoleMappings: {
                    // Update the mapping if it exists, otherwise create it
                    // For simplicity, we assume one mapping per type in this UI
                    // We delete existing and create new or upsert
                    deleteMany: {}, // Clear existing (simplest way for 1-to-1 managed via UI)
                    create: discordRoleId ? {
                        discordRoleId: discordRoleId
                    } : undefined
                }
            }
        })

        return NextResponse.json(updatedType)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        // Check for unique constraint violation
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: "Module type with this name or Discord Role ID already exists for this tenant" }, { status: 409 })
        }
        console.error('[Module Type Update API] Error:', error)
        return NextResponse.json({ error: "Failed to update module type" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.moduleType.delete({
            where: { id: id }
        })

        return NextResponse.json({ message: "Deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete module type" }, { status: 500 })
    }
}
