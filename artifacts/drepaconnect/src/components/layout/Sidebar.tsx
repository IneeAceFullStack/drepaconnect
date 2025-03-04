import { Link, useLocation } from "wouter";
import { Droplet, LayoutDashboard, Calculator, Activity, Pill, MapPin, HeartPulse, BookOpen, BarChart3, Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, public: false },
    { href: "/crises", label: "Journal de crises", icon: Activity, public: false },
    { href: "/medicaments", label: "Médicaments", icon: Pill, public: false },
    { href: "/carnet", label: "Carnet de santé", icon: HeartPulse, public: false },
    { href: "/donneurs", label: "Donneurs de sang", icon: Droplet, public: false },
    { href: "/calculateur", label: "Calculateur", icon: Calculator, public: true },
    { href: "/centres", label: "Centres de soin", icon: MapPin, public: true },
    { href: "/education", label: "Éducation", icon: BookOpen, public: true },
    { href: "/statistiques", label: "Statistiques", icon: BarChart3, public: true },
  ];

  if (user?.role === "DOCTOR" || user?.role === "ADMIN") {
    navItems.splice(1, 0, { href: "/patients", label: "Patients", icon: Users, public: false });
  }

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r shadow-sm">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
       <Link href="/" className="flex items-center gap-2">
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#2D1B5E"/>
    <path d="M16 6 C16 6 9 13 9 18 C9 22 12.1 25 16 25 C19.9 25 23 22 23 18 C23 13 16 6 16 6Z" fill="url(#grad)"/>
    <polyline points="10,18 13,18 14.5,14 16,21 17.5,16 19,18 22,18" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="18" r="1.5" fill="#FF6B9D"/>
    <defs>
      <linearGradient id="grad" x1="16" y1="6" x2="16" y2="25" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7C3AED"/>
        <stop offset="100%" stopColor="#C084FC"/>
      </linearGradient>
    </defs>
  </svg>
  <span className="font-serif text-2xl font-bold">
    <span className="text-white">Drepa</span><span className="text-pink-400">Connect</span>
  </span>
	</Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.filter(item => item.public || user).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary hover:bg-primary/5",
                location === item.href || location.startsWith(`${item.href}/`)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {user && (
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <span className="text-xs text-muted-foreground mt-1">{user.role}</span>
            </div>
          </div>
          <div className="grid gap-1 mt-2">
            <Link
              href="/profil"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/5 hover:text-primary text-muted-foreground"
            >
              <User className="h-4 w-4" />
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-destructive/10 hover:text-destructive text-muted-foreground text-left"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
