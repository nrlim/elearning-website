/**
 * RESTORE Script - Use this ONLY if you need to rollback
 * 
 * This restores your Content data from the backup JSON file
 * 
 * Run: npx ts-node prisma/restore-content.ts backup_content_YYYY-MM-DD.json
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function restoreContent(backupFilePath: string) {
    console.log('🔄 Starting restore from backup...\n');

    try {
        // Check if backup file exists
        if (!fs.existsSync(backupFilePath)) {
            throw new Error(`Backup file not found: ${backupFilePath}`);
        }

        // Read backup file
        const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));

        console.log(`📁 Backup file: ${backupFilePath}`);
        console.log(`📊 Records in backup: ${backupData.length}\n`);

        if (backupData.length === 0) {
            console.log('⚠️  Backup file is empty. Nothing to restore.');
            return;
        }

        // Ask for confirmation
        console.log('⚠️  WARNING: This will restore data from the backup.');
        console.log('This may overwrite current data in the database.\n');

        let successCount = 0;
        let errorCount = 0;

        for (const record of backupData) {
            try {
                console.log(`📹 Restoring: ${record.title} (${record.id})`);

                // Restore record (upsert to avoid duplicates)
                await prisma.content.upsert({
                    where: { id: record.id },
                    update: {
                        title: record.title,
                        description: record.description,
                        videoUrl: record.youtubeUrl || record.videoUrl,
                        videoSource: record.videoSource || 'YOUTUBE',
                        thumbnail: record.thumbnail || null,
                        duration: record.duration || null,
                        moduleId: record.moduleId,
                    },
                    create: {
                        id: record.id,
                        title: record.title,
                        description: record.description,
                        videoUrl: record.youtubeUrl || record.videoUrl,
                        videoSource: record.videoSource || 'YOUTUBE',
                        thumbnail: record.thumbnail || null,
                        duration: record.duration || null,
                        moduleId: record.moduleId,
                    },
                });

                successCount++;
                console.log(`   ✅ Restored\n`);

            } catch (error) {
                errorCount++;
                console.error(`   ❌ Failed to restore: ${error}\n`);
            }
        }

        // Summary
        console.log('='.repeat(50));
        console.log('📊 Restore Summary:');
        console.log('='.repeat(50));
        console.log(`✅ Successfully restored: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📝 Total in backup: ${backupData.length}`);
        console.log('\n✨ Restore completed!\n');

    } catch (error) {
        console.error('❌ Restore failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Get backup file from command line argument
const backupFile = process.argv[2];

if (!backupFile) {
    console.error('❌ Error: Please provide backup file path');
    console.log('\nUsage: npm run restore:content backup_content_YYYY-MM-DD.json');
    process.exit(1);
}

restoreContent(backupFile).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
