import { useListCrises, useCreateCrisis, getListCrisesQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { Activity, Plus, AlertCircle, Calendar, MapPin, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Crises() {
  const [showForm, setShowForm] = useState(false);
  const { data: crises, isLoading } = useListCrises();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createMutation = useCreateCrisis();

  const [formData, setFormData] = useState({
    intensity: 5,
    location: "",
    symptoms: "",
    treatment: "",
    hospitalVisit: false,
    startedAt: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { 
        data: {
          patientId: 1, // Fallback, normally from auth context or implicit
          intensity: Number(formData.intensity),
          location: formData.location,
          symptoms: formData.symptoms,
          treatment: formData.treatment,
          hospitalVisit: formData.hospitalVisit,
          startedAt: new Date(formData.startedAt).toISOString(),
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCrisesQueryKey() });
          setShowForm(false);
          toast({ title: "Crise enregistrée", description: "L'épisode a été ajouté à votre journal." });
        }
      }
    );
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 7) return "bg-destructive/10 text-destructive border-destructive/20";
    if (intensity >= 4) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-green-500/10 text-green-600 border-green-500/20";
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Journal des crises</h1>
          </div>
          <p className="text-muted-foreground">Suivez vos épisodes douloureux pour mieux les comprendre.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/crises/stats" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Voir les statistiques
          </Link>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {showForm ? "Annuler" : <><Plus className="h-4 w-4" /> Nouvelle crise</>}
          </button>
        </div>
      </header>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border rounded-2xl p-6 mb-8 shadow-sm overflow-hidden"
        >
          <h3 className="text-lg font-bold font-serif mb-4">Enregistrer un épisode</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <input 
                  type="date" 
                  value={formData.startedAt}
                  onChange={e => setFormData({...formData, startedAt: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Intensité de la douleur (1-10)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="1" max="10" 
                    value={formData.intensity}
                    onChange={e => setFormData({...formData, intensity: Number(e.target.value)})}
                    className="w-full"
                  />
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border ${getIntensityColor(formData.intensity)}`}>
                    {formData.intensity}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Symptômes ressentis</label>
              <textarea 
                value={formData.symptoms}
                onChange={e => setFormData({...formData, symptoms: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
                placeholder="Ex: Douleur au dos, fièvre..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Localisation de la douleur</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
                placeholder="Ex: Jambes, articulations..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Traitements pris</label>
              <input 
                type="text" 
                value={formData.treatment}
                onChange={e => setFormData({...formData, treatment: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
                placeholder="Ex: Paracétamol, Hydratation..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="hospital"
                checked={formData.hospitalVisit}
                onChange={e => setFormData({...formData, hospitalVisit: e.target.checked})}
                className="w-4 h-4 text-primary rounded"
              />
              <label htmlFor="hospital" className="text-sm font-medium">Cet épisode a nécessité un passage aux urgences</label>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : crises && crises.length > 0 ? (
        <div className="space-y-4">
          {crises.map((crisis, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={crisis.id} 
              className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold border ${getIntensityColor(crisis.intensity)}`}>
                    {crisis.intensity}
                  </div>
                  <div>
                    <h4 className="font-bold font-serif text-lg">{crisis.location || "Localisation non précisée"}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(crisis.startedAt).toLocaleDateString()}</span>
                      {crisis.hospitalVisit && <span className="flex items-center gap-1 text-destructive font-medium"><AlertCircle className="h-3 w-3" /> Urgences</span>}
                    </div>
                  </div>
                </div>
              </div>
              
              {(crisis.symptoms || crisis.treatment) && (
                <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4 text-sm">
                  {crisis.symptoms && (
                    <div>
                      <span className="font-medium text-foreground block mb-1">Symptômes</span>
                      <span className="text-muted-foreground">{crisis.symptoms}</span>
                    </div>
                  )}
                  {crisis.treatment && (
                    <div>
                      <span className="font-medium text-foreground block mb-1">Traitement</span>
                      <span className="text-muted-foreground">{crisis.treatment}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 border border-dashed rounded-2xl">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-bold font-serif text-foreground">Aucune crise enregistrée</h3>
          <p className="text-muted-foreground mt-1 mb-4">Votre journal est vide.</p>
          <button onClick={() => setShowForm(true)} className="text-primary font-medium hover:underline">
            Enregistrer votre premier épisode
          </button>
        </div>
      )}
    </div>
  );
}
