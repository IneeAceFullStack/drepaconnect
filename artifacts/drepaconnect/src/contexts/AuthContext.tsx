import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("drepa_token") : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("drepa_token", token);
    } else {
      localStorage.removeItem("drepa_token");
      setUser(null);
    }
  }, [token]);

  // Optionally, you'd fetch the user on mount if you have a token but no user,
  // but we can let the components handle that using useGetMe() if needed,
  // or just rely on local state if we don't persist user to localStorage.
  // For simplicity, we just keep token in localStorage and rely on `useGetMe` in the app.

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
