import { useState, useEffect } from "react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import type { BancoQuestion } from "../../../../../src/features/dashboard/dashboard.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questao: BancoQuestion | null;
  onSave: (questao: BancoQuestion) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#F2F3F5",
  border: "1px solid transparent",
  borderRadius: 8,
  padding: "10px 13px",
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
  marginBottom: 8,
};

export function EditarQuestaoModal({ isOpen, onClose, questao, onSave }: Props) {
  const [text, setText] = useState("");
  const [materia, setMateria] = useState("");
  const [semestre, setSemestre] = useState("");
  const [dificuldade, setDificuldade] = useState("");
  const [alternatives, setAlternatives] = useState<{ letter: string; text: string; correct: boolean }[]>([]);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (questao) {
      setText(questao.text);
      setMateria(questao.materia);
      setSemestre(questao.semestre);
      setDificuldade(questao.dificuldade);
      if (questao.options) {
        setAlternatives(questao.options);
      }
      if (questao.answer) {
        setAnswer(questao.answer);
      }
    }
  }, [questao]);

  if (!isOpen || !questao) return null;

  const handleSave = () => {
    const updatedQuestao: BancoQuestion = {
      ...questao,
      text,
      materia,
      semestre,
      dificuldade,
      ...(questao.type === "Alternativa" ? { options: alternatives } : {}),
      ...(questao.type === "V/F" || questao.type === "Discursiva" ? { answer } : {}),
    };
    onSave(updatedQuestao);
    onClose();
  };

  const markCorrect = (letter: string) => {
    setAlternatives((prev) =>
      prev.map((a) => ({ ...a, correct: a.letter === letter }))
    );
  };

  const updateAltText = (letter: string, newText: string) => {
    setAlternatives((prev) =>
      prev.map((a) => (a.letter === letter ? { ...a, text: newText } : a))
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-3xl relative flex flex-col"
        style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px", color: "#6B6FA3" }}>
              Editar Questão
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181", marginTop: "4px" }}>
              Tipo: {questao.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:opacity-70 transition-opacity"
            style={{ backgroundColor: "#F2F2F2" }}
          >
            <XMarkIcon className="w-5 h-5" style={{ color: "#6A7181" }} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-5 mb-6">
          {/* Metadados */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={labelStyle}>Matéria</label>
              <input
                type="text"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                style={inputStyle}
                placeholder="Ex: Cálculo"
              />
            </div>
            <div>
              <label style={labelStyle}>Semestre</label>
              <select
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
                style={inputStyle}
              >
                <option value="1º Semestre">1º Semestre</option>
                <option value="2º Semestre">2º Semestre</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Dificuldade</label>
              <select
                value={dificuldade}
                onChange={(e) => setDificuldade(e.target.value)}
                style={inputStyle}
              >
                <option value="Fácil">Fácil</option>
                <option value="Média">Média</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>

          {/* Enunciado */}
          <div>
            <label style={labelStyle}>Enunciado da Questão</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              style={{
                ...inputStyle,
                height: "auto",
                resize: "vertical",
              }}
              placeholder="Digite o enunciado da questão..."
            />
          </div>

          {/* Alternativas (se for múltipla escolha) */}
          {questao.type === "Alternativa" && alternatives.length > 0 && (
            <div>
              <label style={labelStyle}>Alternativas</label>
              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <div key={alt.letter} className="flex items-center gap-3">
                    <button
                      onClick={() => markCorrect(alt.letter)}
                      className="flex items-center justify-center rounded-lg shrink-0 transition-all"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: alt.correct ? "#6B6FA3" : "#F2F3F5",
                        border: alt.correct ? "2px solid #F9B233" : "2px solid transparent",
                      }}
                    >
                      {alt.correct ? (
                        <CheckCircleIcon className="w-5 h-5" style={{ color: "#F9B233" }} />
                      ) : (
                        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "14px", color: "#6A7181" }}>
                          {alt.letter}
                        </span>
                      )}
                    </button>
                    <input
                      type="text"
                      value={alt.text}
                      onChange={(e) => updateAltText(alt.letter, e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder={`Texto da alternativa ${alt.letter}`}
                    />
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginTop: "8px" }}>
                Clique no círculo para marcar a alternativa correta
              </p>
            </div>
          )}

          {/* Resposta V/F */}
          {questao.type === "V/F" && (
            <div>
              <label style={labelStyle}>Resposta Correta</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setAnswer("Verdadeiro")}
                  className="flex-1 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: answer === "Verdadeiro" ? "#6B6FA3" : "#F2F3F5",
                    color: answer === "Verdadeiro" ? "#fff" : "#6A7181",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Verdadeiro
                </button>
                <button
                  onClick={() => setAnswer("Falso")}
                  className="flex-1 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: answer === "Falso" ? "#6B6FA3" : "#F2F3F5",
                    color: answer === "Falso" ? "#fff" : "#6A7181",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Falso
                </button>
              </div>
            </div>
          )}

          {/* Resposta Discursiva */}
          {questao.type === "Discursiva" && (
            <div>
              <label style={labelStyle}>Gabarito / Resposta Esperada</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                style={{
                  ...inputStyle,
                  height: "auto",
                  resize: "vertical",
                }}
                placeholder="Digite o gabarito ou resposta esperada..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "#E5E7EB" }}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full transition-opacity hover:opacity-85"
            style={{
              backgroundColor: "#F2F2F2",
              color: "#6A7181",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full transition-opacity hover:opacity-85"
            style={{
              backgroundColor: "#F9B233",
              color: "#6B6FA3",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
