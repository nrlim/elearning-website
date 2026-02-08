import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const month = searchParams.get("month")
        const year = searchParams.get("year")

        if (!month || !year) {
            return NextResponse.json({ error: "Month and Year are required" }, { status: 400 })
        }

        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1) // Month is 0-indexed in JS Date
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999) // Last day of month

        const users = await prisma.user.findMany({
            where: {
                role: {
                    not: "SUPERADMIN"
                },
                isTrial: false,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                moduleTypes: {
                    select: {
                        name: true
                    }
                },
                status: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error("Report generation error")
        return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
    }
}
