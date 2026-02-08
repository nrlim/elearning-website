/**
 * Country Flag Component
 * Renders SVG flags for better cross-browser/platform compatibility
 */

interface CountryFlagProps {
    country: string
    className?: string
}

export function CountryFlag({ country, className = "" }: CountryFlagProps) {
    // Indonesian Flag (Red top, White bottom)
    if (country === "ID" || country === "🇮🇩") {
        return (
            <svg
                className={className}
                viewBox="0 0 900 600"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Indonesian Flag"
            >
                <title>Indonesia</title>
                {/* Red top half */}
                <rect width="900" height="300" fill="#FF0000" />
                {/* White bottom half */}
                <rect y="300" width="900" height="300" fill="#FFFFFF" />
            </svg>
        )
    }

    // Fallback: show emoji if SVG not available
    return <span className={className}>{country}</span>
}
