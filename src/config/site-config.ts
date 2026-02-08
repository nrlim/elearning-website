export interface SiteConfig {
    name: string;
    description: string;
    logoText: string;
    logoImage?: string;
    theme: string;
    discordLink?: string;
    fallbackAccessLink?: string;
}

export const configs: Record<string, SiteConfig> = {
    "default": {
        name: "CryptoLearn",
        description: "Premium E-Learning Platform for Crypto Enthusiasts",
        logoText: "CryptoLearn",
        logoImage: "/images/cryptolearn-logo.png",
        theme: "default",
        discordLink: "https://discord.com/invite/gR4mdaDax",
        fallbackAccessLink: "https://lynk.id/belajarlewatmodul"
    },
    "corporate-training": {
        name: "SkillFlow",
        description: "Enterprise Training Solutions for Modern Teams",
        logoText: "SkillFlow",
        logoImage: "/images/skillflow-logo.png",
        theme: "orange",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 1. Vesper Crypto (Requested) - Premium Dark/Gold
    "vesper-crypto": {
        name: "Vesper Crypto",
        description: "Elite Cryptocurrency Investment Strategies",
        logoText: "Vesper",
        logoImage: "/images/vesper-logo.png",
        theme: "vesper",
        discordLink: "https://discord.com/invite/gR4mdaDax",
        fallbackAccessLink: "https://lynk.id/belajarlewatmodul"
    },
    // 2. TechInstitute - Modern Blue/Teal
    "tech-institute": {
        name: "TechInstitute",
        description: "Future-Ready Technical Skills",
        logoText: "TechInst.",
        logoImage: "/images/tech-institute-logo.png",
        theme: "tech",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 3. FinancePro - Trustworthy Green/Gold
    "finance-pro": {
        name: "FinancePro",
        description: "Mastering Wealth Management",
        logoText: "FinancePro",
        logoImage: "/images/finance-pro-logo.png",
        theme: "finance",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 4. CreativeAcademy - Vibrant Pink/Violet
    "creative-academy": {
        name: "CreativeAcademy",
        description: "Unleash Your Creative Potential",
        logoText: "Create.",
        logoImage: "/images/creative-academy-logo.png",
        theme: "creative",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    },
    // 5. SecureNet - Cyber Security Theme
    "secure-net": {
        name: "SecureNet",
        description: "Advanced Cybersecurity Training",
        logoText: "SecureNet",
        logoImage: "/images/secure-net-logo.png",
        theme: "security",
        discordLink: "https://discord.com/invite/gR4mdaDax"
    }
};

export const currentTenant = process.env.NEXT_PUBLIC_TENANT || "default";
export const siteConfig = configs[currentTenant] || configs["default"];
