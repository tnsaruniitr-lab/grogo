import type { Metadata } from "next";
import { LegalLayout } from "../_legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GrowthMonk collects, uses, and protects your data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How GrowthMonk collects, uses, and protects your data."
      lastUpdated="May 2026"
    >
      <p>
        GrowthMonk is operated by <strong>Dreamport Pvt Ltd</strong> ("we", "us", or "our").
        This Privacy Policy explains what data we collect, how we use it, and your rights in
        relation to that data when you use the GrowthMonk platform or interact with a
        GrowthMonk-powered AI assistant on WhatsApp, Instagram, or Facebook.
      </p>

      <h2>1. Who We Are</h2>
      <p>
        GrowthMonk is an AI growth platform for healthcare and wellness businesses, operated by
        Dreamport Pvt Ltd. The platform enables businesses (our "Clients") to capture and
        qualify leads via WhatsApp, Instagram, Facebook, and website chat, and to get
        discovered in AI search engines.
      </p>
      <p>
        For any privacy-related enquiries, contact us at:{" "}
        <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a>
      </p>

      <h2>2. Data We Collect</h2>
      <h3>From end users (patients / leads)</h3>
      <ul>
        <li>WhatsApp, Instagram, or Facebook phone number or user ID provided by Meta's API</li>
        <li>Message content sent to a GrowthMonk-powered bot (text only; no media is stored)</li>
        <li>Information voluntarily provided during a conversation: name, location, service
          interest, preferred callback time</li>
        <li>Language detected from the conversation</li>
        <li>Conversation history for the duration of the active qualification flow</li>
      </ul>
      <h3>From Clients (businesses using GrowthMonk)</h3>
      <ul>
        <li>Business name, contact email, WhatsApp Business number, and account credentials</li>
        <li>Knowledge base content (services, FAQs, pricing) provided during onboarding</li>
        <li>Connected channel tokens (WhatsApp Business API, Instagram, Facebook) required to
          operate the bot on your behalf</li>
        <li>Billing information (processed by our payment provider; not stored by us)</li>
      </ul>

      <h2>3. How We Use Data</h2>
      <ul>
        <li>To operate the AI lead capture and qualification bot on behalf of the Client</li>
        <li>To route qualified leads and conversation summaries to the Client's dashboard</li>
        <li>To detect language and personalise the conversation experience</li>
        <li>To book or schedule callbacks as instructed by the user</li>
        <li>To improve AI model quality (aggregated and anonymised, never individual
          conversation content)</li>
        <li>To send service-related communications to Clients (not to end users)</li>
      </ul>

      <h2>4. WhatsApp, Instagram, and Facebook Data</h2>
      <p>
        GrowthMonk connects to WhatsApp via the official Meta WhatsApp Business API, and to
        Instagram and Facebook via Meta's Graph API. Message data received through these
        channels is:
      </p>
      <ul>
        <li>Processed in real time to generate an AI response</li>
        <li>Stored in an encrypted database accessible only to the relevant Client</li>
        <li>Never sold, shared with third parties, or used for advertising purposes</li>
        <li>Retained only for as long as the Client's account is active, or as required by law</li>
      </ul>
      <p>
        GrowthMonk's use and transfer of data received from Meta APIs complies with Meta's
        Platform Terms and applicable data use policies.
      </p>

      <h2>5. Lead Data Handling</h2>
      <p>
        Lead records (name, phone/WhatsApp ID, service interest, conversation summary) are
        stored in GrowthMonk's database and made available exclusively to the Client whose bot
        captured them. GrowthMonk does not access, analyse, or share individual lead records
        except to provide the service to that Client.
      </p>

      <h2>6. Data Retention</h2>
      <ul>
        <li>End-user conversation data is retained while the Client account is active</li>
        <li>Upon account termination, all associated lead records, message logs, and
          channel tokens are deleted within 30 days</li>
        <li>Anonymised, aggregated analytics may be retained indefinitely</li>
      </ul>

      <h2>7. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your
        personal data, or to object to or restrict its processing. To exercise any of these
        rights, or to request deletion of your data, please email{" "}
        <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a> with your name, the
        business you interacted with, and your WhatsApp number or account identifier.
      </p>
      <p>
        See our <a href="/data-deletion">Data Deletion page</a> for full details on how to
        request deletion.
      </p>

      <h2>8. Security</h2>
      <p>
        All data is encrypted in transit (TLS) and at rest. Access to data is restricted to
        authorised personnel and the relevant Client only. We follow industry-standard security
        practices and conduct regular reviews of our data handling procedures.
      </p>

      <h2>9. GDPR and International Transfers</h2>
      <p>
        For users in the European Economic Area (EEA) or United Kingdom, GrowthMonk processes
        data in accordance with the General Data Protection Regulation (GDPR). Where data is
        transferred outside the EEA, appropriate safeguards are in place.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date at the
        top of this page will reflect any changes. Continued use of GrowthMonk after an
        update constitutes acceptance of the revised policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        For privacy-related questions or to exercise your data rights:
      </p>
      <ul>
        <li>Email: <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a></li>
        <li>Operator: Dreamport Pvt Ltd</li>
        <li>Website: <a href="https://growthmonk.ai">https://growthmonk.ai</a></li>
      </ul>
    </LegalLayout>
  );
}
