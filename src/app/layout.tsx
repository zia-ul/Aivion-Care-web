import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Aivion Care — Connected Healthcare',
    template: '%s | Aivion Care',
  },
  description: 'Secure appointments, consultations, records, prescriptions, and healthcare operations in one connected workspace.',
  applicationName: 'Aivion Care',
  keywords: ['healthcare', 'telemedicine', 'appointments', 'medical records', 'prescriptions'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07141d',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
