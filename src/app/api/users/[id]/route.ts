import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const userUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
    moduleTypeIds: z.array(z.string()).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    isTrial: z.boolean().optional(),
    trialEndsAt: z.string().nullable().optional().transform(val => val ? new Date(val) : null), // Handle string input for Date
})

// PUT update user (Admin only)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = userUpdateSchema.parse(body)
        const { moduleTypeIds, ...rest } = validatedData

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...rest,
                moduleTypes: moduleTypeIds ? {
                    set: moduleTypeIds.map(id => ({ id }))
                } : undefined
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                moduleTypes: true,
                status: true,
                isTrial: true,
                trialEndsAt: true
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }
}

// DELETE user (Admin only)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ message: "User deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }
}
