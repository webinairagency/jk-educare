/**
 * advanced-seo.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop this in your layout.tsx (or page.tsx) to enable full SEO coverage.
 *
 * USAGE (layout.tsx):
 *   import { generateMetadata } from "@/components/advanced-seo"
 *   export { generateMetadata }            ← use the ready-made export, OR
 *   export const metadata = siteMetadata   ← export the base object directly
 *
 * USAGE (page.tsx — page-level override):
 *   import { generatePageMetadata } from "@/components/advanced-seo"
 *   export const metadata = generatePageMetadata({ title: "Services", ... })
 *
 * JSON-LD USAGE (inside a Server Component):
 *   import { JsonLd, organizationSchema, faqSchema } from "@/components/advanced-seo"
 *   <JsonLd data={organizationSchema} />
 *   <JsonLd data={faqSchema} />
 */

import type { Metadata } from "next"

// ─── SITE-WIDE CONSTANTS ──────────────────────────────────────────────────────
const SITE_URL   = "https://jkeducare.in"          // ← update to production URL
const SITE_NAME  = "JK Educare"
const SITE_TITLE = "JK Educare — Free Student Guidance by JK Sir"
const SITE_DESC  =
  "Expert, free educational guidance for Tamil Nadu students. NEET, CUET, MBBS Abroad, college admissions, and career counselling by JK Sir. 2000+ students guided."
const OG_IMAGE   = `${SITE_URL}/images/og-cover.jpg` // 1200×630 recommended
const TWITTER_HANDLE = "@JKEducare"
const PHONE      = "+919842463437"
const EMAIL      = "jkeducare@gmail.com"
const ADDRESS    = {
  street: "Tamil Nadu",
  city: "Tamil Nadu",
  state: "Tamil Nadu",
  country: "IN",
  postal: "600001",
}

// ─── BASE METADATA ────────────────────────────────────────────────────────────
export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESC,

  keywords: [
    "JK Educare",
    "JK Sir",
    "NEET guidance Tamil Nadu",
    "NEET counselling 2025",
    "CUET guidance",
    "MBBS abroad Tamil Nadu",
    "MBBS Uzbekistan",
    "free student counselling",
    "college admission guidance",
    "career counselling Tamil Nadu",
    "TNEA guidance",
    "medical college admission",
    "engineering college admission Tamil Nadu",
    "education consultant Tamil Nadu",
    "free education guidance",
    "student guidance Ramanathapuram",
  ],

  authors: [{ name: "JK Sir", url: SITE_URL }],
  creator: "JK Educare",
  publisher: "JK Educare",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "JK Educare — Free Student Guidance by JK Sir",
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X Card ────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },

  // ── Canonical & alternates ──────────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "ta-IN": `${SITE_URL}/ta`, // if Tamil version exists
    },
  },

  // ── Verification ────────────────────────────────────────────────────────────
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
    // bing:    "REPLACE_WITH_BING_WEBMASTER_TOKEN",
  },

  // ── App / PWA ────────────────────────────────────────────────────────────────
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },

  // ── Icons ───────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  // ── Manifest ─────────────────────────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── Category ─────────────────────────────────────────────────────────────────
  category: "education",
}

// ─── PAGE-LEVEL METADATA GENERATOR ───────────────────────────────────────────
interface PageMetaOptions {
  title: string
  description?: string
  path?: string           // e.g. "/services"
  ogImage?: string
  noIndex?: boolean
}

export function generatePageMetadata(opts: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${opts.path ?? ""}`
  const desc = opts.description ?? SITE_DESC

  return {
    ...siteMetadata,
    title: opts.title,
    description: desc,
    robots: opts.noIndex
      ? { index: false, follow: false }
      : siteMetadata.robots,
    openGraph: {
      ...siteMetadata.openGraph,
      title: `${opts.title} | ${SITE_NAME}`,
      description: desc,
      url,
      images: opts.ogImage
        ? [{ url: opts.ogImage, width: 1200, height: 630 }]
        : siteMetadata.openGraph?.images,
    },
    twitter: {
      ...siteMetadata.twitter,
      title: `${opts.title} | ${SITE_NAME}`,
      description: desc,
    },
    alternates: {
      canonical: url,
    },
  }
}

// ─── NAMED EXPORT (layout.tsx can re-export) ──────────────────────────────────
export const generateMetadata = async (): Promise<Metadata> => siteMetadata

// ─── JSON-LD COMPONENT (Server Component) ─────────────────────────────────────
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}
    />
  )
}

// ─── ORGANIZATION SCHEMA ──────────────────────────────────────────────────────
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/jk-educare-logo.png`,
  image: OG_IMAGE,
  description: SITE_DESC,
  telephone: PHONE,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.state,
    postalCode: ADDRESS.postal,
    addressCountry: ADDRESS.country,
  },
  sameAs: [
    "https://www.youtube.com/@jkeducare",          // ← update channel link
    "https://wa.me/919842463437",
    "https://www.instagram.com/jkeducare",          // ← update if exists
  ],
  founder: {
    "@type": "Person",
    name: "JK Sir",
    jobTitle: "Educational Counsellor",
    telephone: PHONE,
  },
  areaServed: {
    "@type": "State",
    name: "Tamil Nadu",
    addressCountry: "IN",
  },
  knowsAbout: [
    "NEET UG Counselling",
    "CUET Admissions",
    "MBBS Abroad",
    "Career Counselling",
    "College Admission Guidance",
    "Tamil Nadu Engineering Admissions",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Student Guidance Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "NEET Guidance", description: "Expert NEET UG & PG counselling" },
        price: "0",
        priceCurrency: "INR",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "CUET Guidance", description: "Central University admission support" },
        price: "0",
        priceCurrency: "INR",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "MBBS Abroad Guidance", description: "NMC-approved overseas MBBS" },
        price: "0",
        priceCurrency: "INR",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Career Counselling", description: "Personalised career direction" },
        price: "0",
        priceCurrency: "INR",
      },
    ],
  },
}

// ─── WEBSITE SCHEMA ───────────────────────────────────────────────────────────
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
  inLanguage: ["en-IN", "ta-IN"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

// ─── FAQ SCHEMA ───────────────────────────────────────────────────────────────
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is JK Educare's guidance service free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all guidance and consultation services provided by JK Sir at JK Educare are completely free of charge. There are no hidden fees.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact JK Sir for NEET guidance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `You can reach JK Sir via WhatsApp at +91 98424 63437 or call directly. Free consultation is available every day.`,
      },
    },
    {
      "@type": "Question",
      name: "Does JK Educare help with MBBS abroad admissions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, JK Educare provides trusted guidance for MBBS admissions in NMC-approved colleges in Uzbekistan, Russia, Georgia, and other countries — with full transparency on fees and process.",
      },
    },
    {
      "@type": "Question",
      name: "When are the live guidance sessions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JK Sir conducts free live guidance sessions every Sunday at 6:00 PM via Zoom. Students can join without prior registration to ask their doubts directly.",
      },
    },
    {
      "@type": "Question",
      name: "Which courses does JK Educare help with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JK Educare helps with NEET, CUET, TNEA, MBBS Abroad, Engineering, Law, Management, Arts & Science — covering all major academic streams for Tamil Nadu students.",
      },
    },
    {
      "@type": "Question",
      name: "How many students has JK Sir guided?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JK Sir has personally guided over 2000 students across Tamil Nadu in the past 3+ years, helping them secure admissions in top colleges across India and abroad.",
      },
    },
  ],
}

// ─── BREADCRUMB SCHEMA HELPER ─────────────────────────────────────────────────
export function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  }
}

// ─── LOCAL BUSINESS SCHEMA ────────────────────────────────────────────────────
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  name: SITE_NAME,
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: PHONE,
  email: EMAIL,
  priceRange: "Free",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tamil Nadu",
    addressRegion: "TN",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "250",
    bestRating: "5",
    worstRating: "1",
  },
}
