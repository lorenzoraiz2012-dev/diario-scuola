import { useState } from "react";
import { format } from "date-fns";
import { Plus, Sparkles } from "lucide-react";
import { useCreateDiario } from "@/hooks/use-diario";
import { type InsertDiario } from "@shared/schema";

export function DiarioForm({ onSuccess }: { onSuccess?: () => void }) {
  const createDiario = useCreateDiario();
  const materie = [
    "Algebra",
    "Geometria",
    "Scienze",
    "Italiano",
    "Storia",
    "Geografia",
    "Inglese",
    "Tedesco",
    "Religione",
    "Educazione Civica",
    "Tecnologia",
    "Arte",
    "Musica",
    "Motoria",
    "Certificazioni Linguistica",
    "Laboratori",
    "Evento",
  ];

  const [formData, setFormData] = useState<InsertDiario>({
    materia: materie[0],
    data: format(new Date(), "yyyy-MM-dd"),
    tipo: "Compito",
    descrizione: "",
    completato: false,
    studiato: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materia || !formData.descrizione || !formData.data) return;
    
    createDiario.mutate(formData, {
      onSuccess: () => {
        setFormData({
          materia: materie[0],
          data: format(new Date(), "yyyy-MM-dd"),
          tipo: "Compito",
          descrizione: "",
          completato: false,
          studiato: false,
        });
        onSuccess?.();
      }
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
      {/* Decorative subtle element */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-primary" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 font-display flex items-center gap-2 text-foreground">
          Nuovo Impegno
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70 ml-1">Materia</label>
              <div className="relative">
                <select
                  value={formData.materia}
                  onChange={(e) => setFormData(prev => ({ ...prev, materia: e.target.value }))}
                  className="glass-input appearance-none pr-10 cursor-pointer bg-white/40"
                >
                  {materie.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-foreground/50">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70 ml-1">Tipo</label>
              <div className="relative">
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as InsertDiario['tipo'] }))}
                  className="glass-input appearance-none pr-10 cursor-pointer bg-white/40"
                >
                  <option value="Compito">Compito</option>
                  <option value="Verifica">Verifica</option>
                  <option value="Evento">Evento</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-foreground/50">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/70 ml-1">Data</label>
            <input
              required
              type="date"
              value={formData.data}
              onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
              className="glass-input cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/70 ml-1">Descrizione</label>
            <textarea
              required
              placeholder="Cosa c'è da fare?"
              value={formData.descrizione}
              onChange={(e) => setFormData(prev => ({ ...prev, descrizione: e.target.value }))}
              className="glass-input min-h-[100px] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={createDiario.isPending}
            className="w-full mt-2 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-indigo-500 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {createDiario.isPending ? (
              <span className="animate-pulse">Aggiungendo...</span>
            ) : (
              <>
                <Plus className="w-5 h-5" /> Aggiungi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
