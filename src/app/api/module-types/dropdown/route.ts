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

        // Fetch ALL module types, ignoring tenant and AIO status
        // Used purely for dropdown filtering options
        const types = await prisma.moduleType.findMany({
            where: {
                isAio: false // Exclude AIO types from specific filters
            },
            select: {
                id: true,
                name: true,
                // description: true // Removed
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(types)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch dropdown types" }, { status: 500 })
    }
}
