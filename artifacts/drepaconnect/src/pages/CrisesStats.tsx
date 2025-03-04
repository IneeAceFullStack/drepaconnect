import { useGetCrisisStats, useGetCrisesByMonth } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Activity, Calendar as CalendarIcon, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function CrisesStats() {
  const { data: stats, isLoading: statsLoading } = useGetCrisisStats();
  const { data: monthlyData, isLoading: monthlyLoading } = useGetCrisesByMonth({ year: new Date().getFullYear() });

  const isLoading = statsLoading || monthlyLoading;

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Statistiques des crises</h1>
          </div>
          <p className="text-muted-foreground">Analysez la fréquence et l'intensité de vos épisodes sur l'année.</p>
        </div>
        <Link href="/crises" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          Retour au journal
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Activity className="h-5 w-5" />
            <h3 className="font-medium">Total (Cette année)</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats?.thisYear || 0}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Intensité moyenne</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats?.avgIntensity.toFixed(1) || 0}/10</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <CalendarIcon className="h-5 w-5 text-destructive" />
            <h3 className="font-medium">Passages aux urgences</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats?.hospitalVisits || 0}</p>
        </motion.div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm h-[400px]">
        <h3 className="text-lg font-bold font-serif mb-6">Évolution mensuelle</h3>
        {monthlyData && monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
              />
              <Bar dataKey="count" name="Nombre de crises" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Activity className="h-8 w-8 mb-2 opacity-20" />
            <p>Pas assez de données pour afficher le graphique</p>
          </div>
        )}
      </div>
    </div>
  );
}
