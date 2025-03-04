import { useState } from "react";
import { useListMedicalRecords, useCreateMedicalRecord, MedicalRecordInputType, getListMedicalRecordsQueryKey } from "@workspace/api-client-react";
import { HeartPulse, Plus, FileText, Syringe, Stethoscope, TestTube, Activity, Loader2, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function MedicalRecord() {
  const [showForm, setShowForm] = useState(false);
  const { data: records, isLoading } = useListMedicalRecords();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useCreateMedicalRecord();

  const [formData, setFormData] = useState({
    title: "",
    type: "CONSULTATION" as MedicalRecordInputType,
    date: new Date().toISOString().split('T')[0],
    doctorName: "",
    facility: "",
    description: "",
    results: "",
    hemoglobinLevel: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { 
        data: {
          patientId: 1, // Fallback
          ...formData,
          hemoglobinLevel: formData.hemoglobinLevel ? Number(formData.hemoglobinLevel) : undefined
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMedicalRecordsQueryKey() });
          setShowForm(false);
          toast({ title: "Document ajouté au carnet" });
        }
      }
    );
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "CONSULTATION": return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case "LAB_RESULT": return <TestTube className="h-5 w-5 text-purple-500" />;
      case "TRANSFUSION": return <Syringe className="h-5 w-5 text-destructive" />;
      case "VACCINATION": return <Activity className="h-5 w-5 text-green-500" />;
      case "HOSPITALIZATION": return <Building2 className="h-5 w-5 text-amber-500" />;
      default: return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <HeartPulse className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Carnet de santé</h1>
          </div>
          <p className="text-muted-foreground">L'historique complet de votre suivi médical.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {showForm ? "Annuler" : <><Plus className="h-4 w-4" /> Ajouter un document</>}
        </button>
      </header>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-bold font-serif mb-4">Nouveau document</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de document</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as MedicalRecordInputType})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                >
                  <option value="CONSULTATION">Consultation médicale</option>
                  <option value="LAB_RESULT">Résultat de laboratoire</option>
                  <option value="TRANSFUSION">Transfusion sanguine</option>
                  <option value="VACCINATION">Vaccination</option>
                  <option value="HOSPITALIZATION">Hospitalisation</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Titre / Motif</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
                placeholder="Ex: Bilan trimestriel"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Médecin</label>
                <input 
                  type="text" 
                  value={formData.doctorName}
                  onChange={e => setFormData({...formData, doctorName: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Établissement</label>
                <input 
                  type="text" 
                  value={formData.facility}
                  onChange={e => setFormData({...formData, facility: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description / Conclusion</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
                rows={2}
              />
            </div>

            {formData.type === "LAB_RESULT" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Taux d'hémoglobine (g/dL)</label>
                <input 
                  type="number" step="0.1"
                  value={formData.hemoglobinLevel}
                  onChange={e => setFormData({...formData, hemoglobinLevel: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                />
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : records && records.length > 0 ? (
        <div className="relative border-l-2 border-muted ml-4 md:ml-6 space-y-8 pb-8">
          {records.map(record => (
            <div key={record.id} className="relative pl-8">
              <div className="absolute -left-3.5 top-0 h-7 w-7 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <div className="bg-card border rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted/50 flex items-center justify-center">
                      {getRecordIcon(record.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight">{record.title}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString()} {record.doctorName && `• Dr. ${record.doctorName}`}</p>
                    </div>
                  </div>
                </div>
                {record.description && <p className="text-muted-foreground mt-3">{record.description}</p>}
                {record.hemoglobinLevel && (
                  <div className="mt-3 inline-block px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-md text-sm font-medium">
                    Hémoglobine : {record.hemoglobinLevel} g/dL
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 border border-dashed rounded-2xl">
          <HeartPulse className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-bold font-serif text-foreground">Carnet de santé vide</h3>
          <p className="text-muted-foreground mt-1">Ajoutez vos consultations et résultats d'examens.</p>
        </div>
      )}
    </div>
  );
}
