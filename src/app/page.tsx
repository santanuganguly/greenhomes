import React from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/HeroSection";

const AboutSection = dynamic(() =>
  import("@/components/AboutSection").then((m) => m.AboutSection)
);
const VillaBlueprintExplorer = dynamic(() =>
  import("@/components/VillaBlueprintExplorer").then((m) => m.VillaBlueprintExplorer)
);
const ResidenceSlidesSection = dynamic(() =>
  import("@/components/ResidenceSlidesSection").then((m) => m.ResidenceSlidesSection)
);
const WhyGreenHomesSection = dynamic(() =>
  import("@/components/WhyGreenHomesSection").then((m) => m.WhyGreenHomesSection)
);
const Residence02Sections = dynamic(() =>
  import("@/components/Residence02Sections").then((m) => m.Residence02Sections)
);
const ProcessSection = dynamic(() =>
  import("@/components/ProcessSection").then((m) => m.ProcessSection)
);
const EstimatorSection = dynamic(() =>
  import("@/components/EstimatorSection").then((m) => m.EstimatorSection)
);
const FaqSection = dynamic(() =>
  import("@/components/FaqSection").then((m) => m.FaqSection)
);
const ConsultationSection = dynamic(() =>
  import("@/components/ConsultationSection").then((m) => m.ConsultationSection)
);
const FooterSection = dynamic(() =>
  import("@/components/FooterSection").then((m) => m.FooterSection)
);

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
