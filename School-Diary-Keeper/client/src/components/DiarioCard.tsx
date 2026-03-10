import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Check, Calendar, BookOpen, AlertCircle, Trash2, CheckSquare } from "lucide-react";
import { type Diario } from "@shared/schema";
import { useUpdateDiario, useDeleteDiario } from "@/hooks/use-diario";
import { stringToPastelColor, stringToDarkColor, cn } from "@/lib/utils";

interface DiarioCardProps {
  item: Diario;
}

const TIPO_ICONS = {
  Compito: BookOpen,
  Verifica: AlertCircle,
  Evento: Calendar,
};

export function DiarioCard({ item }: DiarioCardProps) {
  const updateDiario = useUpdateDiario();
  const deleteDiario = useDeleteDiario();

  const handleToggleComplete = () => {
    updateDiario.mutate({ id: item.id, completato: !item.completato });
  };

  const handleToggleStudiato = () => {
    updateDiario.mutate({ id: item.id, studiato: !item.studiato });
  };

  const handleDelete = () => {
    if (confirm("Sei sicuro di voler eliminare questo elemento?")) {
      deleteDiario.mutate(item.id);
    }
  };

  const Icon = TIPO_ICONS[item.tipo as keyof typeof TIPO_ICONS] || Calendar;
  const isCompito = item.tipo === "Compito";
  const isVerifica = item.tipo === "Verifica";
  const badgeColor = stringToPastelColor(item.materia);
  const badgeTextColor = stringToDarkColor(item.materia);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -4 }}
      className={cn(
        "glass-panel p-5 rounded-2xl relative group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border-2",
        item.studiato && isVerifica ? "border-green-400/30 bg-green-50/10" : "border-white/20"
      )}
    >
      {/* Decorative colored glow based on Materia */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-60 pointer-events-none"
        style={{ backgroundColor: badgeColor }}
      />

      <div className="flex gap-4">
        {/* Left column: Action/Icon */}
        <div className="flex flex-col items-center gap-3 pt-1 relative z-10">
          {isCompito ? (
            <button
              onClick={handleToggleComplete}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-sm",
                item.completato 
                  ? "bg-green-400 border-green-400 text-white shadow-green-400/30" 
                  : "bg-white/50 border-white/80 text-transparent hover:border-green-400/50 hover:bg-white"
              )}
            >
              <Check className="w-5 h-5" />
            </button>
          ) : isVerifica ? (
            <button
              onClick={handleToggleStudiato}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border-2 shadow-sm",
                item.studiato 
                  ? "bg-green-500 border-green-500 text-white shadow-green-500/30" 
                  : "bg-white/50 border-white/80 text-foreground/20 hover:border-green-500/50 hover:text-green-500"
              )}
              title="Segna come studiato"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/60 border border-white flex items-center justify-center text-foreground/50 shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Right column: Content */}
        <div className="flex-1 relative z-10">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm"
                style={{ backgroundColor: badgeColor, color: badgeTextColor }}
              >
                {item.materia}
              </span>
              <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {item.tipo}
                {item.studiato && isVerifica && (
                  <span className="ml-2 text-green-500 font-bold flex items-center gap-1 bg-green-100/50 px-2 py-0.5 rounded-md">
                    <Check className="w-3 h-3" /> STUDIATO
                  </span>
                )}
              </span>
            </div>
            
            <button 
              onClick={handleDelete}
              className="text-foreground/20 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
              title="Elimina"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <h3 className={cn(
            "text-lg font-semibold text-foreground mt-2 mb-1 transition-all",
            item.completato && "line-through text-foreground/40"
          )}>
            {item.descrizione}
          </h3>
          
          <div className="flex items-center text-sm font-medium text-foreground/60 mt-3 bg-white/30 w-fit px-3 py-1.5 rounded-lg border border-white/40">
            <Calendar className="w-4 h-4 mr-2 text-primary/70" />
            {format(parseISO(item.data), "EEEE d MMMM yyyy", { locale: it })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
