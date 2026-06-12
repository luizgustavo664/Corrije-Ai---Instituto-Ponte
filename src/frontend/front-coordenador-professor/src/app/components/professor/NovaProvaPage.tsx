import { useState } from "react";
import { ChevronLeftIcon, BookmarkIcon, ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import type { Exam } from "./examTypes";

interface Props {
  onBack: () => void;
  onSave: (exam: Exam) => void;
}

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
  fontSize: 14,
  color: "#111",
  marginBottom: 6,
  display: "block",
};

const chevron = (
  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width={16} height={16} viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6B6B6B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function NovaProvaPage({ onBack, onSave }: Props) {
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [turma, setTurma] = useState("");
  const [semestre, setSemestre] = useState("");
  const [orientacoes, setOrientacoes] = useState("");
  const [tempoProva, setTempoProva] = useState<string>("");
  const [dataLimite, setDataLimite] = useState("");

  const canSave = nome.trim() !== "";

  function handleSave() {
    if (!canSave) return;
    const exam: Exam = {
      id: Date.now(),
      title: nome.trim(),
      modalidade: modalidade || "Prova",
      discipline: disciplina,
      subject: disciplina,
      turma,
      semester: semestre || "1º Semestre 2026",
      badge: "Rascunho",
      submissions: "10",
      tempoProva: tempoProva !== "" ? Number(tempoProva) : undefined,
      dataLimite: dataLimite || undefined,
      orientacoes: orientacoes.trim() || undefined,
    };
    onSave(exam);
    onBack();
  }

  // Minimum datetime for the picker: now
  const minDatetime = new Date().toISOString().slice(0, 16);

  return (
    <div className="p-8 flex flex-col gap-5">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 hover:opacity-70 transition-opacity self-start"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#6B6B6B" }}
      >
        <ChevronLeftIcon className="w-4 h-4" style={{ color: "#6B6B6B" }} />
        Voltar para provas
      </button>

      {/* Page title */}
      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#000" }}>
          Nova Prova
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6B6B" }}>
          Preencha os dados iniciais. A prova será salva como rascunho.
        </p>
      </div>

      {/* Form card */}
      <div
        className="bg-white rounded-2xl flex flex-col"
        style={{ border: "1px solid #E6E6E6", boxShadow: "0px 2px 5px rgba(0,0,0,0.02)" }}
      >
        {/* Form body */}
        <div className="flex flex-col gap-5 p-8 pb-6" style={{ borderBottom: "1px solid #E6E6E6" }}>
          <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#111" }}>
            Dados da Prova
          </h2>

          {/* Nome da Prova */}
          <div className="flex flex-col gap-1.5 w-full">
            <label style={labelStyle}>Nome da Prova *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Prova de Cálculo — 1ª Unidade"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
            />
          </div>

          {/* Modalidade + Disciplina */}
          <div className="flex gap-5">
            <div className="flex flex-col gap-1.5 w-full">
              <label style={labelStyle}>Modalidade *</label>
              <div className="relative w-full">
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                >
                  <option value="">Selecionar</option>
                  {modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {chevron}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label style={labelStyle}>Disciplina *</label>
              <input
                type="text"
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                placeholder="Ex: Matemática"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
              />
            </div>
          </div>

          {/* Turma + Semestre */}
          <div className="flex gap-5">
            <div className="flex flex-col gap-1.5 w-full">
              <label style={labelStyle}>Turma *</label>
              <input
                type="text"
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                placeholder="Ex: 3ºA"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label style={labelStyle}>Semestre *</label>
              <div className="relative w-full">
                <select
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                >
                  <option value="">Selecionar</option>
                  {semestres.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {chevron}
              </div>
            </div>
          </div>

          {/* Tempo de Prova + Data Limite */}
          <div className="flex gap-5">
            {/* Tempo de Prova */}
            <div className="flex flex-col gap-1.5 w-full">
              <label style={labelStyle} className="flex items-center gap-1.5">
                <ClockIcon style={{ width: 15, height: 15, color: "#05245F" }} />
                Tempo de Prova
              </label>
              <div className="relative w-full">
                <select
                  value={tempoProva}
                  onChange={(e) => setTempoProva(e.target.value)}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                >
                  <option value="">Selecionar duração</option>
                  {duracoes.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                {chevron}
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9B9B9B" }}>
                Tempo disponível para o aluno após iniciar a prova
              </span>
            </div>

            {/* Data Limite */}
            <div className="flex flex-col gap-1.5 w-full">
              <label style={labelStyle} className="flex items-center gap-1.5">
                <CalendarDaysIcon style={{ width: 15, height: 15, color: "#05245F" }} />
                Data e Hora Limite
              </label>
              <div className="relative w-full">
                <input
                  type="datetime-local"
                  value={dataLimite}
                  min={minDatetime}
                  onChange={(e) => setDataLimite(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 13, cursor: "pointer" }}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                />
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9B9B9B" }}>
                Prazo máximo para submissão da prova
              </span>
            </div>
          </div>

          {/* Orientações */}
          <div className="flex flex-col gap-1.5 w-full">
            <label style={labelStyle}>Orientações (opcional)</label>
            <textarea
              rows={4}
              value={orientacoes}
              onChange={(e) => setOrientacoes(e.target.value)}
              placeholder="Instruções gerais para os alunos..."
              style={{
                width: "100%",
                backgroundColor: "#F2F3F5",
                border: "1px solid transparent",
                borderRadius: 8,
                padding: "10px 13px",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#111",
                outline: "none",
                resize: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              border: "1px solid #E6E6E6",
              backgroundColor: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#111",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-opacity"
            style={{
              backgroundColor: canSave ? "#6B6FA3" : "#B1B4BD",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#fff",
              cursor: canSave ? "pointer" : "not-allowed",
            }}
          >
            <BookmarkIcon className="w-[15px] h-[15px]" style={{ color: "#fff" }} />
            Salvar como Rascunho
          </button>
        </div>
      </div>
    </div>
  );
}
