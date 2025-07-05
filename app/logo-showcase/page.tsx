import { LogoWithIcon, LogoIcon, LogoTextOnly, LogoSimple } from "@/components/logos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-decorative text-deepRed text-center mb-12">Rice and Spice Logo Variations</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Logo with Icon */}
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="text-deepRed">Main Logo (Icon + Text)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg">
                <LogoWithIcon width={300} height={120} />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Primary logo for website headers, business cards, and marketing materials
              </p>
            </CardContent>
          </Card>

          {/* Icon Only */}
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="text-deepRed">Icon Only</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg">
                <LogoIcon width={120} height={120} />
              </div>
              <p className="text-sm text-gray-600 text-center">
                For social media profiles, app icons, and compact spaces
              </p>
            </CardContent>
          </Card>

          {/* Text Only */}
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="text-deepRed">Text with Decorative Elements</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg">
                <LogoTextOnly width={280} height={80} />
              </div>
              <p className="text-sm text-gray-600 text-center">
                For letterheads, invoices, and text-focused applications
              </p>
            </CardContent>
          </Card>

          {/* Simple Icon */}
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="text-deepRed">Simplified Icon</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg">
                <LogoSimple width={64} height={64} />
              </div>
              <p className="text-sm text-gray-600 text-center">
                For favicons, very small applications, and simplified uses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Size Variations Demo */}
        <Card className="border-gold/30 mt-8">
          <CardHeader>
            <CardTitle className="text-deepRed">Size Scalability Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="text-center">
                  <LogoWithIcon width={200} height={80} />
                  <p className="text-xs mt-2">Large (200px)</p>
                </div>
                <div className="text-center">
                  <LogoWithIcon width={150} height={60} />
                  <p className="text-xs mt-2">Medium (150px)</p>
                </div>
                <div className="text-center">
                  <LogoWithIcon width={100} height={40} />
                  <p className="text-xs mt-2">Small (100px)</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <LogoIcon width={80} height={80} />
                  <p className="text-xs mt-2">Icon Large</p>
                </div>
                <div className="text-center">
                  <LogoIcon width={48} height={48} />
                  <p className="text-xs mt-2">Icon Medium</p>
                </div>
                <div className="text-center">
                  <LogoIcon width={32} height={32} />
                  <p className="text-xs mt-2">Icon Small</p>
                </div>
                <div className="text-center">
                  <LogoSimple width={24} height={24} />
                  <p className="text-xs mt-2">Favicon</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Variations */}
        <Card className="border-gold/30 mt-8">
          <CardHeader>
            <CardTitle className="text-deepRed">Background Variations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <LogoIcon width={80} height={80} />
                <p className="text-xs mt-2">White Background</p>
              </div>
              <div className="bg-cream p-4 rounded-lg text-center">
                <LogoIcon width={80} height={80} />
                <p className="text-xs mt-2">Cream Background</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <LogoIcon width={80} height={80} />
                <p className="text-xs mt-2">Light Gray Background</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
