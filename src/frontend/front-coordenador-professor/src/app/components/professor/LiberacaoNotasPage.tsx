import { useState, useEffect } from "react";
import { PaperAirplaneIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import type { Exam } from "./examTypes";

type RowStatus = "Enviado" | "Falhou";

const tableRows: { name: string; email: string; grade: number; status: RowStatus; dateTime: string }[] = [
  { name: "Lucas Henrique Martins", email: "lucas.martins@estudante.edu.br", grade: 9.87, status: "Enviado", dateTime: "28/05/2026 09:15" },
  { name: "Isabela Cristina Souza", email: "isabela.souza@estudante.edu.br", grade: 8.92, status: "Enviado", dateTime: "28/05/2026 09:15" },
  { name: "Gabriel Fernando Costa", email: "gabriel.costa@estudante.edu.br", grade: 7.64, status: "Enviado", dateTime: "28/05/2026 09:16" },
  { name: "Beatriz Oliveira Santos", email: "beatriz.santos@estudante.edu.br", grade: 9.23, status: "Falhou", dateTime: "28/05/2026 09:16" },
  { name: "Pedro Augusto Lima", email: "pedro.lima@estudante.edu.br", grade: 8.45, status: "Enviado", dateTime: "28/05/2026 09:17" },
  { name: "Mariana Silva Alves", email: "mariana.alves@estudante.edu.br", grade: 9.56, status: "Enviado", dateTime: "28/05/2026 09:17" },
  { name: "Rafael dos Santos Rocha", email: "rafael.rocha@estudante.edu.br", grade: 7.89, status: "Falhou", dateTime: "28/05/2026 09:18" },
  { name: "Amanda Carolina Dias", email: "amanda.dias@estudante.edu.br", grade: 8.78, status: "Enviado", dateTime: "28/05/2026 09:18" },
  { name: "Thiago Roberto Freitas", email: "thiago.freitas@estudante.edu.br", grade: 6.92, status: "Enviado", dateTime: "28/05/2026 09:19" },
  { name: "Julia Fernanda Rodrigues", email: "julia.rodrigues@estudante.edu.br", grade: 9.34, status: "Falhou", dateTime: "28/05/2026 09:19" },
];

interface ProvaDisponivel {
  id: number;
  nome: string;
  disciplina: string;
  turma: string;
  totalAlunos: number;
  corrigidas: number;
  status: "Completa" | "Pendente";
}

interface Props {
  exams?: Exam[];
}

function convertExamsToProvasDisponiveis(exams: Exam[]): ProvaDisponivel[] {
  return exams.map(exam => {
    const totalSubmissions = parseInt(exam.submissions);

    // Se não há submissões, não há nada para corrigir
    if (totalSubmissions === 0) {
      return {
        id: exam.id,
        nome: exam.title,
        disciplina: exam.subject,
        turma: exam.turma,
        totalAlunos: 0,
        corrigidas: 0,
        status: "Pendente" as const,
      };
    }

    // Usar a MESMA lógica de seed da CorrecaoPage para consistência
    const seed = (exam.id * 37) % 100;
    const correctionRate = seed / 100;
    const corrigidas = Math.floor(totalSubmissions * correctionRate);
    const isCompleta = corrigidas === totalSubmissions;

    return {
      id: exam.id,
      nome: exam.title,
      disciplina: exam.subject,
      turma: exam.turma,
      totalAlunos: totalSubmissions,
      corrigidas,
      status: isCompleta ? "Completa" : "Pendente",
    };
  });
}

export function LiberacaoNotasPage({ exams = [] }: Props) {
  const provasDisponiveis = convertExamsToProvasDisponiveis(exams);
  const [selectedProvas, setSelectedProvas] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [concluido, setConcluido] = useState(false);

  // Calcular estatísticas dinamicamente (apenas provas com correções)
  const provasComCorrecoes = provasDisponiveis.filter(p => p.corrigidas > 0);
  const totalAlunos = provasComCorrecoes.reduce((sum, p) => sum + p.totalAlunos, 0);
  const totalCorrigidas = provasComCorrecoes.reduce((sum, p) => sum + p.corrigidas, 0);
  // Simular taxa de sucesso de envio (~93%)
  const emailsEnviados = Math.floor(totalCorrigidas * 0.93);
  const falhasEnvio = Math.floor(totalCorrigidas * 0.015);
  const pendentes = totalAlunos - emailsEnviados - falhasEnvio;

  const statCards = [
    { label: "Total de alunos", value: totalAlunos.toString() },
    { label: "E-mails enviados", value: emailsEnviados.toString() },
    { label: "Falhas no envio", value: falhasEnvio.toString() },
    { label: "Pendentes", value: pendentes.toString() },
  ];

  const progressoEnvio = totalAlunos > 0 ? Math.round((emailsEnviados / totalAlunos) * 100) : 0;

  const toggleProva = (id: number) => {
    setSelectedProvas((prev) =>
      prev.includes(id) ? prev.filter((provaId) => provaId !== id) : [...prev, id]
    );
  };

  const totalAlunosSelected = provasDisponiveis
    .filter((p) => selectedProvas.includes(p.id))
    .reduce((sum, p) => sum + p.totalAlunos, 0);

  const handleEnviarNotas = () => {
    setShowModal(true);
    setEnviando(true);
    setProgresso(0);
    setConcluido(false);
  };

  useEffect(() => {
    if (enviando && progresso < 100) {
      const timer = setTimeout(() => {
        setProgresso((prev) => Math.min(prev + 10, 100));
      }, 300);
      return () => clearTimeout(timer);
    } else if (progresso === 100) {
      setEnviando(false);
      setConcluido(true);
    }
  }, [enviando, progresso]);

  const handleFecharModal = () => {
    setShowModal(false);
    setSelectedProvas([]);
    setProgresso(0);
    setConcluido(false);
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#000" }}>
            Liberação das Notas
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#575454" }}>
            Selecione as provas e envie os resultados por e-mail aos alunos
          </p>
        </div>
        <button
          onClick={handleEnviarNotas}
          disabled={selectedProvas.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            border: "1.5px solid #6B6FA3",
            color: "#6B6FA3",
            backgroundColor: "#fff",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          <PaperAirplaneIcon className="w-[15px] h-[15px]" />
          {selectedProvas.length === 0
            ? "Enviar Notas"
            : `Enviar Notas (${selectedProvas.length} ${selectedProvas.length === 1 ? "prova" : "provas"})`
          }
        </button>
      </div>

      {/* Seleção de Provas */}
      <div className="bg-white rounded-xl p-5 flex flex-col gap-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px", color: "#6B6FA3" }}>
              Selecione as Provas para Envio
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181", marginTop: "4px" }}>
              {selectedProvas.length === 0
                ? "Nenhuma prova selecionada"
                : `${selectedProvas.length} ${selectedProvas.length === 1 ? "prova selecionada" : "provas selecionadas"} • ${totalAlunosSelected} ${totalAlunosSelected === 1 ? "aluno" : "alunos"}`
              }
            </p>
          </div>
          {selectedProvas.length > 0 && (
            <button
              onClick={() => setSelectedProvas([])}
              className="px-3 py-1.5 rounded-md transition-opacity hover:opacity-70"
              style={{
                backgroundColor: "#F2F2F2",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#6A7181",
                fontWeight: 500,
              }}
            >
              Limpar seleção
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {provasDisponiveis.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#B1B4BD" }}>
                Nenhuma prova criada ainda. Crie uma prova para começar.
              </p>
            </div>
          ) : (
            provasDisponiveis.map((prova) => {
            const isSelected = selectedProvas.includes(prova.id);
            const semSubmissoes = prova.totalAlunos === 0;
            const semCorrecoes = prova.corrigidas === 0 && prova.totalAlunos > 0;
            const podeSelecionar = prova.corrigidas > 0;
            const isCompleta = prova.status === "Completa";

            return (
              <button
                key={prova.id}
                onClick={() => podeSelecionar && toggleProva(prova.id)}
                disabled={!podeSelecionar}
                className="text-left p-4 rounded-xl border-2 transition-all hover:border-opacity-70 disabled:cursor-not-allowed"
                style={{
                  borderColor: isSelected ? "#F9B233" : "#E5E7EB",
                  backgroundColor: isSelected ? "#FFFEF5" : "#FFFFFF",
                  opacity: podeSelecionar ? 1 : 0.5,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className="flex items-center justify-center rounded-md shrink-0 mt-0.5"
                    style={{
                      width: 20,
                      height: 20,
                      border: `2px solid ${isSelected ? "#F9B233" : "#D9D9D9"}`,
                      backgroundColor: isSelected ? "#F9B233" : "transparent",
                    }}
                  >
                    {isSelected && <CheckCircleIcon className="w-4 h-4" style={{ color: "#6B6FA3" }} />}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "#6B6FA3" }}>
                      {prova.nome}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginTop: "4px" }}>
                      {prova.disciplina} • {prova.turma} • {prova.totalAlunos} {prova.totalAlunos === 1 ? "aluno" : "alunos"}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {semSubmissoes && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "rgba(156,163,175,0.2)",
                            color: "#6B7280",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Sem submissões
                        </span>
                      )}
                      {semCorrecoes && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "rgba(251,191,36,0.2)",
                            color: "#D97706",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Sem correções
                        </span>
                      )}
                      {podeSelecionar && (
                        <>
                          <span
                            className="inline-block px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: isCompleta ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)",
                              color: isCompleta ? "#22C55E" : "#EF4444",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            {prova.status}
                          </span>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6A7181" }}>
                            {prova.corrigidas}/{prova.totalAlunos} corrigidas
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex flex-col gap-1" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px", color: "#6B6FA3" }}>
              {card.value}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#555" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Progress section */}
      <div className="bg-white rounded-xl p-4 flex flex-col gap-2" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center justify-between">
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#000" }}>Progresso de envio</p>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "14px", color: "#6B6FA3" }}>{progressoEnvio}%</p>
        </div>
        <div className="w-full rounded-full h-2" style={{ backgroundColor: "#E5E7EB" }}>
          <div className="h-2 rounded-full" style={{ width: `${progressoEnvio}%`, backgroundColor: "#05245F" }} />
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6A7181" }}>{emailsEnviados} de {totalAlunos} alunos notificados</p>
      </div>

      {/* Warning card - só mostra se houver pendências */}
      {pendentes > 0 && (
        <div
          className="bg-white rounded-xl p-4 flex items-center gap-3"
          style={{ border: "2px solid #F59E0B" }}
        >
          <ExclamationTriangleIcon className="w-5 h-5 shrink-0" style={{ color: "#F59E0B" }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#F59E0B" }}>
            {pendentes} {pendentes === 1 ? "aluno com correção pendente" : "alunos com correções pendentes"}
          </p>
        </div>
      )}

      {/* History card */}
      <div className="bg-white rounded-xl p-4 flex flex-col gap-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px", color: "#6B6FA3" }}>
          Histórico de Envios
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["Aluno", "Email", "Nota", "Status", "Data/Hora", "Ação"].map((col) => (
                  <th
                    key={col}
                    className="pb-2 pr-4"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "12px", color: "#6B6FA3" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F2F2F2" }}>
                  <td className="py-3 pr-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#000" }}>
                    {row.name}
                  </td>
                  <td className="py-3 pr-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
                    {row.email}
                  </td>
                  <td className="py-3 pr-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#000" }}>
                    {row.grade}
                  </td>
                  <td className="py-3 pr-4">
                    {row.status === "Enviado" ? (
                      <span
                        className="px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: "rgba(34,197,94,0.2)",
                          color: "#22C55E",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        Enviado
                      </span>
                    ) : (
                      <span
                        className="px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.15)",
                          color: "#EF4444",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        Falhou
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
                    {row.dateTime}
                  </td>
                  <td className="py-3">
                    {row.status === "Falhou" && (
                      <button
                        className="px-3 py-1 rounded-lg hover:opacity-85 transition-opacity"
                        style={{
                          border: "1px solid #6A7181",
                          color: "#6A7181",
                          backgroundColor: "transparent",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                        }}
                      >
                        ↺ Reenviar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Envio */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-md relative flex flex-col items-center gap-5"
            style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {enviando ? (
              <>
                {/* Ícone animado */}
                <div
                  className="flex items-center justify-center rounded-full animate-pulse"
                  style={{ width: 80, height: 80, backgroundColor: "#E6FAF8" }}
                >
                  <PaperAirplaneIcon className="w-10 h-10" style={{ color: "#05245F" }} />
                </div>

                {/* Título */}
                <div className="text-center">
                  <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px", color: "#6B6FA3" }}>
                    Enviando Notas...
                  </h2>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "8px" }}>
                    Enviando e-mails para {totalAlunosSelected} {totalAlunosSelected === 1 ? "aluno" : "alunos"}
                  </p>
                </div>

                {/* Barra de progresso */}
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
                      Progresso
                    </p>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "13px", color: "#05245F" }}>
                      {progresso}%
                    </p>
                  </div>
                  <div className="w-full rounded-full h-2.5" style={{ backgroundColor: "#E5E7EB" }}>
                    <div
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progresso}%`, backgroundColor: "#05245F" }}
                    />
                  </div>
                </div>

                {/* Lista de provas */}
                <div className="w-full">
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "8px" }}>
                    Provas sendo enviadas:
                  </p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {provasDisponiveis
                      .filter((p) => selectedProvas.includes(p.id))
                      .map((prova) => (
                        <div
                          key={prova.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ backgroundColor: "#F2F2F2" }}
                        >
                          <CheckCircleIcon className="w-4 h-4 shrink-0" style={{ color: "#05245F" }} />
                          <p
                            className="truncate"
                            style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6B6FA3" }}
                          >
                            {prova.nome}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : concluido ? (
              <>
                {/* Ícone de sucesso */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 80, height: 80, backgroundColor: "rgba(34,197,94,0.2)" }}
                >
                  <CheckCircleIcon className="w-12 h-12" style={{ color: "#22C55E" }} />
                </div>

                {/* Título */}
                <div className="text-center">
                  <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "22px", color: "#6B6FA3" }}>
                    Notas Enviadas!
                  </h2>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "8px" }}>
                    Os e-mails foram enviados com sucesso para {totalAlunosSelected} {totalAlunosSelected === 1 ? "aluno" : "alunos"}
                  </p>
                </div>

                {/* Resumo */}
                <div className="w-full p-4 rounded-xl" style={{ backgroundColor: "#F2F2F2" }}>
                  <div className="flex justify-between items-center mb-2">
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
                      Provas enviadas:
                    </p>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "#6B6FA3" }}>
                      {selectedProvas.length}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6A7181" }}>
                      E-mails enviados:
                    </p>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "#22C55E" }}>
                      {totalAlunosSelected}
                    </p>
                  </div>
                </div>

                {/* Botão de fechar */}
                <button
                  onClick={handleFecharModal}
                  className="w-full py-3 rounded-full transition-opacity hover:opacity-85"
                  style={{
                    backgroundColor: "#F9B233",
                    color: "#6B6FA3",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  Concluir
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
