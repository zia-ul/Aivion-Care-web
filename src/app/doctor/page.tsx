import { redirect } from 'next/navigation';

/**
 * Doctor index route redirecting to /doctor/dashboard for deep link parity.
 */
export default function DoctorIndexPage() {
  redirect('/doctor/dashboard');
}
