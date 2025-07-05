// components/seo/SEOHead.tsx
import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  keywords?: string[]
  noindex?: boolean
  jsonLd?: object
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  keywords = [],
  noindex = false,
  jsonLd
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | Rice & Spice - Indian Restaurant Peoria`
    : 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL'
  
  const fullDescription = description || 
    'Experience authentic Indian cuisine at Rice & Spice in Peoria, Illinois. Traditional dishes, Saturday buffet, fresh ingredients. Dine-in, takeout & catering available.'
  
  const canonicalUrl = canonical ? `https://riceandspicepeoria.com${canonical}` : 'https://riceandspicepeoria.com'
  const imageUrl = `https://riceandspicepeoria.com${ogImage}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Keywords */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="Rice & Spice Restaurant" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={fullTitle} />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  )
}