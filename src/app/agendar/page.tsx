import { Metadata } from "next";
import { BookingSection } from "@/components/booking/BookingSection";
import { CTASection } from "@/components/home/CTASection";
import { AbsenceNoticeBanner } from "@/components/layout/AbsenceNoticeBanner";

export const metadata: Metadata = {
  title: "Agendar Consulta",
  description:
    "Agendá una consulta legal gratuita con el estudio ELIGE. Primera consulta sin cargo.",
};

export default function AgendarPage() {
  return (
    <>
      <AbsenceNoticeBanner />
      <BookingSection />
      <CTASection />
    </>
  );
}
