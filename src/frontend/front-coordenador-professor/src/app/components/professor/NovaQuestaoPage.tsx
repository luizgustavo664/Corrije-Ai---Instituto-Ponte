import { useState } from "react";
import { ChevronLeftIcon, BookmarkIcon, PlusIcon, EyeIcon, EyeSlashIcon, PhotoIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import type { Question, QuestionType as QType } from "./ProvaDetailPage";

interface Props {
  onBack: () => void;
  onSave?: (question: Question) => void;
}

type FormQuestionType = "Múltipla Escolha" | "Verdadeiro/Falso" | "Discursiva";

const questionTypes: FormQuestionType[] = ["Múltipla Escolha", "Verdadeiro/Falso", "Discursiva"];

function toProvaType(t: FormQuestionType): QType {
  if (t === "Múltipla Escolha") return "Alternativa";
  if (t === "Verdadeiro/Falso") return "V/F";
  return "Discursiva";
}

const letters = ["A", "B", "C", "D", "E"];

interface Alternative {
  id: string;
  text: string;
  correct: boolean;
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
  fontSize: 12,
  fontWeight: 600,
  color: "#6A7181",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  display: "block",
  marginBottom: 12,
};

export function NovaQuestaoPage({ onBack, onSave }: Props) {
  const [showPreview, setShowPreview] = useState(true);
  const [type, setType] = useState<FormQuestionType>("Múltipla Escolha");
  const [points, setPoints] = useState("1");
  const [discipline, setDiscipline] = useState("");
  const [theme, setTheme] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [allowPhotos, setAllowPhotos] = useState(false);
  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { id: "A", text: "Alternativa A", correct: false },
    { id: "B", text: "Alternativa B", correct: false },
    { id: "C", text: "Alternativa C", correct: false },
    { id: "D", text: "Alternativa D", correct: false },
  ]);

  function markCorrect(id: string) {
    setAlternatives((prev) =>
      prev.map((a) => ({ ...a, correct: a.id === id }))
    );
  }

  function updateAlt(id: string, text: string) {
    setAlternatives((prev) =>
      prev.map((a) => (a.id === id ? { ...a, text } : a))
    );
  }

  function handleSave() {
    if (!enunciado.trim()) return;
    const newQuestion: Question = {
      id: Date.now(),
      type: toProvaType(type),
      text: enunciado.trim(),
      ...(type === "Múltipla Escolha"
        ? {
            options: alternatives.map((a) => ({
              letter: a.id,
              text: a.text,
              correct: a.correct,
            })),
          }
        : { answer: type === "Verdadeiro/Falso" ? "Verdadeiro" : "A ser corrigido" }),
    };
    onSave?.(newQuestion);
    onBack();
  }

  function addAlternative() {
    if (alternatives.length >= 5) return;
    const nextLetter = letters[alternatives.length];
    setAlternatives((prev) => [
      ...prev,
      { id: nextLetter, text: `Alternativa ${nextLetter}`, correct: false },
    ]);
  }

  return (
    <div className="p-8 flex flex-col gap-5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity self-start"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#6B6B6B" }}
          >
            <ChevronLeftIcon className="w-4 h-4" style={{ color: "#6B6B6B" }} />
            Voltar para provas
          </button>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#000" }}>
            Nova Questão
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B6B6B" }}>
            Preencha os dados iniciais. A prova será salva como rascunho.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-6">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              border: "1px solid #E6E6E6",
              backgroundColor: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#6A7181",
            }}
          >
            {showPreview ? <EyeSlashIcon className="w-[15px] h-[15px]" /> : <EyeIcon className="w-[15px] h-[15px]" />}
            {showPreview ? "Ocultar Preview" : "Mostrar Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={!enunciado.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg transition-opacity"
            style={{
              backgroundColor: enunciado.trim() ? "#6B6FA3" : "#B1B4BD",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#fff",
              cursor: enunciado.trim() ? "pointer" : "not-allowed",
            }}
          >
            <BookmarkIcon className="w-[15px] h-[15px]" style={{ color: "#fff" }} />
            Salvar Questão
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-5 items-start">
        {/* Left form column */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* CONFIGURAÇÃO */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-4"
            style={{ border: "1px solid #E6E6E6" }}
          >
            <label style={labelStyle}>Configuração</label>

            <div className="flex gap-4">
              {/* Tipo */}
              <div className="flex flex-col gap-1.5 flex-1">
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#111" }}>Tipo</span>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as FormQuestionType)}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                  >
                    {questionTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#6B6B6B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Pontuação */}
              <div className="flex flex-col gap-1.5" style={{ width: 130 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#111" }}>Pontuação</span>
                <input
                  type="number"
                  value={points}
                  min={0}
                  max={10}
                  onChange={(e) => setPoints(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              {/* Disciplina */}
              <div className="flex flex-col gap-1.5 flex-1">
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#111" }}>Disciplina</span>
                <input
                  type="text"
                  placeholder="Ex: Matemática"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                />
              </div>

              {/* Tema */}
              <div className="flex flex-col gap-1.5 flex-1">
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#111" }}>Tema</span>
                <input
                  type="text"
                  placeholder="Ex: Derivadas"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                />
              </div>
            </div>
          </div>

          {/* ENUNCIADO */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-3"
            style={{ border: "1px solid #E6E6E6" }}
          >
            <label style={labelStyle}>Enunciado *</label>
            <textarea
              rows={5}
              placeholder="Digite o enunciado da questão..."
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
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
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9FA3AC" }}>
              Suporta LaTeX entre <code>$$</code> — ex: <code>$$f'(x) = 2x$$</code>
            </p>
          </div>

          {/* ALTERNATIVAS (only for Múltipla Escolha) */}
          {type === "Múltipla Escolha" && (
            <div
              className="bg-white rounded-2xl p-6 flex flex-col gap-3"
              style={{ border: "1px solid #E6E6E6" }}
            >
              <div className="flex items-center justify-between">
                <label style={{ ...labelStyle, marginBottom: 0 }}>Alternativas *</label>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9FA3AC" }}>
                  Digite o texto e clique no círculo para marcar a correta
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {alternatives.map((alt) => (
                  <div key={alt.id} className="flex items-center gap-3">
                    <button
                      onClick={() => markCorrect(alt.id)}
                      className="shrink-0 hover:opacity-70 transition-opacity"
                      title="Marcar como gabarito"
                    >
                      {alt.correct
                        ? <CheckCircleIcon className="w-5 h-5" style={{ color: "#05245F" }} />
                        : <div className="rounded-full border-2" style={{ width: 20, height: 20, borderColor: "#D7D7D9" }} />
                      }
                    </button>
                    <div
                      className="flex items-center gap-2 flex-1 px-3 rounded-xl transition-all"
                      style={{
                        height: 42,
                        backgroundColor: alt.correct ? "#E6FAF8" : "#F2F3F5",
                        border: `1px solid ${alt.correct ? "#05245F" : "transparent"}`,
                      }}
                    >
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, color: "#6B6FA3", minWidth: 16 }}>
                        {alt.id})
                      </span>
                      <input
                        type="text"
                        value={alt.text}
                        onChange={(e) => updateAlt(alt.id, e.target.value)}
                        placeholder={`Digite o texto da alternativa ${alt.id}`}
                        style={{
                          flex: 1,
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13,
                          color: "#111",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {alternatives.length < 5 && (
                <button
                  onClick={addAlternative}
                  className="flex items-center gap-1.5 hover:opacity-70 transition-opacity self-start mt-1"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#05245F", fontWeight: 500 }}
                >
                  <PlusIcon className="w-[15px] h-[15px]" style={{ color: "#05245F" }} />
                  Adicionar Alternativa
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right preview column */}
        {showPreview && (
          <div className="flex flex-col gap-4 shrink-0" style={{ width: 320 }}>
            {/* Preview card */}
            <div
              className="bg-white rounded-2xl p-5 flex flex-col gap-3"
              style={{ border: "1px solid #E6E6E6" }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#6A7181", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Preview — como o aluno verá
              </p>

              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 24, height: 24, backgroundColor: "#6B6FA3" }}
                >
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 11, color: "#fff" }}>1</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: "#EEF1F8", color: "#6B6FA3", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600 }}
                >
                  {type}
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6A7181" }}>
                  {points} ponto{Number(points) !== 1 ? "s" : ""}
                </span>
              </div>

              <div
                className="rounded-xl p-3 min-h-[60px]"
                style={{ backgroundColor: "#F7F8FA", border: "1px solid #E6E6E6" }}
              >
                {enunciado
                  ? <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#111" }}>{enunciado}</p>
                  : <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#B1B4BD", fontStyle: "italic" }}>O enunciado aparecerá aqui...</p>
                }
              </div>

              {type === "Múltipla Escolha" && alternatives.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {alternatives.map((alt) => (
                    <div
                      key={alt.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "#F2F3F5" }}
                    >
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11, color: "#6B6FA3" }}>{alt.id})</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#333" }}>{alt.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#05245F", textAlign: "center" as const }}>
                  {type === "Múltipla Escolha" ? "Adicione as alternativas ao lado." : ""}
                </p>
              )}
            </div>

            {/* Add image */}
            <div
              className="bg-white rounded-2xl p-5 flex flex-col gap-3"
              style={{ border: "1px solid #E6E6E6" }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#6A7181", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Adicionar imagem à prova
              </p>
              <label
                className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                style={{ height: 100, backgroundColor: "#F7F8FA", border: "2px dashed #D7D7D9" }}
              >
                <input type="file" accept="image/*" className="hidden" />
                <PhotoIcon className="w-6 h-6" style={{ color: "#B1B4BD" }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9FA3AC" }}>
                  Escolher arquivo do computador
                </span>
              </label>
            </div>

            {/* Allow photos */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: "1px solid #E6E6E6" }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#6A7181", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                Permitir a inclusão de fotos nessa prova
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPhotos}
                  onChange={(e) => setAllowPhotos(e.target.checked)}
                  style={{ accentColor: "#05245F", width: 16, height: 16 }}
                />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#444" }}>
                  Permitir inclusão de fotos
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
