/**
 * Open Graph Image Generator for WhatsApp/Social Media Sharing
 * Converts tenant logos into 1200x630px OG images
 * 
 * Usage: node scripts/generate-og-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tenant configuration - maps tenant to logo and brand colors
const tenants = {
    'vesper-crypto': {
        logo: 'vesper-logo.png',
        name: 'Vesper Crypto',
        tagline: 'Elite Cryptocurrency Investment Strategies',
        bgColor: '#0a0a14', // Dark navy
        accentColor: '#d4af37', // Gold
    },
    'media-crypto': {
        logo: 'media-logo.png',
        name: 'Mediaa Mirror ID 🇮🇩',
        tagline: 'Cryptocurrency Education & Digital Asset Mastery',
        bgColor: '#1a0a2e', // Deep purple
        accentColor: '#ff6b35', // Orange-red
    },
    'default': {
        logo: 'cryptolearn-logo.png',
        name: 'CryptoLearn',
        tagline: 'Premium E-Learning Platform for Crypto Enthusiasts',
        bgColor: '#0f0f23',
        accentColor: '#6366f1',
    },
};

// OG Image dimensions (standard for WhatsApp/social media)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function generateOGImage(tenantId, config) {
    const logoPath = path.join(__dirname, '..', 'public', 'images', config.logo);
    const outputPath = path.join(__dirname, '..', 'public', 'images', `${tenantId}-og.png`);

    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
        console.log(`⚠️  Skipping ${tenantId}: Logo file not found (${config.logo})`);
        return;
    }

    console.log(`🎨 Generating OG image for ${tenantId}...`);

    try {
        // Create a solid background
        const background = await sharp({
            create: {
                width: OG_WIDTH,
                height: OG_HEIGHT,
                channels: 4,
                background: config.bgColor
            }
        }).png().toBuffer();

        // Resize logo to fit nicely (max 400x400 in center)
        const logo = await sharp(logoPath)
            .resize(400, 400, {
                fit: 'inside',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer();

        // Composite logo onto background (centered)
        const logoX = Math.floor((OG_WIDTH - 400) / 2);
        const logoY = Math.floor((OG_HEIGHT - 400) / 2);

        await sharp(background)
            .composite([
                {
                    input: logo,
                    top: logoY,
                    left: logoX,
                }
            ])
            .png()
            .toFile(outputPath);

        console.log(`  ✅ Created ${tenantId}-og.png (${OG_WIDTH}x${OG_HEIGHT})`);
        console.log(`  📍 Saved to: public/images/${tenantId}-og.png\n`);

    } catch (error) {
        console.error(`❌ Error generating OG image for ${tenantId}:`, error.message);
    }
}

async function generateAllOGImages() {
    console.log('🚀 Starting OG image generation for WhatsApp/Social Media sharing...\n');

    for (const [tenantId, config] of Object.entries(tenants)) {
        await generateOGImage(tenantId, config);
    }

    console.log('🎉 All OG images generated!');
    console.log('\n📝 Next steps:');
    console.log('1. Update layout.tsx with your actual domain URL');
    console.log('2. Test WhatsApp sharing by sending your website link');
    console.log('3. Verify the preview shows your logo and description\n');
    console.log('💡 Tip: Use different tenants by changing NEXT_PUBLIC_TENANT in .env.local\n');
}

// Run the script
generateAllOGImages().catch(console.error);
