import { PrismaClient, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Default admin credentials
    const adminEmail = 'admin@cryptolearn.com'
    const adminPassword = 'Admin123!'

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Upsert admin user to ensure it exists and has correct privileges
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: 'ADMIN',
            status: UserStatus.ACTIVE,
            isTrial: false,
            trialEndsAt: null,
            // We don't update password here to preserve any changes made by the user
            // If you want to force reset password, uncomment the line below:
            // password: hashedPassword 
        },
        create: {
            email: adminEmail,
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN',
            status: UserStatus.ACTIVE,
            isTrial: false,
            trialEndsAt: null
        }
    })

    console.log('✅ Admin user seeded successfully:')
    console.log('   Email:', admin.email)
    console.log('   Password:', adminPassword, '(only applicable if created new)')
    console.log('   Role:', admin.role)
    console.log('   Status:', admin.status)

    console.log('🎉 Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
