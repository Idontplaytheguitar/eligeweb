import { Hero } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { OurSpace } from "@/components/home/OurSpace";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTASection } from "@/components/home/CTASection";
import { getSiteContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getSiteContent();
  return (
    <>
      <Hero videoEnabled={content.heroVideoEnabled} />
      <ServicesGrid />
      <WhyChooseUs />
      <ProcessSteps />
      <OurSpace />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
