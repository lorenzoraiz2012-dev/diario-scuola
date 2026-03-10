import { useState, useMemo } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVotiList, useCreateVoto, useDeleteVoto } from "@/hooks/use-voti";

interface VotoPerMateria {
  materia: string;
  voti: number[];
  media: number;
}

export default function Voti() {
  const { data: votiData, isLoading } = useVotiList();
  const createVoto = useCreateVoto();
  const deleteVoto = useDeleteVoto();
  const [newVotoMateria, setNewVotoMateria] = useState("");
  const [newVotoValue, setNewVotoValue] = useState("");

  const materie = [
    "Algebra", "Geometria", "Scienze", "Italiano", "Storia", "Geografia",
    "Inglese", "Tedesco", "Religione", "Educazione Civica", "Tecnologia",
    "Arte", "Musica", "Motoria", "Certificazioni Linguistica", "Laboratori", "Evento",
  ];

  const votiPerMateria = useMemo(() => {
    if (!votiData) return [];

    const grouped = new Map<string, number[]>();
    votiData.forEach(v => {
      if (!grouped.has(v.materia)) grouped.set(v.materia, []);
      grouped.get(v.materia)!.push(Number(v.voto));
    });

    return Array.from(grouped.entries()).map(([materia, voti]) => ({
      materia,
      voti: voti.sort((a, b) => b - a),
      media: voti.reduce((a, b) => a + b, 0) / voti.length,
    })).sort((a, b) => a.materia.localeCompare(b.materia));
  }, [votiData]);

  const mediaGenerale = useMemo(() => {
    if (votiPerMateria.length === 0) return 0;
    return votiPerMateria.reduce((a, b) => a + b.media, 0) / votiPerMateria.length;
  }, [votiPerMateria]);

  const handleAddVoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVotoMateria || !newVotoValue) return;
    const voto = parseFloat(newVotoValue);
    if (voto < 1 || voto > 10) {
      alert("Il voto deve essere tra 1 e 10");
      return;
    }
    createVoto.mutate({ materia: newVotoMateria, voto: String(voto) }, {
      onSuccess: () => {
        setNewVotoMateria("");
        setNewVotoValue("");
      }
    });
  };

  const getColorForMedia = (media: number) => {
    if (media >= 8.5) return "text-green-500";
    if (media >= 7) return "text-blue-500";
    if (media >= 6) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="glass-panel p-8 rounded-3xl text-center">
        <div className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-2">
          Media Generale
        </div>
        <div className={`text-5xl font-black ${getColorForMedia(mediaGenerale)}`}>
          {mediaGenerale.toFixed(2)}
        </div>
      </div>

      {/* Form */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xl font-bold text-foreground mb-4">Aggiungi Voto</h3>
        <form onSubmit={handleAddVoto} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select
                value={newVotoMateria}
                onChange={(e) => setNewVotoMateria(e.target.value)}
                className="glass-input appearance-none pr-10 cursor-pointer bg-white/40 w-full"
                required
              >
                <option value="">Seleziona materia</option>
                {materie.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-foreground/50">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              placeholder="Voto (1-10)"
              value={newVotoValue}
              onChange={(e) => setNewVotoValue(e.target.value)}
              className="glass-input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createVoto.isPending}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-indigo-500 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Aggiungi Voto
          </button>
        </form>
      </div>

      {/* Materie Grid */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel h-32 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : votiPerMateria.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <Star className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Nessun voto</h3>
          <p className="text-foreground/50">Inizia ad aggiungere i tuoi voti per vedere le medie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {votiPerMateria.map((item) => (
              <motion.div
                key={item.materia}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-foreground">{item.materia}</h3>
                  <div className={`text-2xl font-black ${getColorForMedia(item.media)}`}>
                    {item.media.toFixed(2)}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-bold text-foreground/60 uppercase">Voti</p>
                  <div className="flex flex-wrap gap-2">
                    {item.voti.map((voto, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const votoToDelete = votiData?.find(v => v.materia === item.materia && Number(v.voto) === voto);
                          if (votoToDelete && confirm("Eliminare questo voto?")) {
                            deleteVoto.mutate(votoToDelete.id);
                          }
                        }}
                        className="px-3 py-1 bg-white/30 text-foreground font-bold rounded-lg text-sm hover:bg-red-400/30 transition-colors cursor-pointer flex items-center gap-1"
                        title="Clicca per eliminare"
                      >
                        {voto}
                        <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-foreground/50">
                  {item.voti.length} voto{item.voti.length !== 1 ? "i" : ""}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
