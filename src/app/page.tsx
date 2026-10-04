import AboutSection from '@/components/landing/AboutSection';
import AISection from '@/components/landing/AISection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CapabilitiesSection from '@/components/landing/CapabilitiesSection';
import ContactSection from '@/components/landing/ContactSection';
import DeliveredWorkSection from '@/components/landing/DeliveredWorkSection';
import DoctorFeaturesSection from '@/components/landing/DoctorFeaturesSection';
import EcosystemSection from '@/components/landing/EcosystemSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FinalCTA from '@/components/landing/FinalCTA';
import GallerySection from '@/components/landing/GallerySection';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import InitiativesSection from '@/components/landing/InitiativesSection';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNavbar from '@/components/landing/LandingNavbar';
import MonitoringSection from '@/components/landing/MonitoringSection';
import PatientFeaturesSection from '@/components/landing/PatientFeaturesSection';
import PatientJourneySection from '@/components/landing/PatientJourneySection';
import PlatformsSection from '@/components/landing/PlatformsSection';
import RolesSection from '@/components/landing/RolesSection';
import SecuritySection from '@/components/landing/SecuritySection';
import SupportChatbot from '@/components/landing/SupportChatbot';
import TrustStats from '@/components/landing/TrustStats';
import WhyUsSection from '@/components/landing/WhyUsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-bg text-primary-light">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustStats />
        <PlatformsSection />
        <AboutSection />
        <FeaturesSection />
        <div id="monitoring"><MonitoringSection /></div>
        <AISection />
        <EcosystemSection />
        <CapabilitiesSection />
        <DeliveredWorkSection />
        <GallerySection />
        <RolesSection />
        <HowItWorksSection />
        <PatientJourneySection />
        <SecuritySection />
        <PatientFeaturesSection />
        <DoctorFeaturesSection />
        <InitiativesSection />
        <BenefitsSection />
        <WhyUsSection />
        <ContactSection />
        <FinalCTA />
      </main>
      <LandingFooter />
      <SupportChatbot />
    </div>
  );
}