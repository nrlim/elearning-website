import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const moduleTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    discordRoleId: z.string().optional(),
})

export async function GET() {
    try {
        // 🎯 Get current tenant from environment
        const tenant = process.env.NEXT_PUBLIC_TENANT || "default"

        const types = await prisma.moduleType.findMany({
            where: {
                tenant  // ✅ Filter by current tenant
            },
            include: {
                discordRoleMappings: {
                    where: {
                        tenant  // ✅ Only show role mappings for this tenant
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(types)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch module types" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = moduleTypeSchema.parse(body)
        const { discordRoleId, ...typeData } = validatedData

        // 🎯 Get current tenant from environment
        const tenant = process.env.NEXT_PUBLIC_TENANT || "default"

        const newType = await prisma.moduleType.create({
            data: {
                ...typeData,
                tenant,  // ✅ Automatically assign tenant
                discordRoleMappings: discordRoleId ? {
                    create: {
                        discordRoleId: discordRoleId,
                        tenant  // ✅ Assign tenant to role mapping
                    }
                } : undefined
            },
            include: {
                discordRoleMappings: true
            }
        })

        return NextResponse.json(newType, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        // Check for unique constraint violation
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: "Module type with this name or Discord Role ID already exists for this tenant" }, { status: 409 })
        }
        console.error('[Module Type API] Error:', error)
        return NextResponse.json({ error: "Failed to create module type" }, { status: 500 })
    }
}
