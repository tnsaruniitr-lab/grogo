import { createContext, useContext } from "react";

export interface AuthCtx {
  logout: () => void;
}

export const AuthContext = createContext<AuthCtx>({ logout: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}
