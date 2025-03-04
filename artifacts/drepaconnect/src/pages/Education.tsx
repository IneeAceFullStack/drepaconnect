import { useListEducationModules } from "@workspace/api-client-react";
import { BookOpen, Search, PlayCircle, FileText, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const categories = [
  { id: "ALL", label: "Tout" },
  { id: "BASICS", label: "Comprendre la maladie" },
  { id: "GENETICS", label: "Génétique" },
  { id: "SYMPTOMS", label: "Symptômes et Crises" },
  { id: "TREATMENT", label: "Traitements" },
  { id: "NUTRITION", label: "Nutrition & Hygiène" },
  { id: "FAMILY", label: "Vie de famille" },
];

export default function Education() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  const { data: modules, isLoading } = useListEducationModules({
    category: activeCategory !== "ALL" ? activeCategory : undefined
  });

  const filteredModules = modules?.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.summary?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Éducation & Prévention</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Des ressources fiables pour mieux comprendre et vivre avec la drépanocytose au quotidien.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un article ou une vidéo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl shadow-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filteredModules && filteredModules.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((mod, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={mod.id}
            >
              <Link href={`/education/${mod.id}`}>
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col cursor-pointer group">
                  {mod.imageUrl ? (
                    <div className="h-40 w-full bg-muted overflow-hidden relative">
                      <img src={mod.imageUrl} alt={mod.title} className="w-full h-full object-cover object-center" />
                      {mod.videoUrl && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <PlayCircle className="h-10 w-10 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-primary/5 flex items-center justify-center text-primary/20">
                      {mod.videoUrl ? <PlayCircle className="h-16 w-16" /> : <FileText className="h-16 w-16" />}
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                        {mod.category}
                      </span>
                      {mod.readTime && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                          <Clock className="h-3 w-3" /> {mod.readTime} min
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{mod.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{mod.summary}</p>

                    <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lire la suite →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 border border-dashed rounded-2xl">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">Aucune ressource trouvée pour cette recherche.</p>
        </div>
      )}
    </div>
  );
}