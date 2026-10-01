import React from "react";
import { CertificateMarquee } from "@/components/ui/certificate-marquee";
import { CERTIFICATES } from "@/data.js";

export function CertificateSection() {
  return <CertificateMarquee items={CERTIFICATES} />;
}

export default CertificateSection;
