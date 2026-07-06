import type { Metadata } from "next";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Ownership services — VELOCE Motors",
  description:
    "Financing, global sourcing, trade-in & consignment and lifetime aftercare — everything after the handshake, taken care of.",
};

export default function ServicesPage() {
  return <Services standalone />;
}
