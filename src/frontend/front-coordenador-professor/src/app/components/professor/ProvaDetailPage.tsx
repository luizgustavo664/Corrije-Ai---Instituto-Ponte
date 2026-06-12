import { useState, useEffect } from "react";
import {
  ChevronLeftIcon, ShareIcon, PlusIcon, Bars2Icon, PencilIcon, TrashIcon,
  CheckCircleIcon, ClockIcon, CalendarDaysIcon, AcademicCapIcon, BookOpenIcon,
  UsersIcon, XMarkIcon, BookmarkIcon, DocumentTextIcon, AcademicCapIcon as SemesterIcon,
} from "@heroicons/react/24/outline";
import { CompartilharModal } from "./CompartilharModal";
import { SelecionarOrigemQuestaoModal } from "./SelecionarOrigemQuestaoModal";
import { SelecionarDoBancoModal } from "./SelecionarDoBancoModal";
import { EditarQuestaoProvaModal } from "./EditarQuestaoProvaModal";
import type { BancoQuestion } from "./bancoQuestoesData";
import type { Exam } from "./examTypes";

interface Props {
  onBack: () => void;
  onNavigate?: (tab: string) => void;
  questions: Question[];
  onDeleteQuestion?: (id: number) => void;
  onUpdateQuestion?: (question: Question) => void;
  onAddQuestions?: (questions: Question[]) => void;
  bancoQuestoes?: BancoQuestion[];
  examTitle?: string;
  examSubject?: string;
  examSemester?: string;
  examTurma?: string;
  examModalidade?: string;
  examTempoProva?: number;
  examDataLimite?: string;
  examOrientacoes?: string;
  selectedExam?: Exam;
  onUpdateExam?: (exam: Exam) => void;
}

type TabId = "questoes" | "submissoes" | "respostas" | "configuracoes";

const tabs: { id: TabId; label: string }[] = [
  { id: "questoes", label: "Questões" },
  { id: "submissoes", label: "Submissões" },
  { id: "respostas", label: "Respostas por questão" },
  { id: "configuracoes", label: "Configurações" },
];

export type QuestionType = "Alternativa" | "V/F" | "Discursiva";

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: { letter: string; text: string; correct: boolean }[];
  answer?: string;
}

export const defaultQuestions: Question[] = [
  {
    id: 1,
    type: "Alternativa",
    text: "Enunciado da questão de número N",
    options: [
      { letter: "A", text: "Valor da alternativa A", correct: true },
      { letter: "B", text: "Valor da alternativa B", correct: false },
      { letter: "C", text: "Valor da alternativa C", correct: false },
      { letter: "D", text: "Valor da alternativa D", correct: false },
    ],
  },
  {
    id: 2,
    type: "V/F",
    text: "Enunciado da questão de verdadeiro ou falso",
    answer: "Verdadeiro",
  },
  {
    id: 3,
    type: "Discursiva",
    text: "Enunciado da questão discursiva",
    answer: "Gabarito: texto esperado como resposta",
  },
];

const typeColors: Record<QuestionType, { bg: string; color: string }> = {
  Alternativa: { bg: "#EEF1F8", color: "#6B6FA3" },
  "V/F": { bg: "#E6FAF8", color: "#05245F" },
  Discursiva: { bg: "#FFF8E0", color: "#B07D00" },
};

const modalidades = ["Prova", "Trabalho", "Atividade", "Simulado"];
const semestres = ["1º Semestre 2026", "2º Semestre 2025", "1º Semestre 2025", "2º Semestre 2024"];
const duracoes = [
  { label: "30 minutos", value: 30 },
  { label: "45 minutos", value: 45 },
  { label: "1 hora", value: 60 },
  { label: "1h 30min", value: 90 },
  { label: "2 horas", value: 120 },
  { label: "2h 30min", value: 150 },
  { label: "3 horas", value: 180 },
  { label: "4 horas", value: 240 },
  { label: "Sem limite de tempo", value: 0 },
];

function formatTempo(minutos?: number): string {
  if (minutos == null) return "Não definido";
  if (minutos === 0) return "Sem limite";
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatDataLimite(iso?: string): string {
  if (!iso) return "Não definida";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  backgroundColor: "#F2F3F5",
  border: "1px solid transparent",
  borderRadius: 8,
  padding: "0 13px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#111",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  color: "#111",
  marginBottom: 4,
  display: "block",
};

const chevron = (
  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width={16} height={16} viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6B6B6B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function TypeBadge({ type }: { type: QuestionType }) {
  const { bg, color } = typeColors[type];
  return (
    <span className="px-2 py-0.5 rounded-md shrink-0" style={{ backgroundColor: bg, color, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600 }}>
      {type}
    </span>
  );
}

function PointsBadge() {
  return (
    <span className="px-2 py-0.5 rounded-md shrink-0" style={{ backgroundColor: "#F2F2F2", color: "#6A7181", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500 }}>
      Pontuação: 1,0
    </span>
  );
}

function QuestionCard({ question, onDelete, onEdit }: { question: Question; onDelete?: () => void; onEdit?: () => void }) {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-3 items-start" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #EBEBEB" }}>
      <Bars2Icon className="w-[18px] h-[18px] shrink-0 mt-0.5 cursor-grab" style={{ color: "#B1B4BD" }} />
      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 26, height: 26, backgroundColor: "#EEF1F8" }}>
        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#6B6FA3" }}>{question.id}</span>
      </div>
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex gap-2 flex-wrap">
          <TypeBadge type={question.type} />
          <PointsBadge />
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#111" }}>{question.text}</p>
        {question.options && (
          <div className="flex flex-col gap-1.5">
            {question.options.map((opt) => (
              <div key={opt.letter} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: opt.correct ? "#6B6FA3" : "#F2F3F5" }}>
                {opt.correct && <CheckCircleIcon className="w-[14px] h-[14px] shrink-0" style={{ color: "#F9B233" }} />}
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: opt.correct ? "#fff" : "#333" }}>
                  <strong>{opt.letter})</strong>&nbsp;&nbsp;{opt.text}
                </p>
              </div>
            ))}
          </div>
        )}
        {question.answer && (
          <p className="px-3 py-2 rounded-xl" style={{ backgroundColor: "#F2F3F5", fontFamily: "Inter, sans-serif", fontSize: 12, color: "#333" }}>
            <span style={{ fontWeight: 600 }}>Resposta: </span>{question.answer}
          </p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ backgroundColor: "#EEF1F8" }}>
          <PencilIcon className="w-[14px] h-[14px]" style={{ color: "#6B6FA3" }} />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ backgroundColor: "#FEE2E2" }}>
          <TrashIcon className="w-[14px] h-[14px]" style={{ color: "#EF4444" }} />
        </button>
      </div>
    </div>
  );
}

interface EditModalProps {
  exam: Exam;
  onClose: () => void;
  onSave: (exam: Exam) => void;
}

function EditarDadosProvaModal({ exam, onClose, onSave }: EditModalProps) {
  const [nome, setNome] = useState(exam.title);
  const [modalidade, setModalidade] = useState(exam.modalidade || "");
  const [disciplina, setDisciplina] = useState(exam.discipline || "");
  const [turma, setTurma] = useState(exam.turma || "");
  const [semestre, setSemestre] = useState(exam.semester || "");
  const [tempoProva, setTempoProva] = useState(exam.tempoProva != null ? String(exam.tempoProva) : "");
  const [dataLimite, setDataLimite] = useState(exam.dataLimite || "");
  const [orientacoes, setOrientacoes] = useState(exam.orientacoes || "");

  const canSave = nome.trim() !== "";
  const minDatetime = new Date().toISOString().slice(0, 16);

  function handleSave() {
    if (!canSave) return;
    onSave({
      ...exam,
      title: nome.trim(),
      modalidade: modalidade || exam.modalidade,
      discipline: disciplina,
      subject: disciplina,
      turma,
      semester: semestre || exam.semester,
      tempoProva: tempoProva !== "" ? Number(tempoProva) : undefined,
      dataLimite: dataLimite || undefined,
      orientacoes: orientacoes.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl flex flex-col w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" style={{ border: "1px solid #E6E6E6", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid #E6E6E6" }}>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#111" }}>Editar Dados da Prova</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ backgroundColor: "#F2F3F5" }}>
            <XMarkIcon className="w-5 h-5" style={{ color: "#6B6B6B" }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-8 py-6">
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label style={labelStyle}>Nome da Prova *</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Prova de Cálculo — 1ª Unidade" style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }} />
          </div>

          {/* Modalidade + Disciplina */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label style={labelStyle}>Modalidade</label>
              <div className="relative w-full">
                <select value={modalidade} onChange={(e) => setModalidade(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}>
                  <option value="">Selecionar</option>
                  {modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {chevron}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label style={labelStyle}>Disciplina</label>
              <input type="text" value={disciplina} onChange={(e) => setDisciplina(e.target.value)} placeholder="Ex: Matemática" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }} />
            </div>
          </div>

          {/* Turma + Semestre */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label style={labelStyle}>Turma</label>
              <input type="text" value={turma} onChange={(e) => setTurma(e.target.value)} placeholder="Ex: 3ºA" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }} />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label style={labelStyle}>Semestre</label>
              <div className="relative w-full">
                <select value={semestre} onChange={(e) => setSemestre(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}>
                  <option value="">Selecionar</option>
                  {semestres.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {chevron}
              </div>
            </div>
          </div>

          {/* Tempo + Data limite */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label style={labelStyle} className="flex items-center gap-1.5">
                <ClockIcon style={{ width: 14, height: 14, color: "#05245F" }} />
                Tempo de Prova
              </label>
              <div className="relative w-full">
                <select value={tempoProva} onChange={(e) => setTempoProva(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}>
                  <option value="">Selecionar duração</option>
                  {duracoes.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                {chevron}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label style={labelStyle} className="flex items-center gap-1.5">
                <CalendarDaysIcon style={{ width: 14, height: 14, color: "#05245F" }} />
                Data e Hora Limite
              </label>
              <input type="datetime-local" value={dataLimite} min={minDatetime} onChange={(e) => setDataLimite(e.target.value)} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }} />
            </div>
          </div>

          {/* Orientações */}
          <div className="flex flex-col gap-1">
            <label style={labelStyle}>Orientações (opcional)</label>
            <textarea rows={4} value={orientacoes} onChange={(e) => setOrientacoes(e.target.value)} placeholder="Instruções gerais para os alunos..."
              style={{ width: "100%", backgroundColor: "#F2F3F5", border: "1px solid transparent", borderRadius: 8, padding: "10px 13px", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#111", outline: "none", resize: "none" }}
              onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5" style={{ borderTop: "1px solid #E6E6E6" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ border: "1px solid #E6E6E6", backgroundColor: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#111" }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!canSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-opacity"
            style={{ backgroundColor: canSave ? "#6B6FA3" : "#B1B4BD", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#fff", cursor: canSave ? "pointer" : "not-allowed" }}>
            <BookmarkIcon className="w-[15px] h-[15px]" style={{ color: "#fff" }} />
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProvaDetailPage({
  onBack, onNavigate, questions, onDeleteQuestion, onUpdateQuestion, onAddQuestions,
  bancoQuestoes = [], examTitle = "Título da Prova", examSubject = "", examSemester = "",
  examTurma, examModalidade, examTempoProva, examDataLimite, examOrientacoes,
  selectedExam, onUpdateExam,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("questoes");
  const [showPublish, setShowPublish] = useState(false);
  const [showOrigemModal, setShowOrigemModal] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditExam, setShowEditExam] = useState(false);

  // Estado local do exam — fonte da verdade para exibição nesta página
  const buildExamFromProps = (): Exam => selectedExam ?? {
    id: 0,
    title: examTitle,
    modalidade: examModalidade || "",
    discipline: examSubject,
    subject: examSubject,
    turma: examTurma || "",
    semester: examSemester,
    badge: "Rascunho",
    submissions: "0",
    tempoProva: examTempoProva,
    dataLimite: examDataLimite,
    orientacoes: examOrientacoes,
  };

  const [localExam, setLocalExam] = useState<Exam>(buildExamFromProps);

  // Sincroniza quando selectedExam muda (ex: ao entrar na página de uma prova diferente)
  useEffect(() => {
    setLocalExam(buildExamFromProps());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExam?.id]);

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    onUpdateQuestion?.(updatedQuestion);
    setEditingQuestion(null);
  };

  const infoCards = [
    { icon: <BookOpenIcon className="w-4 h-4" style={{ color: "#05245F" }} />, label: "Modalidade", value: localExam.modalidade || "—" },
    { icon: <AcademicCapIcon className="w-4 h-4" style={{ color: "#05245F" }} />, label: "Disciplina", value: localExam.subject || "—" },
    { icon: <UsersIcon className="w-4 h-4" style={{ color: "#05245F" }} />, label: "Turma", value: localExam.turma || "—" },
    { icon: <SemesterIcon className="w-4 h-4" style={{ color: "#05245F" }} />, label: "Semestre", value: localExam.semester || "—" },
    { icon: <ClockIcon className="w-4 h-4" style={{ color: "#05245F" }} />, label: "Tempo de prova", value: formatTempo(localExam.tempoProva) },
    { icon: <CalendarDaysIcon className="w-4 h-4" style={{ color: "#05245F" }} />, label: "Data limite", value: formatDataLimite(localExam.dataLimite) },
  ];

  return (
    <>
      {showPublish && <CompartilharModal onClose={() => setShowPublish(false)} />}
      <SelecionarOrigemQuestaoModal
        isOpen={showOrigemModal}
        onClose={() => setShowOrigemModal(false)}
        onNovaQuestao={() => onNavigate?.("nova-questao")}
        onBancoQuestoes={() => setShowBancoModal(true)}
      />
      <SelecionarDoBancoModal
        isOpen={showBancoModal}
        onClose={() => setShowBancoModal(false)}
        onAddQuestions={(qs) => onAddQuestions?.(qs)}
        bancoQuestoes={bancoQuestoes}
      />
      <EditarQuestaoProvaModal
        isOpen={editingQuestion !== null}
        onClose={() => setEditingQuestion(null)}
        questao={editingQuestion}
        onSave={handleUpdateQuestion}
      />
      {showEditExam && (
        <EditarDadosProvaModal
          exam={localExam}
          onClose={() => setShowEditExam(false)}
          onSave={(updated) => {
            setLocalExam(updated);   // atualiza imediatamente a exibição
            onUpdateExam?.(updated); // propaga ao pai para persistir na lista
            setShowEditExam(false);
          }}
        />
      )}

      <div className="p-8 flex flex-col gap-6">
        {/* Back link */}
        <button onClick={onBack} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity self-start"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#6B6B6B" }}>
          <ChevronLeftIcon className="w-4 h-4" style={{ color: "#6B6B6B" }} />
          Voltar para provas
        </button>

        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#000" }}>{localExam.title}</h1>
            {(localExam.subject || localExam.semester) && (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#575454" }}>
                {[localExam.subject, localExam.semester].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowEditExam(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
              style={{ border: "1.5px solid #E6E6E6", color: "#6B6FA3", backgroundColor: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14 }}
            >
              <PencilIcon className="w-[15px] h-[15px]" />
              Editar dados
            </button>
            <button onClick={() => setShowPublish(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
              style={{ border: "1.5px solid #6B6FA3", color: "#6B6FA3", backgroundColor: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14 }}>
              <ShareIcon className="w-[15px] h-[15px]" />
              Publicar
            </button>
            <button onClick={() => setShowOrigemModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
              style={{ backgroundColor: "#F9B233", color: "#6B6FA3", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14 }}>
              <PlusIcon className="w-4 h-4" />
              Adicionar questão
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div className="flex flex-wrap gap-3">
          {infoCards.map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white" style={{ border: "1px solid #E6E6E6", minWidth: 150 }}>
              <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 32, height: 32, backgroundColor: "#E6FAF8" }}>
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#9B9B9B" }}>{item.label}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#111" }}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Orientações — sempre visível */}
        <div className="bg-white rounded-xl px-5 py-4 flex gap-3" style={{ border: "1px solid #E6E6E6" }}>
          <div className="flex items-start justify-center rounded-lg shrink-0 mt-0.5" style={{ width: 32, height: 32, backgroundColor: "#FFF8E0" }}>
            <DocumentTextIcon className="w-4 h-4 mt-[7px]" style={{ color: "#B07D00" }} />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#B07D00" }}>Orientações aos alunos</span>
            {localExam.orientacoes ? (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#444", lineHeight: 1.6 }}>{localExam.orientacoes}</p>
            ) : (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#B1B4BD", fontStyle: "italic" }}>
                Nenhuma orientação cadastrada. Clique em "Editar dados" para adicionar.
              </p>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl self-start" style={{ backgroundColor: "#fff", border: "1px solid #D7D7D9" }}>
          {tabs.map((tab) => {
            const label = tab.id === "questoes" ? `Questões (${questions.length})` : tab.label;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 rounded-lg transition-all"
                style={{ backgroundColor: activeTab === tab.id ? "#F9B233" : "transparent", color: activeTab === tab.id ? "#6B6FA3" : "#6A7181", fontFamily: "Poppins, sans-serif", fontWeight: activeTab === tab.id ? 600 : 400, fontSize: 13 }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Questions list */}
        {activeTab === "questoes" && (
          <div className="flex flex-col gap-4">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} onEdit={() => setEditingQuestion(q)} onDelete={() => onDeleteQuestion?.(q.id)} />
            ))}
          </div>
        )}

        {activeTab !== "questoes" && (
          <div className="bg-white rounded-xl p-8 flex items-center justify-center" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", minHeight: 200 }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#B1B4BD" }}>Conteúdo em construção</p>
          </div>
        )}
      </div>
    </>
  );
}
