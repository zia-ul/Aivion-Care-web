import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';
import { themeInitScript } from '@/lib/stores/theme';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aiconfidencecure.com'),
  title: {
    default: 'Aivion Care — Book Doctor Appointments Online, Clinic Software & Hospital OS',
    template: '%s | Aivion Care — Healthcare & Clinic Software',
  },
  description: 'Book verified doctor appointments online instantly, find top multi-specialty hospitals near you, or power your clinical practice with Aivion Care — India\'s next-gen AI clinic software, hospital ERP, 24/7 continuous vitals telemetry & digital prescriptions.',
  applicationName: 'Aivion Care',
  authors: [{ name: 'AI Confidence Cure', url: 'https://www.aiconfidencecure.com' }],
  creator: 'AI Confidence Cure (AMUIF Incubated)',
  publisher: 'AI Confidence Cure',
  keywords: [
    'book doctor appointment online',
    'online doctor consultation',
    'find doctors near me',
    'best hospital near me',
    'clinic management software',
    'doctor practice management software',
    'hospital management software India',
    'hospital ERP',
    'telemedicine app India',
    'online medicine delivery pharmacy',
    'pathology lab tests online',
    'Aivion Care',
    'AI Confidence Cure',
    'continuous vitals telemetry',
    'digital prescription software',
    'electronic health records EHR',
    'smart OPD token queue',
    'Practo alternative doctor app'
  ],
  alternates: {
    canonical: 'https://www.aiconfidencecure.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.aiconfidencecure.com',
    title: 'Aivion Care — Book Doctor Appointments Online, Clinic Software & Hospital OS',
    description: 'Instant verified doctor consultations, top hospitals, and all-in-one clinic management software. 24/7 AI telemetry, digital prescriptions & seamless appointments.',
    siteName: 'Aivion Care',
    images: [
      {
        url: '/images/aivion-care-logo.png',
        width: 800,
        height: 800,
        alt: 'Aivion Care Healthcare Ecosystem Logo',
      },
      {
        url: '/images/healthcare/smart-monitoring.jpg',
        width: 1200,
        height: 630,
        alt: 'Aivion Care Online Doctor Appointments & Hospital Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aivion Care — Book Doctor Appointments Online & Clinic Management Software',
    description: 'Find verified doctors, book appointments, or digitize your hospital and clinic with all-in-one AI clinical software.',
    images: ['/images/healthcare/smart-monitoring.jpg'],
    creator: '@aivioncare',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aivion Care',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icons/icon-512x512.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#07141d' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'MedicalWebPage',
                name: 'Aivion Care — Book Doctor Appointments Online & Clinic Software',
                url: 'https://www.aiconfidencecure.com',
                description: 'Book verified doctors online, access top hospital schedules, and empower clinics with smart AI management software.',
                about: {
                  '@type': 'MedicalBusiness',
                  name: 'Aivion Care',
                  url: 'https://www.aiconfidencecure.com',
                  logo: 'https://www.aiconfidencecure.com/images/aivion-care-logo.png',
                  medicalSpecialty: [
                    'GeneralPractice',
                    'Cardiology',
                    'Pediatrics',
                    'Dermatology',
                    'Orthopedics',
                    'Gynecology'
                  ],
                  availableService: [
                    {
                      '@type': 'MedicalTherapy',
                      name: 'Online Doctor Video Consultation'
                    },
                    {
                      '@type': 'MedicalTherapy',
                      name: 'In-Clinic Doctor Appointment Booking'
                    },
                    {
                      '@type': 'MedicalTherapy',
                      name: '24/7 Continuous Vitals & ECG Telemetry'
                    }
                  ]
                }
              },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Aivion Care Clinic & Hospital OS',
                operatingSystem: 'Web, Android, iOS',
                applicationCategory: 'HealthApplication, BusinessApplication',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'INR'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  ratingCount: '1280'
                }
              }
            ])
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22D3C5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aivion Care" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.svg" />
        <link rel="icon" type="image/svg+xml" sizes="any" href="/icons/icon-512x512.svg" />
      </head>

      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}