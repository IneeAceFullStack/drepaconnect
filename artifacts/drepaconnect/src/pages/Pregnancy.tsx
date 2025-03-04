import { useState } from "react";
import { useListPregnancies, useCreatePregnancy, getListPregnanciesQueryKey } from "@workspace/api-client-react";
import { Baby, Plus, Calendar, AlertCircle, Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Pregnancy() {
  const [showForm, setShowForm] = useState(false);
  const { data: pregnancies, isLoading } = useListPregnancies();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useCreatePregnancy();

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    expectedDate: "",
    partnerSickleType: "AA",
    doctorName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { 
        data: {
          patientId: 1,
          ...formData,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPregnanciesQueryKey() });
          setShowForm(false);
          toast({ title: "Grossesse enregistrée" });
        }
      }
    );
  };

  const activePregnancy = pregnancies?.find(p => p.active);
  const pastPregnancies = pregnancies?.filter(p => !p.active);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Baby className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Suivi de grossesse</h1>
          </div>
          <p className="text-muted-foreground">Un suivi particulier pour une période qui compte double.</p>
        </div>
        {!activePregnancy && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            {showForm ? "Annuler" : <><Plus className="h-4 w-4" /> Déclarer une grossesse</>}
          </button>
        )}
      </header>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-bold font-serif mb-4">Déclarer une grossesse</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début estimée</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date du terme prévue</label>
                <input 
                  type="date" 
                  value={formData.expectedDate}
                  onChange={e => setFormData({...formData, expectedDate: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Génotype du partenaire</label>
                <select 
                  value={formData.partnerSickleType}
                  onChange={e => setFormData({...formData, partnerSickleType: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                >
                  <option value="AA">AA (Normal)</option>
                  <option value="AS">AS (Porteur sain)</option>
                  <option value="SS">SS (Drépanocytose)</option>
                  <option value="AC">AC (Porteur C)</option>
                  <option value="SC">SC (Drépanocytose)</option>
                  <option value="UNKNOWN">Inconnu / Non testé</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Médecin suivi</label>
                <input 
                  type="text" 
                  value={formData.doctorName}
                  onChange={e => setFormData({...formData, doctorName: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={createMutation.isPending} className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-medium hover:bg-accent/90 flex items-center gap-2">
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : activePregnancy ? (
        <div className="bg-card border-2 border-accent/20 shadow-sm rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10" />
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground">Grossesse en cours</h2>
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Actif
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground mb-1">Semaine actuelle</p>
              <p className="text-3xl font-black text-primary">{activePregnancy.currentWeek || "?"}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground mb-1">Date prévue</p>
              <p className="text-xl font-bold text-foreground">{activePregnancy.expectedDate ? new Date(activePregnancy.expectedDate).toLocaleDateString() : "-"}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground mb-1">Niveau de risque</p>
              <p className="text-xl font-bold text-orange-600">{activePregnancy.riskLevel || "À évaluer"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-foreground leading-relaxed">
              La drépanocytose augmente les besoins en suivi pendant la grossesse. Assurez-vous d'avoir des consultations très régulières avec votre hématologue et votre obstétricien. Gardez votre carnet de santé à jour.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-muted/20 border border-dashed rounded-2xl p-8 text-center text-muted-foreground mb-8">
          <Baby className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Aucune grossesse en cours enregistrée.</p>
        </div>
      )}

      {pastPregnancies && pastPregnancies.length > 0 && (
        <div>
          <h3 className="text-lg font-bold font-serif mb-4">Historique</h3>
          <div className="space-y-4">
            {pastPregnancies.map(p => (
              <div key={p.id} className="bg-card border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Grossesse de {new Date(p.startDate).getFullYear()}</span>
                </div>
                <span className="text-sm text-muted-foreground">Terminée</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
