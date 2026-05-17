import { useState, useEffect, type ReactNode } from "react";
import { setBasicAuth, setBasicAuthFallback } from "@workspace/api-client-react";
import { AuthContext } from "./auth-context";

const STORAGE_KEY = "dashboard_basic_auth";

// Register a fallback getter immediately at module-load time.
// Every customFetch call can recover credentials from localStorage
// even if the module-level _basicAuthHeader was cleared (e.g. after HMR reset).
setBasicAuthFallback(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const { user, pass } = JSON.parse(stored) as { user: string; pass: string };
    if (user && pass) return `Basic ${btoa(`${user}:${pass}`)}`;
  } catch { /* ignore */ }
  return null;
});

function applyStoredCredentials(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  try {
    const { user, pass } = JSON.parse(stored) as { user: string; pass: string };
    if (user && pass) {
      setBasicAuth(user, pass);
      return true;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return false;
}

export function LoginGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => applyStoredCredentials());
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Render-time credential integrity check.
  // React Fast Refresh can preserve authed=true across hot reloads even when
  // localStorage is empty (e.g. after a code migration or HMR module reset).
  // Calling setState during render triggers an immediate re-render with the new
  // state — React's documented pattern for synchronous derived-state correction.
  if (authed && !localStorage.getItem(STORAGE_KEY)) {
    setBasicAuth(null, null);
    setAuthed(false);
  } else if (authed) {
    // Re-apply credentials to module state in case HMR reset _basicAuthHeader.
    applyStoredCredentials();
  }

  useEffect(() => {
    function handleUnauth(e: CustomEvent) {
      if (e.detail?.status === 401) {
        localStorage.removeItem(STORAGE_KEY);
        setBasicAuth(null, null);
        setAuthed(false);
        setError("Session expired — please log in again.");
      }
    }
    window.addEventListener("api:unauthorized" as any, handleUnauth as any);
    return () => window.removeEventListener("api:unauthorized" as any, handleUnauth as any);
  }, []);

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setBasicAuth(null, null);
    setAuthed(false);
    setUser("");
    setPass("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const encoded = btoa(`${user}:${pass}`);
    try {
      const res = await fetch("/api/dashboard/stats?clientId=1", {
        headers: { Authorization: `Basic ${encoded}` },
      });
      if (res.status === 401) {
        setError("Incorrect username or password.");
        setLoading(false);
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, pass }));
      setBasicAuth(user, pass);
      setAuthed(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (authed) {
    return (
      <AuthContext.Provider value={{ logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white">GrowthMonk</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
            <input
              type="text"
              autoComplete="username"
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-950/50 border border-red-800/50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-2"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
