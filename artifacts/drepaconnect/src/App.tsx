import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Shell } from "@/components/layout/Shell";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Calculator from "@/pages/Calculator";
import Crises from "@/pages/Crises";
import CrisesStats from "@/pages/CrisesStats";
import Medications from "@/pages/Medications";
import Centers from "@/pages/Centers";
import CenterDetail from "@/pages/CenterDetail";
import Donors from "@/pages/Donors";
import DonorRegister from "@/pages/DonorRegister";
import MedicalRecord from "@/pages/MedicalRecord";
import Pregnancy from "@/pages/Pregnancy";
import Education from "@/pages/Education";
import EducationDetail from "@/pages/EducationDetail";
import Statistics from "@/pages/Statistics";
import Patients from "@/pages/Patients";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: any }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
        <Route path="/calculateur" component={Calculator} />
        <Route path="/crises"><ProtectedRoute component={Crises} /></Route>
        <Route path="/crises/stats"><ProtectedRoute component={CrisesStats} /></Route>
        <Route path="/medicaments"><ProtectedRoute component={Medications} /></Route>
        <Route path="/centres" component={Centers} />
        <Route path="/centres/:id" component={CenterDetail} />
        <Route path="/donneurs"><ProtectedRoute component={Donors} /></Route>
        <Route path="/donneurs/register"><ProtectedRoute component={DonorRegister} /></Route>
        <Route path="/carnet"><ProtectedRoute component={MedicalRecord} /></Route>
        <Route path="/grossesse"><ProtectedRoute component={Pregnancy} /></Route>
        <Route path="/education" component={Education} />
        <Route path="/education/:id" component={EducationDetail} />
        <Route path="/statistiques" component={Statistics} />
        <Route path="/patients"><ProtectedRoute component={Patients} /></Route>
        <Route path="/profil"><ProtectedRoute component={Profile} /></Route>
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;