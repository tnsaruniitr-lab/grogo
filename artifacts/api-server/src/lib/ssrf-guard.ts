/**
 * SSRF guard — rejects URLs that target private/loopback/link-local network ranges.
 * Used by any route that fetches an arbitrary caller-supplied URL.
 */
const PRIVATE_IP_RE = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^100\.64\./,
  /^0\./,
  /^::1$/,
  /^::ffff:127\./,
  /^fc[0-9a-f]{2}:/i,
  /^fd[0-9a-f]{2}:/i,
];

const PRIVATE_HOSTS = new Set([
  "localhost",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

/**
 * Returns `true` when the URL's hostname resolves to a private or reserved
 * address — i.e. should be blocked.
 *
 * This is a hostname-level check only (no DNS resolution). It blocks the most
 * common SSRF vectors; pair it with admin-auth on the calling routes for
 * defence-in-depth.
 */
export function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (PRIVATE_HOSTS.has(h)) return true;
  return PRIVATE_IP_RE.some((re) => re.test(h));
}
