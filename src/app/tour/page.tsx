import type { Metadata } from "next";
import { ApartmentTourClient } from "@/components/ApartmentTourClient";

export const metadata: Metadata = {
  title: "3D Turnkey Material & Spatial Walkthrough — Green Homes",
  description:
    "Walk through a sample Green Homes turnkey residence in real time. Inspect structural openings, flooring, upholstery finishes, and interior lighting.",
};

export default function TourPage() {
  return (
    <div id="top" className="min-h-screen w-full overflow-hidden">
      <ApartmentTourClient />
    </div>
  );
}
