/**
 * Favicon Generator Script
 * Automatically generates favicons for all tenants from their logo images
 * 
 * Usage: node scripts/generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tenant configuration mapping tenant ID to logo file
const tenants = {
    'default': 'cryptolearn-logo.png',
    'corporate-training': 'skillflow-logo.png',
    'vesper-crypto': 'vesper-logo.png',
    'media-crypto': 'media-logo.png',
    'tech-institute': 'tech-institute-logo.png',
    'finance-pro': 'finance-pro-logo.png',
    'creative-academy': 'creative-academy-logo.png',
    'secure-net': 'secure-net-logo.png',
};

// Favicon sizes to generate
const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'favicon-192x192.png' },
    { size: 512, name: 'favicon-512x512.png' },
];

async function generateFaviconsForTenant(tenantId, logoFileName) {
    const logoPath = path.join(__dirname, '..', 'public', 'images', logoFileName);
    const outputDir = path.join(__dirname, '..', 'public', 'favicon', tenantId);

    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
        console.log(`⚠️  Skipping ${tenantId}: Logo file not found (${logoFileName})`);
        return;
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`🎨 Generating favicons for ${tenantId}...`);

    try {
        // Generate PNG favicons at different sizes
        for (const { size, name } of faviconSizes) {
            await sharp(logoPath)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .png()
                .toFile(path.join(outputDir, name));
            console.log(`  ✅ Created ${name} (${size}x${size})`);
        }

        // Generate ICO file (32x32)
        await sharp(logoPath)
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toFile(path.join(outputDir, 'favicon.ico'));
        console.log(`  ✅ Created favicon.ico (32x32)`);

        // Generate site.webmanifest
        const manifest = {
            name: tenantId.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            short_name: tenantId.split('-')[0].charAt(0).toUpperCase() +
                tenantId.split('-')[0].slice(1),
            icons: [
                {
                    src: `/favicon/${tenantId}/favicon-192x192.png`,
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: `/favicon/${tenantId}/favicon-512x512.png`,
                    sizes: "512x512",
                    type: "image/png"
                }
            ],
            theme_color: "#0a0a0a",
            background_color: "#0a0a0a",
            display: "standalone"
        };

        fs.writeFileSync(
            path.join(outputDir, 'site.webmanifest'),
            JSON.stringify(manifest, null, 2)
        );
        console.log(`  ✅ Created site.webmanifest`);

        console.log(`✨ Favicons for ${tenantId} generated successfully!\n`);
    } catch (error) {
        console.error(`❌ Error generating favicons for ${tenantId}:`, error.message);
    }
}

async function generateAllFavicons() {
    console.log('🚀 Starting favicon generation for all tenants...\n');

    for (const [tenantId, logoFileName] of Object.entries(tenants)) {
        await generateFaviconsForTenant(tenantId, logoFileName);
    }

    console.log('🎉 All favicons generated!');
    console.log('\n📝 Next steps:');
    console.log('1. Check the generated favicons in public/favicon/{tenant-name}/');
    console.log('2. Set NEXT_PUBLIC_TENANT in your .env.local to test');
    console.log('3. Deploy to Vercel with the appropriate environment variable\n');
}

// Run the script
generateAllFavicons().catch(console.error);
