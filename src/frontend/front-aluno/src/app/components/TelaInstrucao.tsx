import { BookOpen, ChevronRight, BookMarked, GraduationCap, Users, Clock, CalendarDays } from "lucide-react";
import { Header } from "./Header";

const INSTRUCTIONS = [
  "Esta prova tem duração de 3 horas. Mantenha-se atento ao cronômetro exibido na tela.",
  "É proibido o uso de dispositivos eletrônicos externos, calculadoras ou consulta a materiais.",
  "Cada questão deve ser respondida com clareza, objetividade e fundamentação adequada.",
  "Questões deixadas em branco serão consideradas não respondidas e não pontuarão.",
  "Após o envio, não será possível editar ou recuperar suas respostas. Revise antes de finalizar.",
];

const EXAM_INFO = [
  { icon: BookMarked,   label: "Modalidade",     value: "Prova" },
  { icon: GraduationCap, label: "Disciplina",    value: "Matemática" },
  { icon: Users,        label: "Turma",          value: "Eng-301A" },
  { icon: GraduationCap, label: "Semestre",      value: "1º Semestre 2026" },
  { icon: Clock,        label: "Tempo de prova", value: "3 horas" },
  { icon: CalendarDays, label: "Data limite",    value: "Não definida" },
];

interface Props {
  onStart: () => void;
}

export function TelaInstrucao({ onStart }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F2F2F2]">
      <Header title="Instruções de Prova" />

      <div className="flex-1 px-4 py-6 flex flex-col gap-5 overflow-y-auto pb-8">
        {/* Exam info cards */}
        <div className="grid grid-cols-2 gap-3">
          {EXAM_INFO.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl px-4 py-3.5 shadow-sm flex items-center gap-3">
              <div className="size-9 rounded-lg bg-[#6B6FA3]/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-[#6B6FA3]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#666666]">{label}</p>
                <p className="text-sm font-bold text-[#000000] truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#05245F] px-4 py-3 flex items-center gap-2">
            <BookOpen size={18} className="text-[#6B6FA3]" />
            <span className="text-white font-semibold text-sm">Leia com atenção antes de começar</span>
          </div>
          <div className="divide-y divide-[#F2F2F2]">
            {INSTRUCTIONS.map((instruction, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5">
                <div className="mt-0.5 size-6 rounded-full bg-[#F2F2F2] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#05245F]">{i + 1}</span>
                </div>
                <p className="text-sm text-[#000000] leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-[#6B6FA3] text-white rounded-lg py-4 font-bold text-sm tracking-widest uppercase active:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          Começar a prova
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
