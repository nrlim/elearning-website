import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
    moduleTypeIds: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { email, name, password, role, moduleTypeIds } = userSchema.parse(body)

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "USER",
                moduleTypes: moduleTypeIds ? {
                    connect: moduleTypeIds.map(id => ({ id }))
                } : undefined
            }
        })

        const { password: newUserPassword, ...rest } = newUser

        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ user: null, message: "Something went wrong" }, { status: 500 })
    }
}
