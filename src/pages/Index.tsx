import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-full bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingHowItWorks />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
