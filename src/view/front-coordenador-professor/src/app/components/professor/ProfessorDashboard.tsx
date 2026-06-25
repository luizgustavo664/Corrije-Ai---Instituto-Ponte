import { useEffect, useState } from "react";
import {
  Squares2X2Icon,
  DocumentTextIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  PaperAirplaneIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import imgLogo from "../../../imports/logo-new.png";
import { PainelPage } from "./PainelPage";
import { ProvasPage } from "./ProvasPage";
import { BancoQuestoesPage } from "./BancoQuestoesPage";
import { CorrecaoPage } from "./CorrecaoPage";
import { LiberacaoNotasPage } from "./LiberacaoNotasPage";
import { NovaProvaPage } from "./NovaProvaPage";
import { ProvaDetailPage } from "./ProvaDetailPage";
import { NovaQuestaoPage } from "./NovaQuestaoPage";
import { QuestaoCorrecaoPage } from "./QuestaoCorrecaoPage";
import { ProvaQuestoesCorrecaoPage } from "./ProvaQuestoesCorrecaoPage";
import { CorrecaoAlunoPage } from "./CorrecaoAlunoPage";
import { useDashboard } from "../../../../../src/features/dashboard/useDashboard";

export type ProfessorTab = "painel" | "provas" | "banco" | "correcao" | "liberacao" | "nova-prova" | "prova-detail" | "nova-questao" | "nova-questao-banco" | "questao-correcao" | "prova-questoes-correcao" | "correcao-aluno";

interface Props {
  onLogout: () => void;
  initialTab?: ProfessorTab;
  onNavigateTab?: (tab: ProfessorTab) => void;
}

const navItems: { id: ProfessorTab; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "painel", label: "Painel", Icon: Squares2X2Icon },
  { id: "provas", label: "Provas", Icon: DocumentTextIcon },
  { id: "banco", label: "Banco de Questões", Icon: CircleStackIcon },
  { id: "correcao", label: "Correção", Icon: ClipboardDocumentCheckIcon },
  { id: "liberacao", label: "Liberação das Notas", Icon: PaperAirplaneIcon },
];

export function ProfessorDashboard({ onLogout, initialTab = "painel", onNavigateTab }: Props) {
  const [activeTab, setActiveTabState] = useState<ProfessorTab>(initialTab);
  const [, setCurrentQuestionType] = useState<"Alternativa" | "V/F" | "Discursiva">("Discursiva");
  const [, setCurrentQuestionIndex] = useState(0);

  const {
    materiasQuery,
    questoesQuery,
    bancoQuestoes,
    selectedExamId,
    provaDetailQuery,
    provaQuestoesQuery,
    exams,
    examQuestions,
    currentQuestaoId,
    setCurrentQuestaoId,
    selectedExam,
    setSelectedExam,
    showPublishModal,
    setShowPublishModal,
    showCompletionModal,
    setShowCompletionModal,
    createProvaMutation,
    updateProvaMutation,
    publicarProvaMutation,
    createQuestaoMutation,
    updateQuestaoMutation,
    deleteQuestaoMutation,
    addQuestaoProvaMutation,
    removeQuestaoProvaMutation,
    addExam,
    updateExam,
    deleteExam,
    arquivarExam,
    publishSelectedExam,
    addQuestions,
    deleteQuestion,
    updateQuestion,
    addBancoQuestion,
    createQuestionForSelectedExam,
    updateBancoQuestion,
    deleteBancoQuestion,
    addQuestionToExam,
  } = useDashboard();

  useEffect(() => {
    setActiveTabState(initialTab);
  }, [initialTab]);

  const setActiveTab = (tab: ProfessorTab) => {
    setActiveTabState(tab);
    onNavigateTab?.(tab);
  };

  const renderPage = () => {
    switch (activeTab) {
      case "painel":
        return (
          <PainelPage
            onNavigate={(tab, exam) => {
              if (exam) setSelectedExam(exam);
              setActiveTab(tab as ProfessorTab);
            }}
            exams={exams}
          />
        );
      case "provas":
        return (
          <ProvasPage
            onNavigate={(tab, exam) => {
              if (exam) setSelectedExam(exam);
              setActiveTab(tab as ProfessorTab);
            }}
            exams={exams}
            onDeleteExam={deleteExam}
            onArchiveExam={arquivarExam}
          />
        );
      case "prova-detail":
        return (
          <ProvaDetailPage
            onBack={() => setActiveTab("provas")}
            onNavigate={(tab) => setActiveTab(tab as ProfessorTab)}
            questions={examQuestions}
            onDeleteQuestion={deleteQuestion}
            onUpdateQuestion={updateQuestion}
            onAddQuestions={addQuestions}
            bancoQuestoes={bancoQuestoes}
            examTitle={selectedExam?.title || "Título da Prova"}
            examSubject={selectedExam?.subject || "Matéria"}
            examSemester={selectedExam?.semester || "Semestre"}
            examTurma={selectedExam?.turma}
            examModalidade={selectedExam?.modalidade}
            examTempoProva={selectedExam?.tempoProva}
            examDataInicio={selectedExam?.dataInicio}
            examDataLimite={selectedExam?.dataLimite}
            examOrientacoes={selectedExam?.orientacoes}
            selectedExam={selectedExam ?? undefined}
            onUpdateExam={updateExam}
            onPublish={publishSelectedExam}
            showPublishModal={showPublishModal}
            onClosePublishModal={() => setShowPublishModal(false)}
            isLoading={provaDetailQuery.isLoading || provaQuestoesQuery.isLoading}
            errorMessage={
              provaDetailQuery.isError
                ? provaDetailQuery.error.message
                : provaQuestoesQuery.isError
                  ? provaQuestoesQuery.error.message
                  : addQuestaoProvaMutation.isError
                    ? addQuestaoProvaMutation.error.message
                    : removeQuestaoProvaMutation.isError
                      ? removeQuestaoProvaMutation.error.message
                      : publicarProvaMutation.isError
                        ? publicarProvaMutation.error.message
                  : undefined
            }
            isPublishing={publicarProvaMutation.isPending}
            isUpdatingExam={updateProvaMutation.isPending}
            updateExamErrorMessage={
              updateProvaMutation.isError ? updateProvaMutation.error.message : undefined
            }
          />
        );
      case "banco":
        return (
          <BancoQuestoesPage
            onNavigate={(tab) => setActiveTab(tab as ProfessorTab)}
            bancoQuestoes={bancoQuestoes}
            onUpdateQuestion={updateBancoQuestion}
            onDeleteQuestion={deleteBancoQuestion}
            provas={exams}
            onAddToProva={addQuestionToExam}
            isLoading={questoesQuery.isLoading}
            errorMessage={
              questoesQuery.isError
                ? questoesQuery.error.message
                : updateQuestaoMutation.isError
                  ? updateQuestaoMutation.error.message
                  : deleteQuestaoMutation.isError
                    ? deleteQuestaoMutation.error.message
                    : addQuestaoProvaMutation.isError
                      ? addQuestaoProvaMutation.error.message
                      : undefined
            }
          />
        );
      case "correcao":
        return <CorrecaoPage onNavigate={(tab, exam) => {
          if (exam) setSelectedExam(exam);
          setActiveTab(tab as ProfessorTab);
        }} exams={exams} />;
      case "liberacao":
        return <LiberacaoNotasPage exams={exams} />;
      case "nova-prova":
        return (
          <NovaProvaPage
            onBack={() => setActiveTab("provas")}
            onSave={addExam}
            materias={materiasQuery.data ?? []}
            isSaving={createProvaMutation.isPending}
            errorMessage={
              createProvaMutation.isError
                ? createProvaMutation.error.message
                : materiasQuery.isError
                  ? materiasQuery.error.message
                  : undefined
            }
          />
        );
      case "nova-questao":
        return (
          <NovaQuestaoPage
            onBack={() => setActiveTab("prova-detail")}
            onSave={createQuestionForSelectedExam}
            materias={materiasQuery.data ?? []}
            defaultMateriaId={selectedExam?.materiaId}
            isSaving={createQuestaoMutation.isPending || addQuestaoProvaMutation.isPending}
            errorMessage={
              createQuestaoMutation.isError
                ? createQuestaoMutation.error.message
                : addQuestaoProvaMutation.isError
                  ? addQuestaoProvaMutation.error.message
                  : materiasQuery.isError
                    ? materiasQuery.error.message
                    : undefined
            }
          />
        );
      case "correcao-aluno":
        return selectedExam ? (
          <CorrecaoAlunoPage
            onBack={() => setActiveTab("correcao")}
            provaId={selectedExamId}
            examTitle={selectedExam.title}
          />
        ) : null;
      case "nova-questao-banco":
        return (
          <NovaQuestaoPage
            onBack={() => setActiveTab("banco")}
            onSave={addBancoQuestion}
            materias={materiasQuery.data ?? []}
            isSaving={createQuestaoMutation.isPending}
            errorMessage={
              createQuestaoMutation.isError
                ? createQuestaoMutation.error.message
                : materiasQuery.isError
                  ? materiasQuery.error.message
                  : undefined
            }
          />
        );
      case "prova-questoes-correcao":
        return <ProvaQuestoesCorrecaoPage
          onBack={() => setActiveTab("correcao")}
          onNavigateToQuestion={(id, type) => {
            const questionIdx = examQuestions.findIndex(q => q.id === id);
            setCurrentQuestionIndex(questionIdx);
            setCurrentQuestionType(type);
            setCurrentQuestaoId(id);
            setActiveTab("questao-correcao");
          }}
          provaId={selectedExamId}
          examTitle={selectedExam?.title || "Título da Prova — Semestre"}
          showCompletionModal={showCompletionModal}
          onResetCompletionModal={() => setShowCompletionModal(false)}
        />;
      case "questao-correcao":
        return <QuestaoCorrecaoPage
          onBack={() => {
            setActiveTab("prova-questoes-correcao");
          }}
          onAllCorrected={() => {
            setShowCompletionModal(true);
            setActiveTab("prova-questoes-correcao");
          }}
          provaId={selectedExamId}
          questaoId={currentQuestaoId}
        />;
    }
  };

  return (
    <div className="h-screen overflow-hidden flex" style={{ backgroundColor: "#F2F2F2" }}>
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: 240,
          backgroundColor: "#fff",
          borderRight: "1px solid #D7D7D9",
        }}
      >
        <div className="flex items-center justify-center px-4 py-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 80, height: 80 }}
          >
            <img src={imgLogo} alt="Logo" style={{ width: 120, height: 120, objectFit: "contain" }} />
          </div>
        </div>

        <div style={{ borderTop: "1px solid #D7D7D9" }} />

        <nav className="flex flex-col gap-1 px-3 py-3 flex-1">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all hover:opacity-85"
                style={{
                  backgroundColor: isActive ? "#F9B233" : "transparent",
                  color: isActive ? "#6B6FA3" : "#6A7181",
                }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color: isActive ? "#6B6FA3" : "#6A7181" }} />
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: isActive ? 600 : 400, fontSize: "13px" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid #D7D7D9" }} />

        <div className="px-3 py-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left hover:opacity-85 transition-opacity"
            style={{ color: "#6A7181" }}
          >
            <ArrowRightOnRectangleIcon className="w-[18px] h-[18px]" style={{ color: "#6A7181" }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "13px", color: "#6A7181" }}>
              Sair
            </span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
