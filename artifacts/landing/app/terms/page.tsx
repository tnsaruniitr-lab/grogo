import type { Metadata } from "next";
import { LegalLayout } from "../_legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing your use of the GrowthMonk platform.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="Terms governing your use of the GrowthMonk platform."
      lastUpdated="May 2026"
    >
      <p>
        These Terms of Service ("Terms") govern your access to and use of GrowthMonk, operated
        by <strong>Dreamport Technology Private Limited</strong> ("GrowthMonk", "we", "us", or "our"). By
        accessing or using the GrowthMonk platform, you agree to be bound by these Terms.
      </p>

      <h2>1. About GrowthMonk</h2>
      <p>
        GrowthMonk provides the following services to healthcare and wellness businesses:
      </p>
      <ul>
        <li>AI search visibility and Answer Engine Optimization (AEO)</li>
        <li>Lead capture from WhatsApp, Instagram, Facebook, and website chat</li>
        <li>AI-powered lead qualification and conversation automation</li>
        <li>CRM-style lead management dashboard</li>
        <li>Appointment booking and callback scheduling automation</li>
        <li>Support automation and bot configuration tools</li>
      </ul>
      <p>
        GrowthMonk is a software platform. We do not provide medical, legal, financial, or
        professional advice of any kind.
      </p>

      <h2>2. Eligibility and Account</h2>
      <p>
        You must be at least 18 years old and have the legal authority to bind your business
        to these Terms. You are responsible for maintaining the security of your account
        credentials and for all activity that occurs under your account.
      </p>

      <h2>3. Messaging and User Consent</h2>
      <p>
        <strong>Clients are solely responsible</strong> for ensuring they have obtained all
        necessary permissions, consents, and opt-ins from their end users (customers and leads)
        before initiating or enabling automated messaging via WhatsApp, Instagram,
        or any other channel connected to GrowthMonk.
      </p>
      <p>
        <strong>No outbound messaging without consent.</strong> Clients must not use GrowthMonk
        to send proactive or outbound messages to any end user who has not explicitly opted in
        to receive automated messages from that business. GrowthMonk's bot responds to
        inbound messages initiated by the end user. Any outbound or proactive messaging
        feature must only be used with documented opt-in consent.
      </p>
      <p>
        GrowthMonk does not independently verify that Clients have obtained the required
        consents. Any failure to obtain proper consent is the Client's sole responsibility,
        and GrowthMonk accepts no liability for non-compliant messaging.
      </p>

      <h2>4. Ownership of Data</h2>
      <p>
        GrowthMonk does not own Client customer data. Lead records, conversation histories,
        and related data captured through the platform remain the property of the Client.
        GrowthMonk acts as a data processor on behalf of the Client and processes this data
        solely to provide the contracted service.
      </p>
      <p>
        Clients grant GrowthMonk a limited, non-exclusive licence to process this data for
        the purpose of delivering the platform's features. This licence terminates when the
        Client account is closed.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to use GrowthMonk to:</p>
      <ul>
        <li>Send spam, unsolicited messages, or messages to users who have not consented</li>
        <li>Violate{" "}
          <a href="https://www.whatsapp.com/legal/business-policy" target="_blank" rel="noopener noreferrer">
            Meta's WhatsApp Business Policy
          </a>, Instagram Platform Policy, or Facebook Platform Terms</li>
        <li>Violate any applicable data protection, privacy, or consumer protection law,
          including GDPR, India's DPDP Act, or UAE data laws</li>
        <li>Provide clinical mental health assessments, crisis intervention, medical diagnosis,
          reproductive health advice, prescription recommendations, or any content that
          constitutes regulated clinical or medical advice — GrowthMonk is a booking and
          communication tool only</li>
        <li>Impersonate any person or entity or misrepresent your affiliation</li>
        <li>Transmit malware, viruses, or any harmful code</li>
        <li>Attempt to reverse-engineer, copy, or circumvent the GrowthMonk platform</li>
        <li>Use the platform for any unlawful purpose</li>
      </ul>

      <h2>6. Platform Availability</h2>
      <p>
        GrowthMonk aims to maintain high platform availability but does not guarantee
        uninterrupted service. Scheduled maintenance, third-party API outages (including Meta
        platforms), and unforeseen technical issues may affect availability. We will
        communicate planned maintenance in advance where possible.
      </p>

      <h2>7. Payments and Cancellation</h2>
      <p>
        Subscription fees are billed as agreed at signup. You may cancel your subscription at
        any time. Cancellation takes effect at the end of the current billing period.
        GrowthMonk does not offer refunds for partial billing periods except where required
        by applicable law.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        GrowthMonk and all associated software, branding, and content are the intellectual
        property of Dreamport Technology Private Limited. You may not copy, modify, distribute, or create
        derivative works from any part of the GrowthMonk platform without express written
        permission.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, GrowthMonk and Dreamport Technology Private Limited
        shall not be liable for any indirect, incidental, special, consequential, or punitive
        damages arising from your use of the platform, including but not limited to loss of
        leads, revenue, or data.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the
        exclusive jurisdiction of the courts of India, without prejudice to any mandatory
        consumer protection rights in your jurisdiction.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of GrowthMonk after an
        update constitutes acceptance of the revised Terms. We will notify Clients of material
        changes by email.
      </p>

      <h2>12. Contact</h2>
      <ul>
        <li>Email: <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a></li>
        <li>Operator: Dreamport Technology Private Limited</li>
        <li>CIN: U78100RJ2025PTC104714</li>
        <li>Registered Address: 72 Mangal Vihar (MCL), Scheme No. 5, Bhoggore, Alwar,
          Rajasthan – 301001, India</li>
        <li>Website: <a href="https://growthmonk.ai">https://growthmonk.ai</a></li>
      </ul>
    </LegalLayout>
  );
}
