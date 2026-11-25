import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { VillaBlueprintExplorer } from "@/components/VillaBlueprintExplorer";
import { ResidenceSlidesSection } from "@/components/ResidenceSlidesSection";
import { WhyGreenHomesSection } from "@/components/WhyGreenHomesSection";
import { Residence02Sections } from "@/components/Residence02Sections";
import { ProcessSection } from "@/components/ProcessSection";
import { EstimatorSection } from "@/components/EstimatorSection";
import { FaqSection } from "@/components/FaqSection";
import { ConsultationSection } from "@/components/ConsultationSection";
import { FooterSection } from "@/components/FooterSection";

export default function HomePage() {
  return (
    <main id="top" className="overflow-x-clip">
      <HeroSection />
      <AboutSection />
      <VillaBlueprintExplorer />
      <ResidenceSlidesSection />
      <WhyGreenHomesSection />
      <Residence02Sections />
      <ProcessSection />
      <EstimatorSection />
      <FaqSection />
      <ConsultationSection />
      <FooterSection />
    </main>
  );
}
