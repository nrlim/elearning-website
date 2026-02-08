export interface SiteConfig {
    name: string;
    description: string;
    url: string; // Site URL for Metadata
    logoText: string;
    logoImage?: string;
    ogImage?: string; // Open Graph Image for Social Media (WhatsApp, etc.)
    theme: string;
    countryFlag?: string;  // Flag emoji or icon to show beside logo
    discordLink?: string;
    fallbackAccessLink?: string;
}

export const configs: Record<string, SiteConfig> = {
    "default": {
        name: "CryptoLearn",
        description: "Premium E-Learning Platform for Crypto Enthusiasts",
        url: "https://cryptolearn.com",
        logoText: "CryptoLearn",
        logoImage: "/images/cryptolearn-logo.png",
        ogImage: "/images/default-og.png",
        theme: "default",
        discordLink: "https://discord.com/invite/gR4mdaDax",
        fallbackAccessLink: "https://lynk.id/belajarlewatmodul"
    },
    "corporate-training": {
        name: "SkillFlow",
        description: "Enterprise Training Solutions for Modern Teams",
        url: "https://skillflow.com",
        logoText: "SkillFlow",
        logoImage: "/images/skillflow-logo.png",
        theme: "orange",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 1. Vesper Crypto (Requested) - Premium Dark/Gold
    "vesper-crypto": {
        name: "Vesper Crypto",
        description: "Elite Cryptocurrency Investment Strategies",
        url: "https://vespercrypto.com",
        logoText: "Vesper",
        logoImage: "/images/vesper-logo.png",
        ogImage: "/images/vesper-logo.png",
        theme: "vesper",
        discordLink: "https://discord.com/invite/gR4mdaDax",
        fallbackAccessLink: "https://lynk.id/belajarlewatmodul"
        // No flag for Vesper
    },
    // 2. Media Crypto - Custom Phoenix Theme with Indonesian Flag
    "media-crypto": {
        name: "Mediaa Mirror ID",
        description: "Cryptocurrency Education & Digital Asset Mastery",
        url: "https://mediaamirror.id",
        logoText: "Mediaa Mirror ID",
        logoImage: "/images/media-logo.png",
        ogImage: "/images/media-logo.png",
        theme: "phoenix",
        countryFlag: "🇮🇩",  // Indonesian flag emoji
        discordLink: "https://discord.com/invite/WgbwQvxdCc",
        fallbackAccessLink: "https://id.shp.ee/pjaBmRX"
    },
    // 3. TechInstitute - Modern Blue/Teal
    "tech-institute": {
        name: "TechInstitute",
        description: "Future-Ready Technical Skills",
        url: "https://techinstitute.com",
        logoText: "TechInst.",
        logoImage: "/images/tech-institute-logo.png",
        theme: "tech",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 4. FinancePro - Trustworthy Green/Gold
    "finance-pro": {
        name: "FinancePro",
        description: "Mastering Wealth Management",
        url: "https://financepro.com",
        logoText: "FinancePro",
        logoImage: "/images/finance-pro-logo.png",
        theme: "finance",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 5. CreativeAcademy - Vibrant Pink/Violet
    "creative-academy": {
        name: "CreativeAcademy",
        description: "Unleash Your Creative Potential",
        url: "https://creativeacademy.com",
        logoText: "Create.",
        logoImage: "/images/creative-academy-logo.png",
        theme: "creative",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 6. SecureNet - Cyber Security Theme
    "secure-net": {
        name: "SecureNet",
        description: "Advanced Cybersecurity Training",
        url: "https://securenet.com",
        logoText: "SecureNet",
        logoImage: "/images/secure-net-logo.png",
        theme: "security",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    }
};

export const currentTenant = process.env.NEXT_PUBLIC_TENANT || "default";
export const siteConfig = configs[currentTenant] || configs["default"];
