import { useState } from "react";
import { DocumentTextIcon, UserIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import type { Exam } from "./examTypes";

interface Props {
  onNavigate?: (tab: string, exam?: Exam) => void;
  exams?: Exam[];
}

type Modo = "questao" | "aluno";

interface ExamWithCorrection extends Exam {
  corrected: number;
  pending: number;
  progress: number;
}

export function CorrecaoPage({ onNavigate, exams = [] }: Props) {
  const [modo, setModo] = useState<Modo>("questao");
  // Gerar dados de correção para cada prova (usando seed baseada no ID para consistência)
  const examCards: ExamWithCorrection[] = exams.map((exam) => {
    const total = parseInt(exam.submissions);
    // Usar ID da prova como seed para gerar porcentagem consistente
    const seed = (exam.id * 37) % 100; // Gera número entre 0-99
    const correctionRate = seed / 100;
    const corrected = Math.floor(total * correctionRate);
    const pending = total - corrected;
    const progress = total > 0 ? Math.round((corrected / total) * 100) : 0;

    return {
      ...exam,
      corrected,
      pending,
      progress,
    };
  });

  const totalSubmissions = examCards.reduce((acc, e) => acc + parseInt(e.submissions), 0);
  const totalCorrected = examCards.reduce((acc, e) => acc + e.corrected, 0);
  const totalPending = examCards.reduce((acc, e) => acc + e.pending, 0);

  const statCards = [
    { label: "Provas ativas", value: exams.length.toString() },
    { label: "Submissões", value: totalSubmissions.toString() },
    { label: "Corrigidas", value: totalCorrected.toString() },
    { label: "Pendentes", value: totalPending.toString() },
  ];

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#000" }}>
            Correção
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#575454" }}>
            {modo === "questao" ? "Corrija questão por questão em todas as submissões" : "Corrija a prova completa de cada aluno"}
          </p>
        </div>

        {/* Toggle modo */}
        <div className="flex gap-1 p-1 rounded-xl shrink-0" style={{ backgroundColor: "#fff", border: "1px solid #D7D7D9" }}>
          <button
            onClick={() => setModo("questao")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: modo === "questao" ? "#F9B233" : "transparent",
              color: modo === "questao" ? "#6B6FA3" : "#6A7181",
              fontFamily: "Poppins, sans-serif",
              fontWeight: modo === "questao" ? 600 : 400,
              fontSize: 13,
            }}
          >
            <ListBulletIcon className="w-4 h-4" />
            Por questão
          </button>
          <button
            onClick={() => setModo("aluno")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: modo === "aluno" ? "#F9B233" : "transparent",
              color: modo === "aluno" ? "#6B6FA3" : "#6A7181",
              fontFamily: "Poppins, sans-serif",
              fontWeight: modo === "aluno" ? 600 : 400,
              fontSize: 13,
            }}
          >
            <UserIcon className="w-4 h-4" />
            Por aluno
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex flex-col gap-1" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px", color: "#6B6FA3" }}>
              {card.value}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#555" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Section label */}
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          letterSpacing: "0.1em",
          color: "#6B6FA3",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {modo === "questao" ? "Escolha a prova a ser corrigida" : "Escolha a prova para corrigir por aluno"}
      </p>

      {/* Exam correction cards */}
      <div className="flex flex-col gap-4">
        {examCards.map((exam) => (
          <div
            key={exam.id}
            onClick={() => onNavigate?.(modo === "questao" ? "prova-questoes-correcao" : "correcao-aluno", exam)}
            className="bg-white rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            {/* Top row */}
            <div className="flex items-center gap-3">
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
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181" }}>{exam.submissions} submissões</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: exam.corrected.toString(), label: "Provas corrigidas" },
                { val: exam.pending.toString(), label: "Provas pendentes" },
                { val: `${exam.progress}%`, label: "Progresso" },
              ].map((stat, j) => (
                <div
                  key={j}
                  className="rounded-lg p-2 text-center"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "16px", color: "#6B6FA3" }}>
                    {stat.val}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6A7181" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full rounded-full h-1.5" style={{ backgroundColor: "#E5E7EB" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${exam.progress}%`, backgroundColor: "#6B6FA3" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
