import { useState } from "react";
import { UserIcon, PlusIcon } from "@heroicons/react/24/outline";
import { NovoAlunoModal, type AlunoData } from "./NovoAlunoModal";

export interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  provasFeitas: number;
  media: number;
}

interface Props {
  onNavigateToProfile?: (alunoId: number) => void;
  alunos: Aluno[];
  setAlunos: React.Dispatch<React.SetStateAction<Aluno[]>>;
}

export function GestaoAlunosPage({ onNavigateToProfile, alunos, setAlunos }: Props): JSX.Element {
  const [showNovoAlunoModal, setShowNovoAlunoModal] = useState(false);

  const mockAlertas = [
    "Lucas Martins com 3 provas sem correção há mais de 30 dias - requer ação urgente",
    "Isabela Souza não atualizou dados cadastrais após mudança de endereço obrigatória",
    "Gabriel Costa com 5 faltas consecutivas em disciplinas obrigatórias",
    "Beatriz Santos com pendência de documentação para matrícula do próximo semestre",
    "Pedro Lima solicitou trancamento emergencial - 4 disciplinas afetadas",
    "Mariana Alves com 2 recursos de notas pendentes de análise",
  ];

  const handleNovoAluno = (data: AlunoData) => {
    const novoAluno = {
      id: alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1,
      nome: data.nome,
      cpf: data.cpf,
      provasFeitas: 0,
      media: 0,
    };
    setAlunos(prev => [novoAluno, ...prev]);
    setShowNovoAlunoModal(false);
  };

  const handleAlunoClick = (alunoId: number) => {
    if (onNavigateToProfile) {
      onNavigateToProfile(alunoId);
    }
  };

  return (
    <>
      <NovoAlunoModal isOpen={showNovoAlunoModal} onClose={() => setShowNovoAlunoModal(false)} onSave={handleNovoAluno} />
    <div className="p-8" style={{ backgroundColor: "#F2F2F2", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "#6B6FA3" }}>
              Gestão de Alunos
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
              Informações cadastrais, desempenho e histórico acadêmico
            </p>
          </div>
          <button
            onClick={() => setShowNovoAlunoModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: "#05245F", color: "#FFFFFF" }}
          >
            <PlusIcon className="w-5 h-5" />
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px" }}>
              Novo Aluno
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 48, height: 48, backgroundColor: "#F9B233" }}
            >
              <UserIcon className="w-6 h-6" style={{ color: "#6B6FA3" }} />
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
            {alunos.length}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Alunos cadastrados
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 48, height: 48, backgroundColor: "#05245F" }}
            >
              <UserIcon className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
            {alunos.length}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Avaliados
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
            Nos últimos 30 dias
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 48, height: 48, backgroundColor: "#FF6B6B" }}
            >
              <UserIcon className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
            {mockAlertas.length}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Pendências de cadastro
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
            CPFs ou dados incompletos
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 48, height: 48, backgroundColor: "#10B981" }}
            >
              <UserIcon className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
            8.2
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Média institucional
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
            Atual semestre
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas */}
        <div>
          <h2
            className="mb-4"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#6B6FA3" }}
          >
            Alertas institucionais
          </h2>
          <div className="space-y-3">
            {mockAlertas.map((alerta, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: "#FEF3C7" }}
                >
                  <span style={{ fontSize: "20px" }}>⚠️</span>
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#374151", fontWeight: 500 }}>
                  {alerta}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alunos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#6B6FA3" }}>
              Alunos
            </h2>
            <button
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: "#05245F" }}
            >
              Ver todos os alunos →
            </button>
          </div>
          <div className="space-y-3">
            {alunos.map((aluno) => (
              <button
                key={aluno.id}
                onClick={() => handleAlunoClick(aluno.id)}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4 w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 48, height: 48, backgroundColor: "#E5E7EB" }}
                >
                  <UserIcon className="w-6 h-6" style={{ color: "#6B7280" }} />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "#6B6FA3", fontWeight: 600 }}>
                    {aluno.nome}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181" }}>
                    CPF: {aluno.cpf} • {aluno.provasFeitas} provas feitas • Média: {aluno.media}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}