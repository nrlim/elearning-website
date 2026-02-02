import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
                moduleTypes: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            moduleTypes: user.moduleTypes
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }
}
