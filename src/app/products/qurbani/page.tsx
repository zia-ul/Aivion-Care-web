import { CheckCircle2, Package, ShoppingCart, Truck } from 'lucide-react';
import ProductPageTemplate, { type ProductDetail } from '@/components/landing/ProductPageTemplate';

const product: ProductDetail = {
  eyebrow: 'Mobile Application',
  title: 'Qurbani',
  tagline: 'A streamlined mobile app for managing Qurbani bookings and service coordination.',
  description:
    'Qurbani is a compact mobile application focused on making service coordination effortless. Users can place bookings, track order status, and stay informed at every step of the process.',
  status: 'Completed project',
  Icon: ShoppingCart,
  highlights: [
    'Simple booking flow with clear confirmations',
    'Order tracking with live status updates',
    'Service coordination without paperwork',
  ],
  features: [
    { title: 'Easy Bookings', text: 'Place a booking in a few taps with clear confirmation and reference details.' },
    { title: 'Order Tracking', text: 'Follow the status of each request from confirmation to completion.' },
    { title: 'Service Coordination', text: 'Keep every part of the service in one place instead of scattered calls and messages.' },
    { title: 'User Friendly UI', text: 'A clean interface designed so first-time users can complete tasks without help.' },
  ],
  specs: [
    { label: 'Category', value: 'Mobile Application' },
    { label: 'Platforms', value: 'Android app' },
    { label: 'Focus', value: 'Booking and order coordination' },
    { label: 'Status', value: 'Completed project' },
  ],
  platforms: ['Android'],
  ctaLabel: 'Learn More',
};

export default function QurbaniProductPage() {
  return <ProductPageTemplate product={product} />;
}
