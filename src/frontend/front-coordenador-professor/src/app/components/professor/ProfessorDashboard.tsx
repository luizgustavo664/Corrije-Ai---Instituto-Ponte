import { useState } from "react";
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
import type { Question } from "./ProvaDetailPage";
import { NovaQuestaoPage } from "./NovaQuestaoPage";
import { QuestaoCorrecaoPage } from "./QuestaoCorrecaoPage";
import { ProvaQuestoesCorrecaoPage } from "./ProvaQuestoesCorrecaoPage";
import { CorrecaoAlunoPage } from "./CorrecaoAlunoPage";
import { defaultExams } from "./examTypes";
import type { Exam } from "./examTypes";
import { bancoQuestoes as defaultBancoQuestoes } from "./bancoQuestoesData";
import type { BancoQuestion } from "./bancoQuestoesData";

type Tab = "painel" | "provas" | "banco" | "correcao" | "liberacao" | "nova-prova" | "prova-detail" | "nova-questao" | "nova-questao-banco" | "questao-correcao" | "prova-questoes-correcao" | "correcao-aluno";

interface Props {
  onLogout: () => void;
}

const navItems: { id: Tab; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "painel", label: "Painel", Icon: Squares2X2Icon },
  { id: "provas", label: "Provas", Icon: DocumentTextIcon },
  { id: "banco", label: "Banco de Questões", Icon: CircleStackIcon },
  { id: "correcao", label: "Correção", Icon: ClipboardDocumentCheckIcon },
  { id: "liberacao", label: "Liberação das Notas", Icon: PaperAirplaneIcon },
];

export function ProfessorDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("painel");
  const [exams, setExams] = useState<Exam[]>(defaultExams);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<"Alternativa" | "V/F" | "Discursiva">("Discursiva");
  const [bancoQuestoes, setBancoQuestoes] = useState<BancoQuestion[]>(defaultBancoQuestoes);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  function addExam(exam: Exam) {
    setExams((prev) => [exam, ...prev]);
  }

  function updateExam(exam: Exam) {
    setExams((prev) => prev.map((e) => (e.id === exam.id ? exam : e)));
    setSelectedExam(exam);
  }

  function deleteExam(id: number) {
    setExams((prev) => prev.filter((e) => e.id !== id));
  }

  function addQuestion(q: Question) {
    setExamQuestions((prev) => [...prev, { ...q, id: prev.length + 1 }]);
  }

  function addQuestions(questions: Question[]) {
    setExamQuestions((prev) => {
      const maxId = prev.length > 0 ? Math.max(...prev.map(q => q.id)) : 0;
      return [...prev, ...questions.map((q, i) => ({ ...q, id: maxId + i + 1 }))];
    });
  }

  function deleteQuestion(id: number) {
    setExamQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(question: Question) {
    setExamQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? question : q))
    );
  }

  function addBancoQuestion(q: Question, materia?: string, semestre?: string) {
    const newBancoQuestion: BancoQuestion = {
      id: bancoQuestoes.length > 0 ? Math.max(...bancoQuestoes.map(bq => bq.id)) + 1 : 1,
      type: q.type,
      materia: materia || "Matéria Geral",
      semestre: semestre || "1º Semestre",
      dificuldade: "Média",
      text: q.text,
      options: q.options,
      answer: q.answer,
      timesUsed: 0,
      successRate: 0,
    };
    setBancoQuestoes((prev) => [newBancoQuestion, ...prev]);
  }

  function updateBancoQuestion(questao: BancoQuestion) {
    setBancoQuestoes((prev) =>
      prev.map((q) => (q.id === questao.id ? questao : q))
    );
  }

  function deleteBancoQuestion(id: number) {
    setBancoQuestoes((prev) => prev.filter((q) => q.id !== id));
  }

  function addQuestionToExam(provaId: number, bancoQ: BancoQuestion) {
    const newQuestion: Question = {
      id: examQuestions.length > 0 ? Math.max(...examQuestions.map(q => q.id)) + 1 : 1,
      type: bancoQ.type,
      text: bancoQ.text,
      options: bancoQ.options,
      answer: bancoQ.answer,
    };
    addQuestions([newQuestion]);
  }

  const renderPage = () => {
    switch (activeTab) {
      case "painel":
        return <PainelPage onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case "provas":
        return <ProvasPage onNavigate={(tab, exam) => {
          if (exam) setSelectedExam(exam);
          setActiveTab(tab as Tab);
        }} exams={exams} onDeleteExam={deleteExam} />;
      case "prova-detail":
        return (
          <ProvaDetailPage
            onBack={() => setActiveTab("provas")}
            onNavigate={(tab) => setActiveTab(tab as Tab)}
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
            examDataLimite={selectedExam?.dataLimite}
            examOrientacoes={selectedExam?.orientacoes}
            selectedExam={selectedExam ?? undefined}
            onUpdateExam={updateExam}
          />
        );
      case "banco":
        return <BancoQuestoesPage onNavigate={(tab) => setActiveTab(tab as Tab)} bancoQuestoes={bancoQuestoes} onUpdateQuestion={updateBancoQuestion} onDeleteQuestion={deleteBancoQuestion} provas={exams} onAddToProva={addQuestionToExam} />;
      case "correcao":
        return <CorrecaoPage onNavigate={(tab, exam) => {
          if (exam) setSelectedExam(exam);
          setActiveTab(tab as Tab);
        }} exams={exams} />;
      case "liberacao":
        return <LiberacaoNotasPage exams={exams} />;
      case "nova-prova":
        return <NovaProvaPage onBack={() => setActiveTab("provas")} onSave={addExam} />;
      case "nova-questao":
        return <NovaQuestaoPage onBack={() => setActiveTab("prova-detail")} onSave={(q) => {
          addQuestion(q);
          addBancoQuestion(q, selectedExam?.subject, selectedExam?.semester);
        }} />;
      case "correcao-aluno":
        return selectedExam ? (
          <CorrecaoAlunoPage
            onBack={() => setActiveTab("correcao")}
            exam={selectedExam}
            questions={examQuestions}
          />
        ) : null;
      case "nova-questao-banco":
        return <NovaQuestaoPage onBack={() => setActiveTab("banco")} onSave={(q) => { addBancoQuestion(q); setActiveTab("banco"); }} />;
      case "prova-questoes-correcao":
        return <ProvaQuestoesCorrecaoPage
          onBack={() => setActiveTab("correcao")}
          onNavigateToQuestion={(id, type) => {
            const questionIdx = examQuestions.findIndex(q => q.id === id);
            setCurrentQuestionIndex(questionIdx);
            setCurrentQuestionType(type);
            setActiveTab("questao-correcao");
          }}
          questions={examQuestions}
          examTitle={selectedExam?.title || "Título da Prova — Semestre"}
          totalSubmissions={selectedExam?.submissions ? parseInt(selectedExam.submissions) : 48}
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
          questionType={currentQuestionType}
          correctAnswer={currentQuestionType === "Alternativa" ? "B" : "Verdadeiro"}
        />;
    }
  };

  return (
    <div className="h-screen overflow-hidden flex" style={{ backgroundColor: "#F2F2F2" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: 240,
          backgroundColor: "#fff",
          borderRight: "1px solid #D7D7D9",
        }}
      >
        {/* Logo section */}
        <div className="flex items-center justify-center px-4 py-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 80, height: 80 }}
          >
            <img src={imgLogo} alt="Logo" style={{ width: 120, height: 120, objectFit: "contain" }} />
          </div>
        </div>

        {/* Top divider */}
        <div style={{ borderTop: "1px solid #D7D7D9" }} />

        {/* Nav items */}
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

        {/* Bottom divider */}
        <div style={{ borderTop: "1px solid #D7D7D9" }} />

        {/* Logout */}
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}