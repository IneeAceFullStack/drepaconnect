import { useGetEducationModule } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Clock, BookOpen, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const categoryLabels: Record<string, string> = {
  BASICS: "Comprendre la maladie",
  GENETICS: "Génétique",
  SYMPTOMS: "Symptômes et Crises",
  TREATMENT: "Traitements",
  NUTRITION: "Nutrition & Hygiène",
  PREVENTION: "Prévention",
  SCHOOL: "Vie scolaire",
  FAMILY: "Vie de famille",
};

const audienceLabels: Record<string, string> = {
  ALL: "Tout public",
  CHILDREN: "Enfants",
  ADULTS: "Adultes",
  STUDENTS: "Étudiants",
  TEACHERS: "Enseignants",
  PARENTS: "Parents",
  DOCTORS: "Médecins",
};

export default function EducationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: mod, isLoading } = useGetEducationModule(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Ressource introuvable.</p>
        <Link href="/education" className="text-primary hover:underline mt-4 inline-block">
          ← Retour à l'éducation
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <Link href="/education" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour aux ressources
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Image ou placeholder */}
        {mod.imageUrl ? (
          <div className="h-52 w-full bg-muted rounded-2xl overflow-hidden mb-6">
            <img src={mod.imageUrl} alt={mod.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-52 w-full bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
            {mod.videoUrl ? (
              <PlayCircle className="h-16 w-16 text-primary/30" />
            ) : (
              <BookOpen className="h-16 w-16 text-primary/30" />
            )}
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            {categoryLabels[mod.category] || mod.category}
          </span>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {audienceLabels[mod.targetAudience] || mod.targetAudience}
          </span>
          {mod.readTime && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Clock className="h-3 w-3" /> {mod.readTime} min de lecture
            </span>
          )}
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-serif font-bold text-foreground mb-3">{mod.title}</h1>

        {/* Résumé */}
        {mod.summary && (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed border-l-4 border-primary/30 pl-4">
            {mod.summary}
          </p>
        )}

        {/* Vidéo */}
        {mod.videoUrl && (
          <div className="mb-6">
            <a
              href={mod.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit"
            >
              <PlayCircle className="h-5 w-5" />
              Voir la vidéo
            </a>
          </div>
        )}

        {/* Contenu */}
        {mod.content && (
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-bold mb-4 text-foreground">Contenu détaillé</h2>
            <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-line">
              {mod.content}
            </div>
          </div>
        )}

        {/* Conseil */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mt-6">
          <p className="text-sm text-muted-foreground">
            💡 Ces informations sont données à titre éducatif. Pour tout conseil médical personnalisé, consultez un professionnel de santé au Congo.
          </p>
        </div>
      </motion.div>
    </div>
  );
}