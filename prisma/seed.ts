import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create default admin user
    const adminEmail = 'admin@cryptolearn.com'
    const adminPassword = 'Admin123!' // Change this to a secure password

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (existingAdmin) {
        console.log('✅ Admin user already exists:', adminEmail)
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 10)
        const admin = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN'
            }
        })
        console.log('✅ Created admin user:', admin.email)
        console.log('   Email:', adminEmail)
        console.log('   Password:', adminPassword)
    }

    // Create sample content
    // Create sample module and content
    const sampleModule = {
        title: 'Crypto Basics',
        description: 'A comprehensive introduction to cryptocurrency fundamentals.',
    }

    let module = await prisma.module.findFirst({
        where: { title: sampleModule.title }
    })

    if (!module) {
        module = await prisma.module.create({ data: sampleModule })
        console.log('✅ Created module:', module.title)
    }

    const sampleContent = [
        {
            title: 'Introduction to Bitcoin',
            description: 'Learn the fundamentals of Bitcoin, the first cryptocurrency. Understand how blockchain technology works and why Bitcoin is revolutionary.',
            youtubeUrl: 'https://www.youtube.com/watch?v=Gc2en3nHxA4',
            moduleId: module!.id
        },
        {
            title: 'Ethereum and Smart Contracts',
            description: 'Discover Ethereum\'s smart contract platform and how it\'s changing the world of decentralized applications.',
            youtubeUrl: 'https://www.youtube.com/watch?v=ZE2HxTmxfrI',
            moduleId: module!.id
        },
        {
            title: 'DeFi Explained',
            description: 'An introduction to Decentralized Finance (DeFi) - the future of banking and financial services.',
            youtubeUrl: 'https://www.youtube.com/watch?v=k9HYC0EJU6E',
            moduleId: module!.id
        }
    ]

    for (const content of sampleContent) {
        const existing = await prisma.content.findFirst({
            where: { title: content.title }
        })

        if (!existing) {
            await prisma.content.create({ data: content })
            console.log('✅ Created content:', content.title)
        } else {
            console.log('⏭️  Content already exists:', content.title)
        }
    }

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
