import type { Metadata } from "next";
import { LegalLayout } from "../_legal/LegalLayout";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the GrowthMonk team.",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <LegalLayout
      title="Contact Us"
      description="Get in touch with the GrowthMonk team — we're here to help."
    >
      <p>
        GrowthMonk is operated by <strong>Dreamport Technology Private Limited</strong>. Whether you have a
        question about the platform, a support issue, a partnership enquiry, or a privacy
        or data request, reach us at the contacts below.
      </p>

      <h2>General Enquiries &amp; Support</h2>
      <ul>
        <li><strong>Email:</strong>{" "}
          <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a>
        </li>
        <li><strong>WhatsApp / Phone:</strong>{" "}
          <a href="https://wa.me/15558085030">+1 555 808 5030</a>
        </li>
        <li><strong>Website:</strong>{" "}
          <a href="https://growthmonk.ai">https://growthmonk.ai</a>
        </li>
      </ul>

      <h2>Book a Demo</h2>
      <p>
        Interested in seeing GrowthMonk in action? Book a free 30-minute demo — no credit
        card required, no obligation.
      </p>
      <ul>
        <li>
          Email <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a> with your
          preferred time and we will send you a booking link.
        </li>
      </ul>

      <h2>Legal Operator</h2>
      <ul>
        <li><strong>Business Name:</strong> Dreamport Technology Private Limited</li>
        <li><strong>Brand:</strong> GrowthMonk</li>
        <li><strong>CIN:</strong> U78100RJ2025PTC104714</li>
        <li><strong>Registered Address:</strong> 72 Mangal Vihar (MCL), Scheme No. 5,
          Bhoggore, Alwar, Rajasthan – 301001, India</li>
        <li><strong>Website:</strong>{" "}
          <a href="https://growthmonk.ai">https://growthmonk.ai</a>
        </li>
        <li><strong>Support Email:</strong>{" "}
          <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a>
        </li>
      </ul>

      <h2>Data &amp; Privacy Requests</h2>
      <p>
        For data access, correction, or deletion requests, please see our{" "}
        <a href="/data-deletion">Data Deletion page</a> or email{" "}
        <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a> with the subject line{" "}
        <strong>Data Request</strong>.
      </p>

      <h2>Response Times</h2>
      <p>
        We aim to respond to all enquiries within <strong>1–2 business days</strong>. For
        urgent support issues, please include <strong>URGENT</strong> in your email subject
        line.
      </p>
    </LegalLayout>
  );
}
