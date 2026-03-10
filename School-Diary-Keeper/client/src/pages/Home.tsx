import { useState, useMemo } from "react";
import { isBefore, startOfDay, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { BookMarked, Coffee, Download, Plus, Home as HomeIcon, Search, CheckCircle2, Clock, Moon, Sun } from "lucide-react";
import { useDiarioList } from "@/hooks/use-diario";
import { DiarioCard } from "@/components/DiarioCard";
import { DiarioForm } from "@/components/DiarioForm";
import Voti from "./Voti";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "add" | "voti">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const { data: diarioItems, isLoading, isError } = useDiarioList();

  // Salva tema nel localStorage
  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-dark', JSON.stringify(newValue));
      document.documentElement.classList.toggle('dark', newValue);
    }
  };

  const handleExportData = () => {
    if (!diarioItems) return;
    
    const csvData = [
      "Materia,Data,Tipo,Descrizione,Completato,Studiato",
      ...diarioItems.map(item => 
        `"${item.materia}","${item.data}","${item.tipo}","${item.descrizione.replace(/"/g, '""')}","${item.completato ? "Sì" : "No"}","${item.studiato ? "Sì" : "No"}"`
      )
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `diario_scolastico_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    if (!diarioItems) return { todo: 0, done: 0 };
    const today = startOfDay(new Date());

    let todo = 0;
    let done = 0;

    diarioItems.forEach(item => {
      const itemDate = startOfDay(parseISO(item.data));
      const isPast = isBefore(itemDate, today);

      if (item.tipo === 'Compito') {
        if (item.completato) done++;
        else todo++;
      } else {
        if (isPast) done++;
        else todo++;
      }
    });

    return { todo, done };
  }, [diarioItems]);

  const filteredItems = useMemo(() => {
    if (!diarioItems) return [];
    const today = startOfDay(new Date());

    return diarioItems
      .filter(item => {
        const matchesSearch = 
          item.materia.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.descrizione.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        const itemDate = startOfDay(parseISO(item.data));
        
        if (item.tipo === 'Compito' && item.completato) return false;
        if ((item.tipo === 'Verifica' || item.tipo === 'Evento') && isBefore(itemDate, today)) return false;

        return true;
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [diarioItems, searchQuery]);

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              Diario
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl glass-panel text-foreground/70 hover:text-primary transition-colors"
              title={isDark ? "Tema chiaro" : "Tema scuro"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleExportData}
              className="p-3 rounded-xl glass-panel text-foreground/70 hover:text-primary transition-colors"
              title="Esporta CSV"
            >
              <Download className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <BookMarked className="w-6 h-6" />
            </div>
          </div>
        </header>

        {activeTab === "home" ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-orange-400">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-bold text-foreground/60 uppercase tracking-wider">Da fare</span>
                </div>
                <div className="text-4xl font-black text-foreground">{stats.todo}</div>
              </div>
              <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-green-400">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-bold text-foreground/60 uppercase tracking-wider">Completati</span>
                </div>
                <div className="text-4xl font-black text-foreground">{stats.done}</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Cerca tra le materie o descrizioni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-12 py-4 text-lg"
              />
            </div>

            {/* List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold text-foreground">I tuoi impegni</h2>
                {filteredItems.length > 0 && (
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
                    {filteredItems.length} risultati
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-panel h-24 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center">
                  <Coffee className="w-12 h-12 text-primary/30 mb-4" />
                  <h3 className="text-lg font-bold text-foreground">Nessun risultato</h3>
                  <p className="text-foreground/50 text-sm">Prova a cambiare i termini di ricerca o aggiungi un nuovo impegno.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                      <DiarioCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === "add" ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DiarioForm onSuccess={() => setActiveTab("home")} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Voti />
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="glass-panel p-2 rounded-2xl flex items-center justify-around shadow-2xl border-white/20">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === "home" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-foreground/50 hover:bg-white/10"
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === "add" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-foreground/50 hover:bg-white/10"
            }`}
          >
            <Plus className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Aggiungi</span>
          </button>
          <button
            onClick={() => setActiveTab("voti")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === "voti" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-foreground/50 hover:bg-white/10"
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Voti</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
