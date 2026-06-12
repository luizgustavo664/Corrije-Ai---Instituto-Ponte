import { useState } from "react";
import { MagnifyingGlassIcon, ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { bancoQuestoes as defaultBancoQuestoes } from "./bancoQuestoesData";
import type { BancoQuestion } from "./bancoQuestoesData";
import { EditarQuestaoModal } from "./EditarQuestaoModal";
import { SelecionarProvaModal } from "./SelecionarProvaModal";
import type { Exam } from "./examTypes";

interface Props {
  onNavigate?: (tab: string) => void;
  bancoQuestoes?: BancoQuestion[];
  onUpdateQuestion?: (questao: BancoQuestion) => void;
  onDeleteQuestion?: (id: number) => void;
  provas?: Exam[];
  onAddToProva?: (provaId: number, questao: BancoQuestion) => void;
}

export function BancoQuestoesPage({ onNavigate, bancoQuestoes = defaultBancoQuestoes, onUpdateQuestion, onDeleteQuestion, provas = [], onAddToProva }: Props) {
  const [editingQuestao, setEditingQuestao] = useState<BancoQuestion | null>(null);
  const [questaoParaAdicionar, setQuestaoParaAdicionar] = useState<BancoQuestion | null>(null);
  const handleSaveEdit = (questao: BancoQuestion) => {
    onUpdateQuestion?.(questao);
    setEditingQuestao(null);
  };

  const handleAddToProva = (provaId: number, questao: BancoQuestion) => {
    onAddToProva?.(provaId, questao);
  };

  return (
    <>
      <EditarQuestaoModal
        isOpen={!!editingQuestao}
        onClose={() => setEditingQuestao(null)}
        questao={editingQuestao}
        onSave={handleSaveEdit}
      />
      <SelecionarProvaModal
        isOpen={!!questaoParaAdicionar}
        onClose={() => setQuestaoParaAdicionar(null)}
        questao={questaoParaAdicionar}
        provas={provas}
        onAddToProva={handleAddToProva}
      />
      <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#000" }}>
            Banco de Questões
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#575454" }}>
            Reutilize questões existentes e detecte duplicatas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate?.("nova-questao-banco")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
            style={{ backgroundColor: "#F9B233", color: "#6B6FA3", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px" }}
          >
            + Adicionar questão
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
            style={{
              backgroundColor: "#fff",
              border: "1.5px solid #6B6FA3",
              color: "#6B6FA3",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ⚠ Verificar Duplicatas
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9F9F9F" }} />
          <input
            type="text"
            placeholder="Buscar questões"
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

        {["Matéria", "Semestre"].map((label) => (
          <div key={label} className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2.5 rounded-lg outline-none cursor-pointer"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #D9D9D9",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#6A7181",
              }}
            >
              <option>{label}</option>
            </select>
            <ChevronDownIcon className="w-[14px] h-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9F9F9F" }} />
          </div>
        ))}
      </div>

      {/* Question list */}
      <div className="flex flex-col gap-3">
        {bancoQuestoes.map((q) => (
          <div
            key={q.id}
            onClick={() => setEditingQuestao(q)}
            className="bg-white rounded-xl p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            {/* Top row: tags + buttons */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    border: "1px solid #D7D7D9",
                    backgroundColor: "#F2F2F2",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "#6A7181",
                  }}
                >
                  {q.materia}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    border: "1px solid #D7D7D9",
                    backgroundColor: "#F2F2F2",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "#6A7181",
                  }}
                >
                  {q.semestre}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    border: "1px solid #D7D7D9",
                    backgroundColor: "#F2F2F2",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "#6A7181",
                  }}
                >
                  {q.type}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    border: "1px solid #D7D7D9",
                    backgroundColor: "#F2F2F2",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "#6A7181",
                  }}
                >
                  {q.dificuldade}
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuestaoParaAdicionar(q);
                  }}
                  className="px-3 py-1.5 rounded-lg hover:opacity-85 transition-opacity"
                  style={{
                    border: "1px solid #05245F",
                    color: "#05245F",
                    backgroundColor: "transparent",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  + Incluir na prova
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteQuestion?.(q.id);
                  }}
                  className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ backgroundColor: "#FEE2E2" }}
                >
                  <TrashIcon className="w-[14px] h-[14px]" style={{ color: "#EF4444" }} />
                </button>
              </div>
            </div>

            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "#000" }}>
              {q.text}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181" }}>
              {q.timesUsed === 1
                ? `Utilizada ${q.timesUsed} vez - Taxa de acerto: ${q.successRate}%`
                : `Utilizada ${q.timesUsed} vezes - Taxa de acerto: ${q.successRate}%`
              }
            </p>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
