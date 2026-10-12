import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/super-admin/',
          '/doctor/clinical-assessment/',
          '/patient/consultation/',
        ],
      },
    ],
    sitemap: 'https://www.aiconfidencecure.com/sitemap.xml',
  };
}
