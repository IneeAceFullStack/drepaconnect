import { useState } from "react";
import { useListDonors, useListBloodRequests, useCreateBloodRequest, BloodRequestInputBloodType, getListBloodRequestsQueryKey } from "@workspace/api-client-react";
import { Droplets, AlertCircle, Plus, Phone, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Donors() {
  const [showForm, setShowForm] = useState(false);
  const { data: donors, isLoading: donorsLoading } = useListDonors();
  const { data: requests, isLoading: requestsLoading } = useListBloodRequests();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useCreateBloodRequest();

  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "A_POS" as BloodRequestInputBloodType,
    city: "",
    hospital: "",
    urgent: false,
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBloodRequestsQueryKey() });
          setShowForm(false);
          toast({ title: "Demande publiée", description: "Votre demande de sang a été diffusée." });
        }
      }
    );
  };

  const formatBloodType = (type: string) => type.replace('_POS', '+').replace('_NEG', '-');

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <Droplets className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Réseau de donneurs</h1>
          </div>
          <p className="text-muted-foreground">Trouvez des donneurs compatibles ou lancez un appel aux dons.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/donneurs/register" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Devenir donneur
          </Link>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
          >
            {showForm ? "Annuler" : <><Plus className="h-4 w-4" /> Demander du sang</>}
          </button>
        </div>
      </header>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold font-serif mb-4 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" /> Nouvelle demande de sang
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du patient</label>
                <input 
                  type="text" 
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Groupe sanguin recherché</label>
                <select 
                  value={formData.bloodType}
                  onChange={e => setFormData({...formData, bloodType: e.target.value as BloodRequestInputBloodType})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                >
                  <option value="A_POS">A+</option>
                  <option value="A_NEG">A-</option>
                  <option value="B_POS">B+</option>
                  <option value="B_NEG">B-</option>
                  <option value="AB_POS">AB+</option>
                  <option value="AB_NEG">AB-</option>
                  <option value="O_POS">O+</option>
                  <option value="O_NEG">O-</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hôpital (optionnel)</label>
                <input 
                  type="text" 
                  value={formData.hospital}
                  onChange={e => setFormData({...formData, hospital: e.target.value})}
                  className="w-full p-2.5 border rounded-lg bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message ou précisions</label>
              <textarea 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="urgent"
                checked={formData.urgent}
                onChange={e => setFormData({...formData, urgent: e.target.checked})}
                className="w-4 h-4 text-destructive rounded"
              />
              <label htmlFor="urgent" className="text-sm font-medium text-destructive">Il s'agit d'une urgence vitale</label>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publier l'appel"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-accent" /> Demandes en cours
          </h2>
          {requestsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className={`bg-card border rounded-xl p-5 shadow-sm ${req.urgent ? 'border-destructive/50 shadow-destructive/10' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-destructive/10 text-destructive font-bold flex items-center justify-center text-lg">
                        {formatBloodType(req.bloodType)}
                      </div>
                      <div>
                        <h4 className="font-bold">{req.patientName}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {req.city} {req.hospital ? `- ${req.hospital}` : ''}</p>
                      </div>
                    </div>
                    {req.urgent && <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">URGENT</span>}
                  </div>
                  {req.message && <p className="text-sm text-muted-foreground mb-4">{req.message}</p>}
                  <button className="w-full py-2 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium transition-colors">
                    Je peux donner
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/20 border border-dashed rounded-xl p-8 text-center text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30 text-green-500" />
              <p>Aucune demande de sang en attente.</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" /> Donneurs disponibles
          </h2>
          {donorsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : donors && donors.length > 0 ? (
            <div className="space-y-4">
              {donors.map(donor => (
                <div key={donor.id} className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                      {formatBloodType(donor.bloodType)}
                    </div>
                    <div>
                      <h4 className="font-bold">{donor.name || "Donneur anonyme"}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {donor.city}</p>
                    </div>
                  </div>
                  {donor.phone && (
                    <a href={`tel:${donor.phone}`} className="h-10 w-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-500/20 transition-colors">
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/20 border border-dashed rounded-xl p-8 text-center text-muted-foreground">
              <p>Aucun donneur disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
