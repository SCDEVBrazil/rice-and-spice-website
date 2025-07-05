import Image from "next/image"

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

// Logo with Icon and Text (Main Logo) - USING ACTUAL RESTAURANT LOGO
export function LogoWithIcon({ width = 300, height = 300, className = "" }: LogoProps) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <Image
        src="/images/rice-and-spice.png"
        alt="Rice and Spice - Authentic Indian Cuisine"
        width={width}
        height={height}
        className="rounded-full object-cover"
        priority
      />
    </div>
  )
}

// Icon Only (for headers, favicons)
export function LogoIcon({ width = 60, height = 60, className = "" }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="#FFF8E7" stroke="#D4AF37" strokeWidth="3" />

      {/* Rice grains - larger for better visibility */}
      <ellipse cx="45" cy="40" rx="4" ry="12" fill="#FF6B35" transform="rotate(-15 45 40)" />
      <ellipse cx="60" cy="35" rx="4" ry="12" fill="#D4AF37" transform="rotate(10 60 35)" />
      <ellipse cx="75" cy="40" rx="4" ry="12" fill="#FF6B35" transform="rotate(-20 75 40)" />
      <ellipse cx="50" cy="60" rx="4" ry="12" fill="#D4AF37" transform="rotate(25 50 60)" />
      <ellipse cx="70" cy="65" rx="4" ry="12" fill="#FF6B35" transform="rotate(-10 70 65)" />

      {/* Spice leaves */}
      <path d="M35 75 Q45 65 55 75 Q50 85 35 75 Z" fill="#D4AF37" />
      <path d="M65 80 Q75 70 85 80 Q80 90 65 80 Z" fill="#FF6B35" />

      {/* Center decorative element */}
      <circle cx="60" cy="55" r="3" fill="#B22222" />

      {/* Outer decorative dots */}
      <circle cx="30" cy="60" r="2.5" fill="#D4AF37" opacity="0.7" />
      <circle cx="90" cy="60" r="2.5" fill="#FF6B35" opacity="0.7" />
    </svg>
  )
}

// Text Only with Decorative Elements
export function LogoTextOnly({ width = 280, height = 80, className = "" }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main text */}
      <text x="140" y="35" fontFamily="serif" fontSize="32" fontWeight="600" fill="#B22222" textAnchor="middle">
        Rice and Spice
      </text>

      {/* Decorative elements integrated with text */}
      {/* Left side decoration */}
      <g transform="translate(20, 25)">
        <ellipse cx="0" cy="0" rx="2" ry="6" fill="#FF6B35" transform="rotate(-20)" />
        <ellipse cx="8" cy="-3" rx="2" ry="6" fill="#D4AF37" transform="rotate(15)" />
        <ellipse cx="16" cy="0" rx="2" ry="6" fill="#FF6B35" transform="rotate(-25)" />
      </g>

      {/* Right side decoration */}
      <g transform="translate(260, 25)">
        <ellipse cx="0" cy="0" rx="2" ry="6" fill="#D4AF37" transform="rotate(20)" />
        <ellipse cx="-8" cy="-3" rx="2" ry="6" fill="#FF6B35" transform="rotate(-15)" />
        <ellipse cx="-16" cy="0" rx="2" ry="6" fill="#D4AF37" transform="rotate(25)" />
      </g>

      {/* Elegant flourish under text */}
      <path d="M40 45 Q140 35 240 45 Q140 55 40 45" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.8" />

      {/* Small spice leaf accents */}
      <path d="M50 50 Q55 45 60 50 Q57 55 50 50 Z" fill="#FF6B35" opacity="0.7" />
      <path d="M220 50 Q225 45 230 50 Q227 55 220 50 Z" fill="#D4AF37" opacity="0.7" />

      {/* Tagline */}
      <text x="140" y="65" fontFamily="sans-serif" fontSize="10" fill="#666" textAnchor="middle" letterSpacing="1.5px">
        AUTHENTIC INDIAN CUISINE
      </text>
    </svg>
  )
}

// Simplified Icon for very small sizes (favicon, etc.)
export function LogoSimple({ width = 32, height = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="14" fill="#FFF8E7" stroke="#D4AF37" strokeWidth="2" />

      {/* Simplified rice grains */}
      <ellipse cx="12" cy="12" rx="1.5" ry="4" fill="#FF6B35" transform="rotate(-20 12 12)" />
      <ellipse cx="16" cy="10" rx="1.5" ry="4" fill="#D4AF37" />
      <ellipse cx="20" cy="12" rx="1.5" ry="4" fill="#FF6B35" transform="rotate(20 20 12)" />

      {/* Simple spice accent */}
      <path d="M10 20 Q14 18 18 20 Q16 22 10 20 Z" fill="#D4AF37" />

      {/* Center dot */}
      <circle cx="16" cy="16" r="1" fill="#B22222" />
    </svg>
  )
}
