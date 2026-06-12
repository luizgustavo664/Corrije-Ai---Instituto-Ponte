import { useState } from "react";
import { UserIcon, DocumentTextIcon, ChartBarIcon, ExclamationTriangleIcon, PencilIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { EditarAlunoModal, type AlunoData } from "./EditarAlunoModal";

interface Props {
  onBack?: () => void;
}

export function PerfilAlunoPage({ onBack }: Props): JSX.Element {
  const [showEditModal, setShowEditModal] = useState(false);
  const [alunoData, setAlunoData] = useState<AlunoData>({
    nome: "Lucas Henrique Martins",
    cpf: "123.987.456-78",
    email: "lucas.martins@estudante.edu.br",
    ingresso: "18/02/2019",
  });

  const stats = [
    { icon: DocumentTextIcon, value: "12", label: "Provas realizadas", sublabel: "Atual semestre", color: "#05245F" },
    { icon: ChartBarIcon, value: "8.7", label: "Média geral", sublabel: "Entre todas disciplinas", color: "#10B981" },
    { icon: ExclamationTriangleIcon, value: "2", label: "Pendências", sublabel: "Correções atrasadas", color: "#FF6B6B" },
    { icon: DocumentTextIcon, value: "3", label: "Provas pendentes", sublabel: "Aguardando correção", color: "#F9B233" },
  ];

  const provas = [
    { id: 1, nome: "Avaliação Final - Álgebra Linear", materia: "Matemática Aplicada", dataEnvio: "15/05/2026", nota: "9.2" },
    { id: 2, nome: "Prova Intermediária - Física II", materia: "Física", dataEnvio: "12/05/2026", nota: "8.8" },
    { id: 3, nome: "Exame Parcial - Termodinâmica", materia: "Engenharia", dataEnvio: "08/05/2026", nota: "8.5" },
    { id: 4, nome: "Teste Aplicado - Mecânica", materia: "Física Aplicada", dataEnvio: "05/05/2026", nota: "9.0" },
    { id: 5, nome: "Avaliação Diagnóstica - Resistência dos Materiais", materia: "Engenharia Civil", dataEnvio: "01/05/2026", nota: "8.3" },
    { id: 6, nome: "Prova Bimestral - Circuitos Elétricos", materia: "Engenharia Elétrica", dataEnvio: "28/04/2026", nota: "9.1" },
    { id: 7, nome: "Exame Semestral - Programação", materia: "Ciência da Computação", dataEnvio: "25/04/2026", nota: "8.9" },
    { id: 8, nome: "Avaliação Complementar - Estrutura de Dados", materia: "Algoritmos", dataEnvio: "20/04/2026", nota: "8.6" },
    { id: 9, nome: "Teste Final - Banco de Dados", materia: "Sistemas de Informação", dataEnvio: "15/04/2026", nota: "7.8" },
    { id: 10, nome: "Prova Integrada - Inteligência Artificial", materia: "Computação", dataEnvio: "10/04/2026", nota: "9.3" },
  ];

  const handleSaveEdit = (data: AlunoData) => {
    setAlunoData(data);
    console.log("Aluno atualizado:", data);
  };

  return (
    <>
      <EditarAlunoModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        initialData={alunoData}
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
          <UserIcon className="w-16 h-16" style={{ color: "#6B7280" }} />
        </div>
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "36px", color: "#6B6FA3" }}>
            Aluno
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
                {alunoData.nome}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                CPF:
              </p>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                {alunoData.cpf}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                Email:
              </p>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                {alunoData.email}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6A7181", marginBottom: "4px" }}>
                Ingresso:
              </p>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#6B6FA3", fontWeight: 500 }}>
                {alunoData.ingresso}
              </p>
            </div>
          </div>
        </div>

        {/* Provas nesse semestre */}
        <div>
          <h2
            className="mb-4"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#6B6FA3" }}
          >
            Provas nesse semestre
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
