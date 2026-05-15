import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://jkeducareservices.com'),
  title: 'JK Edu-Care Services | Student Guidance & Career Counseling',
  verification: {
    google: "4-r7ZGE-Emafefak17qY3IaRSqZnNPe2gde5U07GS",
  },
  robots: {
    index: true,
    follow: true,
  },
  description:
    'Get expert guidance for college admissions, career decisions, and exam preparation. Personal support from JK Sir and experienced educators. Trusted by 2000+ students across Tamil Nadu.',
  keywords: [
    'college admission', 'career counseling', 'NEET guidance', 'CUET preparation',
    'education support', 'JK Sir', 'Tamil Nadu', 'MBBS admission', 'Uzbekistan medical college',
    'Fergana Medical Institute', 'student guidance', 'JK Edu-Care',
  ],
  authors: [{ name: 'JK Edu-Care Services' }],
  creator: 'JK Edu-Care Services',
  icons: {
    // The actual JK logo PNGs you've added to /public
    icon: [
      { url: '/logo-light.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/logo-light.png',
    shortcut: '/logo-light.png',
  },
  openGraph: {
    title: 'JK Edu-Care Services | Student Guidance & Career Counseling',
    description: 'Expert guidance for college admissions, career decisions, and exam preparation. Personal support from JK Sir — trusted by 2000+ students.',
    url: 'https://jkeducareservices.com',
    siteName: 'JK Edu-Care Services',
    images: [{ url: '/logo-light.png', width: 512, height: 512, alt: 'JK Edu-Care Services' }],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: 'JK Edu-Care Services',
    description: 'Expert student guidance — admissions, career counseling, and exam prep by JK Sir.',
    images: ['/logo-light.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a3fdb' },
    { media: '(prefers-color-scheme: dark)', color: '#060a18' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,600,700&display=swap"
        />

        {/* Dark-mode detection before paint — prevents flash */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if((s||p)==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
