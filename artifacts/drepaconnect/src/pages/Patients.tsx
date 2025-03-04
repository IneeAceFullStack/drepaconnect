import { useState } from "react";
import { useListPatients } from "@workspace/api-client-react";
import { Users, Search, ChevronRight, Loader2, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Patients() {
  const [search, setSearch] = useState("");
  const { data: patients, isLoading } = useListPatients({ search: search || undefined });

  const getSickleTypeColor = (type: string) => {
    switch(type) {
      case "SS": return "bg-destructive/10 text-destructive";
      case "SC": return "bg-orange-500/10 text-orange-600";
      case "AS": return "bg-amber-500/10 text-amber-600";
      case "AA": return "bg-green-500/10 text-green-600";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Mes Patients</h1>
        </div>
        <p className="text-muted-foreground">Gérez votre file active et consultez les dossiers médicaux.</p>
      </header>

      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher par nom..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl shadow-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : patients && patients.length > 0 ? (
          <div className="divide-y">
            {patients.map(patient => (
              <Link key={patient.id} href={`/patients/${patient.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg text-muted-foreground">
                    {(patient.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{patient.name || "Patient Anonyme"}</h4>
                    <div className="flex items-center gap-3 text-sm mt-1">
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${getSickleTypeColor(patient.sickleType)}`}>
                        {patient.sickleType}
                      </span>
                      {patient.dateOfBirth && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} ans
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Aucun patient trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
