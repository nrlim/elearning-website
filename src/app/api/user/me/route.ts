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

        // Initialize with manual types
        let allModuleTypes = [...user.moduleTypes];

        // Fetch Discord Role mapped types
        if (session.user.discordRoles && session.user.discordRoles.length > 0) {
            const discordMappings = await prisma.discordRoleMapping.findMany({
                where: {
                    discordRoleId: { in: session.user.discordRoles }
                },
                include: {
                    moduleType: true
                }
            });

            const discordTypes = discordMappings.map(m => m.moduleType);

            // Merge and dedup
            const existingIds = new Set(allModuleTypes.map(t => t.id));
            discordTypes.forEach(t => {
                if (!existingIds.has(t.id)) {
                    allModuleTypes.push(t);
                    existingIds.add(t.id);
                }
            });
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            moduleTypes: allModuleTypes,
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }
}
