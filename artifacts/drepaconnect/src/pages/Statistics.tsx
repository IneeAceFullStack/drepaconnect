import { useGetNationalStats } from "@workspace/api-client-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, Users, Droplets, MapPin, Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = ['#3D1060', '#E06080', '#4DD9C0', '#F59E0B', '#3B82F6', '#8B5CF6'];

export default function Statistics() {
  const { data: stats, isLoading } = useGetNationalStats();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Statistiques Nationales</h1>
        </div>
        <p className="text-muted-foreground">Aperçu global de la lutte contre la drépanocytose sur la plateforme.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Patients inscrits</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats?.totalPatients || 0}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Droplets className="h-5 w-5 text-destructive" />
            <h3 className="font-medium">Donneurs actifs</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats?.totalDonors || 0}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <MapPin className="h-5 w-5 text-teal-600" />
            <h3 className="font-medium">Centres de soins</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats?.totalCenters || 0}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Activity className="h-5 w-5 text-accent" />
            <h3 className="font-medium">Crises ce mois</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats?.crisisThisMonth || 0}</p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border rounded-2xl p-6 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold font-serif mb-6">Répartition par département</h3>
          {stats?.byProvince && stats.byProvince.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byProvince} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="province" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">Pas de données</div>
          )}
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm h-[400px] flex flex-col">
          <h3 className="text-lg font-bold font-serif mb-6">Répartition des génotypes</h3>
          {stats?.bySickleType && stats.bySickleType.length > 0 ? (
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.bySickleType}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="type"
                  >
                    {stats.bySickleType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">Pas de données</div>
          )}
        </div>
      </div>
    </div>
  );
}
