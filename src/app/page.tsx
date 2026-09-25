import AboutSection from '@/components/landing/AboutSection';
import AISection from '@/components/landing/AISection';
import CompanySection from '@/components/landing/CompanySection';
import EcosystemSection from '@/components/landing/EcosystemSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FinalCTA from '@/components/landing/FinalCTA';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNavbar from '@/components/landing/LandingNavbar';
import MonitoringSection from '@/components/landing/MonitoringSection';
import PatientJourneySection from '@/components/landing/PatientJourneySection';
import RolesSection from '@/components/landing/RolesSection';
import SecuritySection from '@/components/landing/SecuritySection';
import TrustStats from '@/components/landing/TrustStats';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-bg text-primary-light">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustStats />
        <AboutSection />
        <FeaturesSection />
        <div id="monitoring"><MonitoringSection /></div>
        <AISection />
        <EcosystemSection />
        <RolesSection />
        <HowItWorksSection />
        <PatientJourneySection />
        <SecuritySection />
        <CompanySection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
