import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon, DocumentTextIcon, CalendarIcon, UsersIcon, ChevronDownIcon, TrashIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import type { Exam, ExamBadge } from "../../../../../src/features/dashboard/dashboard.types";

const filterTabs: Array<"Todas" | ExamBadge> = ["Todas", "Rascunho", "Publicada", "Encerrada", "Antiga"];

interface Props {
  onNavigate: (tab: string, exam?: Exam) => void;
  exams: Exam[];
  onDeleteExam: (id: Exam["id"]) => void;
  onArchiveExam?: (id: Exam["id"]) => void;
}

export function ProvasPage({ onNavigate, exams, onDeleteExam, onArchiveExam }: Props) {
  const [activeTab, setActiveTab] = useState<"Todas" | ExamBadge>("Todas");
  const [search, setSearch] = useState("");
  const [materiaFilter, setMateriaFilter] = useState("");
  const [semestreFilter, setSemestreFilter] = useState("");
  const [turmaFilter, setTurmaFilter] = useState("");
  const [professorFilter, setProfessorFilter] = useState("");

  const materias = [...new Set(exams.map((e) => e.subject).filter(Boolean))].sort();
  const semestres = [...new Set(exams.map((e) => e.semester).filter(Boolean))].sort();
  const turmas = [...new Set(exams.map((e) => e.turma).filter(Boolean))].sort();
  const professores = [...new Set(exams.map((e) => e.professorName).filter(Boolean))].sort();

  const filtered = exams.filter((e) => {
    const matchTab = activeTab === "Todas" || e.badge === activeTab;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.discipline.toLowerCase().includes(search.toLowerCase()) ||
      (e.professorName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchMateria = !materiaFilter || e.subject === materiaFilter;
    const matchSemestre = !semestreFilter || e.semester === semestreFilter;
    const matchTurma = !turmaFilter || e.turma === turmaFilter;
    const matchProfessor = !professorFilter || e.professorName === professorFilter;
    return matchTab && matchSearch && matchMateria && matchSemestre && matchTurma && matchProfessor;
  });

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#000" }}>
            Provas
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#575454" }}>
            Gerencie e visualize todas as avaliações disponíveis
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

      {/* Filter tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl self-start"
        style={{ backgroundColor: "#fff", border: "1px solid #D7D7D9" }}
      >
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: activeTab === tab ? "#F9B233" : "transparent",
              color: activeTab === tab ? "#6B6FA3" : "#6A7181",
              fontFamily: "Poppins, sans-serif",
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: "13px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9F9F9F" }} />
          <input
            type="text"
            placeholder="Buscar provas"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #D9D9D9",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#6A7181",
            }}
          />
        </div>

        <div className="relative">
          <select
            value={professorFilter}
            onChange={(e) => setProfessorFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg outline-none cursor-pointer"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #D9D9D9",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#6A7181",
            }}
          >
            <option value="">Professor</option>
            {professores.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDownIcon className="w-[14px] h-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9F9F9F" }} />
        </div>

        <div className="relative">
          <select
            value={materiaFilter}
            onChange={(e) => setMateriaFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg outline-none cursor-pointer"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #D9D9D9",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#6A7181",
            }}
          >
            <option value="">Matéria</option>
            {materias.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDownIcon className="w-[14px] h-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9F9F9F" }} />
        </div>
        <div className="relative">
          <select
            value={semestreFilter}
            onChange={(e) => setSemestreFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg outline-none cursor-pointer"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #D9D9D9",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#6A7181",
            }}
          >
            <option value="">Semestre</option>
            {semestres.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDownIcon className="w-[14px] h-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9F9F9F" }} />
        </div>

        {/* Turma filter */}
        <div className="relative">
          <select
            value={turmaFilter}
            onChange={(e) => setTurmaFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg outline-none cursor-pointer"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #D9D9D9",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#6A7181",
            }}
          >
            <option value="">Turma</option>
            {turmas.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDownIcon className="w-[14px] h-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9F9F9F" }} />
        </div>
      </div>

      {/* Exam cards grid */}
      {filtered.length === 0 ? (
        <div
          className="bg-white rounded-xl p-10 flex items-center justify-center"
          style={{ border: "1px dashed #D7D7D9" }}
        >
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#B1B4BD" }}>
            Nenhuma prova encontrada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((exam) => (
            <div
              key={exam.id}
              onClick={() => onNavigate("prova-detail", exam)}
              className="bg-white rounded-xl p-3 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 32, height: 32, backgroundColor: "#EEF1F8" }}
                >
                  <DocumentTextIcon className="w-4 h-4" style={{ color: "#6B6FA3" }} />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-lg"
                    style={{
                      backgroundColor: exam.badge === "Rascunho" ? "#FFF8E0" : "#F2F2F2",
                      color: exam.badge === "Rascunho" ? "#B07D00" : "#6A7181",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: exam.badge === "Rascunho" ? 600 : 400,
                    }}
                  >
                    {exam.badge}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteExam(exam.id); }}
                    className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: "#FEE2E2" }}
                    title="Deletar prova"
                  >
                    <TrashIcon className="w-[15px] h-[15px]" style={{ color: "#EF4444" }} />
                  </button>
                  {exam.badge === "Encerrada" && onArchiveExam && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onArchiveExam(exam.id); }}
                      className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                      style={{ backgroundColor: "#E8F0FE" }}
                      title="Arquivar prova"
                    >
                      <ArchiveBoxIcon className="w-[15px] h-[15px]" style={{ color: "#4A6FA5" }} />
                    </button>
                  )}
                </div>
              </div>

              <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "17px", color: "#000" }}>
                {exam.title}
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#504F4F" }}>
                {exam.modalidade} • {exam.semester}
              </p>
              {exam.professorName && (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181" }}>
                  Professor: {exam.professorName}
                </p>
              )}

              {/* Bottom row */}
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-[15px] h-[15px]" style={{ color: "#504F4F" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#504F4F" }}>{exam.semester}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UsersIcon className="w-[15px] h-[15px]" style={{ color: "#504F4F" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#504F4F" }}>{exam.submissions} submissões</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
