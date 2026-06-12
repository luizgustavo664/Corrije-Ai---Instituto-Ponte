import { DocumentTextIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Props {
  onNavigate: (tab: string) => void;
}

const statCards = [
  { value: "42", label: "Provas criadas", change: "+5 este mês" },
  { value: "487", label: "Submissões totais", change: "+58 esta semana" },
  { value: "34", label: "Correções pendentes", change: "+12 hoje" },
  { value: "453", label: "Notas liberadas", change: "+41 este mês" },
];

const recentExams = [
  { title: "Avaliação Final - Cálculo Diferencial III", meta: "Prova • 1º Semestre 2026", submissions: "48 submissões", badge: "Publicada" },
  { title: "Exame Parcial - Álgebra Linear", meta: "Prova • 1º Semestre 2026", submissions: "42 submissões", badge: "Rascunho" },
  { title: "Prova Intermediária - Física II", meta: "Prova • 2º Semestre 2025", submissions: "55 submissões", badge: "Encerrada" },
  { title: "Teste Diagnóstico - Equações Diferenciais", meta: "Prova • 2º Semestre 2025", submissions: "39 submissões", badge: "Publicada" },
  { title: "Avaliação Semestral - Análise Matemática", meta: "Prova • 1º Semestre 2025", submissions: "51 submissões", badge: "Antiga" },
];

export function PainelPage({ onNavigate }: Props) {
  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#000" }}>
            Bem-vindo de volta!
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#575454" }}>
            Gerencie as provas e acompanhe os resultados
          </p>
        </div>
        <button
          onClick={() => onNavigate("nova-prova")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
          style={{ backgroundColor: "#F9B233", color: "#6B6FA3", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px" }}
        >
          <PlusIcon className="w-4 h-4" />
          Nova prova
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex flex-col gap-2" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 36, height: 36, backgroundColor: "#EEF1F8" }}
            >
              <DocumentTextIcon className="w-[18px] h-[18px]" style={{ color: "#6B6FA3" }} />
            </div>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px", color: "#6B6FA3" }}>
              {card.value}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#555" }}>{card.label}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#05245F" }}>{card.change}</p>
          </div>
        ))}
      </div>

      {/* Recent exams */}
      <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px", color: "#000" }}>
        Provas recentes
      </h2>

      <div className="flex flex-col gap-3">
        {recentExams.map((exam, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 flex items-center gap-4"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <div
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{ width: 36, height: 36, backgroundColor: "#EEF1F8" }}
            >
              <DocumentTextIcon className="w-[18px] h-[18px]" style={{ color: "#6B6FA3" }} />
            </div>
            <div className="flex-1">
              <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "14px", color: "#000" }}>
                {exam.title}
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#504F4F" }}>{exam.meta}</p>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#B1B4BD" }}>{exam.submissions}</p>
            <span
              className="px-3 py-1 rounded-lg"
              style={{ backgroundColor: "#F2F2F2", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181" }}
            >
              {exam.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
