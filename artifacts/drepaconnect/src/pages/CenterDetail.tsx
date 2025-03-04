import { useGetCenter } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { MapPin, Phone, Mail, Clock, ArrowLeft, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function CenterDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: center, isLoading } = useGetCenter(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!center) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Centre introuvable.</p>
        <Link href="/centres" className="text-primary hover:underline mt-4 inline-block">
          ← Retour aux centres
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link href="/centres" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour aux centres
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* En-tête */}
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="h-3 bg-gradient-to-r from-primary to-accent" />
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-serif font-bold text-foreground leading-tight">{center.name}</h1>
              <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${center.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {center.active ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {center.active ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <p className="text-primary font-medium">{center.city}, {center.province}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Coordonnées */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-bold mb-4 text-foreground">Coordonnées</h2>
            <div className="space-y-4">
              {center.address && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Adresse</p>
                    <p className="text-sm font-medium">{center.address}</p>
                  </div>
                </div>
              )}
              {center.phone && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Téléphone</p>
                    <a href={`tel:${center.phone}`} className="text-sm font-medium text-primary hover:underline">
                      {center.phone}
                    </a>
                  </div>
                </div>
              )}
              {center.email && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <a href={`mailto:${center.email}`} className="text-sm font-medium text-primary hover:underline">
                      {center.email}
                    </a>
                  </div>
                </div>
              )}
              {center.openingHours && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Horaires</p>
                    <p className="text-sm font-medium">{center.openingHours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          {center.services && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-serif font-bold mb-4 text-foreground">Services disponibles</h2>
              <div className="flex flex-wrap gap-2">
                {center.services.split(',').map(service => (
                  <span key={service} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    {service.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Localisation */}
          {center.latitude && center.longitude && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm md:col-span-2">
              <h2 className="text-lg font-serif font-bold mb-4 text-foreground">Localisation</h2>
              <a
                href={`https://www.google.com/maps?q=${center.latitude},${center.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Ouvrir dans Google Maps
              </a>
            </div>
          )}

          {/* Informations utiles */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:col-span-2">
            <h2 className="text-lg font-serif font-bold mb-3 text-foreground">ℹ️ Informations utiles</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Munissez-vous de votre carnet de santé et ordonnances lors de votre visite.</li>
              <li>• Pour les urgences drépanocytaires, signalez-le à l'accueil dès votre arrivée.</li>
              <li>• Il est recommandé de prendre rendez-vous avant de vous déplacer.</li>
              <li>• Apportez vos résultats d'analyses antérieurs si disponibles.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}