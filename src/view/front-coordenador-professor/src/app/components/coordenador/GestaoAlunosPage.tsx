import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { ConfirmDialog } from "../../../../../src/components/feedback/ConfirmDialog";
import { listAlunos, deleteAluno } from "../../../../../src/features/alunos/alunos.api";
import { listProvas } from "../../../../../src/features/provas/provas.api";
import { useAnalyticsSummary } from "../../../../../src/features/analytics/useAnalyticsSummary";

interface Props {
  onNavigateToProfile?: (alunoId: string) => void;
}

export function GestaoAlunosPage({ onNavigateToProfile }: Props): JSX.Element {
  const queryClient = useQueryClient();
  const [alunoToDelete, setAlunoToDelete] = useState<string | null>(null);
  const [showAllAlunos, setShowAllAlunos] = useState(false);

  const { data: alunos, isLoading, isError } = useQuery({
    queryKey: ["alunos"],
    queryFn: listAlunos,
    select: (result) => result.data,
  });

  const { data: provas = [] } = useQuery({
    queryKey: ["provas"],
    queryFn: listProvas,
    select: (result) => result.data,
  });

  const analytics = useAnalyticsSummary(provas);
  const alunosComCadastroPendente = (alunos ?? []).filter((aluno) => !aluno.cpf).length;
  const visibleAlunos = showAllAlunos ? alunos ?? [] : (alunos ?? []).slice(0, 10);
  const hasHiddenAlunos = (alunos?.length ?? 0) > visibleAlunos.length;

  const deleteMutation = useMutation({
    mutationFn: deleteAluno,
    onSuccess: () => {
      setAlunoToDelete(null);
      toast.success("Aluno removido com sucesso.");
      void queryClient.invalidateQueries({ queryKey: ["alunos"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Erro ao remover aluno.";
      toast.error(message);
    },
  });

  const handleDeleteAluno = (e: React.MouseEvent, alunoId: string) => {
    e.stopPropagation();
    setAlunoToDelete(alunoId);
  };

  const handleAlunoClick = (alunoId: string) => {
    if (onNavigateToProfile) {
      onNavigateToProfile(alunoId);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={!!alunoToDelete}
        title="Remover aluno?"
        description="Alunos são gerados automaticamente quando iniciam uma prova. Remova apenas registros indevidos ou duplicados."
        confirmLabel="Remover"
        isLoading={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setAlunoToDelete(null);
          }
        }}
        onConfirm={() => {
          if (alunoToDelete) {
            deleteMutation.mutate(alunoToDelete);
          }
        }}
      />
    <div className="p-8" style={{ backgroundColor: "#F2F2F2", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "#6B6FA3" }}>
              Gestão de Alunos
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
              Alunos são cadastrados automaticamente quando iniciam uma prova pelo portal público
            </p>
          </div>
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
            {isLoading ? "..." : alunos?.length ?? 0}
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
            {analytics.isLoading ? "..." : analytics.summary.inicios}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Inícios de prova
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
            Registrados pelo portal do aluno
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
            {isLoading ? "..." : alunosComCadastroPendente}
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
            {analytics.isLoading ? "..." : analytics.summary.envios}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", marginTop: "4px" }}>
            Provas enviadas
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
            Submissões finalizadas
          </p>
        </div>
      </div>

      {analytics.isError && (
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#FF6B6B", marginBottom: "16px" }}>
          Não foi possível carregar métricas de provas.
        </p>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alunos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#6B6FA3" }}>
              Alunos
            </h2>
          </div>

          {isLoading && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181" }}>
              Carregando alunos...
            </p>
          )}

          {isError && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#FF6B6B" }}>
              Erro ao carregar alunos.
            </p>
          )}

          <div className="space-y-3">
            {visibleAlunos.map((aluno) => (
              <div
                key={aluno.id}
                role="button"
                tabIndex={0}
                onClick={() => handleAlunoClick(aluno.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleAlunoClick(aluno.id);
                  }
                }}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4 w-full text-left hover:bg-gray-50 transition-colors group"
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
                    {aluno.email}{aluno.cpf ? ` • CPF: ${aluno.cpf}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteAluno(e, aluno.id)}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                  style={{ color: "#FF6B6B" }}
                  title="Remover aluno"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          {hasHiddenAlunos && (
            <button
              type="button"
              onClick={() => setShowAllAlunos(true)}
              className="mt-4 px-4 py-2 rounded-lg transition-opacity hover:opacity-85"
              style={{ backgroundColor: "#05245F", color: "#FFFFFF", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px" }}
            >
              Ver todos os alunos
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
