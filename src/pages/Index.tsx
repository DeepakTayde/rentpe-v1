import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { RolesSection } from "@/components/sections/RolesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WalletSection } from "@/components/sections/WalletSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { AppDownloadSection } from "@/components/sections/AppDownloadSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <ServicesSection />
        <WalletSection />
        <TrustSection />
        <AppDownloadSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
