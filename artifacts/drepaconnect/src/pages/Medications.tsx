import { useListMedications, useCreateMedication, useTakeMedication, getListMedicationsQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { Pill, Plus, CheckCircle2, Clock, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Medications() {
  const [showForm, setShowForm] = useState(false);
  const { data: medications, isLoading } = useListMedications();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useCreateMedication();
  const takeMutation = useTakeMedication();

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "1 fois par jour",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { 
        data: {
          patientId: 1,
          name: formData.name,
          dosage: formData.dosage,
          frequency: formData.frequency,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
          setShowForm(false);
          setFormData({ name: "", dosage: "", frequency: "1 fois par jour" });
          toast({ title: "Médicament ajouté" });
        }
      }
    );
  };

  const handleTake = (id: number) => {
    takeMutation.mutate(
      { params: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
          toast({ title: "Prise enregistrée" });
        }
      }
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
              <Pill className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Traitements</h1>
          </div>
          <p className="text-muted-foreground">Gérez vos médicaments et suivez vos prises régulières.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {showForm ? "Annuler" : <><Plus className="h-4 w-4" /> Ajouter un médicament</>}
        </button>
      </header>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border rounded-2xl p-6 mb-8 shadow-sm"
        >
          <h3 className="text-lg font-bold font-serif mb-4">Nouveau médicament</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du médicament</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                  placeholder="Ex: Acide Folique"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dosage</label>
                <input 
                  type="text" 
                  value={formData.dosage}
                  onChange={e => setFormData({...formData, dosage: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                  placeholder="Ex: 5mg"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fréquence</label>
              <select 
                value={formData.frequency}
                onChange={e => setFormData({...formData, frequency: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
              >
                <option>1 fois par jour</option>
                <option>2 fois par jour</option>
                <option>3 fois par jour</option>
                <option>Au besoin</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : medications && medications.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {medications.map((med, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={med.id} 
              className="bg-card border rounded-xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold font-serif text-lg">{med.name}</h4>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                    {med.dosage}
                  </span>
                </div>
                <div className="space-y-1 mb-6 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Clock className="h-3 w-3" /> {med.frequency}</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> 
                    Dernière prise: {med.lastTaken ? new Date(med.lastTaken).toLocaleString() : "Jamais"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTake(med.id)}
                disabled={takeMutation.isPending}
                className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" /> Marquer comme pris
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 border border-dashed rounded-2xl">
          <Pill className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-bold font-serif">Aucun traitement</h3>
          <p className="text-muted-foreground mt-1 mb-4">Ajoutez vos médicaments pour suivre vos prises.</p>
        </div>
      )}
    </div>
  );
}
