import { BookOpen, Headphones, Search, Type } from 'lucide-react';
import ProductPageTemplate, { type ProductDetail } from '@/components/landing/ProductPageTemplate';

const product: ProductDetail = {
  eyebrow: 'Mobile Application',
  title: 'Quran',
  tagline: 'A clean, accessible Quran app focused on distraction-free reading.',
  description:
    'The Quran mobile app is designed around smooth reading and calm navigation. The interface stays out of the way so the text remains the focus, with helpful navigation between sections and chapters.',
  status: 'Completed project',
  Icon: BookOpen,
  highlights: [
    'Smooth reading experience with clean typography',
    'Simple navigation between chapters and sections',
    'Distraction-free interface by design',
  ],
  features: [
    { title: 'Smooth Reading', text: 'Carefully tuned typography and spacing for comfortable, sustained reading.' },
    { title: 'Clear Navigation', text: 'Move between chapters and sections without friction or confusion.' },
    { title: 'Distraction Free', text: 'A minimal interface that keeps attention on the text.' },
    { title: 'Accessible Controls', text: 'Readable sizing and contrast that work well on smaller screens.' },
  ],
  specs: [
    { label: 'Category', value: 'Mobile Application' },
    { label: 'Platforms', value: 'Android app' },
    { label: 'Focus', value: 'Reading and navigation' },
    { label: 'Status', value: 'Completed project' },
  ],
  platforms: ['Android'],
  ctaLabel: 'Learn More',
};

export default function QuranProductPage() {
  return <ProductPageTemplate product={product} />;
}
