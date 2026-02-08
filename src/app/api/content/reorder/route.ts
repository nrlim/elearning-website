
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { items } = await req.json()

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }

        // Use a transaction to update all items
        await prisma.$transaction(
            items.map((item: { id: string, order: number }) =>
                prisma.content.update({
                    where: { id: item.id },
                    data: { order: item.order }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Reorder error")
        return NextResponse.json({ error: "Failed to reorder items" }, { status: 500 })
    }
}
