import { useState } from "react";
import { UserGroupIcon, DocumentTextIcon, ChartBarIcon, ExclamationTriangleIcon, PencilIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { EditarProfessorModal, type ProfessorData } from "./EditarProfessorModal";

interface Props {
  onBack?: () => void;
}

export function PerfilProfessorPage({ onBack }: Props): JSX.Element {
  const [showEditModal, setShowEditModal] = useState(false);
  const [professorData, setProfessorData] = useState<ProfessorData>({
    nome: "Dr. Carlos Alberto Silva",
    cpf: "123.456.789-10",
    email: "carlos.silva@universidade.edu.br",
    ingresso: "15/03/2008",
    telefone: "11-98765-4321",
    materiaPrincipal: "Cálculo Diferencial e Integral",
  });

  const stats = [
    { icon: DocumentTextIcon, value: "18", label: "Provas publicadas", sublabel: "Atual semestre", color: "#05245F" },
    { icon: ChartBarIcon, value: "8.4", label: "Média da matéria", sublabel: "Entre todas disciplinas", color: "#10B981" },
    { icon: ExclamationTriangleIcon, value: "5", label: "Pendências", sublabel: "Correções pendentes", color: "#FF6B6B" },
    { icon: UserGroupIcon, value: "124", label: "Alunos avaliados", sublabel: "Nos últimos 30 dias", color: "#F9B233" },
  ];

  const provas = [
    { id: 1, nome: "Prova Final - Cálculo III", materia: "Cálculo Diferencial", dataEnvio: "12/05/2026", nota: "8.4" },
    { id: 2, nome: "Avaliação Parcial - Derivadas", materia: "Cálculo I", dataEnvio: "08/05/2026", nota: "7.9" },
    { id: 3, nome: "Prova Substitutiva - Integrais", materia: "Cálculo II", dataEnvio: "03/05/2026", nota: "8.6" },
    { id: 4, nome: "Teste Diagnóstico", materia: "Pré-Cálculo", dataEnvio: "28/04/2026", nota: "9.2" },
    { id: 5, nome: "Exame Semestral - Limites", materia: "Cálculo I", dataEnvio: "22/04/2026", nota: "8.1" },
    { id: 6, nome: "Prova Intermediária - Séries", materia: "Cálculo IV", dataEnvio: "15/04/2026", nota: "7.5" },
    { id: 7, nome: "Avaliação Complementar", materia: "Análise Real", dataEnvio: "10/04/2026", nota: "8.7" },
    { id: 8, nome: "Prova Recuperação", materia: "Cálculo II", dataEnvio: "05/04/2026", nota: "7.3" },
    { id: 9, nome: "Teste Aplicado - EDO", materia: "Equações Diferenciais", dataEnvio: "29/03/2026", nota: "9.1" },
    { id: 10, nome: "Prova Bimestral", materia: "Álgebra Linear", dataEnvio: "20/03/2026", nota: "8.8" },
  ];

  const handleSaveEdit = (data: ProfessorData) => {
    setProfessorData(data);
    console.log("Professor atualizado:", data);
  };

  return (
    <>
      <EditarProfessorModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        initialData={professorData}
      />
      <div className="p-8" style={{ backgroundColor: "#F2F2F2", minHeight: "100vh" }}>
        {/* Botão voltar */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg hover:bg-white transition-colors"
            style={{ color: "#6A7181" }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px" }}>Voltar</span>
          </button>
        )}

        {/* Header com avatar e nome */}
        <div className="mb-8 flex items-center gap-6">
          <div
            className="flex items-center justify-center rounded-2xl shrink-0"
            style={{ width: 120, height: 120, backgroundColor: "#E5E7EB" }}
          >
            <UserGroupIcon className="w-16 h-16" style={{ color: "#6B7280" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "36px", color: "#6B6FA3" }}>
              Professor
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 48, height: 48, backgroundColor: stat.color, opacity: 0.2 }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#6B6FA3" }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
                {stat.label}
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações cadastrais */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#6B6FA3" }}>
                Informações cadastrais
              </h2>
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "#6A7181" }}
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                  Nome:
                </p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                  {professorData.nome}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                  CPF:
                </p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                  {professorData.cpf}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                  Email:
                </p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                  {professorData.email}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                  Ingresso:
                </p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                  {professorData.ingresso}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                  Telefone:
                </p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                  {professorData.telefone}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                  Matéria Principal:
                </p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                  {professorData.materiaPrincipal}
                </p>
              </div>
            </div>
          </div>

          {/* Provas criadas */}
          <div>
            <h2
              className="mb-4"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#6B6FA3" }}
            >
              Provas criadas
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {provas.map((prova) => (
                <div key={prova.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{ width: 48, height: 48, backgroundColor: "#E5E7EB" }}
                  >
                    <DocumentTextIcon className="w-6 h-6" style={{ color: "#6B7280" }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "#6B6FA3", fontWeight: 600 }}>
                      {prova.nome}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181" }}>
                      Matéria: {prova.materia} • Data de envio: {prova.dataEnvio} • Nota: {prova.nota}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
