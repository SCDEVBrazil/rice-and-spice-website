// app/og-image/route.tsx - Dynamic OG Image Generator
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Rice & Spice - Authentic Indian Restaurant'
  const subtitle = searchParams.get('subtitle') || 'Peoria, Illinois'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#78350f',
          backgroundImage: 'linear-gradient(135deg, #78350f 0%, #1c1917 100%)',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)',
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
            maxWidth: '1000px',
          }}
        >
          {/* Restaurant Name */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px',
              textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
              fontFamily: 'serif',
            }}
          >
            {title}
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: '36px',
              color: '#fde68a',
              marginBottom: '30px',
              fontWeight: '600',
            }}
          >
            {subtitle}
          </p>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '40px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#fed7aa',
                fontSize: '24px',
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '5px' }}>🍛</span>
              <span>Authentic Cuisine</span>
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#fed7aa',
                fontSize: '24px',
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '5px' }}>🥘</span>
              <span>Saturday Buffet</span>
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#fed7aa',
                fontSize: '24px',
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '5px' }}>📍</span>
              <span>Main St Peoria</span>
            </div>
          </div>
          
          {/* Contact Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '60px',
              color: '#fbbf24',
              fontSize: '28px',
              fontWeight: '600',
            }}
          >
            <span>(309) 670-1029</span>
            <span>•</span>
            <span>riceandspicepeoria.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}