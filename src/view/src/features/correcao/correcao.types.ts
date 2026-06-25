export type CorrecaoQuestaoDto = {
  questaoId: string;
  ordemOriginal: number;
  pontuacaoMax: number;
  tipo: string;
  respostas: {
    total: number;
    corrigidas: number;
  };
};

export type AnexoCorrecaoDto = {
  id: string;
  urlArquivo: string;
  mimeType: string;
};

export type CorrecaoRealizadaDto = {
  id: string;
  nota: number;
  observacao: string | null;
  tipo: string;
  corrigidaEm: string | null;
};

export type CorrecaoRespostaDto = {
  respostaId: string;
  aluno: {
    id: string;
    nome: string;
  };
  respostaTexto: string | null;
  anexos: AnexoCorrecaoDto[];
  correcao: CorrecaoRealizadaDto | null;
};

export type CorrecaoSalvaDto = {
  id: string;
  nota: number;
  tipo: "manual";
  corrigidaEm: string;
};

export type CorrecaoAutomaticaDto = {
  provaId: string;
  respostasCorrigidas: number;
  discursivasPendentes: number;
};

export type SalvarCorrecaoPayload = {
  nota: number;
  observacao?: string;
  feedback?: string;
};
