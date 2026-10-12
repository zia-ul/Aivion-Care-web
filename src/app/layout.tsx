import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';
import { themeInitScript } from '@/lib/stores/theme';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aiconfidencecure.com'),
  title: {
    default: 'Aivion Care — Connected Healthcare & 24/7 AI Telemetry OS',
    template: '%s | Aivion Care',
  },
  description: 'Connected Healthcare Operating System: 24/7 continuous vitals monitoring, real-time Pan-Tompkins ECG, instant HD doctor teleconsultations, digital prescriptions, and multi-role hospital management.',
  applicationName: 'Aivion Care',
  authors: [{ name: 'AI Confidence Cure', url: 'https://www.aiconfidencecure.com' }],
  creator: 'AI Confidence Cure (AMUIF Incubated)',
  publisher: 'AI Confidence Cure',
  keywords: [
    'Aivion Care',
    'AI Confidence Cure',
    'connected healthcare',
    'telemedicine India',
    'continuous vitals monitoring',
    'live ECG telemetry',
    'Pan-Tompkins QRS algorithm',
    'online doctor consultation',
    'hospital management system',
    'digital prescriptions',
    'patient medical records',
    'clinical health tech',
    'AMUIF startup'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.aiconfidencecure.com',
    title: 'Aivion Care — Connected Healthcare & 24/7 AI Telemetry OS',
    description: 'Instant doctor appointments, 24/7 live ECG telemetry, digital prescriptions, and whole-hospital synchronization in one workspace.',
    siteName: 'Aivion Care',
    images: [
      {
        url: '/images/aivion-care-logo.png',
        width: 800,
        height: 800,
        alt: 'Aivion Care Connected Healthcare Logo',
      },
      {
        url: '/images/healthcare/smart-monitoring.jpg',
        width: 1200,
        height: 630,
        alt: 'Aivion Care 24/7 Smart Telemetry Monitoring',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aivion Care — Connected Healthcare & 24/7 AI Telemetry OS',
    description: 'Autonomous ECG, instant doctor video queues, hospital bed sync, and EHR passport. No cap, just seamless care.',
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22D3C5" />
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