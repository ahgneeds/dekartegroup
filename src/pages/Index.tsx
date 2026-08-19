import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingStyles } from "@/components/landing/LandingStyles";
import { LandingProcess } from "@/components/landing/LandingProcess";
import { LandingDeliverable } from "@/components/landing/LandingDeliverable";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-full bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStyles />
        <LandingProcess />
        <LandingDeliverable />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
