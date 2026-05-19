export * from "./generated/api";
export * from "./generated/api.schemas";
export {
  setBaseUrl,
  setAuthTokenGetter,
  setBasicAuth,
  getBasicAuthHeader,
  setBasicAuthFallback,
  setDemoToken,
  getDemoToken,
} from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";
