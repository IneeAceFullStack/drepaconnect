import { useListCenters } from "@workspace/api-client-react";
import { useState } from "react";
import { MapPin, Phone, Clock, Search, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Centers() {
  const [city, setCity] = useState("");
  const { data: centers, isLoading } = useListCenters({ city: city || undefined });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Centres de dépistage et de soins</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Trouvez un établissement de santé adapté pour la prise en charge de la drépanocytose près de chez vous.
        </p>
      </header>

      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filtrer par ville (ex: Brazzaville, Pointe-Noire...)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl shadow-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : centers && centers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {centers.map((center, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={center.id}
            >
              <Link href={`/centres/${center.id}`}>
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col cursor-pointer group">
                  <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors">{center.name}</h3>
                      {center.active ? (
                        <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" title="Actif" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-destructive mt-1.5 shrink-0" title="Inactif" />
                      )}
                    </div>

                    <p className="text-sm font-medium text-primary mb-4">{center.city}, {center.province}</p>

                    <div className="space-y-3 mb-6 flex-1">
                      {center.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{center.address}</span>
                        </div>
                      )}
                      {center.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 shrink-0" />
                          <span>{center.phone}</span>
                        </div>
                      )}
                      {center.openingHours && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{center.openingHours}</span>
                        </div>
                      )}
                    </div>

                    {center.services && (
                      <div className="pt-4 border-t">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Services</p>
                        <div className="flex flex-wrap gap-1.5">
                          {center.services.split(',').map(service => (
                            <span key={service} className="bg-muted px-2 py-1 rounded text-xs text-foreground">
                              {service.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                      Voir les détails <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 border border-dashed rounded-2xl">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-bold font-serif text-foreground">Aucun centre trouvé</h3>
          <p className="text-muted-foreground mt-1">Modifiez vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
}