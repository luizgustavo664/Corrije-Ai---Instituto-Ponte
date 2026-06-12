import { useState } from "react";
import { UserGroupIcon, PlusIcon } from "@heroicons/react/24/outline";
import { NovoProfessorModal, type ProfessorData } from "./NovoProfessorModal";

export interface Professor {
  id: number;
  nome: string;
  cpf: string;
  provasCriadas: number;
}

interface Props {
  onNavigateToProfile?: (professorId: number) => void;
  professores: Professor[];
  setProfessores: React.Dispatch<React.SetStateAction<Professor[]>>;
}

export function GestaoProfessoresPage({ onNavigateToProfile, professores, setProfessores }: Props): JSX.Element {
  const [showNovoProfessorModal, setShowNovoProfessorModal] = useState(false);

  const mockAlertas = [
    "Prof. Carlos Silva com 5 provas pendentes de correção há mais de 15 dias",
    "Profª Maria Santos não enviou relatório mensal de desempenho - prazo expirado",
    "Dr. João Oliveira com 3 turmas sem notas lançadas do bimestre anterior",
    "Profª Ana Costa com pendência de documentação para renovação de contrato",
    "Dr. Ricardo Lima solicitou licença emergencial - 4 turmas precisam realocação",
    "Profª Fernanda Alves com 8 recursos de notas pendentes de análise",
    "Dr. Rafael Rocha não compareceu à reunião pedagógica obrigatória",
  ];

  const handleNovoProfessor = (data: ProfessorData) => {
    const novoProfessor = {
      id: professores.length > 0 ? Math.max(...professores.map(p => p.id)) + 1 : 1,
      nome: data.nome,
      cpf: data.cpf,
      provasCriadas: 0,
    };
    setProfessores(prev => [novoProfessor, ...prev]);
    setShowNovoProfessorModal(false);
  };

  const handleProfessorClick = (professorId: number) => {
    if (onNavigateToProfile) {
      onNavigateToProfile(professorId);
    }
  };

  return (
    <>
      <NovoProfessorModal isOpen={showNovoProfessorModal} onClose={() => setShowNovoProfessorModal(false)} onSave={handleNovoProfessor} />
    <div className="p-8" style={{ backgroundColor: "#F2F2F2", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "#6B6FA3" }}>
              Gestão de Professores
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
              Gerencie informações e dados dos professores
            </p>
          </div>
          <button
            onClick={() => setShowNovoProfessorModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: "#05245F", color: "#FFFFFF" }}
          >
            <PlusIcon className="w-5 h-5" />
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px" }}>
              Novo Professor
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
              <UserGroupIcon className="w-6 h-6" style={{ color: "#6B6FA3" }} />
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
            {professores.length}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Professores Ativos
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 48, height: 48, backgroundColor: "#05245F" }}
            >
              <UserGroupIcon className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
            42
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Provas Publicadas
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
              <UserGroupIcon className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
            {mockAlertas.length}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Alertas Institucionais
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
            Pendências dos professores
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 48, height: 48, backgroundColor: "#10B981" }}
            >
              <UserGroupIcon className="w-6 h-6" style={{ color: "#FFFFFF" }} />
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

        {/* Professores */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#6B6FA3" }}>
              Professores
            </h2>
            <button
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: "#05245F" }}
            >
              Ver todos os Professores →
            </button>
          </div>
          <div className="space-y-3">
            {professores.map((professor) => (
              <button
                key={professor.id}
                onClick={() => handleProfessorClick(professor.id)}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4 w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 48, height: 48, backgroundColor: "#E5E7EB" }}
                >
                  <UserGroupIcon className="w-6 h-6" style={{ color: "#6B7280" }} />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "#6B6FA3", fontWeight: 600 }}>
                    {professor.nome}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181" }}>
                    CPF: {professor.cpf} • {professor.provasCriadas} Provas criadas
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
