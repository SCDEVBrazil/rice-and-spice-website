import Image from "next/image"
import { menuImages } from "@/lib/menu-images"

interface MenuSectionImageProps {
  section: string
  className?: string
  size?: "small" | "medium" | "large"
}

export function MenuSectionImage({ 
  section, 
  className = "", 
  size = "medium" 
}: MenuSectionImageProps) {
  const imageConfig = menuImages[section]
  
  if (!imageConfig) {
    return null
  }

  const sizeClasses = {
    small: "h-32 w-full",
    medium: "h-48 w-full", 
    large: "h-64 w-full"
  }

  return (
    <div className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden mb-6 ${className}`}>
      <Image
        src={imageConfig.src}
        alt={imageConfig.alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={imageConfig.priority || false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}