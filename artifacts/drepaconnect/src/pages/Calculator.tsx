import { useState } from "react";
import { useCalculateGeneticRisk, GeneticInputParent1Type, GeneticInputParent2Type } from "@workspace/api-client-react";
import { AlertCircle, Calculator as CalcIcon, Dna, Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const genotypeOptions = [
  { value: "AA", label: "AA (Normal)", desc: "Hémoglobine normale" },
  { value: "AS", label: "AS (Porteur sain)", desc: "Trait drépanocytaire, pas de symptômes" },
  { value: "SS", label: "SS (Drépanocytose)", desc: "Forme homozygote sévère" },
  { value: "AC", label: "AC (Porteur C)", desc: "Porteur hémoglobine C" },
  { value: "SC", label: "SC (Drépanocytose)", desc: "Double hétérozygote" },
  { value: "CC", label: "CC", desc: "Hémoglobinose C" },
];

export default function Calculator() {
  const [parent1, setParent1] = useState<GeneticInputParent1Type>("AA");
  const [parent2, setParent2] = useState<GeneticInputParent2Type>("AA");

  const calculateMutation = useCalculateGeneticRisk();

  const handleCalculate = () => {
    calculateMutation.mutate({
      data: {
        parent1Type: parent1,
        parent2Type: parent2,
      }
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-green-600 bg-green-50 border-green-200";
      case "MODERATE": return "text-amber-600 bg-amber-50 border-amber-200";
      case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200";
      case "CRITICAL": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-primary bg-primary/5 border-primary/20";
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Dna className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Calculateur Génétique</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Évaluez les probabilités de transmission de la drépanocytose à votre enfant. 
          Cet outil est fourni à titre indicatif et ne remplace pas une consultation médicale.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 font-serif flex items-center gap-2">
              <CalcIcon className="h-5 w-5 text-primary" />
              Saisir les génotypes
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Génotype Parent 1</label>
                <select 
                  value={parent1}
                  onChange={(e) => setParent1(e.target.value as GeneticInputParent1Type)}
                  className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  {genotypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label} - {opt.desc}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Génotype Parent 2</label>
                <select 
                  value={parent2}
                  onChange={(e) => setParent2(e.target.value as GeneticInputParent2Type)}
                  className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  {genotypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label} - {opt.desc}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleCalculate}
                disabled={calculateMutation.isPending}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {calculateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Calculer le risque"}
              </button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4 flex items-start gap-3 text-sm text-muted-foreground border">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p>
              Pour connaître votre génotype exact, vous devez réaliser une électrophorèse de l'hémoglobine dans un centre de santé ou un laboratoire d'analyses médicales.
            </p>
          </div>
        </div>

        <div>
          {calculateMutation.data ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-2xl p-6 shadow-sm h-full"
            >
              <h3 className="text-xl font-bold mb-6 font-serif">Résultats de l'évaluation</h3>
              
              <div className={`mb-6 p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getRiskColor(calculateMutation.data.riskLevel)}`}>
                <span className="text-xs uppercase font-bold tracking-wider opacity-80 mb-1">Niveau de risque</span>
                <span className="text-2xl font-black">{calculateMutation.data.riskLevel}</span>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Probabilités par grossesse</h4>
                {Object.entries(calculateMutation.data.probabilities).map(([geno, prob]) => (
                  <div key={geno} className="relative pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{geno}</span>
                      <span className="font-medium text-primary">{prob}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${prob}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${geno.includes('S') || geno.includes('C') ? (geno === 'SS' || geno === 'SC' ? 'bg-destructive' : 'bg-amber-500') : 'bg-green-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-primary">
                  <AlertCircle className="h-4 w-4" /> Conseil Médical
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {calculateMutation.data.advice}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="h-full bg-muted/20 border border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[400px]">
              <CalcIcon className="h-12 w-12 mb-4 opacity-20" />
              <p>Sélectionnez les génotypes et lancez le calcul pour voir les résultats apparaître ici.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
