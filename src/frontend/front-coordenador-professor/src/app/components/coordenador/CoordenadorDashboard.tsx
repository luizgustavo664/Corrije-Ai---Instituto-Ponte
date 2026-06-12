import { useState } from "react";
import {
  Squares2X2Icon,
  DocumentTextIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import imgLogo from "../../../imports/logo-new.png";
import { PainelPage } from "../professor/PainelPage";
import { ProvasPage } from "../professor/ProvasPage";
import { BancoQuestoesPage } from "../professor/BancoQuestoesPage";
import { CorrecaoPage } from "../professor/CorrecaoPage";
import { LiberacaoNotasPage } from "../professor/LiberacaoNotasPage";
import { NovaProvaPage } from "../professor/NovaProvaPage";
import { ProvaDetailPage } from "../professor/ProvaDetailPage";
import type { Question } from "../professor/ProvaDetailPage";
import { NovaQuestaoPage } from "../professor/NovaQuestaoPage";
import { QuestaoCorrecaoPage } from "../professor/QuestaoCorrecaoPage";
import { ProvaQuestoesCorrecaoPage } from "../professor/ProvaQuestoesCorrecaoPage";
import { GestaoProfessoresPage, type Professor } from "./GestaoProfessoresPage";
import { GestaoAlunosPage, type Aluno } from "./GestaoAlunosPage";
import { PerfilAlunoPage } from "./PerfilAlunoPage";
import { PerfilProfessorPage } from "./PerfilProfessorPage";
import { defaultExams } from "../professor/examTypes";
import type { Exam } from "../professor/examTypes";
import { bancoQuestoes as defaultBancoQuestoes } from "../professor/bancoQuestoesData";
import type { BancoQuestion } from "../professor/bancoQuestoesData";

type Tab =
  | "painel"
  | "provas"
  | "banco"
  | "correcao"
  | "liberacao"
  | "gestao-professores"
  | "gestao-alunos"
  | "perfil-aluno"
  | "perfil-professor"
  | "nova-prova"
  | "prova-detail"
  | "nova-questao"
  | "nova-questao-banco"
  | "questao-correcao"
  | "prova-questoes-correcao";

interface Props {
  onLogout: () => void;
}

const navItems: { id: Tab; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "painel", label: "Painel", Icon: Squares2X2Icon },
  { id: "provas", label: "Provas", Icon: DocumentTextIcon },
  { id: "banco", label: "Banco de Questões", Icon: CircleStackIcon },
  { id: "correcao", label: "Correção", Icon: ClipboardDocumentCheckIcon },
  { id: "liberacao", label: "Liberação das Notas", Icon: PaperAirplaneIcon },
  { id: "gestao-professores", label: "Gestão de Professores", Icon: UserGroupIcon },
  { id: "gestao-alunos", label: "Gestão de Alunos", Icon: UserIcon },
];

// Lista inicial de alunos (10 alunos)
const initialAlunos: Aluno[] = [
  { id: 1, nome: "Lucas Henrique Martins", cpf: "123.987.456-78", provasFeitas: 12, media: 8.7 },
  { id: 2, nome: "Isabela Cristina Souza", cpf: "987.321.654-90", provasFeitas: 8, media: 9.2 },
  { id: 3, nome: "Gabriel Fernando Costa", cpf: "456.123.789-01", provasFeitas: 15, media: 7.4 },
  { id: 4, nome: "Beatriz Oliveira Santos", cpf: "321.456.987-12", provasFeitas: 10, media: 9.1 },
  { id: 5, nome: "Pedro Augusto Lima", cpf: "789.654.321-23", provasFeitas: 14, media: 8.5 },
  { id: 6, nome: "Mariana Silva Alves", cpf: "654.789.123-34", provasFeitas: 11, media: 9.3 },
  { id: 7, nome: "Rafael dos Santos Rocha", cpf: "147.369.258-45", provasFeitas: 9, media: 7.8 },
  { id: 8, nome: "Amanda Carolina Dias", cpf: "258.147.369-56", provasFeitas: 13, media: 8.9 },
  { id: 9, nome: "Thiago Roberto Freitas", cpf: "369.258.147-67", provasFeitas: 7, media: 6.9 },
  { id: 10, nome: "Julia Fernanda Rodrigues", cpf: "741.963.852-78", provasFeitas: 16, media: 9.4 },
];

const initialProfessores: Professor[] = [
  { id: 1, nome: "Dr. Carlos Alberto Silva", cpf: "123.456.789-10", provasCriadas: 18 },
  { id: 2, nome: "Profª Maria Helena Santos", cpf: "987.654.321-00", provasCriadas: 24 },
  { id: 3, nome: "Dr. João Pedro Oliveira", cpf: "456.789.123-45", provasCriadas: 15 },
  { id: 4, nome: "Profª Ana Beatriz Costa", cpf: "321.654.987-22", provasCriadas: 21 },
  { id: 5, nome: "Dr. Ricardo Mendes Lima", cpf: "789.123.456-33", provasCriadas: 19 },
  { id: 6, nome: "Profª Fernanda Souza Alves", cpf: "654.987.321-88", provasCriadas: 16 },
  { id: 7, nome: "Dr. Rafael Campos Rocha", cpf: "147.258.369-99", provasCriadas: 22 },
  { id: 8, nome: "Profª Juliana Martins Dias", cpf: "258.369.147-77", provasCriadas: 20 },
  { id: 9, nome: "Dr. Paulo Roberto Freitas", cpf: "369.147.258-66", provasCriadas: 13 },
  { id: 10, nome: "Profª Camila Rodrigues", cpf: "741.852.963-55", provasCriadas: 17 },
];

export function CoordenadorDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("painel");
  const [exams, setExams] = useState<Exam[]>(defaultExams);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<"Alternativa" | "V/F" | "Discursiva">("Discursiva");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [bancoQuestoes, setBancoQuestoes] = useState<BancoQuestion[]>(defaultBancoQuestoes);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [alunos, setAlunos] = useState(initialAlunos);
  const [professores, setProfessores] = useState(initialProfessores);

  function addExam(exam: Exam) {
    setExams((prev) => [exam, ...prev]);
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

  function addBancoQuestion(q: Question) {
    const newBancoQuestion: BancoQuestion = {
      id: bancoQuestoes.length > 0 ? Math.max(...bancoQuestoes.map(bq => bq.id)) + 1 : 1,
      type: q.type,
      materia: "Matéria Geral",
      semestre: "1º Semestre",
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
      case "gestao-professores":
        return <GestaoProfessoresPage
          onNavigateToProfile={() => setActiveTab("perfil-professor")}
          professores={professores}
          setProfessores={setProfessores}
        />;
      case "gestao-alunos":
        return <GestaoAlunosPage
          onNavigateToProfile={() => setActiveTab("perfil-aluno")}
          alunos={alunos}
          setAlunos={setAlunos}
        />;
      case "perfil-aluno":
        return <PerfilAlunoPage onBack={() => setActiveTab("gestao-alunos")} />;
      case "perfil-professor":
        return <PerfilProfessorPage onBack={() => setActiveTab("gestao-professores")} />;
      case "nova-prova":
        return <NovaProvaPage onBack={() => setActiveTab("provas")} onSave={addExam} />;
      case "nova-questao":
        return <NovaQuestaoPage onBack={() => setActiveTab("prova-detail")} onSave={addQuestion} />;
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
      default:
        return <PainelPage onNavigate={(tab) => setActiveTab(tab as Tab)} />;
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
        <nav className="flex flex-col gap-1 px-3 py-3 flex-1 overflow-y-auto">
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