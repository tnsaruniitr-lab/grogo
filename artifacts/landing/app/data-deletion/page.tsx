import type { Metadata } from "next";
import { LegalLayout } from "../_legal/LegalLayout";

export const metadata: Metadata = {
  title: "Data Deletion",
  description: "How to request deletion of your data from GrowthMonk.",
  robots: { index: true, follow: true },
};

export default function DataDeletionPage() {
  return (
    <LegalLayout
      title="Data Deletion Instructions"
      description="How to request deletion of your personal data or business data from GrowthMonk."
      lastUpdated="May 2026"
    >
      <p>
        GrowthMonk, operated by <strong>Dreamport Technology Private Limited</strong>, is committed to honouring
        data deletion requests from both end users (customers and leads who interacted with a
        GrowthMonk-powered bot) and Clients (businesses using the GrowthMonk platform).
      </p>

      <h2>How to Request Deletion</h2>
      <p>Send an email to:</p>
      <p>
        <strong><a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a></strong>
      </p>
      <p>Use the subject line: <strong>Data Deletion Request</strong></p>

      <h2>What to Include in Your Request</h2>
      <p>To process your request efficiently, please include the following in your email:</p>
      <ul>
        <li>Your <strong>full name</strong></li>
        <li>The <strong>business name</strong> you interacted with or are registered under</li>
        <li>Your <strong>WhatsApp number</strong> or <strong>email address</strong> associated
          with the account or conversation</li>
        <li>Any <strong>connected account identifiers</strong> (e.g. Instagram handle,
          Facebook Page name) if applicable</li>
        <li>A brief description of what you would like deleted</li>
      </ul>

      <h2>What We Will Delete</h2>
      <p>
        Upon receiving and verifying a valid deletion request, GrowthMonk will delete the
        following where applicable:
      </p>
      <ul>
        <li>Stored account tokens and channel credentials (WhatsApp Business API, Instagram,
          Facebook)</li>
        <li>Lead records associated with your identity or business</li>
        <li>Conversation message logs</li>
        <li>Any connected account data linked to your request</li>
        <li>Personal profile information held in our system</li>
      </ul>
      <p>
        Note: Anonymised and aggregated analytics data that cannot be linked back to any
        individual or business is not subject to deletion requests, as it contains no
        personally identifiable information.
      </p>

      <h2>Deletion Timeline</h2>
      <p>
        We will acknowledge your request within <strong>5 business days</strong> and complete
        the deletion within <strong>7–30 days</strong> of verification, depending on the scope
        of the request and any legal obligations that may require us to retain certain records.
      </p>
      <p>
        If we are unable to fulfil part of your request (for example, due to a legal retention
        requirement), we will explain the reason in our response.
      </p>

      <h2>For Meta Platform Users</h2>
      <p>
        If you interacted with a GrowthMonk-powered assistant via WhatsApp, Instagram, or
        Facebook and would like your data removed, you can:
      </p>
      <ul>
        <li>Email us at <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a> as
          described above, <strong>or</strong></li>
        <li>Use Meta's own data deletion tools available through your Facebook or Instagram
          account settings</li>
      </ul>

      <h2>Questions</h2>
      <p>
        If you have any questions about this process or your data rights, please contact us:
      </p>
      <ul>
        <li>Email: <a href="mailto:hello@growthmonk.ai">hello@growthmonk.ai</a></li>
        <li>Operator: Dreamport Technology Private Limited</li>
        <li>CIN: U78100RJ2025PTC104714</li>
        <li>Registered Address: 72 Mangal Vihar (MCL), Scheme No. 5, Bhoggore, Alwar,
          Rajasthan – 301001, India</li>
        <li>
          See also: <a href="/privacy-policy">Privacy Policy</a>
        </li>
      </ul>
    </LegalLayout>
  );
}
