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
        GrowthMonk is operated by <strong>Dreamport Technology Private Limited</strong> ("we", "us", or "our").
        This Privacy Policy explains what data we collect, how we use it, and your rights in
        relation to that data when you use the GrowthMonk platform or interact with a
        GrowthMonk-powered AI assistant on WhatsApp, Instagram, or Facebook.
      </p>

      <h2>1. Who We Are</h2>
      <p>
        GrowthMonk is an AI growth platform for healthcare and wellness businesses, operated by
        Dreamport Technology Private Limited. The platform enables businesses (our "Clients") to capture and
        qualify leads via WhatsApp, Instagram, Facebook, and website chat, and to get
        discovered in AI search engines.
      </p>
      <p>
        <strong>About our WhatsApp number:</strong> Dreamport Technology Private Limited operates a WhatsApp
        Business account used to respond to inbound enquiries from businesses and individuals
        interested in the GrowthMonk platform — including answering product questions,
        qualifying prospective clients, and booking product demonstration calls. This Privacy
        Policy governs all data collected through that account and through any GrowthMonk
        Client deployment.
      </p>
      <p>
        For any privacy-related enquiries, contact us at:{" "}
        <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a>
      </p>

      <h2>2. Data We Collect</h2>
      <h3>From end users (customers / leads)</h3>
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
        <li>Never sold or used for advertising purposes</li>
        <li>Retained only for as long as the Client's account is active, or as required by law, and deleted within 90 days of account closure</li>
      </ul>
      <p>
        GrowthMonk's use and transfer of data received from Meta APIs complies with Meta's
        Platform Terms and applicable data use policies.
      </p>

      <h2>5. Sub-Processors</h2>
      <p>
        To deliver the GrowthMonk service, message content is transmitted to the following
        third-party sub-processors. Each sub-processor is bound by contractual data protection
        obligations and may only process data for the purposes listed below:
      </p>
      <ul>
        <li>
          <strong>Twilio Inc.</strong> (San Francisco, CA, USA) — GrowthMonk uses Twilio as
          its WhatsApp Business API carrier. Inbound and outbound WhatsApp messages are routed
          through Twilio's infrastructure. Twilio processes phone numbers and message content
          solely to deliver messages between end users and the GrowthMonk platform. For details,
          see{" "}
          <a href="https://www.twilio.com/en-us/legal/privacy" target="_blank" rel="noopener noreferrer">
            Twilio Privacy Policy
          </a>.
        </li>
        <li>
          <strong>OpenAI, L.L.C.</strong> (San Francisco, CA, USA) — message text is sent to
          OpenAI's API (GPT-4o-mini model) solely to generate a conversational response. OpenAI
          does not retain this data for model training under its API data usage policy. For
          details, see{" "}
          <a href="https://openai.com/policies/api-data-usage-policies" target="_blank" rel="noopener noreferrer">
            OpenAI API Data Usage Policies
          </a>.
        </li>
      </ul>
      <p>
        Message content is never sold, shared for advertising, or used for any purpose other
        than delivering and generating a response to the user.
      </p>

      <h2>6. Lead Data Handling</h2>
      <p>
        Lead records (name, phone/WhatsApp ID, service interest, conversation summary) are
        stored in GrowthMonk's database and made available exclusively to the Client whose bot
        captured them. GrowthMonk does not access, analyse, or share individual lead records
        except to provide the service to that Client.
      </p>

      <h2>7. Opt-Out and Stopping Messages</h2>
      <p>
        If you are an end user who has received a message from a GrowthMonk-powered WhatsApp
        bot and no longer wish to receive messages, you can stop them at any time by:
      </p>
      <ul>
        <li>Replying <strong>STOP</strong> to the WhatsApp conversation — the bot will
          immediately cease sending further messages to your number</li>
        <li>Blocking the WhatsApp number using WhatsApp's built-in block feature</li>
        <li>Emailing <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a> with your
          WhatsApp number and the name of the business whose bot contacted you — we will
          suppress your number from that account within 2 business days</li>
      </ul>
      <p>
        Opting out does not affect any service relationship you may have with the business
        (our Client) that deployed the bot.
      </p>

      <h2>8. Data Retention</h2>
      <ul>
        <li>WhatsApp, Instagram, and Facebook conversation data is retained while the Client
          account is active and deleted within <strong>90 days</strong> of account closure</li>
        <li>Lead records (name, contact, service interest) are retained while the Client
          account is active and deleted within <strong>30 days</strong> of account closure</li>
        <li>Anonymised, aggregated analytics that cannot identify any individual may be
          retained indefinitely</li>
      </ul>

      <h2>9. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your
        personal data, or to object to or restrict its processing. To exercise any of these
        rights, please email{" "}
        <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a> with your name, the
        business you interacted with, and your WhatsApp number or account identifier.
      </p>
      <p>
        See our <a href="/data-deletion">Data Deletion page</a> for full details.
      </p>

      <h2>10. Security</h2>
      <p>
        All data is encrypted in transit (TLS) and at rest. Access is restricted to
        authorised personnel and the relevant Client only. We follow industry-standard
        security practices and conduct regular reviews of our data handling procedures.
      </p>

      <h2>11. Applicable Law</h2>
      <p>
        GrowthMonk is operated by Dreamport Technology Private Limited, an Indian company. This Privacy Policy
        is governed by the laws of India, including India's{" "}
        <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. For users
        in the European Economic Area (EEA) or United Kingdom, GrowthMonk processes data in
        accordance with the <strong>General Data Protection Regulation (GDPR)</strong>. Where
        data is transferred outside the EEA, appropriate safeguards are in place.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date at the
        top of this page will reflect any changes. Continued use of GrowthMonk after an
        update constitutes acceptance of the revised policy.
      </p>

      <h2>13. Contact</h2>
      <p>
        For privacy-related questions or to exercise your data rights:
      </p>
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
