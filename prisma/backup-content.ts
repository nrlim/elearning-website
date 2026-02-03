/**
 * Simple script to backup your Content data to JSON
 * This creates a safe backup before migration
 * 
 * Run: npx ts-node prisma/backup-content.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function backupContent() {
    console.log('🔄 Starting backup...\n');

    try {
        // Fetch all content
        const allContent = await prisma.$queryRaw<any[]>`
      SELECT * FROM "Content"
    `;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(process.cwd(), `backup_content_${timestamp}.json`);

        // Save to JSON file
        fs.writeFileSync(backupFile, JSON.stringify(allContent, null, 2));

        console.log(`✅ Backup completed successfully!`);
        console.log(`📁 Backup saved to: ${backupFile}`);
        console.log(`📊 Records backed up: ${allContent.length}\n`);

        // Show sample of data
        if (allContent.length > 0) {
            console.log('📝 Sample record:');
            console.log('─'.repeat(50));
            const sample = allContent[0];
            console.log(`ID: ${sample.id}`);
            console.log(`Title: ${sample.title}`);
            console.log(`URL: ${sample.youtubeUrl || sample.videoUrl || 'N/A'}`);
            console.log(`Module ID: ${sample.moduleId}`);
            console.log('─'.repeat(50));
        }

        console.log('\n✅ Your data is now safely backed up!');
        console.log('💡 You can proceed with migration.\n');

    } catch (error) {
        console.error('❌ Backup failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

backupContent().catch(console.error);
