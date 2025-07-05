import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Poppins, Cinzel_Decorative } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-cinzel-decorative",
})

export const metadata: Metadata = {
  title: "Rice and Spice - Authentic Indian Restaurant in Peoria, IL",
  description:
    "Experience the rich flavors and aromatic spices of authentic Indian cuisine at Rice and Spice in Peoria, Illinois.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${cinzelDecorative.variable} font-sans`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}