import { useAuth } from "@/contexts/AuthContext";
import { Link, Redirect } from "wouter";
import { Heart, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

function DrepaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#2D1B5E"/>
      <path d="M16 6 C16 6 9 13 9 18 C9 22 12.1 25 16 25 C19.9 25 23 22 23 18 C23 13 16 6 16 6Z" fill="url(#grad1)"/>
      <polyline points="10,18 13,18 14.5,14 16,21 17.5,16 19,18 22,18" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="18" r="1.5" fill="#FF6B9D"/>
      <defs>
        <linearGradient id="grad1" x1="16" y1="6" x2="16" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED"/>
          <stop offset="100%" stopColor="#C084FC"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 lg:px-12 h-20 border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <DrepaLogo size={32} />
          <span className="font-serif text-2xl font-bold">
            <span className="text-primary">Drepa</span><span className="text-pink-400">Connect</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/calculateur" className="text-sm font-medium hover:text-primary hidden sm:block">Calculateur</Link>
          <Link href="/centres" className="text-sm font-medium hover:text-primary hidden sm:block">Centres</Link>
          <div className="w-px h-6 bg-border hidden sm:block"></div>
          <Link href="/login" className="text-sm font-medium hover:text-primary">Connexion</Link>
          <Link href="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Rejoindre
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative px-6 lg:px-12 py-20 lg:py-32 overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl lg:text-7xl font-serif text-primary leading-tight mb-6">
              Vivre avec la drépanocytose, ensemble.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              La première plateforme santé dédiée aux patients drépanocytaires, médecins et donneurs de sang au Congo. Précision médicale et chaleur humaine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Commencer maintenant <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/calculateur" className="w-full sm:w-auto bg-card text-foreground border shadow-sm px-8 py-4 rounded-full text-base font-medium hover:bg-muted transition-colors">
                Calculateur génétique
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="px-6 lg:px-12 py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Suivi Quotidien</h3>
              <p className="text-muted-foreground">Enregistrez vos crises, vos traitements et vos rendez-vous médicaux en un seul endroit sécurisé.</p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Réseau de Donneurs</h3>
              <p className="text-muted-foreground">Accédez rapidement à un réseau de donneurs de sang compatibles près de chez vous en cas d'urgence.</p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
              <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 text-teal-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Conseil Médical</h3>
              <p className="text-muted-foreground">Outils d'aide à la décision pour les médecins et partage sécurisé du dossier patient.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-12 px-6 lg:px-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
          <DrepaLogo size={24} />
          <span className="font-serif text-xl font-bold">
            <span className="text-primary">Drepa</span><span className="text-pink-400">Connect</span>
          </span>
        </div>
        <p>© {new Date().getFullYear()} DrépaConnect. Tous droits réservés.</p>
      </footer>
    </div>
  );
}