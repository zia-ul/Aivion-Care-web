import { redirect } from 'next/navigation';

/**
 * The Flutter app treats `/patient` as the patient home route. The web app uses
 * `/patient/dashboard`, so without this the shared/deep-linked path 404s.
 */
export default function PatientIndexPage() {
  redirect('/patient/dashboard');
}
