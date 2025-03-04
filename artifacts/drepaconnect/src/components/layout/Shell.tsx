import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";

export function Shell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();

  // Hide sidebar on public landing page
  const isLandingPage = location === "/" && !user;

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
