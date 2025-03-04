import { useState } from "react";
import { useRegisterDonor, BloodDonorInputBloodType } from "@workspace/api-client-react";
import { Droplets, MapPin, Phone, Loader2, Heart } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function DonorRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const registerMutation = useRegisterDonor();

  const [formData, setFormData] = useState({
    bloodType: "O_POS" as BloodDonorInputBloodType,
    city: "",
    phone: "",
    province: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({ title: "Merci !", description: "Vous êtes désormais inscrit comme donneur." });
          setLocation("/donneurs");
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <Link href="/donneurs" className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block">
        ← Retour au réseau
      </Link>

      <div className="bg-card border rounded-2xl p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <Heart className="h-8 w-8" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-foreground">Devenir donneur de sang</h1>
          <p className="text-muted-foreground mt-2">Votre don peut sauver la vie d'un patient en pleine crise.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Votre groupe sanguin</label>
            <select 
              value={formData.bloodType}
              onChange={e => setFormData({...formData, bloodType: e.target.value as BloodDonorInputBloodType})}
              className="w-full p-3 border rounded-lg bg-background text-lg"
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ville</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Province (Optionnel)</label>
              <input 
                type="text" 
                value={formData.province}
                onChange={e => setFormData({...formData, province: e.target.value})}
                className="w-full p-2.5 border rounded-lg bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Numéro de téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background"
                placeholder="Pour être contacté en cas d'urgence"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={registerMutation.isPending}
            className="w-full bg-destructive text-destructive-foreground py-3 rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {registerMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Je m'engage à donner"}
          </button>
        </form>
      </div>
    </div>
  );
}
