import { useAuth } from "@/contexts/AuthContext";
import { User as UserIcon, Mail, Shield, Calendar, LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences.</p>
      </header>

      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <span className="inline-block mt-2 bg-muted px-3 py-1 rounded-full text-sm font-medium">
                Profil {user.role}
              </span>
            </div>

            <div className="grid gap-6 py-6 border-y">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adresse email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membre depuis</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sécurité</p>
                  <p className="font-medium">Mot de passe masqué</p>
                </div>
              </div>
            </div>

            <button 
              onClick={logout}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
