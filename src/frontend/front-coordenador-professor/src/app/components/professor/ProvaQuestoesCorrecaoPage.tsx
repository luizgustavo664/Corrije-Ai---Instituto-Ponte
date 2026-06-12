import { useState, useEffect } from "react";
import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import type { Question } from "./ProvaDetailPage";
import { CorrecaoCompletaModal } from "./CorrecaoCompletaModal";
import { SuccessNotification } from "./SuccessNotification";

interface Props {
  onBack: () => void;
  onNavigateToQuestion: (questionId: number, questionType: "Alternativa" | "V/F" | "Discursiva") => void;
  questions?: Question[];
  examTitle?: string;
  totalSubmissions?: number;
  showCompletionModal?: boolean;
  onResetCompletionModal?: () => void;
}

interface QuestionCorrection {
  id: number;
  numero: number;
  titulo: string;
  tipo: "Alternativa" | "V/F" | "Discursiva";
  totalSubmissoes: number;
  corrigidas: number;
  pendentes: number;
  progresso: number;
}

const typeColors = {
  Alternativa: { bg: "#EEF1F8", color: "#6B6FA3" },
  "V/F": { bg: "#E6FAF8", color: "#05245F" },
  Discursiva: { bg: "#FFF8E0", color: "#B07D00" },
};

function convertToQuestionCorrection(questions: Question[], totalSubmissions: number): QuestionCorrection[] {
  return questions.map((q, index) => {
    const totalSub = totalSubmissions;
    const corrigidas = Math.floor(Math.random() * totalSub);
    const pendentes = totalSub - corrigidas;
    const progresso = totalSub > 0 ? Math.round((corrigidas / totalSub) * 100) : 0;

    return {
      id: q.id,
      numero: index + 1,
      titulo: q.text.length > 60 ? q.text.substring(0, 60) + "..." : q.text,
      tipo: q.type,
      totalSubmissoes: totalSub,
      corrigidas,
      pendentes,
      progresso,
    };
  });
}

export function ProvaQuestoesCorrecaoPage({
  onBack,
  onNavigateToQuestion,
  questions = [],
  examTitle = "Avaliação Final - Cálculo Diferencial III",
  totalSubmissions = 45,
  showCompletionModal = false,
  onResetCompletionModal
}: Props) {
  const questoes = convertToQuestionCorrection(questions, totalSubmissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showCompletionModal) {
      setIsModalOpen(true);
    }
  }, [showCompletionModal]);

  const handleSaveCorrection = () => {
    setIsModalOpen(false);
    setShowNotification(true);
    if (onResetCompletionModal) {
      onResetCompletionModal();
    }
  };

  const handleContinueCorrection = () => {
    setIsModalOpen(false);
    if (onResetCompletionModal) {
      onResetCompletionModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onResetCompletionModal) {
      onResetCompletionModal();
    }
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Botão voltar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 hover:opacity-70 transition-opacity self-start"
        style={{ color: "#6A7181" }}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px" }}>
          Voltar para correções
        </span>
      </button>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px", color: "#6B6FA3" }}>
          {examTitle}
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
          1º Semestre 2026 • {totalSubmissions} submissões
        </p>
      </div>

      {/* Stats resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "#6B6FA3" }}>
            {questoes.length}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
            Questões na prova
          </p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "#05245F" }}>
            {questoes.reduce((acc, q) => acc + q.corrigidas, 0)}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
            Total de correções feitas
          </p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "#FF6B6B" }}>
            {questoes.reduce((acc, q) => acc + q.pendentes, 0)}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
            Correções pendentes
          </p>
        </div>
      </div>

      {/* Título da seção */}
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          letterSpacing: "0.1em",
          color: "#6B6FA3",
          textTransform: "uppercase",
          fontWeight: 600,
          marginTop: "8px",
        }}
      >
        Selecione a questão para corrigir
      </p>

      {/* Lista de questões */}
      <div className="flex flex-col gap-3">
        {questoes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 flex items-center justify-center" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#B1B4BD" }}>
              Nenhuma questão encontrada nesta prova
            </p>
          </div>
        ) : (
          questoes.map((questao) => {
            const { bg, color } = typeColors[questao.tipo];

            return (
              <button
                key={questao.id}
                onClick={() => onNavigateToQuestion(questao.id, questao.tipo)}
                className="bg-white rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow text-left"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
              {/* Top row */}
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ width: 48, height: 48, backgroundColor: "#EEF1F8" }}
                >
                  <DocumentTextIcon className="w-6 h-6" style={{ color: "#6B6FA3" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-block px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: bg,
                        color,
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {questao.tipo}
                    </span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#B1B4BD" }}>
                      Questão {questao.numero}
                    </span>
                  </div>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px", color: "#6B6FA3" }}>
                    {questao.titulo}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181", marginTop: "4px" }}>
                    {questao.totalSubmissoes} submissões
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#F2F2F2" }}>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#05245F" }}>
                    {questao.corrigidas}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6A7181" }}>
                    Corrigidas
                  </p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#F2F2F2" }}>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#FF6B6B" }}>
                    {questao.pendentes}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6A7181" }}>
                    Pendentes
                  </p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#F2F2F2" }}>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#6B6FA3" }}>
                    {questao.progresso}%
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6A7181" }}>
                    Progresso
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full rounded-full h-1.5" style={{ backgroundColor: "#E5E7EB" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${questao.progresso}%`, backgroundColor: "#6B6FA3" }}
                />
              </div>
            </button>
          );
        })
        )}
      </div>

      {/* Modal de correção completa */}
      <CorrecaoCompletaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCorrection}
        onContinue={handleContinueCorrection}
      />

      {/* Notificação de sucesso */}
      <SuccessNotification
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        message="Correção salva com sucesso!"
      />
    </div>
  );
}
