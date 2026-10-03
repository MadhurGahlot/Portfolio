import React from "react";
import { CertificateMarquee } from "@/components/ui/certificate-marquee";
import { CERTIFICATES } from "@/data.js";

export function CertificateSection() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="relative z-10 py-2">
        <CertificateMarquee items={CERTIFICATES} />
      </div>
    </div>
  );
}

export default CertificateSection;
