import { PrismaClient, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting SUPERADMIN database seed...')

    // Seed SUPERADMIN (Hidden Monitor)
    const superAdminEmail = 'superadmin@cryptolearn.com'
    const superAdminPassword = 'Kmzway87aa!'

    // Check if user already exists
    const existing = await prisma.user.findUnique({
        where: { email: superAdminEmail }
    })

    const hashedSuperPassword = await bcrypt.hash(superAdminPassword, 10)

    const superAdmin = await prisma.user.upsert({
        where: { email: superAdminEmail },
        update: {
            role: 'SUPERADMIN',
            status: UserStatus.ACTIVE,
        },
        create: {
            email: superAdminEmail,
            name: 'System Monitor',
            password: hashedSuperPassword,
            role: 'SUPERADMIN',
            status: UserStatus.ACTIVE,
            isTrial: false
        }
    })

    console.log('✅ SUPERADMIN user seeded successfully:')
    console.log('   Email:', superAdmin.email)
    console.log('   Password:', superAdminPassword)
    console.log('   Role:', superAdmin.role)

    console.log('🎉 SUPERADMIN seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
