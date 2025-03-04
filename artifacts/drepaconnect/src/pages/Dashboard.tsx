import { useGetDashboardStats, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Pill, Activity, Droplets, Heart, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useGetDashboardStats({
    query: {
      queryKey: getGetDashboardStatsQueryKey()
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold text-foreground">Bonjour, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Voici le résumé de votre activité sur DrépaConnect.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user?.role === "DOCTOR" && (
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patients</p>
                <h3 className="text-2xl font-bold text-foreground">{stats?.totalPatients || 0}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Crises (7j)</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.crisisThisWeek || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Médicaments actifs</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.activeMedications || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Donneurs dispo.</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.availableDonors || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-serif">Dernières crises</h3>
          </div>
          {stats?.recentCrises && stats.recentCrises.length > 0 ? (
            <div className="space-y-4">
              {stats.recentCrises.map(crisis => (
                <div key={crisis.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold
                    ${crisis.intensity >= 7 ? 'bg-destructive/20 text-destructive' : 
                      crisis.intensity >= 4 ? 'bg-amber-500/20 text-amber-600' : 
                      'bg-green-500/20 text-green-600'}`}>
                    {crisis.intensity}
                  </div>
                  <div>
                    <p className="font-medium">{new Date(crisis.startedAt).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{crisis.symptoms || "Aucun symptôme renseigné"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>Aucune crise récente</p>
            </div>
          )}
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-serif">Demandes de sang</h3>
          </div>
          {stats?.recentBloodRequests && stats.recentBloodRequests.length > 0 ? (
            <div className="space-y-4">
              {stats.recentBloodRequests.map(req => (
                <div key={req.id} className="flex flex-col gap-2 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-destructive bg-destructive/10 px-2 py-1 rounded text-sm">
                      {req.bloodType.replace('_POS', '+').replace('_NEG', '-')}
                    </span>
                    {req.urgent && (
                      <span className="text-xs font-bold text-white bg-destructive px-2 py-1 rounded">URGENT</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">{req.city}</span>
                    <span className="font-medium">{req.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>Aucune demande de sang en cours</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
